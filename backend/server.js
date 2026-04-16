const express = require('express');
const cors = require('cors');
const { Ollama } = require('ollama');

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
const MODEL_NAME = process.env.OLLAMA_MODEL || 'llama3';
const ollama = new Ollama({ host: OLLAMA_HOST });

app.use(cors());
app.use(express.json());

process.on('unhandledRejection', (error) => {
  console.error('[Process] Unhandled rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('[Process] Uncaught exception:', error);
});

app.get('/api/test', (req, res) => {
  res.json({
    message: 'Backend çalışıyor',
    host: HOST,
    port: PORT,
    model: MODEL_NAME,
    ollamaHost: OLLAMA_HOST,
  });
});

app.get('/api/health', async (req, res) => {
  try {
    const models = await ollama.list();
    res.json({
      ok: true,
      model: MODEL_NAME,
      ollamaHost: OLLAMA_HOST,
      availableModels: Array.isArray(models?.models)
        ? models.models.map((item) => item.model)
        : [],
    });
  } catch (error) {
    res.status(503).json({
      ok: false,
      model: MODEL_NAME,
      ollamaHost: OLLAMA_HOST,
      error: error?.message || 'Ollama baglantisi kurulamadi.',
    });
  }
});

app.post('/api/chat', async (req, res) => {
  const zaman = new Date().toLocaleTimeString('tr-TR');

  try {
    const kullaniciMesaji = req.body.message;
    const oncekiMesajlar = Array.isArray(req.body.history) ? req.body.history.slice(-6) : [];
    const bolum = req.body.chapter || {};

    if (!kullaniciMesaji) {
      return res.status(400).json({ reply: 'Mesaj boş olamaz.' });
    }

    const bolumBilgisi = [
      bolum.phase ? `Bölüm: ${bolum.phase}` : null,
      bolum.title ? `Başlık: ${bolum.title}` : null,
      bolum.summary ? `Özet: ${bolum.summary}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    console.log(`[${zaman}] Yeni istek geldi`);
    console.log(`[${zaman}] Kullanıcı mesajı: ${kullaniciMesaji}`);

    const baslangic = Date.now();

    const yanit = await ollama.chat({
      model: MODEL_NAME,
      stream: false,
      messages: [
        {
          role: 'system',
          content: `Senin adın Enigma.
Her zaman yalnızca Türkçe cevap ver.
Asla İngilizce cevap verme.
Kullanıcı başka dilde yazsa bile cevabı Türkçe ver.
Matematik, fen, teknik veya zor sorularda da sadece Türkçe kullan.
"Let's", "step by step", "comparison", "solution" gibi İngilizce kalıplar kullanma.
Cevaplarını sade, kısa, öğretici ve öğrenci seviyesine uygun ver.
Bilmediğin bilgiyi uydurma.
Gerekirse maddeler halinde açıkla.
Kullanıcı video ders izlerken sana soru soruyor. Yanıtlarında varsa aşağıdaki bölüm bağlamını kullan:
${bolumBilgisi || 'Bölüm bağlamı gönderilmedi.'}`
        },
        ...oncekiMesajlar
          .filter((mesaj) => mesaj && (mesaj.role === 'user' || mesaj.role === 'assistant') && mesaj.content)
          .map((mesaj) => ({
            role: mesaj.role,
            content: mesaj.content,
          })),
        {
          role: 'user',
          content: kullaniciMesaji
        }
      ],
      options: {
        temperature: 0.2
      }
    });

    const gecenSure = Date.now() - baslangic;
    const cevapIcerigi = yanit?.message?.content?.trim();

    if (!cevapIcerigi) {
      console.error(`[${zaman}] Model boş veya geçersiz yanıt döndü:`, yanit);
      return res.status(502).json({ reply: 'Model geçerli bir cevap üretmedi.' });
    }

    console.log(`[${zaman}] Model cevabı: ${cevapIcerigi}`);
    console.log(`[${zaman}] Yanıt süresi: ${gecenSure} ms`);
    console.log('-----------------------------------');

    res.json({ reply: cevapIcerigi });
  } catch (error) {
    console.error(`[${zaman}] Ollama hatası:`, error);
    const hataMesaji =
      error?.message ||
      error?.cause?.message ||
      'Bilinmeyen backend hatası.';

    res.status(500).json({ reply: `AI yanıt üretirken hata oluştu: ${hataMesaji}` });
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Backend http://${HOST}:${PORT} adresinde çalışıyor`);
  console.log(`Ollama host: ${OLLAMA_HOST}`);
  console.log(`Ollama model: ${MODEL_NAME}`);
});
