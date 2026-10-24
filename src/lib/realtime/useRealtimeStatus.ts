// src/lib/realtime/useRealtimeStatus.ts
import { useSyncExternalStore } from "react";
import { getRealtimeStatus, subscribeRealtimeStatus, type RealtimeStatus } from "./socket";

export const useRealtimeStatus = (): RealtimeStatus =>
  useSyncExternalStore(subscribeRealtimeStatus, getRealtimeStatus, () => "idle");
