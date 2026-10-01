import type { ComponentType } from "react";

import { useGlobalState } from "~/context/global-state";
import type { Visual } from "~/types";

import { BirdView } from "./bird-view/bird-view";
import { DNA } from "./dna/dna";
import { FamilyTree } from "./family-tree/family-tree";
import { NeuralNet } from "./neural-net/neural-net";
import { VisualNavigation } from "./visual-navigation";

const pages: { page: Visual; Component: ComponentType }[] = [
  { page: "nn", Component: NeuralNet },
  { page: "bird", Component: BirdView },
  { page: "family", Component: FamilyTree },
  { page: "dna", Component: DNA },
];

const Visuals = () => {
  const { setVisual, globalSimulationState, activePage, visual } =
    useGlobalState();

  return (
    <div
      className="visuals"
      style={{
        height: visual === "" ? 0 : "100vh",
        visibility: activePage === "simulation" ? "visible" : "hidden",
        zIndex: globalSimulationState === "Offline" ? 3 : 2,
      }}
    >
      <VisualNavigation changePage={setVisual} state={globalSimulationState} />
      <div
        className="visualShade"
        style={{ display: visual === "" ? "none" : "" }}
      />
      <div
        className="visualPages"
        style={{ display: visual === "" ? "none" : "" }}
      >
        {pages.map(({ page, Component }) => (
          <div
            key={page}
            style={{ display: visual === page ? "" : "none" }}
            className="visualPage"
          >
            <Component />
          </div>
        ))}
      </div>
    </div>
  );
};

export { Visuals };
