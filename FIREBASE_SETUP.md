# Panduan Deployment Firebase untuk SanaTech

## Prasyarat

1. **Firebase CLI** harus sudah terinstall. Jika belum, install dengan:
   ```bash
   npm install -g firebase-tools
   ```

2. **Login ke Firebase** (jika belum):
   ```bash
   firebase login
   ```

3. **Project Firebase sudah diinisialisasi**
   - Project ID: `sanatech-1f979`
   - File `.firebaserc` sudah ada

## Langkah-langkah Deployment

### 1. Build Project

Sebelum deploy, pastikan project sudah di-build:

```bash
npm run build
```

Perintah ini akan:
- Compile TypeScript (`tsc`)
- Build aplikasi dengan Vite (`vite build`)
- Menghasilkan file di folder `dist/`

### 2. Verifikasi Build

Pastikan folder `dist/` berisi:
- `index.html`
- Folder `assets/` dengan file JavaScript dan CSS
- `favicon.png`
- `manifest.json`

### 3. Deploy ke Firebase Hosting

Setelah build selesai, deploy dengan perintah:

```bash
firebase deploy --only hosting
```

Atau untuk deploy semua (hosting + firestore rules):

```bash
firebase deploy
```

### 4. Verifikasi Deployment

Setelah deployment selesai, Firebase akan memberikan URL hosting, biasanya:
```
https://sanatech-1f979.web.app
atau
https://sanatech-1f979.firebaseapp.com
```

## Konfigurasi Firebase

File `firebase.json` sudah dikonfigurasi dengan:
- **Public directory**: `dist` (folder build output)
- **Rewrites**: Semua route diarahkan ke `index.html` (untuk SPA routing)
- **Firestore rules**: Menggunakan `firestore.rules`

## Troubleshooting

### Error: "Firebase project not found"
- Pastikan sudah login: `firebase login`
- Verifikasi project ID di `.firebaserc`

### Error: "No such file or directory: dist"
- Pastikan sudah menjalankan `npm run build` terlebih dahulu

### Error: "Build failed"
- Periksa error di terminal
- Pastikan semua dependencies terinstall: `npm install`
- Periksa TypeScript errors: `npm run build`

## Script Deployment Cepat

Anda bisa menambahkan script di `package.json` untuk deployment cepat:

```json
"deploy": "npm run build && firebase deploy --only hosting"
```

Kemudian jalankan:
```bash
npm run deploy
```

## Update Deployment

Untuk update aplikasi:
1. Buat perubahan pada kode
2. Build: `npm run build`
3. Deploy: `firebase deploy --only hosting`

## Catatan Penting

- Pastikan `dist/` folder ada di `.gitignore` (jika menggunakan Git)
- Setiap perubahan kode perlu di-build ulang sebelum deploy
- Firebase Hosting gratis memiliki limit bandwidth, cek di Firebase Console
