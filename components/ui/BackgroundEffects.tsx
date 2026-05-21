'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion'

// ─── Animated grid (pure CSS — no JS loop) ────────────────────────────────────

function AnimatedGrid() {
  return (
    <div className="absolute inset-0" aria-hidden>
      <div className="animated-grid-bg absolute inset-0" />
    </div>
  )
}

function GradientBlobs() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute rounded-full"
        style={{
          width: 600, height: 600,
          left: '-15%', top: '-20%',
          background: '#7c3aed',
          filter: 'blur(100px)',
          opacity: 0.10,
          animation: 'blobDrift1 32s ease-in-out infinite',
          willChange: 'transform',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 500, height: 500,
          left: '65%', top: '35%',
          background: '#06b6d4',
          filter: 'blur(100px)',
          opacity: 0.08,
          animation: 'blobDrift2 36s ease-in-out infinite',
          willChange: 'transform',
        }}
      />
    </div>
  )
}

// ─── Mouse spotlight ──────────────────────────────────────────────────────────
// Uses Framer Motion values — zero React re-renders on mouse move.

function MouseSpotlight() {
  const rawX = useMotionValue(800)
  const rawY = useMotionValue(400)

  // Smooth spring lag makes the glow feel weighty
  const x = useSpring(rawX, { stiffness: 55, damping: 22, mass: 0.6 })
  const y = useSpring(rawY, { stiffness: 55, damping: 22, mass: 0.6 })

  // Inner tight glow + outer soft halo
  const background = useMotionTemplate`
    radial-gradient(220px circle at ${x}px ${y}px,
      rgba(139,92,246,0.12) 0%,
      rgba(6,182,212,0.06) 35%,
      transparent 65%
    ),
    radial-gradient(600px circle at ${x}px ${y}px,
      rgba(139,92,246,0.04) 0%,
      transparent 70%
    )
  `

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [rawX, rawY])

  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      style={{ background }}
      aria-hidden
    />
  )
}

// ─── Composed export ──────────────────────────────────────────────────────────

export default function BackgroundEffects() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <AnimatedGrid />
      <GradientBlobs />
      <MouseSpotlight />
    </div>
  )
}
