import * as tf from "@tensorflow/tfjs";

// The networks are tiny and run one prediction per bird per frame, where the
// CPU backend beats WebGL's upload overhead.
void tf.setBackend("cpu");

const randomGaussian = () => {
  let rand = 0;
  for (let i = 0; i < 6; i++) {
    rand += Math.random();
  }
  return rand / 6 - 0.5;
};

const createModel = (
  inputNodes: number,
  hiddenNodes: number,
  outputNodes: number
) => {
  const model = tf.sequential();
  model.add(
    tf.layers.dense({
      units: hiddenNodes,
      inputShape: [inputNodes],
      activation: "sigmoid",
    })
  );
  model.add(tf.layers.dense({ units: outputNodes, activation: "softmax" }));
  return model;
};

// Rewrites every weight of `model` from its own value and the matching
// weight of `other` (same layout).
const combineWeights = (
  model: tf.Sequential,
  other: tf.Sequential,
  combine: (value: number, otherValue: number) => number
) => {
  tf.tidy(() => {
    const otherWeights = other.getWeights();
    const newWeights = model.getWeights().map((tensor, i) => {
      const values = [...tensor.dataSync()];
      const otherValues = otherWeights[i]?.dataSync() ?? [];
      for (let j = 0; j < values.length; j++) {
        values[j] = combine(values[j] ?? 0, otherValues[j] ?? 0);
      }
      return tf.tensor(values, tensor.shape);
    });
    model.setWeights(newWeights);
  });
};

class NeuralNetwork {
  private constructor(
    readonly model: tf.Sequential,
    readonly inputNodes: number,
    readonly hiddenNodes: number,
    readonly outputNodes: number
  ) {}

  static create(inputNodes: number, hiddenNodes: number, outputNodes: number) {
    return new NeuralNetwork(
      createModel(inputNodes, hiddenNodes, outputNodes),
      inputNodes,
      hiddenNodes,
      outputNodes
    );
  }

  predict(inputs: number[]) {
    return tf.tidy(() => {
      const xs = tf.tensor2d([inputs]);
      const ys = this.model.predict(xs) as tf.Tensor;
      return [...ys.dataSync()];
    });
  }

  getDNA() {
    return tf.tidy(() =>
      this.model.getWeights().map((tensor) => [...tensor.dataSync()])
    );
  }

  // Each weight comes from this network, the other parent, or their average,
  // with equal odds.
  shuffleGenes(otherParent: NeuralNetwork) {
    combineWeights(this.model, otherParent.model, (w, ov) => {
      const chance = Math.random();
      if (chance < 0.33) {
        return w;
      }
      if (chance < 0.66) {
        return ov;
      }
      return (w + ov) / 2;
    });
  }

  copy() {
    const model = createModel(
      this.inputNodes,
      this.hiddenNodes,
      this.outputNodes
    );
    tf.tidy(() => {
      model.setWeights(this.model.getWeights().map((tensor) => tensor.clone()));
    });
    return new NeuralNetwork(
      model,
      this.inputNodes,
      this.hiddenNodes,
      this.outputNodes
    );
  }

  // Moves every weight halfway towards `alpha`'s; `rate` percent of them also
  // get gaussian noise on top.
  mutate(rate: number, alpha: NeuralNetwork) {
    const chance = rate / 100;
    combineWeights(this.model, alpha.model, (w, av) =>
      Math.random() < chance ? w + av / 2 + randomGaussian() : (w + av) / 2
    );
  }

  // Loads saved weights, one flat array per weight tensor.
  createAlpha(alphaWeights: number[][]) {
    tf.tidy(() => {
      const newWeights = this.model.getWeights().map((tensor, i) =>
        tf.tensor(
          Array.from(
            { length: tensor.size },
            (_, j) => alphaWeights[i]?.[j] ?? 0
          ),
          tensor.shape
        )
      );
      this.model.setWeights(newWeights);
    });
  }
}

export { NeuralNetwork };
