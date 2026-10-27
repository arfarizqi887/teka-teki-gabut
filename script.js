"use strict";
/* MYSTERY MIND: Pecahkan Misterinya — logika permainan */

const KEY = "mysteryMind.v1";
const TOTAL = 20;
const $ = s => document.querySelector(s);
const CAT = {
  logika: ["🧠", "Teka-teki Logika"], gambar: ["🖼️", "Tebak Gambar"], kode: ["🔐", "Kode Rahasia"],
  angka: ["🔢", "Pola Angka"], kata: ["🔤", "Susunan Kata"], detektif: ["🕵️", "Misteri Detektif"],
  jebakan: ["⚠️", "Teka-teki Jebakan"], final: ["👁️", "Teka-teki Final"]
};
const WRONG = [
  "Arsip berbisik: “Bukan itu.”", "Pintu bergetar, tetapi tetap terkunci.", "Bayangan di dinding menggeleng pelan.",
  "Hmm… detektif sehebat apa pun pernah salah.", "Lilin berkedip. Jawabanmu belum tepat.", "Gembok mendengus: “Coba lagi, Sherlock.”"
];
const AMB = [
  "Debu bergetar di rak arsip…", "Lampu minyak berkedip pelan.", "Ada langkah kaki di lorong sebelah.",
  "Dinding terasa mengawasimu.", "Jam tua berhenti berdetak.", "Seseorang pernah lewat sini."
];

