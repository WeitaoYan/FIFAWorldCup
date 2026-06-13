import { t } from "../lib/i18n";

interface LayoutProps {
  title: string;
  description: string;
  lang: string;
  user: { id: string; username: string } | null;
  children: any;
}

function Layout({ title, description, lang, user, children }: LayoutProps) {
  const currentPath = "";
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <html lang={lang} dir={dir} class="">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#06080d" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#f5f0e8" media="(prefers-color-scheme: light)" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="FIFA World Cup 2026 Fan Hub" />
        <meta property="og:image" content="https://2026.ikber.cc/images/og-share.jpg" />
        <meta property="og:image:width" content="541" />
        <meta property="og:image:height" content="520" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://2026.ikber.cc/images/og-share.png" />
        <link rel="alternate" href={`/en${currentPath}`} hrefLang="en" />
        <link rel="alternate" href={`/zh${currentPath}`} hrefLang="zh" />
        <link rel="alternate" href={`/fr${currentPath}`} hrefLang="fr" />
        <link rel="alternate" href={`/es${currentPath}`} hrefLang="es" />
        <link rel="alternate" href={`/ru${currentPath}`} hrefLang="ru" />
        <link rel="alternate" href={`/ja${currentPath}`} hrefLang="ja" />
        <link rel="alternate" href={`/ko${currentPath}`} hrefLang="ko" />
        <link rel="alternate" href={`/hi${currentPath}`} hrefLang="hi" />
        <link rel="canonical" href={`/${lang}${currentPath}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  var t = localStorage.getItem("theme") || document.cookie.match(/theme=([^;]+)/)?.[1];
                  // Default to dark theme unless user explicitly chose light
                  if (!t || t === "dark") document.documentElement.classList.add("dark");
                } catch(e) {}
              })()
            `,
          }}
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <style>{`
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
          html{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;line-height:1.5;-webkit-text-size-adjust:100%;overflow-x:hidden;width:100%}
          body{min-height:100vh;background:#f5f0e8;color:#1a1a2e;transition:background .5s ease,color .5s ease;overflow-x:hidden;max-width:100vw}
          .dark body{background:#06080d;color:#e4e8f0}
          a{color:inherit;text-decoration:none}
          input,button,textarea{font:inherit}
          .flag-icon{display:inline-block;vertical-align:middle;border-radius:2px;box-shadow:0 1px 3px rgba(0,0,0,.1);flex-shrink:0}
          .dark .flag-icon{box-shadow:0 1px 3px rgba(0,0,0,.3)}
          @keyframes heroReveal{0%{opacity:0;transform:translateY(40px) scale(.95)}100%{opacity:1;transform:translateY(0) scale(1)}}
          @keyframes goldShimmer{0%{background-position:-400% center}100%{background-position:400% center}}
          @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
          @keyframes livePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(1.8)}}
          .gold-text-preload{background:linear-gradient(135deg,#b8860b 0%,#f5c842 25%,#fef3c7 50%,#f5c842 75%,#b8860b 100%);background-size:300% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:goldShimmer 4s ease infinite}
          @keyframes langFadeIn{0%{opacity:0;transform:translateY(-8px) scale(.96)}100%{opacity:1;transform:translateY(0) scale(1)}}
          .lang-trigger{display:inline-flex;align-items:center;gap:6px;height:36px;padding:0 10px;border-radius:12px;border:1px solid transparent;background:transparent;cursor:pointer;font-size:13px;font-weight:600;color:#6b7280;transition:all .25s ease;white-space:nowrap;user-select:none;-webkit-tap-highlight-color:transparent}
          .lang-trigger:hover{background:#f3f4f6;border-color:#e5e7eb;color:#374151;transform:scale(1.04)}
          .lang-trigger:focus-visible{outline:2px solid #3b82f6;outline-offset:2px}
          .lang-trigger[aria-expanded="true"]{background:#eff6ff;border-color:#bfdbfe;color:#2563eb}
          .dark .lang-trigger{color:#9ca3af}
          .dark .lang-trigger:hover{background:#1f2937;border-color:#374151;color:#e5e7eb}
          .dark .lang-trigger[aria-expanded="true"]{background:#1e3a5f;border-color:#1d4ed8;color:#60a5fa}
          .lang-trigger-flag{display:flex;align-items:center;line-height:1}
          .lang-flag-icon{display:block;border-radius:2px;box-shadow:0 1px 2px rgba(0,0,0,.08);flex-shrink:0}
          .dark .lang-flag-icon{box-shadow:0 1px 2px rgba(0,0,0,.3)}
          .lang-trigger-code{letter-spacing:.04em}
          .lang-trigger-chevron{width:14px;height:14px;opacity:.5;transition:transform .3s ease}
          .lang-trigger[aria-expanded="true"] .lang-trigger-chevron{transform:rotate(180deg);opacity:1}
          .lang-backdrop{position:fixed;inset:0;z-index:40}
          .lang-panel{position:absolute;right:0;top:calc(100% + 8px);z-index:50;min-width:220px;background:#fff;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.12),0 0 0 1px rgba(0,0,0,.05);overflow:hidden;animation:langFadeIn .25s cubic-bezier(.16,1,.3,1) both}
          .dark .lang-panel{background:#1f2937;box-shadow:0 20px 60px rgba(0,0,0,.4),0 0 0 1px rgba(255,255,255,.06)}
          .lang-panel-header{display:flex;align-items:center;gap:8px;padding:12px 16px 10px;border-bottom:1px solid #f3f4f6;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:#9ca3af}
          .dark .lang-panel-header{border-bottom-color:#374151}
          .lang-panel-list{padding:6px}
          .lang-option{display:flex;align-items:center;gap:10px;width:100%;padding:10px 12px;border:none;border-radius:10px;background:transparent;cursor:pointer;font-size:14px;color:#374151;transition:all .15s ease;text-align:left}
          .lang-option:hover{background:#f3f4f6}
          .lang-option:focus-visible{outline:2px solid #3b82f6;outline-offset:-2px;border-radius:10px}
          .dark .lang-option{color:#e5e7eb}
          .dark .lang-option:hover{background:#374151}
          .lang-option-active{background:#eff6ff}
          .lang-option-active:hover{background:#dbeafe}
          .dark .lang-option-active{background:#1e3a5f}
          .dark .lang-option-active:hover{background:#1e3a5f}
          .lang-option-flag{display:flex;align-items:center;flex-shrink:0;line-height:1}
          .lang-option-text{display:flex;flex-direction:column;gap:1px;min-width:0;flex:1}
          .lang-option-native{font-weight:600;font-size:14px;line-height:1.3}
          .lang-option-label{font-size:11px;color:#9ca3af;line-height:1.3}
          .lang-option-check{width:16px;height:16px;color:#2563eb;flex-shrink:0}
          .dark .lang-option-check{color:#60a5fa}
          /* --- Online Count Badge --- */
          @keyframes onlinePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.8)}}
          @keyframes onlineGlow{0%,100%{opacity:.6;transform:scale(1)}50%{opacity:1;transform:scale(1.08)}}
          @keyframes onlineRing{0%{transform:scale(.8);opacity:1}100%{transform:scale(2.2);opacity:0}}
          @keyframes onlineBadgePulse{0%{transform:scale(1)}30%{transform:scale(1.06)}100%{transform:scale(1)}}
          .online-badge-updated .online-badge-inner{animation:onlineBadgePulse .5s cubic-bezier(.16,1,.3,1)}
          .online-badge{position:relative;display:inline-flex;flex-shrink:0}
          .online-badge-glow{position:absolute;inset:-6px;border-radius:24px;background:radial-gradient(circle at 20% 50%,rgba(16,185,129,.15) 0%,transparent 70%);animation:onlineGlow 3s ease-in-out infinite}
          .dark .online-badge-glow{background:radial-gradient(circle at 20% 50%,rgba(52,211,153,.2) 0%,transparent 70%)}
          .online-badge-inner{position:relative;display:flex;align-items:center;gap:6px;padding:4px 12px 4px 8px;border-radius:24px;background:rgba(16,185,129,.06);border:1px solid rgba(16,185,129,.15);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);transition:all .3s ease}
          .dark .online-badge-inner{background:rgba(52,211,153,.08);border-color:rgba(52,211,153,.15)}
          .online-badge-inner:hover{background:rgba(16,185,129,.1);border-color:rgba(16,185,129,.25)}
          .dark .online-badge-inner:hover{background:rgba(52,211,153,.12);border-color:rgba(52,211,153,.25)}
          .online-badge-dot{position:relative;width:20px;height:20px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
          .online-badge-dot-core{width:7px;height:7px;border-radius:50%;background:#10b981;box-shadow:0 0 8px rgba(16,185,129,.5)}
          .dark .online-badge-dot-core{background:#34d399;box-shadow:0 0 10px rgba(52,211,153,.6)}
          .online-badge-dot-ring{position:absolute;inset:0;border-radius:50%;border:2px solid #10b981;animation:onlineRing 2s ease-out infinite}
          .dark .online-badge-dot-ring{border-color:#34d399}
          .online-badge-number{font-size:13px;font-weight:700;color:#059669;font-variant-numeric:tabular-nums;line-height:1;min-width:1.5ch;text-align:center;transition:all .3s ease}
          .dark .online-badge-number{color:#34d399}
          .online-badge-label{font-size:10px;font-weight:600;color:#6ee7b7;text-transform:uppercase;letter-spacing:.05em;display:none}
          .dark .online-badge-label{color:#6ee7b7}
          @media(min-width:400px){.online-badge-label{display:inline}}
          /* --- Theme Toggle --- */
          @keyframes themeStarTwinkle{0%,100%{opacity:0;transform:scale(.3)}50%{opacity:1;transform:scale(1)}}
          .theme-toggle{position:relative;display:flex;align-items:center;justify-content:center;width:44px;height:36px;padding:0;border:none;border-radius:12px;background:transparent;cursor:pointer;transition:all .3s ease;-webkit-tap-highlight-color:transparent}
          .theme-toggle:hover{background:#f3f4f6}
          .theme-toggle:focus-visible{outline:2px solid #3b82f6;outline-offset:2px}
          .dark .theme-toggle:hover{background:#1f2937}
          .theme-toggle-track{position:relative;width:40px;height:24px;border-radius:24px;background:linear-gradient(135deg,#fbbf24,#f59e0b);box-shadow:0 0 12px rgba(251,191,36,.35);transition:all .4s cubic-bezier(.16,1,.3,1)}
          .dark .theme-toggle-track{background:linear-gradient(135deg,#4b5563,#1f2937);box-shadow:0 0 12px rgba(59,130,246,.2),inset 0 1px 0 rgba(255,255,255,.05)}
          .theme-toggle-thumb{position:absolute;top:2px;left:2px;width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.15);transition:all .4s cubic-bezier(.16,1,.3,1);display:flex;align-items:center;justify-content:center}
          .dark .theme-toggle-thumb{left:18px;background:#e5e7eb;box-shadow:0 2px 8px rgba(0,0,0,.3)}
          .theme-toggle-icon{position:absolute;width:12px;height:12px;transition:all .4s cubic-bezier(.16,1,.3,1)}
          .theme-toggle-sun{color:#f59e0b;opacity:1;transform:rotate(0) scale(1)}
          .dark .theme-toggle-sun{opacity:0;transform:rotate(90deg) scale(.4)}
          .theme-toggle-moon{color:#6366f1;opacity:0;transform:rotate(-90deg) scale(.4)}
          .dark .theme-toggle-moon{opacity:1;transform:rotate(0) scale(1)}
          .theme-toggle-stars{position:absolute;inset:0;pointer-events:none}
          .theme-toggle-star{position:absolute;width:3px;height:3px;border-radius:50%;background:#fbbf24;transition:all .3s ease}
          .dark .theme-toggle-star{background:#93c5fd;animation:themeStarTwinkle 3s ease infinite}
          .theme-toggle-star-1{top:4px;right:6px;animation-delay:0s}
          .theme-toggle-star-2{top:10px;right:3px;animation-delay:.8s}
          .theme-toggle-star-3{bottom:5px;right:8px;animation-delay:1.6s}
          /* --- Hamburger Button --- */
          @keyframes menuSlideDown{0%{opacity:0;transform:translateY(-12px)}100%{opacity:1;transform:translateY(0)}}
          .hamburger{display:flex;align-items:center;justify-content:center;width:40px;height:36px;padding:0;border:none;border-radius:12px;background:transparent;cursor:pointer;transition:all .25s ease;-webkit-tap-highlight-color:transparent;margin-left:4px}
          .hamburger:hover{background:#f3f4f6}
          .hamburger:focus-visible{outline:2px solid #3b82f6;outline-offset:2px}
          .dark .hamburger:hover{background:#1f2937}
          .hamburger-box{position:relative;width:20px;height:16px}
          .hamburger-line{position:absolute;left:0;width:100%;height:2px;border-radius:2px;background:#6b7280;transition:all .35s cubic-bezier(.16,1,.3,1);transform-origin:center}
          .dark .hamburger-line{background:#9ca3af}
          .hamburger:hover .hamburger-line{background:#374151}
          .dark .hamburger:hover .hamburger-line{background:#e5e7eb}
          .hamburger-line-top{top:0}
          .hamburger-line-middle{top:7px}
          .hamburger-line-bottom{top:14px}
          /* Open state: top & bottom → X, middle → fade out */
          .hamburger[aria-expanded="true"] .hamburger-line-top{top:7px;transform:rotate(45deg)}
          .hamburger[aria-expanded="true"] .hamburger-line-middle{opacity:0;transform:scaleX(0)}
          .hamburger[aria-expanded="true"] .hamburger-line-bottom{top:7px;transform:rotate(-45deg)}
          .hamburger[aria-expanded="true"] .hamburger-line{background:#2563eb}
          .dark .hamburger[aria-expanded="true"] .hamburger-line{background:#60a5fa}
          /* Mobile menu panel */
          #mobile-menu{overflow:hidden}
          #mobile-menu:not(.hidden){animation:menuSlideDown .35s cubic-bezier(.16,1,.3,1) both}
        `}</style>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="/styles/app.css" />
      </head>
      <body class="min-h-screen flex flex-col">
        <Header lang={lang} user={user} />
        <main class="flex-1">{children}</main>
        <Footer lang={lang} />

        <script dangerouslySetInnerHTML={{
          __html: `
            // --- Theme Toggle ---
            (function(){
              var STORAGE_KEY = 'theme';
              var DARK = 'dark';
              var LIGHT = 'light';
              var html = document.documentElement;

              function getPref() {
                try {
                  var stored = localStorage.getItem(STORAGE_KEY);
                  if (stored === DARK || stored === LIGHT) return stored;
                } catch(e) {}
                // Default to dark theme
                return DARK;
              }

              function apply(t) {
                if (t === DARK) html.classList.add(DARK);
                else html.classList.remove(DARK);
                try {
                  localStorage.setItem(STORAGE_KEY, t);
                  document.cookie = STORAGE_KEY + '=' + t + ';path=/;max-age=31536000;SameSite=Lax';
                } catch(e) {}
                var meta = document.querySelector('meta[name="theme-color"]');
                if (meta) meta.setAttribute('content', t === DARK ? '#06080d' : '#f5f0e8');
              }

              // Apply saved preference immediately (avoids flash)
              apply(getPref());

              document.querySelectorAll('[data-theme-toggle]').forEach(function(btn) {
                btn.addEventListener('click', function() {
                  apply(html.classList.contains(DARK) ? LIGHT : DARK);
                });
              });

              // Listen for system theme changes (only when user hasn't manually set a preference)
              if (window.matchMedia) {
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
                  try { if (localStorage.getItem(STORAGE_KEY)) return; } catch(_) {}
                  apply(DARK);
                });
              }
            })();

            // --- Language Dropdown ---
            (function(){
              var dropdowns = document.querySelectorAll('[data-lang-dropdown]');
              dropdowns.forEach(function(dropdown) {
                var trigger = dropdown.querySelector('[data-lang-trigger]');
                var panel = dropdown.querySelector('[data-lang-panel]');
                var backdrop = dropdown.querySelector('[data-lang-backdrop]');
                var options = dropdown.querySelectorAll('[data-lang-switch]');
                var isOpen = false;

                function open() {
                  isOpen = true;
                  panel.classList.remove('hidden');
                  backdrop.classList.remove('hidden');
                  trigger.setAttribute('aria-expanded', 'true');
                  // Focus the active option
                  var active = panel.querySelector('.lang-option-active') || options[0];
                  if (active) { active.focus(); active.setAttribute('tabindex', '0'); }
                }

                function close() {
                  isOpen = false;
                  panel.classList.add('hidden');
                  backdrop.classList.add('hidden');
                  trigger.setAttribute('aria-expanded', 'false');
                  trigger.focus();
                }

                trigger.addEventListener('click', function(e) {
                  e.stopPropagation();
                  isOpen ? close() : open();
                });

                backdrop.addEventListener('click', close);

                // Close on Escape
                document.addEventListener('keydown', function(e) {
                  if (e.key === 'Escape' && isOpen) { close(); }
                });

                // Language option click
                options.forEach(function(opt) {
                  opt.addEventListener('click', function(e) {
                    e.preventDefault();
                    var lang = this.dataset.langSwitch;
                    var path = window.location.pathname;
                    var parts = path.split('/');
                    parts[1] = lang;
                    window.location.href = parts.join('/');
                  });
                });

                // Keyboard navigation within panel
                panel.addEventListener('keydown', function(e) {
                  var items = panel.querySelectorAll('[data-lang-switch]');
                  var focused = document.activeElement;
                  var idx = Array.from(items).indexOf(focused);
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    var next = items[Math.min(idx + 1, items.length - 1)];
                    if (next) { next.focus(); next.setAttribute('tabindex', '0'); }
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    var prev = items[Math.max(idx - 1, 0)];
                    if (prev) { prev.focus(); prev.setAttribute('tabindex', '0'); }
                  }
                });
              });
            })();

            // --- Online Count ---
            (function(){
              var els = document.querySelectorAll('#online-count');
              var badges = document.querySelectorAll('[data-online-badge]');
              var currentVal = -1;
              var retries = 0;
              var MAX_RETRIES = 3;

              function animateValue(el, from, to) {
                var duration = 400;
                var start = performance.now();
                function step(now) {
                  var elapsed = now - start;
                  var progress = Math.min(elapsed / duration, 1);
                  // Ease-out cubic
                  var eased = 1 - Math.pow(1 - progress, 3);
                  el.textContent = Math.round(from + (to - from) * eased);
                  if (progress < 1) requestAnimationFrame(step);
                }
                requestAnimationFrame(step);
              }

              function updateOnline(){
                var lang = window.location.pathname.split('/')[1] || 'en';
                fetch('/' + lang + '/api/online-count')
                  .then(function(r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
                  .then(function(d) {
                    retries = 0;
                    var val = typeof d.online === 'number' ? d.online : parseInt(d.online, 10) || 0;
                    if (currentVal === -1) {
                      // First load: set immediately
                      els.forEach(function(el) { el.textContent = val; });
                    } else if (val !== currentVal) {
                      // Animate change
                      els.forEach(function(el) { animateValue(el, currentVal, val); });
                    }
                    currentVal = val;
                    // Add pulse effect on badges
                    badges.forEach(function(b) {
                      b.classList.add('online-badge-updated');
                      setTimeout(function() { b.classList.remove('online-badge-updated'); }, 600);
                    });
                  })
                  .catch(function() {
                    retries++;
                    if (retries >= MAX_RETRIES) {
                      els.forEach(function(el) { el.textContent = '--'; });
                    }
                  });
              }

              updateOnline();
              setInterval(updateOnline, 30000);

              // Refresh on visibility change (tab switch)
              document.addEventListener('visibilitychange', function() {
                if (!document.hidden) updateOnline();
              });
            })();

            // --- Header scroll effect ---
            (function(){
              var header = document.querySelector('.site-header');
              if(!header) return;
              window.addEventListener('scroll',function(){
                if(window.scrollY>10) header.classList.add('scrolled');
                else header.classList.remove('scrolled');
              },{passive:true});
            })();

            // --- Mobile menu ---
            (function(){
              var toggle = document.getElementById('mobile-menu-toggle');
              var menu = document.getElementById('mobile-menu');
              if (!toggle || !menu) return;
              var isOpen = false;

              function open() {
                isOpen = true;
                menu.classList.remove('hidden');
                toggle.setAttribute('aria-expanded', 'true');
                toggle.setAttribute('aria-label', 'Close navigation menu');
                document.body.style.overflow = 'hidden';
                // Focus first link in menu
                var firstLink = menu.querySelector('a');
                if (firstLink) setTimeout(function() { firstLink.focus(); }, 100);
              }

              function close() {
                isOpen = false;
                menu.classList.add('hidden');
                toggle.setAttribute('aria-expanded', 'false');
                toggle.setAttribute('aria-label', 'Open navigation menu');
                document.body.style.overflow = '';
                toggle.focus();
              }

              toggle.addEventListener('click', function(e) {
                e.stopPropagation();
                isOpen ? close() : open();
              });

              // Close when clicking menu links
              menu.querySelectorAll('a').forEach(function(link) {
                link.addEventListener('click', function() { close(); });
              });

              // Close on Escape
              document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && isOpen) { close(); }
              });

              // Close when clicking outside
              document.addEventListener('click', function(e) {
                if (isOpen && !menu.contains(e.target) && e.target !== toggle) {
                  close();
                }
              });

              // Trap focus within menu when open
              menu.addEventListener('keydown', function(e) {
                if (e.key !== 'Tab' || !isOpen) return;
                var focusable = menu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
                var first = focusable[0];
                var last = focusable[focusable.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                  e.preventDefault();
                  last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                  e.preventDefault();
                  first.focus();
                }
              });
            })();

            // --- Hero particles (only on homepage) ---
            (function(){
              var hero=document.querySelector('.hero-section');
              if(!hero) return;
              var particles=[];
              for(var i=0;i<20;i++){
                var p=document.createElement('div');
                p.className='hero-particle '+(i%3===0?'gold':'blue');
                p.style.left=Math.random()*100+'%';
                p.style.top=(20+Math.random()*60)+'%';
                p.style.width=(2+Math.random()*4)+'px';
                p.style.height=p.style.width;
                p.style.animation='particleDrift '+(3+Math.random()*5)+'s ease-in-out '+(Math.random()*4)+'s infinite';
                hero.appendChild(p);
                particles.push(p);
              }
            })();

            // --- Local time conversion ---
            (function(){
              var els = document.querySelectorAll('time.local-time');
              els.forEach(function(el) {
                var iso = el.getAttribute('datetime');
                if (!iso) return;
                var d = new Date(iso);
                if (isNaN(d.getTime())) return;
                var showDate = el.getAttribute('data-show-date') === '1';
                var dateStr = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                var timeStr = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
                el.textContent = showDate ? (dateStr + ' ' + timeStr) : timeStr;
              });
            })();
          `
        }} />
      </body>
    </html>
  );
}

