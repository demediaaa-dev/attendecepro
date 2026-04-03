// js/api.js
const API_URL = "https://script.google.com/macros/s/AKfycbwNuGk-pRCSB6KX3Xu3QRpIdEDC2xEDknBeysnXxWf2xjXUT09JE4ujF7NX-Kt_lD_a/exec"; 

const BASE_API = {
    async post(action, payload) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                body: JSON.stringify({ action, payload })
            });
            return await response.json();
        } catch (error) {
            console.error("API Error:", error);
            return { status: "error", message: "Koneksi ke server gagal." };
        }
    }
};
