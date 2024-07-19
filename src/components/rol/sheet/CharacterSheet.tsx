import React, { useContext, useEffect, useState } from "react";
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
