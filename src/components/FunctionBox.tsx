import { RefObject } from "react";
import SvgChainNode from "./SvgChainNode";
import { ConnectionNodePositions } from "@/types";

type Props = {
  id: number;
  equation: string;
  onEquationChange: (id: number, newEquation: string) => void;
  nextFunction: string;
  onNextFunctionChange: (id: number, nextFunction: string) => void;
  functionOptions: Array<string>;
  onPositionChange: (id: number, positions: ConnectionNodePositions) => void;
  functionCardRefs: RefObject<Map<string, SVGSVGElement | null>>;
};

const FunctionBox = ({
  id,
  equation,
  onEquationChange,
  nextFunction,
  onNextFunctionChange,
  functionOptions,
  functionCardRefs,
}: Props) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-64 border-2 border-[#DFDFDF]">
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
          onChange={(e) => onEquationChange(id, e.target.value)}
          className="w-full px-3 py-2 border border-[#D3D3D3] text-[#252525] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Next function
        </label>
        <select
          value={nextFunction}
          onChange={(e) => onNextFunctionChange(id, e.target.value)}
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
          <SvgChainNode
            nodeRef={(ref) => {
              functionCardRefs.current.set(`${id}.input`, ref);
            }}
          />
          <span className="text-sm text-gray-600 ml-1 text-[10px]">input</span>
        </div>
        <div className="flex items-center">
          <span className="text-sm text-gray-600 mr-1 text-[10px]">output</span>
          <SvgChainNode
            nodeRef={(ref) => {
              functionCardRefs.current.set(`${id}.output`, ref);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default FunctionBox;
