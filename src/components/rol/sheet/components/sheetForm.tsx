import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import i18n from "../../../../i18n/i18n";
import { createFile } from "../../../../services/codeApi";
import {
  FileSystemEnum,
  type CreateSheetProps,
  type DirectoryProps,
  type SheetProps,
} from "../../../../utils/types/ApiTypes";
import { toastStyle } from "../../../Route";
import type { Id } from "../types";

interface SheetFormProps {
  onClose?: () => void;
  rolId: Id | null;
  directoryId: Id;
  sheetName: string;
  handleChange: (e: any) => void;
  handleSheetAdded: (sheet: SheetProps) => void;
  sheetsDirectory?: DirectoryProps;
}

const SheetForm: React.FC<SheetFormProps> = ({
  onClose,
  sheetName,
  rolId,
  directoryId,
  handleChange,
  handleSheetAdded,
}) => {
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      console.log("a");
      event.preventDefault();
      handleSubmit(event);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(rolId);
    if (!rolId) {
      console.error("No se encontró el rolId");
      return;
    }

    if (sheetName === "") {
      setError("Name is required.");
      return;
    }

    setError(null);
    const sheet: CreateSheetProps = {
      name: sheetName,
      directoryId: directoryId,
      type: FileSystemEnum.Sheet,
    };

    const createFileResult = await createFile(sheet);
    if (createFileResult && "error" in createFileResult) {
      toast.error(i18n.t("Errors." + createFileResult.error), toastStyle);
    } else if (createFileResult && "message" in createFileResult) {
      const newSheet: SheetProps = {
        id: createFileResult.message,
        name: sheetName,
        directoryId: directoryId,
        type: FileSystemEnum.Sheet,
      };
      handleSheetAdded(newSheet);
      toast.success(i18n.t("Success.RoleCreated"), toastStyle);
    }
    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="custom-modal__title">Nombre de la ficha</h2>
      <div className="custom-modal__input-group">
        <input
          type="text"
          id="sheetName"
          value={sheetName}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="custom-modal__input-group__input-field"
          required
          ref={inputRef}
        />
      </div>
      {error && <p className="error-text">{error}</p>}
      <button type="submit" className="submit-button">
        Submit
      </button>
    </form>
  );
};

export default SheetForm;
