// app/app_intro.js — the animated launch intro for the desktop (Electron) and Android (Capacitor)
// builds only. tools/stage-web.mjs --app injects this script into the staged index.html; the website
// never loads it. Plays once per launch (~3 s), any tap/key skips it, and reduced motion gets a
// short fade instead. Also adds a light 3D tilt to the home-screen studio buttons in the apps.
(function () {
  const isApp = location.protocol === 'app:' || !!window.Capacitor || /[?&]appintro=1/.test(location.search);
  if (!isApp) return;
  document.documentElement.classList.add('toc-native');

  const reduced = (() => {
    try { return matchMedia('(prefers-reduced-motion: reduce)').matches || localStorage.getItem('tocMotion') === 'reduced'; } catch { return false; }
  })();
  let played = false;
  try { played = sessionStorage.getItem('tocIntroPlayed') === '1'; sessionStorage.setItem('tocIntroPlayed', '1'); } catch {}
  if (/[?&]appintro=1/.test(location.search)) played = false; // preview it in a browser

  const css = `
  #tocIntro{position:fixed;inset:0;z-index:2147483000;overflow:hidden;background:radial-gradient(ellipse at 50% 55%,#151238 0%,#07071a 55%,#020208 100%);color:#e0f2fe;font-family:Inter,system-ui,sans-serif;display:grid;place-items:center;cursor:pointer;transition:opacity .55s ease,transform .7s cubic-bezier(.6,0,.2,1),filter .7s}
  #tocIntro.out{opacity:0;transform:scale(1.35);filter:blur(10px);pointer-events:none}
  #tocIntro canvas{position:absolute;inset:0;width:100%;height:100%}
  #tocIntro .ti-stage{position:relative;display:flex;flex-direction:column;align-items:center;gap:clamp(18px,4vh,34px);perspective:900px}
  #tocIntro .ti-orbit{position:relative;width:clamp(170px,38vmin,300px);height:clamp(170px,38vmin,300px);transform-style:preserve-3d;animation:tiTilt 3.2s cubic-bezier(.3,.7,.2,1) both}
  #tocIntro .ti-ring{position:absolute;inset:0;border-radius:50%;border:2px solid rgba(34,211,238,.75);box-shadow:0 0 18px rgba(34,211,238,.55),inset 0 0 18px rgba(34,211,238,.35);transform-style:preserve-3d}
  #tocIntro .ti-ring.r1{animation:tiSpin1 5s linear infinite}
  #tocIntro .ti-ring.r2{inset:12%;border-color:rgba(168,85,247,.8);box-shadow:0 0 18px rgba(168,85,247,.6),inset 0 0 14px rgba(168,85,247,.4);animation:tiSpin2 4s linear infinite}
  #tocIntro .ti-ring.r3{inset:-14%;border-color:rgba(56,189,248,.35);border-style:dashed;box-shadow:none;animation:tiSpin3 9s linear infinite}
  #tocIntro .ti-node{position:absolute;width:18px;height:18px;margin:-9px;border-radius:50%;background:#0b1026;border:2px solid #67e8f9;box-shadow:0 0 14px #22d3ee,0 0 30px rgba(34,211,238,.6)}
  #tocIntro .ti-ring.r2 .ti-node{border-color:#d8b4fe;box-shadow:0 0 14px #a855f7,0 0 30px rgba(168,85,247,.6)}
  #tocIntro .ti-node.acc::after{content:'';position:absolute;inset:3px;border-radius:50%;border:2px solid currentColor;color:#67e8f9}
  #tocIntro .ti-core{position:absolute;inset:30%;display:grid;place-items:center;transform:translateZ(85px);animation:tiCore 3.2s ease both}
  #tocIntro .ti-core img{width:100%;height:100%;border-radius:22%;box-shadow:0 0 0 2px rgba(103,232,249,.75)}
  #tocIntro .ti-glow{position:absolute;left:50%;top:50%;width:clamp(170px,38vmin,300px);height:clamp(170px,38vmin,300px);transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,rgba(34,211,238,.28),rgba(168,85,247,.16) 40%,transparent 68%);pointer-events:none}
  #tocIntro .ti-title{margin:0;font-weight:900;letter-spacing:.32em;font-size:clamp(30px,7.5vmin,64px);text-indent:.32em;color:#e0f2fe;text-shadow:0 0 10px rgba(34,211,238,.9),0 0 26px rgba(34,211,238,.55),0 0 52px rgba(168,85,247,.55)}
  #tocIntro .ti-title span:nth-child(n+5){color:#f3e8ff;text-shadow:0 0 10px rgba(192,132,252,.95),0 0 26px rgba(168,85,247,.6),0 0 52px rgba(34,211,238,.4)}
  #tocIntro .ti-title span{display:inline-block;opacity:0;transform:translateY(24px) rotateX(80deg);animation:tiLetter .6s cubic-bezier(.2,.9,.3,1.2) forwards}
  #tocIntro .ti-sub{margin:-10px 0 0;font-size:clamp(13px,2.4vmin,18px);letter-spacing:.12em;color:#a5f3fc;opacity:0;animation:tiFade .8s 1.25s forwards;text-align:center;padding:0 16px}
  #tocIntro .ti-bar{width:min(260px,60vw);height:3px;border-radius:3px;background:rgba(148,163,184,.18);overflow:hidden;opacity:0;animation:tiFade .4s 1.4s forwards}
  #tocIntro .ti-bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#22d3ee,#a855f7);box-shadow:0 0 12px #22d3ee;animation:tiLoad 1.5s 1.45s cubic-bezier(.6,.1,.3,1) forwards}
  #tocIntro .ti-meta{position:absolute;bottom:max(18px,env(safe-area-inset-bottom));left:0;right:0;display:flex;justify-content:space-between;padding:0 22px;font-size:12px;letter-spacing:.14em;color:rgba(165,243,252,.55);opacity:0;animation:tiFade .6s 1.6s forwards}
  @keyframes tiTilt{0%{transform:rotateX(75deg) rotateZ(-40deg) scale(.3)}100%{transform:rotateX(58deg) rotateZ(0deg) scale(1)}}
  @keyframes tiSpin1{to{transform:rotateZ(360deg)}}
  @keyframes tiSpin2{from{transform:rotateY(70deg) rotateZ(0)}to{transform:rotateY(70deg) rotateZ(-360deg)}}
  @keyframes tiSpin3{from{transform:rotateX(70deg) rotateZ(0)}to{transform:rotateX(70deg) rotateZ(360deg)}}
  @keyframes tiCore{0%{transform:translateZ(260px) rotateX(-58deg) scale(.2)}100%{transform:translateZ(85px) rotateX(-58deg) scale(1)}}
  @keyframes tiLetter{to{opacity:1;transform:none}}
  @keyframes tiFade{to{opacity:1}}
  @keyframes tiLoad{to{width:100%}}
  html.toc-native .splash-tabs{perspective:800px}
  html.toc-native .splash-nav-btn{transition:transform .18s ease,box-shadow .18s ease;transform-style:preserve-3d;will-change:transform}
  html.toc-native .splash-nav-btn:hover{box-shadow:0 18px 30px -16px rgba(79,70,229,.55),0 0 0 1px rgba(103,232,249,.35)}
  @media (prefers-reduced-motion:reduce){html.toc-native .splash-nav-btn{transform:none!important}}
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // 3D tilt of the studio buttons that follows the pointer (apps only)
  function enableTilt() {
    if (reduced) return;
    document.addEventListener('pointermove', (e) => {
      const btn = e.target.closest && e.target.closest('.splash-nav-btn');
      document.querySelectorAll('.splash-nav-btn[data-tilt]').forEach(b => { if (b !== btn) { b.style.transform = ''; b.removeAttribute('data-tilt'); } });
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      btn.setAttribute('data-tilt', '');
      btn.style.transform = `rotateX(${(-y * 14).toFixed(1)}deg) rotateY(${(x * 18).toFixed(1)}deg) translateZ(8px)`;
    }, { passive: true });
  }

  function intro() {
    const el = document.createElement('div');
    el.id = 'tocIntro';
    el.setAttribute('role', 'presentation');
    el.setAttribute('aria-label', 'Toc-Suite is starting');
    const iconSrc = 'assets/icons/icon-192.png';
    const node = (deg, acc) => `<span class="ti-node${acc ? ' acc' : ''}" style="left:${50 + 50 * Math.cos(deg * Math.PI / 180)}%;top:${50 + 50 * Math.sin(deg * Math.PI / 180)}%"></span>`;
    el.innerHTML = `<canvas></canvas>
      <div class="ti-stage">
        <div class="ti-orbit">
          <div class="ti-glow"></div>
          <div class="ti-ring r3"></div>
          <div class="ti-ring r1">${node(0)}${node(120, true)}${node(240)}</div>
          <div class="ti-ring r2">${node(60)}${node(200, true)}</div>
          <div class="ti-core"><img src="${iconSrc}" alt=""></div>
        </div>
        <h1 class="ti-title">${'TOC SUITE'.split('').map((c, i) => `<span style="animation-delay:${0.55 + i * 0.07}s">${c === ' ' ? '&nbsp;' : c}</span>`).join('')}</h1>
        <p class="ti-sub">Theory of Computation, made interactive</p>
        <div class="ti-bar"><i></i></div>
      </div>
      <div class="ti-meta"><span>v2.0.0</span><span>TAP TO SKIP</span></div>`;
    document.body.appendChild(el);

    // starfield + particles flying toward the viewer, with neon trails
    const cv = el.querySelector('canvas'), ctx = cv.getContext('2d');
    let w, h, dpr;
    const resize = () => { dpr = Math.min(2, devicePixelRatio || 1); w = cv.width = innerWidth * dpr; h = cv.height = innerHeight * dpr; };
    resize(); addEventListener('resize', resize);
    const N = Math.round(Math.min(380, innerWidth * innerHeight / 3500));
    const stars = Array.from({ length: N }, () => ({ x: (Math.random() - .5) * 2, y: (Math.random() - .5) * 2, z: Math.random(), hue: Math.random() < .55 ? 188 : 275 }));
    const t0 = performance.now();
    let raf, done = false;
    const frame = (t) => {
      const el2 = (t - t0) / 1000;
      const speed = 0.0035 + Math.min(1, el2 / 2.6) ** 3 * 0.03;   // accelerates into warp
      ctx.fillStyle = 'rgba(3,3,12,.32)';
      ctx.fillRect(0, 0, w, h);
      const cx = w / 2, cy = h * .45, f = Math.min(w, h) * .55;
      for (const s of stars) {
        const pz = s.z;
        s.z -= speed;
        if (s.z <= .02) { s.x = (Math.random() - .5) * 2; s.y = (Math.random() - .5) * 2; s.z = 1; continue; }
        const sx = cx + s.x / s.z * f, sy = cy + s.y / s.z * f;
        const px = cx + s.x / pz * f, py = cy + s.y / pz * f;
        const a = Math.min(1, (1 - s.z) * 1.4);
        ctx.strokeStyle = `hsla(${s.hue},95%,70%,${a})`;
        ctx.lineWidth = Math.max(.6, (1 - s.z) * 2.6) * dpr;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(sx, sy); ctx.stroke();
      }
      if (!done) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const finish = () => {
      if (done) return;
      done = true;
      el.classList.add('out');
      setTimeout(() => { cancelAnimationFrame(raf); removeEventListener('resize', resize); el.remove(); }, 750);
    };
    el.addEventListener('click', finish);
    addEventListener('keydown', finish, { once: true });
    setTimeout(finish, 3100);
  }

  function shortFade() {
    const el = document.createElement('div');
    el.id = 'tocIntro';
    el.innerHTML = '<div class="ti-stage"><h1 class="ti-title">TOC SUITE</h1></div>';
    document.body.appendChild(el);
    setTimeout(() => el.classList.add('out'), 500);
    setTimeout(() => el.remove(), 1100);
  }

  const start = () => {
    enableTilt();
    if (played) return;
    if (reduced) shortFade(); else intro();
  };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
