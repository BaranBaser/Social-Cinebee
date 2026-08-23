export interface ContentItem {
  key: string;
  type: 'movie' | 'tv' | 'anime';
  title: string;
  original_title?: string;
  tagline?: string;
  poster: string | null;
  backdrop?: string | null;
  rating: number;
  year: string;
  overview?: string;
  status?: string;
  duration?: number | null;
  genres?: string[];
  number_of_seasons?: number | null;
  number_of_episodes?: number | null;
  trailer?: string | null;
  credits?: { cast: { name: string; character: string; image: string | null }[] };
  characters?: { name: string; role: string; image: string | null }[];
  categories: string[];
}

export const ALL_CONTENT: ContentItem[] = [
  // =========================================================================
  // 🎬 FİLMLER (MOVIES) - 2024-2026 GÜNCEL & EFSANE LİSTE
  // =========================================================================
  
  // --- POPÜLER (POPULAR NOW) ---
  {
    key: 'movie-533535',
    type: 'movie',
    title: 'Deadpool & Wolverine',
    original_title: 'Deadpool & Wolverine',
    tagline: 'Herkes mutlu bir sonu hak eder.',
    overview: 'TVA tarafından göreve çağrılan umutsuz Wade Wilson, çoklu evrenin tehlikeye girmesiyle birlikte isteksiz bir Wolverine ile güçlerini birleştirmek zorunda kalır.',
    poster: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg',
    rating: 8.0,
    year: '2024',
    duration: 128,
    genres: ['Aksiyon', 'Komedi', 'Bilim-Kurgu'],
    status: 'Released',
    trailer: 'https://www.youtube.com/watch?v=73_1biulkYk',
    categories: ['popular'],
    credits: {
      cast: [
        { name: 'Ryan Reynolds', character: 'Wade Wilson / Deadpool', image: 'https://image.tmdb.org/t/p/w185/h1coResolution.jpg' },
        { name: 'Hugh Jackman', character: 'Logan / Wolverine', image: 'https://image.tmdb.org/t/p/w185/4XujResolution.jpg' },
        { name: 'Emma Corrin', character: 'Cassandra Nova', image: null }
      ]
    }
  },
  {
    key: 'movie-693134',
    type: 'movie',
    title: 'Dune: Çöl Gezegeni Bölüm İki',
    original_title: 'Dune: Part Two',
    tagline: 'Kader bir lider gerektirir.',
    overview: 'Paul Atreides, ailesini yok eden komploculara karşı intikam arayışındayken Chani ve Fremenlerle güçlerini birleştirir. Evrenin kaderi ile aşkı arasında seçim yapmak zorundadır.',
    poster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s5hj0x2.jpg',
    rating: 8.8,
    year: '2024',
    duration: 166,
    genres: ['Bilim-Kurgu', 'Macera', 'Aksiyon'],
    status: 'Released',
    trailer: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    categories: ['popular', 'most_watched'],
    credits: {
      cast: [
        { name: 'Timothée Chalamet', character: 'Paul Atreides', image: null },
        { name: 'Zendaya', character: 'Chani', image: null },
        { name: 'Austin Butler', character: 'Feyd-Rautha', image: null }
      ]
    }
  },
  {
    key: 'movie-1022789',
    type: 'movie',
    title: 'Ters Yüz 2 (Inside Out 2)',
    original_title: 'Inside Out 2',
    tagline: 'Yeni duygulara yer açın.',
    overview: 'Artık bir ergen olan Riley\'nin zihin merkezinde ani bir tadilat başlar ve beklenmedik yeni duygular içeri girer: Kaygı, Gıpta, Utanç ve Bıkkınlık!',
    poster: 'https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/xg27NrXi7EgDXUrHVOf7Y8i9Ce8.jpg',
    rating: 8.1,
    year: '2024',
    duration: 96,
    genres: ['Animasyon', 'Aile', 'Macera', 'Komedi'],
    status: 'Released',
    trailer: 'https://www.youtube.com/watch?v=LEjhY15eCx0',
    categories: ['popular'],
    credits: {
      cast: [
        { name: 'Amy Poehler', character: 'Joy (Neşe) (ses)', image: null },
        { name: 'Maya Hawke', character: 'Anxiety (Kaygı) (ses)', image: null }
      ]
    }
  },
  {
    key: 'movie-945961',
    type: 'movie',
    title: 'Alien: Romulus',
    original_title: 'Alien: Romulus',
    tagline: 'Uzayda kimse çığlığınızı duyamaz.',
    overview: 'Terk edilmiş bir uzay istasyonunun derinliklerini temizleyen bir grup genç uzay kolonisti, evrendeki en korkunç yaşam formuyla yüz yüze gelir.',
    poster: 'https://image.tmdb.org/t/p/w500/b33nnKl1GSFbao4l3fZDDqsMx0F.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/9SSEUrSqhljBMzRe4aBTh17rUaC.jpg',
    rating: 7.9,
    year: '2024',
    duration: 119,
    genres: ['Korku', 'Bilim-Kurgu', 'Gerilim'],
    status: 'Released',
    trailer: 'https://www.youtube.com/watch?v=x0XDEhP4MQs',
    categories: ['popular'],
    credits: {
      cast: [
        { name: 'Cailee Spaeny', character: 'Rain Carradine', image: null },
        { name: 'David Jonsson', character: 'Andy', image: null }
      ]
    }
  },
  {
    key: 'movie-573435',
    type: 'movie',
    title: 'Bad Boys: Ya Hep Ya Hiç',
    original_title: 'Bad Boys: Ride or Die',
    tagline: 'Miami\'nin en çılgın polisleri geri döndü.',
    overview: 'Miami polisleri Mike Lowrey ve Marcus Burnett, merhum yüzbaşıları Conrad Howard\'ın uyuşturucu kartelleriyle bağlantılı olduğu suçlamasıyla kaçak durumuna düşer.',
    poster: 'https://image.tmdb.org/t/p/w500/nP6RliHjxsz4irTKsxe8FRhKZYl.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/ga4OLm4qLxOqRkJx0Q1f.jpg',
    rating: 7.5,
    year: '2024',
    duration: 115,
    genres: ['Aksiyon', 'Komedi', 'Suç'],
    status: 'Released',
    trailer: 'https://www.youtube.com/watch?v=hRFY_Fesa9Q',
    categories: ['popular'],
    credits: {
      cast: [
        { name: 'Will Smith', character: 'Detective Mike Lowrey', image: null },
        { name: 'Martin Lawrence', character: 'Detective Marcus Burnett', image: null }
      ]
    }
  },
  {
    key: 'movie-823464',
    type: 'movie',
    title: 'Godzilla ve Kong: Yeni İmparatorluk',
    original_title: 'Godzilla x Kong: The New Empire',
    tagline: 'Birlikte hükmedecekler ya da yok olacaklar.',
    overview: 'Kong ve Godzilla, dünyamızda gizlenen ve hem kendi varlıklarını hem de insanlığı tehdit eden devasa, keşfedilmemiş bir tehditle yüzleşmek zorundadır.',
    poster: 'https://image.tmdb.org/t/p/w500/bQ2ywkchIiaKLSEaMrcT6e29f91.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/qrGtVFxaD8c7et0j3hxY14.jpg',
    rating: 7.3,
    year: '2024',
    duration: 115,
    genres: ['Aksiyon', 'Bilim-Kurgu', 'Macera'],
    status: 'Released',
    trailer: 'https://www.youtube.com/watch?v=lV1OOlGwExg',
    categories: ['popular'],
    credits: {
      cast: [
        { name: 'Rebecca Hall', character: 'Dr. Ilene Andrews', image: null },
        { name: 'Brian Tyree Henry', character: 'Bernie Hayes', image: null }
      ]
    }
  },

  // --- TREND (TRENDING THIS WEEK) ---
  {
    key: 'movie-933260',
    type: 'movie',
    title: 'Cevher (The Substance)',
    original_title: 'The Substance',
    tagline: 'Kendinizin daha iyi bir versiyonunu hayal edin.',
    overview: 'Gözden düşen eski bir ünlü yıldız, hücre bölünmesini hızlandırarak kendisinin daha genç, daha güzel ve daha mükemmel bir versiyonunu yaratan gizemli bir karaborsa ilacını dener.',
    poster: 'https://image.tmdb.org/t/p/w500/lqoMzCcZYEFK729Fc6rRII1ukMt.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/7h65Np3zChgQFiWdpzKdbL5Fcwt.jpg',
    rating: 7.9,
    year: '2024',
    duration: 141,
    genres: ['Korku', 'Dram', 'Bilim-Kurgu'],
    status: 'Released',
    trailer: 'https://www.youtube.com/watch?v=LNlrGhPBNKc',
    categories: ['trending'],
    credits: {
      cast: [
        { name: 'Demi Moore', character: 'Elisabeth Sparkle', image: null },
        { name: 'Margaret Qualley', character: 'Sue', image: null },
        { name: 'Dennis Quaid', character: 'Harvey', image: null }
      ]
    }
  },
  {
    key: 'movie-1184918',
    type: 'movie',
    title: 'Vahşi Robot (The Wild Robot)',
    original_title: 'The Wild Robot',
    tagline: 'Bazen hayatta kalmak için programlandığınız şeyden fazlası olmalısınız.',
    overview: 'Issız bir adaya düşen ROZZUM ünitesi 7134 ("Roz"), adadaki vahşi hayvanlarla bağ kurarak ve yetim kalmış bir yavru kazı büyüterek çevreye uyum sağlamayı öğrenir.',
    poster: 'https://image.tmdb.org/t/p/w500/wTnV3PCVW5O92JMrFvvrRcV39RU.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/mQZJoIhTE5Zc.jpg',
    rating: 8.6,
    year: '2024',
    duration: 102,
    genres: ['Animasyon', 'Bilim-Kurgu', 'Aile', 'Macera'],
    status: 'Released',
    trailer: 'https://www.youtube.com/watch?v=67vbA5ZJdKQ',
    categories: ['trending'],
    credits: {
      cast: [
        { name: 'Lupita Nyong\'o', character: 'Roz (ses)', image: null },
        { name: 'Pedro Pascal', character: 'Fink (ses)', image: null }
      ]
    }
  },
  {
    key: 'movie-762441',
    type: 'movie',
    title: 'Sessiz Bir Yer: Birinci Gün',
    original_title: 'A Quiet Place: Day One',
    tagline: 'Dünyanın sessizleştiği günü keşfedin.',
    overview: 'Sesle avlanan kör uzaylı yaratıkların New York City\'yi ilk işgal ettiği kaotik günde Samira adında genç bir kadının hayatta kalma mücadelesi.',
    poster: 'https://image.tmdb.org/t/p/w500/hU1Q9YVzdYwhv9tw97U1a2.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/2RVcJbWFmICSD6KdZ.jpg',
    rating: 7.2,
    year: '2024',
    duration: 99,
    genres: ['Korku', 'Bilim-Kurgu', 'Gerilim'],
    status: 'Released',
    trailer: 'https://www.youtube.com/watch?v=YPY7J-flzE8',
    categories: ['trending'],
    credits: {
      cast: [
        { name: 'Lupita Nyong\'o', character: 'Samira', image: null },
        { name: 'Joseph Quinn', character: 'Eric', image: null }
      ]
    }
  },
  {
    key: 'movie-917496',
    type: 'movie',
    title: 'Beterböcek Beterböcek (Beetlejuice Beetlejuice)',
    original_title: 'Beetlejuice Beetlejuice',
    tagline: 'Meyve suyu yine sıkıldı.',
    overview: 'Deetz ailesi bir trajedinin ardından eve geri döner. Lydia\'nın asi kızı Astrid\'in tavan arasındaki kasaba maketini keşfetmesiyle öbür dünyaya açılan kapı tekrar aralanır.',
    poster: 'https://image.tmdb.org/t/p/w500/kKgQzkUCUm0nGxL3h4h1n.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/xi8p.jpg',
    rating: 7.3,
    year: '2024',
    duration: 104,
    genres: ['Komedi', 'Fantastik', 'Korku'],
    status: 'Released',
    trailer: 'https://www.youtube.com/watch?v=As-vKW4ZboU',
    categories: ['trending'],
    credits: {
      cast: [
        { name: 'Michael Keaton', character: 'Beetlejuice', image: null },
        { name: 'Winona Ryder', character: 'Lydia Deetz', image: null },
        { name: 'Jenna Ortega', character: 'Astrid Deetz', image: null }
      ]
    }
  },
  {
    key: 'movie-929590',
    type: 'movie',
    title: 'İç Savaş (Civil War)',
    original_title: 'Civil War',
    tagline: 'Tüm imparatorluklar çöker.',
    overview: 'Yakın gelecekte distopik bir iç savaşa sürüklenen Amerika\'da, bir grup askeri savaş muhabiri Washington D.C.\'ye ulaşmak için zamanla yarışır.',
    poster: 'https://image.tmdb.org/t/p/w500/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/z12CguXqckoLN9K.jpg',
    rating: 7.4,
    year: '2024',
    duration: 109,
    genres: ['Aksiyon', 'Dram', 'Savaş'],
    status: 'Released',
    trailer: 'https://www.youtube.com/watch?v=aDyQxtg0V2w',
    categories: ['trending'],
    credits: {
      cast: [
        { name: 'Kirsten Dunst', character: 'Lee Smith', image: null },
        { name: 'Wagner Moura', character: 'Joel', image: null }
      ]
    }
  },
  {
    key: 'movie-786892',
    type: 'movie',
    title: 'Furiosa: Bir Mad Max Destanı',
    original_title: 'Furiosa: A Mad Max Saga',
    tagline: 'Öfkeni serbest bırak.',
    overview: 'Genç Furiosa, Nice Annelerin Yeşil Diyarı\'ndan kaçırılır ve Dementus liderliğindeki büyük bir Motorcu Çetesi\'nin eline düşer.',
    poster: 'https://image.tmdb.org/t/p/w500/iADOJ8Zymht2JPMoy3R7xUMZ51.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/wNAhuOZ3Zf88J3.jpg',
    rating: 7.8,
    year: '2024',
    duration: 148,
    genres: ['Aksiyon', 'Macera', 'Bilim-Kurgu'],
    status: 'Released',
    trailer: 'https://www.youtube.com/watch?v=XJMuhwVlca4',
    categories: ['trending'],
    credits: {
      cast: [
        { name: 'Anya Taylor-Joy', character: 'Imperator Furiosa', image: null },
        { name: 'Chris Hemsworth', character: 'Warlord Dementus', image: null }
      ]
    }
  },

  // --- YENİ EKLENENLER (NEW RELEASES 2024-2026) ---
  {
    key: 'movie-558449',
    type: 'movie',
    title: 'Gladyatör II (Gladiator II)',
    original_title: 'Gladiator II',
    tagline: 'Küllerinden yeniden doğan bir imparatorluk.',
    overview: 'Maximus\'un ölümünden yıllar sonra, Lucilla\'nın oğlu Lucius, Roma\'nın tiran imparatorlarına karşı Kolezyum arenasında özgürlük savaşı verir.',
    poster: 'https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/euYIwmwkmz95mnXvufwnb9.jpg',
    rating: 7.7,
    year: '2024',
    duration: 148,
    genres: ['Aksiyon', 'Dram', 'Macera', 'Tarih'],
    status: 'Released',
    trailer: 'https://www.youtube.com/watch?v=4rgYUipGJNo',
    categories: ['new'],
    credits: {
      cast: [
        { name: 'Paul Mescal', character: 'Lucius Verus', image: null },
        { name: 'Denzel Washington', character: 'Macrinus', image: null },
        { name: 'Pedro Pascal', character: 'Marcus Acacius', image: null }
      ]
    }
  },
  {
    key: 'movie-889737',
    type: 'movie',
    title: 'Joker: İkili Delilik (Joker: Folie à Deux)',
    original_title: 'Joker: Folie à Deux',
    tagline: 'Dünya artık bir sahne.',
    overview: 'Arthur Fleck, Arkham Eyalet Hastanesi\'nde yargılanmayı beklerken gerçek aşkı Harley Quinn ve içindeki müziği keşfeder.',
    poster: 'https://image.tmdb.org/t/p/w500/aciP8Km0waTLsq1ovJnIhXU966m.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/v9acaNu.jpg',
    rating: 6.8,
    year: '2024',
    duration: 138,
    genres: ['Dram', 'Suç', 'Gerilim', 'Müzik'],
    status: 'Released',
    trailer: 'https://www.youtube.com/watch?v=_OKAwz2NiOI',
    categories: ['new'],
    credits: {
      cast: [
        { name: 'Joaquin Phoenix', character: 'Arthur Fleck / Joker', image: null },
        { name: 'Lady Gaga', character: 'Harleen Quinzel / Harley Quinn', image: null }
      ]
    }
  },
  {
    key: 'movie-402431',
    type: 'movie',
    title: 'Wicked',
    original_title: 'Wicked',
    tagline: 'Oz\'un bilinmeyen hikayesi.',
    overview: 'Yeşil tenli ve yanlış anlaşılan Elphaba ile popüler ve ayrıcalıklı Glinda\'nın Shiz Üniversitesi\'ndeki dostlukları ve kaderlerinin ayrılışı.',
    poster: 'https://image.tmdb.org/t/p/w500/xDGbZ0JJ3mYaGKy4Nzd9K.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/uKb22EJ.jpg',
    rating: 8.0,
    year: '2024',
    duration: 160,
    genres: ['Dram', 'Fantastik', 'Müzikal'],
    status: 'Released',
    trailer: 'https://www.youtube.com/watch?v=6COmYeLsz4c',
    categories: ['new'],
    credits: {
      cast: [
        { name: 'Cynthia Erivo', character: 'Elphaba Thropp', image: null },
        { name: 'Ariana Grande', character: 'Glinda Upland', image: null }
      ]
    }
  },
  {
    key: 'movie-1241982',
    type: 'movie',
    title: 'Moana 2',
    original_title: 'Moana 2',
    tagline: 'Okyanus tekrar çağırıyor.',
    overview: 'Moana, atalarından gelen beklenmedik bir çağrının ardından Okyanusya\'nın tehlikeli ve kayıp sularına doğru yeni bir maceraya yelken açar.',
    poster: 'https://image.tmdb.org/t/p/w500/aLVkiINl0.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/vYTGf.jpg',
    rating: 7.5,
    year: '2024',
    duration: 100,
    genres: ['Animasyon', 'Macera', 'Aile', 'Komedi'],
    status: 'Released',
    trailer: 'https://www.youtube.com/watch?v=hDZ7y8RP5HE',
    categories: ['new'],
    credits: {
      cast: [
        { name: 'Auli\'i Cravalho', character: 'Moana (ses)', image: null },
        { name: 'Dwayne Johnson', character: 'Maui (ses)', image: null }
      ]
    }
  },
  {
    key: 'movie-426063',
    type: 'movie',
    title: 'Nosferatu',
    original_title: 'Nosferatu',
    tagline: 'Karanlık geliyor.',
    overview: 'Genç bir kadın ile ona aşık olan antik bir Transilvanya vampiri arasındaki takıntı ve dehşet dolu gotik bir korku hikayesi.',
    poster: 'https://image.tmdb.org/t/p/w500/5qHoAZZiaLeUb.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/1wP.jpg',
    rating: 7.8,
    year: '2024',
    duration: 132,
    genres: ['Korku', 'Gizem', 'Fantastik'],
    status: 'Released',
    trailer: 'https://www.youtube.com/watch?v=nulvWqYUM8k',
    categories: ['new'],
    credits: {
      cast: [
        { name: 'Bill Skarsgård', character: 'Count Orlok', image: null },
        { name: 'Lily-Rose Depp', character: 'Ellen Hutter', image: null },
        { name: 'Nicholas Hoult', character: 'Thomas Hutter', image: null }
      ]
    }
  },
  {
    key: 'movie-718821',
    type: 'movie',
    title: 'Kasırgalar (Twisters)',
    original_title: 'Twisters',
    tagline: 'Fırtınayı kovalamayın. Ona hükmedin.',
    overview: 'Geçmişte yaşadığı fırtına travmasını geride bırakmaya çalışan Kate ve pervasız sosyal medya fenomeni Tyler, Oklahoma\'da devasa kasırgalarla savaşır.',
    poster: 'https://image.tmdb.org/t/p/w500/pjnD08FlMAIXsfOLKQbvmO0f0MD.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/58D.jpg',
    rating: 7.2,
    year: '2024',
    duration: 122,
    genres: ['Aksiyon', 'Macera', 'Gerilim'],
    status: 'Released',
    trailer: 'https://www.youtube.com/watch?v=Jb8S9z5m9Hk',
    categories: ['new'],
    credits: {
      cast: [
        { name: 'Daisy Edgar-Jones', character: 'Kate Carter', image: null },
        { name: 'Glen Powell', character: 'Tyler Owens', image: null }
      ]
    }
  },

  // --- EN YÜKSEK PUANLILAR (TOP RATED CLASSICS) ---
  {
    key: 'movie-872585',
    type: 'movie',
    title: 'Oppenheimer',
    original_title: 'Oppenheimer',
    tagline: 'Dünya sonsuza dek değişti.',
    overview: 'J. Robert Oppenheimer\'ın Manhattan Projesi liderliğindeki atom bombasının geliştirilme sürecini ve sonrasında yaşadığı ahlaki ve politik sınavı konu alıyor.',
    poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    rating: 8.9,
    year: '2023',
    duration: 180,
    genres: ['Dram', 'Tarih', 'Biyografi'],
    status: 'Released',
    trailer: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
    categories: ['top_rated', 'most_watched'],
    credits: {
      cast: [
        { name: 'Cillian Murphy', character: 'J. Robert Oppenheimer', image: null },
        { name: 'Emily Blunt', character: 'Katherine Oppenheimer', image: null },
        { name: 'Robert Downey Jr.', character: 'Lewis Strauss', image: null }
      ]
    }
  },
  {
    key: 'movie-157336',
    type: 'movie',
    title: 'Yıldızlararası (Interstellar)',
    original_title: 'Interstellar',
    tagline: 'İnsanlığın sonu bizim sonumuz olmak zorunda değil.',
    overview: 'İnsanlığın tükenme tehlikesiyle karşı karşıya olduğu bir gelecekte, bir grup kaşif insanlık için yeni bir yuva bulmak amacıyla bir solucan deliğinden geçer.',
    poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
    rating: 8.7,
    year: '2014',
    duration: 169,
    genres: ['Bilim-Kurgu', 'Dram', 'Macera'],
    status: 'Released',
    trailer: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    categories: ['top_rated', 'most_watched'],
    credits: {
      cast: [
        { name: 'Matthew McConaughey', character: 'Cooper', image: null },
        { name: 'Anne Hathaway', character: 'Brand', image: null }
      ]
    }
  },
  {
    key: 'movie-155',
    type: 'movie',
    title: 'Kara Şövalye (The Dark Knight)',
    original_title: 'The Dark Knight',
    tagline: 'Kaosun dünyasında tek kural hayatta kalmaktır.',
    overview: 'Batman, Teğmen Gordon ve Harvey Dent yardımıyla Gotham sokaklarını suçtan arındırmaya başlar. Ancak Joker\'in ortaya çıkışı şehri dehşete sürükler.',
    poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg',
    rating: 9.0,
    year: '2008',
    duration: 152,
    genres: ['Aksiyon', 'Suç', 'Dram'],
    status: 'Released',
    trailer: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    categories: ['top_rated', 'most_watched'],
    credits: {
      cast: [
        { name: 'Christian Bale', character: 'Bruce Wayne / Batman', image: null },
        { name: 'Heath Ledger', character: 'Joker', image: null }
      ]
    }
  },
  {
    key: 'movie-27205',
    type: 'movie',
    title: 'Başlangıç (Inception)',
    original_title: 'Inception',
    tagline: 'Zihniniz suç mahallidir.',
    overview: 'Dom Cobb, insanların rüyalarından bilinçaltı sırlarını çalan çok yetenekli bir hırsızdır.',
    poster: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/8ZTVqvKDQ8emSGUEMjsS4yR84zT.jpg',
    rating: 8.8,
    year: '2010',
    duration: 148,
    genres: ['Bilim-Kurgu', 'Aksiyon', 'Macera'],
    status: 'Released',
    trailer: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    categories: ['top_rated'],
    credits: {
      cast: [
        { name: 'Leonardo DiCaprio', character: 'Dom Cobb', image: null },
        { name: 'Joseph Gordon-Levitt', character: 'Arthur', image: null }
      ]
    }
  },
  {
    key: 'movie-278',
    type: 'movie',
    title: 'Esaretin Bedeli (The Shawshank Redemption)',
    original_title: 'The Shawshank Redemption',
    tagline: 'Korku sizi tutsak eder, umut ise özgür kılar.',
    overview: 'İşlemediği bir cinayetten ötürü hapse mahkum edilen bankacı Andy Dufresne, hapishanede umudu ve dostluğu canlı tutar.',
    poster: 'https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
    rating: 9.3,
    year: '1994',
    duration: 142,
    genres: ['Dram', 'Suç'],
    status: 'Released',
    trailer: 'https://www.youtube.com/watch?v=PLl99DlL6b4',
    categories: ['top_rated'],
    credits: {
      cast: [
        { name: 'Tim Robbins', character: 'Andy Dufresne', image: null },
        { name: 'Morgan Freeman', character: 'Red', image: null }
      ]
    }
  },
  {
    key: 'movie-238',
    type: 'movie',
    title: 'Baba (The Godfather)',
    original_title: 'The Godfather',
    tagline: 'Reddedemeyeceği bir teklif yapacağım.',
    overview: 'New York\'ta hüküm süren bir mafya ailesinin yaşlanan lideri Don Vito Corleone, kontrolü oğlu Michael\'a devreder.',
    poster: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/tmU7GeKVybMWFButWEGl2M4GeiP.jpg',
    rating: 9.2,
    year: '1972',
    duration: 175,
    genres: ['Dram', 'Suç'],
    status: 'Released',
    trailer: 'https://www.youtube.com/watch?v=sY1S34973zA',
    categories: ['top_rated'],
    credits: {
      cast: [
        { name: 'Marlon Brando', character: 'Don Vito Corleone', image: null },
        { name: 'Al Pacino', character: 'Michael Corleone', image: null }
      ]
    }
  },

  // =========================================================================
  // 📺 DİZİLER (TV SERIES) - 2024-2026 GÜNCEL & EFSANE LİSTE
  // =========================================================================

  // --- POPÜLER DİZİLER (POPULAR NOW) ---
  {
    key: 'tv-126308',
    type: 'tv',
    title: 'Şogun (Shōgun)',
    original_title: 'Shōgun',
    tagline: 'Kader kılıcın ucundadır.',
    overview: '1600 yılında feodal Japonya\'da iç savaşın eşiğinde, Lord Toranaga ölümcül düşmanlarına karşı savaşırken gizemli bir Avrupa gemisi kıyılarına vurur.',
    poster: 'https://image.tmdb.org/t/p/w500/7O4iVfOMQmdCSPx7DYGvx2m08i.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/zW0v2YT7x.jpg',
    rating: 8.9,
    year: '2024',
    duration: 60,
    number_of_seasons: 1,
    number_of_episodes: 10,
    genres: ['Dram', 'Tarih', 'Savaş'],
    status: 'Returning Series',
    trailer: 'https://www.youtube.com/watch?v=yAN5uspAoT4',
    categories: ['popular', 'most_watched'],
    credits: {
      cast: [
        { name: 'Hiroyuki Sanada', character: 'Lord Yoshii Toranaga', image: null },
        { name: 'Cosmo Jarvis', character: 'John Blackthorne', image: null },
        { name: 'Anna Sawai', character: 'Toda Mariko', image: null }
      ]
    }
  },
  {
    key: 'tv-106379',
    type: 'tv',
    title: 'Fallout',
    original_title: 'Fallout',
    tagline: 'Kıyamet sonrası dünyaya hoş geldiniz.',
    overview: 'Nükleer kıyametten 200 yıl sonra lüks sığınaklarında yaşayan barışçıl insanlar, yukarıdaki inanılmaz derecede karmaşık ve vahşi dünyaya adım atmak zorunda kalır.',
    poster: 'https://image.tmdb.org/t/p/w500/AnsSKR9LuK0T9bAILVaipUt3q39.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/nQhK8.jpg',
    rating: 8.6,
    year: '2024',
    duration: 60,
    number_of_seasons: 2,
    number_of_episodes: 16,
    genres: ['Bilim-Kurgu', 'Aksiyon', 'Macera'],
    status: 'Returning Series',
    trailer: 'https://www.youtube.com/watch?v=V-mugKDQDlg',
    categories: ['popular'],
    credits: {
      cast: [
        { name: 'Ella Purnell', character: 'Lucy MacLean', image: null },
        { name: 'Walton Goggins', character: 'The Ghoul / Cooper Howard', image: null }
      ]
    }
  },
  {
    key: 'tv-94997',
    type: 'tv',
    title: 'Ejderha Evi (House of the Dragon)',
    original_title: 'House of the Dragon',
    tagline: 'Ateş ve kan.',
    overview: 'Targaryen hanedanının yükselişini ve iç çatışmalarla bölünerek ejderhaların dansına sürüklendiği destansı dönemi konu alır.',
    poster: 'https://image.tmdb.org/t/p/w500/7QMsOTMUswv0oZw4rBpsTv5w5n.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/etj5.jpg',
    rating: 8.7,
    year: '2024',
    duration: 65,
    number_of_seasons: 2,
    number_of_episodes: 18,
    genres: ['Dram', 'Fantastik', 'Aksiyon'],
    status: 'Returning Series',
    trailer: 'https://www.youtube.com/watch?v=DotnJ7tTA34',
    categories: ['popular', 'most_watched'],
    credits: {
      cast: [
        { name: 'Emma D\'Arcy', character: 'Rhaenyra Targaryen', image: null },
        { name: 'Matt Smith', character: 'Daemon Targaryen', image: null }
      ]
    }
  },
  {
    key: 'tv-76479',
    type: 'tv',
    title: 'The Boys Sezon 4',
    original_title: 'The Boys',
    tagline: 'Asla kahramanlarınızla tanışmayın.',
    overview: 'Dünya uçurumun kenarındadır. Victoria Neuman Oval Ofis\'e yaklaşırken Homelander gücünü pekiştirir.',
    poster: 'https://image.tmdb.org/t/p/w500/2zmTZrHGoxjggqCjD6F9c.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/7k2.jpg',
    rating: 8.8,
    year: '2024',
    duration: 60,
    number_of_seasons: 4,
    number_of_episodes: 32,
    genres: ['Bilim-Kurgu', 'Aksiyon', 'Komedi', 'Dram'],
    status: 'Returning Series',
    trailer: 'https://www.youtube.com/watch?v=EzFXDvC-u30',
    categories: ['popular'],
    credits: {
      cast: [
        { name: 'Karl Urban', character: 'Billy Butcher', image: null },
        { name: 'Antony Starr', character: 'Homelander', image: null }
      ]
    }
  },
  {
    key: 'tv-124834',
    type: 'tv',
    title: 'The Penguin',
    original_title: 'The Penguin',
    tagline: 'Gotham\'ın yeraltı dünyası el değiştiriyor.',
    overview: 'Carmine Falcone\'un ölümünün ardından Oz Cobb (Penguen), Gotham City\'nin suç imparatorluğunun kontrolünü ele geçirmek için hamle yapar.',
    poster: 'https://image.tmdb.org/t/p/w500/vOWOuRkF7A6dC9mB3uN.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/kC1.jpg',
    rating: 8.8,
    year: '2024',
    duration: 55,
    number_of_seasons: 1,
    number_of_episodes: 8,
    genres: ['Suç', 'Dram'],
    status: 'Ended',
    trailer: 'https://www.youtube.com/watch?v=sfJG6hDCfec',
    categories: ['popular'],
    credits: {
      cast: [
        { name: 'Colin Farrell', character: 'Oz Cobb / The Penguin', image: null },
        { name: 'Cristin Milioti', character: 'Sofia Falcone', image: null }
      ]
    }
  },
  {
    key: 'tv-94605',
    type: 'tv',
    title: 'Arcane Sezon 2',
    original_title: 'Arcane',
    tagline: 'İki şehir, iki kardeş, tek bir kader.',
    overview: 'Ütopik Piltover ile ezilen Zaun arasındaki savaş patlak verirken Vi ve Jinx karşı saflarda ölümcül bir yüzleşmeye doğru sürüklenir.',
    poster: 'https://image.tmdb.org/t/p/w500/fqldf2t8ztc9aiwn396mlX3Yq1m.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/hPe0F1K6X1P2pXnQ6tT4.jpg',
    rating: 9.1,
    year: '2024',
    duration: 40,
    number_of_seasons: 2,
    number_of_episodes: 18,
    genres: ['Animasyon', 'Aksiyon', 'Macera', 'Fantastik'],
    status: 'Returning Series',
    trailer: 'https://www.youtube.com/watch?v=fXmAurh012s',
    categories: ['popular', 'top_rated'],
    credits: {
      cast: [
        { name: 'Hailee Steinfeld', character: 'Vi (ses)', image: null },
        { name: 'Ella Purnell', character: 'Jinx (ses)', image: null }
      ]
    }
  },

  // --- TREND DİZİLER (TRENDING) ---
  {
    key: 'tv-100088',
    type: 'tv',
    title: 'The Last of Us Sezon 2',
    original_title: 'The Last of Us',
    tagline: 'Karanlıkta kaybolduğunda ışığı ara.',
    overview: 'Modern uygarlığın çöküşünden yirmi yıl sonra Joel ve Ellie, yeni tehditler ve acımasız intikam döngüsüyle karşı karşıya kalır.',
    poster: 'https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2V7JMrne.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg',
    rating: 8.8,
    year: '2025',
    duration: 55,
    number_of_seasons: 2,
    number_of_episodes: 16,
    genres: ['Dram', 'Aksiyon', 'Macera', 'Bilim-Kurgu'],
    status: 'Returning Series',
    trailer: 'https://www.youtube.com/watch?v=uLtkt8BonwM',
    categories: ['trending'],
    credits: {
      cast: [
        { name: 'Pedro Pascal', character: 'Joel Miller', image: null },
        { name: 'Bella Ramsey', character: 'Ellie Williams', image: null }
      ]
    }
  },
  {
    key: 'tv-93405',
    type: 'tv',
    title: 'Ayrılık (Severance Sezon 2)',
    original_title: 'Severance',
    tagline: 'İş ve özel hayatınızı tamamen ayırmaya cesaretiniz var mı?',
    overview: 'Lumon Industries çalışanlarının iş ve özel hayat anılarını cerrahi olarak ayıran "ayrılma" prosedürünün ardındaki karanlık komplo derinleşir.',
    poster: 'https://image.tmdb.org/t/p/w500/j5WTC76RkKkU0t1jK1a8m.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/9K4.jpg',
    rating: 8.9,
    year: '2025',
    duration: 50,
    number_of_seasons: 2,
    number_of_episodes: 19,
    genres: ['Bilim-Kurgu', 'Gerilim', 'Dram', 'Gizem'],
    status: 'Returning Series',
    trailer: 'https://www.youtube.com/watch?v=xEQP4VVuyrY',
    categories: ['trending'],
    credits: {
      cast: [
        { name: 'Adam Scott', character: 'Mark Scout', image: null },
        { name: 'Patricia Arquette', character: 'Harmony Cobel', image: null }
      ]
    }
  },
  {
    key: 'tv-66732',
    type: 'tv',
    title: 'Stranger Things Sezon 5',
    original_title: 'Stranger Things',
    tagline: 'Son savaş Hawkins\'te başlıyor.',
    overview: 'Vecna\'nın yarattığı devasa yarık Hawkins kasabasını tehdit ederken Eleven ve dostları nihai savaş için bir araya gelir.',
    poster: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/56v2KjBlU4XaOv9rVYEQypROD7P.jpg',
    rating: 8.7,
    year: '2025',
    duration: 60,
    number_of_seasons: 5,
    number_of_episodes: 42,
    genres: ['Bilim-Kurgu', 'Korku', 'Dram', 'Gizem'],
    status: 'Returning Series',
    trailer: 'https://www.youtube.com/watch?v=b9EkMc79ZSU',
    categories: ['trending'],
    credits: {
      cast: [
        { name: 'Millie Bobby Brown', character: 'Eleven', image: null },
        { name: 'Finn Wolfhard', character: 'Mike Wheeler', image: null }
      ]
    }
  },
  {
    key: 'tv-114479',
    type: 'tv',
    title: '3 Cisim Problemi (3 Body Problem)',
    original_title: '3 Body Problem',
    tagline: 'İlk temas sonun başlangıcıdır.',
    overview: '1960\'larda Çin\'de verilen gizli bir karar, uzay ve zaman boyunca yankılanarak günümüzde bir grup bilim insanını insanlığın en büyük tehdidiyle yüzleşmeye zorlar.',
    poster: 'https://image.tmdb.org/t/p/w500/ykZ7shA6h4x1J1f3w0k1m.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/9K2.jpg',
    rating: 7.8,
    year: '2024',
    duration: 55,
    number_of_seasons: 1,
    number_of_episodes: 8,
    genres: ['Bilim-Kurgu', 'Dram', 'Gizem'],
    status: 'Returning Series',
    trailer: 'https://www.youtube.com/watch?v=mogSbMD6EcY',
    categories: ['trending'],
    credits: {
      cast: [
        { name: 'Benedict Wong', character: 'Clarence Shi', image: null },
        { name: 'Jess Hong', character: 'Jin Cheng', image: null }
      ]
    }
  },
  {
    key: 'tv-113988',
    type: 'tv',
    title: 'Ayı (The Bear Sezon 3)',
    original_title: 'The Bear',
    tagline: 'Her saniye önemlidir.',
    overview: 'Genç bir şef olan Carmy, ailesinin sandviç dükkanını üst düzey bir restorana dönüştürmek için mutfaktaki kaosla ve kendi iç dünyasıyla savaşır.',
    poster: 'https://image.tmdb.org/t/p/w500/5k9OQ9p1Z6k8m1n0b1w.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/3T1.jpg',
    rating: 8.6,
    year: '2024',
    duration: 35,
    number_of_seasons: 3,
    number_of_episodes: 28,
    genres: ['Dram', 'Komedi'],
    status: 'Returning Series',
    trailer: 'https://www.youtube.com/watch?v=UHiwP5NWsCc',
    categories: ['trending'],
    credits: {
      cast: [
        { name: 'Jeremy Allen White', character: 'Carmen \'Carmy\' Berzatto', image: null },
        { name: 'Ayo Edebiri', character: 'Sydney Adamu', image: null }
      ]
    }
  },
  {
    key: 'tv-93405-b',
    type: 'tv',
    title: 'Karanlık Madde (Dark Matter)',
    original_title: 'Dark Matter',
    tagline: 'Seçtiğiniz hayat gerçekten sizin miydi?',
    overview: 'Bir fizik profesörü bir gece kaçırılır ve kendisini hayatının alternatif bir versiyonunda bulur. Kendi ailesine geri dönmek için çoklu evrenlerde yolculuk yapar.',
    poster: 'https://image.tmdb.org/t/p/w500/2L2R2f.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/7k2.jpg',
    rating: 7.9,
    year: '2024',
    duration: 50,
    number_of_seasons: 1,
    number_of_episodes: 9,
    genres: ['Bilim-Kurgu', 'Dram', 'Gerilim'],
    status: 'Returning Series',
    trailer: 'https://www.youtube.com/watch?v=j6ucGT_LKRo',
    categories: ['trending'],
    credits: {
      cast: [
        { name: 'Joel Edgerton', character: 'Jason Dessen', image: null },
        { name: 'Jennifer Connelly', character: 'Daniela Dessen', image: null }
      ]
    }
  },

  // --- YENİ ÇIKAN DİZİLER (NEW) ---
  {
    key: 'tv-136311',
    type: 'tv',
    title: 'Centilmenler (The Gentlemen)',
    original_title: 'The Gentlemen',
    tagline: 'Aristokrasi yeraltı dünyasıyla buluşuyor.',
    overview: 'Eddie Horniman beklenmedik bir şekilde babasının devasa kır malikanesini devralır ve buranın bir esrar imparatorluğunun parçası olduğunu öğrenir.',
    poster: 'https://image.tmdb.org/t/p/w500/m1N9eL5z.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/8t3.jpg',
    rating: 8.2,
    year: '2024',
    duration: 50,
    number_of_seasons: 1,
    number_of_episodes: 8,
    genres: ['Komedi', 'Suç', 'Aksiyon'],
    status: 'Returning Series',
    trailer: 'https://www.youtube.com/watch?v=wyEOwMnWJ0s',
    categories: ['new'],
    credits: {
      cast: [
        { name: 'Theo James', character: 'Eddie Horniman', image: null },
        { name: 'Kaya Scodelario', character: 'Susie Glass', image: null }
      ]
    }
  },
  {
    key: 'tv-242876',
    type: 'tv',
    title: 'Küçük Ren Geyiği (Baby Reindeer)',
    original_title: 'Baby Reindeer',
    tagline: 'Karanlık ve gerçek bir saplantı hikayesi.',
    overview: 'Zor durumdaki bir komedyenin savunmasız bir kadına gösterdiği nezaket eylemi, her ikisinin de hayatını mahvetme tehdidi taşıyan boğucu bir saplantıya dönüşür.',
    poster: 'https://image.tmdb.org/t/p/w500/1XG5.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/9K2.jpg',
    rating: 8.1,
    year: '2024',
    duration: 35,
    number_of_seasons: 1,
    number_of_episodes: 7,
    genres: ['Dram', 'Gerilim', 'Biyografi'],
    status: 'Ended',
    trailer: 'https://www.youtube.com/watch?v=eafm1gB6SCM',
    categories: ['new'],
    credits: {
      cast: [
        { name: 'Richard Gadd', character: 'Donny Dunn', image: null },
        { name: 'Jessica Gunning', character: 'Martha Scott', image: null }
      ]
    }
  },
  {
    key: 'tv-125988',
    type: 'tv',
    title: 'Silo Sezon 2',
    original_title: 'Silo',
    tagline: 'Yalanlar yerin altında, gerçek ise dışarıdadır.',
    overview: 'Zehirli ve ölümcül dünyadan korunduklarına inanan insanların yaşadığı devasa 144 katlı yer altı silosunun ölümcül sırları ortaya çıkmaya başlar.',
    poster: 'https://image.tmdb.org/t/p/w500/9k8K.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/3T1.jpg',
    rating: 8.3,
    year: '2024',
    duration: 55,
    number_of_seasons: 2,
    number_of_episodes: 20,
    genres: ['Bilim-Kurgu', 'Dram', 'Gizem'],
    status: 'Returning Series',
    trailer: 'https://www.youtube.com/watch?v=8ZYhuvIv1pA',
    categories: ['new'],
    credits: {
      cast: [
        { name: 'Rebecca Ferguson', character: 'Juliette Nichols', image: null },
        { name: 'Common', character: 'Robert Sims', image: null }
      ]
    }
  },

  // --- EFSANE DİZİLER (TOP RATED) ---
  {
    key: 'tv-1396',
    type: 'tv',
    title: 'Breaking Bad',
    original_title: 'Breaking Bad',
    tagline: 'Tüm kuralları yık.',
    overview: 'Kanser teşhisi konan bir lise kimya öğretmeni, ailesinin geleceğini güvence altına almak için eski bir öğrencisiyle metamfetamin üretmeye başlar.',
    poster: 'https://image.tmdb.org/t/p/w500/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
    rating: 9.5,
    year: '2008',
    duration: 47,
    number_of_seasons: 5,
    number_of_episodes: 62,
    genres: ['Dram', 'Suç', 'Gerilim'],
    status: 'Ended',
    trailer: 'https://www.youtube.com/watch?v=HhesaQXLuRY',
    categories: ['top_rated', 'most_watched'],
    credits: {
      cast: [
        { name: 'Bryan Cranston', character: 'Walter White', image: null },
        { name: 'Aaron Paul', character: 'Jesse Pinkman', image: null }
      ]
    }
  },
  {
    key: 'tv-87108',
    type: 'tv',
    title: 'Çernobil (Chernobyl)',
    original_title: 'Chernobyl',
    tagline: 'Yalanların bedeli nedir?',
    overview: 'Nisan 1986\'da Çernobil Nükleer Santrali\'ndeki felaketi ve insanlığı kurtarmak için hayatlarını feda eden kahramanların hikayesini anlatıyor.',
    poster: 'https://image.tmdb.org/t/p/w500/hlLXt2tOPT6RRnjiUmoxyG1LTFi.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/uL6Ad12W789z.jpg',
    rating: 9.4,
    year: '2019',
    duration: 65,
    number_of_seasons: 1,
    number_of_episodes: 5,
    genres: ['Dram', 'Tarih'],
    status: 'Ended',
    trailer: 'https://www.youtube.com/watch?v=s9APLVMxYvc',
    categories: ['top_rated'],
    credits: {
      cast: [
        { name: 'Jared Harris', character: 'Valery Legasov', image: null },
        { name: 'Stellan Skarsgård', character: 'Boris Shcherbina', image: null }
      ]
    }
  },
  {
    key: 'tv-1399',
    type: 'tv',
    title: 'Taht Oyunları (Game of Thrones)',
    original_title: 'Game of Thrones',
    tagline: 'Kış geliyor.',
    overview: 'Westeros\'un yedi krallığının kontrolü için soylu aileler arasında verilen destansı bir güç savaşı.',
    poster: 'https://image.tmdb.org/t/p/w500/7WUHnWGx5OO145IRxPDUkQSh4C7.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/2OMB0ynKlyIenMJWI2Dy9IWT4c.jpg',
    rating: 9.3,
    year: '2011',
    duration: 60,
    number_of_seasons: 8,
    number_of_episodes: 73,
    genres: ['Dram', 'Fantastik', 'Aksiyon', 'Macera'],
    status: 'Ended',
    trailer: 'https://www.youtube.com/watch?v=KPLWWIOCOOQ',
    categories: ['top_rated', 'most_watched'],
    credits: {
      cast: [
        { name: 'Emilia Clarke', character: 'Daenerys Targaryen', image: null },
        { name: 'Kit Harington', character: 'Jon Snow', image: null }
      ]
    }
  },

  // =========================================================================
  // 🎌 ANİMELER (ANIME) - 2024-2026 GÜNCEL & EFSANE LİSTE
  // =========================================================================

  // --- POPÜLER ANİMELER (POPULAR NOW) ---
  {
    key: 'anime-52299',
    type: 'anime',
    title: 'Solo Leveling (Ore dake Level Up na Ken)',
    original_title: 'Solo Leveling',
    tagline: 'En zayıf avcıdan en güçlü gölge lorduna.',
    overview: 'İnsanlığın en zayıf E-seviye avcısı Sung Jinwoo, gizemli bir zindanda ölümden döndükten sonra yalnızca kendisinin görebildiği seviye atlama sisteminin sahibi olur.',
    poster: 'https://cdn.myanimelist.net/images/anime/1170/141042.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/8BQXd4nU9p5wM8h.jpg',
    rating: 8.9,
    year: '2024',
    duration: 24,
    number_of_seasons: 2,
    number_of_episodes: 24,
    genres: ['Aksiyon', 'Macera', 'Fantastik'],
    status: 'Returning Series',
    trailer: 'https://www.youtube.com/watch?v=s8cR_G4m37s',
    categories: ['popular', 'most_watched'],
    characters: [
      { name: 'Sung Jinwoo', role: 'Main', image: null },
      { name: 'Cha Hae-In', role: 'Main', image: null }
    ]
  },
  {
    key: 'anime-52991',
    type: 'anime',
    title: 'Frieren: Yolculuğun Sonu (Sousou no Frieren)',
    original_title: 'Sousou no Frieren',
    tagline: 'Zaman akıp gider, hatıralar kalır.',
    overview: 'Şeytan Kralı yenen kahraman partisinin büyücüsü olan elf Frieren, ölümsüz ömrünün insan arkadaşlarının ölümüyle nasıl değiştiğini anlamak için yeni bir yolculuğa çıkar.',
    poster: 'https://cdn.myanimelist.net/images/anime/1015/138006.jpg',
    backdrop: null,
    rating: 9.4,
    year: '2024',
    duration: 24,
    number_of_seasons: 1,
    number_of_episodes: 28,
    genres: ['Macera', 'Dram', 'Fantastik'],
    status: 'Ended',
    trailer: 'https://www.youtube.com/watch?v=qgQunxD0qMo',
    categories: ['popular', 'top_rated'],
    characters: [
      { name: 'Frieren', role: 'Main', image: null },
      { name: 'Fern', role: 'Main', image: null }
    ]
  },
  {
    key: 'anime-51009',
    type: 'anime',
    title: 'Jujutsu Kaisen Sezon 2 (Shibuya Olayı)',
    original_title: 'Jujutsu Kaisen 2nd Season',
    tagline: 'Lanetleri yok etmek için lanetlen.',
    overview: 'Gojo Satoru ve Geto Suguru\'nun geçmişine ışık tutan sırlar ve dünyayı sarsacak büyük Shibuya Olayı çatışması.',
    poster: 'https://cdn.myanimelist.net/images/anime/1792/138042.jpg',
    backdrop: null,
    rating: 9.0,
    year: '2024',
    duration: 24,
    number_of_seasons: 2,
    number_of_episodes: 47,
    genres: ['Aksiyon', 'Fantastik', 'Doğaüstü'],
    status: 'Returning Series',
    trailer: 'https://www.youtube.com/watch?v=O6qvieoZZE8',
    categories: ['popular', 'most_watched'],
    characters: [
      { name: 'Satoru Gojo', role: 'Main', image: null },
      { name: 'Yuji Itadori', role: 'Main', image: null }
    ]
  },
  {
    key: 'anime-54744',
    type: 'anime',
    title: 'Kaiju No. 8',
    original_title: 'Kaiju No. 8',
    tagline: 'İçindeki canavarla insanlığı koru.',
    overview: 'Canavar temizleme ekibinde çalışan 32 yaşındaki Kafka Hibino, küçük bir kaiju tarafından enfekte edilir ve kendisi bir insansı kaijuya dönüşür.',
    poster: 'https://cdn.myanimelist.net/images/anime/1066/141973.jpg',
    backdrop: null,
    rating: 8.4,
    year: '2024',
    duration: 24,
    number_of_seasons: 1,
    number_of_episodes: 12,
    genres: ['Aksiyon', 'Bilim-Kurgu'],
    status: 'Returning Series',
    trailer: 'https://www.youtube.com/watch?v=c3ljvTq1lPQ',
    categories: ['popular'],
    characters: [
      { name: 'Kafka Hibino', role: 'Main', image: null },
      { name: 'Mina Ashiro', role: 'Main', image: null }
    ]
  },
  {
    key: 'anime-57334',
    type: 'anime',
    title: 'Dandadan',
    original_title: 'Dandadan',
    tagline: 'Hayaletler uzaylılara karşı!',
    overview: 'Hayaletlere inanan ama uzaylıları reddeden Momo ile uzaylılara inanan ama hayaletleri reddeden Okarun\'un doğaüstü ve çılgın serüveni.',
    poster: 'https://cdn.myanimelist.net/images/anime/1429/145935.jpg',
    backdrop: null,
    rating: 8.7,
    year: '2024',
    duration: 24,
    number_of_seasons: 1,
    number_of_episodes: 12,
    genres: ['Aksiyon', 'Komedi', 'Doğaüstü', 'Bilim-Kurgu'],
    status: 'Returning Series',
    trailer: 'https://www.youtube.com/watch?v=P_l96-pG4sY',
    categories: ['popular'],
    characters: [
      { name: 'Momo Ayase', role: 'Main', image: null },
      { name: 'Ken Takakura (Okarun)', role: 'Main', image: null }
    ]
  },
  {
    key: 'anime-38000',
    type: 'anime',
    title: 'İblis Keser: Hashira Eğitimi (Demon Slayer)',
    original_title: 'Kimetsu no Yaiba: Hashira Geiko-hen',
    tagline: 'Son savaşa hazırlan.',
    overview: 'Muzan Kibutsuji ve Üst Ay iblislerine karşı yaklaşan nihai savaş öncesinde Tanjiro ve avcılar, Hashiralar tarafından zorlu bir eğitime tabi tutulur.',
    poster: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg',
    backdrop: null,
    rating: 8.8,
    year: '2024',
    duration: 24,
    number_of_seasons: 4,
    number_of_episodes: 55,
    genres: ['Aksiyon', 'Fantastik', 'Tarihi'],
    status: 'Returning Series',
    trailer: 'https://www.youtube.com/watch?v=6vMuWuWlW4I',
    categories: ['popular', 'most_watched'],
    characters: [
      { name: 'Tanjiro Kamado', role: 'Main', image: null },
      { name: 'Nezuko Kamado', role: 'Main', image: null }
    ]
  },

  // --- TREND ANİMELER (TRENDING) ---
  {
    key: 'anime-56784',
    type: 'anime',
    title: 'Bleach: Bin Yıllık Kan Savaşı Bölüm 3',
    original_title: 'Bleach: Sennen Kessen-hen - Soukoku-tan',
    tagline: 'Ruhlar Topluluğu\'nun nihai kaderi.',
    overview: 'Quincy Kralı Yhwach ve Sternritter ordusu Ruh Kralı\'nın Sarayı\'na saldırırken Ichigo Kurosaki ve Kaptanlar son savunma hattını kurar.',
    poster: 'https://cdn.myanimelist.net/images/anime/1093/143526.jpg',
    backdrop: null,
    rating: 9.1,
    year: '2024',
    duration: 24,
    number_of_seasons: 3,
    number_of_episodes: 39,
    genres: ['Aksiyon', 'Macera', 'Doğaüstü'],
    status: 'Returning Series',
    trailer: 'https://www.youtube.com/watch?v=e8YBesRKq_U',
    categories: ['trending'],
    characters: [
      { name: 'Ichigo Kurosaki', role: 'Main', image: null },
      { name: 'Yhwach', role: 'Main', image: null }
    ]
  },
  {
    key: 'anime-55791',
    type: 'anime',
    title: 'Oshi no Ko Sezon 2',
    original_title: 'Oshi no Ko 2nd Season',
    tagline: 'Spot ışıklarının ardındaki yalanlar.',
    overview: 'Aqua Hoshino, annesinin ölümünün ardındaki gizemi çözmek için eğlence sektörünün karanlık sahne arkasında intikam arayışını sürdürür.',
    poster: 'https://cdn.myanimelist.net/images/anime/1188/143431.jpg',
    backdrop: null,
    rating: 8.6,
    year: '2024',
    duration: 24,
    number_of_seasons: 2,
    number_of_episodes: 24,
    genres: ['Dram', 'Gizem', 'Doğaüstü'],
    status: 'Returning Series',
    trailer: 'https://www.youtube.com/watch?v=BRb48eB4Q60',
    categories: ['trending'],
    characters: [
      { name: 'Aquamarine Hoshino', role: 'Main', image: null },
      { name: 'Ruby Hoshino', role: 'Main', image: null }
    ]
  },
  {
    key: 'anime-54492',
    type: 'anime',
    title: 'Zindan Lezzetleri (Delicious in Dungeon)',
    original_title: 'Dungeon Meshi',
    tagline: 'Ye ya da yenil!',
    overview: 'Zindanın derinliklerinde kız kardeşini kurtarmaya çalışan Laios ve ekibi, erzakları bitince zindandaki canavarları pişirip yemeye başlar.',
    poster: 'https://cdn.myanimelist.net/images/anime/1561/140073.jpg',
    backdrop: null,
    rating: 8.5,
    year: '2024',
    duration: 24,
    number_of_seasons: 1,
    number_of_episodes: 24,
    genres: ['Macera', 'Komedi', 'Fantastik'],
    status: 'Returning Series',
    trailer: 'https://www.youtube.com/watch?v=r0_qT9KkY_8',
    categories: ['trending'],
    characters: [
      { name: 'Laios Touden', role: 'Main', image: null },
      { name: 'Marcille Donato', role: 'Main', image: null }
    ]
  },
  {
    key: 'anime-56329',
    type: 'anime',
    title: 'Wind Breaker',
    original_title: 'Wind Breaker',
    tagline: 'Şehrini yumruklarınla koru.',
    overview: 'Sadece en güçlü olmak isteyen Haruka Sakura, Furin Lisesi\'ne transfer olur ve buradaki çetenin şehri koruyan kahramanlar olduğunu keşfeder.',
    poster: 'https://cdn.myanimelist.net/images/anime/1799/141870.jpg',
    backdrop: null,
    rating: 8.1,
    year: '2024',
    duration: 24,
    number_of_seasons: 1,
    number_of_episodes: 13,
    genres: ['Aksiyon', 'Okul'],
    status: 'Returning Series',
    trailer: 'https://www.youtube.com/watch?v=Zt_3z_YmX2M',
    categories: ['trending'],
    characters: [
      { name: 'Haruka Sakura', role: 'Main', image: null }
    ]
  },

  // --- YENİ ANİMELER (NEW) ---
  {
    key: 'anime-58080',
    type: 'anime',
    title: 'Chainsaw Man: Reze Arc (Film)',
    original_title: 'Chainsaw Man: Reze-hen',
    tagline: 'Aşk bir patlama gibi gelebilir.',
    overview: 'Denji, yağmurlu bir günde tanıştığı Reze adındaki gizemli kıza aşık olur. Ancak Reze\'nin göründüğünden çok daha tehlikeli sırları vardır.',
    poster: 'https://cdn.myanimelist.net/images/anime/1806/126216.jpg',
    backdrop: null,
    rating: 9.0,
    year: '2025',
    duration: 105,
    genres: ['Aksiyon', 'Doğaüstü', 'Korku'],
    status: 'Upcoming',
    trailer: 'https://www.youtube.com/watch?v=q15CRdE5Bv0',
    categories: ['new'],
    characters: [
      { name: 'Denji', role: 'Main', image: null },
      { name: 'Reze', role: 'Main', image: null }
    ]
  },
  {
    key: 'anime-57555',
    type: 'anime',
    title: 'Kahramanlık Akademim Sezon 7',
    original_title: 'Boku no Hero Academia 7th Season',
    tagline: 'Hepimiz kahraman olacağız.',
    overview: 'Tüm Zamanların En Büyük Kahramanı olmak için Deku ve Sınıf 1-A, All For One ve Shigaraki\'ye karşı nihai dünya savaşını başlatır.',
    poster: 'https://cdn.myanimelist.net/images/anime/1075/141974.jpg',
    backdrop: null,
    rating: 8.5,
    year: '2024',
    duration: 24,
    number_of_seasons: 7,
    number_of_episodes: 159,
    genres: ['Aksiyon', 'Süper Güç', 'Okul'],
    status: 'Returning Series',
    trailer: 'https://www.youtube.com/watch?v=9_Kk1e_YnU0',
    categories: ['new'],
    characters: [
      { name: 'Izuku Midoriya', role: 'Main', image: null },
      { name: 'Katsuki Bakugo', role: 'Main', image: null }
    ]
  },
  {
    key: 'anime-58000',
    type: 'anime',
    title: 'One Piece: Egghead Adası',
    original_title: 'One Piece: Egghead Arc',
    tagline: 'Geleceğin adasında geçmişin sırları çözülüyor.',
    overview: 'Hasır Şapka Korsanları, 500 yıl ilerideki teknolojiye sahip dahi bilim insanı Dr. Vegapunk\'ın Egghead adasına varır.',
    poster: 'https://cdn.myanimelist.net/images/anime/1244/138851.jpg',
    backdrop: null,
    rating: 9.1,
    year: '2024',
    duration: 24,
    number_of_seasons: 21,
    number_of_episodes: 1120,
    genres: ['Aksiyon', 'Macera', 'Fantastik'],
    status: 'Returning Series',
    trailer: 'https://www.youtube.com/watch?v=A2dY_Vv4_sE',
    categories: ['new', 'most_watched'],
    characters: [
      { name: 'Monkey D. Luffy', role: 'Main', image: null },
      { name: 'Roronoa Zoro', role: 'Main', image: null }
    ]
  },

  // --- EFSANE ANİMELER (TOP RATED CLASSICS) ---
  {
    key: 'anime-16498',
    type: 'anime',
    title: 'Titan\'a Saldırı (Attack on Titan)',
    original_title: 'Shingeki no Kyojin',
    tagline: 'Eğer kazanırsak yaşarız. Savaşmazsak kazanamayız.',
    overview: 'İnsanlık, devasa canavarlar olan Titanlardan korunmak için surların içine sığınmıştır. Eren Yeager tüm Titanları yok etmeye yemin eder.',
    poster: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/8BQXd4nU9p5wM8h.jpg',
    rating: 9.2,
    year: '2013',
    duration: 24,
    number_of_seasons: 4,
    number_of_episodes: 89,
    genres: ['Aksiyon', 'Fantastik', 'Dram', 'Gizem'],
    status: 'Ended',
    trailer: 'https://www.youtube.com/watch?v=MGRm4IzK1SQ',
    categories: ['top_rated', 'most_watched'],
    characters: [
      { name: 'Eren Yeager', role: 'Main', image: null },
      { name: 'Mikasa Ackerman', role: 'Main', image: null },
      { name: 'Levi Ackerman', role: 'Supporting', image: null }
    ]
  },
  {
    key: 'anime-1535',
    type: 'anime',
    title: 'Ölüm Defteri (Death Note)',
    original_title: 'Death Note',
    tagline: 'Adı yazılan kişi ölecektir.',
    overview: 'Zeki lise öğrencisi Light Yagami, adı yazılan herkesin ölmesini sağlayan gizemli bir defter bularak suçluları yok etmeye girişir.',
    poster: 'https://cdn.myanimelist.net/images/anime/9/9453.jpg',
    backdrop: null,
    rating: 9.0,
    year: '2006',
    duration: 23,
    number_of_seasons: 1,
    number_of_episodes: 37,
    genres: ['Gerilim', 'Gizem', 'Doğaüstü', 'Psikolojik'],
    status: 'Ended',
    trailer: 'https://www.youtube.com/watch?v=NlJZ-YgAt-c',
    categories: ['top_rated'],
    characters: [
      { name: 'Light Yagami', role: 'Main', image: null },
      { name: 'L Lawliet', role: 'Main', image: null }
    ]
  },
  {
    key: 'anime-5114',
    type: 'anime',
    title: 'Fullmetal Alchemist: Brotherhood',
    original_title: 'Hagane no Renkinjutsushi',
    tagline: 'Eşdeğer Değişim Kanunu.',
    overview: 'Ölen annelerini diriltmek için simyanın en büyük tabusunu yıkan Edward ve Alphonse Elric kardeşler, kaybettikleri bedenlerini geri almak için Felsefe Taşı\'nı arar.',
    poster: 'https://cdn.myanimelist.net/images/anime/1223/96541.jpg',
    backdrop: null,
    rating: 9.3,
    year: '2009',
    duration: 24,
    number_of_seasons: 1,
    number_of_episodes: 64,
    genres: ['Aksiyon', 'Macera', 'Dram', 'Fantastik'],
    status: 'Ended',
    trailer: 'https://www.youtube.com/watch?v=--IcmZkvL0Q',
    categories: ['top_rated'],
    characters: [
      { name: 'Edward Elric', role: 'Main', image: null },
      { name: 'Alphonse Elric', role: 'Main', image: null }
    ]
  }
];

