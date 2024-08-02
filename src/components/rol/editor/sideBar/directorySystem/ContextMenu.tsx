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
  FileSystemEnum,
  isDirectory,
  isFile,
  isSheetsProps,
  type CreateCodeProps,
  type CreateDirectoryProps,
  type EditFileProps,
  type editDirectoryProps,
} from "../../../../../utils/types/ApiTypes";
import type { ContextMenuProps } from "../../../../../utils/types/types";
import { toastStyle } from "../../../../Route";
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
    if ((singleItem && isDirectory(singleItem)) || isSheetsProps(singleItem)) {
      const data: CreateCodeProps = {
        name: name,
        directoryId: singleItem.id,
        type: FileSystemEnum.Code,
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
      const data: CreateDirectoryProps = {
        name: name,
        parentId: singleItem.id,
        type: FileSystemEnum.Directory,
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
      let response;
      if (isDirectory(singleItem)) {
        response = await editDirectory({
          ...data,
          name: name,
          parentId: singleItem.parentId,
        } as editDirectoryProps);
      } else if (isFile(singleItem)) {
        response = await editFile({
          ...data,
          name: name,

          directoryId: singleItem.directoryId,
        } as EditFileProps);
      } else {
        toast.error(i18n.t("Error desconocido"), toastStyle);
        return;
      }

      if (response && "message" in response) {
        onAddNode();
        toast.success(i18n.t("General.nameChanged"), toastStyle);
      } else {
        toast.error(i18n.t("Errors." + response?.error), toastStyle);
      }
    }
  };

  // Delete Items
  const handleDeleteItems = async () => {
    for (const item of items) {
      if (item.type === FileSystemEnum.Directory)
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
        (singleItem.type === FileSystemEnum.Directory ||
          (singleItem.type === FileSystemEnum.Sheet && items.length === 1 && (
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
          )))}
      {singleItem &&
        singleItem.type === FileSystemEnum.Directory &&
        items.length === 1 && (
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
        )}
      {singleItem && singleItem.type !== FileSystemEnum.Sheet && (
        <li
          onClick={() =>
            handleOpenModal({
              label: i18n.t("ContextualMenu.Modal.renameName", singleItem.name),
              initialText: singleItem.name,
              showInput: true,
              action: handleChangeName,
            })
          }
        >
          {i18n.t("ContextualMenu.renameFile")}
        </li>
      )}
      {singleItem && singleItem.type !== FileSystemEnum.Sheet && (
        <li
          onClick={() => {
            const message =
              items.length > 1
                ? i18n.t(
                    "ContextualMenu.Modal.multipleDelete",
                    items.length.toString()
                  )
                : singleItem
                  ? singleItem.type == FileSystemEnum.Directory
                    ? i18n.t(
                        "ContextualMenu.Modal.deleteFolder",
                        singleItem.name
                      )
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
      )}
    </ul>
  );

  const portalRoot = document.getElementById("portal-root");
  if (!portalRoot) return null;

  return ReactDOM.createPortal(menu, portalRoot);
}
