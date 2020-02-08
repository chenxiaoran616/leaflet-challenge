// API key
const API_KEY = "pk.eyJ1IjoiY2hlbnhpYW9yYW42MTYiLCJhIjoiY2s0MjBpZTFyMDZpODNucndseGJ4MzJ4YyJ9.V8mC9blL1NRu-mHzMTgMxA";

// pass url to variable
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var myMap = L.map("map", {
  center: [37.00, -96.00],
  zoom: 3

});

function markerSize(ms) {
  return ms*30000;
}

function chooseColor(mc) {
  switch (true) {
  case (0<=mc && mc<=1):
    return "#abd948";
  case (1<mc && mc<=2):
     return "#f2f581"; 
  case (2<mc && mc<=3):
    return "#f3cf61"; 
 case (3<mc && mc<=4):
    return "#d98e62";
    case (mc>4):
      return "#ea0437"; 
      default:
        return "black";}
  }

// add tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 12,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(myMap);

d3.json(queryUrl).then((data) => {
  
    console.log(data);
    for (var i = 0; i < data.features.length; i++) {
      var places= data.features[i].geometry;
     geojson= L.circle([places.coordinates[1],places.coordinates[0]], {
        fillOpacity: 0.9,
        weight:0.6,
        color: "black",
        fillColor: chooseColor(data.features[i].properties.mag),
        radius: markerSize(data.features[i].properties.mag)
      }).bindPopup("<h3>" + data.features[i].properties.place + " Mag: "+ data.features[i].properties.mag +
      "</h3><hr><p>" + new Date(data.features[i].properties.time) + "</p>").addTo(myMap)

  };
    // Set up the legend
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function(map) {
      var div = L.DomUtil.create("div", "legend");
      div.innerHTML += "<h4>Legend</h4>";
      div.innerHTML += '<i style="background: #ea0437"></i><span>> 4</span><br>';
      div.innerHTML += '<i style="background: #d98e62"></i><span>3-4</span><br>';
      div.innerHTML += '<i style="background: #f3cf61"></i><span>2-3</span><br>';
      div.innerHTML += '<i style="background: #f2f581"></i><span>1-2</span><br>';
      div.innerHTML += '<i style="background: #abd948"></i><span><1</span><br>';
      
         
      return div;
    };
    
  
    legend.addTo(myMap);
});
  