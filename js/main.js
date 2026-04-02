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

App.init();