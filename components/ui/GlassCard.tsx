'use client'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glowColor?: 'violet' | 'cyan' | 'none'
  delay?: number
}

export default function GlassCard({
  children,
  className,
  hover = true,
  glowColor = 'none',
  delay = 0,
}: GlassCardProps) {
  const glowMap = {
    violet: 'hover:shadow-glow-violet hover:border-violet-500/30',
    cyan: 'hover:shadow-glow-cyan hover:border-cyan-400/30',
    none: '',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
      className={clsx(
        'glass rounded-2xl transition-all duration-300',
        glowMap[glowColor],
        hover && 'glass-hover glow-border cursor-default',
        className,
      )}
    >
      {children}
    </motion.div>
  )
}
