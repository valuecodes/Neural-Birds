import type {
  GenerationBird,
  GenerationData,
  SimulationOptions,
} from "~/types";

import { Bird } from "./animation/bird";

type Parent = { bird: Bird; index: number };

// Highest scoring bird seen so far. Every offspring is pulled towards it.
let alfa: Bird | null = null;

// Roulette selection: walks the pool until a bird wins against its fitness.
// Fitness values sum to 1 and every bird scores at least 1, so this ends.
const selectParent = (pool: Bird[]): Parent => {
  for (;;) {
    for (const [index, bird] of pool.entries()) {
      if (Math.random() < bird.fitness) {
        return { bird, index };
      }
    }
  }
};

const calculateFitness = (birds: Bird[], options: SimulationOptions) => {
  const { selectionPower, poolSize } = options;
  const pool = birds.slice(0, poolSize);
  let sum = 0;
  for (const bird of pool) {
    sum += bird.score ** selectionPower;
    if (alfa === null || bird.score >= alfa.score) {
      alfa = bird;
    }
  }
  for (const bird of pool) {
    bird.fitness = bird.score ** selectionPower / sum;
  }
  return { sum, birds: pool };
};

// Breeds the next generation from `birds` (all dead, sorted by id) and
// records who descended from whom for the family tree.
const nextGeneration = (
  birds: Bird[],
  options: SimulationOptions,
  generationData: GenerationData,
  currentRound: number,
  generation: number
) => {
  const { neuralNetwork, recreateRate, population } = options;
  const pool = calculateFitness(birds, options);
  const first = birds[0];
  const last = birds.at(-1);
  const currentAlfa = alfa;
  if (first === undefined || last === undefined || currentAlfa === null) {
    throw new Error("nextGeneration needs at least one bird");
  }
  const mutateRate = first.fitness >= 0.098 ? 0.99 : options.mutateRate;

  const createdBirds: Bird[] = [];
  const newGen: GenerationBird[] = [];
  for (let w = 0; w < population; w++) {
    const parentOne = selectParent(pool.birds);
    const parentTwo = selectParent(pool.birds);
    // Short rounds mean a bad generation: start over from a random brain.
    const brain = currentRound > recreateRate ? parentOne.bird.brain : null;
    const child = new Bird(neuralNetwork, brain, w);
    child.brain.shuffleGenes(parentTwo.bird.brain);
    child.brain.mutate(mutateRate, currentAlfa.brain);
    createdBirds.push(child);
    newGen.push({
      birdID: `${birds[w]?.id ?? w}.${generation}`,
      parent1: `${parentOne.index}.${generation - 1}`,
      parent2: `${parentTwo.index}.${generation - 1}`,
    });
  }

  const oldGen = generationData.currentGeneration.map((entry, w) => {
    const bird = birds[w];
    return bird === undefined
      ? entry
      : {
          ...entry,
          fitness: bird.fitness,
          score: bird.score,
          currentRound,
          generation,
        };
  });

  return {
    birds: createdBirds,
    fitness: pool.sum,
    dna: last.brain.getDNA(),
    generationData: {
      oldGenerations: [oldGen, ...generationData.oldGenerations],
      currentGeneration: newGen,
    },
  };
};

export { nextGeneration };
