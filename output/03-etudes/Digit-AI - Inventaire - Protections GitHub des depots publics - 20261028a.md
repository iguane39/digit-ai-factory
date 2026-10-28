---
sources:
  - https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection (lu le 2026-10-28)
  - https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning (lu le 2026-10-28)
  - https://docs.github.com/en/code-security/dependabot/dependabot-security-updates/about-dependabot-security-updates (lu le 2026-10-28)
  - https://docs.github.com/en/rest/repos/repos (lu le 2026-10-28)
verifie_le: 2026-10-28
---

# Inventaire — protections GitHub des 14 dépôts publics de la Factory (28/10/2026)

Sur les 14 dépôts publics de la Factory (le pilot et les 13 forges), 8 n'ont ni la détection des
secrets ni le blocage des envois au niveau du dépôt, dont le pilot. Les 6 autres les ont. Aucun
dépôt n'a de règles de dépôt (rulesets), ni les mises à jour de sécurité de Dependabot, ni ses
alertes de vulnérabilité. Seul forge-development protège sa branche principale. Aujourd'hui, une
publication de la Factory n'est donc jugée que par la porte locale du poste qui publie, sauf sur
ces 6 forges. Ce relevé répond à TF-2005, sur décision humaine du 28/10/2026 (« Fais P1 & P2 & A1 & A2 »).

## Relevé

Le relevé est en lecture seule, fait le 28/10/2026 à 10:25 (heure de Paris) par `gh api`, avec
l'identité connectée sur le poste Dell-XPS-16. Une ligne vaut un dépôt. « activé » et « désactivé »
sont les statuts que l'API rend dans `security_and_analysis`. Les alertes de vulnérabilité valent
204 si elles sont activées et 404 sinon. La protection de branche vaut 200 si elle est présente et
404 sinon.

| Dépôt | Détection des secrets | Blocage des envois | Mises à jour de sécurité Dependabot | Alertes de vulnérabilité | Rulesets | Protection de la branche principale |
|---|---|---|---|---|---|---|
| digit-ai-factory | désactivé | désactivé | désactivé | 404 | 0 | 404 |
| digit-ai-forge-conception | désactivé | désactivé | désactivé | 404 | 0 | 404 |
| digit-ai-forge-design | désactivé | désactivé | désactivé | 404 | 0 | 404 |
| digit-ai-forge-development | activé | activé | désactivé | 404 | 0 | 200 |
| digit-ai-forge-tests | désactivé | désactivé | désactivé | 404 | 0 | 404 |
| digit-ai-forge-agents | désactivé | désactivé | désactivé | 404 | 0 | 404 |
| digit-ai-forge-seo-geo | désactivé | désactivé | désactivé | 404 | 0 | 404 |
| digit-ai-forge-organization | désactivé | désactivé | désactivé | 404 | 0 | 404 |
| digit-ai-forge-audit | désactivé | désactivé | désactivé | 404 | 0 | 404 |
| digit-ai-forge-ops | activé | activé | désactivé | 404 | 0 | 404 |
| digit-ai-forge-data | activé | activé | désactivé | 404 | 0 | 404 |
| digit-ai-forge-agents-security | activé | activé | désactivé | 404 | 0 | 404 |
| digit-ai-forge-observability | activé | activé | désactivé | 404 | 0 | 404 |
| digit-ai-forge-websec | activé | activé | désactivé | 404 | 0 | 404 |

Mesuré sur : l'API REST de GitHub, relue à 10:25 le 28/10/2026, périmètre 14 dépôts, tous rendus en 200.

## Documentation lue le 28/10/2026

- **Blocage des envois au niveau du dépôt** : « Is disabled by default, and can be enabled by a
  repository administrator », et il « Blocks pushes containing secrets from reaching specific
  protected repositories ».
- **Blocage des envois au niveau du compte** : il « Is enabled by default », « Stops you from
  pushing secrets to public repositories on GitHub », mais « Does not generate alerts when you
  bypass push protection unless push protection is also enabled at the repository level ». Ce
  réglage du compte n'est pas lisible par l'API de dépôt et n'est pas relevé ici.
- **Détection des secrets** : « Public repositories: Secret scanning runs automatically for free. »
  Le statut « désactivé » rendu par l'API porte sur le réglage du dépôt, qui produit les alertes.

## Limites du relevé

- Les 6 forges protégées ont été activées à une date que l'API ne donne pas.
- Le réglage du blocage au niveau du compte n'est pas mesuré.
- Une règle qui interdirait la réécriture de la branche principale gênerait la remédiation par
  réécriture d'historique déjà employée par la Factory : ce relevé ne la propose pas.

## Rejouer le relevé

Pour chaque dépôt `<d>`, en lecture seule, ces quatre appels :

- `gh api repos/iguane39/<d>`, champ `security_and_analysis` ;
- `gh api -i repos/iguane39/<d>/vulnerability-alerts` ;
- `gh api repos/iguane39/<d>/rulesets` ;
- `gh api -i repos/iguane39/<d>/branches/main/protection`.
