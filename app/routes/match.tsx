import { Layout } from "../components/Layout";
import { t } from "../lib/i18n";
import { flagOf, teamName } from "../lib/teams";
import { localTime, parseMatchDate, updateStandings } from "../lib/helpers";

export async function matchDetailHandler(c: any) {
  const l = c.var.lang;
  const matchId = c.req.param("matchId");
  const match = await c.env.DB.prepare("SELECT * FROM matches WHERE id = ?").bind(matchId).first();
  if (!match) return c.redirect(`/${l}/schedule`);

  let userPred = null;
  if (c.var.user) {
    userPred = await c.env.DB.prepare("SELECT * FROM predictions WHERE user_id = ? AND match_id = ?").bind(c.var.user.id, matchId).first();
  }

  const matchComments = await c.env.DB.prepare(
    "SELECT mc.*, u.username FROM match_comments mc JOIN users u ON u.id = mc.user_id WHERE mc.match_id = ? ORDER BY mc.created_at DESC LIMIT 30"
  ).bind(matchId).all();

  const matchStarted = parseMatchDate(match.match_date) <= Date.now();
  const canPredict = match.status === "scheduled" && !matchStarted && !userPred && !!c.var.user;

  // JSON-LD SportsEvent structured data
  const eventJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": `${teamName(l, match.home_team)} vs ${teamName(l, match.away_team)} - FIFA World Cup 2026`,
    "description": `${match.stage} match: ${teamName(l, match.home_team)} vs ${teamName(l, match.away_team)}`,
    "startDate": match.match_date,
    "eventStatus": match.status === "finished" ? "https://schema.org/EventCompleted" : match.status === "live" ? "https://schema.org/EventScheduled" : "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "homeTeam": {
      "@type": "SportsTeam",
      "name": teamName(l, match.home_team)
    },
    "awayTeam": {
      "@type": "SportsTeam",
      "name": teamName(l, match.away_team)
    },
    ...(match.venue ? {
      "location": {
        "@type": "Place",
        "name": match.venue
      }
    } : {}),
    ...(match.status === "finished" ? {
      "result": {
        "@type": "SportsEvent",
        "homeTeam": { "@type": "SportsTeam", "name": teamName(l, match.home_team), "score": match.home_score },
        "awayTeam": { "@type": "SportsTeam", "name": teamName(l, match.away_team), "score": match.away_score }
      }
    } : {})
  });

  const breadcrumbJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": t(l, "nav.home"), "item": `https://2026.ikber.cc/${l}` },
      { "@type": "ListItem", "position": 2, "name": t(l, "nav.schedule"), "item": `https://2026.ikber.cc/${l}/schedule` },
      { "@type": "ListItem", "position": 3, "name": `${teamName(l, match.home_team)} vs ${teamName(l, match.away_team)}` }
    ]
  });

  return c.html(
    <Layout
      title={`${teamName(l, match.home_team)} vs ${teamName(l, match.away_team)} - FIFA World Cup 2026`}
      description={`${match.stage} match: ${teamName(l, match.home_team)} vs ${teamName(l, match.away_team)}${match.venue ? ` at ${match.venue}` : ""}. ${match.status === "scheduled" ? "Predict the score and earn points!" : match.status === "finished" ? `Final score: ${match.home_score}-${match.away_score}` : "Live now!"}`}
      keywords={`${teamName(l, match.home_team)},${teamName(l, match.away_team)},FIFA World Cup 2026,${match.stage},match,prediction,score,${match.venue || ""}`}
      lang={l}
      url={c.req.url}
      canonicalUrl={`https://2026.ikber.cc/${l}/matches/${matchId}`}
      ogType="article"
      jsonLd={eventJsonLd + breadcrumbJsonLd}
      user={c.var.user}
    >
      <div class="max-w-4xl mx-auto px-4 py-8">
        <div class="card-premium mb-8 anim-scale text-center">
          <div class="flex items-center justify-center gap-2 mb-4">
            <span class={`stage-badge ${match.stage}`}>{match.stage.replace(/_/g, " ")}</span>
            {match.group_name && <span class="badge badge-blue">{match.group_name}</span>}
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400 mb-6">{localTime(match.match_date, { showDate: true })}{match.venue ? ` · ${match.venue}` : ""}</div>

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
              <button type="submit" class="btn btn-gold w-full mt-5 py-3 text-lg font-extrabold">⚡ Submit Prediction</button>
            </form>
          ) : match.status === "scheduled" && !c.var.user ? (
            <div class="mt-6 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl text-center border border-amber-200 dark:border-amber-800/30">
              <p class="text-sm text-amber-700 dark:text-amber-300 mb-3">Login to submit your score prediction!</p>
              <a href={`/${l}/auth/login?redirect=/matches/${matchId}`} class="btn btn-primary btn-sm">Login to Predict</a>
            </div>
          ) : null}
        </div>

        <div class="glass-card p-6 anim-up">
          <h2 class="text-lg font-extrabold mb-4 text-gray-900 dark:text-white flex items-center gap-2">💬 Match Comments</h2>
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
            )) : <p class="text-gray-400 dark:text-gray-500 text-center py-6">No comments yet. Be the first!</p>}
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

