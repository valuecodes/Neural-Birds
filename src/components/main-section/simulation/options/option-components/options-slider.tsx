import { useGlobalOptions } from "~/context/global-options";
import type { NumericOption } from "~/types";

import { Description } from "./description";

// How the slider position maps to the shown value: `reverse` sliders run
// right to left and show the scaled value counted down from the maximum.
type SliderScale = { op: "/" | "*"; factor: number; reverse: boolean };

type SliderOption = {
  id: NumericOption;
  name: string;
  min: number;
  max: number;
  def: number;
  type: string;
  scale: SliderScale | null;
  desc: string;
};

const displayValue = (
  value: number,
  max: number,
  scale: SliderScale | null
) => {
  if (scale === null) {
    return value;
  }
  if (scale.op === "/") {
    const scaled = value / scale.factor;
    return scale.reverse ? max / scale.factor + 1 - scaled : scaled;
  }
  const scaled = value * scale.factor;
  return scale.reverse ? max * scale.factor - scaled : scaled;
};

const OptionSlider = ({
  id,
  name,
  min,
  max,
  def,
  type,
  scale,
  desc,
}: SliderOption) => {
  const { options, modifyOption } = useGlobalOptions();
  const value = displayValue(options[id], max, scale);

  return (
    <div className="input">
      <p>{name}</p>
      <h3 className="inputValue">
        {value.toFixed(0)}
        {type}
      </h3>
      <Description desc={desc} />
      <input
        className="inputSlider"
        style={{ direction: scale?.reverse === true ? "rtl" : undefined }}
        type="range"
        aria-label={name}
        defaultValue={def}
        min={min}
        max={max}
        onChange={(event) => modifyOption(id, Number(event.target.value))}
      />
    </div>
  );
};

export { OptionSlider };
export type { SliderOption };
