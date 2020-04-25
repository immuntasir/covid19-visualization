var bd_districts
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
    bd_map_render_date = last_update;
    for (let data_iter in data) {
        district_data[data[data_iter]['Alt_Name']] = Object();
        for (let key_iter in obj_keys) {
            district_data[data[data_iter]['Alt_Name']][obj_keys[key_iter]] = data[data_iter][obj_keys[key_iter]];
        }
        last_update_values.push(parseInt(data[data_iter][last_update]));
    }

    last_update_values = last_update_values.sort(function(a, b) {return a-b;})
    col_slices = [0, 1, 10, 100, 1000];
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
                //bd_dates = Object.keys(district_data['Dhaka']).slice(3, );
                //for (let i=0; i<bd_dates.length; i++) {
                  //      reRenderBdMap(bd_dates[i]);
                    //    sleep(100);
                //}
            }
        });
}

function showDistributionMap () {
    if (mapLoaded == true) {
        return;
    }
    var northEast = L.latLng(92.6727209818, 26.4465255803),
        southWest = L.latLng(88.0844222351, 20.670883287),
        bounds = L.latLngBounds(southWest, northEast);
    if (map == undefined){
        var map = L.map('mapid').setView([23.6850, 90.3563], 6);
        var Wikimedia = L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png', {
            attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>',
            maxBounds: bounds,
            minZoom: 6,
            maxZoom: 19
        });
        Wikimedia.addTo(map);
        bd_districts = new L.GeoJSON(bd_district_geojson, {
            style: style,
            onEachFeature: onEachFeature
            });
        bd_districts.addTo(map);    
        map.setMaxBounds(map.getBounds());


        legend.onAdd = function(map) {
            var div = L.DomUtil.create('div', 'info legend'),
                grades = col_slices,
                labels = [];

            
            for (var i = 0; i < grades.length; i++) {
              span = document.createElement("span");
              span.classList.add("legendItem");
              from = grades[i];
              to = grades[i+1]
              span.dataset.from = from;
              span.dataset.to = to;
          
              color = document.createElement("i");
              
              if (i > 0) {
                text = document.createTextNode(from + (to ? '-' + to : '+'));
                color.style.background = getColorByValue(from + 1);
              }
              else if (i==0) {
                  text = document.createTextNode('No Cases');
                  color.style.background = 'grey';
               }
          
              span.appendChild(color);
              span.appendChild(text);
          
              span.addEventListener("mouseover", function (event) {
                highlightMultipleFeatures(event);
              });
              
              span.addEventListener("mouseout", function () {
                bd_districts.eachLayer(resetHighlight);
              });
          
              div.appendChild(span);
              div.appendChild(document.createElement("br"));
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
                '<b>' + props['Alt_Name'] + '</b><br />' +'Total Cases: ' + props[bd_map_render_date]
                : 'Hover over a district');
        };

        info.addTo(map);


        mapLoaded = true;
    }
    //var map = L.map('mapid').setView([51.505, -0.09], 13);

}

function reRenderBdMap (date) {
    bd_map_render_date = date;
    bd_districts.eachLayer(function (layer) {
        layer.setStyle({
            fillColor: getColor(layer.feature.properties),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '1',
            fillOpacity: 1
        });
    });
}

function highlightMultipleFeatures (event) {
    var span = event.currentTarget,
        from = span.dataset.from,
        to = span.dataset.to,
        above = to === "undefined";

    bd_districts.eachLayer(function (layer) {
        let highlighted = false;
        if (from == '0' && to == '1') {
        if (!district_data[layer.feature.properties['ADM2_EN']]) {
            layer.setStyle({
                weight: 2,
                color: '#666',
                dashArray: '',
                fillOpacity: 1
            });
            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer.bringToFront();
            }
            highlighted = true;
        }
        }
        else if (district_data[layer.feature.properties['ADM2_EN']]) {
        var cases = district_data[layer.feature.properties['ADM2_EN']][bd_map_render_date];
        if (cases >= parseInt(from) && (above || cases < parseInt(to))) {
            layer.setStyle({
                weight: 2,
                color: '#666',
                dashArray: '',
                fillOpacity: 1
            });
            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer.bringToFront();
            }
            highlighted = true;
        }
        }
        if (!highlighted) {
        layer.setStyle({
            fillColor: 'white',
            fillOpacity: 1
        });
        }
    });
}

//#E97451, #D95D41, #C94631, #B92E20, #A91710,#990000
//#E31A1C, FF0000

function getColorByValue (comp_val) {
    return comp_val > col_slices[4] ? '#800026' :
           comp_val > col_slices[3] ? '#FF0000' :
            comp_val > col_slices[2]  ? '#FF9650' :
            comp_val > col_slices[1]   ? '#FFBA6A' :
            comp_val > col_slices[0]   ? '#FFD785' :
                        '#FFEDA0';
}

function getColor(d) {
    if (d['ADM2_EN'] in district_data) {
        let comp_val =  district_data[d['ADM2_EN']][bd_map_render_date];
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
        fillOpacity: 1
    };
}



function highlightFeature(e) {
    var layer = e.target;
    bd_districts.resetStyle();

    layer.setStyle({
        weight: 2,
        color: '#666',
        dashArray: '',
        fillOpacity: 1
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    if (district_data[layer.feature.properties['ADM2_EN']] != undefined) {
        info.update(district_data[layer.feature.properties['ADM2_EN']]);
    }
    else {
        let props = Object();
        props['Alt_Name'] = layer.feature.properties['ADM2_EN'];
        props[bd_map_render_date] = 0;
        info.update(props);
    }
}

function highlightFeatureMultiple(e) {
    var layer = e.target;
    bd_districts.resetStyle();

    layer.setStyle({
        weight: 2,
        color: '#666',
        dashArray: '',
        fillOpacity: 1
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    if (district_data[layer.feature.properties['ADM2_EN']] != undefined) {
        info.update(district_data[layer.feature.properties['ADM2_EN']]);
    }
    else {
        let props = Object();
        props['Alt_Name'] = layer.feature.properties['ADM2_EN'];
        props[bd_map_render_date] = 0;
        info.update(props);
    }
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function resetHighlight(e) {
    bd_districts.resetStyle(e.target);
    info.update();
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: highlightFeature
    });
}
