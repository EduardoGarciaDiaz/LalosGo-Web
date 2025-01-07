window.onload = function () {
    fetch('/src/shared/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        });

    setLocationMap();
};

function setLocationMap() {
    const mapContainer = document.getElementById('map-container');

    if (!mapContainer) {
        return;
    }

    const coordinates = getCoordinatesFromUrl();

    if (!coordinates) {
        mapContainer.innerHTML = '<p class="text-center">No se encontraron coordenadas válidas para mostrar el mapa.</p>';
        return;
    }

    map = new google.maps.Map(mapContainer, {
        center: coordinates,
        zoom: 15,
    });

    marker = new google.maps.Marker({
        position: coordinates,
        map: map,
    });

}

function getCoordinatesFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const lat = parseFloat(urlParams.get('lat'));
    const lng = parseFloat(urlParams.get('lng'));

    if (isNaN(lat) || isNaN(lng)) {
        return null;
    }

    return { lat, lng };
}
