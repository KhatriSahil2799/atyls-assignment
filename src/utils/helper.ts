import { Coordinate, FunctionBox } from "@/types";
import { CURVE_TRESHOLD } from "./constants";

const parseEquation = (equation: string) => {
  return equation
    .replaceAll(/(\d+)(x)/g, "$1*$2")
    .replaceAll("^", "**")
    .replaceAll(/\s+/g, "");
};

export const calculateFunctionFlowResult = (
  initialValue: string | number = 0,
  functionsFlow: Array<FunctionBox>
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

export const calculateElementCoordinates = (element: HTMLElement) => {
  const { left, top, width, height } = element.getBoundingClientRect();

  return {
    x: left + width / 2,
    y: top + height / 2,
  };
};
