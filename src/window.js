import React from "react";
import Item from "./item.js";

class Window extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        { id: 0, path: "/home/user/photo de vacances.jpeg" },
        { id: 1, path: "/home/user/random.txt" },
        { id: 2, path: "/home/user/facture.txt" },
        { id: 3, path: "/home/user/sans extension" },
        { id: 4, path: "/home/user/test.txt" },
        { id: 5, path: "/home/user/test.txt" },
        { id: 6, path: "/home/user/test.txt" },
        { id: 7, path: "/home/user/test.txt" },
        { id: 8, path: "/home/user/test.txt" },
        { id: 9, path: "/home/user/test.txt" },
        { id: 10, path: "/home/user/test.txt" },
        { id: 11, path: "/home/user/test.txt" },
      ],
      currentPath: "/home/user/",
      selected: [],
      clipboard: [],
    };
  }

  createItem(name) {
    const items = this.state.items.slice();
    let id, type, path;

    // get max id in items + 1
    id =
      Math.max.apply(
        Math,
        items.map((o) => {
          return o.id;
        })
      ) + 1;

    // get extension from filename
    let ext = /(?:\.([^.]+))?$/.exec(name)[1];

    // get type depending on the extension
    if (["txt", "odt"].indexOf(ext) !== -1) type = "text";
    if (["mp3"].indexOf(ext) !== -1) type = "music";

    // get path from current path
    path = this.state.currentPath.slice();

    return { id: id, name: name, type: type, path: path };
  }

  addItem(name) {
    const items = this.state.items.slice();

    items.push(this.createItem(name));
    this.setState({ items: items });
  }

  render() {
    return (
      <div className="window">
        {this.getControlEl()}
        {this.getTopBarEl()}4
        <div className="content">
          {this.state.items.map((el) => {
            // get item that are only in this path
            if (
              this.state.currentPath ===
              el.path.substring(0, el.path.lastIndexOf("/")) + "/"
            ) {
              return <Item path={el.path} />;
            }
          })}
        </div>
      </div>
    );
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
          <input type="text" id="searchbar" value={this.state.currentPath} />
          <button id="before">before</button>
          <button id="next">next</button>
        </div>
        <div className="action">
          <button id="copy">copy</button>
          <button id="paste">paste</button>
          <button id="delete">delete</button>
          <button id="cut">cut</button>
          <button id="rename">rename</button>
        </div>
      </div>
    );
  }
}

export default Window;
