import { createContext, use, useReducer } from "react";
import type { ReactNode } from "react";

import type { NetworkLayer, NumericOption, SimulationOptions } from "~/types";

type OptionsState = { options: SimulationOptions };

type OptionsAction = { type: "MODIFY_OPTIONS"; data: SimulationOptions };

type OptionsContextValue = OptionsState & {
  modifyOption: (optionName: NumericOption, value: number) => void;
  setNeuralNetwork: (neuralNetwork: NetworkLayer[]) => void;
};

const createNeurals = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: String(index + 1),
  }));

const initialOptions: OptionsState = {
  options: {
    closingRate: 5000,
    gapWidth: 120,
    hardness: 20,
    population: 10,
    speed: 1,
    pipeRate: 140,
    choiceRate: 55,
    poolSize: 10,
    mutateRate: 10,
    selectionPower: 1,
    recreateRate: 100,
    neuralNetwork: [
      { type: "Input", neuralsCount: 5, id: 0, neurals: createNeurals(5) },
      { type: "Hidden", neuralsCount: 8, id: 1, neurals: createNeurals(8) },
      { type: "Output", neuralsCount: 2, id: 2, neurals: createNeurals(2) },
    ],
  },
};

const optionsReducer = (
  state: OptionsState,
  action: OptionsAction
): OptionsState => ({ ...state, options: action.data });

const GlobalOptionsContext = createContext<OptionsContextValue | null>(null);

const GlobalOptionsProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(optionsReducer, initialOptions);

  const modifyOption = (optionName: NumericOption, value: number) => {
    dispatch({
      type: "MODIFY_OPTIONS",
      data: { ...state.options, [optionName]: value },
    });
  };

  const setNeuralNetwork = (neuralNetwork: NetworkLayer[]) => {
    dispatch({
      type: "MODIFY_OPTIONS",
      data: { ...state.options, neuralNetwork },
    });
  };

  return (
    <GlobalOptionsContext
      value={{ options: state.options, modifyOption, setNeuralNetwork }}
    >
      {children}
    </GlobalOptionsContext>
  );
};

const useGlobalOptions = () => {
  const value = use(GlobalOptionsContext);
  if (value === null) {
    throw new Error(
      "useGlobalOptions must be used inside GlobalOptionsProvider"
    );
  }
  return value;
};

export { GlobalOptionsProvider, useGlobalOptions };
