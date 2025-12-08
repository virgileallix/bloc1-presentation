# 🎓 Présentation Oral BTS SIO SLAM - Bloc 1
## Virgile Allix

Support de présentation interactif pour l'épreuve E4 du BTS SIO option SLAM.

---

## 📋 Structure de la Présentation

**Durée totale : 10 minutes**

1. **Présentation personnelle** (1min30)
   - Parcours et formation
   - Compétences techniques
   - Objectifs professionnels

2. **Projet MT-Congés** (3min)
   - Application Java de gestion des congés
   - Architecture MVC, MySQL, Java Swing
   - Sécurité et RGPD

3. **Portfolio & Constructeur 3D Minecraft** (3min)
   - Portfolio interactif avec WebGL
   - Mini-jeux (Snake, achievements)
   - Firebase (authentification, Firestore)
   - Projets personnels créatifs

4. **Veille Technologique** (2min30)
   - IA et cybersécurité
   - Méthodologie de veille
   - Applications pratiques

---

## 🚀 Fonctionnalités du Support

### ⏱️ Chronomètre Intelligent
- Timer de 10 minutes avec affichage en temps réel
- Changement de couleur selon le temps restant :
  - 🔵 Bleu : Plus de 3 minutes
  - 🟠 Orange : Entre 1 et 3 minutes
  - 🔴 Rouge : Moins d'1 minute (avec animation pulse)
- Barre de progression visuelle en haut de page

### ⌨️ Raccourcis Clavier
- **Espace** ou **Entrée** : Démarrer/Pause le chronomètre
- **Ctrl + R** : Réinitialiser le chronomètre
- **1-4** : Navigation rapide vers les sections
  - `1` : Présentation
  - `2` : MT-Congés
  - `3` : Portfolio
  - `4` : Veille

### 🎯 Modes de Présentation
- **Mode Auto-scroll** : Défilement automatique selon le timing
- **Mode Plein écran** : Pour une présentation sans distraction
- **Mode Présentation** : Augmente la taille du texte, réduit l'opacité des contrôles

### 🎨 Design & Animations
- Interface moderne et professionnelle
- Animations de fade-in au scroll
- Cartes interactives avec effet hover
- Responsive design (mobile, tablette, desktop)
- Thème sombre/clair avec navigation fixe

---

## 💻 Technologies Utilisées

### Frontend
- **HTML5** : Structure sémantique
- **CSS3** : Design moderne avec variables CSS, flexbox, grid
- **JavaScript ES6+** : Interactivité et chronomètre

### Fonctionnalités JavaScript
- Intersection Observer API (animations au scroll)
- LocalStorage (sauvegarde potentielle)
- Fullscreen API
- Custom notifications
- Event listeners optimisés

---

## 📦 Utilisation

### Installation
```bash
# Cloner le repository
git clone https://github.com/virgileallix/bloc1-presentation.git

# Ouvrir le fichier
cd bloc1-presentation
open index.html
```

### Lancement
Ouvrir simplement `index.html` dans un navigateur moderne (Chrome, Firefox, Edge, Safari).

**Recommandé :** Utiliser un serveur local pour éviter les restrictions CORS
```bash
# Avec Python 3
python -m http.server 8000

# Avec Node.js (http-server)
npx http-server

# Puis ouvrir http://localhost:8000
```

---

## 🎮 Projets Présentés

### 1. MT-Congés
**Application Java de gestion des congés**
- Architecture MVC stricte
- Base de données MySQL
- Interface Java Swing
- Sécurité (authentification, RBAC, logging)
- Conformité RGPD

**Compétences :** Java, MySQL, Architecture logicielle, Sécurité

### 2. Portfolio Interactif
**Site web personnel avec fonctionnalités avancées**

#### Constructeur 3D Minecraft
- Rendu 3D avec WebGL pur (sans bibliothèque)
- Gestion des matrices de transformation
- Interface intuitive de construction
- Optimisations (culling, batching)

#### Mini-jeux & Projets Personnels
- **Jeu du Serpent** : Canvas 2D, logique de jeu, collisions
- **Système d'achievements** : Gamification, déblocage progressif
- **Easter eggs** : Konami code, animations cachées
- **Mini-simulations** : Physique, expérimentations

#### Intégration Firebase
- Authentification utilisateur
- Firestore (base de données temps réel)
- Hosting avec CDN global
- Scores en ligne et classements

**Compétences :** JavaScript, WebGL, Firebase, Architecture modulaire, Créativité

---

## 📚 Points Clés à Mentionner

### MT-Congés
✅ **Problématique :** Gestion des congés multi-niveaux avec sécurité
✅ **Solution :** Architecture MVC, pattern DAO, validation stricte
✅ **Difficultés :** Injection SQL, RGPD, complexité architecturale
✅ **Résultats :** Application fonctionnelle et sécurisée

### Portfolio
✅ **Problématique :** Portfolio innovant démontrant compétences variées
✅ **Solution :** WebGL 3D, Firebase, gamification
✅ **Difficultés :** Performance WebGL, compatibilité navigateurs
✅ **Résultats :** Portfolio unique avec 38+ commits

### Veille
✅ **Sujet :** IA et attaques cybersécurité
✅ **Axes :** Attaques par IA, défense par IA, course technologique
✅ **Méthodologie :** Veille quotidienne, sources variées
✅ **Applications :** Sécurité des projets, culture tech

---

## 🎯 Conseils pour l'Oral

### Avant
- ✅ Répéter plusieurs fois (chronométrer !)
- ✅ Tester le support de présentation
- ✅ Préparer des réponses aux questions potentielles
- ✅ Avoir des exemples concrets à montrer

### Pendant
- 💡 Parler clairement et avec enthousiasme
- 💡 Maintenir le contact visuel avec le jury
- 💡 Utiliser le vocabulaire technique approprié
- 💡 Montrer votre portfolio en ligne si possible
- 💡 Surveiller le chronomètre discrètement

### Questions Potentielles
- "Pourquoi avoir choisi Java pour MT-Congés ?"
- "Comment avez-vous géré la complexité de WebGL ?"
- "Quelles sont les limites de votre veille ?"
- "Comment garantissez-vous la sécurité dans vos projets ?"
- "Quels sont vos prochains projets ?"

---

## 🔗 Liens Utiles

- **Portfolio en ligne :** [https://virgileallix.github.io/portfolio/](https://virgileallix.github.io/portfolio/)
- **GitHub :** [https://github.com/virgileallix/portfolio](https://github.com/virgileallix/portfolio)

---

## 📄 Compétences du Bloc 1 Validées

### Développer la présence en ligne
✅ Portfolio public et professionnel
✅ Hébergement Firebase avec CDN
✅ Responsive design et PWA

### Travailler en mode projet
✅ Gestion autonome de projets complexes
✅ Utilisation de Git (38+ commits)
✅ Documentation et architecture

### Mettre à disposition un service informatique
✅ Application MT-Congés fonctionnelle
✅ Portfolio accessible en ligne
✅ Mini-jeux avec scores cloud

### Organiser son développement professionnel
✅ Veille technologique active
✅ Apprentissage continu (WebGL, Firebase)
✅ Projets personnels variés

---

## 🎉 Bonne Présentation !

N'oubliez pas :
- 😊 Soyez confiant et enthousiaste
- 🎯 Respectez le timing (utilisez le chronomètre !)
- 💻 Montrez vos projets avec fierté
- 🚀 Expliquez vos choix techniques

**Vous avez fait un excellent travail, montrez-le !**

---

*Créé avec ❤️ pour l'épreuve E4 du BTS SIO SLAM - 2024*
