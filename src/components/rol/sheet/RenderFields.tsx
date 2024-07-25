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

export const fields = [
  { id: "input", type: "input", label: "Input" },
  { id: "checkbox", type: "checkbox", label: "checkbox" },
  { id: "textarea", type: "textarea", label: "Text area" },
  { id: "rectangle", type: "rectangle", label: "Rectangle" },
  { id: "text", type: "text", label: "Text" },
  { id: "photo", type: "photo", label: "Photo" },
];

const RenderField = forwardRef<HTMLElement, RenderFieldProps>(
  ({ type, label, menu, id, onSelect, style, onChange }, ref) => {
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
      if (onChange) {
        const positionX = targetRef.current?.style.left!;
        const positionY = targetRef.current?.style.top!;

        const newXPosition = parseInt(positionX.replace("px", ""), 10) + data.x;
        const newYPosition = parseInt(positionY.replace("px", ""), 10) + data.y;

        const transform = targetRef.current?.style.transform || "";
        const rotateMatch = transform.match(/rotate\(([^)]+)\)/);
        const newTransform = rotateMatch ? `rotate(${rotateMatch[1]})` : "";
        if (targetRef && targetRef.current) {
          targetRef.current.style.transform = newTransform;
        }

        setPosition({ x: 0, y: 0 });

        onChange({
          left: `${newXPosition}px`,
          top: `${newYPosition}px`,
        });
      }
    };

    const renderComponent = () => {
      switch (type) {
        case "input":
          return (
            <input
              ref={targetRef as React.RefObject<HTMLInputElement>}
              style={{
                ...style,
                width: menu ? "100%" : "",
              }}
              type="text"
              placeholder={label}
              className="sheet-option"
              readOnly={menu}
            />
          );
        case "checkbox":
          return (
            <Draggable
              position={position}
              onStop={(e, data) => {
                handleDragStop(e, data);
              }}
            >
              <input
                ref={targetRef as React.RefObject<HTMLInputElement>}
                style={{
                  ...style,
                  width: style?.width || "20px",
                  height: style?.height || "20px",
                }}
                type="checkbox"
                onClick={handleClick}
                className="sheet-option"
                disabled={menu}
              />
            </Draggable>
          );

        case "textarea":
          return (
            <textarea
              style={{
                ...style,
                border: "1px solid var(--text-color)",
                width: "100px",
              }}
              placeholder={label}
              className="textarea sheet-option"
              readOnly={menu}
            />
          );

        case "rectangle":
          return (
            <div
              ref={targetRef as React.RefObject<HTMLDivElement>}
              className="rectangle sheet-option"
              style={{
                width: 50,
                height: 50,
                border: "1px solid lightgray",
                ...style,
              }}
              onClick={handleClick}
            ></div>
          );
        case "text":
          return (
            <div
              ref={targetRef as React.RefObject<HTMLDivElement>}
              id={`editable-${id}`}
              contentEditable={!menu}
              onInput={handleInput}
              className="sheet-option"
              style={{
                ...style,
                width: "50px",
                height: "50px",
                outline: "none",
              }}
              onClick={handleClick}
            >
              {editableContent}
            </div>
          );
        case "photo":
          return (
            <div
              ref={targetRef as React.RefObject<HTMLDivElement>}
              className="photo-container"
              style={{
                backgroundImage: `url(/placeholder.png)`,
                ...style,
                width: style?.width || 100,
                height: style?.height || 100,
              }}
              onClick={handleClick}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: "none" }}
                disabled={menu}
              />
              {!menu && (
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
              )}
            </div>
          );
        default:
          return null;
      }
    };

    return <>{renderComponent()}</>;
  }
);

export default RenderField;
