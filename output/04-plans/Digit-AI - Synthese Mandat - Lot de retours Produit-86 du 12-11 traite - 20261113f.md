---
destinataire: humain
---

# Synthèse Mandat — lot de retours Produit-86 du 12/11 traité, oracle-dast 0.3.0, 13/11/2026

## 0. Synthèse d'ouverture

Le lot 3 de Produit-86 n'est plus bloqué côté Factory. L'outil de scan dynamique de forge-websec lance maintenant ZAP sous Windows, et son délai suit le débit que le mandat du produit impose. Le lot du 12/11 est entré au registre, et ses 2 sujets sont clos. La correction est publiée sur le dépôt de forge-websec, prouvée au banc et par un vrai balayage sous Docker, 16 contrôles sur 16. Reste chez Produit-86 : reprendre la forge et rejouer ses sondes. La page protégée par l'accès Cloudflare reste exclue, pour une raison propre au produit.

## 1. En-tête d'identification

Mandat : action A-17, « Ouvrir une session dans le pilot de la Factory pour traiter le lot de retours de Produit-86 du 12/11 », sur votre « Fais cet élément demandé ». Sur le pilot `digit-ai-factory` (55081477 au moment du relevé) et la forge `digit-ai-forge-websec` (4848385 au départ). Période : 13/11/2026, de 11:09 à 12:00, heure de Paris (UTC+01:00). Session pilote Claude Opus 5.5, aucun agent.

Intention de la demande : que les sondes actives du lot 3 de Produit-86 puissent partir de son poste Windows, en corrigeant l'outil de la Factory plutôt qu'en le contournant chez le produit.

Test rétro : le résultat sert cette intention ; la forme que l'oracle prescrit sous Windows part, et un balayage au débit du mandat n'est plus coupé à 30 min.

## 2. Verdict en une ligne

Lot accueilli et ingéré, 2 défauts d'`oracle-dast` corrigés en 0.3.0 avec leurs cas rouges et verts, publiés sur `origin/main` de forge-websec.

## 3. Décisions attendues

Rien n'attend de décision ; aucune action bloquante ne reste à la Factory pour ce lot.

## 4. Traité

**Le lot, du sas au registre**
- Le lot `Produit-86 - RETOURS - 20261112h` est accueilli seul, sous le nom `Produit-86 - RETOURS - 20261112h` ; les 56 autres lots présents au sas à 11:11 n'ont pas bougé.
  - preuve : `accueillir()` appelé sur un sas temporaire ne contenant que ce lot ; nom et contenu réécrits, aucun indice h déjà pris chez Produit-86.
- Ses 2 retours sont ingérés en candidats : TF-2485 sur `zap.bat`, né du RP-70 (retour n° 70 de Produit-86), et TF-2486 sur le délai de 30 min, né du RP-71 (retour n° 71 de Produit-86). L'ingestion les marque en récidive de la classe `oracle-chemin-prescrit-inoperant-sur-sa-cible`, close 25 fois.
  - preuve : `ingerer-lot.mjs`, sortie 0, lot 7aea15a572e2.

**RP-70 : `zap.bat` ne partait pas sous Windows (TF-2485)**
- Défaut reproduit sur ce poste, Node v24.16.0, avec un vrai `zap.bat` qui enveloppe le ZAP simulé : SKIP « lancé mais aucun rapport exploitable produit : sortie vide ».
  - preuve : même message que celui relevé chez Produit-86.
- `zap.bat` passe maintenant par `cmd.exe /d /v:off /s /c`, chaque argument entre guillemets. Un argument qui porte `"` ou `%` rend un SKIP nommé, sans rien lancer. ZAP natif tourne dans son propre dossier, avec `-dir` vers un dossier jetable. Un lancement refusé dit son code d'erreur.
  - preuve : le même `zap.bat` rend PASS, et l'en-tête avec espace et apostrophe arrive intact, comme les expressions avec `^ ( ) $`.

**RP-71 : délai fixe de 30 min (TF-2486)**
- Le délai se lit dans le mandat (`duree_max_minutes`) ou se déduit du débit : 1000 requêtes, ou `plafond_requetes`, plus 5 min de démarrage, au moins 30 min. Il reste borné par la fin de la fenêtre. Au débit de Produit-86, 10 requêtes par minute, il vaut 105 min au lieu de 30.
  - preuve : cas verts du self-test, 105, 305 et 240 min, et une fenêtre de 10 min qui borne le délai.
- Un délai dépassé arrête l'arbre de processus entier et retire le conteneur Docker. Avant, sous Windows, seul `cmd.exe` serait mort, et java aurait continué le balayage au-delà du délai autorisé.
  - preuve : le ZAP simulé, lancé par `zap.bat`, n'écrit jamais son marqueur de fin ; l'oracle rend SKIP `DAST-DELAI` en 2,8 s.

