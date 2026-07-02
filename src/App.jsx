import { useState, useRef } from "react";
import Tesseract from "tesseract.js";
import cv from "@techstark/opencv-js";

// PhotoCartel v20.3 — cloud-ready minimal. Mode Démonstration conservé.
// Moteurs, endpoints et règles métier conservés.

function App() {
  console.log("APP PRINCIPALE - PhotoCartel v20.3 cloud-ready");

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


  const [dossierRacine, setDossierRacine] = useState("C:\\Voyages");


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

const [villeNouvelleVisite, setVilleNouvelleVisite] = useState("");
const [lieuNouvelleVisite, setLieuNouvelleVisite] = useState("");

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
  const [photosCollectees, setPhotosCollectees] = useState(0);
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
const inputAnalyserPhotoRef = useRef(null);

const [analysePhotoFile, setAnalysePhotoFile] = useState(null);
const [analysePhotoUrl, setAnalysePhotoUrl] = useState("");
const [analysePhotoResultat, setAnalysePhotoResultat] = useState(null);
const [analysePhotoEnCours, setAnalysePhotoEnCours] = useState(false);
const [modeAnalysePhoto, setModeAnalysePhoto] = useState(false);
const [photoPleinEcranUrl, setPhotoPleinEcranUrl] = useState("");
const [messageAnalysePhoto, setMessageAnalysePhoto] = useState("");
const [analysePhotoSauvegardeEnCours, setAnalysePhotoSauvegardeEnCours] = useState(false);

const [modeGalerieAnalyses, setModeGalerieAnalyses] = useState(false);
const [galerieAnalyses, setGalerieAnalyses] = useState([]);
const [galerieIndex, setGalerieIndex] = useState(0);
const [galerieChargement, setGalerieChargement] = useState(false);
const [messageGalerieAnalyses, setMessageGalerieAnalyses] = useState("");
const galerieTouchStartXRef = useRef(null);
const galerieTouchStartYRef = useRef(null);

const [actualisationEnCours, setActualisationEnCours] = useState(false);
const [messageActualisation, setMessageActualisation] = useState("");
const [derniereActualisation, setDerniereActualisation] = useState(null);

const [modeParametres, setModeParametres] = useState(false);
const [modeDemonstrationActif, setModeDemonstrationActif] = useState(
  localStorage.getItem("photoCartelModeDemonstrationActif") === "true"
);
const [cheminDossierModeDemonstration, setCheminDossierModeDemonstration] = useState(
  localStorage.getItem("photoCartelCheminModeDemonstration") || ""
);
const [modeDemonstrationEnCours, setModeDemonstrationEnCours] = useState(false);

  const cheminCible =
    voyage && villeVisite && lieuVisite
      ? `${dossierRacine}\\${voyage}\\${villeVisite}\\${lieuVisite}`
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
    // En local PC, on conserve C:\Voyages.
    // En cloud, on laisse le serveur choisir son dossier de données.
    return apiPhotoCartelLocale() ? dossierRacineAnalyseActif : "";
  }

  const debutVisiteMs = Number(localStorage.getItem("photoCartelDebutVisiteMs") || 0);

  function formaterDate(date) {
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
  setMessageActualisation("");
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

alert(`Voyage "${voyageEnCours}" terminé.`);

setModeGestionVoyage(false);
}


function estAndroid() {
  return /Android/i.test(navigator.userAgent || "");
}

function ouvrirAppareilPhoto() {
  // v17.3.7 : retour volontaire à la méthode stable v17.3.5.
  // Elle ouvre bien la caméra du téléphone, même si elle revient encore
  // dans PhotoCartel après validation de chaque photo.
  const input = inputPrendrePhotosRef.current;

  if (input) {
    input.value = null;
    input.click();
  }
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

  setDerniereActionVisite("Appareil photo ouvert le " + formaterDate(new Date()));
  ouvrirAppareilPhoto();
}

function handleAnalyserUnePhoto() {
  const input = inputAnalyserPhotoRef.current;

  if (input) {
    input.value = null;
    input.click();
  }
}

