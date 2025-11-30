import { IStorageAdapter } from "./adapter.interface";
import { MemoryAdapter } from "./memory.adapter";
import { TypeOrmAdapter } from "./typeorm.adapter";

const globalForStorage = globalThis as unknown as {
  storageInstance?: IStorageAdapter;
};

export function getStorage(): IStorageAdapter {
  if (!globalForStorage.storageInstance) {
    const storageType = process.env.STORAGE_TYPE || "memory";

    globalForStorage.storageInstance =
      storageType === "typeorm" || storageType === "postgres"
        ? new TypeOrmAdapter()
        : new MemoryAdapter();
  }

  return globalForStorage.storageInstance;
}

export function resetStorage(): void {
  globalForStorage.storageInstance = undefined;
}
