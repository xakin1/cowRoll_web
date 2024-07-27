import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Draggable, {
  type DraggableData,
  type DraggableEvent,
} from "react-draggable";
import type { RenderFieldProps } from "./types";

export enum typeField {
  input = "input",
  checkbox = "checkbox",
  textarea = "textarea",
  rectangle = "rectangle",
  circle = "circle",
  line = "line",
  text = "text",
  photo = "photo",
}
export const fields = [
  { type: typeField.input, label: "Input", style: {} },
  {
    type: typeField.checkbox,
    label: "checkbox",
    style: { width: "20px", height: "20px" },
  },
  {
    type: typeField.textarea,
    label: "Text area",
    style: { border: "1px solid var(--text-color)", width: "100px" },
  },
  {
    type: typeField.rectangle,
    label: "Rectangle",
    style: { width: 50, height: 50, border: "1px solid lightgray" },
  },
  {
    type: typeField.circle,
    label: "Circle",
    style: {
      width: 50,
      height: 50,
      borderRadius: "50px",
      border: "1px solid lightgray",
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
    },
  },
  {
    type: typeField.text,
    label: "Text",
    style: { width: "50px", height: "50px", outline: "none" },
  },
  {
    type: typeField.photo,
    label: "Photo",
    style: {
      width: 100,
      height: 100,
      backgroundImage: `url(/placeholder.png)`,
    },
  },
];

const RenderField = forwardRef<HTMLElement, RenderFieldProps>(
  ({ type, label, id, onSelect, style, onChange }, ref) => {
    // Añadir onPhotoChange
    const [editableContent, setEditableContent] = useState("Editable Text");
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const targetRef = useRef<HTMLElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => targetRef.current!);

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
      setEditableContent(e.currentTarget.textContent || "");
    };

    useEffect(() => {
      if (type === "text") {
        const div = document.getElementById(`editable-${id}`);
        if (div) {
          div.textContent = editableContent;
        }
      }
    }, [editableContent, type, id]);

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
      if (onChange && targetRef.current) {
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
    const renderComponent = () => {
      switch (type) {
        case typeField.input:
          return (
            <input
              ref={targetRef as React.RefObject<HTMLInputElement>}
              style={style}
              type="text"
              draggable={false}
              placeholder={label}
              className="sheet-option"
            />
          );
        case typeField.checkbox:
          return (
            <input
              ref={targetRef as React.RefObject<HTMLInputElement>}
              style={style}
              type="checkbox"
              onClick={handleClick}
              className="sheet-option"
            />
          );

        case typeField.textarea:
          return (
            <textarea
              style={style}
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
            <div
              ref={targetRef as React.RefObject<HTMLDivElement>}
              id={`editable-${id}`}
              onInput={handleInput}
              className="sheet-option"
              style={style}
              onClick={handleClick}
            >
              {editableContent}
            </div>
          );
        case typeField.photo:
          return (
            <div
              ref={targetRef as React.RefObject<HTMLDivElement>}
              className="photo-container"
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
      >
        {renderComponent()}
      </Draggable>
    );
  }
);

export default RenderField;
