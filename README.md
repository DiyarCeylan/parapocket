# ParaPocket — Kişisel Bütçe Takip PWA

[![MIT](https://img.shields.io/badge/license-MIT-teal)](LICENSE)

Gelir/gider takibi, bütçe yönetimi ve finansal görselleştirme için **tamamen istemci taraflı** bir PWA. Tüm veriler IndexedDB ile sadece cihazınızda kalır, hesap veya bulut senkronizasyonu yok.

## İçindekiler

- [Hızlı Başlangıç](#hızlı-başlangıç)
- [Özellikler](#özellikler)
- [Tasarım](#tasarım)
- [Teknik Altyapı](#teknik-altyapı)
- [Dağıtım](#dağıtım-github-pages)
- [Yol Haritası](#yol-haritası)
- [Lisans](#lisans)

## Hızlı Başlangıç

```bash
git clone https://github.com/DiyarCeylan/parapocket.git
cd parapocket
npx serve .
```

Tarayıcıda `http://localhost:3000` açılır. Hiçbir build aracı veya bağımlılık gerekmez.

## Özellikler

| Özellik | Açıklama |
|---------|----------|
| **Dashboard** | Aylık bakiye, gelir/gider özeti, günlük grafik, kategori dağılımı |
| **İşlemler** | Arama ve filtreleme ile tüm işlem listesi |
| **Ekle/Düzenle** | Tarih, kategori, tutar ve not ile hızlı giriş |
| **Bütçeler** | Kategori bazlı aylık limit ve görsel ilerleme çubuğu |
| **Ayarlar** | Koyu/açık tema, CSV/JSON dışa aktarım, JSON yedekten geri yükleme |
| **PWA** | Mobil/masaüstü kurulum, çevrimdışı çalışma |
| **Gizlilik** | Hesap yok, bulut yok, cihazında kalır |

## Tasarım

- **Renk paleti** — Teal (`#0d9488`), Amber (`#d97706`), Emerald (`#059669`), Rose (`#e11d48`)
- **Tipografi** — Premium sistem font stack, uppercase etiketler
- **İkonlar** — El yapımı SVG ikonlar (kütüphane bağımlılığı yok)
- **Tema** — Koyu/açık mod, yumuşak CSS geçişleri
- **Düzen** — Mobil öncelikli responsive, sabit alt navigasyon

## Teknik Altyapı

- **Vanilla JS** (ES Modules) — framework veya build adımı yok
- **IndexedDB** — çevrimdışı öncelikli veri depolama
- **SVG Grafikler** — elle çizilmiş bar ve kategori grafikleri
- **Service Worker** — dinamik path algılama ile tam çevrimdışı destek
- **GoatCounter** — gizlilik dostu isteğe bağlı analitik

## Dağıtım (GitHub Pages)

1. Depoyu GitHub'a push et
2. **Settings → Pages** altında **Branch** olarak `main` ve folder `/ (root)` seç
3. **Save** ile canlıya al

Service Worker hem local hem GitHub Pages ortamını otomatik algılar.

## Yol Haritası

- [ ] Aylık PDF rapor çıktısı
- [ ] Tekrarlanan işlemler (abonelikler için)
- [ ] Çoklu para birimi desteği
- [ ] Hesap/bakiye yönetimi

## Lisans

MIT — dilediğin gibi kullan, değiştir, dağıt.
