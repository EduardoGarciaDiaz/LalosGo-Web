const ADDRESS_LIMIT = 3;
const DELIVERY_ADDRESS_WINDOW = "/src/RegisterDeliveryAddress/registerDeliveryAddress.html";
// Elemento contenedor de tarjetas
const addressContainer = document.getElementById("addressContainer");
let USER_ID
let addresses = [];

document.addEventListener("DOMContentLoaded", async () => {
  USER_ID = getInstance().id
  await getUserAddress()
  renderAddresses()
})

async function getUserAddress() {
  try {
      const response = await axios.get(`${API_URL}users/${USER_ID}/addresses`);
      addresses = response.data.addresses;
  } catch (error) {
      handleException(error, "Error al obtener la dirección");
  }
} 

  // Renderizar direcciones iniciales
function renderAddresses() {
    addressContainer.innerHTML = "";
    addresses.forEach((address, index) => {
      const cardHTML = `
        <div class="col-md-4">
          <div class="card shadow-sm">
            <div class="card-body">
              <h5 class="card-title fw-bold">${address.street}</h5>
              <p class="card-text">${address.locality}</p>
              <p class="card-text">${address.federalEntity} ${address.zipcode}</p>
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
    sessionStorage.setItem('actionType', 'ShowDeliveryAddress');
    sessionStorage.setItem('deliveryAddressData', JSON.stringify(addresses[index]));
    window.location.href = DELIVERY_ADDRESS_WINDOW;
  }
  
  // Editar dirección
  function editAddress(index) {
    sessionStorage.setItem('actionType', 'EditDeliveryAddress');
    sessionStorage.setItem('deliveryAddressData', JSON.stringify(addresses[index]));
    window.location.href = DELIVERY_ADDRESS_WINDOW;
  }
  
  // Eliminar dirección
  function deleteAddress(index) {    
    if(addresses.length > 1) {
      let MODAL_TITLE = 'Eliminar dirección';
      let MODAL_MESSAGE = `¿Estás seguro que deseas eliminar la dirección?`;
      let MODAL_PRIMARY_BTN_TEXT = 'Eliminar';

      if(addresses[index].isCurrentAddress) {
        MODAL_TITLE = 'Eliminar dirección preferida';
        MODAL_MESSAGE = `¿Estás seguro que deseas eliminar tu dirección preferida?, se podrían perder los productos de tu carrito.`;
        MODAL_PRIMARY_BTN_TEXT = 'Eliminar';
      }

      const { modalInstance, primaryBtn, secondaryBtn } = createConfirmationModal(
        MODAL_TITLE, 
        MODAL_MESSAGE, 
        modalTypes.DANGER, 
        MODAL_PRIMARY_BTN_TEXT
      );

      modalInstance.show();
      
        primaryBtn.onclick = async function() {
        const result = await deleteAddressById(USER_ID, addresses[index]._id);
        if(result) {
          modalInstance.hide();
          addresses.splice(index, 1);
          renderAddresses();
        }
      }

      secondaryBtn.onclick = function() {
      modalInstance.hide();
      }  

    } else {
      showToast("No se puede eliminar la única dirección, debe haber al menos una dirección registrada.", toastTypes.DANGER);
    }  
  }

  function deleteAddressById(userId, addressId) {
    try {
      let token = getInstance().token;
      axios.delete(`${API_URL}/users/${userId}/addresses/${addressId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
      });
      showToast("La dirección se ha eliminado", toastTypes.SUCCESS);
      return true;
    } catch (error) {
      alert(error);
      showToast("Error al eliminar la dirección. Inténtelo más tarde", toastTypes.DANGER);
    }
  }
  

  document.getElementById("CreateAddressButtom").addEventListener("click", () => {
    if(addresses.length < ADDRESS_LIMIT){
      sessionStorage.removeItem("deliveryAddressData");
      sessionStorage.setItem('actionType', 'RegisterDeliveryAddress');
      window.location.href = DELIVERY_ADDRESS_WINDOW;
    } else {
      showToast("No se pueden agregar más de tres direcciones", toastTypes.DANGER);
    }
  });
  
  //Lammar para volver a cargar la pantalla 
  renderAddresses();
  