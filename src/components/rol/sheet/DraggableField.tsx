import React, { useEffect, useRef, useState } from "react";
import { useDrag } from "react-dnd";
import RenderField from "./RenderFields";
import "./styles.css";
import type { DraggableFieldProps, Id } from "./types";

const DraggableField: React.FC<DraggableFieldProps> = ({
  id,
  type,
  label,
  style,
  setSelectedElement,
  onContextMenu,
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const renderFieldRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: "field",
      item: { id, type, label, style },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [id, type, label, style]
  );

  const toCamelCase = (str: string) => {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  };

  const getInlineStyles = () => {
    if (renderFieldRef.current) {
      const inlineStyles = renderFieldRef.current.style;
      const styles: { [key: string]: string } = {};
      for (let i = 0; i < inlineStyles.length; i++) {
        const key = inlineStyles[i];
        const camelCaseKey = toCamelCase(key);
        styles[camelCaseKey] = inlineStyles.getPropertyValue(key);
      }
      return styles;
    }
    return {};
  };

  const handleSelect = (selectedId: Id) => {
    setIsSelected(selectedId === id);
    const styles = getInlineStyles();
    if (setSelectedElement) {
      setSelectedElement({
        id,
        type,
        label,
        style: {
          ...styles,
          position: "absolute" as "absolute",
        },
      });
    }
  };

  const divStyle: React.CSSProperties = {
    opacity: isDragging ? 0.5 : 1,
    position: "absolute",
  };

  const handleClickOutside = (event: MouseEvent) => {
    setIsSelected(false);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div
        ref={drag}
        className={`field`}
        style={divStyle}
        onContextMenu={(e) => onContextMenu(e, { id, type, label, style })}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <RenderField
          ref={renderFieldRef}
          type={type}
          label={label}
          style={{ position: "absolute", zIndex: 1, ...style }}
          id={id}
          isSelected={isSelected}
          onSelect={() => handleSelect(id)}
        />
      </div>
    </>
  );
};

export default DraggableField;
