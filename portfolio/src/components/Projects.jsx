import { useState } from 'react'

const PROJECTS = [
    {
        id: 'mtconges',
        badge: 'Projet BTS · Formation',
        badgeClass: 'badge-blue',
        title: 'ADP — MT-Congés',
        sub: 'Application Java de gestion des congés · Sept. 2024 — Mars 2025',
        description: 'Application de gestion des congés du personnel en Java 17, architecture MVC complète avec gestion des rôles et sécurité BCrypt.',
        details: [
            {
                title: 'Fonctionnalités',
                items: [
                    'Authentification BCrypt + gestion de session',
                    'Gestion des rôles et permissions',
                    'Notifications de statut (approuvé / refusé)',
                    'Logging complet des actions',
                    'Conformité RGPD',
                ],
            },
            {
                title: 'Rôles utilisateurs',
                items: [
                    'Super-Admin — gestion complète',
                    'Responsable — validation des demandes',
                    'Employé — dépôt et suivi des congés',
                ],
            },
        ],
        tags: ['Java 17', 'Swing', 'MySQL', 'Maven', 'JDBC', 'BCrypt', 'MVC', 'DAO/POJO'],
        competences: ['Patrimoine informatique', 'Incidents & assistance', 'Mode projet'],
    },
    {
        id: 'rftg',
        badge: 'Projet BTS · Formation',
        badgeClass: 'badge-purple',
        title: 'RFTG — Webservice Multi-Couches',
        sub: 'Architecture microservices 4 composants · Sept. 2025 — Mai 2026',
        description: 'Architecture microservices avec 4 composants indépendants communiquant via une API REST sécurisée avec authentification JWT partagée.',
        details: [
            {
                title: '🐸 Toad — API Spring Boot',
                items: ['Backend principal, authentification JWT', 'Endpoints REST, gestion des ressources'],
            },
            {
                title: '🍄 Mario — Frontend Laravel',
                items: ["Interface web connectée à l'API Toad", 'Gestion des vues, formulaires, auth'],
            },
            {
                title: '🦎 Luigi — Android',
                items: ["App mobile Java, consomme l'API Toad", 'Interface native avec JWT'],
            },
            {
                title: '🍑 Peach — BDD',
                items: ['MySQL Sakila partagée', 'Requêtes optimisées, JPA'],
            },
        ],
        tags: ['Spring Boot', 'JWT', 'Laravel', 'PHP', 'Android', 'Java', 'MySQL', 'Retrofit'],
        competences: ['Présence en ligne', 'Mode projet', 'Service informatique'],
    },
    {
        id: 'cnp',
        badge: 'Mission entreprise · LMG',
        badgeClass: 'badge-amber',
        title: 'LMG — Mission CNP Assurances',
        sub: 'Application Offre Collective · Janvier 2025 → en cours',
        description: "Application de proposition commerciale pour des contrats de santé collective, développée en alternance chez LMG pour le client CNP Assurances.",
        details: [
            {
                title: 'Réalisations',
                items: [
                    'Ajout de vues et composants IHM',
                    'Modifications BDD : nouvelles tables et colonnes',
                    'Mise à jour des fichiers XML (PRGG)',
                    "Correctifs d'incidents signalés par le client",
                    'Migration Laravel et PHP vers versions récentes',
                ],
            },
        ],
        tags: ['Laravel', 'PHP', 'MySQL', 'XML', 'Blade', 'Git'],
        competences: ['Incidents & évolutions', 'Mode projet', 'Patrimoine'],
    },
    {
        id: 'anglais',
        badge: 'Projet personnel',
        badgeClass: 'badge-green',
        title: 'Anglais-Appli',
        sub: "Application web de révision d'anglais",
        description: "Application web de révision d'anglais : quiz interactif, vocabulaire thématique, suivi de progression.",
        details: [
            {
                title: 'Fonctionnalités',
                items: [
                    'Quiz interactif avec score',
                    'Vocabulaire classé par thèmes',
                    'Suivi de la progression',
                    'Exercices ciblés par niveau',
                ],
            },
        ],
        tags: ['React', 'Vite', 'JavaScript', 'GitHub Pages'],
        competences: ['Présence en ligne', 'Mode projet'],
        link: 'https://virgile-allix.github.io/anglais-appli/',
    },
]

function ProjectCard({ project }) {
    const [open, setOpen] = useState(false)

    return (
        <div className={`project-card${open ? ' open' : ''}`}>
            <div
                className="project-card-header"
                onClick={() => setOpen(o => !o)}
                role="button"
                aria-expanded={open}
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setOpen(o => !o)}
            >
                <div className="project-card-header-left">
                    <div className={`project-badge ${project.badgeClass}`}>{project.badge}</div>
                    <div className="project-card-title">{project.title}</div>
                    <div className="project-card-sub">{project.sub}</div>
                </div>
                <div className="project-toggle" aria-hidden="true">+</div>
            </div>

            <div className="project-card-body">
                <div className="project-card-body-inner">
                    <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                        {project.description}
                    </p>
                    <div className="project-details-grid">
                        {project.details.map((d, i) => (
                            <div className="project-detail-block" key={i}>
                                <h4>{d.title}</h4>
                                <ul>
                                    {d.items.map((item, j) => <li key={j}>{item}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="tags" style={{ marginBottom: '0.75rem' }}>
                        {project.tags.map(t => <span className="tag" key={t}>{t}</span>)}
                    </div>
                    <div className="tags">
                        {project.competences.map(c => <span className="tag tag-green" key={c}>{c}</span>)}
                    </div>
                    {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                            Voir le projet ↗
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function Projects() {
    return (
        <section id="projects">
            <div className="section-eyebrow">Projets</div>
            <h2 className="section-title">
                Réalisations &amp;<br />
                <span className="gradient-text">missions</span>
            </h2>
            <p className="section-sub">
                Projets BTS et mission en alternance — cliquez sur une carte pour déplier les détails.
            </p>
            <div className="projects-list">
                {PROJECTS.map(p => <ProjectCard key={p.id} project={p} />)}
            </div>
        </section>
    )
}
