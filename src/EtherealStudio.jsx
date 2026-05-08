import { useState, useEffect, useRef, useCallback } from "react";

const buildCSS = (dark) => `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
  :root{
    --bg:${dark?"#05050a":"#f5f0e8"};
    --bg2:${dark?"#0b0b12":"#ede8dc"};
    --bg3:${dark?"#111118":"#e5dfd1"};
    --cream:${dark?"#f0ebe0":"#1a1510"};
    --cream2:${dark?"#9a9590":"#5a5045"};
    --cream3:${dark?"#5a5550":"#9a9080"};
    --amber:#e8a020;
    --amber2:rgba(232,160,32,0.12);
    --border:${dark?"rgba(240,235,224,0.08)":"rgba(26,21,16,0.1)"};
    --border2:${dark?"rgba(240,235,224,0.15)":"rgba(26,21,16,0.18)"};
    --serif:'Cormorant Garamond',Georgia,serif;
    --mono:'DM Mono','Courier New',monospace;
    --shadow:${dark?"0 8px 40px rgba(0,0,0,.6)":"0 8px 40px rgba(0,0,0,.12)"};
  }
  html{scroll-behavior:smooth;background:var(--bg);}
  body{background:var(--bg);color:var(--cream);font-family:var(--mono);overflow-x:hidden;cursor:auto;}
  ::selection{background:var(--amber);color:#05050a;}
  a{text-decoration:none;color:inherit;}
  button{cursor:pointer;}

  /* ── THEME TOGGLE ── */
  .theme-btn{
    position:fixed;top:1.15rem;right:1rem;z-index:9000;
    width:42px;height:24px;
    border-radius:12px;
    background:${dark?"rgba(232,160,32,.15)":"rgba(26,21,16,.1)"};
    border:1px solid ${dark?"rgba(232,160,32,.3)":"rgba(26,21,16,.2)"};
    display:flex;align-items:center;padding:3px;
    transition:background .3s,border .3s;
    flex-shrink:0;
  }
  .theme-btn-knob{
    width:16px;height:16px;border-radius:50%;
    background:var(--amber);
    transform:translateX(${dark?"0":"18px"});
    transition:transform .35s cubic-bezier(.34,1.56,.64,1);
    display:flex;align-items:center;justify-content:center;font-size:8px;
  }

  /* ── NAV ── */
  nav{
    position:fixed;top:0;left:0;right:0;z-index:800;
    display:flex;align-items:center;justify-content:space-between;
    padding:1.4rem 6rem 1.4rem 2.5rem;
    transition:all .3s;
  }
  nav.scrolled{
    background:${dark?"rgba(5,5,10,0.88)":"rgba(245,240,232,0.92)"};
    backdrop-filter:blur(24px);
    border-bottom:1px solid var(--border);
  }
  .nav-logo{font-family:var(--serif);font-size:1.45rem;font-weight:600;letter-spacing:-.02em;}
  .nav-logo em{font-style:italic;color:var(--amber);}
  .nav-links{display:flex;gap:2rem;list-style:none;}
  .nav-links a{font-size:.68rem;letter-spacing:.18em;text-transform:uppercase;color:var(--cream2);transition:color .2s;}
  .nav-links a:hover{color:var(--amber);}
  .nav-cta{
    font-size:.68rem;letter-spacing:.12em;text-transform:uppercase;
    padding:.5rem 1.3rem;border:1px solid var(--amber);color:var(--amber);
    background:transparent;transition:all .2s;
  }
  .nav-cta:hover{background:var(--amber);color:#05050a;}
  .nav-right{display:flex;align-items:center;gap:1rem;}

  /* ── HERO ── */
  .hero{
    min-height:100vh;position:relative;overflow:hidden;
    display:flex;flex-direction:column;justify-content:flex-end;
    padding:2.5rem;
    padding-top:6rem;
  }
  .hero-bg{position:absolute;inset:0;background:var(--bg);}
  .orb{position:absolute;border-radius:50%;pointer-events:none;}
  .orb1{
    width:500px;height:500px;
    background:radial-gradient(circle,${dark?"rgba(232,160,32,.09)":"rgba(232,160,32,.12)"} 0%,transparent 70%);
    top:-80px;right:-80px;
    animation:drift1 18s ease-in-out infinite;
  }
  .orb2{
    width:350px;height:350px;
    background:radial-gradient(circle,${dark?"rgba(120,80,220,.06)":"rgba(120,80,220,.07)"} 0%,transparent 70%);
    bottom:0;left:8%;
    animation:drift2 22s ease-in-out infinite;
  }
  .orb3{
    width:180px;height:180px;
    background:radial-gradient(circle,${dark?"rgba(232,160,32,.07)":"rgba(232,160,32,.1)"} 0%,transparent 70%);
    top:40%;left:42%;
    animation:drift1 14s ease-in-out infinite reverse;
  }
  @keyframes drift1{0%,100%{transform:translate(0,0);}33%{transform:translate(40px,-30px);}66%{transform:translate(-20px,20px);}}
  @keyframes drift2{0%,100%{transform:translate(0,0);}50%{transform:translate(-50px,-40px);}}
  .grid-overlay{
    position:absolute;inset:0;
    background-image:
      linear-gradient(${dark?"rgba(240,235,224,.022)":"rgba(26,21,16,.04)"} 1px,transparent 1px),
      linear-gradient(90deg,${dark?"rgba(240,235,224,.022)":"rgba(26,21,16,.04)"} 1px,transparent 1px);
    background-size:65px 65px;
  }
  .hero-year{
    position:absolute;top:6rem;right:2.5rem;
    font-size:.62rem;letter-spacing:.3em;color:var(--cream3);
    animation:fadeUp .6s .5s ease both;
  }
  .hero-scroll{
    position:absolute;bottom:2.5rem;right:2.5rem;
    font-size:.58rem;letter-spacing:.25em;text-transform:uppercase;
    color:var(--cream3);display:flex;flex-direction:column;align-items:center;gap:.8rem;
  }
  .scroll-line{
    width:1px;height:55px;
    background:linear-gradient(to bottom,var(--amber),transparent);
    animation:scrollPulse 2s ease-in-out infinite;
  }
  @keyframes scrollPulse{0%,100%{opacity:.3;transform:scaleY(1);}50%{opacity:1;transform:scaleY(.6);}}
  .hero-eyebrow{
    font-size:.62rem;letter-spacing:.35em;text-transform:uppercase;
    color:var(--amber);margin-bottom:1.2rem;position:relative;z-index:1;
    opacity:0;animation:fadeUp .8s .2s ease forwards;
    display:flex;align-items:center;gap:.75rem;
  }
  .hero-eyebrow::before{content:'';width:1.5rem;height:1px;background:var(--amber);}

  /* HERO TITLE — SMALLER */
  .hero-title{
    font-family:var(--serif);
    font-size:clamp(2.2rem,5.5vw,5.8rem);
    font-weight:300;line-height:.98;letter-spacing:-.025em;
    position:relative;z-index:1;margin-bottom:2.5rem;
    max-width:700px;
  }
  .hero-title .line{overflow:hidden;display:block;}
  .hero-title .line span{display:block;opacity:0;animation:lineUp 1s ease forwards;}
  .hero-title .line:nth-child(1) span{animation-delay:.3s;}
  .hero-title .line:nth-child(2) span{animation-delay:.5s;}
  .hero-title .line:nth-child(3) span{animation-delay:.7s;}
  .hero-title em{font-style:italic;color:var(--amber);}
  @keyframes lineUp{from{opacity:0;transform:translateY(100%);}to{opacity:1;transform:translateY(0);}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}

  /* ── BOT CTA WIDGET ── */
  .bot-widget{
    position:relative;z-index:2;
    margin-bottom:2.5rem;
    display:inline-flex;
    align-items:center;
    gap:0;
    animation:fadeUp .8s .9s ease both;
    opacity:0;
  }
  .bot-widget-card{
    background:${dark?"rgba(232,160,32,.07)":"rgba(232,160,32,.1)"};
    border:1px solid rgba(232,160,32,.25);
    border-radius:2px;
    padding:1rem 1.25rem;
    display:flex;
    align-items:center;
    gap:1.25rem;
    position:relative;
    overflow:hidden;
    max-width:500px;
    backdrop-filter:blur(8px);
    transition:border-color .3s,background .3s;
  }
  .bot-widget-card:hover{
    border-color:rgba(232,160,32,.5);
    background:${dark?"rgba(232,160,32,.1)":"rgba(232,160,32,.15)"};
  }
  .bot-widget-card::before{
    content:'';position:absolute;
    top:-30px;right:-30px;
    width:100px;height:100px;
    border-radius:50%;
    background:radial-gradient(circle,rgba(232,160,32,.15) 0%,transparent 70%);
    animation:orbitGlow 4s ease-in-out infinite;
  }
  @keyframes orbitGlow{0%,100%{transform:translate(0,0);}50%{transform:translate(-10px,10px);}}
  .bot-icon-wrap{
    width:40px;height:40px;
    border-radius:50%;
    background:linear-gradient(135deg,#e8a020,#c47a10);
    display:flex;align-items:center;justify-content:center;
    flex-shrink:0;
    box-shadow:0 0 0 0 rgba(232,160,32,.4);
    animation:iconPulse 2.5s ease-in-out infinite;
    position:relative;z-index:1;
  }
  @keyframes iconPulse{
    0%,100%{box-shadow:0 0 0 0 rgba(232,160,32,.4);}
    50%{box-shadow:0 0 0 8px rgba(232,160,32,0);}
  }
  .bot-widget-text{flex:1;position:relative;z-index:1;}
  .bot-widget-title{
    font-family:var(--serif);font-size:1rem;font-weight:500;
    letter-spacing:-.01em;color:var(--cream);
    margin-bottom:.2rem;line-height:1.3;
  }
  .bot-widget-title em{color:var(--amber);font-style:italic;}
  .bot-points{
    display:flex;flex-wrap:wrap;gap:.4rem .9rem;margin-bottom:.7rem;margin-top:.3rem;
  }
  .bot-point{
    font-size:.58rem;letter-spacing:.12em;text-transform:uppercase;
    color:var(--cream2);display:flex;align-items:center;gap:.3rem;
  }
  .bot-point::before{content:'✦';color:var(--amber);font-size:.5rem;}
  .bot-open-btn{
    font-size:.62rem;letter-spacing:.15em;text-transform:uppercase;
    padding:.5rem 1.1rem;
    background:var(--amber);
    color:#05050a;
    border:none;
    font-family:var(--mono);
    font-weight:700;
    display:inline-flex;align-items:center;gap:.5rem;
    transition:all .22s;
    white-space:nowrap;
  }
  .bot-open-btn:hover{
    background:#f0b030;
    transform:translateY(-1px);
    box-shadow:0 6px 20px rgba(232,160,32,.3);
  }
  .bot-open-btn:active{transform:translateY(0);}
  .bot-open-btn svg{transition:transform .2s;}
  .bot-open-btn:hover svg{transform:translateX(3px);}

  /* Hero bottom */
  .hero-bottom{
    display:flex;justify-content:space-between;align-items:flex-end;
    position:relative;z-index:1;
    border-top:1px solid var(--border);padding-top:1.8rem;
    opacity:0;animation:fadeUp .8s 1.1s ease forwards;
  }
  .hero-desc{max-width:320px;font-size:.78rem;line-height:1.9;color:var(--cream2);letter-spacing:.02em;}
  .hero-stats{display:flex;gap:2.5rem;}
  .hero-stat{text-align:right;}
  .stat-num{font-family:var(--serif);font-size:2.6rem;font-weight:600;color:var(--cream);line-height:1;display:block;}
  .stat-num em{color:var(--amber);font-style:normal;}
  .stat-lbl{font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:var(--cream2);margin-top:.15rem;display:block;}

  /* ── MARQUEE ── */
  .marquee{
    border-top:1px solid var(--border);border-bottom:1px solid var(--border);
    overflow:hidden;padding:.9rem 0;background:var(--bg2);
  }
  .marquee-track{display:flex;gap:2.5rem;animation:marquee 28s linear infinite;white-space:nowrap;}
  @keyframes marquee{from{transform:translateX(0);}to{transform:translateX(-50%);}}
  .m-item{font-size:.62rem;letter-spacing:.25em;text-transform:uppercase;color:var(--cream2);display:flex;align-items:center;gap:2rem;}
  .m-dot{width:4px;height:4px;border-radius:50%;background:var(--amber);flex-shrink:0;}

  /* ── SECTIONS ── */
  .section{padding:7rem 2.5rem;}
  .section.dark{background:var(--bg);}
  .section.mid{background:var(--bg2);}
  .section.deep{background:var(--bg3);}
  .s-label{
    font-size:.58rem;letter-spacing:.35em;text-transform:uppercase;
    color:var(--amber);margin-bottom:.9rem;
    display:flex;align-items:center;gap:.9rem;
  }
  .s-label::before{content:'';width:1.8rem;height:1px;background:var(--amber);}
  .s-title{
    font-family:var(--serif);
    font-size:clamp(2rem,4vw,4rem);
    font-weight:300;line-height:1.1;letter-spacing:-.02em;margin-bottom:3.5rem;
  }
  .s-title em{font-style:italic;}

  /* ── REVEAL ANIMATIONS ── */
  .reveal{opacity:0;transform:translateY(36px);transition:opacity .85s ease,transform .85s ease;}
  .reveal.vis{opacity:1;transform:translateY(0);}
  .reveal-l{opacity:0;transform:translateX(-36px);transition:opacity .85s ease,transform .85s ease;}
  .reveal-l.vis{opacity:1;transform:translateX(0);}
  .reveal-r{opacity:0;transform:translateX(36px);transition:opacity .85s ease,transform .85s ease;}
  .reveal-r.vis{opacity:1;transform:translateX(0);}
  .delay1{transition-delay:.1s;}.delay2{transition-delay:.2s;}.delay3{transition-delay:.3s;}.delay4{transition-delay:.4s;}

  /* ── SERVICES ── */
  .svc-grid{display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--border);}
  .svc-card{
    padding:2.75rem;border:1px solid var(--border);
    position:relative;overflow:hidden;transition:background .3s;
  }
  .svc-card:hover{background:var(--bg3);}
  .svc-card::after{content:'';position:absolute;bottom:0;left:0;width:0;height:2px;background:var(--amber);transition:width .5s ease;}
  .svc-card:hover::after{width:100%;}
  .svc-card::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at var(--mx,50%) var(--my,50%),rgba(232,160,32,.06) 0%,transparent 60%);opacity:0;transition:opacity .3s;}
  .svc-card:hover::before{opacity:1;}
  .svc-n{font-size:.58rem;letter-spacing:.25em;color:var(--amber);margin-bottom:1.8rem;}
  .svc-icon{width:44px;height:44px;margin-bottom:1.4rem;display:flex;align-items:center;justify-content:center;border:1px solid var(--border2);}
  .svc-h{font-family:var(--serif);font-size:1.8rem;font-weight:400;margin-bottom:.8rem;letter-spacing:-.01em;}
  .svc-p{font-size:.73rem;line-height:1.95;color:var(--cream2);}
  .svc-tags{display:flex;flex-wrap:wrap;gap:.45rem;margin-top:1.4rem;}
  .tag{font-size:.53rem;letter-spacing:.15em;text-transform:uppercase;padding:.28rem .65rem;border:1px solid var(--border);color:var(--cream3);}

  /* ── PROCESS ── */
  .proc-grid{display:grid;grid-template-columns:1fr 2fr;gap:5rem;align-items:start;}
  .proc-sticky{position:sticky;top:8rem;}
  .proc-big{font-family:var(--serif);font-size:7rem;font-weight:700;color:${dark?"rgba(240,235,224,.04)":"rgba(26,21,16,.04)"};line-height:1;margin-bottom:.8rem;}
  .proc-steps{display:flex;flex-direction:column;}
  .proc-step{
    padding:2rem 0;border-bottom:1px solid var(--border);
    display:grid;grid-template-columns:65px 1fr;gap:1.4rem;align-items:start;transition:all .2s;
  }
  .proc-step:hover .ps-h{color:var(--amber);}
  .proc-step:first-child{border-top:1px solid var(--border);}
  .ps-n{font-family:var(--serif);font-size:.85rem;color:var(--amber);font-weight:600;padding-top:.15rem;}
  .ps-h{font-family:var(--serif);font-size:1.3rem;font-weight:400;margin-bottom:.5rem;transition:color .2s;}
  .ps-p{font-size:.72rem;line-height:1.95;color:var(--cream2);}

  /* ── WORK ── */
  .work-hdr{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:2.5rem;}
  .work-hint{font-size:.62rem;letter-spacing:.2em;text-transform:uppercase;color:var(--cream3);display:flex;align-items:center;gap:.75rem;}
  .work-scroll{display:flex;gap:1.4rem;overflow-x:auto;padding-bottom:2.5rem;scroll-snap-type:x mandatory;scrollbar-width:none;}
  .work-scroll::-webkit-scrollbar{display:none;}
  .proj-card{flex-shrink:0;width:340px;scroll-snap-align:start;border:1px solid var(--border);overflow:hidden;transition:border-color .3s,transform .3s;}
  .proj-card:hover{border-color:rgba(232,160,32,.4);transform:translateY(-4px);}
  .proj-vis{height:240px;position:relative;overflow:hidden;}
  .proj-vis svg{width:100%;height:100%;}
  .proj-info{padding:1.4rem;}
  .proj-type{font-size:.56rem;letter-spacing:.22em;text-transform:uppercase;color:var(--amber);margin-bottom:.35rem;}
  .proj-name{font-family:var(--serif);font-size:1.45rem;font-weight:400;margin-bottom:.35rem;letter-spacing:-.01em;color:var(--cream);}
  .proj-meta{font-size:.62rem;color:var(--cream3);display:flex;justify-content:space-between;margin-top:.7rem;padding-top:.7rem;border-top:1px solid var(--border);}

  /* ── ABOUT ── */
  .about-grid{display:grid;grid-template-columns:1fr 1fr;gap:4.5rem;align-items:center;}
  .about-vis{aspect-ratio:1;position:relative;overflow:hidden;border:1px solid var(--border);}
  .about-content p{font-size:.8rem;line-height:1.95;color:var(--cream2);margin-bottom:1.4rem;}
  .about-content p:first-child{font-family:var(--serif);font-size:1.35rem;font-weight:300;line-height:1.6;color:var(--cream);font-style:italic;}
  .about-link{display:inline-flex;align-items:center;gap:.75rem;font-size:.68rem;letter-spacing:.18em;text-transform:uppercase;color:var(--amber);margin-top:1rem;transition:gap .2s;}
  .about-link:hover{gap:1.2rem;}
  .about-link span{width:1.8rem;height:1px;background:var(--amber);transition:width .2s;}
  .about-link:hover span{width:2.8rem;}
  .team-chips{display:flex;gap:.65rem;flex-wrap:wrap;margin-top:1.8rem;}
  .team-chip{display:flex;align-items:center;gap:.55rem;padding:.45rem .9rem;border:1px solid var(--border);transition:border-color .2s;}
  .team-chip:hover{border-color:rgba(232,160,32,.3);}
  .chip-avatar{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.58rem;font-weight:700;}
  .chip-name{font-size:.62rem;letter-spacing:.08em;color:var(--cream);}
  .chip-role{font-size:.53rem;color:var(--cream3);}

  /* ── TESTIMONIALS ── */
  .testi{text-align:center;}
  .testi-q{font-family:var(--serif);font-size:clamp(1.3rem,2.5vw,2.1rem);font-weight:300;font-style:italic;line-height:1.55;letter-spacing:-.01em;max-width:680px;margin:0 auto;transition:opacity .4s;color:var(--cream);}
  .testi-q.fade{opacity:0;}
  .testi-author{margin-top:2rem;font-size:.62rem;letter-spacing:.22em;text-transform:uppercase;color:var(--amber);}
  .testi-role{font-size:.58rem;color:var(--cream3);margin-top:.22rem;}
  .testi-dots{display:flex;gap:.55rem;justify-content:center;margin-top:2rem;}
  .td{width:22px;height:2px;background:var(--border2);transition:background .2s,width .2s;cursor:pointer;}
  .td.active{background:var(--amber);width:38px;}

  /* ── CONTACT ── */
  .contact-wrap{display:grid;grid-template-columns:1fr 1fr;gap:5.5rem;align-items:start;}
  .contact-big{font-family:var(--serif);font-size:clamp(2.5rem,6.5vw,6.5rem);font-weight:300;line-height:.95;letter-spacing:-.04em;margin-bottom:1.8rem;color:var(--cream);}
  .contact-big em{font-style:italic;color:var(--amber);}
  .contact-sub{font-size:.76rem;color:var(--cream2);line-height:1.9;max-width:380px;}
  .contact-form{display:flex;flex-direction:column;gap:.85rem;}
  .c-row{display:grid;grid-template-columns:1fr 1fr;gap:.85rem;}
  input,textarea,select{
    background:transparent;border:1px solid var(--border);
    color:var(--cream);padding:.85rem 1rem;
    font-family:var(--mono);font-size:.73rem;width:100%;
    transition:border-color .2s;outline:none;appearance:none;
  }
  input:focus,textarea:focus{border-color:var(--amber);}
  input::placeholder,textarea::placeholder{color:var(--cream3);}
  textarea{height:120px;resize:none;}
  .btn-send{
    width:fit-content;padding:.85rem 2.3rem;background:var(--amber);color:#05050a;
    font-family:var(--mono);font-size:.68rem;letter-spacing:.18em;text-transform:uppercase;
    border:none;font-weight:700;transition:opacity .2s,transform .1s;
  }
  .btn-send:hover{opacity:.88;}
  .btn-send:active{transform:scale(.98);}
  .contact-info{margin-top:2.2rem;display:flex;flex-direction:column;gap:.9rem;}
  .ci-row{display:flex;justify-content:space-between;padding:.7rem 0;border-bottom:1px solid var(--border);}
  .ci-label{font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:var(--cream3);}
  .ci-val{font-size:.73rem;color:var(--cream2);}

  /* ── FOOTER ── */
  footer{
    background:var(--bg);border-top:1px solid var(--border);
    padding:2.2rem 2.5rem;
    display:flex;justify-content:space-between;align-items:center;
    flex-wrap:wrap;gap:1rem;
  }
  .f-logo{font-family:var(--serif);font-size:1.15rem;color:var(--cream);}
  .f-logo em{color:var(--amber);font-style:italic;}
  .f-links{display:flex;gap:1.8rem;list-style:none;flex-wrap:wrap;}
  .f-links a{font-size:.6rem;letter-spacing:.18em;text-transform:uppercase;color:var(--cream3);transition:color .2s;}
  .f-links a:hover{color:var(--amber);}
  .f-copy{font-size:.58rem;color:var(--cream3);letter-spacing:.08em;}

  /* ── MOBILE ── */
  @media(max-width:900px){
    nav{padding:1.1rem 4.5rem 1.1rem 1.2rem;}
    .nav-links{display:none;}
    .nav-cta{display:none;}
    .nav-right{gap:.6rem;}
    .hero{padding:1.5rem;padding-top:5rem;}
    .hero-year{display:none;}
    .hero-scroll{display:none;}
    .hero-title{font-size:clamp(2rem,7vw,3.8rem);max-width:100%;}
    .hero-bottom{flex-direction:column;gap:1.5rem;align-items:flex-start;}
    .hero-desc{max-width:100%;}
    .hero-stats{gap:1.5rem;}
    .stat-num{font-size:2.1rem;}
    .bot-widget-card{flex-direction:column;align-items:flex-start;gap:.85rem;max-width:100%;}
    .bot-points{gap:.3rem .75rem;}
    .section{padding:4.5rem 1.5rem;}
    .svc-grid{grid-template-columns:1fr;}
    .proc-grid{grid-template-columns:1fr;gap:2.5rem;}
    .proc-sticky{position:static;}
    .about-grid{grid-template-columns:1fr;gap:2.5rem;}
    .about-vis{max-height:240px;}
    .contact-wrap{grid-template-columns:1fr;gap:3rem;}
    .c-row{grid-template-columns:1fr;}
    .work-hdr{flex-direction:column;align-items:flex-start;gap:1rem;}
    footer{flex-direction:column;text-align:center;}
    .f-links{justify-content:center;}
    .s-title{font-size:clamp(1.8rem,5vw,3rem);}
    .contact-big{font-size:clamp(2.2rem,8vw,4.5rem);}
    .proc-big{font-size:5rem;}
    .theme-btn{top:1.05rem;right:1rem;}
  }
  @media(max-width:480px){
    .hero{padding:1.2rem;padding-top:4.5rem;}
    .hero-title{font-size:clamp(1.8rem,8vw,3rem);}
    .bot-widget{width:100%;}
    .bot-widget-card{width:100%;}
    .section{padding:3.5rem 1.2rem;}
    .hero-stats{gap:1.2rem;}
    .stat-num{font-size:1.8rem;}
    .marquee-track{animation-duration:20s;}
    nav{padding:.9rem 4rem .9rem 1rem;}
  }

  /* ── EXTRA ANIMATIONS ── */
  @keyframes floatUp{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
  @keyframes shimmerBar{0%{background-position:200% 0;}100%{background-position:-200% 0;}}
  @keyframes rotateRing{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
  @keyframes scaleIn{from{transform:scale(.9);opacity:0;}to{transform:scale(1);opacity:1;}}

  .float-anim{animation:floatUp 4s ease-in-out infinite;}
  .rotate-ring{animation:rotateRing 20s linear infinite;}

  /* Hover shimmer on cards */
  .proj-card:hover .proj-vis::after{
    content:'';position:absolute;inset:0;
    background:linear-gradient(90deg,transparent,rgba(232,160,32,.05),transparent);
    background-size:200% 100%;
    animation:shimmerBar 1.5s ease-in-out;
  }
`;

