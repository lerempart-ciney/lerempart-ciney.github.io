// Le Rempart · Edge Function unique pour le site voyageurs.
// Les visiteurs n'ont aucun accès direct à la base : tout passe par ici.
// Routes (paramètre ?a=) : meteo, purge,
//   hôte (code HOTE_PIN) : hote_test, sejour, sejours, sejour_maj, wifi_regler,
//   voyageur (jeton s) : etat, langue, arrivee, liste, album, album_legende, album_suppr.
// Le Wi-Fi, les codes d'accès et l'album ne sont donnés qu'après l'annonce de l'arrivée.
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
const UA = "le-rempart-guide/1.0 https://road2steeve.github.io/le-rempart/";
const MAX_ARTICLES = 200, MAX_PHOTOS = 300;

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

// Le voyageur peut annoncer son arrivée seulement à partir du jour prévu de l'arrivée.
const peutAnnoncer = (s: any) => aujourdhui() >= s.arrivee;

function nouveauToken() {
  const b = new Uint8Array(18); crypto.getRandomValues(b);
  return btoa(String.fromCharCode(...b)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

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
    const chemins = (ph ?? []).map((p) => p.chemin);
    if (chemins.length) { await db.storage.from("album").remove(chemins); photos += chemins.length; }
    await db.from("v_sejours").delete().eq("token", s.token); // supprime aussi la liste et les photos (cascade)
  }
  return { sejours: finis?.length ?? 0, photos };
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
          heure_arrivee: /^\d{2}:\d{2}$/.test(b.heure ?? "") ? b.heure : null,
        });
        if (error) return erreur(error.message, 500);
        return json({ token });
      }

      if (a === "sejours") {
        const { data } = await db.from("v_sejours")
          .select("token, gite_id, nom, langue, langue_le, arrivee, depart, heure_arrivee, arrivee_annoncee, acces_retire, code_portail, code_porte")
          .gte("depart", plusJours(aujourdhui(), -1)).order("arrivee");
        return json({ sejours: data ?? [] });
      }

      if (a === "sejour_maj") {
        const maj: Record<string, unknown> = {};
        for (const k of ["nom", "code_portail", "code_porte"]) if (k in b) maj[k] = court(b[k], k === "nom" ? 60 : 40);
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
        r.wifi = { reseau: await config("wifi_reseau"), motDePasse: await config("wifi_mdp") };
        r.codes = { portail: sejour.code_portail, porte: sejour.code_porte };
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
      if (!peutAnnoncer(sejour)) return erreur("Trop tôt : l'arrivée s'annonce le jour prévu de l'arrivée.", 409);
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
      const chemins = (ph ?? []).map((p) => p.chemin);
      const signes = chemins.length ? (await db.storage.from("album").createSignedUrls(chemins, 7200)).data ?? [] : [];
      return json({
        photos: (ph ?? []).map((p, i) => ({ id: p.id, url: signes[i]?.signedUrl, date: p.cree_le, legende: p.legende ?? "" })),
        depart: sejour.depart,
      });
    }

    if (a === "album_legende" && req.method === "POST") {
      const legende = String(corps?.legende ?? "").trim().slice(0, 140) || null;
      await db.from("v_photos").update({ legende }).eq("sejour", sejour.token).eq("id", corps?.id);
      return json({ ok: true });
    }

    if (a === "album_suppr" && req.method === "POST") {
      const { data: p } = await db.from("v_photos").select("chemin").eq("sejour", sejour.token).eq("id", corps?.id).maybeSingle();
      if (p) { await db.storage.from("album").remove([p.chemin]); await db.from("v_photos").delete().eq("id", corps.id); }
      return json({ ok: true });
    }

    return erreur("Route inconnue.", 404);
  } catch (e) {
    return erreur(String(e), 500);
  }
});
