import React, { useState, useEffect } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { MessageCircle, Heart, Share2, MoreHorizontal, Search, Plus, TrendingUp, Send, Smile, Paperclip, X, Hash } from 'lucide-react';

interface Reply {
  id: number;
  author: string;
  avatar: string;
  timestamp: string;
  content: string;
  likes: number;
  isLiked: boolean;
}

interface Post {
  id: number;
  category: string;
  author: string;
  avatar: string;
  timestamp: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  tags: string[];
  replies: Reply[];
}

interface Category {
    id: string;
    name: string;
    color: string;
}

const Tab5: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'anxiety',
    tags: ''
  });

  const categories: Category[] = [
    { id: 'all', name: 'Semua', color: 'from-gray-400 to-slate-500' },
    { id: 'anxiety', name: 'Kecemasan', color: 'from-blue-400 to-cyan-500' },
    { id: 'depression', name: 'Depresi', color: 'from-purple-400 to-violet-500' },
    { id: 'stress', name: 'Stress', color: 'from-red-400 to-pink-500' },
    { id: 'motivation', name: 'Motivasi', color: 'from-green-400 to-emerald-500' },
    { id: 'relationships', name: 'Hubungan', color: 'from-pink-400 to-rose-500' },
    { id: 'self-care', name: 'Self Care', color: 'from-yellow-400 to-orange-500' },
    { id: 'success-stories', name: 'Success Stories', color: 'from-emerald-400 to-teal-500' }
  ];

  // Default data untuk posts
  const defaultPosts: Post[] = [
    {
      id: 1, category: 'anxiety', author: 'Sarah_123', avatar: '🌸', timestamp: '2 jam lalu', title: 'Tips Mengatasi Anxiety Saat Presentasi',
      content: 'Halo teman-teman! Aku mau share teknik yang aku pakai untuk mengatasi kecemasan saat presentasi...',
      likes: 24, comments: 8, shares: 3, isLiked: false, tags: ['anxiety', 'presentasi', 'tips'],
      replies: [
        { id: 1, author: 'Mike_wellness', avatar: '🧠', timestamp: '1 jam lalu', content: 'Terima kasih Sarah! Teknik breathing exercise sangat membantu.', likes: 5, isLiked: true },
        { id: 2, author: 'Dr_Maya', avatar: '👩‍⚕️', timestamp: '45 menit lalu', content: 'Tips yang bagus! Visualization technique juga sangat efektif.', likes: 12, isLiked: false }
      ]
    },
    {
      id: 2, category: 'success-stories', author: 'Journey_Healer', avatar: '🌟', timestamp: '4 jam lalu', title: 'Perjalanan Recovery dari Burnout - 6 Bulan Update',
      content: 'Hi everyone! Aku mau update perjalanan recovery dari burnout. Setelah 6 bulan menerapkan self-care routine yang konsisten, aku sudah merasa jauh lebih baik. Kunci utamanya adalah mindfulness dan boundary setting.',
      likes: 67, comments: 23, shares: 15, isLiked: true, tags: ['burnout', 'recovery', 'mindfulness'],
      replies: [
        { id: 1, author: 'Hope_seeker', avatar: '🌅', timestamp: '3 jam lalu', content: 'Cerita kamu memberikan harapan buat aku.', likes: 8, isLiked: false },
        { id: 2, author: 'Wellness_advocate', avatar: '💪', timestamp: '2 jam lalu', content: 'Boundary setting memang sangat penting! Terima kasih sudah berbagi.', likes: 15, isLiked: true }
      ]
    },
    {
      id: 3, category: 'motivation', author: 'DailyMotivator', avatar: '⚡', timestamp: '6 jam lalu', title: 'Memulai Hari dengan Gratitude Practice',
      content: 'Setiap pagi aku luangkan 5 menit untuk menulis 3 hal yang aku syukuri. Kebiasaan sederhana ini benar-benar mengubah mindset aku untuk menghadapi hari.',
      likes: 45, comments: 12, shares: 8, isLiked: false, tags: ['gratitude', 'morning-routine', 'positivity'],
      replies: [
        { id: 1, author: 'Morning_person', avatar: '🌅', timestamp: '5 jam lalu', content: 'Aku juga melakukan hal serupa! Sangat efektif.', likes: 6, isLiked: false }
      ]
    }
  ];

  // Load data dari localStorage saat komponen dimount
  useEffect(() => {
    const savedPosts = localStorage.getItem('forumPosts');
    if (savedPosts) {
      try {
        setPosts(JSON.parse(savedPosts));
      } catch (error) {
        console.error('Error parsing saved posts:', error);
        setPosts(defaultPosts);
      }
    } else {
      setPosts(defaultPosts);
    }
  }, []);

  // Save data ke localStorage setiap kali posts berubah
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem('forumPosts', JSON.stringify(posts));
    }
  }, [posts]);

  // Fungsi untuk membuat postingan baru
  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      alert('Judul dan konten tidak boleh kosong!');
      return;
    }

    // Parse tags dari string
    const tagsArray = newPost.tags
      .split(',')
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag.length > 0);

    const post: Post = {
      id: Date.now(), // Simple ID generation
      category: newPost.category,
      author: 'Kamu',
      avatar: '👤',
      timestamp: 'Baru saja',
      title: newPost.title.trim(),
      content: newPost.content.trim(),
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      tags: tagsArray,
      replies: []
    };

    // Tambahkan post baru ke awal array
    setPosts(prevPosts => [post, ...prevPosts]);

    // Reset form
    setNewPost({
      title: '',
      content: '',
      category: 'anxiety',
      tags: ''
    });

    // Tutup modal
    setShowCreatePost(false);
  };

  // Fungsi untuk handle like/unlike post
  const handleLike = (postId: number) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const newIsLiked = !post.isLiked;
          const newLikes = newIsLiked ? post.likes + 1 : post.likes - 1;
          return { ...post, isLiked: newIsLiked, likes: newLikes };
        }
        return post;
      })
    );

    // Update selectedPost jika sedang melihat detail
    if (selectedPost && selectedPost.id === postId) {
      const newIsLiked = !selectedPost.isLiked;
      const newLikes = newIsLiked ? selectedPost.likes + 1 : selectedPost.likes - 1;
      setSelectedPost({ ...selectedPost, isLiked: newIsLiked, likes: newLikes });
    }
  };

  // Fungsi untuk handle like/unlike reply
  const handleReplyLike = (postId: number, replyId: number) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const updatedReplies = post.replies.map(reply => {
            if (reply.id === replyId) {
              const newIsLiked = !reply.isLiked;
              const newLikes = newIsLiked ? reply.likes + 1 : reply.likes - 1;
              return { ...reply, isLiked: newIsLiked, likes: newLikes };
            }
            return reply;
          });
          return { ...post, replies: updatedReplies };
        }
        return post;
      })
    );

    // Update selectedPost jika sedang melihat detail
    if (selectedPost && selectedPost.id === postId) {
      const updatedReplies = selectedPost.replies.map(reply => {
        if (reply.id === replyId) {
          const newIsLiked = !reply.isLiked;
          const newLikes = newIsLiked ? reply.likes + 1 : reply.likes - 1;
          return { ...reply, isLiked: newIsLiked, likes: newLikes };
        }
        return reply;
      });
      setSelectedPost({ ...selectedPost, replies: updatedReplies });
    }
  };

  // Fungsi untuk menambahkan komentar
  const handleAddComment = () => {
    if (!newComment.trim() || !selectedPost) return;

    const newReply: Reply = {
      id: Date.now(), // Simple ID generation
      author: 'Kamu',
      avatar: '👤',
      timestamp: 'Baru saja',
      content: newComment.trim(),
      likes: 0,
      isLiked: false
    };

    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === selectedPost.id) {
          return {
            ...post,
            replies: [...post.replies, newReply],
            comments: post.comments + 1
          };
        }
        return post;
      })
    );

    // Update selectedPost
    setSelectedPost(prev => prev ? {
      ...prev,
      replies: [...prev.replies, newReply],
      comments: prev.comments + 1
    } : null);

    setNewComment('');
  };

  // Fungsi untuk handle share
  const handleShare = async (post: Post) => {
    const shareData = {
      title: post.title,
      text: `${post.content.substring(0, 100)}...`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback untuk browser yang tidak support Web Share API
        await navigator.clipboard.writeText(`${post.title}\n${shareData.url}`);
        alert('Link berhasil disalin ke clipboard!');
      }
      
      // Update share count
      setPosts(prevPosts =>
        prevPosts.map(p => 
          p.id === post.id ? { ...p, shares: p.shares + 1 } : p
        )
      );
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // --- SUB-KOMPONEN ---
  const CategoryTab = ({ category, isSelected, onClick }: { category: Category, isSelected: boolean, onClick: () => void }) => (
    <button onClick={onClick} className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${ isSelected ? 'bg-gradient-to-r from-pink-400 to-rose-500 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'}`}>
      {category.name}
    </button>
  );

  const PostCard = ({ post, onClick }: { post: Post, onClick: () => void }) => (
    <div className="bg-white rounded-2xl p-5 shadow-lg transform transition-all duration-300 hover:scale-102 hover:shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full flex items-center justify-center text-lg">{post.avatar}</div>
          <div>
            <p className="font-semibold text-gray-800">{post.author}</p>
            <p className="text-xs text-gray-500">{post.timestamp}</p>
          </div>
        </div>
        <MoreHorizontal size={16} className="text-gray-400" />
      </div>
      
      <div onClick={onClick} className="cursor-pointer">
        <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2">{post.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.content}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span key={tag} className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-2 py-1 rounded-full text-xs">#{tag}</span>
          ))}
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-6">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleLike(post.id);
            }}
            className={`flex items-center space-x-2 transition-colors ${post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
          >
            <Heart size={18} className={post.isLiked ? 'fill-current' : ''} />
            <span className="text-sm">{post.likes}</span>
          </button>
          <button 
            onClick={onClick}
            className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
          >
            <MessageCircle size={18} />
            <span className="text-sm">{post.comments}</span>
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleShare(post);
            }}
            className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors"
          >
            <Share2 size={18} />
            <span className="text-sm">{post.shares}</span>
          </button>
        </div>
      </div>
    </div>
  );

  const CreatePostModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Buat Post Baru</h2>
            <button 
              onClick={() => setShowCreatePost(false)}
              className="text-pink-200 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
            <select 
              value={newPost.category}
              onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              {categories.filter(cat => cat.id !== 'all').map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Judul</label>
            <input 
              type="text"
              value={newPost.title}
              onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Masukkan judul postingan..."
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
              maxLength={100}
            />
            <div className="text-xs text-gray-500 mt-1">{newPost.title.length}/100 karakter</div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Konten</label>
            <textarea 
              value={newPost.content}
              onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Bagikan pengalaman, tips, atau cerita Anda..."
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
              rows={6}
              maxLength={1000}
            />
            <div className="text-xs text-gray-500 mt-1">{newPost.content.length}/1000 karakter</div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Hash size={16} className="inline mr-1" />
              Tags (pisahkan dengan koma)
            </label>
            <input 
              type="text"
              value={newPost.tags}
              onChange={(e) => setNewPost(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="anxiety, tips, motivasi"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <div className="text-xs text-gray-500 mt-1">Contoh: anxiety, tips, motivasi</div>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button 
              onClick={() => setShowCreatePost(false)}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button 
              onClick={handleCreatePost}
              disabled={!newPost.title.trim() || !newPost.content.trim()}
              className={`flex-1 py-3 px-4 rounded-xl text-white font-medium transition-all duration-300 ${
                newPost.title.trim() && newPost.content.trim()
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:shadow-lg'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Posting
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const PostDetailView = ({ post, onBack }: { post: Post, onBack: () => void }) => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden m-4">
      <div className="bg-gradient-to-r from-pink-500 to-rose-600 p-6 text-white">
        <button onClick={onBack} className="mb-4 text-pink-200 hover:text-white transition-colors">← Kembali ke Forum</button>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl">{post.avatar}</div>
          <div>
            <p className="font-semibold text-lg">{post.author}</p>
            <p className="text-pink-200 text-sm">{post.timestamp}</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{post.title}</h1>
        <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">{post.content}</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag) => (
            <span key={tag} className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-3 py-1 rounded-full text-sm">#{tag}</span>
          ))}
        </div>
        
        <div className="flex items-center justify-between py-4 border-t border-b border-gray-200 mb-6">
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => handleLike(post.id)}
              className={`flex items-center space-x-2 transition-colors ${post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
            >
              <Heart size={20} className={post.isLiked ? 'fill-current' : ''} />
              <span>{post.likes}</span>
            </button>
            <div className="flex items-center space-x-2 text-gray-500">
              <MessageCircle size={20} />
              <span>{post.comments}</span>
            </div>
            <button 
              onClick={() => handleShare(post)}
              className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors"
            >
              <Share2 size={20} />
              <span>{post.shares}</span>
            </button>
          </div>
        </div>
        
        <div className="space-y-4 mb-6">
          <h3 className="font-semibold text-gray-800">Komentar ({post.replies.length})</h3>
          {post.replies.map((reply) => (
            <div key={reply.id} className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full flex items-center justify-center text-sm">{reply.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="font-medium text-gray-800 text-sm">{reply.author}</p>
                    <p className="text-xs text-gray-500">{reply.timestamp}</p>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">{reply.content}</p>
                  <button 
                    onClick={() => handleReplyLike(post.id, reply.id)}
                    className={`flex items-center space-x-1 text-xs transition-colors ${reply.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                  >
                    <Heart size={14} className={reply.isLiked ? 'fill-current' : ''} />
                    <span>{reply.likes}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="font-medium text-gray-800 mb-3">Tambah Komentar</h4>
          <div className="flex space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full flex items-center justify-center text-sm">👤</div>
            <div className="flex-1">
              <textarea 
                value={newComment} 
                onChange={(e) => setNewComment(e.target.value)} 
                placeholder="Bagikan pemikiran atau dukungan Anda..." 
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm resize-none" 
                rows={3}
              />
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-2">
                  <button aria-label="Tambah Emoji" className="text-gray-400 hover:text-gray-600">
                    <Smile size={20} />
                  </button>
                  <button aria-label="Lampirkan File" className="text-gray-400 hover:text-gray-600">
                    <Paperclip size={20} />
                  </button>
                </div>
                <button 
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-1 ${
                    newComment.trim() 
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:shadow-lg' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Send size={16} />
                  <span>Kirim</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const MainView = () => (
    <>
      <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white p-6 rounded-b-3xl shadow-xl">
        <h1 className="text-2xl font-bold mb-2">Forum Komunitas</h1>
        <p className="text-pink-100 text-sm">Berbagi pengalaman & saling mendukung</p>
      </div>
      <div className="p-6 space-y-6 pb-24">
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Cari topik..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-500" 
            />
          </div>
          <button 
            onClick={() => setShowCreatePost(true)}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white p-4 rounded-2xl shadow-lg flex items-center justify-center space-x-2 hover:shadow-xl transition-all duration-300"
          >
            <Plus size={20} />
            <span>Buat Post Baru</span>
          </button>
        </div>
        
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Kategori</h2>
          <div className="flex space-x-3 overflow-x-auto pb-2 -mx-6 px-6">
            {categories.map((category) => (
              <CategoryTab 
                key={category.id} 
                category={category} 
                isSelected={selectedCategory === category.id} 
                onClick={() => setSelectedCategory(category.id)} 
              />
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-100 to-pink-100 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp size={20} className="text-orange-600" />
            <h3 className="text-lg font-bold text-orange-800">Trending Topics</h3>
          </div>
          <div
            className="grid grid-cols-2 gap-4"
          >
            {posts.slice(0, 4).map(post => (
              <div 
                key={post.id} 
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
                onClick={() => setSelectedPost(post)}
              >
                <h4 className="font-semibold text-gray-800 line-clamp-1">{post.title}</h4>
                <p className="text-gray-600 text-sm line-clamp-2">{post.content}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <PostCard 
                key={post.id} 
                post={post} 
                onClick={() => setSelectedPost(post)} 
              />
            ))
          ) : (
            <div className="text-center text-gray-500">Tidak ada postingan yang ditemukan.</div>
          )}
        </div>
      </div>
    </>
  );
  return (
    <IonPage>
      <IonContent className="bg-gray-50">
        {showCreatePost && <CreatePostModal />}
        {selectedPost ? (
          <PostDetailView post={selectedPost} onBack={() => setSelectedPost(null)} />
        ) : (
          <MainView />
        )}
      </IonContent>
    </IonPage>
  );
}
export default Tab5;