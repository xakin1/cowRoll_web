import { TextField } from "@mui/material";
import React, { useState } from "react";
import i18n from "../../../i18n/i18n";
import CustomModal from "../../utils/CustomModal";
import { Divider } from "../../utils/Divider";

interface PlayerNameModalProps {
  open: boolean;
  onClose: () => void;
  onAddPlayer: (playerName: string) => void;
}

const PlayerNameModal: React.FC<PlayerNameModalProps> = ({
  open,
  onClose,
  onAddPlayer,
}) => {
  const [playerName, setPlayerName] = useState("");

  const handleAdd = () => {
    onAddPlayer(playerName);
    setPlayerName("");
    onClose();
  };

  return (
    <CustomModal open={open} onClose={onClose}>
      <div>
        <header className="modal-header">
          <h3>{i18n.t("General.enterPlayerName")}</h3>
        </header>
        <Divider />
        <div className="modal-body">
          <TextField
            id="outlined-basic"
            value={playerName}
            label={i18n.t("General.playerName")}
            onChange={(e) => setPlayerName(e.target.value)}
            variant="outlined"
          />
        </div>
        <Divider />
        <div className="buttons-modal_container">
          <button className="buttons-modal_container__cancel" onClick={onClose}>
            {i18n.t("General.cancel")}
          </button>
          <button
            className={
              "buttons-modal_container__accept" +
              (playerName ? "--selected" : "--unselected")
            }
            onClick={handleAdd}
            disabled={!playerName}
          >
            {i18n.t("General.addPlayer")}
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default PlayerNameModal;
