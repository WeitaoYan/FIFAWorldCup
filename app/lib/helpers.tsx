import type { D1Database } from "@cloudflare/workers-types";

// --- Countdown ---
export function getCountdown(): string {
  const wc2026 = new Date("2026-06-11T00:00:00Z");
  const now = new Date();
  const diff = wc2026.getTime() - now.getTime();
  if (diff <= 0) return "The tournament has begun!";
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  return `${days} days ${hours} hours until kickoff`;
}

// --- DB helpers ---
export async function getRecentMatches(db: D1Database) {
  const r = await db.prepare("SELECT * FROM matches WHERE status = 'finished' ORDER BY match_date DESC LIMIT 6").all<any>();
  return r.results ?? [];
}

export async function getTopUsers(db: D1Database) {
  const r = await db.prepare("SELECT username, points FROM users ORDER BY points DESC LIMIT 5").all<any>();
  return r.results ?? [];
}

export async function getOnlineCount(db: D1Database): Promise<number> {
  const r = await db.prepare("SELECT COUNT(*) as count FROM users WHERE updated_at > datetime('now', '-2 minutes')").first<{ count: number }>();
  const real = r?.count ?? 0;
  return real >= 300 ? real : 300 + Math.floor(Math.random() * 200);
}

// --- Achievements ---
export function getAchievementIcon(key: string): string {
  const icons: Record<string, string> = {
    welcome: "🎉", first_correct: "🎯", streak_5: "🔥", streak_10: "💥",
    prediction_50: "⭐", perfect_group: "🏆", chatty: "💬", social_butterfly: "🦋",
    top10: "👑", early_bird: "🐦", knockout_master: "🏅", champion_predict: "🌍",
  };
  return icons[key] || "🏅";
}

// --- Time helpers ---
export function parseMatchDate(dateStr: string): number {
  return new Date(dateStr.replace(" ", "T") + "Z").getTime();
}

export function toISOString(dateStr: string): string {
  return dateStr.replace(" ", "T") + ":00Z";
}

export function localTime(dateStr: string, opts?: { showDate?: boolean; className?: string }) {
  const iso = toISOString(dateStr);
  const showDate = opts?.showDate !== false;
  const cls = opts?.className || "";
  return (
    <time class={`local-time ${cls}`} datetime={iso} data-show-date={showDate ? "1" : "0"}>
      {iso.replace("T", " ").replace(":00Z", "")} UTC
    </time>
  );
}

// --- Standings update ---
export async function updateStandings(db: D1Database, match: any) {
  if (!match.group_name || match.home_score === null || match.away_score === null) return;

  const alreadyDone = await db.prepare(
    "SELECT standings_updated FROM matches WHERE id = ?"
  ).bind(match.id).first<{standings_updated: number}>();
  if (alreadyDone?.standings_updated) return;

  const homeScore = match.home_score;
  const awayScore = match.away_score;

  await db.prepare(`
    INSERT INTO standings (id, team_name, group_name, played, won, drawn, lost, goals_for, goals_against, goal_diff, points)
    VALUES (?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(team_name, group_name) DO UPDATE SET
      played = played + 1, won = won + ?, drawn = drawn + ?, lost = lost + ?,
      goals_for = goals_for + ?, goals_against = goals_against + ?,
      goal_diff = goal_diff + (? - ?), points = points + ?
  `).bind(
    `s_${match.home_team}_${match.group_name}`, match.home_team, match.group_name,
    homeScore > awayScore ? 1 : 0, homeScore === awayScore ? 1 : 0, homeScore < awayScore ? 1 : 0,
    homeScore, awayScore,
    homeScore > awayScore ? 1 : 0, homeScore === awayScore ? 1 : 0, homeScore < awayScore ? 1 : 0,
    homeScore, awayScore, homeScore, awayScore,
    homeScore > awayScore ? 3 : (homeScore === awayScore ? 1 : 0)
  ).run();

  await db.prepare(`
    INSERT INTO standings (id, team_name, group_name, played, won, drawn, lost, goals_for, goals_against, goal_diff, points)
    VALUES (?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(team_name, group_name) DO UPDATE SET
      played = played + 1, won = won + ?, drawn = drawn + ?, lost = lost + ?,
      goals_for = goals_for + ?, goals_against = goals_against + ?,
      goal_diff = goal_diff + (? - ?), points = points + ?
  `).bind(
    `s_${match.away_team}_${match.group_name}`, match.away_team, match.group_name,
    awayScore > homeScore ? 1 : 0, awayScore === homeScore ? 1 : 0, awayScore < homeScore ? 1 : 0,
    awayScore, homeScore,
    awayScore > homeScore ? 1 : 0, awayScore === homeScore ? 1 : 0, awayScore < homeScore ? 1 : 0,
    awayScore, homeScore, awayScore, homeScore,
    awayScore > homeScore ? 3 : (awayScore === homeScore ? 1 : 0)
  ).run();

  await db.prepare("UPDATE matches SET standings_updated = 1 WHERE id = ?").bind(match.id).run();
}
