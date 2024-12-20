// Array para almacenar direcciones
// Se deben recuperar de la base de datos

let addresses = [
    {
      addressId: 1,
      street: "Cuauhtla Morales #10",
      neighborhood: "Revolución",
      city: "Xalapa-Enríquez, Veracruz",
      postalCode: "91100",
      country: "México",
      contact: "Sugey Alarcón Hernández - 2282755817",
      longitude: -96.919444,
      latitude: 19.543611
    },
    {
        street: "Cuauhtla #10",
        neighborhood: "Revo",
        city: "Xalapa-Enríquez, Veracruz",
        postalCode: "91100",
        country: "México",
        contact: "Sugey Alarcón Hernández - 2282755817",
        longitude: -96.919444,
        latitude: 19.543611
    },
    {
        street: "Otra",
        neighborhood: "Revo",
        city: "Xalapa-Enríquez, Veracruz",
        postalCode: "91100",
        country: "México",
        contact: "Sugey Alarcón Hernández - 2282755817",
        longitude: -96.919444,
        latitude: 19.543611
    }
  ];

  const ADDRESS_LIMIT = 3;
  // Elemento contenedor de tarjetas
  const addressContainer = document.getElementById("addressContainer");
  
  // Renderizar direcciones iniciales
  function renderAddresses() {
    addressContainer.innerHTML = "";
    addresses.forEach((address, index) => {
      const cardHTML = `
        <div class="col-md-4">
          <div class="card shadow-sm">
            <div class="card-body">
              <h5 class="card-title fw-bold">${address.street}</h5>
              <p class="card-text">${address.neighborhood}</p>
              <p class="card-text">${address.city} ${address.postalCode}</p>
              <p class="card-text">${address.country}</p>
              <p class="card-text text-muted">${address.contact}</p>
              
              <!-- Botón de menú -->
              <div class="dropdown menu-btn">
                <button class="btn btn-light btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                  ...
                </button>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#" onclick="viewAddress(${index})">Consultar</a></li>
                  <li><a class="dropdown-item" href="#" onclick="editAddress(${index})">Editar</a></li>
                  <li><a class="dropdown-item text-danger" href="#" onclick="deleteAddress(${index})">Eliminar</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      `;
      addressContainer.insertAdjacentHTML("beforeend", cardHTML);
    });
  }
  
  // Consultar dirección
  function viewAddress(index) {
    alert(`Detalles de la dirección:\n${JSON.stringify(addresses[index], null, 2)}`);
  }
  
  // Editar dirección
  function editAddress(index) {
    const newStreet = prompt("Ingrese nueva calle:", addresses[index].street);
    if (newStreet) {
      addresses[index].street = newStreet;
      renderAddresses();
    }
  }
  
  // Eliminar dirección
  function deleteAddress(index) {
    const MODAL_TITLE = 'Eliminar dirección';
    const MODAL_MESSAGE = `¿Estás seguro que deseas eliminar la dirección?`;
    const MODAL_PRIMARY_BTN_TEXT = 'Eliminar';

    const { modalInstance, primaryBtn, secondaryBtn } = createConfirmationModal(
        MODAL_TITLE, 
        MODAL_MESSAGE, 
        modalTypes.DANGER, 
        MODAL_PRIMARY_BTN_TEXT
    );
    modalInstance.show();

    //Este método debe ser async
    primaryBtn.onclick = function() {
      //Falta método para llamar al API y que elimine la dirección
        modalInstance.hide();
        addresses.splice(index, 1);
        renderAddresses();
    }

    secondaryBtn.onclick = function() {
        modalInstance.hide();
    }    
  }
  

    document.getElementById("CreateAddressButtom").addEventListener("click", () => {
    if(addresses.length < ADDRESS_LIMIT){
      //Esta URL se debe cambiar al final por la de la página de registro de dirección
      window.location.href = "http://127.0.0.1:5500/src/RegisterDeliveryAddress/registerDeliveryAddress.html";
    } else {
      showToast("No se pueden agregar más de tres direcciones", toastTypes.DANGER);
    }
  });
  
  //Lammar para volver a cargar la pantalla 
  renderAddresses();
  