import { ClassicPreset } from "rete";
import { getI18N } from "../../../../../../../i18n";
import { getLang } from "../../../../../../../i18n/utils";
import { height, width } from "../style/vars";

const currentLocale = getLang();
const i18n = getI18N({ currentLocale });

const socket = new ClassicPreset.Socket("socket");

export class AddNode extends ClassicPreset.Node<
  { left: ClassicPreset.Socket; right: ClassicPreset.Socket },
  { value: ClassicPreset.Socket },
  { value: ClassicPreset.InputControl<"number"> }
> {
  height = height;
  width = width;

  constructor(
    change?: () => void,
    private update?: (control: ClassicPreset.InputControl<"number">) => void
  ) {
    super(i18n.t("Operations.add"));
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
      new ClassicPreset.InputControl("number", {
        readonly: true,
      })
    );
    this.addOutput(
      "value",
      new ClassicPreset.Output(socket, i18n.t("Operations.number"))
    );
  }

  data(inputs: { left?: number[]; right?: number[] }): { value: number } {
    const leftControl = this.inputs.left
      ?.control as ClassicPreset.InputControl<"number">;
    const rightControl = this.inputs.right
      ?.control as ClassicPreset.InputControl<"number">;

    // Inicializar valores de entrada desde los controles
    let leftValue = leftControl.value || 0;
    let rightValue = rightControl.value || 0;

    // Si hay entradas desde conexiones, actualiza los valores de los inputs
    if (inputs.left && inputs.left.length > 0) {
      leftValue = inputs.left[0];
    }
    if (inputs.right && inputs.right.length > 0) {
      rightValue = inputs.right[0];
    }

    const value = leftValue + rightValue;

    // Actualizar el control `value`
    this.controls.value.setValue(value);

    if (this.update) this.update(this.controls.value);

    return { value };
  }
}

export class MinusNode extends ClassicPreset.Node<
  { left: ClassicPreset.Socket; right: ClassicPreset.Socket },
  { value: ClassicPreset.Socket },
  { value: ClassicPreset.InputControl<"number"> }
> {
  height = height;
  width = width;

  constructor(
    change?: () => void,
    private update?: (control: ClassicPreset.InputControl<"number">) => void
  ) {
    super(i18n.t("Operations.minus"));
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
      new ClassicPreset.InputControl("number", {
        readonly: true,
      })
    );
    this.addOutput(
      "value",
      new ClassicPreset.Output(socket, i18n.t("Operations.number"))
    );
  }

  data(inputs: { left?: number[]; right?: number[] }): { value: number } {
    const leftControl = this.inputs.left
      ?.control as ClassicPreset.InputControl<"number">;
    const rightControl = this.inputs.right
      ?.control as ClassicPreset.InputControl<"number">;

    const { left, right } = inputs;
    const value =
      (left ? left[0] : leftControl.value || 0) -
      (right ? right[0] : rightControl.value || 0);

    this.controls.value.setValue(value);

    if (this.update) this.update(this.controls.value);
    return { value };
  }
}

export class MultiplicationNode extends ClassicPreset.Node<
  { left: ClassicPreset.Socket; right: ClassicPreset.Socket },
  { value: ClassicPreset.Socket },
  { value: ClassicPreset.InputControl<"number"> }
> {
  height = height;
  width = width;

  constructor(
    change?: () => void,
    private update?: (control: ClassicPreset.InputControl<"number">) => void
  ) {
    super(i18n.t("Operations.multiplication"));
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
      new ClassicPreset.InputControl("number", {
        readonly: true,
      })
    );
    this.addOutput(
      "value",
      new ClassicPreset.Output(socket, i18n.t("Operations.number"))
    );
  }

  data(inputs: { left?: number[]; right?: number[] }): { value: number } {
    const leftControl = this.inputs.left
      ?.control as ClassicPreset.InputControl<"number">;
    const rightControl = this.inputs.right
      ?.control as ClassicPreset.InputControl<"number">;

    const { left, right } = inputs;
    const value =
      (left ? left[0] : leftControl.value || 0) *
      (right ? right[0] : rightControl.value || 0);

    this.controls.value.setValue(value);

    if (this.update) this.update(this.controls.value);
    return { value };
  }
}

export class DivisionNode extends ClassicPreset.Node<
  { left: ClassicPreset.Socket; right: ClassicPreset.Socket },
  { value: ClassicPreset.Socket },
  { value: ClassicPreset.InputControl<"number"> }
