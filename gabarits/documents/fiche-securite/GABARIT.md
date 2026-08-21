# Gabarit — Fiche sécurité de mise à disposition

> **Famille** `fiche-securite` · catalogue `gd-fiche-securite`
> **Formats** HTML (page autonome, exportable PDF)
> **Règles engagées** D1 D3 D6 D7 (`gabarits\documents\README.md`)
> **Provenance** extrait des douze versions de `Nhood - APR - Fiche Sécurité Mise à
> disposition - Dev` produites entre juillet et août 2026 — la famille la plus rejouée du
> corpus, et celle dont la forme était le moins écrite.

Une fiche sécurité n'est **pas un audit** : elle ne juge pas, elle **déclare**. Son lecteur est
l'exploitant qui doit accepter (ou refuser) de mettre l'application à disposition. Elle tient
sur deux à quatre pages et répond à ce qu'il demandera de toute façon : qu'est-ce qui est
exposé, qui entre, quelles données, quelles dépendances, que se passe-t-il si ça tourne mal.

Le format court est une contrainte, pas un confort : une fiche de dix pages ne se lit pas, et
une fiche qu'on ne lit pas ne protège personne.

---

## Structure — les six blocs sont dus

### 0 · En-tête

```
{Client} · Fiche sécurité — mise à disposition {applicatif} — {environnement} — {AAAAMMJJ<indice>}

> **Établie le** {date} par {qui} · **Vaut pour** {version / commit servi}
> **Nature de la mise à disposition** {interne | partenaire | public}
```

La version servie est due : une fiche qui ne dit pas de quoi elle parle est périmée le jour
du prochain déploiement, sans que personne ne le sache.

### 1 · Exposition

Ce qui est joignable, depuis où. URL, réseaux d'origine autorisés, ports, en-têtes de sécurité
posés (CSP, HSTS), certificat et son échéance.

### 2 · Authentification et autorisation

Qui entre, comment, et **jusqu'où**. Fournisseur d'identité, mode (délégué ou applicatif),
rôles et ce que chacun peut. La **portée de la déconnexion se déclare** — session applicative
seule, session du fournisseur sur cet appareil, ou comptes fédérés : l'omission vaut adoption
du comportement le plus large, et c'est un incident constaté, pas une précaution théorique.

### 3 · Données

Nature, sensibilité, localisation, durée de conservation, chiffrement au repos et en transit,
qui y accède. Une donnée personnelle se nomme comme telle.

### 4 · Dépendances et chaîne d'approvisionnement

Services tiers appelés, bibliothèques à risque connu, résultat du dernier contrôle de
vulnérabilités (outil, date, verdict). Un « à jour » sans date ni outil ne vaut rien.

### 5 · Ce qui se passe si ça tourne mal

Journalisation (quoi, où, combien de temps), supervision et alerte, procédure de retour
arrière, contact d'astreinte, et **ce qui n'est pas couvert**.

### 6 · Points de vigilance déclarés

Les écarts assumés, chacun avec sa raison et sa date de revue. Une fiche sans point de
vigilance est suspecte : elle signifie soit un produit parfait, soit une relecture rapide.

---

## Ce que le gabarit refuse

- **Une affirmation sans preuve datée** : « chiffré », « à jour », « supervisé » sans dire par
  quoi, mesuré quand.
- **Une portée d'identité non tranchée** (bloc 2) — l'omission vaut adoption du plus large.
- **Un bloc 6 vide** sans phrase disant explicitement qu'aucun écart n'est assumé, et qui l'a
  vérifié.
- **Un tableau de dépendances sans repli mobile** (D3), **un texte bridé** (D1).

## Avant de remettre

1. `check_html.py` **et** `render_page.py` (D7) ; le rendu PDF vérifié si la fiche est
   transmise en PDF — c'est le format sous lequel elle circule le plus.
2. Les faits d'exposition (bloc 1) confrontés à une capture réelle : `oracle-exposition.mjs`
   EX-1..EX-11 de forge-websec mesure ce que la fiche déclare. Déclarer sans mesurer est le
   défaut propre à cette famille.
3. Aucun `{…}` restant.
