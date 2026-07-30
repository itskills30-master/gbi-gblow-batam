/*====================================================
KONFIGURASI
====================================================*/

const HOST_API_URL = 
"https://script.google.com/macros/s/AKfycbz_9fWGV72_KEneXI3cDgY9ekav16xXZo8LVXV0A1bpGV7sGJubez2-mvbaMLvcu0-rAg/exec";


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

            return;

        }


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

        error.classList.remove("d-none");

        error.textContent =
            error.message;

    }

}


/*====================================================
CARD HOST
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


    let badge = "";

    if(status === "AKTIF"){

        badge =
            `<span class="badge bg-success">
                AKTIF
             </span>`;

    }
    else if(status === "BLOKIR"){

        badge =
            `<span class="badge bg-danger">
                BLOKIR
             </span>`;

    }
    else{

        badge =
            `<span class="badge bg-secondary">
                ${status}
             </span>`;

    }


    return `

    <div class="card shadow-sm mb-3">

        <div class="card-body">

            <div class="d-flex
                        justify-content-between
                        align-items-start">

                <div>

                    <h5 class="fw-bold mb-1">

                        ${nama}

                    </h5>

                    <div class="text-muted">

                        <i class="fa-solid fa-user"></i>

                        ${username}

                    </div>

                    <div class="text-muted">

                        <i class="fa-brands fa-whatsapp"></i>

                        ${whatsapp}

                    </div>

                </div>


                <div>

                    ${badge}

                </div>

            </div>


            <hr>


            <div class="d-flex gap-2">

                <button
                    class="btn btn-success btn-sm flex-fill"
                    onclick="ubahStatusHost('${username}','AKTIF')">

                    <i class="fa-solid fa-check"></i>

                    Aktifkan

                </button>


                <button
                    class="btn btn-warning btn-sm flex-fill"
                    onclick="ubahStatusHost('${username}','BLOKIR')">

                    <i class="fa-solid fa-ban"></i>

                    Blokir

                </button>


                <button
                    class="btn btn-danger btn-sm"
                    onclick="hapusHost('${username}')">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </div>

        </div>

    </div>

    `;

}


/*====================================================
UBAH STATUS
====================================================*/

function ubahStatusHost(
    username,
    status
){

    alert(
        "Fitur " +
        status +
        " Host belum diaktifkan."
    );

}


/*====================================================
HAPUS HOST
====================================================*/


function hapusHost(username){

    alert(
        "Fitur hapus Host belum diaktifkan."
    );

}


/*====================================================
START
====================================================*/

document.addEventListener(
    "DOMContentLoaded",
    loadHost
);