import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import i18n from "../../../i18n/i18n";
import { setDirectorySystem } from "../../../redux/slice/fileSlide";
import type { RootState } from "../../../redux/store";
import {
  createDirectory,
  createFile,
  getFiles,
} from "../../../services/codeApi";
import {
  FileSystemEnum,
  getSheetsOfRol,
  type CreateDirectoryProps,
  type CreateSheetProps,
  type DirectoryProps,
  type Id,
  type SheetProps,
} from "../../../utils/types/ApiTypes";
import { toastStyle } from "../../App";
import CustomModal from "../../CustomModal";
import PhotoCardList from "../../photoCard/PhotoCardList";
import "./styles.css";

export function HomeSheet() {
  const rolId = useSelector((state: RootState) => state.id.value);

  const [sheets, setSheets] = useState<SheetProps[]>([]);
  const [sheetsDirectory, setSheetsDirectory] = useState<DirectoryProps>();
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleClose = () => setShowModal(false);
  const handleOpen = () => setShowModal(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sheetName, setSheetName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      const response = await getFiles();
      dispatch(setDirectorySystem(response.message));
      if (rolId) {
        const directory = getSheetsOfRol(response.message, rolId);

        if (directory) {
          // Assuming the children of 'directory' are of type 'SheetProps'
          const sheets: SheetProps[] = directory.children as SheetProps[];
          setSheetsDirectory(directory);
          setSheets(sheets);
        }
      }

      setLoading(false);
    };

    fetchDocuments();
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleClick = (id: Id) => {
    navigate(`/app/rol/sheet/${id}`);
  };

  const handleSheetAdded = (newSheet: SheetProps) => {
    setSheets((prevSheets) => [...prevSheets, newSheet]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rolId) {
      //TODO: gestionar esto como se debe
      return;
    }

    let directory = sheetsDirectory;

    if (!sheetsDirectory) {
      const sheet: CreateDirectoryProps = {
        name: "Sheets",
        parentId: rolId,
        type: FileSystemEnum.Directory,
      };
      const result = await createDirectory(sheet); // Await the asynchronous call

      if (result && "message" in result) {
        directory = {
          id: result.message as Id,
          name: "Sheets",
          parentId: rolId,
          children: [],
          type: FileSystemEnum.Directory,
        };
        setSheetsDirectory(directory); // Use the assigned variable
      } else {
        // TODO: MIRAR COMO GESTIONAR ESTO
        return;
      }
    }

    if (!directory) {
      // This check ensures that directory is defined
      setError("Directory not found.");
      return;
    }

    if (sheetName === "") {
      setError("Name is required.");
      return;
    }

    setError(null);
    const sheet: CreateSheetProps = {
      name: sheetName,
      directoryId: directory.id,
      type: FileSystemEnum.Sheet,
    };

    const createFileResult = await createFile(sheet);
    if (createFileResult && "error" in createFileResult) {
      toast.error(i18n.t("Errors." + createFileResult.error), toastStyle);
    } else if (createFileResult && "message" in createFileResult) {
      const newSheet: SheetProps = {
        id: createFileResult.message,
        name: sheetName,
        directoryId: directory.id,
        type: FileSystemEnum.Sheet,
      };
      handleSheetAdded(newSheet);
      toast.success(i18n.t("Success.RoleCreated"), toastStyle);
    }

    handleClose();
  };

  return (
    <>
      <PhotoCardList
        elements={sheets}
        handleClick={handleClick}
        handleOpen={handleOpen}
      ></PhotoCardList>

      <CustomModal open={showModal} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <h2 className="custom-modal__title">Nombre de la ficha</h2>
          <div className="custom-modal__input-group">
            <input
              type="text"
              id="sheetName"
              value={sheetName}
              onChange={(e) => setSheetName(e.target.value)}
              className="custom-modal__input-group__input-field"
              required
            />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </CustomModal>
    </>
  );
}
