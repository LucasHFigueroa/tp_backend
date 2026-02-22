import { useState, useEffect } from 'react'
import './Header.css'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header__topline" />

      <div className="header__inner">
        <div className="header__logo">

          {/* Nombre principal */}
          <span className="header__name">NOCTIS</span>

          {/* Subtexto — se oculta al scrollear */}
          {!scrolled && (
            <span className="header__sub">BAR & COCKTAILS</span>
          )}

        </div>

        {/* Tagline — solo visible en la versión grande */}
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