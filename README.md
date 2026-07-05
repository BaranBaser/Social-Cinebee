# CinemaAI Social

Dizi, film ve anime keşfi + sosyal özellikler (üyelik, yorum/puanlama, sohbet, yönetici paneli) barındıran tam bağımsız bir web uygulaması.

## Özellikler

- **Üyelik sistemi**: Kayıt ol / giriş yap (JWT tabanlı oturum)
- **İçerik keşfi**: TMDB (film/dizi) ve Jikan (anime, MyAnimeList) API'lerinden canlı veri
- **Yorum ve puanlama**: Her içeriğe 1-10 arası puan verme ve yorum yazma
- **Sohbet**:
  - Genel ve içerik-bazlı herkese açık sohbet odaları (gerçek zamanlı, Socket.io)
  - Kullanıcılar arası birebir özel mesajlaşma (DM)
  - Çevrimiçi durumu gösterimi
- **Yönetici paneli**: Kullanıcı yönetimi (yönetici yap/kaldır, askıya al, sil), yorum moderasyonu, genel istatistikler

## Teknik yapı

- **Backend**: Node.js + Express, `node:sqlite` (Node'un yerleşik SQLite modülü — ekstra derleme gerekmez), JWT auth, Socket.io
- **Frontend**: React (Vite) + Tailwind CSS, react-router-dom, socket.io-client
- Tek parça dağıtım: frontend derlenip `backend/public` klasörüne konur, backend hem API'yi hem statik dosyaları aynı porttan sunar.

> **Not:** Node.js 22.5 veya üzeri gereklidir (yerleşik `node:sqlite` modülü için).

## Kurulum (yerel bilgisayarınızda)

### 1) TMDB API anahtarı alın (ücretsiz)
https://www.themoviedb.org/settings/api adresinden bir hesap açıp API anahtarınızı alın. Jikan (anime) API'si anahtar gerektirmez.

### 2) Backend'i kurun

```bash
cd backend
cp .env.example .env
# .env dosyasını açıp TMDB_API_KEY, JWT_SECRET, ADMIN_EMAIL/ADMIN_PASSWORD alanlarını doldurun
npm install
npm start
```

Sunucu `http://localhost:5000` adresinde açılır ve ilk açılışta `.env` dosyasındaki bilgilerle bir **yönetici hesabı** otomatik oluşturur.

### 3) Frontend'i geliştirme modunda çalıştırın (isteğe bağlı)

Backend zaten derlenmiş `frontend`'i `backend/public` içinden sunar, ama geliştirme sırasında canlı yenileme için:

```bash
cd frontend
npm install
npm run dev
```

`http://localhost:5173` adresinde açılır ve `/api` + `/socket.io` isteklerini otomatik olarak backend'e (5000 portu) yönlendirir.

### 4) Üretim için derleme

```bash
cd frontend
npm run build
```

Bu komut çıktıyı doğrudan `backend/public` klasörüne yazar. Ardından sadece backend'i (`cd backend && npm start`) çalıştırmanız yeterli — tüm site tek bir Node sürecinden sunulur.

## Nereye dağıtabilirsiniz (öneri)

En pratik yol: **Railway** veya **Render** gibi tek servisli Node.js barındırma platformları.

1. Bu klasörü bir GitHub reposuna yükleyin.
2. Railway/Render'da "yeni servis" oluşturup repoyu bağlayın, **root dizini `backend`** olarak ayarlayın.
3. Build komutu: `npm install` — Start komutu: `npm start`
4. Ortam değişkenlerini (.env içeriğini) platformun "Environment Variables" bölümüne girin.
5. Frontend'i yerel bilgisayarınızda `npm run build` ile derleyip `backend/public` klasörünü de repoya dahil edin (ya da build adımını platform tarafında `cd frontend && npm install && npm run build` olarak tanımlayın).
6. **Kalıcı disk**: SQLite dosyası (`backend/data.sqlite`) için platformun "persistent volume/disk" özelliğini `backend` klasörüne bağlayın, aksi halde yeniden dağıtımda veriler sıfırlanabilir.

Vercel gibi "serverless" platformlar sürekli açık soket bağlantısı (Socket.io) ve dosya tabanlı SQLite ile uyumlu değildir — bu yüzden Railway/Render/bir VPS gibi "her zaman açık" bir Node sürecine ihtiyaç var.

## Güvenlik notları

- `.env` dosyanızı asla paylaşmayın veya repoya eklemeyin (`.gitignore` içinde zaten hariç tutulmalı).
- Üretime almadan önce `JWT_SECRET`'ı uzun, rastgele bir değerle değiştirin.
- İlk yönetici şifresini (`ADMIN_PASSWORD`) ilk girişten hemen sonra profil ayarlarından güncelleyin.

## Klasör yapısı

```
cinemaai-social/
  backend/
    server.js          # Express + Socket.io giriş noktası
    db/index.js         # SQLite şeması ve bağlantısı
    routes/              # auth, content (TMDB/Jikan), comments, chat, admin
    socket.js            # gerçek zamanlı sohbet mantığı
    public/              # (derlenmiş frontend buraya kopyalanır)
  frontend/
    src/
      pages/             # Login, Register, Home, ContentDetail, Profile, Admin
      components/        # Navbar, ContentCard, ChatDrawer, FilmstripRating...
      context/           # AuthContext
      lib/               # api.js (axios), socket.js
```
