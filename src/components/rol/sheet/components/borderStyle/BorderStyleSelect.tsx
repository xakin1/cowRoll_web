import React, { useEffect, useState } from "react";
import i18n from "../../../../../i18n/i18n";
import "./borderStyle.css";

interface BorderStyleSelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<{ name: string; value: string }>) => void;
}

const BorderStyleSelect: React.FC<BorderStyleSelectProps> = ({
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [border, setBorder] = useState(value);

  useEffect(() => {
    setBorder(value);
  }, [value]);

  const handleSelect = (borderStyle: string) => {
    const event = {
      target: { name: "borderStyle", value: borderStyle },
    } as React.ChangeEvent<{ name: string; value: string }>;
    onChange(event);
    setIsOpen(false);
  };

  const styles = [
    { name: i18n.t("Roll.Sheet.Styles.solid"), style: "solid" },
    { name: i18n.t("Roll.Sheet.Styles.dotted"), style: "dotted" },
    { name: i18n.t("Roll.Sheet.Styles.dashed"), style: "dashed" },
    { name: i18n.t("Roll.Sheet.Styles.double"), style: "double" },
    { name: i18n.t("Roll.Sheet.Styles.groove"), style: "groove" },
    { name: i18n.t("Roll.Sheet.Styles.ridge"), style: "ridge" },
    { name: i18n.t("Roll.Sheet.Styles.inset"), style: "inset" },
    { name: i18n.t("Roll.Sheet.Styles.outset"), style: "outset" },
    { name: i18n.t("Roll.Sheet.Styles.none"), style: "none" },
  ];

  return (
    <div className="border-style-select">
      <div className="select-header" onClick={() => setIsOpen(!isOpen)}>
        {value}
        <div
          style={{
            borderBottom: `2px ${border} black`,
            marginTop: "5px",
          }}
        ></div>
      </div>
      {isOpen && (
        <div className="select-options">
          {styles.map(({ name, style }) => (
            <div
              key={style}
              className="select-option"
              onClick={() => handleSelect(style)}
            >
              {name}
              <div
                style={{
                  borderBottom: `2px ${style} black`,
                  marginTop: "5px",
                }}
              ></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BorderStyleSelect;
