import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import fs from "fs";
import multer from "multer";
import path from "path";

import { exec } from "child_process";

dotenv.config();

const app = express();

const upload = multer({
  storage: multer.memoryStorage(),
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
  "A_verifier_classification",
];

const EXTENSIONS_IMAGE = [".jpg", ".jpeg", ".png", ".webp"];

function estImage(fichier) {
  return EXTENSIONS_IMAGE.includes(path.extname(fichier).toLowerCase());
}

function nettoyerCategorie(categorie) {
  const valeur = (categorie || "").trim();

  if (valeur === "Oeuvres") return "Oeuvres";
  if (valeur === "Cartels") return "Cartels";
  if (valeur === "Architecture") return "Architecture";
  if (valeur === "Jardins") return "Jardins";

  return "A_verifier_classification";
}

function normaliserTimestampDepuisNomFichier(fichier) {
  const nomSansExtension = path.parse(fichier).name;

  const nomNettoye = nomSansExtension
    .replace(/^IMG/i, "")
    .replace(/^PXL_/i, "")
    .replace(/[^0-9]/g, "");

  if (nomNettoye.length >= 14) {
    const bloc = nomNettoye.slice(0, 14);
    return `${bloc.slice(0, 8)}_${bloc.slice(8, 14)}`;
  }

  if (nomNettoye.length === 12) {
    return `${nomNettoye.slice(0, 8)}_${nomNettoye.slice(8, 12)}00`;
  }

  return nomSansExtension
    .replace(/[<>:"/\\|?*]/g, "")
    .replace(/\s+/g, "_")
    .trim();
}

function libelleCategoriePourNom(categorie) {
  if (categorie === "Architecture") return "architecture";
  if (categorie === "Jardins") return "jardins";
  if (categorie === "A_verifier_classification") {
    return "a_verifier_classification";
  }

  return "";
}

function formaterCompteur(nombre) {
  return String(nombre).padStart(3, "0");
}

function genererNomClasse(fichier, categorie, compteurCategorie) {
  const extension = path.extname(fichier).toLowerCase() || ".jpg";
  const timestamp = normaliserTimestampDepuisNomFichier(fichier);
  const libelle = libelleCategoriePourNom(categorie);

  if (!libelle) {
    return fichier;
  }

  return `${timestamp}_${libelle}_${formaterCompteur(compteurCategorie)}${extension}`;
}

function listerImagesDossier(chemin) {
  if (!fs.existsSync(chemin)) return [];

  return fs
    .readdirSync(chemin)
    .filter(estImage)
    .sort((a, b) => a.localeCompare(b, "fr", { numeric: true }));
}

function compterImagesDossier(chemin) {
  return listerImagesDossier(chemin).length;
}

function formaterDateHeureLocale(date) {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
    .format(date)
    .replace(",", "");
}

function extraireCreationDossierDepuisNom(nomDossier) {
  const match = String(nomDossier).match(
    /_(\d{4}-\d{2}-\d{2})_(\d{2})-(\d{2})Z$/
  );

  if (!match) {
    return {
      creationDossierLocale: "",
      creationDossierUTC: "",
    };
  }

  const dateUTC = new Date(`${match[1]}T${match[2]}:${match[3]}:00.000Z`);

  return {
    creationDossierLocale: formaterDateHeureLocale(dateUTC),
    creationDossierUTC: `${match[1]} ${match[2]}:${match[3]}Z`,
  };
}

function nettoyerNomFichier(valeur) {
  return String(valeur || "")
    .replace(/[<>:"/\\|?*]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extraireTimestampComparable(fichier) {
  const nomSansExtension = path.parse(fichier).name;
  const chiffres = nomSansExtension.replace(/[^0-9]/g, "");

  if (chiffres.length >= 14) return chiffres.slice(0, 14);
  if (chiffres.length >= 12) return chiffres.slice(0, 12) + "00";

  return "";
}

function timestampVersDate(timestamp) {
  if (!timestamp || timestamp.length < 14) return null;

  const annee = Number(timestamp.slice(0, 4));
  const mois = Number(timestamp.slice(4, 6)) - 1;
  const jour = Number(timestamp.slice(6, 8));
  const heure = Number(timestamp.slice(8, 10));
  const minute = Number(timestamp.slice(10, 12));
  const seconde = Number(timestamp.slice(12, 14));

  const date = new Date(annee, mois, jour, heure, minute, seconde);

  if (Number.isNaN(date.getTime())) return null;

  return date;
}

function distanceTimestampSecondes(fichierA, fichierB) {
  const a = extraireTimestampComparable(fichierA);
  const b = extraireTimestampComparable(fichierB);

  const dateA = timestampVersDate(a);
  const dateB = timestampVersDate(b);

  if (!dateA || !dateB) return Number.MAX_SAFE_INTEGER;

  return Math.abs(dateA.getTime() - dateB.getTime()) / 1000;
}

function trouverCartelLePlusProche(oeuvre, cartelsDisponibles) {
  const FENETRE_MAX_ASSOCIATION = 60;

  if (!cartelsDisponibles.length) return null;

  let meilleur = null;
  let meilleureDistance = Number.MAX_SAFE_INTEGER;

  for (const cartel of cartelsDisponibles) {
    const distance = distanceTimestampSecondes(oeuvre, cartel);

    if (distance < meilleureDistance) {
      meilleur = cartel;
      meilleureDistance = distance;
    }
  }

  if (meilleureDistance > FENETRE_MAX_ASSOCIATION) {
    return null;
  }

  return meilleur;
}

function construireNomIntelligentDepuisAnalyse(fichierOeuvre, analyse) {
  const extension = path.extname(fichierOeuvre).toLowerCase() || ".jpg";
  const timestamp = normaliserTimestampDepuisNomFichier(fichierOeuvre);
  const confiance = Number(analyse?.confidence || 0);

  if (!analyse || confiance < 0.5) {
    return `${timestamp}, A_VERIFIER_RENOMMAGE${extension}`;
  }

  const morceaux = [];
  const artiste = nettoyerNomFichier(analyse.artist || "");
  const titre = nettoyerNomFichier(analyse.title_fr || analyse.title_en || "");
  const date = nettoyerNomFichier(analyse.date || "");

  if (timestamp) morceaux.push(timestamp);
  if (artiste) morceaux.push(artiste);
  if (titre) morceaux.push(`'${titre}'`);
  if (date) morceaux.push(date);

  if (morceaux.length <= 1) {
    return `${timestamp}, A_VERIFIER_RENOMMAGE${extension}`;
  }

  return morceaux.join(", ") + extension;
}

function rendreNomUnique(cheminDossier, nomFichier) {
  fs.mkdirSync(cheminDossier, { recursive: true });

  const extension = path.extname(nomFichier);
  const base = path.basename(nomFichier, extension);
  let candidat = nomFichier;
  let compteur = 2;

  while (fs.existsSync(path.join(cheminDossier, candidat))) {
    candidat = `${base} (${compteur})${extension}`;
    compteur += 1;
  }

  return candidat;
}

function extraireJsonDepuisTexte(texte) {
  const contenu = String(texte || "").trim();

  try {
    return JSON.parse(contenu);
  } catch (e) {
    const match = contenu.match(/\{[\s\S]*\}/);
    if (!match) throw e;
    return JSON.parse(match[0]);
  }
}

function genererTimestampAnalysePhoto(date = new Date()) {
  return (
    date.getFullYear() +
    String(date.getMonth() + 1).padStart(2, "0") +
    String(date.getDate()).padStart(2, "0") +
    "_" +
    String(date.getHours()).padStart(2, "0") +
    String(date.getMinutes()).padStart(2, "0") +
    String(date.getSeconds()).padStart(2, "0")
  );
}

function parserJsonSouple(valeur, fallback = {}) {
  if (!valeur) return fallback;

  if (typeof valeur === "object") {
    return valeur;
  }

  try {
    return JSON.parse(String(valeur));
  } catch (error) {
    return fallback;
  }
}


function construireAnalysePhotoFallback(note = "Analyse IA non exploitable") {
  return {
    type_detecte: "photo",
    objet_principal: "objet ou scène photographiée",
    titre_fr: "",
    titre_en: "",
    auteur_ou_createur: "",
    date_ou_periode: "",
    categorie: "à décrire",
    sous_type: "",
    style_ou_mouvement: "",
    technique: "",
    support: "",
    materiaux: "",
    dimensions: "",
    lieu_probable: "",
    ville: "",
    pays: "",
    musee_ou_institution: "",
    description: "Photo reçue par PhotoCartel. La fiche est créée même si l'identification précise reste incertaine.",
    elements_visibles: [],
    mots_cles: ["photo", "analyse à compléter"],
    notes: note,
    confidence: 0.2,
  };
}

function normaliserAnalysePhoto(analyse) {
  const source = analyse && typeof analyse === "object" ? analyse : {};

  return {
    type_detecte: String(source.type_detecte || "photo"),
    objet_principal: String(source.objet_principal || source.objet || "objet ou scène photographiée"),
    titre_fr: String(source.titre_fr || ""),
    titre_en: String(source.titre_en || ""),
    auteur_ou_createur: String(source.auteur_ou_createur || source.auteur || source.createur || ""),
    date_ou_periode: String(source.date_ou_periode || source.date || source.periode || ""),
    categorie: String(source.categorie || ""),
    sous_type: String(source.sous_type || ""),
    style_ou_mouvement: String(source.style_ou_mouvement || source.style || ""),
    technique: String(source.technique || ""),
    support: String(source.support || ""),
    materiaux: String(source.materiaux || source.materiau || ""),
    dimensions: String(source.dimensions || ""),
    lieu_probable: String(source.lieu_probable || ""),
    ville: String(source.ville || ""),
    pays: String(source.pays || ""),
    musee_ou_institution: String(source.musee_ou_institution || ""),
    description: String(source.description || ""),
    elements_visibles: Array.isArray(source.elements_visibles)
      ? source.elements_visibles
      : Array.isArray(source.visible_elements)
      ? source.visible_elements
      : [],
    mots_cles: Array.isArray(source.mots_cles)
      ? source.mots_cles
      : Array.isArray(source.keywords)
      ? source.keywords
      : [],
    notes: String(source.notes || ""),
    confidence: Number.isFinite(Number(source.confidence)) ? Number(source.confidence) : 0,
  };
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
`,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Classe cette photo.",
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${imageBase64}`,
            },
          },
        ],
      },
    ],
    temperature: 0,
  });

  return nettoyerCategorie(response.choices[0].message.content);
}

