import React from "react";

class Item extends React.Component {
  constructor(props){
    super(props);
    this.ref = React.createRef();
  }

  render() {
    // get name and extension from full path of file
    let name = this.props.path.replace(/^.*[\\\/]/, "");
    let ext = /[^.]+$/.exec(this.props.path)[0];
    let type = "none";

    if (["txt", "odt"].indexOf(ext) !== -1) type = "text";
    if (["mp3"].indexOf(ext) !== -1) type = "music";
    if (["png", "jpeg", "gif"].indexOf(ext) !== -1) type = "image";

    return (
      <div className="item" ref={this.ref} onClick={this.handleClick.bind(this)}>
        <img src={"/icons/" + type + ".svg"} alt={name} />
        <label>{name}</label>
      </div>
    );
  }

  handleClick(){
    

    this.ref.current.classList.toggle("selected")
  }
}

export default Item;
