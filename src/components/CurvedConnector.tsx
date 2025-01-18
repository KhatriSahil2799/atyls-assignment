import { CURVE_TRESHOLD } from "@/utils/constants";

const CurvedConnector = ({
  startPoint,
  endPoint,
  curvature = 0.3,
  strokeWidth = 7,
  color = "#0066FF4D",
}) => {
  // Calculate control points for the curved path
  const generatePath = () => {
    if (!startPoint || !endPoint) return "";

    // Calculate the midpoint
    const midX = (startPoint.x + endPoint.x) / 2;
    const midY = (startPoint.y + endPoint.y) / 2;

    // Calculate the distance between points
    // const dx = endPoint.x - startPoint.x;
    // const dy = endPoint.y - startPoint.y;

    // const offsetX = curvature * Math.abs(dy)
    // const offsetY = curvature * Math.abs(dx)

    // const  controlX = midX + offsetX
    // const controlY = midY + offsetY

    const distance = Math.sqrt(
      Math.pow(endPoint.x - startPoint.x, 2) +
        Math.pow(endPoint.y - startPoint.y, 2)
    );

    // Calculate the control points
    if (distance > CURVE_TRESHOLD) {
      // Split the path into two curves
      const firstMidX = (startPoint.x + midX) / 2;
      const firstMidY = (startPoint.y + midY) / 2;

      //  Calculate the distance between points
      const dx = midX - startPoint.x;
      const dy = midY - startPoint.y;

      const offsetX = curvature * Math.abs(dy);
      const offsetY = curvature * Math.abs(dx);

      const controlX = firstMidX + offsetX;
      const controlY = firstMidY + offsetY;

      return `M ${startPoint.x} ${startPoint.y} Q ${controlX} ${controlY} ${midX} ${midY} T ${endPoint.x} ${endPoint.y}`;
    }

    // Calculate the distance between points
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;

    const offsetX = curvature * Math.abs(dy);
    const offsetY = curvature * Math.abs(dx);

    const controlX = midX + offsetX;
    const controlY = midY + offsetY;

    // Generate the SVG path
    return `M ${startPoint.x} ${startPoint.y} Q ${controlX} ${controlY} ${endPoint.x} ${endPoint.y}`;
  };

  return (
    <svg
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ minWidth: "100%", minHeight: "100%" }}
    >
      <path
        d={generatePath()}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        className="transition-all duration-300 ease-in-out"
      />
      {/* Optional: Add dots at start and end points */}
      <circle
        cx={startPoint?.x}
        cy={startPoint?.y}
        r={4}
        fill={color}
        className="transition-all duration-300 ease-in-out"
      />
      <circle
        cx={endPoint?.x}
        cy={endPoint?.y}
        r={4}
        fill={color}
        className="transition-all duration-300 ease-in-out"
      />
    </svg>
  );
};

export default CurvedConnector;
