mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: [coordinate[0], coordinate[1]], // starting position [lng, lat]
    zoom: 16 // starting zoom
});

const directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken
});

map.addControl(directions, 'top-left');

// Specify the source and destination programmatically
directions.setOrigin([82.679636, 26.726048]); // Set the source
directions.setDestination(coordinate);

directions.on('route', function(e) {
    const route = e.route[0];
    if (route) {
        const distance = route.distance/1000;
        document.getElementById('distance').innerHTML =' (' + distance.toFixed(2) + ' km'+')';
        const durationInSeconds = route.duration;
        const hours = Math.floor(durationInSeconds / 3600);
        const minutes = Math.round((durationInSeconds % 3600) / 60);
        document.getElementById('duration').innerHTML =  hours+1 + ' hr ' + minutes + ' min';
        user=res.locals.currUser,
        user.distance=distance;
    }
});





