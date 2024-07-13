import { Box, Modal } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setDirectorySystem } from "../redux/slice/fileSlide";
import { setId } from "../redux/slice/idSlice";
import { getFiles } from "../services/codeApi";
import {
  isDirectory,
  type DirectoryProps,
  type Id,
  type RolProps,
} from "../utils/types/ApiTypes";
import PhotoCard from "./photoCard/PhotoCard";
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

  const handleRoleAdded = (newRole: RolProps) => {
    setRoles((prevRoles) => [...prevRoles, newRole]);
  };

  return (
    <>
      <div className="photo-grid sibling-fade">
        {roles.map((rol: RolProps) => (
          <PhotoCard
            key={rol.id}
            handleClick={() => handleClick(rol.id)}
            name={rol.name}
            image={rol.image}
          />
        ))}
        <div className="add-card" onClick={handleOpen}>
          <div className="add-icon">+</div>
          <div className="add-text">Añadir</div>
        </div>
      </div>
      <button className="trash-button">Papelera</button>
      <Modal open={showModal} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            height: "auto",
          }}
        >
          <RoleForm
            id={rolesDirectory?.id || ""}
            onClose={handleClose}
            onRoleAdded={handleRoleAdded}
          />
        </Box>
      </Modal>
    </>
  );
}
