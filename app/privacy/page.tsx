import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What tyrespeed does with the details you send in a quote or booking request.",
  alternates: { canonical: "/privacy" },
};

const sections = [
  { id: "privacy-collect", title: "What we collect" },
  { id: "privacy-use", title: "How we use it" },
  { id: "privacy-storage", title: "Where it is stored" },
  { id: "privacy-payment", title: "Payment" },
  { id: "privacy-contact", title: "Access and deletion" },
];

export default function PrivacyPage() {
  return (
    <div className="wrap page privacy-page">
      <header className="document-head">
        <h1>Privacy</h1>
        <p className="lede">
          What happens to the details you give us when you ask for a quote or book a workshop slot.
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
          <section id="privacy-collect" className="document-section" aria-labelledby="privacy-collect-heading">
            <h2 id="privacy-collect-heading">What we collect</h2>
            <p>
              For a quote request we collect your name, phone number, vehicle, any notes you write, your consent and the
              tyre or service lines you added. For a booking we also collect the vehicle registration and the slot you
              chose. We do not ask for more than we need to reply and manage the job.
            </p>
          </section>

          <section id="privacy-use" className="document-section" aria-labelledby="privacy-use-heading">
            <h2 id="privacy-use-heading">How we use it</h2>
            <p>
              We use these details to reply to your enquiry, confirm stock and fitment, manage the appointment and keep
              a record of the work. We do not sell the details or send marketing messages. Optional website measurement
              records only a page path, an event name, a timestamp and a random session id. It never records your name,
              phone number, registration or notes, and it sets no cookies.
            </p>
          </section>

          <section id="privacy-storage" className="document-section" aria-labelledby="privacy-storage-heading">
            <h2 id="privacy-storage-heading">Where it is stored</h2>
            <p>
              Requests are appended to records on the workshop web server. If a notification webhook is configured, a
              short non sensitive summary with your reference is sent to the workshop. Quote contents are also kept in
              your own browser until you send the quote or clear them.
            </p>
          </section>

          <section id="privacy-payment" className="document-section" aria-labelledby="privacy-payment-heading">
            <h2 id="privacy-payment-heading">Payment</h2>
            <p>
              tyrespeed does not take payment online and we do not collect card details on this website. Payment is made
              at the workshop when you collect the vehicle.
            </p>
          </section>

          <section id="privacy-contact" className="document-section" aria-labelledby="privacy-contact-heading">
            <h2 id="privacy-contact-heading">Access and deletion</h2>
            <p>
              To ask for a copy of your details or to have them removed, call {site.phoneDisplay}, message us on
              WhatsApp, or write to {site.email}. You can visit us at {site.address}.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
