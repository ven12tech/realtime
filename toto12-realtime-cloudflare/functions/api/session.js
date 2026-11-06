export async function onRequestPost({ request, env }) {
  try {
    if (!env.OPENAI_API_KEY) {
      return Response.json({ error: "Secret OPENAI_API_KEY belum dipasang di Cloudflare." }, { status: 500 });
    }

    const response = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        session: {
          type: "transcription",
          audio: {
            input: {
              format: { type: "audio/pcm", rate: 24000 },
              transcription: {
                model: "gpt-live-transcribe",
                language: "id",
                delay: "low",
                prompt: "Transkripsi suara operator customer service berbahasa Indonesia. Pertahankan kata yang diucapkan, jangan menambah atau mengarang. Konteks: layanan pelanggan, transaksi, perbankan dan e-wallet.",
                keywords: [
                  "bosku", "TOTO12", "LiveChat", "deposit", "withdraw", "WD",
                  "pending", "rekening", "e-wallet", "QRIS", "DANA", "OVO",
                  "GoPay", "BCA", "BRI", "BNI", "Mandiri", "CIMB", "BSI",
                  "Bank Neo", "Bank Jago", "cashback", "rollingan", "saldo",
                  "transaksi", "konfirmasi", "validasi", "M-Banking"
                ]
              },
              turn_detection: null
            }
          }
        }
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return Response.json({ error: data?.error?.message || "Gagal membuat sesi Realtime." }, { status: response.status });
    }

    const secret = data?.client_secret?.value;
    if (!secret) {
      return Response.json({ error: "Token sesi tidak ditemukan dari API." }, { status: 502 });
    }

    return Response.json({ client_secret: secret, expires_at: data.client_secret.expires_at }, {
      headers: { "Cache-Control": "no-store" }
    });
  } catch (error) {
    return Response.json({ error: "Kesalahan Worker saat membuat sesi." }, { status: 500 });
  }
}
