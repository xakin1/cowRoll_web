import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../../../hooks/customHooks";
import type { RootState } from "../../../../redux/store";
import Page from "../Page";
import { SheetContext } from "../SheetContext";
import FieldMenu from "../menuField/FieldMenu";
import PropertiesPanel from "../propertiesPanel/PropertiesPanel";
import type { Field } from "../types";
import "./sheetWorkSpace.css";
export const SheetWorkSpace: React.FC = () => {
  const { sheetId } = useParams<{ sheetId: string }>();

  const [selectedElement, setSelectedElement] = useState<Field | null>(null);
  const directorySystem = useAppSelector(
    (state: RootState) => state.directorySystem.directorySystem
  );

  const context = useContext(SheetContext);
  if (!context) {
    throw new Error("Sheet must be used within a SheetProvider");
  }
  const { sheets, currentSheetIndex, updateFieldStyle, loadFields } = context;

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

  useEffect(() => {
    if (directorySystem && sheetId) {
      loadFields(directorySystem, sheetId);
    }
  }, [sheetId]);
  return (
    <>
      <FieldMenu />
      <div className="container-parent">
        <Page
          setSelectedElement={setSelectedElement}
          fields={sheets[currentSheetIndex]}
        />

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
    </>
  );
};
