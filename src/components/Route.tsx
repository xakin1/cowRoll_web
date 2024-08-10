import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import {
  selectFile,
  setDirectorySystem,
} from "../redux/slice/DirectorySystemSlice";
import { persistor } from "../redux/store";
import { getFiles } from "../services/codeApi";

import type { ToastOptions } from "react-toastify";
import NotFound from "./NotFound"; // Importa el componente NotFound
import PrivateRoute from "./PrivateRoute"; // Importa el componente PrivateRoute
import PathSelectable from "./breadcrumbs/Breadcrumbs";
import Loading from "./loading/Loading";
import { MainPage } from "./mainPage";
import WorkSpace from "./rol/editor/terminal/WorkSpace";
import Chat from "./rol/play/Chat";
import Rol from "./rol/rol";
import { HomeSheet } from "./rol/sheet/HomeSheet";
import Sheet from "./rol/sheet/Sheet";

export const toastStyle: ToastOptions<unknown> = {
  position: "bottom-right",
};

const AppRoute: React.FC = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const files = await getFiles();
        if (files && "message" in files) {
          dispatch(setDirectorySystem(files.message));
          dispatch(selectFile(undefined));
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  if (loading) {
    return <Loading />;
  }

  return (
    <PersistGate loading={null} persistor={persistor}>
      <Router>
        <Routes>
          <Route
            path="/app/*"
            element={
              <PrivateRoute>
                <AppLayout />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </PersistGate>
  );
};

const AppLayout: React.FC = () => {
  return (
    <>
      <PathSelectable />
      <Routes>
        <Route path="" element={<MainPage />} />
        <Route path="rol" element={<Rol />} />
        <Route path="rol/play" element={<Chat />} />
        <Route path="rol/sheet" element={<HomeSheet />} />
        <Route path="rol/sheet/:sheetId" element={<Sheet />} />
        <Route path="rol/editor" element={<WorkSpace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default AppRoute;
