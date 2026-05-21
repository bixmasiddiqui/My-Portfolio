'use client'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface GlowButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'outline'
  href?: string
  onClick?: () => void
  className?: string
}

export default function GlowButton({
  children,
  variant = 'primary',
  href,
  onClick,
  className,
}: GlowButtonProps) {
  const base =
    'relative inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 overflow-hidden'

  const variants = {
    primary:
      'btn-gradient text-white shadow-glow-violet hover:shadow-glow-cyan',
    outline:
      'glass border border-violet-500/40 text-slate-200 hover:border-cyan-400/60 hover:text-white hover:bg-white/5',
  }

  const content = (
    <motion.span
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={clsx(base, variants[variant], className)}
    >
      {variant === 'primary' && (
        <span className="absolute inset-0 bg-gradient-to-r from-violet-600/0 via-white/10 to-cyan-500/0 opacity-0 hover:opacity-100 transition-opacity duration-500" />
      )}
      {children}
    </motion.span>
  )

  if (href) {
    return (
      <a href={href} className="inline-block">
        {content}
      </a>
    )
  }

  return (
    <button onClick={onClick} className="inline-block">
      {content}
    </button>
  )
}
