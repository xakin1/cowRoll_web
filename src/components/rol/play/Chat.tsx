import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import i18n from "../../../i18n/i18n";
import { addMessage } from "../../../redux/slice/chatSlice";
import type { RootState } from "../../../redux/store";
import { executeCode, getFiles } from "../../../services/codeApi"; // Import executeCode here
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
  const [scripts, setScripts] = useState<{ [key: string]: string }[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileProps>();
  const [roles, setRoles] = useState(["GM"]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [messageHistory, setMessageHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleClose = () => setShowModal(false);
  const handleOpen = () => setShowModal(true);

  const rolId = useSelector((state: RootState) => state.route.value);

  const [sheetsDirectory, setSheetsDirectory] = useState<DirectoryProps>();
  const [parentDirectory, setParentDirectory] = useState<DirectoryProps | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDocuments = async () => {
    const response = await getFiles();
    if (rolId) {
      const directory = getSheetsOfRol(response.message, rolId);

      if (directory) {
        setSheetsDirectory(directory);
        setParentDirectory(null); // Root directory has no parent
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchDocuments();
  }, [dispatch]);

  const handleSend = async () => {
    if (input.trim()) {
      let processedInput = await processInput(input.trim());

      const timestamp = new Date().toLocaleTimeString();
      dispatch(
        addMessage({ text: processedInput, user: role, time: timestamp })
      );
      setMessageHistory((prev) => [...prev, input.trim()]);
      setHistoryIndex(-1);
      setInput("");
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSend();
    }
    if (event.key === "ArrowUp") {
      if (messageHistory.length > 0) {
        const newIndex =
          historyIndex === -1
            ? messageHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setInput(messageHistory[newIndex]);
        setHistoryIndex(newIndex);
      }
    }
    if (event.key === "ArrowDown") {
      if (messageHistory.length > 0) {
        const newIndex =
          historyIndex === -1
            ? -1
            : Math.min(messageHistory.length - 1, historyIndex + 1);
        if (newIndex === messageHistory.length) {
          setInput("");
        } else {
          setInput(messageHistory[newIndex]);
        }
        setHistoryIndex(newIndex);
      }
    }
  };

  const processInput = async (input: string): Promise<string> => {
    return await processCommandRecursively(input);
  };

  const processCommandRecursively = async (input: string): Promise<string> => {
    const commandMatch = input.match(/\\?\/\w+/);
    if (!commandMatch) {
      return input;
    }

    const command = commandMatch[0];
    const index = commandMatch.index!;
    const beforeCommand = input.slice(0, index);
    const afterCommand = input.slice(index + command.length).trim();

    if (command.startsWith("\\")) {
      return (
        beforeCommand +
        command.slice(1) +
        (await processCommandRecursively(afterCommand))
      );
    } else {
      const processedCommand = await processCommand(command, afterCommand);
      return beforeCommand + processedCommand;
    }
  };

  const processCommand = async (
    command: string,
    input: string
  ): Promise<string> => {
    const parts = command.slice(1).split(" ");
    const cmd = parts[0];
    const args = parts.slice(1);

    switch (cmd) {
      case "roll":
        return processRollCommand(args, input);

      case "sum":
        return processSumCommand(args, input);

      default:
        return await processScriptCommand(cmd, args);
    }
  };

  const processRollCommand = async (
    args: string[],
    input: string
  ): Promise<Promise<string>> => {
    if (args.length === 0) {
      const argMatch = input.match(/^\s*(\d+d\d+)\s*/);
      if (argMatch) {
        const arg = argMatch[1];
        const remainingInput = input.slice(argMatch[0].length);
        const match = arg.match(/^(\d+)d(\d+)$/);
        if (match) {
          const numDice = parseInt(match[1], 10);
          const numSides = parseInt(match[2], 10);
          if (!isNaN(numDice) && !isNaN(numSides)) {
            const result = rollDice(numDice, numSides);
            return (
              `${result} ` + (await processCommandRecursively(remainingInput))
            );
          }
        }
      }
    }
    return (
      "Invalid command format. Use /roll <numDice>d<numSides> " +
      (await processCommandRecursively(input))
    );
  };

  const processSumCommand = async (
    args: string[],
    input: string
  ): Promise<string> => {
    if (args.length === 0) {
      const argMatch = input.match(/^\s*(\d+)\s+(\d+)\s*/);
      if (argMatch) {
        const num1 = parseFloat(argMatch[1]);
        const num2 = parseFloat(argMatch[2]);
        const remainingInput = input.slice(argMatch[0].length);
        if (!isNaN(num1) && !isNaN(num2)) {
          const result = sum([num1, num2]);
          return (
            `${result} ` + (await processCommandRecursively(remainingInput))
          );
        }
      }
    }
    return (
      "Invalid command format. Use /sum <num1> <num2> " +
      (await processCommandRecursively(input))
    );
  };

  const processScriptCommand = async (
    cmd: string,
    args: string[]
  ): Promise<string> => {
    const scriptObject = scripts.find((script) => script[cmd]);
    if (!scriptObject) {
      return `Command not found: ${cmd}`;
    }
    let script = scriptObject[cmd];

    // Identificar la última función en el script
    const functionRegex =
      /function\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(.*?\)\s*do\s*end/g;
    let match;
    let lastFunctionName = null;

    while ((match = functionRegex.exec(script)) !== null) {
      lastFunctionName = match[1];
    }

    if (lastFunctionName) {
      // Crear la llamada a la función con los argumentos proporcionados
      const functionCall = `${lastFunctionName}(${args.join(", ")})`;

      // Insertar la llamada a la función en la última línea del script
      script += `\n${functionCall}`;

      try {
        const result = await executeCode(script);
        return `Result: ${result}`;
      } catch (error) {
        console.error("Error executing script:", error);
        if (error instanceof Error) {
          return `Error executing script: ${error.message}`;
        } else {
          return `Unknown error executing script.`;
        }
      }
    } else {
      // Si no hay funciones, simplemente ejecutar el código
      try {
        const result = await executeCode(script);
        return `Result: ${result}`;
      } catch (error) {
        console.error("Error executing script:", error);
        if (error instanceof Error) {
          return `Error executing script: ${error.message}`;
        } else {
          return `Unknown error executing script.`;
        }
      }
    }
  };
  const rollDice = (numDice: number, numSides: number): number => {
    let total = 0;
    for (let i = 0; i < numDice; i++) {
      total += Math.floor(Math.random() * numSides) + 1;
    }
    return total;
  };

  const sum = (numbers: number[]): number => {
    return numbers.reduce((acc, curr) => acc + curr, 0);
  };

  const handleAddRole = () => {
    handleClose();
    if (selectedFile && selectedFile.content) {
      setRoles([...roles, selectedFile.name]);
      setScripts([...scripts, { [selectedFile.name]: selectedFile.content }]);
    }
  };

  const handleGoToParentDirectory = () => {
    if (parentDirectory) {
      setSheetsDirectory(parentDirectory);
      setParentDirectory(null);
    }
  };

  return (
    <>
      <div style={{ padding: "20px" }}>
        <div className="chat-container">
          <div className="chat-container__header">
            <button onClick={() => setActiveTab("chat")}>Chat</button>
            <button onClick={() => setActiveTab("addCharacter")}>
              {i18n.t("General.addPlayer")}
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
                <div ref={messagesEndRef} />
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
                  onKeyDown={handleKeyDown}
                  onChange={(e) => setInput(e.target.value)}
                  style={{ flex: 1, padding: "5px" }}
                />
                <button onClick={handleSend}>{i18n.t("General.send")}</button>
              </div>
            </>
          ) : (
            <div className="add-character">
              <button onClick={handleOpen}>
                {i18n.t("General.addPlayer")}
              </button>
              <div>
                {i18n.t("General.actualRoles")}: {roles.join(", ")}
              </div>
            </div>
          )}
        </div>
      </div>
      <CustomModal open={showModal} onClose={handleClose}>
        <div>
          <header className="modal-header">
            {parentDirectory && (
              <ArrowBackRoundedIcon
                style={{ cursor: "pointer" }}
                onClick={handleGoToParentDirectory}
              />
            )}
            <h3>{sheetsDirectory ? sheetsDirectory.name : "Root Directory"}</h3>
          </header>

          <Divider />
          <article className={"item-container"}>
            {sheetsDirectory?.children.map((sheet, index) =>
              isDirectory(sheet) ? (
                <div
                  className="item-container__item"
                  onClick={() => {
                    setParentDirectory(sheetsDirectory);
                    setSheetsDirectory(sheet as DirectoryProps);
                  }}
                  key={index}
                >
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
          </article>
          <Divider />
          <div className="buttons-modal_container">
            <button
              className="buttons-modal_container__cancel"
              onClick={handleClose}
            >
              {i18n.t("General.cancel")}
            </button>
            <button
              className={
                "buttons-modal_container__accept" +
                (selectedFile ? "--selected" : "--unselected")
              }
              onClick={handleAddRole}
              disabled={!selectedFile}
            >
              {i18n.t("General.accept")}
            </button>
          </div>
        </div>
      </CustomModal>
    </>
  );
};

export default Chat;