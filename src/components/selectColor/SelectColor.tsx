import React from "react";
import "./selectCode.css";

interface ColorSelectorProps {
  value: string; // Can be hex or RGB
  label: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Changed type
  onRemove?: () => void;
  onFocus?: (...args: any[]) => void;
  onBlur?: (...args: any[]) => void;
}

// Utility function to convert RGB to Hex
const rgbToHex = (rgb: string): string => {
  const result = rgb.match(/\d+/g);
  if (!result || result.length !== 3) return rgb;
  return `#${result.map((x) => parseInt(x, 10).toString(16).padStart(2, "0")).join("")}`;
};

// Utility function to convert Hex to RGB
const hexToRgb = (hex: string): string => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (_m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`
    : hex;
};

const ColorSelector: React.FC<ColorSelectorProps> = ({
  value,
  label,
  name,
  onChange,
  onRemove,
  onFocus,
  onBlur,
}) => {
  // Convert the initial value to Hex if it's in RGB
  const hexValue = value.startsWith("#") ? value : rgbToHex(value);

  // Handle the change event, converting Hex to RGB if needed
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hexColor = e.target.value;
    const rgbColor = hexToRgb(hexColor);

    // Create a synthetic event and call onChange with it
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        name,
        value: rgbColor,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange(syntheticEvent);
  };

  return (
    <>
      <label className="label">{label}</label>
      <input
        onFocus={onFocus}
        onBlur={onBlur}
        type="color"
        name={name}
        value={hexValue}
        onChange={handleChange}
      />
      {onRemove && (
        <button className="icon-button" onClick={onRemove}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icon-tabler-x"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
          </svg>
        </button>
      )}
    </>
  );
};

export default ColorSelector;
