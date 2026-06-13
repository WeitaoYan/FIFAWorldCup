import { t } from "../lib/i18n";
import { OnlineCount } from "./OnlineCount";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";

function Header({ lang, user }: { lang: string; user: { id: string; username: string } | null }) {
  const nav = [
    { href: `/${lang}`, labelKey: "nav.home" },
    { href: `/${lang}/schedule`, labelKey: "nav.schedule" },
    { href: `/${lang}/results`, labelKey: "nav.results" },
    { href: `/${lang}/standings`, labelKey: "nav.standings" },
    { href: `/${lang}/predictions`, labelKey: "nav.predictions" },
    { href: `/${lang}/community`, labelKey: "nav.community" },
    { href: `/${lang}/leaderboard`, labelKey: "nav.leaderboard" },
  ];

  return (
    <header class="site-header">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          {/* Logo */}
          <a href={`/${lang}`} class="flex items-center gap-2.5 group flex-shrink-0">
            <div class="relative">
              <span class="text-xl font-black gold-text-preload tracking-tighter">2026</span>
              <div class="absolute -bottom-0.5 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </div>
            <span class="text-[10px] font-semibold text-gray-500 dark:text-gray-400 hidden sm:inline tracking-widest uppercase leading-tight max-w-[70px]">
              FIFA<br/>World Cup
            </span>
          </a>

          {/* Desktop: full nav + actions */}
          <nav class="hidden md:flex items-center gap-0.5">
            {nav.map((item) => (
              <a href={item.href} class="nav-link">{t(lang, item.labelKey)}</a>
            ))}
          </nav>

          <div class="hidden md:flex items-center gap-1.5">
            <OnlineCount />
            <LanguageSwitcher currentLang={lang} />
            <ThemeToggle />
            {user ? (
              <a href={`/${lang}/profile`} class="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ml-1">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span class="hidden sm:inline font-medium">{user.username}</span>
              </a>
            ) : (
              <a href={`/${lang}/auth/login`} class="btn btn-gold btn-sm ml-1">
                {t(lang, "nav.login")}
              </a>
            )}
          </div>

          {/* Mobile: only lang + login/user + hamburger */}
          <div class="flex md:hidden items-center gap-1">
            <LanguageSwitcher currentLang={lang} />
            {user ? (
              <a href={`/${lang}/profile`} class="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-xs font-bold text-white shadow-sm hover:shadow-md transition-shadow">
                {user.username.charAt(0).toUpperCase()}
              </a>
            ) : (
              <a href={`/${lang}/auth/login`} class="btn btn-gold btn-sm !py-1.5 !px-3 text-xs">
                {t(lang, "nav.login")}
              </a>
            )}
            <button
              id="mobile-menu-toggle"
              class="hamburger"
              aria-label="Toggle navigation menu"
              aria-expanded="false"
            >
              <span class="hamburger-box">
                <span class="hamburger-line hamburger-line-top"></span>
                <span class="hamburger-line hamburger-line-middle"></span>
                <span class="hamburger-line hamburger-line-bottom"></span>
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div id="mobile-menu" class="hidden md:hidden border-t border-gray-100 dark:border-gray-700 py-3 pb-4">
          <nav class="flex flex-col gap-0.5">
            {nav.map((item) => (
              <a href={item.href} class="nav-link block py-2.5 px-3 rounded-lg">{t(lang, item.labelKey)}</a>
            ))}
          </nav>
          <div class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between px-3">
            <OnlineCount />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

export { Header };
