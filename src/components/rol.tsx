// src/components/LoadData.jsx
import { useEffect, useState } from "react";
import type { Id } from "../utils/types/ApiTypes";

const LoadData = () => {
  const [data, setData] = useState(null);
  const [id, setId] = useState<Id>("");

  useEffect(() => {
    // Obtener los parámetros de consulta de la URL
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("id");
    console.log(id);
    setId(id || "");

    if (id) {
      async function fetchData() {
        const response = await fetch(`/api/data/${id}`);
        const result = await response.json();
        setData(result);
      }
      fetchData();
    }
  }, []);

  return (
    <div>
      <h1>Rol ID: {id}</h1>
    </div>
  );
};

export default LoadData;
