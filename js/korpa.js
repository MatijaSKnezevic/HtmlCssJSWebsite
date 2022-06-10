
$(document).ready(function(){
    let proizvodi = uKorpiProizvodi();
    if(!proizvodi.length){
        prikazPrazneKorpe();
    } else {
        // console.log(proizvodi);
        ispisiSadrzajKorpe();
    }
});

function ispisiSadrzajKorpe(){
    let proizvodi = uKorpiProizvodi();

    $.ajax({
        url: "data/galerija.json",
        method: "GET",
        type: "json",
        success: function(data){
            let proizvodiZaIspis = [];
            proizvodiZaIspis = data.filter(function(element){
                for(let pr of proizvodi){
                    if(element.id == pr.id){
                        element.quantity = pr.quantity;
                        return true;
                    }
                }
                return false;
            });

            drawTable(proizvodiZaIspis); 
        },
        error: function(error, xhr, status){
            console.log(error);
        }
    });
}

function drawTable(proizvodi){
    let ispis = `            
    <thead>
        <tr>
            <th>Naziv</th>
            <th>Slika</th>
            <th>Kolicina</th>
            <th>Prosek</th>
            <th>Uklonite</th>
        </tr>
    </thead><tbody>`;
    proizvodi.forEach(function(proizvod){
        ispis += ispisTabele(proizvod);
    });

    ispis += `</tbody>`;

    $("#korpa").html(ispis);

    function ispisTabele(proizvod){
        return `
        <tr class="red">
            <td class="kolona">${proizvod.kategorije.kategorija}</td>
            <td class="kolona"><img src="${proizvod.slika.src}" alt="${proizvod.slika.alt}" width="100%" height="200px" /></td>
            <td class="kolona">${proizvod.quantity}</td>
            <td class="kolona">${proizvod.cena * proizvod.quantity} din.</td>
            <td class="kolona"><a onClick='ukloniProizvod(${proizvod.id})'>Izbrisi</a></td>
        </tr>`;
    }
}
function prikazPrazneKorpe(){
    $("#korpa").hide();
    $("#praznaKorpa").fadeIn().html("<h1>Prazna je korpa</h1>");
}
function uKorpiProizvodi(){
    return JSON.parse(localStorage.getItem("proizvodi"));
}
function ukloniProizvod(id){
    let proizvodi = uKorpiProizvodi();
    let niz = proizvodi.filter(p => p.id != id);

    localStorage.setItem("proizvodi",JSON.stringify(niz));

    if(niz.length){
        ispisiSadrzajKorpe();
    } else {
        prikazPrazneKorpe();
    }

}
