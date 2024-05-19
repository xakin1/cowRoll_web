import { ClassicPreset } from "rete";
import { DataflowEngine } from "rete-engine";
import { getI18N } from "../../../../../../../i18n";
import { getLang } from "../../../../../../../i18n/utils";
import type { Schemes } from "../../../utils/nodeTypes";
import BooleanControl from "../../customControls/BooleanInputControl";
import { TextControl } from "../../customControls/TextInputControl";
import { VarControl } from "../../customControls/VarInputControl";
import { ActionSocket } from "../../customSockets/sockets";

const socket = new ClassicPreset.Socket("socket");

const currentLocale = getLang();
const i18n = getI18N({ currentLocale });

export class IfNode extends ClassicPreset.Node<
  { exec: ClassicPreset.Socket; condition: ClassicPreset.Socket },
  { consequent: ClassicPreset.Socket; alternate: ClassicPreset.Socket },
  { value: BooleanControl }
> {
  width = 180;
  height = 220;

  constructor(
    initial: boolean,
    private dataflow: DataflowEngine<Schemes>,
    private update?: (control: BooleanControl) => void
  ) {
    super(i18n.t("Operations.if"));
    this.addInput(
      "exec",
      new ClassicPreset.Input(new ActionSocket(), i18n.t("Operations.dataFlow"))
    );
    this.addInput(
      "condition",
      new ClassicPreset.Input(socket, i18n.t("Operations.condition"))
    );
    this.addControl(
      "value",
      new BooleanControl("boolean", { initial, readonly: true })
    );
    this.addOutput(
      "consequent",
      new ClassicPreset.Output(new ActionSocket(), i18n.t("Operations.true"))
    );
    this.addOutput(
      "alternate",
      new ClassicPreset.Output(new ActionSocket(), i18n.t("Operations.false"))
    );
  }

  async execute(
    _: never,
    forward: (output: "consequent" | "alternate") => void
  ) {
    const value = this.controls.value.value;

    if (value) {
      forward("consequent");
    } else {
      forward("alternate");
    }
  }

  data(inputs: { condition?: boolean[] }): { value: boolean } {
    const leftControl = this.inputs.condition?.control as BooleanControl;

    const { condition } = inputs;
    const value = condition ? condition[0] : leftControl.value;

    this.controls.value.setValue(value);

    if (this.update) this.update(this.controls.value);

    return { value };
  }
}

export class VariableNode extends ClassicPreset.Node<
  { exec: ClassicPreset.Socket },
  { exec: ClassicPreset.Socket; value: ClassicPreset.Socket },
  {
    name: TextControl;
    value: VarControl;
  }
> {
  width = 180;
  height = 240;
  value?: string;

  constructor(initial: string | boolean, change?: () => void) {
    super(i18n.t("Operations.var"));
    this.addInput(
      "exec",
      new ClassicPreset.Input(new ActionSocket(), i18n.t("Operations.dataFlow"))
    );

    this.addOutput(
      "exec",
      new ClassicPreset.Output(
        new ActionSocket(),
        i18n.t("Operations.dataFlow")
      )
    );

    this.addControl(
      "name",
      new TextControl("text", {
        inputName: i18n.t("Operations.name"),
        initial: "",
      })
    );

    this.addControl(
      "value",
      new VarControl("value", {
        inputName: i18n.t("Operations.value"),
        initial,
        change,
      })
    );

    this.addOutput(
      "value",
      new ClassicPreset.Output(socket, i18n.t("Operations.value"))
    );
  }

  execute(_: never, forward: (output: "exec") => void) {
    forward("exec");
  }

  data() {
    return {
      exec: this.controls.value.value,
      value: this.controls.value.value,
    };
  }
}
