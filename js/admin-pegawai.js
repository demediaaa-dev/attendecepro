// js/admin-pegawai.js
const AdminPegawai = {
    async resetDevice(idUser) {
        if(confirm(`Reset perangkat untuk user ${idUser}?`)) {
            const res = await BASE_API.post('reset_device', { id_target: idUser });
            alert(res.message);
        }
    },
    
    async resetFace(idUser) {
        if(confirm(`Hapus data wajah user ${idUser}? User harus mendaftarkan ulang wajahnya.`)) {
            const res = await BASE_API.post('reset_face', { id_target: idUser });
            alert(res.message);
        }
    }
    // Tambahkan fungsi CRUD tim di sini...
};