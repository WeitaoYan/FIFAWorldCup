import { Layout } from "../components/Layout";
import { t } from "../lib/i18n";
import { flagOf, teamName } from "../lib/teams";
import { localTime } from "../lib/helpers";

export async function predictionsHandler(c: any) {
  const l = c.var.lang;
  const matches = await c.env.DB.prepare("SELECT * FROM matches WHERE status = 'scheduled' ORDER BY match_date ASC LIMIT 50").all();

  const breadcrumbLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": t(l, "nav.home"), "item": `https://2026.ikber.cc/${l}` },
      { "@type": "ListItem", "position": 2, "name": t(l, "predictions.title") }
    ]
  });

  return c.html(
    <Layout
      title={t(l, "predictions.title")}
      description={t(l, "predictions.description")}
      keywords={`FIFA World Cup 2026 predictions,${t(l, "predictions.title")},predict scores,score prediction,world cup betting`}
      lang={l}
      url={c.req.url}
      canonicalUrl={`https://2026.ikber.cc/${l}/predictions`}
      jsonLd={breadcrumbLd}
      user={c.var.user}
    >
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
                  <div class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{localTime(m.match_date, { showDate: false })}</div>
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
          )) : <p class="text-center text-gray-400 dark:text-gray-500 py-16">{t(l, "predictions.none")}</p>}
        </div>
      </div>
    </Layout>
  );
}
