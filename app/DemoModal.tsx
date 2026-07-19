"use client";

import { useEffect, useState } from "react";

const demoUrl = "https://test-project-frontend-propraty.slsqyw.easypanel.host/";

export default function DemoModal() {
  const [open, setOpen] = useState(false);

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

      {open ? (
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
              x
            </button>
            <h2 id="demo-modal-title">Demo Login</h2>
            <div className="demo-credentials">
              <p>
                <span>email:</span> test@gmail.com
              </p>
              <p>
                <span>password:</span> 11111111
              </p>
            </div>
            <a className="demo-view-button" href={demoUrl}>
              View
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
