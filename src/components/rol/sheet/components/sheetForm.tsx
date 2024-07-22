import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import i18n from "../../../../i18n/i18n";
import { createFile, editFile } from "../../../../services/codeApi";
import {
  FileSystemEnum,
  type CreateSheetProps,
  type DirectoryProps,
  type EditSheetProps,
  type SheetProps,
} from "../../../../utils/types/ApiTypes";
import { toastStyle } from "../../../Route";
import type { PhotoListFormProps } from "../../../photoCard/PhotoCardList";
import type { Id } from "../types";

interface SheetFormProps
  extends PhotoListFormProps<SheetProps, EditSheetProps> {
  rolId: Id | null;
  directoryId: Id;
  selectedElement?: SheetProps;
  sheetsDirectory?: DirectoryProps;
}

const SheetForm: React.FC<SheetFormProps> = ({
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
    console.log(rolId);
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
      const sheet: EditSheetProps = { ...selectedElement, name: name };

      const createFileResult = await editFile(sheet);
      if (createFileResult && "error" in createFileResult) {
        toast.error(i18n.t("Errors." + createFileResult.error), toastStyle);
      } else if (createFileResult && "message" in createFileResult) {
        onElementUpdated && onElementUpdated(sheet);
        toast.success(i18n.t("Rol.Sheet.Success.updated", name), toastStyle);
      }
    } else {
      const sheet: CreateSheetProps = {
        name: name,
        directoryId: directoryId,
        type: FileSystemEnum.Sheet,
      };

      const createFileResult = await createFile(sheet);
      if (createFileResult && "error" in createFileResult) {
        toast.error(i18n.t("Errors." + createFileResult.error), toastStyle);
      } else if (createFileResult && "message" in createFileResult) {
        const newSheet: SheetProps = {
          id: createFileResult.message,
          name: name,
          directoryId: directoryId,
          type: FileSystemEnum.Sheet,
        };
        onElementAdded(newSheet);
        toast.success(i18n.t("Rol.Sheet.Success.created", name), toastStyle);
      }
    }

    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="custom-modal__title">
        {i18n.t("Rol.Sheet.General.sheetName")}
      </h2>
      <div className="custom-modal__input-group">
        <input
          type="text"
          id="sheetName"
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

export default SheetForm;
