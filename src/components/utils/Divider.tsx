interface DividerProps {
  width?: string;
  color?: string;
}

export const Divider: React.FC<DividerProps> = ({
  width = "10px",
  color = "black",
}) => {
  return (
    <div style={{ height: 0, maxHeight: 0, width: width, color: color }}></div>
  );
};
