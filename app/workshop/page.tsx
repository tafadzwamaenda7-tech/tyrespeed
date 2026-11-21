import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { hasProof, certifications, reviews, workshopEvidence } from "@/lib/proof";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Workshop",
  description:
    "Bays, equipment, address, hours and what happens when you arrive at tyrespeed in Eastlea, Harare.",
  alternates: { canonical: "/workshop" },
};

export default function WorkshopPage() {
  const showProof = hasProof();

  return (
    <>
      <div className="wrap page workshop-page">
        <header className="page-head page-head--workshop">
          <h1>Our workshop</h1>
          <div className="page-head-aside">
            <p className="lede">
              Our Eastlea workshop handles fitting, balancing, alignment and diagnostics. Here is what happens from the
              moment you drive in to the moment you collect the keys.
            </p>
            <div className="row" style={{ flexWrap: "wrap" }}>
              <a href={site.mapsHref} target="_blank" rel="noreferrer" className="btn btn-accent btn-lg">
                Get directions
              </a>
              <a
                href={site.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-lg"
                data-track="whatsapp"
              >
                WhatsApp the workshop
              </a>
            </div>
          </div>
        </header>
      </div>

      <div className="photo-band">
        <Image
          src="/images/workshop-technician.jpg"
          alt="Technician checking vehicle wheels on a workshop lift"
          fill
          sizes="100vw"
        />
      </div>

      <div className="wrap page">
        <div className="workshop-layout">
          <section className="arrival-story" aria-labelledby="arrival-heading">
            <h2 id="arrival-heading">What happens when you arrive</h2>
            <div className="plain-rows">
              {site.arrival.map((step) => (
                <div className="plain-row" key={step.title}>
                  <h3>{step.title}</h3>
                  <p>{step.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="workshop-aside">
            <section aria-labelledby="equipment-heading">
              <h2 id="equipment-heading">Equipment in the bays</h2>
              <ul className="plain-list">
                {site.equipment.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>

            <section aria-labelledby="hours-heading">
              <h2 id="hours-heading">Hours</h2>
              <div className="data-rows">
                {site.hours.map((entry) => (
                  <div className="status-item" key={entry.days}>
                    <span className="muted">{entry.days}</span>
                    <span className="data">{entry.time}</span>
                  </div>
                ))}
              </div>
            </section>

            <section aria-labelledby="find-heading">
              <h2 id="find-heading">Find us</h2>
              <p className="small">{site.address}</p>
              <p className="small muted detail-note">{site.location}</p>
              <a
                href={site.mapsHref}
                target="_blank"
                rel="noreferrer"
                className="workshop-contact-line text-link"
              >
                Get directions
              </a>
              <a href={site.phoneHref} className="workshop-contact-line data" data-track="call">
                {site.phoneDisplay}
              </a>
              <Link href="/book" className="workshop-contact-line text-link">
                Book a slot
              </Link>
            </section>
          </div>
        </div>

        {showProof && (
          <section className="workshop-proof section-block" aria-labelledby="proof-heading">
            <h2 id="proof-heading" className="section-title">Workshop record</h2>
            {reviews.length > 0 && (
              <div className="plain-rows">
                {reviews.map((review) => (
                  <div className="plain-row" key={review.id}>
                    <h3>{review.author}, {review.date}</h3>
                    <p>{review.text}</p>
                  </div>
                ))}
              </div>
            )}
            {certifications.length > 0 && (
              <div className="plain-rows">
                {certifications.map((certification) => (
                  <div className="plain-row" key={certification.id}>
                    <h3>{certification.title}</h3>
                    <p className="muted">{certification.issuer}, {certification.issued}</p>
                    {certification.detail && <p>{certification.detail}</p>}
                  </div>
                ))}
              </div>
            )}
            {workshopEvidence.length > 0 && (
              <div className="plain-rows">
                {workshopEvidence.map((item) => (
                  <div className="plain-row" key={item.id}>
                    <h3>{item.title}</h3>
                    <p>{item.detail}</p>
                    {item.image && item.imageAlt && (
                      <Image className="proof-image" src={item.image} alt={item.imageAlt} width={480} height={320} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </>
  );
}
