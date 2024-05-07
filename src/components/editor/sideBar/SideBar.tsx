import { useEffect, useState } from "react";

import { getFiles } from "../../../services/codeApi";
import type { DirectoryProps } from "../../../utils/types/ApiTypes";
import FolderTree from "./FoltderTree";
import "./sideBar.css";

function Sidebar() {
  const [directorySystem, setDirectorySystem] = useState<DirectoryProps>({
    name: "Root",
    type: "Directory",
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      const docs = await getFiles(1);
      setDirectorySystem(
        docs?.message || {
          name: "Root",
          type: "Directory",
        }
      );
    };
    fetchDocuments();
  }, []);

  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggles the isOpen state between true and false
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
          className="icon icon-tabler icons-tabler-outline icon-tabler-code"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M7 8l-4 4l4 4" />
          <path d="M17 8l4 4l-4 4" />
          <path d="M14 4l-4 16" />
        </svg>
      </div>
      <FolderTree {...directorySystem}></FolderTree>
    </nav>
  );
}

export default Sidebar;
