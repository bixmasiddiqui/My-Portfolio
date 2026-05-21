'use client'
import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import SectionWrapper from '@/components/ui/SectionWrapper'

// ─── Types ────────────────────────────────────────────────────────────────────
type Status = 'live' | 'beta' | 'open-source'

type Project = {
  id: string
  title: string
  category: 'AI · ML' | 'Full Stack' | 'Tools'
  status: Status
  shortDesc: string
  fullDesc: string
  tech: string[]
  highlights: string[]
  github: string
  demo?: string
  accentA: string
  accentB: string
  Preview: React.FC
}

// ─── SVG Preview Illustrations ───────────────────────────────────────────────

const ChatBotPreview: React.FC = () => (
  <div className="h-full w-full relative overflow-hidden"
    style={{ background: 'linear-gradient(135deg, #1a0533 0%, #2d1058 55%, #0f1a3d 100%)' }}>
    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-32 w-48 bg-violet-500/20 rounded-full blur-2xl" />
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 200" fill="none">
      {/* Status bar */}
      <rect x="20" y="16" width="280" height="22" rx="6" fill="rgba(139,92,246,0.15)" stroke="rgba(139,92,246,0.3)" strokeWidth="0.5"/>
      <circle cx="32" cy="27" r="4" fill="#a78bfa"/>
      <rect x="42" y="23" width="52" height="5" rx="2" fill="rgba(167,139,250,0.5)"/>
      <circle cx="295" cy="27" r="3.5" fill="#4ade80"/>

      {/* Bot message 1 */}
      <circle cx="36" cy="58" r="9" fill="rgba(139,92,246,0.7)"/>
      <text x="33" y="62" fontSize="8" fill="white">AI</text>
      <rect x="52" y="50" width="130" height="22" rx="6" fill="rgba(139,92,246,0.25)" stroke="rgba(139,92,246,0.3)" strokeWidth="0.5"/>
      <rect x="60" y="57" width="55" height="4" rx="2" fill="rgba(167,139,250,0.6)"/>
      <rect x="60" y="63" width="95" height="4" rx="2" fill="rgba(167,139,250,0.35)"/>

      {/* User message */}
      <rect x="138" y="82" width="110" height="18" rx="6" fill="rgba(51,65,85,0.7)" stroke="rgba(100,116,139,0.3)" strokeWidth="0.5"/>
      <rect x="146" y="88" width="70" height="4" rx="2" fill="rgba(148,163,184,0.5)"/>
      <circle cx="262" cy="91" r="9" fill="rgba(51,65,85,0.8)"/>

      {/* Bot message 2 */}
      <circle cx="36" cy="116" r="9" fill="rgba(139,92,246,0.7)"/>
      <text x="33" y="120" fontSize="8" fill="white">AI</text>
      <rect x="52" y="107" width="160" height="26" rx="6" fill="rgba(139,92,246,0.25)" stroke="rgba(139,92,246,0.3)" strokeWidth="0.5"/>
      <rect x="60" y="113" width="80" height="4" rx="2" fill="rgba(167,139,250,0.6)"/>
      <rect x="60" y="119" width="125" height="4" rx="2" fill="rgba(167,139,250,0.35)"/>
      <rect x="60" y="125" width="60" height="4" rx="2" fill="rgba(167,139,250,0.2)"/>

      {/* Typing indicator */}
      <circle cx="36" cy="150" r="9" fill="rgba(139,92,246,0.7)"/>
      <rect x="52" y="143" width="50" height="18" rx="9" fill="rgba(139,92,246,0.2)" stroke="rgba(139,92,246,0.3)" strokeWidth="0.5"/>
      <circle cx="67" cy="152" r="2.5" fill="rgba(167,139,250,0.8)"/>
      <circle cx="77" cy="152" r="2.5" fill="rgba(167,139,250,0.6)"/>
      <circle cx="87" cy="152" r="2.5" fill="rgba(167,139,250,0.4)"/>

      {/* Input bar */}
      <rect x="20" y="172" width="280" height="20" rx="6" fill="rgba(15,23,42,0.8)" stroke="rgba(139,92,246,0.25)" strokeWidth="0.5"/>
      <rect x="30" y="178" width="90" height="5" rx="2" fill="rgba(100,116,139,0.3)"/>
      <rect x="282" y="175" width="14" height="14" rx="4" fill="rgba(139,92,246,0.7)"/>
    </svg>
  </div>
)