async function handlePhotoAnalyseSelection(event) {
  const fichier = event.target.files?.[0];

  if (!fichier) {
    return;
  }

  const imageLocaleUrl = URL.createObjectURL(fichier);

  setAnalysePhotoFile(fichier);
  setAnalysePhotoUrl(imageLocaleUrl);
  setAnalysePhotoResultat(null);
  setModeAnalysePhoto(true);
  setAnalysePhotoEnCours(true);
  setMessageAnalysePhoto("Analyse IA en cours...");

  try {
    const formData = new FormData();
    formData.append("photo", fichier, fichier.name || "photo.jpg");

    const response = await fetch(API_BASE + "/analyser-photo-one-shot", {
      method: "POST",
      body: formData,
    });

    const data = await lireReponseJsonPhotoCartel(
      response,
      "Erreur analyse photo"
    );

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Erreur analyse IA");
    }

    setAnalysePhotoResultat(data.result);
    setMessageAnalysePhoto("");
  } catch (error) {
    console.error(error);
    setAnalysePhotoResultat(null);
    setMessageAnalysePhoto("Erreur analyse photo : " + error.message + " — vérifie que l’API Render répond bien sur " + API_BASE + ".");
  } finally {
    setAnalysePhotoEnCours(false);
  }
}

function fermerAnalysePhoto() {
  setModeAnalysePhoto(false);
  setAnalysePhotoFile(null);
  setAnalysePhotoUrl("");
  setAnalysePhotoResultat(null);
  setAnalysePhotoEnCours(false);
  setPhotoPleinEcranUrl("");
  setMessageAnalysePhoto("");
  setAnalysePhotoSauvegardeEnCours(false);
}

function retourAccueilDepuisAnalysePhoto() {
  fermerAnalysePhoto();
}

function reprendreAnalysePhoto() {
  setAnalysePhotoResultat(null);
  setMessageAnalysePhoto("");
  handleAnalyserUnePhoto();
}

