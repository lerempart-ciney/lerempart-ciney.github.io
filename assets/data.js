/* Le Rempart · données du site voyageurs.
   Tout ce fichier est public (GitHub Pages) : n'y mettez JAMAIS de code d'accès.
   Pour modifier une info : changez le texte entre guillemets, enregistrez, publiez. */

window.RP = {};

/* ---------- 1. Réglages ---------- */
RP.config = {
  whatsapp: '+32 475 72 88 67',
  email: 'acls@live.be',
  adresse: 'Avenue de Namur 6, 5590 Ciney',
  // Wi-Fi : laisser vide tant que ce n'est pas connu. S'affiche dans l'appli et sur la TV.
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
RP.videos = { tv: {}, lave: {}, sauna: {}, four: {}, micro: {}, taque: {}, flipper: {}, kicker: {}, piscine: {} };
/* Grosses activités présentes seulement dans un gîte (les autres appareils sont dans les 3 gîtes).
   Le Wi-Fi est le même pour les 3 gîtes. */
RP.seulementGite = { lave: '1', sauna: '1', flipper: '1', kicker: '1', piscine: '1' };
RP.dansGite = (k, g) => !g || !RP.seulementGite[k] || RP.seulementGite[k] === g;

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
 {nom:'Aldi',                         adr:'Avenue Schlogel 119, Ciney'}
];

/* ---------- 4. Textes de l'interface (5 langues) ---------- */
RP.langues = { fr:'fr-BE', en:'en-GB', nl:'nl-BE', de:'de-DE', es:'es-ES' };
RP.nomsLangues = { fr:'Français', en:'English', nl:'Nederlands', de:'Deutsch', es:'Español' };

