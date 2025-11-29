import { useState, useEffect } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { Heart, Share2, MessageCircle, Calendar, User, ArrowLeft, Send, Eye, Stethoscope, Activity, Brain, Shield } from 'lucide-react';

interface Comment {
  id: number;
  text: string;
  author: string;
  date: string;
}

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  content: string;
  image: string;
  date: string;
  author: string;
  likes: number;
  comments: Comment[];
  category: string;
  isLiked: boolean; // Added for like tracking
}

const defaultNewsData: NewsItem[] = [
  {
    id: 1,
    title: "SanaTech Meluncurkan Fitur Monitoring Stress Real-time Terbaru",
    summary: "Teknologi sensor biofeedback terdepan untuk mendeteksi tingkat stress dengan akurasi 98% menggunakan analisis multi-modal sensing.",
    content: "SanaTech dengan bangga mengumumkan peluncuran fitur monitoring stress real-time yang revolusioner. Sistem biofeedback non-invasif ini menggunakan kombinasi sensor detak jantung, variabilitas HRV, dan analisis pola pernapasan untuk memberikan insight mendalam tentang kondisi mental pengguna.\n\nFitur baru ini dilengkapi dengan algoritma machine learning yang telah dilatih menggunakan data dari ribuan pengguna, memungkinkan deteksi dini kondisi stress sebelum mencapai level berbahaya. Pengguna dapat menerima notifikasi real-time beserta rekomendasi latihan pernapasan dan teknik relaksasi yang dipersonalisasi.\n\nDr. Maya Sari, Lead Researcher SanaTech, menjelaskan: 'Kami percaya bahwa pencegahan lebih baik daripada pengobatan. Dengan teknologi ini, setiap orang dapat memantau kesehatan mental mereka secara proaktif dan mengambil tindakan preventif yang tepat.'\n\nFitur ini akan tersedia melalui update aplikasi SanaTech versi 3.2 yang dapat diunduh mulai minggu depan di Google Play Store dan App Store.",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
    date: "2024-08-15",
    author: "Tim SanaTech",
    likes: 156,
    comments: [
      {
        id: 1,
        text: "Teknologi yang sangat menarik! Apakah sudah ada uji klinis untuk validasi akurasi?",
        author: "Dr. Ahmad Rahman",
        date: "2024-08-16"
      }
    ],
    category: "Teknologi",
    isLiked: false
  },
  {
    id: 2,
    title: "Publikasi Ilmiah SanaTech di Journal of Digital Health Technology",
    summary: "Penelitian breakthrough tentang efektivitas sistem biofeedback multi-modal untuk monitoring kesehatan mental dipublikasikan di journal internasional bergengsi.",
    content: "Tim peneliti SanaTech berhasil mempublikasikan hasil penelitian groundbreaking mereka di Journal of Digital Health Technology, salah satu publikasi ilmiah paling bergengsi di bidang teknologi kesehatan digital.\n\nPenelitian yang berjudul 'Multi-modal Biofeedback Systems for Real-time Mental Health Assessment: A Comprehensive Analysis' ini melaporkan hasil uji klinis selama 12 bulan dengan melibatkan 2,500 partisipan dari berbagai demografis.\n\nHasil penelitian menunjukkan bahwa sistem SanaTech mampu mendeteksi perubahan kondisi mental dengan akurasi 94.7%, melampaui metode konvensional yang hanya mencapai 78.2%. Lebih mengejutkan lagi, sistem ini berhasil memprediksi episode anxiety dan depression hingga 3 hari sebelum gejala klinis muncul.\n\nProf. Dr. Budi Santoso, Principal Investigator, menyatakan: 'Ini adalah terobosan signifikan dalam bidang digital mental health. Teknologi SanaTech membuka jalan bagi era baru preventive mental healthcare yang berbasis data dan evidence-based.'\n\nPublikasi ini diharapkan akan mempercepat adopsi teknologi biofeedback dalam sistem healthcare global dan membuka peluang kolaborasi dengan institusi kesehatan internasional.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop",
    date: "2024-08-12",
    author: "Dr. Budi Santoso",
    likes: 289,
    comments: [
      {
        id: 1,
        text: "Luar biasa! Hasil penelitian ini akan mengubah paradigma mental health screening.",
        author: "Prof. Sarah Chen",
        date: "2024-08-13"
      },
      {
        id: 2,
        text: "Bagaimana metodologi untuk prediksi 3 hari sebelumnya? Apakah menggunakan pattern recognition?",
        author: "Dr. Lisa Wang",
        date: "2024-08-13"
      }
    ],
    category: "Penelitian",
    isLiked: false
  },
  {
    id: 3,
    title: "Webinar Eksklusif: Future of Mental Health Monitoring with SanaTech",
    summary: "Bergabunglah dengan para ahli dalam diskusi mendalam tentang masa depan monitoring kesehatan mental menggunakan teknologi biofeedback terdepan.",
    content: "SanaTech mengundang Anda untuk mengikuti webinar eksklusif bertema 'Future of Mental Health Monitoring with SanaTech' yang akan diselenggarakan pada Sabtu, 25 Agustus 2024, pukul 10.00 - 12.00 WIB.\n\nWebinar ini akan menghadirkan lineup pembicara yang luar biasa, termasuk:\n- Dr. Sarah Chen, Mental Health Technology Expert dari Stanford University\n- Prof. Ahmad Rahman, Direktur Institute for Digital Health Innovation\n- Dr. Lisa Wang, Clinical Psychologist dan Early Adopter SanaTech\n- Tim Engineering SanaTech\n\nAgenda yang akan dibahas meliputi:\n1. Evolusi teknologi monitoring kesehatan mental\n2. Demo live fitur-fitur terbaru SanaTech\n3. Case study implementasi SanaTech di berbagai setting klinis\n4. Roadmap pengembangan SanaTech 2025-2030\n5. Q&A session dengan para ahli\n\nPeserta akan mendapatkan:\n- E-certificate keikutsertaan\n- Early access ke fitur beta SanaTech Pro\n- Konsultasi gratis dengan tim clinical advisor\n- Networking opportunity dengan professional di bidang digital health\n\nPendaftaran terbatas untuk 500 peserta pertama. Daftar sekarang melalui link yang tersedia di aplikasi SanaTech atau website resmi kami.",
    image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=250&fit=crop",
    date: "2024-08-10",
    author: "Event Team SanaTech",
    likes: 423,
    comments: [
      {
        id: 1,
        text: "Sudah mendaftar! Sangat excited untuk demo live fitur terbaru.",
        author: "Dr. Maya Sari",
        date: "2024-08-11"
      }
    ],
    category: "Event",
    isLiked: false
  }
];

