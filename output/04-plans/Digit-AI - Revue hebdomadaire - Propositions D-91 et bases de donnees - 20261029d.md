# Revue hebdomadaire des propositions — 2026-10-29

1 proposition(s) vous reviennent cette semaine, classées par valeur au registre. Chacune dit de quoi il s'agit, le problème et pourquoi il vous revient, puis ses 3 options : ce qui se passe après chaque choix, son coût en complexité et durée, et si l'on peut revenir en arrière.

Pour répondre, une ligne suffit, par exemple : « D-91 a ». Une décision sans réponse prend son option (c).

## Mises en œuvre sans vous, pour information

Ces propositions ne relèvent d'aucun motif qui vous revienne (dépense, publication, geste irréversible, doctrine, arbitrage de préférence, écriture chez un produit) : la session applique l'option recommandée et vous en rend compte. Vous pouvez revenir sur chacune.

- la fabrique de données promise par le contrat des adaptateurs de forge-tests Option appliquée : Construire. Pourquoi sans vous : construction bornée dans une forge, sans dépense, sans publication hors du parc, réversible par un commit.
- la remise à zéro à la demande d une base de développement ou de qualification Option appliquée : Construire. Pourquoi sans vous : construction bornée dans une forge, sans dépense, sans publication hors du parc, réversible par un commit.
- le référentiel de contrôles de forge-audit Option appliquée : Construire. Pourquoi sans vous : ajout borné à un référentiel de forge, valable quelle que soit la réponse à la question de doctrine, réversible par un commit.

> **D-91 — Une base de qualification d un produit peut-elle être alimentée par un extrait de sa production, une fois anonymisé et contrôlé ? (TF-2011)**
>
> - **De quoi s'agit-il** : la règle qui dit d où viennent les données des bases de développement et de qualification des produits.
> - **Le problème** : forge-tests a décidé « synthétiques uniquement » le 02/08/2026, et 2 produits ont déjà écrit leur propre extracteur anonymisé faute d outil commun.
> - **Pourquoi vous** : c est une règle de la Factory sur la donnée personnelle de vos clients : la changer revient au porteur.
> - **Recommandation : (a)** — un jeu synthétique ne reproduit pas les pièges d une donnée réelle : un des 2 produits avait déjà un classeur synthétique, et c est l extrait réel anonymisé qui gardait les cellules fusionnées que son parseur ratait. Source consultée : étude output/03-etudes/Digit-AI - Étude - Bases de donnees de dev et qualification - 20261029a.md.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) *(recommandée)* Admettre l extrait anonymisé, sous contrôle | Forge-data construit un outil de masquage par moteur de base, et un contrôle refuse tout extrait où une personne reste reconnaissable (individualisation, corrélation, inférence) ; les jeux d audit de forge-tests restent synthétiques ; une pseudonymisation par clé ne suffit jamais | Complexe × plusieurs jours | Possible : la règle se retire par un commit, les extraits déjà produits restent chez les produits |
| (b) Synthétique uniquement, partout | Aucune donnée issue de la production n entre en développement ou en qualification ; le générateur synthétique (TF-2012) est la seule voie ; les extracteurs des 2 produits deviennent contraires à la règle et le contrôle d audit (TF-2014) les signalera | Simple × court | Possible, par une nouvelle décision |
| (c) Ne rien trancher | La règle de forge-tests reste seule écrite, chaque produit continue de décider pour lui ; le sujet revient à la revue suivante | Nul | Sans objet |

> **Sans réponse** : (c), ne rien trancher.


