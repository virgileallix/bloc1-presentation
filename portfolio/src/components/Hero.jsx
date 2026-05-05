export default function Hero() {
    return (
        <section id="hero">
            <div className="hero-eyebrow">
                <span className="hero-dot" />
                BTS SIO SLAM · Promotion 2026
            </div>
            <h1 className="hero-title">
                Virgile<br />
                <span className="gradient-text">Allix</span>
            </h1>
            <p className="hero-sub">
                Développeur Full Stack en alternance chez <strong>MTB by Créative</strong>,<br />
                mission <strong>CNP Assurances</strong>. Java, Laravel, React.
            </p>
            <div className="hero-cta">
                <a href="#projects" className="btn-primary">Voir les projets</a>
                <a href="#contact" className="btn-ghost">Me contacter</a>
            </div>
            <div className="hero-scroll">
                <div className="hero-scroll-line" />
                Scroll
            </div>
        </section>
    )
}
