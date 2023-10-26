import webStorage, {STORED_KEYS} from "../../../core/util/storage/web/webStorage";

function getHiddenBanners(): string[] {
  return (webStorage.local.getItem(STORED_KEYS.HIDDEN_BANNERS) || []) as string[];
}

export {getHiddenBanners};
