(() => {
'use strict';

/* ================= KONFIGURASI (ubah di sini) ================= */
const CONFIG = {
  // WAJIB DIGANTI sebelum publikasi. Format internasional tanpa +, spasi, atau strip. Contoh bentuk: 628XXXXXXXXXX
  whatsappNumber: '08978359659',
  defaultMessage: 'Halo Sky Pixel, saya ingin konsultasi gratis mengenai pembuatan website untuk UMKM saya.',
  // Kosongkan jika belum ada; akan disembunyikan otomatis.
  contact: { email: '', hours: '' },
  // Harga contoh demonstrasi (Rupiah)
  siteTypes: {
    landing: { label: 'Landing Page', price: 1500000 },
    store: { label: 'Toko Online', price: 3500000 },
    company: { label: 'Company Profile', price: 2500000 }
  },
  addons: {
    wa: { label: 'Integrasi WhatsApp Chat', price: 0 },
    pay: { label: 'Payment Gateway', price: 750000 },
    lang: { label: 'Multi-Bahasa', price: 500000 },
    seo: { label: 'SEO Optimization', price: 600000 },
    catalog: { label: 'Katalog Produk', price: 500000 }
  },
  packages: [
    { id: 'starter', name: 'Starter UMKM', price: 1500000, features: ['Landing page profesional', 'Desain responsif', 'Informasi bisnis dan layanan', 'Tombol WhatsApp', 'Formulir kontak sederhana', 'SEO dasar', 'SSL sesuai konfigurasi hosting', 'Domain dan hosting sesuai masa aktif paket'] },
    { id: 'pro', name: 'UMKM Pro', price: 2900000, hot: true, features: ['Website multi-section', 'Desain premium', 'Galeri atau katalog produk', 'Integrasi WhatsApp', 'Optimasi SEO dasar', 'Formulir kontak', 'Panduan pengelolaan website', 'Dukungan revisi sesuai ketentuan paket'] },
    { id: 'custom', name: 'Enterprise / Custom', price: null, features: ['Struktur website sesuai kebutuhan bisnis', 'Fitur khusus sesuai ruang lingkup', 'Integrasi layanan pihak ketiga jika memungkinkan', 'Konsultasi kebutuhan teknis', 'Penawaran harga berdasarkan spesifikasi'] }
  ],
  // demo: isi URL demo asli jika ada. Jika null, tombol membuka modal preview konsep.
  portfolio: [
    { title: 'Kedai Kopi Senja', category: 'Kuliner', icon: 'fa-mug-hot', theme: 1, demo: null, desc: 'Menu, jam buka, lokasi, dan pesan via WhatsApp.', sections: ['Hero', 'Menu', 'Lokasi', 'Kontak'] },
    { title: 'Butik Lokal Nusa', category: 'Fashion', icon: 'fa-shirt', theme: 2, demo: null, desc: 'Lookbook koleksi dengan katalog dan tombol pesan.', sections: ['Hero', 'Koleksi', 'Ukuran', 'Kontak'] },
    { title: 'Konsultan Pajak Mandiri', category: 'Jasa', icon: 'fa-briefcase', theme: 3, demo: null, desc: 'Profil layanan profesional dengan formulir konsultasi.', sections: ['Hero', 'Layanan', 'Proses', 'Konsultasi'] },
    { title: 'Warung Oleh-Oleh Daerah', category: 'Toko Online', icon: 'fa-basket-shopping', theme: 4, demo: null, desc: 'Toko produk lokal dengan keranjang dan pesanan WhatsApp.', sections: ['Hero', 'Produk', 'Cara Pesan', 'Kontak'] },
    { title: 'Katalog Kue Rumahan', category: 'Kuliner', icon: 'fa-cake-candles', theme: 5, demo: null, desc: 'Katalog makanan lengkap dengan daftar harga.', sections: ['Hero', 'Katalog', 'Harga', 'Pesan'] },
    { title: 'Brand Kriya Bumi', category: 'Toko Online', icon: 'fa-leaf', theme: 6, demo: null, desc: 'Website brand UMKM dengan cerita produk dan galeri.', sections: ['Hero', 'Cerita', 'Galeri', 'Pesan'] }
  ],
  // CONTOH — ganti dengan ulasan pelanggan asli
  testimonials: [
    { name: 'Nama Pemilik Bisnis', biz: 'Nama Bisnis', cat: 'Kuliner', quote: 'Tempat untuk kutipan ulasan pelanggan asli.' },
    { name: 'Nama Pemilik Bisnis', biz: 'Nama Bisnis', cat: 'Fashion', quote: 'Tempat untuk kutipan ulasan pelanggan asli.' },
    { name: 'Nama Pemilik Bisnis', biz: 'Nama Bisnis', cat: 'Jasa', quote: 'Tempat untuk kutipan ulasan pelanggan asli.' }
  ],
  // Sesuaikan dengan kebijakan bisnis Anda
  policyNote: 'Biaya domain, hosting, perpanjangan, lisensi, payment gateway, revisi, dan pemeliharaan mengikuti kebijakan Sky Pixel dan dikonfirmasi sebelum proyek dimulai.'
};

/* ================= Helper ================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
const money = n => rupiah.format(Number.isFinite(n) && n > 0 ? n : 0);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const h = (tag, props = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) k === 'class' ? (e.className = v) : k === 'text' ? (e.textContent = v) : e.setAttribute(k, v);
  e.append(...kids);
  return e;
};

let toastTimer;
function toast(msg) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 5000);
}

/* ================= WhatsApp (satu helper untuk semua CTA) ================= */
function waUrl(message) {
  if (!/^\d{8,15}$/.test(CONFIG.whatsappNumber)) return null;
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
function openWa(message) {
  const url = waUrl(message);
  if (!url) return toast('Nomor WhatsApp belum diatur. Isi CONFIG.whatsappNumber di script.js (contoh format: 628XXXXXXXXXX).');
  window.open(url, '_blank', 'noopener');
}
document.addEventListener('click', e => {
  const t = e.target.closest('[data-wa]');
  if (!t) return;
  e.preventDefault();
  openWa(CONFIG.defaultMessage);
});

/* ================= Navbar ================= */
const nav = $('#navbar'), burger = $('#burger'), menu = $('#menu');
const onScroll = () => nav && nav.classList.toggle('scrolled', scrollY > 10);
addEventListener('scroll', () => requestAnimationFrame(onScroll), { passive: true });
onScroll();
function setMenu(open) {
  if (!menu || !burger) return;
  menu.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
  document.body.classList.toggle('lock', open && innerWidth < 960);
}
burger && burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
menu && menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && menu && menu.classList.contains('open')) { setMenu(false); burger.focus(); }
});
addEventListener('resize', () => { if (innerWidth >= 960) setMenu(false); });

