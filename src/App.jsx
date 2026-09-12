// PhotoCartel v80 — LES RÉSULTATS DE RECHERCHE PRENNENT LA FORME D'UNE VISITE OUVERTE.
// Base : v79. La v78 avait construit un deuxième mécanisme d'affichage d'images, propre
// à la recherche : un décodage par photo, tous lancés en même temps, et un échec
// mémorisé pour toute la session. Sur une grille de 237 photos, cela donnait des
// pastilles grises définitives, et le plein écran tombait sur le même chemin.
// La v80 supprime ce mécanisme. Les résultats réutilisent celui de la galerie d'une
// visite (file d'attente bornée, cache, préchargement, plein écran avec balayage).
// L'écran suit la forme d'EuroCartel : bandeau de rappel des critères, puis Tableau
// ou Grille au choix, puis plein écran.
//
// PhotoCartel v79 — GALERIE DES PHOTOS ANALYSÉES : « Rechercher » ouvre l'écran de
// recherche ; « Exporter la galerie », non relié, est affiché indisponible avec la
// mention « (non connecté) ».
// Contenu identique à la v22, seul le numéro change : la v22 portait un numéro
// inférieur à la v78 déployée, ce qui cassait l'ordre des versions.
//
// PhotoCartel v78 — MOTEUR DE RECHERCHE : TOUTES LES PHOTOS, UN SEUL CHAMP, SANS ATTENTE.
// Base : v77. La recherche couvre tout DCIM/PhotoCartel à toutes les profondeurs,
// photos analysées ou non ; elle lit tes noms (sujet, rang, cadrage, année collée,
// marqueurs de travail), la fiche complète, un lexique d'équivalences (place/plaza…)
// et tolère une lettre. Héritages A (même sujet), B (artiste trouvé dans le dossier)
// et C (mots ajoutés à la main), avec l'origine affichée. Résultats par photo, par
// sujet ou par dossier, ordonnés. Un seul champ, des pastilles pays/ville/année,
// accès direct depuis l'accueil. La recherche interroge un moteur en mémoire : elle
// ne touche jamais le disque ; l'index se met à jour en arrière-plan.
//
// PhotoCartel v77 — RÉPARATION : LE RENOMMAGE NE PEUT PLUS RESTER BLOQUÉ, L'ACCUEIL NE GÈLE PLUS
// CE QU'IL DOIT MONTRER.
// Base : v75 (version en production). Défauts reproduits sur la v75 avant correction.
// 1. Une attente sans fin. La modale « Renommage en cours » ne se fermait qu'à l'arrivée de
//    la réponse du serveur ; aucune durée maximale, ni ici ni côté serveur. Désormais, toute
//    attente du tri, de l'analyse et de la classification est bornée (executerRequeteBornee :
//    30 s + 90 s par photo). À échéance, la modale se ferme sur un message clair.
// 2. Des modales sans sortie. Les modales « Renommage en cours » et « Classification en
//    cours » ont un bouton « Interrompre ». « Accueil » éteint toutes les modales en cours.
//    Un résultat qui arrive après une interruption est ignoré (un jeton par opération).
//    Rangement : « Accueil » ferme sa modale ; les photos en cours de déplacement vont au bout,
//    le bilan disque est enregistré sans être affiché, « Ranger les photos » reste indisponible
//    jusqu'à la fin. Pas de bouton « Interrompre » : les deux moteurs de rangement ne savent pas
//    s'arrêter entre deux photos, et ils ne sont pas modifiés.
// 3. L'accueil figé. Le gel et « Accueil » lisent désormais une seule et même liste
//    (listerEtatsHorsAccueil) : l'accueil n'est figé que si aucun écran, aucune étape et aucune
//    modale n'est actif. L'étape « Tri terminé / Lancer l'analyse IA » est amenée à l'écran.
//
// PhotoCartel v74 — UNE PHOTO ABSENTE EST DITE, PAS AFFICHÉE CASSÉE.
// PhotoCartel v74 — UNE PHOTO ABSENTE EST DITE, PAS AFFICHÉE CASSÉE.
// Certaines fiches ont un JSON sans le JPEG correspondant. L'application affichait
// alors une balise image vers un fichier inexistant : icône cassée sur PC, rien du
// tout sur téléphone — deux comportements différents pour la même situation.
// Le code savait pourtant que la photo était absente : imageExiste est calculé des
// deux côtés à partir du même listing de noms, il n'était simplement jamais utilisé
// à l'affichage. Défaut antérieur à ce chantier, vérifié par comparaison avec la v68.
// Désormais, des deux côtés à l'identique : pas de balise image, et un libellé
// « Photo absente du dossier » suivi du nom du fichier manquant.
//
// PhotoCartel v73 — CORRECTIF DE LA v72 : les photos réapparaissent.
// La v72 ouvrait la galerie sans toucher au dossier — et supprimait du même coup
// le seul endroit qui demandait la permission Android sur DCIM/PhotoCartel, laquelle
// repasse à « prompt » à chaque nouvelle session de Chrome. Les métadonnées venant
// du cache s'affichaient, mais toute lecture de photo était refusée : aucune image
// sur aucune fiche. Rien n'était perdu, l'application n'avait plus le droit de lire.
// La permission est désormais demandée au premier accès réel au dossier, dans le
// chargement d'une image et dans la resynchronisation. Les deux sont déclenchés par
// un geste — ouverture de la galerie ou balayage —, ce qu'exige Chrome.
//
// // PhotoCartel v72 — OUVERTURE IMMÉDIATE DE LA GALERIE.
// Après la v71, l'ouverture prenait encore une dizaine de secondes lors de la
// première ouverture suivant un redémarrage de l'application. Ce temps était
// entièrement passé AVANT le premier affichage, dans des accès au système de
// fichiers Android, lents au premier accès d'une session. Deux points traités :
//   1. la vérification-création des onze dossiers d'infrastructure de PhotoCartel
//      ne s'exécute plus sur le chemin de LECTURE de la galerie. Elle a sa place
//      quand on écrit (analyse d'une photo), pas quand on lit ;
//   2. une copie des fiches est conservée dans le navigateur (IndexedDB,
//      base PhotoCartelGalerie). La galerie se peint à partir de cette copie,
//      sans aucun accès au dossier, puis la resynchronisation habituelle vérifie
//      le dossier en arrière-plan et corrige sans bloquer l'écran.
// Ce cache navigateur n'est JAMAIS la vérité : le dossier reste l'unique source,
// et toute divergence est réglée en sa faveur. Le fichier d'index posé dans
// « Photos analysées » continue de voyager avec le dossier entre le téléphone et C:.
//
// // PhotoCartel v71 — CORRECTIF DE LA v69 : l'image affichée suit la fiche affichée.
// Défaut constaté en recette sur la v69 : les métadonnées étaient justes sur chaque
// fiche, mais la photo affichée était celle d'une autre fiche — une image se
// chargeait puis restait collée aux suivantes — et la première fiche restait sans
// photo jusqu'au premier balayage. Deux causes, toutes deux traitées :
//   1. l'état ne retenait que l'URL de l'image, sans la fiche à laquelle elle
//      appartenait ; il porte désormais le nom de la photo, et l'affichage
//      n'utilise l'URL que si les deux correspondent ;
//   2. le chargement reposait sur un effet React censé se réveiller au changement
//      de fiche, et ce réveil ne se produisait pas à l'ouverture de la galerie.
//      chargerImageGalerieAndroid() est maintenant appelée explicitement aux six
//      endroits où la fiche affichée change : ouverture depuis le cache de session,
//      ouverture depuis l'index, lecture complète, balayage avant, balayage arrière,
//      modification, suppression, et repositionnement par la resynchronisation.
//      L'effet subsiste en simple filet de sécurité, jamais comme mécanisme principal.
// S'y ajoute le coût : la vérification-création des onze dossiers d'infrastructure
// de PhotoCartel n'est plus exécutée sur le chemin d'affichage d'une image, et le
// dossier « Photos analysées » est mémorisé pour la session.
//
// PhotoCartel v69 — GALERIE DES PHOTOS ANALYSÉES : index durable et affichage immédiat.
// La galerie mettait environ deux minutes à s'ouvrir sur téléphone (80 fiches) et
// recommençait à chaque changement d'écran. Trois causes, toutes traitées :
//   1. l'ouverture créait une URL objet pour les 80 photos alors qu'une seule est
//      affichée — désormais l'image de la fiche affichée est ouverte à la demande
//      et libérée quand on quitte la fiche ;
//   2. rien ne survivait à la fermeture de l'app — un fichier d'index unique
//      (_PhotoCartel_index_galerie.json) est désormais posé DANS le dossier
//      « Photos analysées », donc il suit le dossier copié entre C: et DCIM ;
//   3. le cache de session était vidé à chaque enregistrement — la fiche écrite
//      est maintenant insérée, ce qui supprime le rechargement complet quand le
//      compteur passe de 60 à 61.
// Resynchronisation : lister les NOMS du dossier coûte infiniment moins cher que
// d'ouvrir chaque fiche. La galerie affiche l'index tout de suite, puis compare
// sans bloquer l'écran et ne lit réellement que les fiches absentes de l'index.
// La fiche affichée ne bouge jamais du fait de cette resynchronisation.
// LIMITE ASSUMÉE : la comparaison porte sur les noms — une fiche remplacée sur
// place, même nom et contenu différent, n'est pas détectée.
// ALIGNEMENT PC/PWA : le tri de la galerie était différent des deux côtés (nom de
// fichier sur PC, date d'analyse sur Android). Les deux appliquent désormais la
// règle Android. L'ordre change sur PC pour les fiches modifiées.
// PhotoCartel v62 — "Œuvres détectées" -> "Photos sélectionnées" (comptait tous les fichiers,
// pas que les œuvres, avant tout tri). Nom proposé : input -> textarea, texte complet visible,
// plus de troncature. 299/299 assertions, 0 régression.
// PhotoCartel v61 — CORRECTIF DEMANDÉ PAR VINCENT (spec v6) : l'écran "Propositions de renommage"
// n'affichait ni vignette de la photo, ni vignette du cartel, et le nom proposé était noyé dans
// une simple ligne de texte. Ajout de vraies vignettes (générées côté client via
// URL.createObjectURL sur les fichiers déjà sélectionnés, sans aller-retour serveur), et le champ
// "Nom proposé" est maintenant clairement étiqueté et mis en valeur. "Taux de réussite" (jugé
// trompeur sur petit échantillon, ex. 100% sur 1 photo) complété par la fraction (X/Y) à côté du
// pourcentage. Vérifié par exécution réelle dans un vrai navigateur : dimensions naturelles des
// images inspectées dans le DOM (300x300, 300x200 — vraies images décodées, pas des icônes
// cassées), valeur exacte du champ nom proposé lue directement dans le DOM.
// PhotoCartel v60 — CORRECTIF CRITIQUE : le bouton "Renommer un dossier" avait été silencieusement
// débranché (revenu au placeholder "Fonctionnalité bientôt disponible"), très probablement lors
// d'une réécriture antérieure du fichier de travail. Tout le flux construit et testé côté serveur
// (278 assertions) était donc INACCESSIBLE depuis l'interface. Trouvé et corrigé en construisant
// un vrai test navigateur (Playwright + Chromium, vrai bundle React, vrais clics, vraie sélection
// de fichiers). Reconnecté au clic sur l'input caché. Vérifié bout en bout avec de vrais clics :
// tri -> pause manuelle -> analyse -> proposition -> validation -> écran final. 9 assertions
// dédiées, 290 assertions au total (278 serveur + 12 navigateur réel).
// PhotoCartel v59 — AUCUN changement de code applicatif depuis v58 (revérifié, 0 bug trouvé dans
// Server.js/App.jsx sur ce tour). Ce qui a changé : l'intégrité de mes propres outils de test.
// Modules de test régénérés et revérifiés automatiquement contre le fichier actuel. Détails
// complets dans le rapport de test joint.
// PhotoCartel v58 — correctif critique : les 3 fonctions envoyant une image à OpenAI etiquetaient tout "image/jpeg" sans verifier le format reel, ce qui devenait dangereux depuis l'elargissement EXTENSIONS_IMAGE en v57 (un .heic aurait ete envoye mal etiquete). Normalisation reelle via sharp avant tout envoi, ECHEC EXPLICITE si la conversion echoue (jamais un envoi silencieux mal etiquete). LIMITE VERIFIEE : sharp ici ne decode pas le HEVC (vrai codec des .heic de telephone), seul AVIF fonctionne - confirme avec un vrai flux HEVC genere par ffmpeg. Etat inconnu sur l'environnement de Vincent. PhotoCartel v57 — correctif demandé par Vincent : EXTENSIONS_IMAGE (flux de renommage) unifiée sur EXTENSIONS_IMAGE_PHOTOCARTEL. Le renommage ignorait silencieusement les formats .heic/.heif/.gif/.bmp/.tif/.tiff. Vérifié par exécution réelle (10 assertions dédiées, dont un dossier de test avec photo .heic effectivement listée). PhotoCartel v56 — correctif : 4 versions codées en dur (v32.3 DEV, v38.12, v35.3, v37) dans les métadonnées de photos analysées, remplacées par VERSION_PHOTOCARTEL dynamique. Le schéma v18.5.3 de la fiche patrimoniale n'est PAS touché (numéro de schéma, pas de version appli). Correctif vérifié par exécution réelle : le JSON écrit contient désormais la vraie version. :
// FAIT PAR CLAUDE : compilation JSX réelle (esbuild) sans erreur de syntaxe introduite par ce
// changement. La logique correspondante côté serveur (mêmes noms de champs échangés avec ce
// fichier : oeuvre, cartel, nomFinal, aVerifier) a été testée unitairement en conditions réelles
// (voir Server.js) et toutes les assertions passent.
// PAS FAIT, reste à faire par Vincent : aucun rendu React réel, aucun clic simulé, aucun test
// dans un vrai navigateur — le seul moyen de savoir si l'écran s'affiche et réagit comme prévu.
// Flux "Renommer un dossier" : ajout de deux pauses manuelles absentes jusqu'ici, conformément
// à la spec du 07/08 (étapes 3 et 6) : après le tri œuvre/cartel, l'analyse IA ne se lance plus
// automatiquement — bouton "Lancer l'analyse IA" ajouté. Après analyse, une liste de propositions
// de nom (éditables) est affichée ; le renommage effectif sur disque n'a lieu qu'après clic sur
// "Valider et renommer". Nouvelles routes serveur : /renommer-oeuvres/analyser (propose sans
// renommer) et /renommer-oeuvres/confirmer (renomme seulement ce qui est validé). Correction
// annexe : VERSION_PHOTOCARTEL était désynchronisée entre App.jsx (v50.4) et Server.js (v47.5) ;
// resynchronisées sur v50.5 dans les deux fichiers.
// PhotoCartel v50.4 — correctif bug bloquant du 3 août (recette v50.3) : le bouton
// « Continuer quand même » (création d'un dossier tampon de collecte libre depuis la modale
// « Aucune visite en cours ») oubliait d'initialiser villeVisite. Résultat : cheminCollecteActif
// restait vide alors que la visite tampon était bien active (lieuVisite et cheminTamponActif
// corrects), ce qui redéclenchait à tort la modale « Aucune visite en cours » au clic suivant
// sur « Prendre des photos ». Corrigé en alignant creerTamponCollecteLibreEtOuvrirCamera sur
// creerVisiteRapide : villeVisite est désormais mis à "Ville non renseignée" (état + localStorage)
// dès la création du tampon.
// PhotoCartel v50.3 — correctifs suite à la recette du 30 juillet (v50.2).
// Revirement important, à la demande explicite de l'utilisateur : relancer « Analyser une photo »
// (ou l'analyse depuis la galerie d'une visite) alors qu'un résultat est terminé mais pas encore
// enregistré N'EST PLUS bloqué — c'est un comportement voulu (l'utilisateur a changé d'avis, le
// résultat non enregistré est abandonné immédiatement). Seule une analyse réellement EN COURS
// (appel IA actif) reste bloquante, conformément à la règle « une seule analyse à la fois ».
// Bandeau global désormais visible aussi sur l'écran d'analyse lui-même (dès le clic sur
// « Lancer l'analyse IA »), plus seulement une fois l'écran quitté ; conteneurs racines ajustés
// pour réserver sa hauteur et ne plus recouvrir le contenu (bug visuel sur l'accueil corrigé).
// Nouveau bouton « Revenir à la galerie de la visite » dans la barre d'actions de la fiche
// résultat, visible uniquement quand l'analyse provient de la galerie d'une visite : permet d'y
// retourner sans enregistrer ni abandonner le résultat en cours de révision.
// PhotoCartel v50.2 — correctifs suite à la recette du scénario 1 de la v50.1.
// Garde renforcée : impossible de perdre un résultat d'analyse affiché à l'écran et pas encore
// enregistré en cliquant sur « Analyser une photo » — double vérification, indépendante de
// l'automate d'état, en plus de la garde déjà en place (défense en profondeur).
// Bandeau revu en profondeur : suppression du tutoiement (« appuie », « tu seras prévenu »)
// conformément au principe PhotoCartel = texte strictement impersonnel ; l'état « terminée »
// affiche désormais un badge explicite « Afficher les résultats de l'analyse » au lieu d'un texte
// ambigu à deviner ; l'état « en cours » affiche une petite animation de points pour montrer un
// vrai travail en arrière-plan (aucune animation sur « terminée », comme demandé).
// PhotoCartel v50.1 — correctifs suite à la recette de la v50 (Analyse IA en arrière-plan).
// Bug bloquant corrigé : « Accueil » et « Analyser une photo » ne fermaient jamais l'écran d'analyse
// pendant qu'une tâche était en cours ou terminée non enregistrée (condition de rendu qui gardait
// l'écran ouvert via analysePhotoSessionActiveRef, indépendamment de modeAnalysePhoto). La visibilité
// de l'écran ne dépend plus que de modeAnalysePhoto.
// Numéro de version affiché à l'écran (VERSION_PHOTOCARTEL) enfin synchronisé — il restait à v48.
// Scénario 1 : nouveau bouton « Reprendre la visite » sous « Interrompre l'analyse », qui masque
// l'écran sans interrompre la tâche et rouvre directement l'appareil photo de la visite en cours.
// Scénario 2 : l'enregistrement (ou l'abandon) d'une analyse lancée depuis la galerie d'une visite
// ramène désormais automatiquement sur cette même visite, à la même photo, au lieu de l'accueil
// (contexte de retour mémorisé au lancement dans analyseContexteRetourRef).
// Bibliothèques et Paramètres désactivés tant qu'une analyse IA est engagée, pour ne pas élargir
// le périmètre de la V1 au-delà des deux scénarios décrits.
// Bandeau global repositionné sous la barre supérieure (ou sous l'en-tête de la galerie d'une
// visite) au lieu de la recouvrir, et allégé visuellement.
// PhotoCartel v50 — Analyse IA en arrière-plan (chantier « PhotoCartel travaille en arrière-plan sur l'analyse IA »).
// L'analyse IA n'est plus une activité qui monopolise l'écran : elle devient une tâche autonome
// (petit automate : aucune / préparation / en_cours / terminée / échouée) suivie au niveau global,
// indépendante de l'écran affiché. Une seule analyse IA en arrière-plan à la fois ; toute tentative
// d'en lancer une seconde est refusée avec un message explicite. « Terminée » (résultat récupérable)
// reste distinct d' « enregistrée » (fichiers effectivement écrits) : le bandeau global ne réagit qu'à
// l'état « terminée ». Le modal plein écran qui bloquait toute navigation pendant l'analyse est
// supprimé et remplacé par un bandeau discret, visible sur tous les écrans (y compris la galerie
// d'une visite), cliquable pour revenir sur la tâche en cours. Câblage du déclenchement de l'analyse
// depuis la fiche-photo de la galerie d'une visite (lancement immédiat, sans quitter la galerie).
// Portée volontairement limitée à la V1 du chantier : pas de file d'attente, pas de reprise après
// fermeture complète de l'application, pas de notification Android — conformément au périmètre acté.
// PhotoCartel v48 — correction du tri de la liste des dernières visites (réautorisation + recalcul des dates à l'ouverture du menu).
// PhotoCartel v47.5 — correction de la modification depuis Dernières visites et ajustements du résumé.
// La dernière liste connue est affichée immédiatement ; l’énumération des dossiers ne parcourt plus toutes les photos.
// Les mesures des visites nouvelles sont complétées progressivement en arrière-plan sans bloquer l’ouverture du menu.
// La galerie v46.2 reste strictement conservée : miniatures à la demande, cache et restauration du scroll.
// La galerie n’est plus remontée comme un composant React neuf à chaque événement de scroll.
// La dernière ligne, donc la dernière photo, reste atteignable lorsque l’ascenseur est tout en bas.
// La photo source SAF est lue une seule fois avant écriture ; la destination est vérifiée octet par octet avant suppression.
// Les messages des fonctions futures restent locaux au bouton concerné et sont réinitialisés à chaque ouverture.
// Transaction Android : copie vérifiée hors de Voyages, suppression contrôlée de la source, publication vérifiée et restauration en cas d’échec.
 // Les collisions fichier/dossier sont résolues sans perte avant publication de la nouvelle visite.
// Les métadonnées locales enrichissent les visites physiques sans pouvoir en créer artificiellement.
// Le compteur de visite n’est incrémenté qu’après confirmation serveur d’une écriture physique vérifiée dans Collecte Photo en cours.
import { useState, useRef, useEffect } from "react";
import Tesseract from "tesseract.js";
import cv from "@techstark/opencv-js";


const ICONE_VILLE_PHOTOCARTEL_SRC =
  "data:image/webp;base64,UklGRlAEAABXRUJQVlA4IEQEAABQFQCdASpAAEAAPj0ai0OiIaEVCZ6IIAPEsQBOmWXh1kRVt/CbhOWuEj+Zd6B5gPOQ/yXre/yvqAf0n/M9Zj6AHlz+zH/fq/4/LcsVuplyxA00vy1d6/h6pcPzsMkge2e0Aau0KyLCJomSDlUhRqBpG+J7e58sW5iuHATGWwpD+gvA+8Ma5Bh3eVB51vxdrPl271PFLYAO+NQu+OAGzw1UBcc3S8bRHVD/tcyjyfN3q1KJgAD+//6Bj9Befepc4qaIiKnCfH7MCYkz+63R5NJ3proZRScq/9swfX8qwMYY2/Gt1DIs4QDMNFny9g2lRzVAYpofDlgGOqDo4IRJIYKe6+tQgkCtRJkC6EV1W+YUwRuWYK4nOs1GZONEFMZbdIMVOjVhX650aST4vsPLrAjHEvMBj6LhkkjfvSl6xWrAGjVw+/19GhozHuvG4RBK866ZHNoGWF6/I1CSIrmSP9JzwovzLJPuUnG/eNWUvyJ8kY7CFzEYX1/7a3ScAytJWiyQGjAkHuHu1lyrkF9wOyfYk4jEJ1a7fZdlWk8WBFH365QAhRRc0I9gn+A3gZ1LTVpcAijqmAaVXH586t64bjcF1giAUwZV4xa0AU2OBqz5LN4NoRjwGNcRqw+y9VPwSAal2bMhJV9x3T0V6MeHVhnPBT0Pn2LTtZvuaDcfrHW1QEXqqddb5GsZ/Cy/UWR9I8pzLPAV4LBqiXpNijUCMjpodgbmtv/r6f+X20x6xYoc0Y3EMZHGu+De+gOhlah0uAMPlX+ByaMbkg4zJOGd+tz3jolfZouY4adQOP2ZgjY59jss0s/Cj9vO+YbSjxCK978Gi/AU0C65ol+7xF/n+dJWvPqH/+4pH1nJDifrUk0O5zI3TNMlW9LDmGeTFKHS/mD8DIQ7uf4HlvxUYZzDMslLmWZ2bWuZlh/mhuHwXF9pxLPMsraof2u3s67Pdcm/S/8I4OwBXWP+Yr74XhF//Ad0EUx5xmoj/JCiP+r35h+bvzzWuv2liEfF+G29DPOvxT9sTHl/dYUB+0uW7/cjvk/laz2vix68/ape0uwQT23uz1k0SitADt8TJbGOeENwxV40HcPq5OmxDTFlUj5eTFXQ8zcY5tv65UJ7Rcu537R0yhbA1MNC2eS/Ids6cdzeNc/feg8Lfm4ldkmz3ErvnlVOipHG3gsv3S8jUnehnBJEvyIiJUo0p1bGL37Ovp/cZJImbigKhfK8E28tci+tCkWjgncpO8PRlh2wNoU9To+DWgz5M7QauBKasGXjfQ3RziOWg7PdBnf5BQG4iZoXd8jYBZ/oM0Gz4e/LNosNRfivEX1EXyKzQLNsIeQuUWCySllYBhLs3e5EG/TyRdpEVxAhpRvFq63K0clKREZBoxbh1cQrbGN+eFCQ4twPpx4+6OeEVLAI9ZB7olp9xFsq8+32tot5MsbqrBkgCPAxaIyMsuMAAAA=";


async function empreinteSha256BlobAndroid(blob) {
  if (!(blob instanceof Blob)) {
    throw new Error("Calcul d’empreinte impossible : fichier Android invalide.");
  }
  if (!globalThis.crypto?.subtle) {
    throw new Error("Calcul d’empreinte SHA-256 indisponible dans ce navigateur.");
  }
  const contenu = await blob.arrayBuffer();
  const empreinte = await globalThis.crypto.subtle.digest("SHA-256", contenu);
  return Array.from(new Uint8Array(empreinte), (octet) =>
    octet.toString(16).padStart(2, "0")
  ).join("");
}

const LOGO_PHOTOCARTEL_SRC =
  "data:image/webp;base64,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";


const PHOTO_ACCUEIL_PHOTOCARTEL_SRC =
  "data:image/webp;base64,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";


const VERSION_PHOTOCARTEL = "v80";

const VERSION = {
  numero: VERSION_PHOTOCARTEL,
  descriptif: "Résultats de recherche : bandeau de critères, tableau, grille et plein écran de la galerie",
  date: "2026-09-12",
  build: 5,
};

const VERSION_COMPLETE = `${VERSION.numero} - ${VERSION.descriptif}`;

// v77 — ATTENTES BORNÉES
// Une requête vers le serveur ne peut plus être attendue indéfiniment : réponse complète
// dans le délai, sinon erreur de code "DELAI_DEPASSE" ; annulation demandée par
// l'utilisateur, erreur de code "INTERROMPU". Côté serveur, chaque appel IA est lui-même
// borné à 40 s et une relance : 90 s par photo couvrent ce pire cas.
const DELAI_ATTENTE_BASE_MS = 30000;
const DELAI_ATTENTE_PAR_PHOTO_MS = 90000;

function delaiMaxAttentePhotos(nombrePhotos) {
  const nombre = Math.max(1, Number(nombrePhotos) || 1);
  return DELAI_ATTENTE_BASE_MS + DELAI_ATTENTE_PAR_PHOTO_MS * nombre;
}

function formaterDureeAttente(ms) {
  const totalSecondes = Math.round(Math.max(0, Number(ms) || 0) / 1000);
  const minutes = Math.floor(totalSecondes / 60);
  const secondes = totalSecondes % 60;
  if (minutes === 0) return `${secondes} s`;
  return secondes ? `${minutes} min ${secondes} s` : `${minutes} min`;
}

async function executerRequeteBornee(url, options = {}, { delaiMs, signal: signalExterne } = {}) {
  const controleur = new AbortController();
  let cause = "";
  const surAnnulationExterne = () => {
    cause = cause || "INTERROMPU";
    controleur.abort();
  };

  if (signalExterne) {
    if (signalExterne.aborted) surAnnulationExterne();
    else signalExterne.addEventListener("abort", surAnnulationExterne, { once: true });
  }

  const minuterie = setTimeout(() => {
    cause = cause || "DELAI_DEPASSE";
    controleur.abort();
  }, delaiMs);

  try {
    if (cause) throw new Error(cause);
    const response = await fetch(url, { ...options, signal: controleur.signal });
    const texte = await response.text();
    return { response, texte };
  } catch (error) {
    if (cause) {
      const erreur = new Error(
        cause === "DELAI_DEPASSE"
          ? `Aucune réponse du serveur en ${formaterDureeAttente(delaiMs)}.`
          : "Opération interrompue."
      );
      erreur.code = cause;
      throw erreur;
    }
    throw error;
  } finally {
    clearTimeout(minuterie);
    if (signalExterne) signalExterne.removeEventListener("abort", surAnnulationExterne);
  }
}

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

// ————————————————————————————————————————————————————————————————————————
// v78 — MOTEUR DE RECHERCHE
//
// Deux temps, et seulement deux :
//   1. préparation, UNE FOIS par index chargé : lecture des noms selon la
//      convention de Vincent (mots, année, pays, ville, sujet, rang, marqueurs
//      de travail), héritages A (même sujet), B (artiste trouvé dans le
//      dossier) et C (mots ajoutés à la main) ;
//   2. recherche, à chaque frappe : quelques millisecondes, jamais un accès au
//      disque.
//
// Force d'une correspondance, de la plus forte à la plus faible (périmètre
// v78, point 8) : nom de la photo, fiche, nom d'un dossier, mot ajouté (C),
// même sujet (A), artiste trouvé dans le dossier (B), puis correspondance
// approchée ou traduite. Un marqueur de travail (init, FAIT, DEF, LIGHT)
// reste cherchable mais ne donne jamais de rang.
// ————————————————————————————————————————————————————————————————————————

const NIVEAU_RECHERCHE_NOM = 1;
const NIVEAU_RECHERCHE_FICHE = 2;
const NIVEAU_RECHERCHE_DOSSIER = 3;
const NIVEAU_RECHERCHE_AJOUTE = 4;
const NIVEAU_RECHERCHE_SUJET = 5;
const NIVEAU_RECHERCHE_ARTISTE_DOSSIER = 6;
const NIVEAU_RECHERCHE_APPROCHE = 7;
const NIVEAU_RECHERCHE_MARQUEUR = 8;
const NIVEAU_RECHERCHE_AUCUN = 255;

const LIBELLES_ORIGINE_RECHERCHE = {
  [NIVEAU_RECHERCHE_NOM]: "nom de la photo",
  [NIVEAU_RECHERCHE_FICHE]: "fiche d’analyse",
  [NIVEAU_RECHERCHE_DOSSIER]: "nom du dossier",
  [NIVEAU_RECHERCHE_AJOUTE]: "ajouté par toi",
  [NIVEAU_RECHERCHE_SUJET]: "même sujet",
  [NIVEAU_RECHERCHE_ARTISTE_DOSSIER]: "artiste trouvé dans le dossier",
  [NIVEAU_RECHERCHE_APPROCHE]: "correspondance approchée",
  [NIVEAU_RECHERCHE_MARQUEUR]: "marqueur de travail",
};

// Mots sans valeur dans une saisie : exigés en ET, ils feraient rendre zéro
// résultat à « toutes mes peintures de Rembrandt » (constaté sur la v77).
const MOTS_VIDES_RECHERCHE = new Set([
  "les", "des", "une", "aux", "mes", "tes", "ses", "nos", "vos", "leur", "leurs",
  "tout", "tous", "toute", "toutes", "sur", "sous", "dans", "avec", "pour", "par",
  "sans", "chez", "entre", "vers", "que", "qui", "quoi", "dont", "est", "sont",
  "mon", "ton", "son", "cet", "cette", "ces", "ceux", "celle", "celles",
  "photo", "photos", "image", "images", "cherche", "trouve", "montre", "voir",
  "the", "and", "del", "los", "las", "della", "degli",
]);

// Marqueurs de travail relevés dans les noms de Vincent (init2, FAIT, DEF2,
// LIGHT). Un nombre qui suit immédiatement un marqueur en fait partie.
const MARQUEURS_TRAVAIL_RECHERCHE = new Set(["init", "fait", "def", "light"]);

// Cadrages en fin de nom : ils distinguent les prises d'un même sujet.
const CADRAGES_RECHERCHE = new Set([
  "ext", "exterieur", "exterieure", "int", "interieur", "interieure",
  "detail", "details", "zoom", "pano", "panorama", "panoramique",
]);

// Préfixes d'appareil : un nom réduit à l'un d'eux ne désigne aucun sujet.
const PREFIXES_APPAREIL_RECHERCHE = new Set([
  "img", "dsc", "dscn", "dscf", "pxl", "mvimg", "wp", "imag", "photo", "image",
  "screenshot", "capture", "pict", "p", "vid", "burst", "sam", "gopr", "dji",
]);

// Lexique d'équivalences embarqué (périmètre v78, point 4). Chaque groupe
// liste des mots normalisés et au singulier ; une saisie qui est l'un d'eux
// trouve aussi tous les autres, au rang « correspondance approchée ».
const LEXIQUE_EQUIVALENCES_RECHERCHE = [
  ["place", "plaza", "piazza", "praca", "platz", "square", "plein", "placa", "praza"],
  ["arme", "armas", "arma", "armi", "arm", "arms"],
  ["cathedrale", "catedral", "cattedrale", "cathedral", "kathedrale", "duomo", "dom", "se"],
  ["eglise", "iglesia", "chiesa", "church", "kirche", "igreja", "kerk", "kosciol"],
  ["basilique", "basilica", "basilika", "basiliek"],
  ["chapelle", "capilla", "cappella", "chapel", "kapelle", "capela"],
  ["musee", "museo", "museum", "museu", "muzeum", "musei"],
  ["chateau", "castillo", "castello", "castle", "schloss", "castelo", "burg", "kasteel", "zamek"],
  ["palais", "palacio", "palazzo", "palace", "palast", "paleis"],
  ["jardin", "giardino", "garden", "garten", "jardim", "tuin", "gardens"],
  ["parc", "parque", "parco", "park"],
  ["pont", "puente", "ponte", "bridge", "brucke", "brug", "most"],
  ["tour", "torre", "tower", "turm", "toren"],
  ["rue", "calle", "via", "street", "strasse", "rua", "straat"],
  ["fontaine", "fuente", "fontana", "fountain", "brunnen", "fonte"],
  ["cloitre", "claustro", "chiostro", "cloister", "kreuzgang"],
  ["monastere", "monasterio", "monastero", "monastery", "kloster", "mosteiro", "abbaye", "abbey", "abadia", "abbazia"],
  ["couvent", "convento", "convent"],
  ["mer", "mar", "mare", "sea", "meer"],
  ["lac", "lago", "lake", "meer"],
  ["plage", "playa", "spiaggia", "beach", "praia", "strand"],
  ["port", "puerto", "porto", "harbour", "harbor", "hafen", "haven"],
  ["ile", "isla", "isola", "island", "insel", "ilha", "eiland"],
  ["montagne", "montana", "montagna", "mountain", "berg", "montanha"],
  ["vieux", "vieille", "viejo", "vieja", "vecchio", "vecchia", "old", "alt", "velho", "velha"],
  ["gare", "estacion", "stazione", "station", "bahnhof", "estacao"],
  ["marche", "mercado", "mercato", "market", "markt"],
  ["theatre", "teatro", "theater"],
  ["temple", "templo", "tempio", "tempel"],
  ["mosquee", "mezquita", "moschea", "mosque", "moschee", "mesquita"],
  ["peinture", "pintura", "pittura", "painting", "gemalde", "schilderij", "tableau", "dipinto"],
  ["sculpture", "escultura", "scultura", "skulptur", "beeld"],
  ["statue", "estatua", "statua", "standbild"],
  ["dinosaure", "dinosaurio", "dinosauro", "dinosaur", "dinosaurier"],
  ["saint", "san", "santo", "santa", "sankt", "sao"],
  ["hotel", "hostal", "albergo"],
  ["phare", "faro", "lighthouse", "leuchtturm", "farol"],
  ["cascade", "cascada", "cascata", "waterfall", "wasserfall"],
  ["grotte", "cueva", "grotta", "cave", "hohle"],
  ["mur", "muralla", "muro", "wall", "mauer", "muraille", "remparts", "rempart"],
  ["hopital", "hospital", "ospedale"],
  ["universite", "universidad", "universita", "university", "universitat"],
  ["bibliotheque", "biblioteca", "library", "bibliothek"],
  ["hotel de ville", "ayuntamiento", "municipio", "rathaus", "mairie", "town hall"],
];

// Pays : [nom canonique affiché, variantes...]. Reconnaissance par le
// contenu, jamais par la place du mot dans le nom (point 2 de la v78).
const PAYS_RECHERCHE = [
  ["France", "france", "french"], ["Espagne", "espagne", "espana", "spain"], ["Italie", "italie", "italia", "italy"],
  ["Portugal", "portugal"], ["Allemagne", "allemagne", "deutschland", "germany"], ["Belgique", "belgique", "belgie", "belgium"],
  ["Pays-Bas", "pays bas", "hollande", "nederland", "netherlands"], ["Suisse", "suisse", "schweiz", "svizzera", "switzerland"],
  ["Autriche", "autriche", "osterreich", "austria"], ["Royaume-Uni", "royaume uni", "angleterre", "ecosse", "england", "scotland", "united kingdom"],
  ["Irlande", "irlande", "ireland", "eire"], ["Suède", "suede", "sverige", "sweden"], ["Norvège", "norvege", "norge", "norway"],
  ["Danemark", "danemark", "danmark", "denmark"], ["Finlande", "finlande", "suomi", "finland"], ["Islande", "islande", "iceland"],
  ["Pologne", "pologne", "polska", "poland"], ["Tchéquie", "tchequie", "republique tcheque", "czechia", "czech republic"],
  ["Hongrie", "hongrie", "magyarorszag", "hungary"], ["Grèce", "grece", "hellas", "greece"], ["Croatie", "croatie", "hrvatska", "croatia"],
  ["Slovénie", "slovenie", "slovenija", "slovenia"], ["Roumanie", "roumanie", "romania"], ["Bulgarie", "bulgarie", "bulgaria"],
  ["Malte", "malte", "malta"], ["Chypre", "chypre", "cyprus"], ["Luxembourg", "luxembourg"], ["Monaco", "monaco"],
  ["Estonie", "estonie", "eesti", "estonia"], ["Lettonie", "lettonie", "latvija", "latvia"], ["Lituanie", "lituanie", "lietuva", "lithuania"],
  ["Slovaquie", "slovaquie", "slovensko", "slovakia"], ["Serbie", "serbie", "srbija", "serbia"], ["Monténégro", "montenegro"],
  ["Albanie", "albanie", "albania"], ["Russie", "russie", "rossiya", "russia"], ["Ukraine", "ukraine", "ukraina"],
  ["Turquie", "turquie", "turkiye", "turkey"], ["Maroc", "maroc", "morocco"], ["Tunisie", "tunisie", "tunisia"],
  ["Égypte", "egypte", "egypt", "misr"], ["Algérie", "algerie", "algeria"], ["Afrique du Sud", "afrique du sud", "south africa"],
  ["Kenya", "kenya"], ["Tanzanie", "tanzanie", "tanzania"], ["Sénégal", "senegal"], ["Madagascar", "madagascar"],
  ["Maurice", "ile maurice", "mauritius"], ["Israël", "israel"], ["Jordanie", "jordanie", "jordan"], ["Liban", "liban", "lebanon"],
  ["Émirats arabes unis", "emirats", "emirates", "dubai", "abu dhabi"], ["Oman", "oman"], ["Iran", "iran"], ["Inde", "inde", "india"],
  ["Népal", "nepal"], ["Sri Lanka", "sri lanka"], ["Chine", "chine", "china", "zhongguo"], ["Japon", "japon", "japan", "nippon", "nihon"],
  ["Corée du Sud", "coree", "korea"], ["Thaïlande", "thailande", "thailand"], ["Cambodge", "cambodge", "cambodia", "kampuchea"],
  ["Vietnam", "vietnam", "viet nam"], ["Laos", "laos"], ["Birmanie", "birmanie", "myanmar"], ["Malaisie", "malaisie", "malaysia"],
  ["Singapour", "singapour", "singapore"], ["Indonésie", "indonesie", "indonesia", "bali"], ["Philippines", "philippines", "pilipinas"],
  ["Australie", "australie", "australia"], ["Nouvelle-Zélande", "nouvelle zelande", "new zealand", "aotearoa"],
  ["Canada", "canada"], ["États-Unis", "etats unis", "usa", "united states"], ["Mexique", "mexique", "mexico"],
  ["Cuba", "cuba"], ["Guatemala", "guatemala"], ["Costa Rica", "costa rica"], ["Panama", "panama"], ["Colombie", "colombie", "colombia"],
  ["Équateur", "equateur", "ecuador"], ["Pérou", "perou", "peru"], ["Bolivie", "bolivie", "bolivia"], ["Chili", "chili", "chile"],
  ["Argentine", "argentine", "argentina"], ["Uruguay", "uruguay"], ["Paraguay", "paraguay"], ["Brésil", "bresil", "brasil", "brazil"],
  ["Venezuela", "venezuela"], ["République dominicaine", "republique dominicaine", "dominican republic"],
];

// Villes : liste embarquée, en français et en langue locale. Un mot non
// reconnu reste cherchable ; il n'alimente simplement pas la pastille.
const VILLES_RECHERCHE = [
  ["Paris", "paris"], ["Lyon", "lyon"], ["Marseille", "marseille"], ["Bordeaux", "bordeaux"], ["Nice", "nice"], ["Strasbourg", "strasbourg"],
  ["Toulouse", "toulouse"], ["Lille", "lille"], ["Nantes", "nantes"], ["Deauville", "deauville"], ["Villers-sur-Mer", "villers sur mer"],
  ["Madrid", "madrid"], ["Barcelone", "barcelone", "barcelona"], ["Séville", "seville", "sevilla"], ["Grenade", "grenade", "granada"],
  ["Cordoue", "cordoue", "cordoba"], ["Valence", "valence", "valencia"], ["Bilbao", "bilbao"], ["Saint-Jacques-de-Compostelle", "compostelle", "santiago de compostela"],
  ["Tolède", "tolede", "toledo"], ["Salamanque", "salamanque", "salamanca"], ["Saint-Sébastien", "san sebastian", "donostia"],
  ["Rome", "rome", "roma"], ["Florence", "florence", "firenze"], ["Venise", "venise", "venezia", "venice"], ["Milan", "milan", "milano"],
  ["Naples", "naples", "napoli"], ["Bologne", "bologne", "bologna"], ["Turin", "turin", "torino"], ["Pise", "pise", "pisa"],
  ["Sienne", "sienne", "siena"], ["Vérone", "verone", "verona"], ["Gênes", "genes", "genova"], ["Palerme", "palerme", "palermo"],
  ["Lisbonne", "lisbonne", "lisboa", "lisbon"], ["Porto", "porto", "oporto"], ["Sintra", "sintra"],
  ["Berlin", "berlin"], ["Munich", "munich", "munchen"], ["Francfort", "francfort", "frankfurt"], ["Hambourg", "hambourg", "hamburg"],
  ["Cologne", "cologne", "koln"], ["Dresde", "dresde", "dresden"], ["Bruxelles", "bruxelles", "brussel", "brussels"], ["Bruges", "bruges", "brugge"],
  ["Gand", "gand", "gent"], ["Anvers", "anvers", "antwerpen"], ["Amsterdam", "amsterdam"], ["Rotterdam", "rotterdam"], ["La Haye", "la haye", "den haag"],
  ["Genève", "geneve", "geneva"], ["Zurich", "zurich"], ["Vienne", "vienne", "wien", "vienna"], ["Salzbourg", "salzbourg", "salzburg"],
  ["Londres", "londres", "london"], ["Édimbourg", "edimbourg", "edinburgh"], ["Dublin", "dublin"], ["Stockholm", "stockholm"],
  ["Oslo", "oslo"], ["Copenhague", "copenhague", "kobenhavn", "copenhagen"], ["Helsinki", "helsinki"], ["Reykjavik", "reykjavik"],
  ["Prague", "prague", "praha"], ["Budapest", "budapest"], ["Varsovie", "varsovie", "warszawa", "warsaw"], ["Cracovie", "cracovie", "krakow"],
  ["Athènes", "athenes", "athina", "athens"], ["Dubrovnik", "dubrovnik"], ["Split", "split"], ["Istanbul", "istanbul"],
  ["Saint-Pétersbourg", "saint petersbourg", "st petersburg"], ["Moscou", "moscou", "moskva", "moscow"],
  ["Marrakech", "marrakech", "marrakesh"], ["Fès", "fes", "fez"], ["Le Caire", "le caire", "cairo"], ["Louxor", "louxor", "luxor"],
  ["Jérusalem", "jerusalem"], ["Petra", "petra"], ["Dubaï", "dubai"],
  ["Tokyo", "tokyo"], ["Kyoto", "kyoto"], ["Osaka", "osaka"], ["Hiroshima", "hiroshima"], ["Nara", "nara"], ["Miyajima", "miyajima"],
  ["Pékin", "pekin", "beijing"], ["Shanghai", "shanghai"], ["Hong Kong", "hong kong"], ["Séoul", "seoul"],
  ["Bangkok", "bangkok"], ["Chiang Mai", "chiang mai"], ["Chiang Rai", "chiang rai", "chian rai"], ["Phuket", "phuket"], ["Ayutthaya", "ayutthaya"],
  ["Siem Reap", "siem reap"], ["Angkor", "angkor"], ["Phnom Penh", "phnom penh"], ["Hanoï", "hanoi"], ["Hô Chi Minh-Ville", "ho chi minh", "saigon"],
  ["Luang Prabang", "luang prabang"], ["Singapour", "singapour", "singapore"], ["Kuala Lumpur", "kuala lumpur"], ["Bali", "bali"],
  ["Delhi", "delhi"], ["Agra", "agra"], ["Jaipur", "jaipur"], ["Bombay", "bombay", "mumbai"], ["Katmandou", "katmandou", "kathmandu"],
  ["Sydney", "sydney"], ["Melbourne", "melbourne"],
  ["New York", "new york"], ["Washington", "washington"], ["San Francisco", "san francisco"], ["Los Angeles", "los angeles"],
  ["Chicago", "chicago"], ["Boston", "boston"], ["La Nouvelle-Orléans", "nouvelle orleans", "new orleans"], ["Las Vegas", "las vegas"],
  ["Montréal", "montreal"], ["Québec", "quebec"], ["Toronto", "toronto"], ["Vancouver", "vancouver"], ["Calgary", "calgary"],
  ["Banff", "banff"], ["Lake Louise", "lake louise"], ["Drumheller", "drumheller"],
  ["Mexico", "ciudad de mexico"], ["Oaxaca", "oaxaca"], ["La Havane", "la havane", "habana", "havana"],
  ["Cusco", "cusco", "cuzco"], ["Lima", "lima"], ["Arequipa", "arequipa"], ["Machu Picchu", "machu picchu"],
  ["La Paz", "la paz"], ["Sucre", "sucre"], ["Potosí", "potosi"], ["Uyuni", "uyuni"],
  ["Santiago du Chili", "santiago"], ["Valparaiso", "valparaiso"], ["San Pedro de Atacama", "san pedro de atacama", "atacama"],
  ["Buenos Aires", "buenos aires"], ["Ushuaïa", "ushuaia"], ["Iguazú", "iguazu", "iguacu"],
  ["Rio de Janeiro", "rio de janeiro", "rio"], ["Copacabana", "copacabana"], ["São Paulo", "sao paulo"], ["Salvador", "salvador de bahia"],
  ["Encarnación", "encarnacion"], ["Asunción", "asuncion"], ["Montevideo", "montevideo"], ["Bogota", "bogota"], ["Carthagène", "carthagene", "cartagena"],
  ["Quito", "quito"],
];

// Découpe « rapide » d'un nom de photo : table des mots déjà découpés, pour
// que 20 000 noms qui partagent les mêmes mots ne soient pas re-découpés.
function construireTablePhrasesRecherche(liste) {
  const table = new Map();
  let longueurMax = 1;
  for (let i = 0; i < liste.length; i += 1) {
    const canonique = liste[i][0];
    for (let j = 1; j < liste[i].length; j += 1) {
      const mots = decouperEnMotsPhotoCartel(liste[i][j]);
      if (mots.length === 0) continue;
      table.set(mots.join(" "), canonique);
      if (mots.length > longueurMax) longueurMax = mots.length;
    }
  }
  return { table, longueurMax };
}

const TABLE_PAYS_RECHERCHE = construireTablePhrasesRecherche(PAYS_RECHERCHE);
const TABLE_VILLES_RECHERCHE = construireTablePhrasesRecherche(VILLES_RECHERCHE);

const EQUIVALENTS_PAR_MOT_RECHERCHE = (() => {
  const table = new Map();
  for (let i = 0; i < LEXIQUE_EQUIVALENCES_RECHERCHE.length; i += 1) {
    const groupe = LEXIQUE_EQUIVALENCES_RECHERCHE[i]
      .map((mot) => decouperEnMotsPhotoCartel(mot).join(" "))
      .filter((mot) => mot && !mot.includes(" "));
    for (let j = 0; j < groupe.length; j += 1) {
      const existants = table.get(groupe[j]) || new Set();
      for (let k = 0; k < groupe.length; k += 1) existants.add(groupe[k]);
      table.set(groupe[j], existants);
    }
  }
  return table;
})();

function reconnaitrePhrasesRecherche(mots, tablePhrases, resultat) {
  const { table, longueurMax } = tablePhrases;
  for (let i = 0; i < mots.length; i += 1) {
    let phrase = "";
    for (let longueur = 1; longueur <= longueurMax && i + longueur <= mots.length; longueur += 1) {
      phrase = longueur === 1 ? mots[i] : `${phrase} ${mots[i + longueur - 1]}`;
      const canonique = table.get(phrase);
      if (canonique) resultat.add(canonique);
    }
  }
  return resultat;
}

// Année portée par une suite de mots : 2019 isolé, une date collée
// (20190209, 20260809114601), ou « juillet 2019 » une fois détaché.
function anneeDepuisMotsRecherche(mots) {
  for (let i = 0; i < mots.length; i += 1) {
    const mot = mots[i];
    if (/^(19|20)\d\d$/.test(mot)) return mot;
    if (/^(19|20)\d\d(0[1-9]|1[0-2])([0-2]\d|3[01])(\d{6})?$/.test(mot)) return mot.slice(0, 4);
  }
  return "";
}

function estMotNombreRecherche(mot) {
  return /^\d+$/.test(mot);
}

// Lecture d'un nom de photo selon la convention de Vincent :
//   - marqueurs de travail (init 2, FAIT, DEF2, LIGHT) : à part ;
//   - sujet : le nom sans son numéro d'ordre de tête, sans ses dates, et sans
//     sa fin (rang, cadrage, marqueurs). « Bilbao_Cathédrale de
//     Santiago-Cloître1 » à « …Cloître6 » donnent un seul sujet. Un nom réduit
//     à un préfixe d'appareil (IMG_20260809_114601) n'a pas de sujet ;
//   - rang : dernier nombre de la fin du nom, sert à l'ordre des prises.
function lireNomPhotoRecherche(nomFichier) {
  const tous = decouperEnMotsPhotoCartel(nomSansExtensionRecherche(nomFichier));
  const mots = [];
  const marqueurs = [];
  for (let i = 0; i < tous.length; i += 1) {
    const mot = tous[i];
    if (MARQUEURS_TRAVAIL_RECHERCHE.has(mot)) {
      marqueurs.push(mot);
      if (i + 1 < tous.length && estMotNombreRecherche(tous[i + 1]) && tous[i + 1].length <= 2) {
        marqueurs.push(tous[i + 1]);
        i += 1;
      }
      continue;
    }
    mots.push(mot);
  }

  let fin = mots.length;
  let rang = 0;
  while (fin > 0) {
    const mot = mots[fin - 1];
    if (estMotNombreRecherche(mot)) {
      if (!rang && mot.length <= 4 && !/^(19|20)\d\d$/.test(mot)) rang = Number(mot);
      fin -= 1;
      continue;
    }
    if (CADRAGES_RECHERCHE.has(mot)) {
      fin -= 1;
      continue;
    }
    break;
  }
  let debut = 0;
  while (debut < fin && estMotNombreRecherche(mots[debut])) debut += 1;

  const motsSujet = mots
    .slice(debut, fin)
    .filter((mot) => !/^(19|20)\d{6}(\d{6})?$/.test(mot) && !(estMotNombreRecherche(mot) && mot.length >= 5));
  const significatif = motsSujet.some(
    (mot) => mot.length >= 3 && !estMotNombreRecherche(mot) && !PREFIXES_APPAREIL_RECHERCHE.has(mot)
  );

  return {
    mots,
    marqueurs,
    sujet: significatif ? motsSujet.join(" ") : "",
    rang,
    annee: anneeDepuisMotsRecherche(tous),
  };
}

function lireNomDossierRecherche(nomDossier) {
  const tous = decouperEnMotsPhotoCartel(nomDossier);
  const mots = [];
  const marqueurs = [];
  for (let i = 0; i < tous.length; i += 1) {
    if (MARQUEURS_TRAVAIL_RECHERCHE.has(tous[i])) {
      marqueurs.push(tous[i]);
      if (i + 1 < tous.length && estMotNombreRecherche(tous[i + 1]) && tous[i + 1].length <= 2) {
        marqueurs.push(tous[i + 1]);
        i += 1;
      }
      continue;
    }
    mots.push(tous[i]);
  }
  return { mots, marqueurs, annee: anneeDepuisMotsRecherche(tous) };
}

// Préparation du moteur : UNE FOIS par index chargé ou par mot ajouté.
function preparerMoteurRecherche(index, motsAjoutes) {
  const vocabulaire = new Map();
  const listeMots = [];
  const identifiant = (mot) => {
    let id = vocabulaire.get(mot);
    if (id === undefined) {
      id = listeMots.length;
      listeMots.push(mot);
      vocabulaire.set(mot, id);
    }
    return id;
  };
  const identifiants = (mots) => {
    const vus = new Set();
    for (let i = 0; i < mots.length; i += 1) if (mots[i]) vus.add(identifiant(mots[i]));
    return Array.from(vus);
  };

  const ajoutes = motsAjoutes && typeof motsAjoutes === "object" ? motsAjoutes : {};
  const sourceDossiers = Array.isArray(index?.dossiers) ? index.dossiers : [];
  const sourcePhotos = Array.isArray(index?.photos) ? index.photos : [];

  const dossiers = sourceDossiers.map((dossier, position) => {
    const conteneur = estDossierConteneurRecherche(dossier.chemin);
    const lecture = lireNomDossierRecherche(dossier.nom);
    const parent = dossier.parent >= 0 && dossier.parent < position ? dossier.parent : -1;
    const motsC = ajoutes[dossier.chemin] || [];
    const pays = new Set();
    const villes = new Set();
    if (!conteneur) {
      reconnaitrePhrasesRecherche(lecture.mots, TABLE_PAYS_RECHERCHE, pays);
      reconnaitrePhrasesRecherche(lecture.mots, TABLE_VILLES_RECHERCHE, villes);
    }
    return {
      position,
      chemin: dossier.chemin,
      nom: dossier.nom,
      parent,
      conteneur,
      motsNom: conteneur ? [] : identifiants(lecture.mots),
      marqueurs: conteneur ? [] : identifiants(lecture.marqueurs),
      motsAjoutes: identifiants(decouperEnMotsPhotoCartel(motsC.join(" "))),
      motsAjoutesAffiches: motsC.slice(),
      motsArtistesDossier: [],
      artistesDossier: [],
      anneePropre: conteneur ? "" : lecture.annee,
      paysPropres: pays,
      villesPropres: villes,
    };
  });

  // Héritage descendant : année, pays et ville du dossier le plus proche.
  for (let i = 0; i < dossiers.length; i += 1) {
    const dossier = dossiers[i];
    const parent = dossier.parent >= 0 ? dossiers[dossier.parent] : null;
    dossier.annee = dossier.anneePropre || (parent ? parent.annee : "");
    dossier.pays = new Set([...(parent ? parent.pays : []), ...dossier.paysPropres]);
    dossier.villes = new Set([...(parent ? parent.villes : []), ...dossier.villesPropres]);
    dossier.profondeur = parent ? parent.profondeur + 1 : 0;
  }

  const photos = sourcePhotos.map((photo, position) => {
    const lecture = lireNomPhotoRecherche(photo.nom);
    const dossier = photo.dossier >= 0 ? dossiers[photo.dossier] : null;
    const pays = new Set(dossier ? dossier.pays : []);
    const villes = new Set(dossier ? dossier.villes : []);
    reconnaitrePhrasesRecherche(lecture.mots, TABLE_PAYS_RECHERCHE, pays);
    reconnaitrePhrasesRecherche(lecture.mots, TABLE_VILLES_RECHERCHE, villes);
    if (photo.pays) reconnaitrePhrasesRecherche(decouperEnMotsPhotoCartel(photo.pays), TABLE_PAYS_RECHERCHE, pays);
    if (photo.ville) reconnaitrePhrasesRecherche(decouperEnMotsPhotoCartel(photo.ville), TABLE_VILLES_RECHERCHE, villes);
    const anneeFiche = /^(19|20)\d\d/.test(photo.dateIso) ? photo.dateIso.slice(0, 4) : "";
    const annee = anneeFiche || lecture.annee || (dossier ? dossier.annee : "");
    return {
      position,
      nom: photo.nom,
      dossier: photo.dossier,
      fichier: photo.fichier || (dossier ? `${dossier.chemin}/${photo.nom}` : photo.nom),
      analysee: photo.analysee,
      titre: photo.titre,
      auteur: photo.auteur,
      institution: photo.institution,
      type: photo.type,
      dateIso: photo.dateIso,
      annee,
      pays,
      villes,
      sujet: lecture.sujet,
      rang: lecture.rang,
      motsNom: identifiants(lecture.mots),
      marqueurs: identifiants(lecture.marqueurs),
      motsFiche: photo.analysee ? identifiants(String(photo.fiche || "").split(" ")) : [],
      motsSujet: [],
      artistesSujet: [],
    };
  });

  // A — même sujet : une photo analysée transmet son artiste à toutes les
  // prises du même sujet, dans le même dossier.
  const groupesSujet = new Map();
  for (let i = 0; i < photos.length; i += 1) {
    const photo = photos[i];
    if (!photo.sujet) continue;
    const cle = `${photo.dossier}|${photo.sujet}`;
    if (!groupesSujet.has(cle)) groupesSujet.set(cle, []);
    groupesSujet.get(cle).push(photo);
  }
  groupesSujet.forEach((groupe) => {
    const artistes = Array.from(
      new Set(groupe.filter((photo) => photo.analysee && photo.auteur).map((photo) => photo.auteur))
    );
    if (artistes.length === 0) return;
    const ids = identifiants(decouperEnMotsPhotoCartel(artistes.join(" ")));
    for (let i = 0; i < groupe.length; i += 1) {
      groupe[i].motsSujet = ids;
      groupe[i].artistesSujet = artistes;
    }
  });

  // B — artiste trouvé dans le dossier : TOUS les artistes des photos
  // analysées d'un dossier s'appliquent à ce dossier, pas à ses sous-dossiers.
  const artistesParDossier = new Map();
  for (let i = 0; i < photos.length; i += 1) {
    const photo = photos[i];
    if (!photo.analysee || !photo.auteur || photo.dossier < 0) continue;
    if (dossiers[photo.dossier].conteneur) continue;
    if (!artistesParDossier.has(photo.dossier)) artistesParDossier.set(photo.dossier, new Set());
    artistesParDossier.get(photo.dossier).add(photo.auteur);
  }
  artistesParDossier.forEach((artistes, position) => {
    const liste = Array.from(artistes);
    dossiers[position].artistesDossier = liste;
    dossiers[position].motsArtistesDossier = identifiants(decouperEnMotsPhotoCartel(liste.join(" ")));
  });

  // Pastilles : ce qui existe réellement dans la photothèque, par fréquence.
  const compter = (cle) => {
    const compte = new Map();
    for (let i = 0; i < photos.length; i += 1) {
      const valeurs = cle === "annee" ? (photos[i].annee ? [photos[i].annee] : []) : Array.from(photos[i][cle]);
      for (let j = 0; j < valeurs.length; j += 1) compte.set(valeurs[j], (compte.get(valeurs[j]) || 0) + 1);
    }
    return Array.from(compte, ([valeur, nombre]) => ({ valeur, nombre }));
  };
  const pastillesPays = compter("pays").sort((a, b) => b.nombre - a.nombre || a.valeur.localeCompare(b.valeur, "fr"));
  const pastillesVilles = compter("villes").sort((a, b) => b.nombre - a.nombre || a.valeur.localeCompare(b.valeur, "fr"));
  const pastillesAnnees = compter("annee").sort((a, b) => Number(b.valeur) - Number(a.valeur));

  return {
    vocabulaire: listeMots,
    dossiers,
    photos,
    pastilles: { pays: pastillesPays, villes: pastillesVilles, annees: pastillesAnnees },
    nombrePhotos: photos.length,
    nombreAnalysees: photos.filter((photo) => photo.analysee).length,
  };
}

// Mots d'une saisie : même découpe que les noms, mots vides et mots de deux
// lettres retirés (sauf une année), pluriels ramenés au singulier.
function decouperSaisieRecherche(saisie) {
  const mots = [];
  const bruts = decouperEnMotsPhotoCartel(saisie);
  for (let i = 0; i < bruts.length; i += 1) {
    let mot = bruts[i];
    if (!mot || mot.length <= 2 || MOTS_VIDES_RECHERCHE.has(mot)) continue;
    if (!estMotNombreRecherche(mot)) {
      if (mot.endsWith("eaux") && mot.length > 5) mot = mot.slice(0, -1);
      else if (mot.endsWith("s") && !mot.endsWith("ss") && mot.length > 3) mot = mot.slice(0, -1);
    }
    if (!mots.includes(mot)) mots.push(mot);
  }
  return mots;
}

// Écart d'au plus une lettre (substitution, ajout ou retrait).
function ecartUneLettreRecherche(a, b) {
  if (a === b) return true;
  const la = a.length;
  const lb = b.length;
  if (Math.abs(la - lb) > 1) return false;
  let i = 0;
  let j = 0;
  let ecarts = 0;
  while (i < la && j < lb) {
    if (a[i] === b[j]) {
      i += 1;
      j += 1;
      continue;
    }
    ecarts += 1;
    if (ecarts > 1) return false;
    if (la > lb) i += 1;
    else if (lb > la) j += 1;
    else {
      i += 1;
      j += 1;
    }
  }
  return ecarts + (la - i) + (lb - j) <= 1;
}

// Pour un mot saisi, le niveau de chaque mot du vocabulaire : 1 exact (le mot
// du vocabulaire commence par la saisie), 2 équivalent ou approché, 0 aucun.
function niveauxVocabulaireRecherche(vocabulaire, mot) {
  const niveaux = new Uint8Array(vocabulaire.length);
  const equivalents = Array.from(EQUIVALENTS_PAR_MOT_RECHERCHE.get(mot) || []).filter(
    (autre) => autre !== mot
  );
  const tolerance = mot.length >= 5 && !estMotNombreRecherche(mot);
  for (let i = 0; i < vocabulaire.length; i += 1) {
    const candidat = vocabulaire[i];
    if (candidat.startsWith(mot)) {
      niveaux[i] = 1;
      continue;
    }
    for (let j = 0; j < equivalents.length; j += 1) {
      if (candidat.startsWith(equivalents[j]) && (equivalents[j].length >= 3 || candidat === equivalents[j])) {
        niveaux[i] = 2;
        break;
      }
    }
    if (niveaux[i] || !tolerance || candidat.length < mot.length - 1) continue;
    if (
      ecartUneLettreRecherche(mot, candidat.slice(0, mot.length)) ||
      ecartUneLettreRecherche(mot, candidat.slice(0, mot.length + 1)) ||
      ecartUneLettreRecherche(mot, candidat.slice(0, mot.length - 1))
    ) {
      niveaux[i] = 2;
    }
  }
  return niveaux;
}

function meilleurNiveauRecherche(ids, niveaux, niveauExact) {
  let meilleur = NIVEAU_RECHERCHE_AUCUN;
  for (let i = 0; i < ids.length; i += 1) {
    const niveau = niveaux[ids[i]];
    if (niveau === 1) return niveauExact;
    if (niveau === 2) meilleur = NIVEAU_RECHERCHE_APPROCHE;
  }
  return meilleur;
}

function comparerNomsRecherche(a, b) {
  return String(a || "").localeCompare(String(b || ""), "fr", { numeric: true, sensitivity: "base" });
}

function photoPasseFiltresRecherche(photo, filtres) {
  if (filtres.analyseesSeulement && !photo.analysee) return false;
  if (filtres.annees.length > 0 && !filtres.annees.includes(photo.annee)) return false;
  if (filtres.pays.length > 0 && !filtres.pays.some((valeur) => photo.pays.has(valeur))) return false;
  if (filtres.villes.length > 0 && !filtres.villes.some((valeur) => photo.villes.has(valeur))) return false;
  return true;
}

// Recherche : une seule liste ordonnée qui mêle photos, sujets et dossiers.
//   - correspondance sur la photo elle-même (nom, fiche, même sujet) : la photo
//     est le résultat ; plusieurs prises d'un même sujet font UNE ligne sujet ;
//   - correspondance par les seuls dossiers (nom, mot ajouté, artiste du
//     dossier) : le dossier le plus haut qui correspond est le résultat, une
//     seule ligne pour toutes ses photos.
function rechercherDansMoteur(moteur, saisie, filtresRecu) {
  const filtres = {
    analyseesSeulement: Boolean(filtresRecu?.analyseesSeulement),
    annees: Array.isArray(filtresRecu?.annees) ? filtresRecu.annees : [],
    pays: Array.isArray(filtresRecu?.pays) ? filtresRecu.pays : [],
    villes: Array.isArray(filtresRecu?.villes) ? filtresRecu.villes : [],
  };
  const mots = decouperSaisieRecherche(saisie);
  const aucunFiltre =
    !filtres.analyseesSeulement && !filtres.annees.length && !filtres.pays.length && !filtres.villes.length;
  const vide = { mots, lignes: [], compteurs: { photos: 0, sujets: 0, dossiers: 0 } };
  if (!moteur || (mots.length === 0 && aucunFiltre)) return vide;

  const nombreMots = mots.length;
  const niveauxParMot = mots.map((mot) => niveauxVocabulaireRecherche(moteur.vocabulaire, mot));
  const dossiers = moteur.dossiers;

  // Niveaux par dossier : « hérité » (nom et mots ajoutés, transmis aux
  // sous-dossiers) et « local » (hérité + artiste trouvé dans ce dossier).
  const herite = new Uint8Array(dossiers.length * Math.max(1, nombreMots)).fill(NIVEAU_RECHERCHE_AUCUN);
  const local = new Uint8Array(dossiers.length * Math.max(1, nombreMots)).fill(NIVEAU_RECHERCHE_AUCUN);
  for (let d = 0; d < dossiers.length; d += 1) {
    const dossier = dossiers[d];
    for (let m = 0; m < nombreMots; m += 1) {
      const niveaux = niveauxParMot[m];
      let niveau = dossier.parent >= 0 ? herite[dossier.parent * nombreMots + m] : NIVEAU_RECHERCHE_AUCUN;
      niveau = Math.min(niveau, meilleurNiveauRecherche(dossier.motsNom, niveaux, NIVEAU_RECHERCHE_DOSSIER));
      niveau = Math.min(niveau, meilleurNiveauRecherche(dossier.motsAjoutes, niveaux, NIVEAU_RECHERCHE_AJOUTE));
      const marqueur = meilleurNiveauRecherche(dossier.marqueurs, niveaux, NIVEAU_RECHERCHE_MARQUEUR);
      if (marqueur !== NIVEAU_RECHERCHE_AUCUN) niveau = Math.min(niveau, NIVEAU_RECHERCHE_MARQUEUR);
      herite[d * nombreMots + m] = niveau;
      local[d * nombreMots + m] = Math.min(
        niveau,
        meilleurNiveauRecherche(dossier.motsArtistesDossier, niveaux, NIVEAU_RECHERCHE_ARTISTE_DOSSIER)
      );
    }
  }

  // Dossier résultat d'un dossier direct : le plus haut de sa chaîne (hors
  // conteneurs) qui porte à lui seul tous les mots. Calculé une fois par dossier.
  const cibleParDossier = new Map();
  const cibleDossier = (position) => {
    if (cibleParDossier.has(position)) return cibleParDossier.get(position);
    const chaine = [];
    for (let d = position; d >= 0; d = dossiers[d].parent) chaine.unshift(d);
    let cible = -1;
    for (let k = 0; k < chaine.length; k += 1) {
      const d = chaine[k];
      if (dossiers[d].conteneur) continue;
      if (nombreMots === 0) {
        cible = position >= 0 && !dossiers[position].conteneur ? position : -1;
        break;
      }
      const tableau = d === position ? local : herite;
      let porteTout = true;
      for (let m = 0; m < nombreMots; m += 1) {
        if (tableau[d * nombreMots + m] === NIVEAU_RECHERCHE_AUCUN) {
          porteTout = false;
          break;
        }
      }
      if (porteTout) {
        cible = d;
        break;
      }
    }
    cibleParDossier.set(position, cible);
    return cible;
  };

  const lignesPhotos = [];
  const parDossierCible = new Map();

  for (let p = 0; p < moteur.photos.length; p += 1) {
    const photo = moteur.photos[p];
    if (!photoPasseFiltresRecherche(photo, filtres)) continue;

    let score = 0;
    let pireNiveau = 0;
    let dossierPorteTout = true;
    let photoPorteUnMot = false;
    let complet = true;
    for (let m = 0; m < nombreMots; m += 1) {
      const niveaux = niveauxParMot[m];
      let propre = meilleurNiveauRecherche(photo.motsNom, niveaux, NIVEAU_RECHERCHE_NOM);
      propre = Math.min(propre, meilleurNiveauRecherche(photo.motsFiche, niveaux, NIVEAU_RECHERCHE_FICHE));
      propre = Math.min(propre, meilleurNiveauRecherche(photo.motsSujet, niveaux, NIVEAU_RECHERCHE_SUJET));
      const marqueur = meilleurNiveauRecherche(photo.marqueurs, niveaux, NIVEAU_RECHERCHE_MARQUEUR);
      const parDossier = photo.dossier >= 0 ? local[photo.dossier * nombreMots + m] : NIVEAU_RECHERCHE_AUCUN;
      if (propre !== NIVEAU_RECHERCHE_AUCUN) photoPorteUnMot = true;
      if (parDossier === NIVEAU_RECHERCHE_AUCUN) dossierPorteTout = false;
      let niveau = Math.min(propre, parDossier);
      if (niveau === NIVEAU_RECHERCHE_AUCUN && marqueur !== NIVEAU_RECHERCHE_AUCUN) niveau = NIVEAU_RECHERCHE_MARQUEUR;
      if (niveau === NIVEAU_RECHERCHE_AUCUN) {
        complet = false;
        break;
      }
      score += niveau;
      if (niveau > pireNiveau) pireNiveau = niveau;
    }
    if (!complet) continue;

    const auNiveauDossier = nombreMots === 0 ? true : dossierPorteTout && !photoPorteUnMot;
    const cible = auNiveauDossier && photo.dossier >= 0 ? cibleDossier(photo.dossier) : -1;

    if (auNiveauDossier && cible >= 0) {
      if (!parDossierCible.has(cible)) parDossierCible.set(cible, { photos: [], photosAPart: 0 });
      parDossierCible.get(cible).photos.push(photo.position);
    } else {
      lignesPhotos.push({ photo, score, pireNiveau });
    }
  }

  // Regroupement des prises d'un même sujet.
  const groupes = new Map();
  const seules = [];
  for (let i = 0; i < lignesPhotos.length; i += 1) {
    const entree = lignesPhotos[i];
    if (!entree.photo.sujet) {
      seules.push(entree);
      continue;
    }
    const cle = `${entree.photo.dossier}|${entree.photo.sujet}`;
    if (!groupes.has(cle)) groupes.set(cle, []);
    groupes.get(cle).push(entree);
  }

  const lignes = [];
  const dateTri = (photo) => photo.dateIso || photo.annee || "";
  const ajouterLignePhoto = (entree) => {
    const photo = entree.photo;
    lignes.push({
      type: "photo",
      cle: `photo-${photo.position}`,
      ordre: 0,
      score: entree.score,
      dateTri: dateTri(photo),
      titre: photo.titre || nomSansExtensionRecherche(photo.nom),
      photos: [photo.position],
      dossier: photo.dossier,
      origine: LIBELLES_ORIGINE_RECHERCHE[entree.pireNiveau] || "",
    });
  };
  for (let i = 0; i < seules.length; i += 1) ajouterLignePhoto(seules[i]);
  groupes.forEach((groupe, cle) => {
    if (groupe.length === 1) {
      ajouterLignePhoto(groupe[0]);
      return;
    }
    groupe.sort(
      (a, b) =>
        comparerNomsRecherche(a.photo.nom, b.photo.nom) || a.photo.rang - b.photo.rang
    );
    const meilleur = groupe.reduce((min, entree) => Math.min(min, entree.score), NIVEAU_RECHERCHE_AUCUN * 16);
    const pire = groupe.reduce((max, entree) => Math.max(max, entree.pireNiveau), 0);
    const avecTitre = groupe.find((entree) => entree.photo.titre);
    const dates = groupe.map((entree) => dateTri(entree.photo)).filter(Boolean).sort();
    lignes.push({
      type: "sujet",
      cle: `sujet-${cle}`,
      ordre: 1,
      score: meilleur,
      dateTri: dates[0] || "",
      titre: avecTitre ? avecTitre.photo.titre : nomSujetAffichableRecherche(groupe[0].photo.nom),
      photos: groupe.map((entree) => entree.photo.position),
      dossier: groupe[0].photo.dossier,
      origine: LIBELLES_ORIGINE_RECHERCHE[pire] || "",
    });
  });

  // Photos sorties seules ou en sujet, rangées sous un dossier résultat : le
  // dossier annonce « et N autres photos ».
  const positionsAPart = new Set();
  for (let i = 0; i < lignes.length; i += 1) {
    for (let j = 0; j < lignes[i].photos.length; j += 1) positionsAPart.add(lignes[i].photos[j]);
  }
  parDossierCible.forEach((contenu, cible) => {
    let score = 0;
    let pire = 0;
    for (let m = 0; m < nombreMots; m += 1) {
      const niveau = local[cible * nombreMots + m];
      score += niveau;
      if (niveau > pire) pire = niveau;
    }
    let photosAPart = 0;
    positionsAPart.forEach((position) => {
      for (let d = moteur.photos[position].dossier; d >= 0; d = dossiers[d].parent) {
        if (d === cible) {
          photosAPart += 1;
          break;
        }
      }
    });
    lignes.push({
      type: "dossier",
      cle: `dossier-${cible}`,
      ordre: 2,
      score,
      dateTri: "",
      titre: dossiers[cible].nom,
      photos: contenu.photos.sort((a, b) =>
        comparerNomsRecherche(moteur.photos[a].fichier, moteur.photos[b].fichier)
      ),
      dossier: cible,
      photosAPart,
      origine: nombreMots > 0 ? LIBELLES_ORIGINE_RECHERCHE[pire] || "" : "",
    });
  });

  lignes.sort(
    (a, b) =>
      a.ordre - b.ordre ||
      a.score - b.score ||
      (a.dateTri && b.dateTri ? (a.dateTri < b.dateTri ? -1 : a.dateTri > b.dateTri ? 1 : 0) : a.dateTri ? -1 : b.dateTri ? 1 : 0) ||
      comparerNomsRecherche(a.titre, b.titre)
  );

  return {
    mots,
    lignes,
    compteurs: {
      photos: lignes.filter((ligne) => ligne.type === "photo").length,
      sujets: lignes.filter((ligne) => ligne.type === "sujet").length,
      dossiers: lignes.filter((ligne) => ligne.type === "dossier").length,
    },
  };
}

// Titre lisible d'un sujet : le nom de la première prise, sans extension, sans
// son rang ni son cadrage de fin.
function nomSujetAffichableRecherche(nomFichier) {
  return nomSansExtensionRecherche(nomFichier)
    .replace(/([\s_-]+(ext|int|detail|détail|details|détails|zoom|pano)?[\s_-]*\d{0,4})+$/i, "")
    .replace(/\d+$/, "")
    .replace(/[\s_-]+$/, "")
    .trim() || nomSansExtensionRecherche(nomFichier);
}

// Compteur en langage courant : « 14 photos, 3 sujets, 2 visites ».
function texteCompteursRecherche(compteurs) {
  const morceaux = [];
  const pluriel = (nombre, singulier, plurielTexte) =>
    `${nombre} ${nombre > 1 ? plurielTexte : singulier}`;
  if (compteurs.photos) morceaux.push(pluriel(compteurs.photos, "photo", "photos"));
  if (compteurs.sujets) morceaux.push(pluriel(compteurs.sujets, "sujet", "sujets"));
  if (compteurs.dossiers) morceaux.push(pluriel(compteurs.dossiers, "visite", "visites"));
  return morceaux.length > 0 ? morceaux.join(", ") : "Aucune photo trouvée";
}

// v45.5 : déduction locale et déterministe du drapeau depuis le nom du voyage.
// Aucun appel réseau, aucun nouveau champ et aucun traitement IA.
// En l'absence d'un pays identifiable, aucun code pays ni drapeau de remplacement n’est affiché.
function drapeauPourNomVoyage(nomVoyage) {
  const texte = String(nomVoyage || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const correspondances = [
    ["allemagne", "🇩🇪"], ["germany", "🇩🇪"],
    ["france", "🇫🇷"], ["villers sur mer", "🇫🇷"], ["deauville", "🇫🇷"], ["paris", "🇫🇷"],
    ["italie", "🇮🇹"], ["italy", "🇮🇹"],
    ["espagne", "🇪🇸"], ["spain", "🇪🇸"],
    ["portugal", "🇵🇹"],
    ["belgique", "🇧🇪"], ["belgium", "🇧🇪"],
    ["pays-bas", "🇳🇱"], ["hollande", "🇳🇱"], ["netherlands", "🇳🇱"],
    ["suisse", "🇨🇭"], ["switzerland", "🇨🇭"],
    ["autriche", "🇦🇹"], ["austria", "🇦🇹"],
    ["grece", "🇬🇷"], ["greece", "🇬🇷"],
    ["bulgarie", "🇧🇬"], ["bulgaria", "🇧🇬"],
    ["roumanie", "🇷🇴"], ["romania", "🇷🇴"],
    ["hongrie", "🇭🇺"], ["hungary", "🇭🇺"],
    ["pologne", "🇵🇱"], ["poland", "🇵🇱"],
    ["tchequie", "🇨🇿"], ["republique tcheque", "🇨🇿"], ["czech", "🇨🇿"],
    ["slovaquie", "🇸🇰"], ["slovakia", "🇸🇰"],
    ["slovenie", "🇸🇮"], ["slovenia", "🇸🇮"],
    ["croatie", "🇭🇷"], ["croatia", "🇭🇷"],
    ["serbie", "🇷🇸"], ["serbia", "🇷🇸"],
    ["bosnie", "🇧🇦"], ["bosnia", "🇧🇦"],
    ["montenegro", "🇲🇪"],
    ["albanie", "🇦🇱"], ["albania", "🇦🇱"],
    ["macedoine", "🇲🇰"], ["macedonia", "🇲🇰"],
    ["danemark", "🇩🇰"], ["denmark", "🇩🇰"],
    ["suede", "🇸🇪"], ["sweden", "🇸🇪"],
    ["norvege", "🇳🇴"], ["norway", "🇳🇴"],
    ["finlande", "🇫🇮"], ["finland", "🇫🇮"],
    ["islande", "🇮🇸"], ["iceland", "🇮🇸"],
    ["irlande", "🇮🇪"], ["ireland", "🇮🇪"],
    ["royaume-uni", "🇬🇧"], ["angleterre", "🇬🇧"], ["ecosse", "🇬🇧"], ["londres", "🇬🇧"], ["united kingdom", "🇬🇧"],
    ["turquie", "🇹🇷"], ["turkey", "🇹🇷"],
    ["georgie", "🇬🇪"], ["georgia", "🇬🇪"],
    ["armenie", "🇦🇲"], ["armenia", "🇦🇲"],
    ["japon", "🇯🇵"], ["japan", "🇯🇵"],
    ["coree", "🇰🇷"], ["korea", "🇰🇷"],
    ["chine", "🇨🇳"], ["china", "🇨🇳"],
    ["vietnam", "🇻🇳"],
    ["thailande", "🇹🇭"], ["thailand", "🇹🇭"],
    ["cambodge", "🇰🇭"], ["cambodia", "🇰🇭"],
    ["laos", "🇱🇦"],
    ["indonesie", "🇮🇩"], ["indonesia", "🇮🇩"],
    ["inde", "🇮🇳"], ["india", "🇮🇳"],
    ["nepal", "🇳🇵"],
    ["maroc", "🇲🇦"], ["morocco", "🇲🇦"],
    ["tunisie", "🇹🇳"], ["tunisia", "🇹🇳"],
    ["egypte", "🇪🇬"], ["egypt", "🇪🇬"],
    ["afrique du sud", "🇿🇦"], ["south africa", "🇿🇦"],
    ["etats-unis", "🇺🇸"], ["usa", "🇺🇸"], ["new york", "🇺🇸"], ["californie", "🇺🇸"],
    ["canada", "🇨🇦"],
    ["mexique", "🇲🇽"], ["mexico", "🇲🇽"],
    ["bresil", "🇧🇷"], ["brazil", "🇧🇷"],
    ["argentine", "🇦🇷"], ["argentina", "🇦🇷"],
    ["chili", "🇨🇱"], ["chile", "🇨🇱"],
    ["perou", "🇵🇪"], ["peru", "🇵🇪"],
    ["bolivie", "🇧🇴"], ["bolivia", "🇧🇴"],
    ["colombie", "🇨🇴"], ["colombia", "🇨🇴"],
    ["australie", "🇦🇺"], ["australia", "🇦🇺"],
    ["nouvelle-zelande", "🇳🇿"], ["new zealand", "🇳🇿"],
  ];

  return correspondances.find(([mot]) => texte.includes(mot))?.[1] || "";
}

// PhotoCartel v39 — contexte de stockage Android/PWA unique et reprise robuste après réautorisation.
// Une analyse IA ne peut plus laisser la visite courante dans un état de stockage incohérent.
// Un outil temporaire de diagnostic permet d’oublier volontairement les handles pour reproduire le scénario.
// Le mini-bloc Début / Fin est compact et visuellement séparé ; Statut et Actions sont ajoutés sans connexion métier.
// La première modification renomme ensemble le JPEG et le JSON avec le suffixe _MODIFIEE.
// Deux flèches permettent aussi de naviguer dans la galerie en local.

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

const DOSSIER_METIER_VOYAGES = "Voyages";
const DOSSIER_VISITES_A_RATTACHER = "Visites à rattacher";
const CLE_CACHE_VISITES_PHYSIQUES = "photoCartelCacheVisitesPhysiques_v45_3";
const TAILLE_INITIALE_GALERIE_VISITE = 500;
const TAILLE_PAGE_FOND_GALERIE_VISITE = 500;
const SURBALAYAGE_LIGNES_GALERIE = 4;

function calculerColonnesGalerieVisite(largeurDisponible, nombrePhotos) {
  const largeur = Math.max(0, Number(largeurDisponible) || 0);
  const total = Math.max(0, Number(nombrePhotos) || 0);

  // Téléphone : trois colonnes tactiles. Tablette et PC : davantage de miniatures,
  // avec une densité qui augmente pour les visites longues.
  if (largeur < 600) return Math.max(1, Math.min(3, total || 3));

  let largeurCible = 250;
  if (total > 24) largeurCible = 220;
  if (total > 60) largeurCible = 195;
  if (total > 140) largeurCible = 175;

  const colonnesParLargeur = Math.max(3, Math.floor(largeur / largeurCible));
  const maximum = largeur >= 1500 ? 10 : largeur >= 1100 ? 8 : 6;
  return Math.max(1, Math.min(maximum, total || maximum, colonnesParLargeur));
}
const CONCURRENCE_PREFETCH_MINIATURES = 0;
const CONCURRENCE_CHARGEMENT_IMAGES_ANDROID = 2;
const MAX_IMAGES_ANDROID_EN_MEMOIRE = 320;

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
      ? `http://${window.location.hostname}:3002`
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

  async function verifierServeurModificationVisite() {
    let response;
    try {
      response = await fetch(API_BASE + "/health", { cache: "no-store" });
    } catch (error) {
      throw new Error(
        `Serveur PhotoCartel inaccessible sur ${API_BASE}. Vérifie qu’il est démarré sur le port 3002.`
      );
    }

    const informations = await lireReponseJsonPhotoCartel(response, "Vérification du serveur PhotoCartel");
    if (!response.ok || !informations.success) {
      throw new Error(informations.error || "Le serveur PhotoCartel ne répond pas correctement.");
    }

    if (String(informations.version || "") !== VERSION_PHOTOCARTEL) {
      throw new Error(
        `Le serveur actif annonce ${informations.version || "une version inconnue"}, pas ${VERSION_PHOTOCARTEL}. ` +
          "Arrête puis redémarre le serveur avec le nouveau server.js avant d’enregistrer."
      );
    }
  }

  async function appelerModificationIdentiteVisite(payload) {
    await verifierServeurModificationVisite();

    // v42 : une erreur métier ne doit jamais provoquer un second envoi du même
    // changement. Le repli sur /api n'est autorisé que si la première route
    // n'existe réellement pas (404/405). Cela évite une double exécution après
    // une première modification partiellement ou totalement appliquée.
    const routes = ["/modifier-identite-visite", "/api/modifier-identite-visite"];

    for (let index = 0; index < routes.length; index += 1) {
      const route = routes[index];
      let response;
      try {
        response = await fetch(API_BASE + route, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (error) {
        throw new Error(
          `Serveur PhotoCartel inaccessible pendant la modification : ${error.message}`
        );
      }

      const routeAbsente = response.status === 404 || response.status === 405;
      if (routeAbsente && index < routes.length - 1) {
        continue;
      }

      const resultat = await lireReponseJsonPhotoCartel(
        response,
        "Erreur modification de la visite"
      );
      if (!response.ok || !resultat.success) {
        throw new Error(resultat.error || "Modification impossible");
      }
      return resultat;
    }

    throw new Error("Aucune route de modification de visite n'est disponible.");
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
const [typeNouvelleVisite, setTypeNouvelleVisite] = useState("");
const [listeTypesVisiteOuverte, setListeTypesVisiteOuverte] = useState(false);
const [typeVisiteEnConfirmation, setTypeVisiteEnConfirmation] = useState("");
const temporisationTypeVisiteRef = useRef(null);

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
  // v38.4 : aucun type n’est présélectionné lors de l’ouverture.
  setTypeNouvelleVisite("");
  setTypeVisiteEnConfirmation("");
  if (temporisationTypeVisiteRef.current) {
    clearTimeout(temporisationTypeVisiteRef.current);
    temporisationTypeVisiteRef.current = null;
  }
  setListeTypesVisiteOuverte(false);
  setModeAucuneVisite(false);
  setModeCreationVisite(true);
};

const annulerCreationVisite = () => {
  if (temporisationTypeVisiteRef.current) {
    clearTimeout(temporisationTypeVisiteRef.current);
    temporisationTypeVisiteRef.current = null;
  }
  setTypeVisiteEnConfirmation("");
  setListeTypesVisiteOuverte(false);
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

  // v38.6 — l'ouverture du sélecteur quitte la page d'accueil figée et ouvre
  // l'écran fonctionnel « Dernières visites ». Le résumé reste purement graphique.
  const [listeDernieresVisitesOuverte, setListeDernieresVisitesOuverte] = useState(false);
  const [visitesPhysiques, setVisitesPhysiques] = useState(() => lireCacheVisitesPhysiques());
  const [lectureVisitesPhysiquesEnCours, setLectureVisitesPhysiquesEnCours] = useState(false);
  const [erreurLectureVisitesPhysiques, setErreurLectureVisitesPhysiques] = useState("");
  const [visiteResumeSelectionnee, setVisiteResumeSelectionnee] = useState(null);
  const [visiteRecenteEnConfirmation, setVisiteRecenteEnConfirmation] = useState("");
  const temporisationDerniereVisiteRef = useRef(null);
  const sectionDernieresVisitesRef = useRef(null);
  const [messageFonctionnaliteAccueil, setMessageFonctionnaliteAccueil] = useState("");
  const temporisationMessageFonctionnaliteRef = useRef(null);

  // v39 — édition de l'identité d'une visite depuis l'accueil ou le résumé.
  const [modeModificationIdentiteVisite, setModeModificationIdentiteVisite] = useState(false);
  const [visiteEnModification, setVisiteEnModification] = useState(null);
  const [nomVisiteModifie, setNomVisiteModifie] = useState("");
  const [villeVisiteModifiee, setVilleVisiteModifiee] = useState("");
  const [typeVisiteModifie, setTypeVisiteModifie] = useState("");
  const [listeTypesModificationOuverte, setListeTypesModificationOuverte] = useState(false);
  const [typeModificationEnConfirmation, setTypeModificationEnConfirmation] = useState("");
  const [modificationVisiteEnCours, setModificationVisiteEnCours] = useState(false);
  const [messageModificationVisite, setMessageModificationVisite] = useState("");

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
// v67 — resultats detailles par oeuvre (nom final + succes), pour afficher vignette + nouveau
// nom sur l'ecran final. Deja renvoyes par /renommer-oeuvres/confirmer, simplement jamais geres.
const [resultatsRenommageDetail, setResultatsRenommageDetail] = useState(null);
const [renommageFinalEnCours, setRenommageFinalEnCours] = useState(false);
const [renommageFinalTermine, setRenommageFinalTermine] = useState(false);

// v50.5 — pause manuelle avant l'analyse IA (étape 3 de la spec) et pause manuelle
// avant l'écriture définitive du renommage (étape 6 de la spec).
const [propositionsRenommage, setPropositionsRenommage] = useState(null);
const [analyseRenommageEnCours, setAnalyseRenommageEnCours] = useState(false);
const [confirmationRenommageEnCours, setConfirmationRenommageEnCours] = useState(false);


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
const [datePhotoAnalyseIso, setDatePhotoAnalyseIso] = useState("");
const [dateHeureAnalyseIA, setDateHeureAnalyseIA] = useState("");
const analysePhotoSessionActiveRef = useRef(false);
const analysePhotoOrigineRef = useRef("");
const analysePhotoAbortControllerRef = useRef(null);
// v50 — Analyse IA en arrière-plan : petit automate explicite, indépendant de l'écran affiché.
// Valeurs possibles : "aucune" | "preparation" | "en_cours" | "terminee" | "echouee".
// "terminee" signifie que l'IA a répondu (résultat récupérable), pas que le résultat est enregistré :
// ces deux notions restent volontairement distinctes (voir analysePhotoSauvegardee).
const [etatTacheAnalyseIA, setEtatTacheAnalyseIA] = useState("aucune");
// Identité du travail conservée pendant toute la durée de la tâche, même si l'utilisateur
// change d'écran : visite d'origine au moment du lancement (pour un futur affichage détaillé).
const analyseIAVisiteOrigineRef = useRef("");
// v50 — retour de recette : mémorise D'OÙ la tâche a été lancée (« galerie-visite » avec la visite,
// l'index et le mode fiche/grille), pour pouvoir y revenir automatiquement une fois la tâche résolue
// (enregistrée ou abandonnée) au lieu de toujours renvoyer sur l'accueil.
const analyseContexteRetourRef = useRef(null);
const [analysePhotoEdition, setAnalysePhotoEdition] = useState(false);
const [analysePhotoModifiee, setAnalysePhotoModifiee] = useState(false);
// v38.12 : on conserve deux références distinctes :
// - le drapeau synchrone de modification ;
// - le résultat IA initial, immuable pendant toute la session d'analyse.
const analysePhotoModifieeRef = useRef(false);
const analysePhotoResultatInitialRef = useRef(null);
const analysePhotoAvantEditionRef = useRef(null);
const analysePhotoModifieeAvantEditionRef = useRef(false);
const autorisationStockageHandleCandidatRef = useRef(null);
// v34.8 : ces handles doivent survivre aux re-rendus React. Des variables locales `let`
// étaient réinitialisées à chaque changement d’état, ce qui forçait une nouvelle demande.
const photoCartelHandleDcimSessionRef = useRef(null);
const photoCartelHandleRacineAndroidSessionRef = useRef(null);
// v47.2 : le handle persistant est préchargé avant tout clic sur « Ouvrir la visite ».
// Le clic peut ainsi appeler requestPermission() comme toute première opération asynchrone.
const autorisationGalerieHandleCandidatRef = useRef(null);
const [autorisationGalerieEnCours, setAutorisationGalerieEnCours] = useState(false);
// v39 : numéro de génération du contexte de stockage. Chaque réautorisation réussie
// installe atomiquement un nouveau contexte partagé par tous les parcours.
const stockageAndroidGenerationRef = useRef(0);
const stockageAndroidDerniereSourceRef = useRef("non initialisé");
const [diagnosticStockageV39, setDiagnosticStockageV39] = useState("");
const [simulationPerteStockageV39EnCours, setSimulationPerteStockageV39EnCours] = useState(false);

useEffect(() => {
  if (!estAndroid()) return undefined;
  let annule = false;
  (async () => {
    const racine = await lireHandleAndroid(NOM_HANDLE_RACINE_ANDROID);
    const dcim = await lireHandleDcimAndroid();
    if (annule) return;
    const candidat = estHandlePhotoCartelValide(racine)
      ? racine
      : estHandleDcimValide(dcim)
        ? dcim
        : null;
    autorisationGalerieHandleCandidatRef.current = candidat;
  })().catch((error) => console.warn("Préchargement autorisation galerie impossible :", error));
  return () => { annule = true; };
}, []);

// v42.0.15 : audit non destructif de l'arborescence Android.
// Aucun fichier ni dossier n'est créé, renommé, déplacé ou supprimé.
const [auditStockageAndroidEnCours, setAuditStockageAndroidEnCours] = useState(false);
const [rapportAuditStockageAndroid, setRapportAuditStockageAndroid] = useState("");
const [dateAuditStockageAndroid, setDateAuditStockageAndroid] = useState("");
const [analysePhotoNomAAnalyser, setAnalysePhotoNomAAnalyser] = useState("");
const [analysePhotoNomAnalysee, setAnalysePhotoNomAnalysee] = useState("");
const [analysePhotoNomJson, setAnalysePhotoNomJson] = useState("");
const [analysePhotoTimestampInitial, setAnalysePhotoTimestampInitial] = useState("");

const [modeGalerieAnalyses, setModeGalerieAnalyses] = useState(false);
const [galerieAnalyses, setGalerieAnalyses] = useState([]);
const galerieAnalysesCacheRef = useRef([]);
// v69 — verrou : une seule resynchronisation de la galerie à la fois.
const galerieResynchronisationEnCoursRef = useRef(false);
// v69.1 — image de la fiche affichée, côté Android. L'URL est stockée AVEC le nom
// de la photo à laquelle elle appartient : elle n'est affichée que si elle
// correspond à la fiche actuellement à l'écran. En v69 l'état ne contenait que
// l'URL, si bien que pendant la résolution de la nouvelle image (plusieurs
// centaines de millisecondes sur téléphone) l'image de la fiche PRÉCÉDENTE restait
// affichée sous les métadonnées de la nouvelle — défaut constaté en recette.
const [galerieImageCourante, setGalerieImageCourante] = useState({
  nomPhoto: "",
  url: "",
});
// v69.1 — handle du dossier « Photos analysées » conservé pour la session. Sans lui,
// chaque changement de fiche relançait la résolution de la racine ET la vérification
// des onze dossiers d'infrastructure avant de pouvoir ouvrir une image.
const dossierPhotosAnalyseesAndroidRef = useRef(null);
// v70 — URL objet actuellement vivante, pour la révoquer au changement de fiche.
const galerieImageUrlVivanteRef = useRef("");
// v70 — nom de photo dont le chargement est en cours, pour ne pas le relancer.
const galerieImageEnCoursRef = useRef("");
const [galerieIndex, setGalerieIndex] = useState(0);
const [galerieChargement, setGalerieChargement] = useState(false);
const [messageGalerieAnalyses, setMessageGalerieAnalyses] = useState("");
const [galerieSauvegardeEnCours, setGalerieSauvegardeEnCours] = useState(false);
const [confirmationSuppressionGalerie, setConfirmationSuppressionGalerie] = useState(false);
const galerieTouchStartXRef = useRef(null);
const galerieTouchStartYRef = useRef(null);

// v44.2 — maquette locale : identité PhotoCartel restaurée et jeu visuel distinct pour chaque visite.
const [modeGalerieVisite, setModeGalerieVisite] = useState(false);
const [modePhotoGalerieVisite, setModePhotoGalerieVisite] = useState(false);
const [visiteGalerieMaquette, setVisiteGalerieMaquette] = useState(null);
const [indexPhotoGalerieVisite, setIndexPhotoGalerieVisite] = useState(0);
const [photosGalerieVisite, setPhotosGalerieVisite] = useState([]);
const [nombreTotalPhotosGalerieVisite, setNombreTotalPhotosGalerieVisite] = useState(0);
const [chargementGalerieVisite, setChargementGalerieVisite] = useState(false);
const [erreurGalerieVisite, setErreurGalerieVisite] = useState("");
const [confirmationSuppressionPhotoVisite, setConfirmationSuppressionPhotoVisite] = useState(false);
const [suppressionPhotoVisiteEnCours, setSuppressionPhotoVisiteEnCours] = useState(false);
const [erreurSuppressionPhotoVisite, setErreurSuppressionPhotoVisite] = useState("");
const [visiteASupprimer, setVisiteASupprimer] = useState(null);
const [confirmationSuppressionVisite, setConfirmationSuppressionVisite] = useState(false);
const [suppressionVisiteEnCours, setSuppressionVisiteEnCours] = useState(false);
const [erreurSuppressionVisite, setErreurSuppressionVisite] = useState("");
const [scrollTopGalerieVisite, setScrollTopGalerieVisite] = useState(0);
const [hauteurGalerieVisite, setHauteurGalerieVisite] = useState(600);
const [largeurGalerieVisite, setLargeurGalerieVisite] = useState(360);
const galerieVisiteTouchStartXRef = useRef(null);
const galerieVisiteTouchStartYRef = useRef(null);
const galerieVisiteGrilleRef = useRef(null);
const scrollGrilleAvantPhotoRef = useRef(0);
const restaurationScrollGrilleRef = useRef(null);
const urlsObjetGalerieVisiteRef = useRef([]);
const chargementsGalerieAbortRef = useRef([]);
const generationGalerieVisiteRef = useRef(0);
const prefetchMiniaturesAnnuleRef = useRef(false);
const filePrefetchMiniaturesRef = useRef([]);
const miniaturesPrefetchVuesRef = useRef(new Set());
const travailleursPrefetchMiniaturesRef = useRef(0);
const cacheGaleriesVisiteRef = useRef(new Map());
const cacheUrlsImagesAndroidGalerieRef = useRef(new Map());
const promessesImagesAndroidGalerieRef = useRef(new Map());
const fileImagesAndroidGalerieRef = useRef([]);
const travailleursImagesAndroidGalerieRef = useRef(0);
const generationLectureVisitesRef = useRef(0);

const [actualisationEnCours, setActualisationEnCours] = useState(false);
// v77 — opérations « en cours » : un jeton par opération invalide tout résultat arrivé après
// une interruption ; le contrôleur annule la requête réseau quand c'est possible.
const jetonsOperationsRef = useRef({ renommage: 0, classification: 0, rangement: 0 });
const controleursOperationsRef = useRef({});
// v77 — la modale de rangement peut être fermée par « Accueil » pendant que le rangement finit.
const [rangementModaleFermee, setRangementModaleFermee] = useState(false);
// v77 — étape de l'accueil à amener à l'écran, une fois rendue.
const [demandeMiseEnVue, setDemandeMiseEnVue] = useState(null);
useEffect(() => {
  if (!demandeMiseEnVue) return;
  const element = document.getElementById(demandeMiseEnVue.id);
  if (element && typeof element.scrollIntoView === "function") {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}, [demandeMiseEnVue]);
const [messageActualisation, setMessageActualisation] = useState("");
const [messageArborescenceAndroid, setMessageArborescenceAndroid] = useState("");
const messageArborescenceTimeoutRef = useRef(null);
const [messageTestStockageAndroid, setMessageTestStockageAndroid] = useState("");
const [testStockageAndroidEnCours, setTestStockageAndroidEnCours] = useState(false);
const [derniereActualisation, setDerniereActualisation] = useState(null);

const [modeParametres, setModeParametres] = useState(false);
const [ecranParametres, setEcranParametres] = useState("menu");
const [modeBibliotheques, setModeBibliotheques] = useState(false);
// v78 — moteur de recherche : un seul champ, des pastilles, une liste ordonnée
// qui mêle photos, sujets et dossiers ; la recherche interroge le moteur en
// mémoire et ne touche jamais le disque.
const [modeRechercheResultats, setModeRechercheResultats] = useState(false);
const [rechercheSaisie, setRechercheSaisie] = useState("");
const [rechercheFiltres, setRechercheFiltres] = useState({
  pays: [],
  villes: [],
  annees: [],
  analyseesSeulement: false,
});
const [rechercheEtat, setRechercheEtat] = useState("chargement");
const [rechercheVersionMoteur, setRechercheVersionMoteur] = useState(0);
// v80 — vue des résultats : tableau (par défaut) ou grille de miniatures.
const [rechercheVue, setRechercheVue] = useState("tableau");
const [rechercheNombreLignes, setRechercheNombreLignes] = useState(40);
const [rechercheNombreGrille, setRechercheNombreGrille] = useState(60);
const [photosGrilleRecherche, setPhotosGrilleRecherche] = useState([]);
const [rechercheMessage, setRechercheMessage] = useState("");
const [rechercheSaisieMot, setRechercheSaisieMot] = useState("");
const [rechercheMessageMot, setRechercheMessageMot] = useState("");
const [rechercheDossierMots, setRechercheDossierMots] = useState("");
const indexRechercheRef = useRef(null);
const moteurRechercheRef = useRef(null);
const signatureIndexRechercheRef = useRef("");
const motsAjoutesRechercheRef = useRef({});
const miseAJourRechercheEnCoursRef = useRef(false);
const miseAJourRechercheFaiteRef = useRef(false);
const resultatRechercheMemoRef = useRef({ cle: "", resultat: null });
const miniaturesRechercheRef = useRef(new Map());
const [modeRenommerAccueil, setModeRenommerAccueil] = useState(false);
const [messageMenuAccueil, setMessageMenuAccueil] = useState("");
const [cibleMessageMenuAccueil, setCibleMessageMenuAccueil] = useState("");
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
    // Les opérations d'analyse peuvent utiliser la racine active
    // (notamment en mode démonstration).
    return apiPhotoCartelLocale() ? dossierRacineAnalyseActif : "";
  }

  function dossierRacineMetierEnvoyeAuServeur() {
    // v40.12 : les opérations métier de visite (collecte et rangement)
    // ne doivent jamais hériter de la racine d'analyse ou du mode démonstration.
    // En local, elles visent exclusivement la racine officielle PhotoCartel.
    if (!apiPhotoCartelLocale()) {
      return "";
    }

    const racineLocale = String(dossierRacine || "").trim();
    return racineLocale || "C:\\PhotoCartel";
  }

  function dossierRacineGalerieEnvoyeAuServeur() {
    // v35.3 : la Galerie des photos analysées est permanente.
    // En local PC, elle lit toujours la racine officielle PhotoCartel
    // et ne doit jamais basculer vers le dossier du mode démonstration.
    if (!apiPhotoCartelLocale()) {
      return "";
    }

    const racineLocale = String(dossierRacine || "").trim();
    return racineLocale || "C:\\PhotoCartel";
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

      const photosCandidates = Number(resultat.photosCandidates || 0);
      // v45.7.3 : une visite sans photo candidate ne doit jamais changer d’état.
      // Cela évite le faux succès 0/0 qui excluait ensuite la visite des rangements futurs.
      if (photosCandidates === 0) return visite;

      const rangementValide =
        resultat.rangee === true &&
        photosCandidates > 0 &&
        Number(resultat.photosEchecs || 0) === 0 &&
        Number(resultat.photosRangees || resultat.deplaces || 0) === photosCandidates;
      return {
        ...visite,
        rangee: rangementValide,
        statutRangement: rangementValide ? "rangee" : "cloturee",
        photosRangees: Number(resultat.photosRangees || resultat.deplaces || 0),
        photosEchecs: Number(resultat.photosEchecs || 0),
        dateRangementMs: rangementValide ? maintenant : visite.dateRangementMs || null,
      };
    });

    ecrireHistoriqueVisitesRangement(prochainHistorique);
  }

  function visiteRapideSelonIdentite(visite = {}) {
    const stockageVille = String(
      visite.stockageVille || visite.dossierVilleStockage || ""
    ).trim();
    if (stockageVille) return stockageVille === "Visites rapides";
    return !String(visite.type || "").trim();
  }

  function resoudreVisitePhysiqueCourantePourModification(visite = {}) {
    const idCible = String(visite.idPhysique || visite.id || "").trim();
    const cheminCible = String(visite.chemin || "").replace(/\\/g, "/").toLowerCase();
    const cleCible = clePhysiqueVisite(visite);

    const trouvee = visitesPhysiques.find((candidate) => {
      const idCandidate = String(candidate.idPhysique || candidate.id || "").trim();
      const cheminCandidate = String(candidate.chemin || "").replace(/\\/g, "/").toLowerCase();
      return (
        (idCible && idCandidate === idCible) ||
        (cheminCible && cheminCandidate === cheminCible) ||
        (cleCible && clePhysiqueVisite(candidate) === cleCible)
      );
    });

    if (!trouvee) return visite;

    // Les données physiques (chemin, id, stockageVille, segments Android) doivent
    // toujours primer sur d'anciennes métadonnées locales.
    return {
      ...visite,
      ...trouvee,
      type: String(visite.type || trouvee.type || "").trim(),
      debutMs: visite.debutMs || trouvee.debutMs || null,
      finMs: visite.finMs || trouvee.finMs || null,
      nombrePhotos: Number(
        trouvee.nombrePhotos ??
        visite.nombrePhotos ??
        visite.photosRangees ??
        visite.nombrePhotosDeclare ??
        0
      ),
    };
  }

  function ouvrirModificationIdentiteVisite(visite = null, source = "resume") {
    // v42.0.16 : la modification est de nouveau disponible sur PWA Android.
    // L’écriture physique n’est engagée qu’au clic sur « Enregistrer » et passe
    // alors par modifierIdentiteVisiteAndroidTransactionnelle().
    const cibleInitiale = visite || {
      id: null,
      voyage,
      ville: villeVisite || "Ville non renseignée",
      nom: lieuVisite,
      type: typeVisite || "",
      chemin: cheminTamponActif || visiteActive?.chemin || "",
      debutMs: Number(localStorage.getItem("photoCartelDebutVisiteMs") || 0),
      source,
      estActive: true,
    };
    const cible = resoudreVisitePhysiqueCourantePourModification(cibleInitiale);

    if (!cible?.nom || !cible?.voyage) {
      alert("Aucune visite à modifier.");
      return;
    }

    const estRapide = visiteRapideSelonIdentite(cible);
    setVisiteEnModification({ ...cible, source, estActive: source === "active" });
    setNomVisiteModifie(String(cible.nom || ""));
    setVilleVisiteModifiee(
      estRapide || cible.ville === "Visites rapides"
        ? "Ville non renseignée"
        : String(cible.ville || "")
    );
    setTypeVisiteModifie(estRapide ? "" : String(cible.type || ""));
    setListeTypesModificationOuverte(false);
    setMessageModificationVisite("");
    setModeModificationIdentiteVisite(true);
  }

  function fermerModificationIdentiteVisite() {
    if (modificationVisiteEnCours) return;
    setModeModificationIdentiteVisite(false);
    setVisiteEnModification(null);
    setListeTypesModificationOuverte(false);
    setMessageModificationVisite("");
  }

  function remplacerNomDansNomFichier(nomFichier, ancienNom, nouveauNom) {
    const ancien = String(ancienNom || "").replace(/[^a-zA-Z0-9À-ÿ_-]+/g, "_");
    const nouveau = String(nouveauNom || "").replace(/[^a-zA-Z0-9À-ÿ_-]+/g, "_");
    if (!ancien || ancien === nouveau) return nomFichier;
    return String(nomFichier || "").split(ancien).join(nouveau);
  }

  async function lireEntreeAndroid(parent, nomRecherche) {
    for await (const [nom, handle] of parent.entries()) {
      if (nom === nomRecherche) return handle;
    }
    return null;
  }

  function estErreurTypeEntreeAndroid(error) {
    const nom = String(error?.name || "");
    const message = String(error?.message || "").toLowerCase();
    return (
      nom === "TypeMismatchError" ||
      message.includes("not an entry of requested type") ||
      message.includes("entry of requested type") ||
      message.includes("n’est pas une entrée du type demandé")
    );
  }

  async function creerSousDossierAndroidExact(parent, nomSouhaite) {
    const existante = await lireEntreeAndroid(parent, nomSouhaite);
    if (existante) {
      throw new Error(`L’entrée « ${nomSouhaite} » existe déjà.`);
    }
    const dossier = await parent.getDirectoryHandle(nomSouhaite, { create: true });
    if (dossier?.kind !== "directory") {
      throw new Error(`Création incohérente du dossier « ${nomSouhaite} ».`);
    }
    return dossier;
  }

  async function obtenirOuCreerSousDossierAndroid(parent, nomSouhaite) {
    const existante = await lireEntreeAndroid(parent, nomSouhaite);
    if (existante) {
      if (existante.kind !== "directory") {
        throw new Error(`L’entrée « ${nomSouhaite} » existe mais n’est pas un dossier.`);
      }
      return existante;
    }
    return parent.getDirectoryHandle(nomSouhaite, { create: true });
  }

  async function creerFichierAndroidExact(parent, nomSouhaite) {
    const existante = await lireEntreeAndroid(parent, nomSouhaite);
    if (existante) {
      throw new Error(`L’entrée « ${nomSouhaite} » existe déjà.`);
    }
    const fichier = await parent.getFileHandle(nomSouhaite, { create: true });
    if (fichier?.kind !== "file") {
      throw new Error(`Création incohérente du fichier « ${nomSouhaite} ».`);
    }
    return fichier;
  }

  function transformerNomEntreeAndroid(nom, ancienNom, nouveauNom) {
    return remplacerNomDansNomFichier(nom, ancienNom, nouveauNom);
  }

  async function copierDossierAndroidExact(
    source,
    destination,
    ancienNom = "",
    nouveauNom = ""
  ) {
    const nomsCibles = new Set();
    const entrees = [];
    for await (const [nom, handle] of source.entries()) {
      entrees.push([nom, handle]);
    }
    entrees.sort((a, b) => String(a[0]).localeCompare(String(b[0]), "fr"));

    for (const [nom, handle] of entrees) {
      const nomCible = transformerNomEntreeAndroid(nom, ancienNom, nouveauNom);
      if (!nomCible) throw new Error("Une entrée possède un nom cible vide.");
      if (nomsCibles.has(nomCible)) {
        throw new Error(
          `Deux entrées convergent vers le même nom « ${nomCible} ». L’opération est interrompue.`
        );
      }
      nomsCibles.add(nomCible);

      if (await lireEntreeAndroid(destination, nomCible)) {
        throw new Error(
          `La destination contient déjà « ${nomCible} ». Aucun nom alternatif n’est créé.`
        );
      }

      if (handle.kind === "directory") {
        const sousDossier = await creerSousDossierAndroidExact(destination, nomCible);
        await copierDossierAndroidExact(
          handle,
          sousDossier,
          ancienNom,
          nouveauNom
        );
        continue;
      }

      if (handle.kind !== "file") {
        throw new Error(`Type d’entrée Android inconnu pour « ${nom} ».`);
      }

      const fichier = await handle.getFile();
      const cible = await creerFichierAndroidExact(destination, nomCible);
      const writable = await cible.createWritable();
      try {
        await writable.write(fichier);
      } finally {
        await writable.close();
      }
    }
  }

  async function restaurerDossierAndroidDepuisSauvegarde(
    sauvegarde,
    destination,
    ancienNomSauvegarde = "",
    nouveauNomDestination = ""
  ) {
    const entrees = [];
    for await (const [nom, handle] of sauvegarde.entries()) {
      entrees.push([nom, handle]);
    }
    entrees.sort((a, b) => String(a[0]).localeCompare(String(b[0]), "fr"));

    for (const [nom, handle] of entrees) {
      const nomCible = transformerNomEntreeAndroid(
        nom,
        ancienNomSauvegarde,
        nouveauNomDestination
      );
      const existante = await lireEntreeAndroid(destination, nomCible);

      if (handle.kind === "directory") {
        let dossierCible = existante;
        if (dossierCible && dossierCible.kind !== "directory") {
          throw new Error(`Restauration impossible : « ${nomCible} » n’est pas un dossier.`);
        }
        if (!dossierCible) {
          dossierCible = await creerSousDossierAndroidExact(destination, nomCible);
        }
        await restaurerDossierAndroidDepuisSauvegarde(
          handle,
          dossierCible,
          ancienNomSauvegarde,
          nouveauNomDestination
        );
        continue;
      }

      if (handle.kind !== "file") {
        throw new Error(`Type inconnu pendant la restauration de « ${nomCible} ».`);
      }

      const fichierSauvegarde = await handle.getFile();
      if (existante) {
        if (existante.kind !== "file") {
          throw new Error(`Restauration impossible : « ${nomCible} » n’est pas un fichier.`);
        }
        const fichierExistant = await existante.getFile();
        if (fichierExistant.size !== fichierSauvegarde.size) {
          throw new Error(`Restauration impossible : taille différente pour « ${nomCible} ».`);
        }
        const [hashExistant, hashSauvegarde] = await Promise.all([
          empreinteSha256BlobAndroid(fichierExistant),
          empreinteSha256BlobAndroid(fichierSauvegarde),
        ]);
        if (hashExistant !== hashSauvegarde) {
          throw new Error(`Restauration impossible : contenu différent pour « ${nomCible} ».`);
        }
        continue;
      }

      const cible = await creerFichierAndroidExact(destination, nomCible);
      const writable = await cible.createWritable();
      try {
        await writable.write(fichierSauvegarde);
      } finally {
        await writable.close();
      }
    }
  }

  async function inventorierDossierAndroidVerifie(
    dossier,
    ancienNom = "",
    nouveauNom = "",
    prefixe = "",
    inventaire = new Map()
  ) {
    const entrees = [];
    for await (const [nom, handle] of dossier.entries()) {
      entrees.push([nom, handle]);
    }
    entrees.sort((a, b) => String(a[0]).localeCompare(String(b[0]), "fr"));

    for (const [nom, handle] of entrees) {
      const nomCompare = transformerNomEntreeAndroid(nom, ancienNom, nouveauNom);
      const chemin = prefixe ? `${prefixe}/${nomCompare}` : nomCompare;
      if (inventaire.has(chemin)) {
        throw new Error(`Collision d’inventaire sur « ${chemin} ».`);
      }

      if (handle.kind === "directory") {
        inventaire.set(chemin, { kind: "directory" });
        await inventorierDossierAndroidVerifie(
          handle,
          ancienNom,
          nouveauNom,
          chemin,
          inventaire
        );
        continue;
      }

      if (handle.kind !== "file") {
        throw new Error(`Type d’entrée inconnu pour « ${chemin} ».`);
      }
      const fichier = await handle.getFile();
      inventaire.set(chemin, {
        kind: "file",
        size: Number(fichier.size || 0),
        hash: await empreinteSha256BlobAndroid(fichier),
      });
    }
    return inventaire;
  }

  function comparerInventairesAndroid(inventaireAttendu, inventaireReel, contexte) {
    if (inventaireAttendu.size !== inventaireReel.size) {
      throw new Error(
        `${contexte} : ${inventaireReel.size} entrée(s) au lieu de ${inventaireAttendu.size}.`
      );
    }
    for (const [chemin, attendu] of inventaireAttendu.entries()) {
      const reel = inventaireReel.get(chemin);
      if (!reel) throw new Error(`${contexte} : entrée manquante « ${chemin} ».`);
      if (attendu.kind !== reel.kind) {
        throw new Error(`${contexte} : type différent pour « ${chemin} ».`);
      }
      if (
        attendu.kind === "file" &&
        (attendu.size !== reel.size || attendu.hash !== reel.hash)
      ) {
        throw new Error(`${contexte} : fichier différent « ${chemin} ».`);
      }
    }
  }

  async function verifierDossiersAndroidIdentiques({
    source,
    destination,
    ancienNomSource = "",
    nouveauNomSource = "",
    contexte = "Vérification de copie",
  }) {
    const [attendu, reel] = await Promise.all([
      inventorierDossierAndroidVerifie(
        source,
        ancienNomSource,
        nouveauNomSource
      ),
      inventorierDossierAndroidVerifie(destination),
    ]);
    comparerInventairesAndroid(attendu, reel, contexte);
    return { nombreEntrees: reel.size };
  }

  async function testerSuppressionDossierVideAndroid(parent) {
    const nomTest = `.photocartel-test-suppression-${Date.now()}-${Math.random()
      .toString(16)
      .slice(2)}`;
    await creerSousDossierAndroidExact(parent, nomTest);
    try {
      await parent.removeEntry(nomTest);
    } catch (error) {
      throw new Error(
        "Chrome Android refuse la suppression d’un dossier vide dans cet emplacement. " +
          "La visite n’a pas été touchée : " +
          (error?.message || String(error))
      );
    }
    if (await lireEntreeAndroid(parent, nomTest)) {
      throw new Error(
        "Le test de suppression Android n’a pas réellement supprimé son dossier témoin."
      );
    }
  }

  async function trouverDossierVisiteAndroidDansVoyage(
    voyageHandle,
    nomVisite,
    villeStockagePreferee = "",
    ancienChemin = ""
  ) {
    const nomNettoye = nettoyerNomDossierLocal(nomVisite);
    const villesPreferees = [];
    const ajouterVillePreferee = (valeur) => {
      const nettoyee = nettoyerNomDossierLocal(valeur);
      if (nettoyee && !villesPreferees.includes(nettoyee)) villesPreferees.push(nettoyee);
    };

    // v40.6 : pour une visite rangée, le chemin exact mémorisé est la source la plus fiable.
    // On en extrait le dossier parent réel avant d'utiliser le stockageVille historique.
    const segmentsChemin = String(ancienChemin || "")
      .replace(/\\/g, "/")
      .split("/")
      .filter(Boolean);
    const indexVoyages = segmentsChemin.findIndex(
      (segment) => nettoyerNomDossierLocal(segment).toLowerCase() === DOSSIER_METIER_VOYAGES.toLowerCase()
    );
    if (indexVoyages >= 0 && segmentsChemin.length >= indexVoyages + 4) {
      ajouterVillePreferee(segmentsChemin[indexVoyages + 2]);
    } else if (segmentsChemin.length >= 2) {
      ajouterVillePreferee(segmentsChemin[segmentsChemin.length - 2]);
    }
    ajouterVillePreferee(villeStockagePreferee);

    for (const villePreferee of villesPreferees) {
      try {
        const parentPrefere = await voyageHandle.getDirectoryHandle(villePreferee, {
          create: false,
        });
        const dossierPrefere = await parentPrefere.getDirectoryHandle(nomNettoye, {
          create: false,
        });
        return {
          parent: parentPrefere,
          parentNom: villePreferee,
          dossier: dossierPrefere,
        };
      } catch (error) {
        if (
          error?.name !== "NotFoundError" &&
          !estErreurTypeEntreeAndroid(error)
        ) {
          throw error;
        }
      }
    }

    const correspondances = [];
    for await (const [nomParent, parentHandle] of voyageHandle.entries()) {
      if (parentHandle.kind !== "directory") continue;
      if (villesPreferees.includes(nettoyerNomDossierLocal(nomParent))) continue;
      try {
        const dossier = await parentHandle.getDirectoryHandle(nomNettoye, {
          create: false,
        });
        correspondances.push({
          parent: parentHandle,
          parentNom: nomParent,
          dossier,
        });
      } catch (error) {
        if (
          error?.name !== "NotFoundError" &&
          !estErreurTypeEntreeAndroid(error)
        ) {
          throw error;
        }
      }
    }

    if (correspondances.length === 0) {
      throw new Error(
        `Dossier de visite introuvable dans le voyage : ${nomVisite}`
      );
    }
    if (correspondances.length > 1) {
      throw new Error(
        `Plusieurs dossiers portent le nom « ${nomVisite} ». La modification est interrompue pour éviter toute ambiguïté.`
      );
    }
    return correspondances[0];
  }

  async function obtenirDossierAndroid(parent, nom, options = {}) {
    const nomNettoye = nettoyerNomDossierLocal(nom);
    try {
      return await parent.getDirectoryHandle(nomNettoye, options);
    } catch (error) {
      if (error?.name === "TypeMismatchError") {
        throw new Error(
          `L’entrée « ${nomNettoye} » existe mais n’est pas un dossier. La modification est interrompue sans toucher aux données.`
        );
      }
      throw error;
    }
  }


  function formaterOctetsAudit(valeur = 0) {
    const octets = Number(valeur || 0);
    if (octets < 1024) return `${octets} o`;
    if (octets < 1024 * 1024) return `${(octets / 1024).toFixed(1)} Ko`;
    if (octets < 1024 * 1024 * 1024) {
      return `${(octets / (1024 * 1024)).toFixed(1)} Mo`;
    }
    return `${(octets / (1024 * 1024 * 1024)).toFixed(2)} Go`;
  }

  function estNomTechniquePhotoCartel(nom = "") {
    const valeur = String(nom || "").toLowerCase();
    return (
      valeur.startsWith(".") ||
      valeur.includes("photocartel-") ||
      valeur.includes(".tmp") ||
      valeur.endsWith("_tmp") ||
      valeur.includes("temporaire")
    );
  }

  function signatureStructurelleVisiteAudit(fichiers = [], dossiers = []) {
    const lignes = [
      ...dossiers.map((item) => `D|${item.cheminRelatif}`),
      ...fichiers.map(
        (item) =>
          `F|${item.cheminRelatif}|${Number(item.taille || 0)}`
      ),
    ].sort();
    return lignes.join("\n");
  }

  async function inventorierDossierAuditAndroid(
    dossierHandle,
    cheminRelatif = "",
    resultat = { fichiers: [], dossiers: [], erreurs: [] }
  ) {
    const entrees = [];
    try {
      for await (const [nom, handle] of dossierHandle.entries()) {
        entrees.push([nom, handle]);
      }
    } catch (error) {
      resultat.erreurs.push({
        chemin: cheminRelatif || dossierHandle?.name || "dossier inconnu",
        erreur: error?.message || String(error),
      });
      return resultat;
    }

    entrees.sort((a, b) =>
      String(a[0]).localeCompare(String(b[0]), "fr", { sensitivity: "base" })
    );

    for (const [nom, handle] of entrees) {
      const cheminEntree = cheminRelatif ? `${cheminRelatif}/${nom}` : nom;

      if (handle.kind === "directory") {
        resultat.dossiers.push({
          nom,
          cheminRelatif: cheminEntree,
          technique: estNomTechniquePhotoCartel(nom),
        });
        await inventorierDossierAuditAndroid(handle, cheminEntree, resultat);
        continue;
      }

      if (handle.kind === "file") {
        try {
          const fichier = await handle.getFile();
          resultat.fichiers.push({
            nom,
            cheminRelatif: cheminEntree,
            taille: Number(fichier.size || 0),
            derniereModification: Number(fichier.lastModified || 0),
            typeMime: fichier.type || "",
            technique: estNomTechniquePhotoCartel(nom),
          });
        } catch (error) {
          resultat.erreurs.push({
            chemin: cheminEntree,
            erreur: error?.message || String(error),
          });
        }
        continue;
      }

      resultat.erreurs.push({
        chemin: cheminEntree,
        erreur: `Type d’entrée inconnu : ${handle.kind || "non renseigné"}`,
      });
    }

    return resultat;
  }

  async function auditerStockagePhotoCartelAndroid() {
    if (!estAndroid()) {
      setRapportAuditStockageAndroid(
        "L’audit v42.0.15 est destiné au stockage PWA Android DCIM/PhotoCartel."
      );
      return;
    }

    setAuditStockageAndroidEnCours(true);
    setRapportAuditStockageAndroid(
      "Audit non destructif en cours…\nAucun fichier n’est modifié."
    );

    try {
      const resultatRacine = await obtenirDossierRacinePhotoCartelAndroid({
        ouvrirSelecteurSiNecessaire: true,
        demanderPermissionSiNecessaire: true,
      });
      const racine = resultatRacine?.dossierPhotoCartel;
      if (!racine) throw new Error("Accès au dossier PhotoCartel impossible.");

      const voyages = await obtenirDossierAndroid(
        racine,
        DOSSIER_METIER_VOYAGES,
        { create: false }
      );

      const visites = [];
      const anomalies = [];
      const erreursGlobales = [];
      const nomsTechniques = [];

      const voyagesTrouves = [];
      for await (const [nomVoyage, handleVoyage] of voyages.entries()) {
        if (handleVoyage.kind !== "directory") {
          anomalies.push(
            `Entrée inattendue dans Voyages : « ${nomVoyage} » n’est pas un dossier.`
          );
          continue;
        }
        voyagesTrouves.push([nomVoyage, handleVoyage]);
      }
      voyagesTrouves.sort((a, b) => a[0].localeCompare(b[0], "fr"));

      for (const [nomVoyage, handleVoyage] of voyagesTrouves) {
        const villes = [];
        for await (const [nomVille, handleVille] of handleVoyage.entries()) {
          if (handleVille.kind !== "directory") {
            anomalies.push(
              `${nomVoyage} : « ${nomVille} » n’est pas un dossier de ville.`
            );
            continue;
          }
          villes.push([nomVille, handleVille]);
        }
        villes.sort((a, b) => a[0].localeCompare(b[0], "fr"));

        for (const [nomVille, handleVille] of villes) {
          const dossiersVisite = [];
          for await (const [nomVisite, handleVisite] of handleVille.entries()) {
            if (handleVisite.kind !== "directory") {
              anomalies.push(
                `${nomVoyage}/${nomVille} : « ${nomVisite} » n’est pas un dossier de visite.`
              );
              continue;
            }
            dossiersVisite.push([nomVisite, handleVisite]);
          }
          dossiersVisite.sort((a, b) => a[0].localeCompare(b[0], "fr"));

          for (const [nomVisite, handleVisite] of dossiersVisite) {
            const chemin = `${nomVoyage}/${nomVille}/${nomVisite}`;
            const inventaire = await inventorierDossierAuditAndroid(
              handleVisite
            );
            const tailleTotale = inventaire.fichiers.reduce(
              (somme, fichier) => somme + Number(fichier.taille || 0),
              0
            );
            const techniques = [
              ...(estNomTechniquePhotoCartel(nomVisite) ? [chemin] : []),
              ...inventaire.dossiers
                .filter((item) => item.technique)
                .map((item) => `${chemin}/${item.cheminRelatif}`),
              ...inventaire.fichiers
                .filter((item) => item.technique)
                .map((item) => `${chemin}/${item.cheminRelatif}`),
            ];
            nomsTechniques.push(...techniques);

            visites.push({
              voyage: nomVoyage,
              ville: nomVille,
              nom: nomVisite,
              chemin,
              nombreFichiers: inventaire.fichiers.length,
              nombreDossiers: inventaire.dossiers.length,
              tailleTotale,
              fichiers: inventaire.fichiers,
              dossiers: inventaire.dossiers,
              erreurs: inventaire.erreurs,
              signatureStructurelle: signatureStructurelleVisiteAudit(
                inventaire.fichiers,
                inventaire.dossiers
              ),
            });
            erreursGlobales.push(
              ...inventaire.erreurs.map((erreur) => ({
                ...erreur,
                visite: chemin,
              }))
            );
          }
        }
      }

      const vides = visites.filter(
        (visite) =>
          visite.nombreFichiers === 0 && visite.nombreDossiers === 0
      );

      const parNom = new Map();
      for (const visite of visites) {
        const cle = visite.nom.toLocaleLowerCase("fr");
        if (!parNom.has(cle)) parNom.set(cle, []);
        parNom.get(cle).push(visite);
      }
      const homonymes = Array.from(parNom.values()).filter(
        (groupe) => groupe.length > 1
      );

      const parSignature = new Map();
      for (const visite of visites) {
        const cle = `${visite.nombreFichiers}|${visite.nombreDossiers}|${visite.tailleTotale}|${visite.signatureStructurelle}`;
        if (!parSignature.has(cle)) parSignature.set(cle, []);
        parSignature.get(cle).push(visite);
      }
      const candidatsDoublons = Array.from(parSignature.values()).filter(
        (groupe) =>
          groupe.length > 1 &&
          groupe.some((visite) => visite.nombreFichiers > 0)
      );

      const maintenant = new Date();
      const lignes = [];
      lignes.push("PHOTOCARTEL — AUDIT NON DESTRUCTIF DU STOCKAGE ANDROID");
      lignes.push(`Version : ${VERSION_PHOTOCARTEL}`);
      lignes.push(`Date : ${maintenant.toLocaleString("fr-FR")}`);
      lignes.push("Racine inspectée : DCIM/PhotoCartel/Voyages");
      lignes.push("");
      lignes.push("IMPORTANT");
      lignes.push(
        "Cet audit n’a créé, renommé, déplacé ni supprimé aucun fichier ou dossier."
      );
      lignes.push(
        "Les « candidats doublons » sont détectés par arborescence, noms et tailles ; le contenu binaire des photos n’est pas modifié ni relu intégralement."
      );
      lignes.push("");
      lignes.push("SYNTHÈSE");
      lignes.push(`Voyages : ${voyagesTrouves.length}`);
      lignes.push(`Visites physiques : ${visites.length}`);
      lignes.push(`Dossiers de visite vides : ${vides.length}`);
      lignes.push(`Groupes de noms homonymes : ${homonymes.length}`);
      lignes.push(
        `Groupes candidats doublons structurels : ${candidatsDoublons.length}`
      );
      lignes.push(`Entrées techniques ou temporaires : ${nomsTechniques.length}`);
      lignes.push(`Erreurs de lecture : ${erreursGlobales.length}`);
      lignes.push("");

      lignes.push("INVENTAIRE DES VISITES");
      for (const visite of visites) {
        lignes.push(
          `- ${visite.chemin} | ${visite.nombreFichiers} fichier(s) | ` +
            `${visite.nombreDossiers} sous-dossier(s) | ${formaterOctetsAudit(
              visite.tailleTotale
            )}`
        );
      }

      lignes.push("");
      lignes.push("DOSSIERS DE VISITE VIDES");
      if (!vides.length) lignes.push("- Aucun");
      for (const visite of vides) lignes.push(`- ${visite.chemin}`);

      lignes.push("");
      lignes.push("NOMS DE VISITE PRÉSENTS À PLUSIEURS ENDROITS");
      if (!homonymes.length) lignes.push("- Aucun");
      for (const groupe of homonymes) {
        lignes.push(`- « ${groupe[0].nom} » :`);
        for (const visite of groupe) lignes.push(`    • ${visite.chemin}`);
      }

      lignes.push("");
      lignes.push("CANDIDATS DOUBLONS STRUCTURELS");
      if (!candidatsDoublons.length) lignes.push("- Aucun");
      for (const groupe of candidatsDoublons) {
        lignes.push(
          `- Groupe : ${groupe[0].nombreFichiers} fichier(s), ` +
            `${groupe[0].nombreDossiers} dossier(s), ` +
            `${formaterOctetsAudit(groupe[0].tailleTotale)}`
        );
        for (const visite of groupe) lignes.push(`    • ${visite.chemin}`);
      }

      lignes.push("");
      lignes.push("ENTRÉES TECHNIQUES OU TEMPORAIRES");
      if (!nomsTechniques.length) lignes.push("- Aucune");
      for (const chemin of nomsTechniques) lignes.push(`- ${chemin}`);

      lignes.push("");
      lignes.push("ERREURS DE LECTURE");
      if (!erreursGlobales.length) lignes.push("- Aucune");
      for (const erreur of erreursGlobales) {
        lignes.push(
          `- ${erreur.visite}/${erreur.chemin} : ${erreur.erreur}`
        );
      }

      lignes.push("");
      lignes.push("DÉTAIL DES FICHIERS PAR VISITE");
      for (const visite of visites) {
        lignes.push("");
        lignes.push(`[${visite.chemin}]`);
        if (!visite.fichiers.length) {
          lignes.push("  (aucun fichier)");
        } else {
          for (const fichier of visite.fichiers) {
            lignes.push(
              `  F ${fichier.cheminRelatif} | ${formaterOctetsAudit(
                fichier.taille
              )}`
            );
          }
        }
        for (const dossier of visite.dossiers) {
          lignes.push(`  D ${dossier.cheminRelatif}`);
        }
      }

      const rapport = lignes.join("\n");
      setRapportAuditStockageAndroid(rapport);
      setDateAuditStockageAndroid(maintenant.toISOString());
    } catch (error) {
      setRapportAuditStockageAndroid(
        "ÉCHEC DE L’AUDIT NON DESTRUCTIF\n\n" +
          (error?.message || String(error))
      );
    } finally {
      setAuditStockageAndroidEnCours(false);
    }
  }

  function exporterRapportAuditStockageAndroid() {
    const contenu = String(rapportAuditStockageAndroid || "").trim();
    if (!contenu) {
      alert("Aucun rapport d’audit à exporter.");
      return;
    }

    const date =
      (dateAuditStockageAndroid
        ? new Date(dateAuditStockageAndroid)
        : new Date()
      )
        .toISOString()
        .replace(/[:.]/g, "-");
    const blob = new Blob([contenu], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const lien = document.createElement("a");
    lien.href = url;
    lien.download = `PhotoCartel_audit_stockage_${date}.txt`;
    document.body.appendChild(lien);
    lien.click();
    lien.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function supprimerEntreeAndroidRecursiveFiable(parent, nomEntree) {
    // v42.0.14 : Chrome Android peut échouer sur removeEntry(..., { recursive: true })
    // avec TypeMismatchError alors que le dossier existe réellement.
    // On parcourt donc nous-mêmes chaque entrée selon son type, puis on supprime
    // le dossier devenu vide sans demander de suppression récursive au navigateur.
    const entree = await lireEntreeAndroid(parent, nomEntree);
    if (!entree) return;

    if (entree.kind === "file") {
      await parent.removeEntry(nomEntree);
      return;
    }

    if (entree.kind !== "directory") {
      throw new Error(`Type d’entrée Android inconnu pour « ${nomEntree} ».`);
    }

    const enfants = [];
    for await (const [nomEnfant] of entree.entries()) {
      enfants.push(nomEnfant);
    }
    for (const nomEnfant of enfants) {
      await supprimerEntreeAndroidRecursiveFiable(entree, nomEnfant);
    }

    // Le dossier est maintenant vide : pas de { recursive: true }.
    await parent.removeEntry(nomEntree);
  }

  async function modifierIdentiteVisiteAndroid(payload) {
    const resultatRacine = await obtenirDossierRacinePhotoCartelAndroid({
      ouvrirSelecteurSiNecessaire: true,
      demanderPermissionSiNecessaire: true,
    });
    const racine = resultatRacine?.dossierPhotoCartel;
    if (!racine) throw new Error("Accès au dossier PhotoCartel impossible.");

    const voyages = await obtenirDossierAndroid(racine, DOSSIER_METIER_VOYAGES, {
      create: false,
    });
    const voyageHandle = await obtenirDossierAndroid(voyages, payload.voyage, {
      create: false,
    });
    const ancienneVilleStockage =
      payload.ancienStockageVille ||
      (payload.ancienneVisiteRapide ? "Visites rapides" : payload.ancienneVille);
    const nouvelleVilleStockage = payload.nouvelleVisiteRapide
      ? "Visites rapides"
      : payload.nouvelleVille;
    const ancienNomNettoye = nettoyerNomDossierLocal(payload.ancienNom);
    const nouveauNomNettoye = nettoyerNomDossierLocal(payload.nouveauNom);

    let sourceTrouvee;
    try {
      sourceTrouvee = await trouverDossierVisiteAndroidDansVoyage(
        voyageHandle,
        payload.ancienNom,
        ancienneVilleStockage,
        payload.ancienChemin
      );
    } catch (error) {
      throw new Error(
        "Localisation de la visite impossible : " +
          (error?.message || String(error))
      );
    }

    const ancienParent = sourceTrouvee.parent;
    const ancienDossier = sourceTrouvee.dossier;
    const ancienneVilleReelle = sourceTrouvee.parentNom;
    const nouveauParent = await obtenirDossierAndroid(
      voyageHandle,
      nouvelleVilleStockage,
      { create: true }
    );

    const memeParent =
      nettoyerNomDossierLocal(ancienneVilleReelle) ===
      nettoyerNomDossierLocal(nouvelleVilleStockage);
    const memeNom = ancienNomNettoye === nouveauNomNettoye;

    if (memeParent && memeNom) {
      for (const categorie of categoriesPourTypeVisiteLocale(payload.nouveauType)) {
        await obtenirOuCreerSousDossierAndroid(ancienDossier, categorie);
      }
      return {
        success: true,
        chemin: `${payload.voyage}\\${nouvelleVilleStockage}\\${payload.nouveauNom}`,
        stockageVille: nouvelleVilleStockage,
      };
    }

    if (await lireEntreeAndroid(nouveauParent, nouveauNomNettoye)) {
      throw new Error("Une visite porte déjà ce nom dans cette ville.");
    }

    // Test préalable : aucune donnée métier n’est touchée si Android ne sait pas
    // supprimer un simple dossier vide dans le parent de la visite source.
    await testerSuppressionDossierVideAndroid(ancienParent);

    // Les sauvegardes de transaction vivent hors de Voyages. Même si Android
    // empêche leur nettoyage, elles ne peuvent jamais être recensées comme visites.
    const parametres = await obtenirOuCreerSousDossierAndroid(racine, "Paramètres");
    const transactions = await obtenirOuCreerSousDossierAndroid(
      parametres,
      "Transactions"
    );
    const nomTransaction = `.photocartel-v42-0-16-${Date.now()}-${Math.random()
      .toString(16)
      .slice(2)}.tmp`;
    const sauvegarde = await creerSousDossierAndroidExact(
      transactions,
      nomTransaction
    );

    let sourceSupprimee = false;
    let destinationCreee = false;
    let avertissement = "";

    try {
      await copierDossierAndroidExact(
        ancienDossier,
        sauvegarde,
        payload.ancienNom,
        payload.nouveauNom
      );
      await verifierDossiersAndroidIdentiques({
        source: ancienDossier,
        destination: sauvegarde,
        ancienNomSource: payload.ancienNom,
        nouveauNomSource: payload.nouveauNom,
        contexte: "Vérification de la sauvegarde transactionnelle",
      });

      for (const categorie of categoriesPourTypeVisiteLocale(payload.nouveauType)) {
        await obtenirOuCreerSousDossierAndroid(sauvegarde, categorie);
      }

      try {
        await supprimerEntreeAndroidRecursiveFiable(
          ancienParent,
          ancienNomNettoye
        );
      } catch (error) {
        // Si Chrome a vidé le dossier avant d’échouer sur sa suppression finale,
        // on restaure immédiatement son contenu depuis la sauvegarde vérifiée.
        let sourceRestante = await lireEntreeAndroid(
          ancienParent,
          ancienNomNettoye
        );
        if (!sourceRestante) {
          sourceRestante = await creerSousDossierAndroidExact(
            ancienParent,
            ancienNomNettoye
          );
        }
        if (sourceRestante.kind !== "directory") {
          throw new Error("La source partiellement supprimée n’est plus un dossier.");
        }
        await restaurerDossierAndroidDepuisSauvegarde(
          sauvegarde,
          sourceRestante,
          payload.nouveauNom,
          payload.ancienNom
        );
        await verifierDossiersAndroidIdentiques({
          source: sauvegarde,
          destination: sourceRestante,
          ancienNomSource: payload.nouveauNom,
          nouveauNomSource: payload.ancienNom,
          contexte: "Vérification de la restauration après échec de suppression",
        });
        throw new Error(
          "Suppression de l’ancienne visite impossible. La destination n’a pas été publiée et la sauvegarde transactionnelle a été conservée : " +
            (error?.message || String(error))
        );
      }

      sourceSupprimee = !(await lireEntreeAndroid(ancienParent, ancienNomNettoye));
      if (!sourceSupprimee) {
        throw new Error("L’ancienne visite existe encore après sa suppression.");
      }

      const destination = await creerSousDossierAndroidExact(
        nouveauParent,
        nouveauNomNettoye
      );
      destinationCreee = true;
      await copierDossierAndroidExact(sauvegarde, destination);
      await verifierDossiersAndroidIdentiques({
        source: sauvegarde,
        destination,
        contexte: "Vérification de la destination définitive",
      });

      try {
        await supprimerEntreeAndroidRecursiveFiable(
          transactions,
          nomTransaction
        );
      } catch (error) {
        avertissement =
          "La visite est correctement modifiée, mais une sauvegarde technique reste dans PhotoCartel/Paramètres/Transactions.";
        console.warn(avertissement, error);
      }

      return {
        success: true,
        chemin: `${payload.voyage}\\${nouvelleVilleStockage}\\${payload.nouveauNom}`,
        stockageVille: nouvelleVilleStockage,
        avertissement,
      };
    } catch (error) {
      // Si la source a déjà disparu mais que la publication a échoué, priorité
      // absolue à la restauration de l’identité physique précédente.
      if (sourceSupprimee) {
        try {
          if (destinationCreee) {
            const destinationPartielle = await lireEntreeAndroid(
              nouveauParent,
              nouveauNomNettoye
            );
            if (destinationPartielle?.kind === "directory") {
              await supprimerEntreeAndroidRecursiveFiable(
                nouveauParent,
                nouveauNomNettoye
              );
            }
          }

          let sourceRestauree = await lireEntreeAndroid(
            ancienParent,
            ancienNomNettoye
          );
          if (!sourceRestauree) {
            sourceRestauree = await creerSousDossierAndroidExact(
              ancienParent,
              ancienNomNettoye
            );
          }
          if (sourceRestauree.kind !== "directory") {
            throw new Error("La source à restaurer n’est pas un dossier.");
          }
          await restaurerDossierAndroidDepuisSauvegarde(
            sauvegarde,
            sourceRestauree,
            payload.nouveauNom,
            payload.ancienNom
          );
          await verifierDossiersAndroidIdentiques({
            source: sauvegarde,
            destination: sourceRestauree,
            ancienNomSource: payload.nouveauNom,
            nouveauNomSource: payload.ancienNom,
            contexte: "Vérification de la restauration de la source",
          });
        } catch (restaurationError) {
          throw new Error(
            (error?.message || String(error)) +
              " La restauration automatique a également échoué. La sauvegarde complète reste disponible dans PhotoCartel/Paramètres/Transactions/" +
              nomTransaction +
              " : " +
              (restaurationError?.message || String(restaurationError))
          );
        }
      }

      // Avant suppression de la source, une erreur ne doit laisser aucun dossier
      // destination visible. La sauvegarde hors Voyages est conservée seulement si
      // son nettoyage échoue.
      if (!sourceSupprimee) {
        try {
          const destinationEventuelle = await lireEntreeAndroid(
            nouveauParent,
            nouveauNomNettoye
          );
          if (destinationEventuelle?.kind === "directory") {
            await supprimerEntreeAndroidRecursiveFiable(
              nouveauParent,
              nouveauNomNettoye
            );
          }
        } catch (nettoyageError) {
          console.warn("Nettoyage destination Android impossible :", nettoyageError);
        }
      }
      throw error;
    }
  }

  function categoriesPourTypeVisiteLocale(type) {
    if (type === "Musée") return ["Oeuvres", "Cartels", "Jardins", "Architecture", "Batiments", "Structures", "A_verifier_classification"];
    if (type === "Église") return ["Facade", "Nef", "A_verifier_classification"];
    if (["Transport", "Site naturel", "Ville / Village", "Jardin / Parc", "Architecture", "Château", "Restaurant / Repas"].includes(type)) return [];
    return type && type !== "Autre" ? ["A_verifier_classification"] : [];
  }

  async function enregistrerModificationIdentiteVisite() {
    const nom = String(nomVisiteModifie || "").trim();
    const ville = String(villeVisiteModifiee || "").trim();
    const typeAffiche = String(typeVisiteModifie || "").trim();
    if (!nom || !ville || !typeAffiche) {
      setMessageModificationVisite("Les trois champs sont obligatoires.");
      return;
    }

    const ancienneDemandee = visiteEnModification;
    if (!ancienneDemandee) return;
    const ancienne = resoudreVisitePhysiqueCourantePourModification(ancienneDemandee);
    const ancienRapide = visiteRapideSelonIdentite(ancienne);
    const nouveauType = typeAffiche;
    const nouveauRapide = false;

    if (ancienRapide && ville === "Ville non renseignée") {
      setMessageModificationVisite(
        "Pour transformer cette visite rapide, renseigne une ville réelle."
      );
      return;
    }
    const payload = {
      voyage: ancienne.voyage || voyage,
      ancienNom: ancienne.nom,
      ancienneVille: ancienne.ville === "Visites rapides" ? "Ville non renseignée" : ancienne.ville,
      ancienType: ancienne.type || "",
      ancienneVisiteRapide: ancienRapide,
      ancienChemin: ancienne.chemin || "",
      ancienIdPhysique: ancienne.idPhysique || ancienne.id || "",
      ancienStockageVille:
        ancienne.stockageVille ||
        ancienne.dossierVilleStockage ||
        (ancienRapide ? "Visites rapides" : ancienne.ville),
      nouveauNom: nom,
      nouvelleVille: ville,
      nouveauType,
      nouvelleVisiteRapide: nouveauRapide,
    };

    try {
      setModificationVisiteEnCours(true);
      setMessageModificationVisite("Enregistrement des modifications…");
      let resultat;
      if (estAndroid()) {
        resultat = await modifierIdentiteVisiteAndroid(payload);
      } else {
        resultat = await appelerModificationIdentiteVisite(payload);
      }

      const historique = lireHistoriqueVisitesRangement();
      let correspondanceTrouvee = false;
      const historiqueMaj = historique.map((v) => {
        const correspond =
          (ancienne.id && v.id === ancienne.id) ||
          clePhysiqueVisite(v) === clePhysiqueVisite(ancienne);
        if (!correspond) return v;
        correspondanceTrouvee = true;
        return {
          ...v,
          nom,
          ville,
          type: nouveauType,
          chemin: resultat.chemin || v.chemin,
          stockageVille:
            resultat.stockageVille ||
            resultat.dossierVilleStockage ||
            (nouveauRapide ? "Visites rapides" : ville),
          statut: v.statut || ancienne.statut || "Importée",
        };
      });
      if (!correspondanceTrouvee) {
        historiqueMaj.push({
          ...ancienne,
          id: ancienne.id || ancienne.idPhysique || clePhysiqueVisite(ancienne),
          nom,
          ville,
          type: nouveauType,
          chemin: resultat.chemin || ancienne.chemin,
          stockageVille:
            resultat.stockageVille ||
            resultat.dossierVilleStockage ||
            (nouveauRapide ? "Visites rapides" : ville),
          statut: ancienne.statut || "Importée",
          nombrePhotosDeclare: Number(ancienne.nombrePhotos || ancienne.nombrePhotosDeclare || 0),
        });
      }
      ecrireHistoriqueVisitesRangement(historiqueMaj);
      const visiteMaj =
        historiqueMaj.find((v) =>
          (ancienne.id && v.id === ancienne.id) ||
          (v.nom === nom && v.voyage === (ancienne.voyage || voyage))
        ) || {
          ...ancienne,
          nom,
          ville,
          type: nouveauType,
          chemin: resultat.chemin || ancienne.chemin,
          stockageVille:
            resultat.stockageVille ||
            resultat.dossierVilleStockage ||
            (nouveauRapide ? "Visites rapides" : ville),
        };

      if (resultat?.avertissement) {
        console.warn(resultat.avertissement);
      }

      if (ancienne.estActive) {
        setLieuVisite(nom); setVilleVisite(ville); setTypeVisite(nouveauType);
        localStorage.setItem("photoCartelLieuActif", nom);
        localStorage.setItem("photoCartelVilleActive", ville);
        localStorage.setItem("photoCartelTypeVisiteActif", nouveauType);
        setVisiteActive((courante) =>
          courante
            ? {
                ...courante,
                nom,
                ville,
                type: nouveauType,
                chemin: resultat.chemin || courante.chemin,
                stockageVille:
                  resultat.stockageVille ||
                  resultat.dossierVilleStockage ||
                  (nouveauRapide ? "Visites rapides" : ville),
              }
            : courante
        );
      }
      if (visiteResumeSelectionnee && (visiteResumeSelectionnee.id === ancienne.id || visiteResumeSelectionnee.nom === ancienne.nom)) {
        setVisiteResumeSelectionnee(visiteMaj);
      }
      setDerniereVisite((courante) => courante && (courante.id === ancienne.id || courante.nom === ancienne.nom) ? visiteMaj : courante);
      localStorage.setItem("photoCartelDerniereVisite", JSON.stringify(visiteMaj));
      setModeModificationIdentiteVisite(false);
      setVisiteEnModification(null);
      setMessageModificationVisite("");
      setDerniereActionVisite("✅ Identité de la visite modifiée.");
      await actualiserVisitesPhysiques({ autoriserSelection: false });
    } catch (error) {
      console.error(error);
      setMessageModificationVisite("⚠️ " + error.message);
    } finally {
      setModificationVisiteEnCours(false);
    }
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

  function attendrePhotoCartel(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function creerInstantaneFichierAndroid(fichierSource) {
    // Certains fournisseurs SAF rendent le File source instable après une écriture
    // dans un autre dossier. On fige donc son contenu AVANT toute création de cible.
    const buffer = await fichierSource.arrayBuffer();
    const octets = new Uint8Array(buffer.slice(0));
    return {
      octets,
      taille: octets.byteLength,
      type: fichierSource.type || "application/octet-stream",
      blob: new Blob([octets], {
        type: fichierSource.type || "application/octet-stream",
      }),
    };
  }

  async function comparerFichierAvecOctetsAndroid(fichierDestination, octetsAttendus) {
    if (fichierDestination.size !== octetsAttendus.byteLength) return false;

    const TAILLE_BLOC = 1024 * 1024;
    for (let debut = 0; debut < octetsAttendus.byteLength; debut += TAILLE_BLOC) {
      const fin = Math.min(octetsAttendus.byteLength, debut + TAILLE_BLOC);
      const destination = new Uint8Array(
        await fichierDestination.slice(debut, fin).arrayBuffer()
      );
      const longueur = fin - debut;
      if (destination.length !== longueur) return false;
      for (let index = 0; index < longueur; index += 1) {
        if (destination[index] !== octetsAttendus[debut + index]) return false;
      }
    }
    return true;
  }

  async function ecrireInstantaneDansDossierAndroid(
    dossierDestination,
    nomDestination,
    instantane
  ) {
    const cible = await dossierDestination.getFileHandle(nomDestination, {
      create: true,
    });
    const writable = await cible.createWritable({ keepExistingData: false });
    let fermetureReussie = false;
    try {
      await writable.write(instantane.blob);
      await writable.close();
      fermetureReussie = true;
    } finally {
      if (!fermetureReussie && typeof writable.abort === "function") {
        try {
          await writable.abort();
        } catch (abortError) {
          console.warn(
            "Annulation de la copie Android impossible :",
            nomDestination,
            abortError
          );
        }
      }
    }
  }

  async function verifierCopieAndroid({
    dossierDestination,
    nomDestination,
    instantaneSource,
  }) {
    // Après close(), Android/SAF peut publier le fichier avec un léger retard.
    // Chaque tentative relit un nouveau File depuis le handle destination.
    let derniereErreur = null;
    const delais = [0, 80, 180, 350, 700, 1200];

    for (const delai of delais) {
      if (delai) await attendrePhotoCartel(delai);
      try {
        const destinationHandle = await dossierDestination.getFileHandle(
          nomDestination,
          { create: false }
        );
        const fichierDestination = await destinationHandle.getFile();

        if (fichierDestination.size !== instantaneSource.taille) {
          throw new Error(
            `Copie incomplète : ${fichierDestination.size} octet(s) au lieu de ${instantaneSource.taille}.`
          );
        }

        const identiques = await comparerFichierAvecOctetsAndroid(
          fichierDestination,
          instantaneSource.octets
        );
        if (!identiques) {
          throw new Error("La copie relue diffère du fichier source mémorisé.");
        }

        return {
          taille: fichierDestination.size,
          methodeVerification: "comparaison-octets-instantane",
        };
      } catch (error) {
        derniereErreur = error;
      }
    }

    throw derniereErreur || new Error("La copie destination n’a pas pu être vérifiée.");
  }

  async function rangerPhotosVisitesAndroid(visitesAtraiter) {
    // v40.12 : aucun fichier source n'est supprimé avant une vérification complète
    // de la taille et de l'empreinte SHA-256 de la copie destination.
    const resultatRacineAndroid = await obtenirDossierRacinePhotoCartelAndroid();
    const dossierPhotoCartel = resultatRacineAndroid.dossierPhotoCartel;

    await verifierInfrastructureDansPhotoCartelAndroid(dossierPhotoCartel);

    const dossierCollecte = await dossierPhotoCartel.getDirectoryHandle("Collecte Photo en cours", { create: true });
    const statsParVisite = new Map(
      visitesAtraiter.map((visite) => [
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
        photosEchecs += 1;
        resultats.push({ fichier: nomFichier, success: false, raison: "Aucune visite correspondante" });
        continue;
      }

      const stat = statsParVisite.get(visite.id);
      if (stat) stat.photosCandidates += 1;
      fichiersACopier.push({ nomFichier, visite });
    }

    for (const item of fichiersACopier) {
      const { nomFichier, visite } = item;
      const stat = statsParVisite.get(visite.id);
      let dossierDestination = null;
      let nomDestination = "";
      let copieValidee = false;

      try {
        const fichierHandle = await dossierCollecte.getFileHandle(nomFichier, { create: false });
        const fichier = await fichierHandle.getFile();
        const instantaneSource = await creerInstantaneFichierAndroid(fichier);
        dossierDestination = await obtenirDossierVisiteAndroid(dossierPhotoCartel, visite);
        nomDestination = await obtenirNomUniqueAndroid(dossierDestination, nomFichier);

        await ecrireInstantaneDansDossierAndroid(
          dossierDestination,
          nomDestination,
          instantaneSource
        );
        const verification = await verifierCopieAndroid({
          dossierDestination,
          nomDestination,
          instantaneSource,
        });
        copieValidee = true;

        // Suppression seulement après validation de la copie relue depuis le disque.
        await dossierCollecte.removeEntry(nomFichier);

        // v40.12 : certains fournisseurs de stockage Android renvoient une erreur
        // TypeMismatchError après une suppression pourtant réussie. Cette erreur ne doit
        // pas transformer un rangement réellement réussi en faux échec. On contrôle donc
        // l'absence de la source en parcourant la collecte, sans redemander un FileHandle.
        let sourceEncorePresente = false;
        for await (const [nomEntree] of dossierCollecte.entries()) {
          if (nomEntree === nomFichier) {
            sourceEncorePresente = true;
            break;
          }
        }
        if (sourceEncorePresente) {
          throw new Error("Le fichier source est encore présent après suppression.");
        }

        // Dernier contrôle après suppression : la destination doit toujours être lisible.
        await verifierCopieAndroid({
          dossierDestination,
          nomDestination,
          instantaneSource,
        });

        photosRangees += 1;
        if (stat) stat.photosRangees += 1;

        resultats.push({
          fichier: nomFichier,
          fichierDestination: nomDestination,
          visiteId: visite.id,
          visiteNom: visite.nom,
          taille: verification.taille,
          empreinteSha256: null,
          methodeVerification: verification.methodeVerification,
          sourceSupprimeeApresVerification: true,
          success: true,
        });
      } catch (error) {
        // v40.12 : certains fournisseurs Android peuvent lever une erreur tardive
        // alors que la source a bien disparu et que la destination existe réellement.
        // On réconcilie donc le bilan avec l'état constaté sur le disque, sans rejouer
        // ni modifier le mécanisme de copie/suppression.
        let sourceEncorePresente = false;
        let destinationPresente = false;

        try {
          for await (const [nomEntree] of dossierCollecte.entries()) {
            if (nomEntree === nomFichier) {
              sourceEncorePresente = true;
              break;
            }
          }
        } catch (controleSourceError) {
          console.warn("Contrôle présence source Android impossible :", nomFichier, controleSourceError);
          sourceEncorePresente = true;
        }

        if (dossierDestination && nomDestination) {
          try {
            await dossierDestination.getFileHandle(nomDestination, { create: false });
            destinationPresente = true;
          } catch (controleDestinationError) {
            destinationPresente = false;
          }
        }

        const rangementReellementReussi =
          copieValidee &&
          !sourceEncorePresente &&
          destinationPresente;

        if (rangementReellementReussi) {
          photosRangees += 1;
          if (stat) stat.photosRangees += 1;

          resultats.push({
            fichier: nomFichier,
            fichierDestination: nomDestination,
            visiteId: visite.id,
            visiteNom: visite.nom,
            sourceSupprimeeApresVerification: true,
            succesReconcileApresErreurAndroid: true,
            success: true,
          });
          continue;
        }

        photosEchecs += 1;
        if (stat) stat.photosEchecs += 1;

        // Si la source existe encore, une copie incomplète ou non validée est retirée.
        // La source reste alors l'unique référence et aucune photo n'est perdue.
        try {
          if (sourceEncorePresente && dossierDestination && nomDestination && destinationPresente) {
            await dossierDestination.removeEntry(nomDestination);
          }
        } catch (nettoyageError) {
          console.warn("Nettoyage copie Android incomplète impossible :", nomFichier, nettoyageError);
        }

        if (copieValidee && error?.name !== "NotFoundError") {
          suppressionsKo += 1;
        }

        resultats.push({
          fichier: nomFichier,
          visiteId: visite.id,
          visiteNom: visite.nom,
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

    return {
      success: true,
      rangementComplet: photosEchecs === 0 && photosNonAttribuees === 0,
      mode: "android",
      photosLues,
      photosRangees,
      photosEchecs,
      photosNonAttribuees,
      suppressionsKo,
      visites: visitesResultats,
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
        dossierRacine: dossierRacineMetierEnvoyeAuServeur(),
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
    // v45.7.3 : toutes les visites clôturées participent à l’association.
    // Une ancienne tentative a pu les marquer « rangées » à tort avec le faux succès 0/0.
    const visitesAtraiter = lireHistoriqueVisitesRangement().filter(
      (visite) => visite.finMs
    );

    if (visitesAtraiter.length === 0) {
      setMessageActualisation("Aucune visite clôturée à ranger.");
      afficherMessageDiscretArborescence("Aucune visite clôturée à ranger.");
      return;
    }

    // v77 — « Accueil » peut fermer la modale : le rangement va au bout (aucune photo laissée à
    // moitié déplacée), son bilan disque est enregistré, son affichage est ignoré.
    const operation = demarrerOperationEnCours("rangement");

    try {
      setRangementModaleFermee(false);
      setActualisationEnCours(true);
      setMessageActualisation("Rangement des photos des visites en cours...");

      const data = estAndroid()
        ? await rangerPhotosVisitesAndroid(visitesAtraiter)
        : await rangerPhotosVisitesServeur(visitesAtraiter);

      marquerVisitesRangees(data.visites || []);
      await actualiserVisitesPhysiques({ autoriserSelection: false });

      const total = Number(data.photosRangees || data.deplaces || 0);
      const echecs = Number(data.photosEchecs || 0);
      const visitesValidees = (data.visites || []).filter((visite) => visite.rangee === true).length;

      setDerniereActualisation(data);
      if (!operation.estActive()) return;
      if (echecs > 0 || data.rangementComplet === false) {
        const premierEchec = (data.resultats || []).find((resultat) => resultat.success === false);
        const detailEchec = premierEchec?.raison
          ? ` Premier échec : ${premierEchec.raison}`
          : "";
        const messagePartiel =
          `⚠️ ${total} photo(s) rangée(s), ${echecs} échec(s). ` +
          "Les photos en échec sont conservées dans Collecte Photo en cours." +
          detailEchec;
        setDerniereActionVisite(messagePartiel);
        setMessageActualisation(messagePartiel);
        afficherMessageDiscretArborescence(messagePartiel);
      } else {
        const messageSucces = `✅ ${total} photo(s) rangée(s) dans ${visitesValidees} visite(s).`;
        setDerniereActionVisite(messageSucces);
        setMessageActualisation(messageSucces);
        afficherMessageDiscretArborescence(`✅ ${total} photo(s) rangée(s).`);
      }
    } catch (error) {
      console.error(error);
      if (!operation.estActive()) return;
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


  function clePhysiqueVisite(visite = {}) {
    const stockageVille = String(
      visite.stockageVille || visite.dossierVilleStockage ||
      (visite.ville === "Ville non renseignée" ? "Visites rapides" : visite.ville) || ""
    ).trim();
    const origine = visite.estARattacher
      ? "visites-a-rattacher"
      : String(visite.originePhysique || "voyages").trim();
    return [origine, visite.voyage, stockageVille, visite.nom]
      .map((valeur) => String(valeur || "").trim().toLowerCase())
      .join("__");
  }

  function fusionnerVisitesPhysiquesEtMetadonnees(visitesDisque = []) {
    const historique = lireHistoriqueVisitesRangement();
    const historiqueParChemin = new Map();
    for (const visite of historique) {
      const cle = clePhysiqueVisite(visite);
      if (cle && !historiqueParChemin.has(cle)) historiqueParChemin.set(cle, visite);
    }

    return visitesDisque.map((physique) => {
      const metadata = historiqueParChemin.get(clePhysiqueVisite(physique));
      const debutPhysique = Number(physique.debutMs || 0);
      const finPhysique = Number(physique.finMs || 0);
      const debutHistorique = Number(metadata?.debutMs || 0);
      const finHistorique = Number(metadata?.finMs || 0);
      const debutMs = debutPhysique || debutHistorique || null;
      const finMs = finPhysique || finHistorique || null;
      const nombrePhotos = Number(
        physique.nombrePhotos ?? metadata?.photosRangees ?? metadata?.nombrePhotosDeclare ?? 0
      );
      return {
        ...(metadata || {}),
        ...physique,
        id: physique.idPhysique || clePhysiqueVisite(physique),
        type: String(metadata?.type || physique.type || "").trim(),
        debutMs,
        finMs,
        dureeMs: debutMs && finMs && finMs >= debutMs ? finMs - debutMs : null,
        nombrePhotos,
        photosRangees: nombrePhotos,
        statut: physique.estARattacher
          ? "À rattacher"
          : metadata
            ? (metadata.statut || (metadata.rangee ? "Rangée" : "Importée"))
            : (physique.statut || "Importée"),
        dateTriMs: Number(
          physique.datePhotoPlusRecenteMs ||
          physique.dateDossierMs ||
          metadata?.dateRangementMs ||
          metadata?.finMs ||
          0
        ),
      };
    });
  }

  async function analyserDossierVisiteAndroid(dossierVisite) {
    // v45.2 : l'index léger ne lit plus le contenu binaire de chaque photo.
    // getFile() était la cause principale du démarrage très lent sur téléphone.
    let nombrePhotos = 0;
    let debutMs = 0;
    let finMs = 0;
    const extensions = new Set(["jpg", "jpeg", "png", "webp", "heic", "heif", "gif", "bmp", "tif", "tiff"]);

    const parcourir = async (dossier) => {
      for await (const [nom, handle] of dossier.entries()) {
        if (handle.kind === "directory") {
          await parcourir(handle);
          continue;
        }
        const extension = String(nom).split(".").pop().toLowerCase();
        if (!extensions.has(extension)) continue;
        nombrePhotos += 1;
        const dateMs = extraireMsDepuisNomPhotoCartel(nom);
        if (dateMs) {
          debutMs = debutMs ? Math.min(debutMs, dateMs) : dateMs;
          finMs = Math.max(finMs, dateMs);
        }
      }
    };

    await parcourir(dossierVisite);
    return {
      nombrePhotos,
      debutMs: debutMs || null,
      finMs: finMs || null,
      dureeMs: debutMs && finMs && finMs >= debutMs ? finMs - debutMs : null,
      datePhotoPlusRecenteMs: finMs || null,
    };
  }

  function sauvegarderCacheVisitesPhysiques(visites) {
    try {
      const serialisables = visites.map(({ handleAndroid, ...visite }) => visite);
      localStorage.setItem(CLE_CACHE_VISITES_PHYSIQUES, JSON.stringify({
        version: VERSION_PHOTOCARTEL,
        dateMs: Date.now(),
        visites: serialisables,
      }));
    } catch (error) {
      console.warn("Cache visites physiques non sauvegardé :", error);
    }
  }

  function lireCacheVisitesPhysiques() {
    try {
      const cache = JSON.parse(localStorage.getItem(CLE_CACHE_VISITES_PHYSIQUES) || "null");
      return Array.isArray(cache?.visites) ? cache.visites : [];
    } catch (error) {
      return [];
    }
  }

  async function lireVisitesPhysiquesAndroid({ autoriserSelection = false } = {}) {
    const resultatRacine = await obtenirDossierRacinePhotoCartelAndroid({
      ouvrirSelecteurSiNecessaire: autoriserSelection,
      demanderPermissionSiNecessaire: autoriserSelection,
    });
    const racine = resultatRacine?.dossierPhotoCartel;
    if (!racine) throw new Error("Première autorisation nécessaire. Dans le sélecteur Android, choisis DCIM ou DCIM/PhotoCartel.");

    // v47 : cette lecture ne parcourt que l'arborescence Voyage/Ville/Visite.
    // Les anciens compteurs sont repris du cache et les visites nouvelles sont
    // mesurées ensuite, progressivement, sans retarder l'affichage de la liste.
    await verifierInfrastructureDansPhotoCartelAndroid(racine);
    const voyages = await racine.getDirectoryHandle(DOSSIER_METIER_VOYAGES, { create: true });
    const visitesARattacher = await racine.getDirectoryHandle(DOSSIER_VISITES_A_RATTACHER, { create: true });
    const visites = [];
    const cacheParCle = new Map(
      lireCacheVisitesPhysiques().map((visite) => [clePhysiqueVisite(visite), visite])
    );

    const mesuresDepuisCache = (visiteBase) => {
      const cache = cacheParCle.get(clePhysiqueVisite(visiteBase));
      if (!cache) {
        return {
          nombrePhotos: 0,
          debutMs: null,
          finMs: null,
          dureeMs: null,
          datePhotoPlusRecenteMs: null,
          mesuresAndroidACompleter: true,
        };
      }
      return {
        nombrePhotos: Number(cache.nombrePhotos || cache.photosRangees || 0),
        debutMs: cache.debutMs || null,
        finMs: cache.finMs || null,
        dureeMs: cache.dureeMs || null,
        datePhotoPlusRecenteMs: cache.datePhotoPlusRecenteMs || cache.dateTriMs || cache.finMs || null,
        mesuresAndroidACompleter: false,
      };
    };

    for await (const [nomVoyage, voyageHandle] of voyages.entries()) {
      if (voyageHandle.kind !== "directory") continue;
      for await (const [nomVilleStockage, villeHandle] of voyageHandle.entries()) {
        if (villeHandle.kind !== "directory") continue;
        for await (const [nomVisite, visiteHandle] of villeHandle.entries()) {
          if (visiteHandle.kind !== "directory" || estNomTechniquePhotoCartel(nomVisite)) continue;
          const estVisiteRapide = nomVilleStockage === "Visites rapides";
          const visiteBase = {
            idPhysique: ["voyages", nomVoyage, nomVilleStockage, nomVisite].join("__"),
            originePhysique: DOSSIER_METIER_VOYAGES,
            voyage: nomVoyage,
            ville: estVisiteRapide ? "Ville non renseignée" : nomVilleStockage,
            stockageVille: nomVilleStockage,
            nom: nomVisite,
            chemin: `${DOSSIER_METIER_VOYAGES}\\${nomVoyage}\\${nomVilleStockage}\\${nomVisite}`,
            segmentsAndroid: [DOSSIER_METIER_VOYAGES, nomVoyage, nomVilleStockage, nomVisite],
            handleAndroid: visiteHandle,
            estVisiteRapide,
            estARattacher: false,
            type: "",
            statut: "Importée",
          };
          visites.push({ ...visiteBase, ...mesuresDepuisCache(visiteBase) });
        }
      }
    }

    for await (const [nomVisite, visiteHandle] of visitesARattacher.entries()) {
      if (visiteHandle.kind !== "directory" || estNomTechniquePhotoCartel(nomVisite)) continue;
      const visiteBase = {
        idPhysique: ["a-rattacher", nomVisite].join("__"),
        originePhysique: DOSSIER_VISITES_A_RATTACHER,
        voyage: "",
        ville: "",
        stockageVille: "",
        nom: nomVisite,
        chemin: `${DOSSIER_VISITES_A_RATTACHER}\\${nomVisite}`,
        segmentsAndroid: [DOSSIER_VISITES_A_RATTACHER, nomVisite],
        handleAndroid: visiteHandle,
        estVisiteRapide: false,
        estARattacher: true,
        type: "",
        statut: "À rattacher",
      };
      const mesures = mesuresDepuisCache(visiteBase);
      visites.push({
        ...visiteBase,
        ...mesures,
        dateDossierMs: mesures.datePhotoPlusRecenteMs || null,
      });
    }
    return visites;
  }

  async function completerMesuresVisitesAndroidEnArrierePlan(visitesRapides, generation) {
    const aCompleter = visitesRapides.filter((visite) => visite.mesuresAndroidACompleter && visite.handleAndroid);
    if (!aCompleter.length) return;

    const mesuresParCle = new Map();
    for (const visite of aCompleter) {
      if (generation !== generationLectureVisitesRef.current) return;
      try {
        const mesures = await analyserDossierVisiteAndroid(visite.handleAndroid);
        mesuresParCle.set(clePhysiqueVisite(visite), mesures);
      } catch (error) {
        console.warn(`Mesure différée impossible pour « ${visite.nom} » :`, error);
      }

      // Rend la main au navigateur entre deux visites pour préserver la fluidité PWA.
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    if (generation !== generationLectureVisitesRef.current || !mesuresParCle.size) return;
    setVisitesPhysiques((courantes) => {
      const enrichies = courantes.map((visite) => {
        const mesures = mesuresParCle.get(clePhysiqueVisite(visite));
        return mesures ? { ...visite, ...mesures, mesuresAndroidACompleter: false } : visite;
      });
      sauvegarderCacheVisitesPhysiques(enrichies);
      return enrichies;
    });
  }

  async function resoudreHandleVisiteAndroid(visite, dossierPhotoCartelValide = null) {
    if (visite?.handleAndroid?.kind === "directory") return visite.handleAndroid;
    const resultatRacine = dossierPhotoCartelValide
      ? { dossierPhotoCartel: dossierPhotoCartelValide }
      : await obtenirDossierRacinePhotoCartelAndroid({
      ouvrirSelecteurSiNecessaire: false,
      demanderPermissionSiNecessaire: false,
    });
    let courant = resultatRacine?.dossierPhotoCartel;
    if (!courant) throw new Error("Autorisation du dossier PhotoCartel nécessaire.");
    const segments = Array.isArray(visite?.segmentsAndroid)
      ? visite.segmentsAndroid
      : String(visite?.chemin || "").replace(/\\/g, "/").split("/").filter(Boolean);
    for (const segment of segments) {
      courant = await courant.getDirectoryHandle(segment, { create: false });
    }
    return courant;
  }

  async function listerPhotosVisiteAndroid(visite, dossierVisiteValide = null) {
    const dossierVisite = dossierVisiteValide || await resoudreHandleVisiteAndroid(visite);
    const photos = [];
    const extensions = new Set(["jpg", "jpeg", "png", "webp", "heic", "heif", "gif", "bmp", "tif", "tiff"]);
    const parcourir = async (dossier, prefixe = "") => {
      const entrees = [];
      for await (const [nom, handle] of dossier.entries()) entrees.push([nom, handle]);
      entrees.sort((a, b) => a[0].localeCompare(b[0], "fr", { numeric: true }));
      for (const [nom, handle] of entrees) {
        const relatif = prefixe ? `${prefixe}/${nom}` : nom;
        if (handle.kind === "directory") {
          await parcourir(handle, relatif);
          continue;
        }
        const extension = String(nom).split(".").pop().toLowerCase();
        if (!extensions.has(extension)) continue;
        // v45.2 : aucun getFile() ici. Le fichier n'est ouvert que lorsque sa vignette devient visible.
        photos.push({
          id: relatif,
          nom,
          cheminRelatif: relatif,
          dateModificationMs: extraireMsDepuisNomPhotoCartel(nom) || 0,
          handleAndroid: handle,
        });
      }
    };
    await parcourir(dossierVisite);
    return photos.sort((a, b) => {
      const dateA = extraireMsDepuisNomPhotoCartel(a.nom) || 0;
      const dateB = extraireMsDepuisNomPhotoCartel(b.nom) || 0;
      return dateA - dateB || a.cheminRelatif.localeCompare(b.cheminRelatif, "fr", { numeric: true });
    });
  }

  async function lireVisitesPhysiquesServeur() {
    const response = await fetch(API_BASE + "/visites-physiques", { cache: "no-store" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.success) {
      throw new Error(data.error || "Lecture des visites physiques impossible.");
    }
    return Array.isArray(data.visites) ? data.visites : [];
  }

  async function actualiserVisitesPhysiques({ autoriserSelection = false, silencieux = false } = {}) {
    const generation = ++generationLectureVisitesRef.current;
    try {
      if (!silencieux) setLectureVisitesPhysiquesEnCours(true);
      setErreurLectureVisitesPhysiques("");
      const visitesDisque = estAndroid()
        ? await lireVisitesPhysiquesAndroid({ autoriserSelection })
        : await lireVisitesPhysiquesServeur();
      if (generation !== generationLectureVisitesRef.current) return [];
      const visitesFusionnees = fusionnerVisitesPhysiquesEtMetadonnees(visitesDisque);
      setVisitesPhysiques(visitesFusionnees);
      sauvegarderCacheVisitesPhysiques(visitesFusionnees);
      if (estAndroid()) {
        setTimeout(() => {
          completerMesuresVisitesAndroidEnArrierePlan(visitesDisque, generation);
        }, 350);
      }
      setVisiteResumeSelectionnee((selection) => {
        if (!selection) return null;
        return visitesFusionnees.find((visite) =>
          visite.id === selection.id || clePhysiqueVisite(visite) === clePhysiqueVisite(selection)
        ) || null;
      });
      return visitesFusionnees;
    } catch (error) {
      console.error("Lecture visites physiques :", error);
      if (error?.name === "AbortError") {
        setErreurLectureVisitesPhysiques(
          "Autorisation annulée. Appuie sur « Autoriser le dossier PhotoCartel » pour réessayer."
        );
      } else {
        setErreurLectureVisitesPhysiques(error?.message || String(error));
      }
      return [];
    } finally {
      if (!silencieux && generation === generationLectureVisitesRef.current) {
        setLectureVisitesPhysiquesEnCours(false);
      }
    }
  }

  useEffect(() => {
    // v47 : useState a déjà rendu le cache avant le premier affichage React.
    // L'énumération légère de l'arborescence est différée et reste silencieuse
    // dès qu'une liste utilisable est présente.
    const cachePresent = lireCacheVisitesPhysiques().length > 0;
    const lancerActualisation = () => {
      actualiserVisitesPhysiques({ autoriserSelection: false, silencieux: cachePresent });
    };
    let identifiant = null;
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      identifiant = window.requestIdleCallback(lancerActualisation, { timeout: 3000 });
      return () => window.cancelIdleCallback?.(identifiant);
    }
    identifiant = setTimeout(lancerActualisation, cachePresent ? 1500 : 60);
    return () => clearTimeout(identifiant);
  }, []);

  function visitesRangeesRecentes() {
    return [...visitesPhysiques].sort((a, b) => {
      const ecart = Number(b.dateTriMs || 0) - Number(a.dateTriMs || 0);
      if (ecart) return ecart;
      return String(a.nom || "").localeCompare(String(b.nom || ""), "fr", {
        sensitivity: "base",
        numeric: true,
      });
    });
  }

  function formaterDateVisiteDepuisMs(valeurMs) {
    const valeur = Number(valeurMs || 0);
    if (!valeur) return "Non disponible";
    return formaterDate(new Date(valeur));
  }

  function formaterDureeVisiteRangee(visite) {
    const debut = Number(visite?.debutMs || 0);
    const fin = Number(visite?.finMs || 0);
    if (!debut || !fin || fin < debut) return "Non disponible";
    return formaterDuree(fin - debut);
  }

  function libelleTypeVisiteResume(visite) {
    const type = String(visite?.type || "").trim();
    return type || "Non renseigné";
  }

  function iconePourTypeVisite(typeBrut) {
    const type = String(typeBrut || "").trim();
    const icones = {
      "Musée": "🏛️",
      "Église": "⛪",
      "Transport": "🚆",
      "Site naturel": "🏞️",
      "Ville / Village": "🏘️",
      "Jardin / Parc": "🌳",
      "Architecture": "🏙️",
      "Château": "🏰",
      "Restaurant / Repas": "🍽️",
      "Autre": "•••",
    };
    return icones[type] || "•••";
  }

  function afficherMessageFonctionnaliteAccueil(message) {
    if (temporisationMessageFonctionnaliteRef.current) {
      clearTimeout(temporisationMessageFonctionnaliteRef.current);
    }
    setMessageFonctionnaliteAccueil(message);
    temporisationMessageFonctionnaliteRef.current = setTimeout(() => {
      setMessageFonctionnaliteAccueil("");
      temporisationMessageFonctionnaliteRef.current = null;
    }, 5000);
  }

  function selectionnerVisiteRecente(visite) {
    if (!visite?.id) return;

    setVisiteRecenteEnConfirmation(visite.id);
    if (temporisationDerniereVisiteRef.current) {
      clearTimeout(temporisationDerniereVisiteRef.current);
    }

    temporisationDerniereVisiteRef.current = setTimeout(() => {
      setVisiteResumeSelectionnee(visite);
      setListeDernieresVisitesOuverte(false);
      setVisiteRecenteEnConfirmation("");
      temporisationDerniereVisiteRef.current = null;
    }, 150);
  }

  // v70 — FILET DE SÉCURITÉ.
  // Le chargement de l'image est fait explicitement par chargerImageGalerieAndroid,
  // appelée aux six endroits où la fiche affichée change. Cet effet ne charge plus
  // rien lui-même : il vérifie seulement, à chaque rendu, que l'image affichée
  // correspond bien à la fiche à l'écran, et relance le chargement si ce n'est pas
  // le cas. Il couvre les chemins qu'un appel explicite aurait pu manquer, sans
  // jamais être le mécanisme principal — c'est de cette dépendance à un réveil
  // implicite que venait le défaut de la v69.
  const ficheGalerieAffichee = modeGalerieAnalyses
    ? galerieAnalyses[galerieIndex]
    : null;
  const nomPhotoGalerieAffichee = String(ficheGalerieAffichee?.nomPhoto || "");

  useEffect(() => {
    if (!modeGalerieAnalyses || !estAndroid() || !nomPhotoGalerieAffichee) {
      return undefined;
    }
    if (galerieImageCourante.nomPhoto === nomPhotoGalerieAffichee) {
      return undefined;
    }

    chargerImageGalerieAndroid(nomPhotoGalerieAffichee);

    return undefined;
  }, [modeGalerieAnalyses, nomPhotoGalerieAffichee, galerieImageCourante]);

  // v42.0.4 — à l'ouverture, la page quitte réellement son état figé et
  // remonte la section « Dernières visites » sous la barre supérieure.
  useEffect(() => {
    if (!listeDernieresVisitesOuverte || typeof window === "undefined") return undefined;

    let annule = false;
    let animationFrame1 = 0;
    let animationFrame2 = 0;
    let temporisation = 0;

    const positionnerListe = (comportement = "smooth") => {
      if (annule) return;
      const section = sectionDernieresVisitesRef.current;
      const liste = document.getElementById("liste-dernieres-visites");
      if (!section || !liste) return;

      const positionActuelle = window.scrollY || window.pageYOffset || 0;
      const hautSection = section.getBoundingClientRect().top + positionActuelle;
      const margeSousBarreSuperieure = 66;
      const destination = Math.max(0, hautSection - margeSousBarreSuperieure);

      window.scrollTo({
        top: destination,
        left: 0,
        behavior: comportement,
      });
    };

    animationFrame1 = window.requestAnimationFrame(() => {
      animationFrame2 = window.requestAnimationFrame(() => positionnerListe("smooth"));
    });
    temporisation = window.setTimeout(() => positionnerListe("auto"), 320);

    return () => {
      annule = true;
      if (animationFrame1) window.cancelAnimationFrame(animationFrame1);
      if (animationFrame2) window.cancelAnimationFrame(animationFrame2);
      if (temporisation) window.clearTimeout(temporisation);
    };
  }, [
    listeDernieresVisitesOuverte,
    lectureVisitesPhysiquesEnCours,
    visitesPhysiques.length,
  ]);

  // Après la sélection, le résumé devient la cible visible de la page défigée.
  useEffect(() => {
    if (!visiteResumeSelectionnee || typeof window === "undefined") return undefined;

    const temporisation = window.setTimeout(() => {
      document.getElementById("resume-visite-selectionnee")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }, 220);

    return () => window.clearTimeout(temporisation);
  }, [visiteResumeSelectionnee]);

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
    const secondesTotales = Math.max(0, Math.round(Number(ms || 0) / 1000));
    const heures = Math.floor(secondesTotales / 3600);
    const minutes = Math.floor((secondesTotales % 3600) / 60);
    const secondes = secondesTotales % 60;
    const morceaux = [];
    if (heures > 0) morceaux.push(`${heures} ${heures === 1 ? "heure" : "heures"}`);
    if (minutes > 0 || heures > 0) morceaux.push(`${minutes} min`);
    morceaux.push(`${secondes} s`);
    return morceaux.join(" ");
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

// v77 — OPÉRATIONS EN COURS
function demarrerOperationEnCours(nom) {
  controleursOperationsRef.current[nom]?.abort();
  const jeton = (jetonsOperationsRef.current[nom] || 0) + 1;
  jetonsOperationsRef.current[nom] = jeton;
  const controleur = new AbortController();
  controleursOperationsRef.current[nom] = controleur;
  return {
    signal: controleur.signal,
    estActive: () => jetonsOperationsRef.current[nom] === jeton,
  };
}

function interrompreOperationEnCours(nom) {
  jetonsOperationsRef.current[nom] = (jetonsOperationsRef.current[nom] || 0) + 1;
  controleursOperationsRef.current[nom]?.abort();
  controleursOperationsRef.current[nom] = null;
}

// v77 — amène à l'écran une étape affichée dans l'accueil. La mise en vue a lieu après le
// rendu qui affiche l'étape et lève le gel (voir l'effet associé à demandeMiseEnVue).
function amenerEtapeALaVue(id) {
  setDemandeMiseEnVue((precedente) => ({ id, numero: (precedente?.numero || 0) + 1 }));
}

function interrompreRenommage() {
  interrompreOperationEnCours("renommage");
  setRenommageFinalEnCours(false);
  cheminRenommagePrepareRef.current = "";
  setCheminRenommagePrepare("");
  setRenommagePret(false);
  setPropositionsRenommage(null);
  setMessageRenommage("Renommage interrompu. Aucune photo n'a été renommée.");
  amenerEtapeALaVue("etape-renommage");
}

function interrompreClassification() {
  interrompreOperationEnCours("classification");
  setClassificationEnCours(false);
  setMessageImport("Classification interrompue.");
  amenerEtapeALaVue("etape-classification");
}

// v77 — LISTE UNIQUE DE CE QUI N'EST PAS L'ACCUEIL NU
// Lue par le gel de l'accueil (figé seulement si rien n'y est actif) et par retourAccueil
// (qui éteint tout ce qu'elle contient). Un nouvel écran, une nouvelle étape ou une nouvelle
// modale s'ajoute ici, et seulement ici.
function listerEtatsHorsAccueil() {
  return [
    // Écrans
    { nom: "galerie d'une visite", actif: modeGalerieVisite || modePhotoGalerieVisite,
      eteindre: () => { setModeGalerieVisite(false); setModePhotoGalerieVisite(false); } },
    { nom: "galerie des photos analysées", actif: modeGalerieAnalyses, eteindre: () => setModeGalerieAnalyses(false) },
    { nom: "analyse d'une photo", actif: modeAnalysePhoto, eteindre: () => setModeAnalysePhoto(false) },
    { nom: "choix d'action d'analyse", actif: modeChoixActionAnalysePhoto, eteindre: () => setModeChoixActionAnalysePhoto(false) },
    { nom: "autorisation de stockage", actif: modeAutorisationStockageAnalyse, eteindre: () => setModeAutorisationStockageAnalyse(false) },
    { nom: "photo en plein écran", actif: Boolean(photoPleinEcranUrl), eteindre: () => setPhotoPleinEcranUrl("") },
    { nom: "résultats de recherche", actif: modeRechercheResultats, eteindre: () => setModeRechercheResultats(false) },
    { nom: "paramètres", actif: modeParametres, eteindre: () => setModeParametres(false) },
    { nom: "bibliothèques", actif: modeBibliotheques, eteindre: () => setModeBibliotheques(false) },
    { nom: "menu Renommer", actif: modeRenommerAccueil, eteindre: () => setModeRenommerAccueil(false) },
    { nom: "gestion du voyage", actif: modeGestionVoyage, eteindre: () => setModeGestionVoyage(false) },
    { nom: "création d'un voyage", actif: modeCreationVoyage, eteindre: () => setModeCreationVoyage(false) },
    { nom: "modification d'une visite", actif: modeModificationIdentiteVisite, eteindre: () => setModeModificationIdentiteVisite(false) },
    { nom: "création d'une visite", actif: modeCreationVisite, eteindre: () => setModeCreationVisite(false) },
    { nom: "aucune visite", actif: modeAucuneVisite, eteindre: () => setModeAucuneVisite(false) },
    { nom: "suppression d'une photo de visite", actif: confirmationSuppressionPhotoVisite, eteindre: () => setConfirmationSuppressionPhotoVisite(false) },
    { nom: "suppression d'une visite", actif: confirmationSuppressionVisite, eteindre: () => setConfirmationSuppressionVisite(false) },
    { nom: "suppression d'une fiche de la galerie", actif: confirmationSuppressionGalerie, eteindre: () => setConfirmationSuppressionGalerie(false) },
    { nom: "dernières visites", actif: listeDernieresVisitesOuverte || Boolean(visiteResumeSelectionnee),
      eteindre: () => { setListeDernieresVisitesOuverte(false); setVisiteResumeSelectionnee(null); } },
    { nom: "classification terminée", actif: Boolean(resultatClassification), eteindre: () => setResultatClassification(null) },
    { nom: "renommage terminé", actif: Boolean(dashboardRenommage),
      eteindre: () => { setDashboardRenommage(null); setResultatsRenommageDetail(null); } },
    // Modales en cours
    { nom: "classification en cours", actif: classificationEnCours,
      eteindre: () => { interrompreOperationEnCours("classification"); setClassificationEnCours(false); } },
    { nom: "renommage en cours", actif: renommageFinalEnCours,
      eteindre: () => { interrompreOperationEnCours("renommage"); setRenommageFinalEnCours(false); } },
    { nom: "rangement en cours", actif: actualisationEnCours && !rangementModaleFermee,
      eteindre: () => { interrompreOperationEnCours("rangement"); setRangementModaleFermee(true); } },
    // Étapes affichées dans l'accueil
    { nom: "étape de renommage", actif: Boolean(messageRenommage) || renommagePret || Boolean(propositionsRenommage),
      eteindre: () => {
        interrompreOperationEnCours("renommage");
        setMessageRenommage("");
        setRenommagePret(false);
        setPropositionsRenommage(null);
        setAnalyseRenommageEnCours(false);
        setConfirmationRenommageEnCours(false);
        cheminRenommagePrepareRef.current = "";
        setCheminRenommagePrepare("");
      } },
    { nom: "étape de classification", actif: Boolean(messageImport) || Boolean(dossierImport),
      eteindre: () => { setMessageImport(""); setDossierImport(""); } },
    { nom: "message de rangement", actif: Boolean(messageActualisation), eteindre: () => setMessageActualisation("") },
    { nom: "message de l'arborescence", actif: Boolean(messageArborescenceAndroid), eteindre: () => setMessageArborescenceAndroid("") },
    { nom: "message du test de stockage", actif: Boolean(messageTestStockageAndroid), eteindre: () => setMessageTestStockageAndroid("") },
    { nom: "message de l'accueil", actif: Boolean(messageFonctionnaliteAccueil), eteindre: () => setMessageFonctionnaliteAccueil("") },
  ];
}

function retourAccueil() {
  // v77 — éteint tout ce que liste listerEtatsHorsAccueil, la même liste que le gel.
  listerEtatsHorsAccueil().forEach((etat) => etat.eteindre());
  annulerChargementsGalerieVisite();
  setModeGalerieVisite(false);
  setModePhotoGalerieVisite(false);
  setVisiteGalerieMaquette(null);
  setPhotosGalerieVisite([]);
  setNombreTotalPhotosGalerieVisite(0);
  setErreurGalerieVisite("");
  setChargementGalerieVisite(false);
  setIndexPhotoGalerieVisite(0);
  // v38.1 — Accueil est un kill switch global :
  // fermeture de tous les écrans, popups et états transitoires,
  // puis restauration stricte de la page d’accueil figée.
  fermerGaleriePhotosAnalysees();

  setModeCreationVisite(false);
  setModeCreationVoyage(false);
  setModeGestionVoyage(false);
  setModeAucuneVisite(false);
  setModeParametres(false);
  setEcranParametres("menu");
  setModeBibliotheques(false);
  setModeRenommerAccueil(false);
  setMessageMenuAccueil("");
  setCibleMessageMenuAccueil("");
  setMessageTestStockageAndroid("");
  setListeDernieresVisitesOuverte(false);
  setVisiteResumeSelectionnee(null);
  setVisiteRecenteEnConfirmation("");
  if (temporisationDerniereVisiteRef.current) {
    clearTimeout(temporisationDerniereVisiteRef.current);
    temporisationDerniereVisiteRef.current = null;
  }

  setModeChoixActionAnalysePhoto(false);
  setModeAutorisationStockageAnalyse(false);
  setAutorisationStockageAnalyseEnCours(false);
  setPhotoPleinEcranUrl("");
  setConfirmationSuppressionGalerie(false);

  setResultatClassification(null);
  setDashboardRenommage(null);
  setResultatsRenommageDetail(null);

  setMessageImport("");
  setMessageRenommage("");
  setMessageAnalysePhoto("");
  setMessageGalerieAnalyses("");
  setMessageActualisation("");
  setMessageArborescenceAndroid("");
  setMessageTestStockageAndroid("");

  if (messageArborescenceTimeoutRef.current) {
    clearTimeout(messageArborescenceTimeoutRef.current);
    messageArborescenceTimeoutRef.current = null;
  }

  setDossierImport("");
  setDossierRenommage("");

  setFichiersImport([]);
  setFichiersRenommage([]);

  setNombrePhotos(0);
  setNombrePhotosRenommage(0);

  cheminRenommagePrepareRef.current = "";
  setCheminRenommagePrepare("");
  setRenommagePret(false);
  setPropositionsRenommage(null);
  setRenommageFinalTermine(false);

  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }
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
  setResultatsRenommageDetail(null);
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
  setPropositionsRenommage(null);
  setRenommageFinalTermine(false);

localStorage.setItem("photoCartelVoyageActif", "");
localStorage.setItem("photoCartelVilleActive", "");
localStorage.setItem("photoCartelLieuActif", "");
localStorage.setItem("photoCartelTypeVisiteActif", "");
localStorage.setItem("photoCartelStatutVisite", "EN_COURS");
localStorage.setItem("photoCartelDossierTamponActif", "");
localStorage.setItem("photoCartelCheminTamponActif", "");
localStorage.setItem("photoCartelDebutVisiteMs", "");

// v43 : la fenêtre Gestion du voyage reste ouverte afin de permettre
// la création immédiate du voyage suivant sans clic inutile.
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

async function supprimerHandleAndroid(cle) {
  try {
    const db = await baseIndexedDbPhotoCartel();
    if (!db) return;

    await new Promise((resolve, reject) => {
      const transaction = db.transaction("handles", "readwrite");
      transaction.objectStore("handles").delete(cle);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.warn("Handle Android invalide non supprimé d’IndexedDB :", error);
  }
}

function estHandlePhotoCartelValide(handle) {
  return handle?.kind === "directory" && handle?.name === "PhotoCartel";
}

function estHandleDcimValide(handle) {
  return handle?.kind === "directory" && handle?.name === "DCIM";
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

function tracerStockageV39(etape, details = {}) {
  const trace = {
    version: VERSION.numero,
    etape,
    generation: stockageAndroidGenerationRef.current,
    visite: lieuVisite || "",
    voyage: voyage || "",
    date: new Date().toISOString(),
    ...details,
  };
  console.info("[PhotoCartel stockage v39]", trace);
  return trace;
}

async function installerContexteStockageAndroid({
  type,
  dossierPhotoCartel,
  dossierDcim = null,
  source = "inconnue",
  persister = true,
}) {
  if (!estHandlePhotoCartelValide(dossierPhotoCartel)) {
    throw new Error("Le contexte de stockage reçu ne pointe pas vers le dossier PhotoCartel.");
  }

  // La vérification est faite AVANT de publier les nouvelles références de session.
  // Ainsi, un contexte incomplet ne remplace jamais un contexte encore exploitable.
  await verifierInfrastructureDansPhotoCartelAndroid(dossierPhotoCartel);
  await dossierPhotoCartel.getDirectoryHandle("Collecte Photo en cours", { create: true });

  if (type === "dcim" && estHandleDcimValide(dossierDcim)) {
    photoCartelHandleDcimSessionRef.current = dossierDcim;
    photoCartelHandleRacineAndroidSessionRef.current = null;
    if (persister) {
      await sauvegarderHandleDcimAndroid(dossierDcim);
      await supprimerHandleAndroid(NOM_HANDLE_RACINE_ANDROID);
    }
  } else {
    photoCartelHandleRacineAndroidSessionRef.current = dossierPhotoCartel;
    photoCartelHandleDcimSessionRef.current = null;
    if (persister) {
      await sauvegarderHandleAndroid(NOM_HANDLE_RACINE_ANDROID, dossierPhotoCartel);
      await supprimerHandleAndroid(NOM_HANDLE_DCIM_HISTORIQUE);
    }
  }

  stockageAndroidGenerationRef.current += 1;
  stockageAndroidDerniereSourceRef.current = source;
  tracerStockageV39("contexte installé", { type, source });

  return {
    type: type === "dcim" ? "dcim" : "photocartel",
    dossierDcim: type === "dcim" ? dossierDcim : undefined,
    dossierPhotoCartel,
    source,
    generation: stockageAndroidGenerationRef.current,
  };
}

async function validerCollecteVisiteAndroid(resultatRacineAndroid, origine = "inconnue") {
  const dossierPhotoCartel = resultatRacineAndroid?.dossierPhotoCartel;
  if (!estHandlePhotoCartelValide(dossierPhotoCartel)) {
    throw new Error("Le dossier PhotoCartel n’est pas disponible.");
  }

  await verifierInfrastructureDansPhotoCartelAndroid(dossierPhotoCartel);
  await dossierPhotoCartel.getDirectoryHandle("Collecte Photo en cours", { create: true });
  tracerStockageV39("collecte validée", {
    origine,
    source: resultatRacineAndroid?.source || stockageAndroidDerniereSourceRef.current,
  });
  return resultatRacineAndroid;
}

async function simulerPerteStockageV39() {
  if (simulationPerteStockageV39EnCours) return;

  const visiteAvantTest = lieuVisite || "Aucune visite";
  const photosAvantTest = photosCollectees;

  try {
    setSimulationPerteStockageV39EnCours(true);
    setDiagnosticStockageV39("Simulation en cours…");

    // Outil TEMPORAIRE v39 : on oublie les deux handles côté PhotoCartel.
    // Android/Chrome redemandera donc la sélection de la racine au prochain parcours.
    photoCartelHandleRacineAndroidSessionRef.current = null;
    photoCartelHandleDcimSessionRef.current = null;
    autorisationStockageHandleCandidatRef.current = null;
    await supprimerHandleAndroid(NOM_HANDLE_RACINE_ANDROID);
    await supprimerHandleAndroid(NOM_HANDLE_DCIM_HISTORIQUE);

    stockageAndroidGenerationRef.current += 1;
    stockageAndroidDerniereSourceRef.current = "simulation-perte-v39";
    tracerStockageV39("perte simulée", {
      visiteAvantTest,
      photosAvantTest,
    });

    setDiagnosticStockageV39(
      `Perte simulée. Visite conservée : ${visiteAvantTest}. Compteur conservé : ${photosAvantTest}. ` +
      "Lance maintenant Analyser une photo, réautorise PhotoCartel, puis reprends une photo dans la même visite."
    );
  } catch (error) {
    console.error("Simulation perte stockage v39 :", error);
    setDiagnosticStockageV39("Échec de la simulation : " + (error?.message || String(error)));
  } finally {
    setSimulationPerteStockageV39EnCours(false);
  }
}

async function obtenirDossierRacinePhotoCartelAndroid({
  ouvrirSelecteurSiNecessaire = true,
  demanderPermissionSiNecessaire = false,
} = {}) {
  // v28.3 : point unique d'autorisation Android.
  // Objectif UX : l'utilisateur sélectionne directement DCIM/PhotoCartel quand il existe.
  // Si l'ancien handle DCIM v28.2.8 est déjà autorisé, il reste accepté en compatibilité.
  if (
    estHandlePhotoCartelValide(photoCartelHandleRacineAndroidSessionRef.current) &&
    (await handleAndroidEncoreAutorise(photoCartelHandleRacineAndroidSessionRef.current, { demanderPermissionSiNecessaire }))
  ) {
    return {
      type: "photocartel",
      dossierPhotoCartel: photoCartelHandleRacineAndroidSessionRef.current,
      source: "session",
    };
  }

  if (
    photoCartelHandleRacineAndroidSessionRef.current &&
    !estHandlePhotoCartelValide(photoCartelHandleRacineAndroidSessionRef.current)
  ) {
    photoCartelHandleRacineAndroidSessionRef.current = null;
  }

  let handleRacineSauvegarde = await lireHandleAndroid(NOM_HANDLE_RACINE_ANDROID);
  if (handleRacineSauvegarde && !estHandlePhotoCartelValide(handleRacineSauvegarde)) {
    await supprimerHandleAndroid(NOM_HANDLE_RACINE_ANDROID);
    handleRacineSauvegarde = null;
  }

  if (handleRacineSauvegarde && (await handleAndroidEncoreAutorise(handleRacineSauvegarde, { demanderPermissionSiNecessaire }))) {
    photoCartelHandleRacineAndroidSessionRef.current = handleRacineSauvegarde;
    return {
      type: "photocartel",
      dossierPhotoCartel: handleRacineSauvegarde,
      source: "indexeddb",
    };
  }

  if (
    estHandleDcimValide(photoCartelHandleDcimSessionRef.current) &&
    (await handleDcimEncoreAutorise(photoCartelHandleDcimSessionRef.current, { demanderPermissionSiNecessaire }))
  ) {
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

  if (
    photoCartelHandleDcimSessionRef.current &&
    !estHandleDcimValide(photoCartelHandleDcimSessionRef.current)
  ) {
    photoCartelHandleDcimSessionRef.current = null;
  }

  let handleDcimSauvegarde = await lireHandleDcimAndroid();
  if (handleDcimSauvegarde && !estHandleDcimValide(handleDcimSauvegarde)) {
    await supprimerHandleAndroid(NOM_HANDLE_DCIM_HISTORIQUE);
    handleDcimSauvegarde = null;
  }

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

  // v42.0.10 : l’identifiant reste volontairement stable afin que Chrome
  // puisse mémoriser le dernier emplacement choisi. Quand un handle connu
  // existe encore, il est utilisé comme point de départ. Après une
  // réinstallation complète, Android peut néanmoins imposer une première
  // navigation manuelle : PhotoCartel ne peut pas la court-circuiter.
  const dossierDepartSelecteur =
    handleRacineSauvegarde || handleDcimSauvegarde || "pictures";

  const dossierChoisi = await window.showDirectoryPicker({
    id: "photocartel-racine-v38-2",
    mode: "readwrite",
    startIn: dossierDepartSelecteur,
  });

  if (dossierChoisi.name === "PhotoCartel") {
    return installerContexteStockageAndroid({
      type: "photocartel",
      dossierPhotoCartel: dossierChoisi,
      source: "selection-photocartel",
    });
  }

  if (dossierChoisi.name === "DCIM") {
    const { dossierPhotoCartel } = await creerArborescenceInfrastructurePhotoCartel(dossierChoisi);
    return installerContexteStockageAndroid({
      type: "dcim",
      dossierDcim: dossierChoisi,
      dossierPhotoCartel,
      source: "selection-dcim",
    });
  }

  throw new Error(
    "Mauvais dossier sélectionné. Dossier reçu : " +
      dossierChoisi.name +
      ". Sélectionne directement DCIM ou le dossier PhotoCartel situé dans DCIM."
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
  // v38.4 : cette fonction est appelée directement depuis le clic « Créer la visite ».
  // Le geste utilisateur permet donc de réactiver immédiatement l’autorisation du
  // handle PhotoCartel/DCIM mémorisé, sans ouvrir le sélecteur sur un sous-dossier.
  const resultatRacineAndroid = await obtenirDossierRacinePhotoCartelAndroid({
    demanderPermissionSiNecessaire: true,
  });
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
  const writable = await fichierHandle.createWritable({ keepExistingData: false });
  let ecritureTerminee = false;
  try {
    await writable.write(blob);
    await writable.close();
    ecritureTerminee = true;
  } finally {
    if (!ecritureTerminee) {
      try {
        await writable.abort();
      } catch (abortError) {
        console.warn("Annulation d’écriture Android impossible :", nomFichier, abortError);
      }
    }
  }
  return nomFichier;
}

async function enregistrerPhotosVisiteDansCollecteAndroid(fichiers) {
  // v38.13 : l'enregistrement déclenché au retour de l'appareil photo ne doit
  // jamais ouvrir un sélecteur ni demander une nouvelle autorisation.
  // Il réutilise exclusivement le handle racine validé avant l'ouverture de la caméra.
  const resultatRacineAndroid = await obtenirDossierRacinePhotoCartelAndroid({
    ouvrirSelecteurSiNecessaire: false,
    demanderPermissionSiNecessaire: false,
  });

  if (!resultatRacineAndroid) {
    throw new Error(
      "L’accès au dossier PhotoCartel n’est plus disponible. Reviens dans PhotoCartel puis appuie de nouveau sur Prendre des photos pour réautoriser la racine."
    );
  }

  await validerCollecteVisiteAndroid(resultatRacineAndroid, "retour-camera");
  const dossierPhotoCartel = resultatRacineAndroid.dossierPhotoCartel;

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

async function handlePrendreDesPhotos() {
  if (!voyage) {
    alert("Crée d'abord un voyage.");
    return;
  }

  if (!lieuVisite || !cheminCollecteActif) {
    setModeAucuneVisite(true);
    return;
  }

  try {
    // v38.13 : la permission de stockage est vérifiée/réactivée pendant le clic
    // utilisateur, AVANT l'ouverture de l'appareil photo. Le retour de la caméra
    // peut ainsi enregistrer immédiatement la photo sans nouvelle boîte système.
    if (estAndroid()) {
      const resultatRacineAndroid = await obtenirDossierRacinePhotoCartelAndroid({
        ouvrirSelecteurSiNecessaire: true,
        demanderPermissionSiNecessaire: true,
      });

      if (!resultatRacineAndroid) {
        throw new Error("Le dossier racine PhotoCartel n’est pas autorisé.");
      }

      // v39 : la caméra ne s’ouvre qu’après une validation réelle de la collecte.
      await validerCollecteVisiteAndroid(resultatRacineAndroid, "avant-prise-photo");
    }

    if (!localStorage.getItem("photoCartelDebutVisiteMs")) {
      localStorage.setItem("photoCartelDebutVisiteMs", String(Date.now()));
    }

    setDerniereActionVisite("Appareil photo ouvert le " + formaterDate(new Date()) + ". Reviens ensuite dans PhotoCartel pour ranger les photos de la visite.");
    ouvrirAppareilPhoto();
  } catch (error) {
    if (error?.name === "AbortError") return;
    console.error("Autorisation avant prise de photo :", error);
    setDerniereActionVisite(
      "Impossible d’ouvrir l’appareil photo : " + (error?.message || String(error))
    );
  }
}

function ouvrirInputAnalysePhoto(inputRef) {
  const input = inputRef.current;

  if (input) {
    input.value = null;
    input.click();
  }
}

async function handleAnalyserUnePhoto() {
  // v50.3 — retour de recette, clarification explicite de l'utilisateur : seule une analyse
  // réellement EN COURS (appel IA actif) empêche d'en lancer une autre — c'est la seule règle
  // dure de la V1 (une analyse à la fois). Un résultat déjà reçu mais pas encore enregistré
  // PEUT être abandonné sans confirmation : relancer « Analyser une photo » depuis l'écran de
  // résultat signifie que l'utilisateur a changé d'avis, et PhotoCartel doit obéir immédiatement.
  // (Les gardes précédentes sur l'état « terminée » ont été retirées : ce n'était pas un bug.)
  if (etatTacheAnalyseIA === "en_cours") {
    retourAccueil();
    setModeAnalysePhoto(true);
    setMessageAnalysePhoto("Une analyse IA est déjà en cours.");
    return;
  }

  // v34.6 : on réutilise silencieusement un accès encore valide.
  // Si aucun accès n'est disponible, on affiche un écran explicite avec un bouton
  // utilisateur dédié. showDirectoryPicker() n'est jamais appelé après la sélection
  // d'une photo ni depuis une chaîne asynchrone dépourvue de geste utilisateur.
  // v50 : ce parcours revient toujours à l'accueil une fois résolu (pas de contexte
  // particulier à restaurer, contrairement au déclenchement depuis la galerie d'une visite).
  // v50.3 : forcer:true — un éventuel résultat terminé mais pas enregistré est abandonné
  // volontairement et immédiatement (l'utilisateur a changé d'avis), pas juste masqué.
  analyseContexteRetourRef.current = null;
  fermerAnalysePhoto({ forcer: true });
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
          await installerContexteStockageAndroid({
            type: "photocartel",
            dossierPhotoCartel: handleCandidat,
            source: "reactivation-analyse-photocartel",
          });
        } else if (handleCandidat.name === "DCIM") {
          const { dossierPhotoCartel } = await creerArborescenceInfrastructurePhotoCartel(handleCandidat);
          await installerContexteStockageAndroid({
            type: "dcim",
            dossierDcim: handleCandidat,
            dossierPhotoCartel,
            source: "reactivation-analyse-dcim",
          });
        }

        autorisationStockageHandleCandidatRef.current = null;
        setModeAutorisationStockageAnalyse(false);
        setDiagnosticStockageV39(
          `Accès rétabli. La visite « ${lieuVisite || "en cours"} » et son compteur sont conservés.`
        );
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
      await installerContexteStockageAndroid({
        type: "photocartel",
        dossierPhotoCartel: dossierChoisi,
        source: "selection-analyse-photocartel",
      });
    } else if (dossierChoisi.name === "DCIM") {
      const { dossierPhotoCartel } = await creerArborescenceInfrastructurePhotoCartel(dossierChoisi);
      await installerContexteStockageAndroid({
        type: "dcim",
        dossierDcim: dossierChoisi,
        dossierPhotoCartel,
        source: "selection-analyse-dcim",
      });
    } else {
      throw new Error(
        "Mauvais dossier sélectionné : " + dossierChoisi.name +
        ". Reviens à DCIM puis sélectionne le dossier racine PhotoCartel, pas Voyages ni un autre sous-dossier."
      );
    }

    autorisationStockageHandleCandidatRef.current = null;
    setModeAutorisationStockageAnalyse(false);
    setDiagnosticStockageV39(
      `Accès rétabli. La visite « ${lieuVisite || "en cours"} » et son compteur sont conservés.`
    );
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

async function finaliserAnalysePhotoAndroid({
  fichier,
  analyse,
  timestampInitial,
  nomPhotoAAnalyser,
  datePhotoIso,
  datePhotoLocale,
  analyseModifiee = false,
}) {
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
  const suffixeAnalyse = analyseModifiee ? "PHOTO_ANALYSEE_MODIFIEE" : "PHOTO_ANALYSEE";
  const nomPhoto = `${timestampInitial}_${suffixeAnalyse}.jpeg`;
  const nomJson = `${timestampInitial}_${suffixeAnalyse}.json`;
  const metadonnees = {
    type_document: analyseModifiee ? "PHOTO_ANALYSEE_MODIFIEE" : "PHOTO_ANALYSEE",
    statut_analyse: analyseModifiee ? "MODIFIEE" : "ANALYSEE",
    version_photocartel: VERSION.numero,
    timestamp_initial: timestampInitial,
    date_photo_iso: datePhotoIso || "",
    date_photo_locale: datePhotoLocale || "",
    date_analyse_iso: new Date().toISOString(),
    date_analyse_locale: formaterDateHeurePhoto(new Date()),
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

async function modifierAnalysePhotoAndroid({
  fichier,
  analyse,
  timestampInitial,
  ancienNomPhoto,
  ancienNomJson,
  resultatRacineAndroidPreautorise,
  datePhotoIso,
  datePhotoLocale,
}) {
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
    date_photo_iso: datePhotoIso || "",
    date_photo_locale: datePhotoLocale || "",
    date_analyse_iso: new Date().toISOString(),
    date_analyse_locale: formaterDateHeurePhoto(new Date()),
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

// v50 — fonction unique de démarrage d'une session d'analyse IA, partagée par :
// - le parcours historique « Analyser une photo » (caméra ou fichier), écran dédié affiché ;
// - le futur déclenchement depuis la galerie d'une visite, sans quitter la galerie
//   (afficherEcran: false, lancementAutomatique: true).
// Cette fonction ne fait que PRÉPARER la photo (état "preparation") ; lancerAnalysePhotoIA()
// reste seule responsable de l'appel IA proprement dit, sauf si lancementAutomatique est demandé.
async function demarrerSessionAnalyseIA(fichier, options = {}) {
  const { origine = "fichier", afficherEcran = true, lancementAutomatique = false } = options;

  if (!fichier) return;

  analysePhotoSessionActiveRef.current = true;
  analysePhotoOrigineRef.current = origine;
  analyseIAVisiteOrigineRef.current = (typeof lieuVisite === "string" ? lieuVisite : "") || "";

  const imageLocaleUrl = URL.createObjectURL(fichier);
  const datePhoto = fichier.lastModified ? new Date(fichier.lastModified) : new Date();
  const timestampInitial = genererTimestampSessionAnalyse(new Date());

  setModeChoixActionAnalysePhoto(false);
  setAnalysePhotoFile(fichier);
  setAnalysePhotoUrl(imageLocaleUrl);
  setAnalysePhotoResultat(null);
  setAnalysePhotoSauvegardee(false);
  setAnalysePhotoEdition(false);
  analysePhotoResultatInitialRef.current = null;
  analysePhotoAvantEditionRef.current = null;
  analysePhotoModifieeAvantEditionRef.current = false;
  analysePhotoModifieeRef.current = false;
  setAnalysePhotoModifiee(false);
  setAnalysePhotoNomAnalysee("");
  setAnalysePhotoNomJson("");
  setAnalysePhotoNomAAnalyser("");
  setAnalysePhotoTimestampInitial(timestampInitial);
  setDatePhotoAnalyseIso(datePhoto.toISOString());
  setDateHeurePhotoAnalyse(formaterDateHeurePhoto(datePhoto));
  setDateHeureAnalyseIA("");
  setEtatTacheAnalyseIA("preparation");
  setAnalysePhotoEnCours(false);
  setMessageAnalysePhoto("");

  if (afficherEcran) {
    setModeAnalysePhoto(true);
  }

  let nomPhotoAAnalyser = "";

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
    nomPhotoAAnalyser = data.nomPhoto || "";
    setAnalysePhotoNomAAnalyser(nomPhotoAAnalyser);
  } catch (error) {
    console.error(error);
    setAnalysePhotoNomAAnalyser("");
    setEtatTacheAnalyseIA("echouee");
    setMessageAnalysePhoto(
      "La photo n’a pas pu être enregistrée dans Photos à analyser. Reviens à Analyser une photo pour rétablir l’accès au dossier PhotoCartel. Détail : " + error.message
    );
    return;
  }

  if (lancementAutomatique) {
    await lancerAnalysePhotoIA({ fichierForce: fichier, nomAAnalyserForce: nomPhotoAAnalyser });
  }
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

  try {
    await demarrerSessionAnalyseIA(fichier, {
      origine: analysePhotoOrigineRef.current || "fichier",
      afficherEcran: true,
    });
  } finally {
    event.target.value = "";
  }
}

// v50 — lancerAnalysePhotoIA ne dépend plus de l'écran d'analyse : elle peut être appelée
// alors que l'utilisateur a déjà quitté l'écran (photo prise, puis retour immédiat à la visite),
// ou juste après demarrerSessionAnalyseIA sans attendre le prochain rendu (fichierForce / nomAAnalyserForce).
async function lancerAnalysePhotoIA(options = {}) {
  const fichier = options.fichierForce || analysePhotoFile;
  const nomAAnalyser =
    options.nomAAnalyserForce !== undefined ? options.nomAAnalyserForce : analysePhotoNomAAnalyser;

  if (!fichier || analysePhotoEnCours || etatTacheAnalyseIA === "en_cours") return;

  if (estAndroid() && !nomAAnalyser) {
    setEtatTacheAnalyseIA("echouee");
    setMessageAnalysePhoto(
      "L’analyse ne peut pas démarrer car la photo n’est pas enregistrée dans Photos à analyser. Relance Analyser une photo pour rétablir l’accès au dossier PhotoCartel."
    );
    return;
  }

  const controller = new AbortController();
  analysePhotoAbortControllerRef.current = controller;
  setAnalysePhotoEnCours(true);
  setEtatTacheAnalyseIA("en_cours");
  setMessageAnalysePhoto("");

  try {
    const formData = new FormData();
    formData.append("photo", fichier, fichier.name || "photo.jpg");

    const response = await fetch(API_BASE + "/analyser-photo-one-shot", {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    const data = await lireReponseJsonPhotoCartel(response, "Erreur analyse photo");
    if (!response.ok || !data.success) {
      throw new Error(data.error || "Erreur analyse IA");
    }

    // v35.4 : résultat provisoire uniquement.
    // Aucun fichier n'est créé dans « Photos analysées » avant le clic
    // sur « Enregistrer l'analyse ».
    // v50 : « terminée » (résultat récupérable) est distinct de « enregistrée » (fichiers écrits,
    // voir enregistrerAnalysePhoto). Le bandeau global ne réagit qu'à cet état "terminee".
    const analyseFinale = synchroniserAnalysePourSauvegarde(data.result);
    analysePhotoResultatInitialRef.current = clonerAnalysePhoto(analyseFinale);
    setAnalysePhotoResultat(analyseFinale);
    setDateHeureAnalyseIA(formaterDateHeurePhoto(new Date()));
    setAnalysePhotoSauvegardee(false);
    analysePhotoModifieeRef.current = false;
    setAnalysePhotoModifiee(false);
    setAnalysePhotoNomAnalysee("");
    setAnalysePhotoNomJson("");
    setEtatTacheAnalyseIA("terminee");
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error);
      setMessageAnalysePhoto("Erreur analyse photo : " + error.message);
      setEtatTacheAnalyseIA("echouee");
    } else {
      // Interruption explicite (interrompreAnalysePhotoIA) : la photo reste préparée,
      // prête à être relancée. La version « analyse interrompue » à part entière est différée.
      setEtatTacheAnalyseIA("preparation");
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
  setEtatTacheAnalyseIA(analysePhotoFile ? "preparation" : "aucune");
}

// v50 — retour de recette, scénario 1 : pendant qu'une analyse tourne en arrière-plan,
// « Reprendre la visite » masque l'écran SANS interrompre la tâche (fermerAnalysePhoto non forcé),
// puis rouvre directement l'appareil photo de la visite — on gagne le clic que l'utilisateur
// aurait dû faire lui-même sur « Ouvrir l'appareil photo » depuis l'accueil.
async function reprendreLaVisitePendantAnalyse() {
  fermerAnalysePhoto();
  retourAccueil();

  if (voyage && lieuVisite && cheminCollecteActif) {
    await handlePrendreDesPhotos();
  }
  // Si aucune visite n'est active, l'utilisateur se retrouve simplement sur l'accueil,
  // d'où il peut lancer « Ouvrir l'appareil photo » lui-même.
}

// v50 — fermerAnalysePhoto ne réinitialise plus systématiquement la tâche : si une analyse
// est en cours, ou terminée mais pas encore enregistrée, fermer l'écran ne fait que le masquer.
// La tâche continue en arrière-plan et reste consultable via le bandeau global.
// { forcer: true } conserve l'ancien comportement (fermeture complète), utilisé pour les
// abandons explicites (fermerSansEnregistrerAnalysePhoto) ou une fois la tâche réellement close.
function fermerAnalysePhoto({ forcer = false } = {}) {
  const tacheEnCours = etatTacheAnalyseIA === "en_cours";
  const resultatNonEnregistre =
    etatTacheAnalyseIA === "terminee" && !!analysePhotoResultat && !analysePhotoSauvegardee;

  if (!forcer && (tacheEnCours || resultatNonEnregistre)) {
    setModeAutorisationStockageAnalyse(false);
    setAutorisationStockageAnalyseEnCours(false);
    setModeAnalysePhoto(false);
    setModeChoixActionAnalysePhoto(false);
    setPhotoPleinEcranUrl("");
    return;
  }

  setModeAutorisationStockageAnalyse(false);
  setAutorisationStockageAnalyseEnCours(false);
  analysePhotoAbortControllerRef.current?.abort();
  analysePhotoAbortControllerRef.current = null;
  analysePhotoSessionActiveRef.current = false;
  analysePhotoOrigineRef.current = "";
  analyseIAVisiteOrigineRef.current = "";
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
  analysePhotoResultatInitialRef.current = null;
  analysePhotoModifieeRef.current = false;
  setAnalysePhotoModifiee(false);
  setAnalysePhotoNomAAnalyser("");
  setAnalysePhotoNomAnalysee("");
  setAnalysePhotoNomJson("");
  setAnalysePhotoTimestampInitial("");
  setDatePhotoAnalyseIso("");
  setDateHeurePhotoAnalyse("");
  setDateHeureAnalyseIA("");
  setEtatTacheAnalyseIA("aucune");
}

// v50 — retour de recette : une fois la tâche d'analyse résolue (enregistrée ou abandonnée),
// on revient dans le contexte d'où elle avait été lancée plutôt que systématiquement à l'accueil.
// Pour l'instant, seule l'origine « galerie-visite » a un contexte de retour spécifique ;
// toute autre origine (ou l'absence de contexte mémorisé) retombe sur l'accueil, comme avant.
async function revenirAuContexteApresAnalyse() {
  const contexte = analyseContexteRetourRef.current;
  analyseContexteRetourRef.current = null;

  if (contexte?.type === "galerie-visite" && contexte.visite) {
    await ouvrirGalerieVisiteMaquette(contexte.visite);
    if (contexte.modePhoto) {
      setIndexPhotoGalerieVisite(Math.max(0, contexte.index || 0));
      setModePhotoGalerieVisite(true);
    }
    return;
  }

  retourAccueil();
}

function retourAccueilDepuisAnalysePhoto(options = {}) {
  fermerAnalysePhoto(options);
  revenirAuContexteApresAnalyse();
}

// v50.3 — retour de recette : bouton dédié pour revenir directement à la galerie de la visite
// d'où l'analyse a été lancée, SANS enregistrer ni abandonner le résultat en cours de révision.
// Contrairement à retourAccueilDepuisAnalysePhoto, la tâche n'est pas résolue : fermerAnalysePhoto
// (non forcé) masque juste l'écran, et le contexte de retour reste mémorisé pour un usage ultérieur
// (enregistrer ou relancer plus tard depuis le bandeau).
async function revenirALaGalerieVisiteSansResoudre() {
  const contexte = analyseContexteRetourRef.current;
  if (!contexte || contexte.type !== "galerie-visite" || !contexte.visite) return;

  fermerAnalysePhoto();
  await ouvrirGalerieVisiteMaquette(contexte.visite);
  if (contexte.modePhoto) {
    setIndexPhotoGalerieVisite(Math.max(0, contexte.index || 0));
    setModePhotoGalerieVisite(true);
  }
}

function reprendreAnalysePhoto() {
  // Reprise explicite demandée par l'utilisateur : contrairement à une simple navigation,
  // on referme complètement une éventuelle tâche déjà résolue avant d'en ouvrir une nouvelle.
  fermerAnalysePhoto({ forcer: true });
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
    // Abandon explicite : la tâche est close même si une analyse venait de se terminer.
    retourAccueilDepuisAnalysePhoto({ forcer: true });
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
  analysePhotoModifieeRef.current = true;
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
  analysePhotoModifieeAvantEditionRef.current =
    analysePhotoModifieeRef.current || analysePhotoModifiee;
  setAnalysePhotoEdition(true);
}

function annulerModificationsAnalyse() {
  if (!analysePhotoEdition) return;
  if (analysePhotoAvantEditionRef.current) {
    setAnalysePhotoResultat(clonerAnalysePhoto(analysePhotoAvantEditionRef.current));
  }
  analysePhotoModifieeRef.current = analysePhotoModifieeAvantEditionRef.current;
  setAnalysePhotoModifiee(analysePhotoModifieeAvantEditionRef.current);
  analysePhotoAvantEditionRef.current = null;
  analysePhotoModifieeAvantEditionRef.current = false;
  setAnalysePhotoEdition(false);
  setMessageAnalysePhoto("");
}

async function enregistrerAnalysePhoto() {
  if (!analysePhotoFile || !analysePhotoResultat || analysePhotoSauvegardeEnCours) return;

  if (analysePhotoSauvegardee && !analysePhotoModifiee) {
    // Déjà enregistrée et non modifiée : la tâche est déjà résolue, fermeture complète.
    retourAccueilDepuisAnalysePhoto({ forcer: true });
    return;
  }

  try {
    setAnalysePhotoSauvegardeEnCours(true);
    setMessageAnalysePhoto("");

    const analyseSynchronisee = synchroniserAnalysePourSauvegarde(analysePhotoResultat);
    const analyseInitialeSynchronisee = analysePhotoResultatInitialRef.current
      ? synchroniserAnalysePourSauvegarde(clonerAnalysePhoto(analysePhotoResultatInitialRef.current))
      : null;
    const analyseDiffereDuResultatIAInitial =
      !analysePhotoSauvegardee &&
      analyseInitialeSynchronisee != null &&
      JSON.stringify(analyseSynchronisee) !== JSON.stringify(analyseInitialeSynchronisee);
    const analyseDoitEtreMarqueeModifiee =
      analysePhotoModifieeRef.current ||
      analysePhotoModifiee ||
      analyseDiffereDuResultatIAInitial;
    const datePhotoLocale = dateHeurePhotoAnalyse || formaterDateHeurePhoto(new Date());
    const datePhotoIso = datePhotoAnalyseIso || new Date().toISOString();
    let data;

    if (!analysePhotoSauvegardee) {
      if (estAndroid()) {
        data = await finaliserAnalysePhotoAndroid({
          fichier: analysePhotoFile,
          analyse: analyseSynchronisee,
          timestampInitial: analysePhotoTimestampInitial,
          nomPhotoAAnalyser: analysePhotoNomAAnalyser,
          datePhotoIso,
          datePhotoLocale,
          analyseModifiee: analyseDoitEtreMarqueeModifiee,
        });
      } else {
        const formData = new FormData();
        formData.append("photo", analysePhotoFile, analysePhotoFile.name || "photo.jpeg");
        formData.append("analyse", JSON.stringify(analyseSynchronisee));
        formData.append("analyseInitiale", JSON.stringify(analyseInitialeSynchronisee || {}));
        formData.append("timestampInitial", analysePhotoTimestampInitial);
        formData.append("nomPhotoAAnalyser", analysePhotoNomAAnalyser);
        formData.append("datePhotoIso", datePhotoIso);
        formData.append("datePhotoLocale", datePhotoLocale);
        formData.append("analyseModifiee", analyseDoitEtreMarqueeModifiee ? "true" : "false");
        formData.append("dossierRacine", dossierRacineEnvoyeAuServeur());

        const response = await fetch(API_BASE + "/finaliser-analyse-photo", {
          method: "POST",
          body: formData,
        });

        data = await lireReponseJsonPhotoCartel(response, "Erreur enregistrement analyse");
        if (!response.ok || !data.success) {
          throw new Error(data.error || "Erreur enregistrement analyse");
        }
      }
    } else {
      if (estAndroid()) {
        const resultatRacineAndroidPreautorise =
          await obtenirDossierRacinePhotoCartelAndroid({
            ouvrirSelecteurSiNecessaire: false,
            demanderPermissionSiNecessaire: false,
          });

        if (!resultatRacineAndroidPreautorise) {
          throw new Error(
            "L’accès au dossier racine PhotoCartel n’est plus disponible. Relance Analyser une photo pour le réautoriser."
          );
        }

        data = await modifierAnalysePhotoAndroid({
          fichier: analysePhotoFile,
          analyse: analyseSynchronisee,
          timestampInitial: analysePhotoTimestampInitial,
          ancienNomPhoto: analysePhotoNomAnalysee,
          ancienNomJson: analysePhotoNomJson,
          resultatRacineAndroidPreautorise,
          datePhotoIso,
          datePhotoLocale,
        });
      } else {
        const formData = new FormData();
        formData.append("photo", analysePhotoFile, analysePhotoFile.name || "photo.jpeg");
        formData.append("analyse", JSON.stringify(analyseSynchronisee));
        formData.append("timestampInitial", analysePhotoTimestampInitial);
        formData.append("ancienNomPhoto", analysePhotoNomAnalysee);
        formData.append("ancienNomJson", analysePhotoNomJson);
        formData.append("datePhotoIso", datePhotoIso);
        formData.append("datePhotoLocale", datePhotoLocale);
        formData.append("dossierRacine", dossierRacineEnvoyeAuServeur());

        const response = await fetch(API_BASE + "/modifier-analyse-photo", {
          method: "POST",
          body: formData,
        });

        data = await lireReponseJsonPhotoCartel(response, "Erreur modification analyse");
        if (!response.ok || !data.success) {
          throw new Error(data.error || "Erreur modification analyse");
        }
      }
    }

    setAnalysePhotoResultat(analyseSynchronisee);
    setAnalysePhotoNomAAnalyser("");
    setAnalysePhotoNomAnalysee(data.nomPhoto || "");
    setAnalysePhotoNomJson(data.nomJson || "");
    setDateHeureAnalyseIA(formaterDateHeurePhoto(new Date()));
    setAnalysePhotoEdition(false);
    analysePhotoResultatInitialRef.current = null;
    analysePhotoAvantEditionRef.current = null;
    analysePhotoModifieeAvantEditionRef.current = false;
    analysePhotoModifieeRef.current = false;
    setAnalysePhotoModifiee(false);
    setAnalysePhotoSauvegardee(true);
    setEtatTacheAnalyseIA("aucune");

    // v69 — la galerie n'est plus vidée. Elle l'était jusqu'ici à CHAQUE
    // enregistrement, ce qui imposait une relecture complète du dossier à
    // l'ouverture suivante (le cas « le compteur passe de 60 à 61 »). La fiche
    // qui vient d'être écrite est insérée directement dans le cache de session ;
    // l'index sur disque, lui, est rattrapé par la resynchronisation, qui n'aura
    // qu'une seule fiche à lire.
    const nomJsonEnregistre = data.nomJson || "";

    if (nomJsonEnregistre && galerieAnalysesCacheRef.current.length > 0) {
      const nomPhotoEnregistre = data.nomPhoto || "";
      const ficheEnregistree = {
        nomJson: nomJsonEnregistre,
        nomPhoto: nomPhotoEnregistre,
        datePhotoIso,
        datePhotoLocale,
        dateAnalyseIso: new Date().toISOString(),
        dateAnalyseLocale: formaterDateHeurePhoto(new Date()),
        dossierDestination: estAndroid()
          ? DOSSIER_DESTINATION_GALERIE_ANDROID
          : data.dossierDestination || "",
        imageExiste: true,
        imageUrl: estAndroid()
          ? ""
          : `/photo-analysee/${encodeURIComponent(
              nomPhotoEnregistre
            )}?dossierRacine=${encodeURIComponent(
              dossierRacineGalerieEnvoyeAuServeur()
            )}&v=${encodeURIComponent(Date.now())}`,
        imageUrlLocale: estAndroid(),
        analyseModifiee: analyseDoitEtreMarqueeModifiee,
        analyse: analyseSynchronisee,
      };

      // Une modification renomme les fichiers : l'ancienne entrée doit disparaître,
      // et une réécriture sous le même nom ne doit pas produire de doublon.
      const galerieSansAncienneFiche = galerieAnalysesCacheRef.current.filter(
        (element) =>
          element.nomJson !== nomJsonEnregistre &&
          (!analysePhotoNomJson || element.nomJson !== analysePhotoNomJson)
      );

      const nouvelleGalerie = trierFichesGalerie([
        ...galerieSansAncienneFiche,
        ficheEnregistree,
      ]);

      galerieAnalysesCacheRef.current = nouvelleGalerie;
      setGalerieAnalyses(nouvelleGalerie);
      setGalerieIndex(0);
    }

    // Enregistrement réussi : la tâche d'analyse est réellement résolue (« enregistrée »,
    // distincte de « terminée »), fermeture complète sans dépendre de l'état pas encore
    // re-rendu (forcer: true évite toute lecture d'un état React périmé dans le même tick).
    retourAccueilDepuisAnalysePhoto({ forcer: true });
  } catch (error) {
    console.error("Erreur enregistrement analyse :", error);
    setMessageAnalysePhoto("Erreur enregistrement analyse : " + error.message);
    window.alert("L’analyse n’a pas pu être enregistrée. " + error.message);
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


async function modifierAnalyseGalerieAndroid({ fiche, analyse }) {
  const resultatRacineAndroid = await obtenirDossierRacinePhotoCartelAndroid({
    ouvrirSelecteurSiNecessaire: false,
    demanderPermissionSiNecessaire: false,
  });

  if (!resultatRacineAndroid) {
    throw new Error(
      "L’accès au dossier PhotoCartel n’est plus disponible. Relance Analyser une photo pour le réautoriser."
    );
  }

  const dossierPhotoCartel = resultatRacineAndroid.dossierPhotoCartel;
  const dossierPhotosAnalysees = await dossierPhotoCartel.getDirectoryHandle(
    "Photos analysées",
    { create: true }
  );
  const nomJsonInitial = String(fiche?.nomJson || "").trim();

  if (!nomJsonInitial) {
    throw new Error("Nom du fichier JSON manquant.");
  }

  const handleJson = await dossierPhotosAnalysees.getFileHandle(nomJsonInitial);
  const fichierJson = await handleJson.getFile();
  const contenuExistant = JSON.parse(await fichierJson.text());
  const nomPhotoInitial = String(
    fiche?.nomPhoto || contenuExistant.nom_photo_sauvegardee || ""
  ).trim();

  if (!nomPhotoInitial) {
    throw new Error("Nom de la photo associée manquant.");
  }

  const extensionJson = nomJsonInitial.match(/\.[^.]+$/)?.[0] || ".json";
  const extensionPhoto = nomPhotoInitial.match(/\.[^.]+$/)?.[0] || ".jpeg";
  const baseInitial = nomJsonInitial.slice(0, -extensionJson.length);
  const dejaModifiee = /_MODIFIEE$/i.test(baseInitial);
  const baseFinal = dejaModifiee ? baseInitial : `${baseInitial}_MODIFIEE`;
  const nomJsonFinal = `${baseFinal}.json`;
  const nomPhotoFinal = `${baseFinal}${extensionPhoto}`;

  if (!dejaModifiee) {
    try {
      await dossierPhotosAnalysees.getFileHandle(nomJsonFinal, { create: false });
      throw new Error("Le fichier JSON renommé existe déjà.");
    } catch (error) {
      if (error?.name !== "NotFoundError") throw error;
    }

    try {
      await dossierPhotosAnalysees.getFileHandle(nomPhotoFinal, { create: false });
      throw new Error("La photo renommée existe déjà.");
    } catch (error) {
      if (error?.name !== "NotFoundError") throw error;
    }

    const handlePhotoInitial = await dossierPhotosAnalysees.getFileHandle(nomPhotoInitial);
    const fichierPhotoInitial = await handlePhotoInitial.getFile();
    await ecrireBlobDansDossierAndroid(
      dossierPhotosAnalysees,
      nomPhotoFinal,
      fichierPhotoInitial
    );
  }

  const maintenant = new Date();
  const dateAnalyseIso = maintenant.toISOString();
  const dateAnalyseLocale = formaterDateHeurePhoto(maintenant);
  const contenuModifie = {
    ...contenuExistant,
    statut_analyse: "MODIFIEE",
    version_photocartel: VERSION.numero,
    date_analyse_iso: dateAnalyseIso,
    date_analyse_locale: dateAnalyseLocale,
    date_modification_iso: dateAnalyseIso,
    date_modification_locale: dateAnalyseLocale,
    nom_photo_sauvegardee: nomPhotoFinal,
    nom_json_sauvegarde: nomJsonFinal,
    analyse,
  };

  await ecrireBlobDansDossierAndroid(
    dossierPhotosAnalysees,
    nomJsonFinal,
    new Blob([JSON.stringify(contenuModifie, null, 2)], {
      type: "application/json",
    })
  );

  if (!dejaModifiee) {
    await dossierPhotosAnalysees.removeEntry(nomPhotoInitial);
    await dossierPhotosAnalysees.removeEntry(nomJsonInitial);
  }

  // v69 — plus d'ouverture de la photo ni d'URL objet ici : l'image de la fiche
  // affichée est désormais chargée à la demande, et le nom de photo renvoyé
  // ci-dessous suffit à la retrouver.
  return {
    success: true,
    nomJson: nomJsonFinal,
    nomPhoto: nomPhotoFinal,
    dateAnalyseIso,
    dateAnalyseLocale,
    fichiersRenommes: !dejaModifiee,
    imageUrlLocale: true,
  };
}

function entrerModeModificationAnalyseGalerie() {
  const fiche = galerieAnalyses[galerieIndex];
  if (!fiche || galerieChargement || galerieSauvegardeEnCours || analysePhotoEdition) return;

  const analyseCourante = clonerAnalysePhoto(fiche.analyse || {});
  setAnalysePhotoResultat(analyseCourante);
  analysePhotoAvantEditionRef.current = clonerAnalysePhoto(analyseCourante);
  analysePhotoModifieeAvantEditionRef.current = false;
  analysePhotoModifieeRef.current = false;
  setAnalysePhotoModifiee(false);
  setAnalysePhotoEdition(true);
  setMessageGalerieAnalyses("");
}

function annulerModificationsAnalyseGalerie() {
  annulerModificationsAnalyse();
  setMessageGalerieAnalyses("");
}

async function enregistrerAnalyseGalerie() {
  const fiche = galerieAnalyses[galerieIndex];
  if (
    !fiche ||
    !analysePhotoResultat ||
    !analysePhotoEdition ||
    !analysePhotoModifiee ||
    galerieSauvegardeEnCours
  ) {
    return;
  }

  try {
    setGalerieSauvegardeEnCours(true);
    setMessageGalerieAnalyses("");

    const analyseSynchronisee = synchroniserAnalysePourSauvegarde(analysePhotoResultat);
    let data;

    if (estAndroid()) {
      data = await modifierAnalyseGalerieAndroid({
        fiche,
        analyse: analyseSynchronisee,
      });
    } else {
      const response = await fetch(API_BASE + "/modifier-analyse-galerie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomJson: fiche.nomJson,
          analyse: analyseSynchronisee,
          dossierRacine: dossierRacineGalerieEnvoyeAuServeur(),
        }),
      });

      data = await lireReponseJsonPhotoCartel(
        response,
        "Erreur modification de l’analyse dans la galerie"
      );

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Erreur modification de l’analyse dans la galerie");
      }
    }

    // v69 — côté Android, une fiche ne porte plus d'URL d'image : elle est vide,
    // et l'image de la fiche affichée est créée à la demande à partir de nomPhoto.
    // Il n'y a donc plus rien à révoquer ici. Côté PC, l'URL HTTP est inchangée.
    const nouvelleImageUrl = estAndroid()
      ? ""
      : data.nomPhoto
        ? `/photo-analysee/${encodeURIComponent(data.nomPhoto)}?dossierRacine=${encodeURIComponent(
            dossierRacineGalerieEnvoyeAuServeur()
          )}&v=${encodeURIComponent(data.dateAnalyseIso || Date.now())}`
        : fiche.imageUrl;

    const ficheMiseAJour = {
      ...fiche,
      analyse: analyseSynchronisee,
      dateAnalyseIso: data.dateAnalyseIso || new Date().toISOString(),
      dateAnalyseLocale: data.dateAnalyseLocale || formaterDateHeurePhoto(new Date()),
      nomJson: data.nomJson || fiche.nomJson,
      nomPhoto: data.nomPhoto || fiche.nomPhoto,
      imageExiste: true,
      imageUrl: nouvelleImageUrl,
      imageUrlLocale: estAndroid(),
      analyseModifiee: true,
    };

    // Le renommage en _MODIFIEE change dateAnalyseIso : la fiche remonte donc en
    // tête, et l'ordre affiché doit être recalculé pour rester celui de l'index.
    const nouvelleGalerie = trierFichesGalerie(
      galerieAnalyses.map((element, index) =>
        index === galerieIndex ? ficheMiseAJour : element
      )
    );

    galerieAnalysesCacheRef.current = nouvelleGalerie;
    setGalerieAnalyses(nouvelleGalerie);
    // v69 — la liste ayant été retriée, l'index courant doit suivre la fiche qui
    // vient d'être modifiée, sinon l'écran bascule sur une autre fiche.
    const indexFicheModifiee = nouvelleGalerie.findIndex(
      (element) => element.nomJson === ficheMiseAJour.nomJson
    );
    if (indexFicheModifiee >= 0) {
      setGalerieIndex(indexFicheModifiee);
    }
    // v70 — le renommage en _MODIFIEE change le nom de la photo : il faut recharger
    // l'image, sinon la fiche resterait sur l'ancienne URL, désormais périmée.
    chargerImageGalerieAndroid(ficheMiseAJour.nomPhoto);
    setAnalysePhotoResultat(clonerAnalysePhoto(analyseSynchronisee));
    setAnalysePhotoEdition(false);
    analysePhotoModifieeRef.current = false;
    setAnalysePhotoModifiee(false);
    analysePhotoAvantEditionRef.current = null;
    analysePhotoModifieeAvantEditionRef.current = false;
    setMessageGalerieAnalyses("Analyse modifiée et enregistrée.");
  } catch (error) {
    console.error("Erreur enregistrement analyse depuis la galerie :", error);
    setMessageGalerieAnalyses("Erreur enregistrement : " + error.message);
    window.alert("L’analyse n’a pas pu être enregistrée. " + error.message);
  } finally {
    setGalerieSauvegardeEnCours(false);
  }
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

// v69 — Accès unique au dossier « Photos analysées » côté Android, partagé par la
// lecture complète, la resynchronisation, la lecture de l'index et le chargement
// paresseux d'une image. Renvoie un FileSystemDirectoryHandle.
// v69.1 — la vérification de l'infrastructure est devenue optionnelle. Elle crée
// les onze dossiers de PhotoCartel et n'a de sens qu'au chargement de la galerie,
// pas à chaque changement de fiche : c'est elle, et non l'ouverture de l'image,
// qui empêchait la photo de la fiche affichée d'être chargée à temps.
// Le handle obtenu est mémorisé pour la session dans dossierPhotosAnalyseesAndroidRef.
async function obtenirDossierPhotosAnalyseesAndroid({
  demanderPermission = true,
  verifierInfrastructure = true,
} = {}) {
  const resultatRacineAndroid = await obtenirDossierRacinePhotoCartelAndroid({
    ouvrirSelecteurSiNecessaire: false,
    demanderPermissionSiNecessaire: demanderPermission,
  });

  if (!resultatRacineAndroid) {
    throw new Error(
      "L’accès au dossier PhotoCartel n’est pas disponible. Utilise une fois « Analyser une photo » pour autoriser PhotoCartel."
    );
  }

  const dossierPhotoCartel = resultatRacineAndroid.dossierPhotoCartel;

  if (verifierInfrastructure) {
    await verifierInfrastructureDansPhotoCartelAndroid(dossierPhotoCartel);
  }

  const dossierPhotosAnalysees = await dossierPhotoCartel.getDirectoryHandle(
    "Photos analysées",
    { create: true }
  );

  dossierPhotosAnalyseesAndroidRef.current = dossierPhotosAnalysees;

  return dossierPhotosAnalysees;
}

// ————————————————————————————————————————————————————————————————————————
// v72 — CACHE NAVIGATEUR DE LA GALERIE (IndexedDB)
//
// Le fichier d'index posé dans « Photos analysées » reste la source qui voyage
// avec le dossier entre le téléphone et C:. Mais l'ouvrir demande un accès au
// système de fichiers Android, lent au premier accès d'une session : c'était
// l'essentiel des dix secondes constatées en recette après réouverture de l'app.
//
// Une copie des mêmes fiches est donc gardée dans le navigateur lui-même. La
// galerie s'affiche à partir de cette copie, sans aucun accès au dossier, puis la
// resynchronisation habituelle vérifie le dossier en arrière-plan et corrige.
//
// Ce cache n'est JAMAIS la vérité : il ne fait qu'avancer l'affichage. Le dossier
// reste l'unique source, et toute divergence est réglée en sa faveur.
// ————————————————————————————————————————————————————————————————————————

const NOM_BASE_CACHE_GALERIE = "PhotoCartelGalerie";
const NOM_STORE_CACHE_GALERIE = "galerie";
const CLE_CACHE_GALERIE = "photos-analysees";
const VERSION_FORMAT_CACHE_GALERIE = 1;

function baseIndexedDbGalerie() {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      resolve(null);
      return;
    }

    try {
      const requete = window.indexedDB.open(NOM_BASE_CACHE_GALERIE, 1);

      requete.onupgradeneeded = () => {
        const base = requete.result;
        if (!base.objectStoreNames.contains(NOM_STORE_CACHE_GALERIE)) {
          base.createObjectStore(NOM_STORE_CACHE_GALERIE);
        }
      };

      requete.onsuccess = () => resolve(requete.result);
      requete.onerror = () => resolve(null);
    } catch (error) {
      resolve(null);
    }
  });
}

async function lireCacheGalerieNavigateur() {
  try {
    const base = await baseIndexedDbGalerie();
    if (!base) return null;

    const contenu = await new Promise((resolve) => {
      try {
        const requete = base
          .transaction(NOM_STORE_CACHE_GALERIE, "readonly")
          .objectStore(NOM_STORE_CACHE_GALERIE)
          .get(CLE_CACHE_GALERIE);
        requete.onsuccess = () => resolve(requete.result || null);
        requete.onerror = () => resolve(null);
      } catch (error) {
        resolve(null);
      }
    });

    if (!contenu || typeof contenu !== "object") return null;
    if (Number(contenu.version_format_cache) !== VERSION_FORMAT_CACHE_GALERIE) return null;
    if (Number(contenu.version_format_index) !== VERSION_FORMAT_INDEX_GALERIE) return null;
    if (!Array.isArray(contenu.fiches)) return null;

    return contenu.fiches
      .filter((fiche) => fiche && estNomJsonFicheGalerie(fiche.nomJson))
      .map(normaliserFichePourIndexGalerie);
  } catch (error) {
    return null;
  }
}

async function ecrireCacheGalerieNavigateur(fiches) {
  try {
    const base = await baseIndexedDbGalerie();
    if (!base) return false;

    const contenu = {
      version_format_cache: VERSION_FORMAT_CACHE_GALERIE,
      version_format_index: VERSION_FORMAT_INDEX_GALERIE,
      version_photocartel: VERSION_PHOTOCARTEL,
      date_cache_iso: new Date().toISOString(),
      fiches: (Array.isArray(fiches) ? fiches : []).map(
        normaliserFichePourIndexGalerie
      ),
    };

    return await new Promise((resolve) => {
      try {
        const requete = base
          .transaction(NOM_STORE_CACHE_GALERIE, "readwrite")
          .objectStore(NOM_STORE_CACHE_GALERIE)
          .put(contenu, CLE_CACHE_GALERIE);
        requete.onsuccess = () => resolve(true);
        requete.onerror = () => resolve(false);
      } catch (error) {
        resolve(false);
      }
    });
  } catch (error) {
    // Le cache est une optimisation : son échec ne doit jamais bloquer la galerie.
    return false;
  }
}

// Habille des fiches nues (cache navigateur ou index) pour l'affichage Android.
function habillerFichesGalerieAndroid(fiches) {
  return trierFichesGalerie(
    (Array.isArray(fiches) ? fiches : []).map((fiche) => ({
      ...normaliserFichePourIndexGalerie(fiche),
      dossierDestination: DOSSIER_DESTINATION_GALERIE_ANDROID,
      // imageExiste n'est pas stocké : il est supposé vrai jusqu'à ce que la
      // resynchronisation liste le dossier et le recalcule.
      imageExiste: true,
      imageUrl: "",
      imageUrlLocale: true,
    }))
  );
}

// v70 — CHARGEMENT EXPLICITE DE L'IMAGE DE LA FICHE AFFICHÉE (Android).
// En v69, ce chargement reposait sur un effet React censé se réveiller quand la
// fiche affichée changeait. En recette, il ne se déclenchait pas à l'ouverture de
// la galerie : la première fiche restait sans photo, et l'image n'apparaissait
// qu'au premier balayage — puis restait collée aux fiches suivantes.
// Il est désormais appelé explicitement, aux quatre endroits où la fiche affichée
// change : ouverture de la galerie, balayage, modification, suppression. Plus rien
// ne dépend d'un réveil implicite.
async function chargerImageGalerieAndroid(nomPhoto) {
  const nomPhotoDemande = String(nomPhoto || "");

  if (!estAndroid() || !nomPhotoDemande) {
    return;
  }

  // Déjà affichée, ou déjà en cours de chargement : rien à faire.
  if (galerieImageEnCoursRef.current === nomPhotoDemande) {
    return;
  }

  galerieImageEnCoursRef.current = nomPhotoDemande;

  try {
    let dossierPhotosAnalysees = dossierPhotosAnalyseesAndroidRef.current;

    if (!dossierPhotosAnalysees) {
      // v72.1 — demanderPermission: true. Depuis que la galerie s'ouvre depuis le
      // cache du navigateur, plus rien ne touche au dossier avant ce point : c'est
      // ici que la permission Android doit être demandée. Sans cela, à chaque
      // nouvelle session la permission reste à « prompt » et AUCUNE photo ne se
      // charge — régression constatée en recette sur la v72.
      // requestPermission exige un geste utilisateur : ce chargement est toujours
      // déclenché par un clic (ouverture de la galerie) ou un balayage.
      // Sans vérification d'infrastructure : créer les onze dossiers de
      // PhotoCartel n'a rien à faire dans l'affichage d'une image.
      dossierPhotosAnalysees = await obtenirDossierPhotosAnalyseesAndroid({
        demanderPermission: true,
        verifierInfrastructure: false,
      });
    }

    const handlePhoto = await dossierPhotosAnalysees.getFileHandle(nomPhotoDemande);
    const fichierPhoto = await handlePhoto.getFile();

    // La fiche affichée a changé pendant la lecture : ce résultat est périmé.
    if (galerieImageEnCoursRef.current !== nomPhotoDemande) {
      return;
    }

    const ancienneUrl = galerieImageUrlVivanteRef.current;
    const nouvelleUrl = URL.createObjectURL(fichierPhoto);

    galerieImageUrlVivanteRef.current = nouvelleUrl;
    setGalerieImageCourante({ nomPhoto: nomPhotoDemande, url: nouvelleUrl });

    if (ancienneUrl && ancienneUrl !== nouvelleUrl) {
      URL.revokeObjectURL(ancienneUrl);
    }
  } catch (error) {
    // Un handle mémorisé peut avoir été invalidé : on le jette pour que la
    // tentative suivante le résolve à nouveau.
    dossierPhotosAnalyseesAndroidRef.current = null;

    if (galerieImageEnCoursRef.current === nomPhotoDemande) {
      // On inscrit quand même le nom : la fiche s'affiche sans image, et aucune
      // image d'une autre fiche ne peut prendre sa place.
      setGalerieImageCourante({ nomPhoto: nomPhotoDemande, url: "" });
    }
  }
}

// Construit une fiche de galerie à partir du contenu déjà parsé d'un JSON.
// N'OUVRE AUCUNE PHOTO : c'était le coût principal du chargement (une ouverture
// de fichier par fiche, pour 79 images sur 80 qui ne sont jamais affichées).
function construireFicheGalerieDepuisContenuJson(nomEntree, contenu) {
  const nomPhoto =
    contenu.nom_photo_sauvegardee || nomEntree.replace(/\.json$/i, ".jpeg");

  return {
    nomJson: nomEntree,
    nomPhoto,
    datePhotoIso: contenu.date_photo_iso || "",
    datePhotoLocale: contenu.date_photo_locale || "",
    dateAnalyseIso: contenu.date_analyse_iso || contenu.date_modification_iso || "",
    dateAnalyseLocale:
      contenu.date_analyse_locale || contenu.date_modification_locale || "",
    analyseModifiee: estAnalyseGalerieModifiee(contenu, nomEntree, nomPhoto),
    analyse: contenu.analyse || {},
    // v75 — nom de la photo telle qu'elle a été prise, conservé pour rattacher
    // la fiche à sa visite par comparaison de noms. Il n'entre PAS dans l'index
    // de la galerie : normaliserFichePourIndexGalerie ne retient pas ce champ,
    // le fichier d'index reste donc identique à ce qu'il était.
    nomPhotoOriginal: contenu.nom_photo_original || "",
  };
}

// Complète les fiches (issues de l'index ou d'une lecture) avec ce qui dépend de
// la plateforme. imageUrl reste vide : l'URL de l'image est créée à la demande,
// uniquement pour la fiche affichée (voir l'effet de chargement paresseux).
function completerFichesGalerieAndroid(fiches, nomsFichiersDossier) {
  return appliquerPresencePhotosGalerie(
    (Array.isArray(fiches) ? fiches : []).map((fiche) => ({
      ...normaliserFichePourIndexGalerie(fiche),
      dossierDestination: DOSSIER_DESTINATION_GALERIE_ANDROID,
      imageUrl: "",
      imageUrlLocale: true,
    })),
    nomsFichiersDossier
  );
}

// Un seul parcours du dossier : donne à la fois la liste des noms (qui sert à la
// comparaison et au calcul de imageExiste) sans aucun accès supplémentaire.
async function listerNomsFichiersGalerieAndroid(dossierPhotosAnalysees) {
  const nomsFichiers = [];

  for await (const [nomEntree, handleEntree] of dossierPhotosAnalysees.entries()) {
    if (handleEntree.kind !== "file") continue;
    nomsFichiers.push(nomEntree);
  }

  return nomsFichiers;
}

async function lireToutesFichesGalerieAndroid(dossierPhotosAnalysees) {
  const fiches = [];
  const nomsFichiers = [];

  for await (const [nomEntree, handleEntree] of dossierPhotosAnalysees.entries()) {
    if (handleEntree.kind !== "file") continue;
    nomsFichiers.push(nomEntree);
    if (!estNomJsonFicheGalerie(nomEntree)) continue;

    try {
      const fichierJson = await handleEntree.getFile();
      const contenu = JSON.parse(await fichierJson.text());
      fiches.push(construireFicheGalerieDepuisContenuJson(nomEntree, contenu));
    } catch (error) {
      console.error("ERREUR LECTURE FICHE ANDROID =", nomEntree, error);
    }
  }

  return { fiches, nomsFichiers };
}

async function lireFicheGalerieAndroid(dossierPhotosAnalysees, nomEntree) {
  try {
    const handleEntree = await dossierPhotosAnalysees.getFileHandle(nomEntree);
    const fichierJson = await handleEntree.getFile();
    const contenu = JSON.parse(await fichierJson.text());
    return construireFicheGalerieDepuisContenuJson(nomEntree, contenu);
  } catch (error) {
    console.error("ERREUR LECTURE FICHE ANDROID =", nomEntree, error);
    return null;
  }
}

async function lireIndexGalerieAndroid(dossierPhotosAnalysees) {
  try {
    const handleIndex = await dossierPhotosAnalysees.getFileHandle(
      NOM_FICHIER_INDEX_GALERIE
    );
    const fichierIndex = await handleIndex.getFile();
    return lireFichesDepuisContenuIndexGalerie(
      JSON.parse(await fichierIndex.text())
    );
  } catch (error) {
    // Index absent ou illisible : ce n'est pas une erreur, c'est le cas d'une
    // première ouverture ou d'un dossier arrivé du PC sans index.
    return null;
  }
}

async function ecrireIndexGalerieAndroid(dossierPhotosAnalysees, fiches) {
  try {
    await ecrireBlobDansDossierAndroid(
      dossierPhotosAnalysees,
      NOM_FICHIER_INDEX_GALERIE,
      new Blob(
        [
          JSON.stringify(
            construireContenuIndexGalerie(fiches, VERSION_PHOTOCARTEL),
            null,
            2
          ),
        ],
        { type: "application/json" }
      )
    );
    return true;
  } catch (error) {
    // L'index est une optimisation : son écriture ne doit jamais faire échouer
    // l'affichage de la galerie.
    console.warn("Écriture de l’index de la galerie impossible :", error);
    return false;
  }
}

// ————————————————————————————————————————————————————————————————————————
// v78 — RECHERCHE : obtention de l'index, mise à jour en arrière-plan,
// mots ajoutés (C), miniatures.
//
// Une recherche ne touche jamais le disque : elle interroge le moteur préparé
// en mémoire (moteurRechercheRef). L'index arrive, du moins cher au plus cher,
// du cache du navigateur, du fichier posé à la racine de DCIM/PhotoCartel,
// puis d'un parcours complet. Une fois la recherche utilisable, un parcours
// complet tourne en arrière-plan, UNE FOIS par session : s'il trouve des
// photos ou des dossiers nouveaux, le moteur est remplacé sans que l'écran
// n'attende jamais.
// ————————————————————————————————————————————————————————————————————————
const NOM_BASE_CACHE_RECHERCHE = "PhotoCartelRecherche";
const NOM_STORE_CACHE_RECHERCHE = "recherche";
const NOM_STORE_MINIATURES_RECHERCHE = "miniatures";
const CLE_CACHE_RECHERCHE = "index-recherche-format-2";
const CLE_CACHE_MOTS_AJOUTES = "mots-ajoutes";
const VERSION_BASE_CACHE_RECHERCHE = 2;
const TAILLE_MINIATURE_RECHERCHE = 240;

function baseIndexedDbRecherche() {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      resolve(null);
      return;
    }
    try {
      const requete = window.indexedDB.open(NOM_BASE_CACHE_RECHERCHE, VERSION_BASE_CACHE_RECHERCHE);
      requete.onupgradeneeded = () => {
        const base = requete.result;
        if (!base.objectStoreNames.contains(NOM_STORE_CACHE_RECHERCHE)) {
          base.createObjectStore(NOM_STORE_CACHE_RECHERCHE);
        }
        if (!base.objectStoreNames.contains(NOM_STORE_MINIATURES_RECHERCHE)) {
          base.createObjectStore(NOM_STORE_MINIATURES_RECHERCHE);
        }
      };
      requete.onsuccess = () => resolve(requete.result);
      requete.onerror = () => resolve(null);
    } catch (error) {
      resolve(null);
    }
  });
}

async function lireDansBaseRecherche(store, cle) {
  try {
    const base = await baseIndexedDbRecherche();
    if (!base) return null;
    return await new Promise((resolve) => {
      try {
        const requete = base.transaction(store, "readonly").objectStore(store).get(cle);
        requete.onsuccess = () => resolve(requete.result ?? null);
        requete.onerror = () => resolve(null);
      } catch (error) {
        resolve(null);
      }
    });
  } catch (error) {
    return null;
  }
}

async function ecrireDansBaseRecherche(store, cle, valeur) {
  try {
    const base = await baseIndexedDbRecherche();
    if (!base) return false;
    return await new Promise((resolve) => {
      try {
        const requete = base.transaction(store, "readwrite").objectStore(store).put(valeur, cle);
        requete.onsuccess = () => resolve(true);
        requete.onerror = () => resolve(false);
      } catch (error) {
        resolve(false);
      }
    });
  } catch (error) {
    return false;
  }
}

// Parcours complet de DCIM/PhotoCartel côté téléphone, à toutes les profondeurs,
// dossiers techniques exclus (même règle que le serveur : estDossierHorsRecherche).
async function parcourirPhotoCartelAndroid(racine) {
  const dossiers = [];
  const photos = [];
  const parcourir = async (handle, chemin, profondeur) => {
    for await (const [nom, enfant] of handle.entries()) {
      if (enfant.kind === "directory") {
        if (estDossierHorsRecherche(nom, profondeur)) continue;
        const cheminEnfant = chemin ? `${chemin}/${nom}` : nom;
        dossiers.push(cheminEnfant);
        await parcourir(enfant, cheminEnfant, profondeur + 1);
      } else if (enfant.kind === "file" && estFichierImageRecherche(nom)) {
        photos.push({ nom, dossier: chemin });
      }
    }
  };
  await parcourir(racine, "", 0);
  return { dossiers, photos };
}

async function obtenirRacineRechercheAndroid() {
  const resultatRacine = await obtenirDossierRacinePhotoCartelAndroid({
    ouvrirSelecteurSiNecessaire: false,
    demanderPermissionSiNecessaire: true,
  });
  return resultatRacine?.dossierPhotoCartel || null;
}

async function construireIndexRechercheAndroid() {
  const racine = await obtenirRacineRechercheAndroid();
  if (!racine) throw new Error("Le dossier PhotoCartel n’est pas accessible.");

  const parcours = await parcourirPhotoCartelAndroid(racine);

  let fiches = [];
  try {
    const dossierPhotosAnalysees = await obtenirDossierPhotosAnalyseesAndroid({
      verifierInfrastructure: false,
    });
    const resultat = await lireToutesFichesGalerieAndroid(dossierPhotosAnalysees);
    fiches = Array.isArray(resultat?.fiches) ? resultat.fiches : [];
  } catch (error) {
    console.warn("Fiches d’analyse non lues pour la recherche :", error);
  }

  const contenu = construireContenuIndexRecherche(parcours, fiches, VERSION_PHOTOCARTEL);
  try {
    await ecrireBlobDansDossierAndroid(
      racine,
      NOM_FICHIER_INDEX_RECHERCHE,
      new Blob([JSON.stringify(contenu)], { type: "application/json" })
    );
  } catch (error) {
    console.warn("Écriture de l’index de recherche impossible :", error);
  }
  return contenu;
}

async function lireFichierIndexRechercheAndroid() {
  try {
    const racine = await obtenirRacineRechercheAndroid();
    if (!racine) return null;
    const handle = await racine.getFileHandle(NOM_FICHIER_INDEX_RECHERCHE);
    const contenu = JSON.parse(await (await handle.getFile()).text());
    return lireEntreesDepuisContenuIndexRecherche(contenu) ? contenu : null;
  } catch (error) {
    return null;
  }
}

async function lireMotsAjoutesAndroid() {
  try {
    const racine = await obtenirRacineRechercheAndroid();
    if (!racine) return null;
    const handle = await racine.getFileHandle(NOM_FICHIER_MOTS_AJOUTES);
    return lireDepuisContenuMotsAjoutes(JSON.parse(await (await handle.getFile()).text()));
  } catch (error) {
    return null;
  }
}

// PC : le serveur construit l'index de C: et le pose à la racine ; reconstruire
// force un nouveau parcours.
async function obtenirIndexRechercheServeur({ reconstruire = false } = {}) {
  const reponse = await fetch(
    API_BASE +
      "/index-recherche?dossierRacine=" +
      encodeURIComponent(dossierRacineGalerieEnvoyeAuServeur()) +
      (reconstruire ? "&reconstruire=1" : "")
  );
  const data = await lireReponseJsonPhotoCartel(reponse, "Recherche indisponible");
  if (!reponse.ok || !data.success) throw new Error(data.error || "Recherche indisponible");
  return {
    contenu: data.index,
    motsAjoutes: lireDepuisContenuMotsAjoutes(data.motsAjoutes),
  };
}

// Installe un index dans le moteur. Renvoie false si l'index est inexploitable.
function installerIndexRecherche(contenu, motsAjoutes) {
  const index = lireEntreesDepuisContenuIndexRecherche(contenu);
  if (!index) return false;
  const signature = signatureIndexRecherche(index);
  const mots = motsAjoutes && typeof motsAjoutes === "object" ? motsAjoutes : motsAjoutesRechercheRef.current;
  motsAjoutesRechercheRef.current = mots || {};
  indexRechercheRef.current = index;
  signatureIndexRechercheRef.current = signature;
  moteurRechercheRef.current = preparerMoteurRecherche(index, motsAjoutesRechercheRef.current);
  // v80 — un nouvel index invalide les photos déjà préparées pour l'affichage.
  photosRechercheRef.current.clear();
  dossiersRechercheAndroidRef.current.clear();
  setPhotosGrilleRecherche([]);
  resultatRechercheMemoRef.current = { cle: "", resultat: null };
  setRechercheVersionMoteur((valeur) => valeur + 1);
  return true;
}

async function mettreAJourRechercheEnArrierePlan() {
  if (miseAJourRechercheEnCoursRef.current) return;
  miseAJourRechercheEnCoursRef.current = true;
  try {
    let contenu = null;
    let motsAjoutes = null;
    if (estAndroid()) {
      contenu = await construireIndexRechercheAndroid();
      motsAjoutes = await lireMotsAjoutesAndroid();
    } else {
      const resultat = await obtenirIndexRechercheServeur({ reconstruire: true });
      contenu = resultat.contenu;
      motsAjoutes = resultat.motsAjoutes;
    }
    const index = lireEntreesDepuisContenuIndexRecherche(contenu);
    if (!index) return;
    miseAJourRechercheFaiteRef.current = true;
    await ecrireDansBaseRecherche(NOM_STORE_CACHE_RECHERCHE, CLE_CACHE_RECHERCHE, contenu);
    if (motsAjoutes) await ecrireDansBaseRecherche(NOM_STORE_CACHE_RECHERCHE, CLE_CACHE_MOTS_AJOUTES, motsAjoutes);
    const motsChanges =
      motsAjoutes && JSON.stringify(motsAjoutes) !== JSON.stringify(motsAjoutesRechercheRef.current);
    if (signatureIndexRecherche(index) !== signatureIndexRechercheRef.current || motsChanges) {
      installerIndexRecherche(contenu, motsAjoutes || motsAjoutesRechercheRef.current);
    }
    setRechercheEtat("pret");
  } catch (error) {
    console.warn("Mise à jour de la recherche en arrière-plan impossible :", error);
    if (!moteurRechercheRef.current) setRechercheEtat("indisponible");
  } finally {
    miseAJourRechercheEnCoursRef.current = false;
  }
}

// Préparation de la recherche : ce qui est déjà en mémoire répond tout de suite ;
// sinon le cache du navigateur, puis le fichier d'index. La mise à jour complète
// suit toujours, en arrière-plan.
async function preparerRecherche() {
  if (!moteurRechercheRef.current) {
    setRechercheEtat("chargement");
    const [contenuCache, motsCache] = await Promise.all([
      lireDansBaseRecherche(NOM_STORE_CACHE_RECHERCHE, CLE_CACHE_RECHERCHE),
      lireDansBaseRecherche(NOM_STORE_CACHE_RECHERCHE, CLE_CACHE_MOTS_AJOUTES),
    ]);
    let installe = contenuCache ? installerIndexRecherche(contenuCache, motsCache || {}) : false;

    if (!installe) {
      try {
        if (estAndroid()) {
          const contenuFichier = await lireFichierIndexRechercheAndroid();
          if (contenuFichier) {
            installe = installerIndexRecherche(contenuFichier, (await lireMotsAjoutesAndroid()) || {});
          }
        } else {
          const resultat = await obtenirIndexRechercheServeur();
          installe = installerIndexRecherche(resultat.contenu, resultat.motsAjoutes);
          if (installe) {
            await ecrireDansBaseRecherche(NOM_STORE_CACHE_RECHERCHE, CLE_CACHE_RECHERCHE, resultat.contenu);
          }
        }
      } catch (error) {
        console.warn("Index de recherche non lu :", error);
      }
    }
    if (installe) setRechercheEtat("pret");
  }

  if (!miseAJourRechercheFaiteRef.current) {
    mettreAJourRechercheEnArrierePlan();
  }
}

function ouvrirEcranRecherche() {
  setModeBibliotheques(false);
  setMessageMenuAccueil("");
  setCibleMessageMenuAccueil("");
  setRechercheVue("tableau");
  setRechercheMessage("");
  setRechercheDossierMots("");
  setModeRechercheResultats(true);
  preparerRecherche();
}

// C — mots ajoutés à un dossier : enregistrés dans un fichier durable à la
// racine (DCIM/PhotoCartel sur le téléphone, C:\PhotoCartel sur le PC).
async function enregistrerMotsAjoutesRecherche(cheminDossier, mots) {
  const nouveaux = { ...motsAjoutesRechercheRef.current };
  if (mots.length > 0) nouveaux[cheminDossier] = mots;
  else delete nouveaux[cheminDossier];
  const contenu = construireContenuMotsAjoutes(nouveaux, VERSION_PHOTOCARTEL);
  const propres = lireDepuisContenuMotsAjoutes(contenu);

  if (estAndroid()) {
    const racine = await obtenirRacineRechercheAndroid();
    if (!racine) throw new Error("Le dossier PhotoCartel n’est pas accessible.");
    await ecrireBlobDansDossierAndroid(
      racine,
      NOM_FICHIER_MOTS_AJOUTES,
      new Blob([JSON.stringify(contenu)], { type: "application/json" })
    );
  } else {
    const reponse = await fetch(API_BASE + "/mots-ajoutes-recherche", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dossierRacine: dossierRacineGalerieEnvoyeAuServeur(), contenu }),
    });
    const data = await lireReponseJsonPhotoCartel(reponse, "Enregistrement impossible");
    if (!reponse.ok || !data.success) throw new Error(data.error || "Enregistrement impossible");
  }

  await ecrireDansBaseRecherche(NOM_STORE_CACHE_RECHERCHE, CLE_CACHE_MOTS_AJOUTES, propres);
  motsAjoutesRechercheRef.current = propres;
  if (indexRechercheRef.current) {
    moteurRechercheRef.current = preparerMoteurRecherche(indexRechercheRef.current, propres);
    resultatRechercheMemoRef.current = { cle: "", resultat: null };
    setRechercheVersionMoteur((valeur) => valeur + 1);
  }
}

async function ajouterMotRecherche(cheminDossier, texte) {
  const mot = String(texte || "").replace(/\s+/g, " ").trim();
  if (!mot) return;
  const existants = motsAjoutesRechercheRef.current[cheminDossier] || [];
  if (existants.some((existant) => existant.toLowerCase() === mot.toLowerCase())) {
    setRechercheSaisieMot("");
    return;
  }
  try {
    setRechercheMessageMot("");
    await enregistrerMotsAjoutesRecherche(cheminDossier, [...existants, mot]);
    setRechercheSaisieMot("");
  } catch (error) {
    setRechercheMessageMot("Le mot n’a pas pu être enregistré : " + error.message);
  }
}

async function retirerMotRecherche(cheminDossier, mot) {
  const existants = motsAjoutesRechercheRef.current[cheminDossier] || [];
  try {
    setRechercheMessageMot("");
    await enregistrerMotsAjoutesRecherche(
      cheminDossier,
      existants.filter((existant) => existant !== mot)
    );
  } catch (error) {
    setRechercheMessageMot("Le mot n’a pas pu être retiré : " + error.message);
  }
}

// Adresse d'une photo trouvée, servie par le serveur (PC). Avec une taille, c'est
// une miniature.
function urlPhotoRechercheServeur(fichierRelatif, taille) {
  return (
    API_BASE +
    "/photo-recherche?dossierRacine=" +
    encodeURIComponent(dossierRacineGalerieEnvoyeAuServeur()) +
    "&fichier=" +
    encodeURIComponent(fichierRelatif) +
    (taille ? "&taille=" + taille : "")
  );
}

// v80 — LES RÉSULTATS S'AFFICHENT AVEC LE MÉCANISME DE LA GALERIE D'UNE VISITE.
// La v78 avait un deuxième mécanisme d'images, propre à la recherche : un décodage
// par photo, tous lancés en même temps, et un échec mémorisé pour toute la session.
// Sur 237 photos, cela donnait une grille de pastilles grises définitives.
// Désormais la recherche ne fabrique plus aucune image : elle prépare des photos à
// la forme attendue par la galerie ({ id, nom, cheminRelatif, handleAndroid } sur
// téléphone, { url, miniatureUrl } sur PC) et laisse faire obtenirUrlImageAndroidGalerie
// et ImageGalerieVisite, qui ont déjà une file d'attente bornée, un cache et un
// préchargement. Le plein écran est celui de la galerie, avec son balayage.
const dossiersRechercheAndroidRef = useRef(new Map());
const photosRechercheRef = useRef(new Map());
const retourRechercheDepuisGalerieRef = useRef(false);

async function resoudreDossierRechercheAndroid(cheminRelatif) {
  const chemin = String(cheminRelatif || "");
  const cache = dossiersRechercheAndroidRef.current;
  if (cache.has(chemin)) return cache.get(chemin);

  const racine = await obtenirRacineRechercheAndroid();
  if (!racine) throw new Error("Le dossier PhotoCartel n’est pas accessible.");
  let dossier = racine;
  const segments = chemin ? chemin.split("/").filter(Boolean) : [];
  for (let i = 0; i < segments.length; i += 1) {
    dossier = await dossier.getDirectoryHandle(segments[i]);
  }
  cache.set(chemin, dossier);
  return dossier;
}

// Prépare, pour une liste de positions de l'index, des photos à la forme de la galerie.
// Les handles Android sont résolus une fois par photo et gardés : une photo déjà
// préparée n'est pas relue. Une photo introuvable est écartée, pas remplacée par un trou.
async function preparerPhotosRecherche(positions) {
  const moteur = moteurRechercheRef.current;
  if (!moteur) return [];
  const preparees = [];

  for (let i = 0; i < positions.length; i += 1) {
    const photo = moteur.photos[positions[i]];
    if (!photo) continue;
    const cle = photo.fichier;
    const dejaPreparee = photosRechercheRef.current.get(cle);
    if (dejaPreparee) {
      if (dejaPreparee !== "absente") preparees.push(dejaPreparee);
      continue;
    }

    const coupure = cle.lastIndexOf("/");
    const cheminDossier = coupure > 0 ? cle.slice(0, coupure) : "";
    const nomFichier = cle.slice(coupure + 1);
    const entree = {
      id: cle,
      positionIndex: positions[i],
      nom: photo.nom,
      cheminRelatif: cle,
      titre: photo.titre || "",
      auteur: photo.auteur || "",
      dossierAffiche: contexteDossierRecherche(photo.dossier),
      annee: photo.annee || "",
      analysee: photo.analysee,
    };

    if (estAndroid()) {
      try {
        const dossier = await resoudreDossierRechercheAndroid(cheminDossier);
        entree.handleAndroid = await dossier.getFileHandle(nomFichier);
      } catch (error) {
        photosRechercheRef.current.set(cle, "absente");
        continue;
      }
    } else {
      entree.url = urlPhotoRechercheServeur(cle, 0);
      entree.miniatureUrl = urlPhotoRechercheServeur(cle, 360);
    }

    photosRechercheRef.current.set(cle, entree);
    preparees.push(entree);
  }

  return preparees;
}

// Ouvre les photos de la recherche dans l'écran de la galerie d'une visite : même
// grille, même plein écran, même balayage. La « visite » affichée dans le bandeau
// est le résultat de recherche lui-même.
async function ouvrirPhotosRechercheDansGalerie(positions, titre, position = 0) {
  try {
    setRechercheMessage("");
    const photos = await preparerPhotosRecherche(positions);
    afficherPhotosRechercheDansGalerie(photos, titre, position);
  } catch (error) {
    console.error("Ouverture des photos de la recherche :", error);
    setRechercheMessage("Ces photos n’ont pas pu être ouvertes : " + (error?.message || "erreur inconnue"));
  }
}

function afficherPhotosRechercheDansGalerie(photos, titre, position = 0) {
  {
    if (!Array.isArray(photos) || photos.length === 0) {
      setRechercheMessage("Ces photos ne sont plus dans leur dossier.");
      return;
    }
    const index = Math.max(0, Math.min(position, photos.length - 1));
    retourRechercheDepuisGalerieRef.current = true;
    annulerChargementsGalerieVisite();
    prefetchMiniaturesAnnuleRef.current = false;
    setVisiteGalerieMaquette({
      nom: titre,
      voyage: "Résultats de recherche",
      nombrePhotos: photos.length,
      resultatRecherche: true,
    });
    setPhotosGalerieVisite(photos);
    setNombreTotalPhotosGalerieVisite(photos.length);
    setChargementGalerieVisite(false);
    setErreurGalerieVisite("");
    setScrollTopGalerieVisite(0);
    setIndexPhotoGalerieVisite(index);
    setModePhotoGalerieVisite(true);
    setModeGalerieVisite(true);
  }
}

// Photos de la vue Grille : toutes les photos des lignes affichées, dans l'ordre des
// lignes. Préparées par tranches, au fur et à mesure du défilement.
async function preparerGrilleRecherche(lignes, nombre, rappel) {
  const positions = [];
  for (let i = 0; i < lignes.length && positions.length < nombre; i += 1) {
    for (let j = 0; j < lignes[i].photos.length && positions.length < nombre; j += 1) {
      positions.push(lignes[i].photos[j]);
    }
  }
  try {
    rappel(await preparerPhotosRecherche(positions));
  } catch (error) {
    console.warn("Préparation de la grille de résultats impossible :", error);
    rappel([]);
  }
}

// Rappel des critères, en langage courant : ce qui a été tapé et ce qui est coché.
function texteCriteresRecherche(mots) {
  const morceaux = [];
  if (mots.length > 0) morceaux.push(`Mots : ${mots.join(", ")}`);
  if (rechercheFiltres.pays.length > 0) morceaux.push(`Pays : ${rechercheFiltres.pays.join(", ")}`);
  if (rechercheFiltres.villes.length > 0) morceaux.push(`Villes : ${rechercheFiltres.villes.join(", ")}`);
  if (rechercheFiltres.annees.length > 0) morceaux.push(`Années : ${rechercheFiltres.annees.join(", ")}`);
  if (rechercheFiltres.analyseesSeulement) morceaux.push("Photos analysées seulement");
  return morceaux.join(" · ");
}

function resultatRechercheCourant() {
  const cle = `${rechercheVersionMoteur}|${rechercheSaisie}|${JSON.stringify(rechercheFiltres)}`;
  if (resultatRechercheMemoRef.current.cle === cle && resultatRechercheMemoRef.current.resultat) {
    return resultatRechercheMemoRef.current.resultat;
  }
  const resultat = rechercherDansMoteur(moteurRechercheRef.current, rechercheSaisie, rechercheFiltres);
  resultatRechercheMemoRef.current = { cle, resultat };
  return resultat;
}

// v80 — prépare les photos de la vue Grille quand elle est affichée. La préparation
// résout les handles ; l'image elle-même est chargée par le mécanisme de la galerie.
useEffect(() => {
  if (!modeRechercheResultats || rechercheVue !== "grille" || !moteurRechercheRef.current) return;
  let actif = true;
  const lignes = resultatRechercheCourant().lignes;
  preparerGrilleRecherche(lignes, rechercheNombreGrille, (photos) => {
    if (actif) setPhotosGrilleRecherche(photos);
  });
  return () => { actif = false; };
}, [modeRechercheResultats, rechercheVue, rechercheNombreGrille, rechercheVersionMoteur, rechercheSaisie, rechercheFiltres]);

function basculerPastilleRecherche(famille, valeur) {
  setRechercheFiltres((filtres) => {
    const liste = filtres[famille] || [];
    return {
      ...filtres,
      [famille]: liste.includes(valeur) ? liste.filter((element) => element !== valeur) : [...liste, valeur],
    };
  });
  setRechercheNombreLignes(40);
}

function contexteDossierRecherche(positionDossier) {
  const moteur = moteurRechercheRef.current;
  if (!moteur || positionDossier < 0) return "";
  const noms = [];
  for (let d = positionDossier; d >= 0; d = moteur.dossiers[d].parent) {
    if (!moteur.dossiers[d].conteneur) noms.unshift(moteur.dossiers[d].nom);
  }
  return noms.slice(-2).join(" › ");
}

// Chargement initial : aucun index exploitable, tout le dossier est lu. C'est le
// seul cas où la galerie fait encore attendre.
async function chargerGaleriePhotosAnalyseesAndroid() {
  // v72 — lecture : pas de vérification d'infrastructure (voir plus haut).
  const dossierPhotosAnalysees = await obtenirDossierPhotosAnalyseesAndroid({
    verifierInfrastructure: false,
  });
  const { fiches, nomsFichiers } = await lireToutesFichesGalerieAndroid(
    dossierPhotosAnalysees
  );
  const fichesCompletes = trierFichesGalerie(
    completerFichesGalerieAndroid(fiches, nomsFichiers)
  );

  await ecrireIndexGalerieAndroid(dossierPhotosAnalysees, fichesCompletes);
  await ecrireCacheGalerieNavigateur(fichesCompletes);

  return fichesCompletes;
}

// Ouverture normale : l'index seul, affiché immédiatement. Renvoie null si aucun
// index exploitable n'existe, pour que l'appelant bascule sur la lecture complète.
async function chargerGalerieDepuisIndexAndroid() {
  // v72 — plus de vérification-création des onze dossiers d'infrastructure ici :
  // elle a sa place quand on ÉCRIT (analyse d'une photo), pas quand on LIT. Elle
  // coûtait plusieurs accès au système de fichiers Android avant le premier
  // affichage, à chaque ouverture de la galerie.
  const fichesIndex = await lireIndexGalerieAndroid(
    await obtenirDossierPhotosAnalyseesAndroid({ verifierInfrastructure: false })
  );

  if (!fichesIndex || fichesIndex.length === 0) return null;

  return habillerFichesGalerieAndroid(fichesIndex);
}

// v72 — ouverture immédiate : la galerie se peint depuis le cache du navigateur,
// sans aucun accès au système de fichiers Android.
async function chargerGalerieDepuisCacheNavigateur() {
  const fichesCache = await lireCacheGalerieNavigateur();

  if (!fichesCache || fichesCache.length === 0) return null;

  return habillerFichesGalerieAndroid(fichesCache);
}

// Resynchronisation en arrière-plan. Ne bloque jamais l'écran et ne déplace
// jamais la fiche affichée : l'index courant est recalculé pour que la MÊME fiche
// (repérée par son nomJson) reste sous les yeux, quoi qu'il arrive à la liste.
async function resynchroniserGalerieAnalysesAndroid(listeAffichee) {
  if (galerieResynchronisationEnCoursRef.current) return;
  galerieResynchronisationEnCoursRef.current = true;

  try {
    // v72.1 — la resynchronisation peut être le premier accès au dossier de la
    // session quand la galerie s'est ouverte depuis le cache du navigateur : elle
    // doit donc pouvoir obtenir la permission, sinon elle échoue silencieusement
    // et le cache n'est jamais confronté au dossier réel.
    // Toujours sans recréer l'infrastructure : c'est un chemin de lecture.
    const dossierPhotosAnalysees = await obtenirDossierPhotosAnalyseesAndroid({
      demanderPermission: true,
      verifierInfrastructure: false,
    });
    const nomsFichiers = await listerNomsFichiersGalerieAndroid(
      dossierPhotosAnalysees
    );
    const fichesIndex = await lireIndexGalerieAndroid(dossierPhotosAnalysees);

    // L'écart se mesure contre ce qui est affiché ET contre ce que l'index
    // annonce : une fiche enregistrée pendant cette session est déjà affichée
    // sans être encore dans l'index, et n'a donc pas à être relue.
    const fichesConnues = [
      ...(Array.isArray(listeAffichee) ? listeAffichee : []),
      ...(Array.isArray(fichesIndex) ? fichesIndex : []),
    ];

    const { fichesConservees, nomsAAjouter } = comparerIndexEtDossierGalerie(
      fichesConnues,
      nomsFichiers.filter(estNomJsonFicheGalerie)
    );

    const fichesAjoutees = [];

    for (const nomJson of nomsAAjouter) {
      const fiche = await lireFicheGalerieAndroid(dossierPhotosAnalysees, nomJson);
      if (fiche) fichesAjoutees.push(fiche);
    }

    const fiches = trierFichesGalerie(
      completerFichesGalerieAndroid(
        [...fichesConservees, ...fichesAjoutees],
        nomsFichiers
      )
    );

    // Une action de l'utilisateur (enregistrement, modification, suppression) a
    // touché la galerie pendant la resynchronisation : son résultat prime, celui
    // d'ici est abandonné.
    if (galerieAnalysesCacheRef.current !== listeAffichee) return;

    if (
      signatureAffichageGalerie(fiches) !== signatureAffichageGalerie(listeAffichee)
    ) {
      galerieAnalysesCacheRef.current = fiches;
      setGalerieAnalyses(fiches);
      setGalerieIndex((ancienIndex) => {
        const nomJsonAffiche = listeAffichee[ancienIndex]?.nomJson || "";
        const nouvelIndex = fiches.findIndex(
          (element) => element.nomJson === nomJsonAffiche
        );
        const indexRetenu =
          nouvelIndex >= 0
            ? nouvelIndex
            : fiches.length
              ? Math.min(ancienIndex, fiches.length - 1)
              : 0;

        // v70 — si la resynchronisation change la fiche affichée (celle qui était
        // à l'écran a disparu du dossier), son image doit suivre.
        chargerImageGalerieAndroid(fiches[indexRetenu]?.nomPhoto);

        return indexRetenu;
      });
      setMessageGalerieAnalyses(
        fiches.length ? "" : "Aucune photo analysée sauvegardée pour l'instant."
      );
    }

    if (signatureIndexGalerie(fiches) !== signatureIndexGalerie(fichesIndex)) {
      await ecrireIndexGalerieAndroid(dossierPhotosAnalysees, fiches);
    }

    // v72 — le cache du navigateur est aligné sur ce qui vient d'être établi à
    // partir du dossier. C'est lui qui rendra la prochaine ouverture immédiate.
    await ecrireCacheGalerieNavigateur(fiches);
  } catch (error) {
    // Une resynchronisation qui échoue laisse simplement l'affichage en l'état.
    console.warn("Resynchronisation de la galerie impossible :", error);
  } finally {
    galerieResynchronisationEnCoursRef.current = false;
  }
}

function urlPhotoGalerie(fiche) {
  if (!fiche?.imageUrl) return "";
  return fiche.imageUrlLocale ? fiche.imageUrl : API_BASE + fiche.imageUrl;
}

async function ouvrirGaleriePhotosAnalysees() {
  setModeGalerieAnalyses(true);

  const cacheSession =
    galerieAnalysesCacheRef.current.length > 0
      ? galerieAnalysesCacheRef.current
      : galerieAnalyses;

  if (cacheSession.length > 0) {
    if (galerieAnalyses.length === 0) {
      setGalerieAnalyses(cacheSession);
    }
    // v69 — la resynchronisation compare le cache affiché au dossier réel : elle
    // doit donc pouvoir vérifier que c'est bien lui qui est encore en place.
    galerieAnalysesCacheRef.current = cacheSession;
    setGalerieChargement(false);
    setMessageGalerieAnalyses("");
    if (estAndroid()) {
      // v70 — l'image de la fiche affichée est demandée explicitement, pas par un
      // effet censé se réveiller : c'est ce réveil qui manquait en v69.
      chargerImageGalerieAndroid(cacheSession[galerieIndex]?.nomPhoto);
      resynchroniserGalerieAnalysesAndroid(cacheSession);
    }
    return;
  }

  try {
    setGalerieChargement(true);
    setMessageGalerieAnalyses("Chargement de la galerie...");
    setGalerieIndex(0);

    let photos = [];

    if (estAndroid()) {
      // v72 — d'abord le cache du navigateur : aucun accès au système de fichiers
      // Android, donc affichage immédiat. C'est ce premier accès au dossier qui
      // coûtait une dizaine de secondes après réouverture de l'application.
      const photosCache = await chargerGalerieDepuisCacheNavigateur();

      if (photosCache) {
        galerieAnalysesCacheRef.current = photosCache;
        setGalerieAnalyses(photosCache);
        setGalerieIndex(0);
        setMessageGalerieAnalyses("");
        setGalerieChargement(false);
        chargerImageGalerieAndroid(photosCache[0]?.nomPhoto);
        resynchroniserGalerieAnalysesAndroid(photosCache);
        return;
      }

      // v69 — l'index affiche la galerie tout de suite ; la lecture complète du
      // dossier n'a plus lieu qu'à défaut d'index exploitable (première ouverture,
      // ou dossier arrivé du PC sans index).
      const photosIndex = await chargerGalerieDepuisIndexAndroid();

      if (photosIndex) {
        galerieAnalysesCacheRef.current = photosIndex;
        setGalerieAnalyses(photosIndex);
        setGalerieIndex(0);
        setMessageGalerieAnalyses("");
        setGalerieChargement(false);
        chargerImageGalerieAndroid(photosIndex[0]?.nomPhoto);
        resynchroniserGalerieAnalysesAndroid(photosIndex);
        return;
      }

      photos = await chargerGaleriePhotosAnalyseesAndroid();
    } else {
      const chargerDepuisServeur = async (racine) => {
        const response = await fetch(
          API_BASE +
            "/photos-analysees?dossierRacine=" +
            encodeURIComponent(racine)
        );

        const data = await lireReponseJsonPhotoCartel(
          response,
          "Erreur chargement galerie"
        );

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Erreur chargement galerie");
        }

        return {
          photos: Array.isArray(data.photos) ? data.photos : [],
          dossierDestination: data.dossierDestination || "",
          total: Number(data.total || 0),
        };
      };

      const racineGalerie = dossierRacineGalerieEnvoyeAuServeur();
      let resultat = await chargerDepuisServeur(racineGalerie);

      // Sécurité locale : si une ancienne préférence de racine pointe ailleurs,
      // la galerie permanente retente explicitement la racine officielle.
      if (
        resultat.photos.length === 0 &&
        apiPhotoCartelLocale() &&
        racineGalerie !== "C:\\PhotoCartel"
      ) {
        resultat = await chargerDepuisServeur("C:\\PhotoCartel");
      }

      console.log("Galerie locale chargée :", {
        racineDemandee: racineGalerie,
        dossierLu: resultat.dossierDestination,
        totalAnnonce: resultat.total,
        totalRecu: resultat.photos.length,
      });

      photos = resultat.photos;
    }

    galerieAnalysesCacheRef.current = photos;
    setGalerieAnalyses(photos);
    setGalerieIndex(0);
    // v70 — même chose après une lecture complète : l'image est demandée ici,
    // sinon la première fiche restait sans photo jusqu'au premier balayage.
    chargerImageGalerieAndroid(photos[0]?.nomPhoto);
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
  // v36 : on ferme uniquement l'écran. Le contenu reste en cache de session.
  if (analysePhotoEdition) {
    annulerModificationsAnalyseGalerie();
  }
  setModeGalerieAnalyses(false);
  setConfirmationSuppressionGalerie(false);
  setGalerieChargement(false);
  setMessageGalerieAnalyses("");
  setPhotoPleinEcranUrl("");
}

function galeriePrecedente() {
  setMessageGalerieAnalyses("");

  if (!galerieAnalyses.length) return;

  const nouvelIndex =
    (galerieIndex - 1 + galerieAnalyses.length) % galerieAnalyses.length;

  setGalerieIndex(nouvelIndex);
  // v70 — l'image suit la fiche dans le même geste.
  chargerImageGalerieAndroid(galerieAnalyses[nouvelIndex]?.nomPhoto);
}

function galerieSuivante() {
  setMessageGalerieAnalyses("");

  if (!galerieAnalyses.length) return;

  const nouvelIndex = (galerieIndex + 1) % galerieAnalyses.length;

  setGalerieIndex(nouvelIndex);
  // v70 — l'image suit la fiche dans le même geste.
  chargerImageGalerieAndroid(galerieAnalyses[nouvelIndex]?.nomPhoto);
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
  if (analysePhotoEdition || galerieSauvegardeEnCours) return;
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

function ouvrirConfirmationSuppressionGalerie() {
  if (!galerieAnalyses[galerieIndex]) {
    return;
  }

  setConfirmationSuppressionGalerie(true);
}

function annulerConfirmationSuppressionGalerie() {
  if (galerieChargement) return;
  setConfirmationSuppressionGalerie(false);
}

async function supprimerFicheGalerie() {
  const fiche = galerieAnalyses[galerieIndex];

  if (!fiche) {
    setConfirmationSuppressionGalerie(false);
    return;
  }

  try {
    setConfirmationSuppressionGalerie(false);
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
          console.warn("Fiche associée déjà absente :", fiche.nomJson);
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
          dossierRacine: dossierRacineGalerieEnvoyeAuServeur(),
        }),
      });

      const data = await lireReponseJsonPhotoCartel(
        response,
        "Erreur suppression de la photo analysée"
      );

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Erreur suppression de la photo analysée");
      }
    }

    if (fiche.imageUrlLocale && fiche.imageUrl) {
      URL.revokeObjectURL(fiche.imageUrl);
    }

    const nouvelleGalerie = galerieAnalyses.filter(
      (_, index) => index !== galerieIndex
    );

    galerieAnalysesCacheRef.current = nouvelleGalerie;
    setGalerieAnalyses(nouvelleGalerie);
    setAnalysePhotoEdition(false);
    setAnalysePhotoModifiee(false);
    analysePhotoAvantEditionRef.current = null;

    if (nouvelleGalerie.length === 0) {
      setGalerieIndex(0);
      setMessageGalerieAnalyses("");
      setModeGalerieAnalyses(false);
      setPhotoPleinEcranUrl("");
      afficherMessageDiscretArborescence(
        "Fiche supprimée. La galerie est maintenant vide."
      );
      return;
    }

    // Si la fiche supprimée était la dernière, on affiche la précédente.
    // Dans les autres cas, le même index affiche naturellement la suivante.
    const indexApresSuppression = Math.min(
      galerieIndex,
      nouvelleGalerie.length - 1
    );

    setGalerieIndex(indexApresSuppression);
    // v70 — une autre fiche prend la place : son image doit être chargée.
    chargerImageGalerieAndroid(nouvelleGalerie[indexApresSuppression]?.nomPhoto);
    setMessageGalerieAnalyses("");
  } catch (error) {
    console.error(error);
    setMessageGalerieAnalyses("Erreur suppression : " + error.message);
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
    // v50.4 : sans cette ligne, villeVisite restait vide (ou à son ancienne valeur), ce qui
    // annulait cheminCible (voyage && villeVisite && lieuVisite) et donc cheminCollecteActif,
    // alors même que lieuVisite et cheminTamponActif étaient corrects. Conséquence : la modale
    // « Aucune visite en cours » réapparaissait à tort au clic suivant sur « Prendre des photos ».
    // Alignement sur creerVisiteRapide, qui fait déjà ce choix pour les visites rapides.
    setVilleVisite("Ville non renseignée");
    setLieuVisite(nomTampon);
    setTypeVisite("");
    setModeAucuneVisite(false);
    setDerniereActionVisite("Collecte libre créée le " + formaterDate(maintenant));

    localStorage.setItem("photoCartelStatutVisite", "EN_COURS");
    localStorage.setItem("photoCartelVilleActive", "Ville non renseignée");
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

  let enregistrementReussi = false;

  try {
    let resultatEnregistrement = null;

    if (estAndroid()) {
      resultatEnregistrement = await enregistrerPhotosVisiteDansCollecteAndroid(fichiers);
    } else {
      const formData = new FormData();
      formData.append("dossierRacine", dossierRacineMetierEnvoyeAuServeur());

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

    const nombreSauvegarde = Number(
      resultatEnregistrement?.copies ??
      resultatEnregistrement?.fichiersSauvegardes?.length ??
      0
    );
    const nombreRecu = Number(resultatEnregistrement?.recus ?? fichiers.length);
    const enregistrementComplet =
      resultatEnregistrement?.enregistrementComplet !== false &&
      resultatEnregistrement?.success !== false &&
      nombreSauvegarde === nombreRecu &&
      nombreSauvegarde > 0;

    if (!enregistrementComplet) {
      throw new Error(
        resultatEnregistrement?.error ||
        `Enregistrement incomplet : ${nombreSauvegarde} photo(s) sauvegardée(s) sur ${nombreRecu}.`
      );
    }

    setPhotosCollectees((ancienTotal) => {
      const nouveauTotal = ancienTotal + nombreSauvegarde;
      localStorage.setItem("photoCartelPhotosCollectees", String(nouveauTotal));
      return nouveauTotal;
    });

    enregistrementReussi = true;
    const cheminCollecteConfirme =
      resultatEnregistrement?.dossierDestination ||
      resultatEnregistrement?.cheminDestination ||
      resultatEnregistrement?.cheminLisible ||
      "Collecte Photo en cours";

    setDerniereActionVisite(
      `✅ ${nombreSauvegarde} photo(s) enregistrée(s) dans ${cheminCollecteConfirme}.`
    );
  } catch (error) {
    console.error(error);
    tracerStockageV39("échec écriture photo visite", {
      erreur: error?.message || String(error),
    });
    setDiagnosticStockageV39(
      `Écriture interrompue, mais la visite « ${lieuVisite || "en cours"} » est conservée. ` +
      "Appuie de nouveau sur Prendre des photos pour réautoriser le stockage, puis reprends la photo."
    );
    setDerniereActionVisite(
      "Accès au stockage à rétablir. La visite reste active et aucune nouvelle visite n’est nécessaire."
    );
  }

  // v38.13 : on ne rouvre automatiquement la caméra qu'après confirmation
  // effective de l'écriture. En cas de perte d'autorisation, on reste dans
  // PhotoCartel afin que l'utilisateur puisse réactiver proprement l'accès.
  if (estAndroid() && voyage && enregistrementReussi) {
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
  setPropositionsRenommage(null);

  if (fichiers.length === 0) {
    setFichiersRenommage([]);
    setDossierRenommage("");
    setNombrePhotosRenommage(0);
    setMessageRenommage("Aucun fichier sélectionné pour renommage");
    return;
  }

  const EXTENSIONS_RENOMMAGE_ACCEPTEES = [
    ".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif", ".gif", ".bmp", ".tif", ".tiff"
  ];
  const photos = fichiers.filter((fichier) => {
    const nom = fichier.name.toLowerCase();
    return EXTENSIONS_RENOMMAGE_ACCEPTEES.some((extension) => nom.endsWith(extension));
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
    // v77 — attente bornée et interruptible.
    let operation = null;
    let nombrePhotosEnvoyees = 0;
    let delaiMs = 0;
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
      setResultatsRenommageDetail(null);
      setMessageRenommage("");
      setDossierRenommage("");
      setNombrePhotosRenommage(0);
      cheminRenommagePrepareRef.current = "";
      setCheminRenommagePrepare("");
      setRenommagePret(false);
      setPropositionsRenommage(null);
      setRenommageFinalTermine(false);

      const dateDebut = new Date();

      operation = demarrerOperationEnCours("classification");
      nombrePhotosEnvoyees = photos.length;
      delaiMs = delaiMaxAttentePhotos(photos.length);
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

      const { texte: texteReponse } = await executerRequeteBornee(
        API_BASE + "/classifier-fichiers",
        { method: "POST", body: formData },
        { delaiMs, signal: operation.signal }
      );

      // v77 — interrompu pendant l'attente : ce résultat n'appartient plus à l'écran.
      if (!operation.estActive()) return;

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
      if (operation && !operation.estActive()) return;
      console.error(error);
      if (error?.code === "DELAI_DEPASSE") {
        const messageDelai =
          `Classification arrêtée : le serveur n'a pas répondu en ${formaterDureeAttente(delaiMs)} ` +
          `pour ${nombrePhotosEnvoyees} photo(s).`;
        setMessageImport(messageDelai);
        alert(messageDelai);
      } else {
        setMessageImport("Erreur classification : " + error.message);
        alert(error.message);
      }
      amenerEtapeALaVue("etape-classification");
    } finally {
      if (!operation || operation.estActive()) setClassificationEnCours(false);
    }
  }


async function renommerOeuvresTest(fichiersAUtiliser = fichiersRenommage) {
  // v77 — attente bornée et interruptible : la modale ne peut plus rester affichée sans fin.
  const operation = demarrerOperationEnCours("renommage");
  let nombrePhotosEnvoyees = 0;
  let delaiMs = 0;

  try {
    // v63 — correctif : filtre client resynchronise avec EXTENSIONS_IMAGE_PHOTOCARTEL cote
    // serveur (v57). Avant ce correctif, .heic/.heif/.gif/.bmp/.tif/.tiff etaient elargis
    // cote serveur mais ignores silencieusement ici avant meme l'envoi : un .heic pris sur
    // telephone n'atteignait jamais le serveur.
    const EXTENSIONS_RENOMMAGE_ACCEPTEES = [
      ".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif", ".gif", ".bmp", ".tif", ".tiff"
    ];
    const listeFichiers = Array.from(fichiersAUtiliser || []).filter((fichier) => {
      const nom = fichier.name.toLowerCase();
      return EXTENSIONS_RENOMMAGE_ACCEPTEES.some((extension) => nom.endsWith(extension));
    });

    cheminRenommagePrepareRef.current = "";
    setCheminRenommagePrepare("");
    setRenommagePret(false);
    setPropositionsRenommage(null);
    setDashboardRenommage(null);
    setResultatsRenommageDetail(null);
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

    nombrePhotosEnvoyees = listeFichiers.length;
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

    delaiMs = delaiMaxAttentePhotos(listeFichiers.length);
    const { response, texte } = await executerRequeteBornee(
      API_BASE + "/renommer-oeuvres-fichiers",
      { method: "POST", body: formData },
      { delaiMs, signal: operation.signal }
    );

    // v77 — interrompu pendant l'attente : ce résultat n'appartient plus à l'écran.
    if (!operation.estActive()) return;

    const data = texte ? JSON.parse(texte) : {};
    console.log("DATA BRUTE RENOMMAGE =", data);

    if (!response.ok || !data.success) {
      const message = data.error || "Erreur pendant la préparation du renommage";
      setRenommageFinalEnCours(false);
      setMessageRenommage("Erreur renommage : " + message);
      amenerEtapeALaVue("etape-renommage");
      return;
    }

    const cheminPrepare = data.cheminDestination || "";

    if (!cheminPrepare) {
      console.error("AUCUN CHEMIN RETOURNE PAR LE SERVEUR =", data);
      setRenommageFinalEnCours(false);
      setMessageRenommage(
        "Renommage impossible : le serveur n'a pas retourné le chemin complet du dossier de renommage."
      );
      amenerEtapeALaVue("etape-renommage");
      return;
    }

    console.log("DATA PREPARATION =", data);
    console.log("CHEMIN PREPARE =", cheminPrepare);

    cheminRenommagePrepareRef.current = cheminPrepare;
    setCheminRenommagePrepare(cheminPrepare);
    setRenommagePret(true);

    // v77 — une photo que l'IA n'a pas pu trier est dite, avec sa raison.
    const erreursTri = Array.isArray(data.erreursTri) ? data.erreursTri : [];
    const raisonsTri = Array.from(new Set(erreursTri.map((erreur) => erreur?.raison).filter(Boolean)));
    const complementErreursTri = erreursTri.length
      ? ` ${erreursTri.length} photo(s) n'ont pas pu être triée(s)` +
        (raisonsTri.length ? ` : ${raisonsTri.join(" ; ")}.` : ".")
      : "";

    // v50.5 — étape 3 de la spec : le tri œuvre/cartel est automatique, mais l'analyse IA
    // (qui produit la proposition de nom) attend désormais un déclenchement manuel.
    // On ne chaîne plus automatiquement vers lancerRenommageFinal ici.
    setRenommageFinalEnCours(false);
    setMessageRenommage(
      `Tri terminé pour "${nomDossierSource}". Clique sur « Lancer l'analyse IA » pour continuer.` +
        complementErreursTri
    );
    amenerEtapeALaVue("etape-renommage");
  } catch (error) {
    if (!operation.estActive()) return;
    console.error(error);
    setRenommageFinalEnCours(false);
    if (error?.code === "DELAI_DEPASSE") {
      setMessageRenommage(
        `Renommage arrêté : le serveur n'a pas répondu en ${formaterDureeAttente(delaiMs)} ` +
          `pour ${nombrePhotosEnvoyees} photo(s). Aucune photo n'a été renommée. ` +
          "Tu peux relancer le renommage."
      );
    } else {
      setMessageRenommage("Erreur renommage : " + error.message);
    }
    amenerEtapeALaVue("etape-renommage");
  }
}

// v50.5 — étape 3 : déclenchement manuel de l'analyse IA. Produit une proposition de nom
// par œuvre, SANS renommer aucun fichier (voir /renommer-oeuvres/analyser côté serveur).
async function lancerAnalyseRenommage() {
  const cheminVisite = cheminRenommagePrepareRef.current || cheminRenommagePrepare;

  if (!cheminVisite) {
    setMessageRenommage(
      "Analyse impossible : clique d'abord sur « Renommer un dossier » et attends la fin du tri."
    );
    return;
  }

  // v77 — attente bornée ; un résultat arrivé après « Accueil » est ignoré.
  const operation = demarrerOperationEnCours("renommage");
  const delaiMs = delaiMaxAttentePhotos(nombrePhotosRenommage);

  try {
    setAnalyseRenommageEnCours(true);
    setPropositionsRenommage(null);
    setMessageRenommage("Analyse IA en cours...");

    const { response, texte } = await executerRequeteBornee(
      API_BASE + "/renommer-oeuvres/analyser",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cheminVisite }),
      },
      { delaiMs, signal: operation.signal }
    );

    if (!operation.estActive()) return;

    const data = texte ? JSON.parse(texte) : {};

    if (!response.ok || !data.success) {
      setMessageRenommage("Erreur analyse : " + (data.error || "erreur inconnue"));
      return;
    }

    setPropositionsRenommage(data.propositions);
    setMessageRenommage(
      `${data.propositions.length} proposition(s) générée(s). Vérifie puis valide le renommage.`
    );
    amenerEtapeALaVue("etape-renommage");
  } catch (error) {
    if (!operation.estActive()) return;
    console.error(error);
    if (error?.code === "DELAI_DEPASSE") {
      setMessageRenommage(
        `Analyse arrêtée : le serveur n'a pas répondu en ${formaterDureeAttente(delaiMs)}. ` +
          "Aucune photo n'a été renommée. Tu peux relancer l'analyse."
      );
    } else {
      setMessageRenommage("Erreur analyse : " + error.message);
    }
  } finally {
    if (operation.estActive()) setAnalyseRenommageEnCours(false);
  }
}

// v50.5 — étape 6 : validation manuelle. N'écrit sur disque QUE ce que l'utilisateur valide ici.
async function validerRenommage() {
  const cheminVisite = cheminRenommagePrepareRef.current || cheminRenommagePrepare;

  if (!cheminVisite || !propositionsRenommage) return;

  // v77 — un résultat arrivé après « Accueil » est ignoré. La requête n'est pas annulée :
  // le renommage sur disque, une fois lancé, va au bout.
  const operation = demarrerOperationEnCours("renommage");

  try {
    setConfirmationRenommageEnCours(true);
    setMessageRenommage("Renommage en cours...");

    const propositions = propositionsRenommage.map((proposition) => ({
      oeuvre: proposition.oeuvre,
      cartel: proposition.cartel,
      nomFinal: proposition.nomPropose,
      aVerifier: proposition.aVerifier,
    }));

    const response = await fetch(API_BASE + "/renommer-oeuvres/confirmer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cheminVisite, propositions }),
    });

    const data = await response.json();

    if (!operation.estActive()) return;

    if (!response.ok || !data.success) {
      setMessageRenommage("Erreur renommage : " + (data.error || "erreur inconnue"));
      return;
    }

    setDashboardRenommage(data.dashboardRenommage);
    setResultatsRenommageDetail(data.resultats || null);
    setPropositionsRenommage(null);
    setRenommagePret(false);
    setRenommageFinalTermine(true);
    setMessageRenommage(
      `Renommage terminé : ${data.renommes} œuvres renommées, ${data.aVerifier} à vérifier.`
    );
  } catch (error) {
    if (!operation.estActive()) return;
    console.error(error);
    setMessageRenommage("Erreur renommage : " + error.message);
  } finally {
    if (operation.estActive()) setConfirmationRenommageEnCours(false);
  }
}

// v50.5 — permet d'éditer une proposition avant validation (le nom reste modifiable).
function modifierPropositionRenommage(index, nouveauNom) {
  setPropositionsRenommage((liste) =>
    liste.map((proposition, i) =>
      i === index ? { ...proposition, nomPropose: nouveauNom } : proposition
    )
  );
}


async function lancerRenommageFinal(cheminForce = "", dossierForce = "") {
  try {

setDashboardRenommage(null);
setResultatsRenommageDetail(null);
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
    setResultatsRenommageDetail(null);
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
  const type = String(typeNouvelleVisite || "").trim();

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

  if (!type) {
    alert("Type de visite manquant");
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
    setResultatsRenommageDetail(null);
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
      fontSize: "16px",
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
      gap: "7px",
      padding: "4px 0",
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
      fontSize: "15px",
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
    accueilBlocPrincipal: {
      position: "relative",
      display: "grid",
      gridTemplateColumns: "73% 27%",
      height: "224px",
      minHeight: "224px",
      overflow: "hidden",
      background: "#fff8eb",
    },
    accueilInformations: {
      minWidth: 0,
      height: "100%",
      boxSizing: "border-box",
      padding: "54px 8px 5px 13px",
      background: "#fff8eb",
      display: "grid",
      gridTemplateRows: "repeat(3, minmax(0, 1fr)) 29px",
      textAlign: "left",
    },
    accueilPhoto: {
      width: "100%",
      height: "calc(100% - 54px)",
      minHeight: 0,
      marginTop: "54px",
      alignSelf: "end",
      display: "block",
      objectFit: "cover",
      objectPosition: "50% center",
      opacity: 1,
      borderLeft: `1px solid ${themePhotoCartel.bordureOr}`,
      borderTop: `1px solid ${themePhotoCartel.bordureOr}`,
    },
    accueilVoyageTitreLigne: {
      position: "absolute",
      zIndex: 2,
      top: "8px",
      left: "13px",
      right: "54px",
      display: "block",
      minHeight: "41px",
      paddingBottom: "3px",
      paddingRight: 0,
      boxSizing: "border-box",
      borderBottom: "none",
    },
    accueilVoyageTexte: {
      minWidth: 0,
      textAlign: "left",
    },
    boutonGestionVoyageAccueil: {
      position: "absolute",
      zIndex: 3,
      top: "11px",
      right: "5px",
      width: "44px",
      minHeight: "45px",
      border: "none",
      borderRadius: 0,
      background: "rgba(255,248,235,0.94)",
      color: themePhotoCartel.texteDoux,
      fontFamily: themePhotoCartel.font,
      fontSize: "6.5px",
      lineHeight: "7px",
      fontWeight: "750",
      padding: "2px 0 0",
      margin: 0,
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      gap: "1px",
      textAlign: "center",
      boxShadow: "none",
    },
    boutonGestionVoyageIcone: {
      fontSize: "15px",
      lineHeight: "17px",
      fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
    },
    accueilCompteurLigne: {
      display: "grid",
      gridTemplateColumns: "28px minmax(0, 1fr) auto",
      gap: "5px",
      alignItems: "center",
      marginTop: "1px",
      minHeight: "29px",
      paddingTop: "4px",
      borderTop: "2px solid rgba(166,118,53,0.58)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.72)",
      textAlign: "left",
    },
    accueilCompteurIcone: {
      fontSize: "20px",
      lineHeight: "22px",
      textAlign: "left",
      transform: "translateY(-2px)",
      fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
    },
    accueilCompteurLabel: {
      minWidth: 0,
      color: themePhotoCartel.texteDoux,
      fontFamily: themePhotoCartel.font,
      fontSize: "10.5px",
      lineHeight: "12px",
      fontWeight: "750",
      whiteSpace: "nowrap",
      textAlign: "left",
    },
    accueilCompteurValeur: {
      color: themePhotoCartel.encre,
      fontFamily: themePhotoCartel.font,
      fontSize: "15px",
      lineHeight: "18px",
      fontWeight: "900",
      textAlign: "right",
      minWidth: "34px",
      fontVariantNumeric: "tabular-nums",
    },
    dernieresVisitesAccueil: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "4px",
      padding: "5px 12px 12px",
      marginBottom: "44px",
      position: "relative",
      transform: "translateY(-13px)",
      border: "1px solid rgba(199,166,110,0.12)",
      borderRadius: "16px",
      background: "rgba(255,253,248,0.96)",
      boxShadow: "0 7px 20px rgba(91,67,38,0.05)",
    },
    dernieresVisitesLabel: {
      color: themePhotoCartel.orFonce,
      fontFamily: themePhotoCartel.font,
      fontSize: "10px",
      fontWeight: "900",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
    },
    dernieresVisitesDeclencheur: {
      width: "100%",
      minWidth: 0,
      minHeight: "38px",
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr) auto",
      alignItems: "center",
      gap: "8px",
      border: `1px solid ${themePhotoCartel.bordureOr}`,
      borderRadius: "10px",
      background: "rgba(255,253,248,0.98)",
      color: themePhotoCartel.texteDoux,
      fontFamily: themePhotoCartel.font,
      fontSize: "10px",
      fontWeight: "750",
      textAlign: "left",
      padding: "0 11px",
      cursor: "pointer",
    },
    dernieresVisitesChevron: {
      color: themePhotoCartel.orFonce,
      fontSize: "16px",
      lineHeight: 1,
    },
    dernieresVisitesListe: {
      overflow: "hidden",
      border: `1px solid ${themePhotoCartel.bordureOr}`,
      borderRadius: "13px",
      background: "rgba(255,253,248,0.99)",
      boxShadow: "0 10px 24px rgba(91,67,38,0.10)",
    },
    dernieresVisitesListeTitre: {
      padding: "10px 12px 8px",
      color: themePhotoCartel.encre,
      fontFamily: themePhotoCartel.font,
      fontSize: "11px",
      fontWeight: "900",
      textAlign: "center",
      borderBottom: "1px solid rgba(91,67,38,0.10)",
    },
    dernieresVisitesOptionsDefilantes: {
      maxHeight: "min(450px, calc(100dvh - 235px))",
      overflowY: "auto",
      overscrollBehavior: "contain",
      WebkitOverflowScrolling: "touch",
      scrollbarGutter: "stable",
    },
    dernieresVisitesOption: {
      width: "100%",
      minHeight: "50px",
      display: "grid",
      gridTemplateColumns: "25px minmax(0, 1fr) 24px",
      alignItems: "center",
      gap: "7px",
      padding: "7px 10px",
      border: "none",
      borderBottom: "1px solid rgba(91,67,38,0.09)",
      background: "transparent",
      color: themePhotoCartel.encre,
      fontFamily: themePhotoCartel.font,
      textAlign: "left",
      cursor: "pointer",
    },
    dernieresVisitesOptionIcone: {
      fontSize: "16px",
      textAlign: "center",
    },
    dernieresVisitesOptionTexte: {
      minWidth: 0,
      display: "grid",
      gap: "2px",
    },
    dernieresVisitesOptionNom: {
      overflow: "hidden",
      color: themePhotoCartel.encre,
      fontSize: "11px",
      lineHeight: "13px",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    dernieresVisitesOptionContexte: {
      overflow: "hidden",
      color: themePhotoCartel.texteDoux,
      fontSize: "9px",
      lineHeight: "11px",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    dernieresVisitesOptionCoche: {
      color: themePhotoCartel.orFonce,
      fontSize: "18px",
      fontWeight: "900",
      textAlign: "center",
    },
    dernieresVisitesVide: {
      padding: "14px 12px",
      color: themePhotoCartel.texteDoux,
      fontFamily: themePhotoCartel.font,
      fontSize: "10px",
      lineHeight: "14px",
      textAlign: "center",
    },
    resumeVisiteCarte: {
      margin: "0 0 4px",
      padding: "7px 9px 8px",
      border: `1px solid ${themePhotoCartel.bordureOr}`,
      borderRadius: "14px",
      background: themePhotoCartel.ivoireCarte,
      boxShadow: themePhotoCartel.ombreLegere,
    },
    resumeVisiteTitreLigne: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "27px",
      marginBottom: "2px",
      padding: "0 34px",
    },
    accueilTitreAvecEdition: {
      display: "flex",
      alignItems: "center",
      gap: "7px",
    },
    ligneEtatValeurAvecAction: {
      minWidth: 0,
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr) auto",
      alignItems: "center",
      gap: "7px",
    },
    boutonModifierIdentiteAccueil: {
      flex: "0 0 auto",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "22px",
      height: "22px",
      padding: 0,
      border: `1.5px solid ${themePhotoCartel.bordureOr}`,
      borderRadius: "50%",
      background: "#fff4d9",
      color: "#8d5710",
      boxShadow: "0 2px 7px rgba(91,67,38,0.20)",
      fontSize: "12px",
      lineHeight: 1,
    },
    boutonModifierIdentite: {
      flex: "0 0 auto",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "25px",
      height: "25px",
      padding: 0,
      border: `1.5px solid ${themePhotoCartel.bordureOr}`,
      borderRadius: "50%",
      background: "#fff4d9",
      color: "#8d5710",
      boxShadow: "0 2px 7px rgba(91,67,38,0.20)",
      cursor: "pointer",
      fontFamily: themePhotoCartel.font,
      fontSize: "14px",
      fontWeight: "900",
      lineHeight: 1,
      position: "relative",
      zIndex: 2,
    },
    resumeVisiteTitre: {
      padding: 0,
      color: themePhotoCartel.encre,
      fontFamily: themePhotoCartel.font,
      fontSize: "13px",
      lineHeight: "15px",
      fontWeight: "900",
      textAlign: "center",
    },
    resumeVisiteLigne: {
      display: "grid",
      gridTemplateColumns: "18px minmax(0, 1fr) minmax(72px, auto)",
      alignItems: "center",
      gap: "4px",
      minHeight: "24px",
      padding: "1px",
      borderTop: "1px solid rgba(91,67,38,0.10)",
    },
    resumeVisiteLigneSansIcone: {
      gridTemplateColumns: "auto auto",
      justifyContent: "center",
      columnGap: "22px",
    },
    resumeVisiteLigneSeparee: {
      marginTop: "3px",
      borderTop: `1px solid ${themePhotoCartel.bordureOr}`,
    },
    resumeVisiteLignePrincipale: {
      minHeight: "27px",
      margin: "0 0 2px",
      padding: "1px 6px",
      borderTop: "none",
      borderRadius: "7px",
      background: "rgba(238,224,199,0.62)",
    },
    resumeVisiteLabelPrincipal: {
      color: themePhotoCartel.texteDoux,
      fontSize: "8.5px",
      lineHeight: "10px",
      fontWeight: "650",
      textAlign: "center",
      paddingLeft: 0,
    },
    resumeVisiteValeurPrincipale: {
      maxWidth: "none",
      fontSize: "11px",
      lineHeight: "12px",
      fontWeight: "900",
      textAlign: "center",
      wordBreak: "normal",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    resumeVisiteIcone: {
      fontSize: "11px",
      lineHeight: "12px",
      textAlign: "center",
    },
    resumeVisiteLabel: {
      minWidth: 0,
      color: themePhotoCartel.texteDoux,
      fontFamily: themePhotoCartel.font,
      fontSize: "8px",
      lineHeight: "9px",
      fontWeight: "700",
      textAlign: "left",
    },
    resumeVisiteValeur: {
      maxWidth: "132px",
      color: themePhotoCartel.encre,
      fontFamily: themePhotoCartel.font,
      fontSize: "9px",
      lineHeight: "10px",
      fontWeight: "900",
      textAlign: "right",
      wordBreak: "break-word",
    },
    resumeVisiteDatesCadre: {
      width: "calc(100% - 24px)",
      boxSizing: "border-box",
      margin: "3px auto 4px",
      padding: "1px 4px",
      border: "1px solid rgba(199,166,110,0.38)",
      borderRadius: "9px",
      background: "rgba(232,218,192,0.43)",
    },
    resumeVisiteDateLigne: {
      display: "grid",
      gridTemplateColumns: "14px 70px auto",
      justifyContent: "center",
      alignItems: "center",
      columnGap: "1px",
      minHeight: "10px",
      padding: 0,
      borderBottom: "1px solid rgba(91,67,38,0.05)",
    },
    resumeVisiteDateIcone: {
      fontSize: "8px",
      lineHeight: "9px",
      textAlign: "center",
    },
    resumeVisiteDateLabel: {
      color: themePhotoCartel.texteDoux,
      fontFamily: themePhotoCartel.font,
      fontSize: "6.5px",
      lineHeight: "7px",
      fontWeight: "700",
      textAlign: "left",
    },
    resumeVisiteDateValeur: {
      color: themePhotoCartel.encre,
      fontFamily: themePhotoCartel.font,
      fontSize: "6.8px",
      lineHeight: "7px",
      fontWeight: "850",
      textAlign: "left",
      whiteSpace: "nowrap",
    },
    resumeVisiteStatutZone: {
      marginTop: "5px",
      paddingTop: "3px",
      borderTop: `4px double ${themePhotoCartel.bordureOr}`,
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.95)",
    },
    resumeVisiteBoutonsSecondaires: {
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gap: "5px",
      marginTop: "4px",
    },
    resumeVisiteBoutonSecondaire: {
      minHeight: "26px",
      border: `1px solid ${themePhotoCartel.bordureOr}`,
      borderRadius: "8px",
      background: "rgba(255,253,248,0.98)",
      color: themePhotoCartel.encre,
      fontFamily: themePhotoCartel.font,
      fontSize: "7px",
      lineHeight: "8px",
      padding: "2px 3px",
      fontWeight: "850",
      cursor: "pointer",
    },
    resumeVisiteBoutonActions: {
      width: "100%",
      minHeight: "24px",
      marginTop: "4px",
      border: `1px solid ${themePhotoCartel.bordureOr}`,
      borderRadius: "8px",
      background: "linear-gradient(135deg, rgba(255,253,248,0.98), rgba(234,216,181,0.50))",
      color: themePhotoCartel.orFonce,
      fontFamily: themePhotoCartel.font,
      fontSize: "8px",
      fontWeight: "900",
      opacity: 0.68,
      cursor: "default",
    },
    actionsTraitementAccueil: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "10px",
      margin: "0 0 9px",
      padding: "9px 12px",
      border: "1px solid rgba(199,166,110,0.10)",
      borderRadius: "15px",
      background: "rgba(255,253,248,0.80)",
    },
    boutonTraitementAccueil: {
      minHeight: "38px",
      border: `1px solid ${themePhotoCartel.bordureOr}`,
      background: "linear-gradient(135deg, rgba(255,253,248,0.98), rgba(234,216,181,0.42))",
      color: themePhotoCartel.orFonce,
      borderRadius: "11px",
      boxShadow: "0 5px 14px rgba(91,67,38,0.06)",
      fontFamily: themePhotoCartel.font,
      fontSize: "12px",
      fontWeight: "850",
      cursor: "pointer",
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
    // v50 — bandeau discret et global signalant la tâche d'analyse IA en arrière-plan.
    // Retour de recette : positionné SOUS la barre supérieure (au lieu de top:0) pour ne plus
    // recouvrir le logo/la version/les icônes d'aide ; allégé (padding et police réduits).
    bandeauAnalyseIA: {
      position: "fixed",
      // v50 — doit rester visible même au-dessus de la galerie d'une visite (zIndex 12000),
      // cas d'usage 2 du chantier, sans dépasser les modals de confirmation (13050+).
      zIndex: 12200,
      top: "calc(54px + env(safe-area-inset-top))",
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexWrap: "wrap",
      rowGap: "4px",
      gap: "8px",
      width: "100%",
      maxWidth: "430px",
      border: "none",
      borderBottom: "1px solid rgba(0,0,0,0.08)",
      padding: "6px 12px",
      fontFamily: "Inter, Arial, sans-serif",
      fontSize: "12.5px",
      fontWeight: 700,
      color: "#3a2f14",
      background: "linear-gradient(180deg, #f5e6c2 0%, #ecd8a4 100%)",
      boxShadow: "0 3px 8px rgba(0,0,0,0.10)",
    },
    bandeauAnalyseIAIcone: {
      fontSize: "14px",
      lineHeight: 1,
    },
    bandeauAnalyseIATexte: {
      lineHeight: 1.2,
      textAlign: "center",
    },
    // v50.2 — badge explicite et cliquable, pour ne plus laisser deviner qu'un texte est un lien.
    badgeAfficherResultatAnalyse: {
      border: "none",
      borderRadius: "999px",
      padding: "4px 11px",
      fontFamily: "Inter, Arial, sans-serif",
      fontSize: "11.5px",
      fontWeight: 700,
      color: "#fffaf0",
      background: "#5b4326",
      cursor: "pointer",
      whiteSpace: "nowrap",
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
    galerieNavigationLocale: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "12px",
      minHeight: "28px",
    },
    galerieFlecheNavigation: {
      width: "30px",
      height: "26px",
      padding: 0,
      border: "1px solid #c9a45c",
      borderRadius: "10px",
      backgroundColor: "rgba(255,255,255,0.78)",
      color: "#6f4f20",
      fontSize: "14px",
      fontWeight: "900",
      lineHeight: 1,
      cursor: "pointer",
      fontFamily: "Arial, sans-serif",
    },
    galerieCompteur: {
      margin: 0,
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
      padding: "62px 8px 76px",
      paddingBottom: "76px",
      minHeight: "100dvh",
      overflowX: "hidden",
    },
    telephone: {
      ...baseStyles.telephone,
      maxWidth: "430px",
      padding: "5px 8px 72px",
    },
    pageAccueilFigee: {
      height: "100dvh",
      minHeight: "100dvh",
      maxHeight: "100dvh",
      // v77 — deux axes au lieu du raccourci « overflow » : au dégel, retirer le raccourci
      // effaçait aussi le overflowX de la page (avertissement React, style perdu).
      overflowX: "hidden",
      overflowY: "hidden",
      overscrollBehavior: "none",
      boxSizing: "border-box",
    },
    telephoneAccueilFige: {
      overflow: "hidden",
      overscrollBehavior: "none",
    },
    barreSuperieure: {
      ...baseStyles.barreSuperieure,
      minHeight: "58px",
      padding: "8px 9px",
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
      fontSize: "14px",
      fontWeight: "850",
      flex: "0 1 auto",
      minWidth: 0,
      letterSpacing: "-0.02em",
    },
    barreSuperieureVersion: {
      ...baseStyles.barreSuperieureVersion,
      backgroundColor: "rgba(234,216,181,0.32)",
      color: themePhotoCartel.orFonce,
      border: `1px solid ${themePhotoCartel.bordureOr}`,
      fontWeight: "900",
      flex: "0 0 auto",
      padding: "3px 7px",
      fontSize: "10px",
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
    galerieVisiteEcran: {
      position: "fixed",
      inset: 0,
      width: "100%",
      height: "100dvh",
      maxWidth: "100vw",
      maxHeight: "100dvh",
      boxSizing: "border-box",
      zIndex: 12000,
      background: themePhotoCartel.ivoire,
      color: themePhotoCartel.encre,
      fontFamily: themePhotoCartel.font,
      overflow: "hidden",
      overscrollBehavior: "none",
    },
    galerieVisiteEntete: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 12003,
      minHeight: "66px",
      padding: "calc(7px + env(safe-area-inset-top)) 10px 7px",
      boxSizing: "border-box",
      display: "grid",
      gridTemplateColumns: "38px minmax(0, 1fr) 38px",
      alignItems: "center",
      gap: "7px",
      background: "rgba(255,253,248,0.99)",
      borderBottom: `1px solid ${themePhotoCartel.bordureOr}`,
      boxShadow: "0 2px 8px rgba(50,35,20,0.08)",
    },
    galerieVisiteRetour: {
      width: "36px",
      height: "36px",
      padding: 0,
      border: `1px solid ${themePhotoCartel.bordureOr}`,
      borderRadius: "50%",
      background: themePhotoCartel.ivoireClair,
      color: themePhotoCartel.encre,
      fontSize: "30px",
      lineHeight: "29px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    galerieVisiteEnteteTexte: {
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "1px",
      lineHeight: 1.08,
      textAlign: "center",
    },
    galerieVisiteVoyage: {
      maxWidth: "100%",
      fontSize: "9px",
      fontWeight: "750",
      color: themePhotoCartel.texteDoux,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    galerieVisiteNom: {
      maxWidth: "100%",
      fontSize: "13px",
      fontWeight: "900",
      color: themePhotoCartel.encre,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    galerieVisiteMeta: {
      maxWidth: "100%",
      fontSize: "8.5px",
      fontWeight: "700",
      color: themePhotoCartel.texteDoux,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    galerieVisiteLogo: {
      width: "34px",
      height: "34px",
      objectFit: "contain",
      justifySelf: "end",
      borderRadius: "9px",
    },
    galerieVisiteGrille: {
      position: "absolute",
      top: "calc(66px + env(safe-area-inset-top))",
      bottom: "calc(60px + env(safe-area-inset-bottom))",
      left: 0,
      right: 0,
      width: "100%",
      minWidth: 0,
      overflowX: "hidden",
      overflowY: "auto",
      overscrollBehaviorX: "none",
      overscrollBehaviorY: "contain",
      display: "block",
      background: "#f4efe6",
      padding: 0,
      margin: 0,
      boxSizing: "border-box",
      WebkitOverflowScrolling: "touch",
      touchAction: "pan-y",
      scrollbarGutter: "stable",
    },
    galerieVisiteVignette: {
      position: "absolute",
      minWidth: 0,
      padding: 0,
      border: "none",
      borderRadius: "3px",
      overflow: "hidden",
      background: "#ded7cc",
      cursor: "pointer",
      boxShadow: "0 1px 3px rgba(30,20,12,0.16)",
    },
    galerieVisiteVignetteImage: {
      display: "block",
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: "center",
      background: "#ded7cc",
    },
    galerieVisiteNumeroVignette: {
      position: "absolute",
      right: "5px",
      bottom: "5px",
      minWidth: "18px",
      height: "18px",
      padding: "0 4px",
      borderRadius: "9px",
      background: "rgba(25,20,16,0.62)",
      color: "#fff",
      fontSize: "9px",
      fontWeight: "800",
      lineHeight: "18px",
      textAlign: "center",
    },
    galerieVisitePhotoZone: {
      position: "absolute",
      top: "calc(66px + env(safe-area-inset-top))",
      bottom: "calc(60px + env(safe-area-inset-bottom))",
      left: 0,
      right: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#080706",
      overflow: "hidden",
      touchAction: "pan-y pinch-zoom",
    },
    galerieVisitePhotoPleinEcran: {
      display: "block",
      width: "100%",
      height: "100%",
      objectFit: "contain",
      background: "#080706",
      userSelect: "none",
      WebkitUserDrag: "none",
    },
    galerieVisiteCompteurPhoto: {
      position: "absolute",
      bottom: "10px",
      left: "50%",
      transform: "translateX(-50%)",
      padding: "4px 9px",
      borderRadius: "12px",
      background: "rgba(0,0,0,0.55)",
      color: "#fff",
      fontSize: "10px",
      fontWeight: "800",
      pointerEvents: "none",
    },
    galerieVisiteFleche: {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 2,
      width: "34px",
      height: "54px",
      border: "1px solid rgba(255,255,255,0.22)",
      borderRadius: "17px",
      background: "rgba(0,0,0,0.28)",
      color: "rgba(255,255,255,0.92)",
      fontSize: "32px",
      lineHeight: "48px",
      padding: 0,
      cursor: "pointer",
    },
    galerieVisiteBarreBasse: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 12004,
      minHeight: "60px",
      padding: "4px 4px calc(4px + env(safe-area-inset-bottom))",
      boxSizing: "border-box",
      display: "grid",
      gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
      alignItems: "stretch",
      gap: "2px",
      background: "rgba(255,253,248,0.99)",
      borderTop: `1px solid ${themePhotoCartel.bordureOr}`,
      boxShadow: "0 -2px 8px rgba(50,35,20,0.09)",
    },
    galerieVisiteAction: {
      minWidth: 0,
      minHeight: "50px",
      padding: "3px 1px 2px",
      border: "none",
      borderRadius: "9px",
      background: "transparent",
      color: themePhotoCartel.encre,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "2px",
      fontFamily: themePhotoCartel.font,
      cursor: "pointer",
    },
    galerieVisiteActionDanger: {
      color: "#a72d2d",
    },
    galerieVisiteActionIcone: {
      fontSize: "20px",
      lineHeight: "21px",
    },
    galerieVisiteActionTexte: {
      maxWidth: "100%",
      fontSize: "7.8px",
      lineHeight: 1.05,
      fontWeight: "800",
      textAlign: "center",
      whiteSpace: "normal",
      overflowWrap: "break-word",
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
      background: "#fff8eb",
      border: `1px solid ${themePhotoCartel.bordureOr}`,
      borderRadius: "18px",
      padding: 0,
      boxShadow: themePhotoCartel.ombreLegere,
      marginBottom: "7px",
      overflow: "hidden",
    },
    sectionTitre: {
      ...baseStyles.sectionTitre,
      color: themePhotoCartel.orFonce,
      fontFamily: themePhotoCartel.font,
      fontSize: "9px",
      letterSpacing: "0.11em",
      margin: "0 0 7px",
    },
    etatPrincipal: {
      ...baseStyles.etatPrincipal,
      color: themePhotoCartel.encre,
      fontFamily: "Georgia, 'Times New Roman', serif",
      fontSize: "19px",
      lineHeight: 1.05,
      fontWeight: "700",
      margin: 0,
      letterSpacing: "-0.025em",
      whiteSpace: "normal",
      overflow: "hidden",
      textOverflow: "clip",
      overflowWrap: "anywhere",
      wordBreak: "break-word",
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: 2,
      textAlign: "left",
    },
    ligneEtat: {
      ...baseStyles.ligneEtat,
      gridTemplateColumns: "28px minmax(0, 1fr)",
      gap: "5px",
      height: "100%",
      boxSizing: "border-box",
      padding: "2px 0",
      borderTop: "1px solid rgba(91,67,38,0.10)",
      alignItems: "center",
      textAlign: "left",
    },
    ligneEtatIcone: {
      ...baseStyles.ligneEtatIcone,
      color: themePhotoCartel.or,
      fontSize: "16px",
      textAlign: "left",
      fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
    },
    ligneEtatLabel: {
      ...baseStyles.ligneEtatLabel,
      color: themePhotoCartel.texteDoux,
      fontFamily: themePhotoCartel.font,
      fontSize: "7.5px",
      letterSpacing: "0.07em",
      lineHeight: 1,
      textAlign: "left",
    },
    ligneEtatValeur: {
      ...baseStyles.ligneEtatValeur,
      minWidth: 0,
      maxWidth: "100%",
      color: themePhotoCartel.encre,
      fontFamily: "Georgia, 'Times New Roman', serif",
      fontSize: "12px",
      lineHeight: 1.02,
      fontWeight: "700",
      marginTop: 0,
      whiteSpace: "normal",
      overflow: "visible",
      textOverflow: "clip",
      overflowWrap: "anywhere",
      wordBreak: "break-word",
      textAlign: "left",
    },
    grilleActions: {
      ...baseStyles.grilleActions,
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gap: "8px",
      margin: "0 0 9px",
    },
    carteAction: {
      ...baseStyles.carteAction,
      minHeight: "110px",
      background: "rgba(255,253,248,0.96)",
      border: "1px solid rgba(199,166,110,0.12)",
      borderRadius: "16px",
      boxShadow: "0 7px 20px rgba(91,67,38,0.06)",
      padding: "12px 6px 10px",
      gap: "7px",
      color: themePhotoCartel.encre,
      fontFamily: themePhotoCartel.font,
    },
    carteActionIconeRond: {
      ...baseStyles.carteActionIconeRond,
      width: "38px",
      height: "38px",
      borderRadius: "12px",
      background: "rgba(247,239,224,0.92)",
      color: themePhotoCartel.orFonce,
      boxShadow: "none",
      fontSize: "21px",
    },
    carteActionTitre: {
      ...baseStyles.carteActionTitre,
      fontSize: "11px",
      lineHeight: "12px",
      fontWeight: "820",
      color: themePhotoCartel.encre,
      letterSpacing: "-0.015em",
      maxWidth: "112px",
    },
    carteActionSousTitre: {
      marginTop: "-3px",
      maxWidth: "115px",
      color: themePhotoCartel.texteDoux,
      fontFamily: themePhotoCartel.font,
      fontSize: "8.5px",
      lineHeight: "10px",
      fontWeight: "600",
      textAlign: "center",
    },
    compteurCarte: {
      ...baseStyles.compteurCarte,
      background: themePhotoCartel.ivoireCarte,
      border: `1px solid ${themePhotoCartel.bordureOr}`,
      boxShadow: themePhotoCartel.ombreLegere,
      padding: "7px 10px",
      margin: "0 0 6px",
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
      fontSize: "11px",
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
    modalBoutonSuppression: {
      ...baseStyles.modalBoutonPrincipal,
      background: "linear-gradient(135deg, #8f3329, #b84a3d)",
      borderRadius: themePhotoCartel.rayonBouton,
      boxShadow: "0 14px 28px rgba(143, 51, 41, 0.24)",
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
      background: themePhotoCartel.ivoireCarte,
      border: `1px solid ${themePhotoCartel.bordureOr}`,
      borderRadius: "18px",
      boxShadow: themePhotoCartel.ombreLegere,
      fontFamily: themePhotoCartel.font,
    },
    dateHeurePhotoLigne: {
      ...baseStyles.dateHeurePhotoLigne,
      gridTemplateColumns: "91px minmax(0, 1fr)",
      gap: "3px",
      fontFamily: themePhotoCartel.font,
    },
    dateHeurePhotoLigneAvecBadge: {
      display: "grid",
      gridTemplateColumns: "91px minmax(0, 1fr) auto",
      alignItems: "center",
      gap: "3px",
      minWidth: 0,
      whiteSpace: "nowrap",
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
      minWidth: 0,
      fontSize: "12px",
      color: themePhotoCartel.encre,
    },
    badgeAnalyseModifiee: {
      justifySelf: "end",
      display: "inline-flex",
      alignItems: "center",
      gap: "3px",
      width: "max-content",
      maxWidth: "100%",
      padding: "2px 6px",
      borderRadius: "999px",
      border: `1px solid ${themePhotoCartel.bordureOr}`,
      background: "linear-gradient(135deg, rgba(255,253,248,0.98), rgba(239,225,197,0.78))",
      color: themePhotoCartel.orFonce,
      boxShadow: "0 2px 7px rgba(91,67,38,0.10)",
      fontSize: "8.5px",
      fontWeight: "900",
      lineHeight: 1,
      letterSpacing: "0.01em",
      overflow: "hidden",
      textOverflow: "ellipsis",
      animation: "photocartelBadgeAnalyseModifiee 180ms ease-out both",
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
      fontSize: "7.5px",
      lineHeight: "8.5px",
      fontWeight: "850",
      whiteSpace: "normal",
      overflow: "visible",
      textOverflow: "clip",
      minHeight: "17px",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
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

  function IconeVillePhotoCartel({ taille = 22 }) {
    return (
      <img
        src={ICONE_VILLE_PHOTOCARTEL_SRC}
        alt=""
        aria-hidden="true"
        style={{
          width: `${taille}px`,
          height: `${taille}px`,
          borderRadius: "50%",
          objectFit: "cover",
          display: "block",
          flex: "0 0 auto",
        }}
      />
    );
  }

  function InfoLigne({ icone, label, valeur, action }) {
    const texteValeur = afficherValeurEtat(valeur);
    const longueurValeur = String(texteValeur).length;
    const tailleValeur =
      label === "Visite en cours"
        ? longueurValeur > 42
          ? "8px"
          : longueurValeur > 34
            ? "8.8px"
            : longueurValeur > 27
              ? "9.6px"
              : longueurValeur > 21
                ? "10.5px"
                : "12px"
        : longueurValeur > 34
          ? "9px"
          : longueurValeur > 27
            ? "10px"
            : "12px";

    return (
      <div
        className="photocartel-ligne-etat"
        style={{ ...styles.ligneEtat, position: "relative" }}
      >
        <div style={styles.ligneEtatIcone}>{icone}</div>
        <div
          style={{
            minWidth: 0,
            textAlign: "left",
            display: "grid",
            gap: "2px",
            paddingRight: action ? "28px" : 0,
          }}
        >
          <div style={styles.ligneEtatLabel}>{label}</div>
          <div style={styles.ligneEtatValeurAvecAction}>
            <div
              style={{
                ...styles.ligneEtatValeur,
                fontSize: tailleValeur,
                letterSpacing: label === "Visite en cours" ? "-0.025em" : undefined,
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
              }}
              title={String(texteValeur)}
            >
              {texteValeur}
            </div>
          </div>
          {action ? (
            <div
              style={{
                position: "absolute",
                top: "50%",
                right: 0,
                transform: "translateY(-50%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {action}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  function ActionCarte({ icone, titre, sousTitre, onClick, disabled, couleur }) {
    return (
      <button
        type="button"
        className="photocartel-carte-action"
        onClick={onClick}
        disabled={disabled}
        style={{
          ...styles.carteAction,
          opacity: disabled ? 0.48 : 1,
          cursor: disabled ? "default" : "pointer",
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
        {sousTitre ? <div style={styles.carteActionSousTitre}>{sousTitre}</div> : null}
      </button>
    );
  }

  function BoutonMenuPopup({ icone, titre, sousTitre, onClick, secondaire = false }) {
    return (
      <button
        type="button"
        onClick={onClick}
        style={{
          ...(secondaire ? styles.boutonBas : styles.bouton),
          width: "100%",
          minHeight: secondaire ? "38px" : "46px",
          marginTop: secondaire ? "5px" : 0,
          marginBottom: secondaire ? 0 : "8px",
          padding: secondaire ? "8px 12px" : "9px 12px",
          display: "grid",
          gridTemplateColumns: icone ? "28px 1fr" : "1fr",
          alignItems: "center",
          gap: "8px",
          textAlign: "left",
        }}
      >
        {icone ? <span aria-hidden="true" style={{ fontSize: "18px", textAlign: "center" }}>{icone}</span> : null}
        <span>
          <strong style={{ display: "block", fontSize: "13px", lineHeight: 1.2 }}>{titre}</strong>
          {sousTitre ? <span style={{ display: "block", marginTop: "2px", fontSize: "10.5px", lineHeight: 1.25, opacity: 0.78 }}>{sousTitre}</span> : null}
        </span>
      </button>
    );
  }

  function afficherMessageSousBouton(cible, message = "Fonctionnalité bientôt disponible") {
    setCibleMessageMenuAccueil(cible);
    setMessageMenuAccueil(message);
  }

  function MessageSousBouton({ cible }) {
    if (!messageMenuAccueil || cibleMessageMenuAccueil !== cible) return null;

    return (
      <p
        role="status"
        style={{
          ...styles.parametresChemin,
          margin: "-3px 6px 8px",
          padding: "5px 7px",
          textAlign: "center",
        }}
      >
        {messageMenuAccueil}
      </p>
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


  function LigneResumeVisite({ icone, label, valeur, separation = false, principale = false, sansIcone = false }) {
    return (
      <div
        style={{
          ...styles.resumeVisiteLigne,
          ...(separation ? styles.resumeVisiteLigneSeparee : {}),
          ...(principale ? styles.resumeVisiteLignePrincipale : {}),
          ...(sansIcone ? styles.resumeVisiteLigneSansIcone : {}),
        }}
      >
        {sansIcone ? null : <div style={styles.resumeVisiteIcone}>{icone}</div>}
        <div style={{
          ...styles.resumeVisiteLabel,
          ...(principale ? styles.resumeVisiteLabelPrincipal : {}),
        }}>{label}</div>
        <div style={{
          ...styles.resumeVisiteValeur,
          ...(principale ? styles.resumeVisiteValeurPrincipale : {}),
        }}>{afficherValeurEtat(valeur)}</div>
      </div>
    );
  }

  function BlocResumeVisite({ visite }) {
    if (!visite) return null;

    if (visite.estARattacher || visite.statut === "À rattacher") {
      return (
        <section style={styles.resumeVisiteCarte} aria-label="Résumé de visite à rattacher">
          <div style={styles.resumeVisiteTitreLigne}>
            <div style={styles.resumeVisiteTitre}>Résumé de visite</div>
          </div>

          <LigneResumeVisite
            label="Nom de la visite"
            valeur={visite.nom}
            principale
            sansIcone
          />
          <LigneResumeVisite
            icone="📅"
            label="Date de la visite"
            valeur={dateCourteGalerieVisite(visite)}
          />
          <LigneResumeVisite
            icone="🖼️"
            label="Nombre de photos"
            valeur={Number(
              visite.nombrePhotos ??
              visite.photosRangees ??
              visite.nombrePhotosDeclare ??
              0
            )}
          />

          <div style={{ ...styles.resumeVisiteBoutonsSecondaires, gridTemplateColumns: "1fr 1fr" }}>
            <button
              type="button"
              onClick={() => ouvrirGalerieVisiteMaquette(visite)}
              style={styles.resumeVisiteBoutonSecondaire}
            >
              📂 Ouvrir la visite
            </button>
            <button
              type="button"
              onClick={retourAccueil}
              style={styles.resumeVisiteBoutonSecondaire}
            >
              ✕ Fermer la fenêtre
            </button>
          </div>
        </section>
      );
    }

    return (
      <section style={styles.resumeVisiteCarte} aria-label="Résumé de visite">
        <div style={styles.resumeVisiteTitreLigne}>
          <div style={styles.resumeVisiteTitre}>Résumé de visite</div>
          <button
            type="button"
            onClick={() => ouvrirModificationIdentiteVisite(visite, "resume")}
            style={{ ...styles.boutonModifierIdentite, position: "absolute", right: "3px", top: "1px", width: "22px", height: "22px", minWidth: "22px", minHeight: "22px", padding: 0, fontSize: "12px" }}
            aria-label="Modifier cette visite"
            title="Modifier cette visite"
          >
            <span aria-hidden="true">✏️</span>
          </button>
        </div>

        <LigneResumeVisite label="Nom de la visite" valeur={visite.nom} principale sansIcone />
        <LigneResumeVisite icone="🧳" label="Voyage" valeur={visite.voyage} />
        <LigneResumeVisite
          icone={<IconeVillePhotoCartel taille={18} />}
          label="Ville"
          valeur={visite.ville === "Visites rapides" ? "Ville non renseignée" : visite.ville}
        />
        <LigneResumeVisite icone={iconePourTypeVisite(libelleTypeVisiteResume(visite))} label="Type de visite" valeur={libelleTypeVisiteResume(visite)} />

        <div style={styles.resumeVisiteDatesCadre}>
          <div style={styles.resumeVisiteDateLigne}>
            <span style={styles.resumeVisiteDateIcone}>📅</span>
            <span style={styles.resumeVisiteDateLabel}>Début de la visite</span>
            <span style={styles.resumeVisiteDateValeur}>{formaterDateVisiteDepuisMs(visite.debutMs)}</span>
          </div>
          <div style={{ ...styles.resumeVisiteDateLigne, borderBottom: "none" }}>
            <span style={styles.resumeVisiteDateIcone}>🏁</span>
            <span style={styles.resumeVisiteDateLabel}>Fin de la visite</span>
            <span style={styles.resumeVisiteDateValeur}>{formaterDateVisiteDepuisMs(visite.finMs)}</span>
          </div>
        </div>

        <LigneResumeVisite icone="⏱️" label="Durée de la visite" valeur={formaterDureeVisiteRangee(visite)} />
        <LigneResumeVisite
          icone="🖼️"
          label="Nombre de photos de la visite"
          valeur={Number(visite.nombrePhotos ?? visite.photosRangees ?? visite.nombrePhotosDeclare ?? 0)}
        />

        <div style={styles.resumeVisiteStatutZone}>
          <LigneResumeVisite icone={visite.statut === "Importée" ? "📥" : "✅"} label="Statut" valeur={visite.statut || "Importée"} />
        </div>

        <div style={styles.resumeVisiteBoutonsSecondaires}>
          <button
            type="button"
            onClick={() => ouvrirGalerieVisiteMaquette(visite)}
            style={styles.resumeVisiteBoutonSecondaire}
          >
            📂 Ouvrir la visite
          </button>
          <button
            type="button"
            onClick={() => {
              setVisiteASupprimer(visite);
              setErreurSuppressionVisite("");
              setConfirmationSuppressionVisite(true);
            }}
            style={{ ...styles.resumeVisiteBoutonSecondaire, color: "#a12622" }}
          >
            🗑️ Supprimer la visite
          </button>
          <button type="button" onClick={retourAccueil} style={styles.resumeVisiteBoutonSecondaire}>
            ✕ Fermer la fenêtre
          </button>
        </div>
        <button
          type="button"
          style={styles.resumeVisiteBoutonActions}
          disabled
          aria-disabled="true"
        >
          … Actions
        </button>
      </section>
    );
  }

  function BlocEtatVisite() {
    return (
      <section style={styles.carteEtat}>
        <div className="photocartel-accueil-bloc" style={styles.accueilBlocPrincipal}>
          <div className="photocartel-accueil-informations" style={styles.accueilInformations}>
            <div className="photocartel-accueil-voyage-titre" style={styles.accueilVoyageTitreLigne}>
              <div style={styles.accueilVoyageTexte}>
                <div
                  style={{
                    ...styles.sectionTitre,
                    fontSize: "10px",
                    lineHeight: 1,
                    marginBottom: "5px",
                  }}
                >
                  Voyage en cours
                </div>
                <div
                  style={{
                    ...styles.etatPrincipal,
                    fontSize:
                      String(voyage || "").length > 42
                        ? "10px"
                        : String(voyage || "").length > 34
                          ? "11px"
                          : String(voyage || "").length > 26
                            ? "12.5px"
                            : "16px",
                    lineHeight: 1.02,
                    whiteSpace: "normal",
                    overflow: "visible",
                    textOverflow: "clip",
                    overflowWrap: "anywhere",
                    wordBreak: "break-word",
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                  }}
                  title={afficherValeurEtat(voyage, "Aucun voyage actif")}
                >
                  {drapeauPourNomVoyage(voyage) ? (
                    <span
                      aria-hidden="true"
                      style={{
                        flex: "0 0 auto",
                        fontSize: "19px",
                        lineHeight: 1,
                      }}
                    >
                      {drapeauPourNomVoyage(voyage)}
                    </span>
                  ) : null}
                  <span style={{ minWidth: 0 }}>
                    {afficherValeurEtat(voyage, "Aucun voyage actif")}
                  </span>
                </div>
              </div>
            </div>

            <InfoLigne
              icone="📍"
              label="Visite en cours"
              valeur={lieuVisite || "Aucune visite"}
              action={
                <button
                  type="button"
                  onClick={() => ouvrirModificationIdentiteVisite(null, "active")}
                  disabled={!(lieuVisite || visiteActive?.nom)}
                  style={{
                    ...styles.boutonModifierIdentiteAccueil,
                    opacity: lieuVisite || visiteActive?.nom ? 1 : 0.42,
                    cursor: lieuVisite || visiteActive?.nom ? "pointer" : "default",
                  }}
                  aria-label="Modifier cette visite"
                  title={
                    lieuVisite || visiteActive?.nom
                      ? "Modifier cette visite"
                      : "Aucune visite à modifier"
                  }
                >
                  <span aria-hidden="true">✏️</span>
                </button>
              }
            />
            <InfoLigne icone={<IconeVillePhotoCartel taille={22} />} label="Ville" valeur={villeVisite || "Aucune ville"} />
            <InfoLigne icone={iconePourTypeVisite(typeVisiteAffiche)} label="Type de visite" valeur={typeVisiteAffiche} />

            <div style={styles.accueilCompteurLigne}>
              <div style={styles.accueilCompteurIcone}>📷</div>
              <div style={styles.accueilCompteurLabel}>Nombre de photos de la visite</div>
              <div style={styles.accueilCompteurValeur}>{photosCollectees > 999 ? "999+" : photosCollectees}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setModeGestionVoyage(true)}
            className="photocartel-gestion-voyage" style={styles.boutonGestionVoyageAccueil}
            aria-label="Gestion du voyage"
          >
            <span style={styles.boutonGestionVoyageIcone}>🧳</span>
            <span>Gestion<br />du voyage</span>
          </button>

          <img
            src={PHOTO_ACCUEIL_PHOTOCARTEL_SRC}
            alt="Intérieur de musée"
            className="photocartel-accueil-photo" style={styles.accueilPhoto}
          />
        </div>
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
        <DetailLigne icone={iconePourTypeVisite(derniereVisite.type || "Non renseigné")} label="Type de visite" valeur={derniereVisite.type} />
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
          <DetailLigne
            icone="📈"
            label="Taux de réussite"
            valeur={`${dashboardRenommage.tauxReussite} % (${dashboardRenommage.oeuvresRenommees}/${dashboardRenommage.photosAnalysees})`}
          />
        </section>

        {/* v67 — mise en evidence demandee : vignette + nouveau nom de chaque oeuvre reellement
            renommee. Donnee deja renvoyee par /renommer-oeuvres/confirmer (resultats), jamais
            affichee jusqu'ici. Vignette generee comme sur l'ecran de proposition (blob local a
            partir du fichier original selectionne), pas de nouvelle route serveur necessaire. */}
        {resultatsRenommageDetail && resultatsRenommageDetail.some((r) => r.success) && (
          <section style={styles.carteDerniereVisite}>
            <div style={styles.sectionTitre}>Œuvres renommées</div>
            {resultatsRenommageDetail
              .filter((resultat) => resultat.success)
              .map((resultat, index) => {
                const fichierOriginal = fichiersRenommage.find((f) => f.name === resultat.oeuvre);
                const urlMiniature = fichierOriginal ? URL.createObjectURL(fichierOriginal) : null;
                return (
                  <div
                    key={resultat.oeuvre + index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginTop: index === 0 ? 0 : "12px",
                      paddingTop: index === 0 ? 0 : "12px",
                      borderTop: index === 0 ? "none" : "1px solid #eee",
                    }}
                  >
                    {urlMiniature && (
                      <img
                        src={urlMiniature}
                        alt={`Œuvre renommée : ${resultat.nomOeuvreFinal}`}
                        style={{
                          width: "56px",
                          height: "56px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <div style={{ fontSize: "13px", fontWeight: "600", wordBreak: "break-word" }}>
                      {resultat.nomOeuvreFinal}
                    </div>
                  </div>
                );
              })}
          </section>
        )}

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
        <span style={styles.barreSuperieureVersion}>{VERSION.numero}</span>
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

  // v50 — Ramène l'utilisateur sur la tâche d'analyse IA déjà engagée, depuis n'importe quel écran
  // (bandeau global ou nouvelle tentative de lancement pendant qu'une analyse est active).
  function ouvrirEcranAnalyseDepuisArrierePlan() {
    if (!analysePhotoSessionActiveRef.current) return;
    retourAccueil();
    setModeAnalysePhoto(true);
  }

  // v50 — Bandeau discret et global signalant l'état de la tâche d'analyse IA en arrière-plan.
  // v50.3 — retour de recette : affiché désormais AUSSI sur l'écran d'analyse lui-même
  // (dès le clic sur « Lancer l'analyse IA »), pour une présence cohérente sur tous les écrans,
  // sans exception. Auparavant masqué sur cet écran, jugé redondant avec sa carte d'état interne —
  // l'utilisateur préfère le voir partout, tout de suite.
  // - « en cours » : petite animation de points (indique un travail réel en arrière-plan) ;
  // - « terminée » : pas d'animation, et le lien vers le résultat est un badge explicite
  //   (« Afficher les résultats de l'analyse »), plus le texte ambigu à deviner ;
  // - texte strictement impersonnel (PhotoCartel ne tutoie jamais l'utilisateur).
  function BandeauAnalyseIAArrierePlan() {
    if (etatTacheAnalyseIA !== "en_cours" && etatTacheAnalyseIA !== "terminee") return null;

    const enCours = etatTacheAnalyseIA === "en_cours";
    // Retour de recette : la barre supérieure normale (54px), l'en-tête de la galerie d'une
    // visite (66px) et l'écran d'analyse lui-même (58px) n'ont pas la même hauteur ; on décale
    // le bandeau en conséquence pour qu'il ne recouvre jamais leurs informations.
    const decalageHaut = modeAnalysePhoto
      ? "calc(58px + env(safe-area-inset-top))"
      : modeGalerieVisite
        ? "calc(66px + env(safe-area-inset-top))"
        : "calc(54px + env(safe-area-inset-top))";

    return (
      <div
        role="status"
        aria-label={enCours ? "Analyse IA en cours" : "Analyse IA terminée"}
        style={{ ...styles.bandeauAnalyseIA, top: decalageHaut, cursor: enCours ? "pointer" : "default" }}
        onClick={enCours ? ouvrirEcranAnalyseDepuisArrierePlan : undefined}
      >
        <span style={styles.bandeauAnalyseIAIcone}>{enCours ? "🤖" : "✅"}</span>
        <span style={styles.bandeauAnalyseIATexte}>
          {enCours ? (
            <>
              Analyse IA en cours
              <span className="photocartel-bandeau-points" aria-hidden="true">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            </>
          ) : (
            "Analyse IA terminée"
          )}
        </span>
        {!enCours && (
          <button
            type="button"
            onClick={ouvrirEcranAnalyseDepuisArrierePlan}
            style={styles.badgeAfficherResultatAnalyse}
          >
            Afficher les résultats de l’analyse
          </button>
        )}
      </div>
    );
  }

  function BarreFixe() {
    // v32 DEV : barre fixe = accès permanent aux gestes essentiels de PhotoCartel.
    // Accueil et Analyser une photo sont des commandes globales qui interrompent le contexte courant.
    // v50 — retour de recette : pour ne pas trop élargir le périmètre de la V1,
    // Bibliothèques et Paramètres restent inactifs tant qu'une analyse IA est engagée
    // (en cours ou terminée non enregistrée). Accueil et Analyser une photo restent
    // volontairement accessibles : ce sont les deux seules portes de sortie du contexte.
    const analyseEngagee = etatTacheAnalyseIA === "en_cours" || etatTacheAnalyseIA === "terminee";
    const boutons = [
      {
        icone: "🏠",
        texte: "Accueil",
        action: async () => {
          // v38.1 : Accueil interrompt toujours le contexte courant.
          // Une analyse déjà engagée est fermée proprement sans supprimer
          // la photo éventuellement enregistrée dans « Photos à analyser ».
          if (modeAnalysePhoto || analysePhotoSessionActiveRef.current) {
            fermerAnalysePhoto();
          }

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
        icone: "🗺️",
        texte: "Bibliothèques",
        action: () => {
          setMessageMenuAccueil("");
          setCibleMessageMenuAccueil("");
          setModeBibliotheques(true);
        },
        disabled: analyseEngagee,
      },
      {
        icone: "⚙️",
        texte: "Paramètres",
        action: () => {
          setEcranParametres("menu");
          setMessageMenuAccueil("");
          setCibleMessageMenuAccueil("");
          setMessageTestStockageAndroid("");
          setModeParametres(true);
        },
        disabled: analyseEngagee,
      },
    ];

    return (
      <nav style={styles.barreFixe} aria-label="Barre fixe PhotoCartel">
        {boutons.map((bouton) => (
          <button
            key={bouton.texte}
            type="button"
            onClick={bouton.action}
            disabled={bouton.disabled}
            style={{
              ...styles.barreFixeBouton,
              opacity: bouton.disabled ? 0.52 : 1,
              cursor: bouton.disabled ? "default" : "pointer",
            }}
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
    // v50.3 — retour de recette : quand l'analyse a été lancée depuis la galerie d'une visite,
    // un bouton dédié permet d'y retourner directement, sans enregistrer ni abandonner le résultat.
    const contexteGalerieVisite = analyseContexteRetourRef.current?.type === "galerie-visite";

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
      contexteGalerieVisite
        ? {
            icone: "🖼️",
            texte: "Revenir à la galerie de la visite",
            action: revenirALaGalerieVisiteSansResoudre,
            disabled: analysePhotoEnCours || analysePhotoSauvegardeEnCours,
          }
        : {
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
    const ficheDisponible = galerieAnalyses.length > 0;
    const actions = [
      {
        icone: analysePhotoEdition ? "↩️" : "✏️",
        texte: analysePhotoEdition ? "Annuler les modifications" : "Modifier l'analyse",
        action: analysePhotoEdition
          ? annulerModificationsAnalyseGalerie
          : entrerModeModificationAnalyseGalerie,
        disabled: !ficheDisponible || galerieChargement || galerieSauvegardeEnCours,
        connectee: true,
      },
      {
        icone: "💾",
        texte: "Enregistrer l'analyse",
        action: enregistrerAnalyseGalerie,
        disabled:
          !ficheDisponible ||
          !analysePhotoEdition ||
          !analysePhotoModifiee ||
          galerieChargement ||
          galerieSauvegardeEnCours,
        connectee: true,
      },
      // v79 — un bouton qui ne fait rien est affiché indisponible, avec la mention.
      { icone: "📤", texte: "Exporter la galerie (non connecté)", action: () => {}, disabled: true, connectee: false },
      // v79 — « Rechercher » ouvre l'écran de recherche, comme la barre de l'accueil.
      {
        icone: "🔎",
        texte: "Rechercher",
        action: () => {
          fermerGaleriePhotosAnalysees();
          ouvrirEcranRecherche();
        },
        disabled: false,
        connectee: true,
      },
      {
        icone: "🗑️",
        texte: "Supprimer cette fiche",
        action: ouvrirConfirmationSuppressionGalerie,
        disabled:
          !ficheDisponible ||
          analysePhotoEdition ||
          galerieChargement ||
          galerieSauvegardeEnCours,
        connectee: true,
      },
    ];

    return (
      <nav
        style={styles.barreActionsGalerie}
        aria-label="Actions de la galerie des photos analysées"
      >
        {actions.map((action) => (
          <button
            key={action.texte}
            type="button"
            onClick={action.action}
            disabled={action.disabled}
            style={{
              ...styles.barreActionsFicheBouton,
              opacity: action.disabled ? 0.38 : 1,
              cursor: action.disabled ? "not-allowed" : action.connectee ? "pointer" : "default",
            }}
            aria-label={action.connectee ? action.texte : `${action.texte} — non connecté dans la v36`}
            title={action.connectee ? action.texte : `${action.texte} — non connecté dans la v36`}
          >
            <span style={styles.barreActionsFicheIcone}>{action.icone}</span>
            <span style={styles.barreActionsFicheTexte}>{action.texte}</span>
          </button>
        ))}
      </nav>
    );
  }

  function cleCacheGalerieVisite(visite) {
    return String(
      visite?.chemin ||
      visite?.idPhysique ||
      visite?.id ||
      [visite?.voyage, visite?.ville, visite?.nom].filter(Boolean).join("::")
    ).trim();
  }

  function limiterCacheImagesAndroidGalerie() {
    const cache = cacheUrlsImagesAndroidGalerieRef.current;
    while (cache.size > MAX_IMAGES_ANDROID_EN_MEMOIRE) {
      const premiereCle = cache.keys().next().value;
      const url = cache.get(premiereCle);
      cache.delete(premiereCle);
      try { if (String(url || "").startsWith("blob:")) URL.revokeObjectURL(url); } catch (_) {}
    }
  }

  function executerFileImagesAndroidGalerie() {
    while (
      travailleursImagesAndroidGalerieRef.current < CONCURRENCE_CHARGEMENT_IMAGES_ANDROID &&
      fileImagesAndroidGalerieRef.current.length
    ) {
      const travail = fileImagesAndroidGalerieRef.current.shift();
      travailleursImagesAndroidGalerieRef.current += 1;
      Promise.resolve()
        .then(travail.executer)
        .then(travail.resolve, travail.reject)
        .finally(() => {
          travailleursImagesAndroidGalerieRef.current -= 1;
          setTimeout(executerFileImagesAndroidGalerie, 0);
        });
    }
  }

  async function creerMiniatureAndroidGalerie(fichier) {
    if (typeof createImageBitmap !== "function") return fichier;
    const bitmap = await createImageBitmap(fichier);
    try {
      const tailleMax = 360;
      const rapport = Math.min(1, tailleMax / Math.max(bitmap.width || 1, bitmap.height || 1));
      const largeur = Math.max(1, Math.round(bitmap.width * rapport));
      const hauteur = Math.max(1, Math.round(bitmap.height * rapport));
      const canvas = document.createElement("canvas");
      canvas.width = largeur;
      canvas.height = hauteur;
      const contexte = canvas.getContext("2d", { alpha: false });
      contexte.drawImage(bitmap, 0, 0, largeur, hauteur);
      const blob = await new Promise((resolve) => {
        canvas.toBlob(
          (resultat) => resolve(resultat || fichier),
          "image/webp",
          0.72
        );
      });
      canvas.width = 1;
      canvas.height = 1;
      return blob;
    } finally {
      try { bitmap.close(); } catch (_) {}
    }
  }

  function obtenirUrlImageAndroidGalerie(photo, miniature = false) {
    const identifiant = String(photo?.id || photo?.cheminRelatif || photo?.nom || "").trim();
    const cle = identifiant ? `${identifiant}|${miniature ? "mini" : "original"}` : "";
    if (!cle || photo?.handleAndroid?.kind !== "file") return Promise.resolve("");

    const cache = cacheUrlsImagesAndroidGalerieRef.current;
    if (cache.has(cle)) {
      const url = cache.get(cle);
      cache.delete(cle);
      cache.set(cle, url);
      return Promise.resolve(url);
    }

    if (promessesImagesAndroidGalerieRef.current.has(cle)) {
      return promessesImagesAndroidGalerieRef.current.get(cle);
    }

    const promesse = new Promise((resolve, reject) => {
      fileImagesAndroidGalerieRef.current.push({
        resolve,
        reject,
        executer: async () => {
          const fichier = await photo.handleAndroid.getFile();
          const contenuAffiche = miniature ? await creerMiniatureAndroidGalerie(fichier) : fichier;
          const urlObjet = URL.createObjectURL(contenuAffiche);
          cache.set(cle, urlObjet);
          limiterCacheImagesAndroidGalerie();
          return urlObjet;
        },
      });
      executerFileImagesAndroidGalerie();
    }).finally(() => {
      promessesImagesAndroidGalerieRef.current.delete(cle);
    });

    promessesImagesAndroidGalerieRef.current.set(cle, promesse);
    return promesse;
  }

  function memoriserGalerieVisiteCourante() {
    const cle = cleCacheGalerieVisite(visiteGalerieMaquette);
    if (!cle || !visiteGalerieMaquette) return;
    cacheGaleriesVisiteRef.current.set(cle, {
      visite: visiteGalerieMaquette,
      photos: photosGalerieVisite,
      total: nombreTotalPhotosGalerieVisite,
      scrollTop: galerieVisiteGrilleRef.current?.scrollTop ?? scrollTopGalerieVisite,
      dateMs: Date.now(),
    });
  }

  function urlPhotoGalerieVisite(photo) {
    const url = String(photo?.url || "").trim();
    if (!url) return "";
    return /^(https?:|blob:|data:)/i.test(url) ? url : `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
  }

  // v50 — récupère le fichier réel d'une photo de la galerie d'une visite, pour pouvoir
  // la transmettre au moteur d'analyse IA (partagé avec « Analyser une photo »).
  async function obtenirFichierPourAnalyseDepuisPhotoGalerieVisite(photo) {
    if (!photo) return null;

    if (photo.handleAndroid?.kind === "file") {
      return await photo.handleAndroid.getFile();
    }

    const url = urlPhotoGalerieVisite(photo);
    if (!url) return null;
    const reponse = await fetch(url);
    if (!reponse.ok) {
      throw new Error("Impossible de récupérer la photo de la visite pour l’analyse.");
    }
    const blob = await reponse.blob();
    return new File([blob], photo.nom || "photo.jpg", { type: blob.type || "image/jpeg" });
  }

  // v50 — cas d'usage « Depuis la galerie d'une visite » : déclenche l'analyse IA de la photo
  // actuellement affichée SANS quitter la galerie. L'analyse démarre immédiatement (pas d'écran
  // intermédiaire « Lancer l'analyse ») ; l'utilisateur continue à faire défiler les photos
  // pendant que l'analyse se poursuit en arrière-plan, signalée par le bandeau global.
  async function lancerAnalyseDepuisGalerieVisite() {
    // v50.3 — même principe que handleAnalyserUnePhoto : seule une analyse réellement EN COURS
    // bloque un nouveau lancement. Un résultat terminé mais pas encore enregistré est abandonné.
    if (etatTacheAnalyseIA === "en_cours") {
      window.alert("Une analyse IA est déjà en cours.");
      return;
    }

    const photo = photosGalerieVisite[indexPhotoGalerieVisite];
    if (!photo) return;

    fermerAnalysePhoto({ forcer: true });

    // v50 — retour de recette : on mémorise précisément d'où l'analyse est lancée
    // (la visite, la photo, le mode fiche) pour pouvoir y revenir automatiquement
    // une fois la tâche résolue (enregistrement ou abandon), au lieu de finir sur l'accueil.
    analyseContexteRetourRef.current = {
      type: "galerie-visite",
      visite: visiteGalerieMaquette,
      index: indexPhotoGalerieVisite,
      modePhoto: modePhotoGalerieVisite,
    };

    try {
      const fichier = await obtenirFichierPourAnalyseDepuisPhotoGalerieVisite(photo);
      if (!fichier) {
        window.alert("Impossible de récupérer cette photo pour l’analyse.");
        return;
      }
      await demarrerSessionAnalyseIA(fichier, {
        origine: "galerie-visite",
        afficherEcran: false,
        lancementAutomatique: true,
      });
    } catch (error) {
      console.error("Lancement analyse depuis la galerie de visite :", error);
      window.alert("L’analyse IA n’a pas pu démarrer : " + error.message);
    }
  }

  function annulerChargementsGalerieVisite() {
    generationGalerieVisiteRef.current += 1;
    prefetchMiniaturesAnnuleRef.current = true;
    filePrefetchMiniaturesRef.current = [];
    miniaturesPrefetchVuesRef.current.clear();
    for (const controleur of chargementsGalerieAbortRef.current) {
      try { controleur.abort(); } catch (_) {}
    }
    chargementsGalerieAbortRef.current = [];
  }

  function normaliserTableauPhotosGalerie(ancien, nouvelles, offset, total) {
    const taille = Math.max(Number(total || 0), ancien.length, offset + nouvelles.length);
    const resultat = ancien.length === taille ? [...ancien] : Array.from({ length: taille }, (_, i) => ancien[i] || null);
    nouvelles.forEach((photo, index) => { resultat[offset + index] = photo; });
    return resultat;
  }

  function prechargerMiniaturesGalerieEnArrierePlan(photos, generation) {
    if (generationGalerieVisiteRef.current !== generation || prefetchMiniaturesAnnuleRef.current) return;
    for (const photo of photos.filter(Boolean)) {
      const url = urlMiniatureGalerieVisite(photo);
      if (!url || miniaturesPrefetchVuesRef.current.has(url)) continue;
      miniaturesPrefetchVuesRef.current.add(url);
      filePrefetchMiniaturesRef.current.push(url);
    }

    const lancerTravailleur = async () => {
      travailleursPrefetchMiniaturesRef.current += 1;
      try {
        while (
          filePrefetchMiniaturesRef.current.length &&
          generationGalerieVisiteRef.current === generation &&
          !prefetchMiniaturesAnnuleRef.current
        ) {
          const url = filePrefetchMiniaturesRef.current.shift();
          await new Promise((resolve) => {
            const image = new Image();
            image.onload = image.onerror = resolve;
            image.decoding = "async";
            image.src = url;
          });
          await new Promise((resolve) => {
            if (typeof window.requestIdleCallback === "function") {
              window.requestIdleCallback(() => resolve(), { timeout: 120 });
            } else {
              setTimeout(resolve, 16);
            }
          });
        }
      } finally {
        travailleursPrefetchMiniaturesRef.current -= 1;
        if (
          filePrefetchMiniaturesRef.current.length &&
          generationGalerieVisiteRef.current === generation &&
          !prefetchMiniaturesAnnuleRef.current
        ) {
          prechargerMiniaturesGalerieEnArrierePlan([], generation);
        }
      }
    };

    while (
      travailleursPrefetchMiniaturesRef.current < CONCURRENCE_PREFETCH_MINIATURES &&
      filePrefetchMiniaturesRef.current.length
    ) {
      void lancerTravailleur();
    }
  }

  async function ouvrirGalerieVisiteMaquette(visite) {
    if (!visite || autorisationGalerieEnCours) return;
    if (!estAndroid()) {
      await ouvrirGalerieVisiteApresValidation(visite);
      return;
    }

    try {
      setAutorisationGalerieEnCours(true);
      setErreurGalerieVisite("");

      // v47.2 : requestPermission/showDirectoryPicker est volontairement la première
      // opération asynchrone du clic utilisateur, condition imposée par Chrome Android.
      const candidat =
        photoCartelHandleRacineAndroidSessionRef.current ||
        photoCartelHandleDcimSessionRef.current ||
        autorisationGalerieHandleCandidatRef.current;

      let contexte = null;
      if (candidat?.requestPermission) {
        const permission = await candidat.requestPermission({ mode: "readwrite" });
        if (permission !== "granted") {
          autorisationGalerieHandleCandidatRef.current = null;
          throw new Error("L’autorisation PhotoCartel a été refusée. Appuie de nouveau sur Ouvrir la visite pour sélectionner DCIM ou PhotoCartel.");
        }
        if (estHandlePhotoCartelValide(candidat)) {
          contexte = await installerContexteStockageAndroid({
            type: "photocartel",
            dossierPhotoCartel: candidat,
            source: "reactivation-galerie-photocartel",
          });
        } else if (estHandleDcimValide(candidat)) {
          const { dossierPhotoCartel } = await creerArborescenceInfrastructurePhotoCartel(candidat);
          contexte = await installerContexteStockageAndroid({
            type: "dcim",
            dossierDcim: candidat,
            dossierPhotoCartel,
            source: "reactivation-galerie-dcim",
          });
        }
      } else {
        if (typeof window.showDirectoryPicker !== "function") {
          throw new Error("Ce navigateur ne permet pas de sélectionner le dossier PhotoCartel.");
        }
        const choisi = await window.showDirectoryPicker({
          id: "photocartel-racine-v47-2",
          mode: "readwrite",
          startIn: "pictures",
        });
        if (estHandlePhotoCartelValide(choisi)) {
          contexte = await installerContexteStockageAndroid({
            type: "photocartel",
            dossierPhotoCartel: choisi,
            source: "selection-galerie-photocartel",
          });
        } else if (estHandleDcimValide(choisi)) {
          const { dossierPhotoCartel } = await creerArborescenceInfrastructurePhotoCartel(choisi);
          contexte = await installerContexteStockageAndroid({
            type: "dcim",
            dossierDcim: choisi,
            dossierPhotoCartel,
            source: "selection-galerie-dcim",
          });
        } else {
          throw new Error(`Mauvais dossier sélectionné : ${choisi.name}. Sélectionne DCIM ou PhotoCartel.`);
        }
      }

      if (!contexte?.dossierPhotoCartel) {
        throw new Error("Autorisation du dossier PhotoCartel nécessaire.");
      }
      autorisationGalerieHandleCandidatRef.current =
        contexte.type === "dcim" ? contexte.dossierDcim : contexte.dossierPhotoCartel;

      // Validation physique de bout en bout avant d’afficher l’écran galerie.
      const dossierVisite = await resoudreHandleVisiteAndroid(visite, contexte.dossierPhotoCartel);
      const photos = await listerPhotosVisiteAndroid(visite, dossierVisite);
      if (photos.length) {
        const premierFichier = await photos[0].handleAndroid.getFile();
        await premierFichier.slice(0, Math.min(1, premierFichier.size)).arrayBuffer();
      }

      await ouvrirGalerieVisiteApresValidation(visite, photos);
    } catch (error) {
      if (error?.name !== "AbortError") {
        console.error("Autorisation / ouverture galerie visite :", error);
        setErreurGalerieVisite(error?.message || "Impossible d’ouvrir cette visite.");
        alert(error?.message || "Impossible d’ouvrir cette visite.");
      }
    } finally {
      setAutorisationGalerieEnCours(false);
    }
  }

  async function ouvrirGalerieVisiteApresValidation(visite, photosAndroidPreparees = null) {
    if (!visite) return;

    annulerChargementsGalerieVisite();
    const generation = generationGalerieVisiteRef.current;
    prefetchMiniaturesAnnuleRef.current = false;
    const cleCache = cleCacheGalerieVisite(visite);
    const galerieEnCache = cacheGaleriesVisiteRef.current.get(cleCache);

    setVisiteGalerieMaquette(visite);
    setIndexPhotoGalerieVisite(0);
    setModePhotoGalerieVisite(false);
    setErreurGalerieVisite("");
    setModeGalerieVisite(true);

    if (galerieEnCache?.photos?.length) {
      setPhotosGalerieVisite(galerieEnCache.photos);
      setNombreTotalPhotosGalerieVisite(galerieEnCache.total || galerieEnCache.photos.length);
      setScrollTopGalerieVisite(Number(galerieEnCache.scrollTop || 0));
      setChargementGalerieVisite(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (galerieVisiteGrilleRef.current) {
            galerieVisiteGrilleRef.current.scrollTop = Number(galerieEnCache.scrollTop || 0);
          }
        });
      });
      return;
    }

    setPhotosGalerieVisite([]);
    setNombreTotalPhotosGalerieVisite(Number(visite.nombrePhotos || 0));
    setScrollTopGalerieVisite(0);
    setChargementGalerieVisite(true);

    try {
      let photos = [];
      if (estAndroid()) {
        photos = Array.isArray(photosAndroidPreparees) ? photosAndroidPreparees : await listerPhotosVisiteAndroid(visite);
        if (generationGalerieVisiteRef.current !== generation) return;
        setNombreTotalPhotosGalerieVisite(photos.length);
        setPhotosGalerieVisite(photos);
        setChargementGalerieVisite(false);
        cacheGaleriesVisiteRef.current.set(cleCache, {
          visite,
          photos,
          total: photos.length,
          scrollTop: 0,
          dateMs: Date.now(),
        });
      } else {
        const cheminVisite = String(visite.chemin || "").trim();
        if (!cheminVisite) throw new Error("Le chemin physique de cette visite n’est pas disponible.");

        const lirePage = async (offset = 0, limit = TAILLE_PAGE_FOND_GALERIE_VISITE) => {
          const controleur = new AbortController();
          chargementsGalerieAbortRef.current.push(controleur);
          const response = await fetch(
            `${API_BASE}/api/photos-visite?chemin=${encodeURIComponent(cheminVisite)}&offset=${offset}&limit=${limit}`,
            { signal: controleur.signal }
          );
          const data = await lireReponseJsonPhotoCartel(response, "Lecture des photos de la visite");
          if (!response.ok || data.success === false) throw new Error(data.error || "Impossible de lire les photos de cette visite.");
          return data;
        };

        const premierePage = await lirePage(0, TAILLE_INITIALE_GALERIE_VISITE);
        if (generationGalerieVisiteRef.current !== generation) return;
        const total = Number(premierePage.nombrePhotos || 0);
        const premiereTranche = Array.isArray(premierePage.photos) ? premierePage.photos : [];
        setNombreTotalPhotosGalerieVisite(total);
        setPhotosGalerieVisite((ancien) => normaliserTableauPhotosGalerie(ancien, premiereTranche, 0, total));
        setChargementGalerieVisite(false);

        let offsetSuivant = premierePage.suivantOffset;
        while (offsetSuivant !== null && offsetSuivant !== undefined && generationGalerieVisiteRef.current === generation) {
          const page = await lirePage(offsetSuivant, TAILLE_PAGE_FOND_GALERIE_VISITE);
          if (generationGalerieVisiteRef.current !== generation) return;
          const nouvelles = Array.isArray(page.photos) ? page.photos : [];
          const offsetPage = Number(page.offset || offsetSuivant);
          setPhotosGalerieVisite((ancien) => normaliserTableauPhotosGalerie(ancien, nouvelles, offsetPage, total));
          offsetSuivant = page.suivantOffset;
          await new Promise((resolve) => setTimeout(resolve, 0));
        }

        if (generationGalerieVisiteRef.current === generation) {
          setPhotosGalerieVisite((photosCourantes) => {
            cacheGaleriesVisiteRef.current.set(cleCache, {
              visite,
              photos: photosCourantes,
              total,
              scrollTop: 0,
              dateMs: Date.now(),
            });
            return photosCourantes;
          });
        }
      }
    } catch (error) {
      if (error?.name === "AbortError") return;
      console.error("Ouverture Galerie d’une visite impossible :", error);
      setPhotosGalerieVisite([]);
      setErreurGalerieVisite(error?.message || "Impossible de lire les photos de cette visite.");
    } finally {
      if (generationGalerieVisiteRef.current === generation) setChargementGalerieVisite(false);
    }
  }

  function fermerGalerieVisiteMaquette() {
    // v80 — venu de la recherche : on y revient, l'écran de recherche est resté monté.
    retourRechercheDepuisGalerieRef.current = false;
    memoriserGalerieVisiteCourante();
    annulerChargementsGalerieVisite();
    setModePhotoGalerieVisite(false);
    setModeGalerieVisite(false);
    setVisiteGalerieMaquette(null);
    setPhotosGalerieVisite([]);
    setNombreTotalPhotosGalerieVisite(0);
    setErreurGalerieVisite("");
    setConfirmationSuppressionPhotoVisite(false);
    setErreurSuppressionPhotoVisite("");
    setChargementGalerieVisite(false);
    setIndexPhotoGalerieVisite(0);
    setScrollTopGalerieVisite(0);
  }

  function ouvrirPhotoGalerieVisiteMaquette(index) {
    if (!photosGalerieVisite[index]) return;
    const position = galerieVisiteGrilleRef.current?.scrollTop ?? scrollTopGalerieVisite;
    scrollGrilleAvantPhotoRef.current = Number(position || 0);
    setScrollTopGalerieVisite(Number(position || 0));
    setIndexPhotoGalerieVisite(index);
    setModePhotoGalerieVisite(true);
  }

  function retourGrilleGalerieVisite() {
    const position = Number(scrollGrilleAvantPhotoRef.current || scrollTopGalerieVisite || 0);
    restaurationScrollGrilleRef.current = position;
    setModePhotoGalerieVisite(false);
    setScrollTopGalerieVisite(position);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (galerieVisiteGrilleRef.current) {
          galerieVisiteGrilleRef.current.scrollTop = position;
        }
        restaurationScrollGrilleRef.current = null;
      });
    });
  }

  function memeVisiteGalerie(a, b) {
    const cleA = cleCacheGalerieVisite(a);
    const cleB = cleCacheGalerieVisite(b);
    return Boolean(cleA && cleB && cleA === cleB);
  }

  function retirerUrlsPhotoSupprimeeDuCache(photo) {
    const identifiant = String(photo?.id || photo?.cheminRelatif || photo?.nom || "").trim();
    if (!identifiant) return;
    for (const suffixe of ["mini", "original"]) {
      const cle = `${identifiant}|${suffixe}`;
      const url = cacheUrlsImagesAndroidGalerieRef.current.get(cle);
      cacheUrlsImagesAndroidGalerieRef.current.delete(cle);
      try { if (String(url || "").startsWith("blob:")) URL.revokeObjectURL(url); } catch (_) {}
    }
  }

  function mettreAJourCompteursApresSuppression(visite, nouveauTotal) {
    const appliquer = (candidate) =>
      candidate && memeVisiteGalerie(candidate, visite)
        ? { ...candidate, nombrePhotos: nouveauTotal }
        : candidate;

    setVisiteGalerieMaquette((courante) => appliquer(courante));
    setVisiteResumeSelectionnee((courante) => appliquer(courante));
    setDerniereVisite((courante) => appliquer(courante));
    setVisitesPhysiques((courantes) => {
      const suivantes = courantes.map(appliquer);
      sauvegarderCacheVisitesPhysiques(suivantes);
      return suivantes;
    });
  }

  async function supprimerPhotoGalerieVisiteConfirmee() {
    const photo = photosGalerieVisite[indexPhotoGalerieVisite];
    const visite = visiteGalerieMaquette;
    if (!photo || !visite || suppressionPhotoVisiteEnCours) return;

    setSuppressionPhotoVisiteEnCours(true);
    setErreurSuppressionPhotoVisite("");
    try {
      if (photo.handleAndroid?.kind === "file") {
        const dossierVisite = await resoudreHandleVisiteAndroid(visite);
        const segments = String(photo.cheminRelatif || photo.nom || "").split("/").filter(Boolean);
        const nomFichier = segments.pop();
        if (!nomFichier) throw new Error("Nom de photo introuvable.");
        let dossierParent = dossierVisite;
        for (const segment of segments) {
          dossierParent = await dossierParent.getDirectoryHandle(segment, { create: false });
        }
        await dossierParent.removeEntry(nomFichier, { recursive: false });
        try {
          await dossierParent.getFileHandle(nomFichier, { create: false });
          throw new Error("La suppression physique de la photo n’a pas été confirmée.");
        } catch (verification) {
          if (verification?.name !== "NotFoundError") throw verification;
        }
      } else {
        const url = new URL(urlPhotoGalerieVisite(photo), window.location.origin);
        const chemin = url.searchParams.get("chemin");
        if (!chemin) throw new Error("Chemin physique de la photo introuvable.");
        const response = await fetch(`${API_BASE}/api/photo-visite?chemin=${encodeURIComponent(chemin)}`, {
          method: "DELETE",
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.success) {
          throw new Error(data.error || "Suppression physique de la photo impossible.");
        }
      }

      retirerUrlsPhotoSupprimeeDuCache(photo);
      const ancienTotal = nombreTotalPhotosGalerieVisite || photosGalerieVisite.length;
      const nouveauTotal = Math.max(0, ancienTotal - 1);
      const nouvellesPhotos = [...photosGalerieVisite];
      nouvellesPhotos.splice(indexPhotoGalerieVisite, 1);
      const nouvelIndex = nouveauTotal ? Math.min(indexPhotoGalerieVisite, nouveauTotal - 1) : 0;

      setPhotosGalerieVisite(nouvellesPhotos);
      setNombreTotalPhotosGalerieVisite(nouveauTotal);
      setIndexPhotoGalerieVisite(nouvelIndex);
      mettreAJourCompteursApresSuppression(visite, nouveauTotal);

      const cle = cleCacheGalerieVisite(visite);
      if (cle) {
        cacheGaleriesVisiteRef.current.set(cle, {
          visite: { ...visite, nombrePhotos: nouveauTotal },
          photos: nouvellesPhotos,
          total: nouveauTotal,
          scrollTop: scrollGrilleAvantPhotoRef.current || scrollTopGalerieVisite || 0,
          dateMs: Date.now(),
        });
      }

      setConfirmationSuppressionPhotoVisite(false);
      if (!nouveauTotal) {
        setModePhotoGalerieVisite(false);
        setErreurGalerieVisite("");
      }
    } catch (error) {
      console.error("Suppression photo de visite impossible :", error);
      setErreurSuppressionPhotoVisite(error?.message || "Suppression de la photo impossible.");
    } finally {
      setSuppressionPhotoVisiteEnCours(false);
    }
  }

  function estVisiteActuellementEnCours(visite) {
    if (!visite || !visiteActive) return false;
    const memeNom = String(visite.nom || "").trim() === String(visiteActive.nom || lieuVisite || "").trim();
    const memeVoyage = String(visite.voyage || "").trim() === String(voyage || "").trim();
    const villeCourante = String(visiteActive.ville || villeVisite || "").trim();
    const memeVille = String(visite.ville || "").trim() === villeCourante ||
      (String(visite.ville || "").trim() === "Ville non renseignée" && !villeCourante);
    return memeNom && memeVoyage && memeVille;
  }

  function retirerVisiteDesCaches(visite) {
    const cle = cleCacheGalerieVisite(visite);
    if (cle) cacheGaleriesVisiteRef.current.delete(cle);
    setVisitesPhysiques((courantes) => {
      const suivantes = courantes.filter((candidate) => !memeVisiteGalerie(candidate, visite));
      sauvegarderCacheVisitesPhysiques(suivantes);
      return suivantes;
    });
    setDerniereVisite((courante) => memeVisiteGalerie(courante, visite) ? null : courante);
  }

  async function supprimerVisiteConfirmee() {
    const visite = visiteASupprimer;
    if (!visite || suppressionVisiteEnCours) return;
    if (estVisiteActuellementEnCours(visite)) {
      setErreurSuppressionVisite("La visite actuellement en cours ne peut pas être supprimée.");
      return;
    }

    setSuppressionVisiteEnCours(true);
    setErreurSuppressionVisite("");
    try {
      if (estAndroid()) {
        const resultatRacine = await obtenirDossierRacinePhotoCartelAndroid({
          ouvrirSelecteurSiNecessaire: false,
          demanderPermissionSiNecessaire: false,
        });
        let parent = resultatRacine?.dossierPhotoCartel;
        if (!parent) throw new Error("Autorisation du dossier PhotoCartel nécessaire.");
        const segments = Array.isArray(visite?.segmentsAndroid) && visite.segmentsAndroid.length
          ? [...visite.segmentsAndroid]
          : [
              DOSSIER_METIER_VOYAGES,
              visite.voyage,
              visite.stockageVille || (visite.ville === "Ville non renseignée" ? "Visites rapides" : visite.ville),
              visite.nom,
            ].filter(Boolean);
        const nomDossierVisite = segments.pop();
        if (!nomDossierVisite) throw new Error("Nom du dossier de visite introuvable.");
        for (const segment of segments) {
          parent = await parent.getDirectoryHandle(segment, { create: false });
        }
        await parent.removeEntry(nomDossierVisite, { recursive: true });
        try {
          await parent.getDirectoryHandle(nomDossierVisite, { create: false });
          throw new Error("La suppression physique de la visite n’a pas été confirmée.");
        } catch (verification) {
          if (verification?.name !== "NotFoundError") throw verification;
        }
      } else {
        const response = await fetch(`${API_BASE}/api/visite?chemin=${encodeURIComponent(visite.chemin || "")}`, { method: "DELETE" });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.success) throw new Error(data.error || "Suppression physique de la visite impossible.");
      }

      retirerVisiteDesCaches(visite);
      setConfirmationSuppressionVisite(false);
      setVisiteASupprimer(null);
      setVisiteResumeSelectionnee(null);
      setListeDernieresVisitesOuverte(true);
      setTimeout(() => actualiserVisitesPhysiques({ autoriserSelection: false, silencieux: true }), 0);
    } catch (error) {
      console.error("Suppression visite impossible :", error);
      setErreurSuppressionVisite(error?.message || "Suppression de la visite impossible.");
    } finally {
      setSuppressionVisiteEnCours(false);
    }
  }

  function photoGalerieVisitePrecedente() {
    const total = nombreTotalPhotosGalerieVisite || photosGalerieVisite.length;
    if (!total) return;
    setIndexPhotoGalerieVisite((index) => (index - 1 + total) % total);
  }

  function photoGalerieVisiteSuivante() {
    const total = nombreTotalPhotosGalerieVisite || photosGalerieVisite.length;
    if (!total) return;
    setIndexPhotoGalerieVisite((index) => (index + 1) % total);
  }

  function debutTouchGalerieVisite(event) {
    const touch = event.touches?.[0];
    if (!touch) return;
    galerieVisiteTouchStartXRef.current = touch.clientX;
    galerieVisiteTouchStartYRef.current = touch.clientY;
  }

  function finTouchGalerieVisite(event) {
    const touch = event.changedTouches?.[0];
    const departX = galerieVisiteTouchStartXRef.current;
    const departY = galerieVisiteTouchStartYRef.current;
    galerieVisiteTouchStartXRef.current = null;
    galerieVisiteTouchStartYRef.current = null;
    if (!touch || departX === null || departY === null) return;
    const deltaX = touch.clientX - departX;
    const deltaY = touch.clientY - departY;
    if (Math.abs(deltaX) < 42 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
    if (deltaX < 0) photoGalerieVisiteSuivante();
    else photoGalerieVisitePrecedente();
  }

  function dateCourteGalerieVisite(visite) {
    const ms = Number(visite?.debutMs || visite?.finMs || 0);
    if (!ms) return "Date non renseignée";
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(ms));
  }

  function libelleNombrePhotosGalerieVisite() {
    if (chargementGalerieVisite) return "Chargement des photos…";
    const total = nombreTotalPhotosGalerieVisite || photosGalerieVisite.filter(Boolean).length;
    const chargees = photosGalerieVisite.filter(Boolean).length;
    if (chargees < total) return `${chargees} / ${total} photos indexées`;
    return `${total} photo${total > 1 ? "s" : ""}`;
  }

  function BarreGalerieVisite({ fichePhoto = false }) {
    const analyseDejaActive = etatTacheAnalyseIA === "en_cours" || etatTacheAnalyseIA === "terminee";

    const actions = fichePhoto
      ? [
          { icone: "🏠", texte: "Accueil", action: retourAccueil },
          { icone: "🖼️", texte: "Grille", action: retourGrilleGalerieVisite },
          {
            icone: "🤖",
            texte: "Analyser",
            action: lancerAnalyseDepuisGalerieVisite,
            // v50 : une seule analyse IA en arrière-plan à la fois (voir CR).
            disabled: analyseDejaActive,
          },
          { icone: "⭐", texte: "Favoris", action: () => {} },
          { icone: "📤", texte: "Partager", action: () => {} },
          { icone: "🗑️", texte: "Supprimer cette photo de la visite", action: () => { setErreurSuppressionPhotoVisite(""); setConfirmationSuppressionPhotoVisite(true); }, danger: true },
        ]
      : [
          { icone: "🏠", texte: "Accueil", action: retourAccueil },
          { icone: "📷", texte: "Analyser", action: () => {} },
          { icone: "🏛️", texte: "Nouvelle visite", action: () => {} },
          { icone: "🗺️", texte: "Bibliothèques", action: () => {} },
          { icone: "📤", texte: "Exporter", action: () => {} },
        ];

    return (
      <nav style={styles.galerieVisiteBarreBasse} aria-label="Actions Galerie d’une visite">
        {actions.map((action) => (
          <button
            key={action.texte}
            type="button"
            onClick={action.action}
            disabled={action.disabled}
            style={{
              ...styles.galerieVisiteAction,
              ...(action.danger ? styles.galerieVisiteActionDanger : {}),
              opacity: action.disabled ? 0.45 : 1,
              cursor: action.disabled ? "not-allowed" : "pointer",
            }}
          >
            <span style={styles.galerieVisiteActionIcone}>{action.icone}</span>
            <span style={styles.galerieVisiteActionTexte}>{action.texte}</span>
          </button>
        ))}
      </nav>
    );
  }

  function ImageGalerieVisite({ photo, miniature = false, alt = "", style }) {
    const sourceInitiale =
      photo?.handleAndroid?.kind === "file"
        ? (cacheUrlsImagesAndroidGalerieRef.current.get(
            `${String(photo?.id || photo?.cheminRelatif || photo?.nom || "").trim()}|${miniature ? "mini" : "original"}`
          ) || "")
        : (miniature ? urlMiniatureGalerieVisite(photo) : urlPhotoGalerieVisite(photo));
    const [source, setSource] = useState(sourceInitiale);

    useEffect(() => {
      let actif = true;

      if (photo?.handleAndroid?.kind === "file") {
        obtenirUrlImageAndroidGalerie(photo, miniature)
          .then((url) => {
            if (actif && url) setSource(url);
          })
          .catch((error) => {
            if (actif) console.warn("Chargement différé d'une photo impossible :", error);
          });
      } else {
        setSource(miniature ? urlMiniatureGalerieVisite(photo) : urlPhotoGalerieVisite(photo));
      }

      return () => { actif = false; };
    }, [photo?.id, miniature]);

    if (!source) {
      return (
        <span style={{ fontSize: "10px", color: "#8c8174", fontWeight: 700 }}>
          Préparation…
        </span>
      );
    }

    return (
      <img
        src={source}
        alt={alt}
        loading={miniature ? "lazy" : "eager"}
        decoding="async"
        style={style}
      />
    );
  }

  function urlMiniatureGalerieVisite(photo) {
    const url = String(photo?.miniatureUrl || photo?.urlMiniature || "").trim();
    if (url) return /^(https?:|blob:|data:)/i.test(url) ? url : `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
    return urlPhotoGalerieVisite(photo);
  }

  function EnteteGalerieVisite({ fichePhoto = false }) {
    const visite = visiteGalerieMaquette || {};
    const total = nombreTotalPhotosGalerieVisite || photosGalerieVisite.length;
    return (
      <header style={styles.galerieVisiteEntete}>
        <button
          type="button"
          onClick={() => fichePhoto ? retourGrilleGalerieVisite() : fermerGalerieVisiteMaquette()}
          style={styles.galerieVisiteRetour}
          aria-label={fichePhoto ? "Retour à la grille" : "Fermer la galerie"}
        >
          ‹
        </button>
        <div style={styles.galerieVisiteEnteteTexte}>
          <div style={styles.galerieVisiteVoyage}>{visite.voyage || "Voyage"}</div>
          <div style={styles.galerieVisiteNom}>
            {fichePhoto
              ? (photosGalerieVisite[indexPhotoGalerieVisite]?.nom || "Photo")
              : (visite.nom || "Visite sélectionnée")}
          </div>
          <div style={styles.galerieVisiteMeta}>
            {fichePhoto
              ? `${visite.nom || "Visite"} · ${Math.min(indexPhotoGalerieVisite + 1, total)} / ${total}`
              : `${dateCourteGalerieVisite(visite)} · ${libelleNombrePhotosGalerieVisite()}`}
          </div>
        </div>
        <img src={LOGO_PHOTOCARTEL_SRC} alt="" style={styles.galerieVisiteLogo} />
      </header>
    );
  }

  useEffect(() => {
    if (!modeGalerieVisite) return undefined;

    const html = document.documentElement;
    const body = document.body;
    const ancienOverflowHtml = html.style.overflow;
    const ancienOverflowXHtml = html.style.overflowX;
    const ancienOverflowBody = body.style.overflow;
    const ancienOverflowXBody = body.style.overflowX;
    const anciennePositionBody = body.style.position;
    const ancienneLargeurBody = body.style.width;
    const ancienTopBody = body.style.top;
    const positionFenetre = window.scrollY || window.pageYOffset || 0;

    html.style.overflow = "hidden";
    html.style.overflowX = "hidden";
    body.style.overflow = "hidden";
    body.style.overflowX = "hidden";
    body.style.position = "fixed";
    body.style.width = "100%";
    body.style.top = `-${positionFenetre}px`;

    return () => {
      html.style.overflow = ancienOverflowHtml;
      html.style.overflowX = ancienOverflowXHtml;
      body.style.overflow = ancienOverflowBody;
      body.style.overflowX = ancienOverflowXBody;
      body.style.position = anciennePositionBody;
      body.style.width = ancienneLargeurBody;
      body.style.top = ancienTopBody;
      window.scrollTo({ top: positionFenetre, left: 0, behavior: "auto" });
    };
  }, [modeGalerieVisite]);

  useEffect(() => {
    if (!modeGalerieVisite || modePhotoGalerieVisite) return undefined;
    const mesurer = () => {
      const element = galerieVisiteGrilleRef.current;
      if (!element) return;
      setHauteurGalerieVisite(element.clientHeight || 600);
      setLargeurGalerieVisite(element.clientWidth || 360);
    };
    mesurer();
    const observateur = typeof ResizeObserver !== "undefined" ? new ResizeObserver(mesurer) : null;
    if (observateur && galerieVisiteGrilleRef.current) observateur.observe(galerieVisiteGrilleRef.current);
    window.addEventListener("resize", mesurer);
    return () => {
      observateur?.disconnect();
      window.removeEventListener("resize", mesurer);
    };
  }, [modeGalerieVisite, modePhotoGalerieVisite, nombreTotalPhotosGalerieVisite]);

  useEffect(() => {
    if (!modeGalerieVisite || modePhotoGalerieVisite) return undefined;
    const position = restaurationScrollGrilleRef.current;
    if (position === null || position === undefined) return undefined;
    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        if (galerieVisiteGrilleRef.current) galerieVisiteGrilleRef.current.scrollTop = Number(position || 0);
        restaurationScrollGrilleRef.current = null;
      });
    });
    return () => { cancelAnimationFrame(raf1); cancelAnimationFrame(raf2); };
  }, [modeGalerieVisite, modePhotoGalerieVisite, largeurGalerieVisite, hauteurGalerieVisite]);

  function EcranGalerieVisiteMaquette() {
    if (!modeGalerieVisite) return null;

    const photoActive = photosGalerieVisite[indexPhotoGalerieVisite];

    if (modePhotoGalerieVisite && photoActive) {
      return (
        <section style={styles.galerieVisiteEcran} aria-label="Fiche photo de la Galerie d’une visite">
          <EnteteGalerieVisite fichePhoto />
          <div
            style={styles.galerieVisitePhotoZone}
            onTouchStart={debutTouchGalerieVisite}
            onTouchEnd={finTouchGalerieVisite}
          >
            <button type="button" onClick={photoGalerieVisitePrecedente} style={{...styles.galerieVisiteFleche, left: "7px"}} aria-label="Photo précédente">‹</button>
            <ImageGalerieVisite
              photo={photoActive}
              alt={photoActive.nom || `Photo ${indexPhotoGalerieVisite + 1} de la visite`}
              style={styles.galerieVisitePhotoPleinEcran}
            />
            <span style={styles.galerieVisiteCompteurPhoto}>{indexPhotoGalerieVisite + 1} / {nombreTotalPhotosGalerieVisite || photosGalerieVisite.length}</span>
            <button type="button" onClick={photoGalerieVisiteSuivante} style={{...styles.galerieVisiteFleche, right: "7px"}} aria-label="Photo suivante">›</button>
          </div>
          <BarreGalerieVisite fichePhoto />
        </section>
      );
    }

    return (
      <section style={styles.galerieVisiteEcran} aria-label="Page d’entrée de la Galerie d’une visite">
        <EnteteGalerieVisite />
        {chargementGalerieVisite && (
          <div style={{ padding: "34px 18px", textAlign: "center", fontWeight: 700 }}>
            Chargement des photos de la visite…
          </div>
        )}
        {!chargementGalerieVisite && erreurGalerieVisite && (
          <div style={{ padding: "28px 18px", textAlign: "center" }}>
            <div style={{ fontWeight: 800, marginBottom: "8px" }}>Galerie indisponible</div>
            <div>{erreurGalerieVisite}</div>
          </div>
        )}
        {!chargementGalerieVisite && !erreurGalerieVisite && photosGalerieVisite.length === 0 && (
          <div style={{ padding: "34px 18px", textAlign: "center", fontWeight: 700 }}>
            Aucune photo trouvée dans cette visite.
          </div>
        )}
        {!erreurGalerieVisite && nombreTotalPhotosGalerieVisite > 0 && (() => {
          const colonnesGalerie = calculerColonnesGalerieVisite(
            largeurGalerieVisite,
            nombreTotalPhotosGalerieVisite
          );
          const largeurCellule = Math.max(80, largeurGalerieVisite / colonnesGalerie);
          const hauteurLigne = largeurCellule;
          const nombreLignes = Math.ceil(nombreTotalPhotosGalerieVisite / colonnesGalerie);
          const hauteurContenu = nombreLignes * hauteurLigne;
          const scrollMaximum = Math.max(0, hauteurContenu - hauteurGalerieVisite);
          const scrollEffectif = Math.min(scrollTopGalerieVisite, scrollMaximum);
          const ligneDebut = Math.max(0, Math.floor(scrollEffectif / hauteurLigne) - SURBALAYAGE_LIGNES_GALERIE);
          const ligneFin = Math.min(
            nombreLignes,
            Math.ceil((scrollEffectif + hauteurGalerieVisite) / hauteurLigne) + SURBALAYAGE_LIGNES_GALERIE
          );
          const indexDebut = ligneDebut * colonnesGalerie;
          const indexFin = Math.min(nombreTotalPhotosGalerieVisite, ligneFin * colonnesGalerie);
          const cellules = [];
          for (let index = indexDebut; index < indexFin; index += 1) {
            const photo = photosGalerieVisite[index];
            const colonne = index % colonnesGalerie;
            const ligne = Math.floor(index / colonnesGalerie);
            cellules.push(
              <button
                key={photo?.id || `attente-${index}`}
                type="button"
                disabled={!photo}
                onClick={() => ouvrirPhotoGalerieVisiteMaquette(index)}
                style={{
                  ...styles.galerieVisiteVignette,
                  left: `${colonne * largeurCellule}px`,
                  top: `${ligne * hauteurLigne}px`,
                  width: `${largeurCellule}px`,
                  height: `${hauteurLigne}px`,
                  opacity: photo ? 1 : 0.72,
                }}
                aria-label={photo ? `Ouvrir la photo ${index + 1}` : `Photo ${index + 1} en préparation`}
              >
                {photo ? (
                  <ImageGalerieVisite photo={photo} miniature alt="" style={styles.galerieVisiteVignetteImage} />
                ) : (
                  <span style={{ fontSize: "10px", color: "#8c8174", fontWeight: 700 }}>Préparation…</span>
                )}
                <span style={styles.galerieVisiteNumeroVignette}>{index + 1}</span>
              </button>
            );
          }
          return (
            <div
              ref={galerieVisiteGrilleRef}
              style={styles.galerieVisiteGrille}
              onScroll={(event) => {
                const prochainScrollTop = event.currentTarget.scrollTop;
                setScrollTopGalerieVisite(prochainScrollTop);
              }}
            >
              <div style={{ position: "relative", width: "100%", maxWidth: "100%", minWidth: 0, height: `${hauteurContenu}px`, overflow: "hidden" }}>
                {cellules}
              </div>
            </div>
          );
        })()}
        <BarreGalerieVisite />
      </section>
    );
  }

  const ecranDernieresVisitesActif = listeDernieresVisitesOuverte || Boolean(visiteResumeSelectionnee);
  // v77 — l'accueil n'est figé que si rien de listerEtatsHorsAccueil n'est actif.
  const pageAccueilPrincipaleAffichee = listerEtatsHorsAccueil().every((etat) => !etat.actif);

  // v50.3 — retour de recette : le bandeau global recouvrait le haut du contenu (carte « Voyage
  // en cours » sur l'accueil) car aucun écran ne réservait la place qu'il occupe. On calcule ici
  // une fois si le bandeau est affiché, pour ajouter le décalage nécessaire aux conteneurs racines.
  const bandeauAnalyseIAActif = etatTacheAnalyseIA === "en_cours" || etatTacheAnalyseIA === "terminee";

  return (
    <div
      style={{
        ...styles.page,
        ...(pageAccueilPrincipaleAffichee ? styles.pageAccueilFigee : {}),
        ...(bandeauAnalyseIAActif ? { paddingTop: "calc(72px + 38px + env(safe-area-inset-top))" } : {}),
        ...((listeDernieresVisitesOuverte || visiteResumeSelectionnee)
          ? {
              height: "auto",
              minHeight: "100dvh",
              maxHeight: "none",
              overflowY: "auto",
              overscrollBehaviorY: "auto",
              paddingBottom: listeDernieresVisitesOuverte
                ? "calc(190px + env(safe-area-inset-bottom))"
                : "calc(130px + env(safe-area-inset-bottom))",
            }
          : {}),
      }}
    >
      <style>{`
        @keyframes photocartelBadgeAnalyseModifiee {
          from { opacity: 0; transform: translateY(3px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* v50.2 — retour de recette : petite animation de points pour le bandeau
           « Analyse IA en cours », afin de montrer un vrai travail en arrière-plan
           (aucune animation pour l'état « terminée », comme demandé). */
        @keyframes photocartelBandeauPoint {
          0%, 80%, 100% { opacity: 0.15; }
          40% { opacity: 1; }
        }
        .photocartel-bandeau-points {
          display: inline-flex;
          margin-left: 2px;
        }
        .photocartel-bandeau-points span {
          animation: photocartelBandeauPoint 1.3s infinite ease-in-out;
        }
        .photocartel-bandeau-points span:nth-child(2) { animation-delay: 0.2s; }
        .photocartel-bandeau-points span:nth-child(3) { animation-delay: 0.4s; }

        /* v45.5 — compactage permanent et maîtrisé du seul bloc supérieur.
           Le gain de hauteur provient du gisement réel d’espace, sans réduire
           les cartes d’action et sans dépendre du modèle de téléphone. */
        @media (max-width: 390px) {
          .photocartel-accueil-bloc {
            grid-template-columns: 74% 26% !important;
            height: 224px !important;
            min-height: 224px !important;
          }
          .photocartel-accueil-informations {
            padding: 54px 6px 5px 11px !important;
            grid-template-rows: repeat(3, minmax(0, 1fr)) 29px !important;
          }
          .photocartel-accueil-voyage-titre {
            top: 7px !important;
            left: 11px !important;
            right: 49px !important;
            min-height: 41px !important;
            padding-bottom: 3px !important;
          }
          .photocartel-gestion-voyage {
            top: 10px !important;
            right: 3px !important;
            width: 42px !important;
            min-height: 40px !important;
          }
          .photocartel-ligne-etat {
            grid-template-columns: 28px minmax(0, 1fr) !important;
            gap: 5px !important;
            padding-top: 1px !important;
            padding-bottom: 1px !important;
          }
          .photocartel-accueil-photo {
            height: calc(100% - 54px) !important;
            margin-top: 54px !important;
            object-position: 48% center !important;
          }
          .photocartel-liste-dernieres-visites {
            scroll-margin-bottom: 92px;
          }
        }
      `}</style>
      <BandeauAnalyseIAArrierePlan />
      {!modeGalerieVisite && <BarreSuperieurePhotoCartel />}
      {!modeGalerieVisite && <BarreFixe />}
      {EcranGalerieVisiteMaquette()}
      {/* v50 — correctif recette : la visibilité de l'écran ne dépend plus que de modeAnalysePhoto.
          analysePhotoSessionActiveRef ne signifie plus « écran ouvert » mais « tâche existante » ;
          le garder ici empêchait « Accueil » et « Analyser une photo » de jamais fermer l'écran
          pendant qu'une analyse était en cours ou terminée non enregistrée. */}
      {modeAnalysePhoto && !modeGalerieAnalyses && (
        <BarreActionsFicheResultat />
      )}
      {modeGalerieAnalyses && <BarreActionsGalerie />}
      {confirmationSuppressionPhotoVisite && (
        <div
          style={{ ...styles.modalFond, zIndex: 13050 }}
          role="presentation"
          onClick={() => !suppressionPhotoVisiteEnCours && setConfirmationSuppressionPhotoVisite(false)}
        >
          <div
            style={styles.modalCarte}
            role="dialog"
            aria-modal="true"
            aria-labelledby="titre-suppression-photo-visite"
            onClick={(event) => event.stopPropagation()}
          >
            <div style={{ fontSize: "34px", marginBottom: "6px" }}>🗑️</div>
            <h2 id="titre-suppression-photo-visite" style={styles.modalTitre}>
              Supprimer cette photo de la visite ?
            </h2>
            <p style={styles.modalTexte}>
              La photo sera supprimée définitivement du dossier de cette visite.
              <br />
              Cette action est irréversible.
            </p>
            {erreurSuppressionPhotoVisite && (
              <p style={{ ...styles.modalTexte, color: "#a12622", fontWeight: 800 }}>
                {erreurSuppressionPhotoVisite}
              </p>
            )}
            <button
              type="button"
              onClick={supprimerPhotoGalerieVisiteConfirmee}
              style={styles.modalBoutonSuppression}
              disabled={suppressionPhotoVisiteEnCours}
            >
              {suppressionPhotoVisiteEnCours ? "Suppression…" : "Supprimer cette photo de la visite"}
            </button>
            <button
              type="button"
              onClick={() => setConfirmationSuppressionPhotoVisite(false)}
              style={styles.modalBoutonAnnuler}
              disabled={suppressionPhotoVisiteEnCours}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {confirmationSuppressionVisite && visiteASupprimer && (
        <div
          style={{ ...styles.modalFond, zIndex: 13060 }}
          role="presentation"
          onClick={() => !suppressionVisiteEnCours && setConfirmationSuppressionVisite(false)}
        >
          <div
            style={styles.modalCarte}
            role="dialog"
            aria-modal="true"
            aria-labelledby="titre-suppression-visite"
            onClick={(event) => event.stopPropagation()}
          >
            <div style={{ fontSize: "34px", marginBottom: "6px" }}>🗑️</div>
            <h2 id="titre-suppression-visite" style={styles.modalTitre}>
              Supprimer la visite « {visiteASupprimer.nom} » ?
            </h2>
            <p style={styles.modalTexte}>
              La visite, ses dossiers et toutes ses photos seront supprimés définitivement.
              <br />
              Cette action est irréversible.
            </p>
            {erreurSuppressionVisite && (
              <p style={{ ...styles.modalTexte, color: "#a12622", fontWeight: 800 }}>{erreurSuppressionVisite}</p>
            )}
            <button
              type="button"
              onClick={supprimerVisiteConfirmee}
              style={styles.modalBoutonSuppression}
              disabled={suppressionVisiteEnCours}
            >
              {suppressionVisiteEnCours ? "Suppression…" : "Supprimer la visite"}
            </button>
            <button
              type="button"
              onClick={() => setConfirmationSuppressionVisite(false)}
              style={styles.modalBoutonAnnuler}
              disabled={suppressionVisiteEnCours}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {confirmationSuppressionGalerie && (
        <div
          style={{ ...styles.modalFond, zIndex: 10020 }}
          role="presentation"
          onClick={annulerConfirmationSuppressionGalerie}
        >
          <div
            style={styles.modalCarte}
            role="dialog"
            aria-modal="true"
            aria-labelledby="titre-suppression-galerie"
            onClick={(event) => event.stopPropagation()}
          >
            <div style={{ fontSize: "34px", marginBottom: "6px" }}>🗑️</div>
            <h2 id="titre-suppression-galerie" style={styles.modalTitre}>
              Supprimer cette photo analysée ?
            </h2>
            <p style={styles.modalTexte}>
              Cette opération supprimera définitivement cette photo analysée.
              <br />
              Cette action est irréversible.
            </p>
            <button
              type="button"
              onClick={supprimerFicheGalerie}
              style={styles.modalBoutonSuppression}
              disabled={galerieChargement}
            >
              Supprimer
            </button>
            <button
              type="button"
              onClick={annulerConfirmationSuppressionGalerie}
              style={styles.modalBoutonAnnuler}
              disabled={galerieChargement}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

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

      {modeAutorisationStockageAnalyse && (
        <div style={styles.modalFond}>
          <div style={styles.modalCarte}>
            <div style={{ fontSize: "34px", marginBottom: "6px" }}>📁</div>
            <h2 style={styles.modalTitre}>Accès au stockage nécessaire</h2>
            <p style={styles.modalTexte}>
              PhotoCartel doit accéder au dossier racine DCIM / PhotoCartel pour enregistrer les photos à analyser et leurs résultats.
              S’il est déjà mémorisé, un seul clic suffit pour réactiver l’accès. Sinon, sélectionne PhotoCartel lui-même — jamais Voyages ni un autre sous-dossier.
            </p>
            <button
              type="button"
              onClick={autoriserStockagePourAnalyseDepuisClic}
              style={styles.modalBoutonPrincipal}
              disabled={autorisationStockageAnalyseEnCours}
            >
              {autorisationStockageAnalyseEnCours ? "Autorisation en cours…" : "📁 Autoriser PhotoCartel"}
            </button>
            <button
              type="button"
              onClick={annulerAutorisationStockageAnalyse}
              style={styles.modalBoutonAnnuler}
              disabled={autorisationStockageAnalyseEnCours}
            >
              Annuler
            </button>
            {messageAnalysePhoto && (
              <p style={{ ...styles.modalTexte, marginTop: "12px" }}>{messageAnalysePhoto}</p>
            )}
          </div>
        </div>
      )}

      {modeChoixActionAnalysePhoto && (
        <div style={styles.modalFond}>
          <div style={styles.modalCarte}>
            <h2 style={styles.modalTitre}>Sélectionner une action</h2>
            <p style={styles.modalTexte}>
              Choisis comment PhotoCartel doit récupérer la photo à analyser.
            </p>

            <button
              type="button"
              onClick={choisirPrendrePhotoPourAnalyse}
              style={styles.modalBoutonPrincipal}
            >
              📷 Prendre une photo
            </button>

            <button
              type="button"
              onClick={choisirFichierPourAnalyse}
              style={styles.modalBoutonSecondaire}
            >
              🖼️ Choisir un fichier / galerie
            </button>

            <button
              type="button"
              onClick={annulerChoixActionAnalysePhoto}
              style={styles.modalBoutonAnnuler}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* v50 — idem : seule modeAnalysePhoto gouverne l'affichage de l'écran. */}
      {modeAnalysePhoto && (
        <div
          style={{
            ...styles.analyseEcran,
            paddingBottom: "154px",
            // v50.3 — retour de recette : le bandeau est désormais aussi visible sur cet écran ;
            // on réserve sa hauteur pour ne pas recouvrir le titre.
            ...(bandeauAnalyseIAActif ? { paddingTop: "calc(58px + 38px + env(safe-area-inset-top))" } : {}),
          }}
        >
          <main style={{ ...styles.analyseTelephone, paddingBottom: "148px" }}>
            <h1 style={styles.titreFicheResultat}>Analyse d'une photo</h1>
            <BandeauModeDemonstration />

            {analysePhotoUrl && (
              <img
                src={analysePhotoUrl}
                alt="Photo analysée"
                style={styles.analyseMiniature}
                onClick={() => setPhotoPleinEcranUrl(analysePhotoUrl)}
              />
            )}

            {dateHeurePhotoAnalyse && (
              <div style={styles.dateHeurePhotoCarte}>
                <div style={styles.dateHeurePhotoLigne}>
                  <div style={styles.dateHeurePhotoLabel}>📷 Prise de vue :</div>
                  <div style={styles.dateHeurePhotoValeur}>{dateHeurePhotoAnalyse}</div>
                </div>
                <div style={styles.dateHeurePhotoLigne}>
                  <div style={styles.dateHeurePhotoLabel}>🤖 Analyse IA :</div>
                  <div style={styles.dateHeurePhotoValeur}>
                    {dateHeureAnalyseIA ||
                      (analysePhotoEnCours
                        ? "En cours…"
                        : etatTacheAnalyseIA === "echouee"
                          ? "Échec"
                          : "Non lancée")}
                  </div>
                </div>
              </div>
            )}

            {!analysePhotoResultat && analysePhotoEnCours && (
              <div style={styles.analyseCarte}>
                <h2 style={styles.analyseType}>Analyse IA en cours</h2>
                <p style={{ margin: "0 0 14px", lineHeight: 1.45 }}>
                  PhotoCartel analyse la photo et prépare sa fiche documentaire…
                </p>
                <button
                  type="button"
                  onClick={interrompreAnalysePhotoIA}
                  style={styles.boutonInterrompreAnalyse}
                >
                  ⏹️ Interrompre l'analyse
                </button>
                <button
                  type="button"
                  onClick={reprendreLaVisitePendantAnalyse}
                  style={{ ...styles.boutonAnalyseSecondaire, marginTop: "10px" }}
                >
                  📷 Reprendre la visite
                </button>
                <p style={{ margin: "8px 0 0", fontSize: "13px", opacity: 0.75, lineHeight: 1.4 }}>
                  L'analyse continue en arrière-plan. Un bandeau indique son avancement, puis sa fin.
                </p>
              </div>
            )}

            {!analysePhotoResultat && !analysePhotoEnCours && (
              <div style={styles.analyseCarte}>
                <h2 style={styles.analyseType}>Photo prête à être analysée</h2>
                <p style={{ margin: "0 0 12px", lineHeight: 1.45 }}>
                  Lance l’analyse IA pour identifier la photo et créer sa fiche documentaire. L’opération peut prendre un peu de temps.
                </p>
                <button type="button" onClick={lancerAnalysePhotoIA} style={styles.boutonLancerAnalysePrincipal} disabled={!analysePhotoFile || (estAndroid() && !analysePhotoNomAAnalyser)}>
                  🤖 Lancer l'analyse IA
                </button>
                {messageAnalysePhoto && <p>{messageAnalysePhoto}</p>}
              </div>
            )}

            {!analysePhotoEnCours && analysePhotoResultat && (
              <div style={styles.analyseCarte}>
                {afficherFicheAnalyse(analysePhotoResultat)}
                {afficherBoutonAnalyseComplete()}
                {messageAnalysePhoto && <p>{messageAnalysePhoto}</p>}
              </div>
            )}

          </main>
        </div>
      )}


      {modeRechercheResultats && !modeGalerieVisite && (() => {
        // v80 — écran de recherche à la forme d'EuroCartel : bandeau de rappel des
        // critères, puis tableau, puis grille de miniatures, puis plein écran. Les
        // images passent par le mécanisme de la galerie d'une visite (ImageGalerieVisite),
        // jamais par un chemin propre à la recherche.
        const t = themePhotoCartel;
        const moteur = moteurRechercheRef.current;
        const resultat = resultatRechercheCourant();
        const filtresActifs =
          rechercheFiltres.pays.length +
            rechercheFiltres.villes.length +
            rechercheFiltres.annees.length +
            (rechercheFiltres.analyseesSeulement ? 1 : 0) >
          0;
        const critereSaisi = resultat.mots.length > 0 || filtresActifs;
        const styleChamp = {
          width: "100%",
          boxSizing: "border-box",
          padding: "14px 16px",
          fontSize: "17px",
          borderRadius: t.rayonBouton,
          border: `1.5px solid ${t.or}`,
          background: t.ivoireClair,
          color: t.encre,
          fontFamily: t.font,
          outline: "none",
        };
        const stylePastille = (active) => ({
          flex: "0 0 auto",
          padding: "7px 12px",
          borderRadius: "999px",
          border: `1px solid ${active ? t.or : t.bordureOr}`,
          background: active ? t.or : t.ivoireClair,
          color: active ? "#fff" : t.texte,
          fontSize: "13px",
          fontWeight: 600,
          fontFamily: t.font,
          cursor: "pointer",
          whiteSpace: "nowrap",
        });
        const styleRangee = {
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          padding: "2px 0 8px",
          WebkitOverflowScrolling: "touch",
        };
        const styleLibelle = {
          fontSize: "11px",
          fontWeight: 800,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: t.orFonce,
          margin: "6px 0 4px",
        };
        const styleBoutonSecondaire = {
          padding: "10px 14px",
          borderRadius: t.rayonBouton,
          border: `1px solid ${t.bordureOr}`,
          background: t.ivoireClair,
          color: t.orFonce,
          fontWeight: 700,
          fontFamily: t.font,
          cursor: "pointer",
        };
        const styleOnglet = (actif) => ({
          flex: 1,
          padding: "10px 12px",
          borderRadius: t.rayonBouton,
          border: `1px solid ${actif ? t.or : t.bordureOr}`,
          background: actif ? t.or : t.ivoireClair,
          color: actif ? "#fff" : t.orFonce,
          fontWeight: 700,
          fontSize: "15px",
          fontFamily: t.font,
          cursor: "pointer",
        });
        const rangeePastilles = (libelle, famille, liste) =>
          liste.length > 0 ? (
            <>
              <div style={styleLibelle}>{libelle}</div>
              <div style={styleRangee}>
                {liste.slice(0, 16).map((pastille) => (
                  <button
                    key={pastille.valeur}
                    type="button"
                    style={stylePastille(rechercheFiltres[famille].includes(pastille.valeur))}
                    onClick={() => basculerPastilleRecherche(famille, pastille.valeur)}
                  >
                    {pastille.valeur}
                  </button>
                ))}
              </div>
            </>
          ) : null;

        const lignesAffichees = resultat.lignes.slice(0, rechercheNombreLignes);
        const totalPhotos = resultat.lignes.reduce((somme, ligne) => somme + ligne.photos.length, 0);

        return (
          <div style={{ ...styles.analyseEcran, paddingBottom: "154px" }}>
            <main style={{ ...styles.analyseTelephone, paddingBottom: "148px", fontFamily: t.font }}>
              <h1 style={{ ...styles.titreFicheResultat, marginTop: 0 }}>Rechercher</h1>
              <input
                type="search"
                autoFocus
                value={rechercheSaisie}
                placeholder="Artiste, lieu, ville, année…"
                onChange={(event) => {
                  setRechercheSaisie(event.target.value);
                  setRechercheNombreLignes(40);
                  setRechercheNombreGrille(60);
                }}
                style={styleChamp}
                aria-label="Rechercher dans mes photos"
              />

              {moteur && (
                <div style={{ marginTop: "10px" }}>
                  {rangeePastilles("Pays", "pays", moteur.pastilles.pays)}
                  {rangeePastilles("Villes", "villes", moteur.pastilles.villes)}
                  {rangeePastilles("Années", "annees", moteur.pastilles.annees)}
                  <div style={styleRangee}>
                    <button
                      type="button"
                      style={stylePastille(rechercheFiltres.analyseesSeulement)}
                      onClick={() => {
                        setRechercheFiltres((filtres) => ({ ...filtres, analyseesSeulement: !filtres.analyseesSeulement }));
                        setRechercheNombreLignes(40);
                        setRechercheNombreGrille(60);
                      }}
                    >
                      Photos analysées
                    </button>
                    {filtresActifs && (
                      <button
                        type="button"
                        style={{ ...stylePastille(false), color: t.orFonce }}
                        onClick={() => {
                          setRechercheFiltres({ pays: [], villes: [], annees: [], analyseesSeulement: false });
                          setRechercheNombreLignes(40);
                          setRechercheNombreGrille(60);
                        }}
                      >
                        Tout effacer
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Bandeau de rappel des critères et du résultat, comme EuroCartel. */}
              {moteur && critereSaisi && (
                <section
                  aria-label="Critères de recherche"
                  style={{
                    background: t.ivoireCarte,
                    border: `1px solid ${t.bordureOr}`,
                    borderRadius: t.rayonCarte,
                    boxShadow: t.ombreLegere,
                    padding: "12px 14px",
                    margin: "6px 0 12px",
                  }}
                >
                  <div style={styleLibelle}>Critères de recherche</div>
                  <div style={{ fontSize: "14px", color: t.texte, overflowWrap: "anywhere" }}>
                    {texteCriteresRecherche(resultat.mots)}
                  </div>
                  <div style={{ fontSize: "19px", fontWeight: 800, color: t.encre, marginTop: "8px" }}>
                    {texteCompteursRecherche(resultat.compteurs)}
                  </div>
                  <div style={{ fontSize: "13px", color: t.texteDoux }}>
                    {totalPhotos} photo{totalPhotos > 1 ? "s" : ""} au total
                  </div>
                </section>
              )}

              {!moteur && (
                <div style={{ color: t.texteDoux, fontSize: "14px", margin: "8px 0 12px" }}>
                  {rechercheEtat === "indisponible"
                    ? "Tes photos ne sont pas accessibles pour le moment."
                    : "Préparation de tes photos…"}
                </div>
              )}
              {moteur && !critereSaisi && (
                <div style={{ color: t.texteDoux, fontSize: "14px", margin: "8px 0 12px" }}>
                  {moteur.nombrePhotos} photo{moteur.nombrePhotos > 1 ? "s" : ""}. Tape un mot ou touche une pastille.
                </div>
              )}
              {rechercheMessage && (
                <div style={{ color: "#9b2c2c", fontSize: "14px", marginBottom: "10px" }}>{rechercheMessage}</div>
              )}

              {/* Bascule Tableau / Grille. */}
              {critereSaisi && resultat.lignes.length > 0 && (
                <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                  <button type="button" style={styleOnglet(rechercheVue === "tableau")} onClick={() => setRechercheVue("tableau")}>
                    Tableau
                  </button>
                  <button type="button" style={styleOnglet(rechercheVue === "grille")} onClick={() => setRechercheVue("grille")}>
                    Grille
                  </button>
                </div>
              )}

              {/* Tableau des résultats. */}
              {critereSaisi && rechercheVue === "tableau" && (
                <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", color: t.texte }}>
                    <thead>
                      <tr>
                        {["Photo", "Dossier", "Année", "Trouvé par"].map((colonne) => (
                          <th
                            key={colonne}
                            scope="col"
                            style={{
                              textAlign: "left",
                              padding: "8px 10px",
                              background: t.ivoireCarte,
                              color: t.orFonce,
                              fontWeight: 800,
                              fontSize: "12px",
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                              borderBottom: `1px solid ${t.bordureOr}`,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {colonne}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {lignesAffichees.map((ligne) => {
                        const premiere = moteur ? moteur.photos[ligne.photos[0]] : null;
                        const complement =
                          ligne.type === "sujet"
                            ? ` · ${ligne.photos.length} prises`
                            : ligne.type === "dossier"
                              ? ` · ${ligne.photos.length} photo${ligne.photos.length > 1 ? "s" : ""}`
                              : "";
                        return (
                          <tr
                            key={ligne.cle}
                            onClick={() => ouvrirPhotosRechercheDansGalerie(ligne.photos, ligne.titre, 0)}
                            style={{ cursor: "pointer", borderBottom: `1px solid ${t.bordureOr}` }}
                          >
                            <td style={{ padding: "10px", overflowWrap: "anywhere" }}>
                              <span style={{ fontWeight: 700, color: t.encre }}>
                                {ligne.type === "dossier" ? "📁 " : ""}
                                {ligne.titre}
                              </span>
                              {complement}
                              {premiere && premiere.auteur ? (
                                <span style={{ display: "block", color: t.texteDoux }}>{premiere.auteur}</span>
                              ) : null}
                            </td>
                            <td style={{ padding: "10px", color: t.texteDoux, overflowWrap: "anywhere" }}>
                              {ligne.type === "dossier"
                                ? contexteDossierRecherche(moteur.dossiers[ligne.dossier].parent)
                                : contexteDossierRecherche(ligne.dossier)}
                            </td>
                            <td style={{ padding: "10px", whiteSpace: "nowrap" }}>{premiere ? premiere.annee : ""}</td>
                            <td style={{ padding: "10px", color: t.orFonce, whiteSpace: "nowrap" }}>
                              {ligne.origine}
                              {ligne.type === "dossier" && (
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    const chemin = moteur.dossiers[ligne.dossier].chemin;
                                    setRechercheDossierMots(rechercheDossierMots === chemin ? "" : chemin);
                                    setRechercheSaisieMot("");
                                    setRechercheMessageMot("");
                                  }}
                                  style={{ ...stylePastille(false), marginLeft: "8px", padding: "4px 10px", fontSize: "12px" }}
                                >
                                  Mots
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Mots ajoutés à un dossier (lecture C), depuis sa ligne du tableau. */}
                  {rechercheDossierMots && (
                    <section
                      aria-label="Mots ajoutés à ce dossier"
                      style={{
                        background: t.ivoireCarte,
                        border: `1px solid ${t.bordureOr}`,
                        borderRadius: t.rayonCarte,
                        padding: "12px 14px",
                        marginTop: "12px",
                      }}
                    >
                      <div style={styleLibelle}>Mots ajoutés à {rechercheDossierMots.split("/").pop()}</div>
                      <div style={{ ...styleRangee, flexWrap: "wrap" }}>
                        {(motsAjoutesRechercheRef.current[rechercheDossierMots] || []).length === 0 && (
                          <span style={{ color: t.texteDoux, fontSize: "13px" }}>
                            Un artiste, un lieu, un thème : toutes les photos du dossier le reçoivent.
                          </span>
                        )}
                        {(motsAjoutesRechercheRef.current[rechercheDossierMots] || []).map((mot) => (
                          <button
                            key={mot}
                            type="button"
                            style={stylePastille(true)}
                            onClick={() => retirerMotRecherche(rechercheDossierMots, mot)}
                            aria-label={`Retirer ${mot}`}
                          >
                            {mot} ✕
                          </button>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <input
                          type="text"
                          value={rechercheSaisieMot}
                          placeholder="Ajouter un mot"
                          onChange={(event) => setRechercheSaisieMot(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") ajouterMotRecherche(rechercheDossierMots, rechercheSaisieMot);
                          }}
                          style={{ ...styleChamp, padding: "10px 12px", fontSize: "15px" }}
                        />
                        <button
                          type="button"
                          style={styleBoutonSecondaire}
                          onClick={() => ajouterMotRecherche(rechercheDossierMots, rechercheSaisieMot)}
                        >
                          Ajouter
                        </button>
                      </div>
                      {rechercheMessageMot && (
                        <div style={{ color: "#9b2c2c", fontSize: "14px", marginTop: "8px" }}>{rechercheMessageMot}</div>
                      )}
                    </section>
                  )}

                  {resultat.lignes.length > lignesAffichees.length && (
                    <button
                      type="button"
                      style={{ ...styleBoutonSecondaire, width: "100%", marginTop: "12px" }}
                      onClick={() => setRechercheNombreLignes((valeur) => valeur + 40)}
                    >
                      Voir les résultats suivants
                    </button>
                  )}
                </div>
              )}

              {/* Grille de miniatures : images servies par le mécanisme de la galerie. */}
              {critereSaisi && rechercheVue === "grille" && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px" }}>
                    {photosGrilleRecherche.map((photo, position) => (
                      <button
                        key={photo.id}
                        type="button"
                        title={photo.nom}
                        onClick={() =>
                          afficherPhotosRechercheDansGalerie(
                            photosGrilleRecherche,
                            texteCriteresRecherche(resultat.mots) || "Résultats de recherche",
                            position
                          )
                        }
                        style={{
                          padding: 0,
                          border: "none",
                          background: "#efe6d6",
                          borderRadius: "10px",
                          overflow: "hidden",
                          cursor: "pointer",
                          aspectRatio: "1 / 1",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ImageGalerieVisite
                          photo={photo}
                          miniature
                          alt={photo.nom}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                      </button>
                    ))}
                  </div>
                  {totalPhotos > photosGrilleRecherche.length && (
                    <button
                      type="button"
                      style={{ ...styleBoutonSecondaire, width: "100%", marginTop: "12px" }}
                      onClick={() => setRechercheNombreGrille((valeur) => valeur + 60)}
                    >
                      Voir les photos suivantes
                    </button>
                  )}
                </>
              )}
            </main>
          </div>
        );
      })()}

      {modeGalerieAnalyses && (
        <div
          style={{
            ...styles.analyseEcran,
            paddingBottom: "154px",
            ...(bandeauAnalyseIAActif ? { paddingTop: "calc(58px + 38px + env(safe-area-inset-top))" } : {}),
          }}
        >
          <main style={{ ...styles.analyseTelephone, paddingBottom: "148px" }}>
            <h1 style={styles.titreFicheResultat}>Galerie des photos analysées</h1>
            <BandeauModeDemonstration />

            {galerieChargement && galerieAnalyses.length === 0 && (
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

            {galerieAnalyses.length > 0 && (() => {
              const fiche = galerieAnalyses[galerieIndex] || {};
              const analyse = fiche.analyse || {};
              // v74 — une fiche dont la photo n'est pas dans le dossier ne doit
              // pas produire une balise image cassée. Le code savait déjà que la
              // photo était absente (imageExiste, calculé des deux côtés à partir
              // du même listing) mais ne s'en servait jamais à l'affichage.
              const photoGalerieUrl = estAndroid()
                ? galerieImageCourante.nomPhoto === fiche.nomPhoto
                  ? galerieImageCourante.url
                  : ""
                : fiche.imageExiste
                  ? urlPhotoGalerie(fiche)
                  : "";

              // Absence CONSTATÉE, à distinguer d'un chargement encore en cours :
              // sur Android on ne conclut que lorsque la tentative a abouti pour
              // cette fiche précise (son nom est inscrit, sans URL).
              const photoGalerieAbsente = estAndroid()
                ? galerieImageCourante.nomPhoto === fiche.nomPhoto &&
                  !galerieImageCourante.url
                : !fiche.imageExiste;

              return (
                <>
                  <div style={styles.galerieNavigationLocale}>
                    {!estAndroid() && (
                      <button
                        type="button"
                        onClick={galeriePrecedente}
                        disabled={galerieAnalyses.length <= 1 || analysePhotoEdition || galerieSauvegardeEnCours}
                        style={{
                          ...styles.galerieFlecheNavigation,
                          opacity:
                            galerieAnalyses.length <= 1 || analysePhotoEdition || galerieSauvegardeEnCours
                              ? 0.35
                              : 1,
                        }}
                        aria-label="Afficher la fiche précédente"
                        title="Fiche précédente"
                      >
                        ◀
                      </button>
                    )}
                    <p style={styles.galerieCompteur}>
                      Fiche {galerieIndex + 1} / {galerieAnalyses.length}
                    </p>
                    {!estAndroid() && (
                      <button
                        type="button"
                        onClick={galerieSuivante}
                        disabled={galerieAnalyses.length <= 1 || analysePhotoEdition || galerieSauvegardeEnCours}
                        style={{
                          ...styles.galerieFlecheNavigation,
                          opacity:
                            galerieAnalyses.length <= 1 || analysePhotoEdition || galerieSauvegardeEnCours
                              ? 0.35
                              : 1,
                        }}
                        aria-label="Afficher la fiche suivante"
                        title="Fiche suivante"
                      >
                        ▶
                      </button>
                    )}
                  </div>

                  {photoGalerieUrl && (
                    <img
                      src={photoGalerieUrl}
                      alt={fiche.nomPhoto || "Photo analysée"}
                      style={{ ...styles.analyseMiniature, cursor: "zoom-in" }}
                      onClick={() => setPhotoPleinEcranUrl(photoGalerieUrl)}
                    />
                  )}

                  {/* v74 — même libellé des deux côtés, PC et PWA. */}
                  {!photoGalerieUrl && photoGalerieAbsente && (
                    <p
                      style={{
                        margin: "0 auto 12px auto",
                        padding: "14px 18px",
                        maxWidth: 420,
                        borderRadius: 14,
                        border: "1px dashed #b98a2e",
                        background: "#fbf6ea",
                        color: "#6b4e12",
                        fontWeight: 600,
                        textAlign: "center",
                      }}
                    >
                      Photo absente du dossier
                      <br />
                      <span style={{ fontWeight: 400, fontSize: 14 }}>
                        {fiche.nomPhoto || "nom de photo inconnu"}
                      </span>
                    </p>
                  )}

                  <div style={styles.dateHeurePhotoCarte}>
                    <div style={styles.dateHeurePhotoLigne}>
                      <div style={styles.dateHeurePhotoLabel}>📷 Prise de vue :</div>
                      <div style={styles.dateHeurePhotoValeur}>
                        {fiche.datePhotoLocale || "Non disponible"}
                      </div>
                    </div>
                    <div
                      style={
                        fiche.analyseModifiee
                          ? styles.dateHeurePhotoLigneAvecBadge
                          : styles.dateHeurePhotoLigne
                      }
                    >
                      <div style={styles.dateHeurePhotoLabel}>🤖 Analyse IA :</div>
                      <div style={styles.dateHeurePhotoValeur}>
                        {fiche.dateAnalyseLocale || "Non disponible"}
                      </div>
                      {fiche.analyseModifiee && (
                        <div
                          style={styles.badgeAnalyseModifiee}
                          title="Cette analyse IA a été modifiée puis enregistrée"
                          aria-label="Analyse modifiée"
                        >
                          <span aria-hidden="true">✨</span>
                          <span>Modifiée</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    style={styles.analyseCarte}
                    onTouchStart={handleGalerieTouchStart}
                    onTouchEnd={handleGalerieTouchEnd}
                  >
                    {afficherFicheAnalyse(
                      analysePhotoEdition ? analysePhotoResultat || analyse : analyse
                    )}
                    {afficherBoutonAnalyseComplete()}
                  </div>

                  {messageGalerieAnalyses && (
                    <p style={{ ...styles.galerieAideSwipe, fontWeight: 700 }}>
                      {messageGalerieAnalyses}
                    </p>
                  )}

                  <p style={styles.galerieAideSwipe}>
                    {analysePhotoEdition
                      ? "Termine ou annule les modifications avant de changer de fiche."
                      : "Balaye la fiche vers la gauche ou la droite pour passer à une autre analyse."}
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
            <BoutonMenuPopup titre="Interrompre" secondaire onClick={interrompreClassification} />
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
            <BoutonMenuPopup titre="Interrompre" secondaire onClick={interrompreRenommage} />
          </div>
        </div>
      )}

      {actualisationEnCours && !rangementModaleFermee && (
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
          <div style={{ ...styles.modal, maxHeight: "calc(100dvh - 40px)", overflowY: "auto" }}>
            <h3 style={{ margin: "0 0 12px" }}>
              {ecranParametres === "menu"
                ? "Paramètres"
                : ecranParametres === "demonstration"
                  ? "Mode démonstration"
                  : "Diagnostic stockage PWA"}
            </h3>

            {ecranParametres === "menu" && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "8px" }}>
                  <div>
                    <BoutonMenuPopup icone="🏷️" titre="Gestion des types de visite / catégories" onClick={() => afficherMessageSousBouton("parametres-types")} />
                    <MessageSousBouton cible="parametres-types" />
                  </div>
                  <div>
                    <BoutonMenuPopup icone="🎬" titre="Mode démonstration" onClick={() => { setMessageMenuAccueil(""); setCibleMessageMenuAccueil(""); setEcranParametres("demonstration"); }} />
                  </div>
                  <div>
                    <BoutonMenuPopup icone="🧪" titre="Simuler une perte d’autorisation" onClick={() => { setMessageMenuAccueil(""); setCibleMessageMenuAccueil(""); setEcranParametres("diagnostic"); }} />
                  </div>
                  <div>
                    <BoutonMenuPopup icone="👥" titre="Gestion des profils / Utilisateurs" onClick={() => afficherMessageSousBouton("parametres-profils")} />
                    <MessageSousBouton cible="parametres-profils" />
                  </div>
                  <div>
                    <BoutonMenuPopup
                      icone="📱"
                      titre="Test stockage Android"
                      onClick={() => {
                        setMessageTestStockageAndroid("");
                        afficherMessageSousBouton("parametres-stockage", "Fonctionnalité en cours de développement");
                      }}
                    />
                    <MessageSousBouton cible="parametres-stockage" />
                  </div>
                  <div>
                    <BoutonMenuPopup icone="🕘" titre="Historique des versions" onClick={() => afficherMessageSousBouton("parametres-historique")} />
                    <MessageSousBouton cible="parametres-historique" />
                  </div>
                </div>

                <BoutonMenuPopup titre="Fermer" secondaire onClick={() => {
                  setModeParametres(false);
                  setEcranParametres("menu");
                  setMessageMenuAccueil("");
                  setCibleMessageMenuAccueil("");
                  setMessageTestStockageAndroid("");
                }} />
              </>
            )}

            {ecranParametres === "demonstration" && (
              <>
                <section style={{ ...styles.parametresSection, marginBottom: "10px" }}>
                  <p style={styles.parametresTexte}>Statut : <strong>INACTIF</strong></p>
                  {modeDemonstrationActif && <p style={styles.parametresChemin}>{cheminDossierModeDemonstration || "Dossier de démonstration actif"}</p>}
                  {!modeDemonstrationActif ? (
                    <button type="button" disabled style={{ ...styles.bouton, opacity: 0.45, cursor: "not-allowed" }}>Lancer le mode démonstration</button>
                  ) : (
                    <>
                      <button type="button" disabled style={{ ...styles.boutonTraitement, opacity: 0.45, cursor: "not-allowed" }}>Exporter les photos de démonstration</button>
                      <button type="button" disabled style={{ ...styles.boutonAnalyseFermer, marginTop: 9, opacity: 0.45, cursor: "not-allowed" }}>Sortir du mode démonstration</button>
                    </>
                  )}
                </section>
                <BoutonMenuPopup titre="Retour aux paramètres" secondaire onClick={() => {
                  setMessageMenuAccueil("");
                  setCibleMessageMenuAccueil("");
                  setEcranParametres("menu");
                }} />
              </>
            )}

            {ecranParametres === "diagnostic" && (
              <>
                <section style={{ ...styles.parametresSection, marginBottom: "10px" }}>
                  <p style={styles.parametresTexte}>Ce test oublie volontairement les autorisations mémorisées par PhotoCartel sans fermer ni modifier la visite en cours.</p>
                  <button
                    type="button"
                    onClick={simulerPerteStockageV39}
                    disabled={simulationPerteStockageV39EnCours || !estAndroid()}
                    style={{ ...styles.boutonAnalyseFermer, marginTop: 9, opacity: simulationPerteStockageV39EnCours || !estAndroid() ? 0.45 : 1 }}
                  >
                    {simulationPerteStockageV39EnCours ? "Simulation en cours…" : "🧪 Simuler une perte d’autorisation"}
                  </button>
                  {diagnosticStockageV39 && <p style={{ ...styles.parametresChemin, whiteSpace: "pre-wrap" }}>{diagnosticStockageV39}</p>}
                </section>
                <BoutonMenuPopup titre="Retour aux paramètres" secondaire onClick={() => {
                  setMessageMenuAccueil("");
                  setCibleMessageMenuAccueil("");
                  setEcranParametres("menu");
                }} />
              </>
            )}
          </div>
        </div>
      )}

      {modeBibliotheques && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={{ margin: "0 0 12px" }}>Bibliothèques</h3>
            <BoutonMenuPopup icone="🧳" titre="Bibliothèque des voyages" onClick={() => afficherMessageSousBouton("bibliotheques-voyages")} />
            <MessageSousBouton cible="bibliotheques-voyages" />
            <BoutonMenuPopup icone="🏛️" titre="Bibliothèque des visites" onClick={() => afficherMessageSousBouton("bibliotheques-visites")} />
            <MessageSousBouton cible="bibliotheques-visites" />
            <BoutonMenuPopup icone="🔎" titre="Rechercher" onClick={ouvrirEcranRecherche} />
            <BoutonMenuPopup titre="Fermer" secondaire onClick={() => {
              setModeBibliotheques(false);
              setMessageMenuAccueil("");
              setCibleMessageMenuAccueil("");
            }} />
          </div>
        </div>
      )}

      {modeRenommerAccueil && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={{ margin: "0 0 12px" }}>Renommer des photos</h3>
            <BoutonMenuPopup
              icone="🖼️"
              titre="Renommer une photo"
              onClick={() => {
                setModeRenommerAccueil(false);
                setMessageMenuAccueil("");
                setCibleMessageMenuAccueil("");
                document.getElementById("selection-photos-renommage")?.click();
              }}
            />
            <MessageSousBouton cible="renommer-photo" />
            <BoutonMenuPopup
              icone="📁"
              titre="Renommer un dossier"
              onClick={() => {
                setModeRenommerAccueil(false);
                setMessageMenuAccueil("");
                setCibleMessageMenuAccueil("");
                document.getElementById("selection-dossier-renommage")?.click();
              }}
            />
            <BoutonMenuPopup titre="Fermer" secondaire onClick={() => {
              setModeRenommerAccueil(false);
              setMessageMenuAccueil("");
              setCibleMessageMenuAccueil("");
            }} />
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

                // v43 : Gestion du voyage reste ouverte derrière l’écran de création.
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
            <h3>Créer un voyage</h3>
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

      {modeModificationIdentiteVisite && (
        <div style={{ ...styles.modalOverlay, zIndex: 10030 }}>
          <div style={styles.modal} role="dialog" aria-modal="true" aria-labelledby="titre-modifier-identite-visite">
            <h3 id="titre-modifier-identite-visite" style={{ marginTop: 0 }}>Modifier l’identité de la visite</h3>

            <label><strong>Nom de la visite</strong>
              <input type="text" value={nomVisiteModifie} onChange={(e) => { setNomVisiteModifie(e.target.value); setMessageModificationVisite(""); }} style={styles.input} />
            </label>
            <label><strong>Ville</strong>
              <input type="text" value={villeVisiteModifiee} onChange={(e) => { setVilleVisiteModifiee(e.target.value); setMessageModificationVisite(""); }} style={styles.input} />
            </label>
            <div style={{ position: "relative", marginBottom: "10px" }}>
              <strong style={{ display: "block", marginBottom: "6px" }}>Type de visite</strong>
              <button
                type="button"
                onClick={() => {
                  setTypeModificationEnConfirmation("");
                  setListeTypesModificationOuverte((ouverte) => !ouverte);
                }}
                aria-haspopup="listbox"
                aria-expanded={listeTypesModificationOuverte}
                style={{
                  ...styles.input,
                  width: "100%",
                  minHeight: "42px",
                  margin: 0,
                  padding: "9px 12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <span>{typeVisiteModifie || "Sélectionner un type"}</span>
                <span aria-hidden="true" style={{ fontSize: "16px", lineHeight: 1 }}>
                  {listeTypesModificationOuverte ? "⌃" : "⌄"}
                </span>
              </button>

              {listeTypesModificationOuverte && (
                <div
                  role="listbox"
                  aria-label="Sélectionner un type de visite"
                  style={{
                    position: "fixed",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 10040,
                    width: "min(420px, calc(100vw - 34px))",
                    maxHeight: "calc(100dvh - 190px)",
                    overflowY: "auto",
                    overscrollBehavior: "contain",
                    boxSizing: "border-box",
                    padding: "9px 10px 8px",
                    border: "1px solid rgba(181, 138, 58, 0.32)",
                    borderRadius: "16px",
                    background: "rgba(255, 253, 248, 0.995)",
                    boxShadow: "0 18px 42px rgba(34, 26, 16, 0.24)",
                  }}
                >
                  <div
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                      margin: "0 0 5px",
                      padding: "2px 0 6px",
                      textAlign: "center",
                      fontSize: "13px",
                      fontWeight: 800,
                      color: "#2b241c",
                      background: "rgba(255, 253, 248, 0.995)",
                    }}
                  >
                    Sélectionner un type de visite
                  </div>

                  {[
                    ["🏛️", "Musée"],
                    ["⛪", "Église"],
                    ["🚆", "Transport"],
                    ["🏞️", "Site naturel"],
                    ["🏘️", "Ville / Village"],
                    ["🌳", "Jardin / Parc"],
                    ["🏙️", "Architecture"],
                    ["🏰", "Château"],
                    ["🍽️", "Restaurant / Repas"],
                    ["•••", "Autre"],
                  ].map(([icone, type]) => {
                    const estTypeSelectionne = typeVisiteModifie === type;
                    const estTypeConfirme = typeModificationEnConfirmation === type;
                    const estTypeCoche = estTypeConfirme || estTypeSelectionne;
                    return (
                      <button
                        key={type}
                        type="button"
                        role="option"
                        aria-selected={estTypeCoche}
                        disabled={Boolean(typeModificationEnConfirmation)}
                        onClick={() => {
                          if (typeModificationEnConfirmation) return;
                          setTypeVisiteModifie(type);
                          setMessageModificationVisite("");
                          setTypeModificationEnConfirmation(type);
                          temporisationTypeVisiteRef.current = setTimeout(() => {
                            setListeTypesModificationOuverte(false);
                            setTypeModificationEnConfirmation("");
                            temporisationTypeVisiteRef.current = null;
                          }, 500);
                        }}
                        style={{
                          width: "100%",
                          minHeight: "36px",
                          padding: "5px 5px",
                          border: "none",
                          borderTop: "1px solid rgba(181, 138, 58, 0.13)",
                          background: estTypeCoche ? "rgba(181, 138, 58, 0.11)" : "transparent",
                          display: "grid",
                          gridTemplateColumns: "27px 1fr 24px",
                          alignItems: "center",
                          gap: "7px",
                          color: "#24211e",
                          fontFamily: "inherit",
                          fontSize: "14px",
                          textAlign: "left",
                          cursor: typeModificationEnConfirmation ? "default" : "pointer",
                          opacity: typeModificationEnConfirmation && !estTypeConfirme ? 0.72 : 1,
                        }}
                      >
                        <span aria-hidden="true" style={{ textAlign: "center", fontSize: "16px" }}>{icone}</span>
                        <span>{type}</span>
                        <span
                          aria-hidden="true"
                          style={{
                            width: "17px",
                            height: "17px",
                            borderRadius: "50%",
                            border: "1.8px solid #332f2a",
                            background: estTypeCoche
                              ? "radial-gradient(circle, #332f2a 0 45%, transparent 48%)"
                              : "transparent",
                            boxSizing: "border-box",
                            justifySelf: "center",
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            {messageModificationVisite ? <p style={{ ...styles.modalTexte, marginTop: 0 }}>{messageModificationVisite}</p> : null}
            <button type="button" onClick={enregistrerModificationIdentiteVisite} disabled={modificationVisiteEnCours} style={styles.modalBoutonPrincipal}>
              {modificationVisiteEnCours ? "Enregistrement…" : "Enregistrer les modifications"}
            </button>
            <button type="button" onClick={fermerModificationIdentiteVisite} disabled={modificationVisiteEnCours} style={styles.modalBoutonAnnuler}>Annuler</button>
          </div>
        </div>
      )}

      {modeCreationVisite && (
        <div style={{ ...styles.modalOverlay, padding: "10px" }}>
          <div style={{ ...styles.modal, padding: "14px", maxHeight: "calc(100dvh - 20px)", overflowY: "auto" }}>
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
                padding: "10px 12px",
                marginBottom: "9px",
                textAlign: "left",
                background: "linear-gradient(135deg, #fff8e8, #ffffff)",
                color: "#171a1f",
                cursor: "pointer",
                boxShadow: "0 10px 24px rgba(80, 62, 38, 0.10)",
              }}
            >
              <strong style={{ display: "block", fontSize: "14px", marginBottom: "3px" }}>
                ⚡ Créer une visite rapide
              </strong>
              <span style={{ display: "block", color: "#6f675c", fontSize: "10.5px", lineHeight: 1.25 }}>
                Idéal lorsque vous enchaînez plusieurs visites et souhaitez prendre des photos immédiatement.
                Vous pourrez renommer et compléter cette visite plus tard.
              </span>
            </button>

            <div
              style={{
                border: "1px solid rgba(181, 138, 58, 0.22)",
                borderRadius: "18px",
                padding: "10px 11px",
                marginBottom: "8px",
                background: "rgba(255, 253, 248, 0.92)",
              }}
            >
              <h4 style={{ margin: "0 0 7px", fontSize: "14px" }}>
                🏛️ Créer une visite structurée
              </h4>

              <label>
                <strong>Ville</strong>
                <input
                  type="text"
                  value={villeNouvelleVisite}
                  onChange={(e) => setVilleNouvelleVisite(e.target.value)}
                  placeholder="Ex : Lima"
                  style={{ ...styles.input, padding: "7px 9px", marginTop: "3px", marginBottom: "7px", fontSize: "13px" }}
                />
                <span style={{ display: "block", marginTop: "2px", marginBottom: "5px", color: "#746d63", fontSize: "9.5px", lineHeight: 1.2 }}>
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
                  style={{ ...styles.input, padding: "7px 9px", marginTop: "3px", marginBottom: "7px", fontSize: "13px" }}
                />
              </label>

              <div style={{ position: "relative", marginBottom: "6px" }}>
                <strong style={{ display: "block", marginBottom: "6px" }}>
                  Type de visite
                </strong>

                <button
                  type="button"
                  onClick={() => setListeTypesVisiteOuverte((ouverte) => !ouverte)}
                  aria-haspopup="listbox"
                  aria-expanded={listeTypesVisiteOuverte}
                  style={{
                    ...styles.input,
                    width: "100%",
                    minHeight: "36px",
                    margin: 0,
                    padding: "6px 9px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ color: typeNouvelleVisite ? "#1f1f1f" : "#8a8379" }}>
                    {typeNouvelleVisite || ""}
                  </span>
                  <span aria-hidden="true" style={{ fontSize: "16px", lineHeight: 1 }}>
                    {listeTypesVisiteOuverte ? "⌃" : "⌄"}
                  </span>
                </button>

                {listeTypesVisiteOuverte && (
                  <div
                    role="listbox"
                    aria-label="Sélectionner un type de visite"
                    style={{
                      position: "fixed",
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                      zIndex: 10020,
                      width: "min(420px, calc(100vw - 34px))",
                      maxHeight: "calc(100dvh - 190px)",
                      overflowY: "auto",
                      overscrollBehavior: "contain",
                      boxSizing: "border-box",
                      padding: "9px 10px 8px",
                      border: "1px solid rgba(181, 138, 58, 0.32)",
                      borderRadius: "16px",
                      background: "rgba(255, 253, 248, 0.995)",
                      boxShadow: "0 18px 42px rgba(34, 26, 16, 0.24)",
                    }}
                  >
                    <div
                      style={{
                        position: "sticky",
                        top: 0,
                        zIndex: 1,
                        margin: "0 0 5px",
                        padding: "2px 0 6px",
                        textAlign: "center",
                        fontSize: "13px",
                        fontWeight: 800,
                        color: "#2b241c",
                        background: "rgba(255, 253, 248, 0.995)",
                      }}
                    >
                      Sélectionner un type de visite
                    </div>

                    {[
                      ["🏛️", "Musée"],
                      ["⛪", "Église"],
                      ["🚆", "Transport"],
                      ["🏞️", "Site naturel"],
                      ["🏘️", "Ville / Village"],
                      ["🌳", "Jardin / Parc"],
                      ["🏙️", "Architecture"],
                      ["🏰", "Château"],
                      ["🍽️", "Restaurant / Repas"],
                      ["•••", "Autre"],
                    ].map(([icone, type]) => {
                      const estTypeConfirme = typeVisiteEnConfirmation === type;

                      return (
                        <button
                          key={type}
                          type="button"
                          role="option"
                          aria-selected={estTypeConfirme}
                          disabled={Boolean(typeVisiteEnConfirmation)}
                          onClick={() => {
                            if (typeVisiteEnConfirmation) return;

                            setTypeNouvelleVisite(type);
                            setTypeVisiteEnConfirmation(type);

                            temporisationTypeVisiteRef.current = setTimeout(() => {
                              setListeTypesVisiteOuverte(false);
                              setTypeVisiteEnConfirmation("");
                              temporisationTypeVisiteRef.current = null;
                            }, 500);
                          }}
                          style={{
                            width: "100%",
                            minHeight: "36px",
                            padding: "5px 5px",
                            border: "none",
                            borderTop: "1px solid rgba(181, 138, 58, 0.13)",
                            background: estTypeConfirme
                              ? "rgba(181, 138, 58, 0.11)"
                              : "transparent",
                            display: "grid",
                            gridTemplateColumns: "27px 1fr 24px",
                            alignItems: "center",
                            gap: "7px",
                            color: "#24211e",
                            fontFamily: "inherit",
                            fontSize: "14px",
                            textAlign: "left",
                            cursor: typeVisiteEnConfirmation ? "default" : "pointer",
                            opacity:
                              typeVisiteEnConfirmation && !estTypeConfirme ? 0.72 : 1,
                          }}
                        >
                          <span aria-hidden="true" style={{ textAlign: "center", fontSize: "16px" }}>
                            {icone}
                          </span>
                          <span>{type}</span>
                          <span
                            aria-hidden="true"
                            style={{
                              width: "17px",
                              height: "17px",
                              borderRadius: "50%",
                              border: "1.8px solid #332f2a",
                              background: estTypeConfirme
                                ? "radial-gradient(circle, #332f2a 0 45%, transparent 48%)"
                                : "transparent",
                              boxSizing: "border-box",
                              justifySelf: "center",
                            }}
                          />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

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

      <main
        style={{
          ...styles.telephone,
          ...(pageAccueilPrincipaleAffichee ? styles.telephoneAccueilFige : {}),
          ...(ecranDernieresVisitesActif
            ? {
                height: "auto",
                maxHeight: "none",
                overflow: "visible",
                paddingBottom: listeDernieresVisitesOuverte
                  ? "calc(190px + env(safe-area-inset-bottom))"
                  : "calc(130px + env(safe-area-inset-bottom))",
              }
            : {}),
        }}
      >
        {resultatClassification && !dashboardRenommage ? (
          <EcranClassificationTerminee />
        ) : dashboardRenommage ? (
          <EcranRenommageTermine />
        ) : (
          <>
            <BandeauModeDemonstration />
            <button
              type="button"
              onClick={ouvrirEcranRecherche}
              aria-label="Rechercher dans mes photos"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                width: "100%",
                boxSizing: "border-box",
                margin: "0 0 12px",
                padding: "12px 16px",
                borderRadius: "16px",
                border: "1px solid rgba(181, 138, 58, 0.45)",
                background: "#fffdf8",
                boxShadow: "0 10px 26px rgba(80, 62, 38, 0.08)",
                color: "#746b5f",
                fontSize: "15px",
                fontWeight: 600,
                fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <span aria-hidden="true">🔎</span>
              Rechercher dans mes photos
            </button>
            <BlocEtatVisite />

            <div className="photocartel-grille-actions" style={styles.grilleActions}>
              <ActionCarte
                icone="📷"
                titre="Prendre des photos"
                sousTitre="Ouvre l'appareil photo du téléphone"
                onClick={handlePrendreDesPhotos}
                disabled={!voyage}
                couleur="#d18a00"
              />
              <ActionCarte
                icone="🖼️"
                titre="Galerie des photos analysées"
                onClick={ouvrirGaleriePhotosAnalysees}
                couleur="#7137ba"
              />
              <ActionCarte
                icone="⚑"
                titre="Fin de visite"
                sousTitre="Clôturer cette visite et créer la suivante"
                onClick={finDeVisite}
                disabled={!voyage}
                couleur="#1fa64a"
              />
              <ActionCarte
                icone="🗂️"
                titre="Ranger les photos"
                onClick={ouvrirSelectionActualisationPhotos}
                disabled={!voyage || !cheminCollecteActif || actualisationEnCours}
                couleur="#d18a00"
              />
              <ActionCarte
                icone="📷"
                titre="Galerie des photos à analyser"
                sousTitre="(non connecté)"
                disabled
                couleur="#1675c1"
              />
              <ActionCarte
                icone="📂"
                titre="Explorer les dossiers PhotoCartel"
                onClick={explorerDossiersPhotoCartel}
                couleur="#e7a000"
              />
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

            <div className="photocartel-actions-traitement-accueil" style={styles.actionsTraitementAccueil}>
              <button
                type="button"
                onClick={() => document.getElementById("selection-dossier-import")?.click()}
                style={styles.boutonTraitementAccueil}
              >
                Classifier
              </button>

              <button
                type="button"
                onClick={() => {
                  setMessageMenuAccueil("");
                  setCibleMessageMenuAccueil("");
                  setModeRenommerAccueil(true);
                }}
                style={styles.boutonTraitementAccueil}
              >
                Renommer
              </button>
            </div>

            <section
              ref={sectionDernieresVisitesRef}
              className="photocartel-dernieres-visites"
              style={styles.dernieresVisitesAccueil}
            >
              <div style={styles.dernieresVisitesLabel}>Dernières visites</div>
              <button
                type="button"
                onClick={() => {
                  // v48 : l’ouverture du menu affiche d’abord instantanément la liste
                  // déjà préchargée en mémoire (aucun ralentissement visible), puis
                  // relance en tâche de fond une réautorisation + un scan complet.
                  // Objectif : corriger les visites dont les dates n’ont jamais pu être
                  // calculées (donc mal triées, reléguées en tri alphabétique) sans
                  // jamais ouvrir de sélecteur de dossier bloquant à ce clic.
                  setListeDernieresVisitesOuverte((ouverte) => !ouverte);
                  if (estAndroid()) {
                    actualiserVisitesPhysiques({ autoriserSelection: true, silencieux: true });
                  }
                }}
                style={styles.dernieresVisitesDeclencheur}
                aria-expanded={listeDernieresVisitesOuverte}
                aria-controls="liste-dernieres-visites-rangees"
              >
                <span>
                  {visiteResumeSelectionnee
                    ? visiteResumeSelectionnee.nom
                    : "Sélectionner une visite"}
                </span>
                <span style={styles.dernieresVisitesChevron}>
                  {listeDernieresVisitesOuverte ? "⌃" : "⌄"}
                </span>
              </button>

              {listeDernieresVisitesOuverte && (
                <div id="liste-dernieres-visites" className="photocartel-liste-dernieres-visites" style={styles.dernieresVisitesListe}>
                  <div style={styles.dernieresVisitesListeTitre}>Sélectionner une visite</div>
                  {visitesRangeesRecentes().length > 0 ? (
                    <div style={styles.dernieresVisitesOptionsDefilantes}>
                      {visitesRangeesRecentes().map((visite) => {
                        const cocheVisible = visiteRecenteEnConfirmation === visite.id;
                        return (
                          <button
                            key={visite.id}
                            type="button"
                            onClick={() => selectionnerVisiteRecente(visite)}
                            style={styles.dernieresVisitesOption}
                          >
                            <span style={styles.dernieresVisitesOptionIcone}>
                              {visite.estARattacher || visite.statut === "À rattacher"
                                ? "📁"
                                : visite.type
                                  ? iconePourTypeVisite(libelleTypeVisiteResume(visite))
                                  : visite.estVisiteRapide || visite.ville === "Visites rapides"
                                    ? "⚡"
                                    : visite.statut === "Importée"
                                      ? "📥"
                                      : "•••"}
                            </span>
                            <span style={styles.dernieresVisitesOptionTexte}>
                              <strong style={styles.dernieresVisitesOptionNom}>{visite.nom}</strong>
                              <span style={styles.dernieresVisitesOptionContexte}>
                                {visite.estARattacher || visite.statut === "À rattacher"
                                  ? `À rattacher · ${Number(visite.nombrePhotos || 0)} photo${Number(visite.nombrePhotos || 0) > 1 ? "s" : ""}`
                                  : [visite.voyage, visite.ville === "Visites rapides" ? "Ville non renseignée" : visite.ville]
                                      .filter(Boolean)
                                      .join(" · ")}
                              </span>
                            </span>
                            <span style={styles.dernieresVisitesOptionCoche}>
                              {cocheVisible ? "✓" : "○"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : lectureVisitesPhysiquesEnCours ? (
                    <div style={styles.dernieresVisitesVide}>Lecture initiale des dossiers PhotoCartel…</div>
                  ) : erreurLectureVisitesPhysiques ? (
                    <div
                      style={{
                        ...styles.dernieresVisitesVide,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <div>⚠️ {erreurLectureVisitesPhysiques}</div>

                      {estAndroid() && (
                        <button
                          type="button"
                          onClick={async () => {
                            // v42.0.8 : seul ce geste utilisateur explicite est
                            // autorisé à ouvrir le sélecteur Android.
                            await actualiserVisitesPhysiques({ autoriserSelection: true });
                          }}
                          style={{
                            ...styles.bouton,
                            width: "100%",
                            maxWidth: "270px",
                            marginTop: "2px",
                            padding: "10px 12px",
                            fontSize: "13px",
                          }}
                        >
                          📁 Autoriser le dossier PhotoCartel
                        </button>
                      )}
                    </div>
                  ) : (
                    <div style={styles.dernieresVisitesVide}>
                      Aucune visite physique disponible pour le moment.
                    </div>
                  )}
                </div>
              )}
            </section>

            {visiteResumeSelectionnee && (
              <div id="resume-visite-selectionnee" style={{ scrollMarginTop: "70px" }}>
                <BlocResumeVisite visite={visiteResumeSelectionnee} />
              </div>
            )}

            {messageFonctionnaliteAccueil && (
              <div style={styles.panneauInfo} role="status">
                <strong>{messageFonctionnaliteAccueil}</strong>
              </div>
            )}

            {messageImport && !resultatClassification && (
              <div id="etape-classification" style={{ ...styles.panneauInfo, scrollMarginTop: "70px" }}>
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
                id="etape-renommage"
                data-chemin-renommage={cheminRenommagePrepare}
                style={{ ...styles.panneauInfo, scrollMarginTop: "70px" }}
              >
                <strong>{messageRenommage}</strong>
                <p>
                  <strong>Dossier sélectionné :</strong> {dossierRenommage}
                </p>
                <p>
                  <strong>Photos sélectionnées :</strong> {nombrePhotosRenommage}
                </p>
              </div>
            )}

            {renommagePret && !propositionsRenommage && !dashboardRenommage && (
              <button
                type="button"
                onClick={() => lancerAnalyseRenommage()}
                disabled={analyseRenommageEnCours}
                style={styles.boutonTraitement}
              >
                {analyseRenommageEnCours
                  ? "Analyse IA en cours..."
                  : "🤖 Lancer l'analyse IA"}
              </button>
            )}

            {propositionsRenommage && !dashboardRenommage && (
              <div style={styles.panneauInfo}>
                <strong>Propositions de renommage — vérifie avant de valider</strong>
                {propositionsRenommage.map((proposition, index) => {
                  const fichierOeuvre = fichiersRenommage.find((f) => f.name === proposition.oeuvre);
                  const fichierCartel = proposition.cartel
                    ? fichiersRenommage.find((f) => f.name === proposition.cartel)
                    : null;
                  const urlOeuvre = fichierOeuvre ? URL.createObjectURL(fichierOeuvre) : null;
                  const urlCartel = fichierCartel ? URL.createObjectURL(fichierCartel) : null;
                  return (
                    <div
                      key={proposition.oeuvre + index}
                      style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px solid #ddd" }}
                    >
                      <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "6px" }}>
                        {urlOeuvre && (
                          <div style={{ textAlign: "center" }}>
                            <img
                              src={urlOeuvre}
                              alt={`Œuvre : ${proposition.oeuvre}`}
                              style={{ width: "84px", height: "84px", objectFit: "cover", borderRadius: "10px", border: "1px solid #ccc" }}
                            />
                            <div style={{ fontSize: "10px", opacity: 0.65, marginTop: "2px" }}>Œuvre</div>
                          </div>
                        )}
                        {urlCartel && (
                          <div style={{ textAlign: "center" }}>
                            <img
                              src={urlCartel}
                              alt={`Cartel : ${proposition.cartel}`}
                              style={{ width: "84px", height: "84px", objectFit: "cover", borderRadius: "10px", border: "1px solid #ccc" }}
                            />
                            <div style={{ fontSize: "10px", opacity: 0.65, marginTop: "2px" }}>Cartel</div>
                          </div>
                        )}
                        {!urlOeuvre && !urlCartel && (
                          <p style={{ margin: 0, fontSize: "13px", opacity: 0.75 }}>
                            {proposition.oeuvre} {proposition.cartel ? `↔ ${proposition.cartel}` : "(aucun cartel associé)"}
                          </p>
                        )}
                      </div>
                      {proposition.aVerifier ? (
                        <p style={{ margin: 0, color: "#b02a2a" }}>
                          ⚠️ À vérifier manuellement — {proposition.raison || "analyse insuffisante"}
                        </p>
                      ) : (
                        <div>
                          <label style={{ display: "block", fontSize: "11px", opacity: 0.7, marginBottom: "3px" }}>
                            Nom proposé — modifiable avant validation :
                          </label>
                          <textarea
                            value={proposition.nomPropose}
                            onChange={(event) => modifierPropositionRenommage(index, event.target.value)}
                            rows={2}
                            style={{
                              ...styles.input,
                              fontWeight: "600",
                              resize: "vertical",
                              width: "100%",
                              boxSizing: "border-box",
                              lineHeight: "1.4",
                              fontFamily: "inherit",
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
                <button
                  type="button"
                  onClick={() => validerRenommage()}
                  disabled={confirmationRenommageEnCours}
                  style={{ ...styles.boutonTraitement, marginTop: "14px" }}
                >
                  {confirmationRenommageEnCours
                    ? "Renommage en cours..."
                    : "✅ Valider et renommer"}
                </button>
              </div>
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

        {/* v65 — sélecteur multi-photos pour "Renommer une photo" (spec v9), sans webkitdirectory :
            l'utilisateur choisit directement quelques fichiers (œuvre + cartel), pas un dossier entier.
            Réutilise volontairement les mêmes fonctions déjà testées que "Renommer un dossier" —
            elles ne dépendent d'aucune façon d'un chemin de dossier réel (repli déjà géré si
            webkitRelativePath est vide). */}
        <input
          id="selection-photos-renommage"
          type="file"
          accept="image/*"
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