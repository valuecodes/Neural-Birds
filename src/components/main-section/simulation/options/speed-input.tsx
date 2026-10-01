import { memo } from "react";
import type { ChangeEvent } from "react";

type SpeedInputProps = {
  speed: number;
  changeSpeed: (event: ChangeEvent<HTMLInputElement>) => void;
};

const SpeedInput = memo(({ speed, changeSpeed }: SpeedInputProps) => (
  <div className="speedInput">
    <input
      className="speed"
      type="range"
      aria-label="Speed"
      step={1}
      defaultValue={1}
      onChange={changeSpeed}
    />
    <p className="speedTag">
      Speed <span className="speedHeader">{`${speed}x`}</span>
    </p>
  </div>
));

SpeedInput.displayName = "SpeedInput";

export { SpeedInput };
