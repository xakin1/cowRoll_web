import React from "react";
import "./styles.css";

interface PhotoCardProps {
  name: string;
  image: string;
  handleClick: () => void;
  onContextMenu?: (e: React.MouseEvent<HTMLElement>) => void;
}

const PhotoCard: React.FC<PhotoCardProps> = ({
  name,
  image,
  handleClick,
  onContextMenu,
}) => {
  return (
    <div
      onContextMenu={onContextMenu}
      className="photo-card"
      onClick={handleClick}
    >
      <img src={image} alt={name} className="photo" />
      <div className="name">{name}</div>
    </div>
  );
};

export default PhotoCard;
