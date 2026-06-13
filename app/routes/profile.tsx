import { Layout } from "../components/Layout";
import { t } from "../lib/i18n";
import { flagOf, teamName } from "../lib/teams";
import { getAchievementIcon } from "../lib/helpers";

export async function profileHandler(c: any) {
  const l = c.var.lang;
  if (!c.var.user) return c.redirect(href(c, "/auth/login"));
  const user = await c.env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(c.var.user.id).first();
  const achievements = await c.env.DB.prepare("SELECT ad.*, ua.earned_at FROM user_achievements ua JOIN achievement_defs ad ON ad.id = ua.achievement_id WHERE ua.user_id = ? ORDER BY ua.earned_at DESC").bind(c.var.user.id).all();
  const predictions = await c.env.DB.prepare("SELECT p.*, m.home_team, m.away_team, m.home_score, m.away_score, m.status FROM predictions p JOIN matches m ON m.id = p.match_id WHERE p.user_id = ? ORDER BY p.created_at DESC LIMIT 20").bind(c.var.user.id).all();
  return c.html(
    <Layout
      title={`${user?.username} - FIFA World Cup 2026`}
      description={t(l, "profile.description")}
      keywords={`${user?.username},FIFA World Cup 2026 profile,predictions,achievements`}
      lang={l}
      url={c.req.url}
      canonicalUrl={`https://2026.ikber.cc/${l}/profile`}
      user={c.var.user}
    >
      <div class="max-w-4xl mx-auto px-4 py-8">
        <div class="profile-header mb-8 anim-up">
          <div class="profile-avatar">{user?.username?.charAt(0).toUpperCase()}</div>
          <div>
            <h1 class="profile-name">{user?.username}</h1>
            <div class="profile-stats">
              <div><div class="profile-stat-value">{user?.points || 0}</div><div class="profile-stat-label">{t(l, "profile.points")}</div></div>
              <div><div class="profile-stat-value">{achievements.results?.length ?? 0}</div><div class="profile-stat-label">{t(l, "profile.achievements")}</div></div>
              <div><div class="profile-stat-value">{predictions.results?.length ?? 0}</div><div class="profile-stat-label">Predictions</div></div>
            </div>
          </div>
        </div>

        <div class="mb-8 anim-up-1">
          <h2 class="section-title mb-6">{t(l, "profile.achievements")}</h2>
          <div class="achievement-grid">
            {(achievements.results?.length > 0 ? achievements.results.map((a: any) => (
              <div class="achievement-card">
                <div class="achievement-icon">{getAchievementIcon(a.key)}</div>
                <div class="achievement-name">{t(l, `achievement.${a.key}.name`) || a.name}</div>
                <div class="achievement-desc">{t(l, `achievement.${a.key}.desc`) || a.description}</div>
              </div>
            )) : <p class="text-gray-400 dark:text-gray-500 col-span-4 text-center py-8">{t(l, "profile.no_achievements")}</p>)}
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
            )) : <p class="text-center text-gray-400 dark:text-gray-500 py-8">{t(l, "profile.no_predictions")}</p>)}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function href(c: { var: { lang: string } }, path: string) {
  return `/${c.var.lang}${path}`;
}
