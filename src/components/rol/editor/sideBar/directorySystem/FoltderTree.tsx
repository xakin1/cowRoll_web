import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  selectFile,
  setDirectorySystem,
} from "../../../../../redux/slice/DirectorySystemSlice";
import {
  FileSystemEnum,
  findNodeById,
  isCodeFile,
  isDirectory,
  isSheetsProps,
  type DirectoryProps,
  type DirectorySystemProps,
  type NodeTree,
  type SheetProps,
} from "../../../../../utils/types/ApiTypes";

import { useAppSelector } from "../../../../../hooks/customHooks";
import type { RootState } from "../../../../../redux/store";
import {
  editDirectory,
  editFile,
  getFiles,
} from "../../../../../services/codeApi";
import type { Items, ModalConfig } from "../../../../../utils/types/types";
import Modal from "../../../../modal";
import type { SideBarProps } from "../SideBar";
import { DirectoryTree } from "./nodes/DirectoryTree";
import { FileTree } from "./nodes/FileTree";

const FolderTree: React.FC<SideBarProps> = ({ directoryId }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
  const [selectedItems, setSelectedItems] = useState<Items[]>([]);
  const directorySystem = useAppSelector(
    (state: RootState) => state.directorySystem.directorySystem
  );
  const id = useAppSelector((state: RootState) => state.route.value);
  const [rol, setRol] = useState<DirectorySystemProps>();

  const getDirectory = (directorySystem: DirectorySystemProps) => {
    const idFolder = directoryId ? directoryId : id;
    if (idFolder) {
      const rol = findNodeById(directorySystem!, idFolder);
      if (rol) setRol(rol);
    }
  };
  useEffect(() => {
    getDirectory(directorySystem!);
  }, []);

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

  const addNode = async () => {
    setSelectedItems([]);
    const docs = await getFiles();
    if (docs?.message) {
      dispatch(setDirectorySystem(docs?.message));
      getDirectory(docs.message);
    }
  };

  const handleDrop = async (
    e: React.DragEvent<any>,
    targetDirectory: DirectoryProps | SheetProps
  ) => {
    e.preventDefault();
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

  function buildTreeItems(current: NodeTree): JSX.Element {
    if (isCodeFile(current)) {
      return (
        <FileTree
          node={current}
          selectedItems={selectedItems}
          handleItemClick={handleItemClick}
          addNode={addNode}
          handleOpenModal={handleOpenModal}
        ></FileTree>
      );
    } else {
      if (isDirectory(current)) {
        return (
          <DirectoryTree
            node={current}
            selectedItems={selectedItems}
            handleDrop={handleDrop}
            handleItemClick={handleItemClick}
            addNode={addNode}
            handleOpenModal={handleOpenModal}
          >
            {current.children &&
              current.children.map((child) => {
                return buildTreeItems(child);
              })}
          </DirectoryTree>
        );
      } else if (isSheetsProps(current)) {
        return (
          <DirectoryTree
            node={current}
            selectedItems={selectedItems}
            handleDrop={handleDrop}
            handleItemClick={handleItemClick}
            addNode={addNode}
            handleOpenModal={handleOpenModal}
          >
            {current.codes &&
              current.codes.map((child) => {
                if (isCodeFile(child)) {
                  return buildTreeItems(child);
                }
              })}
          </DirectoryTree>
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
};

export default FolderTree;
