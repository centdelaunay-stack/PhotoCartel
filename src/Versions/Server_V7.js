import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import fs from "fs";

dotenv.config();

const app = express();

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

app.listen(3001, () => {
  console.log("PhotoCartel API démarrée sur le port 3001");
});