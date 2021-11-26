import React from "react";

class Item extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  render() {
    let ext = this.props.name.split(".");
    ext = ext[ext.length - 1];
    let type = "none";
    if (["txt", "odt"].indexOf(ext) !== -1) type = "text";
    if (["mp3"].indexOf(ext) !== -1) type = "music";
    if (["png", "jpeg", "gif"].indexOf(ext) !== -1) type = "image";
    if (this.props.type === "directory") type = "directory";

    return (
      <div
        className="item"
        ref={this.ref}
        onClick={this.handleClick.bind(this)}
      >
        <img src={"/icons/" + type + ".svg"} alt={this.props.name} />
        <label>{this.props.name}</label>
      </div>
    );
  }

  handleClick() {
    this.props.clickItem(this.props.name, this.props.type, this.ref);
  }
}

export default Item;
