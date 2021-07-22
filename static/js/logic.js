// API URL
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson" ;

// Request the data
d3.json(queryUrl).then(function(data) {
    //check the data
    console.log(data)
    // Run createFeatures function with data
    createFeatures(data.features);

});

function createFeatures(earthquakeData) {


    function getColor(coordinates) {
      // for (var i = 0; i < earthquakeData.length; i++) {

        // Conditionals for countries points
        var color = "";
        if (coordinates[2] >= 90) {
          color = "#154360";
        }
        else if (coordinates[2] <= 89 && coordinates[2] >= 70) {
          color = "#1F618D";
        }
        else if (coordinates[2] <= 69 && coordinates[2] >= 50) {
          color = "#2980B9";
        }
        else if (coordinates[2] <= 49 && coordinates[2] >= 30) {
            color = "#5499C7";
          }
          else if (coordinates[2] <= 29 && coordinates[2] >= 10) {
            color = "#7FB3D5";
          }
        else {
          color = "#D4E6F1";
        }
       
        return (color);
        // switch(coordinates[2]) {
        // case (coordinates[2] >= 90) :
        //   return "blue";
        
        // case (coordinates[2] <= 89 && coordinates[2] >= 70) :
        //   return "green";
        
        // case (coordinates[2] <= 69 && coordinates[2] >= 50) :
        //   return "yellow";
        
        // case (coordinates[2] <= 49 && coordinates[2] >= 30) :
        //   return "orange";
          
        // case (coordinates[2] <= 29 && coordinates[2] >= 10) :
        //     return "red";
          
        // case (coordinates[2] < 10):
        //   return "pink";
        
       
        }

    // }
  
    
    function getRadius(mag) {
      var radius = Math.floor(mag) * 7
      return radius
    }

    //Run a function for each feature to create the pop-up 
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p><p>" + "Magnitude: "+ feature.properties.mag + "</p><p>" + "Depth: "+ feature.geometry.coordinates[2] + "</p>");
    }
  
    // Create the geoJSON layer
    var earthquakes = L.geoJSON(earthquakeData, {
      pointToLayer: function (feature, latlng) {
        return new L.CircleMarker(latlng, {radius: getRadius(feature.properties.mag), 
                                            fillOpacity: 1, 
                                            color: 'black', 
                                            fillColor: getColor(feature.geometry.coordinates), 
                                            weight: 1,});
        },
      onEachFeature: onEachFeature,

    });
  

  // send earthquake layer to the creatMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define lightmap layer
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layer
  var baseMaps = {
    "Light Map": lightmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [lightmap, earthquakes]
  });

  /*Legend specific*/
var legend = L.control({ position: "bottomleft" });

legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>Earthquake Depths</h4>";
  div.innerHTML += '<i style="background: #D4E6F1"></i><span>-10 - 10</span><br>';
  div.innerHTML += '<i style="background: #7FB3D5"></i><span>10 - 30</span><br>';
  div.innerHTML += '<i style="background: #5499C7"></i><span>30 - 50</span><br>';
  div.innerHTML += '<i style="background: #2980B9"></i><span>50 - 70</span><br>';
  div.innerHTML += '<i style="background: #1F618D"></i><span>70 - 90</span><br>';
  div.innerHTML += '<i style="background: #154360"></i><span>90+</span><br>';

  return div;
};

legend.addTo(myMap);


  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

