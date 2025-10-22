document.addEventListener('DOMContentLoaded', () => {
  const mapElement = document.getElementById('map');
  const locationInput = document.getElementById('location');
  const countryInput = document.getElementById('country');

  if (mapElement && locationInput && countryInput && typeof mapboxgl !== 'undefined') {
    mapboxgl.accessToken = mapToken;

    // Check if we are on the edit page (listing object exists)
    const isEditPage = typeof listing !== 'undefined' && listing?.geometry?.coordinates;
    
    // Set initial coordinates and zoom
    const initialCoordinates = isEditPage ? listing.geometry.coordinates : [78.9629, 20.5937];
    const initialZoom = isEditPage ? 12 : 4;

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: initialCoordinates,
      zoom: initialZoom
    });

    map.addControl(new mapboxgl.NavigationControl());

    const marker = new mapboxgl.Marker({
      draggable: true,
      color: "#fe424d"
    })
    .setLngLat(initialCoordinates) // Set marker to existing or default position
    .addTo(map);

    async function onDragEnd() {
      const lngLat = marker.getLngLat();
      const longitude = lngLat.lng;
      const latitude = lngLat.lat;

      // Reverse geocode to get address from coordinates
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}`
        );
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          const place = data.features[0];
          let location = place.text || '';
          let country = '';

          // Find country from the context
          place.context.forEach(ctx => {
            if (ctx.id.startsWith('country')) {
              country = ctx.text;
            }
            // Add region/state to location if available
            if (ctx.id.startsWith('region') && !location.includes(ctx.text)) {
              location += `, ${ctx.text}`;
            }
          });

          locationInput.value = location;
          countryInput.value = country;
        }
      } catch (err) {
        console.error('Error during reverse geocoding:', err);
      }
    }

    marker.on('dragend', onDragEnd);
  }
});