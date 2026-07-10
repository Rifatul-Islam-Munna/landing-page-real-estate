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

    const intro = (
      selector: string,
      keyframes: Record<string, string[] | number[]>,
      delay: number,
      duration = 1.35,
    ) => {
      const element = document.querySelector<HTMLElement>(selector);
      if (!element) return;
      track(animate(element, keyframes, { duration, delay, ease: smoothEase }));
    };

    intro(".top-nav", { opacity: [0, 1], y: [-14, 0], filter: ["blur(5px)", "blur(0px)"] }, 0, 1.25);
    intro(
      ".hero-copy h1",
      { opacity: [0, 1], y: [28, 0], filter: ["blur(8px)", "blur(0px)"] },
      0.12,
      1.55,
    );
    intro(".hero-copy p", { opacity: [0, 1], y: [20, 0] }, 0.36, 1.35);
    intro(".hero-buttons", { opacity: [0, 1], y: [16, 0] }, 0.55, 1.25);
    intro(
      ".hero-dashboard",
      { opacity: [0, 1], y: [28, 0], scale: [0.992, 1] },
      0.68,
      1.65,
    );

    const reveal = (
      selector: string,
      options: {
        y?: number;
        delayStep?: number;
        amount?: number;
        duration?: number;
        blur?: number;
        scale?: number;
      } = {},
    ) => {
      const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
      const y = options.y ?? 24;
      const delayStep = options.delayStep ?? 0.08;
      const duration = options.duration ?? 1.28;
      const blur = options.blur ?? 5;
      const scale = options.scale ?? 0.992;

      elements.forEach((element, index) => {
        track(
          animate(
            element,
            { opacity: 0, y, scale, filter: `blur(${blur}px)` },
            { duration: 0 },
          ),
        );
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
                  { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
                  {
                    duration,
                    delay: (index % 4) * delayStep,
                    ease: smoothEase,
                  },
                ),
              );
            },
            { amount: options.amount ?? 0.14, margin: "0px 0px -7% 0px" },
          ),
        );
      });
    };

    reveal(".section-title", { y: 28, delayStep: 0, duration: 1.4, blur: 7 });
    reveal(".feature-card", { y: 30, delayStep: 0.11, amount: 0.08, duration: 1.35 });
    reveal(".workflow-row", { y: 24, delayStep: 0.1, amount: 0.1, duration: 1.35 });
    reveal(".screenshot-frame", { y: 28, delayStep: 0, amount: 0.1, duration: 1.5 });
    reveal(".automation-label, .automation-center", {
      y: 18,
      delayStep: 0.11,
      amount: 0.12,
      duration: 1.25,
    });
    reveal(".audience-card", { y: 28, delayStep: 0.1, amount: 0.1, duration: 1.35 });
    reveal(".sales-panel", { y: 28, delayStep: 0, amount: 0.14, duration: 1.45 });
    reveal(".contact-layout", { y: 30, delayStep: 0, amount: 0.1, duration: 1.45 });
    reveal(".footer-links, .footer-wordmark, .footer-bottom", {
      y: 24,
      delayStep: 0.12,
      amount: 0.08,
      duration: 1.4,
    });

    // Feature icons arrive after their cards and remain centered in their supplied frames.
    document.querySelectorAll<HTMLElement>(".feature-icon").forEach((icon, index) => {
      track(animate(icon, { opacity: 0, scale: 0.84, rotate: -4 }, { duration: 0 }));
      let shown = false;
      observers.push(
        inView(
          icon,
          () => {
            if (shown) return;
            shown = true;
            track(
              animate(
                icon,
                { opacity: 1, scale: 1, rotate: 0 },
                { duration: 1.15, delay: (index % 3) * 0.11 + 0.16, ease: smoothEase },
              ),
            );
          },
          { amount: 0.35 },
        ),
      );
    });

    // Draw only the original connector paths. The moving beams are separate overlays.
    const automationDiagram = document.querySelector<HTMLElement>(".automation-diagram");
    const connectorPaths = Array.from(
      document.querySelectorAll<SVGPathElement>(".automation-connectors > .automation-base-path"),
    );
    const beamGroup = document.querySelector<SVGGElement>(".automation-beam-group");

    if (automationDiagram && connectorPaths.length) {
      connectorPaths.forEach((path) => {
        track(animate(path, { pathLength: 0, opacity: 0.18 }, { duration: 0 }));
      });
      if (beamGroup) track(animate(beamGroup, { opacity: 0 }, { duration: 0 }));

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
                  { duration: 1.9, delay: index * 0.13, ease: smoothEase },
                ),
              );
            });

            if (beamGroup) {
              track(
                animate(
                  beamGroup,
                  { opacity: 1 },
                  { duration: 1.5, delay: 0.75, ease: smoothEase },
                ),
              );
            }
          },
          { amount: 0.18 },
        ),
      );
    }

    // Slow breathing glow on the center hub; the hub position itself never moves.
    const orb = document.querySelector<HTMLElement>(".automation-orb");
    if (orb) {
      track(
        animate(
          orb,
          {
            scale: [1, 1.018, 1],
            boxShadow: [
              "inset 0 0 0 1px rgba(255,255,255,.75), 0 18px 46px rgba(49,82,150,.07)",
              "inset 0 0 0 1px rgba(255,255,255,.92), 0 24px 62px rgba(20,71,230,.16)",
              "inset 0 0 0 1px rgba(255,255,255,.75), 0 18px 46px rgba(49,82,150,.07)",
            ],
          },
          { duration: 7.8, repeat: Infinity, ease: "easeInOut" },
        ),
      );
    }

    // Requested contact-button interaction: the text fades while the arrow glides right.
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
            { opacity: 0, x: 9, filter: "blur(4px)" },
            { duration: 0.48, ease: smoothEase },
          ),
        );
        track(
          animate(
            contactIcon,
            { x: targetX, rotate: 45, scale: 1.035 },
            { type: "spring", stiffness: 145, damping: 22, mass: 0.9 },
          ),
        );
      };

      const leave = () => {
        track(
          animate(
            contactLabel,
            { opacity: 1, x: 0, filter: "blur(0px)" },
            { duration: 0.52, ease: smoothEase },
          ),
        );
        track(
          animate(
            contactIcon,
            { x: 0, rotate: 0, scale: 1 },
            { type: "spring", stiffness: 145, damping: 23, mass: 0.92 },
          ),
        );
      };

      listen(contactButton, "mouseenter", enter);
      listen(contactButton, "mouseleave", leave);
      listen(contactButton, "focusin", enter);
      listen(contactButton, "focusout", leave);
    }

    // Soft depth on cards and buttons, with separate icon choreography.
    document
      .querySelectorAll<HTMLElement>(
        ".feature-card, .workflow-card, .audience-card, .primary-button, .secondary-button, .sales-button, .contact-form button",
      )
      .forEach((element) => {
        const icon = element.querySelector<HTMLElement>(".feature-icon");

        const enter = () => {
          track(
            animate(
              element,
              { y: -4, scale: 1.004 },
              { type: "spring", stiffness: 145, damping: 24, mass: 0.9 },
            ),
          );
          if (icon) {
            track(
              animate(
                icon,
                { scale: 1.065, rotate: 2.5 },
                { type: "spring", stiffness: 150, damping: 22, mass: 0.85 },
              ),
            );
          }
        };

        const leave = () => {
          track(
            animate(
              element,
              { y: 0, scale: 1 },
              { type: "spring", stiffness: 140, damping: 25, mass: 0.92 },
            ),
          );
          if (icon) {
            track(
              animate(
                icon,
                { scale: 1, rotate: 0 },
                { type: "spring", stiffness: 145, damping: 23, mass: 0.88 },
              ),
            );
          }
        };

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
