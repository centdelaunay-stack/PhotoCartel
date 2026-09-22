// PhotoCartel v81 — serveur inchangé depuis la v78 hormis le numéro de version.
//
// PhotoCartel v78 — RECHERCHE : l'index couvre toute la racine (toutes profondeurs,
// dossiers techniques exclus) et se pose à la racine, où il voyage avec la copie vers
// DCIM. Nouveaux : /mots-ajoutes-recherche (lecture C, fichier durable à la racine) et
// /photo-recherche (photo trouvée, par chemin relatif à la racine, miniature comprise).
// Le bloc d'index est identique, caractère pour caractère, à celui de l'App.
//
// PhotoCartel v77 — RÉPARATION : UN APPEL À L'IA NE PEUT PLUS BLOQUER LE RENOMMAGE.
// Reproduit sur la v75 (vrai processus, service IA local qui ne répond pas) : le tri
// de deux photos n'avait toujours rien renvoyé au bout de 150 s. Cause : les appels
// à l'IA du tri et de l'analyse des cartels n'avaient aucune borne propre et
// héritaient de celle du SDK OpenAI, 10 minutes par tentative et deux relances,
// soit jusqu'à 30 minutes par photo. Désormais, pour classifierImageBuffer et
// analyserCartelImageBuffer seulement : 40 s par appel et une seule relance
// (OPTIONS_APPEL_IA_BORNE). « Analyser une photo » n'est pas concerné.
// Une photo dont l'IA ne répond pas à temps est rangée « à vérifier », comme
// avant, mais sa raison est maintenant renvoyée à l'app en langage courant
// (erreursTri) au lieu d'être perdue dans le journal. Le journal du serveur
// indique la durée de chaque étape du tri, pour que le prochain incident sur
// Render nomme sa cause.
//
// PhotoCartel v69 — GALERIE DES PHOTOS ANALYSÉES : index durable, côté serveur.
// La route /photos-analysees lit et écrit le MÊME fichier d'index que la PWA
// (_PhotoCartel_index_galerie.json, posé dans « Photos analysées »), au même
// format, avec la même règle de tri et la même comparaison index/dossier. Le bloc
// de logique partagée est identique caractère pour caractère à celui d'App.jsx.
// Un seul readdirSync sert désormais à la comparaison ET au calcul de imageExiste
// (qui coûtait un existsSync par fiche).
// Le fichier d'index est un .json du dossier sans être une fiche : les trois
// endroits qui filtraient sur « .json » passent maintenant par
// estNomJsonFicheGalerie — export CSV, comptage annoncé par cette route, et
// validation de /modifier-analyse-galerie.
// PhotoCartel v62 — Resynchronisation de version uniquement. Aucun changement de code serveur.
// PhotoCartel v61 — Resynchronisation de version uniquement (ce fichier serveur affichait encore
// v60 alors qu'App.jsx était passé à v61 après un correctif d'affichage côté client — vignettes
// photo/cartel + nom proposé sur l'écran de propositions de renommage). Aucun changement de code
// serveur ce tour-ci.
// PhotoCartel v60 — CORRECTIF CRITIQUE côté App.jsx : le bouton "Renommer un dossier" avait été
// silencieusement débranché (revenu au placeholder). Détails complets dans App.jsx et le rapport
// joint. Aucun changement dans ce fichier serveur ce tour-ci (déjà vérifié à jour en v59).
// PhotoCartel v59 — AUCUN changement de code applicatif depuis v58 (revérifié, 0 bug trouvé dans
// Server.js/App.jsx sur ce tour). Ce qui a changé : l'intégrité de mes propres outils de test.
// 6 modules de test extraits avant les correctifs v57/v58 n'avaient jamais été régénérés et
// validaient un code périmé — le pire cas, un test qui vérifiait sa propre constante tapée à la
// main au lieu de celle du vrai fichier ("CORRECTIF CONFIRMÉ" annoncé à tort sur cette base.
// Pire : un module validait activement l'ANCIEN comportement (repli silencieux d'une fonction
// que j'avais corrigée pour lever une erreur), contredisant le vrai code. Tous régénérés et
// revérifiés automatiquement (comparaison fonction par fonction contre le fichier actuel, pas
// juste des dates) : 0 anomalie restante, 278/278 assertions sur du code réellement à jour.
// PhotoCartel v58 — correctif critique : les 3 fonctions envoyant une image à OpenAI etiquetaient tout "image/jpeg" sans verifier le format reel, ce qui devenait dangereux depuis l'elargissement EXTENSIONS_IMAGE en v57 (un .heic aurait ete envoye mal etiquete). Normalisation reelle via sharp avant tout envoi, ECHEC EXPLICITE si la conversion echoue (jamais un envoi silencieux mal etiquete). LIMITE VERIFIEE : sharp ici ne decode pas le HEVC (vrai codec des .heic de telephone), seul AVIF fonctionne - confirme avec un vrai flux HEVC genere par ffmpeg. Etat inconnu sur l'environnement de Vincent. PhotoCartel v57 — correctif demandé par Vincent : EXTENSIONS_IMAGE (flux de renommage) unifiée sur EXTENSIONS_IMAGE_PHOTOCARTEL. Le renommage ignorait silencieusement les formats .heic/.heif/.gif/.bmp/.tif/.tiff. Vérifié par exécution réelle (10 assertions dédiées, dont un dossier de test avec photo .heic effectivement listée). PhotoCartel v56 — correctif : 4 versions codées en dur (v32.3 DEV, v38.12, v35.3, v37) dans les métadonnées de photos analysées, remplacées par VERSION_PHOTOCARTEL dynamique. Le schéma v18.5.3 de la fiche patrimoniale n'est PAS touché (numéro de schéma, pas de version appli). Correctif vérifié par exécution réelle : le JSON écrit contient désormais la vraie version. :
// FAIT PAR CLAUDE : tests unitaires réels exécutés en Node sur la logique exacte des deux
// nouvelles routes (/renommer-oeuvres/analyser et /renommer-oeuvres/confirmer), avec de vrais
// fichiers sur disque temporaire et l'appel IA mocké (pas d'accès réseau ici). 11 assertions,
// toutes passent : pause manuelle respectée, matching œuvre/cartel, édition manuelle prise en
// compte, copie du cartel, gestion des doublons en cas de double-clic.
// PAS FAIT, reste à faire par Vincent : démarrer le vrai serveur Express, cliquer réellement
// dans l'appli (navigateur), et vérifier un vrai appel OpenAI (clé API, réseau réel).
// Resynchronisation : ce fichier affichait encore VERSION_PHOTOCARTEL = "v47.5" alors qu'App.jsx
// était à "v50.4" — les deux sont désormais alignés sur v50.5.
// Ajout de deux routes pour le flux "Renommer un dossier" : /renommer-oeuvres/analyser (propose
// un nom par œuvre via analyse IA, sans rien écrire sur disque) et /renommer-oeuvres/confirmer
// (renomme uniquement les propositions validées côté client). L'ancienne route /renommer-oeuvres
// (tout-automatique) reste présente, mais n'est plus appelée par le nouveau parcours.
// Correctif suite à test réel (vrais fichiers, IA mockée) : un second appel à
// /renommer-oeuvres/confirmer sur une œuvre déjà classée "à vérifier" créait un doublon dans
// A_verifier_renommage au lieu d'être ignoré. Corrigé : idempotent désormais.
// PhotoCartel v47.5 — résolution fiable de la visite physique lors d’une modification d’identité.
// Le serveur ne relance plus un parcours physique complet à chaque consultation de la liste.
// L’actualisation lourde est espacée et reste strictement en arrière-plan.
// Les routes de galerie et tous les moteurs métier restent inchangés.
 // Les moteurs métier IA/OCR/classification/renommage restent strictement inchangés.
// Les index et métadonnées locales enrichissent l'affichage sans décider de l'existence physique.
// Le serveur vérifie physiquement chaque écriture avant de confirmer au compteur frontend.
// v40.6 conserve strictement les moteurs IA/OCR/classification/renommage existants.
// La correction v39 concerne le contexte de stockage Android/PWA et la reprise de visite dans App.jsx.
// PhotoCartel v38.12 — le serveur vérifie le statut MODIFIEE par comparaison avec le résultat IA initial.
// À la première modification, le JPEG et le JSON reçoivent ensemble le suffixe _MODIFIEE.
// Les modifications suivantes conservent ces noms et remplacent uniquement le JSON.
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
import crypto from "crypto";
import { fileURLToPath } from "url";

import { exec } from "child_process";

dotenv.config();

const app = express();
// v89 — renommage : (1) appariement oeuvre/cartel par l'heure de prise de vue EXIF, le nom du fichier ne servant
// plus qu'a defaut ; (2) noms de fichiers accentues envoyes par le navigateur relus en UTF-8 (« SÃ£o » -> « São ») ;
// (3) le nom final ne recopie plus jamais l'ancien nom du fichier : horodatage du nom ou EXIF, sinon aucun.
// v90 — renommage : la lecture de chaque cartel est limitée à 4 s. Au-delà, elle est arrêtée, le moteur OCR
// relancé et l'œuvre part en « À vérifier » avec la raison « cartel trop long à lire ». Seuil retenu sur mesure :
// 70 photos jamais renommées, meilleur rapport durée / œuvres renommées entre 2,4 s et 10 s.
// v91 — renommage d'un dossier (PC) : le renommage part de lui-même à la fin de l'analyse IA (plus de
// second clic « Valider et renommer ») ; l'écran de fin titre « Dossier « X » renommé » et affiche l'emplacement ;
// les « À vérifier » sont déplacés (et non plus copiés) : le sous-dossier Oeuvres ne contient que les renommées.
// v92 — renommage d'un dossier : deux changements, tous deux dans server.js.
// (1) R1, lecture du cartel : l'OCR ne reçoit plus la photo entière mais la seule zone de texte,
// trouvée localement par contraste (aucun appel réseau). Mesuré sur 26 cartels : 23 lus sur 26
// en photo entière, 26 sur 26 en zone recadrée, lecture moyenne 2 120 ms -> 1 375 ms.
// (2) R2, tri : une mesure locale (part de pixels colorés, écart de luminance) contrôle le
// classement de l'IA. Elle corrige un classement franchement faux et rattrape les photos
// qu'aucun classement Oeuvres/Cartels n'a retenues. Mesurée conforme sur les 52 photos du lot.
const VERSION_PHOTOCARTEL = "v92";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOSSIER_RACINE_DONNEES =
  process.env.PHOTOCARTEL_DATA_DIR ||
  (process.platform === "win32"
    ? "C:\\PhotoCartel"
    : path.join(__dirname, "photocartel-data"));
const DOSSIERS_INFRASTRUCTURE_PHOTOCARTEL = [
  "Voyages",
  "Visites à rattacher",
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
const DOSSIER_VISITES_A_RATTACHER = "Visites à rattacher";

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

  // v38.4 : les nouveaux types sont proposés sans catégorie à ce stade.
  if (
    [
      "Transport",
      "Site naturel",
      "Ville / Village",
      "Jardin / Parc",
      "Architecture",
      "Château",
      "Restaurant / Repas",
      "Autre",
    ].includes(String(typeVisite || "").trim())
  ) {
    return [];
  }

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
console.log(`PhotoCartel ${VERSION_PHOTOCARTEL} — lecture physique des voyages et visites, index enrichisseur uniquement`);

const DOSSIER_MODE_DEMONSTRATION = path.join(
  DOSSIER_RACINE_DONNEES,
  "PhotoCartel_Mode_Demonstration"
);
const DOSSIER_SOURCE_MODE_DEMONSTRATION = path.join(
  DOSSIER_RACINE_DONNEES,
  "PhotoCartel_Mode_Demonstration_Source"
);


// Interne — multer lit le nom de fichier envoye par le navigateur en latin1 : « São » devenait « SÃ£o ».
// Le nom est relu en UTF-8 ici, une seule fois, pour toutes les routes qui recoivent des photos.
// Un nom deja correct n'est pas touche (sa relecture produirait un caractere invalide).
function corrigerEncodageNomRecu(nom) {
  const texte = String(nom || "");
  const relu = Buffer.from(texte, "latin1").toString("utf8");
  return relu.includes("\uFFFD") ? texte : relu;
}

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, fichier, rappel) => {
    fichier.originalname = corrigerEncodageNomRecu(fichier.originalname);
    rappel(null, true);
  },
});

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.get(["/health", "/api/health"], (req, res) => {
  res.json({
    success: true,
    service: "PhotoCartel API",
    version: VERSION_PHOTOCARTEL,
    dataRoot: DOSSIER_RACINE_DONNEES,
    infrastructureDirs: DOSSIERS_INFRASTRUCTURE_PHOTOCARTEL,
  });
});


// PhotoCartel v34 — routes Mode Démonstration déclarées très tôt.
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


const EXTENSIONS_IMAGE_PHOTOCARTEL = new Set([
  ".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif", ".gif", ".bmp", ".tif", ".tiff"
]);

function estFichierImagePhotoCartel(nomFichier) {
  return EXTENSIONS_IMAGE_PHOTOCARTEL.has(path.extname(String(nomFichier || "")).toLowerCase());
}

function analyserContenuPhysiqueVisite(dossierVisite) {
  let nombrePhotos = 0;
  let debutMs = 0;
  let finMs = 0;

  const parcourir = (dossier) => {
    let entrees = [];
    try {
      entrees = fs.readdirSync(dossier, { withFileTypes: true });
    } catch (error) {
      throw new Error(`Lecture impossible du dossier de visite « ${dossier} » : ${error.message}`);
    }

    for (const entree of entrees) {
      const cheminEntree = path.join(dossier, entree.name);
      if (entree.isDirectory()) {
        parcourir(cheminEntree);
        continue;
      }
      if (!entree.isFile() || !estFichierImagePhotoCartel(entree.name)) continue;

      nombrePhotos += 1;
      let datePhotoMs = extraireMsDepuisNomPhotoCartel(entree.name);
      if (!datePhotoMs) {
        try {
          const stats = fs.statSync(cheminEntree);
          datePhotoMs = Number(stats.mtimeMs || stats.birthtimeMs || 0);
        } catch (error) {
          datePhotoMs = 0;
        }
      }
      if (datePhotoMs) {
        debutMs = debutMs ? Math.min(debutMs, datePhotoMs) : datePhotoMs;
        finMs = Math.max(finMs, datePhotoMs);
      }
    }
  };

  parcourir(dossierVisite);
  return {
    nombrePhotos,
    debutMs: debutMs || null,
    finMs: finMs || null,
    dureeMs: debutMs && finMs && finMs >= debutMs ? finMs - debutMs : null,
    datePhotoPlusRecenteMs: finMs || null,
  };
}

const DOSSIER_INDEX_PHOTOCARTEL = path.join(DOSSIER_RACINE_DONNEES, "Paramètres", "Index");
const FICHIER_INDEX_VISITES_PHOTOCARTEL = path.join(DOSSIER_INDEX_PHOTOCARTEL, "visites-physiques-v45.3.json");
fs.mkdirSync(DOSSIER_INDEX_PHOTOCARTEL, { recursive: true });

function chargerIndexVisitesPersistantPhotoCartel() {
  try {
    if (!fs.existsSync(FICHIER_INDEX_VISITES_PHOTOCARTEL)) return { dateMs: 0, visites: [] };
    const contenu = JSON.parse(fs.readFileSync(FICHIER_INDEX_VISITES_PHOTOCARTEL, "utf8"));
    return Array.isArray(contenu?.visites)
      ? { dateMs: Number(contenu.dateMs || 0), visites: contenu.visites }
      : { dateMs: 0, visites: [] };
  } catch (error) {
    console.warn("Index persistant des visites illisible :", error.message);
    return { dateMs: 0, visites: [] };
  }
}

function sauvegarderIndexVisitesPersistantPhotoCartel(index) {
  try {
    const temporaire = `${FICHIER_INDEX_VISITES_PHOTOCARTEL}.tmp`;
    fs.writeFileSync(temporaire, JSON.stringify(index), "utf8");
    fs.renameSync(temporaire, FICHIER_INDEX_VISITES_PHOTOCARTEL);
  } catch (error) {
    console.warn("Index persistant des visites non sauvegardé :", error.message);
  }
}

let cacheVisitesPhysiquesPhotoCartel = chargerIndexVisitesPersistantPhotoCartel();
let actualisationVisitesPhysiquesEnCours = null;
const DUREE_CACHE_VISITES_PHYSIQUES_MS = 30 * 60 * 1000;

function lireVisitesPhysiquesPhotoCartel({ forcer = false } = {}) {
  const maintenant = Date.now();
  if (!forcer && cacheVisitesPhysiquesPhotoCartel.visites.length &&
      maintenant - cacheVisitesPhysiquesPhotoCartel.dateMs < DUREE_CACHE_VISITES_PHYSIQUES_MS) {
    return cacheVisitesPhysiquesPhotoCartel.visites;
  }

  const dossierVoyages = path.join(DOSSIER_RACINE_DONNEES, DOSSIER_METIER_VOYAGES);
  const dossierVisitesARattacher = path.join(
    DOSSIER_RACINE_DONNEES,
    DOSSIER_VISITES_A_RATTACHER
  );

  const visites = [];

  if (fs.existsSync(dossierVoyages)) {
    for (const entreeVoyage of fs.readdirSync(dossierVoyages, { withFileTypes: true })) {
      if (!entreeVoyage.isDirectory()) continue;
      const dossierVoyage = path.join(dossierVoyages, entreeVoyage.name);

      for (const entreeVille of fs.readdirSync(dossierVoyage, { withFileTypes: true })) {
        if (!entreeVille.isDirectory()) continue;
        const dossierVille = path.join(dossierVoyage, entreeVille.name);

        for (const entreeVisite of fs.readdirSync(dossierVille, { withFileTypes: true })) {
          if (!entreeVisite.isDirectory()) continue;
          const dossierVisite = path.join(dossierVille, entreeVisite.name);
          const mesures = analyserContenuPhysiqueVisite(dossierVisite);
          const estVisiteRapide = entreeVille.name === "Visites rapides";
          visites.push({
            idPhysique: ["voyages", entreeVoyage.name, entreeVille.name, entreeVisite.name].join("__"),
            originePhysique: "Voyages",
            voyage: entreeVoyage.name,
            ville: estVisiteRapide ? "Ville non renseignée" : entreeVille.name,
            stockageVille: entreeVille.name,
            nom: entreeVisite.name,
            chemin: dossierVisite,
            estVisiteRapide,
            estARattacher: false,
            type: "",
            statut: "Importée",
            ...mesures,
          });
        }
      }
    }
  }

  if (fs.existsSync(dossierVisitesARattacher)) {
    for (const entreeCandidate of fs.readdirSync(dossierVisitesARattacher, {
      withFileTypes: true,
    })) {
      if (!entreeCandidate.isDirectory()) continue;

      const dossierCandidat = path.join(
        dossierVisitesARattacher,
        entreeCandidate.name
      );
      const mesures = analyserContenuPhysiqueVisite(dossierCandidat);
      let dateDossierMs = 0;
      try {
        const stats = fs.statSync(dossierCandidat);
        dateDossierMs = Number(stats.mtimeMs || stats.birthtimeMs || 0);
      } catch (error) {
        dateDossierMs = 0;
      }

      visites.push({
        idPhysique: ["a-rattacher", entreeCandidate.name].join("__"),
        originePhysique: DOSSIER_VISITES_A_RATTACHER,
        voyage: "",
        ville: "",
        stockageVille: "",
        nom: entreeCandidate.name,
        chemin: dossierCandidat,
        estVisiteRapide: false,
        estARattacher: true,
        type: "",
        statut: "À rattacher",
        ...mesures,
        dateDossierMs: dateDossierMs || null,
        datePhotoPlusRecenteMs:
          mesures.datePhotoPlusRecenteMs || dateDossierMs || null,
      });
    }
  }

  cacheVisitesPhysiquesPhotoCartel = { dateMs: Date.now(), visites };
  sauvegarderIndexVisitesPersistantPhotoCartel(cacheVisitesPhysiquesPhotoCartel);
  return visites;
}

function programmerActualisationVisitesPhysiquesPhotoCartel() {
  if (actualisationVisitesPhysiquesEnCours) return actualisationVisitesPhysiquesEnCours;
  actualisationVisitesPhysiquesEnCours = new Promise((resolve) => {
    setImmediate(() => {
      try {
        resolve(lireVisitesPhysiquesPhotoCartel({ forcer: true }));
      } catch (error) {
        console.error("Actualisation asynchrone de l'index visites impossible :", error);
        resolve(cacheVisitesPhysiquesPhotoCartel.visites || []);
      } finally {
        actualisationVisitesPhysiquesEnCours = null;
      }
    });
  });
  return actualisationVisitesPhysiquesEnCours;
}

