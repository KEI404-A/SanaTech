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
  IonChip,
  IonAccordion,
  IonAccordionGroup
} from '@ionic/react';
import { 
  documentText, 
  medkit, 
  person, 
  checkmarkCircle, 
  warning,
  calendar,
  refresh,
  mail,
  alertCircle,
  lockClosed,
  pulse,
  library
} from 'ionicons/icons';

const TermsAndConditionsPage: React.FC = () => {
  const lastUpdated = "20 Agustus 2025";
  
  const keyPoints = [
    { 
      icon: medkit, 
      title: "Tujuan Penelitian & Edukatif", 
      desc: "Aplikasi untuk monitoring kesehatan, bukan pengganti medis profesional",
      color: "primary"
    },
    { 
      icon: person, 
      title: "Tanggung Jawab Pengguna", 
      desc: "Anda bertanggung jawab penuh atas keamanan akun",
      color: "secondary"
    },
    { 
      icon: checkmarkCircle, 
      title: "Penggunaan yang Benar", 
      desc: "Gunakan sesuai ketentuan dan tidak melanggar hukum",
      color: "success"
    },
    { 
      icon: warning, 
      title: "Batasan Tanggung Jawab", 
      desc: "Risiko penggunaan sepenuhnya menjadi tanggung jawab pengguna",
      color: "warning"
    }
  ];

  const importantNotices = [
    {
      title: "Peringatan Medis",
      icon: alertCircle,
      color: "danger",
      content: "Aplikasi ini BUKAN pengganti konsultasi medis profesional. Selalu konsultasikan dengan dokter untuk masalah kesehatan."
    },
    {
      title: "Data Biofeedback",
      icon: pulse,
      color: "tertiary", 
      content: "Data sensor bersifat informatif dan dapat memiliki margin error. Gunakan sebagai referensi tambahan, bukan diagnosis utama."
    }
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/login" color="light" />
          </IonButtons>
          <IonTitle color="light">Syarat & Ketentuan</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen className="ion-padding">
        {/* Header Section */}
        <div className="terms-header" style={{ textAlign: 'center', marginBottom: '24px' }}>
          <IonIcon 
            icon={documentText} 
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
            Syarat & Ketentuan SanaTech
          </h1>
          <IonChip color="medium">
            <IonIcon icon={calendar} />
            <IonLabel>Efektif: {lastUpdated}</IonLabel>
          </IonChip>
        </div>

        {/* Welcome Message */}
        <IonCard>
          <IonCardContent>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <IonIcon icon={library} color="primary" style={{ marginRight: '12px', fontSize: '24px' }} />
              <h2 style={{ margin: 0, color: 'var(--ion-color-dark)' }}>Selamat Datang</h2>
            </div>
            <p style={{ color: 'var(--ion-color-medium)', lineHeight: '1.6', margin: 0 }}>
              Dengan menggunakan aplikasi SanaTech, Anda setuju untuk terikat oleh syarat dan ketentuan berikut. 
              Mohon baca dengan saksama sebelum melanjutkan penggunaan aplikasi.
            </p>
          </IonCardContent>
        </IonCard>

        {/* Key Points Overview */}
        <IonCard>
          <IonCardContent>
            <h2 style={{ 
              color: 'var(--ion-color-primary)', 
              marginBottom: '16px',
              fontSize: '20px',
              fontWeight: '600'
            }}>
              Poin-Poin Utama
            </h2>
            {keyPoints.map((point, index) => (
              <IonItem key={index} lines="none" style={{ '--padding-start': '0px' }}>
                <IonIcon 
                  icon={point.icon} 
                  slot="start" 
                  color={point.color}
                  style={{ fontSize: '20px' }}
                />
                <IonLabel>
                  <h3 style={{ fontWeight: '600', margin: '0 0 4px 0' }}>{point.title}</h3>
                  <p style={{ color: 'var(--ion-color-medium)', margin: 0, fontSize: '14px' }}>
                    {point.desc}
                  </p>
                </IonLabel>
              </IonItem>
            ))}
          </IonCardContent>
        </IonCard>

        {/* Important Notices */}
        <IonCard>
          <IonCardContent>
            <h2 style={{ 
              color: 'var(--ion-color-primary)', 
              marginBottom: '16px',
              fontSize: '20px',
              fontWeight: '600'
            }}>
              Pemberitahuan Penting
            </h2>
            {importantNotices.map((notice, index) => (
              <div 
                key={index}
                style={{ 
                  backgroundColor: notice.color === 'danger' ? '#ffebee' : '#f3e5f5', 
                  padding: '16px', 
                  borderRadius: '12px',
                  marginBottom: '12px',
                  border: `2px solid var(--ion-color-${notice.color})`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <IonIcon 
                    icon={notice.icon} 
                    color={notice.color}
                    style={{ fontSize: '20px', marginRight: '8px' }}
                  />
                  <h3 style={{ margin: 0, fontWeight: '600', color: 'var(--ion-color-dark)' }}>
                    {notice.title}
                  </h3>
                </div>
                <p style={{ 
                  margin: 0, 
                  fontSize: '14px', 
                  lineHeight: '1.5',
                  color: 'var(--ion-color-dark)'
                }}>
                  {notice.content}
                </p>
              </div>
            ))}
          </IonCardContent>
        </IonCard>

        {/* Detailed Terms - Accordion Style */}
        <IonCard>
          <IonCardContent>
            <h2 style={{ 
              color: 'var(--ion-color-primary)', 
              marginBottom: '16px',
              fontSize: '20px',
              fontWeight: '600'
            }}>
              Ketentuan Lengkap
            </h2>
            
            <IonAccordionGroup>
              <IonAccordion value="purpose">
                <IonItem slot="header" color="light">
                  <IonIcon icon={medkit} slot="start" color="primary" />
                  <IonLabel>
                    <h2>1. Tujuan Layanan</h2>
                  </IonLabel>
                </IonItem>
                <div className="ion-padding" slot="content">
                  <p style={{ lineHeight: '1.6', color: 'var(--ion-color-dark)' }}>
                    SanaTech adalah aplikasi berbasis penelitian yang menyediakan sistem biofeedback 
                    non-invasif untuk tujuan monitoring kesehatan fisik dan mental. Informasi yang 
                    disajikan dalam aplikasi ini bersifat informasional dan edukatif.
                  </p>
                  <div style={{ 
                    backgroundColor: '#ffebee', 
                    padding: '12px', 
                    borderRadius: '8px',
                    marginTop: '12px',
                    border: '1px solid var(--ion-color-danger)'
                  }}>
                    <strong style={{ color: 'var(--ion-color-danger)' }}>
                      PENTING: Aplikasi ini bukan pengganti nasihat, diagnosis, atau perawatan medis profesional.
                    </strong>
                  </div>
                </div>
              </IonAccordion>

              <IonAccordion value="account">
                <IonItem slot="header" color="light">
                  <IonIcon icon={person} slot="start" color="secondary" />
                  <IonLabel>
                    <h2>2. Akun Pengguna</h2>
                  </IonLabel>
                </IonItem>
                <div className="ion-padding" slot="content">
                  <p style={{ lineHeight: '1.6', color: 'var(--ion-color-dark)' }}>
                    Anda bertanggung jawab untuk menjaga kerahasiaan informasi akun Anda dan 
                    menerima tanggung jawab atas semua aktivitas yang terjadi di bawah akun Anda.
                  </p>
                  <IonItem lines="none" style={{ '--padding-start': '0px' }}>
                    <IonIcon icon={lockClosed} slot="start" color="success" />
                    <IonLabel>
                      <p>Gunakan password yang kuat dan jangan bagikan credentials Anda</p>
                    </IonLabel>
                  </IonItem>
                </div>
              </IonAccordion>

              <IonAccordion value="usage">
                <IonItem slot="header" color="light">
                  <IonIcon icon={checkmarkCircle} slot="start" color="success" />
                  <IonLabel>
                    <h2>3. Penggunaan yang Diizinkan</h2>
                  </IonLabel>
                </IonItem>
                <div className="ion-padding" slot="content">
                  <p style={{ lineHeight: '1.6', color: 'var(--ion-color-dark)' }}>
                    Anda setuju untuk tidak menggunakan aplikasi untuk tujuan yang melanggar hukum 
                    atau dilarang oleh ketentuan ini. Penggunaan harus sesuai dengan tujuan 
                    aplikasi sebagai alat monitoring kesehatan.
                  </p>
                  <div style={{ marginTop: '12px' }}>
                    <h4 style={{ color: 'var(--ion-color-danger)', fontSize: '16px' }}>Dilarang:</h4>
                    <ul style={{ color: 'var(--ion-color-medium)', paddingLeft: '20px' }}>
                      <li>Menggunakan untuk tujuan ilegal</li>
                      <li>Mengganggu server atau jaringan</li>
                      <li>Menyalahgunakan data biofeedback</li>
                    </ul>
                  </div>
                </div>
              </IonAccordion>

              <IonAccordion value="liability">
                <IonItem slot="header" color="light">
                  <IonIcon icon={warning} slot="start" color="warning" />
                  <IonLabel>
                    <h2>4. Batasan Tanggung Jawab</h2>
                  </IonLabel>
                </IonItem>
                <div className="ion-padding" slot="content">
                  <div style={{ 
                    backgroundColor: '#fff3e0', 
                    padding: '16px', 
                    borderRadius: '12px',
                    border: '2px solid var(--ion-color-warning)'
                  }}>
                    <p style={{ margin: 0, lineHeight: '1.6', color: 'var(--ion-color-dark)' }}>
                      <strong>SanaTech dan para pengembangnya tidak bertanggung jawab</strong> atas 
                      segala kerusakan langsung, tidak langsung, insidental, atau konsekuensial yang 
                      timbul dari penggunaan aplikasi ini.
                    </p>
                  </div>
                  <p style={{ 
                    marginTop: '12px', 
                    fontStyle: 'italic', 
                    color: 'var(--ion-color-medium)' 
                  }}>
                    Penggunaan aplikasi ini sepenuhnya menjadi risiko Anda sendiri.
                  </p>
                </div>
              </IonAccordion>

              <IonAccordion value="changes">
                <IonItem slot="header" color="light">
                  <IonIcon icon={refresh} slot="start" color="tertiary" />
                  <IonLabel>
                    <h2>5. Perubahan Ketentuan</h2>
                  </IonLabel>
                </IonItem>
                <div className="ion-padding" slot="content">
                  <p style={{ lineHeight: '1.6', color: 'var(--ion-color-dark)' }}>
                    Kami berhak untuk mengubah Syarat & Ketentuan ini kapan saja. Versi terbaru 
                    akan selalu tersedia di dalam aplikasi. Dengan terus menggunakan aplikasi 
                    setelah perubahan, Anda dianggap menyetujui ketentuan yang baru.
                  </p>
                </div>
              </IonAccordion>
            </IonAccordionGroup>
          </IonCardContent>
        </IonCard>

        {/* Contact Information */}
        <IonCard>
          <IonCardContent>
            <h2 style={{ 
              color: 'var(--ion-color-primary)', 
              marginBottom: '16px',
              fontSize: '20px',
              fontWeight: '600'
            }}>
              Kontak & Dukungan
            </h2>
            <IonItem lines="none" style={{ '--padding-start': '0px' }}>
              <IonIcon icon={mail} slot="start" color="primary" />
              <IonLabel>
                <h3 style={{ fontWeight: '600', margin: '0 0 4px 0' }}>Tim Support</h3>
                <p style={{ color: 'var(--ion-color-primary)', margin: 0 }}>support@sanatech.app</p>
              </IonLabel>
            </IonItem>
            <p style={{ 
              color: 'var(--ion-color-medium)', 
              fontSize: '14px',
              marginTop: '12px' 
            }}>
              Jika Anda memiliki pertanyaan tentang syarat dan ketentuan ini, 
              jangan ragu untuk menghubungi tim support kami.
            </p>
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
              Dokumen ini merupakan bagian dari prototipe SanaTech dan akan diperbarui 
              sesuai dengan perkembangan aplikasi dan regulasi yang berlaku. 
              Versi final akan disusun dengan bantuan konsultan hukum yang kompeten.
            </em>
          </IonNote>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default TermsAndConditionsPage;