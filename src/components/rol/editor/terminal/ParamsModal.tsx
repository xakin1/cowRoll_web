import { Box, Button, Modal, TextField } from "@mui/material";
import React, { useEffect } from "react";
import i18n from "../../../../i18n/i18n";

interface ParamsModalProps {
  open: boolean;
  params: string[];
  onClose: () => void;
  onSubmit: (values: string[]) => void;
}

const ParamsModal: React.FC<ParamsModalProps> = ({
  open,
  params,
  onClose,
  onSubmit,
}) => {
  const [inputValues, setInputValues] = React.useState<string[]>(
    Array(params.length).fill("")
  );

  useEffect(() => {
    // Resetea los valores de entrada si los params cambian
    setInputValues(Array(params.length).fill(""));
  }, [params]);

  const handleChange = (index: number, value: string) => {
    const newValues = [...inputValues];
    newValues[index] = value;
    setInputValues(newValues);
  };

  const handleSubmit = () => {
    // Verificar si todos los campos están llenos
    if (inputValues.every((value) => value.trim() !== "")) {
      onSubmit(inputValues);
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 1,
          boxShadow: 24,
          p: 4,
        }}
      >
        <h3>Enter Parameters</h3>
        {params.map((param, index) => (
          <TextField
            key={index}
            label={param}
            value={inputValues[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            fullWidth
            margin="normal"
          />
        ))}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button variant="outlined" onClick={onClose}>
            {i18n.t("General.cancel")}
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            {i18n.t("General.confirm")}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ParamsModal;
