const knowledgeBase: Record<string, string> = {
  'turjawali': `**Turjawali** adalah singkatan dari Tugas Pokok Satpam:
- **TUR** : Pengaturan (mengatur lalu lintas, tamu, dan lingkungan)
- **JA** : Penjagaan (menjaga keamanan aset dan personel)
- **WA** : Pengawalan (mengawal orang/barang penting)
- **LI** : Patroli (melakukan patroli rutin untuk deteksi dini)

Ini adalah tugas inti yang harus dikuasai setiap Satpam.`,

  'gada pratama': `**Gada Pratama** adalah jenjang dasar sertifikasi Satpam. Materi meliputi:
- Dasar-dasar Turjawali
- Bela Diri Dasar
- Penggunaan alat pengaman (tongkat, borgol)
- Etika profesi dan pelayanan publik
- Penanganan tamu dan pengamanan gedung

Masa berlaku: 3 tahun, bisa diperpanjang dengan pelatihan ulang.`,

  'gada madya': `**Gada Madya** setara dengan Danru (Komandan Regu).
Materi tambahan:
- Leadership dan kepemimpinan regu
- Manajemen risiko operasional
- Investigasi internal
- Crowd control dan pengendalian massa
- Emergency response
- Intelijen dasar dan audit keamanan

Syarat: minimal 2 tahun sebagai Gada Pratama.`,

  'gada utama': `**Gada Utama** adalah jenjang tertinggi sertifikasi Satpam.
Fokus pada aspek strategis:
- Strategic Security Management
- Crisis Management dan Business Continuity
- Corporate Security
- Executive Protection (pengamanan VVIP)
- Cyber Security Awareness
- Counter Terrorism
- Risk Intelligence dan analisis keamanan nasional

Syarat: minimal 3 tahun sebagai Gada Madya.`,

  'danru': `**Danru (Komandan Regu)** adalah pemimpin regu satpam yang bertanggung jawab atas:
1. Mengkoordinasikan anggota regu saat bertugas
2. Memastikan pelaksanaan SOP berjalan
3. Melakukan briefing sebelum pergantian shift
4. Mengawasi pos-pos penjagaan
5. Melaporkan situasi ke atasan/Manajer Keamanan
6. Menangani situasi darurat di lapangan

Danru minimal memegang sertifikasi Gada Madya.`,

  'incident report': `**Cara membuat Incident Report yang baik:**

1. **Identifikasi** - Catat waktu, lokasi, dan pihak terlibat dengan presisi
2. **Kronologi** - Deskripsikan kejadian secara detail dan berurutan (5W+1H)
3. **Tindakan** - Apa yang sudah dilakukan saat kejadian
4. **Dampak** - Kerugian/korban yang ditimbulkan
5. **Rekomendasi** - Saran pencegahan ke depannya

Tips: Gunakan bahasa objektif, hindari opini pribadi.`,

  'sop kehilangan': `**SOP Kehilangan Barang:**

1. **Amankan TKP** - Jangan biarkan siapapun menyentuh area kejadian
2. **Laporkan** - Segera laporkan ke atasan/Danru
3. **Dokumentasi** - Foto lokasi, kondisi, dan barang sekitar
4. **Kumpulkan Informasi** - CCTV, saksi, dan data terkait
5. **Buat Laporan** - Incident Report lengkap dan detail
6. **Tindak Lanjut** - Koordinasi dengan pihak berwajib jika diperlukan

Selalu utamakan keselamatan dan prosedur yang berlaku.`,

  'bela diri': `**Teknik Bela Diri Dasar untuk Satpam:**

1. **Kuncian** - Teknik mengunci tangan/lengan untuk mengontrol
2. **Hindaran** - Gerakan menghindar dari serangan lawan
3. **Bantingan Dasar** - Menjatuhkan lawan dengan aman
4. **Lepas Kuncian** - Cara melepaskan diri dari pegangan
5. **Penggunaan Borgol** - Teknik memborgol yang benar dan aman

Penting: Bela diri untuk satpam bersifat defensif, bukan ofensif.`,

  'patroli': `**Teknik Patroli yang Efektif:**

1. **Rute Acak** - Hindari pola yang bisa diprediksi
2. **Titik Buta** - Perhatikan area yang jarang terlihat
3. **Dokumentasi** - Catat temuan selama patroli
4. **Komunikasi** - Laporkan posisi secara berkala ke pos
5. **Deteksi Dini** - Cari tanda-tanda mencurigakan

Jenis patroli: berjalan kaki, kendaraan, dan statis.`,

  'pengawalan': `**Prosedur Pengawalan yang Profesional:**

1. **Briefing** - Pahami rute, jadwal, dan potensi ancaman
2. **Formasi** - Atur posisi pengawal (depan, belakang, samping)
3. **Komunikasi** - Gunakan kode dan alat komunikasi yang aman
4. **Antisipasi** - Siapkan rencana darurat untuk setiap skenario
5. **Dokumentasi** - Catat setiap kegiatan pengawalan

Gunakan prinsip preventive security dalam setiap pengawalan.`,

  'first aid': `**Pertolongan Pertama (First Aid) untuk Satpam:**

1. **DRABC** - Danger, Response, Airway, Breathing, Circulation
2. **Luka Bakar** - Alirkan air dingin, jangan pecahkan lepuh
3. **Patah Tulang** - Immobilisasi, jangan gerakkan korban
4. **Pingsan** - Posisi recovery, longgarkan pakaian
5. **CPR** - 30 kompresi + 2 napas buatan (rasio 30:2)

First Aid wajib dikuasai setiap anggota satpam.`,

  'loker': `**Tips Mencari Lowongan Kerja Security:**

1. Update profil dan KTA digital di aplikasi
2. Lengkapi sertifikat dan pengalaman kerja
3. Aktif di forum untuk networking
4. Sesuaikan jenjang tingkatan dengan posisi yang dilamar
5. Persiapkan CV dan dokumen pendukung

Pastikan kamu sudah terverifikasi agar dilirik perusahaan!`,

  'pps': `**Tips Lulus PPS (Pendidikan Profesi Satpam):**

1. Pelajari modul Turjawali dengan baik
2. Kuasai teknik bela diri dasar
3. Latihan baris-berbaris dan sikap sempurna
4. Pahami etika profesi dan pelayanan publik
5. Jaga kebugaran fisik dan mental

Fokus pada praktik lapangan dan simulasi situasi nyata.`,
};

