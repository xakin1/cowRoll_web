import { useEffect, useState } from "react";
import { editFile } from "../../../services/codeApi";
import {
  type EditSheetProps,
  type SheetProps,
} from "../../../utils/types/ApiTypes";
import { sufixSelectable } from "../editor/blockyEditor/BlocklyEditor";
import PageField from "../sheet/PageField";
import { typeField } from "../sheet/RenderFields";
import { PageSelector } from "../sheet/components/pageSelector/PageSelector";
import type { Field } from "../sheet/types";
import "./chat.css";

interface ViewSheetProps {
  sheet: SheetProps;
  onSheetsChange: (sheets: Field[][]) => void;
  onCurrentSheetIndexChange: (index: number) => void;
  result: { [key: string]: any };
}

const ViewSheet: React.FC<ViewSheetProps> = ({
  sheet,
  onSheetsChange,
  onCurrentSheetIndexChange,
  result,
}) => {
  const [sheets, setSheets] = useState<Field[][]>([[]]);
  const [currentSheetIndex, setCurrentSheetIndex] = useState(0);

  const handleFieldChange = (fieldId: string, changes: Partial<Field>) => {
    const newSheets = sheets.map((sheetFields, index) =>
      index === currentSheetIndex
        ? sheetFields.map((field) =>
            field.id === fieldId ? { ...field, ...changes } : field
          )
        : sheetFields
    );
    setSheets(newSheets);
    onSheetsChange(newSheets); // Notifica al componente padre
    saveFields(newSheets);
  };

  const nextSheet = () => {
    setCurrentSheetIndex((prevIndex) => {
      const newIndex =
        prevIndex < sheets.length - 1 ? prevIndex + 1 : prevIndex;
      onCurrentSheetIndexChange(newIndex); // Notifica al componente padre
      return newIndex;
    });
  };

  const previousSheet = () => {
    setCurrentSheetIndex((prevIndex) => {
      const newIndex = prevIndex > 0 ? prevIndex - 1 : prevIndex;
      onCurrentSheetIndexChange(newIndex); // Notifica al componente padre
      return newIndex;
    });
  };

  const goToSheet = (page: number) => {
    setCurrentSheetIndex(page);
    onCurrentSheetIndexChange(page); // Notifica al componente padre
  };

  const loadFields = () => {
    if (sheet && sheet.content) {
      const loadedSheets = JSON.parse(sheet.content);
      setSheets(loadedSheets);
      onSheetsChange(loadedSheets); // Notifica al componente padre
    }
  };

  useEffect(() => {
    loadFields();
  }, [sheet]);

  const saveFields = async (sheetsUpdated: Field[][]) => {
    const sheetsJSON = JSON.stringify(sheetsUpdated);

    if (sheetsJSON && sheetsJSON !== "{}" && sheetsJSON !== "[]") {
      const fileProps: EditSheetProps = {
        ...sheet!,
        content: sheetsJSON,
      };

      editFile(fileProps);
    }
  };

  useEffect(() => {
    if (result) {
      handleScriptExecution(result);
    }
  }, [result]);

  const handleScriptExecution = (output: { [key: string]: any }) => {
    setSheets((prevSheets) => {
      const newSheets = [...prevSheets];
      newSheets[currentSheetIndex] = newSheets[currentSheetIndex].map(
        (field) => {
          if (output.hasOwnProperty(field.name)) {
            if (field.type === typeField.selectable) {
              const optionsKey = field.name;
              const valueKey = field.name + sufixSelectable;
              const indexValue = output[valueKey];
              return {
                ...field,
                options: output[optionsKey] || "",
                value: output[optionsKey][indexValue] || "",
              };
            } else {
              return {
                ...field,
                value: output[field.name as string],
              };
            }
          }
          return field;
        }
      );
      return newSheets;
    });
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
