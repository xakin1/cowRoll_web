import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CharacterSheet from "./CharacterSheet";

function Sheet() {
  return (
    <DndProvider backend={HTML5Backend}>
      <CharacterSheet />
    </DndProvider>
  );
}

export default Sheet;