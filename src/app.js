var map, infoWindow, geocoder;

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
    ]
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
        $('#location').text(results[0].formatted_address);      
        var pyrmont = new google.maps.LatLng(lat, lng);
        var request = {
          location: pyrmont,
          radius: 2000,
          type: ['cafe']
        };
       
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);
      } else {
        $('#location').text('Localizacion no encontrada');
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
  
  var placeLoc = place.geometry.location;

  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    icon: {
      url: icon,
      scaledSize: new google.maps.Size(20, 20) // pixels
    },
    animation: google.maps.Animation.DROP
  });
  
  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent(place.name+ '<br>' +place.vicinity);
    infoWindow.open(map, this);
  });
}
