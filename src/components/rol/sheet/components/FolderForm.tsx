import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import i18n from "../../../../i18n/i18n";
import { createDirectory, editDirectory } from "../../../../services/codeApi";
import {
  FileSystemEnum,
  type CreateDirectoryProps,
  type DirectoryProps,
  type editDirectoryProps,
} from "../../../../utils/types/ApiTypes";
import { toastStyle } from "../../../Route";
import type { PhotoListFormProps } from "../../../photoCard/PhotoCardList";
import type { Id } from "../types";

interface SheetFormProps
  extends PhotoListFormProps<DirectoryProps, editDirectoryProps> {
  rolId: Id | null;
  directoryId: Id;
  selectedElement?: DirectoryProps;
  sheetsDirectory?: DirectoryProps;
}

const FolderForm: React.FC<SheetFormProps> = ({
  onClose,
  rolId,
  directoryId,
  selectedElement,
  onElementAdded,
  onElementUpdated,
}) => {
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setName(selectedElement?.name || "");
  }, [selectedElement]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rolId) {
      console.error(i18n.t("Rol.Sheet.Error.ROL_ID_NOT_FOUND"));

      return;
    }

    if (name === "") {
      setError(i18n.t("Rol.Sheet.Error.NAME_REQUIRED"));
      return;
    }

    setError(null);

    if (selectedElement) {
      const sheet: editDirectoryProps = { ...selectedElement, name: name };

      const createDirectoryResult = await editDirectory(sheet);
      if (createDirectoryResult && "error" in createDirectoryResult) {
        toast.error(
          i18n.t("Errors." + createDirectoryResult.error),
          toastStyle
        );
      } else if (createDirectoryResult && "message" in createDirectoryResult) {
        onElementUpdated && onElementUpdated(sheet);
        toast.success(i18n.t("Rol.Sheet.Success.updated", name), toastStyle);
      }
    } else {
      const folder: CreateDirectoryProps = {
        name: name,
        parentId: directoryId,
        type: FileSystemEnum.Directory,
      };

      const createDirectoryResult = await createDirectory(folder);
      if (createDirectoryResult && "error" in createDirectoryResult) {
        toast.error(
          i18n.t("Errors." + createDirectoryResult.error),
          toastStyle
        );
      } else if (createDirectoryResult && "message" in createDirectoryResult) {
        const newFolder: DirectoryProps = {
          id: createDirectoryResult.message,
          name: name,
          parentId: directoryId,
          type: FileSystemEnum.Directory,
          children: [],
        };
        onElementAdded(newFolder);
        toast.success(i18n.t("Rol.Sheet.Success.created", name), toastStyle);
      }
    }

    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="custom-modal__title">
        {i18n.t("Rol.Sheet.General.folderName")}
      </h2>
      <div className="custom-modal__input-group">
        <input
          type="text"
          id="folderName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="custom-modal__input-group__input-field"
          required
          ref={inputRef}
        />
      </div>
      {error && <p className="error-text">{error}</p>}
      <button type="submit" className="submit-button">
        {i18n.t(
          selectedElement ? "Rol.General.saveChanges" : "Rol.General.summit"
        )}
      </button>
    </form>
  );
};

export default FolderForm;
