import React, { Component } from "react";
import Button from "./component/Button";
import Output from "./component/Output";
import Formula from "./component/Formula";
export class Calculator extends Component {
  render() {
    return (
      <div>
        <Formula />
        <Output />
        <Button />
      </div>
    );
  }
}

export default Calculator;
