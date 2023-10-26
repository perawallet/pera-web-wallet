export const PASSWORD_VALIDATION_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_\W])[a-zA-Z\d_\W]{12,}$/;

const VALIDATION_MESSAGE =
  "Minimum of 12 characters, at least 1 lowercase, 1 uppercase letter, 1 number and 1 special character.";
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

  if (!password.match(PASSWORD_VALIDATION_REGEX)) {
    validationInfo.password.push(VALIDATION_MESSAGE);
  }

  return validationInfo;
}

export {validatePasswordCreateForm};
