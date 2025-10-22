// This script uses Leaflet.js to display a map from OpenStreetMap.

// Helper function to format price into a compact representation (e.g., 1500 -> 1.5k)
function formatPrice(price) {
    if (price >= 10000000) { // Crores
        return (price / 10000000).toFixed(1).replace(/\.0$/, '') + 'Cr';
    }
    if (price >= 100000) { // Lakhs
        return (price / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
    }
    if (price >= 1000) { // Thousands
        return (price / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return price;
}
// Check if mapCoordinates are available from the EJS template
document.addEventListener('DOMContentLoaded', () => {
    const mapDiv = document.getElementById('map');

    if (typeof mapCoordinates !== 'undefined' && Array.isArray(mapCoordinates) && mapCoordinates.length === 2) {
        // Leaflet expects coordinates in [latitude, longitude] format,
        // but GeoJSON (from OpenStreetMap) stores them as [longitude, latitude].
        // We need to reverse them.
        const [longitude, latitude] = mapCoordinates;

        // 1. Initialize the map and set its view to the listing's coordinates
        const map = L.map('map').setView([latitude, longitude], 13); // 13 is the zoom level

        // 2. Add the OpenStreetMap tile layer (the map image)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // 3. Create a custom price tag icon
        const priceTagIcon = L.divIcon({
            className: 'price-tag-marker',
            html: `<b>₹${formatPrice(listingPrice)}</b>`,
            iconSize: [60, 30], // Adjust size as needed
        });

        // Create a dynamic popup message
        const popupText = isDefaultLocation
            ? `<b>${listingTitle}</b><br>Location not specified.`
            : `<b>${listingTitle}</b><br>₹${listingPrice.toLocaleString('en-IN')} / night`;

        // 4. Add the custom marker to the map
        L.marker([latitude, longitude], { icon: priceTagIcon }).addTo(map)
            .bindPopup(popupText)
            .openPopup();

    } else {
        // If coordinates are not available, show a message instead of hiding the map.
        if (mapDiv) {
            mapDiv.innerHTML = '<div class="map-placeholder">Map not available for this location. Please edit the listing to generate map data.</div>';
        }
        console.log("Map coordinates not found for this listing. Displaying placeholder.");
    }
});