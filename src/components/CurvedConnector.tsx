import { Coordinate } from "@/types";
import { generateSVGPath } from "@/utils/helper";

type Props = {
  startPoint: Coordinate;
  endPoint: Coordinate;
  curvature?: number;
  strokeWidth?: number;
  color?: string;
};

const CurvedConnector = ({
  startPoint,
  endPoint,
  curvature = 0.3,
  strokeWidth = 7,
  color = "#0066FF4D",
}: Props) => {

  return (
    <svg
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ minWidth: "100%", minHeight: "100%" }}
    >
      <path
        d={generateSVGPath(startPoint, endPoint, curvature)}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        className="transition-all duration-300 ease-in-out"
      />
      
    </svg>
  );
};

export default CurvedConnector;
