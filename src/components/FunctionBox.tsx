import { useEffect, useRef } from "react";

const FunctionBox = ({
    id,
    equation,
    onEquationChange,
    nextFunction,
    onNextFunctionChange,
    functionOptions,
    onPositionChange,
  }) => {
    const inputNodeRef = useRef<SVGSVGElement>(null);
    const outputNodeRef = useRef<SVGSVGElement>(null);
  
    useEffect(() => {
      if (Boolean(inputNodeRef.current) && Boolean(outputNodeRef.current)) {
        const inputDot = inputNodeRef.current!.getBoundingClientRect();
        const outputDot = outputNodeRef.current!.getBoundingClientRect();
  
        onPositionChange(id, {
          input: {
            x: inputDot?.left + inputDot.width / 2,
            y: inputDot?.top + inputDot.height / 2,
          },
          output: {
            x: outputDot.left + outputDot.width / 2,
            y: outputDot.top + outputDot.height / 2,
          },
        });
      }
    }, [id, onPositionChange]);
  
    return (
      <div
        className="bg-white rounded-lg shadow-lg p-4 w-64 border-2 border-[#DFDFDF]"
        // ref={boxRef}
      >
        <div className="text-sm text-gray-500 font-semibold mb-4">
          Function: {id}
        </div>
  
        <div className="mb-4">
          <label className="block text-xs font-medium text-[#252525] mb-1">
            Equation
          </label>
          <input
            type="text"
            value={equation}
            onChange={(e) => onEquationChange(e.target.value)}
            className="w-full px-3 py-2 border border-[#D3D3D3] text-[#252525] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
  
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Next function
          </label>
          <select
            value={nextFunction}
            onChange={(e) => onNextFunctionChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-</option>
            {functionOptions.map((opt) => (
              <option key={opt} value={opt}>
                Function: {opt}
              </option>
            ))}
          </select>
        </div>
  
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <SvgChainNode nodeRef={inputNodeRef} />
            <span className="text-sm text-gray-600 ml-1 text-[10px]">input</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-1 text-[10px]">output</span>
            <SvgChainNode nodeRef={outputNodeRef} />
          </div>
        </div>
      </div>
    );
  };

  
  export default FunctionBox