'use client'
import { useRef, useState, useEffect, useCallback } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  useInView,
} from 'framer-motion'
import SectionWrapper from '@/components/ui/SectionWrapper'

// ─── Types ────────────────────────────────────────────────────────────────────
type Skill = { name: string; level: number }

type Category = {
  id: string
  title: string
  subtitle: string
  accentA: string
  accentB: string
  glowRgba: string
  borderRgba: string
  Icon: React.FC<{ id: string }>
  skills: Skill[]
  tags: string[]
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const FrontendIcon: React.FC<{ id: string }> = ({ id }) => (
  <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}>
    <defs>
      <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7c3aed" />
        <stop offset="100%" stopColor="#a78bfa" />
      </linearGradient>
    </defs>
    <polyline points="16 18 22 12 16 6" stroke={`url(#grad-${id})`} />
    <polyline points="8 6 2 12 8 18"  stroke={`url(#grad-${id})`} />
  </svg>
)

const BackendIcon: React.FC<{ id: string }> = ({ id }) => (
  <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}>
    <defs>
      <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0891b2" />
        <stop offset="100%" stopColor="#22d3ee" />
      </linearGradient>
    </defs>
    <ellipse cx="12" cy="5" rx="9" ry="3" stroke={`url(#grad-${id})`} />
    <path d="M3 5v14c0 1.657 4.03 3 9 3s9-1.343 9-3V5" stroke={`url(#grad-${id})`} />
    <path d="M3 12c0 1.657 4.03 3 9 3s9-1.343 9-3"      stroke={`url(#grad-${id})`} />
  </svg>
)

const AIIcon: React.FC<{ id: string }> = ({ id }) => (
  <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7c3aed" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
    </defs>
    {/* Main star */}
    <path
      d="M12 3 L13.9 9.1 L20.5 11 L13.9 12.9 L12 19 L10.1 12.9 L3.5 11 L10.1 9.1 Z"
      fill={`url(#grad-${id})`}
    />
    {/* Top-right mini */}
    <path
      d="M19.5 3.5 L20.1 5.4 L22 6 L20.1 6.6 L19.5 8.5 L18.9 6.6 L17 6 L18.9 5.4 Z"
      fill="#a78bfa" opacity="0.75"
    />
    {/* Bottom-left mini */}
    <path
      d="M4.5 16 L5 17.6 L6.6 18.1 L5 18.6 L4.5 20.2 L4 18.6 L2.4 18.1 L4 17.6 Z"
      fill="#ec4899" opacity="0.60"
    />
  </svg>
)

const ToolsIcon: React.FC<{ id: string }> = ({ id }) => (
  <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}>
    <defs>
      <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0d9488" />
        <stop offset="100%" stopColor="#34d399" />
      </linearGradient>
    </defs>
    {/* Terminal caret */}
    <polyline points="4 17 10 11 4 5" stroke={`url(#grad-${id})`} />
    {/* Cursor line */}
    <line x1="12" y1="19" x2="20" y2="19" stroke={`url(#grad-${id})`} />
  </svg>
)

// ─── Data ─────────────────────────────────────────────────────────────────────
const CATEGORIES: Category[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    subtitle: 'UI · UX · Animation',
    accentA: '#7c3aed',
    accentB: '#a78bfa',
    glowRgba: 'rgba(139,92,246,0.28)',
    borderRgba: 'rgba(139,92,246,0.18)',
    Icon: FrontendIcon,
    skills: [
      { name: 'React', level: 96 },
      { name: 'Next.js', level: 94 },
      { name: 'TypeScript', level: 92 },
      { name: 'Tailwind CSS', level: 91 },
      { name: 'Framer Motion', level: 86 },
    ],
    tags: ['React', 'Next.js', 'TypeScript', 'Tailwind', 'Framer'],
  },
  {
    id: 'backend',
    title: 'Backend',
    subtitle: 'APIs · Data · Systems',
    accentA: '#0891b2',
    accentB: '#22d3ee',
    glowRgba: 'rgba(6,182,212,0.28)',
    borderRgba: 'rgba(6,182,212,0.18)',
    Icon: BackendIcon,
    skills: [
      { name: 'Node.js', level: 93 },
      { name: 'Python', level: 88 },
      { name: 'PostgreSQL', level: 87 },
      { name: 'GraphQL', level: 82 },
      { name: 'Redis', level: 78 },
    ],
    tags: ['Node.js', 'Python', 'PostgreSQL', 'GraphQL', 'Redis'],
  },
  {
    id: 'ai',
    title: 'AI / ML',
    subtitle: 'LLMs · Agents · Automation',
    accentA: '#7c3aed',
    accentB: '#ec4899',
    glowRgba: 'rgba(168,85,247,0.28)',
    borderRgba: 'rgba(168,85,247,0.18)',
    Icon: AIIcon,
    skills: [
      { name: 'OpenAI APIs', level: 93 },
      { name: 'Gemini APIs', level: 88 },
      { name: 'LangChain', level: 84 },
      { name: 'Hugging Face', level: 77 },
      { name: 'TensorFlow', level: 71 },
    ],
    tags: ['OpenAI', 'Gemini', 'LangChain', 'HuggingFace', 'TF'],
  },
  {
    id: 'tools',
    title: 'Tools',
    subtitle: 'DevOps · Cloud · Design',
    accentA: '#0d9488',
    accentB: '#34d399',
    glowRgba: 'rgba(20,184,166,0.28)',
    borderRgba: 'rgba(20,184,166,0.18)',
    Icon: ToolsIcon,
    skills: [
      { name: 'Docker', level: 88 },
      { name: 'GitHub Actions', level: 87 },
      { name: 'AWS / Vercel', level: 84 },
      { name: 'Figma', level: 83 },
      { name: 'Bash / Shell', level: 85 },
    ],
    tags: ['Docker', 'GH Actions', 'AWS', 'Figma', 'Bash'],
  },
]

