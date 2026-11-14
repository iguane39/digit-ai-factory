# Gabarit — Dossier de compétences anonyme (CV d'un intervenant)

**Famille** `gd-dossier-competences-anonyme` · **Version du gabarit** 1.0.0 · **Écrite le** 10/11/2026

> **Formats** Markdown (la page HTML et le PDF de 2 pages A4 se tirent de ce gabarit chez le produit qui remet le document)
> **Règles engagées** D6 D8 D9 D11 (`gabarits\documents\README.md`), G4 par la balise meta (TF-2338)
> **Provenance** le gabarit de CV anonyme du produit marketing de l'écosystème (« le produit marketing »),
> écrit les 11 et 12/09/2026 en cinq versions, de 1.0.0 à 2.3.0, puis complété le 28/09/2026 par deux
> conventions de durée que sa propre règle ne disait pas. Le type « CV » est admis au registre des types
> depuis le 11/09/2026 (décision D-5 (a)) ; aucune famille du catalogue ne le couvrait, le retour du produit
> l'a dit le 11 et le 12/09 (lot RETOURS - 20261109c du produit marketing, TF-2337). La forme est reprise,
> jamais la matière : l'instance est fictive et son trigramme est `XXX`.

## La règle qui commande toutes les autres

**Un dossier de compétences se lit en moins d'une minute pour répondre à une question : cet intervenant
convient-il à la mission ? Il y répond sans que la personne soit identifiable.** Ni nom, ni coordonnées, ni rien
qui date ou localise l'individu au-delà de ce que la mission exige. *Un dossier qui se lit en balayage sans
trouver les mots-clés de la mission est un dossier qu'on ne rappelle pas ; un dossier qui nomme l'employeur et
les dates ré-identifie la personne en un clic.*

## Quand l'employer

Remettre à un décideur ou à un responsable technique, client ou prospect, le profil d'un intervenant en
amont d'un entretien ou comme pièce d'une proposition. La mise en relation reste un geste de Digit-AI, hors
du document.

Le livrable se nomme `<Marque> - CV <trigramme> - AAAAMMJJ<indice>.<ext>` : « CV » est au registre des types
(R-25), et le trigramme est le seul objet du nom (jamais « CV anonyme » : la locution n'apparaît ni dans le nom
ni dans le fichier). L'indice se tire de `scripts\allouer-indice.mjs` du pilot.

## Structure — trois chapitres, dans cet ordre

Le document tient en 2 pages A4 au plus avec quatre à cinq expériences.

1. **En-tête** : l'intitulé du poste, réduit aux trois domaines qui servent la mission ; une ligne de faits
   (expérience cumulée, statut, zone, disponibilité) ; un résumé de trois à quatre phrases, à la troisième
   personne ; les missions visées. Le **trigramme** remplace le nom, en haut à droite du bandeau, sans glose.
2. **Compétences** : quatre à six domaines, chacun avec ses étiquettes (nom de technologie ou de pratique, 2
   à 4 mots) ; les technologies maîtrisées en gras. Aucun barème (étoiles, notes, pourcentages).
3. **Expériences** : de la plus récente à la plus ancienne, un article par expérience. Poste conservé tel quel ;
   secteur et nature de l'organisation, région ; période au mois près ; durée calculée (§ Durées) ; ligne
   **Environnement** qui reprend les noms du chapitre Compétences ; trois à cinq faits d'action, chacun un verbe
   ou un nom d'action avec son objet et son moyen. Un résultat chiffré n'entre qu'avec sa source.
4. **Formation** : une ligne par diplôme (intitulé, niveau glosé « bac + 5 », discipline, établissement), **sans
   année**. Certifications professionnelles admises avec leur organisme, sans date d'obtention.

Le document se termine sur la formation : **aucun pied de page**. Ni ligne d'anonymisation, ni date
d'établissement, ni mise en relation, ni mention d'outil ou d'assistance IA. Ce que ces lignes portaient vit
dans ce gabarit et dans le journal d'oracles de l'instance.

## Anonymisation — la liste fermée

Une ligne vaut un élément du profil source ; le traitement est l'un de trois verbes : *retiré*, *conservé*,
*transformé*.

| Élément | Traitement | Pourquoi |
|---|---|---|
| nom, prénom, initiales, photo | retiré | c'est l'objet même du document |
| courriel, téléphone, adresse, liens de profil | retiré | une coordonnée ré-identifie en un clic |
| date de naissance, âge, nationalité, situation familiale, permis | retiré | critères sans rapport avec la mission, sources de discrimination |
| année d'obtention des diplômes | retiré | date la personne sans rien dire de sa compétence |
| ville de résidence | transformé en région ou métropole | la zone sert la mission, l'adresse ne sert que la ré-identification |
| nom des employeurs et des clients | transformé en secteur et nature de l'organisation | la chaîne employeurs et dates ré-identifie ; le secteur suffit à juger la pertinence |
| lieu de chaque expérience | transformé en région | même raison |
| intitulés de poste, périodes, durées, faits d'action, technologies | conservé | c'est ce que le lecteur évalue |
| noms de personnes citées | retiré | ré-identifient par rebond |
| noms de projets internes, noms de code | transformé en description fonctionnelle | ré-identifient l'employeur |
| résultats chiffrés | conservé si sourcé, sinon retiré | un chiffre a une source |

