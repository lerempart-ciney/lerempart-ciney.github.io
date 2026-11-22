# Le Rempart · guide du séjour

Site mobile pour les voyageurs du Rempart (Avenue de Namur 6, 5590 Ciney), qui compte 3 gîtes (gîte 1, 2 et 3),, en 5 langues : français, anglais, néerlandais, allemand, espagnol.

## Les 3 pages

| Page | Pour qui | Adresse |
|---|---|---|
| Guide du séjour | Les voyageurs (téléphone) | `index.html?l=fr&a=AAAA-MM-JJ&d=AAAA-MM-JJ` |
| Écran TV | Les TV du gîte (plein écran) | `tv.html?g=2` (5 langues à tour de rôle) ou `tv.html?g=2&l=fr` |
| Messages du séjour | Frédéric, Sacha, Anne, Manu | `hote.html` |
| QR à imprimer | À coller près des appareils | `qr.html` |

- `l` = langue, `g` = gîte (1, 2 ou 3), `a` = date d'arrivée, `d` = date de départ, `s` = jeton du lien partagé. Le lien s'arrête le lendemain du départ et la liste de courses est effacée.
- QR près d'un appareil : `index.html?v=sauna` (valeurs : `tv`, `lave`, `sauna`, `four`, `micro`, `taque`, `flipper`).

## Modifier une info

Tout est dans `assets/data.js` :
- **Wi-Fi** : `wifi: { reseau: '…', motDePasse: '…' }` (s'affiche dans l'appli et sur la TV, avec un QR de connexion).
- **Adresses du livret** : liste `RP.adresses` (jours de fermeture, temps de trajet).
- **Les pépites du Rempart** : ajouter `mot: { fr: '…', en: '…', nl: '…', de: '…', es: '…' }` sur une adresse. Elle apparaît dans « ★ Les pépites du Rempart », et une pépite du jour s'affiche dans l'appli et sur la TV.
- **Date de vérification du livret** : `livretVerifieLe: 'AAAA-MM-JJ'`.
- **Vidéos d'aide** : déposer le fichier dans `videos/` puis l'indiquer dans `RP.videos`.

Les messages du parcours sont dans `assets/messages.js`.

## Règles

- Ce dépôt est public : **jamais de code d'accès ni de mot de passe autre que le Wi-Fi**. Les codes se tapent dans `hote.html`, restent sur l'écran et ne sont jamais enregistrés.
- La page hôte n'envoie rien : elle prépare le texte, et c'est l'hôte qui envoie.
- Météo : MET Norway (licence CC BY 4.0), via le serveur. La source est affichée.

## Liste partagée et album (serveur Supabase, projet gratuit « gites »)

- Dans `hote.html`, taper le **code hôte** puis « Créer le lien avec liste partagée et album ». Le lien reçoit `&s=…`.
- Tous ceux qui ont ce lien voient la même liste et le même album. Bouton « Inviter mon groupe » dans l'appli.
- Sans ce bouton, le lien marche, mais la liste reste sur chaque téléphone et il n'y a pas d'album.
- L'album est privé (jamais publié). Le lien s'arrête le lendemain du départ. Chaque nuit à 3 h 15 (UTC), le serveur efface les séjours finis depuis 2 jours : liste et photos.
- Code du serveur : `supabase/functions/rempart/index.ts`. Le code hôte est le secret `HOTE_PIN` dans Supabase (jamais dans ce dépôt).

## Mise en ligne

GitHub → Settings → Pages → « Deploy from a branch » → `main` / `(root)`.

Code QR : bibliothèque de Kazuhiko Arase (licence MIT), `assets/qrcode.js`.

## Écran TV (Smart TV Samsung)

Ouvrir l'application **Internet** de la TV, aller à l'adresse `…/le-rempart/tv.html`, puis l'ajouter aux favoris. Cliquer une fois avec la télécommande pour passer en plein écran. Désactiver la mise en veille automatique de la TV dans ses réglages. La page se met à jour seule (heure, idées du jour, langue).
