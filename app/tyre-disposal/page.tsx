import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tyre disposal",
  description: "What to ask about old tyres when you book a fitting at tyrespeed Harare.",
  alternates: { canonical: "/tyre-disposal" },
};

const sections = [
  { id: "disposal-ask", title: "Ask when you book" },
  { id: "disposal-collection", title: "At collection" },
  { id: "disposal-contact", title: "Contact" },
];

export default function TyreDisposalPage() {
  return (
    <div className="wrap page privacy-page">
      <header className="document-head">
        <h1>Tyre disposal</h1>
        <p className="lede">
          A short note on old tyres when you book a fitting or balancing job.
        </p>
        <p className="document-updated">Last updated 21 November 2026.</p>
      </header>

      <div className="document-layout">
        <nav className="contents-rail" aria-label="On this page">
          <p className="field-label">On this page</p>
          {sections.map((section) => (
            <a href={`#${section.id}`} key={section.id}>{section.title}</a>
          ))}
        </nav>

        <div className="document-body">
          <section id="disposal-ask" className="document-section" aria-labelledby="disposal-ask-heading">
            <h2 id="disposal-ask-heading">Ask when you book</h2>
            <p>
              If you have old tyres to leave with us, say so in the booking notes or tell us when you arrive. We will
              confirm what we can accept and whether any charge applies before we start.
            </p>
          </section>

          <section id="disposal-collection" className="document-section" aria-labelledby="disposal-collection-heading">
            <h2 id="disposal-collection-heading">At collection</h2>
            <p>
              We will tell you at the counter where your old tyres have gone. We do not claim any disposal certificate
              or accreditation here. Ask to see the relevant document if you need one for your records.
            </p>
          </section>

          <section id="disposal-contact" className="document-section" aria-labelledby="disposal-contact-heading">
            <h2 id="disposal-contact-heading">Contact</h2>
            <p>
              Call {site.phoneDisplay} or visit {site.address}.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
