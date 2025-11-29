import { IStorageAdapter } from "./adapter.interface";
import { MemoryAdapter } from "./memory.adapter";
import { TypeOrmAdapter } from "./typeorm.adapter";

let storageInstance: IStorageAdapter | null = null;

export function getStorage(): IStorageAdapter {
  if (storageInstance) {
    return storageInstance;
  }

  const storageType = process.env.STORAGE_TYPE || "memory";

  if (storageType === "typeorm" || storageType === "postgres") {
    storageInstance = new TypeOrmAdapter();
  } else {
    storageInstance = new MemoryAdapter();
  }

  return storageInstance;
}

export function resetStorage(): void {
  storageInstance = null;
}
