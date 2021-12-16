import React from "react";

type IProps = {
  name: string;
  type: string;
  click: Function;
  doubleClick: Function;
}

class Item extends React.Component<IProps> {
  
  ref = React.createRef();

  render() {
    let ext: string = this.props.name.split(".")[(this.props.name.split(".")).length - 1];
    let type: string = "none";
    if (["txt", "odt"].indexOf(ext) !== -1) type = "text";
    if (["mp3"].indexOf(ext) !== -1) type = "music";
    if (["png", "jpeg", "gif"].indexOf(ext) !== -1) type = "image";
    if (this.props.type === "directory") type = "directory";

    return (
      <div
        className="item"
        ref={this.ref as React.LegacyRef<HTMLDivElement>}
        onClick={this.handleClick.bind(this)}
        onDoubleClick={this.handleDoubleClick.bind(this)}
      >
        <img src={"/icons/" + type + ".svg"} alt={this.props.name} />
        <label>{this.props.name}</label>
      </div>
    );
  }

  handleClick() {
    this.props.click(this.props.name, this.ref);
  }

  handleDoubleClick() {
    if (this.props.type === "directory") {
      this.props.doubleClick(this.props.name, this.ref);
    }
  }
}

export default Item;
