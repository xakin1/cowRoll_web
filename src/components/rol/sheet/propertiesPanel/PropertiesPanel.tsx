import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import { default as FormatBoldIcon } from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatStrikethroughIcon from "@mui/icons-material/FormatStrikethrough";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import { IconButton } from "@mui/material";
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import Draggable from "react-draggable";
import i18n from "../../../../i18n/i18n";
import { rgbToHex } from "../../../../utils/functions/utils";
import SelectColor from "../../../selectColor/SelectColor";
import { typeField } from "../RenderFields";
import { SheetContext } from "../SheetContext";
import BorderStyleSelect from "../components/borderStyle/BorderStyleSelect";
import type { Field } from "../types";
import "./propertiesPanel.css";
interface PropertiesPanelProps {
  selectedElement: Field | null;
  onUpdate: (name: string, value: string | number) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedElement,
  onUpdate,
}) => {
  const [width, setwidth] = useState<string>("");
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [isBold, setIsBold] = useState<boolean>(false);

  const [align, setAlign] = useState<string>("initial");
  const [decoration, setDecoration] = useState<string>("none");

  const [fontSize, setFontSize] = useState<string>("12");
  const [font, setFont] = useState<string>("");
  const [height, setheight] = useState<string>("");
  const [opacity, setOpacity] = useState<string>("1");
  const [rotate, setRotate] = useState<string>("0");
  const [xPosition, setXPosition] = useState<string>("0");
  const [yPosition, setYPosition] = useState<string>("0");
  const [borderColor, setBorderColor] = useState<string>("#000000");
  const [backgroundColor, setBackgroundColor] = useState<string>("transparent");
  const [borderWidth, setBorderWidth] = useState<string>("1");
  const [borderStyle, setBorderStyle] = useState<string>("solid");
  const [borderRadius, setBorderRadius] = useState<string>("0");
  const [customCSS, setCustomCSS] = useState<string>("");
  const { updateFieldStyle } = useContext(SheetContext)!;
  const previousElementRef = useRef<Field | null>(null);
  const propertiesPanelRef = useRef<HTMLDivElement>(null);

  const fonts = [
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Courier New",
    "Verdana",
    "Georgia",
    "Palatino",
    "Garamond",
    "Comic Sans MS",
    "Trebuchet MS",
    "Arial Black",
    "Impact",
  ];

  useEffect(() => {
    if (
      selectedElement &&
      selectedElement.id !== previousElementRef.current?.id
    ) {
      setwidth(getSizeValue(selectedElement.style?.width));
      setFontSize(selectedElement.style?.fontSize || "12");
      setheight(getSizeValue(selectedElement.style?.height));
      setIsBold(selectedElement.style.fontWeight == "bold");
      setIsItalic(selectedElement.style.fontStyle == "italic");
      setAlign(selectedElement.style.textAlign || "initial");
      setAlign(selectedElement.style.textDecoration || "none");
      setFont(selectedElement.style.fontFamily || "Arial");
      setXPosition(getSizeValue(selectedElement.style?.left));
      setYPosition(getSizeValue(selectedElement.style?.top));
      setOpacity(selectedElement.style?.opacity || "1");
      const transform = selectedElement.style?.transform || "";
      const rotateMatch = transform.match(/rotate\(([^)]+)\)/);
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

      const translateMatch = transform.match(
        /translate\(([^,]+)px,\s*([^)]+)px\)/
      );
      if (translateMatch) {
        setXPosition(parseInt(translateMatch[1], 10).toString());
        setYPosition(parseInt(translateMatch[2], 10).toString());
      }
      // setCustomCSS(generateCustomCSS(selectedElement.style));
      previousElementRef.current = selectedElement;
    }
  }, [selectedElement]);

  // const generateCustomCSS = (style: CSSStyleDeclaration): string => {
  //   const cssProperties = [
  //     "width",
  //     "height",
  //     "opacity",
  //     "transform",
  //     "left",
  //     "top",
  //     "borderTopColor",
  //     "backgroundColor",
  //     "borderTopWidth",
  //     "borderTopStyle",
  //     "borderTopLeftRadius",
  //     "fontSize",
  //     "fontFamily",
  //     "fontWeight",
  //     "fontStyle",
  //     "textAlign",
  //     "textDecoration",
  //   ];

  //   return cssProperties
  //     .map((property) => {
  //       const kebabCaseProperty = property.replace(
  //         /([A-Z])/g,
  //         (g) => `-${g[0].toLowerCase()}`
  //       );
  //       const value = style[property as any];
  //       return value ? `${kebabCaseProperty}: ${value};` : "";
  //     })
  //     .filter(Boolean)
  //     .join(" ");
  // };

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
      case "fontSize":
        setFontSize(value);
        onUpdate(name, `${value}px`);
        break;
      case "fontFamily":
        setFont(value);
        onUpdate(name, value);
        break;
      case "customCSS":
        if (selectedElement) {
          setCustomCSS(value);
          applyCustomCSS(value);
        }
        break;
      default:
        onUpdate(name, value);
        break;
    }
  };

  const applyCustomCSS = (css: string) => {
    if (selectedElement) {
      const style: { [key: string]: string | number } = {};
      const cssRules = css.split(";").filter((rule) => rule.trim() !== "");
      cssRules.forEach((rule) => {
        const [property, value] = rule.split(":").map((part) => part.trim());
        if (property && value) {
          const camelCaseProperty = property.replace(/-([a-z])/g, (g) =>
            g[1].toUpperCase()
          );
          style[camelCaseProperty] = value;
        }
      });
      updateFieldStyle(selectedElement.id, style);
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

  return (
    <Draggable>
      <div className="properties-panel" ref={propertiesPanelRef}>
        <div className="properties-panel__property-field position-controls">
          {selectedElement?.type === typeField.text && (
            <>
              <h4>{i18n.t("Rol.Sheet.Style.textAling")}</h4>
              <div className="alignment-buttons">
                <IconButton
                  sx={{
                    backgroundColor:
                      align == "center" ? "lightgray" : "transparent",
                    border: align == "center" ? "2px solid black" : "none",
                    borderRadius: "4px",
                  }}
                  onClick={() => {
                    if (align != "center") {
                      setAlign("center");
                      onUpdate("textAlign", `center`);
                    } else {
                      setAlign("initial");

                      onUpdate("textAlign", `initial`);
                    }
                  }}
                >
                  <FormatAlignCenterIcon></FormatAlignCenterIcon>
                </IconButton>
                <IconButton
                  sx={{
                    backgroundColor:
                      align == "justify" ? "lightgray" : "transparent",
                    border: align == "justify" ? "2px solid black" : "none",
                    borderRadius: "4px",
                  }}
                  onClick={() => {
                    if (align != "justify") {
                      setAlign("justify");
                      onUpdate("textAlign", `justify`);
                    } else {
                      setAlign("initial");

                      onUpdate("textAlign", `initial`);
                    }
                  }}
                >
                  <FormatAlignJustifyIcon></FormatAlignJustifyIcon>
                </IconButton>
                <IconButton
                  sx={{
                    backgroundColor:
                      align == "left" ? "lightgray" : "transparent",
                    border: align == "left" ? "2px solid black" : "none",
                    borderRadius: "4px",
                  }}
                  onClick={() => {
                    if (align != "left") {
                      setAlign("left");
                      onUpdate("textAlign", `left`);
                    } else {
                      setAlign("initial");

                      onUpdate("textAlign", `initial`);
                    }
                  }}
                >
                  <FormatAlignLeftIcon></FormatAlignLeftIcon>
                </IconButton>
                <IconButton
                  sx={{
                    backgroundColor:
                      align == "right" ? "lightgray" : "transparent",
                    border: align == "right" ? "2px solid black" : "none",
                    borderRadius: "4px",
                  }}
                  onClick={() => {
                    if (align != "right") {
                      setAlign("right");
                      onUpdate("textAlign", `right`);
                    } else {
                      setAlign("initial");

                      onUpdate("textAlign", `initial`);
                    }
                  }}
                >
                  <FormatAlignRightIcon></FormatAlignRightIcon>
                </IconButton>

                <IconButton
                  sx={{
                    backgroundColor: isBold ? "lightgray" : "transparent",
                    border: isBold ? "2px solid black" : "none",
                    borderRadius: "4px",
                  }}
                  onClick={() => {
                    if (isBold) {
                      onUpdate("fontWeight", `normal`);
                    } else {
                      onUpdate("fontWeight", `bold`);
                    }
                    setIsBold(!isBold);
                  }}
                >
                  <FormatBoldIcon></FormatBoldIcon>
                </IconButton>
                <IconButton
                  sx={{
                    backgroundColor: isItalic ? "lightgray" : "transparent",
                    border: isItalic ? "2px solid black" : "none",
                    borderRadius: "4px",
                  }}
                  onClick={() => {
                    if (isItalic) {
                      onUpdate("fontStyle", `normal`);
                    } else {
                      onUpdate("fontStyle", `italic`);
                    }
                    setIsItalic(!isItalic);
                  }}
                >
                  <FormatItalicIcon></FormatItalicIcon>
                </IconButton>
                <IconButton
                  sx={{
                    backgroundColor:
                      decoration == "underline" ? "lightgray" : "transparent",
                    border:
                      decoration == "underline" ? "2px solid black" : "none",
                    borderRadius: "4px",
                  }}
                  onClick={() => {
                    if (decoration != "underline") {
                      setDecoration("underline");
                      onUpdate("textDecoration", `underline`);
                    } else {
                      setDecoration("none");

                      onUpdate("textDecoration", `none`);
                    }
                  }}
                >
                  <FormatUnderlinedIcon></FormatUnderlinedIcon>
                </IconButton>
                <IconButton
                  sx={{
                    backgroundColor:
                      decoration == "line-through"
                        ? "lightgray"
                        : "transparent",
                    border:
                      decoration == "line-through" ? "2px solid black" : "none",
                    borderRadius: "4px",
                  }}
                  onClick={() => {
                    if (decoration != "line-through") {
                      setDecoration("line-through");
                      onUpdate("textDecoration", `line-through`);
                    } else {
                      setDecoration("none");

                      onUpdate("textDecoration", `none`);
                    }
                  }}
                >
                  <FormatStrikethroughIcon></FormatStrikethroughIcon>
                </IconButton>
              </div>

              <h4>{i18n.t("Rol.Sheet.Style.textProperties")}</h4>
              <div className="position-inputs__container properties-panel__property-field position-inputs__container properties_inputs">
                <label className="position-inputs__container__label">
                  {i18n.t("Rol.Sheet.Style.fontSize")}:
                </label>
                <input
                  className="position-inputs__container__input"
                  type="number"
                  name="fontSize"
                  value={fontSize}
                  onChange={handleChange}
                />
              </div>
              <div className="position-inputs__container properties-panel__property-field position-inputs__container properties_inputs">
                <label className="position-inputs__container__label">
                  {i18n.t("Rol.Sheet.Style.font")}:
                </label>
                <select
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                  }}
                  value={font}
                  name="fontFamily"
                  onChange={handleChange}
                >
                  {fonts.map((fontOption) => (
                    <option
                      style={{ fontFamily: fontOption }}
                      onClick={(e) => e.stopPropagation()}
                      key={fontOption}
                      value={fontOption}
                    >
                      {fontOption}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
          <h4>{i18n.t("Rol.Sheet.Style.position")}</h4>

          <div className="position-inputs">
            <div className="position-inputs__container properties_inputs">
              <label className="position-inputs__container__label">X:</label>
              <input
                type="number"
                className="position-inputs__container__input"
                name="xPosition"
                value={xPosition}
                onChange={handleChange}
              />
            </div>
            <div className="position-inputs__container properties_inputs">
              <label className="position-inputs__container__label">Y:</label>
              <input
                type="number"
                className="position-inputs__container__input"
                name="yPosition"
                value={yPosition}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <h3>{i18n.t("Rol.Sheet.Style.properties")}</h3>
        <div className="position-inputs__container properties-panel__property-field">
          <label className="position-inputs__container__label">
            {i18n.t("Rol.Sheet.Style.rotate")}:
          </label>
          <input
            type="number"
            className="position-inputs__container__input"
            name="rotate"
            value={rotate}
            onChange={handleChange}
          />
        </div>
        {selectedElement?.type !== typeField.text && (
          <div className="position-inputs__container properties-panel__property-field">
            <label className="position-inputs__container__label">
              {i18n.t("Rol.Sheet.Style.width")}:
            </label>
            <input
              type="number"
              className="position-inputs__container__input"
              name="width"
              value={width}
              onChange={handleChange}
            />
          </div>
        )}
        {selectedElement?.type !== typeField.text &&
          selectedElement?.type !== typeField.line && (
            <div className="position-inputs__container properties-panel__property-field">
              <label className="position-inputs__container__label">
                {i18n.t("Rol.Sheet.Style.height")}:
              </label>
              <input
                type="number"
                className="position-inputs__container__input"
                name="height"
                value={height}
                onChange={handleChange}
              />
            </div>
          )}
        <div className="position-inputs__container properties-panel__property-field">
          <label className="position-inputs__container__label">
            {i18n.t("Rol.Sheet.Style.opacity")}:
          </label>
          <input
            type="number"
            className="position-inputs__container__input"
            name="opacity"
            value={opacity}
            onChange={handleChange}
            step={0.1}
            min={0}
            max={1}
          />
        </div>
        {selectedElement?.type !== typeField.text && (
          <>
            <h4>{i18n.t("Rol.Sheet.Style.borderStyle")}</h4>
            <div className="position-inputs__container properties-panel__property-field position-inputs__container properties_inputs">
              <label className="position-inputs__container__label">
                {i18n.t("Rol.Sheet.Style.borderWidth")}:
              </label>
              <input
                className="position-inputs__container__input"
                type="number"
                name="borderWidth"
                value={borderWidth}
                onChange={handleChange}
              />
            </div>
            <div className="position-inputs__container properties-panel__property-field">
              <label className="position-inputs__container__label">
                {i18n.t("Rol.Sheet.Style.borderStyle")}:
              </label>
              <BorderStyleSelect value={borderStyle} onChange={handleChange} />
            </div>
          </>
        )}
        {selectedElement?.type !== typeField.line &&
          selectedElement?.type !== typeField.text && (
            <div className="position-inputs__container properties-panel__property-field">
              <label className="position-inputs__container__label">
                {i18n.t("Rol.Sheet.Style.borderRadius")}:
              </label>
              <input
                type="number"
                className="position-inputs__container__input"
                name="borderRadius"
                value={borderRadius}
                onChange={handleChange}
              />
            </div>
          )}
        {selectedElement?.type !== typeField.text && (
          <>
            <div className="properties-panel__property-field">
              <SelectColor
                value={borderColor}
                name={"borderColor"}
                label={`${i18n.t("Rol.Sheet.Style.borderColor")}:`}
                onChange={handleChange}
                onRemove={handleRemoveBorder}
              ></SelectColor>
            </div>
            {selectedElement?.type !== typeField.line && (
              <div className="properties-panel__property-field">
                <SelectColor
                  value={backgroundColor}
                  name={"backgroundColor"}
                  label={`${i18n.t("Rol.Sheet.Style.backgroundColor")}:`}
                  onChange={handleChange}
                  onRemove={handleRemoveBackground}
                ></SelectColor>
              </div>
            )}
          </>
        )}
        {/* <h4>{i18n.t("Rol.Sheet.Style.css")}</h4>
        <textarea
          name="customCSS"
          value={customCSS}
          onChange={handleChange}
          placeholder="Enter custom CSS"
        /> */}
      </div>
    </Draggable>
  );
};

export default PropertiesPanel;
