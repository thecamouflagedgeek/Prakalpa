import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  FileText,
  Search,
  LifeBuoy,
  Phone,
  Settings as SettingsIcon,
  MessageSquare,
  ClipboardList,
  CheckCircle2,
  Clock,
  Globe2,
} from "lucide-react";
import i18next from "i18next";
import {
  initReactI18next,
  I18nextProvider,
  useTranslation,
} from "react-i18next";
import { useAuthStore } from "../store/authStore";

/* =========================================================
   JSON-BASED LOCALIZATION
========================================================= */

const resources = {
  en: {
    translation: {
      sidebar: {
        citizenPortal: "Citizen Portal",
        fileComplaint: "File a Complaint",
        trackStatus: "Track FIR Status",
        knowRights: "Know Your Rights",
        emergencyContacts: "Emergency Contacts",
        settings: "Settings",
        signOut: "Sign out",
      },

      header: {
        citizenPortal: "Citizen Portal",
        title: "Track FIR Status",
        subtitle: "Check progress on complaints filed by Form or Chat with AI",
        translate: "ಕನ್ನಡ",
      },

      lookup: {
        placeholder: "Enter your complaint reference, e.g. CMP-A1B2C3D4",
        searching: "Searching…",
        track: "Track",
      },

      status: {
        received: "Received",
        underReview: "Under Review",
        firFiled: "FIR Filed",
      },

      complaints: {
        title: "My Complaints",
        subtitle: "Everything you've filed, whether by form or AI chat",

        noComplaints: "You haven't filed any complaints yet.",

        selectComplaint:
          "Enter a complaint reference above, or pick one of your complaints below.",

        complaintReference: "Complaint Reference",
        incidentType: "Incident Type",
        date: "Date",
        location: "Location",
        assignedOfficer: "Assigned Officer",
        notYetAssigned: "Not yet assigned",
        description: "Description",
        aiCollectedInformation: "AI-collected information",
        firNumber: "FIR Number",
        incident: "Incident",
        filedViaChat: "Filed via Chat with AI",
        filedViaForm: "Filed via Form",
      },

      errors: {
        backend: "Backend is not reachable. Please try again shortly.",

        notFound: "No complaint found with that reference number.",

        somethingWrong: "Something went wrong looking up this complaint.",

        requestFailed: "Request failed",
      },

      loading: {
        complaints: "Loading your complaints…",
      },

      common: {
        empty: "—",
      },
    },
  },

  kn: {
    translation: {
      sidebar: {
        citizenPortal: "ನಾಗರಿಕ ಪೋರ್ಟಲ್",
        fileComplaint: "ದೂರು ದಾಖಲಿಸಿ",
        trackStatus: "FIR ಸ್ಥಿತಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
        knowRights: "ನಿಮ್ಮ ಹಕ್ಕುಗಳನ್ನು ತಿಳಿಯಿರಿ",
        emergencyContacts: "ತುರ್ತು ಸಂಪರ್ಕಗಳು",
        settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
        signOut: "ಸೈನ್ ಔಟ್",
      },

      header: {
        citizenPortal: "ನಾಗರಿಕ ಪೋರ್ಟಲ್",
        title: "FIR ಸ್ಥಿತಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
        subtitle:
          "ಫಾರ್ಮ್ ಅಥವಾ AI ಚಾಟ್ ಮೂಲಕ ದಾಖಲಿಸಿದ ದೂರುಗಳ ಪ್ರಗತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ",
        translate: "English",
      },

      lookup: {
        placeholder: "ನಿಮ್ಮ ದೂರು ಉಲ್ಲೇಖ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ, ಉದಾ. CMP-A1B2C3D4",

        searching: "ಹುಡುಕಲಾಗುತ್ತಿದೆ…",
        track: "ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
      },

      status: {
        received: "ಸ್ವೀಕರಿಸಲಾಗಿದೆ",
        underReview: "ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ",
        firFiled: "FIR ದಾಖಲಿಸಲಾಗಿದೆ",
      },

      complaints: {
        title: "ನನ್ನ ದೂರುಗಳು",

        subtitle: "ಫಾರ್ಮ್ ಅಥವಾ AI ಚಾಟ್ ಮೂಲಕ ನೀವು ದಾಖಲಿಸಿದ ಎಲ್ಲಾ ದೂರುಗಳು",

        noComplaints: "ನೀವು ಇನ್ನೂ ಯಾವುದೇ ದೂರುಗಳನ್ನು ದಾಖಲಿಸಿಲ್ಲ.",

        selectComplaint:
          "ಮೇಲಿನ ದೂರು ಉಲ್ಲೇಖ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ ಅಥವಾ ಕೆಳಗಿನ ನಿಮ್ಮ ದೂರುಗಳಲ್ಲಿ ಒಂದನ್ನು ಆಯ್ಕೆಮಾಡಿ.",

        complaintReference: "ದೂರು ಉಲ್ಲೇಖ",
        incidentType: "ಘಟನೆಯ ಪ್ರಕಾರ",
        date: "ದಿನಾಂಕ",
        location: "ಸ್ಥಳ",
        assignedOfficer: "ನಿಯೋಜಿತ ಅಧಿಕಾರಿ",
        notYetAssigned: "ಇನ್ನೂ ನಿಯೋಜಿಸಲಾಗಿಲ್ಲ",
        description: "ವಿವರಣೆ",
        aiCollectedInformation: "AI ಸಂಗ್ರಹಿಸಿದ ಮಾಹಿತಿ",
        firNumber: "FIR ಸಂಖ್ಯೆ",
        incident: "ಘಟನೆ",
        filedViaChat: "AI ಚಾಟ್ ಮೂಲಕ ದಾಖಲಿಸಲಾಗಿದೆ",
        filedViaForm: "ಫಾರ್ಮ್ ಮೂಲಕ ದಾಖಲಿಸಲಾಗಿದೆ",
      },

      errors: {
        backend:
          "ಬ್ಯಾಕೆಂಡ್ ಸಂಪರ್ಕಿಸಲಾಗುತ್ತಿಲ್ಲ. ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",

        notFound: "ಈ ಉಲ್ಲೇಖ ಸಂಖ್ಯೆಯೊಂದಿಗೆ ಯಾವುದೇ ದೂರು ಕಂಡುಬಂದಿಲ್ಲ.",

        somethingWrong: "ಈ ದೂರುವನ್ನು ಹುಡುಕುವಾಗ ಏನೋ ತಪ್ಪಾಗಿದೆ.",

        requestFailed: "ವಿನಂತಿ ವಿಫಲವಾಗಿದೆ",
      },

      loading: {
        complaints: "ನಿಮ್ಮ ದೂರುಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ…",
      },

      common: {
        empty: "—",
      },
    },
  },
};

