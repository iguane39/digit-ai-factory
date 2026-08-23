---
role: compte rendu de réunion — ce qui a été décidé, ce qui reste ouvert, et qui fait quoi ensuite
sources_de_verite: [décisions prises en séance, journal des décisions du produit, registre pour les items cités]
verifie_le: {AAAA-MM-JJ}
cadence: {par réunion — donnée d'instance}
---

# Compte rendu — {Mission} — réunion du {AAAA-MM-JJ}

**Présents** : {prénom nom (rôle)}, … · **Absents excusés** : {prénom nom} · **Durée** : {N min}

**Ce que ce compte rendu est.** La trace de ce qui a été **décidé**, pas de ce qui a été dit. Un
compte rendu qui relate la discussion oblige son lecteur à refaire l'arbitrage ; celui-ci porte les
décisions, les questions restées ouvertes, et les actions avec leur acteur.

## Décisions prises

Une décision porte celui qui l'a prise. Sans nom, elle se rediscute à la réunion suivante — et
c'est la moitié du temps perdu en réunion de mission longue.

| # | Décision | Prise par | Ce qu'elle tranche | Consignée où |
|---|---|---|---|---|
| {D-01} | {la décision, à l'affirmatif} | {prénom nom} | {la question qu'elle ferme} | {journal des décisions du produit, ADR, registre} |

## Questions restées ouvertes

Une question qui reste ouverte sans date et sans destinataire ne se répondra pas. Les deux
colonnes de droite existent pour cela.

| Question | Ce qui est bloqué sans la réponse | Attendue de | Avant le |
|---|---|---|---|
| {la question, formulée pour qu'on puisse y répondre par a/b/c} | {ce qui s'arrête} | {prénom nom} | {AAAA-MM-JJ} |

## Actions

Le vocabulaire d'acteur est celui de `gabarits\RESTITUTION.md` — `auto_ia`, `manuelle_dev`,
`manuelle_utilisateur` — et **une action confiée à l'humain dit pourquoi l'IA ne peut pas la
faire**. Une action sans acteur n'est pas une action : c'est un souhait.

| Action | Acteur | Pourquoi pas l'IA | Pour le | Si elle n'est pas faite |
|---|---|---|---|---|
| {l'action, au verbe} | {auto_ia \| manuelle_dev \| manuelle_utilisateur} | {acces \| decision \| depense \| presence \| irreversible — vide si auto_ia} | {AAAA-MM-JJ} | {la conséquence, concrète} |

## Ce qui n'est pas jugé par un oracle

La **complétude** de ce compte rendu ne se vérifie pas : un oracle ne sait pas ce qui a été dit en
séance. Ce qui **est** mécanisable — et déjà écrit ailleurs — c'est la FORME des actions : le
vocabulaire d'acteur fermé et la conséquence de non-action sont contrôlés par
`oracles\oracle-synthese.mjs` (règles S12, S19, S21) sur toute restitution. Appliquer ce même
contrôle à ce gabarit est une entrée en file des candidats.
