import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Search,
  LifeBuoy,
  Phone,
  Settings as SettingsIcon,
  Globe2,
  PhoneCall,
  ShieldAlert,
  Flame,
  Ambulance,
  Users,
  Baby,
  ShieldCheck,
  TrainFront,
  Wind,
  HeartPulse,
  Landmark,
  Siren,
  Bug,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";

// ---------- Localization ----------

type Lang = "en" | "kn";

interface ContactCard {
  id: string;
  icon: keyof typeof ICONS;
  name: string;
  number: string;
  altNumber?: string;
  description: string;
}

interface ContactGroup {
  id: string;
  title: string;
  cards: ContactCard[];
}

interface MarqueeItem {
  number: string;
  label: string;
}

interface PageCopy {
  eyebrow: string;
  title: string;
  subtitle: string;
  marqueeLabel: string;
  callBtn: string;
  groups: ContactGroup[];
  marquee: MarqueeItem[];
  footNote: string;
  nav: {
    complaint: string;
    track: string;
    information: string;
    emergency: string;
    settings: string;
    signOut: string;
    portal: string;
  };
}

const ICONS = {
  emergency: Siren,
  police: ShieldAlert,
  fire: Flame,
  ambulance: Ambulance,
  women: Users,
  child: Baby,
  cyber: ShieldCheck,
  senior: HeartPulse,
  disaster: Wind,
  traffic: TrainFront,
  gas: Bug,
  gov: Landmark,
};