async function trierMinimalPourRenommage(fichiers, cheminDestination) {
  const cheminOeuvres = path.join(cheminDestination, "Oeuvres");
  const cheminCartels = path.join(cheminDestination, "Cartels");
  const cheminVerification = path.join(cheminDestination, "A_verifier_renommage");

  fs.mkdirSync(cheminDestination, { recursive: true });
  fs.mkdirSync(cheminOeuvres, { recursive: true });
  fs.mkdirSync(cheminCartels, { recursive: true });
  fs.mkdirSync(cheminVerification, { recursive: true });

  console.log("DOSSIERS RENOMMAGE CREES =", {
    cheminDestination,
    cheminOeuvres,
    cheminCartels,
    cheminVerification,
  });

  const stats = {
    Oeuvres: 0,
    Cartels: 0,
    A_verifier_renommage: 0,
  };

  for (const fichier of fichiers) {
    try {
      const categorie = await classifierImageBuffer(fichier.buffer);

      if (categorie === "Oeuvres") {
        stats.Oeuvres += 1;
        const nomFinal = rendreNomUnique(cheminOeuvres, fichier.originalname);
        fs.mkdirSync(cheminOeuvres, { recursive: true });
        fs.writeFileSync(path.join(cheminOeuvres, nomFinal), fichier.buffer);
      } else if (categorie === "Cartels") {
        stats.Cartels += 1;
        const nomFinal = rendreNomUnique(cheminCartels, fichier.originalname);
        fs.mkdirSync(cheminCartels, { recursive: true });
        fs.writeFileSync(path.join(cheminCartels, nomFinal), fichier.buffer);
      } else {
        stats.A_verifier_renommage += 1;
        const nomFinal = rendreNomUnique(cheminVerification, fichier.originalname);
        fs.mkdirSync(cheminVerification, { recursive: true });
        fs.writeFileSync(path.join(cheminVerification, nomFinal), fichier.buffer);
      }
    } catch (error) {
      console.error("ERREUR TRI MINIMAL =", error);
      console.error("FICHIER EN ERREUR =", fichier.originalname);
      console.error("DOSSIER VERIFICATION =", cheminVerification);

      stats.A_verifier_renommage += 1;

      const nomFinal = rendreNomUnique(cheminVerification, fichier.originalname);
      const cheminFinalErreur = path.join(cheminVerification, nomFinal);

      console.error("CHEMIN FINAL ERREUR =", cheminFinalErreur);

      fs.mkdirSync(path.dirname(cheminFinalErreur), { recursive: true });
      fs.writeFileSync(cheminFinalErreur, fichier.buffer);
    }
  }

  return stats;
}

