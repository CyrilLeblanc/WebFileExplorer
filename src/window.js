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
                children: [{ type: "directory", name: "finale", children: [] }],
              },
            ],
          },
          {
            type: "directory",
            name: "Images",
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
    } else if (this.state.mode === "navigation") {
      this.setState({ mode: "selection" });
    }
  }

  /**
   * Allow the user to go back in directory tree
   */
  goBack(){
    if (this.state.currentPath !== "/"){
      const element = this.state.currentPath.split("/");
      element.splice(element.length-2, 1)
      this.setState({currentPath: element.join('/')})
    }
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
   * @param String name
   */
  clickItem(name, type, ref) {
    const selected = this.state.selected.slice();
    if (this.state.mode === "selection" && type === "file") {
      ref.current.classList.toggle("selected");
      const path = this.state.currentPath + name;
      if (selected.indexOf(path) === -1) {
        selected.push(path);
      } else {
        selected.splice(selected.indexOf(path), 1);
      }

      this.setState({ selected: selected });
    } else if (this.state.mode === "navigation" && type === "directory") {
      this.setState({ currentPath: this.state.currentPath + name + "/" });
    }
  }

  render() {
    return (
      <div className="window">
        <div className="control">
          <div className="right">
            <button>_</button>
            <button>[]</button>
            <button>X</button>
          </div>
          <div className="title">WebFileExplorer</div>
        </div>
        <div className="topbar">
          <div className="searchbar">
            <input type="text" value={this.state.currentPath} disabled />
            <button onClick={this.goBack.bind(this)}>back</button>
            <button>next</button>
          </div>
          <div className="action">
            <small>Mode : </small>
            <button onClick={this.switchMode.bind(this)}>
              {this.state.mode}
            </button>
            <button>copy</button>
            <button>paste</button>
            <button>delete</button>
            <button>cut</button>
            <button>rename</button>
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
 * feat : back and next button
 * feat : clipboard (when click on copy)
 * feat : paste
 * feat : delete
 * feat : rename
 * feat : cut
 * feat : review CSS
 * feat : window gesture (in control bar)
 */
