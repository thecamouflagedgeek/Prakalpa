// Settings.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

// ---------- Translations ----------

const translations = {
  en: {
    portalSub: "OFFICER PORTAL",
    signOut: "Sign out",
    navDashboard: "Dashboard",
    navBNS: "BNS Sections",
    navCrime: "Crime Hotspot",
    navExplain: "Explainable AI",
    navSettings: "Settings",
    navGenerate: "Generate report",
    switchLang: "ಕನ್ನಡ",
    topbarTitle: "Settings",
    topbarSub: "Manage your profile, preferences, and portal configuration",
    aiEngineOnline: "AI Engine Online",

    secProfile: "Officer Profile",
    subProfile: "Identity details shown across the portal",
    fieldName: "Full name",
    fieldBadge: "Badge / Service ID",
    fieldRank: "Rank",
    fieldStation: "Posted station",
    fieldDept: "Department",
    valDept: "Karnataka State Police",
    notEditable: "Managed by department records",
    editProfile: "Edit profile",
    saveProfile: "Save changes",
    cancel: "Cancel",

    secPreferences: "Language & Region",
    subPreferences: "Choose how the portal is displayed to you",
    fieldLanguage: "Portal language",
    langEnglish: "English",
    langKannada: "ಕನ್ನಡ (Kannada)",
    fieldTimezone: "Time zone",
    valTimezone: "India Standard Time (IST, UTC+5:30)",
    fieldDateFormat: "Date format",
    valDateFormat: "DD-MM-YYYY",

    secNotifications: "Notifications",
    subNotifications: "Control what the portal alerts you about",
    notifyHotspot: "Crime hotspot alerts",
    notifyHotspotDesc: "High-risk zone changes for your station",
    notifyCase: "Case & FIR updates",
    notifyCaseDesc: "Status changes on assigned cases",
    notifyAnomaly: "Anomaly detections",
    notifyAnomalyDesc: "AI-flagged deviations from baseline crime patterns",
    notifyReport: "Report generation",
    notifyReportDesc: "When AI-generated reports finish drafting",
    notifyDigest: "Daily summary email",
    notifyDigestDesc: "A daily digest of station activity",

    secSecurity: "Security",
    subSecurity: "Manage sign-in and access to your account",
    changePassword: "Change password",
    changePasswordDesc: "Last changed: not available",
    twoFactor: "Two-factor authentication",
    twoFactorDesc: "Add an extra step when signing in",
    activeSessions: "Active sessions",
    activeSessionsDesc: "This device is currently signed in",
    signOutAll: "Sign out of all devices",

    secAI: "AI Engine",
    subAI: "The model powering forecasts, patterns, and reports",
    aiProvider: "Provider",
    aiModel: "Model",
    aiScope: "Data scope",
    aiScopeVal: "Station-level analytics only · no personal citizen data",
    aiDisclaimer:
      "AI outputs are decision-support only and require officer verification before action.",

    secAbout: "About KAVACH",
    subAbout: "Platform information",
    aboutVersion: "Version",
    aboutBuild: "Build",
    aboutSupport: "Support",
    aboutSupportVal: "Contact your station IT nodal officer",

    dangerZone: "Danger Zone",
    dangerDesc: "Sign out ends your current session on this device.",
    dangerSignOut: "Sign out of KAVACH",

    on: "On",
    off: "Off",
  },
  kn: {
    portalSub: "ಅಧಿಕಾರಿ ಪೋರ್ಟಲ್",
    signOut: "ಸೈನ್ ಔಟ್",
    navDashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    navBNS: "ಬಿಎನ್‌ಎಸ್ (BNS) ವಿಭಾಗಗಳು",
    navCrime: "ಅಪರಾಧ ತೀವ್ರತೆಯ ತಾಣ",
    navExplain: "ವಿವರಿಸಬಹುದಾದ AI",
    navSettings: "ಸಂಯೋಜನೆಗಳು",
    navGenerate: "ವರದಿಯನ್ನು ರಚಿಸಿ",
    switchLang: "English",
    topbarTitle: "ಸಂಯೋಜನೆಗಳು",
    topbarSub: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್, ಆದ್ಯತೆಗಳು ಮತ್ತು ಪೋರ್ಟಲ್ ಸಂರಚನೆಯನ್ನು ನಿರ್ವಹಿಸಿ",
    aiEngineOnline: "AI ಎಂಜಿನ್ ಆನ್‌ಲೈನ್",

    secProfile: "ಅಧಿಕಾರಿ ಪ್ರೊಫೈಲ್",
    subProfile: "ಪೋರ್ಟಲ್‌ನಾದ್ಯಂತ ತೋರಿಸಲಾಗುವ ಗುರುತಿನ ವಿವರಗಳು",
    fieldName: "ಪೂರ್ಣ ಹೆಸರು",
    fieldBadge: "ಬ್ಯಾಡ್ಜ್ / ಸೇವಾ ಐಡಿ",
    fieldRank: "ಶ್ರೇಣಿ",
    fieldStation: "ನಿಯೋಜಿತ ಠಾಣೆ",
    fieldDept: "ಇಲಾಖೆ",
    valDept: "ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್",
    notEditable: "ಇಲಾಖಾ ದಾಖಲೆಗಳಿಂದ ನಿರ್ವಹಿಸಲ್ಪಡುತ್ತದೆ",
    editProfile: "ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ",
    saveProfile: "ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ",
    cancel: "ರದ್ದುಮಾಡಿ",

    secPreferences: "ಭಾಷೆ ಮತ್ತು ಪ್ರದೇಶ",
    subPreferences: "ಪೋರ್ಟಲ್ ನಿಮಗೆ ಹೇಗೆ ಪ್ರದರ್ಶಿತವಾಗುತ್ತದೆ ಎಂಬುದನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    fieldLanguage: "ಪೋರ್ಟಲ್ ಭಾಷೆ",
    langEnglish: "English",
    langKannada: "ಕನ್ನಡ",
    fieldTimezone: "ಸಮಯ ವಲಯ",
    valTimezone: "ಭಾರತೀಯ ಪ್ರಮಾಣಿತ ಸಮಯ (IST, UTC+5:30)",
    fieldDateFormat: "ದಿನಾಂಕ ಸ್ವರೂಪ",
    valDateFormat: "DD-MM-YYYY",

    secNotifications: "ಅಧಿಸೂಚನೆಗಳು",
    subNotifications: "ಪೋರ್ಟಲ್ ನಿಮಗೆ ಯಾವುದರ ಬಗ್ಗೆ ಎಚ್ಚರಿಸುತ್ತದೆ ಎಂಬುದನ್ನು ನಿಯಂತ್ರಿಸಿ",
    notifyHotspot: "ಅಪರಾಧ ಹಾಟ್‌ಸ್ಪಾಟ್ ಎಚ್ಚರಿಕೆಗಳು",
    notifyHotspotDesc: "ನಿಮ್ಮ ಠಾಣೆಗೆ ಹೆಚ್ಚಿನ ಅಪಾಯದ ವಲಯ ಬದಲಾವಣೆಗಳು",
    notifyCase: "ಪ್ರಕರಣ ಮತ್ತು ಎಫ್‌ಐಆರ್ ನವೀಕರಣಗಳು",
    notifyCaseDesc: "ನಿಯೋಜಿತ ಪ್ರಕರಣಗಳ ಸ್ಥಿತಿ ಬದಲಾವಣೆಗಳು",
    notifyAnomaly: "ಅಸಹಜತೆ ಪತ್ತೆಗಳು",
    notifyAnomalyDesc: "ಮೂಲಮಟ್ಟದ ಅಪರಾಧ ಮಾದರಿಗಳಿಂದ AI ಗುರುತಿಸಿದ ವ್ಯತ್ಯಾಸಗಳು",
    notifyReport: "ವರದಿ ರಚನೆ",
    notifyReportDesc: "AI-ರಚಿತ ವರದಿಗಳು ಪೂರ್ಣಗೊಂಡಾಗ",
    notifyDigest: "ದೈನಂದಿನ ಸಾರಾಂಶ ಇಮೇಲ್",
    notifyDigestDesc: "ಠಾಣಾ ಚಟುವಟಿಕೆಯ ದೈನಂದಿನ ಸಾರಾಂಶ",

    secSecurity: "ಭದ್ರತೆ",
    subSecurity: "ನಿಮ್ಮ ಖಾತೆಗೆ ಸೈನ್-ಇನ್ ಮತ್ತು ಪ್ರವೇಶವನ್ನು ನಿರ್ವಹಿಸಿ",
    changePassword: "ಪಾಸ್‌ವರ್ಡ್ ಬದಲಾಯಿಸಿ",
    changePasswordDesc: "ಕೊನೆಯದಾಗಿ ಬದಲಾಯಿಸಿದ್ದು: ಲಭ್ಯವಿಲ್ಲ",
    twoFactor: "ಎರಡು-ಹಂತದ ದೃಢೀಕರಣ",
    twoFactorDesc: "ಸೈನ್-ಇನ್ ಮಾಡುವಾಗ ಹೆಚ್ಚುವರಿ ಹಂತವನ್ನು ಸೇರಿಸಿ",
    activeSessions: "ಸಕ್ರಿಯ ಸೆಶನ್‌ಗಳು",
    activeSessionsDesc: "ಈ ಸಾಧನವು ಪ್ರಸ್ತುತ ಸೈನ್ ಇನ್ ಆಗಿದೆ",
    signOutAll: "ಎಲ್ಲಾ ಸಾಧನಗಳಿಂದ ಸೈನ್ ಔಟ್ ಮಾಡಿ",

    secAI: "AI ಎಂಜಿನ್",
    subAI: "ಮುನ್ಸೂಚನೆಗಳು, ಮಾದರಿಗಳು ಮತ್ತು ವರದಿಗಳನ್ನು ಚಾಲನೆ ಮಾಡುವ ಮಾದರಿ",
    aiProvider: "ಪೂರೈಕೆದಾರ",
    aiModel: "ಮಾದರಿ",
    aiScope: "ಡೇಟಾ ವ್ಯಾಪ್ತಿ",
    aiScopeVal: "ಠಾಣಾ-ಮಟ್ಟದ ವಿಶ್ಲೇಷಣೆ ಮಾತ್ರ · ಯಾವುದೇ ವೈಯಕ್ತಿಕ ನಾಗರಿಕ ದತ್ತಾಂಶವಿಲ್ಲ",
    aiDisclaimer:
      "AI ಔಟ್‌ಪುಟ್‌ಗಳು ನಿರ್ಧಾರ-ಬೆಂಬಲ ಮಾತ್ರ ಮತ್ತು ಕ್ರಮ ತೆಗೆದುಕೊಳ್ಳುವ ಮೊದಲು ಅಧಿಕಾರಿ ಪರಿಶೀಲನೆ ಅಗತ್ಯವಿದೆ.",

    secAbout: "KAVACH ಬಗ್ಗೆ",
    subAbout: "ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಮಾಹಿತಿ",
    aboutVersion: "ಆವೃತ್ತಿ",
    aboutBuild: "ಬಿಲ್ಡ್",
    aboutSupport: "ಬೆಂಬಲ",
    aboutSupportVal: "ನಿಮ್ಮ ಠಾಣಾ ಐಟಿ ನೋಡಲ್ ಅಧಿಕಾರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ",

    dangerZone: "ಡೇಂಜರ್ ಜೋನ್",
    dangerDesc: "ಸೈನ್ ಔಟ್ ಈ ಸಾಧನದಲ್ಲಿ ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಸೆಶನ್ ಅನ್ನು ಕೊನೆಗೊಳಿಸುತ್ತದೆ.",
    dangerSignOut: "KAVACH ನಿಂದ ಸೈನ್ ಔಟ್ ಮಾಡಿ",

    on: "ಆನ್",
    off: "ಆಫ್",
  },
} as const;

