import { createContext, use, useReducer } from "react";
import type { ReactNode } from "react";

import type { ActivePage, NeuronRect, SimulationState, Visual } from "~/types";
import { assertNever } from "~/utils/assert-never";

type GlobalState = {
  globalSimulationState: SimulationState;
  visual: Visual;
  nnCoordinates: NeuronRect[];
  activePage: ActivePage;
};

type GlobalAction =
  | { type: "SET_GLOBAL_SIMULATION_STATE"; data: SimulationState }
  | { type: "SET_VISUAL"; data: Visual }
  | { type: "UPDATE_NN_COORDINATES"; data: NeuronRect[] }
  | { type: "SET_ACTIVE_PAGE"; data: ActivePage };

type GlobalContextValue = GlobalState & {
  setGlobalSimulationState: (state: SimulationState) => void;
  setVisual: (page: Visual) => void;
  updateNNCoordinates: (coordinates: NeuronRect[]) => void;
  setActivePage: (page: ActivePage) => void;
};

const initialState: GlobalState = {
  globalSimulationState: "Offline",
  visual: "nn",
  nnCoordinates: [],
  activePage: "landing",
};

const globalReducer = (
  state: GlobalState,
  action: GlobalAction
): GlobalState => {
  switch (action.type) {
    case "SET_GLOBAL_SIMULATION_STATE": {
      return { ...state, globalSimulationState: action.data };
    }
    case "SET_VISUAL": {
      return { ...state, visual: action.data };
    }
    case "UPDATE_NN_COORDINATES": {
      return { ...state, nnCoordinates: action.data };
    }
    // Every page starts with the simulation stopped.
    case "SET_ACTIVE_PAGE": {
      return {
        ...state,
        activePage: action.data,
        globalSimulationState: "Offline",
      };
    }
    default: {
      return assertNever(action);
    }
  }
};

const GlobalContext = createContext<GlobalContextValue | null>(null);

const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  const setGlobalSimulationState = (simulationState: SimulationState) => {
    dispatch({ type: "SET_GLOBAL_SIMULATION_STATE", data: simulationState });
  };

  const setVisual = (page: Visual) => {
    dispatch({ type: "SET_VISUAL", data: page });
  };

  const updateNNCoordinates = (coordinates: NeuronRect[]) => {
    if (coordinates.length !== state.nnCoordinates.length) {
      dispatch({ type: "UPDATE_NN_COORDINATES", data: coordinates });
    }
  };

  const setActivePage = (page: ActivePage) => {
    if (window.innerWidth < 1500) {
      setVisual("");
    }
    if (page !== state.activePage) {
      dispatch({ type: "SET_ACTIVE_PAGE", data: page });
    }
  };

  return (
    <GlobalContext
      value={{
        ...state,
        setGlobalSimulationState,
        setVisual,
        updateNNCoordinates,
        setActivePage,
      }}
    >
      {children}
    </GlobalContext>
  );
};

const useGlobalState = () => {
  const value = use(GlobalContext);
  if (value === null) {
    throw new Error("useGlobalState must be used inside GlobalProvider");
  }
  return value;
};

export { GlobalProvider, globalReducer, useGlobalState };
