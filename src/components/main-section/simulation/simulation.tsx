import { useEffect, useEffectEvent, useRef, useState } from "react";
import type { ChangeEvent } from "react";

import { useGlobalGenerational } from "~/context/global-generational";
import { useGlobalInOut } from "~/context/global-in-out";
import { useGlobalOptions } from "~/context/global-options";
import { useGlobalState } from "~/context/global-state";
import { images as imageUrls } from "~/utils/images";

import alpha from "./animation/alfa-settings.json";
import { Bird } from "./animation/bird";
import { Pipe } from "./animation/pipe";
import { drawBirdView, drawScene, drawStats, resetCanvas } from "./drawing";
import type { SceneImages } from "./drawing";
import {
  advanceEvolution,
  advanceSolo,
  createBirds,
  createRunData,
} from "./game";
import type { SoloRun } from "./game";
import { Options } from "./options/options";
import { SpeedInput } from "./options/speed-input";
import { useAnimationLoop } from "./use-animation-loop";

// Pre-trained weights for the bird that flies on the landing page. The JSON
// stores each weight tensor as an index-keyed object (a serialised
// Float32Array), which TypeScript cannot type from the file.
const alphaWeights = alpha.alfa.weights.map((weights) =>
  Object.values(weights as Record<string, number>)
);

// Loads the bird and background sprites; null until both are ready.
const useSceneImages = () => {
  const [images, setImages] = useState<SceneImages | null>(null);
  useEffect(() => {
    const bird = new Image();
    const background = new Image();
    let pending = 2;
    const onLoad = () => {
      pending--;
      if (pending === 0) {
        setImages({ bird, background });
      }
    };
    bird.addEventListener("load", onLoad);
    background.addEventListener("load", onLoad);
    bird.src = imageUrls.bird;
    background.src = imageUrls.bg;
    return () => {
      bird.removeEventListener("load", onLoad);
      background.removeEventListener("load", onLoad);
    };
  }, []);
  return images;
};

