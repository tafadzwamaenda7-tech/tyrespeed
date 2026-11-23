import Link from "next/link";
import { site } from "@/lib/site";
import { services } from "@/lib/services";
import { SiteLogo } from "@/components/layout/site-logo";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand" data-reveal>
            <Link href="/" className="brand-link" aria-label="tyrespeed home">
              <SiteLogo />
            </Link>
            <p className="footer-position">
              Tyre fitting, balancing and wheel alignment in Eastlea, Harare.
            </p>
          </div>

          <div className="footer-col" data-reveal>
            <p className="footer-label">Workshop</p>
            <div className="footer-contact-lines">
              <span>{site.address}</span>
              <a href={site.mapsHref} target="_blank" rel="noreferrer">Get directions</a>
              <a href={site.phoneHref} data-track="call">{site.phoneDisplay}</a>
              <a href={`mailto:${site.email}`}>{site.email}</a>
              <a href={site.whatsappHref} target="_blank" rel="noreferrer" data-track="whatsapp">
                WhatsApp {site.whatsappDisplay}
              </a>
            </div>
            <p className="footer-hours">{site.hoursCompact}</p>
          </div>

          <nav className="footer-col" aria-label="Browse" data-reveal>
            <p className="footer-label">Browse</p>
            <div className="footer-list">
              <Link href="/tyres">Find tyres</Link>
              <Link href="/services">Services</Link>
              <Link href="/workshop">Workshop</Link>
              <Link href="/book">Book a slot</Link>
              <Link href="/faq">FAQ</Link>
            </div>
          </nav>

          <nav className="footer-col" aria-label="Services" data-reveal>
            <p className="footer-label">Services</p>
            <div className="footer-list">
              {services.slice(0, 4).map((service) => (
                <Link key={service.slug} href={`/services/${service.slug}`}>
                  {service.title}
                </Link>
              ))}
            </div>
          </nav>
        </div>

        <nav className="footer-legal" aria-label="Legal and policies">
          <span>&copy; {year} tyrespeed Harare.</span>
          <div className="footer-legal-links">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/refunds">Refunds</Link>
            <Link href="/tyre-disposal">Tyre disposal</Link>
          </div>
        </nav>
      </div>
    </footer>
  );
}
