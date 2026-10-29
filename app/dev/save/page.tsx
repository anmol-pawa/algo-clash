"use client";

import { useRef, useState } from "react";
import { IdbBackend } from "@/lib/save/idb";
import { SaveService } from "@/lib/save/service";

export default function SaveDev() {
  const svc = useRef<SaveService | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const say = (m: string) => setLog((l) => [...l, m]);
  const get = () => (svc.current ??= new SaveService(new IdbBackend()));

  const roundTrip = async () => {
    try {
      const s = get();
      await s.reset();
      const core = await s.load();
      core.profile.name = "Ada";
      core.profile.bits = 42;
      await s.save(core);
      await s.recordAttempt({ problemId: "crate-brackets", at: Date.now(), verdict: "AC", seconds: 90, hintsUsed: 0, mode: "learn" });
      await s.saveDraft("crate-brackets", "int main() {}");
      const json = await s.exportJson();
      await s.reset();
      const back = await s.importJson(json);
      const draft = await s.loadDraft("crate-brackets");
      const attempts = await s.attempts();
      say(`roundtrip ${back.profile.name === "Ada" && back.profile.bits === 42 && draft?.code === "int main() {}" && attempts.length === 1 ? "OK" : "FAIL"}`);
    } catch (e) {
      say(`error: ${String(e)}`);
    }
  };

  return (
    <main className="mx-auto max-w-xl p-4">
      <h1 className="mb-3 text-xl font-bold">Save system check</h1>
      <button className="min-h-11 rounded border px-4" onClick={roundTrip}>
        IndexedDB round trip
      </button>
      <pre data-testid="log" className="mt-4 whitespace-pre-wrap text-sm">{log.join("\n")}</pre>
    </main>
  );
}
