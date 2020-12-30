

var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});

var baseMaps = {
    "Light Map": lightmap
};

var map = L.map("map", {
    center: [40, -120],
    zoom: 4.5,
    layers: [lightmap]
});

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(response){
    console.log(response.features)
    var datapoints = response.features
    console.log(datapoints)

    var mags = [1,2,3,4,5,6]
    var circleColor = d3.scaleOrdinal().domain(mags)
    .range(["#00FF00","#66ff00","#ccff00","#FFCC00","#ff6600","#FF0000"]);
    var circleSize = d3.scaleLinear().domain([2,10]).range([25000,250000]);
    
    function returnMag(mag){
        if (mag < 1) {
            return 1;
        }   else if(mag < 2){
            return 2;
        }   else if(mag < 3){
            return 3;
        }   else if(mag < 4){
            return 4;
        }   else if(mag < 5){
            return 5;
        }   else {
            return 6;
        }
    };

    //FF0000,FF3300,ff6600,ff9900,FFCC00,FFFF00,ccff00,99ff00,66ff00,33ff00,00FF00
    //FF0000,ff6600,FFCC00,ccff00,66ff00,00FF00
    //"#00FF00","#66ff00","#ccff00","#FFCC00","#ff6600","#FF0000"

    datapoints.forEach(function(earthquake){
        //earthquake.properties.mag
        var color = circleColor(returnMag(earthquake.properties.mag))
        console.log(color)
        var size = circleSize(earthquake.properties.mag)
        console.log(earthquake.properties.mag)

        var newCircle = L.circle([earthquake.geometry.coordinates[1],earthquake.geometry.coordinates[0]],{
            color: "black",
            weight: 0.5,
            fillColor: color,
            fillOpacity:0.6,
            radius: size
        }).addTo(map);


    });



});