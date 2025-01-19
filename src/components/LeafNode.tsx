import React, { ChangeEventHandler, RefObject } from "react";
import SvgChainNode from "./SvgChainNode"; // assuming this is imported from a separate file

type Props = {
  label: string;
  value: number;
  type: "input" | "output";
  onChange?: ChangeEventHandler<HTMLInputElement>;
  nodeRef: RefObject<SVGSVGElement | null>;
};

const LeafNode = ({ label, value, onChange, type, nodeRef }: Props) => {
  const isInputType = type === "input";

  return (
    <div className="min-w-28 max-w-32 p-2">
      <div
        className={`text-white rounded-xl ${
          isInputType ? "bg-[#E29A2D]" : "bg-[#4CAF79]"
        } text-xs font-medium px-2 py-0.5 mb-1.5 w-fit`}
      >
        {label}
      </div>
      {isInputType ? (
        <div className="flex items-center h-12 border-2 border-[#FFC267] bg-white rounded-2xl overflow-hidden">
          <div className="flex-grow pl-2">
            <input
              type="number"
              value={value}
              onChange={onChange}
              className="flex w-full text-xl font-medium text-black focus:outline-none"
            />
          </div>
          <div className="flex items-center justify-center h-full px-2 border-l border-[#FFEED5]">
            <SvgChainNode nodeRef={nodeRef} />
          </div>
        </div>
      ) : (
        <div className="flex items-center h-12 border-2 border-[#2DD179] bg-white rounded-2xl overflow-hidden">
          <div className="flex items-center justify-center h-full px-2 border-r border-[#2DD179]">
            <SvgChainNode nodeRef={nodeRef} />
          </div>

          <div className="flex-grow px-2">
            <div className="flex w-full justify-end">
              <span className="text-xl font-medium text-black">{value}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeafNode;
