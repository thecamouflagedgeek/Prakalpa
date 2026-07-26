import React, { useState, useEffect } from "react";
import heroImg from "../assets/hero-landing.jpg";
import aboutImg from "../assets/landing.jpg";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const C = {
  teal: "#0E8C8C",
  tealDark: "#0A6E6E",
  navy: "#152A43",
  navySoft: "#2C4260",
  bgSection: "#EAF2F5",
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
    width={p.size ?? 20}
    height={p.size ?? 20}
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

const IChat = (p: { color?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    {" "}
    <path
      d="M4 5h16v11H8l-4 4V5z"
      stroke={p.color}
      strokeWidth="1.7"
      strokeLinejoin="round"
    />{" "}
  </svg>
);

const ISection = (p: { color?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    {" "}
    <path
      d="M6 3h9l4 4v14H6V3z"
      stroke={p.color}
      strokeWidth="1.7"
      strokeLinejoin="round"
    />{" "}
    <path
      d="M9 12h6M9 16h6"
      stroke={p.color}
      strokeWidth="1.7"
      strokeLinecap="round"
    />{" "}
  </svg>
);

const ILock = (p: { color?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    {" "}
    <rect
      x="5"
      y="11"
      width="14"
      height="9"
      rx="2"
      stroke={p.color}
      strokeWidth="1.7"
    />{" "}
    <path d="M8 11V8a4 4 0 018 0v3" stroke={p.color} strokeWidth="1.7" />{" "}
  </svg>
);

const IChart = (p: { color?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    {" "}
    <path
      d="M4 20V10M11 20V4M18 20v-7"
      stroke={p.color}
      strokeWidth="2"
      strokeLinecap="round"
    />{" "}
  </svg>
);

const IUsers = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    {" "}
    <circle cx="9" cy="8" r="3" stroke={C.teal} strokeWidth="1.7" />{" "}
    <path
      d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"
      stroke={C.teal}
      strokeWidth="1.7"
      strokeLinecap="round"
    />{" "}
    <circle cx="17" cy="9" r="2.3" stroke={C.teal} strokeWidth="1.7" />{" "}
    <path
      d="M15.5 14c2.6.3 4.5 2.5 4.5 6"
      stroke={C.teal}
      strokeWidth="1.7"
      strokeLinecap="round"
    />{" "}
  </svg>
);

const ICase = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    {" "}
    <rect
      x="3"
      y="8"
      width="18"
      height="12"
      rx="1.5"
      stroke={C.teal}
      strokeWidth="1.7"
    />{" "}
    <path
      d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2"
      stroke={C.teal}
      strokeWidth="1.7"
    />{" "}
  </svg>
);

const ITrophy = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    {" "}
    <path
      d="M8 4h8v5a4 4 0 01-8 0V4z"
      stroke={C.teal}
      strokeWidth="1.7"
      strokeLinejoin="round"
    />{" "}
    <path
      d="M12 13v3M9 20h6M10 16.5h4"
      stroke={C.teal}
      strokeWidth="1.7"
      strokeLinecap="round"
    />{" "}
    <path
      d="M8 5H5a3 3 0 003 3M16 5h3a3 3 0 01-3 3"
      stroke={C.teal}
      strokeWidth="1.7"
    />{" "}
  </svg>
);

const IStatGlobe = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    {" "}
    <circle cx="12" cy="12" r="8.5" stroke={C.teal} strokeWidth="1.7" />{" "}
    <path
      d="M3.5 12h17M12 3.5c2.5 2.4 3.8 5.4 3.8 8.5S14.5 18.1 12 20.5C9.5 18.1 8.2 15.1 8.2 12S9.5 5.9 12 3.5z"
      stroke={C.teal}
      strokeWidth="1.5"
    />{" "}
  </svg>
);

const IArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    {" "}
    <path
      d="M5 12h14M13 6l6 6-6 6"
      stroke={C.teal}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />{" "}
  </svg>
);

const ICheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    {" "}
    <circle cx="12" cy="12" r="10" fill={C.iconGreen} />{" "}
    <path
      d="M7 12.5l3 3 7-7"
      stroke={C.iconGreenFg}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />{" "}
  </svg>
);

const IPlay = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
    {" "}
    <path d="M6 4l14 8-14 8V4z" fill={C.teal} />{" "}
  </svg>
);

/* ---------------- stat card ---------------- */

function Stat({
  icon,
  value,
  label,
  last,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  last?: boolean;
}) {
  return (
    <div
      style={{
        flex: "1 1 200px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "26px 30px",
        borderRight: last ? "none" : `1px solid ${C.border}`,
      }}
    >
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: "50%",
          background: C.bgSection,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}{" "}
      </div>{" "}
      <div>
        <div
          style={{
            fontFamily: F.head,
            fontSize: 24,
            fontWeight: 600,
            color: C.navy,
            lineHeight: 1.1,
          }}
        >
          {value}{" "}
        </div>
        <div
          style={{
            fontFamily: F.body,
            fontSize: 13,
            color: C.text,
            marginTop: 2,
          }}
        >
          {label}{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}

/* ---------------- service card ---------------- */

function ServiceCard({
  bg,
  fg,
  icon,
  title,
  desc,
  learnMoreText,
}: {
  bg: string;
  fg: string;
  icon: (p: { color?: string }) => React.ReactNode;
  title: string;
  desc: string;
  learnMoreText: string;
}) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: C.white,
        borderRadius: 12,
        padding: "30px 26px",
        flex: "1 1 240px",
        minWidth: 240,
        boxShadow: hover
          ? "0 18px 34px rgba(21,42,67,0.10)"
          : "0 4px 16px rgba(21,42,67,0.05)",
        transform: hover ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.2s ease",
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        {icon({ color: fg })}{" "}
      </div>

      <h3
        style={{
          fontFamily: F.head,
          fontSize: 17,
          fontWeight: 600,
          color: C.navy,
          margin: "0 0 10px 0",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontFamily: F.body,
          fontSize: 13.5,
          lineHeight: 1.6,
          color: C.text,
          margin: "0 0 18px 0",
        }}
      >
        {desc}
      </p>

      <a
        href="#"
        style={{
          fontFamily: F.body,
          fontSize: 13,
          fontWeight: 600,
          color: C.teal,
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        {learnMoreText} <IArrow />
      </a>
    </div>
  );
}

/* ==================================================================== */

export default function KavachLandingPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, []);

  const toggleLanguage = () => {
    const nextLang = i18n.language?.startsWith("kn") ? "en" : "kn";
    i18n.changeLanguage(nextLang);
  };

  const navKeys = [
    { key: "home", label: t("nav.home") },
    { key: "about", label: t("nav.about"), path: "/about" },
    { key: "districts", label: t("nav.districts"), path: "/dis" },
  ];

  return (
    <div style={{ background: C.white, width: "100%", minHeight: "100vh" }}>
      {" "}
      <style>{`         @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');         * { box-sizing: border-box; }
        body { margin: 0; }
        a:focus-visible, button:focus-visible { outline: 2px solid ${C.teal}; outline-offset: 2px; }
        @media (max-width: 900px) {
          .kv-hero-copy { max-width: 100% !important; padding: 60px 24px !important; }
          .kv-hero-copy h1 { font-size: 32px !important; }
          .kv-nav { display: none !important; }
          .kv-stats { flex-direction: column !important; }
          .kv-stats > div { border-right: none !important; border-bottom: 1px solid ${C.border}; }
          .kv-about-grid { grid-template-columns: 1fr !important; }
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

          <nav className="kv-nav" style={{ display: "flex", gap: 32 }}>
            {navKeys.map((item) => (
              <a
                key={item.key}
                href={
                  item.key === "about"
                    ? "/about"
                    : item.key === "districts"
                      ? "/dis"
                      : "#"
                }
                style={{
                  fontFamily: F.body,
                  fontSize: 13.5,
                  color: C.navySoft,
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
              {t("nav.switch_lang")}
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
              {t("nav.get_in_touch")}
            </button>
          </div>
        </div>
      </header>
      {/* ---------------- HERO ---------------- */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <img
          src={heroImg}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.55) 45%, rgba(255,255,255,0.05) 70%)",
          }}
        />

        <div
          className="kv-hero-copy"
          style={{
            position: "relative",
            maxWidth: 620,
            padding: "88px 28px 120px 56px",
          }}
        >
          <h1
            style={{
              fontFamily: F.head,
              fontSize: 44,
              fontWeight: 700,
              lineHeight: 1.18,
              margin: 0,
              color: C.navy,
            }}
          >
            {t("hero.title_line1")}
            <br />
            <span style={{ color: C.teal }}>{t("hero.title_line2")}</span>
          </h1>

          <p
            style={{
              fontFamily: F.body,
              fontSize: 15,
              lineHeight: 1.7,
              color: C.navySoft,
              margin: "20px 0 30px 0",
              maxWidth: 460,
            }}
          >
            {t("hero.desc")}
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button
              style={{
                background: C.teal,
                color: C.white,
                border: "none",
                borderRadius: 6,
                padding: "13px 26px",
                fontFamily: F.body,
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              {t("hero.our_services")}
            </button>

            <button
              style={{
                background: C.white,
                color: C.navy,
                border: `1px solid ${C.border}`,
                borderRadius: 6,
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
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: C.bgSection,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IPlay />
              </span>
              {t("hero.watch_overview")}
            </button>
          </div>
        </div>
      </section>
      {/* ---------------- STATS BAR ---------------- */}
      <section
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "0 28px",
          position: "relative",
          top: -46,
        }}
      >
        <div
          className="kv-stats"
          style={{
            background: C.white,
            borderRadius: 12,
            boxShadow: "0 16px 40px rgba(21,42,67,0.10)",
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          <Stat
            icon={<IUsers />}
            value="500+"
            label={t("stats.firs_resolved")}
          />
          <Stat
            icon={<ICase />}
            value="1200+"
            label={t("stats.cases_digitized")}
          />
          <Stat
            icon={<ITrophy />}
            value="15+"
            label={t("stats.commendations")}
          />
          <Stat
            icon={<IStatGlobe />}
            value="31"
            label={t("stats.districts_served")}
            last
          />
        </div>
      </section>
      {/* ---------------- WHAT WE DO ---------------- */}
      <section style={{ background: C.bgSection, padding: "70px 28px 60px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 30,
              flexWrap: "wrap",
              marginBottom: 44,
            }}
          >
            <div>
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
                {t("what_we_do.tag")}
              </div>

              <h2
                style={{
                  fontFamily: F.head,
                  fontSize: 30,
                  fontWeight: 600,
                  color: C.navy,
                  margin: 0,
                  maxWidth: 380,
                  lineHeight: 1.25,
                }}
              >
                {t("what_we_do.title_line1")}{" "}
                <span style={{ color: C.teal }}>
                  {t("what_we_do.title_line2")}
                </span>
              </h2>
            </div>

            <p
              style={{
                fontFamily: F.body,
                fontSize: 13.5,
                color: C.text,
                maxWidth: 340,
                lineHeight: 1.7,
                margin: 0,
                alignSelf: "flex-end",
              }}
            >
              {t("what_we_do.desc")}
              <br />
              <a
                href="#"
                style={{
                  color: C.teal,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                {t("what_we_do.explore_all")}
              </a>
            </p>
          </div>

          <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
            <ServiceCard
              bg={C.iconBlue}
              fg={C.iconBlueFg}
              icon={IChat}
              title={t("services_list.s1_title")}
              desc={t("services_list.s1_desc")}
              learnMoreText={t("what_we_do.learn_more")}
            />

            <ServiceCard
              bg={C.iconGreen}
              fg={C.iconGreenFg}
              icon={ISection}
              title={t("services_list.s2_title")}
              desc={t("services_list.s2_desc")}
              learnMoreText={t("what_we_do.learn_more")}
            />

            <ServiceCard
              bg={C.iconPurple}
              fg={C.iconPurpleFg}
              icon={ILock}
              title={t("services_list.s3_title")}
              desc={t("services_list.s3_desc")}
              learnMoreText={t("what_we_do.learn_more")}
            />

            <ServiceCard
              bg={C.iconOrange}
              fg={C.iconOrangeFg}
              icon={IChart}
              title={t("services_list.s4_title")}
              desc={t("services_list.s4_desc")}
              learnMoreText={t("what_we_do.learn_more")}
            />
          </div>
        </div>
      </section>
      {/* ---------------- ABOUT ---------------- */}
      <section style={{ padding: "80px 28px" }}>
        <div
          className="kv-about-grid"
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 60,
            alignItems: "center",
          }}
        >
          <div>
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
              {t("about.tag")}
            </div>

            <h2
              style={{
                fontFamily: F.head,
                fontSize: 28,
                fontWeight: 600,
                color: C.navy,
                margin: "0 0 16px 0",
                lineHeight: 1.3,
              }}
            >
              {t("about.title_line1")}{" "}
              <span style={{ color: C.teal }}>{t("about.title_line2")}</span>
            </h2>

            <p
              style={{
                fontFamily: F.body,
                fontSize: 14,
                lineHeight: 1.75,
                color: C.text,
                margin: "0 0 22px 0",
              }}
            >
              {t("about.desc")}
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                marginBottom: 26,
              }}
            >
              {[t("about.point_1"), t("about.point_2"), t("about.point_3")].map(
                (ptText, idx) => (
                  <div
                    key={idx}
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <ICheck />

                    <span
                      style={{
                        fontFamily: F.body,
                        fontSize: 13.5,
                        color: C.navy,
                        fontWeight: 500,
                      }}
                    >
                      {ptText}
                    </span>
                  </div>
                ),
              )}
            </div>

            <button
              style={{
                background: C.teal,
                color: C.white,
                border: "none",
                borderRadius: 24,
                padding: "13px 26px",
                fontFamily: F.body,
                fontWeight: 600,
                fontSize: 13.5,
                cursor: "pointer",
              }}
            >
              {t("about.btn_learn_more")}
            </button>
          </div>

          <div style={{ position: "relative" }}>
            <img
              src={aboutImg}
              alt="Karnataka Police headquarters"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: 14,
                display: "block",
                objectFit: "cover",
              }}
            />

            <div
              style={{
                position: "absolute",
                bottom: -24,
                right: 20,
                background: C.white,
                borderRadius: 10,
                boxShadow: "0 14px 32px rgba(21,42,67,0.16)",
                padding: "18px 22px",
                maxWidth: 190,
              }}
            >
              <div
                style={{
                  fontFamily: F.head,
                  fontSize: 24,
                  fontWeight: 700,
                  color: C.navy,
                }}
              >
                15+
              </div>

              <div
                style={{
                  fontFamily: F.body,
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: C.navy,
                  marginBottom: 2,
                }}
              >
                {t("about.badge_years")}
              </div>

              <div
                style={{
                  fontFamily: F.body,
                  fontSize: 11.5,
                  color: C.text,
                  lineHeight: 1.4,
                }}
              >
                {t("about.badge_desc")}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ---------------- TRUSTED BY ---------------- */}
      <section
        style={{
          borderTop: `1px solid ${C.border}`,
          padding: "40px 28px 60px",
        }}
      >
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div
            style={{
              fontFamily: F.body,
              fontSize: 11,
              fontWeight: 700,
              color: "#9AA7B0",
              letterSpacing: "0.1em",
              marginBottom: 26,
              textAlign: "left",
            }}
          >
            {t("trusted.in_coordination_with")}
          </div>

          <div
            style={{
              display: "flex",
              gap: 46,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {[
              t("trusted.partner_1"),
              t("trusted.partner_2"),
              t("trusted.partner_3"),
              t("trusted.partner_4"),
              t("trusted.partner_5"),
              t("trusted.partner_6"),
            ].map((name, i) => (
              <div
                key={i}
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
