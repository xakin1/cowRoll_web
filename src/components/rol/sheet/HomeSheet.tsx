import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import i18n from "../../../i18n/i18n";
import { setDirectorySystem } from "../../../redux/slice/DirectorySystemSlice";
import type { RootState } from "../../../redux/store";
import {
  deleteFile,
  editDirectory,
  editFile,
  getFiles,
} from "../../../services/codeApi";
import {
  getSheetsOfRol,
  isDirectory,
  isSheetsProps,
  type DirectoryProps,
  type DirectorySystemProps,
  type EditDirectorySystemProps,
  type Id,
  type SheetProps,
} from "../../../utils/types/ApiTypes";
import { useCurrentPath } from "../../PathProvider";
import { toastStyle } from "../../Route";
import Loading from "../../loading/Loading";
import PhotoCard from "../../photoCard/PhotoCard";
import PhotoCardList from "../../photoCard/PhotoCardList";
import FolderForm from "./components/FolderForm";
import SheetForm from "./components/sheetForm";
import "./styles.css";

export function HomeSheet() {
  const rolId = useSelector((state: RootState) => state.route.value);

  const [sheets, setSheets] = useState<DirectorySystemProps[]>([]);
  const [sheetsDirectory, setSheetsDirectory] = useState<DirectoryProps>();
  const [isSubDirectory, setIsSubDirectory] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [directoryHistory, setDirectoryHistory] = useState<DirectoryProps[]>(
    []
  ); // Nuevo estado para el historial
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToPath, currentPath, removeLastFromPath } = useCurrentPath();

  const fetchDocuments = async () => {
    const response = await getFiles();
    dispatch(setDirectorySystem(response.message));
    if (rolId) {
      const directory = getSheetsOfRol(response.message, rolId);

      if (directory) {
        const sheets: SheetProps[] = directory.children as SheetProps[];
        setSheetsDirectory(directory);
        setSheets(sheets);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchDocuments();
  }, [dispatch]);

  if (loading) {
    return <Loading />;
  }

  const handleClick = () => {
    console.log(directoryHistory.length > 0);
    if (directoryHistory.length > 0) {
      const previousDirectory = directoryHistory[directoryHistory.length - 1];
      setDirectoryHistory((prevHistory) => prevHistory.slice(0, -1));
      setSheets(previousDirectory.children);
      setSheetsDirectory(previousDirectory);
    } else {
      setIsSubDirectory(false);
      navigate("/app/rol/");
    }
  };

  const handleDoubleClick = (sheet: DirectorySystemProps) => {
    if (isSheetsProps(sheet)) {
      const route = `/app/rol/sheet/${sheet.id}`;
      addToPath({
        name: sheet.name,
        route: route,
      });
      navigate(route);
    } else if (isDirectory(sheet)) {
      setDirectoryHistory((prevHistory) => [...prevHistory, sheetsDirectory!]);
      setIsSubDirectory(true);
      setSheets(sheet.children);
      setSheetsDirectory(sheet);
    }
  };

  const handleElementAdded = (newSheet: DirectorySystemProps) => {
    setSheets((prevSheets) => [...prevSheets, newSheet]);
  };

  const handleElementtUpdated = (updatedSheet: EditDirectorySystemProps) => {
    setSheets((prevSheets) =>
      prevSheets.map((sheet) =>
        sheet.id === updatedSheet.id
          ? { ...sheet, name: updatedSheet.name! }
          : sheet
      )
    );
  };

  const handleMove = async (
    elements: DirectorySystemProps[],
    targetFolder: DirectoryProps
  ) => {
    const promises = elements.map((element) => {
      if (isDirectory(element)) {
        return editDirectory({ ...element, parentId: targetFolder.id });
      } else {
        return editFile({ ...element, directoryId: targetFolder.id });
      }
    });

    await Promise.all(promises);
    fetchDocuments();
  };

  const handleDelete = async (id: Id) => {
    const response = await deleteFile(id);
    if (response && "message" in response) {
      toast.success(i18n.t("Rol.Sheet.Success.deleted"), toastStyle);
      fetchDocuments();
    } else {
      toast.error(i18n.t("Rol.Sheet.Error.deleted"), toastStyle);
    }
  };

  return (
    <div className="container-photoCards">
      <PhotoCard
        handleDoubleClick={handleClick}
        name={"back"}
        image={"/back-arrow.svg"}
      ></PhotoCard>

      <PhotoCardList
        elements={sheets}
        handleDoubleClick={handleDoubleClick}
        handleDelete={handleDelete}
        handleMove={handleMove}
        children={
          <SheetForm
            onElementAdded={handleElementAdded}
            onElementUpdated={handleElementtUpdated}
            rolId={rolId}
            directoryId={sheetsDirectory?.id!}
          />
        }
        childrenFolder={
          <FolderForm
            onElementAdded={handleElementAdded}
            onElementUpdated={handleElementtUpdated}
            rolId={rolId}
            directoryId={sheetsDirectory?.id!}
          />
        }
      />
    </div>
  );
}
