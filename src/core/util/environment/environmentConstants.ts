const isProductionBuild = process.env.REACT_APP_BUILD_ENVIRONMENT === "production";
const isStagingBuild = process.env.REACT_APP_BUILD_ENVIRONMENT === "staging";
const isLocalBuild = process.env.REACT_APP_BUILD_ENVIRONMENT === "local";

const isOnStagingOrLocal = isLocalBuild || isStagingBuild;

export {isProductionBuild, isStagingBuild, isLocalBuild, isOnStagingOrLocal};
