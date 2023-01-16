import {AccountASA} from "../../util/pera/api/peraApiModels";
import {DBManager} from "../../util/storage/db/DBManager";

export const assetDBTables: DBManagerTables = [
  {
    name: "assets",
    keypath: ["address", "asset_id"],
    autoIncrement: false,
    indexes: [
      ["address", "address"],
      ["asset_id", "asset_id"]
    ]
  },
  {
    name: "assets_testnet",
    keypath: ["address", "asset_id"],
    autoIncrement: false,
    indexes: [
      ["address", "address"],
      ["asset_id", "asset_id"]
    ]
  }
];

export class AssetDBManager<Model extends {[x: string]: any}> extends DBManager<Model> {
  private table: "assets" | "assets_testnet";

  constructor(tables: DBManagerTables) {
    super("pera-wallet-assets", tables);

    this.table = "assets";
  }

  updateTable(network: NetworkToggle) {
    this.table = network === "testnet" ? "assets_testnet" : "assets";
  }

  getAllByAccountAddress(address: string): Promise<AccountASA[]> {
    const keyRange = IDBKeyRange.only(address);

    return this.getAllValues(this.table, {
      indexName: "address",
      keyRange,
      isEncrypted: false
    });
  }

  deleteAllByAccountAddress(address: string) {
    const keyRange = IDBKeyRange.bound([address, 0], [address, Number.MAX_SAFE_INTEGER]);

    return this.delete(this.table)({key: keyRange});
  }

  setAllAssets() {
    return this.setAll(this.table);
  }
}
