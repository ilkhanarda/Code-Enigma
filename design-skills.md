# Code-Enigma Dashboard Design Skills

Bu dosya `frontend/src/pages/dashboard/dashboard.jsx` icindeki guncel dashboard tasarim dilinden cikarilan uygulama kurallaridir. Dashboard sayfalarinda hedef, akademik veriyi yogun ama rahat taranabilir bir arayuzle sunmaktir.

## Temel Kimlik

- Arayuz dili Turkce olmalidir.
- Font aileleri bilesen icinde yeniden import edilmez; `index.html` uzerinden gelen IBM Plex Mono kullanilir.
- Sayfa zemini acik, soguk ve veri odaklidir: `#f8fbff`, `#eef5ff`, `#f7fbff`.
- Birincil vurgu `#2563EB`, ikincil vurgu `#7C3AED`, basari `#059669`, uyari `#D97706`, kritik `#DC2626`.
- Metin ana rengi `#111827`; ikincil metinler `#475569`, yardimci metinler `#94A3B8`.

## Sayfa Iskeleti

- Tum dashboard sayfalari su duzeni kullanir:

```jsx
<DashboardShell>
  <PageHeader />
  <main>...</main>
</DashboardShell>
```

- `DashboardShell`, `DashboardNavbar` ile sol navigasyonu, mobil altta dock boslugunu ve dashboard zeminini saglar.
- Ana icerik `pb-24 md:pb-0` boslugu ile mobil dock'u ezmemelidir.
- Header cam etkili, sticky ve sinirli yukseklikte olmalidir. Sayfa basligi kisa, acik ve islev odakli kalir.

## Yuzeyler

- Ana kartlar `Surface` veya ayni sinif diliyle olusur: beyaz/cam yuzey, `border-white/70`, buyuk ama kontrollu radius (`rounded-[24px]` veya `rounded-[28px]`), mavi tonlu yumusak golge.
- Tekrarlanan veri ogeleri kart olabilir; sayfa bolumleri kart icinde kart olarak yigilmaz.
- Kucuk ozetler `StatPill` ile verilir: tek sayi, uppercase etiket, hafif cam zemin.
- Durum etiketleri `StatusBadge` ile kucuk, uppercase ve renk kontrollu olmalidir.

## Tipografi

- Header H1: `text-[24px]` - `text-[30px]`, `font-bold`, sikisik olmayan satir yuksekligi.
- Kart basliklari: `text-[15px]` - `text-[20px]`, veri listelerinde daha kucuk tutulur.
- Section label: kisa cizgi + uppercase metin. Harf araligi `tracking-[1.8px]` ile sinirli tutulur.
- Button ve chip metinleri 10-12px araliginda, asiri buyuk hero tipi kullanilmaz.

## Etkilesim

- Butonlar ikon + kisa Turkce komutla yazilir.
- Aktif durumlar mavi, tamamlanan durumlar yesil, isaretli/uyari durumlari amber, kritik durumlar kirmizi.
- Hover etkisi en fazla hafif yukari hareket ve border/golge guclenmesi olmalidir.
- Test sayfasinda reveal deseni korunur: dogru/yanlis renkleri ve aciklama yalnizca test bittikten sonra gorunur.

## Veri Gorsellestirme

- Progress bar ince, yuvarlak ve sakin olmalidir.
- Arkadas ortalamasi gibi karsilastirma isaretleri mevcutsa bar uzerinde net ama kucuk tutulur.
- Tablo yerine kart satirlari kullanilir; her satirda once konu/etiket, sonra metrik, en sonda eylem yer alir.

## Uygulama Yardimcilari

Ortak tasarim primitive'leri `frontend/src/components/dashboard/dashboard-design.jsx` icindedir:

- `DashboardShell`
- `PageHeader`
- `SectionLabel`
- `Surface`
- `StatPill`
- `StatusBadge`
- `ProgressBar`
- `EmptyState`

Yeni veya yeniden tasarlanan dashboard sayfalari once bu primitive'leri kullanmali, yalnizca sayfaya ozel davranis icin lokal bilesen eklemelidir.
