import React, { createContext, useContext, type ReactNode } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../hooks/customHooks";
import { setCurrentPath as setPath } from "../redux/slice/routeSlice";
import type { RootState } from "../redux/store";

interface PathContextProps {
  currentPath: PathProps[];
  setCurrentPath: (path: PathProps[]) => void;
  addToPath: (path: PathProps) => void;
  removeLastFromPath: () => void;
}

const PathContext = createContext<PathContextProps>({
  currentPath: [],
  setCurrentPath: () => {},
  addToPath: () => {},
  removeLastFromPath: () => {},
});

interface PathProviderProps {
  children: ReactNode;
}

export interface PathProps {
  name: string;
  route: string;
}

export const PathProvider: React.FC<PathProviderProps> = ({ children }) => {
  const currentPath = useAppSelector(
    (state: RootState) => state.route.currentPath
  );

  const dispatch = useDispatch();

  const setCurrentPath = (path: PathProps[]) => dispatch(setPath(path));
  const addToPath = ({ name, route }: PathProps) => {
    dispatch(setPath([...currentPath, { name, route }]));
  };
  const removeLastFromPath = () => {
    if (currentPath.length > 0) {
      const newPath = currentPath.slice(0, -1);
      dispatch(setPath(newPath));
    }
  };

  return (
    <PathContext.Provider
      value={{ currentPath, setCurrentPath, addToPath, removeLastFromPath }}
    >
      {children}
    </PathContext.Provider>
  );
};

export const useCurrentPath = () => {
  return useContext(PathContext);
};
