import React, { useState, useEffect } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area, PieChart, Pie, Cell, Tooltip, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Brain, Smile, Frown, Meh, TrendingUp, TrendingDown, Moon, Sun, AlertTriangle, CheckCircle } from 'lucide-react';
import { ref, onValue } from "firebase/database";
import { realtimeDb } from "../firebase-config";

// --- Definisi Tipe untuk Props ---
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
  status: 'optimal' | 'warning' | 'alert';
}

interface MoodDataPoint {
  time: string;
  mood: number;
  stress: number;
  energy: number;
  focus: number;
  anxiety: number;
  timestamp: number;
}

const Tab3: React.FC = () => {
  // Firebase real-time data
  const [currentData, setCurrentData] = useState({
    bpm: 0,
    temp: 0,
    spo2: 0,
    gsr: 0
  });

  // Mental health state based on sensors
  const [mentalHealthMetrics, setMentalHealthMetrics] = useState({
    mood: 5,
    stress: 5,
    energy: 5,
    focus: 5,
    anxiety: 5
  });

  // Historical data for trends
  const [historicalData, setHistoricalData] = useState<MoodDataPoint[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  
  // UI state
  const [selectedPeriod, setSelectedPeriod] = useState('daily');
  const [currentEmotion, setCurrentEmotion] = useState('neutral');

  // Firebase data fetching
  useEffect(() => {
    const dataRef = ref(realtimeDb, "readings/latest");
    const unsubscribe = onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log("Firebase Data Tab3:", data);

        const newData = {
          bpm: data.bmp || 0,
          temp: data.objTemp || 0,
          spo2: data.ir || 0,
          gsr: data.red || 0
        };

        setCurrentData(newData);
        setIsConnected(true);

        // Calculate mental health metrics based on sensor data
        const metrics = calculateMentalHealthMetrics(newData);
        setMentalHealthMetrics(metrics);

        // Update emotion based on metrics
        const emotion = determineCurrentEmotion(metrics);
        setCurrentEmotion(emotion);

        // Add to historical data
        const now = new Date();
        const newDataPoint: MoodDataPoint = {
          time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          mood: metrics.mood,
          stress: metrics.stress,
          energy: metrics.energy,
          focus: metrics.focus,
          anxiety: metrics.anxiety,
          timestamp: now.getTime()
        };

        setHistoricalData(prev => {
          const updated = [...prev, newDataPoint];
          return updated.slice(-20); // Keep last 20 points
        });
      } else {
        setIsConnected(false);
      }
    }, (error) => {
      console.error("Firebase error:", error);
      setIsConnected(false);
    });

    return () => unsubscribe();
  }, []);

  // Calculate mental health metrics from sensor data
  const calculateMentalHealthMetrics = (data: typeof currentData) => {
    const { bpm, temp, gsr } = data;
    
    // Normalize GSR (0-4000 range typical)
    const gsrNormalized = Math.min(gsr / 1000, 10);
    
    // Mood calculation (inverse of stress indicators)
    const mood = Math.max(1, Math.min(10, 
      8 - (gsrNormalized * 0.3) - (bpm > 80 ? (bpm - 80) * 0.1 : 0) + (temp > 36 && temp < 37.5 ? 1 : 0)
    ));
    
    // Stress calculation (based on GSR + heart rate)
    const stress = Math.max(1, Math.min(10,
      2 + (gsrNormalized * 0.4) + (bpm > 70 ? (bpm - 70) * 0.15 : 0) + (temp > 37.5 ? 2 : 0)
    ));
    
    // Energy calculation (based on heart rate variability and temperature)
    const energy = Math.max(1, Math.min(10,
      5 + (bpm > 60 && bpm < 90 ? 2 : -1) + (temp > 36.2 && temp < 37.2 ? 1 : 0) - (gsrNormalized * 0.2)
    ));
    
    // Focus calculation (inverse of high stress/anxiety indicators)
    const focus = Math.max(1, Math.min(10,
      7 - (gsrNormalized * 0.3) - (stress > 6 ? 2 : 0) + (bpm > 60 && bpm < 80 ? 1 : 0)
    ));
    
    // Anxiety calculation (primarily from GSR and heart rate patterns)
    const anxiety = Math.max(1, Math.min(10,
      2 + (gsrNormalized * 0.5) + (bpm > 90 ? (bpm - 90) * 0.2 : 0) + (temp > 37.5 ? 1 : 0)
    ));

    return {
      mood: Math.round(mood * 10) / 10,
      stress: Math.round(stress * 10) / 10,
      energy: Math.round(energy * 10) / 10,
      focus: Math.round(focus * 10) / 10,
      anxiety: Math.round(anxiety * 10) / 10
    };
  };

  // Determine current emotion based on metrics
  const determineCurrentEmotion = (metrics: typeof mentalHealthMetrics): string => {
    const { mood, stress, energy, anxiety } = metrics;
    
    if (mood >= 7 && stress <= 4 && energy >= 6) return 'happy';
    if (mood >= 6 && stress <= 3 && anxiety <= 3) return 'calm';
    if (mentalHealthMetrics.focus >= 7 && energy >= 6 && stress <= 5) return 'focused';
    if (stress >= 7 || anxiety >= 7) return 'stressed';
    if (energy <= 4 || mood <= 4) return 'tired';
    return 'neutral';
  };

  // Calculate trend for metrics
  const calculateTrend = (metric: keyof typeof mentalHealthMetrics): number => {
    if (historicalData.length < 5) return 0;
    
    const recent = historicalData.slice(-3).reduce((sum, point) => sum + point[metric], 0) / 3;
    const older = historicalData.slice(-6, -3).reduce((sum, point) => sum + point[metric], 0) / 3;
    
    return older === 0 ? 0 : Math.round(((recent - older) / older) * 100);
  };

  // Generate emotion distribution based on recent data
  const getEmotionDistribution = () => {
    const emotions = historicalData.slice(-10).map(point => {
      const metrics = {
        mood: point.mood,
        stress: point.stress,
        energy: point.energy,
        focus: point.focus,
        anxiety: point.anxiety
      };
      return determineCurrentEmotion(metrics);
    });
    
    const counts = emotions.reduce((acc, emotion) => {
      acc[emotion] = (acc[emotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const total = emotions.length || 1;
    
    return [
      { name: 'Bahagia', value: Math.round(((counts.happy || 0) / total) * 100), color: '#10B981' },
      { name: 'Tenang', value: Math.round(((counts.calm || 0) / total) * 100), color: '#3B82F6' },
      { name: 'Fokus', value: Math.round(((counts.focused || 0) / total) * 100), color: '#8B5CF6' },
      { name: 'Stress', value: Math.round(((counts.stressed || 0) / total) * 100), color: '#EF4444' },
      { name: 'Lelah', value: Math.round(((counts.tired || 0) / total) * 100), color: '#F59E0B' },
      { name: 'Netral', value: Math.round(((counts.neutral || 0) / total) * 100), color: '#6B7280' }
    ].filter(item => item.value > 0);
  };

  // Generate hormonal indicators based on sensor data
  const getHormonalIndicators = () => {
    const { gsr } = currentData;
    const { stress, mood } = mentalHealthMetrics;
    
    return [
      {
        hormone: 'Kortisol',
        level: stress <= 3 ? 'Rendah' : stress <= 6 ? 'Normal' : 'Tinggi',
        value: Math.round(stress),
        color: stress <= 4 ? 'from-green-400 to-emerald-500' : stress <= 6 ? 'from-yellow-400 to-orange-500' : 'from-red-400 to-pink-500',
        status: (stress <= 4 ? 'optimal' : stress <= 6 ? 'warning' : 'alert') as 'optimal' | 'warning' | 'alert'
      },
      {
        hormone: 'Serotonin',
        level: mood >= 7 ? 'Tinggi' : mood >= 5 ? 'Normal' : 'Rendah',
        value: Math.round(mood),
        color: mood >= 7 ? 'from-blue-400 to-cyan-500' : mood >= 5 ? 'from-green-400 to-emerald-500' : 'from-gray-400 to-slate-500',
        status: (mood >= 6 ? 'optimal' : mood >= 4 ? 'warning' : 'alert') as 'optimal' | 'warning' | 'alert'
      },
      {
        hormone: 'Dopamin',
        level: mentalHealthMetrics.energy >= 7 ? 'Tinggi' : mentalHealthMetrics.energy >= 5 ? 'Normal' : 'Rendah',
        value: Math.round(mentalHealthMetrics.energy),
        color: 'from-purple-400 to-violet-500',
        status: (mentalHealthMetrics.energy >= 6 ? 'optimal' : 'warning') as 'optimal' | 'warning' | 'alert'
      },
      {
        hormone: 'Adrenalin',
        level: gsr > 2000 ? 'Tinggi' : gsr > 1000 ? 'Normal' : 'Rendah',
        value: Math.min(Math.round(gsr / 400), 10),
        color: gsr <= 1000 ? 'from-green-400 to-emerald-500' : 'from-yellow-400 to-orange-500',
        status: (gsr <= 1500 ? 'optimal' : 'warning') as 'optimal' | 'warning' | 'alert'
      }
    ];
  };

  // Generate radar chart data
  const getRadarData = () => [
    { aspect: 'Mood', current: mentalHealthMetrics.mood, optimal: 8 },
    { aspect: 'Energi', current: mentalHealthMetrics.energy, optimal: 8 },
    { aspect: 'Fokus', current: mentalHealthMetrics.focus, optimal: 8 },
    { aspect: 'Stress', current: 10 - mentalHealthMetrics.stress, optimal: 8 }, // Invert stress
    { aspect: 'Ketenangan', current: 10 - mentalHealthMetrics.anxiety, optimal: 8 }, // Invert anxiety
    { aspect: 'Stabilitas', current: Math.min((mentalHealthMetrics.mood + mentalHealthMetrics.energy) / 2, 10), optimal: 8 }
  ];

  // Generate recommendations based on current state
  const getRecommendations = () => {
    const recommendations = [];
    const { stress, mood, energy, anxiety } = mentalHealthMetrics;
    
    if (stress >= 7) {
      recommendations.push({
        icon: Brain,
        title: 'Manajemen Stress Tinggi',
        description: 'Lakukan teknik pernapasan dalam atau meditasi mindfulness',
        color: 'from-red-50 to-pink-50',
        iconColor: 'text-red-600',
        bgColor: 'bg-red-100'
      });
    }
    
    if (anxiety >= 6) {
      recommendations.push({
        icon: Moon,
        title: 'Reduksi Kecemasan',
        description: 'Coba progressive muscle relaxation atau grounding technique',
        color: 'from-blue-50 to-cyan-50',
        iconColor: 'text-blue-600',
        bgColor: 'bg-blue-100'
      });
    }
    
    if (energy <= 4) {
      recommendations.push({
        icon: Sun,
        title: 'Boost Energi Mental',
        description: 'Paparan sinar matahari pagi dan aktivitas fisik ringan',
        color: 'from-yellow-50 to-orange-50',
        iconColor: 'text-yellow-600',
        bgColor: 'bg-yellow-100'
      });
    }
    
    if (mood <= 4) {
      recommendations.push({
        icon: Smile,
        title: 'Peningkatan Mood',
        description: 'Aktivitas yang menyenangkan atau interaksi sosial positif',
        color: 'from-green-50 to-emerald-50',
        iconColor: 'text-green-600',
        bgColor: 'bg-green-100'
      });
    }
    
    // Default recommendations if everything is good
    if (recommendations.length === 0) {
      recommendations.push(
        {
          icon: CheckCircle,
          title: 'Pertahankan Kondisi',
          description: 'Kondisi mental Anda baik, lanjutkan pola hidup sehat',
          color: 'from-green-50 to-emerald-50',
          iconColor: 'text-green-600',
          bgColor: 'bg-green-100'
        },
        {
          icon: Brain,
          title: 'Optimisasi Lanjutan',
          description: 'Latihan mindfulness untuk meningkatkan awareness diri',
          color: 'from-purple-50 to-violet-50',
          iconColor: 'text-purple-600',
          bgColor: 'bg-purple-100'
        }
      );
    }
    
    return recommendations;
  };

  const getData = () => {
    return selectedPeriod === 'daily' && historicalData.length > 0 ? historicalData : [];
  };

  const getEmotionIcon = (emotion: string) => {
    switch(emotion) {
      case 'happy': return <Smile className="text-green-300" size={24} />;
      case 'calm': return <Meh className="text-blue-300" size={24} />;
      case 'focused': return <Brain className="text-purple-300" size={24} />;
      case 'stressed': return <AlertTriangle className="text-red-300" size={24} />;
      case 'tired': return <Frown className="text-orange-300" size={24} />;
      default: return <Meh className="text-gray-300" size={24} />;
    }
  };

  const getEmotionColor = (emotion: string) => {
    const colors: { [key: string]: string } = {
      happy: 'from-green-500 to-emerald-600',
      calm: 'from-blue-500 to-cyan-600',
      focused: 'from-purple-500 to-violet-600',
      stressed: 'from-red-500 to-pink-600',
      tired: 'from-orange-500 to-yellow-600',
      neutral: 'from-gray-500 to-slate-600'
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
          ) : trend < 0 ? (
            <TrendingDown size={14} className="text-red-200" />
          ) : (
            <div className="w-4 h-4" />
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
        <div className={`w-2 h-2 rounded-full mr-2 ${
          status === 'optimal' ? 'bg-green-300' : 
          status === 'warning' ? 'bg-yellow-300' : 'bg-red-300'
        }`}></div>
        <span className="text-white/80 text-xs">
          {status === 'optimal' ? 'Optimal' : 
           status === 'warning' ? 'Perhatian' : 'Tinggi'}
        </span>
      </div>
    </div>
  );

  return (
    <IonPage>
      <IonContent fullscreen className="[--ion-background-color:#f1f5f9]">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 text-white p-6 rounded-b-3xl shadow-xl">
          <h1 className="text-2xl font-bold mb-2">Kesehatan Mental</h1>
          <p className="text-violet-100 text-sm">Analisis mood, emosi, dan kondisi psikologis real-time</p>
          {!isConnected && (
            <p className="text-red-200 text-xs mt-1">⚠ Data real-time tidak tersedia</p>
          )}
        </div>

        <div className="p-6 space-y-6 pb-24">
          
          {/* Real-time Emotion Detection */}
          <div className={`bg-gradient-to-r ${getEmotionColor(currentEmotion)} rounded-3xl p-6 shadow-xl`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Status Emosi Real-time</h3>
                <p className="text-white/80 text-sm mb-3">Berdasarkan analisis biometrik sensor</p>
                <div className="flex items-center space-x-3">
                  {getEmotionIcon(currentEmotion)}
                  <span className="text-white text-xl font-bold capitalize">
                    {currentEmotion === 'happy' ? 'Bahagia' :
                     currentEmotion === 'calm' ? 'Tenang' :
                     currentEmotion === 'focused' ? 'Fokus' :
                     currentEmotion === 'stressed' ? 'Stress' :
                     currentEmotion === 'tired' ? 'Lelah' : 'Netral'}
                  </span>
                </div>
              </div>
              <div className="relative">
                <div className={`w-16 h-16 bg-white/20 rounded-full flex items-center justify-center ${isConnected ? 'animate-pulse' : ''}`}>
                  <Brain size={28} className="text-white" />
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
                {period === 'daily' ? 'Real-time' : 'Riwayat'}
              </button>
            ))}
          </div>

          {/* Mood Metrics - Real Firebase Data */}
          <div className="grid grid-cols-2 gap-4">
            <MoodMetricCard 
              title="Mood" 
              value={mentalHealthMetrics.mood} 
              trend={calculateTrend('mood')} 
              color="from-pink-400 to-rose-500" 
            />
            <MoodMetricCard 
              title="Tingkat Stress" 
              value={mentalHealthMetrics.stress} 
              trend={calculateTrend('stress')} 
              color="from-red-400 to-pink-500" 
            />
            <MoodMetricCard 
              title="Energi Mental" 
              value={mentalHealthMetrics.energy} 
              trend={calculateTrend('energy')} 
              color="from-blue-400 to-cyan-500" 
            />
            <MoodMetricCard 
              title="Fokus" 
              value={mentalHealthMetrics.focus} 
              trend={calculateTrend('focus')} 
              color="from-purple-400 to-violet-500" 
            />
          </div>

          {/* Mood Trend Chart - Real Data */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Trend Mood & Mental {selectedPeriod === 'daily' ? '(Real-time)' : ''}
            </h3>
            <div className="h-64">
              {getData().length > 0 ? (
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
                    <XAxis dataKey="time" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" domain={[0, 10]} />
                    <Tooltip contentStyle={{ backgroundColor: 'white', border: 'none', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="mood" stroke="#8B5CF6" fillOpacity={1} fill="url(#moodGradient)" strokeWidth={2} />
                    <Area type="monotone" dataKey="stress" stroke="#EF4444" fillOpacity={1} fill="url(#stressGradient)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>Menunggu data mental health real-time...</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Emotion Distribution & Mental Health Radar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Distribusi Emosi</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getEmotionDistribution()} 
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {getEmotionDistribution().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Profil Kesehatan Mental</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={getRadarData()}>
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

          {/* Hormonal Indicators - Based on Real Data */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Indikator Hormonal</h3>
            <p className="text-gray-600 text-sm mb-4">Estimasi berdasarkan data biofeedback real-time</p>
            <div className="grid grid-cols-2 gap-4">
              {getHormonalIndicators().map((item, index) => (
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

          {/* Mental Health Insights - Dynamic */}
          <div className="bg-gradient-to-r from-violet-100 to-purple-100 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-violet-800 mb-4">Insight Kesehatan Mental</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-violet-500 rounded-full mt-2"></div>
                <p className="text-violet-700 text-sm">
                  <strong>Status saat ini:</strong> {currentEmotion === 'happy' ? 'Kondisi emosi positif terdeteksi' :
                  currentEmotion === 'stressed' ? 'Indikator stress tinggi dari data biometrik' :
                  currentEmotion === 'calm' ? 'Kondisi mental tenang dan stabil' :
                  currentEmotion === 'focused' ? 'Tingkat fokus dan konsentrasi baik' :
                  'Kondisi mental dalam rentang normal'}.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <p className="text-purple-700 text-sm">
                  <strong>Data biometrik:</strong> GSR {currentData.gsr}, HR {currentData.bpm} bpm, Temp {currentData.temp.toFixed(1)}°C menunjukkan {mentalHealthMetrics.stress <= 4 ? 'tingkat stress rendah' : 'perlu monitoring stress'}.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                <p className="text-indigo-700 text-sm">
                  <strong>Trend mental:</strong> {historicalData.length} titik data historis menunjukkan {
                    calculateTrend('mood') > 0 ? 'peningkatan mood' : 
                    calculateTrend('mood') < 0 ? 'penurunan mood' : 'mood stabil'
                  } dalam periode monitoring.
                </p>
              </div>
            </div>
          </div>

          {/* Recommendations - Dynamic based on real data */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Rekomendasi</h3>
            <div className="space-y-3">
              {getRecommendations().map((rec, index) => (
                <div key={index} className={`bg-gradient-to-r ${rec.color} rounded-xl p-4`}>
                  <div className="flex items-center space-x-3">
                    <div className={`${rec.bgColor} rounded-full p-2`}>
                      <rec.icon size={20} className={rec.iconColor} />
                    </div>
                    <div>
                      <h4 className={`${rec.iconColor} font-semibold text-sm`}>{rec.title}</h4>
                      <p className="text-gray-600 text-xs">{rec.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;