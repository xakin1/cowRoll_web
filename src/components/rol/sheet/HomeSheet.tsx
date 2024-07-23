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
  type EditSheetProps,
  type Id,
  type SheetProps,
} from "../../../utils/types/ApiTypes";
import { useCurrentPath } from "../../PathProvider";
import { toastStyle } from "../../Route";
import Loading from "../../loading/Loading";
import PhotoCardList from "../../photoCard/PhotoCardList";
import SheetForm from "./components/sheetForm";
import "./styles.css";

export function HomeSheet() {
  const rolId = useSelector((state: RootState) => state.route.value);

  const [sheets, setSheets] = useState<SheetProps[]>([]);
  const [sheetsDirectory, setSheetsDirectory] = useState<DirectoryProps>();
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToPath } = useCurrentPath();

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
    return <Loading></Loading>;
  }

  const handleClick = (sheet: SheetProps) => {
    const route = `/app/rol/sheet/${sheet.id}`;
    addToPath({
      name: sheet.name,
      route: route,
    });

    navigate(route);
  };

  const handleSheetAdded = (newSheet: SheetProps) => {
    setSheets((prevSheets) => [...prevSheets, newSheet]);
  };

  const handleSheetUpdated = (updatedSheet: EditSheetProps) => {
    setSheets((prevSheets) =>
      prevSheets.map((sheet) =>
        sheet.id === updatedSheet.id
          ? { ...sheet, name: updatedSheet.name! }
          : sheet
      )
    );
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
    <>
      <PhotoCardList
        elements={sheets}
        handleClick={handleClick}
        handleDelete={handleDelete}
      >
        <SheetForm
          onElementAdded={handleSheetAdded}
          onElementUpdated={handleSheetUpdated}
          rolId={rolId}
          directoryId={sheetsDirectory?.id!}
        ></SheetForm>
      </PhotoCardList>
    </>
  );
}
