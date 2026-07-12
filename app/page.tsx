const featureItems = [
  {
    icon: "lead",
    title: "Lead CRM",
    description:
      "Capture, organize, and manage every buyer, renter, seller, or investor from first contact to closing.",
  },
  {
    icon: "home",
    title: "Property Listings",
    description:
      "Manage property records, prices, types, status, assigned agents, and days open.",
  },
  {
    icon: "mail",
    title: "Email & SMS",
    description:
      "Send messages, schedule follow-ups, and keep communication history connected to each lead.",
  },
  {
    icon: "pipeline",
    title: "Deal Pipeline",
    description:
      "Move qualified leads through offer, contract, inspection, financing, and closing stages.",
  },
  {
    icon: "calendar",
    title: "Realtor Showings",
    description:
      "Schedule property showings, match properties, and automate follow-up messages.",
  },
  {
    icon: "document",
    title: "Document Repository",
    description:
      "Store contracts, brochures, disclosures, reusable templates, and files that need signatures.",
  },
  {
    icon: "pdf",
    title: "PDF Builder",
    description:
      "Create professional PDF templates with text, images, tables, QR codes, and signature fields.",
  },
  {
    icon: "chart",
    title: "Reports & Analytics",
    description:
      "Track revenue, closed deals, conversion rate, average deal value, and agent performance.",
  },
] as const;

const workflowItems = [
  ["Capture Leads", "Import from email, forms, listing platforms, or manual entry."],
  ["Assign Agents", "Send each lead to the right agent or team."],
  ["Follow Up Automatically", "Schedule email, SMS, call reminders, and next actions."],
  ["Match Properties", "Connect leads with the right listings and showings."],
  ["Move Deals Forward", "Track offers, contracts, inspections, financing, and closing."],
  ["Report Performance", "See revenue, conversion, agent activity, and deal progress."],
] as const;

const audienceItems = [
  ["agency", "Real Estate", "Agencies"],
  ["manager", "Property", "Managers"],
  ["apartment", "Apartment", "Communities"],
  ["broker", "Broker", "Teams"],
] as const;

type IconName =
  | "lead"
  | "home"
  | "mail"
  | "pipeline"
  | "calendar"
  | "document"
  | "pdf"
  | "chart"
  | "agency"
  | "manager"
  | "apartment"
  | "broker";

