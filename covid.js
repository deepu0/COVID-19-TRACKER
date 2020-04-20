window.onload = function() {
}

var map;
var markers = [];
var clearMarkers = [];
var casesListenerCountry = []
var deathsListenerCountry = []
var recoveredListenerCountry = []
var criticalListenerCountry = []

function searchCountry() {

    var input = document.getElementById('searchBar').value;
  
    document.getElementById('searchBar').value = "";
    for (let i of markers) {
      var a = input.toUpperCase();
      var b = i.country.toUpperCase();
  
      if (a == b) {
        google.maps.event.trigger(i.markers, 'click');
        break;
      }
  
    }
  
  }

function initMap() {

    var options = {
      zoom: 3,
      center: {
        lat: 20.5937,
        lng: 78.9629
      },
      styles: [{
          "elementType": "geometry",
          "stylers": [{
            "color": "#242f3e"
          }]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#746855"
          }]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#242f3e"
          }]
        }, {
          "featureType": "administrative.country",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#4b6878"
          }]
        }, {
          "featureType": "administrative.province",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#4b6878"
          }]
        }, {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [{
            "color": "#38414e"
          }]
        }, {
          "featureType": "road",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#212a37"
          }]
        }, {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [{
            "color": "#17263c"
          }]
        }, {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#515c6d"
          }]
        }, {
          "featureType": "water",
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#17263c"
          }]
        }
      ]
    };
    map = new google.maps.Map(document.getElementById('map'), options);
    viewCases(map);
  
  }
  
  
  async function viewCases(map) {
    clearMarkers.forEach(i => i.setMap(null))
    let inputData;
    await fetch('https://corona.lmao.ninja/v2/countries')
      .then(res => res.json())
      .then(data => {
        inputData = data;
        var totalDeaths = 0;
        var totalCases = 0;
        var totalRecoveries = 0;
        var totalCritical = 0;
        data.forEach(i => {
          totalDeaths += i.deaths;
          totalCases += i.cases;
          totalRecoveries += i.recovered;
          totalCritical += i.critical;
        })
  
        data.forEach(i => {
          var scale = Math.round(i.cases / totalCases * 100) + 5
          var coords = {
            lat: i.countryInfo.lat,
            lng: i.countryInfo.long
          }
          var marker = new google.maps.Marker({
            position: coords,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: 'red',
              fillOpacity: 0.6,
              scale: scale,
              strokeColor: 'white',
              strokeWeight: 0
            }
          });
          clearMarkers.push(marker)
          marker.setMap(map);
  
          markers.push({
            country: i.country,
            markers: marker
          });
  
          var infoWindow = new google.maps.InfoWindow({
  
            content: `      <div class="countryInfo">
                                <img class="info-flag"src=${i.countryInfo.flag}>
                                <h2>${i.country} (${i.countryInfo.iso3})</h2> 
                            </div>
                            <hr>
                            <h3>Cases: ${i.cases}</h3>
                            <h3>Deaths: ${i.deaths}</h3>
                            <h3>Recovered: ${i.recovered}</h3>
                            <h3>Today's Cases: ${i.todayCases}</h3>
                            <h3>Today's Deaths: ${i.todayDeaths}</h3>
                            <h3>Active: ${i.active}</h3>
                            <h3>Critical: ${i.critical}</h3>
                    `
          });
          marker.addListener('click', function () {
            infoWindow.open(map, marker);
          });
  
          marker.addListener('click', function () {
            map.setZoom(3);
            map.setCenter(marker.getPosition());
          });
  
        })
        
  
      });
  
  
  }

async function covid(){
  const response=await fetch('https://corona.lmao.ninja/countries');
  const data= await response.json();
  
  displayCountry(data);
};

  covid();
  function displayCountry(data){
    var storesHtml='';
    for(var [index,cont] of data.entries()){
      var contr=cont['country'];
      var c=cont['cases'];
      
      

      storesHtml += `
            <div class="store-container">
                <div class="store-container-background">
                    <div class="store-info-container">
                        <div class="store-address">
                            <span>${contr}</span>
                            <span style="color:red">Confirmed cases:${c}</span>
                            
                        </div>
                        
                    </div>
                    <div class="store-number-container">
                        <div class="store-number">
                            ${index+1}
                        </div>
                    </div>
                </div>
            </div>
        `
        document.querySelector('.stores-list').innerHTML = storesHtml; 
    }
  }

