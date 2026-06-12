import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "hono/zod-validator";
import { setCookie, getCookie, deleteCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";
import { Layout } from "../components/Layout";
import { t, getLanguage, SUPPORTED_LANGS } from "../lib/i18n";
import type { Env } from "../index";

const router = new Hono<{
  Bindings: Env;
  Variables: { user: { id: string; username: string } | null; lang: string };
}>();

function href(c: { var: { lang: string } }, path: string) {
  return `/${c.var.lang}${path}`;
}

// ========== HOME ==========
async function homeHandler(c: {
  var: { lang: string; user: { id: string; username: string } | null };
  env: Env;
  html: (v: any) => any;
}) {
  const l = c.var.lang;
  const recentMatches = await getRecentMatches(c.env.DB);
  const topUsers = await getTopUsers(c.env.DB);
  const countdown = getCountdown();
  const totalMatches = await c.env.DB.prepare("SELECT COUNT(*) as c FROM matches").first<{c:number}>();
  const totalUsers = await c.env.DB.prepare("SELECT COUNT(*) as c FROM users").first<{c:number}>();

  return c.html(
    <Layout title={t(l, "home.title")} description={t(l, "home.description")} lang={l} user={c.var.user}>
      {/* ============ HERO ============ */}
      <div class="hero-section">
        <div class="hero-overlay-bottom"></div>
        <div class="max-w-4xl mx-auto px-4 text-center relative z-10 py-20">
          {/* Trophy */}
          <div class="hero-trophy anim-hero mb-4">🏆</div>
          {/* Year */}
          <div class="hero-year gold-text anim-hero-1 mb-6">2026</div>
          {/* Title */}
          <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white anim-hero-2 mb-4 tracking-tight leading-none">
            FIFA <span class="gold-text">WORLD CUP</span>
          </h1>
          {/* Countdown */}
          <div class="hero-countdown-display anim-hero-3 mx-auto mb-6">
            <span class="countdown-number" id="countdown-days">{countdown.split(" ")[0]}</span>
            <span class="countdown-label">Days</span>
            <span class="countdown-number">{countdown.split(" ")[2]}</span>
            <span class="countdown-label">Hours</span>
          </div>
          {/* Subtitle */}
          <p class="text-base text-gray-400 max-w-lg mx-auto anim-hero-3 mb-10">{t(l, "home.subtitle")}</p>
          {/* CTA */}
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
                  <span class="match-card-date">{m.match_date}</span>
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
                    {/* Rank */}
                    <div class="flex-shrink-0 w-10 text-center">
                      {isPodium ? (
                        <span class="text-2xl">{medalEmoji}</span>
                      ) : (
                        <span class="text-sm font-bold text-gray-400 dark:text-gray-500 tabular-nums">{rank}</span>
                      )}
                    </div>
                    {/* Avatar + Name */}
                    <div class="flex items-center gap-3 flex-1 min-w-0">
                      <div class={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm flex-shrink-0
                        ${isPodium ? `bg-gradient-to-br ${medalColors[i]}` : "bg-gradient-to-br from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700"}`}>
                        {u.username.charAt(0).toUpperCase()}
                      </div>
                      <span class="font-semibold text-gray-900 dark:text-white truncate text-sm">{u.username}</span>
                    </div>
                    {/* Points */}
                    <div class="flex-shrink-0 text-right">
                      <div class={`font-extrabold text-lg tabular-nums ${isPodium ? "gold-text-static" : "text-gray-700 dark:text-gray-300"}`}>
                        {u.points}
                      </div>
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

// ========== AUTH ==========
const authSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6).max(100),
});

async function loginGet(c: any) {
  const l = c.var.lang;
  const error = c.req.query("error");
  return c.html(
    <Layout title="Login - FIFA 2026" description="" lang={l} user={null}>
      <div class="max-w-md mx-auto px-4 py-16">
        <div class="auth-card anim-scale">
          <h1 class="auth-title">⚽ {t(l, "auth.login_title")}</h1>
          <form action={href(c, "/auth/login")} method="post" class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t(l, "auth.username")}</label>
              <input name="username" required class="input-field" placeholder="Enter your username" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t(l, "auth.password")}</label>
              <input type="password" name="password" required class="input-field" placeholder="••••••••" />
            </div>
            <button type="submit" class="btn btn-primary w-full py-3">{t(l, "auth.login")}</button>
          </form>
          <p class="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
            {t(l, "auth.no_account")} <a href={href(c, "/auth/register")} class="text-blue-600 dark:text-blue-400 font-semibold hover:underline">{t(l, "auth.register_link")}</a>
          </p>
          {error && <p class="mt-3 text-center text-sm text-red-500 font-medium">{error === "invalid" ? "Invalid credentials" : error}</p>}
        </div>
      </div>
    </Layout>
  );
}

async function loginPost(c: any) {
  const l = c.var.lang;
  try {
    const body = await c.req.parseBody();
    const { username, password } = authSchema.parse(body);
    const user = await c.env.DB.prepare("SELECT id, username, password_hash FROM users WHERE username = ?").bind(username).first<{ id: string; username: string; password_hash: string }>();
    if (!user || password !== user.password_hash) return c.redirect(href(c, "/auth/login?error=invalid"));
    const token = await sign({ sub: user.id, username: user.username }, "secret-key");
    setCookie(c, "token", token, { path: "/", httpOnly: true, secure: true, maxAge: 604800 });
    return c.redirect(`/${l}`);
  } catch { return c.redirect(href(c, "/auth/login?error=invalid")); }
}

async function registerGet(c: any) {
  const l = c.var.lang;
  return c.html(
    <Layout title="Register - FIFA 2026" description="" lang={l} user={null}>
      <div class="max-w-md mx-auto px-4 py-16">
        <div class="auth-card anim-scale">
          <h1 class="auth-title">🌟 {t(l, "auth.register_title")}</h1>
          <form action={href(c, "/auth/register")} method="post" class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t(l, "auth.username")}</label>
              <input name="username" required minLength={3} class="input-field" placeholder="Choose a username" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t(l, "auth.email")}</label>
              <input type="email" name="email" required class="input-field" placeholder="your@email.com" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t(l, "auth.password")}</label>
              <input type="password" name="password" required minLength={6} class="input-field" placeholder="Min 6 characters" />
            </div>
            <button type="submit" class="btn btn-gold w-full py-3">{t(l, "auth.register")}</button>
          </form>
          <p class="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
            {t(l, "auth.has_account")} <a href={href(c, "/auth/login")} class="text-blue-600 dark:text-blue-400 font-semibold hover:underline">{t(l, "auth.login_link")}</a>
          </p>
        </div>
      </div>
    </Layout>
  );
}

async function registerPost(c: any) {
  const l = c.var.lang;
  try {
    const body = await c.req.parseBody();
    const { username, password } = authSchema.parse(body);
    const email = String(body.email || "");
    const existing = await c.env.DB.prepare("SELECT id FROM users WHERE username = ? OR email = ?").bind(username, email).first();
    if (existing) return c.redirect(href(c, "/auth/register?error=exists"));
    const id = crypto.randomUUID();
    await c.env.DB.prepare("INSERT INTO users (id, username, email, password_hash) VALUES (?, ?, ?, ?)").bind(id, username, email, password).run();
    await c.env.DB.prepare("INSERT OR IGNORE INTO user_achievements (id, user_id, achievement_id) VALUES (?, ?, (SELECT id FROM achievement_defs WHERE key = 'welcome'))").bind(crypto.randomUUID(), id).run();
    const token = await sign({ sub: id, username }, "secret-key");
    setCookie(c, "token", token, { path: "/", httpOnly: true, secure: true, maxAge: 604800 });
    return c.redirect(`/${l}`);
  } catch { return c.redirect(href(c, "/auth/register?error=invalid")); }
}

async function logoutGet(c: any) {
  const l = c.var.lang;
  deleteCookie(c, "token");
  return c.redirect(`/${l}`);
}

// ========== SCHEDULE ==========
async function scheduleHandler(c: any) {
  const l = c.var.lang;
  const matches = await c.env.DB.prepare("SELECT * FROM matches ORDER BY match_date ASC").all<any>();
  const grouped: Record<string, any[]> = {};
  for (const m of matches.results ?? []) {
    const d = m.match_date.split(" ")[0];
    if (!grouped[d]) grouped[d] = [];
    grouped[d].push(m);
  }
  return c.html(
    <Layout title={t(l, "schedule.title")} description={t(l, "schedule.description")} lang={l} user={c.var.user}>
      <div class="max-w-4xl mx-auto px-4 py-8">
        <div class="mb-8">
          <h1 class="section-title">{t(l, "schedule.title")}</h1>
          <p class="section-subtitle">Complete match calendar for FIFA World Cup 2026</p>
        </div>
        {Object.entries(grouped).map(([date, ms], gi) => (
          <div class="mb-10 anim-up" style={`animation-delay:${gi*0.05}s`}>
            <div class="flex items-center gap-3 mb-5">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold text-sm shadow-md">{date.split("-")[2]}</div>
              <div>
                <div class="font-bold text-gray-900 dark:text-white">{date}</div>
                <div class="text-xs text-gray-500">{ms.length} matches</div>
              </div>
            </div>
            <div class="space-y-3">
              {ms.map((m: any) => (
                <a href={`/${l}/matches/${m.id}`} class="match-card block">
                  <div class="flex items-center">
                    <div class="flex-1 flex flex-col items-center gap-1 min-w-0">
                      <span class="flex-shrink-0">{flagOf(m.home_team, 28)}</span>
                      <span class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate max-w-full">{teamName(l, m.home_team)}</span>
                    </div>
                    <div class="flex-shrink-0 text-center px-3 sm:px-6">
                      {m.home_score != null ? (
                        <span class="match-card-score">{m.home_score} - {m.away_score}</span>
                      ) : (
                        <span class="match-card-vs">VS</span>
                      )}
                      <div class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 uppercase tracking-wider">
                        <span class={`stage-badge ${m.stage}`}>{m.stage === "group" ? `Group ${m.group_name}` : m.stage.replace(/_/g, " ")}</span>
                      </div>
                    </div>
                    <div class="flex-1 flex flex-col items-center gap-1 min-w-0">
                      <span class="flex-shrink-0">{flagOf(m.away_team, 28)}</span>
                      <span class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate max-w-full">{teamName(l, m.away_team)}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}

// ========== RESULTS ==========
async function resultsHandler(c: any) {
  const l = c.var.lang;
  const stageFilter = c.req.query("stage") || "";
  let query = "SELECT * FROM matches WHERE status = 'finished' ORDER BY match_date DESC";
  if (stageFilter) { query = "SELECT * FROM matches WHERE status = 'finished' AND stage = ? ORDER BY match_date DESC"; }
  const matches = stageFilter
    ? await c.env.DB.prepare(query).bind(stageFilter).all<any>()
    : await c.env.DB.prepare(query).all<any>();

  const stages = await c.env.DB.prepare("SELECT DISTINCT stage FROM matches WHERE status = 'finished' ORDER BY stage").all<any>();

  return c.html(
    <Layout title={t(l, "results.title")} description={t(l, "results.description")} lang={l} user={c.var.user}>
      <div class="max-w-4xl mx-auto px-4 py-8">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 class="section-title">{t(l, "results.title")}</h1>
            <p class="section-subtitle">Completed match results</p>
          </div>
          <div class="flex gap-2 overflow-x-auto pb-1">
            <a href={`/${l}/results`} class={`filter-pill ${!stageFilter ? "active" : ""}`}>{t(l, "results.all")}</a>
            {stages.results?.map((s: any) => (
              <a href={`/${l}/results?stage=${s.stage}`} class={`filter-pill ${stageFilter === s.stage ? "active" : ""}`}>{s.stage.replace(/_/g, " ")}</a>
            ))}
          </div>
        </div>
        <div class="space-y-3">
          {matches.results?.length > 0 ? matches.results.map((m: any, idx: number) => (
            <a href={`/${l}/matches/${m.id}`} class="match-card block anim-up" style={`animation-delay:${idx*0.03}s`}>
              <div class="flex items-center">
                <div class="flex-1 flex flex-col items-center gap-1 min-w-0">
                  <span class="flex-shrink-0">{flagOf(m.home_team, 28)}</span>
                  <span class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate max-w-full">{teamName(l, m.home_team)}</span>
                </div>
                <div class="flex-shrink-0 text-center px-3 sm:px-6">
                  <div class={`match-card-score ${m.home_score > m.away_score ? "win" : m.home_score < m.away_score ? "loss" : "draw"}`}>
                    {m.home_score} - {m.away_score}
                  </div>
                  <div class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                    {m.match_date}
                  </div>
                  <div class="mt-0.5">
                    <span class={`stage-badge ${m.stage}`}>{m.stage === "group" ? `Group ${m.group_name}` : m.stage.replace(/_/g, " ")}</span>
                  </div>
                </div>
                <div class="flex-1 flex flex-col items-center gap-1 min-w-0">
                  <span class="flex-shrink-0">{flagOf(m.away_team, 28)}</span>
                  <span class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate max-w-full">{teamName(l, m.away_team)}</span>
                </div>
              </div>
            </a>
          )) : (
            <p class="text-center text-gray-400 dark:text-gray-500 py-16">{t(l, "results.empty")}</p>
          )}
        </div>
      </div>
    </Layout>
  );
}

// ========== STANDINGS ==========
async function standingsHandler(c: any) {
  const l = c.var.lang;
  const st = await c.env.DB.prepare("SELECT * FROM standings ORDER BY group_name, points DESC, goal_diff DESC").all<any>();
  const grouped: Record<string, any[]> = {};
  for (const s of st.results ?? []) {
    if (!grouped[s.group_name]) grouped[s.group_name] = [];
    grouped[s.group_name].push(s);
  }
  return c.html(
    <Layout title={t(l, "standings.title")} description={t(l, "standings.description")} lang={l} user={c.var.user}>
      <div class="max-w-6xl mx-auto px-4 py-8">
        <div class="mb-8">
          <h1 class="section-title">{t(l, "standings.title")}</h1>
          <p class="section-subtitle">Group stage standings — Top 2 advance</p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(grouped).map(([group, teams], gi) => (
            <div class="glass-card overflow-hidden anim-up" style={`animation-delay:${gi*0.05}s`}>
              <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
                <h2 class="text-lg font-extrabold text-gray-900 dark:text-white">{t(l, "standings.group")} {group}</h2>
                <span class="badge badge-gold">Top 2 → R32</span>
              </div>
              <table class="table-premium">
                <thead>
                  <tr>
                    <th class="text-left" style="width:40%">{t(l, "standings.team")}</th>
                    <th class="text-center">P</th>
                    <th class="text-center">W</th>
                    <th class="text-center">D</th>
                    <th class="text-center">L</th>
                    <th class="text-center">GD</th>
                    <th class="text-center font-bold gold-text-static">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {(teams as any[]).map((team, idx) => (
                    <tr class={`${idx < 2 ? "bg-green-50/50 dark:bg-green-900/10" : ""}`}>
                      <td class="text-sm">
                        <span class="inline-flex items-center gap-1.5 font-semibold text-gray-900 dark:text-white" title={teamName(l, team.team_name)}>
                          <span class="flex-shrink-0">{flagOf(team.team_name)}</span>
                        </span>
                        {idx < 2 && <span class="ml-1 text-[10px] text-green-500 flex-shrink-0">↑</span>}
                      </td>
                      <td class="text-sm text-center text-gray-500">{team.played}</td>
                      <td class="text-sm text-center text-gray-500">{team.won}</td>
                      <td class="text-sm text-center text-gray-500">{team.drawn}</td>
                      <td class="text-sm text-center text-gray-500">{team.lost}</td>
                      <td class={`text-sm text-center font-semibold ${team.goal_diff > 0 ? "text-green-500" : team.goal_diff < 0 ? "text-red-400" : "text-gray-400"}`}>
                        {team.goal_diff > 0 ? "+" : ""}{team.goal_diff}
                      </td>
                      <td class="text-sm text-center">
                        <span class="font-extrabold gold-text-static">{team.points}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

// ========== LEADERBOARD ==========
async function leaderboardHandler(c: any) {
  const l = c.var.lang;
  const users = await c.env.DB.prepare("SELECT username, points, (SELECT COUNT(*) FROM user_achievements WHERE user_id = users.id) as achievements_count FROM users ORDER BY points DESC LIMIT 100").all<any>();
  return c.html(
    <Layout title={t(l, "leaderboard.title")} description={t(l, "leaderboard.description")} lang={l} user={c.var.user}>
      <div class="max-w-4xl mx-auto px-4 py-8">
        <div class="mb-8">
          <h1 class="section-title">{t(l, "leaderboard.title")}</h1>
          <p class="section-subtitle">{t(l, "leaderboard.description")}</p>
        </div>
        <div class="glass-card overflow-hidden">
          <table class="table-premium">
            <thead>
              <tr>
                <th class="text-left" style="width:60px">RANK</th>
                <th class="text-left">{t(l, "leaderboard.username")}</th>
                <th class="text-center">{t(l, "leaderboard.achievements")}</th>
                <th class="text-right">{t(l, "leaderboard.points")}</th>
              </tr>
            </thead>
            <tbody>
              {users.results.map((u: any, i: number) => (
                <tr>
                  <td>
                    <span class={`rank-badge ${i === 0 ? "rank-1" : i === 1 ? "rank-2" : i === 2 ? "rank-3" : "rank-other"}`}>
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                    </span>
                  </td>
                  <td class="text-sm font-semibold text-gray-900 dark:text-white">{u.username}</td>
                  <td class="text-sm text-center text-gray-400">{u.achievements_count} 🏅</td>
                  <td class="text-sm text-right">
                    <span class="font-extrabold gold-text-static">{u.points} pts</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

// ========== PROFILE ==========
async function profileHandler(c: any) {
  const l = c.var.lang;
  if (!c.var.user) return c.redirect(href(c, "/auth/login"));
  const user = await c.env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(c.var.user.id).first<any>();
  const achievements = await c.env.DB.prepare("SELECT ad.*, ua.earned_at FROM user_achievements ua JOIN achievement_defs ad ON ad.id = ua.achievement_id WHERE ua.user_id = ? ORDER BY ua.earned_at DESC").bind(c.var.user.id).all<any>();
  const predictions = await c.env.DB.prepare("SELECT p.*, m.home_team, m.away_team, m.home_score, m.away_score, m.status FROM predictions p JOIN matches m ON m.id = p.match_id WHERE p.user_id = ? ORDER BY p.created_at DESC LIMIT 20").bind(c.var.user.id).all<any>();
  return c.html(
    <Layout title={`${user?.username} - FIFA 2026`} description={t(l, "profile.description")} lang={l} user={c.var.user}>
      <div class="max-w-4xl mx-auto px-4 py-8">
        <div class="profile-header mb-8 anim-up">
          <div class="profile-avatar">{user?.username?.charAt(0).toUpperCase()}</div>
          <div>
            <h1 class="profile-name">{user?.username}</h1>
            <div class="profile-stats">
              <div>
                <div class="profile-stat-value">{user?.points || 0}</div>
                <div class="profile-stat-label">{t(l, "profile.points")}</div>
              </div>
              <div>
                <div class="profile-stat-value">{achievements.results?.length ?? 0}</div>
                <div class="profile-stat-label">{t(l, "profile.achievements")}</div>
              </div>
              <div>
                <div class="profile-stat-value">{predictions.results?.length ?? 0}</div>
                <div class="profile-stat-label">Predictions</div>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-8 anim-up-1">
          <h2 class="section-title mb-6">{t(l, "profile.achievements")}</h2>
          <div class="achievement-grid">
            {(achievements.results?.length > 0 ? achievements.results.map((a: any) => (
              <div class="achievement-card">
                <div class="achievement-icon">{getAchievementIcon(a.key)}</div>
                <div class="achievement-name">{a.name}</div>
                <div class="achievement-desc">{a.description}</div>
              </div>
            )) : (
              <p class="text-gray-400 dark:text-gray-500 col-span-4 text-center py-8">{t(l, "profile.no_achievements")}</p>
            ))}
          </div>
        </div>

        <div class="anim-up-2">
          <h2 class="section-title mb-6">{t(l, "profile.predictions")}</h2>
          <div class="space-y-3">
            {(predictions.results?.length > 0 ? predictions.results.map((p: any) => (
              <div class="match-card block">
                <div class="flex items-center">
                  <div class="flex-1 flex flex-col items-center gap-1 min-w-0">
                    <span class="flex-shrink-0">{flagOf(p.home_team, 28)}</span>
                    <span class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate max-w-full">{teamName(l, p.home_team)}</span>
                  </div>
                  <div class="flex-shrink-0 text-center px-3 sm:px-6">
                    <div class="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">{t(l, "profile.your_pick")}</div>
                    <div class="text-lg font-extrabold text-blue-600 dark:text-blue-400">{p.home_pred} - {p.away_pred}</div>
                    {p.status === "finished" && p.points_earned != null && (
                      <div class={`text-xs font-bold mt-0.5 ${p.points_earned > 0 ? "text-green-500" : "text-red-400"}`}>
                        {p.points_earned > 0 ? `+${p.points_earned}` : "0"} pts
                      </div>
                    )}
                  </div>
                  <div class="flex-1 flex flex-col items-center gap-1 min-w-0">
                    <span class="flex-shrink-0">{flagOf(p.away_team, 28)}</span>
                    <span class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate max-w-full">{teamName(l, p.away_team)}</span>
                  </div>
                </div>
              </div>
            )) : (
              <p class="text-center text-gray-400 dark:text-gray-500 py-8">{t(l, "profile.no_predictions")}</p>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

// ========== ACHIEVEMENTS ==========
async function achievementsHandler(c: any) {
  const l = c.var.lang;
  const defs = await c.env.DB.prepare("SELECT * FROM achievement_defs").all<any>();
  return c.html(
    <Layout title={t(l, "achievements.title")} description={t(l, "achievements.description")} lang={l} user={c.var.user}>
      <div class="max-w-5xl mx-auto px-4 py-8">
        <div class="mb-8">
          <h1 class="section-title">{t(l, "achievements.title")}</h1>
          <p class="section-subtitle">Collect them all and prove your expertise</p>
        </div>
        <div class="achievement-grid" style="grid-template-columns:repeat(auto-fill,minmax(150px,1fr))">
          {defs.results?.map((a: any, idx: number) => (
            <div class="achievement-card anim-up" style={`animation-delay:${idx*0.04}s`}>
              <div class="achievement-icon">{getAchievementIcon(a.key)}</div>
              <div class="achievement-name">{a.name}</div>
              <div class="achievement-desc">{a.description}</div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

// ========== API ENDPOINTS ==========
async function chatPost(c: any) {
  const roomId = c.req.param("roomId");
  if (!c.var.user) return c.redirect(`/${c.var.lang}/auth/login?redirect=/community`);
  const body = await c.req.parseBody();
  const content = String(body.content || "").trim();
  if (!content) return c.json({ error: "empty" }, 400);
  const id = crypto.randomUUID();
  await c.env.DB.prepare("INSERT INTO chat_messages (id, room_id, user_id, content) VALUES (?, ?, ?, ?)").bind(id, roomId, c.var.user.id, content).run();
  return c.json({ success: true });
}

async function chatGet(c: any) {
  const roomId = c.req.param("roomId");
  const messages = await c.env.DB.prepare("SELECT cm.*, u.username FROM chat_messages cm JOIN users u ON u.id = cm.user_id WHERE cm.room_id = ? ORDER BY cm.created_at DESC LIMIT 50").bind(roomId).all<any>();
  return c.json(messages.results ?? []);
}

async function onlineCount(c: any) {
  return c.json({ online: await getOnlineCount(c.env.DB) });
}

async function sitemap(c: any) {
  const pages = ["", "schedule", "standings", "leaderboard", "achievements"];
  let urls = "";
  for (const lang of SUPPORTED_LANGS) {
    for (const page of pages) {
      urls += `<url><loc>https://fifa2026.workers.dev/${lang}/${page}</loc><changefreq>daily</changefreq><priority>0.8</priority></url>`;
    }
  }
  return c.body(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, 200, { "Content-Type": "application/xml" });
}

// ========== MATCH DETAIL ==========
async function matchDetailHandler(c: any) {
  const l = c.var.lang;
  const matchId = c.req.param("matchId");
  const match = await c.env.DB.prepare("SELECT * FROM matches WHERE id = ?").bind(matchId).first<any>();
  if (!match) return c.redirect(`/${l}/schedule`);

  let userPred = null;
  if (c.var.user) {
    userPred = await c.env.DB.prepare("SELECT * FROM predictions WHERE user_id = ? AND match_id = ?").bind(c.var.user.id, matchId).first<any>();
  }

  const matchComments = await c.env.DB.prepare(
    "SELECT mc.*, u.username FROM match_comments mc JOIN users u ON u.id = mc.user_id WHERE mc.match_id = ? ORDER BY mc.created_at DESC LIMIT 30"
  ).bind(matchId).all<any>();

  const canPredict = match.status === "scheduled" && !userPred && !!c.var.user;

  return c.html(
    <Layout title={`${teamName(l, match.home_team)} vs ${teamName(l, match.away_team)} - FIFA 2026`} description={`${match.stage} match: ${teamName(l, match.home_team)} vs ${teamName(l, match.away_team)}`} lang={l} user={c.var.user}>
      <div class="max-w-4xl mx-auto px-4 py-8">
        {/* Match Scoreboard */}
        <div class="card-premium mb-8 anim-scale text-center">
          <div class="flex items-center justify-center gap-2 mb-4">
            <span class={`stage-badge ${match.stage}`}>{match.stage.replace(/_/g, " ")}</span>
            {match.group_name && <span class="badge badge-blue">{match.group_name}</span>}
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400 mb-6">{match.match_date}{match.venue ? ` · ${match.venue}` : ""}</div>

          <div class="flex items-center justify-center gap-6 sm:gap-12 py-4">
            <div class="text-center flex-1">
              <div class="mb-2">{flagOf(match.home_team, 48)}</div>
              <div class="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">{teamName(l, match.home_team)}</div>
            </div>
            <div class="text-center">
              {match.status === "finished" ? (
                <div class="text-5xl sm:text-6xl font-black text-gray-900 dark:text-white font-mono tracking-tighter">
                  {match.home_score}<span class="text-gray-300 dark:text-gray-600 mx-1">-</span>{match.away_score}
                </div>
              ) : match.status === "live" ? (
                <div class="text-3xl font-black text-red-500 animate-pulse font-mono">LIVE</div>
              ) : (
                <div class="text-3xl font-black text-gray-300 dark:text-gray-600 font-mono">VS</div>
              )}
            </div>
            <div class="text-center flex-1">
              <div class="mb-2">{flagOf(match.away_team, 48)}</div>
              <div class="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">{teamName(l, match.away_team)}</div>
            </div>
          </div>

          {/* User prediction */}
          {userPred && (
            <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-center border border-blue-100 dark:border-blue-900/30">
              <div class="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Your Prediction</div>
              <div class="text-2xl font-extrabold text-blue-700 dark:text-blue-300 font-mono">{userPred.home_pred} - {userPred.away_pred}</div>
              {match.status === "finished" && userPred.points_earned != null && (
                <div class={`mt-1 text-sm font-bold ${userPred.points_earned > 0 ? "text-green-500" : "text-red-400"}`}>
                  {userPred.points_earned > 0 ? `+${userPred.points_earned} pts` : "0 pts"}
                </div>
              )}
            </div>
          )}

          {/* Prediction form */}
          {canPredict ? (
            <form action={`/${l}/api/predict/${matchId}`} method="post" class="mt-6">
              <div class="flex items-center justify-center gap-4">
                <div class="flex-1 max-w-[120px]">
                  <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 text-center truncate">{teamName(l, match.home_team)}</label>
                  <input type="number" name="home_pred" min="0" max="20" required class="input-field text-center text-2xl font-extrabold font-mono py-3" placeholder="0" />
                </div>
                <div class="text-2xl font-black text-gray-400 mt-5">:</div>
                <div class="flex-1 max-w-[120px]">
                  <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 text-center truncate">{teamName(l, match.away_team)}</label>
                  <input type="number" name="away_pred" min="0" max="20" required class="input-field text-center text-2xl font-extrabold font-mono py-3" placeholder="0" />
                </div>
              </div>
              <button type="submit" class="btn btn-gold w-full mt-5 py-3 text-lg font-extrabold">
                ⚡ Submit Prediction
              </button>
            </form>
          ) : match.status === "scheduled" && !c.var.user ? (
            <div class="mt-6 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl text-center border border-amber-200 dark:border-amber-800/30">
              <p class="text-sm text-amber-700 dark:text-amber-300 mb-3">Login to submit your score prediction!</p>
              <a href={`/${l}/auth/login?redirect=/matches/${matchId}`} class="btn btn-primary btn-sm">Login to Predict</a>
            </div>
          ) : null}
        </div>

        {/* Comments */}
        <div class="glass-card p-6 anim-up">
          <h2 class="text-lg font-extrabold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            💬 Match Comments
          </h2>
          <div class="space-y-3 mb-4" id="match-comments">
            {matchComments.results?.length > 0 ? matchComments.results.map((mc: any) => (
              <div class="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <div class="flex items-center gap-2 mb-1">
                  <span class="chat-avatar" style="width:1.5rem;height:1.5rem;font-size:.625rem">{mc.username?.charAt(0).toUpperCase()}</span>
                  <span class="text-xs font-semibold text-gray-900 dark:text-white">{mc.username}</span>
                  <span class="text-[10px] text-gray-400">{mc.created_at}</span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 ml-8">{mc.content}</p>
              </div>
            )) : (
              <p class="text-gray-400 dark:text-gray-500 text-center py-6">No comments yet. Be the first!</p>
            )}
          </div>
          {c.var.user ? (
            <form action={`/${l}/api/match/${matchId}/comment`} method="post" class="flex gap-2">
              <input name="content" required placeholder="Share your thoughts..." class="input-field flex-1 py-2 text-sm" />
              <button type="submit" class="btn btn-primary btn-sm">Send</button>
            </form>
          ) : (
            <p class="text-center text-sm text-gray-400">
              <a href={`/${l}/auth/login`} class="text-blue-500 font-semibold hover:underline">Login</a> to comment
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
}

// ========== PREDICTION API ==========
async function predictPost(c: any) {
  const l = c.var.lang;
  const matchId = c.req.param("matchId");
  if (!c.var.user) return c.redirect(`/${l}/auth/login?redirect=/matches/${matchId}`);

  const body = await c.req.parseBody();
  const home_pred = parseInt(String(body.home_pred));
  const away_pred = parseInt(String(body.away_pred));

  if (isNaN(home_pred) || isNaN(away_pred) || home_pred < 0 || away_pred < 0) {
    return c.redirect(`/${l}/matches/${matchId}?error=invalid`);
  }

  const match = await c.env.DB.prepare("SELECT * FROM matches WHERE id = ?").bind(matchId).first<any>();
  if (!match || match.status !== "scheduled") return c.redirect(`/${l}/matches/${matchId}?error=closed`);

  const existing = await c.env.DB.prepare("SELECT id FROM predictions WHERE user_id = ? AND match_id = ?").bind(c.var.user.id, matchId).first();
  if (existing) return c.redirect(`/${l}/matches/${matchId}?error=duplicate`);

  const id = crypto.randomUUID();
  await c.env.DB.prepare(
    "INSERT INTO predictions (id, user_id, match_id, home_pred, away_pred) VALUES (?, ?, ?, ?, ?)"
  ).bind(id, c.var.user.id, matchId, home_pred, away_pred).run();

  return c.redirect(`/${l}/matches/${matchId}`);
}

async function matchCommentPost(c: any) {
  const l = c.var.lang;
  const matchId = c.req.param("matchId");
  if (!c.var.user) return c.redirect(`/${l}/auth/login?redirect=/matches/${matchId}`);

  const body = await c.req.parseBody();
  const content = String(body.content || "").trim();
  if (!content) return c.redirect(`/${l}/matches/${matchId}`);

  const id = crypto.randomUUID();
  await c.env.DB.prepare(
    "INSERT INTO match_comments (id, match_id, user_id, content) VALUES (?, ?, ?, ?)"
  ).bind(id, matchId, c.var.user.id, content).run();

  return c.redirect(`/${l}/matches/${matchId}`);
}

// ========== PREDICTIONS LIST ==========
async function predictionsHandler(c: any) {
  const l = c.var.lang;
  const matches = await c.env.DB.prepare(
    "SELECT * FROM matches WHERE status = 'scheduled' ORDER BY match_date ASC LIMIT 50"
  ).all<any>();

  return c.html(
    <Layout title={t(l, "predictions.title")} description={t(l, "predictions.description")} lang={l} user={c.var.user}>
      <div class="max-w-4xl mx-auto px-4 py-8">
        <div class="mb-8">
          <h1 class="section-title">{t(l, "predictions.title")}</h1>
          <p class="section-subtitle">{t(l, "predictions.description")}</p>
        </div>
        <div class="space-y-3">
          {matches.results?.length > 0 ? matches.results.map((m: any, idx: number) => (
            <a href={`/${l}/matches/${m.id}`} class="match-card block anim-up" style={`animation-delay:${idx*0.03}s`}>
              <div class="flex items-center">
                <div class="flex-1 flex flex-col items-center gap-1 min-w-0">
                  <span class="flex-shrink-0">{flagOf(m.home_team, 28)}</span>
                  <span class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate max-w-full">{teamName(l, m.home_team)}</span>
                </div>
                <div class="flex-shrink-0 text-center px-3 sm:px-6">
                  <span class="match-card-vs">VS</span>
                  <div class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{m.match_date}</div>
                  <div class="mt-0.5">
                    <span class={`stage-badge ${m.stage}`}>{m.stage === "group" ? `Group ${m.group_name}` : m.stage.replace(/_/g, " ")}</span>
                  </div>
                </div>
                <div class="flex-1 flex flex-col items-center gap-1 min-w-0">
                  <span class="flex-shrink-0">{flagOf(m.away_team, 28)}</span>
                  <span class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate max-w-full">{teamName(l, m.away_team)}</span>
                </div>
              </div>
            </a>
          )) : (
            <p class="text-center text-gray-400 dark:text-gray-500 py-16">{t(l, "predictions.none")}</p>
          )}
        </div>
      </div>
    </Layout>
  );
}

// ========== TEAM CHAT ROOM ==========
const ALL_TEAMS = [
  "Mexico","South Africa","South Korea","Czechia","Canada","Bosnia and Herzegovina","Qatar","Switzerland",
  "Brazil","Morocco","Haiti","Scotland","USA","Paraguay","Australia","Türkiye",
  "Germany","Curaçao","Ivory Coast","Ecuador","Netherlands","Japan","Sweden","Tunisia",
  "Belgium","Egypt","Iran","New Zealand","Spain","Cape Verde","Saudi Arabia","Uruguay",
  "France","Senegal","Iraq","Norway","Argentina","Algeria","Austria","Jordan",
  "Portugal","DR Congo","Uzbekistan","Colombia","England","Croatia","Ghana","Panama",
];

const TEAM_FLAGS: Record<string, string> = {
  "Mexico": "mx", "South Africa": "za", "South Korea": "kr", "Czechia": "cz",
  "Canada": "ca", "Bosnia and Herzegovina": "ba", "Qatar": "qa", "Switzerland": "ch",
  "Brazil": "br", "Morocco": "ma", "Haiti": "ht", "Scotland": "gb-sct",
  "USA": "us", "Paraguay": "py", "Australia": "au", "Türkiye": "tr",
  "Germany": "de", "Curaçao": "cw", "Ivory Coast": "ci", "Ecuador": "ec",
  "Netherlands": "nl", "Japan": "jp", "Sweden": "se", "Tunisia": "tn",
  "Belgium": "be", "Egypt": "eg", "Iran": "ir", "New Zealand": "nz",
  "Spain": "es", "Cape Verde": "cv", "Saudi Arabia": "sa", "Uruguay": "uy",
  "France": "fr", "Senegal": "sn", "Iraq": "iq", "Norway": "no",
  "Argentina": "ar", "Algeria": "dz", "Austria": "at", "Jordan": "jo",
  "Portugal": "pt", "DR Congo": "cd", "Uzbekistan": "uz", "Colombia": "co",
  "England": "gb-eng", "Croatia": "hr", "Ghana": "gh", "Panama": "pa",
};

function flagUrl(name: string): string | null {
  const code = TEAM_FLAGS[name];
  if (!code) return null;
  return `https://flagicons.lipis.dev/flags/4x3/${code}.svg`;
}

function FlagIcon({ name, size, className }: { name: string; size?: number; className?: string }) {
  const url = flagUrl(name);
  if (!url) return <span class={className}>{name.charAt(0)}</span>;
  const w = size || 24;
  const h = Math.round(w * 0.75);
  return <img src={url} width={w} height={h} alt={name} class={`flag-icon ${className || ""}`} loading="lazy" />;
}

function flagOf(name: string, size?: number) {
  return <FlagIcon name={name} size={size} />;
}

function teamName(lang: string, name: string): string {
  return t(lang, `team.${name}`);
}

async function teamRoomHandler(c: any) {
  const l = c.var.lang;
  const teamParam = c.req.param("teamName");
  const team = ALL_TEAMS.find(t => t.toLowerCase() === teamParam.toLowerCase());
  if (!team) return c.redirect(`/${l}/community`);

  const roomId = `team_${team.toLowerCase().replace(/\s+/g, "_")}`;
  const messages = await c.env.DB.prepare(
    "SELECT cm.*, u.username FROM chat_messages cm JOIN users u ON u.id = cm.user_id WHERE cm.room_id = ? ORDER BY cm.created_at DESC LIMIT 50"
  ).bind(roomId).all<any>();

  const teamMatches = await c.env.DB.prepare(
    "SELECT * FROM matches WHERE (home_team = ? OR away_team = ?) ORDER BY match_date ASC"
  ).bind(team, team).all<any>();

  return c.html(
    <Layout title={`${teamName(l, team)} - Team Chat`} description={`Discussion for ${teamName(l, team)} fans`} lang={l} user={c.var.user}>
      <div class="max-w-4xl mx-auto px-4 py-8">
        <div class="card-premium mb-6 anim-up">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-yellow-400 flex items-center justify-center text-2xl shadow-lg">
              {TEAM_FLAGS[team] ? <FlagIcon name={team} size={32} /> : team.charAt(0)}
            </div>
            <div>
              <h1 class="text-2xl font-extrabold text-gray-900 dark:text-white">{teamName(l, team)}</h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">{t(l, "community.team_room")}</p>
            </div>
          </div>
          {teamMatches.results?.length > 0 && (
            <div class="flex gap-2 overflow-x-auto pb-1">
              {teamMatches.results.map((m: any) => (
                <a href={`/${l}/matches/${m.id}`} class="filter-pill">
                  vs {teamName(l, m.home_team === team ? m.away_team : m.home_team)}
                </a>
              ))}
            </div>
          )}
        </div>

        <ChatRoom roomId={roomId} lang={l} user={c.var.user} initialMessages={messages.results ?? []} />
      </div>
    </Layout>
  );
}

// ========== PLAYER FAN GROUP ==========
const POPULAR_PLAYERS = [
  "Lionel Messi","Cristiano Ronaldo","Kylian Mbappé","Erling Haaland",
  "Vinicius Jr","Jude Bellingham","Harry Kane","Mohamed Salah",
  "Kevin De Bruyne","Lamine Yamal","Pedri","Jamal Musiala",
  "Florian Wirtz","Bukayo Saka","Phil Foden","Rodri",
  "Antoine Griezmann","Robert Lewandowski","Lautaro Martínez","Federico Valverde",
];

async function playerRoomHandler(c: any) {
  const l = c.var.lang;
  const playerName = c.req.param("playerName");
  const player = POPULAR_PLAYERS.find(p => p.toLowerCase().replace(/\s+/g, "-") === playerName.toLowerCase());
  if (!player) return c.redirect(`/${l}/community`);

  const roomId = `player_${player.toLowerCase().replace(/\s+/g, "_")}`;
  const messages = await c.env.DB.prepare(
    "SELECT cm.*, u.username FROM chat_messages cm JOIN users u ON u.id = cm.user_id WHERE cm.room_id = ? ORDER BY cm.created_at DESC LIMIT 50"
  ).bind(roomId).all<any>();

  return c.html(
    <Layout title={`${player} - Fan Group`} description={`Fan group for ${player}`} lang={l} user={c.var.user}>
      <div class="max-w-4xl mx-auto px-4 py-8">
        <div class="card-premium mb-6 anim-up">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
              {player.charAt(0)}
            </div>
            <div>
              <h1 class="text-2xl font-extrabold text-gray-900 dark:text-white">{player}</h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">{t(l, "community.player_group")}</p>
            </div>
          </div>
        </div>
        <ChatRoom roomId={roomId} lang={l} user={c.var.user} initialMessages={messages.results ?? []} />
      </div>
    </Layout>
  );
}

// ========== COMMUNITY HUB ==========
async function getOnlineCount(db: D1Database): Promise<number> {
  const r = await db.prepare("SELECT COUNT(*) as count FROM users WHERE updated_at > datetime('now', '-2 minutes')").first<{ count: number }>();
  const real = r?.count ?? 0;
  return real >= 300 ? real : 300 + Math.floor(Math.random() * 200);
}

async function communityHandler(c: any) {
  const l = c.var.lang;

  return c.html(
    <Layout title={t(l, "community.title")} description={t(l, "community.description")} lang={l} user={c.var.user}>
      <div class="max-w-5xl mx-auto px-4 py-8">
        <div class="mb-8">
          <h1 class="section-title">{t(l, "community.title")}</h1>
          <p class="section-subtitle">Join the conversation with fans worldwide</p>
        </div>

        <div class="mb-10 anim-up">
          <h2 class="text-xl font-extrabold mb-5 text-gray-900 dark:text-white flex items-center gap-2">
            <span>⚽</span> {t(l, "community.teams")}
          </h2>
          <div class="entity-grid">
            {ALL_TEAMS.map(team => (
              <a href={`/${l}/teams/${team.toLowerCase()}`} class="entity-card">
                <div class="entity-avatar team">{TEAM_FLAGS[team] ? <FlagIcon name={team} size={28} /> : team.charAt(0)}</div>
                <span class="entity-name">{teamName(l, team)}</span>
              </a>
            ))}
          </div>
        </div>

        <div class="anim-up-1">
          <h2 class="text-xl font-extrabold mb-5 text-gray-900 dark:text-white flex items-center gap-2">
            <span>⭐</span> {t(l, "community.players")}
          </h2>
          <div class="entity-grid">
            {POPULAR_PLAYERS.map(player => (
              <a href={`/${l}/players/${player.toLowerCase().replace(/\s+/g, "-")}`} class="entity-card">
                <div class="entity-avatar player">{player.charAt(0)}</div>
                <span class="entity-name">{player}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

// ========== CHATROOM COMPONENT ==========
function ChatRoom({ roomId, lang, user, initialMessages }: {
  roomId: string; lang: string;
  user: { id: string; username: string } | null;
  initialMessages: any[];
}) {
  return (
    <div class="glass-card overflow-hidden anim-up-1">
      <div class="px-5 py-3 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
        <span class="text-sm font-bold text-gray-700 dark:text-gray-300">💬 {t(lang, "community.chat")}</span>
        <div class="live-indicator">
          <span class="live-dot"></span>
          <span class="text-xs text-gray-500">{t(lang, "community.live")}</span>
        </div>
      </div>

      <div class="chat-container p-4 space-y-2" id={`chat-${roomId}`} data-chat-room={roomId}>
        {initialMessages.length > 0 ? initialMessages.toReversed().map((msg: any) => (
          <div class="chat-bubble">
            <div class="chat-avatar">{msg.username?.charAt(0).toUpperCase()}</div>
            <div class="flex-1 min-w-0">
              <div class="chat-meta">
                <span class="chat-username">{msg.username}</span>
                <span class="chat-time">{msg.created_at?.split(" ")[1]?.slice(0, 5)}</span>
              </div>
              <p class="chat-content">{msg.content}</p>
            </div>
          </div>
        )) : (
          <p class="text-center text-gray-400 dark:text-gray-500 py-8">{t(lang, "community.no_messages")}</p>
        )}
      </div>

      {user ? (
        <form class="p-3 border-t border-gray-100 dark:border-gray-700/50 flex gap-2"
          action={`/${lang}/api/chat/${roomId}`} method="post"
        >
          <input name="content" required placeholder={t(lang, "community.type_message")} class="input-field flex-1 py-2 text-sm" />
          <button type="submit" class="btn btn-primary btn-sm">{t(lang, "community.send")}</button>
        </form>
      ) : (
        <div class="p-3 border-t border-gray-100 dark:border-gray-700/50 text-center">
          <a href={`/${lang}/auth/login`} class="text-sm text-blue-500 font-semibold hover:underline">{t(lang, "community.login_to_chat")}</a>
        </div>
      )}
    </div>
  );
}

// ========== SCORING API ==========
async function scoreMatchHandler(c: any) {
  const matchId = c.req.param("matchId");
  const match = await c.env.DB.prepare("SELECT * FROM matches WHERE id = ? AND status = 'finished'").bind(matchId).first<any>();
  if (!match) return c.json({ error: "Match not found or not finished" }, 404);

  const predictions = await c.env.DB.prepare(
    "SELECT * FROM predictions WHERE match_id = ? AND points_earned = 0"
  ).bind(matchId).all<any>();

  if (!predictions.results?.length) return c.json({ scored: 0 });

  let scored = 0;
  for (const p of predictions.results) {
    const { calculateAndSavePoints, checkAndAwardAchievements } = await import("../lib/points");
    try {
      await calculateAndSavePoints(c.env.DB, p.user_id, p.id, matchId);
      await checkAndAwardAchievements(c.env.DB, p.user_id);
      scored++;
    } catch {}
  }

  return c.json({ scored, match_id: matchId });
}

// ========== ROUTE DEFINITIONS ==========
router.get("/", homeHandler);
router.get("/sitemap.xml", sitemap);
router.get("/robots.txt", (c) => c.body("User-agent: *\nAllow: /\nSitemap: https://fifa2026.workers.dev/sitemap.xml"));
router.get("/api/score/:matchId", scoreMatchHandler);

for (const lang of SUPPORTED_LANGS) {
  router.get(`/${lang}`, homeHandler);
  router.get(`/${lang}/auth/login`, loginGet);
  router.post(`/${lang}/auth/login`, loginPost);
  router.get(`/${lang}/auth/register`, registerGet);
  router.post(`/${lang}/auth/register`, registerPost);
  router.get(`/${lang}/auth/logout`, logoutGet);
  router.get(`/${lang}/results`, resultsHandler);
  router.get(`/${lang}/schedule`, scheduleHandler);
  router.get(`/${lang}/standings`, standingsHandler);
  router.get(`/${lang}/leaderboard`, leaderboardHandler);
  router.get(`/${lang}/profile`, profileHandler);
  router.get(`/${lang}/predictions`, predictionsHandler);
  router.get(`/${lang}/achievements`, achievementsHandler);
  router.get(`/${lang}/community`, communityHandler);
  router.get(`/${lang}/teams/:teamName`, teamRoomHandler);
  router.get(`/${lang}/players/:playerName`, playerRoomHandler);
  router.get(`/${lang}/matches/:matchId`, matchDetailHandler);
  router.post(`/${lang}/api/predict/:matchId`, predictPost);
  router.post(`/${lang}/api/match/:matchId/comment`, matchCommentPost);
  router.post(`/${lang}/api/chat/:roomId`, chatPost);
  router.get(`/${lang}/api/chat/:roomId`, chatGet);
  router.get(`/${lang}/api/online-count`, onlineCount);
}

// ========== HELPERS ==========
function getCountdown(): string {
  const wc2026 = new Date("2026-06-11T00:00:00Z");
  const now = new Date();
  const diff = wc2026.getTime() - now.getTime();
  if (diff <= 0) return "The tournament has begun!";
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  return `${days} days ${hours} hours until kickoff`;
}

async function getRecentMatches(db: D1Database) {
  const r = await db.prepare("SELECT * FROM matches WHERE status = 'finished' ORDER BY match_date DESC LIMIT 6").all<any>();
  return r.results ?? [];
}

async function getTopUsers(db: D1Database) {
  const r = await db.prepare("SELECT username, points FROM users ORDER BY points DESC LIMIT 5").all<any>();
  return r.results ?? [];
}

function getAchievementIcon(key: string): string {
  const icons: Record<string, string> = { welcome: "🎉", first_correct: "🎯", streak_5: "🔥", streak_10: "💥", prediction_50: "⭐", perfect_group: "🏆", chatty: "💬", social_butterfly: "🦋", top10: "👑", early_bird: "🐦", knockout_master: "🏅", champion_predict: "🌍" };
  return icons[key] || "🏅";
}

export { router };
