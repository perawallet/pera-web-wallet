import ROUTES from "../../../../core/route/routes";

function getPageHeaderBackButtonText(goBackLink: string) {
  let text = "";

  switch (goBackLink) {
    case ROUTES.ACCOUNT.ROUTE:
      text = "Add Account";
      break;

    case ROUTES.OVERVIEW.ROUTE:
      text = "Accounts";
      break;

    case ROUTES.BASE:
      text = "Home";
      break;

    default:
      break;
  }

  return `Back to ${text}`;
}

export {getPageHeaderBackButtonText};
