import "blockly/core";

declare module "blockly/core" {
  interface Block {
    initSvg(): void;
  }
}
