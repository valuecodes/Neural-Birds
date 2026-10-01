import { NeuralNetwork } from "~/components/main-section/simulation/neural-network";
import type { NetworkLayer } from "~/types";

import type { Pipe } from "./pipe";

class Bird {
  readonly id: number;
  y = 250;
  readonly x = 20;
  readonly size = 10;
  readonly gravity = 0.8;
  readonly lift = -10;
  velocity = 0;
  alive = true;
  score = 0;
  fitness = 0;
  readonly brain: NeuralNetwork;

  constructor(nnForm: NetworkLayer[], brain: NeuralNetwork | null, id = 0) {
    this.id = id;
    this.brain =
      brain?.copy() ??
      NeuralNetwork.create(
        nnForm[0]?.neuralsCount ?? 0,
        nnForm[1]?.neuralsCount ?? 0,
        nnForm[2]?.neuralsCount ?? 0
      );
  }

  update() {
    this.velocity += this.gravity;
    this.y += this.velocity * 0.9;
    this.score++;
    if (this.y > 600 - this.size || this.y < 0) {
      this.alive = false;
    }
  }

  up() {
    this.velocity = this.lift;
  }

  think(pipe: Pipe, gapW: number) {
    const inputs: [number, number, number, number, number] = [
      this.y / 600,
      (pipe.gap + gapW) / 600,
      (pipe.gap - gapW) / 600,
      pipe.x / 600,
      this.velocity / 20,
    ];
    return { outputData: this.brain.predict(inputs), inputData: inputs };
  }

  draw(ctx: CanvasRenderingContext2D, image: HTMLImageElement) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.velocity + 10) / 15 - 0.3);
    ctx.translate(-this.x - 15, -this.y - 15);
    ctx.drawImage(image, this.x, this.y);
    ctx.restore();
  }

  createAlpha(alpha: number[][]) {
    this.brain.createAlpha(alpha);
  }
}

export { Bird };
