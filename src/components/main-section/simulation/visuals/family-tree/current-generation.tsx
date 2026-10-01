import type { GenerationBird } from "~/types";

type CurrentGenerationProps = {
  currentGeneration: GenerationBird[];
  createFamilyTree: (bird: GenerationBird) => void;
};

const CurrentGeneration = ({
  currentGeneration,
  createFamilyTree,
}: CurrentGenerationProps) => (
  <div
    className="currentGen"
    style={{
      visibility: currentGeneration.length === 0 ? "hidden" : "visible",
    }}
  >
    <h3 className="genHeader currentGenHeader">Current Gen</h3>
    {currentGeneration.map((bird) => (
      <button
        type="button"
        key={bird.birdID}
        onClick={() => createFamilyTree(bird)}
      >
        <p>{bird.birdID}</p>
      </button>
    ))}
  </div>
);

export { CurrentGeneration };
