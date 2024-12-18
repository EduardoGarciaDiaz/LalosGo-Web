let map; 
let marker; 
let geocoder;

const VALID_INTERNAL_NUMBER = /^[a-zA-Z0-9\-\/]{0,10}$/;
const VALID_EXTERNAL_NUMBER = /^\d{1,5}([a-zA-Z]|\-\d{1,3})?$/;
const API_URL = 'http://localhost:3000/api/v1/address/';

var latitude;
var longitude;
var isEdition = false;

function initMap() {  
    const initialLocation = { lat: 19.541652309248587, lng: -96.9272232055664 };
    map = new google.maps.Map(document.getElementById("map"), {
        center: initialLocation,
        zoom: 18, 
    });

    geocoder = new google.maps.Geocoder();

    map.addListener("click", (event) => {
        const clickedLocation = event.latLng; 
        

        if (marker) {
            marker.setMap(null); 
        }
        marker = new google.maps.Marker({
            position: clickedLocation,
            map: map,
        });

        latitude = clickedLocation.lat();
        longitude = clickedLocation.lng();

        getAddressFromCoordinates(clickedLocation);
   
    });
}


function getAddressFromCoordinates(coordinates) {
    geocoder.geocode({ location: coordinates }, (results, status) => {
        if (status === "OK") {
            if (results[0]) {
                const addressComponents = results[0].address_components;

                const street = addressComponents.find(component => component.types.includes("route")
                )?.long_name;
                
                const postalCode = addressComponents.find(component => component.types.includes("postal_code")
                )?.long_name;

                const federativeEntity = addressComponents.find(component => component.types.includes("administrative_area_level_1")
                )?.long_name;

                const neighborhood = addressComponents.find(component => component.types.includes("political")
                )?.long_name;

                const locality = addressComponents.find(component => component.types.includes("locality")
                )?.long_name;

            document.getElementById("street").value = street;
            document.getElementById("postal_code").value = postalCode;
            document.getElementById("state").value = federativeEntity;
            document.getElementById("neighborhood").value = neighborhood;
            document.getElementById("locality").value = locality;
            } 
        } 
    });
}

    function registerDeliveryAddress() {
        clearErrors();
        let exterior_number = document.getElementById('exterior_number').value.trim();
        let interior_number = document.getElementById('interior_number').value.trim();

        if(isExternalNumberValid(exterior_number) && isInternalNumberValid(interior_number)){
        let street = document.getElementById('street').value.trim();
        let postalCode = document.getElementById('postal_code').value.trim();
        let state = document.getElementById('state').value.trim();
        let neighborhood = document.getElementById('neighborhood').value.trim();
        let locality = document.getElementById('locality').value.trim();
    
        let newDeliveryAddress = {
            street: street,
            number: exterior_number,
            cologne: neighborhood,
            zipcode: postalCode,
            locality: locality,
            federalEntity: state,
            internalNumber: interior_number,
            latitude: latitude,
            longitude: longitude
        }
        if(isEdition){
            editDeliveryAddress(newDeliveryAddress);
        }else{
            registerNewDeliveryAddress(newDeliveryAddress);
        }
    }
    }

    //Falta obtener el Id del usuario 
    //Falta obtener el id de la dirección 
    //Falta cambiar botones de registro y edición
    //Verificar que la URL está bien 
    //Cambiar el titulo de agregar a editar

    function editDeliveryAddress(newDeliveryAddress){
        axios
        .put(`${API_URL}${localStorage.getItem('id')}`, newDeliveryAddress)
        .then((response) => {
            console.log(response.data);
            alert("Dirección actualizada correctamente");
        })
        .catch((error) => {
            console.error(error);
            alert("Error al actualizar la dirección");
        });
    }

    function registerNewDeliveryAddress(newDeliveryAddress){
        axios
        .post(`${API_URL}`, newDeliveryAddress)
        .then((response) => {
            console.log(response.data);
            alert("Dirección registrada correctamente");
        })
        .catch((error) => {
            console.error(error);
            alert("Error al registrar la dirección");
        });
    }

    function isExternalNumberValid(exterior_number){
        return  VALID_EXTERNAL_NUMBER.test(exterior_number);
    }

    function isInternalNumberValid(interior_number){
        return  VALID_INTERNAL_NUMBER.test(interior_number);
    }

    function clearErrors() {
        document.getElementById('exterior_number').value = "";
        document.getElementById('interior_number').value = "";
    }
