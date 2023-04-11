let initialCenter =[48.79037, 2.45557] ;// Crétéil
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
let googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

let googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 19,
    subdomains:['mt0','mt1','mt2','mt3']
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
let healthLayer = L.geoJSON.ajax('./data/GPSEA_Sante2.geojson').addTo(myMap);
healthLayer.on('data:loaded', function(){
    myMap.fitBounds(healthLayer.getBounds());
});

let innovationLayer = L.geoJSON.ajax('./data/GPSEA_Innovation.geojson', {
    pointToLayer: returnInnovationMarker 
}).addTo(myMap);
innovationLayer.on('data:loaded', function(){});

let agroMajorLayer = L.geoJSON.ajax('./data/GPSEA_Agro_Major.geojson').addTo(myMap);
agroMajorLayer.on('data:loaded', function(){});

let agroStartupsLayer = L.geoJSON.ajax('./data/GPSEA_Agro_Startups.geojson').addTo(myMap);
agroMajorLayer.on('data:loaded', function(){});


let overlays = {
    "Healthcare companies": healthLayer,
    "Innovative Companies": innovationLayer,
    "Major Agrofood Companies": agroMajorLayer,
    "Agrifood Startups": agroStartupsLayer
};

L.control.layers(baseLayers, overlays).addTo(myMap);

function returnInnovationMarker (json, ltlng){
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
    let attr = json.properties;
    return L.marker(ltlng).bindTooltip("<h4>" +  attr.Entreprise + "</h4>");
}
