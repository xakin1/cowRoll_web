import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../../../redux/slice/chatSlice";
import type { RootState } from "../../../redux/store";
import { getFiles } from "../../../services/codeApi";
import {
  getSheetsOfRol,
  isDirectory,
  type DirectoryProps,
  type FileProps,
} from "../../../utils/types/ApiTypes";
import CustomModal from "../../utils/CustomModal";
import { Divider } from "../../utils/Divider";
import "./chat.css";
const Chat = () => {
  const dispatch = useDispatch();
  const messages = useSelector((state: RootState) => state.chat.messages);
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const [role, setRole] = useState("GM");
  const [selectedFile, setSelectedFile] = useState<FileProps>();
  const [roles, setRoles] = useState(["GM"]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleClose = () => setShowModal(false);
  const handleOpen = () => setShowModal(true);

  const rolId = useSelector((state: RootState) => state.route.value);

  const [sheetsDirectory, setSheetsDirectory] = useState<DirectoryProps>();
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDocuments = async () => {
    const response = await getFiles();
    if (rolId) {
      const directory = getSheetsOfRol(response.message, rolId);

      if (directory) {
        setSheetsDirectory(directory);
      }
    }

    setLoading(false);
  };
  useEffect(() => {
    fetchDocuments();
  }, [dispatch]);

  const handleSend = () => {
    if (input.trim()) {
      const timestamp = new Date().toLocaleTimeString();
      dispatch(addMessage({ text: input, user: role, time: timestamp }));
      setInput("");
    }
  };

  const handleAddRole = (newRole: string) => {
    if (newRole && !roles.includes(newRole)) {
      setRoles([...roles, newRole]);
    }
  };

  return (
    <>
      <div style={{ padding: "20px" }}>
        <div className="chat-container">
          <div className="chat-container__header">
            <button onClick={() => setActiveTab("chat")}>Chat</button>
            <button onClick={() => setActiveTab("addCharacter")}>
              Agregar Personaje
            </button>
          </div>
          {activeTab === "chat" ? (
            <>
              <div className="chat-container__body">
                {messages.map((message, index) => (
                  <div className="chat-container__body__message" key={index}>
                    <div>
                      {message.user}: {message.text}
                    </div>
                    <div style={{ fontSize: "0.8em", color: "gray" }}>
                      {message.time}
                    </div>
                  </div>
                ))}
              </div>
              <div className="chat-container__footer">
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  {roles.map((role, index) => (
                    <option key={index} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  style={{ flex: 1, padding: "5px" }}
                />
                <button onClick={handleSend}>Send</button>
              </div>
            </>
          ) : (
            <div className="add-character">
              <button onClick={handleOpen}> add player</button>
              <div>Roles actuales: {roles.join(", ")}</div>
            </div>
          )}
        </div>
      </div>
      <CustomModal open={showModal} onClose={handleClose}>
        <div>
          <h3>Seleccionar personaje</h3>
          <Divider></Divider>
          <div className={"item-container"}>
            {sheetsDirectory?.children.map((sheet, index) =>
              isDirectory(sheet) ? (
                <div className="item-container__item" key={index}>
                  <FolderRoundedIcon />
                  <label>{sheet.name}</label>
                </div>
              ) : (
                <div
                  className={
                    "item-container__item" +
                    (selectedFile && selectedFile.id == sheet.id
                      ? "--selected"
                      : "--unselected")
                  }
                  onClick={() => {
                    setSelectedFile(sheet);
                  }}
                  key={index}
                >
                  <InsertDriveFileRoundedIcon />
                  <label>{sheet.name}</label>
                </div>
              )
            )}
          </div>
          <Divider></Divider>

          <div className="buttons-modal_container">
            <button
              className="buttons-modal_container__cancel"
              onClick={handleClose}
            >
              Cancelar
            </button>
            <button
              className={
                "buttons-modal_container__accept" +
                (selectedFile ? "--selected" : "--unselected")
              }
              disabled={!selectedFile}
            >
              Aceptar
            </button>
          </div>
        </div>
      </CustomModal>
    </>
  );
};

export default Chat;
