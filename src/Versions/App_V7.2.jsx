import { useState } from "react";
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

const nomCartel =
  nomFinal.length > 4
    ? nomFinal.replace(".jpg", "_CARTEL.jpg")
    : "";

const [voyage, setVoyage] = useState("Corée du Sud, mai 2026");
const [villeVisite, setVilleVisite] = useState("Séoul");
const [lieuVisite, setLieuVisite] = useState("Musée National de Corée");
const [dossierRacine, setDossierRacine] = useState("D:\\Voyages");

const cheminCible =
  voyage && villeVisite && lieuVisite
    ? `${dossierRacine}\\${voyage}\\${villeVisite}\\${lieuVisite}`
    : "";

    function genererNomPropose(analyse, timestamp) {
  if (!analyse) return "";

  const artiste =
  analyse.artist?.trim() || "artiste inconnu";

const titre =
  analyse.title_fr?.trim() ||
  analyse.title_en?.trim() ||
  "titre inconnu";

  const date =
    analyse.date?.trim();

  let nom =
    `${timestamp}, ${artiste}, '${titre}'`;

  if (date) {
    nom += `, ${date}`;
  }

  nom += ".jpg";

nom = nom
  .replace(/[<>:"/\\|?*]/g, "")
  .replace(/\s+/g, " ")
  .trim();
  
  return nom;
}

const creerDossier = async () => {
  try {
    const response = await fetch(
      "http://localhost:3001/creer-dossier",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chemin: cheminCible
        })
      }
    );

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
        cv.GaussianBlur(
          gray,
          blurred,
          new cv.Size(5, 5),
          0
        );

        const edges = new cv.Mat();
        cv.Canny(
          blurred,
          edges,
          50,
          150
        );

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

        for (
          let i = 0;
          i < contours.size();
          i++
        ) {
        const contour = contours.get(i);

const rect =
  cv.boundingRect(contour);

console.log(
  "RECT",
  i,
  rect.x,
  rect.y,
  rect.width,
  rect.height
);

const surface =
  rect.width * rect.height;

          const surface =
            rect.width * rect.height;
if (
  surface > meilleureSurface
) {
  meilleureSurface = surface;
  meilleurRect = rect;

  console.log(
    "MEILLEUR RECTANGLE",
    rect.x,
    rect.y,
    rect.width,
    rect.height
  );
}
        }

        if (!meilleurRect) {
          resolve(imageSrc);
          return;
        }

        const recadreCanvas =
          document.createElement("canvas");

        recadreCanvas.width =
          meilleurRect.width;

        recadreCanvas.height =
          meilleurRect.height;

        const recadreCtx =
          recadreCanvas.getContext("2d");

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

        const imageRecadree =
          recadreCanvas.toDataURL(
            "image/jpeg"
          );

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
ctx.drawImage(
  img,
  0,
  0,
  canvas.width,
  canvas.height
);

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

  const imageRecadree =
  await detecterEtRecadrerCartel(
    imageDataOriginal
  );

console.log("ETAPE 2");

setCartelRecadreUrl(imageRecadree);

const imageDataAmelioree =
  await ameliorerImage(imageRecadree);

console.log("ETAPE 3");

setCartelImageUrl(imageDataAmelioree);

setCartelText("OCR en cours...");
setAnalyseMusee(null);

// OCR original

console.log("ETAPE 4");

const resultatOriginal =
  await Tesseract.recognize(
  imageDataOriginal,
  "eng+kor"
);

console.log("ETAPE 5");

const scoreOriginal =
  resultatOriginal.data.confidence;

// OCR amélioré
const resultAmeliore = await Tesseract.recognize(
  imageDataAmelioree,
  "eng+kor"

);

const scoreAmeliore =
  resultAmeliore.data.confidence;

console.log("OCR ORIGINAL COMPLET");
console.log(resultatOriginal.data.text);

console.log("OCR AMELIORE COMPLET");
console.log(resultAmeliore.data.text);
console.log(
  "Score original :",
  scoreOriginal
);

console.log(
  "Score amélioré :",
  scoreAmeliore
);

let texte;

if (scoreAmeliore > scoreOriginal) {
  console.log("OCR amélioré retenu");
  texte = resultAmeliore.data.text;
} else {
  console.log("OCR original retenu");
  texte = resultatOriginal.data.text;
}

setCartelText(texte);

        const response = await fetch(
          "http://localhost:3001/analyse-cartel",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              texte,
            }),
          }
        );

