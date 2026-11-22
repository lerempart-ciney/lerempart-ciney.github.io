# Le Rempart · guide du séjour

Site mobile pour les voyageurs du gîte Le Rempart (Avenue de Namur 6, 5590 Ciney), en 5 langues : français, anglais, néerlandais, allemand, espagnol.

## Les 3 pages

| Page | Pour qui | Adresse |
|---|---|---|
| Guide du séjour | Les voyageurs (téléphone) | `index.html?l=fr&a=AAAA-MM-JJ&d=AAAA-MM-JJ` |
| Écran TV | Les TV du gîte (plein écran) | `tv.html` (5 langues à tour de rôle) ou `tv.html?l=fr` |
| Messages du séjour | Frédéric, Sacha, Anne, Manu | `hote.html` |

- `l` = langue, `a` = date d'arrivée, `d` = date de départ. Le lien s'arrête le lendemain du départ et la liste de courses est effacée.
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
- La météo est désactivée (`meteo.active: false`) tant que le service n'est pas choisi.

## Mise en ligne

GitHub → Settings → Pages → « Deploy from a branch » → `main` / `(root)`.

Code QR : bibliothèque de Kazuhiko Arase (licence MIT), `assets/qrcode.js`.

## Écran TV (Smart TV Samsung)

Ouvrir l'application **Internet** de la TV, aller à l'adresse `…/le-rempart/tv.html`, puis l'ajouter aux favoris. Cliquer une fois avec la télécommande pour passer en plein écran. Désactiver la mise en veille automatique de la TV dans ses réglages. La page se met à jour seule (heure, idées du jour, langue).
