// js/absensi.js
const Absensi = {
    async render() {
        const content = document.getElementById('page-content');
        content.innerHTML = `
            <div class="space-y-6">
                <div class="flex items-center justify-between">
                    <h2 class="text-xl font-bold">Presensi Wajah</h2>
                    <span id="gps-status" class="text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold">GPS: MENCARI...</span>
                </div>
                
                <div class="relative overflow-hidden rounded-3xl bg-black aspect-[3/4] shadow-2xl">
                    <video id="video-feed" autoplay muted playsinline class="w-full h-full object-cover"></video>
                    <div id="face-overlay" class="absolute inset-0 border-[3px] border-blue-400/50 rounded-3xl m-10 pointer-events-none animate-pulse"></div>
                </div>

                <button onclick="Absensi.prosesAbsen('masuk')" id="btn-absen" class="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg disabled:opacity-50">
                    Klik untuk Absen Masuk
                </button>
            </div>
        `;

        await FaceRec.loadModels();
        FaceRec.startCamera('video-feed');
        this.watchLocation();
    },

    coords: null,

    watchLocation() {
        if ("geolocation" in navigator) {
            navigator.geolocation.watchPosition(
                (pos) => {
                    this.coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                    const status = document.getElementById('gps-status');
                    if(status) {
                        status.innerText = "GPS: TERKUNCI";
                        status.className = "text-[10px] bg-green-100 text-green-600 px-2 py-1 rounded-full font-bold";
                    }
                },
                (err) => alert("Harap aktifkan GPS Anda!"),
                { enableHighAccuracy: true }
            );
        }
    },

    async prosesAbsen(type) {
        const video = document.getElementById('video-feed');
        const foto = await FaceRec.captureAndVerify(video);

        if (!foto) return alert("Wajah tidak terdeteksi!");
        if (!this.coords) return alert("Koordinat belum didapat. Tunggu sinyal GPS.");

        const user = JSON.parse(localStorage.getItem('user_session'));
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
        if(res.status === 'success') window.location.hash = '#dashboard';
    }
};