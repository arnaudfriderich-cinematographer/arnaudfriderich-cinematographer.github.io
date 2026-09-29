/*
  Contenu du site — c'est le seul fichier à modifier pour mettre à jour le portfolio.

  Pour ajouter un film :
    1. déposer la vidéo dans media/films/<slug>.mp4
    2. une boucle de 6 s sans son dans media/previews/<slug>.mp4
    3. une image dans media/posters/<slug>.jpg (+ <slug>-sm.jpg en 960 px)
    4. ajouter une entrée dans projects, puis lui donner sa place dans layout (en bas du fichier).

  producer : la société de production ("" si inconnue)
  ratio : largeur / hauteur de la vidéo (16/9, 9/16, 2.39…). La vignette garde ce format.
*/
window.PORTFOLIO = {
  name: "Arnaud Friderich",
  tagline: "Cinematographer", // sous le nom, en haut de la page ("" pour le masquer)

  // Texte de l'onglet Bio du menu, en français et en anglais : un paragraphe par ligne
  bio: {
    fr: [
      "Je suis chef opérateur en beauty, mode et still life pour le luxe.",
      "J’aime éclairer les visages, les vêtements et les objets avec un vrai souci du détail, et chercher pour chaque projet une image qui a du cachet.",
      "Ma lumière accompagne des maisons comme Miu Miu, Lancôme, Dior et Loewe.",
      "Basé à Paris.",
    ],
    en: [
      "I’m a cinematographer working in beauty, fashion and still life for luxury brands.",
      "I love lighting faces, garments and objects with real attention to detail, and finding an image with character for every project.",
      "I’ve worked with houses such as Miu Miu, Lancôme, Dior and Loewe.",
      "Based in Paris.",
    ],
  },

  // Laisser vide ("") pour masquer une ligne.
  contact: {
    instagram: "arnaud_friderich",
    email: "arnaudfriderichtarrisse@gmail.com",
    phone: "06 18 13 33 94",
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
    { slug: "lancome-community", title: "Lancôme Community", director: "Calvin Pausania", producer: "Helmut Production", category: "commercial", ratio: 16 / 9 },
    { slug: "jean-paul-gaultier", title: "Jean Paul Gaultier", director: "Megane & Hugo", producer: "Burning Love", category: "commercial", ratio: 16 / 9 },
    { slug: "yves-saint-laurent", title: "Saint Laurent", director: "", producer: "", category: "commercial", ratio: 16 / 9 },
    { slug: "loreal-hairstyle", title: "L’Oreal Hairstyle", director: "Samy Djazoubi", producer: "Helmut Production", category: "commercial", ratio: 16 / 9 },
    { slug: "miumiu-x-adele-castillon", title: "MiuMiu X Adèle Castillon", director: "Thibault Della Gaspera", producer: "Condé Nast", category: "commercial", ratio: 9 / 16 },

    // Still life
    { slug: "miumiu-fleur-de-lait", title: "MiuMiu Fleur de Lait", director: "Onirim", producer: "Onirim", category: "commercial", ratio: 16 / 9 },
    { slug: "ormaie", title: "ORMAIE", director: "Stan Desjeux", producer: "", category: "commercial", ratio: 16 / 9 },
    { slug: "loewe", title: "Loewe", director: "Adrien Sgandurra", producer: "Marlowe", category: "commercial", ratio: 16 / 9 },
    { slug: "kitesy-martin", title: "KITESY Martin", director: "Megane & Hugo", producer: "Maison Montcalm", category: "commercial", ratio: 16 / 9 },
    { slug: "la-grande-dame-rose-2018", title: "La Grande Dame Rosé 2018", director: "Onirim", producer: "Onirim", category: "commercial", ratio: 9 / 16 },
    { slug: "maison-francis-kurkdjian-kurky", title: "Maison Francis Kurkdjian Capsule Kurky", director: "Stan Desjeux", producer: "Marie Valat", category: "commercial", ratio: 16 / 9 },
    { slug: "bend-trippy", title: "BEND-TRIPPY", director: "Leonard Oliviero", producer: "Obvious", category: "commercial", ratio: 16 / 9 },

    // Art Film
    { slug: "manifeste", title: "Manifeste", director: "Stan Desjeux", producer: "Maison Noire", category: "art", ratio: 16 / 9 },
    { slug: "learning-of-gesture-expression", title: "LEARNING OF GESTURE EXPRESSION", director: "Mathilde Hiley", producer: "", category: "art", ratio: 16 / 9 },

    // Narrative
    { slug: "drive-baby-drive", title: "Drive Baby Drive", director: "Christian Maverick", producer: "Studio Hauteville", category: "narrative", ratio: 2048 / 858 },
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
