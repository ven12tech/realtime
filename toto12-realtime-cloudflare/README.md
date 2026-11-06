# TOTO12 Voice Assistant — Cloudflare Pages + Functions

Versi realtime: teks transkripsi muncul saat operator berbicara. Tidak memerlukan VPS.

## Struktur
- `public/index.html` — antarmuka HTML/JavaScript.
- `functions/api/session.js` — Cloudflare Pages Function yang membuat ephemeral Realtime client secret.
- `wrangler.toml` — konfigurasi Pages.

## Deploy lewat Cloudflare Pages (Git)
1. Buat repository GitHub dan unggah isi folder ini.
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git.
3. Pilih repository.
4. Framework preset: None.
5. Build command: kosongkan.
6. Build output directory: `public`.
7. Deploy.

Penting: folder `functions` harus berada di root repository, sejajar dengan `public`, bukan di dalam `public`.

## Pasang API key dengan aman
1. Buka project Pages di Cloudflare.
2. Settings → Variables and Secrets.
3. Add variable/secret:
   - Name: `OPENAI_API_KEY`
   - Value: API key dari OpenAI Platform.
   - Pilih tipe Secret / Encrypt.
4. Simpan lalu lakukan redeploy jika diminta.

Jangan masukkan API key ke `index.html`, GitHub, atau file publik.

## Deploy manual dengan Wrangler (opsional)
Dari folder project:
```bash
npx wrangler pages project create toto12-voice-assistant
npx wrangler pages deploy public --project-name toto12-voice-assistant
npx wrangler pages secret put OPENAI_API_KEY --project-name toto12-voice-assistant
```
Jika deploy manual, pastikan Pages Functions ikut ter-deploy. Untuk project Pages yang menggunakan folder `functions`, deployment yang paling mudah adalah menghubungkan repository Git melalui dashboard. Jangan hanya upload folder `public` jika ingin endpoint `/api/session` aktif.

## Cara menggunakan
1. Buka URL Cloudflare Pages melalui HTTPS.
2. Klik Mulai berbicara dan izinkan mikrofon.
3. Ucapkan kalimat; teks akan muncul bertahap.
4. Klik Berhenti, lalu Salin teks.

## Catatan teknis
- Menggunakan OpenAI Realtime transcription `gpt-live-transcribe` melalui WebRTC.
- Cloudflare Pages Function membuat ephemeral token; API key utama tetap di sisi server.
- Model mengirim delta transkrip dan event completed. Teks parsial dapat berubah saat hasil final diterima.
- Browser modern dan koneksi internet diperlukan.
- Realtime API dikenakan biaya sesuai tarif API yang berlaku. ChatGPT Go/Plus tidak otomatis mencakup kredit API.
- Uji kualitas dengan suara, aksen, mikrofon, dan istilah kerja sebenarnya. Kata kunci hanya petunjuk, bukan jaminan ejaan.
- Jangan merekam suara pelanggan tanpa dasar izin/pemberitahuan yang sesuai.
