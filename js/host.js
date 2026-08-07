/*====================================================
KONFIGURASI
====================================================*/

const HOST_API_URL = 
"https://script.google.com/macros/s/AKfycbxRmv1uHf_AB9vPSwCVDkI2AArrbRJQY49nQS5ERw28CAtZg7DJmo0CqflPLpgZhEkt/exec";


/*====================================================
LOAD HOST
====================================================*/

async function loadHost(){

    const loading =
        document.getElementById("loadingHost");

    const error =
        document.getElementById("errorHost");

    const empty =
        document.getElementById("emptyHost");

    const list =
        document.getElementById("listHost");


    loading.classList.remove("d-none");
    error.classList.add("d-none");
    empty.classList.add("d-none");
    list.innerHTML = "";
    list.classList.add("d-none");


    try{

        const token =
            localStorage.getItem("GBI_LOGIN_TOKEN");


        if(!token){

            throw new Error(
                "Session tidak ditemukan."
            );

        }


        const body =
            new URLSearchParams();

        body.append(
            "action",
            "GET_HOST"
        );

        body.append(
            "token",
            token
        );


        const response =
            await fetch(

                HOST_API_URL,

                {
                    method:"POST",
                    body:body
                }

            );


        if(!response.ok){

            throw new Error(
                "Gagal mengambil data Host."
            );

        }


        const data =
            await response.json();


        console.log(
            "HOST RESPONSE :",
            data
        );


        if(!Array.isArray(data)){

            if(data.message){

                throw new Error(
                    data.message
                );

            }

            throw new Error(
                "Response Host bukan array."
            );

        }


        loading.classList.add("d-none");


        if(data.length === 0){

            empty.classList.remove("d-none");
            list.classList.add("d-none");
            return;

        }


        list.classList.remove("d-none");
        list.innerHTML = "";

        data.forEach(
            (host,index)=>{

                list.innerHTML +=
                    createHostCard(
                        host,
                        index
                    );

            }
        );


    }
    catch(error){

        console.error(
            "HOST ERROR :",
            error
        );


        loading.classList.add("d-none");
        list.classList.add("d-none");
        error.classList.remove("d-none");

        const errorText = document.getElementById("errorText");
        if(errorText) {
            errorText.textContent = error.message;
        }

    }

}


/*====================================================
FORMAT TANGGAL LOGIN
====================================================*/

function formatLoginDate(dateString){

    if(!dateString) return "Belum pernah login";

    try {

        let date = new Date(dateString);

        if(isNaN(date.getTime())){

            const parts = dateString.split(' ');
            if(parts.length === 2){

                const dateParts = parts[0].split('/');
                const timeParts = parts[1].split(':');

                if(dateParts.length === 3 && timeParts.length === 3){

                    const day = parseInt(dateParts[0]);
                    const month = parseInt(dateParts[1]) - 1;
                    const year = parseInt(dateParts[2]);
                    const hour = parseInt(timeParts[0]);
                    const minute = parseInt(timeParts[1]);
                    const second = parseInt(timeParts[2]);

                    date = new Date(year, month, day, hour, minute, second);

                }

            }

        }

        if(isNaN(date.getTime())){
            return dateString;
        }

        const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
        const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

        const dayName = days[date.getDay()];
        const dayNum = date.getDate();
        const monthName = months[date.getMonth()];
        const year = date.getFullYear();

        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';

        if(hours > 12) hours = hours - 12;
        else if(hours === 0) hours = 12;

        const timeStr = `${hours}.${minutes} ${ampm}`;

        return `${dayName}, ${dayNum} ${monthName} ${year} Jam ${timeStr} WIB`;

    } catch(error){
        console.warn("Gagal format tanggal:", dateString, error);
        return dateString;
    }

}


/*====================================================
CARD HOST (DESAIN BARU)
====================================================*/

