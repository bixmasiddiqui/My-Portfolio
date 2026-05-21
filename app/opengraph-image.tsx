import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Bisma — Full Stack & AI Engineer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #080d1a 0%, #0d1428 50%, #060e1e 100%)',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Background glow blobs */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            left: -100,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -80,
            right: -80,
            width: 450,
            height: 450,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.14) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Top gradient bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, #7c3aed, #a78bfa 30%, #06b6d4 70%, #22d3ee)',
            display: 'flex',
          }}
        />

        {/* Grid pattern overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            display: 'flex',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 88px',
            flex: 1,
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* Icon mark */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 72,
              height: 72,
              borderRadius: 16,
              background: 'rgba(124,58,237,0.15)',
              border: '1px solid rgba(139,92,246,0.4)',
              marginBottom: 32,
            }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <polyline points="16 18 22 12 16 6" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="8 6 2 12 8 18" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Name */}
          <div
            style={{
              fontSize: 76,
              fontWeight: 900,
              letterSpacing: '-2px',
              lineHeight: 1,
              marginBottom: 20,
              background: 'linear-gradient(135deg, #e2d9f3 0%, #a78bfa 45%, #22d3ee 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              display: 'flex',
            }}
          >
            BISMA
          </div>

          {/* Role */}
          <div
            style={{
              fontSize: 28,
              fontWeight: 500,
              color: '#94a3b8',
              marginBottom: 40,
              letterSpacing: '-0.3px',
              display: 'flex',
            }}
          >
            Full Stack Developer &amp; AI Engineer
          </div>

          {/* Tech pills */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {['React', 'Next.js', 'TypeScript', 'OpenAI', 'LangChain', 'Python'].map((tech) => (
              <div
                key={tech}
                style={{
                  padding: '8px 18px',
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#94a3b8',
                  fontSize: 16,
                  fontFamily: 'monospace',
                  display: 'flex',
                }}
              >
                {tech}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 88px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#4ade80',
                display: 'flex',
              }}
            />
            <span style={{ color: '#64748b', fontSize: 16, fontFamily: 'monospace', display: 'flex' }}>
              Available for opportunities
            </span>
          </div>
          <span style={{ color: '#475569', fontSize: 16, fontFamily: 'monospace', display: 'flex' }}>
            {process.env.NEXT_PUBLIC_SITE_URL?.replace('https://', '') ?? 'portfolio'}
          </span>
        </div>
      </div>
    ),
    { ...size },
  )
}
