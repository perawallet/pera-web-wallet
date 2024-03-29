// 3rd party CSS imports should come here
import "@hipo/react-ui-toolkit/dist/main.css";

import "./core/ui/typography/_fonts.scss";
import "./core/ui/typography/_typography.scss";
import "./core/ui/style/override/_override.scss";
import "./core/ui/style/_align.scss";
import "./core/ui/style/_measure.scss";
import "./core/ui/style/_common.scss";
import "./core/ui/style/color/_global-colors.scss";
import "./core/ui/style/color/_shadow.scss";
import "./core/ui/style/color/_theme.scss";
import "./core/ui/style/color/_theme.dark.scss";
import "./core/ui/style/color/_button-colors.scss";

// animation
import "./core/ui/style/util/animate/_slide-in.scss";
import "./core/ui/style/util/animate/_show-up.scss";

// 3rd party CSS override imports should come here
import "./core/ui/style/override/hipo-ui-toolkit/_button.scss";
import "./core/ui/style/override/hipo-ui-toolkit/_form.scss";
import "./core/ui/style/override/hipo-ui-toolkit/_input.scss";
import "./core/ui/style/override/hipo-ui-toolkit/_checkbox-input.scss";
import "./core/ui/style/override/hipo-ui-toolkit/_toggle.scss";
import "./core/ui/style/override/hipo-ui-toolkit/_tab.scss";
import "./core/ui/style/override/hipo-ui-toolkit/_select.scss";

import React from "react";
import {createRoot} from "react-dom/client";
import {BrowserRouter} from "react-router-dom";
import {ToastContextProvider} from "@hipo/react-ui-toolkit";
import WebFont from "webfontloader";

import App from "./core/app/App";
import reportWebVitals from "./core/reportWebVitals";
import {AppContextProvider} from "./core/app/AppContext";
import {AppState} from "./core/app/appStateReducer";
import ModalContextProvider from "./component/modal/context/ModalContextProvider";
import {SimpleToastContextProvider} from "./component/simple-toast/SimpleToastProvider";
import {isFirefoxPrivate, isSmallMobileDevice} from "./core/util/device/deviceUtils";
import MobileLandingPage from "./not-supported/mobile/MobileLandingPage";
import FirefoxIncognitoLandingPage from "./not-supported/firefox-incognito/FirefoxIncognitoLandingPage";
import {isProductionBuild} from "./core/util/environment/environmentConstants";
import {updateAPIsPreferredNetwork} from "./core/api/apiUtils";
import {PortfolioContextProvider} from "./overview/context/PortfolioOverviewContext";
import NavigationContextProvider from "./core/route/context/NavigationContext";
import {getCommonAppState} from "./core/util/storage/web/webStorageUtils";
import {appDBManager} from "./core/app/db";
import ScrollToTop from "./component/scroll-to-top/ScrollToTop";

const root = createRoot(document.getElementById("root")!);

if (isSmallMobileDevice()) {
  root.render(
    <React.StrictMode>
      <MobileLandingPage />
    </React.StrictMode>
  );
} else {
  (async () => {
    try {
      if (await isFirefoxPrivate()) {
        root.render(
          <React.StrictMode>
            <FirefoxIncognitoLandingPage />
          </React.StrictMode>
        );
      }

      const {
        theme,
        preferredNetwork: storedNetwork,
        hashedMasterkey
      } = getCommonAppState();

      const accountKeys = await appDBManager.getAllKeys("accounts");

      const preferredNetwork =
        storedNetwork || (isProductionBuild ? "mainnet" : "testnet");

      updateAPIsPreferredNetwork(preferredNetwork);

      bootstrapApp({
        theme,
        preferredNetwork,
        hashedMasterkey,
        sessions: {},
        hasAccounts: accountKeys.length > 0
      });

      WebFont.load({
        custom: {
          families: ["Milan", "DMSans"],
          urls: ["./core/ui/typography/_fonts.scss"]
        }
      });
    } catch (error) {
      // handle indexedDB error state
      console.error(error);
    }
  })();
}

function bootstrapApp(initialAppStateFromDB: AppState) {
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <ScrollToTop>
          <AppContextProvider initialAppStateFromDB={initialAppStateFromDB}>
            <PortfolioContextProvider>
              <ToastContextProvider>
                <SimpleToastContextProvider>
                  <ModalContextProvider>
                    <NavigationContextProvider>
                      <App />
                    </NavigationContextProvider>
                  </ModalContextProvider>
                </SimpleToastContextProvider>
              </ToastContextProvider>
            </PortfolioContextProvider>
          </AppContextProvider>
        </ScrollToTop>
      </BrowserRouter>
    </React.StrictMode>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
