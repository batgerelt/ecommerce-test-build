import React from "react";
import { Input, Tooltip } from "antd";

class KrillInput extends React.Component {
  onChange = (e) => {
    const { value } = e.target;
    const reg = /^-?(0|[Ө ө Ү ү А-Я а-я - _ 0-9 @ .][Ө ө Ү ү А-Я а-я - _ 0-9 @ .]*)(\.[Ө ө Ү ү А-Я а-я - _ 0-9 @ .]*)?$/;
    if ((!Number.isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      this.props.onChange(value.toUpperCase());
    }
  };

  // '.' at the end or only '-' in the input box.
  onBlur = () => {
    const { value, onBlur, onChange } = this.props;
    if (value.charAt(value.length - 1) === '.' || value === '-') {
      onChange(value.slice(0, -1));
    }
    if (onBlur) {
      onBlur();
    }
  };

  render() {
    return (
      <Input
        {...this.props}
        onChange={this.onChange}
        // onBlur={this.onBlur}
        autoComplete="off"
      />
    );
  }
}

export default KrillInput;
