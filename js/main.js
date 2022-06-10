$(document).ready(function(){
    prikazKategorija();
    prikazGalerije();    
    prikazPocetne();
    prikazMenija();
    prikazRadio();

    
    $("#trazi").keyup(pretragaProizvoda);

});

//RADIO
function prikazRadio(){
    $.ajax({
        url:"data/radio.json",
        method:"GET",
        type:"JSON" ,
        success:function(radio){
                ispisRadio(radio);
            }
        
    });
    }

function ispisRadio(radio){
    var ispis="";
    for(let rad of radio){
        ispis+= ispisJednogRadio(rad);
    }
    
    $("#sort").html(ispis);
    

    $("#opadajuce").click(sortirajPoCeniOpadajuce);
    $("#rastuce").click(sortirajPoCeniRastuce);


};
function ispisJednogRadio(rad){
return  `  <input id="${rad.id}" type="radio" name="sortiraj" value="${rad.value}"> ${rad.tekst}

`   
}

//pretraga
function pretragaProizvoda(){
let unosNazivaProizvoda = $(this).val();
$.ajax({
    url: "data/galerija.json",
    method: "GET",
    type: "json",
    success: function(proizvodi){
        let filtriraniP = proizvodi.filter(function(sl){
            if(sl.tekst.toUpperCase().indexOf(unosNazivaProizvoda.toUpperCase()) != -1){
                return true;
            }
        });

        ispisGalerije(filtriraniP);
    },
    error: function(error, xhr, status){
        console.log(error);
    }
});
}
//MENI

function prikazMenija(){
$.ajax({
    url:"data/meni.json",
    method:"GET",
    type:"JSON" ,
    success:function(artikli){
            ispisMenija(artikli);
        }

});}

function ispisMenija(artikli){
var ispis="";
for(let dat of artikli){
    if(dat.ispisi){
    ispis += ispisJednogMenija(dat);
}else{
ispis += ispisJednogMenijaDesno(dat);
}
}
$("#zaMeni2").html(ispis);

};
function ispisJednogMenijaDesno(dat){
let ispis="";
console.log(dat);
ispis+=`<section class="gLevo">
<img src="${dat.slika.src}" alt="${dat.slika.alt}" class="levo">
<div class="tekst">
<ul class="levo">`
for(let da of dat.tekst){
    ispis+=`<li>${da.naziv}${da.cena}.00 RSD</li>`
}    ispis+=`</ul>
</div>
</section>
`
return ispis;   
}
function ispisJednogMenija(dat){
let ispis="";
ispis+= `<section class="gLevo">
<div class="tekst">
<ul class="levo">`
for(let da of dat.tekst){
ispis+=`<li>${da.naziv}${da.cena}.00 RSD</li>`
} 
ispis+=`</ul>
</div>
<img src="${dat.slika.src}" alt="${dat.slika.alt}" class="levo">
</section>
`
return ispis;
}

