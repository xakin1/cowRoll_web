import { ClassicPreset, type GetSchemes } from "rete";
import * as ArithmeticNodes from "./arithmeticNode/nodes"; // Importa todas las clases de nodos desde nodes.ts
import * as BooleanNodes from "./booleanNode/nodes"; // Importa todas las clases de nodos desde nodes.ts
import type BooleanControl from "./customControls/BooleanInputControl";

const AllNodes = {
  ...ArithmeticNodes,
  ...BooleanNodes,
};
// Obtén los nombres de las clases de nodo desde el módulo
type NodeClassNames = keyof typeof AllNodes;

// Obtén los tipos de las clases de nodo
type NodeClasses = (typeof AllNodes)[NodeClassNames];

// y de forma mágica tenemos los tipos de esa clase de forma automática
export type Node = InstanceType<NodeClasses>;

class Connection<
  A extends Node,
  B extends Node,
> extends ClassicPreset.Connection<A, B> {}

type ConnProps = Connection<Node, Node>;

export type Schemes = GetSchemes<Node, ConnProps>;

// No creo que se pueda automatizar
export type Control =
  | BooleanControl
  | ClassicPreset.InputControl<"number">
  | ClassicPreset.InputControl<"text">;
