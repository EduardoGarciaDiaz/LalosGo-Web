let role = getInstance().role;
if (role !== roles.ADMIN) {
    window.history.back();
}

const employeeRoles = {
    ADMIN: 'Administrator',
    MANAGER: 'Manager',
    SALES_EXECUTIVE: 'Sales Executive',
    DELIVERY_PERSON: 'Delivery Person'
};

document.addEventListener("DOMContentLoaded", () => {
    employeeName = document.getElementById("employee-name")
    dayOfBirth = document.getElementById("date-of-birth")
    employeePhone = document.getElementById("employee-phone")
    employeeRoleSelect = document.getElementById("employee-role")
    branchNameSelect = document.getElementById("branch")
    hireDate = document.getElementById("hire-date")
    employeeEmail = document.getElementById("employee-email")
    employeeUsername = document.getElementById("employee-username")
    employeePassword = document.getElementById("employee-password")
    employeeConfirmPassword = document.getElementById("employee-confirm-password")
    btnSave = document.getElementById("employee-save-btn")
    btnCancel = document.getElementById("employee-cancel-btn")
    pageTitle = document.getElementById("page-title")
    breadcrumbTitle = document.getElementById("breadcrumb-title")

    setBranches(branchNameSelect);
    setEmployeeRoles(employeeRoleSelect);

    employeeId = getEmployeeIdFromUrl();

    if (employeeId !== undefined && employeeId) {
        pageTitle.innerHTML = "Modificar empleado";
        breadcrumbTitle.innerHTML = "Modificar empleado";
        btnSave.addEventListener("click", () => saveEmployee(true));
    } else {
        pageTitle.innerHTML = "Nuevo empleado";
        btnSave.addEventListener("click", () => saveEmployee(false));
    }
});

function setBranches(branchNameSelect) {
    let token = getInstance().token;

    axios
        .get(`${API_URL}branches`, { headers: { 'Authorization': `Bearer ${token}` } })
        .then((response) => {
            const branches = response.data.branches;
            branches.forEach((branch) => {
                const option = document.createElement("option");
                option.value = branch._id;
                option.text = branch.name;
                branchNameSelect.appendChild(option);
            });
        })
        .catch((error) => {
            const errorMessage = error.response ? error.response.data.message : DEFAULT_ERROR_MESSAGE;
            showToast(errorMessage, toastTypes.DANGER);
        });
}

function setEmployeeRoles(employeeRoleSelect) {
    Object.values(employeeRoles).forEach((role) => {
        const option = document.createElement("option");
        option.value = role;
        option.text = role;
        employeeRoleSelect.appendChild(option);
    });
}

async function saveEmployee(isAnUpdate) {
    event.preventDefault();
    if (!checkEmptyFields()) {
        return
    }
    if (!checkFieldFormats()) {
        return
    }

    if (isAnUpdate) {
        await editEmployee()
    } else {
        await createEmployee()
    }
}

