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
  const [localWidth, setLocalWidth] = useState<string>("");
  const [localHeight, setLocalHeight] = useState<string>("");
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
      setLocalWidth(getSizeValue(selectedElement.style?.width));
      setLocalHeight(getSizeValue(selectedElement.style?.height));
      setXPosition(getSizeValue(selectedElement.style?.left));
      setYPosition(getSizeValue(selectedElement.style?.top));
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
        setLocalWidth(value);
        onUpdate(name, `${value}px`);
        break;
      case "height":
        setLocalHeight(value);
        onUpdate(name, `${value}px`);
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
      <h3>Properties</h3>
      <div className="property-field">
        <label>Rotate:</label>
        <input
          type="number"
          name="rotate"
          value={rotate}
          onChange={handleChange}
        />
      </div>
      <div className="property-field">
        <label>Scale:</label>
        <input
          type="number"
          name="scale"
          value={scale}
          onChange={handleChange}
        />
      </div>
      <div className="property-field">
        <label>Width:</label>
        <input
          type="number"
          name="width"
          value={localWidth}
          onChange={handleChange}
        />
      </div>
      <div className="property-field">
        <label>Height:</label>
        <input
          type="number"
          name="height"
          value={localHeight}
          onChange={handleChange}
        />
      </div>
      <div className="property-field">
        <SelectColor
          value={backgroundColor}
          name={"backgroundColor"}
          label={"Background Color:"}
          onChange={handleChange}
          onRemove={handleRemoveBackground}
        ></SelectColor>
      </div>
      <div className="property-field">
        <SelectColor
          value={borderColor}
          name={"borderColor"}
          label={"Border Color:"}
          onChange={handleChange}
          onRemove={handleRemoveBorder}
        ></SelectColor>
      </div>
      <div className="property-field">
        <label>Border Width:</label>
        <input
          type="number"
          name="borderWidth"
          value={borderWidth}
          onChange={handleChange}
        />
      </div>
      <div className="property-field">
        <label>Border Style:</label>
        <BorderStyleSelect value={borderStyle} onChange={handleChange} />
      </div>
      <div className="property-field">
        <label>Border Radius:</label>
        <input
          type="number"
          name="borderRadius"
          value={borderRadius}
          onChange={handleChange}
        />
      </div>
      {/* Position Controls */}
      <div className="property-field position-controls">
        <h4>Position</h4>
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
