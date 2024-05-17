import { useRef, useState } from "react";
import { ClassicPreset } from "rete";
import { getI18N } from "../../../../../../i18n";
import { getLang } from "../../../../../../i18n/utils";
import { CustomSwitch as CustomSwitchBoolean } from "./BooleanInputControl";
import { CustomTextInput } from "./TextInputControl";
import type { Options } from "./types";

const currentLocale = getLang();
const i18n = getI18N({ currentLocale });

const types = ["Text", "Boolean"];

export class VarControl extends ClassicPreset.Control {
  public value: any;
  readonly: boolean;
  inputName: string;
  type: string;
  public onChange?: (value: any) => void;

  constructor(
    public label: string,
    options: Options<any>
  ) {
    super();
    this.value = options.initial ?? "";
    this.readonly = options.readonly ?? false;
    this.inputName = options.inputName ?? "";
    this.type = options.type ?? i18n.t("Operations.text");
    this.onChange = options.change;
  }

  setValue(val: any) {
    this.value = val;
    if (this.onChange) {
      this.onChange(val);
    }
  }

  getValue(): any {
    return this.value;
  }

  setType(type: string) {
    this.type = type;
  }

  getType(): string {
    return this.type;
  }
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: "relative" as "relative",
  },
  tooltipContainer: {
    position: "relative" as "relative",
  },
  tooltip: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ccc",
    background: "var(--background-color)",
    borderRadius: "6px",
    padding: "5px",
    position: "absolute" as "absolute",
    bottom: "100%",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 1,
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    opacity: 0,
    visibility: "hidden",
    transition: "opacity 0.4s linear, visibility 0.4s linear",
  },
  tooltipVisible: {
    opacity: 1,
    visibility: "visible",
  },
  tooltipOption: {
    margin: "0 5px",
    cursor: "pointer",
    padding: "3px 6px",
    borderRadius: "4px",
  },
  selected: {
    backgroundColor: "#007bff",
    color: "white",
  },
  hover: {
    backgroundColor: "#e0e0e0",
  },
};

export function CustomVariableInput(props: { data: VarControl }) {
  const [selectedType, setSelectedType] = useState(props.data.getType());
  const [hover, setHover] = useState(false);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
  };

  const handleMouseEnter = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }
    setHover(true);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setHover(false);
    }, 200); // 200ms delay
  };

  return (
    <div style={styles.container}>
      <div style={styles.tooltipContainer}>
        {selectedType === i18n.t("Operations.text") ? (
          <CustomTextInput
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            data={props.data}
          />
        ) : (
          <CustomSwitchBoolean
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            data={props.data}
          />
        )}
      </div>
      <div
        onPointerDown={(e) => e.stopPropagation()}
        onMouseEnter={hover ? handleMouseEnter : undefined}
        onMouseLeave={hover ? handleMouseLeave : undefined}
        style={{
          ...styles.tooltip,
          ...(hover ? styles.tooltipVisible : {}),
        }}
      >
        <span>{i18n.t("Operations.type")}:</span>
        <span
          style={{
            ...styles.tooltipOption,
            ...(selectedType === i18n.t("Operations.text")
              ? styles.selected
              : {}),
          }}
          onClick={() => handleTypeChange(i18n.t("Operations.text"))}
        >
          {i18n.t("Operations.text")}
        </span>
        <span
          style={{
            ...styles.tooltipOption,
            ...(selectedType === i18n.t("Operations.boolean")
              ? styles.selected
              : {}),
          }}
          onClick={() => handleTypeChange(i18n.t("Operations.boolean"))}
        >
          {i18n.t("Operations.boolean")}
        </span>
      </div>
    </div>
  );
}

export default CustomVariableInput;
