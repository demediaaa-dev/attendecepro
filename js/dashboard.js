// js/dashboard.js
const Dashboard = {
    async render() {
        const user = Auth.getUser();
        const content = document.getElementById('page-content');
        
        // Tampilkan Loading State
        content.innerHTML = `<div class="p-10 text-center animate-pulse text-slate-400">Memuat data...</div>`;

        try {
            // Ambil data presensi user hari ini dari API
            const res = await BASE_API.get(`get_today_presence?id_user=${user.id_user}`);
            const data = res.data || {}; // Ekspektasi: { masuk: "08:00", pulang: null }

            content.innerHTML = `
                <div class="space-y-6">
                    <div class="flex items-center gap-4 px-2">
                        <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                            ${user.nama.charAt(0)}
                        </div>
                        <div>
                            <p class="text-xs text-slate-500 font-medium">Selamat Datang,</p>
                            <h2 class="text-lg font-extrabold text-slate-900">${user.nama}</h2>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
                            <p class="text-[10px] font-bold text-slate-400 uppercase mb-1">Masuk</p>
                            <p class="text-lg font-black text-slate-800">${data.masuk || '--:--'}</p>
                        </div>
                        <div class="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
                            <p class="text-[10px] font-bold text-slate-400 uppercase mb-1">Pulang</p>
                            <p class="text-lg font-black text-slate-800">${data.pulang || '--:--'}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <button onclick="Dashboard.goToAbsen('${data.masuk ? 'pulang' : 'masuk'}')" 
                            class="col-span-2 p-6 ${data.pulang ? 'bg-slate-200' : 'bg-blue-600'} text-white rounded-[32px] shadow-xl shadow-blue-100 flex items-center justify-between overflow-hidden relative"
                            ${data.pulang ? 'disabled' : ''}>
                            <div class="z-10">
                                <p class="text-xs font-bold opacity-80">${data.masuk ? 'Sudah Masuk' : 'Belum Presensi'}</p>
                                <h3 class="text-xl font-black">${data.pulang ? 'Sudah Pulang' : (data.masuk ? 'Presensi Pulang' : 'Presensi Masuk')}</h3>
                            </div>
                            <i data-lucide="fingerprint" class="w-12 h-12 opacity-20 -mr-2"></i>
                        </button>
                    </div>

                    <button onclick="Auth.logout()" class="w-full py-4 flex items-center justify-center gap-2 text-red-500 font-bold bg-red-50 rounded-2xl mt-4">
                        <i data-lucide="log-out" class="w-5 h-5"></i>
                        Keluar Aplikasi
                    </button>
                </div>
            `;
            lucide.createIcons();
        } catch (e) {
            UI.showToast("Gagal memuat riwayat", "error");
        }
    },

    goToAbsen(type) {
        // Simpan tipe absen (masuk/pulang) ke session agar halaman absen tahu apa yang harus diproses
        sessionStorage.setItem('attendance_type', type);
        window.location.hash = '#presensi';
    }
};
