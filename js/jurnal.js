// js/jurnal.js
const Jurnal = {
    render() {
        const content = document.getElementById('page-content');
        content.innerHTML = `
            <div class="space-y-6 pb-20">
                <div class="flex items-center gap-4">
                    <button onclick="location.hash='#dashboard'" class="p-2 glass rounded-xl"><i data-lucide="chevron-left"></i></button>
                    <h2 class="text-xl font-bold">Jurnal Harian</h2>
                </div>
                
                <div class="glass p-6 rounded-3xl space-y-4">
                    <div class="grid grid-cols-2 gap-3">
                        <input type="time" id="jam_mulai" class="p-3 rounded-xl bg-slate-100 border-none outline-none text-sm">
                        <input type="time" id="jam_selesai" class="p-3 rounded-xl bg-slate-100 border-none outline-none text-sm">
                    </div>
                    <textarea id="deskripsi" placeholder="Apa yang Anda kerjakan hari ini?" class="w-full h-32 p-4 rounded-2xl bg-slate-100 border-none outline-none text-sm"></textarea>
                    <input type="text" id="link_bukti" placeholder="Link dokumen/foto (Opsional)" class="w-full p-3 rounded-xl bg-slate-100 border-none outline-none text-sm">
                    
                    <button onclick="Jurnal.submit()" id="btn-jurnal" class="w-full py-4 bg-orange-500 text-white rounded-2xl font-bold shadow-lg shadow-orange-100 active:scale-95 transition-all">
                        Simpan Jurnal
                    </button>
                </div>
            </div>
        `;
        lucide.createIcons();
    },

    async submit() {
        const user = JSON.parse(localStorage.getItem('user_session'));
        const payload = {
            id_user: user.id_user,
            tanggal: new Date().toISOString().split('T')[0],
            jam_mulai: document.getElementById('jam_mulai').value,
            jam_selesai: document.getElementById('jam_selesai').value,
            deskripsi: document.getElementById('deskripsi').value,
            link: document.getElementById('link_bukti').value
        };

        const res = await BASE_API.post('submit_jurnal', payload);
        alert(res.message);
        if(res.status === 'success') window.location.hash = '#dashboard';
    }
};