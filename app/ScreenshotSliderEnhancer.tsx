"use client";

import { useEffect } from "react";

const screenshots = [
  {
    src: "https://api.builder.io/api/v1/image/assets/TEMP/7e626b670f7efaaef021195d76691b278031ba8e?placeholderIfAbsent=true",
    alt: "Badal CRM workspace overview",
    position: "left top",
    scale: "1",
  },
  {
    src: "https://api.builder.io/api/v1/image/assets/TEMP/7e626b670f7efaaef021195d76691b278031ba8e?placeholderIfAbsent=true",
    alt: "Badal CRM lead management workspace",
    position: "center top",
    scale: "1.04",
  },
  {
    src: "https://api.builder.io/api/v1/image/assets/TEMP/7e626b670f7efaaef021195d76691b278031ba8e?placeholderIfAbsent=true",
    alt: "Badal CRM follow-up and pipeline workspace",
    position: "right top",
    scale: "1.04",
  },
  {
    src: "https://api.builder.io/api/v1/image/assets/TEMP/cbce36f30212c6d8f00700d6674c4ec5b1b1acea?placeholderIfAbsent=true",
    alt: "Badal CRM complete application view",
    position: "center",
    scale: "1",
  },
] as const;

export default function ScreenshotSliderEnhancer() {
  useEffect(() => {
    const screenshot = document.querySelector<HTMLImageElement>(".screenshot-frame img");
    const controls = document.querySelector<HTMLDivElement>(".screenshot-dots");

    if (!screenshot || !controls) return;

    let activeIndex = 0;
    const buttons: HTMLButtonElement[] = [];

    const showSlide = (index: number) => {
      activeIndex = index;
      const slide = screenshots[index];

      screenshot.classList.add("is-changing");
      window.setTimeout(() => {
        screenshot.src = slide.src;
        screenshot.alt = slide.alt;
        screenshot.style.objectPosition = slide.position;
        screenshot.style.transform = `scale(${slide.scale})`;
        screenshot.classList.remove("is-changing");
      }, 120);

      buttons.forEach((button, buttonIndex) => {
        const isActive = buttonIndex === activeIndex;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-current", isActive ? "true" : "false");
      });
    };

    controls.replaceChildren();

    screenshots.forEach((slide, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "screenshot-dot-button";
      button.setAttribute("aria-label", `Show screenshot ${index + 1}: ${slide.alt}`);

      const artwork = document.createElement("img");
      artwork.src = "/Rectangle%208865.png";
      artwork.alt = "";
      artwork.setAttribute("aria-hidden", "true");

      button.appendChild(artwork);
      button.addEventListener("click", () => showSlide(index));
      controls.appendChild(button);
      buttons.push(button);
    });

    showSlide(0);

    return () => {
      buttons.forEach((button) => button.replaceWith(button.cloneNode(true)));
    };
  }, []);

  return null;
}
