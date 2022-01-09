
    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: beach.geometry.coordinates, // starting position [lng, lat]
    zoom: 11 // starting zoom
});  

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(beach.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<h6>${beach.title}</h6>`
        )
    )
    .addTo(map);

 