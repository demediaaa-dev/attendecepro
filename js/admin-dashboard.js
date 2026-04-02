// js/admin-dashboard.js
const AdminDashboard = {
    async render() {
        const content = document.getElementById('page-content');
        content.innerHTML = `
            <div class="flex justify-between items-center mb-8">
                <h1 class="text-2xl font-bold">Rekapitulasi Presensi</h1>
                <div class="flex gap-2">
                    <button onclick="AdminDashboard.exportExcel()" class="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2">
                        <i data-lucide="file-spreadsheet" class="w-4 h-4"></i> Excel
                    </button>
                    <button onclick="AdminDashboard.exportPDF()" class="bg-red-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2">
                        <i data-lucide="file-text" class="w-4 h-4"></i> PDF
                    </button>
                </div>
            </div>

            <div class="glass rounded-3xl overflow-hidden">
                <table class="w-full text-left border-collapse" id="table-rekap">
                    <thead class="bg-slate-100/50">
                        <tr>
                            <th class="p-4 text-xs font-bold text-slate-500 uppercase">Nama Pegawai</th>
                            <th class="p-4 text-xs font-bold text-slate-500 uppercase">Tanggal</th>
                            <th class="p-4 text-xs font-bold text-slate-500 uppercase">Masuk</th>
                            <th class="p-4 text-xs font-bold text-slate-500 uppercase">Pulang</th>
                            <th class="p-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody id="rekap-body">
                        <tr><td colspan="5" class="p-10 text-center text-slate-400">Memuat data...</td></tr>
                    </tbody>
                </table>
            </div>
        `;
        lucide.createIcons();
        this.loadData();
    },

    async loadData() {
        const res = await BASE_API.post('get_all_presensi', {});
        const body = document.getElementById('rekap-body');
        if (res.status === 'success') {
            body.innerHTML = res.data.map(row => `
                <tr class="border-t border-slate-100 hover:bg-white/40 transition-colors">
                    <td class="p-4 font-medium">${row[1]}</td>
                    <td class="p-4 text-slate-600">${row[2]}</td>
                    <td class="p-4 text-blue-600 font-bold">${row[3]}</td>
                    <td class="p-4 text-orange-600 font-bold">${row[4] || '--:--'}</td>
                    <td class="p-4"><span class="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">${row[7]}</span></td>
                </tr>
            `).join('');
        }
    },

    exportExcel() {
        const table = document.getElementById("table-rekap");
        const wb = XLSX.utils.table_to_book(table);
        XLSX.writeFile(wb, "Rekap_Presensi_SiPanda.xlsx");
    },

    exportPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text("Laporan Presensi Digital SiPanda", 14, 15);
        doc.autoTable({ html: '#table-rekap', margin: { top: 25 } });
        doc.save("Rekap_Presensi.pdf");
    }
};