async function enregistrerAnalysePhoto() {
  if (!analysePhotoFile || !analysePhotoResultat) {
    alert("Aucune analyse à enregistrer.");
    return;
  }

  try {
    setAnalysePhotoSauvegardeEnCours(true);

    const formData = new FormData();
    formData.append("photo", analysePhotoFile, analysePhotoFile.name || "photo.jpeg");
    formData.append("analyse", JSON.stringify(analysePhotoResultat));
    formData.append("dossierRacine", dossierRacineEnvoyeAuServeur());

    const response = await fetch(API_BASE + "/sauvegarder-analyse-photo", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Erreur sauvegarde analyse");
    }

    alert(
      "Analyse sauvegardée.\n\n" +
        "Photo : " +
        data.nomPhoto +
        "\nJSON : " +
        data.nomJson +
        "\n\nDossier :\n" +
        (data.cheminDestination || data.dossierDestination || "Dossier non retourné")
    );
  } catch (error) {
    console.error(error);
    alert("Erreur sauvegarde analyse : " + error.message);
  } finally {
    setAnalysePhotoSauvegardeEnCours(false);
  }
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

  if (!texte && !afficherVide) {
    return null;
  }

  return (
    <div style={styles.analyseLigne}>
      <div style={styles.analyseLabel}>{label}</div>
      <div style={styles.analyseValeur}>{texte}</div>
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

      {afficherTitreBlocAnalyse("🎨 Contenu analysé")}

      <div style={styles.analyseType}>
        {premiereValeur(
          identification.type_general,
          analyse.type_detecte,
          identification.objet_principal,
          analyse.objet_principal,
          "Type non identifié"
        )}
      </div>

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

async function ouvrirGaleriePhotosAnalysees() {
  try {
    setModeGalerieAnalyses(true);
    setGalerieChargement(true);
    setMessageGalerieAnalyses("Chargement de la galerie...");
    setGalerieAnalyses([]);
    setGalerieIndex(0);

    const response = await fetch(
      API_BASE +
        "/photos-analysees?dossierRacine=" +
        encodeURIComponent(dossierRacineEnvoyeAuServeur())
    );
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Erreur chargement galerie");
    }

    setGalerieAnalyses(data.photos || []);
    setGalerieIndex(0);
    setMessageGalerieAnalyses(
      data.photos?.length
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

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Erreur suppression fiche");
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
  if (!voyage) {
    alert("Aucun voyage actif.");
    return;
  }

  if (!cheminCollecteActif) {
    alert("Aucun dossier de visite actif.");
    return;
  }

  const input = inputActualiserPhotosRef.current;

  if (input) {
    input.value = null;
    input.click();
  }
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
      "Aucune photo sélectionnée ne semble avoir été prise depuis le début de la visite."
    );
    return;
  }

  try {
    setActualisationEnCours(true);
    setMessageActualisation(
      `Actualisation en cours : ${fichiersDepuisDebut.length} photo(s) à copier.`
    );

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
      setMessageActualisation("Erreur actualisation : " + data.error);
      alert("Erreur actualisation : " + data.error);
      return;
    }

    setPhotosCollectees(data.totalDestination || data.copies || 0);
    setDerniereActualisation(data);
    setMessageActualisation(
      `Actualisation terminée : ${data.copies} photo(s) copiée(s), ${data.ignores} déjà présente(s).`
    );
    setDerniereActionVisite("Photos actualisées le " + formaterDate(new Date()));
  } catch (error) {
    console.error(error);
    setMessageActualisation("Erreur actualisation : " + error.message);
    alert("Erreur actualisation : " + error.message);
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
  const nomTampon = `A_EN_COURS_${timestampDossier(maintenant)}`;
  const cheminTampon = villeVisite
    ? `${dossierRacine}\\${voyage}\\${villeVisite}\\${nomTampon}`
    : `${dossierRacine}\\${voyage}\\${nomTampon}`;

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

    setStatutVisite("EN_COURS");
    setDateFinVisite(null);
    setDossierTampon(nomTampon);
    setCheminTamponActif(cheminTampon);
    setLieuVisite(nomTampon);
    setTypeVisite("");
    setModeAucuneVisite(false);
    setDerniereActionVisite("Collecte libre créée le " + formaterDate(maintenant));

    localStorage.setItem("photoCartelStatutVisite", "EN_COURS");
    localStorage.setItem("photoCartelLieuActif", nomTampon);
    localStorage.setItem("photoCartelTypeVisiteActif", "");
    localStorage.setItem("photoCartelDossierTamponActif", nomTampon);
    localStorage.setItem("photoCartelCheminTamponActif", cheminTampon);
    localStorage.setItem("photoCartelDebutVisiteMs", String(maintenant.getTime()));

    setTimeout(() => {
      ouvrirAppareilPhoto();
    }, 0);
  } catch (error) {
    console.error(error);
    alert("Erreur lors de la création du dossier tampon");
  }
}