/* Jawaban (a) dipisah “|” dan disamarkan (base64) saat build agar tidak terbaca di kode. */
const LV = [
  { c: "logika", ti: "Gigi yang Tak Menggigit", q: "Aku punya banyak gigi, tetapi tidak bisa menggigit. Apakah aku?", a: "c2lzaXI=", t: 0,
    h: ["Kamu memakaiku setiap pagi di depan cermin.", "Aku membantu merapikan rambut."],
    e: "Sisir punya deretan “gigi”, tetapi fungsinya merapikan rambut, bukan menggigit." },
  { c: "angka", ti: "Deret yang Menggandakan Diri", q: "Angka berikutnya adalah…", v: "2 · 4 · 8 · 16 · ?", a: "MzJ8dGlnYSBwdWx1aCBkdWE=", t: 0,
    h: ["Lihat hubungan tiap angka dengan angka sebelumnya.", "Setiap angka dikali dua."],
    e: "Setiap suku dikali 2, jadi setelah 16 datanglah 32." },
  { c: "logika", ti: "Semakin Diambil, Semakin Besar", q: "Semakin banyak kamu mengambil dariku, semakin besar aku. Apakah aku?", a: "bHViYW5n", t: 0,
    h: ["Aku bukan benda, aku justru ketiadaan benda.", "Tukang gali sangat mengenalku."],
    e: "Setiap tanah yang digali membuat lubang makin besar." },
  { c: "logika", ti: "Pengikut Setia", q: "Aku selalu mengikuti kamu, tetapi menghilang dalam kegelapan. Apakah aku?", a: "YmF5YW5nYW58YmF5YW5n", t: 0,
    h: ["Aku ada hanya saat ada cahaya.", "Aku menempel di kakimu saat siang hari."],
    e: "Bayangan terbentuk karena cahaya terhalang tubuhmu; tanpa cahaya, ia lenyap." },
  { c: "gambar", ti: "Hujan Bertemu Terik", q: "Tebak gambar: apa yang muncul di langit ketika dua gambar ini bertemu?", v: "🌧️ + ☀️ = ?", a: "cGVsYW5naQ==", t: 0,
    h: ["Lihat ke langit setelah hujan reda.", "Warnanya ada tujuh."],
    e: "Cahaya matahari yang terurai oleh tetes hujan membentuk pelangi." },
  { c: "kata", ti: "Huruf-Huruf Gelisah", q: "Susun huruf ini menjadi satu kata yang menggambarkan permainan ini.", v: "S T I M R E I", a: "bWlzdGVyaQ==", t: 90,
    h: ["Kata ini ada di judul game.", "Diawali huruf M, diakhiri huruf I."],
    e: "S-T-I-M-R-E-I tersusun menjadi MISTERI." },
  { c: "kode", ti: "Pesan di Dinding", q: "Sebuah pesan terukir di dinding arsip. Setiap huruf digeser satu langkah maju dalam alfabet. Baca pesannya.", v: "SBIBTJB", a: "cmFoYXNpYQ==", t: 0,
    h: ["Mundurkan tiap huruf satu langkah: S menjadi R.", "R-A-H-…"],
    e: "Mundurkan tiap huruf satu langkah: S→R, B→A, I→H, B→A, T→S, J→I, B→A = RAHASIA." },
  { c: "jebakan", ti: "Tiga Pil", q: "Dokter memberimu 3 pil dan menyuruh minum satu pil setiap 30 menit. Berapa lama sampai semua pil habis diminum?", a: "MSBqYW18c2F0dSBqYW18NjAgbWVuaXR8NjB8MQ==", t: 0,
    h: ["Hitung kapan pil pertama diminum.", "Pil pertama diminum di menit ke-0."],
    e: "Pil 1 di menit ke-0, pil 2 di menit ke-30, pil 3 di menit ke-60: tepat 1 jam, bukan 90 menit." },
  { c: "angka", ti: "Spiral Fibonacci", q: "Angka misterius berikutnya?", v: "1 · 1 · 2 · 3 · 5 · 8 · 13 · ?", a: "MjF8ZHVhIHB1bHVoIHNhdHU=", t: 0,
    h: ["Jumlahkan dua angka terakhir.", "8 + 13 = ?"],
    e: "Deret Fibonacci: tiap suku adalah jumlah dua suku sebelumnya, 8 + 13 = 21." },
  { c: "detektif", ti: "Tiga Tersangka", q: "Sebuah lukisan dicuri oleh salah satu dari tiga tersangka. Andi: “Bukan aku pelakunya.” Budi: “Cici pelakunya.” Cici: “Budi berbohong.” Hanya satu orang yang jujur. Siapa pelakunya?", a: "YW5kaQ==", t: 120,
    h: ["Andaikan satu per satu orang sebagai pelaku, lalu hitung berapa yang jujur.", "Jika Budi atau Cici pelakunya, ada dua orang yang jujur."],
    e: "Hanya jika Andi pelakunya, tepat satu orang yang jujur (Cici). Andi dan Budi berbohong." },
  { c: "gambar", ti: "Sebelum Matahari Tinggi", q: "Tebak gambar: waktu apakah yang digambarkan tiga petunjuk ini?", v: "🌅 🐓 ⏰", a: "cGFnaXxzdWJ1aHxmYWphcg==", t: 0,
    h: ["Ayam jantan berkokok pada waktu ini.", "Waktu setelah malam, sebelum siang."],
    e: "Matahari terbit, ayam berkokok, dan alarm berbunyi: semuanya menandakan pagi hari." },
  { c: "jebakan", ti: "Bulan-Bulan Pendek", q: "Berapa bulan dalam setahun yang memiliki 28 hari?", a: "MTJ8ZHVhIGJlbGFzfHNlbXVhfHNlbXVhbnlhfHNlbXVhIGJ1bGFu", t: 0,
    h: ["Jangan terburu-buru menjawab 1.", "Bulan lain punya lebih dari 28 hari, bukan?"],
    e: "Semua 12 bulan punya setidaknya 28 hari. Hanya Februari yang tepat 28 hari (pada tahun biasa)." },
  { c: "kode", ti: "Kunci Geser Tiga", q: "Pesan kedua lebih sulit: setiap huruf digeser tiga langkah maju. Ini nama sesuatu yang mengusir gelap.", v: "FDKDBD", a: "Y2FoYXlh", t: 90,
    h: ["Mundurkan tiap huruf tiga langkah: F menjadi C.", "C-A-H-…"],
    e: "F→C, D→A, K→H, D→A, B→Y, D→A = CAHAYA." },
  { c: "logika", ti: "Ringan tapi Berat", q: "Aku seringan bulu, tetapi pria terkuat pun tak sanggup menahanku lebih dari beberapa menit. Apakah aku?", a: "bmFwYXN8bmFmYXM=", t: 0,
    h: ["Kamu sedang melakukanku sekarang tanpa sadar.", "Menahanku membuat dadamu sesak."],
    e: "Menahan napas hanya bisa bertahan beberapa menit, sekuat apa pun seseorang." },
  { c: "angka", ti: "Selisih yang Naik", q: "Polanya tidak ditambah angka tetap. Angka berikutnya?", v: "3 · 6 · 11 · 18 · 27 · ?", a: "Mzg=", t: 75,
    h: ["Hitung selisih antar angka: 3, 5, 7, 9…", "Selisih berikutnya adalah 11."],
    e: "Selisihnya 3, 5, 7, 9, lalu 11, sehingga 27 + 11 = 38." },
  { c: "kata", ti: "Tugas Sang Penyelidik", q: "Susun huruf ini menjadi satu kata: profesi yang sedang kamu jalani.", v: "F I T K E D E T", a: "ZGV0ZWt0aWY=", t: 60,
    h: ["Orang yang memecahkan kasus.", "Diawali D, diakhiri F."],
    e: "F-I-T-K-E-D-E-T tersusun menjadi DETEKTIF." },
  { c: "detektif", ti: "Ransel di Padang Pasir", q: "Seorang pria ditemukan tewas di tengah padang pasir. Di sampingnya ada ransel yang belum terbuka. Tidak ada jejak kaki lain di sekitarnya. Apa isi ransel itu?", a: "cGFyYXN1dHxwYXl1bmcgdGVyanVu", t: 0,
    h: ["Bagaimana ia bisa sampai di sana tanpa jejak kaki?", "Benda ini seharusnya terbuka saat ia jatuh dari udara."],
    e: "Pria itu melompat dari pesawat dan parasutnya gagal terbuka. Itulah sebabnya tak ada jejak kaki." },
  { c: "jebakan", ti: "Posisi Kedua", q: "Kamu ikut lomba lari dan berhasil menyalip pelari di posisi kedua. Sekarang kamu berada di posisi berapa?", a: "MnxkdWF8a2VkdWF8cG9zaXNpIGtlZHVh", t: 45,
    h: ["Bayangkan siapa yang ada di depanmu setelah menyalip.", "Kamu menggantikan posisi orang yang disalip."],
    e: "Menyalip pelari posisi kedua membuatmu menjadi posisi kedua, bukan pertama." },
  { c: "logika", ti: "Lima Mesin", q: "Lima mesin membuat 5 barang dalam 5 menit. Berapa menit yang dibutuhkan 100 mesin untuk membuat 100 barang?", a: "NXw1IG1lbml0fGxpbWF8bGltYSBtZW5pdA==", t: 60,
    h: ["Berapa lama satu mesin membuat satu barang?", "Satu mesin butuh 5 menit untuk satu barang."],
    e: "Tiap mesin butuh 5 menit per barang. 100 mesin bekerja bersamaan membuat 100 barang dalam waktu yang sama: 5 menit." },
  { c: "final", ti: "Kunci Terakhir", q: "Kunci terakhir tersembunyi di catatanmu sendiri. Ambil huruf pertama dari jawaban kelima teka-teki di catatan, sesuai urutan daftar (satu teka-teki dipakai dua kali). Susun menjadi satu kata: sifat yang paling dibutuhkan seorang detektif.", notes: [0, 9, 3, 9, 6], a: "c2FiYXI=", t: 150,
    h: ["Baca daftar dari atas ke bawah, ambil satu huruf dari tiap jawaban.", "Hurufnya: S, A, B, A, R."],
    e: "S (Sisir), A (Andi), B (Bayangan), A (Andi), R (Rahasia) = SABAR." }
];

