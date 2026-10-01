import type { GenerationBird } from "~/types";

import type { TreeSettings, TreeValue } from "./tree-settings";

type GenerationProps = {
  oldGenData: GenerationBird[];
  settings: TreeSettings;
  selectedParents1: string[];
  selectedParents2: string[];
};

// Red to green by score, saturating at 5000 points.
const scoreColor = (score: number) => {
  const percent = Math.min((score / 5000) * 100, 100);
  const r =
    percent < 50 ? 255 : Math.floor(255 - ((percent * 2 - 100) * 255) / 100);
  const g = percent > 50 ? 255 : Math.floor((percent * 2 * 255) / 100);
  return `rgba(${r},${g},0,0.5)`;
};

const formatters: Record<TreeValue, (bird: GenerationBird) => string> = {
  birdID: (bird) => bird.birdID,
  fitness: (bird) => `${((bird.fitness ?? 0) * 100).toFixed(1)}%`,
  score: (bird) => `${((bird.score ?? 0) / 1000).toFixed(2)}k`,
};

const Generation = ({
  oldGenData,
  settings,
  selectedParents1,
  selectedParents2,
}: GenerationProps) => {
  const { treeGraph, colors, selectedValue } = settings;
  const isSelected = (id: string) =>
    selectedParents1.includes(id) || selectedParents2.includes(id);

  const backgroundColor = (id: string) => {
    if (selectedParents1.includes(id)) {
      return "white";
    }
    if (selectedParents2.includes(id)) {
      return "gray";
    }
    return "rgba(134, 180, 137,0.0)";
  };

  // In tree mode only the selected ancestors are shown, indented by count.
  const data = treeGraph
    ? oldGenData.filter((bird) => isSelected(bird.birdID))
    : oldGenData;
  const treeMargin = 220 - Math.min(data.length, 10) * 22;
  const generation = oldGenData[0]?.generation;

  return (
    <div className="generation">
      <h3 className="genHeader">
        Gen:{generation === undefined ? 0 : generation - 1}
      </h3>
      <div className="generationBirds">
        {data.map((bird) => (
          <div
            key={bird.birdID}
            className="oldgen"
            id={bird.birdID}
            style={{
              backgroundColor: colors
                ? scoreColor(bird.score ?? 0)
                : backgroundColor(bird.birdID),
              marginLeft: treeGraph ? treeMargin : 0,
            }}
          >
            <div>
              <p>{formatters[selectedValue](bird)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { Generation };
