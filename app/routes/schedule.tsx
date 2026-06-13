import { Layout } from "../components/Layout";
import { t } from "../lib/i18n";
import { flagOf, teamName } from "../lib/teams";
import { localTime, parseMatchDate } from "../lib/helpers";

export async function scheduleHandler(c: any) {
  const l = c.var.lang;
  const matches = await c.env.DB.prepare("SELECT * FROM matches ORDER BY match_date ASC").all();
  const grouped: Record<string, any[]> = {};
  for (const m of matches.results ?? []) {
    const d = m.match_date.slice(0, 10);
    if (!grouped[d]) grouped[d] = [];
    grouped[d].push(m);
  }
  const breadcrumbLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": t(l, "nav.home"), "item": `https://2026.ikber.cc/${l}` },
      { "@type": "ListItem", "position": 2, "name": t(l, "schedule.title") }
    ]
  });

  return c.html(
    <Layout
      title={t(l, "schedule.title")}
      description={t(l, "schedule.description")}
      keywords={`FIFA World Cup 2026 schedule,match calendar,${t(l, "schedule.title")},world cup fixtures,2026 matches`}
      lang={l}
      url={c.req.url}
      canonicalUrl={`https://2026.ikber.cc/${l}/schedule`}
      jsonLd={breadcrumbLd}
      user={c.var.user}
    >
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
                <div class="font-bold text-gray-900 dark:text-white">{localTime(date + " 00:00", { showDate: true })}</div>
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
                      {(() => {
                        if (m.home_score != null) return <span class="match-card-score">{m.home_score} - {m.away_score}</span>;
                        const matchTime = parseMatchDate(m.match_date);
                        const now = Date.now();
                        if (matchTime <= now && now - matchTime <= 2 * 60 * 60 * 1000) return <span class="text-sm font-bold text-red-500 animate-pulse">LIVE</span>;
                        if (matchTime <= now) return <span class="text-sm font-bold text-gray-400">FT</span>;
                        return <span class="match-card-vs">VS</span>;
                      })()}
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

export async function resultsHandler(c: any) {
  const l = c.var.lang;
  const stageFilter = c.req.query("stage") || "";
  let query = "SELECT * FROM matches WHERE status = 'finished' ORDER BY match_date DESC";
  if (stageFilter) { query = "SELECT * FROM matches WHERE status = 'finished' AND stage = ? ORDER BY match_date DESC"; }
  const matches = stageFilter
    ? await c.env.DB.prepare(query).bind(stageFilter).all()
    : await c.env.DB.prepare(query).all();
  const stages = await c.env.DB.prepare("SELECT DISTINCT stage FROM matches WHERE status = 'finished' ORDER BY stage").all();

  const breadcrumbLd2 = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": t(l, "nav.home"), "item": `https://2026.ikber.cc/${l}` },
      { "@type": "ListItem", "position": 2, "name": t(l, "results.title") }
    ]
  });

  return c.html(
    <Layout
      title={t(l, "results.title")}
      description={t(l, "results.description")}
      keywords={`FIFA World Cup 2026 results,${t(l, "results.title")},match results,world cup scores,completed matches`}
      lang={l}
      url={c.req.url}
      canonicalUrl={`https://2026.ikber.cc/${l}/results`}
      jsonLd={breadcrumbLd2}
      user={c.var.user}
    >
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
          )) : (
            <p class="text-center text-gray-400 dark:text-gray-500 py-16">{t(l, "results.empty")}</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
