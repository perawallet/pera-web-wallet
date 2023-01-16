/* eslint-disable max-lines */
import {generateKeyMapFromArray} from "../../array/arrayUtils";
import {stringToUint8Array, uint8ArrayToString} from "../../blob/blobUtils";
import {decryptSK, encryptSK, hashPassword} from "../../nacl/naclUtils";

// This is used to determine if the database needs to be upgraded.
// If you change the structure of the tables, you must increment this version number.
export const INDEXED_DB_VERSION = 7;

/**
 * TODO: Things to fix
 * - dbManager.get()() doesn't return the correct shape, fix it
 * - dbManager.set()() doesn't expect the correct shape, fix it
 * - Better error handling on the get and set methods
 * - Implement update methods
 */
class DBManager<Model extends {[x: string]: any}> {
  private databaseName: string | null = null;
  private tables: DBManagerTables | null = null;

  /**
   * Simple and minimalistic wrapper for browser's IndexedDB API
     Usage:
        - Create a new DBManager instance.
          - If you want to use a custom database shape, you can pass it to DBManager<MyDatabaseScheme>.
          - const dbManager = new DBManager<MyDatabaseScheme>("pera-wallet", [
            {
              transactions: {
                txn: Transaction,
                status: TransactionStatus,
              },
              app: {
                theme: "light" | "dark"
              }
            }
          ]);
        - Call dbManager.set("transactions")({
          txn: "0x123456789",
          status: "pending",
        }) to save a row to the "transactions" table.
        - Call dbManager.get("transactions")() to fetch all the records on the "transactions" table.
        - Call dbManager.get("app")("theme") to fetch the specific record on the "app" table.
        - Call dbManager.delete("app")("theme") to delete the specific record on the "app" table.

      Details on: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
   * 
   * @param database The name of the database
   * @param tables The tables to create in the objectStore
   */
  constructor(database: string, tables: DBManagerTables) {
    this.databaseName = database;
    this.tables = tables;

    this.connectDB();
  }

  private connectDB(): IDBOpenDBRequest {
    if (!this.tables || !this.databaseName) {
      throw new Error("Please provide a valid databaseName and database tables schema");
    }

    const {tables} = this;

    const dbRequest = indexedDB.open(this.databaseName!, INDEXED_DB_VERSION);

    // If the database requires an upgrade
    dbRequest.onupgradeneeded = () => {
      tables.forEach((table) => {
        // If the table doesn't exist, create it
        if (!dbRequest.result.objectStoreNames.contains(table.name)) {
          const objectStore = dbRequest.result.createObjectStore(table.name, {
            keyPath: table.keypath
          });

          // create  indexes
          if (table?.indexes) {
            for (const index of table.indexes) {
              const [name, keyPath, options] = index;

              objectStore.createIndex(name, keyPath, options);
            }
          }
        }
      });
    };

    return dbRequest;
  }

  public decryptTableEntries<T extends keyof Model, K extends keyof Model[T]>(
    table: T,
    encryptionKey: string
  ): (primaryKey: K) => Promise<Model[T]> {
    return (primaryKey: K) =>
      new Promise(async (resolve, reject) => {
        try {
          const entries = await this.getAllValues(table, {isEncrypted: true});

          const decryptedEntries = await Promise.all(
            entries.map((entry) => decryptSK(entry, encryptionKey, {stringify: true}))
          );

          resolve(
            generateKeyMapFromArray(
              decryptedEntries.map((decryptedEntry) =>
                JSON.parse(decryptedEntry, (key, value) => {
                  // encrypted values are JSON.stringified
                  // reviver function is needed to parse stringified dates
                  if (key === "date") {
                    return new Date(value);
                  }

                  return value;
                })
              ),
              primaryKey
            )
          );
        } catch (error) {
          reject(error);
        }
      });
  }

  public get<T extends keyof Model>(table: T, encryptionKey: string) {
    const dbRequest = this.connectDB();

    return <K extends keyof Model[T] | Model[T][number]>(key: K): Promise<Model[T][K]> =>
      new Promise((resolve, reject) => {
        dbRequest.onerror = (error) => {
          console.error(error);

          reject(error);
        };

        dbRequest.onsuccess = (event: Event) => {
          try {
            const transaction = (
              event.target as IDBRequest<IDBDatabase>
            ).result.transaction(table as string, "readwrite");
            const objectStore = transaction.objectStore(table as string);
            const hashedKey = hashPassword(JSON.stringify(key));

            const tableRequest: IDBRequest<ValueOf<Model[T]>> =
              objectStore.get(hashedKey);

            tableRequest.onerror = (error: any) => {
              reject(error);
            };

            tableRequest.onsuccess = async () => {
              try {
                const encryptedContent = JSON.parse(
                  uint8ArrayToString(await decryptSK(tableRequest.result, encryptionKey)),
                  (entryKey, value) => {
                    if (entryKey === "date") {
                      return new Date(value);
                    }

                    return value;
                  }
                );

                resolve(encryptedContent);
              } catch (error) {
                console.error(error);

                reject(error);
              }
            };
          } catch (error) {
            reject(error);
          }
        };
      });
  }

