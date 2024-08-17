import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FileSystemEnum,
  type EditSheetProps,
} from "../../../utils/types/ApiTypes";
import PageField from "./PageField";
import { SheetContext } from "./SheetContext";
import ContextualMenu from "./components/contextMenu/menu";
import { PageSelector } from "./components/pageSelector/PageSelector";
import "./styles.css";
import type { Field, Id } from "./types";

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

const Page: React.FC<FieldContainerProps> = ({
  fields,
  setSelectedElement,
}) => {
  const {
    sheets,
    isContextMenuVisible,
    setIsContextMenuVisible,
    saveFields,
    currentSheetIndex,
    updateFieldStyle,
    updatePartialField,
    addField,
    removeField,
    nextSheet,
    previousSheet,
    goToSheet,
  } = useContext(SheetContext)!;

  const minIndex = 2;

  const [selectedElement, setSelectedElementState] = useState<Field | null>(
    null
  );
  const { sheetId } = useParams<{ sheetId: string }>();

  const [contextMenu, setContextMenu] = useState<FieldContextMenuProps>({
    visible: false,
    position: { x: 0, y: 0 },
    field: null,
    isOutsideClick: false,
  });
  const [clipboard, setClipboard] = useState<Field | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const workAreaRef = useRef<HTMLDivElement | null>(null);

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
  }, [selectedElement, fields]);

  useEffect(() => {
    const handleSaveKeyDown = async (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        handleSave();
      }
    };

    window.addEventListener("keydown", handleSaveKeyDown);
    return () => window.removeEventListener("keydown", handleSaveKeyDown);
  }, [fields]);

  const handleContextMenu =
    (field: Field | null) => (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const isOutsideClick = field === null;
      setIsContextMenuVisible(true);
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
      setIsContextMenuVisible(false);
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
    setIsContextMenuVisible(false);
  };

  const handleCopy = (field: Field) => {
    setClipboard(field);
    setIsContextMenuVisible(false);
  };

  const handleCut = (field: Field) => {
    setClipboard(field);
    removeField(field.id);
    setSelectedElement(null);
    setIsContextMenuVisible(false);
  };

  const handlePaste = () => {
    if (clipboard) {
      const newPosX = parseInt(clipboard.style.left) + 10;
      const newPosY = parseInt(clipboard.style.top) + 10;

      const fieldToInsert = {
        ...clipboard,
        id: Date.now().toString(),
        style: {
          ...clipboard.style,
          top: `${newPosY}px`,
          left: `${newPosX}px`,
        },
      };

      const newField = addField(fieldToInsert);
      setClipboard(newField);
    }
    setIsContextMenuVisible(false);
  };

  const handlePasteHere = () => {
    if (clipboard && containerRef.current) {
      const { x, y } = contextMenu.position;
      const containerRect = workAreaRef.current?.getBoundingClientRect();
      if (!containerRect) return;
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

      addField(newField);
    }
    setIsContextMenuVisible(false);
  };

  const handleUp = (field: Field) => {
    updateFieldStyle(field.id, { zIndex: field.style.zIndex + 1 });
    setIsContextMenuVisible(false);
  };

  const handleDown = (field: Field) => {
    const index = field.style.zIndex - 1;
    updateFieldStyle(field.id, {
      zIndex: index >= minIndex ? index : minIndex,
    });
    setIsContextMenuVisible(false);
  };

  const handleForward = (field: Field) => {
    updateFieldStyle(field.id, { zIndex: 100 });
    setIsContextMenuVisible(false);
  };

  const handleBackward = (field: Field) => {
    updateFieldStyle(field.id, { zIndex: minIndex });
    setIsContextMenuVisible(false);
  };

  const handleSave = () => {
    if (sheetId) {
      const sheetProps: EditSheetProps = {
        id: sheetId,
        type: FileSystemEnum.Sheet,
      };
      saveFields(sheetProps);
    } else {
      console.error("sheetId undefined");
    }
  };
  return (
    <>
      <div className="page_container">
        <div
          ref={containerRef}
          onContextMenu={handleContextMenu(null)}
          className="page_container__page"
        >
          {fields.map((field) => (
            <PageField
              onContextMenu={handleContextMenu(field)}
              onChange={updatePartialField}
              setIsContextMenuVisible={setIsContextMenuVisible}
              key={field.id}
              {...field}
              setSelectedElement={(element) => {
                setSelectedElement(element);
                setSelectedElementState(element);
              }}
            />
          ))}
        </div>
        <PageSelector
          previousPage={previousSheet}
          nextPage={nextSheet}
          currentSheetIndex={currentSheetIndex}
          totalSheets={sheets.length}
          goToPage={goToSheet}
        />
      </div>

      {isContextMenuVisible && (
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
    </>
  );
};

export default Page;
