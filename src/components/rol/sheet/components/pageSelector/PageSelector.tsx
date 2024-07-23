import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { IconButton } from "@mui/material";
import React from "react";
import "./pageSelector.css";
interface PageSelectorProps {
  previousPage: () => void;
  nextPage: () => void;
  currentSheetIndex: number;
  totalSheets: number;
  goToPage: (page: number) => void;
}

export const PageSelector: React.FC<PageSelectorProps> = ({
  previousPage,
  nextPage,
  currentSheetIndex,
  totalSheets,
  goToPage,
}) => {
  const handlePageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const page = parseInt(event.target.value, 10);
    if (!isNaN(page) && page > 0 && page <= totalSheets) {
      goToPage(page - 1);
    }
  };

  return (
    <div className="page-selector">
      <IconButton onClick={previousPage} disabled={currentSheetIndex === 0}>
        <ArrowBackIosIcon
          className={`page-selector__arrows ${currentSheetIndex === 0 ? "disabled" : ""}`}
        />
      </IconButton>

      <span>
        <input
          className="page-selector__input"
          value={currentSheetIndex + 1}
          onChange={handlePageChange}
          max={totalSheets}
          min={0}
          type="number"
        ></input>
        / {totalSheets}
      </span>
      <IconButton
        onClick={nextPage}
        disabled={currentSheetIndex === totalSheets - 1}
      >
        <ArrowForwardIosIcon
          className={`page-selector__arrows ${currentSheetIndex === totalSheets - 1 ? "disabled" : ""}`}
        />
      </IconButton>
    </div>
  );
};
