import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlignmentDiagram } from "@/components/schematics/alignment-diagram";
import { AddServiceButton } from "@/components/services/add-service-button";
import { getService, services } from "@/lib/services";

const serviceImages: Record<string, { src: string; alt: string }> = {
  "tyre-fitting": { src: "/images/workshop-fitting.jpg", alt: "Technician fitting a tyre onto a wheel" },
  "wheel-balancing": { src: "/images/alloy-wheel.jpg", alt: "Alloy wheel close-up" },
  "four-wheel-alignment": { src: "/images/alignment-bay.jpg", alt: "Wheel alignment work in the workshop bay" },
  "puncture-repair": { src: "/images/workshop-technician.jpg", alt: "Technician checking a vehicle wheel" },
  "tpms-check": { src: "/images/workshop-technician.jpg", alt: "Technician checking a vehicle wheel" },
  "brake-inspection": { src: "/images/workshop-technician.jpg", alt: "Vehicle raised on a workshop lift" },
  "suspension-check": { src: "/images/workshop-technician.jpg", alt: "Vehicle raised on a workshop lift" },
  "tyre-rotation": { src: "/images/tyre-depot.jpg", alt: "Rows of tyres in a tyre depot" },
  "pressure-tread-check": { src: "/images/passenger-tyres.jpg", alt: "Passenger tyre tread in close-up" },
  "alloy-wheel-refinish": { src: "/images/alloy-wheel.jpg", alt: "Alloy wheel close-up" },
};

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return { title: "Service not found" };
  return {
    title: service.title,
    description: service.summary,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const image = serviceImages[service.slug] ?? { src: "/images/workshop-fitting.jpg", alt: "Workshop fitting a tyre" };

  return (
    <article className="wrap page service-page">
      <nav className="tiny muted breadcrumb" aria-label="Breadcrumb">
        <Link href="/services">Services</Link> / <span>{service.title}</span>
      </nav>

      <header className="article-head">
        <h1>{service.title}</h1>
        <p className="lede">{service.summary}</p>
        <div className="article-actions">
          <AddServiceButton service={service} />
          <Link href={`/book?service=${service.slug}`} className="btn btn-accent btn-lg">Book this service</Link>
        </div>
        <div className="row chip-row">
          <span className="chip">{service.category}</span>
          <span className="chip data">{service.durationMin} min</span>
        </div>
      </header>

      <figure className="article-lead-image">
        <Image src={image.src} alt={image.alt} fill sizes="(max-width: 900px) 100vw, 1000px" priority />
      </figure>

      <div className="article-layout">
        <div className="article-body">
          <section aria-labelledby="fixes-heading">
            <h2 id="fixes-heading">What it fixes</h2>
            <p>{service.fixes}</p>
          </section>

          <section aria-labelledby="procedure-heading">
            <h2 id="procedure-heading">Procedure</h2>
            <ol className="detail-list">
              {service.procedure.map((step) => <li key={step}>{step}</li>)}
            </ol>
          </section>

          <section aria-labelledby="measurements-heading">
            <h2 id="measurements-heading">Measurements</h2>
            <div className="fact-rows">
              {service.measurements.map((measurement) => (
                <div className="fact-row" key={measurement.label}>
                  <span className="muted">{measurement.label}</span>
                  <span className="fact-value">{measurement.value}</span>
                </div>
              ))}
            </div>
          </section>

          <figure className="article-figure" aria-label="Alignment diagram">
            <AlignmentDiagram />
          </figure>
        </div>

        <aside className="article-rail" aria-label="Service facts">
          <section className="rail-block" aria-labelledby="service-facts-heading">
            <h2 id="service-facts-heading">At the workshop</h2>
            <div className="status-item"><span className="muted">Duration</span><span className="status-value">{service.durationMin} min</span></div>
            <div className="status-item"><span className="muted">Category</span><span className="status-value">{service.category}</span></div>
          </section>

          <section className="rail-block" aria-labelledby="checks-heading">
            <h2 id="checks-heading">What we check</h2>
            <ul className="plain-list">
              {service.checks.map((check) => <li key={check}>{check}</li>)}
            </ul>
          </section>

          <section className="rail-block" aria-labelledby="spec-faq-heading">
            <h2 id="spec-faq-heading">Questions asked at this job</h2>
            {service.faqs.map((faq) => (
              <div className="faq-row" key={faq.question}>
                <p className="faq-question faq-static">{faq.question}</p>
                <p className="faq-answer">{faq.answer}</p>
              </div>
            ))}
          </section>
        </aside>
      </div>
    </article>
  );
}
