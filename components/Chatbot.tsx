'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = 'user' | 'assistant' | 'nav-card'

type ExploreSection = {
  id: string
  label: string
  emoji: string
  accent: string
  accentMuted: string
  description: string
  tags: string[]
  prompt: string
  followUps: string[]
}

type Message = {
  id: string
  role: Role
  content: string
  isStreaming?: boolean
  navSection?: ExploreSection
}

// ─── Explore sections config ──────────────────────────────────────────────────

const EXPLORE_SECTIONS: ExploreSection[] = [
  {
    id: 'projects',
    label: 'AI Projects',
    emoji: '🤖',
    accent: '#8b5cf6',
    accentMuted: 'rgba(139,92,246,0.15)',
    description: '6 production AI systems',
    tags: ['RAG', 'Agents', 'Vision'],
    prompt: 'Guide me through the most impressive AI projects Bisma has built. Be enthusiastic, lead with the most impressive metric, and make me want to see them.',
    followUps: ['skills', 'experience', 'timeline'],
  },
  {
    id: 'skills',
    label: 'Skills',
    emoji: '⚡',
    accent: '#06b6d4',
    accentMuted: 'rgba(6,182,212,0.15)',
    description: '20+ technologies, 4 domains',
    tags: ['React', 'Python', 'OpenAI'],
    prompt: 'Walk me through the standout skills and technologies Bisma has mastered. Highlight what makes her technically distinctive.',
    followUps: ['projects', 'experience', 'timeline'],
  },
  {
    id: 'experience',
    label: 'Experience',
    emoji: '💼',
    accent: '#ec4899',
    accentMuted: 'rgba(236,72,153,0.15)',
    description: 'Vercel · Linear · Stripe · Airbnb',
    tags: ['Senior SWE', '5+ years', 'Big Tech'],
    prompt: 'Tell me about Bisma\'s work experience at top tech companies. What did she build and what impact did she have?',
    followUps: ['projects', 'skills', 'timeline'],
  },
  {
    id: 'timeline',
    label: 'Journey',
    emoji: '🚀',
    accent: '#34d399',
    accentMuted: 'rgba(52,211,153,0.15)',
    description: '2018 → 2025',
    tags: ['Open Source', 'AI', 'Full Stack'],
    prompt: 'Walk me through Bisma\'s journey from her first line of code to building autonomous AI systems. Make it feel like a story.',
    followUps: ['projects', 'skills', 'experience'],
  },
]

const SECTION_MAP = Object.fromEntries(EXPLORE_SECTIONS.map(s => [s.id, s]))

// ─── Welcome messages ─────────────────────────────────────────────────────────

const REGULAR_WELCOME: Message = {
  id: 'welcome',
  role: 'assistant',
  content: "Hi! I'm Bisma's AI assistant 👋 Ask me anything about her projects, skills, or experience.",
}

const EXPLORE_WELCOME: Message = {
  id: 'explore-welcome',
  role: 'assistant',
  content: "Hi! I'm Bisma's AI guide ✨ I'll walk you through her portfolio — just pick what interests you most and I'll take it from there.",
}

const REGULAR_SUGGESTIONS = [
  "What projects has Bisma built?",
  "What technologies does she use?",
  "Tell me about her AI work",
  "Where has she worked?",
]

// ─── AI Avatar ────────────────────────────────────────────────────────────────

function AIAvatar({ size = 28, explore = false }: { size?: number; explore?: boolean }) {
  return (
    <div
      className="flex-shrink-0 flex items-center justify-center rounded-full font-bold text-white"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: explore
          ? 'linear-gradient(135deg, #7c3aed, #ec4899, #06b6d4)'
          : 'linear-gradient(135deg, #7c3aed, #06b6d4)',
        boxShadow: explore
          ? '0 0 16px rgba(236,72,153,0.5)'
          : '0 0 14px rgba(139,92,246,0.5)',
      }}
    >
      {explore ? '✦' : 'AI'}
    </div>
  )
}

