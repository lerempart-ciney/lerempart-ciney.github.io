#!/usr/bin/env python3
"""Le Rempart · générateur du site officiel.

Lit contenu/*.json et écrit des pages HTML statiques dans ../out (ou un dossier donné).
    python3 build.py            -> out/ (adresses propres : /gites/gite-1/)
    python3 build.py --preview  -> preview/ (liens vers .../index.html, pour un aperçu sans serveur)
Aucune dépendance externe. Les textes des pages sont dans ce fichier ; les données dans contenu/.
"""
import json, os, shutil, sys, html, re
from datetime import date

HERE = os.path.dirname(os.path.abspath(__file__))
PREVIEW = '--preview' in sys.argv
OUT = os.path.join(HERE, '..', 'site-preview' if PREVIEW else 'site')
C = lambda f: json.load(open(os.path.join(HERE, 'contenu', f), encoding='utf-8'))
S, G, R = C('site.json'), C('gites.json'), C('region.json')
from urllib.parse import quote as _q
GUIDE_MSG = _q("Bonjour, je séjourne au Rempart. Pourriez-vous m'envoyer le lien de mon guide du séjour ?\n\nNom de la réservation : \nGîte (1, 2, 3 ou domaine entier) : \nDate d'arrivée : \nDate de départ : \nLangue du guide (FR, NL, EN, DE, ES) : \nMerci !")
IMG = json.load(open(os.path.join(HERE, 'imgmeta.json')))
E = html.escape
TODAY = date.today().isoformat()

# ---------- dessins au trait (même style que l'appli voyageurs) ----------
DESSINS = {
 'ferme': '<path d="M8 96h104"/><path d="M14 96V58l20-16 20 16v38"/><path d="M54 96V50h52v46"/><path d="M50 50l30-22 30 22"/><path d="M24 96V76h20v20"/><path d="M68 96V72a8 8 0 0 1 16 0v24"/><path d="M92 64h8v10h-8z"/><path d="M60 64h0"/><path d="M28 62h12"/>',
 'lit': '<path d="M14 92V40"/><path d="M106 92V64"/><path d="M14 74h92"/><path d="M14 64h92"/><path d="M22 64v-8a6 6 0 0 1 6-6h22a6 6 0 0 1 6 6v8"/><path d="M14 92h0M106 92h0"/>',
 'bain': '<path d="M14 62h92"/><path d="M20 62v14a18 18 0 0 0 18 18h44a18 18 0 0 0 18-18V62"/><path d="M30 94l-4 8M90 94l4 8"/><path d="M30 62V30a10 10 0 0 1 20 0"/><path d="M46 38h8"/>',
 'cuisine': '<path d="M14 100h92"/><path d="M20 100V60h80v40"/><path d="M20 72h80"/><path d="M60 72v28"/><path d="M38 84h8M74 84h8"/><circle cx="38" cy="52" r="7"/><circle cx="62" cy="52" r="7"/><path d="M86 60V36h10v24"/>',
 'sauna': '<path d="M22 96V44l38-22 38 22v52"/><path d="M14 96h92"/><path d="M34 96V62h52v34"/><path d="M34 74h52M34 86h52"/><path d="M48 62v34M72 62v34"/><path d="M50 40c-4-5 4-8 0-13M60 38c-4-5 4-8 0-13M70 40c-4-5 4-8 0-13"/>',
 'flipper': '<path d="M34 104l6-74h40l6 74"/><path d="M40 30l4-12h32l4 12"/><circle cx="54" cy="48" r="5"/><circle cx="68" cy="56" r="5"/><circle cx="58" cy="66" r="3"/><path d="M48 86l10 6M72 86l-10 6"/><path d="M30 104h60"/>',
 'jardin': '<path d="M10 100h100"/><path d="M60 100V54"/><path d="M60 54c-22 0-30-14-24-28 6-12 20-12 24-4 4-8 18-8 24 4 6 14-2 28-24 28z"/><path d="M60 74l-10-8M60 66l10-8"/><path d="M20 100v-8h16v8M84 100v-8h16v8"/>',
 'feu': '<path d="M18 100h84"/><path d="M28 100V36h64v64"/><path d="M22 36h76"/><path d="M38 100V52h44v48"/><path d="M46 94l28-8M46 86l28 8"/><path d="M60 84c-9-6-6-15 0-22 1 6 6 7 6 13 0 5-3 8-6 9z"/>',
}
def dessin(k, cls=''):
    return f'<svg class="{cls}" viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{DESSINS[k]}</svg>'

CATS_EQ = [('couchages', 'Couchages', 'lit'), ('salle_de_bain', 'Salles de bain', 'bain'), ('cuisine', 'Cuisine', 'cuisine'),
           ('bien_etre', 'Bien-être', 'sauna'), ('divertissement', 'Divertissement', 'flipper'), ('exterieur', 'Extérieur', 'jardin'), ('confort', 'Confort', 'feu')]

ALT = {
 'cour-7458': "La cour du Rempart : pelouse, allée pavée et façades de pierre",
 'cour-7454': "Allée pavée entre les bâtiments de pierre de la ferme",
 'cour-7455': "Façade de pierre aux fenêtres cintrées de brique, le long de l'allée pavée",
 'cour-7456': "La cour intérieure de la ferme en carré, vue d'ensemble",
 'cour-7459': "Bâtiments de pierre et table en bois sur les pavés de la cour",
 'exterieur-01': "Terrasse pavée, table et parasol entre les haies de buis",
 'exterieur-02': "Table de bois sur la pelouse, dans l'allée pavée du domaine",
 'exterieur-03': "Terrasse de pierre avec salon de jardin, au pied d'un talus planté",
 'exterieur-04': "Façade de pierre et grande baie vitrée, pelouse et parasol",
 'gite-1-01': "Gîte 1 : table dressée devant la cuisine, sous les poutres",
 'gite-1-02': "Gîte 1 : longue table dressée pour douze sous les voûtains de brique",
 'gite-1-03': "Gîte 1 : salle de jeux voûtée avec flipper et kicker",
 'gite-1-04': "Gîte 1 : piscine intérieure et fauteuils",
 'gite-1-05': "Gîte 1 : sauna en bois clair",
 'gite-1-06': "Gîte 1 : vitrine éclairée de verres et de tasses",
 'gite-2-01': "Gîte 2 : table ovale et chaises en bouclette devant la cheminée",
 'gite-2-02': "Gîte 2 : salon avec canapé, poufs et cheminée",
 'gite-2-03': "Gîte 2 : cuisine en îlot face à la grande baie sur le jardin",
}

# ---------- liens et images ----------
class Page:
    def __init__(self, path):
        self.path = path  # ex. 'gites/gite-1/' ou '' pour l'accueil
        self.depth = path.count('/')
    def rel(self, target):
        """target = chemin depuis la racine du site, ex. 'gites/gite-1/' ou 'assets/site.css'"""
        up = '../' * self.depth
        if target.endswith('/') or target == '':
            t = up + target
            if PREVIEW: t += 'index.html'
            return t or './'
        return up + target

def srcset(p, k):
    w, h = IMG[k]
    sizes = [x for x in (640, 1280, 2000) if x == 640 or x <= w]
    return ', '.join(f"{p.rel(f'assets/img/{k}-{x}.webp')} {min(x, w)}w" for x in sizes), sizes[-1]

def img(p, k, sizes='100vw', eager=False, alt=None):
    ss, big = srcset(p, k)
    w, h = IMG[k]
    load = 'fetchpriority="high"' if eager else 'loading="lazy" decoding="async"'
    return f'<img src="{p.rel(f"assets/img/{k}-1280.webp" if big >= 1280 else f"assets/img/{k}-640.webp")}" srcset="{ss}" sizes="{sizes}" width="{w}" height="{h}" alt="{E(alt if alt is not None else ALT.get(k, ""))}" {load}>'

def todo(label='Photographie à venir', ratio='r-34', cls=''):
    return f'<div class="ph todo {ratio} {cls}" role="img" aria-label="{E(label)}"><div class="todo-in">{dessin("ferme")}<span>{E(label)}</span></div></div>'

def gite_url(g): return f'gites/{g["slug"]}/'

# ---------- gabarit ----------
NAV = [('la-demeure/', 'La demeure'), ('gites/', 'Nos gîtes'), ('experiences/', 'Expériences'), ('region/', 'Localisation'), ('reserver/', 'Réservation')]

def header(p, over):
    cur = ' aria-current="page"'
    items = ''.join(f'<a href="{p.rel(u)}"{cur if p.path.startswith(u) else ""}>{t}</a>' for u, t in NAV[:4])
    mitems = ''.join(f'<li><a href="{p.rel(u)}"><span class="num">{i:02d}</span>{t}</a></li>' for i, (u, t) in enumerate([('', 'Accueil')] + NAV, 1))
    return f'''<a class="skip" href="#main">Aller au contenu</a>
<header class="hd{' over' if over else ''}">
 <div class="wrap">
  <a class="brand" href="{p.rel('')}" aria-label="Le Rempart, accueil"><span class="mono" aria-hidden="true">R</span><span class="wordmark"><b>Le Rempart</b><small>Trois gîtes · Ciney</small></span></a>
  <nav class="nav" aria-label="Navigation principale">{items}</nav>
  <div style="display:flex;align-items:center;gap:18px"><a class="btn book" href="{p.rel('reserver/')}">Réserver</a><button class="burger" type="button" aria-expanded="false" aria-controls="menu">Menu <i></i></button></div>
 </div>
</header>
<div class="menu" id="menu" aria-hidden="true" role="dialog" aria-label="Menu">
 <div class="menu-top"><a class="brand" href="{p.rel('')}"><span class="mono" aria-hidden="true">R</span><span class="wordmark"><b>Le Rempart</b><small>Trois gîtes · Ciney</small></span></a><button class="menu-close" type="button" data-close-menu>Fermer</button></div>
 <ol>{mitems}</ol>
 <div class="menu-foot"><a class="btn" href="{p.rel('reserver/')}">Demander un séjour</a><p>{E(S['adresse'])}<br><a href="https://wa.me/{S['whatsapp_num']}">{E(S['whatsapp'])}</a> · <a href="mailto:{S['email']}">{S['email']}</a></p></div>
</div>'''

