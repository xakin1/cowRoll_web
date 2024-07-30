import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import React, { type ChangeEvent } from "react";
import i18n from "../../i18n/i18n";
import "./styles.css";

export interface PhotoCardProps {
  onFileSelect: (file: File) => void;
}

const PhotoCardUpload: React.FC<PhotoCardProps> = ({ onFileSelect }) => {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <label htmlFor="file-upload" className="upload-card">
      <input
        type="file"
        accept="application/pdf"
        style={{ display: "none" }}
        id="file-upload"
        onChange={handleFileChange}
      />
      <div className="add-icon">
        <UploadFileRoundedIcon />
      </div>
      <div className="upload-text">{i18n.t("General.upload")}</div>
    </label>
  );
};

export default PhotoCardUpload;
