import "./_account-import-onboarding-option-list.scss";

function AccountImportOnboardingOptionListItemContent({
  icon,
  title,
  description,
  shouldShowNew,
  shouldShowComingSoon
}: {
  icon?: React.ReactNode;
  title: string;
  description: string;
  shouldShowNew?: boolean;
  shouldShowComingSoon?: boolean;
}) {
  return (
    <>
      {!!icon && (
        <div className={"account-import-onboarding-option-list__item-icon-container"}>
          {icon}
        </div>
      )}

      <p
        className={
          "typography--small-subhead account-import-onboarding-option-list__item-text"
        }>
        {`${title}`}

        {getStatusBadge()}
      </p>

      <p
        className={
          "typography--secondary-body text-color--gray account-import-onboarding-option-list__item-description"
        }>
        {description}
      </p>
    </>
  );

  function getStatusBadge() {
    let label = "";

    if (shouldShowComingSoon) {
      label = "COMING SOON";
    } else if (shouldShowNew) {
      label = "NEW";
    } else {
      return null;
    }

    return (
      <span
        className={
          "typography--tagline account-import-onboarding-option-list__item-text__new-label"
        }>
        {label}
      </span>
    );
  }
}

export default AccountImportOnboardingOptionListItemContent;
