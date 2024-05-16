import React, { useEffect, useState } from "react";
import { ClassicPreset } from "rete";
import { getI18N } from "../../../../../i18n";
import { getLang } from "../../../../../i18n/utils";
import type { Options } from "./types";

const currentLocale = getLang();
const i18n = getI18N({ currentLocale });

class BooleanControl extends ClassicPreset.Control {
  public value: boolean;
  readonly: boolean;
  inputName: string;
  type?: string;
  public onChange?: (value: boolean) => void;

  constructor(
    public label: string,
    options: Options<boolean>
  ) {
    super();
    this.value = options.initial ?? false;
    this.readonly = options.readonly ?? false;
    this.inputName = options.inputName ?? "";
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

export function CustomSwitch(props: {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  data: BooleanControl;
}) {
  const [selectedValue, setSelectedValue] = useState(
    props.data.value.toString()
  );

  useEffect(() => {
    // Actualiza el valor seleccionado cuando cambia el valor del control
    setSelectedValue(props.data.value.toString());
  }, [props.data.value]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value === "true";
    setSelectedValue(value.toString());
    props.data.setValue(value);
    if (props.data.onChange) props.data.onChange(value);
  };

  const selectStyles = {
    cursor: props.data.readonly ? "not-allowed" : "pointer",
    backgroundColor: props.data.readonly ? "#e9ecef" : "#fff",
    appearance: props.data.readonly ? "none" : ("auto" as "none" | "auto"),
  };

  const selectFocusStyles = {
    borderColor: "#007bff",
  };

  return (
    <>
      {props.data.inputName && (
        <label className="label">{props.data.inputName}</label>
      )}
      <select
        value={selectedValue}
        onChange={handleChange}
        onPointerDown={(e) => e.stopPropagation()}
        onDoubleClick={(e) => e.stopPropagation()}
        className="general"
        style={selectStyles}
        disabled={props.data.readonly}
        onFocus={(e) => Object.assign(e.target.style, selectFocusStyles)}
        onBlur={(e) => Object.assign(e.target.style, { borderColor: "#ccc" })}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
      >
        <option value="true">{i18n.t("Operations.true")}</option>
        <option value="false">{i18n.t("Operations.false")}</option>
      </select>
    </>
  );
}

export default BooleanControl;
