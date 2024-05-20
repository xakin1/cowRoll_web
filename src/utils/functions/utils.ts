import type { ClassicPreset } from "rete";
import type { Input, Socket } from "rete/_types/presets/classic";

export function detectColorScheme(): string {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  } else {
    return "light";
  }
}

export function cookiesEnabled(): boolean {
  return navigator.cookieEnabled;
}

export type Edge = [string, string, string];

// Clase para representar un objeto de grafo
export class Graph {
  adjList: Map<string, { node: string; direction: string }[]>;
  indegree: Map<string, number>;
  edges: [string, string, string][];

  constructor(edges: Edge[]) {
    this.adjList = new Map();
    this.indegree = new Map();
    this.edges = edges;

    edges.forEach(([source, destination, direction]) => {
      if (!this.adjList.has(source)) {
        this.adjList.set(source, []);
      }
      this.adjList.get(source)!.push({ node: destination, direction });

      if (!this.indegree.has(source)) {
        this.indegree.set(source, 0);
      }
      if (!this.indegree.has(destination)) {
        this.indegree.set(destination, 0);
      }
      this.indegree.set(destination, this.indegree.get(destination)! + 1);
    });
  }
  getAdjList(
    nodeId: string
  ): { node: string; direction: string }[] | undefined {
    return this.adjList.get(nodeId);
  }

  countTerminalNodes(): number {
    const allNodes = new Set<string>();
    const nodesWithOutgoingEdges = new Set<string>();

    // Recopilar todos los nodos y los nodos que tienen aristas salientes
    this.edges.forEach(([source, destination]) => {
      allNodes.add(source);
      allNodes.add(destination);
      if (source != destination) nodesWithOutgoingEdges.add(source);
    });

    // Los nodos terminales son los que están en `allNodes` pero no en `nodesWithOutgoingEdges`
    const terminalNodes = new Set(
      [...allNodes].filter((node) => !nodesWithOutgoingEdges.has(node))
    );

    return terminalNodes.size;
  }
}

export function countTargetOccurrences(edge: Edge[], id: String) {
  return edge.reduce((count, connection) => {
    return connection[1] === id ? count + 1 : count;
  }, 0);
}

export function getLabelsAndKeys(inputs: Input<Socket>): {
  [key: string]: string | undefined;
} {
  const result: { [key: string]: string | undefined } = {};

  for (const key in inputs) {
    if (inputs.hasOwnProperty(key)) {
      const input = inputs[key];
      result[key] = input.label;
    }
  }

  return result;
}

export function getZeroIndegreeNodes(graph: Graph): string[] {
  const zeroIndegreeNodes: string[] = [];

  graph.indegree.forEach((value, key) => {
    if (value === 0) {
      zeroIndegreeNodes.push(key);
    }
  });

  return zeroIndegreeNodes;
}

export function findAllTopologicalOrders(
  graph: Graph,
  path: string[],
  // Mapa para saber si un nodo ya se ha incluido en el path
  discovered: Map<string, boolean>,
  // Número total de nodos
  N: number,
  // Ordenes topograficos
  results: string[][]
) {
  let flag = false;

  graph.adjList.forEach((adj, node) => {
    if (graph.indegree.get(node) === 0 && !discovered.get(node)) {
      adj.forEach(({ node: adjacentNode }) => {
        graph.indegree.set(adjacentNode, graph.indegree.get(adjacentNode)! - 1);
      });

      path.push(node);
      discovered.set(node, true);

      findAllTopologicalOrders(graph, path, discovered, N, results);

      path.pop();
      discovered.set(node, false);
      adj.forEach(({ node: adjacentNode }) => {
        graph.indegree.set(adjacentNode, graph.indegree.get(adjacentNode)! + 1);
      });

      flag = true;
    }
  });

  if (!flag && path.length === N) {
    results.push([...path]);
  }
}

export function associateLooseInputs(
  nodes: ClassicPreset.Node[],
  edges: Edge[]
) {
  nodes.forEach((node) => {
    const count = countTargetOccurrences(edges, node.id);

    if (Object.keys(node.inputs).length > count) {
      const inputs = getLabelsAndKeys(node.inputs);

      const associatedInputs = new Set(
        edges.filter((edge) => edge[1] === node.id).map((edge) => edge[2])
      );

      for (const inputKey in inputs) {
        if (
          inputs.hasOwnProperty(inputKey) &&
          !associatedInputs.has(inputKey)
        ) {
          // Asociar el input suelto al nodo
          edges.push([
            node.id,
            node.id,
            inputKey as "left" | "right" | "condition",
          ]);
        }
      }
    }
  });

  return edges;
}

export function getAllTopologicalOrders(graph: Graph, N: number): string[][] {
  const discovered = new Map<string, boolean>();
  graph.adjList.forEach((_, key) => discovered.set(key, false));

  const path: string[] = [];
  const results: string[][] = [];

  findAllTopologicalOrders(graph, path, discovered, N, results);

  return results;
}
