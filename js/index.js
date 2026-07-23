/*====================================================
GBI ALTAR TABERNAKEL BATAM
INDEX
Version : 1.0
====================================================*/

/*====================================================
GOOGLE APPS SCRIPT API
====================================================*/

const GAS_URL =
"https://script.google.com/macros/s/AKfycbzZJuh3Z3qNhaLLNm46kW7F6XKNL7PRUYpqDOdkJawNzOb-s_Pt954NMRsxghUeIDjp9g/exec";


/*====================================================
GLOBAL
====================================================*/

const INSTALLATION_KEY = "GBI_INSTALLATION_ID";

const STATUS_KEY = "GBI_STATUS";

/*====================================================
LOCAL STORAGE
====================================================*/

const TOKEN_KEY = "GBI_LOGIN_TOKEN";

const TOKEN_EXPIRED = "GBI_TOKEN_EXPIRED";


/*====================================================
ELEMENT
====================================================*/

const registerBox = document.getElementById("registerBox");

const pendingBox = document.getElementById("pendingBox");

const loginBox = document.getElementById("loginBox");

const loadingBox = document.getElementById("loadingBox");

const alertBox = document.getElementById("alertBox");

const registerForm = document.getElementById("registerForm");

const loginForm = document.getElementById("loginForm");

const loginNomor = document.getElementById("loginNomor");

const showPassword = document.getElementById("showPassword");

const password = document.getElementById("password");

/*====================================================
START
====================================================*/

document.addEventListener("DOMContentLoaded",()=>{

    init();

});


/*====================================================
INIT
====================================================*/

function init(){

    hideAll();

    checkAutoLogin();

}


/*====================================================
CEK INSTALLATION ID
====================================================*/

/*====================================================
CEK STATUS KE SERVER
====================================================*/

async function checkInstallation(){

    const installationId = localStorage.getItem(INSTALLATION_KEY);

    console.log("Installation ID :", installationId);

    if(!installationId){

        console.log("Belum ada Installation ID");

        hideAll();
        registerBox.classList.remove("d-none");
        return;

    }

    showLoading();

    try{

        const body = new URLSearchParams({

            action:"CHECK_STATUS",

            installationId:installationId

        });

        console.log("Mengirim CHECK_STATUS...");

        const response = await fetch(GAS_URL,{

            method:"POST",

            body:body
            
        });

        console.log("Response :", response.status);

        const result = await response.json();

        console.log("Result :", result);

        hideAll();

        if(!result.success){

            console.log("Belum terdaftar");

            registerBox.classList.remove("d-none");

            return;

        }

        if(result.status=="PENDING"){

            console.log("Status : PENDING");

            pendingBox.classList.remove("d-none");

        }else if(result.status=="AKTIF"){

            console.log("Status : AKTIF");

            loginBox.classList.remove("d-none");

        }else if(result.status=="BLOKIR"){

            console.log("Status : BLOKIR");

            showAlert("Akun Anda diblokir.");

            registerBox.classList.remove("d-none");

        }else{

            console.log("Status tidak dikenal :", result.status);

            registerBox.classList.remove("d-none");

        }

    }catch(err){

        hideAll();

        console.error("CHECK_STATUS ERROR :", err);

        showAlert(err.toString());

        registerBox.classList.remove("d-none");

    }

}
/*====================================================
CREATE INSTALLATION ID
====================================================*/

async function createInstallationId(nomor){

    const fingerprint = getDeviceFingerprint();

    const raw =
        nomor +
        "|" +
        fingerprint;

    return await sha256(raw);

}


/*====================================================
HIDE SEMUA BOX
====================================================*/

function hideAll(){

    registerBox.classList.add("d-none");

    pendingBox.classList.add("d-none");

    loginBox.classList.add("d-none");

    loadingBox.classList.add("d-none");

    alertBox.classList.add("d-none");

}


/*====================================================
SHOW LOADING
====================================================*/

