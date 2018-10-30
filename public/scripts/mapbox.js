mapboxgl.accessToken = 'pk.eyJ1IjoiZm9vZGJhYnlnMiIsImEiOiJjam10YTdtNjAwNWg2M3dwMWw3am14emhzIn0.dlnV1DEKRSxnKRwa7I2qLw';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v10',
  center: [-82.35256285341353, 29.641654178244437],
  zoom: 13.6868419678297,
  minZoom: 13
});

//test
var geojson = {
    type: 'featurecollection',
    features: [{
        type: 'feature',
        geometry: {
            type: 'point',
            coordinates: [-82.343900, 29.649300]
        },
        properties: {
            title: 'pizza 4 brek !!?!?',
            location: 'turlington hall',
            time: {
                start: '8am',
                end: '10am'
            },
            food_type: 'pizza'
        }
    },
    {
        type: 'feature',
        geometry: {
            type: 'point',
            coordinates: [-82.361300, 29.643100]
        },
        properties: {
            title: 'dinner w the chompers',
            location: 'lake alice',
            time: {
                start: '4pm',
                end: '8pm'
            },
            food_type: 'stuffed quail'
        }
    }]
};

createMarker(geojson);

//add markers to the map for every event
function createMarker(geojson) {
    console.log(geojson.features);
    geojson.features.forEach(function (marker) {
        new mapboxgl.Marker({ color: "000000" })
          .setLngLat(marker.geometry.coordinates)
          .setPopup(new mapboxgl.Popup({ offset: 25 }) //add popups
          .setHTML('<h3>' + marker.properties.title + '</h3><p>' + marker.properties.location + '</p><p>'
                        + marker.properties.time.start + ' - ' + marker.properties.time.end + '</p><p>'
                        + marker.properties.food_type + '</p>'))
          .addTo(map);
    });
}