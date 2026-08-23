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
  categories?: string[];
}

export const ALL_CONTENT: ContentItem[] = [
  // ==========================================
  // FILMLER (MOVIES)
  // ==========================================
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
    categories: ['popular', 'trending', 'top_rated', 'most_watched'],
    credits: {
      cast: [
        { name: 'Cillian Murphy', character: 'J. Robert Oppenheimer', image: 'https://image.tmdb.org/t/p/w185/3DjoF8m7239p4b4W04N2r4zZ9t9.jpg' },
        { name: 'Emily Blunt', character: 'Katherine Oppenheimer', image: 'https://image.tmdb.org/t/p/w185/nPJdtMRABAS16mG4yUqQ9U6jM.jpg' },
        { name: 'Matt Damon', character: 'Leslie Groves', image: 'https://image.tmdb.org/t/p/w185/elSlNg0WjdEeeZ5npsF89sI0A1V.jpg' },
        { name: 'Robert Downey Jr.', character: 'Lewis Strauss', image: 'https://image.tmdb.org/t/p/w185/5qHNjhtjMD4YWH3juCGg2w2qW.jpg' },
        { name: 'Florence Pugh', character: 'Jean Tatlock', image: 'https://image.tmdb.org/t/p/w185/750r1gC82k793h7x1sX1a0Y2.jpg' }
      ]
    }
  },
  {
    key: 'movie-157336',
    type: 'movie',
    title: 'Yıldızlararası',
    original_title: 'Interstellar',
    tagline: 'İnsanlığın sonu bizim sonumuz olmak zorunda değil.',
    overview: 'İnsanlığın tükenme tehlikesiyle karşı karşıya olduğu bir gelecekte, bir grup kaşif insanlık için yeni bir yuva bulmak amacıyla bir solucan deliğinden geçerek galaksiler arası bir yolculuğa çıkar.',
    poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
    rating: 8.7,
    year: '2014',
    duration: 169,
    genres: ['Bilim-Kurgu', 'Dram', 'Macera'],
    status: 'Released',
    trailer: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    categories: ['popular', 'top_rated', 'most_watched'],
    credits: {
      cast: [
        { name: 'Matthew McConaughey', character: 'Cooper', image: 'https://image.tmdb.org/t/p/w185/eD1e48jK05j0P0s2rM1s6F8k5.jpg' },
        { name: 'Anne Hathaway', character: 'Brand', image: 'https://image.tmdb.org/t/p/w185/tLel4fgQBPikvIL4FdcwQ.jpg' },
        { name: 'Jessica Chastain', character: 'Murph', image: 'https://image.tmdb.org/t/p/w185/lodMzL1tV6eT6h7wB8K.jpg' },
        { name: 'Michael Caine', character: 'Professor Brand', image: 'https://image.tmdb.org/t/p/w185/kJ2d5eT3k7z2.jpg' }
      ]
    }
  },
  {
    key: 'movie-693134',
    type: 'movie',
    title: 'Dune: Çöl Gezegeni Bölüm İki',
    original_title: 'Dune: Part Two',
    tagline: 'Kader bir lider gerektirir.',
    overview: 'Paul Atreides, ailesini yok eden komploculara karşı intikam arayışındayken Chani ve Fremenlerle güçlerini birleştirir.',
    poster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s5hj0x2.jpg',
    rating: 8.8,
    year: '2024',
    duration: 166,
    genres: ['Bilim-Kurgu', 'Macera', 'Aksiyon'],
    status: 'Released',
    trailer: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    categories: ['popular', 'trending', 'new', 'top_rated', 'most_watched'],
    credits: {
      cast: [
        { name: 'Timothée Chalamet', character: 'Paul Atreides', image: 'https://image.tmdb.org/t/p/w185/BE2sdjpgsa2rNTFa66UL7.jpg' },
        { name: 'Zendaya', character: 'Chani', image: 'https://image.tmdb.org/t/p/w185/r3A7evZyTGaNuL3GA.jpg' },
        { name: 'Rebecca Ferguson', character: 'Lady Jessica', image: 'https://image.tmdb.org/t/p/w185/4t3L2.jpg' },
        { name: 'Austin Butler', character: 'Feyd-Rautha', image: 'https://image.tmdb.org/t/p/w185/2gL89y.jpg' }
      ]
    }
  },
  {
    key: 'movie-27205',
    type: 'movie',
    title: 'Başlangıç',
    original_title: 'Inception',
    tagline: 'Zihniniz suç mahallidir.',
    overview: 'Dom Cobb, insanların rüyalarından bilinçaltı sırlarını çalan çok yetenekli bir hırsızdır. Ona bu sefer bir fikri çalmak değil, zihne eklemek görevi verilir.',
    poster: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/8ZTVqvKDQ8emSGUEMjsS4yR84zT.jpg',
    rating: 8.8,
    year: '2010',
    duration: 148,
    genres: ['Bilim-Kurgu', 'Aksiyon', 'Macera'],
    status: 'Released',
    trailer: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    categories: ['popular', 'top_rated', 'most_watched'],
    credits: {
      cast: [
        { name: 'Leonardo DiCaprio', character: 'Dom Cobb', image: 'https://image.tmdb.org/t/p/w185/wo2hxAzvQ.jpg' },
        { name: 'Joseph Gordon-Levitt', character: 'Arthur', image: 'https://image.tmdb.org/t/p/w185/dhv0w.jpg' },
        { name: 'Elliot Page', character: 'Ariadne', image: 'https://image.tmdb.org/t/p/w185/toqWv.jpg' },
        { name: 'Tom Hardy', character: 'Eames', image: 'https://image.tmdb.org/t/p/w185/yVdT.jpg' }
      ]
    }
  },
  {
    key: 'movie-155',
    type: 'movie',
    title: 'Kara Şövalye',
    original_title: 'The Dark Knight',
    tagline: 'Kaosun dünyasında tek kural hayatta kalmaktır.',
    overview: 'Batman, Teğmen Gordon ve Savcı Harvey Dent yardımıyla Gotham sokaklarını suçtan arındırmaya başlar. Ancak Joker\'in ortaya çıkışı şehri dehşete sürükler.',
    poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg',
    rating: 9.0,
    year: '2008',
    duration: 152,
    genres: ['Aksiyon', 'Suç', 'Dram'],
    status: 'Released',
    trailer: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    categories: ['popular', 'trending', 'top_rated', 'most_watched'],
    credits: {
      cast: [
        { name: 'Christian Bale', character: 'Bruce Wayne / Batman', image: 'https://image.tmdb.org/t/p/w185/b7fTC.jpg' },
        { name: 'Heath Ledger', character: 'Joker', image: 'https://image.tmdb.org/t/p/w185/5Y9H.jpg' },
        { name: 'Aaron Eckhart', character: 'Harvey Dent', image: 'https://image.tmdb.org/t/p/w185/rr2.jpg' },
        { name: 'Gary Oldman', character: 'James Gordon', image: 'https://image.tmdb.org/t/p/w185/2gL8.jpg' }
      ]
    }
  },
  {
    key: 'movie-569094',
    type: 'movie',
    title: 'Örümcek-Adam: Örümcek Evrenine Geçiş',
    original_title: 'Spider-Man: Across the Spider-Verse',
    tagline: 'Kendi hikayeni yaz.',
    overview: 'Miles Morales, Çoklu Evren boyunca bir yolculuğa çıkar ve kaderini yeniden tanımlamak için Örümcek Topluluğu ile karşı karşıya gelir.',
    poster: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    rating: 8.7,
    year: '2023',
    duration: 140,
    genres: ['Animasyon', 'Aksiyon', 'Macera', 'Bilim-Kurgu'],
    status: 'Released',
    trailer: 'https://www.youtube.com/watch?v=cqGjhVJWtEg',
    categories: ['popular', 'trending', 'top_rated', 'most_watched'],
    credits: {
      cast: [
        { name: 'Shameik Moore', character: 'Miles Morales (ses)', image: null },
        { name: 'Hailee Steinfeld', character: 'Gwen Stacy (ses)', image: null },
        { name: 'Oscar Isaac', character: 'Miguel O\'Hara (ses)', image: null }
      ]
    }
  },
  {
    key: 'movie-550',
    type: 'movie',
    title: 'Dövüş Kulübü',
    original_title: 'Fight Club',
    tagline: 'Sahip oldukların sonunda sana sahip olur.',
    overview: 'Uykusuzluk çeken bir ofis çalışanı ve başına buyruk bir sabun satıcısı, kısa sürede yeraltı bir fenomen haline gelen gizli bir dövüş kulübü kurarlar.',
    poster: 'https://image.tmdb.org/t/p/w500/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
    rating: 8.8,
    year: '1999',
    duration: 139,
    genres: ['Dram', 'Gerilim'],
    status: 'Released',
    trailer: 'https://www.youtube.com/watch?v=qtRKdVHc-cE',
    categories: ['popular', 'top_rated', 'most_watched'],
    credits: {
      cast: [
        { name: 'Brad Pitt', character: 'Tyler Durden', image: 'https://image.tmdb.org/t/p/w185/cckc.jpg' },
        { name: 'Edward Norton', character: 'Anlatıcı', image: 'https://image.tmdb.org/t/p/w185/5XB.jpg' },
        { name: 'Helena Bonham Carter', character: 'Marla Singer', image: 'https://image.tmdb.org/t/p/w185/D8.jpg' }
      ]
    }
  },
  {
    key: 'movie-278',
    type: 'movie',
    title: 'Esaretin Bedeli',
    original_title: 'The Shawshank Redemption',
    tagline: 'Korku sizi tutsak eder, umut ise özgür kılar.',
    overview: 'İşlemediği bir cinayetten ötürü ömür boyu hapse mahkum edilen bankacı Andy Dufresne, Shawshank hapishanesinde umudu ve dostluğu canlı tutar.',
    poster: 'https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
    rating: 9.3,
    year: '1994',
    duration: 142,
    genres: ['Dram', 'Suç'],
    status: 'Released',
    trailer: 'https://www.youtube.com/watch?v=PLl99DlL6b4',
    categories: ['popular', 'top_rated', 'most_watched'],
    credits: {
      cast: [
        { name: 'Tim Robbins', character: 'Andy Dufresne', image: null },
        { name: 'Morgan Freeman', character: 'Ellis Boyd \'Red\' Redding', image: null }
      ]
    }
  },
  {
    key: 'movie-238',
    type: 'movie',
    title: 'Baba',
    original_title: 'The Godfather',
    tagline: 'Reddedemeyeceği bir teklif yapacağım.',
    overview: 'New York\'ta hüküm süren bir mafya ailesinin yaşlanan lideri Don Vito Corleone, kontrolü isteksizce en küçük oğlu Michael\'a devreder.',
    poster: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/tmU7GeKVybMWFButWEGl2M4GeiP.jpg',
    rating: 9.2,
    year: '1972',
    duration: 175,
    genres: ['Dram', 'Suç'],
    status: 'Released',
    trailer: 'https://www.youtube.com/watch?v=sY1S34973zA',
    categories: ['popular', 'top_rated', 'most_watched'],
    credits: {
      cast: [
        { name: 'Marlon Brando', character: 'Don Vito Corleone', image: null },
        { name: 'Al Pacino', character: 'Michael Corleone', image: null }
      ]
    }
  },
  {
    key: 'movie-496243',
    type: 'movie',
    title: 'Parazit',
    original_title: 'Parasite',
    tagline: 'Bir ailenin hayatta kalma mücadelesi.',
    overview: 'Yoksul Kim ailesi, zengin Park ailesinin evine birer birer sızarak hayatlarını ele geçirmeye başlar.',
    poster: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/hiKmpZMGZsrkA3cdce8a7Dpos1j.jpg',
    rating: 8.6,
    year: '2019',
    duration: 132,
    genres: ['Dram', 'Gerilim', 'Komedi'],
    status: 'Released',
    trailer: 'https://www.youtube.com/watch?v=5xH0hhJ98Xg',
    categories: ['popular', 'trending', 'top_rated'],
    credits: {
      cast: [
        { name: 'Song Kang-ho', character: 'Kim Ki-taek', image: null },
        { name: 'Lee Sun-kyun', character: 'Park Dong-ik', image: null }
      ]
    }
  },

  // ==========================================
  // DİZİLER (TV SERIES)
  // ==========================================
  {
    key: 'tv-1396',
    type: 'tv',
    title: 'Breaking Bad',
    original_title: 'Breaking Bad',
    tagline: 'Tüm kuralları yık.',
    overview: 'Kanser teşhisi konan bir lise kimya öğretmeni, ailesinin geleceğini güvence altına almak için eski bir öğrencisiyle birlikte metamfetamin üretip satmaya başlar.',
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
    categories: ['popular', 'trending', 'top_rated', 'most_watched'],
    credits: {
      cast: [
        { name: 'Bryan Cranston', character: 'Walter White', image: 'https://image.tmdb.org/t/p/w185/7Jahy5LZX2Fo8fGJltMreAI49hC.jpg' },
        { name: 'Aaron Paul', character: 'Jesse Pinkman', image: 'https://image.tmdb.org/t/p/w185/u8c029vgG8i3y9.jpg' },
        { name: 'Anna Gunn', character: 'Skyler White', image: null },
        { name: 'Giancarlo Esposito', character: 'Gus Fring', image: null }
      ]
    }
  },
  {
    key: 'tv-94605',
    type: 'tv',
    title: 'Arcane',
    original_title: 'Arcane',
    tagline: 'İki şehir, iki kardeş, tek bir kader.',
    overview: 'Ütopik Piltover şehri ile baskı altındaki Zaun arasındaki sert çatışmada iki ikonik şampiyon kardeş, karşı saflarda savaşmak zorunda kalır.',
    poster: 'https://image.tmdb.org/t/p/w500/fqldf2t8ztc9aiwn396mlX3Yq1m.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/hPe0F1K6X1P2pXnQ6tT4.jpg',
    rating: 9.1,
    year: '2021',
    duration: 40,
    number_of_seasons: 2,
    number_of_episodes: 18,
    genres: ['Animasyon', 'Aksiyon', 'Macera', 'Fantastik'],
    status: 'Returning Series',
    trailer: 'https://www.youtube.com/watch?v=fXmAurh012s',
    categories: ['popular', 'trending', 'new', 'top_rated', 'most_watched'],
    credits: {
      cast: [
        { name: 'Hailee Steinfeld', character: 'Vi (ses)', image: null },
        { name: 'Ella Purnell', character: 'Jinx (ses)', image: null },
        { name: 'Katie Leung', character: 'Caitlyn (ses)', image: null }
      ]
    }
  },
  {
    key: 'tv-100088',
    type: 'tv',
    title: 'The Last of Us',
    original_title: 'The Last of Us',
    tagline: 'Karanlıkta kaybolduğunda ışığı ara.',
    overview: 'Modern uygarlığın çöküşünden yirmi yıl sonra, sertleşmiş bir kurtulan olan Joel, 14 yaşındaki Ellie\'yi baskıcı bir karantina bölgesinden kaçırmak için tutulur.',
    poster: 'https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2V7JMrne.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg',
    rating: 8.8,
    year: '2023',
    duration: 55,
    number_of_seasons: 2,
    number_of_episodes: 16,
    genres: ['Dram', 'Aksiyon', 'Macera', 'Bilim-Kurgu'],
    status: 'Returning Series',
    trailer: 'https://www.youtube.com/watch?v=uLtkt8BonwM',
    categories: ['popular', 'trending', 'new', 'most_watched'],
    credits: {
      cast: [
        { name: 'Pedro Pascal', character: 'Joel Miller', image: 'https://image.tmdb.org/t/p/w185/87e07y.jpg' },
        { name: 'Bella Ramsey', character: 'Ellie Williams', image: 'https://image.tmdb.org/t/p/w185/3VfQ2.jpg' }
      ]
    }
  },
  {
    key: 'tv-66732',
    type: 'tv',
    title: 'Stranger Things',
    original_title: 'Stranger Things',
    tagline: 'Her şey altüst olduğunda hiçbir şey eskisi gibi kalmaz.',
    overview: 'Küçük bir kasabada bir çocuğun gizemli bir şekilde kaybolmasıyla, kasaba halkı gizli deneyler, doğaüstü güçler ve tuhaf küçük bir kızla karşılaşır.',
    poster: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/56v2KjBlU4XaOv9rVYEQypROD7P.jpg',
    rating: 8.7,
    year: '2016',
    duration: 50,
    number_of_seasons: 5,
    number_of_episodes: 42,
    genres: ['Bilim-Kurgu', 'Korku', 'Dram', 'Gizem'],
    status: 'Returning Series',
    trailer: 'https://www.youtube.com/watch?v=b9EkMc79ZSU',
    categories: ['popular', 'trending', 'most_watched'],
    credits: {
      cast: [
        { name: 'Millie Bobby Brown', character: 'Eleven', image: null },
        { name: 'Finn Wolfhard', character: 'Mike Wheeler', image: null },
        { name: 'David Harbour', character: 'Jim Hopper', image: null },
        { name: 'Winona Ryder', character: 'Joyce Byers', image: null }
      ]
    }
  },
  {
    key: 'tv-1399',
    type: 'tv',
    title: 'Taht Oyunları',
    original_title: 'Game of Thrones',
    tagline: 'Kış geliyor.',
    overview: 'Westeros\'un yedi krallığının kontrolü için soylu aileler arasında verilen destansı bir güç savaşı ve kuzeyden yaklaşan antik tehdit.',
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
    categories: ['popular', 'top_rated', 'most_watched'],
    credits: {
      cast: [
        { name: 'Emilia Clarke', character: 'Daenerys Targaryen', image: null },
        { name: 'Kit Harington', character: 'Jon Snow', image: null },
        { name: 'Peter Dinklage', character: 'Tyrion Lannister', image: null }
      ]
    }
  },
  {
    key: 'tv-87108',
    type: 'tv',
    title: 'Chernobyl',
    original_title: 'Chernobyl',
    tagline: 'Yalanların bedeli nedir?',
    overview: 'Nisan 1986\'da Çernobil Nükleer Santrali\'ndeki felaketi ve insanlığın daha büyük bir yıkımdan kurtulması için hayatlarını feda eden kahramanların hikayesini anlatıyor.',
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
    categories: ['popular', 'top_rated', 'most_watched'],
    credits: {
      cast: [
        { name: 'Jared Harris', character: 'Valery Legasov', image: null },
        { name: 'Stellan Skarsgård', character: 'Boris Shcherbina', image: null }
      ]
    }
  },

  // ==========================================
  // ANİMELER (ANIME)
  // ==========================================
  {
    key: 'anime-16498',
    type: 'anime',
    title: 'Titan\'a Saldırı (Shingeki no Kyojin)',
    original_title: 'Attack on Titan',
    tagline: 'Eğer kazanırsak yaşarız. Savaşmazsak kazanamayız.',
    overview: 'İnsanlık, devasa insansı canavarlar olan Titanlardan korunmak için üç devasa surun içine sığınmıştır. Eren Yeager ailesini kaybettikten sonra tüm Titanları yok etmeye yemin eder.',
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
    categories: ['popular', 'trending', 'top_rated', 'most_watched'],
    characters: [
      { name: 'Eren Yeager', role: 'Main', image: 'https://cdn.myanimelist.net/images/characters/10/386835.jpg' },
      { name: 'Mikasa Ackerman', role: 'Main', image: 'https://cdn.myanimelist.net/images/characters/9/215563.jpg' },
      { name: 'Levi Ackerman', role: 'Supporting', image: 'https://cdn.myanimelist.net/images/characters/2/241413.jpg' }
    ]
  },
  {
    key: 'anime-1535',
    type: 'anime',
    title: 'Ölüm Defteri (Death Note)',
    original_title: 'Death Note',
    tagline: 'Adı yazılan kişi ölecektir.',
    overview: 'Zeki lise öğrencisi Light Yagami, adı yazılan herkesin ölmesini sağlayan gizemli bir defter bulur ve suçluları yok ederek ideal bir dünya yaratmaya girişir.',
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
    categories: ['popular', 'top_rated', 'most_watched'],
    characters: [
      { name: 'Light Yagami', role: 'Main', image: 'https://cdn.myanimelist.net/images/characters/6/63870.jpg' },
      { name: 'L Lawliet', role: 'Main', image: 'https://cdn.myanimelist.net/images/characters/10/249647.jpg' },
      { name: 'Ryuk', role: 'Supporting', image: 'https://cdn.myanimelist.net/images/characters/5/293233.jpg' }
    ]
  },
  {
    key: 'anime-52991',
    type: 'anime',
    title: 'Frieren: Yolculuğun Sonu',
    original_title: 'Sousou no Frieren',
    tagline: 'Zaman akıp gider, hatıralar kalır.',
    overview: 'Şeytan Kralı yenen kahraman partisinin büyücüsü olan elf Frieren, ölümsüz ömrünün insan arkadaşlarının ölümleriyle nasıl değiştiğini keşfetmek için yeni bir yolculuğa çıkar.',
    poster: 'https://cdn.myanimelist.net/images/anime/1015/138006.jpg',
    backdrop: null,
    rating: 9.4,
    year: '2023',
    duration: 24,
    number_of_seasons: 1,
    number_of_episodes: 28,
    genres: ['Macera', 'Dram', 'Fantastik'],
    status: 'Ended',
    trailer: 'https://www.youtube.com/watch?v=qgQunxD0qMo',
    categories: ['popular', 'trending', 'new', 'top_rated', 'most_watched'],
    characters: [
      { name: 'Frieren', role: 'Main', image: 'https://cdn.myanimelist.net/images/characters/5/523091.jpg' },
      { name: 'Fern', role: 'Main', image: 'https://cdn.myanimelist.net/images/characters/9/523092.jpg' },
      { name: 'Stark', role: 'Main', image: 'https://cdn.myanimelist.net/images/characters/7/523093.jpg' }
    ]
  },
  {
    key: 'anime-38000',
    type: 'anime',
    title: 'İblis Keser (Demon Slayer)',
    original_title: 'Kimetsu no Yaiba',
    tagline: 'Kılıcınla kaderini kes.',
    overview: 'Ailesi iblisler tarafından katledilen ve kız kardeşi bir iblise dönüşen Tanjiro Kamado, kız kardeşini tekrar insana dönüştürmek için İblis Kesici Birliği\'ne katılır.',
    poster: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg',
    backdrop: null,
    rating: 8.8,
    year: '2019',
    duration: 24,
    number_of_seasons: 4,
    number_of_episodes: 55,
    genres: ['Aksiyon', 'Fantastik', 'Tarihi'],
    status: 'Returning Series',
    trailer: 'https://www.youtube.com/watch?v=6vMuWuWlW4I',
    categories: ['popular', 'trending', 'new', 'most_watched'],
    characters: [
      { name: 'Tanjiro Kamado', role: 'Main', image: null },
      { name: 'Nezuko Kamado', role: 'Main', image: null },
      { name: 'Zenitsu Agatsuma', role: 'Main', image: null }
    ]
  },
  {
    key: 'anime-51009',
    type: 'anime',
    title: 'Jujutsu Kaisen Sezon 2',
    original_title: 'Jujutsu Kaisen 2nd Season',
    tagline: 'Lanetleri yok etmek için lanetlen.',
    overview: 'Gojo Satoru ve Geto Suguru\'nun geçmişine ışık tutan gizemli olaylar ve dünyayı sarsacak Shibuya Olayı.',
    poster: 'https://cdn.myanimelist.net/images/anime/1792/138042.jpg',
    backdrop: null,
    rating: 9.0,
    year: '2023',
    duration: 24,
    number_of_seasons: 2,
    number_of_episodes: 47,
    genres: ['Aksiyon', 'Fantastik', 'Doğaüstü'],
    status: 'Returning Series',
    trailer: 'https://www.youtube.com/watch?v=O6qvieoZZE8',
    categories: ['popular', 'trending', 'new', 'top_rated', 'most_watched'],
    characters: [
      { name: 'Satoru Gojo', role: 'Main', image: null },
      { name: 'Yuji Itadori', role: 'Main', image: null },
      { name: 'Megumi Fushiguro', role: 'Main', image: null }
    ]
  },
  {
    key: 'anime-52299',
    type: 'anime',
    title: 'Solo Leveling (Ore dake Level Up na Ken)',
    original_title: 'Solo Leveling',
    tagline: 'En zayıf avcıdan en güçlü gölge lorduna.',
    overview: 'İnsanlığın en zayıf E-seviye avcısı Sung Jinwoo, gizemli bir çift zindanda ölümün kıyısına geldikten sonra yalnızca kendisinin görebildiği bir seviye atlama sisteminin sahibi olur.',
    poster: 'https://cdn.myanimelist.net/images/anime/1170/141042.jpg',
    backdrop: null,
    rating: 8.7,
    year: '2024',
    duration: 24,
    number_of_seasons: 1,
    number_of_episodes: 12,
    genres: ['Aksiyon', 'Macera', 'Fantastik'],
    status: 'Returning Series',
    trailer: 'https://www.youtube.com/watch?v=s8cR_G4m37s',
    categories: ['popular', 'trending', 'new', 'most_watched'],
    characters: [
      { name: 'Sung Jinwoo', role: 'Main', image: null }
    ]
  }
];

export function getTrending(type: string = 'movie', filter: string = 'popular', page: number = 1, limit: number = 20) {
  const filtered = ALL_CONTENT.filter(item => {
    if (type !== 'all' && item.type !== type) return false;
    if (filter && item.categories && !item.categories.includes(filter)) {
      // If not in specific category list, fallback to type matches
      return true;
    }
    return true;
  });

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
      (item.overview && item.overview.toLowerCase().includes(q))
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
