import * as Blockly from "blockly";

export const darkTheme = Blockly.Theme.defineTheme("darkTheme", {
  name: "darkTheme",
  base: Blockly.Themes.Classic,
  blockStyles: {
    logic_blocks: {
      colourPrimary: "#4a148c",
      colourSecondary: "#AD68B7",
      colourTertiary: "#EFEFEF",
    },
    math_blocks: {
      colourPrimary: "#1A237E",
      colourSecondary: "#5C6BC0",
      colourTertiary: "#D1D9FF",
    },
    loop_blocks: {
      colourPrimary: "#004D40",
      colourSecondary: "#26A69A",
      colourTertiary: "#B2DFDB",
    },
    text_blocks: {
      colourPrimary: "#0D47A1",
      colourSecondary: "#42A5F5",
      colourTertiary: "#90CAF9",
    },
    list_blocks: {
      colourPrimary: "#BF360C",
      colourSecondary: "#FF7043",
      colourTertiary: "#FFCCBC",
    },
    colour_blocks: {
      colourPrimary: "#880E4F",
      colourSecondary: "#EC407A",
      colourTertiary: "#F8BBD0",
    },
    variable_blocks: {
      colourPrimary: "#795548",
      colourSecondary: "#A1887F",
      colourTertiary: "#D7CCC8",
    },
    variable_dynamic_blocks: {
      colourPrimary: "#283593",
      colourSecondary: "#5C6BC0",
      colourTertiary: "#C5CAE9",
    },
    procedure_blocks: {
      colourPrimary: "#006064",
      colourSecondary: "#26C6DA",
      colourTertiary: "#B2EBF2",
    },
    hat_blocks: {
      colourPrimary: "#F57F17",
      colourSecondary: "#FFEE58",
      colourTertiary: "#FFF59D",
      hat: "cap",
    },
  },
  categoryStyles: {
    logic_category: {
      colour: "#4a148c",
    },
    loop_category: {
      colour: "#004D40",
    },
    math_category: {
      colour: "#1A237E",
    },
    text_category: {
      colour: "#0D47A1",
    },
    list_category: {
      colour: "#BF360C",
    },
    colour_category: {
      colour: "#880E4F",
    },
    variable_category: {
      colour: "#795548",
    },
    variable_dynamic_category: {
      colour: "#283593",
    },
    procedure_category: {
      colour: "#006064",
    },
  },
  componentStyles: {
    workspaceBackgroundColour: "#333",
    toolboxBackgroundColour: "#424242",
    toolboxForegroundColour: "#fff",
    flyoutBackgroundColour: "#424242",
    flyoutForegroundColour: "#ccc",
    flyoutOpacity: 1,
    scrollbarColour: "#424242",
    scrollbarOpacity: 0.7,
    insertionMarkerColour: "#fff",
    insertionMarkerOpacity: 0.3,
    markerColour: "#fff",
    cursorColour: "#d0d0d0",
  },

  startHats: true,
});
