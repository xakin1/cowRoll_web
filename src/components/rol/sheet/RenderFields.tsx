import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Draggable, {
  type DraggableData,
  type DraggableEvent,
} from "react-draggable";
import { SheetContext } from "./SheetContext";
import type { RenderFieldProps } from "./types";

export enum typeField {
  input = "input",
  checkbox = "checkbox",
  pdf = "pdfPage",
  textarea = "textarea",
  rectangle = "rectangle",
  circle = "circle",
  line = "line",
  text = "text",
  photo = "photo",
  selectable = "selectable", // Nuevo tipo de campo
}

export const fields = [
  { type: typeField.input, label: "Input", style: { zIndex: "2" } },
  {
    type: typeField.checkbox,
    label: "checkbox",
    style: { width: "20px", height: "20px", zIndex: "2" },
  },
  {
    type: typeField.textarea,
    label: "Text area",
    style: {
      border: "1px solid var(--text-color)",
      width: "100px",
      zIndex: "2",
    },
  },
  {
    type: typeField.rectangle,
    label: "Rectangle",
    style: {
      width: 50,
      height: 50,
      border: "1px solid lightgray",
      zIndex: "2",
    },
  },
  {
    type: typeField.circle,
    label: "Circle",
    style: {
      width: 50,
      height: 50,
      borderRadius: "50px",
      border: "1px solid lightgray",
      zIndex: "2",
    },
  },
  {
    type: typeField.line,
    label: "Line",
    style: {
      width: 50,
      height: 0,
      top: "10px",
      left: "10px",
      maxHeight: "0px",
      border: "1px solid lightgray",
      zIndex: "2",
    },
  },
  {
    type: typeField.text,
    label: "Text",
    style: {
      width: "50px",
      height: "50px",
      outline: "none",
      zIndex: "2",
    },
  },
  {
    type: typeField.photo,
    label: "Photo",
    style: {
      width: 100,
      height: 100,
      backgroundImage: `url(/placeholder.png)`,
      zIndex: "2",
    },
  },
  {
    type: typeField.selectable,
    label: "Selectable",
    style: { zIndex: "2" },
  },
];

