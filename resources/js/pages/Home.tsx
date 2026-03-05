import React, { useState } from "react";
import { Link, router } from '@inertiajs/react';
import { 
  Search, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  PlusCircle, 
  Package, 
  ShieldCheck, 
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  LogOut,
  User
} from "lucide-react";

// Types
type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type Stats = {
  total: number;
  hilang: number;
  dititipkan: number;
  dikembalikan: number;
};

type Item = {
  id: number;
  name: string;
  category: { name: string };
  location: string;
  date: string;
  status: string;
  image: string;
  user?: { name: string };
};

// Props from Inertia (shared + controller data)
interface Props {
  auth: {
    user: User | null;
  };
  stats: Stats;
  items: Item[];
}

export default function Home({ auth }: Props) {
  const [activeFilter, setActiveFilter] = useState("semua");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Mock data – you can replace with real items from props if desired
  const MOCK_ITEMS = [
    { id: 1, name: "iPhone 13 Pro", category: "Elektronik", location: "Parkiran Mall", date: "2 Jam yang lalu", status: "hilang", image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&q=80&w=400" },
    { id: 2, name: "Dompet Kulit Cokelat", category: "Aksesoris", location: "Area Food Court", date: "5 Jam yang lalu", status: "dititipkan", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=400" },
    { id: 3, name: "Kunci Mobil Toyota", category: "Lainnya", location: "Lobi Utama", date: "1 Hari yang lalu", status: "dititipkan", image: "https://images.unsplash.com/photo-1549194388-f61be84a6e9e?auto=format&fit=crop&q=80&w=400" },
    { id: 4, name: "Tas Ransel Hitam", category: "Tas", location: "Stasiun MRT", date: "3 Jam yang lalu", status: "hilang", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400" },
  ];

  const handleLogout = () => {
    router.post('/logout');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link href="/home" className="flex items-center gap-2 font-bold text-xl md:text-2xl text-indigo-600">
              <div className="w-8 h-8 md:w-9 md:h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                K
              </div>
              <span className="tracking-tight text-slate-800">Kembaliin</span>
            </Link>
            
            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
              <Link href="/home" className="hover:text-indigo-600 transition-colors">Beranda</Link>
              <Link href="#" className="hover:text-indigo-600 transition-colors">Cari Barang</Link>
              <Link href="#" className="hover:text-indigo-600 transition-colors">Tentang</Link>
            </div>

            {/* Right side buttons – conditional based on auth */}
            <div className="flex items-center gap-2 md:gap-4">
              {auth.user ? (
                // Logged in: show profile dropdown
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-slate-100 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                      {auth.user.name.charAt(0)}
                    </div>
                    <span className="hidden md:block text-sm font-semibold text-slate-700">
                      {auth.user.name}
                    </span>
                    <ChevronDown size={16} className="text-slate-500" />
                  </button>

                  {/* Dropdown menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50">
                      <Link
                        href="/Siswa/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        <User size={16} />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <LogOut size={16} />
                        Keluar
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Not logged in: show login and register buttons
                <>
                  <Link
                    href="/login"
                    className="hidden sm:block text-sm font-bold text-slate-600 px-4 py-2 hover:text-indigo-600"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/Siswa/dashboard"
                    className="bg-indigo-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-full text-xs md:text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
                  >
                    <PlusCircle size={18} className="hidden xs:block" />
                    Laporkan
                  </Link>
                </>
              )}

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden p-2 text-slate-600"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 p-4 space-y-4 shadow-xl">
            <Link href="/home" className="block py-2 font-bold text-slate-700">Beranda</Link>
            <Link href="#" className="block py-2 font-bold text-slate-700">Cari Barang</Link>
            <Link href="#" className="block py-2 font-bold text-slate-700">Tentang</Link>
            {!auth.user && (
              <Link
                href="/login"
                className="w-full text-center py-3 font-bold text-indigo-600 border border-indigo-100 rounded-xl"
              >
                Masuk
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-16 md:pt-48 md:pb-32 px-4">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-[10px] md:text-xs font-bold tracking-widest text-indigo-600 uppercase bg-indigo-50 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            Platform Terpercaya
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">
            Menemukan Barang <br className="hidden md:block" />
            <span className="text-indigo-600">Jadi Lebih Mudah.</span>
          </h1>
          <p className="max-w-xl mx-auto text-sm md:text-lg text-slate-500 mb-10 leading-relaxed">
            Komunitas yang membantu Anda menemukan barang yang hilang atau mengembalikan barang yang ditemukan.
          </p>

          {/* Search Bar - Responsive */}
          <div className="max-w-4xl mx-auto bg-white p-2 md:p-3 rounded-2xl md:rounded-3xl shadow-2xl border border-slate-100 flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center px-4 gap-3 py-3 md:py-0 border-b md:border-b-0 md:border-r border-slate-100">
              <Search className="text-indigo-600" size={20} />
              <input type="text" placeholder="Nama barang..." className="w-full text-slate-700 outline-none text-sm md:text-base" />
            </div>
            <div className="flex-1 flex items-center px-4 gap-3 py-3 md:py-0">
              <MapPin className="text-slate-400" size={20} />
              <input type="text" placeholder="Lokasi..." className="w-full text-slate-700 outline-none text-sm md:text-base" />
            </div>
            <button className="bg-indigo-600 text-white w-full md:w-auto px-10 py-4 rounded-xl md:rounded-2xl font-bold hover:bg-indigo-700 transition-all">
              Cari
            </button>
          </div>
        </div>

        {/* Background Decor */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 opacity-20 pointer-events-none">
          <div className="absolute top-20 left-10 w-48 md:w-96 h-48 md:h-96 bg-indigo-300 rounded-full blur-[100px] md:blur-[150px]"></div>
          <div className="absolute bottom-10 right-10 w-48 md:w-96 h-48 md:h-96 bg-blue-300 rounded-full blur-[100px] md:blur-[150px]"></div>
        </div>
      </header>

      {/* Main Content Area */}
      <section className="py-16 md:py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Laporan Terbaru</h2>
              <p className="text-slate-500 mt-2 text-sm md:text-base">Mungkin salah satu barang ini milik Anda?</p>
            </div>
            
            {/* Scrollable Filters for Mobile */}
            <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 no-scrollbar">
              {['semua', 'hilang', 'dititipkan'].map((f) => (
                <button 
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`whitespace-nowrap px-6 py-2 rounded-full text-xs md:text-sm font-bold capitalize transition-all border ${
                    activeFilter === f 
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100" 
                    : "bg-white text-slate-500 border-slate-200 hover:border-indigo-600"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Layout: 1 col (mobile), 2 col (tablet), 4 col (desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {MOCK_ITEMS.filter(i => activeFilter === "semua" || i.status === activeFilter).map((item) => (
              <div key={item.id} className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-[4/3] md:aspect-square overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 left-4">
                    <StatusBadge status={item.status} />
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{item.category}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 line-clamp-1">{item.name}</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                      <MapPin size={14} className="text-slate-400" /> {item.location}
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                      <Calendar size={14} className="text-slate-400" /> {item.date}
                    </div>
                  </div>

                  <button className="w-full py-3 rounded-2xl bg-slate-50 text-xs font-bold text-slate-800 hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2 group-btn">
                    Lihat Detail <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 md:mt-20 text-center">
            <button className="px-10 py-4 bg-white border border-slate-200 rounded-full font-bold text-slate-600 hover:text-indigo-600 hover:border-indigo-600 transition-all text-sm shadow-sm">
              Muat Lebih Banyak
            </button>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-16">Kenapa Pakai Kembaliin?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <FeatureCard icon={<ShieldCheck size={32}/>} title="Aman & Terverifikasi" desc="Laporan diperiksa oleh moderator untuk menghindari penipuan." />
            <FeatureCard icon={<Globe size={32}/>} title="Cakupan Luas" desc="Barangmu bisa ditemukan oleh siapa saja di seluruh penjuru daerah." />
            <FeatureCard icon={<Package size={32}/>} title="100% Gratis" desc="Misi kami adalah membantu sesama mengembalikan hak miliknya." />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div className="sm:col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 font-bold text-2xl text-white mb-6">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">K</div>
                Kembaliin
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                Platform komunitas sosial untuk membantu sesama menemukan barang yang hilang dengan aman dan mudah.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-slate-500">Tautan</h4>
              <ul className="space-y-4 text-slate-400 text-sm font-medium">
                <li><a href="#" className="hover:text-white transition-colors">Cari Barang</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Laporkan</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Bantuan</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-slate-500">Hukum</h4>
              <ul className="space-y-4 text-slate-400 text-sm font-medium">
                <li><a href="#" className="hover:text-white transition-colors">Privasi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Ketentuan</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-slate-500">Social</h4>
              <div className="flex gap-4">
                <a href="#" className="p-3 bg-slate-800 rounded-full hover:bg-indigo-600 transition-all"><Facebook size={18}/></a>
                <a href="#" className="p-3 bg-slate-800 rounded-full hover:bg-indigo-600 transition-all"><Twitter size={18}/></a>
                <a href="#" className="p-3 bg-slate-800 rounded-full hover:bg-indigo-600 transition-all"><Instagram size={18}/></a>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-10 text-center text-slate-500 text-[10px] md:text-xs">
            © 2024 Kembaliin Indonesia. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

// Sub-components
// Keep the helper components (StatusBadge, FeatureCard) as they are
function StatusBadge({ status }: { status: string }) {
  const isLost = status === "hilang";
  return (
    <span className={`px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-extrabold uppercase tracking-widest shadow-xl border ${
      isLost ? "bg-red-500 text-white border-red-400" : "bg-emerald-500 text-white border-emerald-400"
    }`}>
      {isLost ? "HILANG" : "DITEMUKAN"}
    </span>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 md:p-12 rounded-[2.5rem] bg-white border border-slate-100 hover:border-indigo-100 transition-all hover:shadow-2xl hover:shadow-indigo-50/50 text-center group">
      <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
        <div className="text-indigo-600">{icon}</div>
      </div>
      <h3 className="text-lg md:text-xl font-bold mb-4">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}