export function getAIResponse(question: string, contextTitle?: string): string {
  const q = question.toLowerCase().trim();

  for (const [keyword, answer] of Object.entries(knowledgeBase)) {
    if (q.includes(keyword)) return answer;
  }

  if (contextTitle) {
    const ct = contextTitle.toLowerCase();
    for (const [keyword, answer] of Object.entries(knowledgeBase)) {
      if (ct.includes(keyword)) return answer;
    }
  }

  return `Terima kasih atas pertanyaan Anda tentang "${question}".

Dalam profesi Satpam, setiap situasi perlu ditangani berdasarkan SOP yang berlaku dan peraturan perusahaan masing-masing.

**Saran saya:**
1. 📖 **Cek Modul Materi** - Kunjungi halaman Materi Satpam untuk topik terkait
2. 💬 **Diskusi Forum** - Tanyakan ke sesama anggota di Forum Komunitas
3. 📞 **Konsultasi** - Jika darurat, segera hubungi atasan atau Danru

Ada topik lain yang ingin ditanyakan? Saya siap membantu seputar:
• Turjawali & tugas pokok satpam
• Jenjang sertifikasi (Gada Pratama/Madya/Utama)
• SOP keamanan & incident report
• Bela diri & first aid
• Tips karir & loker security`;
}
