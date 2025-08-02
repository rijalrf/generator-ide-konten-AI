import { GoogleGenAI, Type } from "@google/genai";
import { Category, ContentType, PlatformFormat, Script } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const schema = {
  type: Type.OBJECT,
  properties: {
    scripts: {
      type: Type.ARRAY,
      description: 'Daftar ide skrip konten.',
      items: {
        type: Type.OBJECT,
        properties: {
          judulKonten: { type: Type.STRING, description: 'Judul yang menarik untuk video.' },
          durasi: { type: Type.STRING, description: 'Estimasi durasi video (misal: 30-60 detik atau 5-10 menit).' },
          deskripsiKarakter: { type: Type.STRING, description: 'Deskripsi singkat tentang karakter atau pembicara dalam video.' },
          scenes: {
            type: Type.ARRAY,
            description: 'Rangkaian adegan yang membentuk skrip video.',
            items: {
              type: Type.OBJECT,
              properties: {
                namaScene: { type: Type.STRING, description: 'Nama atau judul untuk adegan ini (contoh: Adegan Pembuka, Tips 1, Penutup).' },
                visual: { type: Type.STRING, description: "Deskripsi rinci yang akan digunakan sebagai PROMPT untuk menghasilkan gambar adegan. WAJIB mengikuti gaya 'stickman hitam putih, minimalis, di atas latar belakang putih polos'. Prompt ini harus mendeskripsikan aksi karakter, background, dan teks yang mungkin muncul." },
                audio: { type: Type.STRING, description: 'Deskripsi tentang apa yang terdengar. Termasuk dialog, Voice Over (V.O.), musik, dan efek suara (SFX).' },
              },
              required: ['namaScene', 'visual', 'audio']
            }
          },
          hashtags: { type: Type.STRING, description: 'Kumpulan hashtag yang relevan, dipisahkan spasi (contoh: #tips #produktifitas).' },
        },
        required: ['judulKonten', 'durasi', 'deskripsiKarakter', 'scenes', 'hashtags']
      }
    }
  },
  required: ['scripts']
};

export const generateScripts = async (category: Category, contentType: ContentType, platformFormat: PlatformFormat, count: number): Promise<Script[]> => {
  let platformInstructions = '';
  if (platformFormat === PlatformFormat.Short) {
    platformInstructions = `
      Fokus pada pembuatan skrip untuk VIDEO PENDEK (TikTok/Reels) dengan durasi target 15-60 detik.
      - Hook harus sangat kuat di adegan pertama.
      - Setiap adegan harus singkat dan dinamis.
      - Bahasa sangat santai dan mengikuti tren.
    `;
  } else {
    platformInstructions = `
      Fokus pada pembuatan skrip untuk VIDEO PANJANG (YouTube) dengan durasi target 5-10 menit.
      - Skrip harus memiliki struktur yang jelas: Intro (adegan pembuka), Isi (beberapa adegan mendetail), dan Outro (adegan penutup).
      - Isi konten harus lebih mendalam dan komprehensif.
      - Bahasa bisa lebih terstruktur namun tetap menarik.
    `;
  }

  const prompt = `
    Anda adalah seorang penulis skrip konten video profesional dan ahli dalam membuat prompt untuk AI image generator.
    Tugas Anda adalah membuat ${count} ide skrip video yang unik dan berbeda satu sama lain, berdasarkan kriteria yang diberikan.

    KRITERIA:
    1. KATEGORI UTAMA: ${category}
    2. JENIS KONTEN: ${contentType}
    3. FORMAT PLATFORM: ${platformFormat}

    INSTRUKSI SPESIFIK BERDASARKAN FORMAT:
    ${platformInstructions}

    ATURAN FORMAT SKRIP (WAJIB DIIKUTI):
    Setiap skrip harus memiliki struktur lengkap sebagai berikut:
    1.  **judulKonten**: Judul yang menarik.
    2.  **durasi**: Estimasi durasi.
    3.  **deskripsiKarakter**: Penjelasan singkat tentang pembicara.
    4.  **scenes**: Sebuah array adegan. Setiap adegan WAJIB memiliki:
        - **namaScene**: Judul untuk adegan tersebut (misal: "Pembuka", "Inti Masalah", "Solusi", "Penutup").
        - **visual**: Ini adalah PROMPT GAMBAR untuk adegan tersebut. Harus mendeskripsikan secara rinci apa yang TAMPIL di layar dan WAJIB ditulis dalam gaya 'stickman hitam putih, minimalis, di atas latar belakang putih polos'.
        - **audio**: Deskripsi rinci tentang apa yang TERDENGAR. Termasuk dialog, Voice Over (V.O.), musik, dan efek suara (SFX).
    5.  **hashtags**: Kumpulan hashtag relevan.

    CONTOH STRUKTUR UNTUK 1 ADEGAN:
    {
      "namaScene": "Jurus Anti-Mager",
      "visual": "stickman hitam putih, minimalis, di atas latar belakang putih polos, seorang figur stickman bangkit dari sofa dengan ekspresi semangat, gelembung teks di atas kepala bertuliskan 'Jurus Anti-Mager 5 Menit!'",
      "audio": "Host (dengan energi): 'Puy punya jurus ampuh buat Mas!' (SFX: 'TING!')"
    }

    Pastikan ${count} skrip yang dihasilkan benar-benar berbeda satu sama lain dalam hal ide dan eksekusi. Gunakan bahasa Indonesia yang natural dan menarik.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 1,
        topP: 0.95,
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });
    
    const jsonText = response.text.trim();
    const jsonResponse = JSON.parse(jsonText);
    
    return jsonResponse.scripts || [];
  } catch (error) {
    console.error("Error generating or parsing scripts:", error, "Raw text:", (error as any).text);
    if (error instanceof SyntaxError) {
        throw new Error("Gagal mem-parsing respons dari AI. Coba lagi.");
    }
    throw new Error("Gagal menghasilkan skrip. Silakan coba lagi.");
  }
};