const AgentPreview: React.FC = () => (
  <div className="h-full w-full relative overflow-hidden"
    style={{ background: 'linear-gradient(135deg, #021a25 0%, #033345 55%, #041225 100%)' }}>
    <div className="absolute top-0 right-0 h-40 w-40 bg-cyan-500/15 rounded-full blur-3xl" />
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 200" fill="none">
      {/* Connection lines */}
      <line x1="160" y1="100" x2="80"  y2="50"  stroke="rgba(6,182,212,0.25)" strokeWidth="1" strokeDasharray="4 2"/>
      <line x1="160" y1="100" x2="240" y2="50"  stroke="rgba(6,182,212,0.25)" strokeWidth="1" strokeDasharray="4 2"/>
      <line x1="160" y1="100" x2="60"  y2="155" stroke="rgba(6,182,212,0.25)" strokeWidth="1" strokeDasharray="4 2"/>
      <line x1="160" y1="100" x2="260" y2="155" stroke="rgba(6,182,212,0.25)" strokeWidth="1" strokeDasharray="4 2"/>
      <line x1="160" y1="100" x2="160" y2="25"  stroke="rgba(34,211,238,0.35)" strokeWidth="1.5"/>
      {/* Central node */}
      <circle cx="160" cy="100" r="22" fill="rgba(6,182,212,0.12)" stroke="rgba(6,182,212,0.5)" strokeWidth="1.5"/>
      <circle cx="160" cy="100" r="14" fill="rgba(6,182,212,0.2)" stroke="rgba(34,211,238,0.6)" strokeWidth="1"/>
      <text x="153" y="104" fontSize="9" fill="rgba(34,211,238,0.9)" fontFamily="monospace">AGT</text>
      {/* Satellite nodes */}
      {[
        { cx: 80,  cy: 50,  label: 'NLP', color: '#a78bfa' },
        { cx: 240, cy: 50,  label: 'API', color: '#22d3ee' },
        { cx: 60,  cy: 155, label: 'DB',  color: '#4ade80' },
        { cx: 260, cy: 155, label: 'UI',  color: '#fb923c' },
        { cx: 160, cy: 25,  label: 'LLM', color: '#f472b6' },
      ].map(({ cx, cy, label, color }) => (
        <g key={label}>
          <circle cx={cx} cy={cy} r="16" fill="rgba(15,23,42,0.8)" stroke={color} strokeWidth="1" opacity="0.8"/>
          <circle cx={cx} cy={cy} r="16" fill={color} opacity="0.08"/>
          <text x={cx - (label.length * 2.8)} y={cy + 3.5} fontSize="7.5" fill={color} fontFamily="monospace" opacity="0.9">{label}</text>
        </g>
      ))}
      {/* Status indicators */}
      <rect x="20" y="12" width="90" height="14" rx="4" fill="rgba(6,182,212,0.1)" stroke="rgba(6,182,212,0.3)" strokeWidth="0.5"/>
      <circle cx="29" cy="19" r="3" fill="#4ade80"/>
      <rect x="36" y="16" width="48" height="4" rx="2" fill="rgba(148,163,184,0.4)"/>
      {/* Metrics */}
      <rect x="210" y="12" width="90" height="14" rx="4" fill="rgba(6,182,212,0.1)" stroke="rgba(6,182,212,0.3)" strokeWidth="0.5"/>
      <rect x="218" y="16" width="20" height="4" rx="2" fill="rgba(34,211,238,0.5)"/>
      <rect x="242" y="16" width="35" height="4" rx="2" fill="rgba(148,163,184,0.3)"/>
    </svg>
  </div>
)

const RAGPreview: React.FC = () => (
  <div className="h-full w-full relative overflow-hidden"
    style={{ background: 'linear-gradient(135deg, #1a0533 0%, #350d52 55%, #1f0d3a 100%)' }}>
    <div className="absolute bottom-0 left-0 h-32 w-48 bg-pink-500/15 rounded-full blur-2xl" />
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 200" fill="none">
      {/* Search bar */}
      <rect x="20" y="14" width="280" height="26" rx="8" fill="rgba(15,10,30,0.8)" stroke="rgba(168,85,247,0.5)" strokeWidth="1"/>
      <circle cx="37" cy="27" r="6" stroke="rgba(168,85,247,0.6)" strokeWidth="1.5" fill="none"/>
      <line x1="41" y1="32" x2="44" y2="35" stroke="rgba(168,85,247,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="52" y="23" width="90" height="5" rx="2" fill="rgba(168,85,247,0.3)"/>
      <rect x="270" y="19" width="24" height="16" rx="4" fill="rgba(168,85,247,0.5)"/>
      {/* Result card 1 - highlighted */}
      <rect x="20" y="50" width="280" height="48" rx="8" fill="rgba(168,85,247,0.08)" stroke="rgba(168,85,247,0.3)" strokeWidth="1"/>
      <rect x="20" y="50" width="4" height="48" rx="2" fill="rgba(168,85,247,0.7)"/>
      <rect x="32" y="58" width="120" height="5" rx="2" fill="rgba(216,180,254,0.7)"/>
      <rect x="32" y="66" width="240" height="4" rx="2" fill="rgba(148,163,184,0.3)"/>
      {/* Highlight span */}
      <rect x="88" y="66" width="48" height="4" rx="2" fill="rgba(236,72,153,0.5)"/>
      <rect x="32" y="73" width="200" height="4" rx="2" fill="rgba(148,163,184,0.25)"/>
      <rect x="32" y="80" width="60" height="4" rx="2" fill="rgba(168,85,247,0.3)"/>
      {/* Similarity score */}
      <rect x="265" y="58" width="28" height="12" rx="4" fill="rgba(74,222,128,0.15)" stroke="rgba(74,222,128,0.4)" strokeWidth="0.5"/>
      <text x="267" y="67" fontSize="6.5" fill="#4ade80" fontFamily="monospace">98%</text>
      {/* Result card 2 */}
      <rect x="20" y="106" width="280" height="40" rx="8" fill="rgba(15,10,30,0.5)" stroke="rgba(168,85,247,0.15)" strokeWidth="0.5"/>
      <rect x="32" y="114" width="100" height="5" rx="2" fill="rgba(148,163,184,0.5)"/>
      <rect x="32" y="122" width="220" height="4" rx="2" fill="rgba(148,163,184,0.2)"/>
      <rect x="32" y="129" width="155" height="4" rx="2" fill="rgba(148,163,184,0.15)"/>
      <rect x="265" y="114" width="28" height="12" rx="4" fill="rgba(251,146,60,0.15)" stroke="rgba(251,146,60,0.3)" strokeWidth="0.5"/>
      <text x="267" y="123" fontSize="6.5" fill="#fb923c" fontFamily="monospace">84%</text>
      {/* Source tags */}
      <rect x="20" y="154" width="50" height="14" rx="4" fill="rgba(168,85,247,0.15)" stroke="rgba(168,85,247,0.3)" strokeWidth="0.5"/>
      <rect x="78" y="154" width="58" height="14" rx="4" fill="rgba(168,85,247,0.1)" stroke="rgba(168,85,247,0.2)" strokeWidth="0.5"/>
      <rect x="144" y="154" width="44" height="14" rx="4" fill="rgba(168,85,247,0.1)" stroke="rgba(168,85,247,0.2)" strokeWidth="0.5"/>
      <rect x="27" y="158" width="36" height="5" rx="2" fill="rgba(216,180,254,0.5)"/>
      <rect x="86" y="158" width="42" height="5" rx="2" fill="rgba(216,180,254,0.35)"/>
      <rect x="151" y="158" width="30" height="5" rx="2" fill="rgba(216,180,254,0.35)"/>
      {/* Cite count */}
      <rect x="246" y="154" width="54" height="14" rx="4" fill="rgba(74,222,128,0.1)" stroke="rgba(74,222,128,0.25)" strokeWidth="0.5"/>
      <text x="252" y="163" fontSize="6.5" fill="#4ade80" fontFamily="monospace">3 sources</text>
    </svg>
  </div>
)

