import React, { Component } from "react";
import Button from "./component/Button";
import Output from "./component/Output";
import Formula from "./component/Formula";
import ReactFCCtest from "react-fcctest";
// Define some vars by Regx and some vars style:
const isOperator = /[x/+-]/,
  endsWithOperator = /[x/+-]$/,
  endsWithNegativeSign = /[x/+]-$/,
  maxNumberLength = 21;
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
    this.maxDigitWarning = this.maxDigitWarning.bind(this);
    this.handleOperators = this.handleOperators.bind(this);
    this.handleEvaluate = this.handleEvaluate.bind(this);
    this.initialize = this.initialize.bind(this);
    this.handleDecimal = this.handleDecimal.bind(this);
    this.handleNumbers = this.handleNumbers.bind(this);
  }

  //handle digit length
  maxDigitWarning() {
    this.setState({
      // just say the current value reached the limited Digit
      currentValue: "Digit Limit Met",
      prevVal: this.state.currentVal
    });
    //set currentValue to previousValue after 1000ms
    setTimeout(() => this.setState({ currentValue: this.state.prevVal }), 1000);
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
      let answer = Math.round(1000000000000 * eval(exp)) / 1000000000000;
      this.setState({
        currentVal: answer.toString(),
        formula: exp.replace(/\*/g, "x").replace(/-/g, "-") + "=" + answer, //rewrite the formula to display
        prevVal: answer,
        evaluated: true
      });
    }
  }

  handleOperators(e) {
    if (!this.state.currentVal.includes("Limit")) {
      const value = e.target.value;
      const { formula, prevVal, evaluated } = this.state;
      this.setState({ currentVal: value, evaluated: false });
      console.log(this.state.currentVal);
      if (evaluated) {
        // when click '=' and then evaluated: true
        this.setState({ formula: prevVal + value }); // prevVal: '4', value = '/' ->>> formula: '4/'
      } else if (!endsWithOperator.test(formula)) {
        // formula: '4/5'
        this.setState({
          prevVal: formula, // prevVal: '4/5'
          formula: formula + value // value: '*' ->> formula: '4/5*'
        });
      } else if (!endsWithNegativeSign.test(formula)) {
        // example: prevVal: '5/5' and formula: '5/5*'
        this.setState({
          formula:
            (endsWithNegativeSign.test(formula + value) ? formula : prevVal) +
            value // value: '-' ->> endsWithNagetiveSign.test('5/5*-') return true, so formula will be '5/5*' + '-' and else, value: '+' then formula is change form '5/5*' to '5/5+'
        });
      } else if (value !== "-") {
        this.setState({
          formula: prevVal + value
        });
      }
    }
  }

  handleNumbers(e) {
    if (!this.state.currentVal.includes("Limit")) {
      const { currentVal, formula, evaluated } = this.state;
      const value = e.target.value;
      this.setState({ evaluated: false });
      if (currentVal.length > maxNumberLength) {
        this.maxDigitWarning();
      } else if (evaluated) {
        this.setState({
          currentVal: value,
          formula: value !== "0" ? value : ""
        });
      } else {
        this.setState({
          currentVal:
            currentVal === "0" || isOperator.test(currentVal)
              ? value
              : currentVal + value,
          formula:
            currentVal === "0" && value === "0"
              ? formula
              : /([^.0-9]0)$/.test(formula)
              ? formula.slice(0, -1) + value
              : formula + value
        });
      }
    }
  }

  handleDecimal() {
    if (this.state.evaluated === true) {
      this.setState({
        currentVal: "0.",
        formula: "0.",
        evaluated: false
      });
    } else if (
      !this.state.currentVal.includes(".") &&
      !this.state.currentVal.includes("Limit")
    ) {
      this.setState({ evaluated: false });
      if (this.state.currentVal.length > 21) {
        this.maxDigitWarning();
      } else if (
        endsWithOperator.test(this.state.formula) ||
        (this.state.currentVal === "0" && this.state.formula === "")
      ) {
        this.setState({
          currentVal: "0.",
          formula: this.state.formula + "0."
        });
      } else {
        this.setState({
          formula: this.state.formula + ".",
          currentVal: this.state.formula.match(/(-?\d+\.?\d*)$/)[0] + "." // ex: formula: 4 - 5 = -1 ->> currentVal: -1. or 6 / 2 = 3 ->> currentVal: 3.
        });
      }
    }
  }

  initialize() {
    this.setState({
      currentVal: "0",
      prevVal: "0",
      formula: "",
      currentSign: "pos",
      lastClicked: "",
      evaluated: false
    });
  }

  render() {
    return (
      <div className="calculator">
        <Formula formula={this.state.formula} />
        <Output currentValue={this.state.currentVal} />
        <Button
          decimal={this.handleDecimal}
          evaluate={this.handleEvaluate}
          initialize={this.initialize}
          numbers={this.handleNumbers}
          operators={this.handleOperators}
        />
        <ReactFCCtest />
      </div>
    );
  }
}

export default Calculator;
