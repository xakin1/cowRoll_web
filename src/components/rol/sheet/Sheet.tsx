import { SheetProvider } from "./SheetContext";
import { SheetWorkSpace } from "./sheetWorkSpace/SheetWorkSpace";
import "./styles.css";

function Sheet() {
  return (
    <SheetProvider>
      <SheetWorkSpace />
    </SheetProvider>
  );
}

export default Sheet;
