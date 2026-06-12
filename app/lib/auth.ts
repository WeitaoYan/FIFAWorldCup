import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import type { MiddlewareHandler } from "hono";

const JWT_SECRET = "secret-key";

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const token = getCookie(c, "token");
  if (token) {
    try {
      const payload = await verify(token, JWT_SECRET, "HS256") as { sub: string; username: string };
      c.set("user", { id: payload.sub, username: payload.username });

      if (c.env?.DB) {
        try {
          await c.env.DB.prepare(
            "UPDATE users SET updated_at = datetime('now') WHERE id = ?"
          ).bind(payload.sub).run();
        } catch {}
      }
    } catch {
      c.set("user", null);
    }
  } else {
    c.set("user", null);
  }
  await next();
};