function handlerListerVisitesPhysiques(req, res) {
  try {
    let visites = cacheVisitesPhysiquesPhotoCartel.visites || [];
    if (!visites.length) {
      visites = lireVisitesPhysiquesPhotoCartel({ forcer: true });
    } else if (
      Date.now() - Number(cacheVisitesPhysiquesPhotoCartel.dateMs || 0) >
      DUREE_CACHE_VISITES_PHYSIQUES_MS
    ) {
      // v47 : une consultation ordinaire répond depuis l'index. Le parcours disque
      // complet n'est relancé qu'après expiration du cache, sans bloquer la réponse.
      programmerActualisationVisitesPhysiquesPhotoCartel();
    }

    res.setHeader("Cache-Control", "private, max-age=15, stale-while-revalidate=300");
    res.json({
      success: true,
      source: "index-persistant",
      indexDateMs: cacheVisitesPhysiquesPhotoCartel.dateMs,
      actualisationEnArrierePlan: Boolean(actualisationVisitesPhysiquesEnCours),
      racines: {
        voyages: path.join(DOSSIER_RACINE_DONNEES, DOSSIER_METIER_VOYAGES),
        visitesARattacher: path.join(
          DOSSIER_RACINE_DONNEES,
          DOSSIER_VISITES_A_RATTACHER
        ),
      },
      visites,
    });
  } catch (error) {
    console.error("ERREUR /visites-physiques =", error);
    res.status(500).json({
      success: false,
      error: error?.message || String(error),
    });
  }
}

app.get("/visites-physiques", handlerListerVisitesPhysiques);

app.get("/api/visites-physiques", handlerListerVisitesPhysiques);

function racinesConsultablesGaleriePhotoCartel() {
  return [
    path.resolve(DOSSIER_RACINE_DONNEES, DOSSIER_METIER_VOYAGES),
    path.resolve(DOSSIER_RACINE_DONNEES, DOSSIER_VISITES_A_RATTACHER),
  ];
}

function cheminEstDansRacinePhotoCartel(cheminCandidat, racine) {
  const relatif = path.relative(racine, cheminCandidat);
  return (
    cheminCandidat !== racine &&
    !relatif.startsWith("..") &&
    !path.isAbsolute(relatif)
  );
}

function resoudreCheminVisiteGaleriePhotoCartel(cheminRecu = "") {
  const racinesAutorisees = racinesConsultablesGaleriePhotoCartel();
  const cheminTexte = String(cheminRecu || "").trim();

  if (!cheminTexte) {
    throw Object.assign(new Error("Chemin de visite manquant."), { statusCode: 400 });
  }

  const cheminCandidat = path.resolve(
    path.isAbsolute(cheminTexte)
      ? cheminTexte
      : path.join(racinesAutorisees[0], cheminTexte)
  );

  if (
    !racinesAutorisees.some((racine) =>
      cheminEstDansRacinePhotoCartel(cheminCandidat, racine)
    )
  ) {
    throw Object.assign(
      new Error("Le dossier demandé n’appartient pas aux visites consultables PhotoCartel."),
      { statusCode: 403 }
    );
  }

  if (
    !fs.existsSync(cheminCandidat) ||
    !fs.statSync(cheminCandidat).isDirectory()
  ) {
    throw Object.assign(new Error("Dossier de visite introuvable."), { statusCode: 404 });
  }

  return cheminCandidat;
}

const cachePhotosVisitesPhotoCartel = new Map();
const DUREE_CACHE_PHOTOS_VISITE_MS = 10 * 60 * 1000;

function listerPhotosVisiteAvecCachePhotoCartel(dossierVisite) {
  const cle = path.resolve(dossierVisite);
  const maintenant = Date.now();
  const cache = cachePhotosVisitesPhotoCartel.get(cle);
  if (cache && maintenant - cache.dateMs < DUREE_CACHE_PHOTOS_VISITE_MS) return cache.photos;
  const photos = listerPhotosRecursivementPhotoCartel(dossierVisite);
  cachePhotosVisitesPhotoCartel.set(cle, { dateMs: maintenant, photos });
  return photos;
}

function listerPhotosRecursivementPhotoCartel(dossierVisite) {
  const photos = [];

  const parcourir = (dossier) => {
    const entrees = fs
      .readdirSync(dossier, { withFileTypes: true })
      .sort((a, b) => a.name.localeCompare(b.name, "fr", { numeric: true }));

    for (const entree of entrees) {
      const cheminEntree = path.join(dossier, entree.name);

      if (entree.isDirectory()) {
        parcourir(cheminEntree);
        continue;
      }

      if (!entree.isFile() || !estFichierImagePhotoCartel(entree.name)) continue;

      const stats = fs.statSync(cheminEntree);
      photos.push({
        nom: entree.name,
        chemin: cheminEntree,
        cheminRelatif: path.relative(dossierVisite, cheminEntree),
        tailleOctets: Number(stats.size || 0),
        dateModificationMs: Number(stats.mtimeMs || 0),
      });
    }
  };

  parcourir(dossierVisite);

  return photos.sort((a, b) => {
    const dateA = extraireMsDepuisNomPhotoCartel(a.nom) || a.dateModificationMs || 0;
    const dateB = extraireMsDepuisNomPhotoCartel(b.nom) || b.dateModificationMs || 0;
    return dateA - dateB || a.cheminRelatif.localeCompare(b.cheminRelatif, "fr", { numeric: true });
  });
}

function handlerListerPhotosVisite(req, res) {
  try {
    const dossierVisite = resoudreCheminVisiteGaleriePhotoCartel(req.query.chemin);
    const toutesLesPhotos = listerPhotosVisiteAvecCachePhotoCartel(dossierVisite);
    const offset = Math.max(0, Number.parseInt(req.query.offset, 10) || 0);
    const limiteDemandee = Number.parseInt(req.query.limit, 10) || 240;
    const limit = Math.min(500, Math.max(1, limiteDemandee));
    const tranche = toutesLesPhotos.slice(offset, offset + limit);
    const photos = tranche.map((photo, index) => ({
      id: `${offset + index}-${crypto.createHash("sha1").update(photo.chemin).digest("hex").slice(0, 12)}`,
      nom: photo.nom,
      cheminRelatif: photo.cheminRelatif,
      tailleOctets: photo.tailleOctets,
      dateModificationMs: photo.dateModificationMs,
      url: `/api/photo-visite?chemin=${encodeURIComponent(photo.chemin)}`,
      miniatureUrl: `/api/miniature-visite?chemin=${encodeURIComponent(photo.chemin)}&taille=240`,
    }));

    res.setHeader("Cache-Control", "private, max-age=30, stale-while-revalidate=300");
    res.json({
      success: true,
      version: VERSION_PHOTOCARTEL,
      dossier: dossierVisite,
      nombrePhotos: toutesLesPhotos.length,
      offset,
      limit,
      suivantOffset: offset + photos.length < toutesLesPhotos.length ? offset + photos.length : null,
      photos,
    });
  } catch (error) {
    console.error("ERREUR liste photos visite =", error);
    res.status(error.statusCode || 500).json({ success: false, error: error.message || String(error) });
  }
}

function handlerLirePhotoVisite(req, res) {
  try {
    const racinesAutorisees = racinesConsultablesGaleriePhotoCartel();
    const cheminTexte = String(req.query.chemin || "").trim();

    if (!cheminTexte) {
      return res.status(400).json({ success: false, error: "Chemin photo manquant." });
    }

    const cheminPhoto = path.resolve(cheminTexte);

    if (
      !racinesAutorisees.some((racine) =>
        cheminEstDansRacinePhotoCartel(cheminPhoto, racine)
      )
    ) {
      return res.status(403).json({
        success: false,
        error: "La photo demandée n’appartient pas aux visites consultables PhotoCartel.",
      });
    }

    if (
      !fs.existsSync(cheminPhoto) ||
      !fs.statSync(cheminPhoto).isFile() ||
      !estFichierImagePhotoCartel(cheminPhoto)
    ) {
      return res.status(404).json({ success: false, error: "Photo introuvable." });
    }

    res.setHeader("Cache-Control", "private, max-age=60");
    return res.sendFile(cheminPhoto);
  } catch (error) {
    console.error("ERREUR lecture photo visite =", error);
    return res.status(500).json({ success: false, error: error.message || String(error) });
  }
}

function handlerSupprimerPhotoVisite(req, res) {
  try {
    const racinesAutorisees = racinesConsultablesGaleriePhotoCartel();
    const cheminTexte = String(req.query.chemin || "").trim();
    if (!cheminTexte) {
      return res.status(400).json({ success: false, error: "Chemin photo manquant." });
    }

    const cheminPhoto = path.resolve(cheminTexte);
    if (!racinesAutorisees.some((racine) => cheminEstDansRacinePhotoCartel(cheminPhoto, racine))) {
      return res.status(403).json({ success: false, error: "La photo demandée n’appartient pas aux visites consultables PhotoCartel." });
    }
    if (!fs.existsSync(cheminPhoto) || !fs.statSync(cheminPhoto).isFile() || !estFichierImagePhotoCartel(cheminPhoto)) {
      return res.status(404).json({ success: false, error: "Photo introuvable." });
    }

    fs.unlinkSync(cheminPhoto);
    if (fs.existsSync(cheminPhoto)) {
      throw new Error("La suppression physique de la photo n’a pas été confirmée.");
    }

    cachePhotosVisitesPhotoCartel.clear();
    let visiteMiseAJour = null;
    const visites = (cacheVisitesPhysiquesPhotoCartel.visites || []).map((visite) => {
      const dossierVisite = path.resolve(String(visite.chemin || ""));
      if (!dossierVisite || !cheminEstDansRacinePhotoCartel(cheminPhoto, dossierVisite)) return visite;
      const mesures = analyserContenuPhysiqueVisite(dossierVisite);
      visiteMiseAJour = { ...visite, ...mesures };
      return visiteMiseAJour;
    });
    cacheVisitesPhysiquesPhotoCartel = { dateMs: Date.now(), visites };
    sauvegarderIndexVisitesPersistantPhotoCartel(cacheVisitesPhysiquesPhotoCartel);

    return res.json({
      success: true,
      version: VERSION_PHOTOCARTEL,
      photoSupprimee: cheminPhoto,
      nombrePhotos: visiteMiseAJour?.nombrePhotos ?? null,
    });
  } catch (error) {
    console.error("ERREUR suppression photo visite =", error);
    return res.status(error.statusCode || 500).json({ success: false, error: error.message || String(error) });
  }
}

app.delete(["/photo-visite", "/api/photo-visite"], handlerSupprimerPhotoVisite);

function handlerSupprimerVisite(req, res) {
  try {
    const dossierVisite = resoudreCheminVisiteGaleriePhotoCartel(req.query.chemin);
    const photosAvant = listerPhotosRecursivementPhotoCartel(dossierVisite).length;
    fs.rmSync(dossierVisite, { recursive: true, force: false });
    if (fs.existsSync(dossierVisite)) {
      throw new Error("La suppression physique de la visite n’a pas été confirmée.");
    }

    cachePhotosVisitesPhotoCartel.delete(path.resolve(dossierVisite));
    const visites = (cacheVisitesPhysiquesPhotoCartel.visites || []).filter(
      (visite) => path.resolve(String(visite.chemin || "")) !== path.resolve(dossierVisite)
    );
    cacheVisitesPhysiquesPhotoCartel = { dateMs: Date.now(), visites };
    sauvegarderIndexVisitesPersistantPhotoCartel(cacheVisitesPhysiquesPhotoCartel);

    return res.json({
      success: true,
      version: VERSION_PHOTOCARTEL,
      visiteSupprimee: dossierVisite,
      nombrePhotosSupprimees: photosAvant,
    });
  } catch (error) {
    console.error("ERREUR suppression visite =", error);
    return res.status(error.statusCode || 500).json({ success: false, error: error.message || String(error) });
  }
}

app.delete(["/visite", "/api/visite"], handlerSupprimerVisite);

const DOSSIER_MINIATURES_PHOTOCARTEL = path.join(DOSSIER_RACINE_DONNEES, "Paramètres", "Miniatures");
fs.mkdirSync(DOSSIER_MINIATURES_PHOTOCARTEL, { recursive: true });
let chargeurSharpPhotoCartel = null;

async function obtenirSharpPhotoCartel() {
  if (chargeurSharpPhotoCartel === false) return null;
  if (chargeurSharpPhotoCartel) return chargeurSharpPhotoCartel;
  try {
    const moduleSharp = await import("sharp");
    chargeurSharpPhotoCartel = moduleSharp.default || moduleSharp;
    return chargeurSharpPhotoCartel;
  } catch (error) {
    chargeurSharpPhotoCartel = false;
    console.warn("Module sharp absent : miniatures servies en image originale mise en cache.");
    return null;
  }
}

const generationsMiniaturesEnCoursPhotoCartel = new Map();
let nombreGenerationsMiniaturesActivesPhotoCartel = 0;
const fileAttenteMiniaturesPhotoCartel = [];
const MAX_GENERATIONS_MINIATURES_CONCURRENTES_PHOTOCARTEL = 2;

function executerFileMiniaturesPhotoCartel() {
  while (nombreGenerationsMiniaturesActivesPhotoCartel < MAX_GENERATIONS_MINIATURES_CONCURRENTES_PHOTOCARTEL && fileAttenteMiniaturesPhotoCartel.length) {
    const travail = fileAttenteMiniaturesPhotoCartel.shift();
    nombreGenerationsMiniaturesActivesPhotoCartel += 1;
    Promise.resolve()
      .then(travail.executer)
      .then(travail.resolve, travail.reject)
      .finally(() => {
        nombreGenerationsMiniaturesActivesPhotoCartel -= 1;
        setImmediate(executerFileMiniaturesPhotoCartel);
      });
  }
}

function planifierGenerationMiniaturePhotoCartel(cle, executer) {
  if (generationsMiniaturesEnCoursPhotoCartel.has(cle)) return generationsMiniaturesEnCoursPhotoCartel.get(cle);
  const promesse = new Promise((resolve, reject) => {
    fileAttenteMiniaturesPhotoCartel.push({ executer, resolve, reject });
    executerFileMiniaturesPhotoCartel();
  }).finally(() => generationsMiniaturesEnCoursPhotoCartel.delete(cle));
  generationsMiniaturesEnCoursPhotoCartel.set(cle, promesse);
  return promesse;
}

async function handlerMiniatureVisite(req, res) {
  try {
    const racinesAutorisees = racinesConsultablesGaleriePhotoCartel();
    const cheminPhoto = path.resolve(String(req.query.chemin || "").trim());
    if (!racinesAutorisees.some((racine) => cheminEstDansRacinePhotoCartel(cheminPhoto, racine))) {
      return res.status(403).json({ success: false, error: "Photo hors des visites consultables." });
    }
    if (!fs.existsSync(cheminPhoto) || !fs.statSync(cheminPhoto).isFile() || !estFichierImagePhotoCartel(cheminPhoto)) {
      return res.status(404).json({ success: false, error: "Photo introuvable." });
    }

    const taille = Math.min(720, Math.max(160, Number.parseInt(req.query.taille, 10) || 240));
    const stats = fs.statSync(cheminPhoto);
    const cle = crypto.createHash("sha1").update(`${cheminPhoto}|${stats.size}|${stats.mtimeMs}|${taille}`).digest("hex");
    const cheminMiniature = path.join(DOSSIER_MINIATURES_PHOTOCARTEL, `${cle}.webp`);
    const sharp = await obtenirSharpPhotoCartel();

    if (sharp) {
      if (!fs.existsSync(cheminMiniature)) {
        await planifierGenerationMiniaturePhotoCartel(cle, async () => {
          if (fs.existsSync(cheminMiniature)) return;
          const temporaire = `${cheminMiniature}.${process.pid}.${Date.now()}.tmp`;
          try {
            await sharp(cheminPhoto)
              .rotate()
              .resize({ width: taille, height: taille, fit: "cover", withoutEnlargement: true })
              .webp({ quality: 70, effort: 3 })
              .toFile(temporaire);
            if (!fs.existsSync(cheminMiniature)) fs.renameSync(temporaire, cheminMiniature);
            else if (fs.existsSync(temporaire)) fs.unlinkSync(temporaire);
          } catch (error) {
            try { if (fs.existsSync(temporaire)) fs.unlinkSync(temporaire); } catch (_) {}
            throw error;
          }
        });
      }
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      return res.sendFile(cheminMiniature);
    }

    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.sendFile(cheminPhoto);
  } catch (error) {
    console.error("ERREUR miniature visite =", error);
    return res.status(500).json({ success: false, error: error.message || String(error) });
  }
}

app.get("/photos-visite", handlerListerPhotosVisite);
app.get("/api/photos-visite", handlerListerPhotosVisite);
app.get("/photo-visite", handlerLirePhotoVisite);
app.get("/api/photo-visite", handlerLirePhotoVisite);
app.get("/miniature-visite", handlerMiniatureVisite);
app.get("/api/miniature-visite", handlerMiniatureVisite);

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
  const stockageVille = String(
    visite.stockageVille || visite.dossierVilleStockage || ""
  ).trim();
  const indicateurRapide =
    visite.estVisiteRapide === true ||
    visite.visiteRapide === true ||
    stockageVille === "Visites rapides";
  const ancienFormatRapide =
    !stockageVille &&
    !type &&
    (nom.startsWith("Visite rapide_") || nom.startsWith("A_EN_COURS_"));
  return indicateurRapide || ancienFormatRapide
    ? "Visites rapides"
    : String(visite.ville || visite.nomVille || "").trim();
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

function remplacerNomVisiteDansEntree(nomEntree, ancienNom, nouveauNom) {
  const nettoyer = (valeur) => String(valeur || "").replace(/[^a-zA-Z0-9À-ÿ_-]+/g, "_");
  const ancien = nettoyer(ancienNom);
  const nouveau = nettoyer(nouveauNom);
  if (!ancien || ancien === nouveau) return nomEntree;
  return String(nomEntree || "").split(ancien).join(nouveau);
}

function renommerContenuVisiteRecursive(dossier, ancienNom, nouveauNom) {
  if (!fs.existsSync(dossier)) return;
  const entrees = fs.readdirSync(dossier, { withFileTypes: true });
  for (const entree of entrees) {
    const source = path.join(dossier, entree.name);
    if (entree.isDirectory()) renommerContenuVisiteRecursive(source, ancienNom, nouveauNom);
    const nouveauNomEntree = remplacerNomVisiteDansEntree(entree.name, ancienNom, nouveauNom);
    if (nouveauNomEntree !== entree.name) {
      const destination = path.join(dossier, nouveauNomEntree);
      if (!fs.existsSync(destination)) fs.renameSync(source, destination);
    }
  }
}

function trouverDossiersVisiteDansVoyage(dossierVoyage, nomVisite) {
  if (!fs.existsSync(dossierVoyage)) return [];

  const correspondances = [];
  const nomCible = nettoyerSegmentCheminPhotoCartel(nomVisite);

  for (const entreeVille of fs.readdirSync(dossierVoyage, { withFileTypes: true })) {
    if (!entreeVille.isDirectory()) continue;
    const dossierVille = path.join(dossierVoyage, entreeVille.name);
    const dossierCandidat = path.join(dossierVille, nomCible);
    if (fs.existsSync(dossierCandidat) && fs.statSync(dossierCandidat).isDirectory()) {
      correspondances.push({
        chemin: dossierCandidat,
        stockageVille: entreeVille.name,
      });
    }
  }

  return correspondances;
}

