/*====================================================
GBI ALTAR TABERNAKEL BATAM
JEMAAT BARU
Version : 2.0
====================================================*/


/*====================================================
API: AMBIL DARI Code.gs
====================================================*/
const API_URL =
"https://script.google.com/macros/s/AKfycbxHHLu_VP2L1sEphuh5vVbO5Jr-JIojjkziqfwfdt9S-T0FEFHx6iKhrrzHSnmeDVJ6oA/exec";


/*====================================================
GLOBAL VARIABLE
====================================================*/

let semuaData = [];
let dataTampil = [];


/*====================================================
ELEMENT
====================================================*/

const loadingBox = document.getElementById("loadingBox");

const errorBox = document.getElementById("errorBox");

const emptyBox = document.getElementById("emptyBox");

const listJemaat = document.getElementById("listJemaat");

const totalData = document.getElementById("totalData");

const searchInput = document.getElementById("searchInput");

const refreshBtn = document.getElementById("refreshBtn");


/*====================================================
HALAMAN DIBUKA
====================================================*/

document.addEventListener("DOMContentLoaded", () => {

    loadData();

});


/*====================================================
AMBIL DATA DARI OPENSHEET
====================================================*/

async function loadData(){

    showLoading();

    hideError();

    hideEmpty();

    listJemaat.innerHTML = "";

    try{

            const body = new URLSearchParams();

            body.append("action","GET_JEMAAT_BARU");

            const response = await fetch(API_URL,{

                method:"POST",

                body:body

            });

            if(!response.ok){

                throw new Error("Gagal mengambil data");

            }

            const data = await response.json();

            data.sort((a,b)=>{

                return parseTimestamp(b["Timestamp"]) -
                    parseTimestamp(a["Timestamp"]);

            });

            semuaData = data;
            dataTampil = [...data];

            totalData.innerHTML = semuaData.length;

            hideLoading();

            if(semuaData.length===0){

                showEmpty();
                return;

            }

renderData(semuaData);

            data.sort((a,b)=>{

                return parseTimestamp(b["Timestamp"]) - parseTimestamp(a["Timestamp"]);

            });

            semuaData = data;
            dataTampil = [...data];

            totalData.innerHTML = semuaData.length;

            hideLoading();

            if(semuaData.length===0){

                showEmpty();

                return;

            }

            renderData(semuaData);

        }

    catch(error){

        console.error(error);

        hideLoading();

        showError();

    }

}


/*====================================================
LOADING
====================================================*/

function showLoading(){

    loadingBox.classList.remove("d-none");

}

function hideLoading(){

    loadingBox.classList.add("d-none");

}


/*====================================================
ERROR
====================================================*/

function showError(){

    errorBox.classList.remove("d-none");

}

function hideError(){

    errorBox.classList.add("d-none");

}


/*====================================================
EMPTY
====================================================*/

function showEmpty(){

    emptyBox.classList.remove("d-none");

}

function hideEmpty(){

    emptyBox.classList.add("d-none");

}


/*====================================================
RENDER DATA
====================================================*/
function renderData(data){

    dataTampil = [...data];

    listJemaat.innerHTML = "";

    data.forEach((item,index)=>{

        listJemaat.innerHTML += createCard(item,index);

    });

    aktifkanCard();

}


/*====================================================
CONVERT GOOGLE DRIVE URL
====================================================*/

function getDriveImage(url){

    if(!url) return "";

    // format:
    // https://drive.google.com/open?id=xxxxx
    if(url.includes("open?id=")){

        const id = url.split("open?id=")[1];

        return `https://drive.google.com/thumbnail?id=${id}&sz=w300`;

    }

    // format:
    // https://drive.google.com/file/d/xxxxx/view
    if(url.includes("/file/d/")){

        const id = url.split("/file/d/")[1].split("/")[0];

        return `https://drive.google.com/thumbnail?id=${id}&sz=w300`;

    }

    return url;

}

/*====================================================
FORMAT NOMOR WHATSAPP
====================================================*/

function formatWhatsapp(nomor){

    if(!nomor) return "";

    nomor = nomor.replace(/\D/g,"");

    if(nomor.startsWith("0")){

        nomor = "62" + nomor.substring(1);

    }

    return nomor;

}