def footer(p):
    gl = ''.join(f'<li><a href="{p.rel(gite_url(g))}">{g["nom"]} · {g["personnes"]} personnes</a></li>' for g in G)
    return f'''<footer class="ft">
 <div class="wrap">
  <div class="ft-grid">
   <div class="stack"><a class="brand" href="{p.rel('')}"><span class="mono" aria-hidden="true">R</span><span class="wordmark"><b>Le Rempart</b><small>Trois gîtes · Ciney</small></span></a><p style="max-width:22em;color:rgba(247,244,238,.75)">Une ancienne ferme en carré au cœur de Ciney, en province de Namur. Trois maisons autour d'une même cour.</p></div>
   <div><h4>Les gîtes</h4><ul>{gl}<li><a href="{p.rel('gites/')}">Le domaine entier · 28 personnes</a></li></ul></div>
   <div><h4>Le domaine</h4><ul><li><a href="{p.rel('la-demeure/')}">La demeure</a></li><li><a href="{p.rel('experiences/')}">Expériences</a></li><li><a href="{p.rel('region/')}">La région</a></li><li><a href="{p.rel('reserver/')}">Réservation</a></li></ul></div>
   <div><h4>Nous écrire</h4><ul><li>{E(S['rue'])}<br>{S['cp']} {S['ville']}</li><li><a href="https://wa.me/{S['whatsapp_num']}">WhatsApp {E(S['whatsapp'])}</a></li><li><a href="mailto:{S['email']}">{S['email']}</a></li><li><a href="{p.rel('contact/')}">Formulaire de contact</a></li></ul></div>
  </div>
  <div class="ft-bottom"><span>© <span id="year">2026</span> Le Rempart · <a href="{p.rel('mentions-legales/')}">Mentions légales</a> · <a href="{p.rel('confidentialite/')}">Confidentialité et cookies</a></span><span><a href="https://wa.me/{S['whatsapp_num']}?text={GUIDE_MSG}" target="_blank" rel="noopener">Vous séjournez chez nous ? Demandez votre guide du séjour</a></span></div>
 </div>
</footer>'''

def cta(p, title='Votre séjour commence par une date.', text='Dites-nous quand vous venez et combien vous serez. Nous vous répondons personnellement.'):
    return f'''<section class="cta-band"><div class="wrap rv"><span class="eyebrow">Réservation</span><h2 class="h2">{title}</h2><p class="muted prose">{text}</p><a class="btn" href="{p.rel('reserver/')}">Demander un séjour</a></div></section>'''

def page(p, title, desc, body, over=False, jsonld=None, og='cour-7458'):
    canon = S['url_base'].rstrip('/') + '/' + p.path
    robots = '' if S['indexable'] else '<meta name="robots" content="noindex, nofollow">'
    ld = ''.join(f'<script type="application/ld+json">{json.dumps(x, ensure_ascii=False)}</script>' for x in (jsonld or []))
    full_title = title if title.startswith('Le Rempart') else f'{title} · Le Rempart, Ciney'
    doc = f'''<!doctype html>
<html lang="fr" class="noscript">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{E(full_title)}</title>
<meta name="description" content="{E(desc)}">
{robots}
<link rel="canonical" href="{E(canon)}">
<meta property="og:type" content="website"><meta property="og:site_name" content="Le Rempart"><meta property="og:locale" content="fr_BE">
<meta property="og:title" content="{E(full_title)}"><meta property="og:description" content="{E(desc)}"><meta property="og:url" content="{E(canon)}">
<meta property="og:image" content="{E(S['url_base'].rstrip('/') + '/assets/img/' + og + '-og.jpg')}">
<meta name="theme-color" content="#F7F4EE" media="(prefers-color-scheme: light)"><meta name="theme-color" content="#141414" media="(prefers-color-scheme: dark)">
<link rel="icon" href="{p.rel('assets/favicon.svg')}" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;350;400;450;500&display=swap">
<link rel="stylesheet" href="{p.rel('assets/site.css')}">
{ld}
</head>
<body>
{header(p, over)}
<main id="main">
{body}
</main>
{footer(p)}
<script src="{p.rel('assets/site.js')}" defer></script>
</body>
</html>'''
    dest = os.path.join(OUT, p.path, 'index.html') if (p.path.endswith('/') or p.path == '') else os.path.join(OUT, p.path)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    open(dest, 'w', encoding='utf-8').write(re.sub(r'\n\s*\n', '\n', doc))
    PAGES.append(p.path)

PAGES = []

def lodging_ld():
    return {"@context": "https://schema.org", "@type": "LodgingBusiness", "name": "Le Rempart",
            "description": "Trois gîtes dans une ancienne ferme en carré au cœur de Ciney, en province de Namur.",
            "url": S['url_base'] + '/', "email": S['email'], "telephone": S['whatsapp'],
            "image": S['url_base'] + '/assets/img/cour-7458-og.jpg',
            "address": {"@type": "PostalAddress", "streetAddress": S['rue'], "postalCode": S['cp'], "addressLocality": S['ville'], "addressRegion": "Namur", "addressCountry": S['pays']},
            "geo": {"@type": "GeoCoordinates", "latitude": S['lat'], "longitude": S['lon']},
            "checkinTime": "15:00", "petsAllowed": False,
            "amenityFeature": [{"@type": "LocationFeatureSpecification", "name": n, "value": True} for n in ("Parking", "Borne de recharge pour véhicule électrique", "Wi-Fi", "Feu de bois")]}

def rental_ld(g):
    eq = [x.split('|')[0] for k in g['equipements'].values() for x in k if '|' not in x]
    return {"@context": "https://schema.org", "@type": "VacationRental", "name": f"Le Rempart · {g['nom']}",
            "description": g['intro'], "url": S['url_base'] + '/' + gite_url(g),
            "identifier": f"lerempart-{g['slug']}",
            "image": [S['url_base'] + f'/assets/img/{k}-og.jpg' for k in (g['galerie'] or ['cour-7458'])][:4],
            "containsPlace": {"@type": "Accommodation", "occupancy": {"@type": "QuantitativeValue", "maxValue": g['personnes']},
                              "numberOfBedrooms": g['chambres'], "numberOfBathroomsTotal": g['sdb'],
                              "amenityFeature": [{"@type": "LocationFeatureSpecification", "name": n, "value": True} for n in eq]},
            "address": {"@type": "PostalAddress", "streetAddress": S['rue'], "postalCode": S['cp'], "addressLocality": S['ville'], "addressCountry": S['pays']},
            "geo": {"@type": "GeoCoordinates", "latitude": S['lat'], "longitude": S['lon']},
            "checkinTime": "15:00", "petsAllowed": False}

