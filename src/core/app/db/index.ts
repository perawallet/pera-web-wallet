import {DBManager} from "../../util/storage/db/DBManager";
import {appDBTables} from "./appDBManager";
import {AssetDBManager, assetDBTables} from "./assetDBManager";

const appDBManager = new DBManager<AppDBScheme>("pera-wallet", appDBTables);
const assetDBManager = new AssetDBManager<AssetDBScheme>(assetDBTables);

export {appDBManager, assetDBManager};
