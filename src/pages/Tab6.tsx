import React, { useState, useEffect, useRef, ComponentType } from 'react';
import { IonPage, IonContent, IonButton, IonSpinner, IonToast, IonToggle, IonRouterLink } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase-config';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { HelpCircle } from 'lucide-react';
import { Code, Slash } from "lucide-react";

import { User, Settings, Shield, Award, Calendar, Edit3, Camera, Moon, LogOut, Sun, Target, Heart, Brain, TrendingUp, Users, Wifi, Smartphone } from 'lucide-react';

const Tab6: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [notifications, setNotifications] = useState({
    biofeedback: true,
    mood: true,
    exercise: false,
    social: true
  });

  const { isDark, toggleTheme } = useTheme();
  const { user, loading } = useAuth();
  const history = useHistory();
  
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedPhoto = localStorage.getItem(`profilePicture_${user?.uid}`);
    if (savedPhoto) {
      setPhotoSrc(savedPhoto);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      history.replace('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const CodeSlash = ({ size = 20, className = "" }) => (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <Code size={size} className={`absolute ${className}`} />
      <Slash size={size} className={`absolute ${className}`} />
    </div>
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 2 * 1024 * 1024) {
      setToastMessage('Ukuran file terlalu besar (maks 2MB).');
      return;
    }
    const reader = new FileReader();
    reader.onloadstart = () => setIsUploading(true);
    reader.onloadend = () => {
      const base64String = reader.result as string;
      localStorage.setItem(`profilePicture_${user.uid}`, base64String);
      setPhotoSrc(base64String);
      setIsUploading(false);
      setToastMessage('Foto profil berhasil diperbarui!');
    };
    reader.onerror = () => {
      setIsUploading(false);
      setToastMessage('Gagal memproses file.');
    };
    reader.readAsDataURL(file);
    if(fileInputRef.current) fileInputRef.current.value = '';
  };

  // Data statis untuk UI
  const userStats = { 
    totalDays: 127, 
    streakDays: 15, 
    averageMood: 7.8, 
    stressReduction: 23, 
    mindfulMinutes: 850, 
    achievements: 12 
  };

  const achievements = [
    { id: 1, title: 'First Week', description: '7 hari berturut-turut tracking', icon: '🏆', unlocked: true },
    { id: 2, title: 'Mood Master', description: 'Mood stabil selama 30 hari', icon: '😊', unlocked: true },
    { id: 3, title: 'Stress Buster', description: 'Menurunkan stress 20%', icon: '💪', unlocked: true },
    { id: 4, title: 'Mindful Mind', description: '500 menit meditasi', icon: '🧘‍♀️', unlocked: true },
    { id: 5, title: 'Community Helper', description: '50 komentar supportive', icon: '❤️', unlocked: false },
    { id: 6, title: 'Wellness Warrior', description: '100 hari konsisten', icon: '⚡', unlocked: false }
  ];

  const recentActivities = [
    { date: '2025-08-17', activity: 'Completed morning meditation', mood: 8, icon: '🧘‍♀️' },
    { date: '2025-08-16', activity: 'Shared experience in forum', mood: 7, icon: '💬' },
    { date: '2025-08-15', activity: 'Achieved daily step goal', mood: 8, icon: '🚶‍♀️' },
    { date: '2025-08-14', activity: 'Practiced breathing exercise', mood: 9, icon: '🫁' },
    { date: '2025-08-13', activity: 'Read psychology article', mood: 7, icon: '📚' }
  ];

  if (loading) {
    return (
      <IonPage>
        <IonContent fullscreen>
          <div className="flex items-center justify-center h-full">
            <IonSpinner name="crescent" />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const ProfileSection = () => (
    <div className="space-y-6">
      {/* Enhanced Profile Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full -ml-12 -mb-12"></div>
        
        <div className="relative">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full flex items-center justify-center bg-white/10">
                {isUploading ? (
                  <IonSpinner name="crescent" />
                ) : (
                  <img 
                    src={photoSrc || user?.photoURL || ''} 
                    alt="Profile" 
                    className="w-20 h-20 rounded-full object-cover" 
                    onError={(e) => (e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23ddd'/%3E%3Ctext x='50' y='55' font-family='Arial' font-size='40' fill='%23fff' text-anchor='middle'%3E👤%3C/text%3E%3C/svg%3E")}
                  />
                )}
              </div>
              <button onClick={handleAvatarClick} className="absolute -bottom-1 -right-1 w-8 h-8 bg-white text-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Camera size={16} />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{user?.displayName || 'Pengguna Baru'}</h2>
              <p className="text-indigo-200">Member sejak Januari 2025</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Wifi size={16} className="text-green-300" />
                  <span className="text-sm text-indigo-200">Perangkat Terhubung</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-indigo-200">Online</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsEditing(!isEditing)} className="bg-white bg-opacity-20 hover:bg-opacity-30 p-3 rounded-full transition-all duration-300">
              <Edit3 size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{userStats.totalDays}</p>
              <p className="text-indigo-200 text-sm">Hari Total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{userStats.streakDays}</p>
              <p className="text-indigo-200 text-sm">Streak Hari</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{userStats.averageMood}</p>
              <p className="text-indigo-200 text-sm">Avg Mood</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Pengurangan Stress</p>
              <p className="text-2xl font-bold">{userStats.stressReduction}%</p>
            </div>
            <TrendingUp size={28} className="text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Menit Mindful</p>
              <p className="text-2xl font-bold">{userStats.mindfulMinutes}</p>
            </div>
            <Brain size={28} className="text-blue-200" />
          </div>
        </div>
      </div>

      {/* Enhanced Personal Info */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Informasi Personal</h3>
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
              <input type="text" defaultValue={user?.displayName || ''} className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" defaultValue={user?.email || ''} className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
              <input type="date" defaultValue="1995-03-15" className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                rows={3}
                placeholder="Ceritakan sedikit tentang diri Anda..."
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                defaultValue="Seorang profesional muda yang sedang belajar mengelola stress dan meningkatkan kualitas hidup melalui mindfulness dan teknologi kesehatan mental."
              />
            </div>
            <div className="flex space-x-3">
              <button onClick={() => setIsEditing(false)} className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300">
                Simpan
              </button>
              <button onClick={() => setIsEditing(false)} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-300 transition-all duration-300">
                Batal
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Nama</span>
              <span className="font-medium text-gray-800">{user?.displayName || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email</span>
              <span className="font-medium text-gray-800">{user?.email || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Umur</span>
              <span className="font-medium text-gray-800">30 tahun</span>
            </div>
            <div className="pt-2 border-t border-gray-100">
              <p className="text-gray-600 text-sm leading-relaxed">
                Seorang profesional muda yang sedang belajar mengelola stress dan meningkatkan kualitas hidup melalui mindfulness dan teknologi kesehatan mental.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* New Goals Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Target Kesehatan Mental</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <Target size={20} className="text-blue-500" />
              <span className="text-gray-700">Meditasi 10 menit/hari</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full w-3/4"></div>
              </div>
              <span className="text-sm text-gray-600">75%</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <Heart size={20} className="text-green-500" />
              <span className="text-gray-700">Mood tracking harian</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full w-full"></div>
              </div>
              <span className="text-sm text-gray-600">100%</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <Users size={20} className="text-purple-500" />
              <span className="text-gray-700">Interaksi sosial positif</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full w-1/2"></div>
              </div>
              <span className="text-sm text-gray-600">50%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const AchievementsSection = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">🏆 Achievements</h2>
        <p className="text-yellow-100">Pencapaian Anda dalam perjalanan kesehatan mental</p>
        <div className="mt-4 text-center">
          <p className="text-3xl font-bold">{userStats.achievements}</p>
          <p className="text-yellow-100">Achievement Unlocked</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {achievements.map((a) => (
          <div key={a.id} className={`p-4 rounded-2xl shadow-lg transition-all duration-300 ${a.unlocked ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-200' : 'bg-gray-100 border-2 border-gray-200'}`}>
            <div className="flex items-center space-x-4">
              <div className={`text-3xl ${a.unlocked ? '' : 'grayscale opacity-50'}`}>{a.icon}</div>
              <div className="flex-1">
                <h3 className={`font-bold ${a.unlocked ? 'text-green-800' : 'text-gray-500'}`}>{a.title}</h3>
                <p className={`text-sm ${a.unlocked ? 'text-green-600' : 'text-gray-400'}`}>{a.description}</p>
              </div>
              {a.unlocked && (<Award size={24} className="text-green-500" />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ActivitySection = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">📈 Aktivitas Terbaru</h2>
        <p className="text-purple-100">Jejak perjalanan kesehatan mental Anda</p>
      </div>
      <div className="space-y-3">
        {recentActivities.map((act, index) => (
          <div key={index} className="bg-white rounded-2xl p-4 shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="text-2xl">{act.icon}</div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{act.activity}</p>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-sm text-gray-500">{act.date}</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-600">Mood:</span>
                    <div className="flex space-x-1">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < act.mood ? 'bg-green-400' : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{act.mood}/10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const SettingsSection = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gray-500 to-slate-600 rounded-3xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">⚙️ Pengaturan</h2>
        <p className="text-gray-200">Personalisasi pengalaman MindWell Anda</p>
      </div>
      
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4">🔔 Notifikasi</h3>
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800 capitalize">
                  {key === 'biofeedback' ? 'Biofeedback Alerts' :
                   key === 'mood' ? 'Mood Reminders' :
                   key === 'exercise' ? 'Exercise Reminders' :
                   'Social Updates'}
                </p>
                <p className="text-sm text-gray-600">
                  {key === 'biofeedback' ? 'Alert saat data biofeedback menunjukkan stress tinggi' :
                   key === 'mood' ? 'Pengingat untuk mencatat mood harian' :
                   key === 'exercise' ? 'Pengingat untuk aktivitas fisik' :
                   'Update dari forum komunitas'}
                </p>
              </div>
              <button 
                onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))} 
                className={`w-12 h-6 rounded-full transition-all duration-300 ${value ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transform transition-all duration-300 ${value ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Device Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4">📱 Perangkat & Koneksi</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <Wifi size={20} className="text-green-500" />
              <div>
                <p className="font-medium text-gray-800">Biofeedback Module</p>
                <p className="text-sm text-gray-600">Terhubung via WiFi</p>
              </div>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <Smartphone size={20} className="text-gray-500" />
              <div>
                <p className="font-medium text-gray-800">Smartphone Sync</p>
                <p className="text-sm text-gray-600">Sinkronisasi data harian</p>
              </div>
            </div>
            <button className="text-blue-500 text-sm font-medium">Sync Now</button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4">🔒 Privasi & Keamanan</h3>
        <div className="space-y-3">
          <button className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield size={20} className="text-blue-500" />
                <span className="text-gray-800">Pengaturan Privasi</span>
              </div>
              <span className="text-gray-400">›</span>
            </div>
          </button>
          <button className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <User size={20} className="text-green-500" />
                <span className="text-gray-800">Keamanan Akun</span>
              </div>
              <span className="text-gray-400">›</span>
            </div>
          </button>
          <button className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Settings size={20} className="text-purple-500" />
                <span className="text-gray-800">Data Export</span>
              </div>
              <span className="text-gray-400">›</span>
            </div>
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4">🎨 Tampilan</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sun size={20} className="text-yellow-500" />
              <span className="text-gray-800 font-medium">Light Mode</span>
            </div>
            <input type="radio" name="theme" className="w-4 h-4 text-yellow-500" defaultChecked={!isDark} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Moon size={20} className="text-indigo-500" />
              <span className="text-gray-800 font-medium">Dark Mode</span>
            </div>
            <IonToggle 
              checked={isDark} 
              onIonChange={toggleTheme} 
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4">ℹ️ Bantuan & Dukungan</h3>
        <div className="space-y-3">
          <IonRouterLink routerLink="/faq" className="w-full">
            <div className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <HelpCircle size={20} className="text-orange-500" />
                  <span className="text-gray-800">Pusat Bantuan (FAQ)</span>
                </div>
                <span className="text-gray-400">›</span>
              </div>
            </div>
          </IonRouterLink>

          <IonRouterLink routerLink="/about" className="w-full">
            <div className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CodeSlash size={20} className="text-gray-500" />
                  <span className="text-gray-800">Tentang Pengembang</span>
                </div>
                <span className="text-gray-400">›</span>
              </div>
            </div>
          </IonRouterLink>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl p-4 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Akun</h3>
        <IonButton expand="block" color="danger" onClick={handleLogout} className="font-medium">
          <LogOut size={16} className="mr-2" />
          Keluar (Logout)
        </IonButton>
      </div>
    </div>
  );

  interface TabButtonProps {
    id: string;
    label: string;
    icon: ComponentType<any>;
    isActive: boolean;
    onClick: () => void;
  }

  const TabButton = ({ label, icon: Icon, isActive, onClick }: TabButtonProps) => (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center space-y-1 py-3 px-2 rounded-xl transition-all duration-300 ${
        isActive
          ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon size={20} />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );

  return (
    <IonPage>
      <IonContent fullscreen className="bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100">
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/png, image/jpeg" hidden />
        
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white p-6 rounded-b-3xl shadow-xl">
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-purple-100 text-sm">Kelola akun dan preferensi Anda</p>
        </div>

        {/* Tab Navigation */}
        <div className="p-6 pb-2">
          <div className="flex space-x-2 bg-white rounded-2xl p-2 shadow-lg">
            <TabButton id="profile" label="Profil" icon={User} isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
            <TabButton id="achievements" label="Pencapaian" icon={Award} isActive={activeTab === 'achievements'} onClick={() => setActiveTab('achievements')} />
            <TabButton id="activity" label="Aktivitas" icon={Calendar} isActive={activeTab === 'activity'} onClick={() => setActiveTab('activity')} />
            <TabButton id="settings" label="Pengaturan" icon={Settings} isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-6 pb-24">
          {activeTab === 'profile' && <ProfileSection />}
          {activeTab === 'achievements' && <AchievementsSection />}
          {activeTab === 'activity' && <ActivitySection />}
          {activeTab === 'settings' && <SettingsSection />}
        </div>

        <IonToast isOpen={!!toastMessage} message={toastMessage} onDidDismiss={() => setToastMessage('')} duration={3000} position="top" />
      </IonContent>
    </IonPage>
  );
};

export default Tab6;