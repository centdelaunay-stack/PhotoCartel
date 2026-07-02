import { useState, useRef } from "react";
import Tesseract from "tesseract.js";
import cv from "@techstark/opencv-js";

function App() {
  console.log("APP PRINCIPALE");

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

  const [voyage, setVoyage] = useState("Corée du Sud, mai 2026");
  const [villeVisite, setVilleVisite] = useState("Séoul");
  const [lieuVisite, setLieuVisite] = useState("Musée National de Corée");
  const [dossierRacine, setDossierRacine] = useState("C:\\Voyages");

  const [typeVisite, setTypeVisite] = useState("Musée");
  const [typeNouvelleVisite, setTypeNouvelleVisite] = useState("Musée");

  const [visiteActive, setVisiteActive] = useState(null);
  const [modeCreationVisite, setModeCreationVisite] = useState(false);
  const [nomNouvelleVisite, setNomNouvelleVisite] = useState("");

  const [statutVisite, setStatutVisite] = useState("EN_COURS");
  const [dateFinVisite, setDateFinVisite] = useState(null);
  const [dossierTampon, setDossierTampon] = useState("");
  const [cheminTamponActif, setCheminTamponActif] = useState("");
  const [derniereActionVisite, setDerniereActionVisite] = useState("");
  const [photosCollectees, setPhotosCollectees] = useState(0);

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

const cheminRenommagePrepareRef = useRef("");

  const cheminCible =
    voyage && villeVisite && lieuVisite
      ? `${dossierRacine}\\${voyage}\\${villeVisite}\\${lieuVisite}`
      : "";

  const cheminCollecteActif =
    statutVisite === "TERMINEE" && cheminTamponActif
      ? cheminTamponActif
      : cheminCible;

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

  function statutLisible() {
    if (statutVisite === "TERMINEE") return "TERMINÉE";
    if (resultatClassification) return "CLASSIFIÉE";
    return "EN COURS";
  }

  async function finDeVisite() {
    if (!cheminCible) {
      alert("Chemin de visite manquant");
      return;
    }

    const maintenant = new Date();
    const nomTampon = `A_EN_COURS_${timestampDossier(maintenant)}`;
    const cheminTampon = `${dossierRacine}\\${voyage}\\${villeVisite}\\${nomTampon}`;

    try {
      const response = await fetch("http://localhost:3001/creer-dossier", {
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

      setStatutVisite("TERMINEE");
      setDateFinVisite(maintenant);
      setDossierTampon(nomTampon);
      setCheminTamponActif(cheminTampon);
      setDerniereActionVisite(`Fin de visite le ${formaterDate(maintenant)}`);

      alert(
        "Visite clôturée.\n\n" +
          "Les prochaines photos seront enregistrées dans :\n\n" +
          nomTampon
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

alert("handleSelectionDossier appelée");


console.log("FILES =", event.target.files);
console.log("PREMIER FICHIER =", event.target.files?.[0]);
console.log("WEBKIT PATH =", event.target.files?.[0]?.webkitRelativePath);


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

if (fichiers.length === 0) {
setFichiersRenommage([]);
setDossierRenommage("");
setNombrePhotosRenommage(0);
setMessageRenommage("Aucun fichier sélectionné pour renommage");
return;
}

const premierChemin =
  fichiers[0].webkitRelativePath || fichiers[0].name;

const nomDossier = premierChemin.includes("/")
  ? premierChemin.split("/")[0]
  : "Dossier sélectionné";

setFichiersRenommage(fichiers);
setDossierRenommage(nomDossier);
setNombrePhotosRenommage(fichiers.length);
setMessageRenommage(
  `${fichiers.length} œuvres sélectionnées pour renommage`
);

}



  async function classifierDossierTest() {
    try {
      if (!fichiersImport || fichiersImport.length === 0) {
        alert("Aucun dossier importé. Sélectionne d'abord un dossier.");
        return;
      }

      if (!cheminCible) {
        alert("Chemin de destination manquant");
        return;
      }

      const dateDebut = new Date();

      setClassificationEnCours(true);
      setResultatClassification(null);
      setMessageImport(
        `Classification en cours du dossier "${dossierImport}" : ${nombrePhotos} photos à traiter.`
      );

      const formData = new FormData();

      for (const fichier of fichiersImport) {
        formData.append("photos", fichier, fichier.name);
      }

      

const timestampClassification = new Date()
  .toISOString()
  .replace(/:/g, "-")
  .replace("T", "_")
  .slice(0, 16);

const nomDossierSortie =
  `${dossierImport}_classifié_${timestampClassification}Z`;

const cheminDestinationClassification =
  `${dossierRacine}\\Classifications\\${nomDossierSortie}`;

formData.append("cheminDestination", cheminDestinationClassification);


      const response = await fetch("http://localhost:3001/classifier-fichiers", {
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
    const listeFichiers = Array.from(fichiersAUtiliser || []);


const cheminRelatif = listeFichiers[0]?.webkitRelativePath || "";
const nomDossierSource = cheminRelatif
  ? cheminRelatif.split("/")[0]
  : dossierRenommage || "Dossier_selectionne";



    if (listeFichiers.length === 0) {
      alert("Aucun dossier de renommage sélectionné.");
      return;
    }

    setMessageRenommage(
      `Renommage préparé : ${listeFichiers.length} œuvres copiées depuis "${nomDossierSource}".`
    );

    const formData = new FormData();

    for (const fichier of listeFichiers) {
      formData.append("oeuvres", fichier, fichier.name);
    }


    formData.append("dossierSource", nomDossierSource);
formData.append("dossierRacine", dossierRacine);
formData.append("nomDossierSource", nomDossierSource);



    const response = await fetch("http://localhost:3001/renommer-oeuvres-fichiers", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

if (data.success) {
  const cheminPrepare =
  data.cheminDestination ||
  `${dossierRacine}\\Oeuvres renommées\\${data.dossierSortie}`;

  setCheminRenommagePrepare(cheminPrepare);

  console.log("CHEMIN PREPARE =", cheminPrepare);

  cheminRenommagePrepareRef.current = cheminPrepare;

  setRenommagePret(true);

  setMessageRenommage(
    `Renommage préparé : ${data.total} œuvres copiées depuis "${nomDossierSource}".`
  );
} else {
  setMessageRenommage("Erreur renommage : " + data.error);
  alert(data.error);
}


      
    
  } catch (error) {
    console.error(error);
    setMessageRenommage("Erreur renommage : " + error.message);
    alert(error.message);
  }
}


async function lancerRenommageFinal() {
  try {
   
const cheminFinal =
  cheminRenommagePrepareRef.current || cheminRenommagePrepare;

console.log("CHEMIN FINAL UTILISÉ =", cheminFinal);

if (!cheminFinal) {
  alert("Aucun dossier préparé pour le renommage.");
  return;
}


    setMessageRenommage(
    
`Renommage final en cours du dossier "${dossierRenommage}"...`

    );

    const response = await fetch("http://localhost:3001/renommer-oeuvres", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({


cheminVisite: cheminFinal,
      }),


    });

    const data = await response.json();

    if (data.success) {
      setMessageRenommage(
        `Renommage terminé : ${data.renommes} œuvres renommées, ${data.aVerifier} à vérifier.`
      );
    } else {
      setMessageRenommage("Erreur renommage final : " + data.error);
      alert(data.error);
    }
  } catch (error) {
    console.error(error);
    setMessageRenommage("Erreur renommage final : " + error.message);
    alert(error.message);
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
      const response = await fetch("http://localhost:3001/creer-dossier", {
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
        "http://localhost:3001/creer-categories-musee",
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

  const validerNouvelleVisite = async () => {
    if (!nomNouvelleVisite.trim()) {
      alert("Nom de visite manquant");
      return;
    }

    const nouveauChemin =
      voyage && villeVisite && nomNouvelleVisite
        ? `${dossierRacine}\\${voyage}\\${villeVisite}\\${nomNouvelleVisite}`
        : "";

    try {
      const response = await fetch("http://localhost:3001/creer-dossier", {
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
          "http://localhost:3001/creer-categories-musee",
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

      setLieuVisite(nomNouvelleVisite);
      setTypeVisite(typeNouvelleVisite);

      setVisiteActive({
        nom: nomNouvelleVisite,
        type: typeNouvelleVisite,
        chemin: nouveauChemin,
      });

      setStatutVisite("EN_COURS");
      setDateFinVisite(null);
      setDossierTampon("");
      setCheminTamponActif("");
      setDerniereActionVisite("Nouvelle visite créée le " + formaterDate(new Date()));
      setPhotosCollectees(0);
      setResultatClassification(null);

      alert(
        "Visite créée :\n\n" +
          nomNouvelleVisite +
          "\n\nType : " +
          typeNouvelleVisite +
          (typeNouvelleVisite === "Musée"
            ? "\n\nCatégories musée créées automatiquement."
            : "")
      );

      setNomNouvelleVisite("");
      setModeCreationVisite(false);
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

        const response = await fetch("http://localhost:3001/analyse-cartel", {
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

  return (
    <div
      style={{
        fontFamily: "Arial",
        padding: "20px",
      }}
    >
      {classificationEnCours && (
        <div
          style={{
            position: "fixed",
            zIndex: 9999,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "12px",
              width: "520px",
              textAlign: "center",
              fontSize: "18px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            }}
          >
            <h2>Classification en cours</h2>
            <p>Dossier : {dossierImport}</p>
            <p>Photos à traiter : {nombrePhotos}</p>
            <p>Merci de patienter.</p>
          </div>
        </div>
      )}

      <h1
        style={{
          textAlign: "center",
          marginBottom: "40px",
        }}
      >
        PhotoCartel v10
      </h1>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setModeCreationVisite(true)}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Nouvelle visite
        </button>

        <button
          onClick={finDeVisite}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            marginLeft: "10px",
            fontWeight: "bold",
          }}
        >
          Fin de visite
        </button>

        
        {modeCreationVisite && (
          <div
            style={{
              marginBottom: "20px",
              padding: "15px",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          >
            <h3>Nouvelle visite</h3>

            <div style={{ marginBottom: "10px" }}>
              <strong>Nom de la visite :</strong>
              <input
                type="text"
                value={nomNouvelleVisite}
                onChange={(e) => setNomNouvelleVisite(e.target.value)}
                placeholder="Nom de la visite"
                style={{
                  width: "300px",
                  marginLeft: "10px",
                }}
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <strong>Type de visite :</strong>
              <select
                value={typeNouvelleVisite}
                onChange={(e) => setTypeNouvelleVisite(e.target.value)}
                style={{
                  marginLeft: "10px",
                  width: "200px",
                }}
              >
                <option value="Musée">Musée</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <button onClick={validerNouvelleVisite}>Valider</button>

            <button
              onClick={() => setModeCreationVisite(false)}
              style={{ marginLeft: "10px" }}
            >
              Annuler
            </button>
          </div>
        )}

        <div>
          <h3>Paramètres de stockage</h3>

          <div style={{ marginBottom: "10px" }}>
            <strong>Dossier racine :</strong>
            <input
              value={dossierRacine}
              onChange={(e) => setDossierRacine(e.target.value)}
              style={{
                marginLeft: "10px",
                width: "400px",
              }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <strong>Voyage :</strong>
            <input
              value={voyage}
              onChange={(e) => setVoyage(e.target.value)}
              style={{
                marginLeft: "10px",
                width: "300px",
              }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <strong>Ville :</strong>
            <input
              value={villeVisite}
              onChange={(e) => setVilleVisite(e.target.value)}
              style={{
                marginLeft: "10px",
                width: "300px",
              }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <strong>Lieu :</strong>
            <input
              value={lieuVisite}
              onChange={(e) => setLieuVisite(e.target.value)}
              style={{
                marginLeft: "10px",
                width: "300px",
              }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <strong>Type de visite :</strong> {typeVisite}
          </div>

          <div>
            <strong>Organisation du voyage :</strong>

            <div
              style={{
                textAlign: "left",
                display: "inline-block",
                fontFamily: "monospace",
                marginTop: "10px",
              }}
            >
              <div>📁 Voyages</div>
              <div style={{ marginLeft: "30px" }}>📁 {voyage}</div>
              <div style={{ marginLeft: "60px" }}>📁 {villeVisite}</div>
              <div style={{ marginLeft: "90px" }}>
                📍 {lieuVisite} ({typeVisite})
              </div>
              {dossierTampon && (
                <div style={{ marginLeft: "90px" }}>
                  📁 {dossierTampon} (collecte suivante)
                </div>
              )}
            </div>
          </div>

          <div
            style={{
              marginTop: "25px",
              marginBottom: "25px",
              padding: "20px",
              border: "1px solid #ddd",
              borderRadius: "14px",
              backgroundColor: "#f8f8f8",
              display: "inline-block",
              textAlign: "left",
              fontFamily: "monospace",
              minWidth: "520px",
              lineHeight: "1.8",
            }}
          >
            <div>Visite : {lieuVisite}</div>

            <br />

            <div>[{statutLisible()}]</div>


            <br />

<div>
  
<button
  onClick={classifierDossierTest}
  style={{ display: "none" }}
>
  Classifier les photos
</button>

</div>

<br />

            <br />

            <div>STATUT</div>

            <br />

            <div>✓ Visite créée</div>
            <div>{photosCollectees > 0 ? "✓" : "□"} Photos collectées</div>
            <div>{statutVisite === "TERMINEE" ? "✓" : "□"} Visite terminée</div>
            <div>{resultatClassification ? "✓" : "□"} Photos classifiées</div>
            <div>□ Œuvres renommées</div>
            <div>□ Vérification renommage effectuée</div>

            {resultatClassification && (
              <>
                <br />
                <div>Classification effectuée</div>
                <div style={{ marginLeft: "30px" }}>
                  {resultatClassification.stats.Oeuvres} œuvres
                </div>
                <div style={{ marginLeft: "30px" }}>
                  {resultatClassification.stats.Cartels} cartels
                </div>
                <div style={{ marginLeft: "30px" }}>
                  {resultatClassification.stats.Architecture} architecture
                </div>
              </>
            )}

            {derniereActionVisite && (
              <>
                <br />
                <div>Dernière action :</div>
                <div>{derniereActionVisite}</div>
              </>
            )}

            {dossierTampon && (
              <>
                <br />
                <div>Collecte suivante :</div>
                <div>{dossierTampon}</div>
              </>
            )}
          </div>

          {!visiteActive && (
            <button
            
              onClick={creerDossier}
              style={{
                 display: "none",
                marginTop: "10px",
                marginBottom: "20px",
              }}
            >
              Créer le dossier
            </button>
          )}

          {typeVisite !== "Musée" && !visiteActive && (
            <button
              onClick={() => creerCategoriesMusee(true)}
              style={{
                marginLeft: "10px",
                marginTop: "10px",
                marginBottom: "20px",
              }}
            >
              Créer catégories musée
            </button>
          )}

<button
  onClick={async () => {
    if (!oeuvreFile) {
      alert("Aucune photo chargée");
      return;
    }

    const formData = new FormData();

    if (statutVisite === "TERMINEE" && cheminTamponActif) {
      formData.append("photo", oeuvreFile);
      formData.append("chemin", cheminTamponActif);
      formData.append("nomFichier", oeuvreFile.name);
    } else {
      const classificationData = new FormData();
      classificationData.append("photo", oeuvreFile);

      const classificationResponse = await fetch(
        "http://localhost:3001/classifier-photo",
        {
          method: "POST",
          body: classificationData,
        }
      );

      const classificationResult = await classificationResponse.json();
      const categorie = classificationResult.categorie;

      alert("Catégorie IA = " + categorie);

      const cheminClasse = `${cheminCollecteActif}\\${categorie}`;

      formData.append("photo", oeuvreFile);
      formData.append("cartel", cartelFile);
      formData.append("chemin", cheminClasse);
      formData.append("nomFichier", nomEdite);
    }

    const response = await fetch("http://localhost:3001/sauvegarder-photo", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      setPhotosCollectees((ancien) => ancien + 1);
      alert("Photo sauvegardée :\n" + data.chemin);
    } else {
      alert(data.error);
    }
  }}
  style={{
    display: "inline-block",
    marginLeft: "10px",
    marginTop: "10px",
    marginBottom: "20px",
  }}
>
  Sauvegarder photo
</button>



          <hr style={{ marginTop: "40px", marginBottom: "20px" }} />

          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <h2>Classification</h2>

<p>
  Sélectionne un dossier de photos. PhotoCartel créera automatiquement les sous-dossiers de catégories puis classera les photos.
</p>



            <label
  htmlFor="selection-dossier-import"
  style={{
    display: "inline-block",
    padding: "8px 14px",
    border: "1px solid #999",
    borderRadius: "6px",
    cursor: "pointer",
    backgroundColor: "#f3f3f3",
    fontWeight: "bold",
  }}
>
  Classifier des photos
</label>

<input
  id="selection-dossier-import"
  type="file"
  webkitdirectory="true"
  directory="true"
  multiple
  onChange={handleSelectionDossier}
  style={{ display: "none" }}
/>


<br />
<br />

<label
  htmlFor="selection-dossier-renommage"
  style={{
    display: "inline-block",
    padding: "8px 14px",
    border: "1px solid #999",
    borderRadius: "6px",
    cursor: "pointer",
    backgroundColor: "#f3f3f3",
    fontWeight: "bold",
  }}
>
Renommer des œuvres

  </label>


  

<input
  id="selection-dossier-renommage"
  type="file"
  webkitdirectory="true"
  directory="true"
  multiple

onClick={(event) => { event.target.value = null; }}

onChange={(event) => {
  handleSelectionDossierRenommage(event);
 renommerOeuvresTest(Array.from(event.target.files || []));
}}

  style={{ display: "none" }}


/>



{messageRenommage && (
  <div
    style={{
      marginTop: "20px",
      padding: "15px",
      border: "1px solid #ddd",
      borderRadius: "10px",
      display: "inline-block",
      minWidth: "420px",
      backgroundColor: "#f8f8f8",
    }}
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

<button
  type="button"
  onClick={() => lancerRenommageFinal()}
  disabled={false}
  style={{
    marginTop: "15px",
    padding: "10px 20px",
    fontWeight: "bold",
    cursor: "pointer",
  }}
>
  Lancer le renommage
</button>



            {messageImport && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "15px",
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  display: "inline-block",
                  minWidth: "420px",
                  backgroundColor: "#f8f8f8",
                }}
              >
                <strong>{messageImport}</strong>
              </div>
            )}

            {dossierImport && (
              <div style={{ marginTop: "20px" }}>
                <p>
                  <strong>Dossier sélectionné :</strong> {dossierImport}
                </p>

                <p>
                  <strong>Photos détectées :</strong> {nombrePhotos}
                </p>

                <p>
                  <strong>Destination :</strong> {cheminCible}
                </p>

                <button
                  type="button"
                  onClick={classifierDossierTest}
                  disabled={classificationEnCours}
                  style={{
                    padding: "12px 25px",
                    fontSize: "18px",
                    cursor: classificationEnCours ? "not-allowed" : "pointer",
                    fontWeight: "bold",
                  }}
                >
                  {classificationEnCours
                    ? "Classification en cours..."
                    : "Lancer la classification"}
                </button>

                {resultatClassification && (
                  <div
                    style={{
                      marginTop: "30px",
                      textAlign: "left",
                      display: "inline-block",
                      border: "1px solid #ddd",
                      padding: "30px",
                      borderRadius: "20px",
                      backgroundColor: "#f7f7f7",
                      fontFamily: "monospace",
                      fontSize: "16px",
                      lineHeight: "1.8",
                      minWidth: "520px",
                    }}
                  >
                    <div>RÉSULTAT DE LA CLASSIFICATION</div>

                    <br />

                    <div>Fichier traité :</div>
                    <div>{resultatClassification.fichierTraite}</div>

                    <br />

                    <div>Date :</div>
                    <div>{resultatClassification.dateTraitement}</div>

                    <br />

                    <div>Temps de traitement :</div>
                    <div>{resultatClassification.dureeTraitement}</div>

                    <br />

                    <div>Destination :</div>
                    <div>{resultatClassification.destination}</div>

                    <br />

                    <div>--------------------------------</div>

                    <br />

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 80px",
                        columnGap: "20px",
                      }}
                    >
                      <div>Oeuvres</div>
                      <div style={{ textAlign: "right" }}>
                        {resultatClassification.stats.Oeuvres}
                      </div>

                      <div>Cartels</div>
                      <div style={{ textAlign: "right" }}>
                        {resultatClassification.stats.Cartels}
                      </div>

                      <div>Architecture</div>
                      <div style={{ textAlign: "right" }}>
                        {resultatClassification.stats.Architecture}
                      </div>

                      <div>Jardins</div>
                      <div style={{ textAlign: "right" }}>
                        {resultatClassification.stats.Jardins}
                      </div>

                      <div>A_verifier_classification</div>
                      <div style={{ textAlign: "right" }}>
                        {
                          resultatClassification.stats
                            .A_verifier_classification
                        }
                      </div>
                    </div>

                    <br />

                    <div>--------------------------------</div>

                    <br />

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 80px",
                        columnGap: "20px",
                      }}
                    >
                      <div>TOTAL</div>
                      <div style={{ textAlign: "right" }}>
                        {resultatClassification.total}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "30px",
        }}
      >
        <div
          style={{
            flex: 1,
            textAlign: "center",
          }}
        >
          <h2>Photo de l'œuvre</h2>

          <input type="file" accept="image/*" onChange={handleOeuvreChange} />

          {oeuvreImageUrl && (
            <>
              <h3 style={{ marginTop: "20px" }}>Œuvre</h3>

              <img
                src={oeuvreImageUrl}
                alt="Œuvre"
                style={{
                  maxWidth: "100%",
                  maxHeight: "600px",
                }}
              />
            </>
          )}
        </div>

        <div
          style={{
            flex: 1,
            minWidth: "420px",
          }}
        >
          {nomPropose && (
            <>
              <h2
                style={{
                  textAlign: "center",
                }}
              >
                Nom proposé
              </h2>

              <div
                style={{
                  marginBottom: "30px",
                  textAlign: "center",
                }}
              >
                <input
                  type="text"
                  value={nomEdite}
                  onChange={(e) => setNomEdite(e.target.value)}
                  style={{
                    width: "90%",
                    padding: "10px",
                    fontSize: "16px",
                  }}
                />
              </div>
            </>
          )}

          {analyseMusee && (
            <div
              style={{
                border: "1px solid #ccc",
                padding: "20px",
                textAlign: "left",
              }}
            >
              <h2>Analyse IA</h2>

              <div
                style={{
                  marginBottom: "15px",
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                {confidence >= 0.8 && (
                  <span style={{ color: "green" }}>
                    🟢 Analyse très fiable
                  </span>
                )}

                {confidence >= 0.5 && confidence < 0.8 && (
                  <span style={{ color: "orange" }}>
                    🟠 Analyse plausible
                  </span>
                )}

                {confidence < 0.5 && (
                  <span style={{ color: "red" }}>
                    🔴 Vérification manuelle recommandée
                  </span>
                )}
              </div>

              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <tbody>
                  {afficherLigne("Titre FR", analyseMusee.title_fr)}
                  {afficherLigne("Titre EN", analyseMusee.title_en)}
                  {afficherLigne("Artiste", analyseMusee.artist)}
                  {afficherLigne("Date", analyseMusee.date)}
                  {afficherLigne("Période", analyseMusee.period)}
                  {afficherLigne("Dynastie", analyseMusee.dynasty)}
                  {afficherLigne("Pays origine", analyseMusee.country_origin)}
                  {afficherLigne("Culture", analyseMusee.culture)}
                  {afficherLigne("Mouvement", analyseMusee.art_movement)}
                  {afficherLigne("Catégorie", analyseMusee.object_category)}
                  {afficherLigne("Type", analyseMusee.object_type)}
                  {afficherLigne("Technique", analyseMusee.medium)}
                  {afficherLigne("Support", analyseMusee.support)}
                  {afficherLigne("Dimensions", analyseMusee.dimensions)}
                  {afficherLigne("Musée", analyseMusee.museum)}
                  {afficherLigne("Ville", analyseMusee.city)}
                  {afficherLigne("Pays musée", analyseMusee.country_museum)}
                  {afficherLigne("Collection", analyseMusee.ownership)}
                  {afficherLigne("Provenance", analyseMusee.provenance)}
                  {afficherLigne("Confiance", analyseMusee.confidence)}
                  {afficherLigne(
                    "Mots-clés",
                    analyseMusee.keywords?.join(", ")
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div
          style={{
            flex: 1,
            textAlign: "center",
          }}
        >
          <h2>Photo du cartel</h2>

          <input type="file" accept="image/*" onChange={handleCartelChange} />

          {cartelImageUrl && (
            <>
              <h3 style={{ marginTop: "20px" }}>Cartel</h3>

              <img
                src={cartelImageUrl}
                alt="Cartel"
                style={{
                  maxWidth: "100%",
                  maxHeight: "400px",
                }}
              />

              <div
                style={{
                  marginTop: "20px",
                }}
              >
                <details>
                  <summary>OCR brut</summary>

                  <textarea rows="10" cols="40" value={cartelText} readOnly />
                </details>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;