/* ---------- Status & penyimpanan ---------- */
let S = { lvl: 0, score: 0, lives: 3, sound: true, done: false, best: 0, order: [] };
/* Urutan acak: teka-teki diacak di dalam tiap tingkat kesulitan, level final tetap terakhir. */
const TIERS = [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15], [16, 17, 18]];
function shuffled(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function newOrder() { return TIERS.flatMap(shuffled).concat(19); }
function validOrder(o) { return Array.isArray(o) && o.length === TOTAL && new Set(o).size === TOTAL && o.every(n => n >= 0 && n < TOTAL); }
function load() {
  try { Object.assign(S, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) {}
  S.lvl = Math.min(Math.max(+S.lvl || 0, 0), TOTAL);
  S.lives = Math.min(Math.max(+S.lives || 3, 1), 3);
  S.score = Math.max(+S.score || 0, 0);
  if (!validOrder(S.order)) S.order = S.lvl > 0 ? LV.map((_, i) => i) : newOrder();
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

/* ---------- Pembantu jawaban ---------- */
const norm = s => String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
const answers = l => atob(l.a).split("|");
const disp = l => { const w = answers(l)[0]; return w.charAt(0).toUpperCase() + w.slice(1); };
const rnd = a => a[Math.floor(Math.random() * a.length)];

/* ---------- Efek suara (WebAudio) ---------- */
let AC;
function tone(f, d, type = "sine", v = .08, when = 0) {
  if (!S.sound) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const t = AC.currentTime + when, o = AC.createOscillator(), g = AC.createGain();
    o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + d);
    o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + d);
  } catch (e) {}
}
const sfx = {
  click: () => tone(520, .07, "triangle"),
  ok: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, .22, "sine", .09, i * .09)),
  bad: () => { tone(150, .35, "sawtooth", .07); tone(105, .4, "square", .04, .05); },
  hint: () => { tone(880, .12); tone(1320, .22, "sine", .06, .1); },
  tick: () => tone(1000, .05, "square", .03),
  win: () => [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => tone(f, .35, "triangle", .09, i * .12)),
  over: () => [330, 262, 196, 131].forEach((f, i) => tone(f, .35, "sawtooth", .06, i * .2))
};

