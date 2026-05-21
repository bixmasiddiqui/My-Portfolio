'use client'
import { useScroll, useSpring, motion } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[100] origin-left"
      style={{
        scaleX,
        height: '2px',
        background: 'linear-gradient(90deg, #7c3aed, #a78bfa 30%, #06b6d4 70%, #22d3ee)',
        boxShadow: '0 0 8px rgba(139,92,246,0.5)',
        transformOrigin: 'left',
      }}
    />
  )
}
