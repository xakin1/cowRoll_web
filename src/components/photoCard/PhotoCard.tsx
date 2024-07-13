import React from "react";
import "./styles.css";

interface PhotoCardProps {
  name: string;
  image: string;
  handleClick: () => void; // Agrega el id como prop
}

const PhotoCard: React.FC<PhotoCardProps> = ({ name, image, handleClick }) => {
  return (
    <div className="photo-card" onClick={handleClick}>
      <img src={image} alt={name} className="photo" />
      <div className="name">{name}</div>
    </div>
  );
};

export default PhotoCard;
