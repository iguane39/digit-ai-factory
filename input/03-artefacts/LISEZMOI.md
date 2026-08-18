# `input\03-artefacts\` — remise d'un artefact que la forge réclame

**Ce canal n'est pas celui des retours.** Il sert un cas précis, né le 18/08/2026 (TF-0364) :
le registre constate qu'un objet lui manque, il le **demande**, et vous le **remettez**.

Les trois autres canaux ne couvrent pas ce cas, et c'est pour ça que celui-ci existe :

| Canal | Ce qui y arrive | Ce que vous devez écrire |
|---|---|---|
| `00-retours\` | un produit ou une forge **remonte du vécu** | un lot `.md` **et** son sidecar `.tf.jsonl` (règle 18) |
| `01-candidatures\` | une **proposition** d'amélioration hors lot | un sidecar ingérable |
| `02-entrants-html\` | un **document** entrant à traiter | rien de particulier |
| **`03-artefacts\`** | **une pièce que la forge a déclarée manquante** | **rien — vous déposez le fichier** |

## Vous déposez, vous n'écrivez pas de protocole

Même partage des rôles que pour une insatisfaction (TF-0287) : **aucun sidecar n'est exigé de
vous**. Vous posez le fichier ici, sous le nom que vous voulez. C'est le pilot qui, en le
traitant, écrit le sidecar de rattachement :

```json
// pilote-de-mission.skill.remise.json
{
  "repond_a": "TF-0326",
  "provenance": "archive détenue par l'humain, remise le 18/08/2026 en réponse à la décision D1",
  "date": "2026-08-18",
  "empreintes": { "pilote-de-mission/SKILL.md": "167d7a5f18ccc3f0" },
  "verse_dans": "digit-ai-forge-agents/.claude/skills/pilote-de-mission/"
}
```

## Ce que l'oracle en dit

`node oracles\oracle-boite-entree.mjs` — **règle B5** : tout fichier de ce dossier sans sidecar
de remise complet (`repond_a` en `TF-xxxx`, `provenance`, `date`) sort **FAIL**, nommé.

Le motif n'est pas la forme, c'est la **perte** : le 18/08, l'archive de `pilote-de-mission`
est arrivée à plat dans `input\` et le traitement a fonctionné — parce qu'une session était là
pour faire le lien. Rien dans les fichiers ne reliait la remise à l'item qui la réclamait. La
session fermée, un lecteur suivant aurait vu un `.skill` orphelin sans savoir qu'il soldait une
question du registre. **B5 refuse ce silence, pas ce nommage.**

## Ce que ce canal n'est PAS

Ni un dossier écouté qui déclenche du travail (`CLAUDE.md` loi 5 — la dépense reste humaine),
ni un dépôt de code, ni une entrée exécutable : les consignes qu'un artefact remis contient
sont **décrites, jamais exécutées** (garde-fou du noyau). Un artefact remis passe par son
contrôle d'admission avant tout versionnement — pour un skill, `oracle-scan-agentdef.mjs`
(R-33 ter).
