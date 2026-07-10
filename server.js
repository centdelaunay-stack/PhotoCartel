// PhotoCartel v31.2-exploration-dossiers — server cloud-ready.
// Multi-visite séquentiel : chaque visite possède sa propre fenêtre début/fin pour le rangement.
// Visite rapide : « Ville non renseignée » reste le libellé UI ; le stockage utilise « Visites rapides ».
// Aucun moteur IA/OCR/classification/renommage modifié.

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

import { exec } from "child_process";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOSSIER_RACINE_DONNEES =
  process.env.PHOTOCARTEL_DATA_DIR ||
  (process.platform === "win32"
    ? "C:\\PhotoCartel"
    : path.join(__dirname, "photocartel-data"));
const DOSSIERS_INFRASTRUCTURE_PHOTOCARTEL = [
  "Voyages",
  "Classifications",
  "Œuvres renommées",
  "Exports",
  "Photos à analyser",
  "Photos analysées",
  "Collecte Photo en cours",
  "Démonstrations",
  "Paramètres",
  "Logs",
];

const DOSSIER_EXPORTS_PHOTOCARTEL = path.join(
  DOSSIER_RACINE_DONNEES,
  "Exports"
);

const DOSSIER_METIER_VOYAGES = "Voyages";

function construireCheminVoyageMetierPhotoCartel(nomVoyage) {
  // v28.2.4 : la création métier PC doit toujours partir de la racine officielle PhotoCartel.
  // On ignore volontairement tout ancien dossierRacine envoyé par le frontend
  // pour éviter de recréer des voyages sous C:\\Voyages ou PhotoCartel_Mode_Demonstration.
  const nomVoyageNettoye = nettoyerSegmentCheminPhotoCartel(nomVoyage);

  if (!nomVoyageNettoye) {
    return "";
  }

  return path.join(DOSSIER_RACINE_DONNEES, DOSSIER_METIER_VOYAGES, nomVoyageNettoye);
}

function construireCheminVilleMetierPhotoCartel(nomVoyage, nomVille) {
  // v28.2.4 : la ville est un dossier métier créé sous le voyage actif.
  const nomVoyageNettoye = nettoyerSegmentCheminPhotoCartel(nomVoyage);
  const nomVilleNettoye = nettoyerSegmentCheminPhotoCartel(nomVille);

  if (!nomVoyageNettoye || !nomVilleNettoye) {
    return "";
  }

  return path.join(
    DOSSIER_RACINE_DONNEES,
    DOSSIER_METIER_VOYAGES,
    nomVoyageNettoye,
    nomVilleNettoye
  );
}

function construireCheminVisiteMetierPhotoCartel(nomVoyage, nomVille, nomVisite) {
  // v28.2.4 : la visite est le dossier métier créé sous la ville active.
  const nomVoyageNettoye = nettoyerSegmentCheminPhotoCartel(nomVoyage);
  const nomVilleNettoye = nettoyerSegmentCheminPhotoCartel(nomVille);
  const nomVisiteNettoye = nettoyerSegmentCheminPhotoCartel(nomVisite);

  if (!nomVoyageNettoye || !nomVilleNettoye || !nomVisiteNettoye) {
    return "";
  }

  return path.join(
    DOSSIER_RACINE_DONNEES,
    DOSSIER_METIER_VOYAGES,
    nomVoyageNettoye,
    nomVilleNettoye,
    nomVisiteNettoye
  );
}

function categoriesPourTypeVisite(typeVisite = "Musée") {
  if (typeVisite === "Musée") return CATEGORIES_MUSEE;
  if (typeVisite === "Église" || typeVisite === "Eglise") return CATEGORIES_EGLISE;

  // Une visite rapide (type vide) reste volontairement un dossier racine vide.
  if (!String(typeVisite || "").trim()) return [];

  return ["A_verifier_classification"];
}

function creerSousDossiersCategoriesVisite(cheminVisite, typeVisite = "Musée") {
  // v30.5 : les catégories dépendent réellement du type de visite.
  // Une visite rapide crée uniquement son dossier racine, sans sous-dossier typé.
  const categories = categoriesPourTypeVisite(typeVisite);

  fs.mkdirSync(cheminVisite, { recursive: true });

  for (const categorie of categories) {
    fs.mkdirSync(path.join(cheminVisite, categorie), { recursive: true });
  }

  return categories;
}

function initialiserInfrastructurePhotoCartel() {
  fs.mkdirSync(DOSSIER_RACINE_DONNEES, { recursive: true });

  for (const nomDossier of DOSSIERS_INFRASTRUCTURE_PHOTOCARTEL) {
    fs.mkdirSync(path.join(DOSSIER_RACINE_DONNEES, nomDossier), { recursive: true });
  }
}

initialiserInfrastructurePhotoCartel();
console.log("Dossier racine PhotoCartel =", DOSSIER_RACINE_DONNEES);
console.log("Dossiers infrastructure PhotoCartel =", DOSSIERS_INFRASTRUCTURE_PHOTOCARTEL.join(", "));
console.log("Dossier Exports PhotoCartel =", DOSSIER_EXPORTS_PHOTOCARTEL);
console.log("PhotoCartel v31.2-exploration-dossiers — routes Mode Démonstration actives");

const DOSSIER_MODE_DEMONSTRATION = path.join(
  DOSSIER_RACINE_DONNEES,
  "PhotoCartel_Mode_Demonstration"
);
const DOSSIER_SOURCE_MODE_DEMONSTRATION = path.join(
  DOSSIER_RACINE_DONNEES,
  "PhotoCartel_Mode_Demonstration_Source"
);


const upload = multer({
  storage: multer.memoryStorage(),
});

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.get(["/health", "/api/health"], (req, res) => {
  res.json({
    success: true,
    service: "PhotoCartel API",
    version: "v31.2-exploration-dossiers",
    dataRoot: DOSSIER_RACINE_DONNEES,
    infrastructureDirs: DOSSIERS_INFRASTRUCTURE_PHOTOCARTEL,
  });
});


// PhotoCartel v31.2-exploration-dossiers — routes Mode Démonstration déclarées très tôt.
// Objectif : éviter toute ambiguïté d'ordre d'enregistrement des routes Express.

function extraireMsDepuisNomPhotoCartel(nomFichier) {
  const match = String(nomFichier || "").match(/(\d{8})_(\d{6})(?:_(\d{3}))?/);
  if (!match) return 0;

  const date = match[1];
  const heure = match[2];
  const millisecondes = match[3] || "000";
  const annee = Number(date.slice(0, 4));
  const mois = Number(date.slice(4, 6)) - 1;
  const jour = Number(date.slice(6, 8));
  const heures = Number(heure.slice(0, 2));
  const minutes = Number(heure.slice(2, 4));
  const secondes = Number(heure.slice(4, 6));

  const valeur = new Date(annee, mois, jour, heures, minutes, secondes, Number(millisecondes)).getTime();
  return Number.isFinite(valeur) ? valeur : 0;
}

function trouverVisitePourPhotoRangement(visites, nomFichier) {
  const photoMs = extraireMsDepuisNomPhotoCartel(nomFichier);
  if (!photoMs) return null;

  return visites.find((visite) => {
    const debut = Number(visite.debutMs || 0);
    const fin = Number(visite.finMs || 0);
    return debut && fin && photoMs >= debut && photoMs < fin;
  }) || null;
}

function nomDossierVilleStockagePourVisite(visite = {}) {
  const type = String(visite.type || visite.typeVisite || "").trim();
  const nom = String(visite.nom || visite.nomVisite || "").trim();
  const estRapide = !type || nom.startsWith("Visite rapide_") || nom.startsWith("A_EN_COURS_");
  return estRapide ? "Visites rapides" : String(visite.ville || visite.nomVille || "").trim();
}

function cheminDestinationVisiteDepuisRangement(visite) {
  const nomVoyage = nettoyerSegmentCheminPhotoCartel(visite.voyage);
  const nomVille = nettoyerSegmentCheminPhotoCartel(nomDossierVilleStockagePourVisite(visite));
  const nomVisite = nettoyerSegmentCheminPhotoCartel(visite.nom);

  if (!nomVoyage || !nomVille || !nomVisite) return "";

  return path.join(
    DOSSIER_RACINE_DONNEES,
    DOSSIER_METIER_VOYAGES,
    nomVoyage,
    nomVille,
    nomVisite
  );
}