# =====================================================================
# ACCUEIL
# =====================================================================
def build_home():
    p = Page('')
    houses = ''
    for i, g in enumerate(G):
        pic = f'<a class="ph r-32" href="{p.rel(gite_url(g))}" tabindex="-1" aria-hidden="true">{img(p, g["hero"], "(max-width:860px) 100vw, 58vw")}</a>' if g['hero'] else todo("Photographies du gîte 3 à venir", "r-32")
        houses += f'''<article class="house{' rev' if i % 2 else ''} rv">
 {pic}
 <div class="txt"><span class="roman">{g['roman']}</span><span class="eyebrow">{E(g['signature'])}</span><h3 class="h3">{g['nom']}</h3><p class="muted">{E(g['intro'])}</p>
  <dl><div><dt>Personnes</dt><dd>{g['personnes']}</dd></div><div><dt>Chambres</dt><dd>{g['chambres']}</dd></div><div><dt>Salles de bain</dt><dd>{g['sdb']}</dd></div></dl>
  <a class="link" href="{p.rel(gite_url(g))}">Découvrir le {g['nom'].lower()}</a></div>
</article>'''
    body = f'''<section class="hero">
 <picture><source media="(max-aspect-ratio: 4/5)" srcset="{srcset(p, 'cour-7458')[0]}" sizes="100vw">{img(p, 'exterieur-04', '100vw', eager=True, alt=ALT['cour-7458'])}</picture>
 <div class="wrap hero-in">
  <span class="eyebrow">Ciney · Province de Namur</span>
  <h1 class="display">Une ferme en carré, trois maisons, une seule cour.</h1>
  <div class="hero-cta"><a class="btn light" href="{p.rel('la-demeure/')}">Découvrir la demeure</a><a class="link" href="{p.rel('gites/')}">Nos trois gîtes</a></div>
 </div>
 <span class="hero-scroll" aria-hidden="true">Défiler</span>
</section>

<section class="sec">
 <div class="wrap split">
  <div class="c-1-7 stack-l rv">
   <span class="eyebrow">Le domaine</span>
   <p class="manifesto">Derrière les murs de pierre de l'Avenue de Namur, une ancienne ferme du Condroz s'ouvre sur <em>une cour pavée</em>, une pelouse et des buis taillés. Trois maisons s'y partagent le calme, à quelques minutes à pied du centre de Ciney.</p>
  </div>
  <div class="c-9-4 stack rv" style="align-self:end">
   <p class="muted">Chaque gîte a son entrée, ses chambres et sa cuisine. On peut y venir à huit, à douze, ou réunir les trois maisons pour vingt-huit personnes : une famille entière, des amis de toujours, un anniversaire qui compte.</p>
   <a class="link" href="{p.rel('la-demeure/')}">L'histoire de la demeure</a>
  </div>
  <div class="c-1-12 rv" style="margin-top:clamp(40px,6vh,80px)">
   <div class="figs"><div><b>3</b><span>Gîtes</span></div><div><b>28</b><span>Personnes au total</span></div><div><b>14</b><span>Chambres</span></div><div><b>1</b><span>Cour partagée</span></div></div>
  </div>
 </div>
</section>

<section class="sec tight">
 <div class="wrap">
  <div class="mosaic">
   <div class="a ph r-32 rv">{img(p, 'exterieur-04', '(max-width:700px) 100vw, 58vw')}</div>
   <div class="b ph r-34 rv">{img(p, 'cour-7455', '(max-width:700px) 100vw, 40vw')}</div>
  </div>
 </div>
</section>

<section class="sec" id="gites">
 <div class="wrap">
  <div class="split rv" style="margin-bottom:clamp(56px,10vh,120px)">
   <div class="c-1-6 stack"><span class="eyebrow">Nos gîtes</span><h2 class="h2">Trois maisons, trois façons de recevoir.</h2></div>
   <p class="c-8-5 muted" style="align-self:end">Une grande maison pour douze avec piscine intérieure et sauna, deux maisons pour huit autour du feu. Les trois partagent la cour, le jardin et le parking.</p>
  </div>
  {houses}
 </div>
</section>

<section class="band">
 <picture>{img(p, 'gite-2-02', '100vw')}</picture>
 <div class="wrap rv"><span class="eyebrow">Art de vivre</span><blockquote>Le temps d'un bain chaud, d'un feu qui crépite, d'un dîner qui s'étire.</blockquote></div>
</section>

<section class="sec">
 <div class="wrap split">
  <div class="c-1-4 stack rv"><span class="eyebrow">Expériences</span><h2 class="h2">Ce que l'on vit au Rempart.</h2><a class="link" href="{p.rel('experiences/')}">Toutes les expériences</a></div>
  <ol class="moments c-6-7 rv">
   <li><span class="num">i.</span><h3>La table</h3><p>Une longue table sous les voûtains de brique, une cuisine en îlot : ici, les repas durent. <span class="where">Gîte 1 · douze convives</span></p></li>
   <li><span class="num">ii.</span><h3>Le bien-être</h3><p>Une piscine intérieure et un sauna, réservés aux hôtes du gîte 1. <span class="where">Gîte 1</span></p></li>
   <li><span class="num">iii.</span><h3>Le feu de bois</h3><p>Une cheminée dans chacune des trois maisons, pour les soirées d'automne et d'hiver. <span class="where">Les trois gîtes</span></p></li>
   <li><span class="num">iv.</span><h3>La cour</h3><p>Pavés, pelouse, tables de bois et parasols : l'espace commun du domaine, à l'abri des murs. <span class="where">Tout le domaine</span></p></li>
  </ol>
 </div>
</section>

<section class="sec stone">
 <div class="wrap split">
  <div class="c-1-5 ph r-45 rv">{img(p, 'cour-7456', '(max-width:860px) 100vw, 40vw')}</div>
  <div class="c-7-6 stack-l rv" style="align-self:center">
   <span class="eyebrow">La demeure</span>
   <h2 class="h2">Une ferme du cœur de Ciney, et ses vies successives.</h2>
   <p class="muted prose">La presse se souvient d'une ferme où l'on venait chercher le lait et les œufs : la ferme Delvaux. En 2012, l'écrivain Martin Gray, auteur d'<i>Au nom de tous les miens</i>, achète une ferme en carré au centre de la ville et s'y installe. Le lieu a depuis accueilli un restaurant, avant de devenir trois gîtes.</p>
   <a class="link" href="{p.rel('la-demeure/')}">Lire l'histoire de la demeure</a>
  </div>
 </div>
</section>

<section class="sec">
 <div class="wrap split">
  <div class="c-1-5 stack-l rv">
   <span class="eyebrow">La région</span>
   <h2 class="h2">Entre Meuse, Lesse et Condroz.</h2>
   <p class="muted">Dinant est à un quart d'heure, Namur à moins d'une demi-heure. Entre les deux : des châteaux au bord de l'eau, des abbayes, des grottes, et de grandes tables.</p>
   <a class="link" href="{p.rel('region/')}">À la découverte de la région</a>
  </div>
  <div class="c-7-6 rv">
   <ol class="moments">
    <li><span class="num">11'</span><h3>Château de Spontin</h3><p>Un château fort au bord du Bocq.</p></li>
    <li><span class="num">17'</span><h3>Dinant</h3><p>La collégiale et la citadelle au-dessus de la Meuse.</p></li>
    <li><span class="num">29'</span><h3>Jardins d'Annevoie</h3><p>Des jardins d'eau du XVIIIe siècle.</p></li>
    <li><span class="num">33'</span><h3>Grottes de Han</h3><p>Les grottes de la Lesse et leur parc animalier.</p></li>
   </ol>
   <p class="small muted" style="margin-top:14px">Durées en voiture sans trafic, calculées avec OpenStreetMap.</p>
  </div>
 </div>
</section>
{cta(p)}'''
    page(p, 'Le Rempart · Trois gîtes de caractère au cœur de Ciney', "Trois gîtes dans une ancienne ferme en carré au cœur de Ciney, en province de Namur : de 8 à 12 personnes, 28 pour le domaine entier. Piscine intérieure et sauna dans le gîte 1.", body, over=True, jsonld=[lodging_ld()])

# =====================================================================
# LA DEMEURE
# =====================================================================
SOURCES = [
 ('avenir2012', "L'Avenir, « Martin Gray, second résident \"surprise\" à Ciney », Emmanuel Wilputte, 20 août 2012", 'https://www.lavenir.net/regions/namur/ciney/2012/08/20/martin-gray-second-resident-surprise-a-ciney-A3MUZ35X4RD73BBZTAUBUI3RNQ/'),
 ('rtbf2016', "RTBF (Belga), « L'écrivain Martin Gray retrouvé mort à son domicile de Ciney », 25 avril 2016", 'https://www.rtbf.be/article/l-ecrivain-martin-gray-retrouve-mort-a-son-domicile-de-ciney-9279285'),
 ('libre2025', "La Libre Belgique, « À la découverte du Rempart, à Ciney », Caroline Viatour, 30 mars 2025", 'https://www.lalibre.be/lifestyle/food/2025/03/30/a-la-decouverte-du-rempart-a-ciney-un-restaurant-unique-tenu-par-une-seule-personne-YDOZQXESUVDZZJVQTYBIDMP2QY/'),
 ('patrimoine', "Liste du patrimoine immobilier classé de Ciney (d'après l'Agence wallonne du patrimoine)", 'https://fr.wikipedia.org/wiki/Liste_du_patrimoine_immobilier_class%C3%A9_de_Ciney'),
]
def src(k):
    i = [s[0] for s in SOURCES].index(k) + 1
    return f'<a href="#source-{i}">[{i}]</a>'

