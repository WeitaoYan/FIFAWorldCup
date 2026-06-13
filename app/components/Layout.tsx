import { Header } from "./Header";
import { Footer } from "./Footer";

interface LayoutProps {
  title: string;
  description: string;
  lang: string;
  url: string;
  keywords?: string;
  ogType?: string;
  ogImage?: string;
  canonicalUrl?: string;
  jsonLd?: string;
  user: { id: string; username: string } | null;
  children: any;
}

const SITE_DOMAIN = "https://2026.ikber.cc";

const LOCALE_MAP: Record<string, string> = {
  en: "en_US", zh: "zh_CN", fr: "fr_FR", es: "es_ES",
  ru: "ru_RU", ja: "ja_JP", ko: "ko_KR", hi: "hi_IN",
};

function Layout({ title, description, lang, url, keywords, ogType, ogImage, canonicalUrl, jsonLd, user, children }: LayoutProps) {
  const currentPath = "";
  const dir = lang === "ar" ? "rtl" : "ltr";
  const ogLocale = LOCALE_MAP[lang] || "en_US";
  const allLocales = Object.values(LOCALE_MAP);
  const finalCanonical = canonicalUrl || `${SITE_DOMAIN}/${lang}${currentPath}`;
  const finalOgImage = ogImage || `${SITE_DOMAIN}/images/og-share.jpg`;

  return (
    <html lang={lang} dir={dir} class="">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#06080d" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#f5f0e8" media="(prefers-color-scheme: light)" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <title>{title}</title>
        <meta name="description" content={description} />
        {keywords && <meta name="keywords" content={keywords} />}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={finalCanonical} />
        <meta property="og:type" content={ogType || "website"} />
        <meta property="og:site_name" content="FIFA World Cup 2026 Fan Hub" />
        <meta property="og:locale" content={ogLocale} />
        {allLocales.filter(l => l !== ogLocale).map(l => (
          <meta property="og:locale:alternate" content={l} />
        ))}
        <meta property="og:image" content={finalOgImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={title} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={finalOgImage} />
        <meta name="twitter:site" content="@FIFAWorldCup" />
        <link rel="alternate" href={`${SITE_DOMAIN}/en${currentPath}`} hrefLang="en" />
        <link rel="alternate" href={`${SITE_DOMAIN}/zh${currentPath}`} hrefLang="zh" />
        <link rel="alternate" href={`${SITE_DOMAIN}/fr${currentPath}`} hrefLang="fr" />
        <link rel="alternate" href={`${SITE_DOMAIN}/es${currentPath}`} hrefLang="es" />
        <link rel="alternate" href={`${SITE_DOMAIN}/ru${currentPath}`} hrefLang="ru" />
        <link rel="alternate" href={`${SITE_DOMAIN}/ja${currentPath}`} hrefLang="ja" />
        <link rel="alternate" href={`${SITE_DOMAIN}/ko${currentPath}`} hrefLang="ko" />
        <link rel="alternate" href={`${SITE_DOMAIN}/hi${currentPath}`} hrefLang="hi" />
        <link rel="alternate" href={`${SITE_DOMAIN}/${lang}${currentPath}`} hrefLang="x-default" />
        <link rel="canonical" href={finalCanonical} />
        {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  var t = localStorage.getItem("theme") || document.cookie.match(/theme=([^;]+)/)?.[1];
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
          .hamburger[aria-expanded="true"] .hamburger-line-top{top:7px;transform:rotate(45deg)}
          .hamburger[aria-expanded="true"] .hamburger-line-middle{opacity:0;transform:scaleX(0)}
          .hamburger[aria-expanded="true"] .hamburger-line-bottom{top:7px;transform:rotate(-45deg)}
          .hamburger[aria-expanded="true"] .hamburger-line{background:#2563eb}
          .dark .hamburger[aria-expanded="true"] .hamburger-line{background:#60a5fa}
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

              apply(getPref());

              document.querySelectorAll('[data-theme-toggle]').forEach(function(btn) {
                btn.addEventListener('click', function() {
                  apply(html.classList.contains(DARK) ? LIGHT : DARK);
                });
              });

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

                document.addEventListener('keydown', function(e) {
                  if (e.key === 'Escape' && isOpen) { close(); }
                });

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
                      els.forEach(function(el) { el.textContent = val; });
                    } else if (val !== currentVal) {
                      els.forEach(function(el) { animateValue(el, currentVal, val); });
                    }
                    currentVal = val;
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

              menu.querySelectorAll('a').forEach(function(link) {
                link.addEventListener('click', function() { close(); });
              });

              document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && isOpen) { close(); }
              });

              document.addEventListener('click', function(e) {
                if (isOpen && !menu.contains(e.target) && e.target !== toggle) {
                  close();
                }
              });

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
              for(var i=0;i<20;i++){
                var p=document.createElement('div');
                p.className='hero-particle '+(i%3===0?'gold':'blue');
                p.style.left=Math.random()*100+'%';
                p.style.top=(20+Math.random()*60)+'%';
                p.style.width=(2+Math.random()*4)+'px';
                p.style.height=p.style.width;
                p.style.animation='particleDrift '+(3+Math.random()*5)+'s ease-in-out '+(Math.random()*4)+'s infinite';
                hero.appendChild(p);
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

export { Layout };