const data = await response.json();

if (data.success) {
  setAnalyseMusee(data.result);

  console.log("RESULTAT IA =", data.result);

const nomGenere = genererNomPropose(
  data.result,
  timestamp
);

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
  ? oeuvreFileName
      .replace(/\.[^.]+$/, "")
      .replace(/^IMG/i, "")
  : "";



const timestamp = (() => {
  // Cas déjà normalisé : 20260505_133003
  if (/^\d{8}_\d{6}$/.test(timestampBrut)) {
    return timestampBrut;
  }

  // Cas ancien Samsung : 20220530143256
  const match = timestampBrut.match(
    /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/
  );

  if (match) {
    return `${match[1]}${match[2]}${match[3]}_${match[4]}${match[5]}${match[6]}`;
  }

  // Cas futur : on laisse tel quel
  return timestampBrut;
})();
const confidence = analyseMusee?.confidence || 0;

const niveauConfiance =
  confidence >= 0.8
    ? "high"
    : confidence >= 0.5
    ? "medium"
    : "low";

const afficherLigne = (label, valeur) => {
  if (!valeur) return null;

  return (
    <tr>
      <td><strong>{label}</strong></td>
      <td>{valeur}</td>
    </tr>
  );
};

  const nomPropose = (() => {
  if (!oeuvreFileName) return "";

  const confidence =
    analyseMusee?.confidence ?? 0;

  if (confidence < 0.5) {
    return `${timestamp}, A_VERIFIER.jpg`;
  }

  if (
  analyseMusee &&
  analyseMusee.confidence < 0.5
) {
  return `${timestamp}, A_VERIFIER.jpg`;
}

const artiste = analyseMusee?.artist || "";

  const titre =
    analyseMusee?.title_fr ||
    analyseMusee?.title_en ||
    "A_VERIFIER";

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
      <h1
        style={{
          textAlign: "center",
          marginBottom: "40px",
        }}
      >
        PhotoCartel v7.2
      </h1>

<div>
  
<h3>Paramètres de stockage</h3>

<div style={{ marginBottom: "10px" }}>
  <strong>Dossier racine :</strong>
  <input
    value={dossierRacine}
    onChange={(e) => setDossierRacine(e.target.value)}
    style={{
      marginLeft: "10px",
      width: "400px"
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
      width: "300px"
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
      width: "300px"
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
      width: "300px"
    }}
  />
</div>

<div>
  <strong>Organisation du voyage :</strong>

<div style={{
  textAlign: "left",
  display: "inline-block",
  fontFamily: "monospace",
  marginTop: "10px"
}}>
  <div>📁 Voyages</div>
  <div style={{ marginLeft: "30px" }}>
    📁 {voyage}
  </div>
  <div style={{ marginLeft: "60px" }}>
    📁 {villeVisite}
  </div>
  <div style={{ marginLeft: "90px" }}>
    📍 {lieuVisite}
  </div>
</div>
</div>

<button
  onClick={creerDossier}
  style={{
    marginTop: "10px",
    marginBottom: "20px"
  }}
>
  Créer le dossier
</button>

<button
  onClick={async () => {
   if (!oeuvreFile) {
  alert("Aucune photo chargée");
  return;
}

const formData = new FormData();

formData.append(
  "photo",
  oeuvreFile
);

formData.append(
  "cartel",
  cartelFile
);

formData.append(
  "chemin",
  cheminCible
);

formData.append(
  "nomFichier",
  nomEdite
);

const response = await fetch(
  "http://localhost:3001/sauvegarder-photo",
  {
    method: "POST",
    body: formData
  }
);

const data = await response.json();

if (data.success) {

  alert(
    "Photo sauvegardée :\n" +
    data.chemin
  );

} else {

  alert(data.error);

}}}
  style={{
    marginLeft: "10px",
    marginTop: "10px",
    marginBottom: "20px"
  }}
>
  Sauvegarder photo
</button>



</div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "30px",
        }}
      >
        {/* COLONNE OEUVRE */}

        <div
          style={{
            flex: 1,
            textAlign: "center",
          }}
        >
          <h2>Photo de l'œuvre</h2>

          <input
            type="file"
            accept="image/*"
            onChange={handleOeuvreChange}
          />

          {oeuvreImageUrl && (
            <>
              <h3 style={{ marginTop: "20px" }}>
                Œuvre
              </h3>

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

        {/* COLONNE CENTRALE */}

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

  {confidence >= 0.5 &&
    confidence < 0.8 && (
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
                  <tr>
                    <td><strong>Titre FR</strong></td>
                    <td>{analyseMusee.title_fr}</td>
                  </tr>

                  <tr>
                    <td><strong>Titre EN</strong></td>
                    <td>{analyseMusee.title_en}</td>
                  </tr>

                  <tr>
                    <td><strong>Artiste</strong></td>
                    <td>{analyseMusee.artist}</td>
                  </tr>

                  <tr>
                    <td><strong>Date</strong></td>
                    <td>{analyseMusee.date}</td>
                  </tr>

                  
  {afficherLigne("Période", analyseMusee.period)}

                  
  
                   {afficherLigne("Dynastie", analyseMusee.dynasty)}


                  <tr>
                    <td><strong>Pays origine</strong></td>
                    <td>{analyseMusee.country_origin}</td>
                  </tr>

                  {analyseMusee.culture && (
  <tr>
    <td><strong>Culture</strong></td>
    <td>{analyseMusee.culture}</td>
  </tr>
)}

                  {analyseMusee.art_movement && (
  <tr>
    <td><strong>Mouvement</strong></td>
    <td>{analyseMusee.art_movement}</td>
  </tr>
)}

                  <tr>
                    <td><strong>Catégorie</strong></td>
                    <td>{analyseMusee.object_category}</td>
                  </tr>

                  {afficherLigne("Type", analyseMusee.object_type)}

{afficherLigne("Technique", analyseMusee.medium)}

{afficherLigne("Support", analyseMusee.support)}
                  {analyseMusee.dimensions && (
  <tr>
    <td><strong>Dimensions</strong></td>
    <td>{analyseMusee.dimensions}</td>
  </tr>
)}

                  <tr>
                    <td><strong>Musée</strong></td>
                    <td>{analyseMusee.museum}</td>
                  </tr>

                  <tr>
                    <td><strong>Ville</strong></td>
                    <td>{analyseMusee.city}</td>
                  </tr>

                  <tr>
                    <td><strong>Pays musée</strong></td>
                    <td>{analyseMusee.country_museum}</td>
                  </tr>

                 {analyseMusee.ownership && (
  <tr>
    <td><strong>Collection</strong></td>
    <td>{analyseMusee.ownership}</td>
  </tr>
)}

                  {analyseMusee.provenance && (
  <tr>
    <td><strong>Provenance</strong></td>
    <td>{analyseMusee.provenance}</td>
  </tr>
)}

                  <tr>
                    <td><strong>Confiance</strong></td>
                    <td>{analyseMusee.confidence}</td>
                  </tr>

                  <tr>
                    <td><strong>Mots-clés</strong></td>
                    <td>
                      {analyseMusee.keywords?.join(", ")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* COLONNE CARTEL */}

        <div
          style={{
            flex: 1,
            textAlign: "center",
          }}
        >
          <h2>Photo du cartel</h2>

          <input
            type="file"
            accept="image/*"
            onChange={handleCartelChange}
          />

          {cartelImageUrl && (
            <>
              <h3 style={{ marginTop: "20px" }}>
                Cartel
              </h3>

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

                  <textarea
                    rows="10"
                    cols="40"
                    value={cartelText}
                    readOnly
                  />
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