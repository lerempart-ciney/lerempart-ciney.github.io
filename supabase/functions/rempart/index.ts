// Le Rempart · Edge Function unique pour le site voyageurs.
// Les visiteurs n'ont aucun accès direct à la base : tout passe par ici.
// Routes (paramètre ?a=) : meteo, purge,
//   hôte (code HOTE_PIN) : hote_test, sejour, sejours, sejour_maj, wifi_regler,
//   voyageur (jeton s) : etat, langue, arrivee, liste, album, album_titre, album_legende, album_suppr,
//                        boutique (déco à vendre du gîte du séjour), casse (signalement → inventaire).
// Le Wi-Fi, les codes d'accès (portail, porte, sauna) et l'album ne sont donnés qu'après l'annonce de l'arrivée.
// Le gîte vient toujours du séjour (jeton), jamais de l'adresse : un voyageur du gîte 1 ne voit que le gîte 1.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
  auth: { persistSession: false },
});
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, x-purge-key",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...CORS, "Content-Type": "application/json" } });
const erreur = (m: string, s = 400) => json({ erreur: m }, s);

// Coordonnées de Ciney (centre), arrondies : la météo est celle de la commune.
const LAT = 50.29, LON = 5.1;
const UA = "le-rempart-guide/1.0 https://lerempart-ciney.github.io/";
const MAX_ARTICLES = 200, MAX_PHOTOS = 300, MAX_CASSES = 20;

// Numéro du gîte (site voyageurs) → identifiant du gîte dans l'appli inventaire (table inv_docs).
const INV_GITE: Record<string, string> = { "1": "y1kloy31rjo0cj19bot4", "2": "2d0pe52c9nwnui86t7d6", "3": "fcmv7epgr5buisewizq5" };
const INV_BUCKET = "inventaire";

const aujourdhui = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Brussels" }).format(new Date()); // AAAA-MM-JJ
const plusJours = (d: string, n: number) => {
  const x = new Date(d + "T12:00:00Z"); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10);
};

// Un séjour est utilisable dès sa création (le lien part à la réservation) jusqu'au lendemain du départ.
async function sejourActif(token: string | null) {
  if (!token || !/^[A-Za-z0-9_-]{16,64}$/.test(token)) return null;
  const { data } = await db.from("v_sejours").select("*").eq("token", token).maybeSingle();
  if (!data) return null;
  if (aujourdhui() > plusJours(data.depart, 1)) return null;
  return data;
}

const LANGUES: Record<string, string> = { fr: "français", en: "anglais", nl: "néerlandais", de: "allemand", es: "espagnol" };
const court = (v: unknown, n: number) => { const t = String(v ?? "").trim().slice(0, n); return t || null; };

async function config(cle: string) {
  const { data } = await db.from("v_config").select("valeur").eq("cle", cle).maybeSingle();
  return data?.valeur ?? null;
}

function pinOk(b: any) {
  const pin = Deno.env.get("HOTE_PIN");
  return !!pin && String(b?.pin ?? "") === pin;
}