const CONTENT: Record<Lang, PageCopy> = {
  en: {
    eyebrow: "Citizen Portal",
    title: "Emergency Contacts",
    subtitle:
      "Toll-free helpline numbers for Karnataka — police, medical, fire, and support services, all in one place",
    marqueeLabel: "Quick dial",
    callBtn: "Call",
    footNote:
      "Numbers are toll-free and work from any phone, even without balance or SIM in most cases. Save these to your phone for quick access.",
    nav: {
      complaint: "File a Complaint",
      track: "Track FIR Status",
      information: "Know Your Rights",
      emergency: "Emergency Contacts",
      settings: "Settings",
      signOut: "Sign out",
      portal: "Citizen Portal",
    },
    marquee: [
      { number: "112", label: "All-in-one emergency" },
      { number: "100", label: "Police" },
      { number: "101", label: "Fire" },
      { number: "108", label: "Ambulance" },
      { number: "1091", label: "Women helpline" },
      { number: "1098", label: "Child helpline" },
      { number: "1930", label: "Cyber crime" },
      { number: "14567", label: "Senior citizens" },
      { number: "1077", label: "Disaster management" },
      { number: "104", label: "Health helpline" },
    ],
    groups: [
      {
        id: "core",
        title: "Core emergency numbers",
        cards: [
          {
            id: "e112",
            icon: "emergency",
            name: "National Emergency Number",
            number: "112",
            description:
              "Single number for police, fire, and medical emergencies anywhere in India. Connects to the state Emergency Response Support System.",
          },
          {
            id: "police",
            icon: "police",
            name: "Police Control Room",
            number: "100",
            description:
              "Report a crime in progress, a law-and-order emergency, or request immediate police assistance.",
          },
          {
            id: "fire",
            icon: "fire",
            name: "Fire and Rescue Services",
            number: "101",
            description:
              "Fire outbreaks, building collapse, gas leaks, or any situation needing the fire brigade's rescue equipment.",
          },
          {
            id: "ambulance",
            icon: "ambulance",
            name: "Ambulance",
            number: "108",
            altNumber: "102",
            description:
              "Free emergency ambulance service across Karnataka. 108 is for accidents and trauma, 102 for other medical transport.",
          },
        ],
      },
      {
        id: "safety",
        title: "Women, child, and senior citizen safety",
        cards: [
          {
            id: "women",
            icon: "women",
            name: "Women's Helpline",
            number: "1091",
            altNumber: "181",
            description:
              "24x7 support for harassment, domestic violence, or any threat to a woman's safety. Connects to the nearest police unit.",
          },
          {
            id: "child",
            icon: "child",
            name: "Child Helpline (Childline)",
            number: "1098",
            description:
              "For any child in distress — abuse, trafficking, begging, or a child needing shelter and protection.",
          },
          {
            id: "senior",
            icon: "senior",
            name: "Senior Citizens' Helpline",
            number: "14567",
            description:
              "Support and grievance redressal for elderly citizens facing neglect, abuse, or needing assistance.",
          },
        ],
      },
      {
        id: "digital",
        title: "Cyber crime and fraud",
        cards: [
          {
            id: "cyber",
            icon: "cyber",
            name: "National Cyber Crime Helpline",
            number: "1930",
            description:
              "Report online financial fraud immediately to help freeze the transaction. Also handles hacking, harassment, and other cyber crimes.",
          },
        ],
      },
      {
        id: "disaster",
        title: "Disaster, health, and utilities",
        cards: [
          {
            id: "disaster",
            icon: "disaster",
            name: "Disaster Management Helpline",
            number: "1077",
            description:
              "District Commissioner's control room for floods, landslides, and other natural disasters in Karnataka.",
          },
          {
            id: "health",
            icon: "senior",
            name: "Arogya Sahayavani (Health Helpline)",
            number: "104",
            description:
              "Karnataka's 24x7 health advisory line for medical guidance, epidemic alerts, and hospital information.",
          },
          {
            id: "gas",
            icon: "gas",
            name: "LPG Gas Leak Helpline",
            number: "1906",
            description:
              "Report a cooking gas leak or cylinder emergency to the nearest gas agency.",
          },
          {
            id: "railway",
            icon: "traffic",
            name: "Railway Enquiry and Helpline",
            number: "139",
            description:
              "Train enquiries, security concerns on trains, or medical emergencies during rail travel.",
          },
        ],
      },
      {
        id: "govt",
        title: "Government grievance and traffic",
        cards: [
          {
            id: "cm",
            icon: "gov",
            name: "Karnataka CM Helpline",
            number: "1902",
            description:
              "Escalate unresolved government service complaints directly to the Chief Minister's grievance cell.",
          },
          {
            id: "traffic",
            icon: "traffic",
            name: "Bengaluru Traffic Police",
            number: "1073",
            description:
              "Report traffic violations, signal failures, or road accidents within Bengaluru city limits.",
          },
        ],
      },
    ],
  },
  kn: {
    eyebrow: "ನಾಗರಿಕ ಪೋರ್ಟಲ್",
    title: "ತುರ್ತು ಸಂಪರ್ಕಗಳು",
    subtitle:
      "ಕರ್ನಾಟಕದ ಉಚಿತ ಸಹಾಯವಾಣಿ ಸಂಖ್ಯೆಗಳು — ಪೊಲೀಸ್, ವೈದ್ಯಕೀಯ, ಅಗ್ನಿಶಾಮಕ ಮತ್ತು ಬೆಂಬಲ ಸೇವೆಗಳು, ಎಲ್ಲವೂ ಒಂದೇ ಸ್ಥಳದಲ್ಲಿ",
    marqueeLabel: "ತ್ವರಿತ ಡಯಲ್",
    callBtn: "ಕರೆ ಮಾಡಿ",
    footNote:
      "ಈ ಸಂಖ್ಯೆಗಳು ಉಚಿತ ಟೋಲ್-ಫ್ರೀ ಆಗಿದ್ದು, ಬಹುತೇಕ ಸಂದರ್ಭಗಳಲ್ಲಿ ಬ್ಯಾಲೆನ್ಸ್ ಅಥವಾ ಸಿಮ್ ಇಲ್ಲದೆಯೂ ಯಾವುದೇ ಫೋನ್‌ನಿಂದ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತವೆ. ತ್ವರಿತ ಪ್ರವೇಶಕ್ಕಾಗಿ ಇವುಗಳನ್ನು ನಿಮ್ಮ ಫೋನ್‌ನಲ್ಲಿ ಉಳಿಸಿ.",
    nav: {
      complaint: "ದೂರು ದಾಖಲಿಸಿ",
      track: "FIR ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ",
      information: "ನಿಮ್ಮ ಹಕ್ಕುಗಳನ್ನು ತಿಳಿಯಿರಿ",
      emergency: "ತುರ್ತು ಸಂಪರ್ಕಗಳು",
      settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
      signOut: "ಸೈನ್ ಔಟ್",
      portal: "ನಾಗರಿಕ ಪೋರ್ಟಲ್",
    },
    marquee: [
      { number: "112", label: "ಸಮಗ್ರ ತುರ್ತು ಸಂಖ್ಯೆ" },
      { number: "100", label: "ಪೊಲೀಸ್" },
      { number: "101", label: "ಅಗ್ನಿಶಾಮಕ" },
      { number: "108", label: "ಆಂಬ್ಯುಲೆನ್ಸ್" },
      { number: "1091", label: "ಮಹಿಳಾ ಸಹಾಯವಾಣಿ" },
      { number: "1098", label: "ಮಕ್ಕಳ ಸಹಾಯವಾಣಿ" },
      { number: "1930", label: "ಸೈಬರ್ ಅಪರಾಧ" },
      { number: "14567", label: "ಹಿರಿಯ ನಾಗರಿಕರು" },
      { number: "1077", label: "ವಿಪತ್ತು ನಿರ್ವಹಣೆ" },
      { number: "104", label: "ಆರೋಗ್ಯ ಸಹಾಯವಾಣಿ" },
    ],
    groups: [
      {
        id: "core",
        title: "ಪ್ರಮುಖ ತುರ್ತು ಸಂಖ್ಯೆಗಳು",
        cards: [
          {
            id: "e112",
            icon: "emergency",
            name: "ರಾಷ್ಟ್ರೀಯ ತುರ್ತು ಸಂಖ್ಯೆ",
            number: "112",
            description:
              "ಭಾರತದಾದ್ಯಂತ ಪೊಲೀಸ್, ಅಗ್ನಿಶಾಮಕ ಮತ್ತು ವೈದ್ಯಕೀಯ ತುರ್ತು ಪರಿಸ್ಥಿತಿಗಳಿಗೆ ಒಂದೇ ಸಂಖ್ಯೆ. ರಾಜ್ಯದ ತುರ್ತು ಪ್ರತಿಕ್ರಿಯೆ ಬೆಂಬಲ ವ್ಯವಸ್ಥೆಗೆ ಸಂಪರ್ಕಿಸುತ್ತದೆ.",
          },
          {
            id: "police",
            icon: "police",
            name: "ಪೊಲೀಸ್ ನಿಯಂತ್ರಣ ಕೊಠಡಿ",
            number: "100",
            description:
              "ನಡೆಯುತ್ತಿರುವ ಅಪರಾಧ, ಕಾನೂನು-ಸುವ್ಯವಸ್ಥೆ ತುರ್ತು ಪರಿಸ್ಥಿತಿ, ಅಥವಾ ತಕ್ಷಣದ ಪೊಲೀಸ್ ನೆರವನ್ನು ವರದಿ ಮಾಡಿ.",
          },
          {
            id: "fire",
            icon: "fire",
            name: "ಅಗ್ನಿಶಾಮಕ ಮತ್ತು ರಕ್ಷಣಾ ಸೇವೆಗಳು",
            number: "101",
            description:
              "ಬೆಂಕಿ ಅವಘಡ, ಕಟ್ಟಡ ಕುಸಿತ, ಗ್ಯಾಸ್ ಸೋರಿಕೆ, ಅಥವಾ ಅಗ್ನಿಶಾಮಕ ದಳದ ರಕ್ಷಣಾ ಸಾಧನಗಳ ಅಗತ್ಯವಿರುವ ಯಾವುದೇ ಪರಿಸ್ಥಿತಿ.",
          },
          {
            id: "ambulance",
            icon: "ambulance",
            name: "ಆಂಬ್ಯುಲೆನ್ಸ್",
            number: "108",
            altNumber: "102",
            description:
              "ಕರ್ನಾಟಕದಾದ್ಯಂತ ಉಚಿತ ತುರ್ತು ಆಂಬ್ಯುಲೆನ್ಸ್ ಸೇವೆ. ಅಪಘಾತ ಮತ್ತು ಗಾಯಗಳಿಗೆ 108, ಇತರ ವೈದ್ಯಕೀಯ ಸಾಗಣೆಗೆ 102.",
          },
        ],
      },
      {
        id: "safety",
        title: "ಮಹಿಳೆ, ಮಕ್ಕಳು ಮತ್ತು ಹಿರಿಯ ನಾಗರಿಕರ ಸುರಕ್ಷತೆ",
        cards: [
          {
            id: "women",
            icon: "women",
            name: "ಮಹಿಳಾ ಸಹಾಯವಾಣಿ",
            number: "1091",
            altNumber: "181",
            description:
              "ಕಿರುಕುಳ, ಕೌಟುಂಬಿಕ ಹಿಂಸೆ, ಅಥವಾ ಮಹಿಳೆಯ ಸುರಕ್ಷತೆಗೆ ಯಾವುದೇ ಬೆದರಿಕೆಗೆ 24x7 ಬೆಂಬಲ. ಹತ್ತಿರದ ಪೊಲೀಸ್ ಘಟಕಕ್ಕೆ ಸಂಪರ್ಕಿಸುತ್ತದೆ.",
          },
          {
            id: "child",
            icon: "child",
            name: "ಮಕ್ಕಳ ಸಹಾಯವಾಣಿ (ಚೈಲ್ಡ್‌ಲೈನ್)",
            number: "1098",
            description:
              "ಸಂಕಷ್ಟದಲ್ಲಿರುವ ಯಾವುದೇ ಮಗುವಿಗಾಗಿ — ದೌರ್ಜನ್ಯ, ಕಳ್ಳಸಾಗಣೆ, ಭಿಕ್ಷಾಟನೆ, ಅಥವಾ ಆಶ್ರಯ ಮತ್ತು ರಕ್ಷಣೆ ಅಗತ್ಯವಿರುವ ಮಗು.",
          },
          {
            id: "senior",
            icon: "senior",
            name: "ಹಿರಿಯ ನಾಗರಿಕರ ಸಹಾಯವಾಣಿ",
            number: "14567",
            description:
              "ನಿರ್ಲಕ್ಷ್ಯ, ದೌರ್ಜನ್ಯ ಎದುರಿಸುತ್ತಿರುವ ಅಥವಾ ನೆರವು ಅಗತ್ಯವಿರುವ ಹಿರಿಯ ನಾಗರಿಕರಿಗೆ ಬೆಂಬಲ ಮತ್ತು ಕುಂದುಕೊರತೆ ಪರಿಹಾರ.",
          },
        ],
      },
      {
        id: "digital",
        title: "ಸೈಬರ್ ಅಪರಾಧ ಮತ್ತು ವಂಚನೆ",
        cards: [
          {
            id: "cyber",
            icon: "cyber",
            name: "ರಾಷ್ಟ್ರೀಯ ಸೈಬರ್ ಅಪರಾಧ ಸಹಾಯವಾಣಿ",
            number: "1930",
            description:
              "ವಹಿವಾಟನ್ನು ಸ್ಥಗಿತಗೊಳಿಸಲು ಆನ್‌ಲೈನ್ ಹಣಕಾಸು ವಂಚನೆಯನ್ನು ತಕ್ಷಣ ವರದಿ ಮಾಡಿ. ಹ್ಯಾಕಿಂಗ್, ಕಿರುಕುಳ ಮತ್ತು ಇತರ ಸೈಬರ್ ಅಪರಾಧಗಳನ್ನೂ ನಿರ್ವಹಿಸುತ್ತದೆ.",
          },
        ],
      },
      {
        id: "disaster",
        title: "ವಿಪತ್ತು, ಆರೋಗ್ಯ ಮತ್ತು ಸೌಲಭ್ಯಗಳು",
        cards: [
          {
            id: "disaster",
            icon: "disaster",
            name: "ವಿಪತ್ತು ನಿರ್ವಹಣೆ ಸಹಾಯವಾಣಿ",
            number: "1077",
            description:
              "ಕರ್ನಾಟಕದಲ್ಲಿ ಪ್ರವಾಹ, ಭೂಕುಸಿತ ಮತ್ತು ಇತರ ನೈಸರ್ಗಿಕ ವಿಪತ್ತುಗಳಿಗೆ ಜಿಲ್ಲಾಧಿಕಾರಿಗಳ ನಿಯಂತ್ರಣ ಕೊಠಡಿ.",
          },
          {
            id: "health",
            icon: "senior",
            name: "ಆರೋಗ್ಯ ಸಹಾಯವಾಣಿ (ಆರೋಗ್ಯ ಸಹಾಯವಾಣಿ)",
            number: "104",
            description:
              "ವೈದ್ಯಕೀಯ ಮಾರ್ಗದರ್ಶನ, ಸಾಂಕ್ರಾಮಿಕ ಎಚ್ಚರಿಕೆಗಳು ಮತ್ತು ಆಸ್ಪತ್ರೆ ಮಾಹಿತಿಗಾಗಿ ಕರ್ನಾಟಕದ 24x7 ಆರೋಗ್ಯ ಸಲಹಾ ಮಾರ್ಗ.",
          },
          {
            id: "gas",
            icon: "gas",
            name: "LPG ಗ್ಯಾಸ್ ಸೋರಿಕೆ ಸಹಾಯವಾಣಿ",
            number: "1906",
            description:
              "ಅಡುಗೆ ಅನಿಲ ಸೋರಿಕೆ ಅಥವಾ ಸಿಲಿಂಡರ್ ತುರ್ತು ಪರಿಸ್ಥಿತಿಯನ್ನು ಹತ್ತಿರದ ಗ್ಯಾಸ್ ಏಜೆನ್ಸಿಗೆ ವರದಿ ಮಾಡಿ.",
          },
          {
            id: "railway",
            icon: "traffic",
            name: "ರೈಲ್ವೆ ವಿಚಾರಣೆ ಮತ್ತು ಸಹಾಯವಾಣಿ",
            number: "139",
            description:
              "ರೈಲು ವಿಚಾರಣೆಗಳು, ರೈಲುಗಳಲ್ಲಿ ಭದ್ರತಾ ಕಾಳಜಿಗಳು, ಅಥವಾ ರೈಲು ಪ್ರಯಾಣದ ಸಮಯದಲ್ಲಿ ವೈದ್ಯಕೀಯ ತುರ್ತು ಪರಿಸ್ಥಿತಿಗಳು.",
          },
        ],
      },
      {
        id: "govt",
        title: "ಸರ್ಕಾರಿ ಕುಂದುಕೊರತೆ ಮತ್ತು ಸಂಚಾರ",
        cards: [
          {
            id: "cm",
            icon: "gov",
            name: "ಕರ್ನಾಟಕ ಮುಖ್ಯಮಂತ್ರಿಗಳ ಸಹಾಯವಾಣಿ",
            number: "1902",
            description:
              "ಬಗೆಹರಿಯದ ಸರ್ಕಾರಿ ಸೇವಾ ದೂರುಗಳನ್ನು ನೇರವಾಗಿ ಮುಖ್ಯಮಂತ್ರಿಗಳ ಕುಂದುಕೊರತೆ ಕೋಶಕ್ಕೆ ಹೆಚ್ಚಿಸಿ.",
          },
          {
            id: "traffic",
            icon: "traffic",
            name: "ಬೆಂಗಳೂರು ಸಂಚಾರ ಪೊಲೀಸ್",
            number: "1073",
            description:
              "ಬೆಂಗಳೂರು ನಗರ ವ್ಯಾಪ್ತಿಯಲ್ಲಿ ಸಂಚಾರ ಉಲ್ಲಂಘನೆಗಳು, ಸಿಗ್ನಲ್ ವೈಫಲ್ಯಗಳು, ಅಥವಾ ರಸ್ತೆ ಅಪಘಾತಗಳನ್ನು ವರದಿ ಮಾಡಿ.",
          },
        ],
      },
    ],
  },
};

