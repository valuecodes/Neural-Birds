type SimulationState = "Offline" | "Online" | "Paused";

type ActivePage = "landing" | "simulation" | "playMode";

type Visual = "" | "nn" | "bird" | "family" | "dna" | "charts";

type Neural = { id: number; name: string };

type NetworkLayer = {
  type: "Input" | "Hidden" | "Output";
  neuralsCount: number;
  id: number;
  neurals: Neural[];
};

type SimulationOptions = {
  closingRate: number;
  gapWidth: number;
  hardness: number;
  population: number;
  speed: number;
  pipeRate: number;
  choiceRate: number;
  poolSize: number;
  mutateRate: number;
  selectionPower: number;
  recreateRate: number;
  neuralNetwork: NetworkLayer[];
};

type NumericOption = Exclude<keyof SimulationOptions, "neuralNetwork">;

type GenerationBird = {
  birdID: string;
  parent1: string;
  parent2: string;
  fitness?: number;
  score?: number;
  currentRound?: number;
  generation?: number;
};

type GenerationData = {
  oldGenerations: GenerationBird[][];
  currentGeneration: GenerationBird[];
};

type GenerationalData = {
  roundScores: number[];
  totalRoundScores: number[];
  dna: number[][];
  generationData: GenerationData;
};

// Bird y, pipe top, pipe bottom, pipe x, velocity (the network inputs), then
// the jump output.
type BirdInOut = [number, number, number, number, number, number];

type NeuronRect = { x: number; y: number; width: number; height: number };

export type {
  ActivePage,
  BirdInOut,
  GenerationalData,
  GenerationBird,
  GenerationData,
  NetworkLayer,
  NeuronRect,
  NumericOption,
  SimulationOptions,
  SimulationState,
  Visual,
};
