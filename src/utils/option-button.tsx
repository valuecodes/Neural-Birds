import { images } from "./images";

type OptionButtonProps = {
  show: boolean;
  changeSettings?: () => void;
};

const OptionButton = ({ show, changeSettings }: OptionButtonProps) => {
  if (!show) {
    return null;
  }
  return (
    <button type="button" onClick={changeSettings}>
      <img alt="optionImage" className="optionImage" src={images.options} />
    </button>
  );
};

export { OptionButton };
