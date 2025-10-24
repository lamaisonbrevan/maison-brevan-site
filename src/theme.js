export const COLORS = { ink: "#1a1a1a", sand: "#e7e0d8", clay: "#c8b8a5" };
export function Container({ className = "", children }) { return <div className={`container-p ${className}`}>{children}</div>; }
export const focusRing = "focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2";
