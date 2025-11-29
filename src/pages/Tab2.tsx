import React, { useState, useEffect } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Heart, Thermometer, Activity, Droplets, Flame, TrendingUp, TrendingDown, AlertCircle, CheckCircle, BarChart3, Calendar, Clock, Target, Award, Zap, Shield } from 'lucide-react';
import { ref, onValue } from "firebase/database";
import { realtimeDb } from "../firebase-config";

interface MetricCardProps {
  icon: React.ElementType;
  title: string;
  value: string | number;
  unit: string;
  trend: number;
  status: 'normal' | 'warning' | 'excellent';
  color: string;
  subtitle?: string;
}

interface RecommendationCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  priority?: 'high' | 'medium' | 'low';
}

interface DataPoint {
  time: string;
  heartRate: number;
  spo2: number;
  temp: number;
  gsr: number;
  timestamp: number;
}

const Tab2: React.FC = () => {
  // Firebase real-time data
  const [currentData, setCurrentData] = useState({
    bpm: 0,
    temp: 0,
    spo2: 0,
    gsr: 0
  });

  // Historical data for charts
  const [historicalData, setHistoricalData] = useState<DataPoint[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  
  // UI state
  const [selectedPeriod, setSelectedPeriod] = useState('daily');
  const [selectedMetric, setSelectedMetric] = useState('heartRate');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Firebase data fetching for current values
  useEffect(() => {
    const dataRef = ref(realtimeDb, "readings/latest");
    const unsubscribe = onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log("Firebase Data Tab2:", data);

        const newData = {
          bpm: data.bpm || 0,
          temp: data.objTemp || 0,
          spo2: data.ir || 0,
          gsr: data.red || 0
        };

        setCurrentData(newData);
        setIsConnected(true);

        // Add to historical data with current timestamp
        const now = new Date();
        const newDataPoint: DataPoint = {
          time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          heartRate: newData.bpm,
          spo2: newData.spo2,
          temp: parseFloat(newData.temp.toFixed(1)),
          gsr: newData.gsr,
          timestamp: now.getTime()
        };

        setHistoricalData(prev => {
          const updated = [...prev, newDataPoint];
          // Keep only last 20 data points for real-time chart
          return updated.slice(-20);
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

  // Timer for current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate trends based on historical data
  const calculateTrend = (metric: keyof typeof currentData): number => {
    if (historicalData.length < 2) return 0;
    
    const recent = historicalData.slice(-5);
    const older = historicalData.slice(-10, -5);
    
    if (recent.length === 0 || older.length === 0) return 0;
    
    const recentAvg = recent.reduce((sum, point) => {
      const value = metric === 'bpm' ? point.heartRate : 
                   metric === 'temp' ? point.temp :
                   metric === 'spo2' ? point.spo2 : point.gsr;
      return sum + value;
    }, 0) / recent.length;
    
    const olderAvg = older.reduce((sum, point) => {
      const value = metric === 'bpm' ? point.heartRate : 
                   metric === 'temp' ? point.temp :
                   metric === 'spo2' ? point.spo2 : point.gsr;
      return sum + value;
    }, 0) / older.length;
    
    return olderAvg === 0 ? 0 : Math.round(((recentAvg - olderAvg) / olderAvg) * 100);
  };

  // Enhanced status assessment
  const getStatus = (metric: string, value: number): 'normal' | 'warning' | 'excellent' => {
    switch(metric) {
      case 'bpm':
        if (value >= 70 && value <= 85) return 'excellent';
        if (value >= 60 && value <= 100) return 'normal';
        return 'warning';
      case 'temp':
        if (value >= 36.1 && value <= 37.2) return 'excellent';
        if (value >= 36.0 && value <= 37.5) return 'normal';
        return 'warning';
      case 'spo2':
        if (value >= 98) return 'excellent';
        if (value >= 95) return 'normal';
        return 'warning';
      case 'gsr':
        if (value < 50) return 'excellent';
        if (value < 100) return 'normal';
        return 'warning';
      default:
        return 'normal';
    }
  };

  // Sample static data for periods when no real-time data is available
  const weeklyData = [
    { day: 'Sen', heartRate: 72, spo2: 97, temp: 36.4, gsr: 45, calories: 280, steps: 8500 },
    { day: 'Sel', heartRate: 75, spo2: 96, temp: 36.6, gsr: 52, calories: 320, steps: 9200 },
    { day: 'Rab', heartRate: 70, spo2: 98, temp: 36.3, gsr: 38, calories: 250, steps: 7800 },
    { day: 'Kam', heartRate: 78, spo2: 97, temp: 36.5, gsr: 60, calories: 380, steps: 10500 },
    { day: 'Jum', heartRate: 73, spo2: 97, temp: 36.4, gsr: 42, calories: 290, steps: 8900 },
    { day: 'Sab', heartRate: 69, spo2: 98, temp: 36.2, gsr: 35, calories: 240, steps: 6500 },
    { day: 'Min', heartRate: currentData.bpm || 67, spo2: currentData.spo2 || 98, temp: currentData.temp || 36.1, gsr: currentData.gsr || 30, calories: 200, steps: 5200 }
  ];

  const monthlyData = [
    { week: 'W1', heartRate: 72, spo2: 97, temp: 36.4, gsr: 48, calories: 1960, steps: 59000 },
    { week: 'W2', heartRate: 74, spo2: 96, temp: 36.5, gsr: 55, calories: 2100, steps: 62000 },
    { week: 'W3', heartRate: 71, spo2: 98, temp: 36.3, gsr: 42, calories: 1850, steps: 58500 },
    { week: 'W4', heartRate: currentData.bpm || 73, spo2: currentData.spo2 || 97, temp: currentData.temp || 36.4, gsr: currentData.gsr || 45, calories: 2020, steps: 61200 }
  ];

  const getData = () => {
    switch(selectedPeriod) {
      case 'daily': 
        return historicalData.length > 0 ? historicalData : [];
      case 'weekly': 
        return weeklyData;
      case 'monthly': 
        return monthlyData;
      default: 
        return historicalData;
    }
  };

  const waterIntakeData = [
    { name: 'Tercapai', value: 1800, color: '#06B6D4' },
    { name: 'Sisa', value: 700, color: '#E2E8F0' }
  ];

  const getMetricColor = (metric: string) => {
    const colors: { [key: string]: string } = {
      heartRate: '#EF4444',
      spo2: '#3B82F6',
      temp: '#F59E0B',
      gsr: '#10B981'
    };
    return colors[metric] || '#6B7280';
  };

  const MetricCard = ({ icon: Icon, title, value, unit, trend, status, color, subtitle }: MetricCardProps) => {
    const getStatusIcon = () => {
      if (status === 'excellent') return <Award size={16} className="text-emerald-500" />;
      if (status === 'normal') return <CheckCircle size={16} className="text-blue-500" />;
      return <AlertCircle size={16} className="text-amber-500" />;
    };

    const getStatusText = () => {
      if (status === 'excellent') return 'Sangat Baik';
      if (status === 'normal') return 'Normal';
      return 'Perlu Perhatian';
    };


    return (
      <div className={`bg-gradient-to-br ${color} rounded-3xl p-6 shadow-xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl relative overflow-hidden group`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white transform translate-x-6 -translate-y-6"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white transform -translate-x-4 translate-y-4"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-white/20 rounded-2xl p-3 backdrop-blur-sm">
              <Icon size={24} className="text-white" />
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1">
                {trend > 0 ? (
                  <TrendingUp size={14} className="text-emerald-200" />
                ) : trend < 0 ? (
                  <TrendingDown size={14} className="text-red-200" />
                ) : (
                  <div className="w-3 h-3 rounded-full bg-white/60"></div>
                )}
                <span className="text-white/90 text-xs font-medium">{Math.abs(trend)}%</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-white/90 font-semibold text-sm tracking-wide">{title}</h3>
            {subtitle && <p className="text-white/70 text-xs">{subtitle}</p>}
            <div className="flex items-baseline space-x-1">
              <p className="text-white text-3xl font-bold tracking-tight">{value}</p>
              <span className="text-white/80 text-lg font-medium">{unit}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <span className="text-white/90 text-xs font-medium">{getStatusText()}</span>
            </div>
            
            {/* Live indicator */}
            {isConnected && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-white/70 text-xs">Live</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const RecommendationCard = ({ icon: Icon, title, description, color, priority = 'medium' }: RecommendationCardProps) => {
    const getPriorityBadge = () => {
      const badges = {
        high: { color: 'bg-red-100 text-red-700', text: 'Urgent' },
        medium: { color: 'bg-yellow-100 text-yellow-700', text: 'Penting' },
        low: { color: 'bg-green-100 text-green-700', text: 'Info' }
      };
      return badges[priority];
    };

    const badge = getPriorityBadge();

    return (
      <div className={`bg-gradient-to-r ${color} rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:shadow-xl transition-all duration-300`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-white transform translate-x-4 -translate-y-4"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-3">
            <div className="bg-white/20 rounded-2xl p-3 backdrop-blur-sm">
              <Icon size={20} className="text-white" />
            </div>
            <div className={`${badge.color} rounded-full px-2 py-1`}>
              <span className="text-xs font-bold">{badge.text}</span>
            </div>
          </div>
          <div className="space-y-1">
            <h4 className="text-white font-bold text-base">{title}</h4>
            <p className="text-white/80 text-sm leading-relaxed">{description}</p>
          </div>
        </div>
      </div>
    );
  };

  // Generate dynamic recommendations based on current data
  const getRecommendations = () => {
    const recommendations = [];
    
    if (currentData.bpm > 100) {
      recommendations.push({
        icon: Heart,
        title: "Detak Jantung Tinggi",
        description: "Lakukan teknik pernapasan dalam selama 5 menit untuk menurunkan detak jantung",
        color: "from-red-400 to-pink-500",
        priority: 'high' as const
      });
    } else if (currentData.bpm < 60 && currentData.bpm > 0) {
      recommendations.push({
        icon: Heart,
        title: "Detak Jantung Rendah",
        description: "Pertimbangkan aktivitas fisik ringan untuk meningkatkan sirkulasi darah",
        color: "from-blue-400 to-cyan-500",
        priority: 'medium' as const
      });
    }

    if (currentData.temp > 37.5) {
      recommendations.push({
        icon: Thermometer,
        title: "Suhu Tubuh Tinggi",
        description: "Istirahat yang cukup dan konsumsi cairan hangat untuk menurunkan suhu",
        color: "from-orange-400 to-red-500",
        priority: 'high' as const
      });
    }

    if (currentData.gsr > 100) {
      recommendations.push({
        icon: Zap,
        title: "Tingkat Stress Tinggi",
        description: "GSR tinggi menunjukkan stress - lakukan meditasi atau relaksasi",
        color: "from-purple-400 to-violet-500",
        priority: 'medium' as const
      });
    }

    // Default recommendations if no specific issues
    if (recommendations.length === 0) {
      recommendations.push(
        {
          icon: Droplets,
          title: "Hidrasi Optimal",
          description: "Minum 2-3 gelas air lagi untuk mencapai target harian dan menjaga keseimbangan tubuh",
          color: "from-cyan-400 to-blue-500",
          priority: 'low' as const
        },
        {
          icon: Heart,
          title: "Aktivitas Kardio Ringan",
          description: "Lakukan jalan santai 15-20 menit untuk menjaga kesehatan jantung dan sirkulasi",
          color: "from-emerald-400 to-green-500",
          priority: 'low' as const
        }
      );
    }

    return recommendations;
  };

  return (
    <IonPage>
      <IonContent fullscreen className="[--ion-background-color:#f8fafc]">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white transform translate-x-10 -translate-y-10"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white transform -translate-x-8 translate-y-8"></div>
            <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full bg-white transform -translate-x-12 -translate-y-12"></div>
          </div>
          
          <div className="relative z-10 p-6 pb-8">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 rounded-2xl p-3 backdrop-blur-sm">
                    <Heart size={24} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight">Kesehatan Fisik</h1>
                    <p className="text-emerald-100 text-sm font-medium">Monitor biometrik real-time</p>
                  </div>
                </div>
                <p className="text-emerald-200 text-xs">
                  {currentTime.toLocaleString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Connection Status */}
                <div className={`flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-2xl px-3 py-2 ${isConnected ? 'border border-emerald-300/30' : 'border border-red-300/30'}`}>
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-300 animate-pulse' : 'bg-red-300'}`}></div>
                  <span className="text-white/90 text-xs font-medium">
                    {isConnected ? 'Live Data' : 'Disconnected'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8 pb-24">
          {/* Enhanced Period Selector */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-3 shadow-xl border border-white/40">
            <div className="flex space-x-2">
              {[
                { id: 'daily', label: 'Real-time', icon: Clock },
                { id: 'weekly', label: 'Mingguan', icon: Calendar },
                { id: 'monthly', label: 'Bulanan', icon: BarChart3 }
              ].map((period) => (
                <button
                  key={period.id}
                  onClick={() => setSelectedPeriod(period.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                    selectedPeriod === period.id
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  <period.icon size={16} />
                  <span>{period.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Current Metrics */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Status Biometrik</h2>
                <p className="text-gray-600 text-sm mt-1">Data sensor real-time dari perangkat</p>
              </div>
              {isConnected && (
                <div className="flex items-center space-x-2 bg-emerald-50 rounded-2xl px-4 py-2">
                  <Shield size={16} className="text-emerald-600" />
                  <span className="text-emerald-700 text-sm font-medium">Monitoring Aktif</span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <MetricCard
                icon={Heart}
                title="Detak Jantung"
                subtitle="Ritme kardiovaskular"
                value={currentData.bpm || 0}
                unit=" bpm"
                trend={calculateTrend('bpm')}
                status={getStatus('bpm', currentData.bpm)}
                color="from-rose-400 via-pink-500 to-red-600"
              />
              <MetricCard
                icon={Activity}
                title="Saturasi Oksigen"
                subtitle="SpO2 (Infrared)"
                value={currentData.spo2 || 0}
                unit="%"
                trend={calculateTrend('spo2')}
                status={getStatus('spo2', currentData.spo2)}
                color="from-blue-400 via-cyan-500 to-sky-600"
              />
              <MetricCard
                icon={Thermometer}
                title="Suhu Tubuh"
                subtitle="Termoregulasi"
                value={currentData.temp ? currentData.temp.toFixed(1) : "0.0"}
                unit="°C"
                trend={calculateTrend('temp')}
                status={getStatus('temp', currentData.temp)}
                color="from-orange-400 via-amber-500 to-yellow-600"
              />
              <MetricCard
                icon={Zap}
                title="Respons Galvanik"
                subtitle="GSR / Stress Level"
                value={currentData.gsr || 0}
                unit=""
                trend={calculateTrend('gsr')}
                status={getStatus('gsr', currentData.gsr)}
                color="from-emerald-400 via-teal-500 to-green-600"
              />
            </div>
          </div>

          {/* Enhanced Chart Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/40">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl p-3">
                    <BarChart3 size={24} className="text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Analisis Trend {selectedPeriod === 'daily' ? '(Live)' : ''}
                    </h3>
                    <p className="text-gray-600 text-sm">Visualisasi data historis dan pola</p>
                  </div>
                </div>
              </div>
              
              {/* Metric Selector */}
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {[
                  { id: 'heartRate', label: 'Detak Jantung', color: 'from-red-500 to-pink-500' },
                  { id: 'spo2', label: 'SpO2', color: 'from-blue-500 to-cyan-500' },
                  { id: 'temp', label: 'Suhu', color: 'from-orange-500 to-yellow-500' },
                  { id: 'gsr', label: 'GSR', color: 'from-green-500 to-emerald-500' }
                ].map((metric) => (
                  <button
                    key={metric.id}
                    onClick={() => setSelectedMetric(metric.id)}
                    className={`flex-shrink-0 py-3 px-4 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                      selectedMetric === metric.id
                        ? `bg-gradient-to-r ${metric.color} text-white shadow-lg transform scale-105`
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {metric.label}
                  </button>
                ))}
              </div>
              
              {/* Chart */}
              <div className="h-80">
                {getData().length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={getData()}>
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={getMetricColor(selectedMetric)} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={getMetricColor(selectedMetric)} stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} />
                      <XAxis 
                        dataKey={selectedPeriod === 'daily' ? 'time' : selectedPeriod === 'weekly' ? 'day' : 'week'} 
                        stroke="#6B7280"
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        stroke="#6B7280" 
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '16px',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                          backdropFilter: 'blur(10px)'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey={selectedMetric}
                        stroke={getMetricColor(selectedMetric)}
                        strokeWidth={3}
                        fill="url(#chartGradient)"
                        dot={{ r: 6, fill: getMetricColor(selectedMetric), strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 8, fill: getMetricColor(selectedMetric), strokeWidth: 3, stroke: '#fff' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-3">
                    <div className="bg-gray-100 rounded-2xl p-4">
                      <BarChart3 size={32} className="text-gray-400" />
                    </div>
                    <p className="font-medium">Menunggu data real-time...</p>
                    <p className="text-sm text-gray-400">Data akan muncul setelah sensor terhubung</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Activity & Wellness Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enhanced Calories */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/40 relative overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-orange-500 transform translate-x-6 -translate-y-6"></div>
              </div>
              
              <div className="relative z-10 space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-3">
                    <Flame size={24} className="text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Pembakaran Kalori</h3>
                    <p className="text-gray-600 text-sm">Estimasi berdasarkan aktivitas</p>
                  </div>
                </div>
                
                {selectedPeriod === 'weekly' && (
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} />
                        <XAxis dataKey="day" stroke="#6B7280" tick={{ fontSize: 12 }} axisLine={false} />
                        <YAxis stroke="#6B7280" tick={{ fontSize: 12 }} axisLine={false} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                            backdropFilter: 'blur(10px)'
                          }}
                        />
                        <Bar dataKey="calories" fill="url(#caloriesGradient)" radius={[8, 8, 0, 0]} />
                        <defs>
                          <linearGradient id="caloriesGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#F59E0B" />
                            <stop offset="100%" stopColor="#EF4444" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
                
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-5 border border-orange-100">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-orange-800 font-semibold">Estimasi Hari Ini</p>
                      <div className="flex items-baseline space-x-1">
                        <p className="text-3xl font-bold text-orange-600">
                          {Math.round(currentData.bpm * 4.2) || 285}
                        </p>
                        <span className="text-orange-500 text-sm font-medium">kalori</span>
                      </div>
                      <p className="text-orange-600 text-xs">Target: 400 kalori</p>
                    </div>
                    <div className="bg-orange-100 rounded-2xl p-3">
                      <Target size={28} className="text-orange-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Water Intake */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/40 relative overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full bg-blue-500 transform -translate-x-7 translate-y-7"></div>
              </div>
              
              <div className="relative z-10 space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-cyan-100 to-blue-100 rounded-2xl p-3">
                    <Droplets size={24} className="text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Hidrasi</h3>
                    <p className="text-gray-600 text-sm">Asupan cairan harian</p>
                  </div>
                </div>
                
                <div className="h-48 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={waterIntakeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {waterIntakeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-5 border border-cyan-100">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-cyan-800 font-semibold">Progress Hari Ini</p>
                      <div className="flex items-baseline space-x-1">
                        <p className="text-3xl font-bold text-cyan-600">1.8</p>
                        <span className="text-cyan-500 text-lg font-medium">/ 2.5 L</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-cyan-200 rounded-full h-2">
                          <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full" style={{width: '72%'}}></div>
                        </div>
                        <span className="text-cyan-600 text-xs font-medium">72%</span>
                      </div>
                    </div>
                    <div className="bg-cyan-100 rounded-2xl p-3">
                      <Droplets size={28} className="text-cyan-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Recommendations */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/40 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-indigo-500 transform translate-x-8 -translate-y-8"></div>
            </div>
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-3">
                  <Target size={24} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Rekomendasi Kesehatan</h3>
                  <p className="text-gray-600 text-sm">Berdasarkan data biometrik real-time</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getRecommendations().map((rec, index) => (
                  <RecommendationCard
                    key={index}
                    icon={rec.icon}
                    title={rec.title}
                    description={rec.description}
                    color={rec.color}
                    priority={rec.priority}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Health Insights */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/40 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full bg-emerald-500 transform -translate-x-7 translate-y-7"></div>
            </div>
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl p-3">
                  <Activity size={24} className="text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Insight Kesehatan</h3>
                  <p className="text-gray-600 text-sm">Analisis kondisi fisik berdasarkan sensor</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {isConnected ? (
                  <>
                    <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
                      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Heart size={16} className="text-white" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-emerald-800 font-semibold text-sm">Analisis Kardiovaskular</p>
                        <p className="text-emerald-700 text-sm leading-relaxed">
                          Detak jantung {currentData.bpm} bpm - {getStatus('bpm', currentData.bpm) === 'excellent' ? 'optimal untuk usia dan aktivitas Anda' : getStatus('bpm', currentData.bpm) === 'normal' ? 'dalam rentang sehat normal' : 'memerlukan perhatian medis'}.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Thermometer size={16} className="text-white" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-blue-800 font-semibold text-sm">Termoregulasi</p>
                        <p className="text-blue-700 text-sm leading-relaxed">
                          Suhu tubuh {currentData.temp.toFixed(1)}°C - {getStatus('temp', currentData.temp) === 'excellent' ? 'optimal dan menunjukkan metabolisme sehat' : getStatus('temp', currentData.temp) === 'normal' ? 'normal dan stabil' : 'di luar rentang normal, perlu observasi'}.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl border border-purple-100">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Zap size={16} className="text-white" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-purple-800 font-semibold text-sm">Aktivitas Saraf Simpatik</p>
                        <p className="text-purple-700 text-sm leading-relaxed">
                          GSR level {currentData.gsr} - menunjukkan {getStatus('gsr', currentData.gsr) === 'excellent' ? 'kondisi rileks optimal' : getStatus('gsr', currentData.gsr) === 'normal' ? 'tingkat stress normal' : 'respons stress yang meningkat'}. Data historis: {historicalData.length} titik monitoring.
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl border border-gray-100">
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <AlertCircle size={16} className="text-white" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-800 font-semibold text-sm">Status Koneksi</p>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        Menunggu koneksi dengan perangkat biofeedback untuk memulai monitoring real-time dan analisis kesehatan yang akurat.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;