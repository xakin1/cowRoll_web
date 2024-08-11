import React, { useEffect, useRef, useState } from "react";
// Import your necessary components and hooks
import { Divider, IconButton, Tab, Tabs } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import i18n from "../../../i18n/i18n";
import { type Message } from "../../../redux/slice/chatSlice";
import type { RootState } from "../../../redux/store";
import {
  createFile,
  deleteFile,
  executeCode,
  getFiles,
} from "../../../services/codeApi";
import {
  getCodesOfRol,
  getPlayerSheets,
  getSheetsOfRol,
  isCodeFile,
  isDirectory,
  isSheetsProps,
  type CreateSheetProps,
  type DirectoryProps,
  type FileProps,
} from "../../../utils/types/ApiTypes";
import { toastStyle } from "../../Route";
import CustomModal from "../../utils/CustomModal";
import ConfirmationModal from "./ConfirmationModal";
import PlayerNameModal from "./PlayerModal";
import ViewSheet from "./ViewSheet";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import ReactMarkdown from "react-markdown";
import type { Field } from "../sheet/types";
import { handleExecuteSheetCode } from "../sheet/utilPage";
import "./chat.css";

export const enum source {
  script = "Script",
  player = "Player",
  system = "System",
}
interface scriptBodyType {
  content: string;
  source: source;
  player?: string;
}

interface playerScriptsType {
  [scriptName: string]: scriptBodyType;
}

