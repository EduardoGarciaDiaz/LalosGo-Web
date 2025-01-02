var productData = JSON.parse(sessionStorage.getItem('productData'));


document.addEventListener("DOMContentLoaded", async () => {
    fillProductData();
    changeButton(productData.productStatus);

})

function changeButton(status){
    if(!status){
        const button = document.getElementById("changeStatus");
        button.classList.remove("btn-danger");
        button.classList.add("btn-success");
        button.textContent = "Activar";
    } else {
        const button = document.getElementById("changeStatus");
        button.classList.remove("btn-success");
        button.classList.add("btn-danger");
        button.textContent = "Desactivar";
    }
}

function fillProductData(){
    document.getElementById("name").textContent = productData.name;
    document.getElementById("categorie").textContent = productData.category.name;
    document.getElementById("price").textContent = "$"+productData.unitPrice;
    document.getElementById("description").textContent = productData.description;
    document.getElementById("code").textContent = productData.barCode;

    const date = convertDate(productData.expireDate);
    const unitMeasure = convertUnitMeasure(productData.unitMeasure);

    document.getElementById("expiration").textContent = date;
    document.getElementById("weight").textContent = productData.weight + " " + unitMeasure.abreviatura;
    document.getElementById("measurement").textContent = unitMeasure.unidad;

    const imgElement = document.querySelector('.col-md-6 img');
    imgElement.src = productData.image;
}

function convertDate(date){
    const fecha = new Date(date);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
}

function convertUnitMeasure(unitMeasure){
    switch(unitMeasure){
        case 'Piece':
            return {unidad:'Piezas', abreviatura:'Pz'};

        case 'Kilogram':
            return {unidad:'Kilogramos', abreviatura:'Kg'};

        case 'Gram':
            return {unidad:'Gramos', abreviatura:'gr'};

        case 'Liter':
            return {unidad:'Litros', abreviatura:'L'};
        
        case 'Milliliter':
            return {unidad:'Mililitros', abreviatura:'ml'};
    
        case 'Meter':
            return {unidad:'Metros', abreviatura:'m'};
    
        case 'Centimeter':
            return {unidad:'Centímetros', abreviatura:'cm'};
    
        case 'Inch':
            return {unidad:'Pulgadas', abreviatura:'in'};

        case 'Pack':
            return {unidad:'Paquetes', abreviatura:'Pq'};
        
        case 'Box':
            return {unidad:'Cajas', abreviatura:'Cj'};

        default:
            return unitMeasure;
    }
}

async function changeProductStatus(){
    try{ 
        const status =  {newStatus: !productData.productStatus};
        await axios.patch(`${API_URL}/products/${productData._id}`, status, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        showToast("Estado del producto cambiado exitosamente", toastTypes.SUCCESS);
        changeButton(!productData.productStatus);
    }catch (error){
        handleException(error);
    }
}