const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "kn", label: "ಕನ್ನಡ" },
];

// ---------- Component ----------

export default function EmergencyContacts() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [lang, setLang] = useState<Lang>("en");

  const copy = CONTENT[lang];
  const S = styles;

  // Duplicate the marquee list so the CSS scroll loop is seamless
  const marqueeTrack = useMemo(
    () => [...copy.marquee, ...copy.marquee],
    [copy.marquee],
  );

  const navItems = [
    {
      key: "complaint",
      label: copy.nav.complaint,
      icon: FileText,
      path: "/citizen",
    },
    {
      key: "track",
      label: copy.nav.track,
      icon: Search,
      path: "/track",
    },
    {
      key: "information",
      label: copy.nav.information,
      icon: LifeBuoy,
      path: "/right",
    },
    {
      key: "emergency",
      label: copy.nav.emergency,
      icon: Phone,
      path: "/emergency",
    },
    {
      key: "settings",
      label: copy.nav.settings,
      icon: SettingsIcon,
      path: "/settings",
    },
  ];

  return (
    <div style={S.page}>
      <style>{`
        @keyframes kavach-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .kavach-marquee-track {
          animation: kavach-marquee 26s linear infinite;
        }
        .kavach-marquee-outer:hover .kavach-marquee-track {
          animation-play-state: paused;
        }
        .kavach-contact-card:hover {
          border-color: #0E8C8C;
          box-shadow: 0 2px 10px rgba(14,140,140,0.10);
        }
      `}</style>

      {/* SIDEBAR */}
      <aside style={S.sidebar}>
        <div style={S.sidebarLogoRow}>
          <div style={S.sidebarLogoIcon}>
            <ShieldIcon size={18} color="#FFFFFF" />
          </div>
          <div>
            <div style={S.sidebarLogoTitle}>KAVACH</div>
            <div style={S.sidebarLogoSub}>{copy.nav.portal}</div>
          </div>
        </div>

        <nav style={S.navList}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.key === "emergency";
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
            <div style={{ minWidth: 0 }}>
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
            {copy.nav.signOut}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div style={S.main}>
        <div style={S.topbar}>
          <div>
            <div style={S.topbarEyebrow}>{copy.eyebrow}</div>
            <div style={S.topbarTitle}>{copy.title}</div>
            <div style={S.topbarSub}>{copy.subtitle}</div>
          </div>

          <div style={S.langSwitch}>
            <Globe2 size={14} color={MUTED} />
            {LANGS.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLang(l.code)}
                style={S.langBtn(lang === l.code)}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div style={S.body}>
          {/* Marquee carousel */}
          <div style={S.marqueeOuter} className="kavach-marquee-outer">
            <div style={S.marqueeFadeLeft} />
            <div style={S.marqueeFadeRight} />
            <div style={S.marqueeViewport}>
              <div style={S.marqueeTrack} className="kavach-marquee-track">
                {marqueeTrack.map((m, i) => (
                  <a key={i} href={`tel:${m.number}`} style={S.marqueePill}>
                    <PhoneCall size={13} color="#FFFFFF" />
                    <span style={S.marqueeNumber}>{m.number}</span>
                    <span style={S.marqueeLabel}>{m.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Groups */}
          {copy.groups.map((group) => (
            <div
              key={group.id}
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              <div style={S.groupTitle}>{group.title}</div>
              <div style={S.cardGrid}>
                {group.cards.map((c) => {
                  const Icon = ICONS[c.icon];
                  return (
                    <div
                      key={c.id}
                      style={S.card}
                      className="kavach-contact-card"
                    >
                      <div style={S.cardTop}>
                        <div style={S.cardIcon}>
                          <Icon size={17} />
                        </div>
                        <a href={`tel:${c.number}`} style={S.callBtn}>
                          <PhoneCall size={12} />
                          {copy.callBtn}
                        </a>
                      </div>
                      <div style={S.cardName}>{c.name}</div>
                      <div style={S.cardNumberRow}>
                        <span style={S.cardNumber}>{c.number}</span>
                        {c.altNumber && (
                          <span style={S.cardAltNumber}>/ {c.altNumber}</span>
                        )}
                      </div>
                      <div style={S.cardDesc}>{c.description}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div style={S.footNote}>{copy.footNote}</div>
        </div>
      </div>
    </div>
  );
}

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

// ---------- Design tokens (shared with rest of app) ----------

const NAVY = "#152A43";
const NAVY_DEEP = "#0E2438";
const TEAL = "#0E8C8C";
const TEAL_DARK = "#0A6E6E";
const TEAL_TINT = "#E1F5F5";
const BORDER = "#E3E9EC";
const BG_SECTION = "#EAF2F5";
const TEXT = "#5B6B7A";
const MUTED = "#8A97A3";
const CORAL = "#D85A30";

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
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    flexWrap: "wrap",
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
    maxWidth: 520,
    lineHeight: 1.5,
  } as React.CSSProperties,

  langSwitch: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: BG_SECTION,
    border: `1px solid ${BORDER}`,
    borderRadius: 8,
    padding: "5px 8px",
    flexShrink: 0,
  } as React.CSSProperties,
  langBtn: (active: boolean): React.CSSProperties => ({
    padding: "5px 10px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    fontSize: 12,
    fontWeight: active ? 700 : 500,
    background: active ? TEAL : "transparent",
    color: active ? "#FFFFFF" : TEXT,
  }),

  body: {
    flex: 1,
    overflowY: "auto",
    padding: "24px 32px 60px",
    display: "flex",
    flexDirection: "column",
    gap: 26,
    maxWidth: 1040,
    width: "100%",
    margin: "0 auto",
    boxSizing: "border-box",
  } as React.CSSProperties,

  // Marquee
  marqueeOuter: {
    position: "relative",
    borderRadius: 14,
    overflow: "hidden",
    background: `linear-gradient(120deg, ${NAVY} 0%, ${NAVY_DEEP} 100%)`,
    padding: "14px 0",
  } as React.CSSProperties,
  marqueeViewport: {
    overflow: "hidden",
    width: "100%",
  } as React.CSSProperties,
  marqueeTrack: {
    display: "flex",
    width: "max-content",
    gap: 10,
    padding: "0 10px",
  } as React.CSSProperties,
  marqueeFadeLeft: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 48,
    background: `linear-gradient(90deg, ${NAVY} 0%, rgba(21,42,67,0) 100%)`,
    zIndex: 2,
    pointerEvents: "none",
  } as React.CSSProperties,
  marqueeFadeRight: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 48,
    background: `linear-gradient(270deg, ${NAVY_DEEP} 0%, rgba(14,36,56,0) 100%)`,
    zIndex: 2,
    pointerEvents: "none",
  } as React.CSSProperties,
  marqueePill: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 20,
    padding: "8px 16px",
    whiteSpace: "nowrap",
    textDecoration: "none",
    flexShrink: 0,
  } as React.CSSProperties,
  marqueeNumber: {
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    fontSize: 14,
    fontWeight: 700,
    color: "#FFFFFF",
  } as React.CSSProperties,
  marqueeLabel: {
    fontSize: 11.5,
    color: "rgba(255,255,255,0.65)",
    fontWeight: 500,
  } as React.CSSProperties,

  // Groups & cards
  groupTitle: {
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    fontSize: 14.5,
    fontWeight: 700,
    color: NAVY,
  } as React.CSSProperties,
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
    gap: 12,
  } as React.CSSProperties,
  card: {
    background: "#FFFFFF",
    border: `1px solid ${BORDER}`,
    borderRadius: 12,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
  } as React.CSSProperties,
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  } as React.CSSProperties,
  cardIcon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    background: TEAL_TINT,
    color: TEAL_DARK,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  } as React.CSSProperties,
  callBtn: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    background: CORAL,
    color: "#FFFFFF",
    fontSize: 11.5,
    fontWeight: 700,
    padding: "6px 11px",
    borderRadius: 20,
    textDecoration: "none",
  } as React.CSSProperties,
  cardName: {
    fontSize: 12.5,
    fontWeight: 600,
    color: TEXT,
    lineHeight: 1.4,
  } as React.CSSProperties,
  cardNumberRow: {
    display: "flex",
    alignItems: "baseline",
    gap: 6,
  } as React.CSSProperties,
  cardNumber: {
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    fontSize: 22,
    fontWeight: 700,
    color: NAVY,
  } as React.CSSProperties,
  cardAltNumber: {
    fontSize: 13,
    fontWeight: 600,
    color: MUTED,
  } as React.CSSProperties,
  cardDesc: {
    fontSize: 12,
    color: TEXT,
    lineHeight: 1.55,
  } as React.CSSProperties,

  footNote: {
    fontSize: 12,
    color: MUTED,
    lineHeight: 1.6,
    textAlign: "center" as const,
    padding: "4px 12px 0",
  } as React.CSSProperties,
};