interface scriptType {
  [playerName: string]: playerScriptsType;
}
const Chat = () => {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [role, setRole] = useState("GM");
  const [result, setResult] = useState<{ [key: string]: any }>({});
  const [scripts, setScripts] = useState<playerScriptsType[]>([]);
  const [playerScripts, setPlayerScripts] = useState<scriptType[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileProps>();
  const [roles, setRoles] = useState<string[]>(["GM"]);
  const [playerSheets, setPlayerSheets] = useState<Map<string, FileProps>>(
    new Map()
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showPlayerNameModal, setShowPlayerNameModal] =
    useState<boolean>(false);
  const [messageHistory, setMessageHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    useState<boolean>(false);
  const [sheets, setSheets] = useState<Field[][]>([[]]);
  const [currentSheetIndex, setCurrentSheetIndex] = useState(0);
  const [selectedRoleForDeletion, setSelectedRoleForDeletion] = useState<
    string | null
  >(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleClose = () => setShowModal(false);
  const handleOpen = () => setShowModal(true);

  const rolId = useSelector((state: RootState) => state.route?.value);

  const [sheetsDirectory, setSheetsDirectory] = useState<DirectoryProps>();
  const [parentDirectory, setParentDirectory] = useState<DirectoryProps | null>(
    null
  );

  const [loading, setLoading] = useState<boolean>(true);
  const fetchDocuments = async () => {
    const response = await getFiles();
    setScripts([]);
    if (rolId) {
      const directory = getSheetsOfRol(response.message, rolId);

      if (directory) {
        setSheetsDirectory(directory);
        setParentDirectory(null); // Root directory has no parent
      }

      const scriptsDirectory = getCodesOfRol(response.message, rolId);

      if (scriptsDirectory) {
        const processDirectory = (directory: DirectoryProps) => {
          directory.children.forEach((child) => {
            if (isDirectory(child)) {
              processDirectory(child);
            } else if (isCodeFile(child)) {
              if (child.content !== undefined) {
                // Ensure content is not undefined
                setScripts((prevScripts) => [
                  ...prevScripts,
                  {
                    [child.name]: {
                      content: child.content ?? "",
                      source: source.script,
                    },
                  },
                ]);
              }
            }
          });
        };
        processDirectory(scriptsDirectory);
      }

      // Initialize roles with GM and sheets marked with player: true
      const playerSheetsList = getPlayerSheets(response.message);
      const playerRoles = playerSheetsList.map((sheet) => sheet.name);
      playerSheetsList.map((sheet) => {
        if (!sheet.codes) return;
        sheet.codes.map((code) => {
          if (code.content && code.content != "")
            setPlayerScripts((prevScripts: scriptType[]) => {
              const updatedScripts: scriptType[] = [...prevScripts]; // Explicitly type as an array of scriptType

              //tenemos ver si existe ya el usuario
              const playerIndex = updatedScripts.findIndex(
                (script) => script[sheet.name]
              );

              if (playerIndex === -1) {
                // si no existe creamos la entra
                updatedScripts.push({
                  [sheet.name]: {
                    [code.name]: {
                      content: code.content ?? "",
                      source: source.player,
                      player: sheet.name,
                    },
                  },
                });
              } else {
                // y si existe pues la actualizamos
                updatedScripts[playerIndex][sheet.name][code.name] = {
                  content: code.content ?? "",
                  source: source.player,
                  player: sheet.name,
                };
              }

              return updatedScripts; // Return the updated array
            });
        });
      });

      // Create a map of player sheets for easy access
      const playerSheetsMap = new Map<string, FileProps>(
        playerSheetsList.map((sheet) => [sheet.name, sheet])
      );

      setRoles(["GM", ...playerRoles]);
      setPlayerSheets(playerSheetsMap);
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

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: processedInput, user: role, time: timestamp },
      ]);
      setMessageHistory((prev) => [...prev, input.trim()]);
      setHistoryIndex(-1);
      setInput("");
      setIsEditing(false); // Deactivate editing after sending the message
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    setIsEditing(true); // Activate editing when pressing any key

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    } else if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      insertNewLineAtCursor();
    }

    if (event.ctrlKey) {
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
    }
  };

  const insertNewLineAtCursor = () => {
    if (inputRef.current) {
      const { selectionStart, selectionEnd } = inputRef.current;
      const newValue =
        input.substring(0, selectionStart) +
        "\n" +
        input.substring(selectionEnd);
      setInput(newValue);
      setTimeout(() => {
        inputRef.current!.selectionStart = inputRef.current!.selectionEnd =
          selectionStart + 1;
      }, 0);
    }
  };

  const processInput = async (input: string): Promise<string> => {
    const lines = input.split("\n");
    const processedLines = await Promise.all(lines.map(processLine));
    return processedLines.join("\n");
  };

  const processLine = async (line: string): Promise<string> => {
    if (line.startsWith("/")) {
      return await processCommandRecursively(line);
    }
    return line;
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

      case "help":
        return processHelpCommand();

      default:
        return await processScriptCommand(cmd, input);
    }
  };

  const getScriptesFromRole = (): playerScriptsType => {
    const roleScripts = playerScripts.find((script) => script[role]);
    if (roleScripts && roleScripts[role]) {
      return roleScripts[role];
    }
    return {};
  };

  const processHelpCommand = (): string => {
    const scriptPlayer = getScriptesFromRole();
    const allScripts = scripts.concat(scriptPlayer);

    const scriptNames = allScripts.map((script) => Object.keys(script)).flat();

    scriptNames.push("roll", "sum");
    if (scriptNames.length === 0) {
      return i18n.t("Chat.General.noScripts");
    }

    const scriptList = scriptNames.map((name) => `- **/${name}**`).join("\n");
    return `\n${scriptList}`;
  };

  const processRollCommand = async (
    args: string[],
    input: string
  ): Promise<string> => {
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

  //Estos no dependen de nadie, asi que simplemente ejecutamos la última función
  const executeScript = async (script: scriptBodyType, input: string) => {
    // Identificar la última función en el script
    const functionRegex =
      /function\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(.*?\)\s*do\s*([\s\S]*?)\send/g;
    let match;
    let lastFunctionName = null;

    while ((match = functionRegex.exec(script.content)) !== null) {
      lastFunctionName = match[1];
    }

    if (lastFunctionName) {
      // Obtener el número de argumentos que necesita la función
      const argsRegex = new RegExp(
        `function\\s+${lastFunctionName}\\s*\\(([^)]*)\\)`,
        "g"
      );
      const argsMatch = argsRegex.exec(script.content);
      const numArgs = argsMatch ? argsMatch[1].split(",").length : 0;

      // Dividir el input para obtener los argumentos y el resto del input
      const inputParts = input.split(/\s+/);
      const args = inputParts.slice(0, numArgs);
      const remainingInput = inputParts.slice(numArgs).join(" ");

      // Crear la llamada a la función con los argumentos proporcionados
      const functionCall = `${lastFunctionName}(${args.join(", ")})`;

      // Insertar la llamada a la función en la última línea del script
      const finalScript = script.content + `\n${functionCall}`;
      try {
        const result = await executeCode(finalScript);
        const processedRemainingInput =
          await processCommandRecursively(remainingInput);
        if (result) {
          if ("message" in result)
            return `${result.message} ${processedRemainingInput}`;
          else
            return `${result?.error.errorCode || ""} ${processedRemainingInput}`;
        }
        return `${processedRemainingInput}`;
      } catch (error) {
        console.error("Error executing script:", error);
        if (error instanceof Error) {
          return `Error executing script: ${error.message}`;
        } else {
          return "Unknown error executing script.";
        }
      }
    } else {
      // Si no hay funciones, simplemente ejecutar el código
      try {
        const result = await executeCode(script.content);
        const processedRemainingInput = await processCommandRecursively(input);
        if (result && "message" in result) {
          return `Result: ${result.message} ${processedRemainingInput}`;
        } else {
          return `Result: ${result?.error.errorCode || ""} ${processedRemainingInput}`;
        }
      } catch (error) {
        console.error("Error executing script:", error);
        if (error instanceof Error) {
          return `Error executing script: ${error.message}`;
        } else {
          return "Unknown error executing script.";
        }
      }
    }
  };
  //Estos dependen de la hoja y tienen un main donde se le pasa los atributos
  const executePlayerScript = async (
    script: scriptBodyType,
    input: string
  ): Promise<string> => {
    const finalCode: string = handleExecuteSheetCode(
      script.content,
      sheets[currentSheetIndex]
    );
    const result = await executeCode(finalCode);
    const processedRemainingInput = await processCommandRecursively(input);
    if (result && "message" in result) {
      setResult(result.message);
      return `${processedRemainingInput}`;
    }
    return processedRemainingInput;
  };

  const processScriptCommand = async (
    cmd: string,
    input: string
  ): Promise<string> => {
    const playerScripts = getScriptesFromRole();
    const allScripts = scripts.concat(playerScripts);

    const scriptObject = allScripts.find((script) => script[cmd]);
    if (!scriptObject) {
      return i18n.t("Chat.General.commandNotFound", cmd);
    }
    let script = scriptObject[cmd];

    if (script.source == source.script) {
      console.log("a");

      return executeScript(script, input);
    } else {
      return executePlayerScript(script, input);
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
      setShowPlayerNameModal(true);
    }
  };

  const handleAddPlayer = async (playerName: string) => {
    if (selectedFile && selectedFile.content && isSheetsProps(selectedFile)) {
      const { id, ...restOfFile } = selectedFile;
      const newSheet: CreateSheetProps = {
        ...restOfFile,
        name: playerName,
        content: selectedFile.content,
        player: true,
      };

      const response = await createFile(newSheet);
      if (response && "message" in response) {
        restOfFile.codes?.map((code) => {
          createFile({
            ...code,
            content: code.content,
            directoryId: response.message,
          });
        });
        setRoles([...roles, newSheet.name]);
        setPlayerSheets(
          (prev) =>
            new Map(
              prev.set(newSheet.name, {
                ...newSheet,
                id: response.message,
                directoryId: selectedFile.directoryId,
              })
            )
        );
        restOfFile.codes?.forEach((code) => {
          if (code.content && code.content !== "") {
            setPlayerScripts((prevScripts: scriptType[]) => {
              const updatedScripts: scriptType[] = [...prevScripts]; // Explicitly type as an array of scriptType

              // Find the index of the player (if they exist) in the array
              const playerIndex = updatedScripts.findIndex(
                (script) => script[newSheet.name]
              );

              if (playerIndex === -1) {
                // If this player's entry does not exist, create it and push to the array
                updatedScripts.push({
                  [newSheet.name]: {
                    [code.name]: {
                      content: code.content ?? "",
                      source: source.player,
                      player: newSheet.name,
                    },
                  },
                });
              } else {
                // If player exists, update their script
                updatedScripts[playerIndex][newSheet.name][code.name] = {
                  content: code.content ?? "",
                  source: source.player,
                  player: newSheet.name,
                };
              }

              return updatedScripts; // Return the updated array
            });
          }
        });
      } else {
        response && toast.error(i18n.t("Errors." + response.error), toastStyle);
      }
    }
  };

  const handleGoToParentDirectory = () => {
    if (parentDirectory) {
      setSheetsDirectory(parentDirectory);
      setParentDirectory(null);
    }
  };

  const handleDeleteCharacter = (rolName: string) => {
    setShowDeleteConfirmation(true);
    setSelectedRoleForDeletion(rolName);
  };

  const confirmDeleteCharacter = async () => {
    if (selectedRoleForDeletion) {
      // Get the sheet associated with the selected role
      const sheetToDelete = playerSheets.get(selectedRoleForDeletion);

      if (sheetToDelete) {
        try {
          // Call deleteFile with the sheet's ID
          await deleteFile(sheetToDelete.id);

          // Remove the role from the roles list
          setRoles((prevRoles) =>
            prevRoles.filter((role) => role !== selectedRoleForDeletion)
          );

          // Remove the player sheet from the map
          setPlayerSheets((prevPlayerSheets) => {
            const newPlayerSheets = new Map(prevPlayerSheets);
            newPlayerSheets.delete(selectedRoleForDeletion);
            return newPlayerSheets;
          });

          // Show success toast
          toast.success(i18n.t("Success.rolDeleted"), toastStyle);
        } catch (error) {
          // Handle deletion error
          console.error("Failed to delete file:", error);
          toast.error(i18n.t("Errors.FileDeletionFailed"), toastStyle);
        }
      }

      // Hide the confirmation modal
      setShowDeleteConfirmation(false);
      setSelectedRoleForDeletion(null);
    }
  };

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    setPlayerScripts([]);
    if (newRole !== "GM") {
      const sheet = playerSheets.get(newRole);
      if (sheet && isSheetsProps(sheet)) {
        setSelectedFile(sheet);
        sheet.codes?.map((code) => {
          setPlayerScripts((prevScripts: scriptType[]) => {
            const updatedScripts: scriptType[] = [...prevScripts]; // Explicitly type as an array of scriptType

            // Find the index of the player (if they exist) in the array
            const playerIndex = updatedScripts.findIndex(
              (script) => script[sheet.name]
            );

            if (playerIndex === -1) {
              // If this player's entry does not exist, create it and push to the array
              updatedScripts.push({
                [sheet.name]: {
                  [code.name]: {
                    content: code.content ?? "",
                    source: source.player,
                    player: sheet.name,
                  },
                },
              });
            } else {
              // If player exists, update their script
              updatedScripts[playerIndex][sheet.name][code.name] = {
                content: code.content ?? "",
                source: source.player,
                player: sheet.name,
              };
            }

            return updatedScripts; // Return the updated array
          });
        });
      }
    } else {
      setSelectedFile(undefined);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSheetsChange = (updatedSheets: Field[][]) => {
    setSheets(updatedSheets);
  };

  const handleCurrentSheetIndexChange = (index: number) => {
    setCurrentSheetIndex(index);
  };

  return (
    <>
      <div className="chat-page">
        <div style={{ padding: "20px" }}>
          <div className="chat-container">
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="chat tabs"
            >
              <Tab
                label={i18n.t("General.chat")}
                sx={{ color: "var(--text-color)" }}
              />
              <Tab
                label={i18n.t("General.addPlayer")}
                sx={{ color: "var(--text-color)" }}
              />
            </Tabs>
            {activeTab === 0 && (
              <>
                <div className="chat-container__body">
                  {(messages || []).map((message, index) => (
                    <div className="chat-container__body__message" key={index}>
                      <div>
                        <strong>{message.user}:</strong>{" "}
                        <ReactMarkdown>{message.text}</ReactMarkdown>
                      </div>
                      <div style={{ fontSize: "0.8em", color: "gray" }}>
                        {message.time}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="chat-container__footer">
                  <select
                    className="chat-container__footer__role_selector"
                    value={role}
                    onChange={(e) => handleRoleChange(e.target.value)}
                  >
                    {roles.map((role, index) => (
                      <option key={index} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  <textarea
                    ref={inputRef}
                    value={input}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setInput(e.target.value)}
                    style={{ flex: 1, padding: "5px" }}
                  />
                  <button onClick={handleSend}>{i18n.t("General.send")}</button>
                </div>
              </>
            )}
            {activeTab === 1 && (
              <div className="add-character">
                <button className="button-addPlayer" onClick={handleOpen}>
                  {i18n.t("General.addPlayer")}
                  <span style={{ fontSize: "20px" }}>+</span>
                </button>
                <Divider></Divider>
                <div className="roles-div">
                  {i18n.t("General.actualRoles")}:{" "}
                  <strong>{roles.join(", ")}</strong>
                </div>
                <ul>
                  {roles.map(
                    (role, index) =>
                      role !== "GM" && (
                        <li key={index}>
                          {role}
                          <IconButton
                            onClick={() => handleDeleteCharacter(role)}
                            sx={{ color: "var(--text-color)" }} // Aplica el color al IconButton
                          >
                            <DeleteIcon></DeleteIcon>
                          </IconButton>
                        </li>
                      )
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
        {selectedFile && isSheetsProps(selectedFile) && (
          <ViewSheet
            sheet={selectedFile}
            result={result}
            onSheetsChange={handleSheetsChange}
            onCurrentSheetIndexChange={handleCurrentSheetIndexChange}
          ></ViewSheet>
        )}
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
              isSheetsProps(sheet) && sheet.player ? (
                <></>
              ) : isDirectory(sheet) ? (
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

      <PlayerNameModal
        open={showPlayerNameModal}
        onClose={() => setShowPlayerNameModal(false)}
        onAddPlayer={handleAddPlayer}
      />

      <ConfirmationModal
        open={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={confirmDeleteCharacter}
        title="Confirm Delete"
        description={`Are you sure you want to delete ${selectedRoleForDeletion}?`}
      />
    </>
  );
};

export default Chat;
