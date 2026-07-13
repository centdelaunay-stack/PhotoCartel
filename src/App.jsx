import { useState, useRef } from "react";
import Tesseract from "tesseract.js";
import cv from "@techstark/opencv-js";


const LOGO_PHOTOCARTEL_SRC =
  "data:image/webp;base64,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";

const VERSION = {
  numero: "v35.1",
  descriptif: "galerie des photos analysées - intégration visuelle",
  date: "2026-07-13",
  build: 1,
};

const VERSION_COMPLETE = `${VERSION.numero} - ${VERSION.descriptif}`;

// PhotoCartel v35.1 — restauration de la galerie des photos analysées, nouvelle fiche résultat et barre dédiée non connectée.
// La photo est d’abord enregistrée dans « Photos à analyser », puis l’analyse est lancée manuellement.

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

const DOSSIER_METIER_VOYAGES = "Voyages";

function App() {
  console.log(`APP PRINCIPALE - PhotoCartel ${VERSION_COMPLETE} cloud-ready`);

  const estServeurLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.startsWith("192.168.") ||
    window.location.hostname.startsWith("10.") ||
    window.location.hostname.startsWith("172.");

  const API_BASE = (
    import.meta.env.VITE_PHOTOCARTEL_API_BASE ||
    (estServeurLocal
      ? `http://${window.location.hostname}:3001`
      : "https://photocartel.onrender.com")
  ).replace(/\/$/, "");

  async function lireReponseJsonPhotoCartel(response, contexte) {
    const texte = await response.text();

    try {
      return texte ? JSON.parse(texte) : {};
    } catch (error) {
      const extrait = texte.slice(0, 120).replace(/\s+/g, " ");
      throw new Error(
        contexte +
          " : réponse serveur non JSON. " +
          "Vérifie que le serveur PhotoCartel lancé est bien le server.js v20.3. " +
          "Début réponse reçue : " +
          extrait
      );
    }
  }

  const [oeuvreFileName, setOeuvreFileName] = useState("");
  const [oeuvreImageUrl, setOeuvreImageUrl] = useState("");

  const [cartelImageUrl, setCartelImageUrl] = useState("");
  const [cartelText, setCartelText] = useState("");
  const [cartelRecadreUrl, setCartelRecadreUrl] = useState("");

  const [oeuvreFile, setOeuvreFile] = useState(null);
  const [cartelFile, setCartelFile] = useState(null);

  const [analyseMusee, setAnalyseMusee] = useState(null);
  const [nomEdite, setNomEdite] = useState("");
  const [nomFinal, setNomFinal] = useState("");

  const [voyage, setVoyage] = useState(
  localStorage.getItem("photoCartelVoyageActif") || ""
);

const [villeVisite, setVilleVisite] = useState(
  localStorage.getItem("photoCartelVilleActive") || ""
);

const [lieuVisite, setLieuVisite] = useState(
  localStorage.getItem("photoCartelLieuActif") || ""
);


  const [dossierRacine, setDossierRacine] = useState("C:\\PhotoCartel");


  const [modeCreationVoyage, setModeCreationVoyage] = useState(false);
const [modeGestionVoyage, setModeGestionVoyage] = useState(false);
const [nomNouveauVoyage, setNomNouveauVoyage] = useState("");


const [typeVisite, setTypeVisite] = useState(
  localStorage.getItem("photoCartelTypeVisiteActif") || ""
);
const [typeNouvelleVisite, setTypeNouvelleVisite] = useState("Musée");

const [visiteActive, setVisiteActive] = useState(null);
const [modeCreationVisite, setModeCreationVisite] = useState(false);
const [modeAucuneVisite, setModeAucuneVisite] = useState(false);
const [contexteCreationVisite, setContexteCreationVisite] = useState("nouvelle");

const [villeNouvelleVisite, setVilleNouvelleVisite] = useState("");
const [lieuNouvelleVisite, setLieuNouvelleVisite] = useState("");

const CLE_DERNIERE_VILLE_PAR_VOYAGE = "photoCartelDerniereVilleParVoyage";

function lireDernieresVillesParVoyage() {
  try {
    const valeur = JSON.parse(localStorage.getItem(CLE_DERNIERE_VILLE_PAR_VOYAGE) || "{}");
    return valeur && typeof valeur === "object" && !Array.isArray(valeur) ? valeur : {};
  } catch (error) {
    console.warn("Mémoire des villes par voyage illisible :", error);
    return {};
  }
}

function derniereVilleDuVoyage(nomVoyage) {
  const cleVoyage = String(nomVoyage || "").trim();
  if (!cleVoyage) return "";
  return String(lireDernieresVillesParVoyage()[cleVoyage] || "").trim();
}

function memoriserDerniereVilleDuVoyage(nomVoyage, nomVille) {
  const cleVoyage = String(nomVoyage || "").trim();
  const ville = String(nomVille || "").trim();
  if (!cleVoyage || !ville || ville === "Ville non renseignée") return;

  const villes = lireDernieresVillesParVoyage();
  villes[cleVoyage] = ville;
  localStorage.setItem(CLE_DERNIERE_VILLE_PAR_VOYAGE, JSON.stringify(villes));
}

const ouvrirFenetreCreationVisite = (contexte = "nouvelle") => {
  setContexteCreationVisite(contexte);
  // v31 : une visite structurée propose la dernière ville utilisée dans le voyage actif.
  // Cette valeur reste une aide à la saisie et ne devient officielle qu'après validation.
  setVilleNouvelleVisite(derniereVilleDuVoyage(voyage));
  setLieuNouvelleVisite("");
  setTypeNouvelleVisite(typeVisite || "Musée");
  setModeAucuneVisite(false);
  setModeCreationVisite(true);
};

const annulerCreationVisite = () => {
  setModeCreationVisite(false);
  setLieuNouvelleVisite("");
  // Important : Annuler ne clôture pas la visite en cours.
};


const [statutVisite, setStatutVisite] = useState(
  localStorage.getItem("photoCartelStatutVisite") || "EN_COURS"
);
const [dateFinVisite, setDateFinVisite] = useState(null);
const [dossierTampon, setDossierTampon] = useState(
  localStorage.getItem("photoCartelDossierTamponActif") || ""
);
const [cheminTamponActif, setCheminTamponActif] = useState(
  localStorage.getItem("photoCartelCheminTamponActif") || ""
);
 


  const [derniereActionVisite, setDerniereActionVisite] = useState("");
  const [photosCollectees, setPhotosCollectees] = useState(() => {
  const valeurStockee = Number(localStorage.getItem("photoCartelPhotosCollectees") || 0);
  return Number.isFinite(valeurStockee) ? valeurStockee : 0;
});
  const [derniereVisite, setDerniereVisite] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("photoCartelDerniereVisite") || "null");
    } catch (error) {
      return null;
    }
  });

  const [dossierImport, setDossierImport] = useState("");
  const [fichiersImport, setFichiersImport] = useState([]);
  const [nombrePhotos, setNombrePhotos] = useState(0);
  const [classificationEnCours, setClassificationEnCours] = useState(false);
  const [resultatClassification, setResultatClassification] = useState(null);
  const [messageImport, setMessageImport] = useState("");


  const [dossierRenommage, setDossierRenommage] = useState("");
const [fichiersRenommage, setFichiersRenommage] = useState([]);
const [nombrePhotosRenommage, setNombrePhotosRenommage] = useState(0);
const [messageRenommage, setMessageRenommage] = useState("");

const [cheminRenommagePrepare, setCheminRenommagePrepare] = useState("");

const [renommagePret, setRenommagePret] = useState(false);


const [dashboardRenommage, setDashboardRenommage] = useState(null);
const [renommageFinalEnCours, setRenommageFinalEnCours] = useState(false);
const [renommageFinalTermine, setRenommageFinalTermine] = useState(false);


const cheminRenommagePrepareRef = useRef("");
const inputPrendrePhotosRef = useRef(null);
const inputActualiserPhotosRef = useRef(null);
const inputAnalyserPhotoCameraRef = useRef(null);
const inputAnalyserPhotoRef = useRef(null);

const [analysePhotoFile, setAnalysePhotoFile] = useState(null);
const [analysePhotoUrl, setAnalysePhotoUrl] = useState("");
const [analysePhotoResultat, setAnalysePhotoResultat] = useState(null);
const [analysePhotoEnCours, setAnalysePhotoEnCours] = useState(false);
const [modeAnalysePhoto, setModeAnalysePhoto] = useState(false);
const [modeChoixActionAnalysePhoto, setModeChoixActionAnalysePhoto] = useState(false);
const [modeAutorisationStockageAnalyse, setModeAutorisationStockageAnalyse] = useState(false);
const [autorisationStockageAnalyseEnCours, setAutorisationStockageAnalyseEnCours] = useState(false);
const [photoPleinEcranUrl, setPhotoPleinEcranUrl] = useState("");
const [messageAnalysePhoto, setMessageAnalysePhoto] = useState("");
const [analysePhotoSauvegardeEnCours, setAnalysePhotoSauvegardeEnCours] = useState(false);
const [analysePhotoSauvegardee, setAnalysePhotoSauvegardee] = useState(false);
const [dateHeurePhotoAnalyse, setDateHeurePhotoAnalyse] = useState("");
const [dateHeureAnalyseIA, setDateHeureAnalyseIA] = useState("");
const analysePhotoSessionActiveRef = useRef(false);
const analysePhotoOrigineRef = useRef("");
const analysePhotoAbortControllerRef = useRef(null);
const [analysePhotoEdition, setAnalysePhotoEdition] = useState(false);
const [analysePhotoModifiee, setAnalysePhotoModifiee] = useState(false);
const analysePhotoAvantEditionRef = useRef(null);
const analysePhotoModifieeAvantEditionRef = useRef(false);
const autorisationStockageHandleCandidatRef = useRef(null);
// v34.8 : ces handles doivent survivre aux re-rendus React. Des variables locales `let`
// étaient réinitialisées à chaque changement d’état, ce qui forçait une nouvelle demande.
const photoCartelHandleDcimSessionRef = useRef(null);
const photoCartelHandleRacineAndroidSessionRef = useRef(null);
const [analysePhotoNomAAnalyser, setAnalysePhotoNomAAnalyser] = useState("");
const [analysePhotoNomAnalysee, setAnalysePhotoNomAnalysee] = useState("");
const [analysePhotoNomJson, setAnalysePhotoNomJson] = useState("");
const [analysePhotoTimestampInitial, setAnalysePhotoTimestampInitial] = useState("");

const [modeGalerieAnalyses, setModeGalerieAnalyses] = useState(false);
const [galerieAnalyses, setGalerieAnalyses] = useState([]);
const [galerieIndex, setGalerieIndex] = useState(0);
const [galerieChargement, setGalerieChargement] = useState(false);
const [messageGalerieAnalyses, setMessageGalerieAnalyses] = useState("");
const galerieTouchStartXRef = useRef(null);
const galerieTouchStartYRef = useRef(null);

const [actualisationEnCours, setActualisationEnCours] = useState(false);
const [messageActualisation, setMessageActualisation] = useState("");
const [messageArborescenceAndroid, setMessageArborescenceAndroid] = useState("");
const messageArborescenceTimeoutRef = useRef(null);
const [messageTestStockageAndroid, setMessageTestStockageAndroid] = useState("");
const [testStockageAndroidEnCours, setTestStockageAndroidEnCours] = useState(false);
const [derniereActualisation, setDerniereActualisation] = useState(null);

const [modeParametres, setModeParametres] = useState(false);
const [modeDemonstrationActif, setModeDemonstrationActif] = useState(
  localStorage.getItem("photoCartelModeDemonstrationActif") === "true"
);
const [cheminDossierModeDemonstration, setCheminDossierModeDemonstration] = useState(
  localStorage.getItem("photoCartelCheminModeDemonstration") || ""
);
const [modeDemonstrationEnCours, setModeDemonstrationEnCours] = useState(false);

const afficherMessageDiscretArborescence = (message, duree = 5000) => {
  // v30.6 : règle générale PhotoCartel — les bandeaux de confirmation de l’accueil restent visibles 5 secondes.
  // Plus de alert() après création réussie d'un voyage, d'une visite ou d'une fin de voyage.
  if (messageArborescenceTimeoutRef.current) {
    clearTimeout(messageArborescenceTimeoutRef.current);
  }

  setMessageArborescenceAndroid(message);

  messageArborescenceTimeoutRef.current = setTimeout(() => {
    setMessageArborescenceAndroid("");
    messageArborescenceTimeoutRef.current = null;
  }, duree);
};

  function cheminVoyageMetier(nomVoyage = voyage) {
    const nom = nettoyerNomDossierLocal(nomVoyage);
    return nom ? `${dossierRacine}\\${DOSSIER_METIER_VOYAGES}\\${nom}` : "";
  }

  function cheminVilleMetier(nomVoyage = voyage, ville = villeVisite) {
    const cheminVoyage = cheminVoyageMetier(nomVoyage);
    const nomVille = nettoyerNomDossierLocal(ville);
    return cheminVoyage && nomVille ? `${cheminVoyage}\\${nomVille}` : "";
  }

  function cheminVisiteMetier(nomVoyage = voyage, ville = villeVisite, lieu = lieuVisite) {
    const cheminVille = cheminVilleMetier(nomVoyage, ville);
    const nomLieu = nettoyerNomDossierLocal(lieu);
    return cheminVille && nomLieu ? `${cheminVille}\\${nomLieu}` : "";
  }

  const cheminCible =
    voyage && villeVisite && lieuVisite
      ? cheminVisiteMetier(voyage, villeVisite, lieuVisite)
      : "";

  const cheminCollecteActif =
    statutVisite === "TERMINEE" && cheminTamponActif
      ? cheminTamponActif
      : cheminCible;

  const dossierRacineAnalyseActif =
    modeDemonstrationActif && cheminDossierModeDemonstration
      ? cheminDossierModeDemonstration
      : dossierRacine;

  function apiPhotoCartelLocale() {
    return (
      API_BASE.includes("localhost") ||
      API_BASE.includes("127.0.0.1") ||
      API_BASE.includes("192.168.") ||
      API_BASE.includes("10.") ||
      API_BASE.includes("172.")
    );
  }

  function dossierRacineEnvoyeAuServeur() {
    // En local PC v28, la racine cible est C:\PhotoCartel.
    // En cloud, on laisse le serveur choisir son dossier de données.
    return apiPhotoCartelLocale() ? dossierRacineAnalyseActif : "";
  }

  const debutVisiteMs = Number(localStorage.getItem("photoCartelDebutVisiteMs") || 0);

  const CLE_HISTORIQUE_VISITES_RANGEMENT = "photoCartelHistoriqueVisitesRangement";

  function lireHistoriqueVisitesRangement() {
    try {
      const valeur = JSON.parse(localStorage.getItem(CLE_HISTORIQUE_VISITES_RANGEMENT) || "[]");
      return Array.isArray(valeur) ? valeur : [];
    } catch (error) {
      console.warn("Historique rangement visites illisible :", error);
      return [];
    }
  }

  function ecrireHistoriqueVisitesRangement(visites) {
    localStorage.setItem(CLE_HISTORIQUE_VISITES_RANGEMENT, JSON.stringify(visites || []));
  }

  function construireIdVisiteRangement({ voyageNom, villeNom, visiteNom, debutMs }) {
    return [voyageNom, villeNom, visiteNom, debutMs].map((valeur) => String(valeur || "")).join("__");
  }

  function ouvrirVisitePourRangement({ voyageNom, villeNom, visiteNom, typeVisiteNom, cheminVisite, debutMs }) {
    const historique = lireHistoriqueVisitesRangement();
    const id = construireIdVisiteRangement({ voyageNom, villeNom, visiteNom, debutMs });

    const existe = historique.some((visite) => visite.id === id);
    if (existe) return;

    historique.push({
      id,
      voyage: voyageNom || "",
      ville: villeNom || "",
      nom: visiteNom || "",
      type: typeVisiteNom || "",
      chemin: cheminVisite || "",
      debutMs,
      finMs: null,
      statutRangement: "ouverte",
      rangee: false,
      photosRangees: 0,
    });

    ecrireHistoriqueVisitesRangement(historique);
  }

  function cloturerVisitePourRangement({ voyageNom, villeNom, visiteNom, finMs, nombrePhotos = 0 }) {
    const historique = lireHistoriqueVisitesRangement();
    let index = -1;

    for (let i = historique.length - 1; i >= 0; i -= 1) {
      const visite = historique[i];
      const memeVisite =
        (!voyageNom || visite.voyage === voyageNom) &&
        (!villeNom || visite.ville === villeNom) &&
        (!visiteNom || visite.nom === visiteNom);

      if (memeVisite && !visite.finMs && !visite.rangee) {
        index = i;
        break;
      }
    }

    if (index >= 0) {
      historique[index] = {
        ...historique[index],
        finMs,
        statutRangement: "cloturee",
        nombrePhotosDeclare: nombrePhotos,
      };
      ecrireHistoriqueVisitesRangement(historique);
    }
  }

  function marquerVisitesRangees(resultatsVisites = []) {
    const historique = lireHistoriqueVisitesRangement();
    const parId = new Map(resultatsVisites.map((visite) => [visite.id, visite]));
    const maintenant = Date.now();

    const prochainHistorique = historique.map((visite) => {
      const resultat = parId.get(visite.id);
      if (!resultat) return visite;

      return {
        ...visite,
        rangee: true,
        statutRangement: "rangee",
        photosRangees: Number(resultat.photosRangees || resultat.deplaces || 0),
        dateRangementMs: maintenant,
      };
    });

    ecrireHistoriqueVisitesRangement(prochainHistorique);
  }

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

  async function obtenirDossierVisiteAndroid(dossierPhotoCartel, visite) {
    const dossierVoyages = await dossierPhotoCartel.getDirectoryHandle(DOSSIER_METIER_VOYAGES, { create: true });
    const dossierVoyage = await dossierVoyages.getDirectoryHandle(nettoyerNomDossierLocal(visite.voyage), { create: true });
    const dossierVille = await dossierVoyage.getDirectoryHandle(
      nettoyerNomDossierLocal(nomDossierVilleStockagePourVisite(visite)),
      { create: true }
    );
    return dossierVille.getDirectoryHandle(nettoyerNomDossierLocal(visite.nom), { create: true });
  }

  async function obtenirNomUniqueAndroid(dossierDestination, nomFichier) {
    const dernierPoint = nomFichier.lastIndexOf(".");
    const base = dernierPoint >= 0 ? nomFichier.slice(0, dernierPoint) : nomFichier;
    const extension = dernierPoint >= 0 ? nomFichier.slice(dernierPoint) : "";
    let candidat = nomFichier;
    let compteur = 2;

    while (true) {
      try {
        await dossierDestination.getFileHandle(candidat, { create: false });
        candidat = `${base} (${compteur})${extension}`;
        compteur += 1;
      } catch (error) {
        if (error?.name === "NotFoundError") return candidat;
        throw error;
      }
    }
  }

  async function rangerPhotosVisitesAndroid(visitesAtraiter) {
    // v30.x : rangement Android en deux temps.
    // 1) lecture/copie depuis Collecte Photo en cours vers les visites ;
    // 2) suppression uniquement après copie réussie.
    // Cela évite l'erreur Android "state cached in an interface object..." observée
    // quand on modifie un dossier pendant son itération.
    const resultatRacineAndroid = await obtenirDossierRacinePhotoCartelAndroid();
    const dossierPhotoCartel = resultatRacineAndroid.dossierPhotoCartel;

    await verifierInfrastructureDansPhotoCartelAndroid(dossierPhotoCartel);

    const dossierCollecte = await dossierPhotoCartel.getDirectoryHandle("Collecte Photo en cours", { create: true });
    const statsParVisite = new Map(visitesAtraiter.map((visite) => [visite.id, { ...visite, photosRangees: 0 }]));
    let photosLues = 0;
    let photosRangees = 0;
    let photosNonAttribuees = 0;
    let suppressionsKo = 0;
    const fichiersACopier = [];
    const resultats = [];

    for await (const [nomFichier, handle] of dossierCollecte.entries()) {
      if (handle.kind !== "file") continue;
      if (!/\.(jpe?g|png|webp)$/i.test(nomFichier)) continue;

      photosLues += 1;
      const visite = trouverVisitePourPhotoRangement(visitesAtraiter, nomFichier);

      if (!visite) {
        photosNonAttribuees += 1;
        resultats.push({ fichier: nomFichier, success: false, raison: "Aucune visite correspondante" });
        continue;
      }

      fichiersACopier.push({ nomFichier, visite });
    }

    const fichiersASupprimer = [];

    for (const item of fichiersACopier) {
      const { nomFichier, visite } = item;

      try {
        const fichierHandle = await dossierCollecte.getFileHandle(nomFichier, { create: false });
        const fichier = await fichierHandle.getFile();
        const dossierDestination = await obtenirDossierVisiteAndroid(dossierPhotoCartel, visite);
        const nomDestination = await obtenirNomUniqueAndroid(dossierDestination, nomFichier);

        await ecrireBlobDansDossierAndroid(dossierDestination, nomDestination, fichier);
        fichiersASupprimer.push(nomFichier);

        photosRangees += 1;
        const stat = statsParVisite.get(visite.id);
        if (stat) stat.photosRangees += 1;

        resultats.push({
          fichier: nomFichier,
          fichierDestination: nomDestination,
          visiteId: visite.id,
          visiteNom: visite.nom,
          success: true,
        });
      } catch (error) {
        photosNonAttribuees += 1;
        resultats.push({
          fichier: nomFichier,
          visiteId: visite.id,
          visiteNom: visite.nom,
          success: false,
          raison: error?.message || String(error),
        });
      }
    }

    for (const nomFichier of fichiersASupprimer) {
      try {
        await dossierCollecte.removeEntry(nomFichier);
      } catch (error) {
        // La copie est déjà faite. On ne bloque pas tout le rangement pour une suppression isolée.
        // Le fichier éventuellement resté en collecte sera ignoré ou recopié avec nom unique au prochain essai.
        suppressionsKo += 1;
        console.warn("Suppression Android non bloquante après copie :", nomFichier, error);
      }
    }

    return {
      success: true,
      mode: "android",
      photosLues,
      photosRangees,
      photosNonAttribuees,
      suppressionsKo,
      visites: Array.from(statsParVisite.values()),
      resultats,
    };
  }

  async function rangerPhotosVisitesServeur(visitesAtraiter) {
    const response = await fetch(API_BASE + "/ranger-photos-visites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dossierRacine: dossierRacineEnvoyeAuServeur(),
        visites: visitesAtraiter,
      }),
    });

    const data = await lireReponseJsonPhotoCartel(response, "Erreur rangement photos visites");

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Erreur rangement photos visites");
    }

    return data;
  }

  async function handleRangerPhotosVisites() {
    const visitesAtraiter = lireHistoriqueVisitesRangement().filter(
      (visite) => visite.finMs && !visite.rangee
    );

    if (visitesAtraiter.length === 0) {
      setMessageActualisation("Aucune visite clôturée à ranger.");
      afficherMessageDiscretArborescence("Aucune visite clôturée à ranger.");
      return;
    }

    try {
      setActualisationEnCours(true);
      setMessageActualisation("Rangement des photos des visites en cours...");

      const data = estAndroid()
        ? await rangerPhotosVisitesAndroid(visitesAtraiter)
        : await rangerPhotosVisitesServeur(visitesAtraiter);

      marquerVisitesRangees(data.visites || []);

      const total = Number(data.photosRangees || data.deplaces || 0);
      const visitesTraitees = (data.visites || []).length;

      setDerniereActualisation(data);
      const complementSuppression = Number(data.suppressionsKo || 0)
        ? ` Attention : ${Number(data.suppressionsKo || 0)} suppression(s) source à revérifier.`
        : "";
      setDerniereActionVisite(`✅ ${total} photo(s) rangée(s) dans ${visitesTraitees} visite(s).${complementSuppression}`);
      setMessageActualisation(`✅ ${total} photo(s) rangée(s) dans ${visitesTraitees} visite(s).${complementSuppression}`);
      afficherMessageDiscretArborescence(`✅ ${total} photo(s) rangée(s).`);
    } catch (error) {
      console.error(error);
      const messageErreur = "Erreur rangement photos : " + (error?.message || String(error));
      setMessageActualisation(messageErreur);
      setDerniereActionVisite(messageErreur);
      afficherMessageDiscretArborescence("⚠️ " + messageErreur);
    } finally {
      setActualisationEnCours(false);
    }
  }

  function formaterDate(date) {
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formaterDateHeurePhoto(date) {
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function timestampDossier(date) {
    return (
      date.getFullYear() +
      pad2(date.getMonth() + 1) +
      pad2(date.getDate()) +
      "_" +
      pad2(date.getHours()) +
      pad2(date.getMinutes())
    );
  }

  function nomVisiteRapide(date = new Date()) {
    return (
      "Visite rapide_" +
      date.getFullYear() +
      pad2(date.getMonth() + 1) +
      pad2(date.getDate()) +
      "-" +
      pad2(date.getHours()) +
      pad2(date.getMinutes())
    );
  }

  function estNomVisiteRapide(nom) {
    const valeur = String(nom || "");
    // Compatibilité avec les anciens dossiers techniques déjà créés.
    return valeur.startsWith("Visite rapide_") || valeur.startsWith("A_EN_COURS_");
  }

  function formaterDuree(ms) {
    const secondesTotales = Math.round(ms / 1000);
    const minutes = Math.floor(secondesTotales / 60);
    const secondes = secondesTotales % 60;

    if (minutes > 0) {
      return `${minutes} min ${secondes} s`;
    }

    return `${secondes} secondes`;
  }

function formaterSecondes(secondes) {
  const total = Number(secondes || 0);
  const minutes = Math.floor(total / 60);
  const reste = total % 60;

  if (minutes > 0) {
    return `${minutes} min ${reste} s`;
  }

  return `${reste} secondes`;
}

async function ouvrirDossierResultat(chemin) {
  try {
    const response = await fetch(API_BASE + "/ouvrir-dossier", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chemin }),
    });

    const data = await response.json();

    if (!data.success) {
      alert(data.error || "Impossible d'ouvrir le dossier");
    }
  } catch (error) {
    console.error(error);
    alert("Erreur ouverture dossier : " + error.message);
  }
}

function retourAccueil() {
  setResultatClassification(null);
  setDashboardRenommage(null);

  setMessageImport("");
  setMessageRenommage("");

  setDossierImport("");
  setDossierRenommage("");

  setFichiersImport([]);
  setFichiersRenommage([]);

  setNombrePhotos(0);
  setNombrePhotosRenommage(0);

  cheminRenommagePrepareRef.current = "";
  setCheminRenommagePrepare("");
  setRenommagePret(false);
  setRenommageFinalTermine(false);
}

function finDuVoyage() {
  const voyageEnCours = voyage || "Aucun voyage actif";

  setVoyage("");
  setVilleVisite("");
  setLieuVisite("");
  setTypeVisite("");
  setTypeNouvelleVisite("Musée");

  setVisiteActive(null);
  setStatutVisite("EN_COURS");
  setDateFinVisite(null);
  setDossierTampon("");
  setCheminTamponActif("");
  setDerniereActionVisite("Voyage terminé le " + formaterDate(new Date()));
  setPhotosCollectees(0);
  localStorage.setItem("photoCartelPhotosCollectees", "0");
  setMessageActualisation("");
  setMessageArborescenceAndroid("");
  setDerniereActualisation(null);

  setResultatClassification(null);
  setDashboardRenommage(null);
  setMessageImport("");
  setMessageRenommage("");
  setDossierImport("");
  setDossierRenommage("");
  setFichiersImport([]);
  setFichiersRenommage([]);
  setNombrePhotos(0);
  setNombrePhotosRenommage(0);

  cheminRenommagePrepareRef.current = "";
  setCheminRenommagePrepare("");
  setRenommagePret(false);
  setRenommageFinalTermine(false);

localStorage.setItem("photoCartelVoyageActif", "");
localStorage.setItem("photoCartelVilleActive", "");
localStorage.setItem("photoCartelLieuActif", "");
localStorage.setItem("photoCartelTypeVisiteActif", "");
localStorage.setItem("photoCartelStatutVisite", "EN_COURS");
localStorage.setItem("photoCartelDossierTamponActif", "");
localStorage.setItem("photoCartelCheminTamponActif", "");
localStorage.setItem("photoCartelDebutVisiteMs", "");

setModeGestionVoyage(false);
afficherMessageDiscretArborescence("✅ Voyage terminé : " + voyageEnCours);
}


