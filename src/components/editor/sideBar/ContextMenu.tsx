import ReactDOM from "react-dom";
import { toast, type ToastOptions } from "react-toastify";
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

  const singleItem = items.length === 1 ? items[0] : null;
  const handleInsertFile = async (name: string) => {
    if (singleItem) {
      const data = {
        name: name,
        directoryId: singleItem.id,
      };

      const response = await createFile(data);

      if (response && "message" in response) {
        onAddNode();
      } else {
        toast.error(i18n.t("Errors." + response?.error), tostStyle);
      }
    }
  };
  const handleInsertDirectory = async (name: string) => {
    if (singleItem) {
      const data = {
        name: name,
        parentId: singleItem.id,
      };

      const response = await createDirectory(data);
      if (response && "message" in response) {
        onAddNode();
      } else {
        toast.error(i18n.t("Errors." + response?.error), tostStyle);
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
          ? await editDirectory(data)
          : await editFile(data);
      if (response && "message" in response) {
        onAddNode();
      } else {
        toast.error(i18n.t("Errors." + response?.error), tostStyle);
      }
    }
  };

  // Delete Items
  const handleDeleteItems = async () => {
    for (const item of items) {
      if (item.type === "Directory") await deleteDirectory(item.id);
      else await deleteFile(item.id);
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
          <li
            onClick={() =>
              handleOpenModal({
                label: i18n.t("ContextualMenu.Modal.inputFileName"),
                showInput: true,
                action: handleInsertFile,
              })
            }
          >
            {i18n.t("ContextualMenu.newFile")}
          </li>
          <li
            onClick={() =>
              handleOpenModal({
                label: i18n.t("ContextualMenu.Modal.inputDirectoryName"),
                showInput: true,
                action: handleInsertDirectory,
              })
            }
          >
            {i18n.t("ContextualMenu.newFolder")}
          </li>
        </>
      )}
      {singleItem && (
        <li
          onClick={() =>
            handleOpenModal({
              label: i18n.t("ContextualMenu.Modal.renameName", singleItem.name),
              showInput: true,
              action: handleChangeName,
            })
          }
        >
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
              : singleItem
                ? singleItem.type == "Directory"
                  ? i18n.t("ContextualMenu.Modal.deleteFolder", singleItem.name)
                  : i18n.t("ContextualMenu.Modal.deleteFile", singleItem.name)
                : ""; //No debería llegar aquí nunca
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

  const tostStyle: ToastOptions<unknown> = {
    position: "bottom-right",
  };

  const portalRoot = document.getElementById("portal-root");
  if (!portalRoot) return null;

  return ReactDOM.createPortal(menu, portalRoot);
}