export async function predictPost(c: any) {
  const l = c.var.lang;
  const matchId = c.req.param("matchId");
  if (!c.var.user) return c.redirect(`/${l}/auth/login?redirect=/matches/${matchId}`);

  const body = await c.req.parseBody();
  const home_pred = parseInt(String(body.home_pred));
  const away_pred = parseInt(String(body.away_pred));

  if (isNaN(home_pred) || isNaN(away_pred) || home_pred < 0 || away_pred < 0) {
    return c.redirect(`/${l}/matches/${matchId}?error=invalid`);
  }

  const match = await c.env.DB.prepare("SELECT * FROM matches WHERE id = ?").bind(matchId).first();
  if (!match || match.status !== "scheduled") return c.redirect(`/${l}/matches/${matchId}?error=closed`);
  if (parseMatchDate(match.match_date) <= Date.now()) return c.redirect(`/${l}/matches/${matchId}?error=started`);

  const existing = await c.env.DB.prepare("SELECT id FROM predictions WHERE user_id = ? AND match_id = ?").bind(c.var.user.id, matchId).first();
  if (existing) return c.redirect(`/${l}/matches/${matchId}?error=duplicate`);

  const id = crypto.randomUUID();
  await c.env.DB.prepare("INSERT INTO predictions (id, user_id, match_id, home_pred, away_pred) VALUES (?, ?, ?, ?, ?)").bind(id, c.var.user.id, matchId, home_pred, away_pred).run();

  try {
    const homeName = t(l, `team.${match.home_team}`) || match.home_team;
    const awayName = t(l, `team.${match.away_team}`) || match.away_team;
    const announceMsg = `🎯 ${c.var.user.username} ${t(l, "chat.predicted")}: ${homeName} ${home_pred}-${away_pred} ${awayName}`;
    await c.env.DB.prepare("INSERT INTO chat_messages (id, room_id, user_id, content) VALUES (?, ?, ?, ?)").bind(crypto.randomUUID(), "room_global", c.var.user.id, announceMsg).run();
  } catch (_) {}

  return c.redirect(`/${l}/matches/${matchId}`);
}

export async function matchCommentPost(c: any) {
  const l = c.var.lang;
  const matchId = c.req.param("matchId");
  if (!c.var.user) return c.redirect(`/${l}/auth/login?redirect=/matches/${matchId}`);

  const body = await c.req.parseBody();
  const content = String(body.content || "").trim();
  if (!content) return c.redirect(`/${l}/matches/${matchId}`);

  const id = crypto.randomUUID();
  await c.env.DB.prepare("INSERT INTO match_comments (id, match_id, user_id, content) VALUES (?, ?, ?, ?)").bind(id, matchId, c.var.user.id, content).run();
  return c.redirect(`/${l}/matches/${matchId}`);
}

export async function scoreMatchHandler(c: any) {
  const matchId = c.req.param("matchId");
  const match = await c.env.DB.prepare("SELECT * FROM matches WHERE id = ? AND status = 'finished'").bind(matchId).first();
  if (!match) return c.json({ error: "Match not found or not finished" }, 404);

  const predictions = await c.env.DB.prepare("SELECT * FROM predictions WHERE match_id = ? AND points_earned = 0").bind(matchId).all();
  const { calculateAndSavePoints, checkAndAwardAchievements } = await import("../lib/points");
  let scored = 0;
  const errors: string[] = [];
  for (const p of predictions.results) {
    try {
      await calculateAndSavePoints(c.env.DB, p.user_id, p.id, matchId);
      await checkAndAwardAchievements(c.env.DB, p.user_id);
      scored++;
    } catch (e: any) {
      errors.push(e.message || String(e));
      console.error(`Score error for prediction ${p.id}:`, e);
    }
  }

  await updateStandings(c.env.DB, match);
  return c.json({ scored, match_id: matchId, errors: errors.length > 0 ? errors : undefined });
}

