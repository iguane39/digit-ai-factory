# Index des références du pilot

Ce fichier est cité par le noyau `CLAUDE.md` et cite à son tour chaque document de `references\` : c'est
par lui que l'oracle du noyau (`oracles\oracle-claude-md.mjs`, règle N3) reconnaît une référence comme
atteignable — une référence absente d'ici et du noyau est orpheline, donc jamais chargée par un run.
Décision humaine D-3 (b) du 03/09/2026 : le noyau est au plafond (N1, 6 144 octets) ; l'index porte
le détail, le noyau ne porte qu'une ligne. **À tenir à jour à chaque référence ajoutée ou retirée** —
l'oracle refuse l'orphelin dans les deux sens (référence sans entrée ici, entrée ici sans fichier).

| Document | Ce qu'il tient |
|---|---|
| `references\ACCUEIL.md` | Protocole d'accueil — de l'intention de l'utilisateur au run |
| `references\BEST-PRACTICES-HTML.md` | Référentiel de best practices HTML — forge Digit-AI |
| `references\CHAINE-TRADUCTION.md` | Traduire, auditer : deux chaînes déclarées |
| `references\CONVENTION-DEPOTS-MIS-DE-COTE.md` | Un dépôt mis de côté se RENOMME, il ne s'exclut pas |
| `references\CORRESPONDANCE-RENOMMAGE-FACTORY.md` | Table de correspondance §3 bis — renommage `digit-ai-forge-pilot` → `digit-ai-factory` |
| `references\EMPREINTES.md` | Empreintes — un seul format, et un registre qui le fait tenir |
| `references\ETAPES-RUN.md` | Étapes d'un run produit — détail opérationnel |
| `references\INTEGRATIONS-FOURNISSEURS.md` | Faits mesurés sur les interfaces de fournisseurs |
| `references\INTENTION.md` | La cascade de l'intention — Intention → Stratégie → Tactique → Opérationnel |
| `references\PATRONS-EPROUVES.md` | Patrons éprouvés — mécanismes payés une fois, réutilisables tels quels |
| `references\PRODUCTION-OOXML.md` | Production d'un document OOXML depuis une référence client — relevé de charte et gates |
| `references\REGLES-DE-NON-REPETITION.md` | Règles de non-répétition |
| `references\RUN-CONSEIL.md` | Run de conseil — quand le livrable est une trajectoire, pas un logiciel ni un seul document |
| `references\RUN-MANDAT.md` | Run de mandat transverse — quand le livrable est un document, pas un logiciel |
| `references\RUN-VERSION.md` | Run de version (produit existant) — détail opérationnel |
| `references\SEO-RECHERCHE.md` | Expertise SEO — données de recherche multilingues |
| `references\TODO-FORGE.md` | TODO-FORGE — registre des améliorations, mode opératoire |