//POCETNA
function prikazPocetne(){
$.ajax({
    url:"data/pocetni.json",
    method:"GET",
    type:"JSON" ,
    success:function(artikli){
            ispisPocetne(artikli);
        }
});}
function ispisPocetne(artikli){
    var ispis="";
    for(let dat of artikli){
        if(dat.ispisi){
        ispis += ispisPocetneLevo(dat);
    }else{
    ispis += ispisPocetneDesno(dat);
}
console.log(dat.ispisi);
    }
    $("#zaJson").after(ispis);
    

};
function ispisPocetneDesno(dat){
return  `<section class="gLevo">
<img src="${dat.slika.src}" alt="${dat.slika.alt}" class="levo">
<div class="tekst">
<h4 class="levo"><br>${dat.tekst}
    </h4>
    </div>
</section>
`   
}
function ispisPocetneLevo(dat){
return `<section class="gLevo">
<div class="tekst">
<h4 class="levo"><br>${dat.tekst}
    </h4>
    </div>
<img src="${dat.slika.src}" alt="${dat.slika.alt}" class="levo">
</section>
`
}
//KATEGORIJE
function prikazKategorija(){
$.ajax({
    url:"data/kategorije.json",
    method:"GET",
    type:"JSON" ,
    success:function(data){
         ispisKategorija(data)
    }
});
}
function ispisKategorija(data){
let ispis="";
for(let kat of data){
       ispis +=  ispisJedneKategorije(kat);
    }

$("#filter").html(ispis);
    $("#odadoz").click(sortirajOdAdoZ);
$('.filter-category').click(onFilterByCategory);
};
function ispisJedneKategorije(kat){
return `<input id="${kat.clasa}" class="${kat.clasa}" type="radio" data-id="${ kat.id }" name="radi1" value="${kat.id}"> ${kat.kategorija}`;
}
//GALERIJA
function prikazGalerije(){
$.ajax({
    url:"data/galerija.json",
    method:"GET",
    type:"JSON" ,
    success:function(galerija){
            ispisGalerije(galerija);   
                     
        }
    
});

}
function ispisGalerije(galerija){
let ispis = "";
    for(let sl of galerija){
        ispis+= ispisJedneSlike(sl);
    }
    $("#galerija").html(ispis);
    $(".zaKorpu").click(dodajUKorpu);

}
function ispisJedneSlike(sl){

return  `  <div class="col-md-4">
<div class="thumbnail">
  <a href="#" target="_blank">
    <img src="${sl.slika.src}" alt="${sl.slika.alt}" style="width:100%">
    <div class="caption">
    </a>
    <p>${sl.tekst}</p>
      
      <a href="#" class="zaKorpu btn btn-dark" data-id="${sl.id}">Korpa</a>
     
    </div>
  
</div>
</div>`
}
//Korpa
function uKorpiProizvodi(){
return JSON.parse(localStorage.getItem("proizvodi"));
}
function dodajUKorpu(e){
e.preventDefault();
let id = $(this).data("id");

var proizvodi = uKorpiProizvodi();

if(proizvodi){
    if(proizvodVecUkorpi()){
        pocecajKolicinu();
    }else {
        popuniLocalStorage();
    }
} else {
    dodajPrviProizvod();
}

alert("Proizvod u korpi");


function proizvodVecUkorpi(){
    return proizvodi.filter(p => p.id == id).length;
}

function popuniLocalStorage(){
    let proizvodi = uKorpiProizvodi();
    proizvodi.push({
        id: id,
        quantity: 1
    });
    localStorage.setItem("proizvodi", JSON.stringify(proizvodi));
}

function pocecajKolicinu(){
    let proizvodi = uKorpiProizvodi();
    for(let i in proizvodi){
        if(proizvodi[i].id == id){
            proizvodi[i].quantity++;
            break;
        }
    }
    localStorage.setItem("proizvodi", JSON.stringify(proizvodi));
}

function dodajPrviProizvod(){
    let proizvodi = [];
    proizvodi[0] = {
        id: id,
        quantity: 1
    };
    localStorage.setItem("proizvodi", JSON.stringify(proizvodi));
}
}

//sortiranje


function sortirajPoCeniOpadajuce() {

$.ajax({
    url : "data/meni.json",
    method : "GET",
    type : "json",
    success : function(slike) {
        slike.sort(function(a,b) {
            if(a.cena == b.cena)
                return 0;
                if(a.cena > b.cena){ 
                    a.ispisi=false;
                    return -1;
                     }
                else{
                    return 1;
     
     }
        });
        ispisMenija(slike);
    },
    error : function(xhr, error, status) {
        alert(status);
    }
});
}
function sortirajPoCeniRastuce(){
$.ajax({
    url:"data/meni.json",
    method:"get",
    type:"json",
    success:function(slike){
        slike.sort(function(a,b){
            if(a.cena == b.cena)
            return 0
            if(a.cena < b.cena){ 
                
                return -1;
                 }
            else{
                a.ispisi=false;
                return 1;
 
 }
        });
        ispisMenija(slike);
    }
});
}
function sortirajOdAdoZ(){
$.ajax({
    url:"data/galerija.json",
    method:"get",
    type:"json",
    success:function(galerija){
galerija.sort(function(a,b){
        if(a.tekst == b.tekst)
        return 0
        return a.tekst < b.tekst? -1: 1;
        }); 
        ispisGalerije(galerija);
    
}
    });

}
//filrtiranje
function onFilterByCategory(){


let categoryId = $(this).data('id');
console.log(categoryId);
$.ajax({
    url: "data/galerija.json",
    method: "GET",
    success: function(galerija){
        galerija = filterByCategory(galerija, categoryId);
        ispisGalerije(galerija);
        console.log(galerija);
    },
    error : function(xhr, error, status) {
        alert(status);
    }
});
}

function filterByCategory(galerija, categoryId){
return galerija.filter(x => x.kategorije.id == categoryId);
}
