import { Box, Modal } from "@mui/material";
import React, { type ReactNode } from "react";

export interface PhotoCardProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode; // Añadir la propiedad children
}

const CustomModal: React.FC<PhotoCardProps> = ({ open, onClose, children }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute" as "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "var(--background-color)",
          border: "2px solid var(--border-color)",
          color: "var(--text-color)",
          boxShadow: 24,
          p: 4,
          height: "auto",
          padding: "12px",
        }}
      >
        {children}
      </Box>
    </Modal>
  );
};

export default CustomModal;
