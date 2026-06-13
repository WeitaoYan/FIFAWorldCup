import { Hono } from "hono";
import { SUPPORTED_LANGS } from "../lib/i18n";
import type { Env } from "../index";

import { homeHandler } from "./home";
import { loginGet, loginPost, registerGet, registerPost, logoutGet } from "./auth";
import { scheduleHandler, resultsHandler } from "./schedule";
import { standingsHandler } from "./standings";
import { leaderboardHandler } from "./leaderboard";
import { profileHandler } from "./profile";
import { achievementsHandler } from "./achievements";
import { matchDetailHandler, predictPost, matchCommentPost, scoreMatchHandler, updateScoreHandler } from "./match";
import { predictionsHandler } from "./predictions";
import { communityHandler, teamRoomHandler, playerRoomHandler } from "./community";
import { chatPost, chatGet, onlineCount, sitemap } from "./chat";

const router = new Hono<{
  Bindings: Env;
  Variables: { user: { id: string; username: string } | null; lang: string };
}>();

// Global routes
router.get("/", homeHandler);
router.get("/sitemap.xml", sitemap);
router.get("/robots.txt", (c) => c.body(`User-agent: *
Allow: /
Disallow: /api/
Disallow: /*/auth/
Sitemap: https://2026.ikber.cc/sitemap.xml

User-agent: GPTBot
Disallow: /api/

User-agent: Claude-Web
Disallow: /api/`));
router.get("/api/score/:matchId", scoreMatchHandler);
router.put("/api/score/:matchId", updateScoreHandler);
router.post("/api/score/:matchId", updateScoreHandler);

// Language-prefixed routes
for (const lang of SUPPORTED_LANGS) {
  router.get(`/${lang}`, homeHandler);
  router.get(`/${lang}/auth/login`, loginGet);
  router.post(`/${lang}/auth/login`, loginPost);
  router.get(`/${lang}/auth/register`, registerGet);
  router.post(`/${lang}/auth/register`, registerPost);
  router.get(`/${lang}/auth/logout`, logoutGet);
  router.get(`/${lang}/results`, resultsHandler);
  router.get(`/${lang}/schedule`, scheduleHandler);
  router.get(`/${lang}/standings`, standingsHandler);
  router.get(`/${lang}/leaderboard`, leaderboardHandler);
  router.get(`/${lang}/profile`, profileHandler);
  router.get(`/${lang}/predictions`, predictionsHandler);
  router.get(`/${lang}/achievements`, achievementsHandler);
  router.get(`/${lang}/community`, communityHandler);
  router.get(`/${lang}/teams/:teamName`, teamRoomHandler);
  router.get(`/${lang}/players/:playerName`, playerRoomHandler);
  router.get(`/${lang}/matches/:matchId`, matchDetailHandler);
  router.post(`/${lang}/api/predict/:matchId`, predictPost);
  router.post(`/${lang}/api/match/:matchId/comment`, matchCommentPost);
  router.post(`/${lang}/api/chat/:roomId`, chatPost);
  router.get(`/${lang}/api/chat/:roomId`, chatGet);
  router.get(`/${lang}/api/online-count`, onlineCount);
}

export { router };
