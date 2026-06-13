import { Layout } from "../components/Layout";
import { t } from "../lib/i18n";

export async function leaderboardHandler(c: any) {
  const l = c.var.lang;
  const users = await c.env.DB.prepare(
    "SELECT username, points, (SELECT COUNT(*) FROM user_achievements WHERE user_id = users.id) as achievements_count FROM users ORDER BY points DESC LIMIT 100"
  ).all();
  const breadcrumbLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": t(l, "nav.home"), "item": `https://2026.ikber.cc/${l}` },
      { "@type": "ListItem", "position": 2, "name": t(l, "leaderboard.title") }
    ]
  });

  return c.html(
    <Layout
      title={t(l, "leaderboard.title")}
      description={t(l, "leaderboard.description")}
      keywords={`FIFA World Cup 2026 leaderboard,${t(l, "leaderboard.title")},prediction ranking,top predictors,world cup points`}
      lang={l}
      url={c.req.url}
      canonicalUrl={`https://2026.ikber.cc/${l}/leaderboard`}
      jsonLd={breadcrumbLd}
      user={c.var.user}
    >
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
                  <td class="text-sm text-right"><span class="font-extrabold gold-text-static">{u.points} pts</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