/* =========================================================
   I18N INSTANCE

   IMPORTANT:
   initImmediate: false ensures that translations are
   ready before the first React render.

   FIX: every useTranslation() call below is bound to this
   exact instance via `{ i18n: i18nInstance }`. Previously,
   useTranslation() relied purely on React context from
   <I18nextProvider>. If this component (or a sub-component
   like ModeBadge/StatusBadge/etc.) ever renders outside that
   provider's tree — e.g. because the page imports the raw
   `TrackFIRStatus` export instead of the default
   `TrackFIRStatusLocalized`, or gets rendered inside another
   layout/provider — react-i18next silently falls back to the
   global default i18next singleton, which has none of these
   resources loaded. That fallback instance has no keys, so
   t("sidebar.citizenPortal") just returns the literal key
   string "sidebar.citizenPortal" — exactly the bug you saw.

   Binding directly to i18nInstance makes every t() call work
   correctly no matter how/where the component tree is mounted.
========================================================= */

const i18nInstance = i18next.createInstance();

i18nInstance.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  defaultNS: "translation",
  ns: ["translation"],
  keySeparator: ".",
  nsSeparator: false,
  interpolation: {
    escapeValue: false,
  },
  initImmediate: false,
});

/* =========================================================
   CONSTANTS
========================================================= */

const API_BASE = "http://localhost:8000/api/v1";

/* =========================================================
   TYPES
========================================================= */

interface Complaint {
  complaint_id: string;
  citizen_username?: string;
  citizen_name: string;
  complainant_name?: string;
  victim_name?: string;
  mode: string;
  incident_type?: string;
  incident_date?: string;
  incident_time?: string;
  incident_location?: string;
  incident_description?: string;
  status: string;
  submitted_at: string;
  assigned_officer?: string | null;
  fir_number?: string | null;
  chat_session_id?: string | null;
  chat_collected_data?: Record<string, unknown> | null;
}

/* =========================================================
   STATUS STEPS
========================================================= */

