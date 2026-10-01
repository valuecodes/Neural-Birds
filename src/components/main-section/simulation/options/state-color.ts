import type { SimulationState } from "~/types";

const stateColors: Record<SimulationState, string> = {
  Offline: "rgba(156, 68, 99,1)",
  Online: "rgba(100, 196, 126)",
  Paused: "rgba(182, 189, 94,1)",
};

const stateColor = (state: SimulationState) => stateColors[state];

export { stateColor };
