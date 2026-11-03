import { useRef } from "react";

const MOBILE_QUERY = "(max-width: 48rem)";

// explore.scss의 $peek, $half와 같아야 함
export const SHEET_VISIBLE_REM = { peek: 4.75, half: 18 };

const DRAG_THRESHOLD = 6;
const SNAPS = ["peek", "half", "full"];
// 이보다 빠르게 튕기면 거리와 상관없이 그 방향으로 한 칸 (px/ms)
const FLICK_SPEED = 0.35;
// 천천히 끌 때는 다음 칸까지 거리의 이만큼만 가도 넘어감
const STEP_RATIO = 0.15;

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
      samples: [{ y: e.clientY, t: e.timeStamp }],
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
    d.samples.push({ y: e.clientY, t: e.timeStamp });
    if (d.samples.length > 5) d.samples.shift();
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

    setSnap(nextSnap(d, e));
  };

  // 위로 끌면 visible이 커짐. 속도는 마지막 몇 번의 움직임으로 잼
  const nextSnap = (d, e) => {
    const first = d.samples[0];
    const dt = Math.max(1, e.timeStamp - first.t);
    const speedUp = (first.y - e.clientY) / dt;
    const index = SNAPS.indexOf(snap);
    const up = SNAPS[Math.min(index + 1, SNAPS.length - 1)];
    const down = SNAPS[Math.max(index - 1, 0)];

    if (speedUp > FLICK_SPEED) return up;
    if (speedUp < -FLICK_SPEED) return down;

    const moved = d.visible - d.startVisible;
    if (moved > 0 && moved > (visibleOf(up, d.h) - d.startVisible) * STEP_RATIO) return up;
    if (moved < 0 && -moved > (d.startVisible - visibleOf(down, d.h)) * STEP_RATIO) return down;
    return snap;
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
