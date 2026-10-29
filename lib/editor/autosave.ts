/** Where drafts go; `SaveService` satisfies this. */
export interface DraftStore {
  saveDraft(problemId: string, code: string): Promise<void>;
  loadDraft(problemId: string): Promise<{ code: string } | null>;
}

export interface Scheduler {
  every(ms: number, fn: () => void): () => void;
}

export const defaultScheduler: Scheduler = {
  every(ms, fn) {
    const id = setInterval(fn, ms);
    return () => clearInterval(id);
  },
};

export const AUTOSAVE_MS = 5000;

/**
 * Saves the latest code every `AUTOSAVE_MS` while it differs from what was last persisted.
 * Never throws: a failed write keeps the code dirty so the next tick retries.
 */
export class DraftAutosaver {
  private latest: string;
  private saved: string;
  private stop: (() => void) | null = null;
  private inFlight: Promise<void> = Promise.resolve();

  constructor(
    private readonly store: DraftStore,
    private readonly problemId: string,
    initial: string,
    private readonly scheduler: Scheduler = defaultScheduler,
  ) {
    this.latest = initial;
    this.saved = initial;
  }

  start(): void {
    this.stop ??= this.scheduler.every(AUTOSAVE_MS, () => void this.flush());
  }

  dispose(): Promise<void> {
    this.stop?.();
    this.stop = null;
    return this.flush();
  }

  update(code: string): void {
    this.latest = code;
  }

  get dirty(): boolean {
    return this.latest !== this.saved;
  }

  flush(): Promise<void> {
    this.inFlight = this.inFlight.then(async () => {
      const code = this.latest;
      if (code === this.saved) return;
      try {
        await this.store.saveDraft(this.problemId, code);
        this.saved = code;
      } catch {
        // storage unavailable (private mode, quota): stay dirty and retry on the next tick
      }
    });
    return this.inFlight;
  }
}

/** The draft to start from: the saved one if it exists and is non-empty, else the starter code. */
export async function restoreDraft(store: DraftStore, problemId: string, starter: string): Promise<string> {
  try {
    const d = await store.loadDraft(problemId);
    return d && d.code.trim() !== "" ? d.code : starter;
  } catch {
    return starter;
  }
}
