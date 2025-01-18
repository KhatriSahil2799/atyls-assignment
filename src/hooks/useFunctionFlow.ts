import { ConnectionNodePositions, Coordinate, NodeConnection } from "@/types";
import {
  calculateElementCoordinates,
  calculateFunctionFlowResult,
} from "@/utils/helper";
import {
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";

const INITIAL_FUNCTION_FLOW = [
  { id: 1, equation: "x^2", nextFunction: "2" },
  { id: 2, equation: "2x+4", nextFunction: "4" },
  { id: 3, equation: "x^2+20", nextFunction: "" },
  { id: 4, equation: "x-2", nextFunction: "5" },
  { id: 5, equation: "x/2", nextFunction: "3" },
];

const useFunctionFlow = () => {
  const [functions, setFunctions] = useState(() => INITIAL_FUNCTION_FLOW);

  const functionCardRefs = useRef(new Map<string, SVGSVGElement>());

  const [connections, setConnections] = useState([]);

  const inputNodeSVGRef = useRef<SVGSVGElement>(null);
  const outputNodeSVGRef = useRef<SVGSVGElement>(null);

  const [isPending, startTransition] = useTransition();

  const getFunctionBoxConnections = useCallback(
    (connectionNodePositions) => {
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
        // console.log("🚀 ~ func?.nextFunction:", func?.nextFunction, func,connectionNodePositions)
        if (!func?.nextFunction) {
          lastNodeOutputCoordinate = connectionNodePositions[func?.id]?.output;
        }
      });

      const inputNodePosition = calculateElementCoordinates(
        inputNodeSVGRef.current
      );
      const outputNodePosition = calculateElementCoordinates(
        outputNodeSVGRef.current
      );

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
    },
    [functions]
  );

  const calc = useCallback(() => {
    const functionCardsSVGNodesPositions: Record<
      number,
      ConnectionNodePositions
    > = {};

    functionCardRefs.current?.keys().forEach((functionCardNodeKey) => {
      const [_id, elementType] = functionCardNodeKey?.split(".");
      const id = Number(_id);

      if (!functionCardsSVGNodesPositions[id]) {
        functionCardsSVGNodesPositions[id] = {};
      }

      functionCardsSVGNodesPositions[id][elementType] =
        calculateElementCoordinates(
          functionCardRefs.current?.get(functionCardNodeKey)
        );
    });

    console.log(
      "🚀 ~ calc ~ functionCardsSVGNodesPositions:",
      functionCardsSVGNodesPositions
    );

    const connections = getFunctionBoxConnections(
      functionCardsSVGNodesPositions
    );

    setConnections(connections);
  }, [getFunctionBoxConnections]);

  const [error, setError] = useState("");
  const [initialValue, setInitialValue] = useState(2);
  const [finalOutput, setFinalOutput] = useState(45);

  // const [connectionNodePositions, setConnectionNodePositions] = useState<
  //   Record<number, ConnectionNodePositions>
  // >({});

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

  // const handleFunctionBoxConnectionNodePositions = useCallback(
  //   (id: number, positions: ConnectionNodePositions) => {
  //     setConnectionNodePositions((prev) => ({
  //       ...prev,
  //       [id]: positions,
  //     }));
  //   },
  //   []
  // );

  // Use useEffect to get the position of the input and output nodes
  useEffect(() => {
    const fn = () => startTransition(calc);
    // Add event listener to update position on window resize
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, [calc]);

  useEffect(() => {
    calculateResult();
    const fn = () => startTransition(calc);
    fn();
  }, [initialValue, functions, calculateResult, calc]);

  return {
    isPending,
    functions,
    functionCardRefs,
    error,
    initialValue,
    setInitialValue,
    finalOutput,
    setFinalOutput,
    handleEquationChange,
    handleNextFunctionChange,
    // handleFunctionBoxConnectionNodePositions,
    getFunctionBoxConnections,
    inputNodeSVGRef,
    outputNodeSVGRef,
    connections,
    setConnections,
  };
};

export default useFunctionFlow;
