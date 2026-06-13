const LANG_FLAGS: Record<string, string> = {
  en: "us", zh: "cn", fr: "fr", es: "es", ru: "ru", ja: "jp", ko: "kr", hi: "in",
};

function LangFlagIcon({ code, size }: { code: string; size?: number }) {
  const c = LANG_FLAGS[code] || code;
  const w = size || 20;
  const h = Math.round(w * 0.75);
  return <img src={`https://flagicons.lipis.dev/flags/4x3/${c}.svg`} width={w} height={h} alt={code} class="lang-flag-icon" loading="lazy" />;
}

function LanguageSwitcher({ currentLang }: { currentLang: string }) {
  const languages = [
    { code: "en", label: "English", native: "English" },
    { code: "zh", label: "Chinese", native: "中文" },
    { code: "fr", label: "French", native: "Français" },
    { code: "es", label: "Spanish", native: "Español" },
    { code: "ru", label: "Russian", native: "Русский" },
    { code: "ja", label: "Japanese", native: "日本語" },
    { code: "ko", label: "Korean", native: "한국어" },
    { code: "hi", label: "Hindi", native: "हिन्दी" },
  ];

  const current = languages.find((l) => l.code === currentLang) || languages[0];
  const id = "lang-dropdown";

  return (
    <div class="relative" data-lang-dropdown>
      <button
        id={`${id}-trigger`}
        data-lang-trigger
        class="lang-trigger"
        aria-haspopup="listbox"
        aria-expanded="false"
        aria-label={`Current language: ${current.native}. Click to change language.`}
        title={`Switch language (current: ${current.native})`}
      >
        <span class="lang-trigger-flag"><LangFlagIcon code={current.code} size={16} /></span>
        <span class="lang-trigger-code">{current.code.toUpperCase()}</span>
        <svg class="lang-trigger-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <div id={`${id}-backdrop`} class="lang-backdrop hidden" data-lang-backdrop aria-hidden="true"></div>

      <div
        id={`${id}-panel`}
        class="lang-panel hidden"
        role="listbox"
        aria-labelledby={`${id}-trigger`}
        data-lang-panel
      >
        <div class="lang-panel-header">
          <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <span>Choose Language</span>
        </div>
        <div class="lang-panel-list">
          {languages.map((lang) => {
            const isActive = lang.code === currentLang;
            return (
              <button
                key={lang.code}
                role="option"
                aria-selected={isActive ? "true" : "false"}
                data-lang-switch={lang.code}
                tabindex={isActive ? 0 : -1}
                class={`lang-option ${isActive ? "lang-option-active" : ""}`}
              >
                <span class="lang-option-flag"><LangFlagIcon code={lang.code} size={20} /></span>
                <div class="lang-option-text">
                  <span class="lang-option-native">{lang.native}</span>
                  <span class="lang-option-label">{lang.label}</span>
                </div>
                {isActive && (
                  <svg class="lang-option-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export { LanguageSwitcher, LangFlagIcon, LANG_FLAGS };
