import React from "react";
import i18n from "../../i18n/i18n";
import "./styles.css";

export interface PhotoCardProps {
  handleOpen: (...args: any[]) => void; // Agrega el id como prop
}

const PhotoCardAdd: React.FC<PhotoCardProps> = ({ handleOpen }) => {
  return (
    <div className="add-card" onClick={handleOpen}>
      <div className="add-icon">+</div>
      <div className="add-text">{i18n.t("General.add")}</div>
    </div>
  );
};

export default PhotoCardAdd;