if ('IntersectionObserver' in window) {
  const links = $$('#menu a[href^="#"]:not(.btn)');
  const spy = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  links.forEach(a => { const s = $(a.getAttribute('href')); s && spy.observe(s); });
}

/* ================= Kalkulator ================= */
function option(type, name, val, label, price, checked) {
  const input = h('input', { type, name, value: val });
  input.checked = checked;
  return h('label', { class: 'opt' }, input, h('span', { class: 'opt-body' }, h('b', { text: label }), h('small', { text: price > 0 ? money(price) : 'Gratis' })));
}
const typeBox = $('#typeOpts'), addBox = $('#addonOpts');
if (typeBox && addBox) {
  Object.entries(CONFIG.siteTypes).forEach(([k, v], i) => typeBox.append(option('radio', 'type', k, v.label, v.price, i === 0)));
  Object.entries(CONFIG.addons).forEach(([k, v]) => addBox.append(option('checkbox', 'addon', k, v.label, v.price, false)));
}
function calcState() {
  const checked = $('input[name=type]:checked');
  const type = checked ? CONFIG.siteTypes[checked.value] : null;
  const adds = $$('input[name=addon]:checked').map(i => CONFIG.addons[i.value]).filter(Boolean);
  const base = Math.max(0, (type && type.price) || 0);
  const extra = adds.reduce((s, a) => s + Math.max(0, a.price || 0), 0);
  return { type, adds, base, extra, total: base + extra };
}
function renderSummary() {
  const list = $('#sumList'), totalEl = $('#total');
  if (!list || !totalEl) return;
  const s = calcState();
  const row = (k, v) => h('div', { class: 'row' }, h('dt', { text: k }), h('dd', { text: v }));
  list.replaceChildren(
    row(s.type ? s.type.label : 'Tipe website', money(s.base)),
    ...s.adds.map(a => row(a.label, a.price > 0 ? money(a.price) : 'Gratis')),
    row('Total fitur tambahan', money(s.extra))
  );
  totalEl.textContent = money(s.total);
}
$('.calc') && $('.calc').addEventListener('change', renderSummary);
renderSummary();
const calcBtn = $('#calcWa');
calcBtn && calcBtn.addEventListener('click', () => {
  const s = calcState();
  if (!s.type) return toast('Pilih tipe website terlebih dahulu.');
  const feats = s.adds.length ? s.adds.map(a => `- ${a.label} (${a.price > 0 ? money(a.price) : 'Gratis'})`).join('\n') : '- Tidak ada fitur tambahan';
  openWa(`Halo Sky Pixel, saya ingin memesan website sesuai estimasi berikut.\n\nJenis website: ${s.type.label}\nFitur tambahan:\n${feats}\n\nRincian:\n- Harga dasar: ${money(s.base)}\n- Biaya fitur: ${money(s.extra)}\nTotal estimasi: ${money(s.total)}\n\nBagaimana langkah selanjutnya?`);
});

