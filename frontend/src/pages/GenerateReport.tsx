// GenerateReport.tsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import { useAuthStore } from "../store/authStore";

const API_BASE = "http://localhost:8000/api/v1";

// ---------- Types ----------

interface Complaint {
  complaint_id: string;
  citizen_name: string;
  complainant_name?: string;
  victim_name?: string;
  incident_type?: string;
  incident_date?: string;
  incident_time?: string;
  incident_location?: string;
  incident_description?: string;
  accused_description?: string;
  witnesses?: string;
  evidence?: string;
  contact_number?: string;
  address?: string;
  status: string;
  fir_number?: string | null;
  assigned_officer?: string | null;
  submitted_at: string;
}

interface ReportSection {
  id: string;
  heading: string;
  content: string;
}

interface ReportType {
  id: string;
  title: string;
  kannadaTitle: string;
  formCode: string;
  description: string;
}

type Step = "select-format" | "select-case" | "review";

// ---------- KSP Report Formats ----------

const REPORT_TYPES: ReportType[] = [
  {
    id: "fir",
    title: "First Information Report",
    kannadaTitle: "ಪ್ರಥಮ ಮಾಹಿತಿ ವರದಿ",
    formCode: "FIR — Form 1 (CrPC/BNSS)",
    description:
      "Initial report recording the complaint and cognizable offence details.",
  },
  {
    id: "case_diary",
    title: "Case Diary (CD)",
    kannadaTitle: "ಪ್ರಕರಣ ದಿನಚರಿ",
    formCode: "CD — Investigation Diary",
    description: "Chronological record of investigation steps taken by the IO.",
  },
  {
    id: "panchnama",
    title: "Panchnama",
    kannadaTitle: "ಪಂಚನಾಮೆ",
    formCode: "Panchnama — Scene/Recovery Record",
    description:
      "Witnessed record of scene observations or recovery of articles.",
  },
  {
    id: "inquest",
    title: "Inquest Report",
    kannadaTitle: "ಮರಣೋತ್ತರ ವಿಚಾರಣಾ ವರದಿ",
    formCode: "Inquest — Sec 174 CrPC/BNSS",
    description:
      "Report on cause and circumstances of death in unnatural death cases.",
  },
  {
    id: "seizure_memo",
    title: "Seizure Memo",
    kannadaTitle: "ವಶಪಡಿಸಿಕೊಳ್ಳುವ ಜ್ಞಾಪನಾ ಪತ್ರ",
    formCode: "Seizure Memo — Property/Evidence",
    description: "Record of articles or property seized during investigation.",
  },
  {
    id: "missing_person",
    title: "Missing Person Report",
    kannadaTitle: "ಕಾಣೆಯಾದ ವ್ಯಕ್ತಿ ವರದಿ",
    formCode: "MPR — Missing Person",
    description:
      "Report filed for a missing individual with description and last-seen details.",
  },
  {
    id: "accident_report",
    title: "Accident Report",
    kannadaTitle: "ಅಪಘಾತ ವರದಿ",
    formCode: "MVA Report — Motor Vehicle Accident",
    description:
      "Report on a road traffic accident, vehicles, injuries, and damages.",
  },
];

// ---------- Template generator (no AI, direct field fill) ----------

