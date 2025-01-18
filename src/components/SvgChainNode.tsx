import { Ref } from "react";

export const SvgChainNode = ({ nodeRef }: { nodeRef?: Ref<SVGSVGElement> }) => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" ref={nodeRef}>
    <circle
      cx="7.5"
      cy="7.5"
      r="6.5"
      fill="white"
      stroke={"#DBDBDB"}
      strokeWidth="2"
    />
    <circle cx="7.5" cy="7.5" r="3.5" fill={"#0066FF"} />
  </svg>
);

export default SvgChainNode;
