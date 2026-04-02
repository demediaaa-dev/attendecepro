// js/api.js
const API_URL = "https://script.google.com/macros/s/AKfycbwIN319RqBUTrskx71JJNwY2AyJNdaVuYiwS-j8bbojzE8WDzaCN1XDvBclD5Z0cJI3/exec"; 

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