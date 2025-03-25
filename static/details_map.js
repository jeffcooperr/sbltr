// accesses the details from the html
const detailsContent = document.querySelector('.details-content');
const lat = detailsContent.dataset.lat;
const lng = detailsContent.dataset.lng;
const address = detailsContent.dataset.address;
const rent = detailsContent.dataset.rent;

// Initialize map
var map = L.map('map').setView([lat, lng], 14);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// add listing marker
const marker = L.marker([lat, lng]).addTo(map);
marker.bindPopup(`<b>${address}</b><br>$${rent}`);

// Initialize routing control
let routingControl = null;

function updateRoute(travelMode) {
    // Remove current route
    if (routingControl) {
        map.removeControl(routingControl);
    }

    // Add new route
    routingControl = L.Routing.control({
        waypoints: [
            L.latLng(44.47761405932637, -73.19612815732413), // Campus
            L.latLng(lat, lng) // Listing
        ],
        show: false,
        addWaypoints: false,
        routeWhileDragging: false,
        lineOptions: {
            styles: [
                {color: 'blue', opacity: 0.5, weight: 4}
            ]
        }
    }).addTo(map);

    // Calculate travel time
    const service = new google.maps.DistanceMatrixService();
    const origin = new google.maps.LatLng(44.47761405932637, -73.19612815732413);
    const destination = new google.maps.LatLng(lat, lng);

    service.getDistanceMatrix(
        {
            origins: [origin],
            destinations: [destination],
            travelMode: travelMode,
            unitSystem: google.maps.UnitSystem.IMPERIAL
        },
        (response, status) => {
            if (status === 'OK') {
                const duration = response.rows[0].elements[0].duration.text;
                const distance = response.rows[0].elements[0].distance.text;
                document.getElementById('travel-info').textContent = 
                    `${duration} (${distance}) to campus`;
            } else {
                document.getElementById('travel-info').textContent = 
                    'Unable to calculate travel time';
            }
        }
    );
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
    updateRoute('DRIVING');
});

document.getElementById('walkBtn').addEventListener('click', function() {
    document.querySelectorAll('.transport-button').forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
    document.getElementById('transport-icon').innerHTML = '<i class="fa-solid fa-person-walking"></i>';
    updateRoute('WALKING');
});

document.getElementById('bikeBtn').addEventListener('click', function() {
    document.querySelectorAll('.transport-button').forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
    document.getElementById('transport-icon').innerHTML = '<i class="fa-solid fa-bicycle"></i>';
    updateRoute('BICYCLING');
});

updateRoute('WALKING'); 