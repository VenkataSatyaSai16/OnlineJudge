import { useCallback, useState } from "react";

export default function useResizableSplit(initialPercent = 50, axis = 'horizontal') {
  const [percent, setPercent] = useState(initialPercent);

  const startResize = useCallback((event) => {
    event.preventDefault();
    const container = event.currentTarget.parentElement;
    if (!container) return;

    const onMove = (moveEvent) => {
      const rect = container.getBoundingClientRect();
      let next;
      if (axis === 'horizontal') {
        next = ((moveEvent.clientX - rect.left) / rect.width) * 100;
        setPercent(Math.min(80, Math.max(20, next)));
      } else {
        next = ((moveEvent.clientY - rect.top) / rect.height) * 100;
        
        // Option 2: stop bar at min height (400px editor, 200px verdict)
        const minPercent = (400 / rect.height) * 100;
        const maxPercent = 100 - (200 / rect.height) * 100;
        
        const safeMin = Math.max(10, minPercent);
        const safeMax = Math.min(90, maxPercent);
        
        setPercent(Math.min(safeMax, Math.max(safeMin, next)));
      }
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      document.body.classList.remove("is-resizing");
      document.body.classList.remove("is-resizing-row");
    };

    if (axis === 'horizontal') {
      document.body.classList.add("is-resizing");
    } else {
      document.body.classList.add("is-resizing-row");
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [axis]);

  return {
    percent,
    leftPercent: percent, // for backwards compatibility with horizontal
    startResize,
  };
}
