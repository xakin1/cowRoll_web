import { ClassicPreset } from "rete";
import { getI18N } from "../../../../../../../i18n";
import { getLang } from "../../../../../../../i18n/utils";
import BooleanControl from "../../customControls/BooleanInputControl";
import { height, width } from "../style/vars";

const currentLocale = getLang();
const i18n = getI18N({ currentLocale });

const socket = new ClassicPreset.Socket("Boolean");

export class NotNode extends ClassicPreset.Node<
  { input: ClassicPreset.Socket },
  { value: ClassicPreset.Socket },
  { value: BooleanControl }
> {
  height = height;
  width = width;

  constructor(
    change?: () => void,
    private update?: (control: BooleanControl) => void
  ) {
    super(i18n.t("Operations.not"));
    const input = new ClassicPreset.Input(socket, "Input");

    input.addControl(new BooleanControl("boolean", { initial: false, change }));

    this.addInput("input", input);
    this.addControl(
      "value",
      new BooleanControl("boolean", {
        readonly: true,
      })
    );
    this.addOutput(
      "value",
      new ClassicPreset.Output(socket, i18n.t("Operations.boolean"))
    );
  }

  data(inputs: { input?: boolean[] }): { value: boolean } {
    const leftControl = this.inputs.input?.control as BooleanControl;

    const { input } = inputs;
    const value = !(input ? input[0] : leftControl.value);

    this.controls.value.setValue(value);

    if (this.update) this.update(this.controls.value);

    return { value };
  }
}

export class OrNode extends ClassicPreset.Node<
  { left: ClassicPreset.Socket; right: ClassicPreset.Socket },
  { value: ClassicPreset.Socket },
  { value: BooleanControl }
