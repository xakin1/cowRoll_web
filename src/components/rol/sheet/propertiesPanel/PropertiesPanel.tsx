import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import { default as FormatBoldIcon } from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatStrikethroughIcon from "@mui/icons-material/FormatStrikethrough";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import { Chip, IconButton } from "@mui/material";
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
  onUpdateStyle: (name: string, value: string | number) => void;
  onUpdateField: (field: Field) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedElement,
  onUpdateStyle,
  onUpdateField,
}) => {
  const [width, setWidth] = useState<string>("");
  const [nameVar, setNameVar] = useState<string>("");
  const [options, setOptions] = useState<any[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [isBold, setIsBold] = useState<boolean>(false);

  const [align, setAlign] = useState<string>("initial");
  const [decoration, setDecoration] = useState<string>("none");

  const [fontSize, setFontSize] = useState<string>("12");
  const [font, setFont] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [opacity, setOpacity] = useState<string>("1");
  const [rotate, setRotate] = useState<string>("0");
  const [xPosition, setXPosition] = useState<string>("0");
  const [yPosition, setYPosition] = useState<string>("0");
  const [borderColor, setBorderColor] = useState<string>("#000000");
  const [backgroundColor, setBackgroundColor] = useState<string>("transparent");
  const [borderWidth, setBorderWidth] = useState<string>("1");
  const [textColor, setTextColor] = useState<string>("#000");
  const [borderStyle, setBorderStyle] = useState<string>("solid");
  const [borderRadius, setBorderRadius] = useState<string>("0");
  const [activeCheckboxColor, setActiveCheckboxColor] =
    useState<string>("#2196F3");
  const [inactiveCheckboxColor, setInactiveCheckboxColor] =
    useState<string>("#FFFFFF");
  const [allowAdditions, setAllowAdditions] = useState<boolean>(true);

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

  const [isDraggable, setIsDraggable] = useState<boolean>(true);

  useEffect(() => {
    if (
      selectedElement &&
      selectedElement.id !== previousElementRef.current?.id
    ) {
      setWidth(getSizeValue(selectedElement.style?.width));
      setNameVar(selectedElement.name);
      setOptions(selectedElement.options || []);
      setTags(selectedElement.tags || []);
      setFontSize(selectedElement.style?.fontSize || "12");
      setHeight(getSizeValue(selectedElement.style?.height));
      setIsBold(selectedElement.style.fontWeight === "bold");
      setIsItalic(selectedElement.style.fontStyle === "italic");
      setAlign(selectedElement.style.textAlign || "initial");
      setTextColor(selectedElement.style.color || "#000");
      setDecoration(selectedElement.style.textDecoration || "none");
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
      setActiveCheckboxColor(selectedElement.style?.activeColor || "#2196F3");
      setInactiveCheckboxColor(
        selectedElement.style?.inactiveColor || "#FFFFFF"
      );
      setAllowAdditions(selectedElement.allowAdditions || false);

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
        setWidth(value);
        onUpdateStyle(name, `${value}px`);
        break;
      case "height":
        setHeight(value);
        onUpdateStyle(name, `${value}px`);
        break;
      case "opacity":
        setOpacity(value);
        onUpdateStyle(name, value);
        break;
      case "rotate":
        setRotate(value);
        updateTransform("rotate", value);
        break;
      case "xPosition":
        setXPosition(value);
        onUpdateStyle("left", `${value}px`);
        break;
      case "yPosition":
        setYPosition(value);
        onUpdateStyle("top", `${value}px`);
        break;
      case "borderColor":
        setBorderColor(value);
        onUpdateStyle(name, value);
        break;
      case "backgroundColor":
        setBackgroundColor(value);
        onUpdateStyle(name, value);
        break;
      case "borderWidth":
        setBorderWidth(value);
        onUpdateStyle(name, `${value}px`);
        break;
      case "borderStyle":
        setBorderStyle(value);
        onUpdateStyle(name, value);
        break;
      case "borderRadius":
        setBorderRadius(value);
        onUpdateStyle(name, `${value}px`);
        break;
      case "fontSize":
        setFontSize(value);
        onUpdateStyle(name, `${value}px`);
        break;
      case "fontFamily":
        setFont(value);
        onUpdateStyle(name, value);
        break;
      case "color":
        setTextColor(value);
        onUpdateStyle(name, value);
        break;
      case "customCSS":
        if (selectedElement) {
          // setCustomCSS(value);
          applyCustomCSS(value);
        }
        break;
      case "activeCheckboxColor":
        setActiveCheckboxColor(value);
        onUpdateStyle("activeColor", value);
        break;
      case "inactiveCheckboxColor":
        setInactiveCheckboxColor(value);
        onUpdateStyle("inactiveColor", value);
        break;
      default:
        onUpdateStyle(name, value);
        break;
    }
  };

  const handleTagDelete = (tagToDelete: string) => () => {
    const updatedTags = tags.filter((tag) => tag !== tagToDelete);
    setTags(updatedTags);
    onUpdateField({ ...selectedElement!, tags: updatedTags });
  };

  const handleTagAdd = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const value = (event.target as HTMLInputElement).value;
      if (value && !tags.includes(value)) {
        const updatedTags = [...tags, value];
        setTags(updatedTags);
        onUpdateField({ ...selectedElement!, tags: updatedTags });
      }
      (event.target as HTMLInputElement).value = "";
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
    onUpdateStyle("backgroundColor", "transparent");
  };

  const handleRemoveBorder = () => {
    onUpdateStyle("border", "none");
  };

  const updateTransform = (type: string, value1: string) => {
    const newRotate = type === "rotate" ? value1 : rotate;
    const transform = `rotate(${newRotate}deg)`;

    onUpdateStyle("transform", transform);
  };

  const getSizeValue = (size: string | number | undefined): string => {
    if (size && typeof size === "string") {
      return parseInt(size.replace("px", ""), 10).toString();
    }
    return size?.toString() || "";
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = event.target;
    if (selectedElement) {
      switch (name) {
        case "name":
          setNameVar(value);
          onUpdateField({
            ...selectedElement,
            [name]: value,
          });
          break;
        case "options":
          const newOptions = value.split(";");
          setOptions(newOptions);
          onUpdateField({
            ...selectedElement,
            [name]: newOptions,
          });
          break;
        case "allowAdditions":
          if (type === "checkbox") {
            const isChecked: boolean = (event.target as HTMLInputElement)
              .checked;
            setAllowAdditions(isChecked);
            onUpdateField({
              ...selectedElement,
              allowAdditions: isChecked,
            });
          }
          break;
      }
    }
  };

  const handleFocus = () => setIsDraggable(false);

  const handleBlur = () => setIsDraggable(true);

  return (
    <Draggable disabled={!isDraggable}>
      <div className="properties-panel" ref={propertiesPanelRef}>
        <div className="properties-panel__property-field position-controls">
          <h4>{i18n.t("Rol.Sheet.Style.scriptProperties")}</h4>
          <div className="name-inputs__container properties-panel__property-field position-inputs__container properties_inputs">
            <label className="position-inputs__container__label">
              {i18n.t("Rol.Sheet.Style.name")}:
            </label>
            <input
              onKeyDown={(e) => {
                e.stopPropagation();
              }}
              className="position-inputs__container__input"
              type="text"
              name="name"
              value={nameVar}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleInputChange}
            />
          </div>
          <div className="tag-inputs__container properties-panel__property-field position-inputs__container properties_inputs">
            <div className="tag-chips-container">
              <label className="tags-label">
                {i18n.t("Rol.Sheet.Style.tag")}:
              </label>
              <div className="tag-chips">
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={handleTagDelete(tag)}
                    style={{ margin: "4px" }}
                  />
                ))}
                <input
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    handleTagAdd(e);
                  }}
                  placeholder={i18n.t("Rol.Sheet.Style.addTag")}
                  type="text"
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>
          {selectedElement?.type === typeField.selectable && (
            <>
              <div className="position-inputs__container properties-panel__property-field">
                <label className="position-inputs__container__label">
                  {i18n.t("Rol.Sheet.Style.options")}:
                </label>
                <textarea
                  onKeyDown={(e) => {
                    e.stopPropagation();
                  }}
                  className="position-inputs__container__input"
                  name="options"
                  value={options}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onChange={handleInputChange}
                />
              </div>

              <div className="position-inputs__container properties-panel__property-field">
                <label className="position-inputs__container__label">
                  {i18n.t("Rol.Sheet.Style.allowAdditions")}:
                </label>
                <input
                  onKeyDown={(e) => {
                    e.stopPropagation();
                  }}
                  type="checkbox"
                  className="position-inputs__container__input"
                  name="allowAdditions"
                  checked={allowAdditions}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onChange={handleInputChange}
                />
              </div>
            </>
          )}
          {selectedElement?.type === typeField.text ||
            selectedElement?.type === typeField.textarea ||
            (selectedElement?.type === typeField.input && (
              <div className="position-inputs__container properties-panel__property-field position-inputs__container properties_inputs">
                <SelectColor
                  value={textColor}
                  name={"color"}
                  label={`${i18n.t("Rol.Sheet.Style.textColor")}:`}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onChange={handleChange}
                ></SelectColor>
              </div>
            ))}

          {(selectedElement?.type === typeField.text ||
            selectedElement?.type === typeField.textarea) && (
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
                      onUpdateStyle("textAlign", `center`);
                    } else {
                      setAlign("initial");

                      onUpdateStyle("textAlign", `initial`);
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
                      onUpdateStyle("textAlign", `justify`);
                    } else {
                      setAlign("initial");

                      onUpdateStyle("textAlign", `initial`);
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
                      onUpdateStyle("textAlign", `left`);
                    } else {
                      setAlign("initial");

                      onUpdateStyle("textAlign", `initial`);
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
                      onUpdateStyle("textAlign", `right`);
                    } else {
                      setAlign("initial");

                      onUpdateStyle("textAlign", `initial`);
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
                      onUpdateStyle("fontWeight", `normal`);
                    } else {
                      onUpdateStyle("fontWeight", `bold`);
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
                      onUpdateStyle("fontStyle", `normal`);
                    } else {
                      onUpdateStyle("fontStyle", `italic`);
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
                      onUpdateStyle("textDecoration", `underline`);
                    } else {
                      setDecoration("none");

                      onUpdateStyle("textDecoration", `none`);
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
                      onUpdateStyle("textDecoration", `line-through`);
                    } else {
                      setDecoration("none");

                      onUpdateStyle("textDecoration", `none`);
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
                  onKeyDown={(e) => {
                    e.stopPropagation();
                  }}
                  className="position-inputs__container__input"
                  type="number"
                  name="fontSize"
                  value={fontSize}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
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
                  onFocus={handleFocus}
                  onBlur={handleBlur}
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
                onKeyDown={(e) => {
                  e.stopPropagation();
                }}
                type="number"
                className="position-inputs__container__input"
                name="xPosition"
                value={xPosition}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </div>
            <div className="position-inputs__container properties_inputs">
              <label className="position-inputs__container__label">Y:</label>
              <input
                onKeyDown={(e) => {
                  e.stopPropagation();
                }}
                type="number"
                className="position-inputs__container__input"
                name="yPosition"
                value={yPosition}
                onFocus={handleFocus}
                onBlur={handleBlur}
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
            onKeyDown={(e) => {
              e.stopPropagation();
            }}
            type="number"
            className="position-inputs__container__input"
            name="rotate"
            value={rotate}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
          />
        </div>

        <div className="position-inputs__container properties-panel__property-field">
          <label className="position-inputs__container__label">
            {i18n.t("Rol.Sheet.Style.width")}:
          </label>
          <input
            onKeyDown={(e) => {
              e.stopPropagation();
            }}
            type="number"
            className="position-inputs__container__input"
            name="width"
            value={width}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
          />
        </div>

        {selectedElement?.type !== typeField.line && (
          <div className="position-inputs__container properties-panel__property-field">
            <label className="position-inputs__container__label">
              {i18n.t("Rol.Sheet.Style.height")}:
            </label>
            <input
              onKeyDown={(e) => {
                e.stopPropagation();
              }}
              type="number"
              className="position-inputs__container__input"
              name="height"
              value={height}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
            />
          </div>
        )}
        <div className="position-inputs__container properties-panel__property-field">
          <label className="position-inputs__container__label">
            {i18n.t("Rol.Sheet.Style.opacity")}:
          </label>
          <input
            onKeyDown={(e) => {
              e.stopPropagation();
            }}
            type="number"
            className="position-inputs__container__input"
            name="opacity"
            value={opacity}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            step={0.1}
            min={0}
            max={1}
          />
        </div>

        <h4>{i18n.t("Rol.Sheet.Style.borderStyle")}</h4>
        <div className="position-inputs__container properties-panel__property-field position-inputs__container properties_inputs">
          <label className="position-inputs__container__label">
            {i18n.t("Rol.Sheet.Style.borderWidth")}:
          </label>
          <input
            onKeyDown={(e) => {
              e.stopPropagation();
            }}
            className="position-inputs__container__input"
            type="number"
            name="borderWidth"
            value={borderWidth}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
          />
        </div>
        <div className="position-inputs__container properties-panel__property-field">
          <label className="position-inputs__container__label">
            {i18n.t("Rol.Sheet.Style.borderStyle")}:
          </label>
          <BorderStyleSelect
            value={borderStyle}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        {selectedElement?.type !== typeField.line &&
          selectedElement?.type !== typeField.textarea &&
          selectedElement?.type !== typeField.text && (
            <div className="position-inputs__container properties-panel__property-field">
              <label className="position-inputs__container__label">
                {i18n.t("Rol.Sheet.Style.borderRadius")}:
              </label>
              <input
                onKeyDown={(e) => {
                  e.stopPropagation();
                }}
                type="number"
                className="position-inputs__container__input"
                name="borderRadius"
                value={borderRadius}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </div>
          )}

        {selectedElement?.type !== typeField.text &&
          selectedElement?.type !== typeField.checkbox &&
          selectedElement?.type !== typeField.textarea &&
          selectedElement?.type !== typeField.line && (
            <div className="properties-panel__property-field">
              <SelectColor
                value={backgroundColor}
                name={"backgroundColor"}
                label={`${i18n.t("Rol.Sheet.Style.backgroundColor")}:`}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
                onRemove={handleRemoveBackground}
              ></SelectColor>
            </div>
          )}
        {selectedElement?.type !== typeField.text && (
          <div className="properties-panel__property-field">
            <SelectColor
              value={borderColor}
              name={"borderColor"}
              label={`${i18n.t("Rol.Sheet.Style.borderColor")}:`}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              onRemove={handleRemoveBorder}
            ></SelectColor>
          </div>
        )}
        {selectedElement?.type === typeField.checkbox && (
          <>
            <h4>{i18n.t("Rol.Sheet.General.checkBoxColors")}</h4>
            <div className="position-inputs__container properties-panel__property-field">
              <label className="position-inputs__container__label">
                {i18n.t("Rol.Sheet.General.activeColor")}
              </label>
              <input
                onKeyDown={(e) => {
                  e.stopPropagation();
                }}
                type="color"
                className="position-inputs__container__input"
                name="activeCheckboxColor"
                value={activeCheckboxColor}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </div>
            <div className="position-inputs__container properties-panel__property-field">
              <label className="position-inputs__container__label">
                {i18n.t("Rol.Sheet.General.inactiveColor")}:
              </label>
              <input
                onKeyDown={(e) => {
                  e.stopPropagation();
                }}
                type="color"
                className="position-inputs__container__input"
                name="inactiveCheckboxColor"
                value={inactiveCheckboxColor}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        {/* <h4>{i18n.t("Rol.Sheet.Style.css")}</h4>
        <textarea
              onKeyDown={(e) => {e.stopPropagation()}}
          name="customCSS"
          value={customCSS}
          onFocus={handleFocus} 
          onBlur={handleBlur}   
          onChange={handleChange}
          placeholder="Enter custom CSS"
        /> */}
      </div>
    </Draggable>
  );
};

export default PropertiesPanel;