function createHostCard(host,index){

    const nama =
        host["Nama Lengkap"] || "-";

    const username =
        host["Username"] || "-";

    const status =
        host["Status"] || "-";

    const whatsapp =
        host["Nomor WhatsApp"] || "-";

    // AMBIL INSTALLATION ID UNTUK KEPERLUAN UPDATE/DELETE
    const installationId =
        host["Installation ID"] || "";

    // FORMAT LOGIN TERAKHIR
    let loginTerakhir = 
        host["Login Terakhir"] || 
        host["Last Login"] || 
        host["login_terakhir"] ||
        host["last_login"] ||
        null;

    if(!loginTerakhir) {
        loginTerakhir = localStorage.getItem("GBI_LAST_LOGIN");
    }
    
    if(!loginTerakhir) {
        const now = new Date();
        const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
        const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        
        const dayName = days[now.getDay()];
        const dayNum = now.getDate();
        const monthName = months[now.getMonth()];
        const year = now.getFullYear();
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        if(hours > 12) hours = hours - 12;
        else if(hours === 0) hours = 12;
        
        loginTerakhir = `${dayName}, ${dayNum} ${monthName} ${year} Jam ${hours}.${minutes} ${ampm} WIB (perkiraan)`;
    } else {
        loginTerakhir = formatLoginDate(loginTerakhir);
    }

    // BADGE STATUS
    let badgeClass = "badge-host badge-pending";
    let badgeText = status;

    if(status === "AKTIF"){
        badgeClass = "badge-host badge-aktif";
        badgeText = "● Aktif";
    } else if(status === "BLOKIR"){
        badgeClass = "badge-host badge-blokir";
        badgeText = "✕ Blokir";
    }


    return `

    <div class="host-card">

        <!-- HEADER -->
        <div class="host-header">
            <h5 class="host-name">
                ${nama}
                <small>#${index + 1}</small>
            </h5>
            <span class="${badgeClass}">${badgeText}</span>
        </div>

        <!-- INFO DENGAN GARIS PEMISAH -->
        <div class="host-info">
            <div class="host-info-item">
                <i class="fa-solid fa-user"></i>
                <span class="label">Username</span>
                <span class="value">${username}</span>
            </div>
            <div class="host-info-item">
                <i class="fa-brands fa-whatsapp"></i>
                <span class="label">WhatsApp</span>
                <span class="value">${whatsapp}</span>
            </div>
            <div class="host-info-item">
                <i class="fa-solid fa-clock"></i>
                <span class="label">Login</span>
                <span class="value login-time">${loginTerakhir}</span>
            </div>
        </div>

        <!-- TOMBOL AKSI -->
        <div class="host-actions">
            <button
                class="btn-host btn-host-aktif"
                onclick="ubahStatusHost('${installationId}','AKTIF')">
                <i class="fa-solid fa-check"></i> Aktifkan
            </button>
            <button
                class="btn-host btn-host-blokir"
                onclick="ubahStatusHost('${installationId}','BLOKIR')">
                <i class="fa-solid fa-ban"></i> Blokir
            </button>
            <button
                class="btn-host btn-host-hapus"
                onclick="hapusHost('${installationId}')">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>

    </div>

    `;

}


/*====================================================
UBAH STATUS HOST (BERFUNGSI - TERHUBUNG API)
====================================================*/

