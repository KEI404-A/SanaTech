// src/pages/Tab1.tsx

import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonFab, IonFabButton, IonIcon} from '@ionic/react';
import { Activity, Heart, Thermometer, Zap, Brain, Users, BookOpen, Wifi, WifiOff, AlertTriangle, CheckCircle, Clock, RefreshCw, TrendingUp, Shield, Star, ChevronRight } from 'lucide-react';
import { LucideIcon } from "lucide-react";
import { sparklesOutline } from 'ionicons/icons';
import { ref, onValue } from "firebase/database";
import { realtimeDb } from "../firebase-config";
import NewsButton from '../components/NewsButton';

const Tab1: React.FC = () => {
  // Firebase state
  const [bpm, setBpm] = useState(0);
  const [temp, setTemp] = useState(0);
  const [spo2, setSpo2] = useState(0);
  const [gsr, setGsr] = useState(0);
  
  // Enhanced connection state
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected' | 'error'>('disconnected');
  const [lastDataReceived, setLastDataReceived] = useState<Date | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [dataFreshness, setDataFreshness] = useState<'fresh' | 'stale' | 'outdated'>('outdated');
  
  // UI state
  const [currentTime, setCurrentTime] = useState(new Date());
  const [pulseAnimation, setPulseAnimation] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(true);

  // Enhanced Firebase data fetching with better connection detection
  useEffect(() => {
    setConnectionStatus('connecting');
    setConnectionAttempts(prev => prev + 1);

    const dataRef = ref(realtimeDb, "readings/latest");
    const unsubscribe = onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log("Firebase Data:", data);

        // Check if data is valid and recent
        const hasValidData = data.bpm || data.objTemp || data.ir || data.red;
        
        if (hasValidData) {
          setBpm(data.bpm || 0);
          setTemp(data.objTemp || 0);
          setSpo2(data.ir || 0);
          setGsr(data.red || 0);
          
          setIsConnected(true);
          setConnectionStatus('connected');
          setLastDataReceived(new Date());
          setDataFreshness('fresh');
          setConnectionAttempts(0);
        } else {
          setConnectionStatus('error');
          setIsConnected(false);
        }
      } else {
        setIsConnected(false);
        setConnectionStatus('disconnected');
      }
    }, (error) => {
      console.error("Firebase error:", error);
      setIsConnected(false);
      setConnectionStatus('error');
    });

    // Timeout untuk deteksi koneksi yang lambat
    const connectionTimeout = setTimeout(() => {
      if (connectionStatus === 'connecting') {
        setConnectionStatus('error');
        setIsConnected(false);
      }
    }, 10000); // 10 detik timeout

    return () => {
      unsubscribe();
      clearTimeout(connectionTimeout);
    };
  }, [connectionStatus]);

  // Monitor data freshness
  useEffect(() => {
    if (!lastDataReceived) return;

    const freshnessInterval = setInterval(() => {
      const now = new Date();
      const timeDiff = now.getTime() - lastDataReceived.getTime();
      
      if (timeDiff < 30000) { // < 30 seconds
        setDataFreshness('fresh');
      } else if (timeDiff < 120000) { // < 2 minutes
        setDataFreshness('stale');
      } else { // > 2 minutes
        setDataFreshness('outdated');
        setIsConnected(false);
        setConnectionStatus('disconnected');
      }
    }, 5000);

    return () => clearInterval(freshnessInterval);
  }, [lastDataReceived]);

  // UI timers
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const pulseTimer = setInterval(() => {
      setPulseAnimation(prev => !prev);
    }, 2000);

    return () => {
      clearInterval(timer);
      clearInterval(pulseTimer);
    };
  }, []);

  // Auto-hide notification after success
  useEffect(() => {
    if (connectionStatus === 'connected' && notificationVisible) {
      const hideTimer = setTimeout(() => {
        setNotificationVisible(false);
      }, 5000); // Hide after 5 seconds when connected

      return () => clearTimeout(hideTimer);
    } else if (connectionStatus !== 'connected') {
      setNotificationVisible(true);
    }
  }, [connectionStatus, notificationVisible]);

  // Enhanced notification component
  const ConnectionNotification = () => {
    const getNotificationConfig = () => {
      switch (connectionStatus) {
        case 'connected':
          return {
            icon: CheckCircle,
            title: 'Perangkat Terhubung',
            message: 'Semua sensor aktif',
            bgColor: 'from-emerald-50 via-green-50 to-teal-50',
            borderColor: 'border-emerald-200/60',
            textColor: 'text-emerald-900',
            subTextColor: 'text-emerald-700',
            iconColor: 'text-emerald-600',
            showFreshness: true
          };
        case 'connecting':
          return {
            icon: RefreshCw,
            title: 'Menghubungkan...',
            message: `Percobaan ke-${connectionAttempts}`,
            bgColor: 'from-blue-50 via-cyan-50 to-sky-50',
            borderColor: 'border-blue-200/60',
            textColor: 'text-blue-900',
            subTextColor: 'text-blue-700',
            iconColor: 'text-blue-600 animate-spin',
            showFreshness: false
          };
        case 'disconnected':
          return {
            icon: AlertTriangle,
            title: 'Perangkat Terputus',
            message: 'Mencoba koneksi ulang...',
            bgColor: 'from-amber-50 via-yellow-50 to-orange-50',
            borderColor: 'border-amber-200/60',
            textColor: 'text-amber-900',
            subTextColor: 'text-amber-700',
            iconColor: 'text-amber-600',
            showFreshness: false
          };
        case 'error':
          return {
            icon: WifiOff,
            title: 'Koneksi Gagal',
            message: 'Periksa perangkat dan jaringan',
            bgColor: 'from-red-50 via-rose-50 to-pink-50',
            borderColor: 'border-red-200/60',
            textColor: 'text-red-900',
            subTextColor: 'text-red-700',
            iconColor: 'text-red-600',
            showFreshness: false
          };
        default:
          return {
            icon: WifiOff,
            title: 'Status Tidak Diketahui',
            message: 'Memuat...',
            bgColor: 'from-gray-50 via-slate-50 to-zinc-50',
            borderColor: 'border-gray-200/60',
            textColor: 'text-gray-900',
            subTextColor: 'text-gray-700',
            iconColor: 'text-gray-600',
            showFreshness: false
          };
      }
    };

    const config = getNotificationConfig();

    if (!notificationVisible && connectionStatus === 'connected') {
      return null;
    }

    const getFreshnessIndicator = () => {
      if (!config.showFreshness || !lastDataReceived) return null;
      
      const now = new Date();
      const secondsAgo = Math.floor((now.getTime() - lastDataReceived.getTime()) / 1000);
      
      return (
        <div className="flex items-center space-x-2 mt-2">
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
            dataFreshness === 'fresh' ? 'bg-emerald-100 text-emerald-700' :
            dataFreshness === 'stale' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${
              dataFreshness === 'fresh' ? 'bg-emerald-500' :
              dataFreshness === 'stale' ? 'bg-amber-500' : 'bg-red-500'
            }`}></div>
            <span>{secondsAgo}s</span>
          </div>
        </div>
      );
    };

    return (
      <div className={`bg-gradient-to-br ${config.bgColor} ${config.borderColor} border-2 rounded-3xl p-5 shadow-lg backdrop-blur-sm transition-all duration-700 transform hover:scale-[1.02] ${connectionStatus === 'connecting' ? 'animate-pulse' : ''}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <config.icon size={20} className={config.iconColor} />
                {connectionStatus === 'connected' && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                )}
              </div>
              <div>
                <p className={`font-bold ${config.textColor} text-base`}>
                  {config.title}
                </p>
                <p className={`text-sm ${config.subTextColor} mt-0.5`}>
                  {config.message}
                </p>
              </div>
            </div>
            {getFreshnessIndicator()}
          </div>
          
          {connectionStatus === 'connected' && (
            <button
              onClick={() => setNotificationVisible(false)}
              className="text-emerald-500 hover:text-emerald-700 transition-colors ml-4 p-1 rounded-full hover:bg-emerald-100"
            >
              <span className="text-sm font-bold">✕</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  // Mental Health Analysis based on sensor data
  const analyzeMentalHealth = () => {
    const analysis = {
      stressLevel: 'Normal',
      anxietyLevel: 'Normal',
      emotionalState: 'Stabil',
      cognitiveLoad: 'Normal',
      overallMentalHealth: 'Baik',
      overallScore: 85,
      recommendations: [] as string[],
      insights: [] as string[]
    };

    // Only analyze if we have fresh data
    if (!isConnected || dataFreshness === 'outdated') {
      analysis.insights.push('Data tidak tersedia - analisis mental health memerlukan data sensor real-time');
      analysis.overallScore = 0;
      return analysis;
    }

    // GSR Analysis (Galvanic Skin Response) - Range: 0-1023 ADC
    const gsrNormalized = (gsr / 1023) * 100; // Convert to percentage
    
    // Stress Level Analysis (based on GSR + Heart Rate)
    if (gsrNormalized > 70 || bpm > 100) {
      analysis.stressLevel = 'Tinggi';
      analysis.overallScore -= 20;
      analysis.recommendations.push('Lakukan teknik pernapasan dalam atau meditasi');
      analysis.insights.push('Tingkat aktivitas kelenjar keringat menunjukkan respons stress yang tinggi');
    } else if (gsrNormalized > 40 || bpm > 85) {
      analysis.stressLevel = 'Sedang';
      analysis.overallScore -= 10;
      analysis.recommendations.push('Pertimbangkan aktivitas relaksasi ringan');
    }

    // Anxiety Level Analysis (based on GSR patterns + Heart Rate)
    if (gsrNormalized > 60 && bpm > 90) {
      analysis.anxietyLevel = 'Tinggi';
      analysis.overallScore -= 15;
      analysis.insights.push('Pola GSR dan detak jantung menunjukkan kemungkinan kecemasan');
      analysis.recommendations.push('Konsultasi dengan profesional jika gejala berlanjut');
    } else if (gsrNormalized > 35 && bpm > 80) {
      analysis.anxietyLevel = 'Sedang';
      analysis.overallScore -= 8;
    }

    // Emotional Reactivity Analysis (based on GSR sensitivity)
    if (gsrNormalized > 80) {
      analysis.emotionalState = 'Reaktif Tinggi';
      analysis.overallScore -= 10;
      analysis.insights.push('Respons emosional terhadap stimulus cukup tinggi');
    } else if (gsrNormalized > 50) {
      analysis.emotionalState = 'Reaktif Sedang';
      analysis.overallScore -= 5;
    } else {
      analysis.emotionalState = 'Stabil';
    }

    // Cognitive Load Analysis (based on combined metrics)
    const cognitiveScore = (gsrNormalized * 0.3) + ((bpm - 60) * 0.7) + (temp > 37 ? 20 : 0);
    if (cognitiveScore > 50) {
      analysis.cognitiveLoad = 'Tinggi';
      analysis.overallScore -= 15;
      analysis.recommendations.push('Istirahat sejenak untuk mengurangi beban mental');
    } else if (cognitiveScore > 25) {
      analysis.cognitiveLoad = 'Sedang';
      analysis.overallScore -= 8;
    }

    // Temperature Analysis for Mental Health
    if (temp > 37.5) {
      analysis.insights.push('Suhu tubuh tinggi dapat mempengaruhi mood dan kognisi');
      analysis.recommendations.push('Pastikan hidrasi yang cukup dan istirahat');
      analysis.overallScore -= 5;
    } else if (temp < 36.0) {
      analysis.insights.push('Suhu tubuh rendah mungkin terkait dengan kondisi circadian rhythm');
    }

    // Circadian Rhythm Analysis (based on temperature patterns)
    const currentHour = new Date().getHours();
    if (currentHour >= 6 && currentHour <= 18) {
      // Daytime - normal temp should be higher
      if (temp < 36.3) {
        analysis.insights.push('Pola suhu tubuh menunjukkan kemungkinan gangguan ritme sirkadian');
      }
    } else {
      // Nighttime - normal temp should be lower
      if (temp > 37.0) {
        analysis.insights.push('Suhu tubuh tinggi di malam hari dapat mempengaruhi kualitas tidur');
      }
    }

    // Overall Mental Health Assessment
    const riskFactors = [
      analysis.stressLevel === 'Tinggi',
      analysis.anxietyLevel === 'Tinggi',
      analysis.cognitiveLoad === 'Tinggi',
      analysis.emotionalState === 'Reaktif Tinggi'
    ].filter(Boolean).length;

    if (riskFactors >= 3) {
      analysis.overallMentalHealth = 'Perlu Perhatian';
      analysis.recommendations.push('Pertimbangkan konsultasi dengan profesional kesehatan mental');
    } else if (riskFactors >= 2) {
      analysis.overallMentalHealth = 'Cukup Baik';
      analysis.recommendations.push('Terapkan strategi manajemen stress secara konsisten');
    } else {
      analysis.overallMentalHealth = 'Baik';
    }

    // Add general wellness insights
    if (bpm >= 60 && bpm <= 80 && gsrNormalized < 40) {
      analysis.insights.push('Pola biometrik menunjukkan kondisi mental yang stabil dan sehat');
    }

    // Add data quality insights
    if (dataFreshness === 'stale') {
      analysis.insights.push('Data sensor sedikit tertunda - refresh koneksi untuk analisis yang lebih akurat');
    }

    // Ensure score doesn't go below 0
    analysis.overallScore = Math.max(0, analysis.overallScore);

    return analysis;
  };

  const mentalHealthAnalysis = analyzeMentalHealth();

interface QuickMetricProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  unit?: string;
  color: string;
  animate?: boolean;
  trend?: 'up' | 'down' | 'stable';
  status?: 'normal' | 'warning' | 'danger';
}

const QuickMetric: React.FC<QuickMetricProps> = ({ 
  icon: Icon, 
  label, 
  value, 
  unit, 
  color, 
  animate = false,
  trend = 'stable',
  status = 'normal'
}) => {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp size={12} className="text-green-500" />;
    if (trend === 'down') return <TrendingUp size={12} className="text-red-500 transform rotate-180" />;
    return null;
  };

  const getStatusDot = () => {
    const statusColors = {
      normal: 'bg-green-400',
      warning: 'bg-yellow-400',
      danger: 'bg-red-400'
    };
    return <div className={`w-2 h-2 rounded-full ${statusColors[status]} absolute -top-1 -right-1`}></div>;
  };

  return (
    <div
      className={`bg-gradient-to-br ${color} rounded-3xl p-6 shadow-xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl ${animate ? 'animate-pulse' : ''} ${dataFreshness === 'outdated' ? 'opacity-60 grayscale' : ''} backdrop-blur-sm relative overflow-hidden group`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white transform translate-x-6 -translate-y-6"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white transform -translate-x-4 translate-y-4"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="bg-white/20 rounded-2xl p-3 backdrop-blur-sm relative">
            <Icon size={24} className="text-white" />
            {dataFreshness === 'fresh' && getStatusDot()}
          </div>
          {getTrendIcon()}
        </div>
        
        <div className="space-y-1">
          <p className="text-white/90 text-sm font-medium tracking-wide">{label}</p>
          <div className="flex items-baseline space-x-1">
            <p className="text-white text-3xl font-bold tracking-tight">
              {dataFreshness === 'outdated' ? '--' : value}
            </p>
            {unit && <span className="text-white/80 text-lg font-medium">{unit}</span>}
          </div>
        </div>
        
        {/* Pulse indicator for fresh data */}
        {dataFreshness === 'fresh' && (
          <div className="absolute bottom-4 right-4">
            <div className="w-3 h-3 bg-white/40 rounded-full animate-ping"></div>
            <div className="absolute inset-0 w-3 h-3 bg-white rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
};

interface NavigationCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick?: () => void;
  gradient: string;
  badge?: string;
}

const NavigationCard: React.FC<NavigationCardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  onClick, 
  gradient,
  badge
}) => (
  <div
    onClick={onClick}
    className={`bg-gradient-to-br ${gradient} rounded-3xl p-6 shadow-xl cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl relative overflow-hidden group`}
  >
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-white transform translate-x-4 -translate-y-4"></div>
      <div className="absolute bottom-0 left-0 w-12 h-12 rounded-full bg-white transform -translate-x-3 translate-y-3"></div>
    </div>
    
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-4">
        <div className="bg-white/20 rounded-2xl p-3 backdrop-blur-sm">
          <Icon size={24} className="text-white" />
        </div>
        {badge && (
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-2 py-1">
            <span className="text-white text-xs font-bold">{badge}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="text-white font-bold text-lg tracking-tight">{title}</h3>
        <p className="text-white/80 text-sm leading-relaxed">{description}</p>
      </div>
      
      <div className="flex items-center justify-end mt-4">
        <ChevronRight size={20} className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
      </div>
    </div>
  </div>
);

  return (
    <IonPage>
      <IonContent fullscreen className="[--ion-background-color:#f8fafc]">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white transform translate-x-10 -translate-y-10"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white transform -translate-x-8 translate-y-8"></div>
            <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full bg-white transform -translate-x-12 -translate-y-12"></div>
          </div>
          
          <div className="relative z-10 p-6 pb-8">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="bg-white/20 rounded-xl p-2 backdrop-blur-sm">
                    <Shield size={20} className="text-white" />
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight">SanaTech</h1>
                </div>
                <p className="text-indigo-100 text-sm font-medium">
                  Biofeedback Health Monitor
                </p>
                <p className="text-indigo-200 text-xs">
                  {currentTime.toLocaleString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              
              {/* Status and Controls */}
              <div className="flex items-center space-x-3">
                {/* Enhanced Connection Status */}
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-2xl px-3 py-2">
                  {connectionStatus === 'connected' ? (
                    <Wifi className="text-emerald-300" size={18} />
                  ) : connectionStatus === 'connecting' ? (
                    <RefreshCw className="text-blue-300 animate-spin" size={18} />
                  ) : (
                    <WifiOff className="text-red-300" size={18} />
                  )}
                  <div className={`w-2 h-2 rounded-full ${
                    connectionStatus === 'connected' ? 'bg-emerald-400' : 
                    connectionStatus === 'connecting' ? 'bg-blue-400' : 'bg-red-400'
                  } ${pulseAnimation ? 'animate-ping' : ''}`}></div>
                </div>
                
                {/* NewsButton */}
                <NewsButton />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8 pb-24">
          {/* Enhanced Connection Status Notification */}
          <ConnectionNotification />

          {/* Enhanced Quick Metrics */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Monitor Real-time</h2>
                <p className="text-gray-600 text-sm mt-1">Data biometrik langsung dari sensor</p>
              </div>
              {dataFreshness !== 'fresh' && (
                <div className="flex items-center space-x-2 bg-amber-50 rounded-full px-3 py-2">
                  <Clock size={14} className="text-amber-600" />
                  <span className="text-xs text-amber-700 font-medium">
                    {dataFreshness === 'stale' ? 'Data tertunda' : 'Tidak tersedia'}
                  </span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <QuickMetric
                icon={Heart}
                label="Detak Jantung"
                value={bpm}
                unit=" bpm"
                color="from-rose-400 to-pink-600"
                animate={pulseAnimation && bpm > 0 && dataFreshness === 'fresh'}
                trend={bpm > 90 ? 'up' : bpm < 60 ? 'down' : 'stable'}
                status={bpm > 100 || bpm < 50 ? 'danger' : bpm > 90 || bpm < 60 ? 'warning' : 'normal'}
              />
              <QuickMetric
                icon={Activity}
                label="SpO2 (IR)"
                value={spo2}
                unit=""
                color="from-blue-400 to-cyan-600"
                status={spo2 < 95 ? 'danger' : spo2 < 98 ? 'warning' : 'normal'}
              />
              <QuickMetric
                icon={Thermometer}
                label="Suhu Tubuh"
                value={temp.toFixed(1)}
                unit="°C"
                color="from-orange-400 to-red-600"
                status={temp > 37.5 || temp < 36 ? 'warning' : 'normal'}
              />
              <QuickMetric
                icon={Zap}
                label="GSR Level"
                value={gsr}
                unit=""
                color="from-yellow-400 to-orange-600"
                status={gsr > 700 ? 'warning' : 'normal'}
              />
            </div>
          </div>

          {/* Enhanced Mental Health Analysis */}
          <div className={`bg-gradient-to-br from-indigo-50 via-purple-50 to-violet-50 rounded-3xl p-6 shadow-xl border border-indigo-100 ${dataFreshness === 'outdated' ? 'opacity-75' : ''} relative overflow-hidden`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-indigo-500 transform translate-x-8 -translate-y-8"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-purple-500 transform -translate-x-6 translate-y-6"></div>
            </div>
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-indigo-100 rounded-2xl p-3">
                    <Brain size={24} className="text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-indigo-900">Analisis Kesehatan Mental</h3>
                    <p className="text-indigo-700 text-sm">Berdasarkan data biometrik real-time</p>
                  </div>
                </div>
                
                {/* Overall Score Display */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Star size={16} className={`${mentalHealthAnalysis.overallScore >= 80 ? 'text-green-500' : mentalHealthAnalysis.overallScore >= 60 ? 'text-yellow-500' : 'text-red-500'}`} />
                    <span className={`text-2xl font-bold ${mentalHealthAnalysis.overallScore >= 80 ? 'text-green-600' : mentalHealthAnalysis.overallScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {mentalHealthAnalysis.overallScore}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 font-medium">Skor Wellness</p>
                </div>
              </div>
              
              {/* Mental Health Metrics Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40">
                  <p className="text-indigo-700 font-semibold text-sm mb-1">Tingkat Stress</p>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${mentalHealthAnalysis.stressLevel === 'Normal' ? 'bg-green-400' : mentalHealthAnalysis.stressLevel === 'Sedang' ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
                    <p className={`text-lg font-bold ${mentalHealthAnalysis.stressLevel === 'Normal' ? 'text-green-700' : mentalHealthAnalysis.stressLevel === 'Sedang' ? 'text-yellow-700' : 'text-red-700'}`}>
                      {mentalHealthAnalysis.stressLevel}
                    </p>
                  </div>
                </div>
                
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40">
                  <p className="text-indigo-700 font-semibold text-sm mb-1">Tingkat Kecemasan</p>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${mentalHealthAnalysis.anxietyLevel === 'Normal' ? 'bg-green-400' : mentalHealthAnalysis.anxietyLevel === 'Sedang' ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
                    <p className={`text-lg font-bold ${mentalHealthAnalysis.anxietyLevel === 'Normal' ? 'text-green-700' : mentalHealthAnalysis.anxietyLevel === 'Sedang' ? 'text-yellow-700' : 'text-red-700'}`}>
                      {mentalHealthAnalysis.anxietyLevel}
                    </p>
                  </div>
                </div>
                
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40">
                  <p className="text-indigo-700 font-semibold text-sm mb-1">State Emosional</p>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${mentalHealthAnalysis.emotionalState === 'Stabil' ? 'bg-green-400' : 'bg-blue-400'}`}></div>
                    <p className={`text-lg font-bold ${mentalHealthAnalysis.emotionalState === 'Stabil' ? 'text-green-700' : 'text-blue-700'}`}>
                      {mentalHealthAnalysis.emotionalState}
                    </p>
                  </div>
                </div>
                
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40">
                  <p className="text-indigo-700 font-semibold text-sm mb-1">Beban Kognitif</p>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${mentalHealthAnalysis.cognitiveLoad === 'Normal' ? 'bg-green-400' : mentalHealthAnalysis.cognitiveLoad === 'Sedang' ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
                    <p className={`text-lg font-bold ${mentalHealthAnalysis.cognitiveLoad === 'Normal' ? 'text-green-700' : mentalHealthAnalysis.cognitiveLoad === 'Sedang' ? 'text-yellow-700' : 'text-red-700'}`}>
                      {mentalHealthAnalysis.cognitiveLoad}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Overall Assessment */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white/40">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-indigo-700 font-semibold">Kondisi Mental Keseluruhan</p>
                    <p className={`text-2xl font-bold ${mentalHealthAnalysis.overallMentalHealth === 'Baik' ? 'text-green-700' : mentalHealthAnalysis.overallMentalHealth === 'Cukup Baik' ? 'text-yellow-700' : 'text-red-700'}`}>
                      {mentalHealthAnalysis.overallMentalHealth}
                    </p>
                  </div>
                  <div className="bg-indigo-100 rounded-2xl p-3">
                    <Brain size={32} className="text-indigo-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Navigation Menu */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Menu Utama</h2>
              <p className="text-gray-600 text-sm mt-1">Akses fitur lengkap SanaTech</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <NavigationCard
                icon={Heart}
                title="Kesehatan Fisik"
                description="Monitor komprehensif data biometrik & aktivitas"
                gradient="from-emerald-400 via-teal-500 to-green-600"
                badge="Live"
                onClick={() => { }}
              />
              <NavigationCard
                icon={Brain}
                title="Kesehatan Mental"
                description="Analisis mendalam mood & kondisi psikologis"
                gradient="from-violet-400 via-purple-500 to-indigo-600"
                badge="AI"
                onClick={() => { }}
              />
              <NavigationCard
                icon={BookOpen}
                title="Ensiklopedia"
                description="Panduan lengkap psikologi Society 5.0"
                gradient="from-blue-400 via-indigo-500 to-purple-600"
                onClick={() => { }}
              />
              <NavigationCard
                icon={Users}
                title="Komunitas"
                description="Berbagi pengalaman & diskusi dengan ahli"
                gradient="from-pink-400 via-rose-500 to-red-600"
                badge="New"
                onClick={() => { }}
              />
            </div>
          </div>

          {/* Enhanced Recommendations */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-blue-500 transform translate-x-6 -translate-y-6"></div>
            </div>
            
            <div className="relative z-10 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 rounded-2xl p-3">
                  <Star size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Rekomendasi Personal</h3>
                  <p className="text-gray-600 text-sm">Berdasarkan analisis data Anda</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {mentalHealthAnalysis.recommendations.length > 0 ? (
                  mentalHealthAnalysis.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                      <p className="text-gray-800 text-sm leading-relaxed font-medium">{rec}</p>
                    </div>
                  ))
                ) : (
                  <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle size={14} className="text-white" />
                    </div>
                    <p className="text-gray-800 text-sm leading-relaxed font-medium">
                      Kondisi mental Anda stabil - pertahankan pola hidup sehat dan rutinitas positif
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Scientific Insights */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full bg-purple-500 transform -translate-x-7 translate-y-7"></div>
            </div>
            
            <div className="relative z-10 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 rounded-2xl p-3">
                  <Activity size={20} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Insight Biometrik</h3>
                  <p className="text-gray-600 text-sm">Analisis ilmiah data sensor</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {mentalHealthAnalysis.insights.length > 0 ? (
                  mentalHealthAnalysis.insights.map((insight, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl border border-purple-100">
                      <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-3"></div>
                      <p className="text-gray-800 text-sm leading-relaxed">{insight}</p>
                    </div>
                  ))
                ) : (
                  <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl border border-gray-100">
                    <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0 mt-3"></div>
                    <p className="text-gray-800 text-sm leading-relaxed">
                      Monitoring berlangsung - mengumpulkan data untuk analisis mendalam
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced FAB */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton 
            routerLink="/chatai" 
            className="shadow-2xl"
            style={{
              '--background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '--background-activated': 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
            }}
          >
            <IonIcon icon={sparklesOutline}></IonIcon>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;