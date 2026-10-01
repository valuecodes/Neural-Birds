import { useCallback, useEffect, useRef } from "react";

// Owns the single requestAnimationFrame loop behind the canvas. `start` runs
// `step` once right away, then once per frame for as long as it returns true.
// Starting a new loop or calling `stop` bumps the run id, so a frame queued
// by an older loop exits instead of drawing over the new one.
const useAnimationLoop = () => {
  const frame = useRef<number | null>(null);
  const runId = useRef(0);

  const stop = useCallback(() => {
    runId.current++;
    if (frame.current !== null) {
      cancelAnimationFrame(frame.current);
      frame.current = null;
    }
  }, []);

  const start = useCallback(
    (step: () => boolean) => {
      stop();
      const id = runId.current;
      const tick = () => {
        frame.current = null;
        if (id !== runId.current) {
          return;
        }
        if (step() && id === runId.current) {
          frame.current = requestAnimationFrame(tick);
        }
      };
      tick();
    },
    [stop]
  );

  useEffect(() => stop, [stop]);

  return { start, stop };
};

export { useAnimationLoop };
