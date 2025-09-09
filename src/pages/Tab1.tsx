// src/pages/Tab1.tsx

import React, { useState, useEffect } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { Activity, Heart, Thermometer, Zap, Brain, Users, BookOpen, Wifi, WifiOff, AlertTriangle, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { LucideIcon } from "lucide-react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase-config";
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

    const dataRef = ref(db, "readings/latest");
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
  }, []);

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
            title: 'Perangkat Biofeedback Terhubung',
            message: 'Semua sensor berfungsi normal',
            bgColor: 'from-green-100 to-emerald-100',
            borderColor: 'border-green-200',
            textColor: 'text-green-800',
            subTextColor: 'text-green-600',
            iconColor: 'text-green-500',
            showFreshness: true
          };
        case 'connecting':
          return {
            icon: RefreshCw,
            title: 'Menghubungkan ke Perangkat...',
            message: `Percobaan ke-${connectionAttempts}`,
            bgColor: 'from-blue-100 to-cyan-100',
            borderColor: 'border-blue-200',
            textColor: 'text-blue-800',
            subTextColor: 'text-blue-600',
            iconColor: 'text-blue-500 animate-spin',
            showFreshness: false
          };
        case 'disconnected':
          return {
            icon: AlertTriangle,
            title: 'Perangkat Biofeedback Terputus',
            message: 'Mencoba menghubungkan kembali...',
            bgColor: 'from-yellow-100 to-orange-100',
            borderColor: 'border-yellow-200',
            textColor: 'text-yellow-800',
            subTextColor: 'text-yellow-600',
            iconColor: 'text-yellow-500',
            showFreshness: false
          };
        case 'error':
          return {
            icon: WifiOff,
            title: 'Perangkat Tidak Terhubung',
            message: 'Periksa koneksi Firebase dan perangkat',
            bgColor: 'from-red-100 to-pink-100',
            borderColor: 'border-red-200',
            textColor: 'text-red-800',
            subTextColor: 'text-red-600',
            iconColor: 'text-red-500',
            showFreshness: false
          };
        default:
          return {
            icon: WifiOff,
            title: 'Status Tidak Diketahui',
            message: 'Memuat...',
            bgColor: 'from-gray-100 to-slate-100',
            borderColor: 'border-gray-200',
            textColor: 'text-gray-800',
            subTextColor: 'text-gray-600',
            iconColor: 'text-gray-500',
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
        <div className="flex items-center space-x-1 mt-1">
          <Clock size={12} className={config.subTextColor} />
          <span className={`text-xs ${config.subTextColor}`}>
            Update terakhir: {secondsAgo}s yang lalu
          </span>
          <div className={`w-1 h-1 rounded-full ${
            dataFreshness === 'fresh' ? 'bg-green-400' :
            dataFreshness === 'stale' ? 'bg-yellow-400' : 'bg-red-400'
          }`}></div>
        </div>
      );
    };

    return (
      <div className={`bg-gradient-to-r ${config.bgColor} ${config.borderColor} border-2 rounded-2xl p-4 shadow-md transition-all duration-500 ${connectionStatus === 'connecting' ? 'animate-pulse' : ''}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <config.icon size={18} className={config.iconColor} />
              <p className={`font-semibold ${config.textColor}`}>
                {config.title}
              </p>
            </div>
            <p className={`text-sm ${config.subTextColor} mt-1`}>
              {config.message}
            </p>
            {getFreshnessIndicator()}
          </div>
          
          {connectionStatus === 'connected' && (
            <button
              onClick={() => setNotificationVisible(false)}
              className="text-green-500 hover:text-green-700 transition-colors"
            >
              <span className="text-xs">✕</span>
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
      recommendations: [] as string[],
      insights: [] as string[]
    };

    // Only analyze if we have fresh data
    if (!isConnected || dataFreshness === 'outdated') {
      analysis.insights.push('Data tidak tersedia - analisis mental health memerlukan data sensor real-time');
      return analysis;
    }

    // GSR Analysis (Galvanic Skin Response) - Range: 0-1023 ADC
    const gsrNormalized = (gsr / 1023) * 100; // Convert to percentage
    
    // Stress Level Analysis (based on GSR + Heart Rate)
    if (gsrNormalized > 70 || bpm > 100) {
      analysis.stressLevel = 'Tinggi';
      analysis.recommendations.push('Lakukan teknik pernapasan dalam atau meditasi');
      analysis.insights.push('Tingkat aktivitas kelenjar keringat menunjukkan respons stress yang tinggi');
    } else if (gsrNormalized > 40 || bpm > 85) {
      analysis.stressLevel = 'Sedang';
      analysis.recommendations.push('Pertimbangkan aktivitas relaksasi ringan');
    }

    // Anxiety Level Analysis (based on GSR patterns + Heart Rate)
    if (gsrNormalized > 60 && bpm > 90) {
      analysis.anxietyLevel = 'Tinggi';
      analysis.insights.push('Pola GSR dan detak jantung menunjukkan kemungkinan kecemasan');
      analysis.recommendations.push('Konsultasi dengan profesional jika gejala berlanjut');
    } else if (gsrNormalized > 35 && bpm > 80) {
      analysis.anxietyLevel = 'Sedang';
    }

    // Emotional Reactivity Analysis (based on GSR sensitivity)
    if (gsrNormalized > 80) {
      analysis.emotionalState = 'Reaktif Tinggi';
      analysis.insights.push('Respons emosional terhadap stimulus cukup tinggi');
    } else if (gsrNormalized > 50) {
      analysis.emotionalState = 'Reaktif Sedang';
    } else {
      analysis.emotionalState = 'Stabil';
    }

    // Cognitive Load Analysis (based on combined metrics)
    const cognitiveScore = (gsrNormalized * 0.3) + ((bpm - 60) * 0.7) + (temp > 37 ? 20 : 0);
    if (cognitiveScore > 50) {
      analysis.cognitiveLoad = 'Tinggi';
      analysis.recommendations.push('Istirahat sejenak untuk mengurangi beban mental');
    } else if (cognitiveScore > 25) {
      analysis.cognitiveLoad = 'Sedang';
    }

    // Temperature Analysis for Mental Health
    if (temp > 37.5) {
      analysis.insights.push('Suhu tubuh tinggi dapat mempengaruhi mood dan kognisi');
      analysis.recommendations.push('Pastikan hidrasi yang cukup dan istirahat');
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
}

const QuickMetric: React.FC<QuickMetricProps> = ({ 
  icon: Icon, 
  label, 
  value, 
  unit, 
  color, 
  animate = false 
}) => (
  <div
    className={`bg-gradient-to-br ${color} rounded-2xl p-4 shadow-lg transform transition-all duration-300 hover:scale-105 ${animate ? 'animate-pulse' : ''} ${dataFreshness === 'outdated' ? 'opacity-50' : ''}`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-white/80 text-sm font-medium">{label}</p>
        <p className="text-white text-2xl font-bold">
          {dataFreshness === 'outdated' ? '--' : value}
          {unit && <span className="text-lg">{unit}</span>}
        </p>
      </div>
      <div className="relative">
        <Icon size={32} className="text-white/90" />
        {dataFreshness === 'fresh' && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        )}
      </div>
    </div>
  </div>
);

interface NavigationCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick?: () => void;
  gradient: string;
}

const NavigationCard: React.FC<NavigationCardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  onClick, 
  gradient 
}) => (
  <div
    onClick={onClick}
    className={`bg-gradient-to-br ${gradient} rounded-3xl p-6 shadow-xl cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl`}
  >
    <div className="flex flex-col items-center text-center space-y-3">
      <div className="bg-white/20 rounded-full p-4 backdrop-blur-sm">
        <Icon size={28} className="text-white" />
      </div>
      <h3 className="text-white font-bold text-lg">{title}</h3>
      <p className="text-white/80 text-sm">{description}</p>
    </div>
  </div>
);

  return (
    <IonPage>
      <IonContent fullscreen className="[--ion-background-color:#f1f5f9]">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white p-6 rounded-b-3xl shadow-xl relative">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">SanaTech</h1>
              <p className="text-blue-100 text-sm">
                {currentTime.toLocaleString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            
            {/* Container kanan untuk WiFi dan NewsButton */}
            <div className="flex items-center space-x-4">
              {/* WiFi dan sinyal dengan status lebih detail */}
              <div className="flex items-center space-x-2">
                {connectionStatus === 'connected' ? (
                  <Wifi className="text-green-300" size={24} />
                ) : connectionStatus === 'connecting' ? (
                  <RefreshCw className="text-blue-300 animate-spin" size={24} />
                ) : (
                  <WifiOff className="text-red-300" size={24} />
                )}
                <div className={`w-3 h-3 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-green-400' : 
                  connectionStatus === 'connecting' ? 'bg-blue-400' : 'bg-red-400'
                } ${pulseAnimation ? 'animate-ping' : ''}`}></div>
              </div>
              
              {/* NewsButton */}
              <NewsButton />
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 pb-24">
          {/* Enhanced Connection Status Notification */}
          <ConnectionNotification />

          {/* Quick Metrics - Real Firebase Data */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Status Real-time</h2>
              {dataFreshness !== 'fresh' && (
                <div className="flex items-center space-x-1">
                  <Clock size={14} className="text-gray-500" />
                  <span className="text-xs text-gray-500">
                    {dataFreshness === 'stale' ? 'Data tertunda' : 'Data tidak tersedia'}
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
                color="from-red-400 to-pink-500"
                animate={pulseAnimation && bpm > 0 && dataFreshness === 'fresh'}
              />
              <QuickMetric
                icon={Activity}
                label="SpO2 (IR)"
                value={spo2}
                unit=""
                color="from-blue-400 to-cyan-500"
              />
              <QuickMetric
                icon={Thermometer}
                label="Suhu Tubuh"
                value={temp.toFixed(1)}
                unit="°C"
                color="from-orange-400 to-red-500"
              />
              <QuickMetric
                icon={Zap}
                label="GSR Level"
                value={gsr}
                unit=""
                color="from-yellow-400 to-orange-500"
              />
            </div>
          </div>

          {/* Mental State Summary - Enhanced Analysis */}
          <div className={`bg-gradient-to-r from-indigo-100 to-purple-100 rounded-3xl p-6 shadow-lg ${dataFreshness === 'outdated' ? 'opacity-75' : ''}`}>
            <h3 className="text-lg font-bold text-indigo-800 mb-3">Analisis Kesehatan Mental</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/50 rounded-xl p-3">
                  <p className="text-indigo-600 font-semibold text-sm">Tingkat Stress</p>
                  <p className={`text-lg font-bold ${mentalHealthAnalysis.stressLevel === 'Normal' ? 'text-green-600' : mentalHealthAnalysis.stressLevel === 'Sedang' ? 'text-yellow-600' : 'text-red-600'}`}>
                    {mentalHealthAnalysis.stressLevel}
                  </p>
                </div>
                <div className="bg-white/50 rounded-xl p-3">
                  <p className="text-indigo-600 font-semibold text-sm">Tingkat Kecemasan</p>
                  <p className={`text-lg font-bold ${mentalHealthAnalysis.anxietyLevel === 'Normal' ? 'text-green-600' : mentalHealthAnalysis.anxietyLevel === 'Sedang' ? 'text-yellow-600' : 'text-red-600'}`}>
                    {mentalHealthAnalysis.anxietyLevel}
                  </p>
                </div>
                <div className="bg-white/50 rounded-xl p-3">
                  <p className="text-indigo-600 font-semibold text-sm">State Emosional</p>
                  <p className={`text-lg font-bold ${mentalHealthAnalysis.emotionalState === 'Stabil' ? 'text-green-600' : 'text-blue-600'}`}>
                    {mentalHealthAnalysis.emotionalState}
                  </p>
                </div>
                <div className="bg-white/50 rounded-xl p-3">
                  <p className="text-indigo-600 font-semibold text-sm">Beban Kognitif</p>
                  <p className={`text-lg font-bold ${mentalHealthAnalysis.cognitiveLoad === 'Normal' ? 'text-green-600' : mentalHealthAnalysis.cognitiveLoad === 'Sedang' ? 'text-yellow-600' : 'text-red-600'}`}>
                    {mentalHealthAnalysis.cognitiveLoad}
                  </p>
                </div>
              </div>
              <div className="bg-white/50 rounded-xl p-4 mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-600 font-semibold">Kondisi Mental Keseluruhan</p>
                    <p className={`text-xl font-bold ${mentalHealthAnalysis.overallMentalHealth === 'Baik' ? 'text-green-600' : mentalHealthAnalysis.overallMentalHealth === 'Cukup Baik' ? 'text-yellow-600' : 'text-red-600'}`}>
                      {mentalHealthAnalysis.overallMentalHealth}
                    </p>
                  </div>
                  <Brain size={40} className="text-indigo-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Menu Utama</h2>
            <div className="grid grid-cols-2 gap-4">
              <NavigationCard
                icon={Heart}
                title="Kesehatan Fisik"
                description="Monitor data biometrik & aktivitas harian"
                gradient="from-emerald-400 to-teal-500"
                onClick={() => { }}
              />
              <NavigationCard
                icon={Brain}
                title="Kesehatan Mental"
                description="Analisis mood & kondisi psikologis"
                gradient="from-violet-400 to-purple-500"
                onClick={() => { }}
              />
              <NavigationCard
                icon={BookOpen}
                title="Ensiklopedia"
                description="Panduan psikologi Society 5.0"
                gradient="from-blue-400 to-indigo-500"
                onClick={() => { }}
              />
              <NavigationCard
                icon={Users}
                title="Forum Komunitas"
                description="Berbagi pengalaman & diskusi"
                gradient="from-pink-400 to-rose-500"
                onClick={() => { }}
              />
            </div>
          </div>

          {/* Mental Health Recommendations - Dynamic based on analysis */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Rekomendasi Kesehatan Mental</h3>
            <div className="space-y-3">
              {mentalHealthAnalysis.recommendations.length > 0 ? (
                mentalHealthAnalysis.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                    <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                    <p className="text-gray-700 text-sm">{rec}</p>
                  </div>
                ))
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <p className="text-gray-700 text-sm">Kondisi mental Anda stabil - pertahankan pola hidup sehat</p>
                </div>
              )}
            </div>
          </div>

          {/* Scientific Insights */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Insight Biometrik Mental</h3>
            <div className="space-y-3">
              {mentalHealthAnalysis.insights.length > 0 ? (
                mentalHealthAnalysis.insights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl">
                    <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0 mt-2"></div>
                    <p className="text-gray-700 text-sm">{insight}</p>
                  </div>
                ))
              ) : (
                <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                  <p className="text-gray-700 text-sm">Monitoring berlangsung - data lebih lanjut diperlukan untuk analisis mendalam</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;