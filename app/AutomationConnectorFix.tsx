"use client";

import { useLayoutEffect } from "react";

const EXACT_PATHS = [
  "M 560 58 V 260",
  "M 560 440 V 642",
  "M 289 167 H 355 C 376 167 385 177 385 198 V 309 C 385 329 395 338 416 338 H 470",
  "M 283 532 H 355 C 376 532 385 522 385 501 V 391 C 385 371 395 362 416 362 H 470",
  "M 810 167 H 738 C 717 167 707 177 707 198 V 309 C 707 329 697 338 676 338 H 650",
  "M 793 532 H 738 C 717 532 707 522 707 501 V 391 C 707 371 697 362 676 362 H 650",
] as const;

export default function AutomationConnectorFix() {
  useLayoutEffect(() => {
    const svg = document.querySelector<SVGSVGElement>(".automation-connectors");
    const orb = document.querySelector<HTMLElement>(".automation-orb");

    if (!svg) return;

    let artwork: HTMLImageElement | null = null;

    if (orb) {
      orb.querySelector(".automation-orb-image")?.remove();

      artwork = document.createElement("img");
      artwork.className = "automation-orb-image";
      artwork.alt = "";
      artwork.setAttribute("aria-hidden", "true");
      artwork.decoding = "async";
      artwork.style.position = "absolute";
      artwork.style.inset = "0";
      artwork.style.zIndex = "1";
      artwork.style.display = "block";
      artwork.style.width = "100%";
      artwork.style.height = "100%";
      artwork.style.objectFit = "cover";
      artwork.style.objectPosition = "center";
      artwork.style.borderRadius = "inherit";
      artwork.style.transform = "scale(1.035)";
      artwork.style.pointerEvents = "none";

      const pageRelativeUrl = new URL("Rectangle%2020.png", document.baseURI).href;
      const rootUrl = new URL("/Rectangle%2020.png", window.location.origin).href;
      let triedRootFallback = false;

      artwork.addEventListener("error", () => {
        if (!triedRootFallback && artwork) {
          triedRootFallback = true;
          artwork.src = rootUrl;
        }
      });

      artwork.src = pageRelativeUrl;
      orb.appendChild(artwork);
    }

    const basePaths = Array.from(svg.querySelectorAll<SVGPathElement>(":scope > path")).slice(0, 6);
    if (basePaths.length < 6) {
      artwork?.remove();
      return;
    }

    basePaths.forEach((path, index) => {
      path.classList.add("automation-base-path");
      path.setAttribute("d", EXACT_PATHS[index]);
    });

    const oldDefs = svg.querySelector('[data-automation-beam="true"]');
    const oldGroup = svg.querySelector(".automation-beam-group");
    oldDefs?.remove();
    oldGroup?.remove();

    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.setAttribute("data-automation-beam", "true");
    defs.innerHTML = `
      <linearGradient id="automationBeamGradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0" />
        <stop offset="38%" stop-color="#aac3ff" stop-opacity="0.38" />
        <stop offset="62%" stop-color="#3d70ff" stop-opacity="0.9" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
      </linearGradient>
      <filter id="automationBeamGlow" x="-120%" y="-120%" width="340%" height="340%">
        <feGaussianBlur stdDeviation="2.4" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    `;
    svg.prepend(defs);

    const beamGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    beamGroup.classList.add("automation-beam-group");

    EXACT_PATHS.forEach((d, index) => {
      const beam = document.createElementNS("http://www.w3.org/2000/svg", "path");
      beam.classList.add("automation-beam-path");
      beam.setAttribute("d", d);
      beam.setAttribute("pathLength", "100");
      beam.style.animationDelay = `${index * -1.35}s`;
      beam.style.animationDuration = `${8.8 + index * 0.35}s`;
      beamGroup.appendChild(beam);
    });

    svg.appendChild(beamGroup);

    return () => {
      artwork?.remove();
      beamGroup.remove();
      defs.remove();
    };
  }, []);

  return null;
}