type Lang = keyof typeof translations;

// ---------- Component ----------

export default function Settings() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [lang, setLang] = useState<Lang>("en");
  const t = translations[lang];
  const toggleLanguage = () => setLang((prev) => (prev === "en" ? "kn" : "en"));

  const officerName = user?.name || "Unknown Officer";
  const officerBadge = user?.badge || "";

  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(officerName);

  const [notifications, setNotifications] = useState({
    hotspot: true,
    caseUpdates: true,
    anomaly: true,
    report: false,
    digest: false,
  });
  const [twoFactorOn, setTwoFactorOn] = useState(false);

  const toggleNotification = (key: keyof typeof notifications) =>
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));

  const S = styles;

  return (
    <div style={S.page}>
      {/* ---------------- SIDEBAR ---------------- */}
      <aside style={S.sidebar}>
        <div style={S.sidebarLogoRow}>
          <div style={S.sidebarLogoIcon}>
            <ShieldIcon size={18} color="#FFFFFF" />
          </div>
          <div>
            <div style={S.sidebarLogoTitle}>KAVACH</div>
            <div style={S.sidebarLogoSub}>{t.portalSub}</div>
          </div>
        </div>

        <nav style={S.navList}>
          {[
            {
              key: "dashboard",
              label: t.navDashboard,
              path: "/officer/dashboard",
              icon: "grid",
            },
            {
              key: "cases",
              label: t.navBNS,
              path: "/bns",
              icon: "case",
            },
            { key: "districts", label: t.navCrime, path: "/dash", icon: "map" },
            {
              key: "analytics",
              label: t.navExplain,
              path: "/officer/explain",
              icon: "chart",
            },
            {
              key: "reports",
              label: t.navGenerate,
              path: "/generate-report",
              icon: "bolt",
            },
            {
              key: "settings",
              label: t.navSettings,
              path: "/settings",
              icon: "gear",
            },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => navigate(item.path)}
              style={S.navItem(item.key === "settings")}
            >
              <NavIcon
                name={item.icon}
                color={
                  item.key === "settings" ? "#FFFFFF" : "rgba(255,255,255,0.55)"
                }
              />
              {item.label}
            </button>
          ))}

          
        </nav>

        <div style={S.sidebarFooter}>
          <div style={S.sidebarOfficerRow}>
            <div style={S.sidebarAvatar}>
              {(officerName || "O").charAt(0).toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={S.sidebarOfficerName}>{officerName}</div>
              <div style={S.sidebarOfficerBadge}>{officerBadge}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/");
            }}
            style={S.logoutBtn}
          >
            <NavIcon name="logout" color="rgba(255,255,255,0.7)" />
            {t.signOut}
          </button>
        </div>
      </aside>

      {/* ---------------- MAIN ---------------- */}
      <div style={S.main}>
        <div style={S.topbar}>
          <div>
            <div style={S.topbarTitle}>{t.topbarTitle}</div>
            <div style={S.topbarSub}>{t.topbarSub}</div>
          </div>
          <div style={S.officerChipRow}>
            <button onClick={toggleLanguage} type="button" style={S.langBtn}>
              <GlobeIcon color="#0E8C8C" size={13} />
              {t.switchLang}
            </button>
            <span style={S.officerBadge}>{officerBadge}</span>
            <span style={S.officerName}>{officerName}</span>
          </div>
        </div>

        <div style={S.body}>
          {/* ---------- Officer Profile ---------- */}
          <section style={S.card}>
            <div style={S.cardHeadRow}>
              <div style={S.cardHeadIcon}>
                <GlyphIcon name="user" color="#0E8C8C" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={S.cardTitle}>{t.secProfile}</div>
                <div style={S.cardSub}>{t.subProfile}</div>
              </div>
              {!editing ? (
                <button
                  type="button"
                  style={S.secondaryBtn}
                  onClick={() => {
                    setDraftName(officerName);
                    setEditing(true);
                  }}
                >
                  {t.editProfile}
                </button>
              ) : (
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    style={S.ghostBtn}
                    onClick={() => setEditing(false)}
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="button"
                    style={S.primaryBtn}
                    onClick={() => setEditing(false)}
                  >
                    {t.saveProfile}
                  </button>
                </div>
              )}
            </div>

            <div style={S.profileGrid}>
              <div style={S.profileAvatarCol}>
                <div style={S.profileAvatar}>
                  {(officerName || "O").charAt(0).toUpperCase()}
                </div>
              </div>
              <div style={S.fieldGrid}>
                <Field label={t.fieldName}>
                  {editing ? (
                    <input
                      style={S.input}
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                    />
                  ) : (
                    <div style={S.fieldValue}>{officerName}</div>
                  )}
                </Field>
                <Field label={t.fieldBadge} hint={t.notEditable}>
                  <div style={S.fieldValue}>{officerBadge || "—"}</div>
                </Field>
                <Field label={t.fieldRank} hint={t.notEditable}>
                  <div style={S.fieldValue}>—</div>
                </Field>
                <Field label={t.fieldStation} hint={t.notEditable}>
                  <div style={S.fieldValue}>—</div>
                </Field>
                <Field label={t.fieldDept} hint={t.notEditable}>
                  <div style={S.fieldValue}>{t.valDept}</div>
                </Field>
              </div>
            </div>
          </section>

          {/* ---------- Language & Region ---------- */}
          <section style={S.card}>
            <div style={S.cardHeadRow}>
              <div style={S.cardHeadIcon}>
                <GlobeIcon color="#0E8C8C" size={16} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={S.cardTitle}>{t.secPreferences}</div>
                <div style={S.cardSub}>{t.subPreferences}</div>
              </div>
            </div>

            <div style={S.settingRow}>
              <div>
                <div style={S.settingLabel}>{t.fieldLanguage}</div>
              </div>
              <div style={S.langToggleGroup}>
                <button
                  type="button"
                  style={S.langOption(lang === "en")}
                  onClick={() => setLang("en")}
                >
                  {t.langEnglish}
                </button>
                <button
                  type="button"
                  style={S.langOption(lang === "kn")}
                  onClick={() => setLang("kn")}
                >
                  {t.langKannada}
                </button>
              </div>
            </div>

            <div style={S.settingDivider} />

            <div style={S.settingRow}>
              <div style={S.settingLabel}>{t.fieldTimezone}</div>
              <div style={S.settingStaticValue}>{t.valTimezone}</div>
            </div>

            <div style={S.settingDivider} />

            <div style={S.settingRow}>
              <div style={S.settingLabel}>{t.fieldDateFormat}</div>
              <div style={S.settingStaticValue}>{t.valDateFormat}</div>
            </div>
          </section>

          {/* ---------- Notifications ---------- */}
          <section style={S.card}>
            <div style={S.cardHeadRow}>
              <div style={S.cardHeadIcon}>
                <GlyphIcon name="bell" color="#0E8C8C" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={S.cardTitle}>{t.secNotifications}</div>
                <div style={S.cardSub}>{t.subNotifications}</div>
              </div>
            </div>

            <ToggleRow
              label={t.notifyHotspot}
              desc={t.notifyHotspotDesc}
              value={notifications.hotspot}
              onToggle={() => toggleNotification("hotspot")}
              onLabel={t.on}
              offLabel={t.off}
              S={S}
            />
            <div style={S.settingDivider} />
            <ToggleRow
              label={t.notifyCase}
              desc={t.notifyCaseDesc}
              value={notifications.caseUpdates}
              onToggle={() => toggleNotification("caseUpdates")}
              onLabel={t.on}
              offLabel={t.off}
              S={S}
            />
            <div style={S.settingDivider} />
            <ToggleRow
              label={t.notifyAnomaly}
              desc={t.notifyAnomalyDesc}
              value={notifications.anomaly}
              onToggle={() => toggleNotification("anomaly")}
              onLabel={t.on}
              offLabel={t.off}
              S={S}
            />
            <div style={S.settingDivider} />
            <ToggleRow
              label={t.notifyReport}
              desc={t.notifyReportDesc}
              value={notifications.report}
              onToggle={() => toggleNotification("report")}
              onLabel={t.on}
              offLabel={t.off}
              S={S}
            />
            <div style={S.settingDivider} />
            <ToggleRow
              label={t.notifyDigest}
              desc={t.notifyDigestDesc}
              value={notifications.digest}
              onToggle={() => toggleNotification("digest")}
              onLabel={t.on}
              offLabel={t.off}
              S={S}
            />
          </section>

          <div style={S.twoCol}>
            {/* ---------- Security ---------- */}
            <section style={S.card}>
              <div style={S.cardHeadRow}>
                <div style={S.cardHeadIcon}>
                  <GlyphIcon name="lock" color="#0E8C8C" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={S.cardTitle}>{t.secSecurity}</div>
                  <div style={S.cardSub}>{t.subSecurity}</div>
                </div>
              </div>

              <div style={S.settingRow}>
                <div>
                  <div style={S.settingLabel}>{t.changePassword}</div>
                  <div style={S.settingDesc}>{t.changePasswordDesc}</div>
                </div>
                <button type="button" style={S.secondaryBtn}>
                  {t.changePassword}
                </button>
              </div>

              <div style={S.settingDivider} />

              <ToggleRow
                label={t.twoFactor}
                desc={t.twoFactorDesc}
                value={twoFactorOn}
                onToggle={() => setTwoFactorOn((v) => !v)}
                onLabel={t.on}
                offLabel={t.off}
                S={S}
              />

              <div style={S.settingDivider} />

              <div style={S.settingRow}>
                <div>
                  <div style={S.settingLabel}>{t.activeSessions}</div>
                  <div style={S.settingDesc}>{t.activeSessionsDesc}</div>
                </div>
                <span style={S.statusPill}>1</span>
              </div>
            </section>

            {/* ---------- AI Engine ---------- */}
            <section style={S.card}>
              <div style={S.cardHeadRow}>
                <div style={S.cardHeadIcon}>
                  <GlyphIcon name="cpu" color="#0E8C8C" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={S.cardTitle}>{t.secAI}</div>
                  <div style={S.cardSub}>{t.subAI}</div>
                </div>
              </div>

              <div style={S.settingRow}>
                <div style={S.settingLabel}>{t.aiProvider}</div>
                <div style={S.settingStaticValue}>Groq</div>
              </div>
              <div style={S.settingDivider} />
              <div style={S.settingRow}>
                <div style={S.settingLabel}>{t.aiModel}</div>
                <div style={S.settingStaticValue}>llama-3.3-70b-versatile</div>
              </div>
              <div style={S.settingDivider} />
              <div style={S.settingRow}>
                <div style={S.settingLabel}>{t.aiScope}</div>
                <div style={{ ...S.settingStaticValue, textAlign: "right" as const, maxWidth: 220 }}>
                  {t.aiScopeVal}
                </div>
              </div>

              <div style={S.aiNote}>{t.aiDisclaimer}</div>
            </section>
          </div>

          {/* ---------- About ---------- */}
          <section style={S.card}>
            <div style={S.cardHeadRow}>
              <div style={S.cardHeadIcon}>
                <GlyphIcon name="info" color="#0E8C8C" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={S.cardTitle}>{t.secAbout}</div>
                <div style={S.cardSub}>{t.subAbout}</div>
              </div>
            </div>

            <div style={S.aboutGrid}>
              <div>
                <div style={S.settingLabel}>{t.aboutVersion}</div>
                <div style={S.settingStaticValue}>KAVACH 1.0.0</div>
              </div>
              <div>
                <div style={S.settingLabel}>{t.aboutBuild}</div>
                <div style={S.settingStaticValue}>Hackathon Build</div>
              </div>
              <div>
                <div style={S.settingLabel}>{t.aboutSupport}</div>
                <div style={S.settingStaticValue}>{t.aboutSupportVal}</div>
              </div>
            </div>
          </section>

          {/* ---------- Danger zone ---------- */}
          <section style={S.dangerCard}>
            <div>
              <div style={S.dangerTitle}>{t.dangerZone}</div>
              <div style={S.dangerDesc}>{t.dangerDesc}</div>
            </div>
            <button
              type="button"
              style={S.dangerBtn}
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              {t.dangerSignOut}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