async function analyserCartelImageBuffer(buffer) {
  const imageBase64 = buffer.toString("base64");

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `
Tu es un expert de catalogage muséal.

Analyse la photo d'un cartel de musée.
Lis le texte visible, corrige mentalement les erreurs probables et extrais les métadonnées.

Réponds EXCLUSIVEMENT avec un JSON valide.

Règles :
- Ne jamais inventer une information.
- Si une donnée est absente, retourner "".
- Traduire tous les champs en français.
- Conserver le titre anglais original dans title_en lorsqu'il existe.
- Séparer medium et support lorsque possible.
- confidence doit être un nombre entre 0 et 1.
- keywords doit être un tableau JSON.

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
`,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Analyse ce cartel de musée et retourne uniquement le JSON demandé.",
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${imageBase64}`,
            },
          },
        ],
      },
    ],
    temperature: 0,
  });

  const contenu = response.choices[0].message.content;
  return extraireJsonDepuisTexte(contenu);
}

async function analyserPhotoOneShotBuffer(buffer) {
  const imageBase64 = buffer.toString("base64");

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `
Tu es PhotoCartel, un assistant visuel généraliste.

MISSION ABSOLUE : toute photo reçue doit produire une fiche normée.
Tu ne dois jamais refuser l'analyse sous prétexte que l'objet ne serait pas une œuvre d'art.
Tu ne dois jamais juger la valeur artistique, muséale ou patrimoniale de l'objet.
Tu dois seulement décrire, identifier prudemment et structurer.

La photo peut représenter notamment :
- masque de Venise, masque bolivien, masque décoratif, objet artisanal, souvenir ;
- peinture, sculpture, objet de musée, cartel de musée ;
- église, monument, bâtiment, rue, ville ;
- avion, train, voiture, objet technique ;
- paysage, jardin, parc, montagne, mer ;
- restaurant, plat, intérieur, scène quotidienne ;
- ou tout autre objet.

Tu dois identifier d'abord le TYPE / OBJET PRINCIPAL, puis donner les informations utiles.
Si l'identification est incertaine, tu remplis quand même la fiche avec des formulations prudentes.
Exemples acceptables : "masque décoratif", "masque vénitien probable", "objet mural sculpté", "groupe de masques en bois".

Réponds EXCLUSIVEMENT avec un JSON valide.

Règles :
- Ne jamais inventer une information certaine.
- Si une information est incertaine, le dire dans "description" ou "notes".
- Si une donnée est absente ou non pertinente, retourner "".
- Tous les champs texte doivent être en français.
- confidence doit être un nombre entre 0 et 1.
- mots_cles doit être un tableau JSON.
- elements_visibles doit être un tableau JSON.

Format attendu :
{
  "type_detecte": "",
  "objet_principal": "",
  "titre_fr": "",
  "titre_en": "",
  "auteur_ou_createur": "",
  "date_ou_periode": "",
  "categorie": "",
  "sous_type": "",
  "style_ou_mouvement": "",
  "technique": "",
  "support": "",
  "materiaux": "",
  "dimensions": "",
  "lieu_probable": "",
  "ville": "",
  "pays": "",
  "musee_ou_institution": "",
  "description": "",
  "elements_visibles": [],
  "mots_cles": [],
  "notes": "",
  "confidence": 0
}
`,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Analyse cette photo et retourne uniquement le JSON demandé.",
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${imageBase64}`,
            },
          },
        ],
      },
    ],
    temperature: 0,
  });

  const contenu = response.choices[0].message.content;

  try {
    return normaliserAnalysePhoto(extraireJsonDepuisTexte(contenu));
  } catch (error) {
    console.error("JSON PHOTO ONE SHOT NON PARSABLE =", contenu);
    return construireAnalysePhotoFallback("Réponse IA non JSON ou non exploitable : " + error.message);
  }
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
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/analyser-photo-one-shot", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Photo manquante",
      });
    }

    const analyse = await analyserPhotoOneShotBuffer(req.file.buffer);

    res.json({
      success: true,
      originalName: req.file.originalname,
      result: analyse,
    });
  } catch (error) {
    console.error("ERREUR /analyser-photo-one-shot =", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});


