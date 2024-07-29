import React, { useEffect, useRef, useState } from "react";
import { FileSystemEnum, isDirectory } from "../../utils/types/ApiTypes";
import ContextualMenu from "../rol/components/contextMenu/contextMenu";
import CustomModal from "../utils/CustomModal";
import PhotoCard from "./PhotoCard";
import PhotoCardAdd from "./PhotoCardAdd";
import "./styles.css";

export interface PhotoElement {
  id: any;
  name: string;
  image?: string;
  type: FileSystemEnum;
}

export interface PhotoListFormProps<T, Y> {
  onClose?: () => void;
  selectedElement?: T;
  onElementAdded: (newRol: T) => void;
  onElementUpdated?: (updatedRol: Y) => void;
}

interface PhotoCardProps {
  elements: PhotoElement[];
  image?: string;
  handleClick?: (...args: any[]) => void;
  handleDoubleClick: (...args: any[]) => void;
  handleDelete: (id: any) => void;
  handleMove?: (elements: any[], targetFolder: any) => void;
  children: React.ReactNode;
  childrenFolder?: React.ReactNode;
}

const PhotoCardList: React.FC<PhotoCardProps> = ({
  elements,
  image,
  handleClick,
  handleDoubleClick,
  handleDelete,
  handleMove,
  children,
  childrenFolder,
}) => {
  const [contextMenuPosition, setContextMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [selectedElements, setSelectedElements] = useState<PhotoElement[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showModalFolder, setShowModalFolder] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setShowModal(false);
    setShowModalFolder(false);
  };

  const handleOpen = () => setShowModal(true);
  const handleOpenFolder = () => setShowModalFolder(true);

  const handleContextMenu = (
    e: React.MouseEvent<HTMLElement>,
    element?: PhotoElement
  ): void => {
    e.preventDefault();
    if (element && !selectedElements.includes(element)) {
      setSelectedElements([element]);
    }
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
  };

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    if (!target.closest(".contextual-menu")) {
      setSelectedElements([]);
      setContextMenuPosition(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleEdit = () => {
    if (selectedElements.length === 1) {
      const selectedElement = selectedElements[0];
      if (isDirectory(selectedElement) && childrenFolder) {
        handleOpenFolder();
      } else {
        handleOpen();
      }
    }
    setContextMenuPosition(null);
  };

  const handleDeleteWithClose = (id: any) => {
    handleDelete(id);
    setSelectedElements([]);
    setContextMenuPosition(null);
  };

  const handleSelect = (element: PhotoElement, e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.ctrlKey || e.metaKey) {
      setSelectedElements((prevElements) => {
        if (prevElements.includes(element)) {
          return prevElements.filter((el) => el.id !== element.id);
        } else {
          return [...prevElements, element];
        }
      });
    } else {
      setSelectedElements([element]);
    }
  };

  const handleDrop = (e: React.DragEvent, targetElement: PhotoElement) => {
    e.preventDefault();
    if (isDirectory(targetElement) && handleMove) {
      handleMove(selectedElements, targetElement);
      setSelectedElements([]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    console.log("Selected elements updated:", selectedElements);
  }, [selectedElements]);

  return (
    <div
      style={{ width: "100%", height: "100%" }}
      onContextMenu={(e) => {
        e.stopPropagation();
        e.preventDefault();
        handleContextMenu(e);
      }}
    >
      <div className="photo-grid sibling-fade">
        {elements.map((element) => (
          <div
            key={element.id}
            onClick={(e) => handleSelect(element, e)}
            onDragOver={handleDragOver}
            onDrop={(e) => {
              handleDrop(e, element);
            }}
            className={`photo-card ${
              selectedElements.includes(element) ? "selected" : ""
            }`}
            draggable={!isDirectory(element)} // Only non-directories are draggable
          >
            <PhotoCard
              handleDoubleClick={() => {
                handleDoubleClick(element);
              }}
              handleClick={() => {
                if (handleClick) handleClick(element);
              }}
              name={element.name}
              onContextMenu={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleContextMenu(e, element);
              }}
              image={
                element.image
                  ? element.image
                  : image
                    ? image
                    : isDirectory(element)
                      ? "/folder.svg"
                      : "/file.svg"
              }
            />
          </div>
        ))}
        <PhotoCardAdd handleOpen={handleOpen} />
      </div>
      {selectedElements.length > 0 && contextMenuPosition && (
        <div
          className="contextual-menu"
          style={{
            position: "absolute",
            top: contextMenuPosition.y,
            left: contextMenuPosition.x,
          }}
        >
          <ContextualMenu
            handleEdit={handleEdit}
            handleDelete={() =>
              selectedElements.forEach((el) => handleDeleteWithClose(el.id))
            }
          />
        </div>
      )}

      {!selectedElements.length && contextMenuPosition && (
        <div
          className="contextual-menu"
          style={{
            position: "absolute",
            top: contextMenuPosition.y,
            left: contextMenuPosition.x,
          }}
        >
          <ContextualMenu
            handleNew={handleOpen}
            handleNewFolder={childrenFolder ? handleOpenFolder : undefined} // Only show if childrenFolder is present
          />
        </div>
      )}
      <CustomModal open={showModal} onClose={handleClose}>
        <div ref={modalRef} onClick={(e) => e.stopPropagation()}>
          <div>
            {React.cloneElement(children as React.ReactElement<any>, {
              onClose: handleClose,
              selectedElement: selectedElements[0],
            })}
          </div>
        </div>
      </CustomModal>

      {childrenFolder && (
        <CustomModal open={showModalFolder} onClose={handleClose}>
          <div ref={modalRef} onClick={(e) => e.stopPropagation()}>
            <div>
              {React.cloneElement(childrenFolder as React.ReactElement<any>, {
                onClose: handleClose,
                selectedElement: selectedElements[0],
              })}
            </div>
          </div>
        </CustomModal>
      )}
    </div>
  );
};

export default PhotoCardList;
