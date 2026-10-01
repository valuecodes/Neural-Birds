import { useGlobalState } from "~/context/global-state";
import type { SimulationState, Visual } from "~/types";

type VisualNavigationProps = {
  state: SimulationState;
  changePage: (page: Visual) => void;
};

const VisualNavigation = ({ state, changePage }: VisualNavigationProps) => {
  const { activePage } = useGlobalState();
  const narrow = window.innerWidth < 1100;

  return (
    <div
      className="visualNavigation"
      style={{
        marginTop: activePage === "simulation" ? 50 : 0,
        visibility: activePage === "simulation" ? "visible" : "hidden",
      }}
    >
      <button
        type="button"
        onClick={() => changePage("")}
        style={{ display: narrow ? "" : "none" }}
      >
        Simulation
      </button>
      <button type="button" onClick={() => changePage("nn")}>
        Neural Network
      </button>
      <button type="button" onClick={() => changePage("bird")}>
        Bird View
      </button>
      <button
        type="button"
        onClick={() => changePage("family")}
        style={{ display: narrow ? "none" : "" }}
      >
        Family tree
      </button>
      <button type="button" onClick={() => changePage("dna")}>
        DNA
      </button>
      <button
        type="button"
        onClick={() => changePage("charts")}
        style={{ display: narrow && state !== "Offline" ? "" : "none" }}
      >
        Charts
      </button>
    </div>
  );
};

export { VisualNavigation };
