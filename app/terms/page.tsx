import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms",
  description: "Plain terms for quote requests and workshop bookings at tyrespeed Harare.",
  alternates: { canonical: "/terms" },
};

const sections = [
  { id: "terms-quotes", title: "Quote requests" },
  { id: "terms-bookings", title: "Bookings" },
  { id: "terms-prices", title: "Prices and stock" },
  { id: "terms-work", title: "Work at the workshop" },
  { id: "terms-changes", title: "Changes and cancellation" },
];

export default function TermsPage() {
  return (
    <div className="wrap page privacy-page">
      <header className="document-head">
        <h1>Terms</h1>
        <p className="lede">
          The simple terms that apply when you ask for a quote or book a slot at tyrespeed.
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
          <section id="terms-quotes" className="document-section" aria-labelledby="terms-quotes-heading">
            <h2 id="terms-quotes-heading">Quote requests</h2>
            <p>
              A quote request is an enquiry, not a reservation of parts or a fixed offer. We use the details you send to
              check what is available and reply with a confirmed total.
            </p>
          </section>

          <section id="terms-bookings" className="document-section" aria-labelledby="terms-bookings-heading">
            <h2 id="terms-bookings-heading">Bookings</h2>
            <p>
              A saved booking holds a workshop slot. Please arrive at {site.address} at the agreed time. If you are
              running late, call {site.phoneDisplay} so we can rearrange the bay.
            </p>
          </section>

          <section id="terms-prices" className="document-section" aria-labelledby="terms-prices-heading">
            <h2 id="terms-prices-heading">Prices and stock</h2>
            <p>
              Prices shown in the catalogue and service list are indicative. The workshop confirms stock, fitment and
              the final price before any work starts. Nothing is charged online.
            </p>
          </section>

          <section id="terms-work" className="document-section" aria-labelledby="terms-work-heading">
            <h2 id="terms-work-heading">Work at the workshop</h2>
            <p>
              We explain the work and record the relevant readings before we begin. We will not fit a part we have not
              checked, and we will tell you if we find a problem that changes the scope.
            </p>
          </section>

          <section id="terms-changes" className="document-section" aria-labelledby="terms-changes-heading">
            <h2 id="terms-changes-heading">Changes and cancellation</h2>
            <p>
              To change or cancel a booking, call {site.phoneDisplay} or send a message on WhatsApp. There is no online
              cancellation form, and no online payment to reverse.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
