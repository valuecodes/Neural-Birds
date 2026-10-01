type TreeValue = "birdID" | "fitness" | "score";

type TreeSettings = {
  optionsOpen: boolean;
  treeGraph: boolean;
  colors: boolean;
  selectedValue: TreeValue;
};

type TreeToggle = "optionsOpen" | "treeGraph" | "colors";

export type { TreeSettings, TreeToggle, TreeValue };
