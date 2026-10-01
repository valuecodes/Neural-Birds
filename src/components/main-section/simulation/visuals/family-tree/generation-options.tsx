import { CheckBoxInput } from "~/utils/check-box-input";
import { SelectorButton } from "~/utils/selector-button";

import type { TreeSettings, TreeToggle, TreeValue } from "./tree-settings";

type GenerationOptionsProps = {
  settings: TreeSettings;
  hasSelection: boolean;
  changeSettings: (option: TreeToggle) => void;
  changeSettingsValue: (value: TreeValue) => void;
};

const values: { option: TreeValue; header: string }[] = [
  { option: "birdID", header: "ID" },
  { option: "fitness", header: "Fitness" },
  { option: "score", header: "Score" },
];

const GenerationOptions = ({
  settings,
  hasSelection,
  changeSettings,
  changeSettingsValue,
}: GenerationOptionsProps) => {
  const message =
    !hasSelection && settings.treeGraph
      ? "Select Bird to see familygraph!"
      : "";

  return (
    <div
      className="generationOptions"
      style={{ height: settings.optionsOpen ? 100 : 0 }}
    >
      <div className="genInfo">
        <h2>Options</h2>
        <p className="message">{message}</p>
      </div>
      <div className="genSettings">
        <div className="genSettingsValues">
          {values.map(({ option, header }) => (
            <SelectorButton
              key={option}
              selected={settings.selectedValue === option}
              changeValue={changeSettingsValue}
              option={option}
              header={header}
            />
          ))}
        </div>
        <CheckBoxInput
          checked={changeSettings}
          option="colors"
          header="Colors"
        />
        <CheckBoxInput
          checked={changeSettings}
          option="treeGraph"
          header="Tree Graph"
        />
      </div>
    </div>
  );
};

export { GenerationOptions };
