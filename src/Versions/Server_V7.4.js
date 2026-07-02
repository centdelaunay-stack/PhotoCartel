import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import fs from "fs";
import multer from "multer";

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

app.post("/analyse-cartel", async (req, res) => {
  try {
    const { texte } = req.body;

    const prompt = `
Tu es un expert de catalogage muséal.

Analyse le texte OCR d'un cartel de musée.


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

Exemple :

{
  "title_fr": "Jeune marin",
  "title_en": "Young Sailor",
  "artist": "Henri Matisse",
  "date": "1906",
  "period": "",
  "dynasty": "",
  "country_origin": "France",
  "culture": "française",
  "art_movement": "fauvisme",
  "object_category": "peinture",
  "object_type": "portrait",
  "medium": "huile",
  "support": "toile",
  "dimensions": "",
  "museum": "",
  "city": "",
  "country_museum": "",
  "ownership": "",
  "provenance": "",
  "keywords": ["Matisse","portrait","fauvisme"],
  "confidence": 0.95
}

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

      console.log("REQ.FILES =", req.files);
      console.log("REQ.BODY =", req.body);

      const photo = req.files.photo?.[0];
      const cartel = req.files.cartel?.[0];
      const chemin = req.body.chemin;
      const nomFichier = req.body.nomFichier;

console.log("PHOTO =", photo);
console.log("CHEMIN =", chemin);
console.log("NOM =", nomFichier);
console.log("CARTEL =", cartel);

      if (!photo) {
        return res.status(400).json({
          success: false,
          error: "Photo manquante"
        });
      }

      const cheminComplet =
        `${chemin}\\${nomFichier}`;

      fs.writeFileSync(
        cheminComplet,
        photo.buffer
      );

const nomCartel =
nomFichier.replace(".jpg", "_CARTEL.jpg");

const cheminCartel =
`${chemin}\\${nomCartel}`;

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

    const categories = [
      "Oeuvres",
      "Cartels",
      "Architecture",
      "Jardins",
      "Divers",
      "A_verifier"
    ];

    for (const categorie of categories) {
      fs.mkdirSync(
        `${chemin}\\${categorie}`,
        { recursive: true }
      );
    }

    res.json({
      success: true,
      categories
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});


app.listen(3001, () => {
  console.log("PhotoCartel API démarrée sur le port 3001");
});