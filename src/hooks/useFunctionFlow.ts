import { ConnectionNodePositions, NodeConnection } from "@/types";
import { calculateFunctionFlowResult } from "@/utils/helper";
import { useCallback, useEffect, useState } from "react";

const INITIAL_FUNCTION_FLOW = [
  { id: 1, equation: "x^2", nextFunction: "2" },
  { id: 2, equation: "2x+4", nextFunction: "4" },
  { id: 3, equation: "x^2+20", nextFunction: "" },
  { id: 4, equation: "x-2", nextFunction: "5" },
  { id: 5, equation: "x/2", nextFunction: "3" },
];

const useFunctionFlow = () => {
  const [functions, setFunctions] = useState(() => INITIAL_FUNCTION_FLOW);

  const [error, setError] = useState("");
  const [initialValue, setInitialValue] = useState(2);
  const [finalOutput, setFinalOutput] = useState(120);

  const [connectionNodePositions, setConnectionNodePositions] = useState<
    Record<number, ConnectionNodePositions>
  >({});

  const calculateResult = useCallback(() => {
    try {
      const result = calculateFunctionFlowResult(initialValue, functions);

      setFinalOutput(result);
      setError("");
    } catch (err) {
      setError(err?.message);
    }
  }, [functions, initialValue]);

  const handleEquationChange = useCallback(
    (id: number, newEquation: string) => {
      setFunctions((prev) =>
        prev.map((f) => (f.id === id ? { ...f, equation: newEquation } : f))
      );
    },
    []
  );

  const handleNextFunctionChange = useCallback(
    (id: number, nextFunction: string) => {
      setFunctions((prev) =>
        prev.map((f) => (f.id === id ? { ...f, nextFunction } : f))
      );
    },
    []
  );

  const handleFunctionBoxConnectionNodePositions = useCallback(
    (id: number, positions: ConnectionNodePositions) => {
      setConnectionNodePositions((prev) => ({
        ...prev,
        [id]: positions,
      }));
    },
    []
  );

  const getFunctionBoxConnections = useCallback(() => {
    const connections: Array<NodeConnection> = [];
    functions.forEach((func) => {
      if (
        func?.nextFunction &&
        connectionNodePositions[func?.id] &&
        connectionNodePositions[Number(func?.nextFunction)]
      ) {
        connections.push({
          start: connectionNodePositions[func?.id].output,
          end: connectionNodePositions[Number(func?.nextFunction)].input,
        });
      }
    });
    return connections;
  }, [connectionNodePositions, functions]);

  useEffect(() => {
    calculateResult();
  }, [initialValue, functions, calculateResult]);

  return {
    functions,
    error,
    initialValue,
    setInitialValue,
    finalOutput,
    setFinalOutput,
    handleEquationChange,
    handleNextFunctionChange,
    handleFunctionBoxConnectionNodePositions,
    getFunctionBoxConnections,
  };
};

export default useFunctionFlow;
