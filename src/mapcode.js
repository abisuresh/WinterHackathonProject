import React from 'react'
import $ from 'jquery'

$( document ).ready(function() {
	 
   
   // _________Create the map___________
    
    // This will contain the map:
    var mapDiv = document.getElementById("mapDiv");
    var map;
  
    // These store the user's location:
    var myLat;
    var myLon;
    
    // Get the user's location:
    function getLocation() {
      if (navigator.geolocation) {
        // if the browser and user allow it, get their location data, and try to call createMap(). If they allow it but it doesn't work, call showError(). If they don't allow it, show the "not supported" message. 
        navigator.geolocation.getCurrentPosition(createMap, showError);
      } else {
        mapDiv.innerHTML = "Geolocation is not supported by this browser.";
      }
    }
    
    // Create a map centered on the user's location:
    function createMap(position) {
      // Assign the global variables we created above:
      myLat = position.coords.latitude;
      myLon = position.coords.longitude; 
      // Generate the map, centered on the user:
      map = new window.google.maps.Map(document.getElementById('mapDiv'), {
        center: {
          lat: myLat,
          lng: myLon
        },
        zoom: 12
      });
    }

// displays errors in case the map does not load:
    function showError(error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          mapDiv.innerHTML = "User denied the request for Geolocation."
          break;
        case error.POSITION_UNAVAILABLE:
          mapDiv.innerHTML = "Location information is unavailable."
          break;
        case error.TIMEOUT:
          mapDiv.innerHTML = "The request to get user location timed out."
          break;
        case error.UNKNOWN_ERROR:
          mapDiv.innerHTML = "An unknown error occurred."
          break;
      }
    }



// _____ MAP MARKERS ______

// img of horseless carriage:
var driverImg = 'https://sc01.alicdn.com/kf/HTB1DwZuiVkoBKNjSZFkq6z4tFXan/classic-5-seats-passenger-model-T-car.jpg_50x50.jpg';

// img of classy gentleman:
var passengerImg = 'https://chairish-prod.freetls.fastly.net/image/product/sized/d763ee22-afe6-442c-ac73-b10be3ff2d59/19th-c-french-gentleman-oil-painting-on-canvas-1949?aspect=max&width=50&height=50';

// this will get called for each user on the map.
    function addMarker(lat, lon, type) {
      var icon = passengerImg;
      if (type == 'driver')
        {
          icon = driverImg;
        }
      if (typeof lat == 'string') { lat = parseFloat(lat);}
      if (typeof lon == 'string') { lon = parseFloat(lon);}
      
      
      var marker = new window.google.maps.Marker({
        position: {
          lat: lat,
          lng: lon
        },
        map: map,
        icon: icon
        })
      };
    


// populates the map with other users, a list of which is returned from the server.
function updateMap(users){
  /* Users should be an ARRAY of JSON objects. Each object should look like this:
  {
    "lat": 29.7604,
    "lon": 95.3698,
    "type": "driver"
  }
  */
  console.log(users);
  for (var i in users)
    {
      addMarker(users[i].lat, users[i].lon, users[i].type);
    }
}
  
  
  
// _______Buttons_________

var myType;

$('#amDriver').click(function(){
  myType = 'driver';
  updateServer();
})

$('#amPassenger').click(function(){
  myType = 'passenger';
  updateServer();
})

    

// _______Communication with the server________

function pollServer()
// This sends the server your current location, and updates the map with the current data from the server.
{
  // send an HTTP GET request to the '/poll' endpoint on the server
  $.ajax({
    type: "GET",
    dataType: 'JSON',
    url: '/poll'
  })    // it expects to be returned an array of JSON objects, each representing a user.
  .done(function(res) {
    updateMap(res);  // it will call updateMap with that array of objects once it receives it.
  })
  .fail(function(err) { // if no response, log the error in the console.
    console.log('Error while polling server: ' + err.status);
  });
}

function updateServer()
// This is called when you press one of the buttons to be a driver or be a passenger. It tells the server where and what you are.
{
  console.log('calling updateServer()');
  $.ajax({
    type: 'POST',
    url: '/updateUser',
    dataType: 'json',
    data: {lat: myLat,
           lon: myLon,
           type: myType
         }})
  
    pollServer();
    setTimeout(pollServer(), 1000);
    }
    
    
  /* Sample response from server:
  res = [{"lat": 29.7604,
      "lon": 95.3698,
      "type": "driver"},
           {"lat": 29.7603,
      "lon": 95.3699,
      "type": "passenger"}];
      */



// ______Start the program______
// center the map on the user.
    getLocation();

// poll the server every 10 seconds.
    setInterval(pollServer(), 10000)


});
