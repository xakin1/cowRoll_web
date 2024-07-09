// src/components/LoadData.jsx
import { useEffect, useState } from "react";
import type { Id } from "../../utils/types/ApiTypes";
import "./rol.css";

const LoadData = () => {
  const [data, setData] = useState(null);
  const [id, setId] = useState<Id>("");

  useEffect(() => {
    // Obtener los parámetros de consulta de la URL
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("id");
    setId(id || "");

    // if (id) {
    //   async function fetchData() {
    //     const response = await fetch(`/api/data/${id}`);
    //     const result = await response.json();
    //     setData(result);
    //   }
    //   fetchData();
    // }
  }, []);

  return (
    <main className="container sibling-fade">
      <a
        href={`/app/rol/sheet?id=${id}`}
        id="sheets"
        className="container__options"
      >
        <svg fill="currentColor" viewBox="0 0 512.001 512.001">
          <g>
            <g>
              <path
                d="M508.788,174.522c-3.286-5.89-8.671-10.149-15.16-11.991l-56.983-16.167c-4.474-1.267-9.127,1.328-10.397,5.801
			c-1.268,4.473,1.328,9.127,5.801,10.397l56.983,16.167c4.466,1.267,7.068,5.931,5.8,10.396l-68.876,242.749
			c-0.614,2.164-2.034,3.958-3.997,5.053s-4.235,1.359-6.312,0.772l-67.876-20.056h34.388c13.926,0,25.254-11.328,25.254-25.254
			V82.413c0-13.926-11.328-25.254-25.254-25.254H129.831c-13.926,0-25.254,11.328-25.254,25.254v309.978
			c0,13.926,11.328,25.254,25.254,25.254h37.195l-70.595,20.03c-2.163,0.614-4.436,0.35-6.4-0.747
			c-1.963-1.095-3.383-2.89-3.997-5.053l-68.876-242.75c-1.267-4.466,1.335-9.128,5.801-10.396l58.857-16.699
			c4.473-1.269,7.069-5.924,5.801-10.397c-1.269-4.473-5.925-7.068-10.396-5.801l-58.858,16.699
			C4.967,166.333-2.839,180.324,0.962,193.72L69.836,436.47c1.842,6.49,6.1,11.874,11.991,15.16
			c3.814,2.128,8.017,3.212,12.268,3.212c2.314,0,4.643-0.322,6.931-0.971l127.681-36.226h59.654l122.606,36.226
			c2.289,0.65,4.616,0.971,6.931,0.971c4.25,0,8.454-1.084,12.267-3.212c5.891-3.286,10.149-8.67,11.991-15.16L511.03,193.72
			C512.872,187.231,512.076,180.413,508.788,174.522z M289.423,400.809H129.831c-4.642,0-8.418-3.777-8.418-8.418V82.413
			c0-4.642,3.776-8.418,8.418-8.418h252.331c4.641,0,8.418,3.776,8.418,8.418v309.978c0,4.642-3.777,8.418-8.418,8.418h-92.643
			C289.487,400.809,289.455,400.809,289.423,400.809z"
              />
            </g>
          </g>
        </svg>
        <p className="container__options__text">Fichas</p>
      </a>
      <a
        id="scripts"
        className="container__options"
        href={`/app/rol/editor?id=${id}`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
          <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
        </svg>
        <p className="container__options__text"> Comportamientos</p>
      </a>
    </main>
  );
};

export default LoadData;
