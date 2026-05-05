const stack = [
    'PHP', 'Java', 'JavaScript', 'SQL',
    'Laravel', 'Spring Boot', 'React', 'Android',
    'MySQL', 'Git', 'Maven', 'Vite',
    'Three.js', 'API REST', 'JWT', 'MVC',
]

export default function About() {
    return (
        <section id="about">
            <div className="section-eyebrow">À propos</div>
            <h2 className="section-title">
                Développeur &amp;<br />
                <span className="gradient-text">alternant</span>
            </h2>

            <div className="grid-2">
                <div className="card">
                    <div className="card-icon">🎓</div>
                    <h3>Formation</h3>
                    <ul>
                        <li><strong>BTS SIO SLAM</strong> — Session 2026</li>
                        <li><strong>Bac STI2D option SIN</strong> — 2024</li>
                    </ul>
                </div>
                <div className="card">
                    <div className="card-icon">💼</div>
                    <h3>Expérience</h3>
                    <p><strong>LMG</strong> — Alternance 2 ans (2024–2026)</p>
                    <p style={{ fontSize: '0.83rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>
                        Mission CNP Assurances · Offre Collective
                    </p>
                    <ul>
                        <li>Évolutions IHM, BDD et XML sur appli Laravel</li>
                        <li>Migration PHP/Laravel, correctifs incidents</li>
                    </ul>
                </div>
            </div>

            <p className="stack-label">Stack technique</p>
            <div className="stack-grid">
                {stack.map(s => <div className="stack-item" key={s}>{s}</div>)}
            </div>
        </section>
    )
}
