import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { RenderFieldProps } from "./types";

export const fields = [
  { id: "input", type: "input", label: "Input" },
  { id: "contador", type: "contador", label: "Contador" },
  { id: "textarea", type: "textarea", label: "Text area" },
  {
    id: "inputCheck",
    type: "inputCheck",
    label: "Input con check",
  },
  { id: "rectangle", type: "rectangle", label: "Rectangle" },
  { id: "text", type: "text", label: "Text" },
  { id: "photo", type: "photo", label: "Photo" },
];

const RenderField = forwardRef<HTMLElement, RenderFieldProps>(
  ({ type, label, menu, id, onSelect, style, onChange }, ref) => {
    // Añadir onPhotoChange
    const [editableContent, setEditableContent] = useState("Editable Text");
    const [photoSrc, setPhotoSrc] = useState<string>("");
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
          setPhotoSrc(newPhotoSrc);
          if (onChange) {
            onChange({ backgroundImage: `url(${newPhotoSrc})` });
          }
        };
        reader.readAsDataURL(file);
      }
    };

    const renderComponent = () => {
      switch (type) {
        case "input":
          return (
            <div style={{ ...style }}>
              <input
                ref={targetRef as React.RefObject<HTMLInputElement>}
                style={style}
                type="text"
                placeholder={label}
                className="input sheet-option"
                readOnly={menu}
              />
            </div>
          );
        case "contador":
          return (
            <div style={{ ...style }} className="contador sheet-option">
              <input
                ref={targetRef as React.RefObject<HTMLInputElement>}
                style={{
                  ...style,
                  width: style?.width || "50px",
                  height: style?.height || "50px",
                }}
                type="checkbox"
                id={`checkbox-${id}`}
                className="checkbox"
                disabled={menu}
              />
              <label htmlFor={`checkbox-${id}`}></label>
            </div>
          );
        case "textarea":
          return (
            <textarea
              style={{ ...style, width: "100px" }}
              placeholder={label}
              className="textarea sheet-option"
              readOnly={menu}
            />
          );
        case "inputCheck":
          return (
            <div
              style={{ ...style, width: 100 }}
              ref={targetRef as React.RefObject<HTMLDivElement>}
              className="inputCheck"
            >
              <input type="checkbox" disabled={menu} />
              <input
                type="text"
                placeholder={label}
                className="inputInsideCheck"
                readOnly={menu}
              />
            </div>
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
