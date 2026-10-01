import { useMemo, useState } from "react";

import { VisualHeader } from "~/components/main-section/simulation/visuals/visual-header";
import { useGlobalGenerational } from "~/context/global-generational";
import type { GenerationBird } from "~/types";

import { CurrentGeneration } from "./current-generation";
import { FamilyVisualInfo } from "./family-visual-info";
import { Generation } from "./generation";
import { GenerationOptions } from "./generation-options";
import type { TreeSettings, TreeToggle, TreeValue } from "./tree-settings";

type Selection = { runId: number; parents1: string[]; parents2: string[] };

const NO_SELECTION = { parents1: [], parents2: [] };

// Walks up the ancestry of `bird`, listing every first and second parent id.
const collectParents = (
  bird: GenerationBird,
  byId: Map<string, GenerationBird>
) => {
  const parents1: string[] = [];
  const parents2: string[] = [];
  const visited = new Set<string>();
  const visit = (node: GenerationBird) => {
    const parent1 = byId.get(node.parent1);
    const parent2 = byId.get(node.parent2);
    parents1.push(node.parent1);
    parents2.push(node.parent2);
    if (visited.has(node.parent1) || visited.has(node.parent2)) {
      return;
    }
    if (parent1 !== undefined) {
      visit(parent1);
      visited.add(node.parent1);
    }
    if (parent2 !== undefined) {
      visit(parent2);
      visited.add(node.parent2);
    }
  };
  visit(bird);
  return { parents1, parents2 };
};

const FamilyTree = () => {
  const { generationalData, runId } = useGlobalGenerational();
  const { oldGenerations, currentGeneration } = generationalData.generationData;
  const [settings, setSettings] = useState<TreeSettings>({
    optionsOpen: false,
    treeGraph: false,
    colors: false,
    selectedValue: "birdID",
  });
  const [selection, setSelection] = useState<Selection>({
    runId,
    ...NO_SELECTION,
  });

  // The oldest entry is the empty placeholder from the first generation.
  const oldGenData = oldGenerations.slice(0, -1);
  const byId = useMemo(
    () => new Map(oldGenerations.flat().map((bird) => [bird.birdID, bird])),
    [oldGenerations]
  );
  // A reset starts a new run, so selections from the old one no longer apply.
  const selected =
    selection.runId === runId && oldGenData.length > 0
      ? selection
      : NO_SELECTION;

  const createFamilyTree = (bird: GenerationBird) => {
    setSelection({ runId, ...collectParents(bird, byId) });
  };

  const changeSettings = (option: TreeToggle) => {
    setSettings({ ...settings, [option]: !settings[option] });
  };

  const changeSettingsValue = (value: TreeValue) => {
    setSettings({ ...settings, selectedValue: value });
  };

  return (
    <div className="familyTree">
      <VisualHeader
        header="Family Tree"
        changeSettings={() => changeSettings("optionsOpen")}
      />
      <GenerationOptions
        changeSettings={changeSettings}
        changeSettingsValue={changeSettingsValue}
        settings={settings}
        hasSelection={selected.parents1.length > 0}
      />
      <FamilyVisualInfo text="Run simulation and select bird from Current Gen" />
      <div
        className="generationContainer"
        style={{ maxHeight: settings.optionsOpen ? 400 : 500 }}
      >
        {oldGenData.map((oldGen, index) => (
          <Generation
            // Generations are listed newest first and never reordered.
            key={oldGenData.length - index}
            oldGenData={oldGen}
            settings={settings}
            selectedParents1={selected.parents1}
            selectedParents2={selected.parents2}
          />
        ))}
      </div>
      <CurrentGeneration
        currentGeneration={currentGeneration}
        createFamilyTree={createFamilyTree}
      />
    </div>
  );
};

export { FamilyTree };
