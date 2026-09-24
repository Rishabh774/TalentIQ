import { useEffect, useState } from "react";

// breakpoint defaults to Tailwind's `lg` (1024px) — below this, resizable
// side-by-side panels become unusable on phones/tablets and should stack instead
export function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < breakpoint
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);

  return isMobile;
}