async function createEmployee() {
    let name = employeeName.value;
    let dob = dayOfBirth.value;
    let phone = employeePhone.value;
    let role = employeeRoleSelect.value;
    let branch = branchNameSelect.value;
    let hire = hireDate.value;
    let email = employeeEmail.value;
    let username = employeeUsername.value;
    let password = employeePassword.value;

    let employee = {
        role: role,
        hiredDate: hire,
        branch: branch
    }

    try {
        let token = getInstance().token;

        let response = await axios.post(API_URL + 'employees/', {
            fullname: name,
            birthdate: dob,
            phone: phone,
            email: email,
            username: username,
            password: password,
            employee: employee
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.status < 300 && response.status > 199) {
            showToast("Se ha creado exitosamente el empleado: " + response.data.username, toastTypes.SUCCESS);
            clearFields();
        } else {
            showToast(response.data.message, toastTypes.WARNING);
        }

    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : DEFAULT_ERROR_MESSAGE;
        showToast(errorMessage, toastTypes.DANGER);
        return;
    }
}

function checkEmptyFields() {
    let areValidFields = true;

    let errorEmployeeName = document.getElementById("error-employee-name");
    let errorEmployeeDateOfBirth = document.getElementById("error-date-of-birth");
    let errorEmployeePhone = document.getElementById("error-employee-phone");
    let errorEmployeeRole = document.getElementById("error-employee-role");
    let errorBranch = document.getElementById("error-branch");
    let errorHireDate = document.getElementById("error-hire-date");
    let errorEmployeeEmail = document.getElementById("error-employee-email");
    let errorEmployeeUsername = document.getElementById("error-employee-username");
    let errorEmployeePassword = document.getElementById("error-employee-password");
    let errorEmployeeConfirmPassword = document.getElementById("error-employee-confirm-password");


    if (!employeeName.value) {
        areValidFields = false;
        employeeName.classList.add("is-invalid");
        errorEmployeeName.textContent = "Este campo es obligatorio";
        errorEmployeeName.className = "text-danger";
    } else {
        errorEmployeeName.className = "d-none";
        employeeName.classList.remove("is-invalid");
    }

    if (!dayOfBirth.value) {
        areValidFields = false;
        dayOfBirth.classList.add("is-invalid");
        errorEmployeeDateOfBirth.textContent = "Este campo es obligatorio";
        errorEmployeeDateOfBirth.className = "text-danger";
    } else {
        errorEmployeeDateOfBirth.className = "d-none";
        dayOfBirth.classList.remove("is-invalid");
    }

    if (!employeePhone.value) {
        areValidFields = false;
        employeePhone.classList.add("is-invalid");
        errorEmployeePhone.textContent = "Este campo es obligatorio";
        errorEmployeePhone.className = "text-danger";
    } else {
        errorEmployeePhone.className = "d-none";
        employeePhone.classList.remove("is-invalid");
    }

    if (!employeeRoleSelect.value) {
        areValidFields = false;
        employeeRoleSelect.classList.add("is-invalid");
        errorEmployeeRole.textContent = "Este campo es obligatorio";
        errorEmployeeRole.className = "text-danger";
    } else {
        errorEmployeeRole.className = "d-none";
        employeeRoleSelect.classList.remove("is-invalid");
    }

    if (!branchNameSelect.value) {
        areValidFields = false;
        branchNameSelect.classList.add("is-invalid");
        errorBranch.textContent = "Este campo es obligatorio";
        errorBranch.className = "text-danger";
    } else {
        errorBranch.className = "d-none";
        branchNameSelect.classList.remove("is-invalid");
    }

    if (!hireDate.value) {
        areValidFields = false;
        hireDate.classList.add("is-invalid");
        errorHireDate.textContent = "Este campo es obligatorio";
        errorHireDate.className = "text-danger";
    } else {
        errorHireDate.className = "d-none";
        hireDate.classList.remove("is-invalid");
    }

    if (!employeeEmail.value) {
        areValidFields = false;
        employeeEmail.classList.add("is-invalid");
        errorEmployeeEmail.textContent = "Este campo es obligatorio";
        errorEmployeeEmail.className = "text-danger";
    } else {
        errorEmployeeEmail.className = "d-none";
        employeeEmail.classList.remove("is-invalid");
    }

    if (!employeeUsername.value) {
        areValidFields = false;
        employeeUsername.classList.add("is-invalid");
        errorEmployeeUsername.textContent = "Este campo es obligatorio";
        errorEmployeeUsername.className = "text-danger";
    } else {
        errorEmployeeUsername.className = "d-none";
        employeeUsername.classList.remove("is-invalid");
    }

    if (!employeePassword.value) {
        areValidFields = false;
        employeePassword.classList.add("is-invalid");
        errorEmployeePassword.textContent = "Este campo es obligatorio";
        errorEmployeePassword.className = "text-danger";
    } else {
        errorEmployeePassword.className = "d-none";
        employeePassword.classList.remove("is-invalid");
    }

    if (!employeeConfirmPassword.value) {
        areValidFields = false;
        employeeConfirmPassword.classList.add("is-invalid");
        errorEmployeeConfirmPassword.textContent = "Este campo es obligatorio";
        errorEmployeeConfirmPassword.className = "text-danger";
    } else {
        errorEmployeeConfirmPassword.className = "d-none";
        employeeConfirmPassword.classList.remove("is-invalid");
    }

    return areValidFields;
}

function checkFieldFormats() {
    let areValidFormats = true;
    const fullnameRegex = /^(?!\s)[A-ZÁÉÍÓÚÑ][a-záéíóúñü]+(?: [A-ZÁÉÍÓÚÑ][a-záéíóúñü]+)*$/;
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9._]{1,11}[a-zA-Z0-9]$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/;
    const phoneRegex = /^\+?[0-9]{1,3}[-. ]?\(?\d{1,4}\)?[-. ]?\d{1,4}[-. ]?\d{1,9}$/;
    const birthdateRegex = /^\d{4}-\d{2}-\d{2}$/;

    let errorEmployeeEmail = document.getElementById("error-employee-email");
    let errorEmployeePassword = document.getElementById("error-employee-password");
    let errorEmployeePhone = document.getElementById("error-employee-phone");
    let errorEmployeeDateOfBirth = document.getElementById("error-date-of-birth");
    let errorEmployeeUsername = document.getElementById("error-employee-username");
    let errorEmployeeName = document.getElementById("error-employee-name");
    let errorEmployeeConfirmPassword = document.getElementById("error-employee-confirm-password");

    if (!fullnameRegex.test(employeeName.value)) {
        areValidFormats = false;
        employeeName.classList.add("is-invalid");
        errorEmployeeName.textContent = "Nombre inválido, solo se permiten letras.";
        errorEmployeeName.className = "text-danger";
    } else {
        errorEmployeeName.className = "d-none";
        employeeName.classList.remove("is-invalid");
    }

    if (!usernameRegex.test(employeeUsername.value)) {
        areValidFormats = false;
        employeeUsername.classList.add("is-invalid");
        errorEmployeeUsername.textContent = "Solo se permiten letras, números y los caracteres especiales . y _, con un mínimo de 3 caracteres y un máximo de 15.";
        errorEmployeeUsername.className = "text-danger";
    } else {
        errorEmployeeUsername.className = "d-none";
        employeeUsername.classList.remove("is-invalid");
    }

    if (!emailRegex.test(employeeEmail.value)) {
        areValidFormats = false;
        employeeEmail.classList.add("is-invalid");
        errorEmployeeEmail.textContent = "Correo electrónico inválido";
        errorEmployeeEmail.className = "text-danger";
    } else {
        errorEmployeeEmail.className = "d-none";
        employeeEmail.classList.remove("is-invalid");
    }

    if (!passwordRegex.test(employeePassword.value)) {
        areValidFormats = false;
        employeePassword.classList.add("is-invalid");
        errorEmployeePassword.textContent = "Contraseña inválida";
        errorEmployeePassword.className = "text-danger";
    } else {
        errorEmployeePassword.className = "d-none";
        employeePassword.classList.remove("is-invalid");
    }

    if (employeePassword.value !== employeeConfirmPassword.value) {
        areValidFormats = false;
        employeeConfirmPassword.classList.add("is-invalid");
        errorEmployeeConfirmPassword.textContent = "Las contraseñas no coinciden";
        errorEmployeeConfirmPassword.className = "text-danger";
    } else {
        errorEmployeeConfirmPassword.className = "d-none";
        employeeConfirmPassword.classList.remove("is-invalid");
    }

    if (!phoneRegex.test(employeePhone.value)) {
        areValidFormats = false;
        employeePhone.classList.add("is-invalid");
        errorEmployeePhone.textContent = "Número de teléfono inválido";
        errorEmployeePhone.className = "text-danger";
    } else {
        errorEmployeePhone.className = "d-none";
        employeePhone.classList.remove("is-invalid");
    }

    if (!birthdateRegex.test(dayOfBirth.value)) {
        areValidFormats = false;
        dayOfBirth.classList.add("is-invalid");
        errorEmployeeDateOfBirth.textContent = "Fecha de nacimiento inválida";
        errorEmployeeDateOfBirth.className = "text-danger";
    } else {
        errorEmployeeDateOfBirth.className = "d-none";
        dayOfBirth.classList.remove("is-invalid");
    }

    if (!isBirthdateValid(dayOfBirth.value)) {
        areValidFormats = false;
        dayOfBirth.classList.add("is-invalid");
        errorEmployeeDateOfBirth.textContent = "El empleado debe ser mayor de edad";
        errorEmployeeDateOfBirth.className = "text-danger";
    } else {
        errorEmployeeDateOfBirth.className = "d-none";
        dayOfBirth.classList.remove("is-invalid");
    }

    return areValidFormats;
}


