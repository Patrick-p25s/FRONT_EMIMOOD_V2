// components/RealtimeBridge.tsx : à monter UNE fois dans la coquille de l'espace connecté
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { onSessionEnd } from "@/lib/api/client";
import {
  shutdownRealtime,
  startRealtime,
  stopRealtime,
  subscribeRealtime,
} from "@/lib/realtime/socket";
import { handleRealtimeEvent } from "../lib/realtimeHanldlers";

export function RealtimeBridge() {
  const client = useQueryClient();
  useEffect(() => {
    startRealtime();
    const off = subscribeRealtime((event) => handleRealtimeEvent(client, event));
    const offEnd = onSessionEnd(() => shutdownRealtime());
    return () => {
      off();
      offEnd();
      stopRealtime();
    };
  }, [client]);
  return null;
}
