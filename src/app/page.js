"use client";
import React, { use, useState } from "react";
import { MdImage } from "react-icons/md";

export default function PackageTracker() {
  const [resiNo, setResiNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError("");
    try {
      const response = await fetch(
        "https://www.appsheet.com/api/v2/apps/727769fd-a16e-4f42-b89b-fd33f6be501f/tables/Orders/Action",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ApplicationAccessKey:
              "V2-2QFx1-ZbYpS-JhsfX-Uxwvf-4tjLo-GM7ub-LE9v9-xIdmT",
          },
          body: JSON.stringify({
            Action: "Find",
            Rows: [{ "Resi No": resiNo.trim() }],
          }),
        }
      );
      if (!response.ok) throw new Error("Network error");
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setResult(data[0]);
      } else {
        setError("No package found for this Resi No.");
      }
    } catch (err) {
      setError("Failed to fetch package details.");
    }
    setLoading(false);
  };

  return (
    <div className="tracker-container">
      <div className="tracker-header">
        <img src="/images/logo.png" alt="Logo" className="tracker-logo" />
      </div>
      <h1 className="tracker-title">UT Package Tracker</h1>
      <form className="tracker-form" onSubmit={handleSubmit}>
        <input
          className="tracker-input"
          type="text"
          placeholder="Enter Resi No."
          value={resiNo}
          onChange={(e) => setResiNo(e.target.value)}
          required
        />
        <button className="tracker-button" type="submit" disabled={loading}>
          {loading ? "..." : "Track"}
        </button>
      </form>
      {error && <div className="tracker-error">{error}</div>}
      {result && (
        <div className="tracker-result">
          <div className="tracker-row">
            <span>Status:</span>
            <span className="tracker-status">{result.Status}</span>
          </div>
          <div className="tracker-row">
            <span>Sender:</span>
            <span>{result["Sender Name"]}</span>
          </div>
          <div className="tracker-row">
            <span>Recipient - Division:</span>
            <span>
              <strong>
                {result["Recipient Name"]} - {`[`}{result["Division"]}{`]`}
              </strong>
            </span>
          </div>
          <div className="tracker-row separator">
            <span>Details:</span>
            <span>{result.Details}</span>
          </div>
          <div className="tracker-row">
            <span>Receiving Date:</span>
            <span>{result["Receiving Date/Time"]}</span>
          </div>
          <div className="tracker-row">
            <span>Shipping Date:</span>
            <span>
              {result["Shipping Receiving Date/Time"]
                ? result["Shipping Date/Time"]
                : "-"}
            </span>
          </div>
          <div className="tracker-row separator">
            <span>Delivery Date:</span>
            <span>
              {result["Delivery Date/Time"]
                ? result["Delivery Date/Time"]
                : "-"}
            </span>
          </div>

          <div className="tracker-row">
            <span className="section">Mailer Information</span>
          </div>
          <div className="tracker-row">
            <span>Email:</span>
            <span>{result["Customer Email"]}</span>
          </div>
          <div className="tracker-row">
            <span>Phone:</span>
            <span>{result["Customer Phone"]}</span>
          </div>
          <div className="tracker-photos">
            {result["Receiving Photo"] &&
              result["Receiving Photo"].trim() !== "" && (
                <a
                  className="photo-button"
                  href={result["Receiving Photo"]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MdImage className="photo-icon" />
                  View Receiving Photo
                </a>
              )}
            {result["Delivery Photo"] &&
              result["Delivery Photo"].trim() !== "" && (
                <a
                  className="photo-button"
                  href={result["Delivery Photo"]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MdImage className="photo-icon" />
                  View Delivery Photo
                </a>
              )}
          </div>
        </div>
      )}
      <footer className="footer-copyright">
        © {new Date().getFullYear()} UT Package Tracker v1.1
      </footer>
    </div>
  );
}
// ...existing code...