def build_demeure():
    p = Page('la-demeure/')
    ok, prob = '<span class="status ok">Confirmé</span>', '<span class="status prob">Probable</span>'
    unk = '<span class="status">Inconnu</span>'
    body = f'''<section class="pagehead">
 <div class="wrap">
  <nav class="crumbs" aria-label="Fil d'Ariane"><a href="{p.rel('')}">Accueil</a> · La demeure</nav>
  <span class="eyebrow">La demeure</span>
  <h1 class="display">Une ferme en carré, au cœur de Ciney.</h1>
  <p class="lead">Des murs de calcaire, des fenêtres cintrées de brique, des toits d'ardoise autour d'une cour. Voici ce que l'on sait de cette maison, et ce que l'on cherche encore.</p>
 </div>
</section>

<section class="sec tight">
 <div class="wrap">
  <div class="ph r-219 rv">{img(p, 'cour-7456', '100vw')}</div>
  <p class="cap">La cour intérieure, aujourd'hui partagée par les trois gîtes.</p>
 </div>
</section>

<section class="sec">
 <div class="wrap split">
  <div class="c-1-4 stack rv"><span class="eyebrow">Architecture</span><h2 class="h3">Ce que racontent les pierres</h2></div>
  <div class="c-6-7 stack rv prose">
   <p>Le Rempart est une <b>ferme en carré</b> : des bâtiments disposés autour d'une cour fermée, un plan que l'on retrouve dans de nombreuses fermes du Condroz. Les façades sont en moellons de pierre calcaire ; plusieurs baies sont encadrées d'arcs de brique ; les toitures sont couvertes d'ardoise.</p>
   <p>À l'intérieur, les voûtains de brique posés sur des poutres, visibles dans le gîte 1, témoignent des anciens usages agricoles du bâtiment. La date de construction de la ferme et le nom de ses bâtisseurs ne sont pas connus à ce jour.</p>
   <p>La maison n'est pas un monument classé. Elle se trouve à environ cent vingt mètres du seul vestige visible de l'enceinte médiévale de Ciney, la tour d'angle de la rue du Rempart de la Tour, classée en 1982 {src('patrimoine')}. Le nom du domaine vient très probablement de ce voisinage.</p>
  </div>
 </div>
</section>

<section class="sec stone">
 <div class="wrap">
  <div class="split rv" style="margin-bottom:clamp(48px,8vh,96px)">
   <div class="c-1-6 stack"><span class="eyebrow">Chronologie</span><h2 class="h2">Les vies de la maison</h2></div>
   <p class="c-8-5 muted" style="align-self:end">Chaque étape indique son niveau de certitude et sa source. Nous complétons cette histoire au fil de nos recherches dans les archives.</p>
  </div>
  <ol class="chrono">
   <li class="rv"><span class="when">Origines</span><div class="what"><h3>Une ferme du Condroz</h3><p class="muted">On ignore quand la ferme a été bâtie, par qui, et quels en furent les premiers propriétaires. Les archives communales, le cadastre ancien et les actes notariés sont les prochaines pistes.</p>{unk}</div></li>
   <li class="rv"><span class="when">Avant 2012</span><div class="what"><h3>La ferme Delvaux</h3><p class="muted">Un habitant de Ciney se souvient d'y être venu enfant chercher du lait, des œufs et du beurre : c'était alors « la ferme Delvaux ». Ce témoignage, publié dans la presse en 2025, n'est pas encore appuyé par une archive datée.</p>{ok}<p class="src">Témoignage rapporté {src('libre2025')}</p></div></li>
   <li class="rv"><span class="when">2012</span><div class="what"><h3>Martin Gray s'installe à Ciney</h3><p class="muted">À quatre-vingt-dix ans, l'écrivain Martin Gray, auteur d'<i>Au nom de tous les miens</i>, achète une ferme en carré au centre de Ciney pour en faire sa résidence. L'agent immobilier le décrit comme « un amoureux de patrimoine », qui pense aussitôt aux améliorations à apporter au bâtiment.</p>{ok}<p class="src">{src('avenir2012')}</p><p class="muted">Que cette ferme soit bien celle de l'Avenue de Namur 6 est très probable : un article de 2025 situe à cette adresse l'ancienne ferme Delvaux devenue la maison de Martin Gray. L'article de 2012 ne cite pas d'adresse.</p>{prob}<p class="src">{src('libre2025')}</p></div></li>
   <li class="rv"><span class="when">2013</span><div class="what"><h3>Citoyen d'honneur</h3><p class="muted">Martin Gray, installé en Belgique depuis 2001, est fait citoyen d'honneur de Ciney.</p>{ok}<p class="src">{src('rtbf2016')}</p></div></li>
   <li class="rv"><span class="when">2016</span><div class="what"><h3>Le départ de l'écrivain</h3><p class="muted">Martin Gray s'éteint en avril 2016, à quatre-vingt-treize ans, dans sa maison de Ciney. Le bourgmestre salue alors « un grand humaniste ».</p>{ok}<p class="src">{src('rtbf2016')}</p></div></li>
   <li class="rv"><span class="when">2016 – 2024</span><div class="what"><h3>De nouvelles mains</h3><p class="muted">La propriété change de propriétaires, et l'on y prépare des projets de réception.</p>{ok}<p class="src">{src('libre2025')}</p></div></li>
   <li class="rv"><span class="when">2025</span><div class="what"><h3>Une table de douze couverts</h3><p class="muted">La maison accueille un restaurant nommé Le Rempart, conçu comme un hommage à l'histoire de la ferme et à Martin Gray. Cette salle est aujourd'hui devenue le gîte 3.</p>{ok}<p class="src">{src('libre2025')}</p></div></li>
   <li class="rv"><span class="when">Aujourd'hui</span><div class="what"><h3>Trois gîtes autour de la cour</h3><p class="muted">La ferme est partagée en trois maisons pour huit à douze personnes, avec la cour, le jardin et le parking en commun.</p><a class="link" href="{p.rel('gites/')}">Découvrir les trois gîtes</a></div></li>
  </ol>
 </div>
</section>

<section class="sec">
 <div class="wrap split">
  <div class="c-1-5 stack-l rv">
   <span class="eyebrow">Martin Gray</span>
   <h2 class="h3">Un écrivain, un témoin</h2>
   <p class="muted">Né à Varsovie en 1922, Martin Gray a raconté dans <i>Au nom de tous les miens</i> la perte des siens dans les camps nazis, puis dans l'incendie de sa maison du sud de la France. Il a créé la fondation Dina Gray, consacrée à la lutte contre les incendies de forêt et à la protection de l'Homme {src('rtbf2016')}.</p>
   <p class="muted">Nous évoquons son passage au Rempart avec discrétion, par respect pour sa mémoire et pour sa famille.</p>
  </div>
  <div class="c-7-6 ph r-45 rv">{img(p, 'cour-7455', '(max-width:860px) 100vw, 48vw')}</div>
 </div>
</section>

<section class="sec stone">
 <div class="wrap split">
  <div class="c-1-4 stack rv"><span class="eyebrow">Ce que nous cherchons</span><h2 class="h3">Une histoire à compléter</h2></div>
  <div class="c-6-7 stack rv">
   <div class="ledger-wrap"><table class="ledger">
    <thead><tr><th scope="col">Question</th><th scope="col">État</th></tr></thead>
    <tbody>
     <tr><td>Date de construction de la ferme</td><td>{unk}</td></tr>
     <tr><td>Bâtisseurs et premiers propriétaires</td><td>{unk}</td></tr>
     <tr><td>Usages successifs avant la ferme Delvaux</td><td>{unk}</td></tr>
     <tr><td>Origine du nom « Le Rempart »</td><td>{prob}</td></tr>
     <tr><td>Photographies anciennes de la cour</td><td>{unk}</td></tr>
    </tbody>
   </table></div>
   <p class="muted">Vous avez connu la ferme, possédez une photographie ancienne ou un souvenir ? <a href="{p.rel('contact/')}">Écrivez-nous</a> : nous serions heureux de compléter cette page, en citant votre contribution.</p>
  </div>
 </div>
</section>

<section class="sec tight">
 <div class="wrap">
  <h2 class="eyebrow" style="margin-bottom:18px">Sources</h2>
  <ol class="src" style="display:grid;gap:8px;padding-left:1.2em">{''.join(f'<li id="source-{i}"><a href="{u}" rel="noopener" target="_blank">{E(t)}</a></li>' for i, (_, t, u) in enumerate(SOURCES, 1))}</ol>
  <p class="src" style="margin-top:14px">Sources consultées le 28 novembre 2026.</p>
 </div>
</section>
{cta(p, "Séjourner dans l'histoire.", "Trois maisons pour huit à douze personnes, autour de la cour de l'ancienne ferme.")}'''
    page(p, 'La demeure, une ferme en carré au cœur de Ciney', "L'histoire du Rempart à Ciney : une ferme en carré du Condroz, l'ancienne ferme Delvaux, la maison de l'écrivain Martin Gray de 2012 à 2016, puis trois gîtes. Faits sourcés.", body, jsonld=[lodging_ld()], og='cour-7456')

