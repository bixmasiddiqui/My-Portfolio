'use client'
import { motion } from 'framer-motion'
import SectionWrapper from '@/components/ui/SectionWrapper'

type Job = {
  role: string
  company: string
  period: string
  location: string
  type: string
  description: string
  highlights: string[]
  tech: string[]
  color: 'violet' | 'cyan'
}

const jobs: Job[] = [
  {
    role: 'Senior Software Engineer',
    company: 'Vercel',
    period: 'Jan 2023 — Present',
    location: 'San Francisco, CA',
    type: 'Full-time',
    description:
      'Core contributor to the Next.js framework and the Vercel platform. Leading the Edge Middleware initiative and building developer tooling used by 800K+ teams.',
    highlights: [
      'Led design & implementation of Next.js App Router caching primitives',
      'Reduced cold-start latency by 62% through Edge Runtime optimisations',
      'Open-sourced 3 internal tools with 5K+ combined GitHub stars',
    ],
    tech: ['TypeScript', 'Rust', 'Next.js', 'Edge Runtime', 'Turborepo'],
    color: 'violet',
  },
  {
    role: 'Full Stack Engineer',
    company: 'Linear',
    period: 'Jun 2021 — Dec 2022',
    location: 'Remote',
    type: 'Full-time',
    description:
      'Built core product features for the project management platform. Focused on real-time sync, keyboard-driven UX, and performance at scale.',
    highlights: [
      'Implemented conflict-free real-time sync engine powering 10M+ daily ops',
      'Shipped keyboard shortcuts system that boosted power-user retention by 34%',
      'Migrated REST API to GraphQL, cutting over-fetching by 55%',
    ],
    tech: ['React', 'TypeScript', 'GraphQL', 'Node.js', 'PostgreSQL', 'Redis'],
    color: 'cyan',
  },
  {
    role: 'Frontend Engineer',
    company: 'Stripe',
    period: 'Aug 2019 — May 2021',
    location: 'San Francisco, CA',
    type: 'Full-time',
    description:
      'Member of the Dashboard team building financial tooling for millions of businesses. Owned the Radar (fraud detection) interface end-to-end.',
    highlights: [
      'Rebuilt Radar UI from scratch — cut page load from 4.2s to 0.8s',
      'Designed accessible data-table component adopted across 8 product teams',
      'Mentored 4 junior engineers through Stripe\'s engineering ladder program',
    ],
    tech: ['React', 'TypeScript', 'D3.js', 'Ruby on Rails', 'Jest'],
    color: 'violet',
  },
  {
    role: 'Software Engineering Intern',
    company: 'Airbnb',
    period: 'May 2018 — Aug 2018',
    location: 'San Francisco, CA',
    type: 'Internship',
    description:
      'Summer internship on the Experiences team. Built host onboarding flow improvements that shipped to production within the internship.',
    highlights: [
      'Increased host onboarding completion rate by 18% with UX improvements',
      'Contributed to React Native component library (react-native-maps)',
    ],
    tech: ['React', 'React Native', 'Ruby on Rails', 'Enzyme'],
    color: 'cyan',
  },
]

export default function Experience() {
  return (
    <SectionWrapper
      id="experience"
      label="Career"
      title="Work Experience"
      subtitle="A track record of building impactful products at companies that shaped the modern web."
      className="bg-grid"
    >
      <div className="relative mx-auto max-w-4xl">
        {/* Vertical timeline line */}
        <div className="absolute left-8 top-4 bottom-4 w-px timeline-line md:left-1/2 md:-translate-x-px hidden md:block" />

        <div className="flex flex-col gap-12">
          {jobs.map((job, i) => {
            const isLeft = i % 2 === 0
            return (
              <div key={i} className="relative flex flex-col md:flex-row gap-6">
                {/* Dot on timeline */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-6 z-10 items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 300, delay: i * 0.1 }}
                    className={`h-4 w-4 rounded-full border-2 ${
                      job.color === 'violet'
                        ? 'border-violet-400 bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.7)]'
                        : 'border-cyan-400 bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.7)]'
                    }`}
                  />
                </div>

                {/* Left spacer / date (desktop) */}
                <div className={`hidden md:flex md:w-1/2 ${isLeft ? 'md:pr-12 md:justify-end' : 'md:order-last md:pl-12 md:justify-start'}`}>
                  <motion.div
                    initial={{ opacity: 0, x: isLeft ? 20 : -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex flex-col items-end gap-1 text-right pt-5"
                    style={isLeft ? {} : { textAlign: 'left', alignItems: 'flex-start' }}
                  >
                    <span className={`font-mono text-xs font-semibold ${job.color === 'violet' ? 'text-violet-400' : 'text-cyan-400'}`}>
                      {job.period}
                    </span>
                    <span className="text-xs text-slate-500">{job.location}</span>
                    <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[10px] text-slate-500 font-mono">
                      {job.type}
                    </span>
                  </motion.div>
                </div>

                {/* Card */}
                <motion.div
                  initial={{ opacity: 0, x: isLeft ? -24 : 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 + 0.05 }}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className={`md:w-1/2 ${isLeft ? 'md:pl-12' : 'md:pr-12 md:order-first'}`}
                >
                  <div
                    className={`glass rounded-2xl border transition-all duration-300 glow-border overflow-hidden ${
                      job.color === 'violet'
                        ? 'border-violet-500/20 hover:border-violet-500/40'
                        : 'border-cyan-500/20 hover:border-cyan-500/40'
                    }`}
                  >
                    {/* Card top accent */}
                    <div className={`h-1 w-full ${job.color === 'violet' ? 'bg-gradient-to-r from-violet-600 to-violet-400' : 'bg-gradient-to-r from-cyan-600 to-cyan-400'}`} />

                    <div className="p-6">
                      {/* Mobile date */}
                      <p className={`md:hidden text-xs font-mono mb-2 ${job.color === 'violet' ? 'text-violet-400' : 'text-cyan-400'}`}>
                        {job.period}
                      </p>

                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <h3 className="font-bold text-slate-100 text-lg leading-tight">{job.role}</h3>
                          <p className="text-sm font-semibold text-slate-400">{job.company}</p>
                        </div>
                      </div>

                      <p className="text-sm text-slate-400 leading-relaxed mb-4">{job.description}</p>

                      <ul className="space-y-2 mb-4">
                        {job.highlights.map((h, hi) => (
                          <li key={hi} className="flex items-start gap-2 text-xs text-slate-400">
                            <span className={`mt-1.5 h-1 w-1 flex-shrink-0 rounded-full ${job.color === 'violet' ? 'bg-violet-400' : 'bg-cyan-400'}`} />
                            {h}
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap gap-1.5">
                        {job.tech.map((t) => (
                          <span
                            key={t}
                            className="rounded-md bg-white/5 border border-white/[0.06] px-2 py-0.5 text-[10px] font-mono text-slate-500"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>
    </SectionWrapper>
  )
}
