import React from "react";
import type { Id } from "../../utils/types/ApiTypes";
import "./styles.css";

interface PhotoCardProps {
  name: string;
  image: string;
  id: Id; // Agrega el id como prop
}

const PhotoCard: React.FC<PhotoCardProps> = ({ name, image, id }) => {
  const handleClick = () => {
    window.location.href = `/app/rol?id=${id}`; // Pasa el id en la URL
  };

  return (
    <div className="photo-card" onClick={handleClick}>
      <img src={image} alt={name} className="photo" />
      <div className="name">{name}</div>
    </div>
  );
};

export default PhotoCard;
