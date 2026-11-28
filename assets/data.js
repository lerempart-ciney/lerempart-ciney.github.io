/* Le Rempart · données du site voyageurs.
   Tout ce fichier est public (GitHub Pages) : n'y mettez JAMAIS de code d'accès.
   Pour modifier une info : changez le texte entre guillemets, enregistrez, publiez. */

window.RP = {};

/* ---------- 1. Réglages ---------- */
RP.config = {
  whatsapp: '+32 475 72 88 67',
  email: 'lerempartciney@gmail.com', // donné par Sacha le 28/11/2026 (WhatsApp reste le contact principal)
  adresse: 'Avenue de Namur 6, 5590 Ciney',
  gps: '50.298357, 5.101378', // devant l'entrée, coordonnées données par Sacha le 22/11/2026
  // Wi-Fi : laisser vide tant que ce n'est pas connu. S'affiche dans l'appli et sur la TV.
  /* Ne pas remplir : le dépôt est public. Le Wi-Fi est réglé dans la page hôte et donné au voyageur après l'annonce de son arrivée. */
  wifi: { reseau: '', motDePasse: '', securite: 'WPA' },
  // Date à laquelle les adresses du livret ont été vérifiées (AAAA-MM-JJ). Vide = non affichée.
  livretVerifieLe: '',
  // Serveur du site (Supabase, projet « gites ») : météo, liste partagée, album.
  api: 'https://pnqhxoemzprhcnomlkyk.supabase.co/functions/v1/rempart',
  // Météo : MET Norway (licence CC BY 4.0, usage commercial permis), via le serveur.
  meteo: { active: true },
  // Durée pendant laquelle le lien reste actif avant l'arrivée (jours).
  joursAvantArrivee: 30
};

/* ---------- 2. Vidéos d'aide (une par appareil et par langue) ----------
   Exemple quand une vidéo existe :  sauna: { fr: 'videos/sauna-fr.mp4', en: 'videos/sauna-en.mp4' }
   Lien du QR à coller près de l'appareil :  index.html?v=sauna  */
RP.videos = {
  acces: { fr: 'videos/acces-fr.mp4', nl: 'videos/acces-nl.mp4', en: 'videos/acces-en.mp4', de: 'videos/acces-de.mp4', es: 'videos/acces-es.mp4' },
  feu: { fr: 'videos/feu-fr.mp4', nl: 'videos/feu-nl.mp4', en: 'videos/feu-en.mp4', de: 'videos/feu-de.mp4', es: 'videos/feu-es.mp4' },
  piscine: { fr: 'videos/piscine-fr.mp4', nl: 'videos/piscine-nl.mp4', en: 'videos/piscine-en.mp4', de: 'videos/piscine-de.mp4', es: 'videos/piscine-es.mp4' },
  sauna: { fr: 'videos/sauna-fr.mp4', nl: 'videos/sauna-nl.mp4', en: 'videos/sauna-en.mp4', de: 'videos/sauna-de.mp4', es: 'videos/sauna-es.mp4' },
  flipper: { fr: 'videos/flipper-fr.mp4', nl: 'videos/flipper-nl.mp4', en: 'videos/flipper-en.mp4', de: 'videos/flipper-de.mp4', es: 'videos/flipper-es.mp4' },
  lave: { fr: 'videos/lave-fr.mp4', nl: 'videos/lave-nl.mp4', en: 'videos/lave-en.mp4', de: 'videos/lave-de.mp4', es: 'videos/lave-es.mp4' },
  four: { fr: 'videos/four-fr.mp4', nl: 'videos/four-nl.mp4', en: 'videos/four-en.mp4', de: 'videos/four-de.mp4', es: 'videos/four-es.mp4' },
  micro: { fr: 'videos/micro-fr.mp4', nl: 'videos/micro-nl.mp4', en: 'videos/micro-en.mp4', de: 'videos/micro-de.mp4', es: 'videos/micro-es.mp4' },
  vapeur: { fr: 'videos/vapeur-fr.mp4', nl: 'videos/vapeur-nl.mp4', en: 'videos/vapeur-en.mp4', de: 'videos/vapeur-de.mp4', es: 'videos/vapeur-es.mp4' },
  cafe: { fr: 'videos/cafe-fr.mp4', nl: 'videos/cafe-nl.mp4', en: 'videos/cafe-en.mp4', de: 'videos/cafe-de.mp4', es: 'videos/cafe-es.mp4' },
  cuisine23: { fr: 'videos/cuisine23-fr.mp4', nl: 'videos/cuisine23-nl.mp4', en: 'videos/cuisine23-en.mp4', de: 'videos/cuisine23-de.mp4', es: 'videos/cuisine23-es.mp4' },
  homecinema: {}
};
/* Vidéo de Sam (présentateur) sur la page d'accueil, une par langue. Le ?v= force le rechargement après une nouvelle version. */
RP.videoAccueil = { fr: 'videos/accueil-fr.mp4?v=20261128', nl: 'videos/accueil-nl.mp4?v=20261128', en: 'videos/accueil-en.mp4?v=20261128', de: 'videos/accueil-de.mp4?v=20261128', es: 'videos/accueil-es.mp4?v=20261128' };
/* Appareils présents seulement dans certains gîtes (les autres sont dans les 3 gîtes).
   Le Wi-Fi est le même pour les 3 gîtes. */
RP.seulementGite = { lave: ['1'], sauna: ['1'], flipper: ['1'], kicker: ['1'], homecinema: ['1'], piscine: ['1'],
  four: ['1'], micro: ['1'], vapeur: ['1'], cafe: ['1'], cuisine23: ['2', '3'] };
RP.dansGite = (k, g) => !g || !RP.seulementGite[k] || RP.seulementGite[k].includes(g);

/* ---------- 3. Adresses du livret d'accueil ----------
   ferme = jours de fermeture (0 = dimanche, 1 = lundi … 6 = samedi).
   regle = 'saison' (horaires selon la saison), 'annee' (toute l'année), 'avr-nov'.
   pluie = idée possible s'il pleut (activité en intérieur).
   mot = texte « Les pépites du Rempart » (5 langues). L'adresse apparaît alors dans les pépites. */