function estAndroid() {
  const ua = navigator.userAgent || "";

  if (/Android/i.test(ua)) return true;

  // Sécurité v28.2.5 : certains modes PWA / affichage sans fil peuvent exposer
  // un userAgent moins explicite. On considère alors comme mobile probable
  // un écran tactile étroit avec API de sélection de dossier disponible.
  return (
    typeof window !== "undefined" &&
    typeof window.showDirectoryPicker === "function" &&
    navigator.maxTouchPoints > 1 &&
    window.innerWidth <= 900
  );
}


const CATEGORIES_VISITE_ANDROID = [
  "Oeuvres",
  "Cartels",
  "Jardins",
  "Architecture",
  "Batiments",
  "Structures",
];

async function creerArborescenceAndroidSurTelephone({ voyageNom, villeNom, lieuNom, typeVisiteNom }) {
  // v28.2.8 : ancien prototype Android désactivé.
  return {
    success: false,
    ignore: true,
    raison: "Ancien prototype Android désactivé en v28.2.8.",
  };
}



const NOM_HANDLE_RACINE_ANDROID = "racine-photocartel";
const NOM_HANDLE_DCIM_HISTORIQUE = "dcim";

function baseIndexedDbPhotoCartel() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      resolve(null);
      return;
    }

    const requete = window.indexedDB.open("PhotoCartelHandles", 1);

    requete.onupgradeneeded = () => {
      const db = requete.result;
      if (!db.objectStoreNames.contains("handles")) {
        db.createObjectStore("handles");
      }
    };

    requete.onsuccess = () => resolve(requete.result);
    requete.onerror = () => reject(requete.error);
  });
}

async function sauvegarderHandleAndroid(cle, handle) {
  try {
    const db = await baseIndexedDbPhotoCartel();
    if (!db) return;

    await new Promise((resolve, reject) => {
      const transaction = db.transaction("handles", "readwrite");
      transaction.objectStore("handles").put(handle, cle);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.warn("Handle Android non sauvegardé en IndexedDB :", error);
  }
}

async function lireHandleAndroid(cle) {
  try {
    const db = await baseIndexedDbPhotoCartel();
    if (!db) return null;

    return await new Promise((resolve, reject) => {
      const transaction = db.transaction("handles", "readonly");
      const requete = transaction.objectStore("handles").get(cle);
      requete.onsuccess = () => resolve(requete.result || null);
      requete.onerror = () => reject(requete.error);
    });
  } catch (error) {
    console.warn("Handle Android non relu depuis IndexedDB :", error);
    return null;
  }
}

async function sauvegarderHandleDcimAndroid(handle) {
  await sauvegarderHandleAndroid(NOM_HANDLE_DCIM_HISTORIQUE, handle);
}

async function lireHandleDcimAndroid() {
  return lireHandleAndroid(NOM_HANDLE_DCIM_HISTORIQUE);
}

async function handleAndroidEncoreAutorise(
  handle,
  { demanderPermissionSiNecessaire = false } = {}
) {
  if (!handle) return false;

  try {
    if (!handle.queryPermission) return true;

    let permission = await handle.queryPermission({ mode: "readwrite" });

    // v34.3 : requestPermission() exige un geste utilisateur explicite.
    if (
      permission === "prompt" &&
      demanderPermissionSiNecessaire &&
      handle.requestPermission
    ) {
      permission = await handle.requestPermission({ mode: "readwrite" });
    }

    return permission === "granted";
  } catch (error) {
    console.warn("Permission Android non vérifiable :", error);
    return false;
  }
}

async function handleDcimEncoreAutorise(handle, options = {}) {
  return handleAndroidEncoreAutorise(handle, options);
}

async function obtenirDossierRacinePhotoCartelAndroid({
  ouvrirSelecteurSiNecessaire = true,
  demanderPermissionSiNecessaire = false,
} = {}) {
  // v28.3 : point unique d'autorisation Android.
  // Objectif UX : l'utilisateur sélectionne directement DCIM/PhotoCartel quand il existe.
  // Si l'ancien handle DCIM v28.2.8 est déjà autorisé, il reste accepté en compatibilité.
  if (
    photoCartelHandleRacineAndroidSessionRef.current &&
    (await handleAndroidEncoreAutorise(photoCartelHandleRacineAndroidSessionRef.current, { demanderPermissionSiNecessaire }))
  ) {
    return {
      type: "photocartel",
      dossierPhotoCartel: photoCartelHandleRacineAndroidSessionRef.current,
      source: "session",
    };
  }

  const handleRacineSauvegarde = await lireHandleAndroid(NOM_HANDLE_RACINE_ANDROID);
  if (handleRacineSauvegarde && (await handleAndroidEncoreAutorise(handleRacineSauvegarde, { demanderPermissionSiNecessaire }))) {
    photoCartelHandleRacineAndroidSessionRef.current = handleRacineSauvegarde;
    return {
      type: "photocartel",
      dossierPhotoCartel: handleRacineSauvegarde,
      source: "indexeddb",
    };
  }

  if (photoCartelHandleDcimSessionRef.current && (await handleDcimEncoreAutorise(photoCartelHandleDcimSessionRef.current, { demanderPermissionSiNecessaire }))) {
    const { dossierPhotoCartel } = await creerArborescenceInfrastructurePhotoCartel(
      photoCartelHandleDcimSessionRef.current
    );
    // v30.x : quand la racine conservée est DCIM, on reconstruit PhotoCartel à partir de DCIM.
    // On ne persiste pas le sous-handle dérivé PhotoCartel, moins fiable sur Android.
    photoCartelHandleRacineAndroidSessionRef.current = null;
    return {
      type: "dcim",
      dossierDcim: photoCartelHandleDcimSessionRef.current,
      dossierPhotoCartel,
      source: "session-dcim",
    };
  }

  const handleDcimSauvegarde = await lireHandleDcimAndroid();
  if (handleDcimSauvegarde && (await handleDcimEncoreAutorise(handleDcimSauvegarde, { demanderPermissionSiNecessaire }))) {
    photoCartelHandleDcimSessionRef.current = handleDcimSauvegarde;
    const { dossierPhotoCartel } = await creerArborescenceInfrastructurePhotoCartel(
      handleDcimSauvegarde
    );
    // v30.x : on garde le handle DCIM comme référence stable et on reconstruit PhotoCartel.
    photoCartelHandleRacineAndroidSessionRef.current = null;
    return {
      type: "dcim",
      dossierDcim: handleDcimSauvegarde,
      dossierPhotoCartel,
      source: "indexeddb-dcim",
    };
  }

  if (!ouvrirSelecteurSiNecessaire) {
    return null;
  }

  if (typeof window.showDirectoryPicker !== "function") {
    throw new Error(
      "PhotoCartel ne voit pas l'API de sélection de dossier sur Android. " +
        "Ouvre PhotoCartel depuis Chrome Android / l'icône PWA, puis réessaie."
    );
  }

  const dossierChoisi = await window.showDirectoryPicker({
    id: "photocartel-racine-v28-3",
    mode: "readwrite",
    startIn: "pictures",
  });

  if (dossierChoisi.name === "PhotoCartel") {
    photoCartelHandleRacineAndroidSessionRef.current = dossierChoisi;
    await sauvegarderHandleAndroid(NOM_HANDLE_RACINE_ANDROID, dossierChoisi);

    return {
      type: "photocartel",
      dossierPhotoCartel: dossierChoisi,
      source: "selection-photocartel",
    };
  }

  if (dossierChoisi.name === "DCIM") {
    photoCartelHandleDcimSessionRef.current = dossierChoisi;
    await sauvegarderHandleDcimAndroid(dossierChoisi);

    const { dossierPhotoCartel } = await creerArborescenceInfrastructurePhotoCartel(dossierChoisi);
    // v30.x : sélection DCIM = on sauvegarde DCIM uniquement.
    // Le dossier PhotoCartel est toujours retrouvé depuis DCIM au besoin.
    photoCartelHandleRacineAndroidSessionRef.current = null;

    return {
      type: "dcim",
      dossierDcim: dossierChoisi,
      dossierPhotoCartel,
      source: "selection-dcim",
    };
  }

  throw new Error(
    "Mauvais dossier sélectionné. Dossier reçu : " +
      dossierChoisi.name +
      ". Sélectionne PhotoCartel dans DCIM. Si PhotoCartel n'existe pas encore, sélectionne DCIM."
  );
}

async function obtenirDossierDcimAndroid({ ouvrirSelecteurSiNecessaire = true } = {}) {
  // Compatibilité avec l'ancien nom : en v28.3, cette fonction renvoie le handle PhotoCartel quand possible.
  const resultat = await obtenirDossierRacinePhotoCartelAndroid({ ouvrirSelecteurSiNecessaire });
  return resultat?.dossierDcim || resultat?.dossierPhotoCartel || null;
}

async function creerDossiersNouvelleVisiteAndroid({ voyageNom, villeNom, visiteNom, typeVisiteNom }) {
  // v28.3 : création réelle sur Android dans PhotoCartel/Voyages/<Voyage>/<Ville>/<Visite>.
  // Le moteur métier est conservé ; on optimise uniquement le point d'autorisation.
  if (!estAndroid()) {
    return {
      success: false,
      ignore: true,
      raison: "Création Android ignorée : test réalisé hors téléphone Android.",
    };
  }

  // v28.3.2 : pas de message transitoire avant l'autorisation Android.
  // L'utilisateur voit uniquement les boîtes système obligatoires, puis le message final de succès.
  const resultatRacineAndroid = await obtenirDossierRacinePhotoCartelAndroid();
  const dossierPhotoCartel = resultatRacineAndroid.dossierPhotoCartel;

  await verifierInfrastructureDansPhotoCartelAndroid(dossierPhotoCartel);

  const nomVoyage = nettoyerNomDossierLocal(voyageNom);
  const nomVille = nettoyerNomDossierLocal(villeNom);
  const nomVisite = nettoyerNomDossierLocal(visiteNom);

  const dossierVoyages = await dossierPhotoCartel.getDirectoryHandle(
    DOSSIER_METIER_VOYAGES,
    { create: true }
  );
  const dossierVoyage = await dossierVoyages.getDirectoryHandle(nomVoyage, {
    create: true,
  });
  const dossierVille = await dossierVoyage.getDirectoryHandle(nomVille, {
    create: true,
  });
  const dossierVisite = await dossierVille.getDirectoryHandle(nomVisite, {
    create: true,
  });

  const categories =
    typeVisiteNom === "Musée"
      ? [
          "Oeuvres",
          "Cartels",
          "Jardins",
          "Architecture",
          "Batiments",
          "Structures",
          "A_verifier_classification",
        ]
      : typeVisiteNom === "Église" || typeVisiteNom === "Eglise"
        ? ["Facade", "Nef", "A_verifier_classification"]
        : [];

  // v30.6 : une visite rapide (type vide) crée uniquement le dossier racine.

  for (const categorie of categories) {
    await dossierVisite.getDirectoryHandle(categorie, { create: true });
  }

  return {
    success: true,
    cheminLisible:
      "DCIM / PhotoCartel / Voyages / " +
      nomVoyage +
      " / " +
      nomVille +
      " / " +
      nomVisite,
    categoriesCreees: categories,
  };
}

function nettoyerNomDossierLocal(valeur) {
  return String(valeur || "")
    .replace(/[<>:"/\\|?*]/g, "")
    .replace(/\s+/g, " ")
    .trim() || "Sans nom";
}


function ouvrirAppareilPhoto() {
  // v27.1-nettoyage-interface-demo : parcours VISITE strictement séparé de "Analyser une photo".
  // Ce bouton doit appeler uniquement l'input de prise de photo de visite :
  // accept="image/*" + capture="environment" + PAS de multiple.
  // Objectif : éviter le menu générique "Appareil photo / Fichiers" autant que Chrome Android le permet.
  const input = inputPrendrePhotosRef.current;

  if (input) {
    input.value = null;
    input.click();
  }
}


async function ouvrirOuCreerDossierPhotoCartel(parentHandle, nomDossier) {
  // v28.1 : fonction volontairement idempotente.
  // Elle ouvre le dossier s'il existe déjà ; elle le crée uniquement s'il manque.
  // Elle ne supprime, ne renomme et ne déplace jamais rien.
  try {
    const handle = await parentHandle.getDirectoryHandle(nomDossier, {
      create: false,
    });

    return {
      handle,
      statut: "existant",
    };
  } catch (error) {
    if (error?.name !== "NotFoundError") {
      throw error;
    }

    const handle = await parentHandle.getDirectoryHandle(nomDossier, {
      create: true,
    });

    return {
      handle,
      statut: "créé",
    };
  }
}

async function verifierInfrastructureDansPhotoCartelAndroid(dossierPhotoCartel, statutRacine = "existant") {
  // v28.3 : vérifie ou crée les dossiers d'infrastructure depuis le handle PhotoCartel.
  // Cette fonction ne demande aucune autorisation supplémentaire.
  const dossiersCrees = [];
  const dossiersExistants = [];

  for (const nomDossier of DOSSIERS_INFRASTRUCTURE_PHOTOCARTEL) {
    const { statut } = await ouvrirOuCreerDossierPhotoCartel(
      dossierPhotoCartel,
      nomDossier
    );

    if (statut === "créé") {
      dossiersCrees.push(nomDossier);
    } else {
      dossiersExistants.push(nomDossier);
    }
  }

  return {
    dossierPhotoCartel,
    statutRacine,
    dossiersCrees,
    dossiersExistants,
    dossiersVerifies: [...dossiersExistants, ...dossiersCrees],
  };
}

async function creerArborescenceInfrastructurePhotoCartel(dossierDcim) {
  // Compatibilité v28.2 : si l'utilisateur a encore un handle DCIM valide,
  // on ouvre ou crée PhotoCartel puis on délègue à la fonction v28.3.
  const { handle: dossierPhotoCartel, statut: statutRacine } =
    await ouvrirOuCreerDossierPhotoCartel(dossierDcim, "PhotoCartel");

  return verifierInfrastructureDansPhotoCartelAndroid(dossierPhotoCartel, statutRacine);
}

async function creerDossierVoyageMetierAndroid({ voyageNom }) {
  // v28.2.8 : la création de voyage Android ne demande plus jamais d'autorisation.
  // Le dossier Voyage est créé physiquement lors de la première création de visite.
  return {
    success: false,
    ignore: true,
    raison: "Création voyage Android différée jusqu'à la première visite.",
  };
}

async function testerStockageAndroid() {
  setMessageTestStockageAndroid(
    "Test stockage Android : si Android le demande, sélectionne le dossier PhotoCartel dans DCIM. Si PhotoCartel n'existe pas encore, sélectionne DCIM."
  );

  if (!window.showDirectoryPicker) {
    setMessageTestStockageAndroid(
      "Test impossible : ce Chrome ne propose pas window.showDirectoryPicker()."
    );
    return;
  }

  setTestStockageAndroidEnCours(true);

  let etape = "obtention du dossier PhotoCartel";

  try {
    const resultatRacineAndroid = await obtenirDossierRacinePhotoCartelAndroid();

    etape = "initialisation PhotoCartel";
    const resultat = await verifierInfrastructureDansPhotoCartelAndroid(
      resultatRacineAndroid.dossierPhotoCartel
    );

    setMessageTestStockageAndroid(
      "Stockage Android OK.\n\n" +
        "Racine : DCIM / PhotoCartel\n" +
        "Autorisation : réutilisable tant que Chrome la conserve.\n\n" +
        "Dossiers créés : " +
        (resultat.dossiersCrees.length ? resultat.dossiersCrees.join(", ") : "aucun") +
        "\n\nDossiers déjà présents : " +
        (resultat.dossiersExistants.length
          ? resultat.dossiersExistants.join(", ")
          : "aucun")
    );

    afficherMessageDiscretArborescence("✅ Stockage Android initialisé : DCIM / PhotoCartel");
  } catch (error) {
    console.error(error);
    setMessageTestStockageAndroid(
      "Erreur test stockage Android à l'étape : " +
        etape +
        "\n\n" +
        (error?.message || String(error))
    );
  } finally {
    setTestStockageAndroidEnCours(false);
  }
}





async function explorerDossiersPhotoCartel() {
  try {
    if (estAndroid()) {
      if (typeof window.showDirectoryPicker !== "function") {
        throw new Error("Ce Chrome ne permet pas d'explorer les dossiers PhotoCartel.");
      }

      const resultatRacine = await obtenirDossierRacinePhotoCartelAndroid();
      const dossierPhotoCartel = resultatRacine?.dossierPhotoCartel;

      if (!dossierPhotoCartel) {
        throw new Error("Le dossier PhotoCartel n'est pas disponible.");
      }

      await window.showDirectoryPicker({
        id: "photocartel-explorer-v31-2",
        mode: "read",
        startIn: dossierPhotoCartel,
      });
      return;
    }

    const response = await fetch(API_BASE + "/ouvrir-photocartel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await lireReponseJsonPhotoCartel(response, "ouverture du dossier PhotoCartel");

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Impossible d'ouvrir le dossier PhotoCartel.");
    }
  } catch (error) {
    if (error?.name === "AbortError") return;
    console.error("Erreur exploration PhotoCartel :", error);
    alert("Impossible d'explorer les dossiers PhotoCartel : " + (error?.message || String(error)));
  }
}


function extensionImagePhotoCartel(fichier, extensionDefaut = ".jpg") {
  const nom = fichier?.name || "";
  const match = nom.match(/\.[a-zA-Z0-9]+$/);
  const extension = match ? match[0].toLowerCase() : extensionDefaut;

  if ([".jpg", ".jpeg", ".png", ".webp"].includes(extension)) {
    return extension;
  }

  return extensionDefaut;
}

function genererNomPhotoCartel(prefixe = "PHOTO", fichier = null) {
  const maintenant = new Date();
  const horodatage =
    maintenant.getFullYear() +
    String(maintenant.getMonth() + 1).padStart(2, "0") +
    String(maintenant.getDate()).padStart(2, "0") +
    "_" +
    String(maintenant.getHours()).padStart(2, "0") +
    String(maintenant.getMinutes()).padStart(2, "0") +
    String(maintenant.getSeconds()).padStart(2, "0") +
    "_" +
    String(maintenant.getMilliseconds()).padStart(3, "0");

  return `${horodatage}_${prefixe}${extensionImagePhotoCartel(fichier)}`;
}

async function ecrireBlobDansDossierAndroid(dossierHandle, nomFichier, blob) {
  const fichierHandle = await dossierHandle.getFileHandle(nomFichier, { create: true });
  const writable = await fichierHandle.createWritable();
  await writable.write(blob);
  await writable.close();
  return nomFichier;
}

async function enregistrerPhotosVisiteDansCollecteAndroid(fichiers) {
  const resultatRacineAndroid = await obtenirDossierRacinePhotoCartelAndroid();
  const dossierPhotoCartel = resultatRacineAndroid.dossierPhotoCartel;

  await verifierInfrastructureDansPhotoCartelAndroid(dossierPhotoCartel);

  const dossierCollecte = await dossierPhotoCartel.getDirectoryHandle(
    "Collecte Photo en cours",
    { create: true }
  );

  const fichiersSauvegardes = [];

  for (const fichier of fichiers) {
    const nomFichier = genererNomPhotoCartel("VISITE", fichier);
    await ecrireBlobDansDossierAndroid(dossierCollecte, nomFichier, fichier);
    fichiersSauvegardes.push(nomFichier);
  }

  return {
    success: true,
    cheminLisible: "DCIM / PhotoCartel / Collecte Photo en cours",
    fichiersSauvegardes,
  };
}

async function enregistrerAnalysePhotoDansPhotosAnalyseesAndroid({ fichier, analyse }) {
  const resultatRacineAndroid = await obtenirDossierRacinePhotoCartelAndroid();
  const dossierPhotoCartel = resultatRacineAndroid.dossierPhotoCartel;

  await verifierInfrastructureDansPhotoCartelAndroid(dossierPhotoCartel);

  const dossierPhotosAnalysees = await dossierPhotoCartel.getDirectoryHandle(
    "Photos analysées",
    { create: true }
  );

  const nomPhoto = genererNomPhotoCartel("PHOTO_ANALYSEE", fichier).replace(/\.[a-zA-Z0-9]+$/, ".jpeg");
  const nomBase = nomPhoto.replace(/\.[a-zA-Z0-9]+$/, "");
  const nomJson = `${nomBase}.json`;
  const metadonnees = {
    type_document: "PHOTO_ANALYSEE",
    version_photocartel: VERSION.numero,
    date_analyse_iso: new Date().toISOString(),
    date_analyse_locale: formaterDate(new Date()),
    nom_photo_original: fichier?.name || "",
    nom_photo_sauvegardee: nomPhoto,
    nom_json_sauvegarde: nomJson,
    dossier_destination: "DCIM / PhotoCartel / Photos analysées",
    analyse,
  };

  await ecrireBlobDansDossierAndroid(dossierPhotosAnalysees, nomPhoto, fichier);
  await ecrireBlobDansDossierAndroid(
    dossierPhotosAnalysees,
    nomJson,
    new Blob([JSON.stringify(metadonnees, null, 2)], { type: "application/json" })
  );

  return {
    success: true,
    cheminDestination: "DCIM / PhotoCartel / Photos analysées",
    nomPhoto,
    nomJson,
  };
}

function handlePrendreDesPhotos() {
  if (!voyage) {
    alert("Crée d'abord un voyage.");
    return;
  }

  if (!lieuVisite || !cheminCollecteActif) {
    setModeAucuneVisite(true);
    return;
  }

  if (!localStorage.getItem("photoCartelDebutVisiteMs")) {
    localStorage.setItem("photoCartelDebutVisiteMs", String(Date.now()));
  }

  setDerniereActionVisite("Appareil photo ouvert le " + formaterDate(new Date()) + ". Reviens ensuite dans PhotoCartel pour ranger les photos de la visite.");
  ouvrirAppareilPhoto();
}

function ouvrirInputAnalysePhoto(inputRef) {
  const input = inputRef.current;

  if (input) {
    input.value = null;
    input.click();
  }
}

async function handleAnalyserUnePhoto() {
  // v34.6 : on réutilise silencieusement un accès encore valide.
  // Si aucun accès n'est disponible, on affiche un écran explicite avec un bouton
  // utilisateur dédié. showDirectoryPicker() n'est jamais appelé après la sélection
  // d'une photo ni depuis une chaîne asynchrone dépourvue de geste utilisateur.
  fermerAnalysePhoto();
  fermerGaleriePhotosAnalysees();
  setModeCreationVisite(false);
  setModeCreationVoyage(false);
  setModeGestionVoyage(false);
  setModeAucuneVisite(false);
  setModeParametres(false);
  setPhotoPleinEcranUrl("");
  retourAccueil();
  setMessageAnalysePhoto("");
  setModeAutorisationStockageAnalyse(false);

  if (!estAndroid()) {
    setModeChoixActionAnalysePhoto(true);
    return;
  }

  const accesExistant = await obtenirDossierRacinePhotoCartelAndroid({
    ouvrirSelecteurSiNecessaire: false,
    demanderPermissionSiNecessaire: false,
  });

  if (accesExistant) {
    autorisationStockageHandleCandidatRef.current = null;
    setModeChoixActionAnalysePhoto(true);
    return;
  }

  // v34.8 : on prépare AVANT l'affichage du bouton le handle déjà mémorisé.
  // Ainsi, le clic utilisateur peut appeler requestPermission() immédiatement,
  // sans rouvrir inutilement le sélecteur de dossiers.
  const handleRacineSauvegarde = await lireHandleAndroid(NOM_HANDLE_RACINE_ANDROID);
  const handleDcimSauvegarde = await lireHandleDcimAndroid();
  autorisationStockageHandleCandidatRef.current =
    handleRacineSauvegarde || handleDcimSauvegarde || null;
  setModeAutorisationStockageAnalyse(true);
}

async function autoriserStockagePourAnalyseDepuisClic() {
  if (autorisationStockageAnalyseEnCours) return;

  try {
    setAutorisationStockageAnalyseEnCours(true);
    setMessageAnalysePhoto("");

    // v34.8 — cas B : un handle racine est déjà mémorisé mais sa permission
    // doit être réactivée. requestPermission() est la toute première opération
    // du clic utilisateur : aucun passage par l'explorateur n'est nécessaire.
    const handleCandidat = autorisationStockageHandleCandidatRef.current;
    if (handleCandidat?.requestPermission) {
      const permission = await handleCandidat.requestPermission({ mode: "readwrite" });
      if (permission === "granted") {
        if (handleCandidat.name === "PhotoCartel") {
          photoCartelHandleRacineAndroidSessionRef.current = handleCandidat;
          photoCartelHandleDcimSessionRef.current = null;
          await sauvegarderHandleAndroid(NOM_HANDLE_RACINE_ANDROID, handleCandidat);
          await verifierInfrastructureDansPhotoCartelAndroid(handleCandidat);
        } else if (handleCandidat.name === "DCIM") {
          photoCartelHandleDcimSessionRef.current = handleCandidat;
          photoCartelHandleRacineAndroidSessionRef.current = null;
          await sauvegarderHandleDcimAndroid(handleCandidat);
          await creerArborescenceInfrastructurePhotoCartel(handleCandidat);
        }

        autorisationStockageHandleCandidatRef.current = null;
        setModeAutorisationStockageAnalyse(false);
        setModeChoixActionAnalysePhoto(true);
        return;
      }

      // Une permission refusée consomme le geste utilisateur. On n'ouvre pas
      // le sélecteur dans la même chaîne asynchrone : le prochain clic le fera directement.
      autorisationStockageHandleCandidatRef.current = null;
      throw new Error("L’accès mémorisé a été refusé. Appuie de nouveau sur Autoriser PhotoCartel pour sélectionner la racine DCIM / PhotoCartel.");
    }

    // v34.8 — cas C : aucun handle réutilisable. On ouvre alors une seule fois
    // le sélecteur et on exige la racine PhotoCartel (ou DCIM si elle n'existe pas).
    if (typeof window.showDirectoryPicker !== "function") {
      throw new Error(
        "Ce navigateur ne permet pas de sélectionner le dossier PhotoCartel. Ouvre l’application depuis Chrome Android ou l’icône PWA."
      );
    }

    const dossierChoisi = await window.showDirectoryPicker({
      id: "photocartel-racine-v34-8",
      mode: "readwrite",
      startIn: "pictures",
    });

    if (dossierChoisi.name === "PhotoCartel") {
      photoCartelHandleRacineAndroidSessionRef.current = dossierChoisi;
      photoCartelHandleDcimSessionRef.current = null;
      await sauvegarderHandleAndroid(NOM_HANDLE_RACINE_ANDROID, dossierChoisi);
      await verifierInfrastructureDansPhotoCartelAndroid(dossierChoisi);
    } else if (dossierChoisi.name === "DCIM") {
      photoCartelHandleDcimSessionRef.current = dossierChoisi;
      photoCartelHandleRacineAndroidSessionRef.current = null;
      await sauvegarderHandleDcimAndroid(dossierChoisi);
      await creerArborescenceInfrastructurePhotoCartel(dossierChoisi);
    } else {
      throw new Error(
        "Mauvais dossier sélectionné : " + dossierChoisi.name +
        ". Reviens à DCIM puis sélectionne le dossier racine PhotoCartel, pas Voyages ni un autre sous-dossier."
      );
    }

    autorisationStockageHandleCandidatRef.current = null;
    setModeAutorisationStockageAnalyse(false);
    setModeChoixActionAnalysePhoto(true);
  } catch (error) {
    if (error?.name !== "AbortError") {
      console.error("Autorisation stockage analyse :", error);
      setMessageAnalysePhoto("Accès au stockage impossible : " + error.message);
    }
  } finally {
    setAutorisationStockageAnalyseEnCours(false);
  }
}

function annulerAutorisationStockageAnalyse() {
  autorisationStockageHandleCandidatRef.current = null;
  setModeAutorisationStockageAnalyse(false);
  setMessageAnalysePhoto("");
}

function maintenirEcranAnalysePhotoOuvert() {
  if (!analysePhotoSessionActiveRef.current) {
    return;
  }

  setModeChoixActionAnalysePhoto(false);
  setModeAnalysePhoto(true);
}

function verrouillerEcranAnalysePhotoMobile() {
  // v25.5.4 : verrou de stabilité renforcé pour le retour de l'appareil photo Android.
  // Le flux "Choisir un fichier" est déjà validé ; on garde néanmoins ce verrou neutre
  // pour éviter tout retour visuel intempestif à l'accueil pendant la fin de l'analyse.
  maintenirEcranAnalysePhotoOuvert();

  [0, 120, 350, 800, 1500].forEach((delai) => {
    window.setTimeout(() => {
      maintenirEcranAnalysePhotoOuvert();
    }, delai);
  });
}

async function choisirPrendrePhotoPourAnalyse() {
  // v34.6 : l’accès au stockage a déjà été validé avant l’ouverture de l’appareil photo.
  // L'autorisation existante sera réutilisée après validation de la photo ; une demande
  // ne sera affichée que si Android/Chrome ne dispose réellement plus d'un accès valable.

  analysePhotoSessionActiveRef.current = true;
  analysePhotoOrigineRef.current = "camera";

  setModeChoixActionAnalysePhoto(false);
  setModeAnalysePhoto(true);
  setAnalysePhotoFile(null);
  setAnalysePhotoUrl("");
  setAnalysePhotoResultat(null);
  setAnalysePhotoEnCours(false);
  setAnalysePhotoSauvegardee(false);
  setDateHeurePhotoAnalyse("");
  setDateHeureAnalyseIA("");
  setMessageAnalysePhoto(
    "Appareil photo ouvert. Prends la photo puis valide avec OK."
  );

  ouvrirInputAnalysePhoto(inputAnalyserPhotoCameraRef);
}

async function choisirFichierPourAnalyse() {
  // v34.6 : l’accès au stockage a déjà été validé avant l’ouverture de la galerie.

  analysePhotoSessionActiveRef.current = true;
  analysePhotoOrigineRef.current = "fichier";
  setModeChoixActionAnalysePhoto(false);
  ouvrirInputAnalysePhoto(inputAnalyserPhotoRef);
}

function annulerChoixActionAnalysePhoto() {
  setModeChoixActionAnalysePhoto(false);
}

function genererTimestampSessionAnalyse(date = new Date()) {
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

async function enregistrerPhotoAAnalyserAndroid(fichier, timestampInitial) {
  // v34.6 : aucune ouverture de sélecteur ici. L'accès a été validé avant l'ouverture
  // de l'appareil photo ou de la galerie, depuis un geste utilisateur explicite.
  const resultatRacineAndroid = await obtenirDossierRacinePhotoCartelAndroid({
    ouvrirSelecteurSiNecessaire: false,
    demanderPermissionSiNecessaire: false,
  });
  if (!resultatRacineAndroid) {
    throw new Error(
      "Accès au dossier PhotoCartel indisponible. Relance Analyser une photo pour réautoriser le dossier."
    );
  }
  const dossierPhotoCartel = resultatRacineAndroid.dossierPhotoCartel;
  await verifierInfrastructureDansPhotoCartelAndroid(dossierPhotoCartel);
  const dossier = await dossierPhotoCartel.getDirectoryHandle("Photos à analyser", { create: true });
  const extension = extensionImagePhotoCartel(fichier, ".jpeg");
  const nomPhoto = `${timestampInitial}_PHOTO_A_ANALYSER${extension}`;
  await ecrireBlobDansDossierAndroid(dossier, nomPhoto, fichier);
  return { success: true, nomPhoto };
}

async function supprimerFichierAnalyseAndroid(nomDossier, nomFichier) {
  if (!nomFichier) return;
  const resultatRacineAndroid = await obtenirDossierRacinePhotoCartelAndroid({
    ouvrirSelecteurSiNecessaire: false,
    demanderPermissionSiNecessaire: false,
  });
  if (!resultatRacineAndroid) {
    throw new Error(
      "Accès au dossier PhotoCartel indisponible. Relance Analyser une photo pour réautoriser le dossier."
    );
  }
  const dossier = await resultatRacineAndroid.dossierPhotoCartel.getDirectoryHandle(nomDossier, { create: true });
  try {
    await dossier.removeEntry(nomFichier);
  } catch (error) {
    console.warn("Fichier déjà absent :", nomFichier);
  }
}

async function finaliserAnalysePhotoAndroid({ fichier, analyse, timestampInitial, nomPhotoAAnalyser }) {
  const resultatRacineAndroid = await obtenirDossierRacinePhotoCartelAndroid({
    ouvrirSelecteurSiNecessaire: false,
    demanderPermissionSiNecessaire: false,
  });
  if (!resultatRacineAndroid) {
    throw new Error(
      "Accès au dossier PhotoCartel indisponible. Relance Analyser une photo pour réautoriser le dossier."
    );
  }
  const dossierPhotoCartel = resultatRacineAndroid.dossierPhotoCartel;
  await verifierInfrastructureDansPhotoCartelAndroid(dossierPhotoCartel);
  const dossier = await dossierPhotoCartel.getDirectoryHandle("Photos analysées", { create: true });
  const nomPhoto = `${timestampInitial}_PHOTO_ANALYSEE.jpeg`;
  const nomJson = `${timestampInitial}_PHOTO_ANALYSEE.json`;
  const metadonnees = {
    type_document: "PHOTO_ANALYSEE",
    statut_analyse: "ANALYSEE",
    version_photocartel: VERSION.numero,
    timestamp_initial: timestampInitial,
    date_analyse_iso: new Date().toISOString(),
    nom_photo_original: fichier?.name || "",
    nom_photo_sauvegardee: nomPhoto,
    nom_json_sauvegarde: nomJson,
    dossier_destination: "DCIM / PhotoCartel / Photos analysées",
    analyse,
  };
  await ecrireBlobDansDossierAndroid(dossier, nomPhoto, fichier);
  await ecrireBlobDansDossierAndroid(dossier, nomJson, new Blob([JSON.stringify(metadonnees, null, 2)], { type: "application/json" }));
  await supprimerFichierAnalyseAndroid("Photos à analyser", nomPhotoAAnalyser);
  return { success: true, nomPhoto, nomJson };
}

async function modifierAnalysePhotoAndroid({ fichier, analyse, timestampInitial, ancienNomPhoto, ancienNomJson, resultatRacineAndroidPreautorise }) {
  const resultatRacineAndroid = resultatRacineAndroidPreautorise || await obtenirDossierRacinePhotoCartelAndroid({
    ouvrirSelecteurSiNecessaire: false,
    demanderPermissionSiNecessaire: false,
  });
  if (!resultatRacineAndroid) {
    throw new Error(
      "Accès au dossier PhotoCartel indisponible. Relance Analyser une photo pour réautoriser le dossier."
    );
  }
  const dossierPhotoCartel = resultatRacineAndroid.dossierPhotoCartel;
  const dossier = await dossierPhotoCartel.getDirectoryHandle("Photos analysées", { create: true });
  const nomPhoto = `${timestampInitial}_PHOTO_ANALYSEE_MODIFIEE.jpeg`;
  const nomJson = `${timestampInitial}_PHOTO_ANALYSEE_MODIFIEE.json`;
  const metadonnees = {
    type_document: "PHOTO_ANALYSEE_MODIFIEE",
    statut_analyse: "MODIFIEE",
    version_photocartel: VERSION.numero,
    timestamp_initial: timestampInitial,
    date_modification_iso: new Date().toISOString(),
    nom_photo_original: fichier?.name || "",
    nom_photo_sauvegardee: nomPhoto,
    nom_json_sauvegarde: nomJson,
    dossier_destination: "DCIM / PhotoCartel / Photos analysées",
    analyse,
  };
  await ecrireBlobDansDossierAndroid(dossier, nomPhoto, fichier);
  await ecrireBlobDansDossierAndroid(dossier, nomJson, new Blob([JSON.stringify(metadonnees, null, 2)], { type: "application/json" }));
  if (ancienNomPhoto && ancienNomPhoto !== nomPhoto) await supprimerFichierAnalyseAndroid("Photos analysées", ancienNomPhoto);
  if (ancienNomJson && ancienNomJson !== nomJson) await supprimerFichierAnalyseAndroid("Photos analysées", ancienNomJson);
  return { success: true, nomPhoto, nomJson };
}

async function handlePhotoAnalyseSelection(event) {
  const fichier = event.target.files?.[0];

  if (!fichier) {
    if (modeAnalysePhoto) {
      setAnalysePhotoEnCours(false);
      setMessageAnalysePhoto("Aucune photo sélectionnée.");
    }
    return;
  }

  analysePhotoSessionActiveRef.current = true;
  const imageLocaleUrl = URL.createObjectURL(fichier);
  const datePhoto = fichier.lastModified ? new Date(fichier.lastModified) : new Date();
  const timestampInitial = genererTimestampSessionAnalyse(new Date());

  setModeChoixActionAnalysePhoto(false);
  setAnalysePhotoFile(fichier);
  setAnalysePhotoUrl(imageLocaleUrl);
  setAnalysePhotoResultat(null);
  setAnalysePhotoSauvegardee(false);
  setAnalysePhotoEdition(false);
  analysePhotoAvantEditionRef.current = null;
  analysePhotoModifieeAvantEditionRef.current = false;
  setAnalysePhotoModifiee(false);
  setAnalysePhotoNomAnalysee("");
  setAnalysePhotoNomJson("");
  setAnalysePhotoNomAAnalyser("");
  setAnalysePhotoTimestampInitial(timestampInitial);
  setDateHeurePhotoAnalyse(formaterDateHeurePhoto(datePhoto));
  setDateHeureAnalyseIA("");
  setModeAnalysePhoto(true);
  setAnalysePhotoEnCours(false);
  setMessageAnalysePhoto("");

  try {
    let data;
    if (estAndroid()) {
      data = await enregistrerPhotoAAnalyserAndroid(fichier, timestampInitial);
    } else {
      const formData = new FormData();
      formData.append("photo", fichier, fichier.name || "photo.jpg");
      formData.append("timestampInitial", timestampInitial);
      formData.append("dossierRacine", dossierRacineEnvoyeAuServeur());
      const response = await fetch(API_BASE + "/sauvegarder-photo-a-analyser", { method: "POST", body: formData });
      data = await lireReponseJsonPhotoCartel(response, "Erreur enregistrement photo à analyser");
      if (!response.ok || !data.success) throw new Error(data.error || "Erreur enregistrement photo à analyser");
    }
    setAnalysePhotoNomAAnalyser(data.nomPhoto || "");
  } catch (error) {
    console.error(error);
    setAnalysePhotoNomAAnalyser("");
    setMessageAnalysePhoto(
      "La photo n’a pas pu être enregistrée dans Photos à analyser. Reviens à Analyser une photo pour rétablir l’accès au dossier PhotoCartel. Détail : " + error.message
    );
  } finally {
    event.target.value = "";
  }
}

async function lancerAnalysePhotoIA() {
  if (!analysePhotoFile || analysePhotoEnCours) return;

  if (estAndroid() && !analysePhotoNomAAnalyser) {
    setMessageAnalysePhoto(
      "L’analyse ne peut pas démarrer car la photo n’est pas enregistrée dans Photos à analyser. Relance Analyser une photo pour rétablir l’accès au dossier PhotoCartel."
    );
    return;
  }

  // v34.6 : aucune nouvelle demande d'autorisation au lancement de l'IA.
  // La photo est déjà enregistrée dans « Photos à analyser » et le handle valide est réutilisé.

  const controller = new AbortController();
  analysePhotoAbortControllerRef.current = controller;
  setAnalysePhotoEnCours(true);
  setMessageAnalysePhoto("");

  try {
    const formData = new FormData();
    formData.append("photo", analysePhotoFile, analysePhotoFile.name || "photo.jpg");
    const response = await fetch(API_BASE + "/analyser-photo-one-shot", {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
    const data = await lireReponseJsonPhotoCartel(response, "Erreur analyse photo");
    if (!response.ok || !data.success) throw new Error(data.error || "Erreur analyse IA");

    const analyseFinale = synchroniserAnalysePourSauvegarde(data.result);
    let sauvegarde;
    if (estAndroid()) {
      sauvegarde = await finaliserAnalysePhotoAndroid({
        fichier: analysePhotoFile,
        analyse: analyseFinale,
        timestampInitial: analysePhotoTimestampInitial,
        nomPhotoAAnalyser: analysePhotoNomAAnalyser,
      });
    } else {
      const sauvegardeForm = new FormData();
      sauvegardeForm.append("photo", analysePhotoFile, analysePhotoFile.name || "photo.jpeg");
      sauvegardeForm.append("analyse", JSON.stringify(analyseFinale));
      sauvegardeForm.append("timestampInitial", analysePhotoTimestampInitial);
      sauvegardeForm.append("nomPhotoAAnalyser", analysePhotoNomAAnalyser);
      sauvegardeForm.append("dossierRacine", dossierRacineEnvoyeAuServeur());
      const sauvegardeResponse = await fetch(API_BASE + "/finaliser-analyse-photo", { method: "POST", body: sauvegardeForm });
      sauvegarde = await lireReponseJsonPhotoCartel(sauvegardeResponse, "Erreur sauvegarde automatique");
      if (!sauvegardeResponse.ok || !sauvegarde.success) {
        throw new Error(sauvegarde.error || "Erreur sauvegarde automatique");
      }
      if (!sauvegarde.nomPhoto || !sauvegarde.nomJson) {
        throw new Error("Le serveur n’a pas confirmé la création des fichiers dans Photos analysées.");
      }
    }

    setAnalysePhotoResultat(analyseFinale);
    setDateHeureAnalyseIA(formaterDateHeurePhoto(new Date()));
    setAnalysePhotoSauvegardee(true);
    setAnalysePhotoModifiee(false);
    setAnalysePhotoNomAAnalyser("");
    setAnalysePhotoNomAnalysee(sauvegarde.nomPhoto || "");
    setAnalysePhotoNomJson(sauvegarde.nomJson || "");
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error);
      setMessageAnalysePhoto("Erreur analyse photo : " + error.message);
    }
  } finally {
    analysePhotoAbortControllerRef.current = null;
    setAnalysePhotoEnCours(false);
  }
}

function interrompreAnalysePhotoIA() {
  analysePhotoAbortControllerRef.current?.abort();
  analysePhotoAbortControllerRef.current = null;
  setAnalysePhotoEnCours(false);
  setMessageAnalysePhoto("");
}

function fermerAnalysePhoto() {
  setModeAutorisationStockageAnalyse(false);
  setAutorisationStockageAnalyseEnCours(false);
  analysePhotoAbortControllerRef.current?.abort();
  analysePhotoAbortControllerRef.current = null;
  analysePhotoSessionActiveRef.current = false;
  analysePhotoOrigineRef.current = "";
  setModeAnalysePhoto(false);
  setModeChoixActionAnalysePhoto(false);
  setAnalysePhotoFile(null);
  setAnalysePhotoUrl("");
  setAnalysePhotoResultat(null);
  setAnalysePhotoEnCours(false);
  setPhotoPleinEcranUrl("");
  setMessageAnalysePhoto("");
  setAnalysePhotoSauvegardeEnCours(false);
  setAnalysePhotoSauvegardee(false);
  setAnalysePhotoEdition(false);
  setAnalysePhotoModifiee(false);
  setAnalysePhotoNomAAnalyser("");
  setAnalysePhotoNomAnalysee("");
  setAnalysePhotoNomJson("");
  setAnalysePhotoTimestampInitial("");
  setDateHeurePhotoAnalyse("");
  setDateHeureAnalyseIA("");
}

function retourAccueilDepuisAnalysePhoto() {
  fermerAnalysePhoto();
  retourAccueil();
}

function reprendreAnalysePhoto() {
  fermerAnalysePhoto();
  handleAnalyserUnePhoto();
}

async function fermerSansEnregistrerAnalysePhoto() {
  try {
    if (analysePhotoResultat) {
      if (estAndroid()) {
        await supprimerFichierAnalyseAndroid("Photos analysées", analysePhotoNomAnalysee);
        await supprimerFichierAnalyseAndroid("Photos analysées", analysePhotoNomJson);
      } else {
        await fetch(API_BASE + "/supprimer-fichiers-analyse", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            dossierRacine: dossierRacineEnvoyeAuServeur(),
            dossier: "Photos analysées",
            noms: [analysePhotoNomAnalysee, analysePhotoNomJson].filter(Boolean),
          }),
        });
      }
    } else {
      if (estAndroid()) {
        await supprimerFichierAnalyseAndroid("Photos à analyser", analysePhotoNomAAnalyser);
      } else {
        await fetch(API_BASE + "/supprimer-fichiers-analyse", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            dossierRacine: dossierRacineEnvoyeAuServeur(),
            dossier: "Photos à analyser",
            noms: [analysePhotoNomAAnalyser].filter(Boolean),
          }),
        });
      }
    }
  } catch (error) {
    console.error("Suppression fiche analyse :", error);
  } finally {
    retourAccueilDepuisAnalysePhoto();
  }
}

