# Retours forges — Produit-10 — 20260824f

- **Contexte** : objection humaine du 24/08 — « la table `ref_activite` a été retirée du
  périmètre car elle n'existait pas dans le catalog Client-C Silver, mais elle existe dans le
  catalog D2 Silver, donc elle aurait dû être réintégrée, non ? ». Elle était fondée. Deux
  défauts de méthode l'ont rendue possible, et aucun n'est propre à ce produit.
- **Références ledger** : `forge\ledger.jsonl` seq 79.
- **Remise au pilot** : copié dans `<PILOT_ROOT>\input\00-retours\` — l'original reste ici.
- **Statut** : remis le 2026-08-24

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).
Ce lot succède à `Produit-10 - RETOURS - 20260824e`, remis le même jour. La séquence d'ids
continue en **`RV-19`**. Cinquième lot du jour, et **troisième dont le constat vient d'une
lecture humaine et d'aucun oracle**.

---

## Le fait qui ouvre ce lot

Une cible du périmètre a été **retirée** parce que sa table n'existait pas dans le catalogue
visé. Le raisonnement est correct — et sa conclusion est trop large de deux crans :

1. **La table existe dans le modèle du groupe**, sur un autre déploiement, avec 12 colonnes,
   236 lignes, et une clé étrangère qui la référence depuis les clients. Son absence ici n'est
   pas un trou de conception, c'est un **trou de déploiement**.
2. **Pire, l'absence laisse une clé étrangère orpheline** : la colonne qui référence cette table
   existe bel et bien dans le catalogue visé, et pointe donc vers un objet inexistant. Un défaut
   du modèle déployé que le retrait de la cible a rendu invisible au lieu de le révéler.

Et il faut ajouter ce qui m'incombe : **j'avais écrit le bon constat sans en tirer la
conclusion**. Le document du projet disait, dès sa version mesurée, « l'activité est modélisée,
alimentée et rattachée au client ; ce qui manque est un déploiement, pas une conception ». La
phrase était juste. Elle n'a produit aucune action, et il a fallu qu'un humain la lise pour que
la cible revienne au périmètre.

## factory (`digit-ai-factory`) — méthode d'analyse

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RV-19 | **majeur** | générique | **La méthode fait retirer une cible dont la table est absente, sans jamais demander si l'absence est un trou de CONCEPTION ou de DÉPLOIEMENT.** L'étape de résolution des noms prescrit : « une cible introuvable se cherche par motif avant d'être déclarée absente ; si elle reste introuvable, elle est retirée du périmètre avec sa preuve de recherche ». La preuve de recherche a été fournie, complète et honnête — et le retrait était quand même la mauvaise décision. **Mesuré le 24/08** : la table absente d'un déploiement existe dans un autre, avec **12 colonnes** dont 6 métier et **236 lignes** ; le référentiel amont qui l'alimente en porte **48**, libellés en **12 langues** ; et la clé étrangère qui la référence est renseignée sur **1 407** lignes de **24 136**. Le retrait a effacé du périmètre un objet **modélisé, alimenté ailleurs, et référencé ici**. Aggravant, et c'est le vrai coût : l'absence de la table laisse dans le catalogue visé une **clé étrangère qui pointe vers un objet inexistant** — un défaut du modèle déployé, que le retrait a masqué. | **Remplacer le verdict binaire « présente / retirée » par trois états**, et l'écrire dans la méthode : (1) **présente** ; (2) **absente du modèle** — aucun déploiement connu ne la porte, et le retrait est justifié ; (3) **absente de CE déploiement** — un autre la porte, la cible **reste au périmètre**, sa structure se relève sur le déploiement qui l'a, et le mapping se prépare contre elle. **Et une vérification à ajouter avant tout retrait** : *les colonnes qui référencent la table absente existent-elles dans le catalogue visé ?* Si oui, le retrait masque une clé étrangère orpheline, qui est un constat à livrer et non à effacer. Le troisième état est celui qui manquait, et il ne se devine pas : il faut regarder ailleurs pour le voir. |
| RV-20 | majeur | générique | **Le commentaire d'une colonne est une source de vérité de premier ordre, et la méthode ne le dit nulle part.** Ce qui a tranché le sujet du 24/08 n'est ni une jointure ni un décompte : c'est le commentaire porté par la colonne de code de la table cible, qui déclare en toutes lettres de quel système ce code est repris. Il a établi d'un coup ce que trois tours d'analyse n'avaient pas su dire — que le code d'activité du modèle vient du système tiers et non du progiciel source — et il a du même geste **validé** le jugement de l'exécutant sur le fond **et corrigé** sa conclusion. La méthode actuelle demande bien de lire les commentaires, mais pour **classer** les colonnes en technique ou métier, et pour peupler une colonne « description » dans les tableaux. Elle ne dit jamais qu'un commentaire peut **nommer l'amont d'une colonne**, ni qu'il faut le chercher pour ça. Deux autres commentaires de ce même modèle portaient déjà des informations de cette nature — la composition d'une clé primaire, et la cible d'une clé étrangère — et l'un d'eux désigne une table sous un nom qui n'existe pas, ce qu'aucun contrôle n'avait relevé. | **Ajouter aux étapes de lecture du modèle cible un balayage explicite des commentaires**, avec ce qu'on y cherche : le **système d'origine** d'un code, la **composition** d'une clé, la **cible** d'une clé étrangère, la **règle de dérivation** d'une valeur. Et un contrôle mécanique qui va avec, peu coûteux : **tout objet nommé dans un commentaire existe-t-il ?** Il aurait relevé ici, sans analyse, qu'un commentaire de clé étrangère renvoie à une table sous un nom que le catalogue ne porte pas. |

**Portée** (R-45) : *générique* pour les deux.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le complément d'analyse portait le bon constat sans sa conclusion | chapitre 6 ajouté : la cible est réintégrée, sa structure et son alimentation sont mesurées, et la clé étrangère orpheline est nommée | **non** | Défaut de rédaction qui m'appartient — un constat sans conclusion opérationnelle. Rien à généraliser, sinon la vigilance |
| Le retrait de la cible n'avait pas été rediscuté après la mesure du jumeau | fait le 24/08, sur objection humaine | **oui** | La méthode ne prévoit pas de rouvrir un retrait à la lumière d'un déploiement voisin → **`RV-19`** |

## Retours sur les documents produits

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| le prompt de construction du mapping | **aucun gabarit** — écrit de bout en bout | un gabarit de consigne d'analyse, alors que ce projet en a produit quatre versions successives en onze jours | le destinataire a relevé qu'une cible avait été retirée à tort et que trois objets n'avaient jamais été cherchés — deux défauts que la consigne ne prévenait pas | la structure entière : méthode séparée des observations, taxonomie fermée de verdicts, registre de mesures, six contrôles de recevabilité annoncés à l'exécutant | **générique** — la structure a tenu sur quatre tours et vaut d'être versée à la bibliothèque |

**Aucun document produit depuis un gabarit** de `gabarits\documents\` : ce projet est une analyse de données et la bibliothèque n'en porte pas de gabarit. Le tableau ci-dessus rapporte donc ce qui a manqué **faute de gabarit**, ce qui est l'autre moitié du même signal.

## Confirmations positives

- **L'exécutant du mapping avait raison sur le fond, et il faut le dire** : son jugement que les
  codes d'activité trouvés côté source relèvent du budget et de la comptabilité, et non de
  l'activité commerciale du preneur, est **corroboré** par le commentaire découvert depuis. Seule
  sa conclusion était trop large. Un retour qui ne distinguerait pas les deux serait injuste.
- **La preuve de recherche exigée par la méthode a bien été fournie** — deux requêtes, trois
  motifs de nom, résultat nul. La méthode a été appliquée correctement ; c'est la méthode qui
  manquait d'un état.
- **Trois lots du jour sur cinq viennent d'une lecture humaine.** Aucun oracle n'aurait vu ces
  trois-là. C'est un fait à porter au registre, pas un reproche : il dit où placer l'effort
  d'outillage, et où ne pas le placer.

## Ordre recommandé

**`RV-19` d'abord** — il change une décision de périmètre, donc le contenu même des livrables.
**`RV-20`** ensuite : son contrôle mécanique est peu coûteux et il aurait, à lui seul, révélé
une incohérence de nommage qui traîne encore.
