// js/face-recognition.js
const FaceRec = {
    isModelLoaded: false,

    async loadModels() {
        if (this.isModelLoaded) return;
        
        // Menggunakan path absolut agar aman di Vercel
        const MODEL_URL = window.location.origin + '/models'; 
        
        try {
            console.log("Memuat model AI dari:", MODEL_URL);
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
            ]);
            this.isModelLoaded = true;
            console.log("Model AI Berhasil Dimuat");
        } catch (e) {
            console.error("Gagal memuat model AI. Pastikan folder /models ada di root GitHub.", e);
        }
    },

    async startCamera(videoElementId) {
        const video = document.getElementById(videoElementId);
        if (!video) return;

        const constraints = {
            video: {
                facingMode: "user", // Memaksa kamera depan (selfie)
                width: { ideal: 720 },
                height: { ideal: 1280 }
            },
            audio: false
        };

        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            video.srcObject = stream;
            
            // Penting untuk browser mobile (iOS/Android)
            video.setAttribute('playsinline', ''); 
            video.onloadedmetadata = () => {
                video.play().catch(e => console.error("Autoplay diblokir:", e));
            };
        } catch (err) {
            console.error("Kamera gagal akses:", err);
            alert("Izin kamera diperlukan! Silakan cek pengaturan gembok di browser Anda.");
        }
    },

    async captureAndVerify(videoElement) {
        if (!this.isModelLoaded) {
            alert("Sistem AI belum siap, tunggu sebentar...");
            return null;
        }

        const detections = await faceapi.detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions());
        if (!detections) return null;

        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        canvas.getContext('2d').drawImage(videoElement, 0, 0);
        return canvas.toDataURL('image/jpeg', 0.6); // Kualitas 60% agar file tidak terlalu besar
    }
};
