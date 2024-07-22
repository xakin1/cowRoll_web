import {
  faAlignCenter,
  faAlignLeft,
  faAlignRight,
  faArrowDown,
  faArrowUp,
  faGripLinesVertical,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState, type ChangeEvent } from "react";
import i18n from "../../../i18n/i18n";
import { rgbToHex } from "../../../utils/functions/utils";
import BorderStyleSelect from "./components/borderStyle/BorderStyleSelect";
import SelectColor from "./components/selectColor/SelectColor";
import "./styles.css";
import type { Field } from "./types";

interface PropertiesPanelProps {
  selectedElement: Field | null;
  onUpdate: (name: string, value: string | number) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedElement,
  onUpdate,
}) => {
  const [width, setwidth] = useState<string>("");
  const [height, setheight] = useState<string>("");
  const [opacity, setOpacity] = useState<string>("1");
  const [rotate, setRotate] = useState<string>("0");
  const [scale, setScale] = useState<string>("1");
  const [xPosition, setXPosition] = useState<string>("0");
  const [yPosition, setYPosition] = useState<string>("0");
  const [borderColor, setBorderColor] = useState<string>("#000000");
  const [backgroundColor, setBackgroundColor] = useState<string>("transparent");
  const [borderWidth, setBorderWidth] = useState<string>("1");
  const [borderStyle, setBorderStyle] = useState<string>("solid");
  const [borderRadius, setBorderRadius] = useState<string>("0");

  const previousElementRef = useRef<Field | null>(null);
  const propertiesPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      selectedElement &&
      selectedElement.id !== previousElementRef.current?.id
    ) {
      setwidth(getSizeValue(selectedElement.style?.width));
      setheight(getSizeValue(selectedElement.style?.height));
      setXPosition(getSizeValue(selectedElement.style?.left));
      setYPosition(getSizeValue(selectedElement.style?.top));
      setOpacity(selectedElement.style?.opacity || "1");
      const transform = selectedElement.style?.transform || "";
      const rotateMatch = transform.match(/rotate\(([^)]+)\)/);
      setScale(selectedElement.style?.scale || "1");
      if (rotateMatch) {
        setRotate(rotateMatch[1].replace("deg", ""));
      } else {
        setRotate("0");
      }
      const borderColor = selectedElement.style?.borderTopColor || "#000000";
      const backgroundColor =
        selectedElement.style?.backgroundColor || "transparent";
      setBorderColor(rgbToHex(borderColor));
      setBackgroundColor(rgbToHex(backgroundColor));
      setBorderWidth(
        selectedElement.style?.borderTopWidth?.replace("px", "") || "1"
      );
      setBorderStyle(selectedElement.style?.borderTopStyle || "solid");
      setBorderRadius(
        selectedElement.style?.borderTopLeftRadius?.replace("px", "") || "0"
      );

      previousElementRef.current = selectedElement;
    }
  }, [selectedElement]);

  const handleChange = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | React.ChangeEvent<{ name: string; value: string }>
  ) => {
    const { name, value } = e.target;

    switch (name) {
      case "width":
        setwidth(value);
        onUpdate(name, `${value}px`);
        break;
      case "height":
        setheight(value);
        onUpdate(name, `${value}px`);
        break;
      case "opacity":
        setOpacity(value);
        onUpdate(name, value);
        break;
      case "rotate":
        setRotate(value);
        updateTransform("rotate", value);
        break;
      case "scale":
        setScale(value);
        onUpdate(name, value);
        break;
      case "xPosition":
        setXPosition(value);
        onUpdate("left", `${value}px`);
        break;
      case "yPosition":
        setYPosition(value);
        onUpdate("top", `${value}px`);
        break;
      case "borderColor":
        setBorderColor(value);
        onUpdate(name, value);
        break;
      case "backgroundColor":
        setBackgroundColor(value);
        onUpdate(name, value);
        break;
      case "borderWidth":
        setBorderWidth(value);
        onUpdate(name, `${value}px`);
        break;
      case "borderStyle":
        setBorderStyle(value);
        onUpdate(name, value);
        break;
      case "borderRadius":
        setBorderRadius(value);
        onUpdate(name, `${value}px`);
        break;
      default:
        onUpdate(name, value);
        break;
    }
  };

  const handleRemoveBackground = () => {
    onUpdate("backgroundColor", "transparent");
  };

  const handleRemoveBorder = () => {
    onUpdate("border", "none");
  };

  const updateTransform = (type: string, value1: string) => {
    const newRotate = type === "rotate" ? value1 : rotate;
    const transform = `rotate(${newRotate}deg)`;

    onUpdate("transform", transform);
  };

  const getSizeValue = (size: string | number | undefined): string => {
    if (size && typeof size === "string") {
      return parseInt(size.replace("px", ""), 10).toString();
    }
    return size?.toString() || "";
  };

  const handleAlignment = (alignment: string) => {
    // Handle alignment logic here
  };

  return (
    <div className="properties-panel" ref={propertiesPanelRef}>
      <h3>{i18n.t("Rol.Sheet.Style.properties")}</h3>
      <div className="property-field">
        <label>{i18n.t("Rol.Sheet.Style.rotate")}:</label>
        <input
          type="number"
          name="rotate"
          value={rotate}
          onChange={handleChange}
        />
      </div>
      <div className="property-field">
        <label>{i18n.t("Rol.Sheet.Style.scale")}:</label>
        <input
          type="number"
          name="scale"
          value={scale}
          onChange={handleChange}
        />
      </div>
      <div className="property-field">
        <label>{i18n.t("Rol.Sheet.Style.width")}:</label>
        <input
          type="number"
          name="width"
          value={width}
          onChange={handleChange}
        />
      </div>
      <div className="property-field">
        <label>{i18n.t("Rol.Sheet.Style.height")}:</label>
        <input
          type="number"
          name="height"
          value={height}
          onChange={handleChange}
        />
      </div>

      <div className="property-field">
        <label>{i18n.t("Rol.Sheet.Style.opacity")}:</label>
        <input
          type="number"
          name="opacity"
          value={opacity}
          onChange={handleChange}
          step={0.1}
          min={0}
          max={1}
        />
      </div>
      <div className="property-field">
        <SelectColor
          value={backgroundColor}
          name={"backgroundColor"}
          label={`${i18n.t("Rol.Sheet.Style.backgroundColor")}:`}
          onChange={handleChange}
          onRemove={handleRemoveBackground}
        ></SelectColor>
      </div>
      <div className="property-field">
        <SelectColor
          value={borderColor}
          name={"borderColor"}
          label={`${i18n.t("Rol.Sheet.Style.borderColor")}:`}
          onChange={handleChange}
          onRemove={handleRemoveBorder}
        ></SelectColor>
      </div>
      <div className="property-field">
        <label>{i18n.t("Rol.Sheet.Style.borderWidth")}:</label>
        <input
          type="number"
          name="borderWidth"
          value={borderWidth}
          onChange={handleChange}
        />
      </div>
      <div className="property-field">
        <label>{i18n.t("Rol.Sheet.Style.borderStyle")}:</label>
        <BorderStyleSelect value={borderStyle} onChange={handleChange} />
      </div>
      <div className="property-field">
        <label>{i18n.t("Rol.Sheet.Style.borderRadius")}:</label>
        <input
          type="number"
          name="borderRadius"
          value={borderRadius}
          onChange={handleChange}
        />
      </div>
      {/* Position Controls */}
      <div className="property-field position-controls">
        <h4>{i18n.t("Rol.Sheet.Style.position")}</h4>
        <div className="alignment-buttons">
          <button onClick={() => handleAlignment("left")}>
            <FontAwesomeIcon icon={faAlignLeft} />
          </button>
          <button onClick={() => handleAlignment("center")}>
            <FontAwesomeIcon icon={faAlignCenter} />
          </button>
          <button onClick={() => handleAlignment("right")}>
            <FontAwesomeIcon icon={faAlignRight} />
          </button>
          <button onClick={() => handleAlignment("top")}>
            <FontAwesomeIcon icon={faArrowUp} />
          </button>
          <button onClick={() => handleAlignment("middle")}>
            <FontAwesomeIcon icon={faGripLinesVertical} />
          </button>
          <button onClick={() => handleAlignment("bottom")}>
            <FontAwesomeIcon icon={faArrowDown} />
          </button>
        </div>
        <div className="position-inputs">
          <label>X:</label>
          <input
            type="number"
            name="xPosition"
            value={xPosition}
            onChange={handleChange}
          />
          <label>Y:</label>
          <input
            type="number"
            name="yPosition"
            value={yPosition}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;