// ---------- Small building blocks ----------

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div style={styles.fieldLabel}>{label}</div>
      {children}
      {hint && <div style={styles.fieldHint}>{hint}</div>}
    </div>
  );
}

function ToggleRow({
  label,
  desc,
  value,
  onToggle,
  onLabel,
  offLabel,
  S,
}: {
  label: string;
  desc: string;
  value: boolean;
  onToggle: () => void;
  onLabel: string;
  offLabel: string;
  S: typeof styles;
}) {
  return (
    <div style={S.settingRow}>
      <div>
        <div style={S.settingLabel}>{label}</div>
        <div style={S.settingDesc}>{desc}</div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={onToggle}
        style={S.switchTrack(value)}
      >
        <span style={S.switchThumb(value)} />
      </button>
    </div>
  );
}

// ---------- Icons ----------

function ShieldIcon({ size = 20, color = "#FFFFFF" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6l7-3z"
        stroke={color}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GlobeIcon({ size = 13, color = "#0E8C8C" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
      <line x1="2" y1="12" x2="22" y2="12" stroke={color} strokeWidth="2" />
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
        stroke={color}
        strokeWidth="2"
      />
    </svg>
  );
}

function NavIcon({ name, color }: { name: string; color: string }) {
  const common = { width: 17, height: 17, viewBox: "0 0 24 24", fill: "none" as const };
  switch (name) {
    case "grid":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="7" height="7" rx="1.4" stroke={color} strokeWidth="1.7" />
          <rect x="13" y="4" width="7" height="7" rx="1.4" stroke={color} strokeWidth="1.7" />
          <rect x="4" y="13" width="7" height="7" rx="1.4" stroke={color} strokeWidth="1.7" />
          <rect x="13" y="13" width="7" height="7" rx="1.4" stroke={color} strokeWidth="1.7" />
        </svg>
      );
    case "case":
      return (
        <svg {...common}>
          <rect x="3" y="8" width="18" height="12" rx="1.5" stroke={color} strokeWidth="1.7" />
          <path d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2" stroke={color} strokeWidth="1.7" />
        </svg>
      );
    case "map":
      return (
        <svg {...common}>
          <path d="M9 4l-5 2v14l5-2 6 2 5-2V4l-5 2-6-2z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M9 4v14M15 6v14" stroke={color} strokeWidth="1.6" />
        </svg>
      );
    case "chart":
      return (
        <svg {...common}>
          <path d="M4 20V10M11 20V4M18 20v-7" stroke={color} strokeWidth="1.9" strokeLinecap="round" />
        </svg>
      );
    case "bolt":
      return (
        <svg {...common}>
          <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
    case "gear":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.6" />
          <path
            d="M19 12a7 7 0 00-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 00-2-1.2L14.2 3H9.8l-.4 2.6a7 7 0 00-2 1.2l-2.3-.9-2 3.4 2 1.5A7 7 0 005 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-.9c.6.5 1.3.9 2 1.2l.4 2.6h4.4l.4-2.6c.7-.3 1.4-.7 2-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z"
            stroke={color}
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "logout":
      return (
        <svg {...common}>
          <path d="M9 4H5a1 1 0 00-1 1v14a1 1 0 001 1h4" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
          <path d="M15 16l4-4-4-4M19 12H9" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

/** Icons used only on this settings page (profile / bell / lock / cpu / info). */
function GlyphIcon({ name, color }: { name: string; color: string }) {
  const common = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none" as const };
  switch (name) {
    case "user":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.5" stroke={color} strokeWidth="1.7" />
          <path d="M5 20c0-3.6 3.1-6.5 7-6.5s7 2.9 7 6.5" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      );
    case "bell":
      return (
        <svg {...common}>
          <path
            d="M6 10a6 6 0 0112 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14 6 10z"
            stroke={color}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M10 18.5a2 2 0 004 0" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "lock":
      return (
        <svg {...common}>
          <rect x="4.5" y="10.5" width="15" height="10" rx="1.6" stroke={color} strokeWidth="1.6" />
          <path d="M8 10.5V7.5a4 4 0 018 0v3" stroke={color} strokeWidth="1.6" />
        </svg>
      );
    case "cpu":
      return (
        <svg {...common}>
          <rect x="7" y="7" width="10" height="10" rx="1.4" stroke={color} strokeWidth="1.6" />
          <path
            d="M9.5 7V4M14.5 7V4M9.5 20v-3M14.5 20v-3M7 9.5H4M7 14.5H4M20 9.5h-3M20 14.5h-3"
            stroke={color}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "info":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.6" />
          <path d="M12 11v6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="12" cy="8" r="0.9" fill={color} />
        </svg>
      );
    default:
      return null;
  }
}

// ---------- Styles ----------

const NAVY = "#152A43";
const NAVY_DEEP = "#0E2438";
const TEAL = "#0E8C8C";
const TEAL_DARK = "#0A6E6E";
const TEAL_TINT = "#E1F5F5";
const TEXT = "#5B6B7A";
const MUTED = "#8A97A3";
const BORDER = "#E3E9EC";
const BG_SECTION = "#EAF2F5";
const RED = "#C94B4B";
const RED_TINT = "#FBEAEA";

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "flex-start",
    background: BG_SECTION,
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  } as React.CSSProperties,

  sidebar: {
    width: "236px",
    flexShrink: 0,
    alignSelf: "flex-start",
    background: `linear-gradient(180deg, ${NAVY} 0%, ${NAVY_DEEP} 100%)`,
    display: "flex",
    flexDirection: "column",
    padding: "24px 18px",
    position: "sticky" as const,
    top: 0,
    height: "100vh",
    overflowY: "auto" as const,
  } as React.CSSProperties,

  sidebarLogoRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 8px",
    marginBottom: 30,
  } as React.CSSProperties,
  sidebarLogoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: `linear-gradient(150deg, ${TEAL}, ${NAVY})`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  } as React.CSSProperties,
  sidebarLogoTitle: {
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    fontSize: 16,
    fontWeight: 700,
    color: "#FFFFFF",
  } as React.CSSProperties,
  sidebarLogoSub: {
    fontSize: 9.5,
    letterSpacing: "0.08em",
    color: "rgba(255,255,255,0.45)",
    marginTop: 1,
  } as React.CSSProperties,

  navList: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
    flex: 1,
  } as React.CSSProperties,
  navItem: (active: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: 11,
    padding: "10px 12px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    fontSize: 13.5,
    fontWeight: active ? 600 : 500,
    background: active ? "rgba(14,140,140,0.22)" : "transparent",
    color: active ? "#FFFFFF" : "rgba(255,255,255,0.65)",
    textAlign: "left",
    transition: "background 0.15s ease",
  }),

  sidebarStatusCard: {
    marginTop: "auto",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10,
    padding: "12px 12px",
  } as React.CSSProperties,
  sidebarStatusRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 12,
    fontWeight: 600,
    color: "#FFFFFF",
  } as React.CSSProperties,
  sidebarStatusDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#3FD17B",
    boxShadow: "0 0 0 3px rgba(63,209,123,0.18)",
    flexShrink: 0,
  } as React.CSSProperties,
  sidebarStatusSub: {
    fontSize: 10.5,
    color: "rgba(255,255,255,0.45)",
    marginTop: 5,
    marginLeft: 15,
  } as React.CSSProperties,

  sidebarFooter: {
    borderTop: "1px solid rgba(255,255,255,0.12)",
    paddingTop: 16,
    marginTop: 12,
  } as React.CSSProperties,
  sidebarOfficerRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 8px",
    marginBottom: 12,
  } as React.CSSProperties,
  sidebarAvatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.12)",
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  } as React.CSSProperties,
  sidebarOfficerName: {
    fontSize: 12.5,
    fontWeight: 600,
    color: "#FFFFFF",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  } as React.CSSProperties,
  sidebarOfficerBadge: {
    fontSize: 11,
    color: "rgba(255,255,255,0.5)",
    marginTop: 1,
  } as React.CSSProperties,
  logoutBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 9,
    padding: "9px 12px",
    background: "rgba(255,255,255,0.06)",
    border: "none",
    borderRadius: 8,
    color: "rgba(255,255,255,0.8)",
    fontSize: 12.5,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
  } as React.CSSProperties,

  main: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
  } as React.CSSProperties,

  topbar: {
    background: "#FFFFFF",
    borderBottom: `1px solid ${BORDER}`,
    padding: "18px 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  } as React.CSSProperties,
  topbarTitle: {
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    fontSize: 18,
    fontWeight: 600,
    color: NAVY,
  } as React.CSSProperties,
  topbarSub: {
    fontSize: 12.5,
    color: TEXT,
    marginTop: 2,
  } as React.CSSProperties,
  officerChipRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  } as React.CSSProperties,
  langBtn: {
    background: "transparent",
    color: TEAL,
    border: `1px solid ${TEAL}`,
    borderRadius: 20,
    padding: "5px 12px",
    fontFamily: "'Inter', sans-serif",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
  } as React.CSSProperties,
  officerBadge: {
    fontSize: 11,
    padding: "4px 9px",
    background: TEAL_TINT,
    color: TEAL_DARK,
    borderRadius: 5,
    fontWeight: 600,
  } as React.CSSProperties,
  officerName: {
    fontSize: 13,
    color: "#374151",
    fontWeight: 500,
  } as React.CSSProperties,

  body: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 18,
    padding: "24px 32px 40px",
    overflowY: "auto",
    maxWidth: 980,
  } as React.CSSProperties,

  twoCol: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 18,
  } as React.CSSProperties,

  // ---- Cards ----
  card: {
    background: "#FFFFFF",
    border: `1px solid ${BORDER}`,
    borderRadius: 14,
    padding: "20px 22px",
  } as React.CSSProperties,
  cardHeadRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  } as React.CSSProperties,
  cardHeadIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    background: TEAL_TINT,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  } as React.CSSProperties,
  cardTitle: {
    fontSize: 14.5,
    fontWeight: 700,
    color: NAVY,
  } as React.CSSProperties,
  cardSub: {
    fontSize: 11.5,
    color: TEXT,
    marginTop: 1,
  } as React.CSSProperties,

  // ---- Profile section ----
  profileGrid: {
    display: "flex",
    gap: 20,
    alignItems: "flex-start",
    flexWrap: "wrap" as const,
  } as React.CSSProperties,
  profileAvatarCol: {
    flexShrink: 0,
  } as React.CSSProperties,
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: "50%",
    background: `linear-gradient(150deg, ${TEAL}, ${NAVY})`,
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as React.CSSProperties,
  fieldGrid: {
    flex: 1,
    minWidth: 260,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "14px 20px",
  } as React.CSSProperties,
  fieldLabel: {
    fontSize: 10.5,
    fontWeight: 700,
    color: MUTED,
    textTransform: "uppercase" as const,
    letterSpacing: "0.04em",
    marginBottom: 5,
  } as React.CSSProperties,
  fieldValue: {
    fontSize: 13.5,
    fontWeight: 600,
    color: NAVY,
  } as React.CSSProperties,
  fieldHint: {
    fontSize: 10.5,
    color: MUTED,
    marginTop: 3,
  } as React.CSSProperties,
  input: {
    width: "100%",
    fontFamily: "'Inter', sans-serif",
    fontSize: 13.5,
    fontWeight: 600,
    color: NAVY,
    padding: "8px 10px",
    borderRadius: 7,
    border: `1px solid ${BORDER}`,
    outline: "none",
  } as React.CSSProperties,

  // ---- Buttons ----
  primaryBtn: {
    background: TEAL,
    color: "#FFFFFF",
    border: "none",
    borderRadius: 8,
    padding: "8px 16px",
    fontFamily: "'Inter', sans-serif",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
  } as React.CSSProperties,
  secondaryBtn: {
    background: TEAL_TINT,
    color: TEAL_DARK,
    border: "none",
    borderRadius: 8,
    padding: "8px 16px",
    fontFamily: "'Inter', sans-serif",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
  } as React.CSSProperties,
  ghostBtn: {
    background: "transparent",
    color: TEXT,
    border: `1px solid ${BORDER}`,
    borderRadius: 8,
    padding: "8px 16px",
    fontFamily: "'Inter', sans-serif",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
  } as React.CSSProperties,

  // ---- Setting rows ----
  settingRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    padding: "12px 0",
  } as React.CSSProperties,
  settingDivider: {
    height: 1,
    background: BORDER,
  } as React.CSSProperties,
  settingLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: NAVY,
  } as React.CSSProperties,
  settingDesc: {
    fontSize: 11.5,
    color: TEXT,
    marginTop: 2,
  } as React.CSSProperties,
  settingStaticValue: {
    fontSize: 12.5,
    fontWeight: 600,
    color: TEXT,
  } as React.CSSProperties,

  langToggleGroup: {
    display: "flex",
    background: BG_SECTION,
    borderRadius: 999,
    padding: 3,
    gap: 2,
  } as React.CSSProperties,
  langOption: (active: boolean): React.CSSProperties => ({
    border: "none",
    borderRadius: 999,
    padding: "6px 14px",
    fontFamily: "'Inter', sans-serif",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    background: active ? TEAL : "transparent",
    color: active ? "#FFFFFF" : TEXT,
  }),

  statusPill: {
    fontSize: 11,
    fontWeight: 700,
    color: TEAL_DARK,
    background: TEAL_TINT,
    padding: "3px 10px",
    borderRadius: 999,
  } as React.CSSProperties,

  // ---- Toggle switch ----
  switchTrack: (on: boolean): React.CSSProperties => ({
    width: 40,
    height: 22,
    borderRadius: 999,
    border: "none",
    padding: 2,
    display: "flex",
    justifyContent: on ? "flex-end" : "flex-start",
    alignItems: "center",
    background: on ? TEAL : "#D5DCE1",
    cursor: "pointer",
    flexShrink: 0,
    transition: "background 0.15s ease",
  }),
  switchThumb: (_on: boolean): React.CSSProperties => ({
    width: 18,
    height: 18,
    borderRadius: "50%",
    background: "#FFFFFF",
    boxShadow: "0 1px 2px rgba(0,0,0,0.25)",
    transition: "transform 0.15s ease",
  }),

  aiNote: {
    marginTop: 14,
    fontSize: 11.5,
    color: TEAL_DARK,
    background: TEAL_TINT,
    padding: "10px 12px",
    borderRadius: 8,
    lineHeight: 1.5,
  } as React.CSSProperties,

  aboutGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 16,
  } as React.CSSProperties,

  // ---- Danger zone ----
  dangerCard: {
    background: RED_TINT,
    border: `1px solid #F0C9C9`,
    borderRadius: 14,
    padding: "18px 22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    flexWrap: "wrap" as const,
  } as React.CSSProperties,
  dangerTitle: {
    fontSize: 13.5,
    fontWeight: 700,
    color: RED,
  } as React.CSSProperties,
  dangerDesc: {
    fontSize: 11.5,
    color: "#8A4A4A",
    marginTop: 2,
  } as React.CSSProperties,
  dangerBtn: {
    background: RED,
    color: "#FFFFFF",
    border: "none",
    borderRadius: 8,
    padding: "9px 18px",
    fontFamily: "'Inter', sans-serif",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
  } as React.CSSProperties,
};