/* ---------- Layar & overlay ---------- */
function show(id) { document.querySelectorAll(".screen").forEach(s => s.classList.toggle("on", s.id === id)); window.scrollTo(0, 0); }
function ov(html) { $("#ov .box").innerHTML = html; $("#ov").classList.add("on"); }
function closeOv() { $("#ov").classList.remove("on"); resume(); }
function openInfo(html) { pause(); ov(html); }

/* ---------- Timer ---------- */
const T = { t0: 0, lim: 0, id: 0, paused: 0, run: false, last: -1 };
const elapsed = () => ((T.paused || Date.now()) - T.t0) / 1000;
function startTimer() {
  T.t0 = Date.now(); T.lim = cur().t; T.run = true; T.paused = 0; T.last = -1;
  clearInterval(T.id); T.id = setInterval(tick, 200); tick();
}
function stopTimer() { T.run = false; clearInterval(T.id); }
function pause() { if (T.run && !T.paused) T.paused = Date.now(); }
function resume() { if (T.run && T.paused) { T.t0 += Date.now() - T.paused; T.paused = 0; } }
function fmt(s) { s = Math.ceil(s); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }
function tick() {
  if (!T.run || T.paused) return;
  const e = elapsed(), box = $("#timer");
  if (T.lim) {
    const left = Math.max(0, T.lim - e);
    $("#tfill").style.width = (left / T.lim * 100) + "%";
    $("#ttxt").textContent = "⏳ " + fmt(left);
    box.classList.toggle("low", left <= 10);
    if (left <= 10 && left > 0 && Math.ceil(left) !== T.last) { T.last = Math.ceil(left); sfx.tick(); }
    if (left <= 0) timeout();
  } else {
    $("#ttxt").textContent = "⏱ " + fmt(e) + " · tanpa batas waktu";
  }
}

