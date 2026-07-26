import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Search,
  LifeBuoy,
  Phone,
  Settings as SettingsIcon,
  Globe2,
  ChevronDown,
  ShieldCheck,
  Siren,
  Users,
  Scale,
  ClipboardCheck,
  BookOpen,
  AlertTriangle,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";

// ---------- Localization ----------
// All page copy lives in this JSON-style dictionary, keyed by language code.
// Swap LANGS or extend this object to add more languages later.

type Lang = "en" | "kn";

interface RightPoint {
  text: string;
  tag?: string;
}

interface RightCategory {
  id: string;
  icon: keyof typeof CATEGORY_ICONS;
  title: string;
  summary: string;
  points: RightPoint[];
}

interface PageCopy {
  eyebrow: string;
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  noResults: string;
  disclaimerTitle: string;
  disclaimerBody: string;
  helplineNote: string;
  categories: RightCategory[];
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

const CATEGORY_ICONS = {
  fir: ClipboardCheck,
  arrest: Siren,
  women: Users,
  legalAid: Scale,
  victim: ShieldCheck,
  general: BookOpen,
};

const CONTENT: Record<Lang, PageCopy> = {
  en: {
    eyebrow: "Citizen Portal",
    title: "Know Your Rights",
    subtitle:
      "A plain-language guide to your rights around FIRs, arrest, and the criminal justice process under the BNSS, 2023",
    searchPlaceholder:
      "Search your rights, e.g. 'arrest' or 'free copy of FIR'",
    noResults: "No matching rights found. Try a different keyword.",
    disclaimerTitle: "This is general information, not legal advice",
    disclaimerBody:
      "Laws and procedures can change, and every case has its own facts. For advice on your specific situation, consult a lawyer or your nearest District Legal Services Authority (DLSA).",
    helplineNote:
      "In an emergency, call 112. For free legal aid, contact your District Legal Services Authority.",
    nav: {
      complaint: "File a Complaint",
      track: "Track FIR Status",
      information: "Know Your Rights",
      emergency: "Emergency Contacts",
      settings: "Settings",
      signOut: "Sign out",
      portal: "Citizen Portal",
    },
    categories: [
      {
        id: "fir",
        icon: "fir",
        title: "Filing an FIR",
        summary:
          "Your rights when reporting a cognizable offence to the police",
        points: [
          {
            text: "You can report a cognizable offence orally, in writing, or electronically at any police station — even outside the area where the crime happened. This is called a Zero FIR.",
            tag: "Sec. 173(1), BNSS",
          },
          {
            text: "If the information discloses a cognizable offence, the police must register the FIR. They cannot refuse to register it or ask you to first prove your complaint.",
            tag: "Sec. 173, BNSS",
          },
          {
            text: "You and the victim are both entitled to a copy of the registered FIR, given immediately and free of cost.",
            tag: "Sec. 173(2), BNSS",
          },
          {
            text: "A Zero FIR is later transferred to the police station with proper jurisdiction, which then investigates the case.",
          },
          {
            text: "If an officer refuses to register your FIR, you can complain to the Superintendent of Police, approach a Magistrate, or escalate to the State/National Human Rights Commission.",
            tag: "Sec. 175, BNSS",
          },
          {
            text: "A public servant who wrongfully refuses to record information about a cognizable offence can face imprisonment and fine.",
            tag: "Sec. 199, BNS",
          },
        ],
      },
      {
        id: "arrest",
        icon: "arrest",
        title: "If you are arrested",
        summary: "Safeguards that apply from the moment of arrest",
        points: [
          {
            text: "The police must immediately tell you the full particulars of the offence and the grounds for your arrest.",
            tag: "Sec. 47(1), BNSS · Art. 22(1)",
          },
          {
            text: "You have the right to inform a friend, relative, or any person of your choice about your arrest and where you are being held.",
            tag: "Sec. 36(c), BNSS",
          },
          {
            text: "You have the right to consult a lawyer of your choice, including during interrogation.",
            tag: "Art. 22(1) · Sec. 341, BNSS",
          },
          {
            text: "You must be produced before the nearest Magistrate within 24 hours of arrest, excluding travel time. Detention beyond this without production is illegal.",
            tag: "Sec. 58, BNSS · Art. 22(2)",
          },
          {
            text: "For a bailable offence, the police must inform you that you are entitled to bail and may arrange sureties. Bail in bailable offences is a right, not a favour.",
            tag: "Sec. 47(2), BNSS",
          },
          {
            text: "You cannot be restrained more than necessary to prevent escape, and you cannot be compelled to give evidence against yourself.",
            tag: "Sec. 46, BNSS · Art. 20(3)",
          },
          {
            text: "No confession made to a police officer can be used as evidence against you.",
          },
        ],
      },
      {
        id: "women",
        icon: "women",
        title: "Rights of women and vulnerable persons",
        summary: "Additional protections during complaints and arrest",
        points: [
          {
            text: "When a woman reports certain offences against her, her statement must be recorded by a woman police officer.",
            tag: "Sec. 173, BNSS",
          },
          {
            text: "A woman generally cannot be arrested after sunset and before sunrise, except in exceptional circumstances and with prior permission of a Magistrate.",
            tag: "Sec. 43, BNSS",
          },
          {
            text: "A police officer cannot touch a woman while making an arrest; only a woman officer may do so.",
            tag: "Sec. 43, BNSS",
          },
          {
            text: "Medical assistance must be arranged for victims where required, especially in cases involving physical harm.",
          },
        ],
      },
      {
        id: "legalAid",
        icon: "legalAid",
        title: "Free legal aid",
        summary: "Support if you cannot afford a lawyer",
        points: [
          {
            text: "If you cannot afford a lawyer, you are entitled to free legal aid through the District Legal Services Authority (DLSA), from the time of arrest through trial.",
            tag: "Sec. 341, BNSS · Art. 39-A",
          },
          {
            text: "Legal aid clinics and helplines operate at the district and taluk level. Ask the police or the court for the nearest DLSA contact.",
          },
          {
            text: "If wrongfully arrested on groundless charges, you may be entitled to compensation.",
            tag: "Sec. 399, BNSS",
          },
        ],
      },
      {
        id: "victim",
        icon: "victim",
        title: "Rights during investigation and after",
        summary: "Staying informed and getting updates on your case",
        points: [
          {
            text: "You have the right to be informed of the progress of the investigation and the status of your complaint.",
          },
          {
            text: "You can track your complaint or FIR status online, or by contacting the investigating officer or police station.",
          },
          {
            text: "Victims of certain offences are entitled to compensation under victim compensation schemes, in addition to any court-ordered relief.",
          },
          {
            text: "You have the right to be heard during bail hearings for serious offences, and to be informed before the accused is released on bail.",
          },
        ],
      },
    ],
  },
  kn: {
    eyebrow: "ನಾಗರಿಕ ಪೋರ್ಟಲ್",
    title: "ನಿಮ್ಮ ಹಕ್ಕುಗಳನ್ನು ತಿಳಿಯಿರಿ",
    subtitle:
      "2023ರ BNSS ಅಡಿಯಲ್ಲಿ FIR, ಬಂಧನ ಮತ್ತು ಕ್ರಿಮಿನಲ್ ನ್ಯಾಯ ಪ್ರಕ್ರಿಯೆಗೆ ಸಂಬಂಧಿಸಿದ ನಿಮ್ಮ ಹಕ್ಕುಗಳ ಸರಳ ಭಾಷೆಯ ಮಾರ್ಗದರ್ಶಿ",
    searchPlaceholder: "ನಿಮ್ಮ ಹಕ್ಕುಗಳನ್ನು ಹುಡುಕಿ, ಉದಾ. 'ಬಂಧನ' ಅಥವಾ 'FIR ಪ್ರತಿ'",
    noResults: "ಹೊಂದಾಣಿಕೆಯಾಗುವ ಹಕ್ಕುಗಳು ಕಂಡುಬಂದಿಲ್ಲ. ಬೇರೆ ಪದವನ್ನು ಪ್ರಯತ್ನಿಸಿ.",
    disclaimerTitle: "ಇದು ಸಾಮಾನ್ಯ ಮಾಹಿತಿ, ಕಾನೂನು ಸಲಹೆಯಲ್ಲ",
    disclaimerBody:
      "ಕಾನೂನುಗಳು ಮತ್ತು ಕಾರ್ಯವಿಧಾನಗಳು ಬದಲಾಗಬಹುದು, ಮತ್ತು ಪ್ರತಿ ಪ್ರಕರಣಕ್ಕೂ ತನ್ನದೇ ಆದ ಸಂಗತಿಗಳಿವೆ. ನಿಮ್ಮ ನಿರ್ದಿಷ್ಟ ಪರಿಸ್ಥಿತಿಯ ಸಲಹೆಗಾಗಿ, ವಕೀಲರನ್ನು ಅಥವಾ ನಿಮ್ಮ ಹತ್ತಿರದ ಜಿಲ್ಲಾ ಕಾನೂನು ಸೇವೆಗಳ ಪ್ರಾಧಿಕಾರವನ್ನು (DLSA) ಸಂಪರ್ಕಿಸಿ.",
    helplineNote:
      "ತುರ್ತು ಸಂದರ್ಭದಲ್ಲಿ, 112 ಗೆ ಕರೆ ಮಾಡಿ. ಉಚಿತ ಕಾನೂನು ನೆರವಿಗಾಗಿ, ನಿಮ್ಮ ಜಿಲ್ಲಾ ಕಾನೂನು ಸೇವೆಗಳ ಪ್ರಾಧಿಕಾರವನ್ನು ಸಂಪರ್ಕಿಸಿ.",
    nav: {
      complaint: "ದೂರು ದಾಖಲಿಸಿ",
      track: "FIR ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ",
      information: "ನಿಮ್ಮ ಹಕ್ಕುಗಳನ್ನು ತಿಳಿಯಿರಿ",
      emergency: "ತುರ್ತು ಸಂಪರ್ಕಗಳು",
      settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
      signOut: "ಸೈನ್ ಔಟ್",
      portal: "ನಾಗರಿಕ ಪೋರ್ಟಲ್",
    },
    categories: [
      {
        id: "fir",
        icon: "fir",
        title: "FIR ದಾಖಲಿಸುವುದು",
        summary: "ಪೊಲೀಸರಿಗೆ ಶಿಕ್ಷಾರ್ಹ ಅಪರಾಧ ವರದಿ ಮಾಡುವಾಗ ನಿಮ್ಮ ಹಕ್ಕುಗಳು",
        points: [
          {
            text: "ಅಪರಾಧ ನಡೆದ ಪ್ರದೇಶದ ಹೊರಗಿದ್ದರೂ, ಯಾವುದೇ ಪೊಲೀಸ್ ಠಾಣೆಯಲ್ಲಿ ಮೌಖಿಕವಾಗಿ, ಲಿಖಿತವಾಗಿ ಅಥವಾ ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಮೂಲಕ ಶಿಕ್ಷಾರ್ಹ ಅಪರಾಧವನ್ನು ವರದಿ ಮಾಡಬಹುದು. ಇದನ್ನು ಝೀರೋ FIR ಎಂದು ಕರೆಯಲಾಗುತ್ತದೆ.",
            tag: "ಸೆಕ್ಷನ್ 173(1), BNSS",
          },
          {
            text: "ಮಾಹಿತಿಯು ಶಿಕ್ಷಾರ್ಹ ಅಪರಾಧವನ್ನು ಬಹಿರಂಗಪಡಿಸಿದರೆ, ಪೊಲೀಸರು FIR ದಾಖಲಿಸಲೇಬೇಕು. ಅವರು ಅದನ್ನು ನೋಂದಾಯಿಸಲು ನಿರಾಕರಿಸಲಾಗುವುದಿಲ್ಲ ಅಥವಾ ಮೊದಲು ನಿಮ್ಮ ದೂರನ್ನು ಸಾಬೀತುಪಡಿಸಲು ಕೇಳುವಂತಿಲ್ಲ.",
            tag: "ಸೆಕ್ಷನ್ 173, BNSS",
          },
          {
            text: "ದಾಖಲಾದ FIRನ ಪ್ರತಿಯನ್ನು ನೀವು ಮತ್ತು ಸಂತ್ರಸ್ತರು ಇಬ್ಬರೂ ಪಡೆಯುವ ಹಕ್ಕು ಹೊಂದಿದ್ದೀರಿ — ತಕ್ಷಣ ಮತ್ತು ಉಚಿತವಾಗಿ.",
            tag: "ಸೆಕ್ಷನ್ 173(2), BNSS",
          },
          {
            text: "ಝೀರೋ FIR ಅನ್ನು ನಂತರ ಸೂಕ್ತ ವ್ಯಾಪ್ತಿಯ ಪೊಲೀಸ್ ಠಾಣೆಗೆ ವರ್ಗಾಯಿಸಲಾಗುತ್ತದೆ, ಅದು ನಂತರ ಪ್ರಕರಣವನ್ನು ತನಿಖೆ ಮಾಡುತ್ತದೆ.",
          },
          {
            text: "ಒಬ್ಬ ಅಧಿಕಾರಿ ನಿಮ್ಮ FIR ದಾಖಲಿಸಲು ನಿರಾಕರಿಸಿದರೆ, ನೀವು ಪೊಲೀಸ್ ವರಿಷ್ಠಾಧಿಕಾರಿಗೆ ದೂರು ನೀಡಬಹುದು, ಮ್ಯಾಜಿಸ್ಟ್ರೇಟ್ ಅವರನ್ನು ಸಂಪರ್ಕಿಸಬಹುದು, ಅಥವಾ ರಾಜ್ಯ/ರಾಷ್ಟ್ರೀಯ ಮಾನವ ಹಕ್ಕುಗಳ ಆಯೋಗಕ್ಕೆ ಪ್ರಸ್ತಾಪಿಸಬಹುದು.",
            tag: "ಸೆಕ್ಷನ್ 175, BNSS",
          },
          {
            text: "ಶಿಕ್ಷಾರ್ಹ ಅಪರಾಧದ ಮಾಹಿತಿಯನ್ನು ದಾಖಲಿಸಲು ತಪ್ಪಾಗಿ ನಿರಾಕರಿಸುವ ಸರ್ಕಾರಿ ಅಧಿಕಾರಿಗೆ ಜೈಲು ಶಿಕ್ಷೆ ಮತ್ತು ದಂಡ ವಿಧಿಸಬಹುದು.",
            tag: "ಸೆಕ್ಷನ್ 199, BNS",
          },
        ],
      },
      {
        id: "arrest",
        icon: "arrest",
        title: "ನಿಮ್ಮನ್ನು ಬಂಧಿಸಿದರೆ",
        summary: "ಬಂಧನದ ಕ್ಷಣದಿಂದ ಅನ್ವಯವಾಗುವ ರಕ್ಷಣೆಗಳು",
        points: [
          {
            text: "ಪೊಲೀಸರು ತಕ್ಷಣ ಅಪರಾಧದ ಸಂಪೂರ್ಣ ವಿವರಗಳನ್ನು ಮತ್ತು ನಿಮ್ಮ ಬಂಧನಕ್ಕೆ ಕಾರಣಗಳನ್ನು ತಿಳಿಸಬೇಕು.",
            tag: "ಸೆಕ್ಷನ್ 47(1), BNSS · ಆರ್ಟಿಕಲ್ 22(1)",
          },
          {
            text: "ನಿಮ್ಮ ಬಂಧನ ಮತ್ತು ನಿಮ್ಮನ್ನು ಎಲ್ಲಿ ಇರಿಸಲಾಗಿದೆ ಎಂಬುದರ ಬಗ್ಗೆ ಸ್ನೇಹಿತ, ಸಂಬಂಧಿ ಅಥವಾ ನಿಮ್ಮ ಆಯ್ಕೆಯ ಯಾವುದೇ ವ್ಯಕ್ತಿಗೆ ತಿಳಿಸುವ ಹಕ್ಕು ನಿಮಗಿದೆ.",
            tag: "ಸೆಕ್ಷನ್ 36(c), BNSS",
          },
          {
            text: "ವಿಚಾರಣೆಯ ಸಮಯದಲ್ಲಿ ಸೇರಿದಂತೆ, ನಿಮ್ಮ ಆಯ್ಕೆಯ ವಕೀಲರನ್ನು ಸಂಪರ್ಕಿಸುವ ಹಕ್ಕು ನಿಮಗಿದೆ.",
            tag: "ಆರ್ಟಿಕಲ್ 22(1) · ಸೆಕ್ಷನ್ 341, BNSS",
          },
          {
            text: "ಪ್ರಯಾಣ ಸಮಯವನ್ನು ಹೊರತುಪಡಿಸಿ, ಬಂಧನದ 24 ಗಂಟೆಗಳ ಒಳಗೆ ನಿಮ್ಮನ್ನು ಹತ್ತಿರದ ಮ್ಯಾಜಿಸ್ಟ್ರೇಟ್ ಮುಂದೆ ಹಾಜರುಪಡಿಸಬೇಕು. ಇದನ್ನು ಮೀರಿದ ಬಂಧನ ಅಕ್ರಮ.",
            tag: "ಸೆಕ್ಷನ್ 58, BNSS · ಆರ್ಟಿಕಲ್ 22(2)",
          },
          {
            text: "ಜಾಮೀನಿಗೆ ಅರ್ಹವಾದ ಅಪರಾಧಕ್ಕಾಗಿ, ನೀವು ಜಾಮೀನಿಗೆ ಅರ್ಹರಾಗಿದ್ದೀರಿ ಎಂದು ಪೊಲೀಸರು ತಿಳಿಸಬೇಕು ಮತ್ತು ಜಾಮೀನುದಾರರನ್ನು ಏರ್ಪಡಿಸಬಹುದು. ಇಂತಹ ಪ್ರಕರಣಗಳಲ್ಲಿ ಜಾಮೀನು ಒಂದು ಹಕ್ಕು, ದಯೆಯಲ್ಲ.",
            tag: "ಸೆಕ್ಷನ್ 47(2), BNSS",
          },
          {
            text: "ತಪ್ಪಿಸಿಕೊಳ್ಳುವುದನ್ನು ತಡೆಯಲು ಅಗತ್ಯಕ್ಕಿಂತ ಹೆಚ್ಚು ನಿರ್ಬಂಧಿಸುವಂತಿಲ್ಲ, ಮತ್ತು ನಿಮ್ಮ ವಿರುದ್ಧವೇ ಸಾಕ್ಷ್ಯ ನೀಡುವಂತೆ ನಿಮ್ಮನ್ನು ಒತ್ತಾಯಿಸುವಂತಿಲ್ಲ.",
            tag: "ಸೆಕ್ಷನ್ 46, BNSS · ಆರ್ಟಿಕಲ್ 20(3)",
          },
          {
            text: "ಪೊಲೀಸ್ ಅಧಿಕಾರಿಗೆ ನೀಡಿದ ಯಾವುದೇ ತಪ್ಪೊಪ್ಪಿಗೆಯನ್ನು ನಿಮ್ಮ ವಿರುದ್ಧ ಸಾಕ್ಷ್ಯವಾಗಿ ಬಳಸುವಂತಿಲ್ಲ.",
          },
        ],
      },
      {
        id: "women",
        icon: "women",
        title: "ಮಹಿಳೆಯರು ಮತ್ತು ದುರ್ಬಲ ವ್ಯಕ್ತಿಗಳ ಹಕ್ಕುಗಳು",
        summary: "ದೂರು ಮತ್ತು ಬಂಧನದ ಸಮಯದಲ್ಲಿ ಹೆಚ್ಚುವರಿ ರಕ್ಷಣೆಗಳು",
        points: [
          {
            text: "ಮಹಿಳೆಯೊಬ್ಬರು ತಮ್ಮ ವಿರುದ್ಧ ನಡೆದ ಕೆಲವು ಅಪರಾಧಗಳ ಬಗ್ಗೆ ದೂರು ನೀಡಿದಾಗ, ಆಕೆಯ ಹೇಳಿಕೆಯನ್ನು ಮಹಿಳಾ ಪೊಲೀಸ್ ಅಧಿಕಾರಿ ದಾಖಲಿಸಬೇಕು.",
            tag: "ಸೆಕ್ಷನ್ 173, BNSS",
          },
          {
            text: "ಅಸಾಧಾರಣ ಸಂದರ್ಭಗಳಲ್ಲಿ ಮತ್ತು ಮ್ಯಾಜಿಸ್ಟ್ರೇಟ್ ಅವರ ಪೂರ್ವಾನುಮತಿಯೊಂದಿಗೆ ಹೊರತುಪಡಿಸಿ, ಸಾಮಾನ್ಯವಾಗಿ ಮಹಿಳೆಯನ್ನು ಸೂರ್ಯಾಸ್ತದ ನಂತರ ಮತ್ತು ಸೂರ್ಯೋದಯದ ಮೊದಲು ಬಂಧಿಸುವಂತಿಲ್ಲ.",
            tag: "ಸೆಕ್ಷನ್ 43, BNSS",
          },
          {
            text: "ಬಂಧಿಸುವಾಗ ಪೊಲೀಸ್ ಅಧಿಕಾರಿ ಮಹಿಳೆಯನ್ನು ಸ್ಪರ್ಶಿಸುವಂತಿಲ್ಲ; ಮಹಿಳಾ ಅಧಿಕಾರಿ ಮಾತ್ರ ಹಾಗೆ ಮಾಡಬಹುದು.",
            tag: "ಸೆಕ್ಷನ್ 43, BNSS",
          },
          {
            text: "ಅಗತ್ಯವಿರುವಲ್ಲಿ, ವಿಶೇಷವಾಗಿ ದೈಹಿಕ ಹಾನಿ ಒಳಗೊಂಡ ಪ್ರಕರಣಗಳಲ್ಲಿ, ಸಂತ್ರಸ್ತರಿಗೆ ವೈದ್ಯಕೀಯ ನೆರವನ್ನು ಏರ್ಪಡಿಸಬೇಕು.",
          },
        ],
      },
      {
        id: "legalAid",
        icon: "legalAid",
        title: "ಉಚಿತ ಕಾನೂನು ನೆರವು",
        summary: "ವಕೀಲರ ವೆಚ್ಚ ಭರಿಸಲಾಗದಿದ್ದರೆ ಬೆಂಬಲ",
        points: [
          {
            text: "ವಕೀಲರ ವೆಚ್ಚವನ್ನು ಭರಿಸಲು ಸಾಧ್ಯವಾಗದಿದ್ದರೆ, ಬಂಧನದ ಸಮಯದಿಂದ ವಿಚಾರಣೆಯವರೆಗೆ ಜಿಲ್ಲಾ ಕಾನೂನು ಸೇವೆಗಳ ಪ್ರಾಧಿಕಾರದ (DLSA) ಮೂಲಕ ಉಚಿತ ಕಾನೂನು ನೆರವು ಪಡೆಯುವ ಹಕ್ಕು ನಿಮಗಿದೆ.",
            tag: "ಸೆಕ್ಷನ್ 341, BNSS · ಆರ್ಟಿಕಲ್ 39-A",
          },
          {
            text: "ಜಿಲ್ಲಾ ಮತ್ತು ತಾಲ್ಲೂಕು ಮಟ್ಟದಲ್ಲಿ ಕಾನೂನು ನೆರವು ಕ್ಲಿನಿಕ್‌ಗಳು ಮತ್ತು ಸಹಾಯವಾಣಿಗಳು ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತವೆ. ಹತ್ತಿರದ DLSA ಸಂಪರ್ಕಕ್ಕಾಗಿ ಪೊಲೀಸರನ್ನು ಅಥವಾ ನ್ಯಾಯಾಲಯವನ್ನು ಕೇಳಿ.",
          },
          {
            text: "ಆಧಾರರಹಿತ ಆರೋಪಗಳ ಮೇಲೆ ತಪ್ಪಾಗಿ ಬಂಧಿಸಲ್ಪಟ್ಟರೆ, ನೀವು ಪರಿಹಾರಕ್ಕೆ ಅರ್ಹರಾಗಿರಬಹುದು.",
            tag: "ಸೆಕ್ಷನ್ 399, BNSS",
          },
        ],
      },
      {
        id: "victim",
        icon: "victim",
        title: "ತನಿಖೆಯ ಸಮಯದಲ್ಲಿ ಮತ್ತು ನಂತರದ ಹಕ್ಕುಗಳು",
        summary: "ನಿಮ್ಮ ಪ್ರಕರಣದ ಬಗ್ಗೆ ಮಾಹಿತಿ ಮತ್ತು ಅಪ್‌ಡೇಟ್‌ಗಳನ್ನು ಪಡೆಯುವುದು",
        points: [
          {
            text: "ತನಿಖೆಯ ಪ್ರಗತಿ ಮತ್ತು ನಿಮ್ಮ ದೂರಿನ ಸ್ಥಿತಿಯ ಬಗ್ಗೆ ಮಾಹಿತಿ ಪಡೆಯುವ ಹಕ್ಕು ನಿಮಗಿದೆ.",
          },
          {
            text: "ನೀವು ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ, ಅಥವಾ ತನಿಖಾಧಿಕಾರಿ ಅಥವಾ ಪೊಲೀಸ್ ಠಾಣೆಯನ್ನು ಸಂಪರ್ಕಿಸುವ ಮೂಲಕ ನಿಮ್ಮ ದೂರು ಅಥವಾ FIR ಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಬಹುದು.",
          },
          {
            text: "ನ್ಯಾಯಾಲಯದ ಆದೇಶದ ಪರಿಹಾರದ ಜೊತೆಗೆ, ಕೆಲವು ಅಪರಾಧಗಳ ಸಂತ್ರಸ್ತರು ಸಂತ್ರಸ್ತ ಪರಿಹಾರ ಯೋಜನೆಗಳ ಅಡಿಯಲ್ಲಿ ಪರಿಹಾರಕ್ಕೆ ಅರ್ಹರಾಗಿದ್ದಾರೆ.",
          },
          {
            text: "ಗಂಭೀರ ಅಪರಾಧಗಳ ಜಾಮೀನು ವಿಚಾರಣೆಯ ಸಮಯದಲ್ಲಿ ಆಲಿಸಲ್ಪಡುವ ಮತ್ತು ಆರೋಪಿಗೆ ಜಾಮೀನು ನೀಡುವ ಮೊದಲು ತಿಳಿಸಲ್ಪಡುವ ಹಕ್ಕು ನಿಮಗಿದೆ.",
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

export default function KnowYourRights() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [lang, setLang] = useState<Lang>("en");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>("fir");

  const copy = CONTENT[lang];
  const S = styles;

  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return copy.categories;
    return copy.categories
      .map((cat) => {
        const catMatches =
          cat.title.toLowerCase().includes(q) ||
          cat.summary.toLowerCase().includes(q);
        const points = cat.points.filter((p) =>
          p.text.toLowerCase().includes(q),
        );
        if (catMatches) return cat;
        if (points.length > 0) return { ...cat, points };
        return null;
      })
      .filter((c): c is RightCategory => c !== null);
  }, [copy.categories, query]);

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
            const active = item.key === "information";
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
          {/* Search */}
          <div style={S.lookupBar}>
            <input
              style={S.lookupInput}
              placeholder={copy.searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Categories */}
          {filteredCategories.length === 0 && (
            <div style={S.emptyState}>{copy.noResults}</div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filteredCategories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.icon];
              const isOpen = openId === cat.id || query.trim().length > 0;
              return (
                <div key={cat.id} style={S.panel}>
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : cat.id)}
                    style={S.categoryHeader}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        minWidth: 0,
                      }}
                    >
                      <div style={S.categoryIcon}>
                        <Icon size={16} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={S.panelTitle}>{cat.title}</div>
                        <div style={S.categorySummary}>{cat.summary}</div>
                      </div>
                    </div>
                    <ChevronDown
                      size={16}
                      color={MUTED}
                      style={{
                        flexShrink: 0,
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.15s ease",
                      }}
                    />
                  </button>

                  {isOpen && (
                    <div style={S.pointList}>
                      {cat.points.map((p, i) => (
                        <div key={i} style={S.pointRow}>
                          <div style={S.pointBullet} />
                          <div style={{ minWidth: 0 }}>
                            <div style={S.pointText}>{p.text}</div>
                            {p.tag && <div style={S.pointTag}>{p.tag}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Disclaimer */}
          <div style={S.disclaimerBox}>
            <AlertTriangle
              size={16}
              color="#8A6D1F"
              style={{ flexShrink: 0, marginTop: 1 }}
            />
            <div>
              <div style={S.disclaimerTitle}>{copy.disclaimerTitle}</div>
              <div style={S.disclaimerBody}>{copy.disclaimerBody}</div>
              <div style={S.helplineNote}>{copy.helplineNote}</div>
            </div>
          </div>
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
    gap: 18,
    maxWidth: 860,
    width: "100%",
    margin: "0 auto",
    boxSizing: "border-box",
  } as React.CSSProperties,

  lookupBar: { display: "flex", gap: 10 } as React.CSSProperties,
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

  emptyState: {
    padding: "16px",
    textAlign: "center" as const,
    color: MUTED,
    fontSize: 12.5,
    background: "#FFFFFF",
    border: `1px dashed ${BORDER}`,
    borderRadius: 10,
  } as React.CSSProperties,

  panel: {
    background: "#FFFFFF",
    border: `1px solid ${BORDER}`,
    borderRadius: 14,
    padding: 18,
  } as React.CSSProperties,
  panelTitle: {
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    fontSize: 14,
    fontWeight: 700,
    color: NAVY,
  } as React.CSSProperties,

  categoryHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    width: "100%",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    padding: 0,
    fontFamily: "inherit",
    textAlign: "left",
  } as React.CSSProperties,
  categoryIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    background: TEAL_TINT,
    color: TEAL_DARK,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  } as React.CSSProperties,
  categorySummary: {
    fontSize: 12,
    color: TEXT,
    marginTop: 2,
    lineHeight: 1.4,
  } as React.CSSProperties,

  pointList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginTop: 16,
    paddingTop: 16,
    borderTop: `1px solid ${BORDER}`,
  } as React.CSSProperties,
  pointRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
  } as React.CSSProperties,
  pointBullet: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: TEAL,
    marginTop: 6,
    flexShrink: 0,
  } as React.CSSProperties,
  pointText: {
    fontSize: 13,
    lineHeight: 1.65,
    color: NAVY,
  } as React.CSSProperties,
  pointTag: {
    fontSize: 10.5,
    fontWeight: 700,
    color: TEAL_DARK,
    background: TEAL_TINT,
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 6,
    marginTop: 6,
    letterSpacing: "0.02em",
  } as React.CSSProperties,

  disclaimerBox: {
    display: "flex",
    gap: 10,
    background: "#FBF3E1",
    border: "1px solid #F0DBA0",
    borderRadius: 12,
    padding: "14px 16px",
  } as React.CSSProperties,
  disclaimerTitle: {
    fontSize: 12.5,
    fontWeight: 700,
    color: "#7A5C10",
  } as React.CSSProperties,
  disclaimerBody: {
    fontSize: 12,
    color: "#8A6D1F",
    lineHeight: 1.6,
    marginTop: 4,
  } as React.CSSProperties,
  helplineNote: {
    fontSize: 11.5,
    color: "#8A6D1F",
    lineHeight: 1.6,
    marginTop: 8,
    fontWeight: 600,
  } as React.CSSProperties,
};