export function getTrending(type: string = 'movie', filter: string = 'popular', page: number = 1, limit: number = 20) {
  // Filter by type
  let typeItems = ALL_CONTENT.filter(item => type === 'all' || item.type === type);

  // Filter specifically by category to prevent repetition across sections
  let filtered = typeItems.filter(item => item.categories && item.categories.includes(filter));

  // If filtered set is small or empty for this specific category, take fallback slice without mixing identical orders
  if (filtered.length === 0) {
    filtered = typeItems;
  }

  const offset = (page - 1) * limit;
  const results = filtered.slice(offset, offset + limit);
  return {
    results,
    total: filtered.length,
    hasMore: offset + limit < filtered.length,
    source: 'static_fallback'
  };
}

export function searchContent(query: string, type: string = 'movie') {
  if (!query || !query.trim()) return { results: [], source: 'static_fallback' };
  const q = query.toLowerCase().trim();
  const results = ALL_CONTENT.filter(item => {
    if (type !== 'all' && item.type !== type) return false;
    return (
      item.title.toLowerCase().includes(q) ||
      (item.original_title && item.original_title.toLowerCase().includes(q)) ||
      (item.overview && item.overview.toLowerCase().includes(q)) ||
      (item.genres && item.genres.some(g => g.toLowerCase().includes(q)))
    );
  });
  return { results, source: 'static_fallback' };
}

export function getDetail(key: string) {
  const cleanKey = key.replace(/-(popular|trending|new|top_rated|most_watched)$/, '');
  const item = ALL_CONTENT.find(c => c.key === cleanKey || c.key === key || cleanKey.startsWith(c.key));
  return item || ALL_CONTENT[0];
}

export function getGenres(type: string = 'movie') {
  const genres = new Set<string>();
  ALL_CONTENT.filter(c => type === 'all' || c.type === type).forEach(c => {
    (c.genres || []).forEach(g => genres.add(g));
  });
  return { genres: Array.from(genres).sort() };
}

export function getStats() {
  const movies = ALL_CONTENT.filter(c => c.type === 'movie').length;
  const tv = ALL_CONTENT.filter(c => c.type === 'tv').length;
  const anime = ALL_CONTENT.filter(c => c.type === 'anime').length;
  return {
    movies,
    tv,
    anime,
    total: ALL_CONTENT.length,
    lastSync: new Date().toISOString()
  };
}
