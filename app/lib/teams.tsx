import { t } from "./i18n";

export const ALL_TEAMS = [
  "Mexico","South Africa","South Korea","Czechia","Canada","Bosnia and Herzegovina","Qatar","Switzerland",
  "Brazil","Morocco","Haiti","Scotland","USA","Paraguay","Australia","Türkiye",
  "Germany","Curaçao","Ivory Coast","Ecuador","Netherlands","Japan","Sweden","Tunisia",
  "Belgium","Egypt","Iran","New Zealand","Spain","Cape Verde","Saudi Arabia","Uruguay",
  "France","Senegal","Iraq","Norway","Argentina","Algeria","Austria","Jordan",
  "Portugal","DR Congo","Uzbekistan","Colombia","England","Croatia","Ghana","Panama",
];

export const TEAM_FLAGS: Record<string, string> = {
  "Mexico": "mx", "South Africa": "za", "South Korea": "kr", "Czechia": "cz",
  "Canada": "ca", "Bosnia and Herzegovina": "ba", "Qatar": "qa", "Switzerland": "ch",
  "Brazil": "br", "Morocco": "ma", "Haiti": "ht", "Scotland": "gb-sct",
  "USA": "us", "Paraguay": "py", "Australia": "au", "Türkiye": "tr",
  "Germany": "de", "Curaçao": "cw", "Ivory Coast": "ci", "Ecuador": "ec",
  "Netherlands": "nl", "Japan": "jp", "Sweden": "se", "Tunisia": "tn",
  "Belgium": "be", "Egypt": "eg", "Iran": "ir", "New Zealand": "nz",
  "Spain": "es", "Cape Verde": "cv", "Saudi Arabia": "sa", "Uruguay": "uy",
  "France": "fr", "Senegal": "sn", "Iraq": "iq", "Norway": "no",
  "Argentina": "ar", "Algeria": "dz", "Austria": "at", "Jordan": "jo",
  "Portugal": "pt", "DR Congo": "cd", "Uzbekistan": "uz", "Colombia": "co",
  "England": "gb-eng", "Croatia": "hr", "Ghana": "gh", "Panama": "pa",
};

export const POPULAR_PLAYERS = [
  "Lionel Messi","Cristiano Ronaldo","Kylian Mbappé","Erling Haaland",
  "Vinicius Jr","Jude Bellingham","Harry Kane","Mohamed Salah",
  "Kevin De Bruyne","Lamine Yamal","Pedri","Jamal Musiala",
  "Florian Wirtz","Bukayo Saka","Phil Foden","Rodri",
  "Antoine Griezmann","Son Heung-min","Lautaro Martínez","Federico Valverde",
];

// Player -> nationality mapping (ISO country code) for avatar backgrounds
export const PLAYER_NATIONALITY: Record<string, string> = {
  "Lionel Messi": "ar", "Cristiano Ronaldo": "pt", "Kylian Mbappé": "fr",
  "Erling Haaland": "no", "Vinicius Jr": "br", "Jude Bellingham": "gb-eng",
  "Harry Kane": "gb-eng", "Mohamed Salah": "eg", "Kevin De Bruyne": "be",
  "Lamine Yamal": "es", "Pedri": "es", "Jamal Musiala": "de",
  "Florian Wirtz": "de", "Bukayo Saka": "gb-eng", "Phil Foden": "gb-eng",
  "Rodri": "es", "Antoine Griezmann": "fr", "Son Heung-min": "kr",
  "Lautaro Martínez": "ar", "Federico Valverde": "uy",
};

/** DiceBear initials avatar – free, stable, no API key needed */
export function playerAvatarUrl(name: string, size: number = 80): string {
  const seed = encodeURIComponent(name);
  // Use DiceBear initials style – looks clean and modern
  return `https://api.dicebear.com/9.x/initials/svg?seed=${seed}&size=${size}&radius=50&backgroundColor=1e3a5f,1a5276,2c3e50,8e44ad,2471a3,1abc9c,27ae60,d35400,c0392b`;
}

/** Chat user avatar – also using DiceBear for consistency */
export function userAvatarUrl(username: string, size: number = 40): string {
  const seed = encodeURIComponent(username);
  return `https://api.dicebear.com/9.x/initials/svg?seed=${seed}&size=${size}&radius=50&backgroundColor=2ecc71,3498db,9b59b6,e67e22,e74c3c,1abc9c,f39c12`;
}

export function PlayerAvatar({ name, size, className }: { name: string; size?: number; className?: string }) {
  const url = playerAvatarUrl(name, size);
  const w = size || 40;
  return <img src={url} width={w} height={w} alt={name} class={`rounded-full ${className || ""}`} loading="lazy" />;
}

export function UserAvatar({ username, size, className }: { username: string; size?: number; className?: string }) {
  const url = userAvatarUrl(username, size);
  const w = size || 32;
  return <img src={url} width={w} height={w} alt={username} class={`rounded-full ${className || ""}`} loading="lazy" />;
}

export function flagUrl(name: string): string | null {
  const code = TEAM_FLAGS[name];
  if (!code) return null;
  return `https://flagicons.lipis.dev/flags/4x3/${code}.svg`;
}

export function FlagIcon({ name, size, className }: { name: string; size?: number; className?: string }) {
  const url = flagUrl(name);
  if (!url) return <span class={className}>{name.charAt(0)}</span>;
  const w = size || 24;
  const h = Math.round(w * 0.75);
  return <img src={url} width={w} height={h} alt={name} class={`flag-icon ${className || ""}`} loading="lazy" />;
}

export function flagOf(name: string, size?: number) {
  return <FlagIcon name={name} size={size} />;
}

export function teamName(lang: string, name: string): string {
  return t(lang, `team.${name}`);
}
