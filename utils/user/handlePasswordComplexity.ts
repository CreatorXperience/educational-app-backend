import passwordComplexity from "joi-password-complexity";

type TOptions = {
  min?: number;
  max?: number;
  symbol?: 1;
  numeric?: 1;
  upperCase?: 1;
  lowerCase?: 1;
};

const complexPassword = (userPass: string, options?: TOptions) => {
  if (options) {
    return passwordComplexity(options).validate(userPass);
  }
  let passwordOptions = {
    min: 10,
    max: 500,
    symbol: 1,
    numeric: 1,
    upperCase: 1,
    lowerCase: 1,
  };

  return passwordComplexity(passwordOptions).validate(userPass);
};

export default complexPassword;
