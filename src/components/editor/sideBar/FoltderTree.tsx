import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { useDispatch } from "react-redux";
import { selectFile } from "../../../redux/slice/fileSlide";
import type { DirectoryProps, FileProps } from "../../../utils/types/ApiTypes";

function FolderTree(directoySystem: DirectoryProps) {
  const dispatch = useDispatch();

  function handleItemClick(content: FileProps) {
    dispatch(selectFile(content));
  }

  function buildTreeItems(current: DirectoryProps | FileProps): JSX.Element {
    if (current.type === "File") {
      return (
        <TreeItem
          key={current.id}
          itemId={current.name + " " + current.directoryId}
          label={current.name}
          onClick={() => handleItemClick(current)}
        />
      );
    } else {
      if (current.type === "Directory") {
        return (
          <TreeItem
            key={current.id}
            itemId={current.name + " " + current.parentId}
            label={current.name}
          >
            {current.children &&
              current.children.map((child) => {
                return buildTreeItems(child);
              })}
          </TreeItem>
        );
      } else {
        return <></>;
      }
    }
  }

  return <SimpleTreeView>{buildTreeItems(directoySystem)}</SimpleTreeView>;
}

export default FolderTree;
