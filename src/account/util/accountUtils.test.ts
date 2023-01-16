import {validateAccountCreateForm} from "./accountUtils";

describe("account utils", () => {
  it("getWarningsWithInvalidAccountName", () => {
    const newAccountName = "my account";
    const accounts = {
      account1: {
        type: "standard",
        address: "0x0...",
        pk: "K7BWxz...",
        name: "my account",
        date: new Date()
      } as AppDBAccount
    };
    const validationError = validateAccountCreateForm(accounts, newAccountName);

    expect(validationError).toEqual({
      type: "ACCOUNT_NAME_EXISTS",
      title: "Account name already exists",
      message: ["Please choose another name"]
    });
  });

  it("notGetWarningsWithValidAccountName", () => {
    const newAccountName = "my account 2";
    const accounts = {
      account1: {
        type: "standard",
        address: "0x0...",
        pk: "K7BWxz...",
        name: "my account",
        date: new Date()
      } as AppDBAccount
    };
    const validationError = validateAccountCreateForm(accounts, newAccountName);

    expect(validationError).toEqual(undefined);
  });
});
