let branchId;

function getBranchIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('branchId');
}

function getBranch() {
    axios
        .get(`${API_URL}branches/${branchId}`)
        .then((response) => {
            const branch = response.data.branch;
            fillBranchForm(branch);
        })
        .catch((error) => {
            const errorMessage = error.response ? error.response.data.message : DEFAULT_ERROR_MESSAGE;
            showToast(errorMessage, toastTypes.DANGER);
        });
}

function fillBranchForm(branch) {
    const address = branch.address;

    branchName.value = `${branch.name || ""}`;
    branchOpeningTime.value = `${branch.openingTime || ""}`;
    branchClosingTime.value = `${branch.closingTime || ""}`;
    branchStreet.value = `${address.street || ""}`;
    branchOutNumber.value = `${address.number || ""}`;
    branchInsideNumber.value = `${address.internalNumber || ""}`;
    branchColony.value = `${address.cologne || ""}`;
    branchCP.value = `${address.zipcode || ""}`;
    branchState.value = `${address.federalEntity || ""}`;
    branchTown.value = `${address.municipality || ""}`;
    branchLocality.value = `${address.locality || ""}`;
    loadLocationMap(address.location.coordinates);
}

async function loadLocationMap(coordinates) {
    let branchLocation = { lat: coordinates[0], lng: coordinates[1] };
    initMap(branchLocation);
}

async function editBranch() {
    let name = branchName.value
    let openingTime = branchOpeningTime.value
    let closingTime = branchClosingTime.value
    let location = {
        type: "Point",
        coordinates: branchCoordinates ?? [19.541915036343163, -96.92727810184944]
    }
    let address = {
        street: branchStreet.value,
        number: branchOutNumber.value,
        cologne: branchColony.value,
        zipcode: branchCP.value,
        locality: branchLocality.value,
        municipality: branchTown.value,
        federalEntity: branchState.value,
        internalNumber: branchInsideNumber.value,
        location: location
    }

    try {
        let response = await axios.put(`${API_URL}branches/${branchId}`, {
            name,
            openingTime,
            closingTime,
            address
        })
        if (response.status < 300 && response.status > 199) {
            showToast(response.data.message, toastTypes.SUCCESS)
            clearFields();
            setTimeout(() => {
                window.location.href = "/src/branches/branches.html";
            }, 2000);
        }
        else {
            showToast(response.data.message, toastTypes.WARNING)
        }

    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : DEFAULT_ERROR_MESSAGE;
            showToast(errorMessage, toastTypes.DANGER);
        return;
    }

}