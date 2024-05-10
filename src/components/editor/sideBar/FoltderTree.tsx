import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addFile, selectFile } from "../../../redux/slice/fileSlide";
import type { DirectoryProps, FileProps } from "../../../utils/types/ApiTypes";
import { ContextMenu } from "./ContextMenu";

import { useAppSelector } from "../../../hooks/customHooks";
import type { RootState } from "../../../redux/store";
import { getFiles } from "../../../services/codeApi";
import type { ContextMenuProps, ModalConfig } from "../../../utils/types/types";
import Modal from "../../modal";
import { CustomTreeItem } from "./BorderedTreeView";
import "./folderTree.css";

function FolderTree() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
  const [selectedItems, setSelectedItems] = useState<
    { id: number; name: string; type: "File" | "Directory" }[]
  >([]);

  const directorySystem = useAppSelector(
    (state: RootState) => state.directorySystem.directorySystem
  );
  const [contextMenu, setContextMenu] = useState<ContextMenuProps>({
    visible: false,
    x: 0,
    y: 0,
    items: selectedItems,
    onClose: () => {},
    onAddNode: () => {},
    handleOpenModal: () => {},
  });
  const dispatch = useDispatch();

  const handleOpenModal = (config: ModalConfig) => {
    setModalConfig({
      ...config,
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleModalAccept = (inputValue: string) => {
    if (modalConfig?.action) {
      modalConfig.action(inputValue);
    }
    handleCloseModal();
  };

  function handleItemClick(
    event: React.MouseEvent,
    item: FileProps | DirectoryProps
  ) {
    if (event.ctrlKey || event.metaKey) {
      // Handle multi-selection logic
      setSelectedItems((prev) => {
        const itemIndex = prev.findIndex((x) => x.id === item.id);
        if (itemIndex === -1) {
          // If not already selected, add the new item
          return [...prev, { id: item.id, name: item.name, type: item.type }];
        } else {
          // If already selected, remove the item
          return prev.filter((_, index) => index !== itemIndex);
        }
      });
    } else {
      // Handle single selection logic
      setSelectedItems([{ id: item.id, name: item.name, type: item.type }]);
      if (item.type === "File") {
        dispatch(selectFile(item));
      }
    }
  }

  const handleContextMenu = (event: React.MouseEvent, item: any) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu({
      ...contextMenu,
      visible: true,
      x: event.clientX,
      y: event.clientY,
      items: selectedItems.length > 1 ? selectedItems : item,
    });
  };

  const closeContextMenu = () => {
    setContextMenu({ ...contextMenu, visible: false, x: 0, y: 0 });
  };

  const addNode = async () => {
    setSelectedItems([]);
    const docs = await getFiles(1);
    if (docs?.message) dispatch(addFile(docs?.message));
  };

  // Añadir un listener para cerrar el menú si se hace clic fuera de él
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      // Comprobar si el clic fue fuera del menú contextual
      if (
        contextMenu.visible &&
        event.target instanceof Node &&
        !document.querySelector(".context-menu")?.contains(event.target)
      ) {
        closeContextMenu();
      }
      setSelectedItems([]);
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [contextMenu.visible]);

  function buildTreeItems(current: DirectoryProps | FileProps): JSX.Element {
    if (current.type === "File") {
      return (
        <>
          <CustomTreeItem
            key={current.id}
            itemId={current.name + " " + current.directoryId}
            sx={{
              "& .MuiTreeItem-content:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.08)",
                cursor: "pointer",
              },
              backgroundColor: selectedItems.some(
                (item) => item.id === (current.id ?? -1)
              )
                ? "rgba(25, 118, 210, 0.18)"
                : "transparent",
              cursor: "pointer",
            }}
            label={
              <div className="nodeTree">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="treeIcon"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                  <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                </svg>
                <span className="fileName">{current.name}</span>
              </div>
            }
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(event) => handleItemClick(event, current)}
            onContextMenu={(event) => handleContextMenu(event, current)}
          />
          {contextMenu.visible && (
            <ContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              items={contextMenu.items}
              onClose={closeContextMenu}
              onAddNode={addNode}
              handleOpenModal={handleOpenModal}
            />
          )}
        </>
      );
    } else {
      if (current.type === "Directory") {
        return (
          <>
            <CustomTreeItem
              key={current.id}
              itemId={current.name + " " + current.parentId}
              sx={{
                "& .MuiTreeItem-content:hover": {
                  backgroundColor: "rgba(25, 118, 210, 0.08)",
                  cursor: "pointer",
                },
                backgroundColor: selectedItems.some(
                  (item) => item.id === (current.id ?? -1)
                )
                  ? "rgba(25, 118, 210, 0.18)"
                  : "transparent",
                cursor: "pointer",
              }}
              label={
                <div className="nodeTree">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="treeIcon"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2" />
                  </svg>
                  <span
                    style={{
                      flexGrow: 1,
                      display: "flex",
                      alignItems: "center",
                      fontWeight: "inherit",
                    }}
                  >
                    {current.name}
                  </span>
                </div>
              }
              onMouseDown={(e) => e.stopPropagation()}
              onContextMenu={(event) => handleContextMenu(event, current)}
            >
              {current.children &&
                current.children.map((child) => {
                  return buildTreeItems(child);
                })}
            </CustomTreeItem>

            {contextMenu.visible && (
              <ContextMenu
                x={contextMenu.x}
                y={contextMenu.y}
                items={contextMenu.items}
                onClose={closeContextMenu}
                onAddNode={addNode}
                handleOpenModal={handleOpenModal}
              />
            )}
          </>
        );
      } else {
        return <></>;
      }
    }
  }

  return (
    <>
      <SimpleTreeView>{buildTreeItems(directorySystem)}</SimpleTreeView>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAccept={handleModalAccept}
          initialText={modalConfig?.initialText ?? ""}
          label={modalConfig?.label ?? ""}
          showInput={modalConfig?.showInput ?? true}
        />
      )}
    </>
  );
}

export default FolderTree;
