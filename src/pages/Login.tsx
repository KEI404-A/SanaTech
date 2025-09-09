// src/pages/Login.tsx (Fixed Desktop Layout)

import React, { useState } from 'react';
import {
  IonContent, IonPage, IonIcon, IonText, IonSpinner, IonRouterLink
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { logoGoogle } from 'ionicons/icons';
import { signInWithGoogle, registerWithEmail, signInWithEmail } from '../services/authService';
import { FirebaseError } from 'firebase/app';
import { Eye, EyeOff, Mail, Lock, User, Shield, Heart, Activity } from 'lucide-react';

const Login: React.FC = () => {
  const history = useHistory();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const result = await signInWithGoogle();
    if (result.success) {
      history.replace('/tabs/tab1');
    } else {
      setError('Gagal masuk dengan Google. Coba lagi.');
    }
    setLoading(false);
  };

  const handleEmailAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    let result;
    if (isRegisterMode) {
      if (!displayName) {
        setError('Nama harus diisi.');
        setLoading(false);
        return;
      }
      result = await registerWithEmail(displayName, email, password);
    } else {
      result = await signInWithEmail(email, password);
    }

    if (result.success) {
      history.replace('/tabs/tab1');
    } else {
      const err = result.error;
      if (err instanceof FirebaseError) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
          setError('Email atau password salah.');
        } else if (err.code === 'auth/email-already-in-use') {
          setError('Email ini sudah terdaftar. Silakan masuk.');
        } else if (err.code === 'auth/weak-password') {
          setError('Password harus terdiri dari minimal 6 karakter.');
        } else {
          setError('Terjadi kesalahan. Coba lagi.');
        }
      } else {
        setError('Terjadi kesalahan yang tidak diketahui.');
      }
    }
    setLoading(false);
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setError('');
  };

  return (
    <IonPage>
      <IonContent fullscreen className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="min-h-full">
          {/* Desktop Layout */}
          <div className="hidden lg:flex min-h-screen">
            {/* Left Panel - Branding */}
            <div className="w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32"></div>
              
              <div className="relative z-10 px-12 text-white text-center">
                <div className="mb-8">
                  <div className="flex items-center justify-center space-x-3 mb-6">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <Heart className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl font-bold">SanaTech</h1>
                  </div>
                  <h2 className="text-5xl font-bold mb-6 leading-tight">
                    Monitor Kesehatan<br />
                    Mental & Fisik Anda
                  </h2>
                  <p className="text-xl text-blue-100 leading-relaxed mb-8">
                    Platform terdepan untuk monitoring biofeedback real-time dan analisis kesehatan holistik
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6" />
                    </div>
                    <span className="text-blue-100 text-lg">Data Anda aman dan terenkripsi</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Activity className="w-6 h-6" />
                    </div>
                    <span className="text-blue-100 text-lg">Monitoring kesehatan 24/7</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <User className="w-6 h-6" />
                    </div>
                    <span className="text-blue-100 text-lg">Dipercaya 10,000+ pengguna</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-1/2 flex items-center justify-center p-8 bg-white">
              <div className="w-full max-w-md">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {isRegisterMode ? 'Buat Akun Baru' : 'Selamat Datang Kembali'}
                  </h2>
                  <p className="text-gray-600 text-lg">
                    {isRegisterMode 
                      ? 'Bergabunglah dengan komunitas kesehatan digital'
                      : 'Masuk ke akun SanaTech Anda'
                    }
                  </p>
                </div>

                <form onSubmit={handleEmailAuth} className="space-y-6">
                  {isRegisterMode && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={displayName}
                          onChange={e => setDisplayName(e.target.value)}
                          placeholder="Masukkan nama lengkap"
                          className="pl-12 w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="nama@example.com"
                        className="pl-12 w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Masukkan password"
                        className="pl-12 pr-12 w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      >
                        {showPassword ? 
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : 
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        }
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <IonText color="danger">
                        <p className="text-sm text-red-700">{error}</p>
                      </IonText>
                    </div>
                  )}

                  <button
                    type="submit" 
                    className="w-full h-14 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 focus:ring-4 focus:ring-indigo-200 transition-all duration-200 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? (
                      <IonSpinner name="crescent" className="w-5 h-5" />
                    ) : (
                      isRegisterMode ? 'Buat Akun' : 'Masuk'
                    )}
                  </button>
                </form>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">atau lanjutkan dengan</span>
                  </div>
                </div>

                <button 
                  onClick={handleGoogleSignIn} 
                  className="w-full h-14 border-2 border-gray-200 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 focus:ring-4 focus:ring-gray-100 transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50"
                  disabled={loading}
                >
                  <IonIcon icon={logoGoogle} className="w-5 h-5" />
                  <span>Lanjutkan dengan Google</span>
                </button>

                <div className="text-center mt-8">
                  <button 
                    onClick={toggleMode} 
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
                  >
                    {isRegisterMode 
                      ? 'Sudah punya akun? Masuk di sini' 
                      : 'Belum punya akun? Daftar sekarang'
                    }
                  </button>
                </div>

                {/* Terms & Privacy */}
                <p className="text-xs text-gray-500 text-center mt-6 leading-relaxed">
                  Dengan melanjutkan, Anda menyetujui{' '}
                  <IonRouterLink routerLink="/terms-and-conditions" className="text-indigo-600 hover:text-indigo-700 font-medium">
                    Syarat & Ketentuan
                  </IonRouterLink>
                  {' dan '}
                  <IonRouterLink routerLink="/privacy-policy" className="text-indigo-600 hover:text-indigo-700 font-medium">
                    Kebijakan Privasi
                  </IonRouterLink>
                  {' kami.'}
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden">
            {/* Mobile Header Section */}
            <div className="bg-white relative overflow-hidden">
              {/* Subtle background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full -mr-16 -mt-16 opacity-60"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -ml-12 -mb-12 opacity-60"></div>
              
              <div className="relative px-6 py-12 text-center">
                {/* Logo */}
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Heart className="w-7 h-7 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-800">SanaTech</h1>
                </div>
                
                {/* Tagline */}
                <p className="text-gray-600 text-lg mb-6">Monitor Kesehatan Mental & Fisik</p>
                
                {/* Features Icons */}
                <div className="flex justify-center space-x-8 mb-8">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-2">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-xs text-gray-600">Aman</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-2">
                      <Activity className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="text-xs text-gray-600">Real-time</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-2">
                      <Heart className="w-6 h-6 text-purple-600" />
                    </div>
                    <span className="text-xs text-gray-600">Terpercaya</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="px-6 py-8">
              <div className="max-w-md mx-auto">
                {/* Form Container */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      {isRegisterMode ? 'Buat Akun Baru' : 'Selamat Datang Kembali'}
                    </h2>
                    <p className="text-gray-600">
                      {isRegisterMode 
                        ? 'Bergabunglah dengan komunitas kesehatan digital'
                        : 'Masuk ke akun SanaTech Anda'
                      }
                    </p>
                  </div>

                  <form onSubmit={handleEmailAuth} className="space-y-6">
                    {isRegisterMode && (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            value={displayName}
                            onChange={e => setDisplayName(e.target.value)}
                            placeholder="Masukkan nama lengkap"
                            className="pl-12 w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                            required
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="nama@example.com"
                          className="pl-12 w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          placeholder="Masukkan password"
                          className="pl-12 pr-12 w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        >
                          {showPassword ? 
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : 
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          }
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <IonText color="danger">
                          <p className="text-sm text-red-700">{error}</p>
                        </IonText>
                      </div>
                    )}

                    <button
                      type="submit" 
                      className="w-full h-14 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 focus:ring-4 focus:ring-indigo-200 transition-all duration-200 disabled:opacity-50"
                      disabled={loading}
                    >
                      {loading ? (
                        <IonSpinner name="crescent" className="w-5 h-5" />
                      ) : (
                        isRegisterMode ? 'Buat Akun' : 'Masuk'
                      )}
                    </button>
                  </form>

                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">atau lanjutkan dengan</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleGoogleSignIn} 
                    className="w-full h-14 border-2 border-gray-200 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 focus:ring-4 focus:ring-gray-100 transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50"
                    disabled={loading}
                  >
                    <IonIcon icon={logoGoogle} className="w-5 h-5" />
                    <span>Lanjutkan dengan Google</span>
                  </button>

                  <div className="text-center mt-8">
                    <button 
                      onClick={toggleMode} 
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
                    >
                      {isRegisterMode 
                        ? 'Sudah punya akun? Masuk di sini' 
                        : 'Belum punya akun? Daftar sekarang'
                      }
                    </button>
                  </div>
                </div>

                {/* Terms & Privacy */}
                <p className="text-xs text-gray-500 text-center mt-6 px-4 leading-relaxed">
                  Dengan melanjutkan, Anda menyetujui{' '}
                  <IonRouterLink routerLink="/terms-and-conditions" className="text-indigo-600 hover:text-indigo-700 font-medium">
                    Syarat & Ketentuan
                  </IonRouterLink>
                  {' dan '}
                  <IonRouterLink routerLink="/privacy-policy" className="text-indigo-600 hover:text-indigo-700 font-medium">
                    Kebijakan Privasi
                  </IonRouterLink>
                  {' kami.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;