const ITEMS = ["UI/UX Design","Digital Strategy","Web Development","Brand Systems","AI-Powered Design","Motion Design","Product Thinking","Design Systems"];
const MARQUEE_ITEMS = [...ITEMS,...ITEMS,...ITEMS,...ITEMS];

const SERVICES = [
  {n:"01",icon:<svg viewBox="0 0 24 24" fill="none" stroke="#e8a020" strokeWidth="1.2" width="24" height="24"><rect x="2" y="3" width="20" height="14" rx="1"/><path d="M8 21h8M12 17v4"/></svg>,title:"UI/UX Design",desc:"We craft interfaces that vanish into usefulness. Every interaction is choreographed so users reach their goals faster, with less friction, more delight.",tags:["Figma","Prototyping","User Research","Accessibility"]},
  {n:"02",icon:<svg viewBox="0 0 24 24" fill="none" stroke="#e8a020" strokeWidth="1.2" width="24" height="24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,title:"Product Strategy",desc:"Ruthless prioritisation. We map your users' mental models, find the paths of least resistance, and build a roadmap that ships value early and often.",tags:["Roadmapping","OKRs","Discovery","Metrics"]},
  {n:"03",icon:<svg viewBox="0 0 24 24" fill="none" stroke="#e8a020" strokeWidth="1.2" width="24" height="24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,title:"Web Development",desc:"Pixel-perfect, performant builds. We close the design-code gap and ship production-ready frontends that maintain their integrity at every breakpoint.",tags:["React","Next.js","TypeScript","Motion"]},
  {n:"04",icon:<svg viewBox="0 0 24 24" fill="none" stroke="#e8a020" strokeWidth="1.2" width="24" height="24"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>,title:"AI-Powered Design",desc:"LLM integrations that feel native, not bolted-on. We design for probabilistic systems, crafting UX patterns that make AI assistance trustworthy and legible.",tags:["LLM Integration","Prompt UX","AI Flows","Safety"]}
];

const STEPS = [
  {n:"I",title:"Discover & Diagnose",desc:"We embed in your problem space. User interviews, competitor audits, heuristic reviews — we build a shared picture of what's broken and what's possible."},
  {n:"II",title:"Strategy & Systems",desc:"Before pixels, architecture. We define information hierarchies, design systems tokens, and map every user journey to a measurable outcome."},
  {n:"III",title:"Design & Prototype",desc:"High-fidelity mockups with living prototypes. Every decision is grounded in rationale. We test assumptions, kill darlings, iterate fast."},
  {n:"IV",title:"Build & Ship",desc:"We hand off component libraries, design tokens, and annotated specs. Then we stay in the build loop — QAing, refining, making sure the vision survives engineering."},
  {n:"V",title:"Measure & Evolve",desc:"Launch is not the end. We track the metrics we set in discovery, identify the next lever, and keep compound-improving."}
];

const PROJECTS = [
  {type:"SaaS Dashboard",name:"Orbital Analytics",year:"2024",client:"FinTech",vis:<svg viewBox="0 0 370 260" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="370" height="260" fill="#0a0a14"/><circle cx="260" cy="100" r="120" fill="rgba(232,160,32,.06)"/><circle cx="260" cy="100" r="80" stroke="rgba(232,160,32,.12)" strokeWidth="1"/><circle cx="260" cy="100" r="40" stroke="rgba(232,160,32,.2)" strokeWidth="1"/><circle cx="260" cy="100" r="8" fill="rgba(232,160,32,.8)"/><rect x="30" y="30" width="140" height="8" rx="2" fill="rgba(240,235,224,.12)"/><rect x="30" y="48" width="80" height="6" rx="2" fill="rgba(240,235,224,.06)"/><rect x="30" y="80" width="120" height="1" fill="rgba(240,235,224,.06)"/><rect x="30" y="95" width="30" height="40" rx="1" fill="rgba(232,160,32,.2)"/><rect x="70" y="75" width="30" height="60" rx="1" fill="rgba(232,160,32,.35)"/><rect x="110" y="85" width="30" height="50" rx="1" fill="rgba(232,160,32,.15)"/><path d="M30 200 L80 185 L130 192 L180 170 L230 175" stroke="rgba(232,160,32,.6)" strokeWidth="1.5" fill="none"/><circle cx="180" cy="170" r="3" fill="#e8a020"/><rect x="30" y="210" width="300" height="1" fill="rgba(240,235,224,.06)"/></svg>},
  {type:"Mobile App",name:"Lume Health",year:"2024",client:"Health",vis:<svg viewBox="0 0 370 260" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="370" height="260" fill="#040d0a"/><ellipse cx="185" cy="130" rx="160" ry="100" fill="rgba(30,180,120,.04)"/><ellipse cx="185" cy="130" rx="100" ry="60" stroke="rgba(30,180,120,.08)" strokeWidth="1"/><ellipse cx="185" cy="130" rx="50" ry="28" stroke="rgba(30,180,120,.15)" strokeWidth="1"/><path d="M100 130 Q130 90 185 100 Q240 110 270 130" stroke="rgba(30,180,120,.5)" strokeWidth="1.5" fill="none"/><path d="M100 130 Q130 170 185 155 Q240 140 270 130" stroke="rgba(30,180,120,.2)" strokeWidth="1" fill="none"/><rect x="30" y="30" width="100" height="7" rx="2" fill="rgba(240,235,224,.1)"/><rect x="30" y="46" width="60" height="5" rx="2" fill="rgba(240,235,224,.05)"/><circle cx="325" cy="50" r="20" fill="rgba(30,180,120,.12)" stroke="rgba(30,180,120,.2)" strokeWidth="1"/><text x="325" y="55" textAnchor="middle" fill="rgba(30,180,120,.9)" fontSize="10" fontFamily="monospace">72</text><rect x="30" y="200" width="310" height="1" fill="rgba(30,180,120,.08)"/><rect x="30" y="215" width="50" height="5" rx="2" fill="rgba(30,180,120,.12)"/><rect x="95" y="215" width="50" height="5" rx="2" fill="rgba(30,180,120,.06)"/></svg>},
  {type:"Brand System",name:"Vanta Studio",year:"2023",client:"Creative",vis:<svg viewBox="0 0 370 260" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="370" height="260" fill="#0d0510"/><polygon points="185,40 320,220 50,220" fill="none" stroke="rgba(160,80,220,.2)" strokeWidth="1"/><polygon points="185,80 280,210 90,210" fill="none" stroke="rgba(160,80,220,.12)" strokeWidth="1"/><polygon points="185,120 240,200 130,200" fill="rgba(160,80,220,.06)" stroke="rgba(160,80,220,.15)" strokeWidth="1"/><circle cx="185" cy="160" r="15" fill="rgba(160,80,220,.3)"/><rect x="30" y="30" width="90" height="7" rx="2" fill="rgba(240,235,224,.1)"/><rect x="30" y="46" width="55" height="5" rx="2" fill="rgba(240,235,224,.05)"/><rect x="30" y="210" width="1" height="40" fill="rgba(160,80,220,.2)"/><rect x="45" y="225" width="60" height="5" rx="2" fill="rgba(160,80,220,.15)"/><rect x="45" y="238" width="40" height="4" rx="2" fill="rgba(160,80,220,.08)"/></svg>},
  {type:"E-Commerce",name:"Bloom Market",year:"2023",client:"Retail",vis:<svg viewBox="0 0 370 260" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="370" height="260" fill="#0d0505"/><circle cx="185" cy="120" r="90" fill="rgba(220,80,60,.04)" stroke="rgba(220,80,60,.08)" strokeWidth="1"/><circle cx="185" cy="120" r="55" fill="rgba(220,80,60,.04)"/><path d="M145 120 Q155 100 175 110 Q185 115 185 120 Q185 125 195 130 Q215 140 225 120" stroke="rgba(220,80,60,.5)" strokeWidth="1.5" fill="none"/><rect x="30" y="30" width="110" height="7" rx="2" fill="rgba(240,235,224,.1)"/><rect x="30" y="46" width="70" height="5" rx="2" fill="rgba(240,235,224,.05)"/><rect x="280" y="40" width="60" height="28" rx="3" fill="rgba(220,80,60,.12)" stroke="rgba(220,80,60,.2)" strokeWidth="1"/><text x="310" y="59" textAnchor="middle" fill="rgba(220,80,60,.9)" fontSize="9" fontFamily="monospace">+24%</text><path d="M80 200 L100 185 L130 192 L160 178 L200 182 L240 168 L280 172 L320 158" stroke="rgba(220,80,60,.4)" strokeWidth="1.5" fill="none"/><circle cx="280" cy="172" r="3" fill="#dc503c"/></svg>},
  {type:"Design System",name:"Arc Components",year:"2024",client:"Enterprise",vis:<svg viewBox="0 0 370 260" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="370" height="260" fill="#05080d"/><rect x="40" y="50" width="120" height="60" rx="4" fill="rgba(60,140,220,.08)" stroke="rgba(60,140,220,.15)" strokeWidth="1"/><rect x="55" y="65" width="60" height="5" rx="2" fill="rgba(60,140,220,.3)"/><rect x="55" y="78" width="40" height="4" rx="2" fill="rgba(60,140,220,.15)"/><rect x="55" y="90" width="80" height="10" rx="2" fill="rgba(60,140,220,.2)"/><rect x="200" y="50" width="120" height="60" rx="4" fill="rgba(60,140,220,.04)" stroke="rgba(60,140,220,.1)" strokeWidth="1"/><circle cx="250" cy="80" r="18" fill="rgba(60,140,220,.1)" stroke="rgba(60,140,220,.2)" strokeWidth="1"/><text x="250" y="84" textAnchor="middle" fill="rgba(60,140,220,.7)" fontSize="10" fontFamily="monospace">A</text><rect x="40" y="140" width="280" height="1" fill="rgba(60,140,220,.08)"/><rect x="40" y="160" width="280" height="55" rx="4" fill="rgba(60,140,220,.04)" stroke="rgba(60,140,220,.08)" strokeWidth="1"/><rect x="55" y="175" width="40" height="5" rx="2" fill="rgba(60,140,220,.2)"/><rect x="105" y="175" width="40" height="5" rx="2" fill="rgba(60,140,220,.1)"/><rect x="155" y="175" width="40" height="5" rx="2" fill="rgba(60,140,220,.1)"/></svg>}
];

const TESTIMONIALS = [
  {q:'"Ethereal didn\'t just redesign our product — they redesigned how we think about our users. Conversion jumped 40% in the first quarter."',author:"Sofia Marchetti",role:"CPO, NovaPay"},
  {q:'"The attention to micro-interactions and system thinking was unlike any agency we\'d worked with. Our team now uses their design system as a living document."',author:"James Okonkwo",role:"Co-founder, Arborist AI"},
  {q:'"They handed us a production-ready component library and documentation so thorough our engineers barely asked questions. Genuinely rare."',author:"Priya Nair",role:"Head of Product, Kestrel Health"},
  {q:'"Six weeks from kickoff to launch. Zero compromise on quality. I still don\'t know how they did it."',author:"Lucas Ferreira",role:"CEO, Orbit Analytics"}
];

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-l, .reveal-r");
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if(e.isIntersecting) e.target.classList.add("vis"); });
    }, {threshold: 0.1, rootMargin: "0px 0px -60px 0px"});
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function ServiceCard({svc, idx}) {
  const ref = useRef(null);
  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
    const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
    ref.current.style.setProperty("--mx", x + "%");
    ref.current.style.setProperty("--my", y + "%");
  }, []);

  return (
    <div ref={ref} className={`svc-card reveal delay${idx+1}`} onMouseMove={handleMouseMove}>
      <div className="svc-n">{svc.n}</div>
      <div className="svc-icon">{svc.icon}</div>
      <h3 className="svc-h">{svc.title}</h3>
      <p className="svc-p">{svc.desc}</p>
      <div className="svc-tags">{svc.tags.map(t=><span className="tag" key={t}>{t}</span>)}</div>
    </div>
  );
}

