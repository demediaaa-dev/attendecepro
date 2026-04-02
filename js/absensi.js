// ==========================================
// File: js/absensi.js (Presensi UI & Logic)
// ==========================================

const Absensi = {
    coords: null,
    watchId: null,
    timerInterval: null, // Untuk mengupdate clock-overlay

    async render() {
        const content = document.getElementById('page-content');
        
        // Render Struktur HTML
        content.innerHTML = `
            <div class="space-y-6 pb-24">
                <div class="flex items-center justify-between px-2">
                    <h2 class="text-xl font-extrabold text-slate-900 tracking-tighter">Presensi Wajah</h2>
                    <span id="gps-status" class="text-[10px] bg-red-100 text-red-700 px-3 py-1.5 rounded-full font-extrabold shadow-sm transition-all duration-500">GPS: MENCARI...</span>
                </div>
                
                <div class="relative overflow-hidden rounded-[36px] bg-slate-950 aspect-[3/4] shadow-2xl border-4 border-white ios-card">
                    
                    <video id="video-feed" autoplay muted playsinline class="w-full h-full object-cover transform -scale-x-100"></video>
                    
                    <div class="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none z-10">
                        
                        <div class="flex justify-between items-center">
                            <div class="glass px-3 py-1 rounded-full text-blue-600">
                                <i data-lucide="scan-face" class="w-4 h-4 inline-block mr-1"></i>
                                <span class="text-[10px] font-bold uppercase tracking-wider">AI Face Scanner</span>
                            </div>
                        </div>

                        <div class="relative flex-1 flex items-center justify-center m-8">
                            <div class="absolute inset-0 border-[2.5px] border-white/40 rounded-[30px]"></div>
                            
                            <div class="absolute top-0 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-80 animate-scan-line"></div>
                        </div>

                        <div class="glass-dark ios-card p-4 space-y-2 text-white/90">
                            <div class="flex items-center gap-2.5">
                                <i data-lucide="clock" class="w-4 h-4 text-blue-300"></i>
                                <div class="flex-1">
                                    <p id="clock-overlay" class="text-sm font-extrabold tracking-tight">--:--:--</p>
                                    <p id="date-overlay" class="text-[9px] text-white/60 font-medium">-- --- ----</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-2.5 pt-1 border-t border-white/10">
                                <i data-lucide="map-pin" class="w-4 h-4 text-emerald-300"></i>
                                <p id="location-overlay" class="text-[10px] text-white/70 font-mono tracking-tight flex-1">Mencari koordinat GPS...</p>
                            </div>
                        </div>
                    </div>
                </div>

                <button onclick="Absensi.prosesAbsen('masuk')" id="btn-absen" class="w-full py-4.5 bg-blue-600 text-white rounded-3xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all flex items-center justify-center gap-3">
                    <i data-lucide="log-in" class="w-5 h-5"></i>
                    Klik untuk Absen Masuk
                </button>
            </div>
        `;

        lucide.createIcons(); // Render ikon Lucide
        
        // Mulai Sistem
        await FaceRec.loadModels();
        // Memanggil startCamera tanpa konfigurasi ideal agar browser mobile menggunakan setting default (tidak terlalu zoom)
        FaceRec.startCamera('video-feed');
        
        this.startGpsTracking();
        this.startOverlayClock();
    },

    // Fungsi untuk mengupdate Jam & Tanggal di Overlay Kamera setiap detik
    startOverlayClock() {
        const clockEl = document.getElementById('clock-overlay');
        const dateEl = document.getElementById('date-overlay');
        
        if (this.timerInterval) clearInterval(this.timerInterval);

        this.timerInterval = setInterval(() => {
            if (!clockEl || !dateEl) return;
            const now = new Date();
            clockEl.innerText = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            dateEl.innerText = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        }, 1000);
    },

    startGpsTracking() {
        if (!("geolocation" in navigator)) {
            alert("Browser Anda tidak mendukung GPS.");
            return;
        }

        if (this.watchId) navigator.geolocation.clearWatch(this.watchId);

        const locationEl = document.getElementById('location-overlay');

        this.watchId = navigator.geolocation.watchPosition(
            (pos) => {
                const lat = pos.coords.latitude.toFixed(6);
                const lng = pos.coords.longitude.toFixed(6);
                this.coords = { lat, lng };
                
                // Update Status Bar
                const status = document.getElementById('gps-status');
                if(status) {
                    status.innerText = "GPS: TERKUNCI";
                    status.className = "text-[10px] bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-extrabold shadow-sm";
                }

                // Update Teks di Overlay Kamera
                if(locationEl) {
                    locationEl.innerText = `LAT: ${lat}, LNG: ${lng}`;
                }
            },
            (err) => {
                console.error("GPS Error:", err);
                const status = document.getElementById('gps-status');
                if(status) {
                    status.innerText = "GPS: ERROR";
                    status.className = "text-[10px] bg-red-100 text-red-700 px-3 py-1.5 rounded-full font-extrabold shadow-sm";
                }
                if(locationEl) {
                    locationEl.innerText = "Gagal mendapatkan lokasi. Cek izin GPS.";
                }
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
    },

    async prosesAbsen(type) {
        const btn = document.getElementById('btn-absen');
        const video = document.getElementById('video-feed');
        
        if (!this.coords) {
            alert("Harap tunggu hingga GPS terkunci (Lampu Hijau)!");
            return;
        }

        btn.disabled = true;
        btn.innerHTML = `<div class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div> Memproses Wajah...`;

        // Capture foto
        const foto = await FaceRec.captureAndVerify(video);

        if (!foto) {
            alert("Wajah tidak terdeteksi! Pastikan wajah terlihat jelas di bingkai.");
            btn.disabled = false;
            btn.innerHTML = `<i data-lucide="log-in" class="w-5 h-5"></i> Klik untuk Absen Masuk`;
            lucide.createIcons();
            return;
        }

        // Siapkan Data
        const user = Auth.getUser();
        const payload = {
            id_user: user.id_user,
            type: type, // "masuk" atau "pulang"
            lat: this.coords.lat,
            lng: this.coords.lng,
            foto: foto, // Base64 image
            device_id: localStorage.getItem('device_id'),
            // Tambahkan data waktu saat absen diklik untuk validasi di backend
            timestamp_client: new Date().toISOString() 
        };

        try {
            const res = await BASE_API.post('absen', payload);
            alert(res.message);
            
            if(res.status === 'success') {
                this.cleanup();
                window.location.hash = '#dashboard';
            } else {
                this.resetButton(btn, type);
            }
        } catch (error) {
            alert("Terjadi kesalahan koneksi ke server.");
            this.resetButton(btn, type);
        }
    },

    // Fungsi pembantu untuk mereset tombol jika gagal
    resetButton(btn, type) {
        btn.disabled = false;
        btn.innerHTML = `<i data-lucide="log-in" class="w-5 h-5"></i> Klik untuk Absen Masuk`;
        lucide.createIcons();
    },

    // Fungsi bersih-bersih saat meninggalkan halaman
    cleanup() {
        if (this.watchId) navigator.geolocation.clearWatch(this.watchId);
        if (this.timerInterval) clearInterval(this.timerInterval);
        // Hentikan stream kamera agar lampu kamera mati
        const video = document.getElementById('video-feed');
        if (video && video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
        }
    }
};
