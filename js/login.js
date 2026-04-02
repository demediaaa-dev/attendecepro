// js/login.js
const Login = {
    render() {
        const content = document.getElementById('page-content');
        content.innerHTML = `
            <div class="min-h-screen flex items-center justify-center p-6">
                <div class="glass w-full max-w-sm p-8 rounded-3xl shadow-xl text-center">
                    <img src="https://via.placeholder.com/80" class="mx-auto mb-6 rounded-full border-4 border-white shadow-sm" alt="Logo">
                    <h1 class="text-2xl font-bold text-slate-800 mb-2">SiPanda Presence</h1>
                    <p class="text-slate-500 text-sm mb-8">Silakan masuk untuk melanjutkan</p>
                    
                    <div class="space-y-4 text-left">
                        <div>
                            <label class="text-xs font-semibold ml-1 text-slate-400">ID PEGAWAI</label>
                            <input type="text" id="id_user" class="w-full mt-1 p-3 rounded-xl bg-slate-100 border-none focus:ring-2 focus:ring-blue-400 outline-none transition-all" placeholder="Contoh: P001">
                        </div>
                        <div>
                            <label class="text-xs font-semibold ml-1 text-slate-400">PASSWORD</label>
                            <input type="password" id="password" class="w-full mt-1 p-3 rounded-xl bg-slate-100 border-none focus:ring-2 focus:ring-blue-400 outline-none transition-all" placeholder="••••••••">
                        </div>
                        <button onclick="Login.submit()" id="btn-login" class="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-transform mt-4">
                            Masuk
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    async submit() {
        const id_user = document.getElementById('id_user').value;
        const password = document.getElementById('password').value;
        const btn = document.getElementById('btn-login');

        if (!id_user || !password) return alert("Isi semua field!");

        btn.disabled = true;
        btn.innerText = "Memvalidasi...";

        // Fingerprint sederhana untuk Device ID
        const device_id = navigator.userAgent.replace(/\D+/g, '') || "DEV-UNKNOWN";

        const res = await BASE_API.post('login', { id_user, password, device_id });

        if (res.status === 'success') {
            localStorage.setItem('user_session', JSON.stringify(res.data));
            localStorage.setItem('device_id', device_id);
            
            // Redirect berdasarkan role
            window.location.hash = (res.data.role === 'Admin') ? '#admin-dashboard' : '#dashboard';
        } else {
            alert(res.message);
            btn.disabled = false;
            btn.innerText = "Masuk";
        }
    }
};