import { useState } from "react";

import { useGlobalState } from "~/context/global-state";
import type { SimulationState } from "~/types";

import { AdditionalOptions } from "./additional-options";
import { ManualPlay } from "./manual-play";
import { SetupOptions } from "./setup-options";
import { SimulationButtons } from "./simulation-buttons";
import { SimulationControl } from "./simulation-control";

type OptionsProps = {
  state: SimulationState;
  startSimulation: () => void;
  pauseSimulation: () => void;
  resetSimulation: () => void;
  startPlaySimulation: () => void;
  stopPlaySimulation: () => void;
};

const Options = ({
  state,
  startSimulation,
  pauseSimulation,
  resetSimulation,
  startPlaySimulation,
  stopPlaySimulation,
}: OptionsProps) => {
  const { activePage } = useGlobalState();
  const [optionsOpen, setOptionsOpen] = useState(false);
  // Any simulation state change closes the panel.
  const [previousState, setPreviousState] = useState(state);
  if (previousState !== state) {
    setPreviousState(state);
    setOptionsOpen(false);
  }

  const openOptions = () => {
    setOptionsOpen(!optionsOpen);
  };

  return (
    <div
      className="options"
      style={{
        marginTop:
          activePage === "simulation" || activePage === "playMode" ? 0 : 200,
      }}
    >
      <div className="simulationControl">
        <SimulationButtons
          state={state}
          startSimulation={startSimulation}
          pauseSimulation={pauseSimulation}
          resetSimulation={resetSimulation}
        />
        <SimulationControl state={state} />
      </div>
      <SetupOptions openOptions={openOptions} state={state} />
      <AdditionalOptions optionsOpen={optionsOpen} state={state} />
      <ManualPlay
        startPlaySimulation={startPlaySimulation}
        stopPlaySimulation={stopPlaySimulation}
        state={state}
      />
    </div>
  );
};

export { Options };
