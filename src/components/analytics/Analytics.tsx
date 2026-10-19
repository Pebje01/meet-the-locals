import { CookieBanner, CookieSettingsButton } from './CookieBanner'

/**
 * GA4 voor meetthelocals.nl, op dezelfde datastream als de oude WordPress
 * site, zodat de historie in property 327100281 doorloopt.
 *
 * Alleen actief in een productiebuild waarin NEXT_PUBLIC_GA_ID is meegegeven
 * (Dockerfile, build arg). Lokaal en in `pnpm dev` staat er dus niets.
 *
 * Basisvariant van Google Consent Mode: alles staat standaard op geweigerd en
 * gtag.js wordt pas geladen als de bezoeker in de cookiebanner ja zegt. Tot
 * die tijd gaat er niets naar Google, ook geen cookieloze pings. De keuze
 * staat in localStorage onder `mtl-cookiekeuze` ("ja" of "nee").
 */
export const CONSENT_KEY = 'mtl-cookiekeuze'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID
const ENABLED = process.env.NODE_ENV === 'production' && !!GA_ID && /^G-[A-Z0-9]+$/.test(GA_ID)

function bootScript(id: string): string {
  // Draait voor alles uit in de <head>. Zet de standaard op geweigerd en zet
  // mtlStartAnalytics klaar, dat de banner aanroept na een ja. Wie eerder al
  // ja zei, start meteen. De hostnaamcheck houdt kopieën en previews stil.
  return `
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'});
window.mtlStartAnalytics=function(){
  if(window.mtlAnalyticsStarted||!/(^|\\.)meetthelocals\\.nl$/.test(location.hostname))return;
  window.mtlAnalyticsStarted=true;
  gtag('consent','update',{analytics_storage:'granted'});
  gtag('js',new Date());
  gtag('config','${id}');
  var s=document.createElement('script');
  s.async=true;
  s.src='https://www.googletagmanager.com/gtag/js?id=${id}';
  document.head.appendChild(s);
};
try{if(localStorage.getItem('${CONSENT_KEY}')==='ja')window.mtlStartAnalytics();}catch(e){}
`.trim()
}

/** In de <head>: de consentstandaard en de starter. */
export function AnalyticsHead() {
  if (!ENABLED) return null
  return <script id="ga4-consent" dangerouslySetInnerHTML={{ __html: bootScript(GA_ID!) }} />
}

/** In de <body>: de cookiebanner, alleen als er ook gemeten wordt. */
export function AnalyticsConsent() {
  if (!ENABLED) return null
  return <CookieBanner storageKey={CONSENT_KEY} />
}

/** Link in de voet om de keuze te wijzigen. Zonder meting geen link. */
export function AnalyticsSettingsLink({ className }: { className?: string }) {
  if (!ENABLED) return null
  return <CookieSettingsButton className={className} />
}