function generateReportSections(
  reportTypeId: string,
  c: Complaint,
): ReportSection[] {
  const name = c.complainant_name || c.citizen_name || "Not provided";
  const victim = c.victim_name || name;
  const base: ReportSection[] = [
    {
      id: "case_ref",
      heading: "Case Reference",
      content: `Complaint ID: ${c.complaint_id}\nFIR Number: ${c.fir_number || "Not yet assigned"}\nStatus: ${c.status}\nDate Submitted: ${new Date(c.submitted_at).toLocaleString()}`,
    },
    {
      id: "parties",
      heading: "Parties Involved",
      content: `Complainant: ${name}\nContact Number: ${c.contact_number || "Not provided"}\nAddress: ${c.address || "Not provided"}\nAccused (if known): ${c.accused_description || "Unknown"}`,
    },
    {
      id: "incident",
      heading: "Incident Details",
      content: `Type of Incident: ${c.incident_type || "Not specified"}\nDate & Time: ${c.incident_date || "Unknown"} ${c.incident_time || ""}\nLocation: ${c.incident_location || "Not specified"}\n\nDescription:\n${c.incident_description || "Not provided"}`,
    },
    {
      id: "evidence",
      heading: "Witnesses & Evidence",
      content: `Witnesses: ${c.witnesses || "None recorded"}\nEvidence: ${c.evidence || "None recorded"}`,
    },
  ];

  switch (reportTypeId) {
    case "inquest":
      return [
        base[0],
        {
          id: "deceased",
          heading: "Deceased / Victim Details",
          content: `Name: ${victim}\nAddress: ${c.address || "Not provided"}`,
        },
        base[2],
        {
          id: "inquest_findings",
          heading: "Inquest Findings",
          content:
            "[Enter cause of death, apparent injuries, and inquest committee observations here.]",
        },
        base[3],
      ];
    case "seizure_memo":
      return [
        base[0],
        base[1],
        {
          id: "seized_items",
          heading: "Articles Seized",
          content:
            c.evidence ||
            "[List seized articles with description, quantity, and identifying marks.]",
        },
        {
          id: "seizure_circumstances",
          heading: "Circumstances of Seizure",
          content: `Location: ${c.incident_location || "Not specified"}\nDate & Time: ${c.incident_date || "Unknown"} ${c.incident_time || ""}\n\n[Describe how and where the articles were found/seized, in presence of panch witnesses.]`,
        },
      ];
    case "missing_person":
      return [
        base[0],
        {
          id: "missing_details",
          heading: "Missing Person Details",
          content: `Name: ${victim}\nLast Seen Location: ${c.incident_location || "Not specified"}\nLast Seen Date & Time: ${c.incident_date || "Unknown"} ${c.incident_time || ""}\nDescription: ${c.accused_description || "[Physical description not captured — add manually]"}`,
        },
        {
          id: "reporter",
          heading: "Reported By",
          content: `Name: ${name}\nContact Number: ${c.contact_number || "Not provided"}\nRelation to Missing Person: [Enter relation]`,
        },
        base[3],
      ];
    case "accident_report":
      return [
        base[0],
        {
          id: "accident_details",
          heading: "Accident Details",
          content: `Date & Time: ${c.incident_date || "Unknown"} ${c.incident_time || ""}\nLocation: ${c.incident_location || "Not specified"}\n\nDescription:\n${c.incident_description || "Not provided"}`,
        },
        {
          id: "vehicles_injuries",
          heading: "Vehicles & Injuries",
          content:
            "[Enter vehicle registration numbers, drivers, and injury/damage details.]",
        },
        base[3],
      ];
    case "panchnama":
      return [
        base[0],
        {
          id: "panch_witnesses",
          heading: "Panch Witnesses",
          content:
            c.witnesses ||
            "[Enter names and addresses of panch witnesses present.]",
        },
        {
          id: "observations",
          heading: "Scene Observations",
          content: `Location: ${c.incident_location || "Not specified"}\nDate & Time: ${c.incident_date || "Unknown"} ${c.incident_time || ""}\n\n${c.incident_description || "[Describe scene observations in detail.]"}`,
        },
        base[3],
      ];
    case "case_diary":
      return [
        base[0],
        base[1],
        {
          id: "investigation_log",
          heading: "Investigation Steps Taken",
          content:
            "[Chronological log — date-wise entries of steps taken by the Investigating Officer.]",
        },
        base[3],
      ];
    case "fir":
    default:
      return base;
  }
}

// ---------- Component ----------

