import React from "react";

/* =========================================================
   THEME
========================================================= */

const colors = {
  navy: "#061B2B",
  navySoft: "#0B3045",
  green: "#0E9F83",
  greenBright: "#26B99A",
  greenLight: "#DFF7F1",
  blue: "#278ED1",
  orange: "#E7A448",
  purple: "#795BC6",
  red: "#D85B5B",
  text: "#14232E",
  muted: "#83919A",
  border: "#E3EAED",
  background: "#F4F7F8",
  white: "#FFFFFF",
};

/* =========================================================
   MAIN DASHBOARD
========================================================= */

const Dashboard: React.FC = () => {
  const startFIRConversation = () => {
    alert("FIR Conversation Engine is ready to begin.");
  };

  const openCrimeMap = () => {
    alert("Crime Intelligence Map will open here.");
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 70% 0%, rgba(38,185,154,0.08), transparent 28%), #F4F7F8",
        color: colors.text,
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main
        style={{
          width: "100%",
          minHeight: "100vh",
          boxSizing: "border-box",
        }}
      >
        {/* =================================================
            TOPBAR
        ================================================== */}

        <header
          style={{
            minHeight: "78px",
            background: "rgba(255,255,255,0.88)",
            backdropFilter: "blur(18px)",
            borderBottom: `1px solid ${colors.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "15px",
            padding: "15px 5%",
            position: "sticky",
            top: 0,
            zIndex: 50,
            boxSizing: "border-box",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "22px",
                fontWeight: 800,
                color: colors.navy,
              }}
            >
              Good Morning, Officer.
            </h2>

            <p
              style={{
                margin: "5px 0 0",
                fontSize: "12px",
                color: colors.muted,
              }}
            >
              Here's an overview of Karnataka's policing ecosystem.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              flexWrap: "wrap",
            }}
          >
            <div style={topIconStyle}>⌕</div>

            <div style={topIconStyle}>♧</div>

            <div
              style={{
                height: "42px",
                width: "1px",
                background: colors.border,
              }}
            />

            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background: colors.navy,
                color: colors.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "12px",
              }}
            >
              KS
            </div>

            <div>
              <strong
                style={{
                  display: "block",
                  fontSize: "12px",
                  color: colors.navy,
                }}
              >
                Command Officer
              </strong>

              <span
                style={{
                  fontSize: "10px",
                  color: colors.muted,
                }}
              >
                Karnataka State Police
              </span>
            </div>
          </div>
        </header>

        {/* =================================================
            PAGE CONTENT
        ================================================== */}

        <section
          style={{
            padding: "20px 5% 60px",
            maxWidth: "1700px",
            margin: "0 auto",
            boxSizing: "border-box",
          }}
        >
          {/* =================================================
              KARNATAKA CRIME INTELLIGENCE HERO
          ================================================== */}

          <section
            style={{
              background: colors.white,
              border: `1px solid ${colors.border}`,
              borderRadius: "22px",
              overflow: "hidden",
              boxShadow: "0 12px 35px rgba(18,42,57,0.06)",
            }}
          >
            {/* HERO HEADER */}

            <div
              style={{
                padding: "26px 30px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: "15px",
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 800,
                    color: colors.green,
                    letterSpacing: "1.2px",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                  }}
                >
                  Karnataka State Police • Statewide Overview
                </div>

                <h1
                  style={{
                    margin: 0,
                    fontSize: "28px",
                    color: colors.navy,
                    letterSpacing: "-1px",
                    fontWeight: 800,
                  }}
                >
                  Understanding crime across Karnataka.
                </h1>

                <p
                  style={{
                    margin: "9px 0 0",
                    color: colors.muted,
                    fontSize: "12px",
                    maxWidth: "650px",
                    lineHeight: 1.6,
                  }}
                >
                  A clearer view of reported crime patterns, emerging hotspots
                  and district-level activity to help officers make informed
                  decisions.
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "9px 13px",
                  borderRadius: "9px",
                  background: "#F3FAF8",
                  color: colors.green,
                  fontSize: "10px",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                <span
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: colors.greenBright,
                  }}
                />
                LIVE DATA OVERVIEW
              </div>
            </div>

            {/* HERO BODY */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "span 1",
                gridAutoRows: "auto",
                // Responsive break from single column to split view for wider viewports
                // Managed through dynamic layout design
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  width: "100%",
                }}
              >
                {/* MAP */}

                <div
                  style={{
                    position: "relative",
                    padding: "28px",
                    background: "linear-gradient(145deg, #F9FCFC, #EFF6F5)",
                    overflow: "hidden",
                    flex: "1 1 550px",
                    minHeight: "450px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* GRID */}

                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      opacity: 0.35,
                      backgroundImage:
                        "linear-gradient(#DCE9E8 1px, transparent 1px), linear-gradient(90deg, #DCE9E8 1px, transparent 1px)",
                      backgroundSize: "32px 32px",
                    }}
                  />

                  {/* MAP TITLE */}

                  <div
                    style={{
                      position: "relative",
                      zIndex: 3,
                      marginBottom: "20px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "10px",
                        fontWeight: 800,
                        color: colors.navy,
                        letterSpacing: "0.8px",
                        textTransform: "uppercase",
                      }}
                    >
                      Reported Crime Activity
                    </div>

                    <div
                      style={{
                        fontSize: "10px",
                        color: colors.muted,
                        marginTop: "5px",
                      }}
                    >
                      District-level activity overview
                    </div>
                  </div>

                  {/* ACTUAL RESPONSIVE GEOGRAPHICAL MAP OF KARNATAKA (SVG) */}

                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      maxWidth: "460px",
                      margin: "auto",
                      zIndex: 2,
                    }}
                  >
                    <svg
                      viewBox="0 0 400 520"
                      width="100%"
                      height="100%"
                      style={{
                        filter: "drop-shadow(0 15px 25px rgba(26,72,76,0.12))",
                      }}
                    >
                      {/* Actual geographical shape approximations for all 31 districts of Karnataka */}
                      {/* Bidar */}
                      <path
                        d="M210 10 L240 20 L245 45 L225 60 L195 40 Z"
                        fill="#E8F1F2"
                        stroke="#B0C7CD"
                        strokeWidth="1.5"
                      />
                      {/* Kalaburagi */}
                      <path
                        d="M175 45 L195 40 L225 60 L215 95 L170 90 L160 65 Z"
                        fill="#E8F1F2"
                        stroke="#B0C7CD"
                        strokeWidth="1.5"
                      />
                      {/* Yadgir */}
                      <path
                        d="M170 90 L215 95 L210 130 L160 125 L155 105 Z"
                        fill="#E8F1F2"
                        stroke="#B0C7CD"
                        strokeWidth="1.5"
                      />
                      {/* Vijayapura */}
                      <path
                        d="M110 50 L160 65 L155 105 L115 100 L100 75 Z"
                        fill="#E8F1F2"
                        stroke="#B0C7CD"
                        strokeWidth="1.5"
                      />
                      {/* Raichur */}
                      <path
                        d="M160 125 L210 130 L225 165 L165 170 L145 145 Z"
                        fill="#E8F1F2"
                        stroke="#B0C7CD"
                        strokeWidth="1.5"
                      />
                      {/* Bagalkote */}
                      <path
                        d="M85 85 L115 100 L145 105 L135 135 L80 125 Z"
                        fill="#E8F1F2"
                        stroke="#B0C7CD"
                        strokeWidth="1.5"
                      />
                      {/* Belagavi */}
                      <path
                        d="M35 80 L85 85 L80 125 L95 165 L55 180 L25 140 Z"
                        fill="#E8F1F2"
                        stroke="#B0C7CD"
                        strokeWidth="1.5"
                      />
                      {/* Dharwad */}
                      <path
                        d="M70 155 L95 165 L90 195 L60 190 Z"
                        fill="#E8F1F2"
                        stroke="#B0C7CD"
                        strokeWidth="1.5"
                      />
                      {/* Gadag */}
                      <path
                        d="M95 165 L135 135 L145 165 L115 195 Z"
                        fill="#E8F1F2"
                        stroke="#B0C7CD"
                        strokeWidth="1.5"
                      />
                      {/* Koppal */}
                      <path
                        d="M135 135 L165 130 L175 180 L145 185 Z"
                        fill="#E8F1F2"
                        stroke="#B0C7CD"
                        strokeWidth="1.5"
                      />
                      {/* Ballari & Vijayanagara */}
                      <path
                        d="M175 180 L225 165 L240 215 L180 240 L165 210 Z"
                        fill="#E8F1F2"
                        stroke="#B0C7CD"
                        strokeWidth="1.5"
                      />
                      {/* Uttara Kannada */}
                      <path
                        d="M25 180 L55 180 L75 235 L40 260 L20 220 Z"
                        fill="#E8F1F2"
                        stroke="#B0C7CD"
                        strokeWidth="1.5"
                      />
                      {/* Haveri */}
                      <path
                        d="M75 195 L115 195 L110 240 L65 235 Z"
                        fill="#E8F1F2"
                        stroke="#B0C7CD"
                        strokeWidth="1.5"
                      />
                      {/* Shivamogga */}
                      <path
                        d="M45 255 L75 235 L110 240 L115 285 L80 305 L50 285 Z"
                        fill="#E8F1F2"
                        stroke="#B0C7CD"
                        strokeWidth="1.5"
                      />
                      {/* Davanagere */}
                      <path
                        d="M110 240 L155 230 L165 270 L135 280 L115 265 Z"
                        fill="#E8F1F2"
                        stroke="#B0C7CD"
                        strokeWidth="1.5"
                      />
                      {/* Chitradurga */}
                      <path
                        d="M155 230 L180 240 L205 295 L165 305 L165 270 Z"
                        fill="#E8F1F2"
                        stroke="#B0C7CD"
                        strokeWidth="1.5"
                      />
                      {/* Chikkamagaluru */}
                      <path
                        d="M80 305 L115 285 L145 300 L135 345 L95 340 Z"
                        fill="#E8F1F2"
                        stroke="#B0C7CD"
                        strokeWidth="1.5"
                      />
                      {/* Udupi */}
                      <path
                        d="M35 265 L50 285 L45 325 L25 315 Z"
                        fill="#E8F1F2"
                        stroke="#B0C7CD"
                        strokeWidth="1.5"
                      />
                      {/* Dakshina Kannada */}
                      <path
                        d="M45 325 L85 330 L80 375 L45 365 Z"
                        fill="#E8F1F2"
                        stroke="#B0C7CD"
                        strokeWidth="1.5"
                      />
                      {/* Hassan */}
                      <path
                        d="M95 340 L135 345 L155 390 L115 405 L95 375 Z"
                        fill="#E8F1F2"
                        stroke="#B0C7CD"
                        strokeWidth="1.5"
                      />
                      {/* Tumakuru */}
                      <path
                        d="M165 305 L205 295 L225 370 L195 385 L180 350 L155 350 Z"
                        fill="#E8F1F2"
                        stroke="#B0C7CD"
                        strokeWidth="1.5"
                      />
                      {/* Chikkaballapura */}
                      <path
                        d="M225 330 L265 335 L260 370 L225 365 Z"
                        fill="#E8F1F2"
                        stroke="#B0C7CD"
                        strokeWidth="1.5"
                      />
                      {/* Kolar */}
                      <path
                        d="M260 370 L295 375 L285 415 L250 410 Z"
                        fill="#E8F1F2"
                        stroke="#B0C7CD"
                        strokeWidth="1.5"
                      />
                      {/* Bengaluru Rural & Urban */}
                      <path
                        d="M225 370 L255 370 L250 410 L220 435 L205 400 Z"
                        fill="#E1FAF4"
                        stroke="#26B99A"
                        strokeWidth="2"
                      />
                      {/* Ramanagara */}
                      <path
                        d="M195 385 L220 435 L195 450 L180 415 Z"
                        fill="#E8F1F2"
                        stroke="#B0C7CD"
                        strokeWidth="1.5"
                      />
                      {/* Mandya */}
                      <path
                        d="M155 390 L195 385 L180 415 L175 440 L140 420 Z"
                        fill="#E8F1F2"
                        stroke="#B0C7CD"
                        strokeWidth="1.5"
                      />
                      {/* Kodagu */}
                      <path
                        d="M80 375 L115 375 L105 420 L75 405 Z"
                        fill="#E8F1F2"
                        stroke="#B0C7CD"
                        strokeWidth="1.5"
                      />
                      {/* Mysuru */}
                      <path
                        d="M105 420 L140 420 L160 465 L120 475 L105 450 Z"
                        fill="#E8F1F2"
                        stroke="#B0C7CD"
                        strokeWidth="1.5"
                      />
                      {/* Chamarajanagar */}
                      <path
                        d="M140 460 L160 465 L195 450 L210 495 L155 510 Z"
                        fill="#E8F1F2"
                        stroke="#B0C7CD"
                        strokeWidth="1.5"
                      />
                    </svg>

                    {/* GEOGRAPHICAL MARKERS POSITIONED PROPERLY ACROSS KARNATAKA MAP */}
                    <CrimeMarker
                      top="74%"
                      left="58%"
                      label="Bengaluru Urban"
                      value="High"
                      level="high"
                    />
                    <CrimeMarker
                      top="84%"
                      left="34%"
                      label="Mysuru"
                      value="Moderate"
                      level="medium"
                    />
                    <CrimeMarker
                      top="66%"
                      left="50%"
                      label="Tumakuru"
                      value="Moderate"
                      level="medium"
                    />
                    <CrimeMarker
                      top="80%"
                      left="44%"
                      label="Mandya"
                      value="Low"
                      level="low"
                    />
                    <CrimeMarker
                      top="70%"
                      left="18%"
                      label="Mangaluru"
                      value="Low"
                      level="low"
                    />
                  </div>

                  {/* LEGEND */}

                  <div
                    style={{
                      position: "absolute",
                      bottom: "20px",
                      left: "28px",
                      zIndex: 4,
                      display: "flex",
                      gap: "15px",
                      background: "rgba(255,255,255,0.9)",
                      padding: "10px 13px",
                      borderRadius: "9px",
                      border: `1px solid ${colors.border}`,
                      fontSize: "9px",
                      color: colors.muted,
                    }}
                  >
                    <LegendDot color={colors.red} label="Higher activity" />

                    <LegendDot color={colors.orange} label="Moderate" />

                    <LegendDot
                      color={colors.greenBright}
                      label="Lower activity"
                    />
                  </div>
                </div>

                {/* STATISTICS */}

                <div
                  style={{
                    padding: "28px",
                    borderLeft: `1px solid ${colors.border}`,
                    background: "#FFFFFF",
                    flex: "1 1 300px",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: 800,
                      color: colors.navy,
                      letterSpacing: "0.8px",
                      textTransform: "uppercase",
                      marginBottom: "20px",
                    }}
                  >
                    Crime Overview
                  </div>

                  <CrimeStat
                    title="Total reported cases"
                    value="18,642"
                    change="+4.8%"
                    description="Compared with previous period"
                    positive={false}
                  />

                  <CrimeStat
                    title="Cases under investigation"
                    value="7,291"
                    change="+2.1%"
                    description="Active investigations"
                    positive={false}
                  />

                  <CrimeStat
                    title="Cases resolved"
                    value="68.4%"
                    change="+6.7%"
                    description="Resolution rate"
                    positive={true}
                  />

                  <CrimeStat
                    title="Emerging hotspots"
                    value="14"
                    change="3 new"
                    description="Zones requiring attention"
                    positive={false}
                  />

                  <button
                    onClick={openCrimeMap}
                    style={{
                      width: "100%",
                      marginTop: "18px",
                      padding: "13px",
                      borderRadius: "9px",
                      border: "none",
                      background: colors.navy,
                      color: colors.white,
                      fontSize: "11px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Open Crime Intelligence Map →
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* =================================================
              STATUS CARDS
          ================================================== */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "12px",
              marginTop: "18px",
            }}
          >
            <LiveStatus
              title="FIR PIPELINE"
              value="18,642"
              detail="Cases processed"
              color={colors.blue}
            />

            <LiveStatus
              title="ACTIVE CASES"
              value="7,291"
              detail="Under investigation"
              color={colors.orange}
            />

            <LiveStatus
              title="RESOLUTION RATE"
              value="68.4%"
              detail="Cases resolved"
              color={colors.greenBright}
            />

            <LiveStatus
              title="HOTSPOT ZONES"
              value="14"
              detail="Require attention"
              color={colors.red}
            />
          </div>

          {/* =================================================
              WORKFLOW
          ================================================== */}

          <SectionHeading
            title="How IntelliGrid Works"
            subtitle="One connected intelligence loop"
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "12px",
            }}
          >
            <WorkflowStep
              number="01"
              icon="◉"
              title="Citizen / Officer"
              description="A complaint begins through a citizen or police officer."
            />

            <WorkflowStep
              number="02"
              icon="✦"
              title="Form or Conversation"
              description="Kannada and English voice or text capture the incident naturally."
            />

            <WorkflowStep
              number="03"
              icon="♙"
              title="Police Officer"
              description="The officer receives structured and verified case information."
            />

            <WorkflowStep
              number="04"
              icon="⌁"
              title="Model-Assisted Review"
              description="Relevant legal sections and case patterns are surfaced for review."
            />

            <WorkflowStep
              number="05"
              icon="✓"
              title="Actionable Justice"
              description="FIRs, insights, predictions and legal documents are generated."
            />
          </div>

          {/* =================================================
              FEATURE MODULES
          ================================================== */}

          <div>
            <SectionHeading
              title="Intelligence Modules"
              subtitle="Five layers. One unified ecosystem."
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "12px",
              }}
            >
              <FeatureCard
                number="01"
                icon="✦"
                title="Conversational FIR Lodging Engine"
                description="Bilingual Kannada + English voice and text conversations guide citizens and officers through FIR registration."
                color={colors.green}
              />

              <FeatureCard
                number="02"
                icon="⚖"
                title="Intelligent IPC / BNS Recommender"
                description="RAG-powered legal suggestions appear as the FIR is narrated with plain-language explanations."
                color={colors.blue}
              />

              <FeatureCard
                number="03"
                icon="⌁"
                title="Crime Hotspot Intelligence Map"
                description="Historical crime patterns, spatial clusters and forecasting help shift policing from reactive to anticipatory."
                color={colors.orange}
              />

              <FeatureCard
                number="04"
                icon="▤"
                title="Legal Document Export Engine"
                description="Case interactions become court-ready, signed and timestamped legal documents with chain-of-custody data."
                color={colors.purple}
              />

              <FeatureCard
                number="05"
                icon="◈"
                title="Explainable Pattern Analysis"
                description="AI detects anomalies, clusters and MO patterns while showing the reasoning trail behind every insight."
                color={colors.red}
              />
            </div>
          </div>

          {/* =================================================
              FIR CONVERSATION SECTION
          ================================================== */}

          <section
            style={{
              marginTop: "22px",
              background: "#FFFFFF",
              border: `1px solid ${colors.border}`,
              borderRadius: "18px",
              padding: "28px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "30px",
            }}
          >
            <div>
              <div
                style={{
                  color: colors.green,
                  fontSize: "10px",
                  fontWeight: 800,
                  letterSpacing: "1px",
                  marginBottom: "10px",
                }}
              >
                CONVERSATIONAL FIR LODGING
              </div>

              <h3
                style={{
                  fontSize: "24px",
                  lineHeight: 1.2,
                  color: colors.navy,
                  margin: "0 0 12px",
                }}
              >
                A complaint should begin with a conversation.
              </h3>

              <p
                style={{
                  color: colors.muted,
                  fontSize: "12px",
                  lineHeight: 1.7,
                  maxWidth: "520px",
                  margin: 0,
                }}
              >
                Instead of asking citizens to navigate complex forms, the system
                guides them through a natural Kannada or English conversation.
                Important details are captured, clarified and structured for the
                officer.
              </p>

              <button
                onClick={startFIRConversation}
                style={{
                  marginTop: "20px",
                  padding: "12px 18px",
                  borderRadius: "9px",
                  border: "none",
                  background: colors.green,
                  color: colors.white,
                  fontWeight: 700,
                  fontSize: "11px",
                  cursor: "pointer",
                }}
              >
                Start a Sample Conversation →
              </button>
            </div>

            <div
              style={{
                background: "#F7FAFA",
                borderRadius: "14px",
                border: `1px solid ${colors.border}`,
                padding: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "9px",
                  color: colors.muted,
                  fontWeight: 800,
                  letterSpacing: "1px",
                  marginBottom: "16px",
                }}
              >
                SAMPLE CONVERSATION
              </div>

              <ChatBubble
                sender="Citizen"
                text="Someone broke into my shop last night."
                citizen
              />

              <ChatBubble
                sender="IntelliGrid"
                text="I understand. Can you tell me where the shop is located and approximately when you discovered the incident?"
              />

              <ChatBubble
                sender="Citizen"
                text="It is near Jayanagar. I found out around 7 AM."
                citizen
              />

              <ChatBubble
                sender="IntelliGrid"
                text="Thank you. I have captured the location and timeline. An officer can now review the details."
              />
            </div>
          </section>

          {/* =================================================
              EXPLAINABLE INTELLIGENCE
          ================================================== */}

          <section
            style={{
              marginTop: "22px",
              background: colors.navy,
              color: colors.white,
              borderRadius: "18px",
              padding: "28px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "30px",
            }}
          >
            <div>
              <div
                style={{
                  color: "#81DFC8",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "1.2px",
                  marginBottom: "10px",
                }}
              >
                EXPLAINABLE INTELLIGENCE
              </div>

              <h3
                style={{
                  fontSize: "24px",
                  lineHeight: 1.2,
                  margin: "0 0 12px",
                }}
              >
                Technology should support judgement,
                <br />
                not replace it.
              </h3>

              <p
                style={{
                  color: "#AFC0C9",
                  fontSize: "12px",
                  lineHeight: 1.7,
                  margin: 0,
                  maxWidth: "560px",
                }}
              >
                Every recommendation generated by IntelliGrid is designed to
                remain understandable, reviewable and accountable to the officer
                making the final decision.
              </p>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                padding: "18px",
              }}
            >
              <div
                style={{
                  color: "#82DFCA",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  marginBottom: "15px",
                }}
              >
                EXAMPLE REASONING TRAIL
              </div>

              <ReasoningStep
                number="1"
                text="Incident narrative identifies repeated unauthorized entry."
              />

              <ReasoningStep
                number="2"
                text="Similar facts are retrieved from the verified legal knowledge base."
              />

              <ReasoningStep
                number="3"
                text="Relevant BNS sections are suggested with plain-language justification."
              />

              <ReasoningStep
                number="4"
                text="Officer reviews, validates and makes the final decision."
              />
            </div>
          </section>

          {/* FOOTER */}

          <footer
            style={{
              textAlign: "center",
              color: "#9AA6AB",
              fontSize: "10px",
              padding: "30px 0 0",
            }}
          >
            KSP IntelliGrid • Built for accessible, accountable and informed
            policing
          </footer>
        </section>
      </main>
    </div>
  );
};

/* =========================================================
   TOP STATUS CARD
========================================================= */

interface LiveStatusProps {
  title: string;
  value: string;
  detail: string;
  color: string;
}

const LiveStatus: React.FC<LiveStatusProps> = ({
  title,
  value,
  detail,
  color,
}) => {
  return (
    <div
      style={{
        background: colors.white,
        border: `1px solid ${colors.border}`,
        borderRadius: "16px",
        padding: "18px 20px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        boxShadow: "0 8px 25px rgba(18,42,57,0.04)",
      }}
    >
      <div
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 0 5px ${color}20`,
        }}
      />

      <div>
        <div
          style={{
            fontSize: "9px",
            letterSpacing: "1px",
            color: "#9AA6AB",
            fontWeight: 800,
          }}
        >
          {title}
        </div>

        <strong
          style={{
            display: "block",
            marginTop: "4px",
            fontSize: "17px",
            color: colors.navy,
          }}
        >
          {value}
        </strong>

        <span
          style={{
            fontSize: "9px",
            color: colors.muted,
          }}
        >
          {detail}
        </span>
      </div>
    </div>
  );
};

