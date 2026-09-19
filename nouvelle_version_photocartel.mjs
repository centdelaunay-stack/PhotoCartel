// PhotoCartel — publication d'une nouvelle version.
// Lancé par Nouvelle_version_PhotoCartel.cmd, qui ne fait que l'appeler.
// Toute la logique est ici, pour qu'elle soit testable ailleurs que sur Windows.
//
// Enchaînement : contrôle des numéros de version, npm install si package.json a bougé,
// git add / commit / push. Le message de commit porte la version et l'horodatage.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOSSIER_PROJET = __dirname;

// Affichage volontairement sans couleur ni caractere special : la fenetre de commandes
// de Windows ne les rend pas toujours, et une sortie illisible ne sert a rien.

function afficher(texte = "") {
  console.log(texte);
}

function etape(numero, texte) {
  afficher(`[${numero}] ${texte}`);
}

function succes(texte) {
  afficher(`OK  ${texte}`);
}

function echec(texte) {
  afficher(`ERREUR  ${texte}`);
}

function remarque(texte) {
  afficher(`--  ${texte}`);
}

function executer(commande, arguments_ = []) {
  const resultat = spawnSync(commande, arguments_, {
    cwd: DOSSIER_PROJET,
    encoding: "utf8",
    shell: process.platform === "win32",
  });

  return {
    code: resultat.status === null ? 1 : resultat.status,
    // "sortie" sert a l'affichage, "valeur" a la lecture d'un resultat : melanger
    // stdout et stderr dans une valeur produisait un refspec invalide sur un depot
    // sans aucun commit. Reproduit en recette.
    sortie: `${resultat.stdout || ""}${resultat.stderr || ""}`.trim(),
    valeur: `${resultat.stdout || ""}`.trim(),
    lance: !resultat.error,
    erreur: resultat.error ? resultat.error.message : "",
  };
}

function lireVersion(nomFichier) {
  const chemin = path.join(DOSSIER_PROJET, nomFichier);
  if (!fs.existsSync(chemin)) return { fichier: nomFichier, version: null, present: false };

  const contenu = fs.readFileSync(chemin, "utf8");
  const correspondance = contenu.match(/const\s+VERSION_PHOTOCARTEL\s*=\s*["']([^"']+)["']/);

  return {
    fichier: nomFichier,
    version: correspondance ? correspondance[1] : null,
    present: true,
  };
}

function horodatage() {
  const maintenant = new Date();
  const deuxChiffres = (valeur) => String(valeur).padStart(2, "0");
  return (
    `${maintenant.getFullYear()}-${deuxChiffres(maintenant.getMonth() + 1)}-${deuxChiffres(maintenant.getDate())}` +
    ` ${deuxChiffres(maintenant.getHours())}:${deuxChiffres(maintenant.getMinutes())}`
  );
}

function dependancesAReinstaller() {
  const cheminPackage = path.join(DOSSIER_PROJET, "package.json");
  const cheminModules = path.join(DOSSIER_PROJET, "node_modules");

  if (!fs.existsSync(cheminPackage)) return { necessaire: false, raison: "aucun package.json" };
  if (!fs.existsSync(cheminModules)) return { necessaire: true, raison: "node_modules absent" };

  const dateModules = fs.statSync(cheminModules).mtimeMs;
  const datePackage = fs.statSync(cheminPackage).mtimeMs;

  if (datePackage > dateModules) {
    return { necessaire: true, raison: "package.json plus récent que node_modules" };
  }

  return { necessaire: false, raison: "dépendances à jour" };
}

function suiviDistantPresent() {
  return executer("git", ["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}"]).code === 0;
}

function commitsEnAttenteDePush() {
  if (!suiviDistantPresent()) {
    const commits = executer("git", ["rev-list", "--count", "HEAD"]);
    return Number(commits.valeur) || 0;
  }
  const commits = executer("git", ["rev-list", "--count", "@{u}..HEAD"]);
  return Number(commits.valeur) || 0;
}

function terminer(code) {
  afficher();
  if (code === 0) succes("Terminé.");
  else echec("Arrêté. Rien n'a été poussé.");
  process.exit(code);
}

// --- 1. Numéros de version ---------------------------------------------------

afficher();
afficher("PhotoCartel — publication d'une nouvelle version");
afficher(DOSSIER_PROJET);
afficher();

etape(1, "Numéros de version");

const versionServeur = lireVersion("server.js");
const versionApp = lireVersion("src/App.jsx");

