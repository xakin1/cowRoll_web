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

import { getI18N } from "../../../i18n";
import { getLang } from "../../../i18n/utils";
import { ActionConnectionComponent } from "./ui/nodes/customConnections/ActionConnection";
import BooleanControl, {
  CustomSwitch,
} from "./ui/nodes/customControls/BooleanInputControl";
import {
  CustomTextInput,
  TextControl,
} from "./ui/nodes/customControls/TextInputControl";
import CustomVariableInput, {
  VarControl,
} from "./ui/nodes/customControls/VarInputControl";

import type { Input } from "rete/_types/presets/classic";
import {
  Graph,
  associateLooseInputs,
  getZeroIndegreeNodes,
  type Edge,
} from "../../../utils/functions/utils";
import {
  BooleanNode,
  NumberNode,
  TextNode,
} from "./ui/nodes/customNode/leafNode/leafNode";
import {
  AddNode,
  DivisionNode,
  MinusNode,
  MultiplicationNode,
  PowNode,
  RemainderNode,
  RoundDivisionNode,
} from "./ui/nodes/customNode/operationNode/arithmeticNode";
import {
  AndNode,
  LessNode,
  MoreNode,
  NotNode,
  OrNode,
  StrictLessNode,
  StrictMoreNode,
} from "./ui/nodes/customNode/operationNode/booleanNode";
import {
  IfNode,
  VariableNode,
} from "./ui/nodes/customNode/operationNode/functionalNode";
import { CustomNode } from "./ui/nodes/customNode/style/CustomNode";
import { CustomSocket } from "./ui/nodes/customNode/style/CustomSocket";
import { ActionSocketComponent } from "./ui/nodes/customSockets/ActionSocket";
import { ActionSocket, TextSocket } from "./ui/nodes/customSockets/sockets";
import type { Schemes } from "./ui/utils/nodeTypes";
import { getConnectionSockets } from "./ui/utils/utils";
("./sockets");

type AreaExtra = ReactArea2D<Schemes>;
let customEvent = false;

interface Input {
  control: {
    value: any;
  };
}
interface BinaryInputs {
  left: Input;
  Right: Input;
}

const currentLocale = getLang();
const i18n = getI18N({ currentLocale });

function putCode(nodeLabel: string, value?: any): string {
  let code: string = "";
  switch (nodeLabel) {
    //No sé hasta que punto podría darse este if con precedencias
    //TODO: Mirar como elegir seguir el flujo de true y de false
    case i18n.t("Operations.if"):
      code = "if " + " then \n true \n else\n false \n end";
      break;

    case i18n.t("Operations.add"):
      code = " + ";
      break;
    case i18n.t("Operations.minus"):
      code = " - ";
      break;

    case i18n.t("Operations.and"):
      code = " and ";
      break;

    case i18n.t("Operations.or"):
      code = " or ";
      break;

    case i18n.t("Operations.strictMore"):
      code = " > ";
      break;
    case i18n.t("Operations.strictLess"):
      code = " < ";
      break;
    case i18n.t("Operations.less"):
      code = " <= ";
      break;
    case i18n.t("Operations.more"):
      code = " >= ";
      break;
    case i18n.t("Operations.multiplication"):
      code = " * ";
      break;

    case i18n.t("Operations.div"):
      code = " / ";
      break;
    case i18n.t("Operations.roundDiv"):
      code = " // ";
      break;
    case i18n.t("Operations.rem"):
      code = " % ";
      break;
    case i18n.t("Operations.pow"):
      code = " ^ ";
      break;

    case i18n.t("Operations.number"):
      code = value?.toString() || "0";
      break;

    default:
      break;
  }
  return code;
}

