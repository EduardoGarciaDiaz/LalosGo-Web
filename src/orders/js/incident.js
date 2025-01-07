var imageData = new FormData();

window.onload = function () {

    fetch('/src/shared/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        });


    const comment = document.getElementById('comment');
    const charCount = document.getElementById('charCount');
    const cancelButton = document.getElementById('cancel-button');
    const submitButton = document.getElementById('submit-button');
    const incidentPhotoInput = document.getElementById('incidentPhotoInput');
    comment.addEventListener('input', () => {
        charCount.textContent = comment.value.length;
    });
    cancelButton.addEventListener('click', () => {
        window.location.href = '/src/orders/orders-history.html';
    });
    submitButton.addEventListener('click', () => {
        saveIncident();
    });

    incidentPhotoInput.addEventListener('change', (event) => {
        uploadImage(event);
    });
}

async function saveIncident() {
    if (!isFormValid()) {
        return;
    }
    if (!isImageValid()) {
        return;
    }

    let token = getInstance().token;

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const incidentDate = `${yyyy}-${mm}-${dd}`;
    const orderId = getOrderIdFromUrl();
    const description = document.getElementById('comment').value;

    let formData = new FormData();
    formData.append('file', imageData.get('image'));
    formData.append('orderId', orderId);
    formData.append('date', incidentDate);
    formData.append('description', description);


    try {
        let response = await axios.post(API_URL + '/incidents', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        })

        if (response.status < 300 && response.status > 199) {

            showToast('Incidente registrado exitosamente', toastTypes.SUCCESS);
            setTimeout(() => {
                window.location.href = '/src/orders/orders-history.html';
            }, 2000);
        } else {
            showToast('No se pudo registrar el incidente', toastTypes.WARNING);
        }
    } catch (error) {
        imageData = new FormData();
        handleException(error);
    }
}

function getOrderIdFromUrl() {
    let url = new URL(window.location.href);
    return url.searchParams.get('orderId');
}

function isFormValid() {
    let isValid = true;

    const comment = document.getElementById('comment');
    if (comment.value === '' || comment.value == null) {
        const commentError = document.getElementById('comment-error');
        commentError.textContent = 'Por favor ingrese un comentario';
        commentError.classList.remove('d-none');
        isValid = false;
    } else {
        const commentError = document.getElementById('comment-error');
        commentError.textContent = '';
        commentError.classList.add('d-none');
    }

    return isValid;
}

function isImageValid() {
    let isValid = true;
    if (!imageData.has('image')) {
        isValid = false;
        const imageError = document.getElementById('image-error');
        imageError.textContent = 'Por favor seleccione una imagen';
        imageError.classList.remove('d-none');
    } else {
        const imageError = document.getElementById('image-error');
        imageError.textContent = '';
        imageError.classList.add('d-none');
    }
    return isValid;
}

function uploadImage(event) {
    const incidentImg = document.getElementById('incidentPhotoPreview');
    const inputImage = document.getElementById('incidentPhotoInput');

    let file = event.target.files[0];

    if (file) {
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            const imageError = document.getElementById('image-error');
            imageError.textContent = 'El tamaño de la imagen no puede ser mayor a 10MB';
            imageError.classList.remove('d-none');
            incidentImg.src = '';
            inputImage.value = '';
            imageData = new FormData();
            return;
        } else {
            const imageError = document.getElementById('image-error');
            imageError.textContent = '';
            imageError.classList.add('d-none');
        }

        let img = new Image();
        let reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target.result;
        };

        img.onload = () => {
            incidentImg.src = img.src;
            incidentImg.style.display = 'block';
            imageData.append('image', file);
        };

        reader.readAsDataURL(file);
    }
}