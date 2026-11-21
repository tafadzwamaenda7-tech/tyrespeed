import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap not-found-page">
      <div className="not-found-card">
        <h1>Page not found</h1>
        <p>
          This address is not part of the workshop site. Use the links below to get back to the tools.
        </p>
        <div className="row not-found-actions">
          <Link href="/" className="btn btn-accent">Home</Link>
          <Link href="/tyres" className="btn btn-outline">Tyre inventory</Link>
          <Link href="/book" className="btn btn-outline">Book a slot</Link>
        </div>
      </div>
    </div>
  );
}