# =====================================================================
# NOS GÎTES
# =====================================================================
def build_gites():
    p = Page('gites/')
    blocks = ''
    for i, g in enumerate(G):
        pic = f'<a class="ph r-45" href="{p.rel(gite_url(g))}" tabindex="-1" aria-hidden="true">{img(p, g["hero"], "(max-width:860px) 100vw, 33vw")}</a>' if g['hero'] else f'<a href="{p.rel(gite_url(g))}" tabindex="-1" aria-hidden="true">{todo("Photographies à venir", "r-45")}</a>'
        blocks += f'<article class="stack rv" style="grid-column:span 4">{pic}<span class="roman num" style="font-size:2.6rem;line-height:1">{g["roman"]}</span><span class="eyebrow">{E(g["signature"])}</span><h2 class="h3">{g["nom"]}</h2><p class="muted">{E(g["intro"])}</p><a class="link" href="{p.rel(gite_url(g))}">Découvrir</a></article>'
    has = lambda g, word: any(word.lower() in x.lower() for v in g['equipements'].values() for x in v)
    yn = lambda b: 'Oui' if b else '—'
    rows = [('Personnes', [str(g['personnes']) for g in G]), ('Chambres', [str(g['chambres']) for g in G]), ('Salles de bain', [str(g['sdb']) for g in G]),
            ('Piscine intérieure', [yn(has(g, 'piscine')) for g in G]), ('Sauna', [yn(has(g, 'sauna')) for g in G]),
            ('Feu de bois', [yn(has(g, 'feu de bois')) for g in G]), ('Salle de jeux', [yn(has(g, 'flipper')) for g in G]),
            ('Lave-linge', [yn(has(g, 'lave-linge')) for g in G])]
    table = '<thead><tr><td></td>' + ''.join(f'<th scope="col">{g["nom"]}</th>' for g in G) + '</tr></thead><tbody>' + ''.join(f'<tr><th scope="row">{k}</th>' + ''.join(f'<td>{v}</td>' for v in vs) + '</tr>' for k, vs in rows) + '</tbody>'
    body = f'''<section class="pagehead">
 <div class="wrap">
  <nav class="crumbs" aria-label="Fil d'Ariane"><a href="{p.rel('')}">Accueil</a> · Nos gîtes</nav>
  <span class="eyebrow">Nos gîtes</span>
  <h1 class="display">Trois maisons autour d'une cour.</h1>
  <p class="lead">Chaque gîte a son entrée, ses chambres et sa cuisine. Ensemble, ils accueillent vingt-huit personnes.</p>
 </div>
</section>
<section class="sec tight"><div class="wrap split" style="row-gap:72px">{blocks}</div></section>
<section class="sec stone">
 <div class="wrap split">
  <div class="c-1-4 stack rv"><span class="eyebrow">Comparer</span><h2 class="h3">En un coup d'œil</h2></div>
  <div class="c-5-8 rv"><div class="compare-wrap"><table class="compare">{table}</table></div></div>
 </div>
</section>
<section class="sec">
 <div class="wrap split">
  <div class="c-1-6 ph r-32 rv">{img(p, 'cour-7458', '(max-width:860px) 100vw, 50vw')}</div>
  <div class="c-8-5 stack-l rv" style="align-self:center">
   <span class="eyebrow">Le domaine entier</span>
   <h2 class="h3">Vingt-huit personnes, une seule cour.</h2>
   <p class="muted">Les trois gîtes peuvent se louer ensemble : quatorze chambres, quatorze salles de bain, et toute la cour pour vous. Pour une réunion de famille, un anniversaire, un week-end entre amis.</p>
   <a class="link" href="{p.rel('reserver/')}?gite=domaine">Demander le domaine entier</a>
  </div>
 </div>
</section>
{cta(p)}'''
    page(p, 'Nos gîtes : trois maisons de 8 à 12 personnes', "Les trois gîtes du Rempart à Ciney : gîte 1 pour 12 personnes avec piscine intérieure et sauna, gîtes 2 et 3 pour 8 personnes avec feu de bois. Jusqu'à 28 personnes ensemble.", body, jsonld=[lodging_ld()], og='gite-1-02')

def build_gite(g):
    p = Page(gite_url(g))
    others = [x for x in G if x is not g]
    if g['hero']:
        hero = f'<section class="ghero"><picture>{img(p, g["hero"], "100vw", eager=True)}</picture>'
    else:
        hero = f'<section class="ghero todo-hero">{dessin("ferme", "hero-drawing")}'
    hero += f'''<div class="wrap"><nav class="crumbs" aria-label="Fil d'Ariane"><a href="{p.rel('')}">Accueil</a> · <a href="{p.rel('gites/')}">Nos gîtes</a> · {g['nom']}</nav><span class="eyebrow" style="color:rgba(255,255,255,.88)">{E(g['signature'])}</span><h1 class="display">{g['nom']}</h1>{'' if g['hero'] else '<p style="max-width:30em;color:rgba(247,244,238,.8)">Le reportage photographique de ce gîte est en préparation. Les deux images de la galerie montrent le domaine, pas l’intérieur du gîte 3.</p>'}</div></section>'''
    # galerie
    gal = ''
    cols = 0
    for k in g['galerie']:
        w, h = IMG[k]
        cls = 'g-w' if w > h else 'g-t'
        cols += 4 if cls == 'g-w' else 2
        big = 2000 if w >= 2000 else (1280 if w >= 1280 else 640)
        gal += f'<button type="button" class="{cls}" data-full="{p.rel(f"assets/img/{k}-{big}.webp")}" aria-label="Agrandir : {E(ALT.get(k, ""))}">{img(p, k, "(max-width:700px) 50vw, 33vw")}</button>'
    labels = ['Chambres · photographie à venir', 'Salles de bain · photographie à venir', 'Séjour · photographie à venir', 'Cuisine · photographie à venir', 'Façade · photographie à venir', 'Vidéo · à venir']
    i = 0
    while cols % 6 or cols < 12:
        gal += todo(labels[i % len(labels)], '')
        cols += 2; i += 1
    # équipements
    amen = ''
    for key, label, ico in CATS_EQ:
        items = g['equipements'].get(key)
        if not items: continue
        lis = ''.join((f'<li>{E(x.split("|")[0])}<span class="soon">Bientôt</span></li>' if '|' in x else f'<li>{E(x)}</li>') for x in items)
        amen += f'<section class="rv"><h3>{dessin(ico)}{label}</h3><ul>{lis}</ul></section>'
    pr = S['pratique']
    clean = lambda v: E(v.replace(' (PROVISOIRE)', ''))
    facts = ''.join(f'<div><dt>{k}</dt><dd>{v}</dd></div>' for k, v in [
        ('Capacité', f"{g['personnes']} personnes · {g['chambres']} chambres · {g['sdb']} salles de bain"),
        ('Arrivée', clean(pr['arrivee'])), ('Départ', clean(pr['depart'])), ('Caution', clean(pr['caution'])),
        ('Animaux', clean(pr['animaux'])), ('Stationnement', clean(pr['stationnement'])), ('Tabac', clean(pr['tabac'])),
        ('Domaine entier', clean(pr['domaine_entier'])), ('Tarifs', 'Sur demande, selon les dates et la durée du séjour')])
    surf = f'<div><b>{g["surface"]}</b><span>m²</span></div>' if g['surface'] else ''
    lead_pic = img(p, g['galerie'][1], '(max-width:860px) 100vw, 40vw') if len(g['galerie']) > 1 else ''
    other = ''.join(f'<a class="link" href="{p.rel(gite_url(o))}">{o["nom"]} · {o["personnes"]} personnes</a>' for o in others)
    body = f'''{hero}
<section class="sec tight" style="padding-top:0">
 <div class="wrap"><div class="keyfacts rv"><div><b>{g['personnes']}</b><span>Personnes</span></div><div><b>{g['chambres']}</b><span>Chambres</span></div><div><b>{g['sdb']}</b><span>Salles de bain</span></div>{surf}<div><b>15 h</b><span>Arrivée</span></div></div></div>
</section>
<section class="sec">
 <div class="wrap split">
  <div class="c-1-6 stack-l rv"><span class="eyebrow">L'atmosphère</span><p class="manifesto" style="font-size:clamp(1.6rem,1.1rem + 1.9vw,2.7rem)">{E(g['intro'])}</p></div>
  <div class="c-8-5 stack rv" style="align-self:end">{''.join(f'<p class="muted">{E(t)}</p>' for t in g['atmosphere'])}<a class="btn" href="{p.rel('reserver/')}?gite={g['id']}" style="justify-self:start;margin-top:12px">Demander ce gîte</a></div>
 </div>
</section>
<section class="sec tight" aria-labelledby="galerie-t">
 <div class="wrap stack-l">
  <div class="split rv"><div class="c-1-6 stack"><span class="eyebrow" id="galerie-t">Galerie</span><h2 class="h3">En images</h2></div><p class="c-8-5 muted small" style="align-self:end">{'Photographies du gîte et du domaine. Les reportages professionnels et les vidéos arriveront ici.' if g['hero'] else 'La cour et la façade du domaine. Le reportage du gîte 3 est prévu : en attendant, ces cadres restent vides plutôt que de montrer une autre maison.'}</p></div>
  <div class="gallery">{gal}</div>
 </div>
</section>
<section class="sec">
 <div class="wrap stack-l">
  <div class="split rv"><div class="c-1-6 stack"><span class="eyebrow">Équipements</span><h2 class="h3">Ce que vous trouverez</h2></div><p class="c-8-5 muted small" style="align-self:end">Seuls les équipements présents dans le {g['nom'].lower()} sont indiqués.</p></div>
  <div class="amen">{amen}</div>
 </div>
</section>
<section class="sec stone">
 <div class="wrap split">
  <div class="c-1-4 stack rv"><span class="eyebrow">Informations pratiques</span><h2 class="h3">Avant de venir</h2></div>
  <dl class="facts c-5-8 rv">{facts}</dl>
 </div>
</section>
<section class="sec">
 <div class="wrap split">
  <div class="c-1-6 stack-l rv"><span class="eyebrow">Réserver le {g['nom'].lower()}</span><h2 class="h2">Vos dates, vos invités.</h2><p class="muted prose">Indiquez vos dates et le nombre de voyageurs. Nous vous répondons personnellement, avec la disponibilité et le tarif exacts.</p><a class="btn" href="{p.rel('reserver/')}?gite={g['id']}" style="justify-self:start">Demander ce gîte</a></div>
  <div class="c-8-5 stack rv" style="align-self:end"><span class="eyebrow">Les autres maisons</span>{other}<a class="link" href="{p.rel('reserver/')}?gite=domaine">Le domaine entier · 28 personnes</a></div>
 </div>
</section>
<div class="lightbox" id="lightbox" aria-hidden="true" role="dialog" aria-label="Galerie"><button class="lb-close" type="button">Fermer</button><button class="lb-prev" type="button" aria-label="Photo précédente">Préc.</button><img alt=""><button class="lb-next" type="button" aria-label="Photo suivante">Suiv.</button><span class="lb-count"></span></div>'''
    extra = ' Piscine intérieure et sauna.' if g['id'] == '1' else ' Feu de bois, cour et jardin partagés.'
    title = f"{g['nom']} : gîte de {g['personnes']} personnes à Ciney" + (' avec piscine et sauna' if g['id'] == '1' else '')
    page(p, title, f"{g['nom']} au Rempart, Ciney : {g['personnes']} personnes, {g['chambres']} chambres, {g['sdb']} salles de bain.{extra} Dans une ancienne ferme en carré, province de Namur.", body, over=True, jsonld=[rental_ld(g)], og=g['hero'] or 'cour-7458')

