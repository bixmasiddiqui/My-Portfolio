'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import SectionWrapper from '@/components/ui/SectionWrapper'

type Milestone = {
  year: string
  title: string
  description: string
  color: 'violet' | 'cyan' | 'emerald' | 'fuchsia'
}

const milestones: Milestone[] = [
  {
    year: '2018',
    title: 'Started Web Development',
    description:
      'Fell in love with building for the web — HTML, CSS, and vanilla JS turned into React and Node.js. Shipped my first production site for a local business within the first year.',
    color: 'violet',
  },
  {
    year: '2020',
    title: 'Went Full-Stack',
    description:
      'Expanded into backend systems, databases, and DevOps. Built and deployed REST APIs, worked with PostgreSQL and Redis, and set up CI/CD pipelines for automated deployments.',
    color: 'cyan',
  },
  {
    year: '2022',
    title: 'Built AI Chatbot Systems',
    description:
      'Integrated large language models into production products. Designed context-aware chatbots with retrieval-augmented generation (RAG), persistent memory, and streaming responses.',
    color: 'fuchsia',
  },
  {
    year: '2023',
    title: 'Created Autonomous AI Agent Workflows',
    description:
      'Engineered multi-agent systems capable of reasoning, tool use, and long-horizon task execution. Shipped agentic pipelines that reduced manual workflows by over 70% for clients.',
    color: 'emerald',
  },
  {
    year: '2024',
    title: 'Open Source & Community',
    description:
      'Released several open-source developer tools and AI utilities, collectively earning 3K+ GitHub stars. Started writing about AI architecture and modern full-stack patterns.',
    color: 'cyan',
  },
  {
    year: '2025',
    title: 'Building What\'s Next',
    description:
      'Focused on the intersection of AI and product — building tools that make developers and teams dramatically more capable. Exploring new paradigms in human-AI collaboration.',
    color: 'violet',
  },
]

const colorMap = {
  violet: {
    dot: 'bg-violet-500 border-violet-400',
    glow: 'shadow-[0_0_20px_4px_rgba(139,92,246,0.55)]',
    ring: 'ring-violet-500/30',
    year: 'text-violet-400',
    badge: 'bg-violet-500/10 border-violet-500/30 text-violet-300',
    bar: 'from-violet-600 to-violet-400',
    cardBorder: 'border-violet-500/20 hover:border-violet-500/50',
    connector: 'bg-violet-500/40',
    pulse: 'bg-violet-400',
  },
  cyan: {
    dot: 'bg-cyan-500 border-cyan-400',
    glow: 'shadow-[0_0_20px_4px_rgba(6,182,212,0.55)]',
    ring: 'ring-cyan-500/30',
    year: 'text-cyan-400',
    badge: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
    bar: 'from-cyan-600 to-cyan-400',
    cardBorder: 'border-cyan-500/20 hover:border-cyan-500/50',
    connector: 'bg-cyan-500/40',
    pulse: 'bg-cyan-400',
  },
  emerald: {
    dot: 'bg-emerald-500 border-emerald-400',
    glow: 'shadow-[0_0_20px_4px_rgba(16,185,129,0.55)]',
    ring: 'ring-emerald-500/30',
    year: 'text-emerald-400',
    badge: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    bar: 'from-emerald-600 to-emerald-400',
    cardBorder: 'border-emerald-500/20 hover:border-emerald-500/50',
    connector: 'bg-emerald-500/40',
    pulse: 'bg-emerald-400',
  },
  fuchsia: {
    dot: 'bg-fuchsia-500 border-fuchsia-400',
    glow: 'shadow-[0_0_20px_4px_rgba(217,70,239,0.55)]',
    ring: 'ring-fuchsia-500/30',
    year: 'text-fuchsia-400',
    badge: 'bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-300',
    bar: 'from-fuchsia-600 to-fuchsia-400',
    cardBorder: 'border-fuchsia-500/20 hover:border-fuchsia-500/50',
    connector: 'bg-fuchsia-500/40',
    pulse: 'bg-fuchsia-400',
  },
}