RP.adresses = [
 {cat:'pain',  nom:'Vander Cammen',        min:3,  adr:'Rue du Commerce 2, Ciney',               ferme:[4],     tel:'083 21 59 68'},
 {cat:'pain',  nom:'Hennau – Marcin',      min:4,  adr:'Rue du Commerce 144, Ciney',             ferme:[1,2],   tel:'083 21 56 21'},
 {cat:'pain',  nom:'Délices',              min:4,  adr:'Rue de la Croix Limon 2, Ciney',         ferme:[1,2],   tel:'083 61 35 41'},
 {cat:'pain',  nom:'Dechamps & Fille',     min:10, adr:'Chaussée de Dinant 27, Spontin',         ferme:[2,3],   tel:'083 69 97 89'},
 {cat:'pain',  nom:'Nelis & Fils',         min:15, adr:'Place Communale 13, Assesse',            ferme:[],      tel:'083 65 53 37'},
 {cat:'pain',  nom:'Pierson',              min:17, adr:'Chaussée de Luxembourg 7, Courrière',    ferme:[],      tel:'083 65 53 01'},
 {cat:'pain',  nom:'Le Mont Blanc Cinacien',min:3, adr:'Avenue de Namur 59A, Ciney',             ferme:[],      tel:'083 21 69 30', mot:{fr:"À 3 minutes du gîte et ouvert 7 jours sur 7 : parfait pour une douceur à n’importe quel moment du séjour.", en:"Just 3 minutes from the house and open 7 days a week: perfect for a sweet treat at any time during your stay.", nl:"Op 3 minuten van de gîte en 7 dagen op 7 open: ideaal voor iets lekkers op elk moment van jullie verblijf.", de:"Nur 3 Minuten vom Haus entfernt und 7 Tage die Woche geöffnet: ideal für etwas Süßes zu jeder Zeit Ihres Aufenthalts.", es:"A 3 minutos de la casa y abierto todos los días: perfecto para darse un capricho dulce en cualquier momento de la estancia."}},
 {cat:'snack', nom:'La Récré',             min:3,  adr:'Place Monseu 29, Ciney',                 ferme:[],      tel:'0478 24 89 90', type:'Friterie'},
 {cat:'snack', nom:'Pita Turquoise',       min:3,  adr:'Rue du Commerce 81, Ciney',              ferme:[],      tel:'0493 55 51 54', type:'Dürüm, pitas'},
 {cat:'snack', nom:'Zampa',                min:3,  adr:'Rue du Centre 52, Ciney',                ferme:[0,1,2], tel:'083 22 01 05', type:'Pizza'},
 {cat:'snack', nom:'My Burger',            min:15, adr:'Rue Melville Wilson 3, Assesse',         ferme:[],      tel:'083 21 86 81'},
 {cat:'resto', nom:'Il San Marino',        min:4,  adr:'Rue du Commerce 160, Ciney',             ferme:[2,3],   tel:'083 21 17 81', type:'Italien'},
 {cat:'resto', nom:'Le Confessionnal',     min:20, adr:'Rue Rémi Himmer 4, Dinant',              ferme:[3,6,0], tel:'082 22 45 22'},
 {cat:'resto', nom:'Café Ardennais',       min:20, adr:"Av. Franchet d'Esperey 4, Dinant",       ferme:[],      tel:'082 22 33 50'},
 {cat:'resto', nom:'Miss Cocotte',         min:20, adr:'Rue du Pourrain 4, Gesves',              ferme:[1,2,3], tel:'0491 63 68 06'},
 {cat:'resto', nom:'Café Italien',         min:25, adr:'Rue de la Molignée 121, Anhée',          ferme:[1,2,3], tel:'082 61 17 19'},
 {cat:'resto', nom:"L'Effet Bœuf",         min:30, adr:'Rue des Chasseurs Ardennais 3, Marche',  ferme:[],      tel:'084 44 47 40'},
 {cat:'resto', nom:'Brasserie du Quai',    min:30, adr:'Rue du Quai 9, Namur',                   ferme:[],      tel:'081 65 70 03'},
 {cat:'resto', nom:"Barbetta's",           min:30, adr:'Rue Général Michel 31, Namur',           ferme:[1,2],   tel:'081 22 33 50', type:'Italien'},
 {cat:'gastro',nom:'Recto Verso',          min:5,  adr:'Avenue de Namur 29, Ciney',              ferme:[1,2],   tel:'083 33 00 47', mot:{fr:"À 5 minutes du gîte : une adresse bistronomique toute proche, idéale pour le premier soir. Réservation conseillée.", en:"5 minutes from the house: a bistro-style table close by, ideal for your first evening. Booking recommended.", nl:"Op 5 minuten van de gîte: een bistronomisch adres vlakbij, ideaal voor de eerste avond. Reserveren aangeraden.", de:"5 Minuten vom Haus: ein bistronomisches Restaurant ganz in der Nähe, ideal für den ersten Abend. Reservierung empfohlen.", es:"A 5 minutos de la casa: un bistró gastronómico muy cerca, ideal para la primera noche. Se recomienda reservar."}},
 {cat:'gastro',nom:'Au Gré des Saisons',   min:12, adr:"Rue d'Achet 70, Achet",                  ferme:[1,2],   tel:'083 65 75 65', type:'Bib Gourmand'},
 {cat:'gastro',nom:'Bistro Gourmand',      min:15, adr:'Route de Ciney 104, Sorinne',            ferme:[6,0],   tel:'0492 45 99 15', type:'Bib Gourmand'},
 {cat:'gastro',nom:'Le Trois X 15',        min:22, adr:'Rue Richier 45, Bouvignes',              ferme:[1,2,3], tel:'0473 39 23 30'},
 {cat:'gastro',nom:'Garde Manger',         min:22, adr:'Chaussée de Gramptinne 37, Faulx-les-Tombes', ferme:[2,3], tel:'083 44 66 31'},
 {cat:'gastro',nom:'Mona Lisa',            min:25, adr:'Rue Colonel Tachet 19, Yvoir',           ferme:[0,1],   tel:'082 71 30 19', type:'Bib Gourmand'},
 {cat:'gastro',nom:"La Grange d'Hamois",   min:8,  adr:"Chaussée d'Andenne 10A, Emptinne",       ferme:[0,1],   tel:'083 22 05 49', type:'Michelin ★', mot:{fr:"Une étoile Michelin à 8 minutes du gîte : l’adresse pour une belle occasion. Pensez à réserver.", en:"A Michelin star 8 minutes from the house: the place for a special occasion. Remember to book.", nl:"Een Michelinster op 8 minuten van de gîte: hét adres voor een speciale gelegenheid. Vergeet niet te reserveren.", de:"Ein Michelin-Stern 8 Minuten vom Haus entfernt: die Adresse für einen besonderen Anlass. Denken Sie an die Reservierung.", es:"Una estrella Michelin a 8 minutos de la casa: el sitio para una ocasión especial. No olvidéis reservar."}},
 {cat:'gastro',nom:'Bistro Blaise',        min:30, adr:'Rue Porte Haute 5, Marche-en-Famenne',   ferme:[0,1],   tel:'0470 89 57 12', type:'Michelin ★'},
 {cat:'gastro',nom:'La Roseraie',          min:30, adr:'Route de Limet 80, Modave',              ferme:[1,2,3], tel:'085 41 13 60', type:'Michelin ★'},
 {cat:'gastro',nom:"L'Essentiel",          min:35, adr:'Rue Roger Clément 32, Temploux',         ferme:[0,1,2], tel:'081 56 86 16', type:'Michelin ★'},
 {cat:'gastro',nom:'Eau Vive',             min:35, adr:'Route de Floreffe 37, Arbre',            ferme:[2,3],   tel:'081 41 11 51', type:'Michelin ★★'},
 {cat:'visite',nom:'Château de Vêves',     min:20, adr:'Celles (Houyet)',  regle:'saison', desc:'veves'},
 {cat:'visite',nom:"Jardins d’Annevoie",   min:25, adr:'Anhée',            regle:'avr-nov', desc:'annevoie'},
 {cat:'visite',nom:'Château de Freÿr',     min:25, adr:'Hastière',         regle:'saison', desc:'freyr'},
 {cat:'visite',nom:'Dinant',               min:20, adr:'Dinant',           regle:'annee',  desc:'dinant', mot:{fr:"À 20 minutes : la collégiale, la citadelle et les bords de Meuse. Une belle journée, en toute saison.", en:"20 minutes away: the collegiate church, the citadel and the Meuse riverside. A lovely day out in any season.", nl:"Op 20 minuten: de collegiale kerk, de citadel en de Maasoevers. Een mooie dag uit, in elk seizoen.", de:"20 Minuten entfernt: Stiftskirche, Zitadelle und Maasufer. Ein schöner Tagesausflug zu jeder Jahreszeit.", es:"A 20 minutos: la colegiata, la ciudadela y las orillas del Mosa. Un día estupendo en cualquier época del año."}},
 {cat:'visite',nom:'Abbaye de Maredsous',  min:25, adr:'Denée',            regle:'annee',  desc:'maredsous', mot:{fr:"À 25 minutes, toute l’année : l’abbaye, son fromage et sa bière. Une sortie qui plaît aux petits comme aux grands.", en:"25 minutes away, all year round: the abbey, its cheese and its beer. An outing for young and old alike.", nl:"Op 25 minuten, het hele jaar door: de abdij, haar kaas en haar bier. Een uitstap voor jong en oud.", de:"25 Minuten entfernt, das ganze Jahr über: die Abtei, ihr Käse und ihr Bier. Ein Ausflug für Groß und Klein.", es:"A 25 minutos, todo el año: la abadía, su queso y su cerveza. Una salida para pequeños y mayores."}},
 {cat:'visite',nom:'Citadelle de Namur',   min:30, adr:'Namur',            regle:'annee',  desc:'citadelle'},
 {cat:'visite',nom:'Domaine des Grottes de Han', min:35, adr:'Han-sur-Lesse', regle:'saison', desc:'han'},
 {cat:'sortie',nom:'Padel Ciney',          min:4,  adr:"Quai de l'Industrie 29, Ciney",          ferme:[],    tel:'083 21 27 53', desc:'padel', mot:{fr:"À 4 minutes et ouvert 7 jours sur 7 : parfait pour bouger en groupe. Réservez à l’avance le week-end.", en:"4 minutes away and open 7 days a week: perfect for getting active as a group. Book ahead at weekends.", nl:"Op 4 minuten en 7 dagen op 7 open: ideaal om samen te sporten. Reserveer in het weekend op voorhand.", de:"4 Minuten entfernt und 7 Tage die Woche geöffnet: ideal, um gemeinsam aktiv zu sein. Am Wochenende vorab reservieren.", es:"A 4 minutos y abierto todos los días: perfecto para hacer deporte en grupo. Reservad con antelación los fines de semana."}},
 {cat:'sortie',nom:'Karting & arcade',     min:30, adr:'Rue des Deux Provinces 1, Marche-en-Famenne', ferme:[1,2], tel:'084 77 02 22', desc:'karting'},
 {cat:'sortie',nom:'Bowling & billard',    min:30, adr:'Rue Baschamps 17, Marche-en-Famenne',    ferme:[1,2], tel:'084 38 77 18', desc:'bowling', pluie:true},
 {cat:'sortie',nom:'Escape Game Namur',    min:30, adr:'Avenue Prince de Liège 96, Jambes',      ferme:[],    tel:'0487 45 52 51', desc:'escape', pluie:true},
 {cat:'sortie',nom:'Lynx Escape Game',     min:30, adr:'Avenue Reine Élisabeth 125, Andenne',    ferme:[],    tel:'0479 44 82 71', desc:'escape', pluie:true},
 {cat:'sortie',nom:'Bowling, laser game & billard', min:35, adr:'Chaussée de Perwez 251, Saint-Servais', ferme:[], tel:'081 73 10 11', desc:'laser', pluie:true},
 {cat:'sortie',nom:'Play Arena',          min:5,  adr:'Rue Saint-Gilles, Ciney',               type:'Ouverture 2027'},
 {cat:'snack', nom:"McDonald's",           min:5,  adr:'Rue Saint-Gilles 65, Ciney',             ferme:[]},
 {cat:'balade',nom:'Trot-e-Fun',           min:20, adr:'Rue de la Tassenière 67, Dinant',        tel:'0493 37 76 80', type:'Trottinettes électriques'},
 {cat:'balade',nom:'ElectricA Travel',     min:20, adr:'Rue Saint-Martin 7, Dinant',             tel:'0473 87 73 92', type:'Vespa électriques'},
 {cat:'commerce',nom:'La Boucherie du Centre', min:3, adr:'Rue du Centre 36, Ciney',            tel:'083 68 96 57', type:'Boucherie'},
 {cat:'commerce',nom:'Boucherie des Frères Paul', min:3, adr:'Rue du Commerce 11, Ciney',        type:'Boucherie'},
 {cat:'commerce',nom:'La Gaillarde',       min:5,  adr:'Saint-Gilles 59, Ciney',                 tel:'083 63 30 75'},
 {cat:'commerce',nom:'Le bonheur est dans le pré', min:5, adr:'Saint-Gilles 57, Ciney',          tel:'083 21 75 25'},
 {cat:'chef',  nom:'Alexandre Régis', tel:'0477 57 68 57'},
 {cat:'chef',  nom:'Simon Denis',     tel:'0473 40 54 20'}
];

/* ---------- 3b. Supermarchés (relevé du 22/11/2026, annuaire bottin.be ; Aldi : adresse sur hours.be) ----------
   h = horaires du dimanche (0) au samedi (6) ; null = fermé ; h absent = horaires inconnus. */
RP.supermarchesVerifiesLe = '2026-11-22';
RP.supermarches = [
 {nom:'Carrefour Market Ciney Centre', adr:'Rue du Commerce 44, Ciney', h:['08:00-18:30','08:00-20:00','08:00-20:00','08:00-20:00','08:00-20:00','08:00-20:00','08:00-20:00'], doute:true},
 {nom:'Intermarché',                  adr:'Rue du Commerce 79, Ciney', h:['09:00-18:00','08:30-19:00','08:30-19:00','08:30-19:00','08:30-19:00','08:30-20:00','08:30-19:00']},
 {nom:'Delhaize',                     adr:'Chemin de Crahiat 18A, Ciney', h:['08:30-12:30','08:30-19:00','08:30-19:00','08:30-19:00','08:30-19:00','08:30-20:00','08:30-19:00']},
 {nom:'Colruyt',                      adr:'Saint-Gilles 17, Ciney', h:[null,'08:30-20:00','08:30-20:00','08:30-20:00','08:30-20:00','08:30-21:00','08:30-20:00']},
 {nom:'Aldi',                         adr:'Avenue Schlogel 119, Ciney'},
 {nom:'Lidl',                         adr:'Chemin du Tersoit 18, Ciney'}
];

/* ---------- 3c. Jeux du soir (SAFIO, sur la TV) ----------
   Les joueurs rejoignent avec leur téléphone en scannant le QR code affiché par l'écran TV de SAFIO.
   app : 'quiz' ou 'party' (répartition à confirmer par Sacha). Un jeu proposé par jour, à tour de rôle. */
RP.safio = { quiz: { nom: 'SAFIO Quiz', url: 'playsafio.com/quiz/tv', joueur: 'https://playsafio.com/quiz' }, party: { nom: 'SAFIO Party', url: 'playsafio.com/party/tv', joueur: 'https://playsafio.com/party' } };
RP.jeux = [
 {nom:'Quiz libre', app:'quiz', d:{fr:'Un quiz de culture générale : tout le monde répond en même temps sur son téléphone.',en:'A general knowledge quiz: everyone answers at the same time on their phone.',nl:'Een quiz over algemene kennis: iedereen antwoordt tegelijk op zijn telefoon.',de:'Ein Allgemeinwissen-Quiz: Alle antworten gleichzeitig auf ihrem Handy.',es:'Un quiz de cultura general: todos responden a la vez en su móvil.'}},
 {nom:'Mytho !', app:'party', d:{fr:'Inventez une fausse réponse crédible et piégez les autres.',en:'Invent a believable fake answer and fool the others.',nl:'Verzin een geloofwaardig vals antwoord en zet de anderen op het verkeerde been.',de:'Erfinden Sie eine glaubwürdige falsche Antwort und legen Sie die anderen herein.',es:'Inventad una respuesta falsa creíble y engañad a los demás.'}},
 {nom:'Éclair', app:'quiz', d:{fr:'Le plus rapide gagne : parfait pour réveiller tout le monde.',en:'The fastest wins: perfect to wake everyone up.',nl:'Wie het snelst is, wint: ideaal om iedereen wakker te schudden.',de:'Wer am schnellsten ist, gewinnt: ideal, um alle aufzuwecken.',es:'Gana el más rápido: perfecto para despertar a todos.'}},
 {nom:'Petit Bac', app:'party', d:{fr:'Une lettre, six catégories : trouvez un mot pour chacune, vite !',en:'One letter, six categories: find a word for each, fast!',nl:'Eén letter, zes categorieën: vind snel een woord voor elke categorie!',de:'Ein Buchstabe, sechs Kategorien: Finden Sie schnell ein Wort für jede!',es:'Una letra, seis categorías: ¡encontrad una palabra para cada una, rápido!'}},
 {nom:'Au plus près', app:'quiz', d:{fr:'Devinez le bon nombre : le plus proche gagne.',en:'Guess the right number: the closest wins.',nl:'Raad het juiste getal: wie er het dichtst bij zit, wint.',de:'Raten Sie die richtige Zahl: Wer am nächsten liegt, gewinnt.',es:'Adivinad el número correcto: gana el que más se acerque.'}},
 {nom:'Même cerveau', app:'party', d:{fr:'Répondez comme les autres pour marquer des points.',en:'Answer like the others to score points.',nl:'Antwoord zoals de anderen om punten te scoren.',de:'Antworten Sie wie die anderen, um Punkte zu sammeln.',es:'Responded como los demás para sumar puntos.'}},
 {nom:'Torpille', app:'quiz', d:{fr:'Une question, puis vous tirez : un quiz façon bataille navale.',en:'One question, then you fire: a quiz in battleship style.',nl:'Eén vraag, en dan vuren: een quiz in zeeslagstijl.',de:'Eine Frage, dann schießen Sie: ein Quiz im Stil von Schiffe versenken.',es:'Una pregunta y luego disparáis: un quiz al estilo de hundir la flota.'}},
 {nom:'C’est toi !', app:'party', d:{fr:'Votez pour la personne du groupe qui correspond le mieux à la phrase.',en:'Vote for the person in the group who best fits the sentence.',nl:'Stem op de persoon uit de groep die het best bij de zin past.',de:'Stimmen Sie für die Person aus der Gruppe, auf die der Satz am besten passt.',es:'Votad por la persona del grupo que mejor encaja con la frase.'}}
];
RP.jeuDuJour = d => RP.jeux[(RP.jourAn(d) + 5) % RP.jeux.length];

