import React from "react";
import Item from "./item.js";

class Window extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPath: "/",
      mode: "selection", // "navigation" | "selection"
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
    if(items.length === 0){
      return <small>Empty Directory.</small>
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

  /**
   * Get control bar of window
   * @returns element
   */
  getControlEl() {
    return (
      <div className="control">
        <div className="right">
          <button>_</button>
          <button>[]</button>
          <button>X</button>
        </div>
        <div className="title">WebFileExplorer</div>
      </div>
    );
  }

  /**
   * Get topbar containing path and action bar
   * @returns element
   */
  getTopBarEl() {
    return (
      <div className="topbar">
        <div className="searchbar">
          <input type="text" value={this.state.currentPath} />
          <button>before</button>
          <button>next</button>
        </div>
        <div className="action">
          <button>copy</button>
          <button>paste</button>
          <button>delete</button>
          <button>cut</button>
          <button>rename</button>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="window">
        {this.getControlEl()}
        {this.getTopBarEl()}
        <div className="content">{this.getItems()}</div>
      </div>
    );
  }
}

export default Window;

/**
 * TODO :
 * bug : selected css class when click in "navigation" mode
 * bug : name of file concat to path when clicked in "navigation" mode start
 */
