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

    const paths = Array.from(svg.querySelectorAll<SVGPathElement>("path"));
    if (paths.length < 6) return;

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

      const topStart: Point = { x: centerX, y: centerRect.top };
      const topEnd: Point = { x: (topRect.left + topRect.right) / 2, y: topRect.bottom };
      const bottomStart: Point = { x: centerX, y: centerRect.bottom };
      const bottomEnd: Point = {
        x: (bottomRect.left + bottomRect.right) / 2,
        y: bottomRect.top,
      };

      paths[0].setAttribute("d", `M ${topStart.x} ${topStart.y} V ${topEnd.y}`);
      paths[1].setAttribute("d", `M ${bottomStart.x} ${bottomStart.y} V ${bottomEnd.y}`);

      paths[2].setAttribute(
        "d",
        leftPath(
          { x: leftTopRect.right, y: (leftTopRect.top + leftTopRect.bottom) / 2 },
          { x: circleXAtOffset(-branchOffset, "left"), y: upperY },
          true,
        ),
      );

      paths[3].setAttribute(
        "d",
        leftPath(
          { x: leftBottomRect.right, y: (leftBottomRect.top + leftBottomRect.bottom) / 2 },
          { x: circleXAtOffset(branchOffset, "left"), y: lowerY },
          false,
        ),
      );

      paths[4].setAttribute(
        "d",
        rightPath(
          { x: rightTopRect.left, y: (rightTopRect.top + rightTopRect.bottom) / 2 },
          { x: circleXAtOffset(-branchOffset, "right"), y: upperY },
          true,
        ),
      );

      paths[5].setAttribute(
        "d",
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
    };
  }, []);

  return null;
}
