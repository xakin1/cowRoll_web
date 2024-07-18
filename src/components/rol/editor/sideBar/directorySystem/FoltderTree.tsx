import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  selectFile,
  setDirectorySystem,
} from "../../../../../redux/slice/fileSlide";
import {
  FileSystemEnum,
  findNodeById,
  isCodeFile,
  isDirectory,
  isFile,
  type DirectoryProps,
  type DirectorySystemProps,
  type NodeTree,
} from "../../../../../utils/types/ApiTypes";
import { ContextMenu } from "./ContextMenu";

import { useAppSelector } from "../../../../../hooks/customHooks";
import type { RootState } from "../../../../../redux/store";
import {
  editDirectory,
  editFile,
  getFiles,
} from "../../../../../services/codeApi";
import type {
  ContextMenuProps,
  Items,
  ModalConfig,
} from "../../../../../utils/types/types";
import Modal from "../../../../modal";
import { CustomTreeItem } from "./BorderedTreeView";
import "./folderTree.css";

function FolderTree() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
  const [selectedItems, setSelectedItems] = useState<Items[]>([]);
  const [hoveredItemId, setHoveredItemId] = useState<string>("");
  const directorySystem = useAppSelector(
    (state: RootState) => state.directorySystem.directorySystem
  );
  const id = useAppSelector((state: RootState) => state.id.value);
  const [rol, setRol] = useState<DirectoryProps>();

  useEffect(() => {
    if (id) {
      const rol = findNodeById(directorySystem, id);

      if (rol && isDirectory(rol)) setRol(rol);
    }
  }, [directorySystem, id]);

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
    closeContextMenu();

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
    item: DirectorySystemProps
  ) {
    event.preventDefault();

    if (event.ctrlKey || event.metaKey) {
      setSelectedItems((prev) => {
        const index = prev.findIndex((x) => x.id === item.id);
        if (index === -1) {
          return [...prev, item];
        } else {
          return prev.filter((x) => x.id !== item.id);
        }
      });
    } else {
      setSelectedItems([item]);

      if (isCodeFile(item)) {
        dispatch(selectFile(item));
      }
    }
  }

  const handleContextMenu = (event: React.MouseEvent, items: Items) => {
    event.preventDefault();
    event.stopPropagation();

    setContextMenu({
      ...contextMenu,
      visible: true,
      x: event.clientX,
      y: event.clientY,
      items: selectedItems.length > 1 ? selectedItems : [items],
    });
  };

  const closeContextMenu = () => {
    setContextMenu({ ...contextMenu, visible: false, x: 0, y: 0 });
  };

  const addNode = async () => {
    setSelectedItems([]);
    const docs = await getFiles();
    if (docs?.message) dispatch(setDirectorySystem(docs?.message));
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    item: NodeTree
  ) => {
    const items = selectedItems.length == 0 ? [item] : selectedItems;
    e.dataTransfer.setData("drag-item", JSON.stringify(items));
    e.stopPropagation();
  };

  const handleDragOver = (e: React.DragEvent<any>, item: NodeTree) => {
    e.preventDefault();
    e.stopPropagation();
    setHoveredItemId(item.id);
  };

  const handleDragLeave = (e: React.DragEvent<any>) => {
    e.preventDefault();
    setHoveredItemId("");
  };

  const handleDrop = async (
    e: React.DragEvent<any>,
    targetDirectory: DirectoryProps
  ) => {
    e.preventDefault();
    setHoveredItemId("");
    setSelectedItems([]);
    const items = JSON.parse(e.dataTransfer.getData("drag-item")) as NodeTree[];
    for (const item of items) {
      if (item.type == FileSystemEnum.Directory) {
        await editDirectory({ id: item.id, parentId: targetDirectory.id });
      } else {
        await editFile({
          id: item.id,
          directoryId: targetDirectory.id,
          type: FileSystemEnum.Code,
        });
      }
    }
    await addNode();

    e.stopPropagation();
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
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [contextMenu.visible]);

  function buildTreeItems(current: NodeTree): JSX.Element {
    const nodeId = current.id + "-" + current.type;
    const isSelected = selectedItems.some((item) => item.id === current.id);
    if (isFile(current)) {
      return (
        <>
          <CustomTreeItem
            key={nodeId}
            itemId={nodeId}
            sx={{
              "& .MuiTreeItem-content:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.08)",
                cursor: "pointer",
              },
              backgroundColor: isSelected
                ? "rgba(25, 118, 210, 0.4)"
                : hoveredItemId === current.id
                  ? "rgba(25, 118, 210, 0.18)"
                  : "transparent",
              cursor: "pointer",
            }}
            label={
              <div
                className="nodeTree"
                draggable="true"
                onDragStart={(e) => handleDragStart(e, current)}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDragOver(e, current);
                }}
                onDragLeave={handleDragLeave}
              >
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
      if (isDirectory(current)) {
        return (
          <>
            <CustomTreeItem
              key={nodeId}
              itemId={nodeId}
              sx={{
                "& .MuiTreeItem-content:hover": {
                  backgroundColor: "rgba(25, 118, 210, 0.08)",
                  cursor: "pointer",
                },
                backgroundColor: isSelected
                  ? "rgba(25, 118, 210, 0.4)"
                  : hoveredItemId === current.id
                    ? "rgba(25, 118, 210, 0.18)"
                    : "transparent",
                cursor: "pointer",
              }}
              label={
                <div
                  className="nodeTree"
                  draggable="true"
                  onDragStart={(e) => handleDragStart(e, current)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDragOver(e, current);
                  }}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, current)}
                >
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
                  <span className="directoryName">{current.name}</span>
                </div>
              }
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(event) => handleItemClick(event, current)}
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
      {rol && (
        <>
          <SimpleTreeView>{buildTreeItems(rol)}</SimpleTreeView>
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
      )}
    </>
  );
}

export default FolderTree;
