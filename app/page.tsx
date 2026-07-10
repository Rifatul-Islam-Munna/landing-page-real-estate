const features = [
  ["◎", "Lead CRM", "Capture, organize, and manage every buyer, renter, seller, or investor from first contact to closing."],
  ["⌂", "Property Listings", "Manage property records, prices, types, status, assigned agents, and days open."],
  ["✉", "Email & SMS", "Send messages, schedule follow-ups, and keep communication history connected to each lead."],
  ["⇄", "Deal Pipeline", "Move qualified leads through offer, contract, inspection, financing, and closing stages."],
  ["◫", "Realtor Showings", "Schedule property showings, match properties, and automate follow-up messages."],
  ["▤", "Document Repository", "Store contracts, brochures, disclosures, reusable templates, and files that need signatures."],
  ["PDF", "PDF Builder", "Create professional PDF templates with text, images, tables, QR codes, and signature fields."],
  ["↗", "Reports & Analytics", "Track revenue, closed deals, conversion rate, average deal value, and agent performance."],
] as const;

const workflow = [
  ["Capture Leads", "Import from email, forms, listing platforms, or manual entry."],
  ["Assign Agents", "Send each lead to the right agent or team."],
  ["Follow Up Automatically", "Schedule email, SMS, call reminders, and next actions."],
  ["Match Properties", "Connect leads with the right listings and showings."],
  ["Move Deals Forward", "Track offers, contracts, inspections, financing, and closing."],
  ["Report Performance", "See revenue, conversion, agent activity, and deal progress."],
] as const;

const audiences = [
  ["⌂", "Real Estate", "Agencies", "art-one"],
  ["▥", "Property", "Managers", "art-two"],
  ["▦", "Apartment", "Communities", "art-three"],
  ["◎", "Broker", "Teams", "art-four"],
] as const;

function Eyebrow({ label, light = false }: { label: string; light?: boolean }) {
  return <div className={`eyebrow${light ? " eyebrow-light" : ""}`}><span>Saas</span>{label}</div>;
}

