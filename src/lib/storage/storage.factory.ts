import { IStorageAdapter } from "./adapter.interface";
import { MemoryAdapter } from "./memory.adapter";
import { PostgresAdapter } from "./postgres.adapter";

let storageInstance: IStorageAdapter | null = null;

export function getStorage(): IStorageAdapter {
  if (storageInstance) {
    return storageInstance;
  }

  const storageType = process.env.STORAGE_TYPE || "memory";

  if (storageType === "postgres") {
    storageInstance = new PostgresAdapter();
  } else {
    storageInstance = new MemoryAdapter();
  }

  return storageInstance;
}

export function resetStorage(): void {
  storageInstance = null;
}
