import { useTranslation } from "react-i18next";

export default function TranslateButton() {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith("kn") ? "en" : "kn";
    i18n.changeLanguage(nextLang);
  };

  const brass = "#a9812f";

  return (
    <button
      onClick={toggleLanguage}
      style={{
        padding: "7px 14px",
        background: "transparent",
        border: `1px solid ${brass}`,
        borderRadius: "5px",
        color: brass,
        fontSize: "12px",
        fontWeight: "600",
        cursor: "pointer",
        fontFamily: "inherit",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        transition: "all 0.15s",
      }}
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>

      {/* Renders dynamic text based on current language */}
      {t("switch_lang")}
    </button>
  );
}