// ─── CountUp ─────────────────────────────────────────────────────────────────
function CountUp({ to, delay = 0 }: { to: number; delay?: number }) {
  const ref  = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    let raf: number
    const start  = performance.now() + delay * 1000
    const dur    = 1100

    const tick = (now: number) => {
      if (now < start) { raf = requestAnimationFrame(tick); return }
      const t = Math.min((now - start) / dur, 1)
      setVal(Math.round((1 - Math.pow(1 - t, 3)) * to))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, delay])

  return <span ref={ref}>{val}</span>
}

// ─── SkillBar ─────────────────────────────────────────────────────────────────
function SkillBar({
  skill,
  delay,
  accentA,
  accentB,
}: {
  skill: Skill
  delay: number
  accentA: string
  accentB: string
}) {
  return (
    <div className="group/bar">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-300 group-hover/bar:text-slate-100 transition-colors duration-200">
          {skill.name}
        </span>
        <span className="font-mono text-xs font-semibold" style={{ color: accentB }}>
          <CountUp to={skill.level} delay={delay} />%
        </span>
      </div>

      {/* Track */}
      <div
        className="relative h-[5px] w-full overflow-hidden rounded-full"
        style={{ background: 'rgba(255,255,255,0.06)' }}
      >
        {/* Fill */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.3, delay, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${accentA}, ${accentB})`,
            boxShadow: `0 0 12px 1px ${accentB}80`,
          }}
        />
      </div>
    </div>
  )
}

// ─── TiltCard ─────────────────────────────────────────────────────────────────
function TiltCard({ cat, index }: { cat: Category; index: number }) {
  const wrapRef   = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  // Tilt springs
  const rotX  = useMotionValue(0)
  const rotY  = useMotionValue(0)
  const sRotX = useSpring(rotX, { stiffness: 180, damping: 24, mass: 0.45 })
  const sRotY = useSpring(rotY, { stiffness: 180, damping: 24, mass: 0.45 })

  // Shine follows cursor via MotionTemplate (no re-render)
  const shX  = useMotionValue(50)
  const shY  = useMotionValue(50)
  const shine = useMotionTemplate`radial-gradient(260px circle at ${shX}% ${shY}%, rgba(255,255,255,0.07) 0%, transparent 65%)`

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = wrapRef.current
      if (!el) return
      const r  = el.getBoundingClientRect()
      const x  = e.clientX - r.left
      const y  = e.clientY - r.top
      const nx = (x / r.width  - 0.5) * 2
      const ny = (y / r.height - 0.5) * 2
      rotY.set(nx * 14)
      rotX.set(-ny * 10)
      shX.set((x / r.width)  * 100)
      shY.set((y / r.height) * 100)
    },
    [rotX, rotY, shX, shY],
  )

  const onLeave = useCallback(() => {
    rotX.set(0); rotY.set(0)
    shX.set(50); shY.set(50)
    setHovered(false)
  }, [rotX, rotY, shX, shY])

  const { Icon } = cat

  return (
    /* Entrance wrapper — also provides the CSS perspective for 3D */
    <motion.div
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.65, delay: index * 0.13, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: '1100px' }}
    >
      {/* Tilt layer */}
      <motion.div
        ref={wrapRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onMouseEnter={() => setHovered(true)}
        style={{
          rotateX: sRotX,
          rotateY: sRotY,
          transformStyle: 'preserve-3d',
        }}
        className="relative h-full"
      >
        {/* ── Outer glow ring (fades in on hover) ── */}
        <div
          className="pointer-events-none absolute -inset-[1px] rounded-[18px] transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, ${cat.accentA}50, transparent 50%, ${cat.accentB}40)`,
            opacity: hovered ? 1 : 0,
          }}
        />

        {/* ── Card body ── */}
        <div
          className="relative h-full overflow-hidden rounded-2xl p-6 flex flex-col"
          style={{
            background: 'rgba(8, 14, 28, 0.72)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: `1px solid ${hovered ? cat.accentA + '55' : cat.borderRgba}`,
            boxShadow: hovered
              ? `0 0 0 1px ${cat.accentA}25, 0 12px 50px ${cat.glowRgba}, 0 0 90px ${cat.glowRgba}50, inset 0 1px 0 rgba(255,255,255,0.09)`
              : `0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)`,
            transition: 'border-color 0.35s ease, box-shadow 0.45s ease',
          }}
        >
          {/* Moving shine overlay */}
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-2xl z-10"
            style={{ background: shine }}
          />

          {/* Top-edge gradient line */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 inset-x-10 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${cat.accentA}90, ${cat.accentB}90, transparent)`,
              opacity: hovered ? 1 : 0.35,
              transition: 'opacity 0.4s ease',
            }}
          />

          {/* ── Header ── */}
          <div className="relative z-20 flex items-start gap-4 mb-7">
            {/* Icon bubble */}
            <div
              className="flex-shrink-0 flex h-[52px] w-[52px] items-center justify-center rounded-2xl transition-all duration-400"
              style={{
                background: `linear-gradient(135deg, ${cat.accentA}22, ${cat.accentB}14)`,
                border: `1px solid ${cat.accentA}38`,
                boxShadow: hovered ? `0 0 22px ${cat.accentA}45, inset 0 1px 0 rgba(255,255,255,0.08)` : 'none',
                transition: 'box-shadow 0.35s ease',
              }}
            >
              <Icon id={cat.id} />
            </div>

            {/* Title + subtitle */}
            <div className="flex-1 min-w-0 pt-0.5">
              <h3
                className="text-xl font-extrabold leading-tight tracking-tight"
                style={{
                  background: `linear-gradient(130deg, #fff 0%, ${cat.accentB} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {cat.title}
              </h3>
              <p className="mt-0.5 font-mono text-[11px] tracking-widest text-slate-500 uppercase">
                {cat.subtitle}
              </p>
            </div>

            {/* Skills count badge */}
            <div
              className="flex-shrink-0 rounded-xl px-2.5 py-1 text-xs font-mono font-bold"
              style={{
                background: `${cat.accentA}18`,
                border: `1px solid ${cat.accentA}30`,
                color: cat.accentB,
              }}
            >
              {cat.skills.length}
            </div>
          </div>

          {/* ── Skill bars ── */}
          <div className="relative z-20 flex flex-col gap-[18px] flex-1">
            {cat.skills.map((skill, si) => (
              <SkillBar
                key={si}
                skill={skill}
                delay={index * 0.13 + si * 0.09}
                accentA={cat.accentA}
                accentB={cat.accentB}
              />
            ))}
          </div>

          {/* ── Footer tags ── */}
          <div
            className="relative z-20 mt-6 flex flex-wrap gap-2 pt-5"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
          >
            {cat.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg px-2.5 py-1 text-[11px] font-mono font-medium text-slate-500 transition-all duration-200 hover:text-slate-200 cursor-default"
                style={{
                  background: 'rgba(255,255,255,0.038)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function Skills() {
  return (
    <SectionWrapper
      id="skills"
      label="Expertise"
      title="Skills & Technologies"
      subtitle="A curated toolkit built through years of real-world shipping — from UI to AI."
      className="bg-grid"
    >
      {/* 2 × 2 card grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {CATEGORIES.map((cat, i) => (
          <TiltCard key={cat.id} cat={cat} index={i} />
        ))}
      </div>

      {/* Summary stats */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="mt-14 flex flex-wrap items-center justify-center gap-10"
      >
        {[
          { value: '20+', label: 'Technologies' },
          { value: '5+',  label: 'Years Experience' },
          { value: '40+', label: 'Projects Shipped' },
          { value: '4',   label: 'Core Domains' },
        ].map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span
              className="text-3xl font-black"
              style={{
                background: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {s.value}
            </span>
            <span className="text-xs font-medium tracking-wide text-slate-600">{s.label}</span>
          </div>
        ))}
      </motion.div>
    </SectionWrapper>
  )
}
