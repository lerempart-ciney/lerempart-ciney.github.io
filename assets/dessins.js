/* Le Rempart · dessins au trait des équipements (remplacent les images tirées des vidéos).
   Trait fin, couleur du texte de la page (currentColor). viewBox 0 0 120 120. */
RP.dessins = {
  sauna: '<path d="M22 96V44l38-22 38 22v52"/><path d="M14 96h92"/><path d="M34 96V62h52v34"/><path d="M34 74h52M34 86h52"/><path d="M48 62v34M72 62v34"/><path d="M50 40c-4-5 4-8 0-13M60 38c-4-5 4-8 0-13M70 40c-4-5 4-8 0-13"/>',
  piscine: '<path d="M18 70c7-5 13-5 20 0s13 5 20 0 13-5 20 0 13 5 20 0"/><path d="M18 84c7-5 13-5 20 0s13 5 20 0 13-5 20 0 13 5 20 0"/><path d="M18 98c7-5 13-5 20 0s13 5 20 0 13-5 20 0 13 5 20 0"/><path d="M76 66V26a8 8 0 0 1 16 0"/><path d="M96 66V26a8 8 0 0 0-16 0"/><path d="M76 38h20M76 52h20"/>',
  feu: '<path d="M18 100h84"/><path d="M28 100V36h64v64"/><path d="M22 36h76"/><path d="M38 100V52h44v48"/><path d="M46 94l28-8M46 86l28 8"/><path d="M60 84c-9-6-6-15 0-22 1 6 6 7 6 13 0 5-3 8-6 9z"/><path d="M54 84c-3-3-3-7 0-10"/>',
  acces: '<path d="M30 102V40a30 30 0 0 1 60 0v62"/><path d="M22 102h76"/><path d="M60 10v20"/><path d="M42 102V48a18 18 0 0 1 36 0v54"/><circle cx="70" cy="76" r="2.5"/><path d="M60 30v72"/>',
  flipper: '<path d="M34 104l6-74h40l6 74"/><path d="M40 30l4-12h32l4 12"/><circle cx="54" cy="48" r="5"/><circle cx="68" cy="56" r="5"/><circle cx="58" cy="66" r="3"/><path d="M48 86l10 6M72 86l-10 6"/><path d="M30 104h60"/>',
  lave: '<rect x="28" y="16" width="64" height="88" rx="3"/><path d="M28 34h64"/><circle cx="60" cy="68" r="22"/><circle cx="60" cy="68" r="15"/><path d="M48 72c6-5 18 3 24-2"/><circle cx="80" cy="25" r="3"/><path d="M36 25h20"/>',
  four: '<rect x="18" y="26" width="84" height="70" rx="2"/><path d="M18 42h84"/><rect x="30" y="52" width="60" height="34" rx="1"/><path d="M38 60h44"/><circle cx="32" cy="34" r="3"/><circle cx="88" cy="34" r="3"/><path d="M52 34h16"/><path d="M50 78c4-3 16-3 20 0"/>',
  micro: '<rect x="16" y="32" width="88" height="56" rx="3"/><rect x="26" y="42" width="54" height="36" rx="2"/><path d="M90 44v6M90 58h0M90 66h0M90 74h0" stroke-linecap="round" stroke-width="3"/><path d="M38 66c6-4 18-4 30 0"/><path d="M24 88v6M96 88v6"/>',
  vapeur: '<rect x="18" y="44" width="84" height="56" rx="2"/><path d="M18 58h84"/><rect x="30" y="66" width="60" height="26" rx="1"/><circle cx="32" cy="51" r="2.5"/><path d="M44 51h32"/><path d="M48 38c-5-6 5-9 0-16M60 36c-5-6 5-9 0-16M72 38c-5-6 5-9 0-16"/>',
  cafe: '<path d="M34 104V22h52v82"/><path d="M28 104h64"/><path d="M34 40h52"/><circle cx="74" cy="31" r="3"/><path d="M46 31h16"/><path d="M52 52h16v8H52z"/><path d="M60 60v8"/><path d="M48 88V74h24v14a6 6 0 0 1-6 6H54a6 6 0 0 1-6-6z"/><path d="M72 78h4a4 4 0 0 1 0 8h-4"/>',
  cuisine23: '<path d="M14 100h92"/><path d="M20 100V60h80v40"/><path d="M20 72h80"/><path d="M60 72v28"/><path d="M38 84h8M74 84h8"/><circle cx="38" cy="52" r="7"/><circle cx="62" cy="52" r="7"/><path d="M26 60V48M86 60V36h10v24"/><path d="M84 30c-3-4 3-6 0-10"/>',
  homecinema: '<rect x="14" y="26" width="92" height="56" rx="2"/><path d="M50 82l-6 14M70 82l6 14M38 96h44"/><path d="M52 44v20l18-10z"/>'
};
RP.dessin = (k, extra) => RP.dessins[k] ? `<svg class="dessin" viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra || ''}>${RP.dessins[k]}</svg>` : '';
