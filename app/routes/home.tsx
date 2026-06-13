import { Layout } from "../components/Layout";
import { t } from "../lib/i18n";
import { flagOf, teamName } from "../lib/teams";
import { getCountdown, getRecentMatches, getTopUsers, localTime } from "../lib/helpers";
import type { Env } from "../index";

export async function homeHandler(c: {
  var: { lang: string; user: { id: string; username: string } | null };
  env: Env;
  req: { url: string };
  html: (v: any) => any;
}) {
  const l = c.var.lang;
  const recentMatches = await getRecentMatches(c.env.DB);
  const topUsers = await getTopUsers(c.env.DB);
  const countdown = getCountdown();
  const totalMatches = await c.env.DB.prepare("SELECT COUNT(*) as c FROM matches").first<{c:number}>();
  const totalUsers = await c.env.DB.prepare("SELECT COUNT(*) as c FROM users").first<{c:number}>();

  const homeJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "FIFA World Cup 2026 Fan Hub",
    "url": "https://2026.ikber.cc",
    "description": t(l, "home.description"),
    "inLanguage": l,
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://2026.ikber.cc/{lang}/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  });

  const orgJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    "name": "FIFA World Cup 2026 Fan Hub",
    "url": "https://2026.ikber.cc",
    "description": t(l, "home.description"),
    "sport": "Soccer",
    "knowsAbout": {
      "@type": "SportsEvent",
      "name": "FIFA World Cup 2026",
      "startDate": "2026-06-11",
      "endDate": "2026-07-19",
      "location": {
        "@type": "Place",
        "name": "USA, Canada, Mexico"
      }
    }
  });

  const breadcrumbJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": t(l, "nav.home"),
      "item": `https://2026.ikber.cc/${l}`
    }]
  });

  return c.html(
    <Layout
      title={t(l, "home.title")}
      description={t(l, "home.description")}
      keywords={`FIFA World Cup 2026,世界杯,${t(l, "home.title")},football,soccer,match schedule,predictions,standings,${l === "zh" ? "赛程,积分榜,竞猜" : ""}`}
      lang={l}
      url={c.req.url}
      canonicalUrl={`https://2026.ikber.cc/${l}`}
      jsonLd={homeJsonLd + orgJsonLd + breadcrumbJsonLd}
      user={c.var.user}
    >
      {/* ============ HERO ============ */}
      <div class="hero-section">
        <div class="hero-overlay-bottom"></div>
        <div class="max-w-4xl mx-auto px-4 text-center relative z-10 py-20">
          <div class="hero-trophy anim-hero mb-4">🏆</div>
          <div class="hero-year gold-text anim-hero-1 mb-6">2026</div>
          <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white anim-hero-2 mb-4 tracking-tight leading-none">
            FIFA <span class="gold-text">WORLD CUP</span>
          </h1>
          <div class="hero-countdown-display anim-hero-3 mx-auto mb-6">
            {countdown.startsWith("The tournament has begun") ? (
              <span class="countdown-number" style="font-size:1.5rem;letter-spacing:0.05em;">⚽ {t(l, "home.tournament_live")}</span>
            ) : (
              <>
                <span class="countdown-number" id="countdown-days">{countdown.split(" ")[0]}</span>
                <span class="countdown-label">{t(l, "home.days")}</span>
                <span class="countdown-number">{countdown.split(" ")[2]}</span>
                <span class="countdown-label">{t(l, "home.hours")}</span>
              </>
            )}
          </div>
          <p class="text-base text-gray-400 max-w-lg mx-auto anim-hero-3 mb-10">{t(l, "home.subtitle")}</p>
          <div class="flex items-center justify-center gap-4 anim-hero-3">
            <a href={`/${l}/predictions`} class="hero-cta hero-cta-primary">
              ⚽ {t(l, "home.predict_cta") || "Predict Now"}
            </a>
            <a href={`/${l}/schedule`} class="hero-cta hero-cta-secondary">
              📅 {t(l, "nav.schedule")}
            </a>
          </div>
        </div>
      </div>

      {/* ============ STATS BAR ============ */}
      <div class="max-w-4xl mx-auto px-4 -mt-10 relative z-10 mb-16 anim-up">
        <div class="stats-bar">
          <div class="stats-bar-item">
            <div class="stats-bar-value">48</div>
            <div class="stats-bar-label">Teams</div>
          </div>
          <div class="stats-bar-item">
            <div class="stats-bar-value">{totalMatches?.c || 104}</div>
            <div class="stats-bar-label">Matches</div>
          </div>
          <div class="stats-bar-item">
            <div class="stats-bar-value">{totalUsers?.c || 0}</div>
            <div class="stats-bar-label">Fans</div>
          </div>
        </div>
      </div>

      {/* ============ RECENT RESULTS ============ */}
      <div class="max-w-6xl mx-auto px-4 mb-16">
        <section class="anim-up-1">
          <div class="flex items-center justify-between mb-8">
            <div>
              <h2 class="section-title">{t(l, "home.recent_results")}</h2>
              <p class="section-subtitle">Latest match outcomes</p>
            </div>
            <a href={`/${l}/results`} class="btn btn-ghost btn-sm">
              {t(l, "home.view_all") || "View all"} →
            </a>
          </div>
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentMatches.length > 0 ? recentMatches.map((m, idx) => (
              <a href={`/${l}/matches/${m.id}`} class={`match-card anim-up-${idx+2}`}>
                <div class="match-card-header">
                  <span class="match-card-date">{localTime(m.match_date, { showDate: true })}</span>
                  <span class={`stage-badge ${m.stage}`}>{m.stage === "group" ? `Group ${m.group_name}` : m.stage.replace(/_/g, " ")}</span>
                </div>
                <div class="flex items-center mt-2">
                  <div class="flex-1 flex flex-col items-center gap-1 min-w-0">
                    <span class="flex-shrink-0">{flagOf(m.home_team, 28)}</span>
                    <span class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate max-w-full">{teamName(l, m.home_team)}</span>
                  </div>
                  <div class="flex-shrink-0 text-center px-3 sm:px-6">
                    {m.home_score != null ? (
                      <span class={`match-card-score ${m.home_score > m.away_score ? "win" : m.home_score < m.away_score ? "loss" : "draw"}`}>
                        {m.home_score}:{m.away_score}
                      </span>
                    ) : (
                      <span class="match-card-vs">VS</span>
                    )}
                  </div>
                  <div class="flex-1 flex flex-col items-center gap-1 min-w-0">
                    <span class="flex-shrink-0">{flagOf(m.away_team, 28)}</span>
                    <span class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate max-w-full">{teamName(l, m.away_team)}</span>
                  </div>
                </div>
              </a>
            )) : (
              <p class="text-gray-400 dark:text-gray-500 col-span-3 text-center py-12">{t(l, "home.no_results")}</p>
            )}
          </div>
        </section>
      </div>

      {/* ============ LEADERBOARD ============ */}
      <div class="max-w-6xl mx-auto px-4 mb-16">
        <section class="anim-up-2">
          <div class="flex items-center justify-between mb-8">
            <div>
              <h2 class="section-title">{t(l, "home.leaderboard")}</h2>
              <p class="section-subtitle">Top predictors worldwide</p>
            </div>
            <a href={`/${l}/leaderboard`} class="btn btn-ghost btn-sm">
              {t(l, "home.view_all") || "View all"} →
            </a>
          </div>
          {topUsers.length > 0 ? (
            <div class="space-y-2">
              {topUsers.map((u, i) => {
                const rank = i + 1;
                const isPodium = rank <= 3;
                const medalEmoji = rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉";
                const medalColors = [
                  "from-yellow-400 to-amber-500 shadow-yellow-400/30",
                  "from-slate-300 to-slate-400 shadow-slate-400/20",
                  "from-orange-400 to-orange-600 shadow-orange-400/20",
                ];
                const bgAccent = isPodium
                  ? ["bg-amber-50/60 dark:bg-amber-900/10", "bg-slate-50/60 dark:bg-slate-800/20", "bg-orange-50/60 dark:bg-orange-900/10"][i]
                  : "bg-white/60 dark:bg-gray-800/30";
                const borderAccent = isPodium
                  ? ["border-amber-200/80 dark:border-amber-700/30", "border-slate-200/80 dark:border-slate-600/30", "border-orange-200/80 dark:border-orange-700/30"][i]
                  : "border-gray-100 dark:border-gray-700/30";

                return (
                  <div class={`flex items-center gap-4 p-4 rounded-2xl border ${bgAccent} ${borderAccent} backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-lg`}>
                    <div class="flex-shrink-0 w-10 text-center">
                      {isPodium ? <span class="text-2xl">{medalEmoji}</span> : <span class="text-sm font-bold text-gray-400 dark:text-gray-500 tabular-nums">{rank}</span>}
                    </div>
                    <div class="flex items-center gap-3 flex-1 min-w-0">
                      <div class={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm flex-shrink-0 ${isPodium ? `bg-gradient-to-br ${medalColors[i]}` : "bg-gradient-to-br from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700"}`}>
                        {u.username.charAt(0).toUpperCase()}
                      </div>
                      <span class="font-semibold text-gray-900 dark:text-white truncate text-sm">{u.username}</span>
                    </div>
                    <div class="flex-shrink-0 text-right">
                      <div class={`font-extrabold text-lg tabular-nums ${isPodium ? "gold-text-static" : "text-gray-700 dark:text-gray-300"}`}>{u.points}</div>
                      <div class="text-[10px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider">pts</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div class="glass-card p-12 text-center text-gray-400 dark:text-gray-500 rounded-2xl">{t(l, "home.no_users")}</div>
          )}
        </section>
      </div>

      {/* ============ QUICK LINKS ============ */}
      <div class="max-w-6xl mx-auto px-4 mb-20">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 anim-up-3">
          <a href={`/${l}/schedule`} class="card-premium text-center group cursor-pointer">
            <div class="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">📅</div>
            <div class="font-bold text-gray-900 dark:text-white text-sm">{t(l, "nav.schedule")}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">Full match calendar</div>
          </a>
          <a href={`/${l}/standings`} class="card-premium text-center group cursor-pointer">
            <div class="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">📊</div>
            <div class="font-bold text-gray-900 dark:text-white text-sm">{t(l, "nav.standings")}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">Group tables</div>
          </a>
          <a href={`/${l}/community`} class="card-premium text-center group cursor-pointer">
            <div class="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">💬</div>
            <div class="font-bold text-gray-900 dark:text-white text-sm">{t(l, "nav.community")}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">Team chat rooms</div>
          </a>
          <a href={`/${l}/achievements`} class="card-premium text-center group cursor-pointer">
            <div class="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">👑</div>
            <div class="font-bold text-gray-900 dark:text-white text-sm">{t(l, "nav.leaderboard")}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">Global rankings</div>
          </a>
        </div>
      </div>
    </Layout>
  );
}