**Le contrôle** : avant remise, le texte passe la table des noms interdits du canal confidentiel (consommée,
jamais copiée) et la recherche de données personnelles de la source (courriel, lien de profil), puis une
lecture humaine qui cherche ce qu'aucune table ne porte.

## Durées — trois conventions, une par forme de période

Une durée se **calcule** à partir des dates ; elle ne se recopie jamais du profil source.

1. **Période datée au mois — mois inclusifs.** Le mois de début et le mois de fin comptent tous deux ; une
   expérience en cours se compte jusqu'au mois de la date d'établissement. Février à juin d'une même année =
   5 mois ; janvier 2012 à octobre 2021 = 118 mois = 9 ans et 10 mois.
2. **Période datée à l'année seulement (« 2015 - 2021 »).** La durée est la différence des années (6 ans),
   jamais l'inclusion de janvier à janvier, qui ajouterait un mois que la source ne dit pas. Le document n'affiche
   alors aucun mois pour cette période, et l'expérience cumulée est la somme des durées, arrondie à l'année dès
   qu'une période est datée à l'année seule.
3. **Période dont la fin précède le début (« 10/2011 à 01/2011 »).** Elle n'est jamais corrigée en silence. Deux
   issues : l'hypothèse la seule compatible avec les expériences voisines est **déclarée dans le journal** de
   l'instance et soumise à l'intervenant avant la remise ; ou la période se date à l'année seule (convention 2).

L'expérience cumulée est la somme des durées, sans dédoublonner les chevauchements ; s'il y en a, le dire dans
le résumé.

## Le couple gabarit et version vit en métadonnée

Le porteur refuse toute mention de gabarit ou d'outil dans le rendu d'un document remis à un tiers à propos d'une
personne. Le couple se pose donc dans une balise que le rendu n'affiche pas, en tête du fichier :

```
<meta name="digit-ai:gabarit" content="gabarit : gd-dossier-competences-anonyme · version du gabarit 1.0.0">
```

La règle G4 d'`oracle-gabarits-documents` l'admet pour cette famille parce que le catalogue y déclare
`couple_en_meta: true` (TF-2338) ; pour toute autre famille, le couple se rend dans la page. Le couple se retrouve
dans le journal d'oracles de l'instance : c'est là que la section R-46 des lots de retours le lit.

## Le lecteur se déclare

Le lecteur d'un dossier de compétences est un client : un en-tête d'auteur que le fichier montre à l'ouverture
serait vu de lui. Le lecteur se déclare donc hors de ce que le rendu montre (TF-2346), en commentaire HTML en
tête du fichier :

```
<!-- role_destinataire : {qui décide, chez le client, si l'intervenant convient à la mission} -->
```

ou dans un fichier `<document>.lecteur.json` posé à côté, `{ "lecteur": "…" }`. Une déclaration en en-tête YAML
reste lue, pour un usage interne.

## Avant de remettre

1. Aucun nom, prénom, courriel, adresse ni lien de profil ; aucune année de diplôme.
2. Chaque durée est calculée selon la convention de sa forme de période ; la cumulée est la somme.
3. Trois chapitres et un en-tête ; aucun pied de page ; aucune mention de gabarit dans le rendu.
4. Le trigramme est attribué par Digit-AI, unique, jamais réattribué, stable d'une version à l'autre.
5. Aucun `{…}` restant.

## Document d'auteur — ce qui ne va pas au lecteur

La table de correspondance entre le trigramme, l'identité et la source, l'empreinte de la source, les hypothèses
de durée déclarées, le journal des oracles et l'historique des versions du gabarit vivent dans le journal de
l'instance et chez Digit-AI, jamais dans le dossier remis. Ce qui change ce que le lecteur fait reste chez lui ;
ce qui ne change que le travail de l'auteur part au document d'auteur (D11).

## Oracles

`oracle-gabarits-documents.mjs` (G1, G2, G4 par la balise meta, G10, G13) ; `oracle-ecriture.mjs` sur le texte ;
`oracle-nom-client-publie` avant toute remise hors du poste.

## Limites du jugement

Aucun oracle ne juge l'exactitude du profil, ni qu'un employeur est bien devenu un secteur sans indice de
ré-identification : la lecture humaine reste due. La page HTML et le PDF ne sont pas jugés ici.

## Boucle de retour

Un lecteur qui trouve un manque dans une instance le remonte avec le couple `gd-dossier-competences-anonyme ·
1.0.0` lu dans la balise meta ou dans le journal. Ce qui a été ajouté à la main hors gabarit est le signal le plus
fort : c'est une section que le gabarit devrait porter.
