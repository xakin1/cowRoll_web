import { debounce } from "@mui/material";
import { createRoot } from "react-dom/client";
import { ClassicPreset, NodeEditor } from "rete";
import { AreaExtensions, AreaPlugin } from "rete-area-plugin";
import {
  Presets as ArrangePresets,
  AutoArrangePlugin,
} from "rete-auto-arrange-plugin";
import {
  ConnectionPlugin,
  Presets as ConnectionPresets,
} from "rete-connection-plugin";
import { DockPlugin, DockPresets } from "rete-dock-plugin";
import { DataflowEngine } from "rete-engine";
import { Presets, ReactPlugin, type ReactArea2D } from "rete-react-plugin";

import { ActionConnectionComponent } from "./ui/customConnections/ActionConnection";
import BooleanControl, {
  CustomSwitch,
} from "./ui/customControls/BooleanInputControl";
import {
  CustomTextInput,
  TextControl,
} from "./ui/customControls/TextInputControl";
import CustomVariableInput, {
  VarControl,
} from "./ui/customControls/VarInputControl";
import { BooleanNode } from "./ui/customNode/booleanNode";
import { IfNode, VariableNode } from "./ui/customNode/functionalNode";
import { CustomNode } from "./ui/customNode/style/CustomNode";
import { CustomSocket } from "./ui/customNode/style/CustomSocket";
import { ActionSocketComponent } from "./ui/customSockets/ActionSocket";
import { ActionSocket, TextSocket } from "./ui/customSockets/sockets";
import type { Schemes } from "./ui/utils/nodeTypes";
import { getConnectionSockets } from "./ui/utils/utils";
("./sockets");

type AreaExtra = ReactArea2D<Schemes>;
let customEvent = false;

export async function createEditor(container: HTMLElement) {
  const editor = new NodeEditor<Schemes>();
  const area = new AreaPlugin<Schemes, AreaExtra>(container);
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  const render = new ReactPlugin<Schemes, AreaExtra>({ createRoot });
  const arrange = new AutoArrangePlugin<Schemes>();
  const engine = new DataflowEngine<Schemes>();
  const dock = new DockPlugin<Schemes>();
  const dataflow = new DataflowEngine<Schemes>(({ inputs, outputs }) => {
    return {
      inputs: () =>
        Object.entries(inputs)
          .filter(([_, input]) => input.socket instanceof TextSocket)
          .map(([name]) => name),
      outputs: () =>
        Object.entries(outputs)
          .filter(([_, output]) => output.socket instanceof TextSocket)
          .map(([name]) => name),
    };
  });

  render.addPreset(
    Presets.classic.setup({
      customize: {
        connection(data) {
          const { source, target } = getConnectionSockets(editor, data.payload);

          if (
            source instanceof ActionSocket ||
            target instanceof ActionSocket
          ) {
            return ActionConnectionComponent;
          }
          return Presets.classic.Connection;
        },
        control(context) {
          if (context.payload instanceof BooleanControl) {
            return CustomSwitch;
          }
          if (context.payload instanceof TextControl) {
            return CustomTextInput;
          }

          if (context.payload instanceof VarControl) {
            return CustomVariableInput;
          }
          return Presets.classic.Control;
        },
        node(context) {
          return CustomNode;
        },
        socket(context) {
          if (context.payload instanceof ActionSocket) {
            return ActionSocketComponent;
          } else {
            return CustomSocket;
          }
        },
      },
    })
  );

  function addCustomNodeRemoveListener() {
    if (!customEvent) {
      customEvent = true;
      window.addEventListener(
        "customNodeRemove",
        debounce((event: Event) => {
          const { id } = (event as CustomEvent).detail;

          // Remove connections related to the node
          const connections = editor.getConnections();

          connections.forEach((connection) => {
            if (connection.source === id || connection.target === id) {
              editor.removeConnection(connection.id);
            }
          });

          // Remove the node
          editor.removeNode(id);
        }, 100)
      );
    }
  }

  addCustomNodeRemoveListener();

  dock.addPreset(DockPresets.classic.setup({ area, size: 100, scale: 0.6 }));

  function process() {
    engine.reset();

    editor
      .getNodes()
      .filter((n) => n instanceof ClassicPreset.Node)
      .forEach((n) => engine.fetch(n.id));
  }

  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl(),
  });

  render.addPreset(Presets.classic.setup());

  connection.addPreset(ConnectionPresets.classic.setup());

  arrange.addPreset(ArrangePresets.classic.setup());

  editor.use(engine);
  editor.use(area);
  area.use(connection);
  area.use(render);
  area.use(arrange);
  area.use(dock);

  AreaExtensions.simpleNodesOrder(area);
  AreaExtensions.showInputControl(area);

  const nodesToAdd = [
    () => new IfNode(false, dataflow, (c) => area.update("control", c.id)),
    () => new VariableNode(false, process),
    // () => new AddNode(process, (c) => area.update("control", c.id)),
    // () => new MinusNode(process, (c) => area.update("control", c.id)),
    // () => new MultiplicationNode(process, (c) => area.update("control", c.id)),
    // () => new DivisionNode(process, (c) => area.update("control", c.id)),
    // () => new RoundDivisionNode(process, (c) => area.update("control", c.id)),
    // () => new RemainderNode(process, (c) => area.update("control", c.id)),
    // () => new PowNode(process, (c) => area.update("control", c.id)),
    // () => new NumberNode(1, process),
    // () => new TextNode("text", process),
    () => new BooleanNode(false, process),
    // () => new NotNode(process, (c) => area.update("control", c.id)),
    // () => new AndNode(process, (c) => area.update("control", c.id)),
    // () => new OrNode(process, (c) => area.update("control", c.id)),
    // () => new StrictMoreNode(process, (c) => area.update("control", c.id)),
    // () => new StrictLessNode(process, (c) => area.update("control", c.id)),
    // () => new MoreNode(process, (c) => area.update("control", c.id)),
    // () => new LessNode(process, (c) => area.update("control", c.id)),
  ];

  nodesToAdd.forEach((node) => dock.add(node));

  editor.addPipe((context) => {
    if (["connectioncreated", "connectionremoved"].includes(context.type)) {
      process();
    }
    return context;
  });

  await arrange.layout();
  AreaExtensions.zoomAt(area, editor.getNodes());

  return {
    destroy: () => area.destroy(),
  };
}
