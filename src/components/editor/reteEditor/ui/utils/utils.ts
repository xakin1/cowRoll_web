import { ClassicPreset, NodeEditor, type BaseSchemes } from "rete";
import type { ActionSocket, TextSocket } from "../nodes/customSockets/sockets";
import type { Schemes } from "./nodeTypes";

type Sockets = ActionSocket | TextSocket;
type Input = ClassicPreset.Input<Sockets>;
type Output = ClassicPreset.Output<Sockets>;

export function getConnectionSockets(
  editor: NodeEditor<Schemes>,
  connection: Schemes["Connection"]
) {
  const source = editor.getNode(connection.source);
  const target = editor.getNode(connection.target);

  const output =
    source &&
    (source.outputs as Record<string, Input>)[connection.sourceOutput];
  const input =
    target && (target.inputs as Record<string, Output>)[connection.targetInput];

  return {
    source: output?.socket,
    target: input?.socket,
  };
}

export async function clearEditor(editor: NodeEditor<BaseSchemes>) {
  for (const c of [...editor.getConnections()]) {
    await editor.removeConnection(c.id);
  }
  for (const n of [...editor.getNodes()]) {
    await editor.removeNode(n.id);
  }
}