/* ---------- 4. Textes de l'interface (5 langues) ---------- */
RP.langues = { fr:'fr-BE', en:'en-GB', nl:'nl-BE', de:'de-DE', es:'es-ES' };
RP.nomsLangues = { fr:'Français', en:'English', nl:'Nederlands', de:'Deutsch', es:'Español' };

RP.t = {
 choose:{fr:'Choisissez votre langue',en:'Choose your language',nl:'Kies jullie taal',de:'Wählen Sie Ihre Sprache',es:'Elegid vuestro idioma'},
 nav:{fr:['Accueil',"Aujourd'hui",'Adresses','Aide','Courses','Photos'],en:['Home','Today','Places','Help','Shopping','Photos'],nl:['Welkom','Vandaag','Adressen','Hulp','Boodschappen',"Foto's"],de:['Start','Heute','Adressen','Hilfe','Einkauf','Fotos'],es:['Inicio','Hoy','Lugares','Ayuda','Compras','Fotos']},
 welcome:{fr:'Bienvenue au Rempart',en:'Welcome to Le Rempart',nl:'Welkom bij Le Rempart',de:'Willkommen im Le Rempart',es:'Bienvenidos a Le Rempart'},
 intro:{fr:'Je suis Sam, et je suis très heureux de vous accueillir. Prenez le temps de vous installer tranquillement et de vous sentir chez vous.',
  en:"I'm Sam, and I'm so pleased to welcome you. Take your time settling in and make yourself comfortable.",
  nl:'Ik ben Sam en ik ben heel blij jullie te mogen verwelkomen. Neem rustig de tijd om aan te komen en je op je gemak te voelen.',
  de:'Ich bin Sam und freue mich sehr, Sie begrüßen zu dürfen. Richten Sie sich ganz in Ruhe ein und fühlen Sie sich wie zu Hause.',
  es:'Soy Sam y me alegra mucho recibiros. Instalaos con calma y poneos cómodos.'},
 stay:{fr:'Votre séjour',en:'Your stay',nl:'Jullie verblijf',de:'Ihr Aufenthalt',es:'Vuestra estancia'},
 network:{fr:'Réseau',en:'Network',nl:'Netwerk',de:'Netzwerk',es:'Red'},
 pass:{fr:'Mot de passe',en:'Password',nl:'Wachtwoord',de:'Passwort',es:'Contraseña'},
 lockTitle:{fr:'Disponible à votre arrivée',en:'Available when you arrive',nl:'Beschikbaar bij jullie aankomst',de:'Verfügbar bei Ihrer Ankunft',es:'Disponible a vuestra llegada'},
 lockTxt:{fr:"Vous recevrez le Wi-Fi et les codes d'accès le jour prévu de votre arrivée, à partir de 13 h, quand vous prévenez Sam avec le bouton ci-dessous. L'album photo s'ouvre en même temps.",en:'You will receive the Wi-Fi and the access codes on your planned arrival day, from 1 p.m., when you let Sam know with the button below. The photo album opens at the same time.',nl:'Jullie krijgen de wifi en de toegangscodes op de geplande aankomstdag, vanaf 13 uur, wanneer jullie Sam verwittigen met de knop hieronder. Het fotoalbum opent tegelijk.',de:'Sie erhalten WLAN und Zugangscodes am geplanten Anreisetag ab 13 Uhr, wenn Sie Sam mit der Schaltfläche unten Bescheid geben. Das Fotoalbum öffnet sich zur gleichen Zeit.',es:'Recibiréis el wifi y los códigos de acceso el día previsto de vuestra llegada, a partir de las 13 h, cuando aviséis a Sam con el botón de abajo. El álbum de fotos se abre al mismo tiempo.'},
 lockFrom:{fr:'Ce bouton sera disponible le {d}, jour de votre arrivée, à partir de 13 h.',en:'This button will be available on {d}, your arrival day, from 1 p.m.',nl:'Deze knop is beschikbaar op {d}, jullie aankomstdag, vanaf 13 uur.',de:'Diese Schaltfläche ist am {d}, Ihrem Anreisetag, ab 13 Uhr verfügbar.',es:'Este botón estará disponible el {d}, día de vuestra llegada, a partir de las 13 h.'},
 retireTxt:{fr:'Sam vous donnera les codes directement.',en:'Sam will give you the codes directly.',nl:'Sam geeft jullie de codes rechtstreeks.',de:'Sam gibt Ihnen die Codes direkt.',es:'Sam os dará los códigos directamente.'},
 accessTitle:{fr:'Vos accès',en:'Your access',nl:'Jullie toegang',de:'Ihr Zugang',es:'Vuestros accesos'},
 gate:{fr:'Code du portail',en:'Gate code',nl:'Code van de poort',de:'Code für das Tor',es:'Código del portón'},
 door:{fr:'Code de la porte',en:'Door code',nl:'Deurcode',de:'Türcode',es:'Código de la puerta'},
 keepCodes:{fr:'Merci de garder ces codes pour votre groupe uniquement.',en:'Please keep these codes within your group.',nl:'Hou deze codes alsjeblieft binnen jullie groep.',de:'Bitte geben Sie diese Codes nur innerhalb Ihrer Gruppe weiter.',es:'Por favor, no compartáis estos códigos fuera de vuestro grupo.'},
 noCodes:{fr:'Sam vous donne les codes sur place.',en:'Sam will give you the codes on site.',nl:'Sam geeft jullie de codes ter plaatse.',de:'Sam gibt Ihnen die Codes vor Ort.',es:'Sam os dará los códigos allí mismo.'},
 wifiSoon:{fr:'Sam vous donne le Wi-Fi sur place.',en:'Sam will give you the Wi-Fi details on site.',nl:'Sam geeft jullie de wifi-gegevens ter plaatse.',de:'Sam gibt Ihnen die WLAN-Daten vor Ort.',es:'Sam os dará los datos del wifi allí mismo.'},
 arrDone:{fr:'Arrivée annoncée ✓',en:'Arrival announced ✓',nl:'Aankomst doorgegeven ✓',de:'Ankunft mitgeteilt ✓',es:'Llegada avisada ✓'},
 albumLocked:{fr:"L'album s'ouvre quand vous prévenez Sam de votre arrivée (onglet Accueil).",en:'The album opens when you let Sam know you are arriving (Home tab).',nl:'Het album opent zodra jullie Sam jullie aankomst laten weten (tabblad Welkom).',de:'Das Album öffnet sich, sobald Sie Sam Ihre Ankunft mitteilen (Reiter Start).',es:'El álbum se abre cuando avisáis a Sam de vuestra llegada (pestaña Inicio).'},
 guideOnly:{fr:"Le Wi-Fi et les codes d'accès sont dans votre lien personnel, envoyé par Sam.",en:'The Wi-Fi and access codes are in your personal link, sent by Sam.',nl:'De wifi en de toegangscodes staan in jullie persoonlijke link, verstuurd door Sam.',de:'WLAN und Zugangscodes finden Sie in Ihrem persönlichen Link von Sam.',es:'El wifi y los códigos de acceso están en vuestro enlace personal, enviado por Sam.'},
 codes:{fr:"Sam vous envoie les codes d'accès par message.",en:'Sam sends you the access codes by message.',nl:'Sam stuurt jullie de toegangscodes via een bericht.',de:'Sam schickt Ihnen die Zugangscodes per Nachricht.',es:'Sam os enviará los códigos de acceso por mensaje.'},
 arrBtn:{fr:'Prévenir Sam de mon arrivée',en:'Let Sam know when we arrive',nl:'Aankomst doorgeven aan Sam',de:'Sam meine Ankunft mitteilen',es:'Avisar a Sam de nuestra llegada'},
 arrHint:{fr:'Merci de prévenir au moins 2 heures avant votre arrivée.',en:'Please let him know at least 2 hours before you arrive.',nl:'Laat het ten minste 2 uur voor jullie aankomst weten.',de:'Bitte geben Sie mindestens 2 Stunden vor Ihrer Ankunft Bescheid.',es:'Avisad al menos 2 horas antes de llegar.'},
 arrTime:{fr:'Heure estimée',en:'Estimated time',nl:'Verwacht uur',de:'Voraussichtliche Uhrzeit',es:'Hora estimada'},
 arrSend:{fr:'Ouvrir WhatsApp',en:'Open WhatsApp',nl:'WhatsApp openen',de:'WhatsApp öffnen',es:'Abrir WhatsApp'},
 arrNote:{fr:'Le message s’ouvre dans WhatsApp. Il part seulement quand vous appuyez sur Envoyer.',en:'The message opens in WhatsApp. It is only sent when you tap Send.',nl:'Het bericht opent in WhatsApp. Het wordt pas verstuurd als jullie op Verzenden tikken.',de:'Die Nachricht öffnet sich in WhatsApp. Sie wird erst gesendet, wenn Sie auf Senden tippen.',es:'El mensaje se abre en WhatsApp. Solo se envía cuando pulsáis Enviar.'},
 arrMsg:{fr:'Bonjour Sam, nous arriverons au Rempart vers {t}.',en:'Hello Sam, we expect to arrive at Le Rempart around {t}.',nl:'Hallo Sam, we komen rond {t} aan bij Le Rempart.',de:'Hallo Sam, wir kommen gegen {t} Uhr im Le Rempart an.',es:'Hola Sam, llegaremos a Le Rempart hacia las {t}.'},
 askTitle:{fr:'Demandez à Sam',en:'Ask Sam',nl:'Vraag het aan Sam',de:'Fragen Sie Sam',es:'Preguntad a Sam'},
 askTxt:{fr:'Choisissez un sujet : WhatsApp s’ouvre avec un début de message. Vous complétez, puis vous envoyez.',en:'Choose a topic: WhatsApp opens with the start of a message. Complete it, then send.',nl:'Kies een onderwerp: WhatsApp opent met het begin van een bericht. Vul aan en verstuur.',de:'Wählen Sie ein Thema: WhatsApp öffnet sich mit einem Nachrichtenanfang. Ergänzen und senden Sie ihn.',es:'Elegid un tema: WhatsApp se abre con el inicio de un mensaje. Completadlo y enviadlo.'},
 askTopics:{fr:['Une question sur le gîte','Un conseil (resto, visite…)','Un appareil ne fonctionne pas','Autre chose'],en:['A question about the house','A tip (restaurant, visit…)','An appliance is not working','Something else'],nl:['Een vraag over de gîte','Een tip (restaurant, bezoek…)','Een toestel werkt niet','Iets anders'],de:['Eine Frage zum Haus','Ein Tipp (Restaurant, Ausflug…)','Ein Gerät funktioniert nicht','Etwas anderes'],es:['Una pregunta sobre la casa','Un consejo (restaurante, visita…)','Un aparato no funciona','Otra cosa']},
 askMsgs:{fr:['Bonjour Sam, j’ai une question sur le gîte : ','Bonjour Sam, pouvez-vous nous conseiller ','Bonjour Sam, cet appareil ne fonctionne pas : ','Bonjour Sam, '],en:['Hello Sam, I have a question about the house: ','Hello Sam, could you recommend ','Hello Sam, this appliance is not working: ','Hello Sam, '],nl:['Dag Sam, ik heb een vraag over de gîte: ','Dag Sam, kun je ons iets aanraden: ','Dag Sam, dit toestel werkt niet: ','Dag Sam, '],de:['Hallo Sam, ich habe eine Frage zum Haus: ','Hallo Sam, können Sie uns etwas empfehlen: ','Hallo Sam, dieses Gerät funktioniert nicht: ','Hallo Sam, '],es:['Hola Sam, tengo una pregunta sobre la casa: ','Hola Sam, ¿nos podrías recomendar ','Hola Sam, este aparato no funciona: ','Hola Sam, ']},
 contactTxt:{fr:'Une question ? Écrivez sur WhatsApp, c’est le plus rapide.',en:'A question? WhatsApp is the quickest way to reach us.',nl:'Een vraag? Via WhatsApp gaat het het snelst.',de:'Eine Frage? Über WhatsApp geht es am schnellsten.',es:'¿Alguna pregunta? Por WhatsApp es lo más rápido.'},
 writeWa:{fr:'Écrire sur WhatsApp',en:'Message on WhatsApp',nl:'Bericht via WhatsApp',de:'Über WhatsApp schreiben',es:'Escribir por WhatsApp'},
 sos:{fr:'Urgences & santé',en:'Emergencies & health',nl:'Noodgevallen & gezondheid',de:'Notfälle & Gesundheit',es:'Urgencias y salud'},
 sos1:{fr:'Urgences (ambulance, pompiers)',en:'Emergencies (ambulance, fire)',nl:'Noodnummer (ambulance, brandweer)',de:'Notruf (Rettung, Feuerwehr)',es:'Urgencias (ambulancia, bomberos)'},
 sos2:{fr:'Médecin de garde',en:'Doctor on call',nl:'Huisarts van wacht',de:'Ärztlicher Bereitschaftsdienst',es:'Médico de guardia'},
 sos3:{fr:'Pharmacie de garde',en:'Pharmacy on duty',nl:'Apotheek van wacht',de:'Notdienst-Apotheke',es:'Farmacia de guardia'},
 bike:{fr:'Un souci de vélo électrique ?',en:'E-bike trouble?',nl:'Problemen met een e-bike?',de:'Probleme mit dem E-Bike?',es:'¿Problemas con la bici eléctrica?'},
 saunaCode:{fr:'Code du sauna',en:'Sauna code',nl:'Code van de sauna',de:'Sauna-Code',es:'Código de la sauna'},
 /* Boutique déco (seulement la déco du gîte du séjour) */
 shopTitle:{fr:'La boutique déco',en:'The decor shop',nl:'De decoratiewinkel',de:'Die Deko-Boutique',es:'La tienda de decoración'},
 shopTeaser:{fr:'Les objets de déco de votre gîte sont à vendre. Un coup de cœur ? Il peut repartir avec vous.',en:'The decor pieces in your house are for sale. Fallen for one? It can go home with you.',nl:'De decoratiestukken in jullie gîte zijn te koop. Verliefd op een stuk? Het kan met jullie mee naar huis.',de:'Die Deko-Stücke in Ihrem Gîte sind zu verkaufen. Haben Sie sich verliebt? Es kann mit Ihnen nach Hause reisen.',es:'Las piezas de decoración de vuestra casa están a la venta. ¿Os habéis enamorado de alguna? Puede volver a casa con vosotros.'},
 shopOpen:{fr:'Découvrir la boutique',en:'Discover the shop',nl:'Ontdek de winkel',de:'Boutique entdecken',es:'Descubrir la tienda'},
 shopIntro:{fr:'Chaque pièce a été choisie pour votre gîte. Touchez « Je le veux » : WhatsApp s’ouvre avec un message prêt pour Sam, qui vous répond pour la suite.',en:'Every piece was chosen for your house. Tap “I want it”: WhatsApp opens with a message ready for Sam, who will reply with the next steps.',nl:'Elk stuk is voor jullie gîte uitgekozen. Tik op “Ik wil het”: WhatsApp opent met een bericht klaar voor Sam, die jullie verder helpt.',de:'Jedes Stück wurde für Ihr Gîte ausgewählt. Tippen Sie auf „Ich möchte es“: WhatsApp öffnet sich mit einer fertigen Nachricht an Sam, der Ihnen die nächsten Schritte erklärt.',es:'Cada pieza se eligió para vuestra casa. Tocad «Lo quiero»: WhatsApp se abre con un mensaje listo para Sam, que os responderá con los siguientes pasos.'},
 shopWant:{fr:'Je le veux',en:'I want it',nl:'Ik wil het',de:'Ich möchte es',es:'Lo quiero'},
 shopMsg:{fr:'Bonjour Sam, la déco « {n} »{r} nous plaît beaucoup. Est-il possible de l’acheter ?',en:'Hello Sam, we love the decor piece “{n}”{r}. Would it be possible to buy it?',nl:'Hallo Sam, het decoratiestuk “{n}”{r} bevalt ons heel erg. Is het mogelijk om het te kopen?',de:'Hallo Sam, das Deko-Stück „{n}“{r} gefällt uns sehr. Können wir es kaufen?',es:'Hola Sam, nos encanta la pieza de decoración «{n}»{r}. ¿Es posible comprarla?'},
 shopAsk:{fr:'Prix sur demande',en:'Price on request',nl:'Prijs op aanvraag',de:'Preis auf Anfrage',es:'Precio a consultar'},
 shopNone:{fr:'La sélection déco de ce gîte arrive bientôt.',en:'The decor selection for this house is coming soon.',nl:'De decoratieselectie van deze gîte komt binnenkort.',de:'Die Deko-Auswahl für dieses Gîte folgt in Kürze.',es:'La selección de decoración de esta casa llegará pronto.'},
 shopLink:{fr:'La boutique s’ouvre avec votre lien personnel, envoyé par Sam.',en:'The shop opens with your personal link, sent by Sam.',nl:'De winkel opent met jullie persoonlijke link, verstuurd door Sam.',de:'Die Boutique öffnet sich mit Ihrem persönlichen Link, den Sam Ihnen geschickt hat.',es:'La tienda se abre con vuestro enlace personal, enviado por Sam.'},
 shopErr:{fr:'La boutique ne répond pas. Réessayez dans un instant.',en:'The shop is not responding. Please try again in a moment.',nl:'De winkel reageert niet. Probeer het zo meteen opnieuw.',de:'Die Boutique antwortet nicht. Bitte versuchen Sie es gleich noch einmal.',es:'La tienda no responde. Volved a intentarlo en un momento.'},
 shopLoading:{fr:'Chargement de la boutique…',en:'Loading the shop…',nl:'De winkel wordt geladen…',de:'Boutique wird geladen…',es:'Cargando la tienda…'},
 shopWhere:{fr:'Où le trouver',en:'Where to find it',nl:'Waar te vinden',de:'Wo Sie es finden',es:'Dónde encontrarlo'},
 /* Signalement de casse (arrive dans l'inventaire du gîte) */
 brkTitle:{fr:'Signaler une casse',en:'Report a breakage',nl:'Schade melden',de:'Schaden melden',es:'Avisar de una rotura'},
 brkTeaser:{fr:'Un verre, une lampe, un meuble ? Un accident arrive. Dites-le-nous en une minute.',en:'A glass, a lamp, a piece of furniture? Accidents happen. Tell us in one minute.',nl:'Een glas, een lamp, een meubel? Een ongelukje gebeurt. Laat het ons in een minuut weten.',de:'Ein Glas, eine Lampe, ein Möbelstück? Ein Missgeschick passiert. Sagen Sie es uns in einer Minute.',es:'¿Un vaso, una lámpara, un mueble? Un accidente puede pasar. Contádnoslo en un minuto.'},
 brkIntro:{fr:'Merci de nous prévenir : nous pourrons tout remettre en ordre pour les prochains voyageurs. Si c’était déjà cassé à votre arrivée, dites-le aussi.',en:'Thank you for letting us know: we can then put everything right for the next guests. If it was already broken when you arrived, please tell us too.',nl:'Bedankt om het ons te laten weten: zo kunnen we alles in orde brengen voor de volgende gasten. Was het al kapot bij jullie aankomst? Meld het dan ook.',de:'Danke für Ihre Nachricht: So können wir alles für die nächsten Gäste in Ordnung bringen. Wenn es bei Ihrer Ankunft schon kaputt war, sagen Sie es uns bitte auch.',es:'Gracias por avisarnos: así podremos dejarlo todo en orden para los próximos huéspedes. Si ya estaba roto a vuestra llegada, decídnoslo también.'},
 brkRoom:{fr:'Pièce',en:'Room',nl:'Ruimte',de:'Raum',es:'Estancia'},
 brkRoomAny:{fr:'Autre pièce / je ne sais pas',en:'Another room / not sure',nl:'Andere ruimte / weet ik niet',de:'Anderer Raum / weiß nicht',es:'Otra estancia / no lo sé'},
 brkWhat:{fr:'Qu’est-ce qui est cassé ?',en:'What is broken?',nl:'Wat is er kapot?',de:'Was ist kaputt?',es:'¿Qué se ha roto?'},
 brkWhatPh:{fr:'Ex. : un verre à vin, la lampe de chevet',en:'E.g. a wine glass, the bedside lamp',nl:'Bv. een wijnglas, de nachtlamp',de:'Z. B. ein Weinglas, die Nachttischlampe',es:'Ej.: una copa de vino, la lámpara de la mesilla'},
 brkItem:{fr:'Objet',en:'Item',nl:'Voorwerp',de:'Gegenstand',es:'Objeto'},
 brkQty:{fr:'Nombre',en:'How many',nl:'Aantal',de:'Anzahl',es:'Cantidad'},
 brkWhen:{fr:'Quand ?',en:'When?',nl:'Wanneer?',de:'Wann?',es:'¿Cuándo?'},
 brkWhenStay:{fr:'Pendant notre séjour',en:'During our stay',nl:'Tijdens ons verblijf',de:'Während unseres Aufenthalts',es:'Durante nuestra estancia'},
 brkWhenArr:{fr:'C’était déjà ainsi à notre arrivée',en:'It was already like this when we arrived',nl:'Het was al zo bij onze aankomst',de:'Es war schon bei unserer Ankunft so',es:'Ya estaba así a nuestra llegada'},
 brkCom:{fr:'Un mot de plus (facultatif)',en:'Anything to add (optional)',nl:'Nog iets toe te voegen (optioneel)',de:'Noch etwas hinzuzufügen (freiwillig)',es:'¿Algo más? (opcional)'},
 brkPhoto:{fr:'Ajouter une photo (facultatif)',en:'Add a photo (optional)',nl:'Foto toevoegen (optioneel)',de:'Foto hinzufügen (freiwillig)',es:'Añadir una foto (opcional)'},
 brkPhotoOk:{fr:'Photo ajoutée ✓',en:'Photo added ✓',nl:'Foto toegevoegd ✓',de:'Foto hinzugefügt ✓',es:'Foto añadida ✓'},
 brkSend:{fr:'Envoyer le signalement',en:'Send the report',nl:'Melding versturen',de:'Meldung senden',es:'Enviar el aviso'},
 brkSending:{fr:'Envoi…',en:'Sending…',nl:'Versturen…',de:'Wird gesendet…',es:'Enviando…'},
 brkNeed:{fr:'Dites-nous ce qui est cassé.',en:'Please tell us what is broken.',nl:'Laat ons weten wat er kapot is.',de:'Bitte sagen Sie uns, was kaputt ist.',es:'Decidnos qué se ha roto.'},
 brkDone:{fr:'Merci, c’est bien noté.',en:'Thank you, it has been noted.',nl:'Bedankt, het is genoteerd.',de:'Danke, es ist notiert.',es:'Gracias, queda anotado.'},
 brkDoneTxt:{fr:'Votre signalement est enregistré pour l’équipe du Rempart. Vous pouvez aussi prévenir Sam sur WhatsApp.',en:'Your report has been saved for the Le Rempart team. You can also let Sam know on WhatsApp.',nl:'Jullie melding is opgeslagen voor het team van Le Rempart. Jullie kunnen Sam ook via WhatsApp verwittigen.',de:'Ihre Meldung ist für das Team von Le Rempart gespeichert. Sie können Sam auch über WhatsApp informieren.',es:'Vuestro aviso queda registrado para el equipo de Le Rempart. También podéis avisar a Sam por WhatsApp.'},
 brkWaBtn:{fr:'Prévenir aussi Sam',en:'Also tell Sam',nl:'Ook Sam verwittigen',de:'Auch Sam informieren',es:'Avisar también a Sam'},
 brkWaMsg:{fr:'Bonjour Sam, je signale une casse : ',en:'Hello Sam, I would like to report a breakage: ',nl:'Hallo Sam, ik meld een schade: ',de:'Hallo Sam, ich möchte einen Schaden melden: ',es:'Hola Sam, quiero avisar de una rotura: '},
 brkAgain:{fr:'Signaler autre chose',en:'Report something else',nl:'Iets anders melden',de:'Etwas anderes melden',es:'Avisar de otra cosa'},
 brkNoLink:{fr:'Sans votre lien personnel, le signalement part par WhatsApp vers Sam.',en:'Without your personal link, the report goes to Sam by WhatsApp.',nl:'Zonder jullie persoonlijke link gaat de melding via WhatsApp naar Sam.',de:'Ohne Ihren persönlichen Link geht die Meldung per WhatsApp an Sam.',es:'Sin vuestro enlace personal, el aviso se envía a Sam por WhatsApp.'},
 brkEarly:{fr:'Le signalement s’ouvre le jour de votre arrivée.',en:'Reporting opens on your arrival day.',nl:'Melden kan vanaf de dag van jullie aankomst.',de:'Meldungen sind ab Ihrem Anreisetag möglich.',es:'Los avisos se abren el día de vuestra llegada.'},
 brkErr:{fr:'L’envoi n’a pas marché. Réessayez, ou écrivez à Sam sur WhatsApp.',en:'Sending failed. Please try again, or message Sam on WhatsApp.',nl:'Versturen is mislukt. Probeer opnieuw of stuur Sam een bericht via WhatsApp.',de:'Das Senden hat nicht geklappt. Versuchen Sie es noch einmal oder schreiben Sie Sam über WhatsApp.',es:'No se ha podido enviar. Volved a intentarlo o escribid a Sam por WhatsApp.'},
 brkThis:{fr:'Signaler un dégât',en:'Report damage',nl:'Schade melden',de:'Schaden melden',es:'Avisar de un daño'},
 sound:{fr:'Activer le son',en:'Turn on sound',nl:'Geluid aanzetten',de:'Ton einschalten',es:'Activar el sonido'},
 poolTitle:{fr:'Piscine : règlement et responsabilités',en:'Swimming pool: rules and liability',nl:'Zwembad: reglement en aansprakelijkheid',de:'Schwimmbad: Benutzungsordnung und Haftung',es:'Piscina: normas y responsabilidad'},
 poolTxt:{fr:['La piscine n’est pas surveillée. Son utilisation se fait sous la seule et entière responsabilité des occupants du gîte.',
   'Les enfants mineurs ont accès à la piscine uniquement s’ils sont accompagnés, et sous la surveillance constante et effective de leurs parents ou d’un adulte responsable de leur groupe.',
   'Les parents, ou l’adulte qui les accompagne, sont seuls responsables des enfants dont ils ont la garde. En cas d’incident ou d’accident, leur responsabilité est engagée.',
   'Dans les limites prévues par la loi, le propriétaire décline toute responsabilité pour les accidents et les dommages corporels ou matériels causés par un défaut de surveillance ou par une utilisation non conforme à ce règlement.',
   'En utilisant la piscine, les occupants acceptent ce règlement.'],
  en:['The pool is not supervised. It is used at the sole and entire risk of the occupants of the house.',
   'Minors may use the pool only when accompanied, and under the constant and effective supervision of their parents or of a responsible adult from their group.',
   'Parents, or the accompanying adult, are solely responsible for the children in their care. In the event of an incident or accident, they are liable.',
   'To the extent permitted by law, the owner accepts no liability for accidents, personal injury or damage to property caused by a lack of supervision or by use that does not comply with these rules.',
   'By using the pool, the occupants accept these rules.'],
  nl:['Het zwembad is onbewaakt. Het gebruik gebeurt volledig op eigen verantwoordelijkheid van de bewoners van de gîte.',
   'Minderjarige kinderen mogen alleen naar het zwembad als ze begeleid worden, en onder voortdurend en daadwerkelijk toezicht van hun ouders of van een verantwoordelijke volwassene uit hun groep.',
   'De ouders, of de begeleidende volwassene, zijn als enigen verantwoordelijk voor de kinderen onder hun toezicht. Bij een incident of ongeval zijn zij aansprakelijk.',
   'Binnen de grenzen van de wet wijst de eigenaar elke aansprakelijkheid af voor ongevallen en voor lichamelijke of materiële schade door gebrekkig toezicht of door gebruik dat niet in overeenstemming is met dit reglement.',
   'Door het zwembad te gebruiken, aanvaarden de bewoners dit reglement.'],
  de:['Das Schwimmbad ist nicht beaufsichtigt. Die Benutzung erfolgt auf alleinige und volle Verantwortung der Bewohner der Unterkunft.',
   'Minderjährige dürfen das Schwimmbad nur in Begleitung und unter ständiger und tatsächlicher Aufsicht ihrer Eltern oder eines verantwortlichen Erwachsenen ihrer Gruppe benutzen.',
   'Die Eltern oder die begleitende erwachsene Person sind allein für die Kinder in ihrer Obhut verantwortlich. Bei einem Zwischenfall oder Unfall haften sie.',
   'Soweit gesetzlich zulässig, übernimmt der Eigentümer keine Haftung für Unfälle sowie Personen- oder Sachschäden, die durch mangelnde Aufsicht oder eine nicht ordnungsgemäße Benutzung entstehen.',
   'Mit der Benutzung des Schwimmbads erkennen die Bewohner diese Benutzungsordnung an.'],
  es:['La piscina no está vigilada. Su uso se realiza bajo la exclusiva y total responsabilidad de los ocupantes del alojamiento.',
   'Los menores solo pueden acceder a la piscina acompañados y bajo la vigilancia constante y efectiva de sus padres o de un adulto responsable de su grupo.',
   'Los padres, o el adulto que los acompaña, son los únicos responsables de los niños a su cargo. En caso de incidente o accidente, la responsabilidad es suya.',
   'Dentro de los límites previstos por la ley, el propietario declina toda responsabilidad por accidentes y daños personales o materiales causados por falta de vigilancia o por un uso no conforme a estas normas.',
   'Al utilizar la piscina, los ocupantes aceptan estas normas.']},
 tyre:{fr:'Un souci de pneu ?',en:'Tyre trouble?',nl:'Problemen met een band?',de:'Probleme mit einem Reifen?',es:'¿Problemas con un neumático?'},
 today:{fr:'Aujourd’hui au Rempart',en:'Today at Le Rempart',nl:'Vandaag in Le Rempart',de:'Heute im Le Rempart',es:'Hoy en Le Rempart'},
 weather:{fr:'Météo',en:'Weather',nl:'Weer',de:'Wetter',es:'Tiempo'},
 playTitle:{fr:'Ce soir, on joue ?',en:'Game night?',nl:'Vanavond een spelletje?',de:'Heute Abend ein Spiel?',es:'¿Jugamos esta noche?'},
 playGame:{fr:'Le jeu du jour',en:'Game of the day',nl:'Spel van de dag',de:'Spiel des Tages',es:'Juego del día'},
 playHow:{fr:'Sur la TV, ouvrez {app} dans le menu. Scannez ensuite le QR code affiché sur la TV avec vos téléphones : sans compte, chacun joue depuis son canapé.',en:'On the TV, open {app} from the menu. Then scan the QR code shown on the TV with your phones: no account needed, everyone plays from the sofa.',nl:'Open {app} in het menu van de tv. Scan daarna met jullie telefoons de QR-code op de tv: zonder account, iedereen speelt vanuit de zetel.',de:'Öffnen Sie {app} im Menü des Fernsehers. Scannen Sie dann den QR-Code auf dem Fernseher mit Ihren Handys: ohne Konto, alle spielen vom Sofa aus.',es:'En la tele, abrid {app} desde el menú. Después escanead con vuestros móviles el código QR que aparece en la tele: sin cuenta, cada uno juega desde el sofá.'},
 playDay:{fr:'On joue ensemble ?',en:'Shall we play together?',nl:'Samen spelen?',de:'Spielen wir zusammen?',es:'¿Jugamos juntos?'},
 playScan:{fr:'Lancez le jeu sur la TV, puis scannez pour rejoindre avec votre téléphone.',en:'Start the game on the TV, then scan to join with your phone.',nl:'Start het spel op de tv en scan daarna om mee te doen met je telefoon.',de:'Starten Sie das Spiel auf dem Fernseher und scannen Sie dann, um mit dem Handy mitzuspielen.',es:'Lanzad el juego en la tele y escanead para uniros con el móvil.'},
 playAlt:{fr:'Pas encore dans le menu ? Ouvrez le navigateur Internet de la TV et tapez {url}.',en:'Not in the menu yet? Open the TV’s internet browser and type {url}.',nl:'Nog niet in het menu? Open de internetbrowser van de tv en typ {url}.',de:'Noch nicht im Menü? Öffnen Sie den Internetbrowser des Fernsehers und geben Sie {url} ein.',es:'¿Todavía no está en el menú? Abrid el navegador de internet de la tele y escribid {url}.'},
 three:{fr:'Trois idées ouvertes aujourd’hui',en:'Three ideas open today',nl:'Drie ideeën, vandaag open',de:'Drei Ideen, heute geöffnet',es:'Tres ideas abiertas hoy'},
 rain:{fr:'S’il pleut',en:'If it rains',nl:'Als het regent',de:'Falls es regnet',es:'Si llueve'},
 src:{fr:'Selon notre livret d’accueil. Vérifiez les horaires avant de partir.',en:'Based on our welcome guide. Check opening hours before you go.',nl:'Volgens ons onthaalboekje. Controleer de openingsuren voor vertrek.',de:'Laut unserer Gästemappe. Bitte prüfen Sie die Öffnungszeiten vorab.',es:'Según nuestra guía de bienvenida. Comprobad el horario antes de ir.'},
 checked:{fr:'Vérifié le',en:'Checked on',nl:'Gecontroleerd op',de:'Geprüft am',es:'Comprobado el'},
 kEat:{fr:'Manger',en:'Eat',nl:'Eten',de:'Essen',es:'Comer'},
 kSee:{fr:'Visiter',en:'Visit',nl:'Bezoeken',de:'Besuchen',es:'Visitar'},
 kDo:{fr:'Sortir',en:'Go out',nl:'Uitstap',de:'Ausgehen',es:'Salir'},
 open:{fr:'Ouvert aujourd’hui',en:'Open today',nl:'Vandaag open',de:'Heute geöffnet',es:'Abierto hoy'},
 closed:{fr:'Fermé aujourd’hui',en:'Closed today',nl:'Vandaag gesloten',de:'Heute geschlossen',es:'Cerrado hoy'},
 season:{fr:'Horaires selon la saison',en:'Seasonal opening hours',nl:'Openingsuren volgens seizoen',de:'Saisonale Öffnungszeiten',es:'Horario según la temporada'},
 closedOn:{fr:'Fermé : ',en:'Closed: ',nl:'Gesloten: ',de:'Geschlossen: ',es:'Cerrado: '},
 daily:{fr:'Ouvert 7j/7',en:'Open 7 days a week',nl:'7 dagen op 7 open',de:'7 Tage die Woche geöffnet',es:'Abierto todos los días'},
 allyear:{fr:'Toute l’année',en:'All year round',nl:'Het hele jaar',de:'Ganzjährig',es:'Todo el año'},
 aprnov:{fr:'D’avril à novembre',en:'April to November',nl:'Van april tot november',de:'April bis November',es:'De abril a noviembre'},
 min:{fr:'min',en:'min',nl:'min',de:'Min.',es:'min'},
 carLong:{fr:'Temps en voiture depuis le gîte, hors trafic.',en:'Driving time from the house, without traffic.',nl:'Rijtijd vanaf de gîte, zonder verkeer.',de:'Fahrzeit ab dem Ferienhaus, ohne Verkehr.',es:'Tiempo en coche desde la casa, sin tráfico.'},
 address:{fr:'Adresse',en:'Address',nl:'Adres',de:'Adresse',es:'Dirección'},
 route:{fr:'Itinéraire',en:'Directions',nl:'Route',de:'Route',es:'Cómo llegar'},
 all:{fr:'Tout',en:'All',nl:'Alles',de:'Alle',es:'Todo'},
 pdf:{fr:'Livret complet (PDF)',en:'Full welcome guide (PDF)',nl:'Volledig onthaalboekje (pdf)',de:'Komplette Gästemappe (PDF)',es:'Guía completa (PDF)'},
 bookTitle:{fr:"Livret d'accueil",en:'Welcome guide',nl:'Onthaalboekje',de:'Gästemappe',es:'Guía de bienvenida'},
 bookSub:{fr:'Toutes nos bonnes adresses autour du gîte, avec le temps de trajet en voiture.',en:'All our favourite places around the house, with the driving time.',nl:'Al onze favoriete adressen rond het vakantiehuis, met de rijtijd.',de:'Alle unsere Lieblingsadressen rund um das Haus, mit der Fahrzeit.',es:'Todos nuestros sitios favoritos cerca de la casa, con el tiempo en coche.'},
 bookSave:{fr:'Enregistrer en PDF ou imprimer',en:'Save as PDF or print',nl:'Opslaan als pdf of afdrukken',de:'Als PDF speichern oder drucken',es:'Guardar en PDF o imprimir'},
 bookHow:{fr:'Sur le téléphone : choisissez « Enregistrer en PDF » dans la fenêtre qui s’ouvre.',en:'On a phone: choose “Save as PDF” in the window that opens.',nl:'Op de telefoon: kies ‘Opslaan als pdf’ in het venster dat opent.',de:'Auf dem Handy: Wählen Sie im sich öffnenden Fenster „Als PDF speichern“.',es:'En el móvil: elegid «Guardar como PDF» en la ventana que se abre.'},
 back:{fr:'Retour au guide',en:'Back to the guide',nl:'Terug naar de gids',de:'Zurück zum Führer',es:'Volver a la guía'},
 contactWa:{fr:'Nous contacter (WhatsApp)',en:'Contact us (WhatsApp)',nl:'Contact (WhatsApp)',de:'Kontakt (WhatsApp)',es:'Contacto (WhatsApp)'},
 chefNote:{fr:'Le chef vient cuisiner au gîte. À partir de 8 couverts. Réservez plusieurs jours à l’avance.',en:'The chef comes to cook at the house. From 8 guests. Book several days ahead.',nl:'De chef komt in de gîte koken. Vanaf 8 personen. Enkele dagen vooraf reserveren.',de:'Der Koch kocht bei Ihnen im Haus. Ab 8 Personen. Einige Tage im Voraus buchen.',es:'El chef viene a cocinar a la casa. A partir de 8 comensales. Reservad con varios días de antelación.'},
 pepite:{fr:'Pépite du Rempart',en:'A Le Rempart gem',nl:'Pareltje van Le Rempart',de:'Tipp vom Le Rempart',es:'Joya de Le Rempart'},
 pepites:{fr:'Les pépites du Rempart',en:'Le Rempart’s gems',nl:'Pareltjes van Le Rempart',de:'Tipps vom Le Rempart',es:'Las joyas de Le Rempart'},
 pepiteJour:{fr:'La pépite du jour',en:'Today’s gem',nl:'Pareltje van de dag',de:'Tipp des Tages',es:'La joya del día'},
 help:{fr:'Vidéos d’aide',en:'Help videos',nl:'Hulpvideo’s',de:'Hilfevideos',es:'Vídeos de ayuda'},
 helpTxt:{fr:'Scannez le QR code près de l’appareil, ou choisissez-le ici.',en:'Scan the QR code next to the appliance, or choose it here.',nl:'Scan de QR-code bij het toestel, of kies het hier.',de:'Scannen Sie den QR-Code am Gerät oder wählen Sie es hier aus.',es:'Escanead el código QR junto al aparato o elegidlo aquí.'},
 soon:{fr:'Bientôt disponible',en:'Coming soon',nl:'Binnenkort beschikbaar',de:'Bald verfügbar',es:'Disponible pronto'},
 helpAsk:{fr:'Un appareil ne fonctionne pas ? Écrivez à Sam.',en:'Is an appliance not working? Message Sam.',nl:'Werkt een toestel niet? Stuur Sam een bericht.',de:'Funktioniert ein Gerät nicht? Schreiben Sie Sam.',es:'¿No funciona un aparato? Escribid a Sam.'},
 list:{fr:'Liste de courses',en:'Shopping list',nl:'Boodschappenlijst',de:'Einkaufsliste',es:'Lista de la compra'},
 listTxt:{fr:'Gardée sur ce téléphone. Effacée automatiquement à la fin du séjour.',en:'Kept on this phone. Cleared automatically at the end of your stay.',nl:'Bewaard op deze telefoon. Wordt automatisch gewist aan het einde van jullie verblijf.',de:'Auf diesem Handy gespeichert. Wird am Ende Ihres Aufenthalts automatisch gelöscht.',es:'Se guarda en este móvil. Se borra automáticamente al final de la estancia.'},
 listShared:{fr:'Liste partagée : tout le groupe la voit avec le lien du séjour. Effacée automatiquement après le départ.',en:'Shared list: everyone with the stay link sees it. Deleted automatically after you leave.',nl:'Gedeelde lijst: iedereen met de verblijfslink ziet hem. Wordt na vertrek automatisch gewist.',de:'Gemeinsame Liste: Alle mit dem Aufenthaltslink sehen sie. Wird nach der Abreise automatisch gelöscht.',es:'Lista compartida: la ve todo el grupo con el enlace de la estancia. Se borra automáticamente tras la salida.'},
 offline:{fr:'Pas de connexion. Réessayez dans un instant.',en:'No connection. Please try again in a moment.',nl:'Geen verbinding. Probeer het zo opnieuw.',de:'Keine Verbindung. Bitte gleich noch einmal versuchen.',es:'Sin conexión. Volved a intentarlo en un momento.'},
 album:{fr:'Album du séjour',en:'Stay album',nl:'Album van het verblijf',de:'Album des Aufenthalts',es:'Álbum de la estancia'},
 albumTxt:{fr:'Privé : seules les personnes qui ont le lien de votre séjour voient ces photos. Rien n’est publié. Toutes les photos sont supprimées automatiquement après votre départ.',en:'Private: only people with your stay link can see these photos. Nothing is published. All photos are deleted automatically after you leave.',nl:'Privé: alleen wie de link van jullie verblijf heeft, ziet deze foto’s. Er wordt niets gepubliceerd. Alle foto’s worden na jullie vertrek automatisch gewist.',de:'Privat: Nur Personen mit Ihrem Aufenthaltslink sehen diese Fotos. Nichts wird veröffentlicht. Alle Fotos werden nach Ihrer Abreise automatisch gelöscht.',es:'Privado: solo quien tenga el enlace de vuestra estancia ve estas fotos. No se publica nada. Todas las fotos se borran automáticamente tras vuestra salida.'},
 albumSave:{fr:'Pensez à enregistrer vos photos avant le {d} : touchez une photo pour l’ouvrir, puis enregistrez-la.',en:'Remember to save your photos before {d}: tap a photo to open it, then save it.',nl:'Bewaar jullie foto’s vóór {d}: tik op een foto om hem te openen en sla hem dan op.',de:'Speichern Sie Ihre Fotos vor dem {d}: Tippen Sie auf ein Foto, um es zu öffnen, und speichern Sie es dann.',es:'Acordaos de guardar vuestras fotos antes del {d}: tocad una foto para abrirla y luego guardadla.'},
 addPhoto:{fr:'Ajouter des photos',en:'Add photos',nl:'Foto’s toevoegen',de:'Fotos hinzufügen',es:'Añadir fotos'},
 sending:{fr:'Envoi…',en:'Uploading…',nl:'Uploaden…',de:'Wird hochgeladen…',es:'Subiendo…'},
 albumEmpty:{fr:'Aucune photo pour l’instant.',en:'No photos yet.',nl:'Nog geen foto’s.',de:'Noch keine Fotos.',es:'Todavía no hay fotos.'},
 delPhoto:{fr:'Supprimer',en:'Delete',nl:'Verwijderen',de:'Löschen',es:'Borrar'},
 delSure:{fr:'Confirmer ?',en:'Confirm?',nl:'Bevestigen?',de:'Bestätigen?',es:'¿Confirmar?'},
 photoErr:{fr:'Une photo n’a pas pu être envoyée.',en:'A photo could not be uploaded.',nl:'Een foto kon niet worden geüpload.',de:'Ein Foto konnte nicht hochgeladen werden.',es:'No se ha podido subir una foto.'},
 invite:{fr:'Inviter mon groupe',en:'Invite my group',nl:'Mijn groep uitnodigen',de:'Meine Gruppe einladen',es:'Invitar a mi grupo'},
 inviteMsg:{fr:'Notre guide du Rempart (liste de courses commune et album privé) :',en:'Our Le Rempart guide (shared shopping list and private album):',nl:'Onze gids van Le Rempart (gedeelde boodschappenlijst en privé-album):',de:'Unser Le-Rempart-Guide (gemeinsame Einkaufsliste und privates Album):',es:'Nuestra guía de Le Rempart (lista de la compra común y álbum privado):'},
 albTitre:{fr:'Le titre de votre album',en:'Your album title',nl:'De titel van jullie album',de:'Der Titel Ihres Albums',es:'El título de vuestro álbum'},
 albTitrePh:{fr:'Ex. : Les retrouvailles en famille',en:'E.g. The family reunion',nl:'Bv. Ons familieweekend',de:'Z. B. Unser Familientreffen',es:'Ej.: El reencuentro familiar'},
 albTitreTxt:{fr:'Il s’affiche sur la couverture de votre album souvenir. Tout le groupe peut le changer.',en:'It appears on the cover of your keepsake album. Anyone in the group can change it.',nl:'Hij staat op de cover van jullie aandenken. Iedereen in de groep kan hem aanpassen.',de:'Er steht auf dem Titelblatt Ihres Erinnerungsalbums. Alle in der Gruppe können ihn ändern.',es:'Aparece en la portada de vuestro álbum de recuerdo. Cualquiera del grupo puede cambiarlo.'},
 capPh:{fr:'Un petit mot (facultatif)',en:'A few words (optional)',nl:'Een woordje (optioneel)',de:'Ein paar Worte (optional)',es:'Unas palabras (opcional)'},
 souvenir:{fr:'Créer notre souvenir',en:'Create our keepsake',nl:'Ons aandenken maken',de:'Unsere Erinnerung erstellen',es:'Crear nuestro recuerdo'},
 souvenirTxt:{fr:'Un album de plusieurs pages avec vos photos et vos mots, à garder ou à partager. Il est créé sur votre téléphone : rien n’est publié.',en:'A multi-page album with your photos and words, to keep or share. It is made on your phone: nothing is published.',nl:'Een album van meerdere pagina’s met jullie foto’s en woorden, om te bewaren of te delen. Het wordt op jullie telefoon gemaakt: er wordt niets gepubliceerd.',de:'Ein mehrseitiges Album mit Ihren Fotos und Worten, zum Behalten oder Teilen. Es wird auf Ihrem Handy erstellt: Nichts wird veröffentlicht.',es:'Un álbum de varias páginas con vuestras fotos y palabras, para guardar o compartir. Se crea en vuestro móvil: no se publica nada.'},
 souvenirTitle:{fr:'Notre séjour au Rempart',en:'Our stay at Le Rempart',nl:'Ons verblijf in Le Rempart',de:'Unser Aufenthalt im Le Rempart',es:'Nuestra estancia en Le Rempart'},
 souvenirSign:{fr:'Le Rempart · Gîtes à Ciney, Belgique',en:'Le Rempart · Holiday houses in Ciney, Belgium',nl:'Le Rempart · Vakantiewoningen in Ciney, België',de:'Le Rempart · Ferienhäuser in Ciney, Belgien',es:'Le Rempart · Casas rurales en Ciney, Bélgica'},
 souvenirFoot:{fr:'Souvenir de séjour',en:'Holiday memories',nl:'Vakantieherinnering',de:'Urlaubserinnerung',es:'Recuerdo de la estancia'},
 ourStay:{fr:'Notre séjour',en:'Our stay',nl:'Ons verblijf',de:'Unser Aufenthalt',es:'Nuestra estancia'},
 savePdf:{fr:'Télécharger l’album (PDF)',en:'Download the album (PDF)',nl:'Album downloaden (pdf)',de:'Album herunterladen (PDF)',es:'Descargar el álbum (PDF)'},
 pagesN:{fr:'{n} pages · touchez une page pour l’agrandir.',en:'{n} pages · tap a page to enlarge it.',nl:'{n} pagina’s · tik op een pagina om ze te vergroten.',de:'{n} Seiten · Tippen Sie auf eine Seite, um sie zu vergrößern.',es:'{n} páginas · tocad una página para ampliarla.'},
 making:{fr:'Création…',en:'Creating…',nl:'Bezig…',de:'Wird erstellt…',es:'Creando…'},
 save:{fr:'Enregistrer l’image',en:'Save the image',nl:'Afbeelding bewaren',de:'Bild speichern',es:'Guardar la imagen'},
 shareImg:{fr:'Partager',en:'Share',nl:'Delen',de:'Teilen',es:'Compartir'},
 souvenirErr:{fr:'Le souvenir n’a pas pu être créé. Réessayez.',en:'The keepsake could not be created. Please try again.',nl:'Het aandenken kon niet worden gemaakt. Probeer opnieuw.',de:'Die Erinnerung konnte nicht erstellt werden. Bitte erneut versuchen.',es:'No se ha podido crear el recuerdo. Volved a intentarlo.'},
 souvenirBefore:{fr:'Créez votre souvenir avant le {d} : ensuite, l’album est supprimé.',en:'Create your keepsake before {d}: after that, the album is deleted.',nl:'Maak jullie aandenken vóór {d}: daarna wordt het album gewist.',de:'Erstellen Sie Ihre Erinnerung vor dem {d}: Danach wird das Album gelöscht.',es:'Cread vuestro recuerdo antes del {d}: después, el álbum se borra.'},
 addPh:{fr:'Ajouter un article',en:'Add an item',nl:'Artikel toevoegen',de:'Artikel hinzufügen',es:'Añadir un artículo'},
 add:{fr:'Ajouter',en:'Add',nl:'Toevoegen',de:'Hinzufügen',es:'Añadir'},
 empty:{fr:'Votre liste est vide.',en:'Your list is empty.',nl:'Jullie lijst is leeg.',de:'Ihre Liste ist leer.',es:'Vuestra lista está vacía.'},
 clearDone:{fr:'Retirer les articles cochés',en:'Remove ticked items',nl:'Aangevinkte artikelen verwijderen',de:'Abgehakte Artikel entfernen',es:'Quitar los artículos marcados'},
 share:{fr:'Partager par WhatsApp',en:'Share on WhatsApp',nl:'Delen via WhatsApp',de:'Über WhatsApp teilen',es:'Compartir por WhatsApp'},
 bread:{fr:'Pain frais : voir les boulangeries dans Adresses.',en:'Fresh bread: see the bakeries under Places.',nl:'Vers brood: zie de bakkers bij Adressen.',de:'Frisches Brot: siehe Bäckereien unter Adressen.',es:'Pan recién hecho: ver panaderías en Lugares.'},
 ended:{fr:'Votre séjour au Rempart est terminé',en:'Your stay at Le Rempart has ended',nl:'Jullie verblijf in Le Rempart is voorbij',de:'Ihr Aufenthalt im Le Rempart ist beendet',es:'Vuestra estancia en Le Rempart ha terminado'},
 endedTxt:{fr:'Merci pour votre visite. Les informations de ce séjour ne sont plus disponibles. Une question ? Sam reste joignable.',en:'Thank you for your visit. The information for this stay is no longer available. Any questions? You can still reach Sam.',nl:'Bedankt voor jullie bezoek. De informatie van dit verblijf is niet meer beschikbaar. Een vraag? Sam blijft bereikbaar.',de:'Vielen Dank für Ihren Besuch. Die Informationen zu diesem Aufenthalt sind nicht mehr verfügbar. Bei Fragen ist Sam weiterhin erreichbar.',es:'Gracias por vuestra visita. La información de esta estancia ya no está disponible. ¿Alguna pregunta? Sam sigue a vuestra disposición.'},
 tvWifi:{fr:'Wi-Fi du gîte',en:'Wi-Fi',nl:'Wifi',de:'WLAN',es:'Wi-Fi'},
 tvWifiScan:{fr:'Scannez pour vous connecter',en:'Scan to connect',nl:'Scan om te verbinden',de:'Scannen zum Verbinden',es:'Escanead para conectaros'},
 tvApp:{fr:'Votre guide du séjour',en:'Your stay guide',nl:'Jullie verblijfsgids',de:'Ihr Aufenthaltsführer',es:'Vuestra guía de la estancia'},
 tvAppScan:{fr:'Scannez avec votre téléphone',en:'Scan with your phone',nl:'Scan met jullie telefoon',de:'Mit dem Handy scannen',es:'Escanead con el móvil'},
 shops:{fr:'Supermarchés proches',en:'Nearby supermarkets',nl:'Supermarkten in de buurt',de:'Supermärkte in der Nähe',es:'Supermercados cercanos'},
 shut:{fr:'fermé',en:'closed',nl:'gesloten',de:'geschlossen',es:'cerrado'},
 openNow:{fr:'Ouvert maintenant',en:'Open now',nl:'Nu open',de:'Jetzt geöffnet',es:'Abierto ahora'},
 closedNow:{fr:'Fermé maintenant',en:'Closed now',nl:'Nu gesloten',de:'Jetzt geschlossen',es:'Cerrado ahora'},
 todayH:{fr:'Aujourd’hui',en:'Today',nl:'Vandaag',de:'Heute',es:'Hoy'},
 hUnknown:{fr:'Horaires à vérifier',en:'Opening hours to be checked',nl:'Openingsuren nog te controleren',de:'Öffnungszeiten bitte prüfen',es:'Horario por confirmar'},
 shopsSrc:{fr:'Horaires relevés le {d} dans un annuaire en ligne. Ils peuvent changer, surtout les jours fériés.',en:'Opening hours taken from an online directory on {d}. They may change, especially on public holidays.',nl:'Openingsuren overgenomen uit een online gids op {d}. Ze kunnen wijzigen, vooral op feestdagen.',de:'Öffnungszeiten am {d} aus einem Online-Verzeichnis übernommen. Sie können sich ändern, besonders an Feiertagen.',es:'Horarios tomados de un directorio en línea el {d}. Pueden cambiar, sobre todo en días festivos.'},
 remind:{fr:'Ajouter un rappel à mon agenda',en:'Add a reminder to my calendar',nl:'Herinnering in mijn agenda zetten',de:'Erinnerung in meinen Kalender eintragen',es:'Añadir un recordatorio a mi calendario'},
 remindNote:{fr:'Rappel 2 heures avant l’heure estimée, pour prévenir Sam.',en:'Reminder 2 hours before your estimated time, to let Sam know.',nl:'Herinnering 2 uur voor het verwachte uur, om Sam te verwittigen.',de:'Erinnerung 2 Stunden vor der voraussichtlichen Uhrzeit, um Sam Bescheid zu geben.',es:'Recordatorio 2 horas antes de la hora estimada, para avisar a Sam.'},
 remindTitle:{fr:'Prévenir Sam de notre arrivée (Le Rempart)',en:'Let Sam know we are arriving (Le Rempart)',nl:'Sam laten weten dat we aankomen (Le Rempart)',de:'Sam unsere Ankunft mitteilen (Le Rempart)',es:'Avisar a Sam de nuestra llegada (Le Rempart)'},
 bye:{fr:'Bon séjour au Rempart !',en:'Enjoy your stay at Le Rempart!',nl:'Fijn verblijf in Le Rempart!',de:'Einen schönen Aufenthalt im Le Rempart!',es:'¡Que disfrutéis de Le Rempart!'},
 cats:{
  pain:{fr:'Boulangeries & douceurs',en:'Bakeries & treats',nl:'Bakkers & lekkers',de:'Bäckereien & Süßes',es:'Panaderías y dulces'},
  snack:{fr:'Petite faim',en:'Quick bites',nl:'Snelle hap',de:'Imbiss',es:'Para picar'},
  resto:{fr:'Restaurants',en:'Restaurants',nl:'Restaurants',de:'Restaurants',es:'Restaurantes'},
  gastro:{fr:'Tables gastronomiques',en:'Fine dining',nl:'Gastronomie',de:'Gehobene Küche',es:'Alta cocina'},
  visite:{fr:'À visiter',en:'To visit',nl:'Bezienswaardig',de:'Sehenswertes',es:'Para visitar'},
  sortie:{fr:'Activités',en:'Activities',nl:'Activiteiten',de:'Aktivitäten',es:'Actividades'},
  balade:{fr:'Balades électriques',en:'Electric rides',nl:'Elektrische tochten',de:'Elektro-Touren',es:'Paseos eléctricos'},
  commerce:{fr:'Commerces',en:'Shops',nl:'Winkels',de:'Geschäfte',es:'Tiendas'},
  chef:{fr:'Chefs à domicile',en:'Private chefs',nl:'Chef aan huis',de:'Koch ins Haus',es:'Chef a domicilio'}
 },
 desc:{
  veves:{fr:'Château médiéval à tourelles',en:'Medieval castle with turrets',nl:'Middeleeuws kasteel met torentjes',de:'Mittelalterliche Burg mit Türmchen',es:'Castillo medieval con torreones'},
  annevoie:{fr:'Jardins d’eau du XVIIIe siècle',en:'18th-century water gardens',nl:'Watertuinen uit de 18e eeuw',de:'Wassergärten aus dem 18. Jahrhundert',es:'Jardines de agua del siglo XVIII'},
  freyr:{fr:'Château et jardins en bord de Meuse',en:'Castle and gardens on the Meuse',nl:'Kasteel en tuinen aan de Maas',de:'Schloss und Gärten an der Maas',es:'Castillo y jardines a orillas del Mosa'},
  dinant:{fr:'Collégiale, citadelle, bords de Meuse',en:'Collegiate church, citadel, Meuse riverside',nl:'Collegiale kerk, citadel, Maasoevers',de:'Stiftskirche, Zitadelle, Maasufer',es:'Colegiata, ciudadela, orillas del Mosa'},
  maredsous:{fr:'Abbaye, fromage et bière',en:'Abbey, cheese and beer',nl:'Abdij, kaas en bier',de:'Abtei, Käse und Bier',es:'Abadía, queso y cerveza'},
  citadelle:{fr:'Souterrains, téléphérique, vue sur la Meuse',en:'Underground passages, cable car, view over the Meuse',nl:'Ondergrondse gangen, kabelbaan, zicht op de Maas',de:'Unterirdische Gänge, Seilbahn, Blick auf die Maas',es:'Galerías subterráneas, teleférico, vistas al Mosa'},
  han:{fr:'Grottes et parc animalier',en:'Caves and wildlife park',nl:'Grotten en dierenpark',de:'Höhlen und Tierpark',es:'Cuevas y parque de animales'},
  padel:{fr:'Padel',en:'Padel',nl:'Padel',de:'Padel',es:'Pádel'},
  karting:{fr:'Karting, jeux d’arcade',en:'Karting, arcade games',nl:'Karting, arcadespellen',de:'Kartbahn, Arcade-Spiele',es:'Karting, juegos recreativos'},
  bowling:{fr:'Bowling, billard',en:'Bowling, pool',nl:'Bowling, biljart',de:'Bowling, Billard',es:'Bolos, billar'},
  escape:{fr:'Escape game',en:'Escape room',nl:'Escape room',de:'Escape Room',es:'Escape room'},
  laser:{fr:'Bowling, laser game, billard',en:'Bowling, laser tag, pool',nl:'Bowling, lasergame, biljart',de:'Bowling, Lasertag, Billard',es:'Bolos, láser tag, billar'}
 },
 eq:{tv:{fr:'Télévision',en:'Television',nl:'Televisie',de:'Fernseher',es:'Televisión'},piscine:{fr:'Piscine',en:'Swimming pool',nl:'Zwembad',de:'Schwimmbad',es:'Piscina'},kicker:{fr:'Kicker',en:'Table football',nl:'Tafelvoetbal',de:'Tischkicker',es:'Futbolín'},
  lave:{fr:'Lave-linge et sèche-linge',en:'Washer and dryer',nl:'Wasmachine en droogkast',de:'Waschmaschine und Trockner',es:'Lavadora y secadora'},
  sauna:{fr:'Sauna',en:'Sauna',nl:'Sauna',de:'Sauna',es:'Sauna'},
  four:{fr:'Four',en:'Oven',nl:'Oven',de:'Backofen',es:'Horno'},
  micro:{fr:'Micro-ondes',en:'Microwave',nl:'Microgolfoven',de:'Mikrowelle',es:'Microondas'},
  taque:{fr:'Taque de cuisson',en:'Hob',nl:'Kookplaat',de:'Kochfeld',es:'Placa de cocina'},
  flipper:{fr:'Flipper',en:'Pinball machine',nl:'Flipperkast',de:'Flipper',es:'Máquina de pinball'},
  homecinema:{fr:'Home cinéma',en:'Home cinema',nl:'Thuisbioscoop',de:'Heimkino',es:'Cine en casa'},
  acces:{fr:'Entrer et sortir',en:'Getting in and out',nl:'Binnenkomen en buitengaan',de:'Ein- und Ausgang',es:'Entrar y salir'},
  feu:{fr:'Feu de bois',en:'Wood fire',nl:'Houtvuur',de:'Kaminfeuer',es:'Fuego de leña'},
  vapeur:{fr:'Four vapeur',en:'Steam oven',nl:'Stoomoven',de:'Dampfgarer',es:'Horno de vapor'},
  cafe:{fr:'Machine à café',en:'Coffee machine',nl:'Koffiemachine',de:'Kaffeemaschine',es:'Cafetera'},
  cuisine23:{fr:'Four, vapeur et micro-ondes',en:'Oven, steam oven and microwave',nl:'Oven, stoomoven en microgolfoven',de:'Backofen, Dampfgarer und Mikrowelle',es:'Horno, horno de vapor y microondas'}}
};

