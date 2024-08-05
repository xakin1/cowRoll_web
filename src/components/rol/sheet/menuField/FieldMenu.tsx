import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SettingsSuggestRoundedIcon from "@mui/icons-material/SettingsSuggestRounded";
import {
  IconButton,
  MenuItem as ItemMenu,
  ListItemIcon,
  ListItemText,
  Menu,
} from "@mui/material";
import React, { useContext, useState } from "react";
import Draggable from "react-draggable";
import i18n from "../../../../i18n/i18n";
import { SheetContext } from "../SheetContext";
import type { MenuItemProps } from "../types";
import MenuField, { menuFields } from "./MenuFields";
import "./menu.css";

export const iconStyle = { fill: "var(--text-color)" };

const FieldMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { mode } = useContext(SheetContext)!;

  // New state to control draggable
  const [isDraggable, setIsDraggable] = useState(true);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const context = useContext(SheetContext);
  if (!context) {
    throw new Error("Sheet must be used within a SheetProvider");
  }
  const { currentSheetIndex, addSheet, removeSheet, changeMode } = context;

  return (
    <Draggable disabled={!isDraggable}>
      <div className="menu">
        {menuFields.map((field) => (
          <MenuItem
            key={field.id}
            field={field}
            setIsDraggable={setIsDraggable} // Pass down the function to control draggable state
          />
        ))}
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon sx={iconStyle} />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <ItemMenu
            onClick={() => {
              addSheet();
              handleClose();
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary={i18n.t("Rol.Sheet.General.newSheet")} />
          </ItemMenu>
          <ItemMenu
            onClick={() => {
              removeSheet(currentSheetIndex);
              handleClose();
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText primary={i18n.t("Rol.Sheet.General.deleteSheet")} />
          </ItemMenu>
          <ItemMenu
            onClick={() => {
              changeMode(!mode);
              handleClose();
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <SettingsSuggestRoundedIcon />
            </ListItemIcon>
            <ListItemText primary={i18n.t("Rol.Sheet.General.changeMode")} />
          </ItemMenu>
        </Menu>
      </div>
    </Draggable>
  );
};

const MenuItem: React.FC<
  MenuItemProps & { setIsDraggable: (draggable: boolean) => void }
> = ({ field, setIsDraggable }) => {
  return <MenuField type={field.type} setIsDraggable={setIsDraggable} />;
};

export default FieldMenu;
