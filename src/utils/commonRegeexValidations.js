function validateInputWithCommonTextReegex(input) {
    const regex = /^[a-zA-Z0-9\s.ñ,;:'_+-áéíóú]+$/;
    return regex.test(input);
}

function validateNumberWithDot(number) {
    const regex = /^\d+(\.\d{2})?$/;
    return regex.test(number);
}

function validateEntireNumber(number) {
    const regex = /^-?\d+$/;
    return regex.test(number);
}

function validateDateIsAfter14Days(fecha) {
    const enteredDate = new Date(fecha);
    const currentDate = new Date();
    const twoWeeksLater = new Date();
    twoWeeksLater.setDate(currentDate.getDate() + 14);
    return enteredDate > twoWeeksLater;
}

function numberOnly(id) {
    var element = document.getElementById(id);
    if (element) {  
        element.value = element.value.replace(/[^0-9.]/gi, "");
    } else {
        console.error(`No se encontró el elemento con id: ${id}`);
    }
}

function formatDateToISO(dateString) {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        throw new Error("Fecha no válida");
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
     const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

