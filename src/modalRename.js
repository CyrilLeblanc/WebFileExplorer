import React from "react";

class ModalRename extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.ref = React.createRef();
  }

  setup(name) {
    this.oldName = name;
    this.inputRef.current.value = name;
    this.inputRef.current.focus();
  }

  render() {
    return (
      <div className="modal-container" ref={this.ref}>
        <div className="modal">
          <h2>Rename {this.name} to :</h2>
          <input type="text" ref={this.inputRef}></input>
          <div className="control">
            <button
              onClick={() => {
                this.ref.current.style.display = "none";
                this.props.rename(this.oldName, this.inputRef.current.value);
              }}
            >
              Accept
            </button>
            <button onClick={() => {
              this.ref.current.style.display = "none";
            }}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }
}

export default ModalRename;
