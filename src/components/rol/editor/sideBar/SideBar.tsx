import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { setDirectorySystem } from "../../../../redux/slice/DirectorySystemSlice";
import type { RootState } from "../../../../redux/store";
import { getFiles } from "../../../../services/codeApi";
import type { Id } from "../../../../utils/types/ApiTypes";
import FolderTree from "./directorySystem/FoltderTree";
import "./sideBar.css";

export interface SideBarProps {
  directoryId?: Id;
}
const Sidebar: React.FC<SideBarProps> = ({ directoryId }) => {
  const dispatch = useDispatch();
  const directorySystem = useSelector(
    (state: RootState) => state.directorySystem.directorySystem
  );
  useEffect(() => {
    const fetchDocuments = async () => {
      if (directoryId || directorySystem?.id === "") {
        // Chequear si ya tienes los datos en el estado
        const docs = await getFiles();
        dispatch(setDirectorySystem(docs.message));
      }
    };
    fetchDocuments();
  }, []);

  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const state_nav = isOpen ? "open" : "closed";
  return (
    <nav className={`sidebar ${state_nav}`} data-testid="sidebar-nav">
      <div className={`svg-container ${state_nav}`}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          stroke="currentColor"
          onClick={toggleSidebar}
          className="icon-sidebar icon-tabler icons-tabler-outline icon-tabler-code"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M7 8l-4 4l4 4" />
          <path d="M17 8l4 4l-4 4" />
          <path d="M14 4l-4 16" />
        </svg>
      </div>
      <FolderTree directoryId={directoryId}></FolderTree>
    </nav>
  );
};

export default Sidebar;
