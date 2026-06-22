# ParaPocket — Kişisel Bütçe Takip PWA

[![MIT](https://img.shields.io/badge/license-MIT-teal)](LICENSE)

React + TypeScript ile geliştirilmiş, tamamen istemci taraflı kişisel finans uygulaması. Gelir/gider takibi, bütçe yönetimi, grafiksel raporlar ve finansal hedefler.

## Özellikler

- **Dashboard** — Net değer, aylık gelir/gider, son 6 ay çubuk grafik, kategori dağılımı donut grafik
- **İşlemler** — Arama, filtreleme, CSV/JSON dışa aktarım
- **Akıllı Kategori Sistemi** — İkonlu modal grid, gelir/gider ayrı kategoriler
- **Bütçeler** — Kategori bazlı limit, %75/%100 uyarı renkleri, toast bildirim
- **Tekrarlayan İşlemler** — Günlük/haftalık/aylık/yıllık, otomatik ekleme
- **Varlıklar** — Banka/nakit/yatırım/kripto varlık takibi, net değer hesaplama
- **Rapor** — Aylık özet, en çok harcanan kategoriler, geçen aya göre karşılaştırma
- **Hedefler** — Birikim hedefleri, ilerleme çubuğu, para ekleme
- **Tema** — Koyu/açık tema desteği
- **PWA** — Mobil kurulum, çevrimdışı çalışma
- **Gizlilik** — Tüm veriler localStorage'da, hesap veya bulut yok

## Hızlı Başlangıç

```bash
git clone https://github.com/DiyarCeylan/parapocket.git
cd parapocket
npm install
npm run dev
```

Tarayıcıda `http://localhost:5173` açılır.

## Derleme

```bash
npm run build
```

Çıktı `dist/` klasöründe oluşur. Statik sunucuyla serve edilebilir:

```bash
npx serve dist
```

## Teknoloji

| Teknoloji | Amaç |
|-----------|------|
| React 19 | UI framework |
| TypeScript | Tip güvenliği |
| Vite | Build aracı |
| Recharts | Grafikler |
| React Router | Sayfa yönlendirme |
| localStorage | Veri depolama |
| Service Worker | Çevrimdışı destek |
