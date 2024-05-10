import ReactDOM from "react-dom";
import { getI18N } from "../../../i18n";
import { getLang } from "../../../i18n/utils";
import {
  createDirectory,
  createFile,
  deleteDirectory,
  deleteFile,
  editDirectory,
  editFile,
} from "../../../services/codeApi";
import type { ContextMenuProps } from "../../../utils/types/types";
import "./contextMenu.css";

const i18n = getI18N({ currentLocale: getLang() });

export function ContextMenu({
  x,
  y,
  items,
  onClose,
  onAddNode,
  handleOpenModal,
}: ContextMenuProps) {
  if (!items) return null;

  // Single operation assuming only single item is passed when needed
  const singleItem = items.length === 1 ? items[0] : null;

  // Insert File or Directory
  const handleInsert = async (name: string, type: "File" | "Directory") => {
    if (singleItem && singleItem.type === "Directory") {
      const data = {
        name: name,
        directoryId: type === "File" ? singleItem.id : undefined,
        parentId: type === "Directory" ? singleItem.id : undefined,
      };
      const response =
        type === "File"
          ? await createFile(1, data)
          : await createDirectory(1, data);
      if (response && "message" in response) {
        onAddNode();
      }
    }
  };

  // Rename File or Directory
  const handleChangeName = async (name: string) => {
    if (singleItem) {
      const data = {
        name: name,
        id: singleItem.id,
      };
      const response =
        singleItem.type === "Directory"
          ? await editDirectory(1, data)
          : await editFile(1, data);
      if (response) {
        onAddNode();
      }
    }
  };

  // Delete Items
  const handleDeleteItems = async () => {
    for (const item of items) {
      if (item.type === "Directory") await deleteDirectory(1, item.id);
      else await deleteFile(1, item.id);
    }
    onAddNode();
  };

  const menu = (
    <ul
      className="context-menu"
      style={{ top: y + "px", left: x + "px", position: "absolute" }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {singleItem && singleItem.type === "Directory" && items.length === 1 && (
        <>
          <li onClick={() => handleInsert("", "File")}>
            {i18n.t("ContextualMenu.newFile")}
          </li>
          <li onClick={() => handleInsert("", "Directory")}>
            {i18n.t("ContextualMenu.newFolder")}
          </li>
        </>
      )}
      {singleItem && (
        <li onClick={() => handleChangeName("")}>
          {i18n.t("ContextualMenu.renameFile")}
        </li>
      )}
      <li
        onClick={() => {
          const message =
            items.length > 1
              ? i18n.t(
                  "ContextualMenu.Modal.multipleDelete",
                  items.length.toString()
                )
              : singleItem?.type === "Directory"
                ? i18n.t("ContextualMenu.Modal.deleteFolder")
                : i18n.t("ContextualMenu.Modal.deleteFile");
          handleOpenModal({
            label: message,
            showInput: false,
            action: handleDeleteItems,
          });
          onClose();
        }}
      >
        {i18n.t("ContextualMenu.delete")}
      </li>
    </ul>
  );

  const portalRoot = document.getElementById("portal-root");
  if (!portalRoot) return null;

  return ReactDOM.createPortal(menu, portalRoot);
}
