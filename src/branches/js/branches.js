const branchesContainer = document.getElementById('branches-container');

let role = getInstance().role;
if (role !== roles.ADMIN) {
    window.history.back();
}

fetch('/src/shared/footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer').innerHTML = data;
        loadBranches();
    });

function loadBranches() {
    clearAllBranches();
    getAllBranches();
}

function clearAllBranches() {
    if (branchesContainer) {
        branchesContainer.innerHTML = '';
    }
}

function getAllBranches() {
    let token = getInstance().token;

    axios
        .get(`${API_URL}branches/`, {
            params: { recoverProduct: false },
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then((response) => {
            let branches = response.data.branches;

            if (!branches || branches.length === 0) {
                showToast("No se encontraron sucursales registradas", toastTypes.PRIMARY);
                return;
            }

            branches.sort((a, b) => {
                return b.branchStatus - a.branchStatus;
            });

            branches.forEach(branch => {
                const branchCard = createBranchCard(branch);
                branchesContainer.appendChild(branchCard);
            });

        })
        .catch((error) => {
            handleException(error, 'Error al cargar las sucursales');
        });
}

const searchInput = document.getElementById('search-input');
searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        searchBranches(searchInput.value.trim());
    }
});

searchInput.addEventListener('input', () => {
    if (searchInput.value === '') {
        showAllBranches();
    }
});

const searchBtn = document.getElementById('search-btn');
searchBtn.addEventListener('click', () => {
    searchBranches(searchInput.value.trim());
});

function searchBranches(inputValue) {
    if (inputValue !== undefined && inputValue) {
        const searchTerm = inputValue.toLowerCase();

        Array.from(branchesContainer.children).forEach(branchCard => {
            const branchName = branchCard.querySelector('.branch-name').textContent.toLowerCase();

            if (branchName.includes(searchTerm)) {
                branchCard.classList.remove('not-searched');
                branchCard.classList.add('searched');
            } else {
                branchCard.classList.remove('searched');
                branchCard.classList.add('not-searched');
            }
        });
    }
}

function showAllBranches() {
    Array.from(branchesContainer.children).forEach(branchCard => {
        branchCard.classList.remove('not-searched', 'searched');
    });
};

function toggleBranchStatus(branchId) {
    let token = getInstance().token;

    if (branchId !== undefined && branchId) {
        axios
            .patch(`${API_URL}branches/${branchId}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then((response) => {
                let updatedBranch = response.data.branch;
                if (updatedBranch === undefined || !updatedBranch) {
                    showToast("Error al actualizar el estado de la sucursal", toastTypes.WARNING);
                    return;
                }

                showToast(response.data.message, toastTypes.SUCCESS);
                loadBranches();
            })
            .catch((error) => {
                handleException(error, 'Error al actualizar el estado de la sucursal');
            });
    }
}

function getFormatedBranchAddress(address) {
    if (!address) return 'Dirección no disponible';

    const { street, number, cologne, zipcode, locality, federalEntity } = address;

    const formattedAddress = [
        street && number ? `${street} ${number}` : '',
        cologne || '',
        zipcode || '',
        locality || '',
        federalEntity || ''
    ].filter(Boolean).join(', ');

    return formattedAddress;
}

function getFormatedSchedule(openingTime, closingTime) {
    if (!openingTime || !closingTime) return 'Horario no disponible';

    return `${openingTime} - ${closingTime}`;
}

function createBranchCard(branchData) {
    const containerDiv = document.createElement('div');
    containerDiv.classList.add('col-12', 'col-md-6', 'col-lg-4');

    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card', 'p-3', 'm-2', 'searched');

    const flexDiv = document.createElement('div');
    flexDiv.classList.add('d-flex', 'justify-content-between', 'align-items-start');

    const infoDiv = document.createElement('div');

    const branchName = document.createElement('h5');
    branchName.classList.add('branch-name', 'mb-2');
    branchName.textContent = branchData.name;
    infoDiv.appendChild(branchName);

    const addressP = document.createElement('p');
    addressP.classList.add('branch-details', 'mb-1');
    addressP.textContent = `Dirección: ${getFormatedBranchAddress(branchData.address)}`;
    infoDiv.appendChild(addressP);

    const scheduleP = document.createElement('p');
    scheduleP.classList.add('branch-details', 'mb-1');
    scheduleP.textContent = `Horario: ${getFormatedSchedule(branchData.openingTime, branchData.closingTime)}`;
    infoDiv.appendChild(scheduleP);

    const statusP = document.createElement('p');
    statusP.classList.add('branch-status', 'branch-details', 'mb-0');
    statusP.textContent = 'Estado: ';

    const statusSpan = document.createElement('span');
    statusSpan.classList.add(`status-${branchData.branchStatus ? 'active' : 'inactive'}`);
    statusSpan.textContent = branchData.branchStatus ? 'Activo' : 'Inactivo';
    statusP.appendChild(statusSpan);
    infoDiv.appendChild(statusP);

    const dropdownDiv = document.createElement('div');
    dropdownDiv.classList.add('dropdown');

    const dropdownButton = document.createElement('button');
    dropdownButton.classList.add('btn', 'btn-link', 'p-0');
    dropdownButton.type = 'button';
    dropdownButton.id = `dropdownMenuButton-${branchData._id}`;
    dropdownButton.setAttribute('data-bs-toggle', 'dropdown');
    dropdownButton.setAttribute('aria-expanded', 'false');

    const buttonIcon = document.createElement('i');
    buttonIcon.classList.add('bi', 'bi-three-dots-vertical');
    dropdownButton.appendChild(buttonIcon);

    const dropdownMenu = document.createElement('ul');
    dropdownMenu.classList.add('dropdown-menu', 'dropdown-menu-start');
    dropdownMenu.setAttribute('aria-labelledby', `dropdownMenuButton-${branchData._id}`);

    const editLi = document.createElement('li');
    const editA = document.createElement('a');
    editA.classList.add('dropdown-item');
    editA.href = '#';
    editA.textContent = 'Editar';
    editA.onclick = () => goToEditBranch(branchData._id);
    editLi.appendChild(editA);

    const toggleLi = document.createElement('li');
    const toggleA = document.createElement('a');
    toggleA.classList.add('dropdown-item');
    toggleA.href = '#';
    toggleA.textContent = branchData.branchStatus ? 'Desactivar' : 'Activar';
    toggleA.onclick = () => toggleBranchStatus(branchData._id);
    toggleLi.appendChild(toggleA);

    dropdownMenu.appendChild(editLi);
    dropdownMenu.appendChild(toggleLi);
    dropdownDiv.appendChild(dropdownButton);
    dropdownDiv.appendChild(dropdownMenu);

    flexDiv.appendChild(infoDiv);
    flexDiv.appendChild(dropdownDiv);
    cardDiv.appendChild(flexDiv);
    containerDiv.appendChild(cardDiv);

    return containerDiv;
}

document.getElementById('add-branch-btn').addEventListener('click', goToAddBranch);

function goToAddBranch() {
    window.location.href = './branchForm.html';
}

function goToEditBranch(branchId) {
    const params = new URLSearchParams({
        branchId: branchId
    });

    window.location.href = `/src/branches/branchForm.html?${params.toString()}`;
}
