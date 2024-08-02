import React, { useEffect, useRef, useState } from "react";
import RenderField from "./RenderFields";
import "./styles.css";
import type { DraggableFieldProps, Id } from "./types";

const PageField: React.FC<DraggableFieldProps> = ({
  id,
  type,
  name,
  tags = [],
  value,
  label,
  style,
  setSelectedElement,
  onContextMenu,
  onChange,
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const renderFieldRef = useRef<HTMLDivElement>(null);

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
        name,
        tags,
        value,
        style: {
          ...styles,
          position: "absolute" as "absolute",
        },
      });
    }
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

  const handleChange = (newStyle: { [key: string]: any }) => {
    if (onChange) {
      onChange(id, newStyle);
    }
  };

  return (
    <>
      <div
        className={`field`}
        onContextMenu={(e) =>
          onContextMenu(e, { id, type, name, tags, label, style })
        }
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <RenderField
          ref={renderFieldRef}
          type={type}
          label={label}
          name={type}
          value={value}
          tags={[]}
          style={{ position: "absolute", zIndex: 1, ...style }}
          id={id}
          onChange={handleChange}
          isSelected={isSelected}
          onSelect={() => handleSelect(id)}
        />
      </div>
    </>
  );
};

export default PageField;
