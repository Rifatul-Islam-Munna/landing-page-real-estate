"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const demoUrl = "https://test-project-frontend-propraty.slsqyw.easypanel.host/";

export default function DemoModal() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button className="secondary-button" type="button" onClick={() => setOpen(true)}>
        View Demo
        <span aria-hidden="true">&#8599;</span>
      </button>

      {mounted && open
        ? createPortal(
        <div className="demo-modal-backdrop" role="presentation" onClick={() => setOpen(false)}>
          <div
            className="demo-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="demo-modal-close"
              type="button"
              aria-label="Close demo login modal"
              onClick={() => setOpen(false)}
            >
              &times;
            </button>
            <h2 id="demo-modal-title">Demo Login</h2>
            <p className="demo-modal-subtitle">Use these credentials to preview dashboard.</p>
            <div className="demo-credentials">
              <p>
                <span>Email</span>
                <strong>test@gmail.com</strong>
              </p>
              <p>
                <span>Password</span>
                <strong>11111111</strong>
              </p>
            </div>
            <a className="demo-view-button" href={demoUrl}>
              View
            </a>
          </div>
        </div>,
          document.body,
        )
        : null}
    </>
  );
}
