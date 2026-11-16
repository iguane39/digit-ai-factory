# Retours forges — Produit-82 — 20261112b

- **Contexte** : le porteur refuse la fiche d'accès réécrite le matin même, faute de mots de passe ; run `Produit-82-20261110-version`.
- **Références ledger** : `forge\ledger.jsonl` seq 204
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-12

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## pilot (`digit-ai-factory`)

Le retour complète RT-27 du lot `20261112a` : une fiche d'accès sans valeurs ne permet pas de se connecter.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-28 | majeur | générique | Le 12/11/2026, le porteur refuse la fiche `docs\projet\ACCES-TEST.md` réécrite : « Le fichier doit contenir les logins et mots de passe, sinon, l'utilisateur ne peut pas se connecter. ». R-23 interdit toute valeur dans la fiche versionnée, à raison. Aucune règle ne prévoit le fichier qui porte les valeurs hors de git. Ledger seq 204. **RT-28** : clé proposée `acces-test-sans-valeurs-inutilisable`. | R-23 garde la fiche versionnée sans valeur. Un générateur du socle écrit à côté une fiche locale, ignorée par git, qui porte identifiants, mots de passe, clés et le résultat d'une connexion d'essai par compte. Le déploiement la rafraîchit dans le même tour. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La fiche d'accès ne donnait que le nom de la variable de chaque secret ; le portail local n'avait aucun compte permanent | `Produit-82\scripts\acces_complets.py` écrit `ACCES-COMPLETS.local.md` (motif `*.local.md` au `.gitignore`) ; `--creer-portail-local` crée `demo-admin` avec un mot de passe définitif rangé dans `Produit-82\.env` ; `--verifier` ouvre une session par compte : 10 sur 11, la clé de recette de `client-b` rend 429 (budget de 24 h épuisé) | oui, voir RT-28 | corrigé au produit |

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le générateur ne fait jamais transiter une valeur par la sortie de la session : il lit les 2 fichiers `.env` et écrit la fiche directement, et sa sortie ne donne que les comptes et leur code de réponse.

## Ordre recommandé

1. RT-28 : sans valeurs, la fiche d'accès renvoie le porteur chercher dans 2 fichiers `.env`.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce retour suit une question humaine. La règle qui l'aurait évité : la fiche d'accès donnée à l'humain porte de quoi se connecter, valeurs comprises, dans un fichier local ignoré par git. Classe proposée : **RT-28** : `acces-test-sans-valeurs-inutilisable`, famille `heritage-produit`, libellé « La fiche d'accès ne donne pas les valeurs qui permettent de se connecter ».
