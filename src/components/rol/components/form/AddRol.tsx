import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import i18n from "../../../../i18n/i18n";
import { createDirectory, editDirectory } from "../../../../services/codeApi";
import { bytesToMB } from "../../../../utils/functions/utils";
import {
  FileSystemEnum,
  type CreateRolProps,
  type EditRolProps,
  type Id,
  type RolProps,
} from "../../../../utils/types/ApiTypes";
import { toastStyle } from "../../../Route";
import type { PhotoListFormProps } from "../../../photoCard/PhotoCardList";
import "./addRol.css";

interface RolFormProps extends PhotoListFormProps<RolProps, EditRolProps> {
  id: Id;
}

const RolForm: React.FC<RolFormProps> = ({
  id,
  selectedElement,
  onClose,
  onElementAdded,
  onElementUpdated,
}) => {
  const [name, setName] = useState(selectedElement?.name || "");
  const [description, setDescription] = useState(
    selectedElement?.description || ""
  );
  const [image, setImage] = useState<string | null>(
    selectedElement?.image ||
      "https://qph.cf2.quoracdn.net/main-qimg-f32f85d21d59a5540948c3bfbce52e68"
  );
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setName(selectedElement?.name || "");
    setDescription(selectedElement?.description || "");
    setImage(
      selectedElement?.image ||
        "https://qph.cf2.quoracdn.net/main-qimg-f32f85d21d59a5540948c3bfbce52e68"
    );
  }, [selectedElement]);

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

    if (selectedElement) {
      console.log(selectedElement.parentId);
      const updatedRol: EditRolProps = {
        id: selectedElement.id,
        parentId: selectedElement.parentId,
        name,
        image,
        description,
        type: FileSystemEnum.Rol,
      };

      const result = await editDirectory(updatedRol);
      console.log(result);
      if (result && "error" in result) {
        toast.error(i18n.t("Errors." + result.error), toastStyle);
      } else {
        onElementUpdated && onElementAdded(updatedRol as RolProps);
        toast.success(i18n.t("Rol.Success.updated", name), toastStyle);
      }
    } else {
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
        const newRol: RolProps = {
          id: result.message,
          name: name,
          parentId: id,
          image: image,
          description: description,
          type: FileSystemEnum.Rol,
          children: [],
        };
        onElementAdded(newRol);
        toast.success(i18n.t("Rol.Success.created", name), toastStyle);
      }
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
        setImage(result); // Save the Base64 string
      }
    };
  }

  return (
    <div className="container_rol_add">
      <div className="rol-card">
        <h1>
          {i18n.t(
            selectedElement ? "Rol.General.editRol" : "Rol.General.addRol"
          )}
        </h1>
        <div
          className="profile-picture"
          style={{ backgroundImage: `url(${image})` }}
        >
          <input
            ref={inputRef}
            className="file-uploader"
            type="file"
            onChange={upload}
            accept="image/*"
          />
          <div
            style={{ backgroundImage: `url(${image})` }}
            className="upload-icon"
          ></div>
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

          <button className="form-group__submit-button" type="submit">
            {i18n.t(
              selectedElement ? "Rol.General.saveChanges" : "Rol.General.addRol"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RolForm;
