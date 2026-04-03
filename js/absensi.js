// ==========================================
// File: js/absensi.js
// Deskripsi: Logika Antarmuka Kamera & Presensi
// ==========================================

const Absensi = {
    coords: null,
    watchId: null,
    timerInterval: null,

    async render() {
        const content = document.getElementById('page-content');
        const type = sessionStorage.getItem('attendance_type') || 'masuk';
        
        // 1. Render Struktur UI (iOS Glassmorphism Style)
        content.innerHTML = `
            <div class="space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div class="flex items-center justify-between px-2">
                    <div>
                        <h2 class="text-2xl font-black text-slate-900 tracking-tight capitalize">Presensi ${type}</h2>
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verifikasi Wajah & Lokasi</p>
                    </div>
                    <span id="gps-status" class="text-[10px] bg-red-100 text-red-700 px-3 py-2 rounded-2xl font-black shadow-sm border border-red-200 transition-all duration-500">
                        GPS: MENCARI...
                    </span>
                </div>
                
                <div class="relative overflow-hidden rounded-[40px] bg-slate-950 aspect-[3/4] shadow-2xl border-[6px] border-white ios-card">
                    
                    <video id="video-feed" autoplay muted playsinline class="w-full h-full object-cover transform -scale-x-100"></video>
                    
                    <div class="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none z-10">
                        
                        <div class="flex justify-between items-start">
                            <div class="glass px-3 py-1.5 rounded-full text-blue-600 flex items-center gap-2">
                                <div class="w-2 h-2 bg-blue-600 rounded-full animate-ping"></div>
                                <span class="text-[10px] font-black uppercase tracking-wider">Live AI Scan</span>
                            </div>
                        </div>

                        <div class="relative flex-1 flex items-center justify-center m-6">
                            <div class="absolute inset-0 border-[2px] border-white/30 rounded-[35px]"></div>
                            <div class="absolute top-0 left-4 right-4 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-80 animate-scan-line"></div>
                        </div>

                        <div class="glass-dark p-5 rounded-[28px] space-y-3 text-white/90 backdrop-blur-2xl border border-white/10">
                            <div class="flex items-center gap-3">
                                <div class="p-2 bg-white/10 rounded-xl">
                                    <i data-lucide="clock" class="w-4 h-4 text-blue-300"></i>
                                </div>
                                <div class="flex-1">
                                    <p id="clock-overlay" class="text-base font-black tracking-tight leading-none">--:--:--</p>
                                    <p id="date-overlay" class="text-[9px] text-white/50 font-bold mt-1">---</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-3 pt-3 border-t border-white/5">
                                <div class="p-2 bg-white/10 rounded-xl">
                                    <i data-lucide="map-pin" class="w-4 h-4 text-emerald-300"></i>
                                </div>
                                <p id="location-overlay" class="text-[10px] text-white/60 font-mono leading-tight flex-1 italic">
                                    Menunggu sinyal satelit...
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="px-2">
                    <button onclick="Absensi.prosesAbsen()" id="btn-absen" disabled 
                        class="w-full py-5 bg-slate-200 text-slate-500 rounded-[30px] font-black shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70">
                        <span class="animate-pulse">Menyiapkan AI...</span>
                    </button>
                </div>
            </div>
        `;

        lucide.createIcons();
        
        // 2. Inisialisasi Sistem
        const videoReady = await FaceRec.startCamera('video-feed');
        const aiReady = await FaceRec.loadModels();

        if (videoReady && aiReady) {
            const btn = document.getElementById('btn-absen');
            btn.disabled = false;
            btn.classList.replace('bg-slate-200', 'bg-blue-600');
            btn.classList.replace('text-slate-500', 'text-white');
            btn.innerHTML = `<i data-lucide="fingerprint" class="w-6 h-6"></i> Konfirmasi Presensi`;
            lucide.createIcons();
        }

        this.startGpsTracking();
        this.startOverlayClock();
    },

    startOverlayClock() {
        const clockEl = document.getElementById('clock-overlay');
        const dateEl = document.getElementById('date-overlay');
        
        if (this.timerInterval) clearInterval(this.timerInterval);

        this.timerInterval = setInterval(() => {
            if (!clockEl) return;
            const now = new Date();
            clockEl.innerText = now.toLocaleTimeString('id-ID', { hour12: false });
            dateEl.innerText = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        }, 1000);
    },

    startGpsTracking() {
        if (!navigator.geolocation) return;

        this.watchId = navigator.geolocation.watchPosition(
            (pos) => {
                const lat = pos.coords.latitude.toFixed(6);
                const lng = pos.coords.longitude.toFixed(6);
                this.coords = { lat, lng };
                
                const status = document.getElementById('gps-status');
                const locText = document.getElementById('location-overlay');

                if(status) {
                    status.innerText = "GPS: TERKUNCI";
                    status.className = "text-[10px] bg-green-100 text-green-700 px-3 py-2 rounded-2xl font-black shadow-sm border border-green-200";
                }
                if(locText) locText.innerText = `${lat}, ${lng}`;
            },
            (err) => {
                console.error(err);
                UI.showToast("GPS Gagal: Pastikan lokasi aktif", "error");
            },
            { enableHighAccuracy: true, timeout: 15000 }
        );
    },

    async prosesAbsen() {
        const btn = document.getElementById('btn-absen');
        const video = document.getElementById('video-feed');
        const type = sessionStorage.getItem('attendance_type') || 'masuk';
        const user = Auth.getUser();

        if (!this.coords) {
            UI.showToast("Menunggu lokasi GPS...", "error");
            return;
        }

        // Loading State
        btn.disabled = true;
        btn.innerHTML = `<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Menganalisa Wajah...`;

        try {
            // 1. Capture & Deteksi Wajah
            const foto = await FaceRec.captureAndVerify(video);

            if (!foto) {
                UI.showToast("Wajah tidak terdeteksi!", "error");
                this.resetButton(btn);
                return;
            }

            // 2. Kirim ke Backend
            const payload = {
                id_user: user.id_user,
                type: type,
                lat: this.coords.lat,
                lng: this.coords.lng,
                foto: foto,
                device_id: "BROWSER_MOBILE"
            };

            const res = await BASE_API.post('absen', payload);

            if (res.status === 'success') {
                UI.showToast(res.message, 'success');
                this.cleanup();
                sessionStorage.removeItem('attendance_type');
                setTimeout(() => { window.location.hash = '#dashboard'; }, 2000);
            } else {
                UI.showToast(res.message, 'error');
                this.resetButton(btn);
            }

        } catch (error) {
            UI.showToast("Kesalahan server/koneksi", "error");
            this.resetButton(btn);
        }
    },

    resetButton(btn) {
        btn.disabled = false;
        btn.innerHTML = `<i data-lucide="fingerprint" class="w-6 h-6"></i> Konfirmasi Presensi`;
        lucide.createIcons();
    },

    cleanup() {
        if (this.watchId) navigator.geolocation.clearWatch(this.watchId);
        if (this.timerInterval) clearInterval(this.timerInterval);
        
        const video = document.getElementById('video-feed');
        if (video && video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
        }
    }
};
