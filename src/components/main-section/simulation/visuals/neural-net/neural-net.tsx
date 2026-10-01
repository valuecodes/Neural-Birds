import { useEffectEvent, useLayoutEffect, useRef, useState } from "react";

import { VisualHeader } from "~/components/main-section/simulation/visuals/visual-header";
import { VisualInfo } from "~/components/main-section/simulation/visuals/visual-info";
import { useGlobalOptions } from "~/context/global-options";
import { useGlobalState } from "~/context/global-state";
import type { NetworkLayer } from "~/types";

import { Layer } from "./layer";
import { LayerHeader } from "./layer-header";
import { NeuralSvg } from "./neural-svg";

const addNeural = (layer: NetworkLayer): NetworkLayer => {
  const id = layer.neurals.length + 1;
  return {
    ...layer,
    neuralsCount: layer.neuralsCount + 1,
    neurals: [...layer.neurals, { id, name: String(id) }],
  };
};

const removeNeural = (layer: NetworkLayer): NetworkLayer =>
  layer.neuralsCount > 1
    ? {
        ...layer,
        neuralsCount: layer.neuralsCount - 1,
        neurals: layer.neurals.slice(0, -1),
      }
    : layer;

const NeuralNet = () => {
  const { updateNNCoordinates, activePage } = useGlobalState();
  const { options, setNeuralNetwork } = useGlobalOptions();
  const neuralNet = options.neuralNetwork;
  const [optionsOpen, setOptionsOpen] = useState(false);
  const layersRef = useRef<HTMLDivElement>(null);

  // Neuron centres for the connection lines, relative to the layers box.
  const measureNeurons = useEffectEvent(() => {
    const container = layersRef.current;
    if (container === null) {
      return;
    }
    const offset = container.getBoundingClientRect();
    const rects = [...container.querySelectorAll(".neuron")].map((neuron) => {
      const { x, y, width, height } = neuron.getBoundingClientRect();
      return { x: x - offset.x, y: y - offset.y, width, height };
    });
    updateNNCoordinates(rects);
  });

  useLayoutEffect(() => {
    measureNeurons();
  }, [neuralNet]);

  const updateLayer = (
    id: number,
    change: (layer: NetworkLayer) => NetworkLayer
  ) => {
    setNeuralNetwork(
      neuralNet.map((layer) => (layer.id === id ? change(layer) : layer))
    );
  };

  const showLayers =
    (activePage === "landing" && window.innerWidth > 1000) ||
    activePage === "simulation";

  return (
    <div className="neuralNet">
      <VisualHeader
        header="Neural Network"
        changeSettings={() => setOptionsOpen(!optionsOpen)}
      />
      <LayerHeader
        neuralNet={neuralNet}
        addNeular={(id) => updateLayer(id, addNeural)}
        deleteNeular={(id) => updateLayer(id, removeNeural)}
        optionsOpen={optionsOpen}
      />
      <VisualInfo text="Current neural network layout" />
      <NeuralSvg neuralNet={neuralNet} visible={showLayers} />
      <div
        id="layers"
        ref={layersRef}
        style={{ visibility: showLayers ? "visible" : "hidden" }}
      >
        {neuralNet.map((layer) => (
          <Layer key={layer.id} layer={layer} />
        ))}
      </div>
    </div>
  );
};

export { NeuralNet };