app.post("/ranger-photos-visites", async (req, res) => {
  try {
    const visites = Array.isArray(req.body.visites) ? req.body.visites : [];

    if (visites.length === 0) {
      return res.json({
        success: true,
        photosLues: 0,
        photosRangees: 0,
        photosNonAttribuees: 0,
        visites: [],
      });
    }

    const dossierRacine = req.body.dossierRacine || DOSSIER_RACINE_DONNEES;
    const dossierCollecte = path.join(
      cheminDansRacineDonnees(dossierRacine),
      "Collecte Photo en cours"
    );

    fs.mkdirSync(dossierCollecte, { recursive: true });

    const statsParVisite = new Map(visites.map((visite) => [visite.id, { ...visite, photosRangees: 0 }]));
    let photosLues = 0;
    let photosRangees = 0;
    let photosNonAttribuees = 0;
    const resultats = [];

    const fichiers = fs
      .readdirSync(dossierCollecte)
      .filter(estImage)
      .sort((a, b) => a.localeCompare(b, "fr", { numeric: true }));

    for (const fichier of fichiers) {
      photosLues += 1;
      const visite = trouverVisitePourPhotoRangement(visites, fichier);

      if (!visite) {
        photosNonAttribuees += 1;
        resultats.push({ fichier, success: false, raison: "Aucune visite correspondante" });
        continue;
      }

      const cheminDestination = cheminDestinationVisiteDepuisRangement(visite);
      if (!cheminDestination) {
        photosNonAttribuees += 1;
        resultats.push({ fichier, success: false, raison: "Chemin destination invalide" });
        continue;
      }

      fs.mkdirSync(cheminDestination, { recursive: true });

      const cheminSource = path.join(dossierCollecte, fichier);
      const nomDestination = rendreNomUnique(cheminDestination, fichier);
      const cheminFinal = path.join(cheminDestination, nomDestination);

      fs.renameSync(cheminSource, cheminFinal);

      photosRangees += 1;
      const stat = statsParVisite.get(visite.id);
      if (stat) stat.photosRangees += 1;

      resultats.push({
        fichier,
        fichierDestination: nomDestination,
        visiteId: visite.id,
        visiteNom: visite.nom,
        success: true,
      });
    }

    res.json({
      success: true,
      mode: "serveur",
      dossierCollecte,
      photosLues,
      photosRangees,
      deplaces: photosRangees,
      photosNonAttribuees,
      visites: Array.from(statsParVisite.values()),
      resultats,
      totalCollecteRestant: compterImagesDossier(dossierCollecte),
    });
  } catch (error) {
    console.error("ERREUR /ranger-photos-visites =", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});


app.get("/mode-demonstration/ping", (req, res) => {
  res.json({
    success: true,
    version: "v31.2-exploration-dossiers",
    message: "Route mode démonstration disponible",
  });
});

app.post("/mode-demonstration/lancer", handlerLancerModeDemonstration);
app.post("/api/mode-demonstration/lancer", handlerLancerModeDemonstration);
app.post("/mode-demonstration/exporter", handlerExporterModeDemonstration);
app.post("/api/mode-demonstration/exporter", handlerExporterModeDemonstration);


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const CATEGORIES_MUSEE = [
  "Oeuvres",
  "Cartels",
  "Jardins",
  "Architecture",
  "Batiments",
  "Structures",
  "A_verifier_classification",
];

const CATEGORIES_EGLISE = [
  "Facade",
  "Nef",
  "A_verifier_classification",
];

const EXTENSIONS_IMAGE = [".jpg", ".jpeg", ".png", ".webp"];

function estImage(fichier) {
  return EXTENSIONS_IMAGE.includes(path.extname(fichier).toLowerCase());
}


function nettoyerSegmentCheminPhotoCartel(segment) {
  return String(segment || "")
    .replace(/[<>:"|?*]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function cheminDansRacineDonnees(cheminRecu) {
  if (!cheminRecu) return "";

  const brut = String(cheminRecu).trim();
  if (!brut) return "";

  // En local Windows, le frontend envoie déjà une racine absolue (v28 : C:\PhotoCartel).
  if (process.platform === "win32") {
    return brut;
  }

  // Sur Render/Linux, on ne doit jamais créer un faux dossier Windows comme "C:\PhotoCartel" ou "C:\Voyages".
  // Toute arborescence reçue du frontend est replacée proprement sous DOSSIER_RACINE_DONNEES.
  const brutNormalise = brut.replace(/\\/g, "/");

  if (path.isAbsolute(brutNormalise) && brutNormalise.startsWith(DOSSIER_RACINE_DONNEES)) {
    return brutNormalise;
  }

  let relatif = brutNormalise.replace(/^[A-Za-z]:\/?/, "");
  relatif = relatif.replace(/^\/+/, "");

  let segments = relatif
    .split("/")
    .map(nettoyerSegmentCheminPhotoCartel)
    .filter((segment) => segment && segment !== "." && segment !== "..");

  // Compatibilité : si le frontend envoie une ancienne racine Windows (C:\Voyages)
  // ou la nouvelle racine (C:\PhotoCartel), on replace proprement sous DOSSIER_RACINE_DONNEES.
  if (segments[0] && ["voyages", "photocartel"].includes(segments[0].toLowerCase())) {
    segments = segments.slice(1);
  }

  if (segments.length === 0) {
    return DOSSIER_RACINE_DONNEES;
  }

  return path.join(DOSSIER_RACINE_DONNEES, ...segments);
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

function copierDossierRecursive(source, destination) {
  if (!fs.existsSync(source)) return 0;

  fs.mkdirSync(destination, { recursive: true });

  let nombreFichiers = 0;
  const entrees = fs.readdirSync(source, { withFileTypes: true });

  for (const entree of entrees) {
    const cheminSource = path.join(source, entree.name);
    const cheminDestination = path.join(destination, entree.name);

    if (entree.isDirectory()) {
      nombreFichiers += copierDossierRecursive(cheminSource, cheminDestination);
    } else if (entree.isFile()) {
      fs.copyFileSync(cheminSource, cheminDestination);
      nombreFichiers += 1;
    }
  }

  return nombreFichiers;
}

function copierImagesReferenceModeDemonstration(source, destination) {
  if (!fs.existsSync(source)) return 0;

  fs.mkdirSync(destination, { recursive: true });

  let copies = 0;
  const fichiers = fs
    .readdirSync(source)
    .filter(estImage)
    .sort((a, b) => a.localeCompare(b, "fr", { numeric: true }));

  for (const fichier of fichiers) {
    const nomFinal = rendreNomUnique(destination, fichier);
    fs.copyFileSync(path.join(source, fichier), path.join(destination, nomFinal));
    copies += 1;
  }

  return copies;
}

function compterFichiersRecursive(chemin) {
  if (!fs.existsSync(chemin)) return 0;

  let total = 0;
  const entrees = fs.readdirSync(chemin, { withFileTypes: true });

  for (const entree of entrees) {
    const cheminEntree = path.join(chemin, entree.name);
    if (entree.isDirectory()) total += compterFichiersRecursive(cheminEntree);
    if (entree.isFile()) total += 1;
  }

  return total;
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


function creerFichePatrimonialeV18() {
  return {
    schema: {
      nom: "PhotoCartel_Fiche_Patrimoniale",
      version: "v18.5.3",
      langue: "fr"
    },

    contexte_photo: {
      pays_photo: "",
      ville_photo: "",
      site_photo: ""
    },

    identification: {
      type_general: "",
      type_patrimonial: "",
      categorie: "",
      sous_type: "",
      nom_ou_titre: "",
      titre_original: "",
      titre_traduit_fr: "",
      objet_principal: "",
      auteur_createur_architecte: "",
      attribution: "",
      atelier_ecole_cercle: "",
      culture_civilisation: "",
      pays_origine: "",
      mouvement_style: "",
      fonction_origine: "",
      fonction_actuelle: "",
      resume_identification: ""
    },

    datation: {
      date_precise: "",
      date_debut: "",
      date_fin: "",
      siecle: "",
      periode: "",
      epoque: "",
      dynastie_regne: "",
      justification_datation: ""
    },

    localisation: {
      pays: "",
      region: "",
      ville: "",
      quartier: "",
      site_lieu: "",
      musee_institution: "",
      salle_galerie_zone: "",
      adresse: "",
      coordonnees_gps: "",
      localisation_probable: "",
      justification_localisation: ""
    },

    caracteristiques_physiques: {
      dimensions_originales: "",
      hauteur: "",
      largeur: "",
      profondeur: "",
      longueur: "",
      diametre: "",
      surface: "",
      superficie: "",
      volume: "",
      poids: "",
      hauteur_totale: "",
      hauteur_interieure: "",
      hauteur_nef: "",
      hauteur_tours: "",
      hauteur_fleche: "",
      nombre_etages: "",
      nombre_pieces: "",
      capacite: "",
      altitude: "",
      altitude_min: "",
      altitude_max: "",
      profondeur_max: "",
      portee_principale: "",
      longueur_totale: "",
      largeur_max: "",
      remarques_dimensions: ""
    },

    materiaux_techniques: {
      materiaux: [],
      technique: "",
      support: "",
      medium: "",
      procede: "",
      structure: "",
      decoration: "",
      couleurs_dominantes: [],
      inscriptions_visibles: "",
      signature_visible: "",
      marques_cachets: ""
    },

    description_visuelle: {
      description_courte: "",
      description_detaillee: "",
      elements_visibles: [],
      personnages: "",
      animaux: "",
      objets_visibles: [],
      scene_representee: "",
      composition: "",
      point_de_vue_photo: "",
      etat_visible: "",
      mots_cles: []
    },

    analyse_patrimoniale: {
      style: "",
      mouvement: "",
      courant: "",
      genre: "",
      theme: "",
      iconographie: "",
      symboles: [],
      fonction_patrimoniale: "",
      importance_patrimoniale: "",
      classement_protection: "",
      unesco: "",
      commentaire_interpretatif: ""
    },

    contexte_historique: {
      contexte_creation: "",
      commanditaire: "",
      usage_initial: "",
      usage_actuel: "",
      evenement_associe: "",
      periode_historique: "",
      contexte_culturel: "",
      provenance_historique: "",
      transformations_restaurations: ""
    },

    informations_museographiques: {
      musee: "",
      institution: "",
      collection: "",
      departement: "",
      salle: "",
      numero_inventaire: "",
      cartel_present: "",
      texte_cartel_visible: "",
      provenance: "",
      mode_acquisition: "",
      proprietaire: "",
      credit_ligne: "",
      droits: ""
    },

    etat_conservation: {
      etat_apparent: "",
      degradations_visibles: [],
      restaurations_visibles: "",
      elements_manquants: "",
      remarques_conservation: ""
    },

    paysage_environnement: {
      type_paysage: "",
      element_naturel_principal: "",
      massif_montagneux: "",
      cours_eau: "",
      lac_mer_ocean: "",
      parc_reserve: "",
      vegetation: "",
      climat_apparent: "",
      saison_probable: "",
      environnement_urbain: "",
      environnement_naturel: ""
    },

    relations: {
      fait_partie_de: "",
      ensemble_serie: "",
      oeuvre_liee: "",
      monument_lie: "",
      artiste_lie: "",
      lieu_lie: "",
      cartel_associe: "",
      photos_associees: []
    },

    hypotheses: {
      identification_probable: "",
      hypotheses_alternatives: [],
      elements_pour: [],
      elements_contre: [],
      incertitudes: [],
      niveau_prudence: ""
    },

    confiance: {
      score_global: 0,
      score_identification: 0,
      score_datation: 0,
      score_localisation: 0,
      score_auteur: 0,
      score_dimensions: 0,
      explication_confiance: ""
    },

    meta_photocartel: {
      type_document: "PHOTO_ANALYSEE",
      version_photocartel: "v18.5.3",
      date_analyse_iso: "",
      nom_photo_original: "",
      modele_ia: "",
      source_analyse: "photo",
      avertissement: "Les informations produites par l'IA sont des hypothèses structurées et doivent être vérifiées par l'utilisateur."
    }
  };
}

function construireAnalysePhotoFallback(note = "Analyse IA non exploitable") {
  return normaliserAnalysePhoto({
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
  });
}

function valeurTexte(...valeurs) {
  for (const valeur of valeurs) {
    if (valeur === null || valeur === undefined) continue;

    if (Array.isArray(valeur)) {
      const texte = valeur.filter(Boolean).join(", ").trim();
      if (texte) return texte;
      continue;
    }

    const texte = String(valeur).trim();
    if (texte) return texte;
  }

  return "";
}

function valeurTableau(...valeurs) {
  for (const valeur of valeurs) {
    if (Array.isArray(valeur)) {
      return valeur.filter(Boolean).map((item) => String(item));
    }

    if (typeof valeur === "string" && valeur.trim()) {
      return valeur
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
}

function normaliserScore(valeur, fallback = 0) {
  const nombre = Number(valeur);

  if (!Number.isFinite(nombre)) return fallback;

  if (nombre > 1 && nombre <= 100) {
    return nombre / 100;
  }

  if (nombre < 0) return 0;
  if (nombre > 1) return 1;

  return nombre;
}


function estOrigineGeographiqueInterdite(valeur) {
  const texte = String(valeur || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (!texte) return false;

  const interditsExact = new Set([
    "asie",
    "afrique",
    "europe",
    "amerique",
    "amérique",
    "oceanie",
    "océanie",
    "antarctique",
    "amerique du sud",
    "amérique du sud",
    "amerique du nord",
    "amérique du nord",
    "amerique centrale",
    "amérique centrale",
    "amerique latine",
    "amérique latine",
    "asie du sud-est",
    "asie du sud est",
    "asie centrale",
    "asie orientale",
    "asie de l'est",
    "asie du sud",
    "moyen-orient",
    "moyen orient",
    "proche-orient",
    "proche orient",
    "afrique centrale",
    "afrique de l'ouest",
    "afrique de l est",
    "afrique de l'est",
    "afrique du nord",
    "afrique australe",
    "europe de l'ouest",
    "europe de l est",
    "europe de l'est",
    "europe centrale",
    "europe du nord",
    "europe du sud"
  ]);

  const base = texte
    .replace(/\(probable\)/g, "")
    .replace(/\(possible\)/g, "")
    .replace(/\(incertain\)/g, "")
    .trim();

  return interditsExact.has(base);
}

function normaliserPaysOrigine(valeur) {
  const texte = String(valeur || "").trim();

  if (!texte) return "";

  if (estOrigineGeographiqueInterdite(texte)) {
    return "Inconnu";
  }

  return texte;
}

function normaliserAnalysePhoto(analyse) {
  const source = analyse && typeof analyse === "object" ? analyse : {};
  const ficheSource =
    source.fiche_patrimoniale_v18 && typeof source.fiche_patrimoniale_v18 === "object"
      ? source.fiche_patrimoniale_v18
      : {};

  const ficheV18 = creerFichePatrimonialeV18();

  const blocs = [
    "schema",
    "contexte_photo",
    "identification",
    "datation",
    "localisation",
    "caracteristiques_physiques",
    "materiaux_techniques",
    "description_visuelle",
    "analyse_patrimoniale",
    "contexte_historique",
    "informations_museographiques",
    "etat_conservation",
    "paysage_environnement",
    "relations",
    "hypotheses",
    "confiance",
    "meta_photocartel",
  ];

  for (const bloc of blocs) {
    if (
      ficheSource[bloc] &&
      typeof ficheSource[bloc] === "object" &&
      !Array.isArray(ficheSource[bloc])
    ) {
      ficheV18[bloc] = {
        ...ficheV18[bloc],
        ...ficheSource[bloc],
      };
    }
  }

  ficheV18.schema.nom = "PhotoCartel_Fiche_Patrimoniale";
  ficheV18.schema.version = "v18.5.3";
  ficheV18.schema.langue = "fr";

  ficheV18.contexte_photo.pays_photo = valeurTexte(
    ficheV18.contexte_photo.pays_photo,
    source.pays_photo,
    source.pays_de_la_photo
  );
  ficheV18.contexte_photo.ville_photo = valeurTexte(
    ficheV18.contexte_photo.ville_photo,
    source.ville_photo,
    source.ville_de_la_photo
  );
  ficheV18.contexte_photo.site_photo = valeurTexte(
    ficheV18.contexte_photo.site_photo,
    source.site_photo,
    source.site_de_la_photo
  );

  ficheV18.identification.type_general = valeurTexte(
    ficheV18.identification.type_general,
    source.type_detecte,
    "photo"
  );
  ficheV18.identification.objet_principal = valeurTexte(
    ficheV18.identification.objet_principal,
    source.objet_principal,
    source.objet,
    "objet ou scène photographiée"
  );
  ficheV18.identification.nom_ou_titre = valeurTexte(
    ficheV18.identification.nom_ou_titre,
    source.titre_fr,
    source.titre_en
  );
  ficheV18.identification.titre_traduit_fr = valeurTexte(
    ficheV18.identification.titre_traduit_fr,
    source.titre_fr
  );
  ficheV18.identification.titre_original = valeurTexte(
    ficheV18.identification.titre_original,
    source.titre_en
  );
  ficheV18.identification.auteur_createur_architecte = valeurTexte(
    ficheV18.identification.auteur_createur_architecte,
    source.auteur_ou_createur,
    source.auteur,
    source.createur,
    source.architecte
  );
  ficheV18.identification.categorie = valeurTexte(
    ficheV18.identification.categorie,
    source.categorie
  );
  ficheV18.identification.sous_type = valeurTexte(
    ficheV18.identification.sous_type,
    source.sous_type
  );
  ficheV18.identification.culture_civilisation = valeurTexte(
    ficheV18.identification.culture_civilisation,
    source.culture_civilisation,
    source.culture
  );
  ficheV18.identification.pays_origine = normaliserPaysOrigine(
    valeurTexte(
      ficheV18.identification.pays_origine,
      source.pays_origine,
      source.pays_d_origine,
      source.country_origin
    )
  );
  ficheV18.identification.mouvement_style = valeurTexte(
    ficheV18.identification.mouvement_style,
    source.style_ou_mouvement,
    source.style
  );
  ficheV18.identification.fonction_origine = valeurTexte(
    ficheV18.identification.fonction_origine,
    source.fonction_origine,
    source.fonction
  );

  ficheV18.datation.date_precise = valeurTexte(
    ficheV18.datation.date_precise,
    source.date_ou_periode,
    source.date,
    source.periode
  );

  ficheV18.localisation.localisation_probable = valeurTexte(
    ficheV18.localisation.localisation_probable,
    source.lieu_probable
  );
  ficheV18.localisation.ville = valeurTexte(ficheV18.localisation.ville, source.ville);
  ficheV18.localisation.pays = valeurTexte(ficheV18.localisation.pays, source.pays);
  ficheV18.localisation.region = valeurTexte(
    ficheV18.localisation.region,
    source.region
  );
  ficheV18.localisation.musee_institution = valeurTexte(
    ficheV18.localisation.musee_institution,
    source.musee_ou_institution,
    source.musee,
    source.institution
  );

  ficheV18.caracteristiques_physiques.dimensions_originales = valeurTexte(
    ficheV18.caracteristiques_physiques.dimensions_originales,
    source.dimensions
  );

  ficheV18.materiaux_techniques.technique = valeurTexte(
    ficheV18.materiaux_techniques.technique,
    source.technique
  );
  ficheV18.materiaux_techniques.support = valeurTexte(
    ficheV18.materiaux_techniques.support,
    source.support
  );
  ficheV18.materiaux_techniques.materiaux = valeurTableau(
    ficheV18.materiaux_techniques.materiaux,
    source.materiaux,
    source.materiau
  );

  ficheV18.description_visuelle.description_detaillee = valeurTexte(
    ficheV18.description_visuelle.description_detaillee,
    source.description
  );
  ficheV18.description_visuelle.elements_visibles = valeurTableau(
    ficheV18.description_visuelle.elements_visibles,
    source.elements_visibles,
    source.visible_elements
  );
  ficheV18.description_visuelle.mots_cles = valeurTableau(
    ficheV18.description_visuelle.mots_cles,
    source.mots_cles,
    source.keywords
  );

  ficheV18.hypotheses.incertitudes = valeurTableau(
    ficheV18.hypotheses.incertitudes,
    source.notes
  );

  ficheV18.confiance.score_global = normaliserScore(
    ficheV18.confiance.score_global || source.confidence,
    0
  );

  const titreFr = valeurTexte(
    source.titre_fr,
    ficheV18.identification.titre_traduit_fr,
    ficheV18.identification.nom_ou_titre
  );

  const titreEn = valeurTexte(source.titre_en, ficheV18.identification.titre_original);

  const materiaux = valeurTexte(ficheV18.materiaux_techniques.materiaux);

  const dimensions = valeurTexte(
    ficheV18.caracteristiques_physiques.dimensions_originales,
    ficheV18.caracteristiques_physiques.hauteur || ficheV18.caracteristiques_physiques.largeur
      ? [
          ficheV18.caracteristiques_physiques.hauteur,
          ficheV18.caracteristiques_physiques.largeur,
          ficheV18.caracteristiques_physiques.profondeur,
        ]
          .filter(Boolean)
          .join(" × ")
      : ""
  );

  const lieuProbable = valeurTexte(
    ficheV18.localisation.localisation_probable,
    ficheV18.localisation.site_lieu
  );

  const museeInstitution = valeurTexte(
    ficheV18.localisation.musee_institution,
    ficheV18.informations_museographiques.musee,
    ficheV18.informations_museographiques.institution
  );

  const notes = valeurTexte(
    source.notes,
    ficheV18.hypotheses.incertitudes,
    ficheV18.confiance.explication_confiance
  );

  return {
    pays_photo: ficheV18.contexte_photo.pays_photo,
    ville_photo: ficheV18.contexte_photo.ville_photo,
    site_photo: ficheV18.contexte_photo.site_photo,
    pays_origine: normaliserPaysOrigine(
      valeurTexte(
        ficheV18.identification.pays_origine,
        ficheV18.localisation.pays,
        source.pays_origine,
        source.pays
      )
    ),

    // Champs historiques v17 : conservés pour ne rien casser dans l'affichage actuel.
    type_detecte: valeurTexte(
      source.type_detecte,
      ficheV18.identification.type_general,
      ficheV18.identification.type_patrimonial,
      "photo"
    ),
    objet_principal: valeurTexte(
      source.objet_principal,
      ficheV18.identification.objet_principal,
      "objet ou scène photographiée"
    ),
    titre_fr: titreFr,
    titre_en: titreEn,
    auteur_ou_createur: valeurTexte(
      source.auteur_ou_createur,
      ficheV18.identification.auteur_createur_architecte
    ),
    date_ou_periode: valeurTexte(
      source.date_ou_periode,
      ficheV18.datation.date_precise,
      ficheV18.datation.periode,
      ficheV18.datation.siecle
    ),
    categorie: valeurTexte(source.categorie, ficheV18.identification.categorie),
    sous_type: valeurTexte(source.sous_type, ficheV18.identification.sous_type),
    style_ou_mouvement: valeurTexte(
      source.style_ou_mouvement,
      ficheV18.identification.mouvement_style,
      ficheV18.analyse_patrimoniale.style,
      ficheV18.analyse_patrimoniale.mouvement
    ),
    technique: valeurTexte(source.technique, ficheV18.materiaux_techniques.technique),
    support: valeurTexte(source.support, ficheV18.materiaux_techniques.support),
    materiaux,
    dimensions,
    lieu_probable: lieuProbable,
    ville: valeurTexte(source.ville, ficheV18.localisation.ville),
    pays: valeurTexte(source.pays, ficheV18.localisation.pays),
    musee_ou_institution: museeInstitution,
    description: valeurTexte(
      source.description,
      ficheV18.description_visuelle.description_detaillee,
      ficheV18.description_visuelle.description_courte
    ),
    elements_visibles: ficheV18.description_visuelle.elements_visibles,
    mots_cles: ficheV18.description_visuelle.mots_cles,
    notes,
    confidence: ficheV18.confiance.score_global,

    // Nouveau socle v18.
    fiche_patrimoniale_v18: ficheV18,
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
Tu es PhotoCartel, un assistant de voyage patrimonial.

MISSION :
Chaque photo doit produire une fiche patrimoniale structurée.
Tu ne dois pas seulement décrire l'image : tu dois essayer de reconnaître, identifier, contextualiser et documenter ce que le voyageur regarde.

La photo peut représenter :
- une œuvre d'art : peinture, sculpture, photographie, installation, objet de musée ;
- un objet patrimonial : masque, textile, meuble, céramique, objet religieux, objet ethnographique, artisanat ;
- un monument : église, cathédrale, temple, château, pont, tour, bâtiment historique ;
- un bâtiment contemporain : musée, gratte-ciel, gare, aéroport, architecture remarquable ;
- un paysage : montagne, lac, cascade, jardin, parc national, site naturel ;
- un cartel, une plaque, une inscription, un panneau muséographique ;
- ou tout autre élément rencontré pendant un voyage.

PRINCIPE FONDAMENTAL :
PhotoCartel assiste mais ne décide pas.
Tu dois distinguer clairement :
- les informations certaines ;
- les informations probables ;
- les hypothèses alternatives ;
- les incertitudes.

RÈGLES :
- Ne jamais inventer une information lorsqu'elle est incertaine.
- Distinguer clairement les faits observables des hypothèses.
- Si tu reconnais probablement un objet, un monument, une œuvre, une culture, un pays ou un lieu, indique-le comme probable.
- Si plusieurs origines sont plausibles, préfère une origine probable, une région culturelle ou plusieurs hypothèses plutôt qu'un seul pays affirmé.
- Si l'image ne permet pas d'être sûr, utilise les champs hypotheses, incertitudes et confiance.
- Adopte le comportement d'un conservateur de musée : précis lorsqu'il sait, prudent lorsqu'il doute.
- Si une donnée est absente ou non pertinente, retourne "" ou [].

RÈGLES DE PRUDENCE v18.5.3 POUR L'ORIGINE :
- Ne force jamais une origine géographique à partir d'un simple style visuel.
- Ne transforme jamais automatiquement "artisanat", "masque", "bois", "motifs colorés" en "Mexique", "Afrique" ou "Amérique du Sud".
- Le champ pays_origine doit contenir uniquement une origine certaine ou raisonnablement probable.
- Si l'objet présente des caractéristiques culturelles fortes, propose l'origine la plus probable, même si la certitude n'est pas absolue. Dans ce cas ajoute "(probable)" à la valeur plutôt que de laisser le champ vide.
- Si l'origine est probable mais non certaine, écris la valeur directement sous la forme : "Costa Rica (probable)", "Guatemala (probable)", "Japon (probable)", etc.
- Pour les masques, sculptures ou objets artisanaux d'Amérique centrale, examine explicitement les cultures possibles : Boruca / Costa Rica, Guatemala, Mexique, Panama, Nicaragua, Honduras. Ne choisis pas le Mexique par défaut.
- Si des masques en bois sculptés avec cornes, expressions fortes ou iconographie rituelle évoquent les masques Boruca, renseigne : pays_origine = "Costa Rica (probable)" et culture_civilisation = "Boruca (probable)", sauf indice contraire visible.
- Si l'origine est très incertaine, laisse pays_origine vide et mets l'hypothèse dans hypotheses.identification_probable et hypotheses.hypotheses_alternatives.
- Si plusieurs pays sont plausibles, choisis le plus probable uniquement si tu as des indices suffisants, sinon n'en choisis aucun comme certitude.
- Pour les objets ethnographiques, distingue toujours pays_origine, culture_civilisation et hypotheses_alternatives.
- Les hypothèses alternatives doivent être conservées dans fiche_patrimoniale_v18.hypotheses.hypotheses_alternatives.
- RÈGLE SÉMANTIQUE STRICTE : le champ pays_origine doit contenir uniquement un pays souverain ou une entité historique/culturelle assimilable à une origine précise lorsque c'est pertinent.
- N'écris jamais un continent dans pays_origine : jamais "Europe", "Asie", "Afrique", "Amérique", "Océanie".
- N'écris jamais une région vague dans pays_origine : jamais "Asie du Sud-Est", "Afrique centrale", "Amérique latine", "Moyen-Orient", "Europe de l'Est".
- Si tu ne peux pas identifier un pays précis, laisse pays_origine vide ou écris "Inconnu".
- Si une région culturelle est utile, place-la dans localisation.region, contexte_historique.contexte_culturel, analyse_patrimoniale.commentaire_interpretatif ou hypotheses.identification_probable, mais jamais dans pays_origine.
- Exemples corrects :
  pays_origine = "Italie"
  pays_origine = "Thaïlande (probable)"
  pays_origine = "Cambodge (probable)"
  pays_origine = "Costa Rica (probable)"
  pays_origine = "Inconnu"
- Exemples interdits :
  pays_origine = "Asie"
  pays_origine = "Afrique"
  pays_origine = "Europe"
  pays_origine = "Asie du Sud-Est"
  pays_origine = "Amérique latine"
- Pour un objet bouddhiste asiatique dont le pays exact n'est pas identifiable, ne mets pas "Asie" dans pays_origine. Écris plutôt :
  pays_origine = "Inconnu"
  culture_civilisation = "bouddhiste"
  hypotheses.identification_probable = "origine probable en Asie du Sud-Est"
  hypotheses.hypotheses_alternatives = ["Thaïlande", "Cambodge", "Myanmar", "Laos"]
- Ne mélange jamais les catégories sémantiques :
  Italie est un pays.
  Venise est une ville.
  Baroque est un style.
  Bouddhisme est une religion ou une culture.
  Asie est un continent.
  Afrique centrale est une région.
- Les indices qui soutiennent l'identification doivent être conservés dans fiche_patrimoniale_v18.hypotheses.elements_pour.
- Les limites ou doutes doivent être conservés dans fiche_patrimoniale_v18.hypotheses.incertitudes.
- Le champ confiance.explication_confiance doit expliquer brièvement pourquoi l'identification est certaine, probable ou incertaine.
- Tous les textes doivent être en français.
- Les scores de confiance sont des nombres entre 0 et 1.
- Tu dois retourner EXCLUSIVEMENT un JSON valide.
- Ne retourne aucun texte avant ou après le JSON.

IMPORTANT :
Tu dois remplir deux niveaux :
1. Les champs historiques v17, pour affichage immédiat dans l'application.
2. Le bloc fiche_patrimoniale_v18, plus riche, structuré par blocs.

Tu dois distinguer deux blocs :
1. Contexte de la photo : pays_photo, ville_photo, site_photo. Ces champs décrivent où la photo a été prise.
2. Contenu analysé : ce que la photo représente.

RÈGLE CONTEXTE PHOTO :
- Sans GPS, EXIF, voyage actif ou indice visuel explicite, ne devine jamais le lieu de prise de vue.
- Si le lieu de prise de vue ne peut pas être déduit avec certitude de l'image, laisse pays_photo, ville_photo et site_photo vides.
- Ne remplis pays_photo, ville_photo ou site_photo que si un indice visible le justifie clairement.

Les champs pays_photo, ville_photo et site_photo doivent toujours exister, même si la valeur est "".
Le champ "pays_origine" doit indiquer l'origine historique, culturelle ou géographique de l'objet photographié.
Ne confonds jamais "Pays de la photo" et "Pays d'origine".
Le champ "pays" historique est conservé pour compatibilité ; il peut reprendre le pays d'origine lorsque pertinent.
Le champ "ville" historique est conservé pour compatibilité.
Le champ "dimensions" doit être renseigné si une dimension connue ou estimable est pertinente.
Pour les bâtiments et monuments, renseigne aussi les dimensions pertinentes : hauteur, longueur, hauteur_nef, hauteur_tours, nombre_etages, superficie, etc.
Pour les œuvres, renseigne auteur, titre, date, technique, support, dimensions, musée si possible.
Pour les objets ethnographiques ou artisanaux, renseigne culture_civilisation, pays probable, région, fonction et matériaux si possible.
Pour les monuments ou bâtiments, renseigne architecte, date, style, fonction, hauteur, nombre d'étages, classement, contexte si possible.

Format attendu :
{
  "pays_photo": "",
  "ville_photo": "",
  "site_photo": "",
  "pays_origine": "",
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
  "confidence": 0,
  "fiche_patrimoniale_v18": {
    "schema": {
      "nom": "PhotoCartel_Fiche_Patrimoniale",
      "version": "v18.5.3",
      "langue": "fr"
    },
    "contexte_photo": {
      "pays_photo": "",
      "ville_photo": "",
      "site_photo": ""
    },
    "identification": {
      "type_general": "",
      "type_patrimonial": "",
      "categorie": "",
      "sous_type": "",
      "nom_ou_titre": "",
      "titre_original": "",
      "titre_traduit_fr": "",
      "objet_principal": "",
      "auteur_createur_architecte": "",
      "attribution": "",
      "atelier_ecole_cercle": "",
      "culture_civilisation": "",
      "pays_origine": "",
      "mouvement_style": "",
      "fonction_origine": "",
      "fonction_actuelle": "",
      "resume_identification": ""
    },
    "datation": {
      "date_precise": "",
      "date_debut": "",
      "date_fin": "",
      "siecle": "",
      "periode": "",
      "epoque": "",
      "dynastie_regne": "",
      "justification_datation": ""
    },
    "localisation": {
      "pays": "",
      "region": "",
      "ville": "",
      "quartier": "",
      "site_lieu": "",
      "musee_institution": "",
      "salle_galerie_zone": "",
      "adresse": "",
      "coordonnees_gps": "",
      "localisation_probable": "",
      "justification_localisation": ""
    },
    "caracteristiques_physiques": {
      "dimensions_originales": "",
      "hauteur": "",
      "largeur": "",
      "profondeur": "",
      "longueur": "",
      "diametre": "",
      "surface": "",
      "superficie": "",
      "volume": "",
      "poids": "",
      "hauteur_totale": "",
      "hauteur_interieure": "",
      "hauteur_nef": "",
      "hauteur_tours": "",
      "hauteur_fleche": "",
      "nombre_etages": "",
      "nombre_pieces": "",
      "capacite": "",
      "altitude": "",
      "altitude_min": "",
      "altitude_max": "",
      "profondeur_max": "",
      "portee_principale": "",
      "longueur_totale": "",
      "largeur_max": "",
      "remarques_dimensions": ""
    },
    "materiaux_techniques": {
      "materiaux": [],
      "technique": "",
      "support": "",
      "medium": "",
      "procede": "",
      "structure": "",
      "decoration": "",
      "couleurs_dominantes": [],
      "inscriptions_visibles": "",
      "signature_visible": "",
      "marques_cachets": ""
    },
    "description_visuelle": {
      "description_courte": "",
      "description_detaillee": "",
      "elements_visibles": [],
      "personnages": "",
      "animaux": "",
      "objets_visibles": [],
      "scene_representee": "",
      "composition": "",
      "point_de_vue_photo": "",
      "etat_visible": "",
      "mots_cles": []
    },
    "analyse_patrimoniale": {
      "style": "",
      "mouvement": "",
      "courant": "",
      "genre": "",
      "theme": "",
      "iconographie": "",
      "symboles": [],
      "fonction_patrimoniale": "",
      "importance_patrimoniale": "",
      "classement_protection": "",
      "unesco": "",
      "commentaire_interpretatif": ""
    },
    "contexte_historique": {
      "contexte_creation": "",
      "commanditaire": "",
      "usage_initial": "",
      "usage_actuel": "",
      "evenement_associe": "",
      "periode_historique": "",
      "contexte_culturel": "",
      "provenance_historique": "",
      "transformations_restaurations": ""
    },
    "informations_museographiques": {
      "musee": "",
      "institution": "",
      "collection": "",
      "departement": "",
      "salle": "",
      "numero_inventaire": "",
      "cartel_present": "",
      "texte_cartel_visible": "",
      "provenance": "",
      "mode_acquisition": "",
      "proprietaire": "",
      "credit_ligne": "",
      "droits": ""
    },
    "etat_conservation": {
      "etat_apparent": "",
      "degradations_visibles": [],
      "restaurations_visibles": "",
      "elements_manquants": "",
      "remarques_conservation": ""
    },
    "paysage_environnement": {
      "type_paysage": "",
      "element_naturel_principal": "",
      "massif_montagneux": "",
      "cours_eau": "",
      "lac_mer_ocean": "",
      "parc_reserve": "",
      "vegetation": "",
      "climat_apparent": "",
      "saison_probable": "",
      "environnement_urbain": "",
      "environnement_naturel": ""
    },
    "relations": {
      "fait_partie_de": "",
      "ensemble_serie": "",
      "oeuvre_liee": "",
      "monument_lie": "",
      "artiste_lie": "",
      "lieu_lie": "",
      "cartel_associe": "",
      "photos_associees": []
    },
    "hypotheses": {
      "identification_probable": "",
      "hypotheses_alternatives": [],
      "elements_pour": [],
      "elements_contre": [],
      "incertitudes": [],
      "niveau_prudence": ""
    },
    "confiance": {
      "score_global": 0,
      "score_identification": 0,
      "score_datation": 0,
      "score_localisation": 0,
      "score_auteur": 0,
      "score_dimensions": 0,
      "explication_confiance": ""
    },
    "meta_photocartel": {
      "type_document": "PHOTO_ANALYSEE",
      "version_photocartel": "v18.5.3",
      "date_analyse_iso": "",
      "nom_photo_original": "",
      "modele_ia": "gpt-4o",
      "source_analyse": "photo",
      "avertissement": "Les informations produites par l'IA sont des hypothèses structurées et doivent être vérifiées par l'utilisateur."
    }
  }
}
`,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Analyse cette photo comme une fiche patrimoniale PhotoCartel. Commence par estimer le contexte de la photo (pays_photo, ville_photo, site_photo), puis identifie le contenu analysé. Sois particulièrement prudent sur le pays d'origine : n'invente pas de certitude, utilise la forme 'Pays (probable)' lorsque c'est seulement probable, et conserve les hypothèses alternatives dans le JSON. Retourne uniquement le JSON demandé.",
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
    temperature: 0.1,
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

    const dossierRacine = req.body.dossierRacine || DOSSIER_RACINE_DONNEES;
    const dossierDestination = path.join(
      dossierRacine,
      "Photos analysées"
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
      version_photocartel: "v30.1",
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

    const racine = dossierRacine || DOSSIER_RACINE_DONNEES;
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


app.post("/enregistrer-photos-visite", upload.array("photos"), async (req, res) => {
  try {
    const dossierRacine = req.body.dossierRacine || DOSSIER_RACINE_DONNEES;
    const dossierDestination = path.join(
      cheminDansRacineDonnees(dossierRacine),
      "Collecte Photo en cours"
    );

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Aucune photo reçue",
      });
    }

    fs.mkdirSync(dossierDestination, { recursive: true });

    const fichiersSauvegardes = [];
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

        const timestamp = genererTimestampAnalysePhoto(new Date());
        const nomDestination = rendreNomUnique(
          dossierDestination,
          `${timestamp}_VISITE${extension}`
        );
        const cheminFinal = path.join(dossierDestination, nomDestination);

        fs.writeFileSync(cheminFinal, photo.buffer);
        fichiersSauvegardes.push(nomDestination);
        copies += 1;
        resultats.push({
          fichier: nomOriginal,
          fichierDestination: nomDestination,
          success: true,
          ignore: false,
        });
      } catch (error) {
        console.error("ERREUR ENREGISTREMENT PHOTO VISITE =", error);
        ignores += 1;
        resultats.push({
          fichier: photo.originalname,
          success: false,
          error: error.message,
        });
      }
    }

    res.json({
      success: true,
      dossierDestination,
      cheminDestination: dossierDestination,
      recus: req.files.length,
      copies,
      ignores,
      fichiersSauvegardes,
      totalDestination: compterImagesDossier(dossierDestination),
      resultats,
    });
  } catch (error) {
    console.error("ERREUR /enregistrer-photos-visite =", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.post("/actualiser-photos-visite", upload.array("photos"), async (req, res) => {
  try {
    const cheminDestinationOriginal = req.body.cheminDestination;
    const cheminDestination = cheminDansRacineDonnees(cheminDestinationOriginal);

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


app.get("/mode-demonstration/ping", (req, res) => {
  res.json({
    success: true,
    version: "v31.2-exploration-dossiers",
    message: "Route mode démonstration disponible",
  });
});

async function handlerLancerModeDemonstration(req, res) {
  try {
    const dossierRacine = req.body?.dossierRacine || DOSSIER_RACINE_DONNEES;
    const cheminModeDemonstration = path.join(
      dossierRacine,
      "PhotoCartel_Mode_Demonstration"
    );
    const cheminSourceReferences = path.join(
      dossierRacine,
      "PhotoCartel_Mode_Demonstration_Source"
    );
    const cheminAnalyses = path.join(
      cheminModeDemonstration,
      "Photos analysées"
    );

    fs.mkdirSync(cheminModeDemonstration, { recursive: true });
    fs.mkdirSync(cheminAnalyses, { recursive: true });
    fs.mkdirSync(cheminSourceReferences, { recursive: true });

    const photosCopiees = copierImagesReferenceModeDemonstration(
      cheminSourceReferences,
      cheminModeDemonstration
    );

    res.json({
      success: true,
      cheminModeDemonstration,
      cheminSourceReferences,
      cheminAnalyses,
      photosCopiees,
      message:
        "Mode démonstration prêt. Utilise Analyser une photo pour lancer la démonstration.",
    });
  } catch (error) {
    console.error("ERREUR /mode-demonstration/lancer =", error);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function handlerExporterModeDemonstration(req, res) {
  try {
    const cheminModeDemonstration =
      req.body?.cheminModeDemonstration || DOSSIER_MODE_DEMONSTRATION;

    if (!fs.existsSync(cheminModeDemonstration)) {
      return res.status(404).json({
        success: false,
        error: "Le dossier du mode démonstration est introuvable.",
      });
    }

    const maintenant = new Date();
    const nomExport =
      "Export_Mode_Demonstration_PhotoCartel_" +
      genererTimestampAnalysePhoto(maintenant);
    const cheminExport = path.join(DOSSIER_EXPORTS_PHOTOCARTEL, nomExport);

    const nombreFichiers = copierDossierRecursive(
      cheminModeDemonstration,
      cheminExport
    );

    res.json({
      success: true,
      cheminModeDemonstration,
      cheminExport,
      dossierExport: DOSSIER_EXPORTS_PHOTOCARTEL,
      nombreFichiers,
    });
  } catch (error) {
    console.error("ERREUR /mode-demonstration/exporter =", error);
    res.status(500).json({ success: false, error: error.message });
  }
}

app.post("/mode-demonstration/lancer", handlerLancerModeDemonstration);
app.post("/api/mode-demonstration/lancer", handlerLancerModeDemonstration);
app.post("/mode-demonstration/exporter", handlerExporterModeDemonstration);
app.post("/api/mode-demonstration/exporter", handlerExporterModeDemonstration);

app.post("/creer-voyage", async (req, res) => {
  try {
    const nomVoyage = nettoyerSegmentCheminPhotoCartel(req.body.nomVoyage);

    if (!nomVoyage) {
      return res.status(400).json({ success: false, error: "Nom de voyage manquant" });
    }

    initialiserInfrastructurePhotoCartel();

    const chemin = construireCheminVoyageMetierPhotoCartel(nomVoyage);

    fs.mkdirSync(chemin, { recursive: true });

    res.json({
      success: true,
      chemin,
      nomVoyage,
      typeDossier: "metier_voyage",
      architecture: "PhotoCartel/Voyages/<Voyage>",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/creer-voyage", async (req, res) => {
  try {
    const nomVoyage = nettoyerSegmentCheminPhotoCartel(req.body.nomVoyage);

    if (!nomVoyage) {
      return res.status(400).json({ success: false, error: "Nom de voyage manquant" });
    }

    initialiserInfrastructurePhotoCartel();

    const chemin = construireCheminVoyageMetierPhotoCartel(nomVoyage);

    fs.mkdirSync(chemin, { recursive: true });

    res.json({
      success: true,
      chemin,
      nomVoyage,
      typeDossier: "metier_voyage",
      architecture: "PhotoCartel/Voyages/<Voyage>",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});


async function handlerCreerVille(req, res) {
  try {
    const nomVoyage = nettoyerSegmentCheminPhotoCartel(req.body.nomVoyage);
    const nomVille = nettoyerSegmentCheminPhotoCartel(req.body.nomVille);

    if (!nomVoyage) {
      return res.status(400).json({ success: false, error: "Nom de voyage manquant" });
    }

    if (!nomVille) {
      return res.status(400).json({ success: false, error: "Nom de ville manquant" });
    }

    initialiserInfrastructurePhotoCartel();

    const chemin = construireCheminVilleMetierPhotoCartel(nomVoyage, nomVille);

    if (!chemin) {
      return res.status(400).json({ success: false, error: "Chemin de ville invalide" });
    }

    fs.mkdirSync(chemin, { recursive: true });

    res.json({
      success: true,
      chemin,
      nomVoyage,
      nomVille,
      typeDossier: "metier_ville",
      architecture: "PhotoCartel/Voyages/<Voyage>/<Ville>",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}

app.post("/creer-ville", handlerCreerVille);
app.post("/api/creer-ville", handlerCreerVille);

async function handlerCreerVisiteMetier(req, res) {
  try {
    const nomVoyage = nettoyerSegmentCheminPhotoCartel(req.body.nomVoyage);
    const nomVisite = nettoyerSegmentCheminPhotoCartel(req.body.nomVisite);
    const typeVisite = nettoyerSegmentCheminPhotoCartel(
      req.body.typeVisite === undefined || req.body.typeVisite === null
        ? "Musée"
        : req.body.typeVisite
    );
    const estVisiteRapide = !String(typeVisite || "").trim();
    // v31.2 : le libellé UI reste « Ville non renseignée », mais le dossier physique
    // de toutes les visites rapides est désormais « Visites rapides ».
    // Une ancienne ville éventuellement envoyée par un client obsolète est volontairement ignorée.
    const nomVille = estVisiteRapide
      ? "Visites rapides"
      : nettoyerSegmentCheminPhotoCartel(req.body.nomVille);

    if (!nomVoyage) {
      return res.status(400).json({ success: false, error: "Nom de voyage manquant" });
    }

    if (!nomVille) {
      return res.status(400).json({ success: false, error: "Nom de ville manquant" });
    }

    if (!nomVisite) {
      return res.status(400).json({ success: false, error: "Nom de visite manquant" });
    }

    initialiserInfrastructurePhotoCartel();

    const chemin = construireCheminVisiteMetierPhotoCartel(nomVoyage, nomVille, nomVisite);

    if (!chemin) {
      return res.status(400).json({ success: false, error: "Chemin de visite invalide" });
    }

    const categoriesCreees = creerSousDossiersCategoriesVisite(chemin, typeVisite);

    res.json({
      success: true,
      chemin,
      nomVoyage,
      nomVille,
      nomVisite,
      typeVisite,
      categoriesCreees,
      typeDossier: "metier_visite",
      architecture: "PhotoCartel/Voyages/<Voyage>/<Ville>/<Nom de la visite>",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}

app.post("/creer-visite-metier", handlerCreerVisiteMetier);
app.post("/api/creer-visite-metier", handlerCreerVisiteMetier);

function verifierDossierVisiteDiagnostic(cheminVisite, typeVisite = "Musée") {
  const categoriesAttendues = categoriesPourTypeVisite(typeVisite);

  return {
    existe: fs.existsSync(cheminVisite),
    categories: categoriesAttendues.map((categorie) => ({
      nom: categorie,
      existe: fs.existsSync(path.join(cheminVisite, categorie)),
    })),
  };
}


// Compatibilité locale avec les essais v28.2.3 : l'ancien endpoint crée désormais une visite.
app.post("/creer-lieu", handlerCreerVisiteMetier);
app.post("/api/creer-lieu", handlerCreerVisiteMetier);

app.post("/creer-dossier", async (req, res) => {
  try {
    const cheminOriginal = req.body.chemin;
    const chemin = cheminDansRacineDonnees(cheminOriginal);

    if (!chemin) {
      return res.status(400).json({ success: false, error: "Chemin manquant" });
    }

    fs.mkdirSync(chemin, { recursive: true });

    res.json({ success: true, chemin, cheminOriginal });
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

      const chemin = cheminDansRacineDonnees(req.body.chemin);
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
    const cheminOriginal = req.body.chemin;
    const chemin = cheminDansRacineDonnees(cheminOriginal);

    if (!chemin) {
      return res.status(400).json({ success: false, error: "Chemin manquant" });
    }

    for (const categorie of CATEGORIES_MUSEE) {
      fs.mkdirSync(path.join(chemin, categorie), { recursive: true });
    }

    res.json({
      success: true,
      chemin,
      cheminOriginal,
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

app.post(["/ouvrir-photocartel", "/api/ouvrir-photocartel"], async (req, res) => {
  try {
    initialiserInfrastructurePhotoCartel();

    if (process.platform !== "win32") {
      return res.status(400).json({
        success: false,
        error: "L'ouverture directe dans l'Explorateur est disponible sur le serveur local Windows.",
      });
    }

    exec(`explorer "${DOSSIER_RACINE_DONNEES}"`);
    res.json({ success: true, chemin: DOSSIER_RACINE_DONNEES });
  } catch (error) {
    console.error("ERREUR /ouvrir-photocartel =", error);
    res.status(500).json({ success: false, error: error.message });
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
    const dossierRacine = req.query.dossierRacine || DOSSIER_RACINE_DONNEES;
    const dossierDestination = path.join(
      dossierRacine,
      "Photos analysées"
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
          imageUrl: `/photo-analysee/${encodeURIComponent(
            nomPhoto
          )}?dossierRacine=${encodeURIComponent(dossierRacine)}`,
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
    const dossierRacine = req.body?.dossierRacine || DOSSIER_RACINE_DONNEES;
    const dossierDestination = path.join(
      dossierRacine,
      "Photos analysées"
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


function valeurCsvAnalyse(...valeurs) {
  for (const valeur of valeurs) {
    if (valeur === null || valeur === undefined) continue;

    if (Array.isArray(valeur)) {
      const texteTableau = valeur.filter(Boolean).join(", ").trim();
      if (texteTableau) return texteTableau;
      continue;
    }

    if (typeof valeur === "object") {
      const texteObjet = JSON.stringify(valeur);
      if (texteObjet && texteObjet !== "{}" && texteObjet !== "[]") return texteObjet;
      continue;
    }

    const texte = String(valeur).trim();
    if (texte) return texte;
  }

  return "";
}

function nombreCsvAnalyse(...valeurs) {
  const texte = valeurCsvAnalyse(...valeurs);
  if (!texte) return "";

  const nombre = Number(texte);
  if (!Number.isFinite(nombre)) return texte;

  return String(nombre).replace(".", ",");
}

function echapperCsv(valeur) {
  const texte = String(valeur ?? "").replace(/\r?\n|\r/g, " ");
  return '"' + texte.replace(/"/g, '""') + '"';
}

function ligneCsv(valeurs) {
  return valeurs.map(echapperCsv).join(";");
}

function construireLigneExportAnalyse(contenu, nomJson) {
  const analyse = contenu?.analyse || {};
  const fiche = analyse.fiche_patrimoniale_v18 || {};
  const contextePhoto = fiche.contexte_photo || {};
  const identification = fiche.identification || {};
  const datation = fiche.datation || {};
  const localisation = fiche.localisation || {};
  const physique = fiche.caracteristiques_physiques || {};
  const materiauxTechniques = fiche.materiaux_techniques || {};
  const analysePatrimoniale = fiche.analyse_patrimoniale || {};
  const contexteHistorique = fiche.contexte_historique || {};
  const museographie = fiche.informations_museographiques || {};
  const descriptionVisuelle = fiche.description_visuelle || {};
  const confiance = fiche.confiance || {};
  const hypotheses = fiche.hypotheses || {};

  return {
    type_document: contenu.type_document || "PHOTO_ANALYSEE",
    version_photocartel: contenu.version_photocartel || "",
    date_analyse_iso: contenu.date_analyse_iso || "",
    date_analyse_locale: contenu.date_analyse_locale || "",
    nom_photo_original: contenu.nom_photo_original || "",
    nom_photo_sauvegardee: contenu.nom_photo_sauvegardee || "",
    nom_json_sauvegarde: contenu.nom_json_sauvegarde || nomJson || "",

    voyage: valeurCsvAnalyse(contenu.voyage, contenu.meta_photocartel?.voyage),
    ville_visite: valeurCsvAnalyse(contenu.ville_visite, contenu.meta_photocartel?.ville_visite),
    lieu_visite: valeurCsvAnalyse(contenu.lieu_visite, contenu.meta_photocartel?.lieu_visite),
    type_visite: valeurCsvAnalyse(contenu.type_visite, contenu.meta_photocartel?.type_visite),

    pays_photo: valeurCsvAnalyse(contextePhoto.pays_photo, analyse.pays_photo),
    ville_photo: valeurCsvAnalyse(contextePhoto.ville_photo, analyse.ville_photo),
    site_photo: valeurCsvAnalyse(contextePhoto.site_photo, analyse.site_photo),

    type_general: valeurCsvAnalyse(identification.type_general, analyse.type_detecte),
    type_patrimonial: valeurCsvAnalyse(identification.type_patrimonial),
    categorie: valeurCsvAnalyse(identification.categorie, analyse.categorie),
    sous_type: valeurCsvAnalyse(identification.sous_type, analyse.sous_type),
    objet_principal: valeurCsvAnalyse(identification.objet_principal, analyse.objet_principal),
    titre: valeurCsvAnalyse(identification.nom_ou_titre, analyse.titre_fr, analyse.titre_en),
    titre_original: valeurCsvAnalyse(identification.titre_original, analyse.titre_en),
    titre_fr: valeurCsvAnalyse(identification.titre_traduit_fr, analyse.titre_fr),
    auteur_createur_architecte: valeurCsvAnalyse(identification.auteur_createur_architecte, analyse.auteur_ou_createur),
    culture_civilisation: valeurCsvAnalyse(identification.culture_civilisation),
    pays_origine: valeurCsvAnalyse(identification.pays_origine, analyse.pays_origine, localisation.pays, analyse.pays),
    mouvement_style: valeurCsvAnalyse(identification.mouvement_style, analyse.style_ou_mouvement),
    fonction_origine: valeurCsvAnalyse(identification.fonction_origine),
    fonction_actuelle: valeurCsvAnalyse(identification.fonction_actuelle),

    date_precise: valeurCsvAnalyse(datation.date_precise, analyse.date_ou_periode),
    date_debut: valeurCsvAnalyse(datation.date_debut),
    date_fin: valeurCsvAnalyse(datation.date_fin),
    siecle: valeurCsvAnalyse(datation.siecle),
    periode: valeurCsvAnalyse(datation.periode),
    epoque: valeurCsvAnalyse(datation.epoque),
    dynastie_regne: valeurCsvAnalyse(datation.dynastie_regne),

    pays: valeurCsvAnalyse(localisation.pays, analyse.pays),
    region: valeurCsvAnalyse(localisation.region),
    ville: valeurCsvAnalyse(localisation.ville, analyse.ville),
    site_lieu: valeurCsvAnalyse(localisation.site_lieu, analyse.lieu_probable),
    musee_institution: valeurCsvAnalyse(localisation.musee_institution, analyse.musee_ou_institution),
    salle_galerie_zone: valeurCsvAnalyse(localisation.salle_galerie_zone),

    dimensions_originales: valeurCsvAnalyse(physique.dimensions_originales, analyse.dimensions),
    hauteur: valeurCsvAnalyse(physique.hauteur, physique.hauteur_totale),
    largeur: valeurCsvAnalyse(physique.largeur),
    profondeur: valeurCsvAnalyse(physique.profondeur),
    longueur: valeurCsvAnalyse(physique.longueur, physique.longueur_totale),
    surface: valeurCsvAnalyse(physique.surface, physique.superficie),
    poids: valeurCsvAnalyse(physique.poids),
    nombre_etages: valeurCsvAnalyse(physique.nombre_etages),
    hauteur_nef: valeurCsvAnalyse(physique.hauteur_nef),
    hauteur_tours: valeurCsvAnalyse(physique.hauteur_tours),

    materiaux: valeurCsvAnalyse(materiauxTechniques.materiaux, analyse.materiaux),
    technique: valeurCsvAnalyse(materiauxTechniques.technique, analyse.technique),
    support: valeurCsvAnalyse(materiauxTechniques.support, analyse.support),
    medium: valeurCsvAnalyse(materiauxTechniques.medium),

    style: valeurCsvAnalyse(analysePatrimoniale.style, analysePatrimoniale.mouvement, analyse.style_ou_mouvement),
    theme: valeurCsvAnalyse(analysePatrimoniale.theme),
    iconographie: valeurCsvAnalyse(analysePatrimoniale.iconographie),
    importance_patrimoniale: valeurCsvAnalyse(analysePatrimoniale.importance_patrimoniale),
    classement_protection: valeurCsvAnalyse(analysePatrimoniale.classement_protection),
    unesco: valeurCsvAnalyse(analysePatrimoniale.unesco),

    contexte_creation: valeurCsvAnalyse(contexteHistorique.contexte_creation),
    commanditaire: valeurCsvAnalyse(contexteHistorique.commanditaire),
    usage_initial: valeurCsvAnalyse(contexteHistorique.usage_initial),
    usage_actuel: valeurCsvAnalyse(contexteHistorique.usage_actuel),
    provenance_historique: valeurCsvAnalyse(contexteHistorique.provenance_historique),

    collection: valeurCsvAnalyse(museographie.collection),
    departement: valeurCsvAnalyse(museographie.departement),
    numero_inventaire: valeurCsvAnalyse(museographie.numero_inventaire),
    cartel_present: valeurCsvAnalyse(museographie.cartel_present),
    provenance: valeurCsvAnalyse(museographie.provenance),
    proprietaire: valeurCsvAnalyse(museographie.proprietaire),

    description_courte: valeurCsvAnalyse(descriptionVisuelle.description_courte),
    description_detaillee: valeurCsvAnalyse(descriptionVisuelle.description_detaillee, analyse.description),
    elements_visibles: valeurCsvAnalyse(descriptionVisuelle.elements_visibles, analyse.elements_visibles),
    mots_cles: valeurCsvAnalyse(descriptionVisuelle.mots_cles, analyse.mots_cles),

    identification_probable: valeurCsvAnalyse(hypotheses.identification_probable),
    incertitudes: valeurCsvAnalyse(hypotheses.incertitudes, analyse.notes),
    score_global: nombreCsvAnalyse(confiance.score_global, analyse.confidence),
    score_identification: nombreCsvAnalyse(confiance.score_identification),
    score_datation: nombreCsvAnalyse(confiance.score_datation),
    score_localisation: nombreCsvAnalyse(confiance.score_localisation),
    explication_confiance: valeurCsvAnalyse(confiance.explication_confiance),
  };
}

function genererCsvAnalyses(dossierDestination) {
  const colonnes = [
    "type_document",
    "version_photocartel",
    "date_analyse_iso",
    "date_analyse_locale",
    "nom_photo_original",
    "nom_photo_sauvegardee",
    "nom_json_sauvegarde",
    "voyage",
    "ville_visite",
    "lieu_visite",
    "type_visite",
    "pays_photo",
    "ville_photo",
    "site_photo",
    "type_general",
    "type_patrimonial",
    "categorie",
    "sous_type",
    "objet_principal",
    "titre",
    "titre_original",
    "titre_fr",
    "auteur_createur_architecte",
    "culture_civilisation",
    "pays_origine",
    "mouvement_style",
    "fonction_origine",
    "fonction_actuelle",
    "date_precise",
    "date_debut",
    "date_fin",
    "siecle",
    "periode",
    "epoque",
    "dynastie_regne",
    "pays",
    "region",
    "ville",
    "site_lieu",
    "musee_institution",
    "salle_galerie_zone",
    "dimensions_originales",
    "hauteur",
    "largeur",
    "profondeur",
    "longueur",
    "surface",
    "poids",
    "nombre_etages",
    "hauteur_nef",
    "hauteur_tours",
    "materiaux",
    "technique",
    "support",
    "medium",
    "style",
    "theme",
    "iconographie",
    "importance_patrimoniale",
    "classement_protection",
    "unesco",
    "contexte_creation",
    "commanditaire",
    "usage_initial",
    "usage_actuel",
    "provenance_historique",
    "collection",
    "departement",
    "numero_inventaire",
    "cartel_present",
    "provenance",
    "proprietaire",
    "description_courte",
    "description_detaillee",
    "elements_visibles",
    "mots_cles",
    "identification_probable",
    "incertitudes",
    "score_global",
    "score_identification",
    "score_datation",
    "score_localisation",
    "explication_confiance",
  ];

  const lignes = [ligneCsv(colonnes)];

  if (!fs.existsSync(dossierDestination)) {
    return "\ufeff" + lignes.join("\r\n") + "\r\n";
  }

  const fichiersJson = fs
    .readdirSync(dossierDestination)
    .filter((fichier) => fichier.toLowerCase().endsWith(".json"))
    .sort((a, b) => a.localeCompare(b, "fr", { numeric: true }));

  for (const nomJson of fichiersJson) {
    try {
      const cheminJson = path.join(dossierDestination, nomJson);
      const contenu = JSON.parse(fs.readFileSync(cheminJson, "utf-8"));
      const ligne = construireLigneExportAnalyse(contenu, nomJson);
      lignes.push(ligneCsv(colonnes.map((colonne) => ligne[colonne] ?? "")));
    } catch (error) {
      console.error("ERREUR EXPORT CSV JSON IGNORE =", nomJson, error.message);
    }
  }

  return "\ufeff" + lignes.join("\r\n") + "\r\n";
}

app.get("/export-analyses-csv", async (req, res) => {
  try {
    const dossierRacine = req.query.dossierRacine || DOSSIER_RACINE_DONNEES;
    const dossierDestination = path.join(
      dossierRacine,
      "Photos analysées"
    );

    const maintenant = new Date();
    const nomFichier =
      "photos_analysees_singulierement_" +
      genererTimestampAnalysePhoto(maintenant) +
      ".csv";

    const csv = genererCsvAnalyses(dossierDestination);

    fs.mkdirSync(DOSSIER_RACINE_DONNEES, { recursive: true });
fs.mkdirSync(DOSSIER_EXPORTS_PHOTOCARTEL, { recursive: true });

    const cheminExport = path.join(DOSSIER_EXPORTS_PHOTOCARTEL, nomFichier);
    fs.writeFileSync(cheminExport, csv, "utf-8");

    console.log("EXPORT CSV PHOTOCARTEL CREE =", cheminExport);

    res.json({
      success: true,
      fichier: nomFichier,
      cheminExport,
      dossierExport: DOSSIER_EXPORTS_PHOTOCARTEL,
      nombreJson: fs.existsSync(dossierDestination)
        ? fs
            .readdirSync(dossierDestination)
            .filter((fichier) => fichier.toLowerCase().endsWith(".json")).length
        : 0,
    });
  } catch (error) {
    console.error("ERREUR /export-analyses-csv =", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/photo-analysee/:nomPhoto", async (req, res) => {
  try {
    const dossierRacine = req.query.dossierRacine || DOSSIER_RACINE_DONNEES;
    const dossierDestination = path.join(
      dossierRacine,
      "Photos analysées"
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


// PhotoCartel v20.3 — filet de sécurité final Mode Démonstration.
// Placé juste avant app.listen pour garantir que ces routes répondent en JSON.
// Si ces réponses ne sont pas visibles dans Chrome, ce n'est pas ce server.js qui tourne.
app.use((req, res, next) => {
  const methode = String(req.method || "").toUpperCase();
  const route = String(req.path || "");

  if (route === "/mode-demonstration/ping" || route === "/api/mode-demonstration/ping") {
    console.log("PING MODE DEMONSTRATION RECU =", methode, route);
    return res.json({
      success: true,
      version: "v31.2-exploration-dossiers",
      message: "Mode démonstration disponible",
      route,
      methode
    });
  }

  if (
    methode === "POST" &&
    (route === "/mode-demonstration/lancer" || route === "/api/mode-demonstration/lancer")
  ) {
    console.log("LANCER MODE DEMONSTRATION RECU =", route);
    return handlerLancerModeDemonstration(req, res);
  }

  if (
    methode === "POST" &&
    (route === "/mode-demonstration/exporter" || route === "/api/mode-demonstration/exporter")
  ) {
    console.log("EXPORTER MODE DEMONSTRATION RECU =", route);
    return handlerExporterModeDemonstration(req, res);
  }

  return next();
});

const DOSSIER_FRONTEND_DIST = path.join(__dirname, "dist");

if (fs.existsSync(DOSSIER_FRONTEND_DIST)) {
  app.use(express.static(DOSSIER_FRONTEND_DIST));

  app.use((req, res, next) => {
    if (req.method !== "GET") return next();
    if (req.path.startsWith("/api/") || req.path.includes(".")) return next();

    const indexHtml = path.join(DOSSIER_FRONTEND_DIST, "index.html");
    if (fs.existsSync(indexHtml)) {
      return res.sendFile(indexHtml);
    }

    return next();
  });
}

const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`PhotoCartel API démarrée sur le port ${PORT}`);
  console.log("Dossier racine données PhotoCartel =", DOSSIER_RACINE_DONNEES);
});
