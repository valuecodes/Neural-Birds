import { describe, expect, it, vi } from "vitest";

import type { SimulationOptions } from "~/types";

import { advanceEvolution, createBirds, createRunData } from "./game";

const options: SimulationOptions = {
  closingRate: 5000,
  gapWidth: 120,
  hardness: 20,
  population: 4,
  speed: 1,
  pipeRate: 140,
  choiceRate: 55,
  poolSize: 10,
  mutateRate: 10,
  selectionPower: 1,
  recreateRate: 100,
  neuralNetwork: [
    { type: "Input", neuralsCount: 5, id: 0, neurals: [] },
    { type: "Hidden", neuralsCount: 8, id: 1, neurals: [] },
    { type: "Output", neuralsCount: 2, id: 2, neurals: [] },
  ],
};

// A run whose gap is closed, so every bird dies at the first pipe at the
// latest.
const createDoomedRun = () => {
  const run = createRunData(0);
  run.birds = createBirds(options);
  return run;
};

describe("advanceEvolution", () => {
  it("breeds a new generation once every bird has died", () => {
    const run = createDoomedRun();
    const onGeneration = vi.fn();
    for (let frame = 0; frame < 1000 && run.generation === 1; frame++) {
      advanceEvolution(run, { options, speed: 1, onInOut: null, onGeneration });
    }

    expect(run.generation).toBe(2);
    expect(run.birds).toHaveLength(options.population);
    expect(run.deadBirds).toHaveLength(0);
    expect(run.roundScore).toHaveLength(1);
    expect(run.gapWidth).toBe(options.gapWidth);
    expect(run.generationData.currentGeneration).toHaveLength(
      options.population
    );
    expect(onGeneration).toHaveBeenCalledOnce();
  });

  it("reports the leading bird's inputs and jump only below 5x speed", () => {
    const onInOut = vi.fn();
    const hooks = { options, onInOut, onGeneration: vi.fn() };

    const slow = advanceEvolution(createDoomedRun(), { ...hooks, speed: 1 });

    expect(slow).toHaveLength(6);
    expect(onInOut).toHaveBeenCalledWith(slow);

    onInOut.mockClear();
    const fast = advanceEvolution(createDoomedRun(), { ...hooks, speed: 5 });

    expect(fast).toBeNull();
    expect(onInOut).not.toHaveBeenCalled();
  });
});
