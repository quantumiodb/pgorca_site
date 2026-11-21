import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "pg_orca — ORCA Query Optimizer for PostgreSQL 18 & 19";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "#336791",
          color: "white",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* grid bg */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.15,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            display: "flex",
          }}
        />

        {/* glow */}
        <div
          style={{
            position: "absolute",
            right: "-100px",
            top: "-100px",
            width: "500px",
            height: "500px",
            background:
              "transparent",
            display: "flex",
          }}
        />

        {/* logo + name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: "28px",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              background: "#ffffff",
              color: "#336791",
              fontSize: 22,
              fontWeight: 800,
            }}
          >
            pg
          </div>
          <div>pg_orca</div>
        </div>

        {/* spacer */}
        <div style={{ flex: 1, display: "flex" }} />

        {/* headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: "84px",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.02,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Plug ORCA into</span>
            <span
              style={{
                color: "#ffffff",
              }}
            >
              PostgreSQL 18.
            </span>
          </div>

          <div
            style={{
              fontSize: "28px",
              color: "#d9e8f2",
              lineHeight: 1.4,
              maxWidth: "900px",
              display: "flex",
            }}
          >
            Cost-based query optimizer from Greenplum / Apache Cloudberry.
            Up to 254× speedup on TPC-DS.
          </div>
        </div>

        {/* bottom bar */}
        <div
          style={{
            marginTop: "48px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255,255,255,0.3)",
            fontSize: "20px",
            color: "#b5d1e5",
            fontFamily: "monospace",
            zIndex: 1,
          }}
        >
          <div style={{ display: "flex" }}>github.com/quantumiodb/pgorca</div>
          <div style={{ display: "flex", gap: "20px" }}>
            <span>MIT license</span>
            <span>·</span>
            <span>agentml.ai</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
