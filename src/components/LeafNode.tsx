import React, { ChangeEventHandler, RefObject } from "react";
import SvgChainNode from "./SvgChainNode"; // assuming this is imported from a separate file
import { ConnectionNodePositions } from "@/types";

type Props = {
  label: string;
  value: number;
  type: "input" | "output";
  onChange?: ChangeEventHandler<HTMLInputElement>;
  nodeRef: RefObject<SVGSVGElement | null>;
  onPositionChange: (id: number, positions: ConnectionNodePositions) => void;
};

const LeafNode = ({ label, value, onChange, type, nodeRef }: Props) => {
  const isInputType = type === "input";

  return (
    <div className="p-4 mr-4 min-w-28">
      <div
        className={`text-white rounded-xl ${
          isInputType ? "bg-[#E29A2D]" : "bg-[#4CAF79]"
        } text-xs font-semibold mb-2 px-2 py-1`}
      >
        {label}
      </div>
      {isInputType ? (
        <div className="pl-2 flex flex-row border-2 border-[#FFC267] bg-white  rounded-2xl px-3 justify-center items-center overflow-hidden">
          <input
            type="number"
            value={value}
            onChange={onChange}
            className="text-lg text-black w-7 mr-2  focus:outline-none "
          />
          <div className="px-2.5 justify-center items-center py-2 border-l border-[#FFEED5] ">
            <SvgChainNode nodeRef={nodeRef} />
          </div>
        </div>
      ) : (
        <div className="flex border-2 border-[#2DD179] bg-white rounded-2xl pr-3 items-center justify-between">
          <div className="px-2.5 justify-center items-center  py-2 mr-3 border-r border-[#2DD179]">
            <SvgChainNode nodeRef={nodeRef} />
          </div>
          <div className="text-lg text-black font-semibold ">{value}</div>
        </div>
      )}
    </div>
  );
};

export default LeafNode;
