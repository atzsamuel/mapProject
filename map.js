function initMap() {
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
      })
      .catch((e) =>
        window.alert("Directions request failed due to " + e.status)
      );
  }
  
  window.initMap = initMap;