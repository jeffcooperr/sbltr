var map = L.map('map').setView([44.475883, -73.212074], 13);


L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// var campus = L.circle([44.47789316989897, -73.19630194470729], {
//     color: 'red',
//     fillColor: '#f03',
//     fillOpacity: 0.3,
//     opacity: 0.3,
//     radius: 150
// }).addTo(map);

// campus.bindPopup(`UVM Central Campus`)

const listings = document.querySelectorAll('.card');

// listings.dataset.lat are the data-lat/lng attributes on the card
listings.forEach(listing => {
    const lat = listing.dataset.lat;
    const lng = listing.dataset.lng;
    
    if (lat && lng) {
        const marker = L.marker([lat, lng]).addTo(map);
        
        // h2 is the address on the page, p:last-child is the rent on the page
        const address = listing.querySelector('h2').textContent;
        const rent = listing.querySelector('p:last-child').textContent;
        marker.bindPopup(`<b>${address}</b><br>${rent}`);
    }
});
