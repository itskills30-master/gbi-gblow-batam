/*====================================================
GBI ALTAR TABERNAKEL BATAM
STATISTIK
Version 1.0
====================================================*/


/*====================================================
API: AMBIL DARI Statistik.gs
====================================================*/
const GAS_URL =
"https://script.google.com/macros/s/AKfycbx_znLBmvdnBBPdft8Ia19t0X8ufaV54C3Kl-vd0lq19Uuy80h5reQ54i8E5E3UKTFAog/exec";


/*====================================================
GLOBAL
====================================================*/
let statistik = {};

let chartGender;
let chartUmur;
let chartBaptis;
let chartPernikahan;
let chartStatus;
let chartKomsel;
let chartTahun;

/*====================================================
HALAMAN DIBUKA
====================================================*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        loadStatistik();

    }

);

/*====================================================
AMBIL DATA
====================================================*/

async function loadStatistik(){

    try{

        const body = new URLSearchParams();

        body.append(
            "action",
            "GET_STATISTIK"
        );

        const response = await fetch(

            GAS_URL,

            {

                method:"POST",

                body:body

            }

        );

        const hasil = await response.json();

        console.log(hasil);

        if(!hasil.success){

            alert(hasil.message);

            return;

        }

        statistik = hasil.data;

        renderSummary();

        renderPieGender();

        renderPieUmur();

        renderPieBaptis();

        renderPiePernikahan();

        renderPieStatus();

        renderPieKomsel();

        renderBarTahun();

    }

    catch(err){

        console.log(err);

        alert("Gagal mengambil data statistik.");

    }

}

/*====================================================
SUMMARY
====================================================*/

function renderSummary(){

    document.getElementById("totalJemaat").innerHTML = statistik.total;
    document.getElementById("totalPria").innerHTML = statistik.pria;
    document.getElementById("totalWanita").innerHTML = statistik.wanita;
    document.getElementById("totalBaptis").innerHTML = statistik.baptis;

}

/*====================================================
HAPUS CHART LAMA
====================================================*/

function destroyChart(chart){

    if(chart){

        chart.destroy();

    }

}

/*====================================================
PIE CHART
JENIS KELAMIN
====================================================*/

