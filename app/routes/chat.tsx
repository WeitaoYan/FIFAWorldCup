import { t } from "../lib/i18n";
import { getOnlineCount } from "../lib/helpers";
import { UserAvatar } from "../lib/teams";

export function ChatRoom({ roomId, lang, user, initialMessages }: {
  roomId: string; lang: string;
  user: { id: string; username: string } | null;
  initialMessages: any[];
}) {
  return (
    <div class="glass-card overflow-hidden anim-up-1">
      <div class="px-5 py-3 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
        <span class="text-sm font-bold text-gray-700 dark:text-gray-300">💬 {t(lang, "community.chat")}</span>
        <div class="live-indicator">
          <span class="live-dot"></span>
          <span class="text-xs text-gray-500">{t(lang, "community.live")}</span>
        </div>
      </div>

      <div class="chat-container p-4 space-y-2" id={`chat-${roomId}`} data-chat-room={roomId}>
        {initialMessages.length > 0 ? initialMessages.toReversed().map((msg: any) => (
          <div class="chat-bubble">
            <div class="chat-avatar"><UserAvatar username={msg.username || "?"} size={32} /></div>
            <div class="flex-1 min-w-0">
              <div class="chat-meta">
                <span class="chat-username">{msg.username}</span>
                <span class="chat-time">{msg.created_at?.split(" ")[1]?.slice(0, 5)}</span>
              </div>
              <p class="chat-content">{msg.content}</p>
            </div>
          </div>
        )) : (
          <p class="text-center text-gray-400 dark:text-gray-500 py-8">{t(lang, "community.no_messages")}</p>
        )}
      </div>

      {user ? (
        <form class="p-3 border-t border-gray-100 dark:border-gray-700/50 flex gap-2"
          action={`/${lang}/api/chat/${roomId}`} method="post"
        >
          <input name="content" required placeholder={t(lang, "community.type_message")} class="input-field flex-1 py-2 text-sm" />
          <button type="submit" class="btn btn-primary btn-sm">{t(lang, "community.send")}</button>
        </form>
      ) : (
        <div class="p-3 border-t border-gray-100 dark:border-gray-700/50 text-center">
          <a href={`/${lang}/auth/login`} class="text-sm text-blue-500 font-semibold hover:underline">{t(lang, "community.login_to_chat")}</a>
        </div>
      )}
    </div>
  );
}

export async function chatPost(c: any) {
  const roomId = c.req.param("roomId");
  if (!c.var.user) return c.redirect(`/${c.var.lang}/auth/login?redirect=/community`);
  const body = await c.req.parseBody();
  const content = String(body.content || "").trim();
  if (!content) return c.json({ error: "empty" }, 400);
  const id = crypto.randomUUID();
  await c.env.DB.prepare("INSERT INTO chat_messages (id, room_id, user_id, content) VALUES (?, ?, ?, ?)").bind(id, roomId, c.var.user.id, content).run();
  return c.json({ success: true });
}

export async function chatGet(c: any) {
  const roomId = c.req.param("roomId");
  const messages = await c.env.DB.prepare(
    "SELECT cm.*, u.username FROM chat_messages cm JOIN users u ON u.id = cm.user_id WHERE cm.room_id = ? ORDER BY cm.created_at DESC LIMIT 50"
  ).bind(roomId).all();
  return c.json(messages.results ?? []);
}

export async function onlineCount(c: any) {
  return c.json({ online: await getOnlineCount(c.env.DB) });
}

export async function sitemap(c: any) {
  const { SUPPORTED_LANGS } = await import("../lib/i18n");
  const { ALL_TEAMS, POPULAR_PLAYERS } = await import("../lib/teams");

  const staticPages = ["", "schedule", "standings", "leaderboard", "achievements", "results", "predictions", "community"];
  const urls: string[] = [];

  for (const lang of SUPPORTED_LANGS) {
    // Static pages
    for (const page of staticPages) {
      const priority = page === "" ? "1.0" : "0.8";
      urls.push(`<url><loc>https://2026.ikber.cc/${lang}/${page}</loc><changefreq>hourly</changefreq><priority>${priority}</priority></url>`);
    }

    // Team pages (from ALL_TEAMS imported above)
    for (const team of ALL_TEAMS) {
      urls.push(`<url><loc>https://2026.ikber.cc/${lang}/teams/${team.toLowerCase()}</loc><changefreq>daily</changefreq><priority>0.7</priority></url>`);
    }

    // Player pages
    for (const player of POPULAR_PLAYERS) {
      urls.push(`<url><loc>https://2026.ikber.cc/${lang}/players/${player.toLowerCase().replace(/\s+/g, "-")}</loc><changefreq>daily</changefreq><priority>0.6</priority></url>`);
    }
  }

  // Match detail pages - fetch dynamically
  try {
    const matches = await c.env.DB.prepare("SELECT id, match_date FROM matches ORDER BY match_date ASC").all();
    if (matches.results) {
      for (const m of matches.results) {
        for (const lang of SUPPORTED_LANGS) {
          urls.push(`<url><loc>https://2026.ikber.cc/${lang}/matches/${m.id}</loc><changefreq>hourly</changefreq><priority>0.7</priority></url>`);
        }
      }
    }
  } catch (_) {
    // DB may not be available during build
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>`;

  return c.body(xml, 200, { "Content-Type": "application/xml" });
}
