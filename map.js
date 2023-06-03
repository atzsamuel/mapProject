//const fs = require('fs');

function initData() {
    // JSON data containing the options
    fetch('./dataStart.json')
        .then(response => response.json())
        .then(data => {
            // Work with the imported JSON data here
            // Get the <select> element by its ID
            const selectElement = document.getElementById('start');

            // Use map to create the <option> elements and set their attributes
            const optionsHTML = data.map(function (option) {
                return '<option value="' + option.value + '">' + option.label + '</option>';
            });

            // Set the innerHTML of the <select> element to the generated options
            selectElement.innerHTML = optionsHTML.join('');
        })
        .catch(error => {
            console.error('Error:', error);
        });


        //data End
        fetch('./dataEnd.json')
        .then(response => response.json())
        .then(data => {
            // Work with the imported JSON data here
            // Get the <select> element by its ID
            const selectElement = document.getElementById('end');

            // Use map to create the <option> elements and set their attributes
            const optionsHTML = data.map(function (option) {
                return '<option value="' + option.value + '">' + option.label + '</option>';
            });

            // Set the innerHTML of the <select> element to the generated options
            selectElement.innerHTML = optionsHTML.join('');
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function initMap() {
    initData();
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: { lat: 14.673373964347673, lng: -90.80445764985082 },
    });

    directionsRenderer.setMap(map);

    const onChangeHandler = function () {
        calculateAndDisplayRoute(directionsService, directionsRenderer);
    };

    document.getElementById("start").addEventListener("change", onChangeHandler);
    document.getElementById("end").addEventListener("change", onChangeHandler);
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    directionsService
        .route({
            origin: {
                query: document.getElementById("start").value,
            },
            destination: {
                query: document.getElementById("end").value,
            },
            travelMode: google.maps.TravelMode.DRIVING,
            provideRouteAlternatives: true, // Habilita las rutas alternativas
        })
        .then((response) => {
            directionsRenderer.setDirections(response);
            // Muestra todas las rutas obtenidas en el mapa
            directionsRenderer.setRouteIndex(0);
            directionsRenderer.setOptions({
                suppressMarkers: false,
            });
            directionsRenderer.setOptions({
                preserveViewport: true,
                polylineOptions: {
                    strokeWeight: 6,
                    strokeOpacity: 0.7,
                    strokeColor: "blue",
                },
            });

            if (response.routes && response.routes.length > 1) {
                for (let i = 1; i < response.routes.length; i++) {
                    const altRenderer = new google.maps.DirectionsRenderer();
                    altRenderer.setOptions({
                        suppressMarkers: true,
                        preserveViewport: true,
                        polylineOptions: {
                            strokeWeight: 4,
                            strokeOpacity: 0.5,
                            strokeColor: "gray",
                        },
                    });
                    altRenderer.setMap(directionsRenderer.getMap());
                    altRenderer.setDirections(response);
                    altRenderer.setRouteIndex(i);
                }
            }

            console.log(response);
            console.log(response.routes[0].legs[0].distance.text);

            const data = {
                distanciaKM: response.routes[0].legs[0].distance.text
            };

            document.getElementById("total").innerHTML = data.distanciaKM;
            // Convert data to JSON string
            const jsonData = JSON.stringify(data);
            console.log(jsonData);

        })
        .catch((e) =>
            window.alert("Directions request failed due to " + e.status)
        );
}

window.initMap = initMap;