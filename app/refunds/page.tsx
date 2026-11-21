import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Refunds",
  description: "How payment and disputes work at tyrespeed Harare.",
  alternates: { canonical: "/refunds" },
};

const sections = [
  { id: "refunds-payment", title: "Payment" },
  { id: "refunds-approval", title: "Work is approved first" },
  { id: "refunds-disputes", title: "Disputes" },
  { id: "refunds-contact", title: "Contact" },
];

export default function RefundsPage() {
  return (
    <div className="wrap page privacy-page">
      <header className="document-head">
        <h1>Refunds</h1>
        <p className="lede">
          How payment and any disagreement about a job is handled at the workshop.
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
          <section id="refunds-payment" className="document-section" aria-labelledby="refunds-payment-heading">
            <h2 id="refunds-payment-heading">Payment</h2>
            <p>
              tyrespeed does not take payment online. Amounts shown on the website are indicative. You pay at the
              counter when you collect the vehicle, after the work and final price have been agreed.
            </p>
          </section>

          <section id="refunds-approval" className="document-section" aria-labelledby="refunds-approval-heading">
            <h2 id="refunds-approval-heading">Work is approved first</h2>
            <p>
              We explain the job, confirm stock and agree the price before work starts. If we find something that
              changes the scope, we tell you before continuing.
            </p>
          </section>

          <section id="refunds-disputes" className="document-section" aria-labelledby="refunds-disputes-heading">
            <h2 id="refunds-disputes-heading">Disputes</h2>
            <p>
              If something is not right, speak to us at the counter or call the workshop. We will look at the job card
              and the readings we recorded and agree the next step with you directly.
            </p>
          </section>

          <section id="refunds-contact" className="document-section" aria-labelledby="refunds-contact-heading">
            <h2 id="refunds-contact-heading">Contact</h2>
            <p>
              Call {site.phoneDisplay} or visit {site.address}.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