app.post("/sauvegarder-analyse-photo", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Photo manquante",
      });
    }

    const dossierRacine = req.body.dossierRacine || "C:\\Voyages";
    const dossierDestination = path.join(
      dossierRacine,
      "Photos analysées singulièrement"
    );

    fs.mkdirSync(dossierDestination, { recursive: true });

    const timestamp = genererTimestampAnalysePhoto(new Date());
    const baseNom = `${timestamp}_PHOTO_ANALYSEE`;

    const nomPhoto = rendreNomUnique(dossierDestination, `${baseNom}.jpeg`);
    const baseFinale = path.basename(nomPhoto, path.extname(nomPhoto));
    const nomJson = `${baseFinale}.json`;

    const cheminPhoto = path.join(dossierDestination, nomPhoto);
    const cheminJson = path.join(dossierDestination, nomJson);

    const analyseBrute =
      req.body.analyse ||
      req.body.analyseJson ||
      req.body.result ||
      "{}";

    const analyse = parserJsonSouple(analyseBrute, {});

    const metadonnees = {
      type_document: "PHOTO_ANALYSEE",
      version_photocartel: "v17.5.3",
      date_analyse_iso: new Date().toISOString(),
      date_analyse_locale: formaterDateHeureLocale(new Date()),
      nom_photo_original: req.file.originalname || "",
      nom_photo_sauvegardee: nomPhoto,
      nom_json_sauvegarde: nomJson,
      dossier_destination: dossierDestination,
      analyse,
    };

    fs.writeFileSync(cheminPhoto, req.file.buffer);
    fs.writeFileSync(
      cheminJson,
      JSON.stringify(metadonnees, null, 2),
      "utf-8"
    );

    res.json({
      success: true,
      dossierDestination,
      cheminDestination: dossierDestination,
      nomPhoto,
      nomJson,
      cheminPhoto,
      cheminJson,
    });
  } catch (error) {
    console.error("ERREUR /sauvegarder-analyse-photo =", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});


