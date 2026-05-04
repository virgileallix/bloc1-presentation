import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import gsap from 'gsap';

// Scene 3D - Setup PC Gaming Réaliste avec Bureau Interactif
class GamerSetup3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.desk = null;
        this.monitor = null;
        this.screenMesh = null;
        this.pcCase = null;
        this.keyboard = null;
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.time = 0;
        this.loader = new GLTFLoader();
        this.loadingManager = new THREE.LoadingManager();
        this.modelsLoaded = 0;
        this.totalModels = 0;
        this.totalBytes = 0;
        this.loadedBytes = 0;
        this.particles = null;

        // Performance settings (auto-detect)
        this.performanceMode = this.detectPerformanceMode();
        this.lastScreenUpdate = 0;
        this.screenUpdateThrottle = this.performanceMode === 'low' ? 50 : 16; // ms between updates
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.osDirty = true; // only redraw OS canvas when state changes

        // Image cache for project images
        this.imageCache = {};

        // Contenu des projets avec images
        this.projects = {
            presentation: {
                title: "Présentation - Virgile Allix",
                sections: [
                    { type: 'title', text: 'Virgile Allix' },
                    { type: 'subtitle', text: 'Développeur Full Stack • BTS SIO SLAM • Alternant LMG' },
                    { type: 'text', text: 'Étudiant en 2ème année de BTS SIO SLAM, en alternance' },
                    { type: 'text', text: 'chez LMG sur une mission CNP Assurances. Je développe' },
                    { type: 'text', text: 'des applications web et mobiles, avec un intérêt' },
                    { type: 'text', text: "particulier pour la sécurité et l'IA." },
                    { type: 'text', text: '' },

                    { type: 'heading', text: '🎓 Formation' },
                    { type: 'text', text: 'BTS SIO option SLAM — Session 2026' },
                    { type: 'text', text: 'Solutions Logicielles et Applications Métiers' },
                    { type: 'text', text: '' },
                    { type: 'text', text: 'Bac STI2D option SIN — 2024' },
                    { type: 'text', text: 'Systèmes d\'Information et Numérique' },
                    { type: 'text', text: '' },

                    { type: 'heading', text: '💼 Expérience' },
                    { type: 'text', text: 'LMG — Alternance 2 ans (2024 → 2026)' },
                    { type: 'text', text: 'Mission chez CNP Assurances — Offre Collective' },
                    { type: 'text', text: '• Évolutions IHM, BDD et XML sur appli Laravel' },
                    { type: 'text', text: '• Migration PHP/Laravel, correctifs incidents' },
                    { type: 'text', text: '• Rôle : Technico-Commercial & Paramètreur' },
                    { type: 'text', text: '' },

                    { type: 'heading', text: '🛠️ Stack technique' },
                    { type: 'text', text: 'Langages : PHP · Java · JavaScript · SQL' },
                    { type: 'text', text: 'Frameworks : Laravel · Spring Boot · React · Android' },
                    { type: 'text', text: 'BDD : MySQL' },
                    { type: 'text', text: 'Outils : Git · GitHub · Maven · Vite' },
                    { type: 'text', text: 'Architecture : MVC · API REST · DAO/POJO' },
                    { type: 'text', text: '' },

                    { type: 'heading', text: '🔐 Veille — IA & Cybersécurité' },
                    { type: 'text', text: 'Sujet : évolution de l\'IA dans la cybersécurité' },
                    { type: 'text', text: '• IA défensive : SIEM, détection d\'intrusions, UEBA' },
                    { type: 'text', text: '• IA offensive : phishing IA, deepfakes, WormGPT' },
                    { type: 'text', text: '• Sources : ANSSI, CERT-FR, The Hacker News' },
                    { type: 'text', text: '' },

                    { type: 'heading', text: '🌟 Qualités' },
                    { type: 'text', text: '✓ Autonome — capable de mener un projet de A à Z' },
                    { type: 'text', text: '✓ Curieux — veille régulière, toujours en apprentissage' },
                    { type: 'text', text: '✓ Rigoureux — code propre, architecture réfléchie' },
                    { type: 'text', text: '✓ Esprit d\'équipe — habitué au travail en alternance' },
                    { type: 'text', text: '' },

                    { type: 'heading', text: '📧 Contact' },
                    { type: 'text', text: '📧 virgile.allix11@gmail.com' },
                    { type: 'text', text: '💻 github.com/virgileallix' },
                    { type: 'text', text: '🔗 linkedin.com/in/virgile-allix' }
                ]
            },
            projet1: {
                title: "ADP - Application de gestion des congés",
                sections: [
                    { type: 'title', text: 'ADP - MT-Congés' },
                    { type: 'subtitle', text: 'Application Java • Sept. 2024 — Mars 2025' },
                    { type: 'mtconges-demo' },
                    { type: 'image', width: 450, height: 250, label: 'Écran de connexion', src: 'images/mtconges/mtconges_login-screen.png' },

                    { type: 'heading', text: '📋 Présentation' },
                    { type: 'text', text: 'Application de gestion des congés développée dans le cadre' },
                    { type: 'text', text: "d'un projet BTS SIO SLAM. Conçue en Java 17 avec une" },
                    { type: 'text', text: 'interface Swing et une base MySQL, elle suit une' },
                    { type: 'text', text: 'architecture MVC structurée.' },

                    { type: 'heading', text: '🎯 Objectifs du projet' },
                    { type: 'text', text: 'Créer une solution complète permettant aux employés de' },
                    { type: 'text', text: 'demander des congés, aux responsables de les valider et' },
                    { type: 'text', text: 'aux administrateurs de gérer les comptes utilisateurs,' },
                    { type: 'text', text: 'le tout dans un environnement sécurisé et conforme.' },

                    { type: 'image', width: 500, height: 280, label: 'Interface principale avec calendrier', src: 'images/mtconges/mtconges_mainpage_calendrier.png' },

                    { type: 'heading', text: '⚙️ Fonctionnalités principales' },
                    { type: 'text', text: '🔐 Authentification sécurisée' },
                    { type: 'text', text: '   • Connexion avec verrouillage automatique' },
                    { type: 'text', text: '   • Réinitialisation de mot de passe' },
                    { type: 'text', text: '   • Contrôles de session' },
                    { type: 'text', text: '' },
                    { type: 'text', text: '👥 Gestion des rôles' },
                    { type: 'text', text: '   • Admin: gestion des utilisateurs' },
                    { type: 'text', text: '   • Responsable: validation des demandes' },
                    { type: 'text', text: '   • Employé: dépôt et suivi des congés' },
                    { type: 'text', text: '' },
                    { type: 'text', text: '🏗️ Architecture MVC' },
                    { type: 'text', text: '   • Modèle: POJO + DAO' },
                    { type: 'text', text: '   • Vue: Swing adaptative' },
                    { type: 'text', text: '   • Contrôleur: logique métier' },

                    { type: 'heading', text: '🔒 Aspects techniques et sécurité' },
                    { type: 'text', text: '• Protection contre injections SQL' },
                    { type: 'text', text: '• Durée de session limitée' },
                    { type: 'text', text: '• Vérifications côté client et serveur' },
                    { type: 'text', text: '• Système de logging complet pour traçage' },
                    { type: 'text', text: '• Conformité RGPD' },

                    { type: 'heading', text: '🛠️ Technologies utilisées' },
                    { type: 'text', text: 'Langage: Java 17' },
                    { type: 'text', text: 'Interface: Java Swing' },
                    { type: 'text', text: 'Base de données: MySQL' },
                    { type: 'text', text: 'Architecture: MVC avec DAO et POJO' },
                    { type: 'text', text: 'Sécurité: Authentification, RGPD, logging' },

                    { type: 'heading', text: '📌 Compétences E4 (Tableau de synthèse)' },
                    { type: 'text', text: '✅ Répondre aux incidents et demandes d\'assistance' },
                    { type: 'text', text: '✅ Travailler en mode projet' },

                    { type: 'heading', text: '💡 Compétences techniques' },
                    { type: 'text', text: '✓ Développement Java 17 & Swing' },
                    { type: 'text', text: '✓ Architecture logicielle MVC' },
                    { type: 'text', text: '✓ Conception de base de données MySQL' },
                    { type: 'text', text: '✓ DAO & POJO' },
                    { type: 'text', text: '✓ Sécurité, authentification, RGPD' },
                    { type: 'text', text: '✓ Logging, débogage et gestion des erreurs' },
                    { type: 'text', text: '✓ Gestion des rôles et permissions' }
                ]
            },
            projet2: {
                title: "RFTG — Système de location de films (univers Mario)",
                sections: [
                    { type: 'title', text: 'RFTG' },
                    { type: 'subtitle', text: 'Full-Stack Java · Laravel · Android • Sept. 2025 — Mai 2026' },

                    { type: 'heading', text: '📋 Présentation' },
                    { type: 'text', text: "RFTG est un système complet de location de films inspiré" },
                    { type: 'text', text: "de la base Sakila (MySQL). Chaque composant est nommé" },
                    { type: 'text', text: "d'après un personnage de l'univers Mario." },

                    { type: 'heading', text: '🏗️ Architecture 3 tiers — Univers Mario' },
                    { type: 'text', text: '📱 Luigi — Application Android (Java)' },
                    { type: 'text', text: "   • App mobile de consultation et location de films" },
                    { type: 'text', text: "   • Connexion sécurisée + catalogue films + panier" },
                    { type: 'text', text: "   • Appels REST asynchrones vers l'API Toad" },
                    { type: 'text', text: '' },
                    { type: 'text', text: '🖥️ Mario — Interface Web (Laravel / PHP)' },
                    { type: 'text', text: "   • Frontend web d'administration du catalogue" },
                    { type: 'text', text: "   • Authentification via ToadUserProvider (JWT)" },
                    { type: 'text', text: "   • Services : ToadFilmService, ToadInventoryService" },
                    { type: 'text', text: '' },
                    { type: 'text', text: '🔌 Toad — API REST (Spring Boot / Java 17)' },
                    { type: 'text', text: "   • Backend Spring Boot + Spring Security + JWT" },
                    { type: 'text', text: "   • Controllers : Film, Actor, Rental, Cart, Customer..." },
                    { type: 'text', text: "   • JPA / Hibernate pour la persistance" },
                    { type: 'text', text: '' },
                    { type: 'text', text: '🗄️ Peach — Base de données (MySQL / Sakila)' },
                    { type: 'text', text: "   • Modèle Sakila : films, acteurs, inventaire, locations" },
                    { type: 'text', text: "   • Tables : film, actor, rental, customer, store..." },

                    { type: 'heading', text: '🛠️ Stack technique' },
                    { type: 'text', text: 'API Backend : Java 17, Spring Boot, Spring Security, JWT, JPA' },
                    { type: 'text', text: 'Web Frontend : PHP, Laravel, Blade, CSS' },
                    { type: 'text', text: 'Mobile : Java, Android Studio, API REST asynchrone' },
                    { type: 'text', text: 'BDD : MySQL (schéma Sakila — films/acteurs/locations)' },

                    { type: 'heading', text: '⚡ Points techniques clés' },
                    { type: 'text', text: "• Authentification JWT partagée entre les 3 apps" },
                    { type: 'text', text: "• Architecture orientée services (SOA)" },
                    { type: 'text', text: "• Séparation stricte des couches (Controller/Service/Repo)" },
                    { type: 'text', text: "• APK disponible : RFTG_Virgile_ALLIX.apk" },

                    { type: 'heading', text: '📌 Compétences E5' },
                    { type: 'text', text: '✅ Développer la présence en ligne de l\'organisation' },
                    { type: 'text', text: '✅ Travailler en mode projet' },
                    { type: 'text', text: "✅ Mettre à disposition un service informatique" },

                    { type: 'heading', text: '📅 Statut' },
                    { type: 'text', text: 'En cours — Sept. 2025 à Mai 2026' }
                ]
            },
            projet3: {
                title: "CNP Assurances — LMG Offre Collective",
                sections: [
                    { type: 'title', text: 'CNP Assurances' },
                    { type: 'subtitle', text: 'LMG — Offre Collective • Mission pro 1ère & 2ème année' },
                    { type: 'image', width: 350, height: 200, label: 'CNP Assurances', src: 'images/assureur_logo.png' },

                    { type: 'heading', text: '🏢 Contexte' },
                    { type: 'text', text: "CNP Assurances — l'un des premiers assureurs en France." },
                    { type: 'text', text: "Application interne : LMG « Offre Collective »" },
                    { type: 'text', text: "Outil de création et validation de propositions" },
                    { type: 'text', text: "de santé collective pour les entreprises clientes." },

                    { type: 'heading', text: '👥 Deux rôles utilisateurs' },
                    { type: 'text', text: '💼 Technico-Commercial' },
                    { type: 'text', text: "   • Crée les propositions santé (données admin + prestations)" },
                    { type: 'text', text: "   • Configure garanties : Hospit., Dentaire, Optique..." },
                    { type: 'text', text: "   • Gère cotisations, chargements, projet commercial" },
                    { type: 'text', text: '' },
                    { type: 'text', text: '⚙️ Paramètreur' },
                    { type: 'text', text: "   • Valide les propositions du Technico-Commercial" },
                    { type: 'text', text: "   • Génère les fichiers Contrats et Prestations (XML)" },
                    { type: 'text', text: "   • Gère le cycle : A tarifer → Tarifé → PourSignatureClient" },

                    { type: 'heading', text: '🔧 Évolutions réalisées (VAL & ICH)' },
                    { type: 'e5-row', label: "Ajout de vues et composants IHM (nouvelles fonctionnalités)", period: '2025 →', tags: ['IHM', 'Laravel'] },
                    { type: 'e5-row', label: "Modifications BDD : nouvelles tables et colonnes", period: '2025 →', tags: ['MySQL', 'BDD'] },
                    { type: 'e5-row', label: "Mise à jour fichiers XML (PRGG contrats/prestations)", period: '2025 →', tags: ['XML', 'Contrats'] },
                    { type: 'e5-row', label: "Correctifs d'incidents + migration vers versions récentes", period: '2024-2025', tags: ['Debug', 'Migration'] },

                    { type: 'heading', text: '🛠️ Stack technique' },
                    { type: 'text', text: 'Framework : Laravel / PHP' },
                    { type: 'text', text: 'Base de données : MySQL' },
                    { type: 'text', text: 'Fichiers générés : XML (Contrats, Prestations PRGG)' },
                    { type: 'text', text: 'Outils : Git' },

                    { type: 'heading', text: '📌 Compétences E5' },
                    { type: 'text', text: "✅ Répondre aux incidents et demandes d'évolution" },
                    { type: 'text', text: '✅ Travailler en mode projet' },
                    { type: 'text', text: "✅ Mettre à disposition un service informatique" }
                ]
            },
            projet4: {
                title: "Anglais-Appli - E-commerce de Figurines 3D",
                sections: [
                    { type: 'title', text: 'Anglais-Appli' },
                    { type: 'subtitle', text: 'E-commerce IA • Next.js & TypeScript' },
                    { type: 'image', width: 500, height: 300, label: 'Page daccueil', src: 'images/acceuil.png' },

                    { type: 'heading', text: '🎯 Présentation' },
                    { type: 'text', text: 'Plateforme e-commerce innovante permettant de générer' },
                    { type: 'text', text: 'et vendre des figurines 3D personnalisées grâce à' },
                    { type: 'text', text: 'lintelligence artificielle.' },
                    { type: 'text', text: '' },

                    { type: 'heading', text: '✨ Fonctionnalités principales' },
                    { type: 'text', text: '🤖 Génération de figurines 3D via IA' },
                    { type: 'text', text: '   • Intégration API Meshy.ia' },
                    { type: 'text', text: '   • Création personnalisée de modèles 3D' },
                    { type: 'text', text: '   • Rendu en temps réel' },
                    { type: 'text', text: '' },
                    { type: 'text', text: '🛒 Système e-commerce complet' },
                    { type: 'text', text: '   • Catalogue de produits' },
                    { type: 'text', text: '   • Panier et gestion des commandes' },
                    { type: 'text', text: '   • Système de paiement intégré' },
                    { type: 'text', text: '   • Suivi des ventes' },
                    { type: 'text', text: '' },
                    { type: 'image', width: 500, height: 300, label: 'Interface boutique', src: 'images/shop.png' },

                    { type: 'text', text: '💾 Gestion des données' },
                    { type: 'text', text: '   • Base de données Firebase/Firestore' },
                    { type: 'text', text: '   • Authentification utilisateurs' },
                    { type: 'text', text: '   • Règles de sécurité configurées' },
                    { type: 'text', text: '' },

                    { type: 'heading', text: '🛠️ Stack technique' },
                    { type: 'text', text: 'Framework : Next.js (React)' },
                    { type: 'text', text: 'Langage : TypeScript (99.3% du code)' },
                    { type: 'text', text: 'Styling : Tailwind CSS + PostCSS' },
                    { type: 'text', text: 'Base de données : Firebase/Firestore' },
                    { type: 'text', text: 'API IA : Meshy.ia (génération 3D)' },
                    { type: 'text', text: 'CI/CD : GitHub Actions' },
                    { type: 'text', text: '' },

                    { type: 'heading', text: '🎨 Architecture' },
                    { type: 'text', text: '• Architecture Next.js avec App Router' },
                    { type: 'text', text: '• API Routes pour la logique métier' },
                    { type: 'text', text: '• Intégration API externe (Meshy.ia)' },
                    { type: 'text', text: '• Composants React réutilisables' },
                    { type: 'text', text: '• Type safety avec TypeScript' },
                    { type: 'text', text: '' },

                    { type: 'heading', text: '💡 Points forts' },
                    { type: 'text', text: "✓ Intégration d'une API IA avancée" },
                    { type: 'text', text: '✓ E-commerce complet et fonctionnel' },
                    { type: 'text', text: '✓ Stack moderne et performante' },
                    { type: 'text', text: '✓ Code type-safe avec TypeScript' },
                    { type: 'text', text: '✓ Déploiement automatisé (CI/CD)' },
                    { type: 'text', text: '' },

                    { type: 'heading', text: '📊 Statistiques' },
                    { type: 'text', text: '• 49 commits sur la branche principale' },
                    { type: 'text', text: '• 2 contributeurs actifs' },
                    { type: 'text', text: '• Créé en février 2026' },
                    { type: 'text', text: '' },

                    { type: 'heading', text: '🔗 Ressources' },
                    { type: 'text', text: '🌐 Site : virgile-allix.github.io/anglais-appli/' },
                    { type: 'text', text: '💻 GitHub : github.com/virgile-allix/anglais-appli' },
                    { type: 'text', text: '🤖 API IA : Meshy.ia' }
                ]
            },
            veille: {
                title: "Veille Technologique",
                sections: [
                    { type: 'title', text: 'Ma Veille Tech' },
                    { type: 'subtitle', text: "L'IA dans la cybersécurité" },
                    { type: 'text', text: '🔐 Sujet : évolution de l\'IA appliquée à la cyber' },
                    { type: 'text', text: '' },

                    { type: 'heading', text: '🛡️ IA défensive' },
                    { type: 'text', text: '• Détection d\'intrusions par apprentissage automatique' },
                    { type: 'text', text: '• SIEM augmentés par IA (Splunk, Microsoft Sentinel)' },
                    { type: 'text', text: '• Analyse comportementale (UEBA) pour détecter les' },
                    { type: 'text', text: '  anomalies en temps réel' },
                    { type: 'text', text: '• Threat intelligence automatisée (CrowdStrike, Darktrace)' },
                    { type: 'text', text: '' },

                    { type: 'heading', text: '⚔️ IA offensive' },
                    { type: 'text', text: '• Génération automatique de phishing ciblé (spear)' },
                    { type: 'text', text: '• Deepfakes pour l\'ingénierie sociale' },
                    { type: 'text', text: '• Fuzzing et découverte de vulnérabilités par IA' },
                    { type: 'text', text: '• Automatisation des attaques par LLM (WormGPT, etc.)' },
                    { type: 'text', text: '' },

                    { type: 'heading', text: '⚖️ Enjeux' },
                    { type: 'text', text: '• Course aux armements IA entre attaquants et défenseurs' },
                    { type: 'text', text: '• Réglementation : AI Act européen et cybersécurité' },
                    { type: 'text', text: '• Faux positifs et confiance dans les systèmes IA' },
                    { type: 'text', text: '• Responsabilité en cas d\'incident causé par une IA' },
                    { type: 'text', text: '' },

                    { type: 'heading', text: '📚 Sources' },
                    { type: 'text', text: '• ANSSI — anssi.fr (actualités et guides officiels)' },
                    { type: 'text', text: '• The Hacker News — thehackernews.com' },
                    { type: 'text', text: '• CERT-FR — cert.ssi.gouv.fr' },
                    { type: 'text', text: '• Dev.to #security #ai — flux en temps réel ci-dessous' },
                    { type: 'text', text: '' },

                    { type: 'heading', text: '📰 Actus récentes — Dev.to' },
                    { type: 'text', text: '' },
                    { type: 'live-news' }
                ]
            },
            browser: {
                title: '🌐 Navigateur Web',
                sections: [{ type: 'browser-ui' }]
            },
            terminal: {
                title: '⌨️ Terminal',
                sections: [{ type: 'terminal-ui' }]
            },
            explorer: {
                title: '📁 Explorateur de fichiers',
                sections: [{ type: 'explorer-ui' }]
            },
            taskmanager: {
                title: '📊 Gestionnaire des tâches',
                sections: [{ type: 'taskmanager-ui' }]
            },
            mtconges: {
                title: '🗓  Simulation — MT-Congés',
                sections: [{ type: 'mtconges-ui' }]
            },
            e5: {
                title: '📋 Tableau de Synthèse — Épreuve E5',
                sections: [
                    { type: 'title', text: 'Tableau de Synthèse E5' },
                    { type: 'subtitle', text: 'ALLIX Virgile · BTS SIO SLAM · Session 2026 · 3IFA' },
                    { type: 'text', text: '' },
                    { type: 'heading', text: '📚 Réalisations en formation' },
                    { type: 'e5-row', label: 'ADP — Application Java (gestion des congés)', period: '09/2024 → 03/2025', tags: ['Patrimoine', 'Incidents'] },
                    { type: 'e5-row', label: 'RFTG — Webservice + Appli Android + API + BDD', period: '09/2025 → 05/2026', tags: ['Présence ligne', 'Mode projet', 'Service dispo'] },
                    { type: 'e5-row', label: 'Bloc 1 — Réseaux (Cisco Packet Tracer)', period: '2024', tags: ['Patrimoine'] },
                    { type: 'e5-row', label: 'Bloc 1 — Wordpress', period: '2024', tags: ['Présence ligne'] },
                    { type: 'e5-row', label: 'Création et mise à jour du portfolio', period: '2024 → 2026', tags: ['Présence ligne', 'Mode projet', 'Dév. pro'] },
                    { type: 'e5-row', label: 'Bloc 2 — Environnement PHP Laravel', period: '2024-2025', tags: ['Présence ligne', 'Mode projet', 'Service dispo'] },
                    { type: 'e5-row', label: 'Bloc 1 — Ticketing (Mantis)', period: '2024', tags: ['Incidents'] },
                    { type: 'text', text: '' },
                    { type: 'heading', text: '🏢 Réalisations en entreprise — 1ère année' },
                    { type: 'e5-row', label: 'Extraction et comparaison de données CSV', period: '2024', tags: ['Patrimoine'] },
                    { type: 'e5-row', label: 'Programmation d\'un Mastermind', period: '2024', tags: ['Service dispo'] },
                    { type: 'e5-row', label: 'Correctif d\'incidents rapportés par le client', period: '2024', tags: ['Incidents'] },
                    { type: 'e5-row', label: 'Migration Laravel + PHP vers version récente', period: '2024-2025', tags: ['Incidents', 'Service dispo'] },
                    { type: 'e5-row', label: 'Évolution sur application Laravel existante', period: '01/2025 →', tags: ['Incidents', 'Mode projet'] },
                    { type: 'text', text: '' },
                    { type: 'heading', text: '🏢 Réalisations en entreprise — 2ème année' },
                    { type: 'e5-row', label: 'Développement application Laravel (en cours)', period: '01/2025 →', tags: ['Mode projet', 'Service dispo'] },
                    { type: 'text', text: '' },
                    { type: 'heading', text: '🎯 Compétences couvertes' },
                    { type: 'text', text: '✅ Gérer le patrimoine informatique' },
                    { type: 'text', text: '✅ Répondre aux incidents et demandes d\'évolution' },
                    { type: 'text', text: '✅ Développer la présence en ligne de l\'organisation' },
                    { type: 'text', text: '✅ Travailler en mode projet' },
                    { type: 'text', text: '✅ Mettre à disposition un service informatique' },
                    { type: 'text', text: '✅ Organiser son développement professionnel' }
                ]
            }
        };

        this.currentProject = 'desktop'; // Start on desktop
        this.clickableObjects = [];
        this.isZoomed = false;
        this.windows = []; // Array to store open windows
        this.activeWindow = null;
        this.raycaster = new THREE.Raycaster();
        this.mouseVector = new THREE.Vector2();

        // Desktop UI State
        this.desktopState = {
            mouseX: 0,
            mouseY: 0,
            isDragging: false,
            draggedWindow: null,
            dragOffsetX: 0,
            dragOffsetY: 0,
            lastClickTime: 0,
            lastClickedIcon: null,
            tooltip: null,
            animTime: 0,
            startMenuOpen: false,
            openMenu: null, // { winId, menuName, x, y }
            activeInput: null,
            icons: [
                { id: 'presentation', name: 'Présentation', icon: '📝', x: 30, y: 30, tooltip: 'Ouvrir ma présentation' },
                { id: 'projet1', name: 'MT-Congés', icon: '📅', x: 30, y: 160, tooltip: 'Voir le projet MT-Congés' },
                { id: 'projet2', name: 'RFTG', icon: '💿', x: 30, y: 290, tooltip: 'Voir le projet RFTG' },
                { id: 'projet3', name: 'CNP Assurances', icon: '🏢', x: 30, y: 420, tooltip: 'Mission CNP Assurances' },
                { id: 'projet4', name: 'E-commerce 3D', icon: '🛒', x: 30, y: 550, tooltip: 'E-commerce de figurines IA' },
                { id: 'veille', name: 'Veille Tech', icon: '🛡️', x: 30, y: 680, tooltip: 'Ma veille technologique' },
                { id: 'e5', name: 'Tableau E5', icon: '📋', x: 30, y: 810, tooltip: 'Tableau de synthèse E5' },
                { id: 'browser', name: 'Navigateur', icon: '🌐', x: 180, y: 30, tooltip: 'Navigateur web' },
                { id: 'explorer', name: 'Explorateur', icon: '📁', x: 180, y: 160, tooltip: 'Explorateur de fichiers' },
                { id: 'terminal', name: 'Terminal', icon: '⌨️', x: 180, y: 290, tooltip: 'Terminal interactif' },
                { id: 'taskmanager', name: 'Tâches', icon: '📊', x: 180, y: 420, tooltip: 'Gestionnaire des tâches' }
            ]
        };

        this.init();
    }

    // Détecter le mode de performance selon les capacités du device
    detectPerformanceMode() {
        // Vérifier WebGL capabilities
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

        if (!gl) return 'low';

        // Détection basique: vérifier la mémoire et le GPU
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';

        // Détection de GPU intégré (Intel, pas de carte graphique dédiée)
        const isIntegrated = renderer.includes('Intel') ||
            renderer.includes('HD Graphics') ||
            renderer.includes('UHD Graphics');

        // Vérifier aussi les cores CPU et mémoire disponible
        const cores = navigator.hardwareConcurrency || 2;
        const memory = navigator.deviceMemory || 4; // GB

        // Mode low: GPU intégré OU < 4 cores OU < 4GB RAM
        if (isIntegrated || cores < 4 || memory < 4) {
            console.log('🔧 Mode Performance: LOW (Optimisé pour PC sans carte graphique)');
            return 'low';
        }

        // Mode medium: GPU moyen ou config modeste
        if (cores < 8 || memory < 8) {
            console.log('🔧 Mode Performance: MEDIUM');
            return 'medium';
        }

        console.log('🔧 Mode Performance: HIGH');
        return 'high';
    }

    init() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);
        this.scene.fog = new THREE.Fog(0x1a1a2e, 10, 50);

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(0, 2, 0);

        // Renderer (optimisé selon performance)
        const canvas = document.getElementById('scene3d');
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: this.performanceMode !== 'low', // Désactiver antialias en mode low
            alpha: false,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // Réduire pixel ratio pour low-end devices
        const pixelRatio = this.performanceMode === 'low' ? 1 : Math.min(window.devicePixelRatio, 2);
        this.renderer.setPixelRatio(pixelRatio);

        // Rendu couleur correct + tone mapping cinématique
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = this.performanceMode === 'low' ? 1.0 : 1.2;

        // Shadows: désactiver ou réduire qualité selon performance
        if (this.performanceMode === 'low') {
            this.renderer.shadowMap.enabled = false;
        } else {
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = this.performanceMode === 'medium'
                ? THREE.PCFShadowMap
                : THREE.PCFSoftShadowMap;
        }

        // Environment map (RoomEnvironment) pour reflets PBR sur les modèles
        if (this.performanceMode !== 'low') {
            const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
            pmremGenerator.compileEquirectangularShader();
            this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
            this.scene.environmentIntensity = 0.6;
            pmremGenerator.dispose();
        }

        // Post-processing : Bloom + Output
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera));
        if (this.performanceMode !== 'low') {
            const bloom = new UnrealBloomPass(
                new THREE.Vector2(window.innerWidth, window.innerHeight),
                0.25,  // strength (léger, pas overdone)
                0.4,   // radius
                0.88   // threshold (seuls les éléments très lumineux)
            );
            this.composer.addPass(bloom);
        }
        this.composer.addPass(new OutputPass());

        // OrbitControls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 4;
        this.controls.maxDistance = 20;
        this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.target.set(0, 2, 0);
        this.controls.update();

        // Save original camera position for un-zoom
        this.defaultCameraPos = { x: 0, y: 5, z: 10 };
        this.defaultTarget = { x: 0, y: 2, z: 0 };

        // Lights
        this.createLights();

        // Create scene
        this.createRoom();

        // Créer bureau et moniteur (géométrie de base)
        this.createDesk();
        this.createMonitor();

        // Charger les modèles 3D (chaise, PC, périphériques)
        this.loadSetupModels();

        // Fallback : masquer le loading screen après 12s max
        setTimeout(() => {
            const ls = document.getElementById('loading-screen');
            if (ls && ls.style.display !== 'none') {
                ls.style.opacity = '0';
                setTimeout(() => ls.style.display = 'none', 500);
            }
        }, 12000);

        // Créer particules RGB
        this.createParticles();

        // Events
        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('click', (e) => this.onClick(e));
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });
        window.addEventListener('keydown', (e) => {
            if (this.desktopState.activeInput) {
                this.handleActiveInput(e);
                return;
            }
        });

        // Hide loading screen - géré par updateLoadingProgress() maintenant

        // Animate
        this.animate();
    }

    createLights() {
        // Ambient light - stocker pour pouvoir augmenter en mode zoom
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(this.ambientLight);

        // Main light (plafond) - ombres adaptées selon performance
        const mainLight = new THREE.PointLight(0xffffff, 0.8, 50);
        mainLight.position.set(0, 10, 0);
        if (this.performanceMode !== 'low') {
            mainLight.castShadow = true;
            // Réduire qualité des ombres pour medium
            const shadowMapSize = this.performanceMode === 'medium' ? 1024 : 2048;
            mainLight.shadow.mapSize.width = shadowMapSize;
            mainLight.shadow.mapSize.height = shadowMapSize;
        }
        this.scene.add(mainLight);

        // RGB lights derrière le bureau
        const rgbLight1 = new THREE.PointLight(0xff00ff, 1, 10);
        rgbLight1.position.set(-3, 2, -2);
        this.scene.add(rgbLight1);

        const rgbLight2 = new THREE.PointLight(0x00ffff, 1, 10);
        rgbLight2.position.set(3, 2, -2);
        this.scene.add(rgbLight2);

        // Screen glow - stocker pour pouvoir le désactiver en mode zoom
        this.screenLight = new THREE.PointLight(0x4488ff, 0.5, 5);
        this.screenLight.position.set(0, 3, 0.5);
        this.scene.add(this.screenLight);
    }

    // Charger tous les modèles du setup
    loadSetupModels() {
        // Configuration des modèles à charger
        const models = [
            {
                path: 'models/gaming_chair.glb',
                position: { x: 0, y: 2, z: 3.4 },  // Bien remontée
                scale: { x: 2, y: 2, z: 2 },  // Encore plus grande
                rotation: { x: 0, y: Math.PI, z: 0 },  // Face au bureau
                name: 'chair'
            },
            {
                path: 'models/Gaming_peripherals.glb',
                position: { x: -0.5, y: 2.15, z: 0.5 },  // Centre du bureau
                scale: { x: 1, y: 1, z: 1 },
                rotation: { x: 0, y: 0, z: 0 },
                name: 'peripherals'
            }
        ];

        this.totalModels = models.length;

        // Charger chaque modèle
        models.forEach(modelConfig => {
            this.loadModel(modelConfig);
        });
    }

    // Méthode générique pour charger un modèle GLB
    loadModel(config) {
        this.loader.load(
            config.path,
            (gltf) => {
                const model = gltf.scene;

                // Position, rotation, scale
                model.position.set(config.position.x, config.position.y, config.position.z);
                model.scale.set(config.scale.x, config.scale.y, config.scale.z);
                model.rotation.set(config.rotation.x, config.rotation.y, config.rotation.z);

                // Enable shadows
                model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                // Ajouter à la scène
                this.scene.add(model);

                // Stocker référence
                this[config.name] = model;

                // Animations spéciales pour certains modèles
                if (config.name === 'chair') {
                    // Ajouter une animation subtile de rotation/balancement
                    this.animateChair(model);
                }
                if (config.name === 'pcCase') {
                    // Trouver et animer les LEDs RGB si présentes
                    this.animatePCLights(model);
                }

                // Update loading
                this.modelsLoaded++;
                this.updateLoadingProgress();

                console.log(`✅ Modèle chargé: ${config.name}`);
            },
            (xhr) => {
                if (xhr.lengthComputable) {
                    const percent = (xhr.loaded / xhr.total) * 100;
                    this.updateLoadingInfo(config.name, percent);
                    console.log(`${config.name}: ${percent.toFixed(0)}% chargé`);
                }
            },
            (error) => {
                console.error(`❌ Erreur chargement ${config.name}:`, error);
                // Fallback: créer l'objet basique
                this.createFallbackObject(config.name);
                this.modelsLoaded++;
                this.updateLoadingProgress();
            }
        );
    }

    // Mettre à jour la barre de chargement
    updateLoadingProgress() {
        const loadingBar = document.querySelector('.loading-progress');
        const percentText = document.getElementById('loading-percent');

        if (loadingBar) {
            const percent = (this.modelsLoaded / this.totalModels) * 100;
            loadingBar.style.width = percent + '%';
            if (percentText) {
                percentText.textContent = Math.round(percent) + '%';
            }
        }

        // Tous les modèles sont chargés
        if (this.modelsLoaded >= this.totalModels) {
            const loadingFile = document.getElementById('loading-file');
            if (loadingFile) loadingFile.textContent = '✅ Chargement terminé !';

            setTimeout(() => {
                const loadingScreen = document.getElementById('loading-screen');
                if (loadingScreen) {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => loadingScreen.style.display = 'none', 500);
                }
            }, 500);
        }
    }

    // Mettre à jour les infos de chargement
    updateLoadingInfo(fileName, percent) {
        const loadingFile = document.getElementById('loading-file');
        if (loadingFile) {
            const displayName = fileName.replace('models/', '').replace('.glb', '');
            loadingFile.textContent = `Chargement: ${displayName}...`;
        }
    }

    // Créer un écran interactif (à placer sur le moniteur)
    createInteractiveScreen() {
        // Screen canvas - Taille réduite
        const screenGeometry = new THREE.PlaneGeometry(3.2, 1.8);  // Divisé par 2
        const canvas = document.createElement('canvas');
        canvas.width = 1920;
        canvas.height = 1080;
        const ctx = canvas.getContext('2d');

        this.updateOS(ctx);

        const screenTexture = new THREE.CanvasTexture(canvas);
        screenTexture.minFilter = THREE.LinearFilter;
        screenTexture.magFilter = THREE.LinearFilter;

        const screenMaterial = new THREE.MeshBasicMaterial({
            map: screenTexture,
            emissive: 0xffffff,
            emissiveMap: screenTexture,
            emissiveIntensity: 0.1
        });

        const screen = new THREE.Mesh(screenGeometry, screenMaterial);

        // Ajuster position selon votre modèle de moniteur
        // Ces valeurs sont à modifier selon la taille/position de votre modèle
        screen.position.set(0, 4.5, 0.11);
        screen.userData = { isScreen: true };

        this.screenMesh = screen;
        this.screenTexture = screenTexture;
        this.screenCanvas = canvas;
        this.screenCtx = ctx;

        this.clickableObjects.push(screen);
        this.scene.add(screen);
    }

    // Créer un objet basique si le modèle ne charge pas
    createFallbackObject(name) {
        console.log(`⚠️ Fallback pour ${name}`);

        switch (name) {
            case 'chair':
                this.createChairFallback();
                break;
            case 'pcCase':
                this.createPCCase();
                break;
            case 'peripherals':
                this.createKeyboard();
                this.createMouse();
                this.createMousePad();
                break;
        }
    }

    // Chaise de base si le modèle ne charge pas
    createChairFallback() {
        const chairGroup = new THREE.Group();

        // Siège
        const seatGeo = new THREE.BoxGeometry(1.2, 0.1, 1.2);
        const chairMat = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.6,
            metalness: 0.3
        });
        const seat = new THREE.Mesh(seatGeo, chairMat);
        seat.position.y = 1;
        seat.castShadow = true;
        chairGroup.add(seat);

        // Dossier
        const backGeo = new THREE.BoxGeometry(1.2, 1.5, 0.1);
        const back = new THREE.Mesh(backGeo, chairMat);
        back.position.set(0, 1.75, -0.55);
        back.castShadow = true;
        chairGroup.add(back);

        // Pied central
        const poleGeo = new THREE.CylinderGeometry(0.05, 0.05, 1, 16);
        const pole = new THREE.Mesh(poleGeo, chairMat);
        pole.position.y = 0.5;
        pole.castShadow = true;
        chairGroup.add(pole);

        // Base avec roulettes
        const baseGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.05, 5);
        const base = new THREE.Mesh(baseGeo, chairMat);
        base.position.y = 0.05;
        base.castShadow = true;
        chairGroup.add(base);

        chairGroup.position.set(0, 0, 3);
        chairGroup.rotation.y = Math.PI;
        this.scene.add(chairGroup);
        this.chair = chairGroup;
    }

    // Animation de la chaise (balancement subtil)
    animateChair(chair) {
        // Store original rotation for animation
        chair.userData.originalRotation = chair.rotation.y;
        chair.userData.swaySpeed = 0.5;
        chair.userData.swayAmount = 0.02;
    }

    // Animation des LEDs du PC
    animatePCLights(pc) {
        // Chercher les matériaux émissifs dans le modèle
        pc.traverse((child) => {
            if (child.isMesh && child.material) {
                // Si le matériau a une émission, l'animer
                if (child.material.emissive) {
                    child.userData.isRGBLight = true;
                    child.userData.baseEmissive = child.material.emissive.clone();
                }
            }
        });
    }

    // Créer des particules RGB flottantes (adapté selon performance)
    createParticles() {
        // Ajuster le nombre de particules selon performance
        let particleCount;
        switch (this.performanceMode) {
            case 'low':
                particleCount = 30; // Minimum pour PC faibles
                break;
            case 'medium':
                particleCount = 60;
                break;
            default: // high
                particleCount = 100;
        }

        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            // Position aléatoire autour du setup
            positions[i * 3] = (Math.random() - 0.5) * 15;
            positions[i * 3 + 1] = Math.random() * 8 + 1;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 15;

            // Couleurs RGB
            const color = new THREE.Color();
            color.setHSL(Math.random(), 1, 0.5);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    // Changer la vue de la caméra (presets)
    setCameraView(view) {
        let targetPos, targetLookAt;

        switch (view) {
            case 'default':
                targetPos = { x: 0, y: 5, z: 10 };
                targetLookAt = { x: 0, y: 2, z: 0 };
                break;
            case 'desk':
                targetPos = { x: 0, y: 3, z: 5 };
                targetLookAt = { x: 0, y: 2.5, z: 0 };
                break;
            case 'screen':
                targetPos = { x: 0, y: 4.5, z: 3 };
                targetLookAt = { x: 0, y: 4.5, z: 0 };
                break;
            case 'top':
                targetPos = { x: 0, y: 12, z: 0 };
                targetLookAt = { x: 0, y: 0, z: 0 };
                break;
            default:
                targetPos = this.defaultCameraPos;
                targetLookAt = this.defaultTarget;
        }

        // Animation fluide avec GSAP
        gsap.to(this.camera.position, {
            x: targetPos.x,
            y: targetPos.y,
            z: targetPos.z,
            duration: 1.5,
            ease: "power2.inOut"
        });

        gsap.to(this.controls.target, {
            x: targetLookAt.x,
            y: targetLookAt.y,
            z: targetLookAt.z,
            duration: 1.5,
            ease: "power2.inOut",
            onUpdate: () => this.controls.update()
        });
    }

    // Helper: Convert HSL to RGB hex
    hslToRgb(h, s, l) {
        let r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
    }

    // Dessiner tooltip
    drawTooltip(ctx, text, x, y) {
        const padding = 12;
        const fontSize = 16;
        ctx.font = `bold ${fontSize}px Arial`;
        const textWidth = ctx.measureText(text).width;

        // Position (au dessus du curseur)
        const tooltipX = x + 20;
        const tooltipY = y - 40;
        const tooltipW = textWidth + padding * 2;
        const tooltipH = fontSize + padding * 2;

        // Background avec glassmorphism
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 15;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        const radius = 8;
        ctx.beginPath();
        ctx.moveTo(tooltipX + radius, tooltipY);
        ctx.lineTo(tooltipX + tooltipW - radius, tooltipY);
        ctx.arcTo(tooltipX + tooltipW, tooltipY, tooltipX + tooltipW, tooltipY + radius, radius);
        ctx.lineTo(tooltipX + tooltipW, tooltipY + tooltipH - radius);
        ctx.arcTo(tooltipX + tooltipW, tooltipY + tooltipH, tooltipX + tooltipW - radius, tooltipY + tooltipH, radius);
        ctx.lineTo(tooltipX + radius, tooltipY + tooltipH);
        ctx.arcTo(tooltipX, tooltipY + tooltipH, tooltipX, tooltipY + tooltipH - radius, radius);
        ctx.lineTo(tooltipX, tooltipY + radius);
        ctx.arcTo(tooltipX, tooltipY, tooltipX + radius, tooltipY, radius);
        ctx.closePath();
        ctx.fill();

        // Border
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.shadowBlur = 0;

        // Text
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(text, tooltipX + tooltipW / 2, tooltipY + tooltipH / 2 + 6);
    }

    // Dessiner particules flottantes (adapté selon performance)
    drawFloatingParticles(ctx) {
        if (!this.floatingParticles) {
            // Nombre de particules adapté selon performance
            let particleCount2D;
            switch (this.performanceMode) {
                case 'low':
                    particleCount2D = 10; // Minimum pour PC faibles
                    break;
                case 'medium':
                    particleCount2D = 20;
                    break;
                default: // high
                    particleCount2D = 30;
            }

            // Initialiser les particules
            this.floatingParticles = [];
            for (let i = 0; i < particleCount2D; i++) {
                this.floatingParticles.push({
                    x: Math.random() * this.canvasWidth,
                    y: Math.random() * this.canvasHeight,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 4 + 2,
                    hue: Math.random()
                });
            }
        }

        // Animer et dessiner
        this.floatingParticles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around (utiliser la résolution dynamique)
            if (p.x < 0) p.x = this.canvasWidth;
            if (p.x > this.canvasWidth) p.x = 0;
            if (p.y < 0) p.y = this.canvasHeight;
            if (p.y > this.canvasHeight) p.y = 0;

            // Draw
            const pulse = 0.3 + Math.sin(this.desktopState.animTime * 2 + p.x) * 0.2;
            const color = this.hslToRgb(p.hue, 1, 0.5);
            ctx.fillStyle = color.replace('rgb', 'rgba').replace(')', `, ${pulse})`);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    createRoom() {
        // Floor
        const floorGeometry = new THREE.PlaneGeometry(30, 30);
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a2a3e,
            roughness: 0.8,
            metalness: 0.2
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);

        // Back wall
        const wallGeometry = new THREE.PlaneGeometry(30, 15);
        const wallMaterial = new THREE.MeshStandardMaterial({
            color: 0x1e1e2e,
            roughness: 0.9
        });
        const wall = new THREE.Mesh(wallGeometry, wallMaterial);
        wall.position.set(0, 7.5, -5);
        wall.receiveShadow = true;
        this.scene.add(wall);
    }

    createDesk() {
        const deskGroup = new THREE.Group();

        // Desktop surface
        const topGeometry = new THREE.BoxGeometry(8, 0.1, 3);
        const topMaterial = new THREE.MeshStandardMaterial({
            color: 0x3a3a4a,
            roughness: 0.7,
            metalness: 0.3
        });
        const top = new THREE.Mesh(topGeometry, topMaterial);
        top.position.y = 2;
        top.castShadow = true;
        top.receiveShadow = true;
        deskGroup.add(top);

        // Legs
        const legGeometry = new THREE.BoxGeometry(0.1, 2, 0.1);
        const legMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a2a3a,
            roughness: 0.6,
            metalness: 0.4
        });

        const legPositions = [
            [-3.9, 1, -1.4],
            [3.9, 1, -1.4],
            [-3.9, 1, 1.4],
            [3.9, 1, 1.4]
        ];

        legPositions.forEach(pos => {
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            leg.position.set(...pos);
            leg.castShadow = true;
            deskGroup.add(leg);
        });

        this.scene.add(deskGroup);
        this.desk = deskGroup;
    }

    createMonitor() {
        const monitorGroup = new THREE.Group();

        // Stand base
        const baseGeometry = new THREE.CylinderGeometry(0.3, 0.4, 0.05, 32);
        const standMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.3,
            metalness: 0.7
        });
        const base = new THREE.Mesh(baseGeometry, standMaterial);
        base.position.y = 2.05;
        base.castShadow = true;
        monitorGroup.add(base);

        // Stand pole
        const poleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 16);
        const pole = new THREE.Mesh(poleGeometry, standMaterial);
        pole.position.y = 2.55;
        pole.castShadow = true;
        monitorGroup.add(pole);

        // Monitor frame
        // Monitor frame - Larger
        const frameGeometry = new THREE.BoxGeometry(7, 4, 0.2); // Doubled size roughly
        const frameMaterial = new THREE.MeshStandardMaterial({
            color: 0x0a0a0a,
            roughness: 0.2,
            metalness: 0.8
        });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.set(0, 4.5, 0); // Raised position
        frame.castShadow = true;
        monitorGroup.add(frame);

        // Screen (canvas pour afficher du texte) - Larger
        const screenGeometry = new THREE.PlaneGeometry(6.6, 3.7);

        // Create canvas texture avec résolution adaptée à la performance
        const canvas = document.createElement('canvas');
        // Réduire résolution pour low-end devices
        if (this.performanceMode === 'low') {
            canvas.width = 1920;  // 1080p au lieu de 1440p
            canvas.height = 1080;
        } else {
            canvas.width = 2560;  // 1440p
            canvas.height = 1440;
        }
        const ctx = canvas.getContext('2d');

        // Stocker résolution pour usage futur
        this.canvasWidth = canvas.width;
        this.canvasHeight = canvas.height;

        // Enable high quality text rendering
        ctx.imageSmoothingEnabled = false;  // Désactiver le smoothing pour texte plus net
        ctx.font = '14px Arial';  // Force font pour éviter les bugs d'antialiasing

        // Initial screen content
        this.updateOS(ctx); // Renamed method

        const screenTexture = new THREE.CanvasTexture(canvas);
        screenTexture.minFilter = THREE.LinearFilter;
        screenTexture.magFilter = THREE.LinearFilter; // Better quality

        const screenMaterial = new THREE.MeshStandardMaterial({
            map: screenTexture,
            emissive: 0x111111,
            emissiveIntensity: 0.05,
            roughness: 0.3,
            metalness: 0.1
        });

        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.set(0, 4.5, 0.11);
        screen.userData = { isScreen: true }; // Tag for raycasting
        monitorGroup.add(screen);

        this.screenMesh = screen;
        this.screenTexture = screenTexture;
        this.screenCanvas = canvas;
        this.screenCtx = ctx;

        // Add screen to clickable objects
        this.clickableObjects.push(screen);

        monitorGroup.position.z = -0.5;
        this.scene.add(monitorGroup);
        this.monitor = monitorGroup;
    }

    updateOS(ctx) {
        // Incrémenter l'animation time (moins vite en mode low)
        const animSpeed = this.performanceMode === 'low' ? 0.005 : 0.01;
        this.desktopState.animTime += animSpeed;

        // Clear screen avec gradient moderne animé
        const gradient = ctx.createLinearGradient(0, 0, this.canvasWidth, this.canvasHeight);
        const hue1 = (Math.sin(this.desktopState.animTime * 0.1) * 10 + 245) / 360;
        const hue2 = (Math.sin(this.desktopState.animTime * 0.15 + 1) * 10 + 270) / 360;

        gradient.addColorStop(0, this.hslToRgb(hue1, 0.4, 0.1));
        gradient.addColorStop(0.5, this.hslToRgb(hue2, 0.35, 0.15));
        gradient.addColorStop(1, this.hslToRgb(hue1, 0.3, 0.12));
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

        // Wallpaper Pattern animé (simplifié pour mode low)
        if (this.performanceMode !== 'low') {
            // Hexagones animés (uniquement medium et high)
            ctx.strokeStyle = 'rgba(100, 100, 255, 0.1)';
            ctx.lineWidth = 2;
            const gridCols = Math.ceil(this.canvasWidth / 100);
            const gridRows = Math.ceil(this.canvasHeight / 100);
            const skipFactor = this.performanceMode === 'medium' ? 2 : 1; // Skip some in medium

            for (let i = 0; i < gridCols; i += skipFactor) {
                for (let j = 0; j < gridRows; j += skipFactor) {
                    const x = i * 100;
                    const y = j * 100;
                    const size = 40 + Math.sin((i + j) * 0.5 + this.desktopState.animTime) * 10;

                    // Hexagones avec glow
                    ctx.beginPath();
                    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 3) {
                        const hx = x + Math.cos(angle) * size;
                        const hy = y + Math.sin(angle) * size;
                        if (angle === 0) ctx.moveTo(hx, hy);
                        else ctx.lineTo(hx, hy);
                    }
                    ctx.closePath();
                    ctx.stroke();

                    // Points lumineux occasionnels animés
                    if ((i + j) % 7 === 0) {
                        const pulse = 0.2 + Math.sin(this.desktopState.animTime * 2 + i + j) * 0.15;
                        ctx.fillStyle = `rgba(0, 255, 255, ${pulse})`;
                        ctx.beginPath();
                        ctx.arc(x, y, 4, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
        } else {
            // Mode low: grille statique simple
            ctx.strokeStyle = 'rgba(100, 100, 255, 0.08)';
            ctx.lineWidth = 1;
            for (let i = 0; i < this.canvasWidth; i += 200) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, this.canvasHeight);
                ctx.stroke();
            }
            for (let j = 0; j < this.canvasHeight; j += 200) {
                ctx.beginPath();
                ctx.moveTo(0, j);
                ctx.lineTo(this.canvasWidth, j);
                ctx.stroke();
            }
        }

        // Vagues lumineuses animées (uniquement medium/high)
        if (this.performanceMode !== 'low') {
            ctx.strokeStyle = 'rgba(255, 0, 255, 0.15)';
            ctx.lineWidth = 3;
            const waveCount = this.performanceMode === 'medium' ? 3 : 5;
            for (let i = 0; i < waveCount; i++) {
                ctx.beginPath();
                for (let x = 0; x < this.canvasWidth; x += 10) {
                    const y = 200 + i * 250 + Math.sin(x * 0.01 + i + this.desktopState.animTime) * 50;
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }
        }

        // Particules flottantes (toujours afficher mais quantité réduite en low)
        this.drawFloatingParticles(ctx);

        // Draw Desktop Icons avec style moderne
        const iconSize = 110;
        // Scale factor pour adapter les positions à la résolution
        const scaleX = this.canvasWidth / 2560;
        const scaleY = this.canvasHeight / 1440;

        this.desktopState.icons.forEach(icon => {
            const iconX = icon.x * scaleX;
            const iconY = icon.y * scaleY;
            const scaledIconSize = iconSize * Math.min(scaleX, scaleY);

            const isHovered = this.isZoomed &&
                this.desktopState.mouseX >= iconX &&
                this.desktopState.mouseX <= iconX + scaledIconSize &&
                this.desktopState.mouseY >= iconY &&
                this.desktopState.mouseY <= iconY + scaledIconSize;

            // Shadow effect
            if (isHovered) {
                ctx.shadowColor = 'rgba(0, 255, 255, 0.5)';
                ctx.shadowBlur = 20;
            }

            // Icon Background avec glassmorphism
            const bgGradient = ctx.createLinearGradient(iconX, iconY, iconX + scaledIconSize, iconY + scaledIconSize);
            if (isHovered) {
                bgGradient.addColorStop(0, 'rgba(100, 200, 255, 0.3)');
                bgGradient.addColorStop(1, 'rgba(200, 100, 255, 0.3)');
            } else {
                bgGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
                bgGradient.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
            }
            ctx.fillStyle = bgGradient;

            // Rounded rectangle
            const radius = 12 * Math.min(scaleX, scaleY);
            ctx.beginPath();
            ctx.moveTo(iconX + radius, iconY);
            ctx.lineTo(iconX + scaledIconSize - radius, iconY);
            ctx.arcTo(iconX + scaledIconSize, iconY, iconX + scaledIconSize, iconY + radius, radius);
            ctx.lineTo(iconX + scaledIconSize, iconY + scaledIconSize - radius);
            ctx.arcTo(iconX + scaledIconSize, iconY + scaledIconSize, iconX + scaledIconSize - radius, iconY + scaledIconSize, radius);
            ctx.lineTo(iconX + radius, iconY + scaledIconSize);
            ctx.arcTo(iconX, iconY + scaledIconSize, iconX, iconY + scaledIconSize - radius, radius);
            ctx.lineTo(iconX, iconY + radius);
            ctx.arcTo(iconX, iconY, iconX + radius, iconY, radius);
            ctx.closePath();
            ctx.fill();

            // Border
            ctx.strokeStyle = isHovered ? 'rgba(0, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.shadowBlur = 0;

            // Emoji Icon avec effet 3D (tailles scalées)
            const emojiSize = 55 * Math.min(scaleX, scaleY);
            ctx.font = `${emojiSize}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Shadow pour l'emoji
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillText(icon.icon, iconX + scaledIconSize / 2 + 2, iconY + scaledIconSize * 0.45 + 2);

            // Emoji principal
            ctx.fillStyle = isHovered ? '#ffffff' : '#f0f0f0';
            ctx.fillText(icon.icon, iconX + scaledIconSize / 2, iconY + scaledIconSize * 0.45);

            // Label avec glow
            if (isHovered) {
                ctx.shadowColor = 'rgba(0, 255, 255, 0.8)';
                ctx.shadowBlur = 10;
            }
            ctx.fillStyle = '#ffffff';
            const labelSize = 16 * Math.min(scaleX, scaleY);
            ctx.font = `bold ${labelSize}px Arial`;
            ctx.fillText(icon.name, iconX + scaledIconSize / 2, iconY + scaledIconSize * 0.86);
            ctx.shadowBlur = 0;

            // Tooltip
            if (isHovered && icon.tooltip) {
                this.drawTooltip(ctx, icon.tooltip, this.desktopState.mouseX, this.desktopState.mouseY);
            }
        });

        // Draw Windows (skip minimized ones)
        this.windows.forEach(win => {
            if (!win.minimized) {
                this.drawWindow(ctx, win);
            }
        });

        // Draw Taskbar avec glassmorphism
        const taskbarY = this.canvasHeight - 70;
        const taskbarGradient = ctx.createLinearGradient(0, taskbarY, 0, this.canvasHeight);
        taskbarGradient.addColorStop(0, 'rgba(30, 30, 50, 0.95)');
        taskbarGradient.addColorStop(1, 'rgba(20, 20, 35, 0.98)');
        ctx.fillStyle = taskbarGradient;
        ctx.fillRect(0, taskbarY, this.canvasWidth, 70);

        // Top border avec effet lumineux
        const borderGradient = ctx.createLinearGradient(0, taskbarY, this.canvasWidth, taskbarY);
        borderGradient.addColorStop(0, 'rgba(255, 0, 255, 0.3)');
        borderGradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.3)');
        borderGradient.addColorStop(1, 'rgba(255, 0, 255, 0.3)');
        ctx.strokeStyle = borderGradient;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, taskbarY);
        ctx.lineTo(this.canvasWidth, taskbarY);
        ctx.stroke();

        // Start Button avec gradient RGB
        const startGradient = ctx.createLinearGradient(0, taskbarY, 80, this.canvasHeight);
        startGradient.addColorStop(0, '#00ffff');
        startGradient.addColorStop(0.5, '#00ccff');
        startGradient.addColorStop(1, '#0099ff');
        ctx.fillStyle = startGradient;
        ctx.fillRect(0, taskbarY, 80, 70);

        // Glow effect
        ctx.shadowColor = 'rgba(0, 255, 255, 0.5)';
        ctx.shadowBlur = 15;

        // Icon Windows
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 26px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('WIN', 40, taskbarY + 42);

        ctx.shadowBlur = 0;

        // Taskbar buttons avec style moderne
        let taskbarX = 90;
        this.windows.forEach((win, index) => {
            const isHovered = this.isZoomed &&
                this.desktopState.mouseX >= taskbarX &&
                this.desktopState.mouseX < taskbarX + 200 &&
                this.desktopState.mouseY >= taskbarY;

            // Button background avec gradient
            const btnY = taskbarY + 10;
            const btnH = 55;
            const btnGradient = ctx.createLinearGradient(taskbarX, btnY, taskbarX, btnY + btnH);
            if (isHovered) {
                btnGradient.addColorStop(0, 'rgba(100, 150, 255, 0.9)');
                btnGradient.addColorStop(1, 'rgba(150, 100, 255, 0.9)');
            } else if (win.minimized) {
                btnGradient.addColorStop(0, 'rgba(80, 80, 100, 0.7)');
                btnGradient.addColorStop(1, 'rgba(60, 60, 80, 0.7)');
            } else {
                btnGradient.addColorStop(0, 'rgba(0, 120, 212, 0.85)');
                btnGradient.addColorStop(1, 'rgba(0, 100, 180, 0.85)');
            }
            ctx.fillStyle = btnGradient;

            // Rounded corners
            const btnRadius = 8;
            ctx.beginPath();
            ctx.moveTo(taskbarX + btnRadius, btnY);
            ctx.lineTo(taskbarX + 200 - btnRadius, btnY);
            ctx.arcTo(taskbarX + 200, btnY, taskbarX + 200, btnY + btnRadius, btnRadius);
            ctx.lineTo(taskbarX + 200, btnY + btnH - btnRadius);
            ctx.arcTo(taskbarX + 200, btnY + btnH, taskbarX + 200 - btnRadius, btnY + btnH, btnRadius);
            ctx.lineTo(taskbarX + btnRadius, btnY + btnH);
            ctx.arcTo(taskbarX, btnY + btnH, taskbarX, btnY + btnH - btnRadius, btnRadius);
            ctx.lineTo(taskbarX, btnY + btnRadius);
            ctx.arcTo(taskbarX, btnY, taskbarX + btnRadius, btnY, btnRadius);
            ctx.closePath();
            ctx.fill();

            // Active indicator (barre en bas)
            if (!win.minimized) {
                ctx.fillStyle = '#00ffff';
                ctx.fillRect(taskbarX + 75, btnY + btnH - 3, 50, 3);
            }

            // Border avec effet glow si hover
            if (isHovered) {
                ctx.shadowColor = 'rgba(0, 255, 255, 0.6)';
                ctx.shadowBlur = 10;
            }
            ctx.strokeStyle = isHovered ? 'rgba(0, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Window title
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'left';
            const shortTitle = win.title.length > 22 ? win.title.substring(0, 19) + '...' : win.title;
            ctx.fillText(shortTitle, taskbarX + 8, taskbarY + 42);

            taskbarX += 210;
        });

        // Clock
        const now = new Date();
        const timeStr = now.toLocaleTimeString();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(timeStr, this.canvasWidth - 20, taskbarY + 42);

        // Virtual Cursor (if zoomed)
        if (this.isZoomed) {
            const mx = this.desktopState.mouseX;
            const my = this.desktopState.mouseY;
            const clickable = this.isClickableAt(mx, my);
            ctx.save();
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#222222';
            ctx.lineWidth = 2;
            if (clickable) {
                // Curseur main (pointeur)
                ctx.beginPath();
                // Doigt index
                ctx.moveTo(mx + 8, my);
                ctx.lineTo(mx + 8, my + 18);
                // Doigts repliés (corps main)
                ctx.lineTo(mx + 2, my + 18);
                ctx.lineTo(mx + 2, my + 30);
                ctx.lineTo(mx + 22, my + 30);
                ctx.lineTo(mx + 22, my + 18);
                ctx.lineTo(mx + 16, my + 18);
                ctx.lineTo(mx + 16, my);
                ctx.closePath();
                ctx.fill(); ctx.stroke();
            } else {
                // Curseur flèche
                ctx.beginPath();
                ctx.moveTo(mx, my);
                ctx.lineTo(mx + 18, my + 18);
                ctx.lineTo(mx + 7, my + 18);
                ctx.lineTo(mx + 3, my + 26);
                ctx.lineTo(mx, my + 19);
                ctx.closePath();
                ctx.fill(); ctx.stroke();
            }
            ctx.restore();
        }

        // Render start menu and dropdowns on top
        if (this.desktopState.startMenuOpen) this.renderStartMenu(ctx);
        if (this.desktopState.openMenu) this.renderDropdownMenu(ctx);

        if (this.screenTexture) this.screenTexture.needsUpdate = true;
    }

    drawWindow(ctx, win) {
        // Animation de scale et opacity
        if (win.isAnimating) {
            ctx.save();
            ctx.globalAlpha = win.animOpacity;

            // Transform origin au centre de la fenêtre
            const centerX = win.x + win.w / 2;
            const centerY = win.y + win.h / 2;
            ctx.translate(centerX, centerY);
            ctx.scale(win.animScale, win.animScale);
            ctx.translate(-centerX, -centerY);
        }

        // Window Shadow (plus prononcée)
        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        ctx.shadowBlur = 35;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 10;

        // Window Body avec effet glassmorphism
        // Bordure arrondie
        const radius = 12;
        ctx.beginPath();
        ctx.moveTo(win.x + radius, win.y);
        ctx.lineTo(win.x + win.w - radius, win.y);
        ctx.arcTo(win.x + win.w, win.y, win.x + win.w, win.y + radius, radius);
        ctx.lineTo(win.x + win.w, win.y + win.h - radius);
        ctx.arcTo(win.x + win.w, win.y + win.h, win.x + win.w - radius, win.y + win.h, radius);
        ctx.lineTo(win.x + radius, win.y + win.h);
        ctx.arcTo(win.x, win.y + win.h, win.x, win.y + win.h - radius, radius);
        ctx.lineTo(win.x, win.y + radius);
        ctx.arcTo(win.x, win.y, win.x + radius, win.y, radius);
        ctx.closePath();

        ctx.fillStyle = 'rgba(242, 243, 248, 0.99)';
        ctx.fill();

        // Bordure subtile
        ctx.strokeStyle = 'rgba(0, 120, 212, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Title Bar avec gradient moderne
        const titleGradient = ctx.createLinearGradient(win.x, win.y, win.x + win.w, win.y);
        titleGradient.addColorStop(0, '#667eea');
        titleGradient.addColorStop(0.5, '#764ba2');
        titleGradient.addColorStop(1, '#f093fb');
        ctx.fillStyle = titleGradient;

        // Rounded top corners
        ctx.beginPath();
        ctx.moveTo(win.x + radius, win.y);
        ctx.lineTo(win.x + win.w - radius, win.y);
        ctx.arcTo(win.x + win.w, win.y, win.x + win.w, win.y + radius, radius);
        ctx.lineTo(win.x + win.w, win.y + 50);
        ctx.lineTo(win.x, win.y + 50);
        ctx.lineTo(win.x, win.y + radius);
        ctx.arcTo(win.x, win.y, win.x + radius, win.y, radius);
        ctx.closePath();
        ctx.fill();

        // Title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(win.title, win.x + 20, win.y + 32);

        // Window Controls avec hover effect moderne
        const buttons = [
            { x: win.x + win.w - 150, icon: '−', color: 'rgba(255, 255, 255, 0.2)', hoverColor: 'rgba(255, 255, 255, 0.3)' },
            { x: win.x + win.w - 100, icon: '□', color: 'rgba(255, 255, 255, 0.2)', hoverColor: 'rgba(255, 255, 255, 0.3)' },
            { x: win.x + win.w - 50, icon: '✕', color: 'rgba(232, 17, 35, 0.8)', hoverColor: 'rgba(232, 17, 35, 1)' }
        ];

        buttons.forEach((btn, index) => {
            const isHovered = this.isZoomed &&
                this.desktopState.mouseX >= btn.x &&
                this.desktopState.mouseX < btn.x + 50 &&
                this.desktopState.mouseY >= win.y &&
                this.desktopState.mouseY < win.y + 50;

            // Background avec hover
            ctx.fillStyle = isHovered ? btn.hoverColor : btn.color;

            // Rounded pour le bouton close
            if (index === 2) {
                ctx.beginPath();
                ctx.moveTo(btn.x, win.y);
                ctx.lineTo(btn.x + 50 - radius, win.y);
                ctx.arcTo(btn.x + 50, win.y, btn.x + 50, win.y + radius, radius);
                ctx.lineTo(btn.x + 50, win.y + 50);
                ctx.lineTo(btn.x, win.y + 50);
                ctx.closePath();
                ctx.fill();
            } else {
                ctx.fillRect(btn.x, win.y, 50, 50);
            }

            // Icon
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';

            // Effet de scale au hover
            if (isHovered) {
                ctx.font = 'bold 26px Arial';
            }

            ctx.fillText(btn.icon, btn.x + 25, win.y + 34);
        });

        // Menu bar moderne avec gradient subtil
        const menuGradient = ctx.createLinearGradient(win.x, win.y + 50, win.x, win.y + 95);
        menuGradient.addColorStop(0, '#f8f9fa');
        menuGradient.addColorStop(1, '#e9ecef');
        ctx.fillStyle = menuGradient;
        ctx.fillRect(win.x, win.y + 50, win.w, 45);

        // Separator line
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(win.x, win.y + 50);
        ctx.lineTo(win.x + win.w, win.y + 50);
        ctx.stroke();

        // Menu items avec hover
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'left';
        const menuItems = ['Fichier', 'Édition', 'Affichage', 'Insertion'];
        let menuX = win.x + 15;

        menuItems.forEach(item => {
            const itemWidth = 100;
            const isHovered = this.isZoomed &&
                this.desktopState.mouseX >= menuX &&
                this.desktopState.mouseX < menuX + itemWidth &&
                this.desktopState.mouseY >= win.y + 50 &&
                this.desktopState.mouseY < win.y + 95;

            // Hover background
            if (isHovered) {
                ctx.fillStyle = 'rgba(0, 120, 212, 0.15)';
                ctx.fillRect(menuX - 5, win.y + 55, itemWidth - 10, 35);
            }

            // Text
            ctx.fillStyle = isHovered ? '#0078d4' : '#333333';
            ctx.fillText(item, menuX, win.y + 78);
            menuX += itemWidth;
        });

        // Content Area with scroll
        ctx.save();
        ctx.beginPath();
        ctx.rect(win.x + 15, win.y + 105, win.w - 30, win.h - 115);
        ctx.clip();

        // Check if this is an image viewer window
        if (win.isImageViewer && win.viewerImage) {
            // Center the image in the window
            const centerX = win.x + win.w / 2;
            const centerY = win.y + 105 + (win.h - 115) / 2;
            const imgX = centerX - win.viewerImageWidth / 2;
            const imgY = centerY - win.viewerImageHeight / 2;

            // Draw black background
            ctx.fillStyle = '#000000';
            ctx.fillRect(win.x + 15, win.y + 105, win.w - 30, win.h - 115);

            // Draw the enlarged image
            ctx.drawImage(win.viewerImage, imgX, imgY, win.viewerImageWidth, win.viewerImageHeight);

            ctx.restore();

            if (win.isAnimating) {
                ctx.restore();
            }

            return;
        }

        // Render project content (polices plus grandes)
        const project = this.projects[win.id];
        if (project && project.sections) {
            // Apply scroll offset
            const scrollOffset = win.scrollOffset || 0;
            const contentStartY = win.y + 140;
            let yPos = contentStartY - scrollOffset;
            const leftMargin = win.x + 50;
            const contentWidth = win.w - 100;

            // Reset clickable image zones every render
            win.clickableImages = [];

            project.sections.forEach(section => {
                ctx.textAlign = 'left';

                switch (section.type) {
                    case 'title':
                        ctx.fillStyle = '#111827';
                        ctx.font = 'bold 48px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif';
                        ctx.fillText(section.text, leftMargin, yPos);
                        yPos += 72;
                        break;

                    case 'subtitle':
                        ctx.fillStyle = '#4b5563';
                        ctx.font = 'italic 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif';
                        ctx.fillText(section.text, leftMargin, yPos);
                        yPos += 52;
                        break;

                    case 'heading': {
                        // Background pill for heading
                        const hMetrics = ctx.measureText(section.text);
                        ctx.font = 'bold 30px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif';
                        const hW = ctx.measureText(section.text).width + 32;
                        ctx.fillStyle = '#eff6ff';
                        ctx.beginPath(); ctx.roundRect(leftMargin - 8, yPos - 26, hW, 42, 8); ctx.fill();
                        ctx.fillStyle = '#1d4ed8';
                        ctx.fillText(section.text, leftMargin, yPos);
                        yPos += 60;
                        break;
                    }

                    case 'text':
                        if (section.text === '') { yPos += 18; break; }
                        ctx.fillStyle = '#374151';
                        ctx.font = '24px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif';
                        // Simple word-wrap
                        const maxW = win.w - 80;
                        const words = section.text.split(' ');
                        let line = '';
                        for (const word of words) {
                            const test = line ? line + ' ' + word : word;
                            if (ctx.measureText(test).width > maxW && line) {
                                ctx.fillText(line, leftMargin, yPos);
                                yPos += 34;
                                line = word;
                            } else { line = test; }
                        }
                        if (line) { ctx.fillText(line, leftMargin, yPos); yPos += 34; }
                        break;

                    case 'e5-row': {
                        const rowH = 70;
                        const rowW = win.w - 55;
                        // Background alterné
                        ctx.fillStyle = yPos % 2 === 0 ? '#f9fafb' : '#ffffff';
                        ctx.fillRect(leftMargin, yPos - 4, rowW, rowH);
                        ctx.strokeStyle = '#e5e7eb';
                        ctx.lineWidth = 1;
                        ctx.strokeRect(leftMargin, yPos - 4, rowW, rowH);
                        // Label
                        ctx.fillStyle = '#111827';
                        ctx.font = 'bold 22px Arial';
                        ctx.textAlign = 'left';
                        let lbl = section.label || '';
                        while (ctx.measureText(lbl).width > rowW * 0.6 && lbl.length > 10)
                            lbl = lbl.slice(0, -4) + '…';
                        ctx.fillText(lbl, leftMargin + 12, yPos + 22);
                        // Period
                        ctx.fillStyle = '#6b7280';
                        ctx.font = '18px Arial';
                        ctx.fillText(section.period || '', leftMargin + 12, yPos + 48);
                        // Tags
                        let tx = leftMargin + rowW * 0.62;
                        for (const tag of (section.tags || [])) {
                            const tw = ctx.measureText(tag).width + 20;
                            ctx.fillStyle = '#dbeafe';
                            ctx.beginPath(); ctx.roundRect(tx, yPos + 8, tw, 26, 6); ctx.fill();
                            ctx.fillStyle = '#1e40af';
                            ctx.font = 'bold 15px Arial';
                            ctx.textAlign = 'center';
                            ctx.fillText(tag, tx + tw / 2, yPos + 26);
                            ctx.textAlign = 'left';
                            tx += tw + 8;
                        }
                        yPos += rowH + 4;
                        break;
                    }

                    case 'image':
                        // Try to load and display real image if src is provided
                        if (section.src && this.imageCache[section.src] && this.imageCache[section.src] !== 'error') {
                            // Draw the loaded image
                            const img = this.imageCache[section.src];
                            try {
                                ctx.drawImage(img, leftMargin, yPos, section.width, section.height);

                                // Store clickable zone for this image
                                win.clickableImages.push({
                                    x: leftMargin,
                                    y: yPos,
                                    w: section.width,
                                    h: section.height,
                                    src: section.src,
                                    img: img
                                });

                                // Border around image + hover effect
                                ctx.strokeStyle = '#4488ff';
                                ctx.lineWidth = 3;
                                ctx.strokeRect(leftMargin, yPos, section.width, section.height);

                                // Add "click to enlarge" icon
                                ctx.fillStyle = 'rgba(68, 136, 255, 0.8)';
                                ctx.fillRect(leftMargin + section.width - 35, yPos + 5, 30, 30);
                                ctx.font = '20px Arial';
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign = 'center';
                                ctx.fillText('🔍', leftMargin + section.width - 20, yPos + 26);
                            } catch (e) {
                                // CORS error - draw placeholder instead
                                console.warn('CORS error drawing image:', section.src);
                                this.imageCache[section.src] = 'error'; // Mark as error to avoid retrying
                            }
                        } else if (section.src && !this.imageCache[section.src]) {
                            // Image not loaded yet, try to load it
                            const img = new Image();
                            img.crossOrigin = 'anonymous'; // Try to avoid CORS issues
                            img.onload = () => {
                                this.imageCache[section.src] = img;
                                this.updateOS(this.screenCtx); // Redraw when image loads
                            };
                            img.onerror = () => {
                                console.warn('Failed to load image:', section.src);
                                this.imageCache[section.src] = 'error'; // Mark as error
                            };
                            img.src = section.src;

                            // Show placeholder while loading
                            ctx.fillStyle = '#e0e0e0';
                            ctx.fillRect(leftMargin, yPos, section.width, section.height);
                            ctx.strokeStyle = '#999999';
                            ctx.lineWidth = 3;
                            ctx.strokeRect(leftMargin, yPos, section.width, section.height);

                            // Loading icon
                            ctx.fillStyle = '#999999';
                            ctx.font = '50px Arial';
                            ctx.textAlign = 'center';
                            ctx.fillText('⏳', leftMargin + section.width / 2, yPos + section.height / 2 + 18);
                        } else {
                            // No src provided, show placeholder
                            ctx.fillStyle = '#e0e0e0';
                            ctx.fillRect(leftMargin, yPos, section.width, section.height);
                            ctx.strokeStyle = '#999999';
                            ctx.lineWidth = 3;
                            ctx.strokeRect(leftMargin, yPos, section.width, section.height);

                            // Image icon
                            ctx.fillStyle = '#999999';
                            ctx.font = '50px Arial';
                            ctx.textAlign = 'center';
                            ctx.fillText('🖼️', leftMargin + section.width / 2, yPos + section.height / 2 + 18);
                        }

                        // Label
                        ctx.font = 'bold 16px Arial';
                        ctx.fillStyle = '#666666';
                        ctx.textAlign = 'center';
                        ctx.fillText(section.label, leftMargin + section.width / 2, yPos + section.height + 25);
                        yPos += section.height + 45;
                        break;

                    case 'mtconges-demo': {
                        const dBtnW = Math.min(360, win.w - 100);
                        const dBtnH = 54;
                        ctx.fillStyle = '#7c3aed';
                        ctx.beginPath(); ctx.roundRect(leftMargin, yPos, dBtnW, dBtnH, 10); ctx.fill();
                        ctx.fillStyle = '#ffffff'; ctx.font = 'bold 17px Arial'; ctx.textAlign = 'center';
                        ctx.fillText('🖥️  Lancer la simulation interactive', leftMargin + dBtnW / 2, yPos + 34);
                        ctx.textAlign = 'left';
                        win.mtcDemoBtn = { x: leftMargin, y: yPos, w: dBtnW, h: dBtnH };
                        yPos += dBtnH + 24;
                        break;
                    }

                    case 'mtconges-ui': {
                        if (!win.mtc) win.mtc = {
                            screen: 'login', currentUser: null, activeTab: 0,
                            conges: [
                                { id: 1, employe: 'Mathis Quelen', login: 'mqu', duree: 3, debut: '01/05/2025', etat: 'En attente', motif: 'Congés personnels' },
                                { id: 2, employe: 'Paul Blanc',    login: 'bpa', duree: 5, debut: '15/04/2025', etat: 'Approuvé',   motif: 'Vacances printemps' },
                                { id: 3, employe: 'Paul Blanc',    login: 'bpa', duree: 2, debut: '30/03/2025', etat: 'Refusé',     motif: 'Formation externe' },
                                { id: 4, employe: 'Mathis Quelen', login: 'mqu', duree: 7, debut: '20/06/2025', etat: 'En attente', motif: 'Vacances été' },
                            ],
                        };
                        win.mtcClickZones = [];
                        const mtc = win.mtc;
                        const mx = win.x + 15; const mw = win.w - 30;
                        const my = win.y + 115; const mh = win.h - 125;
                        ctx.save();
                        ctx.beginPath(); ctx.rect(mx, my, mw, mh); ctx.clip();

                        if (mtc.screen === 'login') {
                            ctx.fillStyle = '#ffe6f0';
                            ctx.fillRect(mx, my, mw, mh);
                            const cardW = Math.min(480, mw * 0.7);
                            const cardH = 390;
                            const cardX = mx + (mw - cardW) / 2;
                            const cardY = my + (mh - cardH) / 2;
                            ctx.fillStyle = '#ffffff';
                            ctx.shadowColor = 'rgba(124,58,237,0.15)'; ctx.shadowBlur = 24;
                            ctx.beginPath(); ctx.roundRect(cardX, cardY, cardW, cardH, 14); ctx.fill();
                            ctx.shadowBlur = 0;
                            ctx.fillStyle = '#7c3aed'; ctx.font = 'bold 18px Arial'; ctx.textAlign = 'center';
                            ctx.fillText('Système de Gestion des Congés', cardX + cardW / 2, cardY + 44);
                            ctx.fillStyle = '#9ca3af'; ctx.font = '12px Arial';
                            ctx.fillText('Choisir un compte pour continuer', cardX + cardW / 2, cardY + 66);
                            ctx.strokeStyle = '#f3e8ff'; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(cardX + 20, cardY + 82); ctx.lineTo(cardX + cardW - 20, cardY + 82); ctx.stroke();
                            const USERS = [
                                { nom: 'ALLIX Virgile',   login: 'VAL', role: 'Super-Administrateur', color: '#ef4444', screen: 'admin',       conges: 30 },
                                { nom: 'Marsac Camille',  login: 'cma', role: 'Responsable',           color: '#f59e0b', screen: 'responsable', conges: 30 },
                                { nom: 'Quelen Mathis',   login: 'mqu', role: 'Employé',               color: '#3b82f6', screen: 'employe',     conges: 29 },
                                { nom: 'Blanc Paul',      login: 'bpa', role: 'Employé',               color: '#22c55e', screen: 'employe2',    conges: 28 },
                            ];
                            const ucH = 58; const gap = 6; let uy = cardY + 98;
                            for (const u of USERS) {
                                ctx.fillStyle = '#f9fafb'; ctx.strokeStyle = '#ede9fe'; ctx.lineWidth = 1;
                                ctx.beginPath(); ctx.roundRect(cardX + 16, uy, cardW - 32, ucH, 8); ctx.fill(); ctx.stroke();
                                ctx.fillStyle = u.color;
                                ctx.beginPath(); ctx.arc(cardX + 16 + 27, uy + ucH / 2, 17, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = '#fff'; ctx.font = 'bold 11px Arial'; ctx.textAlign = 'center';
                                ctx.fillText(u.login.toUpperCase(), cardX + 16 + 27, uy + ucH / 2 + 4);
                                ctx.fillStyle = '#111827'; ctx.font = 'bold 13px Arial'; ctx.textAlign = 'left';
                                ctx.fillText(u.nom, cardX + 56, uy + ucH / 2 - 4);
                                ctx.fillStyle = '#6b7280'; ctx.font = '12px Arial';
                                ctx.fillText(u.role, cardX + 56, uy + ucH / 2 + 13);
                                ctx.fillStyle = '#c4b5fd'; ctx.font = 'bold 20px Arial'; ctx.textAlign = 'right';
                                ctx.fillText('›', cardX + cardW - 22, uy + ucH / 2 + 7);
                                win.mtcClickZones.push({ x: cardX + 16, y: uy, w: cardW - 32, h: ucH, action: 'login', user: u });
                                uy += ucH + gap;
                            }
                        } else {
                            const cu = mtc.currentUser;
                            ctx.fillStyle = '#7c3aed'; ctx.fillRect(mx, my, mw, 52);
                            ctx.fillStyle = '#fff'; ctx.font = 'bold 15px Arial'; ctx.textAlign = 'left';
                            ctx.fillText('🗓  MT-Congés', mx + 16, my + 32);
                            ctx.fillStyle = '#ede9fe';
                            ctx.beginPath(); ctx.roundRect(mx + mw - 200, my + 12, 188, 28, 14); ctx.fill();
                            ctx.fillStyle = '#5b21b6'; ctx.font = 'bold 11px Arial'; ctx.textAlign = 'center';
                            ctx.fillText(`${cu.login.toUpperCase()} · ${cu.role}`, mx + mw - 106, my + 31);
                            ctx.fillStyle = '#e9d5ff'; ctx.font = '11px Arial'; ctx.textAlign = 'right';
                            ctx.fillText('[ Déconnexion ]', mx + mw - 8, my + 50);
                            win.mtcClickZones.push({ x: mx + mw - 130, y: my + 38, w: 125, h: 16, action: 'logout' });

                            const contentY = my + 52; const contentH = mh - 52;
                            ctx.fillStyle = '#f5f3ff'; ctx.fillRect(mx, contentY, mw, contentH);
                            let tabs = [];
                            if (mtc.screen === 'admin') tabs = ['👥 Utilisateurs', '📁 Projets', '📊 Stats'];
                            else if (mtc.screen === 'responsable') tabs = ['⏳ En attente', '📋 Toutes', '👤 Profil'];
                            else tabs = ['📅 Mes Congés', '➕ Nouvelle Demande', '🔔 Notifs'];
                            const tabH = 40; const tabW = mw / tabs.length;
                            ctx.fillStyle = '#ede9fe'; ctx.fillRect(mx, contentY, mw, tabH);
                            tabs.forEach((tab, i) => {
                                const tx = mx + i * tabW;
                                if (i === mtc.activeTab) { ctx.fillStyle = '#7c3aed'; ctx.fillRect(tx, contentY, tabW, tabH); }
                                ctx.fillStyle = i === mtc.activeTab ? '#fff' : '#5b21b6';
                                ctx.font = i === mtc.activeTab ? 'bold 12px Arial' : '12px Arial';
                                ctx.textAlign = 'center';
                                ctx.fillText(tab, tx + tabW / 2, contentY + 26);
                                if (i > 0) {
                                    ctx.strokeStyle = '#c4b5fd'; ctx.lineWidth = 1;
                                    ctx.beginPath(); ctx.moveTo(tx, contentY + 6); ctx.lineTo(tx, contentY + tabH - 6); ctx.stroke();
                                }
                                win.mtcClickZones.push({ x: tx, y: contentY, w: tabW, h: tabH, action: 'tab', tab: i });
                            });

                            const bodyY = contentY + tabH; const bodyH = contentH - tabH;
                            ctx.fillStyle = '#ffffff'; ctx.fillRect(mx, bodyY, mw, bodyH);

                            if (mtc.screen === 'admin') {
                                if (mtc.activeTab === 0) {
                                    const admUsers = [
                                        { login: 'VAL', nom: 'ALLIX Virgile',  role: 'Super-Admin', conges: '30/30', email: 'virgile@test.test' },
                                        { login: 'cma', nom: 'Marsac Camille', role: 'Responsable',  conges: '30/30', email: 'camille@test.test' },
                                        { login: 'mqu', nom: 'Quelen Mathis',  role: 'Employé',      conges: '29/30', email: 'mathis@test.test' },
                                        { login: 'bpa', nom: 'Blanc Paul',     role: 'Employé',      conges: '28/30', email: 'paul.blanc@test.test' },
                                    ];
                                    const cols5 = ['Login', 'Nom', 'Rôle', 'Congés', 'Email'];
                                    const cW5 = mw / cols5.length;
                                    ctx.fillStyle = '#f5f3ff'; ctx.fillRect(mx, bodyY, mw, 34);
                                    cols5.forEach((col, ci) => {
                                        ctx.fillStyle = '#5b21b6'; ctx.font = 'bold 12px Arial'; ctx.textAlign = 'center';
                                        ctx.fillText(col, mx + ci * cW5 + cW5 / 2, bodyY + 22);
                                    });
                                    admUsers.forEach((u, ri) => {
                                        const ry = bodyY + 34 + ri * 36;
                                        ctx.fillStyle = ri % 2 === 0 ? '#faf5ff' : '#fff'; ctx.fillRect(mx, ry, mw, 36);
                                        ctx.strokeStyle = '#ede9fe'; ctx.lineWidth = 0.5; ctx.strokeRect(mx, ry, mw, 36);
                                        [u.login, u.nom, u.role, u.conges, u.email].forEach((v, ci) => {
                                            ctx.fillStyle = '#374151'; ctx.font = '12px Arial'; ctx.textAlign = 'center';
                                            ctx.fillText(v, mx + ci * cW5 + cW5 / 2, ry + 23);
                                        });
                                    });
                                } else if (mtc.activeTab === 1) {
                                    const projs = [{ id: '1', nom: 'CNP', membres: '2', resp: 'Marsac Camille' }, { id: '2', nom: 'Cyber', membres: '0', resp: 'N/A' }];
                                    const cols4 = ['ID', 'Projet', 'Membres', 'Responsable'];
                                    const cW4 = mw / cols4.length;
                                    ctx.fillStyle = '#f5f3ff'; ctx.fillRect(mx, bodyY, mw, 34);
                                    cols4.forEach((col, ci) => {
                                        ctx.fillStyle = '#5b21b6'; ctx.font = 'bold 12px Arial'; ctx.textAlign = 'center';
                                        ctx.fillText(col, mx + ci * cW4 + cW4 / 2, bodyY + 22);
                                    });
                                    projs.forEach((p, ri) => {
                                        const ry = bodyY + 34 + ri * 36;
                                        ctx.fillStyle = ri % 2 === 0 ? '#faf5ff' : '#fff'; ctx.fillRect(mx, ry, mw, 36);
                                        ctx.strokeStyle = '#ede9fe'; ctx.lineWidth = 0.5; ctx.strokeRect(mx, ry, mw, 36);
                                        [p.id, p.nom, p.membres, p.resp].forEach((v, ci) => {
                                            ctx.fillStyle = '#374151'; ctx.font = '12px Arial'; ctx.textAlign = 'center';
                                            ctx.fillText(v, mx + ci * cW4 + cW4 / 2, ry + 23);
                                        });
                                    });
                                } else {
                                    const stats = [['Total utilisateurs','4'],['Demandes en cours','2'],['Demandes approuvées','1'],['Demandes refusées','1'],['Congés moyens restants','29.3 j']];
                                    ctx.fillStyle = '#374151'; ctx.font = 'bold 15px Arial'; ctx.textAlign = 'center';
                                    ctx.fillText('Statistiques du système', mx + mw / 2, bodyY + 35);
                                    stats.forEach(([label, val], si) => {
                                        const sy = bodyY + 55 + si * 42;
                                        ctx.fillStyle = si % 2 === 0 ? '#faf5ff' : '#fff'; ctx.fillRect(mx + 20, sy, mw - 40, 38);
                                        ctx.strokeStyle = '#ede9fe'; ctx.lineWidth = 0.5; ctx.strokeRect(mx + 20, sy, mw - 40, 38);
                                        ctx.fillStyle = '#374151'; ctx.font = '13px Arial'; ctx.textAlign = 'left';
                                        ctx.fillText(label, mx + 36, sy + 25);
                                        ctx.fillStyle = '#7c3aed'; ctx.font = 'bold 15px Arial'; ctx.textAlign = 'right';
                                        ctx.fillText(val, mx + mw - 36, sy + 25);
                                    });
                                }
                            } else if (mtc.screen === 'responsable') {
                                const pending = mtc.conges.filter(c => c.etat === 'En attente');
                                const list = mtc.activeTab === 1 ? mtc.conges : mtc.activeTab === 0 ? pending : [];
                                if (mtc.activeTab === 2) {
                                    ctx.fillStyle = '#374151'; ctx.font = 'bold 15px Arial'; ctx.textAlign = 'center';
                                    ctx.fillText('Profil — Marsac Camille', mx + mw / 2, bodyY + 35);
                                    [['Login','cma'],['Nom','Marsac Camille'],['Rôle','Responsable'],['Email','camille@test.test'],['Congés restants','30 / 30']].forEach(([lbl, val], ii) => {
                                        const iy = bodyY + 60 + ii * 36;
                                        ctx.fillStyle = '#6b7280'; ctx.font = '12px Arial'; ctx.textAlign = 'left'; ctx.fillText(lbl, mx + 40, iy + 14);
                                        ctx.fillStyle = '#111827'; ctx.font = 'bold 13px Arial'; ctx.fillText(val, mx + mw * 0.38, iy + 14);
                                    });
                                } else {
                                    const cW4r = mw / 4;
                                    ctx.fillStyle = '#f5f3ff'; ctx.fillRect(mx, bodyY, mw, 34);
                                    ['Employé', 'Dates', 'Durée', mtc.activeTab === 0 ? 'Action' : 'État'].forEach((col, ci) => {
                                        ctx.fillStyle = '#5b21b6'; ctx.font = 'bold 12px Arial'; ctx.textAlign = 'center';
                                        ctx.fillText(col, mx + ci * cW4r + cW4r / 2, bodyY + 22);
                                    });
                                    list.forEach((c, ri) => {
                                        const ry = bodyY + 34 + ri * 46;
                                        ctx.fillStyle = ri % 2 === 0 ? '#faf5ff' : '#fff'; ctx.fillRect(mx, ry, mw, 46);
                                        ctx.strokeStyle = '#ede9fe'; ctx.lineWidth = 0.5; ctx.strokeRect(mx, ry, mw, 46);
                                        ctx.fillStyle = '#374151'; ctx.font = '12px Arial'; ctx.textAlign = 'center';
                                        ctx.fillText(c.employe, mx + cW4r / 2, ry + 16);
                                        ctx.fillText(`du ${c.debut}`, mx + cW4r + cW4r / 2, ry + 16);
                                        ctx.fillText(`${c.duree}j`, mx + cW4r * 2 + cW4r / 2, ry + 16);
                                        ctx.fillStyle = '#6b7280'; ctx.font = '11px Arial';
                                        ctx.fillText(c.motif, mx + cW4r / 2, ry + 33);
                                        if (mtc.activeTab === 0) {
                                            ctx.fillStyle = '#22c55e';
                                            ctx.beginPath(); ctx.roundRect(mx + cW4r * 3 + 8, ry + 8, 56, 26, 6); ctx.fill();
                                            ctx.fillStyle = '#fff'; ctx.font = 'bold 11px Arial'; ctx.textAlign = 'center';
                                            ctx.fillText('✓ OK', mx + cW4r * 3 + 36, ry + 26);
                                            win.mtcClickZones.push({ x: mx + cW4r * 3 + 8, y: ry + 8, w: 56, h: 26, action: 'approve', congeId: c.id });
                                            ctx.fillStyle = '#ef4444';
                                            ctx.beginPath(); ctx.roundRect(mx + cW4r * 3 + 70, ry + 8, 56, 26, 6); ctx.fill();
                                            ctx.fillStyle = '#fff';
                                            ctx.fillText('✗ Non', mx + cW4r * 3 + 98, ry + 26);
                                            win.mtcClickZones.push({ x: mx + cW4r * 3 + 70, y: ry + 8, w: 56, h: 26, action: 'reject', congeId: c.id });
                                        } else {
                                            const ec = c.etat === 'Approuvé' ? '#22c55e' : c.etat === 'Refusé' ? '#ef4444' : '#f59e0b';
                                            ctx.fillStyle = ec;
                                            ctx.beginPath(); ctx.roundRect(mx + cW4r * 3 + 16, ry + 12, cW4r - 32, 22, 6); ctx.fill();
                                            ctx.fillStyle = '#fff'; ctx.font = 'bold 11px Arial'; ctx.textAlign = 'center';
                                            ctx.fillText(c.etat, mx + cW4r * 3 + 16 + (cW4r - 32) / 2, ry + 28);
                                        }
                                    });
                                    if (list.length === 0) {
                                        ctx.fillStyle = '#9ca3af'; ctx.font = 'italic 14px Arial'; ctx.textAlign = 'center';
                                        ctx.fillText('Aucune demande en attente', mx + mw / 2, bodyY + 70);
                                    }
                                }
                            } else {
                                const myLogin = mtc.screen === 'employe' ? 'mqu' : 'bpa';
                                const myName = myLogin === 'mqu' ? 'Quelen Mathis' : 'Blanc Paul';
                                const myConges = mtc.conges.filter(c => c.login === myLogin);
                                if (mtc.activeTab === 0) {
                                    const cW3 = mw / 3;
                                    ctx.fillStyle = '#f5f3ff'; ctx.fillRect(mx, bodyY, mw, 34);
                                    ['Dates', 'Durée — Motif', 'État'].forEach((col, ci) => {
                                        ctx.fillStyle = '#5b21b6'; ctx.font = 'bold 12px Arial'; ctx.textAlign = 'center';
                                        ctx.fillText(col, mx + ci * cW3 + cW3 / 2, bodyY + 22);
                                    });
                                    myConges.forEach((c, ri) => {
                                        const ry = bodyY + 34 + ri * 46;
                                        ctx.fillStyle = ri % 2 === 0 ? '#faf5ff' : '#fff'; ctx.fillRect(mx, ry, mw, 46);
                                        ctx.strokeStyle = '#ede9fe'; ctx.lineWidth = 0.5; ctx.strokeRect(mx, ry, mw, 46);
                                        ctx.fillStyle = '#374151'; ctx.font = '12px Arial'; ctx.textAlign = 'center';
                                        ctx.fillText(`Du ${c.debut}`, mx + cW3 / 2, ry + 16);
                                        ctx.fillText(`${c.duree} jour(s)`, mx + cW3 + cW3 / 2, ry + 16);
                                        ctx.fillStyle = '#6b7280'; ctx.font = '11px Arial';
                                        ctx.fillText(c.motif, mx + cW3 + cW3 / 2, ry + 32);
                                        const ec = c.etat === 'Approuvé' ? '#22c55e' : c.etat === 'Refusé' ? '#ef4444' : '#f59e0b';
                                        ctx.fillStyle = ec;
                                        ctx.beginPath(); ctx.roundRect(mx + cW3 * 2 + 16, ry + 12, cW3 - 32, 22, 6); ctx.fill();
                                        ctx.fillStyle = '#fff'; ctx.font = 'bold 11px Arial'; ctx.textAlign = 'center';
                                        ctx.fillText(c.etat, mx + cW3 * 2 + 16 + (cW3 - 32) / 2, ry + 28);
                                    });
                                    if (myConges.length === 0) {
                                        ctx.fillStyle = '#9ca3af'; ctx.font = 'italic 14px Arial'; ctx.textAlign = 'center';
                                        ctx.fillText('Aucune demande', mx + mw / 2, bodyY + 70);
                                    }
                                } else if (mtc.activeTab === 1) {
                                    ctx.fillStyle = '#374151'; ctx.font = 'bold 15px Arial'; ctx.textAlign = 'center';
                                    ctx.fillText('Nouvelle demande de congé', mx + mw / 2, bodyY + 35);
                                    [{ label: 'Date de début', val: '01/06/2025' }, { label: 'Durée (jours)', val: '5' }, { label: 'Motif', val: 'Congés personnels' }].forEach((f, fi) => {
                                        const fy = bodyY + 58 + fi * 60;
                                        ctx.fillStyle = '#374151'; ctx.font = 'bold 13px Arial'; ctx.textAlign = 'left';
                                        ctx.fillText(f.label, mx + 40, fy + 14);
                                        ctx.fillStyle = '#f9fafb'; ctx.strokeStyle = '#c4b5fd'; ctx.lineWidth = 1.5;
                                        ctx.beginPath(); ctx.roundRect(mx + 40, fy + 22, mw - 80, 28, 6); ctx.fill(); ctx.stroke();
                                        ctx.fillStyle = '#6b7280'; ctx.font = '13px Arial';
                                        ctx.fillText(f.val, mx + 52, fy + 41);
                                    });
                                    const sbtnY = bodyY + 58 + 3 * 60 + 10;
                                    ctx.fillStyle = '#7c3aed';
                                    ctx.beginPath(); ctx.roundRect(mx + mw / 2 - 100, sbtnY, 200, 38, 10); ctx.fill();
                                    ctx.fillStyle = '#fff'; ctx.font = 'bold 14px Arial'; ctx.textAlign = 'center';
                                    ctx.fillText('📤 Soumettre la demande', mx + mw / 2, sbtnY + 25);
                                    win.mtcClickZones.push({ x: mx + mw / 2 - 100, y: sbtnY, w: 200, h: 38, action: 'submit_conge', myLogin });
                                } else {
                                    ctx.fillStyle = '#374151'; ctx.font = 'bold 15px Arial'; ctx.textAlign = 'center';
                                    ctx.fillText('Notifications', mx + mw / 2, bodyY + 35);
                                    const notifs = myLogin === 'mqu'
                                        ? [{ titre: 'Demande soumise', contenu: 'Votre demande du 01/05 est en cours d\'examen', date: 'Il y a 2j' }]
                                        : [{ titre: 'Congé approuvé', contenu: 'Votre demande du 15/04 a été approuvée', date: 'Il y a 5j' }, { titre: 'Congé refusé', contenu: 'Votre demande du 30/03 a été refusée', date: 'Il y a 12j' }];
                                    notifs.forEach((n, ni) => {
                                        const ny = bodyY + 52 + ni * 64;
                                        ctx.fillStyle = '#faf5ff'; ctx.strokeStyle = '#ede9fe'; ctx.lineWidth = 1;
                                        ctx.beginPath(); ctx.roundRect(mx + 20, ny, mw - 40, 56, 8); ctx.fill(); ctx.stroke();
                                        ctx.fillStyle = '#7c3aed'; ctx.font = 'bold 13px Arial'; ctx.textAlign = 'left';
                                        ctx.fillText(n.titre, mx + 36, ny + 20);
                                        ctx.fillStyle = '#6b7280'; ctx.font = '12px Arial';
                                        ctx.fillText(n.contenu, mx + 36, ny + 38);
                                        ctx.fillStyle = '#9ca3af'; ctx.font = '11px Arial'; ctx.textAlign = 'right';
                                        ctx.fillText(n.date, mx + mw - 28, ny + 20);
                                    });
                                }
                            }
                        }
                        ctx.restore();
                        yPos += mh + 10;
                        break;
                    }

                    case 'live-news':
                        win.articleLinks = [];
                        if (!win.liveArticlesLoaded) {
                            ctx.fillStyle = '#6b7280';
                            ctx.font = 'italic 20px Arial';
                            ctx.textAlign = 'left';
                            ctx.fillText('⏳ Chargement des articles...', leftMargin, yPos + 20);
                            yPos += 50;
                        } else if (win.liveArticles && win.liveArticles.length > 0) {
                            for (const article of win.liveArticles) {
                                const cardH = 88;
                                const cardW = win.w - 55;
                                const absY = yPos - scrollOffset + contentStartY;
                                // Card
                                ctx.fillStyle = '#f8fafc';
                                ctx.strokeStyle = '#e2e8f0';
                                ctx.lineWidth = 1;
                                ctx.beginPath();
                                ctx.roundRect(leftMargin, yPos, cardW, cardH, 8);
                                ctx.fill();
                                ctx.stroke();
                                // Tag pill
                                const tag = article.tag_list?.[0] || 'tech';
                                ctx.fillStyle = '#dbeafe';
                                ctx.beginPath();
                                ctx.roundRect(leftMargin + cardW - 100, yPos + 12, 88, 22, 6);
                                ctx.fill();
                                ctx.fillStyle = '#1e40af';
                                ctx.font = 'bold 13px Arial';
                                ctx.textAlign = 'center';
                                ctx.fillText(`#${tag}`, leftMargin + cardW - 56, yPos + 27);
                                // Title
                                ctx.fillStyle = '#1e3a5f';
                                ctx.font = 'bold 18px Arial';
                                ctx.textAlign = 'left';
                                const maxTitleW = cardW - 120;
                                let title = article.title || '';
                                while (title.length > 10 && ctx.measureText(title).width > maxTitleW) {
                                    title = title.slice(0, -4) + '...';
                                }
                                ctx.fillText(title, leftMargin + 12, yPos + 32);
                                // Meta
                                ctx.fillStyle = '#6b7280';
                                ctx.font = '15px Arial';
                                const date = new Date(article.published_at).toLocaleDateString('fr-FR');
                                ctx.fillText(`@${article.user?.username || '?'} · ${date} · ❤ ${article.positive_reactions_count || 0}`, leftMargin + 12, yPos + 58);
                                // Arrow hint
                                ctx.fillStyle = '#93c5fd';
                                ctx.font = '18px Arial';
                                ctx.fillText('→', leftMargin + cardW - 22, yPos + 50);
                                // Store clickable link zone (absolute coords)
                                win.articleLinks.push({
                                    x: leftMargin, y: absY, w: cardW, h: cardH,
                                    url: article.url
                                });
                                yPos += cardH + 10;
                            }
                        } else {
                            ctx.fillStyle = '#ef4444';
                            ctx.font = '20px Arial';
                            ctx.textAlign = 'left';
                            ctx.fillText('❌ Impossible de charger les articles', leftMargin, yPos + 20);
                            yPos += 50;
                        }
                        break;

                    case 'browser-ui': {
                        // URL bar
                        const urlBarX = win.x + 15;
                        const urlBarY = win.y + 105 + 8;
                        const urlBarW = win.w - 30;
                        const urlBarH = 40;
                        const isUrlActive = this.desktopState.activeInput?.windowId === win.id && this.desktopState.activeInput?.field === 'browserUrl';
                        ctx.fillStyle = '#ffffff';
                        ctx.strokeStyle = isUrlActive ? '#0078d4' : '#cccccc';
                        ctx.lineWidth = isUrlActive ? 2 : 1;
                        ctx.beginPath(); ctx.roundRect(urlBarX, urlBarY, urlBarW, urlBarH, 6); ctx.fill(); ctx.stroke();
                        // Padlock icon
                        ctx.font = '16px Arial';
                        ctx.fillStyle = '#22c55e';
                        ctx.textAlign = 'left';
                        ctx.fillText('🔒', urlBarX + 8, urlBarY + 26);
                        // URL text
                        const displayUrl = isUrlActive ? (this.desktopState.activeInput.value + '|') : (win.browserUrl || '');
                        ctx.fillStyle = isUrlActive ? '#111827' : '#1d4ed8';
                        ctx.font = '16px monospace';
                        ctx.fillText(displayUrl, urlBarX + 30, urlBarY + 26);
                        // Reload button
                        ctx.fillStyle = '#6b7280';
                        ctx.font = '18px Arial';
                        ctx.textAlign = 'right';
                        ctx.fillText('↺', urlBarX + urlBarW - 10, urlBarY + 26);
                        ctx.textAlign = 'left';
                        // Store URL bar click zone
                        win.browserInputZone = { x: urlBarX, y: urlBarY, w: urlBarW - 40, h: urlBarH };

                        // Content starts below URL bar
                        const contentY = win.y + 105 + 58;
                        const contentH = win.h - 115 - 58;
                        // Re-clip for content below URL bar
                        ctx.restore();
                        ctx.save();
                        ctx.beginPath();
                        ctx.rect(win.x + 15, contentY, win.w - 30, contentH);
                        ctx.clip();

                        if (win.browserLoading) {
                            ctx.fillStyle = '#f9fafb';
                            ctx.fillRect(win.x + 15, contentY, win.w - 30, contentH);
                            ctx.fillStyle = '#6b7280';
                            ctx.font = '24px Arial';
                            ctx.textAlign = 'center';
                            ctx.fillText('⏳ Chargement...', win.x + win.w / 2, contentY + contentH / 2);
                            ctx.textAlign = 'left';
                        } else if (!win.browserContent) {
                            ctx.fillStyle = '#f9fafb';
                            ctx.fillRect(win.x + 15, contentY, win.w - 30, contentH);
                        } else if (win.browserContent.type === 'github') {
                            const gh = win.browserContent;
                            ctx.fillStyle = '#0d1117';
                            ctx.fillRect(win.x + 15, contentY, win.w - 30, contentH);
                            // Avatar circle
                            const avatarX = win.x + 60;
                            const avatarY = contentY + 30;
                            const avatarR = 50;
                            ctx.fillStyle = '#21262d';
                            ctx.beginPath(); ctx.arc(avatarX + avatarR, avatarY + avatarR, avatarR, 0, Math.PI * 2); ctx.fill();
                            ctx.fillStyle = '#58a6ff';
                            ctx.font = 'bold 40px Arial';
                            ctx.textAlign = 'center';
                            ctx.fillText('V', avatarX + avatarR, avatarY + avatarR + 14);
                            ctx.textAlign = 'left';
                            // Profile info
                            const px = win.x + 60 + avatarR * 2 + 30;
                            const profile = gh.profile || {};
                            ctx.fillStyle = '#e6edf3';
                            ctx.font = 'bold 26px Arial';
                            ctx.fillText(profile.name || 'Virgile Allix', px, contentY + 55);
                            ctx.fillStyle = '#8b949e';
                            ctx.font = '18px Arial';
                            ctx.fillText('@' + (profile.login || 'virgileallix'), px, contentY + 80);
                            ctx.fillStyle = '#c9d1d9';
                            ctx.font = '16px Arial';
                            const bio = profile.bio || 'Développeur Full Stack • BTS SIO SLAM';
                            ctx.fillText(bio, px, contentY + 106);
                            ctx.fillStyle = '#8b949e';
                            ctx.font = '15px Arial';
                            ctx.fillText(`⭐ ${profile.public_repos || 0} repos  ·  👥 ${profile.followers || 0} followers`, px, contentY + 130);
                            // Repos grid
                            const repos = Array.isArray(gh.repos) ? gh.repos : [];
                            const gridY = contentY + 170;
                            const colW = (win.w - 60) / 2;
                            repos.forEach((repo, idx) => {
                                const col = idx % 2;
                                const row = Math.floor(idx / 2);
                                const rx = win.x + 30 + col * (colW + 10);
                                const ry = gridY + row * 110;
                                ctx.fillStyle = '#161b22';
                                ctx.strokeStyle = '#30363d';
                                ctx.lineWidth = 1;
                                ctx.beginPath(); ctx.roundRect(rx, ry, colW, 95, 8); ctx.fill(); ctx.stroke();
                                ctx.fillStyle = '#58a6ff';
                                ctx.font = 'bold 16px Arial';
                                let rName = repo.name || '';
                                while (rName.length > 4 && ctx.measureText(rName).width > colW - 30) rName = rName.slice(0, -3) + '…';
                                ctx.fillText(rName, rx + 12, ry + 24);
                                ctx.fillStyle = '#8b949e';
                                ctx.font = '13px Arial';
                                let rDesc = repo.description || 'Pas de description';
                                while (rDesc.length > 4 && ctx.measureText(rDesc).width > colW - 24) rDesc = rDesc.slice(0, -4) + '…';
                                ctx.fillText(rDesc, rx + 12, ry + 46);
                                ctx.fillStyle = '#e3b341';
                                ctx.font = '13px Arial';
                                ctx.fillText(`⭐ ${repo.stargazers_count || 0}  ${repo.language || ''}`, rx + 12, ry + 72);
                            });
                        } else if (win.browserContent.type === 'google') {
                            ctx.fillStyle = '#ffffff';
                            ctx.fillRect(win.x + 15, contentY, win.w - 30, contentH);
                            ctx.font = 'bold 72px Arial';
                            ctx.textAlign = 'center';
                            const cx = win.x + win.w / 2;
                            const cy = contentY + contentH * 0.35;
                            ctx.fillStyle = '#4285F4'; ctx.fillText('G', cx - 120, cy);
                            ctx.fillStyle = '#EA4335'; ctx.fillText('o', cx - 60, cy);
                            ctx.fillStyle = '#FBBC05'; ctx.fillText('o', cx, cy);
                            ctx.fillStyle = '#4285F4'; ctx.fillText('g', cx + 60, cy);
                            ctx.fillStyle = '#34A853'; ctx.fillText('l', cx + 108, cy);
                            ctx.fillStyle = '#EA4335'; ctx.fillText('e', cx + 138, cy);
                            // Fake search bar
                            ctx.strokeStyle = '#e0e0e0';
                            ctx.fillStyle = '#ffffff';
                            ctx.lineWidth = 2;
                            const sbX = cx - 200, sbY = cy + 30, sbW = 400, sbH = 44;
                            ctx.shadowColor = 'rgba(0,0,0,0.1)'; ctx.shadowBlur = 8;
                            ctx.beginPath(); ctx.roundRect(sbX, sbY, sbW, sbH, 22); ctx.fill(); ctx.stroke();
                            ctx.shadowBlur = 0;
                            ctx.fillStyle = '#9aa0a6';
                            ctx.font = '18px Arial';
                            ctx.fillText('🔍  Rechercher...', sbX + 20, sbY + 28);
                            ctx.textAlign = 'left';
                        } else if (win.browserContent.type === 'devto') {
                            ctx.fillStyle = '#ffffff';
                            ctx.fillRect(win.x + 15, contentY, win.w - 30, contentH);
                            ctx.fillStyle = '#0a0a0a';
                            ctx.font = 'bold 28px Arial';
                            ctx.textAlign = 'left';
                            ctx.fillText('DEV Community', win.x + 30, contentY + 40);
                            const articles = Array.isArray(win.browserContent.articles) ? win.browserContent.articles : [];
                            let ay = contentY + 65;
                            for (const art of articles) {
                                if (ay > contentY + contentH - 80) break;
                                ctx.fillStyle = '#f9fafb';
                                ctx.strokeStyle = '#e5e7eb';
                                ctx.lineWidth = 1;
                                ctx.beginPath(); ctx.roundRect(win.x + 20, ay, win.w - 40, 75, 6); ctx.fill(); ctx.stroke();
                                ctx.fillStyle = '#111827';
                                ctx.font = 'bold 16px Arial';
                                let t = art.title || '';
                                while (t.length > 4 && ctx.measureText(t).width > win.w - 100) t = t.slice(0, -4) + '…';
                                ctx.fillText(t, win.x + 32, ay + 26);
                                ctx.fillStyle = '#6b7280';
                                ctx.font = '13px Arial';
                                ctx.fillText(`@${art.user?.username || '?'} · ❤ ${art.positive_reactions_count || 0}`, win.x + 32, ay + 52);
                                ay += 84;
                            }
                        } else if (win.browserContent.type === 'portfolio') {
                            ctx.fillStyle = '#0f172a';
                            ctx.fillRect(win.x + 15, contentY, win.w - 30, contentH);
                            ctx.fillStyle = '#38bdf8';
                            ctx.font = 'bold 36px Arial';
                            ctx.textAlign = 'center';
                            ctx.fillText('Virgile Allix', win.x + win.w / 2, contentY + 80);
                            ctx.fillStyle = '#94a3b8';
                            ctx.font = '20px Arial';
                            ctx.fillText('Portfolio — Développeur Full Stack', win.x + win.w / 2, contentY + 120);
                            ctx.fillStyle = '#64748b';
                            ctx.font = '16px Arial';
                            ctx.fillText('virgileallix.github.io', win.x + win.w / 2, contentY + 155);
                            ctx.textAlign = 'left';
                        } else if (win.browserContent.type === '404') {
                            ctx.fillStyle = '#ffffff';
                            ctx.fillRect(win.x + 15, contentY, win.w - 30, contentH);
                            ctx.fillStyle = '#1f2937';
                            ctx.font = 'bold 64px Arial';
                            ctx.textAlign = 'center';
                            ctx.fillText('404', win.x + win.w / 2, contentY + contentH * 0.38);
                            ctx.fillStyle = '#6b7280';
                            ctx.font = '22px Arial';
                            ctx.fillText('Page introuvable', win.x + win.w / 2, contentY + contentH * 0.38 + 50);
                            ctx.fillStyle = '#9ca3af';
                            ctx.font = '16px Arial';
                            ctx.fillText(win.browserContent.url || '', win.x + win.w / 2, contentY + contentH * 0.38 + 82);
                            ctx.textAlign = 'left';
                        } else if (win.browserContent.type === 'anglais') {
                            ctx.fillStyle = '#ffffff';
                            ctx.fillRect(win.x + 15, contentY, win.w - 30, contentH);
                            // Header banner
                            ctx.fillStyle = '#1e40af';
                            ctx.fillRect(win.x + 15, contentY, win.w - 30, 60);
                            ctx.fillStyle = '#ffffff';
                            ctx.font = 'bold 22px Arial';
                            ctx.textAlign = 'center';
                            ctx.fillText('Anglais-Appli', win.x + win.w / 2, contentY + 38);
                            // Live badge
                            ctx.fillStyle = '#22c55e';
                            ctx.beginPath();
                            ctx.arc(win.x + win.w - 55, contentY + 30, 6, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.fillStyle = '#ffffff';
                            ctx.font = '12px Arial';
                            ctx.fillText('LIVE', win.x + win.w - 44, contentY + 34);
                            // Content area
                            const ay = contentY + 75;
                            ctx.fillStyle = '#1e293b';
                            ctx.font = 'bold 17px Arial';
                            ctx.fillText('Application de révision d\'anglais', win.x + win.w / 2, ay);
                            ctx.fillStyle = '#475569';
                            ctx.font = '14px Arial';
                            ctx.fillText('React · Vite · Quiz interactif · Vocabulaire', win.x + win.w / 2, ay + 28);
                            // Feature boxes
                            const features = ['📚 Vocabulaire thématique', '✅ Quiz interactif', '📊 Suivi de progression', '🎯 Exercices ciblés'];
                            const bw = (win.w - 70) / 2;
                            features.forEach((f, i) => {
                                const bx = win.x + 20 + (i % 2) * (bw + 10);
                                const by = ay + 50 + Math.floor(i / 2) * 52;
                                ctx.fillStyle = i % 2 === 0 ? '#eff6ff' : '#f0fdf4';
                                ctx.beginPath();
                                ctx.roundRect(bx, by, bw, 42, 6);
                                ctx.fill();
                                ctx.fillStyle = '#1e293b';
                                ctx.font = '13px Arial';
                                ctx.textAlign = 'left';
                                ctx.fillText(f, bx + 12, by + 26);
                            });
                            // URL link
                            ctx.fillStyle = '#3b82f6';
                            ctx.font = '13px Arial';
                            ctx.textAlign = 'center';
                            ctx.fillText('virgile-allix.github.io/anglais-appli/', win.x + win.w / 2, ay + 168);
                            ctx.textAlign = 'left';
                        }
                        yPos += contentH + 10;
                        break;
                    }

                    case 'terminal-ui': {
                        const termBg = '#0d0d0d';
                        const termX = win.x + 15;
                        const termY = win.y + 115;
                        const termW = win.w - 30;
                        const termH = win.h - 125;
                        ctx.fillStyle = termBg;
                        ctx.fillRect(termX, termY, termW, termH);

                        const lineH = 22;
                        const maxLines = Math.floor((termH - 36) / lineH);
                        const lines = win.termOutput || [];
                        const visibleLines = lines.slice(Math.max(0, lines.length - maxLines));

                        let ty = termY + 18;
                        ctx.font = '15px "Courier New", monospace';
                        for (const line of visibleLines) {
                            ctx.fillStyle = '#33ff33';
                            ctx.textAlign = 'left';
                            ctx.fillText(line, termX + 10, ty);
                            ty += lineH;
                        }

                        // Input line
                        const isTermActive = this.desktopState.activeInput?.windowId === win.id && this.desktopState.activeInput?.field === 'termInput';
                        const prompt = 'Virgile-PC ~ % ';
                        const inputLine = prompt + (win.termInput || '') + (isTermActive ? (Math.floor(Date.now() / 500) % 2 === 0 ? '█' : ' ') : '');
                        const inputY = termY + termH - 16;
                        ctx.fillStyle = '#33ff33';
                        ctx.font = '15px "Courier New", monospace';
                        ctx.textAlign = 'left';
                        ctx.fillText(inputLine, termX + 10, inputY);

                        // Click zone
                        win.termInputZone = { x: termX, y: termY, w: termW, h: termH };
                        yPos += termH + 10;
                        break;
                    }

                    case 'explorer-ui': {
                        const exX = win.x + 15;
                        const exY = win.y + 115;
                        const exW = win.w - 30;
                        const exH = win.h - 125;
                        ctx.fillStyle = '#fafafa';
                        ctx.fillRect(exX, exY, exW, exH);

                        win.explorerClickZones = [];
                        const virtualFS = [
                            { name: 'Bureau', icon: '🖥️', children: [
                                { name: 'Présentation.pdf', icon: '📄', color: '#ef4444' },
                                { name: 'Tableau-E5.xlsx', icon: '📊', color: '#22c55e' },
                                { name: 'Portfolio', icon: '📁', color: '#f59e0b' }
                            ]},
                            { name: 'Projets', icon: '📁', children: [
                                { name: 'MT-Congés', icon: '📁', color: '#f59e0b' },
                                { name: 'RFTG', icon: '📁', color: '#f59e0b' },
                                { name: 'Mission-Assureur', icon: '📁', color: '#f59e0b' },
                                { name: 'Portfolio-3D', icon: '📁', color: '#f59e0b' }
                            ]},
                            { name: 'Documents', icon: '📁', children: [
                                { name: 'BTS-SIO', icon: '📁', color: '#f59e0b' },
                                { name: 'Veille-Tech', icon: '📁', color: '#f59e0b' }
                            ]},
                            { name: 'Téléchargements', icon: '📁', children: [] }
                        ];

                        let ey = exY + 14;
                        const lineH2 = 28;
                        for (const folder of virtualFS) {
                            if (ey > exY + exH - lineH2) break;
                            const isExpanded = win.explorerExpanded?.has(folder.name);
                            // Folder row
                            ctx.fillStyle = '#f3f4f6';
                            ctx.fillRect(exX + 4, ey - 2, exW - 8, lineH2);
                            ctx.font = '16px Arial';
                            ctx.fillStyle = '#374151';
                            ctx.textAlign = 'left';
                            ctx.fillText((isExpanded ? '▼' : '▶') + ' ' + folder.icon + ' ' + folder.name, exX + 12, ey + 18);
                            win.explorerClickZones.push({ x: exX + 4, y: ey - 2, w: exW - 8, h: lineH2, name: folder.name });
                            ey += lineH2 + 2;
                            if (isExpanded && folder.children) {
                                for (const child of folder.children) {
                                    if (ey > exY + exH - lineH2) break;
                                    ctx.fillStyle = child.color || '#6b7280';
                                    ctx.font = '15px Arial';
                                    ctx.fillText('    ' + child.icon + ' ' + child.name, exX + 24, ey + 16);
                                    ey += lineH2;
                                }
                            }
                        }
                        yPos += exH + 10;
                        break;
                    }

                    case 'taskmanager-ui': {
                        const tmX = win.x + 15;
                        const tmY = win.y + 115;
                        const tmW = win.w - 30;
                        const tmH = win.h - 125;
                        ctx.fillStyle = '#1e1e2e';
                        ctx.fillRect(tmX, tmY, tmW, tmH);

                        const t2 = (Date.now() - (win.taskStartTime || Date.now())) / 1000;

                        // CPU bar
                        const cpuVal = 0.15 + 0.1 * Math.abs(Math.sin(t2 * 0.7));
                        ctx.fillStyle = '#2d2d3f';
                        ctx.fillRect(tmX + 10, tmY + 12, tmW - 20, 18);
                        ctx.fillStyle = '#22d3ee';
                        ctx.fillRect(tmX + 10, tmY + 12, (tmW - 20) * cpuVal, 18);
                        ctx.fillStyle = '#e2e8f0';
                        ctx.font = '13px Arial';
                        ctx.textAlign = 'left';
                        ctx.fillText(`CPU: ${(cpuVal * 100).toFixed(1)}%`, tmX + 16, tmY + 25);

                        // RAM bar
                        const ramVal = 0.45 + 0.05 * Math.abs(Math.sin(t2 * 0.4));
                        ctx.fillStyle = '#2d2d3f';
                        ctx.fillRect(tmX + 10, tmY + 38, tmW - 20, 18);
                        ctx.fillStyle = '#a78bfa';
                        ctx.fillRect(tmX + 10, tmY + 38, (tmW - 20) * ramVal, 18);
                        ctx.fillStyle = '#e2e8f0';
                        ctx.fillText(`RAM: ${(ramVal * 16).toFixed(1)} GB / 16 GB`, tmX + 16, tmY + 51);

                        // Processes header
                        ctx.fillStyle = '#3b3b4f';
                        ctx.fillRect(tmX + 4, tmY + 66, tmW - 8, 24);
                        ctx.fillStyle = '#94a3b8';
                        ctx.font = 'bold 13px Arial';
                        ctx.fillText('Processus', tmX + 12, tmY + 82);
                        ctx.textAlign = 'right';
                        ctx.fillText('CPU%', tmX + tmW - 120, tmY + 82);
                        ctx.fillText('RAM', tmX + tmW - 60, tmY + 82);
                        ctx.fillText('✕', tmX + tmW - 20, tmY + 82);
                        ctx.textAlign = 'left';

                        win.taskKillZones = [];
                        const systemProcs = [
                            { name: 'System', cpu: 0.4 + 0.2 * Math.abs(Math.sin(t2)), ram: '2.1 MB' },
                            { name: 'svchost.exe', cpu: 0.8 + 0.5 * Math.abs(Math.sin(t2 * 1.3)), ram: '12.4 MB' },
                            { name: 'node.exe', cpu: 2.1 + 1.2 * Math.abs(Math.sin(t2 * 0.6)), ram: '48.2 MB' },
                            { name: 'vite.exe', cpu: 1.5 + 0.8 * Math.abs(Math.sin(t2 * 0.9)), ram: '32.6 MB' }
                        ];

                        let procY = tmY + 98;
                        const rowH3 = 28;

                        // User windows as processes
                        for (const w of this.windows) {
                            if (procY > tmY + tmH - rowH3) break;
                            if (w.id === win.id) continue;
                            const wcpu = (1 + Math.abs(Math.sin(t2 + w.id.length))).toFixed(1);
                            ctx.fillStyle = procY % (rowH3 * 2) < rowH3 ? '#252535' : '#1e1e2e';
                            ctx.fillRect(tmX + 4, procY, tmW - 8, rowH3);
                            ctx.fillStyle = '#e2e8f0';
                            ctx.font = '14px Arial';
                            ctx.textAlign = 'left';
                            let pname = w.title || w.id;
                            while (pname.length > 4 && ctx.measureText(pname).width > tmW - 180) pname = pname.slice(0, -4) + '…';
                            ctx.fillText(pname, tmX + 12, procY + 20);
                            ctx.textAlign = 'right';
                            ctx.fillStyle = '#22d3ee';
                            ctx.fillText(wcpu + '%', tmX + tmW - 120, procY + 20);
                            ctx.fillStyle = '#a78bfa';
                            ctx.fillText('24 MB', tmX + tmW - 60, procY + 20);
                            // Kill button
                            ctx.fillStyle = '#ef4444';
                            ctx.font = 'bold 14px Arial';
                            ctx.fillText('✕', tmX + tmW - 20, procY + 20);
                            win.taskKillZones.push({ x: tmX + tmW - 36, y: procY, w: 32, h: rowH3, winId: w.id });
                            ctx.textAlign = 'left';
                            procY += rowH3;
                        }

                        // System processes
                        for (const sp of systemProcs) {
                            if (procY > tmY + tmH - rowH3) break;
                            ctx.fillStyle = procY % (rowH3 * 2) < rowH3 ? '#252535' : '#1e1e2e';
                            ctx.fillRect(tmX + 4, procY, tmW - 8, rowH3);
                            ctx.fillStyle = '#94a3b8';
                            ctx.font = '14px Arial';
                            ctx.textAlign = 'left';
                            ctx.fillText(sp.name, tmX + 12, procY + 20);
                            ctx.textAlign = 'right';
                            ctx.fillStyle = '#64748b';
                            ctx.fillText(sp.cpu.toFixed(1) + '%', tmX + tmW - 120, procY + 20);
                            ctx.fillText(sp.ram, tmX + tmW - 60, procY + 20);
                            ctx.textAlign = 'left';
                            procY += rowH3;
                        }
                        yPos += tmH + 10;
                        break;
                    }
                }
            });

            // Store total content height (excluding scrollOffset so it stays stable)
            win.contentHeight = (yPos + scrollOffset) - contentStartY + 80;
        }

        ctx.restore();

        // Scrollbar if needed
        const visibleHeight = win.h - 150; // content area: from y+140 to y+win.h-10
        if (win.contentHeight && win.contentHeight > visibleHeight) {
            const trackTop = win.y + 105;
            const trackHeight = win.h - 115;

            // Track
            ctx.fillStyle = 'rgba(0,0,0,0.08)';
            ctx.fillRect(win.x + win.w - 18, trackTop, 12, trackHeight);

            // Thumb
            const maxScroll = win.contentHeight - visibleHeight;
            const thumbHeight = Math.max(40, trackHeight * visibleHeight / win.contentHeight);
            const scrollProgress = Math.min(1, (win.scrollOffset || 0) / maxScroll);
            const thumbY = trackTop + scrollProgress * (trackHeight - thumbHeight);

            ctx.fillStyle = '#aaaaaa';
            ctx.beginPath();
            ctx.roundRect(win.x + win.w - 18, thumbY, 12, thumbHeight, 6);
            ctx.fill();
        }

        // Restore context si animation
        if (win.isAnimating) {
            ctx.restore();
        }
    }

    createPCCase() {
        const pcGroup = new THREE.Group();

        // Main case
        const caseGeometry = new THREE.BoxGeometry(0.5, 1.2, 1);
        const caseMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.3,
            metalness: 0.7
        });
        const pcCase = new THREE.Mesh(caseGeometry, caseMaterial);
        pcCase.position.y = 2.65;
        pcCase.castShadow = true;
        pcGroup.add(pcCase);

        // Glass panel
        const glassGeometry = new THREE.PlaneGeometry(0.4, 1);
        const glassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x88ccff,
            transparent: true,
            opacity: 0.3,
            metalness: 0.1,
            roughness: 0.1
        });
        const glass = new THREE.Mesh(glassGeometry, glassMaterial);
        glass.position.set(0.26, 2.65, 0);
        glass.rotation.y = -Math.PI / 2;
        pcGroup.add(glass);

        // RGB strips
        const rgbColors = [0xff00ff, 0x00ffff, 0xff0080];
        for (let i = 0; i < 3; i++) {
            const strip = new THREE.Mesh(
                new THREE.BoxGeometry(0.02, 0.3, 0.02),
                new THREE.MeshBasicMaterial({ color: rgbColors[i] })
            );
            strip.position.set(0.2, 2.3 + i * 0.3, -0.3 + i * 0.3);
            pcGroup.add(strip);
        }

        pcGroup.position.set(2.5, 0, 0);
        this.scene.add(pcGroup);
        this.pcCase = pcGroup;
    }

    createKeyboard() {
        const keyboardGroup = new THREE.Group();

        // Base
        const baseGeometry = new THREE.BoxGeometry(1.5, 0.05, 0.5);
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a2a2a,
            roughness: 0.4,
            metalness: 0.6
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.set(0, 2.08, 0.7);
        base.castShadow = true;
        keyboardGroup.add(base);

        // Keys (simplified)
        const keyMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.6
        });

        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 15; col++) {
                const key = new THREE.Mesh(
                    new THREE.BoxGeometry(0.08, 0.02, 0.08),
                    keyMaterial
                );
                key.position.set(
                    -0.65 + col * 0.09,
                    2.11,
                    0.5 + row * 0.09
                );
                key.castShadow = true;
                keyboardGroup.add(key);
            }
        }

        this.scene.add(keyboardGroup);
        this.keyboard = keyboardGroup;
    }

    createMousePad() {
        const padGeometry = new THREE.BoxGeometry(0.8, 0.01, 0.6);
        const padMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a2e,
            roughness: 0.8
        });
        const pad = new THREE.Mesh(padGeometry, padMaterial);
        pad.position.set(-2, 2.06, 0.8);
        pad.receiveShadow = true;
        this.scene.add(pad);
    }

    createMouse() {
        const mouseGroup = new THREE.Group();

        // Body
        const bodyGeo = new THREE.BoxGeometry(0.6, 0.3, 1);
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.5 });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 0.15;
        body.castShadow = true;
        mouseGroup.add(body);

        // RGB Line
        const rgbGeo = new THREE.BoxGeometry(0.62, 0.05, 1.02);
        const rgbMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const rgb = new THREE.Mesh(rgbGeo, rgbMat);
        rgb.position.y = 0.05;
        mouseGroup.add(rgb);
        this.mouseRgb = rgb; // Store for animation

        mouseGroup.position.set(2.5, 2.05, 1.5);
        this.scene.add(mouseGroup);
        this.mouseModel = mouseGroup;
    }

    // Removed createButtons


    onMouseMove(event) {
        if (window.a11yModeActive) return;
        // Standard raycasting for interaction
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        if (this.isZoomed) {
            // Calculate mouse position on the virtual screen
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObject(this.screenMesh);

            if (intersects.length > 0) {
                const uv = intersects[0].uv;
                this.desktopState.mouseX = uv.x * this.canvasWidth;
                this.desktopState.mouseY = (1 - uv.y) * this.canvasHeight;

                // Throttle screen updates pour performance
                const now = Date.now();
                const shouldUpdate = now - this.lastScreenUpdate > this.screenUpdateThrottle;

                // Handle window dragging
                if (this.desktopState.isDragging && this.desktopState.draggedWindow) {
                    const win = this.desktopState.draggedWindow;
                    win.x = this.desktopState.mouseX - this.desktopState.dragOffsetX;
                    win.y = this.desktopState.mouseY - this.desktopState.dragOffsetY;

                    // Clamp to screen bounds (taskbar at bottom)
                    const taskbarY = this.canvasHeight - 70;
                    win.x = Math.max(0, Math.min(win.x, this.canvasWidth - win.w));
                    win.y = Math.max(0, Math.min(win.y, taskbarY - 40));

                    if (shouldUpdate) {
                        this.updateOS(this.screenCtx);
                        this.lastScreenUpdate = now;
                    }
                }
                // Update screen only if enough time has passed (throttle)
                else if (shouldUpdate) {
                    this.updateOS(this.screenCtx);
                    this.lastScreenUpdate = now;
                }

                // Keep cursor hidden when zoomed
                document.body.style.cursor = 'none';
            } else {
                document.body.style.cursor = 'default';
            }
        } else {
            // Check if hovering Screen to change cursor
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.clickableObjects);
            if (intersects.length > 0) {
                document.body.style.cursor = 'pointer';
            } else {
                document.body.style.cursor = 'default';
            }
        }
    }

    onClick(event) {
        if (window.a11yModeActive) return;
        this.raycaster.setFromCamera(this.mouse, this.camera);

        if (!this.isZoomed) {
            // Check if clicked screen
            const intersects = this.raycaster.intersectObject(this.screenMesh);
            if (intersects.length > 0) {
                this.zoomIn();
            }
        } else {
            // Logic for clicking INSIDE the OS
            const hitScreen = this.raycaster.intersectObject(this.screenMesh);
            if (hitScreen.length > 0) {
                this.handleOSClick(this.desktopState.mouseX, this.desktopState.mouseY);
            } else {
                // Clicked outside -> Zoom out
                this.zoomOut();
            }
        }
    }

    onWheel(event) {
        if (window.a11yModeActive) return;
        // Only handle scroll when zoomed in (OS mode)
        if (!this.isZoomed) return;

        // Prevent default scroll behavior
        event.preventDefault();

        const x = this.desktopState.mouseX;
        const y = this.desktopState.mouseY;

        // Find the window under the mouse
        for (let i = this.windows.length - 1; i >= 0; i--) {
            const win = this.windows[i];

            // Skip minimized windows
            if (win.minimized) continue;

            // Check if mouse is over this window
            if (x >= win.x && x <= win.x + win.w && y >= win.y && y <= win.y + win.h) {
                // Check if window has scrollable content
                const visibleH = win.h - 150;
                if (win.contentHeight && win.contentHeight > visibleH) {
                    if (!win.scrollOffset) win.scrollOffset = 0;

                    const scrollAmount = event.deltaY * 0.8;
                    win.scrollOffset += scrollAmount;

                    const maxScroll = win.contentHeight - visibleH;
                    win.scrollOffset = Math.max(0, Math.min(win.scrollOffset, maxScroll));

                    // Update the OS display
                    this.updateOS(this.screenCtx);
                }
                break; // Only scroll the top window
            }
        }
    }

    zoomIn() {
        this.isZoomed = true;

        // Disable orbit controls
        this.controls.enabled = false;

        // Désactiver le reflet bleu de l'écran mais augmenter la lumière ambiante
        if (this.screenLight) {
            gsap.to(this.screenLight, {
                intensity: 0,
                duration: 0.5,
                ease: "power2.inOut"
            });
        }

        // Augmenter la lumière ambiante pour compenser
        if (this.ambientLight) {
            gsap.to(this.ambientLight, {
                intensity: 1.2, // Beaucoup plus lumineux
                duration: 0.5,
                ease: "power2.inOut"
            });
        }

        // Animate Camera to positions - PLEIN ÉCRAN TOTAL
        gsap.to(this.camera.position, {
            x: 0, y: 4.5, z: 0.8, // Plein écran - très très proche
            duration: 1.0,
            ease: "power2.inOut"
        });

        gsap.to(this.controls.target, {
            x: 0, y: 4.5, z: 0, // Look at screen center
            duration: 1.0,
            ease: "power2.inOut",
            onUpdate: () => this.camera.lookAt(this.controls.target)
        });

        // Réduire le FOV pour agrandir l'écran (effet plein écran)
        gsap.to(this.camera, {
            fov: 45, // Réduction du champ de vision
            duration: 1.0,
            ease: "power2.inOut",
            onUpdate: () => this.camera.updateProjectionMatrix()
        });
    }

    zoomOut() {
        this.isZoomed = false;
        this.controls.enabled = true;
        document.body.style.cursor = 'default';

        // Réactiver le reflet bleu de l'écran et restaurer lumière ambiante
        if (this.screenLight) {
            gsap.to(this.screenLight, {
                intensity: 0.5,
                duration: 0.5,
                ease: "power2.inOut"
            });
        }

        // Restaurer lumière ambiante normale
        if (this.ambientLight) {
            gsap.to(this.ambientLight, {
                intensity: 0.4,
                duration: 0.5,
                ease: "power2.inOut"
            });
        }

        // Restaurer le FOV original
        gsap.to(this.camera, {
            fov: 75, // FOV par défaut
            duration: 1.5,
            ease: "power2.inOut",
            onUpdate: () => this.camera.updateProjectionMatrix()
        });

        gsap.to(this.camera.position, {
            x: this.defaultCameraPos.x,
            y: this.defaultCameraPos.y,
            z: this.defaultCameraPos.z,
            duration: 1.5,
            ease: "power2.inOut"
        });

        gsap.to(this.controls.target, {
            x: this.defaultTarget.x,
            y: this.defaultTarget.y,
            z: this.defaultTarget.z,
            duration: 1.5,
            ease: "power2.inOut",
            onUpdate: () => this.camera.lookAt(this.controls.target)
        });
    }

    handleOSClick(x, y) {
        // MT-Congés demo button (opens simulation window)
        for (const win of this.windows) {
            if (win.minimized || !win.mtcDemoBtn) continue;
            const btn = win.mtcDemoBtn;
            if (x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h) {
                this.openWindow({ id: 'mtconges' });
                this.updateOS(this.screenCtx); return;
            }
        }

        // MT-Congés simulation click zones
        for (const win of this.windows) {
            if (win.minimized || !win.mtcClickZones?.length) continue;
            for (const zone of win.mtcClickZones) {
                if (x >= zone.x && x <= zone.x + zone.w && y >= zone.y && y <= zone.y + zone.h) {
                    const mtc = win.mtc;
                    if (zone.action === 'login') {
                        mtc.currentUser = zone.user;
                        mtc.screen = zone.user.screen;
                        mtc.activeTab = 0;
                    } else if (zone.action === 'logout') {
                        mtc.screen = 'login';
                        mtc.currentUser = null;
                        mtc.activeTab = 0;
                    } else if (zone.action === 'tab') {
                        mtc.activeTab = zone.tab;
                    } else if (zone.action === 'approve') {
                        const c = mtc.conges.find(c => c.id === zone.congeId);
                        if (c) c.etat = 'Approuvé';
                    } else if (zone.action === 'reject') {
                        const c = mtc.conges.find(c => c.id === zone.congeId);
                        if (c) c.etat = 'Refusé';
                    } else if (zone.action === 'submit_conge') {
                        const nextId = Math.max(...mtc.conges.map(c => c.id)) + 1;
                        mtc.conges.push({ id: nextId, employe: zone.myLogin === 'mqu' ? 'Mathis Quelen' : 'Blanc Paul', login: zone.myLogin, duree: 5, debut: '01/06/2025', etat: 'En attente', motif: 'Congés personnels' });
                        mtc.activeTab = 0;
                    }
                    this.updateOS(this.screenCtx); return;
                }
            }
        }

        // Browser URL bar, terminal input, explorer, taskmanager click zones
        for (const win of this.windows) {
            if (win.minimized) continue;
            if (win.browserInputZone && x >= win.browserInputZone.x && x <= win.browserInputZone.x + win.browserInputZone.w && y >= win.browserInputZone.y && y <= win.browserInputZone.y + win.browserInputZone.h) {
                this.desktopState.activeInput = { windowId: win.id, field: 'browserUrl', value: win.browserUrl || '' };
                this.updateOS(this.screenCtx); return;
            }
            if (win.termInputZone && x >= win.termInputZone.x && x <= win.termInputZone.x + win.termInputZone.w && y >= win.termInputZone.y && y <= win.termInputZone.y + win.termInputZone.h) {
                this.desktopState.activeInput = { windowId: win.id, field: 'termInput' };
                this.updateOS(this.screenCtx); return;
            }
            if (win.explorerClickZones) {
                for (const zone of win.explorerClickZones) {
                    if (x >= zone.x && x <= zone.x + zone.w && y >= zone.y && y <= zone.y + zone.h) {
                        if (win.explorerExpanded.has(zone.name)) win.explorerExpanded.delete(zone.name);
                        else win.explorerExpanded.add(zone.name);
                        this.updateOS(this.screenCtx); return;
                    }
                }
            }
            if (win.taskKillZones) {
                for (const zone of win.taskKillZones) {
                    if (x >= zone.x && x <= zone.x + zone.w && y >= zone.y && y <= zone.y + zone.h) {
                        const idx = this.windows.findIndex(w => w.id === zone.winId);
                        if (idx !== -1) this.windows.splice(idx, 1);
                        this.updateOS(this.screenCtx); return;
                    }
                }
            }
        }

        // Check if dragging - stop drag
        if (this.desktopState.isDragging) {
            this.desktopState.isDragging = false;
            this.desktopState.draggedWindow = null;
            this.updateOS(this.screenCtx);
            return;
        }

        // Check for article link clicks
        for (let i = this.windows.length - 1; i >= 0; i--) {
            const win = this.windows[i];
            if (win.minimized || !win.articleLinks?.length) continue;
            for (const link of win.articleLinks) {
                if (x >= link.x && x <= link.x + link.w && y >= link.y && y <= link.y + link.h) {
                    window.open(link.url, '_blank', 'noopener');
                    win.articleLinks = [];
                    return;
                }
            }
        }

        // Check for image clicks first (iterate backwards to check top windows first)
        for (let i = this.windows.length - 1; i >= 0; i--) {
            const win = this.windows[i];
            if (win.minimized || !win.clickableImages) continue;

            // Check if click is inside window
            if (x >= win.x && x <= win.x + win.w && y >= win.y + 105 && y <= win.y + win.h) {
                // Check each clickable image
                for (const imgZone of win.clickableImages) {
                    if (x >= imgZone.x && x <= imgZone.x + imgZone.w &&
                        y >= imgZone.y && y <= imgZone.y + imgZone.h) {
                        // Image clicked! Open in fullscreen viewer
                        this.openImageViewer(imgZone.img, imgZone.src);
                        return;
                    }
                }
            }
        }

        // Check open dropdown menu items
        if (this.desktopState.openMenu) {
            const m = this.desktopState.openMenu;
            const items = this.getMenuItems(m.menuName);
            const itemH = 38, menuW = 260, padX = m.x, padY = m.y;
            let iy = padY + 8;
            for (const item of items) {
                if (item === '---') { iy += 18; continue; }
                if (x >= padX && x <= padX + menuW && y >= iy - 4 && y <= iy + 30) {
                    this.handleMenuAction(m.winId, m.menuName, item);
                    this.desktopState.openMenu = null;
                    this.updateOS(this.screenCtx);
                    return;
                }
                iy += itemH;
            }
            this.desktopState.openMenu = null;
            this.updateOS(this.screenCtx);
            return;
        }

        // Check start menu items
        if (this.desktopState.startMenuOpen) {
            const smX = 0, smW = 380;
            const smH = 60 + this.desktopState.icons.length * 70 + 80;
            const smY = this.canvasHeight - 70 - smH;
            const startItems = [...this.desktopState.icons, { id: '__closeAll', name: 'Fermer tout', icon: '✖️' }];
            let iy = smY + 80;
            for (const icon of startItems) {
                if (x >= smX + 20 && x <= smX + smW - 20 && y >= iy && y <= iy + 60) {
                    if (icon.id === '__closeAll') { this.windows = []; }
                    else { this.openWindow(icon); }
                    this.desktopState.startMenuOpen = false;
                    this.updateOS(this.screenCtx);
                    return;
                }
                iy += 70;
            }
            this.desktopState.startMenuOpen = false;
            this.updateOS(this.screenCtx);
            return;
        }

        // Check Windows (Close, minimize, maximize, drag, or focus)
        let clickedWindow = false;
        // Iterate backwards (top windows first)
        for (let i = this.windows.length - 1; i >= 0; i--) {
            const win = this.windows[i];

            // Skip minimized windows (they're not visible)
            if (win.minimized) continue;

            // Hit test
            if (x >= win.x && x <= win.x + win.w && y >= win.y && y <= win.y + win.h) {
                clickedWindow = true;

                // Check Close Button (ajusté pour nouvelle taille)
                if (x >= win.x + win.w - 50 && y <= win.y + 50) {
                    this.windows.splice(i, 1);
                    this.updateOS(this.screenCtx);
                    return;
                }

                // Check Minimize Button
                if (x >= win.x + win.w - 150 && x < win.x + win.w - 100 && y <= win.y + 50) {
                    win.minimized = !win.minimized;
                    this.updateOS(this.screenCtx);
                    return;
                }

                // Check Maximize Button
                if (x >= win.x + win.w - 100 && x < win.x + win.w - 50 && y <= win.y + 50) {
                    if (win.maximized) {
                        // Restore
                        win.x = win.restoreX;
                        win.y = win.restoreY;
                        win.w = win.restoreW;
                        win.h = win.restoreH;
                        win.maximized = false;
                    } else {
                        // Maximize
                        win.restoreX = win.x;
                        win.restoreY = win.y;
                        win.restoreW = win.w;
                        win.restoreH = win.h;
                        win.x = 10;
                        win.y = 10;
                        win.w = this.canvasWidth - 20;
                        win.h = this.canvasHeight - 90; // Leave space for taskbar
                        win.maximized = true;
                    }
                    this.updateOS(this.screenCtx);
                    return;
                }

                // Check Menu Bar (Fichier, Édition, Affichage, Insertion)
                if (y >= win.y + 50 && y <= win.y + 95) {
                    const menuItems = ['Fichier', 'Édition', 'Affichage', 'Insertion'];
                    let mx = win.x + 15;
                    for (const menuName of menuItems) {
                        if (x >= mx && x < mx + 100) {
                            this.desktopState.openMenu = { winId: win.id, menuName, x: mx, y: win.y + 95 };
                            this.updateOS(this.screenCtx);
                            return;
                        }
                        mx += 100;
                    }
                }

                // Check Title Bar (start drag)
                if (y <= win.y + 50 && !win.maximized) {
                    this.desktopState.isDragging = true;
                    this.desktopState.draggedWindow = win;
                    this.desktopState.dragOffsetX = x - win.x;
                    this.desktopState.dragOffsetY = y - win.y;
                    // Bring to front
                    this.windows.push(this.windows.splice(i, 1)[0]);
                    this.updateOS(this.screenCtx);
                    return;
                }

                // Clicked inside window - bring to front
                this.windows.push(this.windows.splice(i, 1)[0]);
                this.updateOS(this.screenCtx);
                return;
            }
        }

        if (!clickedWindow) {
            // Close any open menu/start menu on click outside
            if (this.desktopState.openMenu || this.desktopState.startMenuOpen) {
                this.desktopState.openMenu = null;
                this.desktopState.startMenuOpen = false;
                this.updateOS(this.screenCtx);
                return;
            }

            // Check Taskbar buttons
            const taskbarY = this.canvasHeight - 70;
            if (y >= taskbarY) {
                // WIN button
                if (x < 80) {
                    this.desktopState.startMenuOpen = !this.desktopState.startMenuOpen;
                    this.updateOS(this.screenCtx);
                    return;
                }

                let taskbarX = 90;
                for (let i = 0; i < this.windows.length; i++) {
                    const win = this.windows[i];
                    if (x >= taskbarX && x < taskbarX + 200) {
                        win.minimized = !win.minimized;
                        if (!win.minimized) {
                            this.windows.push(this.windows.splice(i, 1)[0]);
                        }
                        this.updateOS(this.screenCtx);
                        return;
                    }
                    taskbarX += 210;
                }
            }

            // Check Icons avec double-clic (utiliser scale factor)
            const scaleX = this.canvasWidth / 2560;
            const scaleY = this.canvasHeight / 1440;
            const scaledIconSize = 110 * Math.min(scaleX, scaleY);

            this.desktopState.icons.forEach(icon => {
                const iconX = icon.x * scaleX;
                const iconY = icon.y * scaleY;

                if (x >= iconX && x <= iconX + scaledIconSize && y >= iconY && y <= iconY + scaledIconSize) {
                    const currentTime = Date.now();
                    const timeSinceLastClick = currentTime - this.desktopState.lastClickTime;

                    if (this.desktopState.lastClickedIcon === icon.id && timeSinceLastClick < 400) {
                        // Double-clic détecté !
                        this.openWindow(icon);
                        this.desktopState.lastClickedIcon = null;
                        this.desktopState.lastClickTime = 0;
                    } else {
                        // Premier clic
                        this.desktopState.lastClickedIcon = icon.id;
                        this.desktopState.lastClickTime = currentTime;
                    }
                }
            });
        }

        this.updateOS(this.screenCtx);
    }

    isClickableAt(x, y) {
        const taskbarY = this.canvasHeight - 70;
        // Taskbar entière
        if (y >= taskbarY) return true;
        // Menus ouverts
        if (this.desktopState.startMenuOpen || this.desktopState.openMenu) return true;
        const scaleX = this.canvasWidth / 2560;
        const scaleY = this.canvasHeight / 1440;
        // Icônes (zone élargie de 20px)
        const iconSize = 130 * Math.min(scaleX, scaleY);
        for (const icon of this.desktopState.icons) {
            const ix = icon.x * scaleX - 10, iy = icon.y * scaleY - 10;
            if (x >= ix && x <= ix + iconSize && y >= iy && y <= iy + iconSize) return true;
        }
        // Fenêtres : titlebar, menubar, boutons, contenu
        for (const win of this.windows) {
            if (win.minimized) continue;
            // Titlebar + menubar + boutons fermer/min/max
            if (x >= win.x && x <= win.x + win.w && y >= win.y && y <= win.y + 95) return true;
            // Scrollbar
            if (x >= win.x + win.w - 25 && x <= win.x + win.w && y >= win.y + 95 && y <= win.y + win.h) return true;
            // Images cliquables dans la fenêtre
            if (win.clickableImages) {
                for (const img of win.clickableImages) {
                    if (x >= img.x && x <= img.x + img.w && y >= img.y && y <= img.y + img.h) return true;
                }
            }
        }
        return false;
    }

    getMenuItems(menuName) {
        const menus = {
            'Fichier':    ['Nouveau fichier', 'Fermer la fenêtre', 'Fermer tout'],
            'Édition':    ['Copier', 'Coller', 'Annuler'],
            'Affichage':  ['Plein écran', 'Zoom avant', 'Zoom arrière'],
            'Insertion':  ['Image', 'Lien hypertexte'],
        };
        return menus[menuName] || [];
    }

    handleMenuAction(winId, menuName, item) {
        const win = this.windows.find(w => w.id === winId);
        if (item === 'Fermer la fenêtre' && win) {
            this.windows.splice(this.windows.indexOf(win), 1);
        } else if (item === 'Fermer tout') {
            this.windows = [];
        } else if (item === 'Plein écran' && win) {
            if (!win.maximized) {
                win.restoreX = win.x; win.restoreY = win.y;
                win.restoreW = win.w; win.restoreH = win.h;
                win.x = 10; win.y = 10;
                win.w = this.canvasWidth - 20;
                win.h = this.canvasHeight - 90;
                win.maximized = true;
            }
        }
    }

    renderDropdownMenu(ctx) {
        const m = this.desktopState.openMenu;
        if (!m) return;
        const items = this.getMenuItems(m.menuName);
        const menuW = 260, padX = m.x, padY = m.y;
        let totalH = 16;
        items.forEach(i => totalH += i === '---' ? 18 : 38);

        ctx.shadowColor = 'rgba(0,0,0,0.35)';
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(padX, padY, menuW, totalH, 8);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(0,120,212,0.25)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        let iy = padY + 8;
        for (const item of items) {
            if (item === '---') {
                ctx.fillStyle = '#e0e0e0';
                ctx.fillRect(padX + 12, iy + 8, menuW - 24, 1);
                iy += 18; continue;
            }
            const hovered = this.desktopState.mouseX >= padX &&
                this.desktopState.mouseX <= padX + menuW &&
                this.desktopState.mouseY >= iy - 4 &&
                this.desktopState.mouseY <= iy + 30;
            if (hovered) {
                ctx.fillStyle = 'rgba(0,120,212,0.1)';
                ctx.beginPath();
                ctx.roundRect(padX + 4, iy - 4, menuW - 8, 34, 5);
                ctx.fill();
            }
            ctx.fillStyle = '#222222';
            ctx.font = '22px -apple-system, Arial, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(item, padX + 16, iy + 20);
            iy += 38;
        }
    }

    renderStartMenu(ctx) {
        const icons = this.desktopState.icons;
        const smW = 380, smX = 0;
        const smH = 80 + icons.length * 70 + 90;
        const smY = this.canvasHeight - 70 - smH;

        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 30;
        const grad = ctx.createLinearGradient(smX, smY, smX, smY + smH);
        grad.addColorStop(0, 'rgba(25,25,40,0.98)');
        grad.addColorStop(1, 'rgba(15,15,30,0.99)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(smX, smY, smW, smH, [0, 14, 0, 0]);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(0,255,255,0.2)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Header
        ctx.fillStyle = 'rgba(0,255,255,0.08)';
        ctx.fillRect(smX, smY, smW, 70);
        ctx.font = 'bold 26px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.fillText('👤  Virgile Allix', smX + 20, smY + 42);

        let iy = smY + 80;
        const allItems = [...icons, { id: '__closeAll', name: 'Fermer tout', icon: '✖️' }];
        for (const icon of allItems) {
            const hovered = this.desktopState.mouseX >= smX + 20 &&
                this.desktopState.mouseX <= smX + smW - 20 &&
                this.desktopState.mouseY >= iy &&
                this.desktopState.mouseY <= iy + 60;
            if (hovered) {
                ctx.fillStyle = 'rgba(0,255,255,0.1)';
                ctx.beginPath();
                ctx.roundRect(smX + 8, iy + 2, smW - 16, 56, 8);
                ctx.fill();
            }
            ctx.font = '28px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(icon.icon, smX + 22, iy + 36);
            ctx.fillStyle = icon.id === '__closeAll' ? '#ff6666' : '#e0e0e0';
            ctx.font = '22px -apple-system, Arial, sans-serif';
            ctx.fillText(icon.name, smX + 70, iy + 36);
            iy += 70;
        }
    }

    openWindow(icon) {
        if (icon.id === 'e5') {
            const excelUrl = `${import.meta.env.BASE_URL}tableau-e5.xlsx`;
            const excelWindow = window.open(excelUrl, '_blank', 'noopener');
            if (!excelWindow) window.location.href = excelUrl;
            return;
        }

        // Check if already open
        const existing = this.windows.find(w => w.id === icon.id);
        if (existing) {
            // Bring to front and restore if minimized
            if (existing.minimized) existing.minimized = false;
            const index = this.windows.indexOf(existing);
            this.windows.push(this.windows.splice(index, 1)[0]);
            return;
        }

        // Get project to set appropriate window size
        const project = this.projects[icon.id];

        // Scale window size based on resolution
        const scaleX = this.canvasWidth / 2560;
        const scaleY = this.canvasHeight / 1440;
        const windowWidth = (icon.id === 'mtconges' ? 1600 : 2000) * scaleX;
        const windowHeight = (icon.id === 'presentation' ? 1300 : icon.id === 'mtconges' ? 900 : 1100) * scaleY;

        // Create window with animation properties
        const newWindow = {
            id: icon.id,
            title: this.projects[icon.id]?.title || icon.name,
            x: (300 + this.windows.length * 40) * scaleX,
            y: (150 + this.windows.length * 40) * scaleY,
            w: windowWidth,
            h: windowHeight,
            minimized: false,
            maximized: false,
            scrollOffset: 0,
            // Animation properties
            animScale: 0.5,
            animOpacity: 0,
            isAnimating: true
        };

        this.windows.push(newWindow);

        // Initialize state for new app windows
        if (icon.id === 'browser') {
            newWindow.browserUrl = 'github.com/virgileallix';
            newWindow.browserContent = null;
            newWindow.browserLoading = false;
            this.fetchBrowserPage(newWindow);
        } else if (icon.id === 'terminal') {
            newWindow.termOutput = ['Virgile-PC ~ % Type "help" pour voir les commandes', ''];
            newWindow.termInput = '';
            newWindow.termHistory = [];
            newWindow.termHistIdx = -1;
            this.desktopState.activeInput = { windowId: newWindow.id, field: 'termInput' };
        } else if (icon.id === 'explorer') {
            newWindow.explorerExpanded = new Set(['Bureau', 'Projets']);
        } else if (icon.id === 'taskmanager') {
            newWindow.taskStartTime = Date.now();
        } else if (icon.id === 'mtconges') {
            newWindow.mtc = {
                screen: 'login', currentUser: null, activeTab: 0,
                conges: [
                    { id: 1, employe: 'Mathis Quelen', login: 'mqu', duree: 3, debut: '01/05/2025', etat: 'En attente', motif: 'Congés personnels' },
                    { id: 2, employe: 'Paul Blanc',    login: 'bpa', duree: 5, debut: '15/04/2025', etat: 'Approuvé',   motif: 'Vacances printemps' },
                    { id: 3, employe: 'Paul Blanc',    login: 'bpa', duree: 2, debut: '30/03/2025', etat: 'Refusé',     motif: 'Formation externe' },
                    { id: 4, employe: 'Mathis Quelen', login: 'mqu', duree: 7, debut: '20/06/2025', etat: 'En attente', motif: 'Vacances été' },
                ],
            };
            newWindow.mtcClickZones = [];
        }

        // Fetch live news for veille window
        if (icon.id === 'veille') this.fetchLiveNews(newWindow);

        // Animate window opening
        this.animateWindowOpen(newWindow);
    }

    async fetchLiveNews(win) {
        try {
            const tags = ['security', 'cybersecurity', 'ai', 'hacking'];
            const responses = await Promise.all(
                tags.map(t => fetch(`https://dev.to/api/articles?tag=${t}&per_page=3&state=fresh`).then(r => r.json()))
            );
            const seen = new Set();
            const articles = responses.flat()
                .filter(a => { if (seen.has(a.id)) return false; seen.add(a.id); return true; })
                .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
                .slice(0, 8);
            win.liveArticles = articles;
            win.liveArticlesLoaded = true;
            win.articleLinks = [];
            if (this.screenCtx) this.updateOS(this.screenCtx);
        } catch {
            win.liveArticles = [];
            win.liveArticlesLoaded = true;
            if (this.screenCtx) this.updateOS(this.screenCtx);
        }
    }

    handleActiveInput(e) {
        const inp = this.desktopState.activeInput;
        const win = this.windows.find(w => w.id === inp.windowId);
        if (!win) { this.desktopState.activeInput = null; return; }

        if (e.key === 'Escape') {
            this.desktopState.activeInput = null;
            this.updateOS(this.screenCtx); return;
        }
        if (inp.field === 'browserUrl') {
            if (e.key === 'Backspace') { inp.value = inp.value.slice(0, -1); }
            else if (e.key === 'Enter') {
                win.browserUrl = inp.value;
                win.browserContent = null;
                this.desktopState.activeInput = null;
                this.fetchBrowserPage(win);
                return;
            } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) { inp.value += e.key; }
        } else if (inp.field === 'termInput') {
            e.preventDefault();
            if (e.key === 'Backspace') { win.termInput = win.termInput.slice(0, -1); }
            else if (e.key === 'Enter') {
                const cmd = win.termInput.trim();
                win.termHistory.unshift(cmd);
                win.termHistIdx = -1;
                win.termOutput.push('Virgile-PC ~ % ' + cmd);
                this.executeTerminalCommand(win, cmd);
                win.termInput = '';
            } else if (e.key === 'ArrowUp') {
                if (win.termHistIdx < win.termHistory.length - 1) {
                    win.termHistIdx++;
                    win.termInput = win.termHistory[win.termHistIdx] || '';
                }
            } else if (e.key === 'ArrowDown') {
                if (win.termHistIdx > 0) { win.termHistIdx--; win.termInput = win.termHistory[win.termHistIdx] || ''; }
                else { win.termHistIdx = -1; win.termInput = ''; }
            } else if (e.ctrlKey && e.key === 'c') {
                win.termOutput.push('^C'); win.termInput = '';
            } else if (e.ctrlKey && e.key === 'l') {
                win.termOutput = []; win.termInput = '';
            } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) { win.termInput += e.key; }
        }
        this.updateOS(this.screenCtx);
    }

    executeTerminalCommand(win, cmd) {
        if (!cmd) { win.termOutput.push(''); return; }
        const lower = cmd.toLowerCase().trim();
        if (lower === 'help') {
            win.termOutput.push('Commandes disponibles :');
            win.termOutput.push('  whoami        - Afficher l\'utilisateur');
            win.termOutput.push('  pwd           - Répertoire courant');
            win.termOutput.push('  ls            - Lister les fichiers');
            win.termOutput.push('  ls projects   - Lister les projets');
            win.termOutput.push('  git log --oneline - Historique git');
            win.termOutput.push('  neofetch      - Infos système');
            win.termOutput.push('  date          - Date et heure');
            win.termOutput.push('  node -v       - Version Node.js');
            win.termOutput.push('  npm -v        - Version npm');
            win.termOutput.push('  cat README.md - Afficher README');
            win.termOutput.push('  open <projet> - Ouvrir un projet');
            win.termOutput.push('  clear         - Vider le terminal');
        } else if (lower === 'whoami') {
            win.termOutput.push('virgile');
        } else if (lower === 'pwd') {
            win.termOutput.push('/home/virgile/bureau');
        } else if (lower === 'ls') {
            win.termOutput.push('Bureau/  Projets/  Documents/  Images/  Téléchargements/');
        } else if (lower === 'ls projects' || lower === 'ls projets') {
            win.termOutput.push('MT-Congés/  RFTG/  Mission-Assureur/  Anglais-Appli/  Portfolio-3D/');
        } else if (lower === 'git log --oneline') {
            win.termOutput.push('a3f2d1c feat: add Three.js virtual OS desktop');
            win.termOutput.push('8b4e9f2 fix: GitHub Actions deploy workflow');
            win.termOutput.push('c7a1b3d chore: migrate Vite + assets to public/');
            win.termOutput.push('2d9f4e1 feat: add desktop menus and UI polish');
            win.termOutput.push('f5c8a0b init: setup gaming PC 3D scene with Three.js');
        } else if (lower === 'neofetch') {
            win.termOutput.push('       ___           virgile@Virgile-PC');
            win.termOutput.push('      /   \\          ------------------');
            win.termOutput.push('     /  ■  \\         OS: Windows 11 Pro x64');
            win.termOutput.push('    /  ■ ■  \\        CPU: AMD Ryzen 5 5600 (12) @ 3.5GHz');
            win.termOutput.push('   /  ■ ■ ■  \\       RAM: 16384MiB');
            win.termOutput.push('  /___________\\      Theme: Dark');
            win.termOutput.push('                     Node: v20.11.0');
            win.termOutput.push('                     npm: v10.2.4');
        } else if (lower === 'clear') {
            win.termOutput = [];
        } else if (lower === 'date') {
            win.termOutput.push(new Date().toLocaleString('fr-FR'));
        } else if (lower === 'node -v') {
            win.termOutput.push('v20.11.0');
        } else if (lower === 'npm -v') {
            win.termOutput.push('10.2.4');
        } else if (lower === 'cat readme.md') {
            win.termOutput.push('# Portfolio - Virgile Allix');
            win.termOutput.push('');
            win.termOutput.push('Bureau virtuel 3D interactif présentant mes projets BTS SIO SLAM.');
            win.termOutput.push('Développé avec Three.js et Vite.');
            win.termOutput.push('');
            win.termOutput.push('## Projets');
            win.termOutput.push('- MT-Congés : App Java de gestion des congés');
            win.termOutput.push('- RFTG : Location de films full-stack (Spring Boot + Laravel + Android)');
            win.termOutput.push('- Mission Assureur : Laravel en milieu professionnel');
            win.termOutput.push('- Anglais-Appli : E-commerce IA Next.js + TypeScript');
        } else if (lower.startsWith('open ')) {
            const projectName = lower.slice(5).trim();
            const mapping = {
                'mt-conges': 'projet1', 'mtconges': 'projet1', 'mt-congés': 'projet1',
                'rftg': 'projet2',
                'mission-assureur': 'projet3', 'assureur': 'projet3',
                'anglais-appli': 'projet4', 'anglais': 'projet4',
                'portfolio-3d': 'presentation', 'portfolio': 'presentation',
                'veille': 'veille', 'e5': 'e5'
            };
            const iconId = mapping[projectName];
            if (iconId) {
                const icon = this.desktopState.icons.find(i => i.id === iconId);
                if (icon) {
                    win.termOutput.push('Ouverture de ' + icon.name + '...');
                    this.openWindow(icon);
                } else {
                    win.termOutput.push('open: projet introuvable: ' + projectName);
                }
            } else {
                win.termOutput.push('open: projet inconnu: ' + projectName);
                win.termOutput.push('Projets disponibles: mt-conges, rftg, mission-assureur, anglais-appli, portfolio-3d, veille, e5');
            }
        } else {
            win.termOutput.push('command not found: ' + cmd + '. Type "help" for commands.');
        }
        win.termOutput.push('');
    }

    async fetchBrowserPage(win) {
        win.browserLoading = true;
        this.updateOS(this.screenCtx);
        try {
            const url = (win.browserUrl || '').toLowerCase();
            if (url.includes('github.com/virgileallix') || url.includes('github.com/virgile')) {
                const [profileRes, reposRes] = await Promise.all([
                    fetch('https://api.github.com/users/virgileallix'),
                    fetch('https://api.github.com/users/virgileallix/repos?sort=updated&per_page=6')
                ]);
                const profile = await profileRes.json();
                const repos = await reposRes.json();
                win.browserContent = { type: 'github', profile, repos };
            } else if (url.includes('dev.to')) {
                const res = await fetch('https://dev.to/api/articles?tag=javascript&per_page=6');
                const articles = await res.json();
                win.browserContent = { type: 'devto', articles };
            } else if (url.includes('virgile-allix.github.io/anglais-appli') || url.includes('anglais-appli')) {
                win.browserContent = { type: 'anglais' };
            } else if (url.includes('google.com')) {
                win.browserContent = { type: 'google' };
            } else if (url.includes('localhost') || url.includes('virgileallix.github.io')) {
                win.browserContent = { type: 'portfolio' };
            } else {
                win.browserContent = { type: '404', url: win.browserUrl };
            }
        } catch (err) {
            win.browserContent = { type: '404', url: win.browserUrl };
        }
        win.browserLoading = false;
        if (this.screenCtx) this.updateOS(this.screenCtx);
    }

    // Animation d'ouverture de fenêtre
    animateWindowOpen(win) {
        const duration = 300; // ms
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing fonction (bounce effect)
            const easeOutBack = (t) => {
                const c1 = 1.70158;
                const c3 = c1 + 1;
                return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
            };

            win.animScale = 0.5 + (easeOutBack(progress) * 0.5);
            win.animOpacity = progress;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                win.isAnimating = false;
                win.animScale = 1;
                win.animOpacity = 1;
            }

            this.updateOS(this.screenCtx);
        };

        animate();
    }

    openImageViewer(img, src) {
        // Create a fullscreen image viewer window
        const scaleX = this.canvasWidth / 2560;
        const scaleY = this.canvasHeight / 1440;

        // Calculate image dimensions to fit screen while maintaining aspect ratio
        const maxWidth = this.canvasWidth * 0.9;
        const maxHeight = this.canvasHeight * 0.9;

        let displayWidth = img.width;
        let displayHeight = img.height;

        // Scale down if image is too large
        if (displayWidth > maxWidth || displayHeight > maxHeight) {
            const widthRatio = maxWidth / displayWidth;
            const heightRatio = maxHeight / displayHeight;
            const scale = Math.min(widthRatio, heightRatio);

            displayWidth = displayWidth * scale;
            displayHeight = displayHeight * scale;
        }

        // Create viewer window centered on screen
        const viewerWindow = {
            id: 'image-viewer',
            title: '🖼️ Aperçu Image',
            x: (this.canvasWidth - displayWidth - 40) / 2,
            y: (this.canvasHeight - displayHeight - 110) / 2,
            w: displayWidth + 40,
            h: displayHeight + 110,
            minimized: false,
            maximized: false,
            scrollOffset: 0,
            isImageViewer: true,
            viewerImage: img,
            viewerImageWidth: displayWidth,
            viewerImageHeight: displayHeight,
            // Animation properties
            animScale: 0.5,
            animOpacity: 0,
            isAnimating: true
        };

        // Close existing image viewer if any
        const existingViewer = this.windows.findIndex(w => w.isImageViewer);
        if (existingViewer !== -1) {
            this.windows.splice(existingViewer, 1);
        }

        this.windows.push(viewerWindow);
        this.animateWindowOpen(viewerWindow);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.composer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Stop all animations if user prefers reduced motion
        if (this.reducedMotion) {
            this.controls.update();
            this.composer.render();
            return;
        }

        // Limit FPS for low-end devices (skip frames)
        if (this.performanceMode === 'low') {
            this.frameSkipCounter = (this.frameSkipCounter || 0) + 1;
            if (this.frameSkipCounter % 2 !== 0) {
                // Skip every other frame on low-end
                return;
            }
        }

        this.time += 0.01;

        // Update controls
        this.controls.update();

        // Animer les particules
        if (this.particles) {
            this.particles.rotation.y += 0.0005;
            const positions = this.particles.geometry.attributes.position.array;
            const colors = this.particles.geometry.attributes.color.array;

            for (let i = 0; i < positions.length; i += 3) {
                // Mouvement vertical sinusoïdal
                positions[i + 1] += Math.sin(this.time + i) * 0.005;

                // Rebond sur les limites
                if (positions[i + 1] > 8) positions[i + 1] = 1;
                if (positions[i + 1] < 1) positions[i + 1] = 8;

                // Cycle de couleur RGB
                const hue = (this.time * 0.05 + i * 0.01) % 1;
                const color = new THREE.Color();
                color.setHSL(hue, 1, 0.5);
                colors[i] = color.r;
                colors[i + 1] = color.g;
                colors[i + 2] = color.b;
            }

            this.particles.geometry.attributes.position.needsUpdate = true;
            this.particles.geometry.attributes.color.needsUpdate = true;
        }

        // Animer la chaise (balancement subtil)
        if (this.chair && this.chair.userData.originalRotation !== undefined) {
            this.chair.rotation.y = this.chair.userData.originalRotation +
                Math.sin(this.time * this.chair.userData.swaySpeed) * this.chair.userData.swayAmount;
        }

        // Animer les LEDs RGB du PC
        if (this.pcCase) {
            this.pcCase.traverse((child) => {
                if (child.userData.isRGBLight && child.material) {
                    // Cycle RGB
                    const hue = (this.time * 0.1) % 1;
                    child.material.emissive.setHSL(hue, 1, 0.5);
                }
            });

            // Old fallback animation pour les objets basiques
            this.pcCase.children.forEach((child, i) => {
                if (child.material && child.material.type === 'MeshBasicMaterial') {
                    child.material.opacity = 0.6 + Math.sin(this.time * 2 + i) * 0.2;
                }
            });
        }

        // Render via post-processing composer
        this.composer.render();
    }
}

// Initialize et exposer globalement
let app;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app = new GamerSetup3D();
        window.app = app; // Exposer globalement pour les boutons
    });
} else {
    app = new GamerSetup3D();
    window.app = app;
}
