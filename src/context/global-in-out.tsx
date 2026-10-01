import { createContext, use, useReducer } from "react";
import type { ReactNode } from "react";

import type { BirdInOut } from "~/types";

type InOutState = { inOutData: BirdInOut[] };

type InOutAction = { type: "SET_IN_OUT_DATA"; data: BirdInOut };

type InOutContextValue = InOutState & {
  setGlobalInOutData: (data: BirdInOut) => void;
};

// Newest first; older rows beyond this are dropped.
const MAX_ROWS = 36;

const inOutReducer = (state: InOutState, action: InOutAction): InOutState => ({
  ...state,
  inOutData: [action.data, ...state.inOutData.slice(0, MAX_ROWS - 1)],
});

const GlobalInOutContext = createContext<InOutContextValue | null>(null);

const GlobalInOutProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(inOutReducer, { inOutData: [] });

  const setGlobalInOutData = (data: BirdInOut) => {
    dispatch({ type: "SET_IN_OUT_DATA", data });
  };

  return (
    <GlobalInOutContext
      value={{ inOutData: state.inOutData, setGlobalInOutData }}
    >
      {children}
    </GlobalInOutContext>
  );
};

const useGlobalInOut = () => {
  const value = use(GlobalInOutContext);
  if (value === null) {
    throw new Error("useGlobalInOut must be used inside GlobalInOutProvider");
  }
  return value;
};

export { GlobalInOutProvider, inOutReducer, useGlobalInOut };
