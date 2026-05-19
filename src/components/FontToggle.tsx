'use client'
import { useState, useEffect } from 'react'

function MobileLink() {
  const [url, setUrl] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const port = window.location.port || '3000'
    setUrl(`http://192.168.178.172:${port}`)
  }, [])

  function copy() {
    if (!url) return
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  if (!url) return null
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 border-t border-white/10 bg-white/5">
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="flex-1 text-[10px] text-white/60 hover:text-white/90 underline underline-offset-2 truncate transition-colors"
      >
        {url}
      </a>
      <button
        onClick={copy}
        className="text-[9px] uppercase tracking-wide px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 transition-colors flex-shrink-0"
      >
        {copied ? 'Gekopieerd' : 'Kopieer'}
      </button>
    </div>
  )
}

type FontKey = 'poleno' | 'oslla' | 'oswald' | 'serif' | 'sans'
type StrokeKey = '0' | '0.3' | '0.6' | '1'

const FONTS: Record<FontKey, string> = {
  poleno: "'poleno', 'El Messiri', Georgia, serif",
  oslla:  "'oslla', Georgia, serif",
  oswald: "'Oswald', sans-serif",
  serif:  "'El Messiri', Georgia, serif",
  sans:   "'athletics', 'DM Sans', system-ui, sans-serif",
}

const WEIGHTS: Record<FontKey, string> = {
  poleno: '300',
  oslla:  'normal',
  oswald: '500',
  serif:  '400',
  sans:   '400',
}

const LABELS: Record<FontKey, string> = {
  poleno: 'Poleno',
  oslla:  'Oslla',
  oswald: 'Oswald',
  serif:  'El Messiri',
  sans:   'Athletics',
}

type Row = {
  label: string
  note?: string
  value: FontKey
  set: (f: FontKey) => void
  fonts: FontKey[]
}

export function FontToggle() {
  const [open, setOpen]       = useState(false)
  const [h1, setH1]           = useState<FontKey>('poleno')
  const [h234, setH234]       = useState<FontKey>('oslla')
  const [eyebrow, setEyebrow] = useState<FontKey>('oswald')
  const [body, setBody]       = useState<FontKey>('sans')
  const [ui, setUi]           = useState<FontKey>('oslla')
  const [stroke, setStroke]   = useState<StrokeKey>('0.3')

  useEffect(() => {
    const r = document.documentElement
    r.style.setProperty('--font-display', FONTS[h1])
    r.style.setProperty('--h-font',       FONTS[h234])
    r.style.setProperty('--h-weight',     WEIGHTS[h234])
    r.style.setProperty('--h-stroke',     h234 === 'oslla' ? `${stroke}px` : '0px')
    r.style.setProperty('--font-oswald',  FONTS[eyebrow])
    r.style.setProperty('--font-sans',    FONTS[body])
    r.style.setProperty('--ft-ui',        FONTS[ui])
  }, [h1, h234, eyebrow, body, ui, stroke])

  const rows: Row[] = [
    {
      label: 'H1',
      value: h1,
      set: setH1,
      fonts: ['poleno', 'oslla', 'oswald', 'serif', 'sans'],
    },
    {
      label: 'H2 / H3 / H4',
      value: h234,
      set: setH234,
      fonts: ['oslla', 'poleno', 'oswald', 'serif', 'sans'],
    },
    {
      label: 'Eyebrow',
      note: 'label boven heading',
      value: eyebrow,
      set: setEyebrow,
      fonts: ['oswald', 'oslla', 'poleno', 'sans'],
    },
    {
      label: 'Body tekst',
      value: body,
      set: setBody,
      fonts: ['sans', 'oslla', 'serif', 'oswald'],
    },
    {
      label: 'Buttons & pills',
      note: 'CTA links, datums, badges',
      value: ui,
      set: setUi,
      fonts: ['sans', 'oswald', 'oslla', 'poleno', 'serif'],
    },
  ]

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[9999] w-10 h-10 bg-forest/90 backdrop-blur-sm text-white rounded-full shadow-xl flex items-center justify-center hover:bg-forest transition-colors text-sm font-bold tracking-tight"
        title="Font tool openen"
      >
        Aa
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] w-[440px] bg-forest/95 backdrop-blur-md text-white rounded-2xl shadow-2xl overflow-hidden">

      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <span className="text-[10px] uppercase tracking-[0.15em] font-semibold opacity-50">Font tool</span>
        <button
          onClick={() => setOpen(false)}
          className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="px-4 py-3 flex flex-col gap-2.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-start gap-3">
            <div className="w-32 flex-shrink-0 pt-1">
              <div className="text-[10px] font-semibold uppercase tracking-[0.1em]">{row.label}</div>
              {row.note && <div className="text-[9px] opacity-35 mt-0.5">{row.note}</div>}
            </div>
            <div className="flex gap-1 flex-wrap">
              {row.fonts.map((f) => (
                <button
                  key={f}
                  onClick={() => row.set(f)}
                  style={{ fontFamily: FONTS[f], fontWeight: WEIGHTS[f] }}
                  className={`px-2.5 py-1 rounded-full text-[10px] transition-all ${
                    row.value === f
                      ? 'bg-accent text-white'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {LABELS[f]}
                </button>
              ))}
            </div>
          </div>
        ))}

        {h234 === 'oslla' && (
          <div className="flex items-center gap-3 pt-2 mt-0.5 border-t border-white/10">
            <div className="w-32 flex-shrink-0">
              <div className="text-[10px] font-semibold uppercase tracking-[0.1em]">Stroke</div>
              <div className="text-[9px] opacity-35 mt-0.5">dikte H2/H3/H4</div>
            </div>
            <div className="flex gap-1">
              {(['0', '0.3', '0.6', '1'] as StrokeKey[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setStroke(s)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all ${
                    stroke === s
                      ? 'bg-accent text-white'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {s === '0' ? 'Geen' : `${s}px`}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <MobileLink />
    </div>
  )
}
