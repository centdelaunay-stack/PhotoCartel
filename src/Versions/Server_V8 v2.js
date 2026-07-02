import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import fs from "fs";
import multer from "multer";
import path from "path";

dotenv.config();

const app = express();

const upload = multer({
  storage: multer.memoryStorage()
});

app.use(cors());
app.use(express.json({ limit: "20mb" }));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const CATEGORIES_MUSEE = [
  "Oeuvres",
  "Cartels",
  "Architecture",
  "Jardins",
  "A_verifier_classification"
];

function nettoyerCategorie(categorie) {
  const valeur = (categorie || "").trim();

  if (valeur === "Oeuvres") return "Oeuvres";
  if (valeur === "Cartels") return "Cartels";
  if (valeur === "Architecture") return "Architecture";
  if (valeur === "Jardins") return "Jardins";

  return "A_verifier_classification";
}

async function classifierImageBuffer(buffer) {
  const imageBase64 = buffer.toString("base64");

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `
Tu es un expert de classification photographique de visite de musée.

Tu dois répondre avec UNE SEULE catégorie exacte parmi :

Oeuvres
Cartels
Architecture
Jardins
A_verifier_classification

Définitions :
- Oeuvres : peinture, sculpture, objet de musée, installation, vitrine centrée sur une œuvre.
- Cartels : étiquette, panneau texte, fiche descriptive, cartel de musée.
- Architecture : bâtiment, salle, escalier, façade, plafond, structure intérieure.
- Jardins : jardin, plante, arbre, parc, extérieur végétal.
- A_verifier_classification : si tu n'es pas sûr.

Ne réponds que par le nom exact de la catégorie.
`
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Classe cette photo."
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${imageBase64}`
            }
          }
        ]
      }
    ],
    temperature: 0
  });

  return nettoyerCategorie(
    response.choices[0].message.content
  );
}

app.post("/analyse-cartel", async (req, res) => {
  try {
    const { texte } = req.body;

    const prompt = `
Tu es un expert de catalogage muséal.

Analyse le texte OCR d'un cartel de musée.

Le texte OCR peut être très dégradé, incomplet ou contenir de nombreuses erreurs.

Avant d'extraire les métadonnées :

- Reconstitue mentalement le texte probable.
- Corrige les erreurs OCR évidentes.
- Déduis les mots incomplets lorsqu'ils sont très probables.
- Prends en compte que le cartel peut être en français, anglais, italien, espagnol, portugais, coréen, japonais, thaïlandais ou cambodgien.
- Traduis mentalement si nécessaire avant l'extraction.
- Si une information reste incertaine, ne pas l'inventer.

Réponds EXCLUSIVEMENT avec un JSON valide.

IMPORTANT :

- Ne jamais inventer d'information.
- Si une donnée est absente, retourner "".
- Traduire tous les champs en français.
- Conserver le titre anglais original dans title_en lorsqu'il existe.
- Séparer medium et support lorsque possible.
- confidence doit être un nombre entre 0 et 1.
- keywords doit être un tableau JSON.

object_category doit appartenir à cette liste :

- peinture
- sculpture
- mobilier
- céramique
- textile
- masque
- bijou
- arme
- armure
- calligraphie
- estampe
- dessin
- objet rituel
- architecture
- monnaie
- livre
- photographie
- vaisselle
- maquette
- autre

Format attendu :

{
  "title_fr": "",
  "title_en": "",
  "artist": "",
  "date": "",
  "period": "",
  "dynasty": "",
  "country_origin": "",
  "culture": "",
  "art_movement": "",
  "object_category": "",
  "object_type": "",
  "medium": "",
  "support": "",
  "dimensions": "",
  "museum": "",
  "city": "",
  "country_museum": "",
  "ownership": "",
  "provenance": "",
  "keywords": [],
  "confidence": 0
}

Texte OCR :

${texte}
`;

    const response = await openai.responses.create({
      model: "gpt-5-mini",
      input: prompt,
    });

    const contenu = response.output_text;
    const resultat = JSON.parse(contenu);

    res.json({
      success: true,
      result: resultat,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.post(
  "/classifier-photo",
  upload.single("photo"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "Photo manquante"
        });
      }

      const categorie = await classifierImageBuffer(req.file.buffer);

      res.json({
        success: true,
        categorie
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

app.post("/classifier-dossier", async (req, res) => {
  try {
    const { cheminSource, cheminDestination } = req.body;

    if (!cheminSource) {
      return res.status(400).json({
        success: false,
        error: "cheminSource manquant"
      });
    }

    if (!cheminDestination) {
      return res.status(400).json({
        success: false,
        error: "cheminDestination manquant"
      });
    }

    if (!fs.existsSync(cheminSource)) {
      return res.status(400).json({
        success: false,
        error: "Le dossier source n'existe pas : " + cheminSource
      });
    }

    fs.mkdirSync(cheminDestination, { recursive: true });

    for (const categorie of CATEGORIES_MUSEE) {
      fs.mkdirSync(
        path.join(cheminDestination, categorie),
        { recursive: true }
      );
    }

    const fichiers = fs.readdirSync(cheminSource);

    const photos = fichiers.filter((fichier) => {
      const ext = path.extname(fichier).toLowerCase();

      return [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
      ].includes(ext);
    });

    const resultats = [];

    for (const fichier of photos) {
      const cheminPhotoSource = path.join(cheminSource, fichier);

      console.log("Classification :", fichier);

      try {
        const buffer = fs.readFileSync(cheminPhotoSource);

        const categorie = await classifierImageBuffer(buffer);

        const cheminCategorie = path.join(
          cheminDestination,
          categorie
        );

        fs.mkdirSync(cheminCategorie, { recursive: true });

        const cheminPhotoDestination = path.join(
          cheminCategorie,
          fichier
        );

        fs.copyFileSync(
          cheminPhotoSource,
          cheminPhotoDestination
        );

        resultats.push({
          fichier,
          categorie,
          success: true
        });

        console.log("OK :", fichier, "=>", categorie);

      } catch (error) {
        console.error("Erreur classification :", fichier, error);

        const cheminErreur = path.join(
          cheminDestination,
          "A_verifier_classification"
        );

        fs.mkdirSync(cheminErreur, { recursive: true });

        fs.copyFileSync(
          cheminPhotoSource,
          path.join(cheminErreur, fichier)
        );

        resultats.push({
          fichier,
          categorie: "A_verifier_classification",
          success: false,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      total: photos.length,
      resultats
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post("/creer-dossier", async (req, res) => {
  try {
    const { chemin } = req.body;

    if (!chemin) {
      return res.status(400).json({
        success: false,
        error: "Chemin manquant"
      });
    }

    fs.mkdirSync(chemin, {
      recursive: true
    });

    res.json({
      success: true,
      chemin
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post(
  "/sauvegarder-photo",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "cartel", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const photo = req.files.photo?.[0];
      const cartel = req.files.cartel?.[0];

      const chemin = req.body.chemin;
      const nomFichier = req.body.nomFichier;

      if (!photo) {
        return res.status(400).json({
          success: false,
          error: "Photo manquante"
        });
      }

      if (!chemin) {
        return res.status(400).json({
          success: false,
          error: "Chemin manquant"
        });
      }

      if (!nomFichier) {
        return res.status(400).json({
          success: false,
          error: "Nom de fichier manquant"
        });
      }

      fs.mkdirSync(chemin, { recursive: true });

      const cheminComplet = path.join(chemin, nomFichier);

      fs.writeFileSync(
        cheminComplet,
        photo.buffer
      );

      const nomCartel =
        nomFichier.replace(".jpg", "_CARTEL.jpg");

      const cheminCartel =
        path.join(chemin, nomCartel);

      if (cartel) {
        fs.writeFileSync(
          cheminCartel,
          cartel.buffer
        );
      }

      res.json({
        success: true,
        chemin: cheminComplet
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

app.post("/creer-categories-musee", async (req, res) => {
  try {
    const { chemin } = req.body;

    if (!chemin) {
      return res.status(400).json({
        success: false,
        error: "Chemin manquant"
      });
    }

    for (const categorie of CATEGORIES_MUSEE) {
      fs.mkdirSync(
        path.join(chemin, categorie),
        { recursive: true }
      );
    }

    res.json({
      success: true,
      categories: CATEGORIES_MUSEE
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post("/analyser-dossier", async (req, res) => {
  try {
    const { chemin } = req.body;

    if (!chemin) {
      return res.status(400).json({
        success: false,
        error: "Chemin manquant"
      });
    }

    const fichiers = fs.readdirSync(chemin);

    const photos = fichiers.filter((fichier) => {
      const ext = path.extname(fichier).toLowerCase();

      return [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
      ].includes(ext);
    });

    res.json({
      success: true,
      nomDossier: path.basename(chemin),
      chemin,
      nombrePhotos: photos.length
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.messagea
    });
  }
});

app.listen(3001, () => {
  console.log("PhotoCartel API démarrée sur le port 3001");
});