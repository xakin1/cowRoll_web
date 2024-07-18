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

interface FieldContextMenuProps {
  visible: boolean;
  position: { x: number; y: number };
  field: Field | null;
}

const FieldContainer: React.FC<FieldContainerProps> = ({
  setSelectedElement,
}) => {
  const { fields, addField, saveFile, removeField, updateFieldStyle } =
    useContext(CharacterSheetContext)!;
  const { id } = useParams<{ id: string }>();
  const [selectedElement, setSelectedElementState] = useState<Field | null>(
    null
  );
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
    const handleKeyDown = async (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        if (id) {
          await saveFile({ id: id });
        }
      } else if (event.ctrlKey && event.key === "c") {
        if (selectedElement) {
          handleCopy(selectedElement);
        }
      } else if (event.ctrlKey && event.key === "v") {
        handlePaste();
      } else if (event.ctrlKey && event.key === "x") {
        if (selectedElement) {
          handleCut(selectedElement);
        }
      } else if (event.key === "Delete") {
        if (selectedElement) {
          removeField(selectedElement.id);
          setSelectedElement(null);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [saveFile, id, selectedElement]);

  const handleSaveClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    if (id) {
      await saveFile({ id: id });
    }
  };

  const [contextMenu, setContextMenu] = useState<FieldContextMenuProps>({
    visible: false,
    position: { x: 0, y: 0 },
    field: null,
  });
  const [clipboard, setClipboard] = useState<Field | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (field: Field) => (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      position: { x: event.clientX, y: event.clientY },
      field: field,
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
    removeField(id);
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleCopy = (field: Field) => {
    setClipboard(field);
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleCut = (field: Field) => {
    setClipboard(field);
    removeField(field.id);
    setSelectedElement(null);
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handlePaste = () => {
    if (clipboard) {
      const newPosX = clipboard.style.left + 10;
      const newPosY = clipboard.style.top + 10;

      const newField = { ...clipboard, id: undefined };

      addField(newField, { top: newPosY, left: newPosX });

      setClipboard((prevClipboard) => ({
        ...prevClipboard!,
        style: { ...prevClipboard!.style, top: newPosY, left: newPosX },
      }));
    }
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleUp = (field: Field) => {
    updateFieldStyle(field.id, { zIndex: field.style.zIndex + 1 });

    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleDown = (field: Field) => {
    updateFieldStyle(field.id, { zIndex: field.style.zIndex - 1 });

    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleForward = (field: Field) => {
    updateFieldStyle(field.id, { zIndex: 100 });
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleBackward = (field: Field) => {
    updateFieldStyle(field.id, { zIndex: 0 });
    setContextMenu({ ...contextMenu, visible: false });
  };

  return (
    <>
      <button onClick={handleSaveClick}>Guardar</button>

      <div ref={drop} className="containerDrop">
        {fields.map((field) => (
          <DraggableField
            onContextMenu={handleContextMenu(field)}
            key={field.id}
            {...field}
            setSelectedElement={(element) => {
              setSelectedElement(field);
              setSelectedElementState(element);
            }}
          />
        ))}
        {contextMenu.visible && (
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: contextMenu.position.y,
              left: contextMenu.position.x,
              zIndex: 999,
            }}
          >
            <ContextualMenu
              handleCopy={() => handleCopy(contextMenu.field!)}
              handleCut={() => handleCut(contextMenu.field!)}
              handlePaste={handlePaste}
              handleUp={() => handleUp(contextMenu.field!)}
              handleDown={() => handleDown(contextMenu.field!)}
              handleForward={() => handleForward(contextMenu.field!)}
              handleBackward={() => handleBackward(contextMenu.field!)}
              handleDelete={() => handleDelete(contextMenu.field!.id)}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default FieldContainer;