**Bancs et publication**
- Self-test de forge-websec : 253 PASS, 0 FAIL, contre 236 PASS avant ; 17 contrôles neufs, 10 rouges et 7 verts. La barrière TF-2460 a exigé de relire `referentiels/wstg-cas.md`, passé en 0.2.2 avec un paragraphe sur le délai.
  - preuve : `node oracles/self-test.mjs`, sortie 0.
- Preuve réelle rejouée après la correction, avec l'image Docker de ZAP 2.17.0 contre la cible de fixture locale : 16 assertions sur 16 ; 634 sondes actives en mode actif, aucune en passif, débit tenu à 9 requêtes par seconde sous une borne de 10.
  - preuve : `scripts/preuve-dast-actif.mjs`, sortie 0 ; aucun conteneur `websec-zap` restant.
- forge-websec : commit 2e663e3 publié sous le feu vert permanent des forges.
  - preuve : `git rev-list --left-right --count HEAD...origin/main` rend 0 0.
- Registre : TF-2485 et TF-2486 décidés puis clos en « corrige » sur leurs cas rouge puis vert, classe `oracle-chemin-prescrit-inoperant-sur-sa-cible`, avec leurs gains, leur descente et leur barrière.
  - preuve : `journaliser.mjs`, 6 événements, `oracle-todo` PASS avant et après ; le cas `zap.bat` réel rendait SKIP avant la correction et PASS après.

Relecture d'intention : sans objet, motif : aucun agent n'a reçu de consigne dans ce tour.

## 5. Non traité

- Les 6 autres lots de Produit-86 au sas, du 12/11 (c à g) et du 13/11 (a) — motif : hors_mandat ; A-17 nomme le lot du lancement de ZAP et du délai, et ces lots portent d'autres sujets (RP-65 à RP-69, RP-72).
- Les 52 lots des autres produits au sas, comptés à 12:01 — motif : hors_mandat ; `oracle-boite-entree` rend FAIL sur B9, le plus ancien attend depuis 26 h.
- La page derrière l'accès Cloudflare, qui exige 2 en-têtes — motif : décision du produit ; Produit-86 l'a gardée chez lui comme un réglage à demander entre produits.
- La ligne de statut du lot chez Produit-86, encore « a_remettre » — motif : hors_mandat ; le pilot n'écrit pas chez un produit sans mandat.

## 6. Écarts à la lettre

L'action A-17 vous demandait d'ouvrir une session au pilot et d'y prioriser le lot. La session était déjà ouverte au pilot : j'ai lu « Fais cet élément demandé » comme la décision de traiter le lot, et j'ai corrigé forge-websec sous le mandat permanent d'écriture des forges.

## 7. Risques

- Le vrai ZAP natif n'a jamais tourné sur ce poste, seulement la voie Docker et un ZAP simulé derrière un vrai `zap.bat`.
  - signal : un SKIP `DAST-SKIP` ou `DAST-LANCEMENT` au premier balayage de Produit-86.
  - parade : son message dit maintenant la cause ; le lot suivant du produit la remontera.
- Une cible plus vaste que 1000 requêtes au débit du mandat serait coupée avant son rapport.
  - signal : SKIP `DAST-DELAI` chez le produit.
  - parade : `duree_max_minutes` ou `plafond_requetes` dans son fichier d'autorisation, que le message nomme.

## 8. Prochaines actions

Une seule action reste, donc aucun ordre à choisir ; elle revient au produit, qui doit reprendre la forge avant de rejouer.

| Sélecteur | Item | Action | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | TF-2485, TF-2486 | Ouvrir une session chez Produit-86, reprendre forge-websec en 0.3.0 et rejouer les sondes actives du lot 3 | manuelle_utilisateur | decision : le pilot n'écrit pas chez un produit sans votre mandat, et un balayage actif réclame votre autorisation écrite | `node bootstrap.mjs --pull` au pilot, puis l'oracle avec `--mode actif` chez le produit | si on ne le fait pas : le lot 3 reste non joué, bien que l'outil soit réparé |

## 9. Traces

- Correctif : `digit-ai-forge-websec/oracles/oracle-dast.mjs`, `oracles/self-test.mjs`, `fixtures/dast/zap-simule.mjs`, `README.md`, `CHANGELOG.md`, `referentiels/wstg-cas.md`.
- Lot : `input/00-retours/Produit-86 - RETOURS - 20261112h.md` et son sidecar.
- Registre : `todo/TODO.jsonl`, TF-2485 et TF-2486.
