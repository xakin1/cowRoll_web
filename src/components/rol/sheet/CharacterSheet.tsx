import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../../hooks/customHooks";
import i18n from "../../../i18n/i18n";
import type { RootState } from "../../../redux/store";
import {
  FileSystemEnum,
  type EditSheetProps,
} from "../../../utils/types/ApiTypes";
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
  const { sheetId } = useParams<{ sheetId: string }>();
  const [selectedElement, setSelectedElement] = useState<Field | null>(null);
  const directorySystem = useAppSelector(
    (state: RootState) => state.directorySystem.directorySystem
  );

  const context = useContext(CharacterSheetContext);
  if (!context) {
    throw new Error(
      "CharacterSheet must be used within a CharacterSheetProvider"
    );
  }
  const {
    sheets,
    currentSheetIndex,
    updateFieldStyle,
    saveFields,
    loadFields,
    addSheet,
    nextSheet,
    previousSheet,
  } = context;

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

  useEffect(() => {
    if (directorySystem && sheetId) {
      loadFields(directorySystem, sheetId);
    }
  }, [sheetId]);

  return (
    <div className="container-parent">
      <FieldMenu />
      <div className="sheetContainer">
        <h2>{i18n.t("Rol.Sheet.General.characterSheet")}</h2>
        <button onClick={handleSave}>{i18n.t("Rol.Sheet.General.save")}</button>
        <button onClick={addSheet}>
          {i18n.t("Rol.Sheet.General.newSheet")}
        </button>
        <button onClick={previousSheet} disabled={currentSheetIndex === 0}>
          {i18n.t("Rol.Sheet.General.previousSheet")}
        </button>
        <button
          onClick={nextSheet}
          disabled={currentSheetIndex === sheets.length - 1}
        >
          {i18n.t("Rol.Sheet.General.nextSheet")}
        </button>

        <FieldContainer
          setSelectedElement={setSelectedElement}
          fields={sheets[currentSheetIndex]}
        />
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
