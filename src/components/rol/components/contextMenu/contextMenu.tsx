import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Paper from "@mui/material/Paper";
import i18n from "../../../../i18n/i18n";

interface IconMenuProps {
  handleEdit: () => void;
  handleDelete: () => void;
}

export default function ContextualMenu({
  handleEdit,
  handleDelete,
}: IconMenuProps) {
  return (
    <Paper sx={{ width: 320, maxWidth: "100%" }}>
      <MenuList>
        <MenuItem key="edit" onClick={handleEdit}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{i18n.t("ContextualMenu.edit")}</ListItemText>
        </MenuItem>
        <MenuItem key="delete" onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{i18n.t("ContextualMenu.delete")}</ListItemText>
        </MenuItem>
      </MenuList>
    </Paper>
  );
}
