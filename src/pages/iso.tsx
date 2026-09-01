import { useEffect, useState } from "react";

type CardKind = "sticky" | "email" | "chat";

type CardSpec = {
  id: string;
  kind: CardKind;
  header: string;
  text: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rotate: number;
  target: { x: number; y: number };
};

const COMP_W = 760;
const COMP_H = 620;

const DOC = { x: 230, y: 80, w: 300, h: 460 };

// Y-coordinates of key rows inside the document (used for connector targets).
const ROW_REV03_Y = 280;
const ROW_REV04_Y = 335;
const FOOTER_Y = 510;

const CARDS: CardSpec[] = [
  {
    id: "slack",
    kind: "sticky",
    header: "SLACK · 3/15",
    text: "QA channel: ‘tolerance changed to ±0.05.’ Never logged.",
    x: 10,
    y: 30,
    w: 190,
    h: 110,
    rotate: -3,
    target: { x: 350, y: ROW_REV03_Y },
  },
  {
    id: "kl-email",
    kind: "email",
    header: "EMAIL · 2/28",
    text: "K. Lee: ‘we need step 4 by Friday.’ Never entered as a formal change request.",
    x: 10,
    y: 250,
    w: 210,
    h: 140,
    rotate: 4,
    target: { x: 350, y: ROW_REV04_Y },
  },
  {
    id: "karen-chat",
    kind: "chat",
    header: "MEETING · 2/26",
    text: "Karen verbal approval. Friday QA meeting. No email.",
    x: 550,
    y: 30,
    w: 200,
    h: 100,
    rotate: 3,
    target: { x: 440, y: FOOTER_Y },
  },
  {
    id: "patel-sticky",
    kind: "sticky",
    header: "DM · 3/22",
    text: "G. Patel: ‘actually current practice is Rev 05.’ Never filed.",
    x: 555,
    y: 220,
    w: 200,
    h: 130,
    rotate: -6,
    target: { x: 330, y: FOOTER_Y },
  },
  {
    id: "phone-chat",
    kind: "chat",
    header: "CALL · 3/18",
    text: "Phone call with supplier about step 4. No record.",
    x: 555,
    y: 440,
    w: 200,
    h: 100,
    rotate: -2,
    target: { x: 460, y: ROW_REV04_Y },
  },
  {
    id: "qa-email",
    kind: "email",
    header: "EMAIL · 3/2",
    text: "QA team: ‘still pending review.’ Six replies, no resolution.",
    x: 10,
    y: 480,
    w: 210,
    h: 130,
    rotate: 5,
    target: { x: 500, y: ROW_REV04_Y },
  },
];

function bezierPath(sx: number, sy: number, ex: number, ey: number) {
  const dx = ex - sx;
  const dy = ey - sy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const sag = Math.min(90, dist * 0.22);
  const cx = (sx + ex) / 2;
  const cy = Math.min(sy, ey) - sag;
  return `M ${sx} ${sy} Q ${cx} ${cy} ${ex} ${ey}`;
}

function CardEl({
  spec,
  visible,
  delay,
}: {
  spec: CardSpec;
  visible: boolean;
  delay: number;
}) {
  let bg = "#ffffff";
  let headerColor = "#666666";
  let border = "none";
  let radius = 2;
  let shadow = "0 8px 24px rgba(0,0,0,0.4)";

  if (spec.kind === "sticky") {
    bg = "#f4dc7a";
    headerColor = "#7a5d00";
    radius = 0;
    shadow =
      "0 6px 18px rgba(122, 93, 0, 0.25), 0 2px 8px rgba(0,0,0,0.25)";
  } else if (spec.kind === "email") {
    bg = "#ffffff";
    border = "1px solid #c2c2c2";
    headerColor = "#666666";
    radius = 2;
    shadow = "0 8px 24px rgba(0,0,0,0.45)";
  } else {
    bg = "#d8e8ff";
    headerColor = "#3d527e";
    radius = 14;
    shadow = "0 6px 18px rgba(61, 82, 126, 0.25), 0 2px 8px rgba(0,0,0,0.3)";
  }

  const baseTransform = `rotate(${spec.rotate}deg)`;
  const visibleTransform = `${baseTransform} scale(1) translateY(0)`;
  const hiddenTransform = `${baseTransform} scale(0.94) translateY(10px)`;

  return (
    <div
      style={{
        position: "absolute",
        left: spec.x,
        top: spec.y,
        width: spec.w,
        background: bg,
        border,
        borderRadius: radius,
        padding: "12px 16px",
        transform: visible ? visibleTransform : hiddenTransform,
        opacity: visible ? 1 : 0,
        transition: `transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s, opacity 0.4s ease-out ${delay}s`,
        boxShadow: shadow,
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system, Inter, sans-serif",
        zIndex: 20,
        willChange: "transform, opacity",
      }}
    >
      <div
        style={{
          color: headerColor,
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: 0.6,
          marginBottom: 6,
        }}
      >
        {spec.header}
      </div>
      <div
        style={{
          color: "#1a1a1a",
          fontSize: 13,
          lineHeight: 1.4,
        }}
      >
        {spec.text}
      </div>
    </div>
  );
}