> {
  height = height;
  width = width;

  constructor(
    change?: () => void,
    private update?: (control: ClassicPreset.InputControl<"number">) => void
  ) {
    super(i18n.t("Operations.div"));
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
      new ClassicPreset.InputControl("number", {
        readonly: true,
      })
    );
    this.addOutput(
      "value",
      new ClassicPreset.Output(socket, i18n.t("Operations.number"))
    );
  }

  data(inputs: { left?: number[]; right?: number[] }): { value: number } {
    const leftControl = this.inputs.left
      ?.control as ClassicPreset.InputControl<"number">;
    const rightControl = this.inputs.right
      ?.control as ClassicPreset.InputControl<"number">;

    const { left, right } = inputs;
    const value = Math.floor(
      (left ? left[0] : leftControl.value || 0) /
        (right ? right[0] : rightControl.value || 0)
    );

    this.controls.value.setValue(value);

    if (this.update) this.update(this.controls.value);
    return { value };
  }
}

export class RoundDivisionNode extends ClassicPreset.Node<
  { left: ClassicPreset.Socket; right: ClassicPreset.Socket },
  { value: ClassicPreset.Socket },
  { value: ClassicPreset.InputControl<"number"> }
> {
  height = height;
  width = width;

  constructor(
    change?: () => void,
    private update?: (control: ClassicPreset.InputControl<"number">) => void
  ) {
    super(i18n.t("Operations.roundDiv"));
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
      new ClassicPreset.InputControl("number", {
        readonly: true,
      })
    );
    this.addOutput(
      "value",
      new ClassicPreset.Output(socket, i18n.t("Operations.number"))
    );
  }

  data(inputs: { left?: number[]; right?: number[] }): { value: number } {
    const leftControl = this.inputs.left
      ?.control as ClassicPreset.InputControl<"number">;
    const rightControl = this.inputs.right
      ?.control as ClassicPreset.InputControl<"number">;

    const { left, right } = inputs;
    const value = Math.ceil(
      (left ? left[0] : leftControl.value || 0) /
        (right ? right[0] : rightControl.value || 0)
    );

    this.controls.value.setValue(value);

    if (this.update) this.update(this.controls.value);
    return { value };
  }
}

export class RemainderNode extends ClassicPreset.Node<
  { left: ClassicPreset.Socket; right: ClassicPreset.Socket },
  { value: ClassicPreset.Socket },
  { value: ClassicPreset.InputControl<"number"> }
> {
  height = height;
  width = width;

  constructor(
    change?: () => void,
    private update?: (control: ClassicPreset.InputControl<"number">) => void
  ) {
    super(i18n.t("Operations.rem"));
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
      new ClassicPreset.InputControl("number", {
        readonly: true,
      })
    );
    this.addOutput(
      "value",
      new ClassicPreset.Output(socket, i18n.t("Operations.number"))
    );
  }

  data(inputs: { left?: number[]; right?: number[] }): { value: number } {
    const leftControl = this.inputs.left
      ?.control as ClassicPreset.InputControl<"number">;
    const rightControl = this.inputs.right
      ?.control as ClassicPreset.InputControl<"number">;

    const { left, right } = inputs;
    const value =
      (left ? left[0] : leftControl.value || 0) %
      (right ? right[0] : rightControl.value || 0);

    this.controls.value.setValue(value);

    if (this.update) this.update(this.controls.value);
    return { value };
  }
}

export class PowNode extends ClassicPreset.Node<
  { left: ClassicPreset.Socket; right: ClassicPreset.Socket },
  { value: ClassicPreset.Socket },
  { value: ClassicPreset.InputControl<"number"> }
> {
  height = height;
  width = width;

  constructor(
    change?: () => void,
    private update?: (control: ClassicPreset.InputControl<"number">) => void
  ) {
    super(i18n.t("Operations.pow"));
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
      new ClassicPreset.InputControl("number", {
        readonly: true,
      })
    );
    this.addOutput(
      "value",
      new ClassicPreset.Output(socket, i18n.t("Operations.number"))
    );
  }

  data(inputs: { left?: number[]; right?: number[] }): { value: number } {
    const leftControl = this.inputs.left
      ?.control as ClassicPreset.InputControl<"number">;
    const rightControl = this.inputs.right
      ?.control as ClassicPreset.InputControl<"number">;

    const { left, right } = inputs;
    const value = Math.pow(
      left ? left[0] : leftControl.value || 0,
      right ? right[0] : rightControl.value || 0
    );

    this.controls.value.setValue(value);

    if (this.update) this.update(this.controls.value);
    return { value };
  }
}
