# MétéoMada

MétéoMada est une application météo légère et responsive conçue pour Madagascar. Elle affiche la météo actuelle, les prévisions sur 7 jours, et propose une recherche de villes dédiée au territoire malgache.

## Fonctionnalités principales

- Recherche de villes à Madagascar avec suggestions en temps réel
- Sélection rapide de villes populaires comme Antananarivo, Toamasina, Nosy Be
- Géolocalisation pour obtenir la météo du lieu courant
- Météo actuelle avec température, ressenti, humidité, vent, pression et indice UV
- Prévisions 7 jours avec icônes et températures minimales/maximales
- Aperçu des 24 prochaines heures avec pluie, température et météo horaire
- Thème clair / sombre mémorisé dans le navigateur
- UI moderne, responsive et optimisée pour mobile

## Comment utiliser le projet

1. Installe les dépendances :

```bash
npm install
```

2. Lance le serveur de développement :

```bash
npm run dev
```

3. Ouvre `http://localhost:5173` dans ton navigateur.

## Commandes utiles

- `npm run dev` : démarre le projet en mode développement
- `npm run build` : génère le build optimisé pour la production
- `npm run preview` : prévisualise le build localement
- `npm run lint` : vérifie le code avec ESLint

## Architecture du projet

- `src/App.jsx` : composant principal qui gère la recherche de ville, le thème, la géolocalisation et l’appel de l’API météo
- `src/components/Today.jsx` : affiche la météo du jour, les statistiques et les prévisions horaires
- `src/components/WeekDay.jsx` : affiche chaque carte de prévision journalière
- `src/App.css` : styles globaux et mise en page responsive
- `src/utils/` : fonctions utilitaires pour les données météo, les emojis et le formatage
- `public/` : ressources statiques

## Détails techniques

- L’application utilise l’API Open-Meteo pour récupérer les données météo actuelles et les prévisions.
- Les villes recherchées sont limitées à Madagascar.
- Le thème clair/sombre est conservé dans `localStorage`.
- Les données météo sont automatiquement rafraîchies toutes les 10 minutes.