# =====================================================================
# EXPÉRIENCES
# =====================================================================
def build_experiences():
    p = Page('experiences/')
    body = f'''<section class="pagehead">
 <div class="wrap">
  <nav class="crumbs" aria-label="Fil d'Ariane"><a href="{p.rel('')}">Accueil</a> · Expériences</nav>
  <span class="eyebrow">Expériences</span>
  <h1 class="display">Prendre le temps.</h1>
  <p class="lead">Ce que l'on vit au Rempart tient en peu de choses : une grande table, un feu, l'eau chaude, la cour au soleil, et une région à explorer.</p>
 </div>
</section>
<section class="sec tight">
 <div class="wrap split">
  <div class="c-1-7 ph r-32 rv">{img(p, 'gite-1-02', '(max-width:860px) 100vw, 58vw')}</div>
  <div class="c-9-4 stack rv" style="align-self:end"><span class="num" style="font-size:2rem">i.</span><h2 class="h3">La table</h2><p class="muted">Dans le gîte 1, la table accueille douze convives sous les voûtains de brique. La cuisine en îlot, le four vapeur et la machine à café à grains sont là pour les cuisiniers de la famille.</p><a class="link" href="{p.rel('gites/gite-1/')}">Gîte 1</a></div>
 </div>
</section>
<section class="sec">
 <div class="wrap split">
  <div class="c-1-4 stack rv" style="align-self:center"><span class="num" style="font-size:2rem">ii.</span><h2 class="h3">L'eau et la chaleur</h2><p class="muted">Une piscine intérieure à la lumière tamisée, un sauna de bois clair : un espace bien-être réservé aux hôtes du gîte 1, à toute heure du séjour.</p><a class="link" href="{p.rel('gites/gite-1/')}">Gîte 1</a></div>
  <div class="c-6-7 mosaic" style="grid-template-columns:repeat(7,minmax(0,1fr))"><div class="ph r-34 rv" style="grid-column:1 / span 4">{img(p, 'gite-1-04', '(max-width:860px) 60vw, 33vw')}</div><div class="ph r-34 rv" style="grid-column:5 / span 3;align-self:end">{img(p, 'gite-1-05', '(max-width:860px) 40vw, 25vw')}</div></div>
 </div>
</section>
<section class="band">
 <picture>{img(p, 'exterieur-03', '100vw')}</picture>
 <div class="wrap rv"><span class="eyebrow">iii. · Les trois gîtes</span><blockquote>Une cheminée dans chaque maison, pour les longues soirées.</blockquote></div>
</section>
<section class="sec">
 <div class="wrap split">
  <div class="c-1-5 ph r-45 rv">{img(p, 'exterieur-01', '(max-width:860px) 100vw, 40vw')}</div>
  <div class="c-7-6 stack-l rv" style="align-self:center"><span class="num" style="font-size:2rem">iv.</span><h2 class="h3">La cour</h2><p class="muted prose">Le cœur de la ferme en carré : des pavés anciens, une pelouse, des haies de buis, des tables de bois et des parasols. Les enfants y jouent à l'abri des murs, les adultes y prennent l'apéritif au soleil du soir.</p></div>
 </div>
</section>
<section class="sec stone">
 <div class="wrap split">
  <div class="c-1-5 stack-l rv"><span class="num" style="font-size:2rem">v.</span><h2 class="h3">Se retrouver à vingt-huit</h2><p class="muted">Réunissez les trois maisons : chacun garde son espace pour dormir et se reposer, et tout le monde se retrouve dans la cour. Une formule pensée pour les réunions de famille et les anniversaires.</p><a class="link" href="{p.rel('reserver/')}?gite=domaine">Demander le domaine entier</a></div>
  <div class="c-7-6 stack-l rv"><span class="num" style="font-size:2rem">vi.</span><h2 class="h3">Partir à la découverte</h2><p class="muted">Châteaux de la Meuse, kayak sur la Lesse, grottes de Han, abbayes et grandes tables : nous avons rassemblé nos adresses dans un rayon de cinquante kilomètres.</p><a class="link" href="{p.rel('region/')}">Le guide de la région</a></div>
 </div>
</section>
<section class="sec">
 <div class="wrap split">
  <div class="c-1-4 stack rv"><span class="eyebrow">Pendant le séjour</span><h2 class="h3">Un guide dans votre téléphone</h2></div>
  <p class="c-6-7 muted rv prose">Avant votre arrivée, vous recevez le lien de votre guide de séjour : accès, Wi-Fi, vidéos pour chaque équipement, adresses du quotidien. Sam, qui vous accueille, reste joignable sur WhatsApp pendant tout le séjour.</p>
 </div>
</section>
{cta(p)}'''
    page(p, 'Expériences : table, bien-être, feu de bois et cour', "Ce que l'on vit au Rempart à Ciney : grande table, piscine intérieure et sauna (gîte 1), feu de bois dans les trois gîtes, cour partagée et séjours jusqu'à 28 personnes.", body, jsonld=[lodging_ld()], og='gite-1-04')

