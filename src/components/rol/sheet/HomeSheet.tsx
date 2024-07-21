import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import i18n from "../../../i18n/i18n";
import { setDirectorySystem } from "../../../redux/slice/DirectorySystemSlice";
import type { RootState } from "../../../redux/store";
import { deleteFile, getFiles } from "../../../services/codeApi";
import {
  getSheetsOfRol,
  type DirectoryProps,
  type Id,
  type SheetProps,
} from "../../../utils/types/ApiTypes";
import { toastStyle } from "../../Route";
import PhotoCardList from "../../photoCard/PhotoCardList";
import SheetForm from "./components/sheetForm";
import "./styles.css";

export function HomeSheet() {
  const rolId = useSelector((state: RootState) => state.id.value);

  const [sheets, setSheets] = useState<SheetProps[]>([]);
  const [sheetsDirectory, setSheetsDirectory] = useState<DirectoryProps>();
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sheetName, setSheetName] = useState("");

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
  useEffect(() => {
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

  const handleDelete = async (id: Id) => {
    const response = await deleteFile(id);
    if (response && "message" in response) {
      toast.success(i18n.t("Success.Role.Deleted"), toastStyle);
      fetchDocuments(); // Refetch documents after delete
    } else {
      toast.error(i18n.t("Error.Role.Deleted"), toastStyle);
    }
  };

  return (
    <>
      <PhotoCardList
        elements={sheets}
        handleClick={handleClick}
        handleDelete={handleDelete}
      >
        <SheetForm
          handleSheetAdded={handleSheetAdded}
          sheetName={sheetName}
          handleChange={setSheetName}
          rolId={rolId}
          directoryId={sheetsDirectory?.id!}
        ></SheetForm>
      </PhotoCardList>
    </>
  );
}
