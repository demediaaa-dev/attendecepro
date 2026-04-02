// js/shift.js
const AdminShift = {
    render() {
        const content = document.getElementById('page-content');
        content.innerHTML = `
            <h1 class="text-2xl font-bold mb-8">Pengaturan Lokasi Kantor</h1>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="glass p-8 rounded-3xl space-y-6">
                    <div>
                        <label class="block text-sm font-bold text-slate-500 mb-2">Pilih Shift</label>
                        <select id="select-shift" class="w-full p-3 rounded-xl bg-slate-100 border-none outline-none">
                            <option value="S001">Shift Pagi (Pusat)</option>
                        </select>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-400 mb-1">Latitude</label>
                            <input type="text" id="lat-kantor" placeholder="-6.12345" class="w-full p-3 rounded-xl bg-slate-100 border-none outline-none">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-400 mb-1">Longitude</label>
                            <input type="text" id="lng-kantor" placeholder="106.12345" class="w-full p-3 rounded-xl bg-slate-100 border-none outline-none">
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-400 mb-1">Radius Absen (Meter)</label>
                        <input type="number" id="radius-kantor" value="50" class="w-full p-3 rounded-xl bg-slate-100 border-none outline-none">
                    </div>
                    <button onclick="AdminShift.updateLocation()" class="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold">Simpan Perubahan</button>
                </div>

                <div class="bg-slate-200 rounded-3xl flex flex-col items-center justify-center p-8 text-center text-slate-500">
                    <i data-lucide="map-pin" class="w-12 h-12 mb-4"></i>
                    <p class="text-sm">Buka Google Maps, klik kanan pada lokasi kantor, lalu salin koordinatnya ke form di samping.</p>
                </div>
            </div>
        `;
        lucide.createIcons();
    },

    async updateLocation() {
        const payload = {
            id_shift: document.getElementById('select-shift').value,
            lat: parseFloat(document.getElementById('lat-kantor').value),
            lng: parseFloat(document.getElementById('lng-kantor').value),
            radius: parseInt(document.getElementById('radius-kantor').value)
        };

        const res = await BASE_API.post('update_location', payload);
        alert(res.message);
    }
};