function modifierObjetParChemin(objet, chemin, valeur) {
  const copie = JSON.parse(JSON.stringify(objet || {}));
  let courant = copie;
  const morceaux = chemin.split(".");
  morceaux.forEach((morceau, index) => {
    if (index === morceaux.length - 1) {
      courant[morceau] = valeur;
    } else {
      courant[morceau] = courant[morceau] && typeof courant[morceau] === "object" ? courant[morceau] : {};
      courant = courant[morceau];
    }
  });
  return copie;
}

const CHEMINS_EDITION_ANALYSE = {
  "Type principal": "fiche_patrimoniale_v18.identification.type_general",
  "Objet": "fiche_patrimoniale_v18.identification.objet_principal",
  "Titre": "fiche_patrimoniale_v18.identification.nom_ou_titre",
  "Titre original": "fiche_patrimoniale_v18.identification.titre_original",
  "Auteur / créateur": "fiche_patrimoniale_v18.identification.auteur_createur_architecte",
  "Attribution": "fiche_patrimoniale_v18.identification.attribution",
  "Date / période": "fiche_patrimoniale_v18.datation.date_precise",
  "Siècle": "fiche_patrimoniale_v18.datation.siecle",
  "Culture": "fiche_patrimoniale_v18.identification.culture_civilisation",
  "Pays d'origine": "fiche_patrimoniale_v18.identification.pays_origine",
  "Catégorie": "fiche_patrimoniale_v18.identification.categorie",
  "Sous-type": "fiche_patrimoniale_v18.identification.sous_type",
  "Style": "fiche_patrimoniale_v18.identification.mouvement_style",
  "Fonction": "fiche_patrimoniale_v18.identification.fonction_origine",
  "Région d'origine / probable": "fiche_patrimoniale_v18.localisation.region",
  "Ville liée à l'objet": "fiche_patrimoniale_v18.localisation.ville",
  "Lieu lié à l'objet": "fiche_patrimoniale_v18.localisation.site_lieu",
  "Institution": "fiche_patrimoniale_v18.localisation.musee_institution",
  "Salle / zone": "fiche_patrimoniale_v18.localisation.salle_galerie_zone",
  "Technique": "fiche_patrimoniale_v18.materiaux_techniques.technique",
  "Support": "fiche_patrimoniale_v18.materiaux_techniques.support",
  "Matériaux": "fiche_patrimoniale_v18.materiaux_techniques.materiaux",
  "Dimensions": "fiche_patrimoniale_v18.caracteristiques_physiques.dimensions_originales",
  "Hauteur": "fiche_patrimoniale_v18.caracteristiques_physiques.hauteur",
  "Largeur": "fiche_patrimoniale_v18.caracteristiques_physiques.largeur",
  "Profondeur": "fiche_patrimoniale_v18.caracteristiques_physiques.profondeur",
  "Longueur": "fiche_patrimoniale_v18.caracteristiques_physiques.longueur",
  "Surface / superficie": "fiche_patrimoniale_v18.caracteristiques_physiques.surface",
  "Poids": "fiche_patrimoniale_v18.caracteristiques_physiques.poids",
  "Étages": "fiche_patrimoniale_v18.caracteristiques_physiques.nombre_etages",
  "Hauteur nef": "fiche_patrimoniale_v18.caracteristiques_physiques.hauteur_nef",
  "Hauteur tours": "fiche_patrimoniale_v18.caracteristiques_physiques.hauteur_tours",
  "Contexte": "fiche_patrimoniale_v18.contexte_historique.contexte_creation",
  "Importance": "fiche_patrimoniale_v18.analyse_patrimoniale.importance_patrimoniale",
  "Classement": "fiche_patrimoniale_v18.analyse_patrimoniale.classement_protection",
};

function synchroniserAnalysePourSauvegarde(analyseSource) {
  // v34.6 : la fiche patrimoniale est la source éditable. Avant toute écriture,
  // ses valeurs sont recopiées dans les champs historiques plats du JSON afin
  // qu'aucun attribut modifié ne reste désynchronisé (auteur, titre, musée, etc.).
  const analyse = JSON.parse(JSON.stringify(analyseSource || {}));
  const fiche = analyse.fiche_patrimoniale_v18 || {};
  const contexte = fiche.contexte_photo || {};
  const id = fiche.identification || {};
  const datation = fiche.datation || {};
  const loc = fiche.localisation || {};
  const phys = fiche.caracteristiques_physiques || {};
  const mat = fiche.materiaux_techniques || {};
  const vis = fiche.description_visuelle || {};
  const patr = fiche.analyse_patrimoniale || {};
  const hist = fiche.contexte_historique || {};
  const museo = fiche.informations_museographiques || {};

  const affecter = (cle, valeur) => {
    if (valeur !== undefined && valeur !== null) analyse[cle] = valeur;
  };

  affecter("pays_photo", contexte.pays_photo);
  affecter("ville_photo", contexte.ville_photo);
  affecter("site_photo", contexte.site_photo);
  affecter("type_detecte", id.type_general);
  affecter("objet_principal", id.objet_principal);
  affecter("titre_fr", id.nom_ou_titre);
  affecter("titre_en", id.titre_original);
  affecter("auteur_ou_createur", id.auteur_createur_architecte);
  affecter("attribution", id.attribution);
  affecter("pays_origine", id.pays_origine);
  affecter("date_ou_periode", datation.date_precise || datation.periode);
  affecter("siecle", datation.siecle);
  affecter("categorie", id.categorie);
  affecter("sous_type", id.sous_type);
  affecter("style_ou_mouvement", id.mouvement_style || patr.style || patr.mouvement);
  affecter("fonction", id.fonction_origine || id.fonction_actuelle || patr.fonction_patrimoniale);
  affecter("region", loc.region);
  affecter("ville", loc.ville);
  affecter("lieu_probable", loc.site_lieu || loc.localisation_probable);
  affecter("musee_ou_institution", loc.musee_institution || museo.musee || museo.institution);
  affecter("salle_ou_zone", loc.salle_galerie_zone || museo.salle);
  affecter("technique", mat.technique);
  affecter("support", mat.support);
  affecter("materiaux", mat.materiaux);
  affecter("dimensions", phys.dimensions_originales);
  affecter("hauteur", phys.hauteur || phys.hauteur_totale);
  affecter("largeur", phys.largeur);
  affecter("profondeur", phys.profondeur);
  affecter("longueur", phys.longueur || phys.longueur_totale);
  affecter("surface", phys.surface || phys.superficie);
  affecter("poids", phys.poids);
  affecter("nombre_etages", phys.nombre_etages);
  affecter("hauteur_nef", phys.hauteur_nef);
  affecter("hauteur_tours", phys.hauteur_tours);
  affecter("description", vis.description_courte || vis.description_detaillee);
  affecter("elements_visibles", vis.elements_visibles);
  affecter("contexte", hist.contexte_creation || hist.contexte_culturel || hist.periode_historique);
  affecter("importance", patr.importance_patrimoniale);
  affecter("classement", patr.classement_protection || patr.unesco);

  return analyse;
}

function modifierChampAnalyse(label, valeur) {
  const chemin = CHEMINS_EDITION_ANALYSE[label];
  if (!chemin) return;
  const valeurFinale = label === "Matériaux" ? String(valeur).split(",").map((item) => item.trim()).filter(Boolean) : valeur;
  setAnalysePhotoResultat((actuel) => modifierObjetParChemin(actuel, chemin, valeurFinale));
  setAnalysePhotoModifiee(true);
}

function clonerAnalysePhoto(valeur) {
  if (valeur == null) return valeur;
  if (typeof structuredClone === "function") return structuredClone(valeur);
  return JSON.parse(JSON.stringify(valeur));
}

function entrerModeModificationAnalyse() {
  if (!analysePhotoResultat || analysePhotoEnCours || analysePhotoEdition) return;
  analysePhotoAvantEditionRef.current = clonerAnalysePhoto(analysePhotoResultat);
  analysePhotoModifieeAvantEditionRef.current = analysePhotoModifiee;
  setAnalysePhotoEdition(true);
}

function annulerModificationsAnalyse() {
  if (!analysePhotoEdition) return;
  if (analysePhotoAvantEditionRef.current) {
    setAnalysePhotoResultat(clonerAnalysePhoto(analysePhotoAvantEditionRef.current));
  }
  setAnalysePhotoModifiee(analysePhotoModifieeAvantEditionRef.current);
  analysePhotoAvantEditionRef.current = null;
  analysePhotoModifieeAvantEditionRef.current = false;
  setAnalysePhotoEdition(false);
  setMessageAnalysePhoto("");
}

