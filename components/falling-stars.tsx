"use client"

import { useEffect, useRef } from "react"

export function FallingStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let stars: Star[] = []

    interface Star {
      x: number
      y: number
      size: number
      speed: number
      opacity: number
      drift: number
      twinkleSpeed: number
      twinkleOffset: number
    }

    function resize() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    function createStar(): Star {
      return {
        x: Math.random() * (canvas?.width || window.innerWidth),
        y: Math.random() * -100,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.8 + 0.2,
        opacity: Math.random() * 0.7 + 0.3,
        drift: (Math.random() - 0.5) * 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinkleOffset: Math.random() * Math.PI * 2,
      }
    }

    function initStars() {
      stars = []
      const count = Math.floor(
        ((canvas?.width || 1000) * (canvas?.height || 800)) / 5000
      )
      for (let i = 0; i < count; i++) {
        const star = createStar()
        star.y = Math.random() * (canvas?.height || 800)
        stars.push(star)
      }
    }

    function animate(time: number) {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = stars.length - 1; i >= 0; i--) {
        const star = stars[i]
        star.y += star.speed
        star.x += star.drift

        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset)
        const currentOpacity = star.opacity * (0.5 + twinkle * 0.5)

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(220, 38, 38, ${currentOpacity})`
        ctx.fill()

        // Glow
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(220, 38, 38, ${currentOpacity * 0.1})`
        ctx.fill()

        if (star.y > canvas.height + 10 || star.x < -10 || star.x > canvas.width + 10) {
          stars[i] = createStar()
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    resize()
    initStars()
    animationFrameId = requestAnimationFrame(animate)

    window.addEventListener("resize", () => {
      resize()
      initStars()
    })

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  )
}