async function ubahStatusHost(installationId, statusBaru) {

    // Konfirmasi dari user
    const statusText = statusBaru === "AKTIF" ? "AKTIFKAN" : "BLOKIR";
    const confirmMsg = `Apakah Anda yakin ingin ${statusText} host ini?`;
    
    if(!confirm(confirmMsg)) {
        return;
    }

    try {

        // Tampilkan loading
        const buttons = document.querySelectorAll('.btn-host');
        buttons.forEach(btn => btn.disabled = true);

        const token = localStorage.getItem("GBI_LOGIN_TOKEN");

        if(!token) {
            alert("Session tidak ditemukan. Silakan login ulang.");
            return;
        }

        const body = new URLSearchParams();
        body.append("action", "UPDATE_HOST_STATUS");  // ← ACTION YANG BENAR DARI GAS
        body.append("token", token);
        body.append("id", installationId);            // ← PARAMETER id (Installation ID)
        body.append("status", statusBaru);

        const response = await fetch(HOST_API_URL, {
            method: "POST",
            body: body
        });

        if(!response.ok) {
            throw new Error("Gagal mengubah status host.");
        }

        const result = await response.json();

        console.log("UPDATE STATUS RESPONSE:", result);

        if(result.success) {
            alert(`✅ Status host berhasil diubah menjadi ${statusBaru}`);
            
            // Reload data host
            loadHost();
        } else {
            throw new Error(result.message || "Gagal mengubah status host.");
        }

    } catch(error) {
        console.error("ERROR UBAH STATUS:", error);
        alert(`❌ Gagal mengubah status: ${error.message}`);
    } finally {
        // Aktifkan kembali tombol
        const buttons = document.querySelectorAll('.btn-host');
        buttons.forEach(btn => btn.disabled = false);
    }

}


/*====================================================
HAPUS HOST (BERFUNGSI - TERHUBUNG API)
====================================================*/

async function hapusHost(installationId) {

    // Konfirmasi dari user
    const confirmMsg = `⚠️ Apakah Anda yakin ingin menghapus host ini?\n\nTindakan ini tidak dapat dibatalkan!`;
    
    if(!confirm(confirmMsg)) {
        return;
    }

    // Konfirmasi kedua
    if(!confirm(`Konfirmasi lagi: Hapus host ini?`)) {
        return;
    }

    try {

        // Tampilkan loading
        const buttons = document.querySelectorAll('.btn-host');
        buttons.forEach(btn => btn.disabled = true);

        const token = localStorage.getItem("GBI_LOGIN_TOKEN");

        if(!token) {
            alert("Session tidak ditemukan. Silakan login ulang.");
            return;
        }

        const body = new URLSearchParams();
        body.append("action", "DELETE_HOST");        // ← ACTION YANG BENAR DARI GAS
        body.append("token", token);
        body.append("id", installationId);           // ← PARAMETER id (Installation ID)

        const response = await fetch(HOST_API_URL, {
            method: "POST",
            body: body
        });

        if(!response.ok) {
            throw new Error("Gagal menghapus host.");
        }

        const result = await response.json();

        console.log("DELETE HOST RESPONSE:", result);

        if(result.success) {
            alert(`✅ Host berhasil dihapus!`);
            
            // Reload data host
            loadHost();
        } else {
            throw new Error(result.message || "Gagal menghapus host.");
        }

    } catch(error) {
        console.error("ERROR HAPUS HOST:", error);
        alert(`❌ Gagal menghapus host: ${error.message}`);
    } finally {
        // Aktifkan kembali tombol
        const buttons = document.querySelectorAll('.btn-host');
        buttons.forEach(btn => btn.disabled = false);
    }

}


/*====================================================
UPDATE CLOCK
====================================================*/

function updateClock() {
    const now = new Date();
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    
    const dayName = days[now.getDay()];
    const dayNum = now.getDate();
    const monthName = months[now.getMonth()];
    const year = now.getFullYear();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    if(hours > 12) hours = hours - 12;
    else if(hours === 0) hours = 12;
    
    const clockElement = document.getElementById("currentTime");
    if(clockElement) {
        clockElement.textContent = 
            `${dayName}, ${dayNum} ${monthName} ${year} Jam ${hours}.${minutes} ${ampm} WIB`;
    }
}


/*====================================================
START
====================================================*/

document.addEventListener(
    "DOMContentLoaded",
    function() {
        loadHost();
        updateClock();
        setInterval(updateClock, 1000);
    }
);