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

    // Calm, cinematic first-load sequence inspired by modern SaaS templates.
    track(
      animate(
        ".top-nav",
        { opacity: [0, 1], y: [-16, 0] },
        { duration: 1.05, ease: smoothEase },
      ),
    );
    track(
      animate(
        ".hero-copy h1",
        { opacity: [0, 1], y: [26, 0], filter: ["blur(8px)", "blur(0px)"] },
        { duration: 1.25, delay: 0.12, ease: smoothEase },
      ),
    );
    track(
      animate(
        ".hero-copy p",
        { opacity: [0, 1], y: [18, 0] },
        { duration: 1.05, delay: 0.32, ease: smoothEase },
      ),
    );
    track(
      animate(
        ".hero-buttons",
        { opacity: [0, 1], y: [14, 0] },
        { duration: 0.95, delay: 0.48, ease: smoothEase },
      ),
    );
    track(
      animate(
        ".dashboard-glass",
        { opacity: [0, 1], y: [24, 0], scale: [0.985, 1] },
        { duration: 1.35, delay: 0.52, ease: smoothEase },
      ),
    );

    // Very slow ambient movement: visible, but never distracting.
    track(
      animate(
        ".hero-ellipse",
        {
          x: ["-50%", "-49.82%", "-50.18%", "-50%"],
          y: [0, -7, 5, 0],
          rotate: [0, 0.18, -0.16, 0],
          scale: [1, 1.006, 0.998, 1],
        },
        { duration: 24, repeat: Infinity, ease: "easeInOut" },
      ),
    );
    track(
      animate(
        ".dashboard-glass img",
        { y: [0, -3, 1, 0], scale: [1, 1.0025, 1, 1] },
        { duration: 15, repeat: Infinity, ease: "easeInOut" },
      ),
    );

    const floatCard = (
      selector: string,
      x: number[],
      y: number[],
      rotate: number[],
      duration: number,
      delay: number,
    ) =>
      track(
        animate(
          selector,
          { x, y, rotate },
          { duration, delay, repeat: Infinity, ease: "easeInOut" },
        ),
      );

    floatCard(".metric-leads", [0, 4, -3, 0], [0, -5, 3, 0], [0, 0.35, -0.25, 0], 13.5, 0);
    floatCard(
      ".metric-pipeline",
      [0, -4, 3, 0],
      [0, 4, -5, 0],
      [0, -0.3, 0.28, 0],
      15.5,
      0.7,
    );
    track(
      animate(
        ".metric-conversion",
        {
          x: ["-50%", "-49.45%", "-50.5%", "-50%"],
          y: [0, -4, 3, 0],
          rotate: [0, 0.25, -0.3, 0],
        },
        { duration: 14.6, delay: 1.15, repeat: Infinity, ease: "easeInOut" },
      ),
    );

    // Contact CTA: label softly disappears while the icon glides to the right.
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
            { opacity: 0, x: 10, filter: "blur(4px)" },
            { duration: 0.42, ease: smoothEase },
          ),
        );
        track(
          animate(
            contactIcon,
            { x: targetX, rotate: 45, scale: 1.035 },
            { type: "spring", stiffness: 165, damping: 23, mass: 0.78 },
          ),
        );
      };
      const leave = () => {
        track(
          animate(
            contactLabel,
            { opacity: 1, x: 0, filter: "blur(0px)" },
            { duration: 0.46, ease: smoothEase },
          ),
        );
        track(
          animate(
            contactIcon,
            { x: 0, rotate: 0, scale: 1 },
            { type: "spring", stiffness: 170, damping: 24, mass: 0.8 },
          ),
        );
      };

      listen(contactButton, "mouseenter", enter);
      listen(contactButton, "mouseleave", leave);
      listen(contactButton, "focusin", enter);
      listen(contactButton, "focusout", leave);
    }

    document.querySelectorAll<HTMLElement>(".nav-links a").forEach((link) => {
      const enter = () =>
        track(animate(link, { y: -2, color: "#1447e6" }, { duration: 0.34, ease: smoothEase }));
      const leave = () =>
        track(animate(link, { y: 0, color: "#050505" }, { duration: 0.38, ease: smoothEase }));
      listen(link, "mouseenter", enter);
      listen(link, "mouseleave", leave);
      listen(link, "focus", enter);
      listen(link, "blur", leave);
    });

    const reveal = (
      selector: string,
      options: { y?: number; delayStep?: number; amount?: number } = {},
    ) => {
      const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
      const y = options.y ?? 26;
      const delayStep = options.delayStep ?? 0.09;

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
                    duration: 1.08,
                    delay: (index % 4) * delayStep,
                    ease: smoothEase,
                  },
                ),
              );
            },
            { amount: options.amount ?? 0.16, margin: "0px 0px -6% 0px" },
          ),
        );
      });
    };

    reveal(".section-title", { y: 30, delayStep: 0 });
    reveal(".feature-card", { y: 32, delayStep: 0.1, amount: 0.1 });
    reveal(".workflow-row", { y: 26, delayStep: 0.11, amount: 0.14 });
    reveal(".screenshot-frame", { y: 28, delayStep: 0, amount: 0.13 });
    reveal(".audience-card", { y: 30, delayStep: 0.11, amount: 0.13 });
    reveal(".sales-panel", { y: 30, delayStep: 0, amount: 0.18 });
    reveal(".contact-layout", { y: 32, delayStep: 0, amount: 0.14 });
    reveal(".footer-links, .footer-wordmark, .footer-bottom", {
      y: 22,
      delayStep: 0.1,
      amount: 0.12,
    });

    // Draw the quiet white connector skeleton once; moving beams are layered above it.
    const automationLabels = Array.from(
      document.querySelectorAll<HTMLElement>(".automation-label"),
    );
    automationLabels.forEach((label) => {
      track(animate(label, { opacity: 0, filter: "blur(7px)" }, { duration: 0 }));
    });

    const automationDiagram = document.querySelector<HTMLElement>(".automation-diagram");
    const connectorPaths = Array.from(
      document.querySelectorAll<SVGPathElement>(".automation-base-path"),
    );

    connectorPaths.forEach((path) => {
      track(animate(path, { pathLength: 0, opacity: 0.18 }, { duration: 0 }));
    });

    if (automationDiagram) {
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
                  { duration: 1.8, delay: index * 0.16, ease: smoothEase },
                ),
              );
            });

            automationLabels.forEach((label, index) => {
              track(
                animate(
                  label,
                  { opacity: 1, filter: "blur(0px)" },
                  { duration: 0.9, delay: 0.42 + index * 0.12, ease: smoothEase },
                ),
              );
            });
          },
          { amount: 0.2 },
        ),
      );
    }

    track(
      animate(
        ".automation-orb",
        {
          scale: [1, 1.018, 1],
          boxShadow: [
            "0 10px 30px rgba(20, 71, 230, 0.06)",
            "0 18px 48px rgba(20, 71, 230, 0.15)",
            "0 10px 30px rgba(20, 71, 230, 0.06)",
          ],
        },
        { duration: 9.5, repeat: Infinity, ease: "easeInOut" },
      ),
    );

    // Refined hover motion: no aggressive tilt, only soft lift and depth.
    document
      .querySelectorAll<HTMLElement>(".feature-card, .audience-card, .workflow-card")
      .forEach((card) => {
        const enter = () =>
          track(
            animate(
              card,
              { y: -5, scale: 1.006 },
              { type: "spring", stiffness: 155, damping: 22, mass: 0.85 },
            ),
          );
        const leave = () =>
          track(
            animate(
              card,
              { y: 0, scale: 1 },
              { type: "spring", stiffness: 150, damping: 24, mass: 0.9 },
            ),
          );
        listen(card, "mouseenter", enter);
        listen(card, "mouseleave", leave);
        listen(card, "focusin", enter);
        listen(card, "focusout", leave);
      });

    document
      .querySelectorAll<HTMLElement>(
        ".primary-button, .secondary-button, .sales-button, .contact-form button",
      )
      .forEach((button) => {
        const enter = () =>
          track(
            animate(
              button,
              { y: -3, scale: 1.012 },
              { type: "spring", stiffness: 175, damping: 23, mass: 0.78 },
            ),
          );
        const leave = () =>
          track(
            animate(
              button,
              { y: 0, scale: 1 },
              { type: "spring", stiffness: 165, damping: 24, mass: 0.82 },
            ),
          );
        listen(button, "mouseenter", enter);
        listen(button, "mouseleave", leave);
        listen(button, "focus", enter);
        listen(button, "blur", leave);
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
