# Utama UHAMKA Dashboard

Dashboard aplikasi Utama UHAMKA yang dibangun dengan React + Vite, Tailwind CSS, Redux Toolkit, dan Recharts.

## Fitur

- ✅ React 19 dengan Vite
- ✅ Tailwind CSS untuk styling
- ✅ Redux Toolkit untuk state management
- ✅ React Router DOM untuk routing
- ✅ Protected routes dengan autentikasi
- ✅ React Icons untuk ikon
- ✅ Recharts untuk visualisasi data
- ✅ Layout terpisah (Sidebar, Header, Footer)
- ✅ Halaman Login yang menarik
- ✅ Dashboard dengan charts dan statistik

## Struktur Project

```
website/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx          # Sidebar navigasi
│   │   ├── Header.jsx           # Header dengan search dan profile
│   │   ├── Footer.jsx           # Footer
│   │   └── ProtectedRoute.jsx   # Route guard untuk autentikasi
│   ├── layouts/
│   │   └── MainLayout.jsx       # Layout utama yang membungkus semua halaman
│   ├── pages/
│   │   ├── Login.jsx            # Halaman login
│   │   ├── Dashboard.jsx        # Halaman dashboard utama
│   │   ├── Billing.jsx          # Halaman billing
│   │   ├── Ukm.jsx              # Halaman UKM
│   │   ├── Inventory.jsx        # Halaman inventory
│   │   ├── Issue.jsx            # Halaman issue
│   │   ├── Event.jsx            # Halaman event
│   │   └── Settings.jsx         # Halaman settings
│   ├── store/
│   │   ├── store.js             # Redux store configuration
│   │   └── authSlice.js         # Auth slice untuk login/logout
│   ├── App.jsx                  # Component utama dengan routing
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles dengan Tailwind
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## Cara Menjalankan Project

### 1. Install Dependencies

```bash
npm install
```

### 2. Jalankan Development Server

```bash
npm run dev
```

Project akan berjalan di `http://localhost:5173`

### 3. Build untuk Production

```bash
npm run build
```

### 4. Preview Build Production

```bash
npm run preview
```

## Login

Untuk login, masukkan email dan password apa saja. Sistem akan menerima kredensial apapun untuk keperluan demo.

Setelah login, Anda akan diarahkan ke halaman Dashboard.

## Navigasi

Gunakan sidebar untuk navigasi antar halaman:
- **Dashboard** - Halaman utama dengan statistik dan charts
- **Billing** - Halaman billing
- **UKM** - Halaman UKM
- **Inventory** - Halaman inventory
- **Issue** - Halaman issue tracking
- **Event** - Halaman event management
- **Settings** - Halaman pengaturan

## Konfigurasi Warna

Warna primary sudah dikonfigurasi di `tailwind.config.js`:

```javascript
colors: {
  primary: '#4A22AD',
}
```

Anda bisa menggunakan class `bg-primary`, `text-primary`, `border-primary`, dll.

## Redux State Management

State autentikasi dikelola menggunakan Redux Toolkit dengan localStorage persistence:

- `login(payload)` - Login user
- `logout()` - Logout user
- `checkAuth()` - Check autentikasi dari localStorage

## Protected Routes

Semua halaman kecuali Login dilindungi dengan `ProtectedRoute` component. Jika user belum login, akan otomatis diarahkan ke halaman login.

## Menambah Halaman Baru

1. Buat file component di `src/pages/NamaHalaman.jsx`
2. Import `MainLayout` dan bungkus content dengan layout tersebut
3. Tambahkan route di `src/App.jsx`
4. Tambahkan menu item di `src/components/Sidebar.jsx` (jika perlu)

Contoh:

```jsx
import MainLayout from '../layouts/MainLayout';

const NamaHalaman = () => {
  return (
    <MainLayout>
      <div className="bg-white rounded-xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Nama Halaman</h1>
        <p className="text-gray-600">Content here...</p>
      </div>
    </MainLayout>
  );
};

export default NamaHalaman;
```

## Logo

Untuk mengganti logo:
1. Letakkan file logo di folder `src/assets/`
2. Update component `Sidebar.jsx` pada bagian logo untuk menggunakan gambar logo yang baru

## Chart Customization

Project menggunakan Recharts. Dokumentasi lengkap bisa dilihat di: https://recharts.org/

## Technology Stack

- **React 19** - Library UI
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **React Router DOM** - Routing
- **React Icons** - Icon library
- **Recharts** - Charting library

## License

ISC
