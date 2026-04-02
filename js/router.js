// js/router.js
const routes = {
    'login': { title: 'Login', type: 'full' },
    'dashboard': { title: 'Dashboard', type: 'user' },
    'presensi': { title: 'Presensi Wajah', type: 'user' },
    'admin-dashboard': { title: 'Admin Panel', type: 'admin' },
    // ... rute lainnya
};

const Router = {
    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute();
    },

    handleRoute() {
        const hash = window.location.hash.replace('#', '') || 'login';
        
        // --- TAMBAHKAN VALIDASI INI ---
        if (!Auth.checkAccess(hash)) return;
        // ------------------------------

        const route = routes[hash];
        if (!route) {
            window.location.hash = '#login';
            return;
        }

        this.renderLayout(route, hash);
    },

    renderLayout(route, hash) {
        const app = document.getElementById('app');
        
        // Cek login status (dari localStorage)
        const user = JSON.parse(localStorage.getItem('user_session'));
        if (!user && hash !== 'login') {
            window.location.hash = '#login';
            return;
        }

        // Inject template berdasarkan role
        if (route.type === 'user') {
            app.innerHTML = this.templateMobile(hash);
        } else if (route.type === 'admin') {
            app.innerHTML = this.templateAdmin(hash);
        } else {
            app.innerHTML = `<div id="page-content"></div>`; // Login page
        }
        
        // Load konten spesifik halaman
        this.loadPageContent(hash);
    },

    templateMobile(hash) {
        return `
            <div class="max-w-md mx-auto bg-white min-h-screen pb-24 relative">
                <div id="page-content" class="p-6"></div>
                <nav class="fixed bottom-0 left-0 right-0 max-w-md mx-auto glass border-t border-white/50 px-6 py-3 flex justify-between items-center z-50">
                    <button onclick="location.hash='#dashboard'" class="flex flex-col items-center text-slate-400">
                        <i data-lucide="home" class="w-6 h-6"></i>
                        <span class="text-[10px] mt-1">Home</span>
                    </button>
                    <div class="relative -top-8">
                        <button onclick="location.hash='#presensi'" class="bg-blue-600 text-white p-4 rounded-full shadow-lg shadow-blue-200 border-4 border-white active:scale-95 transition-transform">
                            <i data-lucide="camera" class="w-8 h-8"></i>
                        </button>
                    </div>
                    <button onclick="location.hash='#settings'" class="flex flex-col items-center text-slate-400">
                        <i data-lucide="user" class="w-6 h-6"></i>
                        <span class="text-[10px] mt-1">Profil</span>
                    </button>
                </nav>
            </div>
        `;
    },

   
    templateAdmin(hash) {
        return `
            <div class="flex min-h-screen bg-slate-100">
                <aside id="sidebar" class="fixed md:relative z-50 h-screen w-64 glass-dark text-white transition-all duration-300 -left-full md:left-0">
                    <div class="p-6 flex items-center justify-between">
                        <span class="font-bold text-xl tracking-tight">SiPanda <span class="text-blue-400">Admin</span></span>
                        <button onclick="App.toggleSidebar()" class="md:hidden text-white">
                            <i data-lucide="x"></i>
                        </button>
                    </div>
                    
                    <nav class="mt-6 px-4 space-y-2">
                        <a href="#admin-dashboard" class="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/10 transition-all ${hash === 'admin-dashboard' ? 'bg-blue-600 shadow-lg shadow-blue-900/20' : ''}">
                            <i data-lucide="layout-dashboard" class="w-5 h-5"></i>
                            <span class="text-sm font-medium">Dashboard Rekap</span>
                        </a>
                        <a href="#admin-pegawai" class="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/10 transition-all">
                            <i data-lucide="users" class="w-5 h-5"></i>
                            <span class="text-sm font-medium">Data Pegawai</span>
                        </a>
                        <a href="#admin-shift" class="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/10 transition-all">
                            <i data-lucide="map-pin" class="w-5 h-5"></i>
                            <span class="text-sm font-medium">Titik Lokasi</span>
                        </a>
                        <div class="pt-10">
                            <button onclick="Auth.logout()" class="flex items-center gap-4 p-3 w-full rounded-2xl text-red-400 hover:bg-red-500/10 transition-all">
                                <i data-lucide="log-out" class="w-5 h-5"></i>
                                <span class="text-sm font-medium">Keluar</span>
                            </button>
                        </div>
                    </nav>
                </aside>

                <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <header class="h-16 glass border-b border-slate-200 flex items-center px-8 justify-between">
                        <button onclick="App.toggleSidebar()" class="p-2 hover:bg-slate-100 rounded-xl">
                            <i data-lucide="menu" class="text-slate-600"></i>
                        </button>
                        <div class="flex items-center gap-3">
                            <div class="text-right hidden sm:block">
                                <p class="text-xs font-bold text-slate-800">Administrator</p>
                                <p class="text-[10px] text-slate-500">Super Admin Mode</p>
                            </div>
                            <div class="w-10 h-10 bg-slate-800 rounded-full border-2 border-white shadow-sm"></div>
                        </div>
                    </header>
                    
                    <main class="flex-1 overflow-x-hidden overflow-y-auto p-8">
                        <div id="page-content" class="max-w-6xl mx-auto"></div>
                    </main>
                </div>
            </div>
        `;
    },

    loadPageContent(hash) {
        if (hash === 'login') Login.render();
        else if (hash === 'dashboard') Dashboard.render();
        else if (hash === 'presensi') Absensi.render();
        else if (hash === 'admin-dashboard') AdminDashboard.render();
        
        lucide.createIcons(); // Selalu jalankan ini setelah render
    }
};