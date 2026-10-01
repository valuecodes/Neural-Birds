import type { NetworkLayer } from "~/types";

import { Neuron } from "./neuron";

const Layer = ({ layer }: { layer: NetworkLayer }) => (
  <div className="layer">
    <div className="layerHeader">
      <h3>{layer.type}</h3>
    </div>
    {layer.neurals.map((neuron) => (
      <div key={neuron.id} className="neuron">
        <Neuron name={neuron.name} type={layer.type} />
      </div>
    ))}
  </div>
);

export { Layer };
