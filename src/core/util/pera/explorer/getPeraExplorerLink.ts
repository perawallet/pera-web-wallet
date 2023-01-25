// TODO add other types here in case of need
type PeraExplorerLinkType = "account-detail" | "asset-detail";

function getPeraExplorerLink({
  network,
  type,
  id
}: {
  network: NetworkToggle;
  type: PeraExplorerLinkType;
  id: string;
}): string {
  const origin =
    network === "mainnet"
      ? "https://explorer.perawallet.app"
      : "https://testnet.explorer.perawallet.app";
  let link = "";

  switch (type) {
    case "account-detail":
      link = `${origin}/accounts/${encodeURIComponent(id)}`;
      break;

    case "asset-detail":
      link = `${origin}/assets/${encodeURIComponent(id)}`;
      break;

    default:
      break;
  }

  return link;
}

export {getPeraExplorerLink};