function showLoading(){

    hideAll();

    loadingBox.classList.remove("d-none");

}


/*====================================================
SHOW ALERT
====================================================*/

function showAlert(text){

    alertBox.innerHTML = text;

    alertBox.classList.remove("d-none");

}


/*====================================================
SHOW PASSWORD
====================================================*/

showPassword.addEventListener("click",()=>{

    if(password.type==="password"){

        password.type="text";

        showPassword.innerHTML=
        '<i class="fa-solid fa-eye-slash"></i>';

    }else{

        password.type="password";

        showPassword.innerHTML=
        '<i class="fa-solid fa-eye"></i>';

    }

});

/*====================================================
REGISTER
====================================================*/

registerForm.addEventListener("submit", function(e){

    e.preventDefault();

    registerPhone();

});

/*====================================================
LOGIN
====================================================*/
loginForm.addEventListener("submit",function(e){
    e.preventDefault();
    login();
});

/*====================================================
LINK KE LOGIN
====================================================*/
document.addEventListener("click", function (e) {
    if (e.target.id === "goLogin") {
        e.preventDefault();
        hideAll();
        loginBox.classList.remove("d-none");
    }
});

/*====================================================
LINK KE REGISTER
====================================================*/
document.addEventListener("click", function (e) {

    if (e.target.id === "goRegister") {

        e.preventDefault();

        hideAll();

        registerBox.classList.remove("d-none");

    }

});


/*====================================================
DAFTARKAN PONSEL
====================================================*/
async function registerPhone(){

    showLoading();

    const nama = document.getElementById("nama").value.trim();
    const nomor = document.getElementById("nomor").value.trim();
    const role = document.getElementById("role").value;

    if(nama==""){

        showAlert("Nama lengkap wajib diisi.");
        registerBox.classList.remove("d-none");
        return;

    }

    if(nomor==""){

        showAlert("Nomor WhatsApp wajib diisi.");
        registerBox.classList.remove("d-none");
        return;

    }

    // Membuat Installation ID baru
    const registerData = {

            action : "REGISTER",
            timestamp : new Date().toISOString(),
            nama : nama,
            nomor : nomor,
            role : role,
            brand : getBrand(),
            model : getModel(),
            browser : getBrowser(),
            appVersion : "1.0.0"

        };

    console.log("REGISTER DATA");
    console.log(registerData);

    try{

        const response = await fetch(GAS_URL,{

            method:"POST",
            body:new URLSearchParams(registerData)

        });

        const result = await response.json();
        const pendingMessage =
        document.getElementById("pendingMessage");

        console.log("Response GAS :",result);

        if(result.success){

            // Jika GAS mengirim Installation ID lama,
            // gunakan ID dari GAS.
            const installationId = result.installationId;

                localStorage.setItem(
                    INSTALLATION_KEY,
                    installationId
                );

                localStorage.setItem(
                    STATUS_KEY,
                    result.status
                );

            console.log("=== REGISTER BERHASIL ===");
                console.log("Installation ID dari GAS :", installationId);
                console.log(
                    "Installation ID Local Storage :",
                    localStorage.getItem(INSTALLATION_KEY)
                );

            // Jika akun sudah aktif
            if(result.status=="AKTIF"){

                console.log("Status AKTIF");

                checkInstallation();

                return;

            }

            // Jika masih pending
            // Tampilkan pesan dari server
            showAlert(result.message);

            // Jika masih pending
            pendingMessage.textContent = result.message;

                pendingMessage.className =
                    result.waSent
                    ? "alert alert-success mt-4"
                    : "alert alert-warning mt-4";

                hideAll();

                pendingBox.classList.remove("d-none");

                return;

            }

        showAlert(result.message);

        registerBox.classList.remove("d-none");

    }catch(error){

        console.error(error);

        showAlert("Tidak dapat terhubung ke server.");

        registerBox.classList.remove("d-none");

    }

}

/*====================================================
DEVICE INFORMATION
====================================================*/

