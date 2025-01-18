import React, { ChangeEventHandler, RefObject } from "react";
import SvgChainNode from "./SvgChainNode"; // assuming this is imported from a separate file
import { ConnectionNodePositions } from "@/types";

type Props = {
  label: string;
  value: number;
  type: "input" | "output";
  onChange?: ChangeEventHandler<HTMLInputElement>;
  nodeRef: RefObject<SVGSVGElement | null>
  onPositionChange:(id: number, positions: ConnectionNodePositions) => void
};

const LeafNode = ({ label, value, onChange, type, nodeRef }: Props) => {
  const isInputType = type === "input";

  return (
    <div className="place-items-center p-4 mr-4">
      <div
        className={`text-white rounded-xl ${
          isInputType ? "bg-[#E29A2D]" : "bg-[#4CAF79]"
        } text-xs font-semibold mb-2 px-2 py-1`}
      >
        {label}
      </div>
      {isInputType ? (
        <div className="flex flex-row border-2 border-[#FFC267] bg-white rounded-2xl w-24 px-3 py-2 place-items-center ">
          <input
            type="number"
            value={value}
            onChange={onChange}
            className="focus:outline-none text-lg text-black inline w-10 mr-2"
          />
          <SvgChainNode nodeRef={nodeRef} />
        </div>
      ) : (
        <div className="flex flex-row border-2 border-[#2DD179] bg-white rounded-2xl px-3 place-items-center ">
          <SvgChainNode nodeRef={nodeRef} />
          <div className="text-lg text-black font-semibold ml-2 text-right border-l border-[#2DD179] pl-2 py-2">
            {value}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeafNode;
