import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import LoadingScreen from '@/components/ui/LoadingScreen'
import CustomCursor from '@/components/ui/CustomCursor'
import ScrollProgress from '@/components/ui/ScrollProgress'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

// ── Site URL (set NEXT_PUBLIC_SITE_URL in production env) ───
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yourdomain.com'

const title    = 'Bisma — Full Stack & AI Engineer'
const description =
  'Full Stack Developer & AI Engineer building intelligent web applications. ' +
  'Specializing in React, Next.js, TypeScript, RAG systems, and LLM-powered products.'

// ── Metadata ────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: title,
    template: '%s | Bisma',
  },
  description,
  keywords: [
    'Bisma', 'Full Stack Developer', 'AI Engineer', 'React Developer',
    'Next.js Developer', 'TypeScript', 'RAG', 'LangChain', 'OpenAI',
    'LLM', 'Portfolio', 'San Francisco',
  ],
  authors:  [{ name: 'Bisma' }],
  creator:  'Bisma',
  publisher: 'Bisma',

  // ── Robots ──────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // ── Canonical ───────────────────────────────────────────
  alternates: {
    canonical: siteUrl,
  },

  // ── Open Graph ──────────────────────────────────────────
  openGraph: {
    type:      'website',
    locale:    'en_US',
    url:       siteUrl,
    siteName:  'Bisma — Portfolio',
    title,
    description,
    images: [
      {
        url:    '/opengraph-image',
        width:  1200,
        height: 630,
        alt:    title,
        type:   'image/png',
      },
    ],
  },

  // ── Twitter / X ─────────────────────────────────────────
  twitter: {
    card:        'summary_large_image',
    title,
    description,
    images:      ['/opengraph-image'],
    // creator: '@yourhandle',   // add your Twitter handle
  },

  // ── Icons ───────────────────────────────────────────────
  icons: {
    icon:     [{ url: '/icon.svg', type: 'image/svg+xml' }],
    shortcut: '/icon.svg',
    apple:    '/icon.svg',
  },

  // ── App-specific ────────────────────────────────────────
  applicationName: 'Bisma Portfolio',
  category: 'technology',
}

// ── Viewport (separate export per Next.js 14 convention) ───
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)',  color: '#080d1a' },
    { media: '(prefers-color-scheme: light)', color: '#f0f4ff' },
  ],
  width:        'device-width',
  initialScale: 1,
  maximumScale: 5,
}

// ── Layout ──────────────────────────────────────────────────
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased transition-colors duration-300">
        <ThemeProvider>
          {/* Skip to main content — keyboard accessibility */}
          <a
            href="#hero"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[600] focus:rounded-lg focus:bg-violet-600 focus:px-4 focus:py-2 focus:text-white focus:text-sm focus:font-semibold focus:shadow-lg focus:outline-none"
          >
            Skip to content
          </a>

          {/* Global UI layers */}
          <LoadingScreen />
          <CustomCursor />
          <ScrollProgress />

          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
