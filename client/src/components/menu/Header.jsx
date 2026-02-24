import { useState, useEffect, useRef } from 'react'
import './Header.css'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const headerRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!headerRef.current) return
    const updateHeight = () => {
      const h = headerRef.current?.offsetHeight ?? 0
      document.documentElement.style.setProperty('--header-height', `${h}px`)
    }
    updateHeight()
    const ro = new ResizeObserver(updateHeight)
    ro.observe(headerRef.current)
    return () => ro.disconnect()
  }, [])

  return (
    <header ref={headerRef} className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header__topline" />

      <div className="header__inner">
        <div className="header__logo">

          <span className="header__name">NOCTIS</span>

          {!scrolled && (
            <span className="header__sub">BAR & COCKTAILS</span>
          )}

        </div>

        {!scrolled && (
          <>
            <div className="header__deco">
              <span className="header__deco-line" />
              <span className="header__deco-diamond">◆</span>
              <span className="header__deco-line" />
            </div>
            <p className="header__tagline">donde la noche cobra vida</p>
          </>
        )}
      </div>

      <div className="header__bottomline" />
    </header>
  )
}