> {
  height = height;
  width = width;

  constructor(
    change?: () => void,
    private update?: (control: BooleanControl) => void
  ) {
    super(i18n.t("Operations.or"));
    const left = new ClassicPreset.Input(socket, i18n.t("Operations.left"));
    const right = new ClassicPreset.Input(socket, i18n.t("Operations.right"));

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
  height = height;
  width = width;

  constructor(
    change?: () => void,
    private update?: (control: BooleanControl) => void
  ) {
    super(i18n.t("Operations.and"));

    const left = new ClassicPreset.Input(socket, i18n.t("Operations.left"));
    const right = new ClassicPreset.Input(socket, i18n.t("Operations.right"));

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

export class StrictMoreNode extends ClassicPreset.Node<
  { left: ClassicPreset.Socket; right: ClassicPreset.Socket },
  { value: ClassicPreset.Socket },
  { value: BooleanControl }
> {
  height = height;
  width = width;

  constructor(
    change?: () => void,
    private update?: (control: BooleanControl) => void
  ) {
    super(i18n.t("Operations.strictMore"));

    const left = new ClassicPreset.Input(socket, i18n.t("Operations.left"));
    const right = new ClassicPreset.Input(socket, i18n.t("Operations.right"));

    left.addControl(
      new ClassicPreset.InputControl("number", { initial: 0, change })
    );
    right.addControl(
      new ClassicPreset.InputControl("number", { initial: 0, change })
    );

    this.addInput("left", left);
    this.addInput("right", right);
    this.addControl(
      "value",
      new BooleanControl("boolean", {
        readonly: true,
      })
    );
    this.addOutput(
      "value",
      new ClassicPreset.Output(socket, i18n.t("Operations.boolean"))
    );
  }

  data(inputs: { left?: number[]; right?: number[] }): { value: boolean } {
    const leftControl = this.inputs.left
      ?.control as ClassicPreset.InputControl<"number">;
    const rightControl = this.inputs.right
      ?.control as ClassicPreset.InputControl<"number">;

    const { left, right } = inputs;
    const value =
      (left ? left[0] : leftControl.value || 0) >
      (right ? right[0] : rightControl.value || 0);

    this.controls.value.setValue(value);

    if (this.update) this.update(this.controls.value);

    return { value };
  }
}

export class MoreNode extends ClassicPreset.Node<
  { left: ClassicPreset.Socket; right: ClassicPreset.Socket },
  { value: ClassicPreset.Socket },
  { value: BooleanControl }
> {
  height = height;
  width = width;

  constructor(
    change?: () => void,
    private update?: (control: BooleanControl) => void
  ) {
    super(i18n.t("Operations.more"));

    const left = new ClassicPreset.Input(socket, i18n.t("Operations.left"));
    const right = new ClassicPreset.Input(socket, i18n.t("Operations.right"));

    left.addControl(
      new ClassicPreset.InputControl("number", { initial: 0, change })
    );
    right.addControl(
      new ClassicPreset.InputControl("number", { initial: 0, change })
    );

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

  data(inputs: { left?: number[]; right?: number[] }): { value: boolean } {
    const leftControl = this.inputs.left
      ?.control as ClassicPreset.InputControl<"number">;
    const rightControl = this.inputs.right
      ?.control as ClassicPreset.InputControl<"number">;

    const { left, right } = inputs;
    const value =
      (left ? left[0] : leftControl.value || 0) >=
      (right ? right[0] : rightControl.value || 0);

    this.controls.value.setValue(value);

    if (this.update) this.update(this.controls.value);

    return { value };
  }
}

export class StrictLessNode extends ClassicPreset.Node<
  { left: ClassicPreset.Socket; right: ClassicPreset.Socket },
  { value: ClassicPreset.Socket },
  { value: BooleanControl }
> {
  height = height;
  width = width;

  constructor(
    change?: () => void,
    private update?: (control: BooleanControl) => void
  ) {
    super(i18n.t("Operations.strictLess"));
    const left = new ClassicPreset.Input(socket, i18n.t("Operations.left"));
    const right = new ClassicPreset.Input(socket, i18n.t("Operations.right"));

    left.addControl(
      new ClassicPreset.InputControl("number", { initial: 0, change })
    );
    right.addControl(
      new ClassicPreset.InputControl("number", { initial: 0, change })
    );

    this.addInput("left", left);
    this.addInput("right", right);
    this.addControl(
      "value",
      new BooleanControl("boolean", {
        readonly: true,
      })
    );
    this.addOutput(
      "value",
      new ClassicPreset.Output(socket, i18n.t("Operations.boolean"))
    );
  }

  data(inputs: { left?: number[]; right?: number[] }): { value: boolean } {
    const leftControl = this.inputs.left
      ?.control as ClassicPreset.InputControl<"number">;
    const rightControl = this.inputs.right
      ?.control as ClassicPreset.InputControl<"number">;

    const { left, right } = inputs;
    const value =
      (left ? left[0] : leftControl.value || 0) <
      (right ? right[0] : rightControl.value || 0);

    this.controls.value.setValue(value);

    if (this.update) this.update(this.controls.value);

    return { value };
  }
}

export class LessNode extends ClassicPreset.Node<
  { left: ClassicPreset.Socket; right: ClassicPreset.Socket },
  { value: ClassicPreset.Socket },
  { value: BooleanControl }
> {
  height = height;
  width = width;

  constructor(
    change?: () => void,
    private update?: (control: BooleanControl) => void
  ) {
    super(i18n.t("Operations.less"));

    const left = new ClassicPreset.Input(socket, i18n.t("Operations.left"));
    const right = new ClassicPreset.Input(socket, i18n.t("Operations.right"));

    left.addControl(
      new ClassicPreset.InputControl("number", { initial: 0, change })
    );
    right.addControl(
      new ClassicPreset.InputControl("number", { initial: 0, change })
    );

    this.addInput("left", left);
    this.addInput("right", right);
    this.addControl(
      "value",
      new BooleanControl("boolean", {
        readonly: true,
      })
    );
    this.addOutput(
      "value",
      new ClassicPreset.Output(socket, i18n.t("Operations.boolean"))
    );
  }

  data(inputs: { left?: number[]; right?: number[] }): { value: boolean } {
    const leftControl = this.inputs.left
      ?.control as ClassicPreset.InputControl<"number">;
    const rightControl = this.inputs.right
      ?.control as ClassicPreset.InputControl<"number">;

    const { left, right } = inputs;
    const value =
      (left ? left[0] : leftControl.value || 0) <=
      (right ? right[0] : rightControl.value || 0);

    this.controls.value.setValue(value);

    if (this.update) this.update(this.controls.value);

    return { value };
  }
}