function isBirthdateValid(birthdate) {
    const today = new Date();
    const birthdateInput = new Date(birthdate);
    const age = today.getFullYear() - birthdateInput.getFullYear();

    const hasHadBirthdayThisYear = (
        today.getMonth() > birthdateInput.getMonth() ||
        (today.getMonth() === birthdateInput.getMonth() && today.getDate() >= birthdateInput.getDate())
    );

    const finalAge = hasHadBirthdayThisYear ? age : age - 1;

    let isValid = true;
    if (finalAge < 18) {
        isValid = false;
    }

    return isValid;
}

function clearFields() {
    employeeName.value = "";
    dayOfBirth.value = "";
    employeePhone.value = "";
    employeeRoleSelect.value = "";
    branchNameSelect.value = "";
    hireDate.value = "";
    employeeEmail.value = "";
    employeeUsername.value = "";
    employeePassword.value = "";
    employeeConfirmPassword.value = "";
}

function getEmployeeIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('employeeId');
}

function getEmployee() {
    let token = getInstance().token;

    axios
        .get(`${API_URL}employees/${employeeId}`,
            { headers: { 'Authorization': `Bearer ${token}` } }
        )
        .then((response) => {
            const employee = response.data.employee;
            fillEmployeeForm(employee);
        })
        .catch((error) => {
            const errorMessage = error.response ? error.response.data.message : DEFAULT_ERROR_MESSAGE;
            showToast(errorMessage, toastTypes.DANGER);
        });
}