export default function EtherealStudio({ onOpenBot, botOpen = false }) {
  const [dark, setDark] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [tIdx, setTIdx] = useState(0);
  const [fading, setFading] = useState(false);
  const [sent, setSent] = useState(false);
  const styleRef = useRef(null);

  useReveal();

  // Inject/update CSS on dark mode change
  useEffect(() => {
    if (!styleRef.current) {
      styleRef.current = document.createElement("style");
      styleRef.current.id = "ethereal-main-css";
      document.head.appendChild(styleRef.current);
    }
    styleRef.current.textContent = buildCSS(dark);
  }, [dark]);

  // Scroll nav
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Testimonial auto-cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setTIdx(i => (i + 1) % TESTIMONIALS.length);
        setFading(false);
      }, 400);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const changeTesti = (i) => {
    setFading(true);
    setTimeout(() => {
      setTIdx(i);
      setFading(false);
    }, 300);
  };

  const t = TESTIMONIALS[tIdx];

  return (
    <>
      {/* Theme Toggle */}
      {!botOpen && (
        <button
          className="theme-btn"
          onClick={() => setDark(d => !d)}
          aria-label="Toggle theme"
          title={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
          <div className="theme-btn-knob">
            {dark ? "🌙" : "☀️"}
          </div>
        </button>
      )}

      {/* Nav */}
      <nav className={scrolled ? "scrolled" : ""}>
        <a href="#home" className="nav-logo">Ethe<em>real</em></a>
        <ul className="nav-links">
          {["Work","Services","Process","About","Contact"].map(l => (
            <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>
          ))}
        </ul>
        <div className="nav-right">
          <a href="#contact" className="nav-cta">Start a Project</a>
        </div>
      </nav>

      {/* Hero */}
      <section id="home" className="hero">
        <div className="hero-bg" />
        <div className="grid-overlay" />
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />
        <div className="hero-year">EST. 2016</div>
        <div className="hero-scroll">
          <span>Scroll</span>
          <div className="scroll-line" />
        </div>

        <div className="hero-eyebrow">Digital Product Studio · Hyderabad & Remote</div>

        <h1 className="hero-title">
          <span className="line"><span>We design</span></span>
          <span className="line"><span>digital <em>futures</em></span></span>
          <span className="line"><span>that endure.</span></span>
        </h1>

        {/* BOT CTA WIDGET */}
        <div className="bot-widget">
          <div className="bot-widget-card">
            <div className="bot-icon-wrap float-anim">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 1L12.5 6.5H18L13.5 10L15 16L10 13L5 16L6.5 10L2 6.5H7.5L10 1Z" fill="#05050a"/>
              </svg>
            </div>
            <div className="bot-widget-text">
              <div className="bot-widget-title">Try our <em>Ethereal Bot</em> now</div>
              <div className="bot-points">
                <span className="bot-point">Ask about Ethereal</span>
                <span className="bot-point">Get design previews</span>
                <span className="bot-point">Pricing &amp; timelines</span>
                <span className="bot-point">Start your project</span>
              </div>
              <button className="bot-open-btn" onClick={onOpenBot}>
                Open Bot
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M2 6.5H11M7.5 2.5L11 6.5L7.5 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="hero-bottom">
          <p className="hero-desc">
            At Ethereal, great design is invisible. We blend craft and UX rigour to build digital products that drive measurable results — and feel effortless to use.
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-num">150<em>+</em></span>
              <span className="stat-lbl">Projects Shipped</span>
            </div>
            <div className="hero-stat">
              <span className="stat-num">80<em>+</em></span>
              <span className="stat-lbl">Happy Clients</span>
            </div>
            <div className="hero-stat">
              <span className="stat-num">9<em>yr</em></span>
              <span className="stat-lbl">In Practice</span>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee">
        <div className="marquee-track">
          {MARQUEE_ITEMS.map((item,i)=>(
            <span className="m-item" key={i}>{item}<span className="m-dot" /></span>
          ))}
        </div>
      </div>

      {/* Services */}
      <section id="services" className="section mid">
        <div className="reveal"><div className="s-label">What We Do</div></div>
        <h2 className="s-title reveal"><em>Capabilities</em> built<br/>for complexity.</h2>
        <div className="svc-grid">
          {SERVICES.map((svc,i)=><ServiceCard key={svc.n} svc={svc} idx={i} />)}
        </div>
      </section>

      {/* Process */}
      <section id="process" className="section dark">
        <div className="proc-grid">
          <div className="proc-sticky">
            <div className="s-label reveal-l">How We Work</div>
            <h2 className="s-title reveal-l" style={{marginBottom:"1.4rem"}}><em>Process</em><br/>as craft.</h2>
            <p className="reveal-l" style={{fontSize:".76rem",lineHeight:"1.9",color:"var(--cream2)",maxWidth:"260px"}}>
              Every engagement follows a proven rhythm — flexible enough to adapt, rigorous enough to deliver.
            </p>
            <div className="proc-big reveal-l delay2">05</div>
            <svg viewBox="0 0 240 240" fill="none" width="180" className="reveal-l delay3 rotate-ring" style={{marginTop:"1.8rem",opacity:.2}}>
              <circle cx="120" cy="120" r="100" stroke="rgba(232,160,32,.4)" strokeWidth=".5"/>
              <circle cx="120" cy="120" r="60" stroke="rgba(232,160,32,.3)" strokeWidth=".5"/>
              <circle cx="120" cy="120" r="20" fill="rgba(232,160,32,.2)"/>
              {[0,72,144,216,288].map((a,i)=>{
                const rad = a*Math.PI/180;
                const x = 120+100*Math.cos(rad);
                const y = 120+100*Math.sin(rad);
                return <circle key={i} cx={x} cy={y} r="5" fill="rgba(232,160,32,.6)" />;
              })}
            </svg>
          </div>
          <div className="proc-steps">
            {STEPS.map((s,i)=>(
              <div className={`proc-step reveal delay${Math.min(i+1,4)}`} key={s.n}>
                <div className="ps-n">{s.n}</div>
                <div>
                  <div className="ps-h">{s.title}</div>
                  <p className="ps-p">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Work */}
      <section id="work" className="section mid" style={{paddingBottom:0}}>
        <div className="work-hdr">
          <div>
            <div className="s-label reveal">Selected Work</div>
            <h2 className="s-title reveal" style={{marginBottom:0}}><em>Projects</em> we're<br/>proud to own.</h2>
          </div>
          <div className="work-hint reveal">
            <svg width="18" height="11" viewBox="0 0 18 11" fill="none"><path d="M0 5.5h16M12 1l5 4.5-5 4.5" stroke="currentColor" strokeWidth="1.4"/></svg>
            Drag to explore
          </div>
        </div>
        <div className="work-scroll">
          {PROJECTS.map((p,i)=>(
            <div className="proj-card" key={i}>
              <div className="proj-vis">{p.vis}</div>
              <div className="proj-info">
                <div className="proj-type">{p.type}</div>
                <div className="proj-name">{p.name}</div>
                <div className="proj-meta"><span>{p.client}</span><span>{p.year}</span></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="section dark">
        <div className="about-grid">
          <div className="about-vis reveal-l">
            <svg viewBox="0 0 400 400" fill="none" width="100%" height="100%" style={{position:"absolute",inset:0}}>
              <rect width="400" height="400" fill={dark?"#05050a":"#f0ebe0"} />
              <circle cx="200" cy="200" r="180" stroke="rgba(232,160,32,.06)" strokeWidth="1"/>
              <circle cx="200" cy="200" r="120" stroke="rgba(232,160,32,.1)" strokeWidth="1"/>
              <circle cx="200" cy="200" r="60" stroke="rgba(232,160,32,.2)" strokeWidth="1"/>
              <circle cx="200" cy="200" r="12" fill="rgba(232,160,32,.9)"/>
              <circle cx="200" cy="20" r="6" fill="rgba(232,160,32,.4)"/>
              <circle cx="380" cy="200" r="6" fill="rgba(232,160,32,.3)"/>
              <circle cx="200" cy="380" r="6" fill="rgba(232,160,32,.2)"/>
              <circle cx="20" cy="200" r="6" fill="rgba(232,160,32,.35)"/>
              <line x1="200" y1="20" x2="200" y2="380" stroke="rgba(232,160,32,.06)" strokeWidth="1"/>
              <line x1="20" y1="200" x2="380" y2="200" stroke="rgba(232,160,32,.06)" strokeWidth="1"/>
              <path d="M200 200 L350 80" stroke="rgba(232,160,32,.2)" strokeWidth="1" strokeDasharray="4 4"/>
              <path d="M200 200 L60 320" stroke="rgba(232,160,32,.15)" strokeWidth="1" strokeDasharray="4 4"/>
              <text x="210" y="160" fill="rgba(232,160,32,.4)" fontSize="10" fontFamily="monospace">Craft</text>
              <text x="260" y="240" fill="rgba(232,160,32,.3)" fontSize="10" fontFamily="monospace">Strategy</text>
              <text x="120" y="260" fill="rgba(232,160,32,.3)" fontSize="10" fontFamily="monospace">Empathy</text>
            </svg>
          </div>
          <div className="about-content">
            <div className="s-label reveal">About the Studio</div>
            <p className="reveal delay1">"We started Ethereal because we were tired of design being treated as decoration. Design is the product."</p>
            <p className="reveal delay2">Founded in 2016, we are a team of 14 strategists, designers, and engineers based in Hyderabad and working globally. We partner with startups and scale-ups navigating complex product moments — new markets, platform shifts, AI integration.</p>
            <p className="reveal delay3">Our work spans fintech, health, enterprise SaaS, and consumer apps. The common thread: we make hard things feel obvious.</p>
            <a href="#contact" className="about-link reveal delay3"><span/> Let's work together</a>
            <div className="team-chips reveal delay4">
              {[
                {init:"AK",name:"Arjun K.",role:"Design Lead",bg:"rgba(232,160,32,.12)",c:"#e8a020"},
                {init:"SR",name:"Sneha R.",role:"Strategist",bg:"rgba(60,140,220,.1)",c:"#3c8cdc"},
                {init:"MV",name:"Mohan V.",role:"Engineering",bg:"rgba(30,180,120,.1)",c:"#1eb478"}
              ].map(p=>(
                <div className="team-chip" key={p.init}>
                  <div className="chip-avatar" style={{background:p.bg,color:p.c}}>{p.init}</div>
                  <div>
                    <div className="chip-name">{p.name}</div>
                    <div className="chip-role">{p.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section mid testi">
        <div className="s-label reveal" style={{justifyContent:"center"}}>Client Stories</div>
        <div style={{maxWidth:680,margin:"0 auto"}}>
          <p className={`testi-q${fading?" fade":""}`}>{t.q}</p>
          <div className={`testi-author${fading?" fade":""}`}>{t.author}</div>
          <div className={`testi-role${fading?" fade":""}`}>{t.role}</div>
          <div className="testi-dots">
            {TESTIMONIALS.map((_,i)=>(
              <div key={i} className={`td${i===tIdx?" active":""}`} onClick={()=>changeTesti(i)} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section dark">
        <div className="contact-wrap">
          <div>
            <div className="s-label reveal">Get In Touch</div>
            <h2 className="contact-big reveal">Let's build<br/><em>something</em><br/>together.</h2>
            <p className="contact-sub reveal delay2">Tell us about your project. We reply within 24 hours and usually have a first call within the week.</p>
            <div className="contact-info reveal delay3">
              {[
                ["Email","hello@etherealdesign.io"],
                ["Based in","Hyderabad, India"],
                ["Working","Globally"],
                ["Availability","Open Q3 2025"]
              ].map(([l,v])=>(
                <div className="ci-row" key={l}>
                  <span className="ci-label">{l}</span>
                  <span className="ci-val">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal delay2">
            {sent ? (
              <div style={{border:"1px solid var(--border)",padding:"3rem",textAlign:"center"}}>
                <div style={{fontSize:"2rem",marginBottom:"1rem"}}>✦</div>
                <div style={{fontFamily:"var(--serif)",fontSize:"1.5rem",marginBottom:".5rem",color:"var(--cream)"}}>Message received.</div>
                <div style={{fontSize:".75rem",color:"var(--cream2)"}}>We'll be in touch within 24 hours.</div>
              </div>
            ) : (
              <form className="contact-form" onSubmit={e=>{e.preventDefault();setSent(true);}}>
                <div className="c-row">
                  <input type="text" placeholder="Your name" required />
                  <input type="email" placeholder="Email address" required />
                </div>
                <input type="text" placeholder="Company / Project" />
                <textarea placeholder="Tell us about your project — goals, timeline, budget..." />
                <button type="submit" className="btn-send">Send Message →</button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="f-logo">Ethe<em>real</em></div>
        <ul className="f-links">
          {["Work","Services","Process","About","Careers","Contact"].map(l=>(
            <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>
          ))}
        </ul>
        <div className="f-copy">© 2025 Ethereal Design Studio</div>
      </footer>
    </>
  );
}