import {
  Chart,
  Filler,
  LineElement,
  PointElement,
  RadialLinearScale,
} from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";
import { useMemo } from "react";
import { Radar } from "react-chartjs-2";

import { VisualHeader } from "~/components/main-section/simulation/visuals/visual-header";
import { VisualInfo } from "~/components/main-section/simulation/visuals/visual-info";
import { useGlobalGenerational } from "~/context/global-generational";

Chart.register(RadialLinearScale, PointElement, LineElement, Filler);

// Decorative base letters for the radar labels, one per weight (cycled).
const BASES = ["A", "C", "T", "G"];
const STRUCTURE = Array.from(
  { length: 80 },
  () => BASES[Math.floor(Math.random() * BASES.length)] ?? "A"
);

const radarOptions: ChartOptions<"radar"> = {
  plugins: { legend: { display: false } },
  scales: {
    r: {
      grid: { display: false, circular: true },
      ticks: { display: false },
    },
  },
};

// Average best score as a share of 10 000 points, capped at 100%.
const calculateFitness = (roundScores: number[]) => {
  if (roundScores.length === 0) {
    return 0;
  }
  const sum = roundScores.reduce((total, score) => total + score, 0);
  return Math.min((sum / roundScores.length / 10_000) * 100, 100);
};

// Plots the hidden and output layer kernels (bias vectors skipped) inside a
// fixed band between -1 and 1.
const radarData = (dna: number[][]): ChartData<"radar"> => {
  const layers = dna.filter((_, i) => i !== 1 && i < dna.length - 1);
  const weights = layers.flat();
  // Each label is a cycling base letter plus the weight's index in its layer.
  const labels = layers
    .flatMap((layer) => layer.map((_, index) => index))
    .map(
      (index, count) => `${STRUCTURE[count % STRUCTURE.length] ?? ""}${index}`
    );
  return {
    labels,
    datasets: [
      {
        label: "1",
        fill: true,
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        borderColor: "rgba(53, 53, 53, 0.438)",
        borderWidth: 2,
        data: weights,
      },
      {
        label: "2",
        backgroundColor: "rgba(13, 72, 92,0)",
        borderColor: "rgba(53, 53, 53, 0)",
        borderWidth: 2,
        pointBorderColor: "rgba(13, 72, 92,1)",
        data: weights.map(() => 1),
      },
      {
        label: "3",
        fill: true,
        backgroundColor: "rgba(53, 53, 53, 0.5)",
        borderColor: "rgba(53, 53, 53, 1)",
        borderWidth: 2,
        pointRadius: 0,
        pointBorderColor: "rgba(13, 72, 92,0.1)",
        pointBackgroundColor: "rgba(179,181,198,0)",
        data: weights.map(() => -1),
      },
    ],
  };
};

const DNA = () => {
  const { generationalData } = useGlobalGenerational();
  const { roundScores, dna } = generationalData;
  const fitness = calculateFitness(roundScores);
  const data = useMemo(() => radarData(dna), [dna]);

  return (
    <div className="DNA">
      <VisualHeader header="DNA" />
      <VisualInfo text="DNA updates every time new Generation is created" />
      <div className="dnaPage">
        <div className="centerAlign">
          <div className="centerDot">
            <p>Fitness:</p>
            <h3 className="fitnessPercentage">{fitness.toFixed(2)}%</h3>
          </div>
        </div>
        <Radar
          data={data}
          className="dnaChart"
          width={50}
          height={50}
          options={radarOptions}
        />
      </div>
    </div>
  );
};

export { DNA };
