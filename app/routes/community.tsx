import { Layout } from "../components/Layout";
import { t } from "../lib/i18n";
import { ALL_TEAMS, TEAM_FLAGS, POPULAR_PLAYERS, FlagIcon, teamName, PlayerAvatar } from "../lib/teams";
import { ChatRoom } from "./chat";

export async function communityHandler(c: any) {
  const l = c.var.lang;
  const breadcrumbLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": t(l, "nav.home"), "item": `https://2026.ikber.cc/${l}` },
      { "@type": "ListItem", "position": 2, "name": t(l, "community.title") }
    ]
  });

  return c.html(
    <Layout
      title={t(l, "community.title")}
      description={t(l, "community.description")}
      keywords={`FIFA World Cup 2026 community,${t(l, "community.title")},team chat,player fan groups,world cup discussion`}
      lang={l}
      url={c.req.url}
      canonicalUrl={`https://2026.ikber.cc/${l}/community`}
      jsonLd={breadcrumbLd}
      user={c.var.user}
    >
      <div class="max-w-5xl mx-auto px-4 py-8">
        <div class="mb-8">
          <h1 class="section-title">{t(l, "community.title")}</h1>
          <p class="section-subtitle">Join the conversation with fans worldwide</p>
        </div>

        <div class="mb-10 anim-up">
          <h2 class="text-xl font-extrabold mb-5 text-gray-900 dark:text-white flex items-center gap-2"><span>⚽</span> {t(l, "community.teams")}</h2>
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
          <h2 class="text-xl font-extrabold mb-5 text-gray-900 dark:text-white flex items-center gap-2"><span>⭐</span> {t(l, "community.players")}</h2>
          <div class="entity-grid">
            {POPULAR_PLAYERS.map(player => (
              <a href={`/${l}/players/${player.toLowerCase().replace(/\s+/g, "-")}`} class="entity-card">
                <div class="entity-avatar player"><PlayerAvatar name={player} size={48} /></div>
                <span class="entity-name">{player}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function teamRoomHandler(c: any) {
  const l = c.var.lang;
  const teamParam = c.req.param("teamName");
  const team = ALL_TEAMS.find(t => t.toLowerCase() === teamParam.toLowerCase());
  if (!team) return c.redirect(`/${l}/community`);

  const roomId = `team_${team.toLowerCase().replace(/\s+/g, "_")}`;
  const messages = await c.env.DB.prepare(
    "SELECT cm.*, u.username FROM chat_messages cm JOIN users u ON u.id = cm.user_id WHERE cm.room_id = ? ORDER BY cm.created_at DESC LIMIT 50"
  ).bind(roomId).all();

  const teamMatches = await c.env.DB.prepare(
    "SELECT * FROM matches WHERE (home_team = ? OR away_team = ?) ORDER BY match_date ASC"
  ).bind(team, team).all();

  const teamBreadcrumbLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": t(l, "nav.home"), "item": `https://2026.ikber.cc/${l}` },
      { "@type": "ListItem", "position": 2, "name": t(l, "community.title"), "item": `https://2026.ikber.cc/${l}/community` },
      { "@type": "ListItem", "position": 3, "name": `${teamName(l, team)} Chat` }
    ]
  });

  return c.html(
    <Layout
      title={`${teamName(l, team)} - Team Chat | FIFA World Cup 2026`}
      description={`Join the ${teamName(l, team)} fan discussion. Chat with other fans, discuss match predictions, and follow ${teamName(l, team)}'s journey in the FIFA World Cup 2026.`}
      keywords={`${teamName(l, team)},team chat,FIFA World Cup 2026,${teamName(l, team)} discussion,football chat`}
      lang={l}
      url={c.req.url}
      canonicalUrl={`https://2026.ikber.cc/${l}/teams/${team.toLowerCase()}`}
      jsonLd={teamBreadcrumbLd}
      user={c.var.user}
    >
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

export async function playerRoomHandler(c: any) {
  const l = c.var.lang;
  const playerName = c.req.param("playerName");
  const player = POPULAR_PLAYERS.find(p => p.toLowerCase().replace(/\s+/g, "-") === playerName.toLowerCase());
  if (!player) return c.redirect(`/${l}/community`);

  const roomId = `player_${player.toLowerCase().replace(/\s+/g, "_")}`;
  const messages = await c.env.DB.prepare(
    "SELECT cm.*, u.username FROM chat_messages cm JOIN users u ON u.id = cm.user_id WHERE cm.room_id = ? ORDER BY cm.created_at DESC LIMIT 50"
  ).bind(roomId).all();

  const playerBreadcrumbLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": t(l, "nav.home"), "item": `https://2026.ikber.cc/${l}` },
      { "@type": "ListItem", "position": 2, "name": t(l, "community.title"), "item": `https://2026.ikber.cc/${l}/community` },
      { "@type": "ListItem", "position": 3, "name": `${player} Fan Group` }
    ]
  });

  return c.html(
    <Layout
      title={`${player} - Fan Group | FIFA World Cup 2026`}
      description={`Join the ${player} fan group. Discuss ${player}'s performance, predictions, and more with fans worldwide during the FIFA World Cup 2026.`}
      keywords={`${player},fan group,FIFA World Cup 2026,${player} discussion,player chat`}
      lang={l}
      url={c.req.url}
      canonicalUrl={`https://2026.ikber.cc/${l}/players/${player.toLowerCase().replace(/\s+/g, "-")}`}
      jsonLd={playerBreadcrumbLd}
      user={c.var.user}
    >
      <div class="max-w-4xl mx-auto px-4 py-8">
        <div class="card-premium mb-6 anim-up">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
              <PlayerAvatar name={player} size={56} />
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
