// js/face-recognition.js
const FaceRec = {
    isModelLoaded: false,

    async loadModels() {
        if (this.isModelLoaded) return;
        const MODEL_URL = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/models';
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        ]);
        this.isModelLoaded = true;
    },

    async startCamera(videoElementId) {
        const video = document.getElementById(videoElementId);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
            video.srcObject = stream;
        } catch (err) {
            console.error("Kamera gagal akses:", err);
            alert("Izin kamera diperlukan untuk presensi.");
        }
    },

    async captureAndVerify(videoElement) {
        // Deteksi wajah sederhana
        const detections = await faceapi.detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions());
        if (!detections) return null;

        // Ambil screenshot dalam format Base64
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        canvas.getContext('2d').drawImage(videoElement, 0, 0);
        return canvas.toDataURL('image/jpeg', 0.7); // 70% quality untuk menghemat bandwidth
    }
};