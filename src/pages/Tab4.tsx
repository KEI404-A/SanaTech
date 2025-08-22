import React, { useState } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { Search, BookOpen, Brain, Users, Zap, Smartphone, Globe, TrendingUp, ChevronRight, Star, Clock } from 'lucide-react';

// --- Definisi Tipe untuk Props ---
interface Article {
  id: number;
  title: string;
  category: string;
  readTime: string;
  rating: number;
  summary: string;
  content: string;
  tags: string[];
  author: string;
  publishDate: string;
}

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
}
// --- Akhir Definisi Tipe ---

const Tab4: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const categories: Category[] = [
    { id: 'all', name: 'Semua', icon: BookOpen, color: 'from-gray-400 to-slate-500' },
    { id: 'digital-wellness', name: 'Digital Wellness', icon: Smartphone, color: 'from-blue-400 to-cyan-500' },
    { id: 'ai-psychology', name: 'AI & Psikologi', icon: Brain, color: 'from-purple-400 to-violet-500' },
    { id: 'social-tech', name: 'Teknologi Sosial', icon: Users, color: 'from-green-400 to-emerald-500' },
    { id: 'biofeedback', name: 'Biofeedback', icon: Zap, color: 'from-yellow-400 to-orange-500' },
    { id: 'future-mind', name: 'Masa Depan Mental', icon: Globe, color: 'from-indigo-400 to-purple-500' }
  ];

  const articles: Article[] = [
    {
      id: 1,
      title: 'Digital Detox di Era Society 5.0',
      category: 'digital-wellness',
      readTime: '8 menit',
      rating: 4.8,
      summary: 'Strategi mengelola ketergantungan digital dan menjaga keseimbangan mental di dunia yang semakin terhubung.',
      content: `\n# Digital Detox di Era Society 5.0\n\n## Mengapa Digital Detox Penting?\n\nDi era Society 5.0, teknologi telah terintegrasi sepenuhnya dalam kehidupan sehari-hari. Namun, paparan berlebihan terhadap teknologi digital dapat menyebabkan:\n\n- **Digital Fatigue**: Kelelahan mental akibat stimulasi berlebih\n- **Attention Fragmentation**: Terpecahnya fokus karena multitasking\n- **FOMO (Fear of Missing Out)**: Kecemasan tertinggal dari informasi\n- **Sleep Disruption**: Gangguan pola tidur akibat blue light\n- **Social Isolation**: Paradoks terhubung digital namun terisolasi sosial\n\n## Strategi Digital Detox yang Efektif\n\n### 1. Mindful Technology Use\n- Tetapkan waktu khusus untuk mengecek media sosial\n- Gunakan mode "Do Not Disturb" selama aktivitas penting\n- Praktikkan "phone-free zones" di rumah\n\n### 2. Digital Sunset Ritual\n- Matikan semua perangkat 1 jam sebelum tidur\n- Ganti scrolling dengan membaca buku atau meditasi\n- Gunakan alarm fisik, bukan smartphone\n\n### 3. Conscious Consumption\n- Curate feed media sosial dengan konten positif\n- Unfollow akun yang menimbulkan kecemasan\n- Batasi konsumsi berita negatif\n\n## Teknologi untuk Mendukung Digital Wellness\n\nSociety 5.0 juga menawarkan solusi teknologi untuk digital wellness:\n- **AI Assistant** yang mengingatkan break time\n- **Biofeedback apps** untuk monitoring stress real-time\n- **Smart environment** yang menyesuaikan lighting berdasarkan circadian rhythm\n      `,
      tags: ['digital wellness', 'teknologi', 'kesehatan mental'],
      author: 'Dr. Maya Sari',
      publishDate: '2025-06-10'
    },
    {
      id: 2,
      title: 'Kecerdasan Buatan dan Empati Manusia',
      category: 'ai-psychology',
      readTime: '12 menit',
      rating: 4.9,
      summary: 'Bagaimana AI mengubah cara kita berinteraksi dan memahami emosi, serta dampaknya terhadap empati manusia.',
      content: `\n# Kecerdasan Buatan dan Empati Manusia\n\n## Evolusi Interaksi Manusia-AI\n\nDalam Society 5.0, AI bukan lagi sekadar tool, melainkan companion yang dapat:\n- Memahami emosi melalui voice recognition\n- Memberikan respons empatik berdasarkan context\n- Memprediksi kebutuhan psikologis pengguna\n\n## Dampak Positif AI terhadap Empati\n\n### 1. Enhanced Emotional Intelligence\nAI dapat membantu manusia:\n- Mengenali pattern emosi diri sendiri\n- Memberikan feedback real-time tentang state emosional\n- Menyarankan strategi coping yang personal\n\n### 2. Accessibility dalam Mental Health\n- AI therapist tersedia 24/7\n- Mengurangi stigma dalam mencari bantuan\n- Biaya lebih terjangkau untuk terapi\n\n### 3. Personalized Learning\nAI dapat mengadaptasi pendekatan berdasarkan:\n- Gaya komunikasi individu\n- Trauma history dan trigger points\n- Preferensi treatment methodology\n\n## Risiko dan Tantangan\n\n### 1. Empathy Atrophy\nKetergantungan pada AI empathy dapat:\n- Mengurangi kemampuan empati natural\n- Menurunkan toleransi terhadap human imperfection\n- Menciptakan expectation yang unrealistic\n\n### 2. Emotional Manipulation\nAI yang terlalu persuasif dapat:\n- Mengeksploitasi kerentanan emosional\n- Menciptakan ketergantungan yang tidak sehat\n- Menggantikan hubungan manusia authentic\n\n## Best Practices untuk Healthy AI-Human Relationship\n\n1. **Conscious Integration**: Gunakan AI sebagai supplement, bukan replacement\n2. **Regular Human Connection**: Maintain real social relationships\n3. **Privacy Awareness**: Pahami bagaimana data emosional digunakan\n4. **Critical Thinking**: Jangan menerima semua saran AI tanpa evaluasi\n      `,
      tags: ['AI', 'empati', 'psikologi', 'teknologi'],
      author: 'Prof. Andi Rahman',
      publishDate: '2025-06-08'
    },
    {
      id: 3,
      title: 'Biofeedback untuk Regulasi Emosi',
      category: 'biofeedback',
      readTime: '10 menit',
      rating: 4.7,
      summary: 'Memanfaatkan teknologi biofeedback untuk memahami dan mengatur respons emosional secara real-time.',
      content: `\n# Biofeedback untuk Regulasi Emosi\n\n## Apa itu Biofeedback?\n\nBiofeedback adalah teknik yang memungkinkan individu untuk memantau dan mengontrol fungsi fisiologis tubuh yang biasanya berjalan otomatis. Dalam konteks regulasi emosi, biofeedback membantu kita:\n\n- Memahami koneksi pikiran-tubuh\n- Mengenali early warning signs dari stress\n- Mengembangkan strategi coping yang efektif\n- Meningkatkan self-awareness emosional\n\n## Jenis-jenis Biofeedback untuk Emosi\n\n### 1. Heart Rate Variability (HRV)\n- Mengukur variasi interval antara detak jantung\n- Indikator stress dan recovery\n- Dapat dilatih melalui breathing exercises\n\n### 2. Galvanic Skin Response (GSR)\n- Mengukur konduktansi kulit\n- Mendeteksi arousal emosional\n- Berguna untuk anxiety management\n\n### 3. EEG Neurofeedback\n- Monitoring aktivitas gelombang otak\n- Training untuk focus dan relaxation\n- Efektif untuk ADHD dan anxiety\n\n## Aplikasi Praktis\n\n### Stress Management\n- Real-time monitoring stress levels\n- Guided breathing exercises\n- Progressive muscle relaxation\n\n### Emotional Regulation Training\n- Mindfulness meditation dengan feedback\n- Cognitive reframing techniques\n- Emotional awareness building\n\n## Teknologi Biofeedback Modern\n\nWearable devices seperti:\n- Smartwatch dengan HRV monitoring\n- Stress tracking rings\n- EEG headbands untuk meditation\n- Mobile apps dengan biofeedback integration\n      `,
      tags: ['biofeedback', 'regulasi emosi', 'stress management', 'teknologi'],
      author: 'Dr. Lisa Wijaya',
      publishDate: '2025-06-05'
    },
    {
      id: 4,
      title: 'Social Media dan Kesehatan Mental Gen Z',
      category: 'social-tech',
      readTime: '15 menit',
      rating: 4.6,
      summary: 'Analisis mendalam tentang dampak media sosial terhadap kesehatan mental generasi Z dan strategi mitigasinya.',
      content: `\n# Social Media dan Kesehatan Mental Gen Z\n\n## Landscape Digital Gen Z\n\nGenerasi Z adalah digital natives yang tumbuh dengan social media. Karakteristik unik mereka:\n\n- Multitasking across multiple platforms\n- Visual-first communication style\n- High expectation untuk instant gratification\n- Strong social justice awareness\n- Entrepreneurial mindset\n\n## Dampak Negatif Social Media\n\n### 1. Comparison Culture\n- Constant exposure to curated lives\n- Unrealistic beauty and lifestyle standards\n- FOMO dan social anxiety\n- Decreased self-esteem\n\n### 2. Validation Seeking\n- Likes sebagai metric self-worth\n- Performative behavior untuk approval\n- Addiction to social validation\n- Identity crisis when metrics drop\n\n### 3. Information Overload\n- Constant news cycle stress\n- Misinformation exposure\n- Decision fatigue\n- Decreased attention span\n\n## Dampak Positif yang Sering Diabaikan\n\n### 1. Community Building\n- Finding like-minded individuals\n- Support groups untuk niche interests\n- Mental health awareness campaigns\n- Resource sharing dan education\n\n### 2. Creative Expression\n- Platform untuk artistic talents\n- Business opportunities\n- Skill development through tutorials\n- Global audience reach\n\n### 3. Social Activism\n- Awareness untuk social issues\n- Organizing social movements\n- Amplifying marginalized voices\n- Creating positive change\n\n## Strategi Healthy Social Media Use\n\n### For Individuals:\n1. **Digital Boundaries**: Set specific times for social media\n2. **Content Curation**: Follow accounts that inspire and educate\n3. **Reality Check**: Remember that social media ≠ real life\n4. **Offline Activities**: Maintain hobbies outside digital world\n\n### For Parents and Educators:\n1. **Digital Literacy Education**: Teach critical thinking skills\n2. **Open Communication**: Create safe space untuk discussion\n3. **Model Healthy Behavior**: Demonstrate balanced tech use\n4. **Professional Help**: Know when to seek counseling\n      `,
      tags: ['social media', 'Gen Z', 'kesehatan mental', 'teknologi sosial'],
      author: 'Dr. Reza Pratama',
      publishDate: '2025-06-03'
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const ArticleView = ({ article, onBack }: { article: Article, onBack: () => void }) => (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Article */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
            <button 
              onClick={onBack} 
              className="mb-4 flex items-center text-indigo-200 hover:text-white transition-colors duration-200"
            >
              ← Kembali ke Daftar Artikel
            </button>
            <h1 className="text-3xl font-bold mb-3 leading-tight">{article.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-indigo-200 text-sm">
              <span>By {article.author}</span>
              <span>•</span>
              <span>{article.readTime}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Star size={14} className="text-yellow-300 fill-current" />
                <span>{article.rating}</span>
              </div>
              <span>•</span>
              <span>{article.publishDate}</span>
            </div>
          </div>
          
          {/* Content Article */}
          <div className="p-8">
            <div className="prose prose-lg prose-indigo max-w-none">
              <div className="whitespace-pre-line leading-relaxed text-gray-700">
                {article.content}
              </div>
            </div>
            
            {/* Tags Section */}
            <div className="mt-10 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-4">Tags:</h4>
              <div className="flex flex-wrap gap-3">
                {article.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium hover:shadow-md transition-shadow"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const MainView = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 text-white p-8 rounded-b-3xl shadow-xl">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-3">Ensiklopedia Psikologi</h1>
          <p className="text-indigo-100 text-lg">Panduan psikologi untuk era Society 5.0</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 pb-24">
        
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Cari artikel, topik, atau kata kunci..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:shadow-xl transition-all duration-200 text-gray-700 text-lg"
          />
        </div>

        {/* Categories Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Kategori</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div 
                  key={category.id} 
                  onClick={() => setSelectedCategory(category.id)}
                  className={`cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                    selectedCategory === category.id ? 'scale-105 shadow-lg' : ''
                  }`}
                >
                  <div className={`bg-gradient-to-br ${category.color} rounded-2xl p-5 shadow-md ${
                    selectedCategory === category.id ? 'ring-4 ring-white ring-opacity-60' : ''
                  }`}>
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="bg-white/20 rounded-full p-3">
                        <IconComponent size={28} className="text-white" />
                      </div>
                      <h3 className="text-white font-semibold text-sm leading-tight">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Featured Article Banner */}
        <section className="bg-gradient-to-r from-purple-100 via-indigo-100 to-blue-100 rounded-3xl p-8 shadow-lg">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-purple-800 mb-4">✨ Artikel Unggulan</h3>
            <p className="text-purple-700 mb-6 max-w-2xl mx-auto leading-relaxed">
              Temukan insights terbaru tentang kesehatan mental di era digital dan teknologi masa depan
            </p>
            <div className="flex items-center justify-center space-x-3">
              <TrendingUp size={20} className="text-purple-600" />
              <span className="text-purple-600 font-medium">
                Trending: Biofeedback untuk Regulasi Emosi
              </span>
            </div>
          </div>
        </section>
        
        {/* Articles List Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
              {filteredArticles.length} artikel
            </span>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
            {filteredArticles.map((article) => (
              <div 
                key={article.id} 
                onClick={() => setSelectedArticle(article)}
                className="bg-white rounded-2xl p-6 shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border border-gray-100"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 pr-4">
                    <h3 className="font-bold text-gray-800 text-xl mb-3 line-clamp-2 leading-tight">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>
                  <ChevronRight size={24} className="text-gray-400 flex-shrink-0 mt-1" />
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {article.tags.slice(0, 3).map((tag, index) => (
                    <span 
                      key={index} 
                      className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-100"
                    >
                      {tag}
                    </span>
                  ))}
                  {article.tags.length > 3 && (
                    <span className="text-gray-400 text-xs px-2 py-1">
                      +{article.tags.length - 3} lainnya
                    </span>
                  )}
                </div>
                
                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock size={16} />
                      <span>{article.readTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star size={16} className="text-yellow-500 fill-current" />
                      <span className="font-medium">{article.rating}</span>
                    </div>
                  </div>
                  <span className="font-medium">By {article.author}</span>
                </div>
              </div>
            ))}
            
            {/* Empty State */}
            {filteredArticles.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                <BookOpen size={64} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-500 mb-2">
                  Tidak ada artikel yang ditemukan
                </h3>
                <p className="text-gray-400">
                  Coba ubah kata kunci pencarian atau pilih kategori lain
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );

  return (
    <IonPage>
      <IonContent fullscreen className="[--ion-background-color:#f1f5f9]">
        {selectedArticle ? (
          <ArticleView
            article={selectedArticle}
            onBack={() => setSelectedArticle(null)}
          />
        ) : (
          <MainView />
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab4;