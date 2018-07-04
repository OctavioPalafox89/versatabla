// Realizando la peticion

function realizarPeticion(url, metodo, funcion) {
  var peticionHTTP;
  if (window.XMLHttpRequest)
    peticionHTTP = new XMLHttpRequest();
  else peticionHTTP = new ActiveXObject("Microsoft.XMLHTTP");
  //Definir una funciòn de como actuar:
  peticionHTTP.onreadystatechange = function() {
    funcion(peticionHTTP);
  }
  //Realizar la peticiòn
  peticionHTTP.open(metodo, url, true);
  peticionHTTP.send(null);
}


function descargaArchivo() {
  realizarPeticion(nodeApiUrl + 'api/v1/vehicle-price-special/?slug=' + slug + '&token=' + tokenClient, 'GET', funcActuadora);
  realizarPeticion(nodeApiUrl + 'api/v1/vehicle-price-special/versions-by-slug/' + slug + '?token=' + tokenClient, 'GET', funcVersiones);
}

function funcActuadora(peticionHTTP) {
  console.log("mensaje");
  if (peticionHTTP.readyState == 4)
    if (peticionHTTP.status == 200) {
      var vehiculo = JSON.parse(peticionHTTP.responseText);
      console.log(vehiculo);

      //Peticion de titulo
      document.getElementById('title').innerHTML = vehiculo.landingPriceSpecial.title;

      //Peticion de presentacion
      document.getElementById('copyPresentation').innerHTML = vehiculo.landingPriceSpecial.copyPresentation;

      //Peticion de leyenda
      document.getElementsByClassName('generalIntro')[0].innerHTML = vehiculo.landingPriceSpecial.copyLeyend;

      //Peticion de vigencia
      document.getElementById('validity').innerHTML = (formatValidity(vehiculo.landingPriceSpecial.validity.start, vehiculo.landingPriceSpecial.validity.finish));

      //Peticion de terminos
      document.getElementById('disclaimer').innerHTML = vehiculo.landingPriceSpecial.copyTerms;

      //Peticion de legales
      document.getElementsByClassName('legalTxt')[0].innerHTML = vehiculo.landingPriceSpecial.copylegals;

      //Peticion de copyversions
      document.getElementsByClassName('tableIntro')[0].innerHTML = vehiculo.landingPriceSpecial.copyVersions;

      //Peticion de la tabla



    }
}

function funcVersiones(peticionHTTP) {
  console.log("mensaje");
  if (peticionHTTP.readyState == 4)
    if (peticionHTTP.status == 200) {
      var versions = JSON.parse(peticionHTTP.responseText);
      console.log(versions);
      versions.sort(function(a, b) {
        return a.order - b.order;
      })
      versions.forEach(function(version) {
        console.log(formatMoney(version.priceSpecial, 0))
      })
    }
}

window.onload = descargaArchivo;

var nodeApiUrl = 'https://nissan-api.tbwa.mx/';
var tokenClient = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOlsiY2xpZW50Il0sImV4cGlyZXNJbiI6MTUwMDQ3ODg2MTU2OCwiaWF0IjoxNTAwNDc4NzQxfQ.h2RJQ2K_sWWK0u8fOmvIQ3rS85FHkQUIIH0MylY2PJA";

var formatValidity = function(date1, date2) {
  var str = "";
  if (date1 && date2) {
    date1 = new Date(date1);
    date1.setDate(date1.getDate() + 1);
    date2 = new Date(date2);
    date2.setDate(date2.getDate() + 1);
    var meses = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre"
    ];
    var nextYear = false;
    var nextMonth = false;
    if (date1.getFullYear() != date2.getFullYear()) {
      nextYear = true;
    }
    if (date1.getMonth() != date2.getMonth()) {
      nextMonth = true;
    }
    if (nextYear === false) {
      if (nextMonth === false) {
        str = "Precios válidos del " + ("0" + date1.getDate()).slice(-2) + " al " + ("0" + date2.getDate()).slice(-2) + " de " + meses[date1.getMonth()] + " de " + date1.getFullYear() + ".";
      } else {
        str = "Precios válidos del " + ("0" + date1.getDate()).slice(-2) + " de " + meses[date1.getMonth()] + " al " + ("0" + date2.getDate()).slice(-2) + " de " + meses[date2.getMonth()] + ' de ' + date1.getFullYear() + ".";
      }
    } else {
      str = "Precios válidos del " + ("0" + date1.getDate()).slice(-2) + " de " + meses[date1.getMonth()] + " de " + date1.getFullYear() + " al " + ("0" + date2.getDate()).slice(-2) + " de " + meses[date2.getMonth()] + ' de ' + date2.getFullYear() + ".";
    }
  }
  return str;
}

var formatMoney = function(n, decPlaces, thouSeparator, decSeparator) {
  var decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
    decSeparator = decSeparator == undefined ? "." : decSeparator,
    thouSeparator = thouSeparator == undefined ? "," : thouSeparator,
    sign = n < 0 ? "-" : "",
    i = parseInt(n = Math.abs(+n || 0).toFixed(decPlaces)) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;
  return sign + (j ? i.substr(0, j) + thouSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator) + (decPlaces ? decSeparator + Math.abs(n - i).toFixed(decPlaces).slice(2) : "");
};
