const Neuron = ({ name, type }: { name: string; type: string }) => (
  <div className="neuronInfo">
    {type} {name}
  </div>
);

export { Neuron };
