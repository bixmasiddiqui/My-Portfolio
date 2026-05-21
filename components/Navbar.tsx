'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import ThemeToggle from '@/components/ui/ThemeToggle'

const links = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Timeline', href: '#timeline' },
  { label: 'GitHub', href: '#github' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (href: string) => {
    setActive(href)
    setMenuOpen(false)
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'glass border-b border-white/[0.06] shadow-glass'
            : 'bg-transparent',
        )}
      >
        <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 lg:px-12">
          {/* Logo */}
          <a
            href="#hero"
            className="font-mono text-lg font-bold tracking-tight"
            onClick={() => setActive('')}
          >
            <span className="gradient-text">BS</span>
            <span className="ml-1 text-slate-400">.</span>
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => handleNav(link.href)}
                  className={clsx(
                    'relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
                    active === link.href
                      ? 'text-violet-400'
                      : 'text-slate-400 hover:text-slate-100',
                  )}
                >
                  {active === link.href && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-lg bg-violet-500/10"
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </a>
              </li>
            ))}
          </ul>

          {/* Theme toggle + CTA */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <a
              href="#contact"
              className="inline-flex items-center gap-2 btn-gradient text-white text-sm font-semibold px-5 py-2.5 rounded-lg"
            >
              <span>Hire Me</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex md:hidden flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span className={clsx('block h-0.5 w-6 bg-slate-300 transition-all duration-300', menuOpen && 'translate-y-2 rotate-45')} />
            <span className={clsx('block h-0.5 w-6 bg-slate-300 transition-all duration-300', menuOpen && 'opacity-0')} />
            <span className={clsx('block h-0.5 w-6 bg-slate-300 transition-all duration-300', menuOpen && '-translate-y-2 -rotate-45')} />
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="fixed top-[72px] inset-x-0 z-40 glass border-b border-white/[0.06] shadow-glass md:hidden"
          >
            <ul className="flex flex-col px-6 py-4 gap-1">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => handleNav(link.href)}
                    className="block px-4 py-3 text-sm font-medium text-slate-300 rounded-lg hover:bg-white/5 hover:text-slate-100 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="mt-2 flex items-center gap-3">
                <ThemeToggle />
                <a
                  href="#contact"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 block btn-gradient text-center text-white text-sm font-semibold px-5 py-3 rounded-lg"
                >
                  Hire Me
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
