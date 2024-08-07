import { useEffect, useState } from "react";
import type {
  DirectorySystemProps,
  NodeTree,
} from "../../../../../../utils/types/ApiTypes";
import type {
  ContextMenuProps,
  Items,
} from "../../../../../../utils/types/types";
import { CustomTreeItem } from "../BorderedTreeView";
import "./nodes.css";

interface FileTreeProps {
  node: DirectorySystemProps;
  selectedItems: Items[];
  handleItemClick: (...args: any[]) => void;
}

export const FileTree: React.FC<FileTreeProps> = ({
  node,
  selectedItems,
  handleItemClick,
}) => {
  const [hoveredItemId, setHoveredItemId] = useState<string>("");

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    item: NodeTree
  ) => {
    const items = selectedItems.length == 0 ? [item] : selectedItems;
    e.dataTransfer.setData("drag-item", JSON.stringify(items));
    e.stopPropagation();
  };

  const nodeId = node.id + "-" + node.type;
  const isSelected = selectedItems.some((item) => item.id === node.id);

  const [contextMenu, setContextMenu] = useState<ContextMenuProps>({
    visible: false,
    x: 0,
    y: 0,
    items: selectedItems,
    onClose: () => {},
    onAddNode: () => {},
    handleOpenModal: () => {},
  });

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

  return (
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
          : hoveredItemId === node.id
            ? "rgba(25, 118, 210, 0.18)"
            : "transparent",
        cursor: "pointer",
      }}
      label={
        <div
          className="nodeTree"
          draggable="true"
          onDragStart={(e) => handleDragStart(e, node)}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setHoveredItemId(node.id);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setHoveredItemId("");
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="treeIcon"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M14 3v4a1 1 0 0 0 1 1h4" />
            <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
          </svg>
          <span className="fileName">{node.name}</span>
        </div>
      }
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(event) => handleItemClick(event, node)}
      onContextMenu={(event) => handleContextMenu(event, node)}
    />
  );
};
