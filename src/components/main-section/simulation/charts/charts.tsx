import {
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";
import { useMemo } from "react";
import { Bar } from "react-chartjs-2";

import { useGlobalGenerational } from "~/context/global-generational";
import { useGlobalState } from "~/context/global-state";

Chart.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

const chartOptions: ChartOptions<"bar"> = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      display: true,
      labels: { boxWidth: 0, font: { size: 20 } },
    },
  },
  scales: {
    x: { grid: { drawOnChartArea: false } },
    y: { position: "right", grid: { drawOnChartArea: false } },
  },
};

const barData = (
  label: string,
  scores: number[],
  color: string
): ChartData<"bar"> => ({
  labels: scores.map((_, index) => `Gen:${index + 1}`),
  datasets: [
    {
      label,
      data: scores,
      backgroundColor: `rgba(${color}, 0.2)`,
      borderColor: `rgba(${color}, 1)`,
      borderWidth: 1,
      maxBarThickness: 20,
    },
  ],
});

const Charts = () => {
  const { generationalData } = useGlobalGenerational();
  const { globalSimulationState, visual, activePage } = useGlobalState();
  const { roundScores, totalRoundScores } = generationalData;

  const max = useMemo(
    () => barData("Highest Points", roundScores, "255, 99, 132"),
    [roundScores]
  );
  const total = useMemo(
    () => barData("Total points", totalRoundScores, "33, 105, 194"),
    [totalRoundScores]
  );

  return (
    <div
      className="chartContainer"
      style={{
        marginLeft: globalSimulationState,
        zIndex: visual === "charts" ? 2 : -1,
        visibility: activePage === "simulation" ? "visible" : "hidden",
      }}
    >
      <div
        className="charts"
        style={{ marginLeft: globalSimulationState === "Offline" ? 800 : 40 }}
      >
        <div className="chart">
          <Bar data={max} options={chartOptions} />
        </div>
        <div className="chart">
          <Bar data={total} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export { Charts };