function DocumentEl({ visible }: { visible: boolean }) {
  const rows = [
    { rev: "Rev 01", date: "2023-01-15", desc: "Initial", author: "J. Cho" },
    {
      rev: "Rev 02",
      date: "2023-08-22",
      desc: "Cleanup edits",
      author: "J. Cho",
    },
    {
      rev: "Rev 03",
      date: "2023-11-10",
      desc: "Tolerance update",
      author: "K. Lee",
    },
    {
      rev: "Rev 04",
      date: "2024-03-01",
      desc: "Step 4 added",
      author: "K. Lee",
    },
  ];

  return (
    <div
      style={{
        position: "absolute",
        left: DOC.x,
        top: DOC.y,
        width: DOC.w,
        height: DOC.h,
        background: "#f4eed8",
        border: "2px solid #1a1a22",
        padding: "24px 26px",
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.97)",
        transition:
          "opacity 0.6s ease-out, transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)",
        boxShadow: "0 18px 50px rgba(0,0,0,0.55)",
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system, Inter, sans-serif",
        color: "#1a1a1a",
        zIndex: 5,
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.4 }}>
        DOCUMENT NUMBER: SOP-2024-072
      </div>
      <div style={{ fontSize: 11, color: "#3a3a3a", marginTop: 4 }}>
        Valve Assembly Inspection · Effective 2024-03-01
      </div>
      <div
        style={{ borderTop: "1px solid #cdc7af", margin: "14px 0 18px" }}
      />
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 0.5,
          marginBottom: 12,
          color: "#3a3a3a",
        }}
      >
        REVISION HISTORY
      </div>
      <div
        style={{
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
          fontSize: 10.5,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "48px 80px 1fr 56px",
            gap: 6,
            color: "#666",
            fontWeight: 600,
            paddingBottom: 6,
            borderBottom: "2px solid #1a1a22",
          }}
        >
          <div>REV</div>
          <div>DATE</div>
          <div>DESCRIPTION</div>
          <div>AUTHOR</div>
        </div>
        {rows.map((r) => (
          <div
            key={r.rev}
            style={{
              display: "grid",
              gridTemplateColumns: "48px 80px 1fr 56px",
              gap: 6,
              padding: "7px 0",
              borderBottom: "1px solid #cdc7af",
              color: "#1a1a1a",
            }}
          >
            <div>{r.rev}</div>
            <div>{r.date}</div>
            <div>{r.desc}</div>
            <div>{r.author}</div>
          </div>
        ))}
      </div>
      <div
        style={{ borderTop: "1px solid #cdc7af", margin: "20px 0 12px" }}
      />
      <div style={{ fontSize: 11, fontWeight: 700 }}>
        CURRENT REVISION: 04 · APPROVED BY: K. Lee · 3/1/24
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 14,
          left: 26,
          right: 26,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 9,
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
          color: "#7a7058",
          letterSpacing: 0.5,
        }}
      >
        <span>Page 1 of 1</span>
        <span>CONFIDENTIAL · QMS-CONTROLLED</span>
      </div>
    </div>
  );
}

export default function Iso() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#08090d]">
      {/* Subtle background grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative grid min-h-screen grid-cols-1 items-center lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-8">
        {/* Headline */}
        <div className="px-8 pt-20 pb-8 lg:px-16 lg:py-24">
          <div className="max-w-[560px]">
            <h1 className="font-serif text-5xl font-semibold leading-[1.05] text-[#f4eed8] md:text-6xl">
              Records belong in systems. Work doesn&apos;t.
            </h1>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-[#f4eed8] opacity-60 md:text-xs">
              Concept 3 · the gap between systems of record and systems of coordination
            </p>
          </div>
        </div>

        {/* Composition */}
        <div className="flex justify-center px-4 pb-16 lg:justify-end lg:px-12 lg:py-12">
          <div
            className="relative"
            style={{
              width: COMP_W,
              height: COMP_H,
              maxWidth: "100%",
            }}
          >
            {/* Connector layer */}
            <svg
              className="pointer-events-none absolute inset-0"
              width={COMP_W}
              height={COMP_H}
              viewBox={`0 0 ${COMP_W} ${COMP_H}`}
              preserveAspectRatio="xMidYMid meet"
              style={{ zIndex: 10, overflow: "visible" }}
            >
              {CARDS.map((card, i) => {
                const sx = card.x + card.w / 2;
                const sy = card.y + card.h / 2;
                const path = bezierPath(sx, sy, card.target.x, card.target.y);
                const delay = 0.45 + i * 0.15;
                const dashLen = 900;
                const drawn = phase >= 2;
                return (
                  <g key={card.id}>
                    <path
                      d={path}
                      fill="none"
                      stroke="#9a9a9a"
                      strokeWidth={1}
                      strokeLinecap="round"
                      opacity={drawn ? 0.5 : 0}
                      style={{
                        strokeDasharray: dashLen,
                        strokeDashoffset: drawn ? 0 : dashLen,
                        transition: `opacity 0.3s ease-out ${delay}s, stroke-dashoffset 0.8s ease-out ${delay}s`,
                      }}
                    />
                    <circle
                      cx={card.target.x}
                      cy={card.target.y}
                      r={3}
                      fill="#9a9a9a"
                      opacity={drawn ? 0.75 : 0}
                      style={{
                        transition: `opacity 0.4s ease-out ${delay + 0.4}s`,
                      }}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Document */}
            <DocumentEl visible={phase >= 1} />

            {/* Cards */}
            {CARDS.map((card, i) => (
              <CardEl
                key={card.id}
                spec={card}
                visible={phase >= 2}
                delay={0.45 + i * 0.15}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