const EmailAIPreview: React.FC = () => (
  <div className="h-full w-full relative overflow-hidden"
    style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0f2044 55%, #071233 100%)' }}>
    <div className="absolute top-0 right-0 h-32 w-32 bg-blue-500/15 rounded-full blur-2xl" />
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 200" fill="none">
      {/* Sidebar */}
      <rect x="0" y="0" width="70" height="200" fill="rgba(15,32,68,0.8)"/>
      <rect x="8" y="16" width="54" height="14" rx="4" fill="rgba(96,165,250,0.2)" stroke="rgba(96,165,250,0.4)" strokeWidth="0.5"/>
      <rect x="14" y="21" width="30" height="4" rx="2" fill="rgba(96,165,250,0.6)"/>
      <rect x="8" y="36" width="54" height="10" rx="3" fill="rgba(255,255,255,0.04)"/>
      <rect x="14" y="39" width="22" height="4" rx="2" fill="rgba(148,163,184,0.3)"/>
      <rect x="8" y="50" width="54" height="10" rx="3" fill="rgba(255,255,255,0.04)"/>
      <rect x="14" y="53" width="28" height="4" rx="2" fill="rgba(148,163,184,0.3)"/>
      <rect x="8" y="64" width="54" height="10" rx="3" fill="rgba(255,255,255,0.04)"/>
      <rect x="14" y="67" width="18" height="4" rx="2" fill="rgba(148,163,184,0.3)"/>
      {/* Email list */}
      <rect x="76" y="12" width="105" height="38" rx="5" fill="rgba(96,165,250,0.12)" stroke="rgba(96,165,250,0.3)" strokeWidth="0.5"/>
      <circle cx="87" cy="24" r="5" fill="rgba(96,165,250,0.5)"/>
      <rect x="97" y="20" width="55" height="4" rx="2" fill="rgba(148,163,184,0.6)"/>
      <rect x="97" y="27" width="75" height="3.5" rx="2" fill="rgba(148,163,184,0.25)"/>
      <rect x="97" y="33" width="60" height="3.5" rx="2" fill="rgba(148,163,184,0.18)"/>
      <rect x="76" y="55" width="105" height="32" rx="5" fill="rgba(15,32,68,0.5)"/>
      <circle cx="87" cy="65" r="5" fill="rgba(100,116,139,0.4)"/>
      <rect x="97" y="61" width="42" height="4" rx="2" fill="rgba(100,116,139,0.5)"/>
      <rect x="97" y="68" width="72" height="3.5" rx="2" fill="rgba(100,116,139,0.2)"/>
      <rect x="76" y="92" width="105" height="32" rx="5" fill="rgba(15,32,68,0.5)"/>
      <circle cx="87" cy="102" r="5" fill="rgba(100,116,139,0.4)"/>
      <rect x="97" y="98" width="55" height="4" rx="2" fill="rgba(100,116,139,0.5)"/>
      <rect x="97" y="105" width="65" height="3.5" rx="2" fill="rgba(100,116,139,0.2)"/>
      {/* Compose area */}
      <rect x="187" y="12" width="125" height="176" rx="7" fill="rgba(9,18,38,0.7)" stroke="rgba(96,165,250,0.2)" strokeWidth="0.5"/>
      <rect x="197" y="20" width="55" height="4" rx="2" fill="rgba(148,163,184,0.5)"/>
      <rect x="197" y="28" width="100" height="3.5" rx="2" fill="rgba(148,163,184,0.2)"/>
      <rect x="197" y="34" width="85" height="3.5" rx="2" fill="rgba(148,163,184,0.15)"/>
      <rect x="197" y="40" width="95" height="3.5" rx="2" fill="rgba(148,163,184,0.15)"/>
      {/* AI suggestion */}
      <rect x="197" y="52" width="108" height="50" rx="5" fill="rgba(96,165,250,0.08)" stroke="rgba(96,165,250,0.25)" strokeWidth="0.5"/>
      <text x="201" y="62" fontSize="5.5" fill="rgba(96,165,250,0.8)" fontFamily="monospace">✦ AI Suggestion</text>
      <rect x="201" y="66" width="90" height="3.5" rx="2" fill="rgba(96,165,250,0.35)"/>
      <rect x="201" y="72" width="98" height="3.5" rx="2" fill="rgba(96,165,250,0.25)"/>
      <rect x="201" y="78" width="75" height="3.5" rx="2" fill="rgba(96,165,250,0.2)"/>
      <rect x="201" y="88" width="38" height="9" rx="3" fill="rgba(96,165,250,0.3)" stroke="rgba(96,165,250,0.5)" strokeWidth="0.5"/>
      <text x="206" y="94" fontSize="5.5" fill="rgba(147,197,253,0.9)">Accept</text>
      <rect x="245" y="88" width="52" height="9" rx="3" fill="rgba(255,255,255,0.04)"/>
      <text x="249" y="94" fontSize="5.5" fill="rgba(148,163,184,0.6)">Regenerate</text>
    </svg>
  </div>
)

