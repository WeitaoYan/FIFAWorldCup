import { z } from "zod";
import { setCookie, deleteCookie } from "hono/cookie";
import { sign } from "hono/jwt";
import { Layout } from "../components/Layout";
import { t } from "../lib/i18n";
import { hashPassword, verifyPassword } from "../lib/crypto";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export const registerSchema = z.object({
  username: z.string().min(2).max(20),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export async function loginGet(c: any) {
  const l = c.var.lang;
  const error = c.req.query("error");
  return c.html(
    <Layout
      title={`${t(l, "auth.login_title")} - FIFA World Cup 2026`}
      description={`Sign in to your FIFA World Cup 2026 account to predict scores, earn points, and compete with fans worldwide.`}
      keywords="FIFA World Cup 2026,login,sign in,predictions,fan hub"
      lang={l}
      url={c.req.url}
      canonicalUrl={`https://2026.ikber.cc/${l}/auth/login`}
      user={null}
    >
      <div class="max-w-md mx-auto px-4 py-16">
        <div class="auth-card anim-scale">
          <h1 class="auth-title">⚽ {t(l, "auth.login_title")}</h1>
          <form action={href(c, "/auth/login")} method="post" class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t(l, "auth.email")}</label>
              <input type="email" name="email" required class="input-field" placeholder="your@email.com" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t(l, "auth.password")}</label>
              <input type="password" name="password" required class="input-field" placeholder="••••••••" />
            </div>
            <button type="submit" class="btn btn-primary w-full py-3">{t(l, "auth.login")}</button>
          </form>
          <p class="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
            {t(l, "auth.no_account")} <a href={href(c, "/auth/register")} class="text-blue-600 dark:text-blue-400 font-semibold hover:underline">{t(l, "auth.register_link")}</a>
          </p>
          {error && <p class="mt-3 text-center text-sm text-red-500 font-medium">{error === "invalid" ? "Invalid credentials" : error}</p>}
        </div>
      </div>
    </Layout>
  );
}

export async function loginPost(c: any) {
  const l = c.var.lang;
  try {
    const body = await c.req.parseBody();
    const { email, password } = loginSchema.parse(body);
    const user = await c.env.DB.prepare("SELECT id, username, password_hash FROM users WHERE email = ?").bind(email).first();
    if (!user || !(await verifyPassword(password, user.password_hash))) return c.redirect(href(c, "/auth/login?error=invalid"));
    const token = await sign({ sub: user.id, username: user.username }, "secret-key", "HS256");
    setCookie(c, "token", token, { path: "/", httpOnly: true, sameSite: "Lax", maxAge: 604800 });
    return c.redirect(`/${l}`);
  } catch { return c.redirect(href(c, "/auth/login?error=invalid")); }
}

export async function registerGet(c: any) {
  const l = c.var.lang;
  return c.html(
    <Layout
      title={`${t(l, "auth.register_title")} - FIFA World Cup 2026`}
      description={`Create your FIFA World Cup 2026 account to start predicting match scores, earning points, collecting achievements, and competing on the global leaderboard.`}
      keywords="FIFA World Cup 2026,register,create account,sign up,predictions"
      lang={l}
      url={c.req.url}
      canonicalUrl={`https://2026.ikber.cc/${l}/auth/register`}
      user={null}
    >
      <div class="max-w-md mx-auto px-4 py-16">
        <div class="auth-card anim-scale">
          <h1 class="auth-title">🌟 {t(l, "auth.register_title")}</h1>
          <form action={href(c, "/auth/register")} method="post" class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t(l, "auth.username")}</label>
              <input name="username" required minLength={3} class="input-field" placeholder="Choose a username" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t(l, "auth.email")}</label>
              <input type="email" name="email" required class="input-field" placeholder="your@email.com" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t(l, "auth.password")}</label>
              <input type="password" name="password" required minLength={6} class="input-field" placeholder="Min 6 characters" />
            </div>
            <button type="submit" class="btn btn-gold w-full py-3">{t(l, "auth.register")}</button>
          </form>
          <p class="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
            {t(l, "auth.has_account")} <a href={href(c, "/auth/login")} class="text-blue-600 dark:text-blue-400 font-semibold hover:underline">{t(l, "auth.login_link")}</a>
          </p>
        </div>
      </div>
    </Layout>
  );
}

export async function registerPost(c: any) {
  const l = c.var.lang;
  try {
    const body = await c.req.parseBody();
    const { username, email, password } = registerSchema.parse(body);
    const existing = await c.env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
    if (existing) return c.redirect(href(c, "/auth/register?error=exists"));
    const id = crypto.randomUUID();
    const hashed = await hashPassword(password);
    await c.env.DB.prepare("INSERT INTO users (id, username, email, password_hash) VALUES (?, ?, ?, ?)").bind(id, username, email, hashed).run();
    await c.env.DB.prepare("INSERT OR IGNORE INTO user_achievements (id, user_id, achievement_id) VALUES (?, ?, (SELECT id FROM achievement_defs WHERE key = 'welcome'))").bind(crypto.randomUUID(), id).run();
    const token = await sign({ sub: id, username }, "secret-key", "HS256");
    setCookie(c, "token", token, { path: "/", httpOnly: true, sameSite: "Lax", maxAge: 604800 });
    return c.redirect(`/${l}`);
  } catch { return c.redirect(href(c, "/auth/register?error=invalid")); }
}

export async function logoutGet(c: any) {
  const l = c.var.lang;
  deleteCookie(c, "token");
  return c.redirect(`/${l}`);
}

function href(c: { var: { lang: string } }, path: string) {
  return `/${c.var.lang}${path}`;
}
