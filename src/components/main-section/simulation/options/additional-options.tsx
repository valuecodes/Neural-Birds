import type { SimulationState } from "~/types";

import { OptionSlider } from "./option-components/options-slider";
import type { SliderOption } from "./option-components/options-slider";

const environmentOptions: SliderOption[] = [
  {
    id: "closingRate",
    name: "Closing Rate",
    min: 100,
    max: 9999,
    def: 5000,
    type: "p",
    scale: null,
    desc: "Pipe gap closing by 1 every time score is reaches closing rate",
  },
  {
    id: "pipeRate",
    name: "Number of pipes",
    min: 30,
    max: 270,
    def: 140,
    type: "",
    scale: { op: "/", factor: 30, reverse: true },
    desc: "How many pipes on the screen at the same time",
  },
  {
    id: "hardness",
    name: "Hardness Rate",
    min: 0,
    max: 50,
    def: 25,
    type: "%",
    scale: { op: "*", factor: 2, reverse: true },
    desc: "How fast pipes diverse from the center",
  },
  {
    id: "choiceRate",
    name: "Choice confidence",
    min: 1,
    max: 99,
    def: 55,
    type: "%",
    scale: null,
    desc: "How confident the bird must be to jump",
  },
];

const crossOverOptions: SliderOption[] = [
  {
    id: "poolSize",
    name: "Pool Size",
    min: 2,
    max: 100,
    def: 10,
    type: "pcs",
    scale: null,
    desc: "How many top scroring birds from the generation are chosen to the mating pool",
  },
  {
    id: "selectionPower",
    name: "Selection Power",
    min: 0,
    max: 5,
    def: 1,
    type: "",
    scale: null,
    desc: "Bird score is multiplied by power so highest scoring birds are more likely to pass genes on",
  },
];

const mutationOptions: SliderOption[] = [
  {
    id: "mutateRate",
    name: "Mutate Rate",
    min: 0,
    max: 50,
    def: 10,
    type: "%",
    scale: null,
    desc: "Bird mutation change",
  },
  {
    id: "recreateRate",
    name: "Recreate Rate",
    min: 0,
    max: 2000,
    def: 100,
    type: "p",
    scale: null,
    desc: "If bird score is less than n, create new random bird to avoid cycle of bad generations",
  },
];

const OptionGroup = ({
  title,
  group,
}: {
  title: string;
  group: SliderOption[];
}) => (
  <div className="aOptionContainer">
    <h2>{title}</h2>
    {group.map((option) => (
      <OptionSlider key={option.id} {...option} />
    ))}
  </div>
);

type AdditionalOptionsProps = {
  optionsOpen: boolean;
  state: SimulationState;
};

const AdditionalOptions = ({ optionsOpen, state }: AdditionalOptionsProps) => (
  <div
    className="additionaOptions"
    style={{
      width: optionsOpen ? "100vw" : 0,
      display: state === "Offline" ? "" : "none",
      borderWidth: optionsOpen ? 2 : 0,
    }}
  >
    <div className="inputContainer">
      <div className="aOptionHeader">
        <h2>Additional Settings</h2>
      </div>
      <OptionGroup title="Enviromental Options" group={environmentOptions} />
      <OptionGroup title="Crossover Options" group={crossOverOptions} />
      <OptionGroup title="Mutation Options" group={mutationOptions} />
      <div className="attributionContainer">
        <h2 className="attributes">Attributes</h2>
        <div>
          Icons made by{" "}
          <a href="https://www.flaticon.com/authors/freepik" title="Freepik">
            Freepik
          </a>{" "}
          from{" "}
          <a href="https://www.flaticon.com/" title="Flaticon">
            www.flaticon.com
          </a>
        </div>
        <div>
          Icons made by{" "}
          <a
            href="https://www.flaticon.com/authors/pixel-perfect"
            title="Pixel perfect"
          >
            Pixel perfect
          </a>{" "}
          from{" "}
          <a href="https://www.flaticon.com/" title="Flaticon">
            www.flaticon.com
          </a>
        </div>
      </div>
      <div>
        Icons made by{" "}
        <a href="https://www.flaticon.com/authors/nhor-phai" title="Nhor Phai">
          Nhor Phai
        </a>{" "}
        from{" "}
        <a href="https://www.flaticon.com/" title="Flaticon">
          www.flaticon.com
        </a>
      </div>
    </div>
  </div>
);

export { AdditionalOptions };
