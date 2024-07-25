import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import i18n from "../i18n/i18n";
import { setDirectorySystem } from "../redux/slice/DirectorySystemSlice";
import { setId } from "../redux/slice/routeSlice";
import { deleteFile, getFiles } from "../services/codeApi";
import {
  isDirectory,
  type DirectoryProps,
  type EditRolProps,
  type Id,
  type RolProps,
} from "../utils/types/ApiTypes";
import { useCurrentPath } from "./PathProvider";
import { toastStyle } from "./Route";
import Loading from "./loading/Loading";
import PhotoCardList from "./photoCard/PhotoCardList";
import RolForm from "./rol/components/form/AddRol";

export function MainPage() {
  const [roles, setRoles] = useState<RolProps[]>([]);
  const [rolesDirectory, setRolesDirectory] = useState<DirectoryProps>();
  const [loading, setLoading] = useState<boolean>(true);
  const { addToPath } = useCurrentPath();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchDocuments = async () => {
    const response = await getFiles();
    dispatch(setDirectorySystem(response.message));
    if (response) {
      const rolesArray: RolProps[] = [];
      response.message.children.forEach((child) => {
        if (child.name === "Roles" && isDirectory(child)) {
          setRolesDirectory(child); // Guardar el directorio "Roles"
          const rolPropsChildren = child.children.filter(isRolProps);
          rolesArray.push(...(rolPropsChildren as RolProps[]));
        }
      });
      setRoles(rolesArray);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDocuments();
  }, [dispatch]);

  const isRolProps = (item: any): item is RolProps => {
    return item.type === "Rol" && "description" in item && "image" in item;
  };

  if (loading) {
    return <Loading></Loading>;
  }

  const handleClick = (rol: RolProps) => {
    const route = `/app/rol`;
    addToPath({ name: rol.name, route: route });
    dispatch(setId(rol.id));
    navigate(route);
  };

  const handleDelete = async (id: Id) => {
    const response = await deleteFile(id);
    if (response && "message" in response) {
      toast.success(i18n.t("Rol.Success.deleted"), toastStyle);
      fetchDocuments(); // Actualizar el estado de la aplicación
    } else {
      toast.error(i18n.t("Rol.Error.Deleted"), toastStyle);
    }
  };

  const updateDirectory = async () => {
    try {
      const response = await getFiles();
      if (response && response.message) {
        dispatch(setDirectorySystem(response.message));
      } else {
        console.error("Invalid response from getFiles:", response);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const handleRoleAdded = async (newRol: RolProps) => {
    setRoles((prevRoles) => [...prevRoles, newRol]);
    updateDirectory();
  };
  const updateRole = (updatedRol: EditRolProps) => {
    setRoles((prevRoles) =>
      prevRoles.map((role) =>
        role.id === updatedRol.id ? { ...role, ...updatedRol } : role
      )
    );
    updateDirectory();
  };

  return (
    <>
      <PhotoCardList
        elements={roles}
        handleClick={handleClick}
        handleDelete={handleDelete}
      >
        <RolForm
          id={rolesDirectory?.id || ""}
          onElementAdded={handleRoleAdded}
          onElementUpdated={updateRole}
        />
      </PhotoCardList>
    </>
  );
}
