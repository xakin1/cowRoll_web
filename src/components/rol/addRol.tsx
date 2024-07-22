import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import i18n from "../../i18n/i18n";
import { createDirectory } from "../../services/codeApi";
import { bytesToMB } from "../../utils/functions/utils";
import {
  FileSystemEnum,
  type CreateRolProps,
  type Id,
  type RolProps,
} from "../../utils/types/ApiTypes";
import { toastStyle } from "../Route";

interface RoleFormProps {
  id: Id;
  onClose?: () => void;
  onRoleAdded: (newRole: RolProps) => void;
}

const RoleForm: React.FC<RoleFormProps> = ({ id, onClose, onRoleAdded }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      setError(i18n.t("Rol.Error.IMAGE_REQUIRED"));
      return;
    }

    if (name.trim() === "") {
      setError(i18n.t("Rol.Error.NAME_REQUIRED"));
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
      toast.success(i18n.t("Rol.Success.created", name), toastStyle);
    }
    if (onClose) {
      onClose();
    }
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
      return alert(i18n.t("Rol.Error.ONLY_IMAGES"));
    }
    let maxBytes = 10_000_000;
    if (file.size > maxBytes) {
      return alert(i18n.t("Rol.Error.MAX_SIZE", bytesToMB(maxBytes)));
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
        <h1>{i18n.t("Rol.General.addRol")}</h1>
        <div className="profile-picture">
          <input
            ref={inputRef}
            className="file-uploader"
            type="file"
            onChange={upload}
            accept="image/*"
          />
          <div className="profile-picture" />
        </div>

        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <label htmlFor="name">{i18n.t("Rol.General.name")}</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">
              {i18n.t("Rol.General.description")}
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <button className="form-group__summit-button" type="submit">
            {i18n.t("Rol.General.addRol")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoleForm;
