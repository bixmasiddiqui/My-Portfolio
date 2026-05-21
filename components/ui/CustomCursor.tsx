'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

type CursorState = 'default' | 'pointer' | 'text'

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, [data-cursor="pointer"]'

export default function CustomCursor() {
  const [state, setState] = useState<CursorState>('default')
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  const dotX = useMotionValue(-100)
  const dotY = useMotionValue(-100)

  // Ring follows with spring lag
  const ringX = useSpring(dotX, { stiffness: 140, damping: 18, mass: 0.6 })
  const ringY = useSpring(dotY, { stiffness: 140, damping: 18, mass: 0.6 })

  const isPointer = state === 'pointer'
  const isText = state === 'text'

  useEffect(() => {
    setMounted(true)

    // Only activate on fine-pointer devices (mouse, not touch)
    const isFine = window.matchMedia('(pointer: fine)').matches
    if (!isFine) return

    // Hide the native cursor globally
    document.documentElement.style.cursor = 'none'

    const onMove = (e: PointerEvent) => {
      dotX.set(e.clientX)
      dotY.set(e.clientY)
      if (!visible) setVisible(true)
    }

    const onEnter = () => setVisible(true)
    const onLeave = () => setVisible(false)

    const onOver = (e: PointerEvent) => {
      const target = e.target as Element
      if (target.closest(INTERACTIVE)) {
        setState('pointer')
      } else if (target.closest('p, h1, h2, h3, h4, h5, h6, span, li')) {
        setState('text')
      } else {
        setState('default')
      }
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    document.documentElement.addEventListener('pointerenter', onEnter)
    document.documentElement.addEventListener('pointerleave', onLeave)

    return () => {
      document.documentElement.style.cursor = ''
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      document.documentElement.removeEventListener('pointerenter', onEnter)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [dotX, dotY, visible])

  if (!mounted) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[500]" aria-hidden>
      {/* ── Dot: precise, no lag ── */}
      <motion.div
        className="fixed top-0 left-0"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: isPointer ? 0.5 : 1,
        }}
        transition={{ opacity: { duration: 0.2 }, scale: { type: 'spring', stiffness: 300, damping: 22 } }}
      >
        <div
          className="rounded-full transition-colors duration-200"
          style={{
            width: 8,
            height: 8,
            background: isPointer ? '#22d3ee' : '#a78bfa',
            boxShadow: isPointer
              ? '0 0 10px rgba(6,182,212,0.8)'
              : '0 0 10px rgba(167,139,250,0.8)',
          }}
        />
      </motion.div>

      {/* ── Ring: lagging spring ── */}
      <motion.div
        className="fixed top-0 left-0 rounded-full"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          border: '1.5px solid rgba(139,92,246,0.5)',
          width: 36,
          height: 36,
          boxShadow: isPointer
            ? '0 0 16px rgba(6,182,212,0.25), inset 0 0 8px rgba(6,182,212,0.06)'
            : '0 0 16px rgba(139,92,246,0.2)',
        }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: isPointer ? 1.35 : isText ? 0.12 : 1,
          borderColor: isPointer ? 'rgba(6,182,212,0.6)' : 'rgba(139,92,246,0.5)',
        }}
        transition={{
          opacity: { duration: 0.2 },
          scale: { type: 'spring', stiffness: 200, damping: 22 },
          borderColor: { duration: 0.25 },
        }}
      />
    </div>
  )
}
