type SelectorButtonProps<T> = {
  header: string;
  option: T;
  selected: boolean;
  changeValue: (option: T) => void;
};

const SelectorButton = <T,>({
  header,
  option,
  selected,
  changeValue,
}: SelectorButtonProps<T>) => (
  <button
    type="button"
    className="selectorButton"
    onClick={() => changeValue(option)}
    style={{ backgroundColor: selected ? "#a8a8a8" : "lightgray" }}
  >
    <p>{header}</p>
  </button>
);

export { SelectorButton };
