import React from "react";
import Item from "./item.js";
import ModalRename from "./modalRename.js";

class Window extends React.Component {
  constructor(props) {
    super(props);
    this.modalRef = React.createRef();
    this.state = {
      title: "WebFileExplorer",
      currentPath: "/",
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
              { type: "file", name: "facture.odt" },
              { type: "file", name: "test.txt" },
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
   * Allow the user to go back in directory tree
   */
  goBack() {
    if (this.state.currentPath !== "/") {
      const element = this.state.currentPath.split("/");
      let history = this.state.history.slice();
      history.push(this.state.currentPath);
      element.splice(element.length - 2, 1);
      this.setState({
        currentPath: element.join("/"),
        history: history,
      });
    }
  }

  /**
   * Allow the user to go back where he was before before clicking the "back" button
   */
  goNext() {
    if (this.state.history.length > 0) {
      this.setState({
        currentPath: this.state.history.pop(),
      });
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
    this.unselectedAll();
    this.setState({ clipboard: clipboard });
  }

  /**
   * paste element in clipboard into current directory
   */
  clickPaste() {
    let clipboard = this.state.clipboard.slice();
    clipboard.forEach((el) => {
      let alreadyPresent = false;
      this.getCurrentDir().children.forEach((item) => {
        if (item.name === el.name) {
          alreadyPresent = true;
        }
      });
      if (!alreadyPresent) {
        this.getCurrentDir().children.push(el);
      }
    });
    this.unselectedAll();
    this.forceUpdate();
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
    this.unselectedAll();
    this.forceUpdate();
  }

  /**
   * put the selected items in clipboard and delete them
   */
  clickCut() {
    this.clickCopy();
    this.clickDelete();
  }

  /**
   * display the modal to show the user a prompt to select a new name
   */
  clickRename() {
    if (this.state.selected.length > 0) {
      var str = this.state.selected.slice()[this.state.selected.length - 1];
      [].forEach.call(document.querySelectorAll(".selected"), (el) => {
        if (el.children[1].innerText !== str) {
          el.classList.remove("selected");
        }
      });
      this.setState({ selected: [str] });
      console.log(this.state.selected);
      this.modalRef.current.setup(str);
      this.modalRef.current.ref.current.style.display = "flex";
    }
  }

  /**
   * rename the given element into what the user gave in the modal.
   */
  rename(oldName, newName) {
    if (newName !== "") {
      this.getCurrentDir().children.forEach((el, i) => {
        if (el.name === oldName) {
          el.name = newName;
        }
      });
      this.unselectedAll();
      this.forceUpdate();
    }
  }

  /**
   * unselect all selected item, remove .selected css style and from the state.selected
   */
  unselectedAll() {
    this.setState({ selected: [] });
    [].forEach.call(document.querySelectorAll(".selected"), (el) => {
      el.classList.remove("selected");
    });
  }

  /**
   * return a reference of the current directory depending on the state.currentPath
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
          click={this.clickItem.bind(this)}
          doubleClick={this.doubleClickItem.bind(this)}
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
   * handle SINGLE CLICK on items :
   * add or remove the element depending if it's already in state.selected and update appearance
   */
  clickItem(name, ref) {
    const selected = this.state.selected.slice();
    ref.current.classList.toggle("selected");
    if (selected.indexOf(name) === -1) {
      selected.push(name);
    } else {
      selected.splice(selected.indexOf(name), 1);
    }
    this.setState({ selected: selected });
  }

  /**
   * handle DOUBLE CLICK on items:
   * allow user to go in the file that he double clicked
   */
  doubleClickItem(name) {
    this.unselectedAll();
    this.setState({
      selected: [],
      currentPath: this.state.currentPath + name + "/",
      history: [],
    });
  }

  render() {
    return (
      <div className="window">
        <div className="title-bar">
          <div className="title">{this.state.title}</div>
          <div className="control">
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
        </div>
        <div className="top-bar">
          <div className="search-bar">
            <input type="text" value={this.state.currentPath} disabled />
            <div className="control">
              <button onClick={this.goBack.bind(this)} title="Back">
                <img src="/icons/back.svg" alt="back" />
              </button>
              <button onClick={this.goNext.bind(this)} title="Next">
                <img src="/icons/next.svg" alt="next" />
              </button>
            </div>
          </div>
          <div className="action">
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
            <button title="Rename" onClick={this.clickRename.bind(this)}>
              <img src="/icons/rename.svg" alt="rename" />
            </button>
          </div>
        </div>
        <div className="content">{this.getItems()}</div>
        <ModalRename
          ref={this.modalRef}
          name={"test"}
          rename={this.rename.bind(this)}
        />
      </div>
    );
  }
}

export default Window;

/**
 * TODO :
 * feat : rename
 * feat : create new file or directory
 */