function formatTanggal(tanggal){

    if(!tanggal) return "-";

    const d = new Date(tanggal);

    return d.toLocaleDateString("id-ID",{

        day:"numeric",

        month:"long",

        year:"numeric"

    });

}


/*====================================================
PARSE TIMESTAMP GOOGLE FORM
====================================================*/
function parseTimestamp(timestamp){

    if(!timestamp) return 0;

    const bagian = timestamp.split(" ");

    const tanggal = bagian[0].split("/");
    const waktu = (bagian[1] || "00:00:00").split(":");

    const bulan = parseInt(tanggal[0],10) - 1;
    const hari = parseInt(tanggal[1],10);
    const tahun = parseInt(tanggal[2],10);

    const jam = parseInt(waktu[0],10);
    const menit = parseInt(waktu[1],10);
    const detik = parseInt(waktu[2],10);

    return new Date(
        tahun,
        bulan,
        hari,
        jam,
        menit,
        detik
    ).getTime();

}

/*====================================================
MEMBUAT CARD JEMAAT
====================================================*/

function createCard(item,index){

    const nama = item["Nama Lengkap"] || "-";

    // Kolom Google Form nanti
    const foto = getDriveImage(item["Pas Foto"]);

    let avatar = "";

    if(foto){

        avatar = `
            <img
                src="${foto}"
                class="avatar"
                onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">

            <div class="avatar-default" style="display:none;">
                <i class="fa-solid fa-user"></i>
            </div>
        `;

    }else{

        avatar = `
            <div class="avatar-default">
                <i class="fa-solid fa-user"></i>
            </div>
        `;

    }

    return `

    <div class="jemaat-card" data-index="${index}">

        <div class="d-flex align-items-center">

            ${avatar}

            <div class="ms-3 flex-grow-1">

                <div class="nama">

                ${nama}

            </div>

            <div class="bergabung-sejak">

    Bergabung sejak: ${formatTanggal(item["Timestamp"])}

</div>

            </div>

            <i class="fa-solid fa-chevron-right text-secondary"></i>

        </div>

    </div>

    `;

}

/*====================================================
AKTIFKAN CLICK CARD
====================================================*/

function aktifkanCard(){

    document.querySelectorAll(".jemaat-card").forEach(card=>{

        card.addEventListener("click",()=>{

            const index = card.dataset.index;

            showDetail(dataTampil[index]);

        });

    });

}


/*====================================================
BADGE BAPTIS
====================================================*/

function getBaptisBadge(status){

    if(!status){

        return `<span class="badge badge-secondary">-</span>`;

    }

    const value = status.toUpperCase();

    if(value==="YA"){

        return `<span class="badge badge-success">Sudah</span>`;

    }

    if(value==="TIDAK"){

        return `<span class="badge badge-danger">Belum</span>`;

    }

    return `<span class="badge badge-secondary">${status}</span>`;

}


/*====================================================
BADGE STATUS JEMAAT
====================================================*/

function getStatusBadge(status){

    if(!status){

        return `<span class="badge badge-secondary">-</span>`;

    }

    switch(status){

        case "Jemaat":

            return `<span class="badge badge-primary">${status}</span>`;

        case "Pelayan":

            return `<span class="badge badge-success">${status}</span>`;

        case "Simpatisan":

            return `<span class="badge badge-warning">${status}</span>`;

        default:

            return `<span class="badge badge-secondary">${status}</span>`;

    }

}


/*====================================================
SEARCH
====================================================*/

searchInput.addEventListener("keyup",()=>{

    const keyword = searchInput.value.toLowerCase();

    const hasil = semuaData.filter(item=>{

        return (item["Nama Lengkap"] || "")
        .toLowerCase()
        .includes(keyword);

    });

    renderData(hasil);

});


/*====================================================
DETAIL JEMAAT
====================================================*/

