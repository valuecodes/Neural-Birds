import type { SimulationState } from "~/types";

import { stateColor } from "./state-color";

const SimulationControl = ({ state }: { state: SimulationState }) => (
  <div className="simulationState">
    <h3 className="statHeader">Simulation</h3>
    <h1 style={{ color: stateColor(state) }}>{state}</h1>
  </div>
);

export { SimulationControl };
