import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { translations, Language } from "@/lib/translations";
import * as Icons from "lucide-react";

/**
 * DESIGN PHILOSOPHY: Clean, minimalist landing page with light background
 * - White background with dark text (#1a1a1a)
 * - Light gray accents (#666, #aaa)
 * - Smooth interactions and animations
 * - Professional, corporate aesthetic
 */

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [activeLang, setActiveLang] = useState<Language>("EN");
  const t = translations[activeLang];

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showWaitlistPopup, setShowWaitlistPopup] = useState(false);
  const [popupEmail, setPopupEmail] = useState("");
  const [popupLoading, setPopupLoading] = useState(false);
  const [popupError, setPopupError] = useState("");

  const handlePopupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!popupEmail) return;
    setPopupLoading(true);
    setPopupError("");
    try {
      // Detect country from IP using free API (no key required)
      let country = null;
      try {
        const geoRes = await fetch("https://ipapi.co/json/");
        const geoData = await geoRes.json();
        country = geoData.country_name || geoData.country || null;
      } catch {
        // Silently fail — country stays null
      }

      const { error } = await supabase.from("waitlist").insert([{ email: popupEmail, country }]);
      if (error) {
        if (error.code === "23505") {
          setPopupError("This email is already registered.");
        } else {
          setPopupError("Something went wrong. Please try again.");
        }
      } else {
        setPopupEmail("");
        setShowWaitlistPopup(false);
        setShowPopup(true);
      }
    } catch {
      setPopupError("Something went wrong. Please try again.");
    } finally {
      setPopupLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setErrorMsg("");
    try {
      const { error } = await supabase.from("waitlist").insert([{ email }]);
      if (error) {
        if (error.code === "23505") {
          setErrorMsg("This email is already registered.");
        } else {
          setErrorMsg("Something went wrong. Please try again.");
        }
      } else {
        setEmail("");
        setSubmitted(true);
        setShowPopup(true);
      }
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{ background: "#fff", color: "#1a1a1a", fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: 1.6 }}>
      {/* Navigation */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ fontWeight: 800, fontSize: "22px", color: "#1a1a1a", letterSpacing: "-0.04em", cursor: "pointer" }}>
            Talos
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          <a href="#features" style={{ fontSize: "13px", color: "#666", textDecoration: "none", fontWeight: 400 }}>
            {t.nav.features}
          </a>
          <a href="#connectors" style={{ fontSize: "13px", color: "#666", textDecoration: "none", fontWeight: 400 }}>
            {t.nav.connectors}
          </a>
          <a href="#how" style={{ fontSize: "13px", color: "#666", textDecoration: "none", fontWeight: 400 }}>
            {t.nav.howItWorks}
          </a>
          <button
            style={{
              background: "#1a1a1a",
              color: "#fff",
              border: "none",
              padding: "7px 18px",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              transition: "opacity .2s",
            }}
          >
            {t.nav.joinWaitlist}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginLeft: "16px" }}>
            {(["EN", "FR", "TR"] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                style={{
                  background: activeLang === lang ? "#1a1a1a" : "transparent",
                  color: activeLang === lang ? "#fff" : "#888",
                  border: activeLang === lang ? "1px solid #1a1a1a" : "1px solid #e0e0e0",
                  borderRadius: "5px",
                  padding: "4px 9px",
                  fontSize: "11px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                  transition: "all .15s",
                  letterSpacing: ".04em",
                }}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ paddingTop: "96px", paddingBottom: "60px", textAlign: "center", maxWidth: "720px", margin: "0 auto", paddingLeft: "24px", paddingRight: "24px" }}>
        <h1 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#1a1a1a", marginBottom: "16px" }}>
          Talos
        </h1>
        <h2 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#1a1a1a", marginBottom: "16px" }}>
          <span style={{ color: "#666", fontWeight: 300 }}>{t.hero.tagline}</span>
        </h2>
        <p style={{ fontSize: "16px", color: "#666", lineHeight: 1.7, maxWidth: "560px", margin: "0 auto 32px", fontWeight: 400 }}>
          {t.hero.description}
        </p>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
          <button
            onClick={() => setShowWaitlistPopup(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#1a1a1a",
              color: "#fff",
              border: "none",
              padding: "12px 28px",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              transition: "opacity .2s",
              textDecoration: "none",
            }}
          >
            {t.hero.cta}
          </button>
        </div>
        <p style={{ fontSize: "12px", color: "#aaa", textAlign: "center" }}>
          Launching April 2026 · Access in order of registration
        </p>
      </section>

      {/* Hero Video Section */}
      <section style={{ maxWidth: "1080px", margin: "48px auto 0", padding: "0 24px" }}>
        <video
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663472662437/R5T29qL58Covc8v8X9wTZt/VideoProject_df988847.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{ width: "100%", height: "auto", display: "block", borderRadius: "14px" }}
        />
      </section>

      {/* Features Section */}
      <section id="features" style={{ maxWidth: "1080px", margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 700, letterSpacing: "-.03em", lineHeight: 1.1, color: "#1a1a1a", marginBottom: "14px" }}>
          {t.features.title}
        </h2>
        <p style={{ fontSize: "15px", color: "#666", lineHeight: 1.7, maxWidth: "560px", margin: "0 auto 64px" }}>
          {t.features.subtitle}
        </p>

        {/* Row 1: Create (image left) + Analyze (image right) */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
          {[
            { badge: t.features.create.badge, title: t.features.create.title, desc: t.features.create.desc, img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663472662437/R5T29qL58Covc8v8X9wTZt/Untitleddesign(9)_f3b424d9.webp" },
            { badge: t.features.analyze.badge, title: t.features.analyze.title, desc: t.features.analyze.desc, img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663472662437/R5T29qL58Covc8v8X9wTZt/Untitleddesign(8)_a666b439.webp" },
          ].map((item, idx) => (
            <div key={idx} style={{ border: "1px solid #ebebeb", borderRadius: "14px", overflow: "hidden", display: "flex", flexDirection: "column", background: "#fff" }}>
              <div style={{ overflow: "hidden" }}>
                <img src={item.img} alt={item.title} style={{ width: "100%", height: "260px", objectFit: "cover", display: "block" }} />
              </div>
              <div style={{ padding: "36px 40px 44px" }}>
                <div style={{ display: "inline-flex", alignItems: "center", background: "#f0f0ee", border: "1px solid #e4e4e0", borderRadius: "20px", padding: "4px 12px", fontSize: "11px", color: "#666", fontWeight: 500, marginBottom: "16px", letterSpacing: ".02em" }}>{item.badge}</div>
                <h3 style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-.02em", color: "#1a1a1a", marginBottom: "10px", lineHeight: 1.2 }}>{item.title}</h3>
                <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.7 }}>{item.desc}</p>
                <button style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "transparent", border: "1.5px solid #d0d0d0", borderRadius: "8px", padding: "9px 18px", fontSize: "13px", fontWeight: 500, color: "#1a1a1a", cursor: "pointer", marginTop: "20px" }}>{t.features.button}</button>
              </div>
            </div>
          ))}
        </div>

        {/* Row 2: Computer Use (wide with image) + two small cards stacked */}
        {/* Row 2a: Browser Use full width */}
        <div style={{ border: "1px solid #ebebeb", borderRadius: "14px", padding: "36px 40px 40px", background: "#fff", textAlign: "left", marginBottom: "24px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", background: "#f0f0ee", border: "1px solid #e4e4e0", borderRadius: "20px", padding: "4px 12px", fontSize: "11px", color: "#666", fontWeight: 500, marginBottom: "16px", letterSpacing: ".02em" }}>{t.features.browser.badge}</div>
          <h3 style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-.02em", color: "#1a1a1a", marginBottom: "10px", lineHeight: 1.2 }}>{t.features.browser.title}</h3>
          <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.7, maxWidth: "600px" }}>{t.features.browser.desc}</p>
          <button style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "transparent", border: "1.5px solid #d0d0d0", borderRadius: "8px", padding: "9px 18px", fontSize: "13px", fontWeight: 500, color: "#1a1a1a", cursor: "pointer", marginTop: "20px" }}>{t.features.button}</button>
        </div>

        {/* Row 2b: Computer Use + Automate side by side */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
          {/* Computer Use — with image */}
          <div style={{ border: "1px solid #ebebeb", borderRadius: "14px", overflow: "hidden", display: "flex", flexDirection: "column", background: "#fff" }}>
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663472662437/R5T29qL58Covc8v8X9wTZt/Untitleddesign(11)_e3fb2baf.webp" alt="Computer Use" style={{ width: "100%", height: "240px", objectFit: "cover", display: "block", flexShrink: 0 }} />
            <div style={{ padding: "32px 40px 40px", flex: 1 }}>
              <div style={{ display: "inline-flex", alignItems: "center", background: "#f0f0ee", border: "1px solid #e4e4e0", borderRadius: "20px", padding: "4px 12px", fontSize: "11px", color: "#666", fontWeight: 500, marginBottom: "16px", letterSpacing: ".02em" }}>{t.features.computer.badge}</div>
              <h3 style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-.02em", color: "#1a1a1a", marginBottom: "10px", lineHeight: 1.2 }}>{t.features.computer.title}</h3>
              <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.7 }}>{t.features.computer.desc}</p>
              <button style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "transparent", border: "1.5px solid #d0d0d0", borderRadius: "8px", padding: "9px 18px", fontSize: "13px", fontWeight: 500, color: "#1a1a1a", cursor: "pointer", marginTop: "20px" }}>{t.features.button}</button>
            </div>
          </div>
          {/* Automate — with image */}
          <div style={{ border: "1px solid #ebebeb", borderRadius: "14px", overflow: "hidden", display: "flex", flexDirection: "column", background: "#fff" }}>
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663472662437/R5T29qL58Covc8v8X9wTZt/Untitleddesign(12)_a974e466.webp" alt="Automation" style={{ width: "100%", height: "240px", objectFit: "cover", display: "block", flexShrink: 0 }} />
            <div style={{ padding: "32px 40px 40px", flex: 1 }}>
              <div style={{ display: "inline-flex", alignItems: "center", background: "#f0f0ee", border: "1px solid #e4e4e0", borderRadius: "20px", padding: "4px 12px", fontSize: "11px", color: "#666", fontWeight: 500, marginBottom: "16px", letterSpacing: ".02em" }}>{t.features.automate.badge}</div>
              <h3 style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-.02em", color: "#1a1a1a", marginBottom: "10px", lineHeight: 1.2 }}>{t.features.automate.title}</h3>
              <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.7 }}>{t.features.automate.desc}</p>
              <button style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "transparent", border: "1.5px solid #d0d0d0", borderRadius: "8px", padding: "9px 18px", fontSize: "13px", fontWeight: 500, color: "#1a1a1a", cursor: "pointer", marginTop: "20px" }}>{t.features.button}</button>
            </div>
          </div>
        </div>

        {/* Row 3: Workflow full width */}
        <div style={{ border: "1px solid #ebebeb", borderRadius: "14px", padding: "44px 48px", background: "#fff", textAlign: "left" }}>
          <div style={{ display: "inline-flex", alignItems: "center", background: "#f0f0ee", border: "1px solid #e4e4e0", borderRadius: "20px", padding: "4px 12px", fontSize: "11px", color: "#666", fontWeight: 500, marginBottom: "16px", letterSpacing: ".02em" }}>{t.features.workflow.badge}</div>
          <h3 style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-.02em", color: "#1a1a1a", marginBottom: "10px", lineHeight: 1.2 }}>{t.features.workflow.title}</h3>
          <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.7, maxWidth: "600px" }}>{t.features.workflow.desc}</p>
          <button style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "transparent", border: "1.5px solid #d0d0d0", borderRadius: "8px", padding: "9px 18px", fontSize: "13px", fontWeight: 500, color: "#1a1a1a", cursor: "pointer", marginTop: "20px" }}>{t.features.button}</button>
        </div>
      </section>

      {/* Connectors Section */}
      <section id="connectors" style={{ background: "#f8f8f6", borderTop: "1px solid #ebebeb", borderBottom: "1px solid #ebebeb" }}>
        <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "80px 24px" }}>
          <h2 style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 700, letterSpacing: "-.03em", lineHeight: 1.1, color: "#1a1a1a", marginBottom: "14px" }}>
            {t.connectors.title}
          </h2>
          <p style={{ fontSize: "15px", color: "#666", lineHeight: 1.7, maxWidth: "560px", marginBottom: "48px" }}>
            {t.connectors.subtitle}
          </p>

          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663472662437/R5T29qL58Covc8v8X9wTZt/GENERALISTAIAGENT(1)_6828e15f.webp"
            alt="Connectors"
            style={{ width: "100%", height: "auto", display: "block", borderRadius: "12px" }}
          />

          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <span style={{ fontSize: "13px", color: "#888" }}>
              {t.connectors.more}
            </span>
          </div>
        </div>
      </section>

      {/* Built for Real Work Section */}
      <section style={{ maxWidth: "1080px", margin: "0 auto", padding: "80px 24px" }}>
        <h2 style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 700, letterSpacing: "-.03em", lineHeight: 1.1, color: "#1a1a1a", marginBottom: "14px" }}>
          {t.realWork.title}<br />
          {t.realWork.titleLine2}
        </h2>
        <p style={{ fontSize: "15px", color: "#666", lineHeight: 1.7, maxWidth: "560px", marginBottom: "32px" }}>
          {t.realWork.subtitle}
        </p>

        <div style={{ display: "flex", gap: "8px", marginBottom: "32px", flexWrap: "wrap" }}>
          {t.tabs.map((tab: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              style={{
                padding: "7px 16px",
                borderRadius: "100px",
                border: activeTab === idx ? "1.5px solid #1a1a1a" : "1.5px solid #e4e4e0",
                fontSize: "13px",
                fontWeight: 500,
                color: activeTab === idx ? "#fff" : "#666",
                cursor: "pointer",
                transition: "all .2s",
                background: activeTab === idx ? "#1a1a1a" : "#fff",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Demo Frame */}
        <div style={{ width: "100%", background: "#fff", border: "1px solid #ebebeb", borderRadius: "14px", overflow: "hidden", boxShadow: "0 4px 32px rgba(0,0,0,.06)" }}>
          <div style={{ padding: "12px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: "8px", background: "#fafafa" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ff5f57" }}></div>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#febc2e" }}></div>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#28c840" }}></div>
          </div>
          <div style={{ padding: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", minHeight: "320px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ padding: "12px 16px", borderRadius: "10px", fontSize: "13px", lineHeight: 1.6, background: "#1a1a1a", color: "#fff", alignSelf: "flex-end", borderBottomRightRadius: "3px", maxWidth: "85%" }}>
                {t.tabs[activeTab].userMsg}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#aaa", padding: "4px 0" }}>
                <span>{t.tabs[activeTab].thinking}</span>
                <div style={{ display: "flex", gap: "3px" }}>
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      style={{
                        width: "5px",
                        height: "5px",
                        background: "#d0d0d0",
                        borderRadius: "50%",
                        animation: `td 1.2s ease infinite`,
                        animationDelay: `${i * 0.2}s`,
                      }}
                    ></span>
                  ))}
                </div>
              </div>
              <div style={{ padding: "12px 16px", borderRadius: "10px", fontSize: "13px", lineHeight: 1.6, background: "#f4f4f2", color: "#1a1a1a", alignSelf: "flex-start", borderBottomLeftRadius: "3px", maxWidth: "90%" }}>
                <div style={{ fontSize: "10px", color: "#aaa", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", display: "block", marginBottom: "5px" }}>
                  {t.realWork.delivery}
                </div>
                {t.tabs[activeTab].agentMsg}
              </div>
            </div>
            <div style={{ background: "#f8f8f6", borderRadius: "10px", padding: "20px", border: "1px solid #ebebeb" }}>
              <div style={{ fontSize: "11px", color: "#aaa", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "16px" }}>
                {t.realWork.stepsExecuted}
              </div>
              {t.tabs[activeTab].steps.map((step: any, idx: number) => {
                const IconComponent = (Icons as any)[step.icon];
                return (
                  <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "10px 0", borderBottom: idx < t.tabs[activeTab].steps.length - 1 ? "1px solid #ebebeb" : "none" }}>
                    <div style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#ebebeb", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "6px" }}>
                      {IconComponent && <IconComponent size={16} strokeWidth={2.5} color="#1a1a1a" />}
                    </div>
                    <div style={{ fontSize: "12px", color: "#555", lineHeight: 1.5 }}>
                      <b style={{ color: "#1a1a1a", fontWeight: 600, display: "block", marginBottom: "2px" }}>
                        {step.label}
                      </b>
                      {step.val}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section id="how" style={{ background: "#f8f8f6", borderTop: "1px solid #ebebeb", borderBottom: "1px solid #ebebeb" }}>
        <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "80px 24px" }}>
          <h2 style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 700, letterSpacing: "-.03em", lineHeight: 1.1, color: "#1a1a1a", marginBottom: "14px" }}>
            {t.how.title}
          </h2>
          <p style={{ fontSize: "15px", color: "#666", lineHeight: 1.7, maxWidth: "560px", marginBottom: "48px" }}>
            {t.how.subtitle}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0, marginTop: "48px" }}>
            {[
              { num: "01", title: t.how.step1.title, desc: t.how.step1.desc },
              { num: "02", title: t.how.step2.title, desc: t.how.step2.desc },
              { num: "03", title: t.how.step3.title, desc: t.how.step3.desc },
            ].map((step, idx) => (
              <div key={idx} style={{ padding: "32px 40px 32px 0" }}>
                <div style={{ fontSize: "13px", color: "#bbb", fontWeight: 600, letterSpacing: ".06em", display: "block", marginBottom: "12px" }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#1a1a1a", marginBottom: "10px", letterSpacing: "-.02em", lineHeight: 1.3 }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Swarm Section */}
      <section style={{ background: "#f8f8f6", borderTop: "1px solid #ebebeb" }}>
        <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "80px 24px" }}>
          <h2 style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 700, letterSpacing: "-.03em", lineHeight: 1.1, color: "#1a1a1a", marginBottom: "14px" }}>
            {t.agents.title}
          </h2>
          <p style={{ fontSize: "15px", color: "#666", lineHeight: 1.7, maxWidth: "560px", marginBottom: "48px" }}>
            {t.agents.subtitle}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", marginTop: "48px" }}>
            {t.agentsList.map((agent: any, idx: number) => (
              <div key={idx} style={{ background: "#fff", border: "1px solid #ebebeb", borderRadius: "12px", padding: "32px", transition: "all .2s" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1a1a1a", marginBottom: "10px", letterSpacing: "-.02em" }}>
                  {agent.title}
                </h3>
                <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.7, marginBottom: "16px" }}>{agent.desc}</p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {agent.tags.map((tag: any, tagIdx: number) => (
                    <span
                      key={tagIdx}
                      style={{
                        fontSize: "11px",
                        background: "#f0f0ee",
                        border: "1px solid #e4e4e0",
                        borderRadius: "4px",
                        padding: "4px 8px",
                        color: "#666",
                        fontWeight: 500,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: "80px 24px", textAlign: "center", borderTop: "1px solid #ebebeb" }}>
        <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 700, letterSpacing: "-.03em", lineHeight: 1.1, color: "#1a1a1a", marginBottom: "48px" }}>
            {t.faq.title}
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "24px" }}>
            {t.faqsList.map((faq: any, idx: number) => (
              <div key={idx} style={{ textAlign: "left", background: "#f8f8f6", border: "1px solid #ebebeb", borderRadius: "12px", padding: "24px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#1a1a1a", marginBottom: "12px" }}>
                  {faq.q}
                </h3>
                <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.7 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: "80px 24px", textAlign: "center", borderTop: "1px solid #ebebeb" }}>
        <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(48px,10vw,96px)", fontWeight: 800, letterSpacing: "-.04em", color: "#1a1a1a", lineHeight: 1, marginBottom: "8px" }}>
            Talos
          </h2>
          <p style={{ fontSize: "14px", color: "#aaa", marginTop: "8px", letterSpacing: ".04em", textTransform: "uppercase", fontWeight: 500 }}>
            {t.cta.tagline}
          </p>

          <form onSubmit={handleSubmit} style={{ marginTop: "40px", display: "flex", justifyContent: "center" }}>
            <div style={{ display: "flex", border: "1.5px solid #e4e4e0", borderRadius: "10px", overflow: "hidden", width: "100%", maxWidth: "420px", background: "#fff", transition: "border-color .2s, box-shadow .2s" }}>
              <input
                type="email"
                placeholder={t.cta.placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  padding: "12px 18px",
                  fontSize: "14px",
                  color: "#1a1a1a",
                  fontFamily: "'Inter', sans-serif",
                  background: "transparent",
                }}
              />
              <button
                type="submit"
                style={{
                  background: "#1a1a1a",
                  color: "#fff",
                  border: "none",
                  padding: "12px 20px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                  transition: "opacity .2s",
                  whiteSpace: "nowrap",
                }}
              >
                {t.cta.button}
              </button>
            </div>
          </form>

          {errorMsg && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#dc2626", fontWeight: 500, padding: "11px 20px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", marginTop: "12px", justifyContent: "center", maxWidth: "420px", margin: "12px auto 0" }}>
              ⚠ {errorMsg}
            </div>
          )}

          <p style={{ fontSize: "12px", color: "#aaa", textAlign: "center", marginTop: "24px" }}>
            {t.cta.launchInfo}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#fff", borderTop: "1px solid #ebebeb", padding: "80px 24px" }}>
        <div style={{ maxWidth: "1080px", margin: "0 auto", marginBottom: "48px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "48px" }}>
            <div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#1a1a1a", marginBottom: "12px" }}>
                Talos
              </div>
              <div style={{ fontSize: "13px", color: "#666", lineHeight: 1.7, marginBottom: "16px" }}>
                {t.hero.tagline}<br />
                {t.footer.tagline}
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                {["𝕏", "in", "⌥"].map((icon, idx) => (
                  <div key={idx} style={{ fontSize: "16px", cursor: "pointer" }}>
                    {icon}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#1a1a1a", marginBottom: "16px", textTransform: "uppercase", letterSpacing: ".04em" }}>
                {t.footer.product}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {["Features", "Connectors", "Pricing", "Changelog"].map((item, idx) => (
                  <a key={idx} href="#" style={{ fontSize: "13px", color: "#666", textDecoration: "none", transition: "color .2s" }}>
                    {item}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#1a1a1a", marginBottom: "16px", textTransform: "uppercase", letterSpacing: ".04em" }}>
                {t.footer.resources}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {["Documentation", "API", "Talos Campus", "Blog"].map((item, idx) => (
                  <a key={idx} href="#" style={{ fontSize: "13px", color: "#666", textDecoration: "none", transition: "color .2s" }}>
                    {item}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#1a1a1a", marginBottom: "16px", textTransform: "uppercase", letterSpacing: ".04em" }}>
                {t.footer.company}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {["About", "Careers", "Privacy", "Terms"].map((item, idx) => (
                  <a key={idx} href="#" style={{ fontSize: "13px", color: "#666", textDecoration: "none", transition: "color .2s" }}>
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #ebebeb", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", color: "#888" }}>
          <span>{t.footer.rights}</span>
          <span>{t.footer.team}</span>
        </div>
      </footer>

      <style>{`
        @keyframes td {
          0%, 60%, 100% { opacity: 0.3; }
          30% { opacity: 1; }
        }
        @keyframes popupFadeIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* Waitlist Signup Popup */}
      {showWaitlistPopup && (
        <div
          onClick={() => setShowWaitlistPopup(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000, animation: "overlayFadeIn 0.2s ease", padding: "24px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff", borderRadius: "20px", padding: "48px 40px",
              maxWidth: "460px", width: "100%", textAlign: "center",
              animation: "popupFadeIn 0.25s ease", boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
              position: "relative",
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setShowWaitlistPopup(false)}
              style={{
                position: "absolute", top: "16px", right: "16px",
                background: "#f0f0ee", border: "none", borderRadius: "50%",
                width: "32px", height: "32px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "18px", color: "#666", lineHeight: 1,
              }}
            >
              {t.common.close}
            </button>

            {/* Icon */}
            <div style={{
              width: "56px", height: "56px", background: "#f0f0ee",
              borderRadius: "50%", display: "flex", alignItems: "center",
              justifyContent: "center", margin: "0 auto 20px", fontSize: "24px",
            }}>
              🚀
            </div>

            <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1a1a1a", marginBottom: "8px", letterSpacing: "-.02em" }}>
              {t.common.waitlistPopupTitle}
            </h2>
            <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.7, marginBottom: "28px" }}>
              {t.common.waitlistPopupDesc}
            </p>

            <form onSubmit={handlePopupSubmit}>
              <div style={{
                display: "flex", border: "1.5px solid #e4e4e0", borderRadius: "10px",
                overflow: "hidden", background: "#fff", marginBottom: "12px",
                transition: "border-color .2s",
              }}>
                <input
                  type="email"
                  placeholder={t.cta.placeholder}
                  value={popupEmail}
                  onChange={(e) => setPopupEmail(e.target.value)}
                  required
                  style={{
                    flex: 1, border: "none", outline: "none",
                    padding: "13px 18px", fontSize: "14px", color: "#1a1a1a",
                    fontFamily: "'Inter', sans-serif", background: "transparent",
                  }}
                />
                <button
                  type="submit"
                  disabled={popupLoading}
                  style={{
                    background: "#1a1a1a", color: "#fff", border: "none",
                    padding: "13px 22px", fontSize: "13px", fontWeight: 600,
                    cursor: popupLoading ? "not-allowed" : "pointer",
                    fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap",
                    opacity: popupLoading ? 0.6 : 1, transition: "opacity .2s",
                  }}
                >
                  {popupLoading ? t.common.joining : t.common.joinNow}
                </button>
              </div>
              {popupError && (
                <div style={{ fontSize: "13px", color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "10px 14px", marginBottom: "8px" }}>
                  ⚠ {popupError}
                </div>
              )}
            </form>

            <p style={{ fontSize: "11px", color: "#aaa", marginTop: "12px" }}>
              {t.common.noSpam}
            </p>
          </div>
        </div>
      )}

      {/* Confirmation Popup */}
      {showPopup && (
        <div
          onClick={() => setShowPopup(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000, animation: "overlayFadeIn 0.2s ease", padding: "24px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff", borderRadius: "20px", padding: "48px 40px",
              maxWidth: "440px", width: "100%", textAlign: "center",
              animation: "popupFadeIn 0.25s ease", boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
              position: "relative",
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setShowPopup(false)}
              style={{
                position: "absolute", top: "16px", right: "16px",
                background: "#f0f0ee", border: "none", borderRadius: "50%",
                width: "32px", height: "32px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "16px", color: "#666", lineHeight: 1,
              }}
            >
              {t.common.close}
            </button>

            {/* Checkmark */}
            <div style={{
              width: "64px", height: "64px", background: "#f0fdf4",
              borderRadius: "50%", display: "flex", alignItems: "center",
              justifyContent: "center", margin: "0 auto 24px", fontSize: "28px",
            }}>
              ✓
            </div>

            <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1a1a1a", marginBottom: "10px", letterSpacing: "-.02em" }}>
              {t.common.successTitle}
            </h2>
            <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.7, marginBottom: "32px" }}>
              {t.common.successDesc}
            </p>

            <div style={{
              background: "#f9f9f7", border: "1px solid #ebebeb",
              borderRadius: "12px", padding: "16px 20px", marginBottom: "28px",
              display: "flex", alignItems: "center", gap: "12px", textAlign: "left",
            }}>
              <span style={{ fontSize: "20px" }}>🚀</span>
              <div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#1a1a1a", marginBottom: "2px" }}>{t.common.priorityAccess}</div>
                <div style={{ fontSize: "12px", color: "#888" }}>{t.common.priorityDesc}</div>
              </div>
            </div>

            <button
              onClick={() => setShowPopup(false)}
              style={{
                background: "#1a1a1a", color: "#fff", border: "none",
                borderRadius: "10px", padding: "13px 32px", fontSize: "14px",
                fontWeight: 600, cursor: "pointer", width: "100%",
                fontFamily: "'Inter', sans-serif", transition: "opacity .2s",
              }}
            >
              {t.common.gotIt}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