const VisionAIPreview: React.FC = () => (
  <div className="h-full w-full relative overflow-hidden"
    style={{ background: 'linear-gradient(135deg, #1c0a00 0%, #2e1200 55%, #1a0d00 100%)' }}>
    <div className="absolute top-0 left-0 h-32 w-48 bg-orange-500/15 rounded-full blur-2xl" />
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 200" fill="none">
      {/* Header toolbar */}
      <rect x="0" y="0" width="320" height="22" fill="rgba(28,14,0,0.9)"/>
      <circle cx="14" cy="11" r="4" fill="rgba(251,146,60,0.6)"/>
      <rect x="26" y="8" width="40" height="5" rx="2" fill="rgba(148,163,184,0.25)"/>
      <rect x="240" y="6" width="30" height="10" rx="4" fill="rgba(251,146,60,0.3)"/>
      <rect x="280" y="6" width="32" height="10" rx="4" fill="rgba(251,146,60,0.15)"/>
      {/* Image grid */}
      {[
        { x: 10,  y: 28, w: 90,  h: 72, color: '#fb923c', label: 'Person', conf: '0.97' },
        { x: 108, y: 28, w: 100, h: 72, color: '#22d3ee', label: 'Vehicle', conf: '0.91' },
        { x: 216, y: 28, w: 94,  h: 72, color: '#4ade80', label: 'Object', conf: '0.88' },
      ].map(({ x, y, w, h, color, label, conf }) => (
        <g key={label}>
          <rect x={x} y={y} width={w} height={h} rx="4" fill="rgba(30,20,10,0.7)" stroke="rgba(100,80,40,0.3)" strokeWidth="0.5"/>
          {/* Mock image content */}
          <rect x={x+6} y={y+6} width={w-12} height={h-12} rx="3" fill={`${color}08`}/>
          {/* Detection box */}
          <rect x={x+16} y={y+12} width={w*0.5} height={h*0.6} rx="2"
            fill="none" stroke={color} strokeWidth="1" opacity="0.8"/>
          {/* Corner accents */}
          <line x1={x+16} y1={y+12} x2={x+22} y2={y+12} stroke={color} strokeWidth="2" strokeLinecap="round"/>
          <line x1={x+16} y1={y+12} x2={x+16} y2={y+18} stroke={color} strokeWidth="2" strokeLinecap="round"/>
          {/* Label chip */}
          <rect x={x+16} y={y+10} width={label.length*5+8} height="9" rx="2" fill={color} opacity="0.9"/>
          <text x={x+20} y={y+16.5} fontSize="5.5" fill="black" fontFamily="monospace" fontWeight="600">{label}</text>
          {/* Confidence */}
          <rect x={x+6} y={y+h-16} width={w-12} height="10" rx="3" fill="rgba(0,0,0,0.5)"/>
          <text x={x+10} y={y+h-9} fontSize="5.5" fill={color} fontFamily="monospace">{conf} conf</text>
        </g>
      ))}
      {/* Second row */}
      {[
        { x: 10,  y: 108, w: 90,  h: 60 },
        { x: 108, y: 108, w: 100, h: 60 },
        { x: 216, y: 108, w: 94,  h: 60 },
      ].map(({ x, y, w, h }, i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} rx="4" fill="rgba(30,20,10,0.5)" stroke="rgba(100,80,40,0.2)" strokeWidth="0.5"/>
          <rect x={x+6} y={y+6} width={w-12} height={h-12} rx="2" fill="rgba(255,255,255,0.03)"/>
          <rect x={x+18} y={y+10} width={w*0.45} height={h*0.55} rx="2" fill="none" stroke="rgba(251,146,60,0.3)" strokeWidth="0.8"/>
        </g>
      ))}
      {/* Stats bar */}
      <rect x="0" y="174" width="320" height="26" fill="rgba(28,14,0,0.95)"/>
      <text x="12" y="190" fontSize="7" fill="rgba(251,146,60,0.8)" fontFamily="monospace">DETECTED: 14</text>
      <text x="98" y="190" fontSize="7" fill="rgba(34,211,238,0.7)" fontFamily="monospace">FPS: 28.4</text>
      <text x="160" y="190" fontSize="7" fill="rgba(74,222,128,0.7)" fontFamily="monospace">MODEL: YOLOv8</text>
      <rect x="268" y="178" width="40" height="12" rx="4" fill="rgba(74,222,128,0.2)" stroke="rgba(74,222,128,0.4)" strokeWidth="0.5"/>
      <text x="274" y="186" fontSize="6" fill="#4ade80" fontFamily="monospace">● LIVE</text>
    </svg>
  </div>
)

