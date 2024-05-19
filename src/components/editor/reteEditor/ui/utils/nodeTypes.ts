import { ClassicPreset, type GetSchemes } from "rete";
import type BooleanControl from "../nodes/customControls/BooleanInputControl";
import * as ArithmeticNodes from "../nodes/customNode/operationNode/arithmeticNode";
import * as BooleanNodes from "../nodes/customNode/operationNode/booleanNode";
import * as LeafNodes from "../nodes/customNode/operationNode/booleanNode";
import type { IfNode } from "../nodes/customNode/operationNode/functionalNode";

const AllNodes = {
  ...ArithmeticNodes,
  ...BooleanNodes,
  ...LeafNodes,
};
export interface CodeNode {
  code: string;
}

// Obtén los nombres de las clases de nodo desde el módulo
type NodeClassNames = keyof typeof AllNodes;

// Obtén los tipos de las clases de nodo
type NodeClasses = (typeof AllNodes)[NodeClassNames];

// y de forma mágica tenemos los tipos de esa clase de forma automática
export type Node = InstanceType<NodeClasses> | IfNode;

type LeafClassNames = keyof typeof LeafNodes;

type LeafNodeClasses = (typeof LeafNodes)[LeafClassNames];

export type LeafNode = InstanceType<LeafNodeClasses>;

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
