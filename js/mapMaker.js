var bd_geojson;
var mapLoaded = false;
var district_data = Object();
var last_update;
var last_update_values = [];
var col_slices = [];

var legend = L.control({position: 'bottomright'});
var info = L.control();


function makeDistrictObjects (data) {
    obj_keys = Object.keys(data[0]);
    last_update = obj_keys.slice(-1, )
    for (let data_iter in data) {
        district_data[data[data_iter]['Alt_Name']] = Object();
        for (let key_iter in obj_keys) {
            district_data[data[data_iter]['Alt_Name']][obj_keys[key_iter]] = data[data_iter][obj_keys[key_iter]];
        }
        last_update_values.push(parseInt(data[data_iter][last_update]));
    }

    last_update_values = last_update_values.sort(function(a, b) {return a-b;})
    col_slices = [0, 1, 10, 100]
}

function loadDataAndShowDistributionMap () {
    if (mapLoaded){
        return;
    }
    data_url ='https://raw.githubusercontent.com/rizveeerprojects/Corona-History/master/bangladesh-data/bd_cases.csv';
    $.ajax({
            type: "GET",
            url: data_url,
            dataType: "text",
            success: function(response)
            {
                data = $.csv.toArrays(response);
                data = csvJSON(data);
                makeDistrictObjects(data);
                showDistributionMap();
                showLastUpdateDate();
                showBangladeshDistrictWiseTable(); 
            }
        });
}

function showDistributionMap () {
    if (map == undefined){
        var map = L.map('mapid').setView([23.6850, 90.3563], 6);
        var Wikimedia = L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png', {
            attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>',
            minZoom: 6,
            maxZoom: 19
        });
        Wikimedia.addTo(map);
        bd_geojson = L.geoJson(bd_districts, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);
        map.setMaxBounds(map.getBounds());


        legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend'),
                grades = col_slices,
                labels = [];



            // loop through our density intervals and generate a label with a colored square for each interval

            div.innerHTML +=
                    '<i style="background: grey"></i> No Cases <br>' +
                    '<i style="background:' + getColorByValue(grades[0] + 1) + '"></i> ' +
                    grades[1]  + '<br>';
            for (var i = 1; i < grades.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + getColorByValue(grades[i] + 1) + '"></i> ' +
                    (grades[i] + 1) + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
            }

            return div;
        };

        legend.addTo(map);



        info.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
            this.update();
            return this._div;
        };

        // method that we will use to update the control based on feature properties passed
        info.update = function (props) {
            this._div.innerHTML = '<h4>Number of COVID-19 Cases</h4>' +  (props ?
                '<b>' + props['Alt_Name'] + '</b><br />' +'Total Cases: ' + props[last_update]
                : 'Hover over a district');
        };

        info.addTo(map);


        mapLoaded = true;
    }
    //var map = L.map('mapid').setView([51.505, -0.09], 13);

}

function getColorByValue (comp_val) {
    return comp_val > col_slices[3] ? '#800026' :
            comp_val > col_slices[2]  ? '#E31A1C' :
            comp_val > col_slices[1]   ? '#FD8D3C' :
            comp_val > col_slices[0]   ? '#FED976' :
                        '#FFEDA0';
}

function getColor(d) {
    if (d['DISTNAME'] in district_data) {
        let comp_val =  district_data[d['DISTNAME']][last_update];
        return getColorByValue(comp_val);
    }
    else {
        return 'grey';
    }
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.7
    };
}



function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    if (district_data[layer.feature.properties['DISTNAME']] != undefined) {
        info.update(district_data[layer.feature.properties['DISTNAME']]);
    }
    else {
        let props = Object();
        props['Alt_Name'] = layer.feature.properties['DISTNAME'];
        props[last_update] = 0;
        info.update(props);
    }
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function resetHighlight(e) {
    bd_geojson.resetStyle(e.target);
    info.update();
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}
