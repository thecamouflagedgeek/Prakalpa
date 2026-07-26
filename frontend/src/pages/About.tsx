import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const C = {
  teal: "#0E8C8C",
  tealDark: "#0A6E6E",
  navy: "#152A43",
  navySoft: "#2C4260",
  bgSection: "#EAF2F5",
  bgPage: "#F4F8F9",
  white: "#FFFFFF",
  text: "#5B6B7A",
  border: "#E3E9EC",
  iconBlue: "#E3F0FB",
  iconBlueFg: "#2E7FCE",
  iconGreen: "#E5F6EC",
  iconGreenFg: "#25A465",
  iconPurple: "#EFEAFB",
  iconPurpleFg: "#7C5CD9",
  iconOrange: "#FDEEE3",
  iconOrangeFg: "#E07B32",
};

const F = {
  head: "'Poppins', 'Segoe UI', sans-serif",
  body: "'Inter', 'Segoe UI', sans-serif",
};

/* ---------------- icons ---------------- */

const IGlobe = (p: { color?: string; size?: number }) => (
  <svg
    width={p.size ?? 14}
    height={p.size ?? 14}
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle cx="12" cy="12" r="10" stroke={p.color ?? C.teal} strokeWidth="2" />

    <line
      x1="2"
      y1="12"
      x2="22"
      y2="12"
      stroke={p.color ?? C.teal}
      strokeWidth="2"
    />

    <path
      d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      stroke={p.color ?? C.teal}
      strokeWidth="2"
    />
  </svg>
);

const IShield = (p: { color?: string; size?: number }) => (
  <svg
    width={p.size ?? 18}
    height={p.size ?? 18}
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M12 3l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6l7-3z"
      stroke={p.color ?? C.white}
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
);

