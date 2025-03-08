import { atomWithStorage } from "jotai/utils";

export const linkDistanceMultiplierAtom = atomWithStorage("linkDistanceMultiplier", 1);
export const repulsivityAtom = atomWithStorage("repulsivity", 300);
export const centeringStrengthAtom = atomWithStorage("centeringStrength", 0.5);
export const timePeriodAtom = atomWithStorage("timePeriod", 7);