"use client";

import { animate } from "motion";
import { useEffect } from "react";

type Stoppable = { stop: () => void };

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

export default function WorkflowTracingBeam() {
  useEffect(() => {
    const workflow = document.querySelector<HTMLElement>(".workflow-list");
    if (!workflow || workflow.querySelector(".workflow-tracing-beam")) return;

    const beam = document.createElement("div");
    beam.className = "workflow-tracing-beam";
    beam.setAttribute("aria-hidden", "true");
    beam.innerHTML = `
      <svg viewBox="0 0 18 1000" preserveAspectRatio="none">
        <defs>
          <linearGradient id="workflowBeamGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#8fb6ff" stop-opacity="0" />
            <stop offset="26%" stop-color="#79a8ff" stop-opacity="0.76" />
            <stop offset="62%" stop-color="#1447e6" />
            <stop offset="100%" stop-color="#7ba9ff" stop-opacity="0.2" />
          </linearGradient>
          <filter id="workflowBeamGlow" x="-200%" y="-20%" width="500%" height="140%">
            <feGaussianBlur stdDeviation="3.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path class="workflow-beam-track" d="M9 0V1000" pathLength="1000" />
        <path class="workflow-beam-progress" d="M9 0V1000" pathLength="1000" />
      </svg>
      <span class="workflow-beam-head"></span>
    `;

    workflow.prepend(beam);

    const progressPath = beam.querySelector<SVGPathElement>(".workflow-beam-progress");
    const head = beam.querySelector<HTMLElement>(".workflow-beam-head");
    if (!progressPath || !head) {
      beam.remove();
      return;
    }

    progressPath.style.strokeDasharray = "1000";
    progressPath.style.strokeDashoffset = "1000";

    let frame = 0;
    let currentProgress = 0;
    let targetProgress = 0;

    const measure = () => {
      const rect = workflow.getBoundingClientRect();
      const startLine = window.innerHeight * 0.78;
      const endLine = window.innerHeight * 0.22;
      const travel = Math.max(1, rect.height + startLine - endLine);
      targetProgress = clamp((startLine - rect.top) / travel);
    };

    const render = () => {
      currentProgress += (targetProgress - currentProgress) * 0.075;
      const dashOffset = 1000 * (1 - currentProgress);
      progressPath.style.strokeDashoffset = String(dashOffset);
      head.style.top = `${currentProgress * 100}%`;
      head.style.opacity = currentProgress > 0.015 && currentProgress < 0.995 ? "1" : "0";

      if (Math.abs(targetProgress - currentProgress) > 0.0005) {
        frame = window.requestAnimationFrame(render);
      } else {
        frame = 0;
      }
    };

    const requestRender = () => {
      measure();
      if (!frame) frame = window.requestAnimationFrame(render);
    };

    const pulse: Stoppable = animate(
      head,
      {
        scale: [0.88, 1.14, 0.88],
        boxShadow: [
          "0 0 0 0 rgba(20, 71, 230, 0.12)",
          "0 0 0 9px rgba(20, 71, 230, 0.03)",
          "0 0 0 0 rgba(20, 71, 230, 0.12)",
        ],
      },
      { duration: 4.8, repeat: Infinity, ease: "easeInOut" },
    );

    const resizeObserver = new ResizeObserver(requestRender);
    resizeObserver.observe(workflow);

    window.addEventListener("scroll", requestRender, { passive: true });
    window.addEventListener("resize", requestRender);
    requestRender();

    return () => {
      pulse.stop();
      resizeObserver.disconnect();
      window.removeEventListener("scroll", requestRender);
      window.removeEventListener("resize", requestRender);
      if (frame) window.cancelAnimationFrame(frame);
      beam.remove();
    };
  }, []);

  return null;
}