// API key is read from Cloudflare secret: UPDATE_SCORE_API_KEY
function verifyApiKey(c: any): boolean {
  const expectedKey = c.env.UPDATE_SCORE_API_KEY;
  if (!expectedKey) return false;
  const authHeader = c.req.header("Authorization") || "";
  const bearerMatch = authHeader.match(/^Bearer\s+(.+)$/i);
  const token = bearerMatch ? bearerMatch[1] : (c.req.query("key") || "");
  return token === expectedKey;
}

export async function updateScoreHandler(c: any) {
  // Verify API key
  if (!verifyApiKey(c)) {
    return c.json({ error: "Unauthorized. Provide a valid API key via Authorization: Bearer <key> header or ?key= query parameter." }, 401);
  }

  const matchId = c.req.param("matchId");
  let body: any;

  try {
    body = await c.req.json();
  } catch {
    // Fallback to form-encoded body
    try {
      const parsed = await c.req.parseBody();
      body = {
        home_score: parsed.home_score != null ? parseInt(String(parsed.home_score)) : undefined,
        away_score: parsed.away_score != null ? parseInt(String(parsed.away_score)) : undefined,
        status: parsed.status || undefined,
      };
    } catch {
      return c.json({ error: "Invalid request body. Send JSON with home_score, away_score, and optional status." }, 400);
    }
  }

  const homeScore = body.home_score;
  const awayScore = body.away_score;
  const newStatus = body.status;

  // Validate scores
  if (homeScore == null || awayScore == null) {
    return c.json({ error: "Both home_score and away_score are required." }, 400);
  }
  if (!Number.isInteger(homeScore) || !Number.isInteger(awayScore)) {
    return c.json({ error: "home_score and away_score must be integers." }, 400);
  }
  if (homeScore < 0 || awayScore < 0) {
    return c.json({ error: "Scores cannot be negative." }, 400);
  }

  // Fetch match
  const match = await c.env.DB.prepare("SELECT * FROM matches WHERE id = ?").bind(matchId).first();
  if (!match) {
    return c.json({ error: "Match not found." }, 404);
  }

  // Determine the final status
  const validStatuses = ["scheduled", "live", "finished"];
  let finalStatus = newStatus;
  if (!finalStatus) {
    // Auto-detect: if scores are provided, mark as finished
    finalStatus = "finished";
  }
  if (!validStatuses.includes(finalStatus)) {
    return c.json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` }, 400);
  }

  const previousStatus = match.status;
  const previousHomeScore = match.home_score;
  const previousAwayScore = match.away_score;

  // Update the match score and status
  await c.env.DB.prepare(
    "UPDATE matches SET home_score = ?, away_score = ?, status = ? WHERE id = ?"
  ).bind(homeScore, awayScore, finalStatus, matchId).run();

  const result: any = {
    success: true,
    match_id: matchId,
    home_team: match.home_team,
    away_team: match.away_team,
    home_score: homeScore,
    away_score: awayScore,
    status: finalStatus,
    previous_status: previousStatus,
  };

  // If status changed to finished and there are predictions, auto-score them
  if (finalStatus === "finished" && homeScore != null && awayScore != null) {
    try {
      const predictions = await c.env.DB.prepare(
        "SELECT * FROM predictions WHERE match_id = ? AND points_earned = 0"
      ).bind(matchId).all();

      if (predictions.results && predictions.results.length > 0) {
        const { calculateAndSavePoints, checkAndAwardAchievements } = await import("../lib/points");
        let scored = 0;
        const errors: string[] = [];

        for (const p of predictions.results) {
          try {
            await calculateAndSavePoints(c.env.DB, p.user_id, p.id, matchId);
            await checkAndAwardAchievements(c.env.DB, p.user_id);
            scored++;
          } catch (e: any) {
            errors.push(e.message || String(e));
            console.error(`Score error for prediction ${p.id}:`, e);
          }
        }

        await updateStandings(c.env.DB, {
          ...match,
          home_score: homeScore,
          away_score: awayScore,
        });

        result.predictions_scored = scored;
        if (errors.length > 0) result.scoring_errors = errors;
      }

      // Post score update announcement to global chat
      try {
        const announceMsg = `📢 FULL TIME: ${match.home_team} ${homeScore}-${awayScore} ${match.away_team} (${match.stage === "group" ? `Group ${match.group_name}` : match.stage.replace(/_/g, " ")})`;
        await c.env.DB.prepare(
          "INSERT INTO chat_messages (id, room_id, user_id, content) VALUES (?, ?, ?, ?)"
        ).bind(crypto.randomUUID(), "room_global", "system", announceMsg).run();
      } catch (_) {}
    } catch (e: any) {
      result.scoring_error = e.message || String(e);
    }
  }

  return c.json(result);
}
