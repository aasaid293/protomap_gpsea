let initialCenter = [48.79037, 2.45557];// Crétéil
let initialZoom = 12;

let OSM_Mapnik = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

let OSM_Stardard = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

let OSM_France = L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

let cartoDB_Voyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
});

var geoportailFrance = L.tileLayer('https://wxs.ign.fr/{apikey}/geoportail/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE={style}&TILEMATRIXSET=PM&FORMAT={format}&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}', {
    attribution: '<a target="_blank" href="https://www.geoportail.gouv.fr/">Geoportail France</a>',
    bounds: [[-75, -180], [81, 180]],
    minZoom: 2,
    maxZoom: 18,
    apikey: 'choisirgeoportail',
    format: 'image/png',
    style: 'normal'
});

// Tile Layers
let googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

let googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 19,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

let baseLayers = {
    "OSM Standard": OSM_Stardard,
    "CartoDB Voyager": cartoDB_Voyager,
    "Geoportail France": geoportailFrance,
    "Google Streets": googleStreets,
    "Google Satellite": googleSat
};

//Map creation
let myMap = L.map('map', {
    layers: [OSM_Stardard]
}).setView(initialCenter, initialZoom);

//Add baseLayers to map as control layers
//L.control.layers(baseLayers).addTo(myMap);

//Load geoJSON data add add them to the map
let healthLayer = L.geoJSON.ajax('./data/GPSEA_Sante2.geojson', {
    pointToLayer: returnHealthMarker,
    onEachFeature: onEachHealthFeature
}).addTo(myMap);

healthLayer.on('data:loaded', function () {
    myMap.fitBounds(healthLayer.getBounds());
});

let innovationLayer = L.geoJSON.ajax('./data/GPSEA_Innovation.geojson', {
    pointToLayer: returnInnovationMarker,
    onEachFeature: onEachInnoFeature
}).addTo(myMap);
innovationLayer.on('data:loaded', function () { });

let agriMajorLayer = L.geoJSON.ajax('./data/GPSEA_Agro_Major.geojson', {
    pointToLayer: returnAgriMajorMarker,
    onEachFeature: onEachAgriMajorFeature
}).addTo(myMap);

agriMajorLayer.on('data:loaded', function () { });

let agriStartupLayer = L.geoJSON.ajax('./data/GPSEA_Agro_Startups.geojson', {
    pointToLayer: returnAgriStartupMarker,
    onEachFeature: onEachAgriStartupFeature
}).addTo(myMap);

agriMajorLayer.on('data:loaded', function () { });


let overlays = {
    "Healthcare companies": healthLayer,
    "Innovative Companies": innovationLayer,
    "Major Agrofood Companies": agriMajorLayer,
    "Agrifood Startups": agriStartupLayer
};

L.control.layers(baseLayers, overlays).addTo(myMap);


function returnHealthMarker(json, ltlng) {
    let attr = json.properties;
    return L.marker(ltlng, {icon:goldIcon}).bindTooltip("<h4>" + attr.Entreprise + "</h4>");
}

function onEachHealthFeature(feature, layer){
    layer.bindPopup(`<b>${feature.properties.Entreprise} </b><br> ${feature.properties.Rue} <br> ${feature.properties.Ville}`);
}

function returnInnovationMarker(json, ltlng) {
    /*
     let LeafIcon = L.Icon.extend({
         options: {
            iconSize:     [38, 95],
            shadowSize:   [50, 64],
            iconAnchor:   [22, 94],
            shadowAnchor: [4, 62],
            popupAnchor:  [-3, -76]
         }
     });
     let greenIcon = new LeafIcon({
         iconUrl: 'http://leafletjs.com/examples/custom-icons/leaf-green.png',
         shadowUrl: 'http://leafletjs.com/examples/custom-icons/leaf-shadow.png'
     });

     let greenIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
      
       */


    let attr = json.properties;
    //return L.marker(ltlng).bindTooltip("<h4>" + attr.Entreprise + "</h4>");
    //return L.circleMarker(ltlng, {radius:10, color:'deeppink'}).bindTooltip("<h4>" + attr.Entreprise + "</h4>");
    return L.marker(ltlng, {icon:greenIcon}).bindTooltip("<h4>" + attr.Entreprise + "</h4>");
}


function onEachInnoFeature(feature, layer){
     layer.bindPopup(`<b>${feature.properties.Entreprise} </b><br> ${feature.properties.Rue} <br> ${feature.properties.Ville}`);

}

function returnAgriMajorMarker(json, ltlng) {
    let attr = json.properties;
    return L.marker(ltlng, {icon:yellowIcon}).bindTooltip("<h4>" + attr.Entreprise + "</h4>");
}

function onEachAgriMajorFeature(feature, layer){
    layer.bindPopup(`<b>${feature.properties.Entreprise} </b><br> ${feature.properties.Rue} <br> ${feature.properties.Ville}`);
}

function returnAgriStartupMarker(json, ltlng){
    let attr = json.properties;
    return L.marker(ltlng, {icon:violetIcon}).bindTooltip("<h4>" + attr.Entreprise + "</h4>");
}

function onEachAgriStartupFeature(feature, layer){
    layer.bindPopup(`<b>${feature.properties.Entreprise} </b><br> ${feature.properties.Rue} <br> ${feature.properties.Ville}`);
}