function TimelineNode({ milestone, index }: { milestone: Milestone; index: number }) {
  const c = colorMap[milestone.color]
  const isRight = index % 2 === 0

  return (
    <div className="relative flex items-start gap-0 md:gap-0">
      {/* ── Desktop: left column ── */}
      <div className={`hidden md:flex w-[calc(50%-28px)] ${isRight ? 'justify-end pr-10' : 'justify-start pl-10 order-last'}`}>
        <motion.div
          initial={{ opacity: 0, x: isRight ? 30 : -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="pt-1 text-right"
          style={isRight ? {} : { textAlign: 'left' }}
        >
          <span className={`font-mono text-4xl font-extrabold tracking-tighter ${c.year} opacity-90`}>
            {milestone.year}
          </span>
        </motion.div>
      </div>

      {/* ── Center dot ── */}
      <div className="relative z-10 flex-shrink-0 flex items-start justify-center" style={{ width: 56 }}>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ type: 'spring', stiffness: 260, damping: 18, delay: index * 0.05 }}
          className={`relative mt-6 h-5 w-5 rounded-full border-2 ${c.dot} ${c.glow} ring-4 ${c.ring}`}
        >
          {/* Pulse ring */}
          <motion.span
            className={`absolute inset-0 rounded-full ${c.pulse} opacity-40`}
            animate={{ scale: [1, 1.9, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 }}
          />
        </motion.div>
      </div>

      {/* ── Card column ── */}
      <div className={`flex-1 md:w-[calc(50%-28px)] pb-12 ${isRight ? 'md:pl-10' : 'md:pr-10 md:order-first'}`}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          {/* Mobile year label */}
          <p className={`md:hidden font-mono text-xs font-semibold mb-2 ${c.year}`}>{milestone.year}</p>

          <div
            className={`relative overflow-hidden rounded-2xl border glass transition-all duration-300 ${c.cardBorder}`}
          >
            {/* Top color bar */}
            <div className={`h-[3px] w-full bg-gradient-to-r ${c.bar}`} />

            <div className="p-6">
              {/* Year badge */}
              <span className={`hidden md:inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold mb-3 ${c.badge}`}>
                {milestone.year}
              </span>

              <h3 className="text-lg font-bold text-slate-100 leading-snug mb-2">
                {milestone.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">{milestone.description}</p>
            </div>

            {/* Subtle inner glow on hover */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 85%', 'end 20%'],
  })

  const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 22, restDelta: 0.001 })
  const lineOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1])

  return (
    <SectionWrapper
      id="timeline"
      label="Journey"
      title="My Timeline"
      subtitle="Key milestones that shaped who I am as an engineer and builder."
      className="bg-grid-dense"
    >
      <div ref={containerRef} className="relative mx-auto max-w-4xl">

        {/* ── Background track line ── */}
        <div className="absolute left-7 md:left-1/2 top-8 bottom-8 w-px -translate-x-px bg-white/[0.06]" />

        {/* ── Animated fill line ── */}
        <motion.div
          style={{ scaleY, opacity: lineOpacity, transformOrigin: 'top' }}
          className="absolute left-7 md:left-1/2 top-8 bottom-8 w-px -translate-x-px bg-gradient-to-b from-violet-500 via-fuchsia-500 via-cyan-400 to-emerald-400"
          aria-hidden
        />

        {/* ── Glow overlay on the line ── */}
        <motion.div
          style={{ scaleY, opacity: lineOpacity, transformOrigin: 'top' }}
          className="absolute left-7 md:left-1/2 top-8 bottom-8 -translate-x-px pointer-events-none"
          aria-hidden
        >
          <div className="h-full w-[3px] -translate-x-[1px] bg-gradient-to-b from-violet-500 via-fuchsia-400 via-cyan-400 to-emerald-400 blur-[6px] opacity-70" />
        </motion.div>

        {/* ── Nodes ── */}
        <div className="pl-14 md:pl-0">
          {milestones.map((m, i) => (
            <TimelineNode key={i} milestone={m} index={i} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
