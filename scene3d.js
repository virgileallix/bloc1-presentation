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
        this.loader = new THREE.GLTFLoader();
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

        // Image cache for project images
        this.imageCache = {};

        // Contenu des projets avec images
        this.projects = {
            presentation: {
                title: "Présentation - Virgile Allix",
                sections: [
                    { type: 'title', text: 'Virgile Allix' },
                    { type: 'subtitle', text: 'Développeur Full Stack • BTS SIO SLAM' },
                    { type: 'text', text: '💻 Passionné de développement' },
                    { type: 'text', text: '' },

                    { type: 'heading', text: '🎓 Formation' },
                    { type: 'text', text: 'BTS Services Informatiques aux Organisations' },
                    { type: 'text', text: 'Option SLAM - 2ème année' },
                    { type: 'text', text: '(Solutions Logicielles et Applications Métiers)' },
                    { type: 'text', text: '' },

                    { type: 'heading', text: '🛠️ Compétences Techniques' },
                    { type: 'text', text: 'Back-end & Frameworks' },
                    { type: 'text', text: '• Laravel / PHP - Framework moderne' },
                    { type: 'text', text: '• Java - Développement orienté objet (MVC, POO)' },
                    { type: 'text', text: '• APIs REST - Architecture et intégration' },
                    { type: 'text', text: '' },
                    { type: 'text', text: 'Front-end & Interfaces' },
                    { type: 'text', text: '• JavaScript - ES6+ et frameworks modernes' },
                    { type: 'text', text: '• HTML5 / CSS3 - Interfaces responsives' },
                    { type: 'text', text: '• Three.js - Visualisation 3D et WebGL' },
                    { type: 'text', text: '' },
                    { type: 'text', text: 'Bases de données' },
                    { type: 'text', text: '• MySQL - Conception et optimisation' },
                    { type: 'text', text: '• Firebase - Solutions cloud et temps réel' },
                    { type: 'text', text: '' },
                    { type: 'text', text: 'Outils & Méthodes' },
                    { type: 'text', text: '• Git / GitHub - Versioning et collaboration' },
                    { type: 'text', text: '• Architecture MVC - Conception logicielle' },
                    { type: 'text', text: '• Tests et Documentation - Qualité du code' },
                    { type: 'text', text: '' },

                    { type: 'heading', text: '💼 Expérience Professionnelle' },
                    { type: 'text', text: '• Mission en entreprise pour un client assureur' },
                    { type: 'text', text: '• Développement dapplication interne' },
                    { type: 'text', text: '• Travail en équipe et respect des normes secteur' },
                    { type: 'text', text: '' },

                    { type: 'heading', text: '🌟 Soft Skills' },
                    { type: 'text', text: '✓ Autonomie - Capacité à mener des projets' },
                    { type: 'text', text: '✓ Travail en équipe - Collaboration efficace' },
                    { type: 'text', text: '✓ Rigueur - Attention au détail et qualité' },
                    { type: 'text', text: '✓ Curiosité technique - Veille et apprentissage continu' },
                    { type: 'text', text: '' },

                    { type: 'heading', text: '🎮 Centres dintérêt' },
                    { type: 'text', text: '• Gaming & Jeux vidéo - Passion et culture gaming' },
                    { type: 'text', text: '• Développement personnel - Projets side projects' },
                    { type: 'text', text: '• Nouvelles technologies - Veille technologique' },
                    { type: 'text', text: '' },

                    { type: 'heading', text: '📧 Contact' },
                    { type: 'text', text: '📧 Email : virgile.allix11@gmail.com' },
                    { type: 'text', text: '💻 GitHub : github.com/virgile-allix' },
                    { type: 'text', text: '🌐 Portfolio : Ce site web' }
                ]
            },
            projet1: {
                title: "MTongés - Application de gestion des congés",
                sections: [
                    { type: 'title', text: 'MTCcongés' },
                    { type: 'subtitle', text: 'Application Java • BTS SIO SLAM' },
                    { type: 'image', width: 450, height: 250, label: 'Écran de connexion', src: 'images/mtconges/mtconges_login-screen.png' },

                    { type: 'heading', text: '📋 Présentation' },
                    { type: 'text', text: 'Application de gestion des congés développée dans le cadre' },
                    { type: 'text', text: 'dun projet BTS SIO SLAM. Conçue en Java 17 avec une' },
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

                    { type: 'heading', text: '💡 Compétences développées' },
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
                title: "RFTG - Application de réservation de DVD",
                sections: [
                    { type: 'title', text: 'RFTG' },
                    { type: 'subtitle', text: 'Application Full-Stack • BTS SIO' },
                    { type: 'image', width: 500, height: 300, label: 'Application RFTG', src: 'images/projet-rftg.jpg' },

                    { type: 'heading', text: '📋 Présentation du projet' },
                    { type: 'text', text: 'Système complet de gestion de DVD pour un parc à thème,' },
                    { type: 'text', text: 'incluant une interface web administrative et une' },
                    { type: 'text', text: 'application mobile pour les utilisateurs.' },

                    { type: 'heading', text: '🏗️ Architecture - Univers Mario' },
                    { type: 'text', text: 'Le projet RFTG est structuré en quatre composantes' },
                    { type: 'text', text: 'principales, chacune inspirée de lunivers Mario :' },
                    { type: 'text', text: '' },
                    { type: 'text', text: '📱 Luigi - Application Mobile' },
                    { type: 'text', text: '   • Application Android développée en Java' },
                    { type: 'text', text: '   • Consultation et réservation de DVD' },
                    { type: 'text', text: '   • Interface utilisateur intuitive' },
                    { type: 'text', text: '' },
                    { type: 'text', text: '🖥️ Mario - Application Web' },
                    { type: 'text', text: '   • Interface web dadministration en PHP' },
                    { type: 'text', text: '   • Gestion du catalogue de DVD' },
                    { type: 'text', text: '   • Gestion des réservations et utilisateurs' },
                    { type: 'text', text: '' },
                    { type: 'text', text: '🔌 Toad - API Webservice' },
                    { type: 'text', text: '   • API REST sécurisée' },
                    { type: 'text', text: '   • Pont entre applications et base de données' },
                    { type: 'text', text: '   • Communication fluide et sécurisée' },
                    { type: 'text', text: '' },
                    { type: 'text', text: '🗄️ Peach - Base de données' },
                    { type: 'text', text: '   • Base MySQL inspirée du modèle Sakila' },
                    { type: 'text', text: '   • Stockage DVD, clients et réservations' },

                    { type: 'heading', text: '🛠️ Technologies utilisées' },
                    { type: 'text', text: 'Back-end : PHP, MySQL' },
                    { type: 'text', text: 'Front-end : HTML, CSS, JavaScript' },
                    { type: 'text', text: 'Mobile : Java, Android Studio, XML' },
                    { type: 'text', text: 'API : REST API sécurisée' },
                    { type: 'text', text: 'Base de données : MySQL (modèle Sakila)' },

                    { type: 'heading', text: '📦 Modules principaux' },
                    { type: 'text', text: '• Gestion des réservations' },
                    { type: 'text', text: '• Système dauthentification' },
                    { type: 'text', text: '• Interface mobile et web' },
                    { type: 'text', text: '• Synchronisation des données' },

                    { type: 'heading', text: '🎯 Objectif' },
                    { type: 'text', text: 'Créer un système complet de gestion de DVD pour un' },
                    { type: 'text', text: 'parc à thème avec une expérience utilisateur optimale' },
                    { type: 'text', text: 'sur mobile et web.' },

                    { type: 'heading', text: '⚡ Défis techniques' },
                    { type: 'text', text: '• Communication mobile-serveur via API REST' },
                    { type: 'text', text: '• Gestion multi-interface (web + mobile)' },
                    { type: 'text', text: '• Synchronisation des données avec MySQL' },
                    { type: 'text', text: '• Architecture modulaire et scalable' },

                    { type: 'heading', text: '💡 Statut' },
                    { type: 'text', text: 'Projet en cours de développement' }
                ]
            },
            projet3: {
                title: "Mission Assureur - Application interne",
                sections: [
                    { type: 'title', text: 'Mission Assureur' },
                    { type: 'subtitle', text: 'Expérience professionnelle' },
                    { type: 'image', width: 350, height: 200, label: 'Logo Assureur', src: 'images/assureur_logo.png' },

                    { type: 'heading', text: '📋 Présentation' },
                    { type: 'text', text: 'Mission réalisée au sein de mon entreprise pour le' },
                    { type: 'text', text: 'compte dun client assureur. Jai contribué au' },
                    { type: 'text', text: 'développement complet dune application interne en' },
                    { type: 'text', text: 'intervenant sur les phases de codage, de tests et' },
                    { type: 'text', text: 'de documentation.' },

                    { type: 'heading', text: '🎯 Détails de la mission' },
                    { type: 'text', text: 'Contexte : Mission en entreprise pour un client' },
                    { type: 'text', text: '           du secteur de lassurance' },
                    { type: 'text', text: '' },
                    { type: 'text', text: 'Rôle : Développeur - Participation au développement' },
                    { type: 'text', text: '       dune application interne' },
                    { type: 'text', text: '' },
                    { type: 'text', text: 'Missions principales :' },
                    { type: 'text', text: '• Développement et codage de fonctionnalités' },
                    { type: 'text', text: '• Tests et validation de lapplication' },
                    { type: 'text', text: '• Rédaction de la documentation technique' },

                    { type: 'heading', text: '🛠️ Technologies utilisées' },
                    { type: 'text', text: 'Framework : Laravel' },
                    { type: 'text', text: 'Base de données : SQL' },
                    { type: 'text', text: 'Back-end : PHP' },
                    { type: 'text', text: 'Front-end : JavaScript' },

                    { type: 'heading', text: '💡 Compétences développées' },
                    { type: 'text', text: '✓ Travail en équipe dans un contexte client' },
                    { type: 'text', text: '✓ Respect des normes et procédures du secteur' },
                    { type: 'text', text: '   de lassurance' },
                    { type: 'text', text: '✓ Rigueur dans les tests et la documentation' },
                    { type: 'text', text: '✓ Compréhension des enjeux métier dun assureur' },
                    { type: 'text', text: '✓ Développement avec le framework Laravel' },
                    { type: 'text', text: '✓ Gestion de projet en environnement professionnel' }
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
                    { type: 'text', text: '✓ Intégration dune API IA avancée' },
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
                    { type: 'text', text: '💻 GitHub : github.com/virgile-allix/anglais-appli' },
                    { type: 'text', text: '🤖 API IA : Meshy.ia' }
                ]
            },
            veille: {
                title: "Veille Technologique",
                sections: [
                    { type: 'title', text: 'Ma Veille Tech' },
                    { type: 'subtitle', text: 'Technologies Web & IA' },
                    { type: 'text', text: '💡 Passionné par les nouvelles technologies' },
                    { type: 'text', text: '' },

                    { type: 'heading', text: '🔍 Domaines suivis' },
                    { type: 'text', text: '' },
                    { type: 'text', text: '🤖 Intelligence Artificielle' },
                    { type: 'text', text: '• APIs IA générative (Meshy.ia, OpenAI)' },
                    { type: 'text', text: '• Intégration IA dans les applications web' },
                    { type: 'text', text: '• Génération de contenu 3D par IA' },
                    { type: 'text', text: '' },
                    { type: 'text', text: '⚛️ Frameworks JavaScript modernes' },
                    { type: 'text', text: '• Next.js et React 19' },
                    { type: 'text', text: '• TypeScript et nouveautés ES' },
                    { type: 'text', text: '• Tailwind CSS et design systems' },
                    { type: 'text', text: '' },
                    { type: 'text', text: '☁️ Cloud et Services Backend' },
                    { type: 'text', text: '• Firebase / Firestore' },
                    { type: 'text', text: '• APIs REST et GraphQL' },
                    { type: 'text', text: '• Serverless et Edge Computing' },
                    { type: 'text', text: '' },
                    { type: 'text', text: '🎮 3D et WebGL' },
                    { type: 'text', text: '• Three.js et visualisation 3D' },
                    { type: 'text', text: '• WebGL et shaders' },
                    { type: 'text', text: '• Optimisation des performances 3D' },
                    { type: 'text', text: '' },

                    { type: 'heading', text: '📚 Sources principales' },
                    { type: 'text', text: '• Documentation officielle (Next.js, React)' },
                    { type: 'text', text: '• GitHub - Exploration de projets open source' },
                    { type: 'text', text: '• Dev.to et Medium - Articles techniques' },
                    { type: 'text', text: '• YouTube - Tutoriels et conférences tech' },
                    { type: 'text', text: '• Discord - Communautés de développeurs' },
                    { type: 'text', text: '' },

                    { type: 'heading', text: '🚀 Application concrète' },
                    { type: 'text', text: '✓ Tests des nouvelles technologies dans mes projets' },
                    { type: 'text', text: '✓ Side projects pour expérimenter' },
                    { type: 'text', text: '✓ Veille quotidienne (15-30 min)' },
                    { type: 'text', text: '✓ Partage avec la communauté dev' }
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
            icons: [
                { id: 'presentation', name: 'Présentation', icon: '📝', x: 30, y: 30, tooltip: 'Ouvrir ma présentation' },
                { id: 'projet1', name: 'MT-Congés', icon: '📅', x: 30, y: 160, tooltip: 'Voir le projet MT-Congés' },
                { id: 'projet2', name: 'RFTG', icon: '💿', x: 30, y: 290, tooltip: 'Voir le projet RFTG' },
                { id: 'projet3', name: 'Mission Assureur', icon: '🏢', x: 30, y: 420, tooltip: 'Voir la mission assureur' },
                { id: 'projet4', name: 'E-commerce 3D', icon: '🛒', x: 30, y: 550, tooltip: 'E-commerce de figurines IA' },
                { id: 'veille', name: 'Veille Tech', icon: '🛡️', x: 30, y: 680, tooltip: 'Ma veille technologique' }
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

        // Shadows: désactiver ou réduire qualité selon performance
        if (this.performanceMode === 'low') {
            this.renderer.shadowMap.enabled = false; // Pas d'ombres en mode low
        } else {
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = this.performanceMode === 'medium'
                ? THREE.BasicShadowMap
                : THREE.PCFSoftShadowMap;
        }

        // OrbitControls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
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

        // Créer particules RGB
        this.createParticles();

        // Events
        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('click', (e) => this.onClick(e));
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });

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
            emissive: 0xffffff, // White emissive for brightness
            emissiveMap: screenTexture, // Use same texture for emission
            emissiveIntensity: 0.1,
            roughness: 0.2,
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

        // Virtual Cursor (if zoomed) - plus grand
        if (this.isZoomed) {
            ctx.fillStyle = '#ff00ff';
            ctx.beginPath();
            ctx.moveTo(this.desktopState.mouseX, this.desktopState.mouseY);
            ctx.lineTo(this.desktopState.mouseX + 26, this.desktopState.mouseY + 26);
            ctx.lineTo(this.desktopState.mouseX, this.desktopState.mouseY + 32);
            ctx.fill();

            // Bordure blanche pour meilleure visibilité
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.desktopState.mouseX, this.desktopState.mouseY);
            ctx.lineTo(this.desktopState.mouseX + 26, this.desktopState.mouseY + 26);
            ctx.lineTo(this.desktopState.mouseX, this.desktopState.mouseY + 32);
            ctx.closePath();
            ctx.stroke();
        }

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

        // Fond blanc avec légère transparence
        ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
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
                        ctx.fillStyle = '#000000';
                        ctx.font = 'bold 42px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif';
                        ctx.fillText(section.text, leftMargin, yPos);
                        yPos += 65;
                        break;

                    case 'subtitle':
                        ctx.fillStyle = '#666666';
                        ctx.font = 'italic 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif';
                        ctx.fillText(section.text, leftMargin, yPos);
                        yPos += 50;
                        break;

                    case 'heading':
                        ctx.fillStyle = '#0078d4';
                        ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif';
                        ctx.fillText(section.text, leftMargin, yPos);
                        yPos += 40;
                        // Underline
                        ctx.fillRect(leftMargin, yPos - 5, 280, 3);
                        yPos += 15;
                        break;

                    case 'text':
                        ctx.fillStyle = '#333333';
                        ctx.font = '21px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif';
                        ctx.fillText(section.text, leftMargin, yPos);
                        yPos += 32;
                        break;

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
        // Check if dragging - stop drag
        if (this.desktopState.isDragging) {
            this.desktopState.isDragging = false;
            this.desktopState.draggedWindow = null;
            this.updateOS(this.screenCtx);
            return;
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
            // Check Taskbar buttons
            const taskbarY = this.canvasHeight - 70;
            if (y >= taskbarY) {
                let taskbarX = 90;
                for (let i = 0; i < this.windows.length; i++) {
                    const win = this.windows[i];
                    if (x >= taskbarX && x < taskbarX + 200) {
                        // Toggle minimize/restore
                        win.minimized = !win.minimized;
                        // Bring to front if restoring
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

    openWindow(icon) {
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
        const windowWidth = 2000 * scaleX;
        const windowHeight = (icon.id === 'presentation' ? 1300 : 1100) * scaleY;

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

        // Animate window opening
        this.animateWindowOpen(newWindow);
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
    }

    animate() {
        requestAnimationFrame(() => this.animate());

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

        // Render
        this.renderer.render(this.scene, this.camera);
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