/* ---------- 5. Fonctions communes ---------- */
RP.esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
RP.waNumber = () => RP.config.whatsapp.replace(/[^\d]/g, '');
RP.dayName = (lang, d) => new Intl.DateTimeFormat(RP.langues[lang], {weekday:'long'}).format(new Date(2026, 10, 22 + d)); // 22/11/2026 = dimanche
RP.statut = (p, date, lang) => {
  const T = k => RP.t[k][lang], dow = date.getDay(), m = date.getMonth() + 1;
  if (p.regle === 'saison') return {s:'warn', txt:T('season')};
  if (p.regle === 'annee') return {s:'ok', txt:T('allyear')};
  if (p.regle === 'avr-nov') return (m >= 4 && m <= 11) ? {s:'ok', txt:T('aprnov')} : {s:'no', txt:T('closed')};
  if (!p.ferme) return {s:'none', txt:''};
  return p.ferme.includes(dow) ? {s:'no', txt:T('closed')} : {s:'ok', txt:T('open')};
};
RP.ouvert = (p, date) => RP.statut(p, date, 'fr').s === 'ok';
RP.fermeTxt = (p, lang) => {
  if (!Array.isArray(p.ferme)) return '';
  if (!p.ferme.length) return RP.t.daily[lang];
  return RP.t.closedOn[lang] + p.ferme.slice().sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7)).map(d => RP.dayName(lang, d)).join(', ');
};
RP.carte = p => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(p.nom + ', ' + p.adr);
RP.jourAn = d => Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 864e5);
RP.choisir = (cats, date) => {
  const c = RP.adresses.filter(p => cats.includes(p.cat) && RP.ouvert(p, date) && p.min <= 30);
  return c.length ? c[RP.jourAn(date) % c.length] : null;
};
RP.idees = (date, lang) => [[RP.t.kEat[lang], RP.choisir(['resto', 'gastro'], date)], [RP.t.kSee[lang], RP.choisir(['visite'], date)], [RP.t.kDo[lang], RP.choisir(['sortie'], date)]];
RP.pepiteDuJour = date => {
  const c = RP.adresses.filter(p => p.mot && (RP.ouvert(p, date) || p.regle === 'annee'));
  return c.length ? c[(RP.jourAn(date) + 3) % c.length] : null;
};
RP.horaireJour = (m, date) => m.h ? m.h[date.getDay()] : undefined;
RP.ouvertMaintenant = (m, date) => {
  const h = RP.horaireJour(m, date); if (!h) return h === null ? false : undefined;
  const [a, b] = h.split('-'), t = date.getHours() * 60 + date.getMinutes(), mn = x => +x.slice(0,2) * 60 + +x.slice(3);
  return t >= mn(a) && t < mn(b);
};
RP.ideePluie = date => {
  const c = RP.adresses.filter(p => p.pluie && RP.ouvert(p, date));
  return c.length ? c[RP.jourAn(date) % c.length] : null;
};
/* Types d'adresses à traduire (les autres, comme « Pizza » ou « Michelin ★ », sont compris partout). */
RP.typesT = {
 'Friterie': {fr:'Friterie',en:'Chip shop',nl:'Frituur',de:'Pommesbude',es:'Freiduría'},
 'Italien': {fr:'Italien',en:'Italian',nl:'Italiaans',de:'Italienisch',es:'Italiano'},
 'Boucherie': {fr:'Boucherie',en:'Butcher',nl:'Slager',de:'Metzgerei',es:'Carnicería'},
 'Trottinettes électriques': {fr:'Trottinettes électriques',en:'Electric scooters',nl:'Elektrische steps',de:'E-Scooter',es:'Patinetes eléctricos'},
 'Vespa électriques': {fr:'Vespa électriques',en:'Electric Vespas',nl:"Elektrische Vespa's",de:'Elektro-Vespas',es:'Vespas eléctricas'},
 'Ouverture 2027': {fr:"Ouverture prévue en 2027 · derrière le McDonald's",en:"Opening planned in 2027 · behind McDonald's",nl:"Opening gepland in 2027 · achter McDonald's",de:"Eröffnung für 2027 geplant · hinter McDonald's",es:"Apertura prevista en 2027 · detrás del McDonald's"}
};
RP.sousTitre = (p, lang) => p.desc ? RP.t.desc[p.desc][lang] : (p.type ? (RP.typesT[p.type] ? RP.typesT[p.type][lang] : p.type) : '');
RP.qrSvg = text => {
  try { const q = qrcode(0, 'M'); q.addData(text); q.make(); return q.createSvgTag({cellSize:4, margin:1, scalable:true}); }
  catch (e) { return ''; }
};
RP.wifiQr = (w) => {
  w = w || RP.config.wifi; if (!w || !w.reseau) return '';
  const e = s => s.replace(/([\\;,:"])/g, '\\$1');
  return RP.qrSvg('WIFI:T:' + (w.securite || 'WPA') + ';S:' + e(w.reseau) + ';P:' + e(w.motDePasse) + ';;');
};
/* Appel au serveur. a = action, s = jeton du séjour. */
RP.api = async (a, s, corps) => {
  const u = RP.config.api + '?a=' + a + (s ? '&s=' + encodeURIComponent(s) : '');
  const o = corps instanceof FormData ? {method:'POST', body:corps}
    : corps ? {method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(Object.assign({s}, corps))} : {};
  const r = await fetch(u, o);
  const j = await r.json().catch(() => ({}));
  if (!r.ok) { const e = new Error(j.erreur || ('HTTP ' + r.status)); e.status = r.status; throw e; }
  return j;
};
/* Météo de Ciney. Renvoie {temp, type, min, max, mm, heure} ou null. */
RP.meteo = async () => {
  if (!RP.config.meteo.active) return null;
  try {
    const j = await RP.api('meteo');
    if (!j || j.temp == null) return null;
    return {temp: j.temp, type: RP.meteoType(j.symbole || ''), min: j.min, max: j.max, mm: j.pluie_mm_12h, heure: new Date(j.maj)};
  } catch (e) { return null; }
};
RP.meteoSource = 'Météo : MET Norway (CC BY 4.0)';
RP.meteoTxt = {
  clair:{fr:'Ensoleillé',en:'Sunny',nl:'Zonnig',de:'Sonnig',es:'Soleado'},
  nuitclaire:{fr:'Ciel dégagé',en:'Clear sky',nl:'Heldere hemel',de:'Klarer Himmel',es:'Cielo despejado'},
  nuage:{fr:'Nuageux',en:'Cloudy',nl:'Bewolkt',de:'Bewölkt',es:'Nublado'},
  brouillard:{fr:'Brouillard',en:'Fog',nl:'Mist',de:'Nebel',es:'Niebla'},
  pluie:{fr:'Pluie',en:'Rain',nl:'Regen',de:'Regen',es:'Lluvia'},
  neige:{fr:'Neige',en:'Snow',nl:'Sneeuw',de:'Schnee',es:'Nieve'},
  orage:{fr:'Orage',en:'Thunderstorm',nl:'Onweer',de:'Gewitter',es:'Tormenta'}
};
/* Code MET Norway (ex. 'lightrainshowers_day') → type d'affichage. */
RP.meteoType = s => /thunder/.test(s) ? 'orage' : /snow|sleet/.test(s) ? 'neige' : /rain/.test(s) ? 'pluie'
  : /fog/.test(s) ? 'brouillard' : /(clearsky|fair)_night/.test(s) ? 'nuitclaire' : /clearsky|fair/.test(s) ? 'clair' : 'nuage';