const MultiAgentPreview: React.FC = () => (
  <div className="h-full w-full relative overflow-hidden"
    style={{ background: 'linear-gradient(135deg, #051a12 0%, #0a2e1f 55%, #041510 100%)' }}>
    <div className="absolute top-0 right-0 h-40 w-40 bg-emerald-500/12 rounded-full blur-2xl" />
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 200" fill="none">
      {/* Flow lanes */}
      {[40, 100, 160].map((y, i) => (
        <line key={i} x1="10" y1={y} x2="310" y2={y}
          stroke="rgba(52,211,153,0.08)" strokeWidth="20" strokeLinecap="round"/>
      ))}
      {/* Nodes */}
      {[
        { x: 30,  y: 40,  label: 'Input',    color: '#34d399', type: 'start' },
        { x: 100, y: 40,  label: 'Planner',  color: '#34d399', type: 'agent' },
        { x: 180, y: 40,  label: 'Executor', color: '#34d399', type: 'agent' },
        { x: 260, y: 40,  label: 'Reviewer', color: '#34d399', type: 'agent' },
        { x: 100, y: 100, label: 'Research', color: '#22d3ee', type: 'agent' },
        { x: 180, y: 100, label: 'Coder',    color: '#22d3ee', type: 'agent' },
        { x: 260, y: 100, label: 'Tester',   color: '#22d3ee', type: 'agent' },
        { x: 100, y: 160, label: 'Memory',   color: '#a78bfa', type: 'store' },
        { x: 180, y: 160, label: 'Tools',    color: '#a78bfa', type: 'store' },
        { x: 260, y: 160, label: 'Output',   color: '#4ade80', type: 'end' },
      ].map(({ x, y, label, color }) => (
        <g key={label}>
          <rect x={x-28} y={y-13} width={56} height={26} rx="5"
            fill="rgba(9,25,18,0.85)" stroke={color} strokeWidth="0.8" opacity="0.85"/>
          <text x={x} y={y+4} fontSize="6.5" fill={color} fontFamily="monospace"
            textAnchor="middle" opacity="0.9">{label}</text>
        </g>
      ))}
      {/* Arrows */}
      {[
        [58, 40, 72, 40], [128, 40, 152, 40], [208, 40, 232, 40],
        [128, 100, 152, 100], [208, 100, 232, 100],
        [100, 53, 100, 87], [180, 53, 180, 87], [260, 53, 260, 87],
        [100, 113, 100, 147], [180, 113, 180, 147],
        [228, 100, 244, 147],
      ].map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="rgba(52,211,153,0.3)" strokeWidth="1"
          markerEnd="url(#arr)" strokeDasharray="3 1.5"/>
      ))}
      <defs>
        <marker id="arr" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
          <path d="M0,0 L4,2 L0,4" fill="none" stroke="rgba(52,211,153,0.5)" strokeWidth="0.8"/>
        </marker>
      </defs>
      {/* Status panel */}
      <rect x="0" y="178" width="320" height="22" fill="rgba(5,26,18,0.95)"/>
      <circle cx="14" cy="189" r="3.5" fill="#4ade80"/>
      <text x="22" y="192" fontSize="6.5" fill="rgba(74,222,128,0.8)" fontFamily="monospace">All agents running · 6 tasks active · 0 errors</text>
    </svg>
  </div>
)

