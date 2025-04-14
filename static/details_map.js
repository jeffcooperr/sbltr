// accesses the details from the html
const detailsContent = document.querySelector('.details-content');
const lat = parseFloat(detailsContent.dataset.lat);
const lng = parseFloat(detailsContent.dataset.lng);
const address = detailsContent.dataset.address;
const rent = detailsContent.dataset.rent;

// Initialize map
const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: { lat: lat, lng: lng },
    styles: mapStyle
});

const markerIcon = {
    path: 'M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z',
    fillColor: '#154734',
    fillOpacity: 1,
    strokeWeight: 2,
    strokeColor: '#FFD100',
    rotation: 0,
    scale: 0.05,
    anchor: new google.maps.Point(288, 480)
};

// add listing marker
const marker = new google.maps.Marker({
    position: { lat: lat, lng: lng },
    map: map,
    icon: markerIcon,
    title: address,
});

const infoWindow = new google.maps.InfoWindow({
    content: `<div><b>${address}</b><br>Rent: ${rent}</div>`
});

marker.addListener('click', () => {
    infoWindow.open(map, marker);
});


let currentRoute = null; // stores route

function displayRoute(mode) {
    // clear route
    if (currentRoute) {
        currentRoute.setMap(null);
    }

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
            strokeColor: '#48a0df',
            strokeWeight: 6
        }
    });

    directionsRenderer.setMap(map);

    const request = {
        origin: { lat: lat, lng: lng }, // Listing
        destination: { lat: 44.47761405932637, lng: -73.19612815732413 }, // Campus
        travelMode: mode
    };

    directionsService.route(request, function(result, status) {
        if (status === 'OK') {
            directionsRenderer.setDirections(result);
            currentRoute = directionsRenderer; // Update route
            const duration = result.routes[0].legs[0].duration.text;
            const distance = result.routes[0].legs[0].distance.text;
            document.getElementById('travel-info').textContent = 
                `${duration} (${distance}) to campus`;
        } else {
            document.getElementById('travel-info').textContent = 
                'Unable to calculate travel time';
        }
    });
}

// EVENT LISTENERS FOR BUTTONS

document.getElementById('driveBtn').addEventListener('click', function() {
    // removes active class from all buttons
    document.querySelectorAll('.transport-button').forEach(btn => btn.classList.remove('active'));
    // adds active class to this clicked button
    this.classList.add('active');
    // updates the icon to show a car icon
    document.getElementById('transport-icon').innerHTML = '<i class="fa-solid fa-car"></i>';
    // updateRoute calculates route and travel time and displays it
    displayRoute('DRIVING');
});

document.getElementById('walkBtn').addEventListener('click', function() {
    document.querySelectorAll('.transport-button').forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
    document.getElementById('transport-icon').innerHTML = '<i class="fa-solid fa-person-walking"></i>';
    displayRoute('WALKING');
});

document.getElementById('bikeBtn').addEventListener('click', function() {
    document.querySelectorAll('.transport-button').forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
    document.getElementById('transport-icon').innerHTML = '<i class="fa-solid fa-bicycle"></i>';
    displayRoute('BICYCLING');
});

displayRoute('WALKING'); 