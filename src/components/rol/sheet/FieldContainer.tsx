import React, { useContext, useEffect } from "react";
import { useDrop } from "react-dnd";

import { FileSystemEnum } from "../../../utils/types/ApiTypes";
import { CharacterSheetContext } from "./CharacterSheetContext";
import DraggableField from "./DraggableField";
import "./styles.css";
import type { Field, FieldWithoutId } from "./types";

const FieldContainer: React.FC = () => {
  const { fields, addField, saveFile, updateFieldPosition } = useContext(
    CharacterSheetContext
  )!;

  const [, drop] = useDrop(
    () => ({
      accept: ["field", "menuItem"],
      drop: (item: Field | FieldWithoutId, monitor) => {
        const delta = monitor.getDifferenceFromInitialOffset();
        const containerRect = document
          .querySelector(".containerDrop")
          ?.getBoundingClientRect();
        const clientOffset = monitor.getClientOffset();
        let position;

        if (!delta || !containerRect || !clientOffset) return;

        position = {
          x: Math.max(clientOffset.x - containerRect.left, 0),
          y: Math.max(clientOffset.y - containerRect.top, 0),
        };

        if (monitor.getItemType() === "menuItem") {
          addField(item, position, item.size);
        } else {
          updateFieldPosition((item as Field).id, position);
        }
      },
    }),
    [addField, updateFieldPosition]
  );

  useEffect(() => {
    const handleSave = async (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        await saveFile({ name: "hola", type: FileSystemEnum.Sheet });
      }
    };

    window.addEventListener("keydown", handleSave);
    return () => window.removeEventListener("keydown", handleSave);
  }, [saveFile]);

  const handleSaveClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    await saveFile({ name: "hola", type: FileSystemEnum.Sheet });
  };

  return (
    <>
      <button onClick={handleSaveClick}>Guardar</button>

      <div ref={drop} className="containerDrop">
        {fields.map((field) => (
          <DraggableField key={field.id} {...field} />
        ))}
      </div>
    </>
  );
};

export default FieldContainer;
