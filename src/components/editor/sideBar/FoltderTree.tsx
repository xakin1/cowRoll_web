import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { useDispatch } from "react-redux";
import { addCode } from "../../../redux/slice/codeSlide";
import type { DirectoryProps } from "../../../utils/types/ApiTypes";

interface FolderTreeProps {
  files: DirectoryProps[];
}

interface DirectoryNode {
  type: "directory";
  children: { [key: string]: DirectoryTree };
}

interface FileNode {
  type: "file";
  content: string;
}

type DirectoryTree = DirectoryNode | FileNode;

function FolderTree({ files }: FolderTreeProps) {
  const dispatch = useDispatch();

  function handleItemClick(content: string) {
    console.log(content);
    dispatch(addCode(content));
  }

  // function buildFolderTree(files: Files[]): JSX.Element[] {
  //   const root: DirectoryNode = { type: "directory", children: {} };

  //   files.forEach(({ fileName, code }) => {
  //     const parts = fileName.split("/");
  //     let current: DirectoryTree = root;
  //     parts.forEach((part, index) => {
  //       if (index === parts.length - 1) {
  //         // Comprobamos que sea un nodo raíz
  //         if (parts.length === 1) {
  //           root.children[part] = { type: "file", content: code };
  //         } else {
  //           //Comprobamos  que es un fichero que tiene un padre (una carpeta)
  //           (current as DirectoryNode).children[part] = {
  //             type: "file",
  //             content: code,
  //           };
  //         }
  //       } else {
  //         // Es un directorio
  //         if (!(current as DirectoryNode).children[part]) {
  //           (current as DirectoryNode).children[part] = {
  //             type: "directory",
  //             children: {},
  //           };
  //         }
  //         current = (current as DirectoryNode).children[part];
  //       }
  //     });
  //   });

  //   //Construimos el arbol
  //   return Object.entries(root.children).map(([key, childNode]) =>
  //     buildTreeItems(childNode, key)
  //   );
  // }

  // function buildTreeItems(current: DirectoryTree, path = ""): JSX.Element {
  //   const label =
  //     path.split("/").pop() ||
  //     (current.type === "file" ? current.content : "Root");

  //   if (current.type === "file") {
  //     return (
  //       <TreeItem
  //         key={path}
  //         itemId={path}
  //         label={label}
  //         onClick={() => handleItemClick(current.content)}
  //       />
  //     );
  //   } else {
  //     return (
  //       <TreeItem key={path} itemId={path} label={label}>
  //         {Object.entries((current as DirectoryNode).children).map(
  //           ([key, childNode]) => {
  //             const newPath = `${path}/${key}`;
  //             return buildTreeItems(childNode, newPath);
  //           }
  //         )}
  //       </TreeItem>
  //     );
  //   }
  // }

  return <SimpleTreeView></SimpleTreeView>;
}

export default FolderTree;
