import { useEffect, useSyncExternalStore } from "react";

import { getReportStore } from "./index";
import type { ReportRecord } from "./types";

type CacheEntry =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "loaded"; report: ReportRecord | null }
  | { status: "error" };

const cache = new Map<string, CacheEntry>();
const listeners = new Map<string, Set<() => void>>();

const idleEntry: CacheEntry = { status: "idle" };

function emit(token: string) {
  const set = listeners.get(token);
  if (!set) return;
  for (const cb of set) cb();
}

function subscribe(token: string | undefined, cb: () => void) {
  if (!token) return () => {};
  const set = listeners.get(token) ?? new Set<() => void>();
  set.add(cb);
  listeners.set(token, set);
  return () => {
    const current = listeners.get(token);
    if (!current) return;
    current.delete(cb);
    if (current.size === 0) listeners.delete(token);
  };
}

function getSnapshot(token: string | undefined): CacheEntry {
  if (!token) return idleEntry;
  return cache.get(token) ?? idleEntry;
}

async function ensureLoaded(token: string) {
  const existing = cache.get(token);
  if (existing && existing.status !== "idle") return;

  cache.set(token, { status: "loading" });
  emit(token);

  const store = getReportStore();
  try {
    const report = await store.getReport(token);
    cache.set(token, { status: "loaded", report });
    emit(token);
  } catch {
    cache.set(token, { status: "error" });
    emit(token);
  }
}

export function useReport(token: string | undefined): {
  isLoading: boolean;
  report: ReportRecord | null;
} {
  useEffect(() => {
    if (!token) return;
    void ensureLoaded(token);
  }, [token]);

  const entry = useSyncExternalStore(
    (cb) => subscribe(token, cb),
    () => getSnapshot(token),
    () => getSnapshot(token)
  );

  if (!token) {
    return { isLoading: false, report: null };
  }

  if (entry.status === "loaded") {
    return { isLoading: false, report: entry.report };
  }

  return { isLoading: true, report: null };
}
