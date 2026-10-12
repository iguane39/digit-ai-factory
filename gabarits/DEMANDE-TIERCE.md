# Demande remise à une équipe tierce — la forme

<!-- Gabarit du pilot (gabarits\DEMANDE-TIERCE.md). Juge exécutable :
     node gabarits\oracle-demande-tierce.mjs <fichier> [--noms Prénom,Nom,...]
     Il rend 0 si la forme est tenue, 1 sinon, 2 si le fichier est illisible.
     Fixtures rouge et verte : oracles\fixtures\demande-tierce-*.md.
     Origine : retours du 01/10/2026 d'un produit (RA-59 : la forme en cinq parties ;
     RA-65 : la refonte en quatre parties ; RA-71 : le renvoi à un message précédent ;
     RA-72 : le statut trop long) ; tâches TF-1517, TF-1544, TF-1603, TF-1604, TF-1513. -->

Toute demande adressée à une équipe qui n'est pas la nôtre (identité, hébergement, sécurité,
exploitation), qu'elle parte par message, par ticket ou comme prompt, suit cette forme, dans tout
projet. Le lecteur sait quoi faire, dans quel état est le produit, ce qui vient ensuite et comment
constater le résultat, sans rien chercher ailleurs. Elle ne vaut pas pour la demande d'évolution
entre deux produits (`gabarits\DEMANDE-PRODUIT.md`), qui a ses cinq rubriques.

## Les quatre parties, dans cet ordre

Chaque partie porte son titre seul sur une ligne.

1. **Prochaines étapes** : les gestes demandés, à l'infinitif et dans l'ordre, avec les noms exacts
   que l'équipe voit à l'écran (chaîne, branche, paramètre, case, bouton) et les identifiants utiles.
   La demande se suffit à elle-même : une relance redonne tous les gestes, écran par écran, et le
   geste à faire si l'étape s'arrête. Elle ne renvoie jamais à un message précédent.
2. **Statut et impacts des actions** : la situation d'aujourd'hui et sa cause, puis l'effet des
   gestes demandés. Trois phrases et quatre-vingts mots au plus, dans les mots du lecteur. Le récit
   du travail de l'équipe produit (revue, correctifs, numéros de demande de fusion) n'y entre pas.
3. **Étapes suivantes** : les gestes qui viendront après, à l'infinitif, avec les adresses complètes.
4. **Vérification finale** : le constat qui prouvera le résultat, à l'adresse complète, et le résultat
   observable attendu.

## Exclu de toute demande

- Un nom de personne, ou un renvoi vers une personne : on nomme l'équipe ou le rôle.
- Une demande de droits d'administration, même temporaires, pour qu'un compte personnel fasse une
  action : on demande l'objet lui-même, posé sur l'identité de la chaîne qui en a l'usage.
- La situation d'un autre projet : la demande se justifie par ce produit seul.
- Une ligne sans valeur pour le lecteur : « rien d'autre », formule d'usage, rappel inutilisé.
- Un compte imposé, ou une commande à jouer avec un compte personnel. Quand la demande est une
  exécution, les gestes sont la demande, mais ils passent par l'écran ou la chaîne que l'équipe emploie.
- La tournure « Ce que… » : on nomme la chose, ou on écrit le geste.
- La liste de ce qui ne sera pas fait (« ni …, ni … », « rien de plus », « sans secret »).
- « Le commanditaire » comme sujet d'une étape : l'étape s'écrit à l'infinitif.
- Une adresse abrégée : on écrit l'adresse complète.
- Le mot « étage » : on écrit « étape ».
- Un renvoi à un message précédent (« la relance demandée à 16h38 », « comme demandé »).

## Quand un geste échappe à la chaîne

Si la chaîne de livraison ne peut pas faire un geste et qu'il revient à l'équipe, la restitution dit
pourquoi, avec sa source (document du fournisseur, rôle exigé, date de lecture). Un geste manuel
sans cause ressemble à un oubli d'automatisation. Cette partie se juge à la lecture : aucun oracle
ne sait si la cause donnée est vraie.

## Un état qui contredit le résultat attendu est un écart

Quand l'état observé contredit le résultat que le commanditaire a décrit, la demande et la
restitution le disent comme un écart à fermer, avec ce qui le fermera. Les mots « normal »,
« attendu » et « voulu » ne le qualifient pas. Une procédure d'exploitant dit d'abord le résultat
attendu, puis l'erreur comme signe d'un écart connu. Le contrôle lexical est
`oracles\oracle-ecart-normal.mjs`.

## Ce que le contrôle juge, et ce qu'il laisse

Il juge la forme : parties, ordre, bornes du statut, présence d'une adresse complète et d'un
résultat observable, motifs exclus. Il ne juge pas la justesse du statut, la cause d'un geste
manuel, ni les noms de personnes que personne ne lui a donnés : la liste se passe par `--noms`.
Un statut dont la forme est tenue peut rester faux (RA-72 portait une conséquence fausse).
