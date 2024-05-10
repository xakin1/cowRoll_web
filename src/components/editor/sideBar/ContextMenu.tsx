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
import type {
  editDirectoryProps,
  editFileProps,
  insertDirectoryProps,
  insertFileProps,
} from "../../../utils/types/ApiTypes";
import type { ContextMenuProps } from "../../../utils/types/types";
import "./contextMenu.css";

const i18n = getI18N({ currentLocale: getLang() });

export function ContextMenu({
  x,
  y,
  item,
  onClose,
  onAddNode,
  handleOpenModal,
}: ContextMenuProps) {
  if (!item) return null;

  const handleInsertFile = async (fileName: string) => {
    const file: insertFileProps = {
      name: fileName,
      directoryId: item.id,
    };
    const response = await createFile(1, file);
    if (response && "message" in response) {
      const treeFile = { ...file, id: response.message };
      onAddNode();
    }
  };
  const handleInsertDirectory = async (directoryName: string) => {
    let directory: insertDirectoryProps = {
      name: directoryName,
      parentId: item.id,
    };
    await createDirectory(1, directory);

    onAddNode();
  };

  const handleChangeFileName = async (fileName: string) => {
    let file: editFileProps = {
      name: fileName,
      id: item.id,
    };
    await editFile(1, file);

    onAddNode();
  };

  const handleChangeDirectoryName = async (directoryName: string) => {
    let directory: editDirectoryProps = {
      name: directoryName,
      id: item.id,
    };
    await editDirectory(1, directory);

    onAddNode();
  };

  const handleDeleteItem = async () => {
    if (item.type == "Directory") await deleteDirectory(1, item.id);
    else await deleteFile(1, item.id);

    onAddNode();
  };

  const menu = (
    <ul
      className="context-menu"
      style={{ top: y + "px", left: x + "px", position: "absolute" }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {item.type == "Directory" && (
        <>
          <li
            onClick={() => {
              handleOpenModal({
                label: i18n.ContextualMenu.Modal.inputFileName,
                initialText: "",
                action: handleInsertFile,
              });
              onClose();
            }}
          >
            {i18n.ContextualMenu.newFile}
          </li>
          <li
            onClick={() => {
              handleOpenModal({
                label: i18n.ContextualMenu.Modal.inputDirectoryName,
                initialText: "",
                action: handleInsertDirectory,
              });
              onClose();
            }}
          >
            {i18n.ContextualMenu.newFolder}
          </li>
        </>
      )}
      <li
        onClick={() => {
          const message =
            item.type == "Directory"
              ? i18n.ContextualMenu.Modal.inputDirectoryName
              : i18n.ContextualMenu.Modal.inputFileName;

          handleOpenModal({
            label: message + "  '" + item.name + "'",
            initialText: "",
            action: handleChangeFileName,
          });
          onClose();
        }}
      >
        {i18n.ContextualMenu.renameFile}
      </li>
      <li
        onClick={() => {
          let message =
            item.type == "Directory"
              ? i18n.ContextualMenu.Modal.deleteFolder
              : i18n.ContextualMenu.Modal.deleteFile;
          handleOpenModal({
            label: message + "  '" + item.name + "'",
            showInput: false,
            action: handleDeleteItem,
          });
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