// Le voyageur peut annoncer son arrivée seulement à partir de 13 h (heure belge) le jour prévu de l'arrivée.
const HEURE_OUVERTURE = 13;
const heureBxl = () =>
  Number(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Brussels", hour: "2-digit", hourCycle: "h23" }).format(new Date()));
const peutAnnoncer = (s: any) => aujourdhui() > s.arrivee || (aujourdhui() === s.arrivee && heureBxl() >= HEURE_OUVERTURE);

function nouveauToken() {
  const b = new Uint8Array(18); crypto.getRandomValues(b);
  return btoa(String.fromCharCode(...b)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
// Identifiants au format de l'appli inventaire : documents (20 caractères a-z0-9) et photos (32 hex).
const idDoc = () => { const a = new Uint8Array(20); crypto.getRandomValues(a); return [...a].map((x) => "abcdefghijklmnopqrstuvwxyz0123456789"[x % 36]).join(""); };
const idPhoto = () => { const a = new Uint8Array(16); crypto.getRandomValues(a); return [...a].map((x) => x.toString(16).padStart(2, "0")).join(""); };

async function meteo() {
  const { data: cache } = await db.from("v_meteo").select("*").eq("id", 1).maybeSingle();
  if (cache && Date.now() - new Date(cache.maj).getTime() < 60 * 60 * 1000) return cache.donnees;
  const r = await fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${LAT}&lon=${LON}`, {
    headers: { "User-Agent": UA },
  });
  if (!r.ok) return cache?.donnees ?? null;
  const j = await r.json();
  const ts = j.properties.timeseries as any[];
  const now = ts[0];
  const prochaines = ts.filter((x) => new Date(x.time).getTime() < Date.now() + 24 * 3600 * 1000);
  const temps = prochaines.map((x) => x.data.instant.details.air_temperature);
  const pluie = ts.slice(0, 12).reduce((s, x) => s + (x.data.next_1_hours?.details?.precipitation_amount ?? 0), 0);
  const donnees = {
    temp: Math.round(now.data.instant.details.air_temperature),
    symbole: now.data.next_1_hours?.summary?.symbol_code ?? now.data.next_6_hours?.summary?.symbol_code ?? "cloudy",
    min: Math.round(Math.min(...temps)),
    max: Math.round(Math.max(...temps)),
    pluie_mm_12h: Math.round(pluie * 10) / 10,
    maj: new Date().toISOString(),
    source: "MET Norway (CC BY 4.0)",
  };
  await db.from("v_meteo").upsert({ id: 1, donnees, maj: new Date().toISOString() });
  return donnees;
}

async function purge() {
  const limite = plusJours(aujourdhui(), -2); // départ avant-hier ou plus tôt
  const { data: finis } = await db.from("v_sejours").select("token").lt("depart", limite);
  let photos = 0;
  for (const s of finis ?? []) {
    const { data: ph } = await db.from("v_photos").select("chemin").eq("sejour", s.token);
    const chemins = (ph ?? []).map((p) => p.chemin).filter((c) => !c.startsWith("https://"));
    if (chemins.length) { await db.storage.from("album").remove(chemins); photos += chemins.length; }
    await db.from("v_sejours").delete().eq("token", s.token); // supprime aussi la liste et les photos (cascade)
  }
  return { sejours: finis?.length ?? 0, photos };
}

// Pièces et déco à vendre du gîte, lues dans l'inventaire. Photos : liens signés valables 2 h.
async function inventaireGite(num: string) {
  const gid = INV_GITE[num];
  const [{ data: pcs }, { data: objs }] = await Promise.all([
    db.from("inv_docs").select("id, data").eq("col", "pieces").eq("data->>gite_id", gid),
    db.from("inv_docs").select("id, data").eq("col", "objets").eq("data->>gite_id", gid).eq("data->>statut", "a_vendre"),
  ]);
  const pieces = (pcs ?? []).map((p) => ({ id: p.id, nom: String(p.data.nom ?? ""), ordre: +p.data.ordre || 99 }))
    .sort((a, b) => a.ordre - b.ordre || a.nom.localeCompare(b.nom));
  const ordre = new Map(pieces.map((p, i) => [p.id, i]));
  const vente = (objs ?? []).filter((o) => (+o.data.quantite || 0) > 0)
    .sort((a, b) => (ordre.get(a.data.piece_id) ?? 99) - (ordre.get(b.data.piece_id) ?? 99) || String(a.data.nom).localeCompare(String(b.data.nom)));
  const ids = [...new Set(vente.map((o) => o.data.photo_objet || o.data.photo_lieu).filter(Boolean))] as string[];
  const signes = ids.length ? (await db.storage.from(INV_BUCKET).createSignedUrls(ids, 7200)).data ?? [] : [];
  const url = new Map(signes.map((s: any) => [s.path, s.signedUrl]));
  const objets = vente.map((o) => ({
    id: o.id, nom: String(o.data.nom ?? ""), prix: typeof o.data.prix === "number" ? o.data.prix : null,
    ref: o.data.ref ?? null, quantite: +o.data.quantite || 1, piece_id: o.data.piece_id ?? null,
    description: o.data.description ?? null, localisation: o.data.localisation ?? null,
    photo: url.get(o.data.photo_objet || o.data.photo_lieu) ?? null,
  }));
  return { pieces: pieces.map(({ id, nom }) => ({ id, nom })), objets };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  const url = new URL(req.url), a = url.searchParams.get("a") ?? "";
  try {
    if (a === "meteo") return json(await meteo());

    if (a === "purge") {
      const { data } = await db.from("v_config").select("valeur").eq("cle", "purge_key").single();
      if (req.headers.get("x-purge-key") !== data?.valeur) return erreur("Non autorisé", 401);
      return json(await purge());
    }

    // ---------- Routes de l'hôte (code HOTE_PIN) ----------
    if (["hote_test", "sejour", "sejours", "sejour_maj", "wifi_regler"].includes(a ?? "") && req.method === "POST") {
      if (!Deno.env.get("HOTE_PIN")) return erreur("Le code hôte n'est pas encore réglé dans Supabase.", 503);
      const b = await req.json();
      if (!pinOk(b)) return erreur("Code hôte incorrect.", 401);

      if (a === "hote_test") return json({ ok: true, wifi: { reseau: await config("wifi_reseau"), motDePasse: await config("wifi_mdp") } });

      if (a === "sejour") {
        if (b.langue && !LANGUES[b.langue]) return erreur("Langue inconnue.");
        if (!/^\d{4}-\d{2}-\d{2}$/.test(b.arrivee) || !/^\d{4}-\d{2}-\d{2}$/.test(b.depart) || b.depart < b.arrivee)
          return erreur("Dates invalides.");
        if (!["1", "2", "3"].includes(String(b.gite))) return erreur("Gîte inconnu (1, 2 ou 3).");
        const token = nouveauToken();
        const { error } = await db.from("v_sejours").insert({
          token, gite_id: String(b.gite), langue: b.langue || null, arrivee: b.arrivee, depart: b.depart,
          nom: court(b.nom, 60), code_portail: court(b.code_portail, 40), code_porte: court(b.code_porte, 40),
          // Le sauna existe seulement dans le gîte 1.
          code_sauna: String(b.gite) === "1" ? court(b.code_sauna, 40) : null,
          heure_arrivee: /^\d{2}:\d{2}$/.test(b.heure ?? "") ? b.heure : null,
        });
        if (error) return erreur(error.message, 500);
        return json({ token });
      }

      if (a === "sejours") {
        const { data } = await db.from("v_sejours")
          .select("token, gite_id, nom, langue, langue_le, arrivee, depart, heure_arrivee, arrivee_annoncee, acces_retire, code_portail, code_porte, code_sauna")
          .gte("depart", plusJours(aujourdhui(), -1)).eq("demo", false).order("arrivee");
        return json({ sejours: data ?? [] });
      }

      if (a === "sejour_maj") {
        const maj: Record<string, unknown> = {};
        for (const k of ["nom", "code_portail", "code_porte", "code_sauna"]) if (k in b) maj[k] = court(b[k], k === "nom" ? 60 : 40);
        if ("code_sauna" in maj) {
          // Le sauna existe seulement dans le gîte 1 : jamais de code sauna enregistré pour les gîtes 2 et 3.
          const { data: x } = await db.from("v_sejours").select("gite_id").eq("token", String(b.token ?? "")).maybeSingle();
          if (x?.gite_id !== "1") maj.code_sauna = null;
        }
        if ("heure" in b) maj.heure_arrivee = /^\d{2}:\d{2}$/.test(b.heure ?? "") ? b.heure : null;
        if ("langue" in b) { maj.langue = LANGUES[b.langue] ? b.langue : null; maj.langue_le = maj.langue ? new Date().toISOString() : null; }
        // Frédéric ouvre (true) ou referme (false) l'accès au Wi-Fi, aux codes et à l'album, à tout moment.
        if (b.debloquer === true) { maj.arrivee_annoncee = new Date().toISOString(); maj.acces_retire = false; }
        if (b.debloquer === false) { maj.arrivee_annoncee = null; maj.acces_retire = true; }
        const { error } = await db.from("v_sejours").update(maj).eq("token", String(b.token ?? ""));
        if (error) return erreur(error.message, 500);
        return json({ ok: true });
      }

      if (a === "wifi_regler") {
        await db.from("v_config").upsert([
          { cle: "wifi_reseau", valeur: String(b.reseau ?? "").trim().slice(0, 64) },
          { cle: "wifi_mdp", valeur: String(b.motDePasse ?? "").trim().slice(0, 64) },
        ]);
        return json({ ok: true });
      }
    }

    // Tout le reste demande un séjour actif.
    const s = url.searchParams.get("s"); // pour l'envoi de photo (multipart), le jeton passe dans l'URL
    let corps: any = null;
    if (req.method === "POST" && req.headers.get("content-type")?.includes("application/json")) corps = await req.json();
    const sejour = await sejourActif(s ?? corps?.s ?? null);
    if (!sejour) return erreur("Séjour terminé ou lien invalide.", 403);

    const debloque = !!sejour.arrivee_annoncee;

    if (a === "etat") {
      const r: Record<string, unknown> = {
        gite: sejour.gite_id, arrivee: sejour.arrivee, depart: sejour.depart, langue: sejour.langue,
        heure: sejour.heure_arrivee, debloque, peutAnnoncer: peutAnnoncer(sejour), retire: !!sejour.acces_retire,
      };
      if (debloque) {
        // Séjour de démonstration (présentation) : jamais le vrai Wi-Fi.
        r.wifi = sejour.demo ? { reseau: "Exemple-WiFi", motDePasse: "exemple" }
          : { reseau: await config("wifi_reseau"), motDePasse: await config("wifi_mdp") };
        r.codes = { portail: sejour.code_portail, porte: sejour.code_porte, sauna: sejour.gite_id === "1" ? sejour.code_sauna : null };
      }
      return json(r);
    }

    if (a === "langue" && req.method === "POST") {
      if (!LANGUES[corps?.langue]) return erreur("Langue inconnue.");
      // Seul le premier choix du groupe est enregistré ; Frédéric peut le corriger dans sa page.
      if (!sejour.langue_le) {
        await db.from("v_sejours").update({ langue: corps.langue, langue_le: new Date().toISOString() }).eq("token", sejour.token);
      }
      return json({ ok: true });
    }

    if (a === "arrivee" && req.method === "POST") {
      if (!peutAnnoncer(sejour)) return erreur("Trop tôt : l'arrivée s'annonce à partir de 13 h le jour prévu de l'arrivée.", 409);
      const heure = /^\d{2}:\d{2}$/.test(corps?.heure ?? "") ? corps.heure : null;
      // Si Frédéric a retiré les codes, le bouton note l'heure mais ne les rouvre pas.
      await db.from("v_sejours").update({
        arrivee_annoncee: sejour.acces_retire ? null : (sejour.arrivee_annoncee ?? new Date().toISOString()),
        heure_arrivee: heure ?? sejour.heure_arrivee,
      }).eq("token", sejour.token);
      return json({ ok: true });
    }

    if (a === "liste") {
      if (req.method === "POST") {
        const op = corps?.op;
        if (op === "ajout") {
          const nom = String(corps.nom ?? "").trim().slice(0, 80);
          if (!nom) return erreur("Article vide.");
          const { count } = await db.from("v_liste").select("id", { count: "exact", head: true }).eq("sejour", sejour.token);
          if ((count ?? 0) >= MAX_ARTICLES) return erreur("Liste pleine.");
          await db.from("v_liste").insert({ sejour: sejour.token, nom });
        } else if (op === "coche") {
          await db.from("v_liste").update({ fait: !!corps.fait }).eq("sejour", sejour.token).eq("id", corps.id);
        } else if (op === "vider") {
          await db.from("v_liste").delete().eq("sejour", sejour.token).eq("fait", true);
        } else return erreur("Action inconnue.");
      }
      const { data } = await db.from("v_liste").select("id, nom, fait").eq("sejour", sejour.token).order("id");
      return json({ articles: data ?? [] });
    }

    // ---------- Boutique déco du gîte du séjour (seulement ce gîte) ----------
    if (a === "boutique") {
      return json({ gite: sejour.gite_id, ...(await inventaireGite(sejour.gite_id)) });
    }

    // ---------- Signalement de casse : arrive dans l'inventaire (anomalie « client », à confirmer) ----------
    if (a === "casse" && req.method === "POST") {
      if (aujourdhui() < sejour.arrivee) return erreur("Le signalement s'ouvre le jour de votre arrivée.", 409);
      const f = await req.formData();
      const txt = (k: string, n: number) => String(f.get(k) ?? "").trim().slice(0, n);
      const gid = INV_GITE[sejour.gite_id];
      const ref = sejour.token.slice(0, 10);
      const { count } = await db.from("inv_docs").select("id", { count: "exact", head: true })
        .eq("col", "anomalies").eq("data->>sejour_ref", ref);
      if ((count ?? 0) >= MAX_CASSES) return erreur("Trop de signalements pour ce séjour : écrivez à Frédéric sur WhatsApp.", 429);
      // La pièce et l'objet doivent appartenir au gîte du séjour.
      const pieceId = txt("piece", 40), objetId = txt("objet", 40);
      let piece: any = null, objet: any = null;
      if (pieceId) {
        const { data } = await db.from("inv_docs").select("id, data").eq("col", "pieces").eq("id", pieceId).maybeSingle();
        if (data?.data?.gite_id === gid) piece = data;
      }
      if (objetId) {
        const { data } = await db.from("inv_docs").select("id, data").eq("col", "objets").eq("id", objetId).maybeSingle();
        if (data?.data?.gite_id === gid) objet = data;
      }
      const quoi = txt("quoi", 80), com = txt("commentaire", 500);
      const moment = f.get("moment") === "arrivee" ? "arrivee" : "sejour";
      if (!objet && !quoi) return erreur("Dites-nous ce qui est cassé.");
      // Séjour de démonstration : rien n'est écrit dans l'inventaire.
      if (sejour.demo) return json({ ok: true, demo: true });
      let photo: string | null = null;
      const fichier = f.get("photo");
      if (fichier instanceof File && fichier.size) {
        if (!/^image\//.test(fichier.type)) return erreur("Ce fichier n'est pas une image.");
        if (fichier.size > 8 * 1024 * 1024) return erreur("Photo trop lourde (8 Mo max).");
        const pid = idPhoto();
        const up = await db.storage.from(INV_BUCKET).upload(pid, fichier, { contentType: fichier.type, upsert: false });
        if (up.error) return erreur(up.error.message, 500);
        photo = pid;
      }
      const qte = Math.min(99, Math.max(1, Math.round(+String(f.get("quantite") ?? "1")) || 1));
      const quand = moment === "arrivee" ? "Déjà cassé à l'arrivée" : "Cassé pendant le séjour";
      const qui = [sejour.nom, `${sejour.arrivee} → ${sejour.depart}`].filter(Boolean).join(", ");
      const maintenant = new Date().toISOString();
      const data = {
        gite_id: gid, piece_id: piece?.id ?? objet?.data?.piece_id ?? null, emplacement_id: objet?.data?.emplacement_id ?? null,
        objet_id: objet?.id ?? null, objet_nom: objet ? String(objet.data.nom) : quoi,
        type: "Cassé", quantite: qte, quantite_attendue: objet ? (+objet.data.quantite || null) : null,
        commentaire: [`Signalé par le voyageur dans l'appli (${qui}). ${quand}.`, objet && quoi ? quoi : "", com].filter(Boolean).join(" "),
        photo, statut: "ouverte", source: "client", canal: "appli_voyageur", moment, sejour_ref: ref,
        a_confirmer: true, controle_id: null, cree_le: maintenant, par: "voyageur",
      };
      const { error } = await db.from("inv_docs").insert({ col: "anomalies", id: idDoc(), data, maj_le: maintenant, maj_par: "voyageur" });
      if (error) return erreur(error.message, 500);
      return json({ ok: true });
    }

    // L'album s'ouvre seulement après l'annonce de l'arrivée.
    if (a.startsWith("album") && !debloque) return erreur("L'album s'ouvre quand vous prévenez Frédéric de votre arrivée.", 423);

    if (a === "album") {
      if (req.method === "POST") {
        const f = await req.formData();
        const fichier = f.get("photo");
        if (!(fichier instanceof File)) return erreur("Aucune photo.");
        if (!/^image\//.test(fichier.type)) return erreur("Ce fichier n'est pas une image.");
        if (fichier.size > 8 * 1024 * 1024) return erreur("Photo trop lourde (8 Mo max).");
        const { count } = await db.from("v_photos").select("id", { count: "exact", head: true }).eq("sejour", sejour.token);
        if ((count ?? 0) >= MAX_PHOTOS) return erreur("Album plein.");
        const ext = (fichier.type.split("/")[1] || "jpg").replace("jpeg", "jpg");
        const chemin = `${sejour.token}/${crypto.randomUUID()}.${ext}`;
        const up = await db.storage.from("album").upload(chemin, fichier, { contentType: fichier.type });
        if (up.error) return erreur(up.error.message, 500);
        await db.from("v_photos").insert({ sejour: sejour.token, chemin });
      }
      const { data: ph } = await db.from("v_photos").select("id, chemin, cree_le, legende").eq("sejour", sejour.token).order("cree_le");
      // Une photo de démonstration peut pointer vers une image publique du site (https://…).
      const web = (c: string) => c.startsWith("https://");
      const chemins = (ph ?? []).map((p) => p.chemin).filter((c) => !web(c));
      const signes = chemins.length ? (await db.storage.from("album").createSignedUrls(chemins, 7200)).data ?? [] : [];
      const lien = (c: string) => web(c) ? c : signes[chemins.indexOf(c)]?.signedUrl;
      return json({
        photos: (ph ?? []).map((p) => ({ id: p.id, url: lien(p.chemin), date: p.cree_le, legende: p.legende ?? "" })),
        depart: sejour.depart,
        titre: sejour.album_titre ?? "",
      });
    }

    // Titre de l'album, choisi par le groupe (couverture de l'album souvenir).
    if (a === "album_titre" && req.method === "POST") {
      const titre = String(corps?.titre ?? "").trim().slice(0, 80) || null;
      await db.from("v_sejours").update({ album_titre: titre }).eq("token", sejour.token);
      return json({ ok: true });
    }

    if (a === "album_legende" && req.method === "POST") {
      const legende = String(corps?.legende ?? "").trim().slice(0, 140) || null;
      await db.from("v_photos").update({ legende }).eq("sejour", sejour.token).eq("id", corps?.id);
      return json({ ok: true });
    }

    if (a === "album_suppr" && req.method === "POST") {
      const { data: p } = await db.from("v_photos").select("chemin").eq("sejour", sejour.token).eq("id", corps?.id).maybeSingle();
      if (p) { if (!p.chemin.startsWith("https://")) await db.storage.from("album").remove([p.chemin]); await db.from("v_photos").delete().eq("id", corps.id); }
      return json({ ok: true });
    }

    return erreur("Route inconnue.", 404);
  } catch (e) {
    return erreur(String(e), 500);
  }
});
