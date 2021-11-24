import React from "react";
import Item from "./item.js";

class Window extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPath: "/Documents/temp",
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
   * go through the items tree and return the right one
   */
  getItems() {
    const currentPath = ["/"].concat(this.state.currentPath.slice().split("/"));

    let items = this.state.items;
    currentPath.map((name) => {
      items.children.map((dir, i) => {
        if (dir.type === "directory" && dir.name === name) {
          items = dir;
        }
      });
    });
    console.log(items);
  }

  /**
   * handle click on items
   * @param {*} id
   */
  clickItem(id) {
    const selected = this.state.selected.slice();
    if (selected.indexOf(id) !== -1) {
      selected.splice(selected.indexOf(id), 1);
    } else {
      selected.push(id);
    }
    this.setState({ selected: selected });
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
   * Get topbar containing path and action
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