export default function Home() {
  return (
    <>
      <header className="hero" id="top">
        <nav className="nav container" aria-label="Primary navigation">
          <a className="brand" href="#top" aria-label="Badal CRM home">
            <img src="https://api.builder.io/api/v1/image/assets/TEMP/0231df5b1ac763107a40c10fc69f98b5192472af?placeholderIfAbsent=true" alt="Badal" />
            <span>Real estate <strong>CRM</strong></span>
          </a>
          <div className="desktop-nav">
            <div className="nav-links">
              <a href="#features">Features</a><a href="#workflow">Workflow</a><a href="#screenshots">Screenshots</a><a href="#automation">Automation</a>
            </div>
            <a className="contact-pill" href="#contact"><span className="contact-icon">↗</span><span>contact us</span></a>
          </div>
          <details className="mobile-nav">
            <summary aria-label="Open navigation"><span></span><span></span><span></span></summary>
            <div className="mobile-panel">
              <a href="#features">Features</a><a href="#workflow">Workflow</a><a href="#screenshots">Screenshots</a><a href="#automation">Automation</a><a href="#contact">Contact us</a>
            </div>
          </details>
        </nav>

        <div className="hero-copy container">
          <h1>Turn Real Estate Leads<br />Into <span>Closed Deals</span></h1>
          <p>Manage leads, listings, follow-ups, showings, documents, emails, SMS, agents, and deals from one simple workspace.</p>
          <div className="hero-actions"><a className="btn btn-primary" href="#contact">Book a Demo</a><a className="btn btn-ghost" href="#features">View Features</a></div>
        </div>

        <div className="hero-visual container">
          <div className="floating-stat stat-leads"><span className="stat-icon blue">⌁</span><div><small>Active Leads</small><strong>12</strong></div></div>
          <div className="dashboard-frame"><img src="https://api.builder.io/api/v1/image/assets/TEMP/7e626b670f7efaaef021195d76691b278031ba8e?placeholderIfAbsent=true" alt="Real estate CRM dashboard" /></div>
          <div className="floating-stat stat-pipeline"><span className="stat-icon green">↗</span><div><small>Pipeline Value</small><strong>$82k</strong></div></div>
          <div className="floating-stat stat-conversion"><span className="stat-icon coral">%</span><div><small>Conversion</small><strong>100%</strong></div></div>
        </div>
      </header>

      <main>
        <section className="section soft-section" id="features">
          <div className="container">
            <div className="section-heading"><Eyebrow label="Features" /><h2>Everything Your Real Estate Team Needs in <em>One Platform</em></h2></div>
            <div className="features-grid">
              {features.map(([icon, title, description]) => <article className="feature-card" key={title}><div className="feature-icon">{icon}</div><h3>{title}</h3><p>{description}</p></article>)}
              <article className="feature-card feature-more"><span className="plus">+</span><h3>Many more</h3></article>
            </div>
          </div>
        </section>

        <section className="section soft-section workflow-section" id="workflow">
          <div className="container">
            <div className="section-heading"><Eyebrow label="Workflow" /><h2>From First Lead to<br /><em>Closed Deal</em></h2></div>
            <div className="workflow"><div className="workflow-line" aria-hidden="true"></div>
              {workflow.map(([title, description], index) => {
                const side = index % 2 === 0 ? "left" : "right";
                const card = <div className="step-card"><h3>{title}</h3><p>{description}</p></div>;
                const number = <span className="step-number">{index + 1}</span>;
                return <article className={`workflow-step ${side}`} key={title}>{side === "left" ? <>{card}{number}</> : <>{number}{card}</>}</article>;
              })}
            </div>
          </div>
        </section>

        <section className="section soft-section" id="screenshots">
          <div className="container">
            <div className="section-heading wide"><Eyebrow label="Screenshots" /><h2>A Clear Workspace for Every Part of Your <em>Real Estate Business</em></h2></div>
            <div className="screenshot-shell"><img src="https://api.builder.io/api/v1/image/assets/TEMP/7e626b670f7efaaef021195d76691b278031ba8e?placeholderIfAbsent=true" alt="CRM application interface" /></div>
            <div className="slider-dots" aria-label="Screenshot pagination"><span className="active"></span><span></span><span></span><span></span></div>
          </div>
        </section>

        <section className="section soft-section automation-section" id="automation">
          <div className="container">
            <div className="section-heading wide"><Eyebrow label="Automation" /><h2><em>Automate</em> the Follow-up Work That Usually Gets Forgotten</h2></div>
            <div className="automation-map">
              <div className="automation-node center-node"><div className="node-orb">⚡</div><strong>Automation</strong></div>
              <div className="automation-node node-top">Scheduled lead follow-ups</div><div className="automation-node node-left-top">Email and SMS outreach</div><div className="automation-node node-left-bottom">Lead activity history</div><div className="automation-node node-right-top">Realtor showing reminders</div><div className="automation-node node-right-bottom">Reply-based automation stop</div><a className="automation-node node-bottom" href="#contact">request custom automation</a>
              <svg className="automation-lines" viewBox="0 0 1000 620" role="presentation" aria-hidden="true"><path d="M500 250V90M500 370V535M410 295H210M590 295H790M415 340L250 470M585 340L750 470" /></svg>
            </div>
          </div>
        </section>

        <section className="section audience-section" id="audience">
          <div className="container">
            <div className="section-heading"><Eyebrow label="Who It’s For" /><h2>Designed for <em>Modern</em><br />Real Estate Teams</h2></div>
            <div className="audience-grid">{audiences.map(([icon, accent, tail, art]) => <article className="audience-card" key={accent}><div className={`audience-art ${art}`}>{icon}</div><h3><em>{accent}</em><br />{tail}</h3></article>)}</div>
          </div>
        </section>

        <section className="cta-section"><div className="container cta-inner"><div><Eyebrow label="Get Started" light /><h2>Ready to Manage Leads, Listings, Agents, and Deals from One Place?</h2></div><a className="btn btn-white" href="#contact">Contact Sales <span>↗</span></a></div></section>

        <section className="contact-section" id="contact">
          <div className="container contact-grid">
            <div className="contact-info"><div className="eyebrow eyebrow-light"><span>•</span>CONTACT</div><a href="mailto:badaldotagency@gmail.com">badaldotagency@gmail.com</a><a href="tel:+8801907565617">+8801907565617</a><a href="https://www.badal.agency" target="_blank" rel="noreferrer">www.badal.agency</a><p>Real estate lead management software<br />built to close more deals.</p></div>
            <form className="contact-form" action="mailto:badaldotagency@gmail.com" method="post" encType="text/plain">
              <label><span>/YOUR NAME</span><input type="text" name="name" placeholder="Enter your full name" required /></label>
              <label><span>/YOUR E-MAIL</span><input type="email" name="email" placeholder="Enter your e-mail" required /></label>
              <label><span>/MORE ABOUT THE PROJECT</span><textarea name="message" rows={3} placeholder="Leave us message" required></textarea></label>
              <button type="submit">Submit Message</button>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer"><div className="container"><div className="footer-links"><a href="#top">About Us</a><a href="#features">Service</a><a href="#screenshots">Projects</a><a href="https://github.com/Rifatul-Islam-Munna/landing-page-real-estate" target="_blank" rel="noreferrer">Github</a><a href="#top">Portfolio</a></div><div className="footer-wordmark">BADAL<span>®</span></div><div className="footer-bottom"><span>Linkedin</span><p>© 2025 - All rights reserved by Badal and team</p><a href="#top">Back to Top</a></div></div></footer>
    </>
  );
}
