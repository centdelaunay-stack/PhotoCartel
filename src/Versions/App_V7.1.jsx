import { useState } from "react";
import Tesseract from "tesseract.js";

function App() {
  const [oeuvreFileName, setOeuvreFileName] = useState("");
  const [oeuvreImageUrl, setOeuvreImageUrl] = useState("");

  const [cartelImageUrl, setCartelImageUrl] = useState("");
  const [cartelText, setCartelText] = useState("");

  const [analyseMusee, setAnalyseMusee] = useState(null);

const [voyage, setVoyage] = useState("Corée du Sud, mai 2026");
const [villeVisite, setVilleVisite] = useState("Séoul");
const [lieuVisite, setLieuVisite] = useState("Musée National de Corée");
const [dossierRacine, setDossierRacine] = useState("D:\\Voyages");

const cheminCible =
  voyage && villeVisite && lieuVisite
    ? `${dossierRacine}\\${voyage}\\${villeVisite}\\${lieuVisite}`
    : "";

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

    setOeuvreFileName(file.name);

    const reader = new FileReader();

    reader.onload = () => {
      setOeuvreImageUrl(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleCartelChange = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const imageData = reader.result;

        setCartelImageUrl(imageData);

        setCartelText("OCR en cours...");
        setAnalyseMusee(null);

        const result = await Tesseract.recognize(
          imageData,
          "eng+kor"
        );

        const texte = result.data.text;

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
  ? oeuvreFileName.replace(/\.[^/.]+$/, "")
  : "";



const timestamp = (() => {
  const match = timestampBrut.match(
    /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/
  );

  if (!match) return timestampBrut;

  return `${match[1]}${match[2]}${match[3]}_${match[4]}${match[5]}${match[6]}`;
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
        PhotoCartel v7.1
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
                  color: "green",
                  fontWeight: "bold",
                  marginBottom: "30px",
                  textAlign: "center",
                  wordBreak: "break-word",
                }}
              >
                {nomPropose}
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