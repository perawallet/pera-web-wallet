import {
  CONFIRMATION_MESSAGE,
  validatePasswordCreateForm,
  VALIDATION_MESSAGE
} from "./passwordUtils";

const invalidPassword = "qwerty";
const invalidPasswordConfirmation = "qwerty1";
const validPassword = "StrongPassword1";
const validPasswordConfirmation = "StrongPassword1";

describe("password utils", () => {
  it("ValidationInfoFail", () => {
    const testPassword = invalidPassword;
    const testPasswordConfirmation = invalidPasswordConfirmation;

    const validationInfo = validatePasswordCreateForm(
      testPassword,
      testPasswordConfirmation
    );
    const expectedValidationInfo = {
      message: [VALIDATION_MESSAGE],
      password: [VALIDATION_MESSAGE, VALIDATION_MESSAGE],
      passwordConfirmation: [CONFIRMATION_MESSAGE]
    };

    expect(validationInfo).toEqual(expectedValidationInfo);
  });

  it("ValidationInfoPass", () => {
    const testPassword = validPassword;
    const testPasswordConfirmation = validPasswordConfirmation;

    const validationInfo = validatePasswordCreateForm(
      testPassword,
      testPasswordConfirmation
    );
    const expectedValidationInfo = {
      message: [VALIDATION_MESSAGE],
      password: [],
      passwordConfirmation: []
    };

    expect(validationInfo).toEqual(expectedValidationInfo);
  });
});
