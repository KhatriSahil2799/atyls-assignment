import { AlertCircle } from "lucide-react";
import FunctionBox from "./FunctionBox";
import CurvedConnector from "./CurvedConnector";
import useFunctionFlow from "@/hooks/useFunctionFlow";
import LeafNode from "./LeafNode";
import { useEffect, useRef } from "react";

const FunctionFlow = () => {
  const {
    functionCardRefs, 
    inputNodeSVGRef,
    outputNodeSVGRef,
    error,
    isPending,

    initialValue,
    setInitialValue,
    finalOutput,
    functions,
    handleEquationChange,
    handleNextFunctionChange,
    // handleFunctionBoxConnectionNodePositions, 
     connections
  } = useFunctionFlow();
    console.log("🚀 ~ FunctionFlow ~ functionCardRefs:", functionCardRefs)

  const ref = useRef(null);

  // useEffect(() => {
  //   const updatePositions = () => {
  //     const boxes = containerRef.current.querySelectorAll('[ref="boxRef"]');
  //     boxes.forEach((box) => {
  //       const id = box.dataset.id;
  //       const rect = box.getBoundingClientRect();
  //       handlePositionChange(parseInt(id), {
  //         input: {
  //           x: rect.left,
  //           y: rect.top + rect.height / 2,
  //         },
  //         output: {
  //           x: rect.right,
  //           y: rect.top + rect.height / 2,
  //         },
  //       });
  //     });
  //   };

  //   const observer = new ResizeObserver(updatePositions);
  //   if (containerRef.current) {
  //     observer.observe(containerRef.current);
  //   }

  //   window.addEventListener("resize", updatePositions);
  //   return () => {
  //     observer.disconnect();
  //     window.removeEventListener("resize", updatePositions);
  //   };
  // }, []);

  return (
    <div className="py-24 px-16 justify-center">
      {error && (
        <div className=" absolute top-10 right-10 p-4 bg-red-50 border border-red-200 rounded-md flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      <div className="flex justify-center items-center">
        <LeafNode
          type="input"
          value={initialValue}
          nodeRef={inputNodeSVGRef}
          label="Initial value of x"
          onChange={(e) => setInitialValue(Number(e.target.value))}
         />

        <div className="flex flex-wrap justify-center gap-20">
          {functions.map((func) => (
            <FunctionBox
            functionCardRefs={functionCardRefs}
              key={func.id}
              id={func.id}
              equation={func.equation}
              nextFunction={func.nextFunction}
              onEquationChange={handleEquationChange}
              onNextFunctionChange={handleNextFunctionChange}
              functionOptions={functions
                .filter((f) => f.id !== func.id)
                .map((f) => f.id.toString())}
              // onPositionChange={handleFunctionBoxConnectionNodePositions}
            />
          ))}
        </div>

        <LeafNode
          type="output"
          label="Final Output y"
          value={finalOutput}
          nodeRef={outputNodeSVGRef}
        />
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {!isPending && connections.map((connection, index) => {
            return (
              <CurvedConnector
                key={index}
                startPoint={connection.start}
                endPoint={connection.end}
                // curvature={0.3}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default FunctionFlow;
