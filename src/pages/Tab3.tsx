import React, { useState, useEffect } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area, PieChart, Pie, Cell, Tooltip, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Brain, Smile, Frown, Meh, TrendingUp, TrendingDown, Camera, Moon, Sun } from 'lucide-react';

// --- Definisi Tipe untuk Props (Mencegah Error ESLint) ---
interface MoodMetricCardProps {
  title: string;
  value: number;
  max?: number;
  trend: number;
  color: string;
}

interface HormoneCardProps {
  hormone: string;
  level: string;
  value: number;
  color: string;
  status: 'optimal' | string;
}
// --- Akhir Definisi Tipe ---

const Tab3: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('daily');
  const [currentEmotion, setCurrentEmotion] = useState('calm');

  useEffect(() => {
    const emotions = ['happy', 'calm', 'focused', 'neutral', 'tired'];
    const interval = setInterval(() => {
      setCurrentEmotion(emotions[Math.floor(Math.random() * emotions.length)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Data
  const dailyMoodData = [
    { time: '06:00', mood: 7, stress: 3, energy: 6, focus: 5, anxiety: 2 },
    { time: '09:00', mood: 8, stress: 4, energy: 8, focus: 7, anxiety: 3 },
    { time: '12:00', mood: 6, stress: 6, energy: 5, focus: 4, anxiety: 5 },
    { time: '15:00', mood: 7, stress: 5, energy: 6, focus: 6, anxiety: 4 },
    { time: '18:00', mood: 8, stress: 3, energy: 7, focus: 8, anxiety: 2 },
    { time: '21:00', mood: 9, stress: 2, energy: 5, focus: 6, anxiety: 1 }
  ];

  const weeklyMoodData = [
    { day: 'Sen', mood: 7.2, stress: 4.1, energy: 6.8, focus: 6.2, anxiety: 3.1 },
    { day: 'Sel', mood: 6.8, stress: 5.2, energy: 5.9, focus: 5.8, anxiety: 4.2 },
    { day: 'Rab', mood: 8.1, stress: 3.5, energy: 7.5, focus: 7.8, anxiety: 2.8 },
    { day: 'Kam', mood: 6.5, stress: 6.0, energy: 5.2, focus: 4.9, anxiety: 5.5 },
    { day: 'Jum', mood: 8.5, stress: 2.8, energy: 8.2, focus: 8.5, anxiety: 2.2 },
    { day: 'Sab', mood: 9.0, stress: 2.0, energy: 7.8, focus: 7.2, anxiety: 1.8 },
    { day: 'Min', mood: 8.8, stress: 2.2, energy: 6.5, focus: 6.8, anxiety: 2.0 }
  ];
  
  const emotionDistribution = [
    { name: 'Bahagia', value: 35, color: '#10B981' },
    { name: 'Tenang', value: 28, color: '#3B82F6' },
    { name: 'Fokus', value: 20, color: '#8B5CF6' },
    { name: 'Netral', value: 12, color: '#6B7280' },
    { name: 'Lelah', value: 5, color: '#F59E0B' }
  ];

  const hormonalIndicators = [
    { hormone: 'Kortisol', level: 'Rendah', value: 3, color: 'from-green-400 to-emerald-500', status: 'optimal' },
    { hormone: 'Serotonin', level: 'Tinggi', value: 8, color: 'from-blue-400 to-cyan-500', status: 'optimal' },
    { hormone: 'Dopamin', level: 'Normal', value: 7, color: 'from-purple-400 to-violet-500', status: 'optimal' },
    { hormone: 'Adrenalin', level: 'Rendah', value: 2, color: 'from-yellow-400 to-orange-500', status: 'optimal' }
  ];

  const radarData = [
    { aspect: 'Mood', current: 8, optimal: 9 },
    { aspect: 'Energi', current: 7, optimal: 8 },
    { aspect: 'Fokus', current: 8, optimal: 9 },
    { aspect: 'Tidur', current: 6, optimal: 8 },
    { aspect: 'Sosial', current: 7, optimal: 8 },
    { aspect: 'Motivasi', current: 8, optimal: 9 }
  ];

  const getData = () => {
    return selectedPeriod === 'daily' ? dailyMoodData : weeklyMoodData;
  };

  const getEmotionIcon = (emotion: string) => {
    switch(emotion) {
      case 'happy': return <Smile className="text-green-300" size={24} />;
      case 'calm': return <Meh className="text-blue-300" size={24} />;
      case 'focused': return <Brain className="text-purple-300" size={24} />;
      case 'neutral': return <Meh className="text-gray-300" size={24} />;
      case 'tired': return <Frown className="text-orange-300" size={24} />;
      default: return <Meh className="text-gray-300" size={24} />;
    }
  };

  const getEmotionColor = (emotion: string) => {
    const colors: { [key: string]: string } = {
      happy: 'from-green-500 to-emerald-600',
      calm: 'from-blue-500 to-cyan-600',
      focused: 'from-purple-500 to-violet-600',
      neutral: 'from-gray-500 to-slate-600',
      tired: 'from-orange-500 to-yellow-600'
    };
    return colors[emotion] || 'from-gray-500 to-slate-600';
  };

  const MoodMetricCard = ({ title, value, max = 10, trend, color }: MoodMetricCardProps) => (
    <div className={`bg-gradient-to-br ${color} rounded-2xl p-4 shadow-lg transform transition-all duration-300 hover:scale-105`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-white font-semibold text-sm">{title}</h3>
        <div className="flex items-center space-x-1">
          {trend > 0 ? (
            <TrendingUp size={14} className="text-green-200" />
          ) : (
            <TrendingDown size={14} className="text-red-200" />
          )}
          <span className="text-white/80 text-xs">{Math.abs(trend)}%</span>
        </div>
      </div>
      <p className="text-white text-2xl font-bold mb-2">{value}<span className="text-sm">/{max}</span></p>
      <div className="w-full bg-white/20 rounded-full h-2">
        <div className="bg-white rounded-full h-2 transition-all duration-500" style={{ width: `${(value / max) * 100}%` }}></div>
      </div>
    </div>
  );

  const HormoneCard = ({ hormone, level, value, color, status }: HormoneCardProps) => (
    <div className={`bg-gradient-to-r ${color} rounded-xl p-4 shadow-md`}>
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-white font-semibold text-sm">{hormone}</h4>
          <p className="text-white/80 text-xs">Level: {level}</p>
        </div>
        <div className="text-white text-xl font-bold">{value}/10</div>
      </div>
      <div className="mt-2 flex items-center">
        <div className={`w-2 h-2 rounded-full mr-2 ${status === 'optimal' ? 'bg-green-300' : 'bg-yellow-300'}`}></div>
        <span className="text-white/80 text-xs">{status === 'optimal' ? 'Optimal' : 'Perlu Perhatian'}</span>
      </div>
    </div>
  );

  return (
    <IonPage>
      <IonContent fullscreen className="[--ion-background-color:#f1f5f9]">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 text-white p-6 rounded-b-3xl shadow-xl">
          <h1 className="text-2xl font-bold mb-2">Kesehatan Mental</h1>
          <p className="text-violet-100 text-sm">Analisis mood, emosi, dan kondisi psikologis Anda</p>
        </div>

        <div className="p-6 space-y-6 pb-24">
          
          {/* Real-time Emotion Detection */}
          <div className={`bg-gradient-to-r ${getEmotionColor(currentEmotion)} rounded-3xl p-6 shadow-xl`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Deteksi Emosi Real-time</h3>
                <p className="text-white/80 text-sm mb-3">Berdasarkan analisis microexpression</p>
                <div className="flex items-center space-x-3">
                  {getEmotionIcon(currentEmotion)}
                  <span className="text-white text-xl font-bold capitalize">{currentEmotion}</span>
                </div>
              </div>
              <div className="relative">
                <div className={`w-16 h-16 bg-white/20 rounded-full flex items-center justify-center animate-pulse`}>
                  <Camera size={28} className="text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Period Selector */}
          <div className="flex space-x-2 bg-white rounded-2xl p-2 shadow-md">
            {['daily', 'weekly'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                  selectedPeriod === period
                    ? 'bg-gradient-to-r from-violet-400 to-purple-400 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {period === 'daily' ? 'Harian' : 'Mingguan'}
              </button>
            ))}
          </div>

          {/* Mood Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <MoodMetricCard title="Mood" value={8} trend={5} color="from-pink-400 to-rose-500" />
            <MoodMetricCard title="Tingkat Stress" value={3} trend={-12} color="from-red-400 to-pink-500" />
            <MoodMetricCard title="Energi Mental" value={7} trend={8} color="from-blue-400 to-cyan-500" />
            <MoodMetricCard title="Fokus" value={8} trend={3} color="from-purple-400 to-violet-500" />
          </div>

          {/* Mood Trend Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Trend Mood & Mental</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getData()}>
                  <defs>
                    <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="stressGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey={selectedPeriod === 'daily' ? 'time' : 'day'} stroke="#6B7280" />
                  <YAxis stroke="#6B7280" domain={[0, 10]} />
                  <Tooltip contentStyle={{ backgroundColor: 'white', border: 'none', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="mood" stroke="#8B5CF6" fillOpacity={1} fill="url(#moodGradient)" strokeWidth={2} />
                  <Area type="monotone" dataKey="stress" stroke="#EF4444" fillOpacity={1} fill="url(#stressGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Emotion Distribution & Mental Health Radar */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg flex-1">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Distribusi Emosi</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={emotionDistribution} 
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {emotionDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Profil Kesehatan Mental</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="aspect" tick={{ fontSize: 12 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 10]} tick={false} />
                      <Radar name="Current" dataKey="current" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} strokeWidth={2} />
                      <Radar name="Optimal" dataKey="optimal" stroke="#10B981" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

          {/* Hormonal Indicators */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Indikator Hormonal</h3>
            <p className="text-gray-600 text-sm mb-4">Perkiraan berdasarkan data biofeedback</p>
            <div className="grid grid-cols-2 gap-4">
              {hormonalIndicators.map((item, index) => (
                <HormoneCard
                  key={index}
                  hormone={item.hormone}
                  level={item.level}
                  value={item.value}
                  color={item.color}
                  status={item.status}
                />
              ))}
            </div>
          </div>
          
          {/* --- BAGIAN YANG HILANG SEBELUMNYA --- */}
          {/* Mental Health Insights */}
          <div className="bg-gradient-to-r from-violet-100 to-purple-100 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-violet-800 mb-4">Insight Kesehatan Mental</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-violet-500 rounded-full mt-2"></div>
                <p className="text-violet-700 text-sm">
                  <strong>Pola mood harian</strong> menunjukkan stabilitas yang baik dengan puncak energi di sore hari.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <p className="text-purple-700 text-sm">
                  <strong>Tingkat stress</strong> berada dalam rentang rendah, menandakan manajemen stress yang efektif.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                <p className="text-indigo-700 text-sm">
                  <strong>Deteksi microexpression</strong> menunjukkan ekspresi positif dominan sepanjang hari.
                </p>
              </div>
            </div>

          {/* Recommendations */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Rekomendasi</h3>
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 rounded-full p-2">
                    <Moon size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-blue-800 font-semibold text-sm">Kualitas Tidur</h4>
                    <p className="text-blue-600 text-xs">Tingkatkan durasi tidur 30 menit untuk optimal recovery</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 rounded-full p-2">
                    <Sun size={20} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-green-800 font-semibold text-sm">Aktivitas Outdoor</h4>
                    <p className="text-green-600 text-xs">Lakukan aktivitas di luar ruangan untuk boost serotonin</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 rounded-full p-2">
                    <Brain size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-purple-800 font-semibold text-sm">Meditasi Mindfulness</h4>
                    <p className="text-purple-600 text-xs">10 menit meditasi pagi dapat meningkatkan fokus</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;