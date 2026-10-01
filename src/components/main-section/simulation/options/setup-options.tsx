import { useGlobalOptions } from "~/context/global-options";
import type { SimulationState } from "~/types";
import { images } from "~/utils/images";

type SetupOptionsProps = {
  state: SimulationState;
  openOptions: () => void;
};

const SetupOptions = ({ state, openOptions }: SetupOptionsProps) => {
  const { options, modifyOption } = useGlobalOptions();

  return (
    <div
      className="setupInputs"
      style={{ visibility: state === "Offline" ? undefined : "hidden" }}
    >
      <div className="setupInput">
        <h2>Setup</h2>
        <button type="button" className="optionsButton" onClick={openOptions}>
          <img alt="description" className="optionImage" src={images.options} />
        </button>
      </div>
      <div className="isetup">
        <p>Gap</p>
        <div>
          <input
            className="setupInputSlider"
            type="range"
            aria-label="Gap"
            defaultValue={50}
            onChange={(event) =>
              modifyOption("gapWidth", Number(event.target.value) * 2)
            }
          />
        </div>
        <p className="isetupValue">{options.gapWidth}</p>
      </div>
      <div className="isetup">
        <p>Birds</p>
        <div>
          {/* At least one bird, or there is nothing to evolve. */}
          <input
            className="setupInputSlider"
            type="range"
            aria-label="Birds"
            min={1}
            defaultValue={5}
            onChange={(event) =>
              modifyOption("population", Number(event.target.value))
            }
          />
        </div>
        <p className="isetupValue">{options.population}</p>
      </div>
    </div>
  );
};

export { SetupOptions };