async function enregistrerAnalysePhoto() {
  if (!analysePhotoFile || !analysePhotoResultat || analysePhotoSauvegardeEnCours) return;

  // Une analyse terminée est déjà persistée automatiquement.
  // Sans modification, "Enregistrer" valide simplement la fiche et ramène à l’accueil.
  if (!analysePhotoModifiee) {
    retourAccueilDepuisAnalysePhoto();
    return;
  }

  try {
    setAnalysePhotoSauvegardeEnCours(true);
    setMessageAnalysePhoto("");
    const analyseSynchronisee = synchroniserAnalysePourSauvegarde(analysePhotoResultat);
    let data;
    if (estAndroid()) {
      // v34.8 : aucune nouvelle demande d'autorisation pendant une session ouverte.
      // L'accès racine a été validé avant le choix de la photo et doit être réutilisé tel quel.
      const resultatRacineAndroidPreautorise = await obtenirDossierRacinePhotoCartelAndroid({
        ouvrirSelecteurSiNecessaire: false,
        demanderPermissionSiNecessaire: false,
      });
      if (!resultatRacineAndroidPreautorise) {
        throw new Error("L’accès au dossier racine PhotoCartel n’est plus disponible. Relance Analyser une photo pour le réautoriser.");
      }
      data = await modifierAnalysePhotoAndroid({
        fichier: analysePhotoFile,
        analyse: analyseSynchronisee,
        timestampInitial: analysePhotoTimestampInitial,
        ancienNomPhoto: analysePhotoNomAnalysee,
        ancienNomJson: analysePhotoNomJson,
        resultatRacineAndroidPreautorise,
      });
    } else {
      const formData = new FormData();
      formData.append("photo", analysePhotoFile, analysePhotoFile.name || "photo.jpeg");
      formData.append("analyse", JSON.stringify(analyseSynchronisee));
      formData.append("timestampInitial", analysePhotoTimestampInitial);
      formData.append("ancienNomPhoto", analysePhotoNomAnalysee);
      formData.append("ancienNomJson", analysePhotoNomJson);
      formData.append("dossierRacine", dossierRacineEnvoyeAuServeur());
      const response = await fetch(API_BASE + "/modifier-analyse-photo", { method: "POST", body: formData });
      data = await lireReponseJsonPhotoCartel(response, "Erreur modification analyse");
      if (!response.ok || !data.success) throw new Error(data.error || "Erreur modification analyse");
    }

    setAnalysePhotoResultat(analyseSynchronisee);
    setAnalysePhotoNomAnalysee(data.nomPhoto || "");
    setAnalysePhotoNomJson(data.nomJson || "");
    setAnalysePhotoEdition(false);
    analysePhotoAvantEditionRef.current = null;
    analysePhotoModifieeAvantEditionRef.current = false;
    setAnalysePhotoModifiee(false);
    setAnalysePhotoSauvegardee(true);
    retourAccueilDepuisAnalysePhoto();
  } catch (error) {
    console.error("Erreur enregistrement analyse modifiée :", error);
    setMessageAnalysePhoto("Erreur enregistrement analyse modifiée : " + error.message);
    window.alert("L’analyse modifiée n’a pas pu être enregistrée. " + error.message);
  } finally {
    setAnalysePhotoSauvegardeEnCours(false);
  }
}

async function handleClicEnregistrerAnalysePhoto() {
  await enregistrerAnalysePhoto();
}

function valeurAnalyse(valeur) {
  if (Array.isArray(valeur)) {
    return valeur.filter(Boolean).join(", ");
  }

  return valeur || "";
}

function afficherChampAnalyse(label, valeur, options = {}) {
  const texte = valeurAnalyse(valeur);
  const afficherVide = Boolean(options.afficherVide);

  if (!texte && !afficherVide && !analysePhotoEdition) {
    return null;
  }

  return (
    <div style={styles.analyseLigne}>
      <div style={styles.analyseLabel}>{label}</div>
      {analysePhotoEdition && CHEMINS_EDITION_ANALYSE[label] ? (
        <textarea
          value={texte}
          onChange={(event) => modifierChampAnalyse(label, event.target.value)}
          style={styles.analyseValeurEditable}
          rows={Math.max(1, Math.min(4, String(texte).split("\n").length))}
        />
      ) : (
        <div style={styles.analyseValeur}>{texte}</div>
      )}
    </div>
  );
}

function afficherTitreBlocAnalyse(titre) {
  return <div style={styles.analyseBlocTitre}>{titre}</div>;
}

function voirAnalyseComplete() {
  alert("Voir l'analyse complète : fonction disponible plus tard.");
}

function afficherBoutonAnalyseComplete() {
  return (
    <button
      type="button"
      onClick={voirAnalyseComplete}
      style={styles.boutonAnalyseComplete}
    >
      Voir l'analyse complète
    </button>
  );
}

function afficherFicheAnalyse(analyse) {
  if (!analyse) return null;

  const fiche = analyse.fiche_patrimoniale_v18 || {};
  const contextePhoto = fiche.contexte_photo || {};
  const identification = fiche.identification || {};
  const datation = fiche.datation || {};
  const localisation = fiche.localisation || {};
  const physiques = fiche.caracteristiques_physiques || {};
  const materiauxTechniques = fiche.materiaux_techniques || {};
  const visuelle = fiche.description_visuelle || {};
  const patrimoniale = fiche.analyse_patrimoniale || {};
  const historique = fiche.contexte_historique || {};
  const museographie = fiche.informations_museographiques || {};
  const conservation = fiche.etat_conservation || {};
  const paysage = fiche.paysage_environnement || {};
  const hypotheses = fiche.hypotheses || {};
  const confiance = fiche.confiance || {};

  const premiereValeur = (...valeurs) => {
    for (const valeur of valeurs) {
      if (Array.isArray(valeur)) {
        const elements = valeur.filter(Boolean);
        if (elements.length) return elements;
      } else if (valeur !== undefined && valeur !== null && String(valeur).trim() !== "") {
        return valeur;
      }
    }
    return "";
  };

  const scoreConfiance = premiereValeur(confiance.score_global, analyse.confidence);
  const paysOrigine = premiereValeur(
    identification.pays_origine,
    analyse.pays_origine,
    localisation.pays,
    analyse.pays
  );

  return (
    <>
      {afficherTitreBlocAnalyse("🎨 Résultats de la photo analysée")}

      {analysePhotoEdition ? (
        <input
          type="text"
          value={valeurAnalyse(premiereValeur(
            identification.type_general,
            analyse.type_detecte,
            identification.objet_principal,
            analyse.objet_principal,
            "Type non identifié"
          ))}
          onChange={(event) => modifierChampAnalyse("Type principal", event.target.value)}
          style={styles.analyseTypeEditable}
        />
      ) : (
        <div style={styles.analyseType}>
          {premiereValeur(
            identification.type_general,
            analyse.type_detecte,
            identification.objet_principal,
            analyse.objet_principal,
            "Type non identifié"
          )}
        </div>
      )}

      {afficherChampAnalyse("Objet", premiereValeur(identification.objet_principal, analyse.objet_principal))}
      {afficherChampAnalyse("Titre", premiereValeur(identification.nom_ou_titre, analyse.titre_fr, analyse.titre_en))}
      {afficherChampAnalyse("Titre original", premiereValeur(identification.titre_original, analyse.titre_en))}
      {afficherChampAnalyse("Auteur / créateur", premiereValeur(identification.auteur_createur_architecte, analyse.auteur_ou_createur))}
      {afficherChampAnalyse("Attribution", identification.attribution)}
      {afficherChampAnalyse("Date / période", premiereValeur(datation.date_precise, datation.periode, analyse.date_ou_periode))}
      {afficherChampAnalyse("Siècle", datation.siecle)}
      {afficherChampAnalyse("Culture", identification.culture_civilisation)}
      {afficherChampAnalyse("Pays d'origine", paysOrigine)}
      {afficherChampAnalyse("Catégorie", premiereValeur(identification.categorie, analyse.categorie))}
      {afficherChampAnalyse("Sous-type", premiereValeur(identification.sous_type, analyse.sous_type))}
      {afficherChampAnalyse("Style", premiereValeur(identification.mouvement_style, patrimoniale.style, analyse.style_ou_mouvement))}
      {afficherChampAnalyse("Fonction", premiereValeur(identification.fonction_origine, identification.fonction_actuelle, patrimoniale.fonction_patrimoniale))}

      {afficherChampAnalyse("Région d'origine / probable", localisation.region)}
      {afficherChampAnalyse("Ville liée à l'objet", premiereValeur(localisation.ville, analyse.ville))}
      {afficherChampAnalyse("Lieu lié à l'objet", premiereValeur(localisation.site_lieu, localisation.localisation_probable, analyse.lieu_probable))}
      {afficherChampAnalyse("Institution", premiereValeur(localisation.musee_institution, museographie.musee, analyse.musee_ou_institution))}
      {afficherChampAnalyse("Salle / zone", premiereValeur(localisation.salle_galerie_zone, museographie.salle))}

      {afficherChampAnalyse("Technique", premiereValeur(materiauxTechniques.technique, analyse.technique))}
      {afficherChampAnalyse("Support", premiereValeur(materiauxTechniques.support, analyse.support))}
      {afficherChampAnalyse("Matériaux", premiereValeur(materiauxTechniques.materiaux, analyse.materiaux))}
      {afficherChampAnalyse("Dimensions", premiereValeur(physiques.dimensions_originales, analyse.dimensions))}
      {afficherChampAnalyse("Hauteur", premiereValeur(physiques.hauteur, physiques.hauteur_totale))}
      {afficherChampAnalyse("Largeur", physiques.largeur)}
      {afficherChampAnalyse("Profondeur", physiques.profondeur)}
      {afficherChampAnalyse("Longueur", premiereValeur(physiques.longueur, physiques.longueur_totale))}
      {afficherChampAnalyse("Surface / superficie", premiereValeur(physiques.surface, physiques.superficie))}
      {afficherChampAnalyse("Poids", physiques.poids)}
      {afficherChampAnalyse("Étages", physiques.nombre_etages)}
      {afficherChampAnalyse("Hauteur nef", physiques.hauteur_nef)}
      {afficherChampAnalyse("Hauteur tours", physiques.hauteur_tours)}

      {afficherChampAnalyse("Contexte", premiereValeur(historique.contexte_creation, historique.contexte_culturel, historique.periode_historique))}
      {afficherChampAnalyse("Importance", patrimoniale.importance_patrimoniale)}
      {afficherChampAnalyse("Classement", premiereValeur(patrimoniale.classement_protection, patrimoniale.unesco))}
      {afficherChampAnalyse("Provenance", premiereValeur(historique.provenance_historique, museographie.provenance))}
      {afficherChampAnalyse("Inventaire", museographie.numero_inventaire)}
      {afficherChampAnalyse("État", premiereValeur(conservation.etat_apparent, visuelle.etat_visible))}

      {afficherChampAnalyse("Paysage", paysage.type_paysage)}
      {afficherChampAnalyse("Élément naturel", paysage.element_naturel_principal)}
      {afficherChampAnalyse("Parc / réserve", paysage.parc_reserve)}

      {afficherChampAnalyse("Description", premiereValeur(visuelle.description_detaillee, visuelle.description_courte, analyse.description))}
      {afficherChampAnalyse("Éléments visibles", premiereValeur(visuelle.elements_visibles, analyse.elements_visibles))}
      {afficherChampAnalyse("Mots-clés", premiereValeur(visuelle.mots_cles, analyse.mots_cles))}
      {afficherChampAnalyse("Hypothèse", hypotheses.identification_probable)}
      {afficherChampAnalyse("Notes", premiereValeur(analyse.notes, hypotheses.incertitudes))}
      {afficherChampAnalyse(
        "Confiance",
        scoreConfiance !== "" && scoreConfiance !== undefined
          ? `${Math.round(Number(scoreConfiance || 0) * 100)} %`
          : ""
      )}

      {afficherTitreBlocAnalyse("📍 Contexte de la photo")}
      {afficherChampAnalyse(
        "Pays de la photo",
        premiereValeur(contextePhoto.pays_photo, analyse.pays_photo),
        { afficherVide: true }
      )}
      {afficherChampAnalyse(
        "Ville de la photo",
        premiereValeur(contextePhoto.ville_photo, analyse.ville_photo),
        { afficherVide: true }
      )}
      {afficherChampAnalyse(
        "Site de la photo",
        premiereValeur(contextePhoto.site_photo, analyse.site_photo),
        { afficherVide: true }
      )}
    </>
  );
}


async function lancerModeDemonstration() {
  try {
    setModeDemonstrationEnCours(true);

    const response = await fetch(API_BASE + "/mode-demonstration/lancer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dossierRacine }),
    });

    const data = await lireReponseJsonPhotoCartel(
      response,
      "Erreur mode démonstration"
    );

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Erreur lancement mode démonstration");
    }

    setModeDemonstrationActif(true);
    setCheminDossierModeDemonstration(data.cheminModeDemonstration || "");
    localStorage.setItem("photoCartelModeDemonstrationActif", "true");
    localStorage.setItem(
      "photoCartelCheminModeDemonstration",
      data.cheminModeDemonstration || ""
    );

    alert(
      "Mode démonstration lancé.\n\n" +
        "Dossier :\n" +
        (data.cheminModeDemonstration || "Dossier non retourné") +
        "\n\n" +
        "Photos de référence copiées : " +
        (data.photosCopiees ?? 0) +
        "\n\n" +
        "Tu peux maintenant utiliser Analyser une photo."
    );
  } catch (error) {
    console.error(error);
    alert("Erreur mode démonstration : " + error.message);
  } finally {
    setModeDemonstrationEnCours(false);
  }
}

async function exporterPhotosModeDemonstration() {
  try {
    setModeDemonstrationEnCours(true);

    const response = await fetch(API_BASE + "/mode-demonstration/exporter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cheminModeDemonstration: cheminDossierModeDemonstration,
      }),
    });

    const data = await lireReponseJsonPhotoCartel(
      response,
      "Erreur export mode démonstration"
    );

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Erreur export mode démonstration");
    }

    alert(
      "Export du mode démonstration terminé.\n\n" +
        "Dossier exporté :\n" +
        (data.cheminExport || "Dossier non retourné") +
        "\n\n" +
        "Fichiers exportés : " +
        (data.nombreFichiers ?? "")
    );
  } catch (error) {
    console.error(error);
    alert("Erreur export mode démonstration : " + error.message);
  } finally {
    setModeDemonstrationEnCours(false);
  }
}

function sortirModeDemonstration() {
  setModeDemonstrationActif(false);
  setCheminDossierModeDemonstration("");
  localStorage.setItem("photoCartelModeDemonstrationActif", "false");
  localStorage.setItem("photoCartelCheminModeDemonstration", "");

  alert("Sortie du mode démonstration.\n\nPhotoCartel revient au mode développement.");
}

async function exporterDonneesPhotosAnalysees() {
  try {
    const url =
      API_BASE +
      "/export-analyses-csv?dossierRacine=" +
      encodeURIComponent(dossierRacineEnvoyeAuServeur());

    const response = await fetch(url);
    const contentType = response.headers.get("Content-Type") || "";
    const exportPath = response.headers.get("X-PhotoCartel-Export-Path") || "";
    const exportFile = response.headers.get("X-PhotoCartel-Export-File") || "";
    const texte = await response.text();

    let data = null;

    try {
      data = texte ? JSON.parse(texte) : null;
    } catch (parseError) {
      // Compatibilité avec un ancien serveur qui renverrait encore le CSV en réponse HTTP.
      data = null;
    }

    if (!response.ok) {
      throw new Error(data?.error || texte || "Erreur export CSV");
    }

    if (data?.success) {
      alert(
        "Export terminé.\n\n" +
          "Fichier créé :\n" +
          (data.cheminExport || data.fichier || "chemin non retourné") +
          "\n\n" +
          "Nombre de JSON exportés : " +
          (data.nombreJson ?? "")
      );
      return;
    }

    if (contentType.includes("text/csv") || exportPath || exportFile) {
      alert(
        "Export terminé.\n\n" +
          "CSV généré par le serveur.\n" +
          (exportPath ? "\nFichier créé :\n" + exportPath : "") +
          (exportFile && !exportPath ? "\nFichier :\n" + exportFile : "")
      );
      return;
    }

    throw new Error("Réponse export CSV non reconnue");
  } catch (error) {
    console.error(error);
    alert("Erreur export CSV : " + error.message);
  }
}


async function chargerGaleriePhotosAnalyseesAndroid() {
  const resultatRacineAndroid = await obtenirDossierRacinePhotoCartelAndroid();
  const dossierPhotoCartel = resultatRacineAndroid.dossierPhotoCartel;

  await verifierInfrastructureDansPhotoCartelAndroid(dossierPhotoCartel);

  const dossierPhotosAnalysees = await dossierPhotoCartel.getDirectoryHandle(
    "Photos analysées",
    { create: true }
  );

  const fiches = [];

  for await (const [nomEntree, handleEntree] of dossierPhotosAnalysees.entries()) {
    if (handleEntree.kind !== "file" || !nomEntree.toLowerCase().endsWith(".json")) {
      continue;
    }

    try {
      const fichierJson = await handleEntree.getFile();
      const contenu = JSON.parse(await fichierJson.text());
      const nomPhoto =
        contenu.nom_photo_sauvegardee ||
        nomEntree.replace(/\.json$/i, ".jpeg");

      let imageUrl = "";
      let imageExiste = false;

      try {
        const handlePhoto = await dossierPhotosAnalysees.getFileHandle(nomPhoto);
        const fichierPhoto = await handlePhoto.getFile();
        imageUrl = URL.createObjectURL(fichierPhoto);
        imageExiste = true;
      } catch (errorPhoto) {
        imageUrl = "";
      }

      fiches.push({
        nomJson: nomEntree,
        nomPhoto,
        dateAnalyseIso: contenu.date_analyse_iso || "",
        dateAnalyseLocale: contenu.date_analyse_locale || "",
        dossierDestination: "DCIM / PhotoCartel / Photos analysées",
        imageExiste,
        imageUrl,
        imageUrlLocale: true,
        analyse: contenu.analyse || {},
      });
    } catch (error) {
      console.error("ERREUR LECTURE FICHE ANDROID =", nomEntree, error);
    }
  }

  fiches.sort((a, b) =>
    String(b.dateAnalyseIso || b.nomJson).localeCompare(
      String(a.dateAnalyseIso || a.nomJson),
      "fr",
      { numeric: true }
    )
  );

  return fiches;
}

function urlPhotoGalerie(fiche) {
  if (!fiche?.imageUrl) return "";
  return fiche.imageUrlLocale ? fiche.imageUrl : API_BASE + fiche.imageUrl;
}

async function ouvrirGaleriePhotosAnalysees() {
  try {
    setModeGalerieAnalyses(true);
    setGalerieChargement(true);
    setMessageGalerieAnalyses("Chargement de la galerie...");
    setGalerieAnalyses([]);
    setGalerieIndex(0);

    let photos = [];

    if (estAndroid()) {
      photos = await chargerGaleriePhotosAnalyseesAndroid();
    } else {
      const response = await fetch(
        API_BASE +
          "/photos-analysees?dossierRacine=" +
          encodeURIComponent(dossierRacineEnvoyeAuServeur())
      );

      const data = await lireReponseJsonPhotoCartel(
        response,
        "Erreur chargement galerie"
      );

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Erreur chargement galerie");
      }

      photos = data.photos || [];
    }

    setGalerieAnalyses(photos);
    setGalerieIndex(0);
    setMessageGalerieAnalyses(
      photos.length
        ? ""
        : "Aucune photo analysée sauvegardée pour l'instant."
    );
  } catch (error) {
    console.error(error);
    setMessageGalerieAnalyses("Erreur galerie : " + error.message);
  } finally {
    setGalerieChargement(false);
  }
}

function fermerGaleriePhotosAnalysees() {
  setModeGalerieAnalyses(false);
  setGalerieAnalyses([]);
  setGalerieIndex(0);
  setGalerieChargement(false);
  setMessageGalerieAnalyses("");
}

function galeriePrecedente() {
  setMessageGalerieAnalyses("");
  setGalerieIndex((ancien) =>
    galerieAnalyses.length ? (ancien - 1 + galerieAnalyses.length) % galerieAnalyses.length : 0
  );
}

function galerieSuivante() {
  setMessageGalerieAnalyses("");
  setGalerieIndex((ancien) =>
    galerieAnalyses.length ? (ancien + 1) % galerieAnalyses.length : 0
  );
}

function handleGalerieTouchStart(event) {
  const touch = event.touches?.[0];

  if (!touch) {
    return;
  }

  galerieTouchStartXRef.current = touch.clientX;
  galerieTouchStartYRef.current = touch.clientY;
}

function handleGalerieTouchEnd(event) {
  const touch = event.changedTouches?.[0];
  const departX = galerieTouchStartXRef.current;
  const departY = galerieTouchStartYRef.current;

  galerieTouchStartXRef.current = null;
  galerieTouchStartYRef.current = null;

  if (!touch || departX === null || departY === null || galerieAnalyses.length <= 1) {
    return;
  }

  const deltaX = touch.clientX - departX;
  const deltaY = touch.clientY - departY;

  // Swipe horizontal seulement : on ignore les gestes verticaux de scroll.
  if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY) * 1.3) {
    return;
  }

  if (deltaX < 0) {
    galerieSuivante();
  } else {
    galeriePrecedente();
  }
}

async function supprimerFicheGalerie() {
  const fiche = galerieAnalyses[galerieIndex];

  if (!fiche) {
    alert("Aucune fiche à supprimer.");
    return;
  }

  const confirmation = window.confirm(
    "Supprimer définitivement cette fiche résultat ?\n\n" +
      "Photo : " + (fiche.nomPhoto || "non renseignée") + "\n" +
      "JSON : " + (fiche.nomJson || "non renseigné")
  );

  if (!confirmation) {
    return;
  }

  try {
    setGalerieChargement(true);
    setMessageGalerieAnalyses("Suppression en cours...");

    if (estAndroid()) {
      const resultatRacineAndroid = await obtenirDossierRacinePhotoCartelAndroid();
      const dossierPhotosAnalysees =
        await resultatRacineAndroid.dossierPhotoCartel.getDirectoryHandle(
          "Photos analysées",
          { create: true }
        );

      if (fiche.nomPhoto) {
        try {
          await dossierPhotosAnalysees.removeEntry(fiche.nomPhoto);
        } catch (errorPhoto) {
          console.warn("Photo déjà absente :", fiche.nomPhoto);
        }
      }

      if (fiche.nomJson) {
        try {
          await dossierPhotosAnalysees.removeEntry(fiche.nomJson);
        } catch (errorJson) {
          console.warn("JSON déjà absent :", fiche.nomJson);
        }
      }
    } else {
      const response = await fetch(API_BASE + "/photo-analysee", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nomPhoto: fiche.nomPhoto,
          nomJson: fiche.nomJson,
          dossierRacine: dossierRacineEnvoyeAuServeur(),
        }),
      });

      const data = await lireReponseJsonPhotoCartel(
        response,
        "Erreur suppression fiche"
      );

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Erreur suppression fiche");
      }
    }

    if (fiche.imageUrlLocale && fiche.imageUrl) {
      URL.revokeObjectURL(fiche.imageUrl);
    }

    setGalerieAnalyses((ancienneGalerie) => {
      const nouvelleGalerie = ancienneGalerie.filter((_, index) => index !== galerieIndex);

      setGalerieIndex((ancienIndex) => {
        if (nouvelleGalerie.length === 0) {
          return 0;
        }

        return Math.min(ancienIndex, nouvelleGalerie.length - 1);
      });

      setMessageGalerieAnalyses(
        nouvelleGalerie.length
          ? ""
          : "Aucune photo analysée sauvegardée pour l'instant."
      );

      return nouvelleGalerie;
    });
  } catch (error) {
    console.error(error);
    alert("Erreur suppression fiche : " + error.message);
  } finally {
    setGalerieChargement(false);
  }
}

function ouvrirSelectionActualisationPhotos() {
  // v30.x : le bouton Ranger ne demande plus de sélectionner des fichiers.
  // Il déplace automatiquement les photos déjà présentes dans Collecte Photo en cours
  // vers les dossiers des visites clôturées, selon les fenêtres début/fin de visite.
  return handleRangerPhotosVisites();
}

async function handleActualiserPhotos(event) {
  const fichiersSelectionnes = Array.from(event.target.files || []);

  if (fichiersSelectionnes.length === 0) {
    return;
  }

  if (!cheminCollecteActif) {
    alert("Aucun dossier de visite actif.");
    return;
  }

  const debutMs = Number(localStorage.getItem("photoCartelDebutVisiteMs") || 0);

  const fichiersDepuisDebut = debutMs
    ? fichiersSelectionnes.filter((fichier) => fichier.lastModified >= debutMs - 60000)
    : fichiersSelectionnes;

  if (fichiersDepuisDebut.length === 0) {
    setMessageActualisation(
      "Total de la visite : " + photosCollectees + " photo(s)."
    );
    return;
  }

  try {
    setActualisationEnCours(true);
    setMessageActualisation("Rangement des photos de la visite en cours...");

    const formData = new FormData();
    formData.append("cheminDestination", cheminCollecteActif);

    for (const fichier of fichiersDepuisDebut) {
      formData.append("photos", fichier, fichier.name);
    }

    const response = await fetch(API_BASE + "/actualiser-photos-visite", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!data.success) {
      setMessageActualisation("Erreur rangement des photos : " + data.error);
      afficherMessageDiscretArborescence("⚠️ Erreur rangement des photos : " + data.error);
      return;
    }

    const total = Number(data.totalDestination || 0);

    setPhotosCollectees(total);
    localStorage.setItem("photoCartelPhotosCollectees", String(total));
    setDerniereActualisation(data);
    setMessageActualisation(`Total de la visite : ${total} photo(s).`);
    setDerniereActionVisite("Photos rangées le " + formaterDate(new Date()));
  } catch (error) {
    console.error(error);
    setMessageActualisation("Erreur rangement des photos : " + error.message);
    afficherMessageDiscretArborescence("⚠️ Erreur rangement des photos : " + error.message);
  } finally {
    setActualisationEnCours(false);
  }
}

async function creerTamponCollecteLibreEtOuvrirCamera() {
  if (!voyage) {
    alert("Aucun voyage actif");
    return;
  }

  const maintenant = new Date();
  const nomTampon = nomVisiteRapide(maintenant);
  const cheminTampon = villeVisite
    ? `${cheminVilleMetier(voyage, villeVisite)}\\${nomTampon}`
    : `${cheminVoyageMetier(voyage)}\\${nomTampon}`;

  try {
    const response = await fetch(API_BASE + "/creer-dossier", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chemin: cheminTampon,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      alert("Erreur création dossier tampon : " + data.error);
      return;
    }

    const cheminTamponServeur = data.chemin || cheminTampon;

    setStatutVisite("EN_COURS");
    setDateFinVisite(null);
    setDossierTampon(nomTampon);
    setCheminTamponActif(cheminTamponServeur);
    setLieuVisite(nomTampon);
    setTypeVisite("");
    setModeAucuneVisite(false);
    setDerniereActionVisite("Collecte libre créée le " + formaterDate(maintenant));

    localStorage.setItem("photoCartelStatutVisite", "EN_COURS");
    localStorage.setItem("photoCartelLieuActif", nomTampon);
    localStorage.setItem("photoCartelTypeVisiteActif", "");
    localStorage.setItem("photoCartelDossierTamponActif", nomTampon);
    localStorage.setItem("photoCartelCheminTamponActif", cheminTamponServeur);
    localStorage.setItem("photoCartelDebutVisiteMs", String(maintenant.getTime()));

    setTimeout(() => {
      ouvrirAppareilPhoto();
    }, 0);
  } catch (error) {
    console.error(error);
    alert("Erreur lors de la création du dossier tampon");
  }
}

