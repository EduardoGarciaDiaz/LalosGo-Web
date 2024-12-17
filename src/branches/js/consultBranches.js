const API_URL = 'http://127.0.0.1:3000/api/v1/'

let branchSearchBar
let branchesContainer
let _idBranch =""

document.addEventListener("DOMContentLoaded", () => {
    branchSearchBar = document.getElementById("branch-search-bar-input")
    branchesContainer = document.getElementById("branches-container")

})

window.onload = async function() {
    await loadBranches()
}

async function loadBranches() {
    axios.get(API_URL+'brnaches/',{
        params: {
            api_key: "0000" //cambiar
        },
    }).then((response) => {
        branchesContainer.innetHTML = ""
        response.data.branch.array.forEach(element => {
            const branchCard = createCard(element)
            branchesContainer.appendChild(branchCard)
        });
    }).catch((error) => {
        categoryContainer.innetHTML = '<p class="text-danger">Error al cargar las sucursales. Inténtalo más tarde.</p>'
    })
}

function createBranchCard(branch) {
    const branchCard = document.createElement("div");
    branchCard.className = "col-md-4 mb-3";

    branchCard.innerHTML = `
        <div class="card shadow-sm">
            <div class="card-body">
                <h5 class="card-title">${branch.name}</h5>
                <p class="card-text">
                    Dirección: ${branch.address.cologne} &nbsp #${branch.address.number}<br>
                    Horario: ${branch.openingTime} - ${branch.closingTime}<br>
                    Estado: ${branch.status}
                </p>
                <div class="d-flex justify-content-end position-relative">
                    <i class="bi bi-three-dots" style="cursor: pointer;"></i>
                    <!-- Menú oculto -->
                    <div class="dropdown-menu" style="display: none; position: absolute; right: 0; background-color: white; border: 1px solid #ddd; border-radius: 4px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); z-index: 1000;">
                        <a href="#" class="dropdown-item edit-option">Editar</a>
                        <a href="#" class="dropdown-item change-status-option">${branch.status === "Activo" ? "Desactivar" : "Activar"}</a>
                    </div>
                </div>
            </div>
        </div>
    `;

    const threeDotsIcon = branchCard.querySelector(".bi-three-dots");
    const dropdownMenu = branchCard.querySelector(".dropdown-menu");

    threeDotsIcon.addEventListener("click", (event) => {
        event.stopPropagation();
        const isVisible = dropdownMenu.style.display === "block";
        dropdownMenu.style.display = isVisible ? "none" : "block";
    });

    const editOption = branchCard.querySelector(".edit-option");
    const changeStatusOption = branchCard.querySelector(".change-status-option");

    editOption.addEventListener("click", () => {
        editBranch(branch);
        dropdownMenu.style.display = "none";
    });

    changeStatusOption.addEventListener("click", () => {
        toggleBranchStatus(branch);
        dropdownMenu.style.display = "none";
    });

    document.addEventListener("click", (event) => {
        if (!branchCard.contains(event.target)) {
            dropdownMenu.style.display = "none";
        }
    });   
}


