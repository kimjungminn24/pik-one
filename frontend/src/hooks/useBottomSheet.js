import { useRef } from "react";

const MOBILE_QUERY = "(max-width: 48rem)";

// explore.scss의 $peek, $half와 같아야 함
export const SHEET_VISIBLE_REM = { peek: 4.75, half: 18 };

const DRAG_THRESHOLD = 6;

const remToPx = (rem) =>
  rem * parseFloat(getComputedStyle(document.documentElement).fontSize);

export const isMobileLayout = () => window.matchMedia(MOBILE_QUERY).matches;

export const sheetCenterOffsetPx = (snap) =>
  isMobileLayout() && snap !== "full" ? remToPx(SHEET_VISIBLE_REM[snap]) / 2 : 0;

export function useBottomSheet(panelRef, snap, setSnap, onTap, handleSelector) {
  const drag = useRef(null);
  const suppressClickUntil = useRef(0);

  const visibleOf = (name, panelHeight) =>
    name === "full" ? panelHeight : remToPx(SHEET_VISIBLE_REM[name]);

  const release = () => {
    const panel = panelRef.current;
    if (panel) {
      panel.style.transition = "";
      panel.style.transform = "";
    }
    drag.current = null;
  };

  const onPointerDown = (e) => {
    if (!isMobileLayout() || e.button > 0) return;
    const panel = panelRef.current;
    if (!panel) return;

    const onHandle = !!e.target.closest(handleSelector);
    if (snap === "full" && !onHandle) return;

    const h = panel.offsetHeight;
    drag.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startVisible: visibleOf(snap, h),
      h,
      onHandle,
      moved: false,
    };
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d || e.pointerId !== d.pointerId) return;

    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;

    if (!d.moved) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < DRAG_THRESHOLD) return;
      if (Math.abs(dx) > Math.abs(dy)) {
        drag.current = null;
        return;
      }
      d.moved = true;
      try {
        panelRef.current.setPointerCapture(e.pointerId);
      } catch {
        // 포인터가 이미 떨어졌으면 잡지 못해도 드래그는 계속된다
      }
    }

    const visible = Math.min(
      d.h,
      Math.max(remToPx(SHEET_VISIBLE_REM.peek), d.startVisible - dy)
    );
    d.visible = visible;
    const panel = panelRef.current;
    panel.style.transition = "none";
    panel.style.transform = `translateY(${d.h - visible}px)`;
  };

  const onPointerUp = (e) => {
    const d = drag.current;
    if (!d || e.pointerId !== d.pointerId) return;
    release();

    if (!d.moved) {
      if (d.onHandle) onTap?.();
      return;
    }

    const nearest = ["peek", "half", "full"].reduce((best, name) =>
      Math.abs(visibleOf(name, d.h) - d.visible) <
      Math.abs(visibleOf(best, d.h) - d.visible)
        ? name
        : best
    );
    setSnap(nearest);
  };

  const onClickCapture = (e) => {
    if (performance.now() < suppressClickUntil.current) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: (e) => {
      if (drag.current?.moved) suppressClickUntil.current = performance.now() + 300;
      onPointerUp(e);
    },
    onPointerCancel: (e) => {
      if (drag.current && e.pointerId === drag.current.pointerId) release();
    },
    onClickCapture,
  };
}