function fillEmployeeForm(employee) {
    const employeeData = employee.employee;

    employeeName.value = `${employee.fullname || ""}`;
    dayOfBirth.value = `${employee.birthdate || ""}`;
    employeePhone.value = `${employee.phone || ""}`;
    employeeRoleSelect.value = `${employeeData.role || ""}`;
    branchNameSelect.value = `${employeeData.branch || ""}`;
    hireDate.value = `${employeeData.hiredDate || ""}`;
    employeeEmail.value = `${employee.email || ""}`;
    employeeUsername.value = `${employee.username || ""}`;
    employeePassword.classList.add("d-none");
    employeeConfirmPassword.classList.add("d-none");
}

async function editEmployee() {
    let name = employeeName.value
    let dob = dayOfBirth.value
    let phone = employeePhone.value
    let role = employeeRoleSelect.value
    let branch = branchNameSelect.value
    let hire = hireDate.value
    let email = employeeEmail.value
    let username = employeeUsername.value

    let data = { role: role, hiredDate: hire, branch: branch }

    try {
        let token = getInstance().token;

        let response = await axios.put(`${API_URL}employee/${employeeId}`, {
            fullname: name,
            birthdate: dob,
            phone: phone,
            email: email,
            username: username,
            employee: data
        }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.status < 300 && response.status > 199) {
            showToast("Se ha editado exitosamente el empleado", toastTypes.SUCCESS);
            clearFields();
            setTimeout(() => {
                window.location.href = "/src/employees/employees.html";
            }, 2000);
        } else {
            showToast(response.data.message, toastTypes.WARNING);
        }

    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : DEFAULT_ERROR_MESSAGE;
        showToast(errorMessage, toastTypes.DANGER);
        return;
    }

}