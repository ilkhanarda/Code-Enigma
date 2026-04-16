export const QUESTIONS = [
  {
    id: 1,
    topic: "Güvenirlik",
    difficulty: "Kolay",
    questionText: "Güvenirlik katsayısı (rₓ) hangi aralıkta değer alır?",
    image: null,
    options: [
      { key: "A", text: "0 ile 100 arasında" },
      { key: "B", text: "−1 ile +1 arasında" },
      { key: "C", text: "0 ile 1 arasında" },
      { key: "D", text: "1 ile 10 arasında" },
      { key: "E", text: "Sınırsız değer alır" },
    ],
    correctAnswer: "C",
    explanation:
      "Güvenirlik katsayısı (rₓ) 0 ile 1 arasında değer alır. 0 tam güvensizliği, 1 ise mükemmel güvenirliği ifade eder. Varyans oranı olarak tanımlandığından negatif değer almaz.",
    hint: "Güvenirlik bir oran olduğunu düşünün; yüzde gibi 0'dan başlar, 1'de tamamlanır.",
  },
  {
    id: 2,
    topic: "Ölçmenin Standart Hatası",
    difficulty: "Orta",
    questionText: "ÖSH = S · √(1 − rₓ) formülünde 'S' neyi temsil eder?",
    image: null,
    options: [
      { key: "A", text: "Standart ölçüm hatasını" },
      { key: "B", text: "Testin standart sapmasını" },
      { key: "C", text: "Örneklem büyüklüğünü" },
      { key: "D", text: "Güvenirlik katsayısını" },
      { key: "E", text: "Ortalama puanı" },
    ],
    correctAnswer: "B",
    explanation:
      "S, testin standart sapmasını temsil eder. Formülde standart sapma yükseldikçe ölçüm hatası da artar. rₓ ise güvenirlik katsayısıdır.",
    hint: "Formüldeki harfler genellikle istatistiksel sembollere karşılık gelir. S istatistikte hangi ölçüyle ilişkilidir?",
  },
  {
    id: 3,
    topic: "Güvenirlik Örnekleri",
    difficulty: "Orta",
    questionText: "rₓ = 0.96 ve S = 25 iken ÖSH yaklaşık kaçtır?",
    image: null,
    options: [
      { key: "A", text: "25" },
      { key: "B", text: "5" },
      { key: "C", text: "12" },
      { key: "D", text: "0.96" },
      { key: "E", text: "1" },
    ],
    correctAnswer: "B",
    explanation:
      "ÖSH = 25 · √(1 − 0.96) = 25 · √0.04 = 25 · 0.2 = 5. Yüksek güvenirlik küçük bir ölçüm hatası üretir.",
    hint: "Önce parantez içini hesaplayın, ardından karekök alın ve S ile çarpın.",
  },
  {
    id: 4,
    topic: "Güvenirlik Yöntemleri",
    difficulty: "Orta",
    questionText: "Cronbach alfa katsayısı hangi güvenirlik türünü ölçer?",
    image: null,
    options: [
      { key: "A", text: "Test-tekrar test güvenirliği" },
      { key: "B", text: "Paralel form güvenirliği" },
      { key: "C", text: "İç tutarlılık güvenirliği" },
      { key: "D", text: "Gözlemciler arası güvenirlik" },
      { key: "E", text: "Kapsam geçerliği" },
    ],
    correctAnswer: "C",
    explanation:
      "Cronbach alfa (α), bir testin maddelerinin birbiriyle ne kadar tutarlı olduğunu gösteren iç tutarlılık katsayısıdır. α ≥ 0.70 genellikle kabul edilebilir sınır olarak alınır.",
    hint: "Cronbach alfa, tek bir uygulamadan elde edilir ve madde tutarlılığını ölçer.",
  },
  {
    id: 5,
    topic: "Geçerlik",
    difficulty: "Kolay",
    questionText:
      "Bir testin ölçmek istediği özelliği gerçekten ölçmesi hangi kavramla ilgilidir?",
    image: null,
    options: [
      { key: "A", text: "Güvenirlik" },
      { key: "B", text: "Ölçüm hatası" },
      { key: "C", text: "Geçerlik" },
      { key: "D", text: "Normallik" },
      { key: "E", text: "Yeterlik" },
    ],
    correctAnswer: "C",
    explanation:
      "Geçerlik, bir ölçme aracının ölçmeyi amaçladığı özelliği doğru biçimde ölçüp ölçmediğiyle ilgilidir. Güvenirlik tutarlılığı, geçerlik ise doğruluğu ifade eder.",
    hint: "Bir terazi her seferinde aynı sonucu veriyorsa güvenilirdir ama tartmak istediğinizi mi tartıyor?",
  },
  {
    id: 6,
    topic: "Güvenirlik Eşiği",
    difficulty: "Zor",
    questionText:
      "Bireysel klinik karar almada önerilen minimum güvenirlik eşiği nedir?",
    image: null,
    options: [
      { key: "A", text: "0.50" },
      { key: "B", text: "0.60" },
      { key: "C", text: "0.70" },
      { key: "D", text: "0.80" },
      { key: "E", text: "0.90" },
    ],
    correctAnswer: "E",
    explanation:
      "Yüksek riskli bireysel kararlar (klinik tanı, yetenek seçimi) için rₓ ≥ 0.90 önerilir. Grup düzeyinde araştırmalarda ise 0.70 yeterli kabul edilir.",
    hint: "Bireysel kararlar hata payına daha az toleranslıdır, dolayısıyla eşik daha yüksektir.",
  },
  {
    id: 7,
    topic: "Test-Tekrar Test",
    difficulty: "Orta",
    questionText: "Test-tekrar test güvenirlik yönteminin temel sınırlılığı nedir?",
    image: null,
    options: [
      { key: "A", text: "Hesaplaması çok karmaşıktır" },
      { key: "B", text: "Yalnızca çoktan seçmeli testlere uygulanır" },
      { key: "C", text: "Öğrenme ve hatırlama etkilerinden etkilenir" },
      { key: "D", text: "Paralel form gerektirmesi" },
      { key: "E", text: "Madde sayısına bağlı olması" },
    ],
    correctAnswer: "C",
    explanation:
      "Test-tekrar test yönteminde aynı test iki kez uygulanır. Birinci uygulama öğrenmeyi tetikleyebilir; bu durum ikinci uygulamada güvenirliği yapay olarak yükseltir.",
    hint: "Aynı soruları iki kez gördüğünüzde ne olur?",
  },
  {
    id: 8,
    topic: "Ölçüm",
    difficulty: "Zor",
    questionText:
      "Gözlenen puan, gerçek puan ve hata arasındaki klasik test teorisi ilişkisi hangisidir?",
    image: null,
    options: [
      { key: "A", text: "Gözlenen = Gerçek − Hata" },
      { key: "B", text: "Gözlenen = Gerçek × Hata" },
      { key: "C", text: "Gerçek = Gözlenen + Hata" },
      { key: "D", text: "Gözlenen = Gerçek + Hata" },
      { key: "E", text: "Hata = Gerçek ÷ Gözlenen" },
    ],
    correctAnswer: "D",
    explanation:
      "Klasik Test Teorisi'ne (KTT) göre: Gözlenen Puan = Gerçek Puan + Hata Puanı. Her ölçümde rastgele hata bileşeni bulunur.",
    hint: "Gerçek değeri tam ölçemeyiz; ölçüme her zaman bir hata eklenir.",
  },
];
