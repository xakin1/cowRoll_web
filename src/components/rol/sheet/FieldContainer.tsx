import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
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
  isOutsideClick: boolean;
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
  const [contextMenu, setContextMenu] = useState<FieldContextMenuProps>({
    visible: false,
    position: { x: 0, y: 0 },
    field: null,
    isOutsideClick: false,
  });
  const [clipboard, setClipboard] = useState<Field | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [, drop] = useDrop(
    () => ({
      accept: ["field", "menuItem"],
      drop: (item: Field | FieldWithoutId, monitor) => {
        const delta = monitor.getDifferenceFromInitialOffset();
        const containerRect = containerRef.current?.getBoundingClientRect();
        const initialClientOffset = monitor.getInitialClientOffset();
        const clientOffset = monitor.getClientOffset();
        let position;

        if (!delta || !containerRect || !initialClientOffset || !clientOffset)
          return;

        // Calculando la posición correcta dentro del contenedor
        position = {
          x: Math.max(clientOffset.x - containerRect.left, 0),
          y: Math.max(clientOffset.y - containerRect.top, 0),
        };

        if (monitor.getItemType() === "menuItem") {
          addField(item as FieldWithoutId, {
            top: `${position.y}px`,
            left: `${position.x}px`,
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

  // Combined ref function
  const setRefs = useCallback(
    (node: HTMLDivElement) => {
      containerRef.current = node;
      drop(node);
    },
    [drop]
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
        handlePasteHere();
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

  const handleContextMenu =
    (field: Field | null) => (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const isOutsideClick = field === null;

      setContextMenu({
        visible: true,
        position: { x: event.clientX, y: event.clientY },
        field: field,
        isOutsideClick,
      });
    };

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest(".field") && !target.closest(".properties-panel")) {
      setSelectedElement(null);
      setContextMenu({ ...contextMenu, visible: false, isOutsideClick: true });
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

  const handlePasteHere = () => {
    if (clipboard && containerRef.current) {
      const { x, y } = contextMenu.position;
      const containerRect = containerRef.current.getBoundingClientRect();

      const newPosX = x - containerRect.left;
      const newPosY = y - containerRect.top;

      const newField = {
        ...clipboard,
        id: Date.now(),
        style: { ...clipboard.style, top: newPosY, left: newPosX },
      };

      addField(newField, { top: newPosY, left: newPosX });
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

      <div
        ref={setRefs}
        className="containerDrop"
        onContextMenu={handleContextMenu(null)}
      >
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
              clipboard={clipboard}
              showPasteOnly={contextMenu.isOutsideClick}
              handleCopy={() => handleCopy(contextMenu.field!)}
              handleCut={() => handleCut(contextMenu.field!)}
              handlePaste={handlePaste}
              handlePasteHere={handlePasteHere}
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