/* ---------- Alur level ---------- */
let H = 0, locked = false;
function cur() { return LV[S.order[S.lvl]]; }

function renderHud() {
  $("#lvTxt").textContent = "Level " + (S.lvl + 1);
  $("#score").textContent = S.score;
  $("#prog").style.width = (S.lvl / TOTAL * 100) + "%";
  $("#lives").innerHTML = [0, 1, 2].map(i => `<span class="${i < S.lives ? "" : "off"}">❤</span>`).join("");
}
function updateHintBtn() {
  const b = $("#bHint");
  b.disabled = H >= 2 || locked;
  b.textContent = H >= 2 ? "💡 Petunjuk habis" : `💡 Petunjuk (${H}/2) · −50 poin`;
}

function startLevel() {
  if (S.lvl >= TOTAL) return victory();
  const l = cur(), [ico, name] = CAT[l.c];
  show("game"); closeOv();
  $("#cat").textContent = ico + " " + name;
  $("#amb").textContent = rnd(AMB);
  $("#title").textContent = l.ti;
  $("#q").textContent = l.q;
  let v = "";
  if (l.c === "kata") v = `<div class="tiles">${l.v.split(" ").map(x => `<i>${x}</i>`).join("")}</div>`;
  else if (l.v) v = `<div class="vis ${l.c}">${l.v}</div>`;
  if (l.notes) v += `<ul class="notes">${l.notes.map(n => `<li>“${LV[n].ti}”: <b>${disp(LV[n])}</b></li>`).join("")}</ul>`;
  $("#visBox").innerHTML = v;
  $("#timer").classList.toggle("free", !l.t);
  $("#timer").classList.remove("low");
  $("#hints").innerHTML = ""; $("#fb").textContent = ""; $("#fb").className = "fb";
  $("#ans").value = ""; H = 0; locked = false;
  renderHud(); updateHintBtn(); startTimer();
  if (innerWidth > 700) setTimeout(() => $("#ans").focus(), 250);
}

function submit() {
  if (locked) return;
  const raw = $("#ans").value, v = norm(raw), fb = $("#fb");
  if (!v) { fb.className = "fb bad"; fb.textContent = "Tulis dulu jawabanmu."; return; }
  if (answers(cur()).some(a => norm(a) === v)) return win();
  $("#ans").select();
  loseLife(rnd(WRONG));
}

function shake() { const c = $("#card"); c.classList.remove("shake"); void c.offsetWidth; c.classList.add("shake"); }
function loseLife(msg, fromTimeout) {
  S.lives--; save(); renderHud(); sfx.bad(); shake();
  const fb = $("#fb"); fb.className = "fb bad"; fb.textContent = msg + ` (sisa nyawa: ${Math.max(S.lives, 0)})`;
  if (S.lives <= 0) return gameOver();
  if (fromTimeout) startTimer();
}
function timeout() { loseLife("Waktu habis! Kegelapan menelan detikmu.", true); }

function hint() {
  if (H >= 2 || locked) return;
  S.score = Math.max(0, S.score - 50); save(); renderHud();
  const d = document.createElement("div"); d.className = "hint"; d.textContent = "💡 " + cur().h[H];
  $("#hints").appendChild(d); H++; sfx.hint(); updateHintBtn();
}

