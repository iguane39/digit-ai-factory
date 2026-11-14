<!-- provenance : agent redacteur · consigne de campagne O, sujet 1, suite de D-137 (a) · verdict oracle-ecriture : PASS (2e passe, après correction de EC-8 sur un titre et un en-tête de colonne) · hypothèses non résolues : voir la dernière section -->

# Note — Harvey comparé à digit-ai-prospection

Note du 02/11/2026, écrite pour le porteur de la Factory. Harvey est un agent de prospection open source, dépôt `ethanplusai/harvey`, cloné sans exécution à la révision `6b6a23a` du 01/11/2026 (22:55, UTC-5). Il est comparé à `A0-REFERENTIEL.md`, `A-DECOUPAGE.md` et `README.md` de `C:\dev\digit-ai-prospection`.

## Trois reprises à réécrire, rien à installer

Rien n'est à installer et Harvey ne remplace pas `digit-ai-prospection`. Il vaut pour 3 idées de son code, à réécrire chez nous : un contrôle déterministe des brouillons avant l'associé, un balisage des textes venus du web avec un contrôle des liens en sortie, et une comparaison de la liste d'exclusion qui ne laisse rien passer. Aucune ne demande de décision de votre part. Le reste de Harvey contredit un garde-fou du produit ou répond à un besoin américain que nous n'avons pas.

Le gain de vitesse annoncé vient de l'envoi automatique (mode « autopilot » : les courriels partent sans approbation). Le `CLAUDE.md` du produit l'interdit : « Aucun envoi vers l'extérieur sans la validation explicite d'un associé » (ligne 66). L'attente du run depuis le 28/09 est une validation d'associé, pas un manque de code.

## Licence

Le dépôt est sous licence MIT (`LICENSE`, et `pyproject.toml` ligne 11). Copier du code impose de garder l'avis de copyright et le texte de la licence dans le fichier concerné. Réécrire l'idée dans un autre langage n'impose rien. Les 3 reprises ci-dessous sont des réécritures en Node ; si un jour une expression régulière est recopiée telle quelle, l'avis suit.

## Ce qui vaut d'être repris

| # | Point | Source dans Harvey | Apport au produit |
|---|---|---|---|
| 1 | Contrôle déterministe avant l'associé | `harvey/gate.py`, `pre_send_check`, lignes 170-243 | Objet et corps bornés, balises `{{x}}` non remplacées, 1 lien au plus, pas de HTML, phrases interdites, adresse du destinataire valide. Le code bloque et écrit la raison. |
| 2 | Texte du web balisé, puis liens contrôlés en sortie | `harvey/untrusted.py` lignes 15-39 ; `harvey/gate.py`, `autopilot_review`, lignes 442-470 | `fence` enferme le texte tiers dans un bloc qu'il ne peut pas refermer (normalisation Unicode, caractères invisibles retirés). `autopilot_review` retient un courriel qui pointe vers un domaine qui n'est pas le vôtre ou qui cite 12 mots d'affilée des instructions. |
| 3 | Comparaison à la liste d'exclusion | `harvey/gate.py` lignes 50-167 ; `tests/test_do_not_contact.py` (348 lignes) | Une entrée collée comme `https://www.x.example/a` est ramenée à son domaine. La comparaison s'arrête à la frontière d'étiquette : `acme.example` couvre `mail.acme.example` mais pas `notacme.example`. Une entrée illisible lève une erreur au lieu de ne rien couvrir. |
| 4 | Appel du modèle sans outil ni réglage du poste | `harvey/claude_runtime.py` lignes 47-55, 159-189, 240-268 | Chaque appel `claude -p` tourne avec `--safe-mode`, `--tools ""`, `--setting-sources ""`, `--no-session-persistence`. Harvey lit `claude --help` et refuse d'envoyer un prompt si un drapeau manque. |

