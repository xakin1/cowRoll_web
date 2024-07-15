import React from "react";
import "./styles.css";

export interface PhotoCardProps {
  handleOpen: (...args: any[]) => void; // Agrega el id como prop
}

const PhotoCardAdd: React.FC<PhotoCardProps> = ({ handleOpen }) => {
  return (
    <div className="add-card" onClick={handleOpen}>
      <div className="add-icon">+</div>
      <div className="add-text">Añadir</div>
    </div>
  );
};

export default PhotoCardAdd;
