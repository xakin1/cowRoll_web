import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { saveFile } from "../../../services/codeApi";
import {
  CharacterSheetContext,
  CharacterSheetProvider,
} from "./CharacterSheetContext";
import FieldContainer from "./FieldContainer";
import FieldMenu from "./FieldMenu";
import PropertiesPanel from "./PropertiesPanel";
import "./styles.css";
import type { Field } from "./types";

const CharacterSheet: React.FC = () => {
  const [selectedElement, setSelectedElement] = useState<Field | null>(null);
  const { id } = useParams<{ id: string }>();

  const context = useContext(CharacterSheetContext);
  if (!context) {
    throw new Error(
      "CharacterSheet must be used within a CharacterSheetProvider"
    );
  }
  const { updateFieldStyle } = context;

  const handleUpdate = (name: string, value: string | number) => {
    if (selectedElement) {
      updateFieldStyle(selectedElement.id, { [name]: value });

      setSelectedElement((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          style:
            name !== "width" && name !== "height"
              ? { ...prev.style, [name]: value }
              : prev.style,
        };
      });
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (
      !target.closest(".properties-panel") &&
      !target.closest(".select-options")
    ) {
      setSelectedElement(null);
    }
  };

  const handleSaveClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    if (id) {
      await saveFile({ id: id });
    }
  };

  useEffect(() => {
    const handleSave = async (event: KeyboardEvent) => {
      if (event.ctrlKey && (event.key === "s" || event.key === "S")) {
        saveFile({ id: id! });
      }
    };

    window.addEventListener("keydown", handleSave);
    return () => window.removeEventListener("keydown", handleSave);
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="container-parent">
      <FieldMenu />
      <div className="sheetContainer">
        <h2>Character Sheet</h2>
        <button onClick={handleSaveClick}>Guardar</button>

        <FieldContainer setSelectedElement={setSelectedElement} />
      </div>
      {selectedElement && (
        <div
          className="properties-panel-wrapper"
          onClick={(e) => e.stopPropagation()}
        >
          <PropertiesPanel
            selectedElement={selectedElement}
            onUpdate={handleUpdate}
          />
        </div>
      )}
    </div>
  );
};

const WrappedCharacterSheet: React.FC = () => (
  <CharacterSheetProvider>
    <CharacterSheet />
  </CharacterSheetProvider>
);

export default WrappedCharacterSheet;
