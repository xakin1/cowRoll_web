import React, { useEffect, useState } from "react";
import { ClassicPreset } from "rete";

interface BooleanControlOptions {
  readonly?: boolean;
  initial?: boolean;
  change?: (value: boolean) => void;
}

class BooleanControl extends ClassicPreset.Control {
  public value: boolean;
  readonly: boolean;
  public onChange?: (value: boolean) => void;

  constructor(
    public label: string,
    options: BooleanControlOptions
  ) {
    super();
    this.value = options.initial ?? false;
    this.readonly = options.readonly ?? false;
    this.onChange = options.change;
  }

  setValue(val: boolean) {
    this.value = val;
    if (this.onChange) {
      this.onChange(val);
    }
  }

  getValue(): boolean {
    return this.value;
  }
}

export function CustomSwitch(props: { data: BooleanControl }) {
  const [selectedValue, setSelectedValue] = useState(
    props.data.value.toString()
  );

  useEffect(() => {
    // Chapuza para que re-renderice correctamente
    setSelectedValue(props.data.value.toString());
  }, [props.data.value]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value === "true";
    setSelectedValue(value.toString());
    props.data.setValue(value);
    if (props.data.onChange) props.data.onChange(value);
  };

  const selectStyles = {
    border: "1px solid #ccc",
    borderRadius: "12px",
    color: "#333",
    width: "100%",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    transition: "border-color 0.3s ease",
    outline: "none",
    cursor: props.data.readonly ? "not-allowed" : "pointer",
    backgroundColor: props.data.readonly ? "#e9ecef" : "#fff",
    appearance: props.data.readonly ? "none" : ("auto" as "none" | "auto"),
  };

  const selectFocusStyles = {
    borderColor: "#007bff",
  };

  return (
    <select
      value={selectedValue}
      onChange={handleChange}
      onPointerDown={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
      style={selectStyles}
      disabled={props.data.readonly}
      onFocus={(e) => Object.assign(e.target.style, selectFocusStyles)}
      onBlur={(e) => Object.assign(e.target.style, { borderColor: "#ccc" })}
    >
      <option value="true">true</option>
      <option value="false">false</option>
    </select>
  );
}

export default BooleanControl;
