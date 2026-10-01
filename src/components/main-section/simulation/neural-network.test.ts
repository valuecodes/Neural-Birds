import { describe, expect, it } from "vitest";

import { NeuralNetwork } from "./neural-network";

describe("NeuralNetwork", () => {
  it("predicts one probability per output node", () => {
    const network = NeuralNetwork.create(5, 8, 2);
    const outputs = network.predict([0.5, 0.4, 0.2, 0.9, -0.1]);

    expect(outputs).toHaveLength(2);
    expect(outputs.reduce((sum, value) => sum + value, 0)).toBeCloseTo(1, 5);
  });

  it("copies weights into an independent model", () => {
    const network = NeuralNetwork.create(5, 8, 2);
    const copy = network.copy();

    expect(copy.getDNA()).toStrictEqual(network.getDNA());
    expect(copy.model).not.toBe(network.model);

    copy.mutate(100, NeuralNetwork.create(5, 8, 2));

    expect(copy.getDNA()).not.toStrictEqual(network.getDNA());
  });

  it("loads saved weights with createAlpha", () => {
    const network = NeuralNetwork.create(2, 2, 2);
    // Kernel 2x2, bias 2, kernel 2x2, bias 2.
    const weights = [
      [0.1, 0.2, 0.3, 0.4],
      [0.5, 0.6],
      [0.7, 0.8, 0.9, 1],
      [1.1, 1.2],
    ];
    network.createAlpha(weights);

    const dna = network.getDNA();
    for (const [i, layer] of weights.entries()) {
      for (const [j, value] of layer.entries()) {
        expect(dna[i]?.[j]).toBeCloseTo(value, 5);
      }
    }
  });
});
