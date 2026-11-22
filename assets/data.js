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
  // Météo : désactivée tant que le service n'est pas choisi (conditions d'usage à valider).
  meteo: { active: false, latitude: null, longitude: null },
  // Durée pendant laquelle le lien reste actif avant l'arrivée (jours).
  joursAvantArrivee: 30
};

/* ---------- 2. Vidéos d'aide (une par appareil et par langue) ----------
   Exemple quand une vidéo existe :  sauna: { fr: 'videos/sauna-fr.mp4', en: 'videos/sauna-en.mp4' }
   Lien du QR à coller près de l'appareil :  index.html?v=sauna  */
RP.videos = { tv: {}, lave: {}, sauna: {}, four: {}, micro: {}, taque: {}, flipper: {} };

/* ---------- 3. Adresses du livret d'accueil ----------
   ferme = jours de fermeture (0 = dimanche, 1 = lundi … 6 = samedi).
   regle = 'saison' (horaires selon la saison), 'annee' (toute l'année), 'avr-nov'.
   pluie = idée possible s'il pleut (activité en intérieur).
   mot = « Le mot de Frédéric » (sa pépite), à écrire en français : { fr: '…' }. */
RP.adresses = [
 {cat:'pain',  nom:'Vander Cammen',        min:3,  adr:'Rue du Commerce 2, Ciney',               ferme:[4],     tel:'083 21 59 68'},
 {cat:'pain',  nom:'Hennau – Marcin',      min:4,  adr:'Rue du Commerce 144, Ciney',             ferme:[1,2],   tel:'083 21 56 21'},
 {cat:'pain',  nom:'Délices',              min:4,  adr:'Rue de la Croix Limon 2, Ciney',         ferme:[1,2],   tel:'083 61 35 41'},
 {cat:'pain',  nom:'Dechamps & Fille',     min:10, adr:'Chaussée de Dinant 27, Spontin',         ferme:[2,3],   tel:'083 69 97 89'},
 {cat:'pain',  nom:'Nelis & Fils',         min:15, adr:'Place Communale 13, Assesse',            ferme:[],      tel:'083 65 53 37'},
 {cat:'pain',  nom:'Pierson',              min:17, adr:'Chaussée de Luxembourg 7, Courrière',    ferme:[],      tel:'083 65 53 01'},
 {cat:'pain',  nom:'Le Mont Blanc Cinacien',min:3, adr:'Avenue de Namur 59A, Ciney',             ferme:[],      tel:'083 21 69 30'},
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
 {cat:'gastro',nom:'Recto Verso',          min:5,  adr:'Avenue de Namur 29, Ciney',              ferme:[1,2],   tel:'083 33 00 47'},
 {cat:'gastro',nom:'Au Gré des Saisons',   min:12, adr:"Rue d'Achet 70, Achet",                  ferme:[1,2],   tel:'083 65 75 65', type:'Bib Gourmand'},
 {cat:'gastro',nom:'Bistro Gourmand',      min:15, adr:'Route de Ciney 104, Sorinne',            ferme:[6,0],   tel:'0492 45 99 15', type:'Bib Gourmand'},
 {cat:'gastro',nom:'Le Trois X 15',        min:22, adr:'Rue Richier 45, Bouvignes',              ferme:[1,2,3], tel:'0473 39 23 30'},
 {cat:'gastro',nom:'Garde Manger',         min:22, adr:'Chaussée de Gramptinne 37, Faulx-les-Tombes', ferme:[2,3], tel:'083 44 66 31'},
 {cat:'gastro',nom:'Mona Lisa',            min:25, adr:'Rue Colonel Tachet 19, Yvoir',           ferme:[0,1],   tel:'082 71 30 19', type:'Bib Gourmand'},
 {cat:'gastro',nom:"La Grange d'Hamois",   min:8,  adr:"Chaussée d'Andenne 10A, Emptinne",       ferme:[0,1],   tel:'083 22 05 49', type:'Michelin ★'},
 {cat:'gastro',nom:'Bistro Blaise',        min:30, adr:'Rue Porte Haute 5, Marche-en-Famenne',   ferme:[0,1],   tel:'0470 89 57 12', type:'Michelin ★'},
 {cat:'gastro',nom:'La Roseraie',          min:30, adr:'Route de Limet 80, Modave',              ferme:[1,2,3], tel:'085 41 13 60', type:'Michelin ★'},
 {cat:'gastro',nom:"L'Essentiel",          min:35, adr:'Rue Roger Clément 32, Temploux',         ferme:[0,1,2], tel:'081 56 86 16', type:'Michelin ★'},
 {cat:'gastro',nom:'Eau Vive',             min:35, adr:'Route de Floreffe 37, Arbre',            ferme:[2,3],   tel:'081 41 11 51', type:'Michelin ★★'},
 {cat:'visite',nom:'Château de Vêves',     min:20, adr:'Celles (Houyet)',  regle:'saison', desc:'veves'},
 {cat:'visite',nom:"Jardins d’Annevoie",   min:25, adr:'Anhée',            regle:'avr-nov', desc:'annevoie'},
 {cat:'visite',nom:'Château de Freÿr',     min:25, adr:'Hastière',         regle:'saison', desc:'freyr'},
 {cat:'visite',nom:'Dinant',               min:20, adr:'Dinant',           regle:'annee',  desc:'dinant'},
 {cat:'visite',nom:'Abbaye de Maredsous',  min:25, adr:'Denée',            regle:'annee',  desc:'maredsous'},
 {cat:'visite',nom:'Citadelle de Namur',   min:30, adr:'Namur',            regle:'annee',  desc:'citadelle'},
 {cat:'visite',nom:'Domaine des Grottes de Han', min:35, adr:'Han-sur-Lesse', regle:'saison', desc:'han'},
 {cat:'sortie',nom:'Padel Ciney',          min:4,  adr:"Quai de l'Industrie 29, Ciney",          ferme:[],    tel:'083 21 27 53', desc:'padel'},
 {cat:'sortie',nom:'Karting & arcade',     min:30, adr:'Rue des Deux Provinces 1, Marche-en-Famenne', ferme:[1,2], tel:'084 77 02 22', desc:'karting'},
 {cat:'sortie',nom:'Bowling & billard',    min:30, adr:'Rue Baschamps 17, Marche-en-Famenne',    ferme:[1,2], tel:'084 38 77 18', desc:'bowling', pluie:true},
 {cat:'sortie',nom:'Escape Game Namur',    min:30, adr:'Avenue Prince de Liège 96, Jambes',      ferme:[],    tel:'0487 45 52 51', desc:'escape', pluie:true},
 {cat:'sortie',nom:'Lynx Escape Game',     min:30, adr:'Avenue Reine Élisabeth 125, Andenne',    ferme:[],    tel:'0479 44 82 71', desc:'escape', pluie:true},
 {cat:'sortie',nom:'Bowling, laser game & billard', min:35, adr:'Chaussée de Perwez 251, Saint-Servais', ferme:[], tel:'081 73 10 11', desc:'laser', pluie:true},
 {cat:'chef',  nom:'Alexandre Régis', tel:'0477 57 68 57'},
 {cat:'chef',  nom:'Simon Denis',     tel:'0473 40 54 20'}
];

