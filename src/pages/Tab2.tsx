import React, { useState, useEffect } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Heart, Thermometer, Activity, Droplets, Flame, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';
import { ref, onValue } from "firebase/database";
import { db } from "../firebase-config";

interface MetricCardProps {
  icon: React.ElementType;
  title: string;
  value: string | number;
  unit: string;
  trend: number;
  status: 'normal' | 'warning';
  color: string;
}

interface RecommendationCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
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

  // Firebase data fetching for current values
  useEffect(() => {
    const dataRef = ref(db, "readings/latest");
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

  // Get status based on values
  const getStatus = (metric: string, value: number): 'normal' | 'warning' => {
    switch(metric) {
      case 'bpm':
        return (value >= 60 && value <= 100) ? 'normal' : 'warning';
      case 'temp':
        return (value >= 36.0 && value <= 37.5) ? 'normal' : 'warning';
      case 'spo2':
        return value >= 95 ? 'normal' : 'warning';
      case 'gsr':
        return value < 100 ? 'normal' : 'warning'; // Adjust based on your sensor range
      default:
        return 'normal';
    }
  };

  // Sample static data for periods when no real-time data is available
  const weeklyData = [
    { day: 'Sen', heartRate: 72, spo2: 97, temp: 36.4, gsr: 0.8, calories: 280 },
    { day: 'Sel', heartRate: 75, spo2: 96, temp: 36.6, gsr: 0.9, calories: 320 },
    { day: 'Rab', heartRate: 70, spo2: 98, temp: 36.3, gsr: 0.7, calories: 250 },
    { day: 'Kam', heartRate: 78, spo2: 97, temp: 36.5, gsr: 1.0, calories: 380 },
    { day: 'Jum', heartRate: 73, spo2: 97, temp: 36.4, gsr: 0.8, calories: 290 },
    { day: 'Sab', heartRate: 69, spo2: 98, temp: 36.2, gsr: 0.6, calories: 240 },
    { day: 'Min', heartRate: currentData.bpm || 67, spo2: currentData.spo2 || 98, temp: currentData.temp || 36.1, gsr: currentData.gsr || 0.5, calories: 200 }
  ];

  const monthlyData = [
    { week: 'W1', heartRate: 72, spo2: 97, temp: 36.4, gsr: 0.8, calories: 1960 },
    { week: 'W2', heartRate: 74, spo2: 96, temp: 36.5, gsr: 0.9, calories: 2100 },
    { week: 'W3', heartRate: 71, spo2: 98, temp: 36.3, gsr: 0.7, calories: 1850 },
    { week: 'W4', heartRate: currentData.bpm || 73, spo2: currentData.spo2 || 97, temp: currentData.temp || 36.4, gsr: currentData.gsr || 0.8, calories: 2020 }
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
    { name: 'Tercapai', value: 1800, color: '#3B82F6' },
    { name: 'Sisa', value: 700, color: '#E5E7EB' }
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

  const getMetricName = (metric: string) => {
    const names: { [key: string]: string } = {
      heartRate: 'Detak Jantung',
      spo2: 'Saturasi Oksigen',
      temp: 'Suhu Tubuh',
      gsr: 'GSR Level'
    };
    return names[metric] || 'Metric';
  };

  const MetricCard = ({ icon: Icon, title, value, unit, trend, status, color }: MetricCardProps) => (
    <div className={`bg-gradient-to-br ${color} rounded-2xl p-5 shadow-lg transform transition-all duration-300 hover:scale-105`}>
      <div className="flex justify-between items-start mb-3">
        <div className="bg-white/20 rounded-full p-2">
          <Icon size={24} className="text-white" />
        </div>
        <div className="flex items-center space-x-1">
          {trend > 0 ? (
            <TrendingUp size={16} className="text-green-200" />
          ) : trend < 0 ? (
            <TrendingDown size={16} className="text-red-200" />
          ) : (
            <div className="w-4 h-4" />
          )}
          <span className="text-white/80 text-sm">{Math.abs(trend)}%</span>
        </div>
      </div>
      <h3 className="text-white font-semibold text-sm mb-1">{title}</h3>
      <p className="text-white text-2xl font-bold">{value}<span className="text-lg">{unit}</span></p>
      <div className="flex items-center mt-2">
        {status === 'normal' ? (
          <CheckCircle size={14} className="text-green-200 mr-1" />
        ) : (
          <AlertCircle size={14} className="text-yellow-200 mr-1" />
        )}
        <span className="text-white/80 text-xs">
          {status === 'normal' ? 'Normal' : 'Perlu Perhatian'}
        </span>
      </div>
    </div>
  );

  const RecommendationCard = ({ icon: Icon, title, description, color }: RecommendationCardProps) => (
    <div className={`bg-gradient-to-r ${color} rounded-xl p-4 shadow-md`}>
      <div className="flex items-center space-x-3">
        <div className="bg-white/20 rounded-full p-2">
          <Icon size={20} className="text-white" />
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm">{title}</h4>
          <p className="text-white/80 text-xs">{description}</p>
        </div>
      </div>
    </div>
  );

  // Generate dynamic recommendations based on current data
  const getRecommendations = () => {
    const recommendations = [];
    
    if (currentData.bpm > 100) {
      recommendations.push({
        icon: Heart,
        title: "Detak Jantung Tinggi",
        description: "Lakukan teknik pernapasan dalam untuk menurunkan detak jantung",
        color: "from-red-400 to-pink-500"
      });
    } else if (currentData.bpm < 60 && currentData.bpm > 0) {
      recommendations.push({
        icon: Heart,
        title: "Detak Jantung Rendah",
        description: "Pertimbangkan aktivitas fisik ringan untuk meningkatkan sirkulasi",
        color: "from-blue-400 to-cyan-500"
      });
    }

    if (currentData.temp > 37.5) {
      recommendations.push({
        icon: Thermometer,
        title: "Suhu Tubuh Tinggi",
        description: "Istirahat yang cukup dan konsumsi cairan untuk menurunkan suhu",
        color: "from-orange-400 to-red-500"
      });
    }

    // Default recommendations if no specific issues
    if (recommendations.length === 0) {
      recommendations.push(
        {
          icon: Droplets,
          title: "Tingkatkan Asupan Air",
          description: "Minum 2-3 gelas air lagi untuk mencapai target harian",
          color: "from-blue-400 to-cyan-500"
        },
        {
          icon: Heart,
          title: "Aktivitas Fisik Ringan",
          description: "Lakukan jalan santai 15 menit untuk menjaga kesehatan jantung",
          color: "from-green-400 to-emerald-500"
        }
      );
    }

    return recommendations;
  };

  return (
    <IonPage>
      <IonContent fullscreen className="[--ion-background-color:#f1f5f9]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white p-6 rounded-b-3xl shadow-xl">
          <h1 className="text-2xl font-bold mb-2">Kesehatan Fisik</h1>
          <p className="text-emerald-100 text-sm">Monitor data biometrik dan aktivitas harian Anda</p>
          {!isConnected && (
            <p className="text-red-200 text-xs mt-1">⚠ Data real-time tidak tersedia</p>
          )}
        </div>

        <div className="p-6 space-y-6 pb-24">
          {/* Period Selector */}
          <div className="flex space-x-2 bg-white rounded-2xl p-2 shadow-md">
            {['daily', 'weekly', 'monthly'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                  selectedPeriod === period
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {period === 'daily' ? 'Real-time' : period === 'weekly' ? 'Mingguan' : 'Bulanan'}
              </button>
            ))}
          </div>

          {/* Current Metrics - Real Firebase Data */}
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              icon={Heart}
              title="Detak Jantung"
              value={currentData.bpm || 0}
              unit=" bpm"
              trend={calculateTrend('bpm')}
              status={getStatus('bpm', currentData.bpm)}
              color="from-red-400 to-pink-500"
            />
            <MetricCard
              icon={Activity}
              title="SpO2 (IR)"
              value={currentData.spo2 || 0}
              unit=""
              trend={calculateTrend('spo2')}
              status={getStatus('spo2', currentData.spo2)}
              color="from-blue-400 to-cyan-500"
            />
            <MetricCard
              icon={Thermometer}
              title="Suhu Tubuh"
              value={currentData.temp ? currentData.temp.toFixed(1) : "0.0"}
              unit="°C"
              trend={calculateTrend('temp')}
              status={getStatus('temp', currentData.temp)}
              color="from-orange-400 to-red-500"
            />
            <MetricCard
              icon={Droplets}
              title="GSR Level"
              value={currentData.gsr || 0}
              unit=""
              trend={calculateTrend('gsr')}
              status={getStatus('gsr', currentData.gsr)}
              color="from-green-400 to-emerald-500"
            />
          </div>

          {/* Metric Selector for Chart */}
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              Grafik Trend {selectedPeriod === 'daily' ? '(Real-time)' : ''}
            </h3>
            <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
              {['heartRate', 'spo2', 'temp', 'gsr'].map((metric) => (
                <button
                  key={metric}
                  onClick={() => setSelectedMetric(metric)}
                  className={`flex-shrink-0 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    selectedMetric === metric
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {getMetricName(metric)}
                </button>
              ))}
            </div>
            
            <div className="h-64">
              {getData().length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey={selectedPeriod === 'daily' ? 'time' : selectedPeriod === 'weekly' ? 'day' : 'week'} 
                      stroke="#6B7280"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis stroke="#6B7280" tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey={selectedMetric} 
                      stroke={getMetricColor(selectedMetric)}
                      strokeWidth={3}
                      dot={{ r: 6, fill: getMetricColor(selectedMetric) }}
                      activeDot={{ r: 8, fill: getMetricColor(selectedMetric) }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>Menunggu data real-time...</p>
                </div>
              )}
            </div>
          </div>

          {/* Calories & Water Intake */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Calories Burned */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Pembakaran Kalori</h3>
              {selectedPeriod === 'weekly' && (
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="day" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Bar dataKey="calories" fill="url(#caloriesGradient)" radius={[4, 4, 0, 0]} />
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
              <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-800 font-semibold">Estimasi Hari Ini</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {Math.round(currentData.bpm * 4.5) || 320} <span className="text-sm">kal</span>
                    </p>
                  </div>
                  <Flame size={32} className="text-orange-500" />
                </div>
              </div>
            </div>

            {/* Water Intake */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Asupan Air</h3>
              <div className="h-48 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={waterIntakeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {waterIntakeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-800 font-semibold">Target Hari Ini</p>
                    <p className="text-2xl font-bold text-blue-600">1.8 / 2.5 <span className="text-sm">L</span></p>
                  </div>
                  <Droplets size={32} className="text-blue-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Recommendations based on real data */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Rekomendasi</h3>
            <div className="space-y-3">
              {getRecommendations().map((rec, index) => (
                <RecommendationCard
                  key={index}
                  icon={rec.icon}
                  title={rec.title}
                  description={rec.description}
                  color={rec.color}
                />
              ))}
            </div>
          </div>

          {/* Health Insights - Dynamic based on real data */}
          <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-emerald-800 mb-4">Insight Kesehatan</h3>
            <div className="space-y-3">
              {isConnected ? (
                <>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                    <p className="text-emerald-700 text-sm">
                      <strong>Status real-time:</strong> Detak jantung {currentData.bpm} bpm - {getStatus('bpm', currentData.bpm) === 'normal' ? 'dalam rentang sehat' : 'memerlukan perhatian'}.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
                    <p className="text-teal-700 text-sm">
                      <strong>Suhu tubuh:</strong> {currentData.temp.toFixed(1)}°C - {getStatus('temp', currentData.temp) === 'normal' ? 'normal dan stabil' : 'di luar rentang normal'}.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2"></div>
                    <p className="text-cyan-700 text-sm">
                      <strong>Monitoring aktif:</strong> Data historis menunjukkan {historicalData.length} titik data dalam sesi ini.
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gray-500 rounded-full mt-2"></div>
                  <p className="text-gray-700 text-sm">
                    <strong>Status:</strong> Menunggu koneksi dengan perangkat biofeedback untuk analisis real-time.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;