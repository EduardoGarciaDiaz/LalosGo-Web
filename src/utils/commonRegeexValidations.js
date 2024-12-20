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