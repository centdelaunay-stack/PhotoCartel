## Schéma de référence PhotoCartel

Version : 1.0
Date : 2026-06-05

## Historique

### V1.0
- title_fr
- title_en
- artist
- object_category
- object_type
- country_origin
- culture
- date
- period
- dynasty
- medium
- support
- dimensions
- museum
- city
- country_museum
- ownership
- provenance
- keywords
- confidence



 Schéma de référence PhotoCartel

## Version 1




```json
{
  "title_fr": "",
  "title_en": "",

  "artist": "",

  "object_category": "",
  "object_type": "",

  "country_origin": "",
  "culture": "",

  "date": "",
  "period": "",
  "dynasty": "",

  "medium": "",
  "support": "",
  "dimensions": "",

  "museum": "",
  "city": "",
  "country_museum": "",

  "ownership": "",
  "provenance": "",

  "keywords": [],

  "confidence": 0.0
}
```

## Définitions

### title_fr

Titre normalisé en français.

### title_en

Titre original anglais ou traduction anglaise de référence.

### artist

Nom de l'artiste lorsque connu.

### object_category

Grande catégorie :

* sculpture
* peinture
* mobilier
* céramique
* masque
* parure
* objet rituel
* etc.

### object_type

Type précis :

* statue bouddhique
* portrait
* coffre laqué
* masque Hahoe
* vase
* etc.

### country_origin

Pays ou civilisation d'origine de l'œuvre.

### culture

Contexte culturel ou religieux.

### date

Date ou période de création.

### period

Période historique.

### dynasty

Dynastie associée.

### medium

Matériau ou technique.

### support

Support physique :

* toile
* papier
* bois
* soie
* etc.

### dimensions

Dimensions de l'œuvre.

### museum

Musée où la photo a été prise.

### city

Ville où la photo a été prise.

### country_museum

Pays où la photo a été prise.

### ownership

Collection permanente, prêt, collection privée, etc.

### provenance

Institution ou collection d'origine.

### keywords

Liste de mots-clés.

### confidence

Indice de confiance de l'analyse IA.

```
```
## Idées futures

- title_ko
- title_zh
- inventory_number
- room_number
- exhibition_name
- GPS du musée
- lien vers site du musée
- QR code du cartel

### Principes de modélisation

- object_category = famille documentaire
- object_type = objet précis
- medium = technique ou matériau principal
- support = support physique
- culture = contexte culturel ou religieux
- country_origin = origine géographique de l'œuvre
- country_museum = pays où la photo a été prise

Principes fondateurs PhotoCartel
Principe 1 : La confiance gouverne le renommage
confidence >= 0.50
→ renommage automatique autorisé

confidence < 0.50
→ renommage automatique interdit

Exemple :

20260513_170711, Johannes Vermeer, 'Jeune femme au luth', 1662-1663.jpg

contre :

20260513_170711, A_VERIFIER.jpg

Objectif :

ne jamais propager une information douteuse dans la base documentaire.

Principe 2 : GPT peut déduire, mais doit pouvoir justifier

Certaines informations peuvent être absentes du cartel mais fortement probables.

Exemple :

Young Woman with a Lute
Johannes Vermeer
Bequest of Collis P. Huntington

GPT peut raisonnablement déduire :

{
  "museum": "Metropolitan Museum of Art",
  "city": "New York",
  "country_museum": "États-Unis",
  "confidence": 0.92
}

Toute déduction devra être explicable.

Objectif :

permettre les inférences utiles sans transformer PhotoCartel en générateur d'hallucinations.

Principe 3 : PhotoCartel possède un contexte que GPT ne connaît pas

L'analyse ne doit pas reposer uniquement sur l'OCR.

PhotoCartel peut fournir à GPT :

le nom du dossier ;
le nom du fichier ;
la ville ;
le musée ;
la date de prise de vue ;
la géolocalisation ;
les œuvres précédemment analysées.

Exemple :

Dossier :
New York - Metropolitan Museum

Contexte probable :
Museum = Metropolitan Museum of Art
City = New York
Country = États-Unis

Objectif :

exploiter l'intelligence du système complet et pas uniquement celle du modèle IA.

Je trouve que ces principes résument très bien ce que PhotoCartel est en train de devenir :

