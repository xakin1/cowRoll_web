import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setDirectorySystem } from "../redux/slice/DirectorySystemSlice";
import { setId } from "../redux/slice/idSlice";
import { getFiles } from "../services/codeApi";
import {
  isDirectory,
  type DirectoryProps,
  type Id,
  type RolProps,
} from "../utils/types/ApiTypes";
import CustomModal from "./CustomModal";
import PhotoCardList from "./photoCard/PhotoCardList";
import RoleForm from "./rol/addRol";

export function MainPage() {
  const [roles, setRoles] = useState<RolProps[]>([]);
  const [rolesDirectory, setRolesDirectory] = useState<DirectoryProps>();
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleClose = () => setShowModal(false);
  const handleOpen = () => setShowModal(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
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
    fetchDocuments();
  }, [dispatch]);

  const isRolProps = (item: any): item is RolProps => {
    return item.type === "Rol" && "description" in item && "image" in item;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleClick = (id: Id) => {
    dispatch(setId(id));
    navigate(`/app/rol`);
  };

  const handleRoleAdded = async (newRole: RolProps) => {
    // Update the roles state
    setRoles((prevRoles) => [...prevRoles, newRole]);

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

  return (
    <>
      <PhotoCardList
        elements={roles}
        handleClick={handleClick}
        handleOpen={handleOpen}
      ></PhotoCardList>

      <CustomModal open={showModal} onClose={handleClose}>
        <RoleForm
          id={rolesDirectory?.id || ""}
          onClose={handleClose}
          onRoleAdded={handleRoleAdded}
        />
      </CustomModal>
    </>
  );
}
