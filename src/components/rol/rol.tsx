// src/components/LoadData.jsx
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import i18n from "../../i18n/i18n";
import type { RootState } from "../../redux/store";
import "../../styles/global.css";
import { useCurrentPath } from "../PathProvider";
import "./rol.css";
const LoadData = () => {
  const id = useSelector((state: RootState) => state.route.value);
  const { addToPath } = useCurrentPath();
  const handleNavigation = (path: string) => {
    navigate(`${path}?id=${id}`);
  };
  const navigate = useNavigate();

  return (
    <main className="container_rol">
      <section className="section_rol">
        <h3>Edit</h3>
        <div className="container_rol__edition sibling-fade">
          <a
            onClick={() => {
              const route = "/app/rol/sheet";
              addToPath({
                name: i18n.t("Rol.General.sheet"),
                route: route,
              });

              handleNavigation(route);
            }}
            id="sheets"
            className="container_rol__edition__options"
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
            <p className="container_rol__edition__options__text">
              {i18n.t("Rol.General.sheet")}
            </p>
          </a>
          <a
            id="scripts"
            className="container_rol__edition__options"
            onClick={() => {
              const route = "/app/rol/editor";
              addToPath({ name: i18n.t("General.codes"), route: route });

              handleNavigation(route);
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
              <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
            </svg>
            <p className="container_rol__edition__options__text">
              {i18n.t("Rol.General.scripts")}
            </p>
          </a>
        </div>
      </section>
      <section className="section_rol">
        <h3>{i18n.t("Rol.General.play")}</h3>
        <div
          id="play"
          className="container_rol__edition__options"
          onClick={() => {
            const route = "/app/rol/play";
            addToPath({ name: i18n.t("Rol.General.play"), route: route });

            handleNavigation(route);
          }}
        >
          <PlayArrowIcon />
          <p className="container_rol__edition__options__text">
            {i18n.t("Rol.General.play")}
          </p>
        </div>
      </section>
    </main>
  );
};

export default LoadData;