// ─── Project Data ─────────────────────────────────────────────────────────────
const PROJECTS: Project[] = [
  {
    id: 'support-bot',
    title: 'AI Customer Support Bot',
    category: 'AI · ML',
    status: 'live',
    shortDesc: 'Intelligent multi-channel support system with GPT-4 RAG, auto ticket routing, and real-time sentiment analysis.',
    fullDesc: 'A production-grade AI support system that handles thousands of customer conversations daily. Combines retrieval-augmented generation with a custom knowledge base to deliver accurate, context-aware responses. Integrates with Slack, email, and web chat simultaneously.',
    tech: ['OpenAI GPT-4', 'LangChain', 'Next.js', 'PostgreSQL', 'Redis', 'Pinecone', 'TypeScript'],
    highlights: [
      'Reduced average ticket resolution time by 68% compared to human-only support',
      'RAG pipeline with 50K+ document knowledge base, sub-200ms retrieval',
      'Real-time sentiment analysis triggers human escalation automatically',
      'Multi-channel: Web, Slack, Email — unified conversation context',
    ],
    github: '#',
    demo: '#',
    accentA: '#7c3aed',
    accentB: '#a78bfa',
    Preview: ChatBotPreview,
  },
  {
    id: 'ai-employee',
    title: 'Autonomous AI Employee',
    category: 'AI · ML',
    status: 'beta',
    shortDesc: 'Multi-agent system that autonomously plans, executes, and reviews complex business workflows without human intervention.',
    fullDesc: 'An orchestrated network of specialized AI agents that collaboratively handle end-to-end business tasks. Each agent has a distinct role — Planner, Executor, Reviewer, Memory — coordinated by a central orchestrator. Handles research, coding, testing, and reporting autonomously.',
    tech: ['OpenAI', 'LangGraph', 'Python', 'FastAPI', 'Docker', 'Redis', 'PostgreSQL'],
    highlights: [
      'Orchestrates 6+ specialized agents with LangGraph state machine',
      'Persistent memory system enables long-running multi-day tasks',
      'Built-in reviewer agent catches errors before delivering results',
      'Tool access: web search, code execution, file system, APIs',
    ],
    github: '#',
    demo: '#',
    accentA: '#0891b2',
    accentB: '#22d3ee',
    Preview: AgentPreview,
  },
  {
    id: 'rag-assistant',
    title: 'RAG Knowledge Assistant',
    category: 'AI · ML',
    status: 'live',
    shortDesc: 'Enterprise knowledge base with semantic vector search, AI Q&A with cited sources, and multi-format document ingestion.',
    fullDesc: 'A full-stack RAG (Retrieval-Augmented Generation) platform that ingests internal documentation, PDFs, Confluence pages, and Notion databases into a searchable vector store. Answers questions with inline source citations and confidence scores.',
    tech: ['OpenAI', 'Pinecone', 'LangChain', 'Next.js', 'PostgreSQL', 'Unstructured.io', 'TypeScript'],
    highlights: [
      'Ingests PDF, DOCX, HTML, Markdown — 50+ file formats supported',
      'Vector similarity search with hybrid BM25 + embedding ranking',
      'Every answer includes cited source chunks with confidence score',
      'Multi-tenant architecture: isolated knowledge bases per organisation',
    ],
    github: '#',
    demo: '#',
    accentA: '#7c3aed',
    accentB: '#ec4899',
    Preview: RAGPreview,
  },
  {
    id: 'email-ai',
    title: 'AI Email Automation',
    category: 'Full Stack',
    status: 'live',
    shortDesc: 'Intelligent email drafting and automation platform with AI-powered suggestions, tone analysis, and scheduling.',
    fullDesc: 'A smart email client overlay that monitors your inbox, drafts context-aware replies, and automates follow-up sequences. Uses fine-tuned models to match your writing style and integrates with CRM tools to personalise outreach at scale.',
    tech: ['OpenAI', 'Gmail API', 'Next.js', 'Prisma', 'PostgreSQL', 'Resend', 'TypeScript'],
    highlights: [
      'Writing-style fine-tuning learns from your sent email history',
      'AI auto-drafts replies with full email thread context',
      'CRM integration pulls lead data for hyper-personalised outreach',
      'A/B testing for subject lines with open-rate analytics dashboard',
    ],
    github: '#',
    demo: '#',
    accentA: '#1d4ed8',
    accentB: '#60a5fa',
    Preview: EmailAIPreview,
  },
  {
    id: 'vision-ai',
    title: 'Vision AI Dashboard',
    category: 'AI · ML',
    status: 'live',
    shortDesc: 'Real-time computer vision platform with object detection, classification, and live analytics for video streams.',
    fullDesc: 'A real-time video analytics platform powered by custom-trained YOLOv8 models. Processes multiple live video streams simultaneously, detecting and classifying objects with bounding boxes, confidence scores, and temporal tracking. Deployed on edge hardware with cloud sync.',
    tech: ['Python', 'YOLOv8', 'FastAPI', 'React', 'OpenCV', 'Redis', 'Docker'],
    highlights: [
      'Processes 6 simultaneous 1080p video streams at 28+ FPS',
      'Custom YOLOv8 models fine-tuned on domain-specific datasets',
      'Real-time WebSocket dashboard with frame-by-frame annotation',
      'Edge deployment support (Jetson Nano, RPi) with cloud sync',
    ],
    github: '#',
    accentA: '#b45309',
    accentB: '#fb923c',
    Preview: VisionAIPreview,
  },
  {
    id: 'multi-agent',
    title: 'Multi-Agent Research System',
    category: 'AI · ML',
    status: 'open-source',
    shortDesc: 'Collaborative AI research framework where specialized agents conduct literature reviews, synthesize findings, and produce reports.',
    fullDesc: 'An open-source framework for orchestrating multi-agent research pipelines. Specialized agents handle different research stages: search, reading, synthesis, fact-checking, and writing. Built on LangGraph with a visual workflow editor for non-technical users.',
    tech: ['Python', 'LangGraph', 'OpenAI', 'Tavily', 'FastAPI', 'React', 'Docker'],
    highlights: [
      '6 specialized agents from research planning to final report generation',
      'Visual no-code workflow editor built in React Flow',
      'Tavily search integration with automatic source validation',
      '800+ GitHub stars · MIT licensed · active community',
    ],
    github: '#',
    accentA: '#0d9488',
    accentB: '#34d399',
    Preview: MultiAgentPreview,
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<Status, { label: string; dot: string; text: string; bg: string; border: string }> = {
  live:          { label: 'Live',        dot: '#4ade80', text: 'text-green-400',  bg: 'rgba(74,222,128,0.10)',  border: 'rgba(74,222,128,0.25)'  },
  beta:          { label: 'Beta',        dot: '#fb923c', text: 'text-orange-400', bg: 'rgba(251,146,60,0.10)',  border: 'rgba(251,146,60,0.25)'  },
  'open-source': { label: 'Open Source', dot: '#60a5fa', text: 'text-blue-400',   bg: 'rgba(96,165,250,0.10)', border: 'rgba(96,165,250,0.25)'  },
}

const CATEGORIES = ['All', 'AI · ML', 'Full Stack', 'Tools'] as const

// ─── Icons ────────────────────────────────────────────────────────────────────
const GithubIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
)

const ExternalIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
  </svg>
)

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
  </svg>
)

