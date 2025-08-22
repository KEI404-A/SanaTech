// src/pages/FAQPage.tsx

import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonIcon } from '@ionic/react';
import { chevronDown, helpCircleOutline, shieldCheckmarkOutline, phonePortraitOutline, medicalOutline } from 'ionicons/icons';

interface FAQItemProps {
  question: string;
  answer: string;
  icon?: string;
  category?: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, icon, category }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 overflow-hidden transition-all duration-300 hover:shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between text-left transition-colors duration-200 hover:bg-gray-50"
      >
        <div className="flex items-center space-x-4 flex-1">
          {icon && (
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <IonIcon icon={icon} className="text-white text-lg" />
            </div>
          )}
          <div className="flex-1">
            {category && (
              <span className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1 block">
                {category}
              </span>
            )}
            <h3 className="text-lg font-semibold text-gray-900 leading-tight">{question}</h3>
          </div>
        </div>
        <div className="flex-shrink-0 ml-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            isOpen ? 'bg-blue-100 rotate-180' : 'bg-gray-100'
          }`}>
            <IonIcon 
              icon={chevronDown} 
              className={`text-sm transition-colors duration-300 ${
                isOpen ? 'text-blue-600' : 'text-gray-500'
              }`} 
            />
          </div>
        </div>
      </button>
      
      <div className={`transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      } overflow-hidden`}>
        <div className="px-6 pb-6">
          <div className="pl-14">
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="text-gray-600 leading-relaxed">{answer}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FAQPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const faqs = [
    {
      question: "Apa itu SanaTech?",
      answer: "SanaTech adalah sistem biofeedback non-invasif yang dirancang untuk membantu Anda memantau kesehatan mental dan fisik secara real-time. Aplikasi ini menggunakan data dari sensor untuk memberikan insight dan rekomendasi yang dipersonalisasi untuk meningkatkan kesejahteraan Anda.",
      icon: helpCircleOutline,
      category: "Umum"
    },
    {
      question: "Apakah SanaTech menggantikan dokter atau psikolog?",
      answer: "Tidak. SanaTech adalah alat bantu monitoring dan edukasi. Aplikasi ini tidak memberikan diagnosis medis dan tidak boleh dianggap sebagai pengganti konsultasi dengan profesional kesehatan yang berkualifikasi. Selalu konsultasikan dengan dokter untuk masalah medis apa pun.",
      icon: medicalOutline,
      category: "Medis"
    },
    {
      question: "Bagaimana data saya diamankan?",
      answer: "Kami sangat serius menjaga privasi dan keamanan data Anda. Semua data ditransmisikan melalui koneksi terenkripsi (HTTPS) dan disimpan di server yang aman menggunakan standar industri terbaik. Data Anda tidak akan dibagikan kepada pihak ketiga tanpa persetujuan eksplisit. Anda bisa membaca lebih lanjut di Kebijakan Privasi kami.",
      icon: shieldCheckmarkOutline,
      category: "Keamanan"
    },
    {
      question: "Apakah perangkat biofeedback diperlukan untuk menggunakan aplikasi?",
      answer: "Untuk mendapatkan fungsionalitas penuh, seperti monitoring real-time detak jantung dan GSR, penggunaan perangkat biofeedback SanaTech sangat direkomendasikan. Namun, beberapa fitur seperti mood tracking, journaling, dan akses ke artikel edukasi tetap bisa digunakan tanpa perangkat.",
      icon: phonePortraitOutline,
      category: "Perangkat"
    },
    {
      question: "Berapa biaya berlangganan SanaTech?",
      answer: "SanaTech menawarkan berbagai paket berlangganan mulai dari paket Basic gratis hingga paket Premium dengan fitur lengkap. Paket Premium tersedia dengan harga terjangkau dan termasuk akses ke semua fitur monitoring, analisis mendalam, dan konsultasi virtual.",
      icon: helpCircleOutline,
      category: "Harga"
    },
    {
      question: "Bagaimana cara mengkalibrasi perangkat biofeedback?",
      answer: "Kalibrasi perangkat sangat mudah dilakukan melalui aplikasi. Ikuti panduan step-by-step yang tersedia di menu Pengaturan. Proses kalibrasi biasanya memakan waktu 2-3 menit dan perlu dilakukan sekali seminggu untuk hasil yang optimal.",
      icon: phonePortraitOutline,
      category: "Perangkat"
    }
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(faqs.map(faq => faq.category))];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="bg-gradient-to-r from-blue-600 to-purple-600">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/tab6" style={{ color: 'grey' }} />
          </IonButtons>
          <IonTitle style={{ color: 'white' }} className="font-semibold">FAQ - Tanya Jawab</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen className="bg-gray-50">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white px-6 py-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <IonIcon icon={helpCircleOutline} className="text-2xl" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Pusat Bantuan SanaTech</h1>
            <p className="text-blue-100 text-sm leading-relaxed">
              Temukan jawaban untuk pertanyaan yang sering ditanyakan tentang platform kesehatan digital kami
            </p>
          </div>
        </div>

        {/* Search Section */}
        <div className="px-6 -mt-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari pertanyaan atau topik..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <IonIcon 
                icon={helpCircleOutline} 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="px-6 mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="px-6 pb-8">
          {filteredFAQs.length > 0 ? (
            <div className="space-y-0">
              {filteredFAQs.map((faq, index) => (
                <FAQItem 
                  key={index} 
                  question={faq.question} 
                  answer={faq.answer}
                  icon={faq.icon}
                  category={faq.category}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <IonIcon icon={helpCircleOutline} className="text-2xl text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Tidak ada hasil ditemukan</h3>
              <p className="text-gray-500 text-sm">
                Coba gunakan kata kunci yang berbeda atau hubungi tim support kami
              </p>
            </div>
          )}
        </div>

        {/* Contact Support Section */}
        <div className="px-6 pb-8">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <IonIcon icon={helpCircleOutline} className="text-white text-lg" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Masih ada pertanyaan?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Tim support kami siap membantu Anda 24/7
              </p>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium text-sm hover:shadow-lg transition-shadow duration-200">
                Hubungi Support
              </button>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default FAQPage;