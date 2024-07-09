// src/components/CharacterSheet.tsx
import React from "react";
import { CharacterSheetProvider } from "./CharacterSheetContext";
import FieldContainer from "./FieldContainer";
import FieldMenu from "./FieldMenu";
import "./styles.css";

const CharacterSheet: React.FC = () => {
  return (
    <CharacterSheetProvider>
      <div className="container-parent">
        <FieldMenu />
        <div className="sheetContainer">
          <h2>Character Sheet</h2>
          <FieldContainer />
        </div>
      </div>
    </CharacterSheetProvider>
  );
};

export default CharacterSheet;
