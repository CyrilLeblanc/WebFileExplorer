import React from "react";
import Item from "./item.js";

class Window extends React.Component {
  constructor(props) {
    console.clear();
    super(props);
    this.state = { items: [], currentPath: "/home/user/" };
    console.log(this.state);
    this.addItem("test.txt");
  }

  addItem(name) {
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
    console.log("extension : " + ext);

    // get type depending on the extension
    if (["txt", "odt"].indexOf(ext) !== -1) type = "text";
    if (["mp3"].indexOf(ext) !== -1) type = "music";
    console.log("type : " + type);

    // get path from current path
    path = this.state.currentPath.slice();

    items.push({id: id, name: name, type: type, path: path});
    this.setState({items: items});
  }

  render() {
    return (
      <div className="window">
        {this.getControlEl()}
        {this.getTopBarEl()}
        <div className="content">
          {this.state.items.map(el => {
            return <Item name={el.name} type={el.type}/>
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
        <div className="title">WebFileManager</div>
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
