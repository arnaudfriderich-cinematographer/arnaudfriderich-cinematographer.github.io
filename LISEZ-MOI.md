# Site — Arnaud Friderich, directeur de la photographie

## Voir le site
Double-cliquer sur `index.html` : il s'ouvre dans le navigateur, sans installation.
(Les polices viennent de Google Fonts : sans connexion, le site s'affiche avec Helvetica.)

## Modifier le contenu
Tout est dans **`js/data.js`** :
- `bio` : le texte de l'onglet Bio du menu, en français (`fr`) et en anglais (`en`), un paragraphe par ligne
- `contact` : Instagram, e-mail (affichés en icônes cliquables), téléphone, agent. Un champ vide n'est pas affiché
- `clients` : la liste des marques (en bas de page, avec les réalisateurs et le contact)
- `projects` : les films (titre, réalisateur, production, catégorie, format)
- `layout` : la place et la taille de chaque film dans la grille (1 film par ligne = pleine largeur,
  2 = moitié, 3 = tiers, ou un film vertical en grand à côté de deux films empilés)

## Ajouter un film
1. Exporter le film en MP4 H.264 1080p (environ 8 Mbit/s) → `media/films/<nom>.mp4`
2. Exporter une boucle de 6 s sans son, en 720p → `media/previews/<nom>.mp4`
3. Exporter une image du film en JPG, 1920 px de large → `media/posters/<nom>.jpg`,
   et la même en 960 px → `media/posters/<nom>-sm.jpg`
4. Ajouter une ligne dans `projects` avec `slug: "<nom>"`, le titre, le réalisateur, la catégorie et le ratio,
   puis placer le film dans `layout`

## Mettre en ligne gratuitement (GitHub Pages)
1. Créer un compte gratuit sur https://github.com
2. Installer GitHub Desktop (https://desktop.github.com) et se connecter avec ce compte
3. Dans GitHub Desktop : File > Add Local Repository > choisir ce dossier `SITE`,
   puis « create a repository » > Create Repository
4. Cliquer sur « Publish repository », décocher « Keep this code private », puis Publish
   (l'envoi des 545 Mo prend quelques minutes)
5. Sur github.com, ouvrir le dépôt > Settings > Pages > « Deploy from a branch »,
   choisir la branche `main` et le dossier `/ (root)`, puis Save
6. Après 1 à 3 minutes, le site est en ligne à l'adresse affichée sur cette même page

Astuce : nommer le dépôt `<nom-d-utilisateur>.github.io` pour avoir l'adresse courte
`https://<nom-d-utilisateur>.github.io`. Un nom de domaine personnel (arnaudfriderich.com…)
s'ajoute dans Settings > Pages > Custom domain (c'est la seule partie payante, environ 10 à 15 € par an).

Pour mettre à jour : modifier les fichiers, puis dans GitHub Desktop, Commit puis Push origin.

Limites de GitHub Pages : 1 Go pour le site, 100 Mo maximum par fichier, environ 100 Go de trafic
par mois. Éviter de remplacer souvent les vidéos : chaque version reste dans l'historique du dépôt.

Lien direct vers un film : `adresse-du-site/#drive-baby-drive` ouvre directement le lecteur.
