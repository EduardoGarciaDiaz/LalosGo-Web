document.addEventListener("DOMContentLoaded", async() =>{
    fetch('/src/shared/footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer').innerHTML = data;
    });
})