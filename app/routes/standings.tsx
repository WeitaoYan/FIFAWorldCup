import { Layout } from "../components/Layout";
import { t } from "../lib/i18n";
import { flagOf, teamName } from "../lib/teams";

export async function standingsHandler(c: any) {
  const l = c.var.lang;
  const st = await c.env.DB.prepare("SELECT * FROM standings ORDER BY group_name, points DESC, goal_diff DESC").all();
  const grouped: Record<string, any[]> = {};
  for (const s of st.results ?? []) {
    if (!grouped[s.group_name]) grouped[s.group_name] = [];
    grouped[s.group_name].push(s);
  }
  const breadcrumbLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": t(l, "nav.home"), "item": `https://2026.ikber.cc/${l}` },
      { "@type": "ListItem", "position": 2, "name": t(l, "standings.title") }
    ]
  });

  return c.html(
    <Layout
      title={t(l, "standings.title")}
      description={t(l, "standings.description")}
      keywords={`FIFA World Cup 2026 standings,${t(l, "standings.title")},group standings,world cup table,group stage ranking`}
      lang={l}
      url={c.req.url}
      canonicalUrl={`https://2026.ikber.cc/${l}/standings`}
      jsonLd={breadcrumbLd}
      user={c.var.user}
    >
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
                    <th class="text-center">P</th><th class="text-center">W</th><th class="text-center">D</th>
                    <th class="text-center">L</th><th class="text-center">GD</th>
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
                      <td class="text-sm text-center"><span class="font-extrabold gold-text-static">{team.points}</span></td>
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
