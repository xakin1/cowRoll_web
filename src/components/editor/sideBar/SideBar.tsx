import { useEffect, useState } from "react";
import { getDocuments } from "../../../services/codeApi";
import type { Files } from "../../../utils/types/types";
import FolderTree from "./FoltderTree";
import "./sideBar.css";

function Sidebar() {
  const [items, setItems] = useState<Files[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      const docs = await getDocuments(1);
      setItems(docs);
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
      <FolderTree files={items}></FolderTree>
    </nav>
  );
}

export default Sidebar;
