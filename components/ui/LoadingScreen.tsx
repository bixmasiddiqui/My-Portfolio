'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NAME = ['B', 'I', 'S', 'M', 'A']

const letterVariants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, delay: 0.55 + i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
}

const taglineVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 1.3, ease: 'easeOut' },
  },
}

export default function LoadingScreen() {
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Show only once per browser session
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('pf-loaded')) return
    setVisible(true)

    // Animate progress bar 0 → 100 over ~1.4s
    const start = performance.now()
    const duration = 1400
    let raf: number

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      setProgress(Math.round((1 - Math.pow(1 - t, 2)) * 100))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    // Dismiss
    const timer = setTimeout(() => {
      setVisible(false)
      sessionStorage.setItem('pf-loaded', '1')
    }, 2600)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading"
          className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-[#080d1a] select-none"
          exit={{ opacity: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } }}
        >
          {/* Background glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[100px]" />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Logo mark */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex h-20 w-20 items-center justify-center rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.2))',
                border: '1px solid rgba(139,92,246,0.4)',
                boxShadow: '0 0 40px rgba(139,92,246,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              {/* Rotating ring */}
              <motion.div
                className="absolute inset-[-3px] rounded-[18px]"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 60%, rgba(139,92,246,0.8), transparent)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
              {/* Inner icon — code brackets */}
              <svg className="relative z-10 h-9 w-9" viewBox="0 0 24 24" fill="none" stroke="url(#loader-grad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <defs>
                  <linearGradient id="loader-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </motion.div>

            {/* Name */}
            <div className="flex gap-[3px]">
              {NAME.map((letter, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterVariants}
                  initial="hidden"
                  animate="show"
                  className="text-4xl font-black tracking-[0.18em]"
                  style={{
                    background: 'linear-gradient(135deg, #e2d9f3 0%, #a78bfa 40%, #22d3ee 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            {/* Tagline */}
            <motion.p
              variants={taglineVariants}
              initial="hidden"
              animate="show"
              className="font-mono text-xs tracking-[0.25em] text-slate-500 uppercase"
            >
              Full Stack · AI Engineer
            </motion.p>

            {/* Progress bar */}
            <div className="w-40 overflow-hidden rounded-full bg-white/[0.06]" style={{ height: 2 }}>
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
                  boxShadow: '0 0 8px rgba(139,92,246,0.6)',
                  transition: 'width 0.08s linear',
                }}
              />
            </div>

            {/* Percentage */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="font-mono text-[11px] text-slate-600 tabular-nums"
            >
              {progress}%
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