const RenderField = forwardRef<HTMLElement, RenderFieldProps>(
  (
    {
      type,
      label,
      id,
      value,
      options,
      allowAdditions,
      onSelect,
      style,
      onChange,
      onClick,
    },
    ref
  ) => {
    const { setIsContextMenuVisible } = useContext(SheetContext)!;
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [selectOptions, setSelectOptions] = useState<string>(options || "");
    const [newOption, setNewOption] = useState("");
    const [isSelectActive, setSelectActive] = useState(false);
    const targetRef = useRef<HTMLElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => targetRef.current!);

    const [selectedValue, setSelectedValue] = useState("solid");
    const [isSelectOpen, setSelectOpen] = useState(false);

    const handleClick = () => {
      if (onSelect) {
        onSelect(id);
      }
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const newPhotoSrc = reader.result as string;
          if (onChange) {
            onChange({ backgroundImage: `url(${newPhotoSrc})` });
          }
        };
        reader.readAsDataURL(file);
      }
    };

    const handleDragStop = (_e: DraggableEvent, data: DraggableData) => {
      if (onChange && targetRef.current && !isSelectOpen) {
        const rect = targetRef.current.getBoundingClientRect();
        const parentRect =
          targetRef.current.offsetParent?.getBoundingClientRect() || {
            left: 0,
            top: 0,
          };

        const newXPosition = rect.left - parentRect.left + data.deltaX;
        const newYPosition = rect.top - parentRect.top + data.deltaY;

        const transform = targetRef.current?.style.transform || "";
        const rotateMatch = transform.match(/rotate\(([^)]+)\)/);
        const newTransform = rotateMatch ? `rotate(${rotateMatch[1]})` : "";

        targetRef.current.style.left = `${newXPosition}px`;
        targetRef.current.style.top = `${newYPosition}px`;
        targetRef.current.style.transform = newTransform;
        targetRef.current.style.position = "absolute";

        setPosition({ x: 0, y: 0 });

        onChange({
          left: `${newXPosition}px`,
          top: `${newYPosition}px`,
        });
      }
    };

    const isDraggable = type !== typeField.pdf; // Desactivar para PDF

    const handleAddOptionSelected = () => {
      const input = prompt("Enter a new option:"); // Ask user for new option
      if (input && input.trim() !== "" && !selectOptions.includes(input)) {
        setSelectOptions((prevOptions) => prevOptions + ";" + input);
        onChange && onChange({ options: selectOptions + ";" + input });
        setSelectedValue(input); // Update selected value
      }
    };

    const renderComponent = () => {
      switch (type) {
        case typeField.input:
          return (
            <input
              ref={targetRef as React.RefObject<HTMLInputElement>}
              style={style}
              type="text"
              draggable={false}
              value={value}
              placeholder={label}
              onClick={handleClick}
              className="sheet-option"
            />
          );
        case typeField.checkbox:
          return (
            <input
              ref={targetRef as React.RefObject<HTMLInputElement>}
              style={style}
              type="checkbox"
              checked={value}
              onClick={handleClick}
              className="sheet-option"
            />
          );

        case typeField.textarea:
          return (
            <textarea
              style={style}
              value={value}
              placeholder={label}
              className="textarea sheet-option"
            />
          );

        case typeField.rectangle:
          return (
            <div
              ref={targetRef as React.RefObject<HTMLDivElement>}
              className="rectangle sheet-option"
              style={style}
              onClick={handleClick}
            ></div>
          );
        case typeField.circle:
          return (
            <div
              ref={targetRef as React.RefObject<HTMLDivElement>}
              className="circle sheet-option"
              style={style}
              onClick={handleClick}
            ></div>
          );
        case typeField.line:
          return (
            <div
              ref={targetRef as React.RefObject<HTMLDivElement>}
              className="line sheet-option"
              style={style}
              onClick={handleClick}
            ></div>
          );
        case typeField.text:
          return (
            <input
              ref={targetRef as React.RefObject<HTMLInputElement>}
              className="sheet-option"
              placeholder={label}
              value={value}
              style={{
                border: "none",
                background: "none",
                ...style,
                width: "fit-content",
                height: "fit-content",
              }}
              onClick={handleClick}
            ></input>
          );
        case typeField.photo:
          return (
            <div
              ref={targetRef as React.RefObject<HTMLDivElement>}
              className="photo-container sheet-option"
              style={style}
              onClick={handleClick}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: "none" }}
              />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                style={{
                  position: "absolute",
                  bottom: "0px",
                  right: "0px",
                }}
              >
                Browse
              </button>
            </div>
          );
        case typeField.pdf:
          return (
            <div
              ref={targetRef as React.RefObject<HTMLDivElement>}
              className="pdf-page sheet-option"
              style={{
                ...style,
                cursor: "default",
                backgroundSize: "cover",
                backgroundPosition: "center",
                zIndex: "1",
              }}
              onClick={() => {
                if (onSelect) {
                  onSelect(null);
                }
                setIsContextMenuVisible(false);
              }}
            ></div>
          );
        case typeField.selectable:
          const optionsArray = selectOptions
            .split(";")
            .map((option) => option.trim());

          return (
            <div
              ref={targetRef as React.RefObject<HTMLDivElement>}
              className="select-container sheet-option"
              style={{
                minWidth: "30px",
                ...style,
              }}
              onClick={() => {
                handleClick();
                setSelectActive(!isSelectActive); // Toggle select activation on click
              }}
            >
              <select
                value={selectedValue}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "addOption") {
                    handleAddOptionSelected(); // Handle special option selection
                  } else {
                    setSelectedValue(value);
                  }
                }}
                style={{
                  minWidth: "30px",
                  width: "100%",
                  height: "100%",
                  boxSizing: "border-box",
                }}
                onMouseDown={(e) => {
                  // Prevent default behavior unless select is active
                  if (!isSelectActive) {
                    e.preventDefault();
                  }
                }}
                onFocus={() => setSelectOpen(true)} // Open select menu
                onBlur={() => setSelectOpen(false)} // Close select menu
              >
                {optionsArray.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
                {allowAdditions && (
                  <option value="addOption">➕ Add Option</option> // Special add option
                )}
              </select>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <Draggable
        position={position}
        onStop={(e, data) => {
          handleDragStop(e, data);
        }}
        disabled={!isDraggable || isSelectOpen}
      >
        {renderComponent()}
      </Draggable>
    );
  }
);

export default RenderField;
