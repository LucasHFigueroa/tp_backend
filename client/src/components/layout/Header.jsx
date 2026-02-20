import { useState, useEffect } from 'react'
import './Header.css'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header__inner">

        {/* Línea decorativa superior */}
        <div className="header__topline" />

        <div className="header__content">
          {/* Decoración izquierda */}
          <div className="header__deco">
            <span className="header__deco-line" />
            <span className="header__deco-diamond">◆</span>
          </div>

          {/* Logo central */}
          <div className="header__center">
            <h1 className="header__logo">NOCTUA</h1>
            <p className="header__tagline">Bar & Cocktails</p>
          </div>

          {/* Decoración derecha */}
          <div className="header__deco header__deco--right">
            <span className="header__deco-diamond">◆</span>
            <span className="header__deco-line" />
          </div>
        </div>

        {/* Línea decorativa inferior */}
        <div className="header__bottomline" />

        {/* Horario */}
        <p className="header__hours">
          Lun – Vie  20:00 → 03:00 &nbsp;·&nbsp; Sáb – Dom  19:00 → 04:00
        </p>
      </div>
    </header>
  )
}