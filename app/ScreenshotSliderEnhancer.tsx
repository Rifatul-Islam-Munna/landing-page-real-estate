"use client";

import { useEffect } from "react";

const screenshots = [
  {
    src: "/Website%20elements/Group%2029066.png",
    alt: "Lead CRM dashboard",
    position: "center",
    scale: "1",
  },
  {
    src: "/Website%20elements/Group%2029067.png",
    alt: "Real estate reports dashboard",
    position: "center",
    scale: "1",
  },
  {
    src: "/Website%20elements/Group%2029068.png",
    alt: "Property listings dashboard",
    position: "center",
    scale: "1",
  },
  {
    src: "/Website%20elements/Group%2029069.png",
    alt: "Property chat workspace",
    position: "center",
    scale: "1",
  },
  {
    src: "/Website%20elements/Group%2029070.png",
    alt: "Lead activity workspace",
    position: "center",
    scale: "1",
  },
  {
    src: "/Website%20elements/Group%2029071.png",
    alt: "Real estate document workspace",
    position: "center",
    scale: "1",
  },
  {
    src: "/Website%20elements/Group%2029072.png",
    alt: "Contact management workspace",
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
    let autoplayId = 0;
    const buttons: HTMLButtonElement[] = [];

    const showSlide = (index: number) => {
      const previousIndex = activeIndex;
      const direction =
        index === previousIndex ? "next" : index > previousIndex || (previousIndex === screenshots.length - 1 && index === 0) ? "next" : "prev";
      activeIndex = index;
      const slide = screenshots[index];

      screenshot.dataset.direction = direction;
      screenshot.classList.add("is-changing");
      window.setTimeout(() => {
        screenshot.src = slide.src;
        screenshot.alt = slide.alt;
        screenshot.style.objectPosition = slide.position;
        screenshot.style.removeProperty("transform");
        screenshot.classList.remove("is-changing");
        screenshot.classList.add("is-entering");
        window.setTimeout(() => {
          screenshot.classList.remove("is-entering");
        }, 1800);
      }, 760);

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
      button.addEventListener("click", () => {
        window.clearInterval(autoplayId);
        showSlide(index);
        autoplayId = window.setInterval(() => {
          showSlide((activeIndex + 1) % screenshots.length);
        }, 8200);
      });
      controls.appendChild(button);
      buttons.push(button);
    });

    showSlide(0);
    autoplayId = window.setInterval(() => {
      showSlide((activeIndex + 1) % screenshots.length);
    }, 8200);

    return () => {
      window.clearInterval(autoplayId);
      buttons.forEach((button) => button.replaceWith(button.cloneNode(true)));
    };
  }, []);

  return null;
}
