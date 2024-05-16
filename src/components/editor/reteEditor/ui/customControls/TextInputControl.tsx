import React, { useEffect, useState } from "react";
import { ClassicPreset } from "rete";
import { getI18N } from "../../../../../i18n";
import { getLang } from "../../../../../i18n/utils";
import type { Options } from "./types";
const currentLocale = getLang();
const i18n = getI18N({ currentLocale });

export class TextControl extends ClassicPreset.Control {
  public value: string;
  readonly: boolean;
  inputName: string;
  public onChange?: (value: string) => void;

  constructor(
    public label: string,
    options: Options<string>
  ) {
    super();
    this.value = options.initial ?? "";
    this.readonly = options.readonly ?? false;
    this.inputName = options.inputName ?? "";
    this.onChange = options.change;
  }

  setValue(val: string) {
    this.value = val;
    if (this.onChange) {
      this.onChange(val);
    }
  }

  getValue(): string {
    return this.value;
  }
}

export function CustomTextInput(props: {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  data: TextControl;
}) {
  const [textValue, setTextValue] = useState(props.data.value);

  useEffect(() => {
    // Actualiza el valor del texto cuando cambia el valor del control
    setTextValue(props.data.value);
  }, [props.data.value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setTextValue(value);
    props.data.setValue(value);
    if (props.data.onChange) props.data.onChange(value);
  };

  const inputStyles = {
    cursor: props.data.readonly ? "not-allowed" : "text",
    backgroundColor: props.data.readonly
      ? "#e9ecef"
      : "var(--background-color)",
  };

  const inputFocusStyles = {
    borderColor: "orange", // Borde naranja al enfocarse
  };

  return (
    <>
      {props.data.inputName && (
        <label className="label">{props.data.inputName}</label>
      )}
      <input
        type="text"
        value={textValue}
        onChange={handleChange}
        onPointerDown={(e) => e.stopPropagation()}
        onDoubleClick={(e) => e.stopPropagation()}
        className="general"
        style={inputStyles}
        readOnly={props.data.readonly}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
        onFocus={(e) => Object.assign(e.target.style, inputFocusStyles)}
        onBlur={(e) =>
          Object.assign(e.target.style, { borderColor: "var(--border-color)" })
        }
      />
    </>
  );
}