function resoudreSourceVisite({
  nomVoyage,
  nomAncien,
  ancienChemin,
  ancienIdPhysique,
  ancienStockageVille,
  ancienneVille,
  ancienneVisiteRapide,
}) {
  const dossierVoyage = path.join(
    DOSSIER_RACINE_DONNEES,
    DOSSIER_METIER_VOYAGES,
    nomVoyage
  );

  const candidatValide = (chemin, stockageVille) => {
    if (!chemin) return null;
    const normalise = path.normalize(chemin);
    if (
      fs.existsSync(normalise) &&
      fs.statSync(normalise).isDirectory() &&
      nettoyerSegmentCheminPhotoCartel(path.basename(normalise)) === nomAncien
    ) {
      return {
        chemin: normalise,
        stockageVille: stockageVille || path.basename(path.dirname(normalise)),
      };
    }
    return null;
  };

  // v47.5 : l'identifiant physique issu de la liste réelle est prioritaire.
  // Il évite qu'une ancienne métadonnée locale reconstruise un chemin obsolète.
  const idPhysiqueRecu = String(ancienIdPhysique || "").trim();
  if (idPhysiqueRecu) {
    const segmentsId = idPhysiqueRecu.split("__");
    if (
      segmentsId.length >= 4 &&
      String(segmentsId[0] || "").toLowerCase() === "voyages"
    ) {
      const voyageId = nettoyerSegmentCheminPhotoCartel(segmentsId[1]);
      const villeId = nettoyerSegmentCheminPhotoCartel(segmentsId[2]);
      const visiteId = nettoyerSegmentCheminPhotoCartel(segmentsId.slice(3).join("__"));
      if (
        voyageId === nomVoyage &&
        visiteId === nomAncien
      ) {
        const parId = candidatValide(
          path.join(
            DOSSIER_RACINE_DONNEES,
            DOSSIER_METIER_VOYAGES,
            voyageId,
            villeId,
            visiteId
          ),
          villeId
        );
        if (parId) return parId;
      }
    }
  }

  // v40.5 : un chemin précis valide identifie sans ambiguïté la visite.
  // La recherche globale n'est qu'un mécanisme de secours.
  const cheminRecu = String(ancienChemin || "").trim();
  if (cheminRecu) {
    let cheminCandidat = "";
    if (path.isAbsolute(cheminRecu)) {
      cheminCandidat = cheminRecu;
    } else {
      const segments = cheminRecu
        .replace(/\\/g, "/")
        .split("/")
        .map(nettoyerSegmentCheminPhotoCartel)
        .filter(Boolean);
      const indexVoyages = segments.findIndex(
        (segment) => segment.toLowerCase() === DOSSIER_METIER_VOYAGES.toLowerCase()
      );
      const relatifs = indexVoyages >= 0 ? segments.slice(indexVoyages + 1) : segments;
      if (relatifs.length >= 3) {
        cheminCandidat = path.join(
          DOSSIER_RACINE_DONNEES,
          DOSSIER_METIER_VOYAGES,
          ...relatifs
        );
      } else if (relatifs.length >= 2) {
        cheminCandidat = path.join(dossierVoyage, ...relatifs);
      }
    }
    const exact = candidatValide(cheminCandidat);
    if (exact) return exact;
  }

  const villePreferee = nettoyerSegmentCheminPhotoCartel(
    ancienStockageVille ||
      (ancienneVisiteRapide ? "Visites rapides" : ancienneVille)
  );
  if (villePreferee) {
    const prefere = candidatValide(
      path.join(dossierVoyage, villePreferee, nomAncien),
      villePreferee
    );
    if (prefere) return prefere;
  }

  const correspondances = trouverDossiersVisiteDansVoyage(dossierVoyage, nomAncien);
  const uniques = [];
  const vus = new Set();
  for (const candidat of correspondances) {
    const cle = path.resolve(candidat.chemin).toLowerCase();
    if (!vus.has(cle)) {
      vus.add(cle);
      uniques.push(candidat);
    }
  }

  if (uniques.length === 0) {
    throw Object.assign(
      new Error(
        `Dossier de visite introuvable dans le voyage « ${nomVoyage} » : ${nomAncien}`
      ),
      { statusCode: 404 }
    );
  }
  if (uniques.length > 1) {
    throw Object.assign(
      new Error(
        `Plusieurs dossiers portent le nom « ${nomAncien} » dans ce voyage. La modification est interrompue pour éviter toute ambiguïté.`
      ),
      { statusCode: 409 }
    );
  }

  return uniques[0];
}

function copierDossierVisiteTransactionnel(source, destination, ancienNom, nouveauNom, nouveauType) {
  const parentDestination = path.dirname(destination);
  const nomDestination = path.basename(destination);
  const dossierTemporaire = path.join(
    parentDestination,
    `.${nomDestination}.photocartel-v41-${process.pid}-${Date.now()}-${Math.random()
      .toString(16)
      .slice(2)}.tmp`
  );

  let destinationPubliee = false;
  try {
    fs.cpSync(source, dossierTemporaire, {
      recursive: true,
      errorOnExist: true,
      force: false,
    });

    renommerContenuVisiteRecursive(dossierTemporaire, ancienNom, nouveauNom);
    creerSousDossiersCategoriesVisite(dossierTemporaire, nouveauType);

    if (!fs.existsSync(dossierTemporaire) || !fs.statSync(dossierTemporaire).isDirectory()) {
      throw new Error("La copie temporaire de la visite n'a pas été créée correctement.");
    }

    fs.renameSync(dossierTemporaire, destination);
    destinationPubliee = true;

    if (!fs.existsSync(destination) || !fs.statSync(destination).isDirectory()) {
      throw new Error("Le dossier destination n'est pas accessible après publication.");
    }

    // La source n'est supprimée qu'après publication et vérification de la destination.
    fs.rmSync(source, { recursive: true, force: false });
    return destination;
  } catch (error) {
    // Si la source existe encore, elle reste la référence. Toute destination
    // incomplète ou dupliquée créée par cette transaction est supprimée.
    try {
      if (fs.existsSync(dossierTemporaire)) {
        fs.rmSync(dossierTemporaire, { recursive: true, force: true });
      }
    } catch (nettoyageTempError) {
      console.warn("Nettoyage transaction temporaire impossible :", nettoyageTempError.message);
    }

    try {
      if (destinationPubliee && fs.existsSync(source) && fs.existsSync(destination)) {
        fs.rmSync(destination, { recursive: true, force: true });
      }
    } catch (nettoyageDestinationError) {
      console.warn(
        "Nettoyage destination transactionnelle impossible :",
        nettoyageDestinationError.message
      );
    }

    throw error;
  }
}

function ajouterCategoriesSansDeplacerVisite(dossierVisite, nouveauType) {
  const categories = categoriesPourTypeVisite(nouveauType);
  const creees = [];
  try {
    for (const categorie of categories) {
      const cheminCategorie = path.join(dossierVisite, categorie);
      if (!fs.existsSync(cheminCategorie)) {
        fs.mkdirSync(cheminCategorie, { recursive: false });
        creees.push(cheminCategorie);
      }
    }
    return categories;
  } catch (error) {
    for (const cheminCategorie of creees.reverse()) {
      try {
        if (fs.existsSync(cheminCategorie) && fs.readdirSync(cheminCategorie).length === 0) {
          fs.rmdirSync(cheminCategorie);
        }
      } catch (rollbackError) {
        console.warn("Rollback catégorie impossible :", rollbackError.message);
      }
    }
    throw error;
  }
}

function handlerModifierIdentiteVisite(req, res) {
  try {
    const {
      voyage,
      ancienNom,
      ancienneVille,
      ancienneVisiteRapide,
      ancienChemin,
      ancienIdPhysique,
      ancienStockageVille,
      nouveauNom,
      nouvelleVille,
      nouveauType,
      nouvelleVisiteRapide,
    } = req.body || {};

    const nomVoyage = nettoyerSegmentCheminPhotoCartel(voyage);
    const nomAncien = nettoyerSegmentCheminPhotoCartel(ancienNom);
    const nomNouveau = nettoyerSegmentCheminPhotoCartel(nouveauNom);
    const typeNouveau = String(nouveauType || "").trim();
    const visiteRapideCible = nouvelleVisiteRapide === true;
    const villeNouvelleSaisie = String(nouvelleVille || "").trim();
    const villeNouvelleStockage = nettoyerSegmentCheminPhotoCartel(
      visiteRapideCible ? "Visites rapides" : villeNouvelleSaisie
    );

    if (
      !nomVoyage ||
      !nomAncien ||
      !nomNouveau ||
      !villeNouvelleStockage ||
      (!visiteRapideCible && (!typeNouveau || villeNouvelleSaisie === "Ville non renseignée"))
    ) {
      return res.status(400).json({
        success: false,
        error: visiteRapideCible
          ? "Identité de visite incomplète."
          : "Une visite structurée doit posséder une ville réelle et un type de visite.",
      });
    }

    const sourceResolue = resoudreSourceVisite({
      nomVoyage,
      nomAncien,
      ancienChemin,
      ancienIdPhysique,
      ancienStockageVille,
      ancienneVille,
      ancienneVisiteRapide,
    });
    const source = sourceResolue.chemin;
    const villeAncienneReelle = sourceResolue.stockageVille;

    const parentDestination = path.join(
      DOSSIER_RACINE_DONNEES,
      DOSSIER_METIER_VOYAGES,
      nomVoyage,
      villeNouvelleStockage
    );
    const destination = path.join(parentDestination, nomNouveau);

    if (
      path.resolve(source).toLowerCase() !==
        path.resolve(destination).toLowerCase() &&
      fs.existsSync(destination)
    ) {
      return res.status(409).json({
        success: false,
        error: "Une visite porte déjà ce nom dans cette ville.",
      });
    }

    fs.mkdirSync(parentDestination, { recursive: true });
    const memeChemin =
      path.resolve(source).toLowerCase() ===
      path.resolve(destination).toLowerCase();

    if (memeChemin) {
      // Changement de type uniquement : ajout contrôlé des catégories manquantes.
      ajouterCategoriesSansDeplacerVisite(source, typeNouveau);
    } else {
      // v41 : copie préparée dans un dossier temporaire, publication atomique,
      // puis seulement suppression de la source. Une erreur laisse la source intacte.
      copierDossierVisiteTransactionnel(
        source,
        destination,
        nomAncien,
        nomNouveau,
        typeNouveau
      );
    }

    try {
      const parentAncien = path.dirname(source);
      if (
        path.resolve(parentAncien).toLowerCase() !==
          path.resolve(parentDestination).toLowerCase() &&
        fs.existsSync(parentAncien) &&
        fs.readdirSync(parentAncien).length === 0
      ) {
        fs.rmdirSync(parentAncien);
      }
    } catch (nettoyageError) {
      console.warn(
        "Nettoyage ancien dossier ville impossible :",
        nettoyageError.message
      );
    }

    return res.json({
      success: true,
      version: VERSION_PHOTOCARTEL,
      chemin: destination,
      stockageVille: villeNouvelleStockage,
      ancienneVilleStockage: villeAncienneReelle,
      nom: nomNouveau,
      ville: nouvelleVille,
      type: typeNouveau,
    });
  } catch (error) {
    console.error("ERREUR modification identité visite =", error);
    return res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message });
  }
}

// v40.5 : les deux formes sont acceptées pour éviter toute divergence de configuration frontend.
app.post("/modifier-identite-visite", handlerModifierIdentiteVisite);
app.post("/api/modifier-identite-visite", handlerModifierIdentiteVisite);


function empreinteSha256Fichier(cheminFichier) {
  const hash = crypto.createHash("sha256");
  hash.update(fs.readFileSync(cheminFichier));
  return hash.digest("hex");
}

function copierPuisVerifierAvantSuppression({ cheminSource, cheminDestinationFinal }) {
  const dossierDestination = path.dirname(cheminDestinationFinal);
  const nomFinal = path.basename(cheminDestinationFinal);
  const cheminTemporaire = path.join(
    dossierDestination,
    `.${nomFinal}.photocartel-${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}.tmp`
  );

  let finalCree = false;
  try {
    const statSourceAvant = fs.statSync(cheminSource);
    const empreinteSource = empreinteSha256Fichier(cheminSource);

    fs.copyFileSync(cheminSource, cheminTemporaire, fs.constants.COPYFILE_EXCL);

    const statTemporaire = fs.statSync(cheminTemporaire);
    if (statTemporaire.size !== statSourceAvant.size) {
      throw new Error(
        `Copie incomplète : ${statTemporaire.size} octet(s) au lieu de ${statSourceAvant.size}.`
      );
    }

    const empreinteTemporaire = empreinteSha256Fichier(cheminTemporaire);
    if (empreinteTemporaire !== empreinteSource) {
      throw new Error("La copie ne possède pas la même empreinte que le fichier source.");
    }

    fs.renameSync(cheminTemporaire, cheminDestinationFinal);
    finalCree = true;

    const statDestination = fs.statSync(cheminDestinationFinal);
    const empreinteDestination = empreinteSha256Fichier(cheminDestinationFinal);
    if (
      statDestination.size !== statSourceAvant.size ||
      empreinteDestination !== empreinteSource
    ) {
      throw new Error("Le fichier destination n'est pas intègre après validation finale.");
    }

    fs.unlinkSync(cheminSource);

    if (fs.existsSync(cheminSource)) {
      throw new Error("Le fichier source est encore présent après suppression.");
    }
    if (!fs.existsSync(cheminDestinationFinal)) {
      throw new Error("Le fichier destination a disparu après suppression de la source.");
    }

    return {
      taille: statDestination.size,
      empreinteSha256: empreinteDestination,
    };
  } catch (error) {
    try {
      if (fs.existsSync(cheminTemporaire)) fs.unlinkSync(cheminTemporaire);
    } catch (nettoyageTempError) {
      console.warn("Nettoyage copie temporaire impossible :", nettoyageTempError.message);
    }

    // Tant que la source existe, une destination créée pendant une opération incomplète
    // peut être supprimée sans risque afin d'éviter un faux rangement ou un doublon.
    try {
      if (finalCree && fs.existsSync(cheminSource) && fs.existsSync(cheminDestinationFinal)) {
        fs.unlinkSync(cheminDestinationFinal);
      }
    } catch (nettoyageFinalError) {
      console.warn("Nettoyage destination incomplète impossible :", nettoyageFinalError.message);
    }

    throw error;
  }
}

