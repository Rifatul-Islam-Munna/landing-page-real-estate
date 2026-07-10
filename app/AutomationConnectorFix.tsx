"use client";

import { useLayoutEffect } from "react";

const VIEWBOX_WIDTH = 1120;
const VIEWBOX_HEIGHT = 700;

type Point = { x: number; y: number };

export default function AutomationConnectorFix() {
  useLayoutEffect(() => {
    const diagram = document.querySelector<HTMLElement>(".automation-diagram");
    const svg = diagram?.querySelector<SVGSVGElement>(".automation-connectors");

    if (!diagram || !svg) return;

    const basePaths = Array.from(svg.querySelectorAll<SVGPathElement>(":scope > path")).slice(0, 6);
    if (basePaths.length < 6) return;

    basePaths.forEach((path) => path.classList.add("automation-base-path"));

    let defs = svg.querySelector<SVGDefsElement>("defs[data-automation-beam]");
    if (!defs) {
      defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
      defs.dataset.automationBeam = "true";
      defs.innerHTML = `
        <linearGradient id="automationBeamGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#b8d1ff" stop-opacity="0" />
          <stop offset="38%" stop-color="#7da9ff" stop-opacity="0.72" />
          <stop offset="68%" stop-color="#1447e6" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0.9" />
        </linearGradient>
        <filter id="automationBeamGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      `;
      svg.prepend(defs);
    }

    let beamGroup = svg.querySelector<SVGGElement>(".automation-beam-group");
    if (!beamGroup) {
      beamGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
      beamGroup.classList.add("automation-beam-group");
      svg.appendChild(beamGroup);
    }

    const beamPaths: SVGPathElement[] = [];
    for (let index = 0; index < 6; index += 1) {
      let beamPath = beamGroup.children[index] as SVGPathElement | undefined;
      if (!beamPath) {
        beamPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        beamGroup.appendChild(beamPath);
      }
      beamPath.classList.add("automation-beam-path");
      beamPath.setAttribute("pathLength", "100");
      beamPath.style.animationDelay = `${index * -1.1}s`;
      beamPath.style.animationDuration = `${8.4 + index * 0.55}s`;
      beamPaths.push(beamPath);
    }

    const top = diagram.querySelector<HTMLElement>(".automation-top");
    const bottom = diagram.querySelector<HTMLElement>(".automation-bottom");
    const leftTop = diagram.querySelector<HTMLElement>(".automation-left-top");
    const leftBottom = diagram.querySelector<HTMLElement>(".automation-left-bottom");
    const rightTop = diagram.querySelector<HTMLElement>(".automation-right-top");
    const rightBottom = diagram.querySelector<HTMLElement>(".automation-right-bottom");
    const center = diagram.querySelector<HTMLElement>(".automation-center");

    if (!top || !bottom || !leftTop || !leftBottom || !rightTop || !rightBottom || !center) {
      return;
    }

    const toLocalRect = (element: HTMLElement) => {
      const diagramRect = diagram.getBoundingClientRect();
      const rect = element.getBoundingClientRect();
      const scaleX = VIEWBOX_WIDTH / diagramRect.width;
      const scaleY = VIEWBOX_HEIGHT / diagramRect.height;

      return {
        left: (rect.left - diagramRect.left) * scaleX,
        right: (rect.right - diagramRect.left) * scaleX,
        top: (rect.top - diagramRect.top) * scaleY,
        bottom: (rect.bottom - diagramRect.top) * scaleY,
        width: rect.width * scaleX,
        height: rect.height * scaleY,
      };
    };

    const leftPath = (label: Point, hub: Point, isUpper: boolean) => {
      const gap = Math.max(90, hub.x - label.x);
      const firstBend = label.x + Math.min(72, gap * 0.34);
      const radius = Math.min(28, Math.abs(hub.y - label.y) / 3);
      const innerX = Math.min(hub.x - 34, firstBend + radius);

      if (isUpper) {
        return [
          `M ${label.x} ${label.y}`,
          `H ${firstBend}`,
          `Q ${innerX} ${label.y} ${innerX} ${label.y + radius}`,
          `V ${hub.y - radius}`,
          `Q ${innerX} ${hub.y} ${innerX + radius} ${hub.y}`,
          `H ${hub.x}`,
        ].join(" ");
      }

      return [
        `M ${label.x} ${label.y}`,
        `H ${firstBend}`,
        `Q ${innerX} ${label.y} ${innerX} ${label.y - radius}`,
        `V ${hub.y + radius}`,
        `Q ${innerX} ${hub.y} ${innerX + radius} ${hub.y}`,
        `H ${hub.x}`,
      ].join(" ");
    };

    const rightPath = (label: Point, hub: Point, isUpper: boolean) => {
      const gap = Math.max(90, label.x - hub.x);
      const firstBend = label.x - Math.min(72, gap * 0.34);
      const radius = Math.min(28, Math.abs(hub.y - label.y) / 3);
      const innerX = Math.max(hub.x + 34, firstBend - radius);

      if (isUpper) {
        return [
          `M ${label.x} ${label.y}`,
          `H ${firstBend}`,
          `Q ${innerX} ${label.y} ${innerX} ${label.y + radius}`,
          `V ${hub.y - radius}`,
          `Q ${innerX} ${hub.y} ${innerX - radius} ${hub.y}`,
          `H ${hub.x}`,
        ].join(" ");
      }

      return [
        `M ${label.x} ${label.y}`,
        `H ${firstBend}`,
        `Q ${innerX} ${label.y} ${innerX} ${label.y - radius}`,
        `V ${hub.y + radius}`,
        `Q ${innerX} ${hub.y} ${innerX - radius} ${hub.y}`,
        `H ${hub.x}`,
      ].join(" ");
    };

    const setPath = (index: number, d: string) => {
      basePaths[index].setAttribute("d", d);
      beamPaths[index].setAttribute("d", d);
    };

    const updatePaths = () => {
      if (getComputedStyle(svg).display === "none") return;

      const topRect = toLocalRect(top);
      const bottomRect = toLocalRect(bottom);
      const leftTopRect = toLocalRect(leftTop);
      const leftBottomRect = toLocalRect(leftBottom);
      const rightTopRect = toLocalRect(rightTop);
      const rightBottomRect = toLocalRect(rightBottom);
      const centerRect = toLocalRect(center);

      const centerX = (centerRect.left + centerRect.right) / 2;
      const centerY = (centerRect.top + centerRect.bottom) / 2;
      const radiusX = centerRect.width / 2;
      const radiusY = centerRect.height / 2;
      const branchOffset = radiusY * 0.18;

      const circleXAtOffset = (offsetY: number, side: "left" | "right") => {
        const normalized = Math.min(0.98, Math.abs(offsetY) / radiusY);
        const xOffset = radiusX * Math.sqrt(1 - normalized * normalized);
        return side === "left" ? centerX - xOffset : centerX + xOffset;
      };

      const upperY = centerY - branchOffset;
      const lowerY = centerY + branchOffset;

      const topHub: Point = { x: centerX, y: centerRect.top };
      const topLabel: Point = { x: (topRect.left + topRect.right) / 2, y: topRect.bottom };
      const bottomHub: Point = { x: centerX, y: centerRect.bottom };
      const bottomLabel: Point = {
        x: (bottomRect.left + bottomRect.right) / 2,
        y: bottomRect.top,
      };

      // All paths are directed from each outer pill toward the automation hub,
      // allowing every light beam to visibly converge on the center.
      setPath(0, `M ${topLabel.x} ${topLabel.y} V ${topHub.y}`);
      setPath(1, `M ${bottomLabel.x} ${bottomLabel.y} V ${bottomHub.y}`);
      setPath(
        2,
        leftPath(
          { x: leftTopRect.right, y: (leftTopRect.top + leftTopRect.bottom) / 2 },
          { x: circleXAtOffset(-branchOffset, "left"), y: upperY },
          true,
        ),
      );
      setPath(
        3,
        leftPath(
          { x: leftBottomRect.right, y: (leftBottomRect.top + leftBottomRect.bottom) / 2 },
          { x: circleXAtOffset(branchOffset, "left"), y: lowerY },
          false,
        ),
      );
      setPath(
        4,
        rightPath(
          { x: rightTopRect.left, y: (rightTopRect.top + rightTopRect.bottom) / 2 },
          { x: circleXAtOffset(-branchOffset, "right"), y: upperY },
          true,
        ),
      );
      setPath(
        5,
        rightPath(
          { x: rightBottomRect.left, y: (rightBottomRect.top + rightBottomRect.bottom) / 2 },
          { x: circleXAtOffset(branchOffset, "right"), y: lowerY },
          false,
        ),
      );
    };

    updatePaths();

    const resizeObserver = new ResizeObserver(updatePaths);
    resizeObserver.observe(diagram);
    [top, bottom, leftTop, leftBottom, rightTop, rightBottom, center].forEach((element) =>
      resizeObserver.observe(element),
    );

    window.addEventListener("resize", updatePaths);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updatePaths);
      beamGroup?.remove();
      defs?.remove();
    };
  }, []);

  return null;
}