function renderPieGender(){

    destroyChart(chartGender);

    chartGender = new Chart(

        document.getElementById("chartGender"),

        {

            type:"pie",

            data:{

                labels:[

                    "Pria",

                    "Wanita"

                ],

                datasets:[{

                    data:[

                        statistik.pria,

                        statistik.wanita

                    ],

                    backgroundColor:[

                        "#2196F3",

                        "#E91E63"

                    ],

                    borderWidth:2,

                    borderColor:"#ffffff"

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false,

                plugins:{

                    legend:{

                        position:"bottom",

                        labels:{

                            usePointStyle:true,

                            padding:20,

                            font:{

                                size:14

                            }

                        }

                    }

                }

            }

        }

    );

}


/*====================================================
PIE UMUR
====================================================*/

function renderPieUmur(){

    destroyChart(chartUmur);

    chartUmur = new Chart(

        document.getElementById("chartUmur"),

        {

            type:"pie",

            data:{

                labels:[

                    "Balita",

                    "Anak",

                    "Remaja",

                    "Dewasa",

                    "Lansia"

                ],

                datasets:[{

                    data:[

                        statistik.balita,

                        statistik.anak,

                        statistik.remaja,

                        statistik.dewasa,

                        statistik.lansia

                    ],

                    backgroundColor:[

                        "#8BC34A",

                        "#FFC107",

                        "#FF9800",

                        "#03A9F4",

                        "#9C27B0"

                    ]

                }]

            },

            options:{

                responsive:true,

                plugins:{

                    legend:{

                        position:"bottom"

                    }

                }

            }

        }

    );

}

/*====================================================
PIE BAPTIS
====================================================*/

function renderPieBaptis(){

    destroyChart(chartBaptis);

    chartBaptis = new Chart(

        document.getElementById("chartBaptis"),

        {

            type:"pie",

            data:{

                labels:[

                    "Sudah",

                    "Belum"

                ],

                datasets:[{

                    data:[

                        statistik.baptisYa,

                        statistik.baptisTidak

                    ],

                    backgroundColor:[

                        "#4CAF50",

                        "#F44336"

                    ]

                }]

            },

            options:{

                responsive:true,

                plugins:{

                    legend:{

                        position:"bottom"

                    }

                }

            }

        }

    );

}

/*====================================================
PIE PERNIKAHAN
====================================================*/

function renderPiePernikahan(){

    destroyChart(chartPernikahan);

    chartPernikahan = new Chart(

        document.getElementById("chartPernikahan"),

        {

            type:"pie",

            data:{

                labels:Object.keys(

                    statistik.pernikahan

                ),

                datasets:[{

                    data:Object.values(

                        statistik.pernikahan

                    ),

                    backgroundColor:[

                        "#3F51B5",

                        "#FF9800"

                    ]

                }]

            },

            options:{

                responsive:true,

                plugins:{

                    legend:{

                        position:"bottom"

                    }

                }

            }

        }

    );

}


/*====================================================
PIE STATUS GBI
====================================================*/

function renderPieStatus(){

    destroyChart(chartStatus);

    chartStatus = new Chart(

        document.getElementById("chartStatus"),

        {

            type:"pie",

            data:{

                labels:Object.keys(

                    statistik.statusGBI

                ),

                datasets:[{

                    data:Object.values(

                        statistik.statusGBI

                    ),

                    backgroundColor:[

                        "#3F51B5",

                        "#00BCD4",

                        "#8BC34A",

                        "#FF9800",

                        "#9C27B0",

                        "#795548",

                        "#607D8B"

                    ],

                    borderWidth:2,

                    borderColor:"#ffffff"

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false,

                plugins:{

                    legend:{

                        position:"bottom",

                        labels:{

                            usePointStyle:true,

                            padding:18,

                            font:{

                                size:14

                            }

                        }

                    }

                }

            }

        }

    );

}

/*====================================================
PIE KOMSEL / SDK
====================================================*/

function renderPieKomsel(){

    destroyChart(chartKomsel);

    chartKomsel = new Chart(

        document.getElementById("chartKomsel"),

        {

            type:"pie",

            data:{

                labels:Object.keys(

                    statistik.komsel

                ),

                datasets:[{

                    data:Object.values(

                        statistik.komsel

                    ),

                    backgroundColor:[

                        "#4CAF50",

                        "#F44336"

                    ],

                    borderWidth:2,

                    borderColor:"#ffffff"

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false,

                plugins:{

                    legend:{

                        position:"bottom",

                        labels:{

                            usePointStyle:true,

                            padding:18,

                            font:{

                                size:14

                            }

                        }

                    }

                }

            }

        }

    );

}   

/*====================================================
KEMBALI KE INDEX
====================================================*/

/*====================================================
BAR CHART
BERGABUNG DARI TAHUN
====================================================*/

function renderBarTahun(){

    destroyChart(chartTahun);

    chartTahun = new Chart(

        document.getElementById("chartTahun"),

        {

            type:"bar",

            data:{

                labels:Object.keys(

                    statistik.tahunGabung

                ),

                datasets:[{

                    label:"Jumlah Jemaat",

                    data:Object.values(

                        statistik.tahunGabung

                    ),

                    backgroundColor:"#2196F3",

                    borderRadius:8

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false,

                plugins:{

                    legend:{

                        display:false

                    }

                },

                scales:{

                    y:{

                        beginAtZero:true,

                        ticks:{

                            precision:0

                        }

                    }

                }

            }

        }

    );

}

function kembaliIndex(){

    window.location.href = "index.html";

}