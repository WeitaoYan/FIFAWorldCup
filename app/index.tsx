import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { etag } from "hono/etag";

import { router } from "./routes";
import { authMiddleware } from "./lib/auth";
import { i18nMiddleware } from "./lib/i18n";

export type Env = {
  DB: D1Database;
  KV: KVNamespace;
  ASSETS: Fetcher;
  UPDATE_SCORE_API_KEY: string;
};

const app = new Hono<{ Bindings: Env; Variables: { user: { id: string; username: string } | null; lang: string } }>();

app.use("*", secureHeaders());
app.use("*", etag());
app.use("*", cors());
app.use("*", i18nMiddleware);
app.use("*", authMiddleware);

app.route("/", router);

app.all("*", async (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

export default app;
