import React from "react";

interface DividerProps {
  width?: string;
  color?: string;
  thickness?: string;
  margin?: string;
}

export const Divider: React.FC<DividerProps> = ({
  width = "100%",
  color = "black",
  thickness = "1px",
  margin = "1rem 0",
}) => {
  return (
    <div
      style={{
        width: width,
        height: thickness,
        backgroundColor: color,
        margin: margin,
      }}
    ></div>
  );
};
