"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "2rem",
          textAlign: "center",
          background: "#faf7f0",
          color: "#33361e",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>
          Something went wrong
        </h1>
        <p style={{ color: "#787c66", maxWidth: "24rem", margin: 0 }}>
          The app hit an unexpected error. Please reload.
        </p>
        <button
          onClick={() => reset()}
          style={{
            padding: "0.6rem 1.25rem",
            borderRadius: "0.85rem",
            border: "none",
            background: "#5c5f1e",
            color: "#faf7f0",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
