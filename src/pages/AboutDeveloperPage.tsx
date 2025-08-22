// src/pages/AboutDeveloperPage.tsx
import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton } from '@ionic/react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  MapPin, 
  Calendar,
  Award,
  Code,
  Globe,
  GraduationCap,
  Briefcase,
  Heart,
  Star
} from 'lucide-react';

const AboutDeveloperPage: React.FC = () => {
  const techStack = [
    { name: 'Ionic React', icon: '⚛️', category: 'Framework' },
    { name: 'TypeScript', icon: '📘', category: 'Language' },
    { name: 'Tailwind CSS', icon: '🎨', category: 'Styling' },
    { name: 'Firebase', icon: '🔥', category: 'Backend' },
    { name: 'Recharts', icon: '📊', category: 'Data Viz' },
    { name: 'GSAP', icon: '✨', category: 'Animation' },
    { name: 'Node.js', icon: '🟢', category: 'Runtime' },
    { name: 'Git', icon: '🔀', category: 'Version Control' }
  ];

  const achievements = [
    { title: 'Best Final Project Award', year: '2024', description: 'Outstanding innovation in health technology' },
    { title: 'Dean\'s List', year: '2022-2024', description: 'Consistent academic excellence' },
    { title: 'Hackathon Winner', year: '2023', description: 'First place in national health-tech competition' }
  ];

  const projects = [
    { 
      name: 'SanaTech', 
      description: 'Biofeedback-based mental health monitoring platform',
      tech: 'Ionic React, Firebase, IoT',
      status: 'Active'
    },
    { 
      name: 'MediTrack', 
      description: 'Patient management system for small clinics',
      tech: 'React Native, MongoDB',
      status: 'Completed'
    },
    { 
      name: 'HealthBot', 
      description: 'AI-powered health consultation chatbot',
      tech: 'Python, TensorFlow, FastAPI',
      status: 'In Development'
    }
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="bg-gradient-to-r from-purple-500 to-indigo-600">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/tab6" color="grey" />
          </IonButtons>
          <IonTitle color="grey">Tentang Pengembang</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen className="bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100">
        <div className="min-h-full">
          {/* Hero Section */}
          <div className="relative bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 text-white overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
            
            <div className="relative px-6 py-12 text-center">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-white/20 to-white/10 rounded-full flex items-center justify-center text-6xl backdrop-blur-sm border border-white/20">
                🧑‍💻
              </div>
              
              <h1 className="text-3xl font-bold mb-2">Ahmad Rizki Pratama</h1>
              <p className="text-xl text-purple-100 mb-4">Full-Stack Developer & Health Tech Innovator</p>
              
              <div className="flex justify-center items-center space-x-6 text-sm text-purple-200">
                <div className="flex items-center space-x-2">
                  <MapPin size={16} />
                  <span>Jakarta, Indonesia</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar size={16} />
                  <span>Available for work</span>
                </div>
              </div>
              
              {/* Social Links */}
              <div className="flex justify-center space-x-4 mt-8">
                <a href="https://linkedin.com/in/ahmadrizkipratama" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20">
                  <Linkedin size={20} />
                </a>
                <a href="https://github.com/ahmadrizkipratama" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20">
                  <Github size={20} />
                </a>
                <a href="mailto:ahmad.rizki@example.com" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20">
                  <Mail size={20} />
                </a>
                <a href="https://portfolio.ahmadrizki.dev" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20">
                  <Globe size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="px-6 py-8 space-y-8">
            {/* Bio */}
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <GraduationCap size={20} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Tentang Saya</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Saya adalah mahasiswa Teknik Informatika di Universitas Indonesia yang passionate dalam mengembangkan 
                teknologi kesehatan digital. Dengan pengalaman 3+ tahun dalam full-stack development, saya fokus pada 
                pembuatan solusi inovatif yang dapat meningkatkan kualitas hidup masyarakat melalui teknologi.
              </p>
            </div>

            {/* Education & Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <GraduationCap size={20} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Pendidikan</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-800">S1 Teknik Informatika</h4>
                    <p className="text-sm text-gray-600">Universitas Indonesia</p>
                    <p className="text-xs text-gray-500">2021 - 2025 | IPK: 3.85/4.00</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <Briefcase size={20} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Pengalaman</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-800">Frontend Developer Intern</h4>
                    <p className="text-sm text-gray-600">PT. Teknologi Sehat Indonesia</p>
                    <p className="text-xs text-gray-500">Jun 2024 - Sep 2024</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Section */}
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Heart size={20} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Tentang Proyek SanaTech</h2>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Latar Belakang</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  SanaTech dikembangkan sebagai proyek tugas akhir untuk gelar Sarjana Teknik Informatika. 
                  Proyek ini lahir dari keprihatinan terhadap meningkatnya kasus gangguan kesehatan mental di Indonesia, 
                  terutama di kalangan milenial dan Gen Z.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Tujuan & Visi</h3>
                <p className="text-gray-600 leading-relaxed">
                  Mengembangkan platform monitoring kesehatan mental berbasis biofeedback yang dapat diakses secara 
                  real-time, membantu pengguna memahami kondisi mental mereka, dan memberikan intervensi dini 
                  untuk mencegah masalah kesehatan mental yang lebih serius.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">🎯 Fitur Utama</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Real-time biofeedback monitoring</li>
                    <li>• AI-powered mood analysis</li>
                    <li>• Personalized mental health insights</li>
                    <li>• Community support system</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 rounded-xl p-4">
                  <h4 className="font-semibold text-green-800 mb-2">💡 Inovasi</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Non-invasive sensor integration</li>
                    <li>• Machine learning algorithms</li>
                    <li>• Gamification elements</li>
                    <li>• Cross-platform compatibility</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <Code size={20} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Tech Stack & Tools</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {techStack.map((tech, index) => (
                  <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 text-center hover:shadow-md transition-all duration-300">
                    <div className="text-2xl mb-2">{tech.icon}</div>
                    <h4 className="font-semibold text-gray-800 text-sm">{tech.name}</h4>
                    <p className="text-xs text-gray-600">{tech.category}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Other Projects */}
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Briefcase size={20} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Proyek Lainnya</h2>
              </div>
              
              <div className="space-y-4">
                {projects.map((project, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800">{project.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        project.status === 'Active' ? 'bg-green-100 text-green-800' :
                        project.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{project.description}</p>
                    <p className="text-xs text-gray-500">{project.tech}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Award size={20} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Penghargaan & Prestasi</h2>
              </div>
              
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <Star size={16} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-gray-800">{achievement.title}</h4>
                        <span className="text-sm text-gray-600">{achievement.year}</span>
                      </div>
                      <p className="text-gray-600 text-sm">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact CTA */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-3xl p-8 text-white text-center">
              <h2 className="text-2xl font-bold mb-4">Mari Berkolaborasi!</h2>
              <p className="text-purple-100 mb-6">
                Tertarik untuk berdiskusi tentang teknologi kesehatan atau berkolaborasi dalam proyek? 
                Jangan ragu untuk menghubungi saya!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="mailto:ahmad.rizki@example.com" 
                  className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Mail size={20} />
                  <span>Email Saya</span>
                </a>
                <a 
                  href="https://linkedin.com/in/ahmadrizkipratama" 
                  className="bg-white/10 border border-white/20 px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Linkedin size={20} />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">
                © 2025 Ahmad Rizki Pratama. Dibuat dengan ❤️ untuk masa depan kesehatan digital Indonesia.
              </p>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AboutDeveloperPage;