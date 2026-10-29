/** Where drafts are written. `SaveService` satisfies this. */
export interface DraftSink {
  saveDraft(problemId: string, code: string): Promise<void>;
}

export interface Timers {
  set(fn: () => void, ms: number): unknown;
  clear(handle: unknown): void;
}

const realTimers: Timers = {
  set: (fn, ms) => setTimeout(fn, ms),
  clear: (h) => clearTimeout(h as ReturnType<typeof setTimeout>),
};

export const AUTOSAVE_INTERVAL_MS = 5000;

/**
 * Throttled draft saver: the first change after a save starts a timer, later changes only update the pending
 * text, so a draft is written at most once per interval and never lags more than one interval behind typing.
 * Code equal to the last saved (or initial) text is never written.
 */
export class DraftAutosaver {
  private pending: string | null = null;
  private saved: string;
  private handle: unknown = null;
  private disposed = false;

  constructor(
    private readonly sink: DraftSink,
    private readonly problemId: string,
    initial: string,
    private readonly intervalMs = AUTOSAVE_INTERVAL_MS,
    private readonly timers: Timers = realTimers,
  ) {
    this.saved = initial;
  }

  update(code: string): void {
    if (this.disposed) return;
    this.pending = code;
    if (this.handle === null) this.handle = this.timers.set(() => void this.flush(), this.intervalMs);
  }

  /** Writes the pending text now (also used on tab hide and unmount). Resolves once stored; storage errors are swallowed. */
  async flush(): Promise<void> {
    if (this.handle !== null) {
      this.timers.clear(this.handle);
      this.handle = null;
    }
    const code = this.pending;
    this.pending = null;
    if (code === null || code === this.saved) return;
    this.saved = code;
    try {
      await this.sink.saveDraft(this.problemId, code);
    } catch {
      this.saved = ""; // Force a retry on the next change.
    }
  }

  /** Marks `code` as already stored (after a manual restore or a clear) so it is not rewritten. */
  markSaved(code: string): void {
    this.saved = code;
    this.pending = null;
  }

  dispose(): Promise<void> {
    const done = this.flush();
    this.disposed = true;
    return done;
  }
}
