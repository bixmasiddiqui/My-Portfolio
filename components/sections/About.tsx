'use client'
import { motion } from 'framer-motion'
import SectionWrapper from '@/components/ui/SectionWrapper'
import GlassCard from '@/components/ui/GlassCard'

const facts = [
  { icon: '💻', label: 'Full Stack & AI Dev', sub: 'React · Next.js · Python' },
  { icon: '🌍', label: 'Pakistan', sub: 'Open to remote' },
  { icon: '🚀', label: 'AI Engineer', sub: 'RAG · LLMs · Automation' },
  { icon: '📱', label: '@girlintechhub', sub: 'Tech community builder' },
]

const values = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'Crafted with purpose',
    body: 'Every line of code serves a reason. I obsess over architecture, performance, and maintainability equally.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
      </svg>
    ),
    title: 'Design-first thinking',
    body: 'I bridge the gap between designers and engineers — fluent in Figma, fluent in TypeScript.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
      </svg>
    ),
    title: 'Ship with confidence',
    body: 'From CI/CD pipelines to comprehensive test suites — I treat reliability as a feature.',
  },
]

export default function About() {
  return (
    <SectionWrapper
      id="about"
      label="Who I am"
      title="Turning ideas into"
      subtitle=""
      className="bg-grid"
    >
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
        {/* Left — text */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-black leading-tight text-white mb-6"
          >
            Turning ideas into{' '}
            <span className="gradient-text">digital reality</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4 text-slate-400 leading-relaxed"
          >
            <p>
              Hey — I&apos;m Bisma. A full-stack developer and AI engineer passionate about
              building intelligent web applications that make a real difference. I work across
              the full stack — from React frontends to Python backends and LLM-powered pipelines.
            </p>
            <p>
              My sweet spot is the{' '}
              <span className="text-violet-400 font-medium">intersection of AI and product</span> — where
              cutting-edge ML meets thoughtful UX. I specialize in RAG systems, automation
              tools, and AI-powered interfaces that users actually love.
            </p>
            <p>
              Beyond code, I run{' '}
              <span className="text-cyan-400 font-medium">Girl in Tech Hub</span> — a community
              empowering women in technology, and I&apos;m always excited about the next frontier in AI.
            </p>
          </motion.div>

          {/* Quick facts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 grid grid-cols-2 gap-3"
          >
            {facts.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-3 glass rounded-xl px-4 py-3 border border-white/[0.06]"
              >
                <span className="text-xl">{f.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-slate-200">{f.label}</p>
                  <p className="text-xs text-slate-500">{f.sub}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — value cards */}
        <div className="flex flex-col gap-4">
          {values.map((v, i) => (
            <GlassCard key={i} delay={i * 0.1} glowColor={i % 2 === 0 ? 'violet' : 'cyan'}>
              <div className="flex gap-4 p-6">
                <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400 border border-violet-500/20">
                  {v.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 mb-1">{v.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{v.body}</p>
                </div>
              </div>
            </GlassCard>
          ))}

          {/* Decorative code snippet */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="glass rounded-2xl border border-white/[0.06] p-5 font-mono text-xs leading-relaxed text-slate-500"
          >
            <div className="flex gap-1.5 mb-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
            </div>
            <p><span className="text-violet-400">const</span> <span className="text-cyan-400">bisma</span> = {'{'}</p>
            <p className="pl-4"><span className="text-slate-400">role</span>: <span className="text-green-400">&apos;Full Stack &amp; AI Engineer&apos;</span>,</p>
            <p className="pl-4"><span className="text-slate-400">loves</span>: [<span className="text-green-400">&apos;React&apos;</span>, <span className="text-green-400">&apos;Next.js&apos;</span>, <span className="text-green-400">&apos;Python&apos;</span>],</p>
            <p className="pl-4"><span className="text-slate-400">available</span>: <span className="text-violet-400">true</span>,</p>
            <p>{'}'}</p>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  )
}
