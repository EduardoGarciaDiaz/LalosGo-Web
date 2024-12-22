const API_URL = 'http://127.0.0.1:3000/api/v1/';
const employeesContainer = document.getElementById('employees-container');

window.onload = function () {
    loadEmployees();
}

function loadEmployees() {
    clearAllEmployees();
    getAllEmployees();
}

function clearAllEmployees() {
    employeesContainer.innerHTML = '';
}

function getAllEmployees() {
    axios
        .get(`${API_URL}employees/`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
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
            console.error(error);
            showToast(error.response.data.message, toastTypes.WARNING);
        });
}

const searchInput = document.getElementById('search-input');
searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        searchEmployees(searchInput.value.trim());
    }
});

searchInput.addEventListener('input', () => {
    if (searchInput.value === '') {
        showAllEmployees();
    }
});

const searchBtn = document.getElementById('search-btn');
searchBtn.addEventListener('click', () => {
    searchEmployees(searchInput.value.trim());
});

function searchEmployees(inputValue) {
    if (inputValue !== undefined && inputValue) {
        const searchTerm = inputValue.toLowerCase();

        Array.from(employeesContainer.children).forEach(employeeCard => {
            const employeeName = employeeName.querySelector('.employee-name').textContent.toLowerCase();

            if (employeeName.includes(searchTerm)) {
                employeeCard.classList.remove('not-searched');
                employeeCard.classList.add('searched');
            } else {
                employeeCard.classList.remove('searched');
                employeeCard.classList.add('not-searched');
            }
        });
    }
}

function showAllEmployees() {
    Array.from(employeesContainer.children).forEach(employeeCard => {
        employeeCard.classList.remove('not-searched', 'searched');
    });
};

function toggleEmployeeStatus(employeeId) {
    if (employeeId !== undefined && employeeId) {
        axios
            .patch(`${API_URL}employees/${employeeId}`)
            .then((response) => {
                let updatedEmployee = response.data.employee;
                if (updatedEmployee === undefined || !updatedEmployee) {
                    showToast("Error al actualizar el estado del empleado", toastTypes.WARNING);
                    return;
                }

                showToast(response.data.message, toastTypes.SUCCESS);
                loadEmployees();
            })
            .catch((error) => {
                console.error(error);
                showToast(error.response.data.message, toastTypes.WARNING);
            });
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
    roleParagraph.classList.add('mb-1', 'strong');
    roleParagraph.textContent = `Cargo: ${data.role}`;
    infoDiv.appendChild(roleParagraph);

    const hiredDateParagraph = document.createElement('p');
    hiredDateParagraph.classList.add('mb-1');
    hiredDateParagraph.textContent = `Fecha de ingreso: '${employeeData.hiredDate}`;

    const branchNameParagraph = document.createElement('p');
    branchNameParagraph.classList.add('mb-3');

    const statusParagraph = document.createElement('p');

    const statusSpan = document.createElement('span');
    statusSpan.classList.add(`status-${employeeData.status ? 'active' : 'inactive'}`, 'badge', 'bg-primary');
    statusSpan.textContent = employeeData.status ? 'Activo' : 'Inactivo';
    statusP.appendChild(statusSpan);
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
    toggleA.textContent = employeeData.status ? 'Desactivar' : 'Activar';
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

document.getElementById('add-employee-btn').addEventListener('click', goToAddEmployee);
function goToAddEmployee() {
    // Redirect to add employee page
}