# V7

- score de confiance coloré
- renommage A_VERIFIER
- masquage des champs vides
- technique + support fusionnés
- enrichissement contexte musée

# V8

- export Excel
- export CSV
- export JSON

# V9

- traitement par lot
- association oeuvre/cartel
- renommage automatique dossier complet

# V10

- base documentaire locale
- recherche multicritère

Avoir un bouton qui permet d'afficher / masquer les champs de bloc "Analyse IA", même s'ils sont vides. Le cas échéant le remplir à la main

Réfléchir au worflow suivant : a l'entrée du musée j'ouvre PhotoCartel sur mon téléphone ; je crée un dossier qui s'appelle "Musée National de Séoul" (sur mon téléphone toujours) ; puis je fais ma visite, et prends 200 photos ; toutes les photos sont enregistrées dircetement dans la dossier "Musée National de Séoul" MAIS SANS RENOMMAGE encore ; en sortant du musée j'ai un bouton "fin de la viste" et toutes les photos suivantes sont enregsitrées ailleurs. Et on ferait le renommage en masse le soir, une semaine plus tard, ... sur mon PC ou mon téléphone

reduire la police d'acchige du bloc 'Analyse IA' pour que l'on n'ai pas à scroller. Ou bien écarter les deux photos ?

Analyse du contexte historique du fichier pour enrichissement automatique des métadonnées." En réalité, ce que tu viens de découvrir correspond exactement à l'un des objectifs de PhotoCartel : capitaliser sur l'information déjà présente dans ta photothèque. 

Capitaliser sur l'information déjà présente dans la photothèque

Dans ton exemple :

l'OCR extrait seulement :
La Dolorosa
Siglo XVIII
Óleo sobre tela
l'IA en déduit :
peinture
huile sur toile
XVIIIe siècle

Mais elle ne connaît pas :

le musée
la ville
le pays



11 juin 2026 : Pas tout à fait d'accord. le champ "voyage" doit être pré-rempli (on ne va pas le ressaisir dix fois dans la journée). Cela implique qu'il faudra créer en amont une fonction "créer voyage". Et quelque chose d'analogue avec la ville. Si reste 5 jours à Séoul, je ne vais pas ressaisir Séoul à chaque fois pendant mes 5 jours. Mais laissons ça de côté. Je le note dans ma backlog. Pour l'instant on sait que la mécanique de création de visite, création de dossiers, création de sous-dossiers (catégories) fonctionne. Donc pour l'instant laissons cela en place. Je crois désormais il faut que l'on avance sur la classification intelligente (oeuvre, cartel, fardin, architecture, ...), pour que l'app enregistre les photos dans les catégories correctes

nommage auto des jardins 
nommage auto des architecture et des autres catégories
ajouter catégorie "selfie"
creéation auto des catégories quand on choisit le type de visite = 'musée'
création d'un voyage + remplissage auto du nom du dossier los de la creéation d'une vouvelle visie
créer automatiquement un dossier de musée en cliquant sur une photo devant le guichet, une affiche un panneau avec un bouton "créer un dossier muséee à partir d'une photo"         et même  "créer un dossier de visite à partir d'un panneau"


avec le choix de lergo : nouvelle visite >> trype de visite >> ...    les UI vont changer. Doit-on afficher oeuvre et cartel  > oui pour les cas "à vérifier"

On voudra une fonctionnalité "ajouter une catégorie" sur la version App. Que l'utilisateur puisse le faire de façon autonome

Pour d'anciennes photos renommeés, un fonctionnalité qui permet de les claissifier (les mettre dans des sous dossier de catégories peertinentes) SANS LES RENOMMER



BUG / AMÉLIORATION À TRAITER PLUS TARD

Taux de réussite renommage :
actuellement = œuvres renommées / total photos

à corriger en :
œuvres renommées / total œuvres candidates
(cartels exclus du calcul)


26 juin 2026
le bouton 'fin de visite' d'un dossier tampon doit créer auto un nouveu  dossier tampon -> on ne ferme pas un dossier tampon uniquement avec 'nouvelle visite' (contexte = quand je n'ai pas le temps de créer proprement une nouvelle viste, je renommerai plus tard ces dossier tampon)

je veux un bouton 'analyser une photo' ()= analyse d'un photo 'one shot' une fonctionalité 'grand public'). pas beoin de voyage ou de visite; J'ouvre l'app, le bouton 'analyser une photo' est dispo. je clique dessus, l'appareil photo du tel s'ouvre, je prends une photo et là, en temps réel (Open AI), il m'affiche le descriptif de la photo (il enregistre tout ça dans un dossier qui (pré?)existe "Photos analysées singulièrement"). EXEMPLES de résultats : "C'est un paysage de xxx" ; "c'est une peinture de David Hockcney intitulée ' xxx ' de  1965 " ;  " c'est l'eglise xxx de 1852, qui se trouve à xxx ".        Mettre le bouton 'analyser une photo' a côté de 'Prendre des photos". Pour l'instant bouton non connecté. On mettra le moteur derrière plus tard.  FAIT


4 juillet 2026
_Mettre des icones à la place des boutons
_un bouton 'lancer l'analyse IA"
_Un bouton 'interompre l'analyse IA"
_Reconnecter l'icone du tel sur render.com
_Fonctionalité d'envoi auto de courrile avec l'extrc en piece jointe
_Reflefhir aux extract qui se réinitialise des que l'on en a fait un
_Dans la fonction 'analyser une photo' toujours enregistrer la photos prise (meme si on ne lance pas l'IA) dans un dossier 'photos a anlyser'
_dans la fonction 'analyser une photo' il faut griser le bouton 'enregistrer l'analyse' (=le rendre indisponible)  quand on a déjà cliqué dessus (on ne va pas enregistrer l'analyse plusiers fois)
_ sur l’ecran résultat de la fonction ‘analyser une photo’ mettre les boutons dans une barre fixe ? Pas pratique d’avoir à scroller jusqu’en bas de l’analyse pour choir ce que l’on doit faire de cette photo


15 juillet 2026
Ajouter un  texte en petit en rouge '"dans" le bouton "ranger les photos" de la page d'accueil : le nombre de photos à ranger (et éventuellement dans combien de visites. S'inspirer du petit texte sous le bouton "Galerie des des photos à analyser"

faire une bibliothèque des visite --> changer le nom de l'icone 'bibilotheque des voyages en bibliothèque'

Dans le moteur de recherche : crer un moteur classique (on selectionne dans des champs distincts certains attributs) mais aussi une entrée style conversation bot ou l'on pourrait s'exprimer 'sors moi toutes les peintues de Matisse que j'ai photographiées en Allemangne)

pour plus tard créer une GROSSE fonctionalité "Dégrossir un voyage" (nom meilleur à trouver) . On -> on soumet à PhotoCartel un fichier de 1000 photos non renommées (elles ont chacune le timestand dans leur nom). PhotoCartel idenfit intelligemment les 1000 photos grâce à la proximité ou eloignement des timestand identifie des "visites" et crée ainsi des sous-dossiers où il regroupent les photos d'une même visite