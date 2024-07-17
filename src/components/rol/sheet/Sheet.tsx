import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import WrappedCharacterSheet from "./CharacterSheet";
import "./styles.css";

function Sheet() {
  return (
    <DndProvider backend={HTML5Backend}>
      <WrappedCharacterSheet />
    </DndProvider>
  );
}

export default Sheet;