async function handlerRangerPhotosVisites(req, res) {
  try {
    const visites = Array.isArray(req.body.visites) ? req.body.visites : [];

    if (visites.length === 0) {
      return res.json({
        success: true,
        rangementComplet: true,
        photosLues: 0,
        photosRangees: 0,
        photosEchecs: 0,
        photosNonAttribuees: 0,
        visites: [],
      });
    }

    // v40.12 : le rangement métier ne dépend plus d'une racine transmise
    // par le frontend. Sa source unique est la collecte officielle du serveur.
    const dossierRacineDemande = String(req.body.dossierRacine || "").trim();
    const dossierCollecte = path.join(
      DOSSIER_RACINE_DONNEES,
      "Collecte Photo en cours"
    );

    fs.mkdirSync(dossierCollecte, { recursive: true });

    const statsParVisite = new Map(
      visites.map((visite) => [
        visite.id,
        {
          ...visite,
          photosCandidates: 0,
          photosRangees: 0,
          photosEchecs: 0,
          rangee: false,
        },
      ])
    );
    let photosLues = 0;
    let photosRangees = 0;
    let photosEchecs = 0;
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
        photosEchecs += 1;
        resultats.push({ fichier, success: false, raison: "Aucune visite correspondante" });
        continue;
      }

      const statVisite = statsParVisite.get(visite.id);
      if (statVisite) statVisite.photosCandidates += 1;

      const cheminDestination = cheminDestinationVisiteDepuisRangement(visite);
      if (!cheminDestination) {
        photosEchecs += 1;
        if (statVisite) statVisite.photosEchecs += 1;
        resultats.push({ fichier, success: false, raison: "Chemin destination invalide" });
        continue;
      }

      fs.mkdirSync(cheminDestination, { recursive: true });

      const cheminSource = path.join(dossierCollecte, fichier);
      const nomDestination = rendreNomUnique(cheminDestination, fichier);
      const cheminFinal = path.join(cheminDestination, nomDestination);

      try {
        const verification = copierPuisVerifierAvantSuppression({
          cheminSource,
          cheminDestinationFinal: cheminFinal,
        });

        photosRangees += 1;
        if (statVisite) statVisite.photosRangees += 1;

        resultats.push({
          fichier,
          fichierDestination: nomDestination,
          visiteId: visite.id,
          visiteNom: visite.nom,
          taille: verification.taille,
          empreinteSha256: verification.empreinteSha256,
          sourceSupprimeeApresVerification: true,
          success: true,
        });
      } catch (error) {
        photosEchecs += 1;
        if (statVisite) statVisite.photosEchecs += 1;
        resultats.push({
          fichier,
          visiteId: visite.id,
          visiteNom: visite.nom,
          sourceConservee: fs.existsSync(cheminSource),
          success: false,
          raison: error?.message || String(error),
        });
      }
    }

    const visitesResultats = Array.from(statsParVisite.values()).map((visite) => ({
      ...visite,
      rangee:
        visite.photosCandidates > 0 &&
        visite.photosEchecs === 0 &&
        visite.photosRangees === visite.photosCandidates,
    }));
    const rangementComplet = photosEchecs === 0 && photosNonAttribuees === 0;

    res.json({
      success: true,
      rangementComplet,
      mode: "serveur",
      dossierRacineDemande,
      racineEffective: DOSSIER_RACINE_DONNEES,
      dossierCollecte,
      photosLues,
      photosRangees,
      deplaces: photosRangees,
      photosEchecs,
      photosNonAttribuees,
      visites: visitesResultats,
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
}

app.post("/ranger-photos-visites", handlerRangerPhotosVisites);
app.post("/api/ranger-photos-visites", handlerRangerPhotosVisites);


app.get("/mode-demonstration/ping", (req, res) => {
  res.json({
    success: true,
    version: VERSION_PHOTOCARTEL,
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

// v77 — borne propre aux appels IA du tri et de l'analyse des cartels (renommage,
// classification). Sans elle, le SDK attend 10 minutes par tentative et relance deux fois.
const DELAI_MAX_APPEL_IA_MS = 40000;
const OPTIONS_APPEL_IA_BORNE = { timeout: DELAI_MAX_APPEL_IA_MS, maxRetries: 1 };

// v82 — P1 : taille maximale envoyee a l'IA pour le tri, mesuree sur les photos reelles
// de Vincent (paires oeuvre + cartel, 4000x3000) : 768 px suffit a repondre "oeuvre ou cartel".
// v83 — le cartel repart en PLEINE DEFINITION : c'est de lui que sort tout le nom propose,
// aucune perte de texte n'est acceptee. Seul le tri est reduit.
// "Analyser une photo" (analyserPhotoOneShotBuffer) n'a jamais ete concerne : pleine resolution.
const TAILLE_IA_TRI_PX = 768;

// v82 — P2 : les appels IA du tri et de l'analyse des cartels partent ensemble au lieu
// de s'enchainer. L'ordre des resultats est conserve, les ecritures restent sequentielles.
const LIMITE_APPELS_IA_PARALLELES = 4;

// v82 — execute traiter() sur chaque element avec au plus "limite" appels en vol,
// et renvoie les resultats dans l'ordre des elements. traiter() ne doit jamais lever.
async function executerEnParalleleOrdonne(elements, limite, traiter) {
  const resultats = new Array(elements.length);
  let prochainIndex = 0;
  const travailleur = async () => {
    while (true) {
      const index = prochainIndex;
      prochainIndex += 1;
      if (index >= elements.length) return;
      resultats[index] = await traiter(elements[index], index);
    }
  };
  const nombreTravailleurs = Math.max(1, Math.min(limite, elements.length));
  await Promise.all(Array.from({ length: nombreTravailleurs }, () => travailleur()));
  return resultats;
}

// v77 — raison d'échec d'un appel IA dite en langage courant (affichée dans l'app).
function raisonLisibleErreurIA(error) {
  const nom = String(error?.constructor?.name || error?.name || "");
  const message = String(error?.message || error || "");
  if (/Timeout/i.test(nom) || /timed out|timeout/i.test(message)) {
    return "l'analyse IA n'a pas répondu à temps";
  }
  if (/APIConnectionError/.test(nom) || /^Connection error/i.test(message)) {
    return "le service d'analyse IA est injoignable";
  }
  return message || "erreur inconnue";
}

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

// Unifiée avec EXTENSIONS_IMAGE_PHOTOCARTEL (v56) : le flux de renommage ignorait
// silencieusement les formats .heic/.heif/.gif/.bmp/.tif/.tiff, reconnus partout ailleurs
// dans l'appli. Une seule liste de formats image désormais, pas deux qui divergent.
const EXTENSIONS_IMAGE = Array.from(EXTENSIONS_IMAGE_PHOTOCARTEL);

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

// Interne — heure de prise de vue lue dans l'EXIF (DateTimeOriginal, sinon DateTime).
// Lecture directe de l'en-tete JPEG, sans dependance nouvelle. Renvoie "AAAAMMJJHHMMSS" ou "".
function lireHorodatageExifPriseDeVue(cheminFichier) {
  try {
    if (!cheminFichier || !fs.existsSync(cheminFichier)) return "";
    const fd = fs.openSync(cheminFichier, "r");
    const tampon = Buffer.alloc(262144);
    const lus = fs.readSync(fd, tampon, 0, tampon.length, 0);
    fs.closeSync(fd);
    const b = tampon.subarray(0, lus);
    if (b.length < 4 || b[0] !== 0xff || b[1] !== 0xd8) return "";
    let pos = 2;
    while (pos + 4 <= b.length) {
      if (b[pos] !== 0xff) return "";
      const marqueur = b[pos + 1];
      const taille = b.readUInt16BE(pos + 2);
      if (marqueur === 0xe1 && b.toString("latin1", pos + 4, pos + 10) === "Exif\0\0") {
        const t = pos + 10;
        const le = b.toString("latin1", t, t + 2) === "II";
        const u16 = (o) => (le ? b.readUInt16LE(o) : b.readUInt16BE(o));
        const u32 = (o) => (le ? b.readUInt32LE(o) : b.readUInt32BE(o));
        const lireIfd = (debut) => {
          const tags = {};
          if (t + debut + 2 > b.length) return tags;
          const n = u16(t + debut);
          for (let i = 0; i < n; i += 1) {
            const e = t + debut + 2 + i * 12;
            if (e + 12 > b.length) break;
            tags[u16(e)] = { type: u16(e + 2), nombre: u32(e + 4), valeur: u32(e + 8) };
          }
          return tags;
        };
        const lireTexte = (tag) =>
          tag && tag.type === 2 && t + tag.valeur + 19 <= b.length
            ? b.toString("latin1", t + tag.valeur, t + tag.valeur + 19)
            : "";
        const ifd0 = lireIfd(u32(t + 4));
        const ifdExif = ifd0[0x8769] ? lireIfd(ifd0[0x8769].valeur) : {};
        const brut = lireTexte(ifdExif[0x9003]) || lireTexte(ifd0[0x0132]);
        const m = brut.match(/^(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
        return m ? m.slice(1).join("") : "";
      }
      if (marqueur === 0xda) return "";
      pos += 2 + taille;
    }
    return "";
  } catch (e) {
    return "";
  }
}

function distanceTimestampSecondes(fichierA, fichierB) {
  const a = extraireTimestampComparable(fichierA);
  const b = extraireTimestampComparable(fichierB);

  const dateA = timestampVersDate(a);
  const dateB = timestampVersDate(b);

  if (!dateA || !dateB) return Number.MAX_SAFE_INTEGER;

  return Math.abs(dateA.getTime() - dateB.getTime()) / 1000;
}

function distanceEntreHorodatages(a, b) {
  const dateA = timestampVersDate(a);
  const dateB = timestampVersDate(b);
  if (!dateA || !dateB) return Number.MAX_SAFE_INTEGER;
  return Math.abs(dateA.getTime() - dateB.getTime()) / 1000;
}

// Interne — l'heure EXIF des deux photos prime ; a defaut, l'heure lue dans le nom (comportement v85).
function distancePriseDeVueSecondes(oeuvre, cartel, cheminOeuvres, cheminCartels) {
  if (cheminOeuvres && cheminCartels) {
    const exifOeuvre = lireHorodatageExifPriseDeVue(path.join(cheminOeuvres, oeuvre));
    const exifCartel = lireHorodatageExifPriseDeVue(path.join(cheminCartels, cartel));
    if (exifOeuvre && exifCartel) return distanceEntreHorodatages(exifOeuvre, exifCartel);
  }
  return distanceTimestampSecondes(oeuvre, cartel);
}

function trouverCartelLePlusProche(oeuvre, cartelsDisponibles, cheminOeuvres = "", cheminCartels = "") {
  const FENETRE_MAX_ASSOCIATION = 60;

  if (!cartelsDisponibles.length) return null;

  let meilleur = null;
  let meilleureDistance = Number.MAX_SAFE_INTEGER;

  for (const cartel of cartelsDisponibles) {
    const distance = distancePriseDeVueSecondes(oeuvre, cartel, cheminOeuvres, cheminCartels);

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

function construireNomIntelligentDepuisAnalyse(fichierOeuvre, analyse, cheminOeuvre = "") {
  const extension = path.extname(fichierOeuvre).toLowerCase() || ".jpg";
  // Interne — si le nom ne porte pas d'horodatage, l'heure EXIF de prise de vue le remplace.
  const timestampNom = normaliserTimestampDepuisNomFichier(fichierOeuvre);
  const exifOeuvre = /^\d{8}_\d{6}$/.test(timestampNom) ? "" : lireHorodatageExifPriseDeVue(cheminOeuvre);
  // Interne — seul un vrai horodatage ouvre le nom final ; l'ancien nom du fichier n'y est jamais recopie.
  // Il reste en tete des noms A_VERIFIER_RENOMMAGE, pour qu'on retrouve la photo.
  const timestamp = exifOeuvre
    ? `${exifOeuvre.slice(0, 8)}_${exifOeuvre.slice(8, 14)}`
    : /^\d{8}_\d{6}$/.test(timestampNom) ? timestampNom : "";
  const prefixeAVerifier = timestamp || timestampNom;
  const confiance = Number(analyse?.confidence || 0);

  if (!analyse || confiance < 0.5) {
    return `${prefixeAVerifier}, A_VERIFIER_RENOMMAGE${extension}`;
  }

  const morceaux = [];
  const artiste = nettoyerNomFichier(analyse.artist || "");
  const titre = nettoyerNomFichier(analyse.title_fr || analyse.title_en || "");
  const date = nettoyerNomFichier(analyse.date || "");

  if (timestamp) morceaux.push(timestamp);
  if (artiste) morceaux.push(artiste);
  if (titre) morceaux.push(`'${titre}'`);
  if (date) morceaux.push(date);

  if (morceaux.length <= (timestamp ? 1 : 0)) {
    return `${prefixeAVerifier}, A_VERIFIER_RENOMMAGE${extension}`;
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

// v57 — les trois fonctions ci-dessous envoyaient le buffer brut à OpenAI en l'étiquetant
// systématiquement "image/jpeg", quel que soit le format réel (bug révélé par l'élargissement
// de EXTENSIONS_IMAGE aux formats .heic/.heif/.gif/.bmp/.tif/.tiff : un cartel ou une photo dans
// un de ces formats était envoyé à OpenAI avec une étiquette MIME fausse, ce qui pouvait faire
// échouer l'analyse silencieusement). Normalisation en JPEG réel via sharp avant tout envoi.
// LIMITE CONNUE ET VÉRIFIÉE : la version de sharp installée ici échoue à décoder le HEVC (le
// codec réellement utilisé par les .heic de téléphone, Samsung comme iPhone) — seul AVIF/AV1
// fonctionne. Sans savoir si la version de sharp chez Vincent a le même défaut, cette fonction
// vérifie le résultat après conversion : si ce n'est PAS un vrai JPEG, elle lève une erreur
// explicite plutôt que d'envoyer un buffer mal étiqueté à OpenAI en silence.
async function normaliserBufferImagePourIA(buffer, tailleMaxPixels = null) {
  const sharp = await obtenirSharpPhotoCartel();
  if (!sharp) {
    throw new Error(
      "Impossible de vérifier/convertir le format de l'image (module sharp indisponible) : envoi à l'IA refusé par sécurité."
    );
  }
  let bufferNormalise;
  try {
    const traitement = sharp(buffer);
    const traitementDimensionne = tailleMaxPixels
      ? traitement.resize({
          width: tailleMaxPixels,
          height: tailleMaxPixels,
          fit: "inside",
          withoutEnlargement: true,
        })
      : traitement;
    bufferNormalise = await traitementDimensionne.jpeg({ quality: 90 }).toBuffer();
  } catch (error) {
    throw new Error(
      `Format d'image non décodable pour l'analyse IA (${error.message}). ` +
      `Vérifie que sharp supporte ce format sur ce serveur (HEIC/HEVC notamment).`
    );
  }
  const estUnVraiJpeg =
    bufferNormalise.length > 3 &&
    bufferNormalise[0] === 0xff &&
    bufferNormalise[1] === 0xd8 &&
    bufferNormalise[2] === 0xff;
  if (!estUnVraiJpeg) {
    throw new Error("La conversion en JPEG a échoué silencieusement : envoi à l'IA refusé par sécurité.");
  }
  return bufferNormalise;
}

// v92 — R2 : contrôle local de la classification du tri, sans aucun appel réseau.
// Deux mesures séparent un cartel d'une œuvre : la part de pixels colorés et l'écart
// de luminance. Mesuré sur les 52 photos du dossier Morozov — œuvres : part colorée
// 0,241 à 0,409 et écart 40,5 à 66,1 ; cartels : 0,001 à 0,099 et 8,5 à 26,9.
// Les bornes ci-dessous laissent l'entre-deux à l'IA : la mesure ne corrige que le franc.
const LARGEUR_MESURE_TRAITS_PHOTOCARTEL = 400;
const SEUIL_PIXEL_COLORE_PHOTOCARTEL = 0.25;
const PART_COLOREE_MAX_CARTEL = 0.15;
const ECART_LUMINANCE_MAX_CARTEL = 35;
const PART_COLOREE_MIN_OEUVRE = 0.22;
const ECART_LUMINANCE_MIN_OEUVRE = 38;

// Ne lève jamais : sans sharp ou sur une image non décodable, renvoie null et le tri
// garde exactement le comportement v91.
async function mesurerTraitsImagePhotoCartel(buffer) {
  try {
    const sharp = await obtenirSharpPhotoCartel();
    if (!sharp) return null;
    const { data, info } = await sharp(buffer)
      .rotate()
      .resize({ width: LARGEUR_MESURE_TRAITS_PHOTOCARTEL })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    if (!data || info.channels < 3) return null;
    const nombrePixels = info.width * info.height;
    if (!nombrePixels) return null;
    let pixelsColores = 0;
    let sommeLuminance = 0;
    let sommeCarresLuminance = 0;
    for (let index = 0; index < nombrePixels; index += 1) {
      const decalage = index * info.channels;
      const rouge = data[decalage];
      const vert = data[decalage + 1];
      const bleu = data[decalage + 2];
      const maximum = Math.max(rouge, vert, bleu);
      const minimum = Math.min(rouge, vert, bleu);
      const saturation = maximum === 0 ? 0 : (maximum - minimum) / maximum;
      if (saturation > SEUIL_PIXEL_COLORE_PHOTOCARTEL) pixelsColores += 1;
      const luminance = 0.299 * rouge + 0.587 * vert + 0.114 * bleu;
      sommeLuminance += luminance;
      sommeCarresLuminance += luminance * luminance;
    }
    const moyenne = sommeLuminance / nombrePixels;
    const variance = Math.max(0, sommeCarresLuminance / nombrePixels - moyenne * moyenne);
    return {
      partColoree: pixelsColores / nombrePixels,
      ecartLuminance: Math.sqrt(variance),
    };
  } catch (error) {
    return null;
  }
}

// Renvoie "Oeuvres", "Cartels", ou null quand la mesure ne tranche pas franchement.
function categorieSelonImagePhotoCartel(traits) {
  if (!traits) return null;
  if (
    traits.partColoree < PART_COLOREE_MAX_CARTEL &&
    traits.ecartLuminance < ECART_LUMINANCE_MAX_CARTEL
  ) {
    return "Cartels";
  }
  if (
    traits.partColoree > PART_COLOREE_MIN_OEUVRE &&
    traits.ecartLuminance > ECART_LUMINANCE_MIN_OEUVRE
  ) {
    return "Oeuvres";
  }
  return null;
}

// v92 — la mesure locale corrige le classement de l'IA dans deux cas seulement :
// elle contredit franchement un classement Oeuvres/Cartels, ou l'IA n'a donné ni l'un
// ni l'autre (Architecture, Jardins, A_verifier_classification, ou appel en échec) et
// la photo est franchement l'une des deux. Partout ailleurs, le classement IA est gardé.
function categorieTriCorrigeePhotoCartel(categorieIA, traits, nomFichier) {
  const mesure = categorieSelonImagePhotoCartel(traits);
  if (!mesure) return categorieIA;
  const detail =
    `part colorée ${traits.partColoree.toFixed(3)}, écart luminance ${traits.ecartLuminance.toFixed(1)}`;
  if (categorieIA === "Oeuvres" || categorieIA === "Cartels") {
    if (mesure === categorieIA) return categorieIA;
    console.log(`TRI RENOMMAGE ${nomFichier} : ${categorieIA} corrigé en ${mesure} par la mesure locale (${detail})`);
    return mesure;
  }
  console.log(
    `TRI RENOMMAGE ${nomFichier} : ${categorieIA || "sans classement"} rattrapé en ${mesure} ` +
    `par la mesure locale (${detail})`
  );
  return mesure;
}

async function classifierImageBuffer(buffer) {
  const bufferNormalise = await normaliserBufferImagePourIA(buffer, TAILLE_IA_TRI_PX);
  const imageBase64 = bufferNormalise.toString("base64");

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
  }, OPTIONS_APPEL_IA_BORNE);

  return nettoyerCategorie(response.choices[0].message.content);
}

async function trierMinimalPourRenommage(fichiers, cheminDestination, erreursTri = []) {
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

  // v82 — P2 : les appels IA de tri partent ensemble (au plus LIMITE_APPELS_IA_PARALLELES
  // en vol). Les ecritures et la numerotation restent sequentielles et dans l'ordre d'origine,
  // sans quoi rendreNomUnique verrait un dossier incomplet.
  const debutTriMs = Date.now();
  const classementsParFichier = await executerEnParalleleOrdonne(
    fichiers,
    LIMITE_APPELS_IA_PARALLELES,
    async (fichier) => {
      const debutPhotoMs = Date.now();
      // v92 — la mesure locale est prise dans le même passage parallèle que l'appel IA :
      // elle ne rallonge pas le tri d'un aller-retour supplémentaire par photo.
      const traits = await mesurerTraitsImagePhotoCartel(fichier.buffer);
      try {
        const categorie = await classifierImageBuffer(fichier.buffer);
        console.log(
          `TRI RENOMMAGE ${fichier.originalname} : ${categorie} en ${Date.now() - debutPhotoMs} ms ` +
          `(${fichier.buffer?.length || 0} octets)`
        );
        return { categorie, traits, erreur: null, dureeMs: Date.now() - debutPhotoMs };
      } catch (error) {
        return { categorie: null, traits, erreur: error, dureeMs: Date.now() - debutPhotoMs };
      }
    }
  );
  console.log(
    `TRI RENOMMAGE : ${fichiers.length} photo(s) classées en ${Date.now() - debutTriMs} ms ` +
    `(${LIMITE_APPELS_IA_PARALLELES} appels IA en parallèle au plus)`
  );

  for (let indexFichier = 0; indexFichier < fichiers.length; indexFichier += 1) {
    const fichier = fichiers[indexFichier];
    const classement = classementsParFichier[indexFichier];
    const debutPhotoMs = Date.now() - (classement?.dureeMs || 0);
    try {
      // v92 — R2 : la mesure locale corrige un classement franchement faux et rattrape
      // les photos qu'aucun classement Oeuvres/Cartels n'a retenues, appel IA en échec compris.
      const categorie = categorieTriCorrigeePhotoCartel(
        classement?.erreur ? null : classement?.categorie,
        classement?.traits,
        fichier.originalname
      );
      if (classement?.erreur) {
        if (categorie !== "Oeuvres" && categorie !== "Cartels") throw classement.erreur;
        console.error(
          `TRI RENOMMAGE ${fichier.originalname} : appel IA en échec ` +
          `(${raisonLisibleErreurIA(classement.erreur)}), photo rangée par la mesure locale`
        );
      }

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
      console.error(`TRI RENOMMAGE ${fichier.originalname} : échec après ${Date.now() - debutPhotoMs} ms`);

      stats.A_verifier_renommage += 1;
      erreursTri.push({ fichier: fichier.originalname, raison: raisonLisibleErreurIA(error) });

      const nomFinal = rendreNomUnique(cheminVerification, fichier.originalname);
      const cheminFinalErreur = path.join(cheminVerification, nomFinal);

      console.error("CHEMIN FINAL ERREUR =", cheminFinalErreur);

      fs.mkdirSync(path.dirname(cheminFinalErreur), { recursive: true });
      fs.writeFileSync(cheminFinalErreur, fichier.buffer);
    }
  }

  return stats;
}

// v84 — lecture du cartel par OCR local, puis appel IA sur le TEXTE seul.
// v85 — plus AUCUNE image n'est envoyee par le renommage. Sous le seuil de caracteres,
// la photo part en A_VERIFIER_RENOMMAGE avec sa raison, sans aucun appel IA.
const LANGUES_OCR_CARTEL = process.env.PHOTOCARTEL_OCR_LANGUES || "fra+eng+deu+por";
const SEUIL_CARACTERES_OCR_CARTEL = Number(process.env.PHOTOCARTEL_OCR_SEUIL_CARACTERES || 15);
const CHEMIN_LANGUES_OCR_CARTEL = process.env.PHOTOCARTEL_OCR_CHEMIN_LANGUES || "";

let chargeurTesseractPhotoCartel = null;
let travailleurOcrPhotoCartel = null;
let fileOcrPhotoCartel = Promise.resolve();

// Meme forme que obtenirSharpPhotoCartel : absent = on le dit une fois et on continue sans.
async function obtenirTesseractPhotoCartel() {
  if (chargeurTesseractPhotoCartel === false) return null;
  if (chargeurTesseractPhotoCartel) return chargeurTesseractPhotoCartel;
  try {
    const moduleTesseract = await import("tesseract.js");
    chargeurTesseractPhotoCartel = moduleTesseract.default || moduleTesseract;
    return chargeurTesseractPhotoCartel;
  } catch (error) {
    chargeurTesseractPhotoCartel = false;
    console.warn(
      "Module tesseract.js absent : aucun cartel ne sera lu, les photos partiront en A_VERIFIER_RENOMMAGE."
    );
    return null;
  }
}

// Un seul travailleur OCR, cree a la premiere demande et garde ensuite.
// Trois protections, toutes exigees par des echecs reproduits en recette :
//  - errorHandler, sans lequel tesseract.js relance l'erreur hors promesse et arrete le serveur ;
//  - une borne de demarrage, car un echec de chargement de langue ne resout jamais la promesse ;
//  - un drapeau definitif, pour ne pas retenter a chaque cartel.
const DELAI_MAX_DEMARRAGE_OCR_MS = 20000;
let ocrCartelIndisponible = false;
let demarrageOcrPhotoCartel = null;

async function obtenirTravailleurOcrPhotoCartel() {
  if (ocrCartelIndisponible) return null;
  if (travailleurOcrPhotoCartel) return travailleurOcrPhotoCartel;
  if (demarrageOcrPhotoCartel) return demarrageOcrPhotoCartel;

  demarrageOcrPhotoCartel = (async () => {
    const tesseract = await obtenirTesseractPhotoCartel();
    if (!tesseract?.createWorker) {
      ocrCartelIndisponible = true;
      return null;
    }

    const langues = LANGUES_OCR_CARTEL.split("+").map((langue) => langue.trim()).filter(Boolean);
    const options = {
      errorHandler: (erreur) => {
        ocrCartelIndisponible = true;
        console.error(`OCR CARTEL : travailleur indisponible — ${erreur?.message || erreur}`);
      },
      ...(CHEMIN_LANGUES_OCR_CARTEL ? { langPath: CHEMIN_LANGUES_OCR_CARTEL, gzip: false } : {}),
    };

    const debutMs = Date.now();
    let minuterie = null;
    try {
      const borne = new Promise((resolve) => {
        minuterie = setTimeout(() => resolve("BORNE_DEMARRAGE_OCR"), DELAI_MAX_DEMARRAGE_OCR_MS);
      });
      const resultat = await Promise.race([tesseract.createWorker(langues, 1, options), borne]);
      if (resultat === "BORNE_DEMARRAGE_OCR" || !resultat?.recognize) {
        ocrCartelIndisponible = true;
        console.error(
          `OCR CARTEL : travailleur non démarré en ${Date.now() - debutMs} ms — ` +
          "aucun cartel ne sera lu, les photos partiront en A_VERIFIER_RENOMMAGE."
        );
        return null;
      }
      travailleurOcrPhotoCartel = resultat;
      console.log(`OCR CARTEL : travailleur prêt en ${Date.now() - debutMs} ms (langues ${langues.join("+")})`);
      return travailleurOcrPhotoCartel;
    } catch (error) {
      ocrCartelIndisponible = true;
      console.error(
        `OCR CARTEL : création du travailleur impossible (${error?.message || error}) — ` +
        "aucun cartel ne sera lu, les photos partiront en A_VERIFIER_RENOMMAGE."
      );
      return null;
    } finally {
      if (minuterie) clearTimeout(minuterie);
      demarrageOcrPhotoCartel = null;
    }
  })();

  return demarrageOcrPhotoCartel;
}

// L'OCR est un travail processeur : on le passe en file, un cartel a la fois,
// meme quand les analyses partent en parallele.
function executerOcrEnSerie(tache) {
  const resultat = fileOcrPhotoCartel.then(tache, tache);
  fileOcrPhotoCartel = resultat.then(() => undefined, () => undefined);
  return resultat;
}

// v90 — durée de lecture maximale d'un cartel (hors attente dans la file OCR).
const LIMITE_LECTURE_OCR_CARTEL_MS = Number(process.env.PHOTOCARTEL_OCR_LIMITE_LECTURE_MS || 4000);

// v92 — R1 : l'OCR ne lit plus la photo entière du cartel, mais la seule zone de texte.
// La zone est trouvée localement avec sharp, sans aucun appel réseau : contraste local
// (image nette moins image floutée), cellules de 10 px, blocs connexes, union des blocs
// qui pèsent au moins un cinquième du plus gros — un cartel porte souvent deux œuvres,
// chacune dans son bloc. Mesuré sur les 26 cartels du dossier Morozov : 23 lus sur 26
// en photo entière contre 26 sur 26 en zone recadrée, et 2 120 ms de lecture moyenne
// ramenés à 1 375 ms (détection comprise).
const LARGEUR_ANALYSE_ZONE_CARTEL = 800;
const COTE_CELLULE_ZONE_CARTEL = 10;
const SEUIL_CONTRASTE_TEXTE_CARTEL = 18;
const PART_CELLULE_TEXTE_CARTEL = 0.06;
const PART_BLOC_RETENU_ZONE_CARTEL = 0.2;
const MARGE_ZONE_CARTEL = 0.06;
const PART_MAX_ZONE_CARTEL = 0.6;
const LARGEUR_OCR_ZONE_CARTEL = 1500;

// Ne lève jamais : sans sharp, ou si aucun bloc de texte n'est trouvé, renvoie null et
// la lecture se fait sur la photo entière, exactement comme en v91.
async function trouverZoneTexteCartel(buffer) {
  try {
    const sharp = await obtenirSharpPhotoCartel();
    if (!sharp) return null;

    const reduction = sharp(buffer).rotate().greyscale().resize({ width: LARGEUR_ANALYSE_ZONE_CARTEL });
    const { data: net, info } = await reduction.clone().raw().toBuffer({ resolveWithObject: true });
    const { data: flou } = await reduction.clone().blur(6).raw().toBuffer({ resolveWithObject: true });
    const largeur = info.width;
    const hauteur = info.height;
    if (!largeur || !hauteur) return null;

    const colonnes = Math.ceil(largeur / COTE_CELLULE_ZONE_CARTEL);
    const lignes = Math.ceil(hauteur / COTE_CELLULE_ZONE_CARTEL);
    const densite = new Float32Array(colonnes * lignes);
    for (let y = 0; y < hauteur; y += 1) {
      for (let x = 0; x < largeur; x += 1) {
        const position = y * largeur + x;
        if (Math.abs(net[position] - flou[position]) > SEUIL_CONTRASTE_TEXTE_CARTEL) {
          const cellule =
            Math.floor(y / COTE_CELLULE_ZONE_CARTEL) * colonnes + Math.floor(x / COTE_CELLULE_ZONE_CARTEL);
          densite[cellule] += 1;
        }
      }
    }

    const airecellule = COTE_CELLULE_ZONE_CARTEL * COTE_CELLULE_ZONE_CARTEL;
    const texte = new Uint8Array(colonnes * lignes);
    for (let cellule = 0; cellule < densite.length; cellule += 1) {
      texte[cellule] = densite[cellule] / airecellule > PART_CELLULE_TEXTE_CARTEL ? 1 : 0;
    }

    // Fermeture : une cellule vide cernée par du texte compte comme du texte (interligne).
    const ferme = new Uint8Array(texte);
    for (let y = 0; y < lignes; y += 1) {
      for (let x = 0; x < colonnes; x += 1) {
        if (texte[y * colonnes + x]) continue;
        let voisines = 0;
        for (let dy = -1; dy <= 1; dy += 1) {
          for (let dx = -1; dx <= 1; dx += 1) {
            const yy = y + dy;
            const xx = x + dx;
            if (yy >= 0 && yy < lignes && xx >= 0 && xx < colonnes && texte[yy * colonnes + xx]) voisines += 1;
          }
        }
        if (voisines >= 4) ferme[y * colonnes + x] = 1;
      }
    }

    // Blocs connexes (8 voisins), parcours par pile : aucune récursion.
    const vues = new Uint8Array(colonnes * lignes);
    const blocs = [];
    for (let depart = 0; depart < ferme.length; depart += 1) {
      if (!ferme[depart] || vues[depart]) continue;
      const pile = [depart];
      vues[depart] = 1;
      let x0 = colonnes;
      let y0 = lignes;
      let x1 = -1;
      let y1 = -1;
      let cellules = 0;
      while (pile.length) {
        const courante = pile.pop();
        const cx = courante % colonnes;
        const cy = (courante - cx) / colonnes;
        cellules += 1;
        if (cx < x0) x0 = cx;
        if (cx > x1) x1 = cx;
        if (cy < y0) y0 = cy;
        if (cy > y1) y1 = cy;
        for (let dy = -1; dy <= 1; dy += 1) {
          for (let dx = -1; dx <= 1; dx += 1) {
            const yy = cy + dy;
            const xx = cx + dx;
            if (yy < 0 || yy >= lignes || xx < 0 || xx >= colonnes) continue;
            const voisine = yy * colonnes + xx;
            if (ferme[voisine] && !vues[voisine]) {
              vues[voisine] = 1;
              pile.push(voisine);
            }
          }
        }
      }
      blocs.push({ cellules, x0, y0, x1, y1 });
    }
    if (!blocs.length) return null;

    const plusGros = blocs.reduce((a, b) => (b.cellules > a.cellules ? b : a));
    const retenus = blocs.filter((bloc) => bloc.cellules >= plusGros.cellules * PART_BLOC_RETENU_ZONE_CARTEL);
    const x0 = Math.min(...retenus.map((bloc) => bloc.x0));
    const y0 = Math.min(...retenus.map((bloc) => bloc.y0));
    const x1 = Math.max(...retenus.map((bloc) => bloc.x1));
    const y1 = Math.max(...retenus.map((bloc) => bloc.y1));

    const metadonnees = await sharp(buffer).rotate().metadata();
    if (!metadonnees.width || !metadonnees.height) return null;
    const echelle = metadonnees.width / largeur;

    let gauche = x0 * COTE_CELLULE_ZONE_CARTEL * echelle;
    let haut = y0 * COTE_CELLULE_ZONE_CARTEL * echelle;
    let large = (x1 - x0 + 1) * COTE_CELLULE_ZONE_CARTEL * echelle;
    let haute = (y1 - y0 + 1) * COTE_CELLULE_ZONE_CARTEL * echelle;
    const margeX = large * MARGE_ZONE_CARTEL;
    const margeY = haute * MARGE_ZONE_CARTEL;
    gauche = Math.max(0, Math.round(gauche - margeX));
    haut = Math.max(0, Math.round(haut - margeY));
    large = Math.min(metadonnees.width - gauche, Math.round(large + 2 * margeX));
    haute = Math.min(metadonnees.height - haut, Math.round(haute + 2 * margeY));
    if (large < 1 || haute < 1) return null;

    return {
      gauche,
      haut,
      largeur: large,
      hauteur: haute,
      part: (large * haute) / (metadonnees.width * metadonnees.height),
    };
  } catch (error) {
    return null;
  }
}

// Ne lève jamais : renvoie le buffer recadré et préparé pour l'OCR, ou null.
async function preparerZoneCartelPourOCR(buffer) {
  const debutMs = Date.now();
  const zone = await trouverZoneTexteCartel(buffer);
  if (!zone) return null;
  if (zone.part > PART_MAX_ZONE_CARTEL) return null;
  try {
    const sharp = await obtenirSharpPhotoCartel();
    if (!sharp) return null;
    const bufferZone = await sharp(buffer)
      .rotate()
      .extract({ left: zone.gauche, top: zone.haut, width: zone.largeur, height: zone.hauteur })
      .greyscale()
      .normalise()
      .resize({ width: LARGEUR_OCR_ZONE_CARTEL, withoutEnlargement: false })
      .sharpen()
      .png()
      .toBuffer();
    return { buffer: bufferZone, zone, dureeMs: Date.now() - debutMs };
  } catch (error) {
    return null;
  }
}

// Ne leve jamais : un echec d'OCR renvoie un texte vide.
// v90 — la limite ne compte que la lecture elle-même : le chronomètre part quand le cartel sort de la file.
// Une lecture arrêtée ne peut pas être interrompue autrement qu'en arrêtant le moteur : il est relancé
// pour le cartel suivant (le travailleur est obtenu DANS la file, jamais avant).
async function lireUnePasseOcrCartel(buffer, nomCartel, origine) {
  const debutMs = Date.now();
  try {
    let lectureArretee = false;
    const resultat = await executerOcrEnSerie(async () => {
      const travailleur = await obtenirTravailleurOcrPhotoCartel();
      if (!travailleur) return null;
      let minuterie = null;
      const borne = new Promise((resolve) => {
        minuterie = setTimeout(() => resolve("BORNE_LECTURE_OCR"), LIMITE_LECTURE_OCR_CARTEL_MS);
      });
      const lecture = await Promise.race([travailleur.recognize(buffer), borne]);
      clearTimeout(minuterie);
      if (lecture !== "BORNE_LECTURE_OCR") return lecture;
      lectureArretee = true;
      console.log(
        `OCR CARTEL ${nomCartel} (${origine}) : lecture arrêtée à ${LIMITE_LECTURE_OCR_CARTEL_MS} ms, moteur relancé`
      );
      if (travailleurOcrPhotoCartel === travailleur) travailleurOcrPhotoCartel = null;
      await travailleur.terminate().catch(() => {});
      return null;
    });
    if (!resultat) return { texte: "", caracteres: 0, dureeMs: Date.now() - debutMs, lectureArretee };
    const texte = String(resultat?.data?.text || "").trim();
    const caracteres = texte.replace(/\s/g, "").length;
    console.log(`OCR CARTEL ${nomCartel} (${origine}) : ${caracteres} caractère(s) en ${Date.now() - debutMs} ms`);
    return { texte, caracteres, dureeMs: Date.now() - debutMs, lectureArretee };
  } catch (error) {
    console.error(`OCR CARTEL ${nomCartel} : échec après ${Date.now() - debutMs} ms — ${error?.message || error}`);
    return { texte: "", caracteres: 0, dureeMs: Date.now() - debutMs, lectureArretee: false };
  }
}

// v92 — lecture de la zone d'abord. Une seconde lecture sur la photo entière n'a lieu que
// si la lecture de la zone s'est terminée d'elle-même sans rendre assez de texte : dans ce
// cas la photo est rapide à lire, la reprise est bornée. Si la lecture de la zone a été
// arrêtée par la limite, la photo entière serait plus lente encore : aucune reprise.
async function lireTexteCartelParOCR(buffer, nomCartel = "") {
  const debutMs = Date.now();
  const zone = await preparerZoneCartelPourOCR(buffer);
  if (zone) {
    console.log(
      `OCR CARTEL ${nomCartel} : zone de texte ${zone.zone.largeur}x${zone.zone.hauteur} px ` +
      `(${Math.round(zone.zone.part * 100)} % de la photo) trouvée en ${zone.dureeMs} ms`
    );
  }
  let lecture = await lireUnePasseOcrCartel(zone ? zone.buffer : buffer, nomCartel, zone ? "zone" : "photo entière");
  if (zone && !lecture.lectureArretee && lecture.caracteres < SEUIL_CARACTERES_OCR_CARTEL) {
    console.log(
      `OCR CARTEL ${nomCartel} : ${lecture.caracteres} caractère(s) sur la zone, reprise sur la photo entière`
    );
    const reprise = await lireUnePasseOcrCartel(buffer, nomCartel, "photo entière");
    if (reprise.caracteres > lecture.caracteres) lecture = reprise;
  }
  return { ...lecture, dureeMs: Date.now() - debutMs };
}

async function analyserCartelImageBuffer(buffer) {
  const bufferNormalise = await normaliserBufferImagePourIA(buffer);
  const imageBase64 = bufferNormalise.toString("base64");

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
  }, OPTIONS_APPEL_IA_BORNE);

  const contenu = response.choices[0].message.content;
  return extraireJsonDepuisTexte(contenu);
}

async function analyserPhotoOneShotBuffer(buffer) {
  const bufferNormalise = await normaliserBufferImagePourIA(buffer);
  const imageBase64 = bufferNormalise.toString("base64");

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

// v84 — P2 : le prompt texte de /analyse-cartel devient une fonction partagée,
// utilisée par la route ET par la lecture OCR du renommage. Aucun prompt dupliqué.
function construirePromptAnalyseCartelTexte(texte) {
  return `
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
}

// v84 — analyse d'un cartel à partir de son TEXTE : aucune image n'est envoyée.
async function analyserCartelTexteOCR(texte) {
  const response = await openai.responses.create({
    model: "gpt-5-mini",
    input: construirePromptAnalyseCartelTexte(texte),
  }, OPTIONS_APPEL_IA_BORNE);

  return extraireJsonDepuisTexte(response.output_text);
}

app.post("/analyse-cartel", async (req, res) => {
  try {
    const { texte } = req.body;

    const resultat = await analyserCartelTexteOCR(texte);

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
      cheminDansRacineDonnees(dossierRacine) || DOSSIER_RACINE_DONNEES,
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
      version_photocartel: VERSION_PHOTOCARTEL,
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


function dossierAnalysePhotoCartel(dossierRacine, nomDossier) {
  // v34.1 : les dossiers du cycle d’analyse appartiennent toujours à
  // l’infrastructure officielle PhotoCartel. En local Windows, on force donc
  // C:\PhotoCartel (ou PHOTOCARTEL_DATA_DIR) afin d’éviter une écriture
  // accidentelle dans une ancienne racine métier ou un sous-dossier.
  let racine = DOSSIER_RACINE_DONNEES;

  if (process.platform !== "win32" && dossierRacine) {
    racine = cheminDansRacineDonnees(dossierRacine) || DOSSIER_RACINE_DONNEES;
  }

  const dossier = path.join(racine, nomDossier);
  fs.mkdirSync(dossier, { recursive: true });
  return dossier;
}

function verifierFichierEcrit(chemin, libelle) {
  if (!fs.existsSync(chemin)) {
    throw new Error(`${libelle} non créé : ${chemin}`);
  }
  const taille = fs.statSync(chemin).size;
  if (taille <= 0) {
    throw new Error(`${libelle} vide : ${chemin}`);
  }
  return taille;
}

function extensionImageDepuisNom(nomFichier, extensionDefaut = ".jpeg") {
  const extension = path.extname(String(nomFichier || "")).toLowerCase();
  return EXTENSIONS_IMAGE.includes(extension) ? extension : extensionDefaut;
}

app.post("/sauvegarder-photo-a-analyser", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: "Photo manquante" });
    const dossierDestination = dossierAnalysePhotoCartel(req.body.dossierRacine, "Photos à analyser");
    fs.mkdirSync(dossierDestination, { recursive: true });
    const timestampInitial = String(req.body.timestampInitial || genererTimestampAnalysePhoto(new Date()));
    const extension = extensionImageDepuisNom(req.file.originalname);
    const nomPhoto = rendreNomUnique(dossierDestination, `${timestampInitial}_PHOTO_A_ANALYSER${extension}`);
    fs.writeFileSync(path.join(dossierDestination, nomPhoto), req.file.buffer);
    res.json({ success: true, dossierDestination, nomPhoto, timestampInitial });
  } catch (error) {
    console.error("ERREUR /sauvegarder-photo-a-analyser =", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/finaliser-analyse-photo", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: "Photo manquante" });
    const dossierDestination = dossierAnalysePhotoCartel(req.body.dossierRacine, "Photos analysées");
    const dossierAAnalyser = dossierAnalysePhotoCartel(req.body.dossierRacine, "Photos à analyser");
    fs.mkdirSync(dossierDestination, { recursive: true });
    const timestampInitial = String(req.body.timestampInitial || genererTimestampAnalysePhoto(new Date()));
    const analyse = parserJsonSouple(req.body.analyse, {});
    const analyseInitiale = parserJsonSouple(req.body.analyseInitiale, {});
    const modificationDeclareeParClient =
      String(req.body.analyseModifiee || "").toLowerCase() === "true";
    const analyseInitialeDisponible =
      analyseInitiale && typeof analyseInitiale === "object" && Object.keys(analyseInitiale).length > 0;
    const modificationConstateeParServeur =
      analyseInitialeDisponible && JSON.stringify(analyse) !== JSON.stringify(analyseInitiale);
    const analyseModifiee = modificationDeclareeParClient || modificationConstateeParServeur;
    const suffixeAnalyse = analyseModifiee ? "PHOTO_ANALYSEE_MODIFIEE" : "PHOTO_ANALYSEE";
    const baseNom = `${timestampInitial}_${suffixeAnalyse}`;
    const nomPhoto = rendreNomUnique(dossierDestination, `${baseNom}.jpeg`);
    const baseFinale = path.basename(nomPhoto, path.extname(nomPhoto));
    const nomJson = `${baseFinale}.json`;
    const metadonnees = {
      type_document: analyseModifiee ? "PHOTO_ANALYSEE_MODIFIEE" : "PHOTO_ANALYSEE",
      statut_analyse: analyseModifiee ? "MODIFIEE" : "ANALYSEE",
      version_photocartel: VERSION_PHOTOCARTEL,
      timestamp_initial: timestampInitial,
      date_analyse_iso: new Date().toISOString(),
      date_analyse_locale: formaterDateHeureLocale(new Date()),
      nom_photo_original: req.file.originalname || "",
      nom_photo_sauvegardee: nomPhoto,
      nom_json_sauvegarde: nomJson,
      dossier_destination: dossierDestination,
      analyse,
    };
    const cheminPhoto = path.join(dossierDestination, nomPhoto);
    const cheminJson = path.join(dossierDestination, nomJson);
    fs.writeFileSync(cheminPhoto, req.file.buffer);
    fs.writeFileSync(cheminJson, JSON.stringify(metadonnees, null, 2), "utf-8");
    const taillePhoto = verifierFichierEcrit(cheminPhoto, "Photo analysée");
    const tailleJson = verifierFichierEcrit(cheminJson, "Fiche JSON analysée");
    const nomPhotoAAnalyser = path.basename(String(req.body.nomPhotoAAnalyser || ""));
    if (nomPhotoAAnalyser) {
      const cheminAAnalyser = path.join(dossierAAnalyser, nomPhotoAAnalyser);
      if (fs.existsSync(cheminAAnalyser)) fs.unlinkSync(cheminAAnalyser);
    }
    console.log("Analyse finalisée :", { dossierDestination, nomPhoto, nomJson, taillePhoto, tailleJson });
    res.json({
      success: true,
      dossierDestination,
      nomPhoto,
      nomJson,
      timestampInitial,
      cheminPhoto,
      cheminJson,
      taillePhoto,
      tailleJson,
      analyseModifiee,
      modificationDeclareeParClient,
      modificationConstateeParServeur,
    });
  } catch (error) {
    console.error("ERREUR /finaliser-analyse-photo =", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/modifier-analyse-photo", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: "Photo manquante" });
    const dossierDestination = dossierAnalysePhotoCartel(req.body.dossierRacine, "Photos analysées");
    fs.mkdirSync(dossierDestination, { recursive: true });
    const timestampInitial = String(req.body.timestampInitial || genererTimestampAnalysePhoto(new Date()));
    const baseNom = `${timestampInitial}_PHOTO_ANALYSEE_MODIFIEE`;
    // v34.3 : la même analyse remplace toujours sa paire existante.
    // Aucun suffixe (2), (3), etc. n'est créé.
    const nomPhoto = `${baseNom}.jpeg`;
    const nomJson = `${baseNom}.json`;
    const analyse = parserJsonSouple(req.body.analyse, {});
    const metadonnees = {
      type_document: "PHOTO_ANALYSEE_MODIFIEE",
      statut_analyse: "MODIFIEE",
      version_photocartel: VERSION_PHOTOCARTEL,
      timestamp_initial: timestampInitial,
      date_modification_iso: new Date().toISOString(),
      date_modification_locale: formaterDateHeureLocale(new Date()),
      nom_photo_original: req.file.originalname || "",
      nom_photo_sauvegardee: nomPhoto,
      nom_json_sauvegarde: nomJson,
      dossier_destination: dossierDestination,
      analyse,
    };
    const cheminPhoto = path.join(dossierDestination, nomPhoto);
    const cheminJson = path.join(dossierDestination, nomJson);
    fs.writeFileSync(cheminPhoto, req.file.buffer);
    fs.writeFileSync(cheminJson, JSON.stringify(metadonnees, null, 2), "utf-8");
    const taillePhoto = verifierFichierEcrit(cheminPhoto, "Photo analysée modifiée");
    const tailleJson = verifierFichierEcrit(cheminJson, "Fiche JSON modifiée");
    for (const ancienNom of [req.body.ancienNomPhoto, req.body.ancienNomJson]) {
      const nomSecurise = path.basename(String(ancienNom || ""));
      if (!nomSecurise || nomSecurise === nomPhoto || nomSecurise === nomJson) continue;
      const ancienChemin = path.join(dossierDestination, nomSecurise);
      if (fs.existsSync(ancienChemin)) fs.unlinkSync(ancienChemin);
    }
    console.log("Analyse modifiée enregistrée :", { dossierDestination, nomPhoto, nomJson, taillePhoto, tailleJson });
    res.json({
      success: true,
      dossierDestination,
      nomPhoto,
      nomJson,
      timestampInitial,
      cheminPhoto,
      cheminJson,
      taillePhoto,
      tailleJson,
    });
  } catch (error) {
    console.error("ERREUR /modifier-analyse-photo =", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete("/supprimer-fichiers-analyse", (req, res) => {
  try {
    const nomDossier = ["Photos à analyser", "Photos analysées"].includes(req.body.dossier)
      ? req.body.dossier
      : "Photos à analyser";
    const dossier = dossierAnalysePhotoCartel(req.body.dossierRacine, nomDossier);
    const noms = Array.isArray(req.body.noms) ? req.body.noms : [];
    let supprimes = 0;
    for (const nom of noms) {
      const nomSecurise = path.basename(String(nom || ""));
      if (!nomSecurise) continue;
      const chemin = path.join(dossier, nomSecurise);
      if (fs.existsSync(chemin)) {
        fs.unlinkSync(chemin);
        supprimes += 1;
      }
    }
    res.json({ success: true, supprimes });
  } catch (error) {
    console.error("ERREUR /supprimer-fichiers-analyse =", error);
    res.status(500).json({ success: false, error: error.message });
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

    const debutTriMs = Date.now();
    const erreursTri = [];
    const statsTri = await trierMinimalPourRenommage(
      req.files,
      cheminDestination,
      erreursTri
    );
    console.log(`TRI RENOMMAGE terminé : ${req.files.length} photo(s) en ${Date.now() - debutTriMs} ms`);

    res.json({
      success: true,
      total: req.files.length,
      cheminDestination,
      dossierSortie: nomDossierSortie,
      statsTri,
      erreursTri,
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


function extensionImageDepuisUpload(photo = {}) {
  const nomOriginal = nettoyerNomFichier(photo.originalname || "");
  const extensionNom = path.extname(nomOriginal).toLowerCase();
  if (EXTENSIONS_IMAGE.includes(extensionNom)) return extensionNom;

  const extensionsParMime = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
  };

  return extensionsParMime[String(photo.mimetype || "").toLowerCase()] || "";
}

function ecrireEtVerifierPhotoCollecte({ dossierDestination, photo }) {
  const extension = extensionImageDepuisUpload(photo);
  if (!extension) {
    throw new Error(
      `Format image non reconnu (${photo?.mimetype || "type MIME absent"}, ` +
      `${photo?.originalname || "nom absent"}).`
    );
  }

  if (!Buffer.isBuffer(photo.buffer) || photo.buffer.length === 0) {
    throw new Error("Le fichier image reçu est vide.");
  }

  const timestamp = genererTimestampAnalysePhoto(new Date());
  const nomDestination = rendreNomUnique(
    dossierDestination,
    `${timestamp}_VISITE${extension}`
  );
  const cheminFinal = path.join(dossierDestination, nomDestination);
  const empreinteAvant = crypto.createHash("sha256").update(photo.buffer).digest("hex");

  fs.writeFileSync(cheminFinal, photo.buffer, { flag: "wx" });

  if (!fs.existsSync(cheminFinal)) {
    throw new Error("La photo n'existe pas dans Collecte Photo en cours après écriture.");
  }

  const stat = fs.statSync(cheminFinal);
  const empreinteApres = empreinteSha256Fichier(cheminFinal);
  if (stat.size !== photo.buffer.length || empreinteApres !== empreinteAvant) {
    try {
      fs.unlinkSync(cheminFinal);
    } catch {}
    throw new Error("La photo écrite dans Collecte Photo en cours n'est pas intègre.");
  }

  return {
    nomDestination,
    cheminFinal,
    taille: stat.size,
    empreinteSha256: empreinteApres,
  };
}

async function handlerEnregistrerPhotosVisite(req, res) {
  try {
    // v40.12 : une photo de visite est toujours écrite dans la collecte
    // officielle du serveur. La racine d'analyse, le mode démonstration ou
    // une ancienne valeur frontend ne peuvent plus détourner cette écriture.
    const dossierRacineDemande = String(req.body.dossierRacine || "").trim();
    const racineEffective = DOSSIER_RACINE_DONNEES;
    const dossierDestination = path.join(
      DOSSIER_RACINE_DONNEES,
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
    let echecs = 0;

    for (const photo of req.files) {
      try {
        const verification = ecrireEtVerifierPhotoCollecte({
          dossierDestination,
          photo,
        });

        fichiersSauvegardes.push(verification.nomDestination);
        copies += 1;
        resultats.push({
          fichier: photo.originalname || "photo",
          fichierDestination: verification.nomDestination,
          cheminDestination: verification.cheminFinal,
          taille: verification.taille,
          empreinteSha256: verification.empreinteSha256,
          success: true,
        });
      } catch (error) {
        console.error("ERREUR ENREGISTREMENT PHOTO VISITE =", error);
        echecs += 1;
        resultats.push({
          fichier: photo.originalname || "photo",
          success: false,
          error: error.message,
        });
      }
    }

    const enregistrementComplet = copies === req.files.length && echecs === 0;
    const totalDestination = compterImagesDossier(dossierDestination);

    return res.status(enregistrementComplet ? 200 : 422).json({
      success: enregistrementComplet,
      enregistrementComplet,
      dossierRacineDemande,
      racineEffective,
      dossierDestination,
      cheminDestination: dossierDestination,
      recus: req.files.length,
      copies,
      echecs,
      ignores: echecs,
      fichiersSauvegardes,
      totalDestination,
      resultats,
      error: enregistrementComplet
        ? undefined
        : `${echecs} photo(s) sur ${req.files.length} n'ont pas été enregistrée(s).`,
    });
  } catch (error) {
    console.error("ERREUR /enregistrer-photos-visite =", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

app.post("/enregistrer-photos-visite", upload.array("photos"), handlerEnregistrerPhotosVisite);
app.post("/api/enregistrer-photos-visite", upload.array("photos"), handlerEnregistrerPhotosVisite);

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

// v50.5 — étape manuelle : analyse IA + proposition de nom SANS renommer sur disque.
// Le renommage effectif n'a lieu que via /renommer-oeuvres/confirmer, après validation humaine.
app.post("/renommer-oeuvres/analyser", async (req, res) => {
  try {
    console.log("APPEL BACKEND /renommer-oeuvres/analyser =", req.body);

    const { cheminVisite } = req.body;

    if (!cheminVisite) {
      return res.status(400).json({ success: false, error: "cheminVisite manquant" });
    }

    if (!fs.existsSync(cheminVisite)) {
      return res.status(400).json({
        success: false,
        error: "Le dossier de visite n'existe pas : " + cheminVisite,
      });
    }

    const cheminOeuvres = path.join(cheminVisite, "Oeuvres");
    const cheminCartels = path.join(cheminVisite, "Cartels");

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

    const oeuvres = listerImagesDossier(cheminOeuvres);
    const cartels = listerImagesDossier(cheminCartels);

    // Cas simple validé le 01/09/2026 : quand le lot classifié ne contient qu'une seule
    // œuvre et qu'un seul cartel, on les associe directement sans vérification
    // d'horodatage (la classification IA a déjà distingué l'un de l'autre, indépendamment
    // du nom de fichier ou de l'ordre d'envoi). Au-delà d'une seule paire, le comportement
    // existant (matching par horodatage) reste inchangé — hors périmètre de cette version.
    const associationDirecteLotUnique = oeuvres.length === 1 && cartels.length === 1;

    const propositions = [];

    // v82 — P2 : les associations sont calculees d'abord, puis les analyses de cartels
    // partent ensemble. Les propositions sont assemblees ensuite, dans l'ordre des oeuvres.
    const associations = oeuvres.map((oeuvre) => ({
      oeuvre,
      cartel: associationDirecteLotUnique
        ? cartels[0]
        : trouverCartelLePlusProche(oeuvre, cartels, cheminOeuvres, cheminCartels),
    }));

    const debutAnalysesMs = Date.now();
    const analysesParOeuvre = await executerEnParalleleOrdonne(
      associations,
      LIMITE_APPELS_IA_PARALLELES,
      async ({ oeuvre, cartel }) => {
        if (!cartel) return { analyse: null, erreur: null };
        const debutAnalyseMs = Date.now();
        try {
          const cheminCartel = path.join(cheminCartels, cartel);
          const bufferCartel = fs.readFileSync(cheminCartel);

          // v85 — le cartel est lu en local, et SEUL son texte part à l'IA.
          const lecture = await lireTexteCartelParOCR(bufferCartel, cartel);

          if (lecture.caracteres < SEUIL_CARACTERES_OCR_CARTEL) {
            const raisonOcr = lecture.lectureArretee
              ? `cartel trop long à lire (plus de ${LIMITE_LECTURE_OCR_CARTEL_MS / 1000} s)`
              : `cartel illisible : ${lecture.caracteres} caractère(s) lus, minimum ${SEUIL_CARACTERES_OCR_CARTEL}`;
            console.log(
              `ANALYSE CARTEL ${cartel} (oeuvre ${oeuvre}) : aucun appel IA — ${raisonOcr} ` +
              `(OCR ${lecture.dureeMs} ms, total ${Date.now() - debutAnalyseMs} ms)`
            );
            return { analyse: null, erreur: null, raisonOcr };
          }

          const analyse = await analyserCartelTexteOCR(lecture.texte);

          console.log(
            `ANALYSE CARTEL ${cartel} (oeuvre ${oeuvre}) : voie texte, ` +
            `${lecture.caracteres} caractère(s) lus en ${lecture.dureeMs} ms, ` +
            `total ${Date.now() - debutAnalyseMs} ms`
          );
          return { analyse, erreur: null, raisonOcr: null };
        } catch (error) {
          console.error(
            `ANALYSE CARTEL ${cartel} (oeuvre ${oeuvre}) : échec après ${Date.now() - debutAnalyseMs} ms`
          );
          return { analyse: null, erreur: error };
        }
      }
    );
    console.log(
      `ANALYSE CARTELS : ${associations.length} oeuvre(s) traitée(s) en ${Date.now() - debutAnalysesMs} ms ` +
      `(${LIMITE_APPELS_IA_PARALLELES} appels IA en parallèle au plus)`
    );

    for (let indexOeuvre = 0; indexOeuvre < associations.length; indexOeuvre += 1) {
      const { oeuvre, cartel } = associations[indexOeuvre];
      const resultatAnalyse = analysesParOeuvre[indexOeuvre];

      if (!cartel) {
        propositions.push({
          oeuvre,
          cartel: null,
          aVerifier: true,
          raison: "Aucun cartel proche",
          nomPropose: oeuvre,
          analyse: null,
        });
        continue;
      }

      try {
        if (resultatAnalyse.erreur) throw resultatAnalyse.erreur;
        const analyse = resultatAnalyse.analyse;
        const nomPropose = construireNomIntelligentDepuisAnalyse(oeuvre, analyse, path.join(cheminOeuvres, oeuvre));
        const aVerifier = nomPropose.includes("A_VERIFIER_RENOMMAGE");

        propositions.push({
          oeuvre,
          cartel,
          aVerifier,
          // v85 — quand l'OCR n'a pas lu assez, la raison le dit avec son compte de caractères.
          raison: aVerifier ? (resultatAnalyse.raisonOcr || "Analyse peu fiable") : "",
          nomPropose,
          analyse,
        });
      } catch (error) {
        console.error("ERREUR ANALYSE PROPOSITION =", error);
        propositions.push({
          oeuvre,
          cartel,
          aVerifier: true,
          raison: raisonLisibleErreurIA(error),
          nomPropose: oeuvre,
          analyse: null,
        });
      }
    }

    res.json({
      success: true,
      cheminVisite,
      total: oeuvres.length,
      propositions,
    });
  } catch (error) {
    console.error("ERREUR /renommer-oeuvres/analyser =", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// v50.5 — étape manuelle : applique réellement le renommage, uniquement sur ce que
// l'utilisateur a validé (propositions reçues, éventuellement éditées côté client).
app.post("/renommer-oeuvres/confirmer", async (req, res) => {
  try {
    console.log("APPEL BACKEND /renommer-oeuvres/confirmer =", req.body);

    const dateDebutRenommage = new Date();
    const { cheminVisite, propositions } = req.body;

    if (!cheminVisite) {
      return res.status(400).json({ success: false, error: "cheminVisite manquant" });
    }

    if (!Array.isArray(propositions) || propositions.length === 0) {
      return res.status(400).json({ success: false, error: "Aucune proposition à confirmer" });
    }

    const cheminOeuvres = path.join(cheminVisite, "Oeuvres");
    const cheminCartels = path.join(cheminVisite, "Cartels");
    const cheminVerification = path.join(cheminVisite, "A_verifier_renommage");

    fs.mkdirSync(cheminVerification, { recursive: true });

    let renommes = 0;
    let aVerifier = 0;
    const resultats = [];

    for (const proposition of propositions) {
      const { oeuvre, cartel, nomFinal, aVerifier: aVerifierDemande } = proposition;
      const cheminOeuvre = path.join(cheminOeuvres, oeuvre);

      if (!fs.existsSync(cheminOeuvre)) {
        aVerifier += 1;
        // v91 — une œuvre déjà déplacée en « À vérifier » par un appel précédent n'est pas « introuvable ».
        const dejaDeplacee = fs.existsSync(path.join(cheminVerification, oeuvre));
        resultats.push({ oeuvre, success: false, raison: dejaDeplacee ? "Déjà marqué à vérifier" : "Fichier introuvable" });
        continue;
      }

      if (aVerifierDemande || !nomFinal) {
        const cheminDejaVerifie = path.join(cheminVerification, oeuvre);
        if (fs.existsSync(cheminDejaVerifie)) {
          // Idempotence : déjà copié lors d'un appel précédent (double-clic, retry après
          // erreur réseau...). On ne recrée pas de doublon "(2)".
          aVerifier += 1;
          resultats.push({ oeuvre, success: false, raison: "Déjà marqué à vérifier" });
          continue;
        }
        // v91 — déplacée, et non plus copiée : le sous-dossier Oeuvres ne garde que les œuvres renommées.
        const nomVerification = rendreNomUnique(cheminVerification, oeuvre);
        fs.renameSync(cheminOeuvre, path.join(cheminVerification, nomVerification));
        aVerifier += 1;
        resultats.push({ oeuvre, success: false, raison: "Marqué à vérifier" });
        continue;
      }

      try {
        const nomOeuvreFinal = rendreNomUnique(cheminOeuvres, nomFinal);
        const cheminOeuvreFinal = path.join(cheminOeuvres, nomOeuvreFinal);

        fs.renameSync(cheminOeuvre, cheminOeuvreFinal);

        if (cartel) {
          const cheminCartel = path.join(cheminCartels, cartel);
          const nomCartelFinal = nomOeuvreFinal.replace(/\.[^.]+$/i, "_CARTEL.jpg");
          if (fs.existsSync(cheminCartel)) {
            fs.copyFileSync(cheminCartel, path.join(cheminCartels, nomCartelFinal));
          }
        }

        renommes += 1;
        resultats.push({ oeuvre, nomOeuvreFinal, success: true });
      } catch (error) {
        console.error("ERREUR CONFIRMATION RENOMMAGE =", error);
        const nomVerification = rendreNomUnique(cheminVerification, oeuvre);
        fs.copyFileSync(cheminOeuvre, path.join(cheminVerification, nomVerification));
        aVerifier += 1;
        resultats.push({ oeuvre, success: false, error: error.message });
      }
    }

    const dateFinRenommage = new Date();
    const tempsRenommageSecondes = Math.round(
      (dateFinRenommage.getTime() - dateDebutRenommage.getTime()) / 1000
    );

    const fichiersAVerifierReels = compterImagesDossier(cheminVerification);
    const photosAnalysees = propositions.length;
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
      tauxReussite,
      dashboardRenommage,
      resultats,
    });
  } catch (error) {
    console.error("ERREUR /renommer-oeuvres/confirmer =", error);
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
      const cartel = trouverCartelLePlusProche(oeuvre, cartels, cheminOeuvres, cheminCartels);

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
          construireNomIntelligentDepuisAnalyse(oeuvre, analyse, cheminOeuvre)
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



app.post("/modifier-analyse-galerie", async (req, res) => {
  try {
    const dossierRacine = req.body?.dossierRacine || DOSSIER_RACINE_DONNEES;
    const dossierDestination = path.join(
      cheminDansRacineDonnees(dossierRacine) || DOSSIER_RACINE_DONNEES,
      "Photos analysées"
    );
    const nomJsonInitial = path.basename(String(req.body?.nomJson || ""));
    const analyse = req.body?.analyse;

    // v69 — estNomJsonFicheGalerie exclut le fichier d'index : une requete portant
    // son nom aurait sinon ete traitee comme une fiche et aurait ecrase l'index.
    if (!nomJsonInitial || !estNomJsonFicheGalerie(nomJsonInitial)) {
      return res.status(400).json({ success: false, error: "Nom du fichier JSON invalide" });
    }

    if (!analyse || typeof analyse !== "object" || Array.isArray(analyse)) {
      return res.status(400).json({ success: false, error: "Analyse invalide" });
    }

    const cheminJsonInitial = path.join(dossierDestination, nomJsonInitial);
    if (!fs.existsSync(cheminJsonInitial)) {
      return res.status(404).json({ success: false, error: "Fichier JSON introuvable : " + nomJsonInitial });
    }

    const contenuExistant = JSON.parse(fs.readFileSync(cheminJsonInitial, "utf-8"));
    const nomPhotoInitial = path.basename(String(contenuExistant.nom_photo_sauvegardee || ""));
    const dejaModifiee = /_MODIFIEE$/i.test(path.basename(nomJsonInitial, path.extname(nomJsonInitial)));
    const baseInitial = path.basename(nomJsonInitial, path.extname(nomJsonInitial));
    const baseFinal = dejaModifiee ? baseInitial : `${baseInitial}_MODIFIEE`;
    const nomJsonFinal = `${baseFinal}.json`;
    const extensionPhoto = path.extname(nomPhotoInitial) || ".jpeg";
    const nomPhotoFinal = `${baseFinal}${extensionPhoto}`;
    const cheminJsonFinal = path.join(dossierDestination, nomJsonFinal);
    const cheminPhotoInitial = nomPhotoInitial ? path.join(dossierDestination, nomPhotoInitial) : "";
    const cheminPhotoFinal = path.join(dossierDestination, nomPhotoFinal);

    if (!dejaModifiee) {
      if (!nomPhotoInitial || !fs.existsSync(cheminPhotoInitial)) {
        return res.status(404).json({
          success: false,
          error: "Photo associée introuvable : " + (nomPhotoInitial || "nom manquant"),
        });
      }

      if (fs.existsSync(cheminJsonFinal) || fs.existsSync(cheminPhotoFinal)) {
        return res.status(409).json({
          success: false,
          error: "Les fichiers renommés existent déjà pour cette analyse.",
        });
      }
    }

    const maintenant = new Date();
    const dateAnalyseIso = maintenant.toISOString();
    const dateAnalyseLocale = formaterDateHeureLocale(maintenant);
    const contenuModifie = {
      ...contenuExistant,
      statut_analyse: "MODIFIEE",
      version_photocartel: VERSION_PHOTOCARTEL,
      date_analyse_iso: dateAnalyseIso,
      date_analyse_locale: dateAnalyseLocale,
      date_modification_iso: dateAnalyseIso,
      date_modification_locale: dateAnalyseLocale,
      nom_photo_sauvegardee: nomPhotoFinal,
      nom_json_sauvegarde: nomJsonFinal,
      analyse,
    };

    if (!dejaModifiee) {
      fs.renameSync(cheminPhotoInitial, cheminPhotoFinal);
    }

    fs.writeFileSync(cheminJsonFinal, JSON.stringify(contenuModifie, null, 2), "utf-8");

    if (!dejaModifiee && cheminJsonInitial !== cheminJsonFinal && fs.existsSync(cheminJsonInitial)) {
      fs.unlinkSync(cheminJsonInitial);
    }

    const tailleJson = verifierFichierEcrit(
      cheminJsonFinal,
      "Fiche JSON modifiée depuis la galerie"
    );

    res.json({
      success: true,
      nomJson: nomJsonFinal,
      nomPhoto: nomPhotoFinal,
      dateAnalyseIso,
      dateAnalyseLocale,
      tailleJson,
      fichiersRenommes: !dejaModifiee,
    });
  } catch (error) {
    console.error("ERREUR /modifier-analyse-galerie =", error);
    res.status(500).json({ success: false, error: error.message });
  }
});



// ————————————————————————————————————————————————————————————————————————
// v69 — INDEX DE LA GALERIE DES PHOTOS ANALYSÉES
//
// Un fichier d'index unique, posé dans le dossier « Photos analysées » lui-même,
// agrège les métadonnées de toutes les fiches. Il suit donc le dossier quand
// celui-ci est copié entre C:\PhotoCartel et DCIM/PhotoCartel.
//
// Le bloc ci-dessous est VOLONTAIREMENT IDENTIQUE, caractère pour caractère,
// dans App.jsx et dans server.js : c'est ce qui garantit qu'un index écrit d'un
// côté est lu à l'identique de l'autre, et que la règle métier (quelles fiches,
// dans quel ordre) est posée des deux côtés et pas d'un seul.
//
// Principe de resynchronisation : lister les noms de fichiers d'un dossier coûte
// infiniment moins cher que d'ouvrir chaque fiche. La comparaison entre les noms
// annoncés par l'index et les noms réellement présents suffit à détecter un
// écart ; seules les fiches absentes de l'index sont réellement lues.
//
// LIMITE ASSUMÉE ET CONNUE : la comparaison porte sur les NOMS. Une fiche
// remplacée sur place par un fichier de même nom et de contenu différent (copie
// manuelle par câble USB par-dessus une fiche existante) n'est pas détectée.
// ————————————————————————————————————————————————————————————————————————

const NOM_FICHIER_INDEX_GALERIE = "_PhotoCartel_index_galerie.json";
const TYPE_DOCUMENT_INDEX_GALERIE = "PHOTOCARTEL_INDEX_GALERIE";
const VERSION_FORMAT_INDEX_GALERIE = 1;
const DOSSIER_DESTINATION_GALERIE_ANDROID = "DCIM / PhotoCartel / Photos analysées";

function estNomFichierIndexGalerie(nomFichier) {
  return (
    String(nomFichier || "").toLowerCase() ===
    NOM_FICHIER_INDEX_GALERIE.toLowerCase()
  );
}

// Un index est lui-même un .json posé dans le dossier : il ne doit JAMAIS être
// lu comme une fiche, sous peine d'apparaître comme une entrée de la galerie.
// v75 — il y a désormais DEUX index dans « Photos analysées » (galerie et
// recherche) : les deux sont exclus ici. Recherche exhaustive faite avant
// correction — les six points de filtrage d'App.jsx et les huit de server.js
// (export CSV, comptage, validation de /modifier-analyse-galerie, lecture de
// l'index, construction de l'index de recherche) passent tous par cette seule
// fonction, il n'existe aucun autre filtre sur « .json » dans les deux fichiers.
function estNomJsonFicheGalerie(nomFichier) {
  const nom = String(nomFichier || "");
  return (
    nom.toLowerCase().endsWith(".json") &&
    !estNomFichierIndexGalerie(nom) &&
    !estNomFichierIndexRecherche(nom)
  );
}

// Forme stockée dans l'index. Volontairement dépourvue de tout ce qui dépend de
// la plateforme (dossierDestination, imageUrl, imageUrlLocale) et de tout ce qui
// est recalculé à chaque lecture (imageExiste) : l'index reste ainsi le même
// fichier, quel que soit le côté qui l'a écrit.
function normaliserFichePourIndexGalerie(fiche) {
  return {
    nomJson: String(fiche?.nomJson || ""),
    nomPhoto: String(fiche?.nomPhoto || ""),
    datePhotoIso: String(fiche?.datePhotoIso || ""),
    datePhotoLocale: String(fiche?.datePhotoLocale || ""),
    dateAnalyseIso: String(fiche?.dateAnalyseIso || ""),
    dateAnalyseLocale: String(fiche?.dateAnalyseLocale || ""),
    analyseModifiee: Boolean(fiche?.analyseModifiee),
    analyse: fiche?.analyse || {},
  };
}

function construireContenuIndexGalerie(fiches, versionApplication) {
  const liste = Array.isArray(fiches) ? fiches : [];
  return {
    type_document: TYPE_DOCUMENT_INDEX_GALERIE,
    version_format_index: VERSION_FORMAT_INDEX_GALERIE,
    version_photocartel: String(versionApplication || ""),
    date_index_iso: new Date().toISOString(),
    nombre_fiches: liste.length,
    fiches: liste.map(normaliserFichePourIndexGalerie),
  };
}

// Renvoie null (et non un tableau vide) dès que l'index est absent, illisible,
// d'un autre type ou d'un format plus ancien : un index non exploitable doit
// conduire à une lecture complète, jamais à une galerie vide.
function lireFichesDepuisContenuIndexGalerie(contenu) {
  if (!contenu || typeof contenu !== "object") return null;
  if (contenu.type_document !== TYPE_DOCUMENT_INDEX_GALERIE) return null;
  if (Number(contenu.version_format_index) !== VERSION_FORMAT_INDEX_GALERIE) return null;
  if (!Array.isArray(contenu.fiches)) return null;
  return contenu.fiches
    .filter((fiche) => fiche && estNomJsonFicheGalerie(fiche.nomJson))
    .map(normaliserFichePourIndexGalerie);
}

// Cœur de la resynchronisation : ce que l'index annonce contre ce que le dossier
// contient réellement. Ne lit aucun fichier.
function comparerIndexEtDossierGalerie(fichesIndex, nomsJsonDossier) {
  const nomsDossier = (Array.isArray(nomsJsonDossier) ? nomsJsonDossier : []).filter(
    estNomJsonFicheGalerie
  );
  const ensembleDossier = new Set(nomsDossier);
  const fiches = Array.isArray(fichesIndex) ? fichesIndex : [];

  const nomsConserves = new Set();
  const fichesConservees = [];
  const nomsSupprimes = [];

  for (const fiche of fiches) {
    const nom = String(fiche?.nomJson || "");
    if (!ensembleDossier.has(nom)) {
      nomsSupprimes.push(nom);
      continue;
    }
    if (nomsConserves.has(nom)) continue;
    nomsConserves.add(nom);
    fichesConservees.push(fiche);
  }

  const nomsAAjouter = nomsDossier.filter((nom) => !nomsConserves.has(nom));

  return { fichesConservees, nomsAAjouter, nomsSupprimes };
}

// imageExiste n'est jamais lu depuis l'index : il est recalculé à partir du même
// listing de noms qui a servi à la comparaison, donc sans aucun accès disque
// supplémentaire, et reste exact des deux côtés.
function appliquerPresencePhotosGalerie(fiches, nomsFichiersDossier) {
  const ensemble = new Set(
    Array.isArray(nomsFichiersDossier) ? nomsFichiersDossier : []
  );
  return (Array.isArray(fiches) ? fiches : []).map((fiche) => ({
    ...fiche,
    imageExiste: Boolean(fiche?.nomPhoto) && ensemble.has(fiche.nomPhoto),
  }));
}

function trierFichesGalerie(fiches) {
  return (Array.isArray(fiches) ? fiches : []).slice().sort((a, b) =>
    String(b?.dateAnalyseIso || b?.nomJson || "").localeCompare(
      String(a?.dateAnalyseIso || a?.nomJson || ""),
      "fr",
      { numeric: true }
    )
  );
}

// Signature du CONTENU STOCKÉ : sert uniquement à décider s'il faut réécrire le
// fichier d'index. Elle ignore délibérément imageExiste, qui n'y est pas stocké.
function signatureIndexGalerie(fiches) {
  return JSON.stringify(
    (Array.isArray(fiches) ? fiches : []).map(normaliserFichePourIndexGalerie)
  );
}

// Signature de CE QUI EST AFFICHÉ : sert à décider s'il faut rafraîchir l'écran.
// Inclut imageExiste, qui change ce que l'utilisateur voit.
function signatureAffichageGalerie(fiches) {
  return (Array.isArray(fiches) ? fiches : [])
    .map(
      (fiche) =>
        `${fiche?.nomJson || ""}::${fiche?.dateAnalyseIso || ""}::${
          fiche?.analyseModifiee ? "1" : "0"
        }::${fiche?.imageExiste ? "1" : "0"}`
    )
    .join("|");
}

// ————————————————————————————————————————————————————————————————————————
// v78 — INDEX DE RECHERCHE, FORMAT 2 (tout DCIM/PhotoCartel)
//
// La v75 n'indexait que Voyages/<voyage>/<ville>/<visite> et les sous-dossiers
// de premier niveau de « Visites à rattacher » : une photo posée à la racine de
// « Visites à rattacher », ou rangée dans un dossier de dossier, n'existait pas
// pour la recherche. Et une photo non analysée ne portait aucun texte.
//
// Le format 2 recense TOUT DCIM/PhotoCartel, à toutes les profondeurs, sauf les
// dossiers techniques de l'application. Il stocke le brut, rien d'interprété :
//   - la liste des dossiers (chemin relatif, nom, parent) ;
//   - pour chaque photo : son nom et son dossier, plus, si elle est analysée,
//     les valeurs d'affichage et les mots de sa fiche COMPLÈTE.
// Tout ce qui s'interprète (mots des noms, année, pays, ville, sujet, héritages
// A/B/C) est calculé par l'app au chargement de l'index, jamais écrit : une règle
// d'interprétation corrigée s'applique donc sans reconstruire l'index.
//
// L'index est posé à la racine de DCIM/PhotoCartel et voyage avec la copie
// entre C: et le téléphone. Un index de format 1 (v75-v77, dans « Photos
// analysées ») est ignoré sans être supprimé.
//
// Ce bloc est VOLONTAIREMENT IDENTIQUE, caractère pour caractère, dans App.jsx
// et dans server.js : un index écrit d'un côté est lu à l'identique de l'autre.
// ————————————————————————————————————————————————————————————————————————

const NOM_FICHIER_INDEX_RECHERCHE = "_PhotoCartel_index_recherche.json";
const TYPE_DOCUMENT_INDEX_RECHERCHE = "PHOTOCARTEL_INDEX_RECHERCHE";
const VERSION_FORMAT_INDEX_RECHERCHE = 2;

// Mots ajoutés à la main à un dossier (lecture C). Fichier séparé de l'index :
// reconstruire l'index ne l'efface jamais.
const NOM_FICHIER_MOTS_AJOUTES = "_PhotoCartel_mots_ajoutes.json";
const TYPE_DOCUMENT_MOTS_AJOUTES = "PHOTOCARTEL_MOTS_AJOUTES";
const VERSION_FORMAT_MOTS_AJOUTES = 1;

// Les deux index sont des .json posés dans des dossiers sans être des fiches :
// aucun des deux ne doit jamais être lu comme une entrée de galerie.
function estNomFichierIndexRecherche(nomFichier) {
  return (
    String(nomFichier || "").toLowerCase() ===
    NOM_FICHIER_INDEX_RECHERCHE.toLowerCase()
  );
}

// Dossiers de premier niveau jamais parcourus : copies de travail et
// fichiers techniques de l'application. « Photos analysées » est représenté
// par ses fiches, pas par un parcours de ses images.
const DOSSIERS_HORS_RECHERCHE = [
  "Photos analysées",
  "Paramètres",
  "Logs",
  "Exports",
  "Démonstrations",
  "Photos à analyser",
  "Collecte Photo en cours",
  "Classifications",
];

// Dossiers de premier niveau parcourus, mais dont le nom n'est pas un mot de
// recherche : ce sont des rangements, pas des sujets. Sans cette règle, taper
// « visite » ramènerait toutes les photos de « Visites à rattacher ».
const DOSSIERS_CONTENEURS_RECHERCHE = [
  "Voyages",
  "Visites à rattacher",
  "Œuvres renommées",
  "Oeuvres renommées",
  "Photos analysées",
];

function estDossierHorsRecherche(nomDossier, profondeur) {
  const nom = String(nomDossier || "");
  if (!nom) return true;
  const bas = nom.toLowerCase();
  if (bas.startsWith(".") || bas.startsWith("_")) return true;
  if (
    bas.includes("photocartel-") ||
    bas.includes(".tmp") ||
    bas.endsWith("_tmp") ||
    bas.includes("temporaire")
  ) {
    return true;
  }
  if (Number(profondeur) === 0) {
    return DOSSIERS_HORS_RECHERCHE.some((dossier) => dossier.toLowerCase() === bas);
  }
  return false;
}

function estDossierConteneurRecherche(chemin) {
  const valeur = String(chemin || "");
  if (!valeur || valeur.includes("/")) return false;
  const bas = valeur.toLowerCase();
  return DOSSIERS_CONTENEURS_RECHERCHE.some((dossier) => dossier.toLowerCase() === bas);
}

// Extensions d'image reconnues par l'index de recherche. Même liste que celle
// du flux de renommage, pour que le chemin PC et le chemin Android appliquent
// exactement la même règle.
const EXTENSIONS_IMAGE_INDEX_RECHERCHE = [
  ".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif", ".gif", ".bmp", ".tif", ".tiff",
];

function estFichierImageRecherche(nomFichier) {
  const nom = String(nomFichier || "").toLowerCase();
  return EXTENSIONS_IMAGE_INDEX_RECHERCHE.some((extension) => nom.endsWith(extension));
}

// Normalisation v75 conservée (accents retirés, minuscules, espaces réduits).
function normaliserTexteRecherchePhotoCartel(texte) {
  return String(texte || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

// v78 — DÉCOUPE EN MOTS, QUEL QUE SOIT LE SÉPARATEUR.
// Les noms mêlent « _ », « - », « - » entouré d'espaces, virgule, point,
// apostrophe, guillemets, et des chiffres collés au texte (« Cloître1 »,
// « gennaio2019DEF2 »). Tout ce qui n'est ni lettre ni chiffre devient un
// espace, et lettres et chiffres collés sont détachés. La saisie passe par
// EXACTEMENT la même découpe : « Notre-Dame » tapé avec ou sans tiret retrouve
// « Notre-Dame-de-l'Assomption », quel que soit le séparateur du jour.
function decouperEnMotsPhotoCartel(texte) {
  const valeur = String(texte || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .replace(/ß/g, "ss")
    .replace(/ø/g, "o")
    .replace(/ł/g, "l")
    .replace(/đ/g, "d")
    .replace(/ı/g, "i")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/([a-z])(\d)/g, "$1 $2")
    .replace(/(\d)([a-z])/g, "$1 $2")
    .trim();
  return valeur ? valeur.split(" ") : [];
}

function nomSansExtensionRecherche(nomFichier) {
  const nom = String(nomFichier || "");
  const position = nom.lastIndexOf(".");
  return position > 0 ? nom.slice(0, position) : nom;
}

function lireValeurAnalyseParChemin(analyse, chemin) {
  const segments = String(chemin || "").split(".");
  let courant = analyse;
  for (let i = 0; i < segments.length; i += 1) {
    if (!courant || typeof courant !== "object") return "";
    courant = courant[segments[i]];
  }
  if (courant === null || courant === undefined) return "";
  if (Array.isArray(courant)) {
    return courant.map((element) => String(element || "")).join(" ");
  }
  if (typeof courant === "object") return "";
  return String(courant);
}

// Valeur d'affichage NON normalisée : le résultat doit montrer « Rembrandt »,
// pas « rembrandt ». Premier chemin renseigné gagne.
function premiereValeurAnalyseRecherche(analyse, chemins) {
  for (let i = 0; i < chemins.length; i += 1) {
    const valeur = lireValeurAnalyseParChemin(analyse, chemins[i]).trim();
    if (valeur) return valeur;
  }
  return "";
}

// v78 — la fiche COMPLÈTE est cherchable (périmètre validé), description
// détaillée comprise : tous les textes du bloc « analyse », à toute profondeur.
function collecterTextesAnalyseRecherche(valeur, morceaux, profondeur) {
  if (profondeur > 8 || valeur === null || valeur === undefined) return;
  if (typeof valeur === "string") {
    if (valeur) morceaux.push(valeur);
    return;
  }
  if (Array.isArray(valeur)) {
    for (let i = 0; i < valeur.length; i += 1) {
      collecterTextesAnalyseRecherche(valeur[i], morceaux, profondeur + 1);
    }
    return;
  }
  if (typeof valeur === "object") {
    const cles = Object.keys(valeur);
    for (let i = 0; i < cles.length; i += 1) {
      collecterTextesAnalyseRecherche(valeur[cles[i]], morceaux, profondeur + 1);
    }
  }
}

// Mots de la fiche, découpés et sans doublon : c'est ce qui borne le poids de
// l'index, une même valeur revenant dans plusieurs champs d'une même fiche.
function construireMotsFicheRecherche(analyse) {
  const morceaux = [];
  collecterTextesAnalyseRecherche(analyse || {}, morceaux, 0);
  const vus = new Set();
  const mots = [];
  const tous = decouperEnMotsPhotoCartel(morceaux.join(" "));
  for (let i = 0; i < tous.length; i += 1) {
    const mot = tous[i];
    if (!mot || vus.has(mot)) continue;
    vus.add(mot);
    mots.push(mot);
  }
  return mots.join(" ");
}

// Construction de l'index stocké, à partir de ce qu'un parcours a LISTÉ :
//   parcours.dossiers : chemins relatifs (« Visites à rattacher/Valparaiso »)
//   parcours.photos   : { nom, dossier } (dossier = chemin relatif, "" = racine)
//   fiches            : fiches lues dans « Photos analysées »
// Une fiche est rattachée à SA photo d'origine par son nom (le nom de la photo
// telle qu'elle a été prise, conservé dans la fiche). Une seule photo est
// rattachée par fiche : deux IMG_0001 dans deux visites restent deux photos.
function construireContenuIndexRecherche(parcours, fiches, versionApplication) {
  const cheminsListes = Array.isArray(parcours?.dossiers) ? parcours.dossiers : [];
  const photosListees = Array.isArray(parcours?.photos) ? parcours.photos : [];
  const listeFiches = Array.isArray(fiches) ? fiches : [];

  const dossiers = [];
  const positionParChemin = new Map();
  const ajouterDossier = (chemin) => {
    const valeur = String(chemin || "");
    if (!valeur) return -1;
    if (positionParChemin.has(valeur)) return positionParChemin.get(valeur);
    const coupure = valeur.lastIndexOf("/");
    const parent = coupure > 0 ? ajouterDossier(valeur.slice(0, coupure)) : -1;
    const position = dossiers.length;
    dossiers.push({ chemin: valeur, nom: valeur.slice(coupure + 1), parent });
    positionParChemin.set(valeur, position);
    return position;
  };

  // Tri des chemins : un parent est toujours avant ses enfants, et l'ordre ne
  // dépend pas de l'ordre de parcours (identique PC et téléphone).
  const cheminsTries = Array.from(new Set(cheminsListes.map(String))).sort();
  for (let i = 0; i < cheminsTries.length; i += 1) ajouterDossier(cheminsTries[i]);
  const dossierFiches = ajouterDossier("Photos analysées");

  const photos = [];
  const photosParNom = new Map();
  const listeTriee = photosListees
    .map((photo) => ({ nom: String(photo?.nom || ""), dossier: String(photo?.dossier || "") }))
    .filter((photo) => photo.nom)
    .sort((a, b) =>
      a.dossier === b.dossier ? (a.nom < b.nom ? -1 : a.nom > b.nom ? 1 : 0) : a.dossier < b.dossier ? -1 : 1
    );
  for (let i = 0; i < listeTriee.length; i += 1) {
    const photo = { nom: listeTriee[i].nom, dossier: ajouterDossier(listeTriee[i].dossier) };
    photos.push(photo);
    if (!photosParNom.has(photo.nom)) photosParNom.set(photo.nom, []);
    photosParNom.get(photo.nom).push(photo);
  }

  const fichesTriees = listeFiches
    .filter((fiche) => fiche && fiche.nomJson)
    .slice()
    .sort((a, b) => (String(a.nomJson) < String(b.nomJson) ? -1 : 1));

  for (let i = 0; i < fichesTriees.length; i += 1) {
    const fiche = fichesTriees[i];
    const analyse = fiche.analyse || {};
    const nomOriginal = String(fiche.nomPhotoOriginal || "");
    const candidates = nomOriginal ? photosParNom.get(nomOriginal) || [] : [];
    const origine = candidates.find((photo) => !photo.analysee) || null;

    const valeurs = {
      fichier: `Photos analysées/${String(fiche.nomPhoto || "")}`,
      nomJson: String(fiche.nomJson || ""),
      analysee: true,
      dateIso: String(fiche.datePhotoIso || fiche.dateAnalyseIso || ""),
      titre: premiereValeurAnalyseRecherche(analyse, [
        "identification.nom_ou_titre",
        "titre_fr",
        "identification.objet_principal",
        "objet_principal",
      ]),
      auteur: premiereValeurAnalyseRecherche(analyse, [
        "identification.auteur_createur_architecte",
        "auteur_ou_createur",
      ]),
      institution: premiereValeurAnalyseRecherche(analyse, [
        "localisation.musee_institution",
        "informations_museographiques.musee",
        "musee_ou_institution",
      ]),
      type: premiereValeurAnalyseRecherche(analyse, [
        "identification.type_general",
        "type_detecte",
        "identification.categorie",
        "categorie",
      ]),
      pays: premiereValeurAnalyseRecherche(analyse, [
        "localisation.pays",
        "contexte_photo.pays_photo",
        "pays_photo",
        "pays",
      ]),
      ville: premiereValeurAnalyseRecherche(analyse, [
        "localisation.ville",
        "contexte_photo.ville_photo",
        "ville_photo",
        "ville",
      ]),
      fiche: construireMotsFicheRecherche(analyse),
    };

    if (origine) {
      Object.assign(origine, valeurs);
    } else {
      photos.push({
        nom: nomOriginal || String(fiche.nomPhoto || ""),
        dossier: dossierFiches,
        ...valeurs,
      });
    }
  }

  return {
    type_document: TYPE_DOCUMENT_INDEX_RECHERCHE,
    version_format_index: VERSION_FORMAT_INDEX_RECHERCHE,
    version_photocartel: String(versionApplication || ""),
    date_index_iso: new Date().toISOString(),
    nombre_photos: photos.length,
    nombre_photos_analysees: photos.filter((photo) => photo.analysee).length,
    dossiers,
    photos,
  };
}

// Renvoie null (et non un index vide) dès que l'index est absent, illisible,
// d'un autre type ou d'un autre format : un index inexploitable doit conduire
// à une reconstruction, jamais à une recherche silencieusement vide.
function lireEntreesDepuisContenuIndexRecherche(contenu) {
  if (!contenu || typeof contenu !== "object") return null;
  if (String(contenu.type_document || "") !== TYPE_DOCUMENT_INDEX_RECHERCHE) return null;
  if (Number(contenu.version_format_index) !== VERSION_FORMAT_INDEX_RECHERCHE) return null;
  if (!Array.isArray(contenu.dossiers) || !Array.isArray(contenu.photos)) return null;

  const dossiers = contenu.dossiers.map((dossier) => ({
    chemin: String(dossier?.chemin || ""),
    nom: String(dossier?.nom || ""),
    parent: Number.isInteger(dossier?.parent) ? dossier.parent : -1,
  }));
  const photos = contenu.photos
    .filter((photo) => photo && typeof photo === "object" && photo.nom)
    .map((photo) => ({
      nom: String(photo.nom || ""),
      dossier:
        Number.isInteger(photo.dossier) && photo.dossier >= 0 && photo.dossier < dossiers.length
          ? photo.dossier
          : -1,
      fichier: String(photo.fichier || ""),
      nomJson: String(photo.nomJson || ""),
      analysee: Boolean(photo.analysee),
      dateIso: String(photo.dateIso || ""),
      titre: String(photo.titre || ""),
      auteur: String(photo.auteur || ""),
      institution: String(photo.institution || ""),
      type: String(photo.type || ""),
      pays: String(photo.pays || ""),
      ville: String(photo.ville || ""),
      fiche: String(photo.fiche || ""),
    }));

  return {
    dateIndexIso: String(contenu.date_index_iso || ""),
    dossiers,
    photos,
  };
}

// Signature de ce qui a été LISTÉ : sert à savoir si une mise à jour a changé
// quelque chose, sans comparer les textes.
function signatureIndexRecherche(index) {
  if (!index) return "";
  const dossiers = (index.dossiers || []).map((dossier) => dossier.chemin).join("|");
  const photos = (index.photos || [])
    .map((photo) => `${photo.dossier}:${photo.nom}:${photo.nomJson || ""}`)
    .join("|");
  return `${dossiers}#${photos}`;
}

// Mots ajoutés : { "<chemin du dossier>": ["Rembrandt", ...] }. Toute entrée
// illisible est ignorée, jamais propagée.
function lireDepuisContenuMotsAjoutes(contenu) {
  const resultat = {};
  if (!contenu || typeof contenu !== "object") return resultat;
  if (String(contenu.type_document || "") !== TYPE_DOCUMENT_MOTS_AJOUTES) return resultat;
  const dossiers = contenu.dossiers && typeof contenu.dossiers === "object" ? contenu.dossiers : {};
  const chemins = Object.keys(dossiers);
  for (let i = 0; i < chemins.length; i += 1) {
    const chemin = String(chemins[i] || "");
    const liste = Array.isArray(dossiers[chemin]) ? dossiers[chemin] : [];
    const mots = [];
    for (let j = 0; j < liste.length; j += 1) {
      const mot = String(liste[j] || "").replace(/\s+/g, " ").trim().slice(0, 80);
      if (mot && !mots.some((existant) => existant.toLowerCase() === mot.toLowerCase())) {
        mots.push(mot);
      }
    }
    if (chemin && mots.length > 0) resultat[chemin] = mots;
  }
  return resultat;
}

function construireContenuMotsAjoutes(motsParDossier, versionApplication) {
  return {
    type_document: TYPE_DOCUMENT_MOTS_AJOUTES,
    version_format: VERSION_FORMAT_MOTS_AJOUTES,
    version_photocartel: String(versionApplication || ""),
    date_modification_iso: new Date().toISOString(),
    dossiers: lireDepuisContenuMotsAjoutes({
      type_document: TYPE_DOCUMENT_MOTS_AJOUTES,
      dossiers: motsParDossier || {},
    }),
  };
}
function estAnalyseGalerieModifiee(contenu = {}, nomJson = "", nomPhoto = "") {
  const statut = String(contenu?.statut_analyse || "").trim().toUpperCase();
  const typeDocument = String(contenu?.type_document || "").trim().toUpperCase();
  const noms = `${nomJson} ${nomPhoto} ${contenu?.nom_json_sauvegarde || ""} ${contenu?.nom_photo_sauvegardee || ""}`.toUpperCase();

  return (
    statut === "MODIFIEE" ||
    typeDocument === "PHOTO_ANALYSEE_MODIFIEE" ||
    noms.includes("_PHOTO_ANALYSEE_MODIFIEE")
  );
}

// v69 — Lecture d'une fiche de la galerie côté serveur. Miroir exact de
// construireFicheGalerieDepuisContenuJson() d'App.jsx : mêmes champs, mêmes replis.
function lireFicheGalerieServeur(dossierDestination, nomJson) {
  try {
    const contenu = JSON.parse(
      fs.readFileSync(path.join(dossierDestination, nomJson), "utf-8")
    );
    const nomPhoto =
      contenu.nom_photo_sauvegardee ||
      path.basename(nomJson, path.extname(nomJson)) + ".jpeg";

    return {
      nomJson,
      nomPhoto,
      datePhotoIso: contenu.date_photo_iso || "",
      datePhotoLocale: contenu.date_photo_locale || "",
      dateAnalyseIso: contenu.date_analyse_iso || contenu.date_modification_iso || "",
      dateAnalyseLocale:
        contenu.date_analyse_locale || contenu.date_modification_locale || "",
      analyseModifiee: estAnalyseGalerieModifiee(contenu, nomJson, nomPhoto),
      analyse: contenu.analyse || {},
      // v75 — nom de la photo d'origine, employé pour rattacher la fiche à sa
      // visite par comparaison de noms. Non stocké dans l'index de la galerie.
      nomPhotoOriginal: contenu.nom_photo_original || "",
    };
  } catch (error) {
    console.error("ERREUR LECTURE JSON GALERIE =", nomJson, error);
    return null;
  }
}

function lireIndexGalerieServeur(dossierDestination) {
  try {
    const cheminIndex = path.join(dossierDestination, NOM_FICHIER_INDEX_GALERIE);
    if (!fs.existsSync(cheminIndex)) return null;
    return lireFichesDepuisContenuIndexGalerie(
      JSON.parse(fs.readFileSync(cheminIndex, "utf-8"))
    );
  } catch (error) {
    // Index absent, illisible ou d'un autre format : lecture complète.
    console.warn("Index de la galerie non exploitable :", error.message);
    return null;
  }
}

function ecrireIndexGalerieServeur(dossierDestination, fiches) {
  try {
    fs.writeFileSync(
      path.join(dossierDestination, NOM_FICHIER_INDEX_GALERIE),
      JSON.stringify(
        construireContenuIndexGalerie(fiches, VERSION_PHOTOCARTEL),
        null,
        2
      ),
      "utf-8"
    );
    return true;
  } catch (error) {
    // L'index est une optimisation : son écriture ne doit jamais faire échouer
    // la réponse de la galerie.
    console.warn("Écriture de l'index de la galerie impossible :", error.message);
    return false;
  }
}


// ————————————————————————————————————————————————————————————————————————
// v75 — INDEX DE RECHERCHE, CHEMIN PC
//
// Même fichier d'index que celui écrit par le téléphone, au même format et lu
// par le même bloc de code : un index construit d'un côté est exploitable de
// l'autre. Le dossier reste l'unique source ; l'index n'est qu'une avance.
// ————————————————————————————————————————————————————————————————————————

// ————————————————————————————————————————————————————————————————————————
// v78 — RECHERCHE CÔTÉ PC : parcours complet de la racine (toutes profondeurs,
// dossiers techniques exclus par estDossierHorsRecherche, la même règle que le
// téléphone), index posé à la racine (il voyage avec la copie vers DCIM),
// mots ajoutés (C) dans un fichier durable à la racine, et service des photos
// trouvées, miniature comprise.
// ————————————————————————————————————————————————————————————————————————

function racineRechercheDepuisRequete(dossierRacineRecu) {
  return cheminDansRacineDonnees(dossierRacineRecu || DOSSIER_RACINE_DONNEES) || DOSSIER_RACINE_DONNEES;
}

function parcourirRacineRechercheServeur(racineEffective) {
  const dossiers = [];
  const photos = [];
  const parcourir = (cheminAbsolu, cheminRelatif, profondeur) => {
    let entrees = [];
    try {
      entrees = fs.readdirSync(cheminAbsolu, { withFileTypes: true });
    } catch (error) {
      return;
    }
    for (const entree of entrees) {
      if (entree.isDirectory()) {
        if (estDossierHorsRecherche(entree.name, profondeur)) continue;
        const relatifEnfant = cheminRelatif ? `${cheminRelatif}/${entree.name}` : entree.name;
        dossiers.push(relatifEnfant);
        parcourir(path.join(cheminAbsolu, entree.name), relatifEnfant, profondeur + 1);
      } else if (entree.isFile() && estFichierImageRecherche(entree.name)) {
        photos.push({ nom: entree.name, dossier: cheminRelatif });
      }
    }
  };
  parcourir(racineEffective, "", 0);
  return { dossiers, photos };
}

function construireIndexRechercheServeur(racineEffective) {
  const dossierFiches = path.join(racineEffective, "Photos analysées");
  const fiches = [];
  if (fs.existsSync(dossierFiches)) {
    for (const nomJson of fs.readdirSync(dossierFiches).filter(estNomJsonFicheGalerie)) {
      const fiche = lireFicheGalerieServeur(dossierFiches, nomJson);
      if (fiche) fiches.push(fiche);
    }
  }
  return construireContenuIndexRecherche(
    parcourirRacineRechercheServeur(racineEffective),
    fiches,
    VERSION_PHOTOCARTEL
  );
}

function lireJsonRacineRecherche(racineEffective, nomFichier) {
  try {
    const chemin = path.join(racineEffective, nomFichier);
    if (!fs.existsSync(chemin)) return null;
    return JSON.parse(fs.readFileSync(chemin, "utf-8"));
  } catch (error) {
    return null;
  }
}

function ecrireJsonRacineRecherche(racineEffective, nomFichier, contenu) {
  try {
    if (!fs.existsSync(racineEffective)) return false;
    fs.writeFileSync(path.join(racineEffective, nomFichier), JSON.stringify(contenu), "utf-8");
    return true;
  } catch (error) {
    console.warn(`Écriture de ${nomFichier} impossible :`, error.message);
    return false;
  }
}

app.get("/index-recherche", async (req, res) => {
  try {
    const racineEffective = racineRechercheDepuisRequete(req.query.dossierRacine);
    const reconstruire = String(req.query.reconstruire || "") === "1";
    let index = reconstruire ? null : lireJsonRacineRecherche(racineEffective, NOM_FICHIER_INDEX_RECHERCHE);

    if (!lireEntreesDepuisContenuIndexRecherche(index)) {
      const debut = Date.now();
      index = construireIndexRechercheServeur(racineEffective);
      ecrireJsonRacineRecherche(racineEffective, NOM_FICHIER_INDEX_RECHERCHE, index);
      console.log(
        `INDEX RECHERCHE : ${index.nombre_photos} photo(s), ${index.dossiers.length} dossier(s) en ${Date.now() - debut} ms`
      );
    }

    const motsAjoutes = lireJsonRacineRecherche(racineEffective, NOM_FICHIER_MOTS_AJOUTES);
    return res.json({ success: true, version: VERSION_PHOTOCARTEL, index, motsAjoutes });
  } catch (error) {
    console.error("ERREUR /index-recherche =", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/mots-ajoutes-recherche", async (req, res) => {
  try {
    const racineEffective = racineRechercheDepuisRequete(req.body?.dossierRacine);
    const contenu = construireContenuMotsAjoutes(
      lireDepuisContenuMotsAjoutes(req.body?.contenu),
      VERSION_PHOTOCARTEL
    );
    if (!ecrireJsonRacineRecherche(racineEffective, NOM_FICHIER_MOTS_AJOUTES, contenu)) {
      return res.status(500).json({ success: false, error: "Le fichier des mots ajoutés n’a pas pu être écrit." });
    }
    return res.json({ success: true, motsAjoutes: contenu });
  } catch (error) {
    console.error("ERREUR /mots-ajoutes-recherche =", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Photo trouvée par la recherche : chemin RELATIF à la racine, jamais absolu,
// et jamais hors de la racine. Avec « taille », une miniature JPEG est servie.
app.get("/photo-recherche", async (req, res) => {
  try {
    const racineEffective = path.resolve(racineRechercheDepuisRequete(req.query.dossierRacine));
    const relatif = String(req.query.fichier || "").replace(/\\/g, "/");
    const segments = relatif.split("/").filter(Boolean);
    if (segments.length === 0 || segments.some((segment) => segment === "." || segment === "..")) {
      return res.status(400).json({ success: false, error: "Photo non valide." });
    }
    const cheminPhoto = path.resolve(racineEffective, ...segments);
    if (!cheminEstDansRacinePhotoCartel(cheminPhoto, racineEffective)) {
      return res.status(403).json({ success: false, error: "Photo hors de PhotoCartel." });
    }
    if (!fs.existsSync(cheminPhoto) || !fs.statSync(cheminPhoto).isFile() || !estFichierImageRecherche(cheminPhoto)) {
      return res.status(404).json({ success: false, error: "Photo introuvable." });
    }

    const taille = Number.parseInt(req.query.taille, 10) || 0;
    res.setHeader("Cache-Control", "private, max-age=86400");
    if (!taille) return res.sendFile(cheminPhoto);

    const sharpPhotoCartel = await obtenirSharpPhotoCartel();
    if (!sharpPhotoCartel) return res.sendFile(cheminPhoto);
    const miniature = await sharpPhotoCartel(cheminPhoto)
      .rotate()
      .resize(Math.min(720, Math.max(120, taille)), Math.min(720, Math.max(120, taille)), { fit: "inside" })
      .jpeg({ quality: 78 })
      .toBuffer();
    res.setHeader("Content-Type", "image/jpeg");
    return res.end(miniature);
  } catch (error) {
    console.error("ERREUR /photo-recherche =", error.message);
    return res.status(415).json({ success: false, error: "Photo illisible." });
  }
});

app.get("/photos-analysees", async (req, res) => {
  try {
    const dossierRacine = req.query.dossierRacine || DOSSIER_RACINE_DONNEES;
    const racineEffective = cheminDansRacineDonnees(dossierRacine) || DOSSIER_RACINE_DONNEES;
    const dossierDestination = path.join(
      racineEffective,
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

    // v69 — un seul listing du dossier : il sert à la fois à la comparaison avec
    // l'index et au calcul de imageExiste (qui coûtait jusqu'ici un existsSync
    // par fiche). Le fichier d'index est exclu des fiches par estNomJsonFicheGalerie.
    const nomsFichiers = fs.readdirSync(dossierDestination);
    const nomsJson = nomsFichiers.filter(estNomJsonFicheGalerie);

    const fichesIndex = lireIndexGalerieServeur(dossierDestination);
    const { fichesConservees, nomsAAjouter } = comparerIndexEtDossierGalerie(
      fichesIndex,
      nomsJson
    );

    const fichesAjoutees = [];

    for (const nomJson of nomsAAjouter) {
      const fiche = lireFicheGalerieServeur(dossierDestination, nomJson);
      if (fiche) fichesAjoutees.push(fiche);
    }

    const fiches = trierFichesGalerie(
      appliquerPresencePhotosGalerie(
        [...fichesConservees, ...fichesAjoutees],
        nomsFichiers
      )
    );

    if (signatureIndexGalerie(fiches) !== signatureIndexGalerie(fichesIndex)) {
      ecrireIndexGalerieServeur(dossierDestination, fiches);
    }

    // dossierDestination et imageUrl dépendent de la machine : ils ne sont pas
    // stockés dans l'index, ils sont reconstruits ici à chaque réponse.
    const photos = fiches.map((fiche) => ({
      ...fiche,
      dossierDestination,
      imageUrl: `/photo-analysee/${encodeURIComponent(
        fiche.nomPhoto
      )}?dossierRacine=${encodeURIComponent(dossierRacine)}`,
    }));

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
      cheminDansRacineDonnees(dossierRacine) || DOSSIER_RACINE_DONNEES,
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

  // v69 — le fichier d'index est un .json du dossier : il ne doit jamais produire
  // une ligne d'export.
  const fichiersJson = fs
    .readdirSync(dossierDestination)
    .filter(estNomJsonFicheGalerie)
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
      cheminDansRacineDonnees(dossierRacine) || DOSSIER_RACINE_DONNEES,
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
            .filter(estNomJsonFicheGalerie).length
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
      cheminDansRacineDonnees(dossierRacine) || DOSSIER_RACINE_DONNEES,
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
// v64 — filet de sécurité "mode démonstration" supprimé : confirmé code mort. Le client
// (App.jsx) n'appelle jamais /mode-demonstration/ping, et lancer/exporter sont toujours
// appelés en POST, déjà interceptés par les app.post déclarés plus haut (ligne ~1522) qui
// répondent en premier. Ce middleware ne pouvait donc jamais s'exécuter dans un flux réel,
// et sa branche ping répondait de toute façon une version "v34" codée en dur, obsolète.

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

const PORT = process.env.PORT || 3002;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`PhotoCartel API démarrée sur le port ${PORT}`);
  console.log("Dossier racine données PhotoCartel =", DOSSIER_RACINE_DONNEES);

  // v84 — le travailleur OCR est préparé au démarrage : ni son chargement,
  // ni son échec éventuel ne doivent être payés pendant un renommage.
  obtenirTravailleurOcrPhotoCartel().catch(() => {});
});