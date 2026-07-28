/*====================================================
GBI ALTAR TABERNAKEL BATAM
AUTH SYSTEM
Version : 1.0
====================================================*/


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

    const token =
    getLoginToken();


    const expired =
    getExpired();


    if(!token || !expired){

        clearLogin();

        sessionStorage.clear();

        window.location.href =
        "index.html";

        return false;

    }


    if(
        Date.now() >
        Number(expired)
    ){

        clearLogin();

        sessionStorage.clear();

        window.location.href =
        "index.html";

        return false;

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