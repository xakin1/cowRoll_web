import React, { useContext, useEffect, useRef, useState } from "react";
import { useDrop } from "react-dnd";
import { useParams } from "react-router-dom";
import { CharacterSheetContext } from "./CharacterSheetContext";
import DraggableField from "./DraggableField";
import ContextualMenu from "./components/contextMenu/menu";
import "./styles.css";
import type { Field, FieldWithoutId } from "./types";

interface FieldContainerProps {
  setSelectedElement: (element: Field | null) => void;
}

const FieldContainer: React.FC<FieldContainerProps> = ({
  setSelectedElement,
}) => {
  const { fields, addField, saveFile, updateFieldStyle } = useContext(
    CharacterSheetContext
  )!;
  const { id } = useParams<{ id: string }>();

  const [, drop] = useDrop(
    () => ({
      accept: ["field", "menuItem"],
      drop: (item: Field | FieldWithoutId, monitor) => {
        const delta = monitor.getDifferenceFromInitialOffset();
        const containerRect = document
          .querySelector(".containerDrop")
          ?.getBoundingClientRect();
        const clientOffset = monitor.getClientOffset();
        let position;

        if (!delta || !containerRect || !clientOffset) return;

        position = {
          x: Math.max(clientOffset.x - containerRect.left, 0),
          y: Math.max(clientOffset.y - containerRect.top, 0),
        };

        if (monitor.getItemType() === "menuItem") {
          addField(item as FieldWithoutId, {
            top: position.y,
            left: position.x,
          });
        } else {
          updateFieldStyle((item as Field).id, {
            top: position.y,
            left: position.x,
          });
        }
      },
    }),
    [addField, updateFieldStyle]
  );

  useEffect(() => {
    const handleSave = async (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        if (id) {
          await saveFile({ id: id });
        }
      }
    };

    window.addEventListener("keydown", handleSave);
    return () => window.removeEventListener("keydown", handleSave);
  }, [saveFile, id]);

  const handleSaveClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    if (id) {
      await saveFile({ id: id });
    }
  };

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    position: { x: 0, y: 0 },
    fieldId: 0,
  });
  const menuRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (id: number) => (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      position: { x: event.clientX, y: event.clientY },
      fieldId: id,
    });
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setContextMenu({ ...contextMenu, visible: false });
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [contextMenu]);

  const handleDelete = (id: number) => {
    console.log(`Delete field ${id}`);
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleCopy = () => {
    console.log("Copy action");
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleCut = () => {
    console.log("Cut action");
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handlePaste = () => {
    console.log("Paste action");
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleUp = () => {
    console.log("Move to front action");
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleDown = () => {
    console.log("Move to back action");
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleForward = () => {
    console.log("Move forward action");
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleBackward = () => {
    console.log("Move backward action");
    setContextMenu({ ...contextMenu, visible: false });
  };

  return (
    <>
      <button onClick={handleSaveClick}>Guardar</button>

      <div ref={drop} className="containerDrop">
        {fields.map((field) => (
          <DraggableField
            onContextMenu={handleContextMenu}
            key={field.id}
            {...field}
            setSelectedElement={setSelectedElement}
          />
        ))}
        {contextMenu.visible && (
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: contextMenu.position.y,
              left: contextMenu.position.x,
              zIndex: 10,
            }}
          >
            <ContextualMenu
              handleCopy={handleCopy}
              handleCut={handleCut}
              handlePaste={handlePaste}
              handleUp={handleUp}
              handleDown={handleDown}
              handleForward={handleForward}
              handleBackward={handleBackward}
              handleDelete={() => handleDelete(contextMenu.fieldId)}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default FieldContainer;
