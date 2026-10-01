type CheckBoxInputProps<T> = {
  header: string;
  option: T;
  checked: (option: T) => void;
};

const CheckBoxInput = <T,>({
  header,
  option,
  checked,
}: CheckBoxInputProps<T>) => (
  <div className="checkBoxInput">
    <input
      className="checkBox"
      type="checkbox"
      aria-label={header}
      onClick={() => checked(option)}
    />
    <p>{header}</p>
  </div>
);

export { CheckBoxInput };