RP.t = {
 choose:{fr:'Choisissez votre langue',en:'Choose your language',nl:'Kies jullie taal',de:'Wählen Sie Ihre Sprache',es:'Elegid vuestro idioma'},
 nav:{fr:['Accueil',"Aujourd'hui",'Adresses','Aide','Courses','Photos'],en:['Home','Today','Places','Help','Shopping','Photos'],nl:['Welkom','Vandaag','Adressen','Hulp','Boodschappen',"Foto's"],de:['Start','Heute','Adressen','Hilfe','Einkauf','Fotos'],es:['Inicio','Hoy','Lugares','Ayuda','Compras','Fotos']},
 welcome:{fr:'Bienvenue au Rempart',en:'Welcome to Le Rempart',nl:'Welkom bij Le Rempart',de:'Willkommen im Le Rempart',es:'Bienvenidos a Le Rempart'},
 intro:{fr:'Je suis Frédéric, et je suis très heureux de vous accueillir. Prenez le temps de vous installer tranquillement et de vous sentir chez vous.',
  en:"I'm Frédéric, and I'm so pleased to welcome you. Take your time settling in and make yourself comfortable.",
  nl:'Ik ben Frédéric en ik ben heel blij jullie te mogen verwelkomen. Neem rustig de tijd om aan te komen en je op je gemak te voelen.',
  de:'Ich bin Frédéric und freue mich sehr, Sie begrüßen zu dürfen. Richten Sie sich ganz in Ruhe ein und fühlen Sie sich wie zu Hause.',
  es:'Soy Frédéric y me alegra mucho recibiros. Instalaos con calma y poneos cómodos.'},
 stay:{fr:'Votre séjour',en:'Your stay',nl:'Jullie verblijf',de:'Ihr Aufenthalt',es:'Vuestra estancia'},
 network:{fr:'Réseau',en:'Network',nl:'Netwerk',de:'Netzwerk',es:'Red'},
 pass:{fr:'Mot de passe',en:'Password',nl:'Wachtwoord',de:'Passwort',es:'Contraseña'},
 codes:{fr:"Frédéric vous envoie les codes d'accès par message.",en:'Frédéric sends you the access codes by message.',nl:'Frédéric stuurt jullie de toegangscodes via een bericht.',de:'Frédéric schickt Ihnen die Zugangscodes per Nachricht.',es:'Frédéric os enviará los códigos de acceso por mensaje.'},
 arrBtn:{fr:'Prévenir Frédéric de mon arrivée',en:'Let Frédéric know when we arrive',nl:'Aankomst doorgeven aan Frédéric',de:'Frédéric meine Ankunft mitteilen',es:'Avisar a Frédéric de nuestra llegada'},
 arrHint:{fr:'Merci de prévenir au moins 2 heures avant votre arrivée.',en:'Please let him know at least 2 hours before you arrive.',nl:'Laat het ten minste 2 uur voor jullie aankomst weten.',de:'Bitte geben Sie mindestens 2 Stunden vor Ihrer Ankunft Bescheid.',es:'Avisad al menos 2 horas antes de llegar.'},
 arrTime:{fr:'Heure estimée',en:'Estimated time',nl:'Verwacht uur',de:'Voraussichtliche Uhrzeit',es:'Hora estimada'},
 arrSend:{fr:'Ouvrir WhatsApp',en:'Open WhatsApp',nl:'WhatsApp openen',de:'WhatsApp öffnen',es:'Abrir WhatsApp'},
 arrNote:{fr:'Le message s’ouvre dans WhatsApp. Il part seulement quand vous appuyez sur Envoyer.',en:'The message opens in WhatsApp. It is only sent when you tap Send.',nl:'Het bericht opent in WhatsApp. Het wordt pas verstuurd als jullie op Verzenden tikken.',de:'Die Nachricht öffnet sich in WhatsApp. Sie wird erst gesendet, wenn Sie auf Senden tippen.',es:'El mensaje se abre en WhatsApp. Solo se envía cuando pulsáis Enviar.'},
 arrMsg:{fr:'Bonjour Frédéric, nous arriverons au Rempart vers {t}.',en:'Hello Frédéric, we expect to arrive at Le Rempart around {t}.',nl:'Hallo Frédéric, we komen rond {t} aan bij Le Rempart.',de:'Hallo Frédéric, wir kommen gegen {t} Uhr im Le Rempart an.',es:'Hola Frédéric, llegaremos a Le Rempart hacia las {t}.'},
 askTitle:{fr:'Demandez à Frédéric',en:'Ask Frédéric',nl:'Vraag het aan Frédéric',de:'Fragen Sie Frédéric',es:'Preguntad a Frédéric'},
 askTxt:{fr:'Choisissez un sujet : WhatsApp s’ouvre avec un début de message. Vous complétez, puis vous envoyez.',en:'Choose a topic: WhatsApp opens with the start of a message. Complete it, then send.',nl:'Kies een onderwerp: WhatsApp opent met het begin van een bericht. Vul aan en verstuur.',de:'Wählen Sie ein Thema: WhatsApp öffnet sich mit einem Nachrichtenanfang. Ergänzen und senden Sie ihn.',es:'Elegid un tema: WhatsApp se abre con el inicio de un mensaje. Completadlo y enviadlo.'},
 askTopics:{fr:['Une question sur le gîte','Un conseil (resto, visite…)','Un appareil ne fonctionne pas','Autre chose'],en:['A question about the house','A tip (restaurant, visit…)','An appliance is not working','Something else'],nl:['Een vraag over de gîte','Een tip (restaurant, bezoek…)','Een toestel werkt niet','Iets anders'],de:['Eine Frage zum Haus','Ein Tipp (Restaurant, Ausflug…)','Ein Gerät funktioniert nicht','Etwas anderes'],es:['Una pregunta sobre la casa','Un consejo (restaurante, visita…)','Un aparato no funciona','Otra cosa']},
 askMsgs:{fr:['Bonjour Frédéric, j’ai une question sur le gîte : ','Bonjour Frédéric, pouvez-vous nous conseiller ','Bonjour Frédéric, cet appareil ne fonctionne pas : ','Bonjour Frédéric, '],en:['Hello Frédéric, I have a question about the house: ','Hello Frédéric, could you recommend ','Hello Frédéric, this appliance is not working: ','Hello Frédéric, '],nl:['Dag Frédéric, ik heb een vraag over de gîte: ','Dag Frédéric, kun je ons iets aanraden: ','Dag Frédéric, dit toestel werkt niet: ','Dag Frédéric, '],de:['Hallo Frédéric, ich habe eine Frage zum Haus: ','Hallo Frédéric, können Sie uns etwas empfehlen: ','Hallo Frédéric, dieses Gerät funktioniert nicht: ','Hallo Frédéric, '],es:['Hola Frédéric, tengo una pregunta sobre la casa: ','Hola Frédéric, ¿nos podrías recomendar ','Hola Frédéric, este aparato no funciona: ','Hola Frédéric, ']},
 contactTxt:{fr:'Une question ? Écrivez sur WhatsApp, c’est le plus rapide.',en:'A question? WhatsApp is the quickest way to reach us.',nl:'Een vraag? Via WhatsApp gaat het het snelst.',de:'Eine Frage? Über WhatsApp geht es am schnellsten.',es:'¿Alguna pregunta? Por WhatsApp es lo más rápido.'},
 writeWa:{fr:'Écrire sur WhatsApp',en:'Message on WhatsApp',nl:'Bericht via WhatsApp',de:'Über WhatsApp schreiben',es:'Escribir por WhatsApp'},
 sos:{fr:'Urgences & santé',en:'Emergencies & health',nl:'Noodgevallen & gezondheid',de:'Notfälle & Gesundheit',es:'Urgencias y salud'},
 sos1:{fr:'Urgences (ambulance, pompiers)',en:'Emergencies (ambulance, fire)',nl:'Noodnummer (ambulance, brandweer)',de:'Notruf (Rettung, Feuerwehr)',es:'Urgencias (ambulancia, bomberos)'},
 sos2:{fr:'Médecin de garde',en:'Doctor on call',nl:'Huisarts van wacht',de:'Ärztlicher Bereitschaftsdienst',es:'Médico de guardia'},
 sos3:{fr:'Pharmacie de garde',en:'Pharmacy on duty',nl:'Apotheek van wacht',de:'Notdienst-Apotheke',es:'Farmacia de guardia'},
 tyre:{fr:'Un souci de pneu ?',en:'Tyre trouble?',nl:'Problemen met een band?',de:'Probleme mit einem Reifen?',es:'¿Problemas con un neumático?'},
 today:{fr:'Aujourd’hui au Rempart',en:'Today at Le Rempart',nl:'Vandaag in Le Rempart',de:'Heute im Le Rempart',es:'Hoy en Le Rempart'},
 weather:{fr:'Météo',en:'Weather',nl:'Weer',de:'Wetter',es:'Tiempo'},
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
 route:{fr:'Itinéraire',en:'Directions',nl:'Route',de:'Route',es:'Cómo llegar'},
 all:{fr:'Tout',en:'All',nl:'Alles',de:'Alle',es:'Todo'},
 pdf:{fr:'Livret complet (PDF, en français)',en:'Full welcome guide (PDF, in French)',nl:'Volledig onthaalboekje (pdf, in het Frans)',de:'Komplette Gästemappe (PDF, auf Französisch)',es:'Guía completa (PDF, en francés)'},
 chefNote:{fr:'Le chef vient cuisiner au gîte. À partir de 8 couverts. Réservez plusieurs jours à l’avance.',en:'The chef comes to cook at the house. From 8 guests. Book several days ahead.',nl:'De chef komt in de gîte koken. Vanaf 8 personen. Enkele dagen vooraf reserveren.',de:'Der Koch kocht bei Ihnen im Haus. Ab 8 Personen. Einige Tage im Voraus buchen.',es:'El chef viene a cocinar a la casa. A partir de 8 comensales. Reservad con varios días de antelación.'},
 pepite:{fr:'Pépite du Rempart',en:'A Le Rempart gem',nl:'Pareltje van Le Rempart',de:'Tipp vom Le Rempart',es:'Joya de Le Rempart'},
 pepites:{fr:'Les pépites du Rempart',en:'Le Rempart’s gems',nl:'Pareltjes van Le Rempart',de:'Tipps vom Le Rempart',es:'Las joyas de Le Rempart'},
 pepiteJour:{fr:'La pépite du jour',en:'Today’s gem',nl:'Pareltje van de dag',de:'Tipp des Tages',es:'La joya del día'},
 help:{fr:'Vidéos d’aide',en:'Help videos',nl:'Hulpvideo’s',de:'Hilfevideos',es:'Vídeos de ayuda'},
 helpTxt:{fr:'Scannez le QR code près de l’appareil, ou choisissez-le ici.',en:'Scan the QR code next to the appliance, or choose it here.',nl:'Scan de QR-code bij het toestel, of kies het hier.',de:'Scannen Sie den QR-Code am Gerät oder wählen Sie es hier aus.',es:'Escanead el código QR junto al aparato o elegidlo aquí.'},
 soon:{fr:'Bientôt disponible',en:'Coming soon',nl:'Binnenkort beschikbaar',de:'Bald verfügbar',es:'Disponible pronto'},
 helpAsk:{fr:'Un appareil ne fonctionne pas ? Écrivez à Frédéric.',en:'Is an appliance not working? Message Frédéric.',nl:'Werkt een toestel niet? Stuur Frédéric een bericht.',de:'Funktioniert ein Gerät nicht? Schreiben Sie Frédéric.',es:'¿No funciona un aparato? Escribid a Frédéric.'},
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
 addPh:{fr:'Ajouter un article',en:'Add an item',nl:'Artikel toevoegen',de:'Artikel hinzufügen',es:'Añadir un artículo'},
 add:{fr:'Ajouter',en:'Add',nl:'Toevoegen',de:'Hinzufügen',es:'Añadir'},
 empty:{fr:'Votre liste est vide.',en:'Your list is empty.',nl:'Jullie lijst is leeg.',de:'Ihre Liste ist leer.',es:'Vuestra lista está vacía.'},
 clearDone:{fr:'Retirer les articles cochés',en:'Remove ticked items',nl:'Aangevinkte artikelen verwijderen',de:'Abgehakte Artikel entfernen',es:'Quitar los artículos marcados'},
 share:{fr:'Partager par WhatsApp',en:'Share on WhatsApp',nl:'Delen via WhatsApp',de:'Über WhatsApp teilen',es:'Compartir por WhatsApp'},
 bread:{fr:'Pain frais : voir les boulangeries dans Adresses.',en:'Fresh bread: see the bakeries under Places.',nl:'Vers brood: zie de bakkers bij Adressen.',de:'Frisches Brot: siehe Bäckereien unter Adressen.',es:'Pan recién hecho: ver panaderías en Lugares.'},
 ended:{fr:'Votre séjour au Rempart est terminé',en:'Your stay at Le Rempart has ended',nl:'Jullie verblijf in Le Rempart is voorbij',de:'Ihr Aufenthalt im Le Rempart ist beendet',es:'Vuestra estancia en Le Rempart ha terminado'},
 endedTxt:{fr:'Merci pour votre visite. Les informations de ce séjour ne sont plus disponibles. Une question ? Frédéric reste joignable.',en:'Thank you for your visit. The information for this stay is no longer available. Any questions? You can still reach Frédéric.',nl:'Bedankt voor jullie bezoek. De informatie van dit verblijf is niet meer beschikbaar. Een vraag? Frédéric blijft bereikbaar.',de:'Vielen Dank für Ihren Besuch. Die Informationen zu diesem Aufenthalt sind nicht mehr verfügbar. Bei Fragen ist Frédéric weiterhin erreichbar.',es:'Gracias por vuestra visita. La información de esta estancia ya no está disponible. ¿Alguna pregunta? Frédéric sigue a vuestra disposición.'},
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
 remindNote:{fr:'Rappel 2 heures avant l’heure estimée, pour prévenir Frédéric.',en:'Reminder 2 hours before your estimated time, to let Frédéric know.',nl:'Herinnering 2 uur voor het verwachte uur, om Frédéric te verwittigen.',de:'Erinnerung 2 Stunden vor der voraussichtlichen Uhrzeit, um Frédéric Bescheid zu geben.',es:'Recordatorio 2 horas antes de la hora estimada, para avisar a Frédéric.'},
 remindTitle:{fr:'Prévenir Frédéric de notre arrivée (Le Rempart)',en:'Let Frédéric know we are arriving (Le Rempart)',nl:'Frédéric laten weten dat we aankomen (Le Rempart)',de:'Frédéric unsere Ankunft mitteilen (Le Rempart)',es:'Avisar a Frédéric de nuestra llegada (Le Rempart)'},
 bye:{fr:'Bon séjour au Rempart !',en:'Enjoy your stay at Le Rempart!',nl:'Fijn verblijf in Le Rempart!',de:'Einen schönen Aufenthalt im Le Rempart!',es:'¡Que disfrutéis de Le Rempart!'},
 cats:{
  pain:{fr:'Boulangeries & douceurs',en:'Bakeries & treats',nl:'Bakkers & lekkers',de:'Bäckereien & Süßes',es:'Panaderías y dulces'},
  snack:{fr:'Petite faim',en:'Quick bites',nl:'Snelle hap',de:'Imbiss',es:'Para picar'},
  resto:{fr:'Restaurants',en:'Restaurants',nl:'Restaurants',de:'Restaurants',es:'Restaurantes'},
  gastro:{fr:'Tables gastronomiques',en:'Fine dining',nl:'Gastronomie',de:'Gehobene Küche',es:'Alta cocina'},
  visite:{fr:'À visiter',en:'To visit',nl:'Bezienswaardig',de:'Sehenswertes',es:'Para visitar'},
  sortie:{fr:'Activités',en:'Activities',nl:'Activiteiten',de:'Aktivitäten',es:'Actividades'},
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
  lave:{fr:'Machine à laver',en:'Washing machine',nl:'Wasmachine',de:'Waschmaschine',es:'Lavadora'},
  sauna:{fr:'Sauna',en:'Sauna',nl:'Sauna',de:'Sauna',es:'Sauna'},
  four:{fr:'Four',en:'Oven',nl:'Oven',de:'Backofen',es:'Horno'},
  micro:{fr:'Micro-ondes',en:'Microwave',nl:'Microgolfoven',de:'Mikrowelle',es:'Microondas'},
  taque:{fr:'Taque de cuisson',en:'Hob',nl:'Kookplaat',de:'Kochfeld',es:'Placa de cocina'},
  flipper:{fr:'Flipper',en:'Pinball machine',nl:'Flipperkast',de:'Flipper',es:'Máquina de pinball'}}
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
RP.sousTitre = (p, lang) => p.desc ? RP.t.desc[p.desc][lang] : (p.type || '');
RP.qrSvg = text => {
  try { const q = qrcode(0, 'M'); q.addData(text); q.make(); return q.createSvgTag({cellSize:4, margin:1, scalable:true}); }
  catch (e) { return ''; }
};
RP.wifiQr = () => {
  const w = RP.config.wifi; if (!w.reseau) return '';
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
  nuage:{fr:'Nuageux',en:'Cloudy',nl:'Bewolkt',de:'Bewölkt',es:'Nublado'},
  brouillard:{fr:'Brouillard',en:'Fog',nl:'Mist',de:'Nebel',es:'Niebla'},
  pluie:{fr:'Pluie',en:'Rain',nl:'Regen',de:'Regen',es:'Lluvia'},
  neige:{fr:'Neige',en:'Snow',nl:'Sneeuw',de:'Schnee',es:'Nieve'},
  orage:{fr:'Orage',en:'Thunderstorm',nl:'Onweer',de:'Gewitter',es:'Tormenta'}
};
/* Code MET Norway (ex. 'lightrainshowers_day') → type d'affichage. */
RP.meteoType = s => /thunder/.test(s) ? 'orage' : /snow|sleet/.test(s) ? 'neige' : /rain/.test(s) ? 'pluie'
  : /fog/.test(s) ? 'brouillard' : /clearsky|fair/.test(s) ? 'clair' : 'nuage';
