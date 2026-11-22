// Le Rempart · Edge Function unique pour le site voyageurs.
// Les visiteurs n'ont aucun accès direct à la base : tout passe par ici.
// Routes (paramètre ?a=) : sejour, liste, album, album_suppr, meteo, purge.
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

// Un séjour est utilisable de 30 jours avant l'arrivée jusqu'au lendemain du départ.
async function sejourActif(token: string | null) {
  if (!token || !/^[A-Za-z0-9_-]{16,64}$/.test(token)) return null;
  const { data } = await db.from("v_sejours").select("*").eq("token", token).maybeSingle();
  if (!data) return null;
  const t = aujourdhui();
  if (t < plusJours(data.arrivee, -30) || t > plusJours(data.depart, 1)) return null;
  return data;
}

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
  const url = new URL(req.url), a = url.searchParams.get("a");
  try {
    if (a === "meteo") return json(await meteo());

    if (a === "purge") {
      const { data } = await db.from("v_config").select("valeur").eq("cle", "purge_key").single();
      if (req.headers.get("x-purge-key") !== data?.valeur) return erreur("Non autorisé", 401);
      return json(await purge());
    }

    if (a === "sejour" && req.method === "POST") {
      const pin = Deno.env.get("HOTE_PIN");
      if (!pin) return erreur("Le code hôte n'est pas encore réglé dans Supabase.", 503);
      const b = await req.json();
      if (String(b.pin ?? "") !== pin) return erreur("Code hôte incorrect.", 401);
      if (!["fr", "en", "nl", "de", "es"].includes(b.langue)) return erreur("Langue inconnue.");
      if (!/^\d{4}-\d{2}-\d{2}$/.test(b.arrivee) || !/^\d{4}-\d{2}-\d{2}$/.test(b.depart) || b.depart < b.arrivee)
        return erreur("Dates invalides.");
      const token = nouveauToken();
      const { error } = await db.from("v_sejours").insert({ token, langue: b.langue, arrivee: b.arrivee, depart: b.depart });
      if (error) return erreur(error.message, 500);
      return json({ token });
    }

    // Tout le reste demande un séjour actif.
    const s = url.searchParams.get("s"); // pour l'envoi de photo (multipart), le jeton passe dans l'URL
    let corps: any = null;
    if (req.method === "POST" && req.headers.get("content-type")?.includes("application/json")) corps = await req.json();
    const sejour = await sejourActif(s ?? corps?.s ?? null);
    if (!sejour) return erreur("Séjour terminé ou lien invalide.", 403);

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
      const { data: ph } = await db.from("v_photos").select("id, chemin, cree_le").eq("sejour", sejour.token).order("cree_le");
      const chemins = (ph ?? []).map((p) => p.chemin);
      const signes = chemins.length ? (await db.storage.from("album").createSignedUrls(chemins, 7200)).data ?? [] : [];
      return json({
        photos: (ph ?? []).map((p, i) => ({ id: p.id, url: signes[i]?.signedUrl, date: p.cree_le })),
        depart: sejour.depart,
      });
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
