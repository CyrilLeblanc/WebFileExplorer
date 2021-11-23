import React from "react";

class Item extends React.Component {
  render() {
    return (
      <div className="item">
        <img src={"/icons/" + this.props.type + ".svg"} alt={this.props.name}/>
        <label>test</label>
      </div>
    );
  }
}

export default Item;
