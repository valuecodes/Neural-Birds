import type { NetworkLayer } from "~/types";

import { AddNeular } from "./add-neular";

type LayerHeaderProps = {
  neuralNet: NetworkLayer[];
  optionsOpen: boolean;
  addNeular: (layerId: number) => void;
  deleteNeular: (layerId: number) => void;
};

const LayerHeader = ({
  neuralNet,
  optionsOpen,
  addNeular,
  deleteNeular,
}: LayerHeaderProps) => {
  const sum = neuralNet.reduce(
    (total, layer) => total + layer.neurals.length,
    0
  );

  return (
    <div className="layerOptions" style={{ height: optionsOpen ? 35 : 0 }}>
      <div className="lOptions" style={{ opacity: optionsOpen ? 1 : 0 }}>
        <h3>
          Type: <span className="oValue">Dense</span>{" "}
        </h3>
        <h3>
          Layers: <span className="oValue">{neuralNet.length}</span>{" "}
        </h3>
        <h3>
          Neurals: <span className="oValue">{sum}</span>
        </h3>
      </div>
      <div
        className="neuralOptions"
        style={{ display: optionsOpen ? "" : "none" }}
      >
        {neuralNet.map((layer) => (
          <AddNeular
            key={layer.id}
            layer={layer.id}
            addNeular={addNeular}
            deleteNeular={deleteNeular}
          />
        ))}
      </div>
    </div>
  );
};

export { LayerHeader };
