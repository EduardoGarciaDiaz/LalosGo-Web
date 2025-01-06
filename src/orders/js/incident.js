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
    comment.addEventListener('input', () => {
        charCount.textContent = comment.value.length;
    });
    cancelButton.addEventListener('click', () => {
        window.location.href = '/src/orders/orders-history.html';
    });
    submitButton.addEventListener('click', () => {
        saveIncident();
    });
}

function saveIncident() {
    console.log('Incident saved');
}