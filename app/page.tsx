import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AvailabilityRow } from "@/components/home/availability-row";
import { FeaturedTyres } from "@/components/home/featured-tyres";
import { FitmentBar } from "@/components/home/fitment-bar";
import { FaqList } from "@/components/faq/faq-list";
import { QuoteReviewButton } from "@/components/utilities/quote-review-button";
import { bookedSlots } from "@/lib/booked-slots";
import { generateSlots } from "@/lib/bookings";
import { usd } from "@/lib/format";
import { inventory, tyreBrands } from "@/lib/inventory";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

// Slot times for the next 14 days are generated on each request.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const categories = [
  {
    title: "Passenger cars",
    type: "Car",
    image: "/images/passenger-tyres.jpg",
    alt: "Passenger car tyre tread in close-up",
  },
  {
    title: "SUVs and 4x4",
    type: "SUV",
    image: "/images/suv-tyres.jpg",
    alt: "SUV wheel and tyre in close-up",
  },
  {
    title: "Bakkies",
    type: "Bakkie",
    image: "/images/performance-tyres.jpg",
    alt: "Tyre mounted on an alloy wheel",
  },
  {
    title: "Vans and commercial",
    type: "Van",
    image: "/images/commercial-tyres.jpg",
    alt: "Commercial tyres stacked in a garage",
  },
].map((category) => ({
  ...category,
  href: `/tyres?type=${encodeURIComponent(category.type)}`,
  count: inventory.filter((item) => item.vehicleType === category.type).length,
}));

export default async function HomePage() {
  const slots = generateSlots(14, new Date(), await bookedSlots());

  return (
    <div className="home">
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-image">
          <Image
            src="/images/hero-tyre-stack.jpg"
            alt="Stack of car tyres with an alloy wheel in a workshop"
            fill
            sizes="100vw"
            priority
          />
        </div>
        <div className="hero-scrim" aria-hidden="true" />
        <div className="wrap hero-inner">
          <h1 id="hero-heading" className="hero-title">
            <span>Tyres for</span>
            <span>Harare roads</span>
          </h1>
          <p className="hero-lede">
            Check indicative sizes, then book fitting, balancing and alignment at our Eastlea workshop.
          </p>
          <div className="hero-actions">
            <Link href="/tyres" className="btn btn-accent btn-lg">Find tyres</Link>
            <Link href="/services" className="btn btn-outline btn-lg">See services</Link>
          </div>
        </div>
      </section>

      <div className="wrap">
        <FitmentBar />
      </div>

      <section className="wrap section" aria-labelledby="categories-heading">
        <h2 id="categories-heading" className="section-title" data-reveal>Tyres by vehicle</h2>
        <div className="category-rail">
          {categories.map((category) => (
            <Link href={category.href} key={category.title} className="category-tile" data-reveal>
              <span className="category-media">
                <Image src={category.image} alt={category.alt} fill sizes="(max-width: 720px) 58vw, (max-width: 1020px) 25vw, 300px" />
              </span>
              <span className="category-meta">
                <span className="category-label">{category.title}</span>
                <span className="category-count" aria-label={`${category.count} indicative catalogue listings in this category`}>
                  {category.count} indicative {category.count === 1 ? "listing" : "listings"}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap section" aria-labelledby="featured-heading">
        <div className="section-head-row">
          <h2 id="featured-heading" className="section-title" data-reveal>Featured tyres</h2>
          <QuoteReviewButton />
        </div>
        <FeaturedTyres />
      </section>

      <section className="wrap section" aria-labelledby="workshop-heading">
        <div className="heading-inline">
          <h2 id="workshop-heading" className="section-title" data-reveal>Fitting, balancing, alignment</h2>
        </div>
        <div className="work-split" data-reveal>
          <div className="work-media">
            <Image
              src="/images/workshop-fitting.jpg"
              alt="Workshop technician fitting a tyre onto a vehicle wheel"
              fill
              sizes="(max-width: 900px) 100vw, 52vw"
            />
          </div>
          <div className="work-copy">
            <p>
              Our Eastlea workshop handles tyre work, balancing and alignment. Each job is measured before it is
              adjusted and the figures go on the job card.
            </p>
            <div className="service-cards">
              {services.slice(0, 4).map((service) => (
                <div key={service.slug} className="service-card">
                  <div className="service-card-top">
                    <h3 className="service-card-title">
                      <Link href={`/services/${service.slug}`}>{service.title}</Link>
                    </h3>
                    <div className="service-card-meta">
                      <span className="service-card-duration">{service.durationMin} min</span>
                      <span className="service-card-price">indicative from {usd(service.priceFrom)}</span>
                    </div>
                  </div>
                  <Link href={`/book?service=${service.slug}`} className="btn btn-accent">
                    Book this service
                  </Link>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "var(--sp-5)" }}>
              <Link href="/services" className="btn btn-outline">See all services</Link>
            </div>
          </div>
        </div>
        <div className="plain-rows arrival-rows">
          <div className="plain-row">
            <h3>On arrival</h3>
            <p>{site.arrival[0].detail}</p>
          </div>
          <div className="plain-row">
            <h3>Before we start</h3>
            <p>{site.arrival[1].detail}</p>
            <p>{site.arrival[2].detail}</p>
          </div>
          <div className="plain-row">
            <h3>At collection</h3>
            <p>{site.arrival[3].detail}</p>
          </div>
        </div>
      </section>

      <section className="wrap section" aria-labelledby="brands-heading">
        <h2 id="brands-heading" className="section-title" data-reveal>Brands we fit</h2>
        <div className="brand-list">
          {tyreBrands.map((brand) => (
            <Link key={brand} href={`/tyres?brand=${encodeURIComponent(brand)}`} className="chip chip-slot">
              {brand}
            </Link>
          ))}
        </div>
        <p className="small muted brand-list-note">
          Brands reflect our indicative catalogue. Confirm the exact pattern and availability with the workshop.
        </p>
      </section>

      <div className="wrap">
        <AvailabilityRow slots={slots} />
      </div>

      <section className="wrap section" aria-labelledby="faq-heading">
        <div className="heading-inline">
          <h2 id="faq-heading" className="section-title" data-reveal>Questions at the counter</h2>
          <Link href="/faq" className="text-link">All questions</Link>
        </div>
        <FaqList showControls={false} />
      </section>

      <section className="visit-band" aria-labelledby="visit-heading">
        <div className="wrap visit-band-inner">
          <div className="visit-copy" data-reveal>
            <h2 id="visit-heading">Eastlea, Harare</h2>
            <div className="visit-lines">
              <p className="visit-line"><span>Address</span><span>{site.address}</span></p>
              <p className="visit-line"><span>Hours</span><span>{site.hoursCompact}</span></p>
              <p className="visit-line"><span>Call</span><a href={site.phoneHref}>{site.phoneDisplay}</a></p>
              <p className="visit-line">
                <span>WhatsApp</span>
                <a href={site.whatsappHref} target="_blank" rel="noreferrer">{site.whatsappDisplay}</a>
              </p>
            </div>
            <div className="visit-actions">
              <Link href="/book" className="btn btn-accent btn-lg">Book a slot</Link>
              <a
                href={site.mapsHref}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-lg"
              >
                Get directions
              </a>
            </div>
          </div>
          <div className="visit-media">
            <Image
              src="/images/tyre-depot.jpg"
              alt="Rows of stacked tyres in a tyre depot"
              fill
              sizes="(max-width: 900px) 100vw, 45vw"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