// ─── Typing dots ──────────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 0.18, 0.36].map((delay, i) => (
        <motion.span
          key={i}
          className="block h-2 w-2 rounded-full bg-violet-400"
          animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.7, repeat: Infinity, delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({ msg, explore }: { msg: Message; explore: boolean }) {
  const isUser = msg.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {!isUser && <AIAvatar size={26} explore={explore} />}

      <div
        className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'rounded-br-sm bg-gradient-to-br from-violet-600 to-violet-500 text-white shadow-[0_2px_12px_rgba(139,92,246,0.35)]'
            : 'rounded-bl-sm border border-white/[0.08] bg-white/[0.05] text-slate-200'
        }`}
      >
        {msg.content}
        {msg.isStreaming && (
          <motion.span
            className="ml-0.5 inline-block h-3.5 w-[2px] bg-violet-400 align-middle"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: 'steps(1)' }}
          />
        )}
      </div>

      {isUser && (
        <div
          className="flex-shrink-0 flex items-center justify-center rounded-full text-xs font-bold text-white"
          style={{
            width: 26, height: 26,
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          U
        </div>
      )}
    </motion.div>
  )
}

// ─── Section Nav Card ─────────────────────────────────────────────────────────

function NavCard({ section }: { section: ExploreSection }) {
  const handleNavigate = () => {
    const el = document.getElementById(section.id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="ml-8"
    >
      <div
        className="overflow-hidden rounded-2xl"
        style={{
          background: section.accentMuted,
          border: `1px solid ${section.accent}40`,
          boxShadow: `0 0 20px ${section.accent}18`,
        }}
      >
        {/* Top accent bar */}
        <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, ${section.accent}, transparent)` }} />

        <div className="p-4">
          {/* Header */}
          <div className="flex items-center gap-2.5 mb-2">
            <span className="text-xl">{section.emoji}</span>
            <div>
              <p className="text-sm font-semibold text-slate-100 leading-tight">{section.label}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{section.description}</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3.5">
            {section.tags.map(tag => (
              <span
                key={tag}
                className="rounded-md px-2 py-0.5 font-mono text-[10px]"
                style={{
                  background: `${section.accent}18`,
                  border: `1px solid ${section.accent}35`,
                  color: section.accent,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA button */}
          <motion.button
            onClick={handleNavigate}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition-all duration-200"
            style={{ background: `linear-gradient(135deg, ${section.accent}cc, ${section.accent}99)` }}
          >
            View {section.label}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Explore menu (initial section picker) ────────────────────────────────────

function ExploreMenu({ onSelect, disabled }: { onSelect: (s: ExploreSection) => void; disabled: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="space-y-2.5"
    >
      <p className="text-xs font-medium text-slate-500 pl-1">Where would you like to start?</p>
      <div className="grid grid-cols-2 gap-2">
        {EXPLORE_SECTIONS.map((section, i) => (
          <motion.button
            key={section.id}
            onClick={() => !disabled && onSelect(section)}
            disabled={disabled}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.06 }}
            whileHover={disabled ? {} : { scale: 1.03, y: -1 }}
            whileTap={disabled ? {} : { scale: 0.97 }}
            className="relative overflow-hidden rounded-xl p-3 text-left transition-all duration-200 disabled:opacity-40"
            style={{
              background: section.accentMuted,
              border: `1px solid ${section.accent}35`,
            }}
          >
            <span className="text-xl block mb-1.5">{section.emoji}</span>
            <span className="block text-sm font-semibold text-slate-100 leading-tight">{section.label}</span>
            <span className="block text-[10px] text-slate-500 mt-0.5">{section.description}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Follow-up chips (shown after NavCard) ────────────────────────────────────

function FollowUpChips({
  currentId,
  onSelect,
  disabled,
}: {
  currentId: string
  onSelect: (s: ExploreSection) => void
  disabled: boolean
}) {
  const current = SECTION_MAP[currentId]
  if (!current) return null
  const others = current.followUps.map(id => SECTION_MAP[id]).filter(Boolean).slice(0, 3)

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="ml-8 space-y-1.5"
    >
      <p className="text-[11px] text-slate-600">Explore next:</p>
      <div className="flex flex-wrap gap-1.5">
        {others.map(s => (
          <button
            key={s.id}
            onClick={() => !disabled && onSelect(s)}
            disabled={disabled}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 disabled:opacity-40"
            style={{
              background: s.accentMuted,
              border: `1px solid ${s.accent}35`,
              color: s.accent,
            }}
          >
            <span>{s.emoji}</span>
            {s.label}
          </button>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Explore mode toggle button ───────────────────────────────────────────────

function ExploreToggle({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={active ? 'Switch to free chat' : 'Enable Explore Mode'}
      aria-label={active ? 'Disable explore mode' : 'Enable explore mode'}
      className="relative flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-all duration-200"
      style={
        active
          ? {
              background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(236,72,153,0.2))',
              border: '1px solid rgba(139,92,246,0.45)',
              color: '#c084fc',
            }
          : {
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#64748b',
            }
      }
    >
      {active && (
        <motion.span
          className="absolute inset-0 rounded-lg"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(236,72,153,0.08))' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      )}
      <span className="relative z-10 text-base leading-none">{active ? '✦' : '✧'}</span>
      <span className="relative z-10">{active ? 'Explore' : 'Explore'}</span>
    </motion.button>
  )
}

// ─── Main Chatbot component ───────────────────────────────────────────────────

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [exploreMode, setExploreMode] = useState(false)
  const [messages, setMessages] = useState<Message[]>([REGULAR_WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasNewMessage, setHasNewMessage] = useState(false)

  // Track which explore section was last requested, so we inject a NavCard after streaming
  const pendingNavRef = useRef<ExploreSection | null>(null)
  // Track which sections have been visited in explore mode
  const [lastExploredId, setLastExploredId] = useState<string | null>(null)

  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Focus input on open
  useEffect(() => {
    if (open) {
      setHasNewMessage(false)
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [open])

  // ── Toggle explore mode ──────────────────────────────────────────────────────
  const toggleExplore = useCallback(() => {
    abortRef.current?.abort()
    setLoading(false)
    setInput('')
    pendingNavRef.current = null
    setLastExploredId(null)

    setExploreMode(prev => {
      const next = !prev
      setMessages([next ? EXPLORE_WELCOME : REGULAR_WELCOME])
      return next
    })
  }, [])

  // ── Core send function ────────────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (text: string, navSection?: ExploreSection) => {
      const trimmed = text.trim()
      if (!trimmed || loading) return

      setInput('')
      pendingNavRef.current = navSection ?? null
      if (navSection) setLastExploredId(navSection.id)

      const userMsg: Message = { id: `user-${Date.now()}`, role: 'user', content: trimmed }
      const aiMsgId = `ai-${Date.now()}`
      const aiMsg: Message = { id: aiMsgId, role: 'assistant', content: '', isStreaming: true }

      setMessages(prev => [...prev, userMsg, aiMsg])
      setLoading(true)

      const contextMessages = [...messages, userMsg]
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .filter(m => m.id !== 'welcome' && m.id !== 'explore-welcome')
        .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))

      abortRef.current = new AbortController()

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: contextMessages, exploreMode }),
          signal: abortRef.current.signal,
        })

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: 'Request failed' }))
          throw new Error(err.error || `HTTP ${res.status}`)
        }

        const reader = res.body!.getReader()
        const decoder = new TextDecoder()
        let accumulated = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          accumulated += decoder.decode(value, { stream: true })
          setMessages(prev =>
            prev.map(m => m.id === aiMsgId ? { ...m, content: accumulated, isStreaming: true } : m)
          )
        }

        // Mark complete
        setMessages(prev =>
          prev.map(m => m.id === aiMsgId ? { ...m, isStreaming: false } : m)
        )

        // In explore mode: inject NavCard after AI finishes
        if (pendingNavRef.current) {
          const sec = pendingNavRef.current
          pendingNavRef.current = null
          setMessages(prev => [
            ...prev,
            { id: `nav-${Date.now()}`, role: 'nav-card', content: '', navSection: sec },
          ])
        }

        if (!open) setHasNewMessage(true)
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return
        const errorText = err instanceof Error ? err.message : 'Something went wrong'
        setMessages(prev =>
          prev.map(m =>
            m.id === aiMsgId
              ? { ...m, content: `Sorry, something went wrong: ${errorText}`, isStreaming: false }
              : m
          )
        )
      } finally {
        setLoading(false)
      }
    },
    [loading, messages, open, exploreMode]
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const handleExploreSection = useCallback(
    (section: ExploreSection) => sendMessage(section.prompt, section),
    [sendMessage]
  )

  // What to show below messages
  const showRegularSuggestions = !exploreMode && messages.length === 1 && !loading
  const showExploreMenu = exploreMode && messages.length === 1 && !loading
  const showFollowUps = exploreMode && lastExploredId && !loading &&
    messages[messages.length - 1]?.role === 'nav-card'

  const isExploreStreaming = exploreMode && loading

  return (
    <>
      {/* ── Chat window ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chatwindow"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-4 z-50 flex flex-col overflow-hidden rounded-2xl sm:right-6 sm:bottom-28"
            style={{
              width: 'min(390px, calc(100vw - 32px))',
              height: 'min(580px, calc(100vh - 140px))',
              background: 'rgba(8,13,26,0.96)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              border: exploreMode
                ? '1px solid rgba(139,92,246,0.35)'
                : '1px solid rgba(139,92,246,0.2)',
              boxShadow: exploreMode
                ? '0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(236,72,153,0.08), 0 0 60px rgba(124,58,237,0.12)'
                : '0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.1), 0 0 40px rgba(139,92,246,0.08)',
              transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
            }}
          >
            {/* ── Header ── */}
            <div
              className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
              style={{
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                background: exploreMode
                  ? 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(236,72,153,0.05))'
                  : 'rgba(255,255,255,0.02)',
                transition: 'background 0.4s ease',
              }}
            >
              <AIAvatar size={34} explore={exploreMode} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-100 leading-tight">
                    {exploreMode ? 'Bisma\'s AI Guide' : 'Bisma\'s AI Assistant'}
                  </p>
                  <AnimatePresence>
                    {exploreMode && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                        style={{
                          background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(236,72,153,0.25))',
                          border: '1px solid rgba(139,92,246,0.4)',
                          color: '#c084fc',
                        }}
                      >
                        Explore
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <motion.span
                    className="block h-1.5 w-1.5 rounded-full"
                    style={{ background: isExploreStreaming ? '#f472b6' : '#4ade80' }}
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-[11px] text-slate-500">
                    {isExploreStreaming ? 'Crafting your tour…' : exploreMode ? 'Tour guide active' : 'Online · GPT-4o mini'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <ExploreToggle active={exploreMode} onClick={toggleExplore} />
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-white/10 hover:text-slate-300"
                  aria-label="Close chat"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* ── Explore mode banner ── */}
            <AnimatePresence>
              {exploreMode && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 overflow-hidden"
                >
                  <div
                    className="px-4 py-2 text-[11px] text-center font-medium"
                    style={{
                      background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(236,72,153,0.08))',
                      borderBottom: '1px solid rgba(139,92,246,0.12)',
                      color: '#a78bfa',
                    }}
                  >
                    ✦ Explore Mode — I'll guide you through Bisma's portfolio
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Messages ── */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map(msg =>
                msg.role === 'nav-card' && msg.navSection ? (
                  <NavCard key={msg.id} section={msg.navSection} />
                ) : (
                  <MessageBubble key={msg.id} msg={msg} explore={exploreMode} />
                )
              )}

              {/* Typing indicator */}
              {loading && messages[messages.length - 1]?.role !== 'assistant' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-end gap-2"
                >
                  <AIAvatar size={26} explore={exploreMode} />
                  <div className="rounded-2xl rounded-bl-sm border border-white/[0.08]" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <TypingDots />
                  </div>
                </motion.div>
              )}

              {/* Explore section picker */}
              {showExploreMenu && (
                <ExploreMenu onSelect={handleExploreSection} disabled={loading} />
              )}

              {/* Regular suggestions */}
              {showRegularSuggestions && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-2">
                  <p className="text-xs text-slate-600 font-medium pl-1">Try asking:</p>
                  <div className="flex flex-wrap gap-2">
                    {REGULAR_SUGGESTIONS.map(q => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        className="rounded-full border border-violet-500/25 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-300 transition-all duration-200 hover:border-violet-500/50 hover:bg-violet-500/20 hover:text-violet-200"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Follow-up chips after NavCard */}
              {showFollowUps && lastExploredId && (
                <FollowUpChips
                  currentId={lastExploredId}
                  onSelect={handleExploreSection}
                  disabled={loading}
                />
              )}

              <div ref={bottomRef} />
            </div>

            {/* ── Input ── */}
            <div className="flex-shrink-0 px-3 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div
                className="flex items-end gap-2 rounded-xl px-3 py-2"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={exploreMode ? 'Ask anything, or pick a section above…' : "Ask me anything about Bisma's work…"}
                  disabled={loading}
                  rows={1}
                  className="flex-1 resize-none bg-transparent text-sm text-slate-200 placeholder-slate-600 outline-none disabled:opacity-50"
                  style={{ maxHeight: 96, lineHeight: '1.5' }}
                  onInput={e => {
                    const t = e.currentTarget
                    t.style.height = 'auto'
                    t.style.height = Math.min(t.scrollHeight, 96) + 'px'
                  }}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || loading}
                  className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 disabled:opacity-30"
                  style={{
                    background: input.trim() && !loading
                      ? exploreMode
                        ? 'linear-gradient(135deg, #7c3aed, #ec4899)'
                        : 'linear-gradient(135deg, #7c3aed, #06b6d4)'
                      : 'rgba(255,255,255,0.08)',
                  }}
                  aria-label="Send"
                >
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>
              </div>
              <p className="mt-1.5 text-center text-[10px] text-slate-700">
                Enter to send · Shift+Enter for new line
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating button ─────────────────────────────────────────────────── */}
      <div className="fixed bottom-5 right-4 z-50 sm:right-6 sm:bottom-6">
        <motion.button
          onClick={() => setOpen(v => !v)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          className="relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-2xl"
          style={{
            background: exploreMode
              ? 'linear-gradient(135deg, #7c3aed, #ec4899, #06b6d4)'
              : 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            boxShadow: exploreMode
              ? '0 4px 24px rgba(236,72,153,0.5), 0 0 0 1px rgba(139,92,246,0.3)'
              : '0 4px 24px rgba(139,92,246,0.5), 0 0 0 1px rgba(139,92,246,0.3)',
            transition: 'background 0.4s ease, box-shadow 0.4s ease',
          }}
          aria-label={open ? 'Close chat' : 'Open chat'}
        >
          {/* Pulse ring */}
          {!open && (
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{
                background: exploreMode
                  ? 'linear-gradient(135deg, #7c3aed, #ec4899)'
                  : 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              }}
              animate={{ scale: [1, 1.5, 1.5], opacity: [0.6, 0, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            />
          )}

          {/* Explore badge on button */}
          <AnimatePresence>
            {exploreMode && !open && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white shadow"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}
              >
                ✦
              </motion.span>
            )}
          </AnimatePresence>

          {/* New-message dot */}
          <AnimatePresence>
            {hasNewMessage && !open && !exploreMode && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow"
              >
                1
              </motion.span>
            )}
          </AnimatePresence>

          {/* Icon */}
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div key="close"
                initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.div>
            ) : (
              <motion.div key="chat"
                initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}
              >
                {exploreMode ? (
                  <span className="text-xl">✦</span>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                  </svg>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </>
  )
}
