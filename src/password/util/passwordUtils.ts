const PASSWORD_VALIDATIONS: Record<string, RegExp> = {
  letterRule: /[a-zA-Z]/,
  numberRule: /[0-9]/g,
  minLengthRule: /.{8,}/
};
const VALIDATION_MESSAGE =
  "Minimum of 8 characters, at least 1 letter (A-Z) and 1 number (0-9).";
const CONFIRMATION_MESSAGE = "Passwords do not match.";

type PasswordCreateFormValidationInfo = Record<
  "message" | "password" | "passwordConfirmation",
  string[]
>;

function validatePasswordCreateForm(
  password: string,
  passwordConfirmation: string
): PasswordCreateFormValidationInfo {
  const validationInfo: PasswordCreateFormValidationInfo = {
    message: [VALIDATION_MESSAGE] as string[],
    password: [] as string[],
    passwordConfirmation: [] as string[]
  };

  if (password !== passwordConfirmation && password && passwordConfirmation) {
    validationInfo.passwordConfirmation.push(CONFIRMATION_MESSAGE);
  }

  Object.values(PASSWORD_VALIDATIONS).forEach((rule) => {
    if (!password.match(rule)) {
      validationInfo.password.push(VALIDATION_MESSAGE);
    }
  });

  return validationInfo;
}

export {
  validatePasswordCreateForm,
  PASSWORD_VALIDATIONS,
  VALIDATION_MESSAGE,
  CONFIRMATION_MESSAGE
};
