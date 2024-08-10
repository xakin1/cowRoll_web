import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import RectangleIcon from "@mui/icons-material/CropSquare";
import FormatShapesRoundedIcon from "@mui/icons-material/FormatShapesRounded";
import InputIcon from "@mui/icons-material/Input";
import CircleIcon from "@mui/icons-material/PanoramaFishEye";
import LineIcon from "@mui/icons-material/Remove";
import TextIncreaseRoundedIcon from "@mui/icons-material/TextIncreaseRounded";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { fields, typeField } from "../RenderFields";
import { SheetContext } from "../SheetContext";
import type { MenuFieldProps } from "../types";
import { iconStyle } from "./FieldMenu";
export const menuFields = [
  { id: "textTool", type: "textTool", label: "Text" },
  { id: "inputTool", type: "inputTool", label: "Input" },
  { id: "shapesTool", type: "shapesTool", label: "Shapes" },
  { id: "photoTool", type: "photoTool", label: "Photo" },
];

const MenuField: React.FC<
  MenuFieldProps & { setIsDraggable: (draggable: boolean) => void }
> = ({ type, setIsDraggable }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { addField } = useContext(SheetContext)!;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setIsDraggable(false); // Disable dragging when menu is open
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsDraggable(true); // Re-enable dragging when menu is closed
  };

  const handleAddField = (type: typeField) => {
    const fieldToInsert = fields.find((field) => field.type === type);
    if (fieldToInsert) addField({ ...fieldToInsert });
    handleClose();
  };

  const renderComponent = () => {
    switch (type) {
      case "textTool":
        return (
          <div className="tool-item">
            <IconButton
              aria-label="text"
              aria-controls="text-menu"
              aria-haspopup="true"
              onClick={handleClick}
            >
              <span className="tool-item-icon" title="Add Text">
                T
              </span>
            </IconButton>
            <Menu
              id="text-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
              slotProps={{
                paper: {
                  style: {
                    zIndex: 1000,
                  },
                },
              }}
            >
              <MenuItem onClick={() => handleAddField(typeField.text)}>
                <ListItemIcon>
                  <TextIncreaseRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Text" />
              </MenuItem>
              <MenuItem onClick={() => handleAddField(typeField.textarea)}>
                <ListItemIcon>
                  <FormatShapesRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Text Area" />
              </MenuItem>
            </Menu>
          </div>
        );
      case "inputTool":
        return (
          <div className="tool-item">
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={handleClick}
            >
              <InputIcon sx={iconStyle} />
            </IconButton>
            <Menu
              id="long-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
              slotProps={{
                paper: {
                  style: {
                    zIndex: 1000,
                  },
                },
              }}
            >
              <MenuItem onClick={() => handleAddField(typeField.input)}>
                Input
              </MenuItem>
              <MenuItem onClick={() => handleAddField(typeField.checkbox)}>
                Checkbox
              </MenuItem>
              <MenuItem onClick={() => handleAddField(typeField.selectable)}>
                List
              </MenuItem>
            </Menu>
          </div>
        );
      case "shapesTool":
        return (
          <div className="tool-item">
            <IconButton
              aria-label="shapes"
              aria-controls="shapes-menu"
              aria-haspopup="true"
              onClick={handleClick}
            >
              <RectangleIcon sx={iconStyle} />
            </IconButton>
            <Menu
              id="shapes-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
              slotProps={{
                paper: {
                  style: {
                    zIndex: 1000,
                  },
                },
              }}
            >
              <MenuItem onClick={() => handleAddField(typeField.rectangle)}>
                <ListItemIcon>
                  <RectangleIcon />
                </ListItemIcon>
                <ListItemText primary="Rectangle" />
              </MenuItem>
              <MenuItem onClick={() => handleAddField(typeField.circle)}>
                <ListItemIcon>
                  <CircleIcon />
                </ListItemIcon>
                <ListItemText primary="Circle" />
              </MenuItem>
              <MenuItem onClick={() => handleAddField(typeField.line)}>
                <ListItemIcon>
                  <LineIcon />
                </ListItemIcon>
                <ListItemText primary="Line" />
              </MenuItem>
            </Menu>
          </div>
        );
      case "photoTool":
        return (
          <IconButton
            aria-label="shapes"
            aria-controls="shapes-menu"
            aria-haspopup="true"
            onClick={() => handleAddField(typeField.photo)}
          >
            <AddPhotoAlternateIcon sx={iconStyle} />
          </IconButton>
        );
      default:
        return null;
    }
  };

  return <>{renderComponent()}</>;
};

export default MenuField;
