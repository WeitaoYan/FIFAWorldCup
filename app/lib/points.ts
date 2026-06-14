interface MatchResult {
  home_score: number;
  away_score: number;
}

interface Prediction {
  home_pred: number;
  away_pred: number;
}

export interface ScoreResult {
  points: number;
  exact_score: boolean;
  correct_outcome: boolean;
  correct_home_goals: boolean;
  correct_away_goals: boolean;
}

export function calculatePoints(prediction: Prediction, actual: MatchResult): ScoreResult {
  const { home_pred, away_pred } = prediction;
  const { home_score, away_score } = actual;

  const exact_score = home_pred === home_score && away_pred === away_score;

  const actual_outcome = home_score > away_score ? "home" : home_score < away_score ? "away" : "draw";
  const pred_outcome = home_pred > away_pred ? "home" : home_pred < away_pred ? "away" : "draw";
  const correct_outcome = actual_outcome === pred_outcome;

  const correct_home_goals = home_pred === home_score;
  const correct_away_goals = away_pred === away_score;

  let points = 0;
  if (exact_score) points += 5;
  else if (correct_outcome) points += 3;
  if (correct_home_goals) points += 1;
  if (correct_away_goals) points += 1;

  return { points, exact_score, correct_outcome, correct_home_goals, correct_away_goals };
}

export async function calculateAndSavePoints(
  db: D1Database,
  userId: string,
  predictionId: string,
  matchId: string
): Promise<{ points: number; streak: number }> {
  const [prediction, match] = await Promise.all([
    db.prepare("SELECT * FROM predictions WHERE id = ?").bind(predictionId).first<any>(),
    db.prepare("SELECT * FROM matches WHERE id = ?").bind(matchId).first<any>(),
  ]);

  if (!prediction || !match) throw new Error("Prediction or match not found");
  if (match.home_score === null || match.away_score === null) throw new Error("Match not finished");

  const result = calculatePoints(
    { home_pred: prediction.home_pred, away_pred: prediction.away_pred },
    { home_score: match.home_score, away_score: match.away_score }
  );

  let finalPoints = result.points;

  const streak = await db.prepare(
    "SELECT current_streak FROM streaks WHERE user_id = ?"
  ).bind(userId).first<any>();

  let currentStreak = streak?.current_streak ?? 0;

  if (result.correct_outcome || result.exact_score) {
    currentStreak += 1;
    if (currentStreak >= 3) {
      finalPoints = Math.round(finalPoints * 1.5);
    }

    const streakId = `streak_${userId}`;
    const existing = await db.prepare("SELECT max_streak FROM streaks WHERE id = ?").bind(streakId).first<any>();
    const newMax = Math.max(existing?.max_streak ?? 0, currentStreak);

    await db.prepare(
      `INSERT OR REPLACE INTO streaks (id, user_id, current_streak, max_streak, updated_at)
       VALUES (?, ?, ?, ?, datetime('now'))`
    ).bind(streakId, userId, currentStreak, newMax).run();
  } else {
    currentStreak = 0;
    await db.prepare(
      "UPDATE streaks SET current_streak = 0 WHERE user_id = ?"
    ).bind(userId).run();
  }

  await db.prepare(
    "UPDATE predictions SET points_earned = ? WHERE id = ?"
  ).bind(finalPoints, predictionId).run();

  await db.prepare(
    "UPDATE users SET points = points + ? WHERE id = ?"
  ).bind(finalPoints, userId).run();

  return { points: finalPoints, streak: currentStreak };
}

export async function checkAndAwardAchievements(db: D1Database, userId: string) {
  const defs = await db.prepare("SELECT * FROM achievement_defs").all<any>();
  const userAchievements = await db.prepare(
    "SELECT achievement_id FROM user_achievements WHERE user_id = ?"
  ).bind(userId).all<any>();
  const earned = new Set((userAchievements.results ?? []).map((a: any) => a.achievement_id));

  for (const def of defs.results ?? []) {
    if (earned.has(def.id)) continue;

    const criteria = JSON.parse(def.criteria || "{}");
    let shouldAward = false;

    switch (criteria.type) {
      case "register": {
        shouldAward = true;
        break;
      }
      case "correct_prediction": {
        const r = await db.prepare(
          "SELECT COUNT(*) as c FROM predictions WHERE user_id = ? AND points_earned >= 5"
        ).bind(userId).first<any>();
        shouldAward = (r?.c ?? 0) >= (criteria.count ?? 1);
        break;
      }
      case "predictions": {
        const r = await db.prepare(
          "SELECT COUNT(*) as c FROM predictions WHERE user_id = ?"
        ).bind(userId).first<any>();
        shouldAward = (r?.c ?? 0) >= (criteria.count ?? 50);
        break;
      }
      case "streak": {
        const r = await db.prepare(
          "SELECT max_streak FROM streaks WHERE user_id = ?"
        ).bind(userId).first<any>();
        shouldAward = (r?.max_streak ?? 0) >= (criteria.count ?? 5);
        break;
      }
      case "messages": {
        const r = await db.prepare(
          "SELECT COUNT(*) as c FROM chat_messages WHERE user_id = ?"
        ).bind(userId).first<any>();
        shouldAward = (r?.c ?? 0) >= (criteria.count ?? 100);
        break;
      }
      case "rank": {
        const r = await db.prepare(
          "SELECT COUNT(*) + 1 as rank FROM users WHERE points > (SELECT points FROM users WHERE id = ?)"
        ).bind(userId).first<any>();
        shouldAward = (r?.rank ?? 999) <= (criteria.position ?? 10);
        break;
      }
    }

    if (shouldAward) {
      await db.prepare(
        "INSERT OR IGNORE INTO user_achievements (id, user_id, achievement_id) VALUES (?, ?, ?)"
      ).bind(crypto.randomUUID(), userId, def.id).run();
    }
  }
}
