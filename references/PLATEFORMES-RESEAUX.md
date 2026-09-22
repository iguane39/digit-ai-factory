---
role: référentiel périssable de ce que 9 réseaux sociaux permettent à une petite structure sur son propre compte, sans dépense — publier par interface officielle, programmer dans l'outil de la plateforme, exporter ses chiffres, déclarer un contenu généré, régime de l'automatisation
sources_de_verite: [output/03-etudes/20260921-etude-opportunite-reseaux-sociaux-complement.md §2 bis et §3, 4 rapports d'agents de recherche du 21/09/2026 en lecture seule, 13 adresses testées par test_existence.py et 4 citations relues mot pour mot par le pilot le 21/09/2026, references/PLATEFORME-LINKEDIN.md pour le détail de LinkedIn]
verifie_le: 2026-09-21
perime_le: 2026-12-02
---

# Plateformes de réseaux sociaux — 9 réseaux, 5 faits chacun, datés, à relire avant de s'y fier

**Ce que le lecteur apprend ici.** Pour chaque réseau, 5 faits décident de ce qu'un run
d'animation de réseau peut y faire. 5 réseaux sur 8 hors LinkedIn ouvrent gratuitement leur
interface de publication. 7 réseaux sur 9 offrent une programmation gratuite dans leur propre
outil, Threads compris depuis le rejeu du 21/09 : c'est elle que l'humain utilise, et aucun outil de diffusion n'est construit. Partout, un
robot ou un script hors interface officielle est interdit ou encadré.

**Pourquoi ce document existe** (TF-1275, décision humaine D-12 (a) du 21/09/2026). Le référentiel
du 17/09 ne couvrait que LinkedIn, et l'étude du même jour avait tiré de ce seul réseau une
conclusion générale. Une donnée volatile est une donnée (loi transverse n° 4) : elle vit ici,
datée, sourcée, avec sa solidité et sa péremption, et aucun skill ne la recopie. Le détail de
LinkedIn reste dans `references\PLATEFORME-LINKEDIN.md` ; ce document y renvoie et ne le double pas.

**Mode de lecture.** Une section vaut un réseau, une ligne vaut un fait. La citation est mot pour
mot, dans sa langue. La date est celle que la page affiche, sinon celle de la consultation.
« Solidité » dit d'où vient la ligne :
- **officiel, relu** — page de la plateforme ouverte par le pilot, citation relue ;
- **officiel** — page de la plateforme ouverte par un agent de recherche, citation rapportée ;
- **officiel (archive)** — page de la plateforme illisible en direct, lue sur une copie datée de
  web.archive.org ; la date est celle de la capture ;
- **secondaire** — sources tierces concordantes : à confirmer avant de s'y fier ;
- **non trouvé** — aucune page lisible ; la ligne ne fonde rien.

**Péremption : 2026-12-02**, même date que le référentiel LinkedIn. Passé cette date, chaque ligne
se rejoue ou se retire. Une ligne « secondaire » ou « non trouvé » ne fonde aucune construction.

**Rejouer une ligne** : `python scripts/test_existence.py <adresse>` du skill `la-barre` dit si la
page répond ; la citation se relit sur la page. Aucun compte, aucune connexion.

## Vue d'ensemble

| Réseau | Publier par interface officielle, compte propre | Programmation gratuite de la plateforme | Export manuel des chiffres | Automatisation hors interface |
|---|---|---|---|---|
| LinkedIn | fermée : agrément | oui : 10 minutes à 3 mois | oui | interdite |
| Instagram | ouverte : 100 par 24 h | oui : 30 jours | oui, détail non trouvé | interdite sans autorisation |
| Facebook (pages) | ouverte : quota dynamique | oui : 20 minutes à 29 jours | oui | interdite sans autorisation |
| Threads | ouverte : 250 par 24 h | oui, horizon non trouvé | non trouvé | interdite |
| TikTok | sous audit : privée sans audit | oui : 10 jours | non trouvé | interdite sans accord écrit |
| YouTube | ouverte : 10 000 unités par jour | oui | oui : 500 lignes par export | interdite sauf permission |
| X | payante à l'usage | secondaire | secondaire | encadrée : compte étiqueté |
| Bluesky | ouverte, sans revue | absente | absent | non traitée par les conditions |
| Fiche d'établissement Google | sur liste blanche : 60 jours | oui | oui | consentement exprès exigé |

## LinkedIn

Détail, citations et dates : `references\PLATEFORME-LINKEDIN.md`. Un seul fait est porté ici,
parce qu'il a changé la conclusion de l'étude du 17/09.

| Fait | Régime | Citation | Adresse | Date | Solidité |
|---|---|---|---|---|---|
| Programmer, profil d'une personne | gratuit, de 10 minutes à 3 mois | « The time selected must be within 10 minutes to 3 months from the current time » | linkedin.com/help/linkedin/answer/a1347212 | consultation 2026-09-21 | officiel, relu |
| Programmer, page d'une organisation | gratuit, de 1 heure à 3 mois, administrateurs de contenu | « you can schedule a post anywhere between an hour from the current time to three months in advance » | linkedin.com/help/linkedin/answer/a548192 | consultation 2026-09-21 | officiel |

## Instagram

| Fait | Régime | Citation | Adresse | Date | Solidité |
|---|---|---|---|---|---|
| Publier par interface officielle | ouverte à un compte professionnel relié à une page ; 100 publications par 24 h ; sans revue d'application pour son propre compte | « Instagram accounts are limited to 100 API-published posts within a 24-hour moving period. » | developers.facebook.com/docs/instagram-platform/content-publishing/ | consultation 2026-09-21 | officiel, relu |
| Programmer | oui : 25 publications par jour, jusqu'à 30 jours à l'avance ; des sources tierces écrivent 75 jours, la page dit 30 | « You can schedule up to 25 posts a day, up to 30 days in advance. » | web.archive.org/web/20260911210912/https://help.instagram.com/439971288310029/ | capture 2026-09-11 | officiel (archive), relu |
| Exporter ses chiffres | un export existe dans l'outil partagé ; format et profondeur non trouvés au rejeu du 21/09 : la page visée rend HTTP 404 | « Click Export and select the file type. » | facebook.com/help/972879969525875 | consultation 2026-09-21 | secondaire pour Instagram : la page lue porte sur la page Facebook |
| Déclarer un contenu généré | étiquette obligatoire pour la vidéo et le son réalistes ; facultative pour l'image ; le texte n'est pas visé | « we will begin adding 'AI info' labels to a wider range of video, audio and image content » | transparency.meta.com/governance/tracking-impact/labeling-ai-content/ | 2025-02-19 | officiel |
| Automatisation hors interface | interdite sans autorisation expresse | « This includes creating accounts or accessing or collecting information in an automated way without our express permission » | help.instagram.com/581066165581870 | consultation 2026-09-21 | officiel |

## Facebook (pages)

| Fait | Régime | Citation | Adresse | Date | Solidité |
|---|---|---|---|---|---|
| Publier par interface officielle | ouverte dès qu'on tient un rôle sur la page ; revue d'application due seulement pour les pages d'autrui ; aucun quota chiffré, limite dynamique | « Meta App Review – For apps that needs access to data that you do not own or manage » | developers.facebook.com/docs/permissions/ | consultation 2026-09-21 | officiel |
| Programmer | oui, de 20 minutes à 29 jours | « You can schedule posts to publish between 20 minutes and 29 days away. » | facebook.com/business/help/1252240869631062 | consultation 2026-09-21 | officiel |
| Exporter ses chiffres | oui, depuis Meta Business Suite ; format non lu | « Click Export and select the file type. » | facebook.com/help/972879969525875 | consultation 2026-09-21 | officiel |
| Déclarer un contenu généré | même règle qu'Instagram | même citation | transparency.meta.com/governance/tracking-impact/labeling-ai-content/ | 2025-02-19 | officiel |
| Automatisation hors interface | interdite sans autorisation préalable | « You may not access or collect data from our Products using automated means (without our prior permission) » | facebook.com/legal/terms | 2025-01-01 | officiel |

## Threads

| Fait | Régime | Citation | Adresse | Date | Solidité |
|---|---|---|---|---|---|
| Publier par interface officielle | ouverte ; 250 publications par 24 h | « Threads profiles are limited to 250 API-published posts within a 24-hour moving period. » | developers.facebook.com/documentation/threads/overview | consultation 2026-09-21 | officiel |
| Programmer | oui, annoncée disponible par le compte officiel du responsable du réseau ; horizon non trouvé sur une page d'aide | « You can now schedule posts on Threads, and metrics for individual posts are rolling out in Insights. » | threads.com/@mosseri/post/DFLhrwRT8pC | 2025-01-23 | officiel : compte de la plateforme, pas une page d'aide |
| Exporter ses chiffres | aucun export de chiffres trouvé ; les vues s'affichent sur 90 jours | « calculated based on data from the last 30 days » | help.instagram.com/3675908612671136/ | consultation 2026-09-21 | officiel pour l'affichage ; non trouvé pour l'export |
| Déclarer un contenu généré | la règle de Meta s'applique ; corps de la page non lu | « Label AI content on Threads » | help.instagram.com/407718162047721/ | consultation 2026-09-21 | officiel pour le titre seul |
| Automatisation hors interface | robots et collecteurs interdits | « use any robot, spider, crawlers, scraper or other automatic device, process, software or queries that intercepts, 'mines', scrapes » | facebook.com/help/instagram/769983657850450 | 2025-05-28 | officiel |

## TikTok

| Fait | Régime | Citation | Adresse | Date | Solidité |
|---|---|---|---|---|---|
| Publier par interface officielle | sous audit : sans audit, toute publication reste privée | « All content posted by unaudited clients will be restricted to private viewing mode. » | developers.tiktok.com/docs/en/content-posting-api-get-started | 2026-08-04 | officiel |
| Programmer | oui, jusqu'à 10 jours, comptes professionnels, sur le web | « schedule a post up to 10 days in advance » | ads.tiktok.com/business/en-US/blog/introducing-video-scheduler-now-you-can-plan-tiktoks-in-advance | consultation 2026-09-21 | officiel : billet de la plateforme, pas une page d'aide |
| Exporter ses chiffres | non trouvé pour un compte gratuit : les pages d'aide ne rendent qu'un menu ; l'export documenté est celui des campagnes payantes | aucune | tiktok.com/analytics ; support.tiktok.com | consultation 2026-09-21 | non trouvé |
| Déclarer un contenu généré | obligatoire pour l'image, le son et la vidéo réalistes ; le texte n'est pas visé | « requires people to label AI-generated content that contains realistic images, audio or video » | newsroom.tiktok.com/en-us/new-labels-for-disclosing-ai-generated-content | 2023-09-19 | officiel, page ancienne de 3 ans |
| Automatisation hors interface | interdite sans accord écrit | « scrape, crawl, export or otherwise extract any data or content in any form, for any purpose, from the Platform using any automated system » | tiktok.com/legal/page/us/terms-of-service/en | 2026-07-15 | officiel |

**Hors du run au 21/09/2026** : la vidéo est la norme de ce réseau, et aucun verbe outillé ne la
produit (`references\RUN-RESEAU.md`).

## YouTube

| Fait | Régime | Citation | Adresse | Date | Solidité |
|---|---|---|---|---|---|
| Publier par interface officielle | ouverte ; 10 000 unités par jour et 100 envois de vidéo sans audit | « Projects that enable the YouTube Data API have a default quota allocation of 100 search.list calls, 100 videos.insert calls, and 10,000 units per day » | developers.google.com/youtube/v3/getting-started | 2026-09-14 | officiel |
| Programmer | oui, dans YouTube Studio ; aucune limite chiffrée n'est publiée (rejeu du 21/09) | « You can use scheduled publishing to schedule a private video to go public at a specific time. » | support.google.com/youtube/answer/1270709 | consultation 2026-09-21 | officiel |
| Exporter ses chiffres | oui, 500 lignes par export ; format au choix, non nommé | « select Export current view and choose your preferred file format » | support.google.com/youtube/answer/9717005 | consultation 2026-09-21 | officiel |
| Déclarer un contenu généré | obligatoire pour un contenu réaliste altéré ou synthétique | « Makes a real person appear to say or do something they didn't do. » | support.google.com/youtube/answer/14328491 | consultation 2026-09-21 | officiel |
| Automatisation hors interface | interdite sauf permission écrite | « access the Service using any automated means (such as robots, botnets or scrapers) except (a) in the case of public search engines » | youtube.com/static?template=terms | 2023-12-15 en anglais ; une version française sert le 2026-01-09 | officiel |

**Hors du run au 21/09/2026**, pour la même raison que TikTok.

## X

Le centre d'aide de X, `help.x.com`, a rendu HTTP 403 aux agents et HTTP 404 au pilot le
21/09/2026, quand `docs.x.com` et `x.com/tos` rendaient HTTP 200. Le rejeu du même jour a lu 2
pages sur des copies d'archive ; 2 lignes restent secondaires.

| Fait | Régime | Citation | Adresse | Date | Solidité |
|---|---|---|---|---|---|
| Publier par interface officielle | payante à l'usage : 0,015 $ par publication créée ; aucun palier gratuit sur la page | « The X API uses pay-per-usage pricing. No subscriptions—pay only for what you use. » | docs.x.com/x-api/getting-started/pricing | consultation 2026-09-21 | officiel, relu |
| Programmer | un planificateur gratuit existerait, jusqu'à 18 mois ; non trouvé sur page officielle au rejeu du 21/09 | aucune citation officielle | source tierce du 2026-04-08 | 2026-04-08 | secondaire |
| Exporter ses chiffres | tableau de bord réservé aux abonnés payants, selon des sources tierces ; la page officielle confirme 3 paliers payants, pas la clause sur les chiffres | « Premium has three tiers: Basic, Premium, and Premium+, with more features included in each higher tier. » | web.archive.org/web/20260813025509/https://help.x.com/en/using-x/x-premium-faq | capture 2026-08-13 | secondaire pour les chiffres |
| Déclarer un contenu généré | X étiquette les médias manipulés ou générés, pour les utilisateurs de l'Union européenne ; l'obligation faite à l'auteur n'est pas écrite | « 'Made with AI' indicators, to help users in the EU to better identify synthetic content » | web.archive.org/web/20260914124917/https://help.x.com/en/rules-and-policies/media-literacy-plan | capture 2026-09-14 | officiel (archive), relu |
| Automatisation | encadrée : compte étiqueté comme automatisé, rattaché à un humain | « Enable the 'Automated' profile label » | docs.x.com/developer-guidelines | consultation 2026-09-21 | officiel |

## Bluesky

| Fait | Régime | Citation | Adresse | Date | Solidité |
|---|---|---|---|---|---|
| Publier par interface officielle | ouverte, gratuite, sans revue ; 5 000 points par heure, 35 000 par jour | « The limit is 5,000 points per hour and 35,000 points per day. » | bsky.network/docs/rate-limits/ | consultation 2026-09-21 | officiel |
| Programmer | absente | aucune page officielle ne l'énonce | bsky.social/about/support | consultation 2026-09-21 | secondaire |
| Exporter ses chiffres | absent | aucune page officielle ne l'énonce | bsky.social/about/support | consultation 2026-09-21 | secondaire |
| Déclarer un contenu généré | aucune obligation générale relevée | « artificially manipulate features or social signals to gain unearned reach or mislead users » | bsky.social/about/support/community-guidelines | 2025-09-19 | officiel |
| Automatisation | non traitée par les conditions ; le titulaire répond de son compte | « You are responsible for all uses of Bluesky through your Bluesky account » | bsky.social/about/support/tos | 2025-08-14 | officiel |

## Fiche d'établissement Google

Premier levier d'un commerce de proximité. Aucune forge ne la portait au 21/09/2026.

| Fait | Régime | Citation | Adresse | Date | Solidité |
|---|---|---|---|---|---|
| Publier par interface officielle | sur liste blanche : fiche vérifiée et active depuis 60 jours ; quota nul avant approbation | « Manage a Google Business Profile that is verified and active for 60+ days. » ; « If your quota is 0 QPM (Queries Per Minute), your project has not yet been approved. » | developers.google.com/my-business/content/prereqs | 2026-08-28 | officiel, relu |
| Programmer | oui, pour les nouvelles, offres et événements ; aucune limite chiffrée n'est publiée (rejeu du 21/09) | « turn on Schedule this post, then select the date and time you want the post to publish » | support.google.com/business/answer/7342169 | consultation 2026-09-21 | officiel |
| Exporter ses chiffres | oui, sur une période choisie ; aucune profondeur chiffrée n'est publiée (rejeu du 21/09) | « Select the timeframe for your performance data. » | support.google.com/business/answer/9918094 | consultation 2026-09-21 | officiel |
| Déclarer un contenu généré | aucune déclaration ; l'usage de l'IA est restreint sur les photos | « have no significant alterations or excessive use of filters or AI » | support.google.com/business/answer/6123536 | consultation 2026-09-21 | officiel |
| Répondre aux avis | à la main, sur une fiche vérifiée ; toute réponse automatisée exige le consentement exprès et préalable du gérant | « You must not automate or trigger review replies, Q&As, listing creations, listing edits, or other actions without the user's prior specific and express consent. » | developers.google.com/my-business/content/policies | 2026-08-28 | officiel |

## Limites de ce référentiel

La gratuité des interfaces de Meta n'est affirmée par aucune page lue, et le rejeu du 21/09 n'a
trouvé aucune page tarifaire : l'absence de tarif vaut indice, pas preuve. Restent sans page
officielle lue : l'export des chiffres d'Instagram et de TikTok, la programmation et les chiffres
de X. Une copie d'archive prouve ce que la page disait le jour de la capture, pas aujourd'hui. Les dates « consultation » ne disent rien de l'ancienneté de la page. Une
plateforme change ses conditions sans préavis : une ligne « officiel » du 21/09 peut être fausse
le lendemain. Aucune règle de visibilité ni d'algorithme n'entre ici sans source primaire datée.
