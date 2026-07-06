🎬 CineBee

«Film • Dizi • Anime keşfet, puanla, yorum yap ve toplulukla sohbet et.»

CineBee, film, dizi ve anime severleri tek platformda buluşturan modern bir sosyal web uygulamasıdır. Gerçek zamanlı sohbet, kullanıcı profilleri, puanlama sistemi ve yönetici paneliyle zengin bir topluluk deneyimi sunar.

---

✨ Özellikler

👤 Kullanıcı Sistemi

- Güvenli kayıt ol & giriş yap
- JWT tabanlı kimlik doğrulama
- Profil yönetimi

🎥 İçerik Keşfi

- TMDB üzerinden film ve diziler
- Jikan (MyAnimeList) üzerinden animeler
- Güncel ve canlı içerik verileri

⭐ Puanlama & Yorumlar

- 1–10 arası puan verme
- Yorum paylaşma
- Topluluk değerlendirmelerini görüntüleme

💬 Gerçek Zamanlı Sohbet

- Genel sohbet odaları
- İçerik bazlı sohbet odaları
- Kullanıcılar arası özel mesajlar (DM)
- Çevrimiçi kullanıcı durumu
- Socket.io destekli anlık mesajlaşma

🛡️ Yönetici Paneli

- Kullanıcı yönetimi
- Yönetici yetkisi verme/kaldırma
- Hesap askıya alma
- Kullanıcı silme
- Yorum moderasyonu
- Sistem istatistikleri

---

🛠️ Teknoloji Yığını

Backend

- Node.js
- Express.js
- node:sqlite
- JWT Authentication
- Socket.io

Frontend

- React (Vite)
- Tailwind CSS
- React Router
- Socket.io Client

«Tek parça dağıtım: Derlenen React uygulaması "backend/public" klasörüne aktarılır ve Express tarafından aynı port üzerinden servis edilir.»

---

📋 Gereksinimler

- Node.js 22.5+
- TMDB API Anahtarı

«Jikan API herhangi bir API anahtarı gerektirmez.»

---

🚀 Kurulum

1️⃣ TMDB API Anahtarı

Ücretsiz API anahtarınızı alın:

https://www.themoviedb.org/settings/api

---

2️⃣ Backend

cd backend
cp .env.example .env

npm install
npm start

".env" dosyasında aşağıdaki alanları doldurun:

- TMDB_API_KEY
- JWT_SECRET
- ADMIN_EMAIL
- ADMIN_PASSWORD

Sunucu:

http://localhost:5000

İlk çalıştırmada yönetici hesabı otomatik oluşturulur.

---

3️⃣ Frontend (Geliştirme)

cd frontend

npm install
npm run dev

Adres:

http://localhost:5173

Vite geliştirme sunucusu API ve Socket.io isteklerini otomatik olarak backend'e yönlendirir.

---

4️⃣ Production Build

cd frontend
npm run build

Derlenen dosyalar otomatik olarak:

backend/public

klasörüne aktarılır.

Daha sonra yalnızca:

cd backend
npm start

komutunu çalıştırmanız yeterlidir.

---

☁️ Dağıtım

Önerilen platformlar:

- Railway
- Render
- VPS

Kurulum Adımları

1. Projeyi GitHub'a yükleyin.
2. Yeni Node.js servisi oluşturun.
3. Root dizini "backend" olarak ayarlayın.
4. Environment Variables bölümüne ".env" değerlerini girin.
5. Frontend'i derleyip "backend/public" klasörünü oluşturun.
6. SQLite veritabanı için kalıcı disk (Persistent Volume) bağlayın.

«Not: Vercel gibi serverless platformlar Socket.io ve SQLite ile tam uyumlu değildir.»

---

🔒 Güvenlik

- ".env" dosyasını GitHub'a yüklemeyin.
- Güçlü ve rastgele bir "JWT_SECRET" kullanın.
- İlk yönetici şifresini giriş yaptıktan sonra değiştirin.
- "backend/data.sqlite" dosyasını düzenli olarak yedekleyin.

---

📂 Proje Yapısı

cinebee/
│
├── backend/
│   ├── server.js
│   ├── socket.js
│   ├── db/
│   ├── routes/
│   └── public/
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── context/
    │   └── lib/

---

❤️ CineBee

Tek platformda keşfet, puanla, yorum yap ve topluluğa katıl.

🍿 Film severler
📺 Dizi tutkunları
🌸 Anime hayranları

Hepsi artık CineBee'de.