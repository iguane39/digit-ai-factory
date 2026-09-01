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

Les rôles applicatifs que les tests doivent pouvoir incarner, chacun avec ses droits et le
parcours qu'il sert à éprouver.

| Profil | Droits | Usage en test |
|---|---|---|
| admin | {tout : gestion utilisateurs, config} | parcours d'administration |
| écriture | {CRUD sur {objets métier}} | parcours nominal |
| lecture | {consultation seule} | contrôles d'autorisation |

## Comptes de démo (locale uniquement — seed `MODE_DEMO`)

Les comptes que le seed de démo crée en local — identifiants volontairement triviaux et
notoires, qui n'existent dans aucun environnement réel.

| Profil | Identifiant | Mot de passe (trivial, notoire) |
|---|---|---|
| admin | {admin@demo.local} | {demo-admin} |
| écriture | {editeur@demo.local} | {demo-editeur} |
| lecture | {lecteur@demo.local} | {demo-lecteur} |

## Accès d'environnements réels (références, jamais de valeurs)

La ligne **déploiement** est OBLIGATOIRE (TF-0735) : le principe de connexion à l'hébergeur a
été reperdu DEUX FOIS sur le même produit à quinze jours d'écart — la seconde fois, une session
a déclaré « déploiement bloqué, geste humain requis » pendant que trois jetons valides vivaient
sur le poste, documentés chacun dans le dépôt d'un AUTRE produit. Un principe qui ne vit que
dans la mémoire des sessions se reperd à chaque session ; cette ligne est l'artefact qui le
retient. Pour Railway : `RAILWAY_API_TOKEN` en variable d'environnement — le CLI l'honore SANS
aucun `railway login`, qui ne se prescrit jamais en session agent (parcours OAuth navigateur).

| Environnement | Mécanisme |
|---|---|
| staging | `{VAR_ADMIN_STAGING}` dans `.env` — `# à fournir :` |
| production | coffre / gestionnaire de secrets de l'hébergeur — hors dépôt, hors forge |
| **déploiement** | `{RAILWAY_API_TOKEN en variable d'environnement — jeton lisible à <emplacement sur le poste, ex. .env d'un produit nommé> ; jamais `railway login` en session agent}` |
