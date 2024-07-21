import React, { useEffect, useState } from "react";
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
    { name: "Solid", style: "solid" },
    { name: "Dotted", style: "dotted" },
    { name: "Dashed", style: "dashed" },
    { name: "Double", style: "double" },
    { name: "Groove", style: "groove" },
    { name: "Ridge", style: "ridge" },
    { name: "Inset", style: "inset" },
    { name: "Outset", style: "outset" },
    { name: "None", style: "none" },
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
