import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../../../hooks/customHooks";
import type { RootState } from "../../../../redux/store";
import Page from "../Page";
import { SheetContext } from "../SheetContext";
import FieldMenu from "../menuField/FieldMenu";
import PropertiesPanel from "../propertiesPanel/PropertiesPanel";
import { type Field } from "../types";

import { findNodeById, isSheetsProps } from "../../../../utils/types/ApiTypes";
import type { BlocklyRefProps } from "../../editor/blockyEditor/BlocklyEditor";
import WorkSpace from "../../editor/terminal/WorkSpace";
import "./sheetWorkSpace.css";

export const SheetWorkSpace: React.FC = () => {
  const { sheetId } = useParams<{ sheetId: string }>();

  const [selectedElement, setSelectedElement] = useState<Field | null>(null);
  const directorySystem = useAppSelector(
    (state: RootState) => state.directorySystem.directorySystem
  );

  const blocklyRef = useRef<BlocklyRefProps>(null);

  const context = useContext(SheetContext);
  if (!context) {
    throw new Error("SheetWorkSpace must be used within a SheetProvider");
  }

  const {
    sheets,
    currentSheetIndex,
    handleExecuteCode,
    updateFieldStyle,
    setSheet,
    loadFields,
    updateField,
    setBlocklyRef,
    mode,
  } = context;

  const handleUpdateStyle = (name: string, value: string | number) => {
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
    const sheet =
      directorySystem && sheetId
        ? findNodeById(directorySystem, sheetId)
        : null;

    if (sheet && isSheetsProps(sheet)) {
      setSheet(sheet);
      if (!sheet.name.endsWith(".pdf")) {
        loadFields();
      }
    }
  }, []);

  useEffect(() => {
    setBlocklyRef(blocklyRef);
  }, [setBlocklyRef]);

  return (
    <>
      <FieldMenu />
      <div className="container-parent">
        <div className="container-page">
          <Page
            setSelectedElement={setSelectedElement}
            fields={sheets[currentSheetIndex]}
          />
        </div>
        {mode && (
          <div className="container-blockly">
            <WorkSpace
              ref={blocklyRef}
              directoryId={sheetId}
              className="codeWorkSpace"
              handleExecuteCode={handleExecuteCode}
            />
          </div>
        )}
        {selectedElement && (
          <div
            className="properties-panel-wrapper"
            onClick={(e) => e.stopPropagation()}
          >
            <PropertiesPanel
              selectedElement={selectedElement}
              onUpdateStyle={handleUpdateStyle}
              onUpdateField={updateField}
            />
          </div>
        )}
      </div>
    </>
  );
};
