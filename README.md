
# 🕒 Suivi des Heures de Travail (PWA)

Une application web moderne et installable (PWA) pour un suivi simple et efficace des heures de travail. Conçue pour les freelances et les professionnels, cette application permet de gérer les entrées par société, de visualiser des résumés, de filtrer les données et d'exporter des relevés d'heures en PDF.

Toutes les données sont synchronisées en temps réel avec une base de données **Supabase**, rendant l'application accessible et à jour sur tous vos appareils (desktop, tablette, mobile).

## ✨ Fonctionnalités

- **✅ Saisie Simplifiée** : Un formulaire rapide pour ajouter ou modifier vos heures de travail, avec calcul automatique de la durée.
- **🏢 Gestion des Sociétés** : Ajoutez et gérez facilement la liste de vos clients ou employeurs.
- **📊 Résumé en Temps Réel** : Visualisez le total des heures travaillées pour chaque société et un total général.
- **🔍 Filtrage Avancé** : Filtrez vos saisies par société ou par période pour retrouver facilement une information.
- **📄 Export PDF** : Générez des relevés d'heures professionnels en un clic, soit pour une société spécifique, soit sur la base de vos filtres.
- **🌙 Thème Sombre & Clair** : Basculez entre les thèmes pour un confort visuel optimal.
- **📱 PWA Installable** : Ajoutez l'application à l'écran d'accueil de votre téléphone ou de votre ordinateur pour un accès instantané, même hors ligne.
- **☁️ Synchronisation Cloud** : Grâce à Supabase, vos données sont sécurisées et disponibles sur tous vos appareils.

## 🛠️ Stack Technique

- **Frontend** : React, TypeScript
- **Styling** : Tailwind CSS
- **Bundler** : Parcel
- **Backend & Base de Données** : Supabase (PostgreSQL)
- **Génération PDF** : jsPDF

## 🚀 Démarrage en Local

Pour lancer le projet sur votre machine, suivez ces étapes.

### Prérequis

- [Node.js](https://nodejs.org/) (version 16 ou supérieure)
- Un compte [Supabase](https://supabase.com/) pour créer votre base de données.

### Installation

1.  **Clonez le dépôt :**
    ```bash
    git clone https://github.com/VOTRE_NOM_UTILISATEUR/VOTRE_REPO.git
    cd VOTRE_REPO
    ```

2.  **Installez les dépendances :**
    ```bash
    npm install
    ```

3.  **Configurez Supabase :**
    - Créez un projet sur Supabase.
    - Utilisez l'éditeur SQL pour exécuter le script de création des tables (`companies` et `work_entries`).
    - Créez un fichier `.env` à la racine du projet.
    - Ajoutez-y vos clés Supabase en utilisant le préfixe `PARCEL_` :
      ```.env
      PARCEL_SUPABASE_URL=VOTRE_URL_SUPABASE
      PARCEL_SUPABASE_ANON_KEY=VOTRE_CLE_ANON_SUPABASE
      ```

4.  **Lancez l'application :**
    ```bash
    npm start
    ```
    L'application sera disponible sur `http://localhost:1234`.
