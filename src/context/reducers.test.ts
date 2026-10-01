import { describe, expect, it } from "vitest";

import type { BirdInOut } from "~/types";

import { generationalReducer } from "./global-generational";
import { inOutReducer } from "./global-in-out";
import { globalReducer } from "./global-state";

describe("globalReducer", () => {
  it("stops the simulation when the page changes", () => {
    const state = globalReducer(
      {
        globalSimulationState: "Online",
        visual: "nn",
        nnCoordinates: [],
        activePage: "simulation",
      },
      { type: "SET_ACTIVE_PAGE", data: "playMode" }
    );

    expect(state.activePage).toBe("playMode");
    expect(state.globalSimulationState).toBe("Offline");
  });
});

describe("generationalReducer", () => {
  it("clears the data and starts a new run on reset", () => {
    const filled = generationalReducer(
      {
        runId: 3,
        generationalData: {
          roundScores: [],
          totalRoundScores: [],
          dna: [],
          generationData: { oldGenerations: [], currentGeneration: [] },
        },
      },
      {
        type: "SET_GENERATIONAL_DATA",
        roundScores: [10],
        totalRoundScores: [40],
        dna: [[1]],
        generation: {
          oldGenerations: [[]],
          currentGeneration: [
            { birdID: "0.2", parent1: "1.1", parent2: "0.1" },
          ],
        },
      }
    );

    expect(filled.generationalData.roundScores).toStrictEqual([10]);

    const reset = generationalReducer(filled, {
      type: "RESET_GENERATIONAL_DATA",
    });

    expect(reset.runId).toBe(4);
    expect(reset.generationalData.roundScores).toStrictEqual([]);
    expect(
      reset.generationalData.generationData.currentGeneration
    ).toStrictEqual([]);
  });
});

const row = (value: number): BirdInOut => [value, 0, 0, 0, 0, 0];

describe("inOutReducer", () => {
  it("keeps the newest 36 rows, newest first", () => {
    let state: { inOutData: BirdInOut[] } = { inOutData: [] };
    for (let i = 0; i < 40; i++) {
      state = inOutReducer(state, { type: "SET_IN_OUT_DATA", data: row(i) });
    }

    expect(state.inOutData).toHaveLength(36);
    expect(state.inOutData[0]?.[0]).toBe(39);
    expect(state.inOutData.at(-1)?.[0]).toBe(4);
  });
});
