import React, { useEffect, useRef, useState } from "react";
import { useDrag } from "react-dnd";
import RenderField from "./RenderFields";
import "./styles.css";
import type { DraggableFieldProps } from "./types";

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

  const [{ isDragging }, preview] = useDrag(
    () => ({
      type: "field",
      item: { id, type },
      canDrag: () => !isSelected,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [id, type, isSelected]
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

  const handleSelect = (selectedId: number) => {
    setIsSelected(selectedId === id);
    const styles = getInlineStyles();
    if (setSelectedElement) {
      setSelectedElement({
        id,
        type,
        label,
        style: {
          ...styles,
          position: "absolute" as "absolute", // Asegurarse de que 'position' tenga el tipo correcto
        },
      });
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest(".field") && !target.closest(".properties-panel")) {
      setIsSelected(false);
      setSelectedElement(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const divStyle: React.CSSProperties = {
    opacity: isDragging ? 0.5 : 1,
    position: "relative",
  };

  return (
    <>
      <div
        ref={preview}
        className={`field ${isSelected ? "selected" : ""}`}
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
