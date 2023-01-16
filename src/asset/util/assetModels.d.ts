type AssetVerificationTier = "trusted" | "verified" | "unverified" | "suspicious";

type AssetMedia = "image" | "video" | "mixed" | "unknown";

interface Collectible {
  standard: "arc3" | "arc69";
  media_type: ASAMediaType;
  primary_image: string;
  title: string;
  explorer_url: string;
  media: {
    type: ASAMediaType;
    download_url: string;
    preview_url?: string;
    extension: string;
  }[];
  description: string;
}

interface AssetCreator {
  id: number;
  address: string;
  is_verified_asset_creator: boolean;
}

interface AccountAsset {
  amount: number;
  "asset-id": number;
  "is-frozen": boolean;
}

interface Asset {
  asset_id: number;
  name: string;
  logo: string | null;
  unit_name: string;
  fraction_decimals: number;
  total: string;
  usd_value: string | null;
  is_verified: boolean;
  verification_tier: AssetVerificationTier;
  explorer_url: string;
  collectible: Collectible | null;
  creator: AssetCreator;
}

type ListAssetRequestParams = ListRequestParams & {
  q?: string;
  asset_ids?: string;
};
