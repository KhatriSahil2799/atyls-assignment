import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import SvgChainNode from "./SvgChainNode";
import FunctionBox from "./FunctionBox";
import CurvedConnector from "./CurvedConnector";

const FunctionFlow = () => {
    const [functions, setFunctions] = useState([
      { id: 1, equation: "x^2", nextFunction: "2" },
      { id: 2, equation: "2x+4", nextFunction: "4" },
      { id: 3, equation: "x^2+20", nextFunction: "" },
      { id: 4, equation: "x-2", nextFunction: "5" },
      { id: 5, equation: "x/2", nextFunction: "3" },
    ]);
  
    const [initialValue, setInitialValue] = useState("2");
    const [finalOutput, setFinalOutput] = useState("120");
    const [error, setError] = useState("");
  
    const [positions, setPositions] = useState<
      Record<
        number,
        {
          input: {
            x: number;
            y: number;
          };
          output: {
            x: number;
            y: number;
          };
        }
      >
    >({});
  
    const calculateResult = () => {
      try {
        let currentValue = parseFloat(initialValue);
        let currentFunctionId = "1";
        const visited = new Set();
  
        while (currentFunctionId) {
          if (visited.has(currentFunctionId)) {
            throw new Error("Circular reference detected");
          }
          visited.add(currentFunctionId);
  
          const currentFunction = functions.find(
            (f) => f.id.toString() === currentFunctionId
          );
          if (!currentFunction) break;
  
          console.log(
            "🚀 ~ calculateResult ~ currentFunction.equation:",
            currentFunction.equation
          );
          // Simple equation evaluation - in production, use a proper math parser
          const equation = currentFunction.equation
            .replaceAll(/(\d+)(x)/g, "$1*$2")
            .replaceAll("^", "**")
            .replaceAll(/\s+/g, "")
            .replaceAll("x", currentValue);
          console.log("🚀 ~ calculateResult ~ equation:", equation);
          currentValue = eval(equation);
          console.log("🚀 ~ calculateResult ~ currentValue:", currentValue);
          currentFunctionId = currentFunction.nextFunction;
        }
  
        setFinalOutput(currentValue.toFixed(2));
        setError("");
      } catch (err) {
        setError(err.message);
      }
    };
  
    useEffect(() => {
      calculateResult();
    }, [initialValue, functions]);
  
    const handleEquationChange = (id, newEquation) => {
      setFunctions((prev) =>
        prev.map((f) => (f.id === id ? { ...f, equation: newEquation } : f))
      );
    };
  
    const handleNextFunctionChange = (id, nextFunction) => {
      setFunctions((prev) =>
        prev.map((f) => (f.id === id ? { ...f, nextFunction } : f))
      );
    };
  
    const handlePositionChange = (
      id: number,
      position: {
        input: {
          x: number;
          y: number;
        };
        output: {
          x: number;
          y: number;
        };
      }
    ) => {
      setPositions((prev) => ({
        ...prev,
        [id]: position,
      }));
    };
  
    const getConnections = () => {
      const connections = [];
      functions.forEach((func) => {
        if (
          func.nextFunction &&
          positions[func.id] &&
          positions[func.nextFunction]
        ) {
          connections.push({
            start: positions[func.id].output,
            end: positions[func.nextFunction].input,
          });
        }
      });
      return connections;
    };
  
    const finalNodeSVGRef = useRef<SVGSVGElement>(undefined);
  
    return (
      <div className="p-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        )}
  
        <div className="flex items-center mb-8">
          <div className="place-items-center p-4 mr-4">
            <div className="text-white rounded-xl bg-[#E29A2D] text-xs font-semibold mb-2 px-2 py-1">
              Initial value of x
            </div>
            <div className="flex flex-row border-2 border-[#FFC267] bg-white rounded-2xl w-24 px-3 py-2 place-items-center ">
              <input
                type="number"
                value={initialValue}
                onChange={(e) => setInitialValue(e.target.value)}
                className="focus:outline-none text-lg text-black inline w-10 mr-2"
              />
              <SvgChainNode />
            </div>
          </div>
  
          <div className="flex flex-wrap gap-10">
            {functions.map((func) => (
              <FunctionBox
                // boxRef = {(ref)=>{
                //   map.set(func.id, ref)
                // }}
                key={func.id}
                id={func.id}
                equation={func.equation}
                nextFunction={func.nextFunction}
                onEquationChange={(newEquation) =>
                  handleEquationChange(func.id, newEquation)
                }
                onNextFunctionChange={(nextFunc) =>
                  handleNextFunctionChange(func.id, nextFunc)
                }
                functionOptions={functions
                  .filter((f) => f.id !== func.id)
                  .map((f) => f.id.toString())}
                onPositionChange={handlePositionChange}
              />
            ))}
          </div>
  
          <div className="place-items-center p-4 mr-4">
            <div className="text-white rounded-xl bg-[#4CAF79] text-xs font-semibold mb-2 px-2 py-1">
              Final Output y
            </div>
            <div className="flex flex-row border-2 border-[#2DD179] bg-white rounded-2xl px-3 place-items-center ">
              <SvgChainNode nodeRef={finalNodeSVGRef} />
              <div className="text-lg text-black font-semibold ml-2 text-right border-l border-[#2DD179] pl-2 py-2">
                {parseInt(finalOutput)}
              </div>
            </div>
          </div>
        </div>
  
        {getConnections().map((connection, index) => {
          return (
            <CurvedConnector
              key={index}
              startPoint={connection.start}
              endPoint={connection.end}
              // curvature={0.3}
            />
          );
        })}
      </div>
    );
  };

  export default FunctionFlow