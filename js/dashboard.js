// js/dashboard.js
const Dashboard = {
    async render() {
        const user = JSON.parse(localStorage.getItem('user_session'));
        const content = document.getElementById('page-content');
        
        content.innerHTML = `
            <div class="space-y-6">
                <div class="flex items-center gap-4 p-4 glass ios-card shadow-sm">
                    <div class="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-xl shadow-inner">
                        ${user.nama.charAt(0)}
                    </div>
                    <div>
                        <p class="text-xs text-slate-500 font-medium">Selamat Bekerja,</p>
                        <h2 class="font-extrabold text-lg text-slate-800 tracking-tight">${user.nama}</h2>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="glass ios-card p-5 text-center">
                        <p class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Masuk</p>
                        <h3 id="clock-in" class="text-xl font-bold text-slate-700">--:--</h3>
                    </div>
                    <div class="glass ios-card p-5 text-center">
                        <p class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Pulang</p>
                        <h3 id="clock-out" class="text-xl font-bold text-slate-700">--:--</h3>
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-4">
                    <button onclick="location.hash='#jurnal'" class="flex flex-col items-center gap-2 active:scale-90 transition-transform">
                        <div class="w-14 h-14 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center shadow-sm border border-white">
                            <i data-lucide="book-open" class="w-7 h-7"></i>
                        </div>
                        <span class="text-[11px] font-semibold text-slate-600">Jurnal</span>
                    </button>
                    
                    <button onclick="location.hash='#cuti'" class="flex flex-col items-center gap-2 active:scale-90 transition-transform">
                        <div class="w-14 h-14 bg-purple-100 text-purple-600 rounded-3xl flex items-center justify-center shadow-sm border border-white">
                            <i data-lucide="calendar-days" class="w-7 h-7"></i>
                        </div>
                        <span class="text-[11px] font-semibold text-slate-600">Cuti/Izin</span>
                    </button>
                    
                    <button onclick="location.hash='#history'" class="flex flex-col items-center gap-2 active:scale-90 transition-transform">
                        <div class="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center shadow-sm border border-white">
                            <i data-lucide="history" class="w-7 h-7"></i>
                        </div>
                        <span class="text-[11px] font-semibold text-slate-600">Riwayat</span>
                    </button>
                </div>
            </div>
        `;
        lucide.createIcons();
    }
};