function handlePhotosPrises(event) {
  const fichiers = Array.from(event.target.files || []);

  if (fichiers.length === 0) {
    return;
  }

  // Fallback PC / navigateur non Android uniquement.
  setPhotosCollectees((ancien) => ancien + fichiers.length);
  setDerniereActionVisite(
    `${fichiers.length} photo(s) sélectionnée(s) le ${formaterDate(new Date())}`
  );
}



  function statutLisible() {
    if (statutVisite === "TERMINEE") return "TERMINÉE";
    if (resultatClassification) return "CLASSIFIÉE";
    return "EN COURS";
  }

  async function finDeVisite() {
    if (!voyage) {
      alert("Aucun voyage actif");
      return;
    }

    const maintenant = new Date();
    const nomTampon = `A_EN_COURS_${timestampDossier(maintenant)}`;
    const estTamponActif = (lieuVisite || "").startsWith("A_EN_COURS");

    let cheminParentTampon = "";

    if (estTamponActif && cheminCollecteActif) {
      const morceaux = cheminCollecteActif.split("\\").filter(Boolean);
      morceaux.pop();
      cheminParentTampon = morceaux.join("\\");
    } else if (villeVisite) {
      cheminParentTampon = `${dossierRacine}\\${voyage}\\${villeVisite}`;
    } else {
      cheminParentTampon = `${dossierRacine}\\${voyage}`;
    }

    const cheminTampon = `${cheminParentTampon}\\${nomTampon}`;

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

      const debutVisiteStocke = Number(localStorage.getItem("photoCartelDebutVisiteMs") || 0);
      const derniereVisiteInfo = {
        nom: lieuVisite || "Visite non renseignée",
        ville: villeVisite || "",
        type: estTamponActif ? "" : typeVisite || "",
        dateCloture: formaterDate(maintenant),
        duree: debutVisiteStocke ? formaterDuree(maintenant.getTime() - debutVisiteStocke) : "",
        nombrePhotos: photosCollectees || 0,
      };

      setDerniereVisite(derniereVisiteInfo);
      localStorage.setItem("photoCartelDerniereVisite", JSON.stringify(derniereVisiteInfo));

      setStatutVisite("EN_COURS");
      setDateFinVisite(null);
      setDossierTampon(nomTampon);
      setCheminTamponActif(cheminTampon);
      setLieuVisite(nomTampon);
      setTypeVisite("");
      setDerniereActionVisite(
        `${estTamponActif ? "Dossier tampon clôturé" : "Visite clôturée"} le ${formaterDate(maintenant)}. Nouveau dossier tampon actif : ${nomTampon}`
      );
      setPhotosCollectees(0);
      setMessageActualisation("");
      setDerniereActualisation(null);

      localStorage.setItem("photoCartelStatutVisite", "EN_COURS");
      localStorage.setItem("photoCartelLieuActif", nomTampon);
      localStorage.setItem("photoCartelTypeVisiteActif", "");
      localStorage.setItem("photoCartelDossierTamponActif", nomTampon);
      localStorage.setItem("photoCartelCheminTamponActif", cheminTampon);
      localStorage.setItem("photoCartelDebutVisiteMs", String(maintenant.getTime()));

      alert(
        (estTamponActif
          ? "Dossier tampon clôturé.\n\n"
          : "Visite clôturée.\n\n") +
          "Nouveau dossier tampon actif :\n\n" +
          nomTampon +
          "\n\nChemin :\n" +
          cheminTampon
      );
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la fin de visite");
    }
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

  const cheminVoyage = `${dossierRacine}\\${nomVoyage}`;

  try {
    const response = await fetch(API_BASE + "/creer-dossier", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chemin: cheminVoyage,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      alert("Erreur création voyage : " + data.error);
      return;
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
    setMessageActualisation("");
    setDerniereActualisation(null);
    setResultatClassification(null);
    setDashboardRenommage(null);
    setMessageImport("");
    setMessageRenommage("");

    setNomNouveauVoyage("");
    setModeCreationVoyage(false);
    setModeGestionVoyage(false);

    alert("Voyage créé :\n\n" + nomVoyage);
  } catch (error) {
    console.error(error);
    alert("Erreur lors de la création du voyage");
  }
};

const validerNouvelleVisite = async () => {
  const ville = villeNouvelleVisite.trim();
  const lieu = lieuNouvelleVisite.trim();

  if (!voyage) {
    alert("Aucun voyage actif");
    return;
  }

  if (!ville) {
    alert("Ville manquante");
    return;
  }

  if (!lieu) {
    alert("Lieu manquant");
    return;
  }

  const nouveauChemin = `${dossierRacine}\\${voyage}\\${ville}\\${lieu}`;

  try {
    const response = await fetch(API_BASE + "/creer-dossier", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chemin: nouveauChemin,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      alert("Erreur création dossier : " + data.error);
      return;
    }

    if (typeNouvelleVisite === "Musée") {
      const responseCategories = await fetch(
        API_BASE + "/creer-categories-musee",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chemin: nouveauChemin,
          }),
        }
      );

      const dataCategories = await responseCategories.json();

      if (!dataCategories.success) {
        alert("Erreur catégories musée : " + dataCategories.error);
        return;
      }
    }

    setVilleVisite(ville);
    setLieuVisite(lieu);
    setTypeVisite(typeNouvelleVisite);


    localStorage.setItem("photoCartelVilleActive", ville);
