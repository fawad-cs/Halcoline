import { createContext, useContext, useMemo } from 'react';
import useLenis from '../hooks/useLenis';

// Shares the single Lenis instance with the whole app.
const ScrollContext = createContext({ lenis: null });

export function ScrollProvider({ children }) {
  const lenis = useLenis();
  const value = useMemo(() => ({ lenis }), [lenis]);
  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>;
}

export function useScrollContext() {
  return useContext(ScrollContext);
}