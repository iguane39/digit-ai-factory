# Retours forges — Produit-86 — 20261109a

- **Contexte** : clôture du run `20261106f-jeton-d-acces-au-mandat`, sur la lettre « 481a » du porteur. Le mandat d'une mission client porte désormais le jeton d'accès d'une application derrière Cloudflare Access. Le run a croisé 2 défauts de forge : le capteur de forge-websec, et la critique d'implémentation sur une vérification au champ. Ce lot reprend aussi 3 retours du ledger restés sans lot plus de 24 h (seq 439, 440, 505), signalés à l'ouverture du 09/11.
- **Références ledger** : `forge\ledger.jsonl` seq 718 et 719 (retours du run), seq 439, 440 et 505 (retours antérieurs).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\`.
  Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 09/11/2026

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

## Rattachement

Registre interrogé le 09/11/2026 : `todo/CLASSES.json` du pilot.

- **RP-52** se rattache à `oracle-faux-positif`.
- **RP-54** se rattache à `controle-sans-fixture-double-sens` : l'oracle n'a pas de fixture d'une page servie aux ressources externes.
- **RP-51, RP-53 et RP-55** n'ont pas de classe qui les décrive : chacun propose la sienne au sidecar.

## digit-ai-forge-websec

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-51 | majeur | générique | `capturer.mjs` annonce caviarder les porteurs de jeton (TF-2107, TF-2133). Il a pourtant laissé en clair, dans l'en-tête `Location` d'une redirection Cloudflare Access, le paramètre `meta` (un JWT de 684 caractères), ainsi que la signature du point de rapport (`Report-To`). La capture commitée par le produit le 06/11 a été prise par son balayage de secrets (E-082) : 5 valeurs, de 40 à 684 caractères. Ledger seq 719. | Caviarder tout paramètre de requête des URL portées par un en-tête, et pas seulement ceux d'une forme de jeton connue. |

## digit-ai-forge-design

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-52 | majeur | générique | `oracle-erreurs-formulaire` refuse toute requête POST pendant l'épreuve, y compris la vérification au champ, qui n'écrit rien (`POST /missions/<id>/mandat/verifier`, la forme « saisie-erreur » décrite au `DESIGN.md` du produit). Le champ fautif ne reçoit jamais la réponse du serveur, et l'oracle rend EF1 et EF4 sur un formulaire conforme : 6 constats le 09/11 à 14:24, et le même FAIL le 05/11 (seq 588). Sans oracle, sur la page servie, « 0 » et « pas-un-courriel » passent bien le champ en `aria-invalid`, avec leur message dessous. Ledger seq 717 et 718. | Laisser passer une requête déclarée sans effet (attribut `data-verifier` du formulaire, ou chemin en `/verifier`) et n'intercepter que l'envoi du formulaire. |
| RP-54 | majeur | générique | `run-oracles-design` sur une page capturée d'une instance servie : les oracles statiques (bascule, surcouche) ne lisent ni CSS ni JS externes et rendent FAIL. `render_page` rend une copie temporaire, où les liens relatifs ne mènent plus nulle part : un débordement factice de 737 px à 390 px est apparu le 06/11. Il a fallu intégrer styles et scripts à la page (`forge/etapes/design/rendus-premier-job-client/incorporer.py`). Retour d'origine du 04/11 : ledger seq 440 (4 écrans sur 4 en FAIL, puis 15/15 après intégration). | Un capteur de forge-design qui produise la page autonome, ressources intégrées, à partir d'une URL et d'un état de connexion. |

## digit-ai-forge-ops

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-53 | majeur | générique | Le test de mise en production jouait un arrêt de mission en dernier. Le socle posait alors le verrou global de la passerelle, et l'instance restait en NO_EXTERNAL_AI pour toutes les missions jusqu'au redémarrage suivant. Aucun contrôle ne relisait la santé après ce test. Mesure du 04/11 à 16:50 sur `40a040e` : E-119, E-116 et E-125 en FAIL au second passage. Ledger seq 439. | Le gabarit de test de mise en production de forge-ops relit `/healthz` à la fin, et échoue si l'état servi diffère de celui d'avant. |

## pilot

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-55 | mineur | générique | La règle S13 d'`oracle-synthese` ne compte pas une adresse http(s) nue comme localisateur, alors que S92 exige cette adresse au bloc 8 pour une action `manuelle_utilisateur`. Une action « ouvrir https://127.0.0.1:8443, écran X » est ainsi accusée de n'avoir ni chemin ni libellé d'écran. Mesure du 05/11 à 13:55. Ledger seq 505. | Compter une adresse http ou https comme localisateur dans `_LOCALISATEURS`. |

## La règle qui aurait évité le retour

- `caviardage-par-liste-de-formes` (RP-51, classe proposée) : un caviardage qui n'efface que les formes de jeton qu'il connaît laisse passer la suivante ; caviarder par position (paramètre d'URL d'en-tête), pas par forme.
- `oracle-faux-positif` (RP-52) : un oracle se valide sur une fixture conforme qui porte la forme recommandée par sa propre forge.
- `etat-servi-non-relu-apres-epreuve` (RP-53, classe proposée) : une épreuve qui change l'état de l'instance servie relit cet état à sa fin.
- `controle-sans-fixture-double-sens` (RP-54) : l'oracle n'a pas de fixture « page servie aux ressources externes ».
- `localisateur-trop-etroit` (RP-55, classe proposée) : deux règles du même socle ne doivent pas se contredire sur ce qui localise une action.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le portail refusait toute écriture d'un mandat signé, alors que sa page invitait à en rédiger une nouvelle version | geste « Rédiger une nouvelle version » (E-130, commit `6146de2`) | non : propre au produit | reste au produit, parce que c'est son code |
| Le premier contrôle du secret aurait refusé tout jeton créé depuis le 26/08/2026 (format « cfast_ ») | forme relue dans la documentation de Cloudflare Access le 06/11, test ajouté (`58326d9`) | oui : une forme d'identifiant tiers écrite de mémoire | rattaché à la classe existante « parcours d'interface tierce écrit de mémoire » ; reste au produit, parce que la règle existe déjà |
| Le port 8014 était tenu par une autre instance : comptes et sessions écrits sur une instance dont la version était inconnue | forge_tests rejoué sur le port 8024, serveur vu au démarrage | non : geste de session | reste au produit, parce que c'est une erreur de session, corrigée dans le tour |
| Le ledger refuse désormais le type `anomalie_produit`, accepté le 06/11 (seq 657 à 660) | défauts portés au champ `defauts_trouves_et_corriges` du `run_close` | à confirmer : changement de contrat du ledger | reste au produit, parce que le contrat du ledger se lit au pilot (CONTRAT-INTERFACE.md §3) |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Dashboard tests (`output/Produit-86 - Dashboard tests - <date><indice>.html`) | copies datées, une par audit | reste au produit, parce que c'est la copie datée que forge-tests dépose à chaque audit ; sa forme appartient à la forge (déjà déclaré aux lots 20261103a à 20261106e) |

## Défauts du poste relevés à l'ouverture

Relevés par l'ouverture du 09/11, hors du périmètre du produit, et non corrigés depuis lui (TF-1657) :

- **le poste n'est pas prêt** : le pilot porte 41 modifications non enregistrées, dont un fichier de 7 jours ;
- **le canal confidentiel est en échec** : `oracle-confidentiel`, règle K1, l'hébergeur ne répond pas ;
- **un fichier `null` de 18 octets** est à la racine du parc, écrit par une redirection Windows.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.

## Confirmations positives

- La lecture de la documentation de Cloudflare Access, avant tout essai, a trouvé le format « cfast_ » que le premier contrôle aurait refusé.
- Le test de mise en production a refusé le déploiement qui n'avait pas de contrôle pour une exigence d'impact 5 (E-129).
- Le balayage des secrets du produit (E-082) a pris la capture que le capteur de forge-websec n'avait pas caviardée.
