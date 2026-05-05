import { useEffect, useState } from 'react'

const LINKS = [
    { href: '#hero',     label: 'Accueil'  },
    { href: '#about',    label: 'À propos' },
    { href: '#projects', label: 'Projets'  },
    { href: '#veille',   label: 'Veille'   },
    { href: '#contact',  label: 'Contact'  },
]

export default function Nav() {
    const [scrolled, setScrolled] = useState(false)
    const [active, setActive] = useState('#hero')

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        const obs = new IntersectionObserver(
            entries => {
                entries.forEach(e => { if (e.isIntersecting) setActive('#' + e.target.id) })
            },
            { rootMargin: '-40% 0px -55% 0px' }
        )
        LINKS.forEach(({ href }) => {
            const el = document.getElementById(href.slice(1))
            if (el) obs.observe(el)
        })
        return () => obs.disconnect()
    }, [])

    return (
        <nav className={`nav${scrolled ? ' scrolled' : ''}`} aria-label="Navigation principale">
            <div className="nav-inner">
                <a href="#hero" className="nav-logo">
                    <div className="nav-logo-avatar">VA</div>
                    <span className="nav-logo-name">Virgile Allix</span>
                </a>
                <ul className="nav-links">
                    {LINKS.map(({ href, label }) => (
                        <li key={href}>
                            <a href={href} className={`nav-link${active === href ? ' active' : ''}`}>
                                {label}
                            </a>
                        </li>
                    ))}
                </ul>
                <a href={import.meta.env.BASE_URL} className="nav-back">← Portfolio 3D</a>
            </div>
        </nav>
    )
}
