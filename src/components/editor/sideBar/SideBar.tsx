import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { addFile } from "../../../redux/slice/fileSlide";
import { getFiles } from "../../../services/codeApi";
import FolderTree from "./FoltderTree";
import "./sideBar.css";

function Sidebar() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchDocuments = async () => {
      const docs = await getFiles();
      //TODO: tengo que coger el estado inicial del redux mejor
      dispatch(
        addFile(
          docs?.message || {
            name: "Root",
            type: "Directory",
            children: [],
            id: -1,
          }
        )
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
      <FolderTree></FolderTree>
    </nav>
  );
}

export default Sidebar;
