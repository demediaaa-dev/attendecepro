// js/face-recognition.js
const FaceRec = {
    isModelLoaded: false,

    async loadModels() {
        if (this.isModelLoaded) return true;
        
        const MODEL_URL = window.location.origin + '/models'; 
        
        try {
            // Memuat model secara paralel agar lebih cepat
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
            ]);
            this.isModelLoaded = true;
            console.log("AI Ready");
            return true;
        } catch (e) {
            console.error("Gagal load model AI:", e);
            return false;
        }
    },

    async startCamera(videoElementId) {
        const video = document.getElementById(videoElementId);
        if (!video) return;

        // MENGATASI ZOOM: Gunakan ideal width yang lebih kecil untuk memaksa mode Wide
        const constraints = {
            video: {
                facingMode: "user",
                width: { min: 480, ideal: 640, max: 720 }, // Resolusi menengah agar tidak zoom
                aspectRatio: { ideal: 0.75 } // Mengikuti rasio potret 3:4
            },
            audio: false
        };

        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            video.srcObject = stream;
            video.setAttribute('playsinline', ''); 
            
            // Tunggu video beneran jalan
            return new Promise((resolve) => {
                video.onloadedmetadata = () => {
                    video.play();
                    resolve(true);
                };
            });
        } catch (err) {
            console.error("Kamera Error:", err);
            alert("Gagal akses kamera. Pastikan izin diberikan.");
            return false;
        }
    },

    async captureAndVerify(videoElement) {
        // Cek lagi apakah model benar-benar sudah siap
        if (!this.isModelLoaded) {
            const ready = await this.loadModels();
            if (!ready) return null;
        }

        // Gunakan parameter deteksi yang lebih ringan (inputSize) agar HP tidak lemot
        const detections = await faceapi.detectSingleFace(
            videoElement, 
            new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 })
        );

        if (!detections) return null;

        const canvas = document.createElement('canvas');
        // Sesuaikan ukuran canvas dengan resolusi asli video agar tidak distorsi
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const ctx = canvas.getContext('2d');
        
        // Mirroring kembali saat capture agar hasil foto tidak terbalik
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoElement, 0, 0);
        
        return canvas.toDataURL('image/jpeg', 0.5);
    }
};