localStorage.setItem("photoCartelLieuActif", lieu);
localStorage.setItem("photoCartelTypeVisiteActif", typeNouvelleVisite);
localStorage.setItem("photoCartelDebutVisiteMs", String(Date.now()));

    setVisiteActive({
      ville,
      lieu,
      type: typeNouvelleVisite,
      chemin: nouveauChemin,
    });

    setStatutVisite("EN_COURS");
    setDateFinVisite(null);
    setDossierTampon("");
    setCheminTamponActif("");
    setDerniereActionVisite("Nouvelle visite créée le " + formaterDate(new Date()));
    setPhotosCollectees(0);
    setMessageActualisation("");
    setDerniereActualisation(null);
    setResultatClassification(null);
    setDashboardRenommage(null);
    setMessageImport("");
    setMessageRenommage("");

    setVilleNouvelleVisite("");
    setLieuNouvelleVisite("");
    setModeCreationVisite(false);

    alert(
      "Visite créée :\n\n" +
        ville +
        "\n" +
        lieu +
        "\n\nType : " +
        typeNouvelleVisite +
        (typeNouvelleVisite === "Musée"
          ? "\n\nCatégories musée créées automatiquement."
          : "")
    );
  } catch (error) {
    console.error(error);
    alert("Erreur lors de la création de la visite");
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

  const estCollecteLibre = (lieuVisite || "").startsWith("A_EN_COURS");

  const typeVisiteAffiche = estCollecteLibre
    ? "—"
    : typeVisite || "—";

  const valeurOuVide = (valeur, secours) => valeur || secours;

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#f7f3ec",
      fontFamily: "Inter, Arial, sans-serif",
      padding: "18px",
      paddingBottom: "104px",
      color: "#192028",
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
      fontSize: "12px",
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
      gridTemplateColumns: "repeat(3, 1fr)",
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
      overflowY: "auto",
      padding: "18px",
      paddingBottom: "104px",
      color: "#192028",
      fontFamily: "Inter, Arial, sans-serif",
    },
    analyseTelephone: {
      width: "100%",
      maxWidth: "430px",
      margin: "0 auto",
      padding: "20px 0 96px",
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
    analyseCarte: {
      backgroundColor: "rgba(255,255,255,0.88)",
      border: "1px solid rgba(199,166,110,0.20)",
      borderRadius: "18px",
      padding: "16px",
      boxShadow: "0 10px 26px rgba(91,67,38,0.08)",
      textAlign: "left",
    },
    analyseBlocTitre: {
      margin: "8px 0 10px",
      padding: "9px 10px",
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
      margin: "4px 0 14px",
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
    if (!modeDemonstrationActif) return null;

    return (
      <section style={styles.bandeauModeDemonstration}>
        <div style={styles.bandeauModeDemonstrationTitre}>
          <span style={styles.pointModeDemonstration}>●</span>
          MODE DÉMONSTRATION EN COURS
        </div>
        <p style={styles.bandeauModeDemonstrationTexte}>
          Les analyses enregistrées sont stockées dans le dossier de démonstration.
        </p>
      </section>
    );
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

  function BarreFixe() {
    // v19.2 : barre fixe = accès permanent aux gestes essentiels de PhotoCartel.
    // Accueil, Analyser une photo et Nouvelle visite sont connectés aux fonctions existantes.
    const boutons = [
      {
        icone: "🏠",
        texte: "Accueil",
        action: () => {
          fermerAnalysePhoto();
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
        action: () => setModeCreationVisite(true),
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

  return (
    <div style={styles.page}>
      <BarreFixe />
      {photoPleinEcranUrl && (
        <div
          style={styles.pleinEcranPhoto}
          onClick={() => setPhotoPleinEcranUrl("")}
        >
          <img
            src={photoPleinEcranUrl}
            alt="Photo originale"
            style={styles.pleinEcranImage}
          />
        </div>
      )}

      {modeAnalysePhoto && (
        <div style={styles.analyseEcran}>
          <main style={styles.analyseTelephone}>
            <h1 style={styles.titre}>Analyse d'une photo</h1>
            <BandeauModeDemonstration />

            {analysePhotoUrl && (
              <img
                src={analysePhotoUrl}
                alt="Photo analysée"
                style={styles.analyseMiniature}
                onClick={() => setPhotoPleinEcranUrl(analysePhotoUrl)}
              />
            )}

            <div style={styles.analyseCarte}>
              {analysePhotoEnCours && (
                <>
                  <h2 style={styles.analyseType}>Analyse IA en cours...</h2>
                  <p>PhotoCartel analyse la photo. Merci de patienter.</p>
                </>
              )}

              {!analysePhotoEnCours && messageAnalysePhoto && (
                <>
                  <h2 style={styles.analyseType}>Analyse impossible</h2>
                  <p>{messageAnalysePhoto}</p>
                </>
              )}

              {!analysePhotoEnCours && analysePhotoResultat && (
                <>
                  {afficherFicheAnalyse(analysePhotoResultat)}
                  {afficherBoutonAnalyseComplete()}
                </>
              )}
            </div>

            <div style={styles.analyseBoutons}>
              <button
                type="button"
                onClick={enregistrerAnalysePhoto}
                disabled={
                  analysePhotoEnCours ||
                  analysePhotoSauvegardeEnCours ||
                  !analysePhotoResultat
                }
                style={{
                  ...styles.boutonAnalyseSauver,
                  opacity:
                    analysePhotoEnCours ||
                    analysePhotoSauvegardeEnCours ||
                    !analysePhotoResultat
                      ? 0.45
                      : 1,
                  cursor:
                    analysePhotoEnCours ||
                    analysePhotoSauvegardeEnCours ||
                    !analysePhotoResultat
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {analysePhotoSauvegardeEnCours
                  ? "Sauvegarde en cours..."
                  : "Enregistrer l'analyse"}
              </button>

              <button
                type="button"
                onClick={reprendreAnalysePhoto}
                disabled={analysePhotoEnCours}
                style={{
                  ...styles.boutonAnalyseSecondaire,
                  opacity: analysePhotoEnCours ? 0.45 : 1,
                  cursor: analysePhotoEnCours ? "not-allowed" : "pointer",
                }}
              >
                Reprendre une photo
              </button>

              <button
                type="button"
                onClick={retourAccueilDepuisAnalysePhoto}
                style={styles.boutonAnalyseSecondaire}
              >
                🏠 Retour à l'accueil
              </button>

              <button
                type="button"
                onClick={fermerAnalysePhoto}
                style={styles.boutonAnalyseFermer}
              >
                Fermer sans enregistrer
              </button>
            </div>
          </main>
        </div>
      )}

      {modeGalerieAnalyses && (
        <div style={styles.analyseEcran}>
          <main style={styles.analyseTelephone}>
            <h1 style={styles.titre}>Galerie des photos analysées</h1>
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
                      src={API_BASE + fiche.imageUrl}
                      alt={fiche.nomPhoto || "Photo analysée"}
                      style={styles.analyseMiniature}
                      onClick={() => setPhotoPleinEcranUrl(API_BASE + fiche.imageUrl)}
                    />
                  )}

                  <div
                    style={styles.analyseCarte}
                    onTouchStart={handleGalerieTouchStart}
                    onTouchEnd={handleGalerieTouchEnd}
                  >
                    {afficherFicheAnalyse(analyse)}
                    {afficherBoutonAnalyseComplete()}
                    {afficherChampAnalyse("Photo", fiche.nomPhoto)}
                    {afficherChampAnalyse("JSON", fiche.nomJson)}
                    {afficherChampAnalyse("Date", fiche.dateAnalyseLocale)}
                  </div>

                  <p style={styles.galerieAideSwipe}>
                    Balaye la fiche vers la gauche ou la droite pour passer à une autre analyse.
                  </p>

                  <button
                    type="button"
                    onClick={supprimerFicheGalerie}
                    disabled={galerieChargement}
                    style={{
                      ...styles.boutonAnalyseFermer,
                      marginTop: 16,
                      opacity: galerieChargement ? 0.45 : 1,
                      cursor: galerieChargement ? "not-allowed" : "pointer",
                    }}
                  >
                    Supprimer cette fiche
                  </button>
                </>
              );
            })()}

            <div style={styles.analyseBoutons}>
              <button
                type="button"
                onClick={ouvrirGaleriePhotosAnalysees}
                disabled={galerieChargement}
                style={styles.boutonAnalyseSecondaire}
              >
                Actualiser la galerie
              </button>

              <button
                type="button"
                onClick={exporterDonneesPhotosAnalysees}
                disabled={galerieChargement}
                style={styles.boutonAnalyseSecondaire}
              >
                Exporter les photos analysées
              </button>
              <button
                type="button"
                onClick={fermerGaleriePhotosAnalysees}
                style={styles.boutonAnalyseFermer}
              >
                Retour
              </button>
            </div>
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
            <h2>Actualisation en cours</h2>
            <p>Copie des photos vers le dossier de visite.</p>
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
                Statut : <strong>{modeDemonstrationActif ? "ACTIF" : "INACTIF"}</strong>
              </p>

              {modeDemonstrationActif && (
                <p style={styles.parametresChemin}>
                  {cheminDossierModeDemonstration || "Dossier de démonstration actif"}
                </p>
              )}

              {!modeDemonstrationActif && (
                <button
                  type="button"
                  onClick={lancerModeDemonstration}
                  disabled={modeDemonstrationEnCours}
                  style={{
                    ...styles.bouton,
                    opacity: modeDemonstrationEnCours ? 0.45 : 1,
                    cursor: modeDemonstrationEnCours ? "not-allowed" : "pointer",
                  }}
                >
                  {modeDemonstrationEnCours
                    ? "Lancement en cours..."
                    : "Lancer le mode démonstration"}
                </button>
              )}

              {modeDemonstrationActif && (
                <>
                  <button
                    type="button"
                    onClick={exporterPhotosModeDemonstration}
                    disabled={modeDemonstrationEnCours}
                    style={{
                      ...styles.boutonTraitement,
                      opacity: modeDemonstrationEnCours ? 0.45 : 1,
                      cursor: modeDemonstrationEnCours ? "not-allowed" : "pointer",
                    }}
                  >
                    Exporter les photos de démonstration
                  </button>

                  <button
                    type="button"
                    onClick={sortirModeDemonstration}
                    disabled={modeDemonstrationEnCours}
                    style={{
                      ...styles.boutonAnalyseFermer,
                      marginTop: 9,
                      opacity: modeDemonstrationEnCours ? 0.45 : 1,
                      cursor: modeDemonstrationEnCours ? "not-allowed" : "pointer",
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
            <h3>Nouvelle visite</h3>

            <label>
              <strong>Ville</strong>
              <input
                type="text"
                value={villeNouvelleVisite}
                onChange={(e) => setVilleNouvelleVisite(e.target.value)}
                placeholder="Ex : Lima"
                style={styles.input}
              />
            </label>

            <label>
              <strong>Lieu</strong>
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
                <option value="Autre">Autre</option>
              </select>
            </label>

            <button onClick={validerNouvelleVisite} style={styles.bouton}>
              Valider
            </button>
            <button
              onClick={() => setModeCreationVisite(false)}
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
                setModeAucuneVisite(false);
                setModeCreationVisite(true);
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
        <header style={styles.hero}>
          <div style={styles.logoIcone}>PC</div>
          <h1 style={styles.titre}>PhotoCartel</h1>
        </header>

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
                titre="Prendre des photos"
                onClick={handlePrendreDesPhotos}
                disabled={!voyage}
                couleur="#c18418"
              />
              <ActionCarte
                icone="🖼️"
                titre="Galerie"
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
          multiple
          onChange={handlePhotosPrises}
          style={{ display: "none" }}
        />

        <input
          ref={inputAnalyserPhotoRef}
          id="analyse-photo-one-shot"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhotoAnalyseSelection}
          style={{ display: "none" }}
        />

        <input
          ref={inputActualiserPhotosRef}
          id="actualisation-photos-visite"
          type="file"
          accept="image/*"
          multiple
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
