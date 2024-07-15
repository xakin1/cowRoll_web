import MoveableHelper from "moveable-helper";
import React, { useContext, useEffect, useRef, useState } from "react";
import Moveable from "react-moveable";
import { CharacterSheetContext } from "./CharacterSheetContext";
import type { RenderFieldProps } from "./types";

export const fields = [
  { id: "input", type: "input", label: "Input" },
  { id: "contador", type: "contador", label: "Contador" },
  { id: "textarea", type: "textarea", label: "Text area" },
  { id: "inputCheck", type: "inputCheck", label: "Input con check" },
  { id: "rectangle", type: "rectangle", label: "Rectangle" },
  { id: "line", type: "line", label: "Line" },
  { id: "circle", type: "circle", label: "Circle" },
  { id: "text", type: "text", label: "Text" },
];

const RenderField: React.FC<RenderFieldProps> = ({
  type,
  label,
  id,
  isSelected,
  onSelect,
  style,
}) => {
  const [editableContent, setEditableContent] = useState("Editable Text");
  const targetRef = useRef<HTMLDivElement>(null);
  const [target, setTarget] = useState<HTMLDivElement | null>(null);
  const [helper] = useState(() => new MoveableHelper());
  const { updateFieldSize } = useContext(CharacterSheetContext)!;

  const [dimensions, setDimensions] = useState({
    width: style?.width || 50,
    height: style?.height || 50,
  });

  useEffect(() => {
    setTarget(targetRef.current);
  }, []);

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

  const renderComponent = () => {
    switch (type) {
      case "input":
        return (
          <div style={{ ...style }} ref={targetRef}>
            <input
              style={style}
              type="text"
              placeholder={label}
              className="input sheet-option"
            />
          </div>
        );
      case "contador":
        return (
          <div
            style={{ ...style }}
            ref={targetRef}
            className="contador sheet-option"
          >
            <input type="checkbox" id={`checkbox-${id}`} className="checkbox" />
            <label htmlFor={`checkbox-${id}`}></label>
          </div>
        );
      case "textarea":
        return (
          <div style={{ ...style }} ref={targetRef}>
            <textarea
              style={style}
              placeholder={label}
              className="textarea sheet-option"
            />
          </div>
        );
      case "inputCheck":
        return (
          <div
            style={{ ...style, width: 100 }}
            ref={targetRef}
            className="inputCheck"
          >
            <input type="checkbox" />
            <input
              type="text"
              placeholder={label}
              className="inputInsideCheck"
            />
          </div>
        );
      case "rectangle":
        return (
          <div
            ref={targetRef}
            className="rectangle sheet-option"
            style={{
              ...style,
              width: style?.width || 50,
              height: style?.height || 50,
              border: "1px solid lightgray",
            }}
            onClick={handleClick}
          ></div>
        );
      case "line":
        return (
          <div
            ref={targetRef}
            className="target sheet-option"
            style={{
              width: style?.width || 50,
              height: style?.height || 0,
              border: "1px solid lightgray",
            }}
          ></div>
        );
      case "circle":
        return (
          <div
            ref={targetRef}
            className="circle sheet-option"
            style={{
              ...style,
              ...dimensions,
              borderRadius: "50%",
              border: "1px solid lightgray",
            }}
            onClick={handleClick}
          ></div>
        );
      case "text":
        return (
          <div
            ref={targetRef}
            id={`editable-${id}`}
            contentEditable="true"
            onInput={handleInput}
            className="sheet-option"
            style={{
              ...style,
              ...dimensions,
              outline: "none",
            }}
            onClick={handleClick}
          >
            {editableContent}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {renderComponent()}
      {isSelected && (
        <Moveable
          target={target}
          draggable={true}
          scalable={true}
          keepRatio={true}
          rotatable={true}
          onDragStart={helper.onDragStart}
          onDrag={helper.onDrag}
          onScaleStart={helper.onScaleStart}
          onScale={(e) => {
            helper.onScale(e);
            const { target } = e;
            if (target instanceof HTMLElement) {
              const rect = target.getBoundingClientRect();
              const width = rect.width;
              const height = target.clientHeight;
              updateFieldSize(id, {
                width: width,
                height: height,
              });
            }
          }}
          onRotateStart={helper.onRotateStart}
          onRotate={helper.onRotate}
        />
      )}
    </>
  );
};

export default RenderField;
