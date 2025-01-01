window.onload = function () {
    setupEventListeners();
    loadInitialData();
}

function setupEventListeners() {
    const addEmployeeButton = document.getElementById('add-employee-btn');
    addEmployeeButton.addEventListener('click', goToAddEmployee);

    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-btn');

    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') searchEmployees(searchInput.value.trim());
    });

    searchInput.addEventListener('input', () => {
        if (searchInput.value === '') showAllEmployees();
    });

    searchButton.addEventListener('click', () => searchEmployees(searchInput.value.trim()));
}

function loadInitialData() {
    loadEmployees();
    loadBranches();
}

function loadEmployees() {
    clearAllEmployees();
    getAllEmployees();
}

function loadBranches() {
    let branchesDropdown = document.getElementById('branch-dropdown');
    let token = getInstance().token;
    axios
        .get(`${API_URL}branches/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then((response) => {
            let branches = response.data.branches;

            if (!branches || branches.length === 0) {
                showToast("No se encontraron sucursales registradas", toastTypes.PRIMARY);
                return;
            }

            branches.forEach(branch => {
                const branchOption = document.createElement('li');
                const branchLink = document.createElement('a');
                branchLink.classList.add('dropdown-item');
                branchLink.textContent = branch.name;
                branchLink.href = "#";
                branchLink.addEventListener('click', () => filterEmployeesByBranch(branch.name));
                branchOption.appendChild(branchLink);
                branchesDropdown.appendChild(branchOption);
            });
        })
        .catch((error) => {
            const message = error.response?.data?.message || "Error al cargar las sucursales. Intente de nuevo más tarde.";
            showToast(message, toastTypes.DANGER);
        });
}


function clearAllEmployees() {
    let employeesContainer = document.getElementById('employees-container');
    employeesContainer.innerHTML = '';
}

function getAllEmployees() {
    let employeesContainer = document.getElementById('employees-container');
    let token = getInstance().token;
    axios
        .get(`${API_URL}employees/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then((response) => {
            let employees = response.data.employees;

            if (!employees || employees.length === 0) {
                showToast("No se encontraron empleados registrados", toastTypes.PRIMARY);
                return;
            }

            employees.forEach(employee => {
                const employeeCard = createEmployeeCard(employee)
                employeesContainer.appendChild(employeeCard)
            });
        })
        .catch((error) => {
            const message = error.response?.data?.message || "Error al cargar los empleados. Intente de nuevo más tarde.";
            showToast(message, toastTypes.DANGER);
        });
}

function searchEmployees(inputValue) {
    filterEmployees('name', inputValue.toLowerCase());
}

function filterEmployeesByBranch(branchName) {
    filterEmployees('branch', branchName);
}

function filterEmployees(type, value) {
    let employeesContainer = document.getElementById('employees-container');
    value = value.toLowerCase();
    Array.from(employeesContainer.children).forEach(employeeCard => {
        let isMatch = false;

        if (type === 'name') {
            const employeeName = employeeCard.querySelector('.employee-name').textContent.toLowerCase();
            isMatch = employeeName.includes(value);
        } else if (type === 'branch') {
            let branch = employeeCard.querySelector('.employee-branch').textContent.toLowerCase();
            isMatch = branch.includes(value);
        }

        if (isMatch) {
            employeeCard.classList.remove('not-searched');
            employeeCard.classList.add('searched');
        } else {
            employeeCard.classList.remove('searched');
            employeeCard.classList.add('not-searched');
        }
    });
}

function showAllEmployees() {
    let employeesContainer = document.getElementById('employees-container');
    Array.from(employeesContainer.children).forEach(employeeCard => {
        employeeCard.classList.remove('not-searched', 'searched');
    });
}

async function toggleEmployeeStatus(employeeId) {

    const MODAL_TITLE = 'Cambiar estado de cuenta de empleado';
    const MODAL_MESSAGE = `¿Estás seguro que deseas cambiar el estado de la cuenta de este empleado?`;
    const MODAL_PRIMARY_BTN_TEXT = 'Estoy seguro';

    const { modalInstance, primaryBtn, secondaryBtn } = createConfirmationModal(
        MODAL_TITLE,
        MODAL_MESSAGE,
        modalTypes.DANGER,
        MODAL_PRIMARY_BTN_TEXT
    );
    modalInstance.show();

    primaryBtn.onclick = async function () {
        await changeEmployeeStatus(employeeId);
        modalInstance.hide();
        loadEmployees();

    }

    secondaryBtn.onclick = function () {
        modalInstance.hide();
    }
}

async function changeEmployeeStatus(employeeId) {
    if (employeeId !== getInstance().id) {
        if (employeeId !== undefined && employeeId) {
            try {
                let token = getInstance().token;
                let response = await axios.patch(`${API_URL}employees/${employeeId}/`, {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status < 300 && response.status > 199) {
                    showToast("Estado del empleado actualizado correctamente", toastTypes.SUCCESS);
                } else {
                    showToast("Error al actualizar el estado del empleado", toastTypes.WARNING);
                }
            } catch (error) {
                const errorMessage = error.response ? error.response.data.message : DEFAULT_ERROR_MESSAGE;
                showToast(errorMessage, toastTypes.DANGER);
                return;
            }
        }
    } else {
        showToast("No puedes desactivar tu propia cuenta", toastTypes.WARNING);
    }
}

function createEmployeeCard(employeeData) {
    const containerDiv = document.createElement('div');
    containerDiv.classList.add('card', 'employee-card', 'shadow-sm', 'mb-3', 'searched');

    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card-body');

    const flexDiv = document.createElement('div');
    flexDiv.classList.add('d-flex', 'justify-content-between', 'align-items-start');

    const infoDiv = document.createElement('div');

    const employeeName = document.createElement('h5');
    employeeName.classList.add('employee-name', 'mb-1', 'card-title');
    employeeName.textContent = employeeData.fullname;
    infoDiv.appendChild(employeeName);

    const usernameParagraph = document.createElement('p');
    usernameParagraph.classList.add('text-muted', 'mb-2');
    usernameParagraph.textContent = employeeData.username;
    infoDiv.appendChild(usernameParagraph);

    const roleParagraph = document.createElement('p');
    roleParagraph.classList.add('mb-1');
    roleParagraph.textContent = `Cargo: ${employeeData.employee.role}`;
    infoDiv.appendChild(roleParagraph);

    const hiredDateParagraph = document.createElement('p');
    hiredDateParagraph.classList.add('mb-1');
    hiredDateParagraph.textContent = `Fecha de ingreso: ${new Date(employeeData.employee.hiredDate).toLocaleDateString()}`;
    infoDiv.appendChild(hiredDateParagraph);

    let branchName = employeeData.employee.branch ? employeeData.employee.branch.name : 'Sin asignar';

    const branchNameParagraph = document.createElement('p');
    branchNameParagraph.classList.add('mb-3', 'employee-branch');
    branchNameParagraph.textContent = `Sucursal: ${branchName}`;
    infoDiv.appendChild(branchNameParagraph);

    const statusParagraph = document.createElement('p');

    const isActive = employeeData.status === 'Active';
    const statusSpan = document.createElement('span');
    statusSpan.classList.add(`status-${employeeData.status ? 'active' : 'inactive'}`, 'badge');
    statusSpan.textContent = isActive ? 'Activo' : 'Inactivo';
    statusSpan.classList.add('badge', isActive ? 'bg-success' : 'bg-danger');
    statusParagraph.appendChild(statusSpan);
    infoDiv.appendChild(statusParagraph);

    const dropdownDiv = document.createElement('div');

    const dropdownButton = document.createElement('button');
    dropdownButton.classList.add('btn', 'btn-light', 'btn-sm', 'p-1');
    dropdownButton.type = 'button';
    dropdownButton.id = `dropdownMenuButton-${employeeData._id}`;
    dropdownButton.setAttribute('data-bs-toggle', 'dropdown');
    dropdownButton.setAttribute('aria-expanded', 'false');

    const buttonIcon = document.createElement('i');
    buttonIcon.classList.add('bi', 'bi-three-dots-vertical');
    dropdownButton.appendChild(buttonIcon);

    const dropdownMenu = document.createElement('ul');
    dropdownMenu.classList.add('dropdown-menu', 'dropdown-menu-start');
    dropdownMenu.setAttribute('aria-labelledby', `dropdownMenuButton-${employeeData._id}`);

    const editLi = document.createElement('li');
    const editA = document.createElement('a');
    editA.classList.add('dropdown-item');
    editA.href = '#';
    editA.textContent = 'Editar';
    editA.onclick = () => editEmployee(employeeData._id);
    editLi.appendChild(editA);

    const toggleLi = document.createElement('li');
    const toggleA = document.createElement('a');
    toggleA.classList.add('dropdown-item');
    toggleA.href = '#';
    let status = employeeData.status === 'Active';
    toggleA.textContent = status ? 'Desactivar' : 'Activar';
    toggleA.onclick = () => toggleEmployeeStatus(employeeData._id);
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

function goToAddEmployee() {

    window.location.href = './employee-form.html';
}

function editEmployee(employeeId) {
    const params = new URLSearchParams({
        employeeId: employeeId
    });

    window.location.href = `/src/employees/employee-form.html?${params.toString()}`;
}