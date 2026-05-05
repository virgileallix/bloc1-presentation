const LINKS = [
    {
        href: 'https://www.linkedin.com/in/virgile-allix/',
        icon: '🔗',
        iconClass: 'ci-indigo',
        label: 'LinkedIn',
        sub: 'linkedin.com/in/virgile-allix',
        arrow: '↗',
        external: true,
    },
    {
        href: 'https://github.com/virgileallix',
        icon: '💻',
        iconClass: 'ci-purple',
        label: 'GitHub',
        sub: 'github.com/virgileallix',
        arrow: '↗',
        external: true,
    },
    {
        href: 'mailto:virgile.allix11@gmail.com',
        icon: '📧',
        iconClass: 'ci-cyan',
        label: 'Email',
        sub: 'virgile.allix11@gmail.com',
        arrow: '↗',
    },
    {
        icon: '📊',
        iconClass: 'ci-green',
        label: 'Tableau E5',
        sub: 'Télécharger (Excel)',
        arrow: '↓',
        download: true,
    },
]

export default function Contact() {
    const base = import.meta.env.BASE_URL

    return (
        <section id="contact">
            <div className="section-eyebrow">Contact</div>
            <h2 className="section-title">
                Entrons en<br />
                <span className="gradient-text">contact</span>
            </h2>
            <p className="section-sub">
                N'hésitez pas à me contacter pour toute question ou opportunité professionnelle.
            </p>

            <div className="contact-grid">
                {LINKS.map(l => (
                    <a
                        key={l.label}
                        href={l.download ? `${base}tableau-e5.xlsx` : l.href}
                        className="contact-card"
                        target={l.external ? '_blank' : undefined}
                        rel={l.external ? 'noopener noreferrer' : undefined}
                        download={l.download ? 'Tableau-Synthese-E5-Virgile-Allix.xlsx' : undefined}
                    >
                        <div className={`contact-icon ${l.iconClass}`}>{l.icon}</div>
                        <div className="contact-card-text">
                            <strong>{l.label}</strong>
                            <span>{l.sub}</span>
                        </div>
                        <span className="contact-card-arrow">{l.arrow}</span>
                    </a>
                ))}
            </div>
        </section>
    )
}
