import { useMemo } from "react";

import { useGlobalState } from "~/context/global-state";
import type { NetworkLayer, NeuronRect } from "~/types";

type Line = { x1: number; y1: number; x2: number; y2: number };

// One line from every neuron to every neuron of the next layer. `rects` holds
// the neurons of all layers in order.
const calculateConnections = (rects: NeuronRect[], nn: NetworkLayer[]) => {
  const total = nn.reduce((sum, layer) => sum + layer.neurals.length, 0);
  if (rects.length !== total) {
    return [];
  }
  const lines: Line[] = [];
  let layerStart = 0;
  for (const [i, layer] of nn.entries()) {
    const nextLayer = nn[i + 1];
    if (nextLayer === undefined) {
      break;
    }
    const nextStart = layerStart + layer.neurals.length;
    for (let a = 0; a < layer.neurals.length; a++) {
      const from = rects[layerStart + a];
      for (let c = 0; c < nextLayer.neurals.length; c++) {
        const to = rects[nextStart + c];
        if (from !== undefined && to !== undefined) {
          lines.push({
            x1: from.x + from.width / 2,
            y1: from.y + from.height / 2,
            x2: to.x + from.width / 2,
            y2: to.y + from.height / 2,
          });
        }
      }
    }
    layerStart = nextStart;
  }
  return lines;
};

type NeuralSvgProps = { neuralNet: NetworkLayer[]; visible: boolean };

const NeuralSvg = ({ neuralNet, visible }: NeuralSvgProps) => {
  const { nnCoordinates } = useGlobalState();
  const lines = useMemo(
    () => calculateConnections(nnCoordinates, neuralNet),
    [nnCoordinates, neuralNet]
  );

  return (
    <svg
      className="neuralSvg"
      style={{ visibility: visible ? "visible" : "hidden" }}
    >
      {lines.map((line) => (
        <line
          key={`${line.x1},${line.y1},${line.x2},${line.y2}`}
          className="neuralLine"
          {...line}
          strokeWidth="1"
          style={{ stroke: "black", strokeWidth: 0.5 }}
        />
      ))}
    </svg>
  );
};

export { NeuralSvg };
