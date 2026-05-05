export default function Veille() {
    return (
        <section id="veille">
            <div className="section-eyebrow">Veille technologique · E5</div>
            <h2 className="section-title">
                L'IA dans la<br />
                <span className="gradient-text">cybersécurité</span>
            </h2>
            <p className="section-sub">
                Évolution de l'intelligence artificielle dans le domaine de la cybersécurité — côté défensif et offensif.
            </p>

            <div className="veille-grid">
                <div className="veille-card accent-indigo">
                    <h3>🛡️ IA défensive</h3>
                    <ul>
                        <li>Détection d'intrusions par machine learning (IDS/IPS)</li>
                        <li>SIEM augmentés par IA : Splunk, Microsoft Sentinel</li>
                        <li>Analyse comportementale UEBA (anomalies temps réel)</li>
                        <li>Threat intelligence automatisée : CrowdStrike, Darktrace</li>
                    </ul>
                </div>
                <div className="veille-card accent-red">
                    <h3>⚔️ IA offensive</h3>
                    <ul>
                        <li>Génération automatique de phishing ciblé (spear phishing)</li>
                        <li>Deepfakes pour l'ingénierie sociale</li>
                        <li>Fuzzing et découverte de vulnérabilités assistés par IA</li>
                        <li>LLM malveillants : WormGPT, FraudGPT</li>
                    </ul>
                </div>
                <div className="veille-card">
                    <h3>⚖️ Enjeux</h3>
                    <ul>
                        <li>Course aux armements IA entre attaquants et défenseurs</li>
                        <li>AI Act européen et implications pour la cybersécurité</li>
                        <li>Faux positifs et confiance dans les systèmes IA</li>
                        <li>Responsabilité légale en cas d'incident causé par une IA</li>
                    </ul>
                </div>
                <div className="veille-card">
                    <h3>📚 Sources</h3>
                    <ul>
                        <li><a href="https://www.ssi.gouv.fr" target="_blank" rel="noopener noreferrer">ANSSI — ssi.gouv.fr ↗</a></li>
                        <li><a href="https://www.cert.ssi.gouv.fr" target="_blank" rel="noopener noreferrer">CERT-FR — cert.ssi.gouv.fr ↗</a></li>
                        <li><a href="https://thehackernews.com" target="_blank" rel="noopener noreferrer">The Hacker News ↗</a></li>
                        <li>Dev.to — #security #cybersecurity #ai</li>
                    </ul>
                </div>
            </div>
        </section>
    )
}
