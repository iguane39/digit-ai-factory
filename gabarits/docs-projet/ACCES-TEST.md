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

Les comptes que le seed de démo crée en local. **Cette fiche nomme des VARIABLES, jamais des
valeurs** (R-23, TF-0871) : chaque colonne porte le nom de la variable de `.env` que le seed lit
et que l'humain renseigne dans son `.env` local (R-13). Une valeur écrite ici est une valeur
versionnée — et, le 06/09, la même valeur s'est retrouvée affichée sur la page de connexion
d'une qualif servie sur Internet, dans un dépôt public : « Démo : admin@demo.local /
demo-admin », retour humain en une minute d'essai. Un identifiant de démonstration n'est pas
un secret fort ; c'est exactement ce qui fait que rien ne s'oppose à sa publication.

| Profil | Identifiant | Mot de passe |
|---|---|---|
| admin | `DEMO_ADMIN_IDENTIFIANT` | `DEMO_ADMIN_MOTDEPASSE` |
| écriture | `DEMO_EDITEUR_IDENTIFIANT` | `DEMO_EDITEUR_MOTDEPASSE` |
| lecture | `DEMO_LECTEUR_IDENTIFIANT` | `DEMO_LECTEUR_MOTDEPASSE` |

### Comptes de la qualif peuplée (§ 3 bis de `ETAPE-MEP.md`, TF-0872)

La qualif ne porte JAMAIS un seul compte peuplé : **un compte peuplé + N comptes vides** (N ≥ 2
par défaut) — sans quoi rien ne montre la première minute d'un client (états vides, onboarding).
Chaque compte est piloté par ses variables, déclarées en NOMS dans `.env.example` :

| Compte | Peuplé ? | Identifiant | Mot de passe |
|---|---|---|---|
| 1 | `DEMO_COMPTE_1_PEUPLE` (= 1) | `DEMO_COMPTE_1_IDENTIFIANT` | `DEMO_COMPTE_1_MOTDEPASSE` |
| 2 | `DEMO_COMPTE_2_PEUPLE` (= 0) | `DEMO_COMPTE_2_IDENTIFIANT` | `DEMO_COMPTE_2_MOTDEPASSE` |
| 3 | `DEMO_COMPTE_3_PEUPLE` (= 0) | `DEMO_COMPTE_3_IDENTIFIANT` | `DEMO_COMPTE_3_MOTDEPASSE` |

Leurs valeurs sont remises à l'humain **par le canal de la mission** — jamais par une page, jamais
par un fichier versionné. Un nombre de comptes vides ramené à 0 se DÉCLARE avec son motif (loi
transverse n° 3), jamais par silence.

**Aucune page servie n'affiche d'identifiant, jamais — pas même sous `MODE_DEMO`.** Le drapeau
borne ce qui EXISTE (les comptes de seed), pas ce qui s'AFFICHE : une qualif est servie sur
Internet comme la production l'est. Ce qu'une page peut dire au plus : « des comptes de
démonstration existent ; leurs identifiants sont remis par le canal de la mission ».

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
