'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { clsx } from 'clsx'

interface SectionWrapperProps {
  id: string
  children: React.ReactNode
  className?: string
  label?: string
  title?: string
  subtitle?: string
}

// Word-split animated heading
function AnimatedHeading({ text, delay = 0 }: { text: string; delay?: number }) {
  const words = text.split(' ')
  const ref = useRef<HTMLHeadingElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <h2
      ref={ref}
      className="text-4xl font-bold tracking-tight text-white md:text-5xl"
      aria-label={text}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em] last:mr-0">
          <motion.span
            className="inline-block"
            initial={{ y: '110%', opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{
              duration: 0.6,
              delay: delay + i * 0.07,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </h2>
  )
}

export default function SectionWrapper({
  id,
  children,
  className,
  label,
  title,
  subtitle,
}: SectionWrapperProps) {
  return (
    <section id={id} className={clsx('relative py-24 lg:py-32', className)}>
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {(label || title || subtitle) && (
          <div className="mb-16 text-center">
            {/* Label — fade + slide */}
            {label && (
              <motion.p
                initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="mb-3 font-mono text-sm font-semibold tracking-[0.2em] uppercase"
                style={{ background: 'linear-gradient(90deg, #a78bfa, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
              >
                {label}
              </motion.p>
            )}

            {/* Title — word-by-word clip reveal */}
            {title && <AnimatedHeading text={title} delay={0.1} />}

            {/* Subtitle — fade in */}
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: 0.3, ease: 'easeOut' }}
                className="mt-4 max-w-2xl mx-auto text-base text-slate-400 leading-relaxed"
              >
                {subtitle}
              </motion.p>
            )}

            {/* Divider line — scale in from center */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 mx-auto h-px w-24 bg-gradient-to-r from-transparent via-violet-500 to-transparent"
              style={{ transformOrigin: 'center' }}
            />
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
