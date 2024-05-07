import ReactDOM from "react-dom";
import { getI18N } from "../../../i18n";
import { getLang } from "../../../i18n/utils";
import "./contextMenu.css";

type ContextMenuProps = {
  x: number;
  y: number;
  item: any; // Considera especificar un tipo más detallado
  onClose: () => void;
};

const i18n = getI18N({ currentLocale: getLang() });

export function ContextMenu({ x, y, item, onClose }: ContextMenuProps) {
  if (!item) return null;
  const handleCreateFile = (item: any) => {
    console.log("Creating file...", item);
    onClose();
  };
  const handleCreateFolder = (item: any) => {
    console.log("Creating folder...", item);
    onClose();
  };
  const handleRename = (item: any) => {
    console.log("Renaming item...", item);
    onClose();
  };
  const handleDelete = (item: any) => {
    console.log("Deleting item...", item);
    onClose();
  };

  const menu = (
    <ul
      className="context-menu"
      style={{ top: y + "px", left: x + "px", position: "absolute" }}
    >
      <li
        onClick={() => {
          handleCreateFile(item);
          onClose();
        }}
      >
        {i18n.ContextualMenu.newFile}
      </li>
      <li
        onClick={() => {
          handleCreateFolder(item);
          onClose();
        }}
      >
        {i18n.ContextualMenu.newFolder}
      </li>
      <li
        onClick={() => {
          handleRename(item);
          onClose();
        }}
      >
        {i18n.ContextualMenu.renameFile}
      </li>
      <li
        onClick={() => {
          handleDelete(item);
          onClose();
        }}
      >
        {i18n.ContextualMenu.delete}
      </li>
    </ul>
  );

  const portalRoot = document.getElementById("portal-root");
  if (!portalRoot) return null;

  return ReactDOM.createPortal(menu, portalRoot);
}
