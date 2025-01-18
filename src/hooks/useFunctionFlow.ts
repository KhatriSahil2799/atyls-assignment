import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { NodeConnection, FunctionCard } from "../types";
import {
  calculateFunctionFlowResult,
  createConnectionMap,
  getFunctionConnections,
} from "@/utils/helper";
import { INITIAL_FUNCTION_FLOW } from "@/utils/constants";

export const useFunctionFlow = () => {
  const [functions, setFunctions] = useState<FunctionCard[]>(
    INITIAL_FUNCTION_FLOW
  );
  const [connections, setConnections] = useState<NodeConnection[]>([]);

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");
  const [initialValue, setInitialValue] = useState<number>(2);
  const [finalOutput, setFinalOutput] = useState<number>(45);

  const functionCardRefs = useRef<Map<string, SVGSVGElement>>(new Map());
  const inputNodeSVGRef = useRef<SVGSVGElement>(null);
  const outputNodeSVGRef = useRef<SVGSVGElement>(null);

  const calculateConnections = useCallback(() => {
    const nodePositions = createConnectionMap(functionCardRefs.current);
    const updatedConnections = getFunctionConnections(
      functions,
      nodePositions,
      inputNodeSVGRef.current,
      outputNodeSVGRef.current
    );
    setConnections(updatedConnections);
  }, [functions]);

  const calculateResult = useCallback(() => {
    try {
      const result = calculateFunctionFlowResult(initialValue, functions);
      setFinalOutput(result);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  }, [initialValue, functions]);

  const handleEquationChange = useCallback(
    (id: number, newEquation: string) => {
      setFunctions((prev) =>
        prev.map((func) =>
          func.id === id ? { ...func, equation: newEquation } : func
        )
      );
    },
    []
  );

  const handleNextFunctionChange = useCallback(
    (id: number, nextFunction: string) => {
      setFunctions((prev) =>
        prev.map((func) => (func.id === id ? { ...func, nextFunction } : func))
      );
    },
    []
  );

  useEffect(() => {
    const handleResize = () => startTransition(calculateConnections);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [calculateConnections]);

  useEffect(() => {
    calculateResult();
    startTransition(calculateConnections);
  }, [functions, initialValue, calculateResult, calculateConnections]);

  return {
    isPending,
    functions,
    functionCardRefs,
    error,
    initialValue,
    setInitialValue,
    finalOutput,
    handleEquationChange,
    handleNextFunctionChange,
    inputNodeSVGRef,
    outputNodeSVGRef,
    connections,
  };
};

export default useFunctionFlow;
