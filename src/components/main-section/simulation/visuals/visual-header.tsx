import { useGlobalState } from "~/context/global-state";
import { OptionButton } from "~/utils/option-button";

type VisualHeaderProps = {
  header: string;
  // Shows the settings button when given.
  changeSettings?: () => void;
};

const VisualHeader = ({ header, changeSettings }: VisualHeaderProps) => {
  const { activePage } = useGlobalState();
  return (
    <div
      className="visualHeader"
      style={{ visibility: activePage === "simulation" ? "visible" : "hidden" }}
    >
      <h1>{header}</h1>
      <OptionButton
        show={changeSettings !== undefined}
        changeSettings={changeSettings}
      />
    </div>
  );
};

export { VisualHeader };
