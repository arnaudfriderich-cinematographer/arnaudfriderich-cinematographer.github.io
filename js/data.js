/*
  Contenu du site — c'est le seul fichier à modifier pour mettre à jour le portfolio.

  Pour ajouter un film :
    1. déposer la vidéo dans media/films/<slug>.mp4
    2. une boucle de 6 s sans son dans media/previews/<slug>.mp4
    3. une image dans media/posters/<slug>.jpg (+ <slug>-sm.jpg en 960 px)
    4. ajouter une entrée dans projects, puis lui donner sa place dans layout (en bas du fichier).

  ratio : largeur / hauteur de la vidéo (16/9, 9/16, 2.39…). La vignette garde ce format.
*/
window.PORTFOLIO = {
  name: "Arnaud Friderich",
  tagline: "Cinematographer", // sous le nom, en haut de la page ("" pour le masquer)

  // Texte de l'onglet Bio du menu : un paragraphe par ligne
  bio: [
    "Arnaud Friderich est chef opérateur en beauty, mode et still life pour le luxe. Il éclaire les visages, les vêtements et les objets avec un vrai souci du détail, et une image qui a du cachet.",
    "Sa lumière accompagne des maisons comme Miu Miu, Lancôme, Dior et Loewe.",
    "Basé en France.",
  ],

  // Laisser vide ("") pour masquer une ligne.
  contact: {
    instagram: "arnaud_friderich",
    email: "arnaudfriderichtarrisse@gmail.com",
    phone: "",
    agent: "",
  },

  clients: [
    "Jean Paul Gaultier", "Miu Miu", "Saint Laurent", "Loewe", "Lancôme", "L’Oréal",
    "Maison Francis Kurkdjian", "Veuve Clicquot", "Ormaie", "Kitesy",
  ],

  // Ordre du menu
  categories: [
    { id: "commercial", label: "Commercial" },
    { id: "narrative", label: "Narrative" },
    { id: "art", label: "Art Film" },
  ],

  projects: [
    // Beauty / Mode
    { slug: "lancome-community", title: "Lancôme Community", director: "Calvin Pausania", category: "commercial", ratio: 16 / 9 },
    { slug: "jean-paul-gaultier", title: "Jean Paul Gaultier", director: "Megane & Hugo", category: "commercial", ratio: 16 / 9 },
    { slug: "yves-saint-laurent", title: "Saint Laurent", director: "", category: "commercial", ratio: 16 / 9 },
    { slug: "loreal-hairstyle", title: "L’Oreal Hairstyle", director: "Samy Djazoubi", category: "commercial", ratio: 16 / 9 },
    { slug: "miumiu-x-adele-castillon", title: "MiuMiu X Adèle Castillon", director: "Thibault Della Gaspera", category: "commercial", ratio: 9 / 16 },

    // Still life
    { slug: "miumiu-fleur-de-lait", title: "MiuMiu Fleur de Lait", director: "Onirim", category: "commercial", ratio: 16 / 9 },
    { slug: "ormaie", title: "ORMAIE", director: "Stan Desjeux", category: "commercial", ratio: 16 / 9 },
    { slug: "loewe", title: "Loewe", director: "Adrien Sgandurra", category: "commercial", ratio: 16 / 9 },
    { slug: "kitesy-martin", title: "KITESY Martin", director: "Megane & Hugo", category: "commercial", ratio: 16 / 9 },
    { slug: "la-grande-dame-rose-2018", title: "La Grande Dame Rosé 2018", director: "Onirim", category: "commercial", ratio: 9 / 16 },
    { slug: "maison-francis-kurkdjian-kurky", title: "Maison Francis Kurkdjian Capsule Kurky", director: "Stan Desjeux", category: "commercial", ratio: 16 / 9 },
    { slug: "bend-trippy", title: "BEND-TRIPPY", director: "Leonard Oliviero", category: "commercial", ratio: 16 / 9 },

    // Art Film
    { slug: "manifeste", title: "Manifeste", director: "Stan Desjeux", category: "art", ratio: 16 / 9 },
    { slug: "learning-of-gesture-expression", title: "LEARNING OF GESTURE EXPRESSION", director: "Mathilde Hiley", category: "art", ratio: 16 / 9 },

    // Narrative
    { slug: "drive-baby-drive", title: "Drive Baby Drive", director: "Christian Maverick", category: "narrative", ratio: 2048 / 858 },
  ],

  /*
    Mise en page de la grille, de haut en bas. Chaque ligne est une rangée de films de même hauteur :
    un seul film = pleine largeur, deux films = moitié chacun, trois films = un tiers chacun.
    { tall: "slug", stack: ["slug", "slug"] } = un film vertical en grand à côté de deux films empilés
    (ajouter side: "right" pour mettre le vertical à droite).
    Un film absent de cette liste est ajouté automatiquement à la fin.
  */
  layout: [
    // Beauty / Mode
    ["lancome-community"],
    { tall: "miumiu-x-adele-castillon", stack: ["jean-paul-gaultier", "yves-saint-laurent"], side: "right" },
    ["loreal-hairstyle"],
    // Still life
    ["miumiu-fleur-de-lait"],
    ["ormaie", "loewe"],
    ["kitesy-martin"],
    ["la-grande-dame-rose-2018", "maison-francis-kurkdjian-kurky"],
    ["bend-trippy", "manifeste", "learning-of-gesture-expression"],
    ["drive-baby-drive"],
  ],
};
