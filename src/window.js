import React from "react";
import Item from "./item.js";

class Window extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPath: "/",
      mode: "navigation", // "navigation" | "selection"
      selected: [],
      clipboard: [],
      history: [],
      items: {
        type: "directory",
        name: "/",
        children: [
          {
            type: "directory",
            name: "Documents",
            children: [
              { type: "file", name: "facture.odt" },
              { type: "file", name: "test.txt" },
              {
                type: "directory",
                name: "temp",
                children: [
                  { type: "directory", name: "finale", children: [] },
                  { type: "file", name: "re.odt" },
                  { type: "file", name: "ie.odt" },
                  { type: "file", name: "za.odt" },
                ],
              },
            ],
          },
          {
            type: "directory",
            name: "Images",
            children: [],
          },
          {
            type: "directory",
            name: "Videos",
            children: [],
          },
          { type: "file", name: "test.odt" },
        ],
      },
    };
  }

  /**
   * Allow the user to switch mode between "selection" and "navigation" mode.
   */
  switchMode() {
    if (this.state.mode === "selection") {
      this.setState({ mode: "navigation" });
      this.setState({ selected: [] });
      [].forEach.call(document.querySelectorAll(".selected"), (el) => {
        el.classList.remove("selected");
      });
    } else if (this.state.mode === "navigation") {
      this.setState({ mode: "selection" });
    }
  }

  /**
   * Allow the user to go back in directory tree
   */
  goBack() {
    if (this.state.currentPath !== "/") {
      const element = this.state.currentPath.split("/");
      element.splice(element.length - 2, 1);
      this.setState({ currentPath: element.join("/") });
    }
  }

  /**
   * put selected element in clipboard
   */
  clickCopy() {
    let clipboard = this.state.clipboard.splice();
    this.state.selected.forEach((name) => {
      clipboard.push(this.getItem(name));
    });
    this.setState({ clipboard: clipboard });
    this.switchMode();
  }

  /**
   * paste element in clipboard into current directory
   */
  clickPaste() {
    let clipboard = this.state.clipboard.slice();
    clipboard.forEach((el) => {
      this.getCurrentDir().children.forEach((item) => {
        if (item.name === el.name) {
          el.name += "(1)";
        }
      });
      this.getCurrentDir().children.push(el);
    });
    this.forceUpdate();
    this.switchMode();
  }

  /**
   * delete selected items in current directory
   */
  clickDelete() {
    let children = this.getCurrentDir().children;
    this.state.selected.forEach((item) => {
      children.splice(
        children.findIndex((el) => {
          return el.name === item;
        }),
        1
      );
    });
    this.forceUpdate();
    this.switchMode();
  }

  /**
   * put the selected items in clipboard and delete them
   */
  clickCut() {
    this.clickCopy();
    this.clickDelete();
    this.switchMode();
  }

  /**
   * return the current directory depending on the currentPath
   */
  getCurrentDir() {
    const currentPath = ["/"].concat(this.state.currentPath.slice().split("/"));
    let items = this.state.items;
    currentPath.map((name) => {
      items.children.map((dir, i) => {
        if (dir.type === "directory" && dir.name === name) {
          items = dir;
        } else {
          return null;
        }
        return null;
      });
      return null;
    });
    return items;
  }

  /**
   * return the item depending on the current directory and the name of the item
   */
  getItem(name) {
    let temp = null;
    this.getCurrentDir().children.forEach((item) => {
      if (item.name === name) {
        temp = item;
      }
    });
    return temp;
  }

  /**
   * return list of <Item> depending of the current directory
   */
  getItems() {
    let items = [];
    this.getCurrentDir().children.map((el) => {
      items.push(
        <Item
          name={el.name}
          type={el.type}
          clickItem={this.clickItem.bind(this)}
        />
      );
      return null;
    });
    if (items.length === 0) {
      return <small>Empty Directory.</small>;
    }
    return items;
  }

  /**
   * handle click on items :
   * add or remove the element depending if it's already in state.selected and update appearance
   */
  clickItem(name, type, ref) {
    const selected = this.state.selected.slice();
    if (this.state.mode === "selection") {
      ref.current.classList.toggle("selected");
      if (selected.indexOf(name) === -1) {
        selected.push(name);
      } else {
        selected.splice(selected.indexOf(name), 1);
      }
      this.setState({ selected: selected });
    } else if (this.state.mode === "navigation" && type === "directory") {
      this.setState({ selected: [] });
      this.setState({ currentPath: this.state.currentPath + name + "/" });
    }
  }

  render() {
    return (
      <div className="window">
        <div className="control">
          <div className="right">
            <button>
              <img src="/icons/down.svg" alt="down" />
            </button>
            <button>
              <img src="/icons/expand.svg" alt="expand" />
            </button>
            <button>
              <img src="/icons/close.svg" alt="close" />
            </button>
          </div>
          <div className="title">WebFileExplorer</div>
        </div>
        <div className="topbar">
          <div className="searchbar">
            <input type="text" value={this.state.currentPath} disabled />
            <button onClick={this.goBack.bind(this)} title="Back">
              <img src="/icons/back.svg" alt="back" />
            </button>
            <button title="Next">
              <img src="/icons/next.svg" alt="next" />
            </button>
          </div>
          <div className="action">
            <small>Mode : </small>
            <button onClick={this.switchMode.bind(this)}>
              {this.state.mode}
            </button>
            <button title="Copy" onClick={this.clickCopy.bind(this)}>
              <img src="/icons/copy.svg" alt="copy" />
            </button>
            <button title="Paste" onClick={this.clickPaste.bind(this)}>
              <img src="/icons/paste.svg" alt="paste" />
            </button>
            <button title="Delete" onClick={this.clickDelete.bind(this)}>
              <img src="/icons/delete.svg" alt="delete" />
            </button>
            <button title="Cut" onClick={this.clickCut.bind(this)}>
              <img src="/icons/cut.svg" alt="cut" />
            </button>
            <button
              title="Rename"
              onClick={() => {
                console.log(this.state);
              }}
            >
              <img src="/icons/rename.svg" alt="rename" />
            </button>
          </div>
        </div>
        <div className="content">{this.getItems()}</div>
      </div>
    );
  }
}

export default Window;

/**
 * TODO :
 * fix  : clipboard must contain elements and not paths
 * feat : make the window take all the space
 * feat : next button
 * feat : rename
 * feat : review CSS
 */