const Simulation = () => {
  const { options, modifyOption } = useGlobalOptions();
  const { setGlobalInOutData } = useGlobalInOut();
  const { setGenerationalData, resetGenerationalData } =
    useGlobalGenerational();
  const {
    globalSimulationState: state,
    setGlobalSimulationState: setSimulationState,
    visual,
    activePage,
  } = useGlobalState();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const statCanvasRef = useRef<HTMLCanvasElement>(null);
  const savedData = useRef(createRunData(100));
  const loop = useAnimationLoop();
  const images = useSceneImages();
  const [speed, setSpeed] = useState(1);

  const getContexts = () => {
    const main = canvasRef.current?.getContext("2d");
    const stats = statCanvasRef.current?.getContext("2d");
    return main && stats ? { main, stats } : null;
  };

  const simulation = (runSpeed: number, reset: boolean) => {
    const run = savedData.current;
    if (run.pipes.length === 0 || reset) {
      run.pipes = [new Pipe(300)];
    }
    if (run.birds.length === 0 || reset) {
      run.birds = createBirds(options);
    }
    const contexts = getContexts();
    if (contexts === null || images === null) {
      loop.stop();
      return;
    }
    const showBirdView = visual === "bird" && runSpeed < 5;
    loop.start(() => {
      const inputData = advanceEvolution(run, {
        options,
        speed: runSpeed,
        onInOut: visual === "bird" ? setGlobalInOutData : null,
        onGeneration: (current, dna) => {
          setGenerationalData(
            current.roundScore,
            current.totalRoundScore,
            dna,
            current.generationData
          );
        },
      });
      drawScene(
        contexts.main,
        images,
        run.background,
        run.birds,
        run.pipes,
        run.gapWidth
      );
      if (showBirdView && inputData !== null) {
        drawBirdView(contexts.main, inputData);
      }
      drawStats(
        contexts.stats,
        [
          ["Generation:", run.generation],
          ["Bird Count:", `${run.birds.length}/${options.population}`],
          ["Score:", run.scoreCount],
          ["Gap Width:", run.gapWidth],
        ],
        35
      );
      return runSpeed > 0;
    });
  };

  const landingAnimation = (scene: SceneImages) => {
    const contexts = getContexts();
    if (contexts === null) {
      return;
    }
    const { background } = savedData.current;
    const { pipeRate, choiceRate, gapWidth } = options;
    const createAlphaBird = () => {
      const bird = new Bird(options.neuralNetwork, null);
      bird.createAlpha(alphaWeights);
      return bird;
    };
    let solo: SoloRun = { bird: createAlphaBird(), pipes: [], currentRound: 0 };
    let inputData: number[] = [];
    loop.start(() => {
      const alive = advanceSolo(
        solo,
        background,
        pipeRate,
        gapWidth,
        -20,
        (bird, pipe) => {
          const nnData = bird.think(pipe, gapWidth);
          inputData = nnData.inputData;
          if ((nnData.outputData[0] ?? 0) < choiceRate / 100) {
            bird.up();
          }
        }
      );
      if (!alive) {
        solo = {
          bird: createAlphaBird(),
          pipes: [new Pipe(300)],
          currentRound: 0,
        };
        background.pos = -80;
      }
      solo.currentRound++;
      drawScene(
        contexts.main,
        scene,
        background,
        [solo.bird],
        solo.pipes,
        gapWidth
      );
      drawBirdView(contexts.main, inputData);
      return true;
    });
  };

  const playSimulation = () => {
    const contexts = getContexts();
    if (contexts === null || images === null) {
      return;
    }
    setSimulationState("Online");
    const run = savedData.current;
    const { pipeRate, gapWidth } = options;
    let solo: SoloRun = {
      bird: new Bird(options.neuralNetwork, null),
      pipes: [],
      currentRound: 0,
    };
    let round = 0;
    let highScore = 0;
    loop.start(() => {
      if (!advanceSolo(solo, run.background, pipeRate, gapWidth, -10)) {
        solo = {
          bird: new Bird(options.neuralNetwork, null),
          pipes: [new Pipe(300)],
          currentRound: 0,
        };
        run.background.pos = -80;
        round++;
      }
      solo.currentRound++;
      highScore = Math.max(highScore, solo.currentRound);
      // `jump` steers whichever bird is flying now.
      run.birds = [solo.bird];
      drawScene(
        contexts.main,
        images,
        run.background,
        [solo.bird],
        solo.pipes,
        gapWidth
      );
      drawStats(
        contexts.stats,
        [
          ["Round:", round],
          ["Score:", solo.currentRound],
          ["High Score:", highScore],
        ],
        50
      );
      return true;
    });
  };

  const playSetupAnimation = () => {
    const contexts = getContexts();
    if (contexts === null || images === null) {
      return;
    }
    const bird = new Bird(options.neuralNetwork, null);
    drawScene(
      contexts.main,
      images,
      savedData.current.background,
      [bird],
      [],
      0
    );
  };

  const setupAnimation = (scene: SceneImages) => {
    const contexts = getContexts();
    if (contexts === null) {
      return;
    }
    drawScene(
      contexts.main,
      scene,
      savedData.current.background,
      createBirds(options),
      [new Pipe(300)],
      options.gapWidth
    );
  };

  // Throws away the current run and draws its fresh first frame.
  const resetRun = () => {
    savedData.current = createRunData(options.gapWidth);
    simulation(0, true);
    const contexts = getContexts();
    if (contexts !== null) {
      resetCanvas(contexts.stats);
    }
  };

  const resetSimulation = () => {
    resetGenerationalData();
    setSimulationState("Offline");
    resetRun();
  };

  // The page change itself already reset the React state (see
  // `setActivePage` and `NavBar`); this only syncs the canvas.
  const onActivePageChange = useEffectEvent(() => {
    if (activePage !== "landing") {
      resetRun();
    }
    if (activePage === "playMode") {
      playSetupAnimation();
    }
  });

  const onVisualChange = useEffectEvent(() => {
    if (activePage === "simulation" && state === "Online") {
      simulation(speed, false);
    }
  });

  const onSetupChange = useEffectEvent((scene: SceneImages) => {
    setupAnimation(scene);
  });

  const onImagesReady = useEffectEvent((scene: SceneImages) => {
    landingAnimation(scene);
  });

  useEffect(() => {
    onActivePageChange();
  }, [activePage]);

  useEffect(() => {
    onVisualChange();
  }, [visual]);

  useEffect(() => {
    if (images !== null) {
      onSetupChange(images);
    }
  }, [options.gapWidth, options.population, images]);

  useEffect(() => {
    if (images === null) {
      return undefined;
    }
    onImagesReady(images);
    return loop.stop;
  }, [images, loop.stop]);

  const changeSpeed = (event: ChangeEvent<HTMLInputElement>) => {
    const newSpeed = Number(event.target.value);
    setSpeed(newSpeed);
    modifyOption("speed", newSpeed);
    if (state === "Offline") {
      if (images !== null) {
        setupAnimation(images);
      }
    } else if (activePage === "simulation") {
      // A speed change also resumes a paused run.
      setSimulationState("Online");
      simulation(newSpeed, false);
    }
  };

  const startSimulation = () => {
    setSimulationState("Online");
    simulation(speed, false);
  };

  const pauseSimulation = () => {
    const paused = state === "Paused";
    simulation(paused ? speed : 0, false);
    setSimulationState(paused ? "Online" : "Paused");
  };

  const stopPlaySimulation = () => {
    loop.stop();
    savedData.current = createRunData(options.gapWidth);
    setSimulationState("Offline");
    playSetupAnimation();
  };

  const startPlaySimulation = () => {
    if (state === "Offline") {
      playSimulation();
    }
  };

  const jump = () => {
    if (activePage === "playMode" && state === "Online") {
      savedData.current.birds[0]?.up();
    }
  };

  return (
    <div
      className="neuralNetwork"
      style={{ visibility: activePage === "simulation" ? "visible" : "hidden" }}
    >
      <Options
        startSimulation={startSimulation}
        pauseSimulation={pauseSimulation}
        resetSimulation={resetSimulation}
        startPlaySimulation={startPlaySimulation}
        stopPlaySimulation={stopPlaySimulation}
        state={state}
      />
      <SpeedInput speed={speed} changeSpeed={changeSpeed} />
      {/* The canvas is the play area; jumping is mouse-only by design. */}
      <canvas
        onClick={jump}
        ref={canvasRef}
        className="canvas"
        width={600}
        height={600}
      />
      <canvas
        style={{ visibility: activePage === "landing" ? "hidden" : "visible" }}
        ref={statCanvasRef}
        className="statCanvas"
        width={200}
      />
    </div>
  );
};

export { Simulation };
