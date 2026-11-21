"use client";

import { useState } from "react";

type Submission = Record<string, unknown>;

type ResponseBody = {
  ok?: boolean;
  error?: string;
  bookings?: Submission[];
  quotes?: Submission[];
  total?: number;
};

function text(value: unknown): string {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "object") {
    const slot = value as { date?: unknown; time?: unknown };
    if (slot.date && slot.time) return `${String(slot.date)} ${String(slot.time)}`;
  }
  return JSON.stringify(value);
}

function Row({ record, kind }: { record: Submission; kind: "booking" | "quote" }) {
  return (
    <tr>
      <td className="cell-title">{text(record.reference)}</td>
      <td>{text(record.createdAt)}</td>
      <td>{text(record.name)}</td>
      <td>{text(record.phone)}</td>
      <td>{kind === "booking" ? text(record.vehicle) : text(record.items && Array.isArray(record.items) ? `${record.items.length} lines` : "-")}</td>
      <td>{kind === "booking" ? text(record.slot) : text(record.vehicle)}</td>
      <td className="muted">{kind === "booking" ? text(record.service) : text(record.notes)}</td>
    </tr>
  );
}

export function AdminSubmissions() {
  const [token, setToken] = useState("");
  const [type, setType] = useState("all");
  const [data, setData] = useState<ResponseBody | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token.trim()) {
      setError("Enter the admin token.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/submissions?type=${encodeURIComponent(type)}`, {
        headers: { "x-admin-token": token.trim() },
        cache: "no-store",
      });
      const body = (await response.json()) as ResponseBody;
      if (!response.ok) {
        setData(null);
        setError(body.error ?? "Could not load submissions.");
        return;
      }
      setData(body);
    } catch {
      setData(null);
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }

  const bookings = data?.bookings ?? [];
  const quotes = data?.quotes ?? [];

  return (
    <div className="wrap page privacy-page admin-page">
      <header className="document-head">
        <h1>Submissions</h1>
        <p className="lede">Internal review of saved bookings and quote requests.</p>
      </header>

      <div className="document-layout">
        <nav className="contents-rail" aria-label="Admin controls">
          <p className="field-label">Admin</p>
          <span className="muted small">Token is held only in this field and sent with the request.</span>
        </nav>

        <div className="document-body">
          <form className="panel admin-form" onSubmit={load}>
            <div className="panel-body admin-form-body">
              <div className="field-group">
                <label className="field-label" htmlFor="admin-token">Admin token</label>
                <input
                  id="admin-token"
                  className="field"
                  type="password"
                  value={token}
                  onChange={(event) => setToken(event.target.value)}
                  autoComplete="off"
                />
              </div>
              <div className="field-group">
                <label className="field-label" htmlFor="admin-type">Show</label>
                <select
                  id="admin-type"
                  className="field"
                  value={type}
                  onChange={(event) => setType(event.target.value)}
                >
                  <option value="all">All submissions</option>
                  <option value="booking">Bookings</option>
                  <option value="quote">Quotes</option>
                </select>
              </div>
              <button type="submit" className="btn btn-accent" disabled={loading}>
                {loading ? "Loading" : "Load submissions"}
              </button>
            </div>
          </form>

          {error && <p className="form-error" role="alert">{error}</p>}

          {data && (
            <>
              <p className="admin-summary">
                {data.total ?? 0} {data.total === 1 ? "submission" : "submissions"}
              </p>

              {type !== "quote" && (
                <section className="section-block" aria-labelledby="admin-bookings-heading">
                  <h2 id="admin-bookings-heading" className="section-title">Bookings</h2>
                  {bookings.length === 0 ? (
                    <p className="modal-soft">No bookings in this range.</p>
                  ) : (
                    <div className="table-scroll">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th scope="col">Reference</th>
                            <th scope="col">Received</th>
                            <th scope="col">Name</th>
                            <th scope="col">Phone</th>
                            <th scope="col">Vehicle</th>
                            <th scope="col">Slot</th>
                            <th scope="col">Service</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.map((record, index) => (
                            <Row key={`${text(record.reference)}-${index}`} record={record} kind="booking" />
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              )}

              {type !== "booking" && (
                <section className="section-block" aria-labelledby="admin-quotes-heading">
                  <h2 id="admin-quotes-heading" className="section-title">Quotes</h2>
                  {quotes.length === 0 ? (
                    <p className="modal-soft">No quote requests in this range.</p>
                  ) : (
                    <div className="table-scroll">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th scope="col">Reference</th>
                            <th scope="col">Received</th>
                            <th scope="col">Name</th>
                            <th scope="col">Phone</th>
                            <th scope="col">Lines</th>
                            <th scope="col">Vehicle</th>
                            <th scope="col">Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {quotes.map((record, index) => (
                            <Row key={`${text(record.reference)}-${index}`} record={record} kind="quote" />
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
