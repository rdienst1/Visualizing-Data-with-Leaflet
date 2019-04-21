
// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var tectUrl="https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

function getColor(mag) {
    var red = 255; 
    var green = 255;
    var stepSize = 6;
    if (mag >= 0 && mag <= 1) 
    {
        col="ff";
    }
    else if (mag > 1 && mag <= 2) 
        col="e9";
    else if (mag > 2 && mag <= 3)
        col="d5";
    else if (mag > 3 && mag <= 4) 
        col="99";
    else if (mag > 4 && mag <= 5)
        col="66";
     else 
        return "#ff0000"
    return "#ff"+col+"00"
}

//Colored Cirlces
var tect=function tect_data(){
    d3.json(tectUrl,function(data){
     console.log(data.features.geometry.coordinates);
     return data.features.geometry.coordinates
 })
}
d3.json(queryUrl,function(data){
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    var earthquakes=L.geoJson(earthquakeData, {
        pointToLayer: function(data, latlng) {
          return L.circleMarker(latlng, {
            radius: data.properties.mag * 6,
            color: getColor(data.properties.mag),
            opacity: 0.75,
            fillOpacity: 0.75,
            weight: 0
          }).bindPopup("<h3>" + data.properties.place +
          "</h3><hr><p>" + new Date(data.properties.time) + "</p>" + "<p>" +"Magnitude: "+data.properties.mag + "</p>");
        }
      });

    // // Sending  earthquakes layer to the createMap function
    createMap(earthquakes);
    
  }
  
  function createMap(earthquakes) {


  // Defining streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create map, giving streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
