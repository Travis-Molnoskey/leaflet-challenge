

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

var legend = L.control({
    position: "bottomright"
});

legend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    //found this and the legend styling online, thank god for google
    div.innerHTML += '<i style="background: #00FF00"></i><span>0-1</span><br>';
    div.innerHTML += '<i style="background: #66ff00"></i><span>1-2</span><br>';
    div.innerHTML += '<i style="background: #ccff00"></i><span>2-3</span><br>';
    div.innerHTML += '<i style="background: #FFCC00"></i><span>3-4</span><br>';
    div.innerHTML += '<i style="background: #ff6600"></i><span>4-5</span><br>';
    div.innerHTML += '<i style="background: #FF0000"></i><span>5+</span><br>';
    
    return div;
};

legend.addTo(map);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(response){
    //console.log(response.features)
    var datapoints = response.features
    //console.log(datapoints)
    
    //define ordinal buckets for color categories
    var mags = [1,2,3,4,5,6]
    var circleColor = d3.scaleOrdinal().domain(mags)
    .range(["#00FF00","#66ff00","#ccff00","#FFCC00","#ff6600","#FF0000"]);
    //if circle then range [4000, 120000]
    //if circleMarker then range [0,40]
    var circleSize = d3.scaleLinear().domain([0,9]).range([4000,120000]);

    //make function to return the magnitude in buckets for easy categories
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
    //this fixes issue of giving negative radius for negative magnitude earthquakes
    function returnSize(mag){
        if (mag < 0.1){
            return 0.1;
        } else{
            return mag;
        }
    }

    datapoints.forEach(function(earthquake){
        var color = circleColor(returnMag(earthquake.properties.mag))
        var size = circleSize(returnSize(earthquake.properties.mag))
        console.log(size)

        var newCircle = L.circle([earthquake.geometry.coordinates[1],earthquake.geometry.coordinates[0]],{
            color: "black",
            weight: 0.5,
            fillColor: color,
            fillOpacity:0.6,
            radius: size
        }).addTo(map);

        newCircle.bindTooltip(`Magnitude: ${earthquake.properties.mag}<br/>Lat:${earthquake.geometry.coordinates[1]}<br/>Long:${earthquake.geometry.coordinates[0]}`)

    });

});