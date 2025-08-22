import React from 'react';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButtons, 
  IonBackButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonNote,
  IonChip
} from '@ionic/react';
import { 
  shield, 
  lockClosed, 
  person, 
  analytics, 
  heart, 
  document,
  eye,
  share,
  checkmarkCircle,
  calendar
} from 'ionicons/icons';

const PrivacyPolicyPage: React.FC = () => {
  const lastUpdated = "20 Agustus 2025";
  
  const dataTypes = [
    { icon: person, title: "Informasi Akun", desc: "Nama, email, foto profil" },
    { icon: heart, title: "Data Biofeedback", desc: "Detak jantung, suhu, GSR, SpO2" },
    { icon: analytics, title: "Data Kesehatan Mental", desc: "Mood, stress, pola tidur" },
    { icon: eye, title: "Data Penggunaan", desc: "Interaksi dengan aplikasi" }
  ];

  const usageReasons = [
    "Menyediakan dan meningkatkan fungsionalitas aplikasi",
    "Memberikan analisis kesehatan yang dipersonalisasi",
    "Penelitian anonim untuk kemajuan kesehatan mental digital",
    "Komunikasi mengenai pembaruan dan informasi penting"
  ];

  const securityFeatures = [
    { icon: lockClosed, title: "Enkripsi HTTPS", desc: "Semua data ditransmisikan dengan aman" },
    { icon: shield, title: "Server Aman", desc: "Penyimpanan di infrastruktur terpercaya" },
    { icon: checkmarkCircle, title: "Standar Industri", desc: "Keamanan sesuai best practices" }
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/login" color="light" />
          </IonButtons>
          <IonTitle color="light">Kebijakan Privasi</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen className="ion-padding">
        {/* Header Section */}
        <div className="privacy-header" style={{ textAlign: 'center', marginBottom: '24px' }}>
          <IonIcon 
            icon={document} 
            style={{ 
              fontSize: '48px', 
              color: 'var(--ion-color-primary)', 
              marginBottom: '16px' 
            }} 
          />
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            margin: '0 0 8px 0',
            color: 'var(--ion-color-dark)'
          }}>
            Kebijakan Privasi SanaTech
          </h1>
          <IonChip color="medium">
            <IonIcon icon={calendar} />
            <IonLabel>Efektif: {lastUpdated}</IonLabel>
          </IonChip>
        </div>

        {/* Introduction */}
        <IonCard>
          <IonCardContent>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <IonIcon icon={shield} color="success" style={{ marginRight: '12px', fontSize: '24px' }} />
              <h2 style={{ margin: 0, color: 'var(--ion-color-dark)' }}>Komitmen Privasi Kami</h2>
            </div>
            <p style={{ color: 'var(--ion-color-medium)', lineHeight: '1.6', margin: 0 }}>
              Terima kasih telah menggunakan SanaTech. Privasi Anda adalah prioritas utama kami. 
              Kebijakan ini menjelaskan dengan transparan bagaimana kami menangani informasi Anda.
            </p>
          </IonCardContent>
        </IonCard>

        {/* Data Collection Section */}
        <IonCard>
          <IonCardContent>
            <h2 style={{ 
              color: 'var(--ion-color-primary)', 
              marginBottom: '16px',
              fontSize: '20px',
              fontWeight: '600'
            }}>
              1. Data yang Kami Kumpulkan
            </h2>
            {dataTypes.map((item, index) => (
              <IonItem key={index} lines="none" style={{ '--padding-start': '0px' }}>
                <IonIcon 
                  icon={item.icon} 
                  slot="start" 
                  color="primary" 
                  style={{ fontSize: '20px' }}
                />
                <IonLabel>
                  <h3 style={{ fontWeight: '600', margin: '0 0 4px 0' }}>{item.title}</h3>
                  <p style={{ color: 'var(--ion-color-medium)', margin: 0 }}>{item.desc}</p>
                </IonLabel>
              </IonItem>
            ))}
          </IonCardContent>
        </IonCard>

        {/* Data Usage Section */}
        <IonCard>
          <IonCardContent>
            <h2 style={{ 
              color: 'var(--ion-color-primary)', 
              marginBottom: '16px',
              fontSize: '20px',
              fontWeight: '600'
            }}>
              2. Bagaimana Kami Menggunakan Data Anda
            </h2>
            <p style={{ color: 'var(--ion-color-medium)', marginBottom: '16px' }}>
              Data Anda digunakan untuk tujuan berikut:
            </p>
            {usageReasons.map((reason, index) => (
              <IonItem key={index} lines="none" style={{ '--padding-start': '0px' }}>
                <IonIcon 
                  icon={checkmarkCircle} 
                  slot="start" 
                  color="success" 
                  style={{ fontSize: '18px' }}
                />
                <IonLabel>
                  <p style={{ margin: 0, lineHeight: '1.5' }}>{reason}</p>
                </IonLabel>
              </IonItem>
            ))}
          </IonCardContent>
        </IonCard>

        {/* Security Section */}
        <IonCard>
          <IonCardContent>
            <h2 style={{ 
              color: 'var(--ion-color-primary)', 
              marginBottom: '16px',
              fontSize: '20px',
              fontWeight: '600'
            }}>
              3. Keamanan Data
            </h2>
            <p style={{ color: 'var(--ion-color-medium)', marginBottom: '16px' }}>
              Kami menerapkan langkah-langkah keamanan terdepan untuk melindungi informasi Anda:
            </p>
            {securityFeatures.map((feature, index) => (
              <IonItem key={index} lines="none" style={{ '--padding-start': '0px' }}>
                <IonIcon 
                  icon={feature.icon} 
                  slot="start" 
                  color="success" 
                  style={{ fontSize: '20px' }}
                />
                <IonLabel>
                  <h3 style={{ fontWeight: '600', margin: '0 0 4px 0' }}>{feature.title}</h3>
                  <p style={{ color: 'var(--ion-color-medium)', margin: 0 }}>{feature.desc}</p>
                </IonLabel>
              </IonItem>
            ))}
          </IonCardContent>
        </IonCard>

        {/* Data Sharing Section */}
        <IonCard>
          <IonCardContent>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <IonIcon icon={share} color="warning" style={{ marginRight: '12px', fontSize: '24px' }} />
              <h2 style={{ 
                margin: 0, 
                color: 'var(--ion-color-primary)',
                fontSize: '20px',
                fontWeight: '600'
              }}>
                4. Berbagi Data
              </h2>
            </div>
            <div style={{ 
              backgroundColor: 'var(--ion-color-light)', 
              padding: '16px', 
              borderRadius: '12px',
              border: '2px solid var(--ion-color-success)'
            }}>
              <IonIcon 
                icon={lockClosed} 
                color="success" 
                style={{ fontSize: '20px', marginBottom: '8px' }}
              />
              <p style={{ 
                margin: 0, 
                fontWeight: '600', 
                color: 'var(--ion-color-dark)' 
              }}>
                Jaminan Privasi: Kami TIDAK akan membagikan data pribadi Anda yang dapat diidentifikasi 
                kepada pihak ketiga tanpa persetujuan eksplisit dari Anda, kecuali diwajibkan oleh hukum.
              </p>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Contact Section */}
        <IonCard>
          <IonCardContent>
            <h2 style={{ 
              color: 'var(--ion-color-primary)', 
              marginBottom: '16px',
              fontSize: '20px',
              fontWeight: '600'
            }}>
              5. Hubungi Kami
            </h2>
            <p style={{ color: 'var(--ion-color-medium)', marginBottom: '12px' }}>
              Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi kami:
            </p>
            <IonItem lines="none" style={{ '--padding-start': '0px' }}>
              <IonLabel>
                <h3 style={{ fontWeight: '600', margin: '0 0 4px 0' }}>Email Support</h3>
                <p style={{ color: 'var(--ion-color-primary)', margin: 0 }}>privacy@sanatech.app</p>
              </IonLabel>
            </IonItem>
          </IonCardContent>
        </IonCard>

        {/* Footer Disclaimer */}
        <div style={{ 
          textAlign: 'center', 
          padding: '24px 16px',
          backgroundColor: 'var(--ion-color-light)',
          borderRadius: '12px',
          margin: '16px 0'
        }}>
          <IonNote color="medium">
            <em>
              Dokumen ini merupakan bagian dari prototipe SanaTech dan akan diperbarui sesuai 
              dengan perkembangan aplikasi dan regulasi yang berlaku.
            </em>
          </IonNote>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PrivacyPolicyPage;