function win() {
  stopTimer(); locked = true; sfx.ok();
  const l = cur(), e = elapsed(), base = 100 + S.lvl * 10;
  const speed = l.t ? Math.floor(Math.max(0, l.t - e) * 1.5) : Math.floor(Math.max(0, 60 - e));
  const pts = base + speed;
  S.score += pts; S.lvl++; S.lives = 3; save(); renderHud(); updateHintBtn();
  burst(70);
  if (S.lvl >= TOTAL) S.done = true, save();
  ov(`<div class="burst">✔</div><h2>Pintu Terbuka!</h2>
    <p class="ansline">Jawaban: <b>${disp(l)}</b></p><p>${l.e}</p>
    <div class="pts"><span>Poin dasar</span><span>+${base}</span></div>
    <div class="pts"><span>Bonus kecepatan</span><span>+${speed}</span></div>
    <p class="tot">+${pts}</p>
    <button class="btn main" data-a="next">${S.lvl >= TOTAL ? "Buka Berkas Terakhir" : "Level Berikutnya"}</button>`);
}

function gameOver() {
  stopTimer(); locked = true; sfx.over(); updateHintBtn();
  ov(`<div class="burst x">✖</div><h2>Gelap Menelanmu</h2>
    <p>Nyawamu habis. Jawaban yang benar akan tetap terkunci sampai kamu mencobanya lagi.</p>
    <button class="btn main" data-a="retry">Ulangi Level ${S.lvl + 1}</button>
    <button class="btn" data-a="home">Kembali ke Menu</button>`);
}

function victory() {
  stopTimer(); show("game"); sfx.win(); burst(220, true);
  S.done = true; S.best = Math.max(S.best, S.score); save(); renderHud();
  const rank = S.score >= 4500 ? "Legenda Pikiran" : S.score >= 3200 ? "Detektif Ahli" : "Pemecah Misteri";
  ov(`<div class="burst">👁️</div><h2>Misteri Terpecahkan</h2>
    <p class="rank">${rank}</p><p class="tot">${S.score} poin</p>
    <p>Berkas terakhir terbuka. Hanya ada satu halaman di dalamnya, bertuliskan namamu.</p>
    <p class="twist">Pemilik Arsip Sunyi selama ini adalah kamu sendiri: pikiran yang kamu asah di dua puluh pintu tadi. Itulah MYSTERY MIND.</p>
    <button class="btn main" data-a="again">Main Lagi dari Awal</button>
    <button class="btn" data-a="home">Kembali ke Menu</button>`);
}

function resetAll(keepBest = true) {
  const best = keepBest ? Math.max(S.best, S.score) : 0, snd = S.sound;
  S = { lvl: 0, score: 0, lives: 3, sound: snd, done: false, best, order: newOrder() }; save();
}

/* ---------- Beranda ---------- */
function home() {
  stopTimer(); closeOv(); show("home");
  $("#bPlay").textContent = S.done ? "Main Lagi dari Awal" : S.lvl > 0 ? `Lanjutkan (Level ${S.lvl + 1})` : "Mulai Bermain";
  const b = Math.max(S.best, S.done ? S.score : 0);
  $("#best").textContent = b ? `Skor terbaik: ${b}` : (S.lvl > 0 ? `Skor saat ini: ${S.score}` : "");
}

const HOW = `<h2>Cara Bermain</h2><ul>
  <li>Baca teka-teki, ketik jawabanmu, lalu tekan <b>Jawab</b> atau Enter.</li>
  <li>Kamu punya <b>3 nyawa</b> per level. Jawaban salah mengurangi satu nyawa.</li>
  <li>Tombol <b>Petunjuk</b> (maks. 2 per level) memberi bantuan, tetapi memotong 50 poin.</li>
  <li>Makin cepat menjawab, makin besar bonus poin. Beberapa level punya batas waktu; jika habis, nyawa berkurang.</li>
  <li>Jawab benar untuk membuka level berikutnya. Progresmu tersimpan otomatis.</li>
  <li>Waspada: beberapa teka-teki adalah jebakan. Baca pelan-pelan.</li></ul>
  <button class="btn main" data-a="close">Mengerti</button>`;