// ─── Filter Bar ───────────────────────────────────────────────────────────────
function FilterBar({ active, onChange }: { active: string; onChange: (c: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-12 flex flex-wrap justify-center gap-2"
    >
      {CATEGORIES.map((cat) => {
        const isActive = active === cat
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className="relative rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 outline-none"
            style={{
              color: isActive ? '#fff' : 'rgba(148,163,184,0.8)',
              background: isActive ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${isActive ? 'rgba(139,92,246,0.45)' : 'rgba(255,255,255,0.07)'}`,
            }}
          >
            {isActive && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 rounded-xl"
                style={{ background: 'rgba(139,92,246,0.12)' }}
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
            <span className="relative z-10">{cat}</span>
          </button>
        )
      })}
    </motion.div>
  )
}

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({
  project,
  index,
  onClick,
}: {
  project: Project
  index: number
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const status = STATUS_CONFIG[project.status]
  const { Preview } = project

  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, transition: { duration: 0.25, ease: 'easeOut' } }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
      className="group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: 'rgba(8,14,28,0.75)',
        backdropFilter: 'blur(24px)',
        border: `1px solid ${hovered ? project.accentA + '55' : 'rgba(255,255,255,0.08)'}`,
        boxShadow: hovered
          ? `0 0 0 1px ${project.accentA}25, 0 20px 60px rgba(0,0,0,0.5), 0 0 50px ${project.accentA}20`
          : '0 4px 24px rgba(0,0,0,0.4)',
        transition: 'border-color 0.35s ease, box-shadow 0.4s ease',
      }}
    >
      {/* ── Image area ── */}
      <div className="relative h-[200px] overflow-hidden">
        {/* Zoom container — CSS scale on group-hover */}
        <div
          className="h-full w-full transition-transform duration-500 ease-out"
          style={{ transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
        >
          <Preview />
        </div>

        {/* Gradient overlay at bottom of image */}
        <div
          className="absolute bottom-0 inset-x-0 h-20 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(8,14,28,0.95), transparent)' }}
        />

        {/* Category badge */}
        <div
          className="absolute top-3 left-3 rounded-lg px-2.5 py-1 text-[10px] font-mono font-semibold uppercase tracking-widest"
          style={{
            background: `${project.accentA}25`,
            border: `1px solid ${project.accentA}45`,
            color: project.accentB,
            backdropFilter: 'blur(8px)',
          }}
        >
          {project.category}
        </div>

        {/* Status badge */}
        <div
          className="absolute top-3 right-3 flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-mono font-semibold"
          style={{
            background: status.bg,
            border: `1px solid ${status.border}`,
            backdropFilter: 'blur(8px)',
          }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: status.dot }} />
          <span className={status.text}>{status.label}</span>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex flex-col gap-3 p-5 flex-1">
        {/* Title */}
        <h3
          className="text-lg font-bold leading-tight text-slate-100 group-hover:text-white transition-colors duration-200"
          style={{ textShadow: hovered ? `0 0 20px ${project.accentA}60` : 'none', transition: 'text-shadow 0.3s ease' }}
        >
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 flex-1">
          {project.shortDesc}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tech.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-md px-2 py-0.5 text-[10px] font-mono text-slate-500"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              {tag}
            </span>
          ))}
          {project.tech.length > 4 && (
            <span
              className="rounded-md px-2 py-0.5 text-[10px] font-mono"
              style={{ background: 'rgba(255,255,255,0.03)', color: 'rgba(148,163,184,0.5)' }}
            >
              +{project.tech.length - 4}
            </span>
          )}
        </div>

        {/* Divider + buttons */}
        <div
          className="flex items-center justify-between pt-3 gap-2"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          {/* GitHub */}
          <a
            href={project.github}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors duration-200"
          >
            <GithubIcon />
            GitHub
          </a>

          <div className="flex items-center gap-2">
            {/* Live demo */}
            {project.demo && (
              <a
                href={project.demo}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-xs font-semibold transition-colors duration-200"
                style={{ color: project.accentB }}
              >
                Live Demo
                <ExternalIcon />
              </a>
            )}

            {/* View details pill */}
            <span
              className="flex items-center gap-1 text-[10px] font-mono text-slate-600 group-hover:text-slate-400 transition-colors duration-200"
            >
              View details →
            </span>
          </div>
        </div>
      </div>

      {/* Bottom gradient border line (appears on hover) */}
      <div
        className="absolute bottom-0 inset-x-0 h-px pointer-events-none transition-opacity duration-400"
        style={{
          background: `linear-gradient(90deg, transparent, ${project.accentA}, ${project.accentB}, transparent)`,
          opacity: hovered ? 1 : 0,
        }}
      />
    </motion.article>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const status = STATUS_CONFIG[project.status]
  const { Preview } = project

  // ESC key handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ background: 'rgba(3,7,18,0.82)', backdropFilter: 'blur(16px)' }} />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.90, y: 32 }}
        animate={{ opacity: 1, scale: 1,    y: 0 }}
        exit={{   opacity: 0, scale: 0.93,  y: 16 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30, mass: 0.8 }}
        className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl"
        style={{
          background: 'rgba(8,14,28,0.95)',
          border: `1px solid ${project.accentA}40`,
          boxShadow: `0 0 0 1px ${project.accentA}18, 0 40px 120px rgba(0,0,0,0.7), 0 0 80px ${project.accentA}15`,
          backdropFilter: 'blur(40px)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:text-white transition-colors duration-200"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <CloseIcon />
        </button>

        {/* Preview image */}
        <div className="relative h-56 overflow-hidden rounded-t-3xl">
          <Preview />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(8,14,28,1) 0%, rgba(8,14,28,0.3) 50%, transparent 100%)' }} />
          {/* Top accent line */}
          <div className="absolute top-0 inset-x-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${project.accentA}, ${project.accentB}, transparent)` }} />
        </div>

        {/* Content */}
        <div className="p-8 pt-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="rounded-lg px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-widest"
                  style={{ background: `${project.accentA}20`, border: `1px solid ${project.accentA}40`, color: project.accentB }}
                >
                  {project.category}
                </span>
                <span
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-mono font-semibold"
                  style={{ background: status.bg, border: `1px solid ${status.border}` }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: status.dot }} />
                  <span className={status.text}>{status.label}</span>
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-50 leading-tight">{project.title}</h2>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-400 leading-relaxed mb-7">{project.fullDesc}</p>

          {/* Highlights */}
          <div className="mb-7">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-widest text-slate-500 mb-3">
              Key Highlights
            </h4>
            <ul className="space-y-2.5">
              {project.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                    style={{ background: project.accentB, boxShadow: `0 0 6px ${project.accentB}` }}
                  />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          {/* Tech stack */}
          <div className="mb-8">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-widest text-slate-500 mb-3">
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg px-3 py-1.5 text-xs font-mono font-medium text-slate-300"
                  style={{
                    background: `${project.accentA}12`,
                    border: `1px solid ${project.accentA}30`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex items-center gap-3">
            <a
              href={project.github}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-slate-200 transition-all duration-200 hover:text-white"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <GithubIcon />
              View on GitHub
            </a>
            {project.demo && (
              <a
                href={project.demo}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-all duration-200 hover:opacity-90"
                style={{
                  background: `linear-gradient(135deg, ${project.accentA}, ${project.accentB})`,
                  boxShadow: `0 0 24px ${project.accentA}50`,
                }}
              >
                <ExternalIcon />
                Live Demo
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function Projects() {
  const [filter, setFilter]     = useState<string>('All')
  const [selected, setSelected] = useState<Project | null>(null)
  const [mounted, setMounted]   = useState(false)

  useEffect(() => setMounted(true), [])

  const handleFilterChange = useCallback((cat: string) => setFilter(cat), [])

  const visible = filter === 'All'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === filter)

  return (
    <SectionWrapper
      id="projects"
      label="Portfolio"
      title="Featured Projects"
      subtitle="Real products shipped — from AI agents to full-stack platforms. Click any card to explore."
    >
      <FilterBar active={filter} onChange={handleFilterChange} />

      {/* Cards grid */}
      <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((project, i) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <ProjectCard
                project={project}
                index={i}
                onClick={() => setSelected(project)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* "View all" CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-14 text-center"
      >
        <a
          href="#"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-violet-400 transition-colors duration-200"
        >
          See all projects on GitHub
          <ExternalIcon />
        </a>
      </motion.div>

      {/* Modal portal */}
      {mounted && (
        <AnimatePresence>
          {selected && createPortal(
            <ProjectModal project={selected} onClose={() => setSelected(null)} />,
            document.body,
          )}
        </AnimatePresence>
      )}
    </SectionWrapper>
  )
}
