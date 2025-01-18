import { FunctionCard } from "@/types";

export const CURVE_TRESHOLD = 400;

export const INITIAL_FUNCTION_FLOW: FunctionCard[] = [
    { id: 1, equation: "x^2", nextFunction: "2" },
    { id: 2, equation: "2x+4", nextFunction: "4" },
    { id: 3, equation: "x^2+20", nextFunction: "" },
    { id: 4, equation: "x-2", nextFunction: "5" },
    { id: 5, equation: "x/2", nextFunction: "3" },
  ];