/* ---------- 4. Textes de l'interface (5 langues) ---------- */
RP.langues = { fr:'fr-BE', en:'en-GB', nl:'nl-BE', de:'de-DE', es:'es-ES' };
RP.nomsLangues = { fr:'Français', en:'English', nl:'Nederlands', de:'Deutsch', es:'Español' };

RP.t = {
 choose:{fr:'Choisissez votre langue',en:'Choose your language',nl:'Kies jullie taal',de:'Wählen Sie Ihre Sprache',es:'Elegid vuestro idioma'},
 nav:{fr:['Accueil',"Aujourd'hui",'Adresses','Aide','Courses'],en:['Home','Today','Places','Help','Shopping'],nl:['Welkom','Vandaag','Adressen','Hulp','Boodschappen'],de:['Start','Heute','Adressen','Hilfe','Einkauf'],es:['Inicio','Hoy','Lugares','Ayuda','Compras']},
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
 pepite:{fr:'Le mot de Frédéric',en:'Frédéric’s tip',nl:'Tip van Frédéric',de:'Frédérics Tipp',es:'El consejo de Frédéric'},
 help:{fr:'Vidéos d’aide',en:'Help videos',nl:'Hulpvideo’s',de:'Hilfevideos',es:'Vídeos de ayuda'},
 helpTxt:{fr:'Scannez le QR code près de l’appareil, ou choisissez-le ici.',en:'Scan the QR code next to the appliance, or choose it here.',nl:'Scan de QR-code bij het toestel, of kies het hier.',de:'Scannen Sie den QR-Code am Gerät oder wählen Sie es hier aus.',es:'Escanead el código QR junto al aparato o elegidlo aquí.'},
 soon:{fr:'Bientôt disponible',en:'Coming soon',nl:'Binnenkort beschikbaar',de:'Bald verfügbar',es:'Disponible pronto'},
 helpAsk:{fr:'Un appareil ne fonctionne pas ? Écrivez à Frédéric.',en:'Is an appliance not working? Message Frédéric.',nl:'Werkt een toestel niet? Stuur Frédéric een bericht.',de:'Funktioniert ein Gerät nicht? Schreiben Sie Frédéric.',es:'¿No funciona un aparato? Escribid a Frédéric.'},
 list:{fr:'Liste de courses',en:'Shopping list',nl:'Boodschappenlijst',de:'Einkaufsliste',es:'Lista de la compra'},
 listTxt:{fr:'Gardée sur ce téléphone. Effacée automatiquement à la fin du séjour.',en:'Kept on this phone. Cleared automatically at the end of your stay.',nl:'Bewaard op deze telefoon. Wordt automatisch gewist aan het einde van jullie verblijf.',de:'Auf diesem Handy gespeichert. Wird am Ende Ihres Aufenthalts automatisch gelöscht.',es:'Se guarda en este móvil. Se borra automáticamente al final de la estancia.'},
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
 eq:{tv:{fr:'Télévision',en:'Television',nl:'Televisie',de:'Fernseher',es:'Televisión'},
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
/* Météo (désactivée par défaut). Renvoie {temp, code} ou null. */
RP.meteo = async () => {
  const m = RP.config.meteo;
  if (!m.active || m.latitude == null || m.longitude == null) return null;
  try {
    const r = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + m.latitude + '&longitude=' + m.longitude + '&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Europe%2FBrussels&forecast_days=1');
    if (!r.ok) return null;
    const j = await r.json();
    return {temp: Math.round(j.current.temperature_2m), code: j.current.weather_code, max: Math.round(j.daily.temperature_2m_max[0]), min: Math.round(j.daily.temperature_2m_min[0]), pluie: j.daily.precipitation_probability_max[0], heure: new Date()};
  } catch (e) { return null; }
};
RP.meteoTxt = {
  clair:{fr:'Ensoleillé',en:'Sunny',nl:'Zonnig',de:'Sonnig',es:'Soleado'},
  nuage:{fr:'Nuageux',en:'Cloudy',nl:'Bewolkt',de:'Bewölkt',es:'Nublado'},
  brouillard:{fr:'Brouillard',en:'Fog',nl:'Mist',de:'Nebel',es:'Niebla'},
  pluie:{fr:'Pluie',en:'Rain',nl:'Regen',de:'Regen',es:'Lluvia'},
  neige:{fr:'Neige',en:'Snow',nl:'Sneeuw',de:'Schnee',es:'Nieve'},
  orage:{fr:'Orage',en:'Thunderstorm',nl:'Onweer',de:'Gewitter',es:'Tormenta'}
};
RP.meteoType = c => c <= 1 ? 'clair' : c <= 3 ? 'nuage' : c <= 48 ? 'brouillard' : (c >= 71 && c <= 77) || c === 85 || c === 86 ? 'neige' : c >= 95 ? 'orage' : 'pluie';
