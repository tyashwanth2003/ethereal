import { useState, useRef, useEffect, useCallback } from "react";

const BOT_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap');

  /* ── Launcher Button ── */
  .eb-launcher {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 9000;
    width: clamp(52px, 5vw, 58px);
    height: clamp(52px, 5vw, 58px);
    border-radius: 50%;
    background: var(--amber, #e8a020);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 0 0 rgba(232,160,32,0.4);
    animation: ebPulse 2.5s ease-in-out infinite;
    transition: transform .25s cubic-bezier(.34,1.56,.64,1), box-shadow .2s;
    overflow: hidden;
    touch-action: manipulation;
  }
  .eb-launcher::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 50%;
    background: conic-gradient(from 0deg, rgba(232,160,32,0.6), transparent, rgba(232,160,32,0.6));
    animation: ebSpin 3s linear infinite;
    z-index: -1;
  }
  .eb-launcher:hover { transform: scale(1.12); }
  .eb-launcher svg { position: relative; z-index: 1; }
  @keyframes ebPulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(232,160,32,.4), 0 8px 32px rgba(232,160,32,.25); }
    50% { box-shadow: 0 0 0 12px rgba(232,160,32,0), 0 8px 32px rgba(232,160,32,.35); }
  }
  @keyframes ebSpin { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
  .eb-unread {
    position: absolute;
    top: -2px;
    right: -2px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #ff4d6d;
    border: 2px solid #05050a;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: .55rem;
    font-family: 'DM Mono', monospace;
    color: #fff;
    font-weight: 700;
    animation: ebBadge .4s cubic-bezier(.34,1.56,.64,1) forwards;
  }
  @keyframes ebBadge { from{transform:scale(0);} to{transform:scale(1);} }

  /* ── Chat Window ── */
  .eb-window {
    position: fixed;
    right: 2rem;
    bottom: 6.5rem;
    z-index: 8999;

    width: min(420px, calc(100vw - 1.5rem));
    max-width: 420px;
    height: min(620px, calc(100vh - 8.5rem));
    max-height: calc(100vh - 8.5rem);

    background: #07070e;
    border: 1px solid rgba(232,160,32,.18);
    display: flex;
    flex-direction: column;
    box-shadow: 0 32px 80px rgba(0,0,0,.7), 0 0 0 1px rgba(232,160,32,.06), inset 0 1px 0 rgba(232,160,32,.1);
    transform-origin: bottom right;
    animation: ebOpen .4s cubic-bezier(.34,1.56,.64,1) forwards;
    overflow: hidden;
    touch-action: pan-y;
  }
  .eb-window::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(232,160,32,.5), transparent);
  }
  .eb-window.closing { animation: ebClose .25s ease forwards; }
  @keyframes ebOpen {
    from { opacity:0; transform:scale(.85) translateY(16px); }
    to   { opacity:1; transform:scale(1) translateY(0); }
  }
  @keyframes ebClose {
    from { opacity:1; transform:scale(1) translateY(0); }
    to   { opacity:0; transform:scale(.85) translateY(16px); }
  }

  /* ── Header ── */
  .eb-head {
    padding: 1.1rem 1.25rem;
    border-bottom: 1px solid rgba(240,235,224,.07);
    display: flex;
    align-items: center;
    gap: .75rem;
    background: rgba(232,160,32,.04);
    flex-shrink: 0;
    position: relative;
  }
  .eb-head::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% 100%, rgba(232,160,32,.07) 0%, transparent 70%);
    pointer-events: none;
  }
  .eb-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #e8a020, #c47a10);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    position: relative;
  }
  .eb-avatar::after {
    content: '';
    position: absolute;
    bottom: 0; right: 0;
    width: 9px; height: 9px;
    border-radius: 50%;
    background: #22c55e;
    border: 2px solid #07070e;
  }
  .eb-head-info { flex: 1; }
  .eb-name {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: -.01em;
    color: #f0ebe0;
    line-height: 1;
  }
  .eb-name em { color: #e8a020; font-style: italic; }
  .eb-status {
    font-size: .58rem;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: #22c55e;
    margin-top: .2rem;
    display: flex;
    align-items: center;
    gap: .35rem;
  }
  .eb-status::before {
    content: '';
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #22c55e;
    display: inline-block;
    animation: statusBlink 2s ease-in-out infinite;
  }
  @keyframes statusBlink { 0%,100%{opacity:1;} 50%{opacity:.3;} }
  .eb-close {
    background: none;
    border: none;
    color: #5a5550;
    cursor: pointer;
    padding: .35rem;
    transition: color .2s;
    line-height: 0;
  }
  .eb-close:hover { color: #e8a020; }

  /* ── Suggested Prompts ── */
  .eb-suggestions {
    display: flex;
    flex-wrap: wrap;
    gap: .4rem;
    padding: .75rem 1.25rem;
    border-bottom: 1px solid rgba(240,235,224,.05);
    flex-shrink: 0;
  }
  .eb-chip {
    font-size: .6rem;
    letter-spacing: .1em;
    text-transform: uppercase;
    padding: .3rem .7rem;
    border: 1px solid rgba(232,160,32,.2);
    color: #9a9590;
    background: transparent;
    cursor: pointer;
    transition: all .2s;
    white-space: nowrap;
    font-family: 'DM Mono', monospace;
  }
  .eb-chip:hover {
    border-color: rgba(232,160,32,.6);
    color: #e8a020;
    background: rgba(232,160,32,.06);
  }

  /* ── Messages ── */
  .eb-msgs {
    flex: 1;
    overflow-y: auto;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
  }
  .eb-msgs::-webkit-scrollbar { width: 3px; }
  .eb-msgs::-webkit-scrollbar-track { background: transparent; }
  .eb-msgs::-webkit-scrollbar-thumb { background: rgba(232,160,32,.2); border-radius: 2px; }

  .eb-msg {
    display: flex;
    flex-direction: column;
    animation: msgIn .3s cubic-bezier(.34,1.2,.64,1) forwards;
    opacity: 0;
  }
  @keyframes msgIn {
    from { opacity:0; transform:translateY(12px) scale(.97); }
    to   { opacity:1; transform:translateY(0) scale(1); }
  }
  .eb-msg.user { align-items: flex-end; }
  .eb-msg.bot  { align-items: flex-start; }
  .eb-bubble {
    max-width: min(85%, 100%);
    padding: .75rem 1rem;
    font-size: .75rem;
    line-height: 1.85;
    letter-spacing: .01em;
    position: relative;
    word-break: break-word;
  }
  .eb-msg.user .eb-bubble {
    background: rgba(232,160,32,.12);
    border: 1px solid rgba(232,160,32,.25);
    color: #f0ebe0;
    border-bottom-right-radius: 2px;
  }
  .eb-msg.bot .eb-bubble {
    background: rgba(240,235,224,.04);
    border: 1px solid rgba(240,235,224,.08);
    color: #c8c4bb;
    border-bottom-left-radius: 2px;
  }
  .eb-msg.bot .eb-bubble::before {
    content: '✦';
    position: absolute;
    left: -1.4rem;
    top: .6rem;
    font-size: .6rem;
    color: rgba(232,160,32,.3);
  }
  .eb-msg-time {
    font-size: .55rem;
    letter-spacing: .1em;
    color: #3a3530;
    margin-top: .3rem;
    text-transform: uppercase;
  }

  /* ── Design Preview Card ── */
  .eb-preview {
    margin-top: .75rem;
    border: 1px solid rgba(232,160,32,.15);
    background: #0a0a14;
    overflow: hidden;
    max-width: 100%;
    width: 100%;
    animation: previewIn .5s .1s cubic-bezier(.34,1.2,.64,1) both;
  }
  @keyframes previewIn {
    from { opacity:0; transform:scale(.9) translateY(10px); }
    to   { opacity:1; transform:scale(1) translateY(0); }
  }
  .eb-preview-label {
    padding: .4rem .7rem;
    font-size: .55rem;
    letter-spacing: .2em;
    text-transform: uppercase;
    color: #e8a020;
    border-bottom: 1px solid rgba(232,160,32,.1);
    display: flex;
    align-items: center;
    gap: .5rem;
  }
  .eb-preview-label::before { content: '◈'; font-size: .65rem; }
  .eb-preview svg { display: block; width: 100%; height: auto; }

  /* ── Typing Indicator ── */
  .eb-typing {
    display: flex;
    align-items: center;
    gap: .35rem;
    padding: .75rem 1rem;
    background: rgba(240,235,224,.04);
    border: 1px solid rgba(240,235,224,.08);
    width: fit-content;
    animation: msgIn .3s ease forwards;
    opacity: 0;
  }
  .eb-typing span {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #5a5550;
    animation: typingDot 1.2s ease-in-out infinite;
  }
  .eb-typing span:nth-child(2) { animation-delay: .2s; }
  .eb-typing span:nth-child(3) { animation-delay: .4s; }
  @keyframes typingDot {
    0%,60%,100% { transform:translateY(0); background:#5a5550; }
    30% { transform:translateY(-5px); background:#e8a020; }
  }

  /* ── Input ── */
  .eb-input-area {
    padding: .9rem 1.25rem;
    border-top: 1px solid rgba(240,235,224,.07);
    display: flex;
    gap: .6rem;
    align-items: flex-end;
    background: rgba(232,160,32,.02);
    flex-shrink: 0;
  }
  .eb-input {
    flex: 1;
    background: rgba(240,235,224,.04);
    border: 1px solid rgba(240,235,224,.1);
    color: #f0ebe0;
    padding: .65rem .9rem;
    font-family: 'DM Mono', monospace;
    font-size: .72rem;
    resize: none;
    outline: none;
    transition: border-color .2s;
    max-height: 100px;
    min-height: 38px;
    line-height: 1.6;
    scrollbar-width: none;
    cursor: text;
  }
  .eb-input::-webkit-scrollbar { display: none; }
  .eb-input:focus { border-color: rgba(232,160,32,.4); }
  .eb-input::placeholder { color: #3a3530; }
  .eb-send {
    width: 38px;
    height: 38px;
    background: #e8a020;
    border: none;
    color: #05050a;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all .2s;
    align-self: flex-end;
  }
  .eb-send:hover { background: #f0b030; }
  .eb-send:disabled { background: rgba(232,160,32,.2); color: rgba(5,5,10,.3); }
  .eb-send:active { transform: scale(.93); }
  .eb-send svg { transition: transform .2s; }
  .eb-send:not(:disabled):hover svg { transform: translateX(2px) translateY(-2px); }

  /* ── Footer Branding ── */
  .eb-footer {
    padding: .45rem 1.25rem;
    text-align: center;
    font-size: .52rem;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: #3a3530;
    border-top: 1px solid rgba(240,235,224,.04);
    flex-shrink: 0;
  }
  .eb-footer em { color: #e8a020; font-style: normal; }

  .eb-bubble.streaming {
    background: linear-gradient(90deg,
      rgba(240,235,224,.04) 0%,
      rgba(232,160,32,.08) 50%,
      rgba(240,235,224,.04) 100%);
    background-size: 200% 100%;
    animation: shimmer 1.5s ease-in-out infinite;
  }
  @keyframes shimmer { 0%{background-position:200% 0;} 100%{background-position:-200% 0;} }

  /* ── TABLET ── */
  @media (max-width: 768px) {
    .eb-launcher {
      bottom: 1rem;
      right: 1rem;
    }

    .eb-window {
      right: .5rem;
      bottom: .5rem;
      width: calc(100vw - 1rem);
      max-width: none;
      height: calc(100vh - 5.5rem);
      max-height: calc(100vh - 5.5rem);
      border-radius: 18px;
    }

    .eb-head {
      padding: .95rem 1rem;
      gap: .6rem;
    }

    .eb-avatar {
      width: 32px;
      height: 32px;
    }

    .eb-name {
      font-size: .95rem;
    }

    .eb-status {
      font-size: .52rem;
      letter-spacing: .14em;
    }

    .eb-suggestions {
      padding: .65rem 1rem;
    }

    .eb-chip {
      font-size: .55rem;
      padding: .28rem .6rem;
    }

    .eb-msgs {
      padding: 1rem;
    }

    .eb-bubble {
      max-width: 100%;
      font-size: .72rem;
    }

    .eb-preview {
      max-width: 100%;
    }

    .eb-input-area {
      padding: .75rem 1rem;
    }

    .eb-input {
      font-size: .7rem;
      min-height: 36px;
    }

    .eb-send {
      width: 36px;
      height: 36px;
    }

    .eb-footer {
      padding: .4rem 1rem;
    }
  }

  /* ── MOBILE ── */
  @media (max-width: 480px) {
    .eb-window {
      right: .5rem;
      left: .5rem;
      bottom: .5rem;
      width: calc(100vw - 1rem);
      height: calc(100vh - 4.75rem);
      max-height: calc(100vh - 4.75rem);
      border-radius: 16px;
    }

    .eb-head {
      padding: .85rem .9rem;
    }

    .eb-name {
      font-size: .9rem;
    }

    .eb-status {
      font-size: .5rem;
      letter-spacing: .12em;
      margin-top: .12rem;
    }

    .eb-msg-time {
      font-size: .5rem;
    }

    .eb-preview-label {
      font-size: .5rem;
    }

    .eb-input-area {
      padding: .7rem .9rem;
      gap: .5rem;
    }

    .eb-input {
      font-size: .68rem;
      padding: .6rem .8rem;
    }

    .eb-send {
      width: 34px;
      height: 34px;
    }

    .eb-launcher {
      width: 52px;
      height: 52px;
      bottom: .9rem;
      right: .9rem;
    }
  }

  /* ── VERY SMALL SCREENS ── */
  @media (max-width: 360px) {
    .eb-window {
      height: calc(100vh - 4rem);
      max-height: calc(100vh - 4rem);
    }

    .eb-bubble {
      font-size: .68rem;
      line-height: 1.75;
    }

    .eb-chip {
      font-size: .5rem;
    }
  }
`;

const API_KEY = process.env.REACT_APP_DEEPSEEK_API_KEY;
const API_URL =
  process.env.REACT_APP_DEEPSEEK_API_URL || "https://api.deepseek.com/chat/completions";

const SYSTEM_PROMPT = `You are Ethereal Bot, the intelligent assistant for Ethereal Design Studio — a premium web design and digital product agency based in Hyderabad, India, working globally.

About Ethereal Design Studio:
- Founded 2016, team of 14 strategists, designers, and engineers
- Specialises in: Brand Identity, UX/Product Design, Web Development, and AI-Powered Design
- Clients: fintech, health, enterprise SaaS, consumer apps
- Based in Hyderabad, India — working globally
- Email: hello@etherealdesign.io
- Availability: Open Q3 2025
- Pricing: Projects typically start at ₹2L for branding, ₹5L for full product design, ₹8L+ for full-stack builds

Your personality:
- Warm, articulate, slightly poetic — matches the studio's luxury aesthetic
- Use "we" when referring to the studio
- Be concise but thoughtful
- You can discuss: services, pricing, timeline, portfolio, design philosophy, tech stack

DESIGN PREVIEW INSTRUCTIONS (very important):
When a user asks about a specific type of design (e.g., "I need a landing page for a fintech app", "show me an e-commerce design", "design a SaaS dashboard"), you MUST include a design preview block in your response.

Format your design preview as JSON at the end of your message inside <PREVIEW> tags like this:
<PREVIEW>{"type":"landing_page","palette":["#0a0a14","#e8a020","#f0ebe0"],"style":"minimal dark","elements":["hero","nav","cta","cards"],"label":"Fintech Landing Page"}</PREVIEW>

Only include PREVIEW when the user is genuinely asking about a specific design or requesting to see something. For general questions, company info, pricing — NO preview needed.`;

function generatePreviewSVG(data) {
  const { type, palette } = data;
  const bg = palette?.[0] || "#0a0a14";

  const designs = {
    landing_page: `<rect width="340" height="220" fill="${bg}"/>`,
    saas_dashboard: `<rect width="340" height="220" fill="${bg}"/>`,
    ecommerce: `<rect width="340" height="220" fill="${bg}"/>`,
    mobile_app: `<rect width="340" height="220" fill="${bg}"/>`,
    portfolio: `<rect width="340" height="220" fill="${bg}"/>`,
    branding: `<rect width="340" height="220" fill="${bg}"/>`,
  };

  const typeKey = type?.toLowerCase().replace(/[\s-]/g, "_") || "landing_page";
  const svgContent = designs[typeKey] || designs.landing_page;

  return `<svg viewBox="0 0 340 220" xmlns="http://www.w3.org/2000/svg">${svgContent}</svg>`;
}

function parseResponse(raw) {
  const match = raw.match(/<PREVIEW>([\s\S]*?)<\/PREVIEW>/);
  let previewData = null;
  let text = raw.replace(/<PREVIEW>[\s\S]*?<\/PREVIEW>/g, "").trim();
  if (match) {
    try {
      previewData = JSON.parse(match[1]);
    } catch {}
  }
  return { text, previewData };
}

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const SUGGESTIONS = [
  "Show a landing page design",
  "Services & pricing?",
  "Show a SaaS dashboard",
  "Portfolio work?",
  "Show mobile app UI",
];

const WELCOME = {
  role: "bot",
  text: "Hello — I'm *Ethereal Bot*, your guide to the studio. ✦\n\nI can walk you through our services, share pricing, and even show you live design previews tailored to your project. What are you building?",
  time: now(),
  preview: null,
};

export default function EtherealBot({ forceOpen = false, onClose }) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showBadge, setShowBadge] = useState(true);
  const msgsRef = useRef(null);
  const inputRef = useRef(null);
  const historyRef = useRef([]);

  useEffect(() => {
    if (!document.getElementById("eb-styles")) {
      const s = document.createElement("style");
      s.id = "eb-styles";
      s.textContent = BOT_CSS;
      document.head.appendChild(s);
    }
  }, []);

  useEffect(() => {
    if (forceOpen && !open) {
      setOpen(true);
      setShowBadge(false);
    }
  }, [forceOpen, open]);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages, loading]);

  useEffect(() => {
    if (open && inputRef.current) {
      const t = setTimeout(() => inputRef.current?.focus(), 250);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [open]);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
      if (onClose) onClose();
    }, 240);
  }, [onClose]);

  const handleOpen = useCallback(() => {
    setOpen(true);
    setShowBadge(false);
  }, []);

  const sendMessage = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    if (!API_KEY) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "The API key is missing. Add it to your .env file and restart the app.",
          time: now(),
          preview: null,
        },
      ]);
      return;
    }

    setInput("");

    const userMsg = { role: "user", text: trimmed, time: now(), preview: null };
    setMessages((prev) => [...prev, userMsg]);

    historyRef.current = [...historyRef.current, { role: "user", content: trimmed }];
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-v4-flash",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...historyRef.current,
          ],
          max_tokens: 800,
          stream: false,
        }),
      });

      const data = await res.json();
      const raw =
        data?.choices?.[0]?.message?.content ||
        "I'm having a moment — could you try again?";

      const { text: parsedText, previewData } = parseResponse(raw);

      historyRef.current = [...historyRef.current, { role: "assistant", content: raw }];
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: parsedText, time: now(), preview: previewData },
      ]);
    } catch (err) {
      console.error("EtherealBot error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Something went sideways on my end. Please try again in a moment.",
          time: now(),
          preview: null,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const handleKey = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }, [input, sendMessage]);

  const renderText = (text) =>
    text.split(/(\*[^*]+\*)/g).map((chunk, i) =>
      chunk.startsWith("*") && chunk.endsWith("*")
        ? <em key={i} style={{ color: "#e8a020", fontStyle: "normal" }}>{chunk.slice(1, -1)}</em>
        : chunk
    );

  return (
    <>
      <button className="eb-launcher" onClick={open ? handleClose : handleOpen} aria-label="Open Ethereal Bot">
        {showBadge && !open && <span className="eb-unread">1</span>}
        {open ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 5L15 15M15 5L5 15" stroke="#05050a" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M11 2C6.03 2 2 5.58 2 10c0 1.85.67 3.55 1.77 4.9L2.5 19l4.37-1.42C8.2 18.17 9.56 18.5 11 18.5c4.97 0 9-3.58 9-8s-4.03-8.5-9-8.5z" fill="#05050a" />
            <circle cx="7.5" cy="10" r="1.2" fill="rgba(5,5,10,.6)"/>
            <circle cx="11" cy="10" r="1.2" fill="rgba(5,5,10,.6)"/>
            <circle cx="14.5" cy="10" r="1.2" fill="rgba(5,5,10,.6)"/>
          </svg>
        )}
      </button>

      {open && (
        <div className={`eb-window${closing ? " closing" : ""}`}>
          <div className="eb-head">
            <div className="eb-avatar">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 1L11.5 6.5H17L12.5 10L14 16L9 13L4 16L5.5 10L1 6.5H6.5L9 1Z" fill="#05050a"/>
              </svg>
            </div>
            <div className="eb-head-info">
              <div className="eb-name">Ethe<em>real</em> Bot</div>
              <div className="eb-status">Online · Ready to help</div>
            </div>
            <button className="eb-close" onClick={handleClose} aria-label="Close">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <div className="eb-suggestions">
            {SUGGESTIONS.map((s) => (
              <button key={s} className="eb-chip" onClick={() => sendMessage(s)}>
                {s}
              </button>
            ))}
          </div>

          <div className="eb-msgs" ref={msgsRef}>
            {messages.map((msg, i) => (
              <div key={i} className={`eb-msg ${msg.role}`}>
                <div className="eb-bubble" style={{ whiteSpace: "pre-line" }}>
                  {renderText(msg.text)}
                </div>
                {msg.preview && (
                  <div className="eb-preview">
                    <div className="eb-preview-label">{msg.preview.label || "Design Preview"}</div>
                    <div dangerouslySetInnerHTML={{ __html: generatePreviewSVG(msg.preview) }} />
                  </div>
                )}
                <div className="eb-msg-time">{msg.time}</div>
              </div>
            ))}

            {loading && (
              <div className="eb-msg bot">
                <div className="eb-typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
          </div>

          <div className="eb-input-area">
            <textarea
              ref={inputRef}
              className="eb-input"
              placeholder="Ask about design, pricing, our work…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              rows={1}
            />
            <button
              className="eb-send"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              aria-label="Send"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M14 2L2 6.5L7 8.5L9 14L14 2Z" fill="currentColor"/>
              </svg>
            </button>
          </div>

          <div className="eb-footer">
            Powered by <em>Ethereal Studio</em> · AI assistant
          </div>
        </div>
      )}
    </>
  );
}
