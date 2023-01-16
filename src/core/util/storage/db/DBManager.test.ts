/* eslint-disable no-magic-numbers */
// @ts-ignore there is no ts support for fake-indexeddb
import "fake-indexeddb/auto";
// @ts-ignore there is no ts support for fake-indexeddb
import FDBFactory from "fake-indexeddb/lib/FDBFactory";
// The easiest way to use it is to import fake-indexeddb/auto
// which will put all the IndexedDB objects in the global scope.
// Whenever you want a fresh indexedDB
// const FDBFactory = require("fake-indexeddb/lib/FDBFactory");
// indexedDB = new FDBFactory();

import {appDBManager, assetDBManager} from "../../../app/db";
import {appDBTables} from "../../../app/db/appDBManager";
import {assetDBTables} from "../../../app/db/assetDBManager";
import {stringToUint8Array, uint8ArrayToString} from "../../blob/blobUtils";
import {decryptSK, encryptSK, hashPassword} from "../../nacl/naclUtils";
import {INDEXED_DB_VERSION} from "./DBManager";

const today = new Date();

const MOCK_ACCOUNTS = [
  {
    name: "a1",
    address: "acccountaddress1",
    pk: "1",
    date: today
  },
  {
    name: "a2",
    address: "acccountaddress2",
    pk: "2",
    date: new Date(today.getDate() + 1)
  }
];

const ENCRYPTION_KEY = "hipo";

// mock data insertion into indexedDB
async function initIndexedDB() {
  const dbRequest = indexedDB.open("pera-wallet", INDEXED_DB_VERSION);
  const assetDbRequest = indexedDB.open("pera-wallet-assets", INDEXED_DB_VERSION);

  dbRequest.onupgradeneeded = () => {
    appDBTables.forEach((table) => {
      dbRequest.result.createObjectStore(table.name);
    });
  };

  assetDbRequest.onupgradeneeded = () => {
    assetDBTables.forEach((table) => {
      dbRequest.result.createObjectStore(table.name, {
        keyPath: table.keypath
      });
    });
  };

  dbRequest.onsuccess = async (event: Event) => {
    // accounts table
    const accountsTxn = (event.target as IDBRequest<IDBDatabase>).result.transaction(
      "accounts",
      "readwrite"
    );
    const accountsStore = accountsTxn.objectStore("accounts");

    for (const mockAccount of MOCK_ACCOUNTS) {
      const hashedKey = hashPassword(JSON.stringify(mockAccount.address));

      const encryptedAccount = await encryptSK(
        stringToUint8Array(JSON.stringify(mockAccount)),
        ENCRYPTION_KEY
      );

      accountsStore.add(encryptedAccount, hashedKey);
    }
  };

  // this is needed to wait for indexedDB insertions to be completed
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(1);
    }, 500);
  });
}

describe("DBManager/indexedDB", () => {
  beforeEach(async () => {
    await initIndexedDB();
  });

  it("`pera-wallet` and appDBManager should be initialized", async () => {
    const idbDatabases = await indexedDB.databases();

    expect(idbDatabases).toHaveLength(2);
    expect(appDBManager).toBeDefined();
    expect(assetDBManager).toBeDefined();
  });

  describe("getAll method", () => {
    it("get all predefined accounts length", async () => {
      const accounts = await appDBManager.getAllValues("accounts");

      expect(accounts.length).toEqual(MOCK_ACCOUNTS.length);
    });
  });

  describe("encrypted set and get method", () => {
    it("set method encrypted", async () => {
      const account3 = {
        name: "a3",
        address: "acccountaddress3",
        pk: "3",
        date: new Date(today.getDate() + 2)
      };

      try {
        await appDBManager.set("accounts", ENCRYPTION_KEY)(account3.address, account3);

        const getMethodResult = await appDBManager.get(
          "accounts",
          ENCRYPTION_KEY
        )(account3.address);

        const idbObj = await new Promise((resolve) => {
          const idbReq = indexedDB.open("pera-wallet");

          idbReq.onsuccess = (event: any) => {
            const idb = event.target.result;
            const txn = idb.transaction(["accounts"], "readonly");
            const objStore = txn!.objectStore("accounts");

            const hashedKey = hashPassword(JSON.stringify(account3.address));
            const tableReq = objStore.get(hashedKey);

            tableReq.onsuccess = async () => {
              const decryptedContent = await decryptSK(tableReq.result, ENCRYPTION_KEY);

              resolve(JSON.parse(uint8ArrayToString(decryptedContent)));
            };
          };
        });

        expect(idbObj).not.toMatchObject(account3);
        expect(idbObj).toHaveProperty("address", account3.address);
        expect(getMethodResult).toMatchObject(account3);
      } catch (error) {
        console.error(error);
      }
    });
  });
});
