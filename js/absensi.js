// js/absensi.js
const Absensi = {
    coords: null,
    watchId: null,

    async render() {
        const content = document.getElementById('page-content');
        content.innerHTML = `
            <div class="space-y-6 pb-24">
                <div class="flex items-center justify-between px-2">
                    <h2 class="text-xl font-bold text-slate-800 tracking-tight">Presensi Wajah</h2>
                    <span id="gps-status" class="text-[10px] bg-red-100 text-red-600 px-3 py-1.5 rounded-full font-extrabold shadow-sm transition-all duration-500">GPS: MENCARI...</span>
                </div>
                
                <div class="relative overflow-hidden rounded-[32px] bg-slate-900 aspect-[3/4] shadow-2xl border-4 border-white">
                    <video id="video-feed" autoplay muted playsinline class="w-full h-full object-cover transform -scale-x-100"></video>
                    
                    <div class="absolute inset-0 border-[2px] border-blue-400/30 rounded-[28px] m-8 pointer-events-none animate-pulse"></div>
                    <div class="absolute bottom-4 left-0 right-0 text-center">
                        <p class="text-[10px] text-white/50 font-medium">Posisikan wajah di tengah bingkai</p>
                    </div>
                </div>

                <button onclick="Absensi.prosesAbsen('masuk')" id="btn-absen" class="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all">
                    Klik untuk Absen Masuk
                </button>
            </div>
        `;

        await FaceRec.loadModels();
        FaceRec.startCamera('video-feed');
        this.startGpsTracking();
    },

    startGpsTracking() {
        if (!("geolocation" in navigator)) {
            alert("Browser Anda tidak mendukung GPS.");
            return;
        }

        // Hapus tracking lama jika ada
        if (this.watchId) navigator.geolocation.clearWatch(this.watchId);

        this.watchId = navigator.geolocation.watchPosition(
            (pos) => {
                this.coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                const status = document.getElementById('gps-status');
                if(status) {
                    status.innerText = "GPS: TERKUNCI";
                    status.className = "text-[10px] bg-green-100 text-green-600 px-3 py-1.5 rounded-full font-extrabold shadow-sm";
                }
            },
            (err) => {
                console.error("GPS Error:", err);
                const status = document.getElementById('gps-status');
                if(status) status.innerText = "GPS: ERROR";
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    },

    async prosesAbsen(type) {
        const btn = document.getElementById('btn-absen');
        const video = document.getElementById('video-feed');
        
        if (!this.coords) {
            alert("Harap tunggu hingga GPS terkunci!");
            return;
        }

        btn.disabled = true;
        btn.innerText = "Memproses Wajah...";

        const foto = await FaceRec.captureAndVerify(video);

        if (!foto) {
            alert("Wajah tidak terdeteksi! Pastikan pencahayaan cukup.");
            btn.disabled = false;
            btn.innerText = "Klik untuk Absen " + type.charAt(0).toUpperCase() + type.slice(1);
            return;
        }

        const user = Auth.getUser(); // Menggunakan Auth.js yang sudah kita buat
        const payload = {
            id_user: user.id_user,
            type: type,
            lat: this.coords.lat,
            lng: this.coords.lng,
            foto: foto,
            device_id: localStorage.getItem('device_id')
        };

        const res = await BASE_API.post('absen', payload);
        alert(res.message);
        
        if(res.status === 'success') {
            if (this.watchId) navigator.geolocation.clearWatch(this.watchId);
            window.location.hash = '#dashboard';
        } else {
            btn.disabled = false;
            btn.innerText = "Klik untuk Absen " + type.charAt(0).toUpperCase() + type.slice(1);
        }
    }
};