const STATUS_STEPS = [
  {
    key: "PENDING",
    labelKey: "status.received",
  },
  {
    key: "UNDER_REVIEW",
    labelKey: "status.underReview",
  },
  {
    key: "FIR_FILED",
    labelKey: "status.firFiled",
  },
];

function statusIndex(status: string): number {
  const idx = STATUS_STEPS.findIndex(
    (s) => s.key === (status || "").toUpperCase(),
  );

  return idx === -1 ? 0 : idx;
}

/* =========================================================
   ERROR HANDLING
========================================================= */

function describeError(err: unknown, t: (key: string) => string): string {
  if (axios.isAxiosError(err)) {
    if (err.code === "ERR_NETWORK") {
      return t("errors.backend");
    }

    const detail = err.response?.data?.detail;

    if (typeof detail === "string") {
      return detail;
    }

    if (err.response?.status === 404) {
      return t("errors.notFound");
    }

    if (err.response?.status) {
      return `${t("errors.requestFailed")} (${err.response.status})`;
    }
  }

  return t("errors.somethingWrong");
}

/* =========================================================
   DATE FORMAT
========================================================= */

function formatDateTime(iso: string, language: "en" | "kn"): string {
  if (!iso) return "—";

  const d = new Date(iso);

  if (isNaN(d.getTime())) return iso;

  return d.toLocaleString(language === "kn" ? "kn-IN" : "en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

function TrackFIRStatus() {
  const { t, i18n: currentI18n } = useTranslation("translation", {
    i18n: i18nInstance,
  });

  const { user, logout } = useAuthStore();

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const [language, setLanguage] = useState<"en" | "kn">(
    currentI18n.language === "kn" ? "kn" : "en",
  );

  const [lookupId, setLookupId] = useState(searchParams.get("id") || "");

  const [selected, setSelected] = useState<Complaint | null>(null);

  const [lookupLoading, setLookupLoading] = useState(false);

  const [lookupError, setLookupError] = useState<string | null>(null);

  const [myComplaints, setMyComplaints] = useState<Complaint[]>([]);

  const [listLoading, setListLoading] = useState(true);

  const [listError, setListError] = useState<string | null>(null);

  /* =========================================================
     LANGUAGE TOGGLE
  ========================================================= */

  const toggleLanguage = async () => {
    const nextLanguage = language === "en" ? "kn" : "en";

    await currentI18n.changeLanguage(nextLanguage);

    setLanguage(nextLanguage);
  };

  /* =========================================================
     LOAD CITIZEN COMPLAINTS
  ========================================================= */

  useEffect(() => {
    setListLoading(true);

    axios
      .get<Complaint[]>(`${API_BASE}/complaints/all`)
      .then((res) => {
        const mine = (res.data || []).filter(
          (c) => c.citizen_username === user?.username,
        );

        mine.sort((a, b) =>
          (b.submitted_at || "").localeCompare(a.submitted_at || ""),
        );

        setMyComplaints(mine);
      })
      .catch((err) => setListError(describeError(err, t)))
      .finally(() => setListLoading(false));
  }, [user?.username, t]);

  /* =========================================================
     DEEP-LINK SUPPORT
  ========================================================= */

  useEffect(() => {
    const id = searchParams.get("id");

    if (id) {
      runLookup(id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =========================================================
     LOOKUP
  ========================================================= */

  const runLookup = (idOverride?: string) => {
    const id = (idOverride ?? lookupId).trim();

    if (!id) return;

    setLookupLoading(true);

    setLookupError(null);

    setSelected(null);

    axios
      .get<Complaint>(`${API_BASE}/complaints/${encodeURIComponent(id)}`)
      .then((res) => {
        setSelected(res.data);

        setSearchParams({ id });
      })
      .catch((err) => setLookupError(describeError(err, t)))
      .finally(() => setLookupLoading(false));
  };

  /* =========================================================
     SELECT FROM LIST
  ========================================================= */

  const selectFromList = (c: Complaint) => {
    setSelected(c);

    setLookupId(c.complaint_id);

    setLookupError(null);

    setSearchParams({
      id: c.complaint_id,
    });
  };

  /* =========================================================
     NAVIGATION ITEMS
  ========================================================= */

  const navItems = [
    {
      key: "complaint",
      label: t("sidebar.fileComplaint"),
      icon: FileText,
      path: "/citizen",
    },
    {
      key: "track",
      label: t("sidebar.trackStatus"),
      icon: Search,
      path: "/track",
    },
    {
      key: "information",
      label: t("sidebar.knowRights"),
      icon: LifeBuoy,
      path: "/right",
    },
    {
      key: "emergency",
      label: t("sidebar.emergencyContacts"),
      icon: Phone,
      path: "/emergency",
    },
    {
      key: "settings",
      label: t("sidebar.settings"),
      icon: SettingsIcon,
      path: "/settings",
    },
  ];

  const S = styles;

  return (
    <div style={S.page}>
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside style={S.sidebar}>
        <div style={S.sidebarLogoRow}>
          <div style={S.sidebarLogoIcon}>
            <ShieldIcon size={18} color="#FFFFFF" />
          </div>

          <div>
            <div style={S.sidebarLogoTitle}>KAVACH</div>

            <div style={S.sidebarLogoSub}>{t("sidebar.citizenPortal")}</div>
          </div>
        </div>

        <nav style={S.navList}>
          {navItems.map((item) => {
            const Icon = item.icon;

            const active = item.key === "track";

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => navigate(item.path)}
                style={S.navItem(active)}
              >
                <Icon
                  size={16}
                  color={active ? "#FFFFFF" : "rgba(255,255,255,0.6)"}
                />

                {item.label}
              </button>
            );
          })}
        </nav>

        <div style={S.sidebarFooter}>
          <div style={S.sidebarUserRow}>
            <div style={S.sidebarAvatar}>
              {(user?.name || "C").charAt(0).toUpperCase()}
            </div>

            <div
              style={{
                minWidth: 0,
              }}
            >
              <div style={S.sidebarUserName}>{user?.name || "Citizen"}</div>

              <div style={S.sidebarUserMeta}>{user?.username}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/");
            }}
            style={S.sidebarLogoutBtn}
          >
            {t("sidebar.signOut")}
          </button>
        </div>
      </aside>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div style={S.main}>
        {/* =================================================
            TOPBAR
        ================================================= */}

        <div style={S.topbar}>
          <div>
            <div style={S.topbarEyebrow}>{t("header.citizenPortal")}</div>

            <div style={S.topbarTitle}>{t("header.title")}</div>

            <div style={S.topbarSub}>{t("header.subtitle")}</div>
          </div>

          <button type="button" onClick={toggleLanguage} style={S.translateBtn}>
            <Globe2 size={15} />

            {t("header.translate")}
          </button>
        </div>

        {/* =================================================
            BODY
        ================================================= */}

        <div style={S.body}>
          {/* =================================================
              LOOKUP BAR
          ================================================= */}

          <div style={S.lookupBar}>
            <input
              style={S.lookupInput}
              placeholder={t("lookup.placeholder")}
              value={lookupId}
              onChange={(e) => setLookupId(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  runLookup();
                }
              }}
            />

            <button
              style={S.primaryBtn}
              onClick={() => runLookup()}
              disabled={!lookupId.trim() || lookupLoading}
            >
              {lookupLoading ? t("lookup.searching") : t("lookup.track")}
            </button>
          </div>

          {lookupError && <div style={S.errorBox}>{lookupError}</div>}

          {/* =================================================
              DETAIL PANEL
          ================================================= */}

          {selected && <ComplaintDetail complaint={selected} />}

          {!selected && !lookupError && !lookupLoading && (
            <div style={S.emptyState}>{t("complaints.selectComplaint")}</div>
          )}

          {/* =================================================
              MY COMPLAINTS LIST
          ================================================= */}

          <div style={S.panel}>
            <div style={S.panelTitle}>{t("complaints.title")}</div>

            <div style={S.panelSubtitle}>{t("complaints.subtitle")}</div>

            <div
              style={{
                marginTop: 14,
              }}
            >
              {listLoading && (
                <div style={S.loadingState}>{t("loading.complaints")}</div>
              )}

              {listError && <div style={S.errorBox}>{listError}</div>}

              {!listLoading && !listError && myComplaints.length === 0 && (
                <div style={S.emptyState}>{t("complaints.noComplaints")}</div>
              )}

              {!listLoading && !listError && myComplaints.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {myComplaints.map((c) => (
                    <button
                      key={c.complaint_id}
                      onClick={() => selectFromList(c)}
                      style={S.listRow(
                        selected?.complaint_id === c.complaint_id,
                      )}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          minWidth: 0,
                        }}
                      >
                        <ModeBadge mode={c.mode} />

                        <div
                          style={{
                            minWidth: 0,
                          }}
                        >
                          <div style={S.listRowId}>{c.complaint_id}</div>

                          <div style={S.listRowMeta}>
                            {c.incident_type || t("complaints.incident")}

                            {" · "}

                            {formatDateTime(c.submitted_at, language)}
                          </div>
                        </div>
                      </div>

                      <StatusBadge status={c.status} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MODE BADGE
========================================================= */

function ModeBadge({ mode }: { mode: string }) {
  const { t } = useTranslation("translation", { i18n: i18nInstance });

  const isChat = (mode || "").toLowerCase() === "chat";

  const Icon = isChat ? MessageSquare : ClipboardList;

  return (
    <div
      style={{
        width: 30,
        height: 30,
        borderRadius: 8,
        background: TEAL_TINT,
        color: TEAL_DARK,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
      title={
        isChat ? t("complaints.filedViaChat") : t("complaints.filedViaForm")
      }
    >
      <Icon size={14} />
    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation("translation", { i18n: i18nInstance });

  const idx = statusIndex(status);

  const color = idx === 2 ? "#1F7A5C" : idx === 1 ? TEAL_DARK : "#8A97A3";

  const bg = idx === 2 ? "#E5F6EC" : idx === 1 ? TEAL_TINT : BG_SECTION;

  const statusLabel = STATUS_STEPS[idx].labelKey;

  return (
    <span
      style={{
        fontSize: 10.5,
        fontWeight: 700,
        color,
        background: bg,
        padding: "4px 10px",
        borderRadius: 20,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        whiteSpace: "nowrap",
      }}
    >
      {t(statusLabel)}
    </span>
  );
}

/* =========================================================
   STATUS TIMELINE
========================================================= */

function StatusTimeline({ status }: { status: string }) {
  const { t } = useTranslation("translation", { i18n: i18nInstance });

  const idx = statusIndex(status);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        margin: "18px 0 4px",
      }}
    >
      {STATUS_STEPS.map((step, i) => (
        <div
          key={step.key}
          style={{
            display: "flex",
            alignItems: "center",
            flex: i < STATUS_STEPS.length - 1 ? 1 : undefined,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: i <= idx ? TEAL : "#FFFFFF",
                border: `2px solid ${i <= idx ? TEAL : BORDER}`,
                color: i <= idx ? "#FFFFFF" : "#8A97A3",
              }}
            >
              {i < idx ? (
                <CheckCircle2 size={15} />
              ) : i === idx ? (
                <Clock size={14} />
              ) : null}
            </div>

            <span
              style={{
                fontSize: 10.5,
                fontWeight: 600,
                color: i <= idx ? NAVY : "#8A97A3",
                whiteSpace: "nowrap",
              }}
            >
              {t(step.labelKey)}
            </span>
          </div>

          {i < STATUS_STEPS.length - 1 && (
            <div
              style={{
                flex: 1,
                height: 2,
                background: i < idx ? TEAL : BORDER,
                margin: "0 8px 18px",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   COMPLAINT DETAIL
========================================================= */

function ComplaintDetail({ complaint: c }: { complaint: Complaint }) {
  const { t, i18n: currentI18n } = useTranslation("translation", {
    i18n: i18nInstance,
  });

  const language = currentI18n.language === "kn" ? "kn" : "en";

  return (
    <div style={styles.panel}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={styles.panelSubtitle}>
            {t("complaints.complaintReference")}
          </div>

          <div
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 20,
              fontWeight: 700,
              color: NAVY,
            }}
          >
            {c.complaint_id}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <ModeBadge mode={c.mode} />

          <StatusBadge status={c.status} />
        </div>
      </div>

      <StatusTimeline status={c.status} />

      {c.fir_number && (
        <div
          style={{
            marginTop: 10,
            padding: "10px 14px",
            background: "#E5F6EC",
            border: "1px solid #9FE1CB",
            borderRadius: 8,
            fontSize: 13,
            color: "#1F7A5C",
            fontWeight: 600,
          }}
        >
          {t("complaints.firNumber")}

          {": "}

          {c.fir_number}
        </div>
      )}

      <div style={styles.detailGrid}>
        <DetailCell
          label={t("complaints.incidentType")}
          value={c.incident_type}
        />

        <DetailCell label={t("complaints.date")} value={c.incident_date} />

        <DetailCell
          label={t("complaints.location")}
          value={c.incident_location}
        />

        <DetailCell
          label={t("complaints.assignedOfficer")}
          value={c.assigned_officer || t("complaints.notYetAssigned")}
        />
      </div>

      {c.incident_description && (
        <div
          style={{
            marginTop: 14,
          }}
        >
          <div style={styles.panelSubtitle}>{t("complaints.description")}</div>

          <p
            style={{
              fontSize: 13,
              lineHeight: 1.7,
              color: TEXT,
              margin: "6px 0 0",
            }}
          >
            {c.incident_description}
          </p>
        </div>
      )}

      {c.mode?.toLowerCase() === "chat" &&
        c.chat_collected_data &&
        Object.keys(c.chat_collected_data).length > 0 && (
          <details
            style={{
              marginTop: 16,
            }}
          >
            <summary
              style={{
                fontSize: 11.5,
                color: TEAL_DARK,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {t("complaints.aiCollectedInformation")}
            </summary>

            <div style={styles.kvGrid}>
              {Object.entries(c.chat_collected_data).map(([k, v]) => (
                <div key={k} style={styles.kvCell}>
                  <div style={styles.kvLabel}>{k.replace(/_/g, " ")}</div>

                  <div style={styles.kvValue}>
                    {v === null || v === undefined
                      ? t("common.empty")
                      : String(v)}
                  </div>
                </div>
              ))}
            </div>
          </details>
        )}
    </div>
  );
}

/* =========================================================
   DETAIL CELL
========================================================= */

function DetailCell({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  const { t } = useTranslation("translation", { i18n: i18nInstance });

  return (
    <div style={styles.detailCell}>
      <div style={styles.detailLabel}>{label}</div>

      <div style={styles.detailValue}>{value || t("common.empty")}</div>
    </div>
  );
}

/* =========================================================
   SHIELD ICON
========================================================= */

function ShieldIcon({
  size = 20,
  color = "#FFFFFF",
}: {
  size?: number;
  color?: string;
}) {
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

/* =========================================================
   DESIGN TOKENS
========================================================= */

const NAVY = "#152A43";
const NAVY_DEEP = "#0E2438";
const TEAL = "#0E8C8C";
const TEAL_DARK = "#0A6E6E";
const TEAL_TINT = "#E1F5F5";
const BORDER = "#E3E9EC";
const BG_SECTION = "#EAF2F5";
const TEXT = "#5B6B7A";
const MUTED = "#8A97A3";

/* =========================================================
   STYLES
========================================================= */

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    background: BG_SECTION,
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  } as React.CSSProperties,

  sidebar: {
    width: "236px",
    flexShrink: 0,
    background: `linear-gradient(180deg, ${NAVY} 0%, ${NAVY_DEEP} 100%)`,
    display: "flex",
    flexDirection: "column",
    padding: "24px 18px",
    position: "sticky" as const,
    top: 0,
    height: "100vh",
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
    textTransform: "uppercase" as const,
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
  }),

  sidebarFooter: {
    borderTop: "1px solid rgba(255,255,255,0.12)",
    paddingTop: 16,
    marginTop: 12,
  } as React.CSSProperties,

  sidebarUserRow: {
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

  sidebarUserName: {
    fontSize: 12.5,
    fontWeight: 600,
    color: "#FFFFFF",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  } as React.CSSProperties,

  sidebarUserMeta: {
    fontSize: 11,
    color: "rgba(255,255,255,0.5)",
    marginTop: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  } as React.CSSProperties,

  sidebarLogoutBtn: {
    width: "100%",
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
    gap: 20,
  } as React.CSSProperties,

  topbarEyebrow: {
    fontSize: 10,
    fontWeight: 700,
    color: TEAL_DARK,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    marginBottom: 4,
  } as React.CSSProperties,

  topbarTitle: {
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    fontSize: 20,
    fontWeight: 700,
    color: NAVY,
  } as React.CSSProperties,

  topbarSub: {
    fontSize: 12.5,
    color: TEXT,
    marginTop: 3,
  } as React.CSSProperties,

  translateBtn: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    padding: "9px 15px",
    borderRadius: 20,
    border: `1px solid ${TEAL}`,
    background: TEAL_TINT,
    color: TEAL_DARK,
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    whiteSpace: "nowrap",
  } as React.CSSProperties,

  body: {
    flex: 1,
    overflowY: "auto",
    padding: "24px 32px 60px",
    display: "flex",
    flexDirection: "column",
    gap: 18,
    maxWidth: 860,
    width: "100%",
    margin: "0 auto",
    boxSizing: "border-box",
  } as React.CSSProperties,

  lookupBar: {
    display: "flex",
    gap: 10,
  } as React.CSSProperties,

  lookupInput: {
    flex: 1,
    padding: "12px 14px",
    borderRadius: 8,
    border: `1px solid ${BORDER}`,
    fontSize: 13,
    fontFamily: "'Inter', sans-serif",
    color: NAVY,
    background: "#FFFFFF",
  } as React.CSSProperties,

  primaryBtn: {
    padding: "12px 20px",
    borderRadius: 8,
    border: "none",
    background: TEAL,
    color: "#FFFFFF",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    whiteSpace: "nowrap",
  } as React.CSSProperties,

  emptyState: {
    padding: "16px",
    textAlign: "center" as const,
    color: MUTED,
    fontSize: 12.5,
    background: "#FFFFFF",
    border: `1px dashed ${BORDER}`,
    borderRadius: 10,
  } as React.CSSProperties,

  loadingState: {
    padding: "16px",
    textAlign: "center" as const,
    color: MUTED,
    fontSize: 12.5,
  } as React.CSSProperties,

  errorBox: {
    padding: "12px 14px",
    background: "#FBEBEA",
    color: "#C94B4B",
    fontSize: 12,
    lineHeight: 1.5,
    borderRadius: 8,
  } as React.CSSProperties,

  panel: {
    background: "#FFFFFF",
    border: `1px solid ${BORDER}`,
    borderRadius: 14,
    padding: 20,
  } as React.CSSProperties,

  panelTitle: {
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    fontSize: 14,
    fontWeight: 700,
    color: NAVY,
  } as React.CSSProperties,

  panelSubtitle: {
    fontSize: 11,
    color: MUTED,
    marginTop: 2,
    textTransform: "uppercase" as const,
    letterSpacing: "0.04em",
  } as React.CSSProperties,

  detailGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 10,
    marginTop: 16,
  } as React.CSSProperties,

  detailCell: {
    background: BG_SECTION,
    border: `1px solid ${BORDER}`,
    borderRadius: 8,
    padding: "10px 12px",
  } as React.CSSProperties,

  detailLabel: {
    fontSize: 9.5,
    color: MUTED,
    textTransform: "uppercase" as const,
    letterSpacing: "0.04em",
    marginBottom: 3,
  } as React.CSSProperties,

  detailValue: {
    fontSize: 13,
    fontWeight: 600,
    color: NAVY,
  } as React.CSSProperties,

  kvGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: 8,
    marginTop: 10,
  } as React.CSSProperties,

  kvCell: {
    background: BG_SECTION,
    border: `1px solid ${BORDER}`,
    borderRadius: 7,
    padding: "8px 10px",
  } as React.CSSProperties,

  kvLabel: {
    fontSize: 9,
    color: MUTED,
    textTransform: "capitalize" as const,
    marginBottom: 2,
  } as React.CSSProperties,

  kvValue: {
    fontSize: 12,
    fontWeight: 600,
    color: NAVY,
    wordBreak: "break-word" as const,
  } as React.CSSProperties,

  listRow: (active: boolean): React.CSSProperties => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    padding: "12px 14px",
    borderRadius: 10,
    border: `1px solid ${active ? TEAL : BORDER}`,
    background: active ? TEAL_TINT : BG_SECTION,
    cursor: "pointer",
    fontFamily: "inherit",
    textAlign: "left",
    width: "100%",
  }),

  listRowId: {
    fontSize: 12.5,
    fontWeight: 700,
    color: NAVY,
  } as React.CSSProperties,

  listRowMeta: {
    fontSize: 11,
    color: TEXT,
    marginTop: 1,
  } as React.CSSProperties,
};

/* =========================================================
   I18N PROVIDER EXPORT
========================================================= */

export function TrackFIRStatusLocalized() {
  return (
    <I18nextProvider i18n={i18nInstance}>
      <TrackFIRStatus />
    </I18nextProvider>
  );
}

export default TrackFIRStatusLocalized;
