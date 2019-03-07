var map, infoWindow, geocoder;

const API_KEY = '1dd1bc61141d44e5aae36cd0df6c3773';
const WEATHER_URL = 'http://api.openweathermap.org/data/2.5/weather?';

$(document).ready(function() {
  initMap();
});

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -22.974, lng: -43.180},
    zoom: 17,
    styles: [
      {
        featureType: "poi",
        stylers: [
          { visibility: "off" }
        ]
      }
    ],
    disableDefaultUI: true
  });
  infoWindow = new google.maps.InfoWindow;
  geocoder = new google.maps.Geocoder;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      geocodeLatLng(pos.lat, pos.lng);
      let urlWeather = WEATHER_URL + 'lat=' + pos.lat + '&lon=' + pos.lng + '&lang=es&units=metric&appid=' + API_KEY;
      $.get(urlWeather, function(data, status){
        console.log(data);         
        $('#temperature').text(data.main.temp+'°C');
        $('#humidity').text(data.main.humidity+'%');
        let description = capitalizeFirstLetter(data.weather[0].description);
        $('#description').text(description);
      });
      
      infoWindow.setPosition(pos);
      infoWindow.setContent('Estas Aqui');
      infoWindow.open(map);
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: El servicio de geolocalizacion fallo.' :
                        'Error: Su navegador no soporta geolocalizacion.');
  infoWindow.open(map);
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function geocodeLatLng(lat, lng) {
  var latlng = {
    lat: lat,
    lng: lng
  };
  geocoder.geocode({
    'location': latlng
  }, function(results, status) {
    if (status === 'OK') {
      if (results[0]) {
        map.setCenter(results[0].geometry.location);
        new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
        });        
        $('.location-text').text(results[0].formatted_address);      
        var pyrmont = new google.maps.LatLng(lat, lng);
        var request = {
          location: pyrmont,
          radius: 2000,
          type: ['cafe']
        };
       
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);
      } else {
        $('.location-text').text('Localizacion no encontrada');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
}


function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i], results[i].icon);
    }
  }
}

function createMarker(place, icon) {
  console.log(icon);

  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,       
    icon: {
      url: icon,
      scaledSize: new google.maps.Size(20, 20),
    },
    animation: google.maps.Animation.DROP
  });
  
  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent(place.name+ '<br>' +place.vicinity);
    infoWindow.open(map, this);
  });
}