async function handlePhotosPrises(event) {
  const fichiers = Array.from(event.target.files || []);

  if (fichiers.length === 0) {
    return;
  }

  try {
    let resultatEnregistrement = null;

    if (estAndroid()) {
      resultatEnregistrement = await enregistrerPhotosVisiteDansCollecteAndroid(fichiers);
    } else {
      const formData = new FormData();
      formData.append("dossierRacine", dossierRacineEnvoyeAuServeur());

      for (const fichier of fichiers) {
        formData.append("photos", fichier, fichier.name || "photo.jpg");
      }

      const response = await fetch(API_BASE + "/enregistrer-photos-visite", {
        method: "POST",
        body: formData,
      });

      const data = await lireReponseJsonPhotoCartel(
        response,
        "Erreur enregistrement photos visite"
      );

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Erreur enregistrement photos visite");
      }

      resultatEnregistrement = data;
    }

    const nombreSauvegarde =
      resultatEnregistrement?.fichiersSauvegardes?.length ||
      resultatEnregistrement?.copies ||
      fichiers.length;

    setPhotosCollectees((ancienTotal) => {
      const nouveauTotal = ancienTotal + nombreSauvegarde;
      localStorage.setItem("photoCartelPhotosCollectees", String(nouveauTotal));
      return nouveauTotal;
    });

    setDerniereActionVisite(
      `✅ ${nombreSauvegarde} photo(s) enregistrée(s) dans Collecte Photo en cours.`
    );
  } catch (error) {
    console.error(error);
    setDerniereActionVisite(
      "Erreur enregistrement photo visite : " + (error?.message || String(error))
    );
  }

  if (estAndroid() && voyage) {
    window.setTimeout(() => {
      ouvrirAppareilPhoto();
    }, 500);
  }
}



  function statutLisible() {
    if (statutVisite === "TERMINEE") return "TERMINÉE";
    if (resultatClassification) return "CLASSIFIÉE";
    return "EN COURS";
  }

  async function creerVisiteRapide() {
    if (!voyage) {
      alert("Aucun voyage actif");
      return;
    }

    // v31 : une visite rapide ne demande jamais de ville.
    // Sa ville officielle est toujours la valeur métier neutre, sans reprendre la ville précédente.
    const villeCible = "Ville non renseignée";
    const dossierVilleStockage = "Visites rapides";

    const maintenant = new Date();
    const nomTampon = nomVisiteRapide(maintenant);
    const estTamponActif = estNomVisiteRapide(lieuVisite);
    const visitePrecedenteExiste = Boolean(String(lieuVisite || "").trim());
    const cheminParentTampon = cheminVilleMetier(voyage, dossierVilleStockage);
    const cheminTampon = `${cheminParentTampon}\\${nomTampon}`;

    try {
      let cheminTamponServeur = cheminTampon;

      if (estAndroid()) {
        const resultatAndroid = await creerDossiersNouvelleVisiteAndroid({
          voyageNom: voyage,
          villeNom: dossierVilleStockage,
          visiteNom: nomTampon,
          typeVisiteNom: "",
        });

        if (!resultatAndroid?.success) {
          throw new Error(
            resultatAndroid?.raison || "Le dossier de visite rapide Android n'a pas été créé."
          );
        }

        cheminTamponServeur = resultatAndroid.cheminLisible;
      } else {
        const response = await fetch(API_BASE + "/creer-visite-metier", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nomVoyage: voyage,
            nomVille: villeCible,
            nomVisite: nomTampon,
            typeVisite: "",
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data?.error || "Erreur création de la visite rapide");
        }

        cheminTamponServeur = data.chemin || cheminTampon;
      }

      // On ne clôture et ne mémorise une ancienne visite que si elle existe réellement.
      if (visitePrecedenteExiste) {
        cloturerVisitePourRangement({
          voyageNom: voyage,
          villeNom: villeVisite || villeCible,
          visiteNom: lieuVisite,
          finMs: maintenant.getTime(),
          nombrePhotos: photosCollectees || 0,
        });

        const debutVisiteStocke = Number(
          localStorage.getItem("photoCartelDebutVisiteMs") || 0
        );
        const derniereVisiteInfo = {
          nom: lieuVisite,
          ville: villeVisite || villeCible,
          type: estTamponActif ? "" : typeVisite || "",
          dateCloture: formaterDate(maintenant),
          duree: debutVisiteStocke
            ? formaterDuree(maintenant.getTime() - debutVisiteStocke)
            : "",
          nombrePhotos: photosCollectees || 0,
        };

        setDerniereVisite(derniereVisiteInfo);
        localStorage.setItem(
          "photoCartelDerniereVisite",
          JSON.stringify(derniereVisiteInfo)
        );
      }

      // La nouvelle visite rapide ouvre immédiatement sa propre fenêtre de rangement.
      ouvrirVisitePourRangement({
        voyageNom: voyage,
        villeNom: villeCible,
        visiteNom: nomTampon,
        typeVisiteNom: "",
        cheminVisite: cheminTamponServeur,
        debutMs: maintenant.getTime(),
      });

      setVilleVisite(villeCible);
      setStatutVisite("EN_COURS");
      setDateFinVisite(null);
      setDossierTampon(nomTampon);
      setCheminTamponActif(cheminTamponServeur);
      setLieuVisite(nomTampon);
      setTypeVisite("");
      setDerniereActionVisite(
        visitePrecedenteExiste
          ? `${estTamponActif ? "Visite rapide clôturée" : "Visite clôturée"} le ${formaterDate(maintenant)}. Nouvelle visite rapide active : ${nomTampon}`
          : `Première visite rapide créée le ${formaterDate(maintenant)} : ${nomTampon}`
      );
      setPhotosCollectees(0);
      localStorage.setItem("photoCartelPhotosCollectees", "0");
      setMessageActualisation("");
      setDerniereActualisation(null);

      localStorage.setItem("photoCartelStatutVisite", "EN_COURS");
      localStorage.setItem("photoCartelVilleActive", villeCible);
      localStorage.setItem("photoCartelLieuActif", nomTampon);
      localStorage.setItem("photoCartelTypeVisiteActif", "");
      localStorage.setItem("photoCartelDossierTamponActif", nomTampon);
      localStorage.setItem("photoCartelCheminTamponActif", cheminTamponServeur);
      localStorage.setItem("photoCartelDebutVisiteMs", String(maintenant.getTime()));

      setModeCreationVisite(false);
      setVilleNouvelleVisite("");
      setLieuNouvelleVisite("");

      afficherMessageDiscretArborescence(
        "✅ Nouvelle visite créée : " + nomTampon
      );
    } catch (error) {
      console.error(error);
      alert(
        "Erreur lors de la création de la visite rapide :\n\n" +
          (error?.message || String(error))
      );
    }
  }


  function finDeVisite() {
    if (!voyage) {
      alert("Aucun voyage actif");
      return;
    }

    // v30.6 : Fin de visite n'impose plus automatiquement un dossier tampon.
    // Il ouvre la même fenêtre que Nouvelle visite, avec un titre adapté.
    // Annuler ne clôture rien ; la visite actuelle reste active.
    ouvrirFenetreCreationVisite("suivante");
  }

  function construireTableauClassification(data, dateDebut, dateFin) {
    const stats = {
      Oeuvres: 0,
      Cartels: 0,
      Architecture: 0,
      Jardins: 0,
      A_verifier_classification: 0,
    };

    if (data.resultats) {
      for (const ligne of data.resultats) {
        if (stats[ligne.categorie] !== undefined) {
          stats[ligne.categorie] += 1;
        } else {
          stats.A_verifier_classification += 1;
        }
      }
    }

    return {
      fichierTraite: dossierImport || "Dossier sélectionné",
      dateTraitement: formaterDate(dateFin),
      dureeTraitement: formaterDuree(dateFin.getTime() - dateDebut.getTime()),
      stats,
      total: data.total ?? data.resultats?.length ?? 0,
      destination: data.cheminDestination || cheminCible,
    };
  }

  function handleSelectionDossier(event) {
    const fichiers = Array.from(event.target.files || []);

    const photos = fichiers.filter((fichier) => {
      const nom = fichier.name.toLowerCase();
      return (
        nom.endsWith(".jpg") ||
        nom.endsWith(".jpeg") ||
        nom.endsWith(".png") ||
        nom.endsWith(".webp")
      );
    });

    if (photos.length === 0) {
      alert("Aucune photo trouvée dans ce dossier");
      setFichiersImport([]);
      setDossierImport("");
      setNombrePhotos(0);
      setMessageImport("");
      setResultatClassification(null);
      return;
    }

    const premierChemin =
      photos[0].webkitRelativePath || photos[0].name || "Dossier sélectionné";

    const nomDossier = premierChemin.includes("/")
      ? premierChemin.split("/")[0]
      : "Dossier sélectionné";

    setFichiersImport(photos);
    setDossierImport(nomDossier);
    setNombrePhotos(photos.length);
    setResultatClassification(null);
    setMessageImport(`${photos.length} photos sélectionnées`);
  }



function handleSelectionDossierRenommage(event) {
  const fichiers = Array.from(event.target.files || []);

  cheminRenommagePrepareRef.current = "";
  setCheminRenommagePrepare("");
  setRenommagePret(false);

  if (fichiers.length === 0) {
    setFichiersRenommage([]);
    setDossierRenommage("");
    setNombrePhotosRenommage(0);
    setMessageRenommage("Aucun fichier sélectionné pour renommage");
    return;
  }

  const photos = fichiers.filter((fichier) => {
    const nom = fichier.name.toLowerCase();
    return (
      nom.endsWith(".jpg") ||
      nom.endsWith(".jpeg") ||
      nom.endsWith(".png") ||
      nom.endsWith(".webp")
    );
  });

  const premierChemin =
    photos[0]?.webkitRelativePath || fichiers[0]?.webkitRelativePath || fichiers[0]?.name;

  const nomDossier = premierChemin?.includes("/")
    ? premierChemin.split("/")[0]
    : "Dossier sélectionné";

  setFichiersRenommage(photos);
  setDossierRenommage(nomDossier);
  setNombrePhotosRenommage(photos.length);
  setMessageRenommage(`${photos.length} fichiers sélectionnés pour renommage`);
}




  async function classifierDossierTest(fichiersAUtiliser = fichiersImport) {
    try {
      const listeFichiers = Array.from(fichiersAUtiliser || []);
      const photos = listeFichiers.filter((fichier) => {
        const nom = fichier.name.toLowerCase();
        return (
          nom.endsWith(".jpg") ||
          nom.endsWith(".jpeg") ||
          nom.endsWith(".png") ||
          nom.endsWith(".webp")
        );
      });

      if (photos.length === 0) {
        alert("Aucune photo trouvée dans ce dossier");
        setFichiersImport([]);
        setDossierImport("");
        setNombrePhotos(0);
        setMessageImport("");
        setResultatClassification(null);
        return;
      }

      if (!cheminCible) {
        alert("Chemin de destination manquant");
        return;
      }

      const premierChemin =
        photos[0].webkitRelativePath || photos[0].name || "Dossier sélectionné";

      const nomDossierLocal = premierChemin.includes("/")
        ? premierChemin.split("/")[0]
        : dossierImport || "Dossier sélectionné";

      setFichiersImport(photos);
      setDossierImport(nomDossierLocal);
      setNombrePhotos(photos.length);
      setResultatClassification(null);

      // v16.5 : un seul tableau de bord visible à la fois.
      // Une nouvelle classification remplace automatiquement le dernier résultat affiché.
      setDashboardRenommage(null);
      setMessageRenommage("");
      setDossierRenommage("");
      setNombrePhotosRenommage(0);
      cheminRenommagePrepareRef.current = "";
      setCheminRenommagePrepare("");
      setRenommagePret(false);
      setRenommageFinalTermine(false);

      const dateDebut = new Date();

      setClassificationEnCours(true);
      setMessageImport(
        `Classification en cours du dossier "${nomDossierLocal}" : ${photos.length} photos à traiter.`
      );

      const formData = new FormData();

      for (const fichier of photos) {
        formData.append("photos", fichier, fichier.name);
      }

      const timestampClassification = new Date()
        .toISOString()
        .replace(/:/g, "-")
        .replace("T", "_")
        .slice(0, 16);

      const nomDossierSortie =
        `${nomDossierLocal}_classifié_${timestampClassification}Z`;

      const cheminDestinationClassification =
        `${dossierRacine}\\Classifications\\${nomDossierSortie}`;

      formData.append("cheminDestination", cheminDestinationClassification);

      const response = await fetch(API_BASE + "/classifier-fichiers", {
        method: "POST",
        body: formData,
      });

      const texteReponse = await response.text();

      let data;
      try {
        data = JSON.parse(texteReponse);
      } catch (e) {
        throw new Error(
          "Réponse serveur non JSON : " + texteReponse.slice(0, 200)
        );
      }

      const dateFin = new Date();

      if (data.success) {
        data.cheminDestination = cheminDestinationClassification;

        const tableau = construireTableauClassification(data, dateDebut, dateFin);
        tableau.fichierTraite = nomDossierLocal;
        tableau.destination = cheminDestinationClassification;

        setResultatClassification(tableau);
        setMessageImport("Classification terminée");
        setDerniereActionVisite(
          `Classification terminée le ${formaterDate(dateFin)}`
        );
      } else {
        setMessageImport("Erreur classification");
        alert(data.error || "Erreur classification");
      }
    } catch (error) {
      console.error(error);
      setMessageImport("Erreur classification : " + error.message);
      alert(error.message);
    } finally {
      setClassificationEnCours(false);
    }
  }


