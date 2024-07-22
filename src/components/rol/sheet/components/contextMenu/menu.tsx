import Backward from "@mui/icons-material/ArrowBack";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import ContentCopy from "@mui/icons-material/ContentCopy";
import ContentCut from "@mui/icons-material/ContentCut";
import ContentPaste from "@mui/icons-material/ContentPaste";
import DeleteIcon from "@mui/icons-material/Delete";
import Forward from "@mui/icons-material/Forward";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import i18n from "../../../../../i18n/i18n";
import type { ClipBoard } from "../../types";

interface IconMenuProps {
  showPasteOnly: boolean;
  clipboard: ClipBoard;
  handleCopy: () => void;
  handleCut: () => void;
  handlePaste: () => void;
  handlePasteHere: () => void;
  handleUp: () => void;
  handleDown: () => void;
  handleForward: () => void;
  handleBackward: () => void;
  handleDelete: () => void;
}

export default function ContextualMenu({
  showPasteOnly,
  clipboard,
  handleCopy,
  handleCut,
  handlePaste,
  handlePasteHere,
  handleUp,
  handleDown,
  handleForward,
  handleBackward,
  handleDelete,
}: IconMenuProps) {
  const isPasteDisabled = clipboard === null;

  return (
    <Paper sx={{ width: 320, maxWidth: "100%" }}>
      <MenuList>
        {showPasteOnly
          ? [
              <MenuItem
                key="paste"
                onClick={handlePasteHere}
                disabled={isPasteDisabled}
              >
                <ListItemIcon>
                  <ContentPaste fontSize="small" />
                </ListItemIcon>
                <ListItemText>
                  {i18n.t("ContextualMenu.pasteHere")}
                </ListItemText>
                <Typography variant="body2" color="text.secondary">
                  Ctrl + V
                </Typography>
              </MenuItem>,
            ]
          : [
              <MenuItem key="cut" onClick={handleCut}>
                <ListItemIcon>
                  <ContentCut fontSize="small" />
                </ListItemIcon>
                <ListItemText>{i18n.t("ContextualMenu.cut")}</ListItemText>
                <Typography variant="body2" color="text.secondary">
                  Ctrl + X
                </Typography>
              </MenuItem>,
              <MenuItem key="copy" onClick={handleCopy}>
                <ListItemIcon>
                  <ContentCopy fontSize="small" />
                </ListItemIcon>
                <ListItemText>{i18n.t("ContextualMenu.copy")}</ListItemText>
                <Typography variant="body2" color="text.secondary">
                  Ctrl + C
                </Typography>
              </MenuItem>,
              <MenuItem
                key="paste"
                onClick={handlePaste}
                disabled={isPasteDisabled}
              >
                <ListItemIcon>
                  <ContentPaste fontSize="small" />
                </ListItemIcon>
                <ListItemText>{i18n.t("ContextualMenu.paste")}</ListItemText>
                <Typography variant="body2" color="text.secondary">
                  Ctrl + V
                </Typography>
              </MenuItem>,
              <MenuItem key="delete" onClick={handleDelete}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{i18n.t("ContextualMenu.delete")}</ListItemText>
                <Typography variant="body2" color="text.secondary">
                  supr
                </Typography>
              </MenuItem>,
              <Divider key="divider" />,
              <MenuItem key="forward" onClick={handleForward}>
                <ListItemIcon>
                  <Forward fontSize="small" />
                </ListItemIcon>
                <ListItemText>
                  {i18n.t("ContextualMenu.moveForward")}
                </ListItemText>
              </MenuItem>,
              <MenuItem key="backward" onClick={handleBackward}>
                <ListItemIcon>
                  <Backward fontSize="small" />
                </ListItemIcon>
                <ListItemText>
                  {i18n.t("ContextualMenu.moveBackward")}
                </ListItemText>
              </MenuItem>,
              <MenuItem key="up" onClick={handleUp}>
                <ListItemIcon>
                  <ArrowUpward fontSize="small" />
                </ListItemIcon>
                <ListItemText>
                  {i18n.t("ContextualMenu.moveFront")}
                </ListItemText>
              </MenuItem>,
              <MenuItem key="down" onClick={handleDown}>
                <ListItemIcon>
                  <ArrowDownward fontSize="small" />
                </ListItemIcon>
                <ListItemText>{i18n.t("ContextualMenu.moveBack")}</ListItemText>
              </MenuItem>,
            ]}
      </MenuList>
    </Paper>
  );
}
