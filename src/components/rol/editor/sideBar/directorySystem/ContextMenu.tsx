import ReactDOM from "react-dom";
import { toast } from "react-toastify";
import { getI18N } from "../../../../../i18n";
import { getLang } from "../../../../../i18n/utils";
import {
  createDirectory,
  createFile,
  deleteDirectory,
  deleteFile,
  editDirectory,
  editFile,
} from "../../../../../services/codeApi";
import {
  FileSystemENum,
  isCodeFile,
  type CreateCodeProps,
  type insertDirectoryProps,
} from "../../../../../utils/types/ApiTypes";
import type { ContextMenuProps } from "../../../../../utils/types/types";
import { toastStyle } from "../../../../App";
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
    if (singleItem && isCodeFile(singleItem)) {
      const data: CreateCodeProps = {
        name: name,
        directoryId: singleItem.id,
        type: singleItem.type,
      };

      const response = await createFile(data);

      if (response && "message" in response) {
        onAddNode();
      } else {
        toast.error(i18n.t("Errors." + response?.error), toastStyle);
      }
    }
  };
  const handleInsertDirectory = async (name: string) => {
    if (singleItem) {
      const data: insertDirectoryProps = {
        name: name,
        parentId: singleItem.id,
        type: FileSystemENum.Directory,
      };

      const response = await createDirectory(data);
      if (response && "message" in response) {
        onAddNode();
      } else {
        toast.error(i18n.t("Errors." + response?.error), toastStyle);
      }
    }
  };

  // Rename File or Directory
  const handleChangeName = async (name: string) => {
    if (singleItem) {
      const data = {
        name: name,
        id: singleItem.id,
        type: singleItem.type,
      };
      const response =
        singleItem.type === FileSystemENum.Directory
          ? await editDirectory({
              ...data,
              type: FileSystemENum.Directory, // Para que el ts no se queje
            })
          : await editFile({
              ...data,
              type: singleItem.type as FileSystemENum.Code,
            });
      if (response && "message" in response) {
        onAddNode();
      } else {
        toast.error(i18n.t("Errors." + response?.error), toastStyle);
      }
    }
  };

  // Delete Items
  const handleDeleteItems = async () => {
    for (const item of items) {
      if (item.type === FileSystemENum.Directory)
        await deleteDirectory(item.id);
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
      {singleItem &&
        singleItem.type === FileSystemENum.Directory &&
        items.length === 1 && (
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
                ? singleItem.type == FileSystemENum.Directory
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

  const portalRoot = document.getElementById("portal-root");
  if (!portalRoot) return null;

  return ReactDOM.createPortal(menu, portalRoot);
}
