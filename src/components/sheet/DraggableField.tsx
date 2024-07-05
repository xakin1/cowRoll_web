import React, { useContext, useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import { CharacterSheetContext } from "./CharacterSheetContext";
import RenderField from "./RenderFields";
import "./styles.css";
import type { Field } from "./types";

const DraggableField: React.FC<Field> = ({
  id,
  type,
  label,
  position = { x: 0, y: 0 },
  size,
}: Field) => {
  const { removeField } = useContext(CharacterSheetContext)!;

  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [isSelected, setIsSelected] = useState(false);

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: "field",
      item: { id, type, position, size },
      canDrag: () => !isSelected,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [id, type, position, isSelected]
  );

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowMenu(true);
    setMenuPosition({ x: e.clientX, y: e.clientY });
  };

  const handleDelete = () => {
    removeField(id);
    setShowMenu(false);
  };

  const handleSelect = (selectedId: number) => {
    setIsSelected(selectedId === id);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (!(event.target as HTMLElement).closest(".field")) {
      setIsSelected(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const style = {
    left: position.x,
    top: position.y,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <>
      <div
        ref={preview}
        className={`field ${isSelected ? "selected" : ""}`}
        style={style}
        onContextMenu={handleContextMenu}
        onClick={(e) => {
          e.stopPropagation();
          handleSelect(id);
        }}
      >
        <RenderField
          type={type}
          label={label}
          style={{ position: "absolute", zIndex: 999 }}
          id={id}
          isSelected={isSelected}
          onSelect={handleSelect}
        />

        {showMenu && (
          <div
            className="contextMenu"
            style={{
              top: menuPosition.y,
              left: menuPosition.x,
            }}
          >
            <div className="menuItem" onClick={handleDelete}>
              Delete
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DraggableField;