export default function GenerateReport() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("select-format");
  const [selectedType, setSelectedType] = useState<ReportType | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loadingCases, setLoadingCases] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCase, setSelectedCase] = useState<Complaint | null>(null);
  const [sections, setSections] = useState<ReportSection[]>([]);
  const [approved, setApproved] = useState(false);
  const [confirmChecked, setConfirmChecked] = useState(false);

  const officerName = user?.name || "Unknown Officer";
  const officerBadge = user?.badge || "";

  useEffect(() => {
    if (step !== "select-case") return;
    setLoadingCases(true);
    axios
      .get(`${API_BASE}/complaints/all`)
      .then((res) => setComplaints(res.data))
      .catch((err) => console.error("Failed to load complaints:", err))
      .finally(() => setLoadingCases(false));
  }, [step]);

  const filteredComplaints = useMemo(() => {
    if (!search.trim()) return complaints;
    const q = search.toLowerCase();
    return complaints.filter(
      (c) =>
        c.complaint_id.toLowerCase().includes(q) ||
        (c.citizen_name || "").toLowerCase().includes(q) ||
        (c.incident_type || "").toLowerCase().includes(q),
    );
  }, [complaints, search]);

  const handleSelectFormat = (type: ReportType) => {
    setSelectedType(type);
    setStep("select-case");
  };

  const handleSelectCase = (complaint: Complaint) => {
    if (!selectedType) return;
    setSelectedCase(complaint);
    setSections(generateReportSections(selectedType.id, complaint));
    setApproved(false);
    setConfirmChecked(false);
    setStep("review");
  };

  const updateSectionContent = (id: string, content: string) => {
    if (approved) return;
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, content } : s)),
    );
  };

  const handleApprove = () => {
    if (!confirmChecked) return;
    setApproved(true);
  };

  const handleUnlock = () => {
    setApproved(false);
    setConfirmChecked(false);
  };

  const handleBackToFormats = () => {
    setStep("select-format");
    setSelectedType(null);
    setSelectedCase(null);
    setSections([]);
    setApproved(false);
    setConfirmChecked(false);
  };

  const handleDownloadPDF = () => {
    if (!approved || !selectedType || !selectedCase) return;

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 48;
    const maxWidth = pageWidth - margin * 2;
    let y = 56;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("KARNATAKA STATE POLICE", pageWidth / 2, y, { align: "center" });
    y += 18;
    doc.setFontSize(11);
    doc.text(selectedType.formCode, pageWidth / 2, y, { align: "center" });
    y += 24;

    doc.setDrawColor(180);
    doc.line(margin, y, pageWidth - margin, y);
    y += 24;

    doc.setFontSize(16);
    doc.text(selectedType.title, margin, y);
    y += 20;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y);
    y += 14;
    doc.text(
      `Investigating Officer: ${officerName}${officerBadge ? " (" + officerBadge + ")" : ""}`,
      margin,
      y,
    );
    y += 24;

    sections.forEach((section) => {
      if (y > 740) {
        doc.addPage();
        y = 56;
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(section.heading, margin, y);
      y += 16;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const lines = doc.splitTextToSize(section.content, maxWidth);
      lines.forEach((line: string) => {
        if (y > 780) {
          doc.addPage();
          y = 56;
        }
        doc.text(line, margin, y);
        y += 14;
      });
      y += 16;
    });

    if (y > 700) {
      doc.addPage();
      y = 56;
    }
    y += 20;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("_______________________", margin, y);
    y += 14;
    doc.text(
      `${officerName}${officerBadge ? ", " + officerBadge : ""}`,
      margin,
      y,
    );
    y += 14;
    doc.text("Investigating Officer", margin, y);

    const filename = `${selectedType.id}_${selectedCase.complaint_id}.pdf`;
    doc.save(filename);
  };

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
            <div style={S.sidebarLogoSub}>OFFICER PORTAL</div>
          </div>
        </div>

        <nav style={S.navList}>
          {[
            { key: "dashboard", label: "Dashboard", icon: "grid" },
            { key: "cases", label: "BNS Sections", icon: "case" },
            { key: "districts", label: "Crime Hotspot", icon: "map" },
            { key: "explain", label: "Explainable AI", icon: "chart" },
            { key: "reports", label: "Generate report", icon: "bolt" },
            { key: "settings", label: "Settings", icon: "gear" },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                if (item.key === "districts" || item.key === "analytics")
                  navigate("/dash");
                else if (item.key === "explain") navigate("/explain");
                else if (item.key === "reports") navigate("/generate-report");
                else if (item.key === "dashboard")
                  navigate("/officer/dashboard");
              }}
              style={S.navItem(item.key === "reports")}
            >
              <NavIcon
                name={item.icon}
                color={
                  item.key === "reports" ? "#FFFFFF" : "rgba(255,255,255,0.55)"
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
            Sign out
          </button>
        </div>
      </aside>

      {/* ---------------- MAIN ---------------- */}
      <div style={S.main}>
        <div style={S.topbar}>
          <div>
            <div style={S.topbarTitle}>Generate Report</div>
            <div style={S.topbarSub}>
              Karnataka State Police · Standard Report Formats
            </div>
          </div>
          <div style={S.officerChipRow}>
            <span style={S.officerBadge}>{officerBadge}</span>
            <span style={S.officerName}>{officerName}</span>
          </div>
        </div>

        <div style={S.body}>
          {step === "select-format" && (
            <div style={S.grid}>
              {REPORT_TYPES.map((type) => (
                <button
                  key={type.id}
                  style={S.card}
                  onClick={() => handleSelectFormat(type)}
                >
                  <div style={S.cardIconTile}>
                    <FileIcon />
                  </div>
                  <div style={S.cardBody}>
                    <div style={S.cardTitle}>{type.title}</div>
                    <div style={S.cardKannada}>{type.kannadaTitle}</div>
                    <div style={S.cardCode}>{type.formCode}</div>
                    <div style={S.cardDesc}>{type.description}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {step === "select-case" && selectedType && (
            <div style={S.panel}>
              <button style={S.backBtn} onClick={handleBackToFormats}>
                ← Back to formats
              </button>
              <div style={S.panelTitle}>Select Case — {selectedType.title}</div>

              <input
                style={S.searchInput}
                placeholder="Search by Complaint ID, name, or incident type..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {loadingCases ? (
                <div style={S.emptyState}>Loading cases...</div>
              ) : filteredComplaints.length === 0 ? (
                <div style={S.emptyState}>No matching cases found.</div>
              ) : (
                <div style={S.caseList}>
                  {filteredComplaints.map((c) => (
                    <button
                      key={c.complaint_id}
                      style={S.caseRow}
                      onClick={() => handleSelectCase(c)}
                    >
                      <div>
                        <span style={S.idChip}>{c.complaint_id}</span>
                        <div style={S.caseName}>{c.citizen_name}</div>
                      </div>
                      <div style={S.caseMeta}>
                        <span>{c.incident_type || "—"}</span>
                        <span style={S.caseStatus}>{c.status}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === "review" && selectedType && selectedCase && (
            <div style={S.panel}>
              <button
                style={S.backBtn}
                onClick={() => {
                  setStep("select-case");
                  setApproved(false);
                  setConfirmChecked(false);
                }}
              >
                ← Back to case selection
              </button>

              <div style={S.reviewHeader}>
                <div>
                  <div style={S.panelTitle}>{selectedType.title}</div>
                  <div style={S.reviewSub}>
                    Case {selectedCase.complaint_id} ·{" "}
                    {selectedCase.citizen_name}
                  </div>
                </div>
                <div
                  style={{
                    ...S.statusChip,
                    color: approved ? "#1F7A5C" : "#B45309",
                    background: approved ? "#E5F6EC" : "#FDEEE3",
                  }}
                >
                  {approved ? "Approved" : "Pending Review"}
                </div>
              </div>

              <div style={S.sectionsList}>
                {sections.map((s) => (
                  <div key={s.id} style={S.sectionBlock}>
                    <div style={S.sectionHeading}>{s.heading}</div>
                    <textarea
                      style={{
                        ...S.sectionTextarea,
                        background: approved ? "#EAF2F5" : "#ffffff",
                      }}
                      value={s.content}
                      disabled={approved}
                      onChange={(e) =>
                        updateSectionContent(s.id, e.target.value)
                      }
                      rows={Math.max(3, s.content.split("\n").length + 1)}
                    />
                  </div>
                ))}
              </div>

              {!approved ? (
                <div style={S.approveBox}>
                  <label style={S.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={confirmChecked}
                      onChange={(e) => setConfirmChecked(e.target.checked)}
                    />
                    I have reviewed this report for accuracy and confirm there
                    are no errors.
                  </label>
                  <button
                    style={{
                      ...S.primaryBtn,
                      opacity: confirmChecked ? 1 : 0.5,
                    }}
                    disabled={!confirmChecked}
                    onClick={handleApprove}
                  >
                    Approve Report
                  </button>
                </div>
              ) : (
                <div style={S.approveBox}>
                  <button style={S.secondaryBtn} onClick={handleUnlock}>
                    Unlock for Editing
                  </button>
                  <button style={S.primaryBtn} onClick={handleDownloadPDF}>
                    Download as PDF
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- Icons ----------

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

function FileIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 3h9l5 5v13a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z"
        stroke="#0E8C8C"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M14 3v5h5"
        stroke="#0E8C8C"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NavIcon({ name, color }: { name: string; color: string }) {
  const common = {
    width: 17,
    height: 17,
    viewBox: "0 0 24 24",
    fill: "none" as const,
  };
  switch (name) {
    case "grid":
      return (
        <svg {...common}>
          <rect
            x="4"
            y="4"
            width="7"
            height="7"
            rx="1.4"
            stroke={color}
            strokeWidth="1.7"
          />
          <rect
            x="13"
            y="4"
            width="7"
            height="7"
            rx="1.4"
            stroke={color}
            strokeWidth="1.7"
          />
          <rect
            x="4"
            y="13"
            width="7"
            height="7"
            rx="1.4"
            stroke={color}
            strokeWidth="1.7"
          />
          <rect
            x="13"
            y="13"
            width="7"
            height="7"
            rx="1.4"
            stroke={color}
            strokeWidth="1.7"
          />
        </svg>
      );
    case "case":
      return (
        <svg {...common}>
          <rect
            x="3"
            y="8"
            width="18"
            height="12"
            rx="1.5"
            stroke={color}
            strokeWidth="1.7"
          />
          <path
            d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2"
            stroke={color}
            strokeWidth="1.7"
          />
        </svg>
      );
    case "map":
      return (
        <svg {...common}>
          <path
            d="M9 4l-5 2v14l5-2 6 2 5-2V4l-5 2-6-2z"
            stroke={color}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M9 4v14M15 6v14" stroke={color} strokeWidth="1.6" />
        </svg>
      );
    case "chart":
      return (
        <svg {...common}>
          <path
            d="M4 20V10M11 20V4M18 20v-7"
            stroke={color}
            strokeWidth="1.9"
            strokeLinecap="round"
          />
        </svg>
      );
    case "bolt":
      return (
        <svg {...common}>
          <path
            d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"
            stroke={color}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
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
          <path
            d="M9 4H5a1 1 0 00-1 1v14a1 1 0 001 1h4"
            stroke={color}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M15 16l4-4-4-4M19 12H9"
            stroke={color}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

// ---------- Styles (matched to OfficerDashboard palette) ----------

const NAVY = "#152A43";
const NAVY_DEEP = "#0E2438";
const TEAL = "#0E8C8C";
const TEXT = "#5B6B7A";
const BORDER = "#E3E9EC";
const BG_SECTION = "#EAF2F5";

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
    gap: 10,
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
  officerBadge: {
    fontSize: 11,
    padding: "4px 9px",
    background: "#E1F5F5",
    color: "#0A6E6E",
    borderRadius: 5,
    fontWeight: 600,
  } as React.CSSProperties,
  officerName: {
    fontSize: 13,
    color: "#374151",
    fontWeight: 500,
  } as React.CSSProperties,

  body: { padding: "28px 32px" } as React.CSSProperties,

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: 14,
  } as React.CSSProperties,

  card: {
    textAlign: "left",
    border: `1px solid ${BORDER}`,
    borderRadius: 12,
    background: "#FFFFFF",
    cursor: "pointer",
    display: "flex",
    gap: 14,
    padding: "18px 20px",
    fontFamily: "inherit",
    alignItems: "flex-start",
  } as React.CSSProperties,
  cardIconTile: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: "#E1F5F5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  } as React.CSSProperties,
  cardBody: { minWidth: 0 } as React.CSSProperties,
  cardTitle: {
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    fontSize: 14.5,
    fontWeight: 600,
    color: NAVY,
  } as React.CSSProperties,
  cardKannada: {
    fontSize: 12,
    color: TEXT,
    marginTop: 3,
  } as React.CSSProperties,
  cardCode: {
    fontSize: 10.5,
    color: "#8A97A3",
    marginTop: 8,
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  } as React.CSSProperties,
  cardDesc: {
    fontSize: 12,
    color: TEXT,
    marginTop: 8,
    lineHeight: 1.5,
  } as React.CSSProperties,

  panel: {
    background: "#FFFFFF",
    border: `1px solid ${BORDER}`,
    borderRadius: 12,
    padding: "28px",
  } as React.CSSProperties,
  backBtn: {
    border: "none",
    background: "none",
    color: TEAL,
    fontSize: 13,
    cursor: "pointer",
    padding: 0,
    marginBottom: 16,
    fontWeight: 600,
    fontFamily: "'Inter', sans-serif",
  } as React.CSSProperties,
  panelTitle: {
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    fontSize: 17,
    fontWeight: 600,
    color: NAVY,
  } as React.CSSProperties,

  searchInput: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 8,
    border: `1px solid ${BORDER}`,
    fontSize: 13,
    marginTop: 16,
    marginBottom: 16,
    fontFamily: "'Inter', sans-serif",
    color: "#374151",
  } as React.CSSProperties,
  emptyState: {
    padding: 30,
    textAlign: "center" as const,
    color: "#9AA7B0",
    fontSize: 13,
  } as React.CSSProperties,
  caseList: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  } as React.CSSProperties,
  caseRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    border: `1px solid ${BORDER}`,
    borderRadius: 8,
    background: BG_SECTION,
    cursor: "pointer",
    fontFamily: "inherit",
    textAlign: "left",
  } as React.CSSProperties,
  caseName: { fontSize: 12, color: TEXT, marginTop: 4 } as React.CSSProperties,
  caseMeta: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    fontSize: 12,
    color: TEXT,
  } as React.CSSProperties,
  caseStatus: {
    padding: "3px 9px",
    borderRadius: 20,
    background: "#E1F5F5",
    color: "#0A6E6E",
    fontWeight: 600,
    fontSize: 11,
  } as React.CSSProperties,

  reviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  } as React.CSSProperties,
  reviewSub: { fontSize: 12, color: TEXT, marginTop: 4 } as React.CSSProperties,
  statusChip: {
    padding: "6px 12px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 700,
  } as React.CSSProperties,

  sectionsList: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
  } as React.CSSProperties,
  sectionBlock: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  } as React.CSSProperties,
  sectionHeading: {
    fontSize: 11,
    fontWeight: 700,
    color: "#8A97A3",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  } as React.CSSProperties,
  sectionTextarea: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 8,
    border: `1px solid ${BORDER}`,
    fontSize: 13,
    fontFamily: "'Inter', sans-serif",
    lineHeight: 1.6,
    resize: "vertical" as const,
    color: "#374151",
  } as React.CSSProperties,

  approveBox: {
    marginTop: 24,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap" as const,
    gap: 14,
  } as React.CSSProperties,
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    color: "#374151",
  } as React.CSSProperties,
  primaryBtn: {
    padding: "10px 20px",
    borderRadius: 8,
    border: "none",
    background: TEAL,
    color: "#FFFFFF",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
  } as React.CSSProperties,
  secondaryBtn: {
    padding: "10px 20px",
    borderRadius: 8,
    border: `1px solid ${BORDER}`,
    background: "#FFFFFF",
    color: "#374151",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
  } as React.CSSProperties,

  idChip: {
    fontSize: 11,
    fontWeight: 700,
    color: "#0A6E6E",
    background: "#E1F5F5",
    padding: "3px 8px",
    borderRadius: 5,
    letterSpacing: "0.03em",
  } as React.CSSProperties,
};
