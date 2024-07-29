import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
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
  const { currentSheetIndex, addSheet, removeSheet } = context;

  return (
    <Draggable>
      <div className="menu">
        {menuFields.map((field) => (
          <MenuItem key={field.id} field={field} />
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
        </Menu>
      </div>
    </Draggable>
  );
};

const MenuItem: React.FC<MenuItemProps> = ({ field }) => {
  return <MenuField type={field.type} />;
};

export default FieldMenu;