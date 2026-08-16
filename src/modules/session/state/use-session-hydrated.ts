"use client";

import { useSyncExternalStore } from "react";
import { useSessionStore } from "@/modules/session/state/session-store";

function subscribe(onStoreChange: () => void) {
  const unsubscribeHydration =
    useSessionStore.persist.onFinishHydration(onStoreChange);

  return () => unsubscribeHydration();
}

function getSnapshot() {
  return useSessionStore.persist.hasHydrated();
}

function getServerSnapshot() {
  return false;
}

export function useSessionHydrated() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
