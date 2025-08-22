import React, { useState } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Heart, Thermometer, Activity, Droplets, Flame, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';

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
// --- AKHIR DEFINISI TIPE ---

const Tab2: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('daily');
  const [selectedMetric, setSelectedMetric] = useState('heartRate');

  // Sample data for different time periods
  const dailyData = [
    { time: '06:00', heartRate: 65, spo2: 97, temp: 36.2, gsr: 0.6 },
    { time: '09:00', heartRate: 78, spo2: 98, temp: 36.5, gsr: 0.8 },
    { time: '12:00', heartRate: 82, spo2: 96, temp: 36.8, gsr: 1.2 },
    { time: '15:00', heartRate: 75, spo2: 97, temp: 36.6, gsr: 0.9 },
    { time: '18:00', heartRate: 72, spo2: 98, temp: 36.4, gsr: 0.7 },
    { time: '21:00', heartRate: 68, spo2: 97, temp: 36.3, gsr: 0.5 }
  ];

  const weeklyData = [
    { day: 'Sen', heartRate: 72, spo2: 97, temp: 36.4, gsr: 0.8, calories: 280 },
    { day: 'Sel', heartRate: 75, spo2: 96, temp: 36.6, gsr: 0.9, calories: 320 },
    { day: 'Rab', heartRate: 70, spo2: 98, temp: 36.3, gsr: 0.7, calories: 250 },
    { day: 'Kam', heartRate: 78, spo2: 97, temp: 36.5, gsr: 1.0, calories: 380 },
    { day: 'Jum', heartRate: 73, spo2: 97, temp: 36.4, gsr: 0.8, calories: 290 },
    { day: 'Sab', heartRate: 69, spo2: 98, temp: 36.2, gsr: 0.6, calories: 240 },
    { day: 'Min', heartRate: 67, spo2: 98, temp: 36.1, gsr: 0.5, calories: 200 }
  ];

  const monthlyData = [
    { week: 'W1', heartRate: 72, spo2: 97, temp: 36.4, gsr: 0.8, calories: 1960 },
    { week: 'W2', heartRate: 74, spo2: 96, temp: 36.5, gsr: 0.9, calories: 2100 },
    { week: 'W3', heartRate: 71, spo2: 98, temp: 36.3, gsr: 0.7, calories: 1850 },
    { week: 'W4', heartRate: 73, spo2: 97, temp: 36.4, gsr: 0.8, calories: 2020 }
  ];

  const getData = () => {
    switch(selectedPeriod) {
      case 'daily': return dailyData;
      case 'weekly': return weeklyData;
      case 'monthly': return monthlyData;
      default: return dailyData;
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
          ) : (
            <TrendingDown size={16} className="text-red-200" />
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

  return (
    <IonPage>
      <IonContent fullscreen className="[--ion-background-color:#f1f5f9]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white p-6 rounded-b-3xl shadow-xl">
          <h1 className="text-2xl font-bold mb-2">Kesehatan Fisik</h1>
          <p className="text-emerald-100 text-sm">Monitor data biometrik dan aktivitas harian Anda</p>
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
                {period === 'daily' ? 'Harian' : period === 'weekly' ? 'Mingguan' : 'Bulanan'}
              </button>
            ))}
          </div>

          {/* Current Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              icon={Heart}
              title="Detak Jantung"
              value="72"
              unit=" bpm"
              trend={-2}
              status="normal"
              color="from-red-400 to-pink-500"
            />
            <MetricCard
              icon={Activity}
              title="SpO2"
              value="98"
              unit="%"
              trend={1}
              status="normal"
              color="from-blue-400 to-cyan-500"
            />
            <MetricCard
              icon={Thermometer}
              title="Suhu Tubuh"
              value="36.5"
              unit="°C"
              trend={0}
              status="normal"
              color="from-orange-400 to-red-500"
            />
            <MetricCard
              icon={Droplets}
              title="GSR Level"
              value="0.8"
              unit=""
              trend={-5}
              status="normal"
              color="from-green-400 to-emerald-500"
            />
          </div>

          {/* Metric Selector for Chart */}
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Grafik Trend</h3>
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
                    <p className="text-orange-800 font-semibold">Hari Ini</p>
                    <p className="text-2xl font-bold text-orange-600">320 <span className="text-sm">kal</span></p>
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

          {/* Recommendations */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Rekomendasi</h3>
            <div className="space-y-3">
              <RecommendationCard
                icon={Droplets}
                title="Tingkatkan Asupan Air"
                description="Minum 2-3 gelas air lagi untuk mencapai target harian"
                color="from-blue-400 to-cyan-500"
              />
              <RecommendationCard
                icon={Heart}
                title="Aktivitas Fisik Ringan"
                description="Lakukan jalan santai 15 menit untuk menjaga kesehatan jantung"
                color="from-green-400 to-emerald-500"
              />
              <RecommendationCard
                icon={Thermometer}
                title="Jaga Suhu Tubuh"
                description="Suhu tubuh normal, pertahankan pola istirahat yang baik"
                color="from-purple-400 to-violet-500"
              />
            </div>
          </div>

          {/* Health Insights */}
          <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-emerald-800 mb-4">Insight Kesehatan</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                <p className="text-emerald-700 text-sm">
                  <strong>Variabilitas detak jantung</strong> Anda menunjukkan pola yang sehat dengan tingkat stress yang rendah.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
                <p className="text-teal-700 text-sm">
                  <strong>Saturasi oksigen</strong> stabil di rentang optimal. Pola pernapasan Anda efisien dan sehat.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2"></div>
                <p className="text-cyan-700 text-sm">
                  <strong>Aktivitas harian</strong> menunjukkan peningkatan 12% dibanding minggu lalu. Pertahankan konsistensi ini.
                </p>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;