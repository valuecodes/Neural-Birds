import { createContext, use, useReducer } from "react";
import type { ReactNode } from "react";

import type { GenerationalData, GenerationData } from "~/types";
import { assertNever } from "~/utils/assert-never";

type GenerationalState = {
  generationalData: GenerationalData;
  // Bumped on every reset, so views can drop selections from an earlier run.
  runId: number;
};

type GenerationalAction =
  | {
      type: "SET_GENERATIONAL_DATA";
      roundScores: number[];
      totalRoundScores: number[];
      dna: number[][];
      generation: GenerationData;
    }
  | { type: "RESET_GENERATIONAL_DATA" };

type GenerationalContextValue = GenerationalState & {
  setGenerationalData: (
    roundScores: number[],
    totalRoundScores: number[],
    dna: number[][],
    generation: GenerationData
  ) => void;
  resetGenerationalData: () => void;
};

const createInitialData = (): GenerationalData => ({
  roundScores: [],
  totalRoundScores: [],
  dna: [
    Array.from({ length: 22 }, () => 0),
    [0],
    Array.from({ length: 11 }, () => 0),
    Array.from({ length: 11 }, () => 0),
  ],
  generationData: { oldGenerations: [], currentGeneration: [] },
});

const generationalReducer = (
  state: GenerationalState,
  action: GenerationalAction
): GenerationalState => {
  switch (action.type) {
    case "SET_GENERATIONAL_DATA": {
      return {
        ...state,
        generationalData: {
          roundScores: action.roundScores,
          totalRoundScores: action.totalRoundScores,
          dna: action.dna,
          generationData: action.generation,
        },
      };
    }
    case "RESET_GENERATIONAL_DATA": {
      return { generationalData: createInitialData(), runId: state.runId + 1 };
    }
    default: {
      return assertNever(action);
    }
  }
};

const GlobalGenerationalContext =
  createContext<GenerationalContextValue | null>(null);

const GlobalGenerationalProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(generationalReducer, {
    generationalData: createInitialData(),
    runId: 0,
  });

  const setGenerationalData = (
    roundScores: number[],
    totalRoundScores: number[],
    dna: number[][],
    generation: GenerationData
  ) => {
    dispatch({
      type: "SET_GENERATIONAL_DATA",
      roundScores,
      totalRoundScores,
      dna,
      generation,
    });
  };

  const resetGenerationalData = () => {
    dispatch({ type: "RESET_GENERATIONAL_DATA" });
  };

  return (
    <GlobalGenerationalContext
      value={{ ...state, setGenerationalData, resetGenerationalData }}
    >
      {children}
    </GlobalGenerationalContext>
  );
};

const useGlobalGenerational = () => {
  const value = use(GlobalGenerationalContext);
  if (value === null) {
    throw new Error(
      "useGlobalGenerational must be used inside GlobalGenerationalProvider"
    );
  }
  return value;
};

export {
  GlobalGenerationalProvider,
  generationalReducer,
  useGlobalGenerational,
};