function showDetail(item){

    const detailContent = document.getElementById("detailContent");

    const foto = getDriveImage(item["Pas Foto"] || "");
    console.log("Pas Foto :", item["Pas Foto"]);
    console.log("Foto URL :", foto);

const fotoHtml = foto
                    ? `
                    <img
                        src="${foto}"
                        class="detail-avatar"
                        style="cursor:pointer"
                        onclick="previewFoto('${foto}')"
                        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">

                    <div class="detail-avatar-default" style="display:none;">
                        <i class="fa-solid fa-user"></i>
                    </div>
                    `
                    :
                    `
                    <div class="detail-avatar-default">
                        <i class="fa-solid fa-user"></i>
                    </div>
                    `;


    detailContent.innerHTML = `

        <div class="text-center mb-4">

    ${fotoHtml}

    <h4 class="mt-3 fw-bold">

        ${item["Nama Lengkap"] || "-"}

    </h4>

</div>

<table class="table table-striped">

            <tr>
                <th width="40%">Nama Lengkap</th>
                <td>${item["Nama Lengkap"] || "-"}</td>
            </tr>

            <tr>
                <th width="40%">Bergabung Sejak</th>
                <td>${formatTanggal(item["Timestamp"]) || "-"}</td>
            </tr>

            <tr>
                <th>Jenis Kelamin</th>
                <td>${item["Jenis Kelamin"] || "-"}</td>
            </tr>

            <tr>
                <th>Tempat Lahir</th>
                <td>${item["Tempat Lahir"] || "-"}</td>
            </tr>

            <tr>
                <th>Tanggal Lahir</th>
                <td>${item["Tanggal Lahir"] || "-"}</td>
            </tr>

            <tr>
                <th>Nomor Telepon</th>
                <td>${item["Nomor Telepon"] || "-"}</td>
            </tr>

            <tr>
                <th>Alamat</th>
                <td>${item["Alamat Lengkap"] || "-"}</td>
            </tr>

            <tr>
                <th>Pekerjaan</th>
                <td>${item["Pekerjaan"] || "-"}</td>
            </tr>

            <tr>
                <th>Status Baptis</th>
                <td>${item["Apakah Sudah Baptis Selam"] || "-"}</td>
            </tr>

            <tr>
                <th>Status Pernikahan</th>
                <td>${item["Status Pernikahan"] || "-"}</td>
            </tr>

            <tr>
                <th>Nama Pasangan</th>

                <td>${item["Nama Istri/Suami"] || "-"}</td>
            </tr>

            <tr>
                <th>Nama Anak</th>
                <td>${item["Nama anak"] || "-"}</td>
            </tr>

            <tr>
                <th>Status di GBI</th>
                <td>${item["Status di GBI Altar Tabernakel Batam"] || "-"}</td>
            </tr>

            <tr>
                <th>KOMSEL / SDK</th>
                <td>${item["Apakah sudah terdaftar di salah satu Ibadah KOMSEL atau SDK (Surga Dalam Keluarga)?"] || "-"}</td>
            </tr>

        </table>

<div class="mt-4 d-grid gap-2">

    <a
        href="https://wa.me/${formatWhatsapp(item["Nomor Telepon"] || "")}"
        target="_blank"
        class="btn btn-success">

        <i class="fa-brands fa-whatsapp me-2"></i>

        Chat WhatsApp

    </a>

    <a
        href="https://wa.me/${formatWhatsapp(item["Nomor Telepon"] || "")}"
        target="_blank"
        class="btn btn-outline-success">

        <i class="fa-solid fa-phone me-2"></i>

        Telepon via WhatsApp

    </a>

</div>

`;

    const canvas = new bootstrap.Offcanvas(
        document.getElementById("detailCanvas")
    );

    canvas.show();

}

/*====================================================
PREVIEW FOTO
====================================================*/
function previewFoto(url){

    document.getElementById("fotoPreview").src = url;

    const modal = new bootstrap.Modal(
        document.getElementById("fotoModal")
    );

    modal.show();

}


function logout(){

    // Tutup modal
    const modal =
        bootstrap.Modal.getInstance(
            document.getElementById("logoutModal")
        );

    if(modal){
        modal.hide();
    }

    // Hapus session login
    localStorage.removeItem("GBI_LOGIN_TOKEN");
    localStorage.removeItem("GBI_TOKEN_EXPIRED");

    // Kembali ke halaman login
    window.location.href = "index.html";

}

function showLogoutModal(){

    const modal = new bootstrap.Modal(
        document.getElementById("logoutModal")
    );

    modal.show();

}

