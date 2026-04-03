// js/api.js
const API_URL = "https://script.google.com/macros/s/AKfycbz7Jon116CsLReIs4wu-LOSqVrpgPC2eduFgmmfAZ4LdOYGRHStId0DZxlrD8Lr18Kg/exec"; 

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
