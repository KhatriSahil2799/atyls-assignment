export type FunctionCard = {
  id: number;
  equation: string;
  nextFunction: string;
};

export type Coordinate = {
  x: number;
  y: number;
};

export type ConnectionNodePositions = {
  input: Coordinate;
  output: Coordinate;
};

export type NodeConnection = {
  start: Coordinate;
  end: Coordinate;
};