for (const lecture of [versionServeur, versionApp]) {
  if (!lecture.present) {
    echec(`${lecture.fichier} introuvable dans ce dossier.`);
    terminer(1);
  }
  if (!lecture.version) {
    echec(`Aucun VERSION_PHOTOCARTEL trouvé dans ${lecture.fichier}.`);
    terminer(1);
  }
}

afficher(`  server.js  : ${versionServeur.version}`);
afficher(`  App.jsx    : ${versionApp.version}`);

if (versionServeur.version !== versionApp.version) {
  echec("Les deux fichiers ne portent pas la même version : publication refusée.");
  terminer(1);
}

const version = versionServeur.version;
succes(`  Version ${version}`);

// --- 2. Dépôt git ------------------------------------------------------------

afficher();
etape(2, "Dépôt git");

const depot = executer("git", ["rev-parse", "--is-inside-work-tree"]);
if (!depot.lance) {
  echec(`git est introuvable : ${depot.erreur}`);
  terminer(1);
}
if (depot.code !== 0) {
  echec("Ce dossier n'est pas un dépôt git.");
  afficher(depot.sortie);
  terminer(1);
}

const lectureBranche = executer("git", ["branch", "--show-current"]);
const branche = lectureBranche.valeur || executer("git", ["rev-parse", "--abbrev-ref", "HEAD"]).valeur;
if (!branche || branche === "HEAD") {
  echec("Impossible de déterminer la branche courante.");
  afficher(lectureBranche.sortie);
  terminer(1);
}
afficher(`  Branche : ${branche}`);

// --- 3. Dépendances ----------------------------------------------------------

afficher();
etape(3, "Dépendances");

const dependances = dependancesAReinstaller();
if (dependances.necessaire) {
  afficher(`  ${dependances.raison} — npm install en cours, cela peut prendre une minute.`);
  const installation = executer("npm", ["install", "--no-audit", "--no-fund"]);
  if (installation.code !== 0) {
    echec("npm install a échoué :");
    afficher(installation.sortie);
    terminer(1);
  }
  succes("  Dépendances installées.");
} else {
  afficher(`  ${dependances.raison}, rien à installer.`);
}

// --- 4. Modifications --------------------------------------------------------

afficher();
etape(4, "Modifications");

const ajout = executer("git", ["add", "-A"]);
if (ajout.code !== 0) {
  echec("git add a échoué :");
  afficher(ajout.sortie);
  terminer(1);
}

const indexees = executer("git", ["diff", "--cached", "--name-only"]);
const fichiers = indexees.valeur.split("\n").map((ligne) => ligne.trim()).filter(Boolean);

// Rien a commiter ne veut pas dire rien a pousser : un push precedent a pu echouer
// et laisser un commit local en attente. Reproduit en recette.
let commitANePasRefaire = false;

if (fichiers.length === 0) {
  const enAttente = commitsEnAttenteDePush();
  if (enAttente === 0) {
    remarque("  Aucune modification à publier. Rien n'a été commité ni poussé.");
    terminer(0);
  }
  remarque(`  Aucune nouvelle modification, mais ${enAttente} commit(s) en attente de push.`);
  commitANePasRefaire = true;
}

if (!commitANePasRefaire) {
  for (const fichier of fichiers) afficher(`  ${fichier}`);
  afficher(`  ${fichiers.length} fichier(s)`);

  if (fichiers.some((fichier) => fichier.startsWith("node_modules/"))) {
    remarque("  node_modules est sur le point d'être publié : ton .gitignore ne le couvre pas.");
  }
}

// --- 5. Commit ---------------------------------------------------------------

afficher();
etape(5, "Commit");

if (commitANePasRefaire) {
  afficher("  Rien à commiter, on passe au push.");
} else {
  const message = `${version} — ${horodatage()}`;
  const commit = executer("git", ["commit", "-m", message]);
  if (commit.code !== 0) {
    echec("git commit a échoué :");
    afficher(commit.sortie);
    terminer(1);
  }
  succes(`  ${message}`);
}

// --- 6. Push -----------------------------------------------------------------

afficher();
etape(6, "Push");

// Sans branche distante associee, git push seul echoue : on la pose au premier passage.
const push = suiviDistantPresent()
  ? executer("git", ["push"])
  : executer("git", ["push", "-u", "origin", branche]);
if (push.code !== 0) {
  echec("git push a échoué :");
  afficher(push.sortie);
  remarque("  Le commit est fait en local : relance ce script quand la connexion est revenue.");
  terminer(1);
}

succes("  Poussé sur GitHub. Render déploie automatiquement.");
terminer(0);
