"use client";

import { useEffect } from "react";
import { animate, inView } from "motion";
import { useReducedMotion } from "motion/react";

type Stoppable = { stop: () => void };

const smoothEase = [0.22, 1, 0.36, 1] as const;

export default function MotionEffects() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    const root = document.documentElement;
    root.classList.add("motion-enhanced");

    const animations: Stoppable[] = [];
    const observers: Array<() => void> = [];
    const cleanups: Array<() => void> = [];

    const track = <T extends Stoppable>(animation: T) => {
      animations.push(animation);
      return animation;
    };

    const listen = (
      element: Element,
      event: string,
      handler: EventListener,
      options?: AddEventListenerOptions,
    ) => {
      element.addEventListener(event, handler, options);
      cleanups.push(() => element.removeEventListener(event, handler, options));
    };

    // Intro animations use only opacity and transforms, so the original layout never changes.
    track(
      animate(
        ".top-nav",
        { opacity: [0, 1], y: [-10, 0] },
        { duration: 0.9, ease: smoothEase },
      ),
    );
    track(
      animate(
        ".hero-copy h1",
        { opacity: [0, 1], y: [18, 0] },
        { duration: 1, delay: 0.08, ease: smoothEase },
      ),
    );
    track(
      animate(
        ".hero-copy p",
        { opacity: [0, 1], y: [14, 0] },
        { duration: 0.9, delay: 0.2, ease: smoothEase },
      ),
    );
    track(
      animate(
        ".hero-buttons",
        { opacity: [0, 1], y: [12, 0] },
        { duration: 0.85, delay: 0.3, ease: smoothEase },
      ),
    );
    track(
      animate(
        ".hero-dashboard",
        { opacity: [0, 1], y: [18, 0] },
        { duration: 1.05, delay: 0.38, ease: smoothEase },
      ),
    );

    const reveal = (
      selector: string,
      options: { y?: number; delayStep?: number; amount?: number } = {},
    ) => {
      const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
      const y = options.y ?? 16;
      const delayStep = options.delayStep ?? 0.06;

      elements.forEach((element, index) => {
        track(animate(element, { opacity: 0, y }, { duration: 0 }));
        let shown = false;

        observers.push(
          inView(
            element,
            () => {
              if (shown) return;
              shown = true;
              track(
                animate(
                  element,
                  { opacity: 1, y: 0 },
                  {
                    duration: 0.9,
                    delay: (index % 4) * delayStep,
                    ease: smoothEase,
                  },
                ),
              );
            },
            { amount: options.amount ?? 0.14, margin: "0px 0px -5% 0px" },
          ),
        );
      });
    };

    reveal(".section-title", { y: 18, delayStep: 0 });
    reveal(".feature-card", { y: 16, delayStep: 0.07, amount: 0.1 });
    reveal(".workflow-row", { y: 14, delayStep: 0.08, amount: 0.12 });
    reveal(".screenshot-frame", { y: 16, delayStep: 0, amount: 0.12 });
    reveal(".automation-label, .automation-center", { y: 10, delayStep: 0.07, amount: 0.15 });
    reveal(".audience-card", { y: 16, delayStep: 0.07, amount: 0.12 });
    reveal(".sales-panel", { y: 16, delayStep: 0, amount: 0.16 });
    reveal(".contact-layout", { y: 16, delayStep: 0, amount: 0.12 });
    reveal(".footer-links, .footer-wordmark, .footer-bottom", {
      y: 12,
      delayStep: 0.06,
      amount: 0.1,
    });

    // Draw the existing automation paths once without adding or moving any SVG elements.
    const automationDiagram = document.querySelector<HTMLElement>(".automation-diagram");
    const connectorPaths = Array.from(
      document.querySelectorAll<SVGPathElement>(".automation-connectors path"),
    );

    if (automationDiagram && connectorPaths.length) {
      connectorPaths.forEach((path) => {
        track(animate(path, { pathLength: 0, opacity: 0.2 }, { duration: 0 }));
      });

      let hasAnimated = false;
      observers.push(
        inView(
          automationDiagram,
          () => {
            if (hasAnimated) return;
            hasAnimated = true;

            connectorPaths.forEach((path, index) => {
              track(
                animate(
                  path,
                  { pathLength: 1, opacity: 1 },
                  { duration: 1.25, delay: index * 0.08, ease: smoothEase },
                ),
              );
            });
          },
          { amount: 0.18 },
        ),
      );
    }

    // Requested contact-button interaction: text fades while the arrow glides right.
    const contactButton = document.querySelector<HTMLElement>(".contact-button");
    const contactIcon = contactButton?.querySelector<HTMLElement>(".contact-button-icon");
    const contactLabel = contactButton?.querySelector<HTMLElement>("span:last-child");

    if (contactButton && contactIcon && contactLabel) {
      const enter = () => {
        const targetX = Math.max(
          0,
          contactButton.clientWidth - contactIcon.offsetLeft - contactIcon.offsetWidth - 7,
        );

        track(
          animate(
            contactLabel,
            { opacity: 0, x: 6, filter: "blur(3px)" },
            { duration: 0.35, ease: smoothEase },
          ),
        );
        track(
          animate(
            contactIcon,
            { x: targetX, rotate: 45 },
            { type: "spring", stiffness: 170, damping: 24, mass: 0.8 },
          ),
        );
      };

      const leave = () => {
        track(
          animate(
            contactLabel,
            { opacity: 1, x: 0, filter: "blur(0px)" },
            { duration: 0.38, ease: smoothEase },
          ),
        );
        track(
          animate(
            contactIcon,
            { x: 0, rotate: 0 },
            { type: "spring", stiffness: 170, damping: 24, mass: 0.8 },
          ),
        );
      };

      listen(contactButton, "mouseenter", enter);
      listen(contactButton, "mouseleave", leave);
      listen(contactButton, "focusin", enter);
      listen(contactButton, "focusout", leave);
    }

    // Tiny hover lifts only; no tilt, wobble, floating, or layout-changing motion.
    document
      .querySelectorAll<HTMLElement>(
        ".feature-card, .workflow-card, .audience-card, .primary-button, .secondary-button, .sales-button, .contact-form button",
      )
      .forEach((element) => {
        const enter = () =>
          track(
            animate(
              element,
              { y: -2 },
              { type: "spring", stiffness: 180, damping: 25, mass: 0.8 },
            ),
          );
        const leave = () =>
          track(
            animate(
              element,
              { y: 0 },
              { type: "spring", stiffness: 180, damping: 25, mass: 0.8 },
            ),
          );

        listen(element, "mouseenter", enter);
        listen(element, "mouseleave", leave);
        listen(element, "focusin", enter);
        listen(element, "focusout", leave);
      });

    return () => {
      root.classList.remove("motion-enhanced");
      observers.forEach((stop) => stop());
      animations.forEach((animation) => animation.stop());
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [reduceMotion]);

  return null;
}
