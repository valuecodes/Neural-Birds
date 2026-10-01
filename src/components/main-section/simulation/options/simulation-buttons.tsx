import type { SimulationState } from "~/types";

type SimulationButtonsProps = {
  state: SimulationState;
  startSimulation: () => void;
  pauseSimulation: () => void;
  resetSimulation: () => void;
};

const SimulationButtons = ({
  state,
  startSimulation,
  pauseSimulation,
  resetSimulation,
}: SimulationButtonsProps) => (
  <div className="simulationButtons">
    <button
      type="button"
      style={{ display: state === "Offline" ? "" : "none" }}
      onClick={startSimulation}
    >
      Start Simulation
    </button>
    <button
      type="button"
      style={{ display: state === "Offline" ? "none" : "" }}
      onClick={pauseSimulation}
    >
      {state === "Paused" ? "Continue" : "Pause"}
    </button>
    <button
      type="button"
      style={{ display: state === "Offline" ? "none" : "" }}
      onClick={resetSimulation}
    >
      Reset
    </button>
  </div>
);

export { SimulationButtons };
