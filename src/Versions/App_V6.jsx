import { useState } from "react";
import Tesseract from "tesseract.js";

function App() {
  const [oeuvreFileName, setOeuvreFileName] = useState("");
  const [oeuvreImageUrl, setOeuvreImageUrl] = useState("");

  const [cartelImageUrl, setCartelImageUrl] = useState("");
  const [cartelText, setCartelText] = useState("");

  const [analyseMusee, setAnalyseMusee] = useState(null);

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

  const timestamp = oeuvreFileName
    ? oeuvreFileName.replace(/\.[^/.]+$/, "")
    : "";

  const nomPropose = (() => {
    if (!oeuvreFileName) return "";

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
        PhotoCartel v6
      </h1>

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

                  <tr>
                    <td><strong>Période</strong></td>
                    <td>{analyseMusee.period}</td>
                  </tr>

                  <tr>
                    <td><strong>Dynastie</strong></td>
                    <td>{analyseMusee.dynasty}</td>
                  </tr>

                  <tr>
                    <td><strong>Pays origine</strong></td>
                    <td>{analyseMusee.country_origin}</td>
                  </tr>

                  <tr>
                    <td><strong>Culture</strong></td>
                    <td>{analyseMusee.culture}</td>
                  </tr>

                  <tr>
                    <td><strong>Mouvement</strong></td>
                    <td>{analyseMusee.art_movement}</td>
                  </tr>

                  <tr>
                    <td><strong>Catégorie</strong></td>
                    <td>{analyseMusee.object_category}</td>
                  </tr>

                  <tr>
                    <td><strong>Type</strong></td>
                    <td>{analyseMusee.object_type}</td>
                  </tr>

                  <tr>
                    <td><strong>Technique</strong></td>
                    <td>{analyseMusee.medium}</td>
                  </tr>

                  <tr>
                    <td><strong>Support</strong></td>
                    <td>{analyseMusee.support}</td>
                  </tr>

                  <tr>
                    <td><strong>Dimensions</strong></td>
                    <td>{analyseMusee.dimensions}</td>
                  </tr>

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

                  <tr>
                    <td><strong>Collection</strong></td>
                    <td>{analyseMusee.ownership}</td>
                  </tr>

                  <tr>
                    <td><strong>Provenance</strong></td>
                    <td>{analyseMusee.provenance}</td>
                  </tr>

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