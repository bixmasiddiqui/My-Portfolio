'use client'
import { useState, useEffect, useRef } from 'react'

interface Options {
  typeSpeed?: number
  deleteSpeed?: number
  pauseAfterType?: number
  pauseAfterDelete?: number
}

export function useTypingEffect(texts: string[], options: Options = {}) {
  const {
    typeSpeed = 80,
    deleteSpeed = 40,
    pauseAfterType = 2200,
    pauseAfterDelete = 400,
  } = options

  const [displayText, setDisplayText] = useState('')
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'deleting' | 'waiting'>('typing')
  const [currentIndex, setCurrentIndex] = useState(0)
  const frameRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const currentText = texts[currentIndex]

    const tick = () => {
      if (phase === 'typing') {
        setDisplayText((prev) => {
          const next = currentText.slice(0, prev.length + 1)
          if (next === currentText) {
            setPhase('pausing')
          }
          return next
        })
      } else if (phase === 'pausing') {
        frameRef.current = setTimeout(() => setPhase('deleting'), pauseAfterType)
        return
      } else if (phase === 'deleting') {
        setDisplayText((prev) => {
          const next = prev.slice(0, -1)
          if (next === '') {
            setPhase('waiting')
          }
          return next
        })
      } else if (phase === 'waiting') {
        frameRef.current = setTimeout(() => {
          setCurrentIndex((i) => (i + 1) % texts.length)
          setPhase('typing')
        }, pauseAfterDelete)
        return
      }
    }

    const delay = phase === 'typing' ? typeSpeed : phase === 'deleting' ? deleteSpeed : 0
    frameRef.current = setTimeout(tick, delay)

    return () => {
      if (frameRef.current) clearTimeout(frameRef.current)
    }
  }, [displayText, phase, currentIndex, texts, typeSpeed, deleteSpeed, pauseAfterType, pauseAfterDelete])

  return { displayText, isTyping: phase === 'typing' }
}
