import {getAssetUSDValue} from "./assetUtils";

describe("asset utils - getAssetUSDValue", () => {
  const cases = [
    {
      input: {
        asset: {
          asset_id: 444035862,
          name: "Zone",
          logo: null,
          unit_name: "ZONE",
          fraction_decimals: 6,
          total: "1000000000000000",
          usd_value: "0.001598920967",
          is_verified: true,
          verification_tier: "trusted",
          explorer_url: "https://explorer.perawallet.app/assets/444035862/",
          collectible: null,
          creator: {
            id: 1,
            address: "DSD64N54TOAORLOM77EGKC4N3L55N45WLXUV3I24HZBJLY5YX22VXATHTA",
            is_verified_asset_creator: true
          }
        } as Asset,
        amount: 10890000
      },
      output: "0.0174"
    },
    {
      input: {
        asset: {
          asset_id: 777628481,
          name: "HUMBLE LP - ALGO/USDC",
          logo: null,
          unit_name: "HMBL2LT",
          fraction_decimals: 6,
          total: "1000000000000000",
          usd_value: "0.898350542496",
          is_verified: true,
          verification_tier: "trusted",
          explorer_url:
            "https://explorer.perawallet.app/accounts/SVZS7Q7QMVHZONDHZJHR4564VTMEX3OQ5DSYBWKR5FJFTPZLVG3EZIWC34/",
          collectible: null,
          creator: {
            id: 1,
            address: "DSD64N54TOAORLOM77EGKC4N3L55N45WLXUV3I24HZBJLY5YX22VXATHTA",
            is_verified_asset_creator: true
          }
        } as Asset,
        amount: 1025450951
      },
      output: "921.2144"
    },
    {
      input: {
        asset: {
          asset_id: 470842789,
          name: "Defly Token",
          logo: null,
          unit_name: "DEFLY",
          fraction_decimals: 6,
          total: "1000000000000000",
          usd_value: "0.00342188629",
          is_verified: true,
          verification_tier: "verified",
          explorer_url: "https://explorer.perawallet.app/assets/470842789/",
          collectible: null,
          creator: {
            id: 1,
            address: "ZSASGQZ37L5SVV2VSEKBJTSRTNVPV3IJ7NEWM6BRCXY5AZD5HQLLVYU76I",
            is_verified_asset_creator: true
          }
        } as Asset,
        amount: 3196035871
      },
      output: "10.9365"
    }
  ];

  cases.forEach(({input, output}) => {
    it(`should return ${output} for ${input.amount}`, () => {
      expect(getAssetUSDValue({amount: input.amount, asset: input.asset})).toStrictEqual(
        output
      );
    });
  });
});
