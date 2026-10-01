import type { Background } from "./animation/background";
import type { Bird } from "./animation/bird";
import type { Pipe } from "./animation/pipe";

type SceneImages = { bird: HTMLImageElement; background: HTMLImageElement };

const resetCanvas = (ctx: CanvasRenderingContext2D) => {
  ctx.beginPath();
  ctx.clearRect(0, 0, 800, 800);
};

const drawScene = (
  ctx: CanvasRenderingContext2D,
  images: SceneImages,
  background: Background,
  birds: Bird[],
  pipes: Pipe[],
  gapWidth: number
) => {
  resetCanvas(ctx);
  ctx.strokeStyle = "#000000";
  background.draw(ctx, images.background);
  for (const bird of birds) {
    bird.draw(ctx, images.bird);
  }
  for (const pipe of pipes) {
    pipe.draw(ctx, gapWidth);
  }
  ctx.stroke();
};

// Boxes the points the leading bird sees: both pipe edges, itself, and a
// bar for its velocity. `inputData` is the network input, scaled to 0..1.
const drawBirdView = (
  ctx: CanvasRenderingContext2D,
  [
    birdY = 0,
    pipeTop = 0,
    pipeBottom = 0,
    pipeX = 0,
    velocity = 0,
  ]: readonly number[]
) => {
  ctx.beginPath();
  ctx.strokeStyle = "#FF0000";
  ctx.rect(pipeX * 600 - 5, pipeBottom * 600 - 15, 30, 30);
  ctx.rect(pipeX * 600 - 5, pipeTop * 600 - 15, 30, 30);
  ctx.rect(20 - 15, birdY * 600 - 15, 30, 30);
  ctx.rect(20 + 30, birdY * 600 + 5, 0, -20 + velocity * 120);
  ctx.stroke();
};

// Labelled values in two columns, one row every 30px from `firstY`.
const drawStats = (
  ctx: CanvasRenderingContext2D,
  rows: [label: string, value: string | number][],
  firstY: number
) => {
  resetCanvas(ctx);
  ctx.font = "20px Arial ";
  ctx.fillStyle = "rgb(114, 114, 114)";
  for (const [index, [label]] of rows.entries()) {
    ctx.fillText(label, 10, firstY + index * 30);
  }
  ctx.font = "700 26px Arial";
  ctx.fillStyle = "rgb(55, 61, 80)";
  for (const [index, [, value]] of rows.entries()) {
    ctx.fillText(String(value), 130, firstY + index * 30);
  }
};

export { drawBirdView, drawScene, drawStats, resetCanvas };
export type { SceneImages };