# =====================================================================
# RÉGION
# =====================================================================
def build_region():
    p = Page('region/')
    lieux = sorted(R['lieux'], key=lambda l: l['min'])
    used = {c for l in lieux for c in l['cats']}
    cats = {k: v for k, v in R['categories'].items() if k in used}
    filt = '<button type="button" data-cat="all" aria-pressed="true">Tout</button>' + ''.join(f'<button type="button" data-cat="{k}" aria-pressed="false">{v}</button>' for k, v in cats.items())
    # carte schématique en SVG : rien n'est chargé de l'extérieur
    import math
    W, H = 1000, 640
    lat0, lon0 = S['lat'], S['lon']
    kx = 111.32 * math.cos(math.radians(lat0))
    scale = 10  # px par km : le cercle de 30 km touche le bord
    def xy(lat, lon): return W / 2 + (lon - lon0) * kx * scale, H / 2 - (lat - lat0) * 110.57 * scale
    rings = ''.join(f'<circle cx="{W/2}" cy="{H/2}" r="{r*scale}" fill="none" stroke="currentColor" stroke-width=".6" stroke-dasharray="2 5" opacity=".7"/><text x="{W/2 + r*scale*0.707 + 6}" y="{H/2 - r*scale*0.707 - 6}" font-size="12" fill="currentColor" font-family="Jost,sans-serif" letter-spacing="2">{r} KM</text>' for r in (10, 20, 30))
    towns = [('Namur', 50.4669, 4.8675), ('Dinant', 50.2606, 4.9122), ('Rochefort', 50.1631, 5.2219), ('Marche', 50.2270, 5.3420), ('Durbuy', 50.3526, 5.4560)]
    tl = ''.join(f'<text x="{xy(a, b)[0]}" y="{xy(a, b)[1] - 14}" font-size="15" text-anchor="middle" fill="currentColor" font-family="Cormorant Garamond,serif" font-style="italic">{t}</text>' for t, a, b in towns)
    pins = ''.join(f'<g class="pin" data-target="{l["id"]}" data-cats="{" ".join(l["cats"])}" tabindex="0" role="button" aria-label="{E(l["nom"])}" style="cursor:pointer;transition:opacity .4s"><circle cx="{xy(l["lat"], l["lon"])[0]:.1f}" cy="{xy(l["lat"], l["lon"])[1]:.1f}" r="5" fill="#C6AD83" stroke="var(--bg)" stroke-width="1.5"/><title>{E(l["nom"])} · {l["min"]} min</title></g>' for l in lieux if l['km'] > 0.5)
    home = f'<circle cx="{W/2}" cy="{H/2}" r="7" fill="var(--forest)" stroke="var(--bg)" stroke-width="2"/><text x="{W/2 + 14}" y="{H/2 + 5}" font-size="13" fill="var(--ink)" font-family="Jost,sans-serif" letter-spacing="3">LE REMPART</text>'
    svgmap = f'<svg class="static" viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Carte schématique des lieux autour du domaine">{rings}{tl}{pins}{home}</svg>'
    items = ''
    for i, l in enumerate(lieux, 1):
        tags = ' · '.join(cats[c] for c in l['cats'])
        site = f'<dt>Site</dt><dd><a href="{l["site"]}" target="_blank" rel="noopener">{E(l["site"].replace("https://", "").replace("www.", ""))}</a></dd>' if l['site'] else ''
        info = f'<dt>Pratique</dt><dd>{E(l["info"])}</dd>' if l['info'] else ''
        maps = f'https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route={S["lat"]}%2C{S["lon"]}%3B{l["lat"]}%2C{l["lon"]}'
        items += f'''<li class="place" id="{l['id']}" data-cats="{' '.join(l['cats'])}"><button type="button" aria-expanded="false" aria-controls="{l['id']}-d"><span class="num">{i:02d}</span><span><h3>{E(l['nom'])}</h3><span class="tag">{tags}</span></span><span class="meta">{l['min']} min · {str(l['km']).replace('.', ',')} km</span></button>
<div class="more" id="{l['id']}-d"><p>{E(l['texte'])}</p><dl><dt>Commune</dt><dd>{E(l['commune'])}</dd><dt>Adresse</dt><dd>{E(l['adresse'])}</dd><dt>Trajet</dt><dd>Environ {l['min']} min en voiture, {str(l['km']).replace('.', ',')} km · <a href="{maps}" target="_blank" rel="noopener">Itinéraire</a></dd>{site}{info}</dl></div></li>'''
    data = {'home': {'lat': S['lat'], 'lon': S['lon']}, 'places': [{'id': l['id'], 'name': l['nom'], 'lat': l['lat'], 'lon': l['lon'], 'cats': l['cats'], 'time': f"{l['min']} min · {l['km']} km"} for l in lieux]}
    body = f'''<section class="pagehead">
 <div class="wrap">
  <nav class="crumbs" aria-label="Fil d'Ariane"><a href="{p.rel('')}">Accueil</a> · Localisation</nav>
  <span class="eyebrow">Localisation</span>
  <h1 class="display">À la découverte de la région.</h1>
  <p class="lead">Ciney est au cœur du Condroz, entre la Meuse et la Lesse. En moins de quarante minutes : Dinant, Namur, Durbuy, les grottes de Han et une dizaine de châteaux.</p>
 </div>
</section>
<section class="sec tight" style="padding-top:0">
 <div class="wrap split">
  <div class="c-1-4 stack rv"><span class="eyebrow">Nous trouver</span><p class="lead" style="font-size:1.4rem">{E(S['rue'])}<br>{S['cp']} {S['ville']}</p><p class="muted small">À pied : le centre de Ciney et la collégiale sont à quelques minutes. Gare de Ciney (ligne Bruxelles – Namur – Luxembourg) à proximité.</p><a class="link" href="https://www.openstreetmap.org/?mlat={S['lat']}&mlon={S['lon']}#map=17/{S['lat']}/{S['lon']}" target="_blank" rel="noopener">Ouvrir le plan</a></div>
  <div class="c-5-8 stack rv">
   <div class="mapbox">{svgmap}<div class="map-consent" style="align-items:end;justify-items:end;pointer-events:none"><div style="pointer-events:auto"><button class="btn ghost" id="load-map" type="button" style="background:var(--bg)">Carte détaillée</button></div></div></div>
   <p class="small muted">Carte schématique : cercles à 10, 20 et 30 km. La carte détaillée se charge depuis OpenStreetMap seulement si vous la demandez.</p>
  </div>
 </div>
</section>
<section class="sec">
 <div class="wrap stack-l">
  <div class="split rv"><div class="c-1-6 stack"><span class="eyebrow">Entre nature, patrimoine et art de vivre</span><h2 class="h2">Nos adresses à moins de 50 km</h2></div><p class="c-8-5 muted small" style="align-self:end">{len(lieux)} lieux, classés du plus proche au plus lointain. Le plus éloigné est à {max(l['km'] for l in lieux):.0f} km par la route. Touchez un lieu pour sa fiche. Pour le bien-être, la piscine intérieure et le sauna du gîte 1 sont sur place ; nos adresses de spas sont en cours de sélection.</p></div>
  <div class="filters rv" role="toolbar" aria-label="Filtrer par catégorie">{filt}</div>
  <ol class="places">{items}</ol>
  <p class="src">Lieux vérifiés le {date.fromisoformat(R['verifie_le']).strftime('%d/%m/%Y')}. Adresses et positions : OpenStreetMap. Durées en voiture sans trafic (OSRM), depuis l'entrée du domaine. Horaires, tarifs et périodes d'ouverture changent : consultez toujours le site du lieu. Tables gastronomiques : adresses du livret d'accueil du domaine.</p>
  <script type="application/json" id="places-data">{json.dumps(data, ensure_ascii=False)}</script>
 </div>
</section>
<section class="sec stone">
 <div class="wrap stack-l">
  <div class="rv stack"><span class="eyebrow">Des expériences à chaque saison</span><h2 class="h2">Quand venir ?</h2></div>
  <div class="seasons rv">
   <div><h3>Printemps</h3><p class="muted">Les jardins d'eau d'Annevoie et les terrasses de Freÿr reprennent vie. Les villages de pierre, Crupet et Celles, se visitent à pied.</p></div>
   <div><h3>Été</h3><p class="muted">La descente de la Lesse en kayak, le domaine de Chevetogne pour les enfants, les longues soirées dans la cour.</p></div>
   <div><h3>Automne</h3><p class="muted">Les forêts du Condroz et de la Famenne se colorent. C'est la saison des balades, des grottes et du feu de bois.</p></div>
   <div><h3>Hiver</h3><p class="muted">Les abbayes, la citadelle de Namur, les grandes tables. Et à Ciney Expo, le Winter World, du 11 décembre 2026 au 3 janvier 2027 <span class="small">(cineyexpo.be, vu le 28/11/2026)</span>.</p></div>
  </div>
 </div>
</section>
{cta(p, 'Prolonger le séjour.', 'Une semaine ne suffit pas toujours. Demandez-nous les dates qui vous conviennent.')}'''
    page(p, 'Localisation et activités à moins de 50 km de Ciney', "Le Rempart, Avenue de Namur 6 à Ciney. Châteaux, abbayes, grottes de Han, kayak sur la Lesse, Dinant, Namur, Durbuy et tables gastronomiques : 37 adresses vérifiées à moins de 50 km.", body, jsonld=[lodging_ld()], og='cour-7459')

# =====================================================================
# RÉSERVATION
# =====================================================================
def booking_config():
    return {'whatsapp': S['whatsapp_num'], 'email': S['email'],
            'capacites': {g['id']: g['personnes'] for g in G} | {'domaine': sum(g['personnes'] for g in G)},
            'noms': {g['id']: f"{g['nom']} ({g['personnes']} personnes)" for g in G} | {'domaine': 'Le domaine entier (28 personnes)'},
            'liens': {k: v for k, v in S['liens_reservation'].items() if v}}

def build_reserver():
    p = Page('reserver/')
    choices = ''.join(f'<label><input type="radio" name="gite" value="{g["id"]}"><b>{g["nom"]}</b><small>{g["personnes"]} personnes · {g["chambres"]} chambres</small></label>' for g in G)
    choices += '<label><input type="radio" name="gite" value="domaine"><b>Le domaine</b><small>28 personnes · les 3 gîtes</small></label>'
    body = f'''<section class="pagehead">
 <div class="wrap">
  <nav class="crumbs" aria-label="Fil d'Ariane"><a href="{p.rel('')}">Accueil</a> · Réservation</nav>
  <span class="eyebrow">Réservation</span>
  <h1 class="display">Demander un séjour.</h1>
  <p class="lead">Choisissez votre maison et vos dates. Nous vous répondons personnellement, avec la disponibilité et le tarif exacts.</p>
 </div>
</section>
<section class="sec tight" style="padding-top:0">
 <div class="wrap split">
  <form class="form c-1-7 rv" id="booking" novalidate>
   <fieldset class="field"><legend>Votre maison</legend><div class="choice">{choices}</div><span class="small muted" id="cap-hint" aria-live="polite"></span></fieldset>
   <div class="row"><div class="field"><label for="arrivee">Arrivée (dès 15 h)</label><input type="date" id="arrivee" name="arrivee" required></div><div class="field"><label for="depart">Départ</label><input type="date" id="depart" name="depart" required></div></div>
   <div class="row"><div class="field"><label for="adultes">Adultes</label><select id="adultes" name="adultes">{''.join(f'<option{" selected" if n == 2 else ""}>{n}</option>' for n in range(1, 29))}</select></div><div class="field"><label for="enfants">Enfants</label><select id="enfants" name="enfants">{''.join(f'<option>{n}</option>' for n in range(0, 21))}</select></div></div>
   <div class="field"><label for="message">Votre message (occasion, heure d'arrivée, questions)</label><textarea id="message" name="message"></textarea></div>
   <div class="row"><div class="field"><label for="nom">Nom</label><input id="nom" name="nom" autocomplete="name" required></div><div class="field"><label for="tel">Téléphone</label><input id="tel" name="tel" type="tel" autocomplete="tel"></div></div>
   <div class="field"><label for="email">E-mail</label><input id="email" name="email" type="email" autocomplete="email"></div>
   <p class="err" id="form-err" role="alert"></p>
   <div class="sendrow"><button class="btn" type="submit">Préparer ma demande</button><span id="ext-links"></span></div>
   <div class="summary" id="summary" aria-live="polite"><span class="eyebrow">Votre demande</span><pre></pre><div class="sendrow"><a class="btn" data-wa target="_blank" rel="noopener" href="#">Envoyer par WhatsApp</a><a class="btn ghost" data-mail href="#">Envoyer par e-mail</a></div><p class="small muted">Le message s'ouvre dans votre application : c'est vous qui l'envoyez. Ce site n'enregistre aucune donnée.</p></div>
  </form>
  <aside class="c-9-4 stack-l rv">
   <div class="notice"><span class="eyebrow">Comment ça se passe</span><ol class="muted small" style="margin:0;padding-left:1.2em;display:grid;gap:8px"><li>Vous préparez votre demande ici.</li><li>Vous l'envoyez par WhatsApp ou par e-mail.</li><li>Nous vous répondons avec la disponibilité et le tarif.</li><li>Votre réservation est confirmée par écrit.</li></ol></div>
   <div class="notice"><span class="eyebrow">Bon à savoir</span><p class="muted small">Arrivée à partir de 15 h. Animaux non admis. Parking et bornes de recharge sur place. Les trois gîtes se louent aussi ensemble.</p></div>
   <div class="notice"><span class="eyebrow">Nous joindre</span><p class="small"><a href="https://wa.me/{S['whatsapp_num']}">WhatsApp {E(S['whatsapp'])}</a><br><a href="mailto:{S['email']}">{S['email']}</a></p></div>
  </aside>
 </div>
</section>
<script type="application/json" id="booking-config">{json.dumps(booking_config(), ensure_ascii=False)}</script>'''
    page(p, 'Réservation : demander un séjour', "Demandez votre séjour au Rempart à Ciney : gîte 1 (12 personnes), gîte 2 ou gîte 3 (8 personnes), ou le domaine entier pour 28 personnes. Réponse personnelle.", body, jsonld=[lodging_ld()], og='cour-7458')

