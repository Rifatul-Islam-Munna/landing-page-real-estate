"use client";

import { useEffect } from "react";
import { animate, inView } from "motion";
import { useReducedMotion } from "motion/react";

type Stoppable = { stop: () => void };

export default function MotionEffects() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    const root = document.documentElement;
    root.classList.add("motion-enhanced");

    const animations: Stoppable[] = [];
    const observers: Array<() => void> = [];
    const cleanups: Array<() => void> = [];

    const track = (animation: Stoppable) => {
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

    // Header and hero entrance.
    track(
      animate(
        ".top-nav",
        { opacity: [0, 1], y: [-22, 0] },
        { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
      ),
    );
    track(
      animate(
        ".hero-copy h1",
        { opacity: [0, 1], y: [34, 0], filter: ["blur(10px)", "blur(0px)"] },
        { duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] },
      ),
    );
    track(
      animate(
        ".hero-copy p",
        { opacity: [0, 1], y: [24, 0] },
        { duration: 0.72, delay: 0.28, ease: [0.22, 1, 0.36, 1] },
      ),
    );
    track(
      animate(
        ".hero-buttons",
        { opacity: [0, 1], y: [18, 0], scale: [0.96, 1] },
        { duration: 0.65, delay: 0.4, ease: [0.22, 1, 0.36, 1] },
      ),
    );
    track(
      animate(
        ".dashboard-glass",
        { opacity: [0, 1] },
        { duration: 0.9, delay: 0.5, ease: "easeOut" },
      ),
    );

    // Soft hero wobble and dashboard breathing.
    track(
      animate(
        ".hero-ellipse",
        {
          x: ["-50%", "-49.4%", "-50.6%", "-50%"],
          y: [0, -14, 9, 0],
          rotate: [0, 0.65, -0.65, 0],
          scale: [1, 1.014, 0.996, 1],
        },
        { duration: 13, repeat: Infinity, ease: "easeInOut" },
      ),
    );
    track(
      animate(
        ".dashboard-glass img",
        { y: [0, -5, 2, 0], scale: [1, 1.006, 1.002, 1] },
        { duration: 7.5, repeat: Infinity, ease: "easeInOut" },
      ),
    );

    // Floating metric cards dance independently.
    track(
      animate(
        ".metric-leads",
        { x: [0, 11, -7, 0], y: [0, -11, 6, 0], rotate: [0, 1.4, -1, 0] },
        { duration: 6.2, repeat: Infinity, ease: "easeInOut" },
      ),
    );
    track(
      animate(
        ".metric-pipeline",
        { x: [0, -10, 7, 0], y: [0, 8, -10, 0], rotate: [0, -1.2, 1, 0] },
        { duration: 7.1, repeat: Infinity, ease: "easeInOut", delay: 0.35 },
      ),
    );
    track(
      animate(
        ".metric-conversion",
        {
          x: ["-50%", "-47%", "-53%", "-50%"],
          y: [0, -9, 5, 0],
          rotate: [0, 1, -1.3, 0],
        },
        { duration: 6.7, repeat: Infinity, ease: "easeInOut", delay: 0.7 },
      ),
    );

    // Contact button: fade its label and send the arrow to the right edge.
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
            { opacity: 0, x: 16, filter: "blur(5px)" },
            { duration: 0.2, ease: "easeOut" },
          ),
        );
        track(
          animate(
            contactIcon,
            { x: targetX, rotate: 45, scale: 1.06 },
            { type: "spring", stiffness: 340, damping: 25 },
          ),
        );
      };
      const leave = () => {
        track(
          animate(
            contactLabel,
            { opacity: 1, x: 0, filter: "blur(0px)" },
            { duration: 0.24, ease: "easeOut" },
          ),
        );
        track(
          animate(
            contactIcon,
            { x: 0, rotate: 0, scale: 1 },
            { type: "spring", stiffness: 360, damping: 26 },
          ),
        );
      };

      listen(contactButton, "mouseenter", enter);
      listen(contactButton, "mouseleave", leave);
      listen(contactButton, "focusin", enter);
      listen(contactButton, "focusout", leave);
    }

    // Navigation hover motion.
    document.querySelectorAll<HTMLElement>(".nav-links a").forEach((link) => {
      const enter = () =>
        track(
          animate(link, { y: -3, color: "#1447e6" }, { duration: 0.18, ease: "easeOut" }),
        );
      const leave = () =>
        track(
          animate(link, { y: 0, color: "#050505" }, { duration: 0.2, ease: "easeOut" }),
        );
      listen(link, "mouseenter", enter);
      listen(link, "mouseleave", leave);
      listen(link, "focus", enter);
      listen(link, "blur", leave);
    });

    // Reusable scroll reveal with staggered delays.
    const reveal = (
      selector: string,
      options: { y?: number; delayStep?: number; amount?: number } = {},
    ) => {
      const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
      const y = options.y ?? 38;
      const delayStep = options.delayStep ?? 0.07;

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
                    duration: 0.72,
                    delay: (index % 4) * delayStep,
                    ease: [0.22, 1, 0.36, 1],
                  },
                ),
              );
            },
            { amount: options.amount ?? 0.18, margin: "0px 0px -8% 0px" },
          ),
        );
      });
    };

    reveal(".section-title", { y: 42, delayStep: 0 });
    reveal(".feature-card", { y: 48, delayStep: 0.08, amount: 0.12 });
    reveal(".workflow-row", { y: 42, delayStep: 0.07, amount: 0.18 });
    reveal(".screenshot-frame", { y: 42, delayStep: 0, amount: 0.15 });
    reveal(".audience-card", { y: 42, delayStep: 0.08, amount: 0.16 });
    reveal(".sales-panel", { y: 48, delayStep: 0, amount: 0.2 });
    reveal(".contact-layout", { y: 48, delayStep: 0, amount: 0.16 });
    reveal(".footer-links, .footer-wordmark, .footer-bottom", {
      y: 30,
      delayStep: 0.06,
      amount: 0.15,
    });

    // Automation labels materialize without disturbing their exact positioning.
    const automationLabels = Array.from(
      document.querySelectorAll<HTMLElement>(".automation-label"),
    );
    automationLabels.forEach((label) => {
      track(animate(label, { opacity: 0, filter: "blur(9px)" }, { duration: 0 }));
    });

    const automationDiagram = document.querySelector<HTMLElement>(".automation-diagram");
    const connectorPaths = Array.from(
      document.querySelectorAll<SVGPathElement>(".automation-connectors path"),
    );

    connectorPaths.forEach((path) => {
      track(animate(path, { pathLength: 0, opacity: 0.12 }, { duration: 0 }));
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
                  {
                    duration: 1.05,
                    delay: index * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  },
                ),
              );
            });

            automationLabels.forEach((label, index) => {
              track(
                animate(
                  label,
                  { opacity: 1, filter: "blur(0px)" },
                  { duration: 0.55, delay: 0.28 + index * 0.08, ease: "easeOut" },
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
          scale: [1, 1.045, 0.99, 1],
          boxShadow: [
            "0 0 0 rgba(20, 71, 230, 0)",
            "0 18px 46px rgba(20, 71, 230, 0.18)",
            "0 8px 24px rgba(20, 71, 230, 0.08)",
            "0 0 0 rgba(20, 71, 230, 0)",
          ],
        },
        { duration: 5.2, repeat: Infinity, ease: "easeInOut" },
      ),
    );

    // Gentle continuous movement for pills and screenshot shell.
    document.querySelectorAll<HTMLElement>(".section-pill").forEach((pill, index) => {
      track(
        animate(
          pill,
          { y: [0, -4, 0] },
          { duration: 3.8 + (index % 3) * 0.35, repeat: Infinity, ease: "easeInOut" },
        ),
      );
    });
    track(
      animate(
        ".screenshot-frame",
        { y: [0, -6, 0] },
        { duration: 6.5, repeat: Infinity, ease: "easeInOut" },
      ),
    );

    // Interactive 3D tilt on cards.
    const tiltCards = Array.from(
      document.querySelectorAll<HTMLElement>(".feature-card, .audience-card"),
    );
    tiltCards.forEach((card) => {
      const move = (event: Event) => {
        const pointer = event as PointerEvent;
        const rect = card.getBoundingClientRect();
        const px = (pointer.clientX - rect.left) / rect.width - 0.5;
        const py = (pointer.clientY - rect.top) / rect.height - 0.5;
        track(
          animate(
            card,
            {
              rotateX: py * -6,
              rotateY: px * 7,
              y: -7,
              scale: 1.012,
            },
            { duration: 0.22, ease: "easeOut" },
          ),
        );
      };
      const leave = () =>
        track(
          animate(
            card,
            { rotateX: 0, rotateY: 0, y: 0, scale: 1 },
            { type: "spring", stiffness: 260, damping: 23 },
          ),
        );

      listen(card, "pointermove", move, { passive: true });
      listen(card, "pointerleave", leave);
    });

    // Shared spring hover for primary actions.
    document
      .querySelectorAll<HTMLElement>(
        ".primary-button, .secondary-button, .sales-button, .contact-form button",
      )
      .forEach((button) => {
        const enter = () =>
          track(
            animate(
              button,
              { y: -4, scale: 1.025 },
              { type: "spring", stiffness: 360, damping: 22 },
            ),
          );
        const leave = () =>
          track(
            animate(
              button,
              { y: 0, scale: 1 },
              { type: "spring", stiffness: 360, damping: 24 },
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
