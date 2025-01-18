import {
  ConnectionNodePositions,
  Coordinate,
  FunctionCard,
  NodeConnection,
} from "@/types";
import { CURVE_TRESHOLD } from "./constants";

const parseEquation = (equation: string) => {
  return equation
    .replaceAll(/(\d+)(x)/g, "$1*$2")
    .replaceAll("^", "**")
    .replaceAll(/\s+/g, "");
};

export const calculateFunctionFlowResult = (
  initialValue: string | number = 0,
  functionsFlow: Array<FunctionCard>
) => {
  let currentValue = Number(initialValue);
  let currentFunctionId = "1";
  const visited = new Set();

  while (currentFunctionId) {
    if (visited.has(currentFunctionId)) {
      throw new Error("Circular reference detected");
    }

    visited.add(currentFunctionId);

    const currentFunction = functionsFlow.find(
      (fn) => fn?.id?.toString() === currentFunctionId
    );

    if (!currentFunction) break;

    const equation = parseEquation(currentFunction.equation).replaceAll(
      "x",
      currentValue?.toString()
    );

    currentValue = eval(equation); // TODO: Can implement the own equation evaluate method
    currentFunctionId = currentFunction.nextFunction;
  }

  return currentValue;
};

// Calculate control points for the curved path
export const generateSVGPath = (
  startPoint: Coordinate,
  endPoint: Coordinate,
  curvature: number
) => {
  if (!startPoint || !endPoint) return "";

  // Calculate the midpoint
  const midX = (startPoint.x + endPoint.x) / 2;
  const midY = (startPoint.y + endPoint.y) / 2;

  const distance = Math.sqrt(
    Math.pow(endPoint.x - startPoint.x, 2) +
      Math.pow(endPoint.y - startPoint.y, 2)
  );

  // Calculate the control points
  if (distance > CURVE_TRESHOLD) {
    // Split the path into two curves
    const firstMidX = (startPoint.x + midX) / 2;
    const firstMidY = (startPoint.y + midY) / 2;

    //  Calculate the distance between points
    const dx = midX - startPoint.x;
    const dy = midY - startPoint.y;

    const offsetX = curvature * Math.abs(dy);
    const offsetY = curvature * Math.abs(dx);

    const controlX = firstMidX + offsetX;
    const controlY = firstMidY + offsetY;

    return `M ${startPoint.x} ${startPoint.y} Q ${controlX} ${controlY} ${midX} ${midY} T ${endPoint.x} ${endPoint.y}`;
  }

  // Calculate the distance between points
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;

  const offsetX = curvature * Math.abs(dy);
  const offsetY = curvature * Math.abs(dx);

  const controlX = midX + offsetX;
  const controlY = midY + offsetY;

  // Generate the SVG path
  return `M ${startPoint.x} ${startPoint.y} Q ${controlX} ${controlY} ${endPoint.x} ${endPoint.y}`;
};

export const calculateElementCoordinates = (element: SVGSVGElement | null) => {
  if (!element) return { x: 0, y: 0 };

  const { left, top, width, height } = element.getBoundingClientRect();

  return {
    x: left + width / 2,
    y: top + height / 2,
  };
};

export const createConnectionMap = (
  functionRefs: Map<string, SVGSVGElement>
): Record<number, ConnectionNodePositions> => {
  const nodePositions: Record<number, ConnectionNodePositions> = {};

  functionRefs.forEach((node, key) => {
    const [idStr, type] = key.split(".");
    const id = Number(idStr);

    if (!nodePositions[id]) {
      nodePositions[id] = { input: { x: 0, y: 0 }, output: { x: 0, y: 0 } };
    }
    nodePositions[id][type as keyof ConnectionNodePositions] =
      calculateElementCoordinates(node);
  });

  return nodePositions;
};

export const getFunctionConnections = (
  functions: FunctionCard[],
  connectionNodePositions: Record<number, ConnectionNodePositions>,
  inputNodeRef: SVGSVGElement | null,
  outputNodeRef: SVGSVGElement | null
): NodeConnection[] => {
  const connections: NodeConnection[] = [];
  let firstNodeInput: Coordinate | null = null;
  let lastNodeOutput: Coordinate | null = null;

  functions.forEach((func) => {
    const currentNodePos = connectionNodePositions[func.id];
    const nextNodePos = connectionNodePositions[Number(func.nextFunction)];

    if (func.nextFunction && currentNodePos?.output && nextNodePos?.input) {
      if (!firstNodeInput) firstNodeInput = currentNodePos.input;

      connections.push({
        start: currentNodePos.output,
        end: nextNodePos.input,
      });
    }

    if (!func.nextFunction && currentNodePos?.output) {
      lastNodeOutput = currentNodePos.output;
    }
  });

  const inputNodePosition = calculateElementCoordinates(inputNodeRef);
  const outputNodePosition = calculateElementCoordinates(outputNodeRef);

  if (firstNodeInput && lastNodeOutput) {
    return [
      { start: inputNodePosition, end: firstNodeInput },
      ...connections,
      { start: lastNodeOutput, end: outputNodePosition },
    ];
  }

  return connections;
};
