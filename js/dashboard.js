const Dashboard = {
    async render() {
        const user = Auth.getUser();
        const content = document.getElementById('page-content');
        content.innerHTML = `<div class="p-20 text-center animate-pulse text-slate-400 font-medium">Sinkronisasi data...</div>`;

        try {
            // Memanggil doGet action=get_today_presence
            const res = await fetch(`${API_URL}?action=get_today_presence&id_user=${user.id_user}`).then(r => r.json());
            const status = res.data || { masuk: null, pulang: null };

            content.innerHTML = `
                <div class="space-y-6 animate-in fade-in duration-500">
                    <div class="flex items-center justify-between px-2">
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">
                                ${user.nama.charAt(0)}
                            </div>
                            <div>
                                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Karyawan</p>
                                <h2 class="text-lg font-black text-slate-800 leading-none">${user.nama}</h2>
                            </div>
                        </div>
                        <button onclick="Auth.logout()" class="p-3 bg-red-50 text-red-500 rounded-2xl active:scale-90 transition-all">
                            <i data-lucide="log-out" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="glass ios-card p-5">
                            <p class="text-[10px] font-bold text-slate-400 uppercase mb-2">Jam Masuk</p>
                            <h3 class="text-xl font-black ${status.masuk ? 'text-emerald-600' : 'text-slate-300'}">${status.masuk || '--:--'}</h3>
                        </div>
                        <div class="glass ios-card p-5">
                            <p class="text-[10px] font-bold text-slate-400 uppercase mb-2">Jam Pulang</p>
                            <h3 class="text-xl font-black ${status.pulang ? 'text-emerald-600' : 'text-slate-300'}">${status.pulang || '--:--'}</h3>
                        </div>
                    </div>

                    <div class="pt-4">
                        ${this.renderActionButton(status)}
                    </div>
                </div>
            `;
            lucide.createIcons();
        } catch (e) {
            UI.showToast("Gagal memuat data", "error");
        }
    },

    renderActionButton(status) {
        if (status.masuk && status.pulang) {
            return `
                <div class="w-full p-8 bg-slate-100 rounded-[32px] text-center border-2 border-dashed border-slate-200">
                    <i data-lucide="check-circle" class="w-12 h-12 text-slate-300 mx-auto mb-3"></i>
                    <p class="text-slate-500 font-bold">Tugas Selesai Hari Ini</p>
                </div>`;
        }

        const type = !status.masuk ? 'masuk' : 'pulang';
        const color = type === 'masuk' ? 'bg-blue-600 shadow-blue-200' : 'bg-emerald-600 shadow-emerald-200';

        return `
            <button onclick="Dashboard.goToAbsen('${type}')" class="w-full p-6 ${color} text-white rounded-[32px] shadow-2xl flex items-center justify-between active:scale-95 transition-all">
                <div class="text-left">
                    <p class="text-xs font-bold opacity-70">Klik untuk</p>
                    <h3 class="text-2xl font-black capitalize">Presensi ${type}</h3>
                </div>
                <div class="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                    <i data-lucide="fingerprint" class="w-8 h-8"></i>
                </div>
            </button>`;
    },

    goToAbsen(type) {
        sessionStorage.setItem('attendance_type', type);
        window.location.hash = '#presensi';
    }
};
