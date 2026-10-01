import { VisualHeader } from "~/components/main-section/simulation/visuals/visual-header";
import { VisualInfo } from "~/components/main-section/simulation/visuals/visual-info";
import { useGlobalInOut } from "~/context/global-in-out";
import { useGlobalOptions } from "~/context/global-options";

const BirdView = () => {
  const { inOutData } = useGlobalInOut();
  const { options } = useGlobalOptions();
  const message = options.speed >= 5 ? "Speed must be below 5x" : "";

  return (
    <div className="birdView">
      <VisualHeader header="Bird View" />
      <VisualInfo text="Bird Input/Output data visualized" message={message} />
      {inOutData.map(
        ([birdY, pipeTop, pipeBottom, pipeX, velocity, jump], index) => (
          // Rows are a rolling log with no identity of their own.
          <div key={index} className="birdInput">
            <p>{`Bird y:${birdY.toFixed(2)}`}</p>
            <p>{`Pipe top:${pipeTop.toFixed(2)}`}</p>
            <p>{`Pipe bot:${pipeBottom.toFixed(2)}`}</p>
            <p>{`Pipe x:${pipeX.toFixed(2)}`}</p>
            <p>{`Velocity:${velocity.toFixed(2)}`}</p>
            <p>{`Jump:${jump.toFixed(2)}`}</p>
          </div>
        )
      )}
      <div className="fade" />
    </div>
  );
};

export { BirdView };
