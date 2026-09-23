---
title: Arklay's docs
description: Personal notes on systems, networking and cybersecurity.
---
Personal notes on systems, networking and cybersecurity.

<section class="ark-home" aria-label="Field Manual collections">
<div class="ark-home-heading">
<span>KNOWLEDGE BASE</span>
<h2>Core collections</h2>
</div>
<div class="ark-card-grid">
<a class="ark-collection-card" href="./networking/">
<span class="ark-card-code">001 / NETWORKING</span>
<span class="ark-orbit" aria-hidden="true"><canvas data-orbit="system"></canvas></span>
<strong>Networking</strong>
<span class="ark-card-description">Protocols, services, traffic and infrastructure.</span>
</a>
</div>
</section>

<script>
(() => {
  const initArklayOrbits = () => {
    if (window.__arklayOrbitFrame) cancelAnimationFrame(window.__arklayOrbitFrame)
    const canvases = [...document.querySelectorAll('.ark-collection-card canvas[data-orbit]')]
    if (canvases.length === 0) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const red = { r: 237, g: 96, b: 109 }
    const rgba = (alpha) => `rgba(${red.r}, ${red.g}, ${red.b}, ${alpha})`
    const seeded = (seed) => {
      const value = Math.sin(seed * 91.731) * 43758.5453
      return value - Math.floor(value)
    }
    const point = (cx, cy, rx, ry, rotation, angle) => {
      const x = rx * Math.cos(angle)
      const y = ry * Math.sin(angle)
      const c = Math.cos(rotation)
      const s = Math.sin(rotation)
      return { x: cx + x * c - y * s, y: cy + x * s + y * c }
    }
    const arc = (ctx, cx, cy, rx, ry, rotation, start, end, color, width, blur = 0) => {
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(rotation)
      ctx.beginPath()
      ctx.ellipse(0, 0, rx, ry, 0, start, end)
      ctx.strokeStyle = color
      ctx.lineWidth = width
      ctx.shadowColor = color
      ctx.shadowBlur = blur
      ctx.stroke()
      ctx.restore()
    }
    const sphere = (ctx, x, y, radius, type) => {
      const gradient = ctx.createRadialGradient(x - radius * 0.35, y - radius * 0.4, 0.4, x, y, radius)
      gradient.addColorStop(0, 'rgba(255, 248, 249, 1)')
      gradient.addColorStop(0.2, rgba(0.98))
      gradient.addColorStop(type === 'eclipse' ? 0.48 : 0.62, rgba(type === 'eclipse' ? 0.38 : 0.58))
      gradient.addColorStop(1, 'rgba(26, 4, 8, 1)')
      ctx.save()
      ctx.shadowColor = rgba(0.85)
      ctx.shadowBlur = 13
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
    const draw = (canvas, now, index) => {
      const rect = canvas.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const width = Math.round(rect.width * dpr)
      const height = Math.round(rect.height * dpr)
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }
      const ctx = canvas.getContext('2d')
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, rect.width, rect.height)
      const t = now / 1000
      const cx = rect.width / 2
      const cy = rect.height / 2
      const type = canvas.dataset.orbit

      for (let i = 0; i < 13; i++) {
        const x = seeded((index + 1) * 41 + i * 3.1) * rect.width
        const y = seeded((index + 4) * 73 + i * 5.7) * rect.height
        const radius = 0.35 + seeded(i + index * 9) * 0.65
        ctx.fillStyle = i % 4 === 0 ? rgba(0.46) : `rgba(238, 238, 242, ${0.15 + seeded(i * 2.4) * 0.28})`
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      const aura = ctx.createRadialGradient(cx, cy, 1, cx, cy, 45)
      aura.addColorStop(0, rgba(0.18))
      aura.addColorStop(0.5, rgba(0.05))
      aura.addColorStop(1, rgba(0))
      ctx.fillStyle = aura
      ctx.fillRect(0, 0, rect.width, rect.height)

      const orbits = type === 'system'
        ? [{ rx: 45, ry: 13, rot: -0.16, rate: 0.44, phase: 0.2 }, { rx: 36, ry: 20, rot: 0.72, rate: -0.61, phase: 2.4 }, { rx: 28, ry: 9, rot: -0.82, rate: 0.82, phase: 4.1 }]
        : type === 'signal'
          ? [{ rx: 44, ry: 15, rot: 0.28, rate: 0.48, phase: 1.1 }, { rx: 31, ry: 21, rot: -0.65, rate: -0.69, phase: 3.4 }]
          : [{ rx: 44, ry: 14, rot: -0.38, rate: 0.42, phase: 0.6 }, { rx: 33, ry: 22, rot: 0.55, rate: -0.58, phase: 2.8 }]

      orbits.forEach((orbit, orbitIndex) => {
        arc(ctx, cx, cy, orbit.rx, orbit.ry, orbit.rot, Math.PI, Math.PI * 2, rgba(0.18), 1, 2)
        arc(ctx, cx, cy, orbit.rx, orbit.ry, orbit.rot, 0, Math.PI, rgba(0.06), 0.7)
        const angle = t * orbit.rate + orbit.phase
        ctx.beginPath()
        for (let step = 0; step <= 18; step++) {
          const a = angle - 0.6 + 0.6 * (step / 18)
          const p = point(cx, cy, orbit.rx, orbit.ry, orbit.rot, a)
          step === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)
        }
        ctx.strokeStyle = rgba(0.13 + orbitIndex * 0.04)
        ctx.lineWidth = 1.4
        ctx.shadowColor = rgba(0.45)
        ctx.shadowBlur = 4
        ctx.stroke()
        ctx.shadowBlur = 0
      })

      sphere(ctx, cx, cy, type === 'eclipse' ? 9 : 7.5, type)

      orbits.forEach((orbit, orbitIndex) => {
        arc(ctx, cx, cy, orbit.rx, orbit.ry, orbit.rot, 0, Math.PI, rgba(0.52 - orbitIndex * 0.09), 1.05, 3)
        const angle = t * orbit.rate + orbit.phase
        const p = point(cx, cy, orbit.rx, orbit.ry, orbit.rot, angle)
        const radius = orbitIndex === 0 ? 2.6 : 1.9
        const satellite = ctx.createRadialGradient(p.x - radius * 0.35, p.y - radius * 0.35, 0.1, p.x, p.y, radius)
        satellite.addColorStop(0, 'rgba(255, 255, 255, 0.98)')
        satellite.addColorStop(0.35, rgba(0.95))
        satellite.addColorStop(1, rgba(0.08))
        ctx.save()
        ctx.shadowColor = rgba(0.95)
        ctx.shadowBlur = 8
        ctx.fillStyle = satellite
        ctx.beginPath()
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      if (type === 'signal') {
        const scan = (t * 0.52) % (Math.PI * 2)
        arc(ctx, cx, cy, 48, 31, -0.12, scan, scan + 0.52, rgba(0.34), 1.6, 7)
      }
    }
    const animate = (now) => {
      canvases.forEach((canvas, index) => draw(canvas, reduced ? 1800 : now, index))
      if (!reduced) window.__arklayOrbitFrame = requestAnimationFrame(animate)
    }
    window.__arklayOrbitFrame = requestAnimationFrame(animate)
  }

  initArklayOrbits()
  document.addEventListener('nav', initArklayOrbits)
})()
</script>
