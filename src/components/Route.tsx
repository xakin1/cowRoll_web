import React, { Suspense, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import {
  selectFile,
  setDirectorySystem,
} from "../redux/slice/DirectorySystemSlice";
import { persistor } from "../redux/store";
import { getFiles } from "../services/codeApi";

import type { ToastOptions } from "react-toastify";
import { PathProvider } from "./PathProvider";
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
        <PathProvider>
          <Suspense fallback={<Loading />}>
            <PathSelectable />
            <Routes>
              <Route path="/app" element={<MainPage />} />
              <Route path="/app/rol" element={<Rol />} />
              <Route path="/app/rol/play" element={<Chat />} />
              <Route path="/app/rol/sheet" element={<HomeSheet />} />
              <Route path="/app/rol/sheet/:sheetId" element={<Sheet />} />
              <Route path="/app/rol/editor" element={<WorkSpace />} />
              <Route path="/app/*" element={<AppRouteHandler />} />
            </Routes>
          </Suspense>
        </PathProvider>
      </Router>
    </PersistGate>
  );
};

const AppRouteHandler = () => {
  const location = useLocation();
  return <Navigate to={location.pathname.replace("/app", "")} />;
};

export default AppRoute;
