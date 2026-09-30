"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import {
  createSeed,
  deserialise,
  serialise,
  STORAGE_KEY,
  studioReducer,
  type StudioAction,
  type StudioState,
} from "@/lib/studio-store";

type Ctx = { state: StudioState; dispatch: Dispatch<StudioAction> };

const StudioContext = createContext<Ctx | null>(null);

export function useStudio(): Ctx {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error("useStudio must be used inside StudioProvider");
  return ctx;
}

export function StudioProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(studioReducer, undefined, createSeed);

  // Load saved work after the first render so server and client markup match.
  useEffect(() => {
    let raw: string | null = null;
    try {
      raw = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      raw = null;
    }
    dispatch({ type: "hydrate", state: deserialise(raw) });
  }, []);

  // Save shortly after the last change.
  useEffect(() => {
    if (!state.hydrated || state.saveStatus !== "saving") return;
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, serialise(state));
      } catch {
        // Storage can be blocked or full. The demo keeps working in memory.
      }
      dispatch({ type: "saved" });
    }, 600);
    return () => window.clearTimeout(timer);
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}
