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
import { CustomNode } from "./customNode/CustomNode";
import { CustomSocket } from "./customNode/CustomSocket";
import {
  AddNode,
  DivisionNode,
  MinusNode,
  MultiplicationNode,
  NumberNode,
  PowNode,
  RemainderNode,
  RoundDivisionNode,
  TextNode,
} from "./nodes/arithmeticNode/nodes";
import { AndNode, BooleanNode, OrNode } from "./nodes/booleanNode/nodes";
import BooleanControl, {
  CustomSwitch,
} from "./nodes/customControls/BooleanInputControl";
import type { Schemes } from "./nodes/nodeTypes";

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

  render.addPreset(
    Presets.classic.setup({
      customize: {
        control(data) {
          if (data.payload instanceof BooleanControl) {
            return CustomSwitch;
          } else {
            return Presets.classic.Control;
          }
        },
        node(context) {
          return CustomNode;
        },
        socket(context) {
          return CustomSocket;
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
    () => new AddNode(process, (c) => area.update("control", c.id)),
    () => new MinusNode(process, (c) => area.update("control", c.id)),
    () => new MultiplicationNode(process, (c) => area.update("control", c.id)),
    () => new DivisionNode(process, (c) => area.update("control", c.id)),
    () => new RoundDivisionNode(process, (c) => area.update("control", c.id)),
    () => new RemainderNode(process, (c) => area.update("control", c.id)),
    () => new PowNode(process, (c) => area.update("control", c.id)),
    () => new NumberNode(1, process),
    () => new TextNode("text", process),
    () => new BooleanNode(false, process),
    () => new AndNode(process, (c) => area.update("control", c.id)),
    () => new OrNode(process, (c) => area.update("control", c.id)),
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
