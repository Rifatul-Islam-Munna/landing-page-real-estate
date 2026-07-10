"use client";

import { useEffect } from "react";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

function hasScrollableParent(target: EventTarget | null, deltaY: number) {
  let element = target instanceof HTMLElement ? target : null;

  while (element && element !== document.body) {
    const style = window.getComputedStyle(element);
    const canScroll = /(auto|scroll)/.test(style.overflowY) && element.scrollHeight > element.clientHeight;

    if (canScroll) {
      const movingDown = deltaY > 0;
      const canMoveDown = element.scrollTop + element.clientHeight < element.scrollHeight - 1;
      const canMoveUp = element.scrollTop > 1;
      if ((movingDown && canMoveDown) || (!movingDown && canMoveUp)) return true;
    }

    element = element.parentElement;
  }

  return false;
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
}

export default function SmoothScroll() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (reduceMotion || coarsePointer) return;

    const root = document.documentElement;
    const previousInlineScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";

    let current = window.scrollY;
    let target = current;
    let frame = 0;
    let isAnimating = false;

    const maximumScroll = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    const render = () => {
      const distance = target - current;
      current += distance * 0.085;

      if (Math.abs(distance) < 0.45) {
        current = target;
        window.scrollTo(0, current);
        isAnimating = false;
        frame = 0;
        return;
      }

      window.scrollTo(0, current);
      frame = window.requestAnimationFrame(render);
    };

    const start = () => {
      if (frame) return;
      isAnimating = true;
      frame = window.requestAnimationFrame(render);
    };

    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      isAnimating = false;
      current = window.scrollY;
      target = current;
    };

    const moveTo = (nextTarget: number) => {
      target = clamp(nextTarget, 0, maximumScroll());
      start();
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey || hasScrollableParent(event.target, event.deltaY)) return;

      event.preventDefault();
      moveTo(target + event.deltaY * 0.78);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || isTypingTarget(event.target)) {
        return;
      }

      const pageStep = window.innerHeight * 0.82;
      let nextTarget: number | null = null;

      switch (event.key) {
        case "ArrowDown":
          nextTarget = target + 90;
          break;
        case "ArrowUp":
          nextTarget = target - 90;
          break;
        case "PageDown":
          nextTarget = target + pageStep;
          break;
        case "PageUp":
          nextTarget = target - pageStep;
          break;
        case "Home":
          nextTarget = 0;
          break;
        case "End":
          nextTarget = maximumScroll();
          break;
        case " ":
          nextTarget = target + (event.shiftKey ? -pageStep : pageStep);
          break;
        default:
          break;
      }

      if (nextTarget === null) return;
      event.preventDefault();
      moveTo(nextTarget);
    };

    const onNativeScroll = () => {
      if (isAnimating) return;
      current = window.scrollY;
      target = current;
    };

    const onAnchorClick = (event: MouseEvent) => {
      const source = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
      if (!source) return;

      const hash = source.getAttribute("href");
      if (!hash || hash === "#") return;

      const destination = document.querySelector<HTMLElement>(hash);
      if (!destination) return;

      event.preventDefault();
      moveTo(destination.getBoundingClientRect().top + window.scrollY);
      window.history.pushState(null, "", hash);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onNativeScroll, { passive: true });
    window.addEventListener("resize", onNativeScroll);
    window.addEventListener("mousedown", stop, { passive: true });
    document.addEventListener("click", onAnchorClick);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      root.style.scrollBehavior = previousInlineScrollBehavior;
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onNativeScroll);
      window.removeEventListener("resize", onNativeScroll);
      window.removeEventListener("mousedown", stop);
      document.removeEventListener("click", onAnchorClick);
    };
  }, []);

  return null;
}