const NewsPage = () => {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [newComment, setNewComment] = useState('');

  // Load data dari localStorage saat komponen dimount
  useEffect(() => {
    const savedNews = localStorage.getItem('sanatech_news');
    if (savedNews) {
      try {
        setNewsItems(JSON.parse(savedNews));
      } catch (error) {
        console.error('Error parsing saved news:', error);
        setNewsItems(defaultNewsData);
      }
    } else {
      setNewsItems(defaultNewsData);
    }
  }, []);

  // Save data ke localStorage setiap kali newsItems berubah
  useEffect(() => {
    if (newsItems.length > 0) {
      localStorage.setItem('sanatech_news', JSON.stringify(newsItems));
    }
  }, [newsItems]);

  // Fungsi untuk handle like/unlike news
  const handleLike = (newsId: number) => {
    setNewsItems(prevNews => 
      prevNews.map(news => {
        if (news.id === newsId) {
          const newIsLiked = !news.isLiked;
          const newLikes = newIsLiked ? news.likes + 1 : news.likes - 1;
          return { ...news, isLiked: newIsLiked, likes: newLikes };
        }
        return news;
      })
    );

    // Update selectedNews jika sedang melihat detail
    if (selectedNews && selectedNews.id === newsId) {
      const newIsLiked = !selectedNews.isLiked;
      const newLikes = newIsLiked ? selectedNews.likes + 1 : selectedNews.likes - 1;
      setSelectedNews({ ...selectedNews, isLiked: newIsLiked, likes: newLikes });
    }
  };

  // Fungsi untuk handle share dengan Web Share API
  const handleShare = async (news: NewsItem) => {
    const shareData = {
      title: news.title,
      text: `${news.summary.substring(0, 100)}...`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback untuk browser yang tidak support Web Share API
        await navigator.clipboard.writeText(`${news.title}\n\n${news.summary}\n\n${shareData.url}`);
        alert('Artikel berhasil disalin ke clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback sederhana
      alert(`Artikel "${news.title}" berhasil dibagikan!`);
    }
  };

  // Fungsi untuk menambahkan komentar
  const handleAddComment = (newsId: number) => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now(),
      text: newComment.trim(),
      author: 'Anda',
      date: new Date().toLocaleDateString('id-ID')
    };

    setNewsItems(prevNews => 
      prevNews.map(news =>
        news.id === newsId
          ? { ...news, comments: [...news.comments, comment] }
          : news
      )
    );

    // Update selectedNews jika sedang melihat detail
    if (selectedNews && selectedNews.id === newsId) {
      setSelectedNews({
        ...selectedNews,
        comments: [...selectedNews.comments, comment]
      });
    }

    setNewComment('');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Teknologi':
        return <Activity className="w-4 h-4" />;
      case 'Penelitian':
        return <Brain className="w-4 h-4" />;
      case 'Event':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Stethoscope className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Teknologi':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Penelitian':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Event':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const NewsList = () => (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {newsItems.map((news) => (
          <article 
            key={news.id}
            className="bg-white rounded-xl md:rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
          >
            <div 
              onClick={() => setSelectedNews(news)}
              className="cursor-pointer"
            >
              <div className="relative">
                <img 
                  src={news.image} 
                  alt={news.title}
                  className="w-full h-40 sm:h-48 md:h-52 object-cover"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md">
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                </div>
                <div className={`absolute top-3 left-3 flex items-center space-x-1 px-2 py-1 rounded-full border ${getCategoryColor(news.category)} backdrop-blur-sm`}>
                  {getCategoryIcon(news.category)}
                  <span className="text-xs font-medium">{news.category}</span>
                </div>
              </div>
              
              <div className="p-4 sm:p-5">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 sm:mb-3 line-clamp-2 leading-tight">
                  {news.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                  {news.summary}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(news.date).toLocaleDateString('id-ID')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Stethoscope className="w-3 h-3" />
                    <span className="truncate max-w-20 sm:max-w-none">{news.author}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-4 sm:px-5 pb-4 sm:pb-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(news.id);
                    }}
                    className={`flex items-center space-x-1 transition-colors group ${
                      news.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 group-hover:scale-110 transition-transform ${
                      news.isLiked ? 'fill-current' : ''
                    }`} />
                    <span className="text-sm font-medium">{news.likes}</span>
                  </button>
                  <div className="flex items-center space-x-1 text-blue-600">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">{news.comments.length}</span>
                  </div>
                </div>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare(news);
                  }}
                  className="flex items-center space-x-1 bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 py-1.5 rounded-full hover:shadow-lg transition-all text-xs font-medium"
                >
                  <Share2 className="w-3 h-3" />
                  <span className="hidden sm:inline">Share</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );

  const NewsDetail = ({ news }: { news: NewsItem }) => (
    <div className="bg-white min-h-screen">
      <div className="sticky top-0 bg-gradient-to-r from-blue-600 via-green-500 to-teal-600 rounded-b-2xl mx-2 mb-4 shadow-lg z-10">
        <div className="flex items-center space-x-3 p-4">
          <button 
            onClick={() => setSelectedNews(null)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2">
            <Stethoscope className="w-5 h-5 text-white" />
            <h1 className="text-white text-lg font-bold flex-1">Detail Berita Kesehatan</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <img 
          src={news.image} 
          alt={news.title}
          className="w-full h-48 sm:h-64 lg:h-80 object-cover rounded-xl sm:rounded-2xl mb-4 sm:mb-6"
        />
        
        <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border ${getCategoryColor(news.category)} mb-4`}>
          {getCategoryIcon(news.category)}
          <span className="text-sm font-medium">{news.category}</span>
        </div>
        
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 leading-tight">
          {news.title}
        </h1>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500 mb-6 pb-4 border-b gap-2">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(news.date).toLocaleDateString('id-ID')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Stethoscope className="w-4 h-4" />
            <span>{news.author}</span>
          </div>
        </div>
        
        <div className="prose prose-gray max-w-none mb-8">
          {news.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-gray-700 mb-4 leading-relaxed text-sm sm:text-base">
              {paragraph}
            </p>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 border-t border-b mb-6 gap-4">
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => handleLike(news.id)}
              className={`flex items-center space-x-2 transition-colors group ${
                news.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <Heart className={`w-5 h-5 group-hover:scale-110 transition-transform ${
                news.isLiked ? 'fill-current' : ''
              }`} />
              <span className="font-medium">{news.likes}</span>
            </button>
            <div className="flex items-center space-x-2 text-blue-600">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">{news.comments.length}</span>
            </div>
          </div>
          
          <button 
            onClick={() => handleShare(news)}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2.5 rounded-full hover:shadow-lg transition-all font-medium"
          >
            <Share2 className="w-4 h-4" />
            <span>Bagikan Artikel</span>
          </button>
        </div>
        
        {/* Comment Section */}
        <div className="space-y-6 pb-20 sm:pb-8">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-800">
              Diskusi Medis ({news.comments.length})
            </h3>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <input
              type="text"
              placeholder="Tulis komentar profesional..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment(news.id)}
            />
            <button 
              onClick={() => handleAddComment(news.id)}
              disabled={!newComment.trim()}
              className={`rounded-xl px-6 py-3 transition-all font-medium sm:w-auto w-full flex items-center justify-center space-x-2 ${
                newComment.trim()
                  ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
              <span>Kirim</span>
            </button>
          </div>
          
          <div className="space-y-4">
            {news.comments.map((comment) => (
              <div key={comment.id} className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 sm:p-5 border border-blue-100">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800 text-sm sm:text-base">{comment.author}</span>
                    <span className="text-gray-500 text-xs sm:text-sm ml-2">{comment.date}</span>
                  </div>
                </div>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed ml-11 sm:ml-13">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <IonPage>
      {!selectedNews ? (
        <IonContent fullscreen className="[--ion-background-color:#f1f5f9]">
          <div className="min-h-full pb-20 sm:pb-6">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 via-green-500 to-teal-600 rounded-b-2xl mx-2 mb-6 p-4 sm:p-6 text-white shadow-lg">
              <div className="flex items-center space-x-3 mb-3">
                <Stethoscope className="w-6 h-6 sm:w-8 sm:h-8" />
                <h2 className="text-xl sm:text-2xl font-bold">SanaTech Medical News</h2>
              </div>
              <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
                Berita terkini seputar inovasi teknologi kesehatan digital dan penelitian medis terdepan
              </p>
              <div className="flex items-center space-x-4 mt-4 text-blue-100 text-xs sm:text-sm">
                <div className="flex items-center space-x-1">
                  <Activity className="w-4 h-4" />
                  <span>Real-time Updates</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Brain className="w-4 h-4" />
                  <span>Research Based</span>
                </div>
              </div>
            </div>
            
            <NewsList />
          </div>
        </IonContent>
      ) : (
        <IonContent fullscreen className="[--ion-background-color:#ffffff]">
          <NewsDetail news={selectedNews} />
        </IonContent>
      )}
    </IonPage>
  );
};

export default NewsPage;