async function renommerOeuvresTest(fichiersAUtiliser = fichiersRenommage) {
  try {
    const listeFichiers = Array.from(fichiersAUtiliser || []).filter((fichier) => {
      const nom = fichier.name.toLowerCase();
      return (
        nom.endsWith(".jpg") ||
        nom.endsWith(".jpeg") ||
        nom.endsWith(".png") ||
        nom.endsWith(".webp")
      );
    });

    cheminRenommagePrepareRef.current = "";
    setCheminRenommagePrepare("");
    setRenommagePret(false);
    setDashboardRenommage(null);
    setRenommageFinalTermine(false);

    // v16.5 : un seul tableau de bord visible à la fois.
    // Un nouveau renommage remplace automatiquement le dernier résultat affiché.
    setResultatClassification(null);
    setMessageImport("");
    setDossierImport("");
    setNombrePhotos(0);

    if (listeFichiers.length === 0) {
      setMessageRenommage("Aucune photo trouvée pour le renommage.");
      setRenommageFinalEnCours(false);
      return;
    }

    const cheminRelatif = listeFichiers[0]?.webkitRelativePath || "";
    const nomDossierSource = cheminRelatif
      ? cheminRelatif.split("/")[0]
      : dossierRenommage || "Dossier_selectionne";

    setDossierRenommage(nomDossierSource);
    setNombrePhotosRenommage(listeFichiers.length);
    setRenommageFinalEnCours(true);
    setMessageRenommage(
      `Renommage en cours du dossier "${nomDossierSource}" : ${listeFichiers.length} photos à traiter.`
    );

    const formData = new FormData();

    for (const fichier of listeFichiers) {
      formData.append("oeuvres", fichier, fichier.name);
    }

    formData.append("dossierSource", nomDossierSource);
    formData.append("dossierRacine", dossierRacine);
    formData.append("nomDossierSource", nomDossierSource);

    const response = await fetch(API_BASE + "/renommer-oeuvres-fichiers", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log("DATA BRUTE RENOMMAGE =", data);

    if (!response.ok || !data.success) {
      const message = data.error || "Erreur pendant la préparation du renommage";
      setRenommageFinalEnCours(false);
      setMessageRenommage("Erreur renommage : " + message);
      return;
    }

    const cheminPrepare = data.cheminDestination || "";

    if (!cheminPrepare) {
      console.error("AUCUN CHEMIN RETOURNE PAR LE SERVEUR =", data);
      setRenommageFinalEnCours(false);
      setMessageRenommage(
        "Renommage impossible : le serveur n'a pas retourné le chemin complet du dossier de renommage."
      );
      return;
    }

    console.log("DATA PREPARATION =", data);
    console.log("CHEMIN PREPARE =", cheminPrepare);

    cheminRenommagePrepareRef.current = cheminPrepare;
    setCheminRenommagePrepare(cheminPrepare);

    await lancerRenommageFinal(cheminPrepare, nomDossierSource);
  } catch (error) {
    console.error(error);
    setRenommageFinalEnCours(false);
    setMessageRenommage("Erreur renommage : " + error.message);
  }
}


async function lancerRenommageFinal(cheminForce = "", dossierForce = "") {
  try {

setDashboardRenommage(null);
setRenommageFinalEnCours(true);
setRenommageFinalTermine(false);

    const cheminFinal =
      cheminForce ||
      cheminRenommagePrepareRef.current ||
      cheminRenommagePrepare ||
      document.querySelector("[data-chemin-renommage]")?.dataset.cheminRenommage ||
      "";

    console.log("REF =", cheminRenommagePrepareRef.current);
    console.log("STATE =", cheminRenommagePrepare);
    console.log("CHEMIN FINAL UTILISÉ =", cheminFinal);

    if (!cheminFinal) {
      console.error("CHEMIN RENOMMAGE VIDE AU LANCEMENT", {
        ref: cheminRenommagePrepareRef.current,
        state: cheminRenommagePrepare,
        dossierRenommage,
      });

      setMessageRenommage(
        "Renommage impossible : clique d'abord sur « Renommer des œuvres » et attends la fin de la préparation."
      );

      return;
    }

    setMessageRenommage(
      `Renommage en cours du dossier "${dossierForce || dossierRenommage}"...`
    );

    console.log("APPEL /renommer-oeuvres");
    console.log("CHEMIN ENVOYE =", cheminFinal);

    const response = await fetch(API_BASE + "/renommer-oeuvres", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cheminVisite: cheminFinal,
      }),
    });

    const data = await response.json();
    console.log("RESULTAT RENOMMAGE FINAL =", data);

   if (data.success) {

  setDashboardRenommage(data.dashboardRenommage);

  setRenommageFinalTermine(true);
  setRenommageFinalEnCours(false);

  setMessageRenommage(
    `Renommage terminé : ${data.renommes} œuvres renommées, ${data.aVerifier} à vérifier.`
  );

  setDerniereActionVisite(
    `Renommage terminé le ${formaterDate(new Date())}`
  );

} else {

  setRenommageFinalEnCours(false);

  setMessageRenommage(
    "Erreur renommage final : " + data.error
  );
}




 } catch (error) {
  console.error(error);

  setRenommageFinalEnCours(false);

  setMessageRenommage(
    "Erreur renommage final : " + error.message
  );
}
}


  const nomCartel =
    nomFinal.length > 4 ? nomFinal.replace(".jpg", "_CARTEL.jpg") : "";

  function genererNomPropose(analyse, timestamp) {
    if (!analyse) return "";

    const artiste = analyse.artist?.trim() || "artiste inconnu";
    const titre =
      analyse.title_fr?.trim() || analyse.title_en?.trim() || "titre inconnu";
    const date = analyse.date?.trim();

    let nom = `${timestamp}, ${artiste}, '${titre}'`;

    if (date) {
      nom += `, ${date}`;
    }

    nom += ".jpg";

    nom = nom.replace(/[<>:"/\\|?*]/g, "").replace(/\s+/g, " ").trim();

    return nom;
  }

  const creerDossier = async () => {
    try {
      const response = await fetch(API_BASE + "/creer-dossier", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chemin: cheminCible,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Dossier créé avec succès");
      } else {
        alert("Erreur : " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Impossible de contacter le serveur");
    }
  };

  const creerCategoriesMusee = async (afficherAlerte = true) => {
    try {
      const response = await fetch(
        API_BASE + "/creer-categories-musee",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chemin: cheminCible,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        if (afficherAlerte) {
          alert("Catégories créées :\n\n" + data.categories.join("\n"));
        }
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Erreur serveur");
    }
  };

const validerNouveauVoyage = async () => {
  // v28.2.7 : sur Android, la création d'un voyage ne demande plus aucune autorisation.
  // Le dossier physique sera créé au moment de la première visite, quand DCIM sera sélectionné.
  const nomVoyage = nomNouveauVoyage.trim();

  if (voyage) {
    alert(
      "Impossible de créer un nouveau voyage tant que le voyage en cours n'est pas clos."
    );
    return;
  }

  if (!nomVoyage) {
    alert("Nom de voyage manquant");
    return;
  }

  const cheminVoyage = cheminVoyageMetier(nomVoyage);

  try {
    let cheminVoyageServeur = cheminVoyage;

    if (!estAndroid()) {
      const response = await fetch(API_BASE + "/creer-voyage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nomVoyage,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        alert("Erreur création voyage : " + data.error);
        return;
      }

      cheminVoyageServeur = data.chemin || cheminVoyage;
      console.log("Voyage créé côté serveur :", cheminVoyageServeur);
    } else {
      cheminVoyageServeur =
        "DCIM / PhotoCartel / Voyages / " +
        nettoyerNomDossierLocal(nomVoyage) +
        " (créé physiquement lors de la première visite)";
      console.log("Voyage Android mémorisé sans demande de permission :", cheminVoyageServeur);
    }

    setVoyage(nomVoyage);
    setVilleVisite("");
    setLieuVisite("");

    localStorage.setItem("photoCartelVoyageActif", nomVoyage);
    localStorage.setItem("photoCartelVilleActive", "");
    localStorage.setItem("photoCartelLieuActif", "");

    setTypeVisite("");
    setTypeNouvelleVisite("Musée");

    setVisiteActive(null);
    setStatutVisite("EN_COURS");
    setDateFinVisite(null);
    setDossierTampon("");
    setCheminTamponActif("");
    setDerniereActionVisite("Nouveau voyage créé le " + formaterDate(new Date()));
    setPhotosCollectees(0);
    localStorage.setItem("photoCartelPhotosCollectees", "0");
    setMessageActualisation("");
    setDerniereActualisation(null);
    setResultatClassification(null);
    setDashboardRenommage(null);
    setMessageImport("");
    setMessageRenommage("");

    setNomNouveauVoyage("");
    setModeCreationVoyage(false);
    setModeGestionVoyage(false);

    afficherMessageDiscretArborescence("✅ Voyage créé : " + nomVoyage);
    console.log("Voyage créé :", nomVoyage, "Dossier :", cheminVoyageServeur);
  } catch (error) {
    console.error(error);
    alert("Erreur lors de la création du voyage :\n\n" + (error?.message || String(error)));
  }
};

const validerNouvelleVisite = async () => {
  // v28.2.8 : création de la visite métier.
  // Sur Android, le dossier est créé localement dans DCIM/PhotoCartel via showDirectoryPicker.
  // Sur PC/local, le serveur continue de créer C:\PhotoCartel\Voyages\...
  const ville = villeNouvelleVisite.trim();
  const nomVisite = lieuNouvelleVisite.trim();
  const type = typeNouvelleVisite || "Musée";

  if (!voyage) {
    alert("Aucun voyage actif");
    return;
  }

  if (!ville) {
    alert("Ville manquante");
    return;
  }

  if (!nomVisite) {
    alert("Nom de la visite manquant");
    return;
  }

  const cheminVisite = cheminVisiteMetier(voyage, ville, nomVisite);

  try {
    let cheminVisiteFinal = cheminVisite;
    let resultatVisiteAndroid = null;

    if (estAndroid()) {
      try {
        resultatVisiteAndroid = await creerDossiersNouvelleVisiteAndroid({
          voyageNom: voyage,
          villeNom: ville,
          visiteNom: nomVisite,
          typeVisiteNom: type,
        });
      } catch (errorAndroid) {
        console.error("Erreur création visite Android", errorAndroid);
        alert(
          "Création de la visite annulée : le dossier Android n'a pas été créé.\n\n" +
            (errorAndroid?.message || String(errorAndroid))
        );
        return;
      }

      if (
        resultatVisiteAndroid &&
        !resultatVisiteAndroid.success &&
        !resultatVisiteAndroid.ignore
      ) {
        alert(
          resultatVisiteAndroid.raison ||
            "Création de la visite annulée : dossier Android non sélectionné."
        );
        return;
      }

      if (resultatVisiteAndroid?.success) {
        cheminVisiteFinal = resultatVisiteAndroid.cheminLisible;
      }
    }

    if (!resultatVisiteAndroid?.success) {
      let data = null;

      try {
        const response = await fetch(API_BASE + "/creer-visite-metier", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nomVoyage: voyage,
            nomVille: ville,
            nomVisite,
            typeVisite: type,
          }),
        });

        const texte = await response.text();

        try {
          data = JSON.parse(texte);
        } catch (parseError) {
          throw new Error(
            "Réponse serveur non JSON pour /creer-visite-metier : " +
              texte.slice(0, 200)
          );
        }

        if (!response.ok || !data.success) {
          throw new Error(data?.error || "Erreur serveur /creer-visite-metier");
        }

        cheminVisiteFinal = data.chemin || cheminVisite;
      } catch (erreurRouteVisite) {
        console.warn(
          "Route /creer-visite-metier indisponible, fallback /creer-dossier :",
          erreurRouteVisite
        );

        const responseFallback = await fetch(API_BASE + "/creer-dossier", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chemin: cheminVisite,
          }),
        });

        const texteFallback = await responseFallback.text();
        let dataFallback = null;

        try {
          dataFallback = JSON.parse(texteFallback);
        } catch (parseError) {
          throw new Error(
            "Réponse serveur non JSON pour /creer-dossier : " +
              texteFallback.slice(0, 200)
          );
        }

        if (!responseFallback.ok || !dataFallback.success) {
          throw new Error(
            dataFallback?.error ||
              "Erreur serveur /creer-dossier après échec /creer-visite-metier"
          );
        }

        cheminVisiteFinal = dataFallback.chemin || cheminVisite;
      }
    }

    const debutNouvelleVisiteMs = Date.now();

    // v30.x : fermeture éventuelle du dossier tampon actif, puis ouverture de la vraie visite
    // pour le futur rangement automatique des photos.
    cloturerVisitePourRangement({
      voyageNom: voyage,
      villeNom: villeVisite || ville,
      visiteNom: lieuVisite,
      finMs: debutNouvelleVisiteMs,
      nombrePhotos: photosCollectees || 0,
    });

    ouvrirVisitePourRangement({
      voyageNom: voyage,
      villeNom: ville,
      visiteNom: nomVisite,
      typeVisiteNom: type,
      cheminVisite: cheminVisiteFinal,
      debutMs: debutNouvelleVisiteMs,
    });

    setVilleVisite(ville);
    setLieuVisite(nomVisite);
    setTypeVisite(type);
    setTypeNouvelleVisite(type);

    localStorage.setItem("photoCartelVilleActive", ville);
    memoriserDerniereVilleDuVoyage(voyage, ville);
    localStorage.setItem("photoCartelLieuActif", nomVisite);
    localStorage.setItem("photoCartelTypeVisiteActif", type);
    localStorage.setItem("photoCartelDebutVisiteMs", String(debutNouvelleVisiteMs));

    setVisiteActive({
      nom: nomVisite,
      chemin: cheminVisiteFinal,
      type,
      ville,
      voyage,
      dateCreation: new Date(debutNouvelleVisiteMs).toISOString(),
    });
    setStatutVisite("EN_COURS");
    setDateFinVisite(null);
    setDossierTampon("");
    setCheminTamponActif("");
    setDerniereActionVisite("Visite créée le " + formaterDate(new Date(debutNouvelleVisiteMs)));
    setPhotosCollectees(0);
    localStorage.setItem("photoCartelPhotosCollectees", "0");
    setMessageActualisation("");
    setDerniereActualisation(null);
    setResultatClassification(null);
    setDashboardRenommage(null);
    setMessageImport("");
    setMessageRenommage("");

    setVilleNouvelleVisite("");
    setLieuNouvelleVisite("");
    setModeCreationVisite(false);

    afficherMessageDiscretArborescence("✅ Nouvelle visite créée : " + nomVisite);
    console.log("Visite créée :", {
      nomVisite,
      ville,
      type,
      chemin: cheminVisiteFinal,
    });
  } catch (error) {
    console.error(error);
    alert(
      "Erreur lors de la création de la visite :\n\n" +
        (error?.message || String(error))
    );
  }
};



  const handleOeuvreChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setOeuvreFile(file);
    setOeuvreFileName(file.name);

    const reader = new FileReader();

    reader.onload = () => {
      setOeuvreImageUrl(reader.result);
    };

    reader.readAsDataURL(file);
  };

  async function detecterEtRecadrerCartel(imageSrc) {
    return new Promise((resolve) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        try {
          const src = cv.imread(canvas);

          const gray = new cv.Mat();
          cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

          const blurred = new cv.Mat();
          cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);

          const edges = new cv.Mat();
          cv.Canny(blurred, edges, 50, 150);

          const contours = new cv.MatVector();
          const hierarchy = new cv.Mat();

          cv.findContours(
            edges,
            contours,
            hierarchy,
            cv.RETR_EXTERNAL,
            cv.CHAIN_APPROX_SIMPLE
          );

          let meilleurRect = null;
          let meilleureSurface = 0;

          for (let i = 0; i < contours.size(); i++) {
            const contour = contours.get(i);
            const rect = cv.boundingRect(contour);
            const surface = rect.width * rect.height;

            if (surface > meilleureSurface) {
              meilleureSurface = surface;
              meilleurRect = rect;
            }
          }

          if (!meilleurRect) {
            resolve(imageSrc);
            return;
          }

          const recadreCanvas = document.createElement("canvas");

          recadreCanvas.width = meilleurRect.width;
          recadreCanvas.height = meilleurRect.height;

          const recadreCtx = recadreCanvas.getContext("2d");

          recadreCtx.drawImage(
            img,
            meilleurRect.x,
            meilleurRect.y,
            meilleurRect.width,
            meilleurRect.height,
            0,
            0,
            meilleurRect.width,
            meilleurRect.height
          );

          const imageRecadree = recadreCanvas.toDataURL("image/jpeg");

          src.delete();
          gray.delete();
          blurred.delete();
          edges.delete();
          contours.delete();
          hierarchy.delete();

          resolve(imageRecadree);
        } catch (err) {
          console.error(err);
          resolve(imageSrc);
        }
      };

      img.src = imageSrc;
    });
  }

  async function ameliorerImage(imageSrc) {
    return new Promise((resolve) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width * 2;
        canvas.height = img.height * 2;

        ctx.filter = "grayscale(100%) contrast(250%) brightness(120%)";
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const imageAmelioree = canvas.toDataURL("image/jpeg");
        console.log("Image améliorée créée");
        resolve(imageAmelioree);
      };

      img.src = imageSrc;
    });
  }

  const handleCartelChange = async (event) => {
    const file = event.target.files[0];
    alert("FICHIER SELECTIONNE");

    if (!file) return;

    setCartelFile(file);

    const reader = new FileReader();

    reader.onload = async () => {
      try {
        console.log("XXXXXXXXXXXXXXXX ETAPE 1 XXXXXXXXXXXXXXXX");
        const imageDataOriginal = reader.result;

        const imageRecadree = await detecterEtRecadrerCartel(imageDataOriginal);

        console.log("ETAPE 2");

        setCartelRecadreUrl(imageRecadree);

        const imageDataAmelioree = await ameliorerImage(imageRecadree);

        console.log("ETAPE 3");

        setCartelImageUrl(imageDataAmelioree);

        setCartelText("OCR en cours...");
        setAnalyseMusee(null);

        console.log("ETAPE 4");

        const resultatOriginal = await Tesseract.recognize(
          imageDataOriginal,
          "eng+kor"
        );

        console.log("ETAPE 5");

        const scoreOriginal = resultatOriginal.data.confidence;

        const resultAmeliore = await Tesseract.recognize(
          imageDataAmelioree,
          "eng+kor"
        );

        const scoreAmeliore = resultAmeliore.data.confidence;

        console.log("OCR ORIGINAL COMPLET");
        console.log(resultatOriginal.data.text);

        console.log("OCR AMELIORE COMPLET");
        console.log(resultAmeliore.data.text);

        console.log("Score original :", scoreOriginal);
        console.log("Score amélioré :", scoreAmeliore);

        let texte;

        if (scoreAmeliore > scoreOriginal) {
          console.log("OCR amélioré retenu");
          texte = resultAmeliore.data.text;
        } else {
          console.log("OCR original retenu");
          texte = resultatOriginal.data.text;
        }

        setCartelText(texte);

        const response = await fetch(API_BASE + "/analyse-cartel", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            texte,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setAnalyseMusee(data.result);

          console.log("RESULTAT IA =", data.result);

          const nomGenere = genererNomPropose(data.result, timestamp);

          console.log("TIMESTAMP =", timestamp);
          console.log("RESULT IA =", data.result);
          console.log("NOM GENERE =", nomGenere);

          setNomEdite(nomGenere);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error(error);
        setCartelText("Erreur OCR");
      }
    };

    reader.readAsDataURL(file);
  };

  const timestampBrut = oeuvreFileName
    ? oeuvreFileName.replace(/\.[^.]+$/, "").replace(/^IMG/i, "")
    : "";

  const timestamp = (() => {
    if (/^\d{8}_\d{6}$/.test(timestampBrut)) {
      return timestampBrut;
    }

    const match = timestampBrut.match(
      /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/
    );

    if (match) {
      return `${match[1]}${match[2]}${match[3]}_${match[4]}${match[5]}${match[6]}`;
    }

    return timestampBrut;
  })();

  const confidence = analyseMusee?.confidence || 0;

  const afficherLigne = (label, valeur) => {
    if (!valeur) return null;

    return (
      <tr>
        <td>
          <strong>{label}</strong>
        </td>
        <td>{valeur}</td>
      </tr>
    );
  };

  const nomPropose = (() => {
    if (!oeuvreFileName) return "";

    const confidence = analyseMusee?.confidence ?? 0;

    if (confidence < 0.5) {
      return `${timestamp}, A_CLASSIFIER.jpg`;
    }

    const artiste = analyseMusee?.artist || "";

    const titre =
      analyseMusee?.title_fr || analyseMusee?.title_en || "A_CLASSIFIER";

    const date = analyseMusee?.date || "";

    let morceaux = [];

    if (timestamp) morceaux.push(timestamp);
    if (artiste) morceaux.push(artiste);

    morceaux.push(`'${titre}'`);

    if (date) morceaux.push(date);

    return morceaux.join(", ") + ".jpg";
  })();

  const estCollecteLibre = estNomVisiteRapide(lieuVisite);

  const typeVisiteAffiche = estCollecteLibre
    ? "—"
    : typeVisite || "—";

  const valeurOuVide = (valeur, secours) => valeur || secours;

  const themePhotoCartel = {
    ivoire: "#f8f3ea",
    ivoireClair: "#fffdf8",
    ivoireCarte: "rgba(255, 253, 248, 0.94)",
    encre: "#171a1f",
    texte: "#2d2a25",
    texteDoux: "#746b5f",
    or: "#b58a3a",
    orFonce: "#7a5520",
    orClair: "#ead8b5",
    bordureOr: "rgba(181, 138, 58, 0.26)",
    ombreCarte: "0 18px 44px rgba(80, 62, 38, 0.11)",
    ombreLegere: "0 10px 26px rgba(80, 62, 38, 0.08)",
    ombreBouton: "0 10px 22px rgba(122, 85, 32, 0.14)",
    rayonCarte: "22px",
    rayonBouton: "16px",
    font: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
  };

  const baseStyles = {
    page: {
      minHeight: "100vh",
      background: "#f7f3ec",
      fontFamily: "Inter, Arial, sans-serif",
      padding: "72px 18px 104px",
      paddingBottom: "104px",
      color: "#192028",
    },
    modalFond: {
      position: "fixed",
      inset: 0,
      zIndex: 3000,
      background: "rgba(17, 24, 32, 0.45)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "22px",
      boxSizing: "border-box",
    },
    modalCarte: {
      width: "100%",
      maxWidth: "390px",
      background: "#fffdf8",
      borderRadius: "24px",
      padding: "22px",
      boxSizing: "border-box",
      boxShadow: "0 22px 60px rgba(0,0,0,0.25)",
      border: "1px solid rgba(199,166,110,0.35)",
    },
    modalTitre: {
      margin: "0 0 8px",
      color: "#111820",
      fontSize: "24px",
      fontWeight: "800",
    },
    modalTexte: {
      margin: "0 0 18px",
      color: "#666",
      lineHeight: 1.35,
      fontSize: "15px",
    },
    modalBoutonPrincipal: {
      width: "100%",
      border: "none",
      borderRadius: "16px",
      padding: "15px 16px",
      marginBottom: "12px",
      background: "#8a6a35",
      color: "white",
      fontSize: "17px",
      fontWeight: "800",
      cursor: "pointer",
    },
    modalBoutonSecondaire: {
      width: "100%",
      border: "1px solid rgba(138,106,53,0.45)",
      borderRadius: "16px",
      padding: "15px 16px",
      marginBottom: "12px",
      background: "white",
      color: "#111820",
      fontSize: "17px",
      fontWeight: "800",
      cursor: "pointer",
    },
    modalBoutonAnnuler: {
      width: "100%",
      border: "none",
      borderRadius: "16px",
      padding: "13px 16px",
      background: "transparent",
      color: "#77736c",
      fontSize: "15px",
      fontWeight: "800",
      cursor: "pointer",
    },
    barreSuperieure: {
      position: "fixed",
      top: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: "100%",
      maxWidth: "430px",
      minHeight: "54px",
      zIndex: 9998,
      boxSizing: "border-box",
      padding: "8px 12px",
      paddingTop: "calc(8px + env(safe-area-inset-top))",
      backgroundColor: "rgba(255,253,248,0.96)",
      borderBottom: "1px solid rgba(199,166,110,0.22)",
      boxShadow: "0 8px 24px rgba(91,67,38,0.10)",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      fontFamily: "Inter, Arial, sans-serif",
      backdropFilter: "blur(12px)",
    },
    barreSuperieureMenu: {
      width: "30px",
      height: "30px",
      border: "none",
      backgroundColor: "transparent",
      color: "#30363d",
      fontSize: "22px",
      lineHeight: "30px",
      fontWeight: "700",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      cursor: "default",
      flex: "0 0 auto",
    },
    barreSuperieureLogo: {
      width: "42px",
      height: "42px",
      borderRadius: "13px",
      display: "block",
      objectFit: "cover",
      border: "1px solid rgba(201,161,74,0.45)",
      boxShadow: "0 6px 16px rgba(0,0,0,0.18)",
      flex: "0 0 auto",
    },
    barreSuperieureTitre: {
      fontSize: "15px",
      lineHeight: "18px",
      fontWeight: "800",
      letterSpacing: "-0.03em",
      color: "#111820",
      margin: 0,
      whiteSpace: "nowrap",
    },
    barreSuperieureVersion: {
      marginLeft: "2px",
      padding: "3px 6px",
      borderRadius: "8px",
      backgroundColor: "#fffdf8",
      border: "1px solid rgba(199,166,110,0.34)",
      color: "#111820",
      fontSize: "10px",
      lineHeight: "14px",
      fontWeight: "800",
      letterSpacing: "-0.02em",
      whiteSpace: "nowrap",
    },
    barreSuperieureEspace: {
      flex: 1,
    },
    barreSuperieureIcone: {
      width: "28px",
      height: "28px",
      border: "none",
      backgroundColor: "transparent",
      color: "#30363d",
      fontSize: "18px",
      lineHeight: "28px",
      fontWeight: "800",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      cursor: "default",
      flex: "0 0 auto",
    },
    telephone: {
      width: "100%",
      maxWidth: "430px",
      margin: "0 auto",
      padding: "20px 18px 104px",
      boxSizing: "border-box",
    },
    hero: {
      display: "flex",
      alignItems: "center",
      gap: "14px",
      minHeight: "96px",
      margin: "0 0 16px",
      background: "#fffdf8",
      borderRadius: "24px",
      padding: "18px 16px",
      boxShadow: "0 10px 28px rgba(40,35,28,0.07)",
    },
    logoIcone: {
      fontSize: "38px",
      color: "#8a6a35",
      lineHeight: 1,
    },
    titre: {
      fontSize: "32px",
      margin: 0,
      fontWeight: "500",
      letterSpacing: "-0.04em",
      color: "#111820",
    },
    carteEtat: {
      backgroundColor: "rgba(255,255,255,0.88)",
      border: "1px solid rgba(199,166,110,0.22)",
      borderRadius: "20px",
      padding: "18px 20px",
      boxShadow: "0 10px 28px rgba(40,35,28,0.07)",
      marginBottom: "18px",
    },
    sectionTitre: {
      margin: "0 0 14px",
      color: "#7a5c2d",
      fontFamily: "Arial, sans-serif",
      fontSize: "13px",
      fontWeight: "800",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
    },
    etatPrincipal: {
      fontSize: "28px",
      lineHeight: 1.1,
      color: "#111820",
      margin: "0 0 16px",
    },
    ligneEtat: {
      display: "grid",
      gridTemplateColumns: "34px 1fr",
      gap: "12px",
      padding: "13px 0",
      borderTop: "1px solid rgba(20,20,20,0.08)",
      alignItems: "center",
    },
    ligneEtatIcone: {
      color: "#8a6a35",
      fontSize: "22px",
      textAlign: "center",
    },
    ligneEtatLabel: {
      fontFamily: "Arial, sans-serif",
      fontSize: "11px",
      lineHeight: 1.15,
      color: "#77736c",
      fontWeight: "800",
      textTransform: "uppercase",
      letterSpacing: "0.09em",
    },
    ligneEtatValeur: {
      marginTop: "3px",
      fontSize: "20px",
      lineHeight: 1.25,
      color: "#161b22",
      wordBreak: "break-word",
    },
    grilleActions: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "12px",
      margin: "18px 0",
    },
    carteAction: {
      minHeight: "142px",
      border: "1px solid rgba(199,166,110,0.16)",
      borderRadius: "16px",
      backgroundColor: "rgba(255,255,255,0.86)",
      boxShadow: "0 10px 26px rgba(91,67,38,0.09)",
      padding: "14px 10px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "12px",
      cursor: "pointer",
      color: "#111820",
      fontFamily: "Inter, Arial, sans-serif",
    },
    carteActionIconeRond: {
      width: "58px",
      height: "58px",
      borderRadius: "50%",
      backgroundColor: "#f0eadf",
      color: "#8a6a35",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "28px",
    },
    carteActionTitre: {
      fontSize: "17px",
      fontWeight: "700",
      lineHeight: 1.12,
      textAlign: "center",
    },
    compteurCarte: {
      backgroundColor: "rgba(255,255,255,0.84)",
      border: "1px solid rgba(199,166,110,0.16)",
      borderRadius: "16px",
      boxShadow: "0 10px 26px rgba(91,67,38,0.08)",
      padding: "14px 18px",
      display: "grid",
      gridTemplateColumns: "44px 1fr auto",
      gap: "12px",
      alignItems: "center",
      margin: "0 0 18px",
    },
    compteurIcone: {
      width: "42px",
      height: "42px",
      borderRadius: "50%",
      backgroundColor: "#f0eadf",
      color: "#8a6a35",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "20px",
    },
    compteurLabel: {
      fontFamily: "Arial, sans-serif",
      color: "#66615c",
      fontSize: "15px",
      fontWeight: "700",
    },
    compteurValeur: {
      fontSize: "20px",
      color: "#111820",
      fontWeight: "700",
      minWidth: "30px",
      textAlign: "right",
    },
    carteDerniereVisite: {
      backgroundColor: "rgba(255,255,255,0.86)",
      border: "1px solid rgba(199,166,110,0.16)",
      borderRadius: "18px",
      boxShadow: "0 10px 26px rgba(91,67,38,0.08)",
      padding: "18px",
      marginBottom: "18px",
    },
    detailLigne: {
      display: "grid",
      gridTemplateColumns: "30px 1fr auto",
      gap: "10px",
      padding: "9px 0",
      borderTop: "1px solid rgba(20,20,20,0.07)",
      alignItems: "center",
    },
    detailIcone: {
      color: "#8a6a35",
      textAlign: "center",
      fontSize: "18px",
    },
    detailLabel: {
      fontFamily: "Arial, sans-serif",
      color: "#69645d",
      fontSize: "13px",
      fontWeight: "700",
    },
    detailValeur: {
      fontSize: "14px",
      fontWeight: "700",
      textAlign: "right",
      color: "#111820",
      maxWidth: "160px",
      wordBreak: "break-word",
    },
    boutonLigne: {
      width: "100%",
      border: "1px solid rgba(199,132,24,0.65)",
      background: "rgba(255,255,255,0.82)",
      color: "#7a5c2d",
      borderRadius: "12px",
      padding: "12px 14px",
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      fontWeight: "800",
      cursor: "pointer",
    },
    resultatPage: {
      display: "grid",
      gap: "16px",
    },
    resultatSucces: {
      backgroundColor: "rgba(238,249,232,0.88)",
      border: "1px solid rgba(76,147,59,0.18)",
      borderRadius: "18px",
      padding: "18px",
      boxShadow: "0 10px 26px rgba(91,67,38,0.08)",
      display: "grid",
      gridTemplateColumns: "56px 1fr",
      gap: "14px",
      alignItems: "center",
    },
    resultatIconeSucces: {
      width: "52px",
      height: "52px",
      borderRadius: "50%",
      backgroundColor: "rgba(92,166,74,0.13)",
      color: "#2f8a2f",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "30px",
      fontWeight: "800",
    },
    resultatTitre: {
      margin: 0,
      fontSize: "22px",
      fontWeight: "700",
    },
    resultatTexte: {
      margin: "5px 0 0",
      fontFamily: "Arial, sans-serif",
      fontSize: "13px",
      color: "#5f665c",
      lineHeight: 1.35,
    },
    resumeGrille: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "8px",
    },
    resumeItem: {
      padding: "10px 6px",
      textAlign: "center",
      borderRight: "1px solid rgba(20,20,20,0.07)",
    },
    resumeIcone: {
      width: "38px",
      height: "38px",
      borderRadius: "50%",
      margin: "0 auto 7px",
      backgroundColor: "#f0eadf",
      color: "#8a6a35",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "19px",
    },
    resumeValeur: {
      fontSize: "16px",
      fontWeight: "800",
      color: "#111820",
    },
    resumeLabel: {
      fontFamily: "Arial, sans-serif",
      fontSize: "10px",
      color: "#65615c",
      fontWeight: "800",
      lineHeight: 1.15,
      marginTop: "3px",
    },
    libelle: {
      textAlign: "left",
      fontSize: "15px",
      fontWeight: "700",
      margin: "14px 0 6px",
    },
    champ: {
      backgroundColor: "#fffaf3",
      border: "1px solid rgba(199,166,110,0.35)",
      borderRadius: "12px",
      padding: "10px 12px",
      fontSize: "15px",
      fontWeight: "700",
      textAlign: "center",
    },
    champSecondaire: {
      marginTop: "4px",
      fontSize: "12px",
      fontWeight: "700",
      color: "#6b7280",
    },
    separateur: {
      border: 0,
      borderTop: "1px solid rgba(20,20,20,0.12)",
      margin: "18px 0",
    },
    bouton: {
      display: "block",
      width: "100%",
      margin: "9px auto",
      padding: "12px 14px",
      borderRadius: "12px",
      border: "1px solid rgba(199,132,24,0.55)",
      backgroundColor: "rgba(255,255,255,0.88)",
      color: "#111820",
      fontSize: "15px",
      fontWeight: "800",
      cursor: "pointer",
      fontFamily: "Arial, sans-serif",
    },
    boutonTraitement: {
      display: "block",
      width: "100%",
      margin: "9px auto",
      padding: "12px 14px",
      borderRadius: "12px",
      border: "1px solid rgba(199,132,24,0.55)",
      backgroundColor: "rgba(255,255,255,0.88)",
      color: "#156b37",
      fontSize: "15px",
      fontWeight: "800",
      cursor: "pointer",
      textAlign: "center",
      fontFamily: "Arial, sans-serif",
    },
    boutonBas: {
      display: "block",
      width: "100%",
      margin: "9px auto",
      padding: "12px 14px",
      borderRadius: "12px",
      border: "1px solid rgba(199,132,24,0.55)",
      backgroundColor: "rgba(255,255,255,0.88)",
      color: "#7a5c2d",
      fontSize: "15px",
      fontWeight: "800",
      cursor: "pointer",
      textAlign: "center",
      fontFamily: "Arial, sans-serif",
    },
    panneauInfo: {
      marginTop: "16px",
      padding: "14px",
      border: "1px solid rgba(199,166,110,0.25)",
      borderRadius: "14px",
      backgroundColor: "rgba(255,255,255,0.86)",
      fontSize: "14px",
      lineHeight: "1.5",
      textAlign: "left",
      wordBreak: "break-word",
      boxShadow: "0 10px 26px rgba(91,67,38,0.08)",
    },
    bandeauModeDemonstration: {
      backgroundColor: "rgba(237, 250, 241, 0.94)",
      border: "1px solid rgba(39, 174, 96, 0.24)",
      borderRadius: "16px",
      boxShadow: "0 10px 26px rgba(33, 125, 74, 0.08)",
      padding: "14px 16px",
      marginBottom: "18px",
      textAlign: "left",
    },
    bandeauModeDemonstrationTitre: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      color: "#103f27",
      fontFamily: "Arial, sans-serif",
      fontSize: "13px",
      fontWeight: "900",
      textTransform: "uppercase",
      letterSpacing: "0.06em",
    },
    pointModeDemonstration: {
      color: "#2ecc71",
      fontSize: "18px",
      lineHeight: 1,
    },
    bandeauModeDemonstrationTexte: {
      margin: "8px 0 0",
      color: "#2f5d45",
      fontFamily: "Arial, sans-serif",
      fontSize: "12px",
      fontWeight: "700",
      lineHeight: 1.35,
    },
    parametresSection: {
      marginTop: "14px",
      padding: "14px",
      borderRadius: "16px",
      backgroundColor: "rgba(255,255,255,0.76)",
      border: "1px solid rgba(199,166,110,0.22)",
    },
    parametresTexte: {
      margin: "0 0 10px",
      color: "#192028",
      fontSize: "14px",
      lineHeight: 1.4,
    },
    parametresChemin: {
      margin: "0 0 12px",
      padding: "10px",
      borderRadius: "10px",
      backgroundColor: "#f7f3ec",
      color: "#6b5f4f",
      fontSize: "12px",
      lineHeight: 1.35,
      wordBreak: "break-word",
      fontFamily: "Arial, sans-serif",
      fontWeight: "700",
    },
    modalOverlay: {
      position: "fixed",
      zIndex: 9998,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.45)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    },
    modal: {
      backgroundColor: "#fffdf9",
      width: "100%",
      maxWidth: "420px",
      borderRadius: "20px",
      padding: "22px",
      boxShadow: "0 18px 45px rgba(0,0,0,0.26)",
      border: "1px solid rgba(199,166,110,0.20)",
      fontFamily: "Arial, sans-serif",
    },
    input: {
      width: "100%",
      boxSizing: "border-box",
      padding: "10px",
      marginTop: "6px",
      marginBottom: "12px",
      borderRadius: "8px",
      border: "1px solid #aaa",
      fontSize: "15px",
    },
    analyseEcran: {
      position: "fixed",
      zIndex: 9997,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "#f7f3ec",
      backgroundColor: "#f7f3ec",
      isolation: "isolate",
      overflowY: "auto",
      padding: "58px 18px 18px",
      paddingBottom: "104px",
      color: "#192028",
      fontFamily: "Inter, Arial, sans-serif",
    },
    analyseTelephone: {
      width: "100%",
      maxWidth: "430px",
      margin: "0 auto",
      padding: "8px 0 96px",
      position: "relative",
      zIndex: 1,
    },
    analyseMiniature: {
      display: "block",
      width: "72%",
      maxHeight: "230px",
      objectFit: "contain",
      margin: "10px auto 18px",
      borderRadius: "14px",
      border: "1px solid rgba(199,166,110,0.30)",
      backgroundColor: "white",
      cursor: "pointer",
      boxShadow: "0 8px 24px rgba(91,67,38,0.14)",
    },
    dateHeurePhotoCarte: {
      backgroundColor: "rgba(255,255,255,0.96)",
      border: "1px solid rgba(199,166,110,0.20)",
      borderRadius: "14px",
      padding: "5px 11px",
      margin: "0 0 9px",
      boxShadow: "0 8px 20px rgba(91,67,38,0.06)",
      textAlign: "left",
      fontFamily: "Arial, sans-serif",
      display: "grid",
      gap: "0px",
    },
    dateHeurePhotoLigne: {
      display: "grid",
      gridTemplateColumns: "104px minmax(0, 1fr)",
      alignItems: "center",
      gap: "7px",
      minWidth: 0,
      whiteSpace: "nowrap",
    },
    dateHeurePhotoLabel: {
      color: "#263a5f",
      fontSize: "14px",
      fontWeight: "900",
      marginBottom: "0",
      lineHeight: "1.15",
    },
    dateHeurePhotoValeur: {
      color: "#111827",
      fontSize: "15px",
      fontWeight: "700",
      lineHeight: "1.15",
    },
    analyseCarte: {
      backgroundColor: "rgba(255,255,255,0.96)",
      border: "1px solid rgba(199,166,110,0.20)",
      borderRadius: "18px",
      padding: "10px 12px 12px",
      boxShadow: "0 10px 26px rgba(91,67,38,0.08)",
      textAlign: "left",
    },
    analyseBlocTitre: {
      margin: "0 0 5px",
      padding: "8px 10px",
      borderRadius: "10px",
      backgroundColor: "#f7f3ff",
      color: "#4c1d95",
      fontSize: "17px",
      fontWeight: "900",
      textAlign: "left",
      fontFamily: "Arial, sans-serif",
    },
    analyseType: {
      textAlign: "center",
      fontSize: "21px",
      fontWeight: "900",
      margin: "2px 0 8px",
      color: "#5b31a6",
      fontFamily: "Arial, sans-serif",
    },
    analyseLigne: {
      display: "grid",
      gridTemplateColumns: "118px 1fr",
      gap: "10px",
      padding: "8px 0",
      borderBottom: "1px solid #eef1f6",
      fontSize: "14px",
      lineHeight: "1.35",
      fontFamily: "Arial, sans-serif",
    },
    analyseLabel: {
      fontWeight: "800",
      color: "#263a5f",
    },
    analyseValeur: {
      color: "#111827",
      wordBreak: "break-word",
    },
    analyseValeurEditable: {
      width: "100%",
      boxSizing: "border-box",
      border: "1px solid #c9b98f",
      borderRadius: "7px",
      padding: "5px 7px",
      font: "inherit",
      color: "#111827",
      backgroundColor: "#fffdf7",
      resize: "vertical",
    },
    analyseTypeEditable: {
      display: "block",
      width: "100%",
      boxSizing: "border-box",
      margin: "2px 0 8px",
      padding: "7px 9px",
      border: "1px solid #8b6cc3",
      borderRadius: "9px",
      textAlign: "center",
      fontSize: "20px",
      fontWeight: "900",
      color: "#5b31a6",
      backgroundColor: "#fffdf7",
    },
    boutonInterrompreAnalyse: {
      width: "100%",
      border: "2px solid #8d4d3f",
      borderRadius: "12px",
      padding: "13px 16px",
      backgroundColor: "#fff8f4",
      color: "#7b3328",
      fontSize: "16px",
      fontWeight: "900",
      cursor: "pointer",
      fontFamily: "Arial, sans-serif",
      boxShadow: "0 5px 12px rgba(123, 51, 40, 0.14)",
    },
    boutonLancerAnalysePrincipal: {
      width: "100%",
      border: "none",
      borderRadius: "12px",
      padding: "13px 16px",
      backgroundColor: "#6f4f20",
      color: "white",
      fontSize: "16px",
      fontWeight: "900",
      cursor: "pointer",
      fontFamily: "Arial, sans-serif",
    },
    analyseBoutons: {
      marginTop: "16px",
      display: "grid",
      gap: "10px",
    },
    galerieCompteur: {
      textAlign: "center",
      fontFamily: "Arial, sans-serif",
      fontSize: "13px",
      fontWeight: "800",
      color: "#6f665a",
    },
    galerieAideSwipe: {
      margin: "12px 0 0",
      textAlign: "center",
      fontSize: "13px",
      color: "#6f665a",
      fontWeight: "700",
      fontFamily: "Arial, sans-serif",
    },
    boutonAnalyseSauver: {
      width: "100%",
      padding: "11px 12px",
      borderRadius: "12px",
      border: "1px solid #2f7b36",
      backgroundColor: "#1f8f3a",
      color: "white",
      fontSize: "15px",
      fontWeight: "800",
      cursor: "pointer",
      fontFamily: "Arial, sans-serif",
    },
    boutonAnalyseSecondaire: {
      width: "100%",
      padding: "11px 12px",
      borderRadius: "12px",
      border: "1px solid rgba(199,132,24,0.55)",
      backgroundColor: "rgba(255,255,255,0.9)",
      color: "#7a5c2d",
      fontSize: "15px",
      fontWeight: "800",
      cursor: "pointer",
      fontFamily: "Arial, sans-serif",
    },
    boutonAnalyseComplete: {
      width: "100%",
      marginTop: "16px",
      padding: "11px 12px",
      borderRadius: "12px",
      border: "1px solid #5b2aa0",
      backgroundColor: "#f4ecff",
      color: "#5b2aa0",
      fontSize: "15px",
      fontWeight: "800",
      cursor: "pointer",
      fontFamily: "Arial, sans-serif",
    },
    boutonAnalyseFermer: {
      width: "100%",
      padding: "11px 12px",
      borderRadius: "12px",
      border: "1px solid #9a3412",
      backgroundColor: "#fff7ed",
      color: "#9a3412",
      fontSize: "15px",
      fontWeight: "800",
      cursor: "pointer",
      fontFamily: "Arial, sans-serif",
    },
    titreFicheResultat: {
      margin: "0 0 5px",
      textAlign: "center",
      fontSize: "22px",
      lineHeight: "1.15",
      fontWeight: "900",
      letterSpacing: "-0.5px",
      color: "#192028",
      fontFamily: "Inter, Arial, sans-serif",
    },
    barreActionsFiche: {
      position: "fixed",
      left: "50%",
      transform: "translateX(-50%)",
      width: "100%",
      maxWidth: "430px",
      bottom: "calc(58px + env(safe-area-inset-bottom))",
      zIndex: 9998,
      boxSizing: "border-box",
      display: "grid",
      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
      gap: "2px",
      padding: "7px 7px 8px",
      background:
        "linear-gradient(180deg, rgba(239,224,190,0.98), rgba(249,243,230,0.98))",
      borderTop: "2px solid rgba(154,111,43,0.58)",
      borderBottom: "1px solid rgba(154,111,43,0.28)",
      boxShadow: "0 -10px 26px rgba(91,67,38,0.18)",
      backdropFilter: "blur(14px)",
      fontFamily: "Arial, sans-serif",
    },
    barreActionsFicheBouton: {
      appearance: "none",
      border: "none",
      backgroundColor: "transparent",
      color: "#6f4f20",
      minWidth: 0,
      padding: "3px 1px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "2px",
      cursor: "default",
      fontFamily: "Arial, sans-serif",
    },
    barreActionsFicheIcone: {
      fontSize: "19px",
      lineHeight: "20px",
    },
    barreActionsFicheTexte: {
      width: "100%",
      fontSize: "8px",
      lineHeight: "9px",
      fontWeight: "850",
      textAlign: "center",
      whiteSpace: "normal",
      overflowWrap: "anywhere",
    },
    barreActionsGalerie: {
      position: "fixed",
      left: "50%",
      transform: "translateX(-50%)",
      width: "100%",
      maxWidth: "430px",
      bottom: "calc(58px + env(safe-area-inset-bottom))",
      zIndex: 9998,
      boxSizing: "border-box",
      display: "grid",
      gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
      gap: "2px",
      padding: "7px 5px 8px",
      background:
        "linear-gradient(180deg, rgba(239,224,190,0.98), rgba(249,243,230,0.98))",
      borderTop: "2px solid rgba(154,111,43,0.58)",
      borderBottom: "1px solid rgba(154,111,43,0.28)",
      boxShadow: "0 -10px 26px rgba(91,67,38,0.18)",
      backdropFilter: "blur(14px)",
      fontFamily: "Arial, sans-serif",
    },
    barreFixe: {
      position: "fixed",
      left: "50%",
      transform: "translateX(-50%)",
      width: "100%",
      maxWidth: "430px",
      bottom: 0,
      zIndex: 9999,
      boxSizing: "border-box",
      backgroundColor: "rgba(255,255,255,0.94)",
      borderTop: "1px solid rgba(199,166,110,0.20)",
      boxShadow: "0 -8px 24px rgba(91,67,38,0.10)",
      padding: "8px 8px 9px",
      paddingBottom: "calc(9px + env(safe-area-inset-bottom))",
      display: "grid",
      gridTemplateColumns: "repeat(5, 1fr)",
      gap: "4px",
      fontFamily: "Arial, sans-serif",
      backdropFilter: "blur(12px)",
    },
    barreFixeBouton: {
      border: "none",
      backgroundColor: "transparent",
      color: "#6a6f73",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "3px",
      padding: "5px 2px",
      minWidth: 0,
      cursor: "pointer",
    },
    barreFixeIcone: {
      fontSize: "22px",
      lineHeight: "22px",
    },
    barreFixeTexte: {
      fontSize: "9px",
      lineHeight: "10px",
      fontWeight: "700",
      whiteSpace: "normal",
      overflow: "hidden",
      textOverflow: "clip",
      maxWidth: "100%",
      textAlign: "center",
    },
    pleinEcranPhoto: {
      position: "fixed",
      zIndex: 10000,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "black",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0",
    },
    pleinEcranImage: {
      maxWidth: "100%",
      maxHeight: "100%",
      objectFit: "contain",
      touchAction: "pinch-zoom",
    },

  };

  const styles = {
    ...baseStyles,
    page: {
      ...baseStyles.page,
      background:
        "radial-gradient(circle at 50% -10%, rgba(234,216,181,0.60) 0, rgba(248,243,234,0.92) 34%, #f6efe3 100%)",
      color: themePhotoCartel.encre,
      fontFamily: themePhotoCartel.font,
      padding: "66px 14px 94px",
      paddingBottom: "94px",
    },
    telephone: {
      ...baseStyles.telephone,
      maxWidth: "430px",
      padding: "10px 14px 88px",
    },
    barreSuperieure: {
      ...baseStyles.barreSuperieure,
      minHeight: "58px",
      padding: "8px 12px",
      paddingTop: "calc(8px + env(safe-area-inset-top))",
      backgroundColor: "rgba(255,253,248,0.97)",
      borderBottom: `1px solid ${themePhotoCartel.bordureOr}`,
      boxShadow: "0 10px 30px rgba(67, 49, 28, 0.12)",
      fontFamily: themePhotoCartel.font,
      backdropFilter: "blur(16px)",
    },
    barreSuperieureLogo: {
      ...baseStyles.barreSuperieureLogo,
      width: "40px",
      height: "40px",
      borderRadius: "14px",
      border: `1px solid ${themePhotoCartel.bordureOr}`,
      boxShadow: "0 8px 18px rgba(64, 47, 28, 0.18)",
    },
    barreSuperieureTitre: {
      ...baseStyles.barreSuperieureTitre,
      color: themePhotoCartel.encre,
      fontSize: "15px",
      fontWeight: "850",
      letterSpacing: "-0.02em",
    },
    barreSuperieureVersion: {
      ...baseStyles.barreSuperieureVersion,
      backgroundColor: "rgba(234,216,181,0.32)",
      color: themePhotoCartel.orFonce,
      border: `1px solid ${themePhotoCartel.bordureOr}`,
      fontWeight: "900",
    },
    barreSuperieureMenu: {
      ...baseStyles.barreSuperieureMenu,
      color: themePhotoCartel.encre,
      fontWeight: "800",
    },
    barreSuperieureIcone: {
      ...baseStyles.barreSuperieureIcone,
      color: themePhotoCartel.encre,
      fontWeight: "850",
    },
    hero: {
      ...baseStyles.hero,
      background:
        "linear-gradient(135deg, rgba(255,253,248,0.94), rgba(244,235,219,0.92))",
      border: `1px solid ${themePhotoCartel.bordureOr}`,
      borderRadius: themePhotoCartel.rayonCarte,
      boxShadow: themePhotoCartel.ombreCarte,
    },
    titre: {
      ...baseStyles.titre,
      color: themePhotoCartel.encre,
      fontFamily: themePhotoCartel.font,
      fontWeight: "750",
      letterSpacing: "-0.045em",
    },
    carteEtat: {
      ...baseStyles.carteEtat,
      background:
        "linear-gradient(180deg, rgba(255,253,248,0.98), rgba(251,247,239,0.94))",
      border: `1px solid ${themePhotoCartel.bordureOr}`,
      borderRadius: themePhotoCartel.rayonCarte,
      padding: "15px 16px",
      boxShadow: themePhotoCartel.ombreCarte,
      marginBottom: "13px",
    },
    sectionTitre: {
      ...baseStyles.sectionTitre,
      color: themePhotoCartel.orFonce,
      fontFamily: themePhotoCartel.font,
      fontSize: "11px",
      letterSpacing: "0.12em",
      margin: "0 0 10px",
    },
    etatPrincipal: {
      ...baseStyles.etatPrincipal,
      color: themePhotoCartel.encre,
      fontSize: "24px",
      fontWeight: "760",
      margin: "0 0 10px",
      letterSpacing: "-0.035em",
    },
    ligneEtat: {
      ...baseStyles.ligneEtat,
      gridTemplateColumns: "30px 1fr",
      gap: "10px",
      padding: "9px 0",
      borderTop: "1px solid rgba(91,67,38,0.10)",
    },
    ligneEtatIcone: {
      ...baseStyles.ligneEtatIcone,
      color: themePhotoCartel.or,
      fontSize: "19px",
    },
    ligneEtatLabel: {
      ...baseStyles.ligneEtatLabel,
      color: themePhotoCartel.texteDoux,
      fontFamily: themePhotoCartel.font,
      fontSize: "10px",
      letterSpacing: "0.11em",
    },
    ligneEtatValeur: {
      ...baseStyles.ligneEtatValeur,
      color: themePhotoCartel.encre,
      fontSize: "17px",
      fontWeight: "720",
    },
    grilleActions: {
      ...baseStyles.grilleActions,
      gap: "10px",
      margin: "13px 0",
    },
    carteAction: {
      ...baseStyles.carteAction,
      minHeight: "106px",
      background:
        "linear-gradient(180deg, rgba(255,253,248,0.98), rgba(248,243,234,0.92))",
      border: `1px solid ${themePhotoCartel.bordureOr}`,
      borderRadius: "20px",
      boxShadow: themePhotoCartel.ombreLegere,
      padding: "10px 8px",
      gap: "9px",
      color: themePhotoCartel.encre,
      fontFamily: themePhotoCartel.font,
    },
    carteActionIconeRond: {
      ...baseStyles.carteActionIconeRond,
      width: "48px",
      height: "48px",
      background:
        "linear-gradient(135deg, rgba(234,216,181,0.82), rgba(255,253,248,0.92))",
      color: themePhotoCartel.orFonce,
      boxShadow: "inset 0 0 0 1px rgba(181,138,58,0.20)",
      fontSize: "24px",
    },
    carteActionTitre: {
      ...baseStyles.carteActionTitre,
      fontSize: "14px",
      fontWeight: "820",
      color: themePhotoCartel.encre,
      letterSpacing: "-0.015em",
    },
    compteurCarte: {
      ...baseStyles.compteurCarte,
      background: themePhotoCartel.ivoireCarte,
      border: `1px solid ${themePhotoCartel.bordureOr}`,
      boxShadow: themePhotoCartel.ombreLegere,
      padding: "11px 14px",
      margin: "0 0 13px",
    },
    compteurIcone: {
      ...baseStyles.compteurIcone,
      backgroundColor: "rgba(234,216,181,0.68)",
      color: themePhotoCartel.orFonce,
    },
    compteurLabel: {
      ...baseStyles.compteurLabel,
      color: themePhotoCartel.texteDoux,
      fontFamily: themePhotoCartel.font,
      fontSize: "13px",
    },
    compteurValeur: {
      ...baseStyles.compteurValeur,
      color: themePhotoCartel.encre,
      fontWeight: "850",
    },
    carteDerniereVisite: {
      ...baseStyles.carteDerniereVisite,
      background: themePhotoCartel.ivoireCarte,
      border: `1px solid ${themePhotoCartel.bordureOr}`,
      borderRadius: "20px",
      boxShadow: themePhotoCartel.ombreLegere,
      padding: "15px 16px",
      marginBottom: "13px",
    },
    detailLigne: {
      ...baseStyles.detailLigne,
      padding: "8px 0",
      borderTop: "1px solid rgba(91,67,38,0.10)",
    },
    detailIcone: {
      ...baseStyles.detailIcone,
      color: themePhotoCartel.or,
    },
    detailLabel: {
      ...baseStyles.detailLabel,
      color: themePhotoCartel.texteDoux,
      fontFamily: themePhotoCartel.font,
    },
    detailValeur: {
      ...baseStyles.detailValeur,
      color: themePhotoCartel.encre,
    },
    boutonLigne: {
      ...baseStyles.boutonLigne,
      border: `1px solid ${themePhotoCartel.bordureOr}`,
      background:
        "linear-gradient(180deg, rgba(255,253,248,0.98), rgba(244,235,219,0.92))",
      color: themePhotoCartel.orFonce,
      borderRadius: themePhotoCartel.rayonBouton,
      boxShadow: themePhotoCartel.ombreBouton,
      fontFamily: themePhotoCartel.font,
    },
    bouton: {
      ...baseStyles.bouton,
      border: `1px solid ${themePhotoCartel.bordureOr}`,
      background:
        "linear-gradient(180deg, rgba(255,253,248,0.98), rgba(244,235,219,0.92))",
      color: themePhotoCartel.encre,
      borderRadius: themePhotoCartel.rayonBouton,
      boxShadow: themePhotoCartel.ombreBouton,
      fontFamily: themePhotoCartel.font,
    },
    boutonTraitement: {
      ...baseStyles.boutonTraitement,
      border: `1px solid ${themePhotoCartel.bordureOr}`,
      background:
        "linear-gradient(135deg, rgba(255,253,248,0.98), rgba(234,216,181,0.54))",
      color: themePhotoCartel.orFonce,
      borderRadius: themePhotoCartel.rayonBouton,
      boxShadow: themePhotoCartel.ombreBouton,
      fontFamily: themePhotoCartel.font,
      fontSize: "14px",
      letterSpacing: "0.01em",
    },
    boutonBas: {
      ...baseStyles.boutonBas,
      border: `1px solid ${themePhotoCartel.bordureOr}`,
      background:
        "linear-gradient(180deg, rgba(255,253,248,0.98), rgba(244,235,219,0.92))",
      color: themePhotoCartel.orFonce,
      borderRadius: themePhotoCartel.rayonBouton,
      boxShadow: themePhotoCartel.ombreBouton,
      fontFamily: themePhotoCartel.font,
    },
    panneauInfo: {
      ...baseStyles.panneauInfo,
      background: "rgba(255,253,248,0.94)",
      border: `1px solid ${themePhotoCartel.bordureOr}`,
      borderRadius: "18px",
      boxShadow: themePhotoCartel.ombreLegere,
      color: themePhotoCartel.texte,
      fontFamily: themePhotoCartel.font,
    },
    modalFond: {
      ...baseStyles.modalFond,
      background: "rgba(23, 26, 31, 0.46)",
      backdropFilter: "blur(8px)",
    },
    modalCarte: {
      ...baseStyles.modalCarte,
      background:
        "linear-gradient(180deg, rgba(255,253,248,1), rgba(248,243,234,0.98))",
      borderRadius: "26px",
      border: `1px solid ${themePhotoCartel.bordureOr}`,
      boxShadow: "0 28px 70px rgba(34, 26, 16, 0.30)",
      fontFamily: themePhotoCartel.font,
    },
    modalTitre: {
      ...baseStyles.modalTitre,
      color: themePhotoCartel.encre,
      fontFamily: themePhotoCartel.font,
      letterSpacing: "-0.035em",
    },
    modalTexte: {
      ...baseStyles.modalTexte,
      color: themePhotoCartel.texteDoux,
      fontFamily: themePhotoCartel.font,
    },
    modalBoutonPrincipal: {
      ...baseStyles.modalBoutonPrincipal,
      background: "linear-gradient(135deg, #8b6427, #b58a3a)",
      borderRadius: themePhotoCartel.rayonBouton,
      boxShadow: "0 14px 28px rgba(122, 85, 32, 0.24)",
      fontFamily: themePhotoCartel.font,
    },
    modalBoutonSecondaire: {
      ...baseStyles.modalBoutonSecondaire,
      background: "rgba(255,253,248,0.96)",
      border: `1px solid ${themePhotoCartel.bordureOr}`,
      color: themePhotoCartel.encre,
      borderRadius: themePhotoCartel.rayonBouton,
      fontFamily: themePhotoCartel.font,
    },
    modalBoutonAnnuler: {
      ...baseStyles.modalBoutonAnnuler,
      color: themePhotoCartel.texteDoux,
      fontFamily: themePhotoCartel.font,
    },
    modalOverlay: {
      ...baseStyles.modalOverlay,
      backgroundColor: "rgba(23, 26, 31, 0.46)",
      backdropFilter: "blur(8px)",
    },
    modal: {
      ...baseStyles.modal,
      background:
        "linear-gradient(180deg, rgba(255,253,248,1), rgba(248,243,234,0.98))",
      border: `1px solid ${themePhotoCartel.bordureOr}`,
      borderRadius: "24px",
      boxShadow: "0 28px 70px rgba(34, 26, 16, 0.28)",
      fontFamily: themePhotoCartel.font,
    },
    input: {
      ...baseStyles.input,
      border: `1px solid ${themePhotoCartel.bordureOr}`,
      borderRadius: "12px",
      backgroundColor: "rgba(255,253,248,0.96)",
      color: themePhotoCartel.encre,
      fontFamily: themePhotoCartel.font,
    },
    resultatSucces: {
      ...baseStyles.resultatSucces,
      background: "linear-gradient(135deg, rgba(238,249,232,0.96), rgba(255,253,248,0.96))",
      border: "1px solid rgba(76,147,59,0.22)",
      borderRadius: "22px",
      padding: "10px 12px 12px",
      boxShadow: themePhotoCartel.ombreCarte,
    },
    resultatIconeSucces: {
      ...baseStyles.resultatIconeSucces,
      backgroundColor: "rgba(92,166,74,0.14)",
      color: "#2d7d34",
      boxShadow: "inset 0 0 0 1px rgba(92,166,74,0.18)",
    },
    resultatTitre: {
      ...baseStyles.resultatTitre,
      color: themePhotoCartel.encre,
      fontFamily: themePhotoCartel.font,
      fontWeight: "780",
      letterSpacing: "-0.025em",
    },
    resultatTexte: {
      ...baseStyles.resultatTexte,
      color: themePhotoCartel.texteDoux,
      fontFamily: themePhotoCartel.font,
    },
    resumeIcone: {
      ...baseStyles.resumeIcone,
      backgroundColor: "rgba(234,216,181,0.68)",
      color: themePhotoCartel.orFonce,
    },
    resumeValeur: {
      ...baseStyles.resumeValeur,
      color: themePhotoCartel.encre,
    },
    resumeLabel: {
      ...baseStyles.resumeLabel,
      color: themePhotoCartel.texteDoux,
      fontFamily: themePhotoCartel.font,
    },
    analyseEcran: {
      ...baseStyles.analyseEcran,
      background:
        "radial-gradient(circle at 50% -10%, #efe1c5 0, #f8f3ea 34%, #f6efe3 100%)",
      backgroundColor: "#f6efe3",
      color: themePhotoCartel.encre,
      fontFamily: themePhotoCartel.font,
      padding: "58px 18px 18px",
      paddingBottom: "104px",
    },
    analyseMiniature: {
      ...baseStyles.analyseMiniature,
      width: "58%",
      maxHeight: "180px",
      margin: "3px auto 7px",
      border: `1px solid ${themePhotoCartel.bordureOr}`,
      borderRadius: "18px",
      boxShadow: themePhotoCartel.ombreCarte,
      backgroundColor: themePhotoCartel.ivoireClair,
    },
    dateHeurePhotoCarte: {
      ...baseStyles.dateHeurePhotoCarte,
      display: "grid",
      alignItems: "stretch",
      gap: "3px",
      padding: "7px 10px",
      margin: "0 0 9px",
      borderRadius: "12px",
      background: themePhotoCartel.ivoireCarte,
      border: `1px solid ${themePhotoCartel.bordureOr}`,
      borderRadius: "18px",
      boxShadow: themePhotoCartel.ombreLegere,
      fontFamily: themePhotoCartel.font,
    },
    dateHeurePhotoLigne: {
      ...baseStyles.dateHeurePhotoLigne,
      gridTemplateColumns: "104px minmax(0, 1fr)",
      fontFamily: themePhotoCartel.font,
    },
    dateHeurePhotoLabel: {
      ...baseStyles.dateHeurePhotoLabel,
      marginBottom: 0,
      fontSize: "11px",
      color: themePhotoCartel.orFonce,
    },
    dateHeurePhotoValeur: {
      ...baseStyles.dateHeurePhotoValeur,
      fontSize: "12px",
      color: themePhotoCartel.encre,
    },
    analyseCarte: {
      ...baseStyles.analyseCarte,
      background: themePhotoCartel.ivoireCarte,
      border: `1px solid ${themePhotoCartel.bordureOr}`,
      borderRadius: "22px",
      boxShadow: themePhotoCartel.ombreCarte,
      fontFamily: themePhotoCartel.font,
    },
    analyseBlocTitre: {
      ...baseStyles.analyseBlocTitre,
      background:
        "linear-gradient(135deg, rgba(234,216,181,0.58), rgba(255,253,248,0.94))",
      color: themePhotoCartel.orFonce,
      border: `1px solid ${themePhotoCartel.bordureOr}`,
      borderRadius: "14px",
      margin: "0 0 5px",
      fontFamily: themePhotoCartel.font,
    },
    analyseType: {
      ...baseStyles.analyseType,
      color: themePhotoCartel.orFonce,
      fontFamily: themePhotoCartel.font,
      fontWeight: "900",
      margin: "2px 0 8px",
    },
    analyseLigne: {
      ...baseStyles.analyseLigne,
      gridTemplateColumns: "118px 1fr",
      borderBottom: "1px solid rgba(91,67,38,0.10)",
      fontFamily: themePhotoCartel.font,
    },
    analyseLabel: {
      ...baseStyles.analyseLabel,
      color: themePhotoCartel.orFonce,
    },
    analyseValeur: {
      ...baseStyles.analyseValeur,
      color: themePhotoCartel.encre,
    },
    boutonAnalyseSauver: {
      ...baseStyles.boutonAnalyseSauver,
      background: "linear-gradient(135deg, #247c38, #34a853)",
      border: "1px solid rgba(36,124,56,0.48)",
      borderRadius: themePhotoCartel.rayonBouton,
      boxShadow: "0 12px 24px rgba(36,124,56,0.18)",
      fontFamily: themePhotoCartel.font,
    },
    boutonAnalyseSecondaire: {
      ...baseStyles.boutonAnalyseSecondaire,
      background: "rgba(255,253,248,0.96)",
      border: `1px solid ${themePhotoCartel.bordureOr}`,
      color: themePhotoCartel.orFonce,
      borderRadius: themePhotoCartel.rayonBouton,
      fontFamily: themePhotoCartel.font,
    },
    boutonAnalyseComplete: {
      ...baseStyles.boutonAnalyseComplete,
      background:
        "linear-gradient(135deg, rgba(255,253,248,0.98), rgba(234,216,181,0.46))",
      border: `1px solid ${themePhotoCartel.bordureOr}`,
      color: themePhotoCartel.orFonce,
      borderRadius: themePhotoCartel.rayonBouton,
      boxShadow: themePhotoCartel.ombreBouton,
      fontFamily: themePhotoCartel.font,
    },
    boutonAnalyseFermer: {
      ...baseStyles.boutonAnalyseFermer,
      background: "rgba(255,247,237,0.92)",
      border: "1px solid rgba(154,52,18,0.28)",
      borderRadius: themePhotoCartel.rayonBouton,
      fontFamily: themePhotoCartel.font,
    },
    titreFicheResultat: {
      ...baseStyles.titreFicheResultat,
      color: themePhotoCartel.encre,
      fontFamily: themePhotoCartel.font,
      margin: "0 0 5px",
      fontSize: "22px",
    },
    barreActionsFiche: {
      ...baseStyles.barreActionsFiche,
      background:
        "linear-gradient(180deg, rgba(226,201,150,0.98), rgba(248,239,220,0.98))",
      borderTop: `2px solid ${themePhotoCartel.or}`,
      borderBottom: `1px solid ${themePhotoCartel.bordureOr}`,
      boxShadow: "0 -8px 22px rgba(91,67,38,0.16)",
      fontFamily: themePhotoCartel.font,
    },
    barreActionsFicheBouton: {
      ...baseStyles.barreActionsFicheBouton,
      color: themePhotoCartel.orFonce,
      fontFamily: themePhotoCartel.font,
    },
    barreActionsFicheIcone: {
      ...baseStyles.barreActionsFicheIcone,
    },
    barreActionsFicheTexte: {
      ...baseStyles.barreActionsFicheTexte,
      color: themePhotoCartel.orFonce,
    },
    barreFixe: {
      ...baseStyles.barreFixe,
      backgroundColor: "rgba(255,253,248,0.97)",
      borderTop: `1px solid ${themePhotoCartel.bordureOr}`,
      boxShadow: "0 -10px 30px rgba(67, 49, 28, 0.12)",
      padding: "6px 8px 7px",
      paddingBottom: "calc(7px + env(safe-area-inset-bottom))",
      fontFamily: themePhotoCartel.font,
      backdropFilter: "blur(16px)",
    },
    barreFixeBouton: {
      ...baseStyles.barreFixeBouton,
      color: themePhotoCartel.texteDoux,
      borderRadius: "14px",
      padding: "5px 2px",
    },
    barreFixeIcone: {
      ...baseStyles.barreFixeIcone,
      fontSize: "20px",
      lineHeight: "20px",
    },
    barreFixeTexte: {
      ...baseStyles.barreFixeTexte,
      fontSize: "8px",
      lineHeight: "9px",
      fontWeight: "850",
      whiteSpace: "nowrap",
      color: themePhotoCartel.texteDoux,
    },
    parametresSection: {
      ...baseStyles.parametresSection,
      background: themePhotoCartel.ivoireCarte,
      border: `1px solid ${themePhotoCartel.bordureOr}`,
      borderRadius: "20px",
      boxShadow: themePhotoCartel.ombreLegere,
    },
    parametresTexte: {
      ...baseStyles.parametresTexte,
      color: themePhotoCartel.texte,
      fontFamily: themePhotoCartel.font,
    },
    parametresChemin: {
      ...baseStyles.parametresChemin,
      backgroundColor: "rgba(234,216,181,0.30)",
      color: themePhotoCartel.texteDoux,
      border: `1px solid ${themePhotoCartel.bordureOr}`,
      fontFamily: themePhotoCartel.font,
    },
    galerieCompteur: {
      ...baseStyles.galerieCompteur,
      color: themePhotoCartel.texteDoux,
      fontFamily: themePhotoCartel.font,
    },
    galerieAideSwipe: {
      ...baseStyles.galerieAideSwipe,
      color: themePhotoCartel.texteDoux,
      fontFamily: themePhotoCartel.font,
    },
  };

  function afficherValeurEtat(valeur, fallback = "—") {
    return valeur && String(valeur).trim() ? valeur : fallback;
  }

  function InfoLigne({ icone, label, valeur }) {
    return (
      <div style={styles.ligneEtat}>
        <div style={styles.ligneEtatIcone}>{icone}</div>
        <div>
          <div style={styles.ligneEtatLabel}>{label}</div>
          <div style={styles.ligneEtatValeur}>{afficherValeurEtat(valeur)}</div>
        </div>
      </div>
    );
  }

  function ActionCarte({ icone, titre, onClick, disabled, couleur }) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        style={{
          ...styles.carteAction,
          opacity: disabled ? 0.45 : 1,
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        <div
          style={{
            ...styles.carteActionIconeRond,
            color: couleur || styles.carteActionIconeRond.color,
          }}
        >
          {icone}
        </div>
        <div style={styles.carteActionTitre}>{titre}</div>
      </button>
    );
  }

  function DetailLigne({ icone, label, valeur }) {
    return (
      <div style={styles.detailLigne}>
        <div style={styles.detailIcone}>{icone}</div>
        <div style={styles.detailLabel}>{label}</div>
        <div style={styles.detailValeur}>{afficherValeurEtat(valeur)}</div>
      </div>
    );
  }

  function BlocEtatVisite() {
    return (
      <section style={styles.carteEtat}>
        <div style={styles.sectionTitre}>Voyage en cours</div>
        <div style={styles.etatPrincipal}>{afficherValeurEtat(voyage, "Aucun voyage actif")}</div>
        <InfoLigne icone="📍" label="Visite en cours" valeur={lieuVisite || "Aucune visite"} />
        <InfoLigne icone="🏙️" label="Ville" valeur={villeVisite || "Aucune ville"} />
        <InfoLigne icone="🏛️" label="Type de visite" valeur={typeVisiteAffiche} />
      </section>
    );
  }

  function BandeauModeDemonstration() {
    // v27.1 : le mode démonstration reste actif techniquement, mais son bandeau vert
    // n'est plus affiché dans l'interface pour libérer de la place et réduire le bruit visuel.
    return null;
  }

  function BlocDerniereVisite() {
    if (!derniereVisite) return null;

    return (
      <section style={styles.carteDerniereVisite}>
        <div style={styles.sectionTitre}>Dernière visite</div>
        <DetailLigne icone="📁" label="Nom de la visite" valeur={derniereVisite.nom} />
        <DetailLigne icone="🏙️" label="Ville" valeur={derniereVisite.ville} />
        <DetailLigne icone="🏛️" label="Type de visite" valeur={derniereVisite.type} />
        <DetailLigne icone="📅" label="Date et heure de clôture" valeur={derniereVisite.dateCloture} />
        <DetailLigne icone="🕘" label="Durée de la visite" valeur={derniereVisite.duree} />
        <DetailLigne icone="📷" label="Nombre de photos de la visite" valeur={derniereVisite.nombrePhotos} />
      </section>
    );
  }

  function ResumeItem({ icone, valeur, label }) {
    return (
      <div style={styles.resumeItem}>
        <div style={styles.resumeIcone}>{icone}</div>
        <div style={styles.resumeValeur}>{valeur}</div>
        <div style={styles.resumeLabel}>{label}</div>
      </div>
    );
  }

  function EcranClassificationTerminee() {
    if (!resultatClassification) return null;

    return (
      <div style={styles.resultatPage}>
        <div style={styles.resultatSucces}>
          <div style={styles.resultatIconeSucces}>✓</div>
          <div>
            <h2 style={styles.resultatTitre}>Classification terminée</h2>
            <p style={styles.resultatTexte}>Les photos ont été classifiées avec succès.</p>
          </div>
        </div>

        <section style={styles.carteEtat}>
          <div style={styles.sectionTitre}>Résumé de la classification</div>
          <div style={styles.resumeGrille}>
            <ResumeItem icone="🖼️" valeur={resultatClassification.total} label="Photos classées" />
            <ResumeItem icone="📂" valeur={Object.values(resultatClassification.stats || {}).filter((v) => Number(v) > 0).length} label="Catégories créées" />
            <ResumeItem icone="⏱️" valeur={resultatClassification.dureeTraitement} label="Durée" />
            <ResumeItem icone="📁" valeur="Ouvert" label="Dossier résultat" />
          </div>
          <button
            type="button"
            onClick={() => ouvrirDossierResultat(resultatClassification.destination)}
            style={{ ...styles.boutonLigne, marginTop: 14 }}
          >
            📁 Ouvrir le dossier
          </button>
        </section>

        <section style={styles.carteDerniereVisite}>
          <div style={styles.sectionTitre}>Détails</div>
          <DetailLigne icone="📁" label="Dossier source" valeur={resultatClassification.fichierTraite} />
          <DetailLigne icone="🖼️" label="Œuvres" valeur={resultatClassification.stats?.Oeuvres} />
          <DetailLigne icone="🏷️" label="Cartels" valeur={resultatClassification.stats?.Cartels} />
          <DetailLigne icone="🏛️" label="Architecture" valeur={resultatClassification.stats?.Architecture} />
          <DetailLigne icone="⚠️" label="À vérifier" valeur={resultatClassification.stats?.A_verifier_classification} />
        </section>

        <button type="button" onClick={retourAccueil} style={styles.boutonBas}>
          Retour à l'accueil
        </button>
      </div>
    );
  }

  function EcranRenommageTermine() {
    if (!dashboardRenommage) return null;

    return (
      <div style={styles.resultatPage}>
        <div style={styles.resultatSucces}>
          <div style={styles.resultatIconeSucces}>✓</div>
          <div>
            <h2 style={styles.resultatTitre}>Renommage terminé</h2>
            <p style={styles.resultatTexte}>Le renommage des œuvres est terminé.</p>
          </div>
        </div>

        <section style={styles.carteEtat}>
          <div style={styles.sectionTitre}>Résumé du renommage</div>
          <div style={styles.resumeGrille}>
            <ResumeItem icone="🖼️" valeur={dashboardRenommage.oeuvresRenommees} label="Œuvres renommées" />
            <ResumeItem icone="⚠️" valeur={dashboardRenommage.fichiersAVerifier} label="À vérifier" />
            <ResumeItem icone="⏱️" valeur={formaterSecondes(dashboardRenommage.tempsRenommageSecondes)} label="Durée" />
            <ResumeItem icone="📁" valeur="Ouvert" label="Dossier résultat" />
          </div>
          <button
            type="button"
            onClick={() => ouvrirDossierResultat(dashboardRenommage.cheminResultat)}
            style={{ ...styles.boutonLigne, marginTop: 14 }}
          >
            📁 Ouvrir le dossier
          </button>
        </section>

        <section style={styles.carteDerniereVisite}>
          <div style={styles.sectionTitre}>Détails</div>
          <DetailLigne icone="📁" label="Dossier source" valeur={dashboardRenommage.dossierSource} />
          <DetailLigne icone="🖼️" label="Photos analysées" valeur={dashboardRenommage.photosAnalysees} />
          <DetailLigne icone="✅" label="Œuvres renommées" valeur={dashboardRenommage.oeuvresRenommees} />
          <DetailLigne icone="⚠️" label="À vérifier" valeur={dashboardRenommage.fichiersAVerifier} />
          <DetailLigne icone="📈" label="Taux de réussite" valeur={`${dashboardRenommage.tauxReussite} %`} />
        </section>

        <button type="button" onClick={retourAccueil} style={styles.boutonBas}>
          Retour à l'accueil
        </button>
      </div>
    );
  }

  function BarreSuperieurePhotoCartel() {
    return (
      <header style={styles.barreSuperieure} aria-label="En-tête PhotoCartel">
        <button type="button" style={styles.barreSuperieureMenu} aria-label="Menu PhotoCartel">
          ☰
        </button>
        <img
          src={LOGO_PHOTOCARTEL_SRC}
          alt="Logo PhotoCartel"
          style={styles.barreSuperieureLogo}
        />
        <h1 style={styles.barreSuperieureTitre}>PhotoCartel</h1>
        <span style={styles.barreSuperieureVersion}>{VERSION_COMPLETE}</span>
        <div style={styles.barreSuperieureEspace} />
        <button type="button" style={styles.barreSuperieureIcone} aria-label="Aide PhotoCartel">
          ?
        </button>
        <button type="button" style={styles.barreSuperieureIcone} aria-label="Options PhotoCartel">
          ⋮
        </button>
      </header>
    );
  }

  function BarreFixe() {
    // v32 DEV : barre fixe = accès permanent aux gestes essentiels de PhotoCartel.
    // Accueil et Analyser une photo sont des commandes globales qui interrompent le contexte courant.
    const boutons = [
      {
        icone: "🏠",
        texte: "Accueil",
        action: async () => {
          // v34.3 : Accueil ferme l'écran sans supprimer la photo déjà
          // enregistrée dans « Photos à analyser ».
          if (modeAnalysePhoto || analysePhotoSessionActiveRef.current) {
            retourAccueilDepuisAnalysePhoto();
            return;
          }

          fermerGaleriePhotosAnalysees();
          setModeCreationVisite(false);
          setModeCreationVoyage(false);
          setModeGestionVoyage(false);
          setModeAucuneVisite(false);
          setModeParametres(false);
          retourAccueil();
        },
      },
      {
        icone: "📷",
        texte: "Analyser une photo",
        action: handleAnalyserUnePhoto,
      },
      {
        icone: "🏛️",
        texte: "Nouvelle visite",
        action: () => {
          if (!voyage) {
            setModeCreationVoyage(true);
            return;
          }

          ouvrirFenetreCreationVisite("nouvelle");
        },
      },
      {
        icone: "🧳",
        texte: "Gestion du voyage",
        action: () => setModeGestionVoyage(true),
      },
      {
        icone: "⚙️",
        texte: "Paramètres",
        action: () => setModeParametres(true),
      },
    ];

    return (
      <nav style={styles.barreFixe} aria-label="Barre fixe PhotoCartel">
        {boutons.map((bouton) => (
          <button
            key={bouton.texte}
            type="button"
            onClick={bouton.action}
            style={styles.barreFixeBouton}
            aria-label={bouton.texte}
          >
            <span style={styles.barreFixeIcone}>{bouton.icone}</span>
            <span style={styles.barreFixeTexte}>{bouton.texte}</span>
          </button>
        ))}
      </nav>
    );
  }

  function BarreActionsFicheResultat() {
    const actions = [
      {
        icone: analysePhotoEdition ? "↩️" : "✏️",
        texte: analysePhotoEdition ? "Annuler les modifications" : "Modifier l'analyse",
        action: analysePhotoEdition
          ? annulerModificationsAnalyse
          : entrerModeModificationAnalyse,
        disabled: !analysePhotoResultat || analysePhotoEnCours || analysePhotoSauvegardeEnCours,
      },
      {
        icone: "💾",
        texte: "Enregistrer l'analyse",
        action: handleClicEnregistrerAnalysePhoto,
        disabled: !analysePhotoResultat || analysePhotoEnCours || analysePhotoSauvegardeEnCours,
      },
      {
        icone: "✕",
        texte: "Fermer sans enregistrer",
        action: () => {},
        disabled: true,
      },
    ];

    return (
      <nav style={styles.barreActionsFiche} aria-label="Actions propres à la fiche résultat">
        {actions.map((action) => (
          <button
            key={action.texte}
            type="button"
            onClick={action.action}
            disabled={action.disabled}
            style={{
              ...styles.barreActionsFicheBouton,
              opacity: action.disabled ? 0.38 : 1,
              cursor: action.disabled ? "not-allowed" : "pointer",
            }}
            aria-label={action.texte}
          >
            <span style={styles.barreActionsFicheIcone}>{action.icone}</span>
            <span style={styles.barreActionsFicheTexte}>{action.texte}</span>
          </button>
        ))}
      </nav>
    );
  }

  function BarreActionsGalerie() {
    const actions = [
      { icone: "✏️", texte: "Modifier l'analyse" },
      { icone: "💾", texte: "Enregistrer l'analyse" },
      { icone: "📤", texte: "Exporter la galerie" },
      { icone: "🔎", texte: "Rechercher" },
      { icone: "🗑️", texte: "Supprimer cette fiche" },
    ];

    return (
      <nav style={styles.barreActionsGalerie} aria-label="Actions de la galerie des photos analysées">
        {actions.map((action) => (
          <button
            key={action.texte}
            type="button"
            onClick={() => {}}
            disabled
            style={{
              ...styles.barreActionsFicheBouton,
              opacity: 0.72,
              cursor: "default",
            }}
            aria-label={`${action.texte} — disponible dans une prochaine version`}
            title={`${action.texte} — disponible dans une prochaine version`}
          >
            <span style={styles.barreActionsFicheIcone}>{action.icone}</span>
            <span style={styles.barreActionsFicheTexte}>{action.texte}</span>
          </button>
        ))}
      </nav>
    );
  }

  return (
    <div style={styles.page}>
      <BarreSuperieurePhotoCartel />
      <BarreFixe />
      {(modeAnalysePhoto || analysePhotoSessionActiveRef.current) && !modeGalerieAnalyses && (
        <BarreActionsFicheResultat />
      )}
      {modeGalerieAnalyses && (
        <div style={{ ...styles.analyseEcran, paddingBottom: "154px" }}>
          <main style={{ ...styles.analyseTelephone, paddingBottom: "148px" }}>
            <h1 style={styles.titreFicheResultat}>Galerie des photos analysées</h1>
            <BandeauModeDemonstration />

            {galerieChargement && (
              <div style={styles.analyseCarte}>
                <h2 style={styles.analyseType}>Chargement...</h2>
                <p>PhotoCartel charge les analyses sauvegardées.</p>
              </div>
            )}

            {!galerieChargement && messageGalerieAnalyses && (
              <div style={styles.analyseCarte}>
                <h2 style={styles.analyseType}>Galerie</h2>
                <p>{messageGalerieAnalyses}</p>
              </div>
            )}

            {!galerieChargement && galerieAnalyses.length > 0 && (() => {
              const fiche = galerieAnalyses[galerieIndex] || {};
              const analyse = fiche.analyse || {};

              return (
                <>
                  <p style={styles.galerieCompteur}>
                    Fiche {galerieIndex + 1} / {galerieAnalyses.length}
                  </p>

                  {fiche.imageUrl && (
                    <img
                      src={urlPhotoGalerie(fiche)}
                      alt={fiche.nomPhoto || "Photo analysée"}
                      style={styles.analyseMiniature}
                      onClick={() => setPhotoPleinEcranUrl(urlPhotoGalerie(fiche))}
                    />
                  )}

                  {(fiche.datePhotoLocale || fiche.dateAnalyseLocale) && (
                    <div style={styles.dateHeurePhotoCarte}>
                      <div style={styles.dateHeurePhotoLigne}>
                        <div style={styles.dateHeurePhotoLabel}>📷 Prise de vue :</div>
                        <div style={styles.dateHeurePhotoValeur}>
                          {fiche.datePhotoLocale || "Non renseignée"}
                        </div>
                      </div>
                      <div style={styles.dateHeurePhotoLigne}>
                        <div style={styles.dateHeurePhotoLabel}>🤖 Analyse IA :</div>
                        <div style={styles.dateHeurePhotoValeur}>
                          {fiche.dateAnalyseLocale || "Non renseignée"}
                        </div>
                      </div>
                    </div>
                  )}

                  <div
                    style={styles.analyseCarte}
                    onTouchStart={handleGalerieTouchStart}
                    onTouchEnd={handleGalerieTouchEnd}
                  >
                    {afficherFicheAnalyse(analyse)}
                    {afficherBoutonAnalyseComplete()}
                  </div>

                  <p style={styles.galerieAideSwipe}>
                    Balaye la fiche vers la gauche ou la droite pour passer à une autre analyse.
                  </p>
                </>
              );
            })()}
          </main>
        </div>
      )}

      {classificationEnCours && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Classification en cours</h2>
            <p>Dossier : {dossierImport}</p>
            <p>Photos à traiter : {nombrePhotos}</p>
            <p>Merci de patienter.</p>
          </div>
        </div>
      )}

      {renommageFinalEnCours && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Renommage en cours</h2>
            <p>Dossier : {dossierRenommage}</p>
            <p>Photos à traiter : {nombrePhotosRenommage}</p>
            <p>Merci de patienter.</p>
          </div>
        </div>
      )}

      {actualisationEnCours && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Rangement en cours</h2>
            <p>Rangement des photos dans le dossier de visite.</p>
            <p>Merci de patienter.</p>
          </div>
        </div>
      )}

      {modeParametres && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Paramètres</h3>

            <section style={styles.parametresSection}>
              <div style={styles.sectionTitre}>Mode démonstration</div>

              <p style={styles.parametresTexte}>
                Statut : <strong>INACTIF</strong>
              </p>

              {modeDemonstrationActif && (
                <p style={styles.parametresChemin}>
                  {cheminDossierModeDemonstration || "Dossier de démonstration actif"}
                </p>
              )}

              {!modeDemonstrationActif && (
                <button
                  type="button"
                  onClick={undefined}
                  disabled={true}
                  style={{
                    ...styles.bouton,
                    opacity: 0.45,
                    cursor: "not-allowed",
                  }}
                >
                  Lancer le mode démonstration
                </button>
              )}

              {modeDemonstrationActif && (
                <>
                  <button
                    type="button"
                    onClick={undefined}
                    disabled={true}
                    style={{
                      ...styles.boutonTraitement,
                      opacity: 0.45,
                      cursor: "not-allowed",
                    }}
                  >
                    Exporter les photos de démonstration
                  </button>

                  <button
                    type="button"
                    onClick={undefined}
                    disabled={true}
                    style={{
                      ...styles.boutonAnalyseFermer,
                      marginTop: 9,
                      opacity: 0.45,
                      cursor: "not-allowed",
                    }}
                  >
                    Sortir du mode démonstration
                  </button>
                </>
              )}
            </section>

            <button
              type="button"
              onClick={() => setModeParametres(false)}
              style={styles.boutonBas}
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {modeGestionVoyage && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Gestion du voyage</h3>
            <p>
              Voyage en cours : <strong>{voyage || "Aucun voyage actif"}</strong>
            </p>

            <button
              type="button"
              onClick={() => {
                if (voyage) {
                  alert(
                    "Impossible de créer un nouveau voyage tant que le voyage en cours n'est pas clos."
                  );
                  return;
                }

                setModeGestionVoyage(false);
                setModeCreationVoyage(true);
              }}
              style={styles.bouton}
            >
              Créer un voyage
            </button>

            <button
              type="button"
              onClick={finDuVoyage}
              disabled={!voyage}
              style={{
                ...styles.boutonTraitement,
                opacity: voyage ? 1 : 0.45,
                cursor: voyage ? "pointer" : "not-allowed",
              }}
            >
              Fin du voyage
            </button>

            <button
              type="button"
              onClick={() => setModeGestionVoyage(false)}
              style={styles.boutonBas}
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {modeCreationVoyage && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Nouveau voyage</h3>
            <label>
              <strong>Nom du voyage</strong>
              <input
                type="text"
                value={nomNouveauVoyage}
                onChange={(e) => setNomNouveauVoyage(e.target.value)}
                placeholder="Ex : Afrique du Sud - novembre 2030"
                style={styles.input}
              />
            </label>
            <button onClick={validerNouveauVoyage} style={styles.bouton}>
              Valider
            </button>
            <button
              onClick={() => {
                setNomNouveauVoyage("");
                setModeCreationVoyage(false);
              }}
              style={styles.boutonBas}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {modeCreationVisite && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>
              {contexteCreationVisite === "suivante"
                ? "Créer la visite suivante"
                : "Créer une nouvelle visite"}
            </h3>

            <button
              type="button"
              onClick={creerVisiteRapide}
              style={{
                width: "100%",
                border: "1px solid rgba(181, 138, 58, 0.35)",
                borderRadius: "18px",
                padding: "16px",
                marginBottom: "16px",
                textAlign: "left",
                background: "linear-gradient(135deg, #fff8e8, #ffffff)",
                color: "#171a1f",
                cursor: "pointer",
                boxShadow: "0 10px 24px rgba(80, 62, 38, 0.10)",
              }}
            >
              <strong style={{ display: "block", fontSize: "17px", marginBottom: "6px" }}>
                ⚡ Créer une visite rapide
              </strong>
              <span style={{ display: "block", color: "#6f675c", fontSize: "14px", lineHeight: 1.35 }}>
                Idéal lorsque vous enchaînez plusieurs visites et souhaitez prendre des photos immédiatement.
                Vous pourrez renommer et compléter cette visite plus tard.
              </span>
            </button>

            <div
              style={{
                border: "1px solid rgba(181, 138, 58, 0.22)",
                borderRadius: "18px",
                padding: "15px",
                marginBottom: "14px",
                background: "rgba(255, 253, 248, 0.92)",
              }}
            >
              <h4 style={{ margin: "0 0 12px", fontSize: "16px" }}>
                🏛️ Créer une visite structurée
              </h4>

              <label>
                <strong>Ville</strong>
                <input
                  type="text"
                  value={villeNouvelleVisite}
                  onChange={(e) => setVilleNouvelleVisite(e.target.value)}
                  placeholder="Ex : Lima"
                  style={styles.input}
                />
                <span style={{ display: "block", marginTop: "5px", color: "#746d63", fontSize: "12px" }}>
                  Préremplie avec la dernière ville utilisée dans ce voyage. Vous pouvez la modifier.
                </span>
              </label>

              <label>
                <strong>Nom de la visite</strong>
                <input
                  type="text"
                  value={lieuNouvelleVisite}
                  onChange={(e) => setLieuNouvelleVisite(e.target.value)}
                  placeholder="Ex : Musée Larco"
                  style={styles.input}
                />
              </label>

              <label>
                <strong>Type de visite</strong>
                <select
                  value={typeNouvelleVisite}
                  onChange={(e) => setTypeNouvelleVisite(e.target.value)}
                  style={styles.input}
                >
                  <option value="Musée">Musée</option>
                  <option value="Église">Église</option>
                  <option value="Autre">Autre</option>
                </select>
              </label>

              <button onClick={validerNouvelleVisite} style={styles.bouton}>
                Créer la visite
              </button>
            </div>

            <button
              onClick={annulerCreationVisite}
              style={styles.boutonBas}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {modeAucuneVisite && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Aucune visite en cours</h3>
            <p>
              Aucun dossier de visite n'est actif pour le voyage en cours.
            </p>
            <p>
              Tu peux créer une visite maintenant, ou continuer quand même :
              PhotoCartel créera un dossier tampon de collecte libre.
            </p>

            <button
              type="button"
              onClick={creerTamponCollecteLibreEtOuvrirCamera}
              style={styles.bouton}
            >
              Continuer quand même
            </button>

            <button
              type="button"
              onClick={() => {
                ouvrirFenetreCreationVisite("nouvelle");
              }}
              style={styles.boutonTraitement}
            >
              Créer une visite
            </button>

            <button
              type="button"
              onClick={() => setModeAucuneVisite(false)}
              style={styles.boutonBas}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      <main style={styles.telephone}>
        {resultatClassification && !dashboardRenommage ? (
          <EcranClassificationTerminee />
        ) : dashboardRenommage ? (
          <EcranRenommageTermine />
        ) : (
          <>
            <BandeauModeDemonstration />
            <BlocEtatVisite />

            <div style={styles.grilleActions}>
              <ActionCarte
                icone="📷"
                titre="Ouvrir l'appareil photo"
                onClick={handlePrendreDesPhotos}
                disabled={!voyage}
                couleur="#c18418"
              />
              <ActionCarte
                icone="🗂️"
                titre="Ranger les photos de la visite"
                onClick={ouvrirSelectionActualisationPhotos}
                disabled={!voyage || !cheminCollecteActif || actualisationEnCours}
                couleur="#1f7a8c"
              />
              <ActionCarte
                icone="🧪"
                titre="Tester stockage Android"
                onClick={testerStockageAndroid}
                disabled={testStockageAndroidEnCours}
                couleur="#8a5a00"
              />
              <ActionCarte
                icone="📂"
                titre="Explorer les dossiers PhotoCartel"
                onClick={explorerDossiersPhotoCartel}
                couleur="#8a5a00"
              />
              <ActionCarte
                icone="🖼️"
                titre="Galerie des photos analysées"
                onClick={ouvrirGaleriePhotosAnalysees}
                couleur="#6b3faa"
              />
              <ActionCarte
                icone="⚑"
                titre="Fin de visite"
                onClick={finDeVisite}
                disabled={!voyage}
                couleur="#1f9a4b"
              />
            </div>

            <div style={styles.compteurCarte}>
              <div style={styles.compteurIcone}>📷</div>
              <div style={styles.compteurLabel}>Nombre de photos de la visite en cours</div>
              <div style={styles.compteurValeur}>{photosCollectees}</div>
            </div>

            {messageActualisation && (
              <div style={styles.panneauInfo}>
                <strong>{messageActualisation}</strong>
              </div>
            )}

            {messageArborescenceAndroid && (
              <div style={styles.panneauInfo}>
                <strong>{messageArborescenceAndroid}</strong>
              </div>
            )}

            {messageTestStockageAndroid && (
              <div style={styles.panneauInfo}>
                <strong>{messageTestStockageAndroid}</strong>
              </div>
            )}

            <BlocDerniereVisite />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 4 }}>
              <button
                type="button"
                onClick={() => document.getElementById("selection-dossier-import")?.click()}
                style={styles.boutonTraitement}
              >
                Classifier
              </button>

              <button
                type="button"
                onClick={() => document.getElementById("selection-dossier-renommage")?.click()}
                style={styles.boutonTraitement}
              >
                Renommer
              </button>

            </div>

            {messageImport && !resultatClassification && (
              <div style={styles.panneauInfo}>
                <strong>{messageImport}</strong>
              </div>
            )}

            {dossierImport && !resultatClassification && (
              <div style={styles.panneauInfo}>
                <p>
                  <strong>Dossier sélectionné :</strong> {dossierImport}
                </p>
                <p>
                  <strong>Photos détectées :</strong> {nombrePhotos}
                </p>
              </div>
            )}

            {messageRenommage && !dashboardRenommage && !renommageFinalEnCours && (
              <div
                data-chemin-renommage={cheminRenommagePrepare}
                style={styles.panneauInfo}
              >
                <strong>{messageRenommage}</strong>
                <p>
                  <strong>Dossier sélectionné :</strong> {dossierRenommage}
                </p>
                <p>
                  <strong>Œuvres détectées :</strong> {nombrePhotosRenommage}
                </p>
              </div>
            )}

            {(renommagePret || cheminRenommagePrepare) && !dashboardRenommage && (
              <button
                type="button"
                onClick={() => lancerRenommageFinal()}
                disabled={renommageFinalEnCours}
                style={styles.boutonTraitement}
              >
                {renommageFinalEnCours
                  ? "Renommage en cours..."
                  : "Lancer le renommage"}
              </button>
            )}
          </>
        )}

        <input
          ref={inputPrendrePhotosRef}
          id="prise-photo-mobile"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhotosPrises}
          style={{ display: "none" }}
        />

        <input
          ref={inputAnalyserPhotoCameraRef}
          id="analyse-photo-one-shot-camera"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhotoAnalyseSelection}
          style={{ display: "none" }}
        />

        <input
          ref={inputAnalyserPhotoRef}
          id="analyse-photo-one-shot-fichier"
          type="file"
          accept="image/*"
          onChange={handlePhotoAnalyseSelection}
          style={{ display: "none" }}
        />

        <input
          ref={inputActualiserPhotosRef}
          id="rangement-photos-visite"
          type="file"
          accept="image/*"
          multiple
          onClick={(event) => {
            event.target.value = null;
          }}
          onChange={handleActualiserPhotos}
          style={{ display: "none" }}
        />

        <input
          id="selection-dossier-import"
          type="file"
          webkitdirectory="true"
          directory="true"
          multiple
          onClick={(event) => {
            event.target.value = null;
          }}
          onChange={(event) => {
            classifierDossierTest(Array.from(event.target.files || []));
          }}
          style={{ display: "none" }}
        />

        <input
          id="selection-dossier-renommage"
          type="file"
          webkitdirectory="true"
          directory="true"
          multiple
          onClick={(event) => {
            event.target.value = null;
          }}
          onChange={(event) => {
            handleSelectionDossierRenommage(event);
            renommerOeuvresTest(Array.from(event.target.files || []));
          }}
          style={{ display: "none" }}
        />
      </main>
    </div>
  );
}

export default App;

