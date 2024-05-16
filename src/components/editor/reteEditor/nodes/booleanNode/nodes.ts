import { ClassicPreset } from "rete";
import { getI18N } from "../../../../../i18n";
import { getLang } from "../../../../../i18n/utils";
import BooleanControl from "../customControls/BooleanInputControl";

const currentLocale = getLang();
const i18n = getI18N({ currentLocale });

const socket = new ClassicPreset.Socket("Boolean");

export class BooleanNode extends ClassicPreset.Node<
  {},
  { value: ClassicPreset.Socket },
  { value: BooleanControl }
> {
  height = 120;
  width = 180;

  constructor(initial: boolean, change?: () => void) {
    super(i18n.t("Operations.boolean"));
    this.addControl(
      "value",
      new BooleanControl("boolean", { initial, change })
    );
    this.addOutput("value", new ClassicPreset.Output(socket, "Boolean"));
  }

  data(): { value: boolean } {
    return {
      value: this.controls.value.value,
    };
  }
}

export class OrNode extends ClassicPreset.Node<
  { left: ClassicPreset.Socket; right: ClassicPreset.Socket },
  { value: ClassicPreset.Socket },
  { value: BooleanControl }
> {
  height = 190;
  width = 180;

  constructor(
    change?: () => void,
    private update?: (control: BooleanControl) => void
  ) {
    super(i18n.t("Operations.or"));
    const left = new ClassicPreset.Input(socket, "Left");
    const right = new ClassicPreset.Input(socket, "Right");

    left.addControl(new BooleanControl("boolean", { initial: false, change }));
    right.addControl(new BooleanControl("boolean", { initial: false, change }));

    this.addInput("left", left);
    this.addInput("right", right);
    this.addControl(
      "value",
      new BooleanControl("boolean", {
        readonly: true,
      })
    );
    this.addOutput("value", new ClassicPreset.Output(socket, "Boolean"));
  }

  data(inputs: { left?: boolean[]; right?: boolean[] }): { value: boolean } {
    const leftControl = this.inputs.left?.control as BooleanControl;
    const rightControl = this.inputs.right?.control as BooleanControl;

    const { left, right } = inputs;
    const value =
      (left ? left[0] : leftControl.value) ||
      (right ? right[0] : rightControl.value);

    this.controls.value.setValue(value);

    if (this.update) this.update(this.controls.value);

    return { value };
  }
}
export class AndNode extends ClassicPreset.Node<
  { left: ClassicPreset.Socket; right: ClassicPreset.Socket },
  { value: ClassicPreset.Socket },
  { value: BooleanControl }
> {
  height = 190;
  width = 180;

  constructor(
    change?: () => void,
    private update?: (control: BooleanControl) => void
  ) {
    super(i18n.t("Operations.and"));
    const left = new ClassicPreset.Input(socket, "Left");
    const right = new ClassicPreset.Input(socket, "Right");

    left.addControl(new BooleanControl("boolean", { initial: false, change }));
    right.addControl(new BooleanControl("boolean", { initial: false, change }));

    this.addInput("left", left);
    this.addInput("right", right);
    this.addControl(
      "value",
      new BooleanControl("boolean", {
        readonly: true,
      })
    );
    this.addOutput("value", new ClassicPreset.Output(socket, "Boolean"));
  }

  data(inputs: { left?: boolean[]; right?: boolean[] }): { value: boolean } {
    const leftControl = this.inputs.left?.control as BooleanControl;
    const rightControl = this.inputs.right?.control as BooleanControl;

    const { left, right } = inputs;
    const value =
      (left ? left[0] : leftControl.value) &&
      (right ? right[0] : rightControl.value);

    this.controls.value.setValue(value);

    if (this.update) this.update(this.controls.value);

    return { value };
  }
}
