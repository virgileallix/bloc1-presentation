# Présentation Oral BTS SIO SLAM - Bloc 1
## Virgile Allix

**Durée totale : 10 minutes**
- 1min30 : Présentation personnelle
- 3min : Projet 1 - MT-Congés
- 3min : Projet 2 - Portfolio / Constructeur 3D Minecraft
- 2min30 : Veille technologique

---

## 1. PRÉSENTATION PERSONNELLE (1min30)

### Qui suis-je ?
- **Nom** : Virgile Allix
- **Formation** : BTS SIO option SLAM
- **Statut** : Étudiant en alternance - Développeur

### Mon parcours
- Passionné par le développement logiciel et la cybersécurité
- Formation axée sur la programmation orientée objet et le développement d'applications
- Expérience en alternance me permettant d'appliquer mes connaissances en situation réelle

### Mes compétences techniques
- **Langages** : Java, JavaScript, HTML/CSS
- **Base de données** : MySQL
- **Méthodologies** : Architecture MVC, patterns DAO/POJO
- **Outils** : Git, Java Swing

### Mes objectifs professionnels
- Devenir développeur full-stack
- Approfondir mes compétences en cybersécurité
- Contribuer à des projets innovants combinant technique et créativité

---

## 2. PROJET 1 : MT-CONGÉS (3min)

### Contexte et Problématique
**Type** : Projet scolaire (3 mois - 2024)

**Problématique** : Comment gérer efficacement les demandes de congés dans une organisation avec différents niveaux de hiérarchie tout en garantissant la sécurité des données ?

### Technologies Utilisées
- **Backend** : Java 17
- **Interface** : Java Swing
- **Base de données** : MySQL
- **Architecture** : MVC (Modèle-Vue-Contrôleur)
- **Patterns** : DAO (Data Access Object), POJO (Plain Old Java Object)
- **Versionning** : Git

### Fonctionnalités Développées

#### Système d'authentification sécurisé
- Connexion avec verrouillage après tentatives échouées
- Réinitialisation de mot de passe
- Sessions limitées dans le temps

#### Gestion des rôles utilisateurs
- **Administrateur** : gestion complète des utilisateurs
- **Responsable** : validation des congés de son équipe
- **Employé** : demandes de congés personnelles

#### Système de logging
- Traçabilité de toutes les actions
- Interface adaptative selon le rôle

### Difficultés Rencontrées et Solutions

#### Sécurité des données
**Problème** : Risques d'injection SQL et d'accès non autorisés
**Solution** :
- Utilisation du pattern DAO pour toutes les requêtes
- Validation stricte des entrées utilisateur
- Protection contre les injections SQL

#### Gestion de la complexité
**Problème** : Architecture modulaire difficile à maintenir
**Solution** :
- Application stricte du pattern MVC
- Séparation claire des responsabilités
- Documentation du code

#### Conformité RGPD
**Problème** : Gestion des données personnelles sensibles
**Solution** :
- Intégration dès la conception
- Système de logging conforme
- Gestion sécurisée des mots de passe

### Résultats et Apprentissages
- Application fonctionnelle et sécurisée
- Maîtrise de l'architecture MVC
- Compréhension approfondie des enjeux de sécurité
- Gestion de projet de A à Z

### Compétences du Bloc 1 Validées
- **Développer la présence en ligne de l'organisation**
- **Travailler en mode projet**
- **Mettre à disposition des utilisateurs un service informatique**
- **Organiser son développement professionnel**

---

## 3. PROJET 2 : PORTFOLIO & CONSTRUCTEUR 3D MINECRAFT (3min)

### Contexte et Problématique
**Type** : Projet personnel et professionnel

**Problématique** : Comment créer un portfolio interactif et innovant qui démontre mes compétences techniques tout en proposant une expérience utilisateur unique ?

### Technologies Utilisées
- **Frontend** : HTML5, CSS3, JavaScript
- **3D** : WebGL (pour le constructeur Minecraft)
- **PWA** : Service Worker, Manifest.json
- **Architecture** : Modularité JavaScript (ES6+)

### Fonctionnalités Développées

#### Portfolio Principal
- Interface responsive et moderne
- Section projets détaillée
- Page de veille technologique
- Système de contact

#### Constructeur 3D Minecraft (Feature phare)
**Innovation majeure** : Outil interactif permettant de construire en 3D
- Rendu 3D avec WebGL
- Manipulation de blocs en temps réel
- Interface intuitive de création

#### Fonctionnalités annexes
- **Système d'achievements** : Gamification de l'expérience
- **Easter eggs** : Éléments interactifs cachés
- **Système audio** : Ambiance sonore
- **PWA** : Installation possible comme application

### Architecture Technique

#### Modularité du code
```
- minecraft-builder-3d.js (module 3D)
- achievements.js (système de récompenses)
- easter-eggs.js (interactions cachées)
- sounds.js (gestion audio)
- minigames.js (mini-jeux intégrés)
```

#### Performance et optimisation
- Chargement asynchrone des modules
- Optimisation du rendu 3D
- Gestion efficace de la mémoire

### Difficultés Rencontrées et Solutions

#### Rendu 3D performant
**Problème** : WebGL complexe et gourmand en ressources
**Solution** :
- Étude approfondie de WebGL
- Optimisation du nombre de vertices
- Utilisation de techniques de culling

