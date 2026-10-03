import { useEffect, useState } from 'react'
import { msUntilMidnightIST } from '../lib/utils'

const pad = (n) => String(n).padStart(2, '0')

/** Live countdown to midnight IST (when the Deal of the Day resets). */
export default function Countdown({ light = true }) {
  const [ms, setMs] = useState(() => msUntilMidnightIST())
  useEffect(() => {
    const t = window.setInterval(() => setMs(msUntilMidnightIST()), 1000)
    return () => window.clearInterval(t)
  }, [])
  const total = Math.floor(ms / 1000)
  const parts = [
    ['Hrs', Math.floor(total / 3600)],
    ['Min', Math.floor((total % 3600) / 60)],
    ['Sec', total % 60],
  ]
  return (
    <div className="flex items-center gap-2" role="timer" aria-label={`Deal ends in ${parts[0][1]} hours ${parts[1][1]} minutes`}>
      {parts.map(([label, v], i) => (
        <div key={label} className="flex items-center gap-2">
          <div className={light ? 'min-w-[3.5rem] rounded-xl bg-white/10 px-2 py-2 text-center ring-1 ring-white/15' : 'min-w-[3.5rem] rounded-xl bg-white px-2 py-2 text-center shadow-soft'}>
            <span className={`block font-serif text-2xl font-semibold tabular-nums leading-none ${light ? 'text-gold-300' : 'text-navy'}`} aria-hidden="true">
              {pad(v)}
            </span>
            <span className={`mt-1 block text-[10px] font-bold uppercase tracking-widest ${light ? 'text-white/60' : 'text-ink-muted'}`} aria-hidden="true">
              {label}
            </span>
          </div>
          {i < 2 && <span className={`font-serif text-xl ${light ? 'text-gold-400' : 'text-navy'}`} aria-hidden="true">:</span>}
        </div>
      ))}
    </div>
  )
}
