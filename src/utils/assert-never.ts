// Exhaustiveness guard for `switch` defaults: fails to compile when a case is
// missing, and throws if an unexpected value still arrives at runtime.
const assertNever = (value: never): never => {
  throw new Error(`Unexpected value: ${JSON.stringify(value)}`);
};

export { assertNever };
