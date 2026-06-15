import { useEffect } from "react";
export default function useCloseWindow() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      
      if (target.classList.contains("window")) {
        location.hash = "";
      }
    }
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);
}