**Pourquoi le point 1 est le premier.** `A-DECOUPAGE.md` (ligne 37) confie les 22 exigences de `A0-REFERENTIEL.md` à un agent recetteur, un modèle `sonnet` qui ne sait que lire des fichiers. Or E-017 (200 caractères au plus), E-019 (aucun montant en euros), E-022, E-023 et E-024 (nom, opposition et fonction dans l'objet) se vérifient par du code, sans modèle. Le découpage ne dit pas qui les exécute. Harvey tient le même principe, écrit à la ligne 805 de son `README.md` : ce qui s'obtient de façon déterministe n'appelle pas de modèle. L'étape 9, la consolidation du lot, est déjà dans l'orchestrateur en code : le contrôle y a sa place, et le recetteur garde ce qui demande un jugement (E-018, E-020).

**Pourquoi le point 2 comble un trou précis.** L'exigence E-039 (A0, ligne 20) mesure deux choses : la consigne cachée est signalée au journal, et l'action qu'elle demande est absente du journal des actions. Un lien piégé glissé dans un brouillon n'est pas une action du journal. Il reste dans un texte que l'associé relit et envoie. Le contrôle des domaines de Harvey le retiendrait. Cette lecture de l'exigence est la mienne, à confirmer sur `EXIGENCES.json`.

**Le point 4 se limite à une liste de drapeaux.** Le rédacteur et le diagnostiqueur n'ont besoin d'aucun outil web (`A-DECOUPAGE.md`, lignes 35-36). La phase C orchestre par session headless : elle peut reprendre ces 4 drapeaux et le contrôle préalable. Le poste les porte : `claude --version` rend 2.1.299, et `claude --help` liste `--safe-mode`, `--tools`, `--setting-sources`, `--no-session-persistence`, `--strict-mcp-config` (mesuré le 02/11/2026).

## Ce qui ne vaut pas d'être repris

| Point | Source dans Harvey | Pourquoi |
|---|---|---|
| Envoi automatique | `harvey/sending_mode.py` ; `README.md` lignes 466-490 | Interdit par le garde-fou (CLAUDE.md du produit, ligne 66). Harvey démarre pourtant en approbation (`require_approval: true`, `harvey.yaml`). |
| Robot LinkedIn | `harvey/integrations/linkedin.py` ; `harvey/agents/scout.py` ligne 721 | Interdit par le produit : « aucun robot, script ni extension » (ligne 67). Harvey le désactive par défaut (`config.py` ligne 334) mais le code est là. |
| Devinette et vérification d'adresses | `harvey/integrations/email_finder.py` lignes 1-23 | Elle passe par des services tiers (Hunter, Reoon, ZeroBounce) : comptes et dépenses interdits sans accord écrit (ligne 72). |
| Contrôle de conformité externe | `harvey/integrations/precleared.py` ; `docs/precleared.md` ligne 22 | Il envoie l'adresse et les noms à un service tiers. Le pays d'émetteur accepté est « GB » ou « US » : pas la France. |
| Détection d'opposition par phrases | `harvey/agents/handler.py` lignes 59-76, 323-363 | Les listes sont en anglais, hébreu et espagnol, pas en français. Le produit ne lit aucune réponse : l'associé s'en charge (étape 12 de `A-DECOUPAGE.md`). À écrire en français le jour où une lecture automatique des réponses existerait. |
| Source de prospects | `harvey/collectors/discover.py` ligne 1020 ; `README.md` ligne 260 | OpenStreetMap par défaut, dont le README reconnaît la couverture mince. Le produit part de l'API Recherche d'entreprises, qui porte le SIREN (numéro d'identification d'une entreprise française). |
| Fuseaux horaires, score 0-100, tableau de bord | `harvey/send_window.py` (632 lignes), `harvey/fit.py` lignes 5-14, `harvey/dashboard.py` (2 692 lignes) | Un destinataire en France, une note binaire prouvée critère par critère (E-009) contre un score pondéré de 20, 30, 25 et 25 points, et une page de validation seulement si elle est retenue (CLAUDE.md du produit, ligne 148). |
| Domaine dédié et préchauffage | `harvey/deliverability.py` ; `README.md` ligne 114 | L'associé écrit depuis sa boîte. Le service recommandé porte un lien de parrainage (`?via=harvey`). |
| Consignes de rédaction | `prompts/writer.md` | Écrites en anglais pour des courriels de 75 mots ; E-017 à E-024 et `ECRITURE.md` couvrent déjà notre besoin. |

## Le contrat Anthropic n'est pas levé

Lire le code ne dit rien du contrat. Harvey s'en remet à l'utilisateur : « Check the terms and usage limits of the provider you choose » (`README.md` ligne 81). Les réserves 2 et 3 de `references/JETON-ABONNEMENT.md` (lignes 43-51) valent pour Harvey comme pour nos propres `claude -p` : compte personnel, clause d'usage commercial, usage « ordinary, individual ». Elles se posent à `digit-ai-prospection` au jour où la phase C lance l'orchestration headless, non à la lecture de Harvey. La décision revient à l'humain (dépense possible, plan Team).

## Hypothèses non résolues

- Je n'ai pas exécuté Harvey ni ses 27 900 lignes de tests : le fonctionnement décrit vient du code lu.
- Je n'ai pas relu `EXIGENCES.json` en entier, seulement E-004 à E-039 cités ; la lacune de E-039 est à confirmer.
- Les 4 000 étoiles de la décision D-137 ne sont pas vérifiées ici et n'entrent pas dans le raisonnement.
