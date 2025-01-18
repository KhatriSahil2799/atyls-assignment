import { ConnectionNodePositions, Coordinate, NodeConnection } from "@/types";
import { calculateFunctionFlowResult } from "@/utils/helper";
import { useCallback, useEffect, useRef, useState } from "react";

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
  const [finalOutput, setFinalOutput] = useState(45);

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

  useEffect(() => {
    calculateResult();
  }, [initialValue, functions, calculateResult]);

  const inputNodeSVGRef = useRef<SVGSVGElement>(null);
  const outputNodeSVGRef = useRef<SVGSVGElement>(null);

  const [inputNodePosition, setInputNodePosition] = useState({ x: 0, y: 0 });
  const [outputNodePosition, setOutputNodePosition] = useState({ x: 0, y: 0 });

  const getFunctionBoxConnections = useCallback(() => {
    let connections: Array<NodeConnection> = [];
    let firstNodeInputCoordinate: Coordinate | null = null;
    let lastNodeOutputCoordinate: Coordinate | null = null;
    functions.forEach((func) => {
      if (
        func?.nextFunction &&
        connectionNodePositions[func?.id] &&
        connectionNodePositions[Number(func?.nextFunction)]
      ) {
        if (firstNodeInputCoordinate === null) {
          firstNodeInputCoordinate = connectionNodePositions[func?.id].input;
        }
        connections.push({
          start: connectionNodePositions[func?.id].output,
          end: connectionNodePositions[Number(func?.nextFunction)].input,
        });

       
      }
      console.log("🚀 ~ func?.nextFunction:", func?.nextFunction, func,connectionNodePositions)
      if(!func?.nextFunction){
        lastNodeOutputCoordinate = connectionNodePositions[func?.id]?.output;
      }
    });

    // add leaf node's connections
    connections = [
      {
        start: inputNodePosition,
        end: firstNodeInputCoordinate,
      },
      ...connections,
      {
        start: lastNodeOutputCoordinate,
        end: outputNodePosition,
      },
    ];

    return connections;
  }, [connectionNodePositions, functions]);

  // Use useEffect to get the position of the input and output nodes
  useEffect(() => {
    const updatePositions = () => {
      if (inputNodeSVGRef.current && outputNodeSVGRef.current) {
        const inputDot = inputNodeSVGRef.current.getBoundingClientRect();
        const outputDot = outputNodeSVGRef.current.getBoundingClientRect();

        setInputNodePosition({
          x: inputDot.left + inputDot.width / 2,
          y: inputDot.top + inputDot.height / 2,
        });

        setOutputNodePosition({
          x: outputDot.left + outputDot.width / 2,
          y: outputDot.top + outputDot.height / 2,
        });
      }
    };

    updatePositions();
    // Add event listener to update position on window resize
    window.addEventListener("resize", updatePositions);
    return () => window.removeEventListener("resize", updatePositions);
  }, []);

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
    inputNodeSVGRef ,
    outputNodeSVGRef
  };
};

export default useFunctionFlow;
