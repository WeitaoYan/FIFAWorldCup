import { t } from "../lib/i18n";

function Footer({ lang }: { lang: string }) {
  return (
    <footer class="site-footer">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex items-center gap-3">
            <span class="text-lg font-black gold-text-preload">2026</span>
            <div class="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>
            <span class="text-xs text-gray-500 dark:text-gray-400">&copy; {new Date().getFullYear()} FIFA World Cup Fan Hub</span>
          </div>
          <div class="flex items-center gap-6 text-xs text-gray-500 dark:text-gray-400">
            <a href={`/${lang}`} class="hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">{t(lang, "nav.home")}</a>
            <a href={`/${lang}/schedule`} class="hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">{t(lang, "nav.schedule")}</a>
            <a href={`/${lang}/standings`} class="hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">{t(lang, "nav.standings")}</a>
            <a href={`/${lang}/leaderboard`} class="hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">{t(lang, "nav.leaderboard")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
