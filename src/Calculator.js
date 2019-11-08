import React, { Component } from "react";
import Button from "./component/Button";
import Output from "./component/Output";
import Formula from "./component/Formula";

// Define some vars by Regx and some vars style:
const isOperator = /[x/+-]/,
  endsWithOperator = /[x/+-]$/,
  endsWithNegativeSign = /[x/+]-$/,
  clearStyle = { background: "#ac3939" },
  operatorStyle = { background: "#666666" },
  equalsStyle = {
    background: "#004466",
    position: "absolute",
    height: 130,
    bottom: 5
  };
export class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentVal: "0",
      prevVal: "0",
      formula: "",
      currentSign: "pos",
      lastClicked: "",
      evaluated: false
    };
  }

  //handle digit length
  maxDigitWarning() {
    this.setState({
      // just say the current value reached the limited Digit
      currentValue: "Digit Limit Met",
      prevVal: this.state.currentVal
    });
    //set currentValue to previousValue after 1000ms
    setTimeout(() => this.setState({ currentValue: this.state.prevVal }, 1000));
  }

  //handle the Evaluation
  handleEvaluate() {
    //when the currentValue did not reach the Limited Digit
    if (!this.state.currentVal.includes("Limit")) {
      let exp = this.state.formula; //ex: formula is 2+3/x
      while (endsWithOperator.test(exp)) {
        exp = exp.slice(0, -1);
      } //now exp is 2+3
      exp = exp.replace(/x/g, "*"); // replace x sign to * in formula
      /*
      This works for rounding to N digits (if you just want to truncate to N digits remove the Math.round call and use the Math.trunc one):
      function roundN(value, digits) {
        var tenToN = 10 ** digits;
        return (Math.round(value * tenToN)) / tenToN;
      }*/
      //Round the result to 9 decimals
      //The eval() function evaluates JavaScript code represented as a string.
      //var expression = new String('2 + 2');
      //eval(expression.toString()); // returns 4
      let answer = Math.round(1000000000 * eval(exp)) / 1000000000;
      this.setState({
        currentValue: answer.toString(),
        formula: exp.replace(/\*/g, "x").replace(/-/g, "-") + "=" + answer, //rewrite the formula to display
        prevVal: answer,
        evaluated: true
      });
    }
  }

  render() {
    return (
      <div>
        <Formula formula="+" />
        <Output currentValue="0000" />
        <Button />
      </div>
    );
  }
}

export default Calculator;
