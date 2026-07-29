/*====================================================
GBI ALTAR TABERNAKEL BATAM
AUTH SYSTEM
====================================================*/

/*
====================================================
APP VERSION

Naikkan versi setiap ada perubahan
yang mempengaruhi cache/session.
====================================================*/
/*====================================================
APP VERSION

Versi 1.0.0 = Aplikasi pertama (Release Awal)
Versi 1.0.1 = Perbaikan Bug
Versi 1.0.2 = Optimasi
Versi 1.0.3 = Penambahan Fitur Kecil
Versi 1.0.4 = Perbaikan Keamanan
Versi 1.0.5 = Optimasi Performa
Versi 1.0.6 = Perubahan Tampilan (UI/UX)
Versi 1.0.7 = Penambahan Menu / Halaman Baru
Versi 1.0.8 = Penambahan Struktur Data
Versi 1.0.9 = Penyempurnaan Sistem
Versi 1.1.0 = Update Besar (Major Update)

Naikkan versi setiap ada perubahan
yang mempengaruhi cache/session.
====================================================*/
const APP_VERSION = "1.0.2";


/*====================================================
LOCAL STORAGE KEY
====================================================*/
const AUTH_TOKEN_KEY = "GBI_LOGIN_TOKEN";
const AUTH_EXPIRED_KEY = "GBI_TOKEN_EXPIRED";


/*====================================================
AMBIL TOKEN
====================================================*/

function getLoginToken(){

    return localStorage.getItem(
        AUTH_TOKEN_KEY
    );

}


function getExpired(){

    return localStorage.getItem(
        AUTH_EXPIRED_KEY
    );

}

/*====================================================
SIMPAN LOGIN
====================================================*/

function saveLogin(token,expired){

    localStorage.setItem(AUTH_TOKEN_KEY,token);
    localStorage.setItem(AUTH_EXPIRED_KEY,expired);
}


/*====================================================
HAPUS LOGIN
====================================================*/


function clearLogin(){

    localStorage.removeItem(
        AUTH_TOKEN_KEY
    );


    localStorage.removeItem(
        AUTH_EXPIRED_KEY
    );

}

/*====================================================
CEK SESSION
====================================================*/

function checkSession(){

    const token = getLoginToken();
    const expired = getExpired();

    if(!token || !expired){

        clearLogin();

        sessionStorage.clear();

        window.location.href = "index.html";

        return false;

    }

    if(Date.now() > Number(expired)){

        clearLogin();

        sessionStorage.clear();

        window.location.href = "index.html";

        return false;

    }

    /*====================================================
    CEK VERSI APLIKASI
    ====================================================*/

    const oldVersion =
        sessionStorage.getItem("APP_VERSION");

    if(oldVersion !== APP_VERSION){

        console.log(
            "Versi aplikasi berubah :",
            oldVersion,
            "→",
            APP_VERSION
        );

        sessionStorage.clear();

        sessionStorage.setItem(
            "APP_VERSION",
            APP_VERSION
        );

    }

    return true;

}

function hasLogin(){
    const token=getLoginToken();
    const expired=getExpired();
    if(!token) return false;
    if(!expired) return false;

    if(Date.now()>Number(expired)){
        clearLogin();
        sessionStorage.clear();
        return false;

    }

    return true;

}


/*====================================================
LOGOUT
====================================================*/

function logout(){

    clearLogin();

    sessionStorage.clear();

    window.location.href =
    "index.html";

}
