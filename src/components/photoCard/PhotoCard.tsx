import React from "react";
import "./styles.css";

interface PhotoCardProps {
  name: string;
  image: string;
  handleClick?: () => void;
  handleDoubleClick?: () => void;
  onContextMenu?: (e: React.MouseEvent<HTMLElement>) => void;
}

const PhotoCard: React.FC<PhotoCardProps> = ({
  name,
  image,
  handleClick,
  handleDoubleClick,
  onContextMenu,
}) => {
  return (
    <div
      onContextMenu={onContextMenu}
      className="photo-card"
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
      title={name}
    >
      <img src={image} alt={name} className="photo" />
      <div className="name">{name}</div>
    </div>
  );
};

export default PhotoCard;
