// src/lib/realtime/socket.ts
import { API_URL, refreshTokens } from "@/lib/api/client";
import { accessExpiresIn, tokenStore } from "@/lib/api/tokenStore";

export type RealtimeEvent = { type: string; data?: unknown };
export type RealtimeStatus = "idle" | "connecting" | "open" | "reconnecting";

const eventListeners = new Set<(event: RealtimeEvent) => void>();
const statusListeners = new Set<() => void>();

let status: RealtimeStatus = "idle";
let socket: WebSocket | null = null;
let users = 0;
let attempts = 0;
let blocked = false;
let pingTimer: ReturnType<typeof setInterval> | undefined;
let retryTimer: ReturnType<typeof setTimeout> | undefined;

const setStatus = (next: RealtimeStatus) => {
  if (status === next) return;
  status = next;
  statusListeners.forEach((listener) => listener());
};
const emit = (event: RealtimeEvent) => eventListeners.forEach((listener) => listener(event));

export const getRealtimeStatus = (): RealtimeStatus => status;
export const subscribeRealtimeStatus = (listener: () => void) => (
  statusListeners.add(listener),
  () => statusListeners.delete(listener)
);
export const subscribeRealtime = (listener: (event: RealtimeEvent) => void) => (
  eventListeners.add(listener),
  () => eventListeners.delete(listener)
);

function stopPing() {
  if (pingTimer) clearInterval(pingTimer);
  pingTimer = undefined;
}
function startPing(ws: WebSocket) {
  stopPing();
  pingTimer = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) ws.send('{"type":"ping"}');
  }, 25_000);
}

function scheduleRetry(delay?: number) {
  if (users === 0 || blocked) return;
  const wait = delay ?? Math.min(30_000, 1000 * 2 ** attempts) + Math.random() * 500;
  attempts += 1;
  setStatus("reconnecting");
  clearTimeout(retryTimer);
  retryTimer = setTimeout(() => void connect(), wait);
}

async function connect(): Promise<void> {
  if (users === 0 || socket || blocked) return;
  setStatus(attempts === 0 ? "connecting" : "reconnecting");
  if (tokenStore.getAccess() && accessExpiresIn() < 60) await refreshTokens();
  const token = tokenStore.getAccess();
  if (users === 0 || socket) return;
  if (!token || !API_URL) return setStatus("idle");

  // Le jeton ne passe jamais dans l'adresse : premier message {"type":"auth"} (dans les 5 s).
  const ws = new WebSocket(`${API_URL.replace(/^http/, "ws")}/ws`);
  socket = ws;
  ws.onopen = () => ws.send(JSON.stringify({ type: "auth", token }));
  ws.onmessage = (event) => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(String(event.data));
    } catch {
      return;
    }
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      typeof (parsed as { type?: unknown }).type !== "string"
    )
      return;
    const message = parsed as RealtimeEvent;
    if (message.type === "ready") {
      attempts = 0;
      setStatus("open");
      startPing(ws);
      emit({ type: "connected" }); // rien n'est rejoué après une coupure : l'API REST fait foi
      return;
    }
    if (message.type !== "pong") emit(message);
  };
  ws.onerror = () => ws.close();
  ws.onclose = (event) => {
    stopPing();
    if (socket === ws) socket = null;
    if (users === 0) return setStatus("idle");
    if (event.code === 4403) {
      blocked = true; // compte suspendu
      return setStatus("idle");
    }
    // 4401 : jeton ou session de 25 min écoulée, on se reconnecte vite avec un jeton frais.
    scheduleRetry(event.code === 4401 ? 300 : event.code === 4409 ? 30_000 : undefined);
  };
}

const onOnline = () => {
  if (users > 0 && !socket) {
    attempts = 0;
    void connect();
  }
};

export function startRealtime(): void {
  users += 1;
  if (users === 1) {
    blocked = false;
    attempts = 0;
    window.addEventListener("online", onOnline);
    void connect();
  }
}

export function shutdownRealtime(): void {
  users = 0;
  clearTimeout(retryTimer);
  stopPing();
  window.removeEventListener("online", onOnline);
  const ws = socket;
  socket = null;
  ws?.close(1000);
  setStatus("idle");
}

export function stopRealtime(): void {
  users = Math.max(0, users - 1);
  if (users === 0) shutdownRealtime();
}

export function sendRealtime(payload: Record<string, unknown>): void {
  if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify(payload));
}
