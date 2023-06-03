function initData() {
    // JSON data containing the options
    fetch('./DataStart.json')
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

    fetch('./DataEnd.json')
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
    console.log("initMap");
    initData();
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 7,
        center: { lat: 41.85, lng: -87.65 },
    });

    directionsRenderer.setMap(map);

    const onChangeHandler = function () {
        calculateAndDisplayRoute(directionsService, directionsRenderer);
    };

    document.getElementById("start").addEventListener("change", onChangeHandler);
    document.getElementById("end").addEventListener("change", onChangeHandler);
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    const waypts = [];
    const checkboxArray = document.getElementById("waypoints");

    for (let i = 0; i < checkboxArray.length; i++) {
        if (checkboxArray.options[i].selected) {
            waypts.push({
                location: checkboxArray[i].value,
                stopover: true,
            });
        }
    }

    directionsService
        .route({
            origin: {
                query: document.getElementById("start").value,
            },
            destination: {
                query: document.getElementById("end").value,
            },
            travelMode: google.maps.TravelMode.DRIVING,
            waypoints: waypts,
            optimizeWaypoints: true,
        })
        .then((response) => {
            console.log(response);
            console.log(response.routes[0].legs[0].distance.text);
            directionsRenderer.setDirections(response);

            const route = response.routes[0];
            const summaryPanel = document.getElementById("directions-panel");

            summaryPanel.innerHTML = "";

            // For each route, display summary information.
            for (let i = 0; i < route.legs.length; i++) {
                const routeSegment = i + 1;

                summaryPanel.innerHTML +=
                    "<b>Route Segment: " + routeSegment + "</b><br>";
                summaryPanel.innerHTML += route.legs[i].start_address + " to ";
                summaryPanel.innerHTML += route.legs[i].end_address + "<br>";
                summaryPanel.innerHTML += route.legs[i].distance.text + "<br><br>";
            }
        })
        .catch((e) => window.alert("Directions request failed due to " + status));
}

window.initMap = initMap;