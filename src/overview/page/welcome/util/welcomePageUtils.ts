function generateWelcomePageCopies(hasMasterkey: boolean) {
  return hasMasterkey
    ? {
        title: "Now, add your first account"
      }
    : {
        title: "Welcome to Pera Wallet",
        description:
          "Pera Wallet is the easiest and safest way to store, buy and swap on the Algorand blockchain."
      };
}

export {generateWelcomePageCopies};