function reconstructCode(graph: Graph, editor: NodeEditor<Schemes>) {
  // Nodos que no están recibiendo ningún input
  let leadNodes = getZeroIndegreeNodes(graph);
  let results: { [key: string]: any } = {};
  let lastExpression = "";
  const processed: Set<string> = new Set();
  while (leadNodes.length > 0) {
    const current = leadNodes.shift()!;
    const node = editor.getNode(current);

    if (node.label === "Number") {
      results[current] = node.controls.value.value!;
      processed.add(current);
    }

    graph.edges.forEach(([fromNode, toNode, direction]) => {
      const targetNode = editor.getNode(toNode);

      //tiene un lazo consigo mismo
      if (toNode === current) {
        if (!processed.has(toNode)) {
          if (results[toNode + "-" + direction] === undefined) {
            console.log(node.inputs[direction].control.value);
            results[toNode + "-" + direction] =
              node.inputs[direction].control.value || 0;
          }
        }
      }

      if (fromNode === current) {
        if (!processed.has(toNode)) {
          if (results[current] !== undefined) {
            results[toNode + "-" + direction] = results[current];
          }
        }
      }

      if (fromNode === current || toNode === current) {
        let allInputsAvailable = Object.keys(targetNode.inputs).every(
          (inputDirection) => {
            return results[toNode + "-" + inputDirection] !== undefined;
          }
        );

        if (allInputsAvailable) {
          // Añadimos paréntesis cuando es necesario (que es básicamente siempre por ahora)
          let left = results[toNode + "-left"] || 0;
          let right = results[toNode + "-right"] || 0;
          if (typeof left === "string" && left.includes(" "))
            left = `(${left})`;
          if (typeof right === "string" && right.includes(" "))
            right = `(${right})`;

          if (targetNode.label === i18n.t("Operations.add")) {
            results[toNode] = left + " + " + right;
          } else if (targetNode.label === i18n.t("Operations.minus")) {
            results[toNode] = left + " - " + right;
          } else if (targetNode.label === i18n.t("Operations.multiplication")) {
            results[toNode] = left + " * " + right;
          }
          processed.add(toNode);
          lastExpression = results[toNode];
        }
        if (!processed.has(toNode)) {
          leadNodes.push(toNode);
        }
      }
    });
  }

  return lastExpression;
}

function traverseDataflow(
  editor: NodeEditor<Schemes>,
  engine: DataflowEngine<Schemes>
) {
  let edge: Edge[] = [];
  let visitedConnections: string[] = [];

  const connections = editor.getConnections();

  //Añadimos las conexiones entrantes hacia los nodos
  connections.forEach((connection) => {
    if (!visitedConnections.includes(connection.id)) {
      visitedConnections.push(connection.id);
      edge.push([connection.source, connection.target, connection.targetInput]);
    }
  });
  //Añadimos los lazos que apuntan a los mismos nodos que no tienen una conexión como tal
  const nodes = editor.getNodes();
  edge = associateLooseInputs(nodes, edge);

  let graph = new Graph(edge);
  console.log(graph);

  let code;
  code = reconstructCode(graph, editor) || "";
  console.log(code);
}

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

  // Añade la customización a los nodos
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

  // Para poder detectar el supr en los nodos que se generan
  addCustomNodeRemoveListener();

  dock.addPreset(DockPresets.classic.setup({ area, size: 100, scale: 0.6 }));

  // Pienso que para que se propague
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

  // Añadimos los nodos que van a estar en el dock (el menu que te permite seleccionar los nodos)
  const nodesToAdd = [
    () => new IfNode(false, dataflow, (c) => area.update("control", c.id)),
    () => new VariableNode(false, process),
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
    () => new NotNode(process, (c) => area.update("control", c.id)),
    () => new AndNode(process, (c) => area.update("control", c.id)),
    () => new OrNode(process, (c) => area.update("control", c.id)),
    () => new StrictMoreNode(process, (c) => area.update("control", c.id)),
    () => new StrictLessNode(process, (c) => area.update("control", c.id)),
    () => new MoreNode(process, (c) => area.update("control", c.id)),
    () => new LessNode(process, (c) => area.update("control", c.id)),
  ];

  nodesToAdd.forEach((node) => dock.add(node));

  // Cada vez que se conecta o desconecta un nodo entramos por aquí
  editor.addPipe((context) => {
    if (["connectioncreated", "connectionremoved"].includes(context.type)) {
      process();
      // Aquí recorremos todos los nodos que están unidos por el flujo de datos
      traverseDataflow(editor, engine);
    }
    return context;
  });

  await arrange.layout();
  AreaExtensions.zoomAt(area, editor.getNodes());

  return {
    destroy: () => {
      area.destroy();
    },
  };
}
