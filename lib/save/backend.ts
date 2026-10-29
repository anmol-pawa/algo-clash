import type { Attempt, CoreSave, Draft } from "./schema";

/** Storage contract. The IndexedDB adapter and the in-memory test double both implement it. */
export interface SaveBackend {
  getCore(): Promise<unknown | undefined>;
  putCore(core: CoreSave): Promise<void>;
  addAttempt(attempt: Attempt): Promise<void>;
  listAttempts(): Promise<unknown[]>;
  getDraft(problemId: string): Promise<unknown | undefined>;
  putDraft(draft: Draft): Promise<void>;
  deleteDraft(problemId: string): Promise<void>;
  listDrafts(): Promise<unknown[]>;
  /** Wipes everything (used by import-replace and "reset save"). */
  clear(): Promise<void>;
}

export class MemoryBackend implements SaveBackend {
  private core: unknown;
  private attempts: unknown[] = [];
  private drafts = new Map<string, unknown>();

  async getCore() {
    return this.core === undefined ? undefined : structuredClone(this.core);
  }
  async putCore(core: CoreSave) {
    this.core = structuredClone(core);
  }
  async addAttempt(a: Attempt) {
    this.attempts.push(structuredClone(a));
  }
  async listAttempts() {
    return structuredClone(this.attempts);
  }
  async getDraft(id: string) {
    const d = this.drafts.get(id);
    return d === undefined ? undefined : structuredClone(d);
  }
  async putDraft(d: Draft) {
    this.drafts.set(d.problemId, structuredClone(d));
  }
  async deleteDraft(id: string) {
    this.drafts.delete(id);
  }
  async listDrafts() {
    return structuredClone([...this.drafts.values()]);
  }
  async clear() {
    this.core = undefined;
    this.attempts = [];
    this.drafts.clear();
  }
}
