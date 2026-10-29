import type { SaveBackend } from "./backend";
import type { Attempt, CoreSave, Draft } from "./schema";

const DB_NAME = "algo-clash";
const DB_VERSION = 1;
const CORE_KEY = "main";

function wrap<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function done(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error ?? new Error("IndexedDB transaction aborted"));
  });
}

/**
 * Browser backend. Stores: `core` (one record), `attempts` (append-only, indexed by problem) and
 * `drafts` (keyed by problem id). Bumping DB_VERSION needs an `onupgradeneeded` branch per version.
 */
export class IdbBackend implements SaveBackend {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private db(): Promise<IDBDatabase> {
    this.dbPromise ??= new Promise((resolve, reject) => {
      const open = indexedDB.open(DB_NAME, DB_VERSION);
      open.onupgradeneeded = () => {
        const db = open.result;
        if (!db.objectStoreNames.contains("core")) db.createObjectStore("core");
        if (!db.objectStoreNames.contains("attempts")) {
          db.createObjectStore("attempts", { autoIncrement: true }).createIndex("problemId", "problemId");
        }
        if (!db.objectStoreNames.contains("drafts")) db.createObjectStore("drafts", { keyPath: "problemId" });
      };
      open.onsuccess = () => resolve(open.result);
      open.onerror = () => reject(open.error);
    });
    return this.dbPromise;
  }

  private async store(name: "core" | "attempts" | "drafts", mode: IDBTransactionMode) {
    const tx = (await this.db()).transaction(name, mode);
    return { store: tx.objectStore(name), tx };
  }

  async getCore() {
    const { store } = await this.store("core", "readonly");
    return wrap(store.get(CORE_KEY));
  }
  async putCore(core: CoreSave) {
    const { store, tx } = await this.store("core", "readwrite");
    store.put(core, CORE_KEY);
    await done(tx);
  }
  async addAttempt(a: Attempt) {
    const { store, tx } = await this.store("attempts", "readwrite");
    store.add(a);
    await done(tx);
  }
  async listAttempts() {
    const { store } = await this.store("attempts", "readonly");
    return wrap(store.getAll());
  }
  async getDraft(id: string) {
    const { store } = await this.store("drafts", "readonly");
    return wrap(store.get(id));
  }
  async putDraft(d: Draft) {
    const { store, tx } = await this.store("drafts", "readwrite");
    store.put(d);
    await done(tx);
  }
  async deleteDraft(id: string) {
    const { store, tx } = await this.store("drafts", "readwrite");
    store.delete(id);
    await done(tx);
  }
  async listDrafts() {
    const { store } = await this.store("drafts", "readonly");
    return wrap(store.getAll());
  }
  async clear() {
    const db = await this.db();
    const tx = db.transaction(["core", "attempts", "drafts"], "readwrite");
    for (const n of ["core", "attempts", "drafts"]) tx.objectStore(n).clear();
    await done(tx);
  }
}
