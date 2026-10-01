import { describe, expect, it } from "vitest";

import type { NetworkLayer } from "~/types";

import { Bird } from "./bird";

const layers = (counts: number[]): NetworkLayer[] =>
  counts.map((count, id) => ({
    type: "Hidden",
    neuralsCount: count,
    id,
    neurals: [],
  }));

describe("Bird", () => {
  it("falls faster every frame and scores while alive", () => {
    const bird = new Bird(layers([5, 8, 2]), null);
    bird.update();
    const firstDrop = bird.y - 250;
    const before = bird.y;
    bird.update();

    expect(bird.y - before).toBeGreaterThan(firstDrop);
    expect(bird.score).toBe(2);
    expect(bird.alive).toBe(true);
  });

  it("dies when it leaves the screen", () => {
    const falling = new Bird(layers([5, 8, 2]), null);
    falling.y = 595;
    falling.update();

    expect(falling.alive).toBe(false);

    const rising = new Bird(layers([5, 8, 2]), null);
    rising.y = 1;
    rising.up();
    rising.update();

    expect(rising.alive).toBe(false);
  });

  it("copies the given brain instead of sharing it", () => {
    const parent = new Bird(layers([5, 8, 2]), null);
    const child = new Bird(layers([5, 8, 2]), parent.brain);

    expect(child.brain).not.toBe(parent.brain);
    expect(child.brain.getDNA()).toStrictEqual(parent.brain.getDNA());
  });
});
