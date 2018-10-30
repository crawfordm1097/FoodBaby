mapboxgl.accessToken = 'pk.eyJ1IjoiZm9vZGJhYnlnMiIsImEiOiJjam10YTdtNjAwNWg2M3dwMWw3am14emhzIn0.dlnV1DEKRSxnKRwa7I2qLw';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v10',
  center: [-82.35256285341353, 29.641654178244437],
  zoom: 13.6868419678297,
  minZoom: 13
});

/* Adds markers to the map for every feature within geojson object.
*/
function createMarker(geojson) {
    geojson.features.forEach(function (marker) {
        var html = '';

        marker.properties.events.forEach(function (event) { //Create list of event info
            html += '<h3>' + event.title + '</h3><p><b>' + marker.properties.location.name + ' (' + marker.properties.location.code + ')</b></p><p>'
                        + event.time.start + ' - ' + event.time.end + '</p><p>'
                        + event.food_type + '</p>'
        });

        new mapboxgl.Marker({ color: "000000" })
          .setLngLat(marker.geometry.coordinates)
          .setPopup(new mapboxgl.Popup({ offset: 25 }) //add popups
          .setHTML(html))
          .addTo(map);
    });
}