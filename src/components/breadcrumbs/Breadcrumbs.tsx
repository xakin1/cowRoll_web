import React from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentPath } from "../PathProvider";
import "./breadcrumbs.css";
const Breadcrumbs: React.FC = () => {
  const { currentPath, setCurrentPath } = useCurrentPath();
  const navigate = useNavigate();

  const handleNavigation = (index: number) => {
    if (currentPath[index].route) {
      navigate(currentPath[index].route);
      setCurrentPath(currentPath.slice(0, index + 1));
    }
  };

  const maxPartsToShow = 4;
  const partsToShow =
    currentPath.length > maxPartsToShow
      ? ["...", ...currentPath.slice(-maxPartsToShow)]
      : currentPath;

  return (
    <div className="breadcrumb">
      <span
        className="breadcrumb__path"
        onClick={() => {
          setCurrentPath([]);
          navigate("/app");
        }}
      >
        Root
      </span>
      {partsToShow.map((part, index) => (
        <span key={index}>
          {" > "}
          {typeof part === "string" ? (
            <span>{part}</span>
          ) : (
            <span
              className="breadcrumb__path"
              onClick={() =>
                handleNavigation(
                  index - (partsToShow.length > maxPartsToShow ? 1 : 0)
                )
              }
              style={{ cursor: "pointer" }}
            >
              {part.name}
            </span>
          )}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumbs;
