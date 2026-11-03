import { useEffect, useRef } from "react";

const MOBILE_QUERY = "(max-width: 48rem)";

// explore.scss의 $peek, $half와 같아야 함
export const SHEET_VISIBLE_REM = { peek: 4.75, half: 18 };

const DRAG_THRESHOLD = 6;
const SNAPS = ["peek", "half", "full"];
// 이보다 빠르게 튕기면 거리와 상관없이 그 방향으로 한 칸 (px/ms)
const FLICK_SPEED = 0.35;
// 천천히 끌 때는 다음 칸까지 거리의 이만큼만 가도 넘어감
const STEP_RATIO = 0.15;
const SCROLLER = ".explore__list, .explore__body, .spot-detail";

const remToPx = (rem) =>
  rem * parseFloat(getComputedStyle(document.documentElement).fontSize);

export const isMobileLayout = () => window.matchMedia(MOBILE_QUERY).matches;

export const sheetCenterOffsetPx = (snap) =>
  isMobileLayout() && snap !== "full" ? remToPx(SHEET_VISIBLE_REM[snap]) / 2 : 0;

const visibleOf = (name, panelHeight) =>
  name === "full" ? panelHeight : remToPx(SHEET_VISIBLE_REM[name]);

// 손가락 방향으로 내용이 더 스크롤될 수 있으면 내용을, 끝에 닿았으면 시트를 움직인다
const shouldScroll = (scroller, dy) => {
  if (!scroller) return false;
  if (dy < 0) return scroller.scrollTop + scroller.clientHeight < scroller.scrollHeight - 1;
  return scroller.scrollTop > 0;
};

export function useBottomSheet(panelRef, snap, setSnap, onTap, handleSelector) {
  const latest = useRef({ snap, setSnap, onTap });
  latest.current = { snap, setSnap, onTap };
  const suppressClickUntil = useRef(0);

  // 시트에 가려진 만큼 내용 아래 여백을 줘서, 반만 올라와 있어도 끝까지 스크롤되게
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const update = () => {
      const hidden = isMobileLayout() ? panel.offsetHeight - visibleOf(snap, panel.offsetHeight) : 0;
      panel.style.setProperty("--sheet-hidden", `${Math.max(0, hidden)}px`);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [panelRef, snap]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    let drag = null;

    const release = () => {
      panel.style.transition = "";
      panel.style.transform = "";
    };

    const nextSnap = (d, y, t) => {
      const { snap: current } = latest.current;
      const first = d.samples[0];
      const speedUp = (first.y - y) / Math.max(1, t - first.t);
      const index = SNAPS.indexOf(current);
      const up = SNAPS[Math.min(index + 1, SNAPS.length - 1)];
      const down = SNAPS[Math.max(index - 1, 0)];

      if (speedUp > FLICK_SPEED) return up;
      if (speedUp < -FLICK_SPEED) return down;

      const moved = d.visible - d.startVisible;
      if (moved > 0 && moved > (visibleOf(up, d.h) - d.startVisible) * STEP_RATIO) return up;
      if (moved < 0 && -moved > (d.startVisible - visibleOf(down, d.h)) * STEP_RATIO) return down;
      return current;
    };

    const onStart = (e) => {
      if (!isMobileLayout() || e.touches.length > 1) return;
      const touch = e.touches[0];
      const h = panel.offsetHeight;
      drag = {
        startX: touch.clientX,
        startY: touch.clientY,
        startVisible: visibleOf(latest.current.snap, h),
        h,
        onHandle: !!e.target.closest(handleSelector),
        scroller: e.target.closest(SCROLLER),
        mode: null, // "sheet" | "scroll"
        samples: [{ y: touch.clientY, t: e.timeStamp }],
      };
    };

    const onMove = (e) => {
      if (!drag) return;
      const touch = e.touches[0];
      const dx = touch.clientX - drag.startX;
      const dy = touch.clientY - drag.startY;

      // 브라우저가 스크롤을 시작하기 전에 막아야 해서, 첫 움직임에서 바로 정한다
      if (!drag.mode) {
        if (dx === 0 && dy === 0) return;
        if (Math.abs(dx) > Math.abs(dy)) {
          drag = null;
          return;
        }
        const scroll =
          !drag.onHandle && latest.current.snap !== "peek" && shouldScroll(drag.scroller, dy);
        drag.mode = scroll ? "scroll" : "sheet";
      }
      if (drag.mode === "scroll") return;

      e.preventDefault();
      // 살짝 떨린 건 누른 것으로 본다
      if (!drag.moved && Math.abs(dy) < DRAG_THRESHOLD) return;
      drag.moved = true;
      const visible = Math.min(
        drag.h,
        Math.max(remToPx(SHEET_VISIBLE_REM.peek), drag.startVisible - dy)
      );
      drag.visible = visible;
      drag.samples.push({ y: touch.clientY, t: e.timeStamp });
      if (drag.samples.length > 5) drag.samples.shift();
      panel.style.transition = "none";
      panel.style.transform = `translateY(${drag.h - visible}px)`;
    };

    const onEnd = (e) => {
      const d = drag;
      drag = null;
      if (!d) return;
      if (d.mode === "scroll") return;
      if (!d.moved) {
        release();
        if (d.onHandle) latest.current.onTap?.();
        return;
      }
      release();
      suppressClickUntil.current = performance.now() + 300;
      const touch = e.changedTouches[0];
      latest.current.setSnap(nextSnap(d, touch.clientY, e.timeStamp));
    };

    const onCancel = () => {
      if (drag?.mode === "sheet") release();
      drag = null;
    };

    panel.addEventListener("touchstart", onStart, { passive: true });
    // 시트를 끌 때는 브라우저 스크롤을 막아야 해서 passive가 아님
    panel.addEventListener("touchmove", onMove, { passive: false });
    panel.addEventListener("touchend", onEnd);
    panel.addEventListener("touchcancel", onCancel);
    return () => {
      panel.removeEventListener("touchstart", onStart);
      panel.removeEventListener("touchmove", onMove);
      panel.removeEventListener("touchend", onEnd);
      panel.removeEventListener("touchcancel", onCancel);
    };
  }, [panelRef, handleSelector]);

  const onClickCapture = (e) => {
    if (performance.now() < suppressClickUntil.current) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return { onClickCapture };
}
