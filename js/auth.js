const Auth = {
    getUser() {
        return JSON.parse(localStorage.getItem('user_session'));
    },
    logout() {
        if(confirm("Keluar dari aplikasi?")) {
            localStorage.removeItem('user_session');
            sessionStorage.clear();
            window.location.hash = '#login';
            window.location.reload();
        }
    }
};
