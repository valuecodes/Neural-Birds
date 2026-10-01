import type { BirdInOut, GenerationData, SimulationOptions } from "~/types";

import { Background } from "./animation/background";
import { Bird } from "./animation/bird";
import { Pipe } from "./animation/pipe";
import { nextGeneration } from "./next-generation";

// Everything one evolution run carries between frames.
type RunData = {
  gapWidth: number;
  pipes: Pipe[];
  birds: Bird[];
  generation: number;
  currentRound: number;
  scoreCount: number;
  roundScore: number[];
  totalRoundScore: number[];
  deadBirds: Bird[];
  background: Background;
  generationData: GenerationData;
};

type EvolutionHooks = {
  options: SimulationOptions;
  speed: number;
  onInOut: ((data: BirdInOut) => void) | null;
  onGeneration: (run: RunData, dna: number[][]) => void;
};

const createRunData = (gapWidth: number): RunData => ({
  gapWidth,
  pipes: [],
  birds: [],
  generation: 1,
  currentRound: 0,
  scoreCount: 0,
  roundScore: [],
  totalRoundScore: [],
  deadBirds: [],
  background: new Background(-80),
  generationData: { oldGenerations: [], currentGeneration: [] },
});

const createBirds = ({ population, neuralNetwork }: SimulationOptions) =>
  Array.from({ length: population }, (_, id) => {
    const bird = new Bird(neuralNetwork, null, id);
    bird.y = Math.random() * 400 + 100;
    return bird;
  });

// A pipe whose gap sits up to `spread / 2` above or below the middle.
const randomPipe = (spread: number) =>
  new Pipe(Math.floor(Math.random() * spread + (300 - spread / 2)));

// Scrolls every pipe and drops the ones that left the screen past `exitX`.
const movePipes = (pipes: Pipe[], exitX: number) => {
  for (const pipe of pipes) {
    pipe.update();
  }
  while (pipes[0] !== undefined && pipes[0].x < exitX) {
    pipes.shift();
  }
};

// The pipe birds steer for: the first one until they are almost past it.
const nextPipe = (pipes: Pipe[]) => {
  const [first, second] = pipes;
  return first !== undefined && first.x > 10 ? first : (second ?? first);
};

const hitsPipe = (bird: Bird, pipe: Pipe | undefined, gapWidth: number) =>
  pipe !== undefined &&
  bird.x > pipe.x &&
  (bird.y < pipe.gap - gapWidth || bird.y > pipe.gap + gapWidth);

const startNextGeneration = (run: RunData, hooks: EvolutionHooks) => {
  run.deadBirds.sort((a, b) => a.id - b.id);
  const data = nextGeneration(
    run.deadBirds,
    hooks.options,
    run.generationData,
    run.currentRound,
    run.generation
  );
  run.birds = data.birds;
  run.pipes = [new Pipe(300)];
  run.deadBirds = [];
  run.roundScore = [...run.roundScore, run.currentRound];
  run.totalRoundScore = [...run.totalRoundScore, data.fitness];
  run.generationData = data.generationData;
  run.currentRound = 0;
  run.scoreCount = 0;
  run.generation++;
  run.gapWidth = hooks.options.gapWidth;
  run.background.pos = -80;
  hooks.onGeneration(run, data.dna);
};

// Advances the evolution `speed` frames. Returns the leading bird's inputs
// and jump output from the last frame, tracked only below 5x speed.
const advanceEvolution = (run: RunData, hooks: EvolutionHooks) => {
  const { closingRate, hardness, pipeRate, choiceRate } = hooks.options;
  let inputData: BirdInOut | null = null;
  for (let q = 0; q < hooks.speed; q++) {
    run.background.update();
    const difficulty = Math.min(run.currentRound / hardness, 400);
    if (run.scoreCount % closingRate === 0 && run.gapWidth > 10) {
      run.gapWidth--;
    }
    if (run.currentRound % pipeRate === 0) {
      run.pipes.push(randomPipe(difficulty));
    }
    movePipes(run.pipes, -20);

    const target = nextPipe(run.pipes);
    for (const [index, bird] of run.birds.entries()) {
      bird.update();
      if (target !== undefined) {
        const { outputData, inputData: inputs } = bird.think(
          target,
          run.gapWidth
        );
        const jump = outputData[0] ?? 0;
        if (index === 0 && hooks.speed < 5) {
          inputData = [...inputs, jump];
          hooks.onInOut?.(inputData);
        }
        if (jump < choiceRate / 100) {
          bird.up();
        }
      }
      if (hitsPipe(bird, run.pipes[0], run.gapWidth)) {
        bird.alive = false;
      }
    }
    run.deadBirds.push(...run.birds.filter((bird) => !bird.alive));
    run.birds = run.birds.filter((bird) => bird.alive);

    if (run.birds.length === 0 && run.deadBirds.length > 0) {
      startNextGeneration(run, hooks);
    }
    run.currentRound++;
    run.scoreCount++;
  }
  return inputData;
};

// One bird flying alone (landing page and manual play).
type SoloRun = { bird: Bird; pipes: Pipe[]; currentRound: number };

// Advances a solo run one frame. `steer` lets a network decide on jumps
// before the collision check. Returns false when the bird died.
const advanceSolo = (
  run: SoloRun,
  background: Background,
  pipeRate: number,
  gapWidth: number,
  exitX: number,
  steer?: (bird: Bird, pipe: Pipe) => void
) => {
  background.update();
  run.bird.update();
  if (run.currentRound % pipeRate === 0) {
    run.pipes.push(randomPipe(400));
  }
  movePipes(run.pipes, exitX);
  const target = nextPipe(run.pipes);
  if (steer !== undefined && target !== undefined) {
    steer(run.bird, target);
  }
  if (hitsPipe(run.bird, run.pipes[0], gapWidth)) {
    run.bird.alive = false;
  }
  return run.bird.alive;
};

export { advanceEvolution, advanceSolo, createBirds, createRunData };
export type { SoloRun };