function Header({ lang, user }: { lang: string; user: { id: string; username: string } | null }) {
  const nav = [
    { href: `/${lang}`, labelKey: "nav.home" },
    { href: `/${lang}/schedule`, labelKey: "nav.schedule" },
    { href: `/${lang}/results`, labelKey: "nav.results" },
    { href: `/${lang}/standings`, labelKey: "nav.standings" },
    { href: `/${lang}/predictions`, labelKey: "nav.predictions" },
    { href: `/${lang}/community`, labelKey: "nav.community" },
    { href: `/${lang}/leaderboard`, labelKey: "nav.leaderboard" },
  ];

  return (
    <header class="site-header">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          {/* Logo */}
          <a href={`/${lang}`} class="flex items-center gap-2.5 group flex-shrink-0">
            <div class="relative">
              <span class="text-xl font-black gold-text-preload tracking-tighter">2026</span>
              <div class="absolute -bottom-0.5 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </div>
            <span class="text-[10px] font-semibold text-gray-500 dark:text-gray-400 hidden sm:inline tracking-widest uppercase leading-tight max-w-[70px]">
              FIFA<br/>World Cup
            </span>
          </a>

          {/* Desktop: full nav + actions */}
          <nav class="hidden md:flex items-center gap-0.5">
            {nav.map((item) => (
              <a href={item.href} class="nav-link">{t(lang, item.labelKey)}</a>
            ))}
          </nav>

          <div class="hidden md:flex items-center gap-1.5">
            <OnlineCount />
            <LanguageSwitcher currentLang={lang} />
            <ThemeToggle />
            {user ? (
              <a href={`/${lang}/profile`} class="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ml-1">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span class="hidden sm:inline font-medium">{user.username}</span>
              </a>
            ) : (
              <a href={`/${lang}/auth/login`} class="btn btn-gold btn-sm ml-1">
                {t(lang, "nav.login")}
              </a>
            )}
          </div>

          {/* Mobile: only lang + login/user + hamburger */}
          <div class="flex md:hidden items-center gap-1">
            <LanguageSwitcher currentLang={lang} />
            {user ? (
              <a href={`/${lang}/profile`} class="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-xs font-bold text-white shadow-sm hover:shadow-md transition-shadow">
                {user.username.charAt(0).toUpperCase()}
              </a>
            ) : (
              <a href={`/${lang}/auth/login`} class="btn btn-gold btn-sm !py-1.5 !px-3 text-xs">
                {t(lang, "nav.login")}
              </a>
            )}
            <button
              id="mobile-menu-toggle"
              class="hamburger"
              aria-label="Toggle navigation menu"
              aria-expanded="false"
            >
              <span class="hamburger-box">
                <span class="hamburger-line hamburger-line-top"></span>
                <span class="hamburger-line hamburger-line-middle"></span>
                <span class="hamburger-line hamburger-line-bottom"></span>
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div id="mobile-menu" class="hidden md:hidden border-t border-gray-100 dark:border-gray-700 py-3 pb-4">
          <nav class="flex flex-col gap-0.5">
            {nav.map((item) => (
              <a href={item.href} class="nav-link block py-2.5 px-3 rounded-lg">{t(lang, item.labelKey)}</a>
            ))}
          </nav>
          <div class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between px-3">
            <OnlineCount />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

function OnlineCount() {
  return (
    <div class="online-badge" data-online-badge title="Fans online right now">
      <span class="online-badge-glow"></span>
      <span class="online-badge-inner">
        <span class="online-badge-dot">
          <span class="online-badge-dot-core"></span>
          <span class="online-badge-dot-ring"></span>
        </span>
        <span id="online-count" class="online-badge-number" aria-live="polite">-</span>
        <span class="online-badge-label">online</span>
      </span>
    </div>
  );
}

function ThemeToggle() {
  return (
    <button
      data-theme-toggle
      class="theme-toggle"
      aria-label="Toggle dark / light theme"
      title="Toggle dark / light theme"
    >
      <span class="theme-toggle-track">
        <span class="theme-toggle-thumb">
          {/* Sun rays */}
          <svg class="theme-toggle-icon theme-toggle-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
          {/* Moon crescent */}
          <svg class="theme-toggle-icon theme-toggle-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </span>
      </span>
      <span class="theme-toggle-stars">
        <span class="theme-toggle-star theme-toggle-star-1"></span>
        <span class="theme-toggle-star theme-toggle-star-2"></span>
        <span class="theme-toggle-star theme-toggle-star-3"></span>
      </span>
    </button>
  );
}

const LANG_FLAGS: Record<string, string> = {
  en: "us", zh: "cn", fr: "fr", es: "es", ru: "ru", ja: "jp", ko: "kr", hi: "in",
};

function LangFlagIcon({ code, size }: { code: string; size?: number }) {
  const c = LANG_FLAGS[code] || code;
  const w = size || 20;
  const h = Math.round(w * 0.75);
  return <img src={`https://flagicons.lipis.dev/flags/4x3/${c}.svg`} width={w} height={h} alt={code} class="lang-flag-icon" loading="lazy" />;
}

function LanguageSwitcher({ currentLang }: { currentLang: string }) {
  const languages = [
    { code: "en", label: "English", native: "English" },
    { code: "zh", label: "Chinese", native: "中文" },
    { code: "fr", label: "French", native: "Français" },
    { code: "es", label: "Spanish", native: "Español" },
    { code: "ru", label: "Russian", native: "Русский" },
    { code: "ja", label: "Japanese", native: "日本語" },
    { code: "ko", label: "Korean", native: "한국어" },
    { code: "hi", label: "Hindi", native: "हिन्दी" },
  ];

  const current = languages.find((l) => l.code === currentLang) || languages[0];
  const id = "lang-dropdown";

  return (
    <div class="relative" data-lang-dropdown>
      {/* Trigger Button */}
      <button
        id={`${id}-trigger`}
        data-lang-trigger
        class="lang-trigger"
        aria-haspopup="listbox"
        aria-expanded="false"
        aria-label={`Current language: ${current.native}. Click to change language.`}
        title={`Switch language (current: ${current.native})`}
      >
        <span class="lang-trigger-flag"><LangFlagIcon code={current.code} size={16} /></span>
        <span class="lang-trigger-code">{current.code.toUpperCase()}</span>
        <svg class="lang-trigger-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown Backdrop (click outside to close) */}
      <div id={`${id}-backdrop`} class="lang-backdrop hidden" data-lang-backdrop aria-hidden="true"></div>

      {/* Dropdown Panel */}
      <div
        id={`${id}-panel`}
        class="lang-panel hidden"
        role="listbox"
        aria-labelledby={`${id}-trigger`}
        data-lang-panel
      >
        <div class="lang-panel-header">
          <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <span>Choose Language</span>
        </div>
        <div class="lang-panel-list">
          {languages.map((lang) => {
            const isActive = lang.code === currentLang;
            return (
              <button
                key={lang.code}
                role="option"
                aria-selected={isActive ? "true" : "false"}
                data-lang-switch={lang.code}
                tabindex={isActive ? 0 : -1}
                class={`lang-option ${isActive ? "lang-option-active" : ""}`}
              >
                <span class="lang-option-flag"><LangFlagIcon code={lang.code} size={20} /></span>
                <div class="lang-option-text">
                  <span class="lang-option-native">{lang.native}</span>
                  <span class="lang-option-label">{lang.label}</span>
                </div>
                {isActive && (
                  <svg class="lang-option-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Footer({ lang }: { lang: string }) {
  return (
    <footer class="site-footer">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex items-center gap-3">
            <span class="text-lg font-black gold-text-preload">2026</span>
            <div class="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>
            <span class="text-xs text-gray-500 dark:text-gray-400">&copy; {new Date().getFullYear()} FIFA World Cup Fan Hub</span>
          </div>
          <div class="flex items-center gap-6 text-xs text-gray-500 dark:text-gray-400">
            <a href={`/${lang}`} class="hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">{t(lang, "nav.home")}</a>
            <a href={`/${lang}/schedule`} class="hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">{t(lang, "nav.schedule")}</a>
            <a href={`/${lang}/standings`} class="hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">{t(lang, "nav.standings")}</a>
            <a href={`/${lang}/leaderboard`} class="hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">{t(lang, "nav.leaderboard")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Layout, Header, Footer, ThemeToggle, LanguageSwitcher, OnlineCount };
