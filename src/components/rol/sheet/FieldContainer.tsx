import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDrop } from "react-dnd";
import { CharacterSheetContext } from "./CharacterSheetContext";
import DraggableField from "./DraggableField";
import ContextualMenu from "./components/contextMenu/menu";
import "./styles.css";
import type { Field, FieldWithoutId, Id } from "./types";

interface FieldContainerProps {
  setSelectedElement: (element: Field | null) => void;
  fields: Field[];
}

interface FieldContextMenuProps {
  visible: boolean;
  position: { x: number; y: number };
  field: Field | null;
  isOutsideClick: boolean;
}

const FieldContainer: React.FC<FieldContainerProps> = ({
  fields,
  setSelectedElement,
}) => {
  const { addField, removeField, updateFieldStyle } = useContext(
    CharacterSheetContext
  )!;
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
            top: `${position.y}px`,
            left: `${position.x}px`,
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
      if (event.ctrlKey && event.key === "c") {
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
  }, [selectedElement]);

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

  const handleDelete = (id: Id) => {
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

      const fieldToInsert = {
        ...clipboard,
        style: {
          top: newPosY,
          left: newPosX,
          ...clipboard.style,
        },
      };

      const newField = addField(fieldToInsert, { top: newPosY, left: newPosX });
      setClipboard(newField);
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
        id: Date.now().toString(),
        style: {
          ...clipboard.style,
          top: `${newPosY}px`,
          left: `${newPosX}px`,
        },
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
      <div
        ref={setRefs}
        className="containerDrop"
        onContextMenu={handleContextMenu(null)}
      >
        {fields.map((field) => (
          <DraggableField
            onContextMenu={handleContextMenu(field)}
            onChange={updateFieldStyle}
            key={field.id}
            {...field}
            setSelectedElement={(element) => {
              setSelectedElement(element);
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
