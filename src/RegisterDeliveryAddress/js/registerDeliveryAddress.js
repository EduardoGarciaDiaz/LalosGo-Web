let map;
let marker;
let geocoder;
let USER_ID

const VALID_INTERNAL_NUMBER = /^\d{2,5}([a-zA-Z]|\-\d{2,3})?$/;
const VALID_EXTERNAL_NUMBER = /^\d{2,5}([a-zA-Z]|\-\d{2,3})?$/;
var ACTION_TYPE = sessionStorage.getItem('actionType');
var creationAccountData = JSON.parse(sessionStorage.getItem('creationAccountData'));
var deliveryAddressData = JSON.parse(sessionStorage.getItem('deliveryAddressData'));

function initMap() {

    const initialLocation = { lat: 19.541186809084778, lng: -96.92744610055618 };
    if (deliveryAddressData) {
        initialLocation.lat = deliveryAddressData.latitude;
        initialLocation.lng = deliveryAddressData.longitude;
    }

    map = new google.maps.Map(document.getElementById("map"), {
        center: initialLocation,
        zoom: 18,
    });

    marker = new google.maps.Marker({
        position: initialLocation,
        map: map,
    });

    geocoder = new google.maps.Geocoder();


    //Si la acción es editar o mostrar dirección, se llenan los campos con la información de la dirección
    if (ACTION_TYPE === 'EditDeliveryAddress' || ACTION_TYPE === 'ShowDeliveryAddress') {
        const customLocation = new google.maps.LatLng(initialLocation.lat, initialLocation.lng);
        getAddressFromCoordinates(customLocation);
        document.getElementById("exterior_number").value = deliveryAddressData.number;
        document.getElementById("interior_number").value = deliveryAddressData.internalNumber;
    }

    //Si la acción es mostrar dirección, se deshabilita la acción de seleccionar en el mapa
    if (ACTION_TYPE !== 'ShowDeliveryAddress') {
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
    } else {
        fillData();
    }

    if (ACTION_TYPE != 'CreateClientAccount') {
        USER_ID = getInstance().id;
    }
}

function fillData() {
    document.getElementById("exterior_number").disabled = true;
    document.getElementById("interior_number").disabled = true;
    document.getElementById("SaveButtom").style.visibility = "hidden";
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

async function registerDeliveryAddress(event) {
    event.preventDefault();
    clearErrors();
    let exterior_number = document.getElementById('exterior_number').value.trim();
    let interior_number = document.getElementById('interior_number').value.trim();
    let state = document.getElementById('state').value.trim();

    if (isDeliveryAddressValid(exterior_number, interior_number, state)) {
        let street = document.getElementById('street').value.trim();
        let postalCode = document.getElementById('postal_code').value.trim();
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
            type: "Point",
            latitude: latitude,
            longitude: longitude
        }

        if (ACTION_TYPE === 'RegisterDeliveryAddress') {
            newDeliveryAddress.isCurrentAddress = false;
            let succes = await registerNewDeliveryAddress(newDeliveryAddress);

        } else if (ACTION_TYPE === 'EditDeliveryAddress') {
            editDeliveryAddress(newDeliveryAddress);

        } else if (ACTION_TYPE === 'CreateClientAccount') {
            newDeliveryAddress.isCurrentAddress = true;
            let succes = await registerClientAccount(newDeliveryAddress)
            if (succes) {
                setTimeout(() => {
                    window.location.href = "/src/login/login.html";
                }, 2000);
            }
        }
    }
}

async function editDeliveryAddress(newDeliveryAddress) {
    try {
        await axios.put(`${API_URL}/users/${USER_ID}/addresses/${deliveryAddressData._id}`, newDeliveryAddress);
        showToast("Se ha actualizado la dirección", toastTypes.SUCCESS);
        return true;
    } catch (error) {
        alert(error);
        showToast(error.response.data.message, toastTypes.DANGER);
        return false;
    }
}

async function registerNewDeliveryAddress(newDeliveryAddress) {
    try {
        await axios.post(`${API_URL}/users/${USER_ID}/addresses`, newDeliveryAddress);
        showToast("Se ha registrado la dirección", toastTypes.SUCCESS);
        return true;
    } catch (error) {
        showToast(error.response.data.message, toastTypes.DANGER);
        return false;
    }
}

async function registerClientAccount(newDeliveryAddress) {
    try {
        if (creationAccountData) {
            creationAccountData.client = {
                addresses: [newDeliveryAddress],
            };

            await axios.post(`${API_URL}/users/`, creationAccountData);
            showToast("Se ha registrado la cuenta", toastTypes.SUCCESS);
            sessionStorage.removeItem('creationAccountData');
            return true;
        }
    } catch (error) {
        showToast(error.response.data.message, toastTypes.DANGER);
        return false;
    }
}


function isExternalNumberValid(exterior_number) {
    return VALID_EXTERNAL_NUMBER.test(exterior_number);
}

function isInternalNumberValid(interior_number) {
    return VALID_INTERNAL_NUMBER.test(interior_number);
}

function isAddressSelected(state) {
    return state !== "";
}

function isDeliveryAddressValid(externalNumber, internalNumber, state) {
    isValid = true;

    if (!isExternalNumberValid(externalNumber)) {
        document.getElementById('exterior_number').classList.add("is-invalid");
        document.getElementById('exteriorNumberError').style.display = "block";
        isValid = false;
    }

    if (!isInternalNumberValid(internalNumber)) {
        document.getElementById('interior_number').classList.add("is-invalid");
        document.getElementById('interiorNumberError').style.display = "block";
        isValid = false;
    }

    if (!isAddressSelected(state)) {
        showToast("Debe seleccionar una dirección en el mapa", toastTypes.WARNING);
        document.getElementById('map').style.border = '2px solid red';
        document.getElementById('mapError').style.display = "block";
        isValid = false;
    }

    return isValid;
}

function clearErrors() {
    document.getElementById('exterior_number').classList.remove("is-invalid");
    document.getElementById('interior_number').classList.remove("is-invalid");
    document.getElementById('map').style.border = '';

    document.getElementById('exteriorNumberError').style.display = "none";
    document.getElementById('interiorNumberError').style.display = "none";
    document.getElementById('mapError').style.display = "none";
}