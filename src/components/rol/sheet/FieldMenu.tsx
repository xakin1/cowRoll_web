import React from "react";
import { useDrag } from "react-dnd";
import { v4 as uuidv4 } from "uuid";
import RenderField, { fields } from "./RenderFields";
import "./styles.css";
import type { MenuItemProps } from "./types";

const FieldMenu: React.FC = () => {
  return (
    <div className="menu">
      {fields.map((field) => (
        <MenuItem key={field.id} field={field} />
      ))}
    </div>
  );
};

const MenuItem: React.FC<MenuItemProps> = ({ field }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "menuItem",
    item: field,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="menuItem"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <RenderField
        menu={true}
        type={field.type}
        label={field.label}
        id={uuidv4()}
      />
    </div>
  );
};

export default FieldMenu;
