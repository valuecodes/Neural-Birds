import { useGlobalState } from "~/context/global-state";
import type { SimulationState } from "~/types";

import { stateColor } from "./state-color";

type ManualPlayProps = {
  state: SimulationState;
  startPlaySimulation: () => void;
  stopPlaySimulation: () => void;
};

const ManualPlay = ({
  state,
  startPlaySimulation,
  stopPlaySimulation,
}: ManualPlayProps) => {
  const { activePage } = useGlobalState();

  return (
    <div
      className="manualPlay"
      style={{ visibility: activePage === "playMode" ? "visible" : "hidden" }}
    >
      <div className="manualInfo">
        <div className="simulationButtons">
          <button type="button" onClick={startPlaySimulation}>
            Start
          </button>
          <button type="button" onClick={stopPlaySimulation}>
            Reset
          </button>
        </div>
        <div className="simulationState manualState">
          <h3 className="statHeader">Click on the screen to jump</h3>
          <h1 style={{ color: stateColor(state) }}>{state}</h1>
        </div>
      </div>
    </div>
  );
};

export { ManualPlay };