function getBrowser(){

    return navigator.userAgent;

}

function getAndroid(){

    return navigator.platform;

}

function getBrand(){

    return "Unknown";

}

function getModel(){

    return "Unknown";

}


/*====================================================
DEVICE FINGERPRINT
====================================================*/

function getDeviceFingerprint(){

    return [

        navigator.userAgent,

        navigator.language,

        screen.width,

        screen.height,

        Intl.DateTimeFormat().resolvedOptions().timeZone,

        navigator.platform,

        navigator.hardwareConcurrency || "",

        navigator.maxTouchPoints || ""

    ].join("|");

}


/*====================================================
LOGIN
====================================================*/
async function login(){

    const nomor = loginNomor.value.trim();
    const pass = password.value.trim();
    const installationId =
        localStorage.getItem(INSTALLATION_KEY);

    if(nomor==""){

        showAlert("Nomor WhatsApp wajib diisi.");

        loginNomor.focus();

        return;

    }

    if(pass==""){

        showAlert("Password wajib diisi.");

        password.focus();

        return;

    }

    const loginBtn = document.getElementById("loginBtn");
    const loginText = document.getElementById("loginText");

    // Nonaktifkan tombol & input
    loginBtn.disabled = true;
    loginNomor.disabled = true;
    password.disabled = true;

    // Tampilkan spinner
    loginText.innerHTML = `
        <span
            class="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true">
        </span>

        Memeriksa Keamanan...
    `;

    console.log("LOGIN DATA");

    console.log({

        nomor,

        installationId

    });

    try{

        const body = new URLSearchParams({

            action:"LOGIN",

            nomor:nomor,

            password:pass,

            installationId:installationId

        });

        const response = await fetch(GAS_URL,{

            method:"POST",

            body:body

        });

        const result = await response.json();

        console.log("LOGIN RESULT :",result);

        if(result.success){

            saveLogin(

                result.token,

                result.expired

            );

            localStorage.setItem(

                STATUS_KEY,

                "AKTIF"

            );

            window.location.href = "jemaat-baru.html";

            return;

        }

        // Login gagal
        loginBtn.disabled = false;
        loginNomor.disabled = false;
        password.disabled = false;

        loginText.innerHTML = "Login";

        showAlert(result.message);

    }catch(err){

        console.error(err);

        // Aktifkan kembali tombol & input
        loginBtn.disabled = false;
        loginNomor.disabled = false;
        password.disabled = false;

        loginText.innerHTML = "Login";

        showAlert("Tidak dapat terhubung ke server.");

    }

}

/*====================================================
SHA256
====================================================*/

async function sha256(text){

    const encoder = new TextEncoder();

    const data = encoder.encode(text);

    const hash = await crypto.subtle.digest("SHA-256", data);

    return Array.from(new Uint8Array(hash))
        .map(b=>b.toString(16).padStart(2,"0"))
        .join("");

}

/*====================================================
LOGIN TOKEN
====================================================*/

function saveLogin(token,expired){

    localStorage.setItem(TOKEN_KEY,token);

    localStorage.setItem(TOKEN_EXPIRED,expired);

}

function getLoginToken(){

    return localStorage.getItem(TOKEN_KEY);

}

function getExpired(){

    return localStorage.getItem(TOKEN_EXPIRED);

}

function clearLogin(){

    localStorage.removeItem(TOKEN_KEY);

    localStorage.removeItem(TOKEN_EXPIRED);

}

/*====================================================
CEK TOKEN
====================================================*/

function hasLogin(){

    const token=getLoginToken();

    const expired=getExpired();

    if(!token) return false;

    if(!expired) return false;

    if(Date.now()>Number(expired)){

        clearLogin();

        return false;

    }

    return true;

}

/*====================================================
AUTO LOGIN
====================================================*/

function checkAutoLogin(){

    if(hasLogin()){

        window.location.href="jemaat-baru.html";

        return;

    }

    checkInstallation();

}
