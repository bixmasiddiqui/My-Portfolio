'use client'
import { useEffect, useRef, useCallback, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useTypingEffect } from '@/hooks/useTypingEffect'

const ROLES = ['AI Engineer', 'Full Stack Developer', 'Automation Builder']

// ─── Particle Network Canvas ──────────────────────────────────────────────────
function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number

    interface P { x: number; y: number; vx: number; vy: number; r: number; hue: number }
    const pts: P[] = []
    const N = 25
    const LINK = 140 // max distance for a connection

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }

    const spawn = () => {
      pts.length = 0
      for (let i = 0; i < N; i++) {
        pts.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.38,
          vy: (Math.random() - 0.5) * 0.38,
          r:  Math.random() * 1.6 + 0.5,
          hue: Math.random() > 0.45 ? 263 : 189, // violet : cyan
        })
      }
    }

    let lastTime = 0
    const tick = (time: number) => {
      if (time - lastTime < 33) { raf = requestAnimationFrame(tick); return } // ~30fps
      lastTime = time
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // move (wrap-around)
      for (const p of pts) {
        p.x = (p.x + p.vx + canvas.width)  % canvas.width
        p.y = (p.y + p.vy + canvas.height) % canvas.height
      }

      // draw connections first (behind dots)
      for (let i = 0; i < pts.length - 1; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j]
          const dx = a.x - b.x, dy = a.y - b.y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d > LINK) continue
          const alpha = (1 - d / LINK) * 0.18
          const mid = Math.round((a.hue + b.hue) / 2)
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = `hsla(${mid},75%,68%,${alpha})`
          ctx.lineWidth = 0.7
          ctx.stroke()
        }
      }

      // draw glowing dots
      for (const p of pts) {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4)
        g.addColorStop(0,   `hsla(${p.hue},80%,72%,0.90)`)
        g.addColorStop(0.4, `hsla(${p.hue},80%,65%,0.35)`)
        g.addColorStop(1,   `hsla(${p.hue},80%,65%,0)`)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
      }

      raf = requestAnimationFrame(tick)
    }

    resize()
    spawn()
    requestAnimationFrame(tick)

    const onResize = () => { resize(); spawn() }
    window.addEventListener('resize', onResize, { passive: true })
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ opacity: 0.55 }}
    />
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export default function Hero() {
  // Mouse tracking
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const mx = useSpring(rawX, { stiffness: 55, damping: 22, mass: 0.4 })
  const my = useSpring(rawY, { stiffness: 55, damping: 22, mass: 0.4 })

  // Spotlight % state (for CSS radial-gradient)
  const [spot, setSpot]       = useState({ x: 50, y: 45 })
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Typing effect
  const { displayText } = useTypingEffect(ROLES, { typeSpeed: 72, deleteSpeed: 38 })

  // ── Parallax transforms per blob layer ─────────────────────
  const b1x = useTransform(mx, v => v * 0.065)
  const b1y = useTransform(my, v => v * 0.065)
  const b2x = useTransform(mx, v => v * -0.050)
  const b2y = useTransform(my, v => v * -0.050)
  const b3x = useTransform(mx, v => v * 0.030)
  const b3y = useTransform(my, v => v * -0.030)
  const b4x = useTransform(mx, v => v * -0.022)
  const b4y = useTransform(my, v => v *  0.045)
  // Subtle content drift
  const cx  = useTransform(mx, v => v * 0.008)
  const cy  = useTransform(my, v => v * 0.008)

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    rawX.set(e.clientX - r.left - r.width  / 2)
    rawY.set(e.clientY - r.top  - r.height / 2)
    setSpot({
      x: ((e.clientX - r.left) / r.width)  * 100,
      y: ((e.clientY - r.top)  / r.height) * 100,
    })
  }, [rawX, rawY])

  return (
    <section
      id="hero"
      onMouseMove={onMouseMove}
      className="relative flex min-h-screen items-center justify-center overflow-hidden select-none"
      style={{ background: 'linear-gradient(160deg, #030711 0%, #080d1a 45%, #060e1c 100%)' }}
    >

      {/* ══ 1. Aurora Blobs ══════════════════════════════════════════ */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {/* Violet — large, top-left */}
        <motion.div style={{ x: b1x, y: b1y }} className="absolute -top-64 -left-64">
          <motion.div
            animate={{ scale: [1, 1.14, 0.94, 1], opacity: [0.32, 0.48, 0.36, 0.32] }}
            transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
            className="h-[900px] w-[900px] rounded-full bg-violet-600 blur-[180px]"
          />
        </motion.div>

        {/* Cyan — top-right */}
        <motion.div style={{ x: b2x, y: b2y }} className="absolute -top-48 -right-64">
          <motion.div
            animate={{ scale: [1, 1.22, 0.88, 1], opacity: [0.20, 0.32, 0.24, 0.20] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 3.5 }}
            className="h-[750px] w-[750px] rounded-full bg-cyan-500 blur-[160px]"
          />
        </motion.div>

        {/* Indigo — bottom-center */}
        <motion.div style={{ x: b3x, y: b3y }} className="absolute -bottom-40 left-1/4">
          <motion.div
            animate={{ scale: [1, 0.86, 1.12, 1], opacity: [0.16, 0.26, 0.20, 0.16] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 7 }}
            className="h-[650px] w-[650px] rounded-full bg-indigo-500 blur-[140px]"
          />
        </motion.div>

        {/* Violet accent — mid-right */}
        <motion.div style={{ x: b4x, y: b4y }} className="absolute top-1/3 -right-32">
          <motion.div
            animate={{ scale: [1, 1.18, 0.90, 1], opacity: [0.10, 0.18, 0.13, 0.10] }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="h-[500px] w-[500px] rounded-full bg-violet-400 blur-[120px]"
          />
        </motion.div>
      </div>

      {/* ══ 2. Faint base grid (always visible) ═════════════════════ */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: [
            'linear-gradient(rgba(139,92,246,0.045) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(139,92,246,0.045) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '72px 72px',
        }}
      />

      {/* ══ 3. Spotlight-revealed bright grid (Linear.app technique) ═ */}
      {mounted && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: [
              'linear-gradient(rgba(167,139,250,0.30) 1px, transparent 1px)',
              'linear-gradient(90deg, rgba(167,139,250,0.30) 1px, transparent 1px)',
            ].join(', '),
            backgroundSize: '72px 72px',
            WebkitMaskImage: `radial-gradient(650px circle at ${spot.x}% ${spot.y}%, black 0%, transparent 80%)`,
                    maskImage: `radial-gradient(650px circle at ${spot.x}% ${spot.y}%, black 0%, transparent 80%)`,
          }}
        />
      )}

      {/* ══ 4. Cursor glow bloom ═════════════════════════════════════ */}
      {mounted && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(750px circle at ${spot.x}% ${spot.y}%, rgba(139,92,246,0.11) 0%, rgba(6,182,212,0.05) 40%, transparent 68%)`,
          }}
        />
      )}

      {/* ══ 5. Particle network ══════════════════════════════════════ */}
      <ParticleCanvas />

      {/* ══ 6. Film-grain noise texture ══════════════════════════════ */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.028]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      {/* ══ 7. Edge vignette ═════════════════════════════════════════ */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 88% 88% at 50% 50%, transparent 28%, rgba(3,7,17,0.80) 100%)',
        }}
      />

      {/* ══ 8. Hero Content ══════════════════════════════════════════ */}
      <motion.div
        style={{ x: cx, y: cy }}
        className="relative z-10 mx-auto max-w-5xl px-6 py-36 text-center lg:px-12"
      >

        {/* — Availability badge — */}
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.94 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 inline-flex items-center gap-2.5 rounded-full border border-violet-500/[0.22] px-5 py-2 backdrop-blur-md"
          style={{ background: 'rgba(139,92,246,0.07)' }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-70" />
            <span className="relative flex h-2 w-2 rounded-full bg-violet-400" />
          </span>
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-violet-300">
            Open to new projects
          </span>
        </motion.div>

        {/* — Greeting — */}
        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.13, ease: 'easeOut' }}
          className="mb-2 text-xl font-medium tracking-wide text-slate-400 md:text-2xl"
        >
          Hi, I&apos;m
        </motion.p>

        {/* — Name — blur-reveal entrance — */}
        <motion.h1
          initial={{ opacity: 0, y: 44, filter: 'blur(14px)' }}
          animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
          transition={{ duration: 1.05, delay: 0.20, ease: [0.22, 1, 0.36, 1] }}
          className="font-black tracking-tighter leading-none"
          style={{ fontSize: 'clamp(4.5rem, 14vw, 9.5rem)' }}
        >
          <span
            className="gradient-text inline-block"
            style={{ textShadow: '0 0 80px rgba(139,92,246,0.40), 0 0 160px rgba(139,92,246,0.18)' }}
          >
            Bisma
          </span>
        </motion.h1>

        {/* — Sub-headline — */}
        <motion.p
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.38 }}
          className="mt-7 text-xl font-medium text-slate-300 md:text-2xl lg:text-[1.65rem]"
        >
          Full Stack Developer building{' '}
          <span
            className="font-bold"
            style={{
              background: 'linear-gradient(90deg, #a78bfa 20%, #22d3ee 80%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            AI-powered products
          </span>
        </motion.p>

        {/* — Typing roles — */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.52 }}
          className="mt-6 flex items-center justify-center gap-3"
        >
          <span className="font-mono text-lg text-cyan-500">&gt;</span>
          <div className="flex items-center font-mono text-lg min-w-[20ch] text-left">
            <span className="text-slate-300">{displayText}</span>
            <span
              className="ml-[2px] inline-block w-[2px] rounded-full bg-cyan-400 align-middle animate-blink-cursor"
              style={{ height: '1.1em' }}
            />
          </div>
        </motion.div>

        {/* — Divider — */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.62, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-10 h-px w-40"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.6) 40%, rgba(6,182,212,0.6) 60%, transparent)' }}
        />

        {/* — CTA Buttons — */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.68 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >

          {/* Primary — Explore Projects */}
          <motion.a
            href="#projects"
            whileHover={{ scale: 1.04, y: -3 }}
            whileTap={{ scale: 0.97 }}
            className="group relative inline-flex cursor-pointer items-center gap-2.5 overflow-hidden rounded-2xl px-9 py-4 text-sm font-bold text-white"
            style={{
              background: 'linear-gradient(135deg, #6d28d9 0%, #2563eb 55%, #0891b2 100%)',
              backgroundSize: '200% 200%',
              animation: 'gradientShift 5s ease infinite',
              boxShadow: '0 0 28px rgba(109,40,217,0.55), 0 0 70px rgba(109,40,217,0.20), inset 0 1px 0 rgba(255,255,255,0.12)',
            }}
          >
            {/* Shimmer sweep */}
            <span
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full"
              aria-hidden
            />
            <svg
              className="relative z-10 h-4 w-4"
              fill="currentColor" viewBox="0 0 24 24"
            >
              <path d="M13.13 22.19L11.5 18.36C13.07 17.78 14.54 17 15.9 16.09L13.13 22.19M5.64 12.5L1.81 10.87L7.91 8.1C7 9.46 6.22 10.93 5.64 12.5M19.22 4C19.5 4 19.75 4 19.96 4.05C20.13 5.44 19.94 8.3 16.66 11.58C14.96 13.29 12.93 14.6 10.72 15.47L8.53 13.28C9.4 11.07 10.71 9.04 12.42 7.34C15.18 4.58 17.64 4 19.22 4M19.22 2C17.24 2 14.24 2.69 11 5.93C8.81 8.12 7.5 10.53 6.65 12.64C6.37 13.39 6.56 14.21 7.11 14.77L9.24 16.89C9.79 17.45 10.61 17.63 11.36 17.35C13.5 16.53 15.88 15.19 18.07 13C23.73 7.34 21.61 2.39 21.61 2.39C21.61 2.39 20.7 2 19.22 2M14.54 9.46C13.76 8.68 13.76 7.41 14.54 6.63S16.59 5.85 17.37 6.63C18.14 7.41 18.15 8.68 17.37 9.46C16.59 10.24 15.32 10.24 14.54 9.46Z" />
            </svg>
            <span className="relative z-10 tracking-wide">Explore Projects</span>
          </motion.a>

          {/* Secondary — Chat With My AI */}
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.04, y: -3 }}
            whileTap={{ scale: 0.97 }}
            className="group relative inline-flex cursor-pointer items-center gap-2.5 overflow-hidden rounded-2xl border px-9 py-4 text-sm font-bold text-slate-200 backdrop-blur-md transition-all duration-300"
            style={{
              background: 'rgba(139,92,246,0.08)',
              borderColor: 'rgba(139,92,246,0.32)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(139,92,246,0.60)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(139,92,246,0.32)')}
          >
            {/* Shimmer sweep */}
            <span
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-violet-500/12 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full"
              aria-hidden
            />
            {/* AI sparkle icon */}
            <svg
              className="relative z-10 h-4 w-4 text-violet-400"
              viewBox="0 0 24 24" fill="currentColor"
            >
              <path d="M12 1.5l2.09 6.44L20.5 10l-6.41 2.06L12 18.5l-2.09-6.44L3.5 10l6.41-2.06L12 1.5z" />
              <path d="M19 15l1.09 2.91L23 19l-2.91 1.09L19 23l-1.09-2.91L15 19l2.91-1.09L19 15z" opacity=".6" />
              <path d="M5 3l.73 1.94L7.67 5.67l-1.94.73L5 8.33l-.73-1.93L2.34 5.67l1.93-.73L5 3z" opacity=".5" />
            </svg>
            <span className="relative z-10 tracking-wide">Chat With My AI</span>
          </motion.a>
        </motion.div>

        {/* — Stats row — */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.88 }}
          className="mt-20 flex justify-center"
        >
          <div
            className="flex w-full max-w-2xl flex-wrap divide-x divide-white/[0.07] overflow-hidden rounded-2xl border border-white/[0.07]"
            style={{ background: 'rgba(255,255,255,0.022)', backdropFilter: 'blur(12px)' }}
          >
            {[
              { value: '5+',  label: 'Years Experience'   },
              { value: '40+', label: 'Projects Shipped'   },
              { value: '10+', label: 'AI Products Built'  },
              { value: '99%', label: 'Client Satisfaction'},
            ].map((s, i) => (
              <div
                key={i}
                className="flex flex-1 flex-col items-center px-4 py-5 min-w-[100px]"
              >
                <span className="gradient-text text-2xl font-black md:text-3xl">{s.value}</span>
                <span className="mt-1 text-[11px] tracking-wide text-slate-600 text-center">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* ══ 9. Scroll indicator ══════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7, duration: 0.9 }}
        className="pointer-events-none absolute bottom-9 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-700">
          Scroll
        </span>
        <motion.div
          animate={{ scaleY: [1, 0.4, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="h-9 w-px rounded-full"
          style={{ background: 'linear-gradient(to bottom, rgba(139,92,246,0.7), transparent)' }}
        />
      </motion.div>
    </section>
  )
}