Un outil de catalogage fiable (principe de confiance).
Un assistant intelligent (principe de déduction).
Un système enrichi par le contexte (principe de mémoire et de cohérence).

Et si je devais résumer la philosophie du projet en une phrase :

PhotoCartel doit privilégier la qualité documentaire à la quantité d'informations extraites.

C'est ce qui le distinguera d'un simple OCR ou d'un simple chatbot.

6 juin 2026 :

Variante A (la plus simple)
PhotoCartel analyse le cartel.
PhotoCartel propose un nom.
Le nom apparaît dans une zone de texte modifiable.
Tu corriges éventuellement.
Tu cliques sur Enregistrer.
Le fichier est sauvegardé sous ce nom.
Photo
  ↓
Analyse IA
  ↓
Nom proposé
  ↓
Modification éventuelle
  ↓
Enregistrer
Variante B (plus explicite)
PhotoCartel analyse le cartel.
PhotoCartel propose un nom.
Tu cliques sur Valider si le nom te convient.
Tu peux aussi cliquer sur Modifier.
Une fois le nom validé, tu cliques sur Enregistrer.
Photo
  ↓
Analyse IA
  ↓
Nom proposé
  ↓
Modifier / Valider
  ↓
Enregistrer

Pour ton usage, je choisirais sans hésiter la variante A.

Pourquoi ?

Parce que dans 90 % des cas tu vas accepter la proposition telle quelle.

Donc avoir deux boutons (Valider puis Enregistrer) ajoute un clic inutile.

Je verrais plutôt quelque chose comme :

Nom proposé :

[20260515_101215, Henri Matisse, 'Jeune marin (II)', 1906.jpg]

[Enregistrer]

Si le nom te plaît, tu cliques directement.

Si le nom ne te plaît pas, tu modifies le texte puis tu cliques sur Enregistrer.

C'est plus fluide, surtout quand tu seras dans un musée à prendre des dizaines de photos.

Et plus tard, quand on ajoutera le traitement en masse, on pourra avoir un mode différent :

☑ Accepter tous les noms proposés
☐ Vérification manuelle

mais pour le mode actuel « une œuvre à la fois », un simple champ éditable pré-rempli me paraît être la meilleure expérience utilisateur.

Ok pour la variante A

Parfait. Je note que pour PhotoCartel, nous retenons désormais :

Workflow de renommage
Photo de l'œuvre
      ↓
Photo du cartel
      ↓
OCR
      ↓
Analyse IA
      ↓
Nom intelligent proposé
      ↓
Modification éventuelle par l'utilisateur
      ↓
Enregistrer
Format du nom retenu
[timestamp], [prénom nom artiste], '[titre principal]', [date], [complément éventuel].jpg

Exemples :

20260512_111015, Henri Matisse, 'Jeune marin (II)', 1906.jpg
20260515_094532, Kim Hong-do, 'Danse des paysans'.jpg
20260515_101215, An Gyeon, 'Rêve au pays des pêchers en fleurs', XVe siècle.jpg

Et pour le cartel associé :

20260512_111020, Henri Matisse, 'Jeune marin (II)', 1906, cartel.jpg
Dans l'interface

Le nom sera affiché dans un champ éditable :

Nom proposé :

[20260512_111015, Henri Matisse, 'Jeune marin (II)', 1906.jpg]

                 [ Enregistrer ]

Tu peux :

ne rien changer et cliquer sur Enregistrer ;
corriger un artiste ;
raccourcir un titre ;
ajouter un complément ;
corriger une date.

C'est cohérent avec ton usage réel en musée : l'IA travaille, mais tu gardes toujours le dernier mot avant l'écriture du fichier.

Et comme nous venons juste de valider la création automatique des dossiers, la prochaine grande étape est maintenant :

Création du dossier musée      ✅
Choix photo œuvre             ✅
Choix photo cartel            ✅
OCR du cartel                 ✅
Analyse IA du cartel          ✅
Génération du nom intelligent ⏳
Sauvegarde des fichiers       ⏳

C'est là que PhotoCartel commencera réellement à produire des fichiers organisés automatiquement sur ton disque.



[OK] Fin de visite
- création dossier tampon A_EN_COURS_xxxxx
- bascule automatique des nouvelles photos vers ce dossier
- retour au dossier de visite lors d'une nouvelle visite