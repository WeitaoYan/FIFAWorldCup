import { Layout } from "../components/Layout";
import { t } from "../lib/i18n";
import { getAchievementIcon } from "../lib/helpers";

export async function achievementsHandler(c: any) {
  const l = c.var.lang;
  const defs = await c.env.DB.prepare("SELECT * FROM achievement_defs").all();
  const breadcrumbLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": t(l, "nav.home"), "item": `https://2026.ikber.cc/${l}` },
      { "@type": "ListItem", "position": 2, "name": t(l, "achievements.title") }
    ]
  });

  return c.html(
    <Layout
      title={t(l, "achievements.title")}
      description={t(l, "achievements.description")}
      keywords={`FIFA World Cup 2026 achievements,${t(l, "achievements.title")},badges,rewards,world cup achievements`}
      lang={l}
      url={c.req.url}
      canonicalUrl={`https://2026.ikber.cc/${l}/achievements`}
      jsonLd={breadcrumbLd}
      user={c.var.user}
    >
      <div class="max-w-5xl mx-auto px-4 py-8">
        <div class="mb-8">
          <h1 class="section-title">{t(l, "achievements.title")}</h1>
          <p class="section-subtitle">Collect them all and prove your expertise</p>
        </div>
        <div class="achievement-grid" style="grid-template-columns:repeat(auto-fill,minmax(150px,1fr))">
          {defs.results?.map((a: any, idx: number) => (
            <div class="achievement-card anim-up" style={`animation-delay:${idx*0.04}s`}>
              <div class="achievement-icon">{getAchievementIcon(a.key)}</div>
              <div class="achievement-name">{t(l, `achievement.${a.key}.name`) || a.name}</div>
              <div class="achievement-desc">{t(l, `achievement.${a.key}.desc`) || a.description}</div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