/* ================= Paket harga ================= */
const pricing = $('#pricing');
if (pricing) {
  CONFIG.packages.forEach(p => {
    const priceText = p.price ? money(p.price) : 'Mulai dari konsultasi';
    const btn = h('button', { class: 'btn ' + (p.hot ? 'btn-primary' : 'btn-ghost') + ' btn-block', type: 'button', text: 'Pilih Paket' });
    btn.addEventListener('click', () => openWa(p.price
      ? `Halo Sky Pixel, saya ingin memesan ${p.name} seharga ${priceText} untuk bisnis saya. Bagaimana proses pemesanannya?`
      : `Halo Sky Pixel, saya ingin berkonsultasi mengenai harga paket ${p.name} untuk bisnis saya. Bagaimana proses pemesanannya?`));
    const card = h('article', { class: 'card price-card reveal' + (p.hot ? ' hot' : '') },
      ...(p.hot ? [h('span', { class: 'badge', text: 'Paling Laris' })] : []),
      h('h3', { text: p.name }), h('div', { class: 'price', text: priceText }),
      h('ul', {}, ...p.features.map(f => h('li', {}, h('i', { class: 'fa-solid fa-check', 'aria-hidden': 'true' }), f))), btn);
    pricing.append(card);
  });
  const t = CONFIG.siteTypes, a = CONFIG.addons;
  const bundle = t.company.price + a.seo.price + a.catalog.price;
  $('#pricingNote').append(
    h('p', { text: `Kalkulator menghitung kebutuhan secara modular, sedangkan paket adalah penawaran bundel dengan fitur dan batasan tertentu. Contoh: Company Profile + SEO + Katalog di kalkulator = ${money(bundle)}, sedangkan ${CONFIG.packages[1].name} ${money(CONFIG.packages[1].price)} memakai SEO dasar dan katalog terbatas sesuai ketentuan paket.` }),
    h('p', { text: CONFIG.policyNote }));
}

