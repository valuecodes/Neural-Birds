import { Charts } from "./simulation/charts/charts";
import { Simulation } from "./simulation/simulation";
import { Visuals } from "./simulation/visuals/visuals";

const Main = () => (
  <div className="mainSection">
    <Visuals />
    <Simulation />
    <Charts />
  </div>
);

export { Main };
