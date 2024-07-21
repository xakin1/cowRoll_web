import React, { useState } from "react";
import { toast } from "react-toastify";
import i18n from "../../i18n/i18n";
import { createDirectory } from "../../services/codeApi";
import {
  FileSystemEnum,
  type CreateRolProps,
  type Id,
  type RolProps,
} from "../../utils/types/ApiTypes";
import { toastStyle } from "../Route";

interface RoleFormProps {
  id: Id;
  onClose: () => void;
  onRoleAdded: (newRole: RolProps) => void;
}

const RoleForm: React.FC<RoleFormProps> = ({ id, onClose, onRoleAdded }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      setError("Image is required.");
      return;
    }

    if (name.trim() === "") {
      setError("Name is required.");
      return;
    }

    setError(null);
    const directory: CreateRolProps = {
      name: name,
      parentId: id,
      image: image,
      description: description,
      type: FileSystemEnum.Rol,
    };

    const result = await createDirectory(directory);
    if (result && "error" in result) {
      toast.error(i18n.t("Errors." + result.error), toastStyle);
    } else if (result && "message" in result) {
      const newRole: RolProps = {
        id: result.message,
        name: name,
        parentId: id,
        image: image,
        description: description,
        type: FileSystemEnum.Rol,
        children: [],
      };
      onRoleAdded(newRole);
      toast.success(i18n.t("Success.RoleCreated"), toastStyle);
    }
    onClose();
  };

  function upload() {
    const fileUploadInput =
      document.querySelector<HTMLInputElement>(".file-uploader");

    if (
      !fileUploadInput ||
      !fileUploadInput.files ||
      !fileUploadInput.files[0]
    ) {
      return;
    }

    const file = fileUploadInput.files[0];

    if (!file.type.includes("image")) {
      return alert("Only images are allowed!");
    }

    if (file.size > 10_000_000) {
      return alert("Maximum upload size is 10MB!");
    }

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = (fileReaderEvent) => {
      if (fileReaderEvent.target) {
        const result = fileReaderEvent.target.result as string;
        const profilePicture =
          document.querySelector<HTMLElement>(".profile-picture");
        if (profilePicture) {
          profilePicture.style.backgroundImage = `url(${result})`;
        }
        setImage(result); // Save the Base64 string
      }
    };
  }

  return (
    <div className="container_rol_add">
      <div className="role-card">
        <h1>Add Role</h1>
        <div className="profile-picture">
          <h1 className="upload-icon">
            <i className="fa fa-plus fa-2x" aria-hidden="true"></i>
          </h1>
          <input
            className="file-uploader"
            type="file"
            onChange={upload}
            accept="image/*"
          />
        </div>

        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <button className="form-group__summit-button" type="submit">
            Add Role
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoleForm;
