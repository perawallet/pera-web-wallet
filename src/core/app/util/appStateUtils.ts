import webStorage, {STORED_KEYS} from "../../util/storage/web/webStorage";

function getDefaultTheme() {
  const storedTheme = webStorage.local.getItem(STORED_KEYS.THEME) as AppTheme | null;
  let theme: AppTheme;

  if (
    storedTheme &&
    (storedTheme === "dark" || storedTheme === "light" || storedTheme === "system")
  ) {
    theme = storedTheme;
  } else {
    const systemTheme = getSystemTheme();

    theme = systemTheme;
  }

  return theme;
}

function getSystemTheme(): "dark" | "light" {
  const isBrowserDarkTheme =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

  return isBrowserDarkTheme ? "dark" : "light";
}

function getColorSchema(theme: AppTheme): "dark" | "light" {
  let colorSchema = theme;

  if (theme === "system") {
    colorSchema = getSystemTheme();
  }

  return colorSchema as "dark" | "light";
}

function isEmbeddedConnectFlows() {
  return (
    window.location.href.includes("/connect?embedded=true") ||
    window.location.href.includes("/transaction/sign?embedded=true")
  );
}

export {getDefaultTheme, getSystemTheme, getColorSchema, isEmbeddedConnectFlows};
