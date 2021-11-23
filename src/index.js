import React from "react";
import ReactDOM from "react-dom";
import "./style/main.css";
import Window from "./window.js";


class App extends React.Component {
  render() {
    return (
      <div>
        <Window />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