const IArrowRight = (p: { color?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12h14M13 6l6 6-6 6"
      stroke={p.color ?? C.white}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IChat = (p: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M4 5h16v11H8l-4 4V5z"
      stroke={p.color ?? C.navy}
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
);

const ISection = (p: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M6 3h9l4 4v14H6V3z"
      stroke={p.color ?? C.navy}
      strokeWidth="1.7"
      strokeLinejoin="round"
    />

    <path
      d="M9 12h6M9 16h6"
      stroke={p.color ?? C.navy}
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

const ILock = (p: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect
      x="5"
      y="11"
      width="14"
      height="9"
      rx="2"
      stroke={p.color ?? C.navy}
      strokeWidth="1.7"
    />

    <path
      d="M8 11V8a4 4 0 018 0v3"
      stroke={p.color ?? C.navy}
      strokeWidth="1.7"
    />
  </svg>
);

const IChart = (p: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M4 20V10M11 20V4M18 20v-7"
      stroke={p.color ?? C.navy}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const IStatGlobeSmall = (p: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle
      cx="12"
      cy="12"
      r="8.5"
      stroke={p.color ?? C.iconGreenFg}
      strokeWidth="1.7"
    />

    <path
      d="M3.5 12h17M12 3.5c2.5 2.4 3.8 5.4 3.8 8.5S14.5 18.1 12 20.5C9.5 18.1 8.2 15.1 8.2 12S9.5 5.9 12 3.5z"
      stroke={p.color ?? C.iconGreenFg}
      strokeWidth="1.5"
    />
  </svg>
);

/* ---------------- avatar ---------------- */

function Avatar({
  initials,
  bg,
  fg,
  size = 44,
}: {
  initials: string;
  bg: string;
  fg: string;
  size?: number;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        color: fg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: F.head,
        fontWeight: 600,
        fontSize: size * 0.36,
        border: `2px solid ${C.white}`,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

/* ---------------- bento grid person card ---------------- */

function PersonCard({
  initials,
  bg,
  fg,
  name,
  role,
  tall,
  fill,
}: {
  initials: string;
  bg: string;
  fg: string;
  name: string;
  role: string;
  tall?: boolean;
  fill?: boolean;
}) {
  return (
    <div
      style={{
        position: "relative",
        background: `linear-gradient(160deg, ${bg} 0%, ${C.bgSection} 100%)`,
        borderRadius: 14,
        minHeight: tall ? 220 : 140,
        height: fill ? "100%" : undefined,
        display: "flex",
        alignItems: "flex-end",
        padding: 14,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
        }}
      >
        <Avatar initials={initials} bg={C.white} fg={fg} size={40} />
      </div>

      <div
        style={{
          background: C.white,
          borderRadius: 10,
          padding: "8px 12px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          boxShadow: "0 6px 16px rgba(21,42,67,0.10)",
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: C.teal,
            flexShrink: 0,
          }}
        />

        <div>
          <div
            style={{
              fontFamily: F.head,
              fontSize: 12.5,
              fontWeight: 600,
              color: C.navy,
              lineHeight: 1.2,
            }}
          >
            {name}
          </div>

          <div
            style={{
              fontFamily: F.body,
              fontSize: 11,
              color: C.text,
            }}
          >
            {role}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- bento grid text card ---------------- */

function TextCard({
  bg,
  fg,
  eyebrow,
  title,
  desc,
  dark,
}: {
  bg: string;
  fg: string;
  eyebrow?: string;
  title: string;
  desc: string;
  dark?: boolean;
}) {
  return (
    <div
      style={{
        background: dark
          ? `linear-gradient(160deg, ${C.navy}, ${C.navySoft})`
          : bg,
        borderRadius: 14,
        padding: "20px 20px 22px",
        minHeight: 140,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {eyebrow && (
        <div
          style={{
            fontFamily: F.body,
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: dark ? C.teal : fg,
            marginBottom: 6,
          }}
        >
          {eyebrow}
        </div>
      )}

      <h4
        style={{
          fontFamily: F.head,
          fontSize: 15.5,
          fontWeight: 600,
          color: dark ? C.white : C.navy,
          margin: "0 0 8px 0",
          lineHeight: 1.3,
        }}
      >
        {title}
      </h4>

      <p
        style={{
          fontFamily: F.body,
          fontSize: 12,
          lineHeight: 1.6,
          color: dark ? "#B9C4D2" : C.text,
          margin: 0,
        }}
      >
        {desc}
      </p>
    </div>
  );
}

/* ---------------- build story step ---------------- */

function BuildStep({
  index,
  icon,
  title,
  desc,
  delay,
}: {
  index: number;
  icon: React.ReactNode;
  title: string;
  desc: string;
  delay: number;
}) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="kv-fade-up"
      style={{
        animationDelay: `${delay}s`,
        flex: "1 1 200px",
        minWidth: 200,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        style={{
          background: C.white,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: "24px 20px",
          height: "100%",
          boxShadow: hover
            ? "0 18px 34px rgba(21,42,67,0.10)"
            : "0 2px 10px rgba(21,42,67,0.04)",
          transform: hover ? "translateY(-5px)" : "translateY(0)",
          transition: "all 0.25s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 14,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: C.bgSection,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {icon}
          </div>

          <span
            style={{
              fontFamily: F.head,
              fontSize: 12,
              fontWeight: 700,
              color: C.teal,
              letterSpacing: "0.05em",
            }}
          >
            {String(index).padStart(2, "0")}
          </span>
        </div>

        <h4
          style={{
            fontFamily: F.head,
            fontSize: 15,
            fontWeight: 600,
            color: C.navy,
            margin: "0 0 8px 0",
          }}
        >
          {title}
        </h4>

        <p
          style={{
            fontFamily: F.body,
            fontSize: 12.5,
            lineHeight: 1.6,
            color: C.text,
            margin: 0,
          }}
        >
          {desc}
        </p>
      </div>
    </div>
  );
}

/* ==================================================================== */

export default function About() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLanguage = () => {
    const nextLang = i18n.language?.startsWith("kn") ? "en" : "kn";
    i18n.changeLanguage(nextLang);
  };

  const navItems = [
    { key: "home", label: "Home", path: "/" },
    { key: "about", label: "About", path: "/about" },
    { key: "districts", label: "Districts", path: "/dis" },
  ];

  const partners = [
    "Karnataka Police",
    "CID Karnataka",
    "Cyber Crime Cell",
    "Home Department",
    "NIC Karnataka",
    "Digital India",
  ];

  return (
    <div style={{ background: C.white, width: "100%", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
        }

        a:focus-visible,
        button:focus-visible {
          outline: 2px solid ${C.teal};
          outline-offset: 2px;
        }

        @keyframes kvFadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes kvShimmer {
          0% {
            background-position: 0% 50%;
          }

          100% {
            background-position: 200% 50%;
          }
        }

        .kv-fade-up {
          opacity: 0;
          animation: kvFadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .kv-shimmer-text {
          background: linear-gradient(
            90deg,
            ${C.teal} 0%,
            ${C.navySoft} 25%,
            ${C.teal} 50%
          );

          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: kvShimmer 4s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .kv-fade-up {
            animation: none;
            opacity: 1;
          }

          .kv-shimmer-text {
            animation: none;
            -webkit-background-clip: initial;
            background-clip: initial;
            color: ${C.teal};
          }
        }

        @media (max-width: 960px) {
          .ab-nav {
            display: none !important;
          }

          .ab-hero {
            grid-template-columns: 1fr !important;
          }

          .ab-hero-copy {
            padding: 48px 24px 0 24px !important;
          }

          .ab-hero-copy h1 {
            font-size: 30px !important;
          }

          .ab-grid {
            padding: 24px !important;
            grid-template-columns: 1fr 1fr !important;
          }

          .ab-partners {
            justify-content: flex-start !important;
          }
        }
      `}</style>

      {/* ---------------- HEADER ---------------- */}

      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: C.white,
          boxShadow: scrolled ? "0 2px 14px rgba(21,42,67,0.06)" : "none",
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: "16px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: `linear-gradient(150deg, ${C.teal}, ${C.navy})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IShield size={18} />
            </div>

            <span
              style={{
                fontFamily: F.head,
                fontSize: 19,
                fontWeight: 700,
                color: C.navy,
                letterSpacing: "0.01em",
              }}
            >
              KAVACH
            </span>
          </div>

          <nav
            className="ab-nav"
            style={{
              display: "flex",
              gap: 32,
            }}
          >
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.path}
                style={{
                  fontFamily: F.body,
                  fontSize: 13.5,
                  color: item.key === "about" ? C.teal : C.navySoft,
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            {/* Language Switcher Button */}

            <button
              onClick={toggleLanguage}
              style={{
                background: "transparent",
                color: C.teal,
                border: `1px solid ${C.teal}`,
                borderRadius: 24,
                padding: "8px 16px",
                fontFamily: F.body,
                fontSize: 12.5,
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <IGlobe color={C.teal} size={14} />
              {i18n.language?.startsWith("kn") ? "English" : "ಕನ್ನಡ"}
            </button>

            <button
              onClick={() => navigate("/login")}
              style={{
                background: C.teal,
                color: C.white,
                border: "none",
                borderRadius: 24,
                padding: "10px 22px",
                fontFamily: F.body,
                fontSize: 13.5,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Get in touch
            </button>
          </div>
        </div>
      </header>

      {/* ---------------- HERO ---------------- */}

      <section
        className="ab-hero"
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "0 28px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 40,
          alignItems: "center",
        }}
      >
        {/* LEFT: copy */}

        <div
          className="ab-hero-copy"
          style={{
            padding: "88px 0 88px 0",
          }}
        >
          <h1
            style={{
              fontFamily: F.head,
              fontSize: 42,
              fontWeight: 700,
              lineHeight: 1.18,
              margin: 0,
              color: C.navy,
            }}
          >
            Meet the force
            <br />
            behind <span style={{ color: C.teal }}>Kavach.</span>
          </h1>

          <p
            style={{
              fontFamily: F.body,
              fontSize: 15,
              lineHeight: 1.7,
              color: C.text,
              margin: "20px 0 30px 0",
              maxWidth: 440,
            }}
          >
            A dedicated team of officers, analysts, and engineers working
            together to digitize Karnataka Police operations — making cases
            faster to resolve, records easier to trust, and every district
            better connected.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <button
              style={{
                background: C.teal,
                color: C.white,
                border: "none",
                borderRadius: 24,
                padding: "13px 22px",
                fontFamily: F.body,
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
              }}
            >
              Book a briefing <IArrowRight />
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex" }}>
                <Avatar
                  initials="HS"
                  bg={C.iconBlue}
                  fg={C.iconBlueFg}
                  size={34}
                />

                <div style={{ marginLeft: -10 }}>
                  <Avatar
                    initials="FQ"
                    bg={C.iconGreen}
                    fg={C.iconGreenFg}
                    size={34}
                  />
                </div>

                <div style={{ marginLeft: -10 }}>
                  <Avatar
                    initials="AP"
                    bg={C.iconPurple}
                    fg={C.iconPurpleFg}
                    size={34}
                  />
                </div>
              </div>

              <span
                style={{
                  marginLeft: 12,
                  fontFamily: F.body,
                  fontSize: 13,
                  fontWeight: 600,
                  color: C.navy,
                }}
              >
                +31 districts
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: bento grid */}

        <div
          className="ab-grid"
          style={{
            padding: "40px 0",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <PersonCard
              initials="HS"
              bg={C.iconBlue}
              fg={C.iconBlueFg}
              name="Hazel Sequeira"
              role="Backend and ML Developer"
              tall
            />

            <TextCard
              bg={C.iconPurple}
              fg={C.iconPurpleFg}
              eyebrow="APPROACH"
              title="Digital-first policing"
              desc="Every FIR, case, and record moves online — searchable, auditable, secure."
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <TextCard
              bg={C.iconGreen}
              fg={C.iconGreenFg}
              eyebrow="RESPONSE TIME"
              title="Rapid and adaptable"
              desc="Cases are triaged and assigned within hours, not days, across all 31 districts."
            />

            <PersonCard
              initials="FQ"
              bg={C.iconGreen}
              fg={C.iconGreenFg}
              name="Freia Quadros."
              role="Backend Developer"
              tall
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <PersonCard
              initials="AP"
              bg={C.iconPurple}
              fg={C.iconPurpleFg}
              name="Aahana Peter"
              role="Frontend Developer"
            />

            <TextCard
              bg={C.iconOrange}
              fg={C.iconOrangeFg}
              dark
              title="Zero compromise on privacy"
              desc="End-to-end encryption and strict access control on every citizen record."
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <PersonCard
              initials="YM"
              bg={C.iconBlue}
              fg={C.iconBlueFg}
              name="Yash Masaye"
              role="Frontend Developer and Platform Architect"
              fill
            />
          </div>
        </div>
      </section>

      {/* ---------------- HOW WE BUILT THIS ---------------- */}

      <section
        style={{
          background: C.bgSection,
          padding: "70px 28px 64px",
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
          }}
        >
          <div
            className="kv-fade-up"
            style={{
              marginBottom: 40,
              maxWidth: 620,
            }}
          >
            <div
              style={{
                fontFamily: F.body,
                fontSize: 12,
                fontWeight: 700,
                color: C.teal,
                letterSpacing: "0.08em",
                marginBottom: 10,
              }}
            >
              THE BUILD
            </div>

            <h2
              className="kv-shimmer-text"
              style={{
                fontFamily: F.head,
                fontSize: 28,
                fontWeight: 600,
                margin: 0,
                lineHeight: 1.3,
              }}
            >
              How we built this project
            </h2>

            <p
              style={{
                fontFamily: F.body,
                fontSize: 13.5,
                lineHeight: 1.7,
                color: C.text,
                margin: "14px 0 0 0",
              }}
            >
              Kavach started as a simple question — what would it take to make a
              citizen's first interaction with the police feel as clear and
              reliable as any modern digital service? Here's the path we took to
              get there.
            </p>
          </div>

          <div
            style={{
              position: "relative",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 18,
                flexWrap: "wrap",
              }}
            >
              <BuildStep
                index={1}
                delay={0.05}
                icon={<IChat color={C.iconBlueFg} />}
                title="Talked to the people who'd use it"
                desc="Sat with officers and citizens across districts to map where filing an FIR or checking a case actually breaks down today."
              />

              <BuildStep
                index={2}
                delay={0.15}
                icon={<ISection color={C.iconGreenFg} />}
                title="Designed a system, not a screen"
                desc="One teal-and-navy visual language, one type scale, one set of components — reused across every citizen and officer view."
              />

              <BuildStep
                index={3}
                delay={0.25}
                icon={<ILock color={C.iconPurpleFg} />}
                title="Built the frontend in React"
                desc="A component-driven TypeScript app, with real Karnataka district geography rendered through react-simple-maps and d3-geo."
              />

              <BuildStep
                index={4}
                delay={0.35}
                icon={<IChart color={C.iconOrangeFg} />}
                title="Backed it with secure APIs"
                desc="FastAPI services handle FIR records, officer data, and citizen submissions, with access control on every request."
              />

              <BuildStep
                index={5}
                delay={0.45}
                icon={<IStatGlobeSmall />}
                title="Shipped, then kept listening"
                desc="Launched to a handful of districts first, then iterated on real feedback before rolling out statewide."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- PARTNERS STRIP ---------------- */}

      <section
        style={{
          borderTop: `1px solid ${C.border}`,
          padding: "34px 28px 50px",
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              fontFamily: F.body,
              fontSize: 12.5,
              color: C.text,
              marginBottom: 22,
            }}
          >
            Trusted by 31 districts across Karnataka, in coordination with
          </div>

          <div
            className="ab-partners"
            style={{
              display: "flex",
              gap: 46,
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {partners.map((name) => (
              <div
                key={name}
                style={{
                  fontFamily: F.head,
                  fontSize: 14.5,
                  fontWeight: 600,
                  color: "#B7BEC4",
                }}
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
