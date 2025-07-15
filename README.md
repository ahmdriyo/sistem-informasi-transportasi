# Next.js Admin Template - Project MPL

![Version](https://img.shields.io/badge/version-2.0.2-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.2.3-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0.0-38B2AC)
![Prisma](https://img.shields.io/badge/Prisma-6.7.0-2D3748)

## 🚀 Overview

Proyek ini merupakan aplikasi berbasis web yang dirancang untuk menyajikan informasi transportasi umum di Kalimantan Selatan secara real-time, lengkap, dan mudah diakses. Aplikasi ini menyediakan fitur pencarian jadwal keberangkatan, rute perjalanan, serta jenis transportasi yang tersedia. Selain itu, admin dan operator dapat mengelola data melalui fitur CRUD. Sistem ini dibangun menggunakan teknologi modern seperti Next.js, Supabase, dan PostgreSQL, dengan desain antarmuka yang dirancang melalui Figma agar tampilannya responsif dan ramah pengguna.

### ✨ Key Features

- **🤖 AI-Powered Navigation**: Integrasi MediaPipe dan TensorFlow untuk deteksi gesture tangan
- **📊 Dashboard Analytics**: Charts dan visualisasi data dengan ApexCharts
- **🗺️ Interactive Maps**: Integrasi Leaflet untuk pemetaan dan navigasi
- **🎨 Modern UI**: Desain responsif dengan Tailwind CSS dan Ant Design
- **🔐 Authentication**: Sistem autentikasi yang aman dengan Supabase
- **📱 Mobile-First**: Desain responsif untuk semua perangkat
- **🌙 Dark Mode**: Dukungan tema gelap/terang

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework dengan App Router
- **TypeScript** - Type safety dan developer experience
- **Tailwind CSS 4.0** - Utility-first CSS framework
- **Ant Design** - Enterprise-class UI components
- **Zustand** - State management yang ringan

### Backend & Database
- **Prisma** - Next-generation ORM
- **PostgreSQL** - Database relasional
- **Supabase** - Backend as a Service

### AI/ML Integration
- **MediaPipe** - Real-time hand gesture detection
- **TensorFlow.js** - Machine learning di browser
- **Handpose** - Hand landmark detection
- **COCO-SSD** - Object detection

### Visualization & Charts
- **ApexCharts** - Interactive charts
- **React-ApexCharts** - React wrapper untuk ApexCharts
- **Leaflet** - Interactive maps
- **JVectorMap** - Vector maps

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm atau yarn

### Installation

1. **Clone repository**
   ```bash
   git clone https://github.com/ahmdriyo/next-js-admin-template.git
   cd next-js-admin-template
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Isi file `.env.local` dengan konfigurasi database dan Supabase:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
   DIRECT_URL="postgresql://username:password@localhost:5432/database_name"
   NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
   ```

4. **Setup database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

   Aplikasi akan berjalan di `http://localhost:3000`

## 📁 Project Structure

```
src/
├── app/                    # App Router (Next.js 13+)
│   ├── (general)/         # General user interface
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   └── auth/              # Authentication pages
├── components/            # Reusable components
│   ├── charts/           # Chart components
│   ├── forms/            # Form components
│   ├── HandGestureDetection/ # AI gesture detection
│   ├── maps/             # Map components
│   └── ui/               # UI components
├── context/              # React context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
└── store/                # Global state management
```

## 🤖 AI Features

### Hand Gesture Detection
Template ini menggunakan MediaPipe untuk mendeteksi gesture tangan secara real-time:

- **Navigation Control**: Navigasi menggunakan gesture tangan
- **Interactive Dashboard**: Kontrol dashboard tanpa menyentuh layar
- **Accessibility**: Meningkatkan aksesibilitas untuk pengguna dengan keterbatasan

### Machine Learning Models
- **Handpose Detection**: Deteksi landmark tangan
- **Object Detection**: Identifikasi objek dalam gambar
- **Gesture Recognition**: Pengenalan pola gesture

## 🎨 UI Components

### Built-in Components
- **Charts**: Line, Bar, Pie, Area charts
- **Maps**: Interactive maps dengan marker dan routing
- **Forms**: Validasi form dengan error handling
- **Tables**: Data tables dengan sorting dan filtering
- **Modals**: Reusable modal components
- **Cards**: Various card layouts

### Styling
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Automatic theme switching
- **Custom Icons**: SVG icon library
- **Animations**: Smooth transitions dan micro-interactions

## 📊 Database Schema

### Users Model
```prisma
model Users {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  password  String
  createdAt DateTime @default(now())
  role      Role
}

enum Role {
  ADMIN
  USER
}
```

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Code Quality
- **ESLint**: Linting dengan Next.js config
- **Prettier**: Code formatting
- **TypeScript**: Type checking
- **Husky**: Git hooks untuk pre-commit

## 🚀 Deployment

### Vercel (Recommended)
```bash
npx vercel --prod
```

### Docker
```bash
docker build -t project-mpl .
docker run -p 3000:3000 project-mpl
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js Team](https://nextjs.org/) untuk framework yang luar biasa
- [Vercel](https://vercel.com/) untuk platform deployment
- [MediaPipe](https://mediapipe.dev/) untuk AI/ML capabilities
- [Ant Design](https://ant.design/) untuk UI components
- [Tailwind CSS](https://tailwindcss.com/) untuk styling system

## 📞 Support

Jika Anda memiliki pertanyaan atau butuh bantuan:

- 📧 Email: [ahmdriyo@gmail.com](mailto:ahmdriyo@gmail.com)
- 🐛 Issues: [GitHub Issues](https://github.com/ahmdriyo/next-js-admin-template/issues)
- 📖 Documentation: [Wiki](https://github.com/ahmdriyo/next-js-admin-template/wiki)

---

⭐ Jangan lupa untuk memberikan star jika project ini membantu Anda!