  public getAllValues<T extends keyof Model, K extends boolean = true>(
    table: T,
    options?: K extends true
      ? {isEncrypted: K; indexName?: string; keyRange?: never}
      : {isEncrypted: K; indexName?: string; keyRange?: IDBKeyRange}
  ): Promise<(K extends true ? string : ValueOf<Model[T]>)[]> {
    const dbRequest = this.connectDB();

    return new Promise((resolve, reject) => {
      dbRequest.onerror = (error) => {
        console.error(error);

        reject(error);
      };

      dbRequest.onsuccess = (event: Event) => {
        try {
          const {keyRange, indexName} = options || {};

          const transaction = (
            event.target as IDBRequest<IDBDatabase>
          ).result.transaction(table as string, "readwrite");
          let objectStore: IDBObjectStore | IDBIndex = transaction.objectStore(
            table as string
          );

          if (indexName) {
            objectStore = objectStore.index(indexName);
          }

          const getAllValuesRequest = objectStore.getAll(keyRange);

          getAllValuesRequest.onsuccess = (ev: any) => {
            resolve(
              (<K extends true ? string[] : Model[T][]>ev.target.result) as string[]
            );
          };
          getAllValuesRequest.onerror = (error) => {
            reject(error);
          };
        } catch (error) {
          reject(error);
        }
      };
    });
  }

  public getAllKeys<T extends keyof Model>(table: T): Promise<IDBValidKey[]> {
    const dbRequest = this.connectDB();

    return new Promise((resolve, reject) => {
      dbRequest.onerror = (error) => {
        reject(error);
      };

      dbRequest.onsuccess = () => {
        const transaction = dbRequest.result.transaction([table as string], "readwrite");
        const objectStore = transaction.objectStore(table as string);

        const tableRequest = objectStore.getAllKeys();

        tableRequest.onerror = (error: any) => {
          reject(error);
        };

        tableRequest.onsuccess = () => {
          resolve(tableRequest.result);
        };
      };
    });
  }

  public set<T extends keyof Model>(table: T, encryptionKey: string) {
    const dbRequest = this.connectDB();

    return <K extends keyof Model[T], V extends ValueOf<Model[T]>>(
      key: K,
      value: V
    ): Promise<string> =>
      new Promise((resolve, reject) => {
        dbRequest.onerror = (error) => {
          console.error(error);

          reject(error);
        };

        dbRequest.onsuccess = async () => {
          try {
            const transaction = dbRequest.result.transaction(
              [table as string],
              "readwrite"
            );
            const objectStore = transaction.objectStore(table as string);

            if (key && value) {
              const hashedKey = hashPassword(JSON.stringify(key));
              const encryptedValue = await encryptSK(
                stringToUint8Array(JSON.stringify(value)),
                encryptionKey
              );

              const tableRequest = objectStore.put(
                encryptedValue,
                hashedKey as IDBValidKey
              );

              tableRequest.onerror = (error: any) => {
                reject(error);
              };

              tableRequest.onsuccess = () => {
                resolve(tableRequest.result as string);
              };
            }
          } catch (error) {
            console.error(error);

            reject(error);
          }
        };
      });
  }

  public setAll<T extends keyof Model>(table: T) {
    const dbRequest = this.connectDB();

    return <V extends Model[T]>(entries: V[]): Promise<boolean> =>
      new Promise((resolve, reject) => {
        dbRequest.onerror = (error) => {
          console.error(error);

          reject(error);
        };

        dbRequest.onsuccess = () => {
          const transaction = dbRequest.result.transaction(
            [table as string],
            "readwrite"
          );

          for (const entry of entries) {
            transaction.objectStore(table as string).put(entry, undefined);
          }

          transaction.oncomplete = () => {
            resolve(true);
          };

          transaction.onerror = (error) => {
            console.error(error);
            reject(error);
          };
        };
      });
  }

  public delete<T extends keyof Model>(table: T) {
    const dbRequest = this.connectDB();

    return ({
      key,
      encryptionKey
    }:
      | {key: string; encryptionKey: string}
      | {key: IDBKeyRange; encryptionKey?: never}): Promise<ValueOf<Model[T]>> =>
      new Promise((resolve, reject) => {
        dbRequest.onerror = (error) => {
          console.error(error);

          reject(error);
        };

        dbRequest.onsuccess = () => {
          try {
            const transaction = dbRequest.result.transaction(
              [table as string],
              "readwrite"
            );
            const objectStore = transaction.objectStore(table as string);
            const idbKey = encryptionKey ? hashPassword(JSON.stringify(key)) : key;

            const tableRequest = objectStore.delete(idbKey);

            tableRequest.onerror = (error: any) => {
              reject(error);
            };

            tableRequest.onsuccess = () => {
              resolve(tableRequest.result);
            };
          } catch (error) {
            console.error(error);

            reject(error);
          }
        };
      });
  }

  public clearTable<T extends keyof Model>(tables: T[]) {
    const dbRequest = this.connectDB();

    return new Promise((resolve, reject) => {
      dbRequest.onerror = (error) => {
        console.error(error);

        reject(error);
      };

      dbRequest.onsuccess = () => {
        try {
          const transaction = dbRequest.result.transaction(
            tables as string[],
            "readwrite"
          );

          tables.forEach((table) => {
            transaction.objectStore(table as string).clear();
          });

          transaction.onerror = (error: any) => {
            reject(error);
          };

          transaction.oncomplete = () => {
            resolve(true);
          };
        } catch (error) {
          console.error(error);

          reject(error);
        }
      };
    });
  }

  public reset() {
    const dbRequest = this.connectDB();

    return new Promise((resolve, reject) => {
      dbRequest.onerror = (error) => {
        console.error(error);
        reject(error);
      };

      dbRequest.onsuccess = () => {
        this.tables?.forEach((table) => {
          const transaction = dbRequest.result.transaction(table.name, "readwrite");
          const objectStore = transaction.objectStore(table.name);

          objectStore.clear();

          transaction.onerror = (error) => {
            console.error(error);
            reject(error);
          };
        });
        resolve(dbRequest.result);
      };
    });
  }
}

export {DBManager};