function Icon({ name }: { name: IconName }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const paths: Record<IconName, React.ReactNode> = {
    lead: (
      <>
        <path {...common} d="M8.5 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
        <path {...common} d="M2.5 20c.5-4 2.5-6 6-6s5.5 2 6 6" />
        <path {...common} d="M17 8v6m-3-3h6" />
      </>
    ),
    home: (
      <>
        <path {...common} d="m3 11 9-7 9 7" />
        <path {...common} d="M5 10v10h14V10" />
        <path {...common} d="M9 20v-6h6v6" />
      </>
    ),
    mail: (
      <>
        <rect {...common} x="3" y="5" width="18" height="14" rx="2" />
        <path {...common} d="m4 7 8 6 8-6" />
      </>
    ),
    pipeline: (
      <>
        <path {...common} d="M4 6h10m-4-3 4 3-4 3" />
        <path {...common} d="M20 18H10m4-3-4 3 4 3" />
        <path {...common} d="M6 6v12" />
      </>
    ),
    calendar: (
      <>
        <rect {...common} x="3" y="5" width="18" height="16" rx="2" />
        <path {...common} d="M7 3v4m10-4v4M3 10h18" />
        <path {...common} d="m8 15 2 2 5-5" />
      </>
    ),
    document: (
      <>
        <path {...common} d="M6 3h8l4 4v14H6z" />
        <path {...common} d="M14 3v5h5M9 12h6M9 16h6" />
      </>
    ),
    pdf: (
      <>
        <path {...common} d="M6 3h8l4 4v14H6z" />
        <path {...common} d="M14 3v5h5" />
        <path {...common} d="M8 16h2a2 2 0 0 0 0-4H8v6m5 0v-6h1.5a3 3 0 0 1 0 6H13Zm5-6h3m-3 3h2" />
      </>
    ),
    chart: (
      <>
        <path {...common} d="M4 20V10m6 10V4m6 16v-7m4 7H2" />
        <path {...common} d="m4 8 5-4 6 5 5-5" />
      </>
    ),
    agency: (
      <>
        <path {...common} d="M4 20V8l8-5 8 5v12" />
        <path {...common} d="M8 20v-7h8v7M2 20h20" />
      </>
    ),
    manager: (
      <>
        <path {...common} d="M5 20V5h9v15M14 10h5v10" />
        <path {...common} d="M8 8h3m-3 4h3m-3 4h3m8 4H2" />
      </>
    ),
    apartment: (
      <>
        <path {...common} d="M4 20V4h10v16M14 8h6v12" />
        <path {...common} d="M7 7h2m2 0h1M7 11h2m2 0h1M7 15h2m2 0h1m6-4h1m-1 4h1M2 20h20" />
      </>
    ),
    broker: (
      <>
        <circle {...common} cx="8" cy="8" r="3" />
        <circle {...common} cx="17" cy="9" r="2.5" />
        <path {...common} d="M2.5 20c.4-4 2.2-6 5.5-6s5.1 2 5.5 6M14 14.5c3.7-.7 6.3 1.1 7 5.5" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function SectionPill({ label, light = false }: { label: string; light?: boolean }) {
  return (
    <div className={`section-pill${light ? " section-pill-light" : ""}`}>
      <span>Saas</span>
      <b>{label}</b>
    </div>
  );
}

export default function Home() {
  return (
    <div className="site-shell">
      <header className="hero" id="top">
        <img className="hero-ellipse" src="/Ellipse%201.png" alt="" aria-hidden="true" />

        <nav className="top-nav page-width" aria-label="Primary navigation">
          <a className="brand" href="#top" aria-label="Badal real estate CRM home">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/0231df5b1ac763107a40c10fc69f98b5192472af?placeholderIfAbsent=true"
              alt="Badal"
            />
            <span>
              Real estate <strong>CRM</strong>
            </span>
          </a>

          <div className="desktop-navigation">
            <div className="nav-links">
              <a href="#features">Features</a>
              <a href="#workflow">Workflow</a>
              <a href="#screenshots">Screenshots</a>
              <a href="#automation">Automation</a>
            </div>
            <a className="contact-button" href="#contact">
              <span className="contact-button-icon" aria-hidden="true" />
              <span>contact us</span>
            </a>
          </div>

          <details className="mobile-navigation">
            <summary aria-label="Open navigation">
              <i />
              <i />
              <i />
            </summary>
            <div>
              <a href="#features">Features</a>
              <a href="#workflow">Workflow</a>
              <a href="#screenshots">Screenshots</a>
              <a href="#automation">Automation</a>
              <a href="#contact">Contact us</a>
            </div>
          </details>
        </nav>

        <div className="hero-copy">
          <h1>
            Turn Real Estate Leads
            <br />
            Into <em>Closed Deals</em>
          </h1>
          <p>
            Manage leads, listings, follow-ups, showings, documents, emails,
            <br className="desktop-break" /> SMS, agents, and deals from one simple workspace.
          </p>
          <div className="hero-buttons">
            <a href="#contact" className="primary-button">
              Book a Demo
            </a>
            <a href="#features" className="secondary-button">
              View Features
            </a>
          </div>
        </div>

        <div className="hero-dashboard page-width">
          <div className="metric-card metric-leads">
            <span className="metric-icon metric-icon-blue">
              <Icon name="lead" />
            </span>
            <span>
              <small>Active Leads</small>
              <strong>12</strong>
            </span>
          </div>

          <div className="dashboard-glass">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/7e626b670f7efaaef021195d76691b278031ba8e?placeholderIfAbsent=true"
              alt="Badal real estate CRM dashboard"
            />
          </div>

          <div className="metric-card metric-pipeline">
            <span className="metric-icon metric-icon-green">
              <Icon name="chart" />
            </span>
            <span>
              <small>Pipeline Value</small>
              <strong>12</strong>
            </span>
          </div>

          <div className="metric-card metric-conversion">
            <span className="metric-icon metric-icon-coral">
              <Icon name="pipeline" />
            </span>
            <span>
              <small>Conversion</small>
              <strong>100%</strong>
            </span>
          </div>
        </div>
      </header>

      <main className="main-gradient">
        <section className="features-section page-section" id="features">
          <div className="page-width">
            <div className="section-title section-title-features">
              <SectionPill label="Features" />
              <h2>
                Everything Your Real Estate Team Needs in <em>One Platform</em>
              </h2>
            </div>

            <div className="feature-grid">
              {featureItems.map((item) => (
                <article className="feature-card" key={item.title}>
                  <div className="feature-card-inner">
                    <span className="feature-icon">
                      <Icon name={item.icon} />
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}

              <article className="feature-card feature-card-more">
                <div className="feature-card-inner more-card-inner">
                  <img src="/Rectangle%2020.png" alt="" aria-hidden="true" />
                  <span className="more-plus">+</span>
                  <h3>Many more</h3>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="workflow-section page-section" id="workflow">
          <div className="page-width">
            <div className="section-title section-title-workflow">
              <SectionPill label="Workflow" />
              <h2>
                From First Lead to
                <br />
                <em>Closed Deal</em>
              </h2>
            </div>

            <div className="workflow-list">
              <div className="workflow-center-line" aria-hidden="true" />
              {workflowItems.map(([title, description], index) => (
                <article
                  className={`workflow-row ${index % 2 === 0 ? "workflow-left" : "workflow-right"}`}
                  key={title}
                >
                  <div className="workflow-card">
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                  <span className="workflow-number">{index + 1}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="screenshots-section page-section" id="screenshots">
          <div className="page-width">
            <div className="section-title section-title-screenshots">
              <SectionPill label="Screenshots" />
              <h2>
                A Clear Workspace for Every Part of Your
                <em> Real Estate Business</em>
              </h2>
            </div>

            <div className="screenshot-frame">
              <img
                src="/sliders/Group%2029066.png"
                alt="Lead CRM dashboard"
              />
            </div>

            <div className="screenshot-dots" aria-label="Screenshot pagination">
              <span className="active" />
              <span />
              <span />
              <span />
            </div>
          </div>
        </section>

        <section className="automation-section page-section" id="automation">
          <div className="page-width">
            <div className="section-title section-title-automation">
              <SectionPill label="Automation" />
              <h2>
                <em>Automate</em> the Follow-up Work That Usually Gets Forgotten
              </h2>
            </div>

            <div className="automation-diagram">
              <svg className="automation-connectors" viewBox="0 0 1120 700" aria-hidden="true">
                <path d="M560 258V78" />
                <path d="M560 442V634" />
                <path d="M470 338H295C250 338 225 315 225 270" />
                <path d="M470 382H300C250 382 240 430 240 500" />
                <path d="M650 338h175c45 0 70-23 70-68" />
                <path d="M650 382h170c50 0 60 48 60 118" />
              </svg>

              <div className="automation-label automation-top">Scheduled lead follow-ups</div>
              <div className="automation-label automation-left-top">Email and SMS outreach</div>
              <div className="automation-label automation-left-bottom">Lead activity history</div>
              <div className="automation-center">
                <div className="automation-orb">
                  <svg viewBox="0 0 84 84" aria-hidden="true">
                    <circle cx="42" cy="42" r="40" />
                    <path d="M42 17v9M42 58v9M17 42h9M58 42h9M24 24l6 6M54 54l6 6M60 24l-6 6M30 54l-6 6" />
                    <circle cx="42" cy="42" r="13" />
                  </svg>
                </div>
                <span>Automation</span>
              </div>
              <div className="automation-label automation-right-top">Realtor showing reminders</div>
              <div className="automation-label automation-right-bottom">Reply-based automation stop</div>
              <a className="automation-label automation-bottom" href="#contact">
                Request Custom Automation
              </a>
            </div>
          </div>
        </section>

        <section className="audience-section page-section" id="audience">
          <div className="page-width">
            <div className="section-title section-title-audience">
              <SectionPill label="Who It’s For" />
              <h2>
                Designed for <em>Modern</em>
                <br />
                Real Estate Teams
              </h2>
            </div>

            <div className="audience-grid">
              {audienceItems.map(([icon, accent, label], index) => (
                <article className={`audience-card audience-card-${index + 1}`} key={accent}>
                  <div className="audience-art">
                    <span>
                      <Icon name={icon as IconName} />
                    </span>
                  </div>
                  <h3>
                    <em>{accent}</em>
                    <br />
                    {label}
                  </h3>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="sales-section">
          <div className="page-width sales-panel">
            <div>
              <SectionPill label="Get Started" />
              <h2>Ready to Manage Your Real Estate Business from One Simple Workspace?</h2>
            </div>
            <a href="#contact" className="sales-button">
              Contact Sales <span>↗</span>
            </a>
          </div>
        </section>
      </main>

      <section className="contact-section" id="contact">
        <div className="page-width contact-layout">
          <div className="contact-copy">
            <div className="contact-label">
              <span /> CONTACT
            </div>
            <a href="mailto:badaldotagency@gmail.com">badaldotagency@gmail.com</a>
            <a href="tel:+8801907565617">+8801907565617</a>
            <a href="https://www.badal.agency" target="_blank" rel="noreferrer">
              www.badal.agency
            </a>
            <p>
              Real estate lead management software
              <br />
              built to close more deals.
            </p>
          </div>

          <form className="contact-form" action="mailto:badaldotagency@gmail.com" method="post" encType="text/plain">
            <label>
              <span>/YOUR NAME</span>
              <input type="text" name="name" placeholder="Enter your full name" required />
            </label>
            <label>
              <span>/YOUR E-MAIL</span>
              <input type="email" name="email" placeholder="Enter your e-mail" required />
            </label>
            <label>
              <span>/MORE ABOUT THE PROJECT</span>
              <textarea name="message" rows={3} placeholder="Leave us message" required />
            </label>
            <button type="submit">
              Submit Message <span>↗</span>
            </button>
          </form>
        </div>
      </section>

      <footer className="footer">
        <div className="page-width">
          <div className="footer-links">
            <a href="#top">About Us</a>
            <a href="#features">Service</a>
            <a href="#screenshots">Projects</a>
            <a href="https://github.com/Rifatul-Islam-Munna/landing-page-real-estate" target="_blank" rel="noreferrer">
              Github
            </a>
            <a href="#top">Portfolio</a>
          </div>
          <div className="footer-wordmark">
            BADAL<span>®</span>
          </div>
          <div className="footer-bottom">
            <a href="#top">Linkedin</a>
            <p>© 2026 - All rights reserved by Badal and team</p>
            <a href="#top">Back to Top</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