app.post("/classifier-photo", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "Photo manquante" });
    }

    const categorie = await classifierImageBuffer(req.file.buffer);

    res.json({ success: true, categorie });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/classifier-fichiers", upload.array("photos"), async (req, res) => {
  try {
    const cheminDestination = req.body.cheminDestination;

    if (!cheminDestination) {
      return res.status(400).json({
        success: false,
        error: "cheminDestination manquant",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Aucune photo reçue",
      });
    }

    fs.mkdirSync(cheminDestination, { recursive: true });

    for (const categorie of CATEGORIES_MUSEE) {
      fs.mkdirSync(path.join(cheminDestination, categorie), { recursive: true });
    }

    const resultats = [];
    const compteursCategories = {
      Oeuvres: 0,
      Cartels: 0,
      Architecture: 0,
      Jardins: 0,
      A_verifier_classification: 0,
    };

    for (const photo of req.files) {
      const nomOriginal = photo.originalname;

      try {
        const categorie = await classifierImageBuffer(photo.buffer);
        compteursCategories[categorie] += 1;

        const cheminCategorie = path.join(cheminDestination, categorie);
        fs.mkdirSync(cheminCategorie, { recursive: true });

        const nomDestination = genererNomClasse(
          nomOriginal,
          categorie,
          compteursCategories[categorie]
        );

        fs.writeFileSync(path.join(cheminCategorie, nomDestination), photo.buffer);

        resultats.push({
          fichier: nomOriginal,
          fichierDestination: nomDestination,
          categorie,
          success: true,
        });
      } catch (error) {
        const categorieErreur = "A_verifier_classification";
        compteursCategories[categorieErreur] += 1;

        const cheminErreur = path.join(cheminDestination, categorieErreur);
        fs.mkdirSync(cheminErreur, { recursive: true });

        const nomDestinationErreur = genererNomClasse(
          nomOriginal,
          categorieErreur,
          compteursCategories[categorieErreur]
        );

        fs.writeFileSync(path.join(cheminErreur, nomDestinationErreur), photo.buffer);

        resultats.push({
          fichier: nomOriginal,
          fichierDestination: nomDestinationErreur,
          categorie: categorieErreur,
          success: false,
          error: error.message,
        });
      }
    }

    res.json({
      success: true,
      total: req.files.length,
      resultats,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/renommer-oeuvres-fichiers", upload.array("oeuvres"), async (req, res) => {
  try {
    const { dossierSource, dossierRacine, nomDossierSource } = req.body;

    console.log("DOSSIER SOURCE RECU =", dossierSource);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Aucune photo reçue pour le renommage",
      });
    }

    const racine = dossierRacine || "C:\\Voyages";
    const baseRenommage = path.join(racine, "Oeuvres renommées");

    const timestampUTC =
      new Date()
        .toISOString()
        .replace(/:/g, "-")
        .replace("T", "_")
        .slice(0, 16) + "Z";

    const nomSourceBrut =
      nomDossierSource ||
      (dossierSource ? path.basename(dossierSource) : "Dossier_selectionne");

    const nomSource = nomSourceBrut
      .replace(/[<>:"/\\|?*]/g, "_")
      .replace(/\s+/g, " ")
      .trim();

    const nomDossierSortie = `${nomSource}_renommé_${timestampUTC}`;
    const cheminDestination = path.join(baseRenommage, nomDossierSortie);

    fs.mkdirSync(cheminDestination, { recursive: true });

    const statsTri = await trierMinimalPourRenommage(
      req.files,
      cheminDestination
    );

    res.json({
      success: true,
      total: req.files.length,
      cheminDestination,
      dossierSortie: nomDossierSortie,
      statsTri,
    });
  } catch (error) {
    console.error("ERREUR /renommer-oeuvres-fichiers =", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/classifier-dossier", async (req, res) => {
  try {
    const { cheminSource, cheminDestination } = req.body;

    if (!cheminSource) {
      return res.status(400).json({ success: false, error: "cheminSource manquant" });
    }

    if (!cheminDestination) {
      return res.status(400).json({ success: false, error: "cheminDestination manquant" });
    }

    if (!fs.existsSync(cheminSource)) {
      return res.status(400).json({
        success: false,
        error: "Le dossier source n'existe pas : " + cheminSource,
      });
    }

    fs.mkdirSync(cheminDestination, { recursive: true });

    for (const categorie of CATEGORIES_MUSEE) {
      fs.mkdirSync(path.join(cheminDestination, categorie), { recursive: true });
    }

    const photos = listerImagesDossier(cheminSource);

    const resultats = [];
    const compteursCategories = {
      Oeuvres: 0,
      Cartels: 0,
      Architecture: 0,
      Jardins: 0,
      A_verifier_classification: 0,
    };

    for (const fichier of photos) {
      const cheminPhotoSource = path.join(cheminSource, fichier);

      try {
        const buffer = fs.readFileSync(cheminPhotoSource);
        const categorie = await classifierImageBuffer(buffer);

        compteursCategories[categorie] += 1;

        const cheminCategorie = path.join(cheminDestination, categorie);
        fs.mkdirSync(cheminCategorie, { recursive: true });

        const nomDestination = genererNomClasse(
          fichier,
          categorie,
          compteursCategories[categorie]
        );

        fs.copyFileSync(
          cheminPhotoSource,
          path.join(cheminCategorie, nomDestination)
        );

        resultats.push({
          fichier,
          fichierDestination: nomDestination,
          categorie,
          success: true,
        });
      } catch (error) {
        const categorieErreur = "A_verifier_classification";
        compteursCategories[categorieErreur] += 1;

        const cheminErreur = path.join(cheminDestination, categorieErreur);
        fs.mkdirSync(cheminErreur, { recursive: true });

        const nomDestinationErreur = genererNomClasse(
          fichier,
          categorieErreur,
          compteursCategories[categorieErreur]
        );

        fs.copyFileSync(
          cheminPhotoSource,
          path.join(cheminErreur, nomDestinationErreur)
        );

        resultats.push({
          fichier,
          fichierDestination: nomDestinationErreur,
          categorie: categorieErreur,
          success: false,
          error: error.message,
        });
      }
    }

    res.json({
      success: true,
      total: photos.length,
      resultats,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/actualiser-photos-visite", upload.array("photos"), async (req, res) => {
  try {
    const { cheminDestination } = req.body;

    if (!cheminDestination) {
      return res.status(400).json({
        success: false,
        error: "cheminDestination manquant",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Aucune photo reçue",
      });
    }

    fs.mkdirSync(cheminDestination, { recursive: true });

    const resultats = [];
    let copies = 0;
    let ignores = 0;

    for (const photo of req.files) {
      try {
        const nomOriginal = nettoyerNomFichier(photo.originalname || "photo.jpg");
        const extension = path.extname(nomOriginal).toLowerCase() || ".jpg";

        if (!EXTENSIONS_IMAGE.includes(extension)) {
          ignores += 1;
          resultats.push({
            fichier: nomOriginal,
            success: false,
            ignore: true,
            raison: "Extension non image",
          });
          continue;
        }

        const cheminDirect = path.join(cheminDestination, nomOriginal);

        if (fs.existsSync(cheminDirect)) {
          ignores += 1;
          resultats.push({
            fichier: nomOriginal,
            fichierDestination: nomOriginal,
            success: true,
            ignore: true,
            raison: "Déjà présent",
          });
          continue;
        }

        const nomDestination = rendreNomUnique(cheminDestination, nomOriginal);
        const cheminFinal = path.join(cheminDestination, nomDestination);

        fs.writeFileSync(cheminFinal, photo.buffer);

        copies += 1;
        resultats.push({
          fichier: nomOriginal,
          fichierDestination: nomDestination,
          success: true,
          ignore: false,
        });
      } catch (error) {
        console.error("ERREUR COPIE PHOTO VISITE =", error);
        ignores += 1;
        resultats.push({
          fichier: photo.originalname,
          success: false,
          error: error.message,
        });
      }
    }

    const totalDestination = compterImagesDossier(cheminDestination);

    res.json({
      success: true,
      cheminDestination,
      recus: req.files.length,
      copies,
      ignores,
      totalDestination,
      resultats,
    });
  } catch (error) {
    console.error("ERREUR /actualiser-photos-visite =", error);
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
      return res.status(400).json({ success: false, error: "Chemin manquant" });
    }

    fs.mkdirSync(chemin, { recursive: true });

    res.json({ success: true, chemin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post(
  "/sauvegarder-photo",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "cartel", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const photo = req.files.photo?.[0];
      const cartel = req.files.cartel?.[0];

      const chemin = req.body.chemin;
      const nomFichier = req.body.nomFichier;

      if (!photo) {
        return res.status(400).json({ success: false, error: "Photo manquante" });
      }

      if (!chemin) {
        return res.status(400).json({ success: false, error: "Chemin manquant" });
      }

      if (!nomFichier) {
        return res.status(400).json({
          success: false,
          error: "Nom de fichier manquant",
        });
      }

      fs.mkdirSync(chemin, { recursive: true });

      const cheminComplet = path.join(chemin, nomFichier);
      fs.writeFileSync(cheminComplet, photo.buffer);

      const nomCartel = nomFichier.replace(/\.jpe?g$/i, "_CARTEL.jpg");
      const cheminCartel = path.join(chemin, nomCartel);

      if (cartel) {
        fs.writeFileSync(cheminCartel, cartel.buffer);
      }

      res.json({
        success: true,
        chemin: cheminComplet,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

app.post("/creer-categories-musee", async (req, res) => {
  try {
    const { chemin } = req.body;

    if (!chemin) {
      return res.status(400).json({ success: false, error: "Chemin manquant" });
    }

    for (const categorie of CATEGORIES_MUSEE) {
      fs.mkdirSync(path.join(chemin, categorie), { recursive: true });
    }

    res.json({
      success: true,
      categories: CATEGORIES_MUSEE,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/analyser-dossier", async (req, res) => {
  try {
    const { chemin } = req.body;

    if (!chemin) {
      return res.status(400).json({ success: false, error: "Chemin manquant" });
    }

    if (!fs.existsSync(chemin)) {
      return res.status(400).json({
        success: false,
        error: "Le dossier n'existe pas : " + chemin,
      });
    }

    const photos = listerImagesDossier(chemin);

    res.json({
      success: true,
      nomDossier: path.basename(chemin),
      chemin,
      nombrePhotos: photos.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/renommer-oeuvres", async (req, res) => {
  try {
    console.log("APPEL BACKEND /renommer-oeuvres =", req.body);

    const dateDebutRenommage = new Date();

    const { cheminVisite } = req.body;

    if (!cheminVisite) {
      return res.status(400).json({
        success: false,
        error: "cheminVisite manquant",
      });
    }

    if (!fs.existsSync(cheminVisite)) {
      return res.status(400).json({
        success: false,
        error: "Le dossier de visite n'existe pas : " + cheminVisite,
      });
    }

    const cheminOeuvres = path.join(cheminVisite, "Oeuvres");
    const cheminCartels = path.join(cheminVisite, "Cartels");
    const cheminVerification = path.join(cheminVisite, "A_verifier_renommage");

    if (!fs.existsSync(cheminOeuvres)) {
      return res.status(400).json({
        success: false,
        error: "Le dossier Oeuvres n'existe pas : " + cheminOeuvres,
      });
    }

    if (!fs.existsSync(cheminCartels)) {
      return res.status(400).json({
        success: false,
        error: "Le dossier Cartels n'existe pas : " + cheminCartels,
      });
    }

    fs.mkdirSync(cheminVerification, { recursive: true });

    const oeuvres = listerImagesDossier(cheminOeuvres);
    const cartels = listerImagesDossier(cheminCartels);

    const resultats = [];
    let renommes = 0;
    let aVerifier = 0;
    let erreursOcrJson = 0;

    for (const oeuvre of oeuvres) {
      const cartel = trouverCartelLePlusProche(oeuvre, cartels);

      const cheminOeuvre = path.join(cheminOeuvres, oeuvre);

      if (!cartel) {
        const nomVerification = rendreNomUnique(cheminVerification, oeuvre);
        fs.copyFileSync(cheminOeuvre, path.join(cheminVerification, nomVerification));

        aVerifier += 1;
        resultats.push({
          oeuvre,
          success: false,
          raison: "Aucun cartel proche",
        });
        continue;
      }

      const cheminCartel = path.join(cheminCartels, cartel);

      try {
        const bufferCartel = fs.readFileSync(cheminCartel);
        const analyse = await analyserCartelImageBuffer(bufferCartel);

        const nomOeuvreFinal = rendreNomUnique(
          cheminOeuvres,
          construireNomIntelligentDepuisAnalyse(oeuvre, analyse)
        );

        const cheminOeuvreFinal = path.join(cheminOeuvres, nomOeuvreFinal);

        fs.renameSync(cheminOeuvre, cheminOeuvreFinal);

        const nomCartelFinal = nomOeuvreFinal.replace(/\.[^.]+$/i, "_CARTEL.jpg");
        const cheminCartelFinal = path.join(cheminCartels, nomCartelFinal);

        fs.copyFileSync(cheminCartel, cheminCartelFinal);

        renommes += 1;

        resultats.push({
          oeuvre,
          cartel,
          nomOeuvreFinal,
          nomCartelFinal,
          analyse,
          success: true,
        });
      } catch (error) {
        console.error("ERREUR RENOMMAGE OEUVRE =", error);

        const nomVerification = rendreNomUnique(cheminVerification, oeuvre);
        fs.copyFileSync(cheminOeuvre, path.join(cheminVerification, nomVerification));

        erreursOcrJson += 1;
        aVerifier += 1;

        resultats.push({
          oeuvre,
          cartel,
          success: false,
          error: error.message,
        });
      }
    }

    const dateFinRenommage = new Date();
    const tempsRenommageSecondes = Math.round(
      (dateFinRenommage.getTime() - dateDebutRenommage.getTime()) / 1000
    );

    const fichiersAVerifierReels = compterImagesDossier(cheminVerification);
    const photosAnalysees = oeuvres.length;
    const tauxReussite =
      photosAnalysees > 0 ? Math.round((renommes / photosAnalysees) * 100) : 0;

    const nomDossierResultat = path.basename(cheminVisite);
    const infosCreation = extraireCreationDossierDepuisNom(nomDossierResultat);

    const dashboardRenommage = {
      statut: "RENOMMAGE TERMINÉ",
      dossierSource: nomDossierResultat,
      cheminResultat: cheminVisite,
      photosAnalysees,
      oeuvresRenommees: renommes,
      fichiersAVerifier: fichiersAVerifierReels,
      tauxReussite,
      tempsRenommageSecondes,
      debutTraitement: formaterDateHeureLocale(dateDebutRenommage),
      finTraitement: formaterDateHeureLocale(dateFinRenommage),
      creationDossierLocale: infosCreation.creationDossierLocale,
      creationDossierUTC: infosCreation.creationDossierUTC,
    };

    res.json({
      success: true,

      total: photosAnalysees,
      renommes,
      aVerifier: fichiersAVerifierReels,

      erreursOcrJson,

      tauxReussite,

      dashboardRenommage,

      resultats,
    });
  } catch (error) {
    console.error("ERREUR /renommer-oeuvres =", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.post("/ouvrir-dossier", async (req, res) => {
  try {
    const { chemin } = req.body;

    if (!chemin) {
      return res.status(400).json({
        success: false,
        error: "Chemin manquant",
      });
    }

    if (!fs.existsSync(chemin)) {
      return res.status(400).json({
        success: false,
        error: "Le dossier n'existe pas : " + chemin,
      });
    }

    exec(`explorer "${chemin}"`);

    res.json({ success: true });
  } catch (error) {
    console.error("ERREUR /ouvrir-dossier =", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});



app.get("/photos-analysees", async (req, res) => {
  try {
    const dossierRacine = req.query.dossierRacine || "C:\\Voyages";
    const dossierDestination = path.join(
      dossierRacine,
      "Photos analysées singulièrement"
    );

    if (!fs.existsSync(dossierDestination)) {
      return res.json({
        success: true,
        dossierDestination,
        total: 0,
        photos: [],
      });
    }

    const fichiersJson = fs
      .readdirSync(dossierDestination)
      .filter((fichier) => fichier.toLowerCase().endsWith(".json"))
      .sort((a, b) => b.localeCompare(a, "fr", { numeric: true }));

    const photos = [];

    for (const nomJson of fichiersJson) {
      try {
        const cheminJson = path.join(dossierDestination, nomJson);
        const contenu = JSON.parse(fs.readFileSync(cheminJson, "utf-8"));
        const nomPhoto =
          contenu.nom_photo_sauvegardee ||
          path.basename(nomJson, path.extname(nomJson)) + ".jpeg";

        const cheminPhoto = path.join(dossierDestination, nomPhoto);

        photos.push({
          nomJson,
          nomPhoto,
          dateAnalyseIso: contenu.date_analyse_iso || "",
          dateAnalyseLocale: contenu.date_analyse_locale || "",
          dossierDestination,
          imageExiste: fs.existsSync(cheminPhoto),
          imageUrl: `/photo-analysee/${encodeURIComponent(nomPhoto)}`,
          analyse: contenu.analyse || {},
        });
      } catch (error) {
        console.error("ERREUR LECTURE JSON GALERIE =", nomJson, error);
      }
    }

    res.json({
      success: true,
      dossierDestination,
      total: photos.length,
      photos,
    });
  } catch (error) {
    console.error("ERREUR /photos-analysees =", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete("/photo-analysee", async (req, res) => {
  try {
    const dossierRacine = req.body?.dossierRacine || "C:\Voyages";
    const dossierDestination = path.join(
      dossierRacine,
      "Photos analysées singulièrement"
    );

    const nomPhoto = path.basename(req.body?.nomPhoto || "");
    const nomJson = path.basename(req.body?.nomJson || "");

    if (!nomPhoto && !nomJson) {
      return res.status(400).json({
        success: false,
        error: "Nom de photo ou nom de JSON manquant",
      });
    }

    const fichiersSupprimes = [];
    const fichiersIntrouvables = [];

    function supprimerFichier(nomFichier) {
      if (!nomFichier) return;

      const cheminFichier = path.join(dossierDestination, path.basename(nomFichier));

      if (fs.existsSync(cheminFichier)) {
        fs.unlinkSync(cheminFichier);
        fichiersSupprimes.push(path.basename(nomFichier));
      } else {
        fichiersIntrouvables.push(path.basename(nomFichier));
      }
    }

    supprimerFichier(nomPhoto);
    supprimerFichier(nomJson);

    if (!nomJson && nomPhoto) {
      const basePhoto = path.basename(nomPhoto, path.extname(nomPhoto));
      supprimerFichier(basePhoto + ".json");
    }

    if (!nomPhoto && nomJson) {
      const baseJson = path.basename(nomJson, path.extname(nomJson));
      supprimerFichier(baseJson + ".jpeg");
      supprimerFichier(baseJson + ".jpg");
      supprimerFichier(baseJson + ".png");
      supprimerFichier(baseJson + ".webp");
    }

    res.json({
      success: true,
      dossierDestination,
      fichiersSupprimes,
      fichiersIntrouvables,
    });
  } catch (error) {
    console.error("ERREUR DELETE /photo-analysee =", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/photo-analysee/:nomPhoto", async (req, res) => {
  try {
    const dossierRacine = req.query.dossierRacine || "C:\\Voyages";
    const dossierDestination = path.join(
      dossierRacine,
      "Photos analysées singulièrement"
    );

    const nomPhoto = path.basename(decodeURIComponent(req.params.nomPhoto || ""));
    const cheminPhoto = path.join(dossierDestination, nomPhoto);

    if (!fs.existsSync(cheminPhoto)) {
      return res.status(404).json({
        success: false,
        error: "Photo introuvable",
      });
    }

    res.sendFile(cheminPhoto);
  } catch (error) {
    console.error("ERREUR /photo-analysee =", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3001, () => {
  console.log("PhotoCartel API démarrée sur le port 3001");
});