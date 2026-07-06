'use client';

export default function UpdatesPage() {
  const updates = [
    {
      version: 'v1.0.4',
      date: 'Temmuz 2026',
      title: 'Sosyal Bildirimler ve Arkadaşlık Sistemi',
      changes: [
        'Arkadaşlık isteği kabul/reddetme bildirimlerinde duplicate (çift) gönderim sorunu düzeltildi.',
        'Bildirimler panelinden arkadaşlık isteklerini Kabul Et / Reddet ile doğrudan yanıtlayabilme eklendi.',
        'Arkadaş ekleme penceresi artık backdrop tıklaması ve Escape tuşu ile kapatılabilir.',
        'SSR hydration hataları giderildi: honeyDrip ve particleFloat animasyonları global CSS\'e taşındı.',
      ]
    },
    {
      version: 'v1.0.3',
      date: 'Temmuz 2026',
      title: 'Hata Düzeltmeleri ve Altyapı İyileştirmeleri',
      changes: [
        'Arama sonuçlarında Tümü (All) kategorisinde arama yapıldığında menüde Ana Sayfa butonunun takılı kalması düzeltildi.',
        'Sohbet Sistemi Hatası: "Genel Sohbet" odasının çalışmaması veya odaya girilememesi sorunu çözüldü.',
        'Giriş Ekranı Hatası: Kullanıcı giriş yaptıktan sonra veya kayıt olduktan sonra e-posta ve şifre yazma alanlarının ekranda donup kalması düzeltildi.',
        'Sonsuz Kaydırma (Infinite Scroll) Hatası: Ana sayfada ve Keşfet kısmında sayfa aşağı kaydırıldıkça yeni dizilerin yüklenmemesi sorunu çözüldü.',
        'Arayüz Örtüşme: Mobil görünümlerde Sol çubuk ve Arama çubuğunun örtüşmesi ve daralma problemleri giderildi.'
      ]
    },
    {
      version: 'v1.0.1',
      date: 'Temmuz 2026',
      title: 'Mobil Deneyim ve İyileştirmeler',
      changes: [
        'Profil Butonu ve Menü düzenlendi, mobilde alt menü (bottom nav) aktif edildi.',
        'Mobilde \'Sosyal\' paneli sağ üstteki sarı mesaj balonu ikonuyla açılır hale getirildi.',
        'Menülerde ve butonlarda bal akma ve tıklama (ripple/scale) animasyonları eklendi.',
        'Aktiflik süresindeki "NaNg önce aktif" hatası tamamen giderildi.',
        'Artık herkes kendi profiline de yorum yapabilir.',
        'Yönetici gizliliği eklendi (Adminler kullanıcı aramasında çıkmayacak).',
        'Geliştirici profillerinde artık 🍯🔧 (ballı İngiliz anahtarı) ikonu görünüyor.',
        'Arama altyapısı geliştirilerek "Re zero" gibi özel karakter içermeyen aramalarda bile sonuçlar doğru şekilde çıkarılacak (Fuzzy search).',
        'Arama sonuçları artık popülerliğe göre sıralanıyor.',
        'Takvim kısmına sağ/sol ok tuşlarıyla geçiş özelliği eklendi.',
        'Kayıt olan üyelerin varsayılan rolü member olarak düzeltildi.'
      ]
    }
  ];

  return (
    <div className="flex-1 p-6 md:p-10 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Yenilikler</h1>
        <p className="text-gray-400">Social Cinebee'ye eklenen son özellikler ve güncellemeler.</p>
      </div>

      <div className="space-y-8">
        {updates.map((update, i) => (
          <div key={i} className="bg-ink/50 border border-white/[0.08] rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-honey" />
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-bold text-white">{update.version}</h2>
                  <span className="px-2 py-0.5 bg-honey/10 text-honey text-xs font-semibold rounded-full">{update.date}</span>
                </div>
                <h3 className="text-md text-honey/90">{update.title}</h3>
              </div>
            </div>
            <ul className="space-y-3 mt-6">
              {update.changes.map((change, j) => (
                <li key={j} className="flex gap-3 text-sm text-gray-300 leading-relaxed">
                  <span className="text-honey shrink-0 mt-0.5">✦</span>
                  {change}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
