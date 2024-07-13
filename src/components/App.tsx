import { Provider } from "react-redux";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import { ToastContainer, type ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "../redux/store";
import { MainPage } from "./mainPage";
import WorkSpace from "./rol/editor/terminal/WorkSpace";
import Rol from "./rol/rol";
import Sheet from "./rol/sheet/Sheet";
export const toastStyle: ToastOptions<unknown> = {
  position: "bottom-right",
};

const AppRol = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Routes>
            <Route path="/app" element={<MainPage />} />
            <Route path="/app/rol" element={<Rol />} />
            <Route path="/app/rol/sheet" element={<Sheet />} />
            <Route path="/app/rol/editor" element={<WorkSpace />} />
            <Route path="/app/*" element={<AppRouteHandler />} />{" "}
          </Routes>
        </Router>
      </PersistGate>

      <ToastContainer />
    </Provider>
  );
};

const AppRouteHandler = () => {
  const location = useLocation();
  return <Navigate to={location.pathname.replace("/app", "")} />;
};

export default AppRol;
