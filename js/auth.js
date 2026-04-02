// ==========================================
// File: js/auth.js (Session & Guard Manager)
// ==========================================

const Auth = {
    // 1. Mengambil data user yang sedang login
    getUser() {
        const session = localStorage.getItem('user_session');
        return session ? JSON.parse(session) : null;
    },

    // 2. Mengecek apakah user sudah login
    isLoggedIn() {
        return this.getUser() !== null;
    },

    // 3. Mengecek role (untuk proteksi halaman admin)
    isAdmin() {
        const user = this.getUser();
        return user && user.role === 'Admin';
    },

    // 4. Fungsi Logout
    logout() {
        if (confirm("Apakah Anda yakin ingin keluar dari sistem?")) {
            // Hapus session tapi biarkan device_id tetap ada 
            // (agar tidak perlu reset device jika login lagi di hp yang sama)
            localStorage.removeItem('user_session');
            
            // Arahkan ke halaman login
            window.location.hash = '#login';
            window.location.reload(); 
        }
    },

    // 5. Guard: Fungsi untuk memproteksi rute (dipanggil di router.js)
    checkAccess(targetHash) {
        const user = this.getUser();
        
        // Jika belum login dan mencoba akses selain halaman login
        if (!user && targetHash !== 'login') {
            window.location.hash = '#login';
            return false;
        }

        // Jika sudah login tapi mencoba akses halaman login lagi
        if (user && targetHash === 'login') {
            window.location.hash = (user.role === 'Admin') ? '#admin-dashboard' : '#dashboard';
            return false;
        }

        // Proteksi Halaman Admin
        if (targetHash.startsWith('admin-') && !this.isAdmin()) {
            alert("Akses Ditolak: Anda bukan Administrator.");
            window.location.hash = '#dashboard';
            return false;
        }

        return true;
    }
};