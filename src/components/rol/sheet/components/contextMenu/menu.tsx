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

interface IconMenuProps {
  handleCopy: () => void;
  handleCut: () => void;
  handlePaste: () => void;
  handleUp: () => void;
  handleDown: () => void;
  handleForward: () => void;
  handleBackward: () => void;
  handleDelete: () => void;
}

export default function ContextualMenu({
  handleCopy,
  handleCut,
  handlePaste,
  handleUp,
  handleDown,
  handleForward,
  handleBackward,
  handleDelete,
}: IconMenuProps) {
  return (
    <Paper sx={{ width: 320, maxWidth: "100%" }}>
      <MenuList>
        <MenuItem onClick={handleCut}>
          <ListItemIcon>
            <ContentCut fontSize="small" />
          </ListItemIcon>
          <ListItemText>Cut</ListItemText>
          <Typography variant="body2" color="text.secondary">
            Ctrl + X
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleCopy}>
          <ListItemIcon>
            <ContentCopy fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copy</ListItemText>
          <Typography variant="body2" color="text.secondary">
            Ctrl + C
          </Typography>
        </MenuItem>
        <MenuItem onClick={handlePaste}>
          <ListItemIcon>
            <ContentPaste fontSize="small" />
          </ListItemIcon>
          <ListItemText>Paste</ListItemText>
          <Typography variant="body2" color="text.secondary">
            Ctrl + V
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
          <Typography variant="body2" color="text.secondary">
            supr
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleForward}>
          <ListItemIcon>
            <Forward fontSize="small" />
          </ListItemIcon>
          <ListItemText>Move Forward</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleBackward}>
          <ListItemIcon>
            <Backward fontSize="small" />
          </ListItemIcon>
          <ListItemText>Move Backward</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleUp}>
          <ListItemIcon>
            <ArrowUpward fontSize="small" />
          </ListItemIcon>
          <ListItemText>Move to Front</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDown}>
          <ListItemIcon>
            <ArrowDownward fontSize="small" />
          </ListItemIcon>
          <ListItemText>Move to Back</ListItemText>
        </MenuItem>
      </MenuList>
    </Paper>
  );
}
