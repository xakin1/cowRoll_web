import { useEffect, useState } from "react";
import { editFile } from "../../../services/codeApi";
import type { EditSheetProps, SheetProps } from "../../../utils/types/ApiTypes";
import PageField from "../sheet/PageField";
import { PageSelector } from "../sheet/components/pageSelector/PageSelector";
import type { Field } from "../sheet/types";
import "./chat.css";

interface ViewSheetProps {
  sheet: SheetProps;
}

const ViewSheet: React.FC<ViewSheetProps> = ({ sheet }) => {
  const [sheets, setSheets] = useState<Field[][]>([[]]);
  const [currentSheetIndex, setCurrentSheetIndex] = useState(0);

  const handleFieldChange = (fieldId: string, changes: Partial<Field>) => {
    console.log(changes);
    const newSheets = sheets.map((sheetFields, index) =>
      index === currentSheetIndex
        ? sheetFields.map((field) =>
            field.id === fieldId ? { ...field, ...changes } : field
          )
        : sheetFields
    );
    setSheets(newSheets);
    saveFields(newSheets);
  };
  const nextSheet = () => {
    setCurrentSheetIndex((prevIndex) =>
      prevIndex < sheets.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const previousSheet = () => {
    setCurrentSheetIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };

  const goToSheet = (page: number) => {
    setCurrentSheetIndex(page);
  };
  const loadFields = () => {
    if (sheet && sheet.content) {
      setSheets(JSON.parse(sheet.content));
    }
  };

  useEffect(() => {
    loadFields();
  }, [sheet]);

  const saveFields = async (sheetsUpdated: Field[][]) => {
    const sheetsJSON = JSON.stringify(sheetsUpdated);
    sheetsUpdated.map((sheet) =>
      sheet.map((field) => {
        if (field.name == "characterName") console.log(field);
      })
    );
    if (sheetsJSON && sheetsJSON !== "{}" && sheetsJSON !== "[]") {
      const fileProps: EditSheetProps = {
        ...sheet!,
        content: sheetsJSON,
      };

      editFile(fileProps);
    }
  };

  return (
    <>
      <div className="page_container">
        <div className="page_container__page">
          {sheets[currentSheetIndex].map((field) => (
            <PageField
              key={field.id}
              onChange={handleFieldChange}
              editable={false}
              {...field}
            />
          ))}
        </div>
        <div className="page_selector_wrapper">
          <PageSelector
            previousPage={previousSheet}
            nextPage={nextSheet}
            currentSheetIndex={currentSheetIndex}
            totalSheets={sheets.length}
            goToPage={goToSheet}
          />
        </div>
      </div>
    </>
  );
};

export default ViewSheet;
