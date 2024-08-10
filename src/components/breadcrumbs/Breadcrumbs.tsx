import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./breadcrumbs.css";

const Breadcrumbs: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackNavigation = () => {
    navigate(-1); // Navegar hacia atrás en el historial
  };

  // Verifica si la ruta actual es '/app'
  const isRootPath = location.pathname === "/app";

  return (
    !isRootPath && (
      <div className="breadcrumb">
        <span
          className="breadcrumb__back-arrow"
          onClick={handleBackNavigation}
          style={{ cursor: "pointer" }}
        >
          ← Back
        </span>
      </div>
    )
  );
};

export default Breadcrumbs;
