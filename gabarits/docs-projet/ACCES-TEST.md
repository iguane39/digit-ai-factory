---
role: profils d'accès et comptes de démonstration LOCALE (R-20/R-23)
destinataire: humain
sources_de_verite: ["script de seed (MODE_DEMO)", ".env.example (références # à fournir :)"]
verifie_le: {AAAA-MM-JJ}
drapeau_demo: MODE_DEMO
---

# Accès de test — {Produit}

> **comptes de démonstration locale — jamais valides hors MODE_DEMO**
> Créés par le script de seed uniquement quand `MODE_DEMO=1` (absent par défaut — loi 2 :
> la production ne montre jamais de données de démo). Aucun secret réel ici, jamais (R-14) :
> tout accès staging/production est une référence `# à fournir :` dans `.env.example`
> (R-15 → `non_testables[]`).

## Profils (rôles et droits)

| Profil | Droits | Usage en test |
|---|---|---|
| admin | {tout : gestion utilisateurs, config} | parcours d'administration |
| écriture | {CRUD sur {objets métier}} | parcours nominal |
| lecture | {consultation seule} | contrôles d'autorisation |

## Comptes de démo (locale uniquement — seed `MODE_DEMO`)

| Profil | Identifiant | Mot de passe (trivial, notoire) |
|---|---|---|
| admin | {admin@demo.local} | {demo-admin} |
| écriture | {editeur@demo.local} | {demo-editeur} |
| lecture | {lecteur@demo.local} | {demo-lecteur} |

## Accès d'environnements réels (références, jamais de valeurs)

| Environnement | Mécanisme |
|---|---|
| staging | `{VAR_ADMIN_STAGING}` dans `.env` — `# à fournir :` |
| production | coffre / gestionnaire de secrets de l'hébergeur — hors dépôt, hors forge |