def build_contact():
    p = Page('contact/')
    body = f'''<section class="pagehead"><div class="wrap"><nav class="crumbs" aria-label="Fil d'Ariane"><a href="{p.rel('')}">Accueil</a> · Contact</nav><span class="eyebrow">Contact</span><h1 class="display">Nous écrire.</h1><p class="lead">Une question sur un gîte, un séjour à préparer, un souvenir de la ferme à partager : nous vous répondons personnellement.</p></div></section>
<section class="sec tight" style="padding-top:0"><div class="wrap split">
 <form class="form c-1-7" id="contact-form" novalidate>
  <div class="row"><div class="field"><label for="c-nom">Nom</label><input id="c-nom" name="nom" autocomplete="name"></div><div class="field"><label for="c-email">E-mail</label><input id="c-email" name="email" type="email" autocomplete="email"></div></div>
  <div class="field"><label for="c-msg">Message</label><textarea id="c-msg" name="message"></textarea></div>
  <p class="err" id="contact-err" role="alert"></p>
  <div class="sendrow"><button class="btn" type="submit" value="mail">Envoyer par e-mail</button><button class="btn ghost" type="submit" value="wa">Envoyer par WhatsApp</button></div>
  <p class="small muted">Le message s'ouvre dans votre application : ce site n'enregistre aucune donnée.</p>
 </form>
 <aside class="c-9-4 stack-l"><div class="notice"><span class="eyebrow">Adresse</span><p>{E(S['rue'])}<br>{S['cp']} {S['ville']}, Belgique</p></div><div class="notice"><span class="eyebrow">WhatsApp</span><p><a href="https://wa.me/{S['whatsapp_num']}">{E(S['whatsapp'])}</a></p></div><div class="notice"><span class="eyebrow">E-mail</span><p><a href="mailto:{S['email']}">{S['email']}</a></p></div></aside>
</div></section>
<script type="application/json" id="booking-config">{json.dumps(booking_config(), ensure_ascii=False)}</script>'''
    page(p, 'Contact', "Contacter Le Rempart, trois gîtes à Ciney : WhatsApp, e-mail ou formulaire.", body)

def build_legal():
    p = Page('mentions-legales/')
    ex = S['exploitant']
    bce = ex['bce'] or 'à compléter'
    body = f'''<section class="pagehead"><div class="wrap"><nav class="crumbs"><a href="{p.rel('')}">Accueil</a> · Mentions légales</nav><h1 class="h2">Mentions légales</h1></div></section>
<section class="sec tight legal" style="padding-top:0"><div class="wrap">
<h2>Éditeur du site</h2><p>{E(ex['nom'])}<br>{E(S['adresse'])}<br>Numéro d'entreprise (BCE) : {E(bce)}<br>E-mail : <a href="mailto:{S['email']}">{S['email']}</a> · WhatsApp : {E(S['whatsapp'])}</p>
<h2>Hébergement</h2><p>GitHub Pages, service de GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis.</p>
<h2>Propriété intellectuelle</h2><p>Les textes et photographies de ce site appartiennent au Rempart, sauf mention contraire. Toute reproduction demande une autorisation écrite.</p>
<h2>Sources et histoire</h2><p>Les informations historiques de la page « La demeure » citent leurs sources. Elles sont présentées avec leur niveau de certitude : confirmé, probable ou inconnu. Toute correction est la bienvenue.</p>
<h2>Informations pratiques</h2><p>Les informations sur les lieux de la région (adresses, durées de trajet) sont données à titre indicatif. Les horaires et tarifs des lieux cités ne sont pas reproduits : consultez leur site officiel.</p>
<h2>Réservations</h2><p>Les demandes de séjour sont confirmées par écrit par le domaine. Aucune réservation n'est conclue par ce site.</p>
</div></section>'''
    page(p, 'Mentions légales', "Mentions légales du site du Rempart, trois gîtes à Ciney.", body)
    p = Page('confidentialite/')
    body = f'''<section class="pagehead"><div class="wrap"><nav class="crumbs"><a href="{p.rel('')}">Accueil</a> · Confidentialité</nav><h1 class="h2">Confidentialité et cookies</h1></div></section>
<section class="sec tight legal" style="padding-top:0"><div class="wrap">
<h2>En bref</h2><p>Ce site ne dépose aucun cookie, n'utilise aucun outil de mesure d'audience et n'enregistre aucune donnée personnelle. C'est pourquoi aucun bandeau de cookies ne s'affiche.</p>
<h2>Formulaires</h2><p>Les formulaires de demande de séjour et de contact préparent un message dans votre propre application (WhatsApp ou messagerie e-mail). Rien n'est envoyé ni stocké tant que vous n'avez pas vous-même envoyé ce message. Les données que vous nous envoyez servent uniquement à répondre à votre demande et à organiser votre séjour.</p>
<h2>Services externes</h2><ul><li>Polices de caractères : Google Fonts (votre navigateur contacte les serveurs de Google pour les charger).</li><li>Carte détaillée : OpenStreetMap et la bibliothèque Leaflet (cdnjs), chargées seulement si vous cliquez sur « Carte détaillée ».</li><li>Hébergement : GitHub Pages, qui peut enregistrer des journaux techniques (adresse IP) pour la sécurité du service.</li></ul>
<h2>Vos droits</h2><p>Vous pouvez demander l'accès, la correction ou l'effacement des données que vous nous avez transmises, en écrivant à <a href="mailto:{S['email']}">{S['email']}</a>. Vous pouvez aussi introduire une réclamation auprès de l'Autorité de protection des données (Belgique).</p>
<p class="muted small">Mis à jour le {date.today().strftime('%d/%m/%Y')}.</p>
</div></section>'''
    page(p, 'Confidentialité et cookies', "Politique de confidentialité du site du Rempart : aucun cookie, aucune mesure d'audience, aucune donnée enregistrée.", body)

def build_404():
    p = Page('404.html')
    p.depth = 0
    body = f'<section class="pagehead"><div class="wrap"><span class="eyebrow">Page introuvable</span><h1 class="display">Cette porte ne mène nulle part.</h1><p class="lead">La page demandée n\'existe pas ou a changé d\'adresse.</p><a class="link" href="{S["url_base"]}/">Revenir à l\'accueil</a></div></section>'
    page(p, 'Page introuvable', 'Page introuvable.', body)

# =====================================================================
def main():
    # Les photos optimisées vivent dans site/assets/img : on les garde.
    imgs = os.path.join(HERE, '..', 'site', 'assets', 'img')
    keep = os.path.join(HERE, '..', '.img-keep')
    if os.path.exists(imgs): shutil.copytree(imgs, keep, dirs_exist_ok=True)
    if os.path.exists(OUT): shutil.rmtree(OUT)
    os.makedirs(OUT)
    shutil.copytree(os.path.join(HERE, 'assets'), os.path.join(OUT, 'assets'))
    if os.path.exists(keep):
        shutil.copytree(keep, os.path.join(OUT, 'assets', 'img'), dirs_exist_ok=True)
        shutil.rmtree(keep)
    build_home(); build_demeure(); build_gites()
    for g in G: build_gite(g)
    build_experiences(); build_region(); build_reserver(); build_contact(); build_legal(); build_404()
    base = S['url_base'].rstrip('/')
    urls = ''.join(f'<url><loc>{base}/{u}</loc><lastmod>{TODAY}</lastmod></url>' for u in PAGES if not u.endswith('.html'))
    open(os.path.join(OUT, 'sitemap.xml'), 'w').write(f'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{urls}</urlset>')
    open(os.path.join(OUT, 'robots.txt'), 'w').write(('User-agent: *\nAllow: /\n' if S['indexable'] else 'User-agent: *\nDisallow: /\n') + f'Sitemap: {base}/sitemap.xml\n')
    print('OK', len(PAGES), 'pages ->', os.path.abspath(OUT))

if __name__ == '__main__':
    main()
