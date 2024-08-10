import { Button } from "@mui/material";
import React from "react";
import i18n from "../../../i18n/i18n";
import CustomModal from "../../utils/CustomModal";
import "./chat.css";

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
}) => {
  return (
    <CustomModal open={open} onClose={onClose} aria-labelledby="confirm-modal">
      <div className="confirmation-modal">
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="confirmation-modal__buttons">
          <Button onClick={onClose} variant="outlined">
            {i18n.t("General.cancel")}
          </Button>
          <Button onClick={onConfirm} variant="contained" color="primary">
            {i18n.t("General.confirm")}
          </Button>
        </div>
      </div>
    </CustomModal>
  );
};

export default ConfirmationModal;
