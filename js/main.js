// js/main.js
const App = {
    init() {
        // Hilangkan loader saat halaman siap
        window.addEventListener('load', () => {
            const loader = document.getElementById('loader');
            if(loader) loader.style.display = 'none';
        });

        // Jalankan Router
        Router.init();
    },

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.toggle('-left-full'); // Sembunyikan ke kiri (mobile)
            sidebar.classList.toggle('left-0');
            
            // Untuk desktop, kita bisa toggle lebarnya
            sidebar.classList.toggle('md:w-20');
            sidebar.classList.toggle('md:w-64');
            
            // Sembunyikan teks menu saat sidebar mengecil
            const labels = sidebar.querySelectorAll('span');
            labels.forEach(el => el.classList.toggle('md:hidden'));
        }
    }
};

const UI = {
    showToast(message, type = 'success') {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const icon = type === 'success' ? 'check-circle' : 'alert-circle';
        const color = type === 'success' ? 'text-emerald-500' : 'text-red-500';

        const toast = document.createElement('div');
        toast.className = 'toast-item ios-card';
        toast.innerHTML = `
            <i data-lucide="${icon}" class="${color} w-5 h-5"></i>
            <span class="text-sm font-semibold text-slate-700">${message}</span>
        `;
        
        container.appendChild(toast);
        lucide.createIcons();

        // Hapus otomatis setelah 3 detik
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-10px)';
            toast.style.transition = 'all 0.5s ease';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }
};

App.init();

