import React, { useEffect, useState } from "react";
import CustomModal from "../CustomModal";
import ContextualMenu from "../rol/components/contextMenu/contextMenu";
import PhotoCard from "./PhotoCard";
import PhotoCardAdd from "./PhotoCardAdd";
import "./styles.css";

interface PhotoElement {
  id: any;
  name: string;
  image?: string;
}

interface PhotoCardProps {
  elements: PhotoElement[];
  image?: string;
  handleClick: (...args: any[]) => void;
  handleDelete: (id: any) => void;
  children: React.ReactNode;
}

const PhotoCardList: React.FC<PhotoCardProps> = ({
  elements,
  image,
  handleClick,
  handleDelete,
  children,
}) => {
  const [contextMenuPosition, setContextMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [selectedElement, setSelectedElement] = useState<PhotoElement | null>(
    null
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleClose = () => setShowModal(false);
  const handleOpen = () => setShowModal(true);
  const handleContextMenu = (
    e: React.MouseEvent<HTMLElement>,
    element: PhotoElement
  ): void => {
    e.preventDefault();
    setSelectedElement(element);
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
  };

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest(".contextual-menu")) {
      setSelectedElement(null);
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
    handleOpen();
    setSelectedElement(null);
    setContextMenuPosition(null);
  };

  const handleDeleteWithClose = (id: any) => {
    handleDelete(id);
    setSelectedElement(null);
    setContextMenuPosition(null);
  };

  return (
    <>
      <div className="photo-grid sibling-fade">
        {elements.map((element) => (
          <React.Fragment key={element.id}>
            <PhotoCard
              handleClick={() => {
                setSelectedElement(element);
                handleClick(element.id);
              }}
              name={element.name}
              onContextMenu={(e) => handleContextMenu(e, element)}
              image={element.image || image || "/file.svg"}
            />
          </React.Fragment>
        ))}

        <PhotoCardAdd handleOpen={handleOpen}></PhotoCardAdd>
      </div>
      {selectedElement && contextMenuPosition && (
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
            handleDelete={() => handleDeleteWithClose(selectedElement.id)}
          />
        </div>
      )}
      <CustomModal open={showModal} onClose={handleClose}>
        {React.cloneElement(children as React.ReactElement<any>, {
          onClose: handleClose,
        })}
      </CustomModal>
    </>
  );
};

export default PhotoCardList;
