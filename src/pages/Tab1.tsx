// src/pages/Tab1.tsx

import React, { useState, useEffect } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { Activity, Heart, Thermometer, Zap, Brain, Users, BookOpen, Wifi, WifiOff } from 'lucide-react';
  import { LucideIcon } from "lucide-react";
  import NewsButton from '../components/NewsButton';

const Tab1: React.FC = () => {
  const [isConnected] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [pulseAnimation, setPulseAnimation] = useState(false);

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

  const biofeedbackData = {
    heartRate: 72,
    spo2: 98,
    temperature: 36.5,
    gsr: 0.8,
    stress: 'Rendah',
    mood: 'Baik'
  };

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
    className={`bg-gradient-to-br ${color} rounded-2xl p-4 shadow-lg transform transition-all duration-300 hover:scale-105 ${animate ? 'animate-pulse' : ''}`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-white/80 text-sm font-medium">{label}</p>
        <p className="text-white text-2xl font-bold">
          {value}
          {unit && <span className="text-lg">{unit}</span>}
        </p>
      </div>
      <Icon size={32} className="text-white/90" />
    </div>
  </div>
);

// ==========================

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
            {/* WiFi dan sinyal */}
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <Wifi className="text-green-300" size={24} />
              ) : (
                <WifiOff className="text-red-300" size={24} />
              )}
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} ${pulseAnimation ? 'animate-ping' : ''}`}></div>
            </div>
            
            {/* NewsButton */}
            <NewsButton />
          </div>
        </div>
      </div>

        <div className="p-6 space-y-6 pb-24">
          {/* Connection Status */}
          <div className={`rounded-2xl p-4 ${isConnected ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-200' : 'bg-gradient-to-r from-red-100 to-pink-100 border-red-200'} border-2`}>
            <p className={`font-semibold ${isConnected ? 'text-green-800' : 'text-red-800'}`}>
              {isConnected ? '✓ Perangkat Biofeedback Terhubung' : '⚠ Perangkat Tidak Terhubung'}
            </p>
            <p className={`text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? 'Semua sensor berfungsi normal' : 'Periksa koneksi WiFi perangkat'}
            </p>
          </div>

          {/* Quick Metrics */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Status Real-time</h2>
            <div className="grid grid-cols-2 gap-4">
              <QuickMetric
                icon={Heart}
                label="Detak Jantung"
                value={biofeedbackData.heartRate}
                unit=" bpm"
                color="from-red-400 to-pink-500"
                animate={pulseAnimation}
              />
              <QuickMetric
                icon={Activity}
                label="SpO2"
                value={biofeedbackData.spo2}
                unit="%"
                color="from-blue-400 to-cyan-500"
              />
              <QuickMetric
                icon={Thermometer}
                label="Suhu Tubuh"
                value={biofeedbackData.temperature}
                unit="°C"
                color="from-orange-400 to-red-500"
              />
              <QuickMetric
                icon={Zap}
                label="GSR Level"
                value={biofeedbackData.gsr}
                unit=""
                color="from-yellow-400 to-orange-500"
              />
            </div>
          </div>

          {/* Mental State Summary */}
          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-3xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-indigo-800 mb-3">Kondisi Mental Saat Ini</h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-indigo-600 font-semibold">Tingkat Stress: <span className="text-green-600">{biofeedbackData.stress}</span></p>
                <p className="text-indigo-600 font-semibold">Mood: <span className="text-blue-600">{biofeedbackData.mood}</span></p>
              </div>
              <Brain size={40} className="text-indigo-500" />
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

          {/* Today's Insights */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Insight Hari Ini</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <p className="text-gray-700 text-sm">Pola tidur Anda 15% lebih baik dari minggu lalu</p>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <p className="text-gray-700 text-sm">Tingkat stress menurun setelah sesi meditasi pagi</p>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <p className="text-gray-700 text-sm">Rekomendasi: Lakukan breathing exercise di sore hari</p>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;