/* ================= Portofolio ================= */
const works = $('#works'), filters = $('#filters'), empty = $('#empty'), modal = $('#modal');
function openModal(w) {
  if (w.demo) return window.open(w.demo, '_blank', 'noopener');
  const body = $('#mBody');
  if (!modal || !body) return;
  body.replaceChildren(
    h('h3', { id: 'mTitle', text: w.title }),
    h('p', { class: 'cat', text: `${w.category} · Konsep Demo (bukan klien nyata)` }),
    h('div', { class: 'thumb t' + w.theme }, h('i', { class: 'fa-solid ' + w.icon, 'aria-hidden': 'true' })),
    h('p', { text: w.desc }),
    h('ul', { class: 'chips' }, ...w.sections.map(s => h('li', { text: s }))));
  const go = h('button', { class: 'btn btn-wa', type: 'button', text: 'Buat Website Serupa' });
  go.addEventListener('click', () => openWa(`Halo Sky Pixel, saya tertarik dengan konsep "${w.title}" dan ingin website serupa untuk bisnis saya.`));
  body.append(go);
  typeof modal.showModal === 'function' ? modal.showModal() : modal.setAttribute('open', '');
}
if (works && filters) {
  const cats = ['Semua', ...new Set(CONFIG.portfolio.map(w => w.category))];
  const order = ['Semua', 'Kuliner', 'Fashion', 'Jasa', 'Toko Online'];
  order.forEach(c => {
    const b = h('button', { class: 'fbtn', type: 'button', 'aria-pressed': String(c === 'Semua'), text: c });
    b.addEventListener('click', () => {
      $$('.fbtn', filters).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      let shown = 0;
      $$('.work', works).forEach(card => {
        const ok = c === 'Semua' || card.dataset.category === c;
        card.classList.toggle('is-hidden', !ok);
        if (ok) shown++;
      });
      empty.hidden = shown > 0;
    });
    filters.append(b);
  });
  CONFIG.portfolio.forEach(w => {
    const btn = h('button', { class: 'btn btn-ghost', type: 'button', text: 'Demo Live / Preview' });
    btn.addEventListener('click', () => openModal(w));
    const card = h('article', { class: 'card work' },
      h('div', { class: 'thumb t' + w.theme, role: 'img', 'aria-label': `Ilustrasi konsep website ${w.title}` }, h('i', { class: 'fa-solid ' + w.icon, 'aria-hidden': 'true' }), h('span', { class: 'tag', text: 'Konsep Demo' })),
      h('div', { class: 'work-body' }, h('p', { class: 'cat', text: w.category }), h('h3', { text: w.title }), h('p', { text: w.desc }), btn));
    card.dataset.category = w.category;
    works.append(card);
  });
}
$('#mClose') && $('#mClose').addEventListener('click', () => modal.close());
modal && modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });

/* ================= Testimoni (placeholder) ================= */
const testi = $('#testi');
testi && CONFIG.testimonials.forEach(t => testi.append(h('article', { class: 'card testi reveal' },
  h('span', { class: 'ph', text: 'Contoh Testimoni — Ganti dengan Ulasan Pelanggan Asli' }),
  h('div', { class: 'stars', role: 'img', 'aria-label': 'Contoh penilaian bintang' }, ...Array.from({ length: 5 }, () => h('i', { class: 'fa-solid fa-star', 'aria-hidden': 'true' }))),
  h('p', { text: t.quote }),
  h('div', { class: 'who' }, h('span', { class: 'av', 'aria-hidden': 'true', text: t.name[0] }), h('div', {}, h('b', { text: t.name }), h('small', { text: `${t.biz} · ${t.cat}` }))))));

/* ================= FAQ (single-open) ================= */
$$('.faq-item button').forEach(btn => btn.addEventListener('click', () => {
  const item = btn.closest('.faq-item'), open = !item.classList.contains('open');
  $$('.faq-item.open').forEach(i => { i.classList.remove('open'); $('button', i).setAttribute('aria-expanded', 'false'); });
  item.classList.toggle('open', open);
  btn.setAttribute('aria-expanded', String(open));
}));

/* ================= Kontak, tahun, scroll reveal ================= */
const info = $('#contactInfo');
if (info) {
  if (CONFIG.contact.email) info.append(h('li', {}, h('a', { href: 'mailto:' + CONFIG.contact.email, text: CONFIG.contact.email })));
  if (CONFIG.contact.hours) info.append(h('li', { text: 'Jam konsultasi: ' + CONFIG.contact.hours }));
}
const yr = $('#year'); yr && (yr.textContent = new Date().getFullYear());

if ('IntersectionObserver' in window && !reduce) {
  const io = new IntersectionObserver((es, o) => es.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); o.unobserve(en.target); }
  }), { threshold: 0.12 });
  $$('.reveal').forEach(el => { el.classList.add('pre'); io.observe(el); });
}
})();
