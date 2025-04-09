// accesses the details from the html
const detailsContent = document.querySelector('.details-content');
const lat = parseFloat(detailsContent.dataset.lat);
const lng = parseFloat(detailsContent.dataset.lng);
const address = detailsContent.dataset.address;
const rent = detailsContent.dataset.rent;

// Initialize map
const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: { lat: lat, lng: lng }
});

// add listing marker
const marker = new google.maps.Marker({
    position: { lat: lat, lng: lng },
    map: map,
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
    const directionsRenderer = new google.maps.DirectionsRenderer();

    directionsRenderer.setMap(map);

    const request = {
        origin: { lat: 44.47761405932637, lng: -73.19612815732413 }, // Campus
        destination: { lat: lat, lng: lng },
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