'use client'
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import SectionWrapper from '@/components/ui/SectionWrapper'
import GlassCard from '@/components/ui/GlassCard'

// Generate a realistic-looking contribution heatmap
function generateContributions(weeks = 52, daysPerWeek = 7) {
  const data: number[][] = []
  for (let w = 0; w < weeks; w++) {
    const week: number[] = []
    for (let d = 0; d < daysPerWeek; d++) {
      // Simulate realistic patterns: fewer on weekends, occasional spikes
      const isWeekend = d === 0 || d === 6
      const base = isWeekend ? 0.2 : 0.55
      const rand = Math.random()
      if (rand < base * 0.3) week.push(0)
      else if (rand < base * 0.55) week.push(1)
      else if (rand < base * 0.78) week.push(2)
      else if (rand < base * 0.93) week.push(3)
      else week.push(4)
    }
    data.push(week)
  }
  return data
}

const stats = [
  { label: 'Total Commits', value: '2,847', icon: '📦', color: 'violet' },
  { label: 'Pull Requests', value: '431', icon: '🔀', color: 'cyan' },
  { label: 'Issues Opened', value: '189', icon: '🐛', color: 'violet' },
  { label: 'Repos Starred', value: '1.2K', icon: '⭐', color: 'cyan' },
]

const recentRepos = [
  { name: 'nexus-ui', lang: 'TypeScript', color: '#3178c6', stars: 3400, forks: 280, updated: '2h ago' },
  { name: 'flowdb', lang: 'TypeScript', color: '#3178c6', stars: 1820, forks: 145, updated: '1d ago' },
  { name: 'coderift', lang: 'JavaScript', color: '#f7df1e', stars: 1240, forks: 92, updated: '3d ago' },
  { name: 'vaultkit', lang: 'TypeScript', color: '#3178c6', stars: 644, forks: 48, updated: '1w ago' },
]

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function GitHub() {
  const contributions = useMemo(() => generateContributions(), [])

  return (
    <SectionWrapper
      id="github"
      label="Open Source"
      title="GitHub Activity"
      subtitle="2,847 contributions in the last year — open source is where I give back."
      className="bg-grid"
    >
      {/* Contribution graph */}
      <GlassCard hover={false} className="mb-8 overflow-hidden">
        <div className="p-6 lg:p-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-slate-300">Contribution Activity</p>
            <span className="font-mono text-xs text-slate-500">Last 12 months</span>
          </div>

          {/* Month labels */}
          <div className="flex gap-[3px] mb-1 overflow-x-auto">
            <div className="w-8 flex-shrink-0" />
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className="flex-1 min-w-[28px] text-center"
              >
                <span className="text-[10px] text-slate-600 font-mono">{months[i]}</span>
              </div>
            ))}
          </div>

          {/* Graph grid */}
          <div className="flex gap-[3px] overflow-x-auto pb-2">
            {/* Day labels */}
            <div className="flex flex-col gap-[3px] flex-shrink-0 w-8 pt-0.5">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <div key={i} className="h-[11px] flex items-center justify-center text-[9px] text-slate-600 font-mono">
                  {i % 2 === 1 ? d : ''}
                </div>
              ))}
            </div>

            {/* Contribution cells */}
            {contributions.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px] flex-shrink-0">
                {week.map((level, di) => (
                  <motion.div
                    key={di}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.2, delay: wi * 0.008 + di * 0.005 }}
                    whileHover={{ scale: 1.5, transition: { duration: 0.1 } }}
                    title={`Level ${level}`}
                    className={`h-[11px] w-[11px] rounded-[2px] cursor-pointer contrib-${level} transition-transform duration-100`}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-end gap-2">
            <span className="text-[10px] text-slate-600">Less</span>
            {[0, 1, 2, 3, 4].map((l) => (
              <div key={l} className={`h-[11px] w-[11px] rounded-[2px] contrib-${l}`} />
            ))}
            <span className="text-[10px] text-slate-600">More</span>
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Stats */}
        <div className="lg:col-span-1 grid grid-cols-2 gap-4 content-start">
          {stats.map((stat, i) => (
            <GlassCard key={i} delay={i * 0.07} glowColor={stat.color as 'violet' | 'cyan'}>
              <div className="p-5 text-center">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <p className={`text-2xl font-black ${stat.color === 'violet' ? 'text-violet-400' : 'text-cyan-400'}`}>
                  {stat.value}
                </p>
                <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Recent repos */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <p className="text-sm font-semibold text-slate-400 mb-1">Popular Repositories</p>
          {recentRepos.map((repo, i) => (
            <motion.a
              key={i}
              href="https://github.com/bixmasiddiqui"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ x: 4, transition: { duration: 0.15 } }}
              className="group glass rounded-xl border border-white/[0.07] p-4 hover:border-violet-500/30 transition-all duration-200 glow-border"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <svg className="w-4 h-4 flex-shrink-0 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                  </svg>
                  <span className="font-mono text-sm font-semibold text-slate-200 group-hover:text-violet-300 transition-colors truncate">
                    {repo.name}
                  </span>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <span className="h-2 w-2 rounded-full" style={{ background: repo.color }} />
                    {repo.lang}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-yellow-400">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {repo.stars.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-600">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
                    </svg>
                    {repo.forks}
                  </div>
                  <span className="text-xs text-slate-600 hidden sm:block">{repo.updated}</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
