import React, { useContext } from "react";
import { useDrop } from "react-dnd";

import { CharacterSheetContext } from "./CharacterSheetContext";
import DraggableField from "./DraggableField";
import "./styles.css";
import type { Field, FieldWithoutId } from "./types";

const FieldContainer: React.FC = () => {
  const { fields, addField, updateFieldPosition } = useContext(
    CharacterSheetContext
  )!;

  const [, drop] = useDrop(
    () => ({
      accept: ["field", "menuItem"],
      drop: (item: Field | FieldWithoutId, monitor) => {
        //diferencia entre la posición actual del cursor del ratón y la posición inicial del cursor cuando comenzó a arrastrarse el elemento.
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
          addField({ ...item, position }, position);
        } else {
          updateFieldPosition((item as Field).id, position);
        }
      },
    }),
    [addField, updateFieldPosition]
  );

  return (
    <div ref={drop} className="containerDrop">
      {fields.map((field) => (
        <DraggableField key={field.id} {...field} />
      ))}
    </div>
  );
};

export default FieldContainer;
