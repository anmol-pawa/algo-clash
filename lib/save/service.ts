import type { SaveBackend } from "./backend";
import { migrateCore, SaveVersionError } from "./migrations";
import { SAVE_VERSION, newCoreSave, sanitizeAttempt, sanitizeDraft, type Attempt, type CoreSave, type Draft } from "./schema";

export const EXPORT_FORMAT = "algo-clash-save";

export interface ExportFile {
  format: typeof EXPORT_FORMAT;
  version: number;
  exportedAt: number;
  core: CoreSave;
  attempts: Attempt[];
  drafts: Draft[];
}

/** High-level save API on top of any backend. `now` is injectable for tests. */
export class SaveService {
  constructor(
    private readonly backend: SaveBackend,
    private readonly now: () => number = Date.now,
  ) {}

  /** Loads the save, migrating old versions and rewriting them. A missing or corrupt save yields a fresh one. */
  async load(): Promise<CoreSave> {
    const raw = await this.backend.getCore();
    if (raw === undefined) return newCoreSave(this.now());
    try {
      const core = migrateCore(raw, this.now());
      if ((raw as { version?: unknown }).version !== SAVE_VERSION) await this.backend.putCore(core);
      return core;
    } catch (e) {
      // A save from a newer game must not be overwritten by an older build.
      if (e instanceof SaveVersionError) throw e;
      return newCoreSave(this.now());
    }
  }

  save(core: CoreSave): Promise<void> {
    return this.backend.putCore(core);
  }

  async recordAttempt(attempt: Attempt): Promise<void> {
    const clean = sanitizeAttempt(attempt);
    if (!clean) throw new Error("Invalid attempt");
    await this.backend.addAttempt(clean);
  }

  async attempts(problemId?: string): Promise<Attempt[]> {
    const all = (await this.backend.listAttempts()).map(sanitizeAttempt).filter((a): a is Attempt => a !== null);
    return problemId ? all.filter((a) => a.problemId === problemId) : all;
  }

  saveDraft(problemId: string, code: string): Promise<void> {
    return this.backend.putDraft({ problemId, code, updatedAt: this.now() });
  }

  async loadDraft(problemId: string): Promise<Draft | null> {
    return sanitizeDraft(await this.backend.getDraft(problemId));
  }

  clearDraft(problemId: string): Promise<void> {
    return this.backend.deleteDraft(problemId);
  }

  async exportJson(): Promise<string> {
    const file: ExportFile = {
      format: EXPORT_FORMAT,
      version: SAVE_VERSION,
      exportedAt: this.now(),
      core: await this.load(),
      attempts: await this.attempts(),
      drafts: (await this.backend.listDrafts()).map(sanitizeDraft).filter((d): d is Draft => d !== null),
    };
    return JSON.stringify(file, null, 2);
  }

  /** Replaces the whole save with an exported file. Validates fully before touching storage. */
  async importJson(text: string): Promise<CoreSave> {
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error("That file is not valid JSON");
    }
    const f = (parsed && typeof parsed === "object" ? parsed : {}) as Partial<Record<keyof ExportFile, unknown>>;
    if (f.format !== EXPORT_FORMAT) throw new Error("That file is not an Algo Clash save");
    const core = migrateCore({ ...(f.core as object), version: f.version }, this.now());
    const attempts = (Array.isArray(f.attempts) ? f.attempts : []).map(sanitizeAttempt).filter((a): a is Attempt => a !== null);
    const drafts = (Array.isArray(f.drafts) ? f.drafts : []).map(sanitizeDraft).filter((d): d is Draft => d !== null);
    await this.backend.clear();
    await this.backend.putCore(core);
    for (const a of attempts) await this.backend.addAttempt(a);
    for (const d of drafts) await this.backend.putDraft(d);
    return core;
  }

  reset(): Promise<void> {
    return this.backend.clear();
  }
}
