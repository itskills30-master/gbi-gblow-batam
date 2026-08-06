const API_URL =
"https://script.google.com/macros/s/AKfycbxRmv1uHf_AB9vPSwCVDkI2AArrbRJQY49nQS5ERw28CAtZg7DJmo0CqflPLpgZhEkt/exec";

document.addEventListener("DOMContentLoaded",()=>{

    if(!checkSession()){
        return;
    }

    loadHost();

});

async function loadHost(forceRefresh=false){

    const list =
        document.getElementById("hostList");

    list.innerHTML=`
    <div class="text-center p-5">
        <div class="spinner-border text-primary"></div>
    </div>`;

    const body =
        new URLSearchParams();

    body.append(
        "action",
        "GET_HOST"
    );

    body.append(
        "token",
        getLoginToken()
    );

    try{

        const response =
            await fetch(API_URL,{
                method:"POST",
                body:body
            });

        const hasil =
            await response.json();

        console.log(hasil);

        renderHost(hasil);

    }

    catch(err){

        console.log(err);

        list.innerHTML=`
        <div class="alert alert-danger">
        Gagal mengambil data Host
        </div>`;

    }

}

function renderHost(data){

    const list =
        document.getElementById("hostList");

    list.innerHTML="";

    if(data.length===0){

        list.innerHTML=`
        <div class="alert alert-warning">

        Belum ada Host

        </div>`;

        return;

    }

    data.forEach(item=>{

        list.innerHTML += createCard(item);

    });

}

function getBadge(status){

    switch(status){

        case "AKTIF":
            return `<span class="badge-host badge-aktif">AKTIF</span>`;

        case "PENDING":
            return `<span class="badge-host badge-pending">PENDING</span>`;

        case "BLOKIR":
            return `<span class="badge-host badge-blokir">BLOKIR</span>`;

        default:
            return `<span class="badge-host bg-secondary">${status}</span>`;

    }

}

function createCard(item){

return `

<div class="host-card">

<div class="card-body">

<div class="host-header">

<div class="host-name">

👤 ${item["Nama Lengkap"]}

</div>

${getBadge(item["Status"])}

</div>

<div class="host-info">

📱 ${item["Nomor WhatsApp"]}

</div>

<div class="host-info">

🕒 Login terakhir

<br>

${item["Login Terakhir"] || "-"}

</div>

<select
class="form-select host-select"
onchange="ubahStatus('${item["Installation ID"]}',this.value)">

<option value="PENDING"
${item["Status"]=="PENDING"?"selected":""}>🟡 Pending</option>

<option value="AKTIF"
${item["Status"]=="AKTIF"?"selected":""}>🟢 Aktif</option>

<option value="BLOKIR"
${item["Status"]=="BLOKIR"?"selected":""}>🔴 Blokir</option>

</select>

<button
class="btn btn-danger btn-delete-host"
onclick="hapusHost('${item["Installation ID"]}')">

🗑 Hapus Host

</button>

</div>

</div>

`;

}

async function ubahStatus(id,status){

    const body = new URLSearchParams();

    body.append("action","UPDATE_HOST_STATUS");
    body.append("token",getLoginToken());
    body.append("id",id);
    body.append("status",status);

    try{

        const response = await fetch(API_URL,{
            method:"POST",
            body:body
        });

        const hasil = await response.json();

        alert(hasil.message);

    }

    catch(err){

        console.log(err);

        alert("Gagal mengubah status.");

    }

}

async function hapusHost(id){

    if(!confirm("Yakin ingin menghapus Host ini?")){
        return;
    }

    const body = new URLSearchParams();

    body.append("action","DELETE_HOST");
    body.append("token",getLoginToken());
    body.append("id",id);

    try{

        const response = await fetch(API_URL,{

            method:"POST",
            body:body

        });

        const hasil = await response.json();

        alert(hasil.message);

        if(hasil.success){

            loadHost(true);

        }

    }

    catch(err){

        console.log(err);

        alert("Gagal menghapus Host.");

    }

}