#### Compatibilité navigateurs
**Problème** : Différences entre navigateurs pour WebGL
**Solution** :
- Tests multi-navigateurs
- Fallbacks pour fonctionnalités non supportées
- Progressive enhancement

#### Expérience utilisateur
**Problème** : Interface 3D intimidante pour certains utilisateurs
**Solution** :
- Tutoriel intégré
- Contrôles intuitifs
- Documentation claire

### Résultats et Impact
- Portfolio unique et mémorable
- Démonstration concrète de compétences variées
- Plus de 38 commits (développement continu)
- Feedback positifs des visiteurs

### Compétences du Bloc 1 Validées
- **Développer la présence en ligne** : Portfolio public et professionnel
- **Travailler en mode projet** : Gestion autonome du projet
- **Innovation technique** : Utilisation de technologies avancées (WebGL)
- **Créativité et originalité** : Approche unique du portfolio

---

## 4. VEILLE TECHNOLOGIQUE (2min30)

### Sujet de Veille
**"L'essor des attaques par intelligence artificielle"**

### Pourquoi ce sujet ?
- Thématique d'actualité en cybersécurité
- Lien direct avec mes compétences en développement
- Importance croissante de l'IA dans la sécurité informatique

### Axes de Recherche

#### 1. Attaques alimentées par l'IA
- **Phishing sophistiqué** : Génération automatique d'e-mails crédibles
- **Code malveillant** : Création automatisée de malwares
- **Social engineering** : Manipulation assistée par IA

#### 2. Défense par l'IA
- **Analyse comportementale** : Détection d'anomalies
- **Anticipation des menaces** : Prédiction d'attaques
- **Réponse automatisée** : Contre-mesures en temps réel

#### 3. Course technologique
- Compétition entre attaquants et défenseurs
- Évolution rapide des techniques
- Nécessité de mise à jour constante

#### 4. Impact organisationnel
- Intégration de l'IA dans les stratégies de sécurité
- Formation des équipes
- Investissements nécessaires

### Méthodologie de Veille

#### Sources d'information
- Articles de recherche en cybersécurité
- Conférences et webinaires
- Blogs spécialisés
- Actualités tech

#### Fréquence
- Veille quotidienne sur l'actualité
- Analyse hebdomadaire approfondie
- Synthèse mensuelle

#### Outils utilisés
- Agrégateurs de flux RSS
- Alertes Google
- Réseaux sociaux professionnels (LinkedIn, Twitter)
- Plateformes spécialisées

### Enseignements et Applications

#### Pour mes projets
- Intégration de bonnes pratiques de sécurité
- Conscience des risques liés à l'IA
- Anticipation des vulnérabilités

#### Pour ma formation
- Compréhension des enjeux actuels
- Culture technique à jour
- Préparation aux défis futurs

#### Pour ma carrière
- Spécialisation possible en cybersécurité
- Compétences recherchées par les entreprises
- Vision prospective du métier

### Évolution de la Veille
- Documentation continue sur mon portfolio
- Partage de mes découvertes
- Approfondissement progressif du sujet

---

## CONCLUSION

### Synthèse des Compétences Acquises
- Développement d'applications complètes (backend/frontend)
- Maîtrise des architectures logicielles (MVC, patterns)
- Conscience des enjeux de sécurité
- Créativité et innovation technique
- Veille technologique active

### Mon Projet Professionnel
- Continuer à me former sur les technologies émergentes
- Approfondir la cybersécurité et l'IA
- Contribuer à des projets ambitieux
- Devenir développeur full-stack avec expertise en sécurité

### Questions ?
*Je suis prêt à répondre à vos questions sur mes projets et ma démarche.*

---

## ANNEXES - TIMING DÉTAILLÉ

### Déroulé de la présentation (10 minutes)

**00:00 - 01:30** : Présentation personnelle
- Introduction (15s)
- Parcours et formation (30s)
- Compétences techniques (30s)
- Objectifs professionnels (15s)

**01:30 - 04:30** : Projet MT-Congés
- Contexte et problématique (30s)
- Technologies utilisées (30s)
- Fonctionnalités développées (60s)
- Difficultés et solutions (45s)
- Résultats et apprentissages (15s)

**04:30 - 07:30** : Projet Portfolio/Constructeur 3D
- Contexte et problématique (20s)
- Technologies utilisées (30s)
- Fonctionnalités développées (70s)
- Difficultés et solutions (45s)
- Résultats et impact (15s)

**07:30 - 10:00** : Veille technologique
- Sujet et justification (20s)
- Axes de recherche (60s)
- Méthodologie de veille (40s)
- Enseignements et applications (30s)
- Conclusion générale (10s)

---

## CONSEILS POUR L'ORAL

### Avant la présentation
- Répéter plusieurs fois le discours
- Respecter le timing de chaque section
- Préparer des supports visuels (screenshots, schémas)
- Anticiper les questions du jury

### Pendant la présentation
- Parler clairement et calmement
- Maintenir le contact visuel avec le jury
- Utiliser un vocabulaire technique approprié
- Montrer son enthousiasme pour les projets

### Gestion du timing
- Avoir une montre ou chronomètre visible
- Prévoir des points de repère temporels
- Pouvoir adapter si besoin (réduire ou développer)

### Points d'attention du jury
- Compétences techniques démontrées
- Capacité à résoudre des problèmes
- Autonomie et initiative
- Veille technologique active
- Communication professionnelle

---

**Portfolio en ligne** : [https://virgileallix.github.io/portfolio/](https://virgileallix.github.io/portfolio/)