function settings() {
  return `<h2>Pengaturan</h2>
  <label class="sw"><span>Efek suara</span><input type="checkbox" id="snd" ${S.sound ? "checked" : ""}></label>
  <button class="btn" data-a="reset">Hapus Progres</button>
  <button class="btn main" data-a="close">Selesai</button>`;
}

/* ---------- Konfeti ---------- */
const cv = $("#cf"), cx = cv.getContext("2d");
let P = [], raf = 0;
function fit() { cv.width = innerWidth; cv.height = innerHeight; }
function burst(n, big) {
  fit();
  const col = ["#b84dff", "#3b82ff", "#62e4ff", "#ffffff", "#4dffb4"];
  for (let i = 0; i < n; i++) P.push({
    x: innerWidth / 2 + (Math.random() - .5) * 120, y: innerHeight * (big ? .3 : .45),
    vx: (Math.random() - .5) * (big ? 16 : 11), vy: -Math.random() * (big ? 13 : 10) - 2,
    s: 4 + Math.random() * 5, c: rnd(col), r: Math.random() * 6, life: 110 + Math.random() * 60
  });
  if (!raf) raf = requestAnimationFrame(loop);
}
function loop() {
  cx.clearRect(0, 0, cv.width, cv.height);
  P = P.filter(p => p.life-- > 0);
  P.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.vy += .33; p.vx *= .99; p.r += .2;
    cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.globalAlpha = Math.min(1, p.life / 40);
    cx.fillStyle = p.c; cx.shadowColor = p.c; cx.shadowBlur = 8; cx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .6); cx.restore();
  });
  raf = P.length ? requestAnimationFrame(loop) : 0;
  if (!raf) cx.clearRect(0, 0, cv.width, cv.height);
}

/* ---------- Mata yang mengikuti kursor ---------- */
function look(x, y) {
  const r = $("#eye").getBoundingClientRect();
  const dx = x - (r.left + r.width / 2), dy = y - (r.top + r.height / 2);
  const a = Math.atan2(dy, dx), d = Math.min(16, Math.hypot(dx, dy) / 14);
  $("#pup").setAttribute("transform", `translate(${(Math.cos(a) * d).toFixed(1)} ${(Math.sin(a) * d * .7).toFixed(1)})`);
}
addEventListener("mousemove", e => look(e.clientX, e.clientY));
addEventListener("touchmove", e => look(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
addEventListener("resize", fit);

/* ---------- Event ---------- */
$("#bPlay").onclick = () => { sfx.click(); if (S.done) resetAll(); else if (S.lvl === 0) { S.order = newOrder(); save(); } startLevel(); };
$("#bHow").onclick = () => { sfx.click(); openInfo(HOW); };
$("#bSet").onclick = () => { sfx.click(); openInfo(settings()); };
$("#bMenu").onclick = () => { sfx.click(); home(); };
$("#bAns").onclick = submit;
$("#bHint").onclick = hint;
$("#ans").addEventListener("keydown", e => { if (e.key === "Enter") submit(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && $("#ov").classList.contains("on") && !locked) closeOv(); });
$("#ov").addEventListener("change", e => { if (e.target.id === "snd") { S.sound = e.target.checked; save(); sfx.click(); } });
$("#ov").addEventListener("click", e => {
  const b = e.target.closest("[data-a]"); if (!b) return;
  const a = b.dataset.a; sfx.click();
  if (a === "close") closeOv();
  else if (a === "next") startLevel();
  else if (a === "retry") { S.lives = 3; save(); startLevel(); }
  else if (a === "home") home();
  else if (a === "again") { resetAll(); home(); }
  else if (a === "reset") {
    if (b.dataset.sure) { resetAll(false); closeOv(); home(); }
    else { b.dataset.sure = 1; b.textContent = "Yakin? Tekan lagi untuk menghapus"; }
  }
});
document.addEventListener("visibilitychange", () => { document.hidden ? pause() : resume(); });

load();
if (S.lvl >= TOTAL) S.done = true;
home();
