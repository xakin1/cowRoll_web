import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SaveIcon from "@mui/icons-material/Save";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../../../hooks/customHooks";
import i18n from "../../../../i18n/i18n";
import type { RootState } from "../../../../redux/store";
import {
  FileSystemEnum,
  type EditSheetProps,
} from "../../../../utils/types/ApiTypes";
import {
  CharacterSheetContext,
  CharacterSheetProvider,
} from "../CharacterSheetContext";
import FieldContainer from "../FieldContainer";
import FieldMenu from "../FieldMenu";
import { PageSelector } from "../components/pageSelector/PageSelector";
import PropertiesPanel from "../propertiesPanel/PropertiesPanel";
import type { Field } from "../types";
import "./characterSheet.css";
const CharacterSheet: React.FC = () => {
  const { sheetId } = useParams<{ sheetId: string }>();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
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
    removeSheet,
    nextSheet,
    previousSheet,
    goToSheet,
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
      <div className="container-parent__sheetContainer ">
        <header className="container-parent__sheetContainer__header">
          <button
            className="container-parent__sheetContainer__header__saveSheet"
            onClick={handleSave}
          >
            {i18n.t("Rol.Sheet.General.save")}
            <SaveIcon></SaveIcon>
          </button>
          <h2>{i18n.t("Rol.Sheet.General.characterSheet")}</h2>
          <div>
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="long-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem
                onClick={() => {
                  addSheet();
                  handleClose();
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary={i18n.t("Rol.Sheet.General.newSheet")} />
              </MenuItem>
              <MenuItem
                onClick={() => {
                  removeSheet(currentSheetIndex);
                  handleClose();
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <DeleteIcon />
                </ListItemIcon>
                <ListItemText
                  primary={i18n.t("Rol.Sheet.General.deleteSheet")}
                />
              </MenuItem>
            </Menu>
          </div>
        </header>

        <FieldContainer
          setSelectedElement={setSelectedElement}
          fields={sheets[currentSheetIndex]}
        />
        <PageSelector
          previousPage={previousSheet}
          nextPage={nextSheet}
          currentSheetIndex={currentSheetIndex}
          totalSheets={sheets.length}
          goToPage={goToSheet}
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