/* =========================================================
   SECTION HEADING
========================================================= */

interface SectionHeadingProps {
  title: string;
  subtitle: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ title, subtitle }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        margin: "32px 0 15px",
        flexWrap: "wrap",
        gap: "10px",
      }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: "18px",
          color: colors.navy,
        }}
      >
        {title}
      </h3>

      <span
        style={{
          color: colors.muted,
          fontSize: "11px",
        }}
      >
        {subtitle}
      </span>
    </div>
  );
};

/* =========================================================
   WORKFLOW STEP
========================================================= */

interface WorkflowStepProps {
  number: string;
  icon: string;
  title: string;
  description: string;
}

const WorkflowStep: React.FC<WorkflowStepProps> = ({
  number,
  icon,
  title,
  description,
}) => {
  return (
    <div
      style={{
        background: "linear-gradient(145deg, #FFFFFF, #F8FBFB)",
        border: `1px solid ${colors.border}`,
        borderRadius: "18px",
        padding: "22px",
        minHeight: "165px",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(18,42,57,0.04)",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: "15px",
          bottom: "-12px",
          fontSize: "70px",
          fontWeight: 900,
          color: "rgba(14,159,131,0.055)",
        }}
      >
        {number}
      </div>

      <div
        style={{
          fontSize: "10px",
          fontWeight: 800,
          color: colors.green,
          marginBottom: "15px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {number}
      </div>

      <div
        style={{
          fontSize: "22px",
          marginBottom: "12px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {icon}
      </div>

      <h4
        style={{
          margin: "0 0 6px",
          fontSize: "12px",
          color: colors.navy,
          position: "relative",
          zIndex: 2,
        }}
      >
        {title}
      </h4>

      <p
        style={{
          margin: 0,
          fontSize: "10px",
          color: colors.muted,
          lineHeight: 1.5,
          position: "relative",
          zIndex: 2,
        }}
      >
        {description}
      </p>
    </div>
  );
};

/* =========================================================
   FEATURE CARD
========================================================= */

interface FeatureCardProps {
  number: string;
  icon: string;
  title: string;
  description: string;
  color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  number,
  icon,
  title,
  description,
  color,
}) => {
  return (
    <div
      style={{
        background: colors.white,
        border: `1px solid ${colors.border}`,
        borderRadius: "16px",
        padding: "20px",
        minHeight: "220px",
        boxShadow: "0 10px 30px rgba(18,42,57,0.04)",
      }}
    >
      <div
        style={{
          fontSize: "10px",
          fontWeight: 800,
          color: "#A5B1B5",
          marginBottom: "17px",
        }}
      >
        {number}
      </div>

      <div
        style={{
          width: "42px",
          height: "42px",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          marginBottom: "16px",
          background: `${color}18`,
          color,
        }}
      >
        {icon}
      </div>

      <h4
        style={{
          fontSize: "12px",
          color: colors.navy,
          lineHeight: 1.4,
          margin: "0 0 9px",
        }}
      >
        {title}
      </h4>

      <p
        style={{
          color: colors.muted,
          fontSize: "10px",
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {description}
      </p>
    </div>
  );
};

/* =========================================================
   CRIME MARKER
========================================================= */

interface CrimeMarkerProps {
  top: string;
  left: string;
  label: string;
  value: string;
  level: "high" | "medium" | "low";
}

const CrimeMarker: React.FC<CrimeMarkerProps> = ({
  top,
  left,
  label,
  value,
  level,
}) => {
  const markerColors = {
    high: colors.red,
    medium: colors.orange,
    low: colors.greenBright,
  };

  const markerColor = markerColors[level];

  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        zIndex: 5,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div
        style={{
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          background: markerColor,
          border: "3px solid white",
          boxShadow: `0 0 0 5px ${markerColor}30`,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "22px",
          left: "50%",
          transform: "translateX(-50%)",
          whiteSpace: "nowrap",
          background: "rgba(255,255,255,0.96)",
          border: `1px solid ${colors.border}`,
          borderRadius: "7px",
          padding: "4px 8px",
          boxShadow: "0 5px 15px rgba(18,42,57,0.1)",
        }}
      >
        <strong
          style={{
            display: "block",
            fontSize: "9px",
            color: colors.navy,
          }}
        >
          {label}
        </strong>

        <span
          style={{
            fontSize: "8px",
            color: markerColor,
            fontWeight: 700,
          }}
        >
          {value} activity
        </span>
      </div>
    </div>
  );
};

/* =========================================================
   LEGEND DOT
========================================================= */

interface LegendDotProps {
  color: string;
  label: string;
}

const LegendDot: React.FC<LegendDotProps> = ({ color, label }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
      }}
    >
      <span
        style={{
          width: "7px",
          height: "7px",
          borderRadius: "50%",
          background: color,
        }}
      />

      {label}
    </div>
  );
};

/* =========================================================
   CRIME STAT
========================================================= */

interface CrimeStatProps {
  title: string;
  value: string;
  change: string;
  description: string;
  positive: boolean;
}

const CrimeStat: React.FC<CrimeStatProps> = ({
  title,
  value,
  change,
  description,
  positive,
}) => {
  return (
    <div
      style={{
        padding: "13px 0",
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: "10px",
            color: colors.muted,
          }}
        >
          {title}
        </span>

        <span
          style={{
            fontSize: "9px",
            fontWeight: 700,
            color: positive ? colors.green : colors.orange,
          }}
        >
          {change}
        </span>
      </div>

      <strong
        style={{
          display: "block",
          fontSize: "24px",
          color: colors.navy,
          marginTop: "4px",
        }}
      >
        {value}
      </strong>

      <span
        style={{
          fontSize: "9px",
          color: "#A0ACB1",
        }}
      >
        {description}
      </span>
    </div>
  );
};

/* =========================================================
   CHAT BUBBLE
========================================================= */

interface ChatBubbleProps {
  sender: string;
  text: string;
  citizen?: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  sender,
  text,
  citizen = false,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: citizen ? "flex-end" : "flex-start",
        marginBottom: "12px",
      }}
    >
      <span
        style={{
          fontSize: "8px",
          color: colors.muted,
          marginBottom: "4px",
        }}
      >
        {sender}
      </span>

      <div
        style={{
          maxWidth: "80%",
          padding: "9px 11px",
          borderRadius: citizen ? "10px 10px 2px 10px" : "10px 10px 10px 2px",
          background: citizen ? colors.greenLight : colors.white,
          border: `1px solid ${colors.border}`,
          fontSize: "10px",
          color: colors.text,
          lineHeight: 1.5,
        }}
      >
        {text}
      </div>
    </div>
  );
};

/* =========================================================
   REASONING STEP
========================================================= */

interface ReasoningStepProps {
  number: string;
  text: string;
}

const ReasoningStep: React.FC<ReasoningStepProps> = ({ number, text }) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        alignItems: "flex-start",
        marginBottom: "12px",
      }}
    >
      <span
        style={{
          width: "21px",
          height: "21px",
          borderRadius: "50%",
          background: "rgba(38,185,154,0.18)",
          color: "#75DFC7",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "9px",
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {number}
      </span>

      <span
        style={{
          color: "#C5D3D8",
          fontSize: "10px",
          lineHeight: 1.5,
        }}
      >
        {text}
      </span>
    </div>
  );
};

/* =========================================================
   TOP ICON STYLE
========================================================= */

const topIconStyle: React.CSSProperties = {
  width: "38px",
  height: "38px",
  border: `1px solid ${colors.border}`,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#77858D",
  fontSize: "15px",
};

export default Dashboard;
