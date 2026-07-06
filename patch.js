const { mongoose, User, Post } = require('./backend/db/index.js');

async function run() {
  setTimeout(async () => {
    try {
      const admin = await User.findOne({ role: 'admin' });
      if (!admin) {
        console.log('No admin found');
        process.exit(0);
      }
      await Post.create({
        user_id: admin._id,
        body: `🎉 **YENİ GÜNCELLEME (v1.0.1)** 🎉\n\n- Profil Butonu ve Menü düzenlendi, mobilde alt menü (bottom nav) aktif edildi.\n- Mobilde 'Sosyal' paneli sağ üstteki sarı mesaj balonu ikonuyla açılır hale getirildi.\n- Menülerde ve butonlarda bal akma ve tıklama (ripple/scale) animasyonları eklendi!\n- Aktiflik süresindeki NaN hatası giderildi.\n- Artık herkes kendi profiline de yorum yapabilir.\n- Yönetici gizliliği eklendi (Adminler aramasında çıkmayacak).\n- Geliştirici profilinde artık 🍯🔧 (ballı ingiliz anahtarı) ikonu görünüyor!`,
        status: 'published'
      });
      console.log('Patch notes published!');
    } catch (err) {
      console.error(err);
    }
    process.exit(0);
  }, 1000);
}
run();
