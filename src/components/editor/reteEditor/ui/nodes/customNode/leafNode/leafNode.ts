import { ClassicPreset } from "rete";
import { getI18N } from "../../../../../../../i18n";
import { getLang } from "../../../../../../../i18n/utils";
import BooleanControl from "../../customControls/BooleanInputControl";

const currentLocale = getLang();
const i18n = getI18N({ currentLocale });

const socket = new ClassicPreset.Socket("socket");

const height = 150;
const width = 180;

export class BooleanNode extends ClassicPreset.Node<
  {},
  { value: ClassicPreset.Socket },
  { value: BooleanControl }
> {
  height = height;
  width = width;

  constructor(initial: boolean, change?: () => void) {
    super(i18n.t("Operations.boolean"));

    this.addControl(
      "value",
      new BooleanControl("boolean", { initial, change })
    );
    this.addOutput(
      "value",
      new ClassicPreset.Output(socket, i18n.t("Operations.boolean"))
    );
  }

  data(): { value: boolean } {
    return {
      value: this.controls.value.value,
    };
  }
}

export class NumberNode extends ClassicPreset.Node<
  {},
  { value: ClassicPreset.Socket },
  { value: ClassicPreset.InputControl<"number"> }
> {
  height = height;
  width = width;

  constructor(initial: number, change?: () => void) {
    super(i18n.t("Operations.number"));

    this.addControl(
      "value",
      new ClassicPreset.InputControl("number", { initial, change })
    );
    this.addOutput(
      "value",
      new ClassicPreset.Output(socket, i18n.t("Operations.number"))
    );
  }

  data(): { value: number } {
    return {
      value: this.controls.value.value || 0,
    };
  }
}

export class TextNode extends ClassicPreset.Node<
  {},
  { value: ClassicPreset.Socket },
  { value: ClassicPreset.InputControl<"text"> }
> {
  height = height;
  width = width;

  constructor(initial: string, change?: () => void) {
    super(i18n.t("Operations.text"));

    this.addControl(
      "value",
      new ClassicPreset.InputControl("text", { initial, change })
    );
    this.addOutput(
      "value",
      new ClassicPreset.Output(socket, i18n.t("Operations.text"))
    );
  }

  data(): { value: string } {
    return {
      value: this.controls.value.value || "",
    };
  }
}
