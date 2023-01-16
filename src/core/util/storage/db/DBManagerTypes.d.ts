type DBManagerTable = {
  name: string;
  keypath?: string | string[];
  autoIncrement: boolean;
  indexes?: Parameters<IDBObjectStore["createIndex"]>[];
};
type DBManagerTables = DBManagerTable[];
