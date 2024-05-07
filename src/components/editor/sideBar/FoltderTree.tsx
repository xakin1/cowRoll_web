import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { selectFile } from "../../../redux/slice/fileSlide";
import type { DirectoryProps, FileProps } from "../../../utils/types/ApiTypes";
import { ContextMenu } from "./ContextMenu";

function FolderTree(directoySystem: DirectoryProps) {
  const dispatch = useDispatch();

  function handleItemClick(content: FileProps) {
    dispatch(selectFile(content));
  }

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    item: null,
  });

  const handleContextMenu = (event: React.MouseEvent, item: any) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      item: item,
    });
  };

  const closeContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, item: null });
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

    // Añadir el evento al document
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      // Limpiar el evento al desmontar el componente
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [contextMenu.visible]);

  function buildTreeItems(current: DirectoryProps | FileProps): JSX.Element {
    if (current.type === "File") {
      return (
        <>
          <TreeItem
            key={current.id}
            itemId={current.name + " " + current.directoryId}
            label={current.name}
            onClick={() => handleItemClick(current)}
            onContextMenu={(event) => handleContextMenu(event, current)}
          />
          {contextMenu.visible && (
            <ContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              item={contextMenu.item}
              onClose={closeContextMenu}
            />
          )}
        </>
      );
    } else {
      if (current.type === "Directory") {
        return (
          <>
            <TreeItem
              key={current.id}
              itemId={current.name + " " + current.parentId}
              label={current.name}
              onContextMenu={(event) => handleContextMenu(event, current)}
            >
              {current.children &&
                current.children.map((child) => {
                  return buildTreeItems(child);
                })}
            </TreeItem>

            {contextMenu.visible && (
              <ContextMenu
                x={contextMenu.x}
                y={contextMenu.y}
                item={contextMenu.item}
                onClose={closeContextMenu}
              />
            )}
          </>
        );
      } else {
        return <></>;
      }
    }
  }

  return <SimpleTreeView>{buildTreeItems(directoySystem)}</SimpleTreeView>;
}

export default FolderTree;
