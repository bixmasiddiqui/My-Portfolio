import Navbar from '@/components/Navbar'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Skills from '@/components/sections/Skills'
import Projects from '@/components/sections/Projects'
import Experience from '@/components/sections/Experience'
import Timeline from '@/components/sections/Timeline'
import GitHub from '@/components/sections/GitHub'
import Contact from '@/components/sections/Contact'
import Chatbot from '@/components/Chatbot'
import BackgroundEffects from '@/components/ui/BackgroundEffects'

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#080d1a]">
      {/* Advanced animated background — grid, blobs, spotlight, particles */}
      <BackgroundEffects />

      <div className="relative z-10 page-enter">
        <Navbar />
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Timeline />
        <GitHub />
        <Contact />
      </div>

      {/* AI Chatbot — fixed floating widget */}
      <Chatbot />
    </main>
  )
}
