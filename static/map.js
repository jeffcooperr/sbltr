function initMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: { lat: 44.477, lng: -73.205 }  // UVM area
    });

    // Add markers for each listing
    listingCoordinates.forEach(listing => {
        const marker = new google.maps.Marker({
            position: { lat: listing.lat, lng: listing.lng },
            map: map,
            title: listing.address
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="max-width: 200px;">
                    <img src="${listing.image}" alt="Listing Image" style="max-width: 100%; height: auto;">
                    <b>${listing.address}</b><br>
                    Rent: ${listing.rent}
                </div>
            `
        });

        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });
    });
}

// Call initMap when the page loads
window.onload = initMap;
