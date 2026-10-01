type AddNeularProps = {
  layer: number;
  addNeular: (layerId: number) => void;
  deleteNeular: (layerId: number) => void;
};

// The input layer's size is fixed by the bird's senses, so it gets no
// controls (hidden, but kept to hold the column).
const AddNeular = ({ layer, addNeular, deleteNeular }: AddNeularProps) => (
  <div
    className="addLayer"
    style={{ visibility: layer === 0 ? "hidden" : undefined }}
  >
    <button type="button" className="minus" onClick={() => deleteNeular(layer)}>
      -
    </button>
    <span />
    <button type="button" className="plus" onClick={() => addNeular(layer)}>
      +
    </button>
  </div>
);

export { AddNeular };
