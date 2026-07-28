# Başvuru Yönetim Sistemi Demo

Kurumların iş, burs, yüksek lisans, üyelik ve etkinlik başvurularını tek noktadan yönetebilmesi için hazırlanmış etkileşimli ürün demosu.

## Demo kapsamı

- Aday portalı: form adımları, belge yükleme, taslak kaydı ve başvuru durumu
- Moderasyon paneli: aday arama ve filtreleme, belge önizleme, değerlendirme, revize talebi ve üst onay
- Admin paneli: istatistikler, başvuru hunisi, ilan oluşturma, nihai kabul/red ve CSV dışa aktarma
- Rol bazlı navigasyon: Aday, Moderatör ve Admin
- Tarayıcıda yerel demo durum kaydı
- Responsive masaüstü ve mobil arayüz
- Lucide ikon sistemi

## Kullanılan teknolojiler

- React 19
- TypeScript
- Vinext / Vite
- Tailwind CSS
- Lucide React

## Çalıştırma

Node.js `>=22.13.0` gereklidir.

```bash
npm ci
npm run dev
```

Üretim doğrulaması:

```bash
npm run lint
npm run build
```

## Not

Bu sürüm, ilandaki iş akışlarını göstermek amacıyla hazırlanmış bir MVP demodur. Veriler örnektir ve tarayıcıda tutulur. Üretim sürümünde veritabanı, kalıcı dosya depolama, kimlik doğrulama, rol yetkilendirme ve e